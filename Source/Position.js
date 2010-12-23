
function Position()
{
	if (Position.arguments.length == 1) // copy constructor
	{
		this.x = Position.arguments[0].x;	
		this.y = Position.arguments[0].y;	
	}
	if (Position.arguments.length == 2) // (x, y)
	{
		this.x = Position.arguments[0];
		this.y = Position.arguments[1];
	}
}

Position.prototype.equals = function(position)
{
	return (this.x == position.x) && (this.y == position.y);
}
