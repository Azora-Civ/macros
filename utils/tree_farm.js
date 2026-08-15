module.exports = function (row_dir=bot.dir.NORTH, col_dir=bot.dir.WEST, rows=10, cols=10, offset=5, mine_time=1800, wood="oak") {
    const sapling = bot.item.of(wood+"_sapling")
    const log = bot.item.of(wood+"_log")
    const leaves = bot.item.of(wood+"_leaves")
    const stick = bot.item.of("stick")
    const apple = bot.item.of("apple")
    const drops = [log, leaves, stick, apple]

    const reverse_row_dir = bot.dir.turn_back(row_dir)
    const reverse_col_dir = bot.dir.turn_back(col_dir)

    let do_tree = dir => bot.action.complex.do_tree(dir, offset, {
        do_grow: false,
        grow_time: 0,
        do_mine: true,
        mine_time: mine_time,
        do_plant: true,
        increment_progress: true,
        tool: bot.item.axe(),
        sapling: sapling
    })

    if (wood === "acacia") {
        do_tree = bot.action.complex.do_acacia_tree(
            offset, bot.item.axe(), mine_time < 200
        )
    }

    function do_row(initial_dir, dir) {
        do_tree(initial_dir)
        for (let i = 0; i < cols-1; i++) {
            do_tree(dir)
        }

        // drop all
        bot.look.towards(bot.dir.turn_back(dir)-15, 0)
        drops.forEach(bot.item.drop_all_of)
    }


    bot.start(rows * cols, false)

    for (let i = 0; i < rows; i++) {
        const initial_dir = i === 0 ? row_dir : col_dir
        const dir = i % 2 === 0 ? row_dir : reverse_row_dir

        do_row(initial_dir, dir)
    }

    bot.action.move_mine(reverse_col_dir, offset*(rows-1), true, 0)
    bot.action.move_mine(reverse_row_dir, (rows % 2 === 0 ? 1 : cols) * offset, true, 0)

    bot.finish()
}


