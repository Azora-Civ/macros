module.exports = {
    of(name) {
        return this.builder().with_name(name)
    },

    of_slot(slot, hotbar= true) {
        slot = bot.INVENTORY.getSlot(slot + (hotbar ? 36 : 0))

        return this.builder().with_name(slot.getItemId().replace("minecraft:", ""))
    },

    builder() {
        return {
            name: "undefined",
            suffix: "",
            filters: [],
            matches(slot) {
                for (let filter of this.filters) {
                    if (!filter(slot)) {
                        return false;
                    }
                }

                return true;
            },

            with_name(name) {
                this.name = name
                this.filters.push(slot => slot.getItemId() === ("minecraft:" + name))
                return this;
            },

            with_enchant(name, min_level) {
                this.suffix += name[0] + min_level

                this.filters.push(slot => slot.getEnchantment(name) != null && slot.getEnchantment(name).getLevel() >= min_level)
                return this;
            },

            with_durability(min=10) {
                this.filters.push(slot => slot.getDurability() > min || slot.getMaxDurability() < min)
                return this;
            },

            toString() {
                let value = this.name + " " + this.suffix
                value = value.replace("_", " ")
                return value
            }
        }
    },

    axe() {
        return bot.item.of("diamond_axe").with_enchant("Efficiency", 5).with_durability(10)
    },

    select(item, slot) {
        bot.on_repeat.set("select", () => {
            bot.INVENTORY.setSelectedHotbarSlotIndex(slot)
            const slots = this.find(item);

            if (slots.includes(36+slot)) return;

            if (slots.length === 0) {
                throw new Error("Couldn't find " + item.toString() + " in inventory")
            }

            bot.INVENTORY.swapHotbar(slots[0], slot);
            Client.waitTick(1)
        })

        bot.control.once()
    },

    unselect() {
        bot.on_repeat.set("select", () => {})
    },

    get_holding() {
        let idx = bot.INVENTORY.getSelectedHotbarSlotIndex()
        return bot.item.of_slot(idx)
    },

    is_holding(item) {
        let idx = bot.INVENTORY.getSelectedHotbarSlotIndex()
        idx += 36
        let slot = bot.INVENTORY.getSlot(idx)
        return item.matches(slot)
    },

    find(item) {
        const slots = []

        const count = bot.INVENTORY.getTotalSlots()

        for (let i = 0; i < count; i++) {
            let slot = bot.INVENTORY.getSlot(i)
            slot.getItemId()
            if (!item.matches(slot)) continue
            slots.push(i)
        }
        return slots
    },

    count(item) {
        const slots = bot.item.find(item)
        let sum = 0
        slots.forEach(i => {
            sum += bot.INVENTORY.getSlot(i).getCount()
        })
        return sum
    },

    drop_all_of(item) {
        const slots = bot.item.find(item)
        slots.forEach(i => {
            bot.INVENTORY.dropSlot(i, true);
            Client.waitTick(3);
        })
    },

    drop_most_of(item) {
        const slots = bot.item.find(item)
        slots.pop()
        slots.forEach(i => {
            bot.INVENTORY.dropSlot(i, true);
            Client.waitTick(3);
        })
    },

    drop_one_of(item) {
        const slots = bot.item.find(item)
        if (slots.length === 0) return;
        bot.INVENTORY.dropSlot(slots[0], true);
        Client.waitTick(3);
    },

    craft(item, stack= false, drop= false) {
        bot.control.safe(() => {
            const inv = Player.openInventory()
            const recipes = inv.getCraftableRecipes();
            for (let i = 0; i < recipes.length; i++) {
                /** @type {RecipeHelper} */
                const recipe = recipes[i];
                if (!item.matches(recipe.getOutput())) continue

                if (!recipe.canCraft()) {
                    throw new Error("Not enough items to craft");
                }

                recipe.craft(stack)
                Client.waitTick(3)

                if (drop) {
                    inv.dropSlot(0, true)
                } else {
                    inv.quick(0)
                }

                Client.waitTick(5)
                return;
            }
        })
    }
}
