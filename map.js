const farms = [
    { pos: PositionCommon.createPos(9557, 73, 2152),  run: require("./farms/complex/oak_full.js")   },
    { pos: PositionCommon.createPos(9551, 82, 2092),  run: require("./farms/complex/melon_full.js") },
    { pos: PositionCommon.createPos(8966, 103, 1408), run: require("./farms/dark_oak.js"), name: "Dark Oak L1" },
    //{ pos: PositionCommon.createPos(9427, 115, 1736),  run: require("./membership_check.js") },
]

for (let i = 0; i <9; i++) {
    func = require("./farms/complex/oak_single.js")
    farms.push({ pos: PositionCommon.createPos(9557, 98+(i*9), 2152), run: func, name: "Badlands Oak L" + (i+1) })
}
for (let i = 0; i <13; i++) {
    func = require("./farms/complex/melon_single.js")
    farms.push({ pos: PositionCommon.createPos(9551, 88+(i*3), 2092), run: func })
}
func = require("./farms/azuna/oak.js")
farms.push({ pos: PositionCommon.createPos(-579, 3, -25737), run: func, args: { mine_time: 2000 } })
farms.push({ pos: PositionCommon.createPos(-579, 10, -25737), run: func, args: { mine_time: 2000 } })

module.exports = function () {
    const { x, y, z } = Player.getPlayer().getPos()

    const match = farms.find(({ pos }) =>
        pos.x === Math.floor(x) &&
        pos.y === Math.floor(y) &&
        pos.z === Math.floor(z)
    )

    if (!match) {
        bot.logger.info("Couldn't find a farm at this position.")
        return
    }

    if (match.name) {
        Chat.say(`/g Azora started farming: ${match.name}`)
    }

    if (match.args) {
        match.run(match.args)
    } else {
        match.run()
    }

    if (match.name) {
        Chat.say(`/g Azora finished farming: ${match.name}`)
    }
}
