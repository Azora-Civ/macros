module.exports = function () {
    let layers = 8

    let do_layer = require("../../map")

    bot.start()
    bot.progress.init(8)

    for (let i = 0; i < layers; i++) {
        bot.action.elevator(1)
        do_layer()
        bot.progress.increment()
    }

    bot.action.elevator(-layers)

    bot.progress.finish()
    bot.finish()
}