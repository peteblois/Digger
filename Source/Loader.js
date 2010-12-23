
function Loader()
{
	this.count = 0;
	this.imageData = null;
	this.audioData = null;
}

Loader.prototype.loadImageData = function(data)
{
	this.count += data.length;
	this.imageData = data;
}

Loader.prototype.loadAudioData = function(data)
{
	this.audioData = data;
}

Loader.prototype.start = function(callback)
{
	for (var i = 0; i < this.audioData.length; i++)
	{
		var audio = document.createElement('audio');
		if ((audio != null) && (audio.canPlayType("audio/wav")))
		{
			audio.src = "data:audio/wav;base64," + this.audioData[i];
			audio.preload = "auto";
			audio.load();
		}
		this.audioData[i] = audio;
	}

	var count = this.count;
	var index = 0;
	for (var i = 0; i < this.imageData.length; i++)
	{
		var image = new Image();
		image.onload = function()
		{
			index++;
			if (index == count)
				callback();
		}
		image.src = "data:image/png;base64," + this.imageData[i];
		this.imageData[i] = image;
	}	
}



