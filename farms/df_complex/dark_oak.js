const bot = require("../../bot");
module.exports = function () {
    let offset = 8
    let rows = 6
    let columns = 6

    let wood = bot.item.of("dark_oak_log")
    let sapling = bot.item.of("dark_oak_sapling")


    let drops = [bot.item.of("apple"), bot.item.of("stick"), bot.item.of("dark_oak_leaves")]

    bot.start()
    bot.progress.init(rows * columns)
    let ctb = bot.commands.ctb(false)

    for (let i = 0; i < rows; i++) {
        let initial_dir = i === 0 ? bot.dir.SOUTH : bot.dir.EAST
        let row_dir = i % 2 === 0 ? bot.dir.SOUTH : bot.dir.NORTH

        do_row(initial_dir, row_dir, offset, columns, wood, sapling)

        //drop the stuff
        bot.look.towards(bot.dir.NORTHWEST, 50)
        drops.forEach(bot.item.drop_all_of)
        bot.item.drop_most_of(wood)
    }

    bot.look.forward()
    bot.action.move(bot.dir.WEST, offset * (rows-1))
    bot.action.move(bot.dir.NORTH, offset)

    bot.commands.ctb(ctb)
    bot.progress.finish()
    bot.finish()
}

function do_row(initial_dir, row_dir, offset, elements, wood, sapling) {
    let initial_corner = initial_dir === bot.dir.NORTH ? bot.dir.SOUTHWEST : bot.dir.NORTHWEST

    dark_oak_like(initial_dir, initial_corner, offset, wood, sapling)

    let corner = row_dir === bot.dir.NORTH ? bot.dir.SOUTHWEST : bot.dir.NORTHWEST
    for (let i = 0; i < elements-1; i++) {
        dark_oak_like(row_dir, corner, offset, wood, sapling)
    }
}

function dark_oak_like(direction, corner, distance, wood, sapling) {
    let tool = bot.item.of("diamond_axe").with_enchant("Efficiency", 5).with_durability(10)

    let real_distance = direction === bot.dir.NORTH ? distance-1 : distance

    move_mine_tree(direction, real_distance, tool)

    if (corner === bot.dir.NORTHWEST) {}
    else if (corner === bot.dir.SOUTHWEST) {
        move_mine_tree(bot.dir.NORTH, 1, tool)
        bot.item.select(wood, 2)
        bot.action.interact(bot.dir.SOUTH, 55, 200)
    } else if (corner === bot.dir.NORTHEAST) {
        move_mine_tree(bot.dir.WEST, 1, tool)
        bot.item.select(wood, 2)
        bot.action.interact(bot.dir.EAST, 55, 200)
    } else { throw new Error("Unsupported direction for mining dark oak like trees") }

    // move self into corner
    bot.move.toDir(bot.dir.SOUTHEAST, .8, false)

    // do top
    corner_mine_tree(bot.dir.SOUTHEAST, -88, 2000, tool)
    corner_mine_tree(bot.dir.SOUTH, -72.5, 2500, tool)
    corner_mine_tree(bot.dir.SOUTHEAST+5, -67, 2500, tool)
    corner_mine_tree(bot.dir.EAST, -72.5, 2500, tool)
    corner_mine_tree(bot.dir.SOUTHEAST-5, -67, 500, tool)

    // we most definitely reached the corner now.
    // we will turn faster now so disable moving to prevent jitter
    bot.move.toggle(false)

    // do sides NORTH
    if (sample_block(bot.dir.NORTH, -65, wood)) {
        corner_mine_tree(bot.dir.NORTH, -65, 2000, tool)
        corner_mine_tree(bot.dir.NORTH, -24, 900, tool)
    } else if (sample_block(bot.dir.NORTH, -80, wood)) {
        corner_mine_tree(bot.dir.NORTH, -80, 500, tool)
    }
    if (sample_block(bot.dir.NORTH + 20, -65, wood)) {
        corner_mine_tree(bot.dir.NORTH + 20, -65, 2000, tool)
        corner_mine_tree(bot.dir.NORTH + 20, -20, 900, tool)
    } else if (sample_block(bot.dir.NORTH + 30, -78, wood)) {
        corner_mine_tree(bot.dir.NORTH + 30, -78, 500, tool)
    }
    // do sides WEST
    if (sample_block(bot.dir.WEST, -65, wood)) {
        corner_mine_tree(bot.dir.WEST, -65, 2000, tool)
        corner_mine_tree(bot.dir.WEST, -24, 900, tool)
    } else if (sample_block(bot.dir.WEST, -80, wood)) {
        corner_mine_tree(bot.dir.WEST, -80, 500, tool)
    }
    if (sample_block(bot.dir.WEST - 20, -65, wood)) {
        corner_mine_tree(bot.dir.WEST - 20, -65, 2000, tool)
        corner_mine_tree(bot.dir.WEST - 20, -20, 900, tool)
    } else if (sample_block(bot.dir.WEST - 30, -78, wood)) {
        corner_mine_tree(bot.dir.WEST - 30, -78, 500, tool)
    }

    // do corner
    if (sample_block(bot.dir.NORTHWEST, -50, wood)) {
        corner_mine_tree(bot.dir.NORTHWEST, -50, 1500, tool)
        corner_mine_tree(bot.dir.NORTHWEST, 0, 600, tool)
    }

    bot.move.toggle(true)
    bot.action.move(bot.dir.NORTHWEST, .8, true)

    // do roots
    plant(sapling)
    move_mine_tree(bot.dir.SOUTH, 1, tool)
    plant(sapling)
    move_mine_tree(bot.dir.EAST, 1, tool)
    plant(sapling)
    move_mine_tree(bot.dir.NORTH, 1, tool)
    plant(sapling)

    bot.action.move(bot.dir.WEST, 1)
    bot.progress.increment()
}

function plant(sapling) {
    bot.item.select(sapling, 1)
    bot.action.interact(0, 90, 200)
}

function move_mine_tree(direction, distance, tool) {
    let pos = bot.dir.to_vec(direction).scale(distance)
    pos = bot.move.target.add(pos)
    pos = bot.math.centralize(pos)
    pos.y = bot_state.PLAYER.getPos().y + 1
    bot.item.select(tool, 0)
    bot.look.at(pos)
    bot.input.add(bot.input.ATTACK)
    bot.action.move(direction, distance)
    bot.input.remove(bot.input.ATTACK)
}

function corner_mine_tree(direction, pitch, time, tool) {
    bot.item.select(tool, 0)

    bot.action.mine(direction, pitch, time)
}

function sample_block(direction, pitch, item, non_item = null) {
    if (non_item != null)
        bot.item.select(non_item, 0)
    bot.item.unselect()
    bot.look.towards(direction, pitch)
    bot.input.add(bot.input.MIDDLE)
    bot.action.wait(100)
    bot.input.remove(bot.input.MIDDLE)
    Client.waitTick(5)
    return bot.item.is_holding(item)
}