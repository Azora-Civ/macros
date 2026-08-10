const dirt = bot.item.of("dirt")
const glass_pane = bot.item.of("glass_pane")
let options = {
    offset: 5,
    rows: 5,
    cols: 5,
    row_dir: bot.dir.NORTH,
    col_dir: bot.dir.WEST,
    is_big: false
}

const NORTH = bot.dir.NORTH
const WEST = bot.dir.WEST
const SOUTH = bot.dir.SOUTH
const EAST = bot.dir.EAST

module.exports = function (args) {
   options = args

    bot.start(options.rows * options.cols)

    for (let i = 0; i < options.rows; i++) {
        let is_first = i===0
        let row_dir = i % 2 === 0 ? options.row_dir : bot.dir.turn_back(options.row_dir)
        let col_dir = options.col_dir

        do_row(row_dir, col_dir, is_first)
    }

    bot.finish()
}

function do_row(row_dir, col_dir, is_first) {
    if (!is_first) {
        place_tree_base(col_dir, options.offset, false)
    }

    for (let i = 0; i < options.cols-1; i++) {
        place_tree_base(row_dir, options.offset, false)
    }

    if (!is_first) {
        place_tree_base(bot.dir.turn_back(col_dir), options.offset, true)
        bot.action.move(col_dir, options.offset)
    }
}

function place_tree_base(direction, offset, skip_dirt) {
    let last_block = dirt

    if (options.is_big) {
        offset--
        if ([bot.dir.SOUTH, bot.dir.EAST].includes(direction)) bot.action.move(direction, 1)
    }

    for (let i = 0; i < offset-1; i++) {
        shift_place_block(direction, glass_pane, last_block)
        last_block = glass_pane
    }

    if (skip_dirt) {
        bot.action.move(direction, 1)
        if (options.is_big) {
            if ([NORTH, WEST].includes(direction)) {
                bot.action.move(direction, 1)
            }
        }
    } else {
        shift_place_block(direction, dirt, last_block)

        if (options.is_big) {
            const turn = [bot.dir.NORTH, bot.dir.EAST].includes(direction) ? bot.dir.turn_right : bot.dir.turn_left
            const times = [bot.dir.NORTH, bot.dir.WEST].includes(direction) ? 5 : 4

            for (let i = 0; i < times; i++) {
                if (i <= 2) shift_place_block(direction, dirt, dirt)
                else bot.move.toDir(direction, 1)

                direction = turn(direction)
            }

            bot.control.loop(bot.move.not_reached_target())
        }
    }

    if (!skip_dirt) {
        bot.progress.increment()
    }
}

function shift_place_block(direction, item) {
    bot.input.toggle_sneak(true)
    bot.move.set_eps(.15)
    const look_direction = bot.dir.turn_back(direction)
    bot.look.towards(look_direction, 80)

    bot.move.toDir(direction, 1)

    bot.control.loop(bot.move.is_moving())

    bot.item.select(item, item === dirt ? 0 : 1)
    bot.action.interact(look_direction, 80, 100)

    bot.control.loop(bot.move.not_reached_target)
}