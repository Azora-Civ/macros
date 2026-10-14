const { positional, layered } = require("../script_def")
const tree_farm = require("../../utils/tree_farm");

module.exports = {
    ...layered(vec(8885, 79, 2554), 9, 10, "Savanna Acacia"),
    run() {
        tree_farm(bot.dir.SOUTH, bot.dir.WEST, 10, 15, 6, true, 500, true, "acacia")
    }
}
