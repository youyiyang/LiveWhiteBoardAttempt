var clickX = [];
var clickY = [];
var clickDrag = [];
var canvasWidth = 800;
var canvasHeight = 350;
var paint;
var canvas;
var context;

/**
* Creates a canvas element.
*/
function prepareCanvas()
{
	canvas = document.getElementById('canvasYeah');
    button = document.getElementById('clearCanvas');
	
    context = canvas.getContext("2d");
	
	// Add mouse events
	// ----------------
    button.addEventListener("mousedown", function(e) {
        clearCanvas();
        clickX = [];
        clickY = [];
        clickDrag = [];
    });
    
	canvas.addEventListener("mousedown", function(e)
	{
    
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
      
	});
	
	canvas.addEventListener("mousemove", function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	canvas.addEventListener("mouseup", function(e){
		paint = false;
	  	redraw();
	});
	
  canvas.addEventListener("mouseleave", function(e){
		paint = false;
	});
	
}	

function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw()
{
	clearCanvas();
	
	var radius = 5;
	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = radius;
			
	for(var i=0; i < clickX.length; i++)
	{		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}
}

prepareCanvas();