
JsMacros.assertEvent(event, "Service")

debug = false // global expected by the bot
do_discord_pings = true
GlobalVars.putBoolean("commands_quit", false)

const cmd_manager = Chat.getCommandManager()
cmd_manager.unregisterCommand("bot")

const cmds = [
    require("./auto_mine.js"),
    require("./level_up.js"),
    require("./layered.js"),
    require("./ice_road.js"),
    require("./debug/speedometer"),
    require("./debug/measure"),
    require("./debug/copy_pos"),
    require("./mass_enchant"),
]

const root = cmd_manager.createCommandBuilder("bot")

function builder(name) {
    for (const part of name.split(" ")) {
        root.literalArg(part)
    }
    return root
}

for (const cmd of cmds) {
    cmd.register(
        (args = null) => {
            let registrant = builder(cmd.name)
            if (args) registrant = args(registrant)

            registrant.executes(JavaWrapper.methodToJavaAsync(ctx => {
                const arg = (name, fallback = null) => {
                    try {
                        return ctx.getArg(name)
                    } catch {
                        return fallback
                    }
                }

                globalThis.bot = require("../bot.js")

                bot.manage.set_is_running(true)
                try {
                    cmd.run(arg)
                } finally {
                    bot.manage.set_is_running(false)
                    bot.manage.load_commands(true) // reload this so 'bot' is clean again
                }
            })).or(1)
        }
    )

    builder("help " + cmd.name)
        .executes(JavaWrapper.methodToJava(ctx => {
            Chat.log(cmd.help)
        }))
        .or(1)
}

builder("help")
    .executes(JavaWrapper.methodToJava(ctx => {
        Chat.log("These are commands of Azora Macros. Use /bot help <cmd> to check what that specific command does.")
    }))
    .or(1)

// Register the complete command tree once
root.register()

event.stopListener = JavaWrapper.methodToJava(() => {
    cmd_manager.unregisterCommand("bot")
})
