
class Triangle {
  constructor(){  // creates point object with default values
    this.type = "triangle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
  }

  render() {      // renders point object based on values
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw an equalateral triangle
    let delta = this.size / 1400;
    drawTri([ xy[0], xy[1]+(5 * delta),   xy[0]-(4 * delta), xy[1]-(3 * delta),
        xy[0]+(4 * delta), xy[1]-(3 * delta) ]);
  }

}


// Draw a 2D triangle
function drawTri(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


// Draw a 3D Triangle
function drawTri3D(vertices) {
  var n = vertices.length / 3; // The number of vertices
  //console.log(n);

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


// Draw a 3D Triangle using UV coords
function drawTri3DUV(vertices, uv) {
  var n = 3; // The number of vertices

  // Create a vertex buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the vertex buffer object');
    return -1;
  }
  // Bind the vertex buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the vertex buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // Assign the vertex buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Create a uv buffer object
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the uv buffer object');
    return -1;
  }
  // Bind the uv buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the uv buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  // Assign the uv buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


// Draw a 3D Triangle using UV coords
function drawTri3DUVNormal(vertices, uv, normals) {
  var n = 3; // The number of vertices

  // Create a vertex buffer object ------------------------
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the vertex buffer object');
    return -1;
  }
  // Bind the vertex buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the vertex buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // Assign the vertex buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Create a uv buffer object ----------------------------
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the uv buffer object');
    return -1;
  }
  // Bind the uv buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the uv buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  // Assign the uv buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);

  // Create a normal buffer object ------------------------
  var normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log('Failed to create the normal buffer object');
    return -1;
  }
  // Bind the normal buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // Write date into the normal buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  // Assign the normal buffer object to a_Normal variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_Normal);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
