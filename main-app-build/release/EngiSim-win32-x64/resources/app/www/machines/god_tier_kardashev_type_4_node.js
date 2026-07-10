// ============================================================================
// GOD TIER — KARDASHEV TYPE IV CIVILIZATION NODE
// A megastructure harnessing the total energy output of an entire supercluster
// of galaxies, manipulating dark energy across millions of light-years.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {

  const group = new THREE.Group();

  // ── Helper Utilities ──────────────────────────────────────────────────────
  function emissiveMat(hex, intensity = 2.0) {
    return new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: intensity,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92,
    });
  }

  function glowMat(hex, intensity = 3.5, opacity = 0.7) {
    return new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: intensity,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
    });
  }

  function voidMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x020208,
      emissive: 0x050510,
      emissiveIntensity: 0.15,
      metalness: 0.95,
      roughness: 0.8,
      transparent: true,
      opacity: 0.35,
    });
  }

  function cosmicChromeMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x8888cc,
      emissive: 0x222244,
      emissiveIntensity: 0.6,
      metalness: 1.0,
      roughness: 0.05,
    });
  }

  function darkEnergyMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x6600ff,
      emissive: 0x9933ff,
      emissiveIntensity: 4.0,
      metalness: 0.2,
      roughness: 0.05,
      transparent: true,
      opacity: 0.6,
    });
  }

  function nebulaMat(hex) {
    return new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }

  // ── MESHES COLLECTION ─────────────────────────────────────────────────────
  const meshes = {};

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. GALAXY SUPERCLUSTER — 200+ galaxies arranged in cosmic web topology
  // ═══════════════════════════════════════════════════════════════════════════
  const superclusterGroup = new THREE.Group();
  const galaxyClusters = [];
  const galaxyMeshes = [];

  // Define cluster node positions (major galaxy clusters in the supercluster)
  const clusterPositions = [
    { x: 0, y: 0, z: 0, size: 1.0, galaxyCount: 35 },
    { x: 18, y: 5, z: -12, size: 0.8, galaxyCount: 25 },
    { x: -20, y: -3, z: 10, size: 0.85, galaxyCount: 28 },
    { x: 12, y: -15, z: 18, size: 0.7, galaxyCount: 20 },
    { x: -14, y: 12, z: -16, size: 0.75, galaxyCount: 22 },
    { x: 25, y: 8, z: 8, size: 0.6, galaxyCount: 18 },
    { x: -8, y: -18, z: -20, size: 0.65, galaxyCount: 15 },
    { x: 22, y: -10, z: -8, size: 0.55, galaxyCount: 14 },
    { x: -25, y: 8, z: -5, size: 0.5, galaxyCount: 12 },
    { x: 5, y: 20, z: 15, size: 0.6, galaxyCount: 16 },
    { x: -15, y: -12, z: 22, size: 0.55, galaxyCount: 13 },
    { x: 30, y: 0, z: -3, size: 0.45, galaxyCount: 10 },
  ];

  // Build individual galaxies as glowing disk + central bulge + halo
  function createGalaxy(radius, color) {
    const gGroup = new THREE.Group();

    // Disk — flattened torus
    const diskGeo = new THREE.TorusGeometry(radius, radius * 0.12, 8, 32);
    const diskMesh = new THREE.Mesh(diskGeo, emissiveMat(color, 1.8));
    diskMesh.rotation.x = Math.PI / 2;
    gGroup.add(diskMesh);

    // Central bulge — sphere
    const bulgeGeo = new THREE.SphereGeometry(radius * 0.35, 16, 16);
    const bulgeMesh = new THREE.Mesh(bulgeGeo, emissiveMat(0xffffcc, 2.5));
    gGroup.add(bulgeMesh);

    // Spiral arms — extruded curves
    for (let arm = 0; arm < 3; arm++) {
      const armShape = new THREE.Shape();
      armShape.moveTo(0, 0);
      for (let t = 0; t < 20; t++) {
        const angle = (t / 20) * Math.PI * 2.2 + (arm * Math.PI * 2) / 3;
        const r = (t / 20) * radius * 1.1;
        armShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      const armGeo = new THREE.ShapeGeometry(armShape);
      const armMesh = new THREE.Mesh(armGeo, glowMat(color, 1.5, 0.3));
      armMesh.rotation.x = Math.PI / 2;
      gGroup.add(armMesh);
    }

    // Halo — transparent large sphere
    const haloGeo = new THREE.SphereGeometry(radius * 2.0, 12, 12);
    const haloMesh = new THREE.Mesh(haloGeo, glowMat(color, 0.5, 0.06));
    gGroup.add(haloMesh);

    return gGroup;
  }

  // Place galaxies within each cluster
  const galaxyColors = [0xffcc88, 0x88bbff, 0xff88aa, 0xaaddff, 0xffddaa, 0xcc99ff];

  clusterPositions.forEach((cluster, ci) => {
    const clusterGroup = new THREE.Group();
    clusterGroup.position.set(cluster.x, cluster.y, cluster.z);

    for (let g = 0; g < cluster.galaxyCount; g++) {
      const spread = 6 * cluster.size;
      const gx = (Math.random() - 0.5) * spread * 2;
      const gy = (Math.random() - 0.5) * spread * 1.2;
      const gz = (Math.random() - 0.5) * spread * 2;
      const gRadius = 0.15 + Math.random() * 0.45 * cluster.size;
      const color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];

      const galaxy = createGalaxy(gRadius, color);
      galaxy.position.set(gx, gy, gz);
      galaxy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      clusterGroup.add(galaxy);
      galaxyMeshes.push(galaxy);
    }

    // Intra-cluster medium glow
    const icmGeo = new THREE.SphereGeometry(7 * cluster.size, 16, 16);
    const icmMesh = new THREE.Mesh(icmGeo, glowMat(0xff6644, 0.4, 0.04));
    clusterGroup.add(icmMesh);

    galaxyClusters.push(clusterGroup);
    superclusterGroup.add(clusterGroup);
  });

  group.add(superclusterGroup);
  meshes.supercluster = superclusterGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. COSMIC WEB FILAMENTS — Energy collection web between clusters
  // ═══════════════════════════════════════════════════════════════════════════
  const filamentsGroup = new THREE.Group();
  const filamentMeshes = [];

  // Connect clusters with glowing tubular filaments (cosmic web topology)
  function createFilament(start, end, thickness) {
    const fGroup = new THREE.Group();

    const mid = new THREE.Vector3(
      (start.x + end.x) / 2 + (Math.random() - 0.5) * 6,
      (start.y + end.y) / 2 + (Math.random() - 0.5) * 6,
      (start.z + end.z) / 2 + (Math.random() - 0.5) * 6
    );

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, start.y, start.z),
      mid,
      new THREE.Vector3(end.x, end.y, end.z)
    );

    // Main filament tube
    const tubeGeo = new THREE.TubeGeometry(curve, 48, thickness, 8, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, glowMat(0x4488ff, 1.8, 0.35));
    fGroup.add(tubeMesh);

    // Outer glow sheath
    const sheathGeo = new THREE.TubeGeometry(curve, 32, thickness * 3.5, 6, false);
    const sheathMesh = new THREE.Mesh(sheathGeo, glowMat(0x2244aa, 0.6, 0.08));
    fGroup.add(sheathMesh);

    // Energy flow particles along filament — small spheres
    const particleCount = 12;
    const particles = [];
    for (let p = 0; p < particleCount; p++) {
      const pGeo = new THREE.SphereGeometry(thickness * 0.6, 6, 6);
      const pMat = emissiveMat(0x66ccff, 4.0);
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData.curve = curve;
      pMesh.userData.offset = p / particleCount;
      pMesh.userData.speed = 0.08 + Math.random() * 0.06;
      fGroup.add(pMesh);
      particles.push(pMesh);
    }

    fGroup.userData.particles = particles;
    fGroup.userData.curve = curve;
    return fGroup;
  }

  // Build filament connections between nearby clusters
  const connectionPairs = [];
  for (let i = 0; i < clusterPositions.length; i++) {
    for (let j = i + 1; j < clusterPositions.length; j++) {
      const a = clusterPositions[i];
      const b = clusterPositions[j];
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
      if (dist < 38) {
        connectionPairs.push([i, j, dist]);
      }
    }
  }

  connectionPairs.forEach(([i, j, dist]) => {
    const thickness = 0.08 + (1.0 - dist / 38) * 0.15;
    const filament = createFilament(clusterPositions[i], clusterPositions[j], thickness);
    filamentsGroup.add(filament);
    filamentMeshes.push(filament);
  });

  group.add(filamentsGroup);
  meshes.filaments = filamentsGroup;
  meshes.filamentMeshes = filamentMeshes;

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CENTRAL PROCESSING NEXUS — The core of the Type IV civilization
  // ═══════════════════════════════════════════════════════════════════════════
  const nexusGroup = new THREE.Group();

  // Core singularity sphere — multi-layered
  const coreGeo1 = new THREE.IcosahedronGeometry(2.0, 4);
  const coreMesh1 = new THREE.Mesh(coreGeo1, emissiveMat(0xffffff, 5.0));
  nexusGroup.add(coreMesh1);
  meshes.nexusCore = coreMesh1;

  const coreGeo2 = new THREE.IcosahedronGeometry(2.5, 3);
  const coreMesh2 = new THREE.Mesh(coreGeo2, glowMat(0xccddff, 3.0, 0.25));
  coreMesh2.material.wireframe = true;
  nexusGroup.add(coreMesh2);
  meshes.nexusCoreWireframe = coreMesh2;

  const coreGeo3 = new THREE.IcosahedronGeometry(3.2, 2);
  const coreMesh3 = new THREE.Mesh(coreGeo3, glowMat(0x6688ff, 2.0, 0.15));
  coreMesh3.material.wireframe = true;
  nexusGroup.add(coreMesh3);

  // Accretion torus around core
  const accretionGeo = new THREE.TorusGeometry(4.5, 0.8, 24, 64);
  const accretionMesh = new THREE.Mesh(accretionGeo, emissiveMat(0xff8833, 3.5));
  accretionMesh.rotation.x = Math.PI / 2.3;
  nexusGroup.add(accretionMesh);
  meshes.accretionDisk = accretionMesh;

  // Secondary accretion ring — perpendicular
  const accretion2Geo = new THREE.TorusGeometry(5.2, 0.4, 16, 48);
  const accretion2Mesh = new THREE.Mesh(accretion2Geo, emissiveMat(0xffaa55, 2.5));
  accretion2Mesh.rotation.x = Math.PI / 2;
  accretion2Mesh.rotation.z = Math.PI / 3;
  nexusGroup.add(accretion2Mesh);

  // Polar jets — twin cones of energy
  for (let side = 0; side < 2; side++) {
    const jetGeo = new THREE.ConeGeometry(1.2, 12, 16, 1, true);
    const jetMesh = new THREE.Mesh(jetGeo, glowMat(0x44aaff, 4.0, 0.4));
    jetMesh.position.y = side === 0 ? 8 : -8;
    jetMesh.rotation.x = side === 0 ? 0 : Math.PI;
    nexusGroup.add(jetMesh);

    // Jet glow cone — wider
    const jetGlowGeo = new THREE.ConeGeometry(2.5, 16, 12, 1, true);
    const jetGlowMesh = new THREE.Mesh(jetGlowGeo, glowMat(0x2266cc, 1.5, 0.1));
    jetGlowMesh.position.y = side === 0 ? 10 : -10;
    jetGlowMesh.rotation.x = side === 0 ? 0 : Math.PI;
    nexusGroup.add(jetGlowMesh);
  }
  meshes.nexusJets = nexusGroup;

  // Nexus shell — Dyson-sphere-like lattice around core
  const shellSegments = 20;
  for (let lat = 0; lat < shellSegments; lat++) {
    const phi = (lat / shellSegments) * Math.PI;
    for (let lon = 0; lon < shellSegments; lon++) {
      const theta = (lon / shellSegments) * Math.PI * 2;
      const r = 6.5;
      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.cos(phi);
      const pz = r * Math.sin(phi) * Math.sin(theta);

      if (Math.random() > 0.55) {
        const nodeGeo = new THREE.OctahedronGeometry(0.15, 0);
        const nodeMesh = new THREE.Mesh(nodeGeo, cosmicChromeMat());
        nodeMesh.position.set(px, py, pz);
        nodeMesh.lookAt(0, 0, 0);
        nexusGroup.add(nodeMesh);
      }
    }
  }

  // Nexus orbital rings — three interlocking
  for (let ring = 0; ring < 3; ring++) {
    const rGeo = new THREE.TorusGeometry(7.5 + ring * 0.6, 0.06, 8, 128);
    const rMesh = new THREE.Mesh(rGeo, cosmicChromeMat());
    rMesh.rotation.x = (ring * Math.PI) / 3;
    rMesh.rotation.y = (ring * Math.PI) / 4;
    nexusGroup.add(rMesh);
  }

  group.add(nexusGroup);
  meshes.nexus = nexusGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. DARK ENERGY MANIPULATION ARRAYS
  // ═══════════════════════════════════════════════════════════════════════════
  const darkArrayGroup = new THREE.Group();
  const darkArrayNodes = [];

  // 16 massive dark energy collector pylons arranged in a hypersphere pattern
  const pylonCount = 16;
  for (let p = 0; p < pylonCount; p++) {
    const pylonGroup = new THREE.Group();

    // Golden ratio spiral placement
    const phi = Math.acos(1 - (2 * (p + 0.5)) / pylonCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * p;
    const pylonR = 35;
    const px = pylonR * Math.sin(phi) * Math.cos(theta);
    const py = pylonR * Math.cos(phi);
    const pz = pylonR * Math.sin(phi) * Math.sin(theta);
    pylonGroup.position.set(px, py, pz);
    pylonGroup.lookAt(0, 0, 0);

    // Main pylon body — octahedral crystal
    const pylonBodyGeo = new THREE.OctahedronGeometry(2.2, 1);
    const pylonBodyMesh = new THREE.Mesh(pylonBodyGeo, darkEnergyMat());
    pylonGroup.add(pylonBodyMesh);

    // Pylon focus ring
    const focusGeo = new THREE.TorusGeometry(3.0, 0.15, 8, 32);
    const focusMesh = new THREE.Mesh(focusGeo, emissiveMat(0xaa44ff, 3.0));
    pylonGroup.add(focusMesh);

    // Pylon antenna spikes — 6 radial
    for (let s = 0; s < 6; s++) {
      const spikeGeo = new THREE.ConeGeometry(0.12, 3.5, 6);
      const spikeMesh = new THREE.Mesh(spikeGeo, cosmicChromeMat());
      const sAngle = (s / 6) * Math.PI * 2;
      spikeMesh.position.set(Math.cos(sAngle) * 2.8, Math.sin(sAngle) * 2.8, 0);
      spikeMesh.rotation.z = sAngle + Math.PI / 2;
      pylonGroup.add(spikeMesh);
    }

    // Field emitter — inner glow sphere
    const emitterGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const emitterMesh = new THREE.Mesh(emitterGeo, emissiveMat(0xcc66ff, 5.0));
    pylonGroup.add(emitterMesh);

    // Dark energy distortion field — large transparent sphere
    const fieldGeo = new THREE.SphereGeometry(5.0, 16, 16);
    const fieldMesh = new THREE.Mesh(fieldGeo, glowMat(0x6600cc, 0.8, 0.05));
    pylonGroup.add(fieldMesh);

    darkArrayGroup.add(pylonGroup);
    darkArrayNodes.push(pylonGroup);
  }

  // Dark energy beams — connect each pylon to nexus core
  const darkBeams = [];
  darkArrayNodes.forEach((pylon) => {
    const pos = pylon.position;
    const beamCurve = new THREE.LineCurve3(
      new THREE.Vector3(pos.x, pos.y, pos.z),
      new THREE.Vector3(0, 0, 0)
    );
    const beamGeo = new THREE.TubeGeometry(beamCurve, 16, 0.06, 6, false);
    const beamMesh = new THREE.Mesh(beamGeo, glowMat(0x9933ff, 2.5, 0.3));
    darkArrayGroup.add(beamMesh);
    darkBeams.push(beamMesh);
  });

  group.add(darkArrayGroup);
  meshes.darkEnergyArrays = darkArrayGroup;
  meshes.darkArrayNodes = darkArrayNodes;
  meshes.darkBeams = darkBeams;

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. COSMIC VOID REGIONS — Empty regions between filaments
  // ═══════════════════════════════════════════════════════════════════════════
  const voidsGroup = new THREE.Group();
  const voidPositions = [
    { x: 10, y: 15, z: -18, r: 8 },
    { x: -18, y: -10, z: -15, r: 7 },
    { x: 15, y: -8, z: 14, r: 6 },
    { x: -10, y: 18, z: 8, r: 9 },
    { x: 8, y: -20, z: -6, r: 5 },
  ];

  voidPositions.forEach((v) => {
    const vGeo = new THREE.SphereGeometry(v.r, 16, 16);
    const vMesh = new THREE.Mesh(vGeo, voidMat());
    vMesh.position.set(v.x, v.y, v.z);
    voidsGroup.add(vMesh);
  });

  group.add(voidsGroup);
  meshes.voids = voidsGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ENERGY COLLECTION WEB — Secondary web connecting all arrays
  // ═══════════════════════════════════════════════════════════════════════════
  const collectionWebGroup = new THREE.Group();
  const webStrands = [];

  // Interconnect dark energy arrays with delicate energy web
  for (let i = 0; i < darkArrayNodes.length; i++) {
    for (let j = i + 1; j < darkArrayNodes.length; j++) {
      const posA = darkArrayNodes[i].position;
      const posB = darkArrayNodes[j].position;
      const dist = posA.distanceTo(posB);

      if (dist < 55) {
        const midPoint = new THREE.Vector3(
          (posA.x + posB.x) / 2 + (Math.random() - 0.5) * 8,
          (posA.y + posB.y) / 2 + (Math.random() - 0.5) * 8,
          (posA.z + posB.z) / 2 + (Math.random() - 0.5) * 8
        );

        const webCurve = new THREE.QuadraticBezierCurve3(posA.clone(), midPoint, posB.clone());
        const webGeo = new THREE.TubeGeometry(webCurve, 24, 0.025, 4, false);
        const webMesh = new THREE.Mesh(webGeo, glowMat(0x8844ff, 1.2, 0.2));
        collectionWebGroup.add(webMesh);
        webStrands.push(webMesh);
      }
    }
  }

  group.add(collectionWebGroup);
  meshes.collectionWeb = collectionWebGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GRAVITATIONAL LENSING HALOS — Visual distortion effects
  // ═══════════════════════════════════════════════════════════════════════════
  const lensingGroup = new THREE.Group();

  // Einstein rings around major cluster nodes
  clusterPositions.slice(0, 6).forEach((cluster) => {
    for (let ring = 0; ring < 3; ring++) {
      const lensGeo = new THREE.TorusGeometry(
        3.0 + ring * 1.5,
        0.04 + ring * 0.02,
        8,
        64
      );
      const lensMesh = new THREE.Mesh(lensGeo, glowMat(0xffffff, 1.0, 0.12));
      lensMesh.position.set(cluster.x, cluster.y, cluster.z);
      lensMesh.rotation.x = Math.random() * Math.PI;
      lensMesh.rotation.y = Math.random() * Math.PI;
      lensingGroup.add(lensMesh);
    }
  });

  group.add(lensingGroup);
  meshes.lensingHalos = lensingGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. NEBULA CLOUDS — Diffuse gas between structures
  // ═══════════════════════════════════════════════════════════════════════════
  const nebulaGroup = new THREE.Group();
  const nebulaColors = [0xff4466, 0x4488ff, 0x44ff88, 0xff8844, 0xaa44ff, 0x44ffff];

  for (let n = 0; n < 30; n++) {
    const nGeo = new THREE.SphereGeometry(1.5 + Math.random() * 4.5, 8, 8);
    const nMesh = new THREE.Mesh(nGeo, nebulaMat(nebulaColors[n % nebulaColors.length]));
    nMesh.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 70
    );
    nMesh.scale.set(
      1 + Math.random() * 2,
      0.5 + Math.random(),
      1 + Math.random() * 2
    );
    nebulaGroup.add(nMesh);
  }

  group.add(nebulaGroup);
  meshes.nebulae = nebulaGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. QUANTUM ENTANGLEMENT RELAY STATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const relayGroup = new THREE.Group();
  const relayStations = [];

  for (let r = 0; r < 24; r++) {
    const rGroup = new THREE.Group();

    const rAngle1 = Math.random() * Math.PI * 2;
    const rAngle2 = Math.random() * Math.PI;
    const rDist = 20 + Math.random() * 18;
    rGroup.position.set(
      rDist * Math.sin(rAngle2) * Math.cos(rAngle1),
      rDist * Math.cos(rAngle2),
      rDist * Math.sin(rAngle2) * Math.sin(rAngle1)
    );

    // Relay core — dodecahedron
    const relayCore = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.5, 0),
      emissiveMat(0x00ffcc, 3.0)
    );
    rGroup.add(relayCore);

    // Relay ring
    const relayRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.04, 8, 24),
      emissiveMat(0x00ff88, 2.5)
    );
    rGroup.add(relayRing);

    // Relay antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 6);
    const antennaMesh = new THREE.Mesh(antennaGeo, cosmicChromeMat());
    antennaMesh.position.y = 1.25;
    rGroup.add(antennaMesh);

    // Antenna tip
    const tipGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const tipMesh = new THREE.Mesh(tipGeo, emissiveMat(0x00ffaa, 4.0));
    tipMesh.position.y = 2.5;
    rGroup.add(tipMesh);

    relayGroup.add(rGroup);
    relayStations.push(rGroup);
  }

  group.add(relayGroup);
  meshes.relayStations = relayGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. TEMPORAL STABILIZATION MATRIX — Time-lock field generators
  // ═══════════════════════════════════════════════════════════════════════════
  const temporalGroup = new THREE.Group();
  const temporalRings = [];

  for (let t = 0; t < 8; t++) {
    const tRingGeo = new THREE.TorusGeometry(42 + t * 2.5, 0.08, 6, 96);
    const tRingMesh = new THREE.Mesh(tRingGeo, glowMat(0x00aaff, 1.5 + t * 0.2, 0.15));
    tRingMesh.rotation.x = Math.PI / 2 + (t * 0.08);
    tRingMesh.rotation.z = (t * Math.PI) / 8;
    temporalGroup.add(tRingMesh);
    temporalRings.push(tRingMesh);
  }

  group.add(temporalGroup);
  meshes.temporalMatrix = temporalGroup;
  meshes.temporalRings = temporalRings;

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. ENTROPY REVERSAL ENGINES — Thermodynamic violation devices
  // ═══════════════════════════════════════════════════════════════════════════
  const entropyGroup = new THREE.Group();
  const entropyEngines = [];

  for (let e = 0; e < 6; e++) {
    const eGroup = new THREE.Group();
    const eAngle = (e / 6) * Math.PI * 2;
    const eR = 15;
    eGroup.position.set(Math.cos(eAngle) * eR, 0, Math.sin(eAngle) * eR);

    // Engine housing — lathe geometry profile
    const enginePts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = 1.2 + 0.6 * Math.sin(t * Math.PI * 3) * (1 - t * 0.3);
      enginePts.push(new THREE.Vector2(r, t * 5 - 2.5));
    }
    const engineGeo = new THREE.LatheGeometry(enginePts, 24);
    const engineMesh = new THREE.Mesh(engineGeo, chrome);
    eGroup.add(engineMesh);

    // Internal plasma — glowing cylinder
    const plasmaGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.5, 16, 1, true);
    const plasmaMesh = new THREE.Mesh(plasmaGeo, emissiveMat(0xff3300, 4.0));
    eGroup.add(plasmaMesh);

    // Cooling fins — 8 radial
    for (let f = 0; f < 8; f++) {
      const finGeo = new THREE.BoxGeometry(0.05, 4.0, 1.5);
      const finMesh = new THREE.Mesh(finGeo, darkSteel);
      const fAngle = (f / 8) * Math.PI * 2;
      finMesh.position.set(Math.cos(fAngle) * 1.8, 0, Math.sin(fAngle) * 1.8);
      finMesh.rotation.y = fAngle;
      eGroup.add(finMesh);
    }

    entropyGroup.add(eGroup);
    entropyEngines.push(eGroup);
  }

  group.add(entropyGroup);
  meshes.entropyEngines = entropyGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. INFORMATION PROCESSING SUBSTRATE — Computational mega-lattice
  // ═══════════════════════════════════════════════════════════════════════════
  const computeGroup = new THREE.Group();

  // 3D grid of compute nodes surrounding the nexus
  const gridSize = 5;
  const gridSpacing = 2.8;
  const computeNodes = [];

  for (let gx = -gridSize; gx <= gridSize; gx++) {
    for (let gy = -gridSize; gy <= gridSize; gy++) {
      for (let gz = -gridSize; gz <= gridSize; gz++) {
        const dist = Math.sqrt(gx * gx + gy * gy + gz * gz);
        if (dist > gridSize - 0.5 && dist < gridSize + 0.5) {
          const nodeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
          const nodeMesh = new THREE.Mesh(nodeGeo, emissiveMat(0x00ff66, 2.0));
          nodeMesh.position.set(
            gx * gridSpacing,
            gy * gridSpacing,
            gz * gridSpacing
          );
          computeGroup.add(nodeMesh);
          computeNodes.push(nodeMesh);
        }
      }
    }
  }

  group.add(computeGroup);
  meshes.computeSubstrate = computeGroup;
  meshes.computeNodes = computeNodes;

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. COSMIC MICROWAVE BACKGROUND SHELL — Outer boundary
  // ═══════════════════════════════════════════════════════════════════════════
  const cmbGroup = new THREE.Group();

  const cmbGeo = new THREE.SphereGeometry(55, 64, 64);
  const cmbMat = new THREE.MeshStandardMaterial({
    color: 0x112244,
    emissive: 0x0a0a1a,
    emissiveIntensity: 0.3,
    metalness: 0.0,
    roughness: 1.0,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  });
  const cmbMesh = new THREE.Mesh(cmbGeo, cmbMat);
  cmbGroup.add(cmbMesh);

  // CMB anisotropy spots
  for (let s = 0; s < 80; s++) {
    const sPhi = Math.random() * Math.PI;
    const sTheta = Math.random() * Math.PI * 2;
    const sR = 54.5;
    const spotGeo = new THREE.CircleGeometry(0.5 + Math.random() * 1.5, 8);
    const spotColor = Math.random() > 0.5 ? 0xff4444 : 0x4444ff;
    const spotMesh = new THREE.Mesh(spotGeo, glowMat(spotColor, 0.8, 0.12));
    spotMesh.position.set(
      sR * Math.sin(sPhi) * Math.cos(sTheta),
      sR * Math.cos(sPhi),
      sR * Math.sin(sPhi) * Math.sin(sTheta)
    );
    spotMesh.lookAt(0, 0, 0);
    cmbGroup.add(spotMesh);
  }

  group.add(cmbGroup);
  meshes.cmbShell = cmbGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. GRAVITATIONAL WAVE EMITTERS — Ripple generators
  // ═══════════════════════════════════════════════════════════════════════════
  const gwaveGroup = new THREE.Group();
  const gwaveRipples = [];

  for (let w = 0; w < 10; w++) {
    const rippleGeo = new THREE.RingGeometry(8 + w * 3, 8.3 + w * 3, 64);
    const rippleMesh = new THREE.Mesh(rippleGeo, glowMat(0x88aaff, 0.6, 0.06 + 0.01 * (10 - w)));
    rippleMesh.rotation.x = Math.PI / 2;
    gwaveGroup.add(rippleMesh);
    gwaveRipples.push(rippleMesh);
  }

  group.add(gwaveGroup);
  meshes.gravitationalWaves = gwaveGroup;
  meshes.gwaveRipples = gwaveRipples;

  // ═══════════════════════════════════════════════════════════════════════════
  // 15. EXOTIC MATTER CONTAINMENT PODS
  // ═══════════════════════════════════════════════════════════════════════════
  const exoticGroup = new THREE.Group();
  const exoticPods = [];

  for (let ep = 0; ep < 12; ep++) {
    const podGroup = new THREE.Group();
    const epAngle = (ep / 12) * Math.PI * 2;
    const epY = (ep % 3 - 1) * 8;
    podGroup.position.set(
      Math.cos(epAngle) * 25,
      epY,
      Math.sin(epAngle) * 25
    );

    // Pod shell — capsule shape via lathe
    const podPts = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const r = 0.6 * Math.sin(t * Math.PI);
      podPts.push(new THREE.Vector2(r, t * 3 - 1.5));
    }
    const podGeo = new THREE.LatheGeometry(podPts, 16);
    const podMesh = new THREE.Mesh(podGeo, glass);
    podGroup.add(podMesh);

    // Exotic matter core — negative energy glow
    const exoCorGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const exoCorMesh = new THREE.Mesh(exoCorGeo, emissiveMat(0xff00ff, 6.0));
    podGroup.add(exoCorMesh);

    // Containment rings
    for (let cr = 0; cr < 4; cr++) {
      const crGeo = new THREE.TorusGeometry(0.65, 0.03, 6, 16);
      const crMesh = new THREE.Mesh(crGeo, emissiveMat(0xffcc00, 2.0));
      crMesh.position.y = (cr / 3) * 2.5 - 1.25;
      podGroup.add(crMesh);
    }

    exoticGroup.add(podGroup);
    exoticPods.push(podGroup);
  }

  group.add(exoticGroup);
  meshes.exoticPods = exoticGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 16. DIMENSIONAL BREACH PORTALS — Multiverse access points
  // ═══════════════════════════════════════════════════════════════════════════
  const portalGroup = new THREE.Group();
  const portals = [];

  for (let dp = 0; dp < 4; dp++) {
    const pGroup = new THREE.Group();
    const dpAngle = (dp / 4) * Math.PI * 2 + Math.PI / 4;
    pGroup.position.set(
      Math.cos(dpAngle) * 32,
      (Math.random() - 0.5) * 10,
      Math.sin(dpAngle) * 32
    );

    // Portal rim — thick glowing torus
    const rimGeo = new THREE.TorusGeometry(3.0, 0.3, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeo, emissiveMat(0xff4400, 4.0));
    pGroup.add(rimMesh);

    // Portal surface — swirling disk
    const surfGeo = new THREE.CircleGeometry(2.7, 48);
    const surfMesh = new THREE.Mesh(surfGeo, glowMat(0xff8800, 3.0, 0.5));
    pGroup.add(surfMesh);

    // Event horizon edge glow
    const horizonGeo = new THREE.RingGeometry(2.5, 3.3, 48);
    const horizonMesh = new THREE.Mesh(horizonGeo, glowMat(0xffaa00, 2.0, 0.3));
    pGroup.add(horizonMesh);

    // Stabilizer pylons — 6 around portal
    for (let sp = 0; sp < 6; sp++) {
      const spAngle = (sp / 6) * Math.PI * 2;
      const spGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 6);
      const spMesh = new THREE.Mesh(spGeo, darkSteel);
      spMesh.position.set(Math.cos(spAngle) * 3.5, Math.sin(spAngle) * 3.5, 0);
      pGroup.add(spMesh);
    }

    portalGroup.add(pGroup);
    portals.push(pGroup);
  }

  group.add(portalGroup);
  meshes.portals = portalGroup;

  // ═══════════════════════════════════════════════════════════════════════════
  // 17. BACKGROUND STAR FIELD — Distant stars for depth
  // ═══════════════════════════════════════════════════════════════════════════
  const starGroup = new THREE.Group();
  for (let s = 0; s < 500; s++) {
    const starGeo = new THREE.SphereGeometry(0.03 + Math.random() * 0.08, 4, 4);
    const starBright = 0.5 + Math.random() * 0.5;
    const starMesh = new THREE.Mesh(starGeo, emissiveMat(0xffffff, starBright * 3));
    const sR = 50 + Math.random() * 10;
    const sPhi = Math.random() * Math.PI;
    const sTheta = Math.random() * Math.PI * 2;
    starMesh.position.set(
      sR * Math.sin(sPhi) * Math.cos(sTheta),
      sR * Math.cos(sPhi),
      sR * Math.sin(sPhi) * Math.sin(sTheta)
    );
    starGroup.add(starMesh);
  }
  group.add(starGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTS ARRAY — Detailed engineering breakdown
  // ═══════════════════════════════════════════════════════════════════════════
  const parts = [
    {
      name: 'Galaxy Supercluster Array',
      description: 'A network of 12 major galaxy clusters containing 228+ individual galaxies, each with spiral arms, central bulges, halos, and intracluster medium. Provides the raw luminous and gravitational energy harvested by the civilization.',
      material: 'Baryonic matter, dark matter halos, hot intracluster gas',
      function: 'Primary energy source — galaxies are the fuel reserves, their stellar output siphoned through Dyson-sphere-scale collectors around each star',
      assemblyOrder: 1,
      connections: ['Cosmic Web Filaments', 'Energy Collection Web', 'Gravitational Lensing Halos'],
      failureEffect: 'Loss of energy input — civilization collapses to Type III within megayears',
      cascadeFailures: ['Energy Collection Web', 'Central Processing Nexus'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 40, z: 0 },
    },
    {
      name: 'Cosmic Web Filaments',
      description: 'Engineered baryonic matter filaments connecting galaxy clusters, threaded with energy conduits that channel harvested stellar energy toward the central nexus at near-lightspeed.',
      material: 'Stabilized baryonic plasma, exotic matter waveguides, dark matter scaffolding',
      function: 'Primary energy transport — carries petawatts of power across megaparsec distances via quantum-entangled energy packets',
      assemblyOrder: 2,
      connections: ['Galaxy Supercluster Array', 'Central Processing Nexus', 'Quantum Relay Stations'],
      failureEffect: 'Energy flow halts between clusters; isolated clusters revert to natural evolution',
      cascadeFailures: ['Central Processing Nexus', 'Entropy Reversal Engines'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 55, z: 0 },
    },
    {
      name: 'Central Processing Nexus',
      description: 'The computational and energy processing core. Features a controlled singularity with accretion disk, polar relativistic jets, Dyson lattice shell, and three interlocking orbital rings. Processes all harvested energy.',
      material: 'Neutronium lattice, quark-gluon plasma core, exotic matter stabilizers',
      function: 'Central energy conversion — transforms raw stellar/gravitational energy into usable forms: computation substrate, spatial manipulation fields, temporal stabilization power',
      assemblyOrder: 3,
      connections: ['Cosmic Web Filaments', 'Dark Energy Arrays', 'Temporal Stabilization Matrix'],
      failureEffect: 'Total civilizational collapse — uncontrolled singularity growth, jet destabilization',
      cascadeFailures: ['Dark Energy Arrays', 'Temporal Stabilization Matrix', 'Entropy Reversal Engines', 'Dimensional Portals'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -45, z: 0 },
    },
    {
      name: 'Dark Energy Manipulation Arrays',
      description: '16 octahedral dark energy collector pylons arranged in a golden-ratio hypersphere, each with focus rings, antenna spikes, field emitters, and distortion fields. Connected to nexus via energy beams.',
      material: 'Planck-scale metamaterial, negative energy density exotic matter, topological defect lattice',
      function: 'Harvests and redirects dark energy (68% of universe energy budget) — enables control over cosmic expansion rate within the supercluster volume',
      assemblyOrder: 4,
      connections: ['Central Processing Nexus', 'Energy Collection Web', 'Temporal Stabilization Matrix'],
      failureEffect: 'Loss of dark energy control — local space begins accelerating expansion, tearing apart structures',
      cascadeFailures: ['Temporal Stabilization Matrix', 'Exotic Matter Pods'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 50, y: 0, z: 0 },
    },
    {
      name: 'Cosmic Void Regions',
      description: '5 engineered void zones where matter has been deliberately evacuated to create low-entropy computational volumes and reduce gravitational interference between energy harvesting zones.',
      material: 'Near-vacuum with controlled dark energy density',
      function: 'Provides thermodynamic heat sinks and clean computational volumes for the processing substrate',
      assemblyOrder: 5,
      connections: ['Galaxy Supercluster Array', 'Information Processing Substrate'],
      failureEffect: 'Voids fill with stray matter, increasing noise floor for quantum computations',
      cascadeFailures: ['Information Processing Substrate'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -50, y: 0, z: 0 },
    },
    {
      name: 'Energy Collection Web',
      description: 'Secondary web of energy conduits connecting all 16 dark energy arrays, forming a redundant energy distribution mesh ensuring no single point of failure can isolate any array.',
      material: 'Quantum-entangled energy conduit fibers, stabilized wormhole micro-channels',
      function: 'Redundant energy distribution — ensures load balancing and failover across the entire dark energy harvesting infrastructure',
      assemblyOrder: 6,
      connections: ['Dark Energy Arrays', 'Central Processing Nexus'],
      failureEffect: 'Arrays become isolated; energy distribution becomes unbalanced, risking localized overloads',
      cascadeFailures: ['Dark Energy Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 50, y: 30, z: 0 },
    },
    {
      name: 'Gravitational Lensing Halos',
      description: 'Einstein ring generators around major cluster nodes, creating controlled gravitational lensing for long-range observation and energy focusing.',
      material: 'Dark matter concentration rings, exotic mass-energy tensors',
      function: 'Focuses distant light and energy toward collectors; provides telescopic observation capability across the observable universe',
      assemblyOrder: 7,
      connections: ['Galaxy Supercluster Array', 'Central Processing Nexus'],
      failureEffect: 'Loss of long-range observation; energy focusing efficiency drops 40%',
      cascadeFailures: ['Energy Collection Web'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -50, y: 30, z: 0 },
    },
    {
      name: 'Quantum Entanglement Relay Stations',
      description: '24 relay stations with dodecahedral cores, enabling instantaneous quantum-entangled communication across the entire supercluster volume.',
      material: 'Entangled qubit arrays, topological quantum error correction lattice, superconducting antenna tips',
      function: 'FTL communication backbone — coordinates all subsystems across megaparsec distances without lightspeed delay',
      assemblyOrder: 8,
      connections: ['Cosmic Web Filaments', 'Central Processing Nexus', 'Dark Energy Arrays'],
      failureEffect: 'Communication delays revert to lightspeed — millions of years latency, coordination impossible',
      cascadeFailures: ['Central Processing Nexus', 'Dark Energy Arrays'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: 50 },
    },
    {
      name: 'Temporal Stabilization Matrix',
      description: '8 concentric temporal rings generating a chrono-stabilization field, preventing temporal paradoxes and ensuring causal consistency across the supercluster.',
      material: 'Closed timelike curve stabilizers, Tipler cylinder micro-arrays',
      function: 'Maintains temporal coherence — prevents relativistic time dilation from desynchronizing distributed systems across vast distances',
      assemblyOrder: 9,
      connections: ['Central Processing Nexus', 'Dark Energy Arrays'],
      failureEffect: 'Temporal desynchronization — subsystems drift out of causal contact, coordination breaks down',
      cascadeFailures: ['Central Processing Nexus', 'Quantum Relay Stations'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 0, z: -50 },
    },
    {
      name: 'Entropy Reversal Engines',
      description: '6 Maxwell-demon-class engines with lathe-profiled housings, internal plasma cores, and cooling fins. Locally reverse thermodynamic entropy to maintain system order.',
      material: 'Neutronium housing, quark-gluon plasma, ultracold dark matter cooling fins',
      function: 'Prevents heat death within the controlled volume — reverses entropy to maintain computational and structural coherence indefinitely',
      assemblyOrder: 10,
      connections: ['Central Processing Nexus', 'Cosmic Void Regions'],
      failureEffect: 'Entropy increases unchecked — all structures degrade toward heat death on accelerated timescale',
      cascadeFailures: ['Information Processing Substrate', 'Exotic Matter Pods'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 30, y: -40, z: 0 },
    },
    {
      name: 'Information Processing Substrate',
      description: 'A hollow spherical lattice of quantum compute nodes forming a Type IV Matrioshka brain, performing 10^120 operations per second on universe-scale physics simulations.',
      material: 'Topological qubit arrays, photonic interconnects, graphene-neutronium hybrid processors',
      function: 'Primary computation — simulates physics, manages all subsystems, runs civilization consciousness, and models alternate universe parameters',
      assemblyOrder: 11,
      connections: ['Central Processing Nexus', 'Cosmic Void Regions', 'Quantum Relay Stations'],
      failureEffect: 'Loss of computational capacity — civilization intelligence degrades, cannot maintain complex subsystems',
      cascadeFailures: ['All subsystems eventually'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -30, y: -40, z: 0 },
    },
    {
      name: 'Cosmic Microwave Background Shell',
      description: 'Outer boundary shell with CMB anisotropy pattern recreation, serving as both camouflage (mimicking natural CMB) and energy collection surface for residual cosmic background radiation.',
      material: 'Metamaterial camouflage layer, microwave rectenna surface, dark matter anchoring lattice',
      function: 'Outer boundary defense and energy harvesting — collects CMB radiation and masks the civilization from external detection',
      assemblyOrder: 12,
      connections: ['Dark Energy Arrays', 'Galaxy Supercluster Array'],
      failureEffect: 'Civilization becomes visible to external observers; CMB energy harvesting (~2.7K blackbody) ceases',
      cascadeFailures: ['None — primarily passive system'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 60, z: 0 },
    },
    {
      name: 'Gravitational Wave Emitters',
      description: '10 concentric ring emitters generating controlled gravitational waves for communication, propulsion, and spatial manipulation across intergalactic distances.',
      material: 'Binary neutron star oscillators, spacetime curvature actuators',
      function: 'Gravitational wave manipulation — encodes information in spacetime ripples, provides propulsion via asymmetric wave emission',
      assemblyOrder: 13,
      connections: ['Central Processing Nexus', 'Temporal Stabilization Matrix'],
      failureEffect: 'Loss of gravitational wave communication channel; propulsion capability reduced',
      cascadeFailures: ['Temporal Stabilization Matrix'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 40, y: 40, z: 0 },
    },
    {
      name: 'Exotic Matter Containment Pods',
      description: '12 capsule-shaped containment vessels holding negative-energy exotic matter, essential for maintaining wormholes, warp fields, and Alcubierre drive capability.',
      material: 'Casimir effect concentrators, negative energy density exotic matter, chronometric containment field generators',
      function: 'Stores and dispenses exotic matter for wormhole stabilization, warp bubble generation, and spacetime metric engineering',
      assemblyOrder: 14,
      connections: ['Dark Energy Arrays', 'Dimensional Portals', 'Entropy Reversal Engines'],
      failureEffect: 'Exotic matter release — uncontrolled wormhole formation, spacetime topology damage',
      cascadeFailures: ['Dimensional Portals', 'Central Processing Nexus'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: -40, y: 40, z: 0 },
    },
    {
      name: 'Dimensional Breach Portals',
      description: '4 stabilized wormhole portals providing access to parallel universe branches, each with glowing toroidal rims, event horizon surfaces, and 6 stabilizer pylons.',
      material: 'Traversable wormhole throat lined with exotic matter, Morris-Thorne metric stabilizers',
      function: 'Multiverse access — enables resource extraction from parallel universes, inter-dimensional trade, and civilizational expansion beyond this universe',
      assemblyOrder: 15,
      connections: ['Exotic Matter Pods', 'Central Processing Nexus', 'Temporal Stabilization Matrix'],
      failureEffect: 'Wormhole collapse — potential naked singularity formation, causal paradox if connected to different timelike regions',
      cascadeFailures: ['Temporal Stabilization Matrix', 'Exotic Matter Pods'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -60, z: 0 },
    },
    {
      name: 'Background Star Field',
      description: '500 background stars providing visual depth and representing the unmodified stellar population outside the civilization\'s direct control volume.',
      material: 'Natural main-sequence and giant-branch stars',
      function: 'Passive backdrop — unmodified stellar population serving as reference frame and emergency energy reserve',
      assemblyOrder: 16,
      connections: ['Cosmic Microwave Background Shell'],
      failureEffect: 'No direct effect — these are natural objects',
      cascadeFailures: ['None'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: 70, z: 0 },
    },
    {
      name: 'Nebula Gas Clouds',
      description: '30 diffuse nebula clouds of ionized gas scattered throughout the supercluster, serving as raw material reserves for star formation and exotic matter synthesis.',
      material: 'Ionized hydrogen, helium, trace heavier elements, magnetically confined plasma',
      function: 'Raw material storage — provides feedstock for stellar engineering, exotic matter production, and structure fabrication',
      assemblyOrder: 17,
      connections: ['Galaxy Supercluster Array', 'Entropy Reversal Engines'],
      failureEffect: 'Material shortage — cannot fabricate new structures or replace degraded components',
      cascadeFailures: ['Entropy Reversal Engines'],
      originalPosition: { x: 0, y: 0, z: 0 },
      explodedPosition: { x: 0, y: -70, z: 0 },
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIZ QUESTIONS — PhD-level cosmology & energy
  // ═══════════════════════════════════════════════════════════════════════════
  const quizQuestions = [
    {
      question: 'The gravitational binding energy of a galaxy supercluster like the Laniakea Supercluster (~10^17 solar masses, ~80 Mpc radius) can be estimated via E_bind ≈ 3GM²/5R. Which of the following is closest to its binding energy?',
      options: [
        '~10^54 joules',
        '~10^59 joules',
        '~10^63 joules',
        '~10^68 joules',
      ],
      correct: 2,
      explanation: 'Using E ≈ 3GM²/5R with M ≈ 10^17 M_☉ ≈ 2×10^47 kg and R ≈ 80 Mpc ≈ 2.5×10^24 m, we get E ≈ 3(6.67×10^-11)(4×10^94)/(5×2.5×10^24) ≈ 6.4×10^59 J. However, superclusters are not gravitationally bound (dark energy dominates), so the true binding energy is negative — the system is unbound. The formal calculation yields ~10^63 J when including dark matter contributions and internal kinetic energy terms, making this a nuanced question about the virial theorem applied to the largest cosmic structures.',
    },
    {
      question: 'Dark energy constitutes ~68% of the universe\'s total energy density. The dark energy density is approximately 6.9×10^-27 kg/m³. Within the volume of a typical supercluster void (~50 Mpc radius sphere), what is the approximate total dark energy content?',
      options: [
        '~10^58 joules — comparable to a single galaxy\'s rest mass energy',
        '~10^62 joules — comparable to the rest mass energy of ~1000 galaxies',
        '~10^66 joules — exceeding the total baryonic energy of the observable universe',
        '~10^70 joules — sufficient to create a new Big Bang',
      ],
      correct: 1,
      explanation: 'A sphere of radius 50 Mpc ≈ 1.54×10^24 m has volume V = (4/3)π(1.54×10^24)³ ≈ 1.53×10^73 m³. Total dark energy = ρ_DE × V × c² = 6.9×10^-27 × 1.53×10^73 × (3×10^8)² ≈ 9.5×10^62 J. This is comparable to the rest mass energy of roughly 1000 Milky Way-mass galaxies (each ~10^59 J), demonstrating why dark energy dominates the dynamics of supercluster-scale structures and prevents their gravitational collapse.',
    },
    {
      question: 'A Kardashev Type IV civilization would need to counteract the Hubble flow (cosmic expansion) within its supercluster volume. Given H₀ ≈ 70 km/s/Mpc, what recession velocity would need to be overcome at the edge of a 100 Mpc controlled volume, and what does this imply about energy requirements?',
      options: [
        '700 km/s — easily achievable, requiring only galaxy-scale gravitational binding energy',
        '7,000 km/s (~2.3% c) — requiring continuous energy expenditure exceeding the luminosity of all galaxies within the volume',
        '70,000 km/s (~23% c) — requiring dark energy manipulation, as gravitational means alone are insufficient',
        '210,000 km/s (~70% c) — physically impossible even with exotic matter',
      ],
      correct: 1,
      explanation: 'At 100 Mpc, v = H₀ × d = 70 × 100 = 7,000 km/s ≈ 0.023c. To counteract this expansion continuously, the civilization must supply energy to decelerate all matter at the boundary. The power required scales as P ∝ M_boundary × v × H₀, which for a supercluster mass exceeds 10^42 watts — greater than the total stellar luminosity within the volume (~10^40 W for ~10^14 stars). This proves that a Type IV civilization must harness dark energy itself, not merely stellar output, to maintain structural coherence against cosmic expansion.',
    },
    {
      question: 'The cosmic microwave background (CMB) has a temperature of 2.725 K, corresponding to a blackbody radiation energy density of ~4.2×10^-14 J/m³. If a Type IV civilization could harvest ALL CMB photons within its supercluster volume (radius 100 Mpc), what would be the total harvested energy, and how does it compare to other sources?',
      options: [
        '~10^53 J — negligible compared to stellar sources, making CMB harvesting pointless',
        '~10^60 J — significant but dwarfed by dark energy content of the same volume',
        '~10^67 J — exceeding the total stellar output of all galaxies within the volume over 10 billion years',
        '~10^73 J — comparable to the total energy of the observable universe',
      ],
      correct: 1,
      explanation: 'Volume = (4/3)π(3.08×10^24)³ ≈ 1.22×10^74 m³. Total CMB energy = 4.2×10^-14 × 1.22×10^74 ≈ 5.1×10^60 J. For comparison, dark energy in same volume ≈ 10^63 J (1000× more), and total stellar luminosity over 10 Gyr ≈ 10^40 W × 3×10^17 s × 10^14 stars ≈ 3×10^57 J (1000× less). The CMB is a significant but secondary energy source — meaningful for a Type IV civilization as supplementary power, but dark energy harvesting must be the primary focus.',
    },
    {
      question: 'Maintaining traversable wormholes (as modeled by the Morris-Thorne metric) requires exotic matter with negative energy density. The Casimir effect between parallel plates produces negative energy density ~-π²ℏc/(240d⁴). For a wormhole throat radius of 1 km, what is the approximate total exotic matter requirement, expressed in solar mass equivalents?',
      options: [
        '~10^-3 M_☉ — achievable with advanced particle physics',
        '~1 M_☉ — requiring a star\'s worth of exotic matter',
        '~10^6 M_☉ — requiring exotic matter equivalent to a supermassive black hole',
        '~10^30 M_☉ — requiring more exotic matter than exists in the observable universe',
      ],
      correct: 1,
      explanation: 'For a Morris-Thorne wormhole with throat radius r₀ = 1 km, the exotic matter requirement is approximately M_exotic ≈ -c²r₀/(2G) ≈ -(9×10^16)(10³)/(2×6.67×10^-11) ≈ -6.7×10^29 kg ≈ -0.34 M_☉. With engineering margins and stability requirements (the shape function and redshift function must satisfy flare-out conditions), practical requirements are ~1-10 M_☉ of exotic matter per wormhole. This is why even a Type IV civilization maintains dedicated Exotic Matter Containment Pods — producing and storing this material is among the most energy-intensive operations in the entire megastructure.',
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DESCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════
  const description = `Kardashev Type IV Civilization Node — an ultra god-tier megastructure harnessing the total energy output of an entire galaxy supercluster (~10^46 watts). This structure spans approximately 200 megaparsecs and incorporates 12 major galaxy clusters containing 228+ individual galaxies, connected by engineered cosmic web filaments that channel energy toward a central processing nexus. The nexus features a controlled singularity with accretion disk, relativistic polar jets, and a Dyson lattice shell. 16 dark energy manipulation arrays harvest the dominant energy component of the universe (68% of total energy density), while 24 quantum entanglement relay stations provide FTL communication across the entire volume. Temporal stabilization matrices prevent relativistic desynchronization, entropy reversal engines combat heat death, and 4 dimensional breach portals provide multiverse access. The entire structure is camouflaged behind a reconstructed cosmic microwave background shell.`;

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATE — Rich, highly synchronized animations
  // ═══════════════════════════════════════════════════════════════════════════
  function animate(time, speed, m) {
    const t = time * speed * 0.001;

    // 1. Rotate galaxy clusters slowly at different rates
    galaxyClusters.forEach((cluster, i) => {
      cluster.rotation.y += 0.0002 * speed * (1 + i * 0.05);
      cluster.rotation.x += 0.00005 * speed * Math.sin(t + i);
    });

    // 2. Individual galaxy rotations — spin on their axes
    galaxyMeshes.forEach((galaxy, i) => {
      galaxy.rotation.z += 0.001 * speed * (0.5 + (i % 5) * 0.2);

      // Galaxy dimming effect — simulate energy extraction
      const dimFactor = 0.7 + 0.3 * Math.sin(t * 0.3 + i * 0.7);
      galaxy.children.forEach((child) => {
        if (child.material && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = child.material.userData?.baseIntensity
            ? child.material.userData.baseIntensity * dimFactor
            : dimFactor * 2.0;
        }
      });
    });

    // 3. Energy flow particles along filaments
    filamentMeshes.forEach((filament) => {
      if (filament.userData.particles) {
        filament.userData.particles.forEach((particle) => {
          const progress = (particle.userData.offset + t * particle.userData.speed) % 1;
          const point = particle.userData.curve.getPoint(progress);
          particle.position.copy(point);

          // Pulse particle brightness
          const pulse = 2.0 + 2.0 * Math.sin(t * 8 + particle.userData.offset * 20);
          particle.material.emissiveIntensity = pulse;
        });
      }
    });

    // 4. Nexus core — pulsing and rotating
    if (meshes.nexusCore) {
      meshes.nexusCore.material.emissiveIntensity = 4.0 + 2.0 * Math.sin(t * 2);
      meshes.nexusCore.rotation.y += 0.005 * speed;
      meshes.nexusCore.rotation.x += 0.003 * speed;
    }
    if (meshes.nexusCoreWireframe) {
      meshes.nexusCoreWireframe.rotation.y -= 0.008 * speed;
      meshes.nexusCoreWireframe.rotation.z += 0.004 * speed;
    }

    // 5. Accretion disk rotation
    if (meshes.accretionDisk) {
      meshes.accretionDisk.rotation.z += 0.012 * speed;
      meshes.accretionDisk.material.emissiveIntensity = 3.0 + 1.5 * Math.sin(t * 3);
    }

    // 6. Dark energy arrays — rotate and pulse
    if (meshes.darkArrayNodes) {
      meshes.darkArrayNodes.forEach((node, i) => {
        node.rotation.x += 0.004 * speed;
        node.rotation.z += 0.003 * speed * Math.sin(t + i);

        // Pulse emitter
        node.children.forEach((child) => {
          if (child.material && child.material.emissive) {
            const colorHex = child.material.emissive.getHex();
            if (colorHex === 0xcc66ff || colorHex === 0x9933ff) {
              child.material.emissiveIntensity = 3.0 + 3.0 * Math.sin(t * 4 + i * 0.8);
            }
          }
        });
      });
    }

    // 7. Dark energy beams — shimmer opacity
    if (meshes.darkBeams) {
      meshes.darkBeams.forEach((beam, i) => {
        beam.material.opacity = 0.15 + 0.25 * Math.abs(Math.sin(t * 3 + i * 0.5));
      });
    }

    // 8. Temporal rings — counter-rotate at different speeds
    if (meshes.temporalRings) {
      meshes.temporalRings.forEach((ring, i) => {
        ring.rotation.z += 0.002 * speed * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.1);
        ring.rotation.x += 0.001 * speed * Math.sin(t * 0.5 + i);

        // Pulse ring brightness
        ring.material.emissiveIntensity = 1.0 + 1.0 * Math.sin(t * 1.5 + i * 0.4);
      });
    }

    // 9. Gravitational wave ripples — expand and fade
    if (meshes.gwaveRipples) {
      meshes.gwaveRipples.forEach((ripple, i) => {
        const phase = (t * 0.5 + i * 0.3) % (Math.PI * 2);
        const scale = 1.0 + 0.15 * Math.sin(phase);
        ripple.scale.set(scale, scale, 1);
        ripple.material.opacity = 0.03 + 0.05 * Math.abs(Math.sin(phase));
      });
    }

    // 10. Compute nodes — data flow visualization
    if (meshes.computeNodes) {
      meshes.computeNodes.forEach((node, i) => {
        const pulse = Math.sin(t * 6 + i * 0.15);
        node.material.emissiveIntensity = pulse > 0 ? pulse * 4.0 : 0.3;
      });
    }

    // 11. Entropy engines — rotate and heat-pulse
    entropyEngines.forEach((engine, i) => {
      engine.rotation.y += 0.006 * speed * (i % 2 === 0 ? 1 : -1);
      engine.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          const hex = child.material.emissive.getHex();
          if (hex === 0xff3300) {
            child.material.emissiveIntensity = 3.0 + 2.0 * Math.sin(t * 5 + i);
          }
        }
      });
    });

    // 12. Portal swirl animation
    portals.forEach((portal, i) => {
      portal.rotation.z += 0.01 * speed;

      // Pulsing portal surface
      portal.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          const hex = child.material.emissive.getHex();
          if (hex === 0xff4400 || hex === 0xff8800) {
            child.material.emissiveIntensity = 2.5 + 2.5 * Math.sin(t * 4 + i * 1.5);
          }
        }
      });
    });

    // 13. Relay station antenna pulses
    relayStations.forEach((relay, i) => {
      relay.rotation.y += 0.003 * speed;
      relay.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          const hex = child.material.emissive.getHex();
          if (hex === 0x00ffaa || hex === 0x00ffcc) {
            child.material.emissiveIntensity = 1.5 + 2.5 * Math.abs(Math.sin(t * 7 + i * 0.4));
          }
        }
      });
    });

    // 14. Nebulae — gentle drift and opacity fluctuation
    if (meshes.nebulae) {
      meshes.nebulae.children.forEach((nebula, i) => {
        nebula.rotation.y += 0.0003 * speed;
        nebula.material.opacity = 0.1 + 0.1 * Math.sin(t * 0.2 + i);
      });
    }

    // 15. Exotic pods — containment field flicker
    exoticPods.forEach((pod, i) => {
      pod.rotation.y += 0.004 * speed;
      pod.children.forEach((child) => {
        if (child.material && child.material.emissive) {
          const hex = child.material.emissive.getHex();
          if (hex === 0xff00ff) {
            child.material.emissiveIntensity = 4.0 + 3.0 * Math.sin(t * 10 + i * 0.6);
          }
        }
      });
    });

    // 16. Overall supercluster slow rotation
    group.rotation.y += 0.00008 * speed;

    // 17. Collection web strands — shimmer
    webStrands.forEach((strand, i) => {
      strand.material.opacity = 0.1 + 0.15 * Math.abs(Math.sin(t * 2 + i * 0.3));
    });

    // 18. CMB shell — very slow rotation for immersion
    if (meshes.cmbShell) {
      meshes.cmbShell.rotation.y += 0.00003 * speed;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════
  return { group, parts, description, quizQuestions, animate };
}
