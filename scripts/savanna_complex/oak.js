const { positional, layered } = require("../script_def")
const tree_farm = require("../../utils/tree_farm");

module.exports = {
    ...layered(vec(8970, 79, 2554), 9, 10, "Savanna Oak"),
    run() {
        tree_farm(SOUTH, WEST, 17, 18, 5, true, 1800, true, "oak")
    }
}
