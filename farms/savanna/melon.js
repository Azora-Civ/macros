module.exports = function () {
    bot.item.empty(0)
    bot.item.unselect()
    bot.action.elevator(1)
    bot.action.interact(bot.dir.EAST, 0, 100)
    bot.look.towards(bot.dir.WEST, 0)

    bot.action.move(bot.dir.WEST, 135)

    bot.action.move(bot.dir.NORTH, 1)
    bot.look.towards(bot.dir.EAST, 0)
    bot.action.wait(5000)
    bot.action.move(bot.dir.SOUTH, 1)

    bot.action.move(bot.dir.EAST, 130)
    bot.action.move(bot.dir.NORTH, 1)
    bot.action.move(bot.dir.EAST, 5)
    bot.action.move(bot.dir.SOUTH, 1)

    bot.action.center()
    bot.action.elevator(-1)

    bot.action.interact(bot.dir.WEST, 0, 100)

    const melon_slice = bot.item.of("melon_slice")
    const melon = bot.item.of("melon")

    while (bot.item.count(melon_slice) >= 9) {
        bot.item.craft(melon, true, true)
        Client.waitTick(4)
    }
}
