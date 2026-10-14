const { positional, layered } = require("../script_def")
const tree_farm = require("../../utils/tree_farm")

module.exports = {
    ...layered(vec(9557, 98, 2152), 9, 9, "Badlands Oak"),
    run() {
        tree_farm(bot.dir.EAST, bot.dir.NORTH, 21, 13, 5, true, 2000, true, "oak")
    }
}
