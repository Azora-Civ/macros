const { multi_positional } = require("../script_def")

module.exports = {
    ...multi_positional([
        vec(9426, 115, 1735),
        vec(9424, 54, 1737),
    ]),

    // getName() { return null; }
    // shouldRun() { return false; }
    run: require("../../utils/bleeze_wait.js")
}
