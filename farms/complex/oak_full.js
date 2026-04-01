bot = require("../../bot.js")
module.exports = function () {
    let row_elements = 13
    let col_elements = 21
    let offset = 5
    let layers = 7

    let drops = [bot.item.of("oak_log"), bot.item.of("apple")]

    bot.start()
    bot.progress.init(row_elements * col_elements * 8)

    do_tree = dir => bot.action.complex.do_tree(dir, offset, {
        do_grow: false,
        grow_time: 0,
        do_mine: true,
        mine_time: 1650,
        do_plant: true,
        increment_progress: true
    })

    function do_row(start_dir, direction) {
        do_tree(start_dir)
        for (let i = 0; i < row_elements-1; i++) {
            do_tree(direction)
        }

        bot.look.towards(direction+140,55)
        drops.forEach(bot.item.drop_all_of)
    }


    for (let i = 0; i < layers; i++) {
        bot.action.elevator(1)
        for (let j = 0; j < col_elements; j++) {
            do_row(
                j === 0 ? bot.dir.EAST : bot.dir.NORTH,
                j%2 === 0 ? bot.dir.EAST : bot.dir.WEST,
            )
        }

        bot.action.move_mine(bot.dir.SOUTH, offset * (col_elements-1), true, 0)
        bot.action.move_mine(bot.dir.WEST, offset * row_elements, true, 0)
    }

    bot.finish()
}