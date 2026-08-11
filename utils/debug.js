module.exports = function () {
    require("./build_tree_farm")({ rows: 6, cols: 9, row_dir: bot.dir.SOUTH, col_dir: bot.dir.EAST, offset: 8, is_big: true})
}
