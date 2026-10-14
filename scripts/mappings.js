mappings = [
    require("./badlands_complex/oak"),

    require("./dark_forest_complex/dark_oak"),
    require("./dark_forest_complex/jungle"),

    require("./loose/bleeze"),

    require("./savanna_complex/acacia"),
    require("./savanna_complex/melon"),
    require("./savanna_complex/oak"),

    require("./debug")
]

module.exports = function () {
    for (let mapping of mappings) {
        if (mapping.shouldRun()) {
            const name = mapping.getName()

            if (name) Chat.say(`/g AzoraFarms started: ${name}`)
            mapping.run()
            if (name) Chat.say(`/g AzoraFarms finished: ${name}`)

            return true
        }
    }

    bot.logger.info("No relevant script found. Are you sure you are at the right position?")
    return false
}
