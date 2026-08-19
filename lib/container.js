module.exports = {
    get_snapshot() {
        const snapshot = []
        const slot_count = bot.inv().getTotalSlots()

        for (let i = 0; i < slot_count; i++) {
            snapshot.push(bot.item.of_slot(i, false))
        }

        return snapshot
    },

    set_snapshot(snapshot) {
        const wanted = slot_map(snapshot)
        const slot_count = bot.inv().getTotalSlots()
        const current = []
        for (let i = 0; i < slot_count; i++) {
            current.push(bot.item.of_slot(i, false))
        }

        const actual = slot_map(current)

        // align inventory to snapshot
        for (const [item, wanted_slots] of wanted) {
            const actual_slots = actual.get(item) ?? []

            for (let i = 0; i < wanted_slots.length; i++) {
                const wanted_slot = wanted_slots[i]
                const actual_slot = actual_slots[i]

                if (actual_slot == null || actual_slot === wanted_slot) {
                    continue
                }

                bot.inv().swap(wanted_slot, actual_slot)

                // keep our tracked state correct after the swap
                for (const slots of actual.values()) {
                    const a = slots.indexOf(actual_slot)
                    const b = slots.indexOf(wanted_slot)

                    if (a !== -1) slots[a] = wanted_slot
                    if (b !== -1) slots[b] = actual_slot
                }
            }
        }
    }
}

function slot_map(items) {
    const map = new Map()

    for (let i = 0; i < items.length; i++) {
        const key = items[i].toString()

        if (!map.has(key)) {
            map.set(key, [])
        }

        map.get(key).push(i)
    }

    return map
}
