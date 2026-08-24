module.exports = {
    help: "Automatically uses an iceroad. Use A & D to change direction. Hold food to auto eat.",
    name: __filename
        .replace(/^.*[\\/]/, "")
        .replace(/\.[^.]+$/, ""), // defaults to filename w/o extension

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args()
        //with_args(builder => builder.wordArg("my_arg"))
    },

    run(arg) {
        // const my_arg = arg("my_arg", null)
    },
}
