exports.commands = {
    run(command) {
        const eventContext = JsMacros.waitForEvent("RecvMessage", null, JavaWrapper.methodToJava(() => {
            Chat.say(`/${command}`)
        }));
        eventContext.context.releaseLock();

        if (!eventContext) {
            throw new Error(`No matching response to /${command}`)
        }

        return eventContext.event.text.getString()
    },

    ctb(desiredState) {
        let response = this.run("ctb")

        let oldState = response === "Bypass mode has been disabled."
        let currentState = !oldState

        if (currentState !== desiredState) {
            this.run("ctb")
        }

        return oldState
    }
}