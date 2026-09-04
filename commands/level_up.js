module.exports = {
    help: "Uses emeralds to get to a level of xp. Either specify a level or hold a tool to use its repair level. Not really efficient rn tbh. But it works well for 30",
    name: __filename
        .replace(/^.*[\\/]commands[\\/]/, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[\\/]/g, " "), // defaults to filename w/o extension

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args()
        with_args(b => b.intArg("level", 1, 30))
    },

    run(arg) {
        let target_level = arg("level")

        if (!target_level) {
            const item = bot.item.get_holding().raw
            if (!item.isTool()) {
                bot.logger.info("Either provide a target level or hold a tool to select its repair level.")
                return
            }
            target_level = item.getRepairCost() + 2
        }

        bot.action.complex.xp_up(target_level, 0)
    },
}
