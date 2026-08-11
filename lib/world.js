bot.on_repeat.set("Ensure Logged", () => {
    if (module.exports.isJoined()) return

    bot.input.unpress_all()
    module.exports.joinCiv()
    Client.waitTick(20)
    bot.control.once()
})

const civmc_ip = "Play.CivMC.net"
const grace_period = 10500

module.exports = {
    isJoined() {
        return World.isWorldLoaded()
    },

    leave(millis = grace_period) {
        if (!this.isJoined()) {
            return
        }

        if (this.isCivmc()) {
            Chat.say("/logout");
        }

        Client.waitTick(2)

        const wasd = [bot.input.FORWARD, bot.input.RIGHT, bot.input.BACKWARD, bot.input.LEFT, bot.input.SNEAK, bot.input.JUMP]

        for (let elapsed = 0; elapsed < millis; elapsed += 50) {
            if (wasd.some(key => bot.input.is_pressed(key))) {
                Chat.log("Cancelling log out...")
                return;
            }
            Client.waitTick(1)
        }

        if (this.isJoined()) {
            Client.disconnect()
        }
    },


    join(ip) {
        Client.connect(ip)
    },

    joinCiv() {
        this.join(civmc_ip)
    },

    isCivmc() {
        return  World.getWorldIdentifier() === civmc_ip
    }
}