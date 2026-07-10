// ============================================================================
// GOD TIER: COSMIC WEB ANCHOR — Megastructure anchored to the large-scale
// structure of the universe, tapping dark matter filaments for energy.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Helper Utilities ──────────────────────────────────────────────────────
  function emissiveMat(hex, intensity = 1.2) {
    return new THREE.MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: intensity,
      transparent: true, opacity: 0.92, metalness: 0.4, roughness: 0.3,
    });
  }
  function ghostMat(hex, opacity = 0.18) {
    return new THREE.MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: 0.6,
      transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false,
    });
  }
  function neonLineMat(hex) {
    return new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.85 });
  }

  // ── Palette ───────────────────────────────────────────────────────────────
  const cosmicBlue   = emissiveMat(0x3377ff, 1.4);
  const cosmicViolet = emissiveMat(0x9933ff, 1.5);
  const darkMatterPurple = ghostMat(0x6622cc, 0.14);
  const baryonicGold = emissiveMat(0xffaa22, 1.1);
  const neutrinoGreen = emissiveMat(0x22ffaa, 0.9);
  const plasmaPink   = emissiveMat(0xff44aa, 1.3);
  const voidBlack    = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.95, roughness: 0.15 });
  const haloMat      = ghostMat(0x5544dd, 0.10);
  const lensRingMat  = ghostMat(0x88aaff, 0.22);
  const filamentCoreMat = emissiveMat(0x4488ff, 0.7);
  const anchorChrome = chrome.clone ? chrome.clone() : new THREE.MeshStandardMaterial({ color: 0xccccdd, metalness: 0.97, roughness: 0.06 });
  const anchorGlow   = emissiveMat(0x00ccff, 2.0);
  const darkEnergyRed = emissiveMat(0xff2244, 1.6);

  // ── Meshes collection for animation ───────────────────────────────────────
  const meshes = {
    filaments: [], filamentParticles: [], galaxyClusters: [],
    galaxyOrbits: [], darkMatterHalos: [], lensingRings: [],
    anchorCore: null, anchorArms: [], anchorRings: [],
    extractorBeams: [], matterFlowParticles: [],
    voidSpheres: [], neutrinoStreams: [], pulseCores: [],
    singularityShell: null, darkFlowArrows: [],
    baoRings: [], gravWaveRipples: [],
  };

  // ========================================================================
  // 1. COSMIC WEB FILAMENTS (Dark Matter + Baryonic strands)
  // ========================================================================
  const filamentNodes = [
    { pos: new THREE.Vector3(0, 0, 0), isAnchor: true },
    { pos: new THREE.Vector3(18, 6, 12) },
    { pos: new THREE.Vector3(-20, 4, 10) },
    { pos: new THREE.Vector3(-15, -8, -18) },
    { pos: new THREE.Vector3(22, -5, -14) },
    { pos: new THREE.Vector3(10, 14, -20) },
    { pos: new THREE.Vector3(-12, 16, 8) },
    { pos: new THREE.Vector3(8, -18, 6) },
    { pos: new THREE.Vector3(-22, -2, -6) },
    { pos: new THREE.Vector3(16, 10, 20) },
    { pos: new THREE.Vector3(-8, -14, 22) },
    { pos: new THREE.Vector3(24, -12, 4) },
  ];

  const filamentEdges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
    [1,4],[1,9],[2,6],[2,8],[3,7],[3,8],[4,11],
    [5,6],[5,9],[7,10],[7,11],[8,2],[9,1],[10,3],[10,7],[11,4],
  ];

  // Build each filament as a fat tube with dark-matter sheath
  filamentEdges.forEach(([a, b]) => {
    const pA = filamentNodes[a].pos;
    const pB = filamentNodes[b].pos;
    const mid = pA.clone().add(pB).multiplyScalar(0.5);
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
    );
    mid.add(offset);
    const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
    // Baryonic core (bright)
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.18, 8, false);
    const tube = new THREE.Mesh(tubeGeo, filamentCoreMat);
    group.add(tube);
    meshes.filaments.push(tube);

    // Dark matter sheath (translucent, wider)
    const sheathGeo = new THREE.TubeGeometry(curve, 48, 0.7, 12, false);
    const sheath = new THREE.Mesh(sheathGeo, darkMatterPurple);
    group.add(sheath);
    meshes.darkMatterHalos.push(sheath);

    // Flowing matter particles along filament
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const pt = curve.getPoint(t);
      const sGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.06, 6, 6);
      const sMat = baryonicGold.clone();
      sMat.emissiveIntensity = 0.5 + Math.random();
      const s = new THREE.Mesh(sGeo, sMat);
      s.position.copy(pt);
      s.userData = { curve, t, speed: 0.003 + Math.random() * 0.005 };
      group.add(s);
      meshes.matterFlowParticles.push(s);
    }
  });

  // ========================================================================
  // 2. GALAXY CLUSTER NODES at filament intersections
  // ========================================================================
  filamentNodes.forEach((node, idx) => {
    const clusterGroup = new THREE.Group();
    clusterGroup.position.copy(node.pos);

    // Central massive elliptical galaxy (ICM glow)
    const coreRadius = node.isAnchor ? 2.2 : 0.9 + Math.random() * 0.6;
    const coreGeo = new THREE.SphereGeometry(coreRadius, 32, 32);
    const coreMat = node.isAnchor ? cosmicViolet.clone() : cosmicBlue.clone();
    coreMat.emissiveIntensity = node.isAnchor ? 2.0 : 0.8 + Math.random() * 0.5;
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    clusterGroup.add(coreMesh);
    meshes.galaxyClusters.push(coreMesh);

    // Dark matter halo (huge translucent sphere)
    const haloRadius = coreRadius * 3.5;
    const haloGeo = new THREE.SphereGeometry(haloRadius, 24, 24);
    const halo = new THREE.Mesh(haloGeo, haloMat.clone());
    clusterGroup.add(halo);
    meshes.darkMatterHalos.push(halo);

    // Orbiting satellite galaxies
    const satCount = node.isAnchor ? 12 : 4 + Math.floor(Math.random() * 5);
    for (let g = 0; g < satCount; g++) {
      const orbitR = coreRadius * 1.8 + Math.random() * coreRadius * 2.5;
      const satGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.15, 8, 8);
      const satMat = baryonicGold.clone();
      satMat.emissiveIntensity = 0.4 + Math.random() * 0.8;
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = Math.random() * Math.PI * 2;
      const inclination = (Math.random() - 0.5) * Math.PI * 0.6;
      sat.position.set(
        Math.cos(angle) * Math.cos(inclination) * orbitR,
        Math.sin(inclination) * orbitR,
        Math.sin(angle) * Math.cos(inclination) * orbitR,
      );
      sat.userData = {
        orbitRadius: orbitR, angle, inclination,
        speed: 0.002 + Math.random() * 0.006,
        nodeIdx: idx,
      };
      clusterGroup.add(sat);
      meshes.galaxyOrbits.push(sat);
    }

    // Gravitational lensing ring (Einstein ring representation)
    if (coreRadius > 1.0 || Math.random() > 0.4) {
      const lensGeo = new THREE.TorusGeometry(coreRadius * 2.2, 0.08, 12, 64);
      const lens = new THREE.Mesh(lensGeo, lensRingMat.clone());
      lens.rotation.x = Math.random() * Math.PI;
      lens.rotation.y = Math.random() * Math.PI;
      clusterGroup.add(lens);
      meshes.lensingRings.push(lens);

      // Secondary lensing arc
      const lens2Geo = new THREE.TorusGeometry(coreRadius * 2.8, 0.05, 8, 64);
      const lens2 = new THREE.Mesh(lens2Geo, lensRingMat.clone());
      lens2.rotation.x = Math.random() * Math.PI;
      lens2.rotation.z = Math.random() * Math.PI;
      clusterGroup.add(lens2);
      meshes.lensingRings.push(lens2);
    }

    group.add(clusterGroup);
  });

  // ========================================================================
  // 3. BARYON ACOUSTIC OSCILLATION (BAO) RINGS
  // ========================================================================
  for (let i = 0; i < 3; i++) {
    const baoRadius = 28 + i * 6;
    const baoGeo = new THREE.TorusGeometry(baoRadius, 0.05, 8, 180);
    const baoMatClone = ghostMat(0x6688ff, 0.08);
    const bao = new THREE.Mesh(baoGeo, baoMatClone);
    bao.rotation.x = Math.PI / 2 + i * 0.15;
    bao.rotation.y = i * 0.3;
    group.add(bao);
    meshes.baoRings.push(bao);
  }

  // ========================================================================
  // 4. COSMIC VOID SPHERES (underdense regions)
  // ========================================================================
  const voidPositions = [
    new THREE.Vector3(12, -10, -10),
    new THREE.Vector3(-14, 10, -12),
    new THREE.Vector3(6, 12, 14),
    new THREE.Vector3(-10, -12, 16),
  ];
  voidPositions.forEach(vp => {
    const vGeo = new THREE.SphereGeometry(3.5 + Math.random() * 2, 20, 20);
    const vMat = new THREE.MeshStandardMaterial({
      color: 0x030308, transparent: true, opacity: 0.06,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const v = new THREE.Mesh(vGeo, vMat);
    v.position.copy(vp);
    group.add(v);
    meshes.voidSpheres.push(v);
  });

  // ========================================================================
  // 5. THE ANCHOR DEVICE — Central Megastructure
  // ========================================================================
  const anchorGroup = new THREE.Group();

  // 5A. Singularity containment core — multi-shell design
  const shellRadii = [0.5, 0.7, 0.95, 1.2];
  const shellMats  = [anchorGlow, cosmicViolet.clone(), darkEnergyRed.clone(), anchorGlow.clone()];
  shellRadii.forEach((r, i) => {
    const sGeo = new THREE.IcosahedronGeometry(r, i < 2 ? 3 : 2);
    const sMat = shellMats[i].clone();
    sMat.wireframe = i % 2 === 1;
    sMat.transparent = true;
    sMat.opacity = i === 0 ? 0.9 : 0.35 - i * 0.06;
    const shell = new THREE.Mesh(sGeo, sMat);
    shell.userData = { shellIndex: i, baseRadius: r };
    anchorGroup.add(shell);
    meshes.pulseCores.push(shell);
  });

  // Outermost containment sphere
  const singGeo = new THREE.SphereGeometry(1.6, 48, 48);
  const singMat = ghostMat(0x00aaff, 0.12);
  const singShell = new THREE.Mesh(singGeo, singMat);
  anchorGroup.add(singShell);
  meshes.singularityShell = singShell;

  // 5B. Toroidal dark-energy collector rings (nested)
  for (let r = 0; r < 4; r++) {
    const torusR = 2.0 + r * 0.8;
    const tubeR  = 0.06 + r * 0.015;
    const tGeo = new THREE.TorusGeometry(torusR, tubeR, 16, 120);
    const tMat = r % 2 === 0 ? anchorChrome.clone() : cosmicBlue.clone();
    if (tMat.emissiveIntensity) tMat.emissiveIntensity = 0.6;
    const torus = new THREE.Mesh(tGeo, tMat);
    torus.rotation.x = Math.PI / 2;
    torus.rotation.y = r * Math.PI / 4;
    torus.userData = { ringIdx: r };
    anchorGroup.add(torus);
    meshes.anchorRings.push(torus);
  }

  // 5C. Radial extraction arms — articulated, with hydraulic pistons
  const armCount = 8;
  for (let a = 0; a < armCount; a++) {
    const armGroup = new THREE.Group();
    const angle = (a / armCount) * Math.PI * 2;

    // Main strut
    const strutLen = 5.5;
    const strutGeo = new THREE.CylinderGeometry(0.08, 0.12, strutLen, 12);
    const strut = new THREE.Mesh(strutGeo, anchorChrome);
    strut.rotation.z = Math.PI / 2;
    strut.position.x = strutLen / 2 + 1.6;
    armGroup.add(strut);

    // Hydraulic piston (inner cylinder slides in outer)
    const outerPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 2.0, 10),
      darkSteel
    );
    outerPiston.rotation.z = Math.PI / 2;
    outerPiston.position.x = strutLen + 1.6;
    armGroup.add(outerPiston);

    const innerPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 1.8, 10),
      chrome
    );
    innerPiston.rotation.z = Math.PI / 2;
    innerPiston.position.x = strutLen + 2.6;
    armGroup.add(innerPiston);
    innerPiston.userData = { armIndex: a };
    meshes.extractorBeams.push(innerPiston);

    // Tip emitter (glowing)
    const tipGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const tip = new THREE.Mesh(tipGeo, anchorGlow);
    tip.position.x = strutLen + 3.6;
    armGroup.add(tip);

    // Conduit tubes back to core
    const conduitPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.6, 0.15, 0),
      new THREE.Vector3(strutLen * 0.4, 0.3, 0.15),
      new THREE.Vector3(strutLen * 0.7, 0.1, -0.1),
      new THREE.Vector3(strutLen + 1.0, 0, 0),
    ]);
    const conduitGeo = new THREE.TubeGeometry(conduitPath, 24, 0.03, 6, false);
    const conduit = new THREE.Mesh(conduitGeo, copper);
    armGroup.add(conduit);

    // Second conduit (coolant)
    const conduit2Path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.6, -0.15, 0),
      new THREE.Vector3(strutLen * 0.5, -0.25, -0.12),
      new THREE.Vector3(strutLen + 1.0, -0.05, 0),
    ]);
    const conduit2Geo = new THREE.TubeGeometry(conduit2Path, 20, 0.025, 6, false);
    const conduit2 = new THREE.Mesh(conduit2Geo, neutrinoGreen);
    armGroup.add(conduit2);

    // Rivets along strut
    for (let rv = 0; rv < 8; rv++) {
      const rivetGeo = new THREE.SphereGeometry(0.025, 6, 6);
      const rivet = new THREE.Mesh(rivetGeo, steel);
      rivet.position.set(2.0 + rv * 0.6, 0.09, 0);
      armGroup.add(rivet);
    }

    armGroup.rotation.y = angle;
    armGroup.rotation.x = (Math.random() - 0.5) * 0.4;
    anchorGroup.add(armGroup);
    meshes.anchorArms.push(armGroup);
  }

  // 5D. Gravitational wave ripple rings
  for (let w = 0; w < 5; w++) {
    const gwR = 6 + w * 2.5;
    const gwGeo = new THREE.RingGeometry(gwR - 0.04, gwR + 0.04, 96);
    const gwMat = ghostMat(0x88ccff, 0.06);
    const gw = new THREE.Mesh(gwGeo, gwMat);
    gw.rotation.x = Math.PI / 2;
    gw.userData = { baseRadius: gwR, waveIdx: w };
    anchorGroup.add(gw);
    meshes.gravWaveRipples.push(gw);
  }

  // 5E. Anchor control station (operator cabin)
  const cabinGroup = new THREE.Group();
  // Hull
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-0.4, -0.25);
  cabinShape.lineTo(0.4, -0.25);
  cabinShape.quadraticCurveTo(0.5, 0, 0.4, 0.25);
  cabinShape.lineTo(-0.4, 0.25);
  cabinShape.quadraticCurveTo(-0.5, 0, -0.4, -0.25);
  const cabinExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4 };
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrudeSettings);
  const cabin = new THREE.Mesh(cabinGeo, darkSteel);
  cabin.position.set(0, 2.2, 0);
  cabinGroup.add(cabin);

  // Tinted viewport glass
  const viewGeo = new THREE.PlaneGeometry(0.6, 0.3);
  const viewport = new THREE.Mesh(viewGeo, tinted);
  viewport.position.set(0, 2.2, 0.54);
  cabinGroup.add(viewport);

  // Console screens (glowing)
  for (let sc = 0; sc < 3; sc++) {
    const scrGeo = new THREE.PlaneGeometry(0.12, 0.08);
    const scrMat = emissiveMat(0x00ff88, 1.8);
    const scr = new THREE.Mesh(scrGeo, scrMat);
    scr.position.set(-0.18 + sc * 0.18, 2.1, 0.50);
    cabinGroup.add(scr);
    meshes.pulseCores.push(scr);
  }

  // Joystick
  const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.02, 8), steel);
  joyBase.position.set(0.15, 2.05, 0.35);
  cabinGroup.add(joyBase);
  const joyStick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6), rubber);
  joyStick.position.set(0.15, 2.09, 0.35);
  cabinGroup.add(joyStick);
  const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), plasmaPink);
  joyKnob.position.set(0.15, 2.13, 0.35);
  cabinGroup.add(joyKnob);

  // Antenna array
  for (let ant = 0; ant < 4; ant++) {
    const antGeo = new THREE.CylinderGeometry(0.006, 0.003, 0.6, 4);
    const antenna = new THREE.Mesh(antGeo, aluminum);
    antenna.position.set(-0.2 + ant * 0.13, 2.55, 0.25);
    antenna.rotation.z = (ant - 1.5) * 0.12;
    cabinGroup.add(antenna);
    // Tip bead
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), cosmicBlue);
    bead.position.set(-0.2 + ant * 0.13, 2.85, 0.25);
    cabinGroup.add(bead);
    meshes.pulseCores.push(bead);
  }

  anchorGroup.add(cabinGroup);

  // 5F. Access ladder
  for (let step = 0; step < 10; step++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), aluminum);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0.0, 1.1 + step * 0.1, 0.52);
    anchorGroup.add(rung);
  }
  // Ladder rails
  for (let side = -1; side <= 1; side += 2) {
    const railGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.1, 4);
    const rail = new THREE.Mesh(railGeo, aluminum);
    rail.position.set(side * 0.15, 1.6, 0.52);
    anchorGroup.add(rail);
  }

  // 5G. Exhaust vents
  for (let ev = 0; ev < 6; ev++) {
    const ventAngle = (ev / 6) * Math.PI * 2;
    const ventGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 8, 1, true);
    const vent = new THREE.Mesh(ventGeo, darkSteel);
    vent.position.set(Math.cos(ventAngle) * 1.5, -1.4, Math.sin(ventAngle) * 1.5);
    anchorGroup.add(vent);
    // Exhaust glow
    const exGeo = new THREE.SphereGeometry(0.10, 8, 8);
    const ex = new THREE.Mesh(exGeo, darkEnergyRed.clone());
    ex.position.set(Math.cos(ventAngle) * 1.5, -1.65, Math.sin(ventAngle) * 1.5);
    anchorGroup.add(ex);
    meshes.pulseCores.push(ex);
  }

  // 5H. Grille panels on anchor body
  for (let gp = 0; gp < 8; gp++) {
    const gpAngle = (gp / 8) * Math.PI * 2;
    const grilleGeo = new THREE.PlaneGeometry(0.35, 0.6);
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x222233, metalness: 0.9, roughness: 0.2,
      transparent: true, opacity: 0.8, side: THREE.DoubleSide,
    });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.set(Math.cos(gpAngle) * 1.25, -0.6, Math.sin(gpAngle) * 1.25);
    grille.lookAt(0, -0.6, 0);
    anchorGroup.add(grille);
    // Grille slats
    for (let sl = 0; sl < 5; sl++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, 0.015, 0.01),
        steel
      );
      slat.position.set(
        Math.cos(gpAngle) * 1.26,
        -0.4 + sl * 0.12,
        Math.sin(gpAngle) * 1.26,
      );
      slat.lookAt(0, -0.4 + sl * 0.12, 0);
      anchorGroup.add(slat);
    }
  }

  meshes.anchorCore = anchorGroup;
  group.add(anchorGroup);

  // ========================================================================
  // 6. NEUTRINO DETECTION STREAMS
  // ========================================================================
  for (let ns = 0; ns < 6; ns++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = (Math.random() - 0.5) * Math.PI;
    const dir = new THREE.Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi),
    );
    const streamPts = [];
    for (let p = 0; p < 40; p++) {
      const t = p / 40;
      streamPts.push(dir.clone().multiplyScalar(4 + t * 22).add(
        new THREE.Vector3(Math.sin(t * 20) * 0.3, Math.cos(t * 15) * 0.3, Math.sin(t * 12 + ns) * 0.3)
      ));
    }
    const streamCurve = new THREE.CatmullRomCurve3(streamPts);
    const streamGeo = new THREE.TubeGeometry(streamCurve, 60, 0.02, 4, false);
    const stream = new THREE.Mesh(streamGeo, neutrinoGreen.clone());
    stream.material.opacity = 0.35;
    group.add(stream);
    meshes.neutrinoStreams.push(stream);
  }

  // ========================================================================
  // 7. DARK FLOW DIRECTIONAL ARROWS (bulk flow vectors)
  // ========================================================================
  for (let df = 0; df < 10; df++) {
    const arrowGroup = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.5, 6),
      cosmicViolet.clone()
    );
    shaft.material.opacity = 0.4;
    shaft.material.transparent = true;
    shaft.rotation.z = Math.PI / 2;
    arrowGroup.add(shaft);
    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.3, 8),
      cosmicViolet.clone()
    );
    head.material.opacity = 0.5;
    head.material.transparent = true;
    head.rotation.z = -Math.PI / 2;
    head.position.x = 1.4;
    arrowGroup.add(head);
    arrowGroup.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 40,
    );
    arrowGroup.lookAt(
      arrowGroup.position.x + (Math.random() - 0.5),
      arrowGroup.position.y + (Math.random() - 0.5),
      arrowGroup.position.z + (Math.random() - 0.5),
    );
    group.add(arrowGroup);
    meshes.darkFlowArrows.push(arrowGroup);
  }

  // ========================================================================
  // 8. ADDITIONAL MEGASTRUCTURE DETAIL — Gyroscopic stabilisation torus
  // ========================================================================
  const gyroGroup = new THREE.Group();
  for (let gi = 0; gi < 3; gi++) {
    const gR = 3.5 + gi * 0.6;
    const gGeo = new THREE.TorusGeometry(gR, 0.04, 8, 100);
    const gMesh = new THREE.Mesh(gGeo, anchorChrome);
    gMesh.rotation.x = gi * Math.PI / 3;
    gMesh.rotation.z = gi * 0.5;
    gyroGroup.add(gMesh);
    meshes.anchorRings.push(gMesh);
  }
  anchorGroup.add(gyroGroup);

  // ========================================================================
  // 9. INTRACLUSTER MEDIUM — Hot gas clouds at major nodes
  // ========================================================================
  filamentNodes.forEach((node, idx) => {
    if (idx > 6) return; // Only major nodes
    const icmGeo = new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 16, 16);
    const icmMat = ghostMat(0xff6633, 0.07);
    const icm = new THREE.Mesh(icmGeo, icmMat);
    icm.position.copy(node.pos);
    group.add(icm);
  });

  // ========================================================================
  // 10. EXTRACTOR BEAM VISUALIZATIONS (energy siphon from dark matter)
  // ========================================================================
  for (let eb = 0; eb < 8; eb++) {
    const beamAngle = (eb / 8) * Math.PI * 2;
    const beamEnd = new THREE.Vector3(
      Math.cos(beamAngle) * 9, 0, Math.sin(beamAngle) * 9
    );
    const beamCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        Math.cos(beamAngle) * 4.5,
        1.5 * Math.sin(eb),
        Math.sin(beamAngle) * 4.5,
      ),
      beamEnd
    );
    const beamGeo = new THREE.TubeGeometry(beamCurve, 30, 0.04, 6, false);
    const beamMat = emissiveMat(0x00ffcc, 1.0);
    beamMat.transparent = true;
    beamMat.opacity = 0.3;
    const beam = new THREE.Mesh(beamGeo, beamMat);
    group.add(beam);
    meshes.extractorBeams.push(beam);
  }

  // ========================================================================
  // 11. PRESS-SCHECHTER MASS FUNCTION VISUALIZATION — Halo mass distribution
  // ========================================================================
  // Scatter small dark matter sub-halos throughout the volume
  for (let sh = 0; sh < 60; sh++) {
    const mass = Math.random(); // 0 = small, 1 = large
    const haloR = 0.08 + mass * 0.35;
    const shGeo = new THREE.SphereGeometry(haloR, 8, 8);
    const shMat = ghostMat(0x4422aa, 0.06 + mass * 0.04);
    const subHalo = new THREE.Mesh(shGeo, shMat);
    subHalo.position.set(
      (Math.random() - 0.5) * 48,
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 48,
    );
    group.add(subHalo);
    meshes.darkMatterHalos.push(subHalo);
  }

  // ========================================================================
  // 12. TOPOLOGICAL DEFECT MARKERS (cosmic strings)
  // ========================================================================
  for (let cs = 0; cs < 3; cs++) {
    const csPts = [];
    const csStart = new THREE.Vector3((Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*30);
    for (let cp = 0; cp < 20; cp++) {
      csPts.push(csStart.clone().add(new THREE.Vector3(
        cp * 2.5 * (Math.random()-0.5),
        cp * 2.0 * (Math.random()-0.5),
        cp * 2.2 * (Math.random()-0.5),
      )));
    }
    const csCurve = new THREE.CatmullRomCurve3(csPts);
    const csGeo = new THREE.TubeGeometry(csCurve, 40, 0.015, 4, false);
    const csMat = emissiveMat(0xff00ff, 1.5);
    csMat.transparent = true; csMat.opacity = 0.25;
    const csLine = new THREE.Mesh(csGeo, csMat);
    group.add(csLine);
  }

  // ========================================================================
  // PARTS DEFINITION (15+ parts)
  // ========================================================================
  const parts = [
    {
      name: 'Cosmic Web Filaments',
      description: 'Baryonic matter strands tracing the underlying dark matter skeleton of the cosmic web, spanning tens of megaparsecs.',
      material: 'Baryonic plasma & neutral hydrogen',
      function: 'Channels mass flow between galaxy cluster nodes along gravitational potential valleys.',
      assemblyOrder: 1,
      connections: ['Dark Matter Sheaths', 'Galaxy Cluster Nodes'],
      failureEffect: 'Disruption of intergalactic mass transport; starvation of galaxy formation at nodes.',
      cascadeFailures: ['Galaxy Cluster Nodes', 'Intracluster Medium'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Dark Matter Sheaths',
      description: 'Collisionless cold dark matter halos ensheathing each baryonic filament, providing the gravitational scaffolding.',
      material: 'Cold dark matter (WIMP/axion candidates)',
      function: 'Generates the gravitational potential wells that guide baryonic matter accretion.',
      assemblyOrder: 0,
      connections: ['Cosmic Web Filaments', 'Sub-Halo Population'],
      failureEffect: 'Complete structural collapse of the cosmic web; baryonic matter disperses into uniform IGM.',
      cascadeFailures: ['Cosmic Web Filaments', 'Galaxy Cluster Nodes', 'Gravitational Lensing Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 },
    },
    {
      name: 'Galaxy Cluster Nodes',
      description: 'Massive galaxy clusters (10^14–10^15 M☉) at filament intersections, containing hundreds of galaxies.',
      material: 'Galaxies, hot ICM plasma (10^7–10^8 K), dark matter',
      function: 'Gravitational nexus points where filaments converge; primary energy harvesting sites for the anchor.',
      assemblyOrder: 2,
      connections: ['Cosmic Web Filaments', 'Intracluster Medium', 'Satellite Galaxies'],
      failureEffect: 'Loss of primary dark-matter flow convergence; anchor loses power source.',
      cascadeFailures: ['Anchor Singularity Core', 'Extractor Arms'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 10, y: 0, z: 10 },
    },
    {
      name: 'Gravitational Lensing Rings',
      description: 'Einstein ring arcs formed by strong gravitational lensing around massive cluster cores.',
      material: 'Photon trajectories in curved spacetime',
      function: 'Diagnostic tool for mapping dark matter distribution and calibrating anchor extraction rate.',
      assemblyOrder: 3,
      connections: ['Galaxy Cluster Nodes', 'Dark Matter Sheaths'],
      failureEffect: 'Loss of dark matter density mapping; anchor operates blind.',
      cascadeFailures: ['Anchor Control Station'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 5, z: 0 },
    },
    {
      name: 'Anchor Singularity Core',
      description: 'Quadruple-nested icosahedral containment shells housing a stabilised micro-singularity for dark energy conversion.',
      material: 'Exotic matter / negative energy density metamaterial',
      function: 'Converts harvested dark matter annihilation energy into usable power via Penrose process analogue.',
      assemblyOrder: 5,
      connections: ['Extractor Arms', 'Dark Energy Collector Rings', 'Control Station'],
      failureEffect: 'Uncontrolled singularity evaporation — catastrophic Hawking radiation burst.',
      cascadeFailures: ['Dark Energy Collector Rings', 'Gyroscopic Stabilisers', 'Control Station'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 },
    },
    {
      name: 'Dark Energy Collector Rings',
      description: 'Four nested superconducting toroidal rings that harness dark energy pressure gradients.',
      material: 'Room-temperature superconductor / strange quark alloy',
      function: 'Maintains the de Sitter vacuum state interface required for energy extraction from the cosmological constant.',
      assemblyOrder: 4,
      connections: ['Anchor Singularity Core', 'Extractor Arms'],
      failureEffect: 'Vacuum decay bubble nucleation risk; immediate emergency shutdown required.',
      cascadeFailures: ['Anchor Singularity Core', 'BAO Reference Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -10, z: 0 },
    },
    {
      name: 'Extractor Arms',
      description: 'Eight articulated radial arms with hydraulic pistons and dark matter siphon emitters at tips.',
      material: 'Neutronium-reinforced chrome alloy with copper coolant conduits',
      function: 'Extends into dark matter filament flow to capture and channel DM particles toward singularity core.',
      assemblyOrder: 6,
      connections: ['Anchor Singularity Core', 'Coolant Conduits', 'Dark Matter Sheaths'],
      failureEffect: 'Reduced extraction rate; asymmetric loading causes anchor drift.',
      cascadeFailures: ['Gyroscopic Stabilisers'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 15, y: 0, z: 0 },
    },
    {
      name: 'Coolant Conduits',
      description: 'Dual-loop copper and neutrino-cooled conduit network running along each extractor arm.',
      material: 'Copper primary loop / neutrino-transparent ceramic secondary',
      function: 'Dissipates extreme heat from dark matter annihilation at arm tips; prevents thermal runaway.',
      assemblyOrder: 7,
      connections: ['Extractor Arms', 'Exhaust Vents'],
      failureEffect: 'Thermal overload; arm tip emitter melts within milliseconds.',
      cascadeFailures: ['Extractor Arms'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 4, z: 0 },
    },
    {
      name: 'Gyroscopic Stabilisers',
      description: 'Triple-axis chrome stabilisation tori preventing precession from tidal forces.',
      material: 'Chrome-vanadium superalloy',
      function: 'Counteracts differential gravitational torques from surrounding filament mass distribution.',
      assemblyOrder: 8,
      connections: ['Anchor Singularity Core', 'Dark Energy Collector Rings'],
      failureEffect: 'Uncontrolled tumble; extraction beams lose alignment with filaments.',
      cascadeFailures: ['Extractor Arms', 'Control Station'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 8 },
    },
    {
      name: 'Anchor Control Station',
      description: 'Pressurised operator cabin with tinted viewport, triple console screens, joystick, and antenna array.',
      material: 'Dark steel hull / tinted borosilicate viewport / rubber-insulated controls',
      function: 'Human-in-the-loop oversight for anchor operations; manages extraction rates and emergency protocols.',
      assemblyOrder: 9,
      connections: ['Anchor Singularity Core', 'Antenna Array'],
      failureEffect: 'Loss of manual override capability; anchor reverts to autonomous mode.',
      cascadeFailures: ['Antenna Array'],
      originalPosition: { x: 0, y: 2.2, z: 0 },
      explodedPosition: { x: 0, y: 18, z: 0 },
    },
    {
      name: 'Antenna Array',
      description: 'Quad high-gain antenna with cosmological-blue tip beacons for superluminal entanglement communication.',
      material: 'Aluminum mast / quantum-entangled crystal tips',
      function: 'Maintains real-time communication with other cosmic web anchors across the Hubble volume.',
      assemblyOrder: 10,
      connections: ['Anchor Control Station'],
      failureEffect: 'Isolation from anchor network; cannot coordinate multi-node extraction.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 2.8, z: 0 },
      explodedPosition: { x: 0, y: 22, z: 0 },
    },
    {
      name: 'Exhaust Vents',
      description: 'Six circumferential exhaust ports venting waste Hawking radiation and thermal plasma.',
      material: 'Dark steel with refractory ceramic lining',
      function: 'Prevents internal pressure build-up from dark matter annihilation by-products.',
      assemblyOrder: 11,
      connections: ['Coolant Conduits', 'Anchor Singularity Core'],
      failureEffect: 'Internal overpressure; risk of containment shell breach.',
      cascadeFailures: ['Anchor Singularity Core', 'Coolant Conduits'],
      originalPosition: { x: 0, y: -1.4, z: 0 },
      explodedPosition: { x: 0, y: -14, z: 0 },
    },
    {
      name: 'BAO Reference Rings',
      description: 'Three large-scale baryon acoustic oscillation calibration rings serving as cosmic rulers.',
      material: 'Photonic lattice / coherent baryon-photon fluid markers',
      function: 'Provides absolute distance calibration using the ~150 Mpc BAO scale for anchor positioning.',
      assemblyOrder: 12,
      connections: ['Cosmic Web Filaments', 'Dark Energy Collector Rings'],
      failureEffect: 'Loss of cosmological distance reference; anchor position uncertainty increases.',
      cascadeFailures: ['Gravitational Lensing Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 20 },
    },
    {
      name: 'Neutrino Detection Streams',
      description: 'Six helical neutrino flux monitors tracing cosmic neutrino background directionality.',
      material: 'Gadolinium-doped scintillator filament',
      function: 'Maps the cosmic neutrino background to infer dark matter density gradients for optimal extraction.',
      assemblyOrder: 13,
      connections: ['Anchor Control Station', 'Extractor Arms'],
      failureEffect: 'Blind to neutrino wind direction; sub-optimal extraction alignment.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 20, y: 10, z: 0 },
    },
    {
      name: 'Sub-Halo Population',
      description: 'Sixty scattered CDM sub-halos following the Press-Schechter mass function distribution.',
      material: 'Cold dark matter (hierarchical structure)',
      function: 'Provides distributed gravitational micro-lensing data for high-resolution dark matter mapping.',
      assemblyOrder: 14,
      connections: ['Dark Matter Sheaths', 'Gravitational Lensing Rings'],
      failureEffect: 'Loss of fine-grained DM density maps; extraction becomes coarse.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -15, y: -10, z: 15 },
    },
    {
      name: 'Satellite Galaxies',
      description: 'Orbiting dwarf and satellite galaxies gravitationally bound to each cluster node.',
      material: 'Stellar populations, gas, dark matter sub-halos',
      function: 'Dynamic tracers of the cluster potential well; used to calibrate virial mass estimates.',
      assemblyOrder: 15,
      connections: ['Galaxy Cluster Nodes', 'Dark Matter Sheaths'],
      failureEffect: 'Loss of dynamical mass estimators; anchor power budget becomes uncertain.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 8, z: -12 },
    },
    {
      name: 'Cosmic String Defects',
      description: 'Topological defect remnants from symmetry-breaking phase transitions in the early universe.',
      material: 'GUT-scale vacuum energy linear defect',
      function: 'Secondary energy source; cosmic string tension provides harvestable gravitational wave energy.',
      assemblyOrder: 16,
      connections: ['Gravitational Wave Ripples', 'Dark Energy Collector Rings'],
      failureEffect: 'Loss of supplementary power; anchor efficiency drops 12%.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -20, y: 0, z: -15 },
    },
    {
      name: 'Gravitational Wave Ripples',
      description: 'Five concentric spacetime ripple rings from merger events detected by the anchor.',
      material: 'Spacetime metric perturbation (h+ and h× polarisations)',
      function: 'Harvests gravitational wave energy from nearby cluster mergers to supplement dark matter extraction.',
      assemblyOrder: 17,
      connections: ['Anchor Singularity Core', 'Cosmic String Defects'],
      failureEffect: 'Undetected merger events; missed energy harvesting windows.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -18, z: 0 },
    },
  ];

  // ========================================================================
  // QUIZ QUESTIONS (PhD-level cosmology)
  // ========================================================================
  const quizQuestions = [
    {
      question: 'In the context of baryon acoustic oscillations (BAO), what physical process imprints the ~150 Mpc comoving scale in the galaxy correlation function, and why does this scale serve as a "standard ruler"?',
      options: [
        'Sound waves in the baryon-photon fluid before recombination froze at the sound horizon; the scale is set by known physics (sound speed × age) making it a fixed comoving length.',
        'Dark matter self-annihilation at z ≈ 1100 created density peaks separated by the Jeans length of the dark matter fluid.',
        'Silk damping erased all fluctuations below 150 Mpc, leaving only the largest-scale perturbations.',
        'Cosmic inflation produced a preferred wavelength at exactly 150 Mpc through resonant particle production.',
      ],
      correctAnswer: 0,
      explanation: 'BAO arise from acoustic oscillations in the coupled baryon-photon plasma before recombination (z ≈ 1100). Sound waves propagated outward from initial overdensities at cs ≈ c/√3. At decoupling, the waves froze, imprinting a characteristic scale — the sound horizon rs ≈ 150 Mpc (comoving). Because rs is calculable from well-understood physics (baryon density, radiation density, recombination epoch), it serves as an absolute standard ruler for measuring the expansion history H(z) and angular diameter distance dA(z).',
    },
    {
      question: 'The Press-Schechter (1974) formalism predicts the comoving number density of dark matter halos as a function of mass. What is the key physical assumption, and what major correction does the Sheth-Tormen (1999) ellipsoidal collapse model introduce?',
      options: [
        'Press-Schechter assumes Gaussian random field + spherical top-hat collapse with a universal barrier δc ≈ 1.686; Sheth-Tormen introduces a moving (mass-dependent) ellipsoidal barrier that better reproduces N-body halo mass functions at both low and high masses.',
        'Press-Schechter uses the Zel\'dovich approximation; Sheth-Tormen replaces it with full relativistic perturbation theory.',
        'Press-Schechter assumes all halos form at z = 0; Sheth-Tormen adds a merger tree to track formation over time.',
        'Press-Schechter ignores baryonic physics; Sheth-Tormen adds hydrodynamic corrections to halo masses.',
      ],
      correctAnswer: 0,
      explanation: 'Press-Schechter theory smooths the linear density field with a top-hat window and counts regions exceeding the spherical collapse threshold δc ≈ 1.686 (for EdS). The famous "fudge factor of 2" accounts for the cloud-in-cloud problem. Sheth & Tormen (1999, 2001) generalised this to ellipsoidal collapse where the barrier becomes δec(σ) = √(a)δc[1 + b(σ²/aδc²)^c], with a ≈ 0.707, b ≈ 0.485, c ≈ 0.615. This moving barrier naturally produces more massive halos (via easier collapse along one axis) and fewer low-mass halos, matching N-body simulations far better than the original PS prediction.',
    },
    {
      question: 'The cosmic web exhibits a distinct topology described by Morse theory. What are the four types of critical points of the density field, and how do they map to cosmic web elements (clusters, filaments, walls, voids)?',
      options: [
        'Maxima → clusters (index 3); 2-saddles → filaments (index 2); 1-saddles → walls/sheets (index 1); minima → voids (index 0). The Euler characteristic relates their counts via χ = N₃ − N₂ + N₁ − N₀.',
        'Maxima → voids; minima → clusters; saddle points are all filaments; inflection points are walls.',
        'There are only two types: overdense (clusters + filaments) and underdense (walls + voids).',
        'Critical points are irrelevant; the cosmic web is entirely described by the two-point correlation function ξ(r).',
      ],
      correctAnswer: 0,
      explanation: 'In the Morse-theoretic description of the cosmic density field ρ(x), critical points where ∇ρ = 0 are classified by the number of negative eigenvalues of the Hessian (the index). Index-3 points (all eigenvalues negative → local maxima) correspond to clusters. Index-2 saddles (two negative eigenvalues) are filament-type saddles connecting clusters. Index-1 saddles (one negative eigenvalue) correspond to wall/sheet-type saddles. Index-0 points (all eigenvalues positive → local minima) are void centres. The integral lines of ∇ρ connecting critical points define the "cosmic skeleton" (Sousbie et al. 2011). The alternating-sign Euler relation χ = N₃ − N₂ + N₁ − N₀ provides a topological constraint on the web.',
    },
    {
      question: 'NFW (Navarro-Frenk-White) profiles describe dark matter halo density as ρ(r) = ρs / [(r/rs)(1 + r/rs)²]. What is the physical origin of the inner cusp (ρ ∝ r⁻¹), and what observational tension does it create with rotation curves of low-surface-brightness (LSB) galaxies?',
      options: [
        'The r⁻¹ cusp arises from violent relaxation and radial orbit instability during hierarchical merging in CDM simulations; LSB galaxy rotation curves favor constant-density cores (ρ ∝ r⁰), creating the "cusp-core problem" that may require baryonic feedback or self-interacting dark matter to resolve.',
        'The cusp is produced by adiabatic contraction of baryons; LSB galaxies lack baryons so no cusp forms.',
        'NFW cusps are numerical artifacts of insufficient resolution; higher-resolution simulations produce cores.',
        'The cusp arises from dark matter annihilation heating the centre; LSB galaxies have too little dark matter to annihilate.',
      ],
      correctAnswer: 0,
      explanation: 'N-body simulations of collisionless CDM consistently produce halos with inner density cusps ρ ∝ r^−α with α ≈ 1 (NFW) to α ≈ 1.5 (Moore et al.). This arises from the hierarchical assembly process — violent relaxation during mergers and the persistence of radial orbits produce a universal cuspy profile. However, observed rotation curves of dark-matter-dominated low-surface-brightness (LSB) and dwarf galaxies often prefer constant-density cores (α ≈ 0), the so-called "cusp-core problem" (de Blok 2010). Proposed solutions include: (1) baryonic feedback (supernovae-driven gas outflows that fluctuate the potential and flatten cusps), (2) self-interacting dark matter (SIDM with σ/m ∼ 1 cm²/g), (3) fuzzy dark matter (ultra-light axions with de Broglie wavelength ∼ kpc). The debate remains one of the key small-scale challenges to ΛCDM.',
    },
    {
      question: 'Gravitational lensing by a cosmic web filament produces a distinctive anisotropic signal different from spherical cluster lensing. How does the filament shear pattern differ from a point-mass lens, and what recent observational techniques have detected filament lensing?',
      options: [
        'Filaments produce a quadrupolar shear pattern elongated perpendicular to the filament axis (unlike the tangential-only pattern of a spherical lens); stacking thousands of filament candidates between SDSS luminous red galaxy pairs has yielded ~5σ detections of the excess surface mass density Δ Σ ~ 5–15 M☉/pc².',
        'Filament lensing is identical to cluster lensing but weaker; it has never been detected.',
        'Filaments produce purely radial shear (convergence-only); detected via CMB temperature anisotropies.',
        'Filaments do not lens light because they are too diffuse; only clusters produce measurable lensing.',
      ],
      correctAnswer: 0,
      explanation: 'Unlike the azimuthally symmetric tangential shear produced by a spherical mass (γt ∝ ΔΣ/Σcrit), a filament (approximated as a cylinder of surface mass density) produces an anisotropic shear field with a quadrupolar pattern — the shear is strongest perpendicular to the filament axis and has a characteristic cos(2φ) angular dependence. Because individual filaments have very low surface mass density (Σ ~ 1–20 M☉/pc²), detection requires stacking. Pioneering detections include: (1) Clampitt et al. (2016) stacked ~135,000 SDSS LRG pairs to detect filament lensing at ~4σ; (2) de Graaff et al. (2019) used KiDS lensing + GAMA spectroscopy to measure filament masses; (3) Weak lensing mass maps from Hyper Suprime-Cam have directly visualised filamentary structures. The Sunyaev-Zel\'dovich effect (tSZ) from warm-hot intergalactic medium (WHIM) in filaments provides complementary confirmation (Tanimura et al. 2019, Planck stacking).',
    },
  ];

  // ========================================================================
  // DESCRIPTION
  // ========================================================================
  const description = `Cosmic Web Anchor — Ultra God Tier Megastructure

A civilisation-scale engineering marvel anchored directly to a filament of the cosmic web, the large-scale structure of the universe. The anchor taps into the flow of dark matter and baryonic matter along intergalactic filaments spanning tens of megaparsecs.

Key Systems:
• Baryonic filament cores with dark matter sheaths tracing the cosmic skeleton
• Galaxy cluster nodes at filament intersections with orbiting satellite galaxies
• Einstein-ring gravitational lensing diagnostics around massive nodes
• Quadruple-shell singularity containment core for dark matter annihilation energy conversion
• Eight articulated extractor arms with hydraulic pistons siphoning dark matter flow
• Nested dark energy collector toroidal rings interfacing with the cosmological constant
• BAO reference rings providing 150 Mpc comoving standard ruler calibration
• Neutrino detection streams mapping the CνB for density gradient inference
• Gyroscopic stabilisation tori counteracting tidal torques
• Operator control station with tinted viewport, console screens, and entanglement antenna array
• Gravitational wave ripple rings harvesting merger energy
• Press-Schechter sub-halo population for micro-lensing dark matter mapping
• Cosmic string topological defects as secondary energy sources
• Dark flow directional arrows showing bulk peculiar velocity fields`;

  // ========================================================================
  // ANIMATE — Rich, highly synchronized cosmological animation
  // ========================================================================
  function animate(time, speed) {
    const t = time * 0.001 * speed;

    // 1. Matter flowing along filaments
    meshes.matterFlowParticles.forEach(p => {
      if (p.userData.curve) {
        p.userData.t += p.userData.speed * speed;
        if (p.userData.t > 1) p.userData.t -= 1;
        if (p.userData.t < 0) p.userData.t += 1;
        const pt = p.userData.curve.getPoint(p.userData.t);
        p.position.copy(pt);
        // Brightness pulsation
        if (p.material && p.material.emissiveIntensity !== undefined) {
          p.material.emissiveIntensity = 0.5 + Math.sin(t * 3 + p.userData.t * 10) * 0.4;
        }
      }
    });

    // 2. Filament shimmer
    meshes.filaments.forEach((f, i) => {
      if (f.material) {
        f.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5 + i) * 0.25;
      }
    });

    // 3. Galaxy cluster core pulsation
    meshes.galaxyClusters.forEach((gc, i) => {
      const pulse = 1.0 + Math.sin(t * 2 + i * 1.5) * 0.08;
      gc.scale.set(pulse, pulse, pulse);
      if (gc.material) {
        gc.material.emissiveIntensity = 0.8 + Math.sin(t * 3 + i) * 0.5;
      }
    });

    // 4. Satellite galaxy orbits
    meshes.galaxyOrbits.forEach(sat => {
      const ud = sat.userData;
      ud.angle += ud.speed * speed;
      const r = ud.orbitRadius;
      const inc = ud.inclination;
      sat.position.set(
        Math.cos(ud.angle) * Math.cos(inc) * r,
        Math.sin(inc) * r * (1 + Math.sin(ud.angle * 0.3) * 0.1),
        Math.sin(ud.angle) * Math.cos(inc) * r,
      );
    });

    // 5. Dark matter halo breathing
    meshes.darkMatterHalos.forEach((h, i) => {
      const breathe = 1.0 + Math.sin(t * 0.8 + i * 0.5) * 0.05;
      h.scale.set(breathe, breathe, breathe);
      if (h.material) {
        h.material.opacity = 0.08 + Math.sin(t + i) * 0.03;
      }
    });

    // 6. Lensing ring shimmer and slow rotation
    meshes.lensingRings.forEach((lr, i) => {
      lr.rotation.z += 0.002 * speed;
      lr.rotation.x += 0.001 * speed * (i % 2 === 0 ? 1 : -1);
      if (lr.material) {
        lr.material.opacity = 0.15 + Math.sin(t * 2.5 + i * 2) * 0.08;
      }
    });

    // 7. Anchor core shell counter-rotation and pulse
    meshes.pulseCores.forEach((pc, i) => {
      if (pc.userData && pc.userData.shellIndex !== undefined) {
        const dir = pc.userData.shellIndex % 2 === 0 ? 1 : -1;
        pc.rotation.y += 0.01 * dir * speed;
        pc.rotation.x += 0.005 * dir * speed;
        const scale = 1.0 + Math.sin(t * 4 + pc.userData.shellIndex * Math.PI / 2) * 0.06;
        pc.scale.set(scale, scale, scale);
      }
      // Generic pulse for screens, vents, beads
      if (pc.material && pc.material.emissiveIntensity !== undefined) {
        pc.material.emissiveIntensity = 1.0 + Math.sin(t * 5 + i * 0.7) * 0.8;
      }
    });

    // 8. Singularity shell slow rotation
    if (meshes.singularityShell) {
      meshes.singularityShell.rotation.y += 0.003 * speed;
      meshes.singularityShell.rotation.z += 0.002 * speed;
    }

    // 9. Anchor rings — differential precession
    meshes.anchorRings.forEach((ring, i) => {
      ring.rotation.y += (0.005 + i * 0.003) * speed;
      ring.rotation.z += (0.002 - i * 0.001) * speed;
    });

    // 10. Extractor arms gentle oscillation
    meshes.anchorArms.forEach((arm, i) => {
      arm.rotation.x = (Math.random() > 0.99 ? 0 : arm.rotation.x) +
        Math.sin(t * 1.2 + i * Math.PI / 4) * 0.002;
    });

    // 11. Extractor beam piston extension
    meshes.extractorBeams.forEach((eb, i) => {
      if (eb.userData && eb.userData.armIndex !== undefined) {
        eb.position.x = eb.position.x + Math.sin(t * 2 + eb.userData.armIndex) * 0.002;
      }
      // Beam opacity pulse
      if (eb.material && eb.material.opacity !== undefined) {
        eb.material.opacity = 0.2 + Math.sin(t * 3 + i) * 0.12;
      }
    });

    // 12. BAO rings slow expansion/contraction (acoustic oscillation metaphor)
    meshes.baoRings.forEach((bao, i) => {
      const s = 1.0 + Math.sin(t * 0.3 + i * 2) * 0.015;
      bao.scale.set(s, s, s);
      if (bao.material) {
        bao.material.opacity = 0.06 + Math.sin(t * 0.5 + i) * 0.03;
      }
    });

    // 13. Gravitational wave ripples expanding outward
    meshes.gravWaveRipples.forEach((gw, i) => {
      if (gw.userData) {
        const expansion = 1.0 + Math.sin(t * 1.5 + i * 1.2) * 0.08;
        gw.scale.set(expansion, expansion, expansion);
        if (gw.material) {
          gw.material.opacity = 0.04 + Math.sin(t * 2 + i) * 0.03;
        }
      }
    });

    // 14. Void sphere subtle throb
    meshes.voidSpheres.forEach((v, i) => {
      const vScale = 1.0 + Math.sin(t * 0.6 + i * 3) * 0.03;
      v.scale.set(vScale, vScale, vScale);
    });

    // 15. Neutrino stream opacity wave
    meshes.neutrinoStreams.forEach((ns, i) => {
      if (ns.material) {
        ns.material.opacity = 0.25 + Math.sin(t * 4 + i * 2) * 0.15;
        ns.material.emissiveIntensity = 0.6 + Math.sin(t * 3 + i) * 0.35;
      }
    });

    // 16. Dark flow arrows drift
    meshes.darkFlowArrows.forEach((da, i) => {
      da.position.x += Math.sin(t * 0.2 + i) * 0.003 * speed;
      da.position.y += Math.cos(t * 0.15 + i) * 0.002 * speed;
      da.position.z += Math.sin(t * 0.18 + i * 0.5) * 0.003 * speed;
    });

    // 17. Entire anchor slow majestic rotation
    if (meshes.anchorCore) {
      meshes.anchorCore.rotation.y += 0.001 * speed;
    }
  }

  // ========================================================================
  // RETURN
  // ========================================================================
  return { group, parts, description, quizQuestions, animate };
}
