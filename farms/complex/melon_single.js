module.exports = function () {
    let row_elements = 9
    let col_elements = 65
    let drops = [bot.item.of("melon_slice"), bot.item.of("melon")]
    let tool = bot.item.of("diamond_axe")
        .with_enchant("Efficiency", 4)
        .with_enchant("silk_touch", 1)
        .with_durability(10)

    bot.start()
    bot.progress.init(row_elements * 2)

    function do_row() {
        bot.item.select(tool, 0)

        // first row
        bot.action.move_mine(bot.dir.SOUTH, col_elements)
        bot.progress.increment()

        // second row
        bot.action.move_mine(bot.dir.WEST, 1, true, 75)
        bot.action.move_mine(bot.dir.NORTH, col_elements)
        bot.progress.increment()

        // drop stuff
        bot.look.towards(bot.dir.NORTH, 0)
        drops.forEach(bot.item.drop_all_of)
    }

    for (let i = 0; i < row_elements; i++) {
        bot.action.move(bot.dir.WEST, 2)
        do_row()
        if (i !== row_elements-1)
            bot.action.move(bot.dir.WEST, 2)
    }
    bot.action.move(bot.dir.EAST, 5*row_elements - 2)

    bot.finish()
}