module.exports = function () {
    let layers = 3
    let do_layer = require("../../map.js")

    bot.start(layers)

    for (let i = 0; i < layers; i++) {
        bot.action.elevator(1)
        do_layer()
        bot.progress.increment()
    }
    bot.action.elevator(-layers)

    bot.finish()
}