module.exports = function (offset = 5, axe = null, only_saplings = false) {
    const sapling = bot.item.of("acacia_sapling")
    const log = bot.item.of("acacia_log")
    const leaves = bot.item.of("acacia_leaves")
    const hoe = bot.item.of("diamond_hoe")

    axe ??= bot.item.axe()

    return (direction) => {
        if (!only_saplings) {
            bot.check.assert(
                "This farm needs leaves!",
                () => bot.item.count(leaves) > 0
            )
        }

        const vec = (x, y, z) => bot.math.vec(x, y, z)
        const at = p => bot.dir.block_relative(direction, p.x, p.y, p.z)

        const queue = []
        const queued = new Set()
        const expanded = new Set()

        const key = p => `${p.x},${p.y},${p.z}`
        const dist2 = p => p.x * p.x + p.z * p.z

        function get_dir(p) {
            return bot.math.normalize(vec(p.x, 0, p.z))
        }

        function enqueue(p) {
            const k = key(p)

            if (queued.has(k) || expanded.has(k)) return
            if (p.y > 5) return
            if (dist2(p) > 3.5 ** 2) return

            queued.add(k)
            queue.push(p)
        }

        function expand(p, mark = true) {
            if (only_saplings) return

            const dir = get_dir(p)
            const above = p.add(vec(0, 1, 0))

            enqueue(above)

            if (dist2(p) === 0) {
                // Possible branches coming off the trunk.
                enqueue(above.add(vec( 1, 0,  0)))
                enqueue(above.add(vec(-1, 0,  0)))
                enqueue(above.add(vec( 0, 0,  1)))
                enqueue(above.add(vec( 0, 0, -1)))
            } else if (!expanded.has(key(p.add(vec(0, -1, 0))))) {
                // Continue an outward branch.
                enqueue(above.add(dir))
            }

            if (mark)
                expanded.add(key(p))
        }

        function next() {
            let best = 0

            for (let i = 1; i < queue.length; i++) {
                if (better(queue[i], queue[best]))
                    best = i
            }

            const [p] = queue.splice(best, 1)
            queued.delete(key(p))

            return p
        }

        function better(a, b) {
            const ad = dist2(a)
            const bd = dist2(b)

            // Most important change:
            // completely clear the center trunk before branches.
            if ((ad === 0) !== (bd === 0))
                return ad === 0

            // Then clear branches from nearest -> furthest.
            if (ad !== bd)
                return ad < bd

            // Lower first when otherwise equivalent.
            return a.y < b.y
        }

        function target_for(p) {
            const d = get_dir(p)
            const distance = Math.sqrt(dist2(p))

            /*
             * Center trunk is safe now because we deliberately mine it
             * bottom-up before touching branches.
             */
            if (distance === 0)
                return at(p)

            /*
             * Because acacia branch logs have x == 0 or z == 0,
             * this gives us the perpendicular axis.
             */
            const side = vec(
                1 - Math.abs(d.x),
                0,
                1 - Math.abs(d.z)
            )

            /*
             * Nearby logs don't need your old extreme .4 corner.
             * Increase the bias as the branch gets further away,
             * where angular separation matters more.
             *
             * distance 1 -> .24
             * distance 2 -> .30
             * distance 3 -> .36
             */
            const bias = Math.min(.36, .24 + (distance - 1) * .06)

            return at(
                p
                    .add(d.scale(-bias))
                    .add(side.scale(bias))
            )
        }


        bot.item.select(axe, 0)
        bot.action.move_mine_block(
            direction,
            offset,
            at(vec(0, 1, offset))
        )

        bot.move.toggle(false)

        try {
            expand(vec(0, 1, -1), false)
            expand(vec(0, 0, 0))
            expand(vec(0, 1, 0))

            while (queue.length) {
                const pos = next()
                const target = target_for(pos)

                if (bot.item.is_holding(leaves) || bot.item.is_holding(log))
                    bot.item.select(hoe, 1)

                if (bot.action.sample_block(target, leaves)) {
                    bot.item.select(hoe, 1)
                    bot.action.mine_block(target, 100)

                    // See what's behind the removed leaf.
                    bot.action.sample_block(target)
                }

                if (!bot.item.is_holding(log))
                    continue

                bot.item.select(axe, 0)
                bot.action.wait(100)
                bot.action.mine_block(target, 450)

                expand(pos)
            }

            bot.item.select(sapling, 2)
            bot.action.interact(direction, 90, 100)

            bot.progress.increment()
        } finally {
            bot.move.toggle(true)
        }
    }
}
