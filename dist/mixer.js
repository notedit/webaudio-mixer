(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mixer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


class Source {
    constructor(options) {
        this._stream = options.stream;
        this._muted = options.muted;
    }
    get stream() {
        return this._stream;
    }
    get muted() {
        return this._muted;
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

    addSource(source) {
        this._source.push(source);
        console.log('add source', source);

        source.audioSource = this._audioCtx.createMediaStreamSource(source.stream);
        source.audioOutput = this._audioCtx.createGain();
        source.audioOutput.gain.value = 1;

        source.audioSource.connect(source.audioOutput);
        source.audioOutput.connect(this._audioDestination);

        console.log('inputs ', this._audioDestination.numberOfInputs)
        
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
},{}]},{},[1])(1)
});
