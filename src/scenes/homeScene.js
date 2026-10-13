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

const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
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

// Filipino bungalow: blue siding, stucco ground floor, dark hip roof, porch with a brick pillar
function createFilipinoHouse(x, z, scale, flip = 1) {
  const house = new THREE.Group();
  const mat = (col) => new THREE.MeshLambertMaterial({ color: col });
  const box = (w, h, d, col, px, py, pz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(col));
    m.position.set(px, py, pz);
    m.castShadow = true;
    house.add(m);
    return m;
  };
  const hip = (w, h, d, col, px, py, pz) => {
    const g = new THREE.ConeGeometry(Math.SQRT1_2, h, 4);
    g.rotateY(Math.PI / 4);
    const m = new THREE.Mesh(g, mat(col));
    m.scale.set(w, 1, d);
    m.position.set(px, py, pz);
    m.castShadow = true;
    house.add(m);
  };
  const win = (px, py, pz, w = 0.26, h = 0.26) => {
    box(w + 0.06, h + 0.06, 0.03, 0xffffff, px, py, pz);
    box(w, h, 0.04, 0xbfe3ff, px, py, pz + 0.01);
    box(0.02, h, 0.045, 0xffffff, px, py, pz + 0.012);
  };
  const navy = 0x1d3f7a;

  // ground floor
  box(0.62, 0.6, 0.95, 0x7fa8da, -0.69, 0.3, 0); // blue wing
  box(0.55, 0.6, 0.95, 0x9fb08a, -0.1, 0.3, 0); // stucco
  box(0.85, 0.5, 0.8, 0x24313f, 0.62, 0.26, -0.05); // dark porch interior
  box(0.12, 0.66, 0.12, 0xb5714a, 1.02, 0.33, 0.42); // brick pillar
  box(0.95, 0.07, 1.0, navy, 0.62, 0.69, 0.02); // porch roof
  box(0.95, 0.05, 0.04, 0xffffff, 0.62, 0.65, 0.52); // fascia
  box(1.7, 0.05, 1.05, navy, -0.45, 0.63, 0); // eave over the wing
  box(1.7, 0.04, 0.04, 0xffffff, -0.45, 0.6, 0.53);

  // upper floor + hip roof
  box(1.15, 0.55, 0.75, 0x6f9fe0, -0.25, 0.93, -0.05);
  hip(1.5, 0.5, 1.0, navy, -0.25, 1.45, -0.05);
  box(1.5, 0.04, 0.04, 0xffffff, -0.25, 1.2, 0.5);

  // windows, air-con, steps
  win(-0.82, 0.33, 0.49, 0.22, 0.3);
  win(-0.55, 0.33, 0.49, 0.22, 0.3);
  win(-0.1, 0.33, 0.49, 0.26, 0.3);
  win(-0.62, 0.95, 0.33);
  win(-0.25, 0.95, 0.33);
  win(0.12, 0.95, 0.33);
  box(0.15, 0.1, 0.09, 0xffffff, -1.05, 0.45, 0.52);
  box(1.1, 0.05, 0.3, 0xcfd8dc, 0.55, 0.03, 0.62);

  // potted plants along the front
  const potMat = mat(0xffffff);
  const leaves = [0x2f9e44, 0xc0392b, 0xe9d13b, 0x2f9e44, 0xb03a48, 0x2f9e44, 0xe9d13b];
  leaves.forEach((col, i) => {
    const px = -0.95 + i * 0.3;
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.11, 10), potMat);
    pot.position.set(px, 0.075, 0.68);
    house.add(pot);
    const plant = new THREE.Mesh(new THREE.SphereGeometry(0.11 + (i % 2) * 0.03, 10, 10), mat(col));
    plant.scale.set(1, 1.25, 1);
    plant.position.set(px, 0.25 + (i % 2) * 0.02, 0.68);
    plant.castShadow = true;
    house.add(plant);
  });

  house.scale.set(scale * flip, scale, scale);
  house.position.set(x, 0.16, z);
  scene.add(house);
  return house;
}

createFilipinoHouse(-0.2, -1.5, 1.2);
createFilipinoHouse(2.45, -1.15, 0.7, -1);

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

// --- FILIPINO BOY: salakot, camisa, red scarf, waving the Philippine flag ---
const chibiChar = new THREE.Group();
chibiChar.position.set(-0.55, 0.18, 0.35);

const lam = (col) => new THREE.MeshLambertMaterial({ color: col });
const skin = lam(0xe3a877);
const red = lam(0xd62839);
const white = lam(0xffffff);
const dark = new THREE.MeshBasicMaterial({ color: 0x1b1b1b });

// red pants + shoes
[-0.12, 0.12].forEach((px) => {
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.36, 14), red);
  leg.position.set(px, 0.2, 0);
  chibiChar.add(leg);
  const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), lam(0x6b4423));
  shoe.scale.set(1, 0.6, 1.4);
  shoe.position.set(px, 0.03, 0.05);
  chibiChar.add(shoe);
});
const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.26, 0.16, 16), red);
hips.position.set(0, 0.44, 0);
chibiChar.add(hips);

// white camisa
const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 18), white);
body.scale.set(1.0, 1.2, 0.85);
body.position.set(0, 0.7, 0);
body.castShadow = true;
chibiChar.add(body);

// red neckerchief
const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 10, 20), red);
scarf.rotation.x = Math.PI / 2;
scarf.position.set(0, 0.97, 0.02);
chibiChar.add(scarf);
const scarfTail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 3), red);
scarfTail.rotation.x = Math.PI;
scarfTail.position.set(0, 0.86, 0.2);
chibiChar.add(scarfTail);

// head
const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), skin);
head.position.set(0, 1.2, 0);
head.castShadow = true;
chibiChar.add(head);

// black hair under the hat
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.375, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2.1), dark);
hair.position.set(0, 1.2, -0.01);
head.add(hair);
hair.position.set(0, 0, -0.01);
[-0.16, 0, 0.17].forEach((bx, i) => {
  const bang = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 4), dark);
  bang.rotation.x = Math.PI;
  bang.position.set(bx, 0.22 - (i === 1 ? 0.03 : 0), 0.3);
  head.add(bang);
});

// face
[-0.13, 0.13].forEach((ex) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), dark);
  eye.position.set(ex, 0.02, 0.33);
  head.add(eye);
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  shine.position.set(ex + 0.012, 0.04, 0.37);
  head.add(shine);
  const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), new THREE.MeshBasicMaterial({ color: 0xf2a08a, transparent: true, opacity: 0.8 }));
  cheek.position.set(ex * 1.55, -0.1, 0.28);
  head.add(cheek);
});
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 20, Math.PI), dark);
smile.rotation.z = Math.PI;
smile.position.set(0, -0.09, 0.34);
head.add(smile);

// salakot (conical straw hat)
const hat = new THREE.Mesh(new THREE.ConeGeometry(0.64, 0.38, 28), lam(0xc9a27a));
hat.position.set(0, 1.55, 0);
hat.castShadow = true;
chibiChar.add(hat);
const brim = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.025, 8, 36), lam(0x8a6a45));
brim.rotation.x = Math.PI / 2;
brim.position.set(0, 1.37, 0);
chibiChar.add(brim);
const underside = new THREE.Mesh(new THREE.CircleGeometry(0.63, 28), lam(0x5b4630));
underside.rotation.x = Math.PI / 2;
underside.position.set(0, 1.365, 0);
chibiChar.add(underside);

// left arm hangs, right arm holds the flag up
const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.42, 12), white);
armL.position.set(-0.33, 0.68, 0);
armL.rotation.z = 0.25;
chibiChar.add(armL);
const handL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), skin);
handL.position.set(-0.4, 0.45, 0);
chibiChar.add(handL);

const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.5, 12), white);
armR.position.set(0.4, 0.98, 0);
armR.rotation.z = -0.75;
chibiChar.add(armR);
const handR = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skin);
handR.position.set(0.56, 1.15, 0.02);
chibiChar.add(handR);

// Philippine flag on a bamboo flagPole
const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25, 8), lam(0xb8864b));
flagPole.position.set(0.56, 1.45, 0.02);
chibiChar.add(flagPole);
const flag = new THREE.Group();
flag.position.set(0.58, 1.86, 0.02);
const flagW = 0.62;
const flagH = 0.34;
const top = new THREE.Mesh(new THREE.PlaneGeometry(flagW, flagH / 2), new THREE.MeshBasicMaterial({ color: 0x0038a8, side: THREE.DoubleSide }));
top.position.set(flagW / 2, flagH / 4, 0);
const bottom = new THREE.Mesh(new THREE.PlaneGeometry(flagW, flagH / 2), new THREE.MeshBasicMaterial({ color: 0xce1126, side: THREE.DoubleSide }));
bottom.position.set(flagW / 2, -flagH / 4, 0);
const triShape = new THREE.Shape();
triShape.moveTo(0, flagH / 2);
triShape.lineTo(0, -flagH / 2);
triShape.lineTo(flagW * 0.42, 0);
triShape.closePath();
const tri = new THREE.Mesh(new THREE.ShapeGeometry(triShape), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
tri.position.z = 0.004;
const sun = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
sun.position.set(0.1, 0, 0.008);
flag.add(top, bottom, tri, sun);
chibiChar.add(flag);

// Kept for the weather logic below; the hat does the rain-proofing now.
const umbrellaGroup = new THREE.Group();
umbrellaGroup.visible = false;
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
    ambientLight.intensity = 0.8;
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
    ambientLight.intensity = 0.85;
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
window.__setWeatherMode = setWeatherMode;
if (window.__lastWeather) setWeatherMode(window.__lastWeather);

// Animation Loop
let rafId = 0;
let floodY = 0.9;
const setLevel = (d) => {
  floodY = 0.16 + Math.max(0, Math.min(2.2, d)) * 0.78;
  waterMesh.position.y = floodY;
  marker.position.y = floodY + 0.05;
  // no flood -> dry street: no water plane, no swimming dog or buoy
  const wet = d >= 0.1;
  waterMesh.visible = wet;
  doggo.visible = wet;
  buoyGroup.visible = wet;
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

  // Flag waves
  flag.rotation.y = Math.sin(t * 3.2) * 0.22;
  flag.rotation.z = Math.sin(t * 2.1) * 0.05;

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
  delete window.__setWeatherMode;
  renderer.dispose();
  container.innerHTML = '';
};
}
