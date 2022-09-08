
class Sphere {

  // Creates a Sphere object with default values
  constructor( M = new Matrix4(), C = [1.0, 1.0, 1.0, 1.0]){
    this.type = "sphere";
    this.color = C;
    this.matrix = M;
    this.shading = 1;       // if set to 0, sides wont be colored differently
    this.textureType = -2;
    this.whichTexture = 0;
  }

  // Renders Sphere object based on values
  render() {
    var rgba = this.color;

    // Pass the textureNum to u_whichTexture variable
    //console.log(this.textureType, this.whichTexture);
    gl.uniform1i(u_textureType, this.textureType);
    gl.uniform1i(u_whichTexture, this.whichTexture);

    // Pass the matrix to u_ModelMatrix variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw
    var d = Math.PI / 10;
    var dd = Math.PI / 10;

    for ( var t = 0; t < Math.PI; t += d ) {            // iterate 10 times
      for ( var r = 0; r < ( 2 * Math.PI ); r += d ) {    // iterate 20 times
        var p1 = [ Math.sin(t)*Math.cos(r),        Math.sin(t)*Math.sin(r),        Math.cos(t) ];
        var p2 = [ Math.sin(t+dd)*Math.cos(r),     Math.sin(t+dd)*Math.sin(r),     Math.cos(t+dd) ];
        var p3 = [ Math.sin(t)*Math.cos(r+dd),     Math.sin(t)*Math.sin(r+dd),     Math.cos(t) ];
        var p4 = [ Math.sin(t+dd)*Math.cos(r+dd),  Math.sin(t+dd)*Math.sin(r+dd),  Math.cos(t+dd) ];

        var v = [];
        var uv = [];
        v = v.concat( p1 );   uv = uv.concat( [ 0, 0 ] );
        v = v.concat( p2 );   uv = uv.concat( [ 0, 0 ] );
        v = v.concat( p4 );   uv = uv.concat( [ 0, 0 ] );
        drawTri3DUVNormal( v, uv, v );

        v = [];
        uv = [];
        v = v.concat( p1 );   uv = uv.concat( [ 0, 0 ] );
        v = v.concat( p4 );   uv = uv.concat( [ 0, 0 ] );
        v = v.concat( p3 );   uv = uv.concat( [ 0, 0 ] );
        drawTri3DUVNormal( v, uv, v );

      }
    }


  }
}
