const farms = new Map()
const vec3 = bot.math.vec

const tree_farm = require("./farms/tree_farm")
const build_tree_farm = require("./farms/build_tree_farm")
const water_catch = require("./farms/build_item_collect")

function pos_key(pos) { return `${pos.x},${pos.y},${pos.z}`; }
function Farm(pos, run, name=null, args=null) {
    if (typeof run === "object") {
        return {pos, name, args, ...run}
    }
    return { pos, run, name, args };
}
function add_farm(farm) { farms.set(pos_key(farm.pos), farm); }

function add_farms(n, offset, farm, full_pos=null) {
    offset = typeof offset === "number" ? vec3(0, offset, 0) : offset

    if (full_pos)
        add_farm(Farm(full_pos, require("./farms/elevator_stacked.js"), null, n))

    for (let i = 0; i < n; i++) {
        const clone = { ...farm }
        clone.pos = clone.pos.add(offset.scale(i))
        if (clone.name) clone.name += ` L${i+1}`
        add_farm(clone)
    }
}

// ===== Badlands Complex =====
add_farms(9, 9, Farm(vec3(9557, 98, 2152),
    () => tree_farm(bot.dir.EAST, bot.dir.NORTH, 21, 13, 5, true, 2000, true, "oak"), "Badlands Oak"),
    vec3(9557, 73, 2152))
add_farms(13, 3, Farm(vec3(9551, 88, 2092), require("./farms/complex/melon.js")))

// ===== Dark Forest Complex =====
add_farms(4, 10, Farm(vec3(8964, 103, 1406), () => tree_farm(
    bot.dir.NORTH, bot.dir.EAST, 10, 13, 5, true, 2800, true, "jungle"
), "DF Jungle"), vec3(8964, 20, 1406))
add_farms(3, 11, Farm(vec3(8934, 103, 1408), require("./farms/df_complex/dark_oak.js"), "DF Dark Oak"), vec3(8934, 20, 1408))

// ===== Savanna Complex =====
add_farms(
    11, 9, Farm(vec3(8885, 79, 2560),
    () => build_tree_farm(6, 10, 15, bot.dir.SOUTH, bot.dir.WEST, false),
    "Savanna con. acacia")
)
add_farms(
    10, 9, Farm(vec3(8885, 79, 2554),
        () => tree_farm(bot.dir.SOUTH, bot.dir.WEST, 10, 15, 6, true, 500, true, "acacia"),
        "Savanna Acacia")
)
add_farms(
    11, 9, Farm(vec3(8970, 79, 2559),
        () => build_tree_farm(5, 17, 18, bot.dir.SOUTH, bot.dir.WEST, false),
        "Savanna con. oak")
)
add_farms(
    5, 9, Farm(vec3(8970, 79, 2554),
        () => tree_farm(bot.dir.SOUTH, bot.dir.WEST, 17, 18, 5, true, 1800, true, "oak"),
        "Savanna Oak"), vec3(8970, -57, 2554)
)
add_farm(Farm(vec3(8995, 70, 2530), require("./farms/savanna/melon"), "Savanna Melon"))

// ===== Azuna =====
add_farms(5, 7, Farm(vec3(-579, 3, -25737), require("./farms/azuna/oak.js"), null, { mine_time: 2000 }))

// ===== Loose stuff =====
add_farm(Farm(vec3(9426, 115, 1735), require("./farms/bleeze_wait.js")))


module.exports = function () {
    const player_pos = bot.math.floor(Player.getPlayer().getPos())
    const key = pos_key(player_pos)

    let match = farms.get(key)

    if (!match && debug) {
        match = Farm(bot.PLAYER.getPos(), require("./utils/debug.js"))
    }

    if (!match) {
        bot.logger.info("Couldn't find a farm at this position.")
        return
    }

    if (match.name) {
        Chat.say(`/g AzoraFarms started: ${match.name}`)
    }

    if (match.args) {
        match.run(match.args)
    } else {
        match.run()
    }

    if (match.name) {
        Chat.say(`/g AzoraFarms finished: ${match.name}`)
    }
}
