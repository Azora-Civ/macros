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
        Chat.say(emergency_chat + " " + text);
    },

    private_alert(text) {
        if (emergency_chat.toLowerCase().includes("azora")) return

        Chat.say(emergency_chat + " " + text);
    }
}

print = (text) => bot.logger.debug(text)
