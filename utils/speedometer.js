module.exports = function () {
    let pos = bot.player().getPos()
    const samples = []
    const window = 5

    bot.on_repeat.set("main", () => {
        const new_pos = bot.player().getPos()
        const distance = bot.math.distance(pos, new_pos)
        pos = new_pos

        samples.push(distance)
        if (samples.length > window) samples.shift()

        const speed = samples.reduce((a, b) => a + b, 0) / samples.length
        bot.ui.action_bar(`Speed: ${speed.toFixed(2)} blocks/s`)
        Client.waitTick(20)
    })

    bot.control.loop(() => !bot.is_paused())
}