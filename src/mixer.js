

// Stream Source
class Source {
    constructor(options) {
        this._stream = options.stream;
        this._muted = options.muted;
        this._audioCtx = options.audioCtx;
        this._audioDestination = options.audioDestination;
        this._startTime = this._audioCtx.currentTime;
    }
    get stream() {
        return this._stream;
    }
    get muted() {
        return this._muted;
    }
    
    // buffer this a AudioBuffer  
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer 
    feedAudo(buffer) {
        var source = this._audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this._audioDestination);
        // 计算startTime
        source.start(this._startTime);  
    }
}


class AudioMixer {
    constructor(options) {
        const audioCtx = this._audioCtx = (options.audioContext || new AudioContext());
        this._audioDestination = audioCtx.createMediaStreamDestination();
        this._source = new Array();
    }

    get audioContext() {
        return this._audioCtx;
    }

    get audioDestination() {
        return this._audioDestination;
    }

    createSource(stream) {
        let source =  new Source({stream:stream});
        return source;
    }

    addSource(source) {
        this._source.push(source);
        console.log('add source', source);

        source.audioSource = this._audioCtx.createMediaStreamSource(source.stream);
        source.audioOutput = this._audioCtx.createGain();
        source.audioOutput.gain.value = 1;

        source.audioSource.connect(source.audioOutput);
        source.audioOutput.connect(this._audioDestination);        
    }

    removeSource(source) {

        if (source.audioSource) {
            source.audioSource = null;
        }
        if (source.audioOutput) {
            source.audioOutput.disconnect(this._audioDestination);
            source.audioOutput = null;
        }

        this._source.slice(this._source.indexOf(source),1);
        console.log('remove source', source);

        
    }
}


module.exports.Source = Source;
module.exports.AudioMixer = AudioMixer;