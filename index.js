import * as THREE from "./js/three.module.js";

import { OrbitControls } from "./js/OrbitControls.js";
import { GLTFLoader } from "./js/GLTFLoader.js";
import { EXRLoader } from "./js/EXRLoader.js";
import { PointerLockControls } from "./js/PointerLockControls.js";

let camera, scene, renderer, clock, controls, lock_controls;

init();
animate();

function init() {
  //initialize the manager to handle all loaded events (currently just works for OBJ and image files)
  const loadingManager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("fade-out");

    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener("transitionend", onTransitionEnd);
  });

  scene = new THREE.Scene();

  let audioLoader = new THREE.AudioLoader();
  audioLoader.load("./sounds/game_plane.mp4", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  
  lock_controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    lock_controls.lock();
  });

  lock_controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
    sound.play();
  });

  lock_controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
    sound.stop();
  });
  new EXRLoader(loadingManager)
    .setPath("./textures/")
    .load("new_home.exr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      render();
    });

  // model

  let plane = new GLTFLoader(loadingManager).setPath("models/Helicopter/");

  plane.load("F-106A.gltf", function (gltf) {
    plane = gltf.scene;
    plane.scale.set(0.1, 0.1, 0.1);
    plane.position.z = 13;
    plane.position.x = -0.01;
    plane.rotation.y = -3.15;
    scene.add(plane);

    render();
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        plane.position.z += -0.02;
        camera.position.z += -0.02;
        camera.lookAt(plane.position);
        break;
      case "ArrowLeft":
      case "KeyA":
        plane.position.x += -0.02;
        plane.rotation.z = -0.5;
        camera.position.x += -0.02;
        camera.lookAt(plane.position);
        break;

      case "ArrowDown":
      case "KeyS":
        plane.position.z += 0.02;
        camera.position.z += 0.02;
        camera.lookAt(plane.position);
        break;

      case "ArrowRight":
      case "KeyD":
        plane.position.x += 0.02;
        plane.rotation.z = 0.5;
        camera.position.x += 0.02;
        camera.lookAt(plane.position);
        break;

      case "KeyF":
        plane.position.y += 0.02;
        camera.position.y += 0.02;
        camera.position.z += 0.02;
        plane.rotation.x = 0.3;
        camera.lookAt(plane.position);
        break;

      case "KeyB":
        plane.rotation.x = 0;
        break;

      case "KeyV":
        plane.position.y += -0.02;
        camera.position.y += -0.02;
        plane.rotation.x = -0.3;
        camera.lookAt(plane.position);
        break;

      case "KeyR":
        plane.rotation.y += 0.02;
        camera.position.x = -15 * Math.sin(plane.rotation.y);
        camera.position.y = 10;
        camera.position.y += plane.rotation.y;
        camera.position.z = -15 * Math.cos(plane.rotation.y);
        camera.lookAt(plane.position);
        break;

      case "KeyE":
        plane.rotation.y += -0.02;
        camera.position.x = -15 * Math.sin(plane.rotation.y);
        camera.position.y = 10;
        camera.position.y += plane.rotation.y;
        camera.position.z = -15 * Math.cos(plane.rotation.y);
        camera.lookAt(plane.position);
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);

  let airport = new GLTFLoader(loadingManager).setPath("./models/airport/");

  airport.load("scene.gltf", function (gltf) {
    airport = gltf.scene;
    scene.add(airport);
    airport.scale.set(0.002, 0.002, 0.002);
    airport.position.z = 10;
    airport.position.x = -0.65;
    airport.rotation.y = -1.568;
    render();
  });

  let map_1 = new GLTFLoader(loadingManager).setPath("./models/trailer/");
  map_1.load("scene.gltf", function (gltf) {
    map_1 = gltf.scene;
    scene.add(map_1);
    render();
  });

  let map_2 = new GLTFLoader(loadingManager).setPath("./models/station_b/");
  map_2.load("scene.gltf", function (gltf) {
    map_2 = gltf.scene;
    scene.add(map_2);
    map_2.scale.set(3, 3, 3);
    map_2.position.z = 20;
    render();
  });

  let map_3 = new GLTFLoader(loadingManager).setPath(
    "./models/stylised_sky_player_home_dioroma/"
  );
  map_3.load("scene.gltf", function (gltf) {
    map_3 = gltf.scene;
    scene.add(map_3);
    map_3.scale.set(0.025, 0.025, 0.025);
    map_3.position.z = 10;
    map_3.position.x = 10;
    render();
  });

  let map_4 = new GLTFLoader(loadingManager).setPath(
    "./models/stylized_hand_painted_scene/"
  );
  map_4.load("scene.gltf", function (gltf) {
    map_4 = gltf.scene;
    scene.add(map_4);
    map_4.scale.set(0.025, 0.025, 0.025);
    map_4.position.z = 10;
    map_4.position.x = -10;
    render();
  });
  // camera.position.set(-1.8, 0.6, 2.7);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 9.5;
  controls.target.set(0, -2, 7);
  camera.position.set(-0.2, 6, 35);
  controls.update();
  window.addEventListener("resize", onWindowResize);
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}

function onTransitionEnd(event) {
  const element = event.target;
  element.remove();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
