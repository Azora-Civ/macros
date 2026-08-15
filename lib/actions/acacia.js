module.exports = function (offset = 5, axe = null, only_saplings=false) {
    const sapling = bot.item.of("acacia_sapling")
    const log = bot.item.of("acacia_log")
    const leaves = bot.item.of("acacia_leaves")
    const stick = bot.item.of("stick")
    axe = axe ?? bot.item.axe()
    const hoe = bot.item.of("diamond_hoe")


    return (direction) => {
        const vec3 = (x,y,z) => bot.math.vec(x,y,z)
        const at = (vec) => bot.dir.block_relative(direction, vec.x, vec.y, vec.z)
        const queue = []
        const seen = []

        bot.item.select(axe, 0)
        bot.action.move_mine_block(direction, offset, at(vec3(0,1,offset)))

        function get_dir(vec) {
            return bot.math.normalize(vec3(vec.x, 0, vec.z))
        }
        function add_to_queue(vec, add_to_seen=true) {
            if (only_saplings) return

            const direction = get_dir(vec)

            const one_higher = vec.add(vec3(0,1,0))
            queue.push(one_higher)
            if (bot.math.equals(vec3(0,0,0), direction)) {
                print("Added as center")
                queue.push(one_higher.add(vec3(0,0,1)))
                queue.push(one_higher.add(vec3(0,0,-1)))
                queue.push(one_higher.add(vec3(1,0,0)))
                queue.push(one_higher.add(vec3(-1,0,0)))
            } else if (!seen.includes(vec.add(0,-1,0).toString())) {
                print("Added as side to: " + direction)
                queue.push(bot.math.add(one_higher, direction))
            }

            if (add_to_seen) {
                seen.push(vec.toString())
            }

            queue.sort((a,b) => a.y - b.y)
        }

        bot.move.toggle(false)

        add_to_queue(vec3(0,1,-1), false)
        add_to_queue(vec3(0,0,0))
        add_to_queue(vec3(0,1,0))

        while (queue.length > 0) {
            const pos = queue.shift()

            if (pos.y > 5) continue
            if (bot.math.length(vec3(pos.x,0,pos.z)) > 3) continue


            const direction = get_dir(pos)
            let target = bot.math.add(vec3(pos.x, pos.y, pos.z), direction.scale(-.4))
            print(target)
            target = at(target)

            if (bot.action.sample_block(target, leaves)) {
                // maybe mine leaves too and resample
                bot.item.select(hoe, 1)
                bot.action.mine_block(target, 100)
                bot.action.sample_block(target)
            }

            if (bot.item.is_holding(log)) {
                bot.item.select(axe, 0)
                bot.action.mine_block(target, 450)
                add_to_queue(pos)
            }
            bot.item.select(axe, 0)
        }

        bot.action.wait(200)
        bot.item.select(sapling, 1)
        bot.action.interact(direction, 90, 100)
        bot.move.toggle(true)
        bot.progress.increment()
    }

}
