
/*
asg5.js by Martin Bojinov, mbojinov@ucsc.edu

Acknowledgements:
- three.js turorial by Traversy Media:
  https://www.youtube.com/watch?v=8jP4xpga6yY
  I started by following this tutorial but I ran into isues when I tried to
  implement OrbitControls. Had to refactor all my code and restart but this
  helped me understand what I was doing.

- "what is this" by Mia Telles:
  https://people.ucsc.edu/~mwtelles/asg5/asg5.html
  Looking at this project served to help me see what syntaxical mistakes I was
  making to get the errors I was getting. They also helped me see how I could
  scale my .obj files. Finally they had code about snow that I made my own in
  order to create rain.

- Background: Shudu Lake
  https://polyhaven.com/a/shudu_lake

- Texture: Brick Texture
https://3docean.net/item/brick-texture-natural/28517658

- Bench
https://poly.pizza/m/dOSjmdmKaxi

- Billboard:
https://poly.pizza/m/eeP3ZFAapFq

- Fall Tree(s)
https://poly.pizza/m/0rx_H4qbwBp
https://poly.pizza/m/4GYen9Xm3Kj

- Lamp post
https://poly.pizza/m/awUS2qoxeSa

- Mountain Terrain
https://poly.pizza/m/u78ByZHYB2

- Mistubishi Truck
https://poly.pizza/m/4qjS9tFhsJg

- Nissan GTR Car
https://poly.pizza/m/a_HKCtYAv2W

- Pay phone
https://poly.pizza/m/7DX3ew0PIA

- Pond
https://poly.pizza/m/5rf3YuZfJAW

- Pine Tree
https://poly.pizza/m/5BxIuXKYx9q

- Road Sign
https://poly.pizza/m/2CTZcykMj28

- Telephone pole
https://poly.pizza/m/4Lp7FdQqR6i

- Tent
https://poly.pizza/m/9khegYRslI

- Vending Machine
https://poly.pizza/m/0CX6wj64Swu

*/


// ----- Imports ------------------------------------------
import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js';


// ----- Variables ----------------------------------------
let canvas, renderer, camera, controls, scene, loader;
let light_ambient, light_diretional, light_sun, light_spot;
let renderTarget;
let rainArray;


// ----- Functions ----------------------------------------

/*  Renders shape based on given values.
    PRE: position = [ x, y, z ] */
function renderShape( geometry, mesh, position ) {
  const shape = new THREE.Mesh(geometry, mesh);
  scene.add(shape);

  shape.position.x = position[0];
  shape.position.y = position[1];
  shape.position.z = position[2];
  //console.log(position[0], position[1], position[2]);

  return shape;
}


/*  Function to make Billboards (from three.js) */
function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'black';
  ctx.fillText(name, 0, 0);

  return ctx.canvas;
}

/* Set up canvas, renderer, camera, scene, etc. */
function init() {
  // --- canvas ---
  canvas = document.querySelector('#c');

  // --- renderer ---
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  // --- camera ---
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 9999;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 20;

  // --- camera controls ---
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(0, 0, 0);
  controls.update();

  // --- scene ---
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 'grey' );

  // --- loader ---
  loader = new THREE.TextureLoader();

  // --- scene backgroud ---
  const texture = loader.load(
    'images/shudu_lake_4k.png',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });

  // --- light ---
  const l_color1 = 0xFFFFFF;  // ambient
  const l_intensity1 = 0.3;
  light_ambient = new THREE.AmbientLight(l_color1, l_intensity1);
  scene.add(light_ambient);

  const l_color2 = 0xFFFFFF;  // directional
  const l_intensity2 = 1;
  light_diretional = new THREE.DirectionalLight(l_color2, l_intensity2);
  light_diretional.position.set(-9.2, -2, 8);
  light_diretional.target.position.set(-10.35, -2, 10);
  scene.add(light_diretional);
  scene.add(light_diretional.target);

  const helper1 = new THREE.DirectionalLightHelper(light_diretional);
  //scene.add(helper1);
  light_diretional.target.updateMatrixWorld();
  helper1.update();

  const l_color3 = 0xFFFFFF;  // directional2 (sun)
  const l_intensity3 = 0.6;
  light_sun = new THREE.DirectionalLight(l_color3, l_intensity3);
  light_sun.position.set(0, 20, -15);
  light_sun.target.position.set(0, -2, -15);
  scene.add(light_sun);
  scene.add(light_sun.target);

  const helper2 = new THREE.DirectionalLightHelper(light_sun);
  //scene.add(helper2);
  light_sun.target.updateMatrixWorld();
  helper2.update();

  const l_color4 = 0xFFFFFF;  // spot
  const l_intensity4 = 1;
  light_spot = new THREE.SpotLight(l_color4, l_intensity4);
  light_spot.penumbra = 0.5;
  light_spot.angle = Math.PI/7.5;
  light_spot.distance = 10;
  light_spot.position.set(-8.5, 3.3, -3.75);
  light_spot.target.position.set(-8.5, 0, -3.75);
  scene.add(light_spot);
  scene.add(light_spot.target);

  const helper3 = new THREE.SpotLightHelper(light_spot);
  //scene.add(helper3);
  light_spot.target.updateMatrixWorld();
  helper3.update();

  // --- render target (render to texture) ---
  const rtWidth = 512;
  const rtHeight = 512;
  renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

  // --- fog ---
  const fog_near = 1;
  const fog_far = 85;
  const fog_color = 'grey';
  scene.fog = new THREE.Fog(fog_color, fog_near, fog_far);

  // --- obj / mtl file loaders ---
  { // Terrain
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Valley Terrain/TerrainVertex.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Valley Terrain/TerrainVertex.obj', (root) => {
        root.scale.x = 0.5;
        root.scale.y = 0.5;
        root.scale.z = 0.5;
        root.position.set(-10, -5, -50);
        scene.add(root);
      });
    });
  } { // Nissan GTR Car
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Nissan GTR/GTR.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Nissan GTR/GTR.obj', (root) => {
        root.scale.x = 1;
        root.scale.y = 1;
        root.scale.z = 1;
        root.rotation.y = -0.52;
        root.position.set(-7.5, -2.1, 5);
        scene.add(root);
      });
    });
  } { // Mistubishi Truck
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Mitsubishi L200/l200.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Mitsubishi L200/l200.obj', (root) => {
        root.rotation.y = 1.57;
        root.scale.x = 3.5;
        root.scale.y = 3.5;
        root.scale.z = 3.5;
        root.position.set(-20, -3, 1);
        scene.add(root);
      });
    });
  } { // Pay Phone
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Phone/PhoneBooth_02.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Phone/PhoneBooth_02.obj', (root) => {
        root.scale.x = 0.15;
        root.scale.y = 0.15;
        root.scale.z = 0.15;
        root.position.set(0.2, -1.65, -9.5);
        scene.add(root);
      });
    });
  } { // Lamp Pole
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Street Objects - Lamp Post/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Street Objects - Lamp Post/model.obj', (root) => {
        root.scale.y = 2;
        root.rotation.y = 3.1415;
        root.position.set(-8.5, 1.85, -4);
        scene.add(root);
      });
    });
  } { // Vending Machine
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Vending Machine/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Vending Machine/model.obj', (root) => {
        root.rotation.y = 3.1415;
        root.position.set(-4, -1.4, -9);
        scene.add(root);
      });
    });
  } { // Pond
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Pond/PUSHILIN_pond.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pond/PUSHILIN_pond.obj', (root) => {
        root.rotation.y = 1;
        root.position.set(4, -2.5, 6);
        root.scale.x = 5;
        root.scale.y = 5;
        root.scale.z = 5;
        scene.add(root);
      });
    });
  } { // Telephone Poles
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Telephone pole/SM_TelPole_02.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Telephone pole/SM_TelPole_02.obj', (root) => {
        root.rotation.y = 3.1415;
        root.position.set(7.5, -3, -10);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Telephone pole/SM_TelPole_02.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Telephone pole/SM_TelPole_02.obj', (root) => {
        root.rotation.y = 3.1415;
        root.position.set(-25.5, -3, -10);
        scene.add(root);
      });
    });
  } { // Pine Trees
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Pine Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pine Tree/model.obj', (root) => {
        root.rotation.y = -1.7;
        root.scale.x = 10;
        root.scale.y = 12;
        root.scale.z = 10;
        root.position.set(23, 8.5, -30);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Pine Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pine Tree/model.obj', (root) => {
        root.rotation.y = 2.5;
        root.scale.x = 10;
        root.scale.y = 7;
        root.scale.z = 10;
        root.position.set(-7.5, 3.5, -27);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Pine Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pine Tree/model.obj', (root) => {
        root.rotation.y = 0.7;
        root.scale.x = 10;
        root.scale.y = 10;
        root.scale.z = 10;
        root.position.set(5, 6.5, -45);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Pine Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pine Tree/model.obj', (root) => {
        root.rotation.y = 1.5;
        root.scale.x = 10;
        root.scale.y = 15;
        root.scale.z = 10;
        root.position.set(-23, 11, -30);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Pine Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Pine Tree/model.obj', (root) => {
        //root.rotation.y = 3.1415;
        root.scale.x = 10;
        root.scale.y = 10;
        root.scale.z = 10;
        root.position.set(10, 6.5, -25);
        scene.add(root);
      });
    });
  } { // Fall Tree V1
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Fall Tree V1/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Fall Tree V1/model.obj', (root) => {
        root.scale.x = 4;
        root.scale.y = 3;
        root.scale.z = 4;
        root.rotation.y = 3.1415;
        root.position.set(10, 2.7, 0);
        scene.add(root);
      });
    });
  } { // Fall Tree
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Fall Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Fall Tree/model.obj', (root) => {
        root.scale.x = 2;
        root.scale.y = 2;
        root.scale.z = 2;
        root.rotation.y = 3.1415;
        root.position.set(-15, 4.6, -20);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Fall Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Fall Tree/model.obj', (root) => {
        root.scale.x = 2;
        root.scale.y = 3.5;
        root.scale.z = 2;
        root.rotation.y = 1.5;
        root.position.set(-7.5, 10, -40);
        scene.add(root);
      });
    });
    mtlLoader.load('obj/Fall Tree/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Fall Tree/model.obj', (root) => {
        root.scale.x = 2;
        root.scale.y = 2;
        root.scale.z = 2;
        root.rotation.y = 0.2;
        root.position.set(-40, 4.6, -10);
        scene.add(root);
      });
    });
  } { // Road Sign
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Roadsign/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Roadsign/model.obj', (root) => {
        root.scale.x = 1.5;
        root.scale.y = 2;
        root.scale.z = 1.5;
        root.position.set(-10, -2.4, -9);
        scene.add(root);
      });
    });
  } { // Tent
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Tent/Tent02.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Tent/Tent02.obj', (root) => {
        root.scale.x = 0.11;
        root.scale.y = 0.2;
        root.scale.z = 0.13;
        root.position.set(-2, -0.5, -7.4);
        scene.add(root);
      });
    });
  } { // Bench
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Bench/materials.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Bench/model.obj', (root) => {
        root.rotation.y = 1.57;
        root.scale.x = 3;
        root.scale.y = 3;
        root.scale.z = 3;
        root.position.set(-2, -2.1, -9.5);
        scene.add(root);
      });
    });
  } { // Billboard
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/Billboard/Billboard.mtl', (mtl) => {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('obj/Billboard/Billboard.obj', (root) => {
        root.rotation.y = 0.61;
        root.scale.x = 0.04;
        root.scale.y = 0.04;
        root.scale.z = 0.04;
        root.position.set(-30, -3, -23);
        scene.add(root);
      });
    });
  }

  // --- simple shapes (rain) ---
  const rainDrops = 2000;
  const dropcolor = new THREE.MeshBasicMaterial({ color: 0x3c44e6 });
  const dropbox = new THREE.BoxGeometry( 0.05, 0.2, 0.05 );
  const rain = new THREE.Group();

  for (let i=0; i < rainDrops; i++) {
    // cant use drawShapes function here bc adding drops to a group
    const drop = new THREE.Mesh(dropbox, dropcolor);
    drop.position.set( (Math.random() - 0.5) * 80,
                       (Math.random() + 0.5) * 40,
                       (Math.random() - 0.7) * 120 );
    rain.add(drop);
  }
  scene.add(rain);
  rainArray = rain.children;

  // --- simple shapes ---
  // boxes
  const roadcolor = new THREE.MeshPhongMaterial({ color: 0x343434 });
  const roadbox = new THREE.BoxGeometry( 90, 5, 5 );
  const road = renderShape( roadbox, roadcolor, [ -10, -5.3, -15 ] );

  const roadbox2 = new THREE.BoxGeometry( 5, 5, 20 );
  const road2 = renderShape( roadbox2, roadcolor, [ -15, -5.3, -7.5 ] );

  const parkingbox = new THREE.BoxGeometry( 25, 5, 15 );
  const parking = renderShape( parkingbox, roadcolor, [ -15, -5.3, 5 ] );

  const pondcolor = new THREE.MeshPhongMaterial({ color: 0xa4f4f9 });
  const pondbox1 = new THREE.BoxGeometry( 6, 5, 5 );
  const pond1 = renderShape( pondbox1, pondcolor, [ 3.5, -5.4, 6.6 ] );

  const pondbox2 = new THREE.BoxGeometry( 4.5, 5, 3 );
  const pond2 = renderShape( pondbox2, pondcolor, [ 4.4, -5.4, 3 ] );

  // render to Texture
  const rendermaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture,
  });
  const billBox = new THREE.BoxGeometry( 8.1, 3.5, 0.1 );
  const bill_screen = renderShape( billBox, rendermaterial, [ -29.8, 4.45, -22.7 ] );
  bill_screen.rotation.y = 0.61;

  // cylinders
  const tunnelOuterGeo = new THREE.CylinderGeometry( 4, 4, 20, 32 );
  const brick = new THREE.TextureLoader().load('images/brick.jpg');
  const tunneltext = new THREE.MeshPhongMaterial({ map: brick });
  const tunnel1 = renderShape( tunnelOuterGeo, tunneltext, [ -48, -2, -15 ] );
  tunnel1.rotation.z = 1.57;
  const tunnel2 = renderShape( tunnelOuterGeo, tunneltext, [ 35, -2, -15 ] );
  tunnel2.rotation.z = 1.57;

  const tunnelInnerGeo = new THREE.CylinderGeometry( 3.5, 3.5, 20, 32 );
  const tunnelcolor = new THREE.MeshBasicMaterial( {color: 0x272727} );
  const tunnel3 = renderShape( tunnelInnerGeo, tunnelcolor, [ -47.99, -2, -15 ] );
  tunnel3.rotation.z = 1.57;
  const tunnel4 = renderShape( tunnelInnerGeo, tunnelcolor, [ 34.99, -2, -15 ] );
  tunnel4.rotation.z = 1.57;

  // billboards (type)
  const billboard = makeLabelCanvas(100, 100, 'Today\'s Weather');
  const labeltexture = new THREE.CanvasTexture(billboard);
  // because our canvas is likely not a power of 2
  // in both dimensions set the filtering appropriately.
  labeltexture.minFilter = THREE.LinearFilter;
  labeltexture.wrapS = THREE.ClampToEdgeWrapping;
  labeltexture.wrapT = THREE.ClampToEdgeWrapping;

  const labelMaterial = new THREE.SpriteMaterial({
      map: labeltexture,
      transparent: true, });

  const label = new THREE.Sprite(labelMaterial);
  label.position.set(-30, 8, -23);

  const labelBaseScale = 0.005;
  label.scale.x = canvas.width  * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;
  scene.add(label);
}


/* Rerender every second to update things. */
function render(time) {
  time *= 0.001;  // convert time to seconds

  // update rain
  for (let i = 0; i < rainArray.length / 2; i++) {
    rainArray[i].position.y -= 0.35;
    if (rainArray[i].position.y < -3) {
      rainArray[i].position.y += 25;
    }
  }
  for (let i = rainArray.length / 2; i < rainArray.length; i++) {
    rainArray[i].position.y -= 0.35;
    if (rainArray[i].position.y < -3) {
      rainArray[i].position.y += 24.5;
    }
  }

  // draw render target scene to render target
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(render);
}

// ----- Main ---------------------------------------------

/* Main function that runs and calls everything else below. */
function main() {
  init();
  requestAnimationFrame(render);
}


// ----- Run Code -----------------------------------------

main(); // calls main to run, main calls everything else
