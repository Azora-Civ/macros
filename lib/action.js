const { control } = require("./control")
const { move, reached_target } = require("./move")
const { input, held_buttons } = require("./input")
const { look } = require("./look")
const do_tree = require("./actions/tree")
const do_dark_oak_like = require("./actions/dark_oak_like")

exports.action = {
    move(direction, distance, center=true) {
        move.toDir(direction, distance, center)
        control.loop(reached_target)
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

    sample_dir(direction, pitch, item=null) {
        bot.look.towards(direction, pitch)
        return _sample(item)
    },

    sample_block(pos, item=null) {
        bot.look.at(pos)
        return _sample(item)
    },

    move_up(direction, mine_millis_per_block = 0) {
        if (mine_millis_per_block > 0) {
            bot.action.mine(direction, -88, mine_millis_per_block)
            bot.action.mine(direction, -30, mine_millis_per_block*2)
        }

        bot.move.jumpToHeight(1)
        bot.action.move(direction, 1)
        bot.move.jumpToHeight(0)
    },

    pillar_up(height, block, slot = 9) {
        if (height <= 0) return

        const target_height = Math.floor(bot_state.PLAYER.getPos().y)+height
        bot.item.select(block, slot)
        bot.look.towards(0, 90)
        bot.move.jumpToHeight(height)
        bot.input.add(bot.input.USE)
        bot.control.loop(() => bot_state.PLAYER.getPos().y !== target_height)
        bot.action.wait(50) // not sure if needed but just to be safe, it might prevent mistakes
        bot.input.remove(bot.input.USE)
        bot.move.jumpToHeight(0)
    },

    complex: {
        do_tree,
        do_dark_oak_like
    }
}

function _sample(item=null) {
    if (item && bot.item.is_holding(item)) {
        return true
    }

    const holding = bot.item.get_holding()

    bot.item.unselect()
    bot.input.add(bot.input.MIDDLE)
    bot.action.wait(100)
    bot.input.remove(bot.input.MIDDLE)

    for (let i = 0; i < 10; i++) {
        if (!bot.item.is_holding(holding)) {
            break
        }
        Client.waitTick(1)
    }

    if (item) return bot.item.is_holding(item)
}

function _mine(millis) {
    input.add(input.ATTACK)
    bot.action.wait(millis)
    input.remove(input.ATTACK)

    Client.waitTick(1)
}