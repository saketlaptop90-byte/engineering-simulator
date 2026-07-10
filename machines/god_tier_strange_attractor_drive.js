// ============================================================================
// STRANGE ATTRACTOR CHAOS DRIVE — ULTRA GOD TIER
// An engine exploiting deterministic chaos and strange attractors for propulsion.
// Lorenz / Rössler attractor trajectory visualization, phase-space navigator,
// bifurcation controller, chaos-energy harvester, extreme animation.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {

  const group = new THREE.Group();

  // ── Helper Materials ──────────────────────────────────────────────────────
  const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.92 });
  const neonMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.3, metalness: 0.25, roughness: 0.2, transparent: true, opacity: 0.88 });
  const neonGold = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.1, metalness: 0.4, roughness: 0.15, transparent: true, opacity: 0.9 });
  const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 1.2, metalness: 0.3, roughness: 0.2, transparent: true, opacity: 0.85 });
  const neonRed = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 1.0, metalness: 0.35, roughness: 0.2, transparent: true, opacity: 0.9 });
  const chaosPlasma = new THREE.MeshStandardMaterial({ color: 0x8844ff, emissive: 0x8844ff, emissiveIntensity: 1.6, metalness: 0.5, roughness: 0.1, transparent: true, opacity: 0.7 });
  const darkHull = new THREE.MeshStandardMaterial({ color: 0x0a0a12, metalness: 0.95, roughness: 0.15 });
  const innerFrame = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.2 });
  const hologramBlue = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x4488ff, emissiveIntensity: 0.8, transparent: true, opacity: 0.35, side: THREE.DoubleSide });

  // ── Mesh References for Animation ─────────────────────────────────────────
  const meshes = {};

  // ========================================================================
  // 1. PRIMARY CONTAINMENT HULL — Lathe-profiled toroidal chassis
  // ========================================================================
  const hullProfile = new THREE.Shape();
  hullProfile.moveTo(0, -3.2);
  hullProfile.quadraticCurveTo(3.8, -3.2, 4.2, -1.0);
  hullProfile.quadraticCurveTo(4.5, 0, 4.2, 1.0);
  hullProfile.quadraticCurveTo(3.8, 3.2, 0, 3.2);
  const hullPoints = hullProfile.getPoints(60);
  const hullGeo = new THREE.LatheGeometry(hullPoints, 128);
  const hull = new THREE.Mesh(hullGeo, darkHull);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);
  meshes.hull = hull;

  // Hull panel lines — etched rings
  for (let i = 0; i < 24; i++) {
    const ringGeo = new THREE.TorusGeometry(3.6 + Math.sin(i * 0.5) * 0.6, 0.015, 8, 128);
    const ring = new THREE.Mesh(ringGeo, neonCyan);
    ring.position.y = -2.8 + i * 0.26;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  // Hull rivets — 3 rings of 32 rivets each
  for (let r = 0; r < 3; r++) {
    const y = -2.0 + r * 2.0;
    const radius = 3.9 + Math.sin(r) * 0.3;
    for (let j = 0; j < 32; j++) {
      const angle = (j / 32) * Math.PI * 2;
      const rivet = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        chrome
      );
      rivet.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      group.add(rivet);
    }
  }

  // ========================================================================
  // 2. LORENZ ATTRACTOR CHAMBER — Central butterfly trajectory generator
  // ========================================================================
  const lorenzChamberGeo = new THREE.SphereGeometry(2.2, 64, 64);
  const lorenzChamber = new THREE.Mesh(lorenzChamberGeo, new THREE.MeshStandardMaterial({
    color: 0x080818, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.45
  }));
  lorenzChamber.position.y = 0;
  group.add(lorenzChamber);
  meshes.lorenzChamber = lorenzChamber;

  // Generate Lorenz attractor trajectory
  function generateLorenz(sigma, rho, beta, dt, steps) {
    const pts = [];
    let x = 0.1, y = 0, z = 0;
    for (let i = 0; i < steps; i++) {
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
      x += dx * dt; y += dy * dt; z += dz * dt;
      pts.push(new THREE.Vector3(x * 0.06, z * 0.06 - 1.0, y * 0.06));
    }
    return pts;
  }

  const lorenzPoints = generateLorenz(10, 28, 8 / 3, 0.005, 8000);
  const lorenzCurve = new THREE.CatmullRomCurve3(lorenzPoints, false);
  const lorenzTubeGeo = new THREE.TubeGeometry(lorenzCurve, 4000, 0.012, 6, false);
  const lorenzTrajectory = new THREE.Mesh(lorenzTubeGeo, neonCyan);
  group.add(lorenzTrajectory);
  meshes.lorenzTrajectory = lorenzTrajectory;

  // Lorenz trajectory particle nodes — glowing spheres at key positions
  const lorenzNodes = [];
  for (let i = 0; i < 120; i++) {
    const t = i / 120;
    const pt = lorenzCurve.getPointAt(t);
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.03 + Math.sin(i * 0.3) * 0.015, 8, 8),
      neonMagenta
    );
    node.position.copy(pt);
    group.add(node);
    lorenzNodes.push(node);
  }
  meshes.lorenzNodes = lorenzNodes;

  // ========================================================================
  // 3. RÖSSLER ATTRACTOR RING — Secondary spiral trajectory system
  // ========================================================================
  function generateRossler(a, b, c, dt, steps) {
    const pts = [];
    let x = 1, y = 1, z = 0;
    for (let i = 0; i < steps; i++) {
      const dx = -y - z;
      const dy = x + a * y;
      const dz = b + z * (x - c);
      x += dx * dt; y += dy * dt; z += dz * dt;
      pts.push(new THREE.Vector3(x * 0.08, z * 0.08 + 3.5, y * 0.08));
    }
    return pts;
  }

  const rosslerPoints = generateRossler(0.2, 0.2, 5.7, 0.01, 6000);
  const rosslerCurve = new THREE.CatmullRomCurve3(rosslerPoints, false);
  const rosslerTubeGeo = new THREE.TubeGeometry(rosslerCurve, 3000, 0.01, 6, false);
  const rosslerTrajectory = new THREE.Mesh(rosslerTubeGeo, neonGold);
  group.add(rosslerTrajectory);
  meshes.rosslerTrajectory = rosslerTrajectory;

  // Rössler containment torus
  const rosslerContainment = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.08, 16, 128),
    chrome
  );
  rosslerContainment.position.y = 3.5;
  rosslerContainment.rotation.x = Math.PI / 2;
  group.add(rosslerContainment);

  // ========================================================================
  // 4. PHASE SPACE NAVIGATOR — 3-axis gimbal plotting real-time trajectories
  // ========================================================================
  const gimbalGroup = new THREE.Group();
  gimbalGroup.position.set(0, -3.8, 0);
  group.add(gimbalGroup);
  meshes.gimbalGroup = gimbalGroup;

  // Outer gimbal ring
  const outerGimbal = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.06, 16, 96),
    aluminum
  );
  gimbalGroup.add(outerGimbal);
  meshes.outerGimbal = outerGimbal;

  // Middle gimbal ring
  const midGimbal = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.05, 16, 96),
    copper
  );
  midGimbal.rotation.x = Math.PI / 2;
  gimbalGroup.add(midGimbal);
  meshes.midGimbal = midGimbal;

  // Inner gimbal ring
  const innerGimbal = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.04, 16, 96),
    steel
  );
  innerGimbal.rotation.z = Math.PI / 2;
  gimbalGroup.add(innerGimbal);
  meshes.innerGimbal = innerGimbal;

  // Phase space core — the plotting head
  const phaseCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 3),
    chaosPlasma
  );
  gimbalGroup.add(phaseCore);
  meshes.phaseCore = phaseCore;

  // Phase space coordinate axes (X, Y, Z indicator rods)
  const axisColors = [0xff0000, 0x00ff00, 0x0000ff];
  const axisRotations = [
    { x: 0, y: 0, z: Math.PI / 2 },
    { x: 0, y: 0, z: 0 },
    { x: Math.PI / 2, y: 0, z: 0 }
  ];
  for (let a = 0; a < 3; a++) {
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: axisColors[a], emissive: axisColors[a], emissiveIntensity: 0.6 })
    );
    rod.rotation.set(axisRotations[a].x, axisRotations[a].y, axisRotations[a].z);
    gimbalGroup.add(rod);
  }

  // ========================================================================
  // 5. BIFURCATION CONTROLLER — Rotary parameter adjustment columns
  // ========================================================================
  const bifurcationGroup = new THREE.Group();
  bifurcationGroup.position.set(0, 5.0, 0);
  group.add(bifurcationGroup);
  meshes.bifurcationGroup = bifurcationGroup;

  // Bifurcation base platform — extruded hexagonal shape
  const hexShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * 2.5;
    const z = Math.sin(angle) * 2.5;
    if (i === 0) hexShape.moveTo(x, z);
    else hexShape.lineTo(x, z);
  }
  hexShape.closePath();
  const hexExtrudeSettings = { depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 };
  const hexPlatform = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings),
    darkSteel
  );
  hexPlatform.rotation.x = -Math.PI / 2;
  bifurcationGroup.add(hexPlatform);

  // Bifurcation parameter columns — 6 adjustable cylinders
  const bifurcColumns = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const colGroup = new THREE.Group();
    colGroup.position.set(Math.cos(angle) * 1.8, 0.3, Math.sin(angle) * 1.8);

    // Base column
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 1.5, 16),
      chrome
    );
    col.position.y = 0.75;
    colGroup.add(col);

    // Parameter dial on top
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.08, 32),
      copper
    );
    dial.position.y = 1.55;
    colGroup.add(dial);

    // Dial indicator mark
    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.1, 0.02),
      neonCyan
    );
    mark.position.set(0, 1.6, 0.15);
    colGroup.add(mark);

    // Column glow ring
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.02, 8, 32),
      neonGreen
    );
    glowRing.position.y = 1.0;
    glowRing.rotation.x = Math.PI / 2;
    colGroup.add(glowRing);

    bifurcationGroup.add(colGroup);
    bifurcColumns.push({ group: colGroup, dial, glowRing });
  }
  meshes.bifurcColumns = bifurcColumns;

  // Central bifurcation display — holographic cylinder
  const bifurcDisplay = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 2.0, 64, 1, true),
    hologramBlue
  );
  bifurcDisplay.position.y = 1.3;
  bifurcationGroup.add(bifurcDisplay);
  meshes.bifurcDisplay = bifurcDisplay;

  // Bifurcation diagram inside display — generated points
  const bifurcDiagramGroup = new THREE.Group();
  bifurcDiagramGroup.position.y = 1.3;
  bifurcationGroup.add(bifurcDiagramGroup);
  meshes.bifurcDiagramGroup = bifurcDiagramGroup;

  // Generate logistic map bifurcation diagram
  for (let rStep = 0; rStep < 200; rStep++) {
    const r = 2.5 + (rStep / 200) * 1.5;
    let x = 0.5;
    for (let i = 0; i < 100; i++) x = r * x * (1 - x); // warmup
    for (let i = 0; i < 12; i++) {
      x = r * x * (1 - x);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 4, 4),
        neonMagenta
      );
      dot.position.set((rStep / 200 - 0.5) * 1.4, (x - 0.5) * 1.6, 0);
      bifurcDiagramGroup.add(dot);
    }
  }

  // ========================================================================
  // 6. CHAOS ENERGY HARVESTER — Sensitivity extraction coils
  // ========================================================================
  const harvesterGroup = new THREE.Group();
  harvesterGroup.position.set(0, -1.5, 0);
  group.add(harvesterGroup);
  meshes.harvesterGroup = harvesterGroup;

  // Toroidal energy collection coils — stacked triple-wound
  for (let coilIdx = 0; coilIdx < 3; coilIdx++) {
    const coilRadius = 2.8 + coilIdx * 0.35;
    const coilTube = 0.03 + coilIdx * 0.01;
    const coilMat = [neonCyan, neonMagenta, neonGold][coilIdx];
    const segments = 256;
    const windingPts = [];
    for (let s = 0; s <= segments; s++) {
      const t = (s / segments) * Math.PI * 2 * 8; // 8 windings
      const baseAngle = (s / segments) * Math.PI * 2;
      const wobble = Math.sin(t) * 0.12;
      windingPts.push(new THREE.Vector3(
        Math.cos(baseAngle) * (coilRadius + wobble),
        Math.sin(t) * 0.15 + coilIdx * 0.35 - 0.35,
        Math.sin(baseAngle) * (coilRadius + wobble)
      ));
    }
    const windingCurve = new THREE.CatmullRomCurve3(windingPts, true);
    const windingGeo = new THREE.TubeGeometry(windingCurve, segments, coilTube, 6, true);
    const winding = new THREE.Mesh(windingGeo, coilMat);
    harvesterGroup.add(winding);
  }

  // Harvester capacitor banks — 12 cylindrical capacitors around the base
  const capacitors = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const capGroup = new THREE.Group();
    capGroup.position.set(Math.cos(angle) * 3.5, -0.5, Math.sin(angle) * 3.5);
    capGroup.lookAt(0, -0.5, 0);

    const capBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16),
      darkSteel
    );
    capBody.rotation.x = Math.PI / 2;
    capGroup.add(capBody);

    // Capacitor terminals
    const terminal1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), copper);
    terminal1.position.set(0, 0, 0.35);
    capGroup.add(terminal1);
    const terminal2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), copper);
    terminal2.position.set(0, 0, -0.35);
    capGroup.add(terminal2);

    // Charge indicator glow
    const chargeGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5, transparent: true, opacity: 0.5 })
    );
    chargeGlow.rotation.x = Math.PI / 2;
    capGroup.add(chargeGlow);

    harvesterGroup.add(capGroup);
    capacitors.push({ group: capGroup, glow: chargeGlow });
  }
  meshes.capacitors = capacitors;

  // ========================================================================
  // 7. LYAPUNOV EXPONENT DISPLAY ARRAY — Vertical indicator columns
  // ========================================================================
  const lyapunovGroup = new THREE.Group();
  lyapunovGroup.position.set(-5.0, 0, 0);
  group.add(lyapunovGroup);
  meshes.lyapunovGroup = lyapunovGroup;

  // Panel backboard
  const backboard = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 4.0, 0.1),
    innerFrame
  );
  lyapunovGroup.add(backboard);

  // Lyapunov exponent bars — 8 vertical indicators
  const lyapBars = [];
  for (let i = 0; i < 8; i++) {
    const barGroup = new THREE.Group();
    barGroup.position.set(-1.0 + i * 0.3, -1.5, 0.06);

    // Bar track
    const track = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 3.0, 0.03),
      darkSteel
    );
    track.position.y = 1.5;
    barGroup.add(track);

    // Moving indicator
    const indicator = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.08, 0.06),
      i < 4 ? neonRed : neonGreen
    );
    indicator.position.y = 1.0 + i * 0.2;
    barGroup.add(indicator);

    // Value label glow
    const labelGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4, transparent: true, opacity: 0.3 })
    );
    labelGlow.position.set(0, 0.1, 0.05);
    barGroup.add(labelGlow);

    lyapunovGroup.add(barGroup);
    lyapBars.push({ group: barGroup, indicator });
  }
  meshes.lyapBars = lyapBars;

  // ========================================================================
  // 8. POINCARÉ SECTION SLICER — Rotating planar cross-section visualizer
  // ========================================================================
  const poincareGroup = new THREE.Group();
  poincareGroup.position.set(5.0, 0, 0);
  group.add(poincareGroup);
  meshes.poincareGroup = poincareGroup;

  // Section plane — translucent disc
  const sectionPlane = new THREE.Mesh(
    new THREE.CircleGeometry(2.0, 64),
    new THREE.MeshStandardMaterial({
      color: 0x00aaff, emissive: 0x0044ff, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.2, side: THREE.DoubleSide
    })
  );
  poincareGroup.add(sectionPlane);
  meshes.sectionPlane = sectionPlane;

  // Section frame ring
  const sectionFrame = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.04, 12, 96),
    neonCyan
  );
  poincareGroup.add(sectionFrame);

  // Poincaré map dots — where attractor pierces the section
  const poincareDotsGroup = new THREE.Group();
  poincareGroup.add(poincareDotsGroup);
  const poincareDots = [];
  for (let i = 0; i < 200; i++) {
    // Simulate Hénon-map-like dots on the section
    const r = Math.sqrt(Math.random()) * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const fractalOffset = Math.sin(i * 0.618 * Math.PI * 2) * 0.3;
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      neonMagenta
    );
    dot.position.set(
      Math.cos(theta) * r * 0.7 + fractalOffset,
      Math.sin(theta) * r * 0.5,
      0.01
    );
    poincareDotsGroup.add(dot);
    poincareDots.push(dot);
  }
  meshes.poincareDots = poincareDots;

  // ========================================================================
  // 9. CHAOS/ORDER TRANSITION GATE — Rotating fractal boundary ring
  // ========================================================================
  const transitionGate = new THREE.Group();
  transitionGate.position.set(0, 0, 4.5);
  group.add(transitionGate);
  meshes.transitionGate = transitionGate;

  // Outer gate ring
  const gateOuter = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.1, 24, 128),
    chrome
  );
  transitionGate.add(gateOuter);
  meshes.gateOuter = gateOuter;

  // Inner gate ring — spins opposite
  const gateInner = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.06, 16, 96),
    copper
  );
  transitionGate.add(gateInner);
  meshes.gateInner = gateInner;

  // Gate plasma fill
  const gatePlasma = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 64),
    chaosPlasma
  );
  transitionGate.add(gatePlasma);
  meshes.gatePlasma = gatePlasma;

  // Chaos/Order boundary particles — fractal distribution on ring
  for (let i = 0; i < 80; i++) {
    const angle = (i / 80) * Math.PI * 2;
    const jitter = Math.sin(i * 5.7) * 0.15;
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 6, 6),
      i % 2 === 0 ? neonCyan : neonRed
    );
    particle.position.set(
      Math.cos(angle) * (1.3 + jitter),
      Math.sin(angle) * (1.3 + jitter),
      0.05
    );
    transitionGate.add(particle);
  }

  // ========================================================================
  // 10. FRACTAL DIMENSION CALCULATOR — Nested self-similar geometry
  // ========================================================================
  const fractalGroup = new THREE.Group();
  fractalGroup.position.set(0, 0, -4.5);
  group.add(fractalGroup);
  meshes.fractalGroup = fractalGroup;

  // Sierpinski-like tetrahedron (3 levels)
  function createSierpinski(depth, size, position) {
    if (depth === 0) {
      const tet = new THREE.Mesh(
        new THREE.TetrahedronGeometry(size, 0),
        neonGold
      );
      tet.position.copy(position);
      fractalGroup.add(tet);
      return;
    }
    const half = size / 2;
    const h = size * Math.sqrt(2 / 3);
    const offsets = [
      new THREE.Vector3(0, h * 0.5, 0),
      new THREE.Vector3(-half, -h * 0.25, -half * 0.5),
      new THREE.Vector3(half, -h * 0.25, -half * 0.5),
      new THREE.Vector3(0, -h * 0.25, half * 0.7)
    ];
    offsets.forEach(off => {
      createSierpinski(depth - 1, half, new THREE.Vector3().addVectors(position, off));
    });
  }
  createSierpinski(3, 1.2, new THREE.Vector3(0, 0, 0));

  // Fractal containment sphere
  const fractalSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x222244, transparent: true, opacity: 0.15, wireframe: true })
  );
  fractalGroup.add(fractalSphere);

  // ========================================================================
  // 11. HYDRAULIC STABILIZER ARMS — 4 articulated arms with pistons
  // ========================================================================
  const stabilizerArms = [];
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const armGroup = new THREE.Group();
    armGroup.position.set(Math.cos(angle) * 3.0, -2.5, Math.sin(angle) * 3.0);
    armGroup.lookAt(0, -2.5, 0);

    // Outer cylinder
    const outerCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16),
      chrome
    );
    outerCyl.rotation.x = Math.PI / 2;
    armGroup.add(outerCyl);

    // Inner piston rod
    const pistonRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12),
      steel
    );
    pistonRod.rotation.x = Math.PI / 2;
    pistonRod.position.z = -0.6;
    armGroup.add(pistonRod);

    // Piston head
    const pistonHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16),
      copper
    );
    pistonHead.rotation.x = Math.PI / 2;
    pistonHead.position.z = -1.2;
    armGroup.add(pistonHead);

    // Mounting bracket
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.06),
      darkSteel
    );
    bracket.position.z = 0.95;
    armGroup.add(bracket);

    // Hydraulic line — tube curving from arm to hull
    const hlPts = [
      new THREE.Vector3(0, 0.1, 0.5),
      new THREE.Vector3(0, 0.3, 0.2),
      new THREE.Vector3(0, 0.4, -0.3),
      new THREE.Vector3(0, 0.15, -0.8)
    ];
    const hlCurve = new THREE.CatmullRomCurve3(hlPts);
    const hlGeo = new THREE.TubeGeometry(hlCurve, 20, 0.02, 8, false);
    const hLine = new THREE.Mesh(hlGeo, rubber);
    armGroup.add(hLine);

    group.add(armGroup);
    stabilizerArms.push({ group: armGroup, pistonRod, pistonHead });
  }
  meshes.stabilizerArms = stabilizerArms;

  // ========================================================================
  // 12. CONTROL CABIN — Detailed operator station with screens & joysticks
  // ========================================================================
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(0, 6.5, 2.0);
  group.add(cabinGroup);
  meshes.cabinGroup = cabinGroup;

  // Cabin body — extruded rounded shape
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-0.8, 0);
  cabinShape.quadraticCurveTo(-0.8, 0.9, -0.4, 1.1);
  cabinShape.lineTo(0.4, 1.1);
  cabinShape.quadraticCurveTo(0.8, 0.9, 0.8, 0);
  cabinShape.lineTo(-0.8, 0);
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 1.0, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  const cabinBody = new THREE.Mesh(cabinGeo, darkSteel);
  cabinBody.position.z = -0.5;
  cabinGroup.add(cabinBody);

  // Tinted windshield
  const windshield = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.7),
    tinted
  );
  windshield.position.set(0, 0.75, 0.56);
  cabinGroup.add(windshield);

  // Control panel
  const controlPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.4, 0.08),
    darkSteel
  );
  controlPanel.position.set(0, 0.3, 0.3);
  controlPanel.rotation.x = -0.3;
  cabinGroup.add(controlPanel);

  // Control panel screens — 3 glowing mini screens
  for (let s = 0; s < 3; s++) {
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.2),
      new THREE.MeshStandardMaterial({
        color: [0x00ff88, 0x00aaff, 0xff8800][s],
        emissive: [0x00ff88, 0x00aaff, 0xff8800][s],
        emissiveIntensity: 0.8
      })
    );
    screen.position.set(-0.35 + s * 0.35, 0.35, 0.35);
    screen.rotation.x = -0.3;
    cabinGroup.add(screen);
  }

  // Joysticks — 2 control sticks
  for (let j = 0; j < 2; j++) {
    const stickBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.03, 12),
      darkSteel
    );
    stickBase.position.set(-0.25 + j * 0.5, 0.12, 0.4);
    cabinGroup.add(stickBase);

    const stick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.02, 0.18, 8),
      chrome
    );
    stick.position.set(-0.25 + j * 0.5, 0.22, 0.4);
    cabinGroup.add(stick);

    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      rubber
    );
    knob.position.set(-0.25 + j * 0.5, 0.32, 0.4);
    cabinGroup.add(knob);
  }

  // Operator chair
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.06, 0.35),
    plastic
  );
  chairSeat.position.set(0, 0.1, -0.1);
  cabinGroup.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.5, 0.06),
    plastic
  );
  chairBack.position.set(0, 0.35, -0.3);
  cabinGroup.add(chairBack);

  // ========================================================================
  // 13. EXHAUST MANIFOLD / ENTROPY DISSIPATOR — Rear-mounted heat stacks
  // ========================================================================
  const exhaustGroup = new THREE.Group();
  exhaustGroup.position.set(0, -2.0, -4.0);
  group.add(exhaustGroup);
  meshes.exhaustGroup = exhaustGroup;

  for (let e = 0; e < 4; e++) {
    const stackGroup = new THREE.Group();
    stackGroup.position.set(-0.6 + e * 0.4, 0, 0);

    // Main stack
    const stackProfile = [];
    stackProfile.push(new THREE.Vector2(0.08, 0));
    stackProfile.push(new THREE.Vector2(0.1, 0.3));
    stackProfile.push(new THREE.Vector2(0.07, 0.8));
    stackProfile.push(new THREE.Vector2(0.09, 1.2));
    stackProfile.push(new THREE.Vector2(0.12, 1.5));
    stackProfile.push(new THREE.Vector2(0.06, 1.8));
    const stackGeo = new THREE.LatheGeometry(stackProfile, 24);
    const stack = new THREE.Mesh(stackGeo, darkSteel);
    stackGroup.add(stack);

    // Heat rings
    for (let r = 0; r < 5; r++) {
      const heatRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.012, 8, 24),
        neonRed
      );
      heatRing.position.y = 0.3 + r * 0.35;
      heatRing.rotation.x = Math.PI / 2;
      stackGroup.add(heatRing);
    }

    // Smoke particle emitter point
    const smokeEmitter = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.5, transparent: true, opacity: 0.4 })
    );
    smokeEmitter.position.y = 1.85;
    stackGroup.add(smokeEmitter);

    exhaustGroup.add(stackGroup);
  }

  // ========================================================================
  // 14. SENSITIVITY ENGINE CORE — Central strange attractor amplifier
  // ========================================================================
  const sensitivityCore = new THREE.Group();
  sensitivityCore.position.y = 0;
  group.add(sensitivityCore);
  meshes.sensitivityCore = sensitivityCore;

  // Nested rotating dodecahedra
  const dodecaOuter = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.0, 0),
    new THREE.MeshStandardMaterial({ color: 0x222244, metalness: 0.8, roughness: 0.2, wireframe: true })
  );
  sensitivityCore.add(dodecaOuter);
  meshes.dodecaOuter = dodecaOuter;

  const dodecaMid = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.7, 0),
    new THREE.MeshStandardMaterial({ color: 0x4444aa, metalness: 0.7, roughness: 0.3, wireframe: true })
  );
  sensitivityCore.add(dodecaMid);
  meshes.dodecaMid = dodecaMid;

  const dodecaInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 1),
    chaosPlasma
  );
  sensitivityCore.add(dodecaInner);
  meshes.dodecaInner = dodecaInner;

  // ========================================================================
  // 15. FEIGENBAUM CASCADE RINGS — Period-doubling visualization
  // ========================================================================
  const feigenbaumGroup = new THREE.Group();
  feigenbaumGroup.position.set(0, -5.5, 0);
  group.add(feigenbaumGroup);
  meshes.feigenbaumGroup = feigenbaumGroup;

  // Period-1, period-2, period-4, period-8 rings
  const periods = [1, 2, 4, 8];
  const feigRings = [];
  periods.forEach((p, idx) => {
    const ringRadius = 1.0 + idx * 0.5;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 0.03, 12, 96),
      [neonCyan, neonGold, neonMagenta, neonGreen][idx]
    );
    ring.rotation.x = Math.PI / 2;
    feigenbaumGroup.add(ring);
    feigRings.push(ring);

    // Orbiting nodes for each period
    for (let n = 0; n < p; n++) {
      const nodeAngle = (n / p) * Math.PI * 2;
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        [neonCyan, neonGold, neonMagenta, neonGreen][idx]
      );
      node.position.set(Math.cos(nodeAngle) * ringRadius, 0, Math.sin(nodeAngle) * ringRadius);
      feigenbaumGroup.add(node);
    }
  });
  meshes.feigRings = feigRings;

  // ========================================================================
  // 16. STRUCTURAL SUPPORT LATTICE — Connecting web of struts
  // ========================================================================
  function createStrut(from, to, radius, mat) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, len, 8),
      mat
    );
    strut.position.copy(mid);
    strut.lookAt(to);
    strut.rotateX(Math.PI / 2);
    group.add(strut);
  }

  // Connect major subsystems with structural struts
  const strutConnections = [
    [new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(2.5, 5.0, 0)],
    [new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(-2.5, 5.0, 0)],
    [new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0, -5.5, 0)],
    [new THREE.Vector3(2.0, 0, 0), new THREE.Vector3(5.0, 0, 0)],
    [new THREE.Vector3(-2.0, 0, 0), new THREE.Vector3(-5.0, 0, 0)],
    [new THREE.Vector3(0, 0, 2.2), new THREE.Vector3(0, 0, 4.5)],
    [new THREE.Vector3(0, 0, -2.2), new THREE.Vector3(0, 0, -4.5)],
    [new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(0, 6.5, 2.0)],
    [new THREE.Vector3(0, -2.0, 0), new THREE.Vector3(0, -2.0, -4.0)],
  ];
  strutConnections.forEach(([a, b]) => createStrut(a, b, 0.03, innerFrame));

  // ========================================================================
  // 17. DECORATIVE ACCENT DETAILS — Ladders, handles, warning stripes
  // ========================================================================
  // Access ladder from ground to cabin
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(0.6, 3.5, 2.2);
  group.add(ladderGroup);

  // Ladder rails
  for (let lr = 0; lr < 2; lr++) {
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 3.5, 8),
      aluminum
    );
    rail.position.x = -0.12 + lr * 0.24;
    ladderGroup.add(rail);
  }

  // Ladder rungs
  for (let rung = 0; rung < 10; rung++) {
    const r = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.24, 8),
      aluminum
    );
    r.rotation.z = Math.PI / 2;
    r.position.y = -1.5 + rung * 0.35;
    ladderGroup.add(r);
  }

  // Warning stripes around hull base — alternating yellow/black
  for (let ws = 0; ws < 16; ws++) {
    const wAngle = (ws / 16) * Math.PI * 2;
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.12, 0.02),
      new THREE.MeshStandardMaterial({ color: ws % 2 === 0 ? 0xffcc00 : 0x111111 })
    );
    stripe.position.set(
      Math.cos(wAngle) * 4.22,
      -3.0,
      Math.sin(wAngle) * 4.22
    );
    stripe.lookAt(0, -3.0, 0);
    group.add(stripe);
  }

  // ========================================================================
  // 18. FLOWING DATA CONDUITS — Tube lines connecting subsystems
  // ========================================================================
  const conduitPaths = [
    // Lorenz to Harvester
    [new THREE.Vector3(0, -0.5, 1.5), new THREE.Vector3(0.5, -1.0, 2.0), new THREE.Vector3(1.5, -1.5, 2.5), new THREE.Vector3(2.8, -1.5, 2.8)],
    // Rössler to Bifurcation
    [new THREE.Vector3(1.0, 3.5, 0), new THREE.Vector3(1.5, 4.0, 0), new THREE.Vector3(1.8, 4.5, 0), new THREE.Vector3(1.8, 5.0, 0)],
    // Core to Poincaré
    [new THREE.Vector3(1.5, 0, 0), new THREE.Vector3(2.5, 0.5, 0.5), new THREE.Vector3(3.5, 0.2, 0.2), new THREE.Vector3(5.0, 0, 0)],
    // Core to Lyapunov
    [new THREE.Vector3(-1.5, 0, 0), new THREE.Vector3(-2.5, 0.3, -0.3), new THREE.Vector3(-3.5, -0.2, -0.2), new THREE.Vector3(-5.0, 0, 0)],
  ];
  const conduitMats = [neonCyan, neonGold, neonMagenta, neonGreen];
  conduitPaths.forEach((pts, idx) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 40, 0.02, 8, false);
    const conduit = new THREE.Mesh(geo, conduitMats[idx]);
    group.add(conduit);
  });

  // ========================================================================
  // PARTS DEFINITION — 18+ detailed parts
  // ========================================================================
  const parts = [
    { name: 'Primary Containment Hull', description: 'Lathe-profiled toroidal dark-matter hull housing all chaos subsystems with 96 rivets and 24 luminous panel lines.', material: 'Neutronium-carbide composite', function: 'Structural containment and EM shielding of chaotic field fluctuations', assemblyOrder: 1, connections: ['Lorenz Attractor Chamber', 'Chaos Energy Harvester'], failureEffect: 'Total system breach — chaotic field escapes containment', cascadeFailures: ['Lorenz Attractor Chamber', 'Rössler Attractor Ring'], originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 0, y: -6, z: 0 } },
    { name: 'Lorenz Attractor Chamber', description: 'Translucent sphere containing the primary Lorenz butterfly trajectory with 8000 integration steps and 120 particle nodes.', material: 'Phase-locked crystal with quantum-coherent dopants', function: 'Generates the primary strange attractor trajectory for energy extraction', assemblyOrder: 2, connections: ['Primary Containment Hull', 'Sensitivity Engine Core'], failureEffect: 'Loss of primary attractor — system falls to fixed point equilibrium', cascadeFailures: ['Sensitivity Engine Core', 'Phase Space Navigator'], originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -4, y: 2, z: 0 } },
    { name: 'Rössler Attractor Ring', description: 'Secondary spiral attractor trajectory with 6000-step integration contained within a chrome toroidal boundary.', material: 'Topological insulator substrate', function: 'Generates auxiliary attractor for cross-coupled chaos amplification', assemblyOrder: 3, connections: ['Bifurcation Controller', 'Lorenz Attractor Chamber'], failureEffect: 'Loss of secondary attractor degrades energy output by 60%', cascadeFailures: ['Bifurcation Controller'], originalPosition: { x: 0, y: 3.5, z: 0 }, explodedPosition: { x: 0, y: 9, z: 0 } },
    { name: 'Phase Space Navigator', description: 'Triple-axis gimbal system with icosahedral plotting head and RGB coordinate indicator rods.', material: 'Beryllium-copper precision bearings', function: 'Real-time 3D visualization and tracking of system state in phase space', assemblyOrder: 4, connections: ['Lorenz Attractor Chamber', 'Lyapunov Exponent Display'], failureEffect: 'Operator loses situational awareness of chaotic state trajectory', cascadeFailures: ['Control Cabin'], originalPosition: { x: 0, y: -3.8, z: 0 }, explodedPosition: { x: 0, y: -9, z: 0 } },
    { name: 'Bifurcation Controller', description: 'Hexagonal platform with 6 rotary parameter columns, copper dials, neon indicators, and holographic bifurcation display.', material: 'Precision servo-actuated chromium-vanadium alloy', function: 'Adjusts control parameters (σ, ρ, β) to navigate through bifurcation cascades', assemblyOrder: 5, connections: ['Rössler Attractor Ring', 'Feigenbaum Cascade Rings'], failureEffect: 'System locks to single parameter regime — no bifurcation control', cascadeFailures: ['Feigenbaum Cascade Rings', 'Chaos/Order Transition Gate'], originalPosition: { x: 0, y: 5, z: 0 }, explodedPosition: { x: 4, y: 10, z: 0 } },
    { name: 'Chaos Energy Harvester', description: 'Triple-wound toroidal energy collection coils with 12 capacitor banks and charge-glow indicators.', material: 'High-temperature superconducting Nb₃Sn wire', function: 'Extracts usable energy from sensitivity to initial conditions via flux coupling', assemblyOrder: 6, connections: ['Primary Containment Hull', 'Sensitivity Engine Core'], failureEffect: 'Energy output drops to zero — chaos continues but unharvestable', cascadeFailures: ['Capacitor Banks'], originalPosition: { x: 0, y: -1.5, z: 0 }, explodedPosition: { x: -5, y: -4, z: 0 } },
    { name: 'Lyapunov Exponent Display', description: '8-bar vertical indicator array showing positive/negative Lyapunov exponents with glow labels.', material: 'OLED-embedded titanium panel', function: 'Real-time monitoring of all Lyapunov exponents to verify chaotic regime', assemblyOrder: 7, connections: ['Phase Space Navigator', 'Sensitivity Engine Core'], failureEffect: 'No exponent readout — operator cannot verify chaos vs order', cascadeFailures: ['Control Cabin'], originalPosition: { x: -5, y: 0, z: 0 }, explodedPosition: { x: -10, y: 0, z: 0 } },
    { name: 'Poincaré Section Slicer', description: 'Rotating translucent disc with 200 fractal-distributed intersection dots and neon frame ring.', material: 'Optically flat synthetic sapphire', function: 'Cross-sectional visualization revealing attractor topology and periodicity', assemblyOrder: 8, connections: ['Lorenz Attractor Chamber', 'Fractal Dimension Calculator'], failureEffect: 'Loss of topological analysis — cannot identify attractor type', cascadeFailures: ['Fractal Dimension Calculator'], originalPosition: { x: 5, y: 0, z: 0 }, explodedPosition: { x: 10, y: 0, z: 0 } },
    { name: 'Chaos/Order Transition Gate', description: 'Dual counter-rotating torus rings with plasma core and 80 boundary particles.', material: 'Magnetically confined plasma in chrome-copper frame', function: 'Controls transition between chaotic and periodic operational modes', assemblyOrder: 9, connections: ['Bifurcation Controller', 'Sensitivity Engine Core'], failureEffect: 'System stuck in one mode — cannot switch between chaos and order', cascadeFailures: ['Sensitivity Engine Core', 'Bifurcation Controller'], originalPosition: { x: 0, y: 0, z: 4.5 }, explodedPosition: { x: 0, y: 0, z: 10 } },
    { name: 'Fractal Dimension Calculator', description: '3-level Sierpinski tetrahedron fractal geometry inside wireframe containment sphere.', material: 'Self-similar metamaterial lattice', function: 'Computes Hausdorff and correlation dimensions of the active attractor', assemblyOrder: 10, connections: ['Poincaré Section Slicer', 'Lyapunov Exponent Display'], failureEffect: 'Dimension calculation fails — cannot characterize attractor complexity', cascadeFailures: ['Poincaré Section Slicer'], originalPosition: { x: 0, y: 0, z: -4.5 }, explodedPosition: { x: 0, y: 0, z: -10 } },
    { name: 'Hydraulic Stabilizer Arms', description: '4 articulated piston assemblies with chrome cylinders, steel rods, copper heads, and rubber hydraulic lines.', material: 'Hardened steel pistons with chrome-plated cylinders', function: 'Dampens mechanical vibrations induced by chaotic field oscillations', assemblyOrder: 11, connections: ['Primary Containment Hull'], failureEffect: 'Resonance build-up from un-dampened chaotic oscillations', cascadeFailures: ['Primary Containment Hull'], originalPosition: { x: 0, y: -2.5, z: 0 }, explodedPosition: { x: 0, y: -7, z: 5 } },
    { name: 'Control Cabin', description: 'Extruded operator station with tinted windshield, 3 glowing screens, 2 joysticks, and ergonomic chair.', material: 'Reinforced composite with EMI shielding', function: 'Human-machine interface for chaos drive operation and monitoring', assemblyOrder: 12, connections: ['Bifurcation Controller', 'Lyapunov Exponent Display'], failureEffect: 'Loss of operator control — system runs on autonomous backup', cascadeFailures: ['Bifurcation Controller'], originalPosition: { x: 0, y: 6.5, z: 2 }, explodedPosition: { x: 0, y: 12, z: 4 } },
    { name: 'Entropy Dissipator Stacks', description: '4 lathe-profiled exhaust stacks with heat rings and smoke emitters for entropy rejection.', material: 'Refractory tungsten-rhenium alloy', function: 'Dissipates excess entropy generated by chaos energy extraction', assemblyOrder: 13, connections: ['Chaos Energy Harvester'], failureEffect: 'Entropy accumulation causes thermal runaway', cascadeFailures: ['Chaos Energy Harvester', 'Primary Containment Hull'], originalPosition: { x: 0, y: -2, z: -4 }, explodedPosition: { x: 0, y: -5, z: -9 } },
    { name: 'Sensitivity Engine Core', description: 'Nested rotating dodecahedra (wireframe) with central icosahedral chaos-plasma amplifier.', material: 'Quantum-entangled crystalline matrix', function: 'Amplifies butterfly-effect sensitivity for maximum energy extraction', assemblyOrder: 14, connections: ['Lorenz Attractor Chamber', 'Chaos Energy Harvester'], failureEffect: 'Sensitivity drops — system becomes predictable and non-chaotic', cascadeFailures: ['Chaos Energy Harvester', 'Lorenz Attractor Chamber'], originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: 5, y: 5, z: 5 } },
    { name: 'Feigenbaum Cascade Rings', description: 'Period-1/2/4/8 concentric torus rings with orbiting nodes demonstrating period-doubling route to chaos.', material: 'Topologically protected conductor rings', function: 'Visualizes and controls the period-doubling cascade (Feigenbaum scenario)', assemblyOrder: 15, connections: ['Bifurcation Controller'], failureEffect: 'Period-doubling sequence breaks — chaotic regime unreachable', cascadeFailures: ['Bifurcation Controller', 'Chaos/Order Transition Gate'], originalPosition: { x: 0, y: -5.5, z: 0 }, explodedPosition: { x: 6, y: -8, z: 0 } },
    { name: 'Data Conduit Network', description: '4 neon-colored tube conduits connecting Lorenz, Rössler, Poincaré, and Lyapunov subsystems.', material: 'Fiber-optic superconducting hybrid cables', function: 'High-bandwidth data and energy transfer between chaos subsystems', assemblyOrder: 16, connections: ['Lorenz Attractor Chamber', 'Rössler Attractor Ring', 'Poincaré Section Slicer', 'Lyapunov Exponent Display'], failureEffect: 'Subsystem isolation — modules cannot synchronize', cascadeFailures: ['Phase Space Navigator'], originalPosition: { x: 0, y: 0, z: 0 }, explodedPosition: { x: -3, y: 3, z: 3 } },
    { name: 'Bifurcation Diagram Display', description: 'Holographic cylinder containing 2400 logistic-map points visualizing the bifurcation diagram.', material: 'Volumetric photonic crystal display', function: 'Real-time visualization of parameter-dependent bifurcation structure', assemblyOrder: 17, connections: ['Bifurcation Controller'], failureEffect: 'Operator loses bifurcation map — blind parameter adjustment', cascadeFailures: ['Bifurcation Controller'], originalPosition: { x: 0, y: 6.3, z: 0 }, explodedPosition: { x: -4, y: 11, z: 0 } },
    { name: 'Capacitor Banks', description: '12 radially-arranged cylindrical capacitors with copper terminals and charge-glow indicators.', material: 'Ceramic-dielectric supercapacitor cells', function: 'Buffer energy harvested from chaotic fluctuations for steady output', assemblyOrder: 18, connections: ['Chaos Energy Harvester', 'Entropy Dissipator Stacks'], failureEffect: 'Energy output becomes wildly fluctuating — unusable downstream', cascadeFailures: ['Entropy Dissipator Stacks'], originalPosition: { x: 0, y: -1.5, z: 0 }, explodedPosition: { x: 7, y: -3, z: 0 } },
  ];

  // ========================================================================
  // QUIZ QUESTIONS — 5 PhD-level dynamical systems questions
  // ========================================================================
  const quizQuestions = [
    {
      question: 'The maximal Lyapunov exponent of the Lorenz system (σ=10, ρ=28, β=8/3) is approximately λ₁ ≈ 0.906. What is the physical significance of a positive maximal Lyapunov exponent, and how does the Kaplan-Yorke dimension D_KY relate to the full Lyapunov spectrum (λ₁, λ₂, λ₃) of this system?',
      options: [
        'A positive λ₁ means exponential divergence of nearby trajectories; D_KY = j + Σᵢ₌₁ʲ λᵢ/|λⱼ₊₁| where j is the largest integer with non-negative partial sum — yielding D_KY ≈ 2.06 for Lorenz',
        'A positive λ₁ means the system is periodic; D_KY equals the topological dimension exactly 3',
        'A positive λ₁ indicates stable fixed points; D_KY is always an integer for strange attractors',
        'A positive λ₁ means energy is conserved; D_KY = λ₁ + λ₂ + λ₃ directly'
      ],
      correctAnswer: 0,
      explanation: 'A positive maximal Lyapunov exponent λ₁ > 0 implies sensitive dependence on initial conditions — the hallmark of chaos. The Kaplan-Yorke dimension is D_KY = j + (1/|λⱼ₊₁|)Σᵢ₌₁ʲ λᵢ, where j is the largest index such that the cumulative sum of exponents is non-negative. For Lorenz (λ₁≈0.906, λ₂=0, λ₃≈−14.57), D_KY ≈ 2 + 0.906/14.57 ≈ 2.062, confirming the attractor is a fractal of dimension slightly above 2.'
    },
    {
      question: 'The Feigenbaum constant δ ≈ 4.6692 describes the rate of convergence of bifurcation parameter intervals in period-doubling cascades. Why is this constant universal, and what class of maps does it apply to?',
      options: [
        'It applies only to the logistic map and is not universal',
        'It is universal across all unimodal maps with a quadratic maximum due to the functional renormalization group fixed point of the period-doubling operator T',
        'It applies only to Hamiltonian systems with KAM tori',
        'It is universal because all chaotic systems have the same Lyapunov exponent'
      ],
      correctAnswer: 1,
      explanation: 'Feigenbaum universality arises because the period-doubling renormalization operator T has a fixed point g* with a single unstable eigenvalue δ ≈ 4.6692. Any unimodal map with a quadratic maximum is attracted to this fixed point under renormalization, making the bifurcation ratios converge to δ regardless of the specific map. This is a triumph of the renormalization group approach in nonlinear dynamics.'
    },
    {
      question: 'A Poincaré section of the Lorenz attractor taken at z = 27 (near the unstable fixed points C±) reveals a structure topologically equivalent to which classical chaotic map?',
      options: [
        'The Arnold cat map on a torus',
        'The Chirikov standard map',
        'A cusp map equivalent to the Hénon map (a 2D dissipative map with a strange attractor)',
        'The baker\'s map with uniform stretching'
      ],
      correctAnswer: 2,
      explanation: 'The first-return map of the Lorenz attractor on an appropriate Poincaré section is topologically conjugate to a 1D unimodal map (approximately), and in 2D the section reveals a structure closely related to the Hénon map — a quadratic dissipative map with folding. This connection was established by Hénon specifically as a simplified model capturing the essential topology of the Lorenz attractor\'s cross-section.'
    },
    {
      question: 'In the Rössler attractor (a=0.2, b=0.2, c=5.7), the system exhibits a "screw-type" chaos. As parameter c increases past ~4.2, the system transitions through a period-doubling cascade. What topological mechanism distinguishes the Rössler attractor from the Lorenz attractor?',
      options: [
        'The Rössler attractor is a torus while Lorenz is a sphere',
        'Rössler has a single folding mechanism (one scroll) creating a band-like attractor, while Lorenz has a symmetric pair of scrolls connected by a global bifurcation (homoclinic connection to the origin)',
        'Both are topologically identical — they are homeomorphic',
        'Rössler is 4-dimensional while Lorenz is 3-dimensional'
      ],
      correctAnswer: 1,
      explanation: 'The Rössler attractor possesses a single folding region producing a band-like (single scroll) strange attractor with stretching and folding in one lobe. The Lorenz attractor has a pair of symmetric scrolls connected by trajectories passing near the unstable origin (a homoclinic/heteroclinic structure). This topological difference — single-scroll vs double-scroll with Z₂ symmetry — is fundamental and is reflected in their distinct template (branched manifold) structures.'
    },
    {
      question: 'The correlation dimension D₂ of the Lorenz attractor can be estimated from a scalar time series using the Grassberger-Procaccia algorithm. What is the key mathematical relationship used, and what embedding theorem justifies reconstructing the attractor from a single variable?',
      options: [
        'D₂ = lim_{ε→0} [log C(ε) / log ε] where C(ε) is the correlation integral; Takens\' embedding theorem guarantees that a delay-coordinate embedding in ℝᵐ with m > 2D₂ preserves the attractor topology',
        'D₂ equals the box-counting dimension exactly; no embedding is needed',
        'D₂ is computed from the power spectrum; the Nyquist theorem justifies reconstruction',
        'D₂ = log(N)/log(1/ε) for N data points; the central limit theorem justifies the approach'
      ],
      correctAnswer: 0,
      explanation: 'The Grassberger-Procaccia algorithm estimates D₂ via the scaling of the correlation integral C(ε) ~ ε^D₂ as ε → 0, where C(ε) = lim_{N→∞} (2/N(N−1)) Σᵢ<ⱼ Θ(ε − ‖xᵢ − xⱼ‖). Takens\' embedding theorem (1981) proves that if the attractor has dimension d, then a delay-coordinate embedding in ℝᵐ with m ≥ 2d+1 yields a diffeomorphic copy of the original attractor, preserving all topological and metric invariants including D₂.'
    }
  ];

  // ========================================================================
  // DESCRIPTION
  // ========================================================================
  const description = `The Strange Attractor Chaos Drive is an ultra-advanced propulsion system that exploits deterministic chaos and strange attractors to extract energy from sensitivity to initial conditions. At its core, a Lorenz Attractor Chamber generates the iconic butterfly-shaped trajectory (σ=10, ρ=28, β=8/3) with 8000 integration steps, while a secondary Rössler Attractor Ring (a=0.2, b=0.2, c=5.7) provides cross-coupled chaos amplification. The Phase Space Navigator uses a triple-axis gimbal with an icosahedral plotting head to track the system state in real time. Six Bifurcation Controller columns with copper dials adjust system parameters to navigate period-doubling cascades visualized by the Feigenbaum Cascade Rings (period 1→2→4→8). Energy is harvested by triple-wound superconducting coils and buffered in 12 capacitor banks. A Poincaré Section Slicer reveals the attractor's cross-sectional topology, while the Lyapunov Exponent Display monitors all exponents to verify chaotic operation. The Chaos/Order Transition Gate enables controlled switching between regimes, and the Fractal Dimension Calculator (3-level Sierpinski geometry) computes Hausdorff dimensions in real time. Four Entropy Dissipator stacks reject excess entropy, and hydraulic stabilizers dampen chaotic vibrations.`;

  // ========================================================================
  // ANIMATE — Extreme synchronized animation
  // ========================================================================
  function animate(time, speed) {
    const t = time * speed;

    // 1. Hull slow rotation
    if (meshes.hull) {
      meshes.hull.rotation.y = t * 0.05;
    }

    // 2. Lorenz trajectory breathing & slow rotation
    if (meshes.lorenzTrajectory) {
      meshes.lorenzTrajectory.rotation.y = t * 0.08;
      meshes.lorenzTrajectory.scale.setScalar(1.0 + Math.sin(t * 0.3) * 0.05);
    }

    // 3. Lorenz particle nodes — orbiting and pulsing
    if (meshes.lorenzNodes) {
      meshes.lorenzNodes.forEach((node, i) => {
        const phase = i * 0.12 + t;
        node.scale.setScalar(0.8 + Math.sin(phase * 2) * 0.5);
        node.material.emissiveIntensity = 0.8 + Math.sin(phase * 3) * 0.6;
        // Slight positional oscillation along trajectory
        const offset = Math.sin(phase) * 0.02;
        node.position.y += Math.sin(t + i) * 0.001;
      });
    }

    // 4. Rössler trajectory rotation (opposite direction)
    if (meshes.rosslerTrajectory) {
      meshes.rosslerTrajectory.rotation.y = -t * 0.12;
    }

    // 5. Phase Space Navigator — gimbal rotations
    if (meshes.outerGimbal) meshes.outerGimbal.rotation.z = Math.sin(t * 0.4) * 0.6;
    if (meshes.midGimbal) meshes.midGimbal.rotation.x = Math.PI / 2 + Math.sin(t * 0.55) * 0.5;
    if (meshes.innerGimbal) meshes.innerGimbal.rotation.y = Math.sin(t * 0.7) * 0.8;
    if (meshes.phaseCore) {
      meshes.phaseCore.rotation.x = t * 1.2;
      meshes.phaseCore.rotation.y = t * 0.8;
      meshes.phaseCore.material.emissiveIntensity = 1.0 + Math.sin(t * 2) * 0.6;
    }

    // 6. Bifurcation columns — dials spinning, glow pulsing
    if (meshes.bifurcColumns) {
      meshes.bifurcColumns.forEach((col, i) => {
        col.dial.rotation.y = t * (0.5 + i * 0.15);
        col.glowRing.material.emissiveIntensity = 0.6 + Math.sin(t * 2 + i * 1.05) * 0.6;
      });
    }

    // 7. Bifurcation display rotation
    if (meshes.bifurcDisplay) {
      meshes.bifurcDisplay.rotation.y = t * 0.15;
    }
    if (meshes.bifurcDiagramGroup) {
      meshes.bifurcDiagramGroup.rotation.y = t * 0.15;
    }

    // 8. Capacitor charge glow pulsing
    if (meshes.capacitors) {
      meshes.capacitors.forEach((cap, i) => {
        const charge = 0.5 + Math.sin(t * 1.5 + i * 0.524) * 0.5;
        cap.glow.material.emissiveIntensity = charge * 1.2;
        cap.glow.material.opacity = 0.2 + charge * 0.5;
      });
    }

    // 9. Lyapunov bars — indicators bouncing chaotically
    if (meshes.lyapBars) {
      meshes.lyapBars.forEach((bar, i) => {
        // Pseudo-chaotic motion using multiple incommensurate frequencies
        const chaotic = Math.sin(t * 1.1 + i * 2.1) * Math.cos(t * 0.73 + i * 1.7) + Math.sin(t * 2.97 + i * 0.3);
        bar.indicator.position.y = 1.5 + chaotic * 0.6;
      });
    }

    // 10. Poincaré section — slow rotation to show different cross-sections
    if (meshes.poincareGroup) {
      meshes.poincareGroup.rotation.y = t * 0.2;
      meshes.poincareGroup.rotation.x = Math.sin(t * 0.15) * 0.3;
    }
    if (meshes.poincareDots) {
      meshes.poincareDots.forEach((dot, i) => {
        dot.material.emissiveIntensity = 0.5 + Math.sin(t * 3 + i * 0.2) * 0.8;
      });
    }

    // 11. Transition gate — counter-rotating rings, plasma pulsing
    if (meshes.gateOuter) meshes.gateOuter.rotation.z = t * 0.6;
    if (meshes.gateInner) meshes.gateInner.rotation.z = -t * 0.9;
    if (meshes.gatePlasma) {
      meshes.gatePlasma.material.emissiveIntensity = 1.0 + Math.sin(t * 4) * 0.6;
      meshes.gatePlasma.material.opacity = 0.4 + Math.sin(t * 2.5) * 0.3;
    }
    if (meshes.transitionGate) {
      meshes.transitionGate.rotation.y = Math.sin(t * 0.3) * 0.2;
    }

    // 12. Fractal group — slow tumbling
    if (meshes.fractalGroup) {
      meshes.fractalGroup.rotation.x = t * 0.12;
      meshes.fractalGroup.rotation.y = t * 0.18;
    }

    // 13. Sensitivity engine core — nested counter-rotations
    if (meshes.dodecaOuter) {
      meshes.dodecaOuter.rotation.x = t * 0.2;
      meshes.dodecaOuter.rotation.y = t * 0.15;
    }
    if (meshes.dodecaMid) {
      meshes.dodecaMid.rotation.x = -t * 0.35;
      meshes.dodecaMid.rotation.z = t * 0.25;
    }
    if (meshes.dodecaInner) {
      meshes.dodecaInner.rotation.y = t * 0.8;
      meshes.dodecaInner.rotation.z = -t * 0.5;
      meshes.dodecaInner.material.emissiveIntensity = 1.2 + Math.sin(t * 5) * 0.4;
    }

    // 14. Stabilizer arm pistons — synchronized breathing
    if (meshes.stabilizerArms) {
      meshes.stabilizerArms.forEach((arm, i) => {
        const extension = Math.sin(t * 1.2 + i * Math.PI / 2) * 0.3;
        arm.pistonRod.position.z = -0.6 + extension;
        arm.pistonHead.position.z = -1.2 + extension;
      });
    }

    // 15. Feigenbaum cascade rings — differential rotation rates matching period ratios
    if (meshes.feigRings) {
      meshes.feigRings.forEach((ring, i) => {
        const period = [1, 2, 4, 8][i];
        ring.rotation.z = t * (0.5 / period);
      });
    }
    if (meshes.feigenbaumGroup) {
      meshes.feigenbaumGroup.rotation.y = t * 0.1;
    }

    // 16. Lorenz chamber breathing
    if (meshes.lorenzChamber) {
      const breathe = 1.0 + Math.sin(t * 0.5) * 0.03;
      meshes.lorenzChamber.scale.setScalar(breathe);
    }

    // 17. Harvester group — slow spin
    if (meshes.harvesterGroup) {
      meshes.harvesterGroup.rotation.y = t * 0.06;
    }

    // 18. Exhaust group subtle vibration
    if (meshes.exhaustGroup) {
      meshes.exhaustGroup.position.x = Math.sin(t * 8) * 0.01;
      meshes.exhaustGroup.position.z = -4.0 + Math.cos(t * 6) * 0.01;
    }

    // 19. Cabin screen glow variation
    if (meshes.cabinGroup) {
      meshes.cabinGroup.rotation.y = Math.sin(t * 0.15) * 0.05;
    }
  }

  // ========================================================================
  // RETURN
  // ========================================================================
  return { group, parts, description, quizQuestions, animate };
}
