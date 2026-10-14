const def = require("./script_def")

module.exports = {
    getName() { return null; },
    shouldRun() { return debug; },
    run
}

function run() {
    bot.logger.info("It works!")
}
