// Global vars

// Default images
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
var scale ;
var defender = {};
var sound = 0;
var edge = 20;
var gridToggle = false;
var grid01Toggle = "grid0";
var instructionsTog = false;
var soundTog = false;
var score = 100;
var move;


// Hold off until fully loaded...
// It all starts here !!!
window.onload = function()
{
	init(window.innerWidth, window.innerHeight);	
}

// Menu item
// Toggles sound on or off and changes menu entry
function soundToggle()
{
	var soundControl = document.getElementById('soundToggle');
	if (soundTog)
	{
		soundTog = false;
		soundControl.innerHTML="Game Sound (OFF)";
	} else 
	{
		soundTog = true;
		soundControl.innerHTML="Game Sound (<span class=\"red\">ON</span>)";
	}
	saveAllVariables();
} 

function instructionsToggle()
{
	var instructions = document.getElementById('instructionsToggle');
	if (instructionsTog)
	{
		instructionsTog = false;
		instructions.innerHTML="Instructions (OFF)";
		document.getElementById('instructions').style.display="none";
	} else 
	{
		instructionsTog = true;
		instructions.innerHTML="Instructions (<span class=\"red\">ON</span>)";
		document.getElementById('instructions').style.display="block";
	}
	saveAllVariables();	
}

function WhichGrid(id)
{
	if (id == "canvas2") 
	{
		var g = document.getElementById('canvas2').style.borderColor="red";
		var g = document.getElementById('canvas3').style.borderColor="white";
		grid01Toggle = "grid0";
	}
	else
	{
		var g = document.getElementById('canvas2').style.borderColor="white";
		var g = document.getElementById('canvas3').style.borderColor="red";
		grid01Toggle = "grid1";
	}
	addHTMCSSGrid();
}
//Menu item
// Draws grid by inserting HTML and changing menu links
function addHTMCSSGrid(Where)
{	
	var canvas2 = document.getElementById('canvas2');
	var ctx2 = canvas2.getContext('2d');
	var canvas3 = document.getElementById('canvas3');
	var ctx3 = canvas3.getContext('2d');
	var grid0 = JSON.parse(localStorage.getItem("grid0"));
	if (grid0 == null) { grid0 = spaceInvaderImage0; }
	var grid1 = JSON.parse(localStorage.getItem("grid1"));
	if (grid1 == null) { grid1 = spaceInvaderImage1; }
	var HTML = "";
	var myColour = "white";
	// These "getElements" need to be here and not global
	var grid = document.getElementById('grid-container');
	var linkControl = document.getElementById('modifyinvaderlink');
	var mini2 = document.getElementById('canvas2');
	var mini3 = document.getElementById('canvas3');

	if (gridToggle && Where == 0)
	{
		linkControl.innerHTML="Modify Invader (OFF)";
		grid.style.display = "none";
		mini2.style.display = "none";
		mini3.style.display = "none";
		gridToggle = false;
		var invaderMod = document.getElementById('invaderMod').style.display="none";
		return;
	}
	gridToggle = true;
	var invaderMod = document.getElementById('invaderMod').style.display="block";
	mini2.style.display = "inline";
	mini3.style.display = "inline";
	linkControl.innerHTML="Modify Invader (<span class=\"red\">ON</span>)";
	grid.style.display = "inline-grid";
	// Which invader image?
	if (grid01Toggle == "grid0")
	{
		var gridDisplay = grid0;
	} else
	{
		var gridDisplay = grid1;
	}
	// Test each bit
	for (var i = 0; i < gridDisplay.length; i++)
	{
		for (var j = 0; j < gridDisplay[0].length; j++)
		{
			// for future handle any colour rather than just white
			if (gridDisplay[i][j] == '1' || (gridDisplay[i][j] != "blue" && gridDisplay[i][j] != "" && gridDisplay[i][j] != "0")) myColour = "white"; else myColour = "blue";
			HTML += " <div onclick=\"changeGrid(this.id)\" class=\"grid-item\" id=\"imageBit"+ i + "-" + j +"\" style=\"background-color:" + myColour + "\">&nbsp;</div>\n";
		}
	}
	// Write the code
	grid.innerHTML = HTML;
	// Draw mini invaders
	DrawMiniInvaders(ctx2, ctx3, grid0, grid0);
	// Save after EVERY change
	saveAllVariables();
}

// Draw mini invaders in mini canvases
function DrawMiniInvaders(ctx2, ctx3, grid0, grid1)
{
	var canvas2 = document.getElementById('canvas2');
	var ctx2 = canvas2.getContext('2d');
	var canvas3 = document.getElementById('canvas3');
	var ctx3 = canvas3.getContext('2d');
	var grid0 = JSON.parse(localStorage.getItem("grid0"));
	if (grid0 == null) { grid0 = spaceInvaderImage0; }
	var grid1 = JSON.parse(localStorage.getItem("grid1"));
	if (grid1 == null) { grid1 = spaceInvaderImage1;}
	DrawGrid(grid0, ctx2);
	DrawGrid(grid1, ctx3);
}

// Draw the grid
function DrawGrid(grid, c)
{
	c.fillStyle = "blue";
	c.fillRect(0,0, 36 * 8, 20 * 8);
	for(let i = 0; i < grid.length; i++)
	{
		for(let j = 0; j < grid[i].length; j++)
		{
			if (grid[i][j] != "blue" && grid[i][j] != 0)
			{
				if (grid[i][j] == 1) c.fillStyle = "white"; else c.fillStyle = grid[i][j];
				c.fillRect(16 + j * 32, 8 + i * 16 , 32 , 16 );
			}
		}
	}	
}

// Save variables locally
function saveAllVariables()
{
	localStorage.setItem("sound", soundTog);
	localStorage.setItem("gridtoggle", gridToggle);
	localStorage.setItem("invaderimage0", JSON.stringify(spaceInvaderImage0));
	localStorage.setItem("invaderimage1", JSON.stringify(spaceInvaderImage1));
	var gridDisplay = new Array(8);
	// make grid array
	for (var y =0; y < 8; y++)
	{
		gridDisplay[y] = new Array(8);
		for (var x = 0; x < 8; x++)
		{
			var gridID = document.getElementById('imageBit'+y+'-'+x);
			gridDisplay[y][x] = gridID.style.backgroundColor;
		}
	}
	if (grid01Toggle == "grid0") gridV = "grid0"; else gridV = "grid1";
	localStorage.setItem(gridV, JSON.stringify(gridDisplay));
}

// change invader grid
function changeGrid(elementID)
{
	var gridElement = document.getElementById(elementID);
	if (gridElement.style.backgroundColor != "blue")
	{
		gridElement.style.backgroundColor = "blue";
	} else
	{
		gridElement.style.backgroundColor = "white";
	}
	saveAllVariables();
	// Draw mini invaders
	DrawMiniInvaders();
}

// Handles key presses
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

function moveLeft()
{
	if (defender.x > edge)
	{	
		defender.oldX = defender.x;
		defender.x -= 2 * scale;
		ClearObject(defender, ctx);
		DrawObject(defender, ctx);
	}
}

function moveRight()
{
		if (defender.x + defender.picture[0].length * scale < canvas.width - edge)
	{
		defender.oldX = defender.x;
		defender.x += 2 * scale;
		ClearObject(defender, ctx);
		DrawObject(defender, ctx);
	}
}

function buttonOn(key) 
{
    if (key == 122) move = setInterval(moveLeft, 30);
	if (key == 120) move = setInterval(moveRight, 30);
	if (key == 32) move = setInterval(fire, 30);
}

function buttonOff()
{
	clearInterval(moveLeft);
	clearInterval(moveRight);
	clearInterval(fire);
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
	var h = document.getElementById("left");
	h.style.height = ((canvas.height - 15) *.80 ) +"px";
	
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
		speed = (canvas.width / canvas.height);
	else
		speed = (scale / 2);
	defender.x = canvas.width / 2;
	defender.y = canvas.height - edge - (10 * scale);
	defender.oldY = defender.y;
	defender.oldX = defender.x;
}

// Get 2d canvas context - return ctx
function getCanvasCTX(id)
{
	canvas = document.getElementById(id);
	var myContext = canvas.getContext('2d');
	canvas.width = window.innerWidth - 5;
	canvas.height = window.innerHeight - 5 ;
	return (myContext);
}

function canvasResize()
{
	canvas.width = window.innerWidth - 5;
	canvas.height = window.innerHeight - 5;
	setScale();
	var h = document.getElementById("left");
	h.style.height = ((canvas.height - 15) * .80) +"px";
	RePositionInvaders(invaders,edge, edge);
	DrawObject(defender, ctx);
	DrawInvaders(invaders, ctx);
	DrawBox(ctx);
	DrawText(ctx);
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
	DrawText(ctx);
}

// Score
function DrawText(ctx)
{
	ctx.textAlign = "center";
	ctx.font = "20px Arial";
	ctx.fillText("Score: " + score, canvas.width/2, 35);
}

// Animate stuff
function Animate(ctx)
{
	if (soundTog)
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
	offsetY = edge + 30;
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
	var offsetY = edge +30;
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

/////////////////////////
// Drag and drop stuff //
/////////////////////////
function allowDrop(ev) {
  ev.preventDefault();
}

// On drag grab the ID
function drag(ev) {
  ev.dataTransfer.setData("src", ev.srcElement.id);
}

// on Drop retieve the src ID
function drop(ev)
{
  ev.preventDefault();
  var data = ev.dataTransfer.getData("src");
  // data now holds the source (canvas2 or 3)
  // Get local data for grid 0 or 1 and convert then save to invaderimage0 or 1
  if (data ==  "canvas2")
  {
  	var grid = JSON.parse(localStorage.getItem("grid0"));
  } else
  {
	var grid = JSON.parse(localStorage.getItem("grid1"));
  }
  // convert grid to invaderimage
  var pic = new Array(8);
  for (var y = 0; y < grid.length; y++)
  {
	var str = "";
	for (var x = 0; x < grid[y].length; x++)
	{
	if (data == "canvas2")
		{
			if (grid[y][x] != "blue" && grid[y][x] != 0) str += "1"; else str += "0";
		} else
		{
			if (grid[y][x] != "blue" && grid[y][x] != 0) str += "1"; else str += "0";  
		}
	}
	pic[y] = str;
  }
  if (data == "canvas2") spaceInvaderImage0 = pic; else spaceInvaderImage1 = pic;
  for(var i = 0; i < 50; i++)
	{
		// add invaders
		invaders[i].oldPicture = spaceInvaderImage0;
		invaders[i].picture = spaceInvaderImage1;
	}
}