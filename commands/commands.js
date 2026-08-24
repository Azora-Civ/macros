debug = true // global expected by the bot
bot = require("../bot.js")

const cmds = Chat.getCommandManager()
cmds.unregisterCommand("bot")

function builder(name) {
    const parts = name.split(" ")
    let builder = cmds.createCommandBuilder("bot")
    for (const part of parts) {
        builder = builder.literalArg(part)
    }
    return builder
}

const targets = [
    "./auto_mine.js",
    "./level_up.js",
    "./layered.js",
]

for (const target of targets) {
    const cmd = require(target)

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

                bot.manage.set_is_running(true)
                try {
                    cmd.run(arg)
                } finally {
                    bot.manage.set_is_running(false)
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
        bot.logger.info("These are commands of Azora Macros. Use /bot help <cmd> to check what that specific command does.")
    }))
    .register()
