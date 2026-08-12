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
