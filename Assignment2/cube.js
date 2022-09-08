
class Cube {

  // Creates a Cube object with default values
  constructor(M = new Matrix4(), C = [1.0, 1.0, 1.0, 1.0]){
    this.type = "cube";
    this.color = C;
    this.matrix = M;
  }

  // Renders Cube object based on values
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the matrix to u_ModelMatrix variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw Front of cube
    drawTri3D([ 0,0,0,  1,1,0,  1,0,0 ]);
    drawTri3D([ 0,0,0,  0,1,0,  1,1,0 ]);
    // Draw Back of cube
    drawTri3D([ 0,0,1,  1,1,1,  1,0,1 ]);
    drawTri3D([ 0,0,1,  0,1,1,  1,1,1 ]);

    // Reduce and pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    // Draw Top of Cube
    drawTri3D([ 0,1,0,  0,1,1,  1,1,1 ]);
    drawTri3D([ 0,1,0,  1,1,1,  1,1,0 ]);
    // Draw Bottom of Cube
    drawTri3D([ 0,0,0,  0,0,1,  1,0,1 ]);
    drawTri3D([ 0,0,0,  1,0,1,  1,0,0 ]);

    // Reduce and pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    // Draw Right Side of Cube
    drawTri3D([ 1,0,0,  1,1,0,  1,1,1 ]);
    drawTri3D([ 1,0,0,  1,1,1,  1,0,1 ]);
    // Draw Left Side of Cube
    drawTri3D([ 0,0,0,  0,1,0,  0,1,1 ]);
    drawTri3D([ 0,0,0,  0,1,1,  0,0,1 ]);

  }

}
