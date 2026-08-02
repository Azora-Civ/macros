const farms = [
    { pos: PositionCommon.createPos(9557, 73, 2152),  run: require("./farms/complex/oak_full.js")   },
    { pos: PositionCommon.createPos(9551, 82, 2092),  run: require("./farms/complex/melon_full.js") },
    { pos: PositionCommon.createPos(8966, 103, 1408), run: require("./farms/df_complex/dark_oak.js"), name: "Dark Oak L1" },
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
for (let i = 0; i < 5; i++) {
    func = require("./farms/azuna/oak.js")
    farms.push({ pos: PositionCommon.createPos(-579, 3 + (i*7), -25737), run: func, args: { mine_time: 2000 } })
}
for (let i = 0; i < 5; i++) {
    func = require("./farms/df_complex/jungle.js")
    farms.push({ pos: PositionCommon.createPos(8964, 103+(8*i), 1406), run: func })
}


module.exports = function () {
    const { x, y, z } = Player.getPlayer().getPos()

    let match = farms.find(({ pos }) =>
        pos.x === Math.floor(x) &&
        pos.y === Math.floor(y) &&
        pos.z === Math.floor(z)
    )

    if (!match && debug) {
        match = {run: require("./debug.js")}
    }

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
