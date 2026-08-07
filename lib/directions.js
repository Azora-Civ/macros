const {control} = require("./control");
const {math} = require("./math");
const {move} = require("./move");
exports.dir = {
    NORTH: 180, EAST: -90, SOUTH: 0, WEST: 90,
    NORTHEAST: -135, SOUTHEAST: -45, SOUTHWEST: 45, NORTHWEST: 135,

    to_vec(dir) { const yaw = dir * Math.PI / 180; return PositionCommon.createPos(-Math.sin(yaw), 0, Math.cos(yaw)) },
    turn(direction, degrees) { return ((direction + degrees + 180) % 360) - 180; },
    turn_right(direction) { return this.turn(direction, 90) },
    turn_left(direction) { return this.turn(direction, -90) },
    turn_back(direction) { return this.turn(direction, 180) },

    between(a, b) { return this.turn(a, this.delta(a, b) * 0.5) },
    delta(a, b) { return ((((b - a) % 360) + 540) % 360) - 180 },
    snap_cardinal(dir) { return Math.round(dir / 90) * 90 },
    tangent(a, b) { return this.turn(a, this.delta(a, b) >= 0 ? 90 : -90) },

    block_relative(forward_yaw, right, up, forward) {
        const base = bot.math.centralize(bot_state.PLAYER.getPos());
        const yaw = forward_yaw * Math.PI / 180;

        const forwardX = -Math.sin(yaw);
        const forwardZ =  Math.cos(yaw);

        const rightX = -Math.cos(yaw);
        const rightZ = -Math.sin(yaw);

        return bot.math.vec(
            base.x + rightX * right + forwardX * forward,
            base.y + up,
            base.z + rightZ * right + forwardZ * forward
        );
    }
}
