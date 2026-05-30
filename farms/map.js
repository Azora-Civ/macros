const farms = [
    { pos: PositionCommon.createPos(9557, 73, 2152),  run: require("./complex/oak_full.js")   },
    { pos: PositionCommon.createPos(9551, 82, 2092),  run: require("./complex/melon_full.js") }
]

for (let i = 0; i <9; i++) {
    func = require("./complex/oak_single.js")
    farms.push({ pos: PositionCommon.createPos(9557, 98+(i*9), 2152),  run: func })
}
for (let i = 0; i <13; i++) {
    func = require("./complex/melon_single.js")
    farms.push({ pos: PositionCommon.createPos(9551, 88+(i*3), 2092),  run: func })
}

module.exports = function () {
    const { x, y, z } = Player.getPlayer().getPos()

    const match = farms.find(({ pos }) =>
        pos.x === Math.floor(x) &&
        pos.y === Math.floor(y) &&
        pos.z === Math.floor(z)
    )

    if (match) {
        match.run()
    } else {
        bot.logger.info("Couldn't find a farm at this position.")
    }
}
