/*
  asg3.js by Martin Bojinov, mbojinov@ucsc.edu

  Acknoledgements:
    - Nether Portal - Kyle Hilton:
      https://people.ucsc.edu/~kylhilto/cse160/Assignment3/asg3.html
      I got stuck on the math for how to rotate my camera and looking at this
      realy helped. Can be seen in lookLeft() and lookRight() in camera.js

*/

// --------------------- Shaders -----------------------------------------------

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_textureType;
  uniform int u_whichTexture;
  void main() {
    if ( u_textureType == -2 ) {                   // use color
      gl_FragColor = u_FragColor;
    } else if ( u_textureType == -1 ) {            // use UV debug color
      gl_FragColor = vec4(v_UV, 1, 1);
    } else if ( u_textureType == 0 ) {             // use texture
      if ( u_whichTexture == 0 ) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);
      } else {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      }

    } else {                                        // ERROR: use red
      gl_FragColor = vec4( 1, 0.2, 0.2, 1 );
    }

  }`;


// -------------- Global Variables & Setup Functions ---------------------------

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_textureType;
let u_whichTexture;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;


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

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_textureType
  u_textureType = gl.getUniformLocation(gl.program, 'u_textureType');
  if (!u_textureType) {
    console.log('Failed to get the storage location of u_textureType');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}


/* Initialize Textures */
function initTextures(gl, n) {
  // Create a texture object
  var texture0 = gl.createTexture();
  var texture1 = gl.createTexture();
  if (!texture0 || !texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendTextureToGLSL(texture0, u_Sampler0, image0, 0); };
  image1.onload = function(){ sendTextureToGLSL(texture1, u_Sampler1, image1, 1); };
  // Tell the browser to load an image
  image0.src = 'snow.jpg';
  image1.src = 'water.jpg';

  return true;
}


/* Load Textures */
function sendTextureToGLSL(texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler

  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


// ---------------- Functions & Globals for Functions --------------------------

var cam_angle = 0;                    // Angle to view 3D objects from
var left_arm_angle = 0;               // Angle to adjust left arm by
var right_arm_angle = 0;              // Angle to adjust right arm by
var left_hand_angle = 0;              // Angle to adjust left hand by
var right_hand_angle = 0;             // Angle to adjust right hand by
var mouth_angle = 0;                  // Angle to adjust mouth by
var water_height = -2;                // default value of water (ground plane)
var cloud1_z = 1.5;                   // default value of clouds
var cloud2_z = 1;
var cloud3_z = -1;
var cloud4_z = -3;
var cloud5_z = -3.5;

var hand_animation = false;           // hand animation toggle
var beak_animation = false;           // mouth animation toggle
var beak_toggle = true;               // toggle used to switch off beak_animation
var wave_animation = false;           // wave animation toggle
var wave_toggle = true;               // toggle used to switch off wave_animation

var startTime = performance.now()/1000;           // start runtime of program
var seconds = performance.now()/1000 - startTime; // current runtime of program
var beak_start = performance.now()/1000;          // start runtime for beak
var beak_seconds = performance.now()/1000;        // current runtime for beak
var wave_start = performance.now()/1000;          // start runtime for wave
var wave_seconds = performance.now()/1000;        // current runtime for wave

var camera = new Camera();            // set default camera


/* Converts all the HTML sliders and buttons into data */
function handleHTML() {
  // --- Audio ---
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
}


/* Handles keydown events */
function keydown( ev ) {
  if ( ev.keyCode == 87 ) {         // w - move forward
    camera.forward();
  } else if ( ev.keyCode == 65 ) {  // a - move left
    camera.left();
  } else if ( ev.keyCode == 83 ) {  // s - move back
    camera.backward();
  } else if ( ev.keyCode == 68 ) {  // d - move right
    camera.right();
  } else if ( ev.keyCode == 81 ) {  // q - look left (5 degrees)
    camera.lookLeft();
  } else if ( ev.keyCode == 69 ) {  // e - look right (5 degrees)
    camera.lookRight();
  } else if ( ev.keyCode == 82 ) {  // r - move up
    camera.goUP();
  } else if ( ev.keyCode == 70 ) {  // f - move down
    camera.goDown();
  }
  renderScene();

}


/* Draws all shapes that are supposed to be on canvas */
function renderScene() {

  // Pass the projection matrix
  var projMat =  new Matrix4();
  projMat.setPerspective( 90, canvas.width/canvas.height, 0.1, 1000 );
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat =  new Matrix4();
  viewMat.setLookAt( camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],   // (eye, at, up)
                     camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
                     camera.up.elements[0], camera.up.elements[1], camera.up.elements[2], );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the global rotation matrix
  var globalRotMat =  new Matrix4().rotate(cam_angle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  pengu = new Penguin();
  pengu.render();

  drawWaterPlane();
  drawSkyBox();
  drawClouds();

  drawMap();

}


// Called by browser repetedly
function tick() {
  // update timers
  seconds = performance.now()/1000 - startTime;
  beak_seconds = performance.now()/1000;
  wave_seconds = performance.now()/1000;

  // update angles of penguin, function in penguin.js
  updatePenguAngles();

  // update water height to increase and decrease
  updateWater();
  updateClouds();

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

  // Handle events when key is pushed on the keyboard
  document.onkeydown = keydown;

  // Initialize Textures
  initTextures(gl, 0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Render
  // renderScene();
  requestAnimationFrame(tick);
}
