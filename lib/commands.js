let ctb_state = null
let ctf_mat = null

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

    ctf(material = bot.item.of("stone")) {
        ctf_mat = material

        if (!bot.world.is_civmc()) return true

        bot.item.select(material,0)
        const [from, to] = ctf()

        if (from === null && to === null) {
            return
        }

        if (from !== null && from[0].name === material.name && from[1] === "AzoraFarms") {
            ctf()
        }
    }
}

function ctf() {
    const filter = JavaWrapper.methodToJava(event => {
        const text = event.text.getString()
        return text.startsWith("Switched Citadel mode") || text.startsWith("You are still in")
    })

    const response = bot.commands.run("ctf AzoraFarms", filter)

    if (response.includes("You are still in Normal mode")) {
        return [null, null]
    }

    const [, to, from] = response.match(
        /^Switched Citadel mode to (.+?) from (.+)$/
    )

    return [parse_citadel_mode(from), parse_citadel_mode(to)]
}

function parse_citadel_mode(text) {
    if (text === "Normal mode") return null

    const match = text.match(
        /^Fortifying mode with (.+?) on (.+)$/
    )

    if (!match) throw new Error(`Unknown Citadel mode: ${text}`)

    const [, material, group] = match
    return [bot.item.of(material.toLowerCase()), group]
}