// ============================================================================
// GOD TIER SINGULARITY HARNESS — Naked Singularity Energy & Computation Device
// A hyper-advanced machine that harnesses an exposed (no event horizon)
// singularity for limitless energy extraction and infinite-blueshift computation.
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel,
  darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

/* -------------------------------------------------------------------------- */
/*  Helper: neon / emissive material factory                                   */
/* -------------------------------------------------------------------------- */
function emissiveMat(hex, intensity = 2.5) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: intensity,
    metalness: 0.6,
    roughness: 0.15,
    transparent: true,
    opacity: 0.92,
  });
}

function glowMat(hex, intensity = 4.0, opacity = 0.7) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: intensity,
    metalness: 0.3,
    roughness: 0.05,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
  });
}

function hologramMat(hex = 0x00ffff, opacity = 0.18) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: opacity,
    wireframe: true,
    side: THREE.DoubleSide,
  });
}

function energyFieldMat(hex, opacity = 0.35) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: 3.0,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/* -------------------------------------------------------------------------- */
/*  Main export                                                                */
/* -------------------------------------------------------------------------- */
export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // =========================================================================
  // SECTION 1 — CENTRAL NAKED SINGULARITY CORE
  // The singularity itself: a tiny ultra-dense point with extreme curvature
  // rendered as nested icosahedra with chaotic emissive pulse.
  // =========================================================================

  const singularityGroup = new THREE.Group();
  singularityGroup.name = 'nakedSingularityCore';

  // Inner point singularity — impossibly bright
  const singPointGeo = new THREE.IcosahedronGeometry(0.12, 5);
  const singPointMat = emissiveMat(0xffffff, 12.0);
  singPointMat.opacity = 1.0;
  const singPoint = new THREE.Mesh(singPointGeo, singPointMat);
  singPoint.name = 'singularityPoint';
  singularityGroup.add(singPoint);
  meshes.singularityPoint = singPoint;

  // Penrose curvature shell layer 1
  const curvShell1Geo = new THREE.IcosahedronGeometry(0.28, 4);
  const curvShell1Mat = glowMat(0xaa00ff, 6.0, 0.45);
  const curvShell1 = new THREE.Mesh(curvShell1Geo, curvShell1Mat);
  curvShell1.name = 'curvatureShell1';
  singularityGroup.add(curvShell1);
  meshes.curvatureShell1 = curvShell1;

  // Penrose curvature shell layer 2 (wireframe)
  const curvShell2Geo = new THREE.IcosahedronGeometry(0.42, 3);
  const curvShell2Mat = hologramMat(0xff00ff, 0.3);
  const curvShell2 = new THREE.Mesh(curvShell2Geo, curvShell2Mat);
  curvShell2.name = 'curvatureShell2';
  singularityGroup.add(curvShell2);
  meshes.curvatureShell2 = curvShell2;

  // Tidal force visualizer — deformed torus showing extreme tidal gradients
  const tidalGeo = new THREE.TorusGeometry(0.55, 0.04, 24, 80);
  const tidalMat = emissiveMat(0xff3300, 3.5);
  const tidalRing = new THREE.Mesh(tidalGeo, tidalMat);
  tidalRing.rotation.x = Math.PI / 2;
  tidalRing.name = 'tidalForceRing';
  singularityGroup.add(tidalRing);
  meshes.tidalForceRing = tidalRing;

  // Weyl curvature tensor visualization — 3 interlocking elliptical rings
  for (let i = 0; i < 3; i++) {
    const weylGeo = new THREE.TorusGeometry(0.38, 0.015, 16, 64);
    const weylMat = glowMat(0xffaa00, 3.0, 0.5);
    const weylRing = new THREE.Mesh(weylGeo, weylMat);
    weylRing.rotation.x = (Math.PI / 3) * i;
    weylRing.rotation.y = (Math.PI / 5) * i;
    weylRing.name = `weylTensorRing_${i}`;
    singularityGroup.add(weylRing);
    meshes[`weylTensorRing_${i}`] = weylRing;
  }

  group.add(singularityGroup);
  meshes.singularityGroup = singularityGroup;

  // =========================================================================
  // SECTION 2 — CAUCHY HORIZON REGION
  // Visible inner Cauchy horizon: a shimmering, unstable shell where
  // deterministic physics breaks down. Rendered as multiple concentric
  // translucent spheres with turbulent surface patterns.
  // =========================================================================

  const cauchyGroup = new THREE.Group();
  cauchyGroup.name = 'cauchyHorizonRegion';

  // Primary Cauchy horizon shell
  const cauchyShellGeo = new THREE.SphereGeometry(1.0, 64, 64);
  const cauchyShellMat = new THREE.MeshStandardMaterial({
    color: 0x0044ff,
    emissive: 0x0022aa,
    emissiveIntensity: 2.0,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    wireframe: false,
    metalness: 0.8,
    roughness: 0.1,
  });
  const cauchyShell = new THREE.Mesh(cauchyShellGeo, cauchyShellMat);
  cauchyShell.name = 'cauchyHorizonShell';
  cauchyGroup.add(cauchyShell);
  meshes.cauchyHorizonShell = cauchyShell;

  // Cauchy instability fluctuation layers (nested wireframe shells)
  for (let i = 0; i < 4; i++) {
    const fluxGeo = new THREE.IcosahedronGeometry(1.05 + i * 0.08, 2);
    const fluxMat = hologramMat(0x2244ff, 0.12 + i * 0.03);
    const fluxShell = new THREE.Mesh(fluxGeo, fluxMat);
    fluxShell.name = `cauchyFluxShell_${i}`;
    cauchyGroup.add(fluxShell);
    meshes[`cauchyFluxShell_${i}`] = fluxShell;
  }

  // Mass-inflation instability markers — small bright points on horizon
  for (let j = 0; j < 30; j++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 1.0;
    const markerGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const markerMat = emissiveMat(0x00ccff, 5.0);
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    marker.name = `massInflationMarker_${j}`;
    cauchyGroup.add(marker);
    meshes[`massInflationMarker_${j}`] = marker;
  }

  // Cauchy horizon latitude lines showing instability waves
  for (let k = 0; k < 6; k++) {
    const latAngle = (Math.PI / 7) * (k + 1);
    const latRadius = Math.sin(latAngle) * 1.02;
    const latY = Math.cos(latAngle) * 1.02;
    const latGeo = new THREE.TorusGeometry(latRadius, 0.008, 8, 80);
    const latMat = emissiveMat(0x00aaff, 2.0);
    const latRing = new THREE.Mesh(latGeo, latMat);
    latRing.position.y = latY;
    latRing.rotation.x = Math.PI / 2;
    latRing.name = `cauchyLatitude_${k}`;
    cauchyGroup.add(latRing);
    meshes[`cauchyLatitude_${k}`] = latRing;
  }

  group.add(cauchyGroup);
  meshes.cauchyGroup = cauchyGroup;

  // =========================================================================
  // SECTION 3 — ENERGY EXTRACTION ARRAYS
  // Massive orbital energy-extraction pylons that exploit the exposed
  // singularity's extreme gravitational gradients via superradiant scattering.
  // =========================================================================

  const extractionGroup = new THREE.Group();
  extractionGroup.name = 'energyExtractionArrays';

  const numPylons = 8;
  const pylonOrbitRadius = 2.8;

  for (let p = 0; p < numPylons; p++) {
    const angle = (Math.PI * 2 / numPylons) * p;
    const pylonGroup = new THREE.Group();
    pylonGroup.name = `extractionPylon_${p}`;

    // Main pylon body — tall hexagonal prism via ExtrudeGeometry
    const hexShape = new THREE.Shape();
    const hexR = 0.15;
    for (let v = 0; v < 6; v++) {
      const a = (Math.PI / 3) * v - Math.PI / 6;
      const method = v === 0 ? 'moveTo' : 'lineTo';
      hexShape[method](hexR * Math.cos(a), hexR * Math.sin(a));
    }
    hexShape.closePath();
    const pylonBodyGeo = new THREE.ExtrudeGeometry(hexShape, {
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
    const pylonBody = new THREE.Mesh(pylonBodyGeo, darkSteel);
    pylonBody.rotation.x = -Math.PI / 2;
    pylonBody.position.y = -0.8;
    pylonGroup.add(pylonBody);

    // Superradiant collector dish — LatheGeometry parabolic profile
    const dishPoints = [];
    for (let d = 0; d <= 24; d++) {
      const t = d / 24;
      const dr = t * 0.5;
      const dz = dr * dr * 1.8;
      dishPoints.push(new THREE.Vector2(dr, dz));
    }
    const dishGeo = new THREE.LatheGeometry(dishPoints, 48);
    const dishMat = chrome.clone();
    dishMat.emissive = new THREE.Color(0x4400aa);
    dishMat.emissiveIntensity = 0.5;
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI;
    dish.position.y = 0.9;
    dish.name = `collectorDish_${p}`;
    pylonGroup.add(dish);
    meshes[`collectorDish_${p}`] = dish;

    // Energy conduit from dish to central bus
    const conduitPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-pylonOrbitRadius * 0.3, 0.3, 0),
      new THREE.Vector3(-pylonOrbitRadius * 0.6, 0.1, 0),
      new THREE.Vector3(-pylonOrbitRadius * 0.85, 0, 0),
    ]);
    const conduitGeo = new THREE.TubeGeometry(conduitPath, 32, 0.025, 12, false);
    const conduitMat = emissiveMat(0xff00ff, 3.5);
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.name = `energyConduit_${p}`;
    pylonGroup.add(conduit);
    meshes[`energyConduit_${p}`] = conduit;

    // Pylon energy collector rings
    for (let ring = 0; ring < 3; ring++) {
      const rGeo = new THREE.TorusGeometry(0.2, 0.012, 12, 32);
      const rMat = emissiveMat(0x8800ff, 2.0 + ring);
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.y = 0.3 + ring * 0.25;
      rMesh.rotation.x = Math.PI / 2;
      pylonGroup.add(rMesh);
    }

    // Gravitational wave detector antennae
    const antennaGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.7, 8);
    const antenna1 = new THREE.Mesh(antennaGeo, copper);
    antenna1.position.set(0.12, 1.1, 0);
    antenna1.rotation.z = Math.PI / 6;
    pylonGroup.add(antenna1);
    const antenna2 = new THREE.Mesh(antennaGeo, copper);
    antenna2.position.set(-0.12, 1.1, 0);
    antenna2.rotation.z = -Math.PI / 6;
    pylonGroup.add(antenna2);

    // Position pylon in orbit
    pylonGroup.position.set(
      Math.cos(angle) * pylonOrbitRadius,
      0,
      Math.sin(angle) * pylonOrbitRadius
    );
    pylonGroup.lookAt(0, 0, 0);
    extractionGroup.add(pylonGroup);
    meshes[`extractionPylon_${p}`] = pylonGroup;
  }

  // Central energy collection bus ring
  const busGeo = new THREE.TorusGeometry(pylonOrbitRadius * 0.85, 0.06, 16, 96);
  const busMat = emissiveMat(0xcc00ff, 2.5);
  const busRing = new THREE.Mesh(busGeo, busMat);
  busRing.rotation.x = Math.PI / 2;
  busRing.name = 'centralEnergyBus';
  extractionGroup.add(busRing);
  meshes.centralEnergyBus = busRing;

  group.add(extractionGroup);
  meshes.extractionGroup = extractionGroup;

  // =========================================================================
  // SECTION 4 — INFINITE BLUESHIFT COMPUTATION SURFACE
  // A shell at the infinite blueshift surface where infalling radiation is
  // frequency-shifted to arbitrarily high energy, enabling hypercomputation.
  // =========================================================================

  const blueshiftGroup = new THREE.Group();
  blueshiftGroup.name = 'infiniteBlueshiftSurface';

  // Primary blueshift computation sphere
  const bsGeo = new THREE.SphereGeometry(1.65, 80, 80);
  const bsMat = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    emissive: 0x0000ff,
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    metalness: 0.9,
    roughness: 0.0,
  });
  const bsSphere = new THREE.Mesh(bsGeo, bsMat);
  bsSphere.name = 'blueshiftSphere';
  blueshiftGroup.add(bsSphere);
  meshes.blueshiftSphere = bsSphere;

  // Computational node lattice on blueshift surface
  const compNodes = [];
  const nodeCount = 80;
  for (let n = 0; n < nodeCount; n++) {
    const phi = Math.acos(2 * (n / nodeCount) - 1);
    const theta = Math.PI * (1 + Math.sqrt(5)) * n; // golden angle
    const r = 1.66;
    const nodeGeo = new THREE.OctahedronGeometry(0.03, 1);
    const nodeMat = emissiveMat(0x00aaff, 4.0);
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    node.name = `compNode_${n}`;
    blueshiftGroup.add(node);
    compNodes.push(node);
  }
  meshes.compNodes = compNodes;

  // Data transfer arcs between computation nodes (select pairs)
  for (let arc = 0; arc < 20; arc++) {
    const nA = compNodes[arc * 4 % nodeCount];
    const nB = compNodes[(arc * 4 + 7) % nodeCount];
    const mid = new THREE.Vector3().addVectors(nA.position, nB.position).multiplyScalar(0.5);
    mid.multiplyScalar(1.15); // arc outward
    const arcCurve = new THREE.QuadraticBezierCurve3(
      nA.position.clone(), mid, nB.position.clone()
    );
    const arcGeo = new THREE.TubeGeometry(arcCurve, 16, 0.005, 6, false);
    const arcMat = glowMat(0x00ffff, 3.0, 0.4);
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.name = `dataArc_${arc}`;
    blueshiftGroup.add(arcMesh);
  }

  // Blueshift frequency ladder rings
  for (let bRing = 0; bRing < 8; bRing++) {
    const bR = 1.65 + bRing * 0.005;
    const bAngle = (Math.PI / 9) * (bRing + 1);
    const bLatR = Math.sin(bAngle) * bR;
    const bLatY = Math.cos(bAngle) * bR;
    const bGeo = new THREE.TorusGeometry(bLatR, 0.006, 8, 64);
    const blueFrac = bRing / 8;
    const bColor = new THREE.Color().setHSL(0.58 + blueFrac * 0.08, 1.0, 0.5);
    const bMat = emissiveMat(bColor, 2.5 + bRing * 0.4);
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.y = bLatY;
    bMesh.rotation.x = Math.PI / 2;
    blueshiftGroup.add(bMesh);
  }

  group.add(blueshiftGroup);
  meshes.blueshiftGroup = blueshiftGroup;

  // =========================================================================
  // SECTION 5 — ACCRETION DISK & MATTER STREAMS
  // Matter spiraling toward the naked singularity in a thin accretion disk
  // with visible hotspots, spiral density waves, and relativistic jets.
  // =========================================================================

  const accretionGroup = new THREE.Group();
  accretionGroup.name = 'accretionDiskSystem';

  // Main accretion disk — multiple concentric annular rings with color gradient
  const diskRings = [];
  const diskRingCount = 18;
  for (let dr = 0; dr < diskRingCount; dr++) {
    const innerR = 1.8 + dr * 0.18;
    const outerR = innerR + 0.16;
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    ringShape.holes.push(hole);
    const ringGeo = new THREE.ShapeGeometry(ringShape, 64);
    const temp = dr / diskRingCount;
    const dColor = new THREE.Color().setHSL(0.08 - temp * 0.08, 1.0, 0.55 - temp * 0.15);
    const ringMat = energyFieldMat(dColor, 0.5 - temp * 0.25);
    ringMat.emissiveIntensity = 3.5 - temp * 2.0;
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.name = `accretionRing_${dr}`;
    accretionGroup.add(ringMesh);
    diskRings.push(ringMesh);
  }
  meshes.diskRings = diskRings;

  // Spiral density waves — logarithmic spiral tubes embedded in disk plane
  const spiralArms = [];
  for (let s = 0; s < 4; s++) {
    const spiralPoints = [];
    const offset = (Math.PI / 2) * s;
    for (let sp = 0; sp <= 120; sp++) {
      const t = sp / 120;
      const angle = offset + t * Math.PI * 4;
      const r = 1.9 + t * 2.8;
      spiralPoints.push(new THREE.Vector3(
        r * Math.cos(angle),
        (Math.random() - 0.5) * 0.04,
        r * Math.sin(angle)
      ));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 100, 0.03, 8, false);
    const spiralMat = emissiveMat(0xff6600, 2.5);
    spiralMat.transparent = true;
    spiralMat.opacity = 0.6;
    const spiralMesh = new THREE.Mesh(spiralGeo, spiralMat);
    spiralMesh.name = `spiralArm_${s}`;
    accretionGroup.add(spiralMesh);
    spiralArms.push(spiralMesh);
  }
  meshes.spiralArms = spiralArms;

  // Hotspots in accretion disk — brilliant over-dense knots
  for (let hs = 0; hs < 12; hs++) {
    const hsAngle = Math.random() * Math.PI * 2;
    const hsR = 2.0 + Math.random() * 2.4;
    const hsGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 12, 12);
    const hsMat = emissiveMat(0xffcc00, 5.0);
    const hsMesh = new THREE.Mesh(hsGeo, hsMat);
    hsMesh.position.set(Math.cos(hsAngle) * hsR, 0, Math.sin(hsAngle) * hsR);
    hsMesh.name = `diskHotspot_${hs}`;
    accretionGroup.add(hsMesh);
    meshes[`diskHotspot_${hs}`] = hsMesh;
  }

  // Relativistic jets — bipolar outflows along rotation axis
  for (let j = 0; j < 2; j++) {
    const dir = j === 0 ? 1 : -1;
    const jetPoints = [];
    for (let jp = 0; jp <= 30; jp++) {
      const t = jp / 30;
      const jr = 0.15 * (1 - t * 0.7);
      jetPoints.push(new THREE.Vector2(jr, t * 4.0 * dir));
    }
    const jetGeo = new THREE.LatheGeometry(jetPoints, 32);
    const jetMat = energyFieldMat(0x00ccff, 0.3);
    jetMat.emissiveIntensity = 4.0;
    const jet = new THREE.Mesh(jetGeo, jetMat);
    jet.name = `relativisticJet_${j}`;
    accretionGroup.add(jet);
    meshes[`relativisticJet_${j}`] = jet;
  }

  // Jet helical filaments
  for (let j = 0; j < 2; j++) {
    const dir = j === 0 ? 1 : -1;
    for (let f = 0; f < 3; f++) {
      const filPoints = [];
      const fOff = (Math.PI * 2 / 3) * f;
      for (let fp = 0; fp <= 60; fp++) {
        const t = fp / 60;
        const a = fOff + t * Math.PI * 6;
        const r = 0.1 * (1 - t * 0.5);
        filPoints.push(new THREE.Vector3(
          r * Math.cos(a),
          t * 4.0 * dir,
          r * Math.sin(a)
        ));
      }
      const filCurve = new THREE.CatmullRomCurve3(filPoints);
      const filGeo = new THREE.TubeGeometry(filCurve, 48, 0.008, 6, false);
      const filMat = emissiveMat(0x44ddff, 3.0);
      const filMesh = new THREE.Mesh(filGeo, filMat);
      accretionGroup.add(filMesh);
    }
  }

  group.add(accretionGroup);
  meshes.accretionGroup = accretionGroup;

  // =========================================================================
  // SECTION 6 — GRAVITATIONAL LENSING VISUALIZATION RINGS
  // Photon sphere and Einstein ring structures showing light bending
  // =========================================================================

  const lensingGroup = new THREE.Group();
  lensingGroup.name = 'gravitationalLensingVis';

  // Photon sphere — where light orbits the singularity
  const photonSphereGeo = new THREE.SphereGeometry(1.35, 64, 64);
  const photonSphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffaa,
    emissive: 0xffff44,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });
  const photonSphere = new THREE.Mesh(photonSphereGeo, photonSphereMat);
  photonSphere.name = 'photonSphere';
  lensingGroup.add(photonSphere);
  meshes.photonSphere = photonSphere;

  // Einstein rings — concentric lensing arcs
  for (let er = 0; er < 5; er++) {
    const erR = 2.2 + er * 0.5;
    const erGeo = new THREE.TorusGeometry(erR, 0.015 + er * 0.005, 12, 128);
    const erHue = 0.1 + er * 0.15;
    const erColor = new THREE.Color().setHSL(erHue, 0.8, 0.6);
    const erMat = glowMat(erColor, 2.0, 0.35);
    const erMesh = new THREE.Mesh(erGeo, erMat);
    erMesh.rotation.x = Math.PI / 2 + (er * 0.05);
    erMesh.rotation.z = er * 0.1;
    erMesh.name = `einsteinRing_${er}`;
    lensingGroup.add(erMesh);
    meshes[`einsteinRing_${er}`] = erMesh;
  }

  // Light ray bundles being bent — curved tubes showing geodesics
  for (let ray = 0; ray < 12; ray++) {
    const rayAngle = (Math.PI * 2 / 12) * ray;
    const rayPts = [];
    for (let rp = 0; rp <= 40; rp++) {
      const t = rp / 40;
      const dist = 5.0 - t * 3.5;
      const bend = Math.sin(t * Math.PI) * 0.8;
      rayPts.push(new THREE.Vector3(
        dist * Math.cos(rayAngle + bend * 0.3),
        bend * 0.5 * Math.sin(rayAngle),
        dist * Math.sin(rayAngle + bend * 0.3)
      ));
    }
    const rayCurve = new THREE.CatmullRomCurve3(rayPts);
    const rayGeo = new THREE.TubeGeometry(rayCurve, 32, 0.008, 6, false);
    const rayMat = glowMat(0xffff88, 2.5, 0.3);
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.name = `bentLightRay_${ray}`;
    lensingGroup.add(rayMesh);
  }

  group.add(lensingGroup);
  meshes.lensingGroup = lensingGroup;

  // =========================================================================
  // SECTION 7 — CONTAINMENT & STABILIZATION SUPERSTRUCTURE
  // The engineering cage that keeps the naked singularity from going wild.
  // Uses exotic matter struts, magnetic confinement, and geodesic frames.
  // =========================================================================

  const containmentGroup = new THREE.Group();
  containmentGroup.name = 'containmentSuperstructure';

  // Geodesic containment frame — icosahedral wireframe cage
  const cageGeo = new THREE.IcosahedronGeometry(5.2, 1);
  const cageMat = new THREE.MeshStandardMaterial({
    color: 0x445566,
    metalness: 0.9,
    roughness: 0.2,
    wireframe: true,
  });
  const cage = new THREE.Mesh(cageGeo, cageMat);
  cage.name = 'geodesicCage';
  containmentGroup.add(cage);
  meshes.geodesicCage = cage;

  // Exotic matter stabilizer struts — 12 radial beams
  for (let st = 0; st < 12; st++) {
    const phi = Math.acos(2 * (st / 12) - 1);
    const theta = Math.PI * (1 + Math.sqrt(5)) * st;
    const strutLen = 5.0;
    const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, strutLen, 8);
    const strutMat = chrome.clone();
    const strut = new THREE.Mesh(strutGeo, strutMat);
    strut.position.set(
      (strutLen / 2) * Math.sin(phi) * Math.cos(theta),
      (strutLen / 2) * Math.sin(phi) * Math.sin(theta),
      (strutLen / 2) * Math.cos(phi)
    );
    strut.lookAt(0, 0, 0);
    strut.rotateX(Math.PI / 2);
    strut.name = `exoticMatterStrut_${st}`;
    containmentGroup.add(strut);

    // Strut tip magnetic clamp
    const clampGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const clampMat = emissiveMat(0x00ff88, 2.0);
    const clamp = new THREE.Mesh(clampGeo, clampMat);
    clamp.position.set(
      strutLen * 0.5 * Math.sin(phi) * Math.cos(theta),
      strutLen * 0.5 * Math.sin(phi) * Math.sin(theta),
      strutLen * 0.5 * Math.cos(phi)
    );
    containmentGroup.add(clamp);
  }

  // Magnetic confinement coils — large toroidal superconductors
  for (let mc = 0; mc < 3; mc++) {
    const mcGeo = new THREE.TorusGeometry(4.0, 0.08, 16, 96);
    const mcMat = new THREE.MeshStandardMaterial({
      color: 0x88aacc,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x002244,
      emissiveIntensity: 0.8,
    });
    const mcMesh = new THREE.Mesh(mcGeo, mcMat);
    mcMesh.rotation.x = (Math.PI / 3) * mc;
    mcMesh.rotation.y = (Math.PI / 4) * mc;
    mcMesh.name = `magneticCoil_${mc}`;
    containmentGroup.add(mcMesh);
    meshes[`magneticCoil_${mc}`] = mcMesh;
  }

  // Superconductor coolant lines snaking between coils
  for (let cl = 0; cl < 6; cl++) {
    const clPts = [];
    for (let cp = 0; cp <= 20; cp++) {
      const t = cp / 20;
      clPts.push(new THREE.Vector3(
        3.8 * Math.cos(t * Math.PI * 2 + cl),
        2.0 * Math.sin(t * Math.PI * 3 + cl * 0.5),
        3.8 * Math.sin(t * Math.PI * 2 + cl)
      ));
    }
    const clCurve = new THREE.CatmullRomCurve3(clPts);
    const clGeo = new THREE.TubeGeometry(clCurve, 40, 0.02, 8, false);
    const clMat = new THREE.MeshStandardMaterial({
      color: 0x44aaff,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x002266,
      emissiveIntensity: 0.4,
    });
    const clMesh = new THREE.Mesh(clGeo, clMat);
    containmentGroup.add(clMesh);
  }

  group.add(containmentGroup);
  meshes.containmentGroup = containmentGroup;

  // =========================================================================
  // SECTION 8 — CONTROL STATION & OPERATOR INTERFACE
  // A sophisticated observation/control platform with holographic displays,
  // tinted glass canopy, joysticks, and monitoring equipment.
  // =========================================================================

  const controlGroup = new THREE.Group();
  controlGroup.name = 'controlStation';

  // Platform base — circular disk with beveled edge
  const platShape = new THREE.Shape();
  platShape.absarc(0, 0, 1.2, 0, Math.PI * 2, false);
  const platGeo = new THREE.ExtrudeGeometry(platShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4,
  });
  const platform = new THREE.Mesh(platGeo, darkSteel);
  platform.rotation.x = -Math.PI / 2;
  platform.position.set(6.5, -2.0, 0);
  controlGroup.add(platform);

  // Tinted glass canopy dome
  const canopyGeo = new THREE.SphereGeometry(1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, tinted);
  canopy.position.set(6.5, -1.9, 0);
  canopy.name = 'controlCanopy';
  controlGroup.add(canopy);
  meshes.controlCanopy = canopy;

  // Console desk — curved panel
  const consoleShape = new THREE.Shape();
  consoleShape.absarc(0, 0, 0.7, -Math.PI * 0.6, Math.PI * 0.6, false);
  consoleShape.lineTo(0, 0);
  const consoleGeo = new THREE.ExtrudeGeometry(consoleShape, { depth: 0.06, bevelEnabled: false });
  const consoleMesh = new THREE.Mesh(consoleGeo, aluminum);
  consoleMesh.position.set(6.5, -1.55, 0);
  consoleMesh.rotation.x = -Math.PI / 4;
  controlGroup.add(consoleMesh);

  // Holographic display screens on console
  for (let scr = 0; scr < 3; scr++) {
    const scrAngle = (-0.4 + scr * 0.4);
    const scrGeo = new THREE.PlaneGeometry(0.35, 0.25);
    const scrMat = emissiveMat(0x00ffcc, 2.5);
    scrMat.opacity = 0.7;
    const scrMesh = new THREE.Mesh(scrGeo, scrMat);
    scrMesh.position.set(
      6.5 + Math.sin(scrAngle) * 0.55,
      -1.35,
      Math.cos(scrAngle) * 0.55 - 0.55
    );
    scrMesh.rotation.y = scrAngle;
    scrMesh.name = `holoScreen_${scr}`;
    controlGroup.add(scrMesh);
    meshes[`holoScreen_${scr}`] = scrMesh;
  }

  // Joystick controls
  for (let js = 0; js < 2; js++) {
    const jsX = 6.5 + (js === 0 ? -0.3 : 0.3);
    // Base
    const jsBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.03, 12);
    const jsBase = new THREE.Mesh(jsBaseGeo, darkSteel);
    jsBase.position.set(jsX, -1.5, -0.15);
    controlGroup.add(jsBase);
    // Stick
    const jsStickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8);
    const jsStick = new THREE.Mesh(jsStickGeo, chrome);
    jsStick.position.set(jsX, -1.43, -0.15);
    controlGroup.add(jsStick);
    // Knob
    const jsKnobGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const jsKnob = new THREE.Mesh(jsKnobGeo, rubber);
    jsKnob.position.set(jsX, -1.37, -0.15);
    controlGroup.add(jsKnob);
  }

  // Operator chair
  const chairSeatGeo = new THREE.BoxGeometry(0.3, 0.05, 0.3);
  const chairSeat = new THREE.Mesh(chairSeatGeo, plastic);
  chairSeat.position.set(6.5, -1.65, 0.3);
  controlGroup.add(chairSeat);
  const chairBackGeo = new THREE.BoxGeometry(0.3, 0.4, 0.05);
  const chairBack = new THREE.Mesh(chairBackGeo, plastic);
  chairBack.position.set(6.5, -1.45, 0.45);
  controlGroup.add(chairBack);

  // Access ladder from ground to platform
  for (let rung = 0; rung < 8; rung++) {
    const rungGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
    const rungMesh = new THREE.Mesh(rungGeo, steel);
    rungMesh.rotation.z = Math.PI / 2;
    rungMesh.position.set(7.5, -3.5 + rung * 0.22, 0);
    controlGroup.add(rungMesh);
  }
  // Ladder rails
  for (let rail = 0; rail < 2; rail++) {
    const railGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8);
    const railMesh = new THREE.Mesh(railGeo, steel);
    railMesh.position.set(7.5 + (rail === 0 ? -0.2 : 0.2), -2.8, 0);
    controlGroup.add(railMesh);
  }

  group.add(controlGroup);
  meshes.controlGroup = controlGroup;

  // =========================================================================
  // SECTION 9 — SPACETIME METRIC VISUALIZATION GRID
  // A deformed grid showing the warping of spacetime around the singularity
  // =========================================================================

  const gridGroup = new THREE.Group();
  gridGroup.name = 'spacetimeGrid';

  // Equatorial spacetime grid (deformed plane)
  const gridSize = 12;
  const gridSegs = 50;
  const gridGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridSegs, gridSegs);
  const gridPositions = gridGeo.attributes.position;
  for (let gi = 0; gi < gridPositions.count; gi++) {
    const gx = gridPositions.getX(gi);
    const gy = gridPositions.getY(gi);
    const gDist = Math.sqrt(gx * gx + gy * gy);
    const warp = gDist > 0.5 ? -2.0 / (gDist + 0.3) : -4.0;
    gridPositions.setZ(gi, warp);
  }
  gridGeo.computeVertexNormals();
  const gridMat = new THREE.MeshStandardMaterial({
    color: 0x113322,
    emissive: 0x00ff44,
    emissiveIntensity: 0.3,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.rotation.x = -Math.PI / 2;
  gridMesh.position.y = -3.5;
  gridMesh.name = 'spacetimeWarpGrid';
  gridGroup.add(gridMesh);
  meshes.spacetimeWarpGrid = gridMesh;

  group.add(gridGroup);

  // =========================================================================
  // SECTION 10 — PARTICLE / MATTER INFALL STREAMS
  // Visible streams of matter spiraling into the singularity
  // =========================================================================

  const particleGroup = new THREE.Group();
  particleGroup.name = 'matterStreams';

  const streamParticles = [];
  const numStreams = 6;
  const particlesPerStream = 25;

  for (let si = 0; si < numStreams; si++) {
    const streamAngle = (Math.PI * 2 / numStreams) * si;
    for (let pi = 0; pi < particlesPerStream; pi++) {
      const t = pi / particlesPerStream;
      const spiralR = 4.5 * (1 - t);
      const spiralA = streamAngle + t * Math.PI * 5;
      const pGeo = new THREE.SphereGeometry(0.025 + (1 - t) * 0.02, 6, 6);
      const pMat = emissiveMat(
        new THREE.Color().setHSL(0.05 + t * 0.1, 1.0, 0.5 + t * 0.3),
        2.0 + t * 4.0
      );
      const particle = new THREE.Mesh(pGeo, pMat);
      particle.position.set(
        spiralR * Math.cos(spiralA),
        (Math.random() - 0.5) * 0.3 * (1 - t),
        spiralR * Math.sin(spiralA)
      );
      particle.userData = {
        baseAngle: spiralA,
        baseR: spiralR,
        streamIndex: si,
        paramT: t,
        streamAngleOff: streamAngle,
      };
      particleGroup.add(particle);
      streamParticles.push(particle);
    }
  }
  meshes.streamParticles = streamParticles;

  group.add(particleGroup);
  meshes.particleGroup = particleGroup;

  // =========================================================================
  // SECTION 11 — WARNING / STATUS INDICATOR LIGHTS
  // =========================================================================

  const indicatorGroup = new THREE.Group();
  for (let ind = 0; ind < 16; ind++) {
    const indAngle = (Math.PI * 2 / 16) * ind;
    const indR = 5.0;
    const indGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const indColor = ind % 3 === 0 ? 0xff0000 : ind % 3 === 1 ? 0xffaa00 : 0x00ff00;
    const indMat = emissiveMat(indColor, 3.0);
    const indMesh = new THREE.Mesh(indGeo, indMat);
    indMesh.position.set(
      Math.cos(indAngle) * indR,
      2.5,
      Math.sin(indAngle) * indR
    );
    indMesh.name = `statusLight_${ind}`;
    indicatorGroup.add(indMesh);
    meshes[`statusLight_${ind}`] = indMesh;
  }
  group.add(indicatorGroup);

  // =========================================================================
  // PARTS MANIFEST (18 hyper-detailed parts)
  // =========================================================================

  const parts = [
    {
      name: 'Naked Singularity Core',
      description: 'A ring singularity of a super-extremal Kerr-Newman solution (a² + Q² > M²) with no event horizon. The exposed curvature source radiates unbounded tidal forces visible from spatial infinity, violating cosmic censorship.',
      material: 'Degenerate fermionic matter compressed beyond nuclear density',
      function: 'Serves as the gravitational engine and infinite-density energy source',
      assemblyOrder: 1,
      connections: ['Cauchy Horizon Region', 'Accretion Disk'],
      failureEffect: 'Complete loss of gravitational gradient — energy extraction ceases',
      cascadeFailures: ['Energy Extraction Arrays', 'Infinite Blueshift Surface'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Cauchy Horizon Region',
      description: 'The inner Cauchy horizon (r₋) of the Kerr-Newman metric where deterministic predictability of GR breaks down. Subject to mass-inflation instability where even infinitesimal perturbations are blueshifted to divergent energies.',
      material: 'Spacetime manifold with pathological causal structure',
      function: 'Marks the boundary of Cauchy development; used as computational clock reference',
      assemblyOrder: 2,
      connections: ['Naked Singularity Core', 'Infinite Blueshift Surface'],
      failureEffect: 'Loss of deterministic physics reference frame, computation becomes acausal',
      cascadeFailures: ['Infinite Blueshift Surface', 'Control Station'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: 0 },
    },
    {
      name: 'Energy Extraction Arrays',
      description: 'Eight orbital superradiant-scattering pylons positioned at the ergoregion boundary, exploiting the Penrose process and superradiant amplification to extract rotational energy from the super-extremal singularity.',
      material: 'Neutronium-reinforced exotic matter composite with negative energy density cladding',
      function: 'Extracts rotational and electromagnetic energy via superradiant wave scattering',
      assemblyOrder: 4,
      connections: ['Central Energy Bus', 'Naked Singularity Core'],
      failureEffect: 'Energy output drops to zero; device becomes parasitic on external power',
      cascadeFailures: ['Central Energy Bus', 'Control Station'],
      originalPosition: { x: 2.8, y: 0, z: 0 },
      explodedPosition: { x: 8, y: 0, z: 0 },
    },
    {
      name: 'Central Energy Bus',
      description: 'A toroidal superconducting bus ring connecting all eight extraction pylons, aggregating extracted energy into a coherent output beam via constructive superradiant interference.',
      material: 'Room-temperature topological superconductor (Tc > 10⁶ K)',
      function: 'Aggregates and distributes harvested singularity energy',
      assemblyOrder: 5,
      connections: ['Energy Extraction Arrays', 'Containment Superstructure'],
      failureEffect: 'Energy distribution failure — localized overload in individual pylons',
      cascadeFailures: ['Energy Extraction Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 0 },
    },
    {
      name: 'Infinite Blueshift Surface',
      description: 'A computation shell positioned at the infinite-blueshift surface where infalling photons are frequency-shifted without bound, enabling transfinite Turing-degree hypercomputation by exploiting the Malament-Hogarth spacetime structure.',
      material: 'Planck-scale quantum computational substrate',
      function: 'Performs hypercomputation at infinite clock rate via gravitational blueshift',
      assemblyOrder: 3,
      connections: ['Cauchy Horizon Region', 'Computation Node Lattice'],
      failureEffect: 'Computational output drops from ℵ₁ to finite operations — effectively zero',
      cascadeFailures: ['Computation Node Lattice', 'Data Transfer Arcs'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 8, z: 0 },
    },
    {
      name: 'Computation Node Lattice',
      description: 'Eighty quantum-gravitational processors distributed on the blueshift surface in a Fibonacci spiral pattern, each node performing ω-sequence computations and communicating results via null geodesic data arcs.',
      material: 'Topological qubit arrays embedded in spin-foam lattice',
      function: 'Distributed hypercomputation across the blueshift surface',
      assemblyOrder: 6,
      connections: ['Infinite Blueshift Surface', 'Data Transfer Arcs'],
      failureEffect: 'Partial computation loss; remaining nodes compensate at reduced throughput',
      cascadeFailures: ['Data Transfer Arcs'],
      originalPosition: { x: 1.66, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 8, z: 0 },
    },
    {
      name: 'Accretion Disk',
      description: 'An 18-ring differentially-rotating accretion disk feeding matter into the singularity. Inner rings reach temperatures exceeding 10⁹ K, emitting hard X-rays and exhibiting magneto-rotational instability (MRI) turbulence.',
      material: 'Ionized plasma at relativistic temperatures',
      function: 'Feeds matter to sustain singularity mass and provides secondary thermal energy',
      assemblyOrder: 7,
      connections: ['Naked Singularity Core', 'Spiral Density Waves'],
      failureEffect: 'Singularity mass decreases via Hawking-like radiation — eventual evaporation',
      cascadeFailures: ['Naked Singularity Core', 'Energy Extraction Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 0 },
    },
    {
      name: 'Spiral Density Waves',
      description: 'Four logarithmic spiral arms within the accretion disk caused by gravitational torques and magneto-hydrodynamic instabilities, channeling matter inward at controlled rates.',
      material: 'Magnetically channeled plasma filaments',
      function: 'Regulates mass infall rate to maintain singularity stability',
      assemblyOrder: 8,
      connections: ['Accretion Disk'],
      failureEffect: 'Uncontrolled mass infall — risk of singularity spin-down below critical threshold',
      cascadeFailures: ['Accretion Disk', 'Naked Singularity Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 0 },
    },
    {
      name: 'Relativistic Jets',
      description: 'Bipolar magnetically collimated outflows along the rotation axis, launched by the Blandford-Znajek mechanism from the ergosphere, carrying away excess angular momentum at 0.99c.',
      material: 'Pair plasma (electron-positron) at Lorentz factor γ ≈ 100',
      function: 'Exhaust channel for excess angular momentum and energy; secondary thrust source',
      assemblyOrder: 9,
      connections: ['Accretion Disk', 'Magnetic Confinement Coils'],
      failureEffect: 'Angular momentum buildup — singularity spin exceeds stability threshold',
      cascadeFailures: ['Containment Superstructure', 'Magnetic Confinement Coils'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 },
    },
    {
      name: 'Photon Sphere',
      description: 'The unstable circular photon orbit at r = 3M/2 (modified for charge and spin) where photons orbit the singularity indefinitely. Used as an optical resonator for coherent light amplification.',
      material: 'Vacuum spacetime with critical curvature',
      function: 'Gravitational light trap and coherent amplification cavity',
      assemblyOrder: 10,
      connections: ['Naked Singularity Core', 'Einstein Rings'],
      failureEffect: 'Loss of optical confinement — scattered high-energy photons escape',
      cascadeFailures: ['Einstein Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 4, y: 4, z: 0 },
    },
    {
      name: 'Einstein Rings',
      description: 'Five nested gravitational lensing rings at increasing radii, each one an image of the entire sky distorted by the singularity\'s gravitational field. Used for omnidirectional observation.',
      material: 'Observed electromagnetic radiation shaped by geodesic focusing',
      function: 'Gravitational telescope providing 4π steradian observation capability',
      assemblyOrder: 11,
      connections: ['Photon Sphere', 'Control Station'],
      failureEffect: 'Loss of environmental awareness — blind operation',
      cascadeFailures: ['Control Station'],
      originalPosition: { x: 2.2, y: 0, z: 0 },
      explodedPosition: { x: 9, y: 4, z: 0 },
    },
    {
      name: 'Geodesic Containment Cage',
      description: 'An icosahedral geodesic framework of exotic-matter struts maintaining negative energy density to stabilize the naked singularity against collapse into a black hole (re-forming an event horizon).',
      material: 'Casimir-effect exotic matter with ρ + p < 0 (violates NEC)',
      function: 'Prevents cosmic censorship from re-clothing the singularity with an event horizon',
      assemblyOrder: 12,
      connections: ['Exotic Matter Struts', 'Magnetic Confinement Coils'],
      failureEffect: 'Event horizon forms — singularity becomes a standard black hole, all systems fail',
      cascadeFailures: ['ALL SYSTEMS'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 12 },
    },
    {
      name: 'Magnetic Confinement Coils',
      description: 'Three orthogonal toroidal superconducting coils generating 10¹⁵ Tesla fields to confine the accretion disk plasma and stabilize relativistic jet collimation.',
      material: 'Type-III topological superconductor at 10⁶ K critical temperature',
      function: 'Magnetic confinement of plasma and jet stabilization',
      assemblyOrder: 13,
      connections: ['Geodesic Containment Cage', 'Superconductor Coolant Lines'],
      failureEffect: 'Plasma escapes confinement — catastrophic radiation exposure',
      cascadeFailures: ['Accretion Disk', 'Relativistic Jets'],
      originalPosition: { x: 4, y: 0, z: 0 },
      explodedPosition: { x: 10, y: 0, z: 0 },
    },
    {
      name: 'Control Station',
      description: 'A hardened observation/command platform with tinted radiation-shielding canopy, holographic metric tensor displays, and dual joystick spacetime geometry controls for real-time manipulation.',
      material: 'Radiation-hardened metamaterial composite with embedded Faraday cage',
      function: 'Operator interface for singularity parameter control and monitoring',
      assemblyOrder: 14,
      connections: ['Einstein Rings', 'Holographic Displays'],
      failureEffect: 'Loss of manual control — system reverts to autonomous mode',
      cascadeFailures: ['Holographic Displays'],
      originalPosition: { x: 6.5, y: -2, z: 0 },
      explodedPosition: { x: 14, y: -2, z: 0 },
    },
    {
      name: 'Spacetime Metric Grid',
      description: 'A visual diagnostic showing the embedding diagram of the equatorial plane, with grid deformation proportional to the Schwarzschild-like curvature (modified for Q, a parameters). Provides real-time feedback on metric stability.',
      material: 'Holographic force-field projection',
      function: 'Visual diagnostic of spacetime curvature health',
      assemblyOrder: 15,
      connections: ['Control Station'],
      failureEffect: 'Operators lose curvature situational awareness',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -3.5, z: 0 },
      explodedPosition: { x: 0, y: -12, z: 0 },
    },
    {
      name: 'Matter Infall Streams',
      description: 'Six channeled matter streams spiraling inward from the outer accretion zone, each particle following timelike geodesics of the Kerr-Newman metric with visible frame-dragging precession.',
      material: 'Baryonic matter at 10⁸ K undergoing gravitational compression',
      function: 'Controlled matter feed maintaining singularity mass-energy balance',
      assemblyOrder: 16,
      connections: ['Accretion Disk', 'Naked Singularity Core'],
      failureEffect: 'Mass feed interruption — singularity begins Hawking evaporation',
      cascadeFailures: ['Accretion Disk'],
      originalPosition: { x: 4.5, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 6, z: 0 },
    },
    {
      name: 'Status Indicator Array',
      description: 'Sixteen radiation-hardened status beacons distributed on the containment cage perimeter, color-coded (red/amber/green) for singularity stability, energy output, and Cauchy horizon integrity.',
      material: 'Cerenkov-radiation-powered solid-state emitters',
      function: 'Visual status monitoring of all critical subsystems',
      assemblyOrder: 17,
      connections: ['Geodesic Containment Cage', 'Control Station'],
      failureEffect: 'Loss of visual status awareness at distance',
      cascadeFailures: [],
      originalPosition: { x: 5, y: 2.5, z: 0 },
      explodedPosition: { x: 12, y: 8, z: 0 },
    },
    {
      name: 'Data Transfer Arcs',
      description: 'Twenty null-geodesic communication channels linking computation nodes via curved spacetime paths, achieving zero-latency data transfer by exploiting closed timelike curve adjacency near the Cauchy horizon.',
      material: 'Modulated gravitational wave carriers',
      function: 'Inter-node communication for distributed hypercomputation',
      assemblyOrder: 18,
      connections: ['Computation Node Lattice', 'Infinite Blueshift Surface'],
      failureEffect: 'Computation nodes become isolated — throughput drops by orders of magnitude',
      cascadeFailures: ['Computation Node Lattice'],
      originalPosition: { x: 1.5, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 10, z: 0 },
    },
  ];

  // =========================================================================
  // QUIZ QUESTIONS — PhD-level General Relativity
  // =========================================================================

  const quizQuestions = [
    {
      question: 'The weak cosmic censorship conjecture (Penrose, 1969) asserts that naked singularities cannot form from generic initial conditions in gravitational collapse. Which of the following scenarios most directly challenges this conjecture?',
      options: [
        'Oppenheimer-Snyder dust collapse producing a Schwarzschild black hole',
        'Super-extremal Kerr-Newman solution with a² + Q² > M² formed by over-spinning a near-extremal black hole via particle capture',
        'Vaidya radiating spacetime with monotonically decreasing mass function',
        'Kasner cosmological singularity in vacuum Bianchi-I spacetime',
      ],
      correctIndex: 1,
      explanation: 'A super-extremal Kerr-Newman solution (a² + Q² > M²) has no event horizon, yielding a naked singularity visible from future null infinity. If such a state can be reached by physical processes (e.g., over-spinning via captured particles as explored by Wald, Jacobson, and Sotiriou), it would violate weak cosmic censorship. However, the third law of black hole mechanics and backreaction effects have been shown to prevent this in most careful analyses, preserving the conjecture.',
    },
    {
      question: 'In the maximally extended Kerr solution, the inner (Cauchy) horizon at r = r₋ is subject to the mass-inflation instability (Poisson & Israel, 1990). What is the physical mechanism driving this instability?',
      options: [
        'Pair production in the strong electric field near the singularity (Schwinger mechanism)',
        'Exponential blueshift of infalling radiation at the Cauchy horizon causing the Kretschmer scalar to diverge while the metric remains continuous',
        'Superradiant amplification of bosonic fields extracting rotational energy',
        'Hawking radiation backreaction modifying the surface gravity to zero',
      ],
      correctIndex: 1,
      explanation: 'The mass-inflation instability occurs because radiation crossing the Cauchy horizon undergoes infinite blueshift (exponential in advanced time). The locally measured energy density diverges, causing the Misner-Sharp internal mass function m(v,r) to inflate exponentially. Crucially, while curvature invariants diverge, the metric itself remains C⁰ (continuous but not C¹), creating a "weak null singularity" that replaces the smooth Cauchy horizon.',
    },
    {
      question: 'Consider a Kerr-Newman black hole with mass M, angular momentum J = aM, and charge Q. Under what precise condition does this solution describe a naked singularity rather than a black hole?',
      options: [
        'a² + Q² = M² (extremal case)',
        'a² + Q² > M² (super-extremal case)',
        'a² + Q² < M² with a > 0',
        'Q > M regardless of angular momentum',
      ],
      correctIndex: 1,
      explanation: 'The horizons of the Kerr-Newman metric are located at r± = M ± √(M² - a² - Q²). When a² + Q² > M², the discriminant becomes negative, and no real roots exist — meaning no horizons form. The ring singularity at r = 0, θ = π/2 is then globally naked, visible from all of spacetime. The extremal case a² + Q² = M² has a degenerate horizon (r₊ = r₋ = M).',
    },
    {
      question: 'In a Malament-Hogarth spacetime (used for gravitational hypercomputation), what topological/causal property distinguishes it from globally hyperbolic spacetimes and enables supertask computation?',
      options: [
        'It contains closed timelike curves (CTCs) in every neighborhood of every point',
        'It admits a Cauchy surface from which all of spacetime can be uniquely predicted',
        'There exists a timelike worldline of infinite proper length whose entire future is contained in the causal past of a single event on another worldline',
        'The spacetime has a compact Cauchy horizon with everywhere positive expansion',
      ],
      correctIndex: 2,
      explanation: 'A Malament-Hogarth spacetime contains a worldline γ of infinite proper time such that γ ⊂ J⁻(p) for some event p (i.e., the entire infinite worldline lies in the causal past of p). A computer traveling along γ can complete infinitely many computational steps, and an observer at p can receive the result in finite proper time. This violates global hyperbolicity because the spacetime cannot admit a Cauchy surface — the Cauchy horizon is precisely where this hypercomputational signal arrives.',
    },
    {
      question: 'The Penrose process extracts energy from a rotating black hole by exploiting negative-energy orbits in the ergosphere. For a naked singularity (super-extremal Kerr), how does energy extraction fundamentally differ from the standard Penrose process?',
      options: [
        'It is impossible — the Penrose process requires an event horizon',
        'The ergosphere still exists but extraction efficiency is bounded at 20.7% as with black holes',
        'Without a horizon, there is no ergoregion, so energy extraction relies entirely on electromagnetic coupling',
        'The ergoregion persists and extraction efficiency can in principle exceed 100% of the rest mass of infalling particles because superradiant modes are not bounded by the horizon area theorem',
      ],
      correctIndex: 3,
      explanation: 'For a super-extremal Kerr solution, the ergoregion (where ∂/∂t becomes spacelike) still exists even though no horizon is present. The absence of a horizon removes the area theorem constraint (dA ≥ 0) that limits energy extraction from black holes. In principle, the rotational energy can be extracted without bound until the object spins down to sub-extremal parameters, at which point a horizon forms. This unconstrained extraction is precisely what the energy extraction arrays exploit.',
    },
  ];

  // =========================================================================
  // ANIMATION FUNCTION — rich, synchronized, physically-motivated
  // =========================================================================

  function animate(time, speed, _meshes) {
    const t = time * speed;

    // --- Singularity core pulsation ---
    if (meshes.singularityPoint) {
      const pulseFactor = 1.0 + 0.15 * Math.sin(t * 8.0);
      meshes.singularityPoint.scale.setScalar(pulseFactor);
      meshes.singularityPoint.material.emissiveIntensity = 10.0 + 4.0 * Math.sin(t * 12.0);
    }

    // --- Curvature shells chaotic rotation ---
    if (meshes.curvatureShell1) {
      meshes.curvatureShell1.rotation.x = t * 1.2;
      meshes.curvatureShell1.rotation.y = t * 0.7;
      meshes.curvatureShell1.rotation.z = Math.sin(t * 0.5) * 0.3;
    }
    if (meshes.curvatureShell2) {
      meshes.curvatureShell2.rotation.x = -t * 0.9;
      meshes.curvatureShell2.rotation.y = t * 1.1;
    }

    // --- Tidal force ring oscillation ---
    if (meshes.tidalForceRing) {
      meshes.tidalForceRing.scale.x = 1.0 + 0.1 * Math.sin(t * 3.0);
      meshes.tidalForceRing.scale.z = 1.0 - 0.1 * Math.sin(t * 3.0);
      meshes.tidalForceRing.rotation.z = t * 0.5;
    }

    // --- Weyl tensor rings gyroscopic precession ---
    for (let i = 0; i < 3; i++) {
      const wr = meshes[`weylTensorRing_${i}`];
      if (wr) {
        wr.rotation.x += 0.008 * (i + 1);
        wr.rotation.y += 0.006 * (3 - i);
      }
    }

    // --- Cauchy horizon shell instability flicker ---
    if (meshes.cauchyHorizonShell) {
      meshes.cauchyHorizonShell.material.opacity = 0.15 + 0.08 * Math.sin(t * 6.0 + Math.cos(t * 2.0));
      meshes.cauchyHorizonShell.rotation.y = t * 0.1;
    }

    // Cauchy flux shells chaotic jitter
    for (let i = 0; i < 4; i++) {
      const fs = meshes[`cauchyFluxShell_${i}`];
      if (fs) {
        fs.rotation.x = t * (0.3 + i * 0.15) + Math.sin(t * (2 + i)) * 0.2;
        fs.rotation.y = t * (0.2 + i * 0.1);
        const jitter = 1.0 + 0.02 * Math.sin(t * 10 + i * 1.5);
        fs.scale.setScalar(jitter);
      }
    }

    // Mass inflation markers pulsation
    for (let j = 0; j < 30; j++) {
      const marker = meshes[`massInflationMarker_${j}`];
      if (marker) {
        const mPulse = 0.5 + 0.5 * Math.sin(t * 8.0 + j * 0.7);
        marker.material.emissiveIntensity = 2.0 + mPulse * 6.0;
        marker.scale.setScalar(0.8 + mPulse * 0.5);
      }
    }

    // Cauchy latitude rings wave propagation
    for (let k = 0; k < 6; k++) {
      const lat = meshes[`cauchyLatitude_${k}`];
      if (lat) {
        lat.rotation.z = t * 0.3 + k * 0.5;
        const wave = 1.0 + 0.05 * Math.sin(t * 4.0 - k * 1.0);
        lat.scale.setScalar(wave);
      }
    }

    // --- Extraction pylons orbit around singularity ---
    if (meshes.extractionGroup) {
      meshes.extractionGroup.rotation.y = t * 0.15;
    }

    // Collector dishes pulse
    for (let p = 0; p < 8; p++) {
      const dish = meshes[`collectorDish_${p}`];
      if (dish) {
        dish.rotation.y = t * 2.0;
      }
      const conduit = meshes[`energyConduit_${p}`];
      if (conduit) {
        conduit.material.emissiveIntensity = 2.5 + 2.0 * Math.sin(t * 5.0 + p * 0.8);
      }
    }

    // Central energy bus pulse
    if (meshes.centralEnergyBus) {
      meshes.centralEnergyBus.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(t * 3.0);
    }

    // --- Blueshift surface shimmer ---
    if (meshes.blueshiftSphere) {
      meshes.blueshiftSphere.material.opacity = 0.08 + 0.05 * Math.sin(t * 4.0);
      meshes.blueshiftSphere.rotation.y = t * 0.05;
    }

    // Computation nodes blink sequentially
    if (meshes.compNodes) {
      for (let n = 0; n < meshes.compNodes.length; n++) {
        const node = meshes.compNodes[n];
        const phase = (t * 3.0 + n * 0.2) % (Math.PI * 2);
        node.material.emissiveIntensity = 2.0 + 3.0 * Math.max(0, Math.sin(phase));
        node.rotation.x = t * 2.0;
        node.rotation.y = t * 1.5;
      }
    }

    // --- Accretion disk differential rotation ---
    if (meshes.diskRings) {
      for (let dr = 0; dr < meshes.diskRings.length; dr++) {
        // Keplerian: inner rings faster (∝ r^{-3/2})
        const rFactor = 1.8 + dr * 0.18;
        const angVel = 0.5 / Math.pow(rFactor, 1.5);
        meshes.diskRings[dr].rotation.z = t * angVel * 10.0;
      }
    }

    // Spiral arms rotate with disk
    if (meshes.spiralArms) {
      for (let s = 0; s < meshes.spiralArms.length; s++) {
        meshes.spiralArms[s].rotation.y = t * 0.08;
      }
    }

    // Disk hotspot flicker
    for (let hs = 0; hs < 12; hs++) {
      const hotspot = meshes[`diskHotspot_${hs}`];
      if (hotspot) {
        hotspot.material.emissiveIntensity = 3.0 + 3.0 * Math.sin(t * 7.0 + hs * 1.3);
        // Orbit hotspots
        const hsR = hotspot.position.length();
        const hsAngVel = 0.5 / Math.pow(hsR, 1.5);
        const baseAngle = Math.atan2(hotspot.position.z, hotspot.position.x);
        hotspot.position.x = Math.cos(baseAngle + t * hsAngVel * 0.1) * hsR;
        hotspot.position.z = Math.sin(baseAngle + t * hsAngVel * 0.1) * hsR;
      }
    }

    // Relativistic jets pulsation
    for (let j = 0; j < 2; j++) {
      const jet = meshes[`relativisticJet_${j}`];
      if (jet) {
        const jetPulse = 1.0 + 0.08 * Math.sin(t * 6.0 + j * Math.PI);
        jet.scale.x = jetPulse;
        jet.scale.z = jetPulse;
        jet.material.opacity = 0.25 + 0.1 * Math.sin(t * 4.0);
      }
    }

    // --- Photon sphere subtle breathe ---
    if (meshes.photonSphere) {
      const breathe = 1.0 + 0.02 * Math.sin(t * 2.0);
      meshes.photonSphere.scale.setScalar(breathe);
    }

    // Einstein rings slow precession
    for (let er = 0; er < 5; er++) {
      const ring = meshes[`einsteinRing_${er}`];
      if (ring) {
        ring.rotation.z = t * 0.02 * (er + 1);
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + er) * 0.05;
      }
    }

    // --- Containment cage slow rotation ---
    if (meshes.geodesicCage) {
      meshes.geodesicCage.rotation.y = t * 0.02;
      meshes.geodesicCage.rotation.x = Math.sin(t * 0.1) * 0.02;
    }

    // Magnetic coils counter-rotation
    for (let mc = 0; mc < 3; mc++) {
      const coil = meshes[`magneticCoil_${mc}`];
      if (coil) {
        coil.rotation.z += 0.003 * (mc % 2 === 0 ? 1 : -1);
      }
    }

    // --- Holographic screens flicker ---
    for (let scr = 0; scr < 3; scr++) {
      const screen = meshes[`holoScreen_${scr}`];
      if (screen) {
        screen.material.emissiveIntensity = 2.0 + 1.0 * Math.sin(t * 10.0 + scr * 2.0);
      }
    }

    // --- Matter infall particle spiraling ---
    if (meshes.streamParticles) {
      for (let sp = 0; sp < meshes.streamParticles.length; sp++) {
        const p = meshes.streamParticles[sp];
        const ud = p.userData;
        // Animate spiral inward, then reset
        const cycle = (t * 0.3 + ud.paramT) % 1.0;
        const currentR = 4.5 * (1 - cycle);
        const currentA = ud.streamAngleOff + cycle * Math.PI * 5 + t * 0.5;
        p.position.x = currentR * Math.cos(currentA);
        p.position.z = currentR * Math.sin(currentA);
        p.position.y = (Math.sin(currentA * 3) * 0.15) * (1 - cycle);
        // Brighten as approaching singularity
        p.material.emissiveIntensity = 2.0 + cycle * 6.0;
        p.scale.setScalar(1.0 - cycle * 0.6);
      }
    }

    // --- Status lights blink pattern ---
    for (let ind = 0; ind < 16; ind++) {
      const light = meshes[`statusLight_${ind}`];
      if (light) {
        const blinkPhase = (t * 2.0 + ind * 0.4) % (Math.PI * 2);
        light.material.emissiveIntensity = 1.5 + 2.5 * Math.max(0, Math.sin(blinkPhase));
      }
    }

    // --- Spacetime grid undulation ---
    if (meshes.spacetimeWarpGrid) {
      const gridPos = meshes.spacetimeWarpGrid.geometry.attributes.position;
      for (let gi = 0; gi < gridPos.count; gi++) {
        const gx = gridPos.getX(gi);
        const gy = gridPos.getY(gi);
        const gDist = Math.sqrt(gx * gx + gy * gy);
        const baseWarp = gDist > 0.5 ? -2.0 / (gDist + 0.3) : -4.0;
        const wave = Math.sin(gDist * 2.0 - t * 2.0) * 0.15;
        gridPos.setZ(gi, baseWarp + wave);
      }
      gridPos.needsUpdate = true;
      meshes.spacetimeWarpGrid.geometry.computeVertexNormals();
    }
  }

  // =========================================================================
  // DESCRIPTION
  // =========================================================================

  const description = `The Naked Singularity Harness is an ultra-god-tier device that exploits a super-extremal Kerr-Newman singularity (a² + Q² > M²) — one possessing no event horizon — for limitless energy extraction and transfinite hypercomputation.

At its core lies an exposed ring singularity of infinite curvature, surrounded by a turbulent Cauchy horizon region where deterministic physics breaks down due to mass-inflation instability. Eight orbital energy extraction pylons employ the Penrose process and superradiant scattering to harvest rotational energy without the constraints of the black hole area theorem.

An infinite-blueshift computation surface hosts 80 quantum-gravitational nodes performing ω-sequence hypercomputations in Malament-Hogarth spacetime, where infinite proper-time computations can be completed and their results received in finite observer time.

The system is fed by a differentially-rotating accretion disk with spiral density waves, while bipolar relativistic jets carry away excess angular momentum via the Blandford-Znajek mechanism. Gravitational lensing is visualized through Einstein rings and the photon sphere.

An exotic-matter geodesic cage (violating the null energy condition) actively prevents cosmic censorship from re-forming an event horizon, maintaining the singularity in its naked state.

WARNING: Operation of this device may violate the Weak Cosmic Censorship Conjecture, the Strong Cosmic Censorship Conjecture, and possibly the second law of thermodynamics as understood by any civilization below Kardashev Type III.`;

  return { group, parts, description, quizQuestions, animate };
}
