module.exports = function () {
    bot.input.toggle_sneak(true)
    bot.input.add(bot.input.FORWARD)
    bot.input.add(bot.input.ATTACK)

    while (!bot.is_paused()) {
        bot.on_repeat.emit(0)
        Time.sleep(1)
    }
    bot.input.unpress_all()
}