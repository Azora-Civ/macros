module.exports = {
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


