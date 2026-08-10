bot = require("./bot.js")

const HOLD_TIME_MILLIS = 1000

function is_already_running() {
    const current = context.getCtx().getFile().toString()

    Chat.log(JsMacros.getOpenContexts()
        .filter(ctx => ctx.getFile().toString() === current && !ctx.isContextClosed())
        .length > 1)

    return JsMacros.getOpenContexts()
        .filter(ctx => ctx.getFile().toString() === current && !ctx.isContextClosed())
        .length > 1
}

function is_holding() {
    const key = event.key

    let held_time = 0;

    while (held_time < HOLD_TIME_MILLIS) {
        const is_pressed = bot.input.is_pressed(key)
        if (!is_pressed) return false

        Client.waitTick(2)
        held_time += 100
    }

    return true
}

function kill_running() {
    Chat.log("Stopping running script");


    const current = context.getCtx().getFile().toString()

    Player.openInventory().openGui();
    Player.openInventory().close();
    JsMacros.getOpenContexts().forEach(c => {
        if (c == context.getCtx()) return;
        if (c.getFile().toString() !== current) return;

        c.closeContext();
    });
}

if (is_holding()) {
    kill_running()
    return
}

if (is_already_running()) {
    bot.toggle_pause()
    return
}

bot.toggle_pause(false)
require("./map.js")()
