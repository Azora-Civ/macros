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
        Chat.say("/g AzoraFarms " + text);
    },

    private_alert(text) {
        Chat.say("/g AzoraFarms " + " " + text);
    }
}

print = (text) => bot.logger.debug(text)
