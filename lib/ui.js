module.exports = {
    select(title, options) {
        const screen = Hud.createScreen(title, false)
        const eventName = `ui_select_${Date.now()}`
        const selectionEvent = JsMacros.createCustomEvent(eventName)

        let selected = null

        selectionEvent.registerEvent()

        const finish = value => {
            selected = value
            selectionEvent.trigger()
        }

        screen.setOnInit(JavaWrapper.methodToJava(() => {
            const width = 200
            const height = 20
            const spacing = 4

            const x = Math.floor((screen.getWidth() - width) / 2)
            const startY = Math.floor(
                (screen.getHeight() - options.length * (height + spacing)) / 2
            )

            options.forEach((option, i) => {
                screen.addButton(
                    x,
                    startY + i * (height + spacing),
                    width,
                    height,
                    option,
                    JavaWrapper.methodToJava(() => {
                        finish(i)
                        screen.close()
                    })
                )
            })
        }))

        const waiter = JsMacros.waitForEvent(
            eventName,
            null,
            JavaWrapper.methodToJava(() => Hud.openScreen(screen))
        )

        waiter.context.releaseLock()

        return selected
    },

    action_bar(msg) {
        Chat.actionbar(msg)
    },

    get_scoreboard() {
        const result = []
        for (const line of World.getScoreboards().getCurrentScoreboard().getTexts()) {
            result.push(line.getStringStripFormatting())
        }
        return result
    }

}