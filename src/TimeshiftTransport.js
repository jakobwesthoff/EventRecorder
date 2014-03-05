(function() {
    var TimeshiftTransport = function() {
        Transport.apply(this);
        this._nextTimeout = null;
    };

    // Inheritance
    var ctor = function() {};
    ctor.prototype = Transport.prototype;
    TimeshiftTransport.prototype = new ctor();

    TimeshiftTransport.prototype.startPlaying = function(timestamp) {
        Transport.prototype.startPlaying.apply(this, arguments);

        var replayOffset = (new Date()).getTime() - this._recordingStartTime;

        var tick = function() {
            var serializedNextEvent = this._eventQueue.shift();
            var nextEvent = this._unserializeEvent(
                serializedNextEvent
            );

            nextEvent.timeStamp = (new Date()).getTime();
            this._trigger("event", [nextEvent]);

            if(this._eventQueue.length > 0) {
                var nextEventOffset = (this._eventQueue[0].timeStamp + replayOffset) - (new Date()).getTime();

                if (nextEventOffset < 0) {
                    nextEventOffset = 1;
                }
                this._nextTimeout = setTimeout(tick, nextEventOffset);
            }
        }.bind(this);

        if (this._eventQueue.length > 0) {
            tick();
        }
    };

    TimeshiftTransport.prototype.stopPlaying = function(timestamp) {
        Transport.prototype.stopPlaying.apply(this, arguments);
        if (this._nextTimeout !== null) {
            clearTimeout(this._nextTimeout);
        }
    };

    window.TimeshiftTransport = TimeshiftTransport;
})();
