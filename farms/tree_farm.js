module.exports = function (
    row_dir=bot.dir.NORTH,
    col_dir=bot.dir.WEST,
    rows=10,
    cols=10,
    offset=5,
    do_mine=true,
    mine_time = 2000,
    do_plant=true,
    wood="oak"
) {
    const log = bot.item.of(wood+"_log")
    const leaves = bot.item.of(wood+"_leaves")
    const stick = bot.item.of("stick")
    const apple = bot.item.of("apple")
    const drops = [stick, apple]

    const reverse_row_dir = bot.dir.turn_back(row_dir)
    const reverse_col_dir = bot.dir.turn_back(col_dir)

    let do_tree = dir => bot.action.complex.do_tree(dir, offset, {
        do_mine: do_mine,
        mine_time: mine_time,
        do_plant: do_plant,
        increment_progress: true,
        tool: bot.item.axe(),
        wood: wood
    })

    if (wood === "acacia") {
        do_tree = bot.action.complex.do_acacia_tree(
            offset, bot.item.axe(), do_mine, do_plant
        )
    }

    function do_row(initial_dir, dir, is_last=false) {
        do_tree(initial_dir)
        for (let i = 0; i < cols-1; i++) {
            do_tree(dir)
        }

        // drop all
        bot.look.towards(bot.dir.turn_back(dir)-15, 0)
        drops.forEach(bot.item.drop_all_of)
        if (!is_last) {
            bot.item.drop_most_of(leaves)
            bot.item.drop_most_of(log)
        } else {
            bot.item.drop_most_of(leaves)
            bot.item.drop_all_of(log)
        }
    }

    bot.start(rows * cols, false)

    for (let i = 0; i < rows; i++) {
        const initial_dir = i === 0 ? row_dir : col_dir
        const dir = i % 2 === 0 ? row_dir : reverse_row_dir
        const is_last = i === (rows-1)

        do_row(initial_dir, dir, is_last)
    }

    bot.action.move_mine(reverse_col_dir, offset*(rows-1), true, 0)
    bot.action.move_mine(reverse_row_dir, (rows % 2 === 0 ? 1 : cols) * offset, true, 0)

    bot.finish()
}


