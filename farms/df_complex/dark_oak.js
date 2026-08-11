let offset = 8
let rows = 10
let cols = 9

let wood = bot.item.of("dark_oak_log")
let sapling = bot.item.of("dark_oak_sapling")

let dark_oak_like = bot.action.complex.do_dark_oak_like({
    wood: wood,
    sapling: sapling
})
module.exports = function () {
    let drops = [bot.item.of("apple"), bot.item.of("stick"), bot.item.of("dark_oak_leaves")]

    bot.start(rows * cols, false)

    for (let i = 0; i < rows; i++) {
        let initial_dir = i === 0 ? bot.dir.SOUTH : bot.dir.EAST
        let row_dir = i % 2 === 0 ? bot.dir.SOUTH : bot.dir.NORTH

        do_row(initial_dir, row_dir)

        //drop the stuff
        bot.look.towards(row_dir-150, 50)
        drops.forEach(bot.item.drop_all_of)
        bot.item.drop_most_of(wood)
    }

    bot.look.forward()
    bot.action.move(bot.dir.WEST, offset * (rows-1))
    bot.action.move(bot.dir.NORTH, offset)

    bot.finish()
}

function do_row(initial_dir, row_dir) {
    dark_oak_like(initial_dir, offset)
    for (let i = 0; i < cols-1; i++) {
        dark_oak_like(row_dir, offset)
    }
}
