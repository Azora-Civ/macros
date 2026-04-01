const { control } = require("./control")

exports.item = {
    of(name) {
        return this.builder().with_name(name)
    },

    builder() {
        return {
            name: "undefined",
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
                this.filters.push(slot => slot.getEnchantment(name).getLevel() >= min_level)
                return this;
            },

            with_durability(min) {
                this.filters.push(slot => slot.getDurability() > 10 || slot.getMaxDurability() < 10)
                return this;
            }
        }
    },

    select(item, slot) {
        bot_state.on_repeat.set("select", () => {
            bot_state.INVENTORY.setSelectedHotbarSlotIndex(slot)
            const slots = this.find(item);

            if (slots.includes(36+slot)) return;

            if (slots.length === 0) {
                throw new Error("Couldn't find " + item.name + " in inventory")
            }

            bot_state.INVENTORY.swapHotbar(slots[0], slot);
            Client.waitTick(4)
        })

        control.once()
    },

    is_holding(item) {
        let idx = bot_state.INVENTORY.getSelectedHotbarSlotIndex()
        idx += 36
        let slot = bot_state.INVENTORY.getSlot(idx)
        return item.matches(slot)
    },

    find(item) {
        const slots = []

        const count = bot_state.INVENTORY.getTotalSlots()

        for (let i = 0; i < count; i++) {
            let slot = bot_state.INVENTORY.getSlot(i)
            slot.getItemId()
            if (!item.matches(slot)) continue
            slots.push(i)
        }
        return slots
    },

    drop_all_of(item) {
        const slots = module.exports.item.find(item)
        slots.forEach(i => {
            bot_state.INVENTORY.dropSlot(i, true);
            Client.waitTick(3);
        })
    },

    drop_one_of(item) {
        const slots = module.exports.item.find(item)
        if (slots.length === 0) return;
        bot_state.INVENTORY.dropSlot(slots[0], true);
        Client.waitTick(3);
    },

    craft(item) {
        control.safe(() => {
            const recipes = bot_state.INVENTORY.getCraftableRecipes();
            for (let i = 0; i < recipes.length; i++) {
                /** @type {RecipeHelper} */
                const recipe = recipes[i];
                if (!item.matches(recipe.getOutput())) continue

                if (!recipe.canCraft()) {
                    throw new Error("Not enough items to craft");
                }

                recipe.craft(false)
                Client.waitTick(3)
                bot_state.INVENTORY.quick(0)
                Client.waitTick(5)
                return;
            }
        })
    }
}
