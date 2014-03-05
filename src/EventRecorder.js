(function() {
    var EventRecorder = function(transport) {
        EventEmitter(this);

        this._transport = transport;

        this._recording = false;

        this._onEvent = this._onEvent.bind(this);
    };

    EventRecorder.MONITORED_EVENTS = [
        "mousemove",
        "click"
    ];

    EventRecorder.prototype.record = function() {
        this._recording = true;

        var startTimestamp = (new Date()).getTime();
        this._transport.startRecording(startTimestamp);

        EventRecorder.MONITORED_EVENTS.forEach(function(type) {
            window.addEventListener(type, this._onEvent, true);
        }.bind(this));

        this._trigger("recording:started", startTimestamp);
    };

    EventRecorder.prototype.stop = function() {
        if (!this._recording) {
            return;
        }
        this._recording = false;

        var endTimestamp = (new Date()).getTime();
        this._transport.endRecording(endTimestamp);

        EventRecorder.MONITORED_EVENTS.forEach(function(type) {
            window.removeEventListener(type, this._onEvent, true);
        }.bind(this));

        this._trigger("recording:stopped", [endTimestamp]);
    };

    EventRecorder.prototype._onEvent = function(e) {
        this._transport.push(e);
        this._trigger("recorded", [e]);
    };

    window.EventRecorder = EventRecorder;
})();