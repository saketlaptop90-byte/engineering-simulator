// ============================================================================
// GOD TIER NEUTRONIUM ARMOR FORGE
// A facility forging armor plates from degenerate neutron matter extracted
// from neutron stars. Gravity presses compress matter to nuclear densities
// (10^14 g/cm³), shaped magnetic fields mold plates, and cryo-quench
// systems cool the forged neutronium armor.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ---------------------------------------------------------------------------
  // CUSTOM MATERIALS
  // ---------------------------------------------------------------------------
  const neutroniumGlow = new THREE.MeshStandardMaterial({
    color: 0x4400ff,
    emissive: 0x6600ff,
    emissiveIntensity: 2.8,
    metalness: 1.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.92,
  });

  const degeneracyPlasma = new THREE.MeshStandardMaterial({
    color: 0x00ccff,
    emissive: 0x00aaff,
    emissiveIntensity: 3.5,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
  });

  const nuclearPastaGlow = new THREE.MeshStandardMaterial({
    color: 0xff4400,
    emissive: 0xff2200,
    emissiveIntensity: 2.2,
    metalness: 0.85,
    roughness: 0.15,
    transparent: true,
    opacity: 0.85,
  });

  const cryoCoolant = new THREE.MeshStandardMaterial({
    color: 0x66ffff,
    emissive: 0x00ffee,
    emissiveIntensity: 1.5,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.55,
  });

  const gravitonField = new THREE.MeshStandardMaterial({
    color: 0x9900ff,
    emissive: 0xbb44ff,
    emissiveIntensity: 2.0,
    metalness: 0.6,
    roughness: 0.0,
    transparent: true,
    opacity: 0.35,
  });

  const warningNeon = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 4.0,
    metalness: 0.5,
    roughness: 0.1,
  });

  const armorPlate = new THREE.MeshStandardMaterial({
    color: 0x222233,
    emissive: 0x110022,
    emissiveIntensity: 0.4,
    metalness: 1.0,
    roughness: 0.08,
  });

  const hologramBlue = new THREE.MeshStandardMaterial({
    color: 0x0066ff,
    emissive: 0x0088ff,
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.3,
    metalness: 0.2,
    roughness: 0.0,
  });

  const magnetCoil = new THREE.MeshStandardMaterial({
    color: 0xcc6600,
    emissive: 0xff8800,
    emissiveIntensity: 1.2,
    metalness: 0.95,
    roughness: 0.2,
  });

  // Meshes container
  const meshes = {};

  // ---------------------------------------------------------------------------
  // 1. MAIN FOUNDATION PLATFORM — Massive hexagonal base
  // ---------------------------------------------------------------------------
  const foundationShape = new THREE.Shape();
  const hexRadius = 14;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = hexRadius * Math.cos(angle);
    const z = hexRadius * Math.sin(angle);
    if (i === 0) foundationShape.moveTo(x, z);
    else foundationShape.lineTo(x, z);
  }
  foundationShape.closePath();
  const foundationGeo = new THREE.ExtrudeGeometry(foundationShape, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 4 });
  const foundation = new THREE.Mesh(foundationGeo, darkSteel);
  foundation.rotation.x = -Math.PI / 2;
  foundation.position.y = -0.6;
  group.add(foundation);
  meshes.foundation = foundation;

  // Foundation detail: concentric grooves
  for (let r = 4; r <= 12; r += 4) {
    const grooveGeo = new THREE.TorusGeometry(r, 0.08, 8, 64);
    const groove = new THREE.Mesh(grooveGeo, chrome);
    groove.rotation.x = Math.PI / 2;
    groove.position.y = 0.65;
    group.add(groove);
  }

  // Floor grating panels
  for (let ix = -2; ix <= 2; ix++) {
    for (let iz = -2; iz <= 2; iz++) {
      if (Math.abs(ix) + Math.abs(iz) > 3) continue;
      const grateGeo = new THREE.BoxGeometry(2.4, 0.06, 2.4);
      const grate = new THREE.Mesh(grateGeo, steel);
      grate.position.set(ix * 2.8, 0.68, iz * 2.8);
      group.add(grate);
      // Grating lines
      for (let g = -1; g <= 1; g += 0.4) {
        const lineGeo = new THREE.BoxGeometry(2.3, 0.08, 0.03);
        const line = new THREE.Mesh(lineGeo, darkSteel);
        line.position.set(ix * 2.8, 0.72, iz * 2.8 + g);
        group.add(line);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 2. NEUTRON STAR MATERIAL INTAKE TOWER
  // ---------------------------------------------------------------------------
  const intakeGroup = new THREE.Group();
  intakeGroup.position.set(-9, 0, 0);

  // Main intake column using LatheGeometry
  const intakeProfile = [];
  intakeProfile.push(new THREE.Vector2(0, 0));
  intakeProfile.push(new THREE.Vector2(2.5, 0));
  intakeProfile.push(new THREE.Vector2(2.8, 1));
  intakeProfile.push(new THREE.Vector2(2.2, 3));
  intakeProfile.push(new THREE.Vector2(1.8, 6));
  intakeProfile.push(new THREE.Vector2(2.0, 8));
  intakeProfile.push(new THREE.Vector2(2.5, 10));
  intakeProfile.push(new THREE.Vector2(3.0, 12));
  intakeProfile.push(new THREE.Vector2(2.8, 14));
  intakeProfile.push(new THREE.Vector2(2.0, 16));
  intakeProfile.push(new THREE.Vector2(1.5, 17));
  intakeProfile.push(new THREE.Vector2(1.8, 18));
  intakeProfile.push(new THREE.Vector2(2.2, 19));
  intakeProfile.push(new THREE.Vector2(1.0, 20));
  intakeProfile.push(new THREE.Vector2(0, 20));
  const intakeGeo = new THREE.LatheGeometry(intakeProfile, 32);
  const intakeColumn = new THREE.Mesh(intakeGeo, darkSteel);
  intakeGroup.add(intakeColumn);
  meshes.intakeColumn = intakeColumn;

  // Intake funnel at top
  const funnelProfile = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const r = 1.0 + 3.0 * Math.pow(t, 0.5);
    const y = 20 + t * 4;
    funnelProfile.push(new THREE.Vector2(r, y));
  }
  const funnelGeo = new THREE.LatheGeometry(funnelProfile, 32);
  const funnel = new THREE.Mesh(funnelGeo, steel);
  intakeGroup.add(funnel);

  // Neutron matter stream inside funnel (animated)
  const streamGeo = new THREE.CylinderGeometry(0.6, 0.3, 18, 16);
  const neutronStream = new THREE.Mesh(streamGeo, neutroniumGlow);
  neutronStream.position.y = 10;
  intakeGroup.add(neutronStream);
  meshes.neutronStream = neutronStream;

  // Magnetic containment rings around intake
  meshes.intakeRings = [];
  for (let i = 0; i < 8; i++) {
    const ringGeo = new THREE.TorusGeometry(2.5 + Math.sin(i * 0.5) * 0.3, 0.15, 12, 32);
    const ring = new THREE.Mesh(ringGeo, magnetCoil);
    ring.position.y = 2 + i * 2.2;
    ring.rotation.x = Math.PI / 2;
    intakeGroup.add(ring);
    meshes.intakeRings.push(ring);
  }

  // Intake support struts — heavy I-beams
  for (let a = 0; a < 4; a++) {
    const angle = (Math.PI / 2) * a;
    const strutGeo = new THREE.BoxGeometry(0.3, 18, 0.6);
    const strut = new THREE.Mesh(strutGeo, steel);
    strut.position.set(Math.cos(angle) * 3.2, 9, Math.sin(angle) * 3.2);
    intakeGroup.add(strut);
    // Cross braces
    for (let b = 0; b < 4; b++) {
      const braceGeo = new THREE.BoxGeometry(0.15, 0.15, 3.2);
      const brace = new THREE.Mesh(braceGeo, aluminum);
      brace.position.set(Math.cos(angle) * 1.6, 3 + b * 4, Math.sin(angle) * 1.6);
      brace.rotation.y = angle;
      intakeGroup.add(brace);
    }
  }

  group.add(intakeGroup);

  // ---------------------------------------------------------------------------
  // 3. TRANSFER PIPELINE — Neutron Matter Conduit
  // ---------------------------------------------------------------------------
  const pipelinePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-9, 8, 0),
    new THREE.Vector3(-7, 9, 0),
    new THREE.Vector3(-4, 9.5, 0),
    new THREE.Vector3(-1, 9, 0.5),
    new THREE.Vector3(0, 8, 0),
  ]);
  const pipeGeo = new THREE.TubeGeometry(pipelinePath, 64, 0.6, 16, false);
  const pipeline = new THREE.Mesh(pipeGeo, darkSteel);
  group.add(pipeline);
  meshes.pipeline = pipeline;

  // Inner flow tube (glowing neutron matter)
  const innerFlowGeo = new THREE.TubeGeometry(pipelinePath, 64, 0.35, 12, false);
  const innerFlow = new THREE.Mesh(innerFlowGeo, degeneracyPlasma);
  group.add(innerFlow);
  meshes.innerFlow = innerFlow;

  // Pipeline containment magnets
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const pt = pipelinePath.getPointAt(t);
    const magnetGeo = new THREE.TorusGeometry(0.85, 0.1, 8, 24);
    const magnet = new THREE.Mesh(magnetGeo, magnetCoil);
    magnet.position.copy(pt);
    const tangent = pipelinePath.getTangentAt(t);
    magnet.lookAt(pt.clone().add(tangent));
    group.add(magnet);
  }

  // ---------------------------------------------------------------------------
  // 4. GRAVITY PRESS ARRAY — Three massive presses
  // ---------------------------------------------------------------------------
  meshes.pressPlungers = [];
  meshes.pressGlows = [];
  meshes.pressChambers = [];
  const pressPositions = [
    { x: 0, z: -3 },
    { x: 0, z: 0 },
    { x: 0, z: 3 },
  ];

  pressPositions.forEach((pos, idx) => {
    const pressGroup = new THREE.Group();
    pressGroup.position.set(pos.x, 0, pos.z);

    // Press frame — massive arch structure
    const framePath = new THREE.Shape();
    framePath.moveTo(-2, 0);
    framePath.lineTo(-2, 10);
    framePath.quadraticCurveTo(-2, 13, 0, 13);
    framePath.quadraticCurveTo(2, 13, 2, 10);
    framePath.lineTo(2, 0);
    framePath.lineTo(1.5, 0);
    framePath.lineTo(1.5, 10);
    framePath.quadraticCurveTo(1.5, 12.5, 0, 12.5);
    framePath.quadraticCurveTo(-1.5, 12.5, -1.5, 10);
    framePath.lineTo(-1.5, 0);
    framePath.closePath();
    const frameGeo = new THREE.ExtrudeGeometry(framePath, { depth: 1.2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 });
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.z = -0.6;
    pressGroup.add(frame);

    // Upper plunger (animated — moves down to compress)
    const plungerGeo = new THREE.CylinderGeometry(0.9, 1.1, 4, 24);
    const plunger = new THREE.Mesh(plungerGeo, chrome);
    plunger.position.y = 9;
    pressGroup.add(plunger);
    meshes.pressPlungers.push(plunger);

    // Plunger hydraulic cylinders
    for (let s = 0; s < 2; s++) {
      const side = s === 0 ? -1 : 1;
      const outerCylGeo = new THREE.CylinderGeometry(0.25, 0.25, 5, 12);
      const outerCyl = new THREE.Mesh(outerCylGeo, steel);
      outerCyl.position.set(side * 1.3, 10.5, 0);
      pressGroup.add(outerCyl);

      const innerCylGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 12);
      const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
      innerCyl.position.set(side * 1.3, 8, 0);
      pressGroup.add(innerCyl);
    }

    // Lower anvil
    const anvilGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.5, 24);
    const anvil = new THREE.Mesh(anvilGeo, darkSteel);
    anvil.position.y = 2;
    pressGroup.add(anvil);

    // Compression chamber — transparent observation window
    const chamberGeo = new THREE.CylinderGeometry(1.0, 1.0, 3, 24, 1, true);
    const chamber = new THREE.Mesh(chamberGeo, tinted);
    chamber.position.y = 5;
    pressGroup.add(chamber);
    meshes.pressChambers.push(chamber);

    // Compressed matter glow inside chamber
    const compressGlowGeo = new THREE.SphereGeometry(0.6, 24, 24);
    const compressGlow = new THREE.Mesh(compressGlowGeo, neutroniumGlow);
    compressGlow.position.y = 5;
    pressGroup.add(compressGlow);
    meshes.pressGlows.push(compressGlow);

    // Graviton field visualization rings
    for (let r = 0; r < 5; r++) {
      const gfRingGeo = new THREE.TorusGeometry(1.0 + r * 0.15, 0.03, 8, 32);
      const gfRing = new THREE.Mesh(gfRingGeo, gravitonField);
      gfRing.position.y = 4 + r * 0.5;
      gfRing.rotation.x = Math.PI / 2;
      pressGroup.add(gfRing);
    }

    // Warning lights on press frame
    for (let w = 0; w < 3; w++) {
      const warnGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const warn = new THREE.Mesh(warnGeo, warningNeon);
      warn.position.set(-2.2, 3 + w * 3, 0);
      pressGroup.add(warn);
      const warn2 = warn.clone();
      warn2.position.x = 2.2;
      pressGroup.add(warn2);
    }

    // Pressure gauges
    for (let g = 0; g < 2; g++) {
      const gaugeFaceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24);
      const gaugeFace = new THREE.Mesh(gaugeFaceGeo, glass);
      gaugeFace.position.set(g === 0 ? -2.4 : 2.4, 7, 0.7);
      gaugeFace.rotation.x = Math.PI / 2;
      pressGroup.add(gaugeFace);
      const gaugeBodyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.15, 24);
      const gaugeBody = new THREE.Mesh(gaugeBodyGeo, darkSteel);
      gaugeBody.position.set(g === 0 ? -2.4 : 2.4, 7, 0.62);
      gaugeBody.rotation.x = Math.PI / 2;
      pressGroup.add(gaugeBody);
    }

    // Rivets on frame
    for (let rv = 0; rv < 8; rv++) {
      const rivetGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const rivet = new THREE.Mesh(rivetGeo, chrome);
      rivet.position.set(-2.05, 1 + rv * 1.5, 0.65);
      pressGroup.add(rivet);
      const rivet2 = rivet.clone();
      rivet2.position.x = 2.05;
      pressGroup.add(rivet2);
    }

    group.add(pressGroup);
  });

  // ---------------------------------------------------------------------------
  // 5. ARMOR PLATE MOLDING CHAMBERS — Shaped magnetic field bays
  // ---------------------------------------------------------------------------
  const moldGroup = new THREE.Group();
  moldGroup.position.set(7, 0, 0);

  meshes.moldPlates = [];
  meshes.moldFieldRings = [];
  meshes.moldGlows = [];

  for (let bay = 0; bay < 3; bay++) {
    const bayGroup = new THREE.Group();
    bayGroup.position.set(0, 0, -3 + bay * 3);

    // Molding chamber outer shell (octagonal cross-section via ExtrudeGeometry)
    const octShape = new THREE.Shape();
    const octR = 1.8;
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI / 4) * i - Math.PI / 8;
      const ox = octR * Math.cos(ang);
      const oy = octR * Math.sin(ang);
      if (i === 0) octShape.moveTo(ox, oy);
      else octShape.lineTo(ox, oy);
    }
    octShape.closePath();
    // Cut a circular hole
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 1.3, 0, Math.PI * 2, false);
    octShape.holes.push(holePath);
    const octGeo = new THREE.ExtrudeGeometry(octShape, { depth: 3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 });
    const octShell = new THREE.Mesh(octGeo, steel);
    octShell.rotation.x = -Math.PI / 2;
    octShell.position.y = 4;
    bayGroup.add(octShell);

    // Viewport glass panels
    for (let vp = 0; vp < 4; vp++) {
      const vpAng = (Math.PI / 2) * vp;
      const vpGeo = new THREE.PlaneGeometry(0.8, 2);
      const viewport = new THREE.Mesh(vpGeo, tinted);
      viewport.position.set(Math.cos(vpAng) * 1.85, 4 + 1.5, Math.sin(vpAng) * 1.85);
      viewport.lookAt(new THREE.Vector3(0, 4 + 1.5, 0).add(moldGroup.position).add(bayGroup.position));
      viewport.rotation.y = vpAng + Math.PI;
      bayGroup.add(viewport);
    }

    // Armor plate being formed (animated)
    const plateGeo = new THREE.BoxGeometry(1.6, 0.15, 2.2);
    const plate = new THREE.Mesh(plateGeo, armorPlate);
    plate.position.y = 4 + 1.5;
    bayGroup.add(plate);
    meshes.moldPlates.push(plate);

    // Shaping field rings (animated — rotate around plate)
    const fieldRingsForBay = [];
    for (let fr = 0; fr < 4; fr++) {
      const frGeo = new THREE.TorusGeometry(1.1, 0.05, 8, 32);
      const frMesh = new THREE.Mesh(frGeo, degeneracyPlasma);
      frMesh.position.y = 4 + 0.5 + fr * 0.7;
      bayGroup.add(frMesh);
      fieldRingsForBay.push(frMesh);
    }
    meshes.moldFieldRings.push(fieldRingsForBay);

    // Nuclear pasta glow core
    const pastaGlowGeo = new THREE.SphereGeometry(0.5, 20, 20);
    const pastaGlow = new THREE.Mesh(pastaGlowGeo, nuclearPastaGlow);
    pastaGlow.position.y = 4 + 1.5;
    bayGroup.add(pastaGlow);
    meshes.moldGlows.push(pastaGlow);

    // Support legs
    for (let leg = 0; leg < 4; leg++) {
      const legAng = (Math.PI / 2) * leg + Math.PI / 4;
      const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 4, 8);
      const legMesh = new THREE.Mesh(legGeo, darkSteel);
      legMesh.position.set(Math.cos(legAng) * 1.6, 2, Math.sin(legAng) * 1.6);
      bayGroup.add(legMesh);
    }

    // Electromagnetic coil wraps
    for (let ec = 0; ec < 6; ec++) {
      const ecGeo = new THREE.TorusGeometry(1.5, 0.08, 8, 24);
      const ecMesh = new THREE.Mesh(ecGeo, magnetCoil);
      ecMesh.position.y = 4 + ec * 0.5;
      ecMesh.rotation.x = Math.PI / 2;
      bayGroup.add(ecMesh);
    }

    moldGroup.add(bayGroup);
  }
  group.add(moldGroup);

  // ---------------------------------------------------------------------------
  // 6. CRYO-QUENCH COOLING SYSTEM
  // ---------------------------------------------------------------------------
  const cryoGroup = new THREE.Group();
  cryoGroup.position.set(7, 0, 7);

  // Main coolant reservoir (large tank with LatheGeometry)
  const tankProfile = [];
  tankProfile.push(new THREE.Vector2(0, 0));
  tankProfile.push(new THREE.Vector2(2.5, 0));
  tankProfile.push(new THREE.Vector2(2.8, 0.5));
  tankProfile.push(new THREE.Vector2(3.0, 1.5));
  tankProfile.push(new THREE.Vector2(3.0, 6));
  tankProfile.push(new THREE.Vector2(2.8, 7));
  tankProfile.push(new THREE.Vector2(2.0, 7.5));
  tankProfile.push(new THREE.Vector2(1.5, 8));
  tankProfile.push(new THREE.Vector2(0, 8));
  const tankGeo = new THREE.LatheGeometry(tankProfile, 32);
  const tank = new THREE.Mesh(tankGeo, aluminum);
  cryoGroup.add(tank);
  meshes.cryoTank = tank;

  // Coolant level (transparent inside)
  const coolantGeo = new THREE.CylinderGeometry(2.7, 2.7, 4, 24);
  const coolant = new THREE.Mesh(coolantGeo, cryoCoolant);
  coolant.position.y = 3;
  cryoGroup.add(coolant);
  meshes.coolantLevel = coolant;

  // Cooling pipes radiating outward
  meshes.cryoPipes = [];
  for (let cp = 0; cp < 6; cp++) {
    const cpAngle = (Math.PI / 3) * cp;
    const cpPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(cpAngle) * 3, 4, Math.sin(cpAngle) * 3),
      new THREE.Vector3(Math.cos(cpAngle) * 5, 5, Math.sin(cpAngle) * 5),
      new THREE.Vector3(Math.cos(cpAngle) * 7, 4, Math.sin(cpAngle) * 7),
    ]);
    const cpGeo = new THREE.TubeGeometry(cpPath, 24, 0.2, 8, false);
    const cpMesh = new THREE.Mesh(cpGeo, copper);
    cryoGroup.add(cpMesh);
    meshes.cryoPipes.push(cpMesh);

    // Coolant flow indicator nodes
    for (let fn = 0; fn < 3; fn++) {
      const fPt = cpPath.getPointAt(fn / 2.5);
      const fnGeo = new THREE.SphereGeometry(0.15, 10, 10);
      const fnMesh = new THREE.Mesh(fnGeo, cryoCoolant);
      fnMesh.position.copy(fPt);
      cryoGroup.add(fnMesh);
    }
  }

  // Frost effect rings on tank
  for (let frost = 0; frost < 5; frost++) {
    const frostGeo = new THREE.TorusGeometry(3.05, 0.04, 8, 32);
    const frostMesh = new THREE.Mesh(frostGeo, cryoCoolant);
    frostMesh.position.y = 1 + frost * 1.3;
    frostMesh.rotation.x = Math.PI / 2;
    cryoGroup.add(frostMesh);
  }

  group.add(cryoGroup);

  // ---------------------------------------------------------------------------
  // 7. CONTROL TOWER / OPERATOR CABIN
  // ---------------------------------------------------------------------------
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(-5, 0, 8);

  // Cabin structure
  const cabinBodyGeo = new THREE.BoxGeometry(3, 4, 3);
  const cabinBody = new THREE.Mesh(cabinBodyGeo, darkSteel);
  cabinBody.position.y = 6;
  cabinGroup.add(cabinBody);

  // Cabin stilts
  for (let cs = 0; cs < 4; cs++) {
    const cx = cs < 2 ? -1.2 : 1.2;
    const cz = cs % 2 === 0 ? -1.2 : 1.2;
    const stiltGeo = new THREE.CylinderGeometry(0.15, 0.2, 4, 8);
    const stilt = new THREE.Mesh(stiltGeo, steel);
    stilt.position.set(cx, 2, cz);
    cabinGroup.add(stilt);
  }

  // Tinted windows
  for (let win = 0; win < 3; win++) {
    const winGeo = new THREE.PlaneGeometry(2.4, 1.8);
    const winMesh = new THREE.Mesh(winGeo, tinted);
    if (win === 0) { winMesh.position.set(0, 6.5, 1.52); }
    else if (win === 1) { winMesh.position.set(-1.52, 6.5, 0); winMesh.rotation.y = Math.PI / 2; }
    else { winMesh.position.set(1.52, 6.5, 0); winMesh.rotation.y = -Math.PI / 2; }
    cabinGroup.add(winMesh);
  }

  // Control console
  const consoleGeo = new THREE.BoxGeometry(2, 0.6, 0.5);
  const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
  consoleMesh.position.set(0, 5, 1);
  consoleMesh.rotation.x = -0.3;
  cabinGroup.add(consoleMesh);

  // Holographic screens on console
  meshes.holoScreens = [];
  for (let hs = 0; hs < 3; hs++) {
    const screenGeo = new THREE.PlaneGeometry(0.5, 0.4);
    const screen = new THREE.Mesh(screenGeo, hologramBlue);
    screen.position.set(-0.6 + hs * 0.6, 5.5, 1.15);
    cabinGroup.add(screen);
    meshes.holoScreens.push(screen);
  }

  // Operator chair
  const seatGeo = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const seat = new THREE.Mesh(seatGeo, rubber);
  seat.position.set(0, 4.7, 0);
  cabinGroup.add(seat);
  const backrestGeo = new THREE.BoxGeometry(0.6, 0.8, 0.1);
  const backrest = new THREE.Mesh(backrestGeo, rubber);
  backrest.position.set(0, 5.1, -0.3);
  cabinGroup.add(backrest);

  // Joysticks
  for (let js = 0; js < 2; js++) {
    const jx = js === 0 ? -0.8 : 0.8;
    const stickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const stick = new THREE.Mesh(stickGeo, darkSteel);
    stick.position.set(jx, 5.2, 0.8);
    cabinGroup.add(stick);
    const knobGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const knob = new THREE.Mesh(knobGeo, rubber);
    knob.position.set(jx, 5.42, 0.8);
    cabinGroup.add(knob);
  }

  // Ladder to cabin
  for (let ld = 0; ld < 6; ld++) {
    const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    const rung = new THREE.Mesh(rungGeo, aluminum);
    rung.position.set(1.8, 1 + ld * 0.7, 1.2);
    rung.rotation.z = Math.PI / 2;
    cabinGroup.add(rung);
  }
  for (let lr = 0; lr < 2; lr++) {
    const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.5, 8);
    const rail = new THREE.Mesh(railGeo, aluminum);
    rail.position.set(1.8, 2.5, lr === 0 ? 0.8 : 1.6);
    cabinGroup.add(rail);
  }

  // Antenna array
  const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
  const antenna = new THREE.Mesh(antennaGeo, chrome);
  antenna.position.set(0, 9.5, 0);
  cabinGroup.add(antenna);
  const dishGeo = new THREE.SphereGeometry(0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dish = new THREE.Mesh(dishGeo, aluminum);
  dish.position.set(0, 11, 0);
  dish.rotation.x = Math.PI;
  cabinGroup.add(dish);

  group.add(cabinGroup);

  // ---------------------------------------------------------------------------
  // 8. GRAVITON GENERATOR CORE
  // ---------------------------------------------------------------------------
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, -8);

  // Main generator sphere
  const coreSphereGeo = new THREE.SphereGeometry(2.5, 48, 48);
  const coreSphere = new THREE.Mesh(coreSphereGeo, neutroniumGlow);
  coreSphere.position.y = 5;
  coreGroup.add(coreSphere);
  meshes.gravitonCore = coreSphere;

  // Containment wireframe shell
  const wireShellGeo = new THREE.IcosahedronGeometry(3.2, 1);
  const wireShell = new THREE.Mesh(wireShellGeo, new THREE.MeshStandardMaterial({
    color: 0x4444ff,
    emissive: 0x2222aa,
    emissiveIntensity: 1.0,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }));
  wireShell.position.y = 5;
  coreGroup.add(wireShell);
  meshes.wireShell = wireShell;

  // Orbit rings — animated
  meshes.orbitRings = [];
  for (let orb = 0; orb < 3; orb++) {
    const orbGeo = new THREE.TorusGeometry(3.5 + orb * 0.4, 0.06, 8, 64);
    const orbMesh = new THREE.Mesh(orbGeo, gravitonField);
    orbMesh.position.y = 5;
    orbMesh.rotation.x = (Math.PI / 3) * orb;
    orbMesh.rotation.z = (Math.PI / 4) * orb;
    coreGroup.add(orbMesh);
    meshes.orbitRings.push(orbMesh);
  }

  // Support pylons
  for (let py = 0; py < 6; py++) {
    const pyAng = (Math.PI / 3) * py;
    const pylonGeo = new THREE.CylinderGeometry(0.2, 0.3, 5, 8);
    const pylon = new THREE.Mesh(pylonGeo, darkSteel);
    pylon.position.set(Math.cos(pyAng) * 3.8, 2.5, Math.sin(pyAng) * 3.8);
    coreGroup.add(pylon);
  }

  // Energy conduits from core to presses
  const conduitPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 5, -8),
    new THREE.Vector3(0, 7, -5),
    new THREE.Vector3(0, 8, -2),
    new THREE.Vector3(0, 7, 0),
  ]);
  const conduitGeo = new THREE.TubeGeometry(conduitPath, 48, 0.3, 12, false);
  const conduit = new THREE.Mesh(conduitGeo, gravitonField);
  group.add(conduit);
  meshes.energyConduit = conduit;

  // Inner conduit glow
  const conduitInnerGeo = new THREE.TubeGeometry(conduitPath, 48, 0.15, 8, false);
  const conduitInner = new THREE.Mesh(conduitInnerGeo, neutroniumGlow);
  group.add(conduitInner);

  group.add(coreGroup);

  // ---------------------------------------------------------------------------
  // 9. EXHAUST / RADIATION VENTING STACKS
  // ---------------------------------------------------------------------------
  meshes.exhaustGlows = [];
  for (let es = 0; es < 4; es++) {
    const esAng = (Math.PI / 2) * es + Math.PI / 4;
    const stackGroup = new THREE.Group();
    stackGroup.position.set(Math.cos(esAng) * 11, 0, Math.sin(esAng) * 11);

    const stackProfile = [];
    stackProfile.push(new THREE.Vector2(0, 0));
    stackProfile.push(new THREE.Vector2(0.8, 0));
    stackProfile.push(new THREE.Vector2(0.9, 1));
    stackProfile.push(new THREE.Vector2(0.7, 4));
    stackProfile.push(new THREE.Vector2(0.6, 8));
    stackProfile.push(new THREE.Vector2(0.7, 10));
    stackProfile.push(new THREE.Vector2(0.9, 11));
    stackProfile.push(new THREE.Vector2(1.1, 12));
    stackProfile.push(new THREE.Vector2(0.5, 13));
    stackProfile.push(new THREE.Vector2(0, 13));
    const stackGeo = new THREE.LatheGeometry(stackProfile, 16);
    const stack = new THREE.Mesh(stackGeo, darkSteel);
    stackGroup.add(stack);

    // Exhaust glow at top
    const exGlowGeo = new THREE.SphereGeometry(0.6, 12, 12);
    const exGlow = new THREE.Mesh(exGlowGeo, nuclearPastaGlow);
    exGlow.position.y = 13;
    stackGroup.add(exGlow);
    meshes.exhaustGlows.push(exGlow);

    // Stack bands
    for (let sb = 0; sb < 5; sb++) {
      const bandGeo = new THREE.TorusGeometry(0.75 + Math.sin(sb) * 0.1, 0.05, 8, 24);
      const band = new THREE.Mesh(bandGeo, chrome);
      band.position.y = 1 + sb * 2.5;
      band.rotation.x = Math.PI / 2;
      stackGroup.add(band);
    }

    group.add(stackGroup);
  }

  // ---------------------------------------------------------------------------
  // 10. FINISHED ARMOR PLATE CONVEYOR / OUTPUT RACK
  // ---------------------------------------------------------------------------
  const conveyorGroup = new THREE.Group();
  conveyorGroup.position.set(13, 0, 0);

  // Conveyor frame
  const convFrameGeo = new THREE.BoxGeometry(0.3, 1.5, 12);
  const convFrameL = new THREE.Mesh(convFrameGeo, steel);
  convFrameL.position.set(-1.5, 1.5, 0);
  conveyorGroup.add(convFrameL);
  const convFrameR = convFrameL.clone();
  convFrameR.position.x = 1.5;
  conveyorGroup.add(convFrameR);

  // Conveyor rollers
  meshes.conveyorRollers = [];
  for (let cr = 0; cr < 12; cr++) {
    const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 12);
    const roller = new THREE.Mesh(rollerGeo, chrome);
    roller.position.set(0, 1.9, -5.5 + cr);
    roller.rotation.z = Math.PI / 2;
    conveyorGroup.add(roller);
    meshes.conveyorRollers.push(roller);
  }

  // Finished plates on conveyor
  meshes.finishedPlates = [];
  for (let fp = 0; fp < 4; fp++) {
    const fpGeo = new THREE.BoxGeometry(2, 0.12, 1.5);
    const fpMesh = new THREE.Mesh(fpGeo, armorPlate);
    fpMesh.position.set(0, 2.15, -4 + fp * 2.5);
    conveyorGroup.add(fpMesh);
    meshes.finishedPlates.push(fpMesh);
  }

  // Conveyor drive motor
  const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
  const motor = new THREE.Mesh(motorGeo, darkSteel);
  motor.position.set(2.2, 1.5, -5.5);
  motor.rotation.z = Math.PI / 2;
  conveyorGroup.add(motor);

  // Drive shaft
  const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 8);
  const shaft = new THREE.Mesh(shaftGeo, chrome);
  shaft.position.set(0, 1.5, -5.5);
  shaft.rotation.z = Math.PI / 2;
  conveyorGroup.add(shaft);

  group.add(conveyorGroup);

  // ---------------------------------------------------------------------------
  // 11. CATWALK / MAINTENANCE PLATFORMS
  // ---------------------------------------------------------------------------
  for (let cw = 0; cw < 3; cw++) {
    const cwY = 3 + cw * 4;
    const cwAngle = (Math.PI * 2 / 3) * cw;
    const cwGeo = new THREE.BoxGeometry(8, 0.1, 1.5);
    const cwMesh = new THREE.Mesh(cwGeo, aluminum);
    cwMesh.position.set(Math.cos(cwAngle) * 5, cwY, Math.sin(cwAngle) * 5);
    cwMesh.rotation.y = cwAngle;
    group.add(cwMesh);

    // Railings
    for (let rl = 0; rl < 2; rl++) {
      const railSide = rl === 0 ? 0.7 : -0.7;
      const railGeo = new THREE.BoxGeometry(8, 0.05, 0.05);
      const rail = new THREE.Mesh(railGeo, steel);
      rail.position.set(
        Math.cos(cwAngle) * 5,
        cwY + 0.8,
        Math.sin(cwAngle) * 5 + railSide * Math.cos(cwAngle + Math.PI / 2)
      );
      rail.rotation.y = cwAngle;
      group.add(rail);

      // Railing posts
      for (let rp = -3; rp <= 3; rp += 1.5) {
        const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6);
        const post = new THREE.Mesh(postGeo, steel);
        const px = Math.cos(cwAngle) * 5 + rp * Math.cos(cwAngle);
        const pz = Math.sin(cwAngle) * 5 + rp * Math.sin(cwAngle) + railSide * Math.cos(cwAngle + Math.PI / 2);
        post.position.set(px, cwY + 0.4, pz);
        group.add(post);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 12. PARTICLE / SMOKE EMITTER NODES (visual proxy — animated spheres)
  // ---------------------------------------------------------------------------
  meshes.particles = [];
  for (let p = 0; p < 30; p++) {
    const pGeo = new THREE.SphereGeometry(0.05 + Math.random() * 0.08, 6, 6);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaff,
      emissive: 0x6666ff,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.6,
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.userData = {
      baseX: (Math.random() - 0.5) * 8,
      baseY: 14 + Math.random() * 8,
      baseZ: (Math.random() - 0.5) * 8,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    };
    pMesh.position.set(pMesh.userData.baseX, pMesh.userData.baseY, pMesh.userData.baseZ);
    group.add(pMesh);
    meshes.particles.push(pMesh);
  }

  // ---------------------------------------------------------------------------
  // 13. STATUS DISPLAY PANELS
  // ---------------------------------------------------------------------------
  for (let sd = 0; sd < 4; sd++) {
    const sdAng = (Math.PI / 2) * sd;
    const panelGeo = new THREE.BoxGeometry(2, 1.2, 0.08);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(Math.cos(sdAng) * 8, 3, Math.sin(sdAng) * 8);
    panel.rotation.y = sdAng;
    group.add(panel);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(1.8, 1);
    const screenMesh = new THREE.Mesh(screenGeo, hologramBlue);
    screenMesh.position.set(
      Math.cos(sdAng) * 8 + Math.sin(sdAng) * 0.05,
      3,
      Math.sin(sdAng) * 8 - Math.cos(sdAng) * 0.05
    );
    screenMesh.rotation.y = sdAng;
    group.add(screenMesh);
  }

  // ---------------------------------------------------------------------------
  // 14. PERIMETER DEFENSE / RADIATION SHIELDING WALLS
  // ---------------------------------------------------------------------------
  for (let wall = 0; wall < 12; wall++) {
    const wAng = (Math.PI / 6) * wall;
    const wallGeo = new THREE.BoxGeometry(4, 6, 0.5);
    const wallMesh = new THREE.Mesh(wallGeo, steel);
    wallMesh.position.set(Math.cos(wAng) * 15, 3, Math.sin(wAng) * 15);
    wallMesh.rotation.y = wAng;
    group.add(wallMesh);

    // Warning stripe
    const stripeGeo = new THREE.BoxGeometry(3.8, 0.3, 0.06);
    const stripe = new THREE.Mesh(stripeGeo, warningNeon);
    stripe.position.set(
      Math.cos(wAng) * 15 + Math.sin(wAng) * 0.28,
      5.5,
      Math.sin(wAng) * 15 - Math.cos(wAng) * 0.28
    );
    stripe.rotation.y = wAng;
    group.add(stripe);
  }

  // ---------------------------------------------------------------------------
  // PARTS DEFINITION
  // ---------------------------------------------------------------------------
  const parts = [
    {
      name: 'Neutron Star Material Intake Tower',
      description: 'A 20-meter magnetically-shielded tower with a hyperbolic funnel that captures raw neutron-degenerate matter beamed from orbital extraction rigs. Superconducting containment coils maintain a field gradient of 10⁹ T/m to prevent the matter from expanding explosively.',
      material: 'Neutron-stabilized tungsten-rhenium superalloy with quark-gluon plasma cladding',
      function: 'Receives, contains, and channels degenerate neutron matter into the forge pipeline without loss of nuclear density',
      assemblyOrder: 1,
      connections: ['Transfer Pipeline', 'Graviton Generator Core'],
      failureEffect: 'Unconstrained neutron matter expansion — localized neutron bomb equivalent detonation',
      cascadeFailures: ['Transfer Pipeline', 'Gravity Press Array'],
      originalPosition: { x: -9, y: 0, z: 0 },
      explodedPosition: { x: -22, y: 5, z: 0 },
    },
    {
      name: 'Transfer Pipeline',
      description: 'A 9-meter magnetically-bottled conduit transporting neutron-degenerate matter from the intake to the press array. Inner bore is lined with strange-quark-stabilized metamaterial to prevent tunneling losses.',
      material: 'Strange-quark metamaterial liner within chromium-vanadium pressure housing',
      function: 'Transports degenerate matter at nuclear density without allowing quantum tunneling leakage',
      assemblyOrder: 2,
      connections: ['Neutron Star Material Intake Tower', 'Gravity Press Array'],
      failureEffect: 'Matter density drop below critical threshold — neutron matter reverts to iron-peak nuclei plasma',
      cascadeFailures: ['Gravity Press Array'],
      originalPosition: { x: -4, y: 9, z: 0 },
      explodedPosition: { x: -4, y: 18, z: 0 },
    },
    {
      name: 'Gravity Press Array',
      description: 'Three synchronised graviton-amplified presses generating localised gravitational fields exceeding 10¹² g. Each press compresses neutron matter from transport density to forging density (>10¹⁴ g/cm³), inducing nuclear pasta phase transitions.',
      material: 'Graviton-reinforced neutronium anvils, chromodynamic field emitter arrays',
      function: 'Compresses neutron matter to armor-grade nuclear density through artificial gravitational collapse',
      assemblyOrder: 3,
      connections: ['Transfer Pipeline', 'Graviton Generator Core', 'Armor Plate Molding Chambers'],
      failureEffect: 'Uncontrolled gravitational singularity formation — micro black hole hazard',
      cascadeFailures: ['Armor Plate Molding Chambers', 'Graviton Generator Core'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 12, z: 0 },
    },
    {
      name: 'Graviton Generator Core',
      description: 'A 2.5-meter diameter synthetic graviton source using spin-2 boson amplification. Generates the extreme gravitational fields required by the press array and the shaped-field molding system.',
      material: 'Exotic matter shell with negative energy density vacuum core',
      function: 'Produces coherent graviton beams for gravity presses and magnetic field shaping',
      assemblyOrder: 4,
      connections: ['Gravity Press Array', 'Armor Plate Molding Chambers'],
      failureEffect: 'Graviton cascade — uncontrolled warping of local spacetime metric',
      cascadeFailures: ['Gravity Press Array', 'Armor Plate Molding Chambers', 'Perimeter Shielding'],
      originalPosition: { x: 0, y: 5, z: -8 },
      explodedPosition: { x: 0, y: 20, z: -18 },
    },
    {
      name: 'Armor Plate Molding Chambers',
      description: 'Three octagonal shaping bays where compressed neutron matter is formed into armor plate geometry using shaped gravitational and electromagnetic fields. Nuclear pasta transitions (gnocchi→spaghetti→lasagna) are controlled to optimise plate crystallography.',
      material: 'Magnetar-grade superconducting coils, holographic field emitters',
      function: 'Shapes compressed neutron matter into precise armor plate geometries with controlled nuclear pasta microstructure',
      assemblyOrder: 5,
      connections: ['Gravity Press Array', 'Cryo-Quench Cooling System'],
      failureEffect: 'Plate geometry failure — stress concentration from disordered nuclear pasta causes brittle fracture',
      cascadeFailures: ['Output Conveyor'],
      originalPosition: { x: 7, y: 0, z: 0 },
      explodedPosition: { x: 18, y: 5, z: 0 },
    },
    {
      name: 'Cryo-Quench Cooling System',
      description: 'A superfluid helium-3 cooling complex that rapidly quenches forged neutronium plates from 10⁹ K to structural stability temperature. Six radiative cooling loops dissipate excess thermal energy into dedicated heat sinks.',
      material: 'Superfluid ³He reservoir with phonon-coupled heat exchangers',
      function: 'Rapidly cools forged neutronium armor plates to lock nuclear pasta microstructure',
      assemblyOrder: 6,
      connections: ['Armor Plate Molding Chambers', 'Output Conveyor'],
      failureEffect: 'Thermal shock — nuclear pasta phase reversion to quark-gluon plasma',
      cascadeFailures: ['Armor Plate Molding Chambers', 'Output Conveyor'],
      originalPosition: { x: 7, y: 0, z: 7 },
      explodedPosition: { x: 18, y: 0, z: 18 },
    },
    {
      name: 'Control Tower',
      description: 'Elevated command station with holographic quantum computing interfaces for real-time monitoring of gravitational field strengths, nuclear density profiles, neutron degeneracy pressure readings, and plate quality metrics.',
      material: 'Radiation-hardened transparent aluminum windows, EMI-shielded electronics',
      function: 'Provides operator oversight and control of all forge subsystems',
      assemblyOrder: 7,
      connections: ['All subsystems via quantum-entangled data links'],
      failureEffect: 'Loss of automated safety interlocks — manual emergency protocols required',
      cascadeFailures: ['All systems (indirect)'],
      originalPosition: { x: -5, y: 0, z: 8 },
      explodedPosition: { x: -14, y: 8, z: 18 },
    },
    {
      name: 'Radiation Venting Stacks',
      description: 'Four neutron radiation exhaust stacks that vent residual nuclear decay products and gamma radiation away from the forge. Each stack contains multi-layered borated polyethylene and lead shielding.',
      material: 'Borated polyethylene/lead composite with active neutron absorber lining',
      function: 'Safely vents residual radiation from nuclear compression and cooling processes',
      assemblyOrder: 8,
      connections: ['Gravity Press Array', 'Armor Plate Molding Chambers'],
      failureEffect: 'Radiation accumulation — lethal neutron flux exposure in forge perimeter',
      cascadeFailures: ['Control Tower', 'Perimeter Shielding'],
      originalPosition: { x: 11, y: 0, z: 11 },
      explodedPosition: { x: 22, y: 8, z: 22 },
    },
    {
      name: 'Output Conveyor',
      description: 'A magnetically-levitated conveyor system that transports finished neutronium armor plates to the storage rack. Plates are handled without physical contact to prevent density perturbation.',
      material: 'Magnetic levitation rails with superconducting bearings',
      function: 'Transports finished plates from cooling to storage without contact-induced defects',
      assemblyOrder: 9,
      connections: ['Cryo-Quench Cooling System'],
      failureEffect: 'Plate handling damage — neutronium stress fractures from contact loading',
      cascadeFailures: [],
      originalPosition: { x: 13, y: 0, z: 0 },
      explodedPosition: { x: 26, y: 0, z: 0 },
    },
    {
      name: 'Perimeter Radiation Shielding',
      description: '12-segment modular shielding wall surrounding the entire forge complex. Each segment is 6m tall and contains graded-Z shielding with depleted uranium, lead, and borated concrete layers.',
      material: 'Graded-Z composite: depleted uranium / lead / borated concrete',
      function: 'Contains all ionising radiation within the forge perimeter to regulatory limits',
      assemblyOrder: 10,
      connections: ['All systems'],
      failureEffect: 'Radiation leakage exceeding safe exposure limits in surrounding areas',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 3, z: 15 },
      explodedPosition: { x: 0, y: 3, z: 28 },
    },
    {
      name: 'Magnetic Containment Coils (Intake)',
      description: 'Eight superconducting toroidal coils generating a 10⁹ T/m field gradient along the intake column. Prevent neutron matter from expanding beyond its degenerate state during transfer.',
      material: 'YBCO high-temperature superconductor with liquid nitrogen cooling',
      function: 'Maintains magnetic confinement of neutron-degenerate matter during intake',
      assemblyOrder: 11,
      connections: ['Neutron Star Material Intake Tower'],
      failureEffect: 'Magnetic quench — loss of confinement causes neutron matter expansion',
      cascadeFailures: ['Neutron Star Material Intake Tower', 'Transfer Pipeline'],
      originalPosition: { x: -9, y: 10, z: 0 },
      explodedPosition: { x: -22, y: 16, z: 0 },
    },
    {
      name: 'Nuclear Pasta Phase Controller',
      description: 'A quantum chromodynamic field modulator embedded in each molding chamber that precisely controls the phase of nuclear pasta (gnocchi, spaghetti, lasagna, anti-spaghetti, Swiss cheese) in the forming plate to achieve optimal anisotropic strength.',
      material: 'QCD field emitter arrays with color-charge sensors',
      function: 'Controls nuclear pasta microstructure for directional strength optimisation',
      assemblyOrder: 12,
      connections: ['Armor Plate Molding Chambers', 'Graviton Generator Core'],
      failureEffect: 'Disordered nuclear pasta — isotropic rather than directional strength, 60% performance reduction',
      cascadeFailures: ['Armor Plate Molding Chambers'],
      originalPosition: { x: 7, y: 5, z: 0 },
      explodedPosition: { x: 18, y: 14, z: 0 },
    },
    {
      name: 'Holographic Control Interfaces',
      description: 'Three quantum-holographic display screens providing real-time visualization of graviton field topology, neutron density maps, nuclear pasta phase diagrams, and plate stress analysis.',
      material: 'Photonic crystal display with quantum dot emitters',
      function: 'Provides operator with real-time process data visualization and control input',
      assemblyOrder: 13,
      connections: ['Control Tower'],
      failureEffect: 'Operator blind — no real-time process feedback, must rely on automated systems',
      cascadeFailures: [],
      originalPosition: { x: -5, y: 5.5, z: 9 },
      explodedPosition: { x: -14, y: 12, z: 20 },
    },
    {
      name: 'Catwalk Maintenance Platforms',
      description: 'Three elevated maintenance walkways providing physical access to mid-height subsystems for inspection and repair during shutdown periods.',
      material: 'Diamond-coated aluminium grating with radiation-hardened safety rails',
      function: 'Provides maintenance access to elevated subsystems',
      assemblyOrder: 14,
      connections: ['Control Tower', 'Gravity Press Array'],
      failureEffect: 'Restricted maintenance access — increased downtime for repairs',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 7, z: 5 },
      explodedPosition: { x: 0, y: 18, z: 12 },
    },
    {
      name: 'Neutron Degeneracy Pressure Monitor',
      description: 'A network of quantum pressure transducers embedded throughout the forge that continuously measures neutron degeneracy pressure (Pauli exclusion force between neutrons) to ensure compression remains within the stability window between drip line and collapse.',
      material: 'Quantum tunnelling junction pressure sensors',
      function: 'Monitors neutron degeneracy pressure to prevent under- or over-compression',
      assemblyOrder: 15,
      connections: ['Gravity Press Array', 'Graviton Generator Core', 'Control Tower'],
      failureEffect: 'Undetected density excursion — risk of neutron drip (too low) or strange quark matter transition (too high)',
      cascadeFailures: ['Gravity Press Array', 'Graviton Generator Core'],
      originalPosition: { x: 0, y: 7, z: -4 },
      explodedPosition: { x: 0, y: 18, z: -12 },
    },
  ];

  // ---------------------------------------------------------------------------
  // QUIZ QUESTIONS — PhD Nuclear Physics Level
  // ---------------------------------------------------------------------------
  const quizQuestions = [
    {
      question: 'Neutron degeneracy pressure arises from the Pauli exclusion principle applied to neutrons. In the non-relativistic limit, the degeneracy pressure P of a free neutron gas scales with number density n as P ∝ n^(5/3). What modification to this exponent occurs when the neutron Fermi momentum approaches mc, and what is the ultra-relativistic limiting exponent?',
      options: [
        'The exponent decreases to 4/3 as relativistic effects soften the equation of state',
        'The exponent increases to 2 due to rest-mass energy contributions',
        'The exponent remains 5/3 because relativity does not affect degeneracy pressure',
        'The exponent jumps to 7/3 due to pair production at high densities',
      ],
      correct: 0,
      explanation: 'In the ultra-relativistic limit (p_F >> m_n c), the degeneracy pressure scales as P ∝ n^(4/3) rather than n^(5/3). This softer equation of state is critical: it means the pressure increases more slowly with compression, which is why there exists a maximum mass (the Tolman–Oppenheimer–Volkoff limit, analogous to the Chandrasekhar limit for electron degeneracy) beyond which neutron degeneracy pressure cannot prevent gravitational collapse to a black hole.',
    },
    {
      question: 'Nuclear pasta phases occur in the inner crust of neutron stars at densities near 10¹⁴ g/cm³. The sequence of pasta phases (gnocchi → spaghetti → lasagna → anti-spaghetti → Swiss cheese) is driven by competition between which two fundamental forces, and what dimensionless parameter governs the phase transitions?',
      options: [
        'The strong nuclear force (short-range attraction) and Coulomb repulsion (long-range); governed by the proton fraction x_p which determines the charge density and Coulomb energy contribution',
        'Gravity and the weak nuclear force; governed by the gravitational compactness parameter M/R',
        'The strong and weak nuclear forces; governed by the Weinberg angle θ_W',
        'Electromagnetic and gravitational forces; governed by the fine-structure constant α',
      ],
      correct: 0,
      explanation: 'Nuclear pasta arises from the frustrated competition between the short-range attractive strong nuclear force (which favors compact nuclear clusters) and the long-range Coulomb repulsion between protons (which favors uniform distribution). The proton fraction x_p is the key parameter: as density increases and x_p changes due to beta equilibrium, the optimal geometry changes from spheres (gnocchi) to rods (spaghetti) to slabs (lasagna), then to inverted topologies (tubes = anti-spaghetti, bubbles = Swiss cheese) before transitioning to uniform nuclear matter.',
    },
    {
      question: 'The equation of state (EOS) of dense nuclear matter above saturation density (n₀ ≈ 0.16 fm⁻³) remains one of the greatest unsolved problems in nuclear physics. The recent detection of gravitational waves from neutron star merger GW170817 constrained the tidal deformability parameter Λ. How does Λ relate to the EOS, and what did GW170817 rule out?',
      options: [
        'Λ measures a star\'s quadrupolar deformation response to a tidal field, Λ ∝ (R/M)⁵ × k₂; GW170817 ruled out very stiff EOS models that predicted large radii (R > 13.5 km for 1.4 M☉) by setting Λ(1.4) ≲ 800',
        'Λ measures the gravitational wave frequency; GW170817 ruled out all quark star models',
        'Λ is the cosmological constant; GW170817 measured dark energy in neutron stars',
        'Λ measures spin-orbit coupling; GW170817 proved neutron stars do not rotate',
      ],
      correct: 0,
      explanation: 'The dimensionless tidal deformability Λ = (2/3) k₂ (c²R/GM)⁵ quantifies how easily a neutron star deforms under an external tidal gravitational field, where k₂ is the Love number. Stiffer EOS models predict larger radii R and hence larger Λ. The gravitational wave signal from GW170817 constrained Λ(1.4 M☉) ≲ 800 at 90% confidence, ruling out extremely stiff nuclear EOS and supporting moderately soft models consistent with radii of ~11–13 km for canonical neutron stars.',
    },
    {
      question: 'At densities exceeding ~2n₀, several exotic phases of matter may appear in neutron star cores. One hypothesis is the hadron-quark phase transition, where nucleons dissolve into deconfined quark matter. The Bodmer-Witten hypothesis proposes that strange quark matter (u, d, s quarks) may be the true ground state of matter. If this hypothesis is correct, what are the implications for neutronium armor forging, and why might adding strangeness actually increase the bulk modulus?',
      options: [
        'Strange quark matter fills a larger Fermi sea (3 flavors vs 2), lowering the Fermi energy per baryon; the additional Pauli exclusion channels increase incompressibility, potentially yielding a bulk modulus exceeding 10³⁴ Pa',
        'Strangeness makes matter lighter, reducing armor mass but providing no strength benefit',
        'Strange quarks decay too quickly to be useful; the hypothesis is irrelevant to engineering',
        'Adding strangeness converts all matter to kaon condensate, which is a superfluid and cannot form solid armor',
      ],
      correct: 0,
      explanation: 'If the Bodmer-Witten hypothesis is correct, matter composed of roughly equal numbers of u, d, and s quarks has lower energy per baryon than normal nuclear matter (iron-56). The three-flavor system has a larger available phase space: each quark flavor fills its own Fermi sea, distributing the baryon number across more quantum states. This lowers the average Fermi momentum (and thus the kinetic energy per baryon) compared to two-flavor quark matter. However, the incompressibility (bulk modulus) can actually increase because any attempted compression must push fermions in ALL three Fermi seas to higher states simultaneously, requiring enormous energy input — a direct consequence of the Pauli exclusion principle operating across multiple channels.',
    },
    {
      question: 'The neutron drip line defines the nuclear density below which free neutrons begin to leak out of nuclei. In the context of this Neutronium Armor Forge, maintaining matter above the drip density is critical. What is the approximate neutron drip density in the inner crust, what physical mechanism defines it, and how does the BCS pairing gap Δ of the dripped neutron superfluid affect the forge\'s cooling requirements?',
      options: [
        'Neutron drip occurs at ~4×10¹¹ g/cm³ when the neutron chemical potential μ_n exceeds zero (neutron separation energy vanishes); the ¹S₀ BCS gap Δ ≈ 1–3 MeV means the superfluid has a specific heat that drops exponentially below T_c ≈ 10⁹ K, dramatically reducing cooling power needed once plates are below T_c',
        'Neutron drip occurs at ~10⁶ g/cm³; BCS pairing is irrelevant as neutrons are classical particles',
        'Neutron drip occurs at ~10¹⁵ g/cm³; the BCS gap requires immense cooling power',
        'Neutron drip is a misnomer — neutrons cannot escape nuclei under any conditions',
      ],
      correct: 0,
      explanation: 'Neutron drip occurs at approximately 4×10¹¹ g/cm³ (about 2.6×10⁻⁴ fm⁻³), the density at which nuclei become so neutron-rich that the neutron chemical potential μ_n reaches zero — meaning it costs zero energy to remove a neutron from a nucleus. Above this density, free neutrons coexist with neutron-rich nuclei. These free neutrons form a superfluid via BCS pairing in the ¹S₀ channel with a gap Δ ≈ 1–3 MeV (T_c ≈ 10⁹–10¹⁰ K). Below the critical temperature, the superfluid specific heat drops as exp(-Δ/k_BT), meaning far less cooling power is needed to maintain temperature — a critical engineering advantage for the forge\'s cryo-quench system.',
    },
  ];

  // ---------------------------------------------------------------------------
  // ANIMATION FUNCTION
  // ---------------------------------------------------------------------------
  function animate(time, speed, m) {
    const t = time * speed;
    const refs = m || meshes;

    // Neutron stream pulsation
    if (refs.neutronStream) {
      const pulseScale = 1.0 + 0.3 * Math.sin(t * 3);
      refs.neutronStream.scale.set(pulseScale, 1, pulseScale);
      refs.neutronStream.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(t * 5);
    }

    // Intake containment rings rotation
    if (refs.intakeRings) {
      refs.intakeRings.forEach((ring, i) => {
        ring.rotation.z = t * (0.5 + i * 0.1);
        ring.rotation.x = Math.PI / 2 + Math.sin(t + i) * 0.1;
      });
    }

    // Inner flow pulsation
    if (refs.innerFlow) {
      refs.innerFlow.material.opacity = 0.5 + 0.3 * Math.sin(t * 4);
      refs.innerFlow.material.emissiveIntensity = 2.5 + 1.5 * Math.sin(t * 6);
    }

    // Gravity press plungers — synchronized compression cycle
    if (refs.pressPlungers) {
      refs.pressPlungers.forEach((plunger, i) => {
        const phase = t * 1.5 + (i * Math.PI * 2 / 3);
        const stroke = Math.sin(phase) * 0.5 + 0.5; // 0 to 1
        plunger.position.y = 9 - stroke * 3; // compress downward
      });
    }

    // Press glow — intensifies during compression
    if (refs.pressGlows) {
      refs.pressGlows.forEach((glow, i) => {
        const phase = t * 1.5 + (i * Math.PI * 2 / 3);
        const compression = Math.sin(phase) * 0.5 + 0.5;
        const scale = 0.4 + compression * 0.8;
        glow.scale.set(scale, scale, scale);
        glow.material.emissiveIntensity = 1.5 + compression * 4;
      });
    }

    // Mold field rings — rotating around plates
    if (refs.moldFieldRings) {
      refs.moldFieldRings.forEach((bayRings, bi) => {
        bayRings.forEach((ring, ri) => {
          ring.rotation.x = t * (1 + ri * 0.3) + bi;
          ring.rotation.z = t * (0.5 + ri * 0.2);
        });
      });
    }

    // Mold plates — subtle vibration during shaping
    if (refs.moldPlates) {
      refs.moldPlates.forEach((plate, i) => {
        plate.rotation.z = Math.sin(t * 8 + i * 2) * 0.02;
        plate.position.y = 4 + 1.5 + Math.sin(t * 6 + i) * 0.05;
      });
    }

    // Mold glows — nuclear pasta phase color cycling
    if (refs.moldGlows) {
      refs.moldGlows.forEach((glow, i) => {
        const cycle = (t * 0.5 + i * 0.8) % (Math.PI * 2);
        glow.material.emissiveIntensity = 1.5 + Math.sin(cycle) * 1.5;
        const r = 0.8 + 0.2 * Math.sin(cycle);
        const g = 0.2 + 0.3 * Math.sin(cycle + Math.PI / 3);
        const b = 0.1 + 0.15 * Math.sin(cycle + Math.PI * 2 / 3);
        glow.material.emissive.setRGB(r, g, b);
      });
    }

    // Graviton core — rotation and pulse
    if (refs.gravitonCore) {
      refs.gravitonCore.rotation.y = t * 0.3;
      refs.gravitonCore.rotation.x = Math.sin(t * 0.2) * 0.15;
      refs.gravitonCore.material.emissiveIntensity = 2.0 + Math.sin(t * 2) * 1.5;
    }

    // Wireframe shell — counter-rotation
    if (refs.wireShell) {
      refs.wireShell.rotation.y = -t * 0.5;
      refs.wireShell.rotation.z = t * 0.3;
    }

    // Orbit rings — multi-axis rotation
    if (refs.orbitRings) {
      refs.orbitRings.forEach((ring, i) => {
        ring.rotation.x = (Math.PI / 3) * i + t * (0.8 + i * 0.3);
        ring.rotation.z = (Math.PI / 4) * i + t * (0.4 + i * 0.2);
        ring.material.opacity = 0.2 + 0.2 * Math.sin(t * 2 + i);
      });
    }

    // Exhaust glows — flickering
    if (refs.exhaustGlows) {
      refs.exhaustGlows.forEach((glow, i) => {
        glow.material.emissiveIntensity = 1.5 + Math.sin(t * 10 + i * 1.7) * 1.0 + Math.sin(t * 17 + i * 3.1) * 0.5;
        const scl = 0.8 + 0.3 * Math.sin(t * 5 + i * 2);
        glow.scale.set(scl, scl * 1.5, scl);
      });
    }

    // Coolant level gentle oscillation
    if (refs.coolantLevel) {
      refs.coolantLevel.position.y = 3 + Math.sin(t * 0.5) * 0.15;
      refs.coolantLevel.material.opacity = 0.45 + 0.15 * Math.sin(t * 1.5);
    }

    // Conveyor rollers spinning
    if (refs.conveyorRollers) {
      refs.conveyorRollers.forEach((roller) => {
        roller.rotation.x += speed * 0.05;
      });
    }

    // Finished plates sliding (slow conveyance)
    if (refs.finishedPlates) {
      refs.finishedPlates.forEach((plate, i) => {
        const slidePhase = (t * 0.2 + i * 0.5) % 4;
        plate.position.z = -4 + i * 2.5 + Math.sin(slidePhase) * 0.3;
      });
    }

    // Holographic screens — flickering
    if (refs.holoScreens) {
      refs.holoScreens.forEach((screen, i) => {
        screen.material.opacity = 0.2 + 0.2 * Math.sin(t * 3 + i * 1.5);
        screen.material.emissiveIntensity = 1.5 + Math.sin(t * 5 + i * 2) * 1.5;
      });
    }

    // Particle / smoke emitters — floating and drifting
    if (refs.particles) {
      refs.particles.forEach((p) => {
        const ud = p.userData;
        p.position.x = ud.baseX + Math.sin(t * ud.speed + ud.phase) * 1.5;
        p.position.y = ud.baseY + Math.sin(t * ud.speed * 0.7 + ud.phase) * 2;
        p.position.z = ud.baseZ + Math.cos(t * ud.speed * 0.5 + ud.phase) * 1.5;
        p.material.opacity = 0.3 + 0.4 * Math.sin(t * ud.speed * 2 + ud.phase);
      });
    }

    // Energy conduit — flowing pulse
    if (refs.energyConduit) {
      refs.energyConduit.material.opacity = 0.25 + 0.15 * Math.sin(t * 3);
    }

    // Cryo tank gentle frost shimmer
    if (refs.cryoTank) {
      refs.cryoTank.material.emissive = new THREE.Color(0x004466);
      refs.cryoTank.material.emissiveIntensity = 0.2 + 0.1 * Math.sin(t * 2);
    }
  }

  // ---------------------------------------------------------------------------
  // DESCRIPTION
  // ---------------------------------------------------------------------------
  const description = `The Neutronium Armor Forge is a god-tier facility for forging armor plates from degenerate neutron matter extracted from neutron stars. Raw neutron-degenerate matter is captured by the 20m Intake Tower's hyperbolic funnel and magnetically confined by superconducting coils generating field gradients of 10⁹ T/m. The matter is transported through a strange-quark-stabilized Transfer Pipeline to three Gravity Presses that generate localised gravitational fields exceeding 10¹² g, compressing matter to forging density (>10¹⁴ g/cm³). The compressed matter passes into three octagonal Molding Chambers where shaped gravitational and electromagnetic fields form armor plate geometry while controlling nuclear pasta phase transitions (gnocchi→spaghetti→lasagna→anti-spaghetti→Swiss cheese) for optimal directional strength. Forged plates are rapidly quenched by the Cryo-Quench System using superfluid ³He to lock the nuclear pasta microstructure, then transported via magnetic-levitation conveyor to output storage. The entire complex is powered by a 2.5m diameter Graviton Generator Core using spin-2 boson amplification, monitored from an elevated Control Tower with quantum-holographic displays, and enclosed within 12-segment graded-Z radiation shielding walls. Four radiation venting stacks safely exhaust residual nuclear decay products.`;

  return { group, parts, description, quizQuestions, animate };
}
