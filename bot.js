const { Event } = require("./lib/util")

/**
 * @typedef {Object} Bot
 * @property {typeof import("./lib/look")} look
 * @property {typeof import("./lib/move")} move
 * @property {typeof import("./lib/input")} input
 * @property {typeof import("./lib/item")} item
 * @property {typeof import("./lib/dir")} dir
 * @property {typeof import("./lib/math")} math
 * @property {typeof import("./lib/logger")} logger
 * @property {typeof import("./lib/control")} control
 * @property {typeof import("./lib/action")} action
 * @property {typeof import("./lib/progress")} progress
 * @property {typeof import("./lib/commands")} commands
 * @property {typeof import("./lib/check")} check
 * @property {typeof import("./lib/world")} world
 * @property {typeof import("./lib/ui")} ui
 */

let player = Player.getPlayer()
let inv = Player.openInventory()

const base = {
    start, finish,

    toggle_pause(new_value = !(GlobalVars.getBoolean("bot_is_paused") ?? false)) {
        GlobalVars.putBoolean("bot_is_paused", new_value)
    },

    is_paused() {
        return GlobalVars.getBoolean("bot_is_paused") ?? false
    },

    on_repeat: new Event(),
    PLAYER: Player.getPlayer(),
    INVENTORY: Player.openInventory(),

    player() {
        player = Player.getPlayer() ?? player
        return player
    },

    inv() {
        inv = Player.openInventory() ?? inv
        return inv
    }
}

/** @type {Bot & typeof base} */
bot = base

const libs = [
    "dir",
    "math",
    "look",
    "move",
    "input",
    "item",
    "logger",
    "control",
    "action",
    "progress",
    "commands",
    "check",
    "world",
    "ui"
]

for (const lib of libs) {
    bot[lib] = require(`./lib/${lib}.js`)
}

const stack = []
function start(n = null, ctb = false) {
    const state = {
        n, ctb
    }
    stack.push(state)

    if (n) bot.progress.init(n)
    if (ctb !== null) state.old_ctb = bot.commands.ctb(ctb)
    bot.check.healthy()

    if (stack.length === 1) bot.logger.info("Script started!");
}

function finish(do_logout=true) {
    const state = stack.pop()

    if (state.n) bot.progress.finish()
    if (state.old_ctb) bot.commands.ctb(true)

    if (stack.length === 0 && do_logout) {
        bot.world.leave()
    }
}

module.exports = bot
