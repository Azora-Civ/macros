const do_tree = require("./actions/tree")
const do_dark_oak_like = require("./actions/dark_oak_like")
const do_acacia_tree = require("./actions/acacia")
const xp_up = require("./actions/xp_up")

const input = bot.input
const move = bot.move
const control = bot.control
const look = bot.look
const item = bot.item

module.exports = {
    move(direction, distance, center=true) {
        move.toDir(direction, distance, center)
        control.loop(move.not_reached_target)
    },

    move_mine(direction, distance, center=true, pitch=45) {
        look.towards(direction, pitch)
        input.add(input.ATTACK)
        this.move(direction, distance, center)
        input.remove(input.ATTACK)
    },

    move_mine_block(direction, distance, block, center=true) {
        look.at(block)
        input.add(input.ATTACK)
        this.move(direction, distance, center)
        input.remove(input.ATTACK)
    },

    center() {
        this.move(0,0,true)
    },

    elevator: function (level) {
        if (level === 0) return;

        let key = level < 0 ? input.SNEAK : input.JUMP;

        level = Math.abs(level);
        for (let i = 0; i < level; i++) {
            KeyBind.pressKeyBind(key);
            Client.waitTick(4);
            KeyBind.releaseKeyBind(key);
            Client.waitTick(4);
        }
    },

    wait(millis) {
        const threshold = Time.time() + millis;
        control.loop(() => threshold > Time.time());
    },

    mine(direction, pitch, millis) {
        look.towards(direction, pitch)
        _mine(millis)
    },

    mine_block(pos, millis) {
        look.at(pos)
        _mine(millis)
    },

    interact(direction, pitch, millis) {
        look.towards(direction, pitch)
        input.add(input.USE)
        this.wait(millis)
        input.remove(input.USE)
        Client.waitTick(1)
    },

    interact_block(pos, millis) {
        look.at(pos)
        input.add(input.USE)
        this.wait(millis)
        input.remove(input.USE)
        Client.waitTick(1)
    },

    sample_dir(direction, pitch, block=null) {
        look.towards(direction, pitch)
        return _sample(block)
    },

    sample_block(pos, block= null) {
        look.at(pos)
        return _sample(block)
    },

    move_up(direction, mine_millis_per_block = 0) {
        if (mine_millis_per_block > 0) {
            this.mine(direction, -88, mine_millis_per_block)
            this.mine(direction, -30, mine_millis_per_block*2)
        }

        move.jumpToHeight(1)
        this.move(direction, 1)
        move.jumpToHeight(0)
    },

    pillar_up(height, block, slot = 4) {
        if (height <= 0) return

        const target_height = Math.floor(bot.PLAYER.getPos().y)+height
        item.select(block, slot)
        look.towards(0, 90)
        move.jumpToHeight(height)
        input.add(input.USE)
        control.loop(() => bot.PLAYER.getPos().y !== target_height)
        this.wait(50) // not sure if needed but just to be safe, it might prevent mistakes
        input.remove(input.USE)
        move.jumpToHeight(0)
    },

    bridge(direction, offset, block, slot = 4, pitch=80){
        if (offset === 0) return

        const reverse_dir = bot.dir.turn_back(direction)

        const old_sneak = bot.input.toggle_sneak(true)
        bot.move.set_eps(.08)

        bot.look.towards(reverse_dir, 78)

        bot.move.toDir(direction, offset)
        bot.control.loop(bot.move.is_moving())

        while (bot.move.not_reached_target()) {
            bot.item.select(block, slot)

            bot.action.interact(reverse_dir, pitch, 100)
            bot.control.loop(bot.move.is_moving())
        }

        bot.move.set_eps(.15)
        bot.input.toggle_sneak(old_sneak)
    },

    complex: {
        do_tree,
        do_dark_oak_like,
        do_acacia_tree,
        xp_up,
    }
}

function _sample(block= null) {
    if (block && item.is_holding(block)) {
        return true
    }

    const holding = item.get_holding()

    item.unselect()
    input.add(input.MIDDLE)
    bot.action.wait(100)
    input.remove(input.MIDDLE)

    for (let i = 0; i < 7; i++) {
        if (!item.is_holding(holding)) {
            break
        }
        bot.action.wait(50)
    }

    if (block) return item.is_holding(block)
}

function _mine(millis) {
    input.add(input.ATTACK)
    bot.action.wait(millis)
    input.remove(input.ATTACK)

    Client.waitTick(1)
}