module.exports = function (long_direction, short_direction, length, seed, tool) {
    bot.start()
    bot.commands.ctf()

    const dirt = bot.item.of("dirt")
    const hoe = tool

    const at = (r,u,f) => bot.dir.block_relative(long_direction, r,u,f)

    const r_long_direction = bot.dir.turn_back(long_direction)
    const r_short_direction = bot.dir.turn_back(short_direction)

    for (let i = 0; i < 4; i++) {
        const dir = i % 2 === 0 ? long_direction : r_long_direction
        if (i !== 0)
            bot.action.bridge(short_direction, 1, dirt, 1)
        bot.action.bridge(dir, length-1, dirt, 1)
    }

    bot.action.move(r_short_direction, 1)
    for (let i = 0; i < length; i++) {
        if (i !== 0) {
            bot.look.lock()
            bot.action.move(long_direction, 1)
        }

        bot.item.select(hoe,0)
        bot.action.interact_block(at(1,0,0), 100)
        bot.item.select(seed,2)
        bot.action.interact_block(at(1,0,0), 100)
    }

    for (let i = 0; i < length; i++) {
        if (i !== 0) {
            bot.look.lock()
            bot.action.move(r_long_direction, 1)
        }

        bot.item.select(hoe,0)
        bot.action.interact_block(at(-2,0,0), 100)
        bot.item.select(seed,2)
        bot.action.interact_block(at(-2,0,0), 100)
    }
}