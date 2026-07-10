// ============================================================================
// PENROSE PROCESS ENERGY SPHERE — ULTRA GOD TIER
// A megastructure surrounding a Kerr (rotating) black hole, extracting
// rotational energy via the Penrose mechanism. Features ergosphere
// visualization, matter injection/splitting trajectories, negative-energy
// fragment capture, escaping super-energetic fragments, and collection arrays.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel,
  darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

/* ─── helper: glowing / emissive materials ──────────────────────────── */
function emissiveMat(color, intensity = 2.0, base = 0x111111) {
  return new THREE.MeshStandardMaterial({
    color: base,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    metalness: 0.3,
    roughness: 0.4,
    transparent: true,
    opacity: 0.92,
  });
}
function glowMat(color, intensity = 3.5) {
  return new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
}
function hologramMat(color = 0x00ffcc, opacity = 0.18) {
  return new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(color),
    emissiveIntensity: 1.8,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    wireframe: true,
  });
}
function solidTech(color, metal = 0.85, rough = 0.25) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: metal,
    roughness: rough,
  });
}

/* ─── helper: TubeGeometry from points ──────────────────────────────── */
function tubeBetween(THREE, pts, radius = 0.03, segs = 64) {
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, segs, radius, 8, false);
}

/* ─── helper: ring of instances ─────────────────────────────────────── */
function radialClone(THREE, mesh, count, radius, yOff = 0) {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const c = mesh.clone();
    c.position.set(Math.cos(a) * radius, yOff, Math.sin(a) * radius);
    c.lookAt(0, yOff, 0);
    g.add(c);
  }
  return g;
}

// ====================================================================
//  createMachine
// ====================================================================
export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {}; // animation targets

  // ── colour palette ────────────────────────────────────────────────
  const BH_CORE     = 0x000000;
  const ERGO_COLOR  = 0x7733ff;
  const ACCRETION   = 0xff6600;
  const INJECT_COL  = 0x00ccff;
  const NEG_ENERGY  = 0xff0044;
  const POS_ENERGY  = 0x00ff88;
  const FRAME_COL   = 0x556677;
  const GRID_COL    = 0x223344;
  const COLLECTOR   = 0xffcc00;
  const NEON_CYAN   = 0x00ffee;

  // ================================================================
  //  1.  KERR BLACK HOLE — event horizon (inner sphere)
  // ================================================================
  const bhRadius = 1.6;
  const bhGeo = new THREE.SphereGeometry(bhRadius, 96, 96);
  const bhMat = new THREE.MeshStandardMaterial({
    color: BH_CORE,
    metalness: 1.0,
    roughness: 0.0,
    emissive: 0x000000,
  });
  const blackHole = new THREE.Mesh(bhGeo, bhMat);
  blackHole.name = 'kerr_event_horizon';
  group.add(blackHole);
  meshes.blackHole = blackHole;

  // Subtle Cauchy (inner) horizon glow
  const cauchyGeo = new THREE.SphereGeometry(bhRadius * 0.55, 48, 48);
  const cauchyMat = glowMat(0x4400aa, 2.0);
  const cauchy = new THREE.Mesh(cauchyGeo, cauchyMat);
  group.add(cauchy);
  meshes.cauchy = cauchy;

  // Ring singularity (the actual singularity in Kerr is a ring)
  const ringSingGeo = new THREE.TorusGeometry(bhRadius * 0.35, 0.04, 16, 120);
  const ringSingMat = glowMat(0xffffff, 6.0);
  const ringSingularity = new THREE.Mesh(ringSingGeo, ringSingMat);
  ringSingularity.rotation.x = Math.PI / 2;
  blackHole.add(ringSingularity);
  meshes.ringSingularity = ringSingularity;

  // ================================================================
  //  2.  ERGOSPHERE — oblate ellipsoid (larger at equator)
  // ================================================================
  const ergoEquatorialRadius = bhRadius * 2.0;
  const ergoPolarRadius = bhRadius * 1.25;
  const ergoGeo = new THREE.SphereGeometry(1, 80, 80);
  const ergoMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(ERGO_COLOR),
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    wireframe: false,
  });
  const ergosphere = new THREE.Mesh(ergoGeo, ergoMat);
  ergosphere.scale.set(ergoEquatorialRadius, ergoPolarRadius, ergoEquatorialRadius);
  ergosphere.name = 'ergosphere';
  group.add(ergosphere);
  meshes.ergosphere = ergosphere;

  // Ergosphere wireframe overlay
  const ergoWireGeo = new THREE.SphereGeometry(1.005, 40, 40);
  const ergoWireMat = hologramMat(ERGO_COLOR, 0.25);
  const ergoWire = new THREE.Mesh(ergoWireGeo, ergoWireMat);
  ergoWire.scale.copy(ergosphere.scale);
  group.add(ergoWire);
  meshes.ergoWire = ergoWire;

  // Static limit surface indicator rings (latitude lines)
  const staticLimitRings = new THREE.Group();
  for (let lat = -3; lat <= 3; lat++) {
    const theta = (lat / 4) * (Math.PI / 2);
    const r = ergoEquatorialRadius * Math.cos(theta);
    const y = ergoPolarRadius * Math.sin(theta);
    const ringGeo = new THREE.TorusGeometry(r, 0.015, 8, 128);
    const ringMat = glowMat(ERGO_COLOR, 1.5);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = y;
    ring.rotation.x = Math.PI / 2;
    staticLimitRings.add(ring);
  }
  group.add(staticLimitRings);
  meshes.staticLimitRings = staticLimitRings;

  // ================================================================
  //  3.  ACCRETION DISK — multi-layered torus with temperature bands
  // ================================================================
  const diskGroup = new THREE.Group();
  diskGroup.rotation.x = Math.PI * 0.04; // slight tilt
  const diskLayers = [];
  const diskColors = [0xff2200, 0xff6600, 0xffaa00, 0xffdd44, 0xffffaa];
  for (let i = 0; i < 5; i++) {
    const innerR = bhRadius * 1.8 + i * 0.45;
    const tubeR = 0.12 + i * 0.06;
    const geo = new THREE.TorusGeometry(innerR, tubeR, 24, 200);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(diskColors[i]),
      emissiveIntensity: 3.0 - i * 0.4,
      transparent: true,
      opacity: 0.65 - i * 0.08,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    diskGroup.add(mesh);
    diskLayers.push(mesh);
  }
  group.add(diskGroup);
  meshes.accretionDisk = diskGroup;
  meshes.diskLayers = diskLayers;

  // Innermost stable circular orbit (ISCO) marker
  const iscoGeo = new THREE.TorusGeometry(bhRadius * 1.55, 0.025, 8, 200);
  const iscoMat = glowMat(0xff0000, 4.0);
  const isco = new THREE.Mesh(iscoGeo, iscoMat);
  isco.rotation.x = Math.PI / 2;
  diskGroup.add(isco);
  meshes.isco = isco;

  // ================================================================
  //  4.  FRAME-DRAGGING VISUALIZATION — curved field lines
  // ================================================================
  const frameDragGroup = new THREE.Group();
  const fdCount = 14;
  for (let i = 0; i < fdCount; i++) {
    const phi0 = (i / fdCount) * Math.PI * 2;
    const pts = [];
    for (let t = 0; t <= 60; t++) {
      const frac = t / 60;
      const r = bhRadius * 1.3 + frac * 3.5;
      const twist = phi0 + frac * Math.PI * 2.5 * (1 - frac * 0.6);
      const y = (frac - 0.5) * 2.2;
      pts.push(new THREE.Vector3(
        Math.cos(twist) * r,
        y,
        Math.sin(twist) * r
      ));
    }
    const tubeGeo = tubeBetween(THREE, pts, 0.018, 80);
    const tubeMat = glowMat(ERGO_COLOR, 0.8 + Math.random() * 0.6);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    frameDragGroup.add(tube);
  }
  group.add(frameDragGroup);
  meshes.frameDrag = frameDragGroup;

  // ================================================================
  //  5.  MATTER INJECTION SYSTEM — injection arms with nozzles
  // ================================================================
  const injectorGroup = new THREE.Group();
  const injectorCount = 6;
  const injectorArms = [];
  for (let i = 0; i < injectorCount; i++) {
    const angle = (i / injectorCount) * Math.PI * 2;
    const armGroup = new THREE.Group();

    // Main arm strut (tapered CylinderGeometry)
    const armLen = 6.5;
    const armGeo = new THREE.CylinderGeometry(0.12, 0.08, armLen, 16);
    const armMesh = new THREE.Mesh(armGeo, chrome);
    armMesh.rotation.z = Math.PI / 2;
    armMesh.position.x = armLen / 2;
    armGroup.add(armMesh);

    // Reinforcement ribs along the arm
    for (let r = 0; r < 8; r++) {
      const ribGeo = new THREE.TorusGeometry(0.15, 0.02, 8, 16);
      const rib = new THREE.Mesh(ribGeo, darkSteel);
      rib.position.x = 0.8 + r * 0.7;
      rib.rotation.y = Math.PI / 2;
      armGroup.add(rib);
    }

    // Injection nozzle at tip
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.x = armLen;

    // Nozzle body (LatheGeometry for realistic bell shape)
    const nozzleProfile = [];
    for (let t = 0; t <= 20; t++) {
      const f = t / 20;
      const r = 0.1 + 0.2 * Math.pow(f, 0.5);
      nozzleProfile.push(new THREE.Vector2(r, f * 0.8));
    }
    const nozzleGeo = new THREE.LatheGeometry(nozzleProfile, 24);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, aluminum);
    nozzleMesh.rotation.z = -Math.PI / 2;
    nozzleGroup.add(nozzleMesh);

    // Plasma glow at nozzle exit
    const plasmaGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const plasmaMat = glowMat(INJECT_COL, 5.0);
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    nozzleGroup.add(plasma);

    // Magnetic focusing coils
    for (let c = 0; c < 3; c++) {
      const coilGeo = new THREE.TorusGeometry(0.22 + c * 0.05, 0.02, 8, 24);
      const coil = new THREE.Mesh(coilGeo, copper);
      coil.position.x = -0.3 - c * 0.25;
      coil.rotation.y = Math.PI / 2;
      nozzleGroup.add(coil);
    }

    armGroup.add(nozzleGroup);

    // Hydraulic supply lines along arm
    const hydroPts = [];
    for (let h = 0; h < 20; h++) {
      const f = h / 19;
      hydroPts.push(new THREE.Vector3(
        f * armLen,
        0.15 + Math.sin(f * Math.PI * 4) * 0.05,
        0.12
      ));
    }
    const hydroGeo = tubeBetween(THREE, hydroPts, 0.025, 40);
    const hydroMesh = new THREE.Mesh(hydroGeo, copper);
    armGroup.add(hydroMesh);

    // Coolant lines on opposite side
    const coolPts = hydroPts.map(p => new THREE.Vector3(p.x, p.y, -0.12));
    const coolGeo = tubeBetween(THREE, coolPts, 0.02, 40);
    const coolMesh = new THREE.Mesh(coolGeo, steel);
    armGroup.add(coolMesh);

    // Position arm radially
    armGroup.position.set(
      Math.cos(angle) * 1.5,
      0,
      Math.sin(angle) * 1.5
    );
    armGroup.rotation.y = -angle;
    injectorGroup.add(armGroup);
    injectorArms.push(armGroup);
  }
  group.add(injectorGroup);
  meshes.injectorGroup = injectorGroup;
  meshes.injectorArms = injectorArms;

  // ================================================================
  //  6.  MATTER PARTICLES — injected, splitting, escaping
  // ================================================================
  // Each "particle" has 3 phases: inject → split → escape/capture
  const particlePool = [];
  const PARTICLE_COUNT = 24;
  const particleGroup = new THREE.Group();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const pObj = {};

    // Injected matter packet
    const injGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const injMat = emissiveMat(INJECT_COL, 3.0, 0x002233);
    pObj.inject = new THREE.Mesh(injGeo, injMat);
    pObj.inject.visible = false;
    particleGroup.add(pObj.inject);

    // Negative-energy fragment (falls into BH)
    const negGeo = new THREE.OctahedronGeometry(0.07, 1);
    const negMat = emissiveMat(NEG_ENERGY, 4.0, 0x110000);
    pObj.negative = new THREE.Mesh(negGeo, negMat);
    pObj.negative.visible = false;
    particleGroup.add(pObj.negative);

    // Positive-energy fragment (escapes with MORE energy)
    const posGeo = new THREE.IcosahedronGeometry(0.1, 1);
    const posMat = emissiveMat(POS_ENERGY, 4.5, 0x001100);
    pObj.positive = new THREE.Mesh(posGeo, posMat);
    pObj.positive.visible = false;
    particleGroup.add(pObj.positive);

    // Phase tracking
    pObj.phase = 0; // 0=idle, 1=inject, 2=split, 3=escape
    pObj.timer = Math.random() * 10;
    pObj.armIndex = i % injectorCount;
    pObj.splitAngle = Math.random() * Math.PI * 2;
    particlePool.push(pObj);
  }
  group.add(particleGroup);
  meshes.particles = particlePool;

  // ================================================================
  //  7.  ENERGY COLLECTION ARRAY — Dyson-sphere-like panels
  // ================================================================
  const collectorGroup = new THREE.Group();
  const panelRows = 8;
  const panelsPerRow = 16;
  const collectorRadius = 9.0;
  const panelMeshes = [];

  for (let row = 0; row < panelRows; row++) {
    const lat = ((row + 1) / (panelRows + 1) - 0.5) * Math.PI * 0.85;
    const rowR = collectorRadius * Math.cos(lat);
    const rowY = collectorRadius * Math.sin(lat);
    const count = Math.max(6, Math.floor(panelsPerRow * Math.cos(lat)));

    for (let p = 0; p < count; p++) {
      const lon = (p / count) * Math.PI * 2;
      const panelG = new THREE.Group();

      // Panel frame
      const frameGeo = new THREE.BoxGeometry(1.2, 0.06, 0.8);
      const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
      panelG.add(frameMesh);

      // Solar/energy collection surface
      const surfGeo = new THREE.PlaneGeometry(1.1, 0.7);
      const surfMat = new THREE.MeshStandardMaterial({
        color: 0x112244,
        emissive: new THREE.Color(COLLECTOR),
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        side: THREE.DoubleSide,
      });
      const surf = new THREE.Mesh(surfGeo, surfMat);
      surf.position.y = 0.04;
      panelG.add(surf);
      panelMeshes.push(surf);

      // Panel mounting pylon
      const pylonGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
      const pylon = new THREE.Mesh(pylonGeo, chrome);
      pylon.position.y = -0.33;
      panelG.add(pylon);

      // Position on sphere
      panelG.position.set(
        Math.cos(lon) * rowR,
        rowY,
        Math.sin(lon) * rowR
      );
      panelG.lookAt(0, 0, 0);
      collectorGroup.add(panelG);
    }
  }
  group.add(collectorGroup);
  meshes.collectorGroup = collectorGroup;
  meshes.panelMeshes = panelMeshes;

  // ================================================================
  //  8.  ENERGY CONDUIT NETWORK — tubes from collectors to stations
  // ================================================================
  const conduitGroup = new THREE.Group();
  const stationCount = 6;
  const stationAngleOffset = Math.PI / 6;
  const conduitMeshes = [];

  for (let s = 0; s < stationCount; s++) {
    const theta = (s / stationCount) * Math.PI * 2 + stationAngleOffset;
    const stX = Math.cos(theta) * (collectorRadius + 2.0);
    const stZ = Math.sin(theta) * (collectorRadius + 2.0);

    // Energy relay station
    const stationGeo = new THREE.DodecahedronGeometry(0.5, 1);
    const stationMat = solidTech(FRAME_COL);
    const station = new THREE.Mesh(stationGeo, stationMat);
    station.position.set(stX, 0, stZ);
    conduitGroup.add(station);

    // Glowing core inside station
    const coreGeo = new THREE.IcosahedronGeometry(0.25, 2);
    const coreMat = glowMat(COLLECTOR, 3.0);
    const core = new THREE.Mesh(coreGeo, coreMat);
    station.add(core);
    conduitMeshes.push(core);

    // Conduits from top/bottom collector zones to station
    for (let dir = -1; dir <= 1; dir += 2) {
      const pts = [];
      for (let t = 0; t <= 30; t++) {
        const f = t / 30;
        const r = collectorRadius * (1 - f * 0.15) + f * 2.0;
        const angle = theta + f * 0.3 * dir;
        pts.push(new THREE.Vector3(
          Math.cos(angle) * r,
          dir * (1 - f) * collectorRadius * 0.5,
          Math.sin(angle) * r
        ));
      }
      const tubeGeo = tubeBetween(THREE, pts, 0.04, 50);
      const tubeMat = emissiveMat(COLLECTOR, 1.5);
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      conduitGroup.add(tube);
    }
  }
  group.add(conduitGroup);
  meshes.conduitGroup = conduitGroup;
  meshes.conduitCores = conduitMeshes;

  // ================================================================
  //  9.  STRUCTURAL FRAME — geodesic support skeleton
  // ================================================================
  const frameGroup = new THREE.Group();
  const strutRadius = collectorRadius * 1.05;

  // Equatorial ring (massive structural torus)
  const eqTorusGeo = new THREE.TorusGeometry(strutRadius, 0.18, 12, 200);
  const eqTorus = new THREE.Mesh(eqTorusGeo, darkSteel);
  eqTorus.rotation.x = Math.PI / 2;
  frameGroup.add(eqTorus);

  // Polar rings
  for (let pol = -1; pol <= 1; pol += 2) {
    const polRingGeo = new THREE.TorusGeometry(strutRadius * 0.6, 0.12, 10, 120);
    const polRing = new THREE.Mesh(polRingGeo, steel);
    polRing.rotation.x = Math.PI / 2;
    polRing.position.y = pol * strutRadius * 0.75;
    frameGroup.add(polRing);
  }

  // Meridian arcs (great-circle struts)
  for (let m = 0; m < 8; m++) {
    const mAngle = (m / 8) * Math.PI;
    const pts = [];
    for (let t = 0; t <= 60; t++) {
      const lat = (t / 60) * Math.PI - Math.PI / 2;
      pts.push(new THREE.Vector3(
        Math.cos(lat) * Math.cos(mAngle) * strutRadius,
        Math.sin(lat) * strutRadius,
        Math.cos(lat) * Math.sin(mAngle) * strutRadius
      ));
    }
    const strutGeo = tubeBetween(THREE, pts, 0.08, 60);
    const strut = new THREE.Mesh(strutGeo, darkSteel);
    frameGroup.add(strut);
  }

  // Cross-bracing between meridians at mid-latitudes
  for (let lat = -1; lat <= 1; lat += 2) {
    const latAngle = lat * Math.PI * 0.3;
    const r = strutRadius * Math.cos(latAngle);
    const y = strutRadius * Math.sin(latAngle);
    for (let b = 0; b < 16; b++) {
      const a1 = (b / 16) * Math.PI * 2;
      const a2 = ((b + 1) / 16) * Math.PI * 2;
      const braceGeo = tubeBetween(THREE, [
        new THREE.Vector3(Math.cos(a1) * r, y, Math.sin(a1) * r),
        new THREE.Vector3(Math.cos((a1 + a2) / 2) * strutRadius, 0, Math.sin((a1 + a2) / 2) * strutRadius),
        new THREE.Vector3(Math.cos(a2) * r, y, Math.sin(a2) * r),
      ], 0.04, 20);
      const brace = new THREE.Mesh(braceGeo, steel);
      frameGroup.add(brace);
    }
  }
  group.add(frameGroup);
  meshes.frameGroup = frameGroup;

  // ================================================================
  // 10.  PHOTON SPHERE INDICATOR
  // ================================================================
  const photonSphereR = bhRadius * 1.5;
  const photonGeo = new THREE.TorusGeometry(photonSphereR, 0.02, 8, 200);
  const photonMat = glowMat(0xffff00, 2.5);
  const photonRing = new THREE.Mesh(photonGeo, photonMat);
  photonRing.rotation.x = Math.PI / 2;
  group.add(photonRing);
  meshes.photonRing = photonRing;

  // Additional tilted photon orbits
  for (let po = 0; po < 3; po++) {
    const poGeo = new THREE.TorusGeometry(photonSphereR, 0.015, 8, 200);
    const poMesh = new THREE.Mesh(poGeo, glowMat(0xffff00, 1.5));
    poMesh.rotation.x = Math.PI / 2 + (po + 1) * 0.25;
    poMesh.rotation.z = po * Math.PI / 3;
    group.add(poMesh);
  }

  // ================================================================
  // 11.  GRAVITATIONAL LENSING RINGS (Einstein rings)
  // ================================================================
  const einsteinGroup = new THREE.Group();
  for (let e = 0; e < 3; e++) {
    const eRad = bhRadius * (2.5 + e * 0.5);
    const eGeo = new THREE.TorusGeometry(eRad, 0.008 + e * 0.003, 6, 256);
    const eMat = glowMat(0xaaaaff, 1.2 - e * 0.3);
    const eRing = new THREE.Mesh(eGeo, eMat);
    eRing.rotation.x = Math.PI / 2 + e * 0.15;
    eRing.rotation.z = e * 0.4;
    einsteinGroup.add(eRing);
  }
  group.add(einsteinGroup);
  meshes.einsteinRings = einsteinGroup;

  // ================================================================
  // 12.  SPIN AXIS JET COLUMNS (Blandford–Znajek process)
  // ================================================================
  const jetGroup = new THREE.Group();
  for (let dir = -1; dir <= 1; dir += 2) {
    const jetPts = [];
    for (let j = 0; j <= 50; j++) {
      const f = j / 50;
      const r = 0.3 + f * 1.8;
      const y = dir * (bhRadius * 0.5 + f * 12);
      jetPts.push(new THREE.Vector3(
        Math.cos(f * Math.PI * 6) * r * 0.15,
        y,
        Math.sin(f * Math.PI * 6) * r * 0.15
      ));
    }
    // Jet core
    const jetCoreGeo = tubeBetween(THREE, jetPts, 0.15, 60);
    const jetCoreMat = glowMat(NEON_CYAN, 4.0);
    const jetCore = new THREE.Mesh(jetCoreGeo, jetCoreMat);
    jetGroup.add(jetCore);

    // Jet sheath
    const sheathGeo = new THREE.ConeGeometry(0.8, dir * 12, 32, 1, true);
    const sheathMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(NEON_CYAN),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const sheath = new THREE.Mesh(sheathGeo, sheathMat);
    sheath.position.y = dir * 6;
    jetGroup.add(sheath);
  }
  group.add(jetGroup);
  meshes.jetGroup = jetGroup;

  // ================================================================
  // 13.  CONTROL STATIONS — operator habitats at equatorial ring
  // ================================================================
  const stationGroup = new THREE.Group();
  const habCount = 4;
  for (let h = 0; h < habCount; h++) {
    const hAngle = (h / habCount) * Math.PI * 2;
    const habG = new THREE.Group();
    const hx = Math.cos(hAngle) * (strutRadius + 1.5);
    const hz = Math.sin(hAngle) * (strutRadius + 1.5);
    habG.position.set(hx, 0, hz);
    habG.lookAt(0, 0, 0);

    // Hull (ExtrudeGeometry from custom shape)
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-0.6, -0.3);
    hullShape.lineTo(-0.5, -0.45);
    hullShape.lineTo(0.5, -0.45);
    hullShape.lineTo(0.6, -0.3);
    hullShape.lineTo(0.6, 0.3);
    hullShape.lineTo(0.4, 0.45);
    hullShape.lineTo(-0.4, 0.45);
    hullShape.lineTo(-0.6, 0.3);
    hullShape.closePath();
    const hullExtGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 });
    const hull = new THREE.Mesh(hullExtGeo, aluminum);
    hull.position.z = -0.6;
    habG.add(hull);

    // Viewport (tinted glass)
    const vpGeo = new THREE.PlaneGeometry(0.8, 0.3);
    const vp = new THREE.Mesh(vpGeo, tinted);
    vp.position.set(0, 0.15, -0.62);
    habG.add(vp);

    // Antenna array
    const antGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 6);
    const ant = new THREE.Mesh(antGeo, chrome);
    ant.position.set(0, 0.9, 0);
    habG.add(ant);

    // Antenna dish
    const dishGeo = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const dish = new THREE.Mesh(dishGeo, aluminum);
    dish.position.set(0, 1.4, 0);
    dish.rotation.x = Math.PI;
    habG.add(dish);

    // Docking port
    const dockGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const dock = new THREE.Mesh(dockGeo, darkSteel);
    dock.rotation.x = Math.PI / 2;
    dock.position.z = 0.65;
    habG.add(dock);

    // Interior glow (simulating lit cabin)
    const interGeo = new THREE.BoxGeometry(0.9, 0.5, 0.9);
    const interMat = glowMat(0xffeedd, 1.0);
    const interior = new THREE.Mesh(interGeo, interMat);
    interior.position.z = 0;
    habG.add(interior);

    stationGroup.add(habG);
  }
  group.add(stationGroup);
  meshes.stationGroup = stationGroup;

  // ================================================================
  // 14.  PENROSE PROCESS TRAJECTORY MARKERS — fixed geodesic curves
  // ================================================================
  const trajectoryGroup = new THREE.Group();
  const trajCount = 6;
  for (let t = 0; t < trajCount; t++) {
    const tAngle = (t / trajCount) * Math.PI * 2;

    // Injection trajectory (from injector to ergosphere)
    const injPts = [];
    for (let s = 0; s <= 40; s++) {
      const f = s / 40;
      const r = 7.5 - f * 4.5; // approach from injector radius toward ergosphere
      const spiral = tAngle + f * 0.8;
      injPts.push(new THREE.Vector3(
        Math.cos(spiral) * r,
        Math.sin(f * Math.PI) * 0.3,
        Math.sin(spiral) * r
      ));
    }
    const injTrajGeo = tubeBetween(THREE, injPts, 0.02, 50);
    const injTrajMat = glowMat(INJECT_COL, 1.2);
    const injTraj = new THREE.Mesh(injTrajGeo, injTrajMat);
    trajectoryGroup.add(injTraj);

    // Negative fragment trajectory (spiraling into BH)
    const negPts = [];
    for (let s = 0; s <= 30; s++) {
      const f = s / 30;
      const r = 3.0 * (1 - f * 0.85);
      const spiral = tAngle + 1.5 + f * Math.PI * 3;
      negPts.push(new THREE.Vector3(
        Math.cos(spiral) * r,
        -f * 0.5,
        Math.sin(spiral) * r
      ));
    }
    const negTrajGeo = tubeBetween(THREE, negPts, 0.015, 40);
    const negTrajMat = glowMat(NEG_ENERGY, 1.0);
    const negTraj = new THREE.Mesh(negTrajGeo, negTrajMat);
    trajectoryGroup.add(negTraj);

    // Positive fragment trajectory (escaping outward with excess energy)
    const posPts = [];
    for (let s = 0; s <= 40; s++) {
      const f = s / 40;
      const r = 3.0 + f * 7.0;
      const spiral = tAngle + 2.0 - f * 0.6;
      posPts.push(new THREE.Vector3(
        Math.cos(spiral) * r,
        f * 1.5,
        Math.sin(spiral) * r
      ));
    }
    const posTrajGeo = tubeBetween(THREE, posPts, 0.018, 40);
    const posTrajMat = glowMat(POS_ENERGY, 1.5);
    const posTraj = new THREE.Mesh(posTrajGeo, posTrajMat);
    trajectoryGroup.add(posTraj);
  }
  group.add(trajectoryGroup);
  meshes.trajectoryGroup = trajectoryGroup;

  // ================================================================
  // 15.  ENERGY READOUT HOLOGRAPHIC DISPLAYS
  // ================================================================
  const displayGroup = new THREE.Group();
  for (let d = 0; d < 4; d++) {
    const da = (d / 4) * Math.PI * 2 + Math.PI / 8;
    const dPanel = new THREE.Group();

    // Screen backing
    const scrGeo = new THREE.PlaneGeometry(1.6, 1.0);
    const scrMat = new THREE.MeshStandardMaterial({
      color: 0x001122,
      emissive: new THREE.Color(NEON_CYAN),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const scr = new THREE.Mesh(scrGeo, scrMat);
    dPanel.add(scr);

    // Data lines (horizontal bars)
    for (let line = 0; line < 5; line++) {
      const lineGeo = new THREE.PlaneGeometry(1.3, 0.04);
      const lineMat = glowMat(0x00ff88, 2.0 + Math.random());
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.set(0, 0.35 - line * 0.17, 0.01);
      dPanel.add(lineMesh);
    }

    // Frame border
    const borderShape = new THREE.Shape();
    borderShape.moveTo(-0.82, -0.52);
    borderShape.lineTo(0.82, -0.52);
    borderShape.lineTo(0.82, 0.52);
    borderShape.lineTo(-0.82, 0.52);
    borderShape.closePath();
    const innerHole = new THREE.Path();
    innerHole.moveTo(-0.78, -0.48);
    innerHole.lineTo(0.78, -0.48);
    innerHole.lineTo(0.78, 0.48);
    innerHole.lineTo(-0.78, 0.48);
    innerHole.closePath();
    borderShape.holes.push(innerHole);
    const borderGeo = new THREE.ShapeGeometry(borderShape);
    const border = new THREE.Mesh(borderGeo, chrome);
    border.position.z = 0.005;
    dPanel.add(border);

    dPanel.position.set(
      Math.cos(da) * (strutRadius - 1.5),
      2.5,
      Math.sin(da) * (strutRadius - 1.5)
    );
    dPanel.lookAt(0, 2.5, 0);
    displayGroup.add(dPanel);
  }
  group.add(displayGroup);
  meshes.displayGroup = displayGroup;

  // ================================================================
  // 16.  GRAVITON SENSOR PODS — tiny satellites orbiting the BH
  // ================================================================
  const sensorPods = [];
  const podGroup = new THREE.Group();
  for (let sp = 0; sp < 12; sp++) {
    const podG = new THREE.Group();
    const podBody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      aluminum
    );
    podG.add(podBody);

    // Solar panels on pod
    for (let wing = -1; wing <= 1; wing += 2) {
      const wingGeo = new THREE.BoxGeometry(0.35, 0.01, 0.15);
      const wingMat = solidTech(0x112244, 0.9, 0.15);
      const wingMesh = new THREE.Mesh(wingGeo, wingMat);
      wingMesh.position.x = wing * 0.25;
      podG.add(wingMesh);
    }

    // Sensor antenna
    const sAntGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 4);
    const sAnt = new THREE.Mesh(sAntGeo, chrome);
    sAnt.position.y = 0.2;
    podG.add(sAnt);

    // Pod orbital parameters
    podG.userData = {
      orbR: 5.0 + Math.random() * 3,
      orbInc: (Math.random() - 0.5) * 0.6,
      orbPhase: Math.random() * Math.PI * 2,
      orbSpeed: 0.3 + Math.random() * 0.3,
    };
    podGroup.add(podG);
    sensorPods.push(podG);
  }
  group.add(podGroup);
  meshes.sensorPods = sensorPods;

  // ================================================================
  // 17.  MAGNETIC FIELD CONTAINMENT COILS (around ergosphere)
  // ================================================================
  const magCoilGroup = new THREE.Group();
  for (let mc = 0; mc < 10; mc++) {
    const mcAngle = (mc / 10) * Math.PI;
    const coilR = ergoEquatorialRadius * 1.15;
    const coilGeo = new THREE.TorusGeometry(coilR, 0.06, 10, 100);
    const coilMat = emissiveMat(0x0044ff, 1.2, 0x222233);
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.y = mcAngle;
    coil.rotation.x = Math.PI / 2;
    magCoilGroup.add(coil);
  }
  group.add(magCoilGroup);
  meshes.magCoils = magCoilGroup;

  // ================================================================
  // 18.  HAWKING RADIATION PARTICLES (tiny randomly positioned dots)
  // ================================================================
  const hawkingGroup = new THREE.Group();
  const hawkingCount = 200;
  const hawkingParticles = [];
  for (let hp = 0; hp < hawkingCount; hp++) {
    const hpGeo = new THREE.SphereGeometry(0.015, 4, 4);
    const hpMat = glowMat(
      [0xffaaaa, 0xaaaaff, 0xaaffaa, 0xffffaa][hp % 4],
      2.0 + Math.random() * 2
    );
    const hpMesh = new THREE.Mesh(hpGeo, hpMat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = bhRadius * (1.02 + Math.random() * 0.5);
    hpMesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    hpMesh.userData.baseR = r;
    hpMesh.userData.theta = theta;
    hpMesh.userData.phi = phi;
    hawkingGroup.add(hpMesh);
    hawkingParticles.push(hpMesh);
  }
  group.add(hawkingGroup);
  meshes.hawkingParticles = hawkingParticles;

  // ================================================================
  //  PARTS ARRAY — 20 detailed sub-components
  // ================================================================
  const parts = [
    {
      name: 'Kerr Event Horizon',
      description: 'The outer event horizon of the spinning Kerr black hole. Radius depends on BH mass M and dimensionless spin parameter a* = J/(Mc). r+ = M + √(M²−a²).',
      material: 'Degenerate spacetime curvature',
      function: 'Defines the causal boundary — nothing inside can classically escape.',
      assemblyOrder: 1,
      connections: ['Cauchy Horizon', 'Ergosphere', 'Ring Singularity'],
      failureEffect: 'Violation of cosmic censorship conjecture.',
      cascadeFailures: ['Ring Singularity exposed — naked singularity'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Ergosphere',
      description: 'Oblate region between the static limit surface and the event horizon. Inside, all time-like observers are forced to co-rotate with the BH due to frame-dragging.',
      material: 'Frame-dragged spacetime (Lense-Thirring effect)',
      function: 'Region where the Penrose process operates — particles can have negative energy-at-infinity.',
      assemblyOrder: 2,
      connections: ['Kerr Event Horizon', 'Matter Injectors', 'Frame-Drag Field Lines'],
      failureEffect: 'Loss of energy extraction capability.',
      cascadeFailures: ['Matter Injectors idle', 'Energy Collection Array offline'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 4, z: 0 },
    },
    {
      name: 'Ring Singularity',
      description: 'Unlike Schwarzschild, the Kerr singularity is a ring in the equatorial plane with radius a = J/Mc. The Kretschner scalar diverges on this ring.',
      material: 'Infinite curvature locus',
      function: 'Actual physical singularity; theoretically traversable if approached off-equatorial.',
      assemblyOrder: 3,
      connections: ['Cauchy Horizon'],
      failureEffect: 'Theoretically inaccessible behind two horizons.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -3, z: 0 },
    },
    {
      name: 'Cauchy (Inner) Horizon',
      description: 'Inner horizon at r- = M − √(M²−a²). The mass inflation instability makes it a weak null singularity in realistic collapse.',
      material: 'Unstable null surface',
      function: 'Marks boundary where Cauchy predictability breaks down.',
      assemblyOrder: 4,
      connections: ['Ring Singularity', 'Kerr Event Horizon'],
      failureEffect: 'Mass-inflation instability converts it to a singularity.',
      cascadeFailures: ['Interior structure collapse'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -1.5, z: 0 },
    },
    {
      name: 'Accretion Disk',
      description: 'Multi-temperature thin accretion disk with innermost stable circular orbit (ISCO) at r_ISCO dependent on spin. For a* → 1, ISCO → M (prograde).',
      material: 'Ionized plasma at 10⁶–10⁸ K',
      function: 'Provides matter feedstock and radiative diagnostics for spin measurement.',
      assemblyOrder: 5,
      connections: ['Kerr Event Horizon', 'Matter Injectors', 'ISCO Marker'],
      failureEffect: 'Loss of matter supply; energy extraction halts.',
      cascadeFailures: ['Matter Injectors starved', 'Jet columns collapse'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 },
    },
    {
      name: 'Matter Injection Arms',
      description: 'Six radial injector struts with magnetic focusing nozzles that launch matter packets along precise geodesics into the ergosphere.',
      material: 'Neutronium-reinforced tungsten–rhenium alloy',
      function: 'Inject matter at calculated 4-velocity to maximize Penrose energy extraction.',
      assemblyOrder: 6,
      connections: ['Ergosphere', 'Accretion Disk', 'Energy Conduit Network'],
      failureEffect: 'No matter injection; Penrose process stops.',
      cascadeFailures: ['Energy Collection Array idle'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 0, z: 0 },
    },
    {
      name: 'Negative-Energy Fragments',
      description: 'Matter fragments on retrograde orbits inside the ergosphere with negative conserved energy (E = −p_μ ξ^μ < 0 where ξ is the time-like Killing vector at infinity).',
      material: 'Exotic negative-energy-at-infinity matter states',
      function: 'Fall into the BH, reducing its mass-energy and angular momentum.',
      assemblyOrder: 7,
      connections: ['Ergosphere', 'Kerr Event Horizon'],
      failureEffect: 'BH spin not reduced; no net energy gain.',
      cascadeFailures: ['Violation of process efficiency'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -4, y: -3, z: 0 },
    },
    {
      name: 'Positive-Energy Escaping Fragments',
      description: 'Counter-fragments ejected from the ergosphere with kinetic energy exceeding the original injected packet — conservation enforced by BH spin-down.',
      material: 'Super-energetic baryonic matter',
      function: 'Carry extracted rotational energy outward to collection arrays.',
      assemblyOrder: 8,
      connections: ['Ergosphere', 'Energy Collection Array'],
      failureEffect: 'Energy not captured; wasted to infinity.',
      cascadeFailures: ['Collection Array efficiency drops to zero'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 6, y: 5, z: 0 },
    },
    {
      name: 'Energy Collection Array',
      description: 'Dyson-sphere-like arrangement of 100+ collection panels capturing kinetic energy of escaping fragments via electromagnetic deceleration.',
      material: 'Metamaterial superconducting collectors',
      function: 'Convert kinetic energy of escaping fragments to usable power.',
      assemblyOrder: 9,
      connections: ['Positive-Energy Fragments', 'Energy Conduit Network', 'Relay Stations'],
      failureEffect: 'Extracted energy radiates to infinity uncaptured.',
      cascadeFailures: ['Relay Stations powerless', 'Habitat life-support offline'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 12 },
    },
    {
      name: 'Energy Conduit Network',
      description: 'Superconducting waveguides routing captured energy from collection panels to relay stations and habitats.',
      material: 'Room-temperature superconductor (metallic hydrogen lattice)',
      function: 'Lossless energy transmission across the megastructure.',
      assemblyOrder: 10,
      connections: ['Energy Collection Array', 'Relay Stations', 'Control Habitats'],
      failureEffect: 'Energy bottleneck; overheating and structural damage.',
      cascadeFailures: ['Panel meltdown', 'Habitat blackout'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 3, z: 8 },
    },
    {
      name: 'Frame-Drag Field Visualizer',
      description: 'Twisted magnetic field lines revealing the Lense-Thirring frame-dragging induced by the Kerr BH angular momentum J.',
      material: 'Magnetohydrodynamic plasma tracer',
      function: 'Visualize and measure the frame-dragging angular velocity ω = −g_tφ / g_φφ.',
      assemblyOrder: 11,
      connections: ['Ergosphere', 'Magnetic Containment Coils'],
      failureEffect: 'Loss of spin diagnostics.',
      cascadeFailures: ['Injection trajectory miscalculation'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -5, y: 2, z: 4 },
    },
    {
      name: 'Photon Sphere Markers',
      description: 'Indicators at r = 1.5 r_s (Schwarzschild) showing unstable circular photon orbits. In Kerr, prograde/retrograde photon orbits differ.',
      material: 'Laser-traced reference geodesics',
      function: 'Navigation and calibration reference for trajectory planning.',
      assemblyOrder: 12,
      connections: ['Kerr Event Horizon', 'Graviton Sensor Pods'],
      failureEffect: 'Loss of geodesic calibration.',
      cascadeFailures: ['Injection angle errors'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: -4, z: 3 },
    },
    {
      name: 'Relativistic Jet Columns',
      description: 'Blandford-Znajek jets powered by magnetic field threading the ergosphere. Poynting flux extracts rotational energy electromagnetically.',
      material: 'Collimated relativistic electron-positron plasma',
      function: 'Secondary energy extraction channel; also prevents magnetic flux buildup.',
      assemblyOrder: 13,
      connections: ['Ergosphere', 'Magnetic Containment Coils'],
      failureEffect: 'Magnetic flux accumulation destabilizes accretion.',
      cascadeFailures: ['Magnetically arrested disk state'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 14, z: 0 },
    },
    {
      name: 'Geodesic Support Skeleton',
      description: 'Structural geodesic framework supporting collector panels, habitats, and conduits against tidal forces.',
      material: 'Carbon-nanotube-reinforced titanium truss',
      function: 'Maintains megastructure integrity under extreme tidal gradient.',
      assemblyOrder: 14,
      connections: ['Energy Collection Array', 'Control Habitats', 'Relay Stations'],
      failureEffect: 'Structural collapse; panels drift into BH.',
      cascadeFailures: ['Total megastructure loss'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: -10 },
    },
    {
      name: 'Control Habitats',
      description: 'Four crewed stations at the equatorial ring housing mission control, GR computation banks, and life support.',
      material: 'Radiation-hardened aerospace composites with lead-bismuth shielding',
      function: 'Human oversight, trajectory computation, and emergency abort.',
      assemblyOrder: 15,
      connections: ['Geodesic Support Skeleton', 'Energy Conduit Network', 'Holographic Displays'],
      failureEffect: 'Loss of human oversight; autonomous mode only.',
      cascadeFailures: ['Injection timing drift'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -8, y: 0, z: -5 },
    },
    {
      name: 'Graviton Sensor Pods',
      description: 'Twelve free-flying satellites in various orbits measuring spacetime curvature via laser interferometry (LIGO-scale precision).',
      material: 'Fused silica optics with drag-free test masses',
      function: 'Real-time measurement of Weyl tensor components for spin monitoring.',
      assemblyOrder: 16,
      connections: ['Photon Sphere Markers', 'Control Habitats'],
      failureEffect: 'Loss of real-time curvature data.',
      cascadeFailures: ['Cannot detect spin-down rate'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 6, z: 4 },
    },
    {
      name: 'Magnetic Containment Coils',
      description: 'Ten superconducting coils generating 10⁹ Tesla fields to confine accretion plasma and shape jet geometry.',
      material: 'YBCO high-temperature superconductor windings',
      function: 'Plasma confinement and Blandford-Znajek field anchoring.',
      assemblyOrder: 17,
      connections: ['Accretion Disk', 'Relativistic Jet Columns', 'Frame-Drag Visualizer'],
      failureEffect: 'Plasma escapes; uncontrolled accretion.',
      cascadeFailures: ['Accretion disk disruption', 'Jet instability'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -6, y: 0, z: 6 },
    },
    {
      name: 'Holographic Energy Displays',
      description: 'Four floating holographic screens showing real-time energy extraction rate (dM/dt), BH spin parameter a*(t), and efficiency η.',
      material: 'Volumetric plasma display with force-field containment',
      function: 'Operator interface for monitoring Penrose process metrics.',
      assemblyOrder: 18,
      connections: ['Control Habitats', 'Graviton Sensor Pods'],
      failureEffect: 'Operators blind to process state.',
      cascadeFailures: ['Delayed abort response'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 7, y: 4, z: -3 },
    },
    {
      name: 'Hawking Radiation Detectors',
      description: 'Array of quantum-sensitive bolometers detecting Hawking radiation temperature T_H = ℏκ/(2πk_B) where κ is surface gravity.',
      material: 'Transition-edge sensor arrays at 10 mK',
      function: 'Verify quantum field theory predictions and monitor BH thermodynamics.',
      assemblyOrder: 19,
      connections: ['Kerr Event Horizon', 'Graviton Sensor Pods'],
      failureEffect: 'Cannot verify Hawking process or measure surface gravity.',
      cascadeFailures: ['Thermodynamic consistency checks fail'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -3, y: -5, z: -4 },
    },
    {
      name: 'Einstein Ring Calibrators',
      description: 'Gravitational lensing ring markers used to calibrate the mass and spin of the Kerr BH from the shape of lensed background images.',
      material: 'Coherent laser reference grid',
      function: 'Independent mass/spin measurement via strong lensing observables.',
      assemblyOrder: 20,
      connections: ['Photon Sphere Markers', 'Graviton Sensor Pods'],
      failureEffect: 'Loss of independent mass verification.',
      cascadeFailures: ['Systematic error in energy budget'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 2, y: -6, z: 5 },
    },
  ];

  // ================================================================
  //  QUIZ QUESTIONS — PhD-level General Relativity
  // ================================================================
  const quizQuestions = [
    {
      question: 'In the Penrose process, what is the maximum fraction of a Kerr black hole\'s mass-energy that can be extracted before the BH becomes Schwarzschild (a*→0)? Express using the irreducible mass M_irr.',
      options: [
        '1 − M_irr/M ≈ 29.3% for a maximally spinning BH (a*=1)',
        '1 − (M_irr/M)² ≈ 50%',
        '100% — all mass can be extracted',
        '1 − √2·M_irr/M ≈ 20.7%',
      ],
      correctIndex: 0,
      explanation: 'The irreducible mass satisfies M² = M_irr² + J²/(4M_irr²). For a* = 1, M_irr = M/√2, so the extractable fraction is 1 − 1/√2 ≈ 29.3%. This is the Christodoulou–Ruffini mass formula. The area theorem (δA ≥ 0) ensures M_irr can never decrease.',
    },
    {
      question: 'Why must the ergosphere (but not the event horizon) exist for the Penrose process to work? What specific property of the Killing vector ξ^μ = (∂/∂t)^μ is crucial?',
      options: [
        'ξ^μ becomes space-like inside the ergosphere, allowing negative energy-at-infinity orbits for massive particles.',
        'ξ^μ becomes null on the ergosphere, creating a photon trapping surface.',
        'The ergosphere is where tidal forces are strongest.',
        'ξ^μ is undefined inside the ergosphere due to coordinate singularity.',
      ],
      correctIndex: 0,
      explanation: 'The conserved energy is E = −p_μ ξ^μ. Outside the ergosphere, ξ^μ is time-like and E > 0 for all future-directed time-like particles. Inside the ergosphere, ξ^μ becomes space-like (g_tt > 0 in +−−− signature), so E can be negative for certain time-like geodesics. This is impossible inside a Schwarzschild BH where the ergosphere coincides with the horizon.',
    },
    {
      question: 'Superradiant scattering of a bosonic wave with frequency ω off a Kerr BH amplifies the wave when a condition involving the horizon angular velocity Ω_H is met. What is this condition?',
      options: [
        'ω > Ω_H · m (m = azimuthal mode number)',
        'ω < Ω_H · m — the wave extracts rotational energy',
        'ω = Ω_H · m — resonance condition',
        'ω < Ω_H regardless of m',
      ],
      correctIndex: 1,
      explanation: 'Superradiance occurs when 0 < ω < m·Ω_H, where Ω_H = a/(2Mr+) is the angular velocity of the horizon. The reflected wave has amplitude greater than the incident wave, extracting rotational energy. This is the wave analogue of the Penrose process. For massive bosons, this leads to the "black hole bomb" instability if a reflecting mirror is placed around the BH.',
    },
    {
      question: 'The Kerr metric in Boyer-Lindquist coordinates has a coordinate singularity at Δ = 0. What are the physical surfaces Δ = 0 represents, and what happens to them as a → M?',
      options: [
        'Δ = r² − 2Mr + a² = 0 gives the two horizons r± = M ± √(M²−a²). As a→M, they merge at r = M (extremal Kerr).',
        'Δ = 0 is the ring singularity; it shrinks to a point as a→M.',
        'Δ = 0 represents the ergosphere boundary; it disappears as a→M.',
        'Δ = 0 gives the ISCO; it approaches the horizon as a→M.',
      ],
      correctIndex: 0,
      explanation: 'Δ = r² − 2Mr + a² vanishes at r± = M ± √(M²−a²), defining the outer (event) and inner (Cauchy) horizons. For a = M (extremal Kerr), both degenerate to r = M with zero surface gravity κ = 0, implying zero Hawking temperature. For a > M, no real roots exist — naked singularity, conjectured to be forbidden by cosmic censorship.',
    },
    {
      question: 'In the Penrose process, after the particle splits inside the ergosphere, what constraint on the fragment 4-momenta ensures energy extraction while obeying local physics?',
      options: [
        'Both fragments must have locally positive energy; only the conserved Killing energy at infinity is negative for the captured fragment.',
        'The captured fragment has locally negative energy, violating the weak energy condition.',
        'Both fragments must be massless (photons) for the process to work.',
        'The splitting must occur exactly at the static limit surface.',
      ],
      correctIndex: 0,
      explanation: 'Crucially, all fragments have locally positive energy as measured by any local observer (weak energy condition is satisfied). The "negative energy" is the conserved quantity E = −p_μ ξ^μ associated with the time-translation Killing vector, which becomes space-like in the ergosphere. A locally co-rotating observer (ZAMO) measures perfectly normal positive energy for both fragments. The Penrose process exploits the distinction between local and global (at-infinity) energy definitions in curved spacetime.',
    },
  ];

  // ================================================================
  //  DESCRIPTION
  // ================================================================
  const description = `Penrose Process Energy Sphere — an ultra-advanced megastructure enclosing a Kerr (rotating) black hole to extract its rotational energy via the Penrose mechanism. Matter is injected along precisely computed geodesics into the ergosphere, where frame-dragging forces co-rotation. Inside the ergosphere, each matter packet splits: one fragment enters a retrograde orbit with negative conserved energy-at-infinity and falls through the event horizon (reducing the BH's mass and spin), while the counter-fragment escapes with kinetic energy exceeding the original injection energy. The energy gain equals the magnitude of the negative-energy fragment's contribution, bounded by the Christodoulou limit of ~29.3% of total BH mass for maximal spin. A Dyson-sphere-like collection array captures escaping fragments, routing energy via superconducting conduits to relay stations and habitats. Blandford-Znajek jets provide a secondary electromagnetic extraction channel. Graviton sensor pods, Hawking radiation detectors, and Einstein ring calibrators provide real-time diagnostics of the BH's evolving mass, spin, and thermodynamic state.`;

  // ================================================================
  //  ANIMATE — hyper-synchronized animation loop
  // ================================================================
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // ── 1. Black hole rotation (frame-dragging visualization) ─────
    if (meshes.blackHole) {
      meshes.blackHole.rotation.y = t * 0.8;
    }
    if (meshes.cauchy) {
      meshes.cauchy.rotation.y = t * 1.2;
    }

    // ── 2. Ergosphere subtle pulsation ────────────────────────────
    if (meshes.ergosphere) {
      const ergoPulse = 1.0 + Math.sin(t * 2.0) * 0.03;
      meshes.ergosphere.scale.set(
        ergoEquatorialRadius * ergoPulse,
        ergoPolarRadius * (2 - ergoPulse),
        ergoEquatorialRadius * ergoPulse
      );
      meshes.ergoWire.scale.copy(meshes.ergosphere.scale);
      meshes.ergosphere.material.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.4;
    }

    // ── 3. Accretion disk differential rotation ──────────────────
    if (meshes.diskLayers) {
      meshes.diskLayers.forEach((layer, i) => {
        // Keplerian: inner orbits faster (∝ r^{-3/2})
        layer.rotation.z = t * (1.5 - i * 0.2);
        layer.material.emissiveIntensity = 2.5 + Math.sin(t * 4 + i) * 0.8;
      });
    }

    // ── 4. ISCO marker flash ─────────────────────────────────────
    if (meshes.isco) {
      meshes.isco.material.emissiveIntensity = 3.0 + Math.sin(t * 8) * 2.0;
    }

    // ── 5. Frame-drag field lines rotation ───────────────────────
    if (meshes.frameDrag) {
      meshes.frameDrag.rotation.y = t * 0.5;
    }

    // ── 6. Injector arm pulsation ────────────────────────────────
    if (meshes.injectorArms) {
      meshes.injectorArms.forEach((arm, i) => {
        const pulse = Math.sin(t * 3 + i * Math.PI / 3);
        arm.children.forEach(child => {
          if (child.material && child.material.emissive) {
            child.material.emissiveIntensity = 3.0 + pulse * 2.0;
          }
        });
      });
    }

    // ── 7. PARTICLE ANIMATION — the core Penrose process ─────────
    const cycleLen = 8.0; // seconds per full inject-split-escape cycle
    meshes.particles.forEach((p, idx) => {
      const localT = ((t + p.timer) % cycleLen) / cycleLen; // 0→1

      const armAngle = (p.armIndex / injectorCount) * Math.PI * 2;
      const injR0 = 7.5;
      const ergoR = ergoEquatorialRadius * 0.85;

      if (localT < 0.35) {
        // Phase 1: Injection — fly from arm tip toward ergosphere
        const f = localT / 0.35;
        const r = injR0 - f * (injR0 - ergoR);
        const spiral = armAngle + f * 0.5;
        p.inject.visible = true;
        p.negative.visible = false;
        p.positive.visible = false;
        p.inject.position.set(
          Math.cos(spiral) * r,
          Math.sin(f * Math.PI) * 0.4,
          Math.sin(spiral) * r
        );
        p.inject.scale.setScalar(1.0 + f * 0.5);
        p.inject.material.emissiveIntensity = 2.0 + f * 3.0;
      } else if (localT < 0.5) {
        // Phase 2: Splitting inside ergosphere
        const f = (localT - 0.35) / 0.15;
        const splitR = ergoR * 0.9;
        const baseAngle = armAngle + 0.5;

        p.inject.visible = f < 0.5;
        p.negative.visible = true;
        p.positive.visible = true;

        if (p.inject.visible) {
          p.inject.scale.setScalar(1.5 * (1 - f * 2));
        }

        // Negative fragment starts spiraling inward
        const negAngle = baseAngle + f * Math.PI * 0.8;
        const negR = splitR * (1 - f * 0.3);
        p.negative.position.set(
          Math.cos(negAngle) * negR,
          -f * 0.3,
          Math.sin(negAngle) * negR
        );
        p.negative.material.emissiveIntensity = 3.0 + f * 4.0;
        p.negative.rotation.x = t * 8;
        p.negative.rotation.z = t * 6;

        // Positive fragment begins outward motion
        const posAngle = baseAngle - f * 0.3;
        const posR = splitR + f * 1.5;
        p.positive.position.set(
          Math.cos(posAngle) * posR,
          f * 0.8,
          Math.sin(posAngle) * posR
        );
        p.positive.material.emissiveIntensity = 4.0 + f * 3.0;
        p.positive.scale.setScalar(1.0 + f * 0.8);
      } else if (localT < 0.85) {
        // Phase 3: Negative falls in, Positive escapes outward
        const f = (localT - 0.5) / 0.35;
        const baseAngle = armAngle + 0.5;

        p.inject.visible = false;
        p.negative.visible = true;
        p.positive.visible = true;

        // Negative spirals tightly into BH
        const negAngle = baseAngle + 0.8 * Math.PI + f * Math.PI * 4;
        const negR = ergoR * 0.7 * (1 - f * 0.8);
        p.negative.position.set(
          Math.cos(negAngle) * negR,
          -0.3 - f * 0.5,
          Math.sin(negAngle) * negR
        );
        p.negative.scale.setScalar(1.0 - f * 0.7);
        p.negative.material.emissiveIntensity = 5.0 + f * 5.0;
        p.negative.rotation.x = t * 12;

        // Positive zooms outward with increasing energy glow
        const posAngle = baseAngle - 0.3 - f * 0.8;
        const posR = ergoR + 1.5 + f * 6.5;
        p.positive.position.set(
          Math.cos(posAngle) * posR,
          0.8 + f * 2.0,
          Math.sin(posAngle) * posR
        );
        p.positive.scale.setScalar(1.8 + f * 0.5);
        p.positive.material.emissiveIntensity = 7.0 + Math.sin(t * 10) * 2;
      } else {
        // Phase 4: Cool-down / fade
        const f = (localT - 0.85) / 0.15;
        p.inject.visible = false;
        p.negative.visible = f < 0.3;
        p.positive.visible = true;

        if (p.negative.visible) {
          p.negative.scale.setScalar(0.3 * (1 - f / 0.3));
        }

        const posAngle = armAngle + 0.5 - 1.1 - f * 0.2;
        const posR = ergoR + 8.0 + f * 2;
        p.positive.position.set(
          Math.cos(posAngle) * posR,
          2.8 + f,
          Math.sin(posAngle) * posR
        );
        p.positive.scale.setScalar((2.3) * (1 - f));
        p.positive.material.emissiveIntensity = 7.0 * (1 - f);
      }
    });

    // ── 8. Collection panels glow in response to energy arrival ──
    if (meshes.panelMeshes) {
      meshes.panelMeshes.forEach((panel, i) => {
        const wave = Math.sin(t * 2 + i * 0.3);
        panel.material.emissiveIntensity = 0.4 + Math.max(0, wave) * 1.5;
      });
    }

    // ── 9. Conduit cores pulse energy flow ───────────────────────
    if (meshes.conduitCores) {
      meshes.conduitCores.forEach((core, i) => {
        core.material.emissiveIntensity = 2.0 + Math.sin(t * 4 + i) * 2.0;
        core.rotation.x = t * 2;
        core.rotation.y = t * 3;
      });
    }

    // ── 10. Sensor pods orbit ────────────────────────────────────
    meshes.sensorPods.forEach(pod => {
      const u = pod.userData;
      const angle = u.orbPhase + t * u.orbSpeed;
      pod.position.set(
        Math.cos(angle) * u.orbR,
        Math.sin(angle * 0.7) * u.orbR * u.orbInc,
        Math.sin(angle) * u.orbR
      );
      pod.rotation.y = angle;
    });

    // ── 11. Magnetic coils slow rotation ─────────────────────────
    if (meshes.magCoils) {
      meshes.magCoils.rotation.y = t * 0.15;
      meshes.magCoils.children.forEach((coil, i) => {
        coil.material.emissiveIntensity = 1.0 + Math.sin(t * 2 + i * 0.6) * 0.5;
      });
    }

    // ── 12. Hawking radiation twinkle ────────────────────────────
    meshes.hawkingParticles.forEach((hp, i) => {
      const flicker = Math.sin(t * 15 + i * 7.3) > 0.7 ? 1 : 0;
      hp.visible = flicker > 0;
      if (hp.visible) {
        const r = hp.userData.baseR + Math.sin(t * 3 + i) * 0.15;
        const theta = hp.userData.theta + t * 0.3;
        const phi = hp.userData.phi;
        hp.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
      }
    });

    // ── 13. Einstein rings slow precession ───────────────────────
    if (meshes.einsteinRings) {
      meshes.einsteinRings.rotation.y = t * 0.05;
      meshes.einsteinRings.rotation.x = Math.sin(t * 0.1) * 0.05;
    }

    // ── 14. Jet columns intensity variation ──────────────────────
    if (meshes.jetGroup) {
      meshes.jetGroup.children.forEach(child => {
        if (child.material) {
          child.material.emissiveIntensity =
            (child.material.opacity < 0.2 ? 0.4 : 3.0) +
            Math.sin(t * 5) * 1.0;
        }
      });
    }

    // ── 15. Photon ring shimmer ──────────────────────────────────
    if (meshes.photonRing) {
      meshes.photonRing.material.emissiveIntensity = 2.0 + Math.sin(t * 6) * 1.5;
    }

    // ── 16. Static limit rings breathe ───────────────────────────
    if (meshes.staticLimitRings) {
      meshes.staticLimitRings.children.forEach((ring, i) => {
        ring.material.emissiveIntensity = 1.0 + Math.sin(t * 2.5 + i * 0.8) * 0.7;
      });
    }

    // ── 17. Holographic displays data scroll ─────────────────────
    if (meshes.displayGroup) {
      meshes.displayGroup.children.forEach((panel, i) => {
        panel.children.forEach(child => {
          if (child.material && child.material.emissive) {
            const scroll = Math.sin(t * 3 + i * 1.5);
            child.material.emissiveIntensity = 1.0 + Math.abs(scroll) * 2.0;
          }
        });
        // Gentle floating motion
        panel.position.y = 2.5 + Math.sin(t * 0.5 + i) * 0.15;
      });
    }

    // ── 18. Collector sphere slow rotation ───────────────────────
    if (meshes.collectorGroup) {
      meshes.collectorGroup.rotation.y = t * 0.02;
    }

    // ── 19. Structural frame subtle flex ─────────────────────────
    if (meshes.frameGroup) {
      meshes.frameGroup.rotation.y = t * 0.01;
    }

    // ── 20. Black hole "spin-down" visual — subtle size decrease
    // (over very long timescales, BH shrinks as energy is extracted)
    if (meshes.blackHole) {
      const spinDown = 1.0 - Math.sin(t * 0.01) * 0.005; // tiny oscillation
      meshes.blackHole.scale.setScalar(spinDown);
    }
  }

  // ================================================================
  //  RETURN
  // ================================================================
  return {
    group,
    parts,
    description,
    quizQuestions,
    animate,
  };
}
