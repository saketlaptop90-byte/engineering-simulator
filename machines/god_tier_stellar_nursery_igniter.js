// ============================================================================
// GOD TIER STELLAR NURSERY IGNITER — Ultra Hyper-Realistic THREE.js Model
// A colossal device that triggers star formation by compressing molecular clouds
// Features: Molecular cloud, protostars, compression waves, Jeans collapse,
//           protostellar disks, bipolar jets, igniter cannon, plasma conduits
// ============================================================================

import {
  plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted
} from '../utils/materials.js';

// ---------------------------------------------------------------------------
//  CUSTOM MATERIAL PALETTE — cosmic / high-energy / nebula
// ---------------------------------------------------------------------------
function _mat(color, emissive = 0x000000, emissiveIntensity = 0, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color, emissive, emissiveIntensity,
    metalness: opts.metalness ?? 0.5,
    roughness: opts.roughness ?? 0.4,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    side: opts.side ?? THREE.FrontSide,
    wireframe: opts.wireframe ?? false,
    depthWrite: opts.depthWrite ?? true,
  });
}

function buildMaterials(THREE) {
  return {
    // Nebula / cloud
    darkNebula:       _mat(0x0a0612, 0x1a0a2e, 0.15, { transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }),
    nebulaCore:       _mat(0x1e0830, 0x4b0082, 0.35, { transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }),
    nebulaRim:        _mat(0x120620, 0x8b008b, 0.2,  { transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }),
    dustLane:         _mat(0x050208, 0x0d0015, 0.1,  { transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    // Protostars
    protostarHot:     _mat(0xffe4b5, 0xff6600, 1.8,  { metalness: 0.1, roughness: 0.9 }),
    protostarCool:    _mat(0xff4500, 0xff2200, 1.2,  { metalness: 0.1, roughness: 0.8 }),
    protostarBlue:    _mat(0x87ceeb, 0x00bfff, 2.0,  { metalness: 0.1, roughness: 0.9 }),
    // Accretion disk
    diskHot:          _mat(0xffaa00, 0xff6600, 1.5,  { transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    diskCool:         _mat(0x993300, 0x661100, 0.6,  { transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    // Bipolar jets
    jetPlasma:        _mat(0x00ccff, 0x00aaff, 2.5,  { transparent: true, opacity: 0.65, depthWrite: false }),
    jetCore:          _mat(0xeeeeff, 0x99ddff, 3.0,  { transparent: true, opacity: 0.85 }),
    // Compression wave rings
    compressionRing:  _mat(0x9933ff, 0x7700ff, 1.8,  { transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
    shockFront:       _mat(0xff00ff, 0xcc00cc, 2.2,  { transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }),
    // Igniter cannon
    cannonHull:       _mat(0x1a1a2e, 0x000022, 0.15, { metalness: 0.85, roughness: 0.2 }),
    cannonTrim:       _mat(0x3d3d6b, 0x2222aa, 0.4,  { metalness: 0.9, roughness: 0.15 }),
    cannonGlow:       _mat(0x6a00ff, 0x8800ff, 2.0,  { metalness: 0.3, roughness: 0.5 }),
    cannonCore:       _mat(0xcc88ff, 0xaa66ff, 3.0,  {}),
    // Plasma conduits
    conduitPipe:      _mat(0x222244, 0x110033, 0.2,  { metalness: 0.8, roughness: 0.25 }),
    conduitGlow:      _mat(0x8800ff, 0xaa00ff, 2.0,  { transparent: true, opacity: 0.6 }),
    // Gravitational lens array
    lensFrame:        _mat(0x2a2a4a, 0x111133, 0.3,  { metalness: 0.9, roughness: 0.15 }),
    lensGlass:        _mat(0x4488ff, 0x2266cc, 0.8,  { transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    // Structural
    strutMetal:       _mat(0x333355, 0x0a0a22, 0.1,  { metalness: 0.85, roughness: 0.3 }),
    panelDark:        _mat(0x111122, 0x050510, 0.05, { metalness: 0.7, roughness: 0.35 }),
    rivet:            _mat(0x888899, 0x222233, 0.1,  { metalness: 0.95, roughness: 0.2 }),
    // HII region glow
    hiiGlow:          _mat(0xff3366, 0xff1144, 1.5,  { transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }),
    // Jeans clump
    jeansClump:       _mat(0x1a0a28, 0x330055, 0.5,  { transparent: true, opacity: 0.45 }),
    // Misc
    cableRubber:      _mat(0x111111, 0x000000, 0, { metalness: 0.1, roughness: 0.9 }),
    screenGlow:       _mat(0x00ff88, 0x00ff66, 2.5,  {}),
  };
}

// ---------------------------------------------------------------------------
//  HELPER: Parametric tube curve
// ---------------------------------------------------------------------------
class SpiralCurve extends THREE.Curve {
  constructor(a, b, turns, height) {
    super();
    this.a = a; this.b = b; this.turns = turns; this.height = height;
  }
  getPoint(t) {
    const angle = t * Math.PI * 2 * this.turns;
    const r = this.a + this.b * t;
    return new THREE.Vector3(
      r * Math.cos(angle),
      (t - 0.5) * this.height,
      r * Math.sin(angle)
    );
  }
}

class HelixCurve extends THREE.Curve {
  constructor(radius, height, loops) {
    super();
    this.radius = radius; this.height = height; this.loops = loops;
  }
  getPoint(t) {
    const a = t * Math.PI * 2 * this.loops;
    return new THREE.Vector3(
      this.radius * Math.cos(a),
      (t - 0.5) * this.height,
      this.radius * Math.sin(a)
    );
  }
}

class ArcCurve3D extends THREE.Curve {
  constructor(start, mid, end) {
    super();
    this.start = start; this.mid = mid; this.end = end;
  }
  getPoint(t) {
    const s = 1 - t;
    return new THREE.Vector3(
      s * s * this.start.x + 2 * s * t * this.mid.x + t * t * this.end.x,
      s * s * this.start.y + 2 * s * t * this.mid.y + t * t * this.end.y,
      s * s * this.start.z + 2 * s * t * this.mid.z + t * t * this.end.z,
    );
  }
}

// ===========================================================================
//  MAIN EXPORT
// ===========================================================================
export function createMachine(THREE) {
  const M = buildMaterials(THREE);
  const group = new THREE.Group();
  const meshes = {};

  // -------------------------------------------------------------------------
  //  1. MOLECULAR CLOUD (dark nebula) — layered icosahedron shells
  // -------------------------------------------------------------------------
  const cloudGroup = new THREE.Group();
  const cloudLayers = [];
  const layerCount = 7;
  for (let i = 0; i < layerCount; i++) {
    const radius = 10 + i * 3.5;
    const detail = Math.max(1, 3 - Math.floor(i / 2));
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    // Perturb vertices for organic look
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const nx = pos.getX(v), ny = pos.getY(v), nz = pos.getZ(v);
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const noise = 1 + 0.18 * Math.sin(nx * 2.3 + i) * Math.cos(nz * 1.7 + i) * Math.sin(ny * 3.1);
      pos.setXYZ(v, nx * noise, ny * noise, nz * noise);
    }
    geo.computeVertexNormals();
    const mat = i < 2 ? M.nebulaCore.clone() : (i < 5 ? M.darkNebula.clone() : M.nebulaRim.clone());
    mat.opacity = 0.06 + 0.04 * (layerCount - i) / layerCount;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(i * 0.4, i * 0.7, i * 0.3);
    cloudGroup.add(mesh);
    cloudLayers.push(mesh);
  }
  // Dust lanes — flattened tori cutting through the cloud
  for (let d = 0; d < 5; d++) {
    const dustGeo = new THREE.TorusGeometry(12 + d * 2.5, 1.2 + d * 0.3, 8, 32);
    const dust = new THREE.Mesh(dustGeo, M.dustLane.clone());
    dust.rotation.set(d * 0.6, d * 1.1, d * 0.3);
    cloudGroup.add(dust);
  }
  cloudGroup.position.set(18, 0, 0);
  group.add(cloudGroup);
  meshes.cloud = cloudGroup;
  meshes.cloudLayers = cloudLayers;

  // -------------------------------------------------------------------------
  //  2. EMBEDDED PROTOSTARS — glowing cores inside the cloud
  // -------------------------------------------------------------------------
  const protostarGroup = new THREE.Group();
  const protostarData = [
    { pos: [20, 2, 1],   r: 0.6,  mat: M.protostarHot },
    { pos: [16, -3, 3],  r: 0.45, mat: M.protostarCool },
    { pos: [22, 1, -4],  r: 0.55, mat: M.protostarBlue },
    { pos: [14, 4, -1],  r: 0.35, mat: M.protostarCool },
    { pos: [25, -1, 2],  r: 0.7,  mat: M.protostarHot },
    { pos: [19, -4, -3], r: 0.5,  mat: M.protostarBlue },
    { pos: [17, 3, 5],   r: 0.4,  mat: M.protostarHot },
    { pos: [23, -2, -5], r: 0.38, mat: M.protostarCool },
  ];
  const protostars = [];
  protostarData.forEach((ps, idx) => {
    const coreGeo = new THREE.SphereGeometry(ps.r, 24, 24);
    const core = new THREE.Mesh(coreGeo, ps.mat.clone());
    core.position.set(...ps.pos);
    // Surrounding glow halo
    const haloGeo = new THREE.SphereGeometry(ps.r * 2.8, 16, 16);
    const haloMat = M.hiiGlow.clone();
    haloMat.opacity = 0.12;
    const halo = new THREE.Mesh(haloGeo, haloMat);
    core.add(halo);
    // Inner accretion envelope
    const envGeo = new THREE.SphereGeometry(ps.r * 1.6, 12, 12);
    const envMat = M.diskHot.clone();
    envMat.opacity = 0.18;
    const env = new THREE.Mesh(envGeo, envMat);
    core.add(env);
    protostarGroup.add(core);
    protostars.push(core);
  });
  group.add(protostarGroup);
  meshes.protostars = protostars;

  // -------------------------------------------------------------------------
  //  3. PROTOSTELLAR ACCRETION DISKS — detailed torus + ring geometry
  // -------------------------------------------------------------------------
  const diskGroup = new THREE.Group();
  const disks = [];
  [0, 2, 4].forEach((psIdx) => {
    const ps = protostars[psIdx];
    const diskAssembly = new THREE.Group();
    // Multi-ring accretion disk
    for (let ring = 0; ring < 6; ring++) {
      const innerR = 0.8 + ring * 0.35;
      const tubeR = 0.06 + ring * 0.015;
      const ringGeo = new THREE.TorusGeometry(innerR, tubeR, 8, 64);
      const ringMat = ring < 3 ? M.diskHot.clone() : M.diskCool.clone();
      ringMat.opacity = 0.7 - ring * 0.08;
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      diskAssembly.add(ringMesh);
    }
    // Flat disk plane using RingGeometry
    const flatGeo = new THREE.RingGeometry(0.7, 3.2, 64, 4);
    const flatMat = M.diskHot.clone();
    flatMat.opacity = 0.22;
    const flatDisk = new THREE.Mesh(flatGeo, flatMat);
    flatDisk.rotation.x = Math.PI / 2;
    diskAssembly.add(flatDisk);

    diskAssembly.position.copy(ps.position);
    diskAssembly.rotation.set(
      0.3 * psIdx, 0.5 * psIdx, 0.2 * psIdx
    );
    diskGroup.add(diskAssembly);
    disks.push(diskAssembly);
  });
  group.add(diskGroup);
  meshes.disks = disks;

  // -------------------------------------------------------------------------
  //  4. BIPOLAR JETS — tube geometry ejecting from protostars
  // -------------------------------------------------------------------------
  const jetGroup = new THREE.Group();
  const jets = [];
  [0, 2, 4].forEach((psIdx, jIdx) => {
    const ps = protostars[psIdx];
    const jetAssembly = new THREE.Group();
    // Two opposing jets
    for (let dir = -1; dir <= 1; dir += 2) {
      // Core jet beam
      const jCurve = new THREE.LineCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, dir * 8, 0)
      );
      const jGeo = new THREE.TubeGeometry(jCurve, 32, 0.08, 8, false);
      const jMesh = new THREE.Mesh(jGeo, M.jetCore.clone());
      jetAssembly.add(jMesh);
      // Outer sheath
      const sGeo = new THREE.TubeGeometry(jCurve, 32, 0.25, 8, false);
      const sMesh = new THREE.Mesh(sGeo, M.jetPlasma.clone());
      jetAssembly.add(sMesh);
      // Knot shocks along the jet
      for (let k = 1; k <= 4; k++) {
        const knotGeo = new THREE.SphereGeometry(0.12 + k * 0.03, 10, 10);
        const knotMat = M.jetCore.clone();
        knotMat.emissiveIntensity = 2.0 + k * 0.5;
        const knot = new THREE.Mesh(knotGeo, knotMat);
        knot.position.set(0, dir * k * 1.8, 0);
        jetAssembly.add(knot);
      }
      // Jet termination bow shock — flattened sphere
      const bowGeo = new THREE.SphereGeometry(0.5, 12, 12);
      bowGeo.scale(1.5, 0.4, 1.5);
      const bow = new THREE.Mesh(bowGeo, M.shockFront.clone());
      bow.position.set(0, dir * 8, 0);
      jetAssembly.add(bow);
    }
    jetAssembly.position.copy(ps.position);
    jetAssembly.rotation.set(0.3 * jIdx, 0, 0.2 * jIdx);
    jetGroup.add(jetAssembly);
    jets.push(jetAssembly);
  });
  group.add(jetGroup);
  meshes.jets = jets;

  // -------------------------------------------------------------------------
  //  5. COMPRESSION WAVE RINGS — expanding from the igniter into the cloud
  // -------------------------------------------------------------------------
  const waveGroup = new THREE.Group();
  const waves = [];
  for (let w = 0; w < 8; w++) {
    const waveGeo = new THREE.TorusGeometry(3 + w * 2.5, 0.15 + w * 0.04, 6, 80);
    const waveMat = w % 2 === 0 ? M.compressionRing.clone() : M.shockFront.clone();
    waveMat.opacity = 0.3 - w * 0.025;
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.y = Math.PI / 2;
    waveMesh.position.set(-4 + w * 3, 0, 0);
    waveGroup.add(waveMesh);
    waves.push(waveMesh);
  }
  group.add(waveGroup);
  meshes.waves = waves;

  // -------------------------------------------------------------------------
  //  6. JEANS MASS COLLAPSE CLUMPS — gravitational fragmentation visualization
  // -------------------------------------------------------------------------
  const jeansGroup = new THREE.Group();
  const jeansClumps = [];
  const clumpPositions = [
    [15, 5, 6], [21, -5, 4], [24, 3, -6], [13, -2, -5],
    [18, 6, -3], [26, -4, 5], [16, -6, 2], [22, 5, 3],
    [19, -3, -7], [25, 1, 7], [14, 4, -4], [20, -6, -2],
  ];
  clumpPositions.forEach((cp, ci) => {
    const clumpR = 0.6 + Math.random() * 0.5;
    const clumpGeo = new THREE.IcosahedronGeometry(clumpR, 2);
    // Perturb
    const pos = clumpGeo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v), y = pos.getY(v), z = pos.getZ(v);
      const n = 1 + 0.2 * Math.sin(x * 5 + ci) * Math.cos(z * 4);
      pos.setXYZ(v, x * n, y * n, z * n);
    }
    clumpGeo.computeVertexNormals();
    const clumpMesh = new THREE.Mesh(clumpGeo, M.jeansClump.clone());
    clumpMesh.position.set(...cp);
    // Dense core inside
    const coreGeo = new THREE.SphereGeometry(clumpR * 0.35, 12, 12);
    const coreMat = M.protostarCool.clone();
    coreMat.emissiveIntensity = 0.6;
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    clumpMesh.add(coreMesh);
    jeansGroup.add(clumpMesh);
    jeansClumps.push(clumpMesh);
  });
  group.add(jeansGroup);
  meshes.jeansClumps = jeansClumps;

  // -------------------------------------------------------------------------
  //  7. IGNITER CANNON — the colossal device itself
  // -------------------------------------------------------------------------
  const cannonGroup = new THREE.Group();

  // Main barrel — LatheGeometry profile
  const barrelPts = [];
  barrelPts.push(new THREE.Vector2(0, -8));
  barrelPts.push(new THREE.Vector2(1.2, -8));
  barrelPts.push(new THREE.Vector2(1.5, -7.5));
  barrelPts.push(new THREE.Vector2(1.4, -6));
  barrelPts.push(new THREE.Vector2(1.6, -5));
  barrelPts.push(new THREE.Vector2(1.8, -4));
  barrelPts.push(new THREE.Vector2(2.0, -3));
  barrelPts.push(new THREE.Vector2(2.2, -2));
  barrelPts.push(new THREE.Vector2(2.5, -1));
  barrelPts.push(new THREE.Vector2(2.8, 0));
  barrelPts.push(new THREE.Vector2(3.2, 1));
  barrelPts.push(new THREE.Vector2(3.0, 2));
  barrelPts.push(new THREE.Vector2(2.5, 3));
  barrelPts.push(new THREE.Vector2(2.0, 3.5));
  barrelPts.push(new THREE.Vector2(1.5, 3.8));
  barrelPts.push(new THREE.Vector2(0, 4));
  const barrelGeo = new THREE.LatheGeometry(barrelPts, 48);
  const barrel = new THREE.Mesh(barrelGeo, M.cannonHull);
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.set(-14, 0, 0);
  cannonGroup.add(barrel);
  meshes.cannonBarrel = barrel;

  // Muzzle ring
  const muzzleGeo = new THREE.TorusGeometry(2.85, 0.3, 16, 48);
  const muzzle = new THREE.Mesh(muzzleGeo, M.cannonTrim);
  muzzle.rotation.y = Math.PI / 2;
  muzzle.position.set(-6, 0, 0);
  cannonGroup.add(muzzle);

  // Muzzle glow core
  const muzzleGlowGeo = new THREE.SphereGeometry(1.8, 24, 24);
  const muzzleGlow = new THREE.Mesh(muzzleGlowGeo, M.cannonGlow);
  muzzleGlow.position.set(-5.5, 0, 0);
  cannonGroup.add(muzzleGlow);
  meshes.muzzleGlow = muzzleGlow;

  // Focusing rings along barrel
  for (let fr = 0; fr < 6; fr++) {
    const focusGeo = new THREE.TorusGeometry(1.6 + fr * 0.15, 0.12, 8, 32);
    const focus = new THREE.Mesh(focusGeo, M.cannonTrim.clone());
    focus.rotation.y = Math.PI / 2;
    focus.position.set(-8 - fr * 1.5, 0, 0);
    cannonGroup.add(focus);
  }

  // Barrel reinforcement ribs
  for (let rib = 0; rib < 12; rib++) {
    const ribGeo = new THREE.BoxGeometry(10, 0.15, 0.3);
    const ribMesh = new THREE.Mesh(ribGeo, M.strutMetal);
    const angle = (rib / 12) * Math.PI * 2;
    const ribR = 2.3;
    ribMesh.position.set(-12, Math.cos(angle) * ribR, Math.sin(angle) * ribR);
    cannonGroup.add(ribMesh);
  }

  // Rear housing — complex shape via ExtrudeGeometry
  const rearShape = new THREE.Shape();
  rearShape.moveTo(0, -3);
  rearShape.lineTo(4, -3.5);
  rearShape.lineTo(5, -2.5);
  rearShape.lineTo(5, 2.5);
  rearShape.lineTo(4, 3.5);
  rearShape.lineTo(0, 3);
  rearShape.lineTo(-1, 2);
  rearShape.lineTo(-1, -2);
  rearShape.closePath();
  const rearGeo = new THREE.ExtrudeGeometry(rearShape, {
    depth: 5, bevelEnabled: true, bevelThickness: 0.3,
    bevelSize: 0.2, bevelSegments: 4,
  });
  const rearHousing = new THREE.Mesh(rearGeo, M.panelDark);
  rearHousing.rotation.y = Math.PI / 2;
  rearHousing.position.set(-22, 0, -2.5);
  cannonGroup.add(rearHousing);

  // Reactor sphere at the rear
  const reactorGeo = new THREE.SphereGeometry(2.2, 32, 32);
  const reactor = new THREE.Mesh(reactorGeo, M.cannonCore);
  reactor.position.set(-24, 0, 0);
  cannonGroup.add(reactor);
  meshes.reactor = reactor;

  // Reactor containment rings
  for (let cr = 0; cr < 4; cr++) {
    const crGeo = new THREE.TorusGeometry(2.6 + cr * 0.2, 0.08, 8, 40);
    const crMesh = new THREE.Mesh(crGeo, M.cannonTrim);
    crMesh.rotation.set(cr * 0.8, cr * 0.5, 0);
    crMesh.position.set(-24, 0, 0);
    cannonGroup.add(crMesh);
  }

  // Exhaust nozzles at rear
  for (let ex = 0; ex < 6; ex++) {
    const angle = (ex / 6) * Math.PI * 2;
    const nozzleGeo = new THREE.CylinderGeometry(0.25, 0.45, 2, 12);
    const nozzle = new THREE.Mesh(nozzleGeo, M.strutMetal);
    nozzle.position.set(
      -26.5,
      Math.cos(angle) * 1.8,
      Math.sin(angle) * 1.8
    );
    nozzle.rotation.z = Math.PI / 2;
    cannonGroup.add(nozzle);
    // Exhaust glow
    const exGlowGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const exGlow = new THREE.Mesh(exGlowGeo, M.cannonGlow.clone());
    exGlow.position.set(-27.6, Math.cos(angle) * 1.8, Math.sin(angle) * 1.8);
    cannonGroup.add(exGlow);
  }

  group.add(cannonGroup);
  meshes.cannon = cannonGroup;

  // -------------------------------------------------------------------------
  //  8. PLASMA CONDUITS — energy lines running from reactor to muzzle
  // -------------------------------------------------------------------------
  const conduitGroup = new THREE.Group();
  const conduits = [];
  for (let c = 0; c < 6; c++) {
    const angle = (c / 6) * Math.PI * 2;
    const radius = 1.8;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-24, Math.cos(angle) * radius, Math.sin(angle) * radius),
      new THREE.Vector3(-18, Math.cos(angle + 0.3) * (radius + 0.5), Math.sin(angle + 0.3) * (radius + 0.5)),
      new THREE.Vector3(-12, Math.cos(angle + 0.1) * (radius + 0.3), Math.sin(angle + 0.1) * (radius + 0.3)),
      new THREE.Vector3(-8,  Math.cos(angle) * (radius - 0.2), Math.sin(angle) * (radius - 0.2)),
      new THREE.Vector3(-6,  Math.cos(angle) * 1.2, Math.sin(angle) * 1.2),
    ]);
    const pipeGeo = new THREE.TubeGeometry(curve, 48, 0.1, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, M.conduitPipe);
    conduitGroup.add(pipe);
    // Inner glow
    const glowGeo = new THREE.TubeGeometry(curve, 48, 0.06, 6, false);
    const glow = new THREE.Mesh(glowGeo, M.conduitGlow.clone());
    conduitGroup.add(glow);
    conduits.push(glow);
  }
  group.add(conduitGroup);
  meshes.conduits = conduits;

  // -------------------------------------------------------------------------
  //  9. GRAVITATIONAL LENS ARRAY — ring of focusing lenses around muzzle
  // -------------------------------------------------------------------------
  const lensGroup = new THREE.Group();
  const lenses = [];
  for (let l = 0; l < 8; l++) {
    const angle = (l / 8) * Math.PI * 2;
    const lensAssembly = new THREE.Group();
    // Frame — extruded hexagon
    const hexShape = new THREE.Shape();
    for (let h = 0; h < 6; h++) {
      const a = (h / 6) * Math.PI * 2;
      const px = Math.cos(a) * 0.6;
      const py = Math.sin(a) * 0.6;
      h === 0 ? hexShape.moveTo(px, py) : hexShape.lineTo(px, py);
    }
    hexShape.closePath();
    // Cut center hole
    const holePath = new THREE.Path();
    for (let h = 0; h < 6; h++) {
      const a = (h / 6) * Math.PI * 2;
      const px = Math.cos(a) * 0.4;
      const py = Math.sin(a) * 0.4;
      h === 0 ? holePath.moveTo(px, py) : holePath.lineTo(px, py);
    }
    holePath.closePath();
    hexShape.holes.push(holePath);
    const frameGeo = new THREE.ExtrudeGeometry(hexShape, { depth: 0.15, bevelEnabled: false });
    const frame = new THREE.Mesh(frameGeo, M.lensFrame);
    lensAssembly.add(frame);
    // Lens glass
    const lgGeo = new THREE.CircleGeometry(0.38, 24);
    const lg = new THREE.Mesh(lgGeo, M.lensGlass.clone());
    lg.position.z = 0.08;
    lensAssembly.add(lg);

    lensAssembly.position.set(
      -4,
      Math.cos(angle) * 4,
      Math.sin(angle) * 4
    );
    lensAssembly.lookAt(-2, 0, 0);
    lensGroup.add(lensAssembly);
    lenses.push(lensAssembly);
  }
  group.add(lensGroup);
  meshes.lenses = lenses;

  // -------------------------------------------------------------------------
  // 10. SUPPORT STRUTS & STRUCTURAL FRAME
  // -------------------------------------------------------------------------
  const strutsGroup = new THREE.Group();
  // Main truss beams
  for (let s = 0; s < 4; s++) {
    const angle = (s / 4) * Math.PI * 2 + Math.PI / 4;
    const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 20, 8);
    const strut = new THREE.Mesh(strutGeo, M.strutMetal);
    strut.position.set(
      -15,
      Math.cos(angle) * 4.5,
      Math.sin(angle) * 4.5
    );
    strut.rotation.z = Math.PI / 2;
    strutsGroup.add(strut);
    // Cross braces
    for (let cb = 0; cb < 5; cb++) {
      const cbGeo = new THREE.CylinderGeometry(0.06, 0.06, 3, 6);
      const cbMesh = new THREE.Mesh(cbGeo, M.strutMetal);
      cbMesh.position.set(
        -8 - cb * 3,
        Math.cos(angle) * 4.5,
        Math.sin(angle) * 4.5
      );
      cbMesh.rotation.set(0, 0, angle);
      strutsGroup.add(cbMesh);
    }
  }
  // Rivets along barrel
  for (let rv = 0; rv < 36; rv++) {
    const rvAngle = (rv % 12) / 12 * Math.PI * 2;
    const rvX = -8 - Math.floor(rv / 12) * 4;
    const rvGeo = new THREE.SphereGeometry(0.07, 6, 6);
    const rvMesh = new THREE.Mesh(rvGeo, M.rivet);
    rvMesh.position.set(rvX, Math.cos(rvAngle) * 2.1, Math.sin(rvAngle) * 2.1);
    strutsGroup.add(rvMesh);
  }
  group.add(strutsGroup);

  // -------------------------------------------------------------------------
  // 11. CONTROL MODULE — operator station with screens & antennas
  // -------------------------------------------------------------------------
  const controlGroup = new THREE.Group();
  // Main housing
  const ctrlGeo = new THREE.BoxGeometry(3, 2, 2.5);
  const ctrlHousing = new THREE.Mesh(ctrlGeo, M.panelDark);
  controlGroup.add(ctrlHousing);
  // Tinted viewport
  const vpGeo = new THREE.PlaneGeometry(1.8, 1.0);
  const vp = new THREE.Mesh(vpGeo, tinted || M.lensGlass);
  vp.position.set(0, 0.3, 1.26);
  controlGroup.add(vp);
  // Screens
  for (let scr = 0; scr < 3; scr++) {
    const scrGeo = new THREE.PlaneGeometry(0.5, 0.35);
    const scrMesh = new THREE.Mesh(scrGeo, M.screenGlow);
    scrMesh.position.set(-0.6 + scr * 0.6, -0.1, 1.26);
    controlGroup.add(scrMesh);
  }
  // Antenna dish
  const antGeo = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI);
  const ant = new THREE.Mesh(antGeo, M.strutMetal);
  ant.position.set(0, 1.3, 0);
  ant.rotation.x = -Math.PI / 2;
  controlGroup.add(ant);
  // Antenna rod
  const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6);
  const rod = new THREE.Mesh(rodGeo, M.strutMetal);
  rod.position.set(0, 2.1, 0);
  controlGroup.add(rod);

  controlGroup.position.set(-18, 5, 0);
  group.add(controlGroup);
  meshes.controlModule = controlGroup;

  // -------------------------------------------------------------------------
  // 12. ENERGY BEAM — the active compression beam from muzzle to cloud
  // -------------------------------------------------------------------------
  const beamGroup = new THREE.Group();
  const beamCurve = new THREE.LineCurve3(
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(18, 0, 0)
  );
  // Core beam
  const beamCoreGeo = new THREE.TubeGeometry(beamCurve, 64, 0.25, 12, false);
  const beamCore = new THREE.Mesh(beamCoreGeo, M.cannonCore.clone());
  beamGroup.add(beamCore);
  meshes.beamCore = beamCore;
  // Outer sheath
  const beamSheathGeo = new THREE.TubeGeometry(beamCurve, 64, 0.8, 12, false);
  const beamSheathMat = M.compressionRing.clone();
  beamSheathMat.opacity = 0.18;
  const beamSheath = new THREE.Mesh(beamSheathGeo, beamSheathMat);
  beamGroup.add(beamSheath);
  meshes.beamSheath = beamSheath;
  // Spiral energy threads wrapping the beam
  const spiralThreads = [];
  for (let sp = 0; sp < 4; sp++) {
    const spCurve = new HelixCurve(0.5, 23, 12);
    const spGeo = new THREE.TubeGeometry(spCurve, 128, 0.04, 6, false);
    const spMat = M.conduitGlow.clone();
    const spMesh = new THREE.Mesh(spGeo, spMat);
    spMesh.rotation.y = (sp / 4) * Math.PI * 2;
    spMesh.position.set(6.5, 0, 0);
    beamGroup.add(spMesh);
    spiralThreads.push(spMesh);
  }
  meshes.spiralThreads = spiralThreads;
  group.add(beamGroup);

  // -------------------------------------------------------------------------
  // 13. HII REGION — ionized hydrogen around the forming stars
  // -------------------------------------------------------------------------
  const hiiGroup = new THREE.Group();
  for (let h = 0; h < 4; h++) {
    const ps = protostars[h * 2];
    const hiiGeo = new THREE.SphereGeometry(2.5 + h * 0.5, 16, 16);
    // Perturb
    const pos = hiiGeo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v), y = pos.getY(v), z = pos.getZ(v);
      const n = 1 + 0.15 * Math.sin(x * 3 + h) * Math.cos(y * 2);
      pos.setXYZ(v, x * n, y * n, z * n);
    }
    hiiGeo.computeVertexNormals();
    const hiiMat = M.hiiGlow.clone();
    hiiMat.opacity = 0.08 + h * 0.02;
    const hii = new THREE.Mesh(hiiGeo, hiiMat);
    hii.position.copy(ps.position);
    hiiGroup.add(hii);
  }
  group.add(hiiGroup);

  // -------------------------------------------------------------------------
  // 14. PARTICLE FIELD — small dust motes and gas globules
  // -------------------------------------------------------------------------
  const particleGroup = new THREE.Group();
  const particles = [];
  for (let p = 0; p < 120; p++) {
    const pGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 4, 4);
    const pMat = M.dustLane.clone();
    pMat.opacity = 0.3 + Math.random() * 0.3;
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.position.set(
      (Math.random() - 0.3) * 50 - 2,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );
    particleGroup.add(pMesh);
    particles.push(pMesh);
  }
  group.add(particleGroup);
  meshes.particles = particles;

  // -------------------------------------------------------------------------
  // 15. MAGNETIC FIELD LINES — helical curves around the igniter
  // -------------------------------------------------------------------------
  const magGroup = new THREE.Group();
  for (let ml = 0; ml < 6; ml++) {
    const mCurve = new HelixCurve(3.5 + ml * 0.4, 30, 4 + ml);
    const mGeo = new THREE.TubeGeometry(mCurve, 96, 0.025, 4, false);
    const mMat = M.compressionRing.clone();
    mMat.opacity = 0.12;
    const mMesh = new THREE.Mesh(mGeo, mMat);
    mMesh.rotation.set(ml * 0.5, 0, 0);
    mMesh.position.set(-3, 0, 0);
    magGroup.add(mMesh);
  }
  group.add(magGroup);

  // -------------------------------------------------------------------------
  // 16. SOLAR WIND DEFLECTOR VANES
  // -------------------------------------------------------------------------
  const vaneGroup = new THREE.Group();
  for (let vn = 0; vn < 8; vn++) {
    const vAngle = (vn / 8) * Math.PI * 2;
    const vShape = new THREE.Shape();
    vShape.moveTo(0, 0);
    vShape.lineTo(3, 0.5);
    vShape.lineTo(3.5, 0);
    vShape.lineTo(3, -0.5);
    vShape.closePath();
    const vGeo = new THREE.ExtrudeGeometry(vShape, { depth: 0.05, bevelEnabled: false });
    const vMesh = new THREE.Mesh(vGeo, M.panelDark);
    vMesh.position.set(
      -6,
      Math.cos(vAngle) * 3.5,
      Math.sin(vAngle) * 3.5
    );
    vMesh.lookAt(-2, 0, 0);
    vaneGroup.add(vMesh);
  }
  group.add(vaneGroup);

  // =========================================================================
  //  PARTS — encyclopedic technical detail
  // =========================================================================
  const parts = [
    {
      name: 'Molecular Cloud Chamber',
      description: 'Giant molecular cloud (GMC) analog — layered dark nebula shells of hydrogen, helium, and dust at ~10 K, total mass ~10⁴ M☉. Dust lanes create infrared-dark regions. Internal turbulence supports the cloud against gravitational collapse until externally triggered.',
      material: 'Molecular hydrogen (H₂), helium, silicate dust grains, PAH molecules, CO ice mantles',
      function: 'Serves as the raw fuel reservoir for star formation. Cloud opacity shields interior from UV, keeping temperatures near 10 K so Jeans mass stays small enough for fragmentation.',
      assemblyOrder: 1,
      connections: ['Compression Wave Array', 'Jeans Collapse Clumps', 'Protostar Cores'],
      failureEffect: 'Cloud dispersal by UV photo-evaporation prevents any star formation.',
      cascadeFailures: ['Protostar Cores', 'Accretion Disks', 'Bipolar Jets'],
      originalPosition: { x: 18, y: 0, z: 0 },
      explodedPosition: { x: 40, y: 0, z: 0 },
    },
    {
      name: 'Protostar Cores',
      description: 'Eight embedded Class 0/I protostars in various evolutionary stages. Each core has accreted 0.01–2 M☉, with luminosities from 0.1–100 L☉. Hot corinos surround the densest objects, exhibiting complex organic molecule emission lines.',
      material: 'Collapsing hydrogen/helium, deuterium, trace lithium, hot dust cocoon',
      function: 'Sites of active gravitational collapse converting gravitational potential energy into thermal luminosity, evolving toward main-sequence hydrogen fusion ignition.',
      assemblyOrder: 3,
      connections: ['Molecular Cloud Chamber', 'Accretion Disks', 'Bipolar Jets', 'HII Regions'],
      failureEffect: 'If mass accretion is halted below 0.08 M☉, the core becomes a brown dwarf rather than a true star.',
      cascadeFailures: ['Accretion Disks', 'Bipolar Jets'],
      originalPosition: { x: 20, y: 2, z: 1 },
      explodedPosition: { x: 38, y: 8, z: 5 },
    },
    {
      name: 'Accretion Disks',
      description: 'Circumstellar accretion disks with multi-ring substructure (gap-forming via magneto-rotational instability). Keplerian rotation, ~1000 K at inner edge declining to ~30 K at outer rim. Disk mass ~0.01–0.1 M☉.',
      material: 'Gas (H₂, CO), μm-sized silicate dust, crystalline forsterite, water ice beyond snow line',
      function: 'Channels angular momentum outward while funneling mass inward onto the protostar. Provides the birthsite for planetesimals and protoplanets.',
      assemblyOrder: 4,
      connections: ['Protostar Cores', 'Bipolar Jets'],
      failureEffect: 'Disk photo-evaporation by nearby O-type stars truncates planet formation.',
      cascadeFailures: ['Bipolar Jets'],
      originalPosition: { x: 20, y: 2, z: 1 },
      explodedPosition: { x: 35, y: 14, z: 0 },
    },
    {
      name: 'Bipolar Jets',
      description: 'Magnetically collimated outflows at 100–500 km/s, extending parsecs from the protostar. Herbig-Haro knot shocks form where jet material impacts ambient medium. Mass loss rate ~10⁻⁸ M☉/yr.',
      material: 'Ionized hydrogen, shock-heated [SII], [OI], [FeII] emission-line gas',
      function: 'Remove excess angular momentum from the accreting system and inject turbulence/energy back into the parent cloud, regulating the star-formation efficiency.',
      assemblyOrder: 5,
      connections: ['Accretion Disks', 'Protostar Cores', 'Molecular Cloud Chamber'],
      failureEffect: 'Without jet-mediated angular momentum transport, accretion stalls and disk fragments prematurely.',
      cascadeFailures: ['Accretion Disks'],
      originalPosition: { x: 20, y: 2, z: 1 },
      explodedPosition: { x: 32, y: 20, z: 6 },
    },
    {
      name: 'Compression Wave Array',
      description: 'Eight concentric magneto-hydrodynamic shock fronts propagating at ~10 km/s into the cloud. Compression ratio of 4:1 (strong J-type shocks) raises local density above the critical Bonnor-Ebert threshold.',
      material: 'Magnetized plasma sheath, cosmic-ray pre-ionized boundary layer',
      function: 'Externally triggers gravitational collapse by sweeping up gas and raising density above the Jeans critical density, converting a stable cloud into an actively star-forming region.',
      assemblyOrder: 2,
      connections: ['Igniter Cannon', 'Molecular Cloud Chamber', 'Jeans Collapse Clumps'],
      failureEffect: 'Insufficient compression leaves the cloud in hydrostatic equilibrium — no star formation occurs.',
      cascadeFailures: ['Jeans Collapse Clumps', 'Protostar Cores'],
      originalPosition: { x: 5, y: 0, z: 0 },
      explodedPosition: { x: 15, y: -15, z: 0 },
    },
    {
      name: 'Jeans Collapse Clumps',
      description: 'Twelve gravitational fragmentation sites where local density exceeds the Jeans critical density (ρ_J). Each clump of mass M > M_J undergoes isothermal free-fall collapse on timescale t_ff = √(3π/32Gρ).',
      material: 'Dense molecular hydrogen cores, CO-depleted freeze-out zones, ambipolar-diffusion envelopes',
      function: 'Represent the fundamental units of gravitational instability — each clump is a future stellar system. Fragmentation hierarchy determines the initial mass function (IMF).',
      assemblyOrder: 3,
      connections: ['Compression Wave Array', 'Molecular Cloud Chamber', 'Protostar Cores'],
      failureEffect: 'Magnetic pressure support (subcritical mass-to-flux ratio) prevents collapse; clump re-expands.',
      cascadeFailures: ['Protostar Cores'],
      originalPosition: { x: 18, y: 4, z: 4 },
      explodedPosition: { x: 30, y: -10, z: 12 },
    },
    {
      name: 'Igniter Cannon',
      description: 'The primary stellar nursery ignition device. A 30-meter directed-energy accelerator using shaped magnetic fields to launch convergent MHD blast waves. Houses a fusion-pumped plasma source with 10¹² W output.',
      material: 'Neutron-degenerate alloy hull, superconducting niobium-titanium coils, tungsten-rhenium nozzle linings',
      function: 'Generates the initial trigger impulse — a focused magneto-hydrodynamic compression wave — directed into the molecular cloud to initiate sequential gravitational collapse.',
      assemblyOrder: 1,
      connections: ['Plasma Conduits', 'Reactor Core', 'Compression Wave Array', 'Gravitational Lens Array'],
      failureEffect: 'Cannon misfire disperses cloud material rather than compressing it, creating a wind-blown bubble.',
      cascadeFailures: ['Compression Wave Array', 'Jeans Collapse Clumps'],
      originalPosition: { x: -14, y: 0, z: 0 },
      explodedPosition: { x: -30, y: 0, z: 0 },
    },
    {
      name: 'Reactor Core',
      description: 'Inertial-confinement deuterium-tritium fusion reactor providing 10¹² watts continuous power. Containment via four intersecting superconducting toroidal magnets. Core temperature: 150 million K.',
      material: 'Plasma-facing beryllium first-wall, lithium breeding blanket, REBCO superconducting tape at 20 K',
      function: 'Powers the entire igniter system — energizes the plasma conduits, drives the cannon accelerator magnets, and sustains the gravitational lens array.',
      assemblyOrder: 2,
      connections: ['Igniter Cannon', 'Plasma Conduits'],
      failureEffect: 'Reactor quench causes immediate system shutdown; residual magnetic energy must be safely dumped.',
      cascadeFailures: ['Igniter Cannon', 'Plasma Conduits', 'Compression Wave Array'],
      originalPosition: { x: -24, y: 0, z: 0 },
      explodedPosition: { x: -40, y: 0, z: 0 },
    },
    {
      name: 'Plasma Conduits',
      description: 'Six helical superconducting plasma-transport lines carrying 10⁶-ampere currents from the reactor to the cannon muzzle. Temperature-graded ceramic insulation with active cryogenic cooling.',
      material: 'YBCO superconductor tape, alumina ceramic insulation, liquid-helium microchannels',
      function: 'Transport fusion-heated plasma from the reactor to the cannon focusing section while maintaining magnetic confinement and minimizing resistive losses.',
      assemblyOrder: 3,
      connections: ['Reactor Core', 'Igniter Cannon'],
      failureEffect: 'Conduit breach causes plasma leak — explosive decompression and localized structural damage.',
      cascadeFailures: ['Igniter Cannon'],
      originalPosition: { x: -15, y: 1.8, z: 0 },
      explodedPosition: { x: -25, y: 10, z: 8 },
    },
    {
      name: 'Gravitational Lens Array',
      description: 'Eight hex-aperture gravitational micro-lens units arranged in a Cassegrain-analog configuration. Each lens uses intense rotating mass-current loops to create weak-field gravitational focusing of the compression beam.',
      material: 'Exotic matter (negative energy density) containment cells, sapphire optical bench, iridium frames',
      function: 'Focuses and collimates the MHD compression beam to ensure it converges at the cloud center rather than dispersing, maximizing compression efficiency at the target Jeans length.',
      assemblyOrder: 4,
      connections: ['Igniter Cannon', 'Compression Wave Array'],
      failureEffect: 'Defocused beam creates diffuse compression insufficient to exceed Jeans critical density.',
      cascadeFailures: ['Compression Wave Array'],
      originalPosition: { x: -4, y: 4, z: 0 },
      explodedPosition: { x: -10, y: 18, z: 0 },
    },
    {
      name: 'HII Regions',
      description: 'Strömgren spheres of ionized hydrogen expanding around the most massive protostars. Ionization front velocity ~10 km/s, electron temperature ~8000 K, emission dominated by Hα (656.3 nm).',
      material: 'Ionized hydrogen plasma, free electrons, trace ionized helium, forbidden-line metals',
      function: 'Mark the transition from protostar to zero-age main-sequence star. Their expansion provides positive feedback, triggering further collapse at the ionization front boundary (radiation-driven implosion).',
      assemblyOrder: 6,
      connections: ['Protostar Cores', 'Molecular Cloud Chamber'],
      failureEffect: 'Premature HII expansion can disrupt neighboring clumps before they reach stellar mass.',
      cascadeFailures: ['Jeans Collapse Clumps'],
      originalPosition: { x: 20, y: 2, z: 1 },
      explodedPosition: { x: 42, y: -8, z: -5 },
    },
    {
      name: 'Magnetic Field Network',
      description: 'Six helical magnetic field lines threading the entire system at ~100 μG within the cloud, amplified to ~1 mG in collapsing cores. Provides non-thermal pressure support and mediates ambipolar diffusion.',
      material: 'Ambient interstellar magnetic field, amplified by gravitational compression and differential rotation',
      function: 'Regulates the rate of gravitational collapse through magnetic pressure and tension. Controls the mass-to-flux ratio that determines whether clumps are super- or sub-critical.',
      assemblyOrder: 2,
      connections: ['Molecular Cloud Chamber', 'Jeans Collapse Clumps', 'Bipolar Jets'],
      failureEffect: 'Magnetic field dissipation (via reconnection) allows uncontrolled collapse producing anomalous mass distribution.',
      cascadeFailures: ['Jeans Collapse Clumps', 'Bipolar Jets'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -20, z: 15 },
    },
    {
      name: 'Energy Beam Column',
      description: 'The main directed-energy compression beam — a 23-meter coherent magneto-plasma column with four helical energy threads. Carries 10¹¹ W of directed kinetic energy from cannon to cloud.',
      material: 'Collimated magnetized plasma, Alfvén-wave energy flux, relativistic electron beam component',
      function: 'The primary energy-transfer mechanism delivering compression energy to the molecular cloud, initiating the cascade of Jeans instabilities leading to star formation.',
      assemblyOrder: 5,
      connections: ['Igniter Cannon', 'Gravitational Lens Array', 'Compression Wave Array'],
      failureEffect: 'Beam instabilities (kink modes) cause filamentation, reducing delivered energy below collapse threshold.',
      cascadeFailures: ['Compression Wave Array'],
      originalPosition: { x: 6, y: 0, z: 0 },
      explodedPosition: { x: 6, y: 22, z: 0 },
    },
    {
      name: 'Control Module',
      description: 'Crewed observation and command station with three holographic displays showing real-time cloud density maps, virial parameter monitoring, and spectral energy distribution (SED) analysis. Houses the trigger sequencer.',
      material: 'Radiation-hardened titanium shell, borosilicate viewports, EMI-shielded electronics',
      function: 'Monitors all system parameters and sequences the ignition pulse timing to match the cloud crossing time, ensuring optimal compression wave convergence.',
      assemblyOrder: 1,
      connections: ['Igniter Cannon', 'Reactor Core'],
      failureEffect: 'Loss of control feedback allows unmonitored beam drift, potentially missing the cloud entirely.',
      cascadeFailures: ['Igniter Cannon'],
      originalPosition: { x: -18, y: 5, z: 0 },
      explodedPosition: { x: -18, y: 20, z: 0 },
    },
    {
      name: 'Solar Wind Deflector Array',
      description: 'Eight aerodynamic vanes around the muzzle that deflect incoming stellar wind from nearby OB associations, preventing premature cloud ablation during the ignition sequence.',
      material: 'Carbon-carbon composite, reflective aluminum coating, piezoelectric actuators',
      function: 'Shields the compression beam and the near-field cloud surface from disruptive external radiation pressure and ram pressure during the critical collapse phase.',
      assemblyOrder: 4,
      connections: ['Igniter Cannon', 'Molecular Cloud Chamber'],
      failureEffect: 'Undeflected stellar wind strips cloud surface layers, reducing available mass for star formation.',
      cascadeFailures: ['Molecular Cloud Chamber'],
      originalPosition: { x: -6, y: 3.5, z: 0 },
      explodedPosition: { x: -6, y: -18, z: 12 },
    },
    {
      name: 'Dust Particle Field',
      description: '120 tracked interstellar dust motes (0.01–1 μm silicate & carbonaceous grains) embedded in the cloud. Dust-to-gas ratio ~1:100 by mass. These grains catalyze H₂ formation and dominate cloud opacity.',
      material: 'Amorphous silicates, graphite, polycyclic aromatic hydrocarbons (PAHs), ice mantles',
      function: 'Provides the primary cooling mechanism for the cloud (far-infrared thermal emission from dust), enabling the gas temperature to remain low enough for Jeans instability to operate.',
      assemblyOrder: 1,
      connections: ['Molecular Cloud Chamber'],
      failureEffect: 'Dust destruction by sputtering raises cloud temperature, increasing Jeans mass and suppressing fragmentation.',
      cascadeFailures: ['Jeans Collapse Clumps'],
      originalPosition: { x: 10, y: 0, z: 0 },
      explodedPosition: { x: 10, y: -22, z: -10 },
    },
  ];

  // =========================================================================
  //  QUIZ QUESTIONS — PhD-level astrophysics
  // =========================================================================
  const quizQuestions = [
    {
      question: 'The Jeans mass M_J for an isothermal gas cloud is given by M_J ∝ T^(3/2) ρ^(-1/2). If the compression wave raises the cloud density by a factor of 16 while the gas remains isothermal at 10 K, by what factor does the Jeans mass decrease?',
      options: [
        'Factor of 2',
        'Factor of 4',
        'Factor of 16',
        'Factor of 256',
      ],
      correct: 1,
      explanation: 'M_J ∝ ρ^(-1/2). If ρ increases by 16×, then M_J decreases by √16 = 4. The Jeans mass drops by a factor of 4, meaning smaller clumps can now collapse — this is the essence of triggered fragmentation in compressed layers.',
    },
    {
      question: 'The free-fall time for a uniform-density sphere is t_ff = √(3π / 32Gρ). For a molecular cloud core with n(H₂) = 10⁵ cm⁻³ (ρ ≈ 3.3 × 10⁻¹⁹ g/cm³), what is the approximate free-fall time?',
      options: [
        '~10,000 years',
        '~100,000 years',
        '~1 million years',
        '~10 million years',
      ],
      correct: 1,
      explanation: 'Plugging in: t_ff = √(3π / (32 × 6.674×10⁻⁸ × 3.3×10⁻¹⁹)) ≈ √(8.85×10²⁵) ≈ 9.4×10¹² s ≈ 3×10⁵ yr. The free-fall time is approximately 100,000 years for dense cores, setting the clock for protostellar collapse.',
    },
    {
      question: 'During Kelvin-Helmholtz contraction, a protostar radiates energy from gravitational compression before hydrogen fusion ignites. For a 1 M☉ protostar contracting to the main sequence, the KH timescale is t_KH = GM²/(RL). Given M = 2×10³³ g, R = 7×10¹⁰ cm, L = 4×10³³ erg/s, approximately what is t_KH?',
      options: [
        '~1.5 × 10⁷ years',
        '~1.5 × 10⁵ years',
        '~1.5 × 10⁹ years',
        '~1.5 × 10³ years',
      ],
      correct: 0,
      explanation: 't_KH = GM²/(RL) = (6.674×10⁻⁸)(2×10³³)² / ((7×10¹⁰)(4×10³³)) = 2.67×10⁵⁹ / 2.8×10⁴⁴ ≈ 9.5×10¹⁴ s ≈ 3×10⁷ yr. The classic KH time for the Sun is ~15–30 Myr. This sets the pre-main-sequence contraction timescale on the Hayashi track.',
    },
    {
      question: 'The stellar Initial Mass Function (IMF) described by Salpeter (1955) follows dN/dM ∝ M^(-α) with α = 2.35 for M > 0.5 M☉. If 1000 stars form in this cloud with masses between 0.5 and 100 M☉, approximately how many stars have M > 10 M☉?',
      options: [
        '~500 stars',
        '~100 stars',
        '~25 stars',
        '~3 stars',
      ],
      correct: 2,
      explanation: 'Integrating the Salpeter IMF: N(>10) / N(>0.5) = ∫₁₀¹⁰⁰ M⁻²·³⁵ dM / ∫₀.₅¹⁰⁰ M⁻²·³⁵ dM. The ratio works out to roughly 2–3%, giving ~20–30 massive stars out of 1000. The steep power law means massive stars are extremely rare but dominate the luminosity and feedback.',
    },
    {
      question: 'The Jeans length λ_J = c_s √(π / Gρ) defines the minimum scale for gravitational instability. In a cloud with sound speed c_s = 0.2 km/s and density ρ = 10⁻²⁰ g/cm³, what is λ_J approximately?',
      options: [
        '~0.01 pc',
        '~0.3 pc',
        '~3 pc',
        '~30 pc',
      ],
      correct: 1,
      explanation: 'λ_J = c_s √(π/Gρ) = (2×10⁴) × √(π / (6.674×10⁻⁸ × 10⁻²⁰)) = 2×10⁴ × √(4.7×10²⁷) = 2×10⁴ × 6.86×10¹³ ≈ 1.37×10¹⁸ cm ≈ 0.44 pc. The Jeans length at this density is roughly 0.3–0.5 pc, consistent with observed dense-core sizes in nearby molecular clouds like Taurus and Ophiuchus.',
    },
  ];

  // =========================================================================
  //  DESCRIPTION
  // =========================================================================
  const description = `The Stellar Nursery Igniter is a hypothetical ultra-advanced astrophysical engineering device designed to trigger controlled star formation within giant molecular clouds (GMCs). It operates by launching focused magneto-hydrodynamic compression waves into a cold (~10 K) molecular hydrogen cloud, raising the local gas density above the critical Jeans density. This initiates gravitational fragmentation (Jeans instability), producing dense clumps that undergo free-fall collapse into protostars.

Key physical processes visualized:
• Jeans instability & gravitational fragmentation — clumps exceeding the Jeans mass collapse
• Free-fall collapse — t_ff ∝ ρ^(-1/2), denser clumps collapse faster
• Protostellar accretion disk formation — conservation of angular momentum flattens infalling material
• Bipolar jet launching — magneto-centrifugal acceleration along open field lines (Blandford-Payne mechanism)
• HII region expansion — UV photons from massive protostars ionize surrounding hydrogen
• Kelvin-Helmholtz contraction — gravitational energy powers protostellar luminosity pre-fusion
• Initial Mass Function (IMF) — the Salpeter power-law mass distribution of newly formed stars

The igniter cannon houses a fusion reactor, superconducting plasma conduits, and a gravitational lens array to focus the compression beam. The control module monitors virial parameters and cloud stability in real time.`;

  // =========================================================================
  //  ANIMATE — complex, highly synchronized animation
  // =========================================================================
  function animate(time, speed, _meshes) {
    const t = time * speed;
    const slow = t * 0.3;
    const med = t * 0.6;
    const fast = t * 1.2;

    // --- Cloud layers: slow organic tumble and breathing ---
    if (meshes.cloudLayers) {
      meshes.cloudLayers.forEach((layer, i) => {
        layer.rotation.x += 0.0003 * (i % 2 === 0 ? 1 : -1);
        layer.rotation.y += 0.0002 * (i % 3 === 0 ? 1 : -1);
        // Breathing: oscillate scale
        const breathe = 1 + 0.015 * Math.sin(slow + i * 0.8);
        layer.scale.setScalar(breathe);
        // Pulse opacity
        if (layer.material) {
          layer.material.opacity = 0.06 + 0.03 * Math.sin(slow * 0.5 + i);
        }
      });
    }

    // --- Protostars: pulsating luminosity ---
    if (meshes.protostars) {
      meshes.protostars.forEach((ps, i) => {
        const pulse = 1 + 0.15 * Math.sin(fast + i * 1.3);
        ps.scale.setScalar(pulse);
        if (ps.material) {
          ps.material.emissiveIntensity = 1.2 + 0.8 * Math.sin(fast * 1.5 + i * 2.0);
        }
        // Halo pulsation
        if (ps.children[0] && ps.children[0].material) {
          ps.children[0].material.opacity = 0.08 + 0.06 * Math.sin(med + i);
          ps.children[0].scale.setScalar(1 + 0.1 * Math.sin(med * 0.7 + i));
        }
        // Accretion envelope spin
        if (ps.children[1]) {
          ps.children[1].rotation.y += 0.02 * speed;
        }
      });
    }

    // --- Accretion disks: Keplerian rotation (inner faster than outer) ---
    if (meshes.disks) {
      meshes.disks.forEach((disk, di) => {
        disk.children.forEach((ring, ri) => {
          const keplerian = 0.04 / (1 + ri * 0.3);
          ring.rotation.z += keplerian * speed;
        });
      });
    }

    // --- Bipolar jets: pulsating knots traveling outward ---
    if (meshes.jets) {
      meshes.jets.forEach((jetAssembly, ji) => {
        jetAssembly.children.forEach((child, ci) => {
          // Knot shocks oscillate
          if (child.geometry && child.geometry.type === 'SphereGeometry') {
            const yOrig = child.position.y;
            if (Math.abs(yOrig) > 0.5) {
              child.position.y = yOrig + 0.02 * Math.sin(fast + ci + ji);
              const kPulse = 1 + 0.2 * Math.sin(fast * 2 + ci * 0.7);
              child.scale.setScalar(kPulse);
            }
          }
          // Jet beam shimmering
          if (child.material && child.material.transparent) {
            child.material.opacity = 0.5 + 0.2 * Math.sin(fast * 1.3 + ji + ci * 0.5);
          }
        });
        // Whole jet wobble (precession)
        jetAssembly.rotation.x += 0.001 * Math.sin(slow + ji);
        jetAssembly.rotation.z += 0.0008 * Math.cos(slow * 0.7 + ji);
      });
    }

    // --- Compression waves: expanding outward from igniter ---
    if (meshes.waves) {
      meshes.waves.forEach((wave, wi) => {
        // Expand and contract cyclically
        const expand = 1 + 0.12 * Math.sin(med + wi * 0.9);
        wave.scale.setScalar(expand);
        // Move along X (propagation)
        wave.position.x = -4 + wi * 3 + 0.5 * Math.sin(slow + wi * 0.5);
        // Rotate for visual dynamism
        wave.rotation.x += 0.005 * speed;
        wave.rotation.z += 0.003 * speed;
        // Opacity pulse
        if (wave.material) {
          wave.material.opacity = 0.2 + 0.12 * Math.sin(med * 0.8 + wi * 1.1);
        }
      });
    }

    // --- Jeans clumps: collapsing (shrinking) with internal core brightening ---
    if (meshes.jeansClumps) {
      meshes.jeansClumps.forEach((clump, ci) => {
        // Slow contraction oscillation
        const collapse = 1 - 0.08 * Math.sin(slow * 0.4 + ci * 0.6);
        clump.scale.setScalar(collapse);
        // Wobble position
        clump.position.x += 0.003 * Math.sin(slow + ci * 1.2);
        clump.position.y += 0.002 * Math.cos(slow * 0.8 + ci);
        // Internal core glow
        if (clump.children[0] && clump.children[0].material) {
          clump.children[0].material.emissiveIntensity = 0.4 + 0.5 * Math.sin(med + ci);
          const coreGrow = 0.3 + 0.15 * Math.sin(slow * 0.5 + ci * 0.8);
          clump.children[0].scale.setScalar(coreGrow / 0.35);
        }
      });
    }

    // --- Muzzle glow: intense pulsation ---
    if (meshes.muzzleGlow) {
      const mPulse = 1 + 0.25 * Math.sin(fast * 2);
      meshes.muzzleGlow.scale.setScalar(mPulse);
      if (meshes.muzzleGlow.material) {
        meshes.muzzleGlow.material.emissiveIntensity = 1.5 + 1.5 * Math.sin(fast * 2.5);
      }
    }

    // --- Reactor core: rapid rotation and pulsation ---
    if (meshes.reactor) {
      meshes.reactor.rotation.x += 0.02 * speed;
      meshes.reactor.rotation.y += 0.015 * speed;
      const rPulse = 1 + 0.1 * Math.sin(fast * 3);
      meshes.reactor.scale.setScalar(rPulse);
      if (meshes.reactor.material) {
        meshes.reactor.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(fast * 3.5);
      }
    }

    // --- Plasma conduits: traveling glow ---
    if (meshes.conduits) {
      meshes.conduits.forEach((glow, ci) => {
        if (glow.material) {
          glow.material.opacity = 0.3 + 0.4 * Math.sin(fast + ci * 1.0);
          glow.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(fast * 1.8 + ci * 0.7);
        }
      });
    }

    // --- Gravitational lenses: slow orbit and glow ---
    if (meshes.lenses) {
      meshes.lenses.forEach((lens, li) => {
        lens.rotation.z += 0.003 * speed;
        // Glass glow
        if (lens.children[1] && lens.children[1].material) {
          lens.children[1].material.opacity = 0.25 + 0.15 * Math.sin(med + li * 0.8);
        }
      });
    }

    // --- Energy beam: shimmer and spiral thread rotation ---
    if (meshes.beamCore && meshes.beamCore.material) {
      meshes.beamCore.material.emissiveIntensity = 2.0 + 1.5 * Math.sin(fast * 2);
      const bScale = 1 + 0.08 * Math.sin(fast * 3);
      meshes.beamCore.scale.set(1, bScale, bScale);
    }
    if (meshes.beamSheath && meshes.beamSheath.material) {
      meshes.beamSheath.material.opacity = 0.12 + 0.08 * Math.sin(fast * 1.5);
    }
    if (meshes.spiralThreads) {
      meshes.spiralThreads.forEach((sp, si) => {
        sp.rotation.x += 0.015 * speed;
        if (sp.material) {
          sp.material.emissiveIntensity = 1.5 + Math.sin(fast * 2 + si);
          sp.material.opacity = 0.4 + 0.3 * Math.sin(fast + si * 1.5);
        }
      });
    }

    // --- Cannon barrel: subtle vibration ---
    if (meshes.cannonBarrel) {
      meshes.cannonBarrel.position.y = 0.03 * Math.sin(fast * 4);
      meshes.cannonBarrel.position.z = 0.02 * Math.cos(fast * 3.5);
    }

    // --- Control module: screen flicker ---
    if (meshes.controlModule) {
      meshes.controlModule.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          const hex = child.material.emissive.getHex();
          if (hex === 0x00ff66 || hex === 0x00ff88) {
            child.material.emissiveIntensity = 2.0 + 1.0 * Math.sin(fast * 5 + Math.random() * 0.5);
          }
        }
      });
    }

    // --- Dust particles: Brownian drift ---
    if (meshes.particles) {
      meshes.particles.forEach((p, pi) => {
        p.position.x += 0.003 * Math.sin(slow * 0.5 + pi * 0.1);
        p.position.y += 0.002 * Math.cos(slow * 0.4 + pi * 0.2);
        p.position.z += 0.002 * Math.sin(slow * 0.3 + pi * 0.15);
        // Wrap particles that drift too far
        if (p.position.x > 30) p.position.x = -20;
        if (p.position.x < -30) p.position.x = 20;
      });
    }

    // --- Cloud group: very slow overall rotation ---
    if (meshes.cloud) {
      meshes.cloud.rotation.y += 0.0005 * speed;
      meshes.cloud.rotation.x += 0.0002 * speed;
    }
  }

  // =========================================================================
  //  RETURN
  // =========================================================================
  return { group, parts, description, quizQuestions, animate };
}
