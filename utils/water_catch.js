const default_options = {
    long_direction: bot.dir.NORTH,
    short_direction: bot.dir.WEST,
    length: 3,
    wood: "oak",
}

let options

let plank
let trapdoor
let fence_gate
const ice = bot.item.of("packed_ice")
const water = bot.item.of("water_bucket")
const bucket = bot.item.of("bucket")
const tool = bot.item.axe()

let reverse_long_dir
let reverse_short_dir


module.exports = function (args) {
    options = {
        ...default_options,
        ...args,
    }

    bot.start(null, true)
    bot.check.hold_min_height(true)
    bot.check.has_stone(true)

    init()

    // build_floor()
    //
    // build_wall()
    // build_water_bed()
    // build_wall()
    // build_water_railing()

    place_water()

    bot.finish()
}

function init() {
    plank = bot.item.of(options.wood + "_planks")
    trapdoor = bot.item.of(options.wood + "_trapdoor")
    fence_gate = bot.item.of(options.wood + "_fence_gate")

    reverse_long_dir = bot.dir.turn_back(options.long_direction)
    reverse_short_dir = bot.dir.turn_back(options.short_direction)
}

function build_floor() {
    for (let i = 0; i < 9; i++) {
        const dir = i % 2 === 0 ? options.long_direction : reverse_long_dir
        const item = [6, 7].includes(i) ? ice : plank
        const slot = [6, 7].includes(i) ? 3 : 0

        if (i !== 0) {
            bot.action.bridge(options.short_direction, 1, item, slot)
        }

        bot.action.bridge(dir, options.length-1, item, slot)
    }
}

function build_wall() {
    bot.action.pillar_up(1, plank, 0)
    bot.action.bridge(reverse_short_dir, 8, plank, 0)
    bot.action.pillar_up(1, plank, 0)
    bot.action.bridge(options.short_direction, 8, plank, 0)
}

function build_water_bed() {
    bot.input.toggle_sneak(false)
    bot.move.toDir(reverse_short_dir, 1)
    bot.move.toDir(reverse_long_dir, 2)
    bot.action.center()

    bot.item.select(trapdoor, 1)
    bot.action.interact_block(bot.dir.block_relative(options.long_direction, 0, .9, 1.5), 100)
    bot.action.move_up(options.long_direction, 0)

    bot.action.bridge(reverse_long_dir, options.length-3, trapdoor, 1, 78)

    bot.move.toDir(options.short_direction, 1)
    bot.move.toDir(reverse_long_dir, 1)
    bot.action.center()
    bot.action.wait(500)
}

function build_water_railing() {
    bot.input.toggle_sneak(false)
    bot.move.toDir(reverse_short_dir, 1)
    bot.move.toDir(options.long_direction, 1)
    bot.action.center()

    const at = (r, u, f) => bot.dir.block_relative(reverse_short_dir, r, u, f)

    bot.item.select(fence_gate, 2)

    const length = options.length-2
    const sign = bot.dir.turn_right(reverse_short_dir) === reverse_long_dir ? 1 : -1

    for (let i = 0; i < length; i++) {
        bot.input.toggle_sneak(true)
        bot.action.interact_block(at(sign * .5, .5, 2.05), 100)
        bot.action.wait(100)
        bot.input.toggle_sneak(false)
        bot.action.interact_block(at(sign * .5, .5, 2.05), 100)
        bot.action.wait(100)

        bot.input.toggle_sneak(true)
        bot.action.interact_block(at(sign * .5, .5, -1.05), 100)
        bot.action.wait(100)
        bot.input.toggle_sneak(false)
        bot.action.interact_block(at(sign * .5, .5, -1.05), 100)
        bot.action.wait(100)

        bot.input.toggle_sneak(true)
        bot.look.towards(reverse_short_dir, 0)
        if (i !== (length-1)) {
            bot.action.move(options.long_direction, 1)
        } else {
            bot.action.move_up(options.long_direction, 0)
        }
    }
}

function place_water() {
    bot.check.hold_min_height(false)
    bot.action.move(reverse_short_dir, 1)
    bot.action.bridge(reverse_long_dir, options.length-2, plank, 0)

    const at = (r) => bot.dir.block_relative(options.short_direction, r, -1, 1)

    bot.input.toggle_sneak(true)
    for (let i = 0; i < options.length-2; i++) {
        bot.item.select(water, 4)
        bot.item.unselect()
        bot.action.interact_block(at(0), 100)
        bot.action.wait(500)
        if (i !== 0 && i !== options.length-3) {
            bot.item.select(bucket, 5)
            bot.item.unselect()
            bot.action.interact_block(at(0), 100)
        }
        bot.look.towards(options.short_direction, 64)

        bot.action.move(options.long_direction, 1)
    }

    bot.input.toggle_sneak(false)

    bot.look.towards(reverse_long_dir, 0)
    bot.item.select(tool, 0)
    bot.action.move(reverse_long_dir, 1)
    bot.action.mine(reverse_long_dir, 90, 500)
    bot.action.move_mine(reverse_long_dir, options.length-3, true, 0)
}


