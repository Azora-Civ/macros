let ctb_state = null

exports.commands = {
    run(command, filter = null) {
        const eventContext = JsMacros.waitForEvent("RecvMessage", filter, JavaWrapper.methodToJava(() => {
            Chat.say(`/${command}`)
        }));
        eventContext.context.releaseLock();

        if (!eventContext) {
            throw new Error(`No matching response to /${command}`)
        }

        return eventContext.event.text.getString()
    },

    ctb(desiredState) {
        let oldState = ctb_state
        if (ctb_state === null) {
            const filter = JavaWrapper.methodToJava(event => {
                const text = event.text.getString()
                return text.startsWith("Bypass mode")
            })

            let response = this.run("ctb", filter)
            Chat.log(response)

            oldState = response === "Bypass mode has been disabled."

            ctb_state = !oldState
        }

        if (ctb_state !== desiredState) {
            this.run("ctb", filter)
        }

        return oldState
    }
}