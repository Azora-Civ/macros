const bot = require("../../bot");

function do_tree(direction, distance, {
    do_grow = false,
    grow_time = 1000,
    do_mine = true,
    mine_time = 2000,
    do_plant = true,
    sapling = null,
    tool = null,
    increment_progress=true}) {

    const bot = require("../../bot")

    const stick = bot.item.of("stick")
    if (tool === null) {
        tool = bot.item.of("diamond_axe").with_enchant("Efficiency", 5).with_durability(10)
    }
    if (sapling === null) {
        sapling = bot.item.of("oak_sapling")
    }


    if (do_grow) {
        let walk_dist = Math.max(distance-4, 0)
        bot.item.select(tool, 0)
        bot.action.move_mine(direction, walk_dist, true, 0)
        bot.action.mine(direction, 0, 500)

        bot.item.select(stick, 2)
        bot.action.interact(direction, 18, grow_time)
        distance -= walk_dist
    }

    if (do_mine) {
        let pos = bot.dir.to_vec(direction).scale(distance)
        pos = bot.move.target.add(pos)
        pos = bot.math.centralize(pos)
        pos.y = bot_state.PLAYER.getPos().y + 1
        bot.item.select(tool, 0)
        bot.look.at(pos)
        bot.input.add(bot.input.ATTACK)
        bot.action.move(direction, distance)
        bot.input.remove(bot.input.ATTACK)

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

module.exports = do_tree
