exports.logger = {
    info(text) {
        Chat.log(text);
    },

    alert(text) {
        Chat.say(emergency_chat + " " + text);
    }
}


