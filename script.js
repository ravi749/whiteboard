//Socket Initialiszation and getting context of canvas 
var socket =io();
//console.log(socket);   

var canvas = document.querySelector(".board");
var context = canvas.getContext("2d");

var drawing = false;
var current = {
  color: "black"
};

//To reduce the flow of data sent in a stipulated time
function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      var time = new Date().getTime();
  
      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }




function onMouseDown(e){
drawing = true;
current.x = e.clientX || e.touches[0].clientX ;
current.y = e.clientY || e.touches[0].clientY;


}

function onMouseUp(e)
{
    if(!drawing) 
    {
    return;
    }
drawing = false;


drawIt(   
    current.x,
    current.y,
    e.clientX || e.touches[0].clientX,
    e.clientY || e.touches[0].clientY,
    current.color,
    true  
);

}

function onMouseMove(e){
    if(!drawing) 
    {
    return;
    }
    
    drawIt(   
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true  
    );
    
    current.x = e.clientX || e.touches[0].clientX ;
    current.y = e.clientY || e.touches[0].clientY;
    

}

function drawIt(x0, y0 , x1, y1, color, emit)
{
context.beginPath();
context.moveTo(x0,y0);
context.lineTo(x1,y1);
context.strokeStyle = color;
context.lineWidth = 2;
context.stroke();
context.closePath();


if(!emit)
{ 
    return; 
}

var wd =canvas.width;
var ht = canvas.height;

socket.emit( "drawing",{
        x0:x0/wd,
        y0:y0/ht,
        x1:x1/wd,
        y1:y1/ht,
        color

    });

  }

 
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

 
  canvas.addEventListener("touchstart", onMouseDown, false);
  canvas.addEventListener("touchend", onMouseUp, false);
  canvas.addEventListener("touchcancel", onMouseUp, false);
  canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

 
  function reSize()
  {
      canvas.width = window.innerWidth;
      canvas.height = wind.innerHeight;
  }

  window.addEventListener("resize", reSize);
  reSize();

  function onDrawingEvent(data)
  {
    var wd =canvas.width;
    var ht = canvas.height;
    drawLine(data.x0 * wd, data.y0 * ht, data.x1 * wd, data.y1 * ht, data.color);
}
socket.on("drawing", onDrawingEvent);