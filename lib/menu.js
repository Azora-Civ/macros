let inventory = Player.openInventory()

module.exports = {

    current() {
        return inventory
    },

    /**
     *
     * @param {InventoryType} type
     * @returns {boolean}
     */
    is_in(type) {
        const inv = refresh_inv()
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
            bot.control.loop(() => !bot.menu.is_in(type), {timeout: 500})
            bot.input.remove(bot.input.USE)
        }

        return inventory.getType() === type
    },

    exit_menu() {
        const inv = refresh_inv()
        if (["Survival Inventory", "Creative Inventory"].includes(inv.getType()))
            return
        const type = inv.getType()

        inv.close()
        bot.control.loop(() => bot.menu.is_in(type), {timeout: 500})
    }
}

function refresh_inv() {
    inventory = Player.openInventory() ?? inventory
    return inventory
}
