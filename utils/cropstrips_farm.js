module.exports = function () {
    const next_dir = WEST
    const farm_dir = SOUTH
    const farm_depth = 8
    const rows = 4
    const drops = [
        bot.item.of("potato"),
        bot.item.of("poisonous_potato"),
        bot.item.of("beetroot"),
        bot.item.of("beetroot_seeds"),
        bot.item.of("wheat"),
        bot.item.of("wheat_seeds"),
        bot.item.of("carrot"),
    ]

    const normalize = dir => ((dir % 360) + 360) % 360
    const offset = (dir, angle) => normalize(dir + angle)

    const rfarm_dir = bot.dir.turn_back(farm_dir)
    const between = bot.dir.between(farm_dir, next_dir)

    // Determine which side the farm is on relative to next_dir
    const farmOnRight = normalize(farm_dir - next_dir) === 90

    const strafeFarm = farmOnRight ? RIGHT : LEFT
    const strafeBack = farmOnRight ? LEFT : RIGHT

    // Rotate angles according to farm orientation
    const farmAngle = farmOnRight ? -35 : 35
    const nextAngle = farmOnRight ? 10 : -10

    function do_dir(dir, pitch) {
        bot.look.towards(dir, pitch)
        bot.action.wait(250)
    }

    function this_full_fwd() {
        bot.action.move(next_dir, 1)
        bot.action.move(farm_dir, 1)
        bot.input.add(USE)

        do_dir(next_dir, 90)
        do_dir(next_dir, 60)
        do_dir(between, 50)
        do_dir(farm_dir, 60)

        bot.look.towards(offset(farm_dir, farmAngle), 40)
        bot.move.toDir(farm_dir, farm_depth - 1)
        bot.input.add(strafeFarm)
        custom_walk()
        bot.input.remove(strafeFarm)
    }

    function next_half_bwd() {
        bot.look.towards(offset(next_dir, nextAngle), 20)

        bot.input.add(FORWARD)
        bot.move.toDir(next_dir, 1)
        bot.move.toggle(false)
        bot.control.loop(bot.move.is_moving(.1), {timeout: 1000})
        bot.move.toggle(true)
        bot.input.remove(FORWARD)

        bot.move.toDir(rfarm_dir, farm_depth)
        bot.input.add(strafeBack)
        custom_walk()
        bot.input.remove(strafeBack)
        bot.action.move(next_dir, 1)
    }

    function this_half_fwd() {
        bot.action.move(next_dir, 1)

        do_dir(farm_dir, 60)
        do_dir(farm_dir, 30)

        bot.action.move(farm_dir, farm_depth)
    }

    function drop() {
        bot.look.towards(rfarm_dir, 0)
        bot.action.wait(200)
        drops.forEach(bot.item.drop_all_of)
    }

    function custom_walk() {
        bot.move.toggle(false)
        bot.move.set_eps(.4)
        bot.control.loop(bot.move.not_reached_target)
        bot.move.set_eps(.15)
        bot.move.toggle(true)
        bot.action.center()
    }

    bot.item.empty(0)
    bot.look.towards(next_dir, 0)

    const interval = 50
    bot.on_repeat.set("spam_left_click", iter => {
        if (iter % (interval*2) === 0) {
            bot.input.add(USE)
        }
        if ((iter+interval) % (interval*2) === 0) {
            bot.input.remove(USE)
        }
    })

    let pos = bot.player().getPos()
    let last = Time.time()
    bot.on_repeat.set("main", () => {
        const now = Time.time()
        if (now - last < 1000) return

        const new_pos = bot.player().getPos()
        const distance = bot.math.distance(pos, new_pos)
        const speed = distance / ((now - last) / 1000)

        bot.ui.action_bar(`Speed: ${speed.toFixed(2)} blocks/s`)

        pos = new_pos
        last = now
    })

    for (let i = 0; i < rows; i++) {
        if (i === 0) this_full_fwd()
        else this_half_fwd()

        next_half_bwd()
        drop()
    }

    bot.on_repeat.remove("spam_left_click")
    bot.input.remove(USE)
}