module.exports = {
    help: "",
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
        // const my_arg = arg("my_arg", null)
        let pos = bot.player().getPos()
        pos = bot.math.floor(pos)
        Client.setClipboard(`${pos.x}, ${pos.y}, ${pos.z}`);
        bot.logger.info("Copied position to clipboard.")
    },
}
