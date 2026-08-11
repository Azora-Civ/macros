const farms = new Map()
const vec3 = bot.math.vec

function pos_key(pos) { return `${pos.x},${pos.y},${pos.z}`; }
function Farm(pos, run, name=null, args=null) { return { pos, run, name, args }; }
function add_farm(farm) { farms.set(pos_key(farm.pos), farm); }

function add_farms(n, offset, farm, full_pos=null) {
    if (full_pos)
        add_farm(Farm(full_pos, require("./farms/elevator_stacked.js"), null, n))

    for (let i = 0; i < n; i++) {
        const clone = { ...farm }
        clone.pos = clone.pos.add(vec3(0, offset*i, 0))
        if (clone.name) clone.name += ` L${i+1}`
        add_farm(clone)
    }
}

// ===== Badlands Complex =====
add_farms(9, 9, Farm(vec3(9557, 98, 2152), require("./farms/complex/oak.js"), "Badlands Oak"), vec3(9557, 73, 2152))
add_farms(13, 3, Farm(vec3(9551, 88, 2092), require("./farms/complex/melon.js")))

// ===== Dark Forest Complex =====
add_farms(4, 10, Farm(vec3(8964, 103, 1406), require("./farms/df_complex/jungle.js"), "DF Jungle"), vec3(8964, 20, 1406))
add_farms(3, 11, Farm(vec3(8966, 103, 1408), require("./farms/df_complex/dark_oak.js"), "DF Dark Oak"))

// ===== Azuna =====
add_farms(5, 7, Farm(vec3(-579, 3, -25737), require("./farms/azuna/oak.js"), null, { mine_time: 2000 }))

// ===== Loose stuff =====
add_farm(Farm(vec3(9426, 115, 1735), require("./farms/bleeze_wait.js")))
// jungle
add_farms(8, 10, Farm(vec3(8964, 143, 1401), require("./utils/build_tree_farm.js"), null, { rows: 10, cols: 13, row_dir: bot.dir.NORTH, col_dir: bot.dir.WEST, offset: 5, is_big: false}))
add_farms(4, 11, Farm(vec3(8934, 103, 1416), require("./utils/build_tree_farm.js"), null, { rows: 10, cols: 9, row_dir: bot.dir.SOUTH, col_dir: bot.dir.EAST, offset: 8, is_big: true}))

module.exports = function () {
    const player_pos = bot.math.floor(Player.getPlayer().getPos())
    const key = pos_key(player_pos)

    let match = farms.get(key)

    if (!match && debug) {
        match = {run: require("./utils/debug.js")}
    }

    if (!match) {
        bot.logger.info("Couldn't find a farm at this position.")
        return
    }

    if (match.name) {
        Chat.say(`/g AzoraFarms started farming: ${match.name}`)
    }

    if (match.args) {
        match.run(match.args)
    } else {
        match.run()
    }

    if (match.name) {
        Chat.say(`/g AzoraFarms finished farming: ${match.name}`)
    }
}
