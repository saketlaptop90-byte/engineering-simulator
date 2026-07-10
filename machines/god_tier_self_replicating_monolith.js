// ============================================================================
// GOD TIER — Self-Replicating Von Neumann Monolith
// Ultra-complex THREE.js model: asteroid mining, internal factory, assembly
// line, communication array, daughter monolith emergence & flight
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/* ---------- helper materials ------------------------------------------------ */
function _emissive(hex, intensity = 2.0) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: intensity,
    metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.92
  });
}
function _holo(hex) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: 3.5,
    metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.55, side: THREE.DoubleSide
  });
}
function _panelMat() {
  return new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.85, roughness: 0.25 });
}
function _windowMat() {
  return new THREE.MeshStandardMaterial({
    color: 0x88ccff, emissive: 0x88ccff, emissiveIntensity: 0.6,
    metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.35, side: THREE.DoubleSide
  });
}

/* ---------- geometry helpers ------------------------------------------------ */
function _tube(THREE, path, radius, segments, mat) {
  const curve = new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, segments || 32, radius, 8, false);
  return new THREE.Mesh(geo, mat);
}
function _cyl(THREE, rT, rB, h, seg, mat) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg || 32), mat);
}
function _box(THREE, w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}
function _sphere(THREE, r, mat, wSeg, hSeg) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, wSeg || 32, hSeg || 32), mat);
}
function _ring(THREE, inner, outer, mat) {
  return new THREE.Mesh(new THREE.RingGeometry(inner, outer, 64), mat);
}
function _torus(THREE, r, tube, mat, arc) {
  return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 64, arc), mat);
}
function _lathe(THREE, pts, mat, seg) {
  const v = pts.map(p => new THREE.Vector2(p[0], p[1]));
  return new THREE.Mesh(new THREE.LatheGeometry(v, seg || 64), mat);
}

/* ============================================================================
   createMachine
   ========================================================================= */
export function createMachine(THREE) {
  const group = new THREE.Group();
  const meshes = {};

  // ----- colour palette -----
  const neonCyan     = _emissive(0x00ffff, 2.5);
  const neonMagenta  = _emissive(0xff00ff, 2.0);
  const neonGreen    = _emissive(0x00ff88, 2.2);
  const neonOrange   = _emissive(0xff6600, 2.0);
  const neonRed      = _emissive(0xff2222, 2.5);
  const holoCyan     = _holo(0x00ffff);
  const holoGreen    = _holo(0x22ff88);
  const panelDark    = _panelMat();
  const windowGlass  = _windowMat();

  // =========================================================================
  // 1. MAIN MONOLITH BODY — tall slab with bevelled edges (LatheGeometry)
  // =========================================================================
  const monolithGroup = new THREE.Group();
  const bodyProfile = [
    [0, -6], [2.8, -6], [3.0, -5.8], [3.0, 5.8], [2.8, 6], [0, 6]
  ];
  const monolithBody = _lathe(THREE, bodyProfile, darkSteel, 4); // 4 segments → rectangular cross-section
  monolithBody.name = 'monolithBody';
  monolithGroup.add(monolithBody);
  meshes.monolithBody = monolithBody;

  // Armour panels (dozens of thin plates with panel line gaps)
  for (let row = 0; row < 10; row++) {
    for (let face = 0; face < 4; face++) {
      const panel = _box(THREE, 2.6, 0.9, 0.08, panelDark);
      const angle = (face / 4) * Math.PI * 2;
      panel.position.set(Math.sin(angle) * 3.05, -5.0 + row * 1.2, Math.cos(angle) * 3.05);
      panel.rotation.y = angle;
      monolithGroup.add(panel);
    }
  }

  // Edge accent strips (neon cyan)
  for (let i = 0; i < 4; i++) {
    const strip = _box(THREE, 0.06, 12, 0.06, neonCyan);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    strip.position.set(Math.sin(a) * 3.1, 0, Math.cos(a) * 3.1);
    monolithGroup.add(strip);
  }

  // =========================================================================
  // 2. OBSERVATION WINDOWS — translucent panels revealing internal factory
  // =========================================================================
  const windowGroup = new THREE.Group();
  for (let face = 0; face < 4; face++) {
    for (let row = 0; row < 3; row++) {
      const win = _box(THREE, 1.8, 1.4, 0.04, windowGlass);
      const angle = (face / 4) * Math.PI * 2;
      win.position.set(Math.sin(angle) * 3.08, -1.5 + row * 2.5, Math.cos(angle) * 3.08);
      win.rotation.y = angle;
      windowGroup.add(win);
      // window frame
      const frame = _box(THREE, 2.0, 1.6, 0.02, chrome);
      frame.position.copy(win.position);
      frame.rotation.y = angle;
      windowGroup.add(frame);
    }
  }
  monolithGroup.add(windowGroup);
  meshes.windows = windowGroup;

  // =========================================================================
  // 3. INTERNAL FACTORY — visible through windows
  // =========================================================================
  const factoryGroup = new THREE.Group();

  // 3a. Assembly conveyor belt
  const conveyorGroup = new THREE.Group();
  const belt = _box(THREE, 1.2, 0.1, 8, rubber);
  belt.position.y = -2;
  conveyorGroup.add(belt);
  // Conveyor rollers
  for (let i = 0; i < 12; i++) {
    const roller = _cyl(THREE, 0.12, 0.12, 1.3, 16, aluminum);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, -2.1, -3.5 + i * 0.65);
    conveyorGroup.add(roller);
    meshes['conveyorRoller_' + i] = roller;
  }
  factoryGroup.add(conveyorGroup);
  meshes.conveyor = conveyorGroup;

  // 3b. Smelter crucible
  const smelterProfile = [[0, 0], [0.6, 0], [0.7, 0.1], [0.7, 0.8], [0.5, 1.0], [0, 1.0]];
  const smelter = _lathe(THREE, smelterProfile, copper, 32);
  smelter.position.set(0.8, -2.5, -2);
  factoryGroup.add(smelter);
  // Molten glow inside
  const molten = _sphere(THREE, 0.4, neonOrange);
  molten.position.set(0.8, -2.0, -2);
  factoryGroup.add(molten);
  meshes.moltenGlow = molten;

  // 3c. Fabrication laser array
  const laserGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const laserMount = _cyl(THREE, 0.08, 0.08, 0.5, 8, steel);
    laserMount.position.set(-0.6 + i * 0.25, 0.5, 1);
    laserGroup.add(laserMount);
    const laserTip = _sphere(THREE, 0.04, neonRed);
    laserTip.position.set(-0.6 + i * 0.25, 0.2, 1);
    laserGroup.add(laserTip);
  }
  // Laser beams (thin cylinders toggled in animation)
  for (let i = 0; i < 6; i++) {
    const beam = _cyl(THREE, 0.008, 0.008, 2.5, 4, neonRed);
    beam.position.set(-0.6 + i * 0.25, -0.8, 1);
    beam.visible = false;
    laserGroup.add(beam);
    meshes['laserBeam_' + i] = beam;
  }
  factoryGroup.add(laserGroup);
  meshes.laserArray = laserGroup;

  // 3d. Robotic assembly arms (4 arms on overhead rail)
  const armRailGroup = new THREE.Group();
  const rail = _box(THREE, 0.1, 0.1, 6, chrome);
  rail.position.set(0, 2, 0);
  armRailGroup.add(rail);
  for (let i = 0; i < 4; i++) {
    const armBase = _cyl(THREE, 0.06, 0.06, 0.5, 8, steel);
    armBase.position.set(0, 1.7, -2 + i * 1.5);
    armRailGroup.add(armBase);
    const forearm = _cyl(THREE, 0.04, 0.04, 0.8, 8, aluminum);
    forearm.position.set(0, 1.1, -2 + i * 1.5);
    forearm.rotation.x = 0.3;
    armRailGroup.add(forearm);
    const gripper1 = _box(THREE, 0.02, 0.3, 0.02, chrome);
    gripper1.position.set(-0.06, 0.6, -2 + i * 1.5);
    armRailGroup.add(gripper1);
    const gripper2 = _box(THREE, 0.02, 0.3, 0.02, chrome);
    gripper2.position.set(0.06, 0.6, -2 + i * 1.5);
    armRailGroup.add(gripper2);
    meshes['robotArm_' + i] = forearm;
  }
  factoryGroup.add(armRailGroup);

  // 3e. Sub-component crates on conveyor
  for (let i = 0; i < 5; i++) {
    const crate = _box(THREE, 0.3, 0.25, 0.3, plastic);
    crate.position.set(0, -1.85, -3 + i * 1.5);
    factoryGroup.add(crate);
    meshes['crate_' + i] = crate;
  }

  monolithGroup.add(factoryGroup);
  meshes.factory = factoryGroup;

  // =========================================================================
  // 4. DAUGHTER MONOLITH — small copy being assembled & will fly away
  // =========================================================================
  const daughterGroup = new THREE.Group();
  const daughterBody = _lathe(THREE, bodyProfile.map(([r, y]) => [r * 0.22, y * 0.22]), darkSteel, 4);
  daughterGroup.add(daughterBody);
  // Daughter accent strips
  for (let i = 0; i < 4; i++) {
    const strip = _box(THREE, 0.015, 2.6, 0.015, neonGreen);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    strip.position.set(Math.sin(a) * 0.7, 0, Math.cos(a) * 0.7);
    daughterGroup.add(strip);
  }
  // Daughter thruster nozzles
  for (let i = 0; i < 3; i++) {
    const nozzle = _cyl(THREE, 0.08, 0.12, 0.2, 12, steel);
    const a = (i / 3) * Math.PI * 2;
    nozzle.position.set(Math.sin(a) * 0.4, -1.4, Math.cos(a) * 0.4);
    daughterGroup.add(nozzle);
  }
  daughterGroup.position.set(0, -4, 0);
  daughterGroup.scale.set(0.01, 0.01, 0.01); // starts tiny, grows
  monolithGroup.add(daughterGroup);
  meshes.daughter = daughterGroup;

  // =========================================================================
  // 5. MINING ARMS — 4 articulated boom arms reaching toward asteroid
  // =========================================================================
  const miningArmGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const armGroup = new THREE.Group();
    const angle = (i / 4) * Math.PI * 2;

    // Shoulder joint
    const shoulder = _sphere(THREE, 0.35, chrome, 16, 16);
    shoulder.position.set(0, 0, 0);
    armGroup.add(shoulder);

    // Upper arm
    const upper = _cyl(THREE, 0.18, 0.14, 4.5, 12, steel);
    upper.position.set(0, 0, 2.25);
    upper.rotation.x = Math.PI / 2;
    armGroup.add(upper);
    meshes['miningUpperArm_' + i] = upper;

    // Elbow joint
    const elbow = _sphere(THREE, 0.22, chrome, 12, 12);
    elbow.position.set(0, 0, 4.5);
    armGroup.add(elbow);

    // Forearm
    const forearm = _cyl(THREE, 0.14, 0.10, 3.5, 12, aluminum);
    forearm.position.set(0, 0, 6.25);
    forearm.rotation.x = Math.PI / 2;
    armGroup.add(forearm);
    meshes['miningForearm_' + i] = forearm;

    // Hydraulic piston pair along upper arm
    const pistonOuter = _cyl(THREE, 0.06, 0.06, 2.5, 8, darkSteel);
    pistonOuter.position.set(0.25, 0.15, 1.5);
    pistonOuter.rotation.x = Math.PI / 2;
    armGroup.add(pistonOuter);
    const pistonInner = _cyl(THREE, 0.04, 0.04, 2.0, 8, chrome);
    pistonInner.position.set(0.25, 0.15, 3.2);
    pistonInner.rotation.x = Math.PI / 2;
    armGroup.add(pistonInner);
    meshes['miningPiston_' + i] = pistonInner;

    // Hydraulic lines
    const hLine = _tube(THREE, [
      [-0.2, 0.2, 0.3], [-0.3, 0.3, 1.5], [-0.25, 0.25, 3.5], [-0.2, 0.15, 5.5]
    ], 0.025, 24, copper);
    armGroup.add(hLine);

    // Drill head at tip
    const drillGroup = new THREE.Group();
    const drillBody = _cyl(THREE, 0.2, 0.05, 1.0, 16, steel);
    drillBody.rotation.x = Math.PI / 2;
    drillGroup.add(drillBody);
    // Drill bit spiral (torus segments)
    for (let s = 0; s < 8; s++) {
      const spiral = _torus(THREE, 0.15, 0.02, chrome, Math.PI / 2);
      spiral.position.z = -0.1 * s;
      spiral.rotation.z = s * 0.8;
      drillGroup.add(spiral);
    }
    // Drill tip glow
    const drillGlow = _sphere(THREE, 0.06, neonOrange);
    drillGlow.position.z = -0.5;
    drillGroup.add(drillGlow);
    meshes['drillGlow_' + i] = drillGlow;

    drillGroup.position.set(0, 0, 8);
    armGroup.add(drillGroup);
    meshes['drillHead_' + i] = drillGroup;

    // Position whole arm
    armGroup.position.set(Math.sin(angle) * 3.5, -3, Math.cos(angle) * 3.5);
    armGroup.rotation.y = angle;
    armGroup.rotation.x = 0.4;
    miningArmGroup.add(armGroup);
    meshes['miningArm_' + i] = armGroup;
  }
  monolithGroup.add(miningArmGroup);

  // =========================================================================
  // 6. ASTEROID — irregular rock with ore veins
  // =========================================================================
  const asteroidGroup = new THREE.Group();
  const asteroidGeo = new THREE.IcosahedronGeometry(5, 3);
  // Deform vertices for irregular shape
  const posAttr = asteroidGeo.attributes.position;
  for (let v = 0; v < posAttr.count; v++) {
    const x = posAttr.getX(v), y = posAttr.getY(v), z = posAttr.getZ(v);
    const noise = 1.0 + 0.35 * Math.sin(x * 3.1) * Math.cos(y * 2.7) * Math.sin(z * 1.9);
    posAttr.setXYZ(v, x * noise, y * noise, z * noise);
  }
  asteroidGeo.computeVertexNormals();
  const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x555544, roughness: 0.95, metalness: 0.15 });
  const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
  asteroidGroup.add(asteroid);
  meshes.asteroid = asteroid;

  // Ore veins (bright streaks on surface)
  for (let i = 0; i < 18; i++) {
    const veinLen = 1.0 + Math.random() * 2.5;
    const vein = _cyl(THREE, 0.06 + Math.random() * 0.05, 0.06, veinLen, 6,
      _emissive(Math.random() > 0.5 ? 0xffaa22 : 0x44ddff, 1.5));
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 4.8 + Math.random() * 0.5;
    vein.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    vein.lookAt(0, 0, 0);
    asteroidGroup.add(vein);
  }

  // Craters
  for (let i = 0; i < 8; i++) {
    const crater = _torus(THREE, 0.4 + Math.random() * 0.3, 0.08, rubber);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 5.1;
    crater.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    crater.lookAt(0, 0, 0);
    asteroidGroup.add(crater);
  }

  asteroidGroup.position.set(0, -12, 0);
  group.add(asteroidGroup);
  meshes.asteroidGroup = asteroidGroup;

  // =========================================================================
  // 7. COMMUNICATION ARRAY — top of monolith
  // =========================================================================
  const commGroup = new THREE.Group();

  // Central mast
  const mast = _cyl(THREE, 0.1, 0.1, 3, 12, steel);
  mast.position.y = 7.5;
  commGroup.add(mast);

  // Parabolic dish (LatheGeometry)
  const dishProfile = [];
  for (let t = 0; t <= 1; t += 0.05) {
    dishProfile.push([t * 1.5, t * t * 0.8]);
  }
  const dish = _lathe(THREE, dishProfile, aluminum, 48);
  dish.position.set(0.8, 8.5, 0);
  dish.rotation.z = -0.3;
  commGroup.add(dish);
  meshes.dish = dish;

  // Dish feed horn
  const feedHorn = _cyl(THREE, 0.04, 0.08, 0.4, 8, chrome);
  feedHorn.position.set(0.8, 9.3, 0);
  commGroup.add(feedHorn);

  // Omni antenna array (6 dipole antennas)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const pole = _cyl(THREE, 0.02, 0.02, 1.5, 6, aluminum);
    pole.position.set(Math.sin(a) * 0.6, 9.5, Math.cos(a) * 0.6);
    commGroup.add(pole);
    const tip = _sphere(THREE, 0.04, neonCyan);
    tip.position.set(Math.sin(a) * 0.6, 10.3, Math.cos(a) * 0.6);
    commGroup.add(tip);
    meshes['antennaTip_' + i] = tip;
  }

  // Signal wave rings (animated)
  for (let i = 0; i < 5; i++) {
    const wave = _torus(THREE, 0.5 + i * 0.4, 0.015, holoCyan);
    wave.position.set(0.8, 9.0, 0);
    wave.rotation.x = Math.PI / 2;
    wave.scale.set(0.01, 0.01, 0.01);
    commGroup.add(wave);
    meshes['signalWave_' + i] = wave;
  }

  monolithGroup.add(commGroup);
  meshes.commArray = commGroup;

  // =========================================================================
  // 8. THRUSTER ARRAY — bottom of monolith for station-keeping
  // =========================================================================
  const thrusterGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    // Nozzle (lathe bell shape)
    const nozzleProfile = [[0, 0], [0.15, 0], [0.2, 0.1], [0.25, 0.4], [0.35, 0.7], [0.3, 0.7], [0.15, 0.35], [0.1, 0.05], [0, 0.05]];
    const nozzle = _lathe(THREE, nozzleProfile, darkSteel, 24);
    nozzle.position.set(Math.sin(a) * 2.0, -6.5, Math.cos(a) * 2.0);
    thrusterGroup.add(nozzle);

    // Thruster glow
    const glow = _sphere(THREE, 0.12, neonMagenta);
    glow.position.set(Math.sin(a) * 2.0, -6.9, Math.cos(a) * 2.0);
    thrusterGroup.add(glow);
    meshes['thrusterGlow_' + i] = glow;

    // Fuel lines
    const fuelLine = _tube(THREE, [
      [Math.sin(a) * 1.5, -5, Math.cos(a) * 1.5],
      [Math.sin(a) * 1.8, -5.8, Math.cos(a) * 1.8],
      [Math.sin(a) * 2.0, -6.3, Math.cos(a) * 2.0]
    ], 0.02, 16, copper);
    thrusterGroup.add(fuelLine);
  }
  // Central main engine
  const mainNozzleProfile = [[0, 0], [0.3, 0], [0.4, 0.15], [0.5, 0.6], [0.6, 1.0], [0.5, 1.0], [0.3, 0.5], [0.2, 0.1], [0, 0.1]];
  const mainNozzle = _lathe(THREE, mainNozzleProfile, steel, 32);
  mainNozzle.position.set(0, -6.5, 0);
  thrusterGroup.add(mainNozzle);
  const mainGlow = _cyl(THREE, 0.25, 0.45, 0.8, 16, neonMagenta);
  mainGlow.position.set(0, -7.3, 0);
  thrusterGroup.add(mainGlow);
  meshes.mainThrusterGlow = mainGlow;

  monolithGroup.add(thrusterGroup);

  // =========================================================================
  // 9. SOLAR COLLECTOR WINGS — fold-out panels
  // =========================================================================
  const solarGroup = new THREE.Group();
  for (let side = -1; side <= 1; side += 2) {
    const wingGroup = new THREE.Group();
    // Main panel
    for (let seg = 0; seg < 4; seg++) {
      const panel = _box(THREE, 3.5, 0.04, 1.8, new THREE.MeshStandardMaterial({
        color: 0x112244, metalness: 0.7, roughness: 0.3
      }));
      panel.position.set(side * (4 + seg * 3.6), 2, 0);
      wingGroup.add(panel);
      // Solar cell grid lines
      for (let g = 0; g < 6; g++) {
        const gridLine = _box(THREE, 3.5, 0.005, 0.01, neonCyan);
        gridLine.position.set(side * (4 + seg * 3.6), 2.03, -0.75 + g * 0.3);
        wingGroup.add(gridLine);
      }
      for (let g = 0; g < 10; g++) {
        const gridLine = _box(THREE, 0.01, 0.005, 1.8, neonCyan);
        gridLine.position.set(side * (4 + seg * 3.6) + (-1.6 + g * 0.35), 2.03, 0);
        wingGroup.add(gridLine);
      }
    }
    // Deployment arm
    const deployArm = _cyl(THREE, 0.06, 0.06, 14, 8, aluminum);
    deployArm.rotation.z = Math.PI / 2;
    deployArm.position.set(side * 10, 2, 0);
    wingGroup.add(deployArm);

    solarGroup.add(wingGroup);
    meshes['solarWing_' + (side > 0 ? 'R' : 'L')] = wingGroup;
  }
  monolithGroup.add(solarGroup);

  // =========================================================================
  // 10. RESOURCE PROCESSING — ore crusher, centrifuge, 3D printer
  // =========================================================================
  const processingGroup = new THREE.Group();

  // 10a. Ore crusher — dual rotating drums
  const crusherGroup = new THREE.Group();
  for (let c = 0; c < 2; c++) {
    const drum = _cyl(THREE, 0.4, 0.4, 1.5, 24, steel);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(-0.45 + c * 0.9, -3.5, 2.5);
    crusherGroup.add(drum);
    // Teeth on drum
    for (let t = 0; t < 16; t++) {
      const tooth = _box(THREE, 0.04, 0.1, 1.5, chrome);
      const ta = (t / 16) * Math.PI * 2;
      tooth.position.set(-0.45 + c * 0.9 + Math.sin(ta) * 0.42, -3.5 + Math.cos(ta) * 0.42, 2.5);
      tooth.rotation.z = ta;
      crusherGroup.add(tooth);
    }
    meshes['crusherDrum_' + c] = drum;
  }
  processingGroup.add(crusherGroup);

  // 10b. Centrifuge (spinning ring)
  const centrifuge = _torus(THREE, 0.8, 0.15, steel);
  centrifuge.position.set(0, -3, -2.5);
  processingGroup.add(centrifuge);
  meshes.centrifuge = centrifuge;
  // Centrifuge inner glow
  const centGlow = _torus(THREE, 0.8, 0.05, neonGreen);
  centGlow.position.set(0, -3, -2.5);
  processingGroup.add(centGlow);
  meshes.centrifugeGlow = centGlow;

  // 10c. 3D printer head
  const printerHead = _box(THREE, 0.3, 0.2, 0.3, aluminum);
  printerHead.position.set(0, 1.5, 2.5);
  processingGroup.add(printerHead);
  const printerNozzle = _cyl(THREE, 0.02, 0.06, 0.15, 8, chrome);
  printerNozzle.position.set(0, 1.35, 2.5);
  processingGroup.add(printerNozzle);
  meshes.printerHead = printerHead;

  // Print bed
  const printBed = _box(THREE, 1.5, 0.05, 1.5, steel);
  printBed.position.set(0, 0.8, 2.5);
  processingGroup.add(printBed);

  // Partially printed component on bed (grows in animation)
  const printedPart = _box(THREE, 0.5, 0.3, 0.5, aluminum);
  printedPart.position.set(0, 1.0, 2.5);
  printedPart.scale.y = 0.01;
  processingGroup.add(printedPart);
  meshes.printedPart = printedPart;

  monolithGroup.add(processingGroup);

  // =========================================================================
  // 11. MATERIAL TRANSPORT — conveyor tubes connecting mining to factory
  // =========================================================================
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const transportTube = _tube(THREE, [
      [Math.sin(angle) * 3.5, -6, Math.cos(angle) * 3.5],
      [Math.sin(angle) * 4.5, -8, Math.cos(angle) * 4.5],
      [Math.sin(angle) * 3.0, -10, Math.cos(angle) * 3.0],
      [0, -11, 0]
    ], 0.12, 32, new THREE.MeshStandardMaterial({
      color: 0x334455, metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.7
    }));
    monolithGroup.add(transportTube);

    // Material pellets moving through tube (animated)
    for (let p = 0; p < 3; p++) {
      const pellet = _sphere(THREE, 0.08, neonOrange);
      pellet.position.set(Math.sin(angle) * 3.5, -6 - p * 2, Math.cos(angle) * 3.5);
      monolithGroup.add(pellet);
      meshes['pellet_' + i + '_' + p] = pellet;
    }
  }

  // =========================================================================
  // 12. STATUS DISPLAYS & CONTROL — holographic readouts
  // =========================================================================
  const displayGroup = new THREE.Group();
  // 4 holographic screens
  for (let face = 0; face < 4; face++) {
    const angle = (face / 4) * Math.PI * 2 + Math.PI / 8;
    const screenBg = _box(THREE, 1.2, 0.8, 0.01, new THREE.MeshStandardMaterial({
      color: 0x001122, emissive: 0x003366, emissiveIntensity: 0.5,
      transparent: true, opacity: 0.7
    }));
    screenBg.position.set(Math.sin(angle) * 3.3, 3.5, Math.cos(angle) * 3.3);
    screenBg.rotation.y = angle;
    displayGroup.add(screenBg);

    // Scrolling data bars
    for (let b = 0; b < 5; b++) {
      const bar = _box(THREE, 0.8 * Math.random() + 0.2, 0.06, 0.005, holoGreen);
      bar.position.set(
        Math.sin(angle) * 3.35 - Math.cos(angle) * (0.4 - b * 0.1),
        3.2 + b * 0.13,
        Math.cos(angle) * 3.35 + Math.sin(angle) * (0.4 - b * 0.1)
      );
      bar.rotation.y = angle;
      displayGroup.add(bar);
      meshes['dataBar_' + face + '_' + b] = bar;
    }
  }
  monolithGroup.add(displayGroup);

  // =========================================================================
  // 13. DEBRIS / MINING PARTICLES — floating rock chunks
  // =========================================================================
  const debrisGroup = new THREE.Group();
  for (let i = 0; i < 30; i++) {
    const size = 0.05 + Math.random() * 0.2;
    const chunk = new THREE.Mesh(
      new THREE.IcosahedronGeometry(size, 0),
      new THREE.MeshStandardMaterial({ color: 0x777766, roughness: 0.9 })
    );
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 6 + Math.random() * 4;
    chunk.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      -12 + r * Math.cos(phi) * 0.5,
      r * Math.sin(phi) * Math.sin(theta)
    );
    debrisGroup.add(chunk);
    meshes['debris_' + i] = chunk;
  }
  group.add(debrisGroup);

  // =========================================================================
  // 14. DOCKING PORTS — 2 universal docking collars
  // =========================================================================
  for (let side = -1; side <= 1; side += 2) {
    const dockGroup = new THREE.Group();
    const collar = _torus(THREE, 0.6, 0.08, steel);
    collar.rotation.z = Math.PI / 2;
    dockGroup.add(collar);
    // Alignment guides
    for (let g = 0; g < 4; g++) {
      const guide = _cyl(THREE, 0.03, 0.03, 0.3, 6, neonCyan);
      const ga = (g / 4) * Math.PI * 2;
      guide.position.set(Math.sin(ga) * 0.6, Math.cos(ga) * 0.6, 0.15);
      dockGroup.add(guide);
    }
    // Port indicator light
    const portLight = _sphere(THREE, 0.06, neonGreen);
    portLight.position.set(0, 0.75, 0);
    dockGroup.add(portLight);
    meshes['dockLight_' + (side > 0 ? 'R' : 'L')] = portLight;

    dockGroup.position.set(side * 3.2, 0, 0);
    dockGroup.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    monolithGroup.add(dockGroup);
  }

  // =========================================================================
  // 15. SENSOR CLUSTER — lidar, spectrometer, star trackers
  // =========================================================================
  const sensorGroup = new THREE.Group();
  // Lidar dome
  const lidarDome = _sphere(THREE, 0.3, glass, 24, 24);
  lidarDome.position.set(0, 6.5, 2.5);
  sensorGroup.add(lidarDome);
  const lidarEmitter = _sphere(THREE, 0.1, neonRed);
  lidarEmitter.position.set(0, 6.5, 2.5);
  sensorGroup.add(lidarEmitter);
  meshes.lidarEmitter = lidarEmitter;

  // Spectrometer housing
  const spectro = _box(THREE, 0.6, 0.3, 0.4, darkSteel);
  spectro.position.set(1.5, 5.5, 2.8);
  sensorGroup.add(spectro);
  const spectroLens = _cyl(THREE, 0.08, 0.08, 0.1, 12, glass);
  spectroLens.position.set(1.5, 5.5, 3.05);
  spectroLens.rotation.x = Math.PI / 2;
  sensorGroup.add(spectroLens);

  // Star trackers (2)
  for (let s = -1; s <= 1; s += 2) {
    const tracker = _cyl(THREE, 0.12, 0.12, 0.25, 12, darkSteel);
    tracker.position.set(s * 2, 6.2, 0);
    tracker.rotation.x = -0.3;
    sensorGroup.add(tracker);
    const trackerLens = _sphere(THREE, 0.08, glass, 12, 12);
    trackerLens.position.set(s * 2, 6.35, -0.1);
    sensorGroup.add(trackerLens);
  }
  monolithGroup.add(sensorGroup);

  // =========================================================================
  // 16. PARTICLE / EXHAUST EFFECTS — mining sparks & thruster plumes
  // =========================================================================
  const sparkGroup = new THREE.Group();
  for (let i = 0; i < 40; i++) {
    const spark = _sphere(THREE, 0.03, _emissive(0xffaa00, 3));
    spark.position.set(
      (Math.random() - 0.5) * 2,
      -10 - Math.random() * 4,
      (Math.random() - 0.5) * 2
    );
    spark.visible = true;
    sparkGroup.add(spark);
    meshes['spark_' + i] = spark;
  }
  group.add(sparkGroup);

  // Thruster plume particles
  const plumeGroup = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const plume = _sphere(THREE, 0.06 + Math.random() * 0.08,
      _emissive(0xff44ff, 2 + Math.random()));
    plume.position.set(
      (Math.random() - 0.5) * 0.8,
      -7.5 - Math.random() * 1.5,
      (Math.random() - 0.5) * 0.8
    );
    plumeGroup.add(plume);
    meshes['plume_' + i] = plume;
  }
  monolithGroup.add(plumeGroup);

  // =========================================================================
  // FINAL ASSEMBLY
  // =========================================================================
  group.add(monolithGroup);
  meshes.monolith = monolithGroup;

  // =========================================================================
  // PARTS
  // =========================================================================
  const parts = [
    {
      name: 'Von Neumann Monolith Core',
      description: 'Primary structural hull housing the entire self-replicating factory complex. Built from radiation-hardened darkSteel alloy with micrometeorite shielding.',
      material: 'Radiation-hardened darkSteel composite',
      function: 'Provides structural integrity, radiation shielding, and thermal regulation for internal factory systems',
      assemblyOrder: 1,
      connections: ['Internal Factory', 'Solar Collectors', 'Communication Array', 'Thruster Array'],
      failureEffect: 'Total structural compromise; depressurization terminates all replication activity',
      cascadeFailures: ['Internal Factory', 'Mining Arms', 'Communication Array'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'Internal Factory Complex',
      description: 'Fully autonomous manufacturing floor with conveyor systems, robotic arms, smelters, and laser cutters capable of fabricating every component of a copy monolith.',
      material: 'Steel framework, aluminum tracks, copper smelting crucibles',
      function: 'Processes raw ore into refined materials, fabricates components, and assembles daughter monoliths',
      assemblyOrder: 3,
      connections: ['Von Neumann Monolith Core', 'Resource Processing', 'Daughter Monolith'],
      failureEffect: 'Manufacturing halts; no new components can be produced, replication impossible',
      cascadeFailures: ['Daughter Monolith', '3D Printer Head'],
      originalPosition: { x: 0, y: -2, z: 0 },
      explodedPosition: { x: 0, y: -2, z: 8 }
    },
    {
      name: 'Mining Arm Array',
      description: 'Four articulated boom arms with hydraulic pistons and rotary drill heads for extracting ore from asteroid surfaces.',
      material: 'Steel booms, chrome joints, copper hydraulic lines',
      function: 'Drills into asteroid surface, extracts metallic ore and volatiles for processing',
      assemblyOrder: 4,
      connections: ['Von Neumann Monolith Core', 'Asteroid', 'Material Transport Tubes'],
      failureEffect: 'Raw material acquisition ceases; factory runs on reserves until depleted',
      cascadeFailures: ['Resource Processing', 'Internal Factory Complex'],
      originalPosition: { x: 0, y: -3, z: 0 },
      explodedPosition: { x: 0, y: -3, z: 12 }
    },
    {
      name: 'Communication Array',
      description: 'High-gain parabolic dish with omnidirectional dipole antenna cluster for coordinating with other monoliths across the solar system.',
      material: 'Aluminum reflector, chrome feed horn, copper dipoles',
      function: 'Transmits telemetry, receives replication directives, coordinates swarm behaviour with peer monoliths',
      assemblyOrder: 6,
      connections: ['Von Neumann Monolith Core', 'Sensor Cluster'],
      failureEffect: 'Monolith becomes isolated; cannot coordinate swarm, risking resource conflicts',
      cascadeFailures: ['Swarm Coordination Protocol'],
      originalPosition: { x: 0, y: 7.5, z: 0 },
      explodedPosition: { x: 0, y: 18, z: 0 }
    },
    {
      name: 'Solar Collector Wings',
      description: 'Four-segment deployable photovoltaic arrays providing primary power. Each segment contains gallium-arsenide multi-junction cells.',
      material: 'GaAs photovoltaic cells, aluminum deployment arms',
      function: 'Converts solar radiation to electrical power for all factory, mining, and propulsion systems',
      assemblyOrder: 5,
      connections: ['Von Neumann Monolith Core', 'Power Distribution'],
      failureEffect: 'Power generation drops to backup RTG levels; replication rate drops 90%',
      cascadeFailures: ['Internal Factory Complex', 'Mining Arm Array', 'Thruster Array'],
      originalPosition: { x: 0, y: 2, z: 0 },
      explodedPosition: { x: 25, y: 2, z: 0 }
    },
    {
      name: 'Daughter Monolith',
      description: 'The in-progress replica being assembled on the internal factory floor. Starts as a micro-seed and grows to full scale before detachment.',
      material: 'Identical to parent monolith (darkSteel, aluminum, copper, steel)',
      function: 'Becomes a fully autonomous self-replicating probe upon completion and deployment',
      assemblyOrder: 10,
      connections: ['Internal Factory Complex', 'Resource Processing'],
      failureEffect: 'Replication failure; parent must restart assembly from scratch',
      cascadeFailures: [],
      originalPosition: { x: 0, y: -4, z: 0 },
      explodedPosition: { x: 0, y: 15, z: 15 }
    },
    {
      name: 'Thruster Array',
      description: 'Six auxiliary RCS thrusters and one central main engine for orbital manoeuvring and station-keeping around the asteroid.',
      material: 'DarkSteel nozzles, copper fuel lines, steel combustion chambers',
      function: 'Provides delta-v for orbit maintenance, attitude control, and inter-asteroid transfer',
      assemblyOrder: 2,
      connections: ['Von Neumann Monolith Core', 'Fuel Reserves'],
      failureEffect: 'Loss of orbital station-keeping; monolith drifts away from asteroid',
      cascadeFailures: ['Mining Arm Array'],
      originalPosition: { x: 0, y: -6.5, z: 0 },
      explodedPosition: { x: 0, y: -16, z: 0 }
    },
    {
      name: 'Resource Processing Unit',
      description: 'Ore crusher with toothed drums, centrifuge for material separation, and feedstock preparation system.',
      material: 'Steel drums, chrome teeth, copper centrifuge',
      function: 'Crushes raw ore, separates metals from slag via centrifugal force, prepares feedstock for 3D printer',
      assemblyOrder: 7,
      connections: ['Mining Arm Array', 'Internal Factory Complex', '3D Printer Head'],
      failureEffect: 'Raw ore cannot be refined; factory receives no usable feedstock',
      cascadeFailures: ['Internal Factory Complex', '3D Printer Head'],
      originalPosition: { x: 0, y: -3, z: 2.5 },
      explodedPosition: { x: 8, y: -3, z: 8 }
    },
    {
      name: '3D Printer Head',
      description: 'Additive manufacturing system capable of printing structural components, circuit boards, and even optical elements layer by layer.',
      material: 'Aluminum carriage, chrome nozzle, steel print bed',
      function: 'Fabricates precision components for daughter monolith from refined feedstock',
      assemblyOrder: 8,
      connections: ['Resource Processing Unit', 'Internal Factory Complex'],
      failureEffect: 'Cannot produce precision parts; only coarse cast components available',
      cascadeFailures: ['Daughter Monolith'],
      originalPosition: { x: 0, y: 1.5, z: 2.5 },
      explodedPosition: { x: 10, y: 5, z: 10 }
    },
    {
      name: 'Sensor Cluster',
      description: 'Lidar dome, spectrometer, and dual star trackers for asteroid mapping, composition analysis, and autonomous navigation.',
      material: 'Glass domes, darkSteel housing, precision optics',
      function: 'Maps asteroid topology, identifies richest ore veins, provides navigation fixes',
      assemblyOrder: 9,
      connections: ['Von Neumann Monolith Core', 'Communication Array', 'Mining Arm Array'],
      failureEffect: 'Blind mining; drill heads may hit voids, reducing yield and risking damage',
      cascadeFailures: ['Mining Arm Array'],
      originalPosition: { x: 0, y: 6.5, z: 2.5 },
      explodedPosition: { x: 6, y: 14, z: 6 }
    },
    {
      name: 'Material Transport Tubes',
      description: 'Pressurised pneumatic tubes carrying crushed ore pellets from mining arms to the processing unit inside the factory.',
      material: 'Semi-transparent alloy tubes with copper fittings',
      function: 'Transports raw material from drill sites on asteroid surface into the internal factory',
      assemblyOrder: 5,
      connections: ['Mining Arm Array', 'Resource Processing Unit'],
      failureEffect: 'Material blockage; mining continues but ore cannot reach factory',
      cascadeFailures: ['Resource Processing Unit'],
      originalPosition: { x: 0, y: -8, z: 0 },
      explodedPosition: { x: 0, y: -8, z: 12 }
    },
    {
      name: 'Observation Windows',
      description: 'Radiation-hardened borosilicate glass panels with chrome frames allowing visual inspection of the internal factory floor.',
      material: 'Borosilicate glass, chrome frames',
      function: 'Enables external visual monitoring of factory operations; also serves as thermal radiators',
      assemblyOrder: 3,
      connections: ['Von Neumann Monolith Core'],
      failureEffect: 'Loss of visual inspection capability; thermal regulation slightly impacted',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0, z: 3.08 },
      explodedPosition: { x: 0, y: 0, z: 10 }
    },
    {
      name: 'Docking Ports',
      description: 'Universal docking collars with alignment guides for receiving supply ships or connecting with peer monoliths for material sharing.',
      material: 'Steel collars, neon alignment guides',
      function: 'Allows physical docking with other spacecraft for resource exchange or cooperative assembly',
      assemblyOrder: 6,
      connections: ['Von Neumann Monolith Core', 'Communication Array'],
      failureEffect: 'Cannot physically connect with peers; limited to wireless coordination only',
      cascadeFailures: [],
      originalPosition: { x: 3.2, y: 0, z: 0 },
      explodedPosition: { x: 12, y: 0, z: 0 }
    },
    {
      name: 'Holographic Status Displays',
      description: 'Four holographic projection screens showing real-time factory status, replication progress, ore reserves, and swarm telemetry.',
      material: 'Transparent OLED substrates, neon data projectors',
      function: 'Visualises machine state for remote operators and autonomous decision-making AI',
      assemblyOrder: 9,
      connections: ['Von Neumann Monolith Core', 'Sensor Cluster'],
      failureEffect: 'No visual telemetry; autonomous AI falls back to raw sensor data only',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 3.5, z: 3.3 },
      explodedPosition: { x: 0, y: 10, z: 10 }
    },
    {
      name: 'Asteroid Body',
      description: 'The target C-type carbonaceous chondrite asteroid being mined. Rich in iron, nickel, platinum-group metals, and water ice.',
      material: 'Natural silicate rock with metallic ore veins',
      function: 'Serves as the raw material source for self-replication; provides reaction mass for propulsion',
      assemblyOrder: 0,
      connections: ['Mining Arm Array', 'Material Transport Tubes'],
      failureEffect: 'Asteroid depletion triggers monolith migration to next target body',
      cascadeFailures: ['Mining Arm Array', 'Resource Processing Unit'],
      originalPosition: { x: 0, y: -12, z: 0 },
      explodedPosition: { x: 0, y: -25, z: 0 }
    },
    {
      name: 'Laser Fabrication Array',
      description: 'Six precision laser cutters mounted on overhead rail for cutting, welding, and sintering components during assembly.',
      material: 'Steel mounts, neon-red laser emitters',
      function: 'Performs precision cutting and welding operations on fabricated components',
      assemblyOrder: 8,
      connections: ['Internal Factory Complex', '3D Printer Head'],
      failureEffect: 'Cannot perform precision welds; assembly quality degrades, daughter monolith may be defective',
      cascadeFailures: ['Daughter Monolith'],
      originalPosition: { x: 0, y: 0.5, z: 1 },
      explodedPosition: { x: 8, y: 8, z: 4 }
    }
  ];

  // =========================================================================
  // QUIZ QUESTIONS — PhD-level self-replication & automata theory
  // =========================================================================
  const quizQuestions = [
    {
      question: 'In Von Neumann\'s kinematic self-replicating automaton, what are the five functional subsystems, and which subsystem is responsible for interpreting the stored description to guide construction — thereby distinguishing genotype-like information from phenotype-like structure?',
      options: [
        'A) Constructor (A), Copier (B), Controller (C), Description (D), Offspring (E) — the Controller (C) reads D to direct A',
        'B) Factory, Magazine, Duplicator, Supervisor, Product — the Supervisor interprets the Magazine',
        'C) Assembler, Blueprint, Executor, Memory, Child — the Executor reads Memory',
        'D) Builder, Tape, Decoder, Regulator, Clone — the Decoder reads the Tape'
      ],
      correctAnswer: 0,
      explanation: 'Von Neumann\'s original formulation uses: Constructor A (builds from description), Copier B (duplicates description), Controller C (coordinates A and B by reading description D), Description D (the blueprint, analogous to DNA), and the combined Offspring A+B+C+D. The Controller C acts as the "ribosome" that interprets the genotypic description D.'
    },
    {
      question: 'Langton\'s self-replicating loops demonstrated that self-replication does not require a universal constructor. What key simplification did Langton introduce compared to Von Neumann\'s design, and what fundamental capability was sacrificed?',
      options: [
        'A) Langton used a 2D cellular automaton with only 8 states and sacrificed computational universality — the loops can replicate but cannot compute arbitrary functions',
        'B) Langton used a 3D voxel grid and sacrificed speed of replication',
        'C) Langton used continuous-space agents and sacrificed deterministic behaviour',
        'D) Langton used a 1D tape and sacrificed parallel replication ability'
      ],
      correctAnswer: 0,
      explanation: 'Langton\'s loops operate in a 2D cellular automaton with only 8 states (vs. Von Neumann\'s 29). They can self-replicate by extending an arm, constructing a daughter loop, and transferring the genome stored in the loop\'s sheath. However, they are NOT computationally universal — they cannot perform arbitrary computation, which Von Neumann considered essential for open-ended evolution.'
    },
    {
      question: 'A self-replicating probe is launched from Earth and replicates with a doubling time T at each asteroid. Ignoring travel time, after how many generations n does the total number of probes exceed the number of asteroids in the main belt (~1.5 million with diameter > 1 km)? What does this imply about resource limits?',
      options: [
        'A) n = ceil(log₂(1,500,000)) ≈ 21 generations; exponential growth is physically constrained by finite resources long before galactic scales',
        'B) n = 1,500,000 generations because each generation produces one probe',
        'C) n = sqrt(1,500,000) ≈ 1225 generations due to quadratic growth',
        'D) n is undefined because probes cannot replicate without biological enzymes'
      ],
      correctAnswer: 0,
      explanation: '2^n > 1,500,000 gives n > log₂(1,500,000) ≈ 20.5, so n = 21 generations. With even a modest doubling time of 1 year, the entire main belt is saturated in ~21 years. This illustrates the "grey goo" concern: exponential replicators rapidly exhaust finite resources. Real systems face logistic growth curves bounded by material/energy availability, travel time, and component failure rates.'
    },
    {
      question: 'The Quine concept in computer science is the software analogue of self-replication. A Quine is a program that outputs its own source code with no input. How does the structure of a Quine relate to Von Neumann\'s self-replicating automaton, and what is the role of the "data-as-code duality"?',
      options: [
        'A) Like Von Neumann\'s automaton, a Quine has two phases: one where data is interpreted as instructions (execution phase) and one where the same data is copied literally (duplication phase) — mirroring the DNA transcription/replication duality',
        'B) A Quine has nothing to do with Von Neumann; it is purely a mathematical curiosity',
        'C) A Quine requires external input to function, unlike Von Neumann machines',
        'D) A Quine uses recursive data structures that Von Neumann\'s model cannot represent'
      ],
      correctAnswer: 0,
      explanation: 'A Quine stores its own code as a data string, then uses that string twice: once as instructions to execute (which prints the data) and once as literal data (which is printed as-is). This mirrors Von Neumann\'s automaton where Description D is first read by Controller C as instructions to build (phenotype expression) and then copied verbatim by Copier B (genotype replication). This data-as-code duality is fundamental to all self-replicating systems, biological or artificial.'
    },
    {
      question: 'The Fermi Paradox is often discussed alongside Von Neumann probes. If a self-replicating probe can traverse the Milky Way in ~4 million years (using conservative estimates), why is the absence of such probes (the "Fermi silence") considered paradoxical, and what is the strongest proposed resolution involving replicator reliability?',
      options: [
        'A) The paradox arises because 4 million years is tiny compared to the galaxy\'s ~13 billion year age; the strongest reliability-based resolution is that mutation accumulation during imperfect replication leads to "replicative decay" — probes eventually lose function like biological ageing',
        'B) The paradox is not real because 4 million years is too long for any civilisation to wait',
        'C) The resolution is that faster-than-light travel is required, which is impossible',
        'D) The silence is because all civilisations use radio instead of physical probes'
      ],
      correctAnswer: 0,
      explanation: 'Even at 1% of light speed with replication at each star, Von Neumann probes could permeate the Milky Way in ~4 million years — a blink compared to galactic timescales. The replicative decay hypothesis (Tipler\'s objection inverted) suggests that without perfect error correction, each replication generation introduces defects. Over thousands of generations, probes accumulate fatal errors and cease functioning — analogous to Muller\'s ratchet in asexual organisms. This sets a maximum "replication horizon" beyond which the probe lineage goes extinct.'
    }
  ];

  // =========================================================================
  // ANIMATE
  // =========================================================================
  function animate(time, speed, _meshes) {
    const t = time * speed;
    const m = _meshes || meshes;

    // --- Monolith slow rotation ---
    if (m.monolith) {
      m.monolith.rotation.y = t * 0.08;
    }

    // --- Asteroid slow tumble ---
    if (m.asteroid) {
      m.asteroid.rotation.x = t * 0.05;
      m.asteroid.rotation.z = t * 0.03;
    }

    // --- Mining arms articulation ---
    for (let i = 0; i < 4; i++) {
      const arm = m['miningArm_' + i];
      if (arm) {
        arm.rotation.x = 0.4 + Math.sin(t * 0.6 + i * 1.5) * 0.2;
        arm.rotation.z = Math.sin(t * 0.4 + i * 0.8) * 0.15;
      }
      // Piston extension synced with arm
      const piston = m['miningPiston_' + i];
      if (piston) {
        piston.scale.z = 1.0 + Math.sin(t * 0.6 + i * 1.5) * 0.3;
      }
      // Drill head spin
      const drill = m['drillHead_' + i];
      if (drill) {
        drill.rotation.z = t * 8;
      }
      // Drill glow pulse
      const dg = m['drillGlow_' + i];
      if (dg && dg.material) {
        dg.material.emissiveIntensity = 1.5 + Math.sin(t * 12 + i) * 1.0;
      }
    }

    // --- Conveyor rollers spin ---
    for (let i = 0; i < 12; i++) {
      const roller = m['conveyorRoller_' + i];
      if (roller) roller.rotation.x = t * 3;
    }

    // --- Crates move along conveyor ---
    for (let i = 0; i < 5; i++) {
      const crate = m['crate_' + i];
      if (crate) {
        crate.position.z = -3 + ((t * 0.3 + i * 1.5) % 7.5);
      }
    }

    // --- Laser beams flicker ---
    for (let i = 0; i < 6; i++) {
      const beam = m['laserBeam_' + i];
      if (beam) {
        beam.visible = Math.sin(t * 6 + i * 2) > 0.3;
      }
    }

    // --- Robot arms oscillate ---
    for (let i = 0; i < 4; i++) {
      const rArm = m['robotArm_' + i];
      if (rArm) {
        rArm.rotation.x = 0.3 + Math.sin(t * 1.5 + i) * 0.4;
        rArm.rotation.z = Math.sin(t * 1.2 + i * 0.7) * 0.2;
      }
    }

    // --- Crusher drums counter-rotate ---
    for (let c = 0; c < 2; c++) {
      const drum = m['crusherDrum_' + c];
      if (drum) {
        drum.rotation.x = t * 4 * (c === 0 ? 1 : -1);
      }
    }

    // --- Centrifuge spin ---
    if (m.centrifuge) {
      m.centrifuge.rotation.z = t * 5;
    }
    if (m.centrifugeGlow && m.centrifugeGlow.material) {
      m.centrifugeGlow.material.emissiveIntensity = 2 + Math.sin(t * 8) * 1;
      m.centrifugeGlow.rotation.z = t * 5;
    }

    // --- 3D printer head sweeps ---
    if (m.printerHead) {
      m.printerHead.position.x = Math.sin(t * 2) * 0.5;
      m.printerHead.position.z = 2.5 + Math.cos(t * 1.5) * 0.5;
    }

    // --- Printed part grows ---
    if (m.printedPart) {
      m.printedPart.scale.y = 0.01 + (Math.sin(t * 0.15) * 0.5 + 0.5);
    }

    // --- Molten glow pulse ---
    if (m.moltenGlow && m.moltenGlow.material) {
      m.moltenGlow.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 1.0;
      m.moltenGlow.scale.setScalar(0.9 + Math.sin(t * 3) * 0.15);
    }

    // --- Communication dish slow sweep ---
    if (m.dish) {
      m.dish.rotation.y = Math.sin(t * 0.2) * 0.6;
    }

    // --- Signal wave rings expand & fade ---
    for (let i = 0; i < 5; i++) {
      const wave = m['signalWave_' + i];
      if (wave) {
        const phase = (t * 0.5 + i * 0.7) % 3.5;
        const s = 0.01 + phase * 1.2;
        wave.scale.set(s, s, s);
        if (wave.material) wave.material.opacity = Math.max(0, 0.6 - phase * 0.18);
      }
    }

    // --- Antenna tips blink ---
    for (let i = 0; i < 6; i++) {
      const tip = m['antennaTip_' + i];
      if (tip && tip.material) {
        tip.material.emissiveIntensity = 1.5 + Math.sin(t * 4 + i * 1.05) * 1.5;
      }
    }

    // --- Thruster glow pulse ---
    for (let i = 0; i < 6; i++) {
      const tg = m['thrusterGlow_' + i];
      if (tg && tg.material) {
        tg.material.emissiveIntensity = 1.0 + Math.sin(t * 3 + i * 1) * 0.8;
        tg.scale.setScalar(0.8 + Math.sin(t * 3 + i) * 0.3);
      }
    }
    if (m.mainThrusterGlow && m.mainThrusterGlow.material) {
      m.mainThrusterGlow.material.emissiveIntensity = 1.5 + Math.sin(t * 2.5) * 1.0;
      m.mainThrusterGlow.scale.y = 0.8 + Math.sin(t * 3) * 0.4;
    }

    // --- Material pellets flow through tubes ---
    for (let i = 0; i < 4; i++) {
      for (let p = 0; p < 3; p++) {
        const pel = m['pellet_' + i + '_' + p];
        if (pel) {
          const phase = (t * 0.8 + p * 2 + i * 1.5) % 6;
          const angle = (i / 4) * Math.PI * 2;
          const lerp = phase / 6;
          pel.position.y = -6 - lerp * 5;
          pel.position.x = Math.sin(angle) * (3.5 - lerp * 1.5);
          pel.position.z = Math.cos(angle) * (3.5 - lerp * 1.5);
        }
      }
    }

    // --- Data bar animation ---
    for (let face = 0; face < 4; face++) {
      for (let b = 0; b < 5; b++) {
        const bar = m['dataBar_' + face + '_' + b];
        if (bar) {
          bar.scale.x = 0.3 + (Math.sin(t * 2 + face + b * 0.5) * 0.5 + 0.5) * 0.7;
        }
      }
    }

    // --- Daughter monolith growth cycle ---
    if (m.daughter) {
      const cycle = t * 0.1 % (Math.PI * 2);
      const growPhase = (Math.sin(cycle) * 0.5 + 0.5); // 0 to 1
      const s = 0.01 + growPhase * 0.99;
      m.daughter.scale.set(s, s, s);
      // When "complete", drift upward
      if (growPhase > 0.9) {
        m.daughter.position.y = -4 + (growPhase - 0.9) * 80;
        m.daughter.rotation.y = t * 2;
      } else {
        m.daughter.position.y = -4;
      }
    }

    // --- Lidar pulse ---
    if (m.lidarEmitter && m.lidarEmitter.material) {
      m.lidarEmitter.material.emissiveIntensity = 1 + Math.sin(t * 10) * 2;
    }

    // --- Docking port lights ---
    for (const side of ['L', 'R']) {
      const dl = m['dockLight_' + side];
      if (dl && dl.material) {
        dl.material.emissiveIntensity = 1.5 + Math.sin(t * 1.5) * 1.5;
      }
    }

    // --- Mining sparks ---
    for (let i = 0; i < 40; i++) {
      const sp = m['spark_' + i];
      if (sp) {
        const phase = (t * 2 + i * 0.37) % 2;
        sp.position.y = -10 + (Math.random() - 0.5) * 3;
        sp.position.x = (Math.random() - 0.5) * 4;
        sp.position.z = (Math.random() - 0.5) * 4;
        sp.visible = phase < 0.7;
        sp.scale.setScalar(0.5 + Math.random());
      }
    }

    // --- Thruster plumes ---
    for (let i = 0; i < 20; i++) {
      const pl = m['plume_' + i];
      if (pl) {
        const phase = (t * 3 + i * 0.5) % 2;
        pl.position.y = -7.5 - phase * 1.5;
        pl.scale.setScalar(0.5 + phase * 0.8);
        if (pl.material) pl.material.opacity = Math.max(0, 1 - phase * 0.6);
      }
    }

    // --- Debris float ---
    for (let i = 0; i < 30; i++) {
      const d = m['debris_' + i];
      if (d) {
        d.position.y += Math.sin(t * 0.3 + i) * 0.003;
        d.rotation.x = t * 0.2 + i;
        d.rotation.z = t * 0.15 + i * 0.5;
      }
    }
  }

  // =========================================================================
  // RETURN
  // =========================================================================
  return {
    group,
    parts,
    description: 'A Von Neumann Self-Replicating Monolith — an autonomous deep-space probe that mines asteroids, refines ore, fabricates components, and assembles complete copies of itself. Features articulated mining arms with rotary drill heads, an internal factory visible through observation windows (conveyor, smelter, laser cutters, robotic arms, 3D printer), a growing daughter monolith that detaches and flies away upon completion, a high-gain communication array for swarm coordination, deployable solar collector wings, thruster array for orbital station-keeping, sensor cluster (lidar, spectrometer, star trackers), docking ports, holographic status displays, and extensive particle effects for mining sparks and thruster plumes. Demonstrates concepts from Von Neumann universal constructor theory, Langton\'s loops, quine programs, exponential growth limits, and the Fermi Paradox.',
    quizQuestions,
    animate
  };
}
