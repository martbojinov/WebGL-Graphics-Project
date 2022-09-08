
class Cube {

  // Creates a Cube object with default values
  constructor( M = new Matrix4(), C = [1.0, 1.0, 1.0, 1.0]){
    this.type = "cube";
    this.color = C;
    this.matrix = M;
    this.normal = new Matrix4();
    this.shading = 0;       // if set to 0, sides wont be colored differently
    this.textureType = -2;
    this.whichTexture = 0;
  }

  // Renders Cube object based on values
  render() {
    var rgba = this.color;

    // Pass the textureNum to u_whichTexture variable
    //console.log(this.textureType, this.whichTexture);
    gl.uniform1i(u_textureType, this.textureType);
    gl.uniform1i(u_whichTexture, this.whichTexture);

    // Pass the matrix to u_ModelMatrix variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the matrix to u_ModelMatrix variable
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normal.elements);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw Front of cube
    drawTri3DUVNormal( [ 0,0,0,  1,1,0,  1,0,0 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ 0,0,-1,  0,0,-1,  0,0,-1 ] );
    drawTri3DUVNormal( [ 0,0,0,  0,1,0,  1,1,0 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ 0,0,-1,  0,0,-1,  0,0,-1 ] );
    // Draw Back of cube
    drawTri3DUVNormal( [ 1,0,1,  0,1,1,  0,0,1 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ 0,0,1,  0,0,1,  0,0,1 ]);
    drawTri3DUVNormal( [ 1,0,1,  1,1,1,  0,1,1 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ 0,0,1,  0,0,1,  0,0,1 ] );

    // Reduce and pass the color of a point to u_FragColor variable
    if( this.shading == 1 ){
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    }

    // Draw Top of Cube
    drawTri3DUVNormal( [ 0,1,0,  1,1,1,  1,1,0 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ 0,1,0,  0,1,0,  0,1,0 ] );
    drawTri3DUVNormal( [ 0,1,0,  0,1,1,  1,1,1 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ 0,1,0,  0,1,0,  0,1,0 ] );

    // Draw Bottom of Cube
    drawTri3DUVNormal( [ 0,0,1,  1,0,0,  1,0,1 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ 0,-1,0,  0,-1,0,  0,-1,0 ] );
    drawTri3DUVNormal( [ 0,0,1,  0,0,0,  1,0,0 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ 0,-1,0,  0,-1,0,  0,-1,0 ] );


    // Reduce and pass the color of a point to u_FragColor variable
    if( this.shading == 1 ){
      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    }
    // Draw Right Side of Cube
    drawTri3DUVNormal( [ 1,0,0,  1,1,1,  1,0,1 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ 1,0,0,  1,0,0,  1,0,0 ] );
    drawTri3DUVNormal( [ 1,0,0,  1,1,0,  1,1,1 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ 1,0,0,  1,0,0,  1,0,0 ] );

    // Draw Left Side of Cube
    drawTri3DUVNormal( [ 0,0,1,  0,1,0,  0,0,0 ],
                       [ 0,0,  1,1,  1,0 ],
                       [ -1,0,0,  -1,0,0,  -1,0,0 ] );
    drawTri3DUVNormal( [ 0,0,1,  0,1,1,  0,1,0 ],
                       [ 0,0,  0,1,  1,1 ],
                       [ -1,0,0,  -1,0,0,  -1,0,0 ] );


  }


  // Render without resetting buffer
  renderFast() {
    var rgba = this.color;

    // Pass the textureNum to u_whichTexture variable
    // console.log(this.textureNum);
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the matrix to u_ModelMatrix variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var allverts = [];

    // Draw Front of cube
    allverts=allverts.concat( [ 0,0,0,  1,1,0,  1,0,0 ] );
    allverts=allverts.concat( [ 0,0,0,  0,1,0,  1,1,0 ] );
    // Draw Back of cube
    allverts=allverts.concat( [ 1,0,1,  0,1,1,  0,0,1 ] );
    allverts=allverts.concat( [ 1,0,1,  1,1,1,  0,1,1 ] );

    // Reduce and pass the color of a point to u_FragColor variable
    if( this.shading == 1 ){
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    }

    // Draw Top of Cube
    allverts=allverts.concat( [ 0,1,0,  1,1,1,  1,1,0 ] );
    allverts=allverts.concat( [ 0,1,0,  0,1,1,  1,1,1 ] );

    // Draw Bottom of Cube
    allverts=allverts.concat( [ 0,0,1,  1,0,0,  1,0,1 ] );
    allverts=allverts.concat( [ 0,0,1,  0,0,0,  1,0,0 ] );

    // Reduce and pass the color of a point to u_FragColor variable
    if( this.shading == 1 ){
      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    }
    // Draw Right Side of Cube
    allverts=allverts.concat( [ 1,0,0,  1,1,1,  1,0,1 ] );
    allverts=allverts.concat( [ 1,0,0,  1,1,0,  1,1,1 ] );

    // Draw Left Side of Cube
    allverts=allverts.concat( [ 0,0,1,  0,1,0,  0,0,0 ] );
    allverts=allverts.concat( [ 0,0,1,  0,1,1,  0,1,0 ] );

    //console.log(allverts);

    drawTri3D(allverts);

  }
}
