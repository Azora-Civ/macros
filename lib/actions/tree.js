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

    if (do_mine) {
        bot.item.select(tool, 0)

        let target = bot.move.target.add(bot.dir.to_vec(direction).multiply(distance,distance,distance))
        target = bot.math.centralize(target)
        target.y = bot.player().getPos().y + 1

        bot.action.move_mine_block(direction, distance, target)

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
