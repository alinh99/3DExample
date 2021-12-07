var app = function () {
  var create_crate = function () {
    var geometry = new THREE.BoxGeometry();
    var crate_texture = new THREE.TextureLoader().load(
      "./data/textures/crate/crate0_diffuse.png"
    );
    var bump_map_texture = new THREE.TextureLoader().load(
      "./data/textures/crate/crate0_bump.png"
    );
    var normal_map_texture = new THREE.TextureLoader().load(
      "./data/textures/crate/crate0_normal.png"
    );
    var material = new THREE.MeshPhongMaterial({
      map: crate_texture,
      bumpMap: bump_map_texture,
      normalMap: normal_map_texture,
    });
    crate = new THREE.Mesh(geometry, material);
    console.log(crate);
    scene.add(crate);
    crate.position.x = 1.5;
    return crate;
  };

  var create_skybox = function () {
    // create a box geometry
    var geometry = new THREE.BoxGeometry(100, 100, 100);

    // load texxture of slides from images
    var front_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_ft.jpg"
    );
    var back_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_bk.jpg"
    );
    var up_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_up.jpg"
    );
    var down_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_dn.jpg"
    );
    var right_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_rt.jpg"
    );
    var left_texture = new THREE.TextureLoader().load(
      "./data/textures/skybox/arid2_lf.jpg"
    );

    // add textures to a material arrays in the correct order(front-back-up-down-right-left)
    var materials = [];
    materials.push(new THREE.MeshBasicMaterial({ map: front_texture }));
    materials.push(new THREE.MeshBasicMaterial({ map: back_texture }));
    materials.push(new THREE.MeshBasicMaterial({ map: up_texture }));
    materials.push(new THREE.MeshBasicMaterial({ map: down_texture }));
    materials.push(new THREE.MeshBasicMaterial({ map: right_texture }));
    materials.push(new THREE.MeshBasicMaterial({ map: left_texture }));

    for (var i = 0; i < 6; i++) {
      materials[i].side = THREE.BackSide;
    }

    skybox = new THREE.Mesh(geometry, materials);
    // skybox.position.x = 7;
    scene.add(skybox);
  };

  var create_envShere = function () {
    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    var loader = new THREE.CubeTextureLoader();
    loader.setPath("./data/textures/skybox/");
    var texture_cube = loader.load([
      "arid2_ft.jpg",
      "arid2_bk.jpg",
      "arid2_up.jpg",
      "arid2_dn.jpg",
      "arid2_rt.jpg",
      "arid2_lf.jpg",
    ]);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      envMap: texture_cube,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -15;
    sphere.position.x = -3;
    scene.add(sphere);
  };
  // var objLoaders = new THREE.OBJLoader();
  // objLoaders.load(
  //   // url
  //   "./data/models/r2-d2.obj",
  //   // on load callback
  //   function (object) {
  //     object.position.y -= 10;
  //     object.position.z -= 10;
  //     object.scale.set(0.08, 0.08, 0.08);
  //     scene.add(object);
  //   },
  //   // onProgress callback
  //   function (xhr) {
  //     console.log(
  //       "The robot model is " + (xhr.loaded / xhr.total) * 100 + "% loaded"
  //     );
  //   },
  //   // onError callback
  //   function (err) {
  //     console.log("An error happened in loading robot model: " + err);
  //   }
  // );
  // var gltfLoaders = new THREE.GLTFLoader();
  // gltfLoaders.load(
  //   // url
  //   "./data/models/lieutenantHead/lieutenantHead.gltf",
  //   // on load callback
  //   function (object) {
  //     car = object.scene.children[0];
  //     car.scale.setScalar(3);
  //     scene.add(car);
  //     car.position.y = 10;
  //     car.position.x = +20;
  //     car.position.z = -30;
  //   },
  //   // onProgress callback
  //   function (xhr) {
  //     console.log(
  //       "The car model is " + (xhr.loaded / xhr.total) * 100 + "% loaded"
  //     );
  //   },
  //   // onError callback
  //   function (err) {
  //     console.log("An error happened in loading car model: " + err);
  //   }
  // );
  // initiallize scene, camera, objects and renderer
  var scene, camera, renderer, cube1, cube2, cube3;
  var ground, skybox;
  // let new_crate = create_crate();
  var robot, car;
  var donuts = [];
  // check keycode at https://keycode.info/
  var distance = 0;

  const ARROWLEFT = 37,
    ARROWRIGHT = 39,
    ARROWUP = 38,
    ARROWDOWN = 40,
    W_key = 87,
    S_key = 83;
  //handler user input
  var onKeyDown = function (e) {
    console.log("The current key: " + e.keyCode);
    switch (e.keyCode) {
      case ARROWLEFT:
        crate.position.x += -0.2;
        break;
      case ARROWRIGHT:
        crate.position.x += 0.2;
        break;
      case ARROWUP:
        crate.position.x += 0.2;
        break;
      case ARROWDOWN:
        crate.position.x += -0.2;
        break;
      case W_key:
        crate.position.x += -0.5;
        break;
      case S_key:
        crate.position.x += 0.5;
        break;
      default:
        console.log("The current key: " + e.keyCode);
    }
  };

  var randomInRange = function (min, max) {
    return Math.random() * (max - min) + min;
    // Math.random() return a floating-point in the range(0, 1)
  };
  var create_donuts = function () {
    // each donuts has torus geometry. Its radius: 1; its tube: 0.5; its radialSegments: 5 and tubularSegment: 30.
    var geometry = new THREE.TorusGeometry(1, 0.5, 20, 50);
    // the color of each donut is random
    var material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    var donut = new THREE.Mesh(geometry, material);
    // the position of each donut is random
    donut.position.x = randomInRange(-20, 20); // donuts are everywhere on scene
    donut.position.y = -3; // randomInrange(-5,5); // each donut is on the top of the scene
    donut.position.z = randomInRange(-50, 20); // create different sizes
    donut.name = "donut";
    // add each donut to scene
    scene.add(donut);
    donuts.push(donut);
  };
  var update_donut = function (donut, index) {
    // the donut mives along the z axis to end of the ground
    if (donut.position.z < 50) {
      donut.position.z += 0.05;
    } else {
      // remove the donut if cam can't see
      if (donut.position.y < -10) {
        donuts.splice(index, 1);
        scene.remove(donut);
      } else {
        // the donut moves along the y axis
        donut.position.y += -0.05;
      }
    }
  };
  var init_app = function () {
    // 1. create the scene
    scene = new THREE.Scene();
    // scene.background = new THREE.TextureLoader().load(
    //   "./data/textures/background.jpeg"
    // );
    // 2. create an locate the camera
    var canvasWidth = 1280,
      canvasHeight = 720;
    var fieldOfViewY = 60,
      aspectRatio = canvasWidth / canvasHeight,
      near = 0.1,
      far = 100.0;
    camera = new THREE.PerspectiveCamera(fieldOfViewY, aspectRatio, near, far);
    camera.position.y = 2;
    camera.position.z = 5;
    camera.position.x = 1.5;
    // camera.rotation.x = 10;
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(3, 1, 3);
    scene.add(pointLight);

    // add three directional lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(50, 0, -50);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(50, 0, 50);
    scene.add(fillLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-50, 0, 50);
    scene.add(backLight);

    // 3. create_crate
    // 3. create and locate the objects on the scene
    const geometry = new THREE.BoxGeometry();
    const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    cube1 = new THREE.Mesh(geometry, material1);
    cube2 = new THREE.Mesh(geometry, material2);
    cube3 = new THREE.Mesh(geometry, material3);
    // add the cube to the scene
    // scene.add(cube1);
    // scene.add(cube2);
    // scene.add(cube3);
    // cube1.position.x = 3;
    // cube2.position.x = -3;
    // cube3.position.x = 3;
    crate = create_crate();
    create_skybox();
    create_envShere();
    // 4. create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasWidth, canvasHeight);
    document.body.appendChild(renderer.domElement);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("click", onMouseClick, false);
    document.addEventListener("mousemove", onMouseMove, false);
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  };
  var onMouseClick = function (e) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var canvasWidth = 1280,
      canvasHeight = 720;
    console.log("Click at position(" + e.clientX + "," + e.clientY + ")");
    // calculate mouse position in normalized device coordinates
    // (from -1 to 1) for both components
    mouse.x = (e.clientX / canvasWidth) * 2 - 1;
    mouse.y = -(e.clientY / canvasHeight) * 2 + 1;
    console.log("mouse position(" + mouse.x + "," + mouse.y + ")");
    //update the picking ray with cam and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate object intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
      console.log("Name of the object is " + intersects[i].object.name);
      if (intersects[i].object.name == "donut") {
        intersects[i].object.rotation.x += Math.PI / 2;
        // update_donut(
        //   intersects[i].object.name,
        //   intersects[i].object.position.x
        // );
      }
    }
  };
  // var onMouseMove = function (e) {
  //   const mouse = new THREE.Vector2();
  //   const raycaster = new THREE.Raycaster();
  //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //   raycaster.setFromCamera(mouse, camera);
  //   raycaster.ray.intersectPlane(crate, pointOfIntersection);
  // };
  // main animation loop - calls every 50-60 ms.
  var mainLoop = function () {
    let rand = Math.random();
    if (rand < 0.02) {
      create_donuts();
    }
    crate.rotation.y += 0.05;
    // donuts.forEach()
    requestAnimationFrame(mainLoop);
    cube1.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
    cube3.rotation.z += 0.01;
    renderer.render(scene, camera);
  };
  init_app();
  mainLoop();
};
