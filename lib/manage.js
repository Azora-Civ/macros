const RUNNING_KEY = `running:azora_bot`

module.exports = {
    is_already_running() {
        const current = context.getCtx().getFile().toString()

        return GlobalVars.getBoolean(RUNNING_KEY) && JsMacros.getOpenContexts()
            .filter(ctx => {
                const path = ctx.getFile().toString()

                return !ctx.isContextClosed() &&
                    (path === current || path.includes("commands.js"))
            })
            .length > 1
    },

    kill_running() {
        Chat.log("Stopping running script");

        const current = context.getCtx().getFile().toString()

        Player.openInventory().openGui();
        Player.openInventory().close();
        JsMacros.getOpenContexts().forEach(c => {
            if (c == context.getCtx()) return;

            let is_this = c.getFile().toString() === current

            is_this |= c.getFile().toString().includes("commands.js")

            if (!is_this) return;

            c.closeContext();
        });
    },

    load_commands() {
        const manager = JsMacros.getServiceManager();
        manager.stopService("Azora Bot")
        manager.unregisterService("Azora Bot")
        manager.registerService("Azora Bot", __dirname + "/../commands/commands.js", true)
        manager.enableService("Azora Bot")
    },

    set_is_running(state) {
        if (state) {
            bot.toggle_pause(false)
        }

        GlobalVars.putBoolean(RUNNING_KEY, state)
    }
}