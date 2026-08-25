bot = require("./bot.js")

const HOLD_TIME_MILLIS = 1000

function is_holding() {
    const key = event.key

    let held_time = 0;

    while (held_time < HOLD_TIME_MILLIS) {
        const is_pressed = bot.input.key_held(key)
        if (!is_pressed) return false

        Client.waitTick(2)
        held_time += 100
    }

    return true
}


if (is_holding()) {
    bot.manage.kill_running()
    bot.manage.load_commands()
    return
}

if (bot.manage.is_already_running()) {
    bot.toggle_pause()
    return
}

bot.manage.set_is_running(true)
try {
    bot.manage.load_commands()
    require("./map.js")()
}
finally {
    bot.manage.set_is_running(false)
}
