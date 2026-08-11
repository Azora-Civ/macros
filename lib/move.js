let do_move = true;
let allow_diagonal = true;

bot.on_repeat.set("move", step)

let eps = 0.15

let last_pos = bot.math.vec(0,0,0)

function stop() {
    KeyBind.releaseKeyBind(bot.input.FORWARD)
    KeyBind.releaseKeyBind(bot.input.BACKWARD)
    KeyBind.releaseKeyBind(bot.input.RIGHT)
    KeyBind.releaseKeyBind(bot.input.LEFT)
}

module.exports = {
    toDir(direction, distance, center=true) {
        const offset = bot.dir.to_vec(direction).scale(distance);
        let new_pos = this.target.add(offset)
        if (center) new_pos = bot.math.centralize(new_pos)
        this.toPos(new_pos);
    },

    toPos(pos) {
        this.target = pos
    },

    jumpToHeight(diff) {
        if (diff <= 0) {
            bot.input.remove(bot.input.JUMP)
            bot.on_repeat.set("jump", ()=>{})
            return
        }

        let y = bot.PLAYER.getPos().y
        y += diff

        bot.on_repeat.set("jump", () => {
            const offset = y - bot.PLAYER.getPos().y
            if ((offset - 0.15) > 0) {
                bot.input.add(bot.input.JUMP)
            } else {
                bot.input.remove(bot.input.JUMP)
            }
        })
    },

    toggle(state) {
        do_move = state;
        if (!do_move) stop()
    },

    toggle_diagonal(value) {
        allow_diagonal = value
    },

    set_eps(new_eps) {
        if (new_eps <= 0) {
            new_eps = 0.15
        }
        eps = new_eps
    },

    target: bot.PLAYER.getPos(),

    not_reached_target() {
        const offset = bot.move.target.sub(bot.PLAYER.getPos()); offset.y = 0;
        let keep_walking = bot.math.length(offset) >= eps
        if (!keep_walking) stop()
        return keep_walking
    },

    is_moving(threshold=.02) {
        last_pos = bot.PLAYER.getPos()
        return (iter) => {
            if (iter % 50 !== 0 || iter <= 200) {
                return true
            }

            const current_pos = bot.PLAYER.getPos()
            const distance = bot.math.distance(last_pos, current_pos)
            last_pos = current_pos

            return distance > threshold
        }
    }
}

function step(i) {
    if (!do_move || i === 0) return
    const offset = bot.move.target.sub(bot.PLAYER.getPos());
    offset.y = 0;

    const yaw = bot.PLAYER.getYaw() * Math.PI / 180
    const forward = PositionCommon.createPos(-Math.sin(yaw), 0, Math.cos(yaw))
    const right   = PositionCommon.createPos(-Math.cos(yaw), 0, -Math.sin(yaw))

    const f = bot.math.dot(offset, forward)
    const r = bot.math.dot(offset, right)

    let forwardPressed  = f > eps
    let backwardPressed = f < -eps
    let rightPressed    = r > eps
    let leftPressed     = r < -eps

    if (!allow_diagonal) {
        const absF = Math.abs(f)
        const absR = Math.abs(r)

        if (absF > absR) {
            rightPressed = leftPressed = false
        } else {
            forwardPressed = backwardPressed = false
        }
    }

    KeyBind.keyBind(bot.input.FORWARD,  forwardPressed)
    KeyBind.keyBind(bot.input.BACKWARD, backwardPressed)
    KeyBind.keyBind(bot.input.RIGHT,    rightPressed)
    KeyBind.keyBind(bot.input.LEFT,     leftPressed)
}
