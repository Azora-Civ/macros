module.exports = {
    towards(direction, pitch) {
        bot.on_repeat.set("look", () => {
            bot.PLAYER.lookAt(direction, pitch);
        })

        bot.control.once()
        Client.waitTick(1)
    },

    at(block) {
        bot.on_repeat.set("look", () => {
            bot.PLAYER.lookAt(block.x, block.y, block.z);
        })

        bot.control.once()
        Client.waitTick(1)
    },

    forward() {
        bot.on_repeat.set("look", () => {
            if (bot.math.length(bot.move.target.sub(bot.PLAYER.getPos())) < 0.3) {
                return;
            }

            bot.PLAYER.lookAt(bot.move.target.x, bot.PLAYER.getEyePos().y, bot.move.target.z);
        })

        bot.control.once()
        Client.waitTick(1)
    },

    lock() {
        const player = bot.player()
        const pitch = player.getPitch()
        const yaw = player.getYaw()

        bot.look.towards(yaw, pitch)
    },

    unset() {
        bot.on_repeat.set("look", () => {})
    },
}
