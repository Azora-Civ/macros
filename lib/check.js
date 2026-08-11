const assertions = new Map()

bot.on_repeat.set("Checks", (iter) => {
    if (iter % 50 !== 0) return

    for (const [key, func] of assertions) {
        assert(key, func)
    }
})



module.exports = {
    assert(msg, func=null) {
        if (func === null) {
            assertions.delete(msg)
        } else {
            assertions.set(msg, func)
        }
    },

    assert_once(msg, func) {
        bot.control.safe(() => assert(msg, func))
    },

    hold_min_height(toggle=true) {
        const key = "Falling!"

        if (!toggle) {
            this.assert(key, null)
        } else {
            const y = bot.PLAYER.getPos().y - .5 // some allowance

            this.assert(key, () => y < bot.PLAYER.getPos().y)
        }
    },

    healthy(hp = 14) {
        this.assert("Low health!", () => bot.PLAYER.getHealth() >= hp)
    },

    has_stone(toggle=true) {
        const key = "Nearly out of stone!"

        if (!toggle) {
            this.assert(key, null)
        } else {
            const stone = bot.item.of("stone")

            this.assert(key, () => bot.item.count(stone) > 5)
        }
    }
}

function assert(msg, func) {
    if (!func()){
        throw new Error(msg)
    }
}