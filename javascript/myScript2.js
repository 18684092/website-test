// Global vars


window.onload = function()
{
	init(window.innerWidth, window.innerHeight);	
}


function uniCharCode(event) 
{
    var key = event.keyCode;
	console.log(key);
	localStorage.setItem("test", "£");
	document.getElementById("p2").innerHTML = localStorage.getItem("test");

}

// Interval times may need changing to request animation frame
// 
function init(width, height)
{
	console.log('Init fired');

}


