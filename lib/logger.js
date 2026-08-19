module.exports = {
    debug(text) {
        if (debug) {
            this.info(text)
        }
    },

    info(text) {
        Chat.log(text);
    },

    alert(text) {
        if (!do_discord_pings) return
        Chat.say("/g AzoraFarms <@!> " + text);
    },

    private_alert(text) {
        if (!do_discord_pings) return
        Chat.say("/g AzoraFarms <@!p> " + text);
    }
}

print = (text) => bot.logger.debug(text)

dump = (obj, depth = 3, prepend="  ", seen = new Set(), show_name= true) => {
    if (show_name)
        print(String(obj))

    if (depth < 0 || obj == null || typeof obj !== "object") {
        print(String(obj))
        return
    }

    if (seen.has(obj)) {
        print("[Circular]")
        return
    }

    seen.add(obj)

    for (const [key, value] of Object.entries(obj).slice(0, 50)) {
        print(prepend + key + ": " + (
            value && typeof value === "object" ? "[object]" : value
        ))

        if (value && typeof value === "object")
            dump(value, depth - 1, prepend+"  ", seen, false)
    }
}
