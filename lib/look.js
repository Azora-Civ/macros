const { move } = require("./move")
const { math } = require("./math")
const { control } = require("./control")

exports.look = {
    towards(direction, pitch) {
        bot_state.on_repeat.set("look", () => {
            bot_state.PLAYER.lookAt(direction, pitch);
        })

        control.once()
        Client.waitTick(1)
    },

    at(block) {
        bot_state.on_repeat.set("look", () => {
            bot_state.PLAYER.lookAt(block.x, block.y, block.z);
        })

        control.once()
        Client.waitTick(1)
    },

    forward() {
        bot_state.on_repeat.set("look", () => {
            if (math.length(move.target.sub(bot_state.PLAYER.getPos())) < 0.3) {
                return;
            }

            bot_state.PLAYER.lookAt(move.target.x, bot_state.PLAYER.getEyePos().y, move.target.z);
        })

        control.once()
        Client.waitTick(1)
    }
}
