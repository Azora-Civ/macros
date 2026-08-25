module.exports = {
    help: "Displays the distance from where you started. Pause to stop.",
    name: __filename
        .replace(/^.*[\\/]commands[\\/]/, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[\\/]/g, " "), // defaults to filename w/o extension

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args()
        //with_args(builder => builder.wordArg("my_arg"))
    },

    run(arg) {
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
    },
}
