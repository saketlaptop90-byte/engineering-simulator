// ============================================================================
// GOD TIER — HAWKING RADIATION BOMB
// A weapon exploiting the final explosive evaporation of a micro black hole.
// Micro black hole contained in an electromagnetic cage; mass is carefully
// drained until runaway Hawking evaporation triggers a cataclysmic detonation.
// ============================================================================
import {
  plastic, aluminum, glass, copper, steel,
  darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

export function createMachine(THREE) {

  const group = new THREE.Group();

  // ---------------------------------------------------------------------------
  // HELPER — Glowing / Emissive material factory
  // ---------------------------------------------------------------------------
  function glow(hex, intensity = 1.2) {
    return new MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: intensity,
      metalness: 0.3, roughness: 0.25, transparent: true, opacity: 0.92
    });
  }
  const MeshStandardMaterial = THREE.MeshStandardMaterial;
  function emissiveMat(hex, intensity = 1.0, opacity = 0.95) {
    return new MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: intensity,
      metalness: 0.35, roughness: 0.2, transparent: true, opacity
    });
  }

  // Neon palette
  const neonCyan      = emissiveMat(0x00ffff, 2.0);
  const neonViolet    = emissiveMat(0x9900ff, 2.2);
  const neonMagenta   = emissiveMat(0xff00ff, 1.8);
  const neonOrange    = emissiveMat(0xff6600, 1.5);
  const neonRed       = emissiveMat(0xff0022, 2.5);
  const neonGreen     = emissiveMat(0x00ff66, 1.6);
  const neonWhite     = emissiveMat(0xffffff, 3.0, 0.85);
  const hawkingGlow   = emissiveMat(0xaaddff, 2.8, 0.7);
  const gammaGlow     = emissiveMat(0xccccff, 4.0, 0.6);
  const eventHorizon  = new MeshStandardMaterial({
    color: 0x000000, emissive: 0x000000, emissiveIntensity: 0,
    metalness: 1.0, roughness: 0.0
  });

  // Shared geometries
  const ringGeo       = (inner, outer, segs) => new THREE.RingGeometry(inner, outer, segs);
  const cylGeo        = (rT, rB, h, rs, hs) => new THREE.CylinderGeometry(rT, rB, h, rs || 32, hs || 1);
  const sphereGeo     = (r, w, h) => new THREE.SphereGeometry(r, w || 64, h || 64);
  const torusGeo      = (r, t, rs, ts) => new THREE.TorusGeometry(r, t, rs || 32, ts || 128);
  const boxGeo        = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  // Track animated meshes
  const meshes = {};

  // =========================================================================
  //  1.  OUTER CONTAINMENT HULL — Armoured oblate spheroid shell
  // =========================================================================
  const hullShape = new THREE.Shape();
  const hullPts = [];
  for (let i = 0; i <= 60; i++) {
    const a = (i / 60) * Math.PI;
    hullPts.push(new THREE.Vector2(
      Math.sin(a) * 5.0,   // radius
      Math.cos(a) * 3.2    // oblate
    ));
  }
  const hullLatheGeo = new THREE.LatheGeometry(hullPts, 96);
  const hullOuter = new THREE.Mesh(hullLatheGeo, darkSteel.clone());
  hullOuter.material.transparent = true;
  hullOuter.material.opacity = 0.25;
  hullOuter.material.side = THREE.DoubleSide;
  group.add(hullOuter);
  meshes.hullOuter = hullOuter;

  // Hull panel lines — latitudinal ribs
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI;
    const r = Math.sin(angle) * 5.05;
    const y = Math.cos(angle) * 3.25;
    const ribGeo = torusGeo(r, 0.03, 8, 96);
    const rib = new THREE.Mesh(ribGeo, chrome);
    rib.position.y = y;
    rib.rotation.x = Math.PI / 2;
    group.add(rib);
  }

  // Longitudinal ribs
  for (let i = 0; i < 12; i++) {
    const theta = (i / 12) * Math.PI * 2;
    const ribPts2 = [];
    for (let j = 0; j <= 60; j++) {
      const a = (j / 60) * Math.PI;
      ribPts2.push(new THREE.Vector3(
        Math.sin(a) * 5.08 * Math.cos(theta),
        Math.cos(a) * 3.28,
        Math.sin(a) * 5.08 * Math.sin(theta)
      ));
    }
    const ribCurve = new THREE.CatmullRomCurve3(ribPts2);
    const ribTube = new THREE.TubeGeometry(ribCurve, 64, 0.025, 8, false);
    const ribMesh = new THREE.Mesh(ribTube, chrome);
    group.add(ribMesh);
  }

  // =========================================================================
  //  2.  ELECTROMAGNETIC CONTAINMENT CAGE — 3 orthogonal toroidal coils
  // =========================================================================
  const cageGroup = new THREE.Group();
  const coilColors = [neonCyan, neonViolet, neonMagenta];
  const coilMeshes = [];
  for (let axis = 0; axis < 3; axis++) {
    const coilGeo = torusGeo(3.0, 0.08, 24, 200);
    const coil = new THREE.Mesh(coilGeo, coilColors[axis]);
    if (axis === 0) coil.rotation.x = Math.PI / 2;
    if (axis === 1) coil.rotation.y = 0;                // XZ plane
    if (axis === 2) coil.rotation.z = Math.PI / 2;
    cageGroup.add(coil);
    coilMeshes.push(coil);

    // Secondary winding filaments around each torus
    for (let f = 0; f < 80; f++) {
      const phi = (f / 80) * Math.PI * 2;
      const cx = 3.0 * Math.cos(phi);
      const cz = 3.0 * Math.sin(phi);
      const filGeo = cylGeo(0.015, 0.015, 0.35, 6);
      const fil = new THREE.Mesh(filGeo, copper);
      fil.position.set(cx, 0, cz);
      fil.lookAt(0, 0, 0);
      if (axis === 0) { fil.position.set(cx, 0, cz); fil.rotation.x += Math.PI / 2; }
      if (axis === 1) { fil.position.set(cx, cz, 0); }
      if (axis === 2) { fil.position.set(0, cx, cz); fil.rotation.z += Math.PI / 2; }
      coil.add(fil);
    }
  }
  group.add(cageGroup);
  meshes.cageGroup = cageGroup;
  meshes.coilMeshes = coilMeshes;

  // EM-field glow rings inside cage
  const fieldRings = [];
  for (let i = 0; i < 8; i++) {
    const radius = 1.8 + i * 0.15;
    const fieldRingGeo = torusGeo(radius, 0.012, 8, 128);
    const fr = new THREE.Mesh(fieldRingGeo, emissiveMat(0x44ccff, 1.2 + i * 0.15, 0.3));
    fr.rotation.x = Math.PI / 2;
    fr.rotation.z = (i / 8) * Math.PI;
    group.add(fr);
    fieldRings.push(fr);
  }
  meshes.fieldRings = fieldRings;

  // =========================================================================
  //  3.  MICRO BLACK HOLE — Event horizon sphere + accretion disc
  // =========================================================================
  const bhGroup = new THREE.Group();

  // Event horizon — perfectly black sphere
  const bhSphere = new THREE.Mesh(sphereGeo(0.5, 96, 96), eventHorizon);
  bhGroup.add(bhSphere);
  meshes.bhSphere = bhSphere;

  // Photon sphere — thin glowing shell just outside horizon
  const photonSphere = new THREE.Mesh(
    sphereGeo(0.62, 64, 64),
    emissiveMat(0xffffff, 3.5, 0.12)
  );
  bhGroup.add(photonSphere);
  meshes.photonSphere = photonSphere;

  // Accretion disc — multi-layered glowing torus
  const accretionLayers = [];
  for (let layer = 0; layer < 6; layer++) {
    const r = 0.9 + layer * 0.18;
    const tube = 0.04 + layer * 0.015;
    const hue = 0.08 - layer * 0.013;  // from orange-yellow to red
    const color = new THREE.Color().setHSL(Math.max(hue, 0), 1.0, 0.55);
    const discGeo = torusGeo(r, tube, 12, 200);
    const disc = new THREE.Mesh(discGeo, emissiveMat(color.getHex(), 2.5 - layer * 0.3, 0.6 - layer * 0.06));
    disc.rotation.x = Math.PI / 2;
    bhGroup.add(disc);
    accretionLayers.push(disc);
  }
  meshes.accretionLayers = accretionLayers;

  // Relativistic jets (bipolar) — cone geometry
  const jetMat = emissiveMat(0x8888ff, 3.0, 0.35);
  const jetGeoTop = new THREE.ConeGeometry(0.15, 3.5, 32, 1, true);
  const jetTop = new THREE.Mesh(jetGeoTop, jetMat);
  jetTop.position.y = 2.2;
  bhGroup.add(jetTop);
  meshes.jetTop = jetTop;

  const jetGeoBot = new THREE.ConeGeometry(0.15, 3.5, 32, 1, true);
  const jetBot = new THREE.Mesh(jetGeoBot, jetMat);
  jetBot.position.y = -2.2;
  jetBot.rotation.z = Math.PI;
  bhGroup.add(jetBot);
  meshes.jetBot = jetBot;

  group.add(bhGroup);
  meshes.bhGroup = bhGroup;

  // =========================================================================
  //  4.  MASS-DRAIN INJECTOR ARMS — 6 radial arms that siphon mass
  // =========================================================================
  const drainArms = [];
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * Math.PI * 2;
    const armGroup = new THREE.Group();

    // Main arm shaft
    const shaftGeo = cylGeo(0.06, 0.04, 2.8, 12);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = 1.4;
    armGroup.add(shaft);

    // Injector nozzle tip
    const nozzleGeo = new THREE.ConeGeometry(0.1, 0.3, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, chrome);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.x = 0.1;
    armGroup.add(nozzle);

    // Coolant lines along arm
    for (let c = 0; c < 3; c++) {
      const coolPts = [];
      const offset = (c / 3) * Math.PI * 2;
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        coolPts.push(new THREE.Vector3(
          0.15 + t * 2.5,
          Math.sin(t * Math.PI * 6 + offset) * 0.06,
          Math.cos(t * Math.PI * 6 + offset) * 0.06
        ));
      }
      const coolCurve = new THREE.CatmullRomCurve3(coolPts);
      const coolTube = new THREE.TubeGeometry(coolCurve, 40, 0.012, 6, false);
      const coolMesh = new THREE.Mesh(coolTube, copper);
      armGroup.add(coolMesh);
    }

    // Piston inside arm
    const pistonOuter = new THREE.Mesh(cylGeo(0.05, 0.05, 0.6, 12), aluminum);
    pistonOuter.rotation.z = Math.PI / 2;
    pistonOuter.position.x = 2.4;
    armGroup.add(pistonOuter);
    const pistonInner = new THREE.Mesh(cylGeo(0.03, 0.03, 0.8, 8), chrome);
    pistonInner.rotation.z = Math.PI / 2;
    pistonInner.position.x = 2.6;
    armGroup.add(pistonInner);

    armGroup.rotation.y = theta;
    group.add(armGroup);
    drainArms.push(armGroup);
  }
  meshes.drainArms = drainArms;

  // =========================================================================
  //  5.  HAWKING RADIATION SPECTRUM VISUALIZER — ring of spectral bars
  // =========================================================================
  const spectrumGroup = new THREE.Group();
  const spectrumBars = [];
  const spectrumBarCount = 120;
  for (let i = 0; i < spectrumBarCount; i++) {
    const angle = (i / spectrumBarCount) * Math.PI * 2;
    const r = 3.8;

    // Map index to wavelength-colour: IR -> red -> visible -> UV -> X-ray -> gamma
    const t = i / spectrumBarCount;
    let barColor;
    if (t < 0.2)      barColor = new THREE.Color().setHSL(0.0, 1, 0.3);       // IR (dark red)
    else if (t < 0.4) barColor = new THREE.Color().setHSL(0.05, 1, 0.5);      // red-orange
    else if (t < 0.55) barColor = new THREE.Color().setHSL(0.15, 1, 0.55);    // yellow
    else if (t < 0.7) barColor = new THREE.Color().setHSL(0.33, 1, 0.5);      // green
    else if (t < 0.82) barColor = new THREE.Color().setHSL(0.58, 1, 0.5);     // blue
    else if (t < 0.92) barColor = new THREE.Color().setHSL(0.75, 1, 0.55);    // violet
    else               barColor = new THREE.Color().setHSL(0.80, 0.6, 0.85);  // gamma-white

    const barHeight = 0.3 + Math.random() * 0.4;
    const barGeo = boxGeo(0.04, barHeight, 0.04);
    const barMat = emissiveMat(barColor.getHex(), 1.8, 0.85);
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    bar.lookAt(0, 0, 0);
    bar.userData.baseHeight = barHeight;
    bar.userData.index = i;
    spectrumGroup.add(bar);
    spectrumBars.push(bar);
  }
  spectrumGroup.position.y = -2.0;
  spectrumGroup.rotation.x = Math.PI / 2;
  group.add(spectrumGroup);
  meshes.spectrumBars = spectrumBars;
  meshes.spectrumGroup = spectrumGroup;

  // =========================================================================
  //  6.  PENROSE PROCESS ENERGY EXTRACTOR — ergosphere tap turbines
  // =========================================================================
  const turbineGroup = new THREE.Group();
  const turbines = [];
  for (let t = 0; t < 4; t++) {
    const ang = (t / 4) * Math.PI * 2 + Math.PI / 4;
    const tg = new THREE.Group();

    // Turbine housing
    const housingGeo = cylGeo(0.25, 0.25, 0.5, 24);
    const housing = new THREE.Mesh(housingGeo, darkSteel);
    tg.add(housing);

    // Rotor blades
    for (let b = 0; b < 8; b++) {
      const bladeAngle = (b / 8) * Math.PI * 2;
      const bladeGeo = boxGeo(0.02, 0.2, 0.08);
      const blade = new THREE.Mesh(bladeGeo, aluminum);
      blade.position.set(Math.cos(bladeAngle) * 0.12, 0, Math.sin(bladeAngle) * 0.12);
      blade.rotation.y = bladeAngle;
      tg.add(blade);
    }

    tg.position.set(Math.cos(ang) * 4.2, 2.5, Math.sin(ang) * 4.2);
    tg.lookAt(0, 0, 0);
    turbineGroup.add(tg);
    turbines.push(tg);
  }
  group.add(turbineGroup);
  meshes.turbines = turbines;

  // =========================================================================
  //  7.  GRAVITATIONAL LENS DISTORTION SHELL — refractive sphere
  // =========================================================================
  const lensShell = new THREE.Mesh(
    sphereGeo(1.1, 64, 64),
    new MeshStandardMaterial({
      color: 0x000011, metalness: 0.1, roughness: 0.0,
      transparent: true, opacity: 0.08, side: THREE.DoubleSide
    })
  );
  group.add(lensShell);
  meshes.lensShell = lensShell;

  // =========================================================================
  //  8.  CONTAINMENT FAILURE WARNING LIGHTS — 12 red beacons on hull
  // =========================================================================
  const warningLights = [];
  for (let i = 0; i < 12; i++) {
    const phi = (i / 12) * Math.PI * 2;
    const lightGeo = sphereGeo(0.08, 16, 16);
    const wl = new THREE.Mesh(lightGeo, emissiveMat(0xff0000, 0.5, 0.9));
    wl.position.set(Math.cos(phi) * 4.95, 0, Math.sin(phi) * 4.95);
    group.add(wl);
    warningLights.push(wl);
  }
  // Top + bottom beacons
  for (let sign = -1; sign <= 1; sign += 2) {
    const beacon = new THREE.Mesh(sphereGeo(0.1, 16, 16), emissiveMat(0xff4400, 1.0, 0.9));
    beacon.position.y = sign * 3.1;
    group.add(beacon);
    warningLights.push(beacon);
  }
  meshes.warningLights = warningLights;

  // =========================================================================
  //  9.  CONTROL CONSOLE + OPERATOR CABIN  (at hull equator)
  // =========================================================================
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(4.5, 0, 0);

  // Cabin frame
  const cabinFrame = new THREE.Mesh(boxGeo(1.0, 0.8, 0.7), darkSteel);
  cabinGroup.add(cabinFrame);

  // Tinted window
  const windowGeo = boxGeo(0.92, 0.5, 0.02);
  const windowMesh = new THREE.Mesh(windowGeo, tinted);
  windowMesh.position.z = 0.36;
  cabinGroup.add(windowMesh);

  // Control screens (3)
  for (let s = 0; s < 3; s++) {
    const screenGeo = boxGeo(0.22, 0.14, 0.015);
    const screen = new THREE.Mesh(screenGeo, emissiveMat(0x00ff88, 1.5, 0.9));
    screen.position.set(-0.28 + s * 0.28, -0.1, 0.25);
    cabinGroup.add(screen);
  }

  // Joystick
  const joyBase = new THREE.Mesh(cylGeo(0.04, 0.05, 0.03, 12), rubber);
  joyBase.position.set(0.3, -0.35, 0.15);
  cabinGroup.add(joyBase);
  const joyStick = new THREE.Mesh(cylGeo(0.012, 0.012, 0.12, 8), chrome);
  joyStick.position.set(0.3, -0.27, 0.15);
  cabinGroup.add(joyStick);
  const joyKnob = new THREE.Mesh(sphereGeo(0.025, 12, 12), neonRed);
  joyKnob.position.set(0.3, -0.20, 0.15);
  cabinGroup.add(joyKnob);

  // Chair
  const chairSeat = new THREE.Mesh(boxGeo(0.25, 0.04, 0.25), rubber);
  chairSeat.position.set(0, -0.32, -0.05);
  cabinGroup.add(chairSeat);
  const chairBack = new THREE.Mesh(boxGeo(0.25, 0.3, 0.04), rubber);
  chairBack.position.set(0, -0.15, -0.18);
  cabinGroup.add(chairBack);

  group.add(cabinGroup);
  meshes.cabinGroup = cabinGroup;

  // =========================================================================
  //  10. DETONATION FLASH SPHERE — starts invisible, expands on trigger
  // =========================================================================
  const flashMat = emissiveMat(0xffffff, 5.0, 0.0);
  const flashSphere = new THREE.Mesh(sphereGeo(0.1, 48, 48), flashMat);
  group.add(flashSphere);
  meshes.flashSphere = flashSphere;

  // =========================================================================
  //  11. HAWKING PARTICLE EMITTER POINTS — tiny spheres ejected outward
  // =========================================================================
  const particles = [];
  for (let i = 0; i < 200; i++) {
    const pGeo = sphereGeo(0.02 + Math.random() * 0.02, 8, 8);
    const pMat = emissiveMat(
      new THREE.Color().setHSL(Math.random(), 0.8, 0.65).getHex(),
      2.0 + Math.random() * 2,
      0.6
    );
    const p = new THREE.Mesh(pGeo, pMat);
    // random direction vector stored
    const dir = new THREE.Vector3(
      (Math.random() - 0.5),
      (Math.random() - 0.5),
      (Math.random() - 0.5)
    ).normalize();
    p.userData.dir = dir;
    p.userData.speed = 0.5 + Math.random() * 1.5;
    p.userData.baseRadius = 0.6 + Math.random() * 0.3;
    p.visible = false;
    group.add(p);
    particles.push(p);
  }
  meshes.particles = particles;

  // =========================================================================
  //  12. SUPERCONDUCTING MAGNET CRYOSTAT RING
  // =========================================================================
  const cryostatGeo = torusGeo(4.0, 0.2, 24, 128);
  const cryostat = new THREE.Mesh(cryostatGeo, aluminum);
  cryostat.rotation.x = Math.PI / 2;
  group.add(cryostat);
  meshes.cryostat = cryostat;

  // Cryo coolant pipes
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const pts = [];
    for (let s = 0; s <= 20; s++) {
      const t = s / 20;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * (4.0 + t * 0.8),
        -1.5 + t * 3.0,
        Math.sin(angle) * (4.0 + t * 0.8)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
    group.add(new THREE.Mesh(tube, copper));
  }

  // =========================================================================
  //  13. MAGNETIC BOTTLE NODES — 8 field emitter pods
  // =========================================================================
  const bottleNodes = [];
  for (let i = 0; i < 8; i++) {
    const phi = (i / 8) * Math.PI * 2;
    const nodeGroup = new THREE.Group();

    const pod = new THREE.Mesh(cylGeo(0.12, 0.12, 0.35, 16), darkSteel);
    nodeGroup.add(pod);

    const emitter = new THREE.Mesh(sphereGeo(0.07, 16, 16), neonCyan);
    emitter.position.y = 0.22;
    nodeGroup.add(emitter);

    // Mounting strut
    const strutGeo = cylGeo(0.02, 0.02, 1.5, 6);
    const strut = new THREE.Mesh(strutGeo, steel);
    strut.position.y = -0.9;
    nodeGroup.add(strut);

    nodeGroup.position.set(
      Math.cos(phi) * 2.5,
      1.8,
      Math.sin(phi) * 2.5
    );
    nodeGroup.lookAt(0, 0, 0);
    group.add(nodeGroup);
    bottleNodes.push(nodeGroup);
  }
  meshes.bottleNodes = bottleNodes;

  // =========================================================================
  //  14. GRAVITON DETECTOR ARRAY — parabolic dish ring
  // =========================================================================
  const detectorGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const dishPts = [];
    for (let j = 0; j <= 20; j++) {
      const r = (j / 20) * 0.3;
      dishPts.push(new THREE.Vector2(r, r * r * 0.8));
    }
    const dishGeo = new THREE.LatheGeometry(dishPts, 24);
    const dish = new THREE.Mesh(dishGeo, chrome);
    dish.position.set(Math.cos(ang) * 4.6, -1.5, Math.sin(ang) * 4.6);
    dish.lookAt(0, 0, 0);
    detectorGroup.add(dish);

    // Detector feed antenna
    const antennaGeo = cylGeo(0.01, 0.01, 0.25, 6);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.position.set(Math.cos(ang) * 4.35, -1.5, Math.sin(ang) * 4.35);
    detectorGroup.add(antenna);
  }
  group.add(detectorGroup);

  // =========================================================================
  //  15. BEKENSTEIN-HAWKING ENTROPY DISPLAY — holographic number ring
  // =========================================================================
  const entropyRing = new THREE.Mesh(
    torusGeo(2.2, 0.02, 8, 128),
    emissiveMat(0x44ffaa, 1.5, 0.6)
  );
  entropyRing.rotation.x = Math.PI / 2;
  entropyRing.position.y = -1.0;
  group.add(entropyRing);
  meshes.entropyRing = entropyRing;

  // Tick marks around entropy ring
  for (let i = 0; i < 60; i++) {
    const ta = (i / 60) * Math.PI * 2;
    const tickGeo = boxGeo(0.005, 0.08, 0.005);
    const tick = new THREE.Mesh(tickGeo, emissiveMat(0x44ffaa, 1.0, 0.7));
    tick.position.set(Math.cos(ta) * 2.2, -1.0, Math.sin(ta) * 2.2);
    group.add(tick);
  }

  // =========================================================================
  //  16. EXHAUST VENTS + HEAT DISSIPATION FINS
  // =========================================================================
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const finGeo = boxGeo(0.5, 0.02, 0.8);
    const fin = new THREE.Mesh(finGeo, aluminum);
    fin.position.set(
      Math.cos(angle) * 4.8,
      -2.5 + (i % 4) * 0.15,
      Math.sin(angle) * 4.8
    );
    fin.rotation.y = angle;
    group.add(fin);
  }

  // =========================================================================
  //  17. SCHWARZSCHILD RADIUS MARKER RINGS
  // =========================================================================
  for (let i = 0; i < 3; i++) {
    const markerGeo = torusGeo(0.55 + i * 0.15, 0.005, 8, 64);
    const marker = new THREE.Mesh(markerGeo, emissiveMat(0xffaa00, 1.0, 0.5));
    marker.rotation.x = Math.PI / 2 + i * 0.3;
    group.add(marker);
  }

  // =========================================================================
  //  18. INNER VACUUM CHAMBER — concentric translucent sphere
  // =========================================================================
  const vacuumChamber = new THREE.Mesh(
    sphereGeo(2.5, 48, 48),
    new MeshStandardMaterial({
      color: 0x001122, metalness: 0.05, roughness: 0.1,
      transparent: true, opacity: 0.06, side: THREE.DoubleSide
    })
  );
  group.add(vacuumChamber);

  // =========================================================================
  //  19. SAFETY INTERLOCK PYLONS — 4 emergency shutdown columns
  // =========================================================================
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2 + Math.PI / 8;
    const pylonGroup = new THREE.Group();
    const column = new THREE.Mesh(cylGeo(0.08, 0.1, 3.5, 12), darkSteel);
    pylonGroup.add(column);

    // Red emergency button
    const btn = new THREE.Mesh(cylGeo(0.06, 0.06, 0.03, 16), neonRed);
    btn.position.y = 1.8;
    pylonGroup.add(btn);

    // Status LED strip
    for (let led = 0; led < 8; led++) {
      const ledMesh = new THREE.Mesh(
        sphereGeo(0.02, 8, 8),
        emissiveMat(0x00ff00, 2.0, 0.9)
      );
      ledMesh.position.set(0.09, -1.2 + led * 0.35, 0);
      pylonGroup.add(ledMesh);
    }

    pylonGroup.position.set(Math.cos(ang) * 4.5, 0, Math.sin(ang) * 4.5);
    group.add(pylonGroup);
  }

  // =========================================================================
  //  20. POWER CONDUIT BUNDLES — thick cable runs from hull to cage
  // =========================================================================
  for (let i = 0; i < 6; i++) {
    const theta = (i / 6) * Math.PI * 2;
    const cablePts = [];
    for (let s = 0; s <= 30; s++) {
      const t = s / 30;
      cablePts.push(new THREE.Vector3(
        Math.cos(theta) * (4.5 - t * 1.5),
        -2.0 + t * 2.0 + Math.sin(t * Math.PI * 3) * 0.3,
        Math.sin(theta) * (4.5 - t * 1.5)
      ));
    }
    const cableCurve = new THREE.CatmullRomCurve3(cablePts);
    const cableTube = new THREE.TubeGeometry(cableCurve, 40, 0.06, 8, false);
    group.add(new THREE.Mesh(cableTube, rubber));

    // Inner conductor
    const innerTube = new THREE.TubeGeometry(cableCurve, 40, 0.03, 8, false);
    group.add(new THREE.Mesh(innerTube, copper));
  }

  // =========================================================================
  //  21. LADDER + ACCESS HATCH
  // =========================================================================
  const ladderGroup = new THREE.Group();
  const ladderHeight = 3.5;
  // Rails
  for (let side = -1; side <= 1; side += 2) {
    const rail = new THREE.Mesh(cylGeo(0.015, 0.015, ladderHeight, 8), steel);
    rail.position.x = side * 0.12;
    ladderGroup.add(rail);
  }
  // Rungs
  for (let r = 0; r < 14; r++) {
    const rung = new THREE.Mesh(cylGeo(0.01, 0.01, 0.24, 8), steel);
    rung.rotation.z = Math.PI / 2;
    rung.position.y = -ladderHeight / 2 + 0.2 + r * 0.24;
    ladderGroup.add(rung);
  }
  ladderGroup.position.set(4.9, 0, 1.5);
  ladderGroup.rotation.z = 0.15;
  group.add(ladderGroup);

  // Access hatch
  const hatch = new THREE.Mesh(cylGeo(0.3, 0.3, 0.04, 24), darkSteel);
  hatch.position.set(4.85, 1.5, 1.5);
  hatch.rotation.z = Math.PI / 2;
  group.add(hatch);
  // Hatch handle
  const handle = new THREE.Mesh(torusGeo(0.08, 0.015, 8, 24), chrome);
  handle.position.set(4.9, 1.5, 1.5);
  handle.rotation.y = Math.PI / 2;
  group.add(handle);

  // =========================================================================
  //  22. HAWKING TEMPERATURE GAUGE — vertical thermometer-style cylinder
  // =========================================================================
  const gaugeGroup = new THREE.Group();
  const gaugeOuter = new THREE.Mesh(cylGeo(0.06, 0.06, 1.2, 16), glass);
  gaugeGroup.add(gaugeOuter);
  const gaugeFill = new THREE.Mesh(cylGeo(0.04, 0.04, 0.3, 12), neonOrange);
  gaugeFill.position.y = -0.45;
  gaugeGroup.add(gaugeFill);
  meshes.gaugeFill = gaugeFill;
  const gaugeBulb = new THREE.Mesh(sphereGeo(0.08, 16, 16), neonOrange);
  gaugeBulb.position.y = -0.65;
  gaugeGroup.add(gaugeBulb);
  gaugeGroup.position.set(-4.6, 1.0, 0);
  group.add(gaugeGroup);

  // =========================================================================
  //  23.  GRAVITATIONAL WAVE ANTENNA — quadrupole arm cross
  // =========================================================================
  for (let arm = 0; arm < 2; arm++) {
    const armAngle = arm * Math.PI / 2;
    const gwArm = new THREE.Mesh(boxGeo(6.0, 0.03, 0.03), chrome);
    gwArm.rotation.y = armAngle;
    gwArm.position.y = -3.0;
    group.add(gwArm);
    // End mirrors
    for (let sign = -1; sign <= 1; sign += 2) {
      const mirror = new THREE.Mesh(boxGeo(0.15, 0.15, 0.02), glass);
      mirror.position.set(
        Math.cos(armAngle) * 3.0 * sign,
        -3.0,
        Math.sin(armAngle) * 3.0 * sign
      );
      group.add(mirror);
    }
  }

  // =========================================================================
  //  24. RIVETS — hundreds on hull surface
  // =========================================================================
  for (let lat = 0; lat < 10; lat++) {
    const phi = ((lat + 1) / 11) * Math.PI;
    const rLat = Math.sin(phi) * 5.1;
    const yLat = Math.cos(phi) * 3.3;
    const count = Math.floor(rLat * 6);
    for (let lon = 0; lon < count; lon++) {
      const theta2 = (lon / count) * Math.PI * 2;
      const rivet = new THREE.Mesh(sphereGeo(0.025, 6, 6), chrome);
      rivet.position.set(
        Math.cos(theta2) * rLat,
        yLat,
        Math.sin(theta2) * rLat
      );
      group.add(rivet);
    }
  }

  // =========================================================================
  //  PARTS ARRAY  (25+ entries)
  // =========================================================================
  const parts = [
    {
      name: 'Micro Black Hole',
      description: 'Artificially created micro black hole with mass ~10⁹ kg, Schwarzschild radius ≈1.5 fm equivalent scaled to 0.5 m for visualisation. Contains the entire energy reservoir of the device.',
      material: 'Degenerate matter / singularity',
      function: 'Energy source; mass–energy reservoir E=Mc² whose controlled evaporation releases the detonation energy.',
      assemblyOrder: 1,
      connections: ['EM Containment Cage', 'Accretion Disc', 'Photon Sphere'],
      failureEffect: 'Uncontrolled evaporation → premature detonation',
      cascadeFailures: ['EM Containment Cage', 'Outer Hull'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'EM Containment Cage',
      description: 'Three mutually orthogonal superconducting toroidal coils generating ~10¹⁵ T magnetic confinement field, suspending the micro BH in vacuum.',
      material: 'Yttrium-barium-copper-oxide superconductor at 4 K',
      function: 'Magnetically confines the charged accretion plasma surrounding the BH, preventing horizon contact with vessel walls.',
      assemblyOrder: 2,
      connections: ['Micro Black Hole', 'Superconducting Cryostat', 'Power Conduits'],
      failureEffect: 'Loss of confinement; BH drifts into hull → catastrophic mass absorption',
      cascadeFailures: ['Outer Hull', 'Operator Cabin'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 }
    },
    {
      name: 'Accretion Disc',
      description: 'Six-layer ionised plasma disc orbiting BH at near-relativistic velocities, radiating thermally in the UV–X-ray spectrum.',
      material: 'Hydrogen/helium plasma ~10⁸ K',
      function: 'Provides angular-momentum reservoir and mass feed; disc luminosity serves as real-time mass-loss indicator.',
      assemblyOrder: 3,
      connections: ['Micro Black Hole', 'Penrose Turbines'],
      failureEffect: 'Disc dissipation → loss of mass-rate telemetry',
      cascadeFailures: ['Penrose Turbines', 'Spectrum Visualiser'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 0, z: 0 }
    },
    {
      name: 'Relativistic Jets',
      description: 'Bipolar magnetically collimated plasma jets emitted along BH spin axis at 0.99c.',
      material: 'Pair-plasma (e⁺e⁻) + photons',
      function: 'Exhaust excess angular momentum; jet power ∝ BH spin parameter a*.',
      assemblyOrder: 4,
      connections: ['Micro Black Hole', 'Magnetic Bottle Nodes'],
      failureEffect: 'Jet misalignment → hull breach',
      cascadeFailures: ['Outer Hull', 'Operator Cabin'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 }
    },
    {
      name: 'Mass-Drain Injector Arms',
      description: 'Six radial electrostatic siphon arms that selectively remove charged baryonic matter from the accretion disc, reducing BH feeding rate to accelerate net mass loss.',
      material: 'Tungsten-rhenium alloy with ceramic insulation',
      function: 'Precisely control mass-loss rate dM/dt to steer BH along desired evaporation trajectory toward detonation threshold.',
      assemblyOrder: 5,
      connections: ['Accretion Disc', 'Control Console'],
      failureEffect: 'Loss of drain control → uncontrolled evaporation timeline',
      cascadeFailures: ['Detonation Flash', 'Containment Cage'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: 2, z: 6 }
    },
    {
      name: 'Hawking Radiation Spectrum Visualiser',
      description: '120-bar ring showing instantaneous spectral energy distribution of Hawking emission, colour-coded IR→gamma.',
      material: 'Holographic projection on meta-surface display',
      function: 'Displays the black-body Hawking spectrum; peak shifts blueward as T_H = ℏc³/(8πGMk_B) rises with decreasing M.',
      assemblyOrder: 6,
      connections: ['Graviton Detector Array', 'Control Console'],
      failureEffect: 'Operator loses real-time evaporation status',
      cascadeFailures: ['Control Console'],
      originalPosition: { x: 0, y: -2, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 }
    },
    {
      name: 'Penrose Energy-Extraction Turbines',
      description: 'Four turbines placed in the ergosphere region exploit the Penrose process to extract rotational energy from the Kerr BH.',
      material: 'Neutron-degenerate-matter blades (theoretical)',
      function: 'Convert BH spin energy → electrical power for containment systems, achieving >100 % mass-energy efficiency via negative-energy orbits.',
      assemblyOrder: 7,
      connections: ['Micro Black Hole', 'Power Conduits'],
      failureEffect: 'Power loss to EM cage → containment failure',
      cascadeFailures: ['EM Containment Cage', 'Superconducting Cryostat'],
      originalPosition: { x: 0, y: 2.5, z: 0 },
      explodedPosition: { x: 0, y: 10, z: 0 }
    },
    {
      name: 'Superconducting Cryostat Ring',
      description: 'Toroidal liquid-helium cryostat maintaining coils below T_c. Houses 8 km of Nb₃Sn superconducting cable.',
      material: 'Niobium-tin superconductor + stainless steel jacket',
      function: 'Keeps EM cage coils at 4.2 K for zero-resistance current carrying at >10⁶ A.',
      assemblyOrder: 8,
      connections: ['EM Containment Cage', 'Cryo Coolant Pipes'],
      failureEffect: 'Quench event → sudden resistance → coil meltdown → containment loss',
      cascadeFailures: ['EM Containment Cage', 'Micro Black Hole'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -5, z: 0 }
    },
    {
      name: 'Magnetic Bottle Nodes',
      description: 'Eight auxiliary field emitter pods creating cusp-geometry magnetic bottle to supplement toroidal confinement.',
      material: 'Permanent NdFeB magnets + superconducting trim coils',
      function: 'Provide fine-tuning of confinement field topology, sealing magnetic mirror leaks.',
      assemblyOrder: 9,
      connections: ['EM Containment Cage', 'Safety Interlock Pylons'],
      failureEffect: 'Mirror leak → plasma escape → local hull erosion',
      cascadeFailures: ['Outer Hull'],
      originalPosition: { x: 0, y: 1.8, z: 0 },
      explodedPosition: { x: 5, y: 7, z: 5 }
    },
    {
      name: 'Graviton Detector Array',
      description: 'Six parabolic-dish Weber-bar resonant-mass detectors sensitive to gravitational wave strain h ~ 10⁻²¹.',
      material: 'Single-crystal silicon with SQUID readout',
      function: 'Monitors gravitational wave emission during final-stage evaporation, providing sub-ms warning of detonation onset.',
      assemblyOrder: 10,
      connections: ['Spectrum Visualiser', 'Control Console'],
      failureEffect: 'Loss of detonation-timing telemetry',
      cascadeFailures: ['Operator Cabin'],
      originalPosition: { x: 0, y: -1.5, z: 0 },
      explodedPosition: { x: 8, y: -5, z: 0 }
    },
    {
      name: 'Outer Containment Hull',
      description: 'Oblate spheroid armoured shell with 16 latitudinal and 12 longitudinal ribs; designed to withstand 10¹⁵ Pa blast overpressure during controlled tests.',
      material: 'Tungsten-carbide / depleted-uranium composite laminate',
      function: 'Structural containment, radiation shielding (γ, neutron), and blast confinement during sub-critical tests.',
      assemblyOrder: 11,
      connections: ['All internal systems'],
      failureEffect: 'Total loss of containment → unshielded radiation release',
      cascadeFailures: ['All systems'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 12 }
    },
    {
      name: 'Operator Cabin',
      description: 'Shielded control station with tinted blast-glass viewport, 3 holographic MFDs, HOTAS joystick, and ejection seat.',
      material: 'Borated polyethylene + lead glass',
      function: 'Houses operator for manual override of drain rate and emergency scram.',
      assemblyOrder: 12,
      connections: ['Control Console screens', 'Mass-Drain Arms', 'Safety Interlock'],
      failureEffect: 'Loss of manual override capability',
      cascadeFailures: ['Mass-Drain Arms'],
      originalPosition: { x: 4.5, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 0, z: 0 }
    },
    {
      name: 'Hawking Temperature Gauge',
      description: 'Vertical thermometer-style display showing instantaneous Hawking temperature T_H in real time.',
      material: 'Fluorescent liquid-crystal display',
      function: 'Visual readout of T_H = ℏc³/(8πGMk_B); fill level rises as BH mass decreases.',
      assemblyOrder: 13,
      connections: ['Graviton Detector Array', 'Control Console'],
      failureEffect: 'Operator blind to temperature runaway',
      cascadeFailures: ['Operator Cabin'],
      originalPosition: { x: -4.6, y: 1.0, z: 0 },
      explodedPosition: { x: -10, y: 1, z: 0 }
    },
    {
      name: 'Detonation Flash Sphere',
      description: 'Visualisation artefact representing the final-moment γ-ray flash when the BH mass reaches Planck mass and evaporates completely.',
      material: 'Pure photon field (10²⁰ eV γ-rays)',
      function: "The weapon's payload — releases remaining mass-energy E = Mc² ≈ 10²⁵ J in ~10⁻²³ s.",
      assemblyOrder: 14,
      connections: ['Micro Black Hole'],
      failureEffect: 'N/A — this IS the failure mode',
      cascadeFailures: ['Everything within blast radius'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Bekenstein-Hawking Entropy Display',
      description: 'Holographic ring showing S_BH = A/(4 l_P²) in real time as horizon area shrinks.',
      material: 'Meta-surface hologram projector',
      function: 'Tracks entropy decrease confirming information loss (or scrambling per Page curve).',
      assemblyOrder: 15,
      connections: ['Graviton Detector Array', 'Spectrum Visualiser'],
      failureEffect: 'Loss of entropy audit trail',
      cascadeFailures: ['Spectrum Visualiser'],
      originalPosition: { x: 0, y: -1, z: 0 },
      explodedPosition: { x: 0, y: -10, z: 0 }
    },
    {
      name: 'Gravitational Wave Antenna',
      description: 'Quadrupole Michelson interferometer arms (2 × 6 m) with end mirrors for detecting BH quasi-normal-mode ringdown.',
      material: 'Ultra-low-expansion glass mirrors + Nd:YAG laser',
      function: 'Measures quasi-normal mode frequencies f_QNM of the shrinking BH to confirm mass in real time.',
      assemblyOrder: 16,
      connections: ['Graviton Detector Array'],
      failureEffect: 'Loss of independent mass measurement',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -3, z: 0 },
      explodedPosition: { x: 0, y: -14, z: 0 }
    },
    {
      name: 'Warning Beacon Array',
      description: '14 high-intensity red/amber warning strobes distributed around hull equator and poles.',
      material: 'GaN LED modules in armoured housings',
      function: 'Visual alarm indicating containment status: green = nominal, amber = drain active, red = runaway evaporation.',
      assemblyOrder: 17,
      connections: ['Safety Interlock Pylons'],
      failureEffect: 'No visual warning of critical state',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 7, y: 4, z: 7 }
    },
    {
      name: 'Power Conduit Bundles',
      description: 'Six high-current cable runs (rubber-insulated copper) carrying 10⁶ A from Penrose turbines to EM coils.',
      material: 'Oxygen-free copper conductors, silicone-rubber insulation',
      function: 'Electrical power distribution from Penrose extraction to all active subsystems.',
      assemblyOrder: 18,
      connections: ['Penrose Turbines', 'EM Containment Cage', 'Control Console'],
      failureEffect: 'Power interruption → cascading coil quench',
      cascadeFailures: ['EM Containment Cage', 'Superconducting Cryostat'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: -4, z: -6 }
    }
  ];

  // =========================================================================
  //  QUIZ QUESTIONS  (PhD-level BH thermodynamics)
  // =========================================================================
  const quizQuestions = [
    {
      question: 'The Hawking temperature of a Schwarzschild black hole is T_H = ℏc³ / (8πGMk_B). If the BH mass is halved, by what factor does T_H change?',
      options: [
        'T_H doubles',
        'T_H quadruples',
        'T_H halves',
        'T_H remains unchanged'
      ],
      correctIndex: 0,
      explanation: 'T_H ∝ 1/M, so halving M doubles T_H.  This inverse relationship drives the runaway: as the BH radiates and loses mass, it gets hotter, radiates faster, loses mass even more quickly — a positive feedback loop culminating in explosive evaporation.'
    },
    {
      question: 'The Page time t_Page marks the moment when a black hole has radiated away approximately what fraction of its initial Bekenstein-Hawking entropy, and the von Neumann entropy of the radiation begins to decrease?',
      options: [
        'Approximately 10 % of the initial entropy (very early)',
        'Approximately 50 % of the initial entropy (halfway point)',
        'Approximately 90 % of the initial entropy (near end)',
        'Exactly 100 % — the Page time equals the total evaporation time'
      ],
      correctIndex: 1,
      explanation: 'Don Page (1993) showed that the entanglement entropy of the emitted Hawking radiation reaches its maximum at the Page time, when roughly half the initial coarse-grained entropy has been radiated. After this point, each new Hawking quantum is more likely to be entangled with previously emitted radiation than with the remaining BH interior, causing S_vN(radiation) to decrease — the "Page curve" turnover. This is central to the black hole information paradox.'
    },
    {
      question: 'Greybody factors σ_l(ω) modify the pure black-body Hawking spectrum. Physically, they arise because:',
      options: [
        'The BH has a non-zero albedo due to pair recombination at the horizon',
        'The curved spacetime outside the horizon acts as a potential barrier that partially backscatters outgoing modes',
        'Quantum gravity corrections discretise the emission spectrum',
        'The accretion disc reabsorbs a fraction of the emitted radiation'
      ],
      correctIndex: 1,
      explanation: 'Greybody factors account for the frequency-dependent transmission probability through the effective potential barrier created by the spacetime curvature (centrifugal + gravitational) outside the horizon.  Low-energy (long-wavelength) modes are strongly backscattered (σ → 0), while high-energy modes pass through more freely (σ → geometric cross-section).  The net effect suppresses the low-ω Planckian tail and enhances the high-ω emission relative to a naive blackbody at T_H.'
    },
    {
      question: 'The total evaporation time of a Schwarzschild BH is t_evap = 5120 π G² M³ / (ℏ c⁴).  For a BH of mass 10⁹ kg (≈ mass of a small asteroid), the evaporation time is approximately:',
      options: [
        '~10⁻¹⁸ seconds (sub-attosecond)',
        '~2.6 × 10⁻⁵ seconds (tens of microseconds)',
        '~84 seconds (about a minute and a half)',
        '~10¹⁰ years (longer than the age of the universe)'
      ],
      correctIndex: 2,
      explanation: 'Substituting M = 10⁹ kg into t_evap = 5120πG²M³/(ℏc⁴) gives ≈ 84 s.  This is the regime exploited by the weapon: a BH massive enough to be briefly stable, yet light enough that its total evaporation releases ~10²⁵ J (comparable to a large thermonuclear device) in under two minutes, with the final burst arriving in the last ~10⁻²³ s as M → M_Planck.'
    },
    {
      question: "The Bekenstein-Hawking entropy S_BH = k_B c³ A / (4 G ℏ) implies that a black hole's entropy scales with its horizon area A, not its volume.  This \"holographic\" scaling has the profound consequence that:",
      options: [
        'A BH contains fewer microstates than a same-volume thermal gas, capping the entropy density of any region of space',
        'A BH contains MORE microstates than any other object of the same volume, establishing an upper bound on entropy for a given surface area — the Bekenstein bound',
        'Entropy is not a thermodynamic quantity for BHs; S_BH is merely an analogy',
        'The interior volume of a BH is literally zero, so area ≡ volume'
      ],
      correctIndex: 1,
      explanation: 'The Bekenstein bound states that the maximum entropy of any region is S_max = k_B c³ A / (4Gℏ), achieved when the region is a BH.  This means the BH is the most entropic object that can fit inside a given area — any attempt to pack more entropy triggers gravitational collapse to a (larger) BH.  This area-scaling of maximum entropy is the foundation of the holographic principle (\'t Hooft, Susskind), which posits that the fundamental degrees of freedom of a volume of spacetime reside on its boundary.'
    },
    {
      question: 'In the Penrose process, energy is extracted from a rotating (Kerr) black hole by sending a particle into the ergosphere such that it splits — one fragment enters the horizon with negative energy-at-infinity while the other escapes with more energy than the original.  The maximum fraction of a Kerr BH\'s total mass-energy extractable this way is:',
      options: [
        "~5.7 % (1 − 1/√2 ≈ 0.293 of irreducible mass… no, that's wrong)",
        '~20.7 %  (for a maximally spinning BH, where a* = 1)',
        '~29 %  (= 1 − √(1/2) ≈ 0.2929…, the irreducible mass limit)',
        '100 % — the entire mass can in principle be converted to energy'
      ],
      correctIndex: 2,
      explanation: 'For a maximally spinning Kerr BH (a* = 1), the irreducible mass is M_irr = M/√2.  The extractable rotational energy is therefore M − M_irr = M(1 − 1/√2) ≈ 0.293 M, or about 29.3 % of the total mass-energy.  This vastly exceeds thermonuclear efficiency (~0.7 %) and even matter-antimatter annihilation (100 % but of rest mass of fuel only).  The Penrose turbines in this weapon exploit this to power the EM confinement cage.'
    }
  ];

  // =========================================================================
  //  DESCRIPTION
  // =========================================================================
  const description = `Hawking Radiation Bomb (Ultra God Tier)

A theoretical weapon of mass destruction that exploits the thermodynamic instability of micro black holes.  A black hole of mass ~10⁹ kg is artificially created and suspended in a superconducting electromagnetic containment cage.  Six mass-drain injector arms carefully siphon baryonic matter from the accretion disc, reducing the BH's net mass accretion rate below its Hawking luminosity.

As the BH loses mass, its Hawking temperature T_H = ℏc³/(8πGMk_B) rises, its emission spectrum blue-shifts from infrared through visible light to ultraviolet, X-ray, and finally gamma-ray.  The evaporation accelerates via positive feedback (dM/dt ∝ −1/M², so smaller BHs evaporate faster).

The weapon's Hawking Radiation Spectrum Visualiser shows this spectral evolution in real time.  The Bekenstein-Hawking entropy display tracks the information-theoretic state via S = A/(4 l_P²).

When the BH mass reaches the Planck scale (~2.2 × 10⁻⁸ kg), the remaining mass-energy (~10²⁵ J, equivalent to ~2 megatons TNT) is released in a single catastrophic burst of ultra-high-energy gamma rays and gravitons in approximately 10⁻²³ seconds — the Detonation Flash.

Key subsystems:
• Micro Black Hole (event horizon + photon sphere + accretion disc + relativistic jets)
• Electromagnetic Containment Cage (3 orthogonal superconducting toroidal coils)
• Mass-Drain Injector Arms (6 radial electrostatic siphons)
• Penrose Energy-Extraction Turbines (4 ergosphere-tap turbines)
• Superconducting Cryostat Ring + Cryo Coolant Pipes
• Magnetic Bottle Nodes (8 field emitter pods)
• Graviton Detector Array (6 parabolic dishes)
• Hawking Radiation Spectrum Visualiser (120-bar spectral ring)
• Bekenstein-Hawking Entropy Display (holographic ring)
• Gravitational Wave Antenna (quadrupole Michelson interferometer)
• Hawking Temperature Gauge (real-time T_H readout)
• Warning Beacon Array (14 strobes)
• Operator Cabin with control screens, joystick, chair
• Outer Containment Hull (oblate spheroid with ribs and rivets)
• Safety Interlock Pylons (4 emergency scram columns)
• Power Conduit Bundles (6 high-current cable runs)
• Detonation Flash Sphere (final-burst visualisation)
• Hawking Particle Emitter (200 animated particles)
• Ladder + Access Hatch
• Heat Dissipation Fins (16 radiator vanes)`;

  // =========================================================================
  //  ANIMATE — richly synchronised multi-system animation
  // =========================================================================
  function animate(time, speed, _meshes) {
    const t = time * speed;
    const s = Math.sin;
    const c = Math.cos;

    // --- Evaporation cycle: 30-second loop ---
    const cycleLen = 30.0;
    const phase = (t % cycleLen) / cycleLen;  // 0→1

    // BH shrinks over cycle
    const bhScale = 1.0 - phase * 0.85;  // shrinks to 15% at detonation
    meshes.bhSphere.scale.setScalar(Math.max(bhScale, 0.08));
    meshes.photonSphere.scale.setScalar(Math.max(bhScale * 1.24, 0.1));

    // Accretion disc shrinks and speeds up
    meshes.accretionLayers.forEach((disc, i) => {
      disc.rotation.z = t * (2.0 + i * 0.5 + phase * 8.0);
      const dScale = Math.max(bhScale * (1.0 + i * 0.15), 0.1);
      disc.scale.setScalar(dScale);
    });

    // Jets intensify and narrow as BH shrinks
    const jetIntensity = 1.0 + phase * 4.0;
    meshes.jetTop.scale.set(1.0 / jetIntensity, jetIntensity, 1.0 / jetIntensity);
    meshes.jetBot.scale.set(1.0 / jetIntensity, jetIntensity, 1.0 / jetIntensity);
    meshes.jetTop.material.emissiveIntensity = 3.0 + phase * 12.0;
    meshes.jetBot.material.emissiveIntensity = 3.0 + phase * 12.0;

    // EM cage coils rotate, pulse brightness
    meshes.coilMeshes.forEach((coil, i) => {
      const axis = ['x', 'y', 'z'][i];
      coil.rotation[axis] += 0.003 * speed + phase * 0.01;
      coil.material.emissiveIntensity = 2.0 + s(t * 3 + i * 2) * 0.8 + phase * 3.0;
    });

    // Field rings rotate and pulse
    meshes.fieldRings.forEach((fr, i) => {
      fr.rotation.z = t * 0.5 + i * 0.4;
      fr.rotation.x = Math.PI / 2 + s(t * 0.8 + i) * 0.15;
      fr.material.opacity = 0.15 + s(t * 2 + i) * 0.1 + phase * 0.3;
    });

    // Drain arms piston in/out
    meshes.drainArms.forEach((arm, i) => {
      const pistonTravel = s(t * 2 + i * 1.0) * 0.15 * (1.0 + phase * 2);
      if (arm.children[3]) arm.children[3].position.x = 2.4 + pistonTravel;
      if (arm.children[4]) arm.children[4].position.x = 2.6 + pistonTravel * 1.3;
    });

    // Spectrum bars — height oscillates, peak shifts blueward as phase increases
    const peakIndex = Math.floor(phase * spectrumBarCount * 0.9);
    meshes.spectrumBars.forEach((bar) => {
      const idx = bar.userData.index;
      const dist = Math.abs(idx - peakIndex);
      const envelope = Math.exp(-dist * dist / (200 + (1 - phase) * 600));
      const heightMod = bar.userData.baseHeight * (1.0 + envelope * (2.0 + phase * 6.0) + s(t * 5 + idx * 0.3) * 0.15);
      bar.scale.y = heightMod / bar.userData.baseHeight;
      bar.material.emissiveIntensity = 1.0 + envelope * (3.0 + phase * 8.0);
    });

    // Turbines spin
    meshes.turbines.forEach((tg, i) => {
      tg.rotation.z = t * (3 + i) * (1 + phase * 2);
    });

    // Warning lights — strobe faster as phase increases
    const strobeFreq = 2 + phase * 20;
    meshes.warningLights.forEach((wl, i) => {
      const on = s(t * strobeFreq + i * 0.5) > 0;
      wl.material.emissiveIntensity = on ? (2.0 + phase * 6.0) : 0.1;
    });

    // Temperature gauge fill rises with phase
    if (meshes.gaugeFill) {
      const fillHeight = 0.3 + phase * 0.85;
      meshes.gaugeFill.scale.y = fillHeight / 0.3;
      meshes.gaugeFill.position.y = -0.45 + (fillHeight - 0.3) * 0.5;
      // Colour shifts from orange → white-hot
      const gaugeHue = 0.08 - phase * 0.08;
      const gaugeLum = 0.5 + phase * 0.4;
      meshes.gaugeFill.material.color.setHSL(Math.max(gaugeHue, 0), 1, gaugeLum);
      meshes.gaugeFill.material.emissive.setHSL(Math.max(gaugeHue, 0), 1, gaugeLum);
      meshes.gaugeFill.material.emissiveIntensity = 1.5 + phase * 5;
    }

    // Entropy ring shrinks with BH (entropy ∝ area ∝ M²)
    if (meshes.entropyRing) {
      meshes.entropyRing.scale.setScalar(bhScale * bhScale);
      meshes.entropyRing.rotation.z = t * 0.3;
    }

    // Lens shell wobble
    if (meshes.lensShell) {
      meshes.lensShell.scale.setScalar(1.0 + s(t * 1.5) * 0.03);
      meshes.lensShell.material.opacity = 0.05 + phase * 0.12;
    }

    // Hawking particles — visible in last 40% of cycle
    meshes.particles.forEach((p, i) => {
      if (phase > 0.6) {
        p.visible = true;
        const particlePhase = ((phase - 0.6) / 0.4);
        const radius = p.userData.baseRadius + particlePhase * p.userData.speed * 4.0;
        p.position.copy(p.userData.dir).multiplyScalar(radius);
        p.material.opacity = 0.8 * (1.0 - particlePhase);
        p.material.emissiveIntensity = 2.0 + particlePhase * 8.0;
        const particleScale = (1.0 - particlePhase * 0.7);
        p.scale.setScalar(Math.max(particleScale, 0.1));
      } else {
        p.visible = false;
      }
    });

    // Detonation flash — visible in last 5% of cycle
    if (meshes.flashSphere) {
      if (phase > 0.95) {
        const flashPhase = (phase - 0.95) / 0.05;
        meshes.flashSphere.material.opacity = flashPhase * 0.9;
        meshes.flashSphere.scale.setScalar(0.1 + flashPhase * 15.0);
        meshes.flashSphere.material.emissiveIntensity = 5.0 + flashPhase * 50.0;
      } else {
        meshes.flashSphere.material.opacity = 0;
        meshes.flashSphere.scale.setScalar(0.1);
        meshes.flashSphere.material.emissiveIntensity = 0;
      }
    }

    // Hull flickers translucent near detonation
    if (meshes.hullOuter) {
      meshes.hullOuter.material.opacity = 0.25 - phase * 0.2;
    }

    // Cage group gentle wobble simulating field instability
    if (meshes.cageGroup) {
      meshes.cageGroup.rotation.x = s(t * 0.7) * 0.02 * (1 + phase * 5);
      meshes.cageGroup.rotation.z = c(t * 0.5) * 0.02 * (1 + phase * 5);
    }

    // Bottle nodes pulse
    meshes.bottleNodes.forEach((node, i) => {
      if (node.children[1]) {
        node.children[1].material.emissiveIntensity = 1.5 + s(t * 4 + i) * 1.0 + phase * 3;
      }
    });

    // BH group subtle orbital wobble (simulates micro-perturbation in confinement)
    if (meshes.bhGroup) {
      meshes.bhGroup.position.x = s(t * 1.2) * 0.02 * (1 + phase * 8);
      meshes.bhGroup.position.z = c(t * 1.7) * 0.02 * (1 + phase * 8);
      meshes.bhGroup.rotation.y = t * 0.5;
    }

    // Spectrum group slow rotation
    if (meshes.spectrumGroup) {
      meshes.spectrumGroup.rotation.z += 0.001 * speed;
    }
  }

  // =========================================================================
  //  RETURN
  // =========================================================================
  return { group, parts, description, quizQuestions, animate };
}
