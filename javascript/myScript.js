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

var spaceInvader = {
	x : 10,
	y : 20,
	colour : "white",
	picture : spaceInvaderImage1,
	oldPicture: spaceInvaderImage0,
	state : 1,
	hit : 0,
	oldX : 0,
	oldY : 20,
	scale : 2,
	speed : 2,
	direction : 1
}

var background = "blue";
var ctx;
var canvas;

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
	var intervalDraw = setInterval(Draw, 30, ctx);
	var intervalAnimate = setInterval(Animate, 500, ctx);
}

///////////////
// Functions //
///////////////

function uniCharCode(event) 
{
    var c = event.which || event.keyCode;
    if (c == 115)
		spaceInvader.scale += 1;
	if (spaceInvader.scale > 32)
	{
		clearScreen();
		spaceInvader.scale = 1;
	}	
	if (c == 97)
		spaceInvader.speed += 1;
	if (spaceInvader.speed >= 32)
		spaceInvader.speed = 1;
	if (c == 99)
		if (spaceInvader.colour == "red")
			spaceInvader.colour = "white";
		else
			spaceInvader.colour = "red";
}

// Get 2d canvas context - return ctx
function getCanvasCTX(id)
{
	console.log('doCanvasStuff fired');
	canvas = document.getElementById(id);
	var myContext = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = 500;
	return (myContext);
}

function canvasResize()
{
	canvas.width = window.innerWidth;
}
function clearScreen()
{
	ctx.fillStyle = background;
	ctx.fillRect(0,0,500,500);
}


// Draw stuff
function Draw(ctx)
{
	ClearObject(spaceInvader, ctx);
	DrawObject(spaceInvader, ctx);
	MoveObject(spaceInvader, ctx);
}


// Animate stuff
function Animate(ctx)
{
	AnimateSpaceInvader(spaceInvader, ctx);
}

// Animate space invaders
function AnimateSpaceInvader(object, ctx)
{
	// This is only temp, will be done purely by changing state
	if (object.state == 1)
	{
		object.state = 0;
		object.picture = spaceInvaderImage0
		object.oldPicture = spaceInvaderImage1
	}
	else
	{
		object.state = 1;
		object.picture = spaceInvaderImage1
		object.oldPicture = spaceInvaderImage0
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
				ctx.fillRect(object.x + i * object.scale, object.y + j * object.scale, 1 * object.scale , 1 * object.scale);
			}
		}
	}
}

// move objects, just for testing at present
function MoveObject(object, ctx)
{
	// save old position
	object.oldX = object.x;
	if (object.x + object.speed + object.picture.length * object.scale >= canvas.width || object.x <= Math.abs(object.speed))
	{
		object.direction *= -1;
	}
	object.x += object.speed * object.direction;
	
}

// clear object
function ClearObject(object, ctx)
{
	ctx.fillStyle = background;
	ctx.fillRect(object.oldX, object.oldY, object.scale * object.oldPicture[0].length , object.scale * object.oldPicture.length );
	ctx.stroke;
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

