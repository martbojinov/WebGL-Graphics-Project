
class Circle {
  constructor(){  // creates point object with default values
    this.type = "circle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
    this.segments = 10;
  }

  render() {      // renders point object based on values
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw
    let delta = this.size / 200;        // adjust to size
    let angleStep = 360/this.segments;  // calucate how many points per triangle

    for (var angle = 0; angle < 360; angle += angleStep) {
      let centerPoint = [ xy[0], xy[1] ];
      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [ Math.cos(angle1*Math.PI/180) * delta,
                   Math.sin(angle1*Math.PI/180) * delta ];
      let vec2 = [ Math.cos(angle2*Math.PI/180) * delta,
                   Math.sin(angle2*Math.PI/180) * delta ];
      let pt1 = [ centerPoint[0] + vec1[0],  centerPoint[1] + vec1[1] ];
      let pt2 = [ centerPoint[0] + vec2[0],  centerPoint[1] + vec2[1] ];

      drawTri([ xy[0], xy[1],  pt1[0], pt1[1],  pt2[0], pt2[1] ]);
    }

  }

}
