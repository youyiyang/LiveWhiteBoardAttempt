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
var drawCounter = 0;
var emitCounter = 0;
var base = 'http://clicktime.herokuapp.com:80/rooms/';
var roomName = 'zachroom';  
var socket = io.connect(base + roomName);

/**
 * These are the events that the websocket server will emit
 *
 * When sending messages, make sure the type is set to 'message', or other clients won't receive your data
 * (e.g. socket.emit('message', { ... }); )
 */
socket.on('welcome', function () {


   
});

socket.on('message', function (data) {
   
    clickX = clickX.concat(data.xData);
    clickY = clickY.concat(data.yData);
    clickDrag = clickDrag.concat(data.dragData);
    colorLog = colorLog.concat(data.colorData);
    
});



socket.on('heartbeat', function () {
   socket.emit('drawing', {xData: clickX, yData: clickY, dragData: clickDrag});
  
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
    
  canvas.addEventListener("mouseover", function(e) {
        
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
    drawCounter = 0;
    emitCounter = 0;
    clickX = [];
    clickY = [];
    clickDrag = [];
    colorLog = [];
    
}


function nEmit(ray) {
    var testy = [];
    for (var i = emitCounter; i < ray.length; i++) {
        testy.push(ray[i]);
    }
    return testy;
}

function redraw()
{	
	var radius = 3;
	
	context.lineJoin = "round";
	context.lineWidth = radius;
    
    socket.emit('message', {xData: nEmit(clickX), yData: nEmit(clickY), dragData: nEmit(clickDrag), colorData: nEmit(colorLog)});
    emitCounter = clickX.length;
			
	for(var i = drawCounter; i < clickX.length; i++)
	{		
        context.strokeStyle = colorLog[i];
		context.beginPath();
		if(clickDrag[i]){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
       
		context.closePath();
		context.stroke();
        drawCounter = clickX.length;
	}
   
   
}

prepareCanvas();