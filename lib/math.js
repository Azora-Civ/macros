exports.math = {
    normalize(vec) {
        const len = Math.hypot(vec.x, vec.y, vec.z);
        if (len === 0) return vec.multiply(0, 0, 0);
        return vec.divide(len, len, len);
    },

    centralize(vec) {
        vec.x = Math.floor(vec.x) + 0.5;
        vec.y = Math.floor(vec.y);
        vec.z = Math.floor(vec.z) + 0.5;
        return vec;
    },

    dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },

    length(vec) {
        return Math.sqrt(this.dot(vec, vec));
    },

    scale(vec, s) {
        return vec.multiply(s, s, s);
    },

    distance(a, b) {
        return this.length(this.sub(a.copy(), b));
    },

    cross(a, b) {
        return a.set(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    },

    /**
     * Reflect incident vector I around normal N (N must be normalized)
     * R = I - 2 * dot(I, N) * N
     */
    reflect(I, N) {
        const d = 2 * this.dot(I, N);
        return I.subtract(N.x * d, N.y * d, N.z * d);
    },

    /**
     * Project vector a onto vector b
     */
    project(a, b) {
        const denom = this.dot(b, b);
        if (denom === 0) return a.multiply(0, 0, 0);
        const s = this.dot(a, b) / denom;
        return b.multiply(s, s, s);
    },

    /**
     * Linear interpolation
     */
    lerp(a, b, t) {
        return a.add(
            (b.x - a.x) * t,
            (b.y - a.y) * t,
            (b.z - a.z) * t
        );
    }
};
