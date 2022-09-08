/*
  asg4.js by Martin Bojinov, mbojinov@ucsc.edu

  Acknoledgements from Assignment3:
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
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize( vec3( u_NormalMatrix * vec4( a_Normal, 1 ) ) );
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_textureType;
  uniform int u_whichTexture;
  uniform int u_lightToggle;
  uniform int u_lightIndicator;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  void main() {


    if ( u_textureType == -3 ) {          // use "normal vec" shading
      gl_FragColor = vec4( (v_Normal + 1.0)/2.0, 1 );
    } else if ( u_textureType == -2 ) {   // use color
      gl_FragColor = u_FragColor;
    } else if ( u_textureType == -1 ) {   // use UV debug color
      gl_FragColor = vec4(v_UV, 1, 1);
    } else if ( u_textureType == 0 ) {    // use texture

      if ( u_whichTexture == 0 ) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);
      } else {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      }

    } else {                                        // ERROR: use red
      gl_FragColor = vec4( 1, 0.2, 0.2, 1 );
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length( lightVector );

    // Light Indicator
    if ( u_lightIndicator == 1 ) {
      if ( r < 1.0 ) {
        gl_FragColor = vec4( 1, 0, 0, 1 );
      } else if ( r < 2.0 ) {
        gl_FragColor = vec4( 0, 1, 0, 1 );
      }
    }

    if ( u_lightToggle == 1 ) {
      // N dot L
      vec3 L = normalize( lightVector );
      vec3 N = normalize( v_Normal );
      float nDotL = max( dot( N, L ), 0.0 );

      // Reflection Vector
      vec3 R = reflect( -L, N );

      // eye
      vec3 E = normalize( u_cameraPos - vec3(v_VertPos) );

      vec3 diffuse = vec3( gl_FragColor ) * nDotL;
      vec3 ambient = vec3( gl_FragColor ) * 0.3;
      float specular = pow( max( dot( E, R ), 0.0 ), 100.0 );

      gl_FragColor = vec4( diffuse+ambient+specular, 1.0 );
    }

  }`;


// -------------- Global Variables & Setup Functions ---------------------------

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_textureType;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightToggle;
let u_lightIndicator;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_NormalMatrix;


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

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
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

  // Get the storage location of u_lightToggle
  u_lightToggle = gl.getUniformLocation(gl.program, 'u_lightToggle');
  if (!u_lightToggle) {
    console.log('Failed to get the storage location of u_lightToggle');
    return;
  }

  // Get the storage location of u_lightIndicator
  u_lightIndicator = gl.getUniformLocation(gl.program, 'u_lightIndicator');
  if (!u_lightIndicator) {
    console.log('Failed to get the storage location of u_lightIndicator');
    return;
  }

  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
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

  gl.uniform1i(u_lightIndicator, light_indicator_Toggle);
  gl.uniform1i(u_lightToggle, light_Toggle);

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
var cloud1_z = 1.5;                   // default value of clouds 1-5
var cloud2_z = 1;
var cloud3_z = -1;
var cloud4_z = -3;
var cloud5_z = -3.5;
var light_x = 0;                      // default x value of light
var light_y = 5;                      // default y value of light
var light_z = 0;                      // default z value of light

var hand_animation = false;           // hand animation toggle
var beak_animation = false;           // mouth animation toggle
var beak_toggle = true;               // toggle used to switch off beak_animation
var wave_animation = false;           // wave animation toggle
var wave_toggle = true;               // toggle used to switch off wave_animation
var light_animation = true;           // toggle used to switch light anim on/off

var normal_toggle = false;            // toggle used to switch lighing on and off
var light_Toggle = 1;                 // toggle ligthing on and off
var light_indicator_Toggle = 0;       // toggle if light indicator is on

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
  // Normal texture toggle button
  document.getElementById("normaltoggle").onclick = function() {
    if ( normal_toggle ) { normal_toggle = false; }
    else  { normal_toggle = true; } };
  // Lighting button
  document.getElementById("lighttoggle").onclick = function() {
    if ( light_Toggle ) { light_Toggle = 0; }
    else  { light_Toggle = 1; }
    gl.uniform1i(u_lightToggle, light_Toggle); };
  // Light indicator toggle button
  document.getElementById("lightIndicatorToggle").onclick = function() {
    if ( light_indicator_Toggle ) { light_indicator_Toggle = 0; }
    else  { light_indicator_Toggle = 1; }
    gl.uniform1i(u_lightIndicator, light_indicator_Toggle); };
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
  // Light moving animation toggle button
  document.getElementById("lightanim").onclick = function() {
    if ( light_animation ) { light_animation = false; }
    else  { light_animation = true; } };

  // --- Sliders ---
  // Get viewing angle from slider
  document.getElementById("camangle").addEventListener('mousemove',
    function() { cam_angle = this.value; renderScene(); } );
  // Get viewing angle from slider
  document.getElementById("lightx").addEventListener('mousemove',
    function() { light_x = -this.value; renderScene(); } );
  // Get viewing angle from slider
  document.getElementById("lighty").addEventListener('mousemove',
    function() { light_y = this.value; renderScene(); } );
  // Get viewing angle from slider
  document.getElementById("lightz").addEventListener('mousemove',
    function() { light_z = -this.value; renderScene(); } );
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
  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
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

  // send light coords to u_lightpos
  gl.uniform3f(u_lightPos, light_x, light_y, light_z);

  // send camera coords to u_cameraPos
  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  // DRAW -------------------------------------------------

  pengu = new Penguin();
  pengu.render();

  drawWaterPlane();
  drawSkyBox();
  drawClouds();
  drawMap();

  drawLight();

  ball = new Sphere();
  if ( normal_toggle == true ) { ball.textureType = -3; }
  else { ball.textureType = -2; }
  ball.matrix.translate(-6.5, -0.25, 7);
  ball.render();

  ball2 = new Sphere();
  if ( normal_toggle == true ) { ball2.textureType = -3; }
  else { ball2.textureType = -2; }
  ball2.matrix.translate(4, -1.75, 1);
  ball2.render();

  block = new Cube();
  block.color = [1, 0, 0, 1];
  block.matrix.translate(-0.5, 0, 0);
  if ( normal_toggle == true ) { block.textureType = -3; }
  else { block.textureType = -2; }
  //block.render();

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

  // update light position
  updateLight()

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
