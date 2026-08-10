bot.on_repeat.set("Paused Check", (iter) => {
    if (iter % 20 !== 0) {
        return
    }

    if (GlobalVars.getBoolean("bot_is_paused") ?? false) {
        throw new Error("Halting...")
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
        try {
            fn()
        } catch (e) {
            bot.input.unpress_all()
            bot.toggle_pause(true)

            if (e.message === "Halting...") {
                bot.logger.info("Pausing...")
            } else {
                bot.logger.alert(e)
                bot.logger.info(e.stack)
                Chat.say("/logout")
            }

            bot.logger.info("Restart by running the script again (pos: " + bot.PLAYER.getPos() + ")")
            while (GlobalVars.getBoolean("bot_is_paused") ?? false) {
                Time.sleep(100)
            }

            bot.logger.info("Restarting...")
            bot.PLAYER = Player.getPlayer()
            bot.INVENTORY = Player.openInventory()
            Time.sleep(1000)
            this.safe(fn)
        }
    }
}
