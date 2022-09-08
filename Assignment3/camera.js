
class Camera {

  // Creates a camera object with default values
  constructor(){
    this.type = "camera";
    this.eye = new Vector3( [0,2,-5] );
    this.at = new Vector3( [0,2,-2] );
    this.up = new Vector3( [0,1,0] );
  }


  // move camera coords forward
  forward() {
    var d = new Vector3;
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    this.at.add(d);
    this.eye.add(d);
  }


  // move camera coords forward
  backward() {
    var d = new Vector3;
    d.set(this.eye);
    d.sub(this.at);
    d.normalize();
    this.at.add(d);
    this.eye.add(d);
  }


  // move camera coords left
  left() {
    var d = new Vector3;
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    var s = Vector3.cross(this.up, d);
    this.at.add(s);
    this.eye.add(s);
  }


  // move camera coords right
  right() {
    var d = new Vector3;
    d.set(this.eye);
    d.sub(this.at);
    d.normalize();
    var s = Vector3.cross(this.up, d);
    this.at.add(s);
    this.eye.add(s);
  }


  // move camera coords up, for some reason "up()" was not recognized as a
  // valid function name so these functions follow a different naming convention
  goUP() {
		this.at.add(this.up);
    this.eye.add(this.up);
  }


  // move camera coords down
  goDown() {
		this.at.sub(this.up);
    this.eye.sub(this.up);
  }


  // move camera to look left
  lookLeft() {
    var d = new Vector3;
    d.set(this.at);
    d.sub(this.eye);
    let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

		// Get the vec3 translation of Matrix4 Rotation Matrix
		let d3D = rotationMatrix.multiplyVector3(d);

		this.at = d3D.add(this.eye);
  }


  // move camera to look right
  lookRight() {
    var d = new Vector3;
    d.set(this.at);
    d.sub(this.eye);
    let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

		// Get the vec3 translation of Matrix4 Rotation Matrix
		let d3D = rotationMatrix.multiplyVector3(d);

		this.at = d3D.add(this.eye);
  }


}
