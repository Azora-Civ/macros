const CHECK_INTERVAL_TICKS = 20; // once per second
const SEARCH_RADIUS = 128;
const TARGET_NAME = "Bleeze";
const COOLDOWN_TIME = 1000;

let cooldown = 0;
let seen_bleeze = false;

module.exports = function () {
    bot.start()

    bot.move.toDir(bot.dir.NORTH, 0)
    bot.look.towards(bot.dir.NORTH, 90)

    bot.on_repeat.set("bleeze", check_bleeze)
    bot.control.loop(() => !seen_bleeze)
    bot.on_repeat.set("bleeze", null)

    bot.logger.info(`§6⚠⚠⚠ Bleeze detected! ⚠⚠⚠`)
    bot.logger.private_alert(`§6⚠⚠⚠ Bleeze detected! ⚠⚠⚠`)
    for (let i = 0; i < 8; i++) {
        Client.waitTick(4)
        World.playSound("minecraft:block.note_block.chime", 1, .05);
    }

    bot.world.leave(true)
    bot.finish()
}

function check_bleeze(iter) {
    cooldown--;
    if (--cooldown > 0) return;
    if (iter % CHECK_INTERVAL_TICKS !== 0) return;
    ticks = 0;

    if (!World.isWorldLoaded()) {
        return;
    }

    const entities = World.getEntities(SEARCH_RADIUS, ["minecraft:blaze"])

    if (!entities) return;

    const bleeze = entities.find(entity => entity.getName().getString() === TARGET_NAME);

    if (bleeze) {
        seen_bleeze = true
    }
}
