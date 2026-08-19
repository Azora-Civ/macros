module.exports = function (level=30) {
    const emerald = bot.item.of("emerald")
    const xp_bottle = bot.item.of("experience_bottle")

    if (bot.player().getXPLevel() >= level) return

    while (bot.player().getXPLevel() < level-1) {
        bot.item.ensure_min_count(emerald, 2)

        bot.item.select(emerald, 1)
        bot.action.interact(bot.dir.get_dir(), 90, 100)
        bot.action.wait(250)
    }

    if (bot.player().getXPLevel() >= level) return

    bot.item.ensure_min_count(xp_bottle, 8)

    while (bot.player().getXPLevel() < level) {
        bot.item.select(xp_bottle, 2)
        bot.action.interact(bot.dir.get_dir(), 90, 100)
        bot.action.wait(500)
    }
}