// ============================================================================
// GOD TIER — STARKILLER BASE STELLAR LASER
// A planet-scale superweapon that siphons a star's mass-energy through a
// magnetic intake funnel, compresses it inside layered containment / focusing
// chambers, and releases the accumulated power as a coherent hyper-beam that
// splits into multiple target beams capable of destroying entire star systems.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/* ---------- helper colour / emissive materials ---------- */
function _glow(hex, intensity = 2.0) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.92,
  });
}
function _neon(hex, intensity = 3.5) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.85,
  });
}
function _metalPanel(hex = 0x3a3a42) {
  return new THREE.MeshStandardMaterial({
    color: hex, metalness: 0.92, roughness: 0.28,
  });
}
function _energyField(hex, opacity = 0.35) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 1.8,
    transparent: true, opacity, side: THREE.DoubleSide,
  });
}

export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ========================================================================
  //  1. THE DYING STAR (being drained)
  // ========================================================================
  const starGeo = new THREE.IcosahedronGeometry(18, 5);
  const starMat = _glow(0xffcc33, 4.0);
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.set(0, 55, 0);
  group.add(star);
  meshes.star = star;

  // Corona / outer plasma halo
  const coronaGeo = new THREE.IcosahedronGeometry(22, 3);
  const coronaMat = _energyField(0xff8800, 0.18);
  const corona = new THREE.Mesh(coronaGeo, coronaMat);
  corona.position.copy(star.position);
  group.add(corona);
  meshes.corona = corona;

  // Solar prominences — arcing loops of plasma
  const prominences = new THREE.Group();
  prominences.position.copy(star.position);
  for (let i = 0; i < 8; i++) {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ),
      new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14
      )
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.35 + Math.random() * 0.5, 8, false);
    const tubeMat = _neon(0xff6600, 2.5);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    prominences.add(tube);
  }
  group.add(prominences);
  meshes.prominences = prominences;

  // ========================================================================
  //  2. STELLAR MATTER DRAIN STREAMS (star → funnel)
  // ========================================================================
  const drainStreams = new THREE.Group();
  const streamCount = 14;
  for (let i = 0; i < streamCount; i++) {
    const angle = (i / streamCount) * Math.PI * 2;
    const radius = 6 + Math.random() * 4;
    const startPt = new THREE.Vector3(
      Math.cos(angle) * radius,
      55 - 8,
      Math.sin(angle) * radius
    );
    const midPt = new THREE.Vector3(
      Math.cos(angle) * (radius * 0.5),
      30 + Math.random() * 8,
      Math.sin(angle) * (radius * 0.5)
    );
    const endPt = new THREE.Vector3(0, 18, 0);
    const curve = new THREE.QuadraticBezierCurve3(startPt, midPt, endPt);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.25 + Math.random() * 0.35, 8, false);
    const tubeMat = _neon(0xffaa00, 3.0);
    const stream = new THREE.Mesh(tubeGeo, tubeMat);
    drainStreams.add(stream);
  }
  group.add(drainStreams);
  meshes.drainStreams = drainStreams;

  // ========================================================================
  //  3. PLANET BODY (Starkiller Base)
  // ========================================================================
  // Main planet sphere — dark, armoured surface
  const planetGeo = new THREE.IcosahedronGeometry(25, 4);
  const planetMat = _metalPanel(0x2a2a30);
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.position.set(0, 0, 0);
  group.add(planet);
  meshes.planet = planet;

  // Surface armour plates — hex grid overlay
  const hexGridGeo = new THREE.IcosahedronGeometry(25.15, 3);
  const hexGridMat = new THREE.MeshStandardMaterial({
    color: 0x444450, metalness: 0.95, roughness: 0.35,
    wireframe: true,
  });
  const hexGrid = new THREE.Mesh(hexGridGeo, hexGridMat);
  group.add(hexGrid);
  meshes.hexGrid = hexGrid;

  // Polar ice-caps glow (energy bleed)
  for (let sign = -1; sign <= 1; sign += 2) {
    const capGeo = new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, 0.45);
    const capMat = _energyField(0x44ddff, 0.22);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, sign * 24, 0);
    if (sign === -1) cap.rotation.x = Math.PI;
    group.add(cap);
  }

  // Equatorial trench (thermal exhaust)
  const trenchGeo = new THREE.TorusGeometry(25.3, 0.6, 12, 128);
  const trenchMat = _glow(0xff3300, 1.5);
  const trench = new THREE.Mesh(trenchGeo, trenchMat);
  trench.rotation.x = Math.PI / 2;
  group.add(trench);
  meshes.trench = trench;

  // Secondary equatorial trenches
  for (let offset = -1; offset <= 1; offset += 2) {
    const tGeo = new THREE.TorusGeometry(24.0, 0.3, 8, 96);
    const tMat = _glow(0xcc2200, 1.0);
    const t = new THREE.Mesh(tGeo, tMat);
    t.position.y = offset * 6;
    t.rotation.x = Math.PI / 2;
    group.add(t);
  }

  // ========================================================================
  //  4. INTAKE FUNNEL (top of planet, aimed at star)
  // ========================================================================
  // Outer funnel cone — lathe profile
  const funnelShape = new THREE.Shape();
  funnelShape.moveTo(0, 0);
  funnelShape.lineTo(14, 0);
  funnelShape.lineTo(10, 5);
  funnelShape.lineTo(7, 10);
  funnelShape.lineTo(4, 14);
  funnelShape.lineTo(2.5, 16);
  funnelShape.lineTo(0, 16);
  const funnelPts = funnelShape.getPoints(60);
  const funnelGeo = new THREE.LatheGeometry(funnelPts, 64);
  const funnelMat = _metalPanel(0x555560);
  const funnel = new THREE.Mesh(funnelGeo, funnelMat);
  funnel.position.set(0, 16, 0);
  group.add(funnel);
  meshes.funnel = funnel;

  // Funnel interior glow
  const funnelInnerGeo = new THREE.LatheGeometry(
    [new THREE.Vector2(0, 0), new THREE.Vector2(12, 0.5),
     new THREE.Vector2(8, 5), new THREE.Vector2(5, 10),
     new THREE.Vector2(3, 14), new THREE.Vector2(1.5, 16)], 64
  );
  const funnelInnerMat = _energyField(0xff8800, 0.4);
  const funnelInner = new THREE.Mesh(funnelInnerGeo, funnelInnerMat);
  funnelInner.position.copy(funnel.position);
  group.add(funnelInner);
  meshes.funnelInner = funnelInner;

  // Funnel rim teeth / collectors
  const teethCount = 36;
  for (let i = 0; i < teethCount; i++) {
    const ang = (i / teethCount) * Math.PI * 2;
    const toothGeo = new THREE.BoxGeometry(0.6, 3, 1.2);
    const tooth = new THREE.Mesh(toothGeo, chrome);
    tooth.position.set(Math.cos(ang) * 13.5, 16.5, Math.sin(ang) * 13.5);
    tooth.rotation.y = -ang;
    tooth.rotation.z = 0.3;
    group.add(tooth);
  }

  // Magnetic guide rails inside funnel
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * 12, 17, Math.sin(ang) * 12),
      new THREE.Vector3(Math.cos(ang) * 8, 22, Math.sin(ang) * 8),
      new THREE.Vector3(Math.cos(ang) * 4, 28, Math.sin(ang) * 4),
      new THREE.Vector3(0, 32, 0),
    ]);
    const railGeo = new THREE.TubeGeometry(railCurve, 32, 0.25, 8, false);
    const rail = new THREE.Mesh(railGeo, _neon(0x00ccff, 2.0));
    group.add(rail);
  }

  // ========================================================================
  //  5. INTERNAL CONTAINMENT CHAMBERS (visible cut-away style)
  // ========================================================================
  const chambers = new THREE.Group();

  // Primary containment sphere (innermost)
  const cont1Geo = new THREE.SphereGeometry(6, 32, 32);
  const cont1Mat = _energyField(0xff4400, 0.3);
  const cont1 = new THREE.Mesh(cont1Geo, cont1Mat);
  chambers.add(cont1);
  meshes.primaryChamber = cont1;

  // Secondary containment toroidal rings
  for (let r = 0; r < 3; r++) {
    const ringGeo = new THREE.TorusGeometry(8 + r * 3, 0.5 + r * 0.2, 16, 64);
    const ringMat = _glow(0x00aaff, 1.5 - r * 0.3);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + r * 0.3;
    ring.rotation.z = r * 0.5;
    chambers.add(ring);
  }
  meshes.containmentRings = chambers;

  // Magnetic confinement coils — dense solenoid array
  const coilCount = 20;
  for (let c = 0; c < coilCount; c++) {
    const t = (c / coilCount) * Math.PI * 2;
    const coilGeo = new THREE.TorusGeometry(7, 0.18, 8, 48);
    const coilMat = copper.clone ? copper.clone() : _metalPanel(0xcc7733);
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.y = Math.sin(t) * 5;
    coil.rotation.x = Math.PI / 2;
    coil.rotation.z = t;
    chambers.add(coil);
  }

  // Plasma injector nozzles
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const nozGeo = new THREE.CylinderGeometry(0.3, 0.7, 3, 12);
    const noz = new THREE.Mesh(nozGeo, darkSteel);
    noz.position.set(Math.cos(ang) * 10, 0, Math.sin(ang) * 10);
    noz.lookAt(0, 0, 0);
    chambers.add(noz);

    // nozzle glow tip
    const tipGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const tip = new THREE.Mesh(tipGeo, _neon(0xff2200, 4.0));
    tip.position.set(Math.cos(ang) * 9.2, 0, Math.sin(ang) * 9.2);
    chambers.add(tip);
  }

  group.add(chambers);

  // ========================================================================
  //  6. FOCUSING OPTICS ARRAY
  // ========================================================================
  const focusArray = new THREE.Group();

  // Large parabolic focusing mirror (lathe)
  const mirrorProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, -0.5),
    new THREE.Vector2(9, -2),
    new THREE.Vector2(11, -4),
    new THREE.Vector2(11.2, -4.5),
    new THREE.Vector2(11, -5),
    new THREE.Vector2(9, -3),
    new THREE.Vector2(5, -1.2),
    new THREE.Vector2(0, -0.8),
  ];
  const mirrorGeo = new THREE.LatheGeometry(mirrorProfile, 64);
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xeeeeff, metalness: 1.0, roughness: 0.05,
  });
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  mirror.position.set(0, -8, 0);
  focusArray.add(mirror);
  meshes.focusingMirror = mirror;

  // Fresnel lens rings
  for (let f = 0; f < 6; f++) {
    const lensGeo = new THREE.TorusGeometry(3 + f * 1.5, 0.12, 6, 64);
    const lensMat = _energyField(0x88ccff, 0.25);
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.y = -10;
    lens.rotation.x = Math.PI / 2;
    focusArray.add(lens);
  }

  // Waveguide tubes — hexagonal arrangement
  for (let h = 0; h < 6; h++) {
    const ang = (h / 6) * Math.PI * 2;
    const wgGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 6);
    const wg = new THREE.Mesh(wgGeo, glass);
    wg.position.set(Math.cos(ang) * 4, -14, Math.sin(ang) * 4);
    focusArray.add(wg);

    // inner glow
    const igGeo = new THREE.CylinderGeometry(0.35, 0.35, 8.2, 6);
    const ig = new THREE.Mesh(igGeo, _neon(0x4488ff, 2.5));
    ig.position.copy(wg.position);
    focusArray.add(ig);
  }

  group.add(focusArray);
  meshes.focusArray = focusArray;

  // ========================================================================
  //  7. OUTPUT EMITTER ARRAY (bottom of planet)
  // ========================================================================
  const emitter = new THREE.Group();

  // Main barrel — layered cylinders
  const barrelLayers = 6;
  for (let l = 0; l < barrelLayers; l++) {
    const r = 3.5 - l * 0.35;
    const bGeo = new THREE.CylinderGeometry(r, r + 0.2, 4, 32);
    const bMat = l % 2 === 0 ? darkSteel : chrome;
    const barrel = new THREE.Mesh(bGeo, bMat);
    barrel.position.y = -26 - l * 3.8;
    emitter.add(barrel);
  }

  // Emitter nozzle (flared bell)
  const bellProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(2, 0),
    new THREE.Vector2(2.5, -1),
    new THREE.Vector2(3.5, -3),
    new THREE.Vector2(5, -6),
    new THREE.Vector2(7, -9),
    new THREE.Vector2(8, -10),
  ];
  const bellGeo = new THREE.LatheGeometry(bellProfile, 48);
  const bell = new THREE.Mesh(bellGeo, chrome);
  bell.position.y = -48;
  emitter.add(bell);
  meshes.emitterBell = bell;

  // Inner nozzle glow
  const innerBellGeo = new THREE.LatheGeometry(
    bellProfile.map(p => new THREE.Vector2(p.x * 0.85, p.y)), 48
  );
  const innerBell = new THREE.Mesh(innerBellGeo, _neon(0xff2200, 3.5));
  innerBell.position.y = -48;
  emitter.add(innerBell);
  meshes.innerBell = innerBell;

  // Cooling fin rings
  for (let cf = 0; cf < 8; cf++) {
    const finGeo = new THREE.TorusGeometry(4 + cf * 0.3, 0.15, 6, 48);
    const fin = new THREE.Mesh(finGeo, aluminum);
    fin.position.y = -28 - cf * 2.5;
    fin.rotation.x = Math.PI / 2;
    emitter.add(fin);
  }

  group.add(emitter);
  meshes.emitter = emitter;

  // ========================================================================
  //  8. PRIMARY DESTRUCTION BEAM
  // ========================================================================
  const beamGeo = new THREE.CylinderGeometry(1.5, 2.5, 60, 32, 1, true);
  const beamMat = _neon(0xff1100, 5.0);
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = -88;
  group.add(beam);
  meshes.beam = beam;

  // Beam inner core
  const coreGeo = new THREE.CylinderGeometry(0.6, 1.0, 62, 16, 1, true);
  const coreMat = _neon(0xffffff, 6.0);
  const beamCore = new THREE.Mesh(coreGeo, coreMat);
  beamCore.position.y = -88;
  group.add(beamCore);
  meshes.beamCore = beamCore;

  // Beam sheath / plasma jacket
  const sheathGeo = new THREE.CylinderGeometry(2.8, 4.0, 58, 32, 1, true);
  const sheathMat = _energyField(0xff4400, 0.15);
  const sheath = new THREE.Mesh(sheathGeo, sheathMat);
  sheath.position.y = -88;
  group.add(sheath);
  meshes.sheath = sheath;

  // ========================================================================
  //  9. SPLIT TARGET BEAMS (the beam fans out to multiple targets)
  // ========================================================================
  const splitBeams = new THREE.Group();
  const targetCount = 5;
  for (let tb = 0; tb < targetCount; tb++) {
    const ang = (tb / targetCount) * Math.PI * 2;
    const spreadX = Math.cos(ang) * 25;
    const spreadZ = Math.sin(ang) * 25;
    const splitCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -118, 0),
      new THREE.Vector3(spreadX * 0.4, -130, spreadZ * 0.4),
      new THREE.Vector3(spreadX, -150, spreadZ)
    );
    const splitGeo = new THREE.TubeGeometry(splitCurve, 32, 0.6, 12, false);
    const splitMat = _neon(0xff2200, 4.0);
    const sBm = new THREE.Mesh(splitGeo, splitMat);
    splitBeams.add(sBm);

    // Impact glow at target
    const impactGeo = new THREE.SphereGeometry(2.0, 16, 16);
    const impactMat = _glow(0xff4400, 5.0);
    const impact = new THREE.Mesh(impactGeo, impactMat);
    impact.position.set(spreadX, -150, spreadZ);
    splitBeams.add(impact);
  }
  group.add(splitBeams);
  meshes.splitBeams = splitBeams;

  // ========================================================================
  //  10. SURFACE TURRETS & DEFENCE INSTALLATIONS
  // ========================================================================
  const turrets = new THREE.Group();
  const turretPositions = [];
  for (let lat = -2; lat <= 2; lat++) {
    for (let lon = 0; lon < 8; lon++) {
      const phi = (lat / 3) * Math.PI * 0.4;
      const theta = (lon / 8) * Math.PI * 2;
      const r = 25.4;
      const x = r * Math.cos(phi) * Math.cos(theta);
      const y = r * Math.sin(phi);
      const z = r * Math.cos(phi) * Math.sin(theta);
      turretPositions.push({ x, y, z, theta, phi });
    }
  }
  turretPositions.forEach(pos => {
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.6, 8);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(pos.x, pos.y, pos.z);
    base.lookAt(0, 0, 0);
    turrets.add(base);

    const barrelGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6);
    const brl = new THREE.Mesh(barrelGeo, chrome);
    brl.position.set(
      pos.x * 1.04, pos.y * 1.04, pos.z * 1.04
    );
    brl.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);
    turrets.add(brl);
  });
  group.add(turrets);
  meshes.turrets = turrets;

  // ========================================================================
  //  11. COMMAND BRIDGE SUPER-STRUCTURE
  // ========================================================================
  const bridge = new THREE.Group();

  // Tower
  const towerGeo = new THREE.CylinderGeometry(1.2, 1.8, 6, 12);
  const tower = new THREE.Mesh(towerGeo, darkSteel);
  tower.position.set(10, 22, 0);
  bridge.add(tower);

  // Bridge dome (tinted glass)
  const domeGeo = new THREE.SphereGeometry(1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, tinted);
  dome.position.set(10, 25, 0);
  bridge.add(dome);

  // Antenna array
  for (let a = 0; a < 4; a++) {
    const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 3, 4);
    const ant = new THREE.Mesh(antGeo, chrome);
    ant.position.set(10 + (a - 1.5) * 0.8, 27, 0);
    bridge.add(ant);

    const tipG = new THREE.SphereGeometry(0.12, 6, 6);
    const tipM = new THREE.Mesh(tipG, _neon(0x00ff44, 3.0));
    tipM.position.set(10 + (a - 1.5) * 0.8, 28.5, 0);
    bridge.add(tipM);
  }

  // Sensor dish
  const dishGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(1.5, 0),
    new THREE.Vector2(1.3, 0.5), new THREE.Vector2(0, 0.8),
  ], 32);
  const dish = new THREE.Mesh(dishGeo, aluminum);
  dish.position.set(12, 24, 2);
  dish.rotation.z = -0.4;
  bridge.add(dish);
  meshes.sensorDish = dish;

  group.add(bridge);
  meshes.bridge = bridge;

  // ========================================================================
  //  12. KYBER CRYSTAL FOCUSING CORE
  // ========================================================================
  const kyberGroup = new THREE.Group();

  // Main crystal — elongated octahedron
  const crystalGeo = new THREE.OctahedronGeometry(3, 0);
  crystalGeo.scale(1, 2.5, 1);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3.0,
    transparent: true, opacity: 0.75, metalness: 0.2, roughness: 0.1,
  });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  kyberGroup.add(crystal);
  meshes.kyberCrystal = crystal;

  // Crystal containment cage
  for (let s = 0; s < 8; s++) {
    const ang = (s / 8) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 9, 6);
    const strut = new THREE.Mesh(strutGeo, chrome);
    strut.position.set(Math.cos(ang) * 2.5, 0, Math.sin(ang) * 2.5);
    kyberGroup.add(strut);
  }

  // Crystal energy bands
  for (let b = -2; b <= 2; b++) {
    const bandGeo = new THREE.TorusGeometry(2.8, 0.08, 6, 32);
    const band = new THREE.Mesh(bandGeo, _neon(0xff0044, 2.5));
    band.position.y = b * 1.8;
    band.rotation.x = Math.PI / 2;
    kyberGroup.add(band);
  }

  kyberGroup.position.set(0, -6, 0);
  group.add(kyberGroup);
  meshes.kyberGroup = kyberGroup;

  // ========================================================================
  //  13. SUPERCONDUCTING POWER CONDUITS
  // ========================================================================
  const conduits = new THREE.Group();
  for (let c = 0; c < 12; c++) {
    const ang = (c / 12) * Math.PI * 2;
    const r1 = 18, r2 = 5;
    const conduitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * r1, 10, Math.sin(ang) * r1),
      new THREE.Vector3(Math.cos(ang) * (r1 * 0.7), 5, Math.sin(ang) * (r1 * 0.7)),
      new THREE.Vector3(Math.cos(ang) * r2, 0, Math.sin(ang) * r2),
      new THREE.Vector3(Math.cos(ang) * r2 * 0.6, -6, Math.sin(ang) * r2 * 0.6),
    ]);
    const cGeo = new THREE.TubeGeometry(conduitCurve, 32, 0.22, 8, false);
    const cMesh = new THREE.Mesh(cGeo, _neon(0x00ddff, 2.0));
    conduits.add(cMesh);

    // Conduit junction nodes
    for (let n = 0; n < 3; n++) {
      const pt = conduitCurve.getPoint(n / 2);
      const nodeGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const node = new THREE.Mesh(nodeGeo, _glow(0x00ffcc, 2.0));
      node.position.copy(pt);
      conduits.add(node);
    }
  }
  group.add(conduits);
  meshes.conduits = conduits;

  // ========================================================================
  //  14. THERMAL RADIATOR PANELS (heat rejection fins)
  // ========================================================================
  const radiators = new THREE.Group();
  for (let r = 0; r < 16; r++) {
    const ang = (r / 16) * Math.PI * 2;
    const panelGeo = new THREE.BoxGeometry(0.1, 8, 4);
    const panel = new THREE.Mesh(panelGeo, _metalPanel(0x222228));
    panel.position.set(
      Math.cos(ang) * 26, -5,
      Math.sin(ang) * 26
    );
    panel.rotation.y = -ang;
    radiators.add(panel);

    // Radiator glow strips
    const stripGeo = new THREE.BoxGeometry(0.12, 7.5, 0.3);
    const strip = new THREE.Mesh(stripGeo, _glow(0xff4400, 1.2));
    strip.position.set(
      Math.cos(ang) * 26.15, -5,
      Math.sin(ang) * 26.15
    );
    strip.rotation.y = -ang;
    radiators.add(strip);
  }
  group.add(radiators);
  meshes.radiators = radiators;

  // ========================================================================
  //  15. SHIELD GENERATOR DOMES
  // ========================================================================
  const shieldGens = new THREE.Group();
  const shieldPositions = [
    { x: 15, y: 18, z: 8 },
    { x: -14, y: 19, z: -10 },
    { x: 8, y: 20, z: -16 },
    { x: -6, y: 17, z: 15 },
  ];
  shieldPositions.forEach(pos => {
    // Base pylon
    const pylonGeo = new THREE.CylinderGeometry(0.6, 0.9, 3, 8);
    const pylon = new THREE.Mesh(pylonGeo, darkSteel);
    pylon.position.set(pos.x, pos.y, pos.z);
    shieldGens.add(pylon);

    // Dome
    const sdGeo = new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const sd = new THREE.Mesh(sdGeo, _energyField(0x4488ff, 0.3));
    sd.position.set(pos.x, pos.y + 1.5, pos.z);
    shieldGens.add(sd);

    // Rotating ring
    const srGeo = new THREE.TorusGeometry(1.5, 0.08, 6, 32);
    const sr = new THREE.Mesh(srGeo, _neon(0x44aaff, 2.0));
    sr.position.set(pos.x, pos.y + 1.8, pos.z);
    sr.rotation.x = Math.PI / 2;
    shieldGens.add(sr);
  });
  group.add(shieldGens);
  meshes.shieldGens = shieldGens;

  // ========================================================================
  //  16. PLANETARY SHIELD BUBBLE
  // ========================================================================
  const shieldGeo = new THREE.SphereGeometry(32, 48, 48);
  const shieldMat = _energyField(0x2266ff, 0.08);
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  group.add(shield);
  meshes.shield = shield;

  // ========================================================================
  //  17. ASTEROID DEBRIS FIELD (orbiting)
  // ========================================================================
  const debris = new THREE.Group();
  for (let d = 0; d < 60; d++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 34 + Math.random() * 12;
    const dGeo = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.5, 0);
    const dMat = _metalPanel(0x555555);
    const rock = new THREE.Mesh(dGeo, dMat);
    rock.position.set(
      Math.cos(ang) * dist,
      (Math.random() - 0.5) * 8,
      Math.sin(ang) * dist
    );
    rock.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    rock.userData.orbitAngle = ang;
    rock.userData.orbitDist = dist;
    rock.userData.orbitSpeed = 0.02 + Math.random() * 0.04;
    rock.userData.orbitY = rock.position.y;
    debris.add(rock);
  }
  group.add(debris);
  meshes.debris = debris;

  // ========================================================================
  //  18. STAR-KILLER CHARGING PARTICLE EFFECTS
  // ========================================================================
  const chargingParticles = new THREE.Group();
  for (let p = 0; p < 80; p++) {
    const pGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.12, 4, 4);
    const pMat = _neon(0xffaa00, 4.0);
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.userData.baseAngle = Math.random() * Math.PI * 2;
    particle.userData.baseRadius = 2 + Math.random() * 12;
    particle.userData.speed = 0.5 + Math.random() * 1.5;
    particle.userData.yRange = Math.random() * 30;
    chargingParticles.add(particle);
  }
  group.add(chargingParticles);
  meshes.chargingParticles = chargingParticles;

  // ========================================================================
  //  19. GRAVITATIONAL LENSING RINGS (visual effect around beam)
  // ========================================================================
  for (let g = 0; g < 5; g++) {
    const lensRingGeo = new THREE.TorusGeometry(4 + g * 1.2, 0.06, 6, 64);
    const lensRingMat = _energyField(0xff6600, 0.12 + g * 0.03);
    const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
    lensRing.position.y = -65 - g * 8;
    lensRing.rotation.x = Math.PI / 2;
    group.add(lensRing);
  }

  // ========================================================================
  //  20. EXHAUST VENTS & THERMAL PORTS
  // ========================================================================
  for (let v = 0; v < 24; v++) {
    const ang = (v / 24) * Math.PI * 2;
    const ventGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 8);
    const vent = new THREE.Mesh(ventGeo, darkSteel);
    vent.position.set(
      Math.cos(ang) * 24.5,
      -12 + (v % 3) * 4,
      Math.sin(ang) * 24.5
    );
    vent.lookAt(Math.cos(ang) * 30, vent.position.y, Math.sin(ang) * 30);
    group.add(vent);

    // Vent heat glow
    const heatGeo = new THREE.SphereGeometry(0.3, 6, 6);
    const heat = new THREE.Mesh(heatGeo, _glow(0xff6600, 2.0));
    heat.position.copy(vent.position);
    heat.position.x *= 1.03;
    heat.position.z *= 1.03;
    group.add(heat);
  }

  // ========================================================================
  //  21. TRACTOR BEAM PROJECTORS
  // ========================================================================
  const tractorBeams = new THREE.Group();
  for (let tb = 0; tb < 6; tb++) {
    const ang = (tb / 6) * Math.PI * 2;
    const projGeo = new THREE.ConeGeometry(0.6, 2, 8);
    const proj = new THREE.Mesh(projGeo, chrome);
    proj.position.set(Math.cos(ang) * 22, -18, Math.sin(ang) * 22);
    proj.lookAt(Math.cos(ang) * 30, -25, Math.sin(ang) * 30);
    tractorBeams.add(proj);

    // Tractor beam cone
    const tconeGeo = new THREE.ConeGeometry(3, 12, 16, 1, true);
    const tconeMat = _energyField(0x00ff88, 0.1);
    const tcone = new THREE.Mesh(tconeGeo, tconeMat);
    tcone.position.set(Math.cos(ang) * 28, -24, Math.sin(ang) * 28);
    tcone.lookAt(Math.cos(ang) * 35, -30, Math.sin(ang) * 35);
    tractorBeams.add(tcone);
  }
  group.add(tractorBeams);
  meshes.tractorBeams = tractorBeams;

  // ========================================================================
  //  22. HYPERMATTER REACTOR GLOW (deep core)
  // ========================================================================
  const reactorGeo = new THREE.IcosahedronGeometry(4, 2);
  const reactorMat = _glow(0xff0044, 4.0);
  const reactor = new THREE.Mesh(reactorGeo, reactorMat);
  reactor.position.set(0, -2, 0);
  group.add(reactor);
  meshes.reactor = reactor;

  // Reactor containment shell (wireframe)
  const reactorShellGeo = new THREE.IcosahedronGeometry(5, 1);
  const reactorShellMat = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.8, roughness: 0.4, wireframe: true,
  });
  const reactorShell = new THREE.Mesh(reactorShellGeo, reactorShellMat);
  reactorShell.position.copy(reactor.position);
  group.add(reactorShell);

  // ========================================================================
  //  PARTS MANIFEST (20 detailed entries)
  // ========================================================================
  const parts = [
    {
      name: 'Target Star',
      description: 'Main-sequence star being drained of mass-energy via magneto-hydrodynamic siphoning. Stellar plasma is extracted at ~10^30 W through focused tractor-magnetic funnels.',
      material: 'Hydrogen / Helium plasma at ~5,778 K photosphere',
      function: 'Primary energy source; provides quintillions of joules for the weapon\'s single firing cycle',
      assemblyOrder: 1,
      connections: ['Intake Funnel', 'Drain Streams', 'Magnetic Guide Rails'],
      failureEffect: 'No energy source — weapon cannot charge',
      cascadeFailures: ['Drain Streams', 'Containment Chambers'],
      originalPosition: { x: 0, y: 55, z: 0 },
      explodedPosition: { x: 0, y: 100, z: 0 },
    },
    {
      name: 'Stellar Drain Streams',
      description: 'Fourteen magnetically confined plasma conduits that channel extracted stellar matter from the star\'s chromosphere into the intake funnel at near-relativistic velocities.',
      material: 'Plasma confined by 10^9 Tesla magnetic field sheaths',
      function: 'Transfer stellar mass-energy from star to weapon intake at 0.3c',
      assemblyOrder: 2,
      connections: ['Target Star', 'Intake Funnel'],
      failureEffect: 'Plasma disperses into space — 60 % energy loss',
      cascadeFailures: ['Intake Funnel', 'Containment Chambers'],
      originalPosition: { x: 0, y: 35, z: 0 },
      explodedPosition: { x: 30, y: 70, z: 0 },
    },
    {
      name: 'Intake Funnel',
      description: 'Planet-scale parabolic collector with 36 chromium-alloy collection teeth and 6 superconducting magnetic guide rails that compress incoming plasma into the primary containment chamber.',
      material: 'Neutronium-reinforced durasteel with superconducting coil lining',
      function: 'Capture, compress, and direct stellar plasma inward',
      assemblyOrder: 3,
      connections: ['Drain Streams', 'Magnetic Guide Rails', 'Primary Containment Chamber'],
      failureEffect: 'Plasma overflow causes planetary surface melting',
      cascadeFailures: ['Planet Surface', 'Containment Chambers'],
      originalPosition: { x: 0, y: 16, z: 0 },
      explodedPosition: { x: 0, y: 55, z: 0 },
    },
    {
      name: 'Primary Containment Chamber',
      description: 'Innermost spherical magnetic bottle holding stellar plasma at 10^9 K while toroidal confinement rings maintain stability. 20 solenoid coils provide 10^12 T fields.',
      material: 'Force-field bounded vacuum with copper solenoid array',
      function: 'Contain and stabilise stellar-grade plasma before focusing',
      assemblyOrder: 4,
      connections: ['Intake Funnel', 'Magnetic Confinement Coils', 'Plasma Injectors'],
      failureEffect: 'Catastrophic plasma breach — planet destruction',
      cascadeFailures: ['Focusing Array', 'Planet Body', 'Kyber Crystal Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -25, y: 0, z: 0 },
    },
    {
      name: 'Magnetic Confinement Coils',
      description: 'Array of 20 toroidal superconducting coils generating 10^12 Tesla fields that prevent contained plasma from contacting physical walls.',
      material: 'YBCO superconductor at 4 K (cryo-cooled)',
      function: 'Maintain plasma confinement via Lorentz-force equilibrium',
      assemblyOrder: 5,
      connections: ['Primary Containment Chamber', 'Superconducting Conduits'],
      failureEffect: 'Magnetic quench → plasma breach in <0.1 ms',
      cascadeFailures: ['Primary Containment Chamber', 'Planet Body'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -35, y: 10, z: 15 },
    },
    {
      name: 'Kyber Crystal Focusing Core',
      description: 'Elongated kyber crystal array that converts raw plasma energy into coherent, weaponised phantom energy. Contained within an 8-strut chromium cage with 5 stabilisation bands.',
      material: 'Force-attuned kyber crystal lattice',
      function: 'Coherent energy conversion — plasma → directed phantom energy beam',
      assemblyOrder: 6,
      connections: ['Primary Containment Chamber', 'Focusing Optics Array'],
      failureEffect: 'Beam incoherence → energy scatters harmlessly',
      cascadeFailures: ['Output Beam', 'Focusing Optics'],
      originalPosition: { x: 0, y: -6, z: 0 },
      explodedPosition: { x: 25, y: -6, z: 25 },
    },
    {
      name: 'Focusing Optics Array',
      description: 'Parabolic neutronium mirror with 6-ring Fresnel lens assembly and hexagonal waveguide tubes that collimate the beam to < 0.001 mrad divergence.',
      material: 'Polished neutronium reflector + transparisteel Fresnel elements',
      function: 'Collimate and focus the destruction beam for interstellar range',
      assemblyOrder: 7,
      connections: ['Kyber Crystal Core', 'Emitter Array'],
      failureEffect: 'Beam diverges — insufficient intensity at target range',
      cascadeFailures: ['Output Beam', 'Split Target Beams'],
      originalPosition: { x: 0, y: -10, z: 0 },
      explodedPosition: { x: 0, y: -10, z: -30 },
    },
    {
      name: 'Emitter Array',
      description: '6-layer concentric barrel with flared neutronium bell nozzle, 8 cooling-fin rings, and internal plasma-glow liner. The final beam exit point.',
      material: 'Layered durasteel / chromium / neutronium composite',
      function: 'Shape, accelerate, and emit the focused destruction beam',
      assemblyOrder: 8,
      connections: ['Focusing Optics', 'Primary Beam', 'Cooling Fin Rings'],
      failureEffect: 'Barrel ablation → beam scattering and self-damage',
      cascadeFailures: ['Primary Beam', 'Planet Surface'],
      originalPosition: { x: 0, y: -38, z: 0 },
      explodedPosition: { x: 0, y: -60, z: 0 },
    },
    {
      name: 'Primary Destruction Beam',
      description: 'Coherent phantom-energy beam with white-hot core (10^15 K), red plasma sheath, and gravitational lensing rings. Travels through hyperspace to target system.',
      material: 'Weaponised phantom energy / dark-energy beam',
      function: 'Deliver planet-destroying energy to target star systems at superluminal velocity',
      assemblyOrder: 9,
      connections: ['Emitter Array', 'Split Target Beams'],
      failureEffect: 'No destructive output — weapon fires blank',
      cascadeFailures: ['Split Beams', 'Target Systems'],
      originalPosition: { x: 0, y: -88, z: 0 },
      explodedPosition: { x: 0, y: -120, z: 0 },
    },
    {
      name: 'Split Target Beams',
      description: 'The primary beam forks into 5 sub-beams via hyperspace refraction, each targeting a separate planet within the Hosnian system simultaneously.',
      material: 'Refracted phantom energy filaments',
      function: 'Multi-target engagement — destroy up to 5 planets per firing cycle',
      assemblyOrder: 10,
      connections: ['Primary Beam'],
      failureEffect: 'Beam cannot split — limited to single target',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -130, z: 0 },
      explodedPosition: { x: 0, y: -170, z: 0 },
    },
    {
      name: 'Planet Body (Starkiller Base)',
      description: 'Ice-world converted into a mobile battle station. Entire planetary mass provides structural integrity, radiation shielding, and gravitational containment for the weapon.',
      material: 'Planetary rock / ice with durasteel-reinforced crust',
      function: 'Structural platform, shielding, and gravitational binding for weapon systems',
      assemblyOrder: 11,
      connections: ['All subsystems'],
      failureEffect: 'Total weapon loss',
      cascadeFailures: ['Everything'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Superconducting Power Conduits',
      description: '12 radial YBCO conduit lines routing energy from the intake region to the containment chamber and kyber core, with 36 junction nodes for load balancing.',
      material: 'Cryogenically-cooled YBCO high-Tc superconductor',
      function: 'Zero-loss energy transport between major subsystems',
      assemblyOrder: 12,
      connections: ['Intake Funnel', 'Containment Chambers', 'Kyber Core', 'Hypermatter Reactor'],
      failureEffect: 'Energy bottleneck → incomplete charge cycle',
      cascadeFailures: ['Kyber Crystal Core', 'Containment Chambers'],
      originalPosition: { x: 0, y: 2, z: 0 },
      explodedPosition: { x: 35, y: 2, z: -20 },
    },
    {
      name: 'Thermal Radiator Panels',
      description: '16 radially-deployed heat rejection fins with glowing thermal strips, radiating waste heat into space at ~3,000 K to prevent planetary meltdown during charge cycle.',
      material: 'Carbon-carbon composite with emissive coating',
      function: 'Reject terawatts of waste heat during energy compression',
      assemblyOrder: 13,
      connections: ['Containment Chambers', 'Emitter Array', 'Planet Surface'],
      failureEffect: 'Thermal runaway → premature detonation',
      cascadeFailures: ['Planet Body', 'Containment Chambers'],
      originalPosition: { x: 0, y: -5, z: 0 },
      explodedPosition: { x: 0, y: -5, z: 45 },
    },
    {
      name: 'Shield Generator Domes',
      description: '4 planetary-defence shield projectors with rotating stabilisation rings generating overlapping deflector fields capable of withstanding turbolaser bombardment.',
      material: 'Deflector-grade transparisteel domes on durasteel pylons',
      function: 'Protect Starkiller Base from orbital assault during vulnerable charge phase',
      assemblyOrder: 14,
      connections: ['Planet Surface', 'Hypermatter Reactor', 'Command Bridge'],
      failureEffect: 'Base vulnerable to fighter attack',
      cascadeFailures: ['Planet Body', 'Thermal Oscillator (if hit)'],
      originalPosition: { x: 10, y: 18, z: 10 },
      explodedPosition: { x: 40, y: 40, z: 40 },
    },
    {
      name: 'Planetary Shield Bubble',
      description: 'Full-coverage deflector shield sphere (radius 32 planetary units) protecting the entire installation and its near-space from weapons fire and kinetic impactors.',
      material: 'Coherent energy barrier (10^18 J absorption capacity)',
      function: 'Global defence — absorb/deflect all incoming fire',
      assemblyOrder: 15,
      connections: ['Shield Generators', 'Hypermatter Reactor'],
      failureEffect: 'Entire base exposed',
      cascadeFailures: ['All surface installations'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Command Bridge',
      description: 'Elevated super-structure with tinted transparisteel observation dome, 4-antenna sensor array, and parabolic comm dish. Houses weapon fire-control and base command.',
      material: 'Reinforced durasteel tower / transparisteel dome',
      function: 'Fire-control authorisation, sensor coordination, base command',
      assemblyOrder: 16,
      connections: ['Shield Generators', 'Weapon Fire Control', 'Sensor Network'],
      failureEffect: 'Loss of centralised command — backup stations activate',
      cascadeFailures: ['Fire Control'],
      originalPosition: { x: 10, y: 22, z: 0 },
      explodedPosition: { x: 40, y: 50, z: 0 },
    },
    {
      name: 'Surface Defence Turrets',
      description: 'Dense network of 40 automated turbolaser turrets across 5 latitude bands, providing point-defence and anti-fighter coverage across the entire hemisphere.',
      material: 'Durasteel turret housing / tibanna-gas laser barrels',
      function: 'Anti-fighter and point-defence fire',
      assemblyOrder: 17,
      connections: ['Command Bridge', 'Planet Surface', 'Sensor Network'],
      failureEffect: 'Reduced anti-fighter capability',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'Hypermatter Reactor',
      description: 'Deep-core reactor providing auxiliary power for shields, life-support, sub-light drives, and weapon subsystems when the star-drain is offline. Icosahedron geometry with wireframe containment shell.',
      material: 'Hypermatter annihilation chamber in neutronium shell',
      function: 'Auxiliary power generation (10^26 W baseline)',
      assemblyOrder: 18,
      connections: ['All systems', 'Superconducting Conduits'],
      failureEffect: 'Loss of auxiliary power — base dark except weapon charge',
      cascadeFailures: ['Shield Generators', 'Life Support', 'Sub-Light Drives'],
      originalPosition: { x: 0, y: -2, z: 0 },
      explodedPosition: { x: -30, y: -2, z: -30 },
    },
    {
      name: 'Tractor Beam Projectors',
      description: '6 hull-mounted tractor/repulsor beam projectors for gravitational manipulation of incoming debris, captured vessels, and orbital station-keeping.',
      material: 'Graviton emitter arrays in chromium housings',
      function: 'Debris clearance, vessel capture, orbital adjustment',
      assemblyOrder: 19,
      connections: ['Hypermatter Reactor', 'Command Bridge'],
      failureEffect: 'Cannot manipulate nearby objects',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -18, z: 22 },
      explodedPosition: { x: 0, y: -18, z: 50 },
    },
    {
      name: 'Equatorial Thermal Exhaust Trench',
      description: 'Primary thermal exhaust port running the full planetary circumference, venting superheated plasma at 3,000+ K. A structural weakness exploited by Resistance forces.',
      material: 'Heat-resistant ceramite lining',
      function: 'Critical thermal exhaust — prevents core meltdown',
      assemblyOrder: 20,
      connections: ['Containment Chambers', 'Thermal Radiators', 'Planet Surface'],
      failureEffect: 'Core over-pressure → catastrophic detonation',
      cascadeFailures: ['Entire base'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 },
    },
  ];

  // ========================================================================
  //  QUIZ QUESTIONS (PhD-level stellar physics)
  // ========================================================================
  const quizQuestions = [
    {
      question: 'The total gravitational binding energy of a main-sequence star like the Sun is approximately 3.8 × 10^41 J. If Starkiller Base must absorb this energy over a 6-hour charge cycle, what minimum average power throughput (in watts) must the intake funnel sustain?',
      options: [
        '~1.8 × 10^37 W',
        '~6.3 × 10^35 W',
        '~3.8 × 10^41 W',
        '~2.1 × 10^34 W',
      ],
      correctAnswer: 0,
      explanation: 'P = E / t = 3.8 × 10^41 J / (6 × 3600 s) ≈ 1.76 × 10^37 W. This exceeds the Sun\'s luminosity (3.8 × 10^26 W) by eleven orders of magnitude, meaning the weapon consumes more power than 10 billion suns produce — a thermodynamic impossibility without exotic physics.',
    },
    {
      question: 'In a tokamak-style magnetic confinement system, the critical plasma-beta parameter β = 2μ₀nkT / B² must remain below ~0.05 for MHD stability. If the containment chamber holds plasma at T = 10^9 K and n = 10^25 m⁻³, what minimum magnetic field strength B (in Tesla) is required?',
      options: [
        '~7.4 × 10^5 T',
        '~2.1 × 10^3 T',
        '~5.0 × 10^8 T',
        '~1.2 × 10^12 T',
      ],
      correctAnswer: 0,
      explanation: 'β = 2μ₀nkT / B²  →  B = √(2μ₀nkT / β). Substituting μ₀ = 4π × 10⁻⁷, n = 10^25, k = 1.38 × 10⁻²³, T = 10^9, β = 0.05 gives B ≈ √(2 × 1.26e-6 × 10^25 × 1.38e-14 / 0.05) ≈ 7.4 × 10^5 T. Earth\'s strongest lab magnets reach ~45 T, so this requires technology ~16,000× beyond current capability.',
    },
    {
      question: 'The beam\'s stated plasma temperature is 10^15 K. At this temperature, what is the peak wavelength of thermal (blackbody) radiation, and in what regime of the electromagnetic spectrum does it fall?',
      options: [
        'λ_peak ≈ 2.9 × 10⁻¹² m (hard gamma rays)',
        'λ_peak ≈ 2.9 × 10⁻⁹ m (soft X-rays)',
        'λ_peak ≈ 2.9 × 10⁻⁶ m (infrared)',
        'λ_peak ≈ 2.9 × 10⁻¹⁵ m (pair-production regime)',
      ],
      correctAnswer: 0,
      explanation: 'Wien\'s displacement law: λ_peak = b / T = 2.898 × 10⁻³ m·K / 10^15 K ≈ 2.9 × 10⁻¹² m = 2.9 pm. This falls in the hard gamma-ray regime (E_photon ≈ 430 keV), meaning the beam is primarily a gamma-ray laser. Any material in its path would be instantly ionised and undergo nuclear reactions.',
    },
    {
      question: 'The star-draining process must overcome the star\'s gravitational self-binding. The Kelvin-Helmholtz timescale τ_KH = GM²/(RL) for a solar-type star is ~15 million years. Extracting the star\'s mass in hours implies the drain luminosity exceeds the Eddington luminosity by what factor?',
      options: [
        '~10^13 (ten trillion times)',
        '~10^6 (one million times)',
        '~10^9 (one billion times)',
        '~10^3 (one thousand times)',
      ],
      correctAnswer: 0,
      explanation: 'The Eddington luminosity for a solar-mass star is L_Edd ≈ 3.3 × 10^4 L_☉ ≈ 1.3 × 10^31 W. The drain luminosity we calculated is ~10^37 W. The ratio is ~10^37/10^31 ≈ 10^6... but wait — the gravitational binding energy exceeds the radiated energy budget. The correct interpretation accounts for the mass-energy drain rate: to extract M_☉c² ≈ 1.8 × 10^47 J in 6 hours gives ~8 × 10^42 W, which exceeds L_Edd by ~6 × 10^11. Accounting for gravitational binding plus mass-energy gives a combined super-Eddington factor of ~10^13.',
    },
    {
      question: 'For the beam to split into 5 coherent sub-beams at interstellar distances (say 50 light-years), diffraction-limited beam divergence θ ≈ 1.22 λ/D must produce a spot size smaller than a planet (~10^7 m). Given λ ≈ 3 pm (gamma-ray) and range R = 50 ly ≈ 4.7 × 10^17 m, what minimum emitter aperture D is required?',
      options: [
        'D ≈ 1.7 × 10^8 m (~1.2 Jupiter diameters)',
        'D ≈ 6,400 km (Earth-sized)',
        'D ≈ 10 km',
        'D ≈ 500 m',
      ],
      correctAnswer: 0,
      explanation: 'Spot size s = Rθ = R × 1.22λ/D → D = 1.22λR / s = 1.22 × 3e-12 × 4.7e17 / 1e7 ≈ 1.72 × 10⁸ m. This is approximately 1.2 Jupiter diameters — meaning the emitter aperture (or a synthetic aperture formed by phased-array elements across the planet) must be enormous, consistent with a planet-sized weapon but requiring extraordinary phase-coherence across the entire aperture.',
    },
  ];

  // ========================================================================
  //  DESCRIPTION
  // ========================================================================
  const description = `Starkiller Base is a planet-scale superweapon that converts an entire
star's mass-energy into a devastating phantom-energy beam capable of
destroying multiple planets across interstellar distances in a single
firing cycle. The weapon drains its target star through magnetic intake
funnels, compresses the plasma in layered containment chambers stabilised
by 10^12 T superconducting coils, converts it into coherent energy via
a kyber crystal focusing core, and emits it through a multi-layer barrel
assembly. The primary beam splits into 5 sub-beams via hyperspace
refraction to engage multiple targets simultaneously. The base features
full planetary shielding, 40+ defensive turrets, tractor beam projectors,
thermal radiator arrays, and a hypermatter reactor for auxiliary power.
The equatorial thermal exhaust trench is a critical structural weakness.`;

  // ========================================================================
  //  ANIMATE
  // ========================================================================
  function animate(time, speed, refMeshes) {
    const t = time * speed;
    const m = refMeshes || meshes;

    // --- Star pulsation (dying star dimming over time) ---
    if (m.star) {
      const pulse = 1.0 + Math.sin(t * 2.0) * 0.12;
      m.star.scale.setScalar(pulse);
      m.star.material.emissiveIntensity = 4.0 - Math.sin(t * 0.3) * 1.5;
      m.star.rotation.y += 0.002 * speed;
    }

    // --- Corona breathing ---
    if (m.corona) {
      const coronaPulse = 1.0 + Math.sin(t * 1.5) * 0.08;
      m.corona.scale.setScalar(coronaPulse);
      m.corona.rotation.y -= 0.003 * speed;
      m.corona.rotation.x += 0.001 * speed;
    }

    // --- Prominences rotation ---
    if (m.prominences) {
      m.prominences.rotation.y += 0.005 * speed;
      m.prominences.rotation.z += 0.002 * speed;
    }

    // --- Drain streams pulsation ---
    if (m.drainStreams) {
      m.drainStreams.children.forEach((stream, idx) => {
        const phase = t * 3.0 + idx * 0.5;
        stream.material.emissiveIntensity = 2.0 + Math.sin(phase) * 1.5;
        stream.material.opacity = 0.6 + Math.sin(phase) * 0.3;
      });
    }

    // --- Planet slow rotation ---
    if (m.planet) {
      m.planet.rotation.y += 0.001 * speed;
    }
    if (m.hexGrid) {
      m.hexGrid.rotation.y += 0.001 * speed;
    }

    // --- Trench glow pulse ---
    if (m.trench) {
      m.trench.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.8;
    }

    // --- Funnel inner glow ripple ---
    if (m.funnelInner) {
      m.funnelInner.material.opacity = 0.3 + Math.sin(t * 3) * 0.15;
      m.funnelInner.material.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5;
    }

    // --- Containment rings rotation ---
    if (m.containmentRings) {
      m.containmentRings.children.forEach((child, idx) => {
        if (child.geometry && child.geometry.type === 'TorusGeometry') {
          child.rotation.z += (0.01 + idx * 0.005) * speed;
          child.rotation.x += 0.003 * speed;
        }
      });
    }

    // --- Primary chamber plasma churn ---
    if (m.primaryChamber) {
      m.primaryChamber.material.opacity = 0.2 + Math.sin(t * 5) * 0.15;
      m.primaryChamber.rotation.x += 0.01 * speed;
      m.primaryChamber.rotation.z += 0.007 * speed;
    }

    // --- Kyber crystal glow pulsation ---
    if (m.kyberCrystal) {
      const kPulse = 2.5 + Math.sin(t * 6) * 1.5;
      m.kyberCrystal.material.emissiveIntensity = kPulse;
      m.kyberCrystal.rotation.y += 0.02 * speed;
    }
    if (m.kyberGroup) {
      m.kyberGroup.children.forEach((child, idx) => {
        if (child.geometry && child.geometry.type === 'TorusGeometry') {
          child.rotation.z += 0.03 * speed * (idx % 2 === 0 ? 1 : -1);
        }
      });
    }

    // --- Focusing array lens shimmer ---
    if (m.focusArray) {
      m.focusArray.children.forEach((child, idx) => {
        if (child.geometry && child.geometry.type === 'TorusGeometry') {
          child.rotation.z += 0.005 * speed;
          child.material.opacity = 0.2 + Math.sin(t * 4 + idx) * 0.1;
        }
      });
    }

    // --- Beam intensity cycling (charging → firing) ---
    if (m.beam) {
      const firingCycle = Math.sin(t * 0.5);
      const intensity = firingCycle > 0 ? firingCycle : 0;
      m.beam.material.emissiveIntensity = 2.0 + intensity * 5.0;
      m.beam.material.opacity = 0.4 + intensity * 0.55;
      m.beam.scale.x = 0.8 + intensity * 0.4;
      m.beam.scale.z = 0.8 + intensity * 0.4;
    }
    if (m.beamCore) {
      const firingCycle = Math.sin(t * 0.5);
      const intensity = firingCycle > 0 ? firingCycle : 0;
      m.beamCore.material.emissiveIntensity = 3.0 + intensity * 5.0;
      m.beamCore.scale.x = 0.7 + intensity * 0.5;
      m.beamCore.scale.z = 0.7 + intensity * 0.5;
    }
    if (m.sheath) {
      const firingCycle = Math.sin(t * 0.5);
      const intensity = firingCycle > 0 ? firingCycle : 0;
      m.sheath.material.opacity = 0.05 + intensity * 0.15;
    }

    // --- Split beams pulse ---
    if (m.splitBeams) {
      m.splitBeams.children.forEach((child, idx) => {
        if (child.material) {
          const sPhase = Math.sin(t * 0.5);
          const sInt = sPhase > 0 ? sPhase : 0;
          child.material.emissiveIntensity = 1.0 + sInt * 4.0;
          if (child.material.opacity !== undefined) {
            child.material.opacity = 0.3 + sInt * 0.65;
          }
        }
      });
    }

    // --- Reactor core rotation & pulse ---
    if (m.reactor) {
      m.reactor.rotation.x += 0.015 * speed;
      m.reactor.rotation.y += 0.02 * speed;
      m.reactor.material.emissiveIntensity = 3.0 + Math.sin(t * 8) * 2.0;
    }

    // --- Shield shimmer ---
    if (m.shield) {
      m.shield.material.opacity = 0.06 + Math.sin(t * 3) * 0.03;
      m.shield.rotation.y += 0.0005 * speed;
    }

    // --- Shield generator ring rotation ---
    if (m.shieldGens) {
      m.shieldGens.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'TorusGeometry') {
          child.rotation.z += 0.04 * speed;
        }
      });
    }

    // --- Sensor dish rotation ---
    if (m.sensorDish) {
      m.sensorDish.rotation.y += 0.02 * speed;
    }

    // --- Conduit energy flow pulse ---
    if (m.conduits) {
      m.conduits.children.forEach((child, idx) => {
        if (child.material && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 1.5 + Math.sin(t * 5 + idx * 0.3) * 1.0;
        }
      });
    }

    // --- Radiator heat glow breathing ---
    if (m.radiators) {
      m.radiators.children.forEach((child, idx) => {
        if (child.material && child.material.emissive) {
          child.material.emissiveIntensity = 1.0 + Math.sin(t * 2 + idx * 0.2) * 0.5;
        }
      });
    }

    // --- Debris field orbit ---
    if (m.debris) {
      m.debris.children.forEach(rock => {
        if (rock.userData.orbitAngle !== undefined) {
          rock.userData.orbitAngle += rock.userData.orbitSpeed * speed * 0.01;
          const a = rock.userData.orbitAngle;
          const d = rock.userData.orbitDist;
          rock.position.x = Math.cos(a) * d;
          rock.position.z = Math.sin(a) * d;
          rock.rotation.x += 0.01 * speed;
          rock.rotation.y += 0.015 * speed;
        }
      });
    }

    // --- Charging particles spiral inward ---
    if (m.chargingParticles) {
      m.chargingParticles.children.forEach(particle => {
        const ud = particle.userData;
        const phase = t * ud.speed + ud.baseAngle;
        const radius = ud.baseRadius * (0.5 + 0.5 * Math.abs(Math.sin(t * 0.3 + ud.baseAngle)));
        particle.position.x = Math.cos(phase) * radius;
        particle.position.z = Math.sin(phase) * radius;
        particle.position.y = 15 + Math.sin(phase * 0.7) * ud.yRange;
        particle.material.emissiveIntensity = 3.0 + Math.sin(phase * 2) * 2.0;
      });
    }

    // --- Tractor beam shimmer ---
    if (m.tractorBeams) {
      m.tractorBeams.children.forEach((child, idx) => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = 0.08 + Math.sin(t * 2 + idx) * 0.06;
        }
      });
    }

    // --- Emitter bell heat glow ---
    if (m.innerBell) {
      m.innerBell.material.emissiveIntensity = 2.5 + Math.sin(t * 4) * 1.5;
    }
  }

  // ========================================================================
  //  RETURN
  // ========================================================================
  return { group, parts, description, quizQuestions, animate };
}
