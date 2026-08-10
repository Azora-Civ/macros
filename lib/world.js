// bot.on_repeat.set("Ensure Logged", () => {
//     if (module.exports.isJoined()) return
//
//     module.exports.joinCiv()
// })

module.exports = {
    isJoined() {
        return World.isWorldLoaded()
    },

    leave(force = false) {
        if (!this.isJoined()) return

        Chat.say("/logout");
        if (!force) return;

        Client.waitTick(20*15)
        this.force_leave()
    },

    force_leave() {
        if (this.isJoined()) {
            Client.disconnect()
        }
    },


    join(ip) {
        Client.connect(ip)
    },

    joinCiv() {
        this.join("Play.CivMC.net")
    },
}