module.exports = function () {
    // /** @type {typeof import("./build_tree_farm.js")} */
    // const func = require("./build_tree_farm.js")
    // func({rows: 29, cols: 18, col_dir: bot.dir.WEST, row_dir: bot.dir.SOUTH, offset: 5, is_big: false})

    // require("./measure")()

    let pos = bot.player().getPos()
    const samples = []
    const window = 5

    while (true) {
        Client.waitTick(20)

        const new_pos = bot.player().getPos()
        const distance = bot.math.distance(pos, new_pos)
        pos = new_pos

        samples.push(distance)
        if (samples.length > window) samples.shift()

        const speed = samples.reduce((a, b) => a + b, 0) / samples.length
        bot.ui.action_bar(`Speed: ${speed.toFixed(2)} blocks/s`)
    }

}
