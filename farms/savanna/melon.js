module.exports = function () {
    bot.action.move(bot.dir.WEST, 1)
    bot.move.toggle(false)

    bot.action.interact_block(bot.dir.block_relative(bot.dir.EAST, 0, 0.5, 2), 100)
    bot.action.wait(5000)
    bot.move.set_eps(.3)
    bot.control.loop(bot.move.not_reached_target)

    bot.move.toggle(true)
    bot.move.set_eps(.15)
    bot.action.move(bot.dir.EAST, 1)

    // REPLACE REPLACE REPLACEREPLACE
    Chat.say("/tp borito185 -655 80 -383")

    bot.action.interact(bot.dir.WEST, 0, 100)

    const melon_slice = bot.item.of("melon_slice")
    const melon = bot.item.of("melon")

    let count = 0
    while (bot.item.count(melon_slice) >= 9) {
        bot.item.craft(melon, true, true)
        Client.waitTick(4)
        count++
    }

    print(count + "ci")
}
