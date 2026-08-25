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
        const start_pos = bot.math.floor(bot.PLAYER.getPos())

        bot.move.toggle(false)

        bot.on_repeat.set("measure", iter => {
            if (iter % 50 !== 0) return

            const current_pos = bot.math.floor(bot.PLAYER.getPos())
            const diff = bot.math.abs(current_pos.sub(start_pos))

            bot.ui.action_bar(`Size §aX (E/W): ${diff.x}  §cY: ${diff.y}  §9Z (N/S): ${diff.z}`)
        })

        bot.control.loop(() => !bot.is_paused())
    },
}
