module.exports = function (direction, distance, {
    do_mine = true,
    mine_time = 2000,
    do_plant = true,
    sapling = null,
    log = null,
    wood = "oak",
    tool = null,
    increment_progress=true,
}) {

    if (tool    === null) tool = bot.item.axe()
    if (sapling === null) sapling = bot.item.of(wood + "_sapling")
    if (log     === null) log = bot.item.of(wood + "_log")

    if (wood) {
        const leaves = bot.item.of(wood+"_leaves")
        if (bot.item.count(leaves) <= 0) {
            bot.logger.info(`§e Having ${leaves.toString()} in your inventory speeds things up!`)
        }
    }

    if (do_mine) {
        bot.item.select(tool, 0)
        bot.action.move_mine_block(direction, distance, bot.dir.block_relative(direction, 0, 1, distance))

        bot.control.loop(() => bot.item.count(log) === 0, {timeout:500, interval:25})

        bot.action.mine(direction, -88, mine_time)

        distance = 0
    }

    if (do_plant) {
        bot.action.move_mine(direction, distance, true, 0)
        bot.item.select(sapling, 1)
        bot.action.interact(direction, 90, 200)
    }

    if (increment_progress) {
        bot.progress.increment()
    }
}
