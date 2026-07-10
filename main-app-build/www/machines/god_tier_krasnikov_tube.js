// god_tier_krasnikov_tube.js
// Ultra God Tier – Krasnikov Tube: Permanent Spacetime Corridor for FTL Travel
// A hyper-realistic, massively detailed THREE.js model of a Krasnikov tube
// with exotic-matter walls, tilting light cones, superluminal ship transit,
// entry/exit portals, metric ripple propagation, and extreme animation.

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/* ------------------------------------------------------------------ */
/*  Helper: generate a smooth spline path along the tube corridor      */
/* ------------------------------------------------------------------ */
function buildCorridorSpline(THREE, length, amplitude, segments) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = (t - 0.5) * length;
    const y = Math.sin(t * Math.PI * 4) * amplitude * 0.12;
    const z = Math.cos(t * Math.PI * 4) * amplitude * 0.12;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/* ------------------------------------------------------------------ */
/*  Helper: build a single light-cone mesh (two opposing cones)        */
/* ------------------------------------------------------------------ */
function buildLightCone(THREE, scale, emissiveColor) {
  const group = new THREE.Group();
  const coneGeo = new THREE.ConeGeometry(scale * 0.35, scale * 0.7, 16, 1, true);
  const coneMat = new THREE.MeshStandardMaterial({
    color: emissiveColor,
    emissive: emissiveColor,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    wireframe: true,
    depthWrite: false
  });
  const futCone = new THREE.Mesh(coneGeo, coneMat);
  futCone.position.y = scale * 0.35;
  group.add(futCone);
  const pastCone = new THREE.Mesh(coneGeo, coneMat.clone());
  pastCone.rotation.x = Math.PI;
  pastCone.position.y = -scale * 0.35;
  group.add(pastCone);
  return group;
}

/* ------------------------------------------------------------------ */
/*  Helper: portal ring – elaborate torus + radial spokes + glow       */
/* ------------------------------------------------------------------ */
function buildPortalRing(THREE, radius, portalColor) {
  const pg = new THREE.Group();

  // Main torus ring
  const torusGeo = new THREE.TorusGeometry(radius, radius * 0.06, 32, 128);
  const torusMat = new THREE.MeshStandardMaterial({
    color: portalColor, emissive: portalColor, emissiveIntensity: 1.4,
    metalness: 0.95, roughness: 0.1
  });
  pg.add(new THREE.Mesh(torusGeo, torusMat));

  // Secondary inner ring
  const innerGeo = new THREE.TorusGeometry(radius * 0.82, radius * 0.03, 24, 96);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: portalColor, emissiveIntensity: 0.8,
    transparent: true, opacity: 0.7, metalness: 0.9, roughness: 0.05
  });
  pg.add(new THREE.Mesh(innerGeo, innerMat));

  // Tertiary outer ring
  const outerGeo = new THREE.TorusGeometry(radius * 1.12, radius * 0.025, 20, 80);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff, emissive: 0x3366ff, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.45
  });
  pg.add(new THREE.Mesh(outerGeo, outerMat));

  // Radial exotic-matter injector spokes – 24 spokes
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const spokeLen = radius * 0.28;
    const spokeGeo = new THREE.CylinderGeometry(radius * 0.012, radius * 0.008, spokeLen, 8);
    const spokeMat = new THREE.MeshStandardMaterial({
      color: 0xccddff, emissive: portalColor, emissiveIntensity: 0.5,
      metalness: 0.85, roughness: 0.15
    });
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.position.set(
      Math.cos(angle) * (radius - spokeLen * 0.5),
      0,
      Math.sin(angle) * (radius - spokeLen * 0.5)
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = -angle;
    pg.add(spoke);

    // Tiny emitter node at each spoke tip
    const nodeGeo = new THREE.SphereGeometry(radius * 0.02, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x00ffff, emissiveIntensity: 2.0
    });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(
      Math.cos(angle) * (radius * 0.72),
      0,
      Math.sin(angle) * (radius * 0.72)
    );
    pg.add(node);
  }

  // Portal membrane (semi-transparent disc)
  const discGeo = new THREE.CircleGeometry(radius * 0.78, 64);
  const discMat = new THREE.MeshStandardMaterial({
    color: portalColor, emissive: portalColor, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  pg.add(disc);

  // Chevron markers – 8 directional glyphs
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const chevShape = new THREE.Shape();
    const cs = radius * 0.04;
    chevShape.moveTo(0, cs);
    chevShape.lineTo(cs * 0.6, 0);
    chevShape.lineTo(0, -cs);
    chevShape.lineTo(-cs * 0.6, 0);
    chevShape.closePath();
    const chevGeo = new THREE.ExtrudeGeometry(chevShape, { depth: radius * 0.01, bevelEnabled: false });
    const chevMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00, emissive: 0xff8800, emissiveIntensity: 1.2, metalness: 0.7
    });
    const chev = new THREE.Mesh(chevGeo, chevMat);
    chev.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    chev.rotation.y = -a;
    pg.add(chev);
  }

  return pg;
}

/* ------------------------------------------------------------------ */
/*  Helper: exotic matter wall segment (glowing lattice tube)          */
/* ------------------------------------------------------------------ */
function buildExoticMatterLining(THREE, path, tubeRadius, wallSegments) {
  const group = new THREE.Group();

  // Primary tube wall – wireframe lattice
  const tubeGeo = new THREE.TubeGeometry(path, wallSegments, tubeRadius, 48, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x6600cc, emissive: 0x9933ff, emissiveIntensity: 0.7,
    wireframe: true, transparent: true, opacity: 0.35, side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(tubeGeo, tubeMat));

  // Inner exotic-matter glow layer
  const innerGeo = new THREE.TubeGeometry(path, wallSegments, tubeRadius * 0.92, 36, false);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff44ff, emissiveIntensity: 1.1,
    transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false
  });
  group.add(new THREE.Mesh(innerGeo, innerMat));

  // Outer containment shell
  const outerGeo = new THREE.TubeGeometry(path, wallSegments, tubeRadius * 1.08, 32, false);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x2200aa, emissive: 0x4400cc, emissiveIntensity: 0.4,
    wireframe: true, transparent: true, opacity: 0.18, side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(outerGeo, outerMat));

  // Exotic matter nodes along the tube – energy concentrators
  const nodeCount = 60;
  for (let i = 0; i < nodeCount; i++) {
    const t = i / nodeCount;
    const pos = path.getPointAt(t);
    const tangent = path.getTangentAt(t);

    // Radial ring of nodes at each station
    const ringNodeCount = 8;
    for (let j = 0; j < ringNodeCount; j++) {
      const ra = (j / ringNodeCount) * Math.PI * 2;
      const up = new THREE.Vector3(0, 1, 0);
      const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const upDir = new THREE.Vector3().crossVectors(side, tangent).normalize();
      const nodePos = pos.clone()
        .add(side.multiplyScalar(Math.cos(ra) * tubeRadius))
        .add(upDir.multiplyScalar(Math.sin(ra) * tubeRadius));

      const nGeo = new THREE.SphereGeometry(tubeRadius * 0.025, 8, 8);
      const nMat = new THREE.MeshStandardMaterial({
        color: 0xff88ff, emissive: 0xff00ff, emissiveIntensity: 1.5 + Math.sin(i * 0.3) * 0.5,
        transparent: true, opacity: 0.7
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.copy(nodePos);
      group.add(nMesh);
    }
  }

  return group;
}

/* ------------------------------------------------------------------ */
/*  Helper: Metric ripple rings that propagate along the tube          */
/* ------------------------------------------------------------------ */
function buildMetricRipples(THREE, count, tubeRadius) {
  const ripples = [];
  for (let i = 0; i < count; i++) {
    const ripGeo = new THREE.TorusGeometry(tubeRadius * (0.7 + Math.random() * 0.4), tubeRadius * 0.015, 16, 64);
    const ripMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff, emissive: 0x0088ff, emissiveIntensity: 0.8 + Math.random() * 0.6,
      transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false
    });
    const rip = new THREE.Mesh(ripGeo, ripMat);
    rip.userData.phase = Math.random() * Math.PI * 2;
    rip.userData.speed = 0.3 + Math.random() * 0.5;
    rip.rotation.y = Math.PI / 2; // face along tube axis
    ripples.push(rip);
  }
  return ripples;
}

/* ------------------------------------------------------------------ */
/*  Helper: superluminal ship model (detailed multi-part craft)        */
/* ------------------------------------------------------------------ */
function buildShip(THREE, scale, color) {
  const ship = new THREE.Group();

  // Main hull – LatheGeometry profile for aerodynamic shape
  const hullPts = [];
  hullPts.push(new THREE.Vector2(0, -scale * 2.0));
  hullPts.push(new THREE.Vector2(scale * 0.15, -scale * 1.8));
  hullPts.push(new THREE.Vector2(scale * 0.35, -scale * 1.2));
  hullPts.push(new THREE.Vector2(scale * 0.45, -scale * 0.5));
  hullPts.push(new THREE.Vector2(scale * 0.5, 0));
  hullPts.push(new THREE.Vector2(scale * 0.48, scale * 0.4));
  hullPts.push(new THREE.Vector2(scale * 0.4, scale * 0.8));
  hullPts.push(new THREE.Vector2(scale * 0.3, scale * 1.2));
  hullPts.push(new THREE.Vector2(scale * 0.15, scale * 1.6));
  hullPts.push(new THREE.Vector2(0, scale * 1.8));
  const hullGeo = new THREE.LatheGeometry(hullPts, 24);
  const hullMat = new THREE.MeshStandardMaterial({
    color: color, metalness: 0.85, roughness: 0.15, emissive: color, emissiveIntensity: 0.15
  });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.rotation.z = Math.PI / 2;
  ship.add(hull);

  // Engine nacelles – two cylinders on pylons
  for (let side = -1; side <= 1; side += 2) {
    const pylonGeo = new THREE.CylinderGeometry(scale * 0.03, scale * 0.03, scale * 0.6, 8);
    const pylonMat = chrome.clone ? chrome.clone() : new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.9, roughness: 0.1 });
    const pylon = new THREE.Mesh(pylonGeo, pylonMat);
    pylon.position.set(scale * 0.3, side * scale * 0.55, 0);
    pylon.rotation.z = Math.PI / 2;
    ship.add(pylon);

    const nacGeo = new THREE.CylinderGeometry(scale * 0.12, scale * 0.15, scale * 1.0, 16);
    const nacMat = new THREE.MeshStandardMaterial({
      color: 0x334455, metalness: 0.8, roughness: 0.2
    });
    const nacelle = new THREE.Mesh(nacGeo, nacMat);
    nacelle.position.set(scale * 0.3, side * scale * 0.55, 0);
    nacelle.rotation.z = Math.PI / 2;
    ship.add(nacelle);

    // Engine glow
    const glowGeo = new THREE.SphereGeometry(scale * 0.13, 16, 16);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff, emissive: 0x00eeff, emissiveIntensity: 3.0,
      transparent: true, opacity: 0.8
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(scale * 0.82, side * scale * 0.55, 0);
    ship.add(glow);
  }

  // Cockpit canopy
  const cockpitGeo = new THREE.SphereGeometry(scale * 0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const cockpitMat = tinted.clone ? tinted.clone() : new THREE.MeshStandardMaterial({
    color: 0x2244aa, transparent: true, opacity: 0.5, metalness: 0.3, roughness: 0.05
  });
  const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
  cockpit.position.set(-scale * 1.3, 0, 0);
  cockpit.rotation.z = -Math.PI / 2;
  ship.add(cockpit);

  // Dorsal fin
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(-scale * 0.5, scale * 0.4);
  finShape.lineTo(-scale * 0.8, scale * 0.35);
  finShape.lineTo(-scale * 0.4, 0);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: scale * 0.02, bevelEnabled: false });
  const finMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.7, roughness: 0.3 });
  const fin = new THREE.Mesh(finGeo, finMat);
  fin.position.set(scale * 0.2, 0, -scale * 0.01);
  fin.rotation.x = 0;
  ship.add(fin);

  return ship;
}

/* ------------------------------------------------------------------ */
/*  Helper: Exotic matter generator station (placed along the tube)    */
/* ------------------------------------------------------------------ */
function buildGeneratorStation(THREE, scale) {
  const sg = new THREE.Group();

  // Central containment sphere
  const sphereGeo = new THREE.SphereGeometry(scale, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x220044, emissive: 0x6600cc, emissiveIntensity: 0.6,
    metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.6
  });
  sg.add(new THREE.Mesh(sphereGeo, sphereMat));

  // Magnetic confinement coils – 6 torus rings at various angles
  for (let i = 0; i < 6; i++) {
    const coilGeo = new THREE.TorusGeometry(scale * 1.3, scale * 0.04, 16, 48);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 0.8,
      metalness: 0.9, roughness: 0.1
    });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.x = (i / 6) * Math.PI;
    coil.rotation.z = (i / 6) * Math.PI * 0.5;
    sg.add(coil);
  }

  // Energy feed conduits – 4 tubes extending outward
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const conduitGeo = new THREE.CylinderGeometry(scale * 0.05, scale * 0.05, scale * 2.5, 8);
    const conduitMat = new THREE.MeshStandardMaterial({
      color: 0x004488, emissive: 0x0066aa, emissiveIntensity: 0.4, metalness: 0.8
    });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.position.set(Math.cos(a) * scale * 1.6, Math.sin(a) * scale * 1.6, 0);
    conduit.rotation.z = a + Math.PI / 2;
    sg.add(conduit);

    // Conduit tip emitter
    const emGeo = new THREE.OctahedronGeometry(scale * 0.1, 1);
    const emMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5
    });
    const em = new THREE.Mesh(emGeo, emMat);
    em.position.set(Math.cos(a) * scale * 2.8, Math.sin(a) * scale * 2.8, 0);
    sg.add(em);
  }

  // Inner plasma core
  const coreGeo = new THREE.IcosahedronGeometry(scale * 0.4, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff44ff, emissiveIntensity: 2.0,
    wireframe: true, transparent: true, opacity: 0.5
  });
  sg.add(new THREE.Mesh(coreGeo, coreMat));

  return sg;
}

/* ------------------------------------------------------------------ */
/*  Helper: Geodesic grid lattice (curved spacetime visualiser)        */
/* ------------------------------------------------------------------ */
function buildGeodesicGrid(THREE, tubeRadius, length, gridColor) {
  const gridGroup = new THREE.Group();
  const gridMat = new THREE.MeshStandardMaterial({
    color: gridColor, emissive: gridColor, emissiveIntensity: 0.3,
    transparent: true, opacity: 0.1, wireframe: true, side: THREE.DoubleSide
  });

  // Longitudinal geodesic lines
  const lineCount = 32;
  for (let i = 0; i < lineCount; i++) {
    const a = (i / lineCount) * Math.PI * 2;
    const pts = [];
    for (let s = 0; s <= 80; s++) {
      const t = s / 80;
      const x = (t - 0.5) * length;
      const distort = 1.0 + 0.08 * Math.sin(t * Math.PI * 6);
      pts.push(new THREE.Vector3(
        x,
        Math.cos(a) * tubeRadius * 1.15 * distort,
        Math.sin(a) * tubeRadius * 1.15 * distort
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const lineGeo = new THREE.TubeGeometry(curve, 80, tubeRadius * 0.005, 4, false);
    gridGroup.add(new THREE.Mesh(lineGeo, gridMat));
  }

  return gridGroup;
}

/* ------------------------------------------------------------------ */
/*  Helper: Chronology protection field visualiser                     */
/* ------------------------------------------------------------------ */
function buildChronologyField(THREE, radius, length) {
  const cfGroup = new THREE.Group();
  const shellGeo = new THREE.CylinderGeometry(radius * 1.35, radius * 1.35, length * 0.95, 64, 1, true);
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff44, emissiveIntensity: 0.35,
    transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false
  });
  cfGroup.add(new THREE.Mesh(shellGeo, shellMat));

  // CTC-prevention marker rings
  for (let i = 0; i < 12; i++) {
    const rg = new THREE.TorusGeometry(radius * 1.35, radius * 0.008, 8, 48);
    const rm = new THREE.MeshStandardMaterial({
      color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.25
    });
    const ring = new THREE.Mesh(rg, rm);
    ring.position.x = (i / 11 - 0.5) * length * 0.9;
    ring.rotation.y = Math.PI / 2;
    cfGroup.add(ring);
  }

  return cfGroup;
}

/* ================================================================== */
/*                       MAIN EXPORT                                   */
/* ================================================================== */
export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  const TUBE_LENGTH = 30;
  const TUBE_RADIUS = 2.2;
  const CORRIDOR_SEGMENTS = 200;

  // ── 1. CORRIDOR SPLINE ──────────────────────────────────────────
  const corridorPath = buildCorridorSpline(THREE, TUBE_LENGTH, TUBE_RADIUS, CORRIDOR_SEGMENTS);

  // ── 2. EXOTIC MATTER LINING ─────────────────────────────────────
  const exoticLining = buildExoticMatterLining(THREE, corridorPath, TUBE_RADIUS, CORRIDOR_SEGMENTS);
  exoticLining.name = 'exoticMatterLining';
  group.add(exoticLining);
  meshes.exoticLining = exoticLining;

  // ── 3. GEODESIC GRID (curved spacetime visualiser) ──────────────
  const geodesicGrid = buildGeodesicGrid(THREE, TUBE_RADIUS, TUBE_LENGTH, 0x4488ff);
  geodesicGrid.name = 'geodesicGrid';
  group.add(geodesicGrid);
  meshes.geodesicGrid = geodesicGrid;

  // ── 4. ENTRY PORTAL (negative-x end) ───────────────────────────
  const entryPortal = buildPortalRing(THREE, TUBE_RADIUS * 1.1, 0x00ccff);
  entryPortal.name = 'entryPortal';
  entryPortal.position.set(-TUBE_LENGTH * 0.5, 0, 0);
  entryPortal.rotation.y = Math.PI / 2;
  group.add(entryPortal);
  meshes.entryPortal = entryPortal;

  // ── 5. EXIT PORTAL (positive-x end) ────────────────────────────
  const exitPortal = buildPortalRing(THREE, TUBE_RADIUS * 1.1, 0xff6600);
  exitPortal.name = 'exitPortal';
  exitPortal.position.set(TUBE_LENGTH * 0.5, 0, 0);
  exitPortal.rotation.y = Math.PI / 2;
  group.add(exitPortal);
  meshes.exitPortal = exitPortal;

  // ── 6. LIGHT CONES (20 tilting cones along the corridor) ───────
  const lightCones = [];
  const CONE_COUNT = 20;
  for (let i = 0; i < CONE_COUNT; i++) {
    const t = (i + 0.5) / CONE_COUNT;
    const cone = buildLightCone(THREE, TUBE_RADIUS * 0.3, 0xffff44);
    const pos = corridorPath.getPointAt(t);
    cone.position.copy(pos);
    cone.userData.t = t;
    cone.name = `lightCone_${i}`;
    group.add(cone);
    lightCones.push(cone);
  }
  meshes.lightCones = lightCones;

  // ── 7. METRIC RIPPLES ──────────────────────────────────────────
  const ripples = buildMetricRipples(THREE, 18, TUBE_RADIUS);
  ripples.forEach((r, i) => {
    r.name = `metricRipple_${i}`;
    group.add(r);
  });
  meshes.ripples = ripples;

  // ── 8. SUPERLUMINAL SHIPS (3 ships at different phases) ─────────
  const ships = [];
  const shipColors = [0x4488ff, 0xff4444, 0x44ff88];
  for (let i = 0; i < 3; i++) {
    const ship = buildShip(THREE, TUBE_RADIUS * 0.18, shipColors[i]);
    ship.name = `superluminalShip_${i}`;
    ship.userData.phase = (i / 3) * Math.PI * 2;
    ship.userData.speed = 0.08 + i * 0.02;
    group.add(ship);
    ships.push(ship);
  }
  meshes.ships = ships;

  // ── 9. EXOTIC MATTER GENERATOR STATIONS (5 along the tube) ─────
  const stations = [];
  for (let i = 0; i < 5; i++) {
    const t = (i + 0.5) / 5;
    const station = buildGeneratorStation(THREE, TUBE_RADIUS * 0.35);
    const pos = corridorPath.getPointAt(t);
    // offset outward so they ring the exterior
    station.position.set(pos.x, pos.y + TUBE_RADIUS * 1.6, pos.z);
    station.name = `generatorStation_${i}`;
    group.add(station);
    stations.push(station);
  }
  meshes.stations = stations;

  // ── 10. CHRONOLOGY PROTECTION FIELD ────────────────────────────
  const chronField = buildChronologyField(THREE, TUBE_RADIUS, TUBE_LENGTH);
  chronField.name = 'chronologyProtectionField';
  chronField.rotation.z = Math.PI / 2;
  group.add(chronField);
  meshes.chronField = chronField;

  // ── 11. CAUSAL BOUNDARY MARKERS ────────────────────────────────
  const causalMarkers = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 40;
    const pos = corridorPath.getPointAt(t);
    const mkGeo = new THREE.OctahedronGeometry(TUBE_RADIUS * 0.04, 0);
    const mkMat = new THREE.MeshStandardMaterial({
      color: 0xffff00, emissive: 0xffcc00, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.6
    });
    const mk = new THREE.Mesh(mkGeo, mkMat);
    mk.position.copy(pos);
    mk.name = `causalMarker_${i}`;
    group.add(mk);
    causalMarkers.push(mk);
  }
  meshes.causalMarkers = causalMarkers;

  // ── 12. WARP FIELD ENERGY CONDUITS (helical pipes along tube) ──
  const helixGroup = new THREE.Group();
  for (let h = 0; h < 4; h++) {
    const helixPts = [];
    const helixOffset = (h / 4) * Math.PI * 2;
    for (let s = 0; s <= 300; s++) {
      const t = s / 300;
      const x = (t - 0.5) * TUBE_LENGTH;
      helixPts.push(new THREE.Vector3(
        x,
        Math.cos(t * Math.PI * 16 + helixOffset) * TUBE_RADIUS * 1.22,
        Math.sin(t * Math.PI * 16 + helixOffset) * TUBE_RADIUS * 1.22
      ));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPts);
    const helixGeo = new THREE.TubeGeometry(helixCurve, 300, TUBE_RADIUS * 0.02, 8, false);
    const helixMat = new THREE.MeshStandardMaterial({
      color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 0.7,
      transparent: true, opacity: 0.45
    });
    helixGroup.add(new THREE.Mesh(helixGeo, helixMat));
  }
  helixGroup.name = 'energyConduitHelices';
  group.add(helixGroup);
  meshes.helixGroup = helixGroup;

  // ── 13. EXTERIOR METRIC TENSOR FIELD LINES ─────────────────────
  const fieldLines = new THREE.Group();
  for (let fl = 0; fl < 16; fl++) {
    const flPts = [];
    const angle = (fl / 16) * Math.PI * 2;
    const rOff = TUBE_RADIUS * (2.0 + Math.random() * 0.5);
    for (let s = 0; s <= 100; s++) {
      const t = s / 100;
      const x = (t - 0.5) * TUBE_LENGTH * 1.2;
      const bend = Math.sin(t * Math.PI) * TUBE_RADIUS * 0.8;
      flPts.push(new THREE.Vector3(
        x,
        Math.cos(angle) * (rOff - bend),
        Math.sin(angle) * (rOff - bend)
      ));
    }
    const flCurve = new THREE.CatmullRomCurve3(flPts);
    const flGeo = new THREE.TubeGeometry(flCurve, 100, TUBE_RADIUS * 0.008, 4, false);
    const flMat = new THREE.MeshStandardMaterial({
      color: 0x88aaff, emissive: 0x4466ff, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.2
    });
    fieldLines.add(new THREE.Mesh(flGeo, flMat));
  }
  fieldLines.name = 'metricFieldLines';
  group.add(fieldLines);
  meshes.fieldLines = fieldLines;

  // ── 14. INFORMATION PARADOX WARNING BEACONS ────────────────────
  const beacons = [];
  for (let b = 0; b < 8; b++) {
    const ba = (b / 8) * Math.PI * 2;
    const bGeo = new THREE.ConeGeometry(TUBE_RADIUS * 0.08, TUBE_RADIUS * 0.25, 6);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 1.8,
      transparent: true, opacity: 0.8
    });
    const beacon = new THREE.Mesh(bGeo, bMat);
    beacon.position.set(
      -TUBE_LENGTH * 0.5 - TUBE_RADIUS * 0.5,
      Math.cos(ba) * TUBE_RADIUS * 1.5,
      Math.sin(ba) * TUBE_RADIUS * 1.5
    );
    beacon.name = `warningBeacon_${b}`;
    group.add(beacon);
    beacons.push(beacon);
  }
  meshes.beacons = beacons;

  // ── 15. AMBIENT POINT LIGHTS ───────────────────────────────────
  const portalLightEntry = new THREE.PointLight(0x00ccff, 2.5, TUBE_LENGTH * 0.4);
  portalLightEntry.position.set(-TUBE_LENGTH * 0.5, 0, 0);
  group.add(portalLightEntry);

  const portalLightExit = new THREE.PointLight(0xff6600, 2.5, TUBE_LENGTH * 0.4);
  portalLightExit.position.set(TUBE_LENGTH * 0.5, 0, 0);
  group.add(portalLightExit);

  const coreLights = [];
  for (let cl = 0; cl < 6; cl++) {
    const t = (cl + 0.5) / 6;
    const pos = corridorPath.getPointAt(t);
    const coreLight = new THREE.PointLight(0xff44ff, 1.0, TUBE_RADIUS * 4);
    coreLight.position.copy(pos);
    group.add(coreLight);
    coreLights.push(coreLight);
  }
  meshes.coreLights = coreLights;

  // ── 16. NULL GEODESIC TRACER PARTICLES ─────────────────────────
  const tracerParticles = [];
  for (let tp = 0; tp < 30; tp++) {
    const tpGeo = new THREE.SphereGeometry(TUBE_RADIUS * 0.02, 8, 8);
    const tpMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffaa, emissiveIntensity: 2.0,
      transparent: true, opacity: 0.7
    });
    const tpMesh = new THREE.Mesh(tpGeo, tpMat);
    tpMesh.userData.phase = Math.random();
    tpMesh.userData.radialAngle = Math.random() * Math.PI * 2;
    tpMesh.userData.radialDist = TUBE_RADIUS * (0.3 + Math.random() * 0.5);
    group.add(tpMesh);
    tracerParticles.push(tpMesh);
  }
  meshes.tracerParticles = tracerParticles;

  // ── 17. FRAME-DRAGGING VORTEX RINGS (near portals) ─────────────
  const vortexRings = [];
  for (let v = 0; v < 6; v++) {
    const side = v < 3 ? -1 : 1;
    const idx = v % 3;
    const vGeo = new THREE.TorusGeometry(TUBE_RADIUS * (0.5 + idx * 0.25), TUBE_RADIUS * 0.012, 12, 48);
    const vMat = new THREE.MeshStandardMaterial({
      color: side < 0 ? 0x00ccff : 0xff6600,
      emissive: side < 0 ? 0x0088ff : 0xff4400,
      emissiveIntensity: 0.6,
      transparent: true, opacity: 0.3, wireframe: true
    });
    const vRing = new THREE.Mesh(vGeo, vMat);
    vRing.position.x = side * (TUBE_LENGTH * 0.5 + TUBE_RADIUS * 0.3 * (idx + 1));
    vRing.rotation.y = Math.PI / 2;
    vRing.userData.side = side;
    vRing.userData.idx = idx;
    group.add(vRing);
    vortexRings.push(vRing);
  }
  meshes.vortexRings = vortexRings;

  // ── 18. ENERGY DENSITY READOUT PANELS ──────────────────────────
  for (let p = 0; p < 6; p++) {
    const t = (p + 0.5) / 6;
    const pos = corridorPath.getPointAt(t);
    const panelGeo = new THREE.PlaneGeometry(TUBE_RADIUS * 0.4, TUBE_RADIUS * 0.25);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x001122, emissive: 0x00ff88, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.7, side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(pos.x, pos.y + TUBE_RADIUS * 1.15, pos.z);
    panel.rotation.x = -0.3;
    group.add(panel);

    // Holographic screen border
    const borderGeo = new THREE.EdgesGeometry(panelGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0x00ffaa });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.copy(panel.position);
    border.rotation.copy(panel.rotation);
    group.add(border);
  }

  // ════════════════════════════════════════════════════════════════
  //                        PARTS ARRAY
  // ════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Exotic Matter Tube Lining',
      description: 'Negative-energy-density exotic matter forming the permanent spacetime corridor walls. Maintains the Krasnikov metric by threading the tube with stress-energy violating the averaged null energy condition (ANEC).',
      material: 'Exotic matter (negative energy density quantum fields)',
      function: 'Sustains permanent modification of the spacetime metric inside the tube, enabling superluminal effective velocity for traversing craft.',
      assemblyOrder: 1,
      connections: ['Portal Rings', 'Generator Stations', 'Energy Conduit Helices'],
      failureEffect: 'Tube metric collapses to flat Minkowski space; effective FTL path ceases to exist.',
      cascadeFailures: ['Portal Rings', 'Chronology Protection Field', 'Geodesic Grid'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: -6 }
    },
    {
      name: 'Entry Portal Ring',
      description: 'Stabilised entry aperture at the past-end of the Krasnikov tube. Features 24 exotic-matter injector spokes, triple concentric stabilisation rings, and chevron alignment markers.',
      material: 'Neutronium-reinforced metamaterial with exotic-matter injectors',
      function: 'Provides a causally smooth transition region from flat spacetime into the modified Krasnikov metric interior.',
      assemblyOrder: 2,
      connections: ['Exotic Matter Tube Lining', 'Frame-Dragging Vortex Rings', 'Warning Beacons'],
      failureEffect: 'Entry boundary becomes singular; craft attempting entry experience infinite tidal forces.',
      cascadeFailures: ['Exotic Matter Tube Lining', 'Superluminal Ships'],
      originalPosition: { x: -TUBE_LENGTH * 0.5, y: 0, z: 0 },
      explodedPosition: { x: -TUBE_LENGTH * 0.5 - 5, y: 0, z: 0 }
    },
    {
      name: 'Exit Portal Ring',
      description: 'Stabilised exit aperture at the future-end of the tube. Identical construction to entry portal with orange-shifted energy signature indicating different causal relationship.',
      material: 'Neutronium-reinforced metamaterial with exotic-matter injectors',
      function: 'Provides smooth re-entry to flat spacetime from the tube interior. Redshift/blueshift management prevents radiation flash at exit.',
      assemblyOrder: 3,
      connections: ['Exotic Matter Tube Lining', 'Frame-Dragging Vortex Rings'],
      failureEffect: 'Exit aperture pinches off; trapped craft cannot re-enter normal spacetime.',
      cascadeFailures: ['Superluminal Ships', 'Metric Field Lines'],
      originalPosition: { x: TUBE_LENGTH * 0.5, y: 0, z: 0 },
      explodedPosition: { x: TUBE_LENGTH * 0.5 + 5, y: 0, z: 0 }
    },
    {
      name: 'Light Cone Array',
      description: 'Array of 20 local light-cone visualisers distributed along the corridor. Inside the Krasnikov tube the light cones are tilted so that both the forward and return trips lie within the future light cone.',
      material: 'Holographic projection field (non-material visualiser)',
      function: 'Displays local causal structure. Light-cone tilt demonstrates that superluminal travel within the tube respects the modified local causality.',
      assemblyOrder: 4,
      connections: ['Exotic Matter Tube Lining', 'Geodesic Grid'],
      failureEffect: 'Loss of causal structure monitoring; pilots cannot verify safe FTL corridors.',
      cascadeFailures: ['Causal Boundary Markers'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 5, z: 0 }
    },
    {
      name: 'Metric Ripple Propagators',
      description: '18 toroidal wavefronts representing perturbations in the modified metric tensor. These ripples demonstrate how the tube spacetime curvature oscillates around its steady-state configuration.',
      material: 'Spacetime curvature (not a physical material)',
      function: 'Visualise metric perturbations. In the full GR treatment, these correspond to solutions of the linearised Einstein equations around the Krasnikov background.',
      assemblyOrder: 5,
      connections: ['Exotic Matter Tube Lining', 'Chronology Protection Field'],
      failureEffect: 'Unchecked metric oscillations can resonate and destabilise the tube.',
      cascadeFailures: ['Exotic Matter Tube Lining', 'Light Cone Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -4, z: 4 }
    },
    {
      name: 'Superluminal Transit Vessels',
      description: 'Three spacecraft with LatheGeometry hulls, dual engine nacelles, tinted cockpit canopies, and dorsal stabiliser fins. Each traverses the tube at different effective superluminal speeds.',
      material: 'Titanium-carbide composite hull with exotic-matter shielding',
      function: 'Transport cargo and crew through the Krasnikov tube at effective velocities exceeding c, exploiting the tilted light cones rather than local Lorentz violation.',
      assemblyOrder: 6,
      connections: ['Entry Portal Ring', 'Exit Portal Ring', 'Null Geodesic Tracers'],
      failureEffect: 'Craft become stranded in modified metric region.',
      cascadeFailures: ['Entry Portal Ring', 'Exit Portal Ring'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 6, z: -3 }
    },
    {
      name: 'Exotic Matter Generator Stations',
      description: 'Five generator complexes arrayed along the tube exterior. Each features a containment sphere, 6 magnetic confinement coils, 4 energy feed conduits with octahedral emitters, and a central plasma core.',
      material: 'Superconducting niobium-tin coils, plasma confinement ceramics',
      function: 'Continuously produce and inject exotic matter into the tube walls to maintain the negative energy density required by the Krasnikov metric.',
      assemblyOrder: 7,
      connections: ['Exotic Matter Tube Lining', 'Energy Conduit Helices', 'Energy Density Readout Panels'],
      failureEffect: 'Exotic matter supply ceases; tube walls begin to dissipate as metric relaxes toward flat space.',
      cascadeFailures: ['Exotic Matter Tube Lining', 'Portal Rings', 'Metric Ripple Propagators'],
      originalPosition: { x: 0, y: TUBE_RADIUS * 1.6, z: 0 },
      explodedPosition: { x: 0, y: TUBE_RADIUS * 1.6 + 6, z: 0 }
    },
    {
      name: 'Chronology Protection Field',
      description: 'Translucent cylindrical shell with 12 CTC-prevention marker rings. Implements a mechanism analogous to Hawking\'s chronology protection conjecture to prevent closed timelike curves (CTCs) from forming.',
      material: 'Quantum vacuum stress-energy barrier',
      function: 'Prevents the Krasnikov tube from being used to construct a time machine by ensuring that back-reaction effects destroy any nascent CTC.',
      assemblyOrder: 8,
      connections: ['Exotic Matter Tube Lining', 'Metric Ripple Propagators', 'Warning Beacons'],
      failureEffect: 'CTCs may form, creating grandfather paradoxes and causality violations.',
      cascadeFailures: ['Light Cone Array', 'Causal Boundary Markers', 'ALL SYSTEMS (paradox cascade)'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 8 }
    },
    {
      name: 'Geodesic Curvature Grid',
      description: '32 longitudinal geodesic lines wrapping the tube exterior with subtle sinusoidal distortion, visualising how spacetime curvature deforms geodesic paths near the tube.',
      material: 'Holographic geodesic tracer filaments',
      function: 'Displays the curvature of spacetime around the tube. Distortions in the grid lines correspond to non-zero Riemann tensor components.',
      assemblyOrder: 9,
      connections: ['Exotic Matter Tube Lining', 'Metric Field Lines'],
      failureEffect: 'Loss of curvature monitoring; cannot detect approaching metric instabilities.',
      cascadeFailures: ['Metric Ripple Propagators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -6, z: 0 }
    },
    {
      name: 'Energy Conduit Helices',
      description: 'Four helical conduit tubes wound tightly around the tube exterior, carrying exotic matter from generator stations to the tube walls in a continuous circulation loop.',
      material: 'Magnetically confined exotic matter plasma conduit',
      function: 'Distribute exotic matter uniformly along the entire tube length, preventing localised energy-density deficiencies that could cause tube wall collapse.',
      assemblyOrder: 10,
      connections: ['Generator Stations', 'Exotic Matter Tube Lining'],
      failureEffect: 'Non-uniform exotic matter distribution causes localised metric singularities.',
      cascadeFailures: ['Exotic Matter Tube Lining', 'Metric Ripple Propagators'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 3, y: 3, z: 3 }
    },
    {
      name: 'Metric Tensor Field Lines',
      description: '16 exterior field lines showing how the background Minkowski metric smoothly transitions into the modified Krasnikov metric near the tube. Lines bend inward near the tube.',
      material: 'Spacetime curvature tracer (non-material)',
      function: 'Visualise the asymptotic structure of the metric: far from the tube, spacetime is flat; near the tube, the metric components change to enable FTL effective speed.',
      assemblyOrder: 11,
      connections: ['Geodesic Grid', 'Portal Rings'],
      failureEffect: 'No direct physical effect; loss of monitoring only.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: -8 }
    },
    {
      name: 'Null Geodesic Tracer Particles',
      description: '30 luminous particles following null geodesics (light paths) through the tube interior. Their trajectories demonstrate that photon paths inside the tube are redirected by the metric.',
      material: 'Massless tracer photons',
      function: 'Demonstrate that light itself follows curved null geodesics inside the tube, proving the spacetime modification is genuine (not just a coordinate artefact).',
      assemblyOrder: 12,
      connections: ['Light Cone Array', 'Exotic Matter Tube Lining'],
      failureEffect: 'Tracers follow straight lines, indicating metric has collapsed to flat.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -4, y: 4, z: 0 }
    },
    {
      name: 'Frame-Dragging Vortex Rings',
      description: '6 toroidal vortex rings at each portal end. These visualise gravitomagnetic frame-dragging effects at the portal boundaries where the metric transition is steepest.',
      material: 'Gravitomagnetic field visualiser',
      function: 'Display how rotating exotic matter near the portal boundaries drags local inertial frames, contributing to the metric transition.',
      assemblyOrder: 13,
      connections: ['Entry Portal Ring', 'Exit Portal Ring'],
      failureEffect: 'Uncompensated frame-dragging destabilises portal boundaries.',
      cascadeFailures: ['Portal Rings'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -5, z: -5 }
    },
    {
      name: 'Causal Boundary Markers',
      description: '40 octahedral markers placed along the tube centreline. Their positions define the causal boundary – the locus of events at which the effective speed transitions from subluminal to superluminal.',
      material: 'Holographic causal-structure indicator',
      function: 'Mark the precise spatial coordinates along the tube where ds² changes sign for tube-frame observers, indicating the FTL transition boundary.',
      assemblyOrder: 14,
      connections: ['Light Cone Array', 'Chronology Protection Field'],
      failureEffect: 'Pilots cannot determine safe FTL insertion points.',
      cascadeFailures: ['Light Cone Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 5, y: 0, z: 5 }
    },
    {
      name: 'Information Paradox Warning Beacons',
      description: '8 red conical beacons arrayed around the entry portal. They activate when the chronology protection field detects potential causality violations or information paradoxes.',
      material: 'Emergency photonic emitter array',
      function: 'Provide visual and electromagnetic warning when quantum back-reaction effects indicate incipient CTC formation or information paradox conditions.',
      assemblyOrder: 15,
      connections: ['Chronology Protection Field', 'Entry Portal Ring'],
      failureEffect: 'No warning of paradox conditions; catastrophic CTC formation may occur without alert.',
      cascadeFailures: ['Chronology Protection Field'],
      originalPosition: { x: -TUBE_LENGTH * 0.5 - TUBE_RADIUS * 0.5, y: 0, z: 0 },
      explodedPosition: { x: -TUBE_LENGTH * 0.5 - 8, y: 0, z: 0 }
    },
    {
      name: 'Energy Density Readout Panels',
      description: '6 holographic display panels positioned above the tube, each showing real-time energy density, stress-energy tensor components, and ANEC violation magnitude at their respective tube segment.',
      material: 'Holographic emitter with quantum-dot display',
      function: 'Monitor the exotic matter energy density T₀₀ and verify that the ANEC integral ∫T_μν k^μ k^ν dλ remains negative along every null geodesic segment.',
      assemblyOrder: 16,
      connections: ['Generator Stations', 'Exotic Matter Tube Lining'],
      failureEffect: 'Loss of energy density monitoring; cannot detect tube wall degradation.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: TUBE_RADIUS * 1.15, z: 0 },
      explodedPosition: { x: 0, y: TUBE_RADIUS * 1.15 + 6, z: 0 }
    }
  ];

  // ════════════════════════════════════════════════════════════════
  //                     QUIZ QUESTIONS
  // ════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'The Krasnikov metric ds² = -(dt - dx·δ(t,x))² + dx² + dy² + dz² modifies the light-cone structure inside the tube. What specific property of the function δ(t,x) is required to enable effective superluminal travel along the tube, and why does this not violate special relativity locally?',
      answer: 'The function δ(t,x) must transition smoothly from 0 (outside the tube) to a value greater than 1 (inside the tube) such that the effective coordinate speed dx/dt of a future-directed timelike curve can exceed c. This does not violate special relativity locally because at every point the local light-cone structure is preserved – the ship travels on a locally timelike worldline within the tilted light cone. The superluminal effective speed is a coordinate artefact of the global metric modification, analogous to how galaxies beyond the Hubble radius recede "faster than light" in FRW cosmology. The key insight is that the Krasnikov tube modifies the metric rather than accelerating the ship past a local light barrier.',
      difficulty: 'PhD',
      topic: 'Krasnikov Metric Tensor'
    },
    {
      question: 'The tube walls require exotic matter with stress-energy tensor T_μν violating the Averaged Null Energy Condition (ANEC): ∫ T_μν k^μ k^ν dλ < 0 along complete null geodesics. Using the Raychaudhuri equation, explain why ANEC violation is necessary for the tube to exist, and discuss whether quantum field theory (specifically the Casimir effect) provides sufficient exotic matter.',
      answer: 'The Raychaudhuri equation dθ/dλ = -(1/2)θ² - σ_μν σ^μν - R_μν k^μ k^ν shows that if R_μν k^μ k^ν ≥ 0 (which follows from ANEC via the Einstein equations), null geodesic congruences can only converge. The Krasnikov tube requires null geodesics to defocus as they enter the modified region (the tube "pushes apart" nearby null rays to create the tilted light-cone structure), requiring R_μν k^μ k^ν < 0 and hence ANEC violation. The Casimir effect does produce negative energy densities (ρ ~ -π²ℏc/720a⁴ between parallel plates), but the magnitude is extremely small for macroscopic separations. Ford-Roman quantum inequality bounds constrain the magnitude and duration of negative energy densities: |ρ_neg| · τ⁴ ≲ ℏ/c. For a macroscopic tube, the required exotic matter vastly exceeds what known quantum effects can provide, making the Krasnikov tube physically unrealisable with current physics.',
      difficulty: 'PhD',
      topic: 'ANEC Violation and Quantum Inequalities'
    },
    {
      question: 'Everett and Roman (1997) showed that two Krasnikov tubes (one in each direction between stars A and B) can form a closed timelike curve (CTC). Explain how Hawking\'s chronology protection conjecture addresses this, and what role the quantum stress-energy tensor\'s divergence on the Cauchy horizon plays.',
      answer: 'If tube 1 allows FTL travel from A→B and tube 2 (constructed later, offset in time) allows FTL travel from B→A, a traveller can depart A, arrive at B before their departure time (in A\'s frame), then return through tube 2 to arrive at A before they left – forming a CTC. Hawking\'s chronology protection conjecture states that the laws of physics prevent CTC formation. The mechanism is that as a Cauchy horizon (the boundary of the causal future of the CTC-forming region) forms, quantum vacuum fluctuations experience unbounded blueshift. The renormalised quantum stress-energy tensor ⟨T_μν⟩_ren diverges on the Cauchy horizon, which back-reacts on the geometry via the semiclassical Einstein equations G_μν = 8πG⟨T_μν⟩_ren, destroying the Cauchy horizon (and hence the CTC) before it fully forms. However, a complete proof requires a theory of quantum gravity, as the semiclassical approximation breaks down precisely where the divergence occurs.',
      difficulty: 'PhD',
      topic: 'Chronology Protection and CTCs'
    },
    {
      question: 'Unlike the Alcubierre warp drive, the Krasnikov tube is constructed as the ship travels outbound at subluminal speed and only enables superluminal return. Explain how this asymmetry arises from the causal structure of the metric and why it circumvents the "bootstrapping problem" of the Alcubierre drive.',
      answer: 'The Alcubierre drive requires the exotic matter configuration to already exist ahead of the ship, but signals from the ship cannot reach the region ahead of the warp bubble (it is spacelike separated), creating a bootstrapping paradox. The Krasnikov tube avoids this because the metric modification is laid down by the ship during its outbound subluminal journey – the ship is always in causal contact with the region it is modifying. The tube forms in the ship\'s causal past, not its future. Once fully constructed, the tube modifies the return-trip light cones so that the return journey lies within the forward light cone of the departure event, enabling effective FTL return. The key is the time-asymmetry: construction is subluminal and causal; only the subsequent return traversal is effectively superluminal. This is reflected in the metric function δ(t,x) which has compact support in the (t,x) plane and only achieves its FTL-enabling value after the construction event has passed.',
      difficulty: 'PhD',
      topic: 'Causal Structure and Bootstrapping'
    },
    {
      question: 'Calculate the total exotic matter energy required for a Krasnikov tube of length L and radius R, given that the wall thickness is δ and the required energy density is ρ_exotic ~ -c⁴/(8πGR²). Express your answer in solar masses for L = 10 light-years, R = 100 m, and comment on the physicality of this result in light of the quantum interest conjecture.',
      answer: 'The volume of the tube wall is V ≈ 2πR · δ · L (thin shell approximation). The energy density is |ρ| ~ c⁴/(8πGR²). For R = 100 m: |ρ| ≈ (3×10⁸)⁴ / (8π × 6.67×10⁻¹¹ × 10⁴) ≈ 4.8 × 10²⁹ J/m³. For L = 10 ly ≈ 9.46×10¹⁶ m and δ ~ R = 100 m: V ≈ 2π(100)(100)(9.46×10¹⁶) ≈ 5.9 × 10²¹ m³. Total energy E ≈ 2.8 × 10⁵¹ J, or about 1.6 × 10²¹ kg ≈ 800 M_☉ (solar masses) of exotic matter with negative energy. This is physically absurd – it exceeds the mass-energy of most stars. The quantum interest conjecture (Ford & Roman) states that any loan of negative energy must be repaid with interest: the subsequent positive energy pulse must exceed the magnitude of the negative energy by an amount that grows with the duration of the negative energy loan. This makes sustained macroscopic negative energy densities effectively impossible, rendering the Krasnikov tube a purely theoretical construct of general relativity that cannot be realised within known physics.',
      difficulty: 'PhD',
      topic: 'Energy Requirements and Quantum Interest'
    }
  ];

  // ════════════════════════════════════════════════════════════════
  //                      DESCRIPTION
  // ════════════════════════════════════════════════════════════════
  const description = `Krasnikov Tube — Ultra God Tier Spacetime Corridor

A Krasnikov tube is a speculative structure in general relativity proposed by Sergei Krasnikov in 1995. It represents a permanent modification of the spacetime metric along a corridor connecting two distant points, enabling effective faster-than-light (FTL) travel for subsequent traversals.

Unlike the Alcubierre warp drive (which moves a bubble of modified spacetime), the Krasnikov tube is a static structure laid down by a ship during its initial subluminal outbound journey. Once constructed, the tube's interior metric tilts the local light cones so that the return trip lies entirely within the future light cone of the departure event, enabling effective superluminal transit without local Lorentz violation.

The tube requires exotic matter (negative energy density) to maintain its walls, violating the Averaged Null Energy Condition. The energy requirements are enormous — hundreds of solar masses for a tube spanning 10 light-years. Hawking's chronology protection conjecture suggests that quantum back-reaction effects would prevent two overlapping tubes from forming closed timelike curves.

This model features:
• Exotic matter tube lining with 480 energy concentrator nodes
• Entry and exit portal rings with 24 exotic-matter injectors each
• 20 tilting light cones demonstrating modified causal structure
• 3 superluminal transit vessels with detailed LatheGeometry hulls
• 5 exotic matter generator stations with plasma cores
• Chronology protection field with CTC-prevention markers
• 18 propagating metric ripple wavefronts
• 4 helical energy conduit pipes
• Geodesic curvature grid, null geodesic tracers, frame-dragging vortices
• Causal boundary markers, warning beacons, and energy density readout panels`;

  // ════════════════════════════════════════════════════════════════
  //                     ANIMATE FUNCTION
  // ════════════════════════════════════════════════════════════════
  function animate(time, speed, ms) {
    const t = time * speed;

    // --- Light Cones: tilt oscillation ---
    if (ms.lightCones) {
      ms.lightCones.forEach((cone, i) => {
        const tiltAmount = Math.sin(t * 0.5 + cone.userData.t * Math.PI * 4) * 0.6 + 0.2;
        cone.rotation.z = tiltAmount;
        cone.rotation.x = Math.sin(t * 0.3 + i * 0.5) * 0.15;
        // Pulsing opacity
        cone.children.forEach(child => {
          if (child.material) {
            child.material.opacity = 0.2 + Math.abs(Math.sin(t * 1.5 + i * 0.3)) * 0.25;
          }
        });
      });
    }

    // --- Metric Ripples: propagate along the tube ---
    if (ms.ripples) {
      ms.ripples.forEach((rip) => {
        const phase = rip.userData.phase + t * rip.userData.speed;
        const normPhase = ((phase % (Math.PI * 2)) / (Math.PI * 2) + 1) % 1;
        const corridorPt = corridorPath.getPointAt(normPhase);
        rip.position.copy(corridorPt);
        rip.rotation.y = Math.PI / 2;
        rip.scale.setScalar(0.8 + Math.sin(phase * 2) * 0.3);
        if (rip.material) {
          rip.material.opacity = 0.1 + Math.abs(Math.sin(phase * 3)) * 0.2;
          rip.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(phase * 2)) * 0.8;
        }
      });
    }

    // --- Ships: traverse the tube at different speeds ---
    if (ms.ships) {
      ms.ships.forEach((ship) => {
        const shipPhase = ship.userData.phase + t * ship.userData.speed;
        const normT = ((shipPhase / (Math.PI * 2)) % 1 + 1) % 1;
        const pos = corridorPath.getPointAt(normT);
        const tangent = corridorPath.getTangentAt(normT);
        ship.position.copy(pos);
        // Orient ship along tangent
        const lookTarget = pos.clone().add(tangent);
        ship.lookAt(lookTarget);
        // Subtle bobbing
        ship.position.y += Math.sin(t * 3 + ship.userData.phase) * TUBE_RADIUS * 0.05;
        // Engine glow pulsing
        ship.traverse(child => {
          if (child.material && child.material.emissiveIntensity > 2) {
            child.material.emissiveIntensity = 2.5 + Math.sin(t * 8 + ship.userData.phase) * 1.0;
          }
        });
      });
    }

    // --- Portal Rings: slow rotation ---
    if (ms.entryPortal) {
      ms.entryPortal.rotation.x = t * 0.15;
    }
    if (ms.exitPortal) {
      ms.exitPortal.rotation.x = -t * 0.12;
    }

    // --- Generator Stations: coil rotation and core pulsing ---
    if (ms.stations) {
      ms.stations.forEach((station, i) => {
        station.rotation.y = t * 0.3 + i * Math.PI * 0.4;
        station.rotation.x = Math.sin(t * 0.2 + i) * 0.15;
        // Pulse station children
        station.traverse(child => {
          if (child.material && child.material.wireframe) {
            child.material.emissiveIntensity = 1.5 + Math.sin(t * 4 + i * 1.2) * 0.8;
          }
        });
      });
    }

    // --- Chronology Protection Field: shimmer ---
    if (ms.chronField) {
      ms.chronField.traverse(child => {
        if (child.material) {
          child.material.opacity = 0.04 + Math.abs(Math.sin(t * 0.8)) * 0.04;
          if (child.material.emissiveIntensity !== undefined) {
            child.material.emissiveIntensity = 0.4 + Math.sin(t * 1.2) * 0.3;
          }
        }
      });
    }

    // --- Causal Boundary Markers: oscillate and pulse ---
    if (ms.causalMarkers) {
      ms.causalMarkers.forEach((mk, i) => {
        mk.rotation.y = t * 2 + i * 0.15;
        mk.rotation.x = t * 1.5;
        const scale = 0.8 + Math.sin(t * 3 + i * 0.3) * 0.3;
        mk.scale.setScalar(scale);
        if (mk.material) {
          mk.material.emissiveIntensity = 0.8 + Math.sin(t * 4 + i * 0.5) * 0.6;
        }
      });
    }

    // --- Warning Beacons: flash red ---
    if (ms.beacons) {
      ms.beacons.forEach((b, i) => {
        const flash = Math.sin(t * 6 + i * Math.PI * 0.25) > 0.3 ? 1.0 : 0.2;
        if (b.material) {
          b.material.emissiveIntensity = flash * 2.5;
          b.material.opacity = 0.3 + flash * 0.6;
        }
        b.rotation.y = t * 2;
      });
    }

    // --- Tracer Particles: follow helical paths through tube ---
    if (ms.tracerParticles) {
      ms.tracerParticles.forEach((tp) => {
        const phase = tp.userData.phase + t * 0.12;
        const normT = ((phase) % 1 + 1) % 1;
        const pos = corridorPath.getPointAt(normT);
        const ra = tp.userData.radialAngle + t * 3;
        const rd = tp.userData.radialDist;
        tp.position.set(
          pos.x,
          pos.y + Math.cos(ra) * rd,
          pos.z + Math.sin(ra) * rd
        );
        if (tp.material) {
          tp.material.opacity = 0.4 + Math.abs(Math.sin(phase * Math.PI * 4)) * 0.5;
        }
      });
    }

    // --- Vortex Rings: spin at portal boundaries ---
    if (ms.vortexRings) {
      ms.vortexRings.forEach((vr) => {
        vr.rotation.x = t * (1.5 + vr.userData.idx * 0.5) * vr.userData.side;
        vr.rotation.z = t * 0.3 * vr.userData.side;
        if (vr.material) {
          vr.material.opacity = 0.15 + Math.abs(Math.sin(t * 2 + vr.userData.idx)) * 0.2;
        }
      });
    }

    // --- Core Lights: intensity pulsing ---
    if (ms.coreLights) {
      ms.coreLights.forEach((cl, i) => {
        cl.intensity = 0.6 + Math.sin(t * 2 + i * 1.1) * 0.5;
      });
    }

    // --- Helix Group: slow rotation ---
    if (ms.helixGroup) {
      ms.helixGroup.rotation.x = t * 0.05;
    }

    // --- Geodesic Grid: subtle breathing ---
    if (ms.geodesicGrid) {
      const breathe = 1.0 + Math.sin(t * 0.4) * 0.03;
      ms.geodesicGrid.scale.set(1, breathe, breathe);
    }

    // --- Exotic Lining: pulse emissive ---
    if (ms.exoticLining) {
      ms.exoticLining.traverse(child => {
        if (child.material && child.material.emissive) {
          if (child.material.wireframe) {
            child.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.3;
          }
        }
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  //                       RETURN
  // ════════════════════════════════════════════════════════════════
  return {
    group,
    parts,
    description,
    quizQuestions,
    animate: (time, speed) => animate(time, speed, meshes)
  };
}
