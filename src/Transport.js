(function() {
    var Transport = function() {
        EventEmitter(this);

        this._recordingStartTime = null;
        this._recordingEndTime = null;
        this._playingStartTime = null;
        this._playingEndTime = null;

        this._eventQueue = [];
    };

    Transport.prototype.startRecording = function(timestamp) {
        this._recordingStartTime = timestamp;
    };

    Transport.prototype.endRecording = function(timestamp) {
        this._recordingEndTime = timestamp;
    };

    Transport.prototype.startPlaying = function(timestamp) {
        this._playingStartTime = timestamp;
    };

    Transport.prototype.endPlaying = function(timestamp) {
        this._playingEndTime = timestamp;
    };

    Transport.prototype.push = function(e) {
        this._eventQueue.push(this._serializeEvent(e));
    };

    Transport.prototype._serializeEvent = function(e) {
        return e;
    };

    Transport.prototype._unserializeEvent = function(e) {
        return e;
    };

    window.Transport = Transport;
})();