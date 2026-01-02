class EventEmitter {
    emit(event, ...args) {
        this._stores = this._stores || {};
        let store = this._stores[event];
        let args;

        if (store) {
            store = [ ...store ];
            args[0] = {
                eventCode: event,
                data: args[0],
            };
            for (const element of store) {
                element.cb.apply(element.ctx, args);
            }
        }
    }

    off(event, fn) {
        this._stores = this._stores || {};

        // all
        if (arguments.length === 0) {
            this._stores = {};
            return;
        }

        // specific event
        const store = this._stores[event];
        if (!store) return;

        // remove all handlers
        if (arguments.length === 1) {
            return;
        }

        // remove specific handler
        let cb;
        for (let i = 0, len = store.length; i < len; i++) {
            cb = store[i].cb;
            if (cb === fn) {
                store.splice(i, 1);
                break;
            }
        }

    }

    on(event, fn, ctx) {
        if (typeof fn !== "function") {
            console.error("listener must be a function");
            return;
        }

        this._stores = this._stores || {};
        (this._stores[event] = this._stores[event] || []).push({ cb: fn, ctx });
    }
}

module.exports = EventEmitter;
