// asg0.js by Martin Bojinov, mbojinov@ucsc.edu
// File based off DrawTriangle.js (c) 2012 matsuda

// Program Contents:
//  - Functions:
//    - main()
//    - Math Funtions:
//      - angleBetween()
//      - areaTriangle()
//    - Draw Functions:
//      - clearCanvas()
//      - drawVector()
//      - handleDrawEvent()
//      - handleDrawOperationEvent()

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  // Get the rendering context for 2DCG & set global vars
  ctx = canvas.getContext('2d');
  cnv1_origin_x = canvas.width / 2;
  cnv1_origin_y = canvas.height / 2;

  // Draw a black rectangle
  ctx.fillStyle = 'black';                          // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill rectangle with color
}


// --------------------- Math Functions ----------------------------------------


// returns the angle between two vectors using the dot product
function angleBetween(v1, v2) {
  let d = Vector3.dot(v1, v2);
  let m1 = v1.magnitude();
  let m2 = v2.magnitude();

  let angle_rad = Math.acos(d / (m1 * m2));
  let angle_deg = angle_rad * (180/Math.PI)

  console.log("Angle in Degrees:", angle_deg, "\nAngle in Radians:",
    angle_rad);
}


// returns the area of the triangle created between the two vecs
function areaTriangle(v1, v2) {
  let v3 = Vector3.cross(v1, v2);
  let area = v3.magnitude() / 2;
  console.log("Area of the Triangle:", area);
}


// --------------------- Draw Functions ----------------------------------------


// Refills the Canvas to be a black rectangle
function clearCanvas() {
  ctx.fillStyle = 'black';                          // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill rectangle with color
}


// Takes in a Vec3 and a color and draws it onto the canvas.
function drawVector(v, color) {
  //console.log('Run drawVector');
  // Take Vec3 values and calculate to fit on canvas
  let x_offset = v.elements[0] * 20;
  let y_offset = v.elements[1] * 20;

  // Set color
  ctx.strokeStyle = color;

  // Draw
  ctx.beginPath();
  ctx.moveTo(cnv1_origin_x, cnv1_origin_y);
  ctx.lineTo(cnv1_origin_x + x_offset, cnv1_origin_y - y_offset);
  ctx.closePath();
  ctx.stroke();

}


// On "Draw" button click, take values from text boxes and draw vectors
function handleDrawEvent() {
  //console.log('Run handleDrawEvent');
  clearCanvas();

  // Get values for V1
  let x1 = document.getElementById("v1x").value;
  let y1 = document.getElementById("v1y").value;
  let v1 = new Vector3([x1, y1, 0]);

  // Get values for V2
  let x2 = document.getElementById("v2x").value;
  let y2 = document.getElementById("v2y").value;
  let v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");

  return [v1, v2]; // return statement used by handleDrawOperationEvent()
}


// On "Draw" button click, draw original 2 vectors. Also draw 3rd and/or 4th
// vector
function handleDrawOperationEvent(){
  //console.log('Run handleDrawOperationEvent');
  let [v1, v2] = handleDrawEvent() // Get v1 and v2

  // Get select statement.
  let op = document.getElementById("op-select").value;
  let v3 = new Vector3;
  let v4 = new Vector3;

  // Get Scalar
  let sca = document.getElementById("sca").value;

  // Swtich based on select statement
  switch (op) {
    case "add": // add v1 and v2 and draw
      v3.set(v1);
      v3.add(v2);
      drawVector(v3, "green");
      break;
    case "sub": // sub v2 from v1 and draw
      v3.set(v1);
      v3.sub(v2);
      drawVector(v3, "green");
      break;
    case "mul": // mul v1 and v2 by scalar and draw
      v3.set(v1);
      v4.set(v2);
      v3.mul(sca);
      v4.mul(sca);
      drawVector(v3, "green");
      drawVector(v4, "green");
      break;
    case "div": // div v1 and v2 by scalar and draw
      v3.set(v1);
      v4.set(v2);
      v3.div(sca);
      v4.div(sca);
      drawVector(v3, "green");
      drawVector(v4, "green");
      break;
    case "mag": // return the mag of v1, v2 into console
      let m1 = v1.magnitude();
      let m2 = v2.magnitude();
      console.log("V1 Magnitude:", m1);
      console.log("V2 Magnitude:", m2);
      break;
    case "norm": // draw v1, v2 as normalized vecs
      v3.set(v1);
      v4.set(v2);
      v3.normalize();
      v4.normalize();
      drawVector(v3, "green");
      drawVector(v4, "green");
      break;
    case "dot": // find angle between v1 and v2. put into console
      angleBetween(v1, v2);
      break;
    case "cross": // find area of triangle craeted by v1 and v2. put into console
      areaTriangle(v1, v2);
      break;
    default:    // do nothing
    break;

  }

}
