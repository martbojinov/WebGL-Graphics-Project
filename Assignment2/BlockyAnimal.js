/*
  asg0.js by Martin Bojinov, mbojinov@ucsc.edu
  File based off of ColoredPoint.js (c) 2012 matsuda
  Many code elements taken from provided Assignment 1 Video Playlist located @:
    - https://www.youtube.com/playlist?list=PLbyTU_tFIkcMK5FiV6btXxHQAy15p0j7X
*/

// --------------------- Shaders -----------------------------------------------

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

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
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_FragColor;


/* Setup canvas and gl variables */
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // enable depth test in order to see better
  gl.enable(gl.DEPTH_TEST);
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

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}


// ---------------- Functions & Globals for Functions --------------------------

var cam_angle = 0;          // Angle to view 3D objects from
var left_arm_angle = 0;     // Angle to adjust left arm by
var right_arm_angle = 0;    // Angle to adjust right arm by
var left_hand_angle = 0;    // Angle to adjust left hand by
var right_hand_angle = 0;   // Angle to adjust right hand by
var mouth_angle = 0;        // Angle to adjust mouth by

var hand_animation = false; // hand animation toggle
var beak_animation = false; // mouth animation toggle
var beak_toggle = true;     // toggle used to switch off beak_animation
var wave_animation = false; // wave animation toggle
var wave_toggle = true;     // toggle used to switch off wave_animation

var startTime = performance.now()/1000;           // start runtime of program
var seconds = performance.now()/1000 - startTime; // current runtime of program
var beak_start = performance.now()/1000;          // start runtime for beak
var beak_seconds = performance.now()/1000;        // current runtime for beak
var wave_start = performance.now()/1000;          // start runtime for wave
var wave_seconds = performance.now()/1000;        // current runtime for wave


/* Converts all the HTML sliders and buttons into data */
function handleHTML() {

  var audio = document.getElementById("audio");

  // --- Buttons ---

  // Hands animation on button
  document.getElementById("handanimon").onclick = function() {
    hand_animation = true; };

  // Hands animation off button
  document.getElementById("handanimoff").onclick = function() {
    hand_animation = false; };

  // Mouth animation on button
  document.getElementById("quack").onclick = function() {
    beak_animation = true;
    audio.play(); };

  // Wave animation on button
  document.getElementById("wave").onclick = function() {
    wave_animation = true;
    hand_animation = false; };

  // --- Sliders ---

  // Get viewing angle from slider
  document.getElementById("camangle").addEventListener('mousemove',
    function() { cam_angle = this.value; renderScene(); } );

  // Get left arm angle from slider
  document.getElementById("leftarm").addEventListener('mousemove',
    function() { left_arm_angle = this.value; renderScene(); } );

  // Get right arm angle from slider
  document.getElementById("rightarm").addEventListener('mousemove',
    function() { right_arm_angle = this.value; renderScene(); } );

  // Get left hand angle from slider
  document.getElementById("lefthand").addEventListener('mousemove',
    function() { left_hand_angle = this.value; renderScene(); } );

  // Get right hand angle from slider
  document.getElementById("righthand").addEventListener('mousemove',
    function() { right_hand_angle = this.value; renderScene(); } );

  // Get beak angle from slider
  document.getElementById("mouth").addEventListener('mousemove',
    function() { mouth_angle = this.value; renderScene(); } );

}


/* Draws all shapes that are supposed to be on canvas */
function renderScene() {

  var globalRotMatrix =  new Matrix4().rotate(cam_angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // --- Blue Body --------------------------------

  // Draw upper body cube
  var u_body = new Cube();
  u_body.color = [ 0, 0.8, 1, 1 ];
  u_body.matrix.translate(-0.2, -0.1, 0.05);
  u_body.matrix.scale(0.4, 0.3, 0.40);
  u_body.render();

  // Draw lower body cube
  var l_body = new Cube();
  l_body.color = [ 0, 0.8, 1, 1 ];
  l_body.matrix.translate(-0.25, -0.5, 0.05);
  l_body.matrix.scale(0.5, 0.4, 0.45);
  l_body.render();

  // --- Grey Face Fur ------------------------------

  // Draw upper face cube
  var u_face = new Cube();
  u_face.color = [ 0.75, 0.75, 0.75, 1 ];
  u_face.matrix.translate(-0.15, -0.1, 0);
  u_face.matrix.scale(0.3, 0.25, 0.05);
  u_face.render();

  // Draw lower face cube
  var l_face = new Cube();
  l_face.color = [ 0.75, 0.75, 0.75, 1 ];
  l_face.matrix.translate(-0.2, -0.5, 0);
  l_face.matrix.scale(0.4, 0.4, 0.05);
  l_face.render();

  // Draw belly fur cube
  var fur = new Cube();
  fur.color = [ 0.85, 0.85, 0.85, 1 ];
  fur.matrix.translate(-0.15, -0.45, -0.001);
  fur.matrix.scale(0.3, 0.30, 0.05);
  fur.render();

  // --- Eyes --------------------------------

  // Draw rigt pupil cube
  var r_pupil = new Cube();
  r_pupil.color = [ 0, 0, 0, 1 ];
  r_pupil.matrix.translate(-0.10, 0, -0.001);
  r_pupil.matrix.scale(0.05, 0.1, 0.05);
  r_pupil.render();

  // Draw left pupil cube
  var l_pupil = new Cube();
  l_pupil.color = [ 0, 0, 0, 1 ];
  l_pupil.matrix.translate(0.05, 0, -0.001);
  l_pupil.matrix.scale(0.05, 0.1, 0.05);
  l_pupil.render();

  // --- Beak --------------------------------

  // Draw upper beak cube
  var u_beak = new Cube();
  u_beak.color = [ 0.9, 0.54, 0, 1 ];
  u_beak.matrix.translate(-0.10, -0.025, 0);
  u_beak.matrix.rotate(mouth_angle, 1, 0, 0);
  u_beak.matrix.translate(0, -0.025, -0.15);
  u_beak.matrix.scale(0.2, 0.05, 0.15);
  u_beak.render();

  // Draw lower beak cube
  var l_beak = new Cube();
  l_beak.color = [ 1, 0.6, 0, 1 ];
  l_beak.matrix.translate(-0.10, -0.075, 0);
  l_beak.matrix.rotate(-mouth_angle, 1, 0, 0);
  l_beak.matrix.translate(0, -0.025, -0.15);
  l_beak.matrix.scale(0.2, 0.05, 0.15);
  l_beak.render();

  // Draw mouth darkness cube
  var throat = new Cube();
  throat.color = [ 0.4, 0, 0.2, 1 ];
  throat.matrix.translate(-0.10, -0.075, -0.002);
  throat.matrix.scale(0.2, 0.05, 0.05);
  throat.render();

  // --- Arms --------------------------------

  // Draw a left arm
  var l_arm = new Cube();
  l_arm.color = [ 0, 0.8, 1, 1 ];
  l_arm.matrix.translate(0.25, -0.1, 0.2);
  l_arm.matrix.rotate(left_arm_angle, 0, 0, 1);
  l_arm.matrix.rotate(-135, 0, 0, 1);
  var l_arm_coords = new Matrix4(l_arm.matrix);
  l_arm.matrix.translate(-0.075, 0, 0);
  l_arm.matrix.scale(0.15, 0.25, 0.1);
  l_arm.render();

  // Draw a right arm
  var r_arm = new Cube();
  r_arm.color = [ 0, 0.8, 1, 1 ];
  r_arm.matrix.translate(-0.25, -0.1, 0.2);
  r_arm.matrix.rotate(-right_arm_angle, 0, 0, 1);
  r_arm.matrix.rotate(135, 0, 0, 1);
  var r_arm_coords = new Matrix4(r_arm.matrix);
  r_arm.matrix.translate(-0.075, 0, 0);
  r_arm.matrix.scale(0.15, 0.25, 0.1);
  r_arm.render();

  // --- Hands --------------------------------

  // Draw a left hand that connects to left arm
  var l_hand = new Cube();
  l_hand.color = [ 0, 0.8, 1, 1 ];
  l_hand.matrix = l_arm_coords;
  l_hand.matrix.translate(0, 0.2, 0);
  l_hand.matrix.rotate(left_hand_angle, 0, 0, 1);
  l_hand.matrix.translate(-0.075, 0, 0);  // translate after so that point of rotation is centered
  l_hand.matrix.scale(0.15, 0.2, 0.1);
  l_hand.render();

  // Draw a right hand that connects to right arm
  var r_hand = new Cube();
  r_hand.color = [ 0, 0.8, 1, 1 ];
  r_hand.matrix = r_arm_coords;
  r_hand.matrix.translate(0, 0.2, 0);
  r_hand.matrix.rotate(-right_hand_angle, 0, 0, 1);
  r_hand.matrix.translate(-0.075, 0, 0);  // translate after so that point of rotation is centered
  r_hand.matrix.scale(0.15, 0.2, 0.1);
  r_hand.render();

  // --- Feet --------------------------------

  var l_foot = new Cube();
  l_foot.color = [ 0.9, 0.54, 0, 1 ];
  l_foot.matrix.translate(-0.30, -0.6, -0.05);
  l_foot.matrix.scale(0.25, 0.1, 0.4);
  l_foot.render();

  var r_foot = new Cube();
  r_foot.color = [ 0.9, 0.54, 0, 1 ];
  r_foot.matrix.translate(0.05, -0.6, -0.05);
  r_foot.matrix.scale(0.25, 0.1, 0.4);
  r_foot.render();

}


// Update the angles based on time and sliders
function updateAngles() {
  if (hand_animation) { // toggle for automatic animation
    right_arm_angle = ( 45 * Math.sin(seconds) );
    left_arm_angle = ( 45 * Math.sin(seconds) );
    left_hand_angle = ( (45/2) * (Math.sin(seconds)) + (45/2) );
    right_hand_angle = ( (45/2) * (Math.sin(seconds)) + (45/2) );
  }

  if (beak_animation) { // toggle for automatic animation
    if (beak_toggle) {  // toggle to only run once
      beak_start = performance.now()/1000;    // timer start beak
      beak_seconds = performance.now()/1000;  // timer how long run for
      beak_toggle = false;
    }
    mouth_angle = ( (15/2) * Math.cos(5*(beak_seconds-beak_start) + Math.PI) + (15/2) );
    if ( beak_seconds - beak_start > 1.25) { // after running for x seconds, stop
      beak_toggle = true;
      beak_animation = false;
    }
  }

  if (wave_animation) { // toggle for automatic animation
    if (wave_toggle) {  // toggle to only run once
      wave_start = performance.now()/1000;    // timer start wave
      wave_seconds = performance.now()/1000;  // timer how long run for
      wave_toggle = false;
    }
    right_arm_angle = -35;
    left_arm_angle = 60;
    left_hand_angle = ( (45/2) * (Math.sin(10*seconds)) + (45/2) );
    right_hand_angle = 0;
    if ( wave_seconds - wave_start > 3 ) { // after running for x seconds, stop
      wave_toggle = true;
      wave_animation = false;
      left_arm_angle = -35;
      left_hand_angle = 0;
    }
  }

}


// Called by browser repetedly
function tick() {

  // update timers
  seconds = performance.now()/1000 - startTime;
  beak_seconds = performance.now()/1000;
  wave_seconds = performance.now()/1000;

  // update angles
  updateAngles()

  // draw everything
  renderScene();

  // ask to update again
  requestAnimationFrame(tick);

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

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Render
  // renderScene();
  requestAnimationFrame(tick);
}
