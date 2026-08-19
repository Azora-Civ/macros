let ctb_state = null

bot.on_repeat.set("commands", () => {

})

module.exports = {
    run(command, filter = null) {
        const eventContext = JsMacros.waitForEvent("RecvMessage", filter, JavaWrapper.methodToJava(() => {
            Chat.say(`/${command}`)
        }));
        eventContext.context.releaseLock();

        if (!eventContext) {
            throw new Error(`No matching response to /${command}`)
        }

        return eventContext.event.text.getString()
    },

    ctb(desiredState) {
        if(desiredState===null) {
            ctb_state = null
            return null
        }

        if (!bot.world.is_civmc()) return true

        const filter = JavaWrapper.methodToJava(event => {
            const text = event.text.getString()
            return text.startsWith("Bypass mode")
        })

        let oldState = ctb_state
        if (ctb_state === null) {
            let response = this.run("ctb", filter)

            oldState = response === "Bypass mode has been disabled."
            ctb_state = !oldState
        }

        if (ctb_state !== desiredState) {
            this.run("ctb", filter)
        }

        return oldState
    },

    ctf(material = bot.item.of("stone"), group = "AzoraFarms") {
        if (!bot.world.is_civmc()) return

        const current_state = get_ctf_state()

        if (current_state && current_state[0].toString() === material.toString() && current_state[1] === group)
            return

        bot.item.select(material,0)
        bot.action.wait(250)

        const filter = JavaWrapper.methodToJava(event => {
            const text = event.text.getString()
            return text.startsWith("Switched Citadel mode") || text.startsWith("You are still in")
        })

        bot.commands.run("ctf " + group, filter)
    },

    cti(desired_state=true) {
        const state_now = get_cti_state()
        if (desired_state === state_now) return

        const filter = JavaWrapper.methodToJava(event => {
            const text = event.text.getString()
            return text.startsWith("Toggled reinforcement information mode")
        })
        bot.commands.run("cti", filter)
    }
}

function get_ctf_state() {
    const regex = /^CTF (\S+) (\S+)$/
    const lines = bot.ui.get_scoreboard().filter(x => regex.test(x))

    if (lines.length > 0) {
        const match = lines[0].match(regex)
        const [, group, material] = match

        const map = {
            "Stone": bot.item.of("stone"),
            "Iron": bot.item.of("iron_ingot"),
            "Diamond": bot.item.of("diamond"),
        }


        return [map[material] ?? bot.item.of("stone"), group]
    }

    return null
}

function get_cti_state() {
    const regex = /^CTI$/
    return bot.ui.get_scoreboard().some(x => regex.test(x))
}
