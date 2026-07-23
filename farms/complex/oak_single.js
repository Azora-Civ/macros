module.exports = function () {
    let row_elements = 13
    let col_elements = 21
    let offset = 5
    let drops = [bot.item.of("oak_log"), bot.item.of("apple")]

    bot.start()
    bot.progress.init(row_elements * col_elements)
    let ctb = bot.commands.ctb(false)

    let do_tree = dir => bot.action.complex.do_tree(dir, offset, {
        do_grow: false,
        grow_time: 0,
        do_mine: true,
        mine_time: 1700,
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
    for (let i = 0; i < col_elements; i++) {
        do_row(
            i === 0 ? bot.dir.EAST : bot.dir.NORTH,
            i%2 === 0 ? bot.dir.EAST : bot.dir.WEST,
        )
    }
    bot.action.move_mine(bot.dir.SOUTH, offset * (col_elements-1), true, 0)
    bot.action.move_mine(bot.dir.WEST, offset * row_elements, true, 0)

    bot.commands.ctb(ctb)
    bot.progress.finish()
    bot.finish()
}