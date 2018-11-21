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
					
var defenderImage0 = [	
					"0000110000",
					"0000110000",
					"0000110000",
					"0001111000",
					"0011111100",
					"0111111110",
					"1111111111",
					"1111111111",
					"0111111110"];

var direction = 1;
var background = "blue";
var ctx;
var speed = 1;
var canvas;
var invaders = new Array(50);
var scale = 2;
var defender = {};
var sound = 0;
var edge = 20;

window.onload = function()
{
	init(window.innerWidth, window.innerHeight);	
}


function uniCharCode(event) 
{
    var key = event.keyCode;
    if (key == 122 && defender.x > edge)
	{	
		defender.oldX = defender.x;
		defender.x -= 2 * scale;
	}
	if (key == 120 && defender.x + defender.picture[0].length * scale < canvas.width - edge)
	{
		defender.oldX = defender.x;
		defender.x += 2 * scale;
	}
	ClearObject(defender, ctx);
	DrawObject(defender, ctx);
}

// Interval times may need changing to request animation frame
// 
function init(width, height)
{
	console.log('Init fired');
	var sound1 =  document.getElementById("sound1").src;
	var sound2 =  document.getElementById("sound2").src;
	ctx = getCanvasCTX("canvas")
	setScale();
	DrawBox(ctx);
	invaders = MakeArrayOfInvaders(invaders);
	defender = SetUpDefender();
	var intervalDraw = setInterval(Draw, 30, ctx);
	var intervalAnimate = setInterval(Animate, 1000, ctx);
}

///////////////
// Functions //
///////////////


function SetUpDefender()
{
	defender = { 
		colour : "white",
		x : canvas.width / 2,
		y : canvas.height - edge - (10 * scale),
		lives : 3,
		picture : defenderImage0,
		oldPicture : defenderImage0,
		state : 0,
		hit : 0,
		oldX : canvas.width / 2,
		oldY : canvas.height - edge - (10 * scale)
	};
	return (defender);
}

// Redo this function!!!
function setScale()
{
	// Scale size and speed
	scale = canvas.width / 300;
	if (canvas.width > canvas.height)
		scale = canvas.height / 300;
	if (canvas.width / canvas.height > 1)
		speed = canvas.width / canvas.height;
	else
		speed = scale / 2;
	
	defender.x = canvas.width / 2;
	defender.y = canvas.height - edge - (10 * scale);
	defender.oldY = defender.y;
	defender.oldX = defender.x;
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
	RePositionInvaders(invaders,edge, edge);
	DrawObject(defender, ctx);
	DrawInvaders(invaders, ctx);
	DrawBox(ctx);
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
	ClearObject(defender, ctx);
	MoveObjects(invaders, ctx);
	DrawInvaders(invaders, ctx);
	DrawObject(defender, ctx);
}

// Animate stuff
function Animate(ctx)
{
	if (sound == 1) 
	{
		sound = 0;
		sound1.play();
	} else 
	{
		sound = 1;
		sound2.play();
	}
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
	for(let i = 0; i < object.picture.length; i++)
	{
		for(let j = 0; j < object.picture[i].length; j++)
		{
			//console.log(object.picture[0][1]);
			if (object.picture[i][j] == "1")
			{
				ctx.fillRect(object.x + j * scale, object.y + i * scale, 1 * scale , 1 * scale);
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
		if (object[i].x + speed + object[i].picture.length * scale + edge >= canvas.width || object[i].x <= Math.abs(speed) + edge)
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
		invaders[i].oldX = invaders[i].x;
		invaders[i].oldY = invaders[i].y;
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

function DrawBox(ctx)
{
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(edge - 5 , edge - 5);
	ctx.lineTo(canvas.width - edge + 5, edge - 5);
	ctx.lineTo(canvas.width - edge + 5 ,canvas.height - edge + 5);
	ctx.lineTo(edge - 5,canvas.height - edge + 5);
	ctx.lineTo(edge - 5, edge - 5);
	ctx.stroke();
}

// 
function MakeArrayOfInvaders(invaders)
{
	var offsetX = edge;
	var offsetY = edge;
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
		invaders[i].x = (column * scale * invaders[i].picture[0].length) + (invaders[i].picture[0].length * scale) + spacingH + offsetX;
		invaders[i].y = (row    * scale * invaders[i].picture.length   ) + (invaders[i].picture.length * scale)    + spacingV + offsetY;
		invaders[i].oldX = invaders[i].x;
		invaders[i].oldY = invaders[i].y;
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
	ctx.fillRect(object.oldX - 2, object.oldY -2, scale * object.oldPicture[0].length + 2, scale * object.oldPicture.length + 4 );
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

