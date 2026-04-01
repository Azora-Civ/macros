const farms = [
    { pos: PositionCommon.createPos(9557, 73, 2152),  run: require("./complex/oak_full.js")   },
    { pos: PositionCommon.createPos(9557, 98, 2152),  run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 107, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 116, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 125, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 134, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 143, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 152, 2152), run: require("./complex/oak_single.js") },
    { pos: PositionCommon.createPos(9557, 161, 2152), run: require("./complex/oak_single.js") },
]

module.exports = function () {
    const { x, y, z } = Player.getPlayer().getPos()

    const match = farms.find(({ pos }) =>
        pos.x === Math.floor(x) &&
        pos.y === Math.floor(y) &&
        pos.z === Math.floor(z)
    )

    match?.run()
}
