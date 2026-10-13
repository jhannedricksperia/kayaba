// Three.js flood scene carried over from the Stitch design (three@0.125 to match the original look).
export default function mountScene(container, THREE) {

    const devicePixelRatio = window.devicePixelRatio || 1;
  // Three.js Super Cute Chibi Flood & Weather Simulator for "Kaya Ba?"
const width = container.clientWidth || window.innerWidth || 360;
const height = container.clientHeight || 340;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 1.9, 5.2);
camera.lookAt(0, 1.15, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Global Weather Mode ('rain' | 'day' | 'night')
let currentWeatherMode = 'rain';

// Lighting
const ambientLight = new THREE.AmbientLight(0xdff0fa, 1.25);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
dirLight.position.set(3.5, 6.5, 4.2);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
scene.add(dirLight);

const skyLight = new THREE.HemisphereLight(0x38bdf8, 0x0f2b48, 0.65);
scene.add(skyLight);

// Shared Cute Materials Palette
const cCyan = 0x00e5ff;
const cDeepBlue = 0x0f2b48;
const cSkyBlue = 0x38bdf8;
const cYellow = 0xfacc15;
const cOrange = 0xf97316;
const cPink = 0xf472b6;
const cSoftWhite = 0xffffff;

const yellowMat = new THREE.MeshLambertMaterial({ color: cYellow });
const cyanMat = new THREE.MeshLambertMaterial({ color: cCyan });
const skyMat = new THREE.MeshLambertMaterial({ color: cSkyBlue });
const deepBlueMat = new THREE.MeshLambertMaterial({ color: cDeepBlue });
const whiteMat = new THREE.MeshLambertMaterial({ color: cSoftWhite });
const pinkMat = new THREE.MeshBasicMaterial({ color: cPink, transparent: true, opacity: 0.8 });
const skinMat = new THREE.MeshLambertMaterial({ color: 0xffedd5 });
const darkEyeMat = new THREE.MeshBasicMaterial({ color: cDeepBlue });
const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

// --- CELESTIAL PROPS (SUN, MOON, RAINBOW, STARS, CLOUDS) ---
const skyGroup = new THREE.Group();
scene.add(skyGroup);

// 1. Kawaii Sun with Winking Face & Spinning Petal Rays
const sunGroup = new THREE.Group();
sunGroup.position.set(1.9, 2.5, -2);
const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), yellowMat);
sunGroup.add(sunCore);

// Sun blush & face
const sunEye1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), darkEyeMat);
sunEye1.position.set(-0.12, 0.05, 0.35);
sunGroup.add(sunEye1);
const sunEye2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), darkEyeMat);
sunEye2.position.set(0.12, 0.05, 0.35);
sunGroup.add(sunEye2);
const sunCheek1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pinkMat);
sunCheek1.position.set(-0.19, -0.05, 0.32);
sunGroup.add(sunCheek1);
const sunCheek2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pinkMat);
sunCheek2.position.set(0.19, -0.05, 0.32);
sunGroup.add(sunCheek2);

// Cute flower-petal sun rays
const sunRays = new THREE.Group();
for (let r = 0; r < 8; r++) {
  const angle = (r * Math.PI) / 4;
  const petal = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), new THREE.MeshLambertMaterial({ color: 0xfde047 }));
  petal.scale.set(0.7, 1.4, 0.7);
  petal.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0);
  petal.rotation.z = angle - Math.PI / 2;
  sunRays.add(petal);
}
sunGroup.add(sunRays);
skyGroup.add(sunGroup);

// 2. Kawaii Sleeping Crescent Moon
const moonGroup = new THREE.Group();
moonGroup.position.set(1.8, 2.4, -2);
const moonCore = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshLambertMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.3 }));
moonGroup.add(moonCore);
// Shadow sphere to make crescent shape
const moonHole = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0f2b48 }));
moonHole.position.set(0.15, 0.1, 0.05);
moonGroup.add(moonHole);
// Night sleeping cap
const nightCap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 12), cyanMat);
nightCap.position.set(-0.15, 0.3, 0);
nightCap.rotation.z = 0.5;
moonGroup.add(nightCap);
const capPompom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), whiteMat);
capPompom.position.set(-0.32, 0.45, 0);
moonGroup.add(capPompom);
skyGroup.add(moonGroup);

// Cute Twinkling Stars
const starCount = 30;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let s = 0; s < starCount; s++) {
  starPos[s * 3] = (Math.random() - 0.5) * 6.5;
  starPos[s * 3 + 1] = 1.8 + Math.random() * 1.5;
  starPos[s * 3 + 2] = -2.6 + (Math.random() - 0.5) * 1.2;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xfef08a, size: 0.08, transparent: true, opacity: 0.9 });
const starField = new THREE.Points(starGeo, starMat);
skyGroup.add(starField);

// 3. Cute Rainbow Arch for Day
const rainbowGroup = new THREE.Group();
rainbowGroup.position.set(0, 1.7, -2.4);
const rColors = [0xf472b6, 0xfacc15, 0x00e5ff, 0x60a5fa];
rColors.forEach((col, idx) => {
  const arcRadius = 1.6 + idx * 0.11;
  const arcTube = 0.05;
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(arcRadius, arcTube, 8, 24, Math.PI),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85 })
  );
  arch.rotation.z = 0;
  rainbowGroup.add(arch);
});
skyGroup.add(rainbowGroup);

// 4. Kawaii Chubby Clouds with Cute Happy Faces
function createKawaiiCloud(colorHex, hasFace = false) {
  const cloud = new THREE.Group();
  const cMat = new THREE.MeshLambertMaterial({ color: colorHex });
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), cMat);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), cMat);
  p2.position.set(-0.28, -0.06, 0);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), cMat);
  p3.position.set(0.28, -0.05, 0);
  const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), cMat);
  p4.position.set(0.04, 0.16, 0.06);
  cloud.add(p1, p2, p3, p4);

  if (hasFace) {
    const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), darkEyeMat);
    e1.position.set(-0.1, 0, 0.32);
    cloud.add(e1);
    const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), darkEyeMat);
    e2.position.set(0.1, 0, 0.32);
    cloud.add(e2);
    const ch1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), pinkMat);
    ch1.position.set(-0.17, -0.06, 0.28);
    cloud.add(ch1);
    const ch2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), pinkMat);
    ch2.position.set(0.17, -0.06, 0.28);
    cloud.add(ch2);
  }
  return cloud;
}

const cloudRain1 = createKawaiiCloud(0x64748b, true);
cloudRain1.position.set(-1.3, 2.5, -1.2);
skyGroup.add(cloudRain1);

const cloudRain2 = createKawaiiCloud(0x475569, true);
cloudRain2.position.set(0.9, 2.7, -1.5);
skyGroup.add(cloudRain2);

const cloudDay1 = createKawaiiCloud(0xffffff, true);
cloudDay1.position.set(-1.4, 2.4, -1.2);
skyGroup.add(cloudDay1);

const cloudDay2 = createKawaiiCloud(0xffffff, true);
cloudDay2.position.set(0.7, 2.6, -1.5);
skyGroup.add(cloudDay2);

// 5. Rain particles
const rainCount = 140;
const rainGeo = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);
const rainSpeeds = new Float32Array(rainCount);
for (let i = 0; i < rainCount; i++) {
  rainPositions[i * 3] = (Math.random() - 0.5) * 5.5;
  rainPositions[i * 3 + 1] = Math.random() * 3.5;
  rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 3 + 0.3;
  rainSpeeds[i] = 0.05 + Math.random() * 0.06;
}
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
const rainMat = new THREE.PointsMaterial({ color: cCyan, size: 0.045, transparent: true, opacity: 0.85 });
const rainSystem = new THREE.Points(rainGeo, rainMat);
skyGroup.add(rainSystem);

// --- STREET ENVIRONMENT & CUTE CARTOON COTTAGES ---
const ground = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 4), new THREE.MeshLambertMaterial({ color: 0x93c5fd }));
ground.position.y = -0.15;
ground.receiveShadow = true;
scene.add(ground);

const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(7, 0.16, 1.5), new THREE.MeshLambertMaterial({ color: 0xe0f2fe }));
sidewalk.position.set(0, 0.08, -1);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

// Ultra-cute Rounded Cottage
function createCuteCottage(x, z, scale, wallColor, roofColor) {
  const house = new THREE.Group();
  // Round plump body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65 * scale, 0.7 * scale, 0.9 * scale, 16),
    new THREE.MeshLambertMaterial({ color: wallColor })
  );
  body.position.y = (0.9 * scale) / 2;
  body.castShadow = true;
  house.add(body);

  // Mushroom / Cupcake Dome Roof
  const roof = new THREE.Mesh(
    new THREE.SphereGeometry(0.8 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: roofColor })
  );
  roof.position.y = 0.9 * scale;
  roof.castShadow = true;
  house.add(roof);

  // Cute roof chimney with little smoke puff
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 0.3 * scale, 8), whiteMat);
  chimney.position.set(0.35 * scale, 1.4 * scale, 0.1);
  house.add(chimney);
  const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.1 * scale, 8, 8), whiteMat);
  smoke.position.set(0.38 * scale, 1.62 * scale, 0.1);
  house.add(smoke);

  // Round Door
  const door = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.04, 12), new THREE.MeshLambertMaterial({ color: cOrange }));
  door.rotation.x = Math.PI / 2;
  door.position.set(0, 0.22 * scale, 0.65 * scale);
  house.add(door);

  // Cute Porch Windows
  const win = new THREE.Mesh(new THREE.SphereGeometry(0.13 * scale, 12, 12), new THREE.MeshBasicMaterial({ color: cSkyBlue }));
  win.position.set(0.34 * scale, 0.55 * scale, 0.55 * scale);
  house.add(win);

  house.position.set(x, 0.16, z);
  scene.add(house);
  return house;
}

createCuteCottage(-1.85, -1.2, 1.1, 0xffffff, cDeepBlue);
createCuteCottage(1.85, -1.25, 0.95, 0xdbeafe, 0x0284c7);
createCuteCottage(-0.1, -1.5, 0.8, 0xffffff, cYellow);

// Street Lamp with Smiling Lantern
const lampGroup = new THREE.Group();
lampGroup.position.set(2.2, 0.15, 0.2);
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.8, 8), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
pole.position.y = 0.9;
lampGroup.add(pole);

const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), yellowMat);
lampBulb.position.set(0, 1.76, 0);
lampGroup.add(lampBulb);

const lampLight = new THREE.PointLight(0xfef08a, 1.6, 3.5);
lampLight.position.set(0, 1.76, 0);
lampGroup.add(lampLight);
scene.add(lampGroup);

// --- SUPER CHIBI PROPORTIONED CARTOON CHARACTER ---
// Big head, tiny round body, bright cute yellow boots and frog-ears raincap!
const chibiChar = new THREE.Group();
chibiChar.position.set(-0.55, 0.18, 0.35);

// Cute Chubby Boots (Yellow Gumboots)
const bootGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.32, 16);
const bootL = new THREE.Mesh(bootGeo, yellowMat);
bootL.position.set(-0.16, 0.16, 0);
chibiChar.add(bootL);
const bootR = new THREE.Mesh(bootGeo, yellowMat);
bootR.position.set(0.16, 0.16, 0);
chibiChar.add(bootR);

// Cute Short Pants
const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.22, 16), deepBlueMat);
pants.position.set(0, 0.38, 0);
chibiChar.add(pants);

// Plump Raincoat Body
const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), cyanMat);
body.scale.set(1.0, 1.15, 0.9);
body.position.set(0, 0.68, 0);
body.castShadow = true;
chibiChar.add(body);

// Big Cute Yellow Buttons on Coat
for (let b = 0; b < 2; b++) {
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12), yellowMat);
  btn.rotation.x = Math.PI / 2;
  btn.position.set(0, 0.64 + b * 0.12, 0.3);
  chibiChar.add(btn);
}

// Giant Chibi Head (Cute ratio: head almost same size as body!)
const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), skinMat);
head.position.set(0, 1.15, 0);
head.castShadow = true;
chibiChar.add(head);

// Yellow Frog/Bear Rain Hood
const hood = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
  yellowMat
);
hood.position.set(0, 1.2, 0);
chibiChar.add(hood);

// Cute Frog/Bear Ears on Hood!
const earL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), yellowMat);
earL.position.set(-0.25, 1.52, 0.05);
chibiChar.add(earL);
const earR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), yellowMat);
earR.position.set(0.25, 1.52, 0.05);
chibiChar.add(earR);
const earInnerL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pinkMat);
earInnerL.position.set(-0.25, 1.52, 0.12);
chibiChar.add(earInnerL);
const earInnerR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pinkMat);
earInnerR.position.set(0.25, 1.52, 0.12);
chibiChar.add(earInnerR);

// Sparkly Anime Eyes
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), darkEyeMat);
eyeL.position.set(-0.13, 1.14, 0.33);
chibiChar.add(eyeL);
const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), darkEyeMat);
eyeR.position.set(0.13, 1.14, 0.33);
chibiChar.add(eyeR);

// Sparkle eye shines
const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), shineMat);
shine1.position.set(-0.14, 1.16, 0.37);
chibiChar.add(shine1);
const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), shineMat);
shine2.position.set(0.12, 1.16, 0.37);
chibiChar.add(shine2);

// Rosy Kawaii Blushing Cheeks
const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), pinkMat);
blushL.position.set(-0.21, 1.07, 0.28);
chibiChar.add(blushL);
const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), pinkMat);
blushR.position.set(0.21, 1.07, 0.28);
chibiChar.add(blushR);

// Cute Waving Umbrella
const umbrellaGroup = new THREE.Group();
umbrellaGroup.position.set(0.35, 0.85, 0);

const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 8), deepBlueMat);
handle.position.set(0.15, 0.4, 0.1);
handle.rotation.z = -0.25;
umbrellaGroup.add(handle);

const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.32, 16, 1, true), cyanMat);
canopy.position.set(0.25, 0.8, 0.1);
canopy.rotation.z = -0.25;
umbrellaGroup.add(canopy);

const canopyPompom = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), yellowMat);
canopyPompom.position.set(0.29, 0.98, 0.1);
umbrellaGroup.add(canopyPompom);

chibiChar.add(umbrellaGroup);
scene.add(chibiChar);

// --- NEW COMPANION: CUTE BUBBLY DOGGO IN LIFE VEST! 🐶 ---
const doggo = new THREE.Group();
doggo.position.set(0.2, 0.9, 0.6); // Swimming beside the character

// Dog body
const dogBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
dogBody.scale.set(1.2, 0.9, 0.9);
doggo.add(dogBody);

// Dog orange life vest
const dogVest = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.18, 14), new THREE.MeshLambertMaterial({ color: cOrange }));
dogVest.rotation.z = Math.PI / 2;
doggo.add(dogVest);

// Dog cute head
const dogHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
dogHead.position.set(0.18, 0.1, 0);
doggo.add(dogHead);

// Snout
const dogSnout = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), whiteMat);
dogSnout.position.set(0.28, 0.08, 0);
doggo.add(dogSnout);
const dogNose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), darkEyeMat);
dogNose.position.set(0.34, 0.1, 0);
doggo.add(dogNose);

// Floppy ears
const dogEarL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshLambertMaterial({ color: 0xb45309 }));
dogEarL.scale.set(0.6, 1.5, 0.6);
dogEarL.position.set(0.16, 0.16, 0.12);
dogEarL.rotation.x = 0.4;
doggo.add(dogEarL);
const dogEarR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshLambertMaterial({ color: 0xb45309 }));
dogEarR.scale.set(0.6, 1.5, 0.6);
dogEarR.position.set(0.16, 0.16, -0.12);
dogEarR.rotation.x = -0.4;
doggo.add(dogEarR);

// Dog cute eyes
const dogEye1 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), darkEyeMat);
dogEye1.position.set(0.26, 0.15, 0.07);
doggo.add(dogEye1);
const dogEye2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), darkEyeMat);
dogEye2.position.set(0.26, 0.15, -0.07);
doggo.add(dogEye2);

// Wagging tail
const dogTail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.15, 8), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
dogTail.position.set(-0.2, 0.1, 0);
dogTail.rotation.z = -0.8;
doggo.add(dogTail);

scene.add(doggo);

// --- CUTE WATER GAUGE RULER WITH WATER DROPLET TOPPER ---
const rulerGroup = new THREE.Group();
rulerGroup.position.set(0.85, 0.18, 0.35);

const poleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 16), whiteMat);
poleMesh.position.y = 1.05;
poleMesh.castShadow = true;
rulerGroup.add(poleMesh);

// Cute teardrop topper on the ruler pole
const dropTopper = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 16), cyanMat);
dropTopper.position.y = 2.15;
rulerGroup.add(dropTopper);
const dropSphere = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), cyanMat);
dropSphere.position.y = 2.05;
rulerGroup.add(dropSphere);

// Alternating striped candy notches
for (let i = 0; i <= 9; i++) {
  const notchMat = (i % 2 === 0) ? cyanMat : yellowMat;
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.12), notchMat);
  notch.position.y = 0.2 + i * 0.2;
  rulerGroup.add(notch);
}

// Indicator Arrow with "0.9m" pointer
const marker = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), cyanMat);
marker.rotation.z = Math.PI / 2;
marker.position.set(-0.16, 0.95, 0);
rulerGroup.add(marker);
scene.add(rulerGroup);

// --- ANIMATED FLOODWATER WITH BUBBLES ---
const waterGeo = new THREE.PlaneGeometry(7.0, 4.0, 32, 32);
waterGeo.rotateX(-Math.PI / 2);
const waterMat = new THREE.MeshStandardMaterial({
  color: cCyan,
  transparent: true,
  opacity: 0.74,
  roughness: 0.1,
  metalness: 0.18
});
const waterMesh = new THREE.Mesh(waterGeo, waterMat);
waterMesh.position.set(0, 0.9, 0.2);
scene.add(waterMesh);

// Floating Cute Duckie inside Lifebuoy Ring
const buoyGroup = new THREE.Group();
buoyGroup.position.set(1.4, 0.92, 0.5);

const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.08, 16, 32), whiteMat);
ring.rotation.x = Math.PI / 2;
buoyGroup.add(ring);

// Red/Cyan striped bands
for (let s = 0; s < 4; s++) {
  const ang = (s * Math.PI) / 2;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.086, 0.09, 12), cyanMat);
  band.position.set(Math.cos(ang) * 0.24, 0, Math.sin(ang) * 0.24);
  band.rotation.y = -ang;
  buoyGroup.add(band);
}

// Chubby Yellow Rubber Duck inside!
const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), yellowMat);
duckBody.position.set(0, 0.06, 0);
buoyGroup.add(duckBody);
const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), yellowMat);
duckHead.position.set(0.06, 0.16, 0);
buoyGroup.add(duckHead);
const duckBeak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 8), new THREE.MeshLambertMaterial({ color: cOrange }));
duckBeak.rotation.z = -Math.PI / 2;
duckBeak.position.set(0.14, 0.16, 0);
buoyGroup.add(duckBeak);
const duckEye1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), darkEyeMat);
duckEye1.position.set(0.09, 0.19, 0.04);
buoyGroup.add(duckEye1);
const duckEye2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), darkEyeMat);
duckEye2.position.set(0.09, 0.19, -0.04);
buoyGroup.add(duckEye2);

scene.add(buoyGroup);

// --- WEATHER MODE LOGIC ---
function setWeatherMode(mode) {
  currentWeatherMode = mode;
  if (mode === 'rain') {
    rainSystem.visible = true;
    cloudRain1.visible = true;
    cloudRain2.visible = true;
    cloudDay1.visible = false;
    cloudDay2.visible = false;
    sunGroup.visible = false;
    moonGroup.visible = false;
    starField.visible = false;
    rainbowGroup.visible = false;
    umbrellaGroup.visible = true;
    lampLight.intensity = 0.5;
    ambientLight.color.setHex(0x94a3b8);
    ambientLight.intensity = 1.05;
    dirLight.color.setHex(0x93c5fd);
    waterMat.color.setHex(cCyan);
  } else if (mode === 'day') {
    rainSystem.visible = false;
    cloudRain1.visible = false;
    cloudRain2.visible = false;
    cloudDay1.visible = true;
    cloudDay2.visible = true;
    sunGroup.visible = true;
    moonGroup.visible = false;
    starField.visible = false;
    rainbowGroup.visible = true;
    umbrellaGroup.visible = false;
    lampLight.intensity = 0.0;
    ambientLight.color.setHex(0xfffbeb);
    ambientLight.intensity = 1.45;
    dirLight.color.setHex(0xffedd5);
    waterMat.color.setHex(cSkyBlue);
  } else if (mode === 'night') {
    rainSystem.visible = false;
    cloudRain1.visible = false;
    cloudRain2.visible = false;
    cloudDay1.visible = false;
    cloudDay2.visible = false;
    sunGroup.visible = false;
    moonGroup.visible = true;
    starField.visible = true;
    rainbowGroup.visible = false;
    umbrellaGroup.visible = false;
    lampLight.intensity = 2.4;
    ambientLight.color.setHex(0x1e293b);
    ambientLight.intensity = 0.8;
    dirLight.color.setHex(0x60a5fa);
    waterMat.color.setHex(0x0284c7);
  }
}

// Initial mode
setWeatherMode('rain');

// Interactive Mode Toggle Buttons
const uiOverlay = document.createElement('div');
uiOverlay.style.position = 'absolute';
uiOverlay.style.top = '10px';
uiOverlay.style.left = '10px';
uiOverlay.style.display = 'flex';
uiOverlay.style.gap = '6px';
uiOverlay.style.zIndex = '20';

const modes = [
  { id: 'rain', label: '🌧️ Uulan', color: '#0284c7' },
  { id: 'day', label: '☀️ Aaraw', color: '#f59e0b' },
  { id: 'night', label: '🌙 Gabi', color: '#312e81' }
];

modes.forEach(m => {
  const btn = document.createElement('button');
  btn.innerText = m.label;
  btn.style.padding = '6px 12px';
  btn.style.borderRadius = '20px';
  btn.style.border = 'none';
  btn.style.fontSize = '11px';
  btn.style.fontWeight = '800';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.18)';
  btn.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  function updateStyles() {
    if (currentWeatherMode === m.id) {
      btn.style.backgroundColor = m.color;
      btn.style.color = '#ffffff';
      btn.style.transform = 'scale(1.08)';
    } else {
      btn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      btn.style.color = '#0f2b48';
      btn.style.transform = 'scale(1.0)';
    }
  }
  
  btn.addEventListener('click', () => {
    setWeatherMode(m.id);
    uiOverlay.querySelectorAll('button').forEach(b => b.dispatchEvent(new Event('refreshState')));
  });
  
  btn.addEventListener('refreshState', updateStyles);
  updateStyles();
  uiOverlay.appendChild(btn);
});

container.style.position = 'relative';
container.appendChild(uiOverlay);

// Animation Loop
let rafId = 0;
let floodY = 0.9;
const setLevel = (d) => {
  floodY = 0.16 + Math.max(0, Math.min(2.2, d)) * 0.78;
  waterMesh.position.y = floodY;
  marker.position.y = floodY + 0.05;
};
window.__setFloodLevel = setLevel;
if (window.__lastDepth !== undefined) setLevel(window.__lastDepth);
const clock = new THREE.Clock();

function animate() {
  rafId = requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Bubbly waves
  const pos = waterGeo.attributes.position;
  const waveIntensity = currentWeatherMode === 'rain' ? 0.045 : 0.025;
  const waveSpeed = currentWeatherMode === 'rain' ? 2.8 : 1.6;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i);
    const v = pos.getZ(i);
    pos.setY(i, Math.sin(u * 2.2 + t * waveSpeed) * waveIntensity + Math.cos(v * 2.6 + t * (waveSpeed * 0.8)) * (waveIntensity * 0.7));
  }
  pos.needsUpdate = true;

  // Rain particles
  if (currentWeatherMode === 'rain') {
    const rainP = rainGeo.attributes.position;
    for (let i = 0; i < rainCount; i++) {
      let py = rainP.getY(i) - rainSpeeds[i] * 1.6;
      if (py < 0.1) py = 3.2;
      rainP.setY(i, py);
    }
    rainP.needsUpdate = true;
  }

  // Sun playful ray spin & bounce
  if (currentWeatherMode === 'day') {
    sunRays.rotation.z = t * 0.5;
    sunGroup.position.y = 2.5 + Math.sin(t * 1.8) * 0.06;
  }

  // Chibi character cute happy bounce & head tilt
  chibiChar.position.y = 0.18 + Math.sin(t * 2.5) * 0.02;
  head.rotation.z = Math.sin(t * 1.5) * 0.06;
  head.rotation.y = Math.sin(t * 1.2) * 0.08;
  if (currentWeatherMode === 'rain') {
    umbrellaGroup.rotation.z = Math.sin(t * 2.0) * 0.05;
  }

  // Doggo swimming & wagging tail
  doggo.position.y = floodY + 0.02 + Math.sin(t * 2.6 + 0.8) * 0.03;
  doggo.rotation.z = Math.sin(t * 2.2) * 0.06;
  dogTail.rotation.y = Math.sin(t * 7.0) * 0.45; // fast happy wag!

  // Duck buoy bobbing
  buoyGroup.position.y = floodY + 0.02 + Math.sin(t * 2.2 + 1.2) * 0.028;
  buoyGroup.rotation.z = Math.sin(t * 1.5) * 0.07;
  buoyGroup.rotation.y = t * 0.25;

  // Clouds floating
  cloudRain1.position.x = -1.3 + Math.sin(t * 0.5) * 0.18;
  cloudRain2.position.x = 0.9 + Math.cos(t * 0.4) * 0.18;
  cloudDay1.position.x = -1.4 + Math.sin(t * 0.5) * 0.18;
  cloudDay2.position.x = 0.7 + Math.cos(t * 0.4) * 0.18;

  renderer.render(scene, camera);
}
animate();

const onResize = () => {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || 340;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};
window.addEventListener('resize', onResize);



return () => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', onResize);
  delete window.__setFloodLevel;
  renderer.dispose();
  container.innerHTML = '';
};
}
