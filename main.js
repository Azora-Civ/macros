bot = require("./bot.js")

function is_already_running() {
    const current = context.file

    return JsMacros.getOpenContexts()
        .filter(ctx => ctx.file === current)
        .length > 1
}

if (is_already_running()) {
    bot.toggle_pause()
} else {
    bot.toggle_pause(false)
    require("./farms/map.js")()
}
