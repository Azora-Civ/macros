module.exports = function () {
    const result = bot.ui.select("Choose a script!", ["a", "b", "c"])
    Chat.log(result)
}
