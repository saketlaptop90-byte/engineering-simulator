// ============================================================================
// GOD-TIER ENTROPY REVERSAL ENGINE
// Maxwell's Demon Thermodynamic Sorting Machine
// Ultra-Realistic THREE.js Model — 800+ lines
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();

  // ── Helper Materials ──────────────────────────────────────────────────
  const neonCyan = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.4,
    metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.92
  });
  const neonMagenta = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.2,
    metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.88
  });
  const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 1.3,
    metalness: 0.2, roughness: 0.25, transparent: true, opacity: 0.9
  });
  const hotMat = new THREE.MeshStandardMaterial({
    color: 0xff3300, emissive: 0xff2200, emissiveIntensity: 0.9,
    metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.7
  });
  const coldMat = new THREE.MeshStandardMaterial({
    color: 0x0066ff, emissive: 0x0044cc, emissiveIntensity: 0.8,
    metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.7
  });
  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 1.6,
    metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.85
  });
  const quantumGlow = new THREE.MeshStandardMaterial({
    color: 0x8800ff, emissive: 0x6600cc, emissiveIntensity: 1.5,
    metalness: 0.2, roughness: 0.15, transparent: true, opacity: 0.8
  });
  const displayGreen = new THREE.MeshStandardMaterial({
    color: 0x00ff66, emissive: 0x00ff44, emissiveIntensity: 2.0,
    metalness: 0.0, roughness: 0.5, transparent: true, opacity: 0.95
  });
  const darkGlass = new THREE.MeshStandardMaterial({
    color: 0x111122, metalness: 0.9, roughness: 0.05,
    transparent: true, opacity: 0.35
  });
  const whiteEmit = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6,
    metalness: 0.0, roughness: 1.0
  });

  // ── Meshes Reference ──────────────────────────────────────────────────
  const meshes = {};

  // =====================================================================
  // 1. MAIN BASE PLATFORM — Hexagonal Plinth
  // =====================================================================
  const baseShape = new THREE.Shape();
  const hexR = 5.5;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const x = Math.cos(a) * hexR, z = Math.sin(a) * hexR;
    i === 0 ? baseShape.moveTo(x, z) : baseShape.lineTo(x, z);
  }
  baseShape.closePath();
  const baseGeo = new THREE.ExtrudeGeometry(baseShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4 });
  const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
  baseMesh.rotation.x = -Math.PI / 2;
  baseMesh.position.y = -0.25;
  group.add(baseMesh);

  // Base glow ring
  const baseRingGeo = new THREE.TorusGeometry(hexR - 0.3, 0.06, 8, 64);
  const baseRing = new THREE.Mesh(baseRingGeo, neonCyan);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.05;
  group.add(baseRing);
  meshes.baseRing = baseRing;

  // Base edge rivets
  for (let i = 0; i < 36; i++) {
    const ang = (Math.PI * 2 / 36) * i;
    const rivet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8),
      chrome
    );
    rivet.position.set(Math.cos(ang) * (hexR - 0.15), 0.06, Math.sin(ang) * (hexR - 0.15));
    group.add(rivet);
  }

  // =====================================================================
  // 2. CENTRAL SORTING CHAMBER — Lathe-profiled Cylindrical Vessel
  // =====================================================================
  const chamberProfile = [];
  chamberProfile.push(new THREE.Vector2(0, 0));
  chamberProfile.push(new THREE.Vector2(2.0, 0));
  chamberProfile.push(new THREE.Vector2(2.2, 0.3));
  chamberProfile.push(new THREE.Vector2(2.3, 0.8));
  chamberProfile.push(new THREE.Vector2(2.25, 1.5));
  chamberProfile.push(new THREE.Vector2(2.4, 2.2));
  chamberProfile.push(new THREE.Vector2(2.5, 3.0));
  chamberProfile.push(new THREE.Vector2(2.45, 3.8));
  chamberProfile.push(new THREE.Vector2(2.3, 4.3));
  chamberProfile.push(new THREE.Vector2(2.1, 4.7));
  chamberProfile.push(new THREE.Vector2(1.8, 5.0));
  chamberProfile.push(new THREE.Vector2(1.4, 5.2));
  chamberProfile.push(new THREE.Vector2(0.8, 5.3));
  chamberProfile.push(new THREE.Vector2(0, 5.35));
  const chamberGeo = new THREE.LatheGeometry(chamberProfile, 64);
  const chamberMesh = new THREE.Mesh(chamberGeo, darkGlass);
  chamberMesh.position.y = 0.25;
  group.add(chamberMesh);
  meshes.chamber = chamberMesh;

  // Chamber inner wall (slightly smaller, opaque steel)
  const innerProfile = chamberProfile.map(v => new THREE.Vector2(v.x * 0.92, v.y));
  const innerGeo = new THREE.LatheGeometry(innerProfile, 64);
  const innerMesh = new THREE.Mesh(innerGeo, steel);
  innerMesh.position.y = 0.25;
  innerMesh.material = steel.clone();
  innerMesh.material.side = THREE.BackSide;
  group.add(innerMesh);

  // Chamber reinforcement ribs (12 vertical ribs)
  for (let i = 0; i < 12; i++) {
    const ang = (Math.PI * 2 / 12) * i;
    const ribGeo = new THREE.BoxGeometry(0.08, 5.0, 0.2);
    const rib = new THREE.Mesh(ribGeo, aluminum);
    rib.position.set(Math.cos(ang) * 2.35, 2.75, Math.sin(ang) * 2.35);
    rib.rotation.y = -ang;
    group.add(rib);
  }

  // Horizontal ring bands (5 bands)
  for (let h = 0; h < 5; h++) {
    const yPos = 0.8 + h * 1.1;
    const radius = 2.35 + Math.sin(h * 0.5) * 0.1;
    const ringBand = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.04, 8, 64),
      chrome
    );
    ringBand.rotation.x = Math.PI / 2;
    ringBand.position.y = yPos;
    group.add(ringBand);
  }

  // =====================================================================
  // 3. MOLECULAR GATE MECHANISM — Central Divider with Flipping Gate
  // =====================================================================
  // Divider wall
  const dividerGeo = new THREE.BoxGeometry(4.4, 4.8, 0.06);
  const divider = new THREE.Mesh(dividerGeo, aluminum);
  divider.position.y = 2.9;
  group.add(divider);

  // Gate aperture frame
  const gateFrameShape = new THREE.Shape();
  gateFrameShape.moveTo(-0.6, -0.6);
  gateFrameShape.lineTo(0.6, -0.6);
  gateFrameShape.lineTo(0.6, 0.6);
  gateFrameShape.lineTo(-0.6, 0.6);
  gateFrameShape.closePath();
  const gateHole = new THREE.Path();
  gateHole.moveTo(-0.45, -0.45);
  gateHole.lineTo(0.45, -0.45);
  gateHole.lineTo(0.45, 0.45);
  gateHole.lineTo(-0.45, 0.45);
  gateHole.closePath();
  gateFrameShape.holes.push(gateHole);
  const gateFrameGeo = new THREE.ExtrudeGeometry(gateFrameShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
  const gateFrame = new THREE.Mesh(gateFrameGeo, copper);
  gateFrame.position.set(0, 2.9, -0.07);
  group.add(gateFrame);

  // The actual flipping gate (Maxwell's Demon trapdoor)
  const gatePivot = new THREE.Group();
  gatePivot.position.set(0, 2.9, 0);
  const gateGeo = new THREE.BoxGeometry(0.85, 0.85, 0.04);
  const gateDoor = new THREE.Mesh(gateGeo, neonGreen);
  gateDoor.position.z = 0;
  gatePivot.add(gateDoor);
  group.add(gatePivot);
  meshes.gatePivot = gatePivot;
  meshes.gateDoor = gateDoor;

  // Gate hinge cylinders
  for (let side = -1; side <= 1; side += 2) {
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.95, 12),
      chrome
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(side * 0.45, 2.9, 0);
    group.add(hinge);
  }

  // Gate micro-actuators (4 small pistons around gate)
  const gateActuators = [];
  for (let i = 0; i < 4; i++) {
    const ang = (Math.PI / 2) * i + Math.PI / 4;
    const actOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), darkSteel
    );
    const actInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), neonCyan
    );
    actOuter.position.set(Math.cos(ang) * 0.7, 2.9, Math.sin(ang) * 0.2);
    actInner.position.set(Math.cos(ang) * 0.7, 2.9, Math.sin(ang) * 0.2);
    group.add(actOuter);
    group.add(actInner);
    gateActuators.push(actInner);
  }
  meshes.gateActuators = gateActuators;

  // =====================================================================
  // 4. HOT RESERVOIR (Right Side) — Red Glowing Vessel
  // =====================================================================
  const hotReservoirGroup = new THREE.Group();
  hotReservoirGroup.position.set(3.8, 2.0, 0);

  // Main body — lathe
  const hotProfile = [];
  hotProfile.push(new THREE.Vector2(0, 0));
  hotProfile.push(new THREE.Vector2(1.2, 0));
  hotProfile.push(new THREE.Vector2(1.35, 0.4));
  hotProfile.push(new THREE.Vector2(1.4, 1.0));
  hotProfile.push(new THREE.Vector2(1.38, 1.8));
  hotProfile.push(new THREE.Vector2(1.3, 2.4));
  hotProfile.push(new THREE.Vector2(1.1, 2.8));
  hotProfile.push(new THREE.Vector2(0.7, 3.1));
  hotProfile.push(new THREE.Vector2(0, 3.2));
  const hotBody = new THREE.Mesh(new THREE.LatheGeometry(hotProfile, 48), hotMat);
  hotReservoirGroup.add(hotBody);
  meshes.hotReservoir = hotBody;

  // Hot coils wrapping around
  for (let c = 0; c < 8; c++) {
    const coilGeo = new THREE.TorusGeometry(1.42 + Math.sin(c) * 0.05, 0.035, 8, 32);
    const coil = new THREE.Mesh(coilGeo, plasmaMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = 0.3 + c * 0.35;
    hotReservoirGroup.add(coil);
  }

  // Temperature indicator tubes (3 vertical)
  for (let t = 0; t < 3; t++) {
    const ang = (Math.PI * 2 / 3) * t;
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), glass
    );
    const mercury = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), hotMat
    );
    tube.position.set(Math.cos(ang) * 1.55, 1.6, Math.sin(ang) * 1.55);
    mercury.position.set(Math.cos(ang) * 1.55, 1.2, Math.sin(ang) * 1.55);
    hotReservoirGroup.add(tube);
    hotReservoirGroup.add(mercury);
  }

  group.add(hotReservoirGroup);

  // =====================================================================
  // 5. COLD RESERVOIR (Left Side) — Blue Glowing Vessel
  // =====================================================================
  const coldReservoirGroup = new THREE.Group();
  coldReservoirGroup.position.set(-3.8, 2.0, 0);

  const coldProfile = [];
  coldProfile.push(new THREE.Vector2(0, 0));
  coldProfile.push(new THREE.Vector2(1.2, 0));
  coldProfile.push(new THREE.Vector2(1.35, 0.4));
  coldProfile.push(new THREE.Vector2(1.4, 1.0));
  coldProfile.push(new THREE.Vector2(1.38, 1.8));
  coldProfile.push(new THREE.Vector2(1.3, 2.4));
  coldProfile.push(new THREE.Vector2(1.1, 2.8));
  coldProfile.push(new THREE.Vector2(0.7, 3.1));
  coldProfile.push(new THREE.Vector2(0, 3.2));
  const coldBody = new THREE.Mesh(new THREE.LatheGeometry(coldProfile, 48), coldMat);
  coldReservoirGroup.add(coldBody);
  meshes.coldReservoir = coldBody;

  // Frost coils
  for (let c = 0; c < 8; c++) {
    const coilGeo = new THREE.TorusGeometry(1.42 + Math.sin(c) * 0.05, 0.035, 8, 32);
    const coil = new THREE.Mesh(coilGeo, neonCyan);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = 0.3 + c * 0.35;
    coldReservoirGroup.add(coil);
  }

  // Cryo-indicator tubes
  for (let t = 0; t < 3; t++) {
    const ang = (Math.PI * 2 / 3) * t;
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), glass
    );
    const cryo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8), coldMat
    );
    tube.position.set(Math.cos(ang) * 1.55, 1.6, Math.sin(ang) * 1.55);
    cryo.position.set(Math.cos(ang) * 1.55, 0.7, Math.sin(ang) * 1.55);
    coldReservoirGroup.add(tube);
    coldReservoirGroup.add(cryo);
  }

  group.add(coldReservoirGroup);

  // =====================================================================
  // 6. TRANSFER CONDUITS — Hot-to-Chamber and Cold-to-Chamber Pipes
  // =====================================================================
  // Right conduit (hot)
  const hotConduitPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.5, 2.5, 0),
    new THREE.Vector3(3.0, 2.8, 0.3),
    new THREE.Vector3(3.5, 2.5, 0.1),
    new THREE.Vector3(3.8, 2.2, 0)
  ]);
  const hotConduit = new THREE.Mesh(
    new THREE.TubeGeometry(hotConduitPath, 32, 0.15, 12, false),
    copper
  );
  group.add(hotConduit);

  // Left conduit (cold)
  const coldConduitPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 2.5, 0),
    new THREE.Vector3(-3.0, 2.8, 0.3),
    new THREE.Vector3(-3.5, 2.5, 0.1),
    new THREE.Vector3(-3.8, 2.2, 0)
  ]);
  const coldConduit = new THREE.Mesh(
    new THREE.TubeGeometry(coldConduitPath, 32, 0.15, 12, false),
    aluminum
  );
  group.add(coldConduit);

  // Additional upper bypass conduits
  const bypassRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.3, 4.0, 0.5),
    new THREE.Vector3(2.8, 4.5, 0.8),
    new THREE.Vector3(3.4, 4.2, 0.4),
    new THREE.Vector3(3.8, 3.5, 0)
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(bypassRight, 24, 0.08, 8, false), chrome));

  const bypassLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.3, 4.0, 0.5),
    new THREE.Vector3(-2.8, 4.5, 0.8),
    new THREE.Vector3(-3.4, 4.2, 0.4),
    new THREE.Vector3(-3.8, 3.5, 0)
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(bypassLeft, 24, 0.08, 8, false), chrome));

  // Conduit valve assemblies (2 per side)
  for (let side = -1; side <= 1; side += 2) {
    for (let v = 0; v < 2; v++) {
      const valveGroup = new THREE.Group();
      const valveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16), darkSteel);
      const valveHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 16), chrome);
      valveHandle.rotation.x = Math.PI / 2;
      valveHandle.position.y = 0.22;
      valveGroup.add(valveBody);
      valveGroup.add(valveHandle);
      valveGroup.position.set(side * (2.8 + v * 0.5), 2.6, 0.15);
      group.add(valveGroup);
    }
  }

  // =====================================================================
  // 7. INFORMATION PROCESSING UNIT (IPU) — Landauer Erasure Module
  // =====================================================================
  const ipuGroup = new THREE.Group();
  ipuGroup.position.set(0, 6.0, 0);

  // IPU main housing (faceted polyhedron style)
  const ipuGeo = new THREE.IcosahedronGeometry(1.0, 1);
  const ipuMesh = new THREE.Mesh(ipuGeo, quantumGlow);
  ipuGroup.add(ipuMesh);
  meshes.ipu = ipuMesh;

  // IPU wireframe overlay
  const ipuWire = new THREE.Mesh(ipuGeo.clone(), new THREE.MeshBasicMaterial({
    color: 0xaa66ff, wireframe: true, transparent: true, opacity: 0.6
  }));
  ipuWire.scale.set(1.02, 1.02, 1.02);
  ipuGroup.add(ipuWire);
  meshes.ipuWire = ipuWire;

  // IPU data conduit to chamber
  const ipuConduitPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 5.6, 0),
    new THREE.Vector3(0.2, 5.8, 0.2),
    new THREE.Vector3(0, 6.0, 0)
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(ipuConduitPath, 16, 0.06, 8, false), neonMagenta));

  // Floating data rings around IPU
  const dataRings = [];
  for (let r = 0; r < 3; r++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.3 + r * 0.25, 0.02, 8, 48),
      neonGreen
    );
    ring.rotation.x = Math.PI / 2 + r * 0.3;
    ring.rotation.z = r * 0.5;
    ipuGroup.add(ring);
    dataRings.push(ring);
  }
  meshes.dataRings = dataRings;

  // Landauer erasure micro-processors (8 around IPU)
  const landauerNodes = [];
  for (let n = 0; n < 8; n++) {
    const ang = (Math.PI * 2 / 8) * n;
    const node = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      neonMagenta
    );
    node.position.set(Math.cos(ang) * 1.5, Math.sin(ang) * 0.4, Math.sin(ang) * 1.5);
    ipuGroup.add(node);
    landauerNodes.push(node);
  }
  meshes.landauerNodes = landauerNodes;

  group.add(ipuGroup);

  // IPU support struts (3 angled pillars)
  for (let s = 0; s < 3; s++) {
    const ang = (Math.PI * 2 / 3) * s;
    const strutPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * 2.0, 0.5, Math.sin(ang) * 2.0),
      new THREE.Vector3(Math.cos(ang) * 1.2, 3.5, Math.sin(ang) * 1.2),
      new THREE.Vector3(Math.cos(ang) * 0.5, 5.8, Math.sin(ang) * 0.5)
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(strutPath, 24, 0.07, 8, false), darkSteel));
  }

  // =====================================================================
  // 8. ENTROPY COUNTER DISPLAY PANEL
  // =====================================================================
  const displayGroup = new THREE.Group();
  displayGroup.position.set(0, 4.0, 2.6);
  displayGroup.rotation.x = -0.15;

  // Display frame
  const displayFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.2, 0.15), darkSteel
  );
  displayGroup.add(displayFrame);

  // Screen surface
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.0),
    new THREE.MeshStandardMaterial({
      color: 0x001100, emissive: 0x002200, emissiveIntensity: 0.5,
      metalness: 0.0, roughness: 1.0
    })
  );
  screenMesh.position.z = 0.08;
  displayGroup.add(screenMesh);

  // Entropy readout bars (animated fill indicators)
  const entropyBars = [];
  for (let b = 0; b < 12; b++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.7, 0.02),
      displayGreen
    );
    bar.position.set(-1.0 + b * 0.18, -0.05, 0.1);
    displayGroup.add(bar);
    entropyBars.push(bar);
  }
  meshes.entropyBars = entropyBars;

  // Status LEDs
  for (let l = 0; l < 6; l++) {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      l < 3 ? neonGreen : neonCyan
    );
    led.position.set(-0.9 + l * 0.36, 0.45, 0.1);
    displayGroup.add(led);
  }

  // Display mount brackets
  for (let side = -1; side <= 1; side += 2) {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.3, 0.5),
      aluminum
    );
    bracket.position.set(side * 1.25, 0, -0.15);
    displayGroup.add(bracket);
  }

  group.add(displayGroup);
  meshes.displayGroup = displayGroup;

  // =====================================================================
  // 9. PARTICLE SYSTEM — Fast & Slow Molecules
  // =====================================================================
  const particles = [];
  const particleCount = 80;
  const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);

  for (let p = 0; p < particleCount; p++) {
    const isFast = p < particleCount / 2;
    const mat = isFast ? hotMat.clone() : coldMat.clone();
    const particle = new THREE.Mesh(particleGeo, mat);

    // Distribute within sorting chamber
    const ang = Math.random() * Math.PI * 2;
    const rad = Math.random() * 1.8;
    const yPos = 0.8 + Math.random() * 4.0;
    particle.position.set(Math.cos(ang) * rad, yPos, Math.sin(ang) * rad);

    particle.userData = {
      speed: isFast ? 0.5 + Math.random() * 1.5 : 0.1 + Math.random() * 0.3,
      isFast: isFast,
      angle: ang,
      radius: rad,
      baseY: yPos,
      phase: Math.random() * Math.PI * 2,
      sorted: false
    };

    group.add(particle);
    particles.push(particle);
  }
  meshes.particles = particles;

  // =====================================================================
  // 10. DEMON OBSERVATION TOWER — Sensor Array
  // =====================================================================
  const demonTower = new THREE.Group();
  demonTower.position.set(0, 5.5, -2.0);

  // Tower body
  const towerProfile = [];
  towerProfile.push(new THREE.Vector2(0, 0));
  towerProfile.push(new THREE.Vector2(0.4, 0));
  towerProfile.push(new THREE.Vector2(0.5, 0.5));
  towerProfile.push(new THREE.Vector2(0.45, 1.5));
  towerProfile.push(new THREE.Vector2(0.35, 2.5));
  towerProfile.push(new THREE.Vector2(0.55, 2.8));
  towerProfile.push(new THREE.Vector2(0.6, 3.0));
  towerProfile.push(new THREE.Vector2(0.5, 3.3));
  towerProfile.push(new THREE.Vector2(0, 3.5));
  const towerBody = new THREE.Mesh(new THREE.LatheGeometry(towerProfile, 32), darkSteel);
  demonTower.add(towerBody);

  // Sensor eye (the "demon")
  const eyeOuter = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), chrome);
  eyeOuter.position.y = 2.8;
  demonTower.add(eyeOuter);
  const eyeInner = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), neonMagenta);
  eyeInner.position.y = 2.8;
  eyeInner.position.z = 0.2;
  demonTower.add(eyeInner);
  meshes.demonEye = eyeInner;

  // Antenna array on top
  for (let a = 0; a < 5; a++) {
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.6 + a * 0.15, 6),
      chrome
    );
    antenna.position.set((a - 2) * 0.12, 3.3 + (a % 2) * 0.1, 0);
    demonTower.add(antenna);
    // Antenna tip
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), neonGreen);
    tip.position.set((a - 2) * 0.12, 3.6 + (a % 2) * 0.1 + a * 0.15, 0);
    demonTower.add(tip);
  }

  group.add(demonTower);

  // =====================================================================
  // 11. HEAT EXCHANGE RADIATOR FINS — Behind Hot Reservoir
  // =====================================================================
  const radiatorGroup = new THREE.Group();
  radiatorGroup.position.set(5.0, 1.5, -1.0);

  for (let f = 0; f < 14; f++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.8, 0.8),
      aluminum
    );
    fin.position.x = f * 0.12;
    radiatorGroup.add(fin);
  }
  // Radiator frame
  const rFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.85), darkSteel);
  rFrame.position.set(0.78, 0.95, 0);
  radiatorGroup.add(rFrame);
  const rFrame2 = rFrame.clone();
  rFrame2.position.y = -0.95;
  radiatorGroup.add(rFrame2);

  group.add(radiatorGroup);

  // =====================================================================
  // 12. CRYO-COOLER ASSEMBLY — Behind Cold Reservoir
  // =====================================================================
  const cryoGroup = new THREE.Group();
  cryoGroup.position.set(-5.0, 1.5, -1.0);

  // Compressor body
  const compressor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1.4, 24), darkSteel
  );
  cryoGroup.add(compressor);

  // Compressor coils
  for (let c = 0; c < 10; c++) {
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.025, 8, 24), copper
    );
    coil.rotation.x = Math.PI / 2;
    coil.position.y = -0.6 + c * 0.13;
    cryoGroup.add(coil);
  }

  // Expansion valve
  const valve = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), chrome);
  valve.position.y = 0.9;
  cryoGroup.add(valve);

  group.add(cryoGroup);

  // =====================================================================
  // 13. QUANTUM MEASUREMENT APPARATUS — Interferometer Arms
  // =====================================================================
  const interferometerGroup = new THREE.Group();
  interferometerGroup.position.set(0, 2.0, -2.5);

  // Beam splitter cube
  const bsCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), darkGlass);
  interferometerGroup.add(bsCube);

  // Arms (4 directions)
  const armDirs = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1]
  ];
  for (const dir of armDirs) {
    const armPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(dir[0] * 1.5, dir[1] * 1.5, dir[2] * 1.5)
    ]);
    const arm = new THREE.Mesh(
      new THREE.TubeGeometry(armPath, 8, 0.03, 6, false), chrome
    );
    interferometerGroup.add(arm);

    // Mirror at end
    const mirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.03, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 1.0, roughness: 0.0
      })
    );
    mirror.position.set(dir[0] * 1.5, dir[1] * 1.5, dir[2] * 1.5);
    interferometerGroup.add(mirror);
  }

  group.add(interferometerGroup);

  // =====================================================================
  // 14. SZILARD ENGINE PISTON MODULE — Side Module
  // =====================================================================
  const szilardGroup = new THREE.Group();
  szilardGroup.position.set(2.0, 0.5, 3.0);

  // Cylinder
  const szCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2.0, 24, 1, true), glass
  );
  szilardGroup.add(szCylinder);

  // End caps
  const szCap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 24), darkSteel);
  szCap1.position.y = 1.0;
  szilardGroup.add(szCap1);
  const szCap2 = szCap1.clone();
  szCap2.position.y = -1.0;
  szilardGroup.add(szCap2);

  // Piston
  const szPiston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24), aluminum
  );
  szPiston.position.y = 0;
  szilardGroup.add(szPiston);
  meshes.szPiston = szPiston;

  // Piston rod
  const szRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 8), chrome
  );
  szRod.position.y = 0.75;
  szilardGroup.add(szRod);
  meshes.szRod = szRod;

  // Single molecule representation
  const singleMolecule = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16), plasmaMat
  );
  singleMolecule.position.y = -0.3;
  szilardGroup.add(singleMolecule);
  meshes.singleMolecule = singleMolecule;

  // Flywheel connected to piston
  const flywheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.08, 12, 32), darkSteel
  );
  flywheel.position.set(0, 1.5, 0);
  flywheel.rotation.x = Math.PI / 2;
  szilardGroup.add(flywheel);
  meshes.flywheel = flywheel;

  // Flywheel spokes
  for (let sp = 0; sp < 6; sp++) {
    const ang = (Math.PI / 3) * sp;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.1, 6), chrome
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = ang;
    spoke.position.set(0, 1.5, 0);
    szilardGroup.add(spoke);
  }

  group.add(szilardGroup);

  // =====================================================================
  // 15. EXHAUST / WASTE HEAT STACKS
  // =====================================================================
  for (let st = 0; st < 2; st++) {
    const stackGroup = new THREE.Group();
    stackGroup.position.set(st === 0 ? 4.5 : -4.5, 4.0, -1.5);

    // Stack pipe
    const stackPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 2.0, 16), darkSteel
    );
    stackGroup.add(stackPipe);

    // Stack cap
    const stackCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.22, 0.15, 16), chrome
    );
    stackCap.position.y = 1.05;
    stackGroup.add(stackCap);

    // Heat shimmer rings
    for (let r = 0; r < 3; r++) {
      const shimmer = new THREE.Mesh(
        new THREE.TorusGeometry(0.3 + r * 0.15, 0.01, 6, 24),
        st === 0 ? hotMat : coldMat
      );
      shimmer.rotation.x = Math.PI / 2;
      shimmer.position.y = 1.2 + r * 0.3;
      stackGroup.add(shimmer);
    }

    group.add(stackGroup);
  }

  // =====================================================================
  // 16. CONTROL PANEL — Operator Interface
  // =====================================================================
  const controlPanel = new THREE.Group();
  controlPanel.position.set(0, 1.5, 4.0);
  controlPanel.rotation.x = -0.5;

  // Panel body
  const panelBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 1.5, 0.12), darkSteel
  );
  controlPanel.add(panelBody);

  // Buttons array (4x3)
  for (let bx = 0; bx < 4; bx++) {
    for (let by = 0; by < 3; by++) {
      const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12),
        [neonCyan, neonGreen, neonMagenta, plasmaMat][bx]
      );
      btn.rotation.x = Math.PI / 2;
      btn.position.set(-0.8 + bx * 0.4, -0.3 + by * 0.3, 0.08);
      controlPanel.add(btn);
    }
  }

  // Toggle switches (6)
  for (let sw = 0; sw < 6; sw++) {
    const switchBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.15, 0.05), aluminum
    );
    const switchToggle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), chrome
    );
    switchToggle.rotation.x = Math.PI / 4;
    switchToggle.position.y = 0.06;
    switchBase.position.set(0.5 + sw * 0.18, 0.3, 0.08);
    switchToggle.position.x = 0.5 + sw * 0.18;
    switchToggle.position.z = 0.08;
    switchToggle.position.y += 0.3;
    controlPanel.add(switchBase);
    controlPanel.add(switchToggle);
  }

  // Mini display screen
  const miniScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x000022, emissive: 0x000044, emissiveIntensity: 0.8
    })
  );
  miniScreen.position.set(-0.6, 0.2, 0.08);
  controlPanel.add(miniScreen);

  // Joystick
  const joystickBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16), darkSteel
  );
  joystickBase.position.set(1.2, -0.2, 0.1);
  joystickBase.rotation.x = Math.PI / 2;
  controlPanel.add(joystickBase);
  const joystickStick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), chrome
  );
  joystickStick.position.set(1.2, -0.2, 0.28);
  controlPanel.add(joystickStick);
  const joystickKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8), rubber
  );
  joystickKnob.position.set(1.2, -0.2, 0.45);
  controlPanel.add(joystickKnob);

  group.add(controlPanel);

  // =====================================================================
  // 17. HYDRAULIC SUPPORT LEGS (4 adjustable legs)
  // =====================================================================
  for (let leg = 0; leg < 4; leg++) {
    const legAng = (Math.PI / 2) * leg + Math.PI / 4;
    const legX = Math.cos(legAng) * 4.5;
    const legZ = Math.sin(legAng) * 4.5;

    // Outer cylinder
    const outerLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.2, 12), darkSteel
    );
    outerLeg.position.set(legX, -0.6, legZ);
    group.add(outerLeg);

    // Inner piston
    const innerLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.8, 12), chrome
    );
    innerLeg.position.set(legX, -1.4, legZ);
    group.add(innerLeg);

    // Foot pad
    const footPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.3, 0.08, 16), rubber
    );
    footPad.position.set(legX, -1.84, legZ);
    group.add(footPad);
  }

  // =====================================================================
  // 18. SAFETY CAGE / GRATING AROUND BASE
  // =====================================================================
  for (let seg = 0; seg < 24; seg++) {
    const ang = (Math.PI * 2 / 24) * seg;
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 2.0, 6), aluminum
    );
    post.position.set(Math.cos(ang) * 5.2, 0.75, Math.sin(ang) * 5.2);
    group.add(post);
  }
  // Top and bottom horizontal rails
  for (let rail = 0; rail < 2; rail++) {
    const railRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.02, 6, 64), aluminum
    );
    railRing.rotation.x = Math.PI / 2;
    railRing.position.y = rail === 0 ? -0.2 : 1.75;
    group.add(railRing);
  }

  // =====================================================================
  // 19. DECORATIVE WIRING HARNESS
  // =====================================================================
  const wireColors = [neonCyan, neonMagenta, neonGreen, plasmaMat, quantumGlow];
  for (let w = 0; w < 10; w++) {
    const startAng = Math.random() * Math.PI * 2;
    const endAng = startAng + Math.PI * (0.3 + Math.random() * 0.7);
    const startR = 2.0 + Math.random() * 1.0;
    const wirePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(startAng) * startR, 0.5 + Math.random() * 4.0, Math.sin(startAng) * startR),
      new THREE.Vector3(Math.cos((startAng + endAng) / 2) * (startR + 0.5), 1.0 + Math.random() * 3.0, Math.sin((startAng + endAng) / 2) * (startR + 0.5)),
      new THREE.Vector3(Math.cos(endAng) * startR, 0.5 + Math.random() * 4.0, Math.sin(endAng) * startR)
    ]);
    const wire = new THREE.Mesh(
      new THREE.TubeGeometry(wirePath, 16, 0.015, 6, false),
      wireColors[w % wireColors.length]
    );
    group.add(wire);
  }

  // =====================================================================
  // 20. WARNING LABELS / CAUTION STRIPES
  // =====================================================================
  const cautionMat = new THREE.MeshStandardMaterial({
    color: 0xffcc00, emissive: 0x332200, emissiveIntensity: 0.3,
    metalness: 0.2, roughness: 0.6
  });
  for (let cs = 0; cs < 6; cs++) {
    const ang = (Math.PI * 2 / 6) * cs;
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.08, 0.01), cautionMat
    );
    stripe.position.set(Math.cos(ang) * 5.15, 0.3, Math.sin(ang) * 5.15);
    stripe.rotation.y = -ang + Math.PI / 2;
    group.add(stripe);
  }

  // =====================================================================
  // PARTS ARRAY — 20 Detailed Parts
  // =====================================================================
  const parts = [
    {
      name: 'Central Sorting Chamber',
      description: 'Lathe-profiled glass-steel vacuum vessel housing the molecular sorting region. Maintains 10⁻¹² Torr vacuum with reinforced ribs and horizontal band clamps.',
      material: 'Borosilicate glass / maraging steel',
      function: 'Contains the two-compartment gas volume where Maxwell\'s Demon sorts fast and slow molecules through the central gate aperture.',
      assemblyOrder: 1,
      connections: ['Molecular Gate', 'Hot Reservoir Conduit', 'Cold Reservoir Conduit'],
      failureEffect: 'Vacuum breach equalises compartments — entropy reversal ceases immediately.',
      cascadeFailures: ['Molecular Gate', 'Hot Reservoir', 'Cold Reservoir'],
      originalPosition: { x: 0, y: 2.75, z: 0 },
      explodedPosition: { x: 0, y: 2.75, z: 0 }
    },
    {
      name: 'Molecular Gate (Maxwell Trapdoor)',
      description: 'Nanoscale MEMS trapdoor actuated by piezoelectric micro-actuators at ~10 GHz switching frequency. Aperture 450 nm square.',
      material: 'Silicon nitride / PZT actuator stack',
      function: 'Selectively opens to allow fast molecules rightward (hot reservoir) and slow molecules leftward (cold reservoir), implementing the Maxwell Demon protocol.',
      assemblyOrder: 2,
      connections: ['Central Sorting Chamber', 'Information Processing Unit'],
      failureEffect: 'Gate stuck open allows free mixing — no entropy reduction. Gate stuck closed halts sorting entirely.',
      cascadeFailures: ['Information Processing Unit', 'Entropy Counter'],
      originalPosition: { x: 0, y: 2.9, z: 0 },
      explodedPosition: { x: 0, y: 2.9, z: 4 }
    },
    {
      name: 'Hot Reservoir',
      description: 'Right-side thermally insulated lathe-profiled vessel collecting fast (high-kinetic-energy) molecules. Wrapped with plasma-emissive monitoring coils.',
      material: 'Aerogel-insulated stainless steel',
      function: 'Accumulates high-speed molecules sorted by the gate, progressively increasing temperature above ambient — the "hot side" of the demon.',
      assemblyOrder: 3,
      connections: ['Transfer Conduit (Hot)', 'Radiator Fins'],
      failureEffect: 'Thermal runaway — reservoir overheats and forces emergency venting.',
      cascadeFailures: ['Radiator Fins', 'Transfer Conduit (Hot)'],
      originalPosition: { x: 3.8, y: 2.0, z: 0 },
      explodedPosition: { x: 7.0, y: 2.0, z: 0 }
    },
    {
      name: 'Cold Reservoir',
      description: 'Left-side cryo-insulated vessel collecting slow (low-kinetic-energy) molecules. Features frost-emissive cryo-coils.',
      material: 'Multi-layer insulation / oxygen-free copper',
      function: 'Accumulates low-speed molecules, progressively decreasing temperature below ambient — the "cold side" of the demon.',
      assemblyOrder: 4,
      connections: ['Transfer Conduit (Cold)', 'Cryo-Cooler Assembly'],
      failureEffect: 'Frost buildup blocks conduit — cold reservoir saturates and sorting stalls.',
      cascadeFailures: ['Cryo-Cooler Assembly', 'Transfer Conduit (Cold)'],
      originalPosition: { x: -3.8, y: 2.0, z: 0 },
      explodedPosition: { x: -7.0, y: 2.0, z: 0 }
    },
    {
      name: 'Information Processing Unit (Landauer Module)',
      description: 'Icosahedral quantum-computing core that measures molecular velocities and decides gate state. Surrounded by orbital data rings and 8 Landauer erasure nodes.',
      material: 'Superconducting niobium / topological qubit substrate',
      function: 'Performs single-molecule velocity measurement, computes gate decision, and irreversibly erases measurement data — dissipating kT·ln2 per bit erased (Landauer\'s principle), which is the thermodynamic cost that preserves the 2nd law.',
      assemblyOrder: 5,
      connections: ['Molecular Gate', 'Demon Observation Tower', 'Entropy Counter'],
      failureEffect: 'Without information processing, gate cannot be actuated — demon is "blind" and sorting is random (no entropy decrease).',
      cascadeFailures: ['Molecular Gate', 'Entropy Counter', 'Demon Observation Tower'],
      originalPosition: { x: 0, y: 6.0, z: 0 },
      explodedPosition: { x: 0, y: 9.0, z: 0 }
    },
    {
      name: 'Entropy Counter Display',
      description: 'High-resolution OLED panel with 12-segment bar graph showing real-time system entropy, plus 6 status LEDs for subsystem health.',
      material: 'Gorilla glass / AMOLED / aluminium bracket',
      function: 'Displays instantaneous Shannon entropy of the molecular distribution, ΔS of reservoirs, and Landauer dissipation rate in real time.',
      assemblyOrder: 6,
      connections: ['Information Processing Unit', 'Control Panel'],
      failureEffect: 'Operators lose visibility of entropy state — blind operation risks violating safety thresholds.',
      cascadeFailures: ['Control Panel'],
      originalPosition: { x: 0, y: 4.0, z: 2.6 },
      explodedPosition: { x: 0, y: 4.0, z: 5.5 }
    },
    {
      name: 'Demon Observation Tower',
      description: 'Sensor mast with chrome-dome velocity detector (the "Demon\'s eye"), 5-element antenna array, and lathe-profiled structural column.',
      material: 'Machined titanium / InGaAs photodetector',
      function: 'Measures individual molecular velocities via Doppler micro-spectroscopy and relays data to the IPU for gate decisions at GHz rates.',
      assemblyOrder: 7,
      connections: ['Information Processing Unit', 'Central Sorting Chamber'],
      failureEffect: 'Velocity data unavailable — IPU defaults to random gate state; net entropy change → zero.',
      cascadeFailures: ['Information Processing Unit'],
      originalPosition: { x: 0, y: 5.5, z: -2.0 },
      explodedPosition: { x: 0, y: 5.5, z: -5.0 }
    },
    {
      name: 'Szilard Engine Piston',
      description: 'Single-molecule heat engine: transparent cylinder with a freely sliding piston, connected to a flywheel via a chrome rod.',
      material: 'Diamond-like carbon cylinder / beryllium-copper piston',
      function: 'Demonstrates work extraction from a single thermal molecule — the Szilard engine thought experiment made physical. Converts kT·ln2 of heat into mechanical work per measurement-expansion cycle.',
      assemblyOrder: 8,
      connections: ['Information Processing Unit', 'Flywheel'],
      failureEffect: 'Piston seizure halts work extraction cycle; flywheel decelerates.',
      cascadeFailures: ['Flywheel'],
      originalPosition: { x: 2.0, y: 0.5, z: 3.0 },
      explodedPosition: { x: 4.0, y: 0.5, z: 5.0 }
    },
    {
      name: 'Transfer Conduit (Hot)',
      description: 'CatmullRom-curved copper tube with dual valve assemblies routing fast molecules from chamber to hot reservoir.',
      material: 'Oxygen-free high-conductivity copper',
      function: 'Transports sorted fast molecules from the central chamber rightward into the hot reservoir under pressure differential.',
      assemblyOrder: 9,
      connections: ['Central Sorting Chamber', 'Hot Reservoir'],
      failureEffect: 'Blockage causes pressure imbalance — fast molecules re-mix into chamber.',
      cascadeFailures: ['Hot Reservoir'],
      originalPosition: { x: 3.0, y: 2.5, z: 0 },
      explodedPosition: { x: 5.0, y: 2.5, z: 2.0 }
    },
    {
      name: 'Transfer Conduit (Cold)',
      description: 'CatmullRom-curved aluminium tube routing slow molecules from chamber to cold reservoir.',
      material: 'Aerospace-grade aluminium 7075-T6',
      function: 'Transports sorted slow molecules from the central chamber leftward into the cold reservoir.',
      assemblyOrder: 10,
      connections: ['Central Sorting Chamber', 'Cold Reservoir'],
      failureEffect: 'Leak introduces ambient gas — cold reservoir warms, entropy reduction nullified.',
      cascadeFailures: ['Cold Reservoir'],
      originalPosition: { x: -3.0, y: 2.5, z: 0 },
      explodedPosition: { x: -5.0, y: 2.5, z: 2.0 }
    },
    {
      name: 'Radiator Fin Array',
      description: '14-fin aluminium radiator with dual darkSteel frame rails for waste-heat rejection from the hot reservoir.',
      material: 'Aluminium 6063-T5 extrusion',
      function: 'Dissipates excess thermal energy from the hot reservoir to prevent thermal runaway. Maintains safe ΔT across the system.',
      assemblyOrder: 11,
      connections: ['Hot Reservoir'],
      failureEffect: 'Insufficient cooling — hot reservoir temperature diverges, approaching material failure.',
      cascadeFailures: ['Hot Reservoir'],
      originalPosition: { x: 5.0, y: 1.5, z: -1.0 },
      explodedPosition: { x: 8.0, y: 1.5, z: -1.0 }
    },
    {
      name: 'Cryo-Cooler Assembly',
      description: 'Pulse-tube cryocooler with copper coil-wrapped compressor, chrome expansion valve, and vibration isolation.',
      material: 'Copper / stainless steel / chrome valve',
      function: 'Actively cools the cold reservoir below ambient to compensate for parasitic heat leaks and maintain the temperature gradient.',
      assemblyOrder: 12,
      connections: ['Cold Reservoir'],
      failureEffect: 'Cold reservoir warms toward ambient — temperature gradient collapses, entropy reversal effectiveness drops to zero.',
      cascadeFailures: ['Cold Reservoir'],
      originalPosition: { x: -5.0, y: 1.5, z: -1.0 },
      explodedPosition: { x: -8.0, y: 1.5, z: -1.0 }
    },
    {
      name: 'Quantum Interferometer',
      description: 'Four-arm Mach-Zehnder interferometer with beam-splitter cube and end-mirrors for non-demolition molecular velocity measurement.',
      material: 'Fused silica optics / dielectric mirror coatings',
      function: 'Performs quantum non-demolition (QND) measurement of molecular momentum, enabling the Demon to sort without fully collapsing the molecular wavefunction.',
      assemblyOrder: 13,
      connections: ['Demon Observation Tower', 'Information Processing Unit'],
      failureEffect: 'Measurement back-action destroys coherence — sort accuracy drops below thermodynamic break-even.',
      cascadeFailures: ['Demon Observation Tower'],
      originalPosition: { x: 0, y: 2.0, z: -2.5 },
      explodedPosition: { x: 0, y: 2.0, z: -5.5 }
    },
    {
      name: 'Control Panel',
      description: 'Angled operator console with 12 illuminated push-buttons, 6 toggle switches, mini OLED display, and precision joystick for manual override.',
      material: 'Powder-coated steel / silicone buttons / chrome joystick',
      function: 'Provides manual control over gate timing, reservoir valves, IPU modes, and emergency shutdown. Displays subsystem telemetry.',
      assemblyOrder: 14,
      connections: ['Entropy Counter', 'Information Processing Unit', 'All Valves'],
      failureEffect: 'Loss of operator override — system runs in autonomous mode only, no manual emergency stop available.',
      cascadeFailures: ['Entropy Counter'],
      originalPosition: { x: 0, y: 1.5, z: 4.0 },
      explodedPosition: { x: 0, y: 1.5, z: 7.0 }
    },
    {
      name: 'Hydraulic Support Legs',
      description: 'Four height-adjustable chromium-piston legs with rubber damping pads, arranged at 45° intervals around hexagonal base.',
      material: 'Hardened chromium steel / nitrile rubber pads',
      function: 'Level the machine on uneven surfaces and isolate it from ground vibrations that could disrupt nanoscale gate operation.',
      assemblyOrder: 15,
      connections: ['Hexagonal Base Platform'],
      failureEffect: 'Vibration coupling to chamber — gate timing jitter causes random sorting errors.',
      cascadeFailures: ['Molecular Gate'],
      originalPosition: { x: 0, y: -1.0, z: 0 },
      explodedPosition: { x: 0, y: -3.0, z: 0 }
    },
    {
      name: 'Hexagonal Base Platform',
      description: 'Six-sided extruded darkSteel platform with bevelled edges, 36 chrome rivets, and neon cyan perimeter glow ring.',
      material: 'Cast tool steel with chrome fasteners',
      function: 'Structural foundation distributing load evenly; glow ring provides operational status indication (cyan = nominal, red = fault).',
      assemblyOrder: 0,
      connections: ['All subsystems'],
      failureEffect: 'Structural collapse — catastrophic loss of all mounted subsystems.',
      cascadeFailures: ['All'],
      originalPosition: { x: 0, y: -0.25, z: 0 },
      explodedPosition: { x: 0, y: -3.5, z: 0 }
    },
    {
      name: 'Flywheel',
      description: 'Six-spoke darkSteel torus connected to the Szilard piston rod, storing rotational kinetic energy extracted from the single-molecule engine.',
      material: 'Maraging steel torus / chrome spokes',
      function: 'Stores and smooths mechanical work output from the Szilard engine cycle, providing a visible demonstration of kT·ln2 work extraction.',
      assemblyOrder: 16,
      connections: ['Szilard Engine Piston'],
      failureEffect: 'Energy storage lost — piston stalls at top dead centre.',
      cascadeFailures: ['Szilard Engine Piston'],
      originalPosition: { x: 2.0, y: 2.0, z: 3.0 },
      explodedPosition: { x: 4.0, y: 3.0, z: 5.0 }
    },
    {
      name: 'Safety Cage',
      description: '24-post aluminium railing with dual horizontal toroidal rails enclosing the machine perimeter.',
      material: 'Anodised aluminium tubing',
      function: 'Prevents personnel from contacting high-temperature hot reservoir or cryogenic cold reservoir surfaces during operation.',
      assemblyOrder: 17,
      connections: ['Hexagonal Base Platform'],
      failureEffect: 'Personnel exposure to extreme temperatures — safety violation.',
      cascadeFailures: [],
      originalPosition: { x: 0, y: 0.75, z: 0 },
      explodedPosition: { x: 0, y: 0.75, z: 0 }
    },
    {
      name: 'Wiring Harness',
      description: '10-cable CatmullRom routed neon wiring harness carrying power, sensor data, and gate control signals between all subsystems.',
      material: 'PTFE-insulated superconducting NbTi wire',
      function: 'Interconnects IPU, gate actuators, sensors, display, and control panel with low-latency superconducting signal paths.',
      assemblyOrder: 18,
      connections: ['All electronic subsystems'],
      failureEffect: 'Signal loss — gate timing desynchronises from molecular measurement, sorting randomises.',
      cascadeFailures: ['Information Processing Unit', 'Molecular Gate', 'Entropy Counter'],
      originalPosition: { x: 0, y: 2.5, z: 0 },
      explodedPosition: { x: 0, y: 2.5, z: 0 }
    },
    {
      name: 'Exhaust Heat Stacks',
      description: 'Dual chimney stacks (one per side) with chrome caps and thermal-shimmer rings visualising Landauer waste heat emission.',
      material: 'Refractory-lined stainless steel',
      function: 'Vent the irreducible Landauer dissipation (kT·ln2 per erased bit) as waste heat to the environment, ensuring 2nd-law compliance of the overall system.',
      assemblyOrder: 19,
      connections: ['Information Processing Unit', 'Hot Reservoir', 'Cold Reservoir'],
      failureEffect: 'Heat accumulation in IPU — computation overheats, gate decisions degrade, sorting efficiency collapses.',
      cascadeFailures: ['Information Processing Unit'],
      originalPosition: { x: 0, y: 4.0, z: -1.5 },
      explodedPosition: { x: 0, y: 7.0, z: -1.5 }
    }
  ];

  // =====================================================================
  // QUIZ QUESTIONS — PhD-Level Statistical Mechanics / Info Theory
  // =====================================================================
  const quizQuestions = [
    {
      question: 'Landauer\'s principle states that erasing one bit of information in a computation at temperature T dissipates a minimum of kT·ln(2) of energy as heat. In Maxwell\'s Demon, which specific act triggers this dissipation, and why does it rescue the Second Law of Thermodynamics?',
      options: [
        'Opening the gate — the gate\'s mechanical friction generates the entropy',
        'Measuring the molecule\'s velocity — the measurement disturbs the molecule',
        'Erasing the Demon\'s memory of the measurement result — resetting memory is logically irreversible and must dissipate ≥ kT·ln2, producing at least as much entropy as was reduced by sorting',
        'Closing the gate — compressing the gas on one side raises entropy'
      ],
      correctAnswer: 2,
      explanation: 'Charles Bennett showed that measurement can in principle be done reversibly, but the Demon\'s memory is finite and must be erased to continue operating. Landauer\'s principle proves that each bit erasure (a logically irreversible operation mapping two states to one) dissipates ≥ kT·ln2. This dissipation generates at least as much entropy as the sorting reduces, saving the Second Law. The gate mechanics, measurement, and gas compression are all, in principle, thermodynamically reversible.'
    },
    {
      question: 'A Szilard engine operates with a single gas molecule in a box at temperature T. The engine measures which half the molecule occupies, inserts a partition, and isothermally expands against the partition to extract work. What is the maximum work extractable per cycle, and what compensates for the apparent entropy decrease?',
      options: [
        'kT — the molecule\'s average kinetic energy; nothing compensates because the 2nd law doesn\'t apply to single molecules',
        'kT·ln(2) — one bit of positional information is gained; the compensating entropy is generated when the one-bit measurement record is erased from the engine\'s memory',
        '3kT/2 — the full thermal energy; compensated by cooling the reservoir',
        'Zero — you cannot extract work from a single heat bath'
      ],
      correctAnswer: 1,
      explanation: 'The Szilard engine extracts exactly kT·ln(2) of work per cycle (isothermal expansion from V/2 to V). This appears to violate the Kelvin statement of the 2nd law (extracting work from a single heat bath). However, the engine must measure which half the molecule is in, gaining 1 bit of information. When this bit is erased to reset the engine for the next cycle, Landauer\'s principle demands dissipation of ≥ kT·ln(2), exactly cancelling the extracted work.'
    },
    {
      question: 'In Jaynes\' maximum entropy formalism, the equilibrium (Boltzmann) distribution is derived by maximising which quantity subject to constraints on the mean energy ⟨E⟩ and normalisation?',
      options: [
        'The Helmholtz free energy F = U − TS',
        'The Gibbs entropy S = −kB Σ pi ln(pi)',
        'The partition function Z = Σ exp(−βEi)',
        'The mutual information I(X;Y) between system and reservoir'
      ],
      correctAnswer: 1,
      explanation: 'Jaynes showed that statistical mechanics can be derived from information theory: the canonical (Boltzmann) distribution p_i = exp(−βE_i)/Z is the unique distribution that maximises the Shannon/Gibbs entropy S = −k_B Σ p_i ln(p_i) subject to the constraints Σ p_i = 1 and Σ p_i E_i = ⟨E⟩. The Lagrange multiplier enforcing the energy constraint is identified as β = 1/(kT). This establishes a deep link between information-theoretic entropy and thermodynamic entropy.'
    },
    {
      question: 'Consider an ideal Maxwell Demon that sorts N molecules with perfect accuracy. After N sorting events, the system entropy decreases by ΔS_sys = −Nk·ln(2). Accounting for Landauer erasure, what is the total entropy change of the universe (system + demon + environment)?',
      options: [
        'ΔS_total = −2Nk·ln(2) — both system and demon decrease',
        'ΔS_total = 0 — the demon\'s erasure exactly compensates the system\'s decrease',
        'ΔS_total ≥ 0 — erasure dissipates at least Nk·ln(2), so the total is non-negative, satisfying the 2nd law',
        'ΔS_total = +Nk·ln(2) — the demon always generates strictly more entropy than it removes'
      ],
      correctAnswer: 2,
      explanation: 'Each sorting event stores one bit in the demon\'s memory (which half is the molecule faster than threshold). After N events, the demon\'s N-bit memory must be erased. By Landauer\'s principle, each erasure dissipates ≥ kT·ln(2) into the environment, generating ≥ Nk·ln(2) of environmental entropy. Since the system entropy decreased by Nk·ln(2), the total ΔS_total = ΔS_sys + ΔS_env ≥ −Nk·ln(2) + Nk·ln(2) = 0. Equality holds only for an ideal reversible erasure protocol.'
    },
    {
      question: 'The Jarzynski equality ⟨exp(−W/kT)⟩ = exp(−ΔF/kT) relates non-equilibrium work W to equilibrium free energy difference ΔF. If you repeatedly operate a molecular gate in the demon and measure work values {W₁, W₂, …, Wₙ}, how does this equality constrain the average work ⟨W⟩ relative to ΔF?',
      options: [
        '⟨W⟩ = ΔF always — the equality means average work equals free energy change',
        '⟨W⟩ ≥ ΔF — by Jensen\'s inequality applied to the convex function exp(−x), the average work is at least the free energy change, recovering the 2nd law as a special case',
        '⟨W⟩ ≤ ΔF — the Jarzynski equality proves you can extract more work than the free energy change on average',
        '⟨W⟩ has no relation to ΔF — the Jarzynski equality only constrains exponential averages'
      ],
      correctAnswer: 1,
      explanation: 'By Jensen\'s inequality, for the convex function f(x) = exp(−x): ⟨exp(−W/kT)⟩ ≥ exp(−⟨W⟩/kT). Combined with the Jarzynski equality, this gives exp(−ΔF/kT) ≥ exp(−⟨W⟩/kT), hence ⟨W⟩ ≥ ΔF. This is precisely the statement of the second law: the average work done on a system in a non-equilibrium process is at least the free energy change. The Jarzynski equality is remarkable because it recovers the 2nd-law inequality from an exact equality valid arbitrarily far from equilibrium.'
    },
    {
      question: 'In the Zurek-Lloyd quantum formulation of Maxwell\'s Demon, why can\'t a quantum demon exploit entanglement to circumvent Landauer\'s bound and achieve net entropy reduction without compensating dissipation?',
      options: [
        'Entanglement cannot carry classical information, so the demon cannot learn molecular speeds',
        'The no-cloning theorem prevents copying the measurement result, so the demon must still store and later erase classical bits to act on the measurement',
        'Quantum decoherence destroys entanglement before it can be used',
        'Heisenberg uncertainty prevents precise velocity measurements'
      ],
      correctAnswer: 1,
      explanation: 'Zurek and Lloyd showed that even a quantum demon must convert quantum measurement outcomes into classical records to actuate a classical gate. The no-cloning theorem forbids copying arbitrary quantum states, so the demon cannot bypass classical recording. These classical records still occupy physical memory that must be erased to reset the demon, incurring Landauer\'s kT·ln(2) cost per bit. Entanglement between demon and molecule is broken upon measurement (wavefunction collapse / decoherence), leaving a classical bit. Thus quantum mechanics provides no loophole around Landauer\'s bound.'
    }
  ];

  // =====================================================================
  // DESCRIPTION
  // =====================================================================
  const description = `The Entropy Reversal Engine is an ultra-advanced Maxwell's Demon machine that locally reverses thermodynamic entropy by sorting gas molecules according to their velocities. A central vacuum sorting chamber houses a nanoscale MEMS trapdoor (the "Molecular Gate") controlled by an icosahedral quantum Information Processing Unit. Fast molecules are directed to the Hot Reservoir (right, glowing red), while slow molecules are directed to the Cold Reservoir (left, glowing blue), creating a temperature gradient from thermal equilibrium — an apparent violation of the Second Law.

The apparent paradox is resolved by Landauer's principle: the IPU must measure each molecule's velocity (gaining 1 bit of information) and later erase that bit from memory to continue operating. Each erasure dissipates a minimum of kT·ln(2) of heat into the environment via the Exhaust Heat Stacks, generating at least as much entropy as was reduced by sorting. The Entropy Counter Display shows the real-time balance.

A side-mounted Szilard Engine demonstrates single-molecule work extraction (kT·ln(2) per cycle), while a Quantum Interferometer enables non-demolition velocity measurement. The Demon Observation Tower houses the Doppler micro-spectroscopy sensor ("Demon's Eye") that feeds velocity data to the IPU at GHz rates.

The machine is a physical embodiment of the deep connection between information theory (Shannon entropy), thermodynamics (Clausius entropy), and computation (Landauer's principle, reversible computing).`;

  // =====================================================================
  // ANIMATE — Rich Synchronized Animation
  // =====================================================================
  function animate(time, speed, refMeshes) {
    const t = time * speed;

    // 1. Gate trapdoor flipping — rapid oscillation
    if (refMeshes.gatePivot) {
      refMeshes.gatePivot.rotation.y = Math.sin(t * 4.0) * (Math.PI / 3);
      // Gate door color pulse
      if (refMeshes.gateDoor) {
        const gateOpen = Math.sin(t * 4.0);
        refMeshes.gateDoor.material.emissiveIntensity = 0.8 + gateOpen * 0.6;
      }
    }

    // 2. Gate micro-actuators pulsing
    if (refMeshes.gateActuators) {
      refMeshes.gateActuators.forEach((act, i) => {
        act.scale.y = 1.0 + 0.5 * Math.sin(t * 4.0 + i * Math.PI / 2);
      });
    }

    // 3. Particle sorting animation — fast particles drift right, slow drift left
    if (refMeshes.particles) {
      refMeshes.particles.forEach((p, idx) => {
        const ud = p.userData;
        const spd = ud.speed;
        const phase = ud.phase;

        // Brownian-like motion
        p.position.x += Math.sin(t * spd * 3 + phase) * 0.008 * speed;
        p.position.z += Math.cos(t * spd * 2.5 + phase * 1.3) * 0.008 * speed;
        p.position.y += Math.sin(t * spd * 2 + phase * 0.7) * 0.004 * speed;

        // Sorting drift — fast particles (red) drift toward +x, slow (blue) toward -x
        const sortForce = ud.isFast ? 0.003 : -0.003;
        p.position.x += sortForce * speed;

        // Clamp within chamber bounds
        const maxR = 2.0;
        const dist = Math.sqrt(p.position.x * p.position.x + p.position.z * p.position.z);
        if (dist > maxR) {
          p.position.x *= maxR / dist;
          p.position.z *= maxR / dist;
        }
        p.position.y = Math.max(0.6, Math.min(5.0, p.position.y));

        // Wrap-around: if particle drifts too far to the sorted side, reset toward center
        if (ud.isFast && p.position.x > 1.8) {
          p.position.x = -0.5 + Math.random() * 0.5;
        } else if (!ud.isFast && p.position.x < -1.8) {
          p.position.x = -0.5 + Math.random() * 1.0;
        }

        // Particle size pulse (fast particles vibrate more)
        const vibration = 1.0 + 0.2 * Math.sin(t * spd * 8 + phase);
        p.scale.set(vibration, vibration, vibration);
      });
    }

    // 4. IPU rotation and pulsation
    if (refMeshes.ipu) {
      refMeshes.ipu.rotation.x = t * 0.3;
      refMeshes.ipu.rotation.y = t * 0.5;
      refMeshes.ipu.material.emissiveIntensity = 1.2 + 0.5 * Math.sin(t * 2.0);
    }
    if (refMeshes.ipuWire) {
      refMeshes.ipuWire.rotation.x = t * 0.3;
      refMeshes.ipuWire.rotation.y = t * 0.5;
    }

    // 5. Data rings orbital precession
    if (refMeshes.dataRings) {
      refMeshes.dataRings.forEach((ring, i) => {
        ring.rotation.x = Math.PI / 2 + i * 0.3 + t * (0.8 + i * 0.3);
        ring.rotation.z = i * 0.5 + t * (0.4 + i * 0.2);
      });
    }

    // 6. Landauer erasure nodes pulsing in sequence
    if (refMeshes.landauerNodes) {
      refMeshes.landauerNodes.forEach((node, i) => {
        const pulsePhase = (t * 3.0 + i * (Math.PI / 4)) % (Math.PI * 2);
        const brightness = Math.max(0.3, Math.sin(pulsePhase));
        node.material.emissiveIntensity = brightness * 2.0;
        node.scale.setScalar(0.8 + brightness * 0.5);
      });
    }

    // 7. Entropy bar graph animation
    if (refMeshes.entropyBars) {
      refMeshes.entropyBars.forEach((bar, i) => {
        const barPhase = Math.sin(t * 1.5 + i * 0.5);
        bar.scale.y = 0.3 + (barPhase * 0.5 + 0.5) * 0.7;
        bar.material.emissiveIntensity = 1.0 + barPhase * 1.0;
      });
    }

    // 8. Demon eye tracking (looks left/right following sorting)
    if (refMeshes.demonEye) {
      refMeshes.demonEye.position.x = Math.sin(t * 2.0) * 0.15;
      refMeshes.demonEye.material.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 6.0);
    }

    // 9. Hot reservoir glow pulsing
    if (refMeshes.hotReservoir) {
      refMeshes.hotReservoir.material.emissiveIntensity = 0.7 + 0.4 * Math.sin(t * 1.2);
    }

    // 10. Cold reservoir glow pulsing (inverse phase)
    if (refMeshes.coldReservoir) {
      refMeshes.coldReservoir.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 1.2 + Math.PI);
    }

    // 11. Szilard piston oscillation
    if (refMeshes.szPiston) {
      refMeshes.szPiston.position.y = Math.sin(t * 2.5) * 0.6;
    }
    if (refMeshes.szRod) {
      refMeshes.szRod.position.y = 0.75 + Math.sin(t * 2.5) * 0.3;
    }

    // 12. Single molecule bouncing in Szilard cylinder
    if (refMeshes.singleMolecule) {
      refMeshes.singleMolecule.position.y = -0.3 + Math.abs(Math.sin(t * 5.0)) * 0.5;
      refMeshes.singleMolecule.position.x = Math.sin(t * 3.7) * 0.3;
    }

    // 13. Flywheel rotation
    if (refMeshes.flywheel) {
      refMeshes.flywheel.rotation.z = t * 3.0;
    }

    // 14. Chamber subtle rotation (slow)
    if (refMeshes.chamber) {
      refMeshes.chamber.rotation.y = Math.sin(t * 0.1) * 0.02;
    }

    // 15. Base ring neon pulse
    if (refMeshes.baseRing) {
      refMeshes.baseRing.material.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 1.8);
    }
  }

  // =====================================================================
  // RETURN
  // =====================================================================
  return { group, parts, description, quizQuestions, animate };
}
