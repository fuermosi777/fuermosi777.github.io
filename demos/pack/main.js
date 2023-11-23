import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  // Create the renderer and add it to the page's body element
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create the scene to hold the object
  var scene = new THREE.Scene();

  // Create the camera
  var camera = new THREE.PerspectiveCamera(
    35,                                     // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,                                    // Near plane distance
    1000                                    // Far plane distance
  );

  // Position the camera
  camera.position.set(-15, 10, 20);

  // Add the lights
  var ambientLight = new THREE.AmbientLight(0xbbbbbb, 3);
  scene.add(ambientLight);

  var light = new THREE.PointLight(0xffffff, 100, 0);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Load the textures.
  var textureLoader = new THREE.TextureLoader();
  var pkgTextureCover = textureLoader.load('cover.png');
  var pkgTextureBack = textureLoader.load('back.png');
  var pkgTextureLeft = textureLoader.load('left.png');
  var pkgTextureRight = textureLoader.load('right.png');
  var pkgTextureTop = textureLoader.load('top.png');
  var pkgTextureBottom = textureLoader.load('bottom.png');


  // Use the linear filter for the textures to avoid blurriness
  pkgTextureCover.minFilter
    = pkgTextureBack.minFilter
    = pkgTextureLeft.minFilter
    = pkgTextureRight.minFilter
    = pkgTextureTop.minFilter
    = pkgTextureBottom.minFilter
    = THREE.LinearFilter;


  // Create the materials
  var pkgCover = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureCover });
  var pkgBack = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureBack });
  var pkgLeft = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureLeft });
  var pkgRight = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureRight });
  var pkgTop = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureTop });
  var pkgBottom = new THREE.MeshLambertMaterial({ color: 0xffffff, map: pkgTextureBottom });
  // pkgCover.ambient = pkgCover.color
  var materials = [
    pkgRight,          // Right side
    pkgLeft,          // Left side
    pkgTop,   // Top side
    pkgBottom,   // Bottom side
    pkgCover,          // Front side
    pkgBack            // Back side
  ];

  // Create the book and add it to the scene
  var packaging = new THREE.Mesh(new THREE.BoxGeometry(3, 7, 3, 4, 4, 1), materials);
  scene.add(packaging);

  // Create the orbit controls for the camera
  let controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enablePan = false;
  controls.enableZoom = false;

  // Animate the packaging.
  function animate() {

    // Update the orbit controls
    controls.update();

    // Render the frame
    renderer.render(scene, camera);

    // Keep the animation going
    requestAnimationFrame(animate);
  }
  animate();
}

window.onload = () => {
  main();
}

