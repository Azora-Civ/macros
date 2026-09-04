module.exports = {
    of(name, compacted=false) {
        return this.builder().with_name(name).is_compacted(compacted)
    },

    of_slot(slot, hotbar= true) {
        slot = bot.inv().getSlot(slot + (hotbar ? 36 : 0))

        const item = this.builder()
            .with_name(slot.getItemId().replace("minecraft:", ""))

        for (const enchantment of slot.getEnchantments()) {
            item.with_enchant(enchantment.getId(), enchantment.getLevel())
        }

        if (!slot.isEnchanted()) {
            item.no_enchant()
        }

        item.raw = slot

        return item
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

                if (!name.includes(":")) {
                    name = "minecraft:" + name.toLowerCase()
                }

                this.filters.push(slot => slot.getEnchantment(name) != null && slot.getEnchantment(name).getLevel() >= min_level)

                return this;
            },

            no_enchant() {
                this.filters.push(slot => !slot.isEnchanted())

                return this
            },

            is_compacted(value) {
                this.filters.push(slot => {
                    const lore = slot.getLore().map(line => line.withoutFormatting().getString());
                    return lore.includes("Compacted Item") === value
                })

                return this
            },

            with_durability(min=10) {
                this.filters.push(slot => slot.getDurability() > min || slot.getMaxDurability() < min)
                return this;
            },

            toString() {
                let value = this.name
                if (this.suffix) {
                    value += " " + this.suffix
                }
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
            const inv = bot.inv()
            inv.setSelectedHotbarSlotIndex(slot)
            const slots = this.find(item);

            if (slots.includes(36+slot)) return;

            if (slots.length === 0) {
                throw new Error("Couldn't find " + item.toString() + " in inventory")
            }

            inv.swapHotbar(slots[0], slot);

            for (let i = 0; i < 10 && !bot.item.is_holding(item); i++) {
                Client.waitTick(1)
            }
            Client.waitTick(2)
        })

        bot.control.once()
    },

    empty(slot) {
        const item = bot.item.of("air")

        bot.on_repeat.set("select", () => {
            const inv = bot.inv()
            inv.setSelectedHotbarSlotIndex(slot)

            if (bot.item.is_holding(item)) return;

            inv.quick(36+slot)

            for (let i = 0; i < 10 && !bot.item.is_holding(item); i++) {
                Client.waitTick(1)
            }
        })

        bot.control.once()
    },

    ensure_min_count(item, number, craft_stacks=false) {
        while (bot.item.count(item) < number) {
            bot.item.craft(item, craft_stacks)
            Client.waitTick(3)
        }
    },

    unselect() {
        bot.on_repeat.set("select", () => {})
    },

    get_holding() {
        let idx = bot.inv().getSelectedHotbarSlotIndex()
        return bot.item.of_slot(idx)
    },

    is_holding(item) {
        let idx = bot.inv().getSelectedHotbarSlotIndex()
        idx += 36
        let slot = bot.inv().getSlot(idx)
        return item.matches(slot)
    },

    find(item) {
        const slots = []

        const count = bot.inv().getTotalSlots()

        for (let i = 0; i < count; i++) {
            let slot = bot.inv().getSlot(i)
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
            sum += bot.inv().getSlot(i).getCount()
        })
        return sum
    },

    drop_all_of(item) {
        const slots = bot.item.find(item)
        slots.forEach(i => {
            bot.inv().dropSlot(i, true);
            Client.waitTick(3);
        })
    },

    drop_most_of(item) {
        const slots = bot.item.find(item)
        slots.pop()
        slots.forEach(i => {
            bot.inv().dropSlot(i, true);
            Client.waitTick(3);
        })
    },

    drop_one_of(item) {
        const slots = bot.item.find(item)
        if (slots.length === 0) return;
        bot.inv().dropSlot(slots[0], true);
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
                    throw new Error(`Not enough items to craft ${item.toString()}`);
                }

                recipe.craft(stack)
                Client.waitTick(3)

                if (drop) {
                    inv.dropSlot(0, stack)
                } else {
                    inv.quick(0)
                }

                Client.waitTick(5)
                return;
            }
        })
    }
}
