function pos_key(pos) { return `${pos.x},${pos.y},${pos.z}`; }

module.exports = {
    positional(pos, name= null) {
        return {
            getName() {
                return name;
            },
            shouldRun() {
                const player_pos = bot.math.floor(Player.getPlayer().getPos())
                const player_pos_key = pos_key(player_pos);
                const target_pos_key = pos_key(pos);
                return player_pos_key === target_pos_key;
            }
        }
    },

    layered(pos, offset, count, name = null) {
        if (typeof offset === "number") {
            offset = vec(0, offset, 0);
        }

        const positions = Array.from({ length: count }, (_, i) =>
            bot.math.add(pos, bot.math.scale(offset, i))
        );

        const getLayer = () => {
            const player_pos = bot.math.floor(Player.getPlayer().getPos());
            return positions.findIndex(p => pos_key(p) === pos_key(player_pos));
        };

        return {
            getName() {
                const layer = getLayer();
                if (layer === -1 || name === null) return null;
                return `${name} L${layer + 1}`;
            },

            shouldRun() {
                return getLayer() !== -1;
            },

            getLayer
        };
    },

    multi_positional(positions) {
        const keys = new Set(positions.map(pos_key));

        return {
            getName() {
                return null;
            },
            shouldRun() {
                const player_pos = bot.math.floor(Player.getPlayer().getPos());
                return keys.has(pos_key(player_pos));
            },
        };
    },
};
