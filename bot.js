const { Event } = require("./lib/util")
bot_state = {
    on_repeat: new Event(),
    PLAYER: Player.getPlayer(),
    INVENTORY: Player.openInventory()
}

const { look } = require("./lib/look")
const { move } = require("./lib/move")
const { input } = require("./lib/input")
const { item } = require("./lib/item")
const { dir } = require("./lib/directions")
const { math } = require("./lib/math")
const { logger } = require("./lib/logging")
const { control } = require("./lib/control")
const { action } = require("./lib/action")
const { progress } = require("./lib/progress")
const { commands } = require("./lib/command")

const stack = []
function start(n = null, ctb = false) {
    const state = {
        n, ctb
    }
    stack.push(state)

    if (n) bot.progress.init(n)
    if (ctb !== null) state.old_ctb = bot.commands.ctb(ctb)

    if (stack.length === 1) logger.info("Started farming!");
}

function finish() {
    const state = stack.pop()

    if (state.n) bot.progress.finish()
    if (state.old_ctb) bot.commands.ctb(state.old_ctb)

    if (stack.length === 0) {
        Chat.say("/logout");
    }
}

module.exports = {
    start, finish,

    toggle_pause(new_value = !(GlobalVars.getBoolean("bot_is_paused") ?? false)) {
        GlobalVars.putBoolean("bot_is_paused", new_value)
    },

    look,
    move,
    input,
    item,
    dir,
    math,
    control,
    logger,
    action,
    progress,
    commands
}
