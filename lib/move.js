const { input } = require("./input")
const { math } = require("./math")
const { dir } = require("./directions")

let do_move = true;
let allow_diagonal = true;

bot_state.on_repeat.set("move", step)

function stop() {
    KeyBind.releaseKeyBind(input.FORWARD)
    KeyBind.releaseKeyBind(input.BACKWARD)
    KeyBind.releaseKeyBind(input.RIGHT)
    KeyBind.releaseKeyBind(input.LEFT)
}

exports.move = {
    toDir(direction, distance, center=true) {
        const offset = dir.to_vec(direction).scale(distance);
        let new_pos = this.target.add(offset)
        if (center) new_pos = math.centralize(new_pos)
        this.toPos(new_pos);
    },

    toPos(pos) {
        this.target = pos
    },

    toggle(state) {
        do_move = state;
        if (!do_move) stop()
    },

    toggle_diagonal(value) {
        allow_diagonal = value
    },

    target: bot_state.PLAYER.getPos()
}

exports.reached_target = function () {
    const offset = exports.move.target.sub(bot_state.PLAYER.getPos()); offset.y = 0;
    let keep_walking = math.length(offset) >= .2
    if (!keep_walking) stop()
    return keep_walking
}

function step(i) {
    if (!do_move || i === 0) return
    const offset = exports.move.target.sub(bot_state.PLAYER.getPos());
    offset.y = 0;

    const yaw = bot_state.PLAYER.getYaw() * Math.PI / 180
    const forward = PositionCommon.createPos(-Math.sin(yaw), 0, Math.cos(yaw))
    const right   = PositionCommon.createPos(-Math.cos(yaw), 0, -Math.sin(yaw))

    const f = math.dot(offset, forward)
    const r = math.dot(offset, right)

    const eps = 0.15

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

    KeyBind.keyBind(input.FORWARD,  forwardPressed)
    KeyBind.keyBind(input.BACKWARD, backwardPressed)
    KeyBind.keyBind(input.RIGHT,    rightPressed)
    KeyBind.keyBind(input.LEFT,     leftPressed)
}
