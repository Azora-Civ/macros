bot = require("./bot.js")

function is_already_running() {
    const current = context.file

    return JsMacros.getOpenContexts()
        .filter(ctx => ctx.file === current)
        .length > 1
}

if (is_already_running()) {
    bot.toggle_paused()
} else {
    bot.toggle_paused(false)
    require("./farms/map.js")()
}
