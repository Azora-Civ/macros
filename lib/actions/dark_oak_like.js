const REACH = 5
let time_per_log = 475

module.exports = function ({
    tool = bot.item.of("diamond_axe").with_enchant("Efficiency", 5).with_durability(10),
    wood = bot.item.of("dark_oak_log"),
    sapling = bot.item.of("dark_oak_sapling"),
    increment = true
}) {
    let height, self_height
    const vec3 = bot.math.vec
    let at = () => {}

    function sample(pos) {
        return bot.action.sample_block(pos, wood)
    }

    function mine_if_wood(pos, millis) {
        if (!sample(pos)) {
            return false
        }

        bot.item.select(tool, 0)
        bot.action.mine_block(pos, millis)
        return true
    }

    function mine_stem_straight() {
        height = 2
        let fr = true, fl = true, br = true, bl = true
        while (fr && fl && br && bl) {
            let h_diff = height - self_height
            if (h_diff > REACH) {
                bot.action.pillar_up(1, wood, 2)
                self_height++
                h_diff--
            }

            bot.item.select(tool, 0)
            br = mine_if_wood(at(-0, h_diff, 0), time_per_log)
            fl = mine_if_wood(at(-.6, h_diff, .6), time_per_log)

            if (br && fl) {
                bot.item.select(tool, 0)
                bot.action.mine_block(at(-.6, h_diff, 0), time_per_log)
                bot.action.mine_block(at(0, h_diff, .6), time_per_log)
            } else {
                bl = mine_if_wood(at(-.6, h_diff, 0), time_per_log)
                fr = mine_if_wood(at(0, h_diff, .6), time_per_log)
            }
            height++
        }
        height--

        return [fr, fl, br, bl]
    }

    function mine_stem_shear(corners) {
        const [fr, fl, br, bl] = corners

        const queue = []
        const visited = []
        let shear_dir
        if (fr && br) {
            shear_dir = vec3(1, 0, 0)
        } else if (fl && bl) {
            shear_dir = vec3(-1, 0, 0)
        } else if (fr && fl) {
            shear_dir = vec3(0, 0, 1)
        } else if (br && bl) {
            shear_dir = vec3(0, 0, -1)
        } else {
            bot.logger.info("Failed a tree. Continuing...")
            return false
        }

        function add_to_queue(pos, side = false) {
            if (!side) queue.push(pos.add(shear_dir))
            queue.push(pos.add(vec3(0,1,0)))

            const key = pos.x + "-" + pos.y + "-" + pos.z
            visited.push(key)
        }

        if (br) add_to_queue(vec3(0, height, 0))
        if (fr) add_to_queue(vec3(0, height, 1))
        if (bl) add_to_queue(vec3(-1, height, 0))
        if (fl) add_to_queue(vec3(-1, height, 1))
        const adjust = height - self_height - 3
        bot.action.pillar_up(adjust, wood, 2)
        self_height += adjust
        for (let i = 0; i < queue.length; i += 2) {
            let pos = queue[i]
            bot.item.select(tool, 0)
            if (mine_if_wood(at(pos.x, pos.y - 1 - self_height, pos.z), 2*time_per_log)) {
                mine_if_wood(at(pos.x, pos.y - 3 - self_height, pos.z), 2*time_per_log)
            }
        }
        while (queue.length > 0) {
            let pos = queue.shift()

            const key = pos.x + "-" + pos.y + "-" + pos.z
            if (visited.includes(key)) continue

            let target_pos = vec3(pos.x, pos.y - self_height, pos.z)

            if (target_pos.x !== 0 && target_pos.z !== 0) {
                if (shear_dir.x === 0) {
                    target_pos.x -= Math.sign(target_pos.x) * .4
                } else {
                    target_pos.z -= Math.sign(target_pos.z) * .4
                }
            }

            const side_key = (pos.x - shear_dir.x) + "-" + pos.y + "-" + (pos.z - shear_dir.z)
            const bottom_key = pos.x + "-" + (pos.y - 1) + "-" + pos.z
            if (visited.includes(side_key) || !visited.includes(bottom_key)) {
                target_pos = target_pos.add(shear_dir.scale(-.5))
                target_pos.y += .1

                if (bot.math.length(target_pos) > REACH) {
                    target_pos.y
                }

                if (!mine_if_wood(at(target_pos.x, target_pos.y, target_pos.z), time_per_log)) {
                    continue
                }

                add_to_queue(pos, true)
                queue.push(pos.add(vec3(0, 1, 0)))
            } else {
                target_pos = target_pos.add(shear_dir.scale(-.1))

                let mined = target_pos.y > 4.5 && mine_if_wood(at(target_pos.x + (shear_dir.x * .5), target_pos.y, target_pos.z + (shear_dir.z * .5)), time_per_log)
                mined ||= mine_if_wood(at(target_pos.x, target_pos.y, target_pos.z), time_per_log)

                if (!mined) {
                    continue
                }

                add_to_queue(pos, false)
            }

            height = Math.max(pos.y+1, height)
        }
        return true
    }

    function mine_branches() {
        const positions = [[0,-1],[1,0],[-1,-1],[1,1],[0,2],[-2,0],[-1,2],[-2,1],[1,-1],[1,2],[-2,2],[-2,-1]]
        for (const [x, z] of positions) {
            const dx = x < -1 || x > 0 ? Math.sign(x + .5) * .4 : 0
            const dz = z < 0 || z > 1 ? Math.sign(z - .5) * .4 : 0
            const y = height - 2 - self_height

            mine_if_wood(at(x - dx, y, z - dz), 2*time_per_log) &&
            mine_if_wood(at(x + dx, y - 2, z + dz), 2*time_per_log)
        }
    }

    function complete(dir) {
        if (self_height > 0) {
            const target_pos = bot.PLAYER.getPos().y - self_height
            bot.item.select(tool, 0)
            bot.look.towards(dir, 90)
            bot.input.add(bot.input.ATTACK)
            bot.control.loop(() => bot.PLAYER.getPos().y !== target_pos)
            bot.input.remove(bot.input.ATTACK)
        }

        bot.item.select(sapling, 1)
        bot.action.interact_block(at(0, 0, 0), 100)
        bot.action.interact_block(at(-1, 0, 1), 100)
        bot.action.interact_block(at(0, 0, 1), 100)
        bot.action.interact_block(at(-1, 0, 0), 100)

        bot.move.toggle(true)
        if (increment) {
            bot.progress.increment()
        }
    }

    return function (dir, offset) {
        self_height = 0
        at = (right, up, forward) => bot.dir.block_relative(dir, right, up, forward)

        // get into pos
        bot.item.select(tool, 0)
        if (dir === bot.dir.SOUTH || dir === bot.dir.EAST) {
            bot.action.move_mine_block(dir, offset, at(0,1,offset-.4))
        } else {
            bot.action.move_mine_block(dir, offset-1, at(0,1,offset-1-.4))
            bot.action.move_mine_block(dir, 1, at(0,1,1-.4))
        }

        dir = bot.dir.SOUTH
        bot.move.toggle(false)

        // mine base
        let base1 = mine_if_wood(at(0, 1, .6), 2*time_per_log)
        let base2 = mine_if_wood(at(-.6, 1, 0), 2*time_per_log)
        let base3 = mine_if_wood(at(-.6, 1, .6), 2*time_per_log)

        if (base1 || base2 || base3) {
            const stems = mine_stem_straight()

            if (stems.some(Boolean) && !mine_stem_shear(stems)) {
                return complete(dir)
            }

            mine_branches()
        }

        complete(dir)
    }
}
