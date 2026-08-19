const pause_text = "§6PAUSED"

bot.on_repeat.set("Paused Check", (iter) => {
    if (iter % 20 !== 0) {
        return
    }

    if (GlobalVars.getBoolean("bot_is_paused") ?? false) {
        throw new Error(pause_text)
    }
})

module.exports = {
     loop(while_condition) {
        let iter = 0;
        while (while_condition(iter)) {
            Time.sleep(1)
            this.safe(() => bot.on_repeat.emit(iter))
            iter++;
        }
    },

    once() {
        this.safe(() => bot.on_repeat.emit(0))
    },

    safe(fn) {
        while (!_safe(fn)) { // force try it
            _safe(() => bot.on_repeat.emit(0))
        }
    }
}

function _safe(fn) {
    try {
        fn()
        return true
    } catch (e) {
        bot.input.unpress_all()
        bot.toggle_pause(true)

        const start_pos = bot.math.floor(bot.PLAYER.getPos())

        function action_bar() {
            const player = Player.getPlayer()
            if (!player) return
            const pos = bot.math.floor(player.getPos())
            const color = bot.math.equals(pos, start_pos) ? "§a" : ""

            let msg = `§4${e.message}§r - Continue at ${color}[${start_pos.x}, ${start_pos.y}, ${start_pos.z}]`
            bot.ui.action_bar(msg)
        }

        action_bar()
        if (e.message !== pause_text) {
            World.playSound("entity.generic.explode")
            if (debug){
                bot.logger.info(e)
            }

            bot.world.leave(() => bot.logger.alert(e.message))
        }

        while (bot.is_paused()) {
            action_bar()
            Time.sleep(100)
        }

        bot.PLAYER = Player.getPlayer()
        bot.INVENTORY = Player.openInventory()
        for (let i = 0; i < 10; i++) {
            bot.ui.action_bar("§qRestarting...")
            Time.sleep(100)
        }

        return false
    }
}
