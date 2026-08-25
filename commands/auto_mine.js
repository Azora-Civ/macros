module.exports = {
    help: "Simple script that holds: sneak, left click, and forward",
    name: __filename
        .replace(/^.*[\\/]commands[\\/]/, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[\\/]/g, " "), // defaults to filename w/o extension

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args()
    },

    run(arg) {
        bot.input.unpress_all()
        bot.move.toggle(false)
        bot.input.toggle_sneak(true)
        bot.input.add(bot.input.FORWARD)
        bot.input.add(bot.input.ATTACK)

        while (!bot.is_paused()) {
            bot.on_repeat.emit(0)
            Time.sleep(1)
        }
        bot.input.unpress_all()
    },
}
