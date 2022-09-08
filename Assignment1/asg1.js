/*
  asg0.js by Martin Bojinov, mbojinov@ucsc.edu
  File based off of ColoredPoint.js (c) 2012 matsuda
  Many code elements taken from provided Assignment 1 Video Playlist located @:
    - https://www.youtube.com/playlist?list=PLbyTU_tFIkcMK5FiV6btXxHQAy15p0j7X
*/

// --------------------- Shaders -----------------------------------------------

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


// -------------- Global Variables & Setup Functions ---------------------------

let canvas;
let gl;
let a_Position;
let a_PointSize;
let u_FragColor;

/* Setup canvas and gl variables */
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

/* Setup GLSL shader programs and connect GLSL variables */
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_PointSize
  a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}


// --------------------- Main --------------------------------------------------

function main() {

  // Setup canvas and gl variables
  setupWebGL();
  // Setup GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Converts all the HTML sliders and buttons into data (such as updating
  // select_color and select_size)
  handleHTML();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if( ev.buttons == 1 ) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


// ---------------- Functions & Globals for Functions --------------------------

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

var g_shapes_list = [];                     // Array of shapes to be drawn
var select_color = [1.0, 1.0, 1.0, 1.0];    // Default color to be drawn
var select_size = [20.0];                   // Default size to be drawn
var select_shape = POINT;                   // Default shape to be drawn
var select_segment_count = 10;              // Default # of segments for circle
var mirror_over_x = 0;                      // Do not mirror over x
var mirror_over_y = 0;                      // Do not mirror over y

/* Adds shape to be drawn based on clicked location on canvas */
function click(ev) {

  // Take click on canvas and convert into GL coord system
  [x, y] = convertCoordsEventToGL(ev);

  // Converts all the HTML sliders and buttons into data (such as updating
  // select_color and select_size)
  handleHTML();

  let shape;
  // Create Shape and set values
  if (select_shape == POINT) {            // point
    shape = new Point();
  } else if (select_shape == TRIANGLE) {  // tri
    shape = new Triangle();
  } else {                                // circle
    shape = new Circle();
    shape.segments = select_segment_count;
  }
  shape.position = [x, y];
  shape.color = select_color;
  shape.size = select_size;

  // Pushes shape to list of shapes
  g_shapes_list.push(shape);

  // Handle if points are to be mirrored
  if (mirror_over_x==1 || mirror_over_y==1) {
    mirrorPoints(shape);
  }


  // Draw shape that is supposed to be on canvas
  renderAllShapes();
}

/* Converts all the HTML sliders and buttons into data */
function handleHTML() {
  // Clears canvas on "Clear Canvas" button click
  document.getElementById("clear").onclick = function() { g_shapes_list = [];
      renderAllShapes();  };

  // Change shape
  document.getElementById("square").onclick = function() { select_shape =
      POINT; };
  document.getElementById("triangle").onclick = function() { select_shape =
      TRIANGLE; };
  document.getElementById("circle").onclick = function() { select_shape =
      CIRCLE; };

  // Get RGB Values from sliders
  let r = document.getElementById("r").value;
  let g = document.getElementById("g").value;
  let b = document.getElementById("b").value;
  let a = document.getElementById("a").value;
  select_color = [r, g, b, a];

  // Get shape size from slider
  select_size = document.getElementById("size").value;

  // Get Cirlce Segment Count
  select_segment_count = document.getElementById("circleSEG").value;

  // Changes background color to select RGB
  document.getElementById("ccb").onclick = changeBackgroundColor;

  // Check if mirroring over x or y coords.
  mirror_over_x = document.getElementById("xaxis").value;
  mirror_over_y = document.getElementById("yaxis").value;
}

/* Take click on canvas and convert into GL coord system */
function convertCoordsEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];
}

/* Draw shape that is supposed to be on canvas */
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // print all shapes in list
  var len = g_shapes_list.length;
  for(var i = 0; i < len; i++) {
    g_shapes_list[i].render();
  }
}

/* Changes background color to select RGB */
function changeBackgroundColor() {
  let r = document.getElementById("r").value;
  let g = document.getElementById("g").value;
  let b = document.getElementById("b").value;
  let a = document.getElementById("a").value;
  // Specify the color for clearing <canvas>
  gl.clearColor(r, g, b, a);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderAllShapes()
}

/* Point mirroring */
function mirrorPoints(shape) {
  let mirrored_shape;
  if (shape.type == "point") {            // point
    mirrored_shape = new Point();
  } else if (shape.type == "triangle") {  // tri
    mirrored_shape = new Triangle();
  } else {                                // circle
    mirrored_shape = new Circle();
    mirrored_shape.segments = select_segment_count;
  }

  if (mirror_over_x==1 && mirror_over_y==1) {         // mirror over x and y
    mirrored_shape.position = [ -shape.position[0], -shape.position[1] ];
  } else if (mirror_over_x==1 && mirror_over_y==0) {  // mirror over x
    mirrored_shape.position = [ -shape.position[0], shape.position[1] ];
  } else {                                            // mirror over y
    mirrored_shape.position = [ shape.position[0], -shape.position[1] ];
  }


  mirrored_shape.color = select_color;
  mirrored_shape.size = select_size;

  // Pushes shape to list of shapes
  g_shapes_list.push(mirrored_shape);


}
