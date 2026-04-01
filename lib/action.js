const { control } = require("./control")
const { move, reached_target } = require("./move")
const { input, held_buttons } = require("./input")
const { look } = require("./look")
const do_tree = require("./actions/tree")

exports.action = {
    move(direction, distance, center=true) {
        move.toDir(direction, distance, center)
        control.loop(reached_target)
    },

    move_mine(direction, distance, center=true, pitch=45) {
        look.towards(direction, pitch)
        input.add(input.ATTACK)
        this.move(direction, distance, center)
        input.remove(input.ATTACK)
    },

    center() {
        this.move(0,0,true)
    },

    elevator: function (level) {
        if (level === 0) return;

        let key = level < 0 ? input.SNEAK : input.JUMP;

        level = Math.abs(level);
        for (let i = 0; i < level; i++) {
            KeyBind.pressKeyBind(key);
            Client.waitTick(4);
            KeyBind.releaseKeyBind(key);
            Client.waitTick(4);
        }
    },

    wait(millis) {
        const threshold = Time.time() + millis;
        control.loop(() => threshold > Time.time());
    },

    mine(direction, pitch, millis) {
        const buttons_before = held_buttons.slice()
        const to_press = held_buttons.slice()
        to_press.push(input.ATTACK)

        look.towards(direction, pitch)
        input.set(to_press)

        this.wait(millis)

        input.set(buttons_before)
        Client.waitTick(1)
    },

    interact(direction, pitch, millis) {
        const buttons_before = held_buttons.slice()
        const to_press = held_buttons.slice()
        to_press.push(input.USE)

        look.towards(direction, pitch)
        input.set(to_press)

        this.wait(millis)

        input.set(buttons_before)
        Client.waitTick(1)
    },

    complex: {
        do_tree
    }
}
