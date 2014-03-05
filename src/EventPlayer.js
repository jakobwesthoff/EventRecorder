(function() {
    var EventPlayer = function(transport) {
        EventEmitter(this);

        this._transport = transport;
        this._playing = false;
        this._pretend = false;

        this._onData = this._onData.bind(this);
    };

    EventPlayer.prototype.play = function(pretend) {
        this._playing = true;
        this._pretend = (pretend === true);

        var startTimestamp = this._now();
        this._transport.on("event", this._onData);
        this._transport.startPlaying(startTimestamp);

        this._trigger("playing:started", [startTimestamp]);

    };

    EventPlayer.prototype.stop = function() {
        if (!this._playing) {
            return;
        }
        this._playing = false;

        var stopTimestamp = this._now();

        this._transport.endPlaying(stopTimestamp);
        this._transport.on("event", this._onData);
    };

    EventPlayer.prototype._onData = function(e) {
        if (!this._pretend) {
            window.dispatchEvent(e);
        }

        this._trigger("played", [e]);
    };

    EventPlayer.prototype._now = function() {
        return (new Date()).getTime();
    };

    window.EventPlayer = EventPlayer;
})();