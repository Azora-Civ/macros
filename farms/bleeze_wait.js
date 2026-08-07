const CHECK_INTERVAL_TICKS = 20; // once per second
const SEARCH_RADIUS = 128;
const TARGET_NAME = "Bleeze";

let ticks = 0;
let seen_bleeze = false;

module.exports = function () {
    bot.move.toDir(bot.dir.NORTH, 0)
    bot.look.towards(bot.dir.NORTH, 90)

    bot_state.on_repeat.set("bleeze", check_bleeze)
    bot.control.loop(() => !seen_bleeze)
    bot_state.on_repeat.set("bleeze", null)


    Chat.log(`§6⚠⚠⚠ Bleeze detected! ⚠⚠⚠`);
    for (let i = 0; i < 8; i++) {
        Client.waitTick(4)
        World.playSound("minecraft:block.note_block.chime", 1, .05);
    }
}

function check_bleeze() {
    if (++ticks < CHECK_INTERVAL_TICKS) return;
    ticks = 0;

    if (!World.isWorldLoaded()) {
        detected = false;
        return;
    }

    const bleeze = World
        .getEntities(SEARCH_RADIUS, ["minecraft:blaze"])
        .find(entity => entity.getName().getString() === TARGET_NAME);

    if (bleeze) {
        seen_bleeze = true
    }
}
