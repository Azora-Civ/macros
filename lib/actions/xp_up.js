module.exports = function (level=30, slot=0) {
    const xp_bottle = bot.item.of("experience_bottle")
    const emerald = bot.item.of("emerald")

    while (bot.player().getXPLevel() < level) {
        const needed = xp_needed(level)
        if (needed >= 90 && has_emeralds()) {
            if (bot.item.count(emerald) === 0) {
                bot.item.craft(emerald, false, false)
            }

            bot.item.select(emerald, slot)
            bot.action.interact(bot.dir.get_dir(), 90, 100)
            bot.action.wait(250)
            continue
        }

        bot.item.select(xp_bottle, slot)
        bot.action.interact(bot.dir.get_dir(), 90, 100)
        bot.action.wait(500)
    }
}

function has_emeralds() {
    const emerald = bot.item.of("emerald")
    const emerald_block = bot.item.of("emerald_block")

    return bot.item.count(emerald) > 0 || bot.item.count(emerald_block) > 0
}

function xp_for_level(level) {
    if (level <= 16)
        return level * level + 6 * level

    if (level <= 31)
        return Math.floor(2.5 * level * level - 40.5 * level + 360)

    return Math.floor(4.5 * level * level - 162.5 * level + 2220)
}

function current_xp() {
    const player = bot.player()
    const level = player.getXPLevel()
    const progress = player.getXPProgress()
    const to_next = player.getXPToLevelUp()

    return xp_for_level(level) + progress * to_next
}

function xp_needed(target_level) {
    return Math.max(
        0,
        xp_for_level(target_level) - current_xp()
    )
}
