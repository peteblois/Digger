
function Digger(element)
{
	this.canvas = element;
	this.canvas.focus() 
	this.display = new Display(this.canvas);
	this.loadCounter = 0;
	this.loadAudioData(this.soundData, this.soundData, this.loaded.delegate(this));
	this.loadImageData(this.imageData, this.display.imageData, this.loaded.delegate(this));
}

Digger.prototype.loaded = function()
{
	this.loadCounter++;
	if (this.loadCounter == 2)
	{
	this.blink = 0;
	this.display.init();
	this.restart();

	this.mouseDownHandler = this.mouseDown.delegate(this);
	this.mouseUpHandler = this.mouseUp.delegate(this);
	this.mouseMoveHandler = this.mouseMove.delegate(this);
	this.touchStartHandler = this.touchStart.delegate(this);
	this.touchEndHandler = this.touchEnd.delegate(this);
	this.touchMoveHandler = this.touchMove.delegate(this);
	this.keyDownHandler = this.keyDown.delegate(this);
	this.keyUpHandler = this.keyUp.delegate(this);
	this.intervalHandler = this.interval.delegate(this);

	this.canvas.addEventListener("touchstart", this.touchStartHandler, false);
	this.canvas.addEventListener("touchmove", this.touchMoveHandler, false);
	this.canvas.addEventListener("touchend", this.touchEndHandler, false);
	this.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
	this.canvas.addEventListener("mouseup", this.mouseUpHandler, false);
	this.canvas.addEventListener("mousemove", this.mouseMoveHandler, false);
	document.addEventListener("keydown", this.keyDownHandler, false);
	document.addEventListener("keyup", this.keyUpHandler, false);
	window.setInterval(this.intervalHandler, 50);
	}
}

Digger.prototype.keyDown = function(e)
{
	     if (e.keyCode == 37) { e.preventDefault(); this.addKey(Key.left);  } // left
	else if (e.keyCode == 39) { e.preventDefault(); this.addKey(Key.right); } // right
	else if (e.keyCode == 38) { e.preventDefault(); this.addKey(Key.up);    } // up
	else if (e.keyCode == 40) { e.preventDefault(); this.addKey(Key.down);  } // down
	else if (e.keyCode == 27) { e.preventDefault(); this.addKey(Key.reset); } // esc
	else if (e.keyCode == 32) { e.preventDefault(); this.nextLevel();        } // space
	else if (!this.isAlive) { e.preventDefault(); this.addKey(Key.reset); }
}

Digger.prototype.keyUp = function(e)
{
	     if (e.keyCode == 37) { this.removeKey(Key.left);  }
	else if (e.keyCode == 39) { this.removeKey(Key.right); }
	else if (e.keyCode == 38) { this.removeKey(Key.up);    }
	else if (e.keyCode == 40) { this.removeKey(Key.down);  }
}

Digger.prototype.mouseDown = function(e) 
{
	e.preventDefault(); 
	this.canvas.focus();
	this.pressDown(e.offsetX, e.offsetY) 
}

Digger.prototype.mouseMove = function(e) 
{ 
	e.preventDefault();
	this.pressMove(e.offsetX, e.offsetY); 
}

Digger.prototype.mouseUp = function(e)
{ 
	e.preventDefault();
	this.pressUp(); 
}

Digger.prototype.touchStart = function(e)
{
	e.preventDefault();
	if (e.touches.length > 3) // 4 finger touch = jump to next level
	{
		this.nextLevel();
	}
	else if (e.touches.length > 2) // 3 finger touch = restart current level
	{
		this.addKey(Key.reset);
	}
	else
	{ 
		for (var i = 0; i < e.touches.length; i++)
		{
			this.pressDown(e.touches[i].pageX, e.touches[i].pageY);
		}
	}
}

Digger.prototype.touchMove = function(e)
{
	e.preventDefault();
	for (var i = 0; i < e.touches.length; i++)
	{
		this.pressMove(e.touches[i].pageX, e.touches[i].pageY);
	}
}

Digger.prototype.touchEnd = function(e)
{
	e.preventDefault();
	this.pressUp();
}

Digger.prototype.pressDown = function(x, y)
{
	if (!this.isAlive)
		this.keyDown(Key.reset);
	else
		this.touchPosition = new Position(x, y);	
}

Digger.prototype.pressMove = function(x, y)
{
	if (this.touchPosition != null)
	{
		var direction = null;
		if ((this.touchPosition.x - x) > 20)
			direction = Key.left;
		else if ((this.touchPosition.x - x) < -20)
			direction = Key.right;
		else if ((this.touchPosition.y - y) > 20)
			direction = Key.up;
		else if ((this.touchPosition.y - y) < -20)
			direction = Key.down;
		if (direction != null)
		{
			this.touchPosition = new Position(x, y);			
			for (var i = Key.left; i <= Key.down; i++)
			{
				if (direction == i)
					this.addKey(i);
				else 
					this.removeKey(i);
			}
		}
	}
}

Digger.prototype.pressUp = function()
{
	this.touchPosition = null;
	this.keyUp(Key.left);
	this.keyUp(Key.right);
	this.keyUp(Key.up);
	this.keyUp(Key.down);
}

Digger.prototype.addKey = function(key)
{
	if (key < 4)
	{
		this.keys[key] = true;
	}
	else if (key == Key.reset)
	{
		this.lives--;
		if (this.lives >= 0)
			this.loadLevel();
		else
			this.restart();
	}
}

Digger.prototype.removeKey = function(key)
{
	if (key < 4)
	{
		this.keysRelease[key] = true;
	}
}

Digger.prototype.restart = function()
{
	this.lives = 20;
	this.score = 0;
	this.room = 0;
	this.loadLevel();
}

Digger.prototype.loadLevel = function()
{
	this.level = new Level(this.levelData[this.room])
	this.keys = [ false, false, false, false ];
	this.keysRelease = [ false, false, false, false ];
	this.tick = 0;
	this.paint();
}

Digger.prototype.nextLevel = function()
{
	if (this.room < (this.levelData.length - 1))
	{
		this.room++;
		this.loadLevel();
	}
}

Digger.prototype.isAlive = function()
{
	return (this.level == null) || (this.level.player.alive);
}

Digger.prototype.interval = function()
{
	this.tick++;
	this.blink++;
	if (this.blink == 6)
		this.blink = 0;
	if ((this.tick % 2) == 0)
	{
		this.level.soundTable = [];
		for (var i = 0; i < this.soundData.length; i++)
			this.level.soundTable[i] = false;
		
		// keyboard
		for (var i = 0; i < 4; i++)
		{
			if (this.keysRelease[i])
			{
				this.keys[i] = false;
				this.keysRelease[i] = false;
			}
		}

		this.level.update();
		if (this.level.movePlayer(this.keys))
			this.nextLevel();
		else
			this.level.move();
		
		// play sound
		for (var i = 0; i < this.level.soundTable.length; i++)
		{
			if (this.level.soundTable[i] && this.soundData[i])
			{
				if (!!this.soundData[i].currentTime)
				{
					this.soundData[i].pause();
					this.soundData[i].currentTime = 0;
				}
				this.soundData[i].play();
				break;
			}
		}
	}

	this.paint();
}

Digger.prototype.paint = function()
{
	var blink = ((this.blink + 4) % 6);
	this.display.paint(this, this.level, blink);
}

Digger.prototype.loadImageData = function(source, target, callback)
{
	var count = 0;
	for (var i = 0; i < source.length; i++)
	{
		var image = new Image();
		image.onload = function()
		{
			count++;
			if (count == source.length)
				callback();
		}
		image.src = "data:image/png;base64," + source[i];
		target[i] = image;
	}
}

Digger.prototype.loadAudioData = function(source, target, callback)
{
	// var count = 0;
	for (var i = 0; i < source.length; i++)
	{
		var audio = document.createElement('audio');
		if ((audio != null) && (audio.canPlayType("audio/wav")))
		{
			audio.src = "data:audio/wav;base64," + source[i];
			// audio.onload = function() 
			// {
			//	count++;
			//	if (count == data.length)
			//		callback();
			// }
			audio.preload = "auto";
			audio.load();
		}
		target[i] = audio;
	}
	callback();
}
