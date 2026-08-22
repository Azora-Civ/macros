class Event {
    constructor() {
        this.handlers = new Map();
    }

    set(key, fn) {
        this.handlers.set(key, fn);
    }

    get(key) {
        return this.handlers.get(key)
    }

    remove(key) {
        return this.handlers.delete(key);
    }

    emit(...args) {
        for (const fn of this.handlers.values()) {
            fn(...args);
        }
    }
}

exports.Event = Event
