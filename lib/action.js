const do_tree = require("./actions/tree")
const do_dark_oak_like = require("./actions/dark_oak_like")

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

    pillar_up(height, block, slot = 9) {
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

    complex: {
        do_tree,
        do_dark_oak_like
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

    for (let i = 0; i < 10; i++) {
        if (!item.is_holding(holding)) {
            break
        }
        Client.waitTick(1)
    }

    if (block) return item.is_holding(block)
}

function _mine(millis) {
    input.add(input.ATTACK)
    bot.action.wait(millis)
    input.remove(input.ATTACK)

    Client.waitTick(1)
}