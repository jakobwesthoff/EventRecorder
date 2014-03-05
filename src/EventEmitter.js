(function() {
    var EventEmitter = function(target) {
        target._eventEmitterEventHandlers = {};

        target.on = function(type, handler) {
            if (!this._eventEmitterEventHandlers[type]) {
                this._eventEmitterEventHandlers[type] = [];
            }

            this._eventEmitterEventHandlers[type].push(handler);
        };

        target._trigger = function(type, data) {
            if (data === undefined) {
                data = [];
            }

            if (this._eventEmitterEventHandlers[type]) {
                this._eventEmitterEventHandlers[type].forEach(function(handler) {
                    handler.apply(this, data);
                }.bind(this));
            }
        };

        target.off = function(type, handler) {
            var i, len;

            if (this._eventEmitterEventHandlers[type]) {
                for (i=0, len=this._eventEmitterEventHandlers[type].length; i < len; i++) {
                    if (this._eventEmitterEventHandlers[type][i] === handler) {
                        this._eventEmitterEventHandlers[type].splice(i, 1);
                        return;
                    }
                }
            }
        };
    };

    window.EventEmitter = EventEmitter;
})();