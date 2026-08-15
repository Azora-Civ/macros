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

    leave(reason = null) {
        if (!this.isJoined() || this.is_private()) {
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

                if (reason && elapsed > REASON_TIMING) {
                    bot.logger.alert(reason)
                    reason = null
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
    }
}