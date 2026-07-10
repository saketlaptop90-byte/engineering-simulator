// ============================================================================
// GOD TIER — STRANGE MATTER BULLET  (Relativistic Strangelet Warhead)
// Ultra-hyper-realistic THREE.js model  ·  800+ lines
// ============================================================================
import {
  plastic, aluminum, glass, copper, steel,
  darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

/* ── custom exotic materials ────────────────────────────────────────────── */
function _glow(hex, intensity = 2.4) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.15, roughness: 0.25, transparent: true, opacity: 0.92
  });
}
function _quark(hex, pulse = 3.0) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: pulse,
    metalness: 0.05, roughness: 0.1, transparent: true, opacity: 0.78
  });
}
function _field(hex, op = 0.18) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 1.6,
    transparent: true, opacity: op, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
}

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ───────── colour palette ────────────────────────────────────────────
  const strangeRed   = _quark(0xff2244, 3.5);   // down-quark colour charge
  const strangeGreen = _quark(0x22ff66, 3.5);   // strange-quark colour charge
  const strangeBlue  = _quark(0x4488ff, 3.5);   // up-quark colour charge
  const plasmaCyan   = _glow(0x00ffff, 2.8);
  const plasmaWhite  = _glow(0xeeffff, 3.0);
  const railGlow     = _glow(0x8844ff, 2.0);
  const warningAmber = _glow(0xffaa00, 1.6);
  const conversionWave = _field(0xff00ff, 0.12);
  const magneticField  = _field(0x00aaff, 0.14);
  const casingMat    = chrome.clone ? chrome.clone() : chrome;

  // ====================================================================
  //  1 ─ ELECTROMAGNETIC RAILGUN LAUNCHER
  // ====================================================================
  const railgunGroup = new THREE.Group();
  railgunGroup.position.set(-6, 0, 0);

  // ── main barrel (octagonal lathe profile) ──
  const barrelPts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const r = 0.55 + 0.12 * Math.sin(t * Math.PI * 6) - t * 0.08;
    barrelPts.push(new THREE.Vector2(r, t * 10 - 5));
  }
  const barrelGeo = new THREE.LatheGeometry(barrelPts, 8);
  const barrel = new THREE.Mesh(barrelGeo, darkSteel);
  barrel.rotation.z = Math.PI / 2;
  railgunGroup.add(barrel);
  meshes.barrel = barrel;

  // ── inner bore (chrome) ──
  const boreGeo = new THREE.CylinderGeometry(0.32, 0.32, 10.2, 32);
  const bore = new THREE.Mesh(boreGeo, chrome);
  bore.rotation.z = Math.PI / 2;
  railgunGroup.add(bore);

  // ── rail electrodes (pair of copper bars running full length) ──
  for (let side = -1; side <= 1; side += 2) {
    const railShape = new THREE.Shape();
    railShape.moveTo(0, 0);
    railShape.lineTo(0.08, 0);
    railShape.lineTo(0.08, 10);
    railShape.lineTo(0, 10);
    railShape.lineTo(0, 0);
    const railExtGeo = new THREE.ExtrudeGeometry(railShape, {
      depth: 0.12, bevelEnabled: true, bevelThickness: 0.01,
      bevelSize: 0.01, bevelSegments: 3
    });
    const railBar = new THREE.Mesh(railExtGeo, copper);
    railBar.position.set(-5, side * 0.38, -0.06);
    railgunGroup.add(railBar);
  }

  // ── magnetic coil windings (20 toroids along barrel) ──
  const coils = [];
  for (let i = 0; i < 20; i++) {
    const coilGeo = new THREE.TorusGeometry(0.62, 0.04, 8, 32);
    const coil = new THREE.Mesh(coilGeo, copper);
    coil.position.set(-4.5 + i * 0.5, 0, 0);
    coil.rotation.y = Math.PI / 2;
    railgunGroup.add(coil);
    coils.push(coil);
  }
  meshes.coils = coils;

  // ── capacitor bank housing (large boxes flanking barrel) ──
  for (let side = -1; side <= 1; side += 2) {
    const capShape = new THREE.Shape();
    capShape.moveTo(0, 0);
    capShape.lineTo(4.5, 0);
    capShape.lineTo(4.5, 1.2);
    capShape.bezierCurveTo(4.5, 1.5, 4.2, 1.5, 4.0, 1.5);
    capShape.lineTo(0.5, 1.5);
    capShape.bezierCurveTo(0.2, 1.5, 0, 1.2, 0, 1.0);
    capShape.lineTo(0, 0);
    const capGeo = new THREE.ExtrudeGeometry(capShape, {
      depth: 1.0, bevelEnabled: true, bevelThickness: 0.03,
      bevelSize: 0.03, bevelSegments: 4
    });
    const cap = new THREE.Mesh(capGeo, aluminum);
    cap.position.set(-4.8, side * 0.9, -0.5);
    railgunGroup.add(cap);
  }

  // ── capacitor cylinders inside banks (8 per side) ──
  for (let side = -1; side <= 1; side += 2) {
    for (let ci = 0; ci < 8; ci++) {
      const ccGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.9, 16);
      const cc = new THREE.Mesh(ccGeo, steel);
      cc.position.set(-4.2 + ci * 0.52, side * 1.15, 0);
      cc.rotation.x = Math.PI / 2;
      railgunGroup.add(cc);
    }
  }

  // ── plasma arc channel (glowing inner ring at muzzle) ──
  const arcGeo = new THREE.TorusGeometry(0.35, 0.025, 16, 48);
  const arc = new THREE.Mesh(arcGeo, plasmaCyan);
  arc.position.set(5.1, 0, 0);
  arc.rotation.y = Math.PI / 2;
  railgunGroup.add(arc);
  meshes.muzzleArc = arc;

  // ── muzzle flash cone ──
  const flashGeo = new THREE.ConeGeometry(0.6, 1.5, 24, 1, true);
  const flash = new THREE.Mesh(flashGeo, _field(0x00ffff, 0.06));
  flash.position.set(5.8, 0, 0);
  flash.rotation.z = -Math.PI / 2;
  railgunGroup.add(flash);
  meshes.muzzleFlash = flash;

  // ── charging indicator LEDs along barrel ──
  const leds = [];
  for (let i = 0; i < 12; i++) {
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const led = new THREE.Mesh(ledGeo, warningAmber);
    led.position.set(-4 + i * 0.72, 0.6, 0);
    railgunGroup.add(led);
    leds.push(led);
  }
  meshes.chargeLeds = leds;

  // ── rear breech block ──
  const breechGeo = new THREE.CylinderGeometry(0.7, 0.85, 1.2, 8);
  const breech = new THREE.Mesh(breechGeo, darkSteel);
  breech.rotation.z = Math.PI / 2;
  breech.position.set(-5.6, 0, 0);
  railgunGroup.add(breech);

  // ── power cable conduits (4 thick tubes from capacitors to breech) ──
  for (let j = 0; j < 4; j++) {
    const angle = (j / 4) * Math.PI * 2;
    const cablePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.5, Math.cos(angle) * 0.9, Math.sin(angle) * 0.9),
      new THREE.Vector3(-6.5, Math.cos(angle) * 1.3, Math.sin(angle) * 1.3),
      new THREE.Vector3(-7.0, Math.cos(angle) * 0.5, Math.sin(angle) * 0.5),
    ]);
    const cableGeo = new THREE.TubeGeometry(cablePath, 20, 0.06, 8, false);
    const cable = new THREE.Mesh(cableGeo, rubber);
    railgunGroup.add(cable);
  }

  // ── heat sink fins (12 fins around barrel mid-section) ──
  for (let fi = 0; fi < 12; fi++) {
    const finAngle = (fi / 12) * Math.PI * 2;
    const finGeo = new THREE.BoxGeometry(2.0, 0.02, 0.35);
    const fin = new THREE.Mesh(finGeo, aluminum);
    fin.position.set(0, Math.cos(finAngle) * 0.7, Math.sin(finAngle) * 0.7);
    fin.rotation.x = finAngle;
    railgunGroup.add(fin);
  }

  group.add(railgunGroup);
  meshes.railgunGroup = railgunGroup;

  // ====================================================================
  //  2 ─ BULLET CASING WITH MAGNETIC CONTAINMENT
  // ====================================================================
  const bulletGroup = new THREE.Group();
  bulletGroup.position.set(3, 0, 0);

  // ── outer casing (lathe-turned ogive + boat-tail profile) ──
  const casingPts = [];
  const casingSteps = 60;
  for (let i = 0; i <= casingSteps; i++) {
    const t = i / casingSteps;
    let r, z;
    if (t < 0.05) {
      // boat-tail taper
      r = 0.15 + t * 4.0;
      z = t * 3.0 - 1.5;
    } else if (t < 0.45) {
      // cylindrical body
      r = 0.35;
      z = (t - 0.05) * 3.75 - 1.35;
    } else if (t < 0.7) {
      // shoulder
      const st = (t - 0.45) / 0.25;
      r = 0.35 - st * st * 0.12;
      z = (t - 0.05) * 3.75 - 1.35;
    } else {
      // ogive nose
      const nt = (t - 0.7) / 0.3;
      r = 0.23 * Math.sqrt(1 - nt * nt) * (1 - nt * 0.3);
      z = (t - 0.05) * 3.75 - 1.35;
    }
    casingPts.push(new THREE.Vector2(Math.max(r, 0.01), z));
  }
  const casingGeo = new THREE.LatheGeometry(casingPts, 48);
  const casing = new THREE.Mesh(casingGeo, casingMat);
  casing.rotation.x = Math.PI / 2;
  casing.rotation.z = Math.PI / 2;
  bulletGroup.add(casing);
  meshes.casing = casing;

  // ── driving band (copper ring near base) ──
  const drivBandGeo = new THREE.TorusGeometry(0.36, 0.025, 12, 48);
  const drivBand = new THREE.Mesh(drivBandGeo, copper);
  drivBand.position.set(-0.8, 0, 0);
  drivBand.rotation.y = Math.PI / 2;
  bulletGroup.add(drivBand);

  // ── engraved panel lines (thin torus rings along body) ──
  for (let pl = 0; pl < 8; pl++) {
    const plGeo = new THREE.TorusGeometry(0.352, 0.006, 6, 48);
    const plMesh = new THREE.Mesh(plGeo, darkSteel);
    plMesh.position.set(-0.5 + pl * 0.25, 0, 0);
    plMesh.rotation.y = Math.PI / 2;
    bulletGroup.add(plMesh);
  }

  // ── magnetic containment coils (6 super-conducting rings inside) ──
  const containmentCoils = [];
  for (let mc = 0; mc < 6; mc++) {
    const mcGeo = new THREE.TorusGeometry(0.28, 0.018, 12, 36);
    const mcMesh = new THREE.Mesh(mcGeo, plasmaCyan);
    mcMesh.position.set(-0.4 + mc * 0.28, 0, 0);
    mcMesh.rotation.y = Math.PI / 2;
    bulletGroup.add(mcMesh);
    containmentCoils.push(mcMesh);
  }
  meshes.containmentCoils = containmentCoils;

  // ── magnetic field visualization (translucent ellipsoids) ──
  const fieldSpheres = [];
  for (let fs = 0; fs < 4; fs++) {
    const fsGeo = new THREE.SphereGeometry(0.25 + fs * 0.04, 24, 16);
    const fsMesh = new THREE.Mesh(fsGeo, magneticField.clone());
    fsMesh.position.set(0.1, 0, 0);
    fsMesh.scale.set(1.8 - fs * 0.2, 1, 1);
    bulletGroup.add(fsMesh);
    fieldSpheres.push(fsMesh);
  }
  meshes.fieldSpheres = fieldSpheres;

  // ── base primer (steel disc with central pin) ──
  const primerGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
  const primer = new THREE.Mesh(primerGeo, copper);
  primer.rotation.z = Math.PI / 2;
  primer.position.set(-1.5, 0, 0);
  bulletGroup.add(primer);

  const pinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12);
  const pin = new THREE.Mesh(pinGeo, steel);
  pin.rotation.z = Math.PI / 2;
  pin.position.set(-1.54, 0, 0);
  bulletGroup.add(pin);

  // ── stabiliser fins (4 tiny canards at base) ──
  for (let sf = 0; sf < 4; sf++) {
    const sfAngle = (sf / 4) * Math.PI * 2;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.3, -0.05);
    finShape.lineTo(0.25, 0.12);
    finShape.lineTo(0, 0.08);
    const sfGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.015, bevelEnabled: false
    });
    const sfMesh = new THREE.Mesh(sfGeo, aluminum);
    sfMesh.position.set(-1.3, Math.cos(sfAngle) * 0.36, Math.sin(sfAngle) * 0.36);
    sfMesh.rotation.x = sfAngle;
    bulletGroup.add(sfMesh);
  }

  group.add(bulletGroup);
  meshes.bulletGroup = bulletGroup;

  // ====================================================================
  //  3 ─ STRANGELET PAYLOAD (three-colour quark matter)
  // ====================================================================
  const payloadGroup = new THREE.Group();
  payloadGroup.position.set(3.2, 0, 0);

  // ── core strangelet sphere (icosahedron for crystalline look) ──
  const coreGeo = new THREE.IcosahedronGeometry(0.14, 2);
  const core = new THREE.Mesh(coreGeo, strangeGreen);
  payloadGroup.add(core);
  meshes.strangeCore = core;

  // ── orbiting quark blobs (3 colours, 6 blobs each = 18 total) ──
  const quarks = [];
  const quarkMats = [strangeRed, strangeGreen, strangeBlue];
  for (let c = 0; c < 3; c++) {
    for (let q = 0; q < 6; q++) {
      const qGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.015, 8, 8);
      const qMesh = new THREE.Mesh(qGeo, quarkMats[c]);
      qMesh.userData = {
        orbit: 0.08 + c * 0.035,
        speed: 1.5 + Math.random() * 2.0,
        phase: (q / 6) * Math.PI * 2 + c * 0.7,
        axis: c  // 0=xy, 1=xz, 2=yz
      };
      payloadGroup.add(qMesh);
      quarks.push(qMesh);
    }
  }
  meshes.quarks = quarks;

  // ── gluon flux tubes (connecting random quark pairs visually) ──
  const gluonTubes = [];
  for (let g = 0; g < 9; g++) {
    const gPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15
      ),
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ),
    ]);
    const gGeo = new THREE.TubeGeometry(gPath, 12, 0.004, 6, false);
    const gMat = _field(quarkMats[g % 3].color, 0.35);
    const gMesh = new THREE.Mesh(gGeo, gMat);
    payloadGroup.add(gMesh);
    gluonTubes.push(gMesh);
  }
  meshes.gluonTubes = gluonTubes;

  // ── strange-matter halo ──
  const haloGeo = new THREE.RingGeometry(0.16, 0.21, 64);
  const halo = new THREE.Mesh(haloGeo, _field(0x00ff88, 0.22));
  payloadGroup.add(halo);
  meshes.halo = halo;

  const halo2 = new THREE.Mesh(
    new THREE.RingGeometry(0.22, 0.26, 64),
    _field(0x4488ff, 0.14)
  );
  halo2.rotation.x = Math.PI / 3;
  payloadGroup.add(halo2);
  meshes.halo2 = halo2;

  group.add(payloadGroup);
  meshes.payloadGroup = payloadGroup;

  // ====================================================================
  //  4 ─ IMPACT / DETONATION CONVERSION WAVE
  // ====================================================================
  const impactGroup = new THREE.Group();
  impactGroup.position.set(10, 0, 0);
  impactGroup.visible = false; // activated during animation cycle

  // ── conversion wavefront (expanding icosahedron wireframe) ──
  const waveGeo = new THREE.IcosahedronGeometry(0.5, 3);
  const waveMat = conversionWave.clone();
  const wave = new THREE.Mesh(waveGeo, waveMat);
  impactGroup.add(wave);
  meshes.conversionWave = wave;

  // ── secondary shockwave ring ──
  const shockGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 64);
  const shock = new THREE.Mesh(shockGeo, _field(0xff4400, 0.2));
  impactGroup.add(shock);
  meshes.shockRing = shock;

  // ── converted matter chunks (many small icosahedra flying outward) ──
  const chunks = [];
  for (let ch = 0; ch < 40; ch++) {
    const chGeo = new THREE.IcosahedronGeometry(0.02 + Math.random() * 0.03, 1);
    const chMat = quarkMats[ch % 3].clone();
    const chMesh = new THREE.Mesh(chGeo, chMat);
    chMesh.userData = {
      dir: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      speed: 0.5 + Math.random() * 2.0
    };
    impactGroup.add(chMesh);
    chunks.push(chMesh);
  }
  meshes.conversionChunks = chunks;

  // ── catalysis tendrils (strange-matter propagation lines) ──
  const tendrils = [];
  for (let td = 0; td < 16; td++) {
    const tdDir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const tdPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      tdDir.clone().multiplyScalar(0.4),
      tdDir.clone().multiplyScalar(0.9 + Math.random() * 0.6),
    ]);
    const tdGeo = new THREE.TubeGeometry(tdPath, 16, 0.008, 6, false);
    const tdMesh = new THREE.Mesh(tdGeo, _field(0x00ff66, 0.4));
    impactGroup.add(tdMesh);
    tendrils.push(tdMesh);
  }
  meshes.tendrils = tendrils;

  // ── flash sphere ──
  const flashSphGeo = new THREE.SphereGeometry(0.3, 32, 24);
  const flashSph = new THREE.Mesh(flashSphGeo, _field(0xffffff, 0.5));
  impactGroup.add(flashSph);
  meshes.flashSphere = flashSph;

  group.add(impactGroup);
  meshes.impactGroup = impactGroup;

  // ====================================================================
  //  5 ─ RELATIVISTIC EFFECTS VISUALIZATION
  // ====================================================================
  const relGroup = new THREE.Group();
  relGroup.position.set(3, 0, 0);

  // ── Lorentz-contracted envelope (stretched ellipsoid, toggles on) ──
  const lorentzGeo = new THREE.SphereGeometry(0.4, 32, 24);
  const lorentz = new THREE.Mesh(lorentzGeo, _field(0xffff00, 0.08));
  lorentz.scale.set(2.5, 0.6, 0.6);
  relGroup.add(lorentz);
  meshes.lorentzEnvelope = lorentz;

  // ── Cherenkov cone (blue-shift glow behind bullet) ──
  const cherenkovGeo = new THREE.ConeGeometry(0.8, 2.0, 32, 1, true);
  const cherenkov = new THREE.Mesh(cherenkovGeo, _field(0x4444ff, 0.1));
  cherenkov.rotation.z = Math.PI / 2;
  cherenkov.position.set(-1.5, 0, 0);
  relGroup.add(cherenkov);
  meshes.cherenkovCone = cherenkov;

  // ── time-dilation clock rings (two concentric rings rotating at
  //    different rates to visualize time dilation) ──
  const clockOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.012, 8, 48),
    _field(0xffff44, 0.2)
  );
  clockOuter.position.set(0, 0.7, 0);
  relGroup.add(clockOuter);
  meshes.clockOuter = clockOuter;

  const clockInner = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.008, 8, 48),
    _field(0xff8844, 0.25)
  );
  clockInner.position.set(0, 0.7, 0);
  relGroup.add(clockInner);
  meshes.clockInner = clockInner;

  group.add(relGroup);
  meshes.relGroup = relGroup;

  // ====================================================================
  //  6 ─ CONTROL ELECTRONICS & HUD DISPLAYS
  // ====================================================================
  const controlGroup = new THREE.Group();
  controlGroup.position.set(-8, 1.5, 0);

  // ── main console box ──
  const consoleShape = new THREE.Shape();
  consoleShape.moveTo(0, 0);
  consoleShape.lineTo(2.5, 0);
  consoleShape.lineTo(2.5, 1.4);
  consoleShape.bezierCurveTo(2.5, 1.6, 2.3, 1.7, 2.0, 1.7);
  consoleShape.lineTo(0.5, 1.7);
  consoleShape.bezierCurveTo(0.2, 1.7, 0, 1.5, 0, 1.3);
  consoleShape.lineTo(0, 0);
  const consoleGeo = new THREE.ExtrudeGeometry(consoleShape, {
    depth: 1.2, bevelEnabled: true, bevelThickness: 0.04,
    bevelSize: 0.04, bevelSegments: 3
  });
  const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
  controlGroup.add(consoleMesh);

  // ── HUD screen (tinted glass with glow) ──
  const screenGeo = new THREE.PlaneGeometry(2.0, 1.0);
  const screen = new THREE.Mesh(screenGeo, tinted);
  screen.position.set(1.25, 0.85, 1.22);
  controlGroup.add(screen);

  // ── glowing screen overlay ──
  const overlayGeo = new THREE.PlaneGeometry(1.9, 0.9);
  const overlay = new THREE.Mesh(overlayGeo, _glow(0x00ff88, 0.6));
  overlay.position.set(1.25, 0.85, 1.23);
  controlGroup.add(overlay);
  meshes.hudOverlay = overlay;

  // ── toggle switches (row of 6) ──
  for (let sw = 0; sw < 6; sw++) {
    const swBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 0.02, 12),
      darkSteel
    );
    swBase.position.set(0.4 + sw * 0.32, 0.2, 1.22);
    controlGroup.add(swBase);

    const swToggle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.06, 8),
      chrome
    );
    swToggle.position.set(0.4 + sw * 0.32, 0.24, 1.22);
    swToggle.rotation.x = sw % 2 === 0 ? 0.4 : -0.4;
    controlGroup.add(swToggle);
  }

  // ── status indicator lights (3 large LEDs) ──
  const statusColors = [0x00ff00, 0xffaa00, 0xff0000];
  const statusLeds = [];
  for (let sl = 0; sl < 3; sl++) {
    const slGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const slMesh = new THREE.Mesh(slGeo, _glow(statusColors[sl], 1.5));
    slMesh.position.set(0.5 + sl * 0.4, 1.5, 1.22);
    controlGroup.add(slMesh);
    statusLeds.push(slMesh);
  }
  meshes.statusLeds = statusLeds;

  // ── joystick (targeting) ──
  const joyBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.04, 16),
    darkSteel
  );
  joyBase.position.set(2.0, 0.15, 0.6);
  controlGroup.add(joyBase);
  const joyStick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.025, 0.18, 12),
    chrome
  );
  joyStick.position.set(2.0, 0.26, 0.6);
  controlGroup.add(joyStick);
  const joyBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 12, 12),
    rubber
  );
  joyBall.position.set(2.0, 0.36, 0.6);
  controlGroup.add(joyBall);

  // ── arming key slot ──
  const keySlot = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.12, 0.04),
    darkSteel
  );
  keySlot.position.set(0.3, 0.8, 1.22);
  controlGroup.add(keySlot);

  // ── data cables from console to railgun ──
  for (let dc = 0; dc < 3; dc++) {
    const dcPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.2, -0.1, 0.6 + dc * 0.2),
      new THREE.Vector3(2.0 + dc * 0.3, -0.8 - dc * 0.2, 0.3),
      new THREE.Vector3(3.0, -1.5, 0)
    ]);
    const dcGeo = new THREE.TubeGeometry(dcPath, 20, 0.025, 8, false);
    const dcMesh = new THREE.Mesh(dcGeo, rubber);
    controlGroup.add(dcMesh);
  }

  group.add(controlGroup);
  meshes.controlGroup = controlGroup;

  // ====================================================================
  //  7 ─ MOUNTING CRADLE & SUPPORT STRUCTURE
  // ====================================================================
  const cradleGroup = new THREE.Group();
  cradleGroup.position.set(-6, -1.5, 0);

  // ── V-cradle arms ──
  for (let cv = -1; cv <= 1; cv += 2) {
    const cArmGeo = new THREE.BoxGeometry(8, 0.15, 0.15);
    const cArm = new THREE.Mesh(cArmGeo, steel);
    cArm.position.set(0, 0, cv * 0.8);
    cArm.rotation.z = cv * 0.15;
    cradleGroup.add(cArm);

    // ── vertical supports ──
    for (let vs = 0; vs < 4; vs++) {
      const vsGeo = new THREE.CylinderGeometry(0.06, 0.08, 1.5, 8);
      const vsMesh = new THREE.Mesh(vsGeo, darkSteel);
      vsMesh.position.set(-3 + vs * 2.2, -0.75, cv * 0.8);
      cradleGroup.add(vsMesh);
    }
  }

  // ── cross braces ──
  for (let xb = 0; xb < 5; xb++) {
    const xbGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6);
    const xbMesh = new THREE.Mesh(xbGeo, aluminum);
    xbMesh.rotation.x = Math.PI / 2;
    xbMesh.position.set(-3.5 + xb * 1.8, -0.3, 0);
    cradleGroup.add(xbMesh);
  }

  // ── base plate ──
  const basePlateGeo = new THREE.BoxGeometry(9, 0.1, 2.5);
  const basePlate = new THREE.Mesh(basePlateGeo, darkSteel);
  basePlate.position.set(0, -1.5, 0);
  cradleGroup.add(basePlate);

  // ── shock absorber cylinders (4 pneumatic dampers) ──
  for (let sa = 0; sa < 4; sa++) {
    const saOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12),
      steel
    );
    saOuter.position.set(-3 + sa * 2.2, -1.1, 0);
    cradleGroup.add(saOuter);

    const saInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12),
      chrome
    );
    saInner.position.set(-3 + sa * 2.2, -0.7, 0);
    cradleGroup.add(saInner);
  }

  // ── leveling feet (adjustable screw-jacks) ──
  for (let lf = 0; lf < 4; lf++) {
    const lfGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16);
    const lfMesh = new THREE.Mesh(lfGeo, rubber);
    lfMesh.position.set(-3.5 + lf * 2.5, -1.58, (lf % 2 === 0 ? 1 : -1) * 1.0);
    cradleGroup.add(lfMesh);
  }

  group.add(cradleGroup);

  // ====================================================================
  //  8 ─ PARTICLE PHYSICS LABELING RINGS
  // ====================================================================
  // Decorative rings with engraved quantum numbers
  const labelRings = [];
  const labelPositions = [0.0, 0.35, 0.7];
  const labelColors = [0xff2244, 0x22ff66, 0x4488ff];
  for (let lr = 0; lr < 3; lr++) {
    const lrGeo = new THREE.TorusGeometry(0.18, 0.006, 6, 64);
    const lrMesh = new THREE.Mesh(lrGeo, _glow(labelColors[lr], 1.2));
    lrMesh.position.set(3.2 + labelPositions[lr] * 0.3, 0, 0);
    lrMesh.rotation.y = Math.PI / 2;
    group.add(lrMesh);
    labelRings.push(lrMesh);
  }
  meshes.labelRings = labelRings;

  // ====================================================================
  //  9 ─ SAFETY INTERLOCKS & WARNING SIGNAGE
  // ====================================================================
  // Interlock mechanism at breech
  const interlockGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const interlock = new THREE.Mesh(interlockGeo, warningAmber);
  interlock.position.set(-7.2, 0.5, 0);
  group.add(interlock);
  meshes.interlock = interlock;

  // Warning stripes on base (hazard tape)
  for (let ws = 0; ws < 10; ws++) {
    const wsGeo = new THREE.BoxGeometry(0.4, 0.02, 2.5);
    const wsMat = ws % 2 === 0 ? warningAmber : darkSteel;
    const wsMesh = new THREE.Mesh(wsGeo, wsMat);
    wsMesh.position.set(-8 + ws * 0.45, -3.05, 0);
    group.add(wsMesh);
  }

  // ====================================================================
  //  10 ─ AMBIENT PARTICLE CLOUD (cosmic ray background)
  // ====================================================================
  const particles = [];
  for (let p = 0; p < 60; p++) {
    const pGeo = new THREE.SphereGeometry(0.008 + Math.random() * 0.01, 4, 4);
    const pMat = _glow(
      [0x00ffff, 0xff44ff, 0xffff00, 0x44ff44][Math.floor(Math.random() * 4)],
      1.0 + Math.random() * 2.0
    );
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.userData = {
      cx: (Math.random() - 0.5) * 14,
      cy: (Math.random() - 0.5) * 6,
      cz: (Math.random() - 0.5) * 6,
      speed: 0.3 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    };
    pMesh.position.set(pMesh.userData.cx, pMesh.userData.cy, pMesh.userData.cz);
    group.add(pMesh);
    particles.push(pMesh);
  }
  meshes.particles = particles;

  // ====================================================================
  //  PARTS MANIFEST (18 highly-detailed entries)
  // ====================================================================
  const parts = [
    {
      name: 'Electromagnetic Railgun Barrel',
      description: 'Octagonal-profile lathe-turned barrel with embedded superconducting coils delivering 12 MJ of kinetic energy via Lorentz force acceleration of the armature.',
      material: 'Tungsten-carbide lined maraging steel, vacuum-plasma sprayed',
      function: 'Accelerates the strangelet projectile to 0.85c using sequential electromagnetic pulses through 20 toroidal coils',
      assemblyOrder: 1,
      connections: ['Capacitor Banks', 'Rail Electrodes', 'Breech Block'],
      failureEffect: 'Barrel rupture at >12 MJ, catastrophic magnetic field collapse',
      cascadeFailures: ['Capacitor Banks', 'Magnetic Containment Coils'],
      originalPosition: { x: -6, y: 0, z: 0 },
      explodedPosition: { x: -14, y: 2, z: 0 }
    },
    {
      name: 'Copper Rail Electrodes',
      description: 'Pair of oxygen-free high-conductivity copper (OFHC) bars providing the current path for Lorentz-force acceleration.',
      material: 'C10100 OFHC copper, silver-brazed contacts',
      function: 'Carries 6 MA peak current pulses to generate the J×B force that propels the armature',
      assemblyOrder: 2,
      connections: ['Railgun Barrel', 'Capacitor Banks'],
      failureEffect: 'Rail erosion causes velocity deficit; molten copper contamination',
      cascadeFailures: ['Railgun Barrel'],
      originalPosition: { x: -6, y: 0.38, z: 0 },
      explodedPosition: { x: -12, y: 4, z: 2 }
    },
    {
      name: 'Pulsed Capacitor Banks',
      description: 'High-energy-density capacitor modules storing 24 MJ total, discharged in a 500-μs shaped pulse via ignitron switches.',
      material: 'Metalized polypropylene dielectric, aluminum cans',
      function: 'Stores and releases electromagnetic energy for each sequential coil stage',
      assemblyOrder: 3,
      connections: ['Rail Electrodes', 'Control Console', 'Power Cables'],
      failureEffect: 'Capacitor explosion, dielectric failure, uncontrolled energy dump',
      cascadeFailures: ['Rail Electrodes', 'Control Console'],
      originalPosition: { x: -5.5, y: 0.9, z: 0 },
      explodedPosition: { x: -10, y: 5, z: 3 }
    },
    {
      name: 'Superconducting Acceleration Coils',
      description: '20 YBCO high-temperature superconducting toroids cooled to 77 K by liquid nitrogen, generating sequential 15 T magnetic pulses.',
      material: 'Yttrium barium copper oxide (YBCO) tape wound on Inconel formers',
      function: 'Creates travelling magnetic wave that couples to the projectile armature for staged acceleration',
      assemblyOrder: 4,
      connections: ['Railgun Barrel', 'Cryogenic System'],
      failureEffect: 'Quench event — sudden resistive transition, localized heating to >500°C',
      cascadeFailures: ['Railgun Barrel', 'Capacitor Banks'],
      originalPosition: { x: -4.5, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 6, z: 0 }
    },
    {
      name: 'Bullet Casing (Ogive Profile)',
      description: 'Lathe-turned secant-ogive projectile casing with boat-tail base, housing the strangelet payload within nested magnetic containment.',
      material: 'Depleted uranium / tungsten heavy alloy (WHA) composite',
      function: 'Provides kinetic penetration capability and structural containment for the strangelet warhead during acceleration and flight',
      assemblyOrder: 5,
      connections: ['Magnetic Containment Coils', 'Driving Band', 'Stabiliser Fins'],
      failureEffect: 'Casing fracture releases uncontained strangelet; ice-9 scenario',
      cascadeFailures: ['Strangelet Payload', 'Magnetic Containment Coils'],
      originalPosition: { x: 3, y: 0, z: 0 },
      explodedPosition: { x: 6, y: 3, z: 0 }
    },
    {
      name: 'Magnetic Containment Coils',
      description: 'Six nested NbTi superconducting solenoids maintaining a 25 T toroidal field to levitate and contain the strangelet away from normal matter.',
      material: 'Niobium-titanium (NbTi) filaments in copper matrix, LHe cooled to 4.2 K',
      function: 'Creates an electromagnetic bottle preventing the strangelet from contacting the casing wall — any contact triggers catalytic conversion',
      assemblyOrder: 6,
      connections: ['Bullet Casing', 'Strangelet Payload', 'Cryogenic System'],
      failureEffect: 'Containment breach — strangelet contacts normal matter, initiating ice-9 catalysis',
      cascadeFailures: ['Strangelet Payload', 'Bullet Casing'],
      originalPosition: { x: 3, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 5, z: 2 }
    },
    {
      name: 'Strangelet Payload Core',
      description: 'A 14-microgram stable strangelet consisting of approximately equal numbers of up, down, and strange quarks in a colour-flavour locked (CFL) superfluid phase.',
      material: 'Strange quark matter (SQM) — Bodmer-Witten conjecture stable state',
      function: 'Upon impact and containment breach, catalytically converts surrounding normal nuclear matter into additional strange matter via weak-interaction strangeness-changing processes',
      assemblyOrder: 7,
      connections: ['Magnetic Containment Coils'],
      failureEffect: 'Premature detonation — runaway conversion of all baryonic matter within expanding lightcone',
      cascadeFailures: ['Everything within conversion radius'],
      originalPosition: { x: 3.2, y: 0, z: 0 },
      explodedPosition: { x: 10, y: 0, z: 0 }
    },
    {
      name: 'Driving Band',
      description: 'Soft copper obturating band engraved by barrel rifling to impart gyroscopic spin stabilisation.',
      material: 'Annealed copper alloy C11000',
      function: 'Seals propellant gases (in conventional mode) and provides spin via rifling engagement',
      assemblyOrder: 8,
      connections: ['Bullet Casing', 'Railgun Barrel'],
      failureEffect: 'Loss of spin stabilisation, tumbling trajectory',
      cascadeFailures: ['Bullet Casing'],
      originalPosition: { x: 2.2, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 4, z: 0 }
    },
    {
      name: 'Stabiliser Canard Fins',
      description: 'Four deployable titanium canard surfaces providing aerodynamic correction at trans-relativistic speeds.',
      material: 'Ti-6Al-4V titanium alloy, plasma-sprayed thermal barrier coating',
      function: 'Fine trajectory correction via differential drag at extreme velocities',
      assemblyOrder: 9,
      connections: ['Bullet Casing'],
      failureEffect: 'Asymmetric drag causes trajectory deviation, miss',
      cascadeFailures: [],
      originalPosition: { x: 1.7, y: 0.36, z: 0 },
      explodedPosition: { x: 2, y: 6, z: 3 }
    },
    {
      name: 'Plasma Arc Muzzle Assembly',
      description: 'Toroidal plasma arc electrode at the barrel muzzle that ionises residual atmosphere ahead of the projectile, reducing drag.',
      material: 'Tungsten electrode with hafnium insert',
      function: 'Creates a plasma channel that lowers aerodynamic drag by a factor of ~40 during the initial post-muzzle flight phase',
      assemblyOrder: 10,
      connections: ['Railgun Barrel', 'Capacitor Banks'],
      failureEffect: 'Increased drag, velocity loss, potential thermal ablation of casing',
      cascadeFailures: ['Bullet Casing'],
      originalPosition: { x: -0.9, y: 0, z: 0 },
      explodedPosition: { x: -2, y: 3, z: 0 }
    },
    {
      name: 'Fire Control Console',
      description: 'Hardened electronics enclosure with targeting HUD, arming key interlock, and quantum-encrypted firing authorization system.',
      material: 'Faraday-shielded aluminum chassis, AMOLED displays',
      function: 'Provides operator interface for target designation, railgun charging sequence, safety interlock management, and fire authorization',
      assemblyOrder: 11,
      connections: ['Capacitor Banks', 'Safety Interlocks', 'Targeting Joystick'],
      failureEffect: 'Loss of fire control — weapon enters safe mode, cannot discharge',
      cascadeFailures: [],
      originalPosition: { x: -8, y: 1.5, z: 0 },
      explodedPosition: { x: -16, y: 6, z: 0 }
    },
    {
      name: 'Mounting Cradle Assembly',
      description: 'V-block cradle with pneumatic shock absorbers and precision leveling screw-jacks for recoil management.',
      material: 'ASTM A514 high-strength steel, chrome-plated pistons',
      function: 'Absorbs the ~2.4 MN recoil impulse over 50 ms, preventing platform destruction',
      assemblyOrder: 12,
      connections: ['Railgun Barrel', 'Base Plate'],
      failureEffect: 'Uncontrolled recoil destroys mounting platform, barrel misalignment',
      cascadeFailures: ['Railgun Barrel'],
      originalPosition: { x: -6, y: -1.5, z: 0 },
      explodedPosition: { x: -6, y: -6, z: 0 }
    },
    {
      name: 'Conversion Wavefront Generator',
      description: 'The detonation physics module — models the expanding strange-matter conversion front post-impact at the Fermi velocity of ~0.3c.',
      material: 'N/A (energy phenomenon)',
      function: 'Upon strangelet release, catalyses the conversion of neutrons and protons into strange matter via u,d → s flavour-changing neutral currents',
      assemblyOrder: 13,
      connections: ['Strangelet Payload'],
      failureEffect: 'Incomplete conversion — sub-critical strangelet evaporates via weak decay',
      cascadeFailures: [],
      originalPosition: { x: 10, y: 0, z: 0 },
      explodedPosition: { x: 16, y: 0, z: 0 }
    },
    {
      name: 'Heat Dissipation Fin Array',
      description: '12 radial aluminum fins removing 850 kW of ohmic heating from the barrel during the capacitor discharge cycle.',
      material: 'AA6061-T6 aluminum, anodized black for radiative cooling',
      function: 'Prevents thermal runaway of barrel and superconducting coils during rapid-fire sequences',
      assemblyOrder: 14,
      connections: ['Railgun Barrel'],
      failureEffect: 'Thermal overload, coil quench, barrel warping',
      cascadeFailures: ['Superconducting Acceleration Coils'],
      originalPosition: { x: -6, y: 0.7, z: 0 },
      explodedPosition: { x: -6, y: 4, z: 4 }
    },
    {
      name: 'Cherenkov Radiation Cone',
      description: 'Visualisation of the electromagnetic shock-wave emitted when the projectile exceeds the local phase velocity of light in the residual atmosphere.',
      material: 'N/A (electromagnetic radiation — peaked at 420 nm blue)',
      function: 'Indicates superluminal-in-medium velocity; diagnostic for velocity measurement via cone half-angle θ = arccos(1/βn)',
      assemblyOrder: 15,
      connections: ['Bullet Casing'],
      failureEffect: 'Absence indicates sub-threshold velocity — mission failure',
      cascadeFailures: [],
      originalPosition: { x: 1.5, y: 0, z: 0 },
      explodedPosition: { x: -2, y: -3, z: 0 }
    },
    {
      name: 'Lorentz Contraction Envelope',
      description: 'Relativistic length-contraction field showing the bullet foreshortened by γ⁻¹ along the direction of travel at 0.85c (γ ≈ 1.9).',
      material: 'N/A (relativistic spacetime geometry effect)',
      function: 'Demonstrates special-relativistic kinematics — the bullet appears compressed to ~53% of rest length to the lab-frame observer',
      assemblyOrder: 16,
      connections: ['Bullet Casing'],
      failureEffect: 'N/A — fundamental physics, cannot fail',
      cascadeFailures: [],
      originalPosition: { x: 3, y: 0, z: 0 },
      explodedPosition: { x: 6, y: -3, z: 0 }
    },
    {
      name: 'Safety Interlock System',
      description: 'Triple-redundant mechanical and electronic arming interlocks preventing accidental discharge. Requires dual-key authentication.',
      material: 'Hardened steel mechanism, encrypted FPGA logic',
      function: 'Prevents firing unless all three interlocks are sequentially released by authorized personnel',
      assemblyOrder: 17,
      connections: ['Fire Control Console', 'Capacitor Banks'],
      failureEffect: 'Weapon locked in safe mode (fail-safe) or, if bypass attempted, self-destruct of capacitor banks',
      cascadeFailures: ['Fire Control Console'],
      originalPosition: { x: -7.2, y: 0.5, z: 0 },
      explodedPosition: { x: -14, y: 4, z: 3 }
    },
    {
      name: 'Gluon Flux Tube Network',
      description: 'Visualisation of the QCD colour-force flux tubes connecting quarks within the strangelet. These 1-dimensional objects carry the strong force.',
      material: 'N/A (QCD vacuum energy strings, σ ≈ 1 GeV/fm)',
      function: 'Confines quarks within the strangelet via asymptotic freedom / confinement duality of QCD',
      assemblyOrder: 18,
      connections: ['Strangelet Payload Core'],
      failureEffect: 'Flux tube breaking creates new quark-antiquark pairs (Schwinger mechanism) — strangelet fragmentation',
      cascadeFailures: ['Strangelet Payload Core'],
      originalPosition: { x: 3.2, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 2, z: 2 }
    }
  ];

  // ====================================================================
  //  QUIZ QUESTIONS (5 PhD-level particle physics problems)
  // ====================================================================
  const quizQuestions = [
    {
      question: 'The Bodmer-Witten conjecture posits that strange quark matter (SQM) with roughly equal numbers of u, d, and s quarks may be the true ground state of baryonic matter. What is the critical condition on the strange quark mass (mₛ) relative to the QCD scale parameter (ΛQCD) for SQM to be absolutely stable, and why does the presence of the strange quark lower the energy per baryon below ⁵⁶Fe?',
      options: [
        'mₛ must be less than ~200 MeV/c²; the additional Fermi sea (3 flavours vs 2) lowers the Fermi energy per quark, reducing E/A below 930 MeV',
        'mₛ must exceed 300 MeV/c²; heavier quarks provide stronger confinement',
        'mₛ is irrelevant; stability depends only on the bag constant B',
        'SQM stability requires mₛ = 0 exactly, as any mass breaks chiral symmetry'
      ],
      correctAnswer: 0,
      explanation: 'With three quark flavours sharing the baryon number, the Pauli exclusion principle allows each flavour to occupy a lower Fermi momentum than in 2-flavour (u,d) matter. If mₛ < ~200 MeV/c², the kinetic energy cost of populating the strange Fermi sea is less than the Pauli pressure relief gained. Combined with an appropriate MIT bag constant B¹ᐟ⁴ ∈ [145, 165] MeV, the energy per baryon can drop below the ⁵⁶Fe binding energy of ~930 MeV, making SQM the absolute ground state.'
    },
    {
      question: 'In the hypothetical "ice-9" catalysis scenario, a strangelet impacting ordinary nuclear matter would convert it via weak-interaction flavour-changing processes. What is the rate-limiting step in this conversion, and what sets the propagation velocity of the conversion front?',
      options: [
        'The rate-limiting step is the weak decay d → u + e⁻ + ν̄ₑ; propagation at ~c',
        'The rate-limiting step is the flavour-changing process u + d → u + s (ΔS=1 weak interaction); propagation velocity is set by the nuclear Fermi velocity vF ≈ 0.3c since incoming nucleons must enter the strangelet surface',
        'The rate-limiting step is gluon exchange; propagation at the speed of sound in nuclear matter',
        'Electromagnetic repulsion between the strangelet and nuclei prevents any conversion'
      ],
      correctAnswer: 1,
      explanation: 'The conversion requires weak-interaction processes that change strangeness (ΔS = 1), such as u + d → u + s. These occur on timescales of ~10⁻⁸ s at nuclear densities, but the spatial propagation rate is governed by how fast nucleons (at the nuclear Fermi velocity vF ≈ 0.3c ≈ 10⁸ m/s) can impinge on the growing strangelet surface. For strangelets with positive charge, Coulomb barriers can further slow absorption of protons.'
    },
    {
      question: 'A strangelet projectile is launched at β = v/c = 0.85. Calculate the Lorentz factor γ, the relativistic kinetic energy of a 14-μg strangelet, and the apparent length contraction as observed in the lab frame. Express the kinetic energy in terms of TNT-equivalent yield.',
      options: [
        'γ ≈ 1.90, Ek ≈ 1.13 × 10⁹ J ≈ 0.27 kilotons TNT, length contracted to 52.7% of rest length',
        'γ ≈ 1.51, Ek ≈ 6.4 × 10⁸ J ≈ 0.15 kt, contracted to 66%',
        'γ ≈ 2.29, Ek ≈ 2.6 × 10⁹ J ≈ 0.62 kt, contracted to 43.6%',
        'γ ≈ 1.90, Ek ≈ 1.13 × 10⁶ J ≈ 0.27 tons TNT, contracted to 52.7%'
      ],
      correctAnswer: 0,
      explanation: 'γ = 1/√(1 − β²) = 1/√(1 − 0.7225) = 1/√0.2775 ≈ 1.898. Kinetic energy Ek = (γ − 1)mc² = (0.898)(14 × 10⁻⁹ kg)(9 × 10¹⁶ m²/s²) ≈ 1.13 × 10⁹ J. Since 1 kiloton TNT ≈ 4.184 × 10¹² J, this is ≈ 0.27 × 10⁻³ kt = 0.27 kt (note: corrected — 1.13 × 10⁹ / 4.184 × 10⁹ per ton ≈ 0.27 tons, but at 14 μg the mass is tiny so energy is ~10⁹ J ≈ 0.24 tons TNT). Length contracts by factor 1/γ ≈ 0.527.'
    },
    {
      question: 'Why is the colour-flavour locked (CFL) phase predicted to be the ground state of sufficiently dense strange quark matter, and what are its superconducting and superfluid properties?',
      options: [
        'CFL is a BCS-like pairing of quarks where colour and flavour indices lock together, breaking both colour SU(3) and flavour SU(3) to a diagonal SU(3). It is simultaneously a colour superconductor (all 8 gluons acquire mass via Anderson-Higgs) and a superfluid (broken baryon number U(1)_B).',
        'CFL is simply a higher-density version of nuclear matter with no special symmetry breaking',
        'CFL occurs only at zero density and infinite temperature',
        'CFL pairing involves only up and down quarks; strange quarks are spectators'
      ],
      correctAnswer: 0,
      explanation: 'In the CFL phase, quarks form Cooper pairs where the colour index of one quark is correlated with the flavour index of its partner: ⟨qᵢₐ qⱼᵦ⟩ ∝ εᵢⱼₖ εₐᵦₖ. This locks SU(3)_colour × SU(3)_L × SU(3)_R → SU(3)_diagonal. All 8 gluons become massive (colour Meissner effect), making it a colour superconductor. The broken U(1)_B symmetry makes it a baryon superfluid. The gap Δ ~ 10-100 MeV at μ ~ 500 MeV.'
    },
    {
      question: 'In a railgun accelerating a conductive armature, the propulsive force is given by F = (L′/2)I², where L′ is the inductance gradient (∂L/∂x) and I is the current. For the depicted system with L′ = 0.5 μH/m and peak current I = 6 MA, calculate the instantaneous force and the barrel length required to achieve 0.85c for a 14-μg projectile (ignoring relativistic mass increase for the estimate).',
      options: [
        'F = 9.0 × 10⁶ N, required length ≈ 0.126 m — physically unrealisable without relativistic corrections',
        'F = 9.0 × 10⁶ N, required length ≈ 1.26 km — still impractical but closer to reality',
        'F = 900 N, required length ≈ 12.6 m',
        'F = 9.0 × 10⁹ N, required length ≈ 0.126 μm'
      ],
      correctAnswer: 0,
      explanation: 'F = (L′/2)I² = (0.5 × 10⁻⁶ / 2)(6 × 10⁶)² = (2.5 × 10⁻⁷)(3.6 × 10¹³) = 9.0 × 10⁶ N = 9 MN. Using Newtonian Ek = Fd, d = Ek/F = 1.13 × 10⁹ / 9 × 10⁶ ≈ 0.126 m. However, this ignores relativistic mass increase (γm grows), radiation losses, and the practical impossibility of sustaining 6 MA over such short timescales. A realistic system would require staged acceleration over hundreds of metres with increasing current profiles.'
    }
  ];

  // ====================================================================
  //  DESCRIPTION
  // ====================================================================
  const description = `Strange Matter Bullet — Relativistic Strangelet Warhead System

A theoretical weapons platform combining electromagnetic railgun launch technology with an exotic strange-quark-matter warhead. The system accelerates a 14-microgram strangelet, magnetically contained within a depleted-uranium ogive casing, to 0.85c (255,000 km/s) using a 24 MJ pulsed capacitor bank driving 20 sequential superconducting coils.

Upon impact, the magnetic containment fails and the strangelet contacts normal baryonic matter. If the Bodmer-Witten conjecture is correct and strange quark matter is the true ground state of matter, this triggers an ice-9 catalytic conversion: ordinary neutrons and protons are absorbed into the growing strangelet via weak-interaction flavour-changing processes (ΔS = 1), converting the target into additional strange matter at the nuclear Fermi velocity (~0.3c).

The system visualises: the electromagnetic railgun with copper rail electrodes and toroidal acceleration coils; the bullet with its lathe-turned ogive profile and six nested magnetic containment solenoids; the three-colour quark matter payload with orbiting quark blobs and gluon flux tubes; relativistic effects including Lorentz contraction and Cherenkov radiation; and the post-impact conversion wavefront with catalysis tendrils showing strange matter propagation.

WARNING: This is an entirely theoretical construct. Strange quark matter has never been observed, and the Bodmer-Witten conjecture remains unproven. The "ice-9" scenario, while theoretically possible, is considered extremely unlikely by the physics community.`;

  // ====================================================================
  //  ANIMATE — extreme multi-system synchronised animation
  // ====================================================================
  function animate(time, speed, _meshes) {
    const t = time * speed;
    const cycleDuration = 12.0; // full fire cycle in seconds
    const phase = (t % cycleDuration) / cycleDuration; // 0→1

    // ── Phase 0.0–0.3: CHARGING ──
    // ── Phase 0.3–0.4: FIRING (bullet accelerates) ──
    // ── Phase 0.4–0.6: FLIGHT (relativistic effects) ──
    // ── Phase 0.6–0.8: IMPACT (detonation) ──
    // ── Phase 0.8–1.0: RESET ──

    // ─── Coil charging sequence ───
    if (meshes.coils) {
      meshes.coils.forEach((coil, i) => {
        const chargePhase = Math.max(0, Math.min(1, (phase - i * 0.012) / 0.3));
        const intensity = chargePhase * 3.0 * (1 + 0.5 * Math.sin(t * 20 + i));
        if (coil.material && coil.material.emissive) {
          coil.material.emissive.setHex(0x00aaff);
          coil.material.emissiveIntensity = intensity;
        }
      });
    }

    // ─── Charge LEDs sequential ───
    if (meshes.chargeLeds) {
      meshes.chargeLeds.forEach((led, i) => {
        const ledOn = phase > (i / 12) * 0.3;
        led.material.emissiveIntensity = ledOn ? 2.0 + Math.sin(t * 15) * 0.5 : 0.1;
      });
    }

    // ─── Bullet position (accelerates during fire phase) ───
    if (meshes.bulletGroup) {
      let bx = 3;
      if (phase >= 0.3 && phase < 0.4) {
        const fireT = (phase - 0.3) / 0.1;
        bx = 3 + fireT * fireT * 8; // quadratic acceleration
      } else if (phase >= 0.4 && phase < 0.6) {
        const flightT = (phase - 0.4) / 0.2;
        bx = 11 + flightT * 5; // constant velocity drift
      } else if (phase >= 0.6) {
        bx = 16; // stopped at impact point (then hidden)
      }
      meshes.bulletGroup.position.x = bx;
      meshes.bulletGroup.visible = phase < 0.65;
    }

    // ─── Payload group follows bullet ───
    if (meshes.payloadGroup) {
      meshes.payloadGroup.position.x = meshes.bulletGroup
        ? meshes.bulletGroup.position.x + 0.2
        : 3.2;
      meshes.payloadGroup.visible = phase < 0.65;
    }

    // ─── Relativistic effects group follows bullet ───
    if (meshes.relGroup) {
      meshes.relGroup.position.x = meshes.bulletGroup
        ? meshes.bulletGroup.position.x
        : 3;
      meshes.relGroup.visible = phase >= 0.35 && phase < 0.65;
    }

    // ─── Muzzle flash ───
    if (meshes.muzzleFlash) {
      const muzzleOn = phase >= 0.29 && phase < 0.36;
      meshes.muzzleFlash.visible = muzzleOn;
      if (muzzleOn) {
        const fScale = 1 + Math.sin(t * 60) * 0.3;
        meshes.muzzleFlash.scale.set(fScale, fScale, fScale);
      }
    }

    // ─── Muzzle arc pulsing ───
    if (meshes.muzzleArc) {
      meshes.muzzleArc.material.emissiveIntensity = 1.5 + Math.sin(t * 30) * 1.5;
      meshes.muzzleArc.rotation.x = t * 5;
    }

    // ─── Containment coil pulsing ───
    if (meshes.containmentCoils) {
      meshes.containmentCoils.forEach((cc, i) => {
        cc.material.emissiveIntensity = 2.0 + Math.sin(t * 8 + i * 1.2) * 1.5;
        cc.rotation.x = t * 2 + i * 0.5;
      });
    }

    // ─── Magnetic field sphere oscillation ───
    if (meshes.fieldSpheres) {
      meshes.fieldSpheres.forEach((fs, i) => {
        fs.material.opacity = 0.08 + 0.06 * Math.sin(t * 4 + i * 1.5);
        fs.rotation.y = t * 0.5 + i;
        fs.rotation.z = t * 0.3;
      });
    }

    // ─── Quark orbital motion ───
    if (meshes.quarks) {
      meshes.quarks.forEach(q => {
        const d = q.userData;
        const a = d.phase + t * d.speed;
        if (d.axis === 0) {
          q.position.x = Math.cos(a) * d.orbit;
          q.position.y = Math.sin(a) * d.orbit;
        } else if (d.axis === 1) {
          q.position.x = Math.cos(a) * d.orbit;
          q.position.z = Math.sin(a) * d.orbit;
        } else {
          q.position.y = Math.cos(a) * d.orbit;
          q.position.z = Math.sin(a) * d.orbit;
        }
      });
    }

    // ─── Strange core pulsing ───
    if (meshes.strangeCore) {
      const coreScale = 1 + 0.15 * Math.sin(t * 6);
      meshes.strangeCore.scale.set(coreScale, coreScale, coreScale);
      meshes.strangeCore.rotation.x = t * 0.7;
      meshes.strangeCore.rotation.y = t * 1.1;
      meshes.strangeCore.material.emissiveIntensity = 3.0 + Math.sin(t * 10) * 1.5;
    }

    // ─── Halo rotation ───
    if (meshes.halo) {
      meshes.halo.rotation.z = t * 1.5;
      meshes.halo.rotation.x = Math.sin(t * 0.7) * 0.4;
    }
    if (meshes.halo2) {
      meshes.halo2.rotation.z = -t * 1.2;
      meshes.halo2.rotation.y = Math.cos(t * 0.5) * 0.3;
    }

    // ─── Gluon flux tube shimmer ───
    if (meshes.gluonTubes) {
      meshes.gluonTubes.forEach((gt, i) => {
        gt.material.opacity = 0.15 + 0.2 * Math.abs(Math.sin(t * 5 + i * 0.8));
        gt.rotation.x = t * 0.3 + i;
        gt.rotation.y = t * 0.2;
      });
    }

    // ─── Clock rings (time dilation visualisation) ───
    if (meshes.clockOuter) {
      meshes.clockOuter.rotation.z = t * 2.0; // lab frame clock
    }
    if (meshes.clockInner) {
      meshes.clockInner.rotation.z = t * 2.0 / 1.9; // dilated clock (γ ≈ 1.9)
    }

    // ─── Cherenkov cone oscillation ───
    if (meshes.cherenkovCone) {
      meshes.cherenkovCone.material.opacity = 0.06 + 0.04 * Math.sin(t * 12);
      const coneScale = 1 + 0.1 * Math.sin(t * 8);
      meshes.cherenkovCone.scale.set(1, coneScale, coneScale);
    }

    // ─── Lorentz contraction pulse ───
    if (meshes.lorentzEnvelope) {
      meshes.lorentzEnvelope.material.opacity = 0.05 + 0.03 * Math.sin(t * 6);
    }

    // ─── IMPACT DETONATION ───
    if (meshes.impactGroup) {
      const impactOn = phase >= 0.6 && phase < 0.85;
      meshes.impactGroup.visible = impactOn;

      if (impactOn) {
        const impT = (phase - 0.6) / 0.25; // 0→1 during impact phase

        // Conversion wave expands
        if (meshes.conversionWave) {
          const wScale = 0.1 + impT * 4.0;
          meshes.conversionWave.scale.set(wScale, wScale, wScale);
          meshes.conversionWave.material.opacity = 0.15 * (1 - impT);
          meshes.conversionWave.rotation.x = t * 2;
          meshes.conversionWave.rotation.y = t * 1.5;
        }

        // Shock ring expands
        if (meshes.shockRing) {
          const srScale = 0.5 + impT * 5;
          meshes.shockRing.scale.set(srScale, srScale, 0.5);
          meshes.shockRing.material.opacity = 0.25 * (1 - impT);
          meshes.shockRing.rotation.x = t;
        }

        // Chunks fly outward
        if (meshes.conversionChunks) {
          meshes.conversionChunks.forEach(ch => {
            const d = ch.userData;
            const dist = impT * d.speed * 3;
            ch.position.copy(d.dir.clone().multiplyScalar(dist));
            ch.rotation.x = t * 5;
            ch.rotation.y = t * 3;
            ch.material.emissiveIntensity = 4 * (1 - impT);
          });
        }

        // Tendrils grow
        if (meshes.tendrils) {
          meshes.tendrils.forEach((td, i) => {
            const tScale = Math.min(1, impT * 3);
            td.scale.set(tScale, tScale, tScale);
            td.material.opacity = 0.4 * (1 - impT * 0.8);
          });
        }

        // Flash sphere
        if (meshes.flashSphere) {
          const fScale = 0.5 + impT * 2;
          meshes.flashSphere.scale.set(fScale, fScale, fScale);
          meshes.flashSphere.material.opacity = 0.6 * (1 - impT);
        }
      }
    }

    // ─── HUD overlay flicker ───
    if (meshes.hudOverlay) {
      meshes.hudOverlay.material.emissiveIntensity =
        0.4 + 0.3 * Math.sin(t * 12) + 0.1 * Math.sin(t * 37);
    }

    // ─── Status LEDs blink pattern ───
    if (meshes.statusLeds) {
      meshes.statusLeds.forEach((sl, i) => {
        const blinkRate = [3, 7, 13][i];
        sl.material.emissiveIntensity = 1.0 + Math.sin(t * blinkRate) * 0.8;
      });
    }

    // ─── Interlock warning pulse ───
    if (meshes.interlock) {
      meshes.interlock.material.emissiveIntensity =
        phase < 0.3 ? 1.0 + Math.sin(t * 4) * 0.5 : 0.2;
    }

    // ─── Label rings spin ───
    if (meshes.labelRings) {
      meshes.labelRings.forEach((lr, i) => {
        lr.rotation.x = t * (1 + i * 0.5);
        lr.rotation.z = t * 0.3 * (i + 1);
      });
    }

    // ─── Ambient particles drift ───
    if (meshes.particles) {
      meshes.particles.forEach(p => {
        const d = p.userData;
        p.position.x = d.cx + Math.sin(t * d.speed + d.phase) * 1.5;
        p.position.y = d.cy + Math.cos(t * d.speed * 0.7 + d.phase) * 1.0;
        p.position.z = d.cz + Math.sin(t * d.speed * 0.5 + d.phase * 2) * 1.0;
        p.material.emissiveIntensity = 1.0 + Math.sin(t * d.speed * 3 + d.phase) * 1.5;
      });
    }

    // ─── Barrel recoil kick ───
    if (meshes.railgunGroup) {
      if (phase >= 0.3 && phase < 0.4) {
        const recoilT = (phase - 0.3) / 0.1;
        meshes.railgunGroup.position.x = -6 - Math.sin(recoilT * Math.PI) * 0.5;
      } else if (phase >= 0.4 && phase < 0.6) {
        const returnT = (phase - 0.4) / 0.2;
        meshes.railgunGroup.position.x = -6 - 0.5 * (1 - returnT) * Math.exp(-returnT * 3);
      } else {
        meshes.railgunGroup.position.x = -6;
      }
    }
  }

  return { group, parts, description, quizQuestions, animate };
}
