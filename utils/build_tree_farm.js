const dirt = bot.item.of("dirt")
const glass_pane = bot.item.of("glass_pane")
const stone = bot.item.of("stone")

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

module.exports = function (offset=5, rows=5, cols=5, row_dir=bot.dir.NORTH, col_dir=bot.dir.WEST, is_big=false) {
   options = {
       offset, is_big,
       rows, row_dir,
       cols, col_dir
   }

    bot.start(options.rows * options.cols, true)
    bot.check.has_stone(true)
    bot.check.hold_min_height(true)
    bot.commands.ctf()

    const reverse_row_dir = bot.dir.turn_back(row_dir)
    const reverse_col_dir = bot.dir.turn_back(col_dir)

    for (let i = 0; i < options.rows; i++) {
        let is_first = i===0
        let row_dir = i % 2 === 0 ? options.row_dir : reverse_row_dir
        let col_dir = options.col_dir

        do_row(row_dir, col_dir, is_first)
    }

    bot.action.move(reverse_col_dir, offset*(rows-1))
    bot.action.move(reverse_row_dir, (rows % 2 === 0 ? 1 : cols) * offset)

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
    bot.input.toggle_sneak(true)
    bot.move.set_eps(.06)

    if (options.is_big) {
        offset--
        if ([SOUTH, EAST].includes(direction)) bot.action.move(direction, 1)
    }

    bot.action.center()
    bot.action.bridge(direction, offset-1, glass_pane, 1)

    if (skip_dirt) {
        bot.action.move(direction, 1)
        if (options.is_big && [NORTH, WEST].includes(direction)) {
            bot.action.move(direction, 1)
        }
    } else {
        bot.action.bridge(direction, 1, dirt, 0)

        if (options.is_big) {
            const turn = [NORTH, EAST].includes(direction) ? bot.dir.turn_right : bot.dir.turn_left
            const times = [NORTH, WEST].includes(direction) ? 5 : 4

            for (let i = 0; i < times; i++) {
                if (i < 3) bot.action.bridge(direction, 1, dirt, 0)
                else bot.move.toDir(direction, 1)

                direction = turn(direction)
            }

            bot.control.loop(bot.move.not_reached_target)

        }
    }

    if (!skip_dirt) {
        bot.progress.increment()
    }

    bot.move.set_eps(.15)
    bot.input.toggle_sneak(false)
}
