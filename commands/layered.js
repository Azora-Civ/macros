module.exports = {
    help: "Supply a string like: xooxx. where x->farm this layer, o->skip. Assumes you are standing on a lodestone with a supported farm.",
    name: __filename
        .replace(/^.*[\\/]commands[\\/]/, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[\\/]/g, " "),

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args(builder => builder.wordArg("xo_mask"))
    },

    run(arg) {
        const do_layer = require("../map")
        const mask = arg("xo_mask")

        bot.start((mask.match(/x/gi) ?? []).length)

        for (let i = 0; i < mask.length; i++) {
            if (i > 0) {
                bot.action.elevator(1)
            }

            if (mask[i].toLowerCase() !== "x") {
                Client.waitTick(10)
                continue
            }

            Client.waitTick(10)

            do_layer()
            bot.progress.increment()
        }

        bot.action.elevator(-(mask.length - 1))

        bot.finish()
    },
}