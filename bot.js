const { Event } = require("./lib/util")
bot_state = {
    on_repeat: new Event(),
    user,
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

let farm_depth = 0

function start() {
    farm_depth++;
    if (farm_depth === 1) logger.info("Started farming!");
}

function finish() {
    farm_depth--;
    if (farm_depth === 0) {
        logger.alert("Finished farming!");
        Chat.say("/logout");
    }
}

module.exports = {
    start, finish,

    toggle_paused(new_value = !(GlobalVars.getBoolean("bot_is_paused") ?? false)) {
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
    progress
}
