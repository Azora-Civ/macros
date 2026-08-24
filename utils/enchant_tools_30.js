module.exports = function (direction, pitch) {
    const lapis = bot.item.of("lapis_lazuli")
    const item = bot.item.get_holding()
    const raw_item = item.raw


    if (!raw_item.isTool() || !raw_item.isEnchantable()) {
        bot.logger.info("Not holding a tool to enchant...")
        return
    }

    const lore_text = raw_item?.getNBT()?.get("minecraft:lore")?.get(0)?.get("extra")?.get(0)?.asString()

    if (lore_text === "Compacted Item") {
        bot.logger.info("Uncompact the item first")
        return
    }

    let candidates = bot.item.find(item)

    while (candidates.length > 0) {
        bot.action.complex.xp_up(30)

        bot.item.ensure_min_count(lapis, 3)

        bot.item.empty(0)
        bot.item.unselect()
        bot.control.loop(() => true, {timeout:500})
        bot.action.interact(direction, pitch, 100)
        bot.control.loop(() => true, {timeout:500})


        const inv = bot.inv()

        print(inv.getMap())

        inv.quick(bot.item.find(lapis)[0])
        Client.waitTick()
        inv.quick(bot.item.find(item)[0])
        Client.waitTick(2)

        enchant(2)

        inv.close()

        Client.waitTick(20)

        candidates = bot.item.find(item)
    }
}

function enchant(level=2) {
    var inv = bot.inv();

    function do_next() {
        const item = inv.getItemToEnchant()
        if (!item) return false
        if (item.isEnchanted()) return false
        if (!item.isEnchantable()) return false

        return true
    }

    while (do_next()) {
        inv.doEnchant(2);
        Client.waitTick(5)
    }
}
