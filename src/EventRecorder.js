(function() {
    var EventRecorder = function() {
        this._eventQueue = [];
        this._startTimestamp = null;
        this._endTimestamp = null;

        this._recording = false;

        this._internalEventHandlers = {};

        this._onEvent = this._onEvent.bind(this);
    };

    EventRecorder.MONITORED_EVENTS = [
        "mousemove",
        "click"
    ];

    EventRecorder.prototype.record = function() {
        this._recording = true;
        this._startTimestamp = this._now();
        EventRecorder.MONITORED_EVENTS.forEach(function(type) {
            window.addEventListener(type, this._onEvent, true);
        }.bind(this));

        this._trigger("recording:started", this._startTimestamp);
    };

    EventRecorder.prototype.stop = function() {
        if (!this._recording) {
            return;
        }

        this._recording = false;
        this._endTimestamp = this._now();

        EventRecorder.MONITORED_EVENTS.forEach(function(type) {
            window.removeEventListener(type, this._onEvent, true);
        }.bind(this));

        this._trigger("recording:stopped", [this._endTimestamp, this._eventQueue]);
    };

    EventRecorder.prototype.play = function(pretend) {
        this.stop();

        var replayOffset = this._now() - this._startTimestamp;

        var tick = function() {
            var serializedNextEvent = this._eventQueue.shift();
            var nextEvent = this._unserializeEvent(
                serializedNextEvent
            );

            nextEvent.timeStamp = this._now();

            if (!pretend) {
                window.dispatchEvent(nextEvent);
            }

            this._trigger("played", [nextEvent, serializedNextEvent]);

            if(this._eventQueue.length > 0) {
                var nextEventOffset = (this._eventQueue[0].timeStamp + replayOffset) - this._now();

                if (nextEventOffset < 0) {
                    nextEventOffset = 1;
                }
                setTimeout(tick, nextEventOffset);
            }
        }.bind(this);

        if (this._eventQueue.length > 0) {
            tick();
        }
    };

    EventRecorder.prototype.on = function(type, handler) {
        if (!this._internalEventHandlers[type]) {
            this._internalEventHandlers[type] = [];
        }

        this._internalEventHandlers[type].push(handler);
    };

    EventRecorder.prototype._now = function() {
        return (new Date()).getTime();
    };

    EventRecorder.prototype._onEvent = function(e) {
        var serializedEvent = this._serializeEvent(e);

        this._eventQueue.push(
            serializedEvent
        );

        this._trigger("recorded", [e, serializedEvent]);
    };

    EventRecorder.prototype._serializeEvent = function(e) {
        return e;
    };

    EventRecorder.prototype._unserializeEvent = function(e) {
        return e;
    };

    EventRecorder.prototype._trigger = function(type, data) {
        if (data === undefined) {
            data = [];
        }

        if (this._internalEventHandlers[type]) {
            this._internalEventHandlers[type].forEach(function(handler) {
                handler.apply(this, data);
            }.bind(this));
        }
    };

    window.EventRecorder = EventRecorder;
})();