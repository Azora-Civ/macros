const draw = Hud.createDraw3D()
draw.register()

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

    draw_box(pos, size) {
        return draw.addBox(
            pos.x - size.x/2, pos.y - size.y/2, pos.z - size.z/2,
            pos.x + size.x/2, pos.y + size.y/2, pos.z + size.z/2,
            0x00FF00,       // outline color
            0x00FF00,       // fill color
            false            // filled?
        )
    },

    delete_box(box) {
        if (box)
            draw.removeBox(box)
    }
}