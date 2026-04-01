exports.logger = {
    debug(text) {
        if (bot_state.user.log_level >= 1) return;
        Chat.log(text);
    },

    info(text) {
        if (bot_state.user.log_level >= 2) return
        Chat.say(bot_state.user.chat_prefix + " " + text);
    },

    alert(text) {
        const cfg = bot_state.user;
        if (cfg.log_level >= 3) return
        Chat.say(cfg.chat_prefix + " " + cfg.discord_handle + " " + text);
    }
}


