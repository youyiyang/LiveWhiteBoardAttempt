var clickX = [];
var clickY = [];
var clickDrag = [];
var canvasWidth = 800;
var canvasHeight = 350;
var colorLog = [];
var color = '#'+Math.random().toString(16).substr(-6);
var paint;
var canvas;
var context;
var base = 'http://clicktime.herokuapp.com:80/rooms/';
var roomName = 'zachroom';  
var socket = io.connect(base + roomName);
var tempX = [];
var tempY = [];
var tempDrag = [];
var tempColor = [];

/**
 * These are the events that the websocket server will emit
 *
 * When sending messages, make sure the type is set to 'message', or other clients won't receive your data
 * (e.g. socket.emit('message', { ... }); )
 */
socket.on('welcome', function () {
   
});

socket.on('message', function (data) {
   
    tempX = tempX.concat(data.xData);
    tempY = tempY.concat(data.yData);
    tempDrag = tempDrag.concat(data.dragData);
    tempColor = tempColor.concat(data.colorData);
    
    redraw(tempX, tempY, tempDrag, tempColor, 0);
    
    tempX = [];
    tempY = [];
    tempDrag = [];
    tempColor = [];
 
    
});



socket.on('heartbeat', function () {
  
});

socket.on('error', function (err) {
    // Sometimes things go wrong!
    var type = err.type;    // This is the type of error that occurred
    var message = err.message;    // This is a friendly message that should describe the error
    alert(type + " " + err.message);
});

/**
* Creates a canvas element.
*/
function prepareCanvas()
{
	canvas = document.getElementById('canvasLive');
    button = document.getElementById('clearCanvas');
	
    context = canvas.getContext("2d");
	
	// Add mouse events
	// ----------------
    button.addEventListener("mousedown", function(e) {
        clearCanvas();
        clickX = [];
        clickY = [];
        clickDrag = [];
        colorLog = [];
    });
    
	canvas.addEventListener("mousedown", function(e)
	{
    
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		paint = true;
		addClick(mouseX, mouseY, false);
     
		redraw(clickX, clickY, clickDrag, colorLog);
        emit();

      
	});
	
	canvas.addEventListener("mousemove", function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw(clickX, clickY, clickDrag, colorLog);
            emit();
		}
	});
	
	canvas.addEventListener("mouseup", function(e){
		paint = false;
	  	redraw(clickX, clickY, clickDrag, colorLog);
        emit();
        
        clickX = [];
        clickY = [];
        clickDrag = [];
        colorLog = [];
        
        
        
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
    colorLog.push(color);
}

function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
    
}



function redraw(x, y, drag, hue)
{	
	var radius = 3;
	
	context.lineJoin = "round";
	context.lineWidth = radius;
    
			
	for(var i = 0; i < x.length + 1; i++)
	{		
        context.strokeStyle = hue[i];
		context.beginPath();
		if(drag[i]){
			context.moveTo(x[i-1], y[i-1]);
		}else{
			context.moveTo(x[i]-1, y[i]);
		}
		context.lineTo(x[i], y[i]);
       
		context.closePath();
		context.stroke();
        
	}
    
    
   
}

function emit() {
    socket.emit('message', {xData: clickX, yData: clickY, dragData: clickDrag, colorData: colorLog});
} 
   


prepareCanvas();