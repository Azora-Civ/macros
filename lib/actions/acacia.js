module.exports = function (offset = 5, axe = null, do_mine=true, do_plant=true) {
    const sapling = bot.item.of("acacia_sapling")
    const log = bot.item.of("acacia_log")
    const leaves = bot.item.of("acacia_leaves")
    const stick = bot.item.of("stick")
    axe = axe ?? bot.item.axe()
    const hoe = bot.item.of("diamond_hoe")

    const vec3 = (x,y,z) => bot.math.vec(x,y,z)

    function mine_log(target) {
        bot.item.select(hoe, 2)
        bot.action.mine_block(target, 75)

        if (bot.action.sample_block(target, log)) {
            bot.item.select(axe, 0)
            bot.action.mine_block(target, 425)
            return true
        }
        return false
    }
    function mine_logs(target) {
        while (mine_log(target)) {}
    }

    function mine_logs_all(at, target) {
        mine_logs(at(target))
        mine_logs(at(bot.math.turn(target, "right")))
        mine_logs(at(bot.math.turn(target, "back")))
        mine_logs(at(bot.math.turn(target, "left")))
    }

    return (direction) => {
        const at = (vec) => bot.dir.block_relative(direction, vec.x, vec.y, vec.z)

        // moving
        bot.item.select(axe, 0)
        bot.action.move_mine_block(direction, offset, at(vec3(0,1,offset)))

        // mining
        if (do_mine) {
            mine_logs(at(vec3(0,5,0)))

            bot.input.toggle_sneak(true)
            mine_logs_all(at, vec3(3.4, 4, 0))
            bot.input.toggle_sneak(false)

            mine_logs_all(at, vec3(2.6, 5, 0))
            mine_logs_all(at, vec3(1.5, 5.2, 0))
        }

        // planting
        if (do_plant) {
            bot.action.wait(200)
            bot.item.select(sapling, 1)
            bot.action.interact(direction, 90, 100)
            bot.move.toggle(true)
            bot.progress.increment()
        }
    }
}
