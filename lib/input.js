bot_state.on_repeat.set("input", ensure_pressed)

bot_state.on_repeat.set("Button check", (iter) => {
    if (iter % 20 !== 0) {
        return
    }

    if (GlobalVars.getBoolean("bot_is_paused") ?? false) {
        throw new Error("Halting...")
    }

    if (exports.input.is_pressed(bot_state.user.option1_key)) {
        exports.input.option1()
    }

    if (exports.input.is_pressed(bot_state.user.option2_key)) {
        exports.input.option2()
    }
})

exports.input = {
    FORWARD: "key.forward", RIGHT: "key.right", BACKWARD: "key.back", LEFT: "key.left",
    SPRINT: "key.sprint", SNEAK: "key.sneak", JUMP: "key.jump", ATTACK: "key.attack", USE: "key.use",

    set(list) {
        for (let button of exports.held_buttons) KeyBind.releaseKey(button)

        const bindings = KeyBind.getKeyBindings()
        exports.held_buttons = []
        for (let keybind of list) {
            let key = bindings.get(keybind)
            if (key == null)
                key = keybind
            exports.held_buttons.push(key)
        }

        for (let button of exports.held_buttons) {
            KeyBind.pressKey(button)
        }
    },

    add(button) {
        const bindings = KeyBind.getKeyBindings()
        let key = bindings.get(button) ?? button

        if (exports.held_buttons.includes(key)) return

        exports.held_buttons.push(key)
        KeyBind.pressKey(key)
    },

    remove(button) {
        const bindings = KeyBind.getKeyBindings()
        let key = bindings.get(button) ?? button

        const idx = exports.held_buttons.indexOf(key)
        if (idx === -1) return

        exports.held_buttons.splice(idx, 1)
        KeyBind.releaseKey(key)
    },

    release_all() {
        this.set([]);
    },

    is_pressed(key) { return KeyBind.getPressedKeys().contains(key) },
    option1: () => {},
    option2: () => {}
}

exports.held_buttons = []

exports.unpress_all = function () {
    let pressed = KeyBind.getPressedKeys()
    for (let i = 0; i < pressed.length; i++) {
        Chat.log(pressed[i])
        KeyBind.releaseKey(pressed[i])
    }

    KeyBind.releaseKeyBind(exports.input.FORWARD)
    KeyBind.releaseKeyBind(exports.input.BACKWARD)
    KeyBind.releaseKeyBind(exports.input.RIGHT)
    KeyBind.releaseKeyBind(exports.input.LEFT)
}

function ensure_pressed(iter) {
    if (iter % 200 !== 0) return

    let pressed = KeyBind.getPressedKeys()
    for (let button of exports.held_buttons) {
        if (pressed.contains(button)) {
            continue
        }

        KeyBind.pressKey(button)
    }
}
