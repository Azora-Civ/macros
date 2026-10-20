const { positional, layered } = require("../script_def")
const tree_farm = require("../../utils/tree_farm")

module.exports = {
    ...layered(vec(8964, 103, 1406), 10, 4, "DF Jungle"),
    run() {
        tree_farm(bot.dir.NORTH, bot.dir.EAST, 10, 13, 5, true, 2800, true, "jungle")
    }
}
