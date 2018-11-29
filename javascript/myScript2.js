// Global vars


window.onload = function()
{
	document.getElementById("p2").innerHTML = localStorage.getItem("test");
	init(window.innerWidth, window.innerHeight);	
}


function uniCharCode(event) 
{
    var key = event.keyCode;
	console.log(key);
	if (key == 65)
		localStorage.setItem("test", "£");
	else
		localStorage.setItem("test", "rubbish");
	document.getElementById("p2").innerHTML = localStorage.getItem("test");

}

// Interval times may need changing to request animation frame
// 
function init(width, height)
{
	console.log('Init fired');

}


