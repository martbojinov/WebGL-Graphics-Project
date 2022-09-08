
class Point {
  constructor(){  // creates point object with default values
    this.type = "point";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
  }

  render() {      // renders point object based on values
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Quit using buffer to send the attribute
    gl.disableVertexAttribArray(a_Position);
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the size of point to a_PointSize variable
    gl.vertexAttrib1f(a_PointSize, size);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
