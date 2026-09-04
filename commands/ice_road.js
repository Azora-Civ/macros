const interval = 50

module.exports = {
    help: "Automatically uses an iceroad. Use A & D to change direction.",
    name: __filename
        .replace(/^.*[\\/]commands[\\/]/, "")
        .replace(/\.[^.]+$/, "")
        .replace(/[\\/]/g, " "), // defaults to filename w/o extension

    /**
     * @param {(callback: (builder: CommandBuilder) => CommandBuilder) => any} with_args
     */
    register(with_args) {
        with_args()
        //with_args(builder => builder.wordArg("my_arg"))
    },

    run(arg) {
        set_dir_octant(0)

        bot.input.unpress_all()
        bot.move.toggle(false)
        bot.input.add(bot.input.FORWARD)
        bot.input.add(bot.input.SPRINT)

        bot.on_repeat.set("ice_road", iter => {
            if (iter % (interval*2) === 0) {
                bot.input.add(bot.input.JUMP)
            }
            if ((iter+interval) % (interval*2) === 0) {
                bot.input.remove(bot.input.JUMP)
            }
        })

        let iter = 0
        while (!bot.is_paused()) {
            if (bot.input.key_down(bot.input.RIGHT)) {
                set_dir_octant(1)
            }
            if (bot.input.key_down(bot.input.LEFT)) {
                set_dir_octant(-1)
            }

            bot.on_repeat.emit(iter++)
            Time.sleep(1)
        }
        bot.input.unpress_all()
    },
}

function set_dir_octant(offset) {
    const OCTANT = 45

    let dir = bot.dir.get_dir(false)
    const snapped = bot.dir.snap_octant(dir)
    const close_enough = Math.abs(dir - snapped) < .3

    if (close_enough) {
        dir = snapped
    } else if (offset > 0) {
        dir = Math.ceil(dir / OCTANT) * OCTANT
        offset--
    } else if (offset < 0) {
        dir = Math.floor(dir / OCTANT) * OCTANT
        offset++
    }

    dir += OCTANT * offset
    dir = bot.dir.snap_octant(dir)

    bot.look.towards(dir, 0)
    bot.look.unset()
}
