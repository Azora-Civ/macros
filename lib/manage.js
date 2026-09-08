const RUNNING_KEY = `running:azora_bot`

module.exports = {
    is_already_running() {
        return GlobalVars.getBoolean(RUNNING_KEY)
    },

    kill_running() {
        Chat.log("Stopping running script");

        const current = context.getCtx().getFile().toString()

        Player.openInventory().openGui();
        Player.openInventory().close();
        JsMacros.getOpenContexts().forEach(c => {
            if (c == context.getCtx()) return;

            let is_this = c.getFile().toString() === current

            if (!is_this) return;

            c.closeContext();
        });

        bot.manage.set_is_running(false)
        bot.manage.load_commands()
    },

    load_commands() {
        JsMacros.runScript(__dirname + "/../commands/load_commands.js")
    },

    set_is_running(state) {
        if (state) {
            bot.toggle_pause(false)
        }

        GlobalVars.putBoolean(RUNNING_KEY, state)
    },
}