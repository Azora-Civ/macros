bot.on_repeat.set("Ensure Logged", () => {
    if (module.exports.isJoined()) return

    throw new Error("Unexpectedly logged out")
})

const civmc_ip = "Play.CivMC.net"
const GRACE_PERIOD = 10500
const REASON_TIMING = 8000

module.exports = {
    isJoined() {
        return World.isWorldLoaded()
    },

    leave(before_leave_callback = null) {
        if (!this.isJoined() ) {
            return
        }

        if (this.is_civmc()) {
            Chat.say("/logout")
        }

        JavaWrapper.methodToJavaAsync(() => {
            Client.waitTick(2)

            const wasd = [
                bot.input.FORWARD,
                bot.input.RIGHT,
                bot.input.BACKWARD,
                bot.input.LEFT,
                bot.input.SNEAK,
                bot.input.JUMP,
            ]

            const start = Time.time()

            while (Time.time() - start < GRACE_PERIOD) {
                const elapsed = Time.time() - start

                if (before_leave_callback && elapsed > REASON_TIMING) {
                    before_leave_callback()
                    before_leave_callback = null
                }

                if (wasd.some(key => bot.input.is_pressed(key))) {
                    Chat.log("Cancelling log out...")
                    return
                }

                Client.waitTick(1)
            }

            if (this.isJoined()) {
                Client.disconnect()
            }
        }).run()
    },


    join(ip) {
        Client.connect(ip)
    },

    join_civ() {
        this.join(civmc_ip)
    },

    is_civmc() {
        return  World.getWorldIdentifier() === civmc_ip
    },

    is_private() {
        return World.getCurrentServerAddress().startsWith("local:")
    },

    last_hit_block() {
        function findLocation(component) {
            if (!component || typeof component !== "object")
                return null

            if (component.hover_event) {
                const text = JSON.stringify(component.hover_event)
                const match = text.match(/Location:\s*(-?\d+)\s+(-?\d+)\s+(-?\d+)/)

                if (match)
                    return match.slice(1).map(Number)
            }

            for (const child of component.extra ?? []) {
                const result = findLocation(child)
                if (result) return result
            }

            return null
        }

        for (const argument of Chat.getHistory().getRecvLines()) {
            let json = argument.getText().getJson()
            json = JSON.parse(json)

            const location = findLocation(json)

            if (location) {
                return bot.math.vec(location[0], location[1], location[2])
            }
        }
    }
}

