module.exports = function () {
    let layers = 13
    let do_layer = require("../../map")

    bot.start()
    bot.progress.init(layers)

    for (let i = 0; i < layers; i++) {
        bot.action.elevator(1)
        do_layer()
    }
    bot.action.elevator(-layers)

    bot.progress.finish()
    bot.finish()
}