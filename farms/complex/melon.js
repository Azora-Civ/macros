const bot = require("../../bot");
module.exports = function () {
    let row_elements = 9
    let col_elements = 65
    let drops = [bot.item.of("melon_slice"), bot.item.of("melon")]
    let tool = bot.item.of("diamond_axe")
        .with_enchant("Efficiency", 5)
        .with_enchant("silk_touch", 1)
        .with_durability(10)

    bot.start()
    bot.progress.init(row_elements * 2)

    function do_row() {
        bot.item.select(tool, 0)

        bot.action.center()
        bot.action.move(bot.dir.EAST, 0.2, false);

        // hit both rows
        bot.look.towards(bot.dir.SOUTHWEST, 60)
        bot.input.add(bot.input.ATTACK)
        bot.action.move(bot.dir.SOUTH, col_elements, false)
        bot.input.remove(bot.input.ATTACK)
        bot.progress.increment()

        // walk back
        bot.action.move(bot.dir.WEST, 0.7, false);
        bot.look.forward()
        bot.action.move(bot.dir.NORTH, col_elements, false);
        bot.action.move(bot.dir.WEST, 0.5, true);
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

    bot.progress.finish()
    bot.finish()
}