

class Penguin {

  // Creates a pengu object with default values
  constructor(/*M = new Matrix4(),*/ C = [ 0, 0.8, 1, 1 ]){
    this.type = "pengu";
    this.color = C;
    //this.matrix = M;
  }

  render() {
    // --- Blue Body --------------------------------
    // Draw upper body cube
    var u_body = new Cube();
    u_body.color = this.color;
    u_body.matrix.translate(-0.2, 0.5, 0.05);
    u_body.matrix.scale(0.4, 0.3, 0.40);
    if ( normal_toggle == true ) { u_body.textureType = -3; }
    else { u_body.textureType = -2; }
    u_body.render();

    // Draw lower body cube
    var l_body = new Cube();
    l_body.color = this.color;
    l_body.matrix.translate(-0.25, 0.1, 0.05);
    l_body.matrix.scale(0.5, 0.4, 0.45);
    if ( normal_toggle == true ) { l_body.textureType = -3; }
    else { l_body.textureType = -2; }
    l_body.render();

    // --- Grey Face Fur ------------------------------
    // Draw upper face cube
    var u_face = new Cube();
    u_face.color = [ 0.75, 0.75, 0.75, 1 ];
    u_face.matrix.translate(-0.15, 0.5, 0);
    u_face.matrix.scale(0.3, 0.25, 0.05);
    if ( normal_toggle == true ) { u_face.textureType = -3; }
    else { u_face.textureType = -2; }
    u_face.render();

    // Draw lower face cube
    var l_face = new Cube();
    l_face.color = [ 0.75, 0.75, 0.75, 1 ];
    l_face.matrix.translate(-0.2, 0.1, 0);
    l_face.matrix.scale(0.4, 0.4, 0.05);
    if ( normal_toggle == true ) { l_face.textureType = -3; }
    else { l_face.textureType = -2; }
    l_face.render();

    // Draw belly fur cube
    var fur = new Cube();
    fur.color = [ 0.85, 0.85, 0.85, 1 ];
    fur.matrix.translate(-0.15, 0.15, -0.001);
    fur.matrix.scale(0.3, 0.30, 0.05);
    if ( normal_toggle == true ) { fur.textureType = -3; }
    else { fur.textureType = -2; }
    fur.render();

    // --- Eyes --------------------------------
    // Draw rigt pupil cube
    var r_pupil = new Cube();
    r_pupil.color = [ 0, 0, 0, 1 ];
    r_pupil.matrix.translate(-0.10, 0.6, -0.001);
    r_pupil.matrix.scale(0.05, 0.1, 0.05);
    if ( normal_toggle == true ) { r_pupil.textureType = -3; }
    else { r_pupil.textureType = -2; }
    r_pupil.render();

    // Draw left pupil cube
    var l_pupil = new Cube();
    l_pupil.color = [ 0, 0, 0, 1 ];
    l_pupil.matrix.translate(0.05, 0.6, -0.001);
    l_pupil.matrix.scale(0.05, 0.1, 0.05);
    if ( normal_toggle == true ) { l_pupil.textureType = -3; }
    else { l_pupil.textureType = -2; }
    l_pupil.render();

    // --- Beak --------------------------------
    // Draw upper beak cube
    var u_beak = new Cube();
    u_beak.color = [ 0.9, 0.54, 0, 1 ];
    u_beak.matrix.translate(-0.10, 0.575, 0);
    u_beak.matrix.rotate(mouth_angle, 1, 0, 0);
    u_beak.matrix.translate(0, -0.025, -0.15);
    u_beak.matrix.scale(0.2, 0.05, 0.15);
    if ( normal_toggle == true ) { u_beak.textureType = -3; }
    else { u_beak.textureType = -2; }
    u_beak.render();

    // Draw lower beak cube
    var l_beak = new Cube();
    l_beak.color = [ 1, 0.6, 0, 1 ];
    l_beak.matrix.translate(-0.10, 0.525, 0);
    l_beak.matrix.rotate(-mouth_angle, 1, 0, 0);
    l_beak.matrix.translate(0, -0.025, -0.15);
    l_beak.matrix.scale(0.2, 0.05, 0.15);
    if ( normal_toggle == true ) { l_beak.textureType = -3; }
    else { l_beak.textureType = -2; }
    l_beak.render();

    // Draw mouth darkness cube
    var throat = new Cube();
    throat.color = [ 0.4, 0, 0.2, 1 ];
    throat.matrix.translate(-0.10, 0.525, -0.002);
    throat.matrix.scale(0.2, 0.05, 0.05);
    if ( normal_toggle == true ) { throat.textureType = -3; }
    else { throat.textureType = -2; }
    throat.render();

    // --- Arms --------------------------------
    // Draw a left arm
    var l_arm = new Cube();
    l_arm.color = [ 0, 0.8, 1, 1 ];
    l_arm.matrix.translate(0.25, 0.5, 0.2);
    l_arm.matrix.rotate(left_arm_angle, 0, 0, 1);
    l_arm.matrix.rotate(-135, 0, 0, 1);
    var l_arm_coords = new Matrix4(l_arm.matrix);
    l_arm.matrix.translate(-0.075, 0, 0);
    l_arm.matrix.scale(0.15, 0.25, 0.1);
    if ( normal_toggle == true ) { l_arm.textureType = -3; }
    else { l_arm.textureType = -2; }
    l_arm.normal.setInverseOf(l_arm.matrix).transpose();
    l_arm.render();

    // Draw a right arm
    var r_arm = new Cube();
    r_arm.color = [ 0, 0.8, 1, 1 ];
    r_arm.matrix.translate(-0.25, 0.5, 0.2);
    r_arm.matrix.rotate(-right_arm_angle, 0, 0, 1);
    r_arm.matrix.rotate(135, 0, 0, 1);
    var r_arm_coords = new Matrix4(r_arm.matrix);
    r_arm.matrix.translate(-0.075, 0, 0);
    r_arm.matrix.scale(0.15, 0.25, 0.1);
    if ( normal_toggle == true ) { r_arm.textureType = -3; }
    else { r_arm.textureType = -2; }
    r_arm.normal.setInverseOf(r_arm.matrix).transpose();
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
    if ( normal_toggle == true ) { l_hand.textureType = -3; }
    else { l_hand.textureType = -2; }
    l_hand.normal.setInverseOf(l_hand.matrix).transpose();
    l_hand.render();

    // Draw a right hand that connects to right arm
    var r_hand = new Cube();
    r_hand.color = [ 0, 0.8, 1, 1 ];
    r_hand.matrix = r_arm_coords;
    r_hand.matrix.translate(0, 0.2, 0);
    r_hand.matrix.rotate(-right_hand_angle, 0, 0, 1);
    r_hand.matrix.translate(-0.075, 0, 0);  // translate after so that point of rotation is centered
    r_hand.matrix.scale(0.15, 0.2, 0.1);
    if ( normal_toggle == true ) { r_hand.textureType = -3; }
    else { r_hand.textureType = -2; }
    r_hand.normal.setInverseOf(r_hand.matrix).transpose();
    r_hand.render();

    // --- Feet --------------------------------
    var l_foot = new Cube();
    l_foot.color = [ 0.9, 0.54, 0, 1 ];
    l_foot.matrix.translate(-0.30, 0.0, -0.05);
    l_foot.matrix.scale(0.25, 0.1, 0.4);
    if ( normal_toggle == true ) { l_foot.textureType = -3; }
    else { l_foot.textureType = -2; }
    l_foot.render();

    var r_foot = new Cube();
    r_foot.color = [ 0.9, 0.54, 0, 1 ];
    r_foot.matrix.translate(0.05, 0.0, -0.05);
    r_foot.matrix.scale(0.25, 0.1, 0.4);
    if ( normal_toggle == true ) { r_foot.textureType = -3; }
    else { r_foot.textureType = -2; }
    r_foot.render();

  }

}


// Update the angles based on time and sliders
function updatePenguAngles() {
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
