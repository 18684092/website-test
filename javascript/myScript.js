// Global vars

var spaceInvaderImage1 = [	
					"10000001",
					"01011010",
					"01011010",
					"01111110",
					"00111100",
					"00100100",
					"00100100",
					"11100111"];
var spaceInvaderImage0 = [	
					"00000000",
					"00011000",
					"00011000",
					"11111111",
					"10111101",
					"01100110",
					"10000001",
					"10000001"];

var direction = 1;
var background = "blue";
var ctx;
var speed = 1;
var canvas;
var invaders = new Array(50);
var scale = 2;

window.onload = function()
{
	init(window.innerWidth, window.innerHeight);	
}


// Interval times may need changing to request animation frame
// 
function init(width, height)
{
	console.log('Init fired');
	ctx = getCanvasCTX("canvas")
	setScale();
	invaders = MakeArrayOfInvaders(invaders);
	var intervalDraw = setInterval(Draw, 30, ctx);
	var intervalAnimate = setInterval(Animate, 500, ctx);
}

///////////////
// Functions //
///////////////

// Red do this function!!!
function setScale()
{
	// Scale size on width unless height is smaller, then base upon height
	scale = canvas.width / 300;
	if (canvas.width > canvas.height)
		scale = canvas.height / 300;
	if (canvas.width / canvas.height > 1)
		speed = canvas.width / canvas.height;
	else
		speed = scale / 2;
}

// Get 2d canvas context - return ctx
function getCanvasCTX(id)
{
	console.log('doCanvasStuff fired');
	canvas = document.getElementById(id);
	var myContext = canvas.getContext('2d');
	canvas.width = window.innerWidth - 50;
	canvas.height = window.innerHeight - 50;
	return (myContext);
}

function canvasResize()
{
	canvas.width = window.innerWidth - 50;
	canvas.height = window.innerHeight - 50;
	setScale();
	RePositionInvaders(invaders,0, 0);
	
	DrawInvaders(invaders, ctx);
}

// Obvious
function clearScreen()
{
	ctx.fillStyle = background;
	ctx.fillRect(0,0,canvas.width, canvas.height);
}

// Draw stuff 30 fps if possible
function Draw(ctx)
{
	ClearObjects(invaders, ctx);
	MoveObjects(invaders, ctx);
	DrawInvaders(invaders, ctx);
}

// Animate stuff
function Animate(ctx)
{
	AnimateSpaceInvader(invaders, ctx);
}

// Animate space invaders
function AnimateSpaceInvader(object, ctx)
{
	// This is only temp, will be done purely by changing state
	for(let i =0; i < object.length;i++)
	{
		if (object[i].state == 1)
		{
			object[i].state = 0;
			object[i].picture = spaceInvaderImage0
			object[i].oldPicture = spaceInvaderImage1
		}
		else
		{
			object[i].state = 1;
			object[i].picture = spaceInvaderImage1
			object[i].oldPicture = spaceInvaderImage0
		}
	}
}

// draw object, any object, at present one colour, will change to multi colour
function DrawObject(object, ctx)
{
	ctx.fillStyle = object.colour;
	for(var i = 0; i < object.picture.length; i++)
	{
		for(var j = 0; j < object.picture[i].length; j++)
		{
			if (object.picture[j][i] == 1)
			{
				ctx.fillRect(object.x + i * scale, object.y + j * scale, 1 * scale , 1 * scale);
			}
		}
	}
}

function DrawInvaders(invaders, ctx)
{
	for(let i = 0; i < invaders.length; i++)
	{
		DrawObject(invaders[i], ctx);
	}
}

function ClearObjects(invaders, ctx)
{
	for(let i = 0; i < invaders.length; i++)
	{
		ClearObject(invaders[i], ctx);
	}
}

function MoveObjects(invaders, ctx)
{
	CheckEnd(invaders);
	for(let i = 0; i < invaders.length; i++)
	{
		invaders[i] = MoveObject(invaders[i], ctx);
	}
}

// Have we hit a side
function CheckEnd(object)
{
	var change = false;
	for(let i = 0; i < object.length; i++)
	{
		if (object[i].x + speed + object[i].picture.length * scale >= canvas.width || object[i].x <= Math.abs(speed))
		{
			change = true;
		}
	}
	if (change)
	{
		direction *= -1;
	}
}

// Screen must have been resized
function RePositionInvaders(invaders, offsetX, offsetY)
{
	var row = 0;
	var column = 0;
	var spacingH = 0;
	var spacingV = 0;
	// 50 of the little blighters
	for(let i = 0; i < 50; i++)
	{
		invaders[i].x = (column * scale * invaders[i].picture[0].length) + (invaders[i].picture[0].length * scale) + spacingH + offsetX;
		invaders[i].y = (row    * scale * invaders[i].picture.length   ) + (invaders[i].picture.length * scale)    + spacingV + offsetY;
		column++; 
		spacingH += 10 * scale;
		// New row?
		if ((i + 1)% 10 == 0)
		{
			row++;
			column = 0;
			spacingV += 5 * scale;
			spacingH = 0;
		}
		
	}
}

// 
function MakeArrayOfInvaders(invaders)
{
	var row = 0;
	var column = 0;
	var spacingH = 0;
	var spacingV = 0;
	// 50 of the little blighters
	for(var i = 0; i < 50; i++)
	{
		// add invaders
		invaders[i] = 
		{
			x : 0,
			y : 0,
			colour : "white",
			picture : spaceInvaderImage1,
			oldPicture: spaceInvaderImage0,
			state : 1,
			hit : 0,
			oldX : 0,
			oldY : 0
		};
		invaders[i].colour = "white";//colour[row];
		invaders[i].x = (column * scale * invaders[i].picture[0].length) + (invaders[i].picture[0].length * scale) + spacingH;
		invaders[i].y = (row    * scale * invaders[i].picture.length   ) + (invaders[i].picture.length * scale)    + spacingV;
		column++; 
		spacingH += 10 * scale;
		// New row?
		if ((i + 1)% 10 == 0)
		{
			row++;
			column = 0;
			spacingV += 5 * scale;
			spacingH = 0;
		}
		
	}
	return (invaders);
}

// move objects, just for testing at present
function MoveObject(object, ctx)
{
	// save old position
	object.oldX = object.x;
	object.oldY = object.y;
	object.x += speed * direction;
	return (object)
}

// clear object
function ClearObject(object, ctx)
{
	ctx.fillStyle = background;
	ctx.fillRect(object.oldX - 1, object.oldY - 1, scale * object.oldPicture[0].length + 2, scale * object.oldPicture.length + 2 );
}


// Future functions, might not need


// Converts Degrees to Radians
function degreesToRadians(x)
{
	return (x * (Math.PI / 180));
}

// Wait for x number of mS
function wait(ms)
{
	console.log('waited');
	var d = new Date();
	var d2 = null;
	do 
	{
		d2 = new Date();
	} while(d2 - d < ms);
}

