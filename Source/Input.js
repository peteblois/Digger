
function Input(canvas, game)
{
	this.canvas = canvas;
	this.game = game;

	this.mouseDownHandler = this.mouseDown.delegate(this);
	this.mouseUpHandler = this.mouseUp.delegate(this);
	this.mouseMoveHandler = this.mouseMove.delegate(this);
	this.touchStartHandler = this.touchStart.delegate(this);
	this.touchEndHandler = this.touchEnd.delegate(this);
	this.touchMoveHandler = this.touchMove.delegate(this);
	this.keyDownHandler = this.keyDown.delegate(this);
	this.keyUpHandler = this.keyUp.delegate(this);

	this.canvas.addEventListener("touchstart", this.touchStartHandler, false);
	this.canvas.addEventListener("touchmove", this.touchMoveHandler, false);
	this.canvas.addEventListener("touchend", this.touchEndHandler, false);
	this.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
	this.canvas.addEventListener("mouseup", this.mouseUpHandler, false);
	this.canvas.addEventListener("mousemove", this.mouseMoveHandler, false);
	document.addEventListener("keydown", this.keyDownHandler, false);
	document.addEventListener("keyup", this.keyUpHandler, false);
}

Input.prototype.keyDown = function(e)
{
	     if (e.keyCode == 37) { e.preventDefault(); this.game.addKey(Key.left);  } // left
	else if (e.keyCode == 39) { e.preventDefault(); this.game.addKey(Key.right); } // right
	else if (e.keyCode == 38) { e.preventDefault(); this.game.addKey(Key.up);    } // up
	else if (e.keyCode == 40) { e.preventDefault(); this.game.addKey(Key.down);  } // down
	else if (e.keyCode == 27) { e.preventDefault(); this.game.addKey(Key.reset); } // esc
	else if (e.keyCode == 32) { e.preventDefault(); this.game.nextLevel();       } // space
	else if (!this.game.isAlive()) { e.preventDefault(); this.game.addKey(Key.reset); }
};

Input.prototype.keyUp = function(e)
{
	     if (e.keyCode == 37) { this.game.removeKey(Key.left);  }
	else if (e.keyCode == 39) { this.game.removeKey(Key.right); }
	else if (e.keyCode == 38) { this.game.removeKey(Key.up);    }
	else if (e.keyCode == 40) { this.game.removeKey(Key.down);  }
};

Input.prototype.mouseDown = function(e) 
{
	e.preventDefault(); 
	this.canvas.focus();
	this.pressDown(e.offsetX, e.offsetY);
};

Input.prototype.mouseMove = function(e) 
{ 
	e.preventDefault();
	this.pressMove(e.offsetX, e.offsetY); 
};

Input.prototype.mouseUp = function(e)
{ 
	e.preventDefault();
	this.pressUp(); 
};

Input.prototype.touchStart = function(e)
{
	e.preventDefault();
	if (e.touches.length > 3) // 4 finger touch = jump to next level
	{
		this.game.nextLevel();
	}
	else if (e.touches.length > 2) // 3 finger touch = restart current level
	{
		this.game.addKey(Key.reset);
	}
	else
	{ 
		for (var i = 0; i < e.touches.length; i++)
		{
			this.pressDown(e.touches[i].pageX, e.touches[i].pageY);
		}
	}
};

Input.prototype.touchMove = function(e)
{
	e.preventDefault();
	for (var i = 0; i < e.touches.length; i++)
	{
		this.pressMove(e.touches[i].pageX, e.touches[i].pageY);
	}
};

Input.prototype.touchEnd = function(e)
{
	e.preventDefault();
	this.pressUp();
};

Input.prototype.pressDown = function(x, y)
{
	if (!this.game.isAlive())
	{
		this.game.addKey(Key.reset);
	}
	else
	{
		this.touchPosition = new Position(x, y);
	}
};

Input.prototype.pressMove = function(x, y)
{
	if (this.touchPosition !== null)
	{
		var direction = null;
		if ((this.touchPosition.x - x) > 20)
		{
			direction = Key.left;
		}
		else if ((this.touchPosition.x - x) < -20)
		{
			direction = Key.right;
		}
		else if ((this.touchPosition.y - y) > 20)
		{
			direction = Key.up;
		}
		else if ((this.touchPosition.y - y) < -20)
		{
			direction = Key.down;
		}
		if (direction !== null)
		{
			this.touchPosition = new Position(x, y);			
			for (var i = Key.left; i <= Key.down; i++)
			{
				if (direction == i)
				{
					this.game.addKey(i);
				}
				else
				{ 
					this.game.removeKey(i);
				}
			}
		}
	}
};

Input.prototype.pressUp = function()
{
	this.touchPosition = null;
	this.game.removeKey(Key.left);
	this.game.removeKey(Key.right);
	this.game.removeKey(Key.up);
	this.game.removeKey(Key.down);
};
