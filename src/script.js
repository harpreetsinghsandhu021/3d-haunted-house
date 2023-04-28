import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvasEl = document.querySelector(".webgl");

// textureLoader
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/doors/color.jpg");
const aplhaTexture = textureLoader.load("/doors/alpha.jpg");
const ambientTexture = textureLoader.load("/doors/ambient.jpg");
const heightTexture = textureLoader.load("/doors/height.png");
const normalTexture = textureLoader.load("/doors/normal.jpg");
const metalnessTexture = textureLoader.load("/doors/metallic.jpg");
const roughnessTexture = textureLoader.load("/doors/roughness.jpg");

const bricksColorTexture = textureLoader.load("/bricks/color.jpg");
const bricksNormalTexture = textureLoader.load("/bricks/normal.jpg");
const bricksAmbientTexture = textureLoader.load("/bricks/ambient.jpg");
const bricksRoughnessTexture = textureLoader.load("/bricks/roughness.jpg");

const grassColorTexture = textureLoader.load("/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/grass/normal.jpg");
const grassAmbientTexture = textureLoader.load("/grass/ambient.jpg");
const grassRoughnessTexture = textureLoader.load("/grass/roughness.jpg");

const roofColorTexture = textureLoader.load("/roof/color.jpg");
const roofNormalTexture = textureLoader.load("/roof/normal.jpg");
const roofAmbientTexture = textureLoader.load("/roof/ambient.jpg");
const roofRoughnessTexture = textureLoader.load("/roof/roughness.jpg");
const roofHeightTexture = textureLoader.load("/roof/height.png");

grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassAmbientTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

roofColorTexture.repeat.set(8, 8);
roofNormalTexture.repeat.set(8, 8);
roofAmbientTexture.repeat.set(8, 8);
roofRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofAmbientTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofAmbientTexture.wrapT = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

// scene
const scene = new THREE.Scene();

// debug UI

const gui = new dat.GUI();

// fog
const fog = new THREE.Fog("#262837", 1, 16);

// house group
const house = new THREE.Group();
scene.add(house);
scene.fog = fog;

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    transparent: true,
    aoMap: bricksAmbientTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    transparent: true,
    aoMap: roofAmbientTexture,
    normalMap: roofNormalTexture,
    roughnessMap: roofRoughnessTexture,
  })
);
roof.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: aplhaTexture,
    aoMap: ambientTexture,
    displacementMap: heightTexture,
    displacementScale: 0.1,
    normalMap: normalTexture,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// graves group
const graves = new THREE.Group();
scene.add(graves);

// graves
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.2, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}
// axes helper
const axesHelper = new THREE.AxesHelper(2);

// floor

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
plane.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
scene.add(plane);

// lights
// ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
ambientLight.position.set(50, 50, 50);
scene.add(ambientLight);

// directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.5);
moonLight.position.set(4, 5, -2);

scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 2);
scene.add(ghost1);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

window.addEventListener("resize", (e) => {
  sizes.width = e.target.innerWidth;
  sizes.height = e.target.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener("dblclick", (e) => {
  if (!document.fullscreenElement) {
    canvasEl.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 8;
camera.position.y = 2;
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvasEl);

// renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvasEl,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.setClearColor("#262837");

// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

plane.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update Ghosts
  const ghost1Angle = elapsedTime / 2;
  ghost1.position.x = Math.cos(ghost1Angle) * 6;
  ghost1.position.y = Math.sin(ghost1Angle) * 6;
  ghost1.position.z = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime / 3;
  ghost2.position.x = Math.cos(ghost2Angle) * 4;
  ghost2.position.y = Math.sin(ghost2Angle) * 4;
  ghost2.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = elapsedTime / 1.5;
  ghost3.position.x = Math.cos(ghost3Angle) * 3;
  ghost3.position.y = Math.sin(ghost3Angle) * 3;
  ghost3.position.z = Math.sin(elapsedTime * 3);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
