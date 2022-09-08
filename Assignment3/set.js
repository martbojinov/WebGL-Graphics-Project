
// draws water ground plane
function drawWaterPlane() {
  var ground = new Cube();
  ground.color = [ 0.09, 0.32, 0.48, 1 ];
  ground.matrix.translate(0, water_height, 0);
  ground.matrix.scale(32, 0, 32);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.textureType = 0;
  ground.whichTexture = 1;

  ground.render();
}


// updates water to flow up and down
function updateWater(){
  water_height = ( (1/4) * Math.sin((1/2) * seconds) ) - 1.75;
}


// draws skybox - slighty gray skys
function drawSkyBox() {
  var skybox = new Cube();
  skybox.color = [ 0.6, 0.75, 0.92, 1 ];
  skybox.matrix.translate(0, -2, 0);
  skybox.matrix.scale(32, 12, 32);
  skybox.matrix.translate(-0.5, 0, -0.5);
  skybox.textureType = -2;
  skybox.shading = 0;
  skybox.render();
}


// draws clouds
function drawClouds() {
  var cloud1 = new Cube();
  cloud1.color = [ 0.6, 0.6, 0.6, 1 ];
  cloud1.matrix.translate(0, 7.5, 0);
  cloud1.matrix.scale(12, 1.5, 6);
  cloud1.matrix.translate(-1, 0, cloud1_z);
  cloud1.textureType = -2;
  cloud1.render();

  var cloud2 = new Cube();
  cloud2.color = [ 0.5, 0.5, 0.5, 1 ];
  cloud2.matrix.translate(0, 8, 0);
  cloud2.matrix.scale(3, 1, 2);
  cloud2.matrix.translate(1, 0, cloud2_z);
  cloud2.textureType = -2;
  cloud2.render();

  var cloud3 = new Cube();
  cloud3.color = [ 0.5, 0.5, 0.5, 1 ];
  cloud3.matrix.translate(0, 6.5, 0);
  cloud3.matrix.scale(3, 1, 4);
  cloud3.matrix.translate(-2, 0, cloud3_z);
  cloud3.textureType = -2;
  cloud3.render();

  var cloud4 = new Cube();
  cloud4.color = [ 0.45, 0.45, 0.45, 1 ];
  cloud4.matrix.translate(0, 7, 0);
  cloud4.matrix.scale(5, 2, 5);
  cloud4.matrix.translate(-3, 0, cloud4_z);
  cloud4.textureType = -2;
  cloud4.render();

  var cloud5 = new Cube();
  cloud5.color = [ 0.6, 0.6, 0.6, 1 ];
  cloud5.matrix.translate(0, 6.5, 0);
  cloud5.matrix.scale(5, 1.5, 3);
  cloud5.matrix.translate(2, 0, cloud5_z);
  cloud5.textureType = -2;
  cloud5.render();
}


function updateClouds() {
  cloud1_z += 0.005;
  cloud2_z += 0.005;
  cloud3_z += 0.005;
  cloud4_z += 0.005;
  cloud5_z += 0.005;
  if (cloud1_z > 4) {
    cloud1_z = -4;
  }
  if (cloud2_z > 4) {
    cloud2_z = -4;
  }
  if (cloud3_z > 6) {
    cloud3_z = -4;
  }
  if (cloud4_z > 6) {
    cloud4_z = -4;
  }
  if (cloud5_z > 6) {
    cloud5_z = -4;
  }

  //console.log(cloud1_z);
}


// cube map to draw islands with on water
var cube_map = [
  [ 4,3,2,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],   // behind camera
  [ 3,2,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 3,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],

  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,1,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,1,1, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,2,1, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,1,0, 0,0,0,0 ],

  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,2,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 3,6,0,0, 0,0,0,0 ],
  [ 0,0,1,1, 0,0,0,0, 0,0,1,2, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,5,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],

  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,1,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,1,1, 2,2,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,2 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,2,2, 2,2,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,1 ],

  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,2,2,2, 2,2,3,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,2,2, 1,1,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],

  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,2,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 1,1,0,0, 0,0,0,0, 0,0,0,0, 0,1,1,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,1, 1,1,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,1, 1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],

  [ 0,0,0,0, 0,0,0,1, 1,1,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 1,1,1,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],

  [ 0,0,0,1, 1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ],
  [ 0,0,0,1, 1,1,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1 ],
  [ 0,0,1,3, 1,2,1,0, 0,0,0,0, 0,0,0,0, 0,2,1,0, 0,0,0,0, 0,0,0,0, 0,2,2,1 ],
  [ 0,0,0,2, 0,1,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,2,3,4 ],   // front - behind pengu
];


// Draw the Map array
function drawMap(){
  for(i=0; i<32; i++){
    for(j=0; j<32; j++){
      if(cube_map[i][j] > 0){
        for(k= cube_map[i][j]; k>0; k--){
          var cube = new Cube();
          cube.color = [ 1, 1, 1, 1 ];
          cube.matrix.translate(j-16, k-3, i-16);
          cube.textureType = 0;
          cube.render();
        }

      }
    }
  }

}
