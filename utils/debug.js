module.exports = function () {
    // /** @type {typeof import("./build_tree_farm.js")} */
    // const func = require("./build_tree_farm.js")
    // func({rows: 29, cols: 18, col_dir: bot.dir.WEST, row_dir: bot.dir.SOUTH, offset: 5, is_big: false})

    // require("./measure")()

    // take a snapshot of the inv
    // create a map of item.toString() -> [slot positions]
    const snapshot = bot.container.get_snapshot()

    // wait a bit for testing so i can reshuffle etc
    bot.toggle_pause(true)
    while (bot.is_paused()) {
        bot.ui.action_bar("waiting...")
    }

    // create maps: item -> slots
    bot.container.set_snapshot(snapshot)
}
