bot.on_repeat.set("input", ensure_pressed)

let held_buttons = []

module.exports = {
    FORWARD: "key.forward", RIGHT: "key.right", BACKWARD: "key.back", LEFT: "key.left",
    SPRINT: "key.sprint", SNEAK: "key.sneak", JUMP: "key.jump", ATTACK: "key.attack", USE: "key.use", MIDDLE: "key.pickItem",
    ESCAPE: "key.escape",
    ARROW_UP: "key.keyboard.up", ARROW_RIGHT: "key.keyboard.right", ARROW_LEFT: "key.keyboard.left", ARROW_DOWN: "key.keyboard.down",

    set(list) {
        for (let button of held_buttons) KeyBind.releaseKey(button)

        const bindings = KeyBind.getKeyBindings()
        held_buttons = []
        for (let keybind of list) {
            let key = bindings.get(keybind)
            if (key == null)
                key = keybind
            held_buttons.push(key)
        }

        for (let button of held_buttons) {
            KeyBind.pressKey(button)
        }
    },

    add(button) {
        const bindings = KeyBind.getKeyBindings()
        let key = bindings.get(button) ?? button

        if (held_buttons.includes(key)) return

        held_buttons.push(key)
        KeyBind.pressKey(key)
    },

    remove(button) {
        const bindings = KeyBind.getKeyBindings()
        let key = bindings.get(button) ?? button

        const idx = held_buttons.indexOf(key)
        if (idx === -1) return

        held_buttons.splice(idx, 1)
        KeyBind.releaseKey(key)
    },

    toggle_sneak(value) {
        const has_sneak = this.is_pressed(this.SNEAK)
        if (has_sneak === value) return

        if (value) {
            this.add(this.SNEAK)
        }  else {
            this.remove(this.SNEAK)
        }
        bot.action.wait(200)

        return has_sneak
    },

    is_pressed(key) {
        const bindings = KeyBind.getKeyBindings()
        key = bindings.get(key) ?? key
        return KeyBind.getPressedKeys().contains(key) || (!bot.is_paused() && held_buttons.includes(key))
    },

    unpress_all() {
        for (let i = 0; i < held_buttons.length; i++) {
            KeyBind.releaseKey(held_buttons[i])
        }

        KeyBind.releaseKeyBind(this.FORWARD)
        KeyBind.releaseKeyBind(this.BACKWARD)
        KeyBind.releaseKeyBind(this.RIGHT)
        KeyBind.releaseKeyBind(this.LEFT)
    },

    escape() {
        bot.input.add(ESCAPE)
        bot.action.wait(100)
        bot.input.remove(ESCAPE)
    }
}

function ensure_pressed(iter) {
    if (iter % 200 !== 0) return

    let pressed = KeyBind.getPressedKeys()
    for (let button of held_buttons) {
        if (pressed.contains(button)) {
            continue
        }

        KeyBind.pressKey(button)
    }
}
