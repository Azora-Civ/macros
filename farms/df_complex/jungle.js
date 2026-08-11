module.exports = function () {
    let rows = 10
    let cols = 13
    let offset = 5
    let drops = [bot.item.of("jungle_log"), bot.item.of("jungle_leaves")]

    bot.start(cols * rows, false)

    let do_tree = dir => bot.action.complex.do_tree(dir, offset, {
        do_grow: false,
        grow_time: 1000,
        do_mine: true,
        mine_time: 2400,
        do_plant: true,
        increment_progress: true,
        sapling: bot.item.of("jungle_sapling")
    })

    function do_row(start_dir, direction) {
        do_tree(start_dir)
        for (let i = 0; i < cols-1; i++) {
            do_tree(direction)
        }

        bot.look.towards(direction+160,55)
        drops.forEach(bot.item.drop_all_of)
    }
    for (let i = 0; i < rows; i++) {
        do_row(
            i === 0 ? bot.dir.NORTH : bot.dir.EAST,
            i%2 === 0 ? bot.dir.NORTH : bot.dir.SOUTH,
        )
    }
    bot.action.move_mine(bot.dir.WEST, offset * (rows-1), true, 0)
    bot.action.move_mine(bot.dir.SOUTH, offset, true, 0)

    bot.finish()
}