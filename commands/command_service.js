debug = false // global expected by the bot
do_discord_pings = true;

const cmd_manager = Chat.getCommandManager()
cmd_manager.unregisterCommand("bot")

function builder(name) {
    const parts = name.split(" ")
    let builder = cmd_manager.createCommandBuilder("bot")
    for (const part of parts) {
        builder = builder.literalArg(part)
    }
    return builder
}


const cmds = [
    require("./auto_mine.js"),
    require("./level_up.js"),
    require("./layered.js"),
    require("./ice_road.js"),
    require("./debug/speedometer"),
    require("./debug/measure"),
    require("./debug/copy_pos"),
]

for (const cmd of cmds) {
    cmd.register(
        (args=null) => {
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
                bot = require("../bot.js")
                bot.manage.set_is_running(true)
                try {
                    cmd.run(arg)
                } finally {
                    bot.manage.set_is_running(false)
                    bot.manage.load_commands(true) // reload this so 'bot' is clean again
                }
            })).register()
        }
    )

    builder("help " + cmd.name)
        .executes(JavaWrapper.methodToJava(ctx => {
            Chat.log(cmd.help)
        }))
        .register()
}

builder("help")
    .executes(JavaWrapper.methodToJava(ctx => {
        Chat.log("These are commands of Azora Macros. Use /bot help <cmd> to check what that specific command does.")
    }))
    .register()
