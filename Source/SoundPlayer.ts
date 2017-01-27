module Digger
{
    export class SoundPlayer
    {
        private _soundTable: any[] = [];
        private _audioElement: HTMLAudioElement;
        private _audioContext: AudioContext;

        constructor(soundData: string[])
        {
            window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (window.AudioContext)
            {
                this._audioContext = new AudioContext();
            }
            else
            {
                this._audioElement = <HTMLAudioElement> document.createElement('audio');
            }

            for (var i = 0; i < soundData.length; i++)
            {
                this.loadSound(soundData[i], this._soundTable, i);
            }
        }

        public play(index: number) : boolean
        {
            var sound = this._soundTable[index];
            if (sound)
            {
                if (this._audioContext)
                {
                    var audioBufferSource = this._audioContext.createBufferSource();
                    audioBufferSource.buffer = sound;
                    audioBufferSource.connect(this._audioContext.destination);
                    audioBufferSource.start(0);
                }
                else
                {
                    this._audioElement.src = sound;
                    this._audioElement.play();
                }
                return true;
            }
            return false;
        }

        private loadSound(base64, table, index)
        {
            if (this._audioContext)
            {
                var data = window.atob(base64);
                var length = data.length;
                var buffer = new ArrayBuffer(length);
                var array = new Uint8Array(buffer);
                for(var i = 0; i < length; i++)
                {
                    array[i] = data.charCodeAt(i);
                }
                this._audioContext.decodeAudioData(buffer, function(audio) {
                    table[index] = audio; 
                }, function() { 
                    console.error("decodeAudioData"); 
                });
            }
            else
            {
                table[index] = "data:audio/wav;base64," + base64;
            }
        }

    }
}