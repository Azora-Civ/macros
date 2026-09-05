module.exports = {

    /**
     *
     * @param {InventoryType} type
     * @returns {boolean}
     */
    is_in(type) {
        const inv = bot.inv()
        return type === inv.getType()
    },

    /**
     *
     * @param {InventoryType} type
     * @returns {boolean}
     */
    try_open(type) {
        if (type.includes("Inventory")) {
            bot.menu.exit_menu()
        } else {
            bot.input.add(bot.input.USE)
            bot.control.loop(() => !bot.menu.is_in(type), {timeout: 500, interval:25})
            bot.input.remove(bot.input.USE)
        }

        return bot.menu.is_in(type)
    },

    exit_menu() {
        const inv = bot.inv()
        if (["Survival Inventory", "Creative Inventory"].includes(inv.getType()))
            return
        const type = inv.getType()

        inv.close()
        bot.control.loop(() => bot.menu.is_in(type), {timeout: 500})
    }
}
