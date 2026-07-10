// ============================================================================
// GOD TIER — KARDASHEV TYPE V CIVILIZATION NEXUS
// A hyper-structure that transcends the observable universe, harvesting energy
// from the fabric of spacetime itself, breaching cosmological horizons, and
// interfacing with parallel universes via multiverse connection nodes.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // ========================================================================
    //  CUSTOM MATERIALS — exotic, emissive, holographic, god-tier aesthetics
    // ========================================================================
    const voidBlack = new THREE.MeshStandardMaterial({
        color: 0x020208, roughness: 0.05, metalness: 1.0,
        emissive: 0x050510, emissiveIntensity: 0.15
    });
    const cosmicGold = new THREE.MeshStandardMaterial({
        color: 0xffd700, roughness: 0.15, metalness: 1.0,
        emissive: 0xffa500, emissiveIntensity: 0.6
    });
    const quantumBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff, roughness: 0.1, metalness: 0.9,
        emissive: 0x0066ff, emissiveIntensity: 0.9, transparent: true, opacity: 0.85
    });
    const multiversePurple = new THREE.MeshStandardMaterial({
        color: 0x9933ff, roughness: 0.08, metalness: 1.0,
        emissive: 0x7700cc, emissiveIntensity: 1.2, transparent: true, opacity: 0.7
    });
    const realityRed = new THREE.MeshStandardMaterial({
        color: 0xff2222, roughness: 0.12, metalness: 0.95,
        emissive: 0xff0000, emissiveIntensity: 1.0, transparent: true, opacity: 0.75
    });
    const spacetimeGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88, roughness: 0.1, metalness: 0.85,
        emissive: 0x00cc66, emissiveIntensity: 0.8, transparent: true, opacity: 0.8
    });
    const horizonWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff, roughness: 0.0, metalness: 1.0,
        emissive: 0xffffff, emissiveIntensity: 1.5, transparent: true, opacity: 0.3
    });
    const darkEnergy = new THREE.MeshStandardMaterial({
        color: 0x110022, roughness: 0.02, metalness: 1.0,
        emissive: 0x220044, emissiveIntensity: 0.5, transparent: true, opacity: 0.6
    });
    const holographicCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, roughness: 0.0, metalness: 1.0,
        emissive: 0x00ffff, emissiveIntensity: 1.8, transparent: true, opacity: 0.45
    });
    const singularityOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600, roughness: 0.05, metalness: 1.0,
        emissive: 0xff4400, emissiveIntensity: 1.4, transparent: true, opacity: 0.65
    });
    const neutrinoMat = new THREE.MeshStandardMaterial({
        color: 0xccccff, roughness: 0.0, metalness: 0.5,
        emissive: 0x8888ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.25
    });

    // ========================================================================
    //  HELPER: Create geodesic sphere (icosahedron-based, more complex topology)
    // ========================================================================
    function createGeodesicSphere(radius, detail, material) {
        const geo = new THREE.IcosahedronGeometry(radius, detail);
        return new THREE.Mesh(geo, material);
    }

    // ========================================================================
    //  HELPER: Create a toroidal knot (for exotic energy conduits)
    // ========================================================================
    function createTorusKnot(radius, tube, p, q, material) {
        const geo = new THREE.TorusKnotGeometry(radius, tube, 256, 32, p, q);
        return new THREE.Mesh(geo, material);
    }

    // ========================================================================
    //  HELPER: Create tube along a 3D curve
    // ========================================================================
    function createTubeAlongCurve(points, radius, material, segments = 128) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, segments, radius, 16, false);
        return new THREE.Mesh(geo, material);
    }

    // ========================================================================
    //  HELPER: Create ring of objects
    // ========================================================================
    function createRing(count, radius, createFn, parentGroup, tiltX = 0, tiltZ = 0) {
        const ring = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const obj = createFn(i, angle);
            obj.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            ring.add(obj);
        }
        ring.rotation.x = tiltX;
        ring.rotation.z = tiltZ;
        parentGroup.add(ring);
        return ring;
    }

    // ========================================================================
    //  1. CENTRAL SINGULARITY CORE — The Nexus Heart
    //     A rotating multi-layered core with nested geodesic shells
    // ========================================================================
    const coreGroup = new THREE.Group();

    // Innermost singularity — a dense glowing sphere
    const singularityCore = createGeodesicSphere(0.6, 4, singularityOrange);
    coreGroup.add(singularityCore);

    // Second layer — wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const cageWire = new THREE.MeshStandardMaterial({
        color: 0xff8800, wireframe: true, emissive: 0xff6600, emissiveIntensity: 1.0
    });
    const singularityCage = new THREE.Mesh(cageGeo, cageWire);
    coreGroup.add(singularityCage);

    // Third layer — translucent quantum shell
    const quantumShell = createGeodesicSphere(1.1, 3, quantumBlue);
    coreGroup.add(quantumShell);

    // Fourth layer — dark energy containment
    const darkShell = createGeodesicSphere(1.4, 2, darkEnergy);
    coreGroup.add(darkShell);

    // Fifth layer — holographic information boundary (Bekenstein bound)
    const holoBoundary = createGeodesicSphere(1.7, 5, holographicCyan);
    coreGroup.add(holoBoundary);

    // Sixth layer — outer void shell
    const voidShell = createGeodesicSphere(2.0, 3, voidBlack);
    coreGroup.add(voidShell);

    // Rotating energy filaments inside the core (toroidal knots)
    const innerKnot1 = createTorusKnot(0.7, 0.03, 2, 3, realityRed);
    coreGroup.add(innerKnot1);
    const innerKnot2 = createTorusKnot(0.9, 0.025, 3, 5, spacetimeGreen);
    innerKnot2.rotation.x = Math.PI / 3;
    coreGroup.add(innerKnot2);
    const innerKnot3 = createTorusKnot(1.05, 0.02, 5, 7, multiversePurple);
    innerKnot3.rotation.z = Math.PI / 4;
    coreGroup.add(innerKnot3);

    group.add(coreGroup);

    // ========================================================================
    //  2. OBSERVABLE UNIVERSE VISUALIZATION — Hubble Volume Boundary
    //     Giant translucent sphere representing the 46.5 Gly co-moving radius
    // ========================================================================
    const hubbleGroup = new THREE.Group();

    // Main Hubble volume sphere — translucent with cosmic microwave background tint
    const hubbleGeo = new THREE.SphereGeometry(12, 128, 64);
    const hubbleMat = new THREE.MeshStandardMaterial({
        color: 0x111133, roughness: 0.0, metalness: 0.3,
        emissive: 0x080820, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.08, side: THREE.DoubleSide
    });
    const hubbleSphere = new THREE.Mesh(hubbleGeo, hubbleMat);
    hubbleGroup.add(hubbleSphere);

    // Hubble boundary wireframe — the cosmological horizon
    const hubbleWireGeo = new THREE.IcosahedronGeometry(12.05, 4);
    const hubbleWireMat = new THREE.MeshStandardMaterial({
        color: 0x4444aa, wireframe: true, emissive: 0x2222ff, emissiveIntensity: 0.4,
        transparent: true, opacity: 0.2
    });
    const hubbleWire = new THREE.Mesh(hubbleWireGeo, hubbleWireMat);
    hubbleGroup.add(hubbleWire);

    // Particle horizon ring — glowing equatorial marker
    const particleHorizonGeo = new THREE.TorusGeometry(12, 0.04, 16, 256);
    const particleHorizon = new THREE.Mesh(particleHorizonGeo, horizonWhite);
    hubbleGroup.add(particleHorizon);

    // Second horizon ring (tilted 60°)
    const particleHorizon2 = new THREE.Mesh(particleHorizonGeo.clone(), horizonWhite);
    particleHorizon2.rotation.x = Math.PI / 3;
    hubbleGroup.add(particleHorizon2);

    // Third horizon ring (tilted 120°)
    const particleHorizon3 = new THREE.Mesh(particleHorizonGeo.clone(), horizonWhite);
    particleHorizon3.rotation.x = (2 * Math.PI) / 3;
    hubbleGroup.add(particleHorizon3);

    // Cosmic web filaments — large-scale structure of the universe
    const cosmicWebFilaments = [];
    for (let i = 0; i < 40; i++) {
        const startTheta = Math.random() * Math.PI * 2;
        const startPhi = Math.random() * Math.PI;
        const endTheta = startTheta + (Math.random() - 0.5) * 2;
        const endPhi = startPhi + (Math.random() - 0.5) * 1.5;
        const r1 = 2.5 + Math.random() * 8;
        const r2 = 2.5 + Math.random() * 8;
        const midR = (r1 + r2) / 2 + (Math.random() - 0.5) * 3;
        const midTheta = (startTheta + endTheta) / 2;
        const midPhi = (startPhi + endPhi) / 2;
        const points = [
            new THREE.Vector3(
                r1 * Math.sin(startPhi) * Math.cos(startTheta),
                r1 * Math.cos(startPhi),
                r1 * Math.sin(startPhi) * Math.sin(startTheta)
            ),
            new THREE.Vector3(
                midR * Math.sin(midPhi) * Math.cos(midTheta),
                midR * Math.cos(midPhi),
                midR * Math.sin(midPhi) * Math.sin(midTheta)
            ),
            new THREE.Vector3(
                r2 * Math.sin(endPhi) * Math.cos(endTheta),
                r2 * Math.cos(endPhi),
                r2 * Math.sin(endPhi) * Math.sin(endTheta)
            )
        ];
        const filament = createTubeAlongCurve(points, 0.015 + Math.random() * 0.02, neutrinoMat, 48);
        hubbleGroup.add(filament);
        cosmicWebFilaments.push(filament);
    }

    // Galaxy cluster nodes along the cosmic web
    const galaxyClusters = [];
    for (let i = 0; i < 60; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 3 + Math.random() * 8;
        const clusterSize = 0.05 + Math.random() * 0.12;
        const cluster = createGeodesicSphere(clusterSize, 2, new THREE.MeshStandardMaterial({
            color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 0.8 + Math.random() * 0.5,
            transparent: true, opacity: 0.5 + Math.random() * 0.3
        }));
        cluster.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
        hubbleGroup.add(cluster);
        galaxyClusters.push(cluster);
    }

    group.add(hubbleGroup);

    // ========================================================================
    //  3. MULTIVERSE CONNECTION POINTS — Breaching the Cosmological Horizon
    //     12 massive portal structures arranged beyond the Hubble boundary
    // ========================================================================
    const multiverseGroup = new THREE.Group();
    const portalMeshes = [];
    const portalCount = 12;

    for (let i = 0; i < portalCount; i++) {
        const angle = (i / portalCount) * Math.PI * 2;
        const elevation = ((i % 3) - 1) * 3.5;
        const portalR = 14;
        const portalNode = new THREE.Group();

        // Outer portal ring — massive torus
        const outerRingGeo = new THREE.TorusGeometry(1.8, 0.12, 32, 128);
        const outerRing = new THREE.Mesh(outerRingGeo, multiversePurple);
        portalNode.add(outerRing);

        // Inner event horizon disc — swirling void
        const horizonDiscGeo = new THREE.CircleGeometry(1.65, 64);
        const horizonDiscMat = new THREE.MeshStandardMaterial({
            color: 0x110033, emissive: 0x220066, emissiveIntensity: 0.8,
            transparent: true, opacity: 0.6, side: THREE.DoubleSide
        });
        const horizonDisc = new THREE.Mesh(horizonDiscGeo, horizonDiscMat);
        portalNode.add(horizonDisc);

        // Portal frame — ornate octagonal structure
        for (let s = 0; s < 8; s++) {
            const strutAngle = (s / 8) * Math.PI * 2;
            const strutGeo = new THREE.CylinderGeometry(0.06, 0.04, 2.0, 8);
            const strut = new THREE.Mesh(strutGeo, cosmicGold);
            strut.position.set(Math.cos(strutAngle) * 1.9, Math.sin(strutAngle) * 1.9, 0);
            strut.rotation.z = strutAngle + Math.PI / 2;
            portalNode.add(strut);

            // Emissive node at each strut tip
            const nodeSphere = createGeodesicSphere(0.08, 2, holographicCyan);
            nodeSphere.position.set(Math.cos(strutAngle) * 2.1, Math.sin(strutAngle) * 2.1, 0);
            portalNode.add(nodeSphere);
        }

        // Conduit tube connecting portal to the core
        const conduitPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -portalR * 0.3),
            new THREE.Vector3(0, -elevation * 0.5, -portalR * 0.7),
            new THREE.Vector3(0, -elevation, -portalR + 2)
        ];
        const conduit = createTubeAlongCurve(conduitPoints, 0.04, quantumBlue, 64);
        portalNode.add(conduit);

        // Position portal in space beyond Hubble boundary
        portalNode.position.set(
            Math.cos(angle) * portalR,
            elevation,
            Math.sin(angle) * portalR
        );
        portalNode.lookAt(0, 0, 0);

        multiverseGroup.add(portalNode);
        portalMeshes.push({ node: portalNode, ring: outerRing, disc: horizonDisc, angle });
    }

    group.add(multiverseGroup);

    // ========================================================================
    //  4. SPACETIME ENERGY EXTRACTION LATTICE
    //     A complex 3D lattice of vacuum energy extraction nodes
    // ========================================================================
    const extractionGroup = new THREE.Group();
    const extractionNodes = [];

    // Octahedral lattice of extraction points
    const latticePositions = [];
    const latticeSpacing = 3.5;
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            for (let z = -2; z <= 2; z++) {
                const dist = Math.sqrt(x * x + y * y + z * z);
                if (dist > 0.5 && dist <= 2.5) {
                    latticePositions.push(new THREE.Vector3(
                        x * latticeSpacing, y * latticeSpacing, z * latticeSpacing
                    ));
                }
            }
        }
    }

    latticePositions.forEach((pos, idx) => {
        const nodeGroup = new THREE.Group();

        // Vacuum energy extraction sphere
        const extractSphere = createGeodesicSphere(0.2, 3, spacetimeGreen);
        nodeGroup.add(extractSphere);

        // Casimir plate pair — two parallel discs
        const plateGeo = new THREE.RingGeometry(0.1, 0.35, 32);
        const plate1 = new THREE.Mesh(plateGeo, chrome);
        plate1.position.z = 0.08;
        const plate2 = new THREE.Mesh(plateGeo.clone(), chrome);
        plate2.position.z = -0.08;
        nodeGroup.add(plate1);
        nodeGroup.add(plate2);

        // Rotating collection antenna
        const antennaGeo = new THREE.TorusGeometry(0.3, 0.015, 8, 48);
        const antenna = new THREE.Mesh(antennaGeo, cosmicGold);
        antenna.rotation.x = Math.PI / 2;
        nodeGroup.add(antenna);

        nodeGroup.position.copy(pos);
        extractionGroup.add(nodeGroup);
        extractionNodes.push({ group: nodeGroup, sphere: extractSphere, antenna, idx });
    });

    // Inter-node energy conduits
    const conduitPairs = [];
    for (let i = 0; i < latticePositions.length; i++) {
        for (let j = i + 1; j < latticePositions.length; j++) {
            const dist = latticePositions[i].distanceTo(latticePositions[j]);
            if (dist < latticeSpacing * 1.5) {
                const conduit = createTubeAlongCurve(
                    [latticePositions[i], latticePositions[j]],
                    0.01, quantumBlue, 16
                );
                extractionGroup.add(conduit);
                conduitPairs.push(conduit);
            }
        }
    }

    group.add(extractionGroup);

    // ========================================================================
    //  5. REALITY MANIPULATION ARRAYS
    //     Three concentric gyroscopic rings with manipulation emitters
    // ========================================================================
    const realityGroup = new THREE.Group();
    const realityRings = [];

    // Create three massive gyroscopic rings at different tilts
    const ringConfigs = [
        { radius: 5.5, tube: 0.08, tiltX: 0, tiltY: 0, mat: realityRed },
        { radius: 6.2, tube: 0.07, tiltX: Math.PI / 4, tiltY: Math.PI / 6, mat: multiversePurple },
        { radius: 6.9, tube: 0.06, tiltX: -Math.PI / 3, tiltY: Math.PI / 3, mat: cosmicGold }
    ];

    ringConfigs.forEach((cfg, rIdx) => {
        const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 24, 256);
        const ring = new THREE.Mesh(ringGeo, cfg.mat);
        ring.rotation.x = cfg.tiltX;
        ring.rotation.y = cfg.tiltY;

        // Add emitter nodes along each ring
        const emitterCount = 24;
        const emitters = [];
        for (let e = 0; e < emitterCount; e++) {
            const eAngle = (e / emitterCount) * Math.PI * 2;
            const emitterGroup = new THREE.Group();

            // Emitter crystal — elongated octahedron
            const crystalGeo = new THREE.OctahedronGeometry(0.12, 0);
            const crystal = new THREE.Mesh(crystalGeo, holographicCyan);
            crystal.scale.set(1, 2.5, 1);
            emitterGroup.add(crystal);

            // Emitter mounting bracket
            const bracketGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.15, 6);
            const bracket = new THREE.Mesh(bracketGeo, darkSteel);
            bracket.position.y = -0.2;
            emitterGroup.add(bracket);

            emitterGroup.position.set(
                Math.cos(eAngle) * cfg.radius,
                Math.sin(eAngle) * cfg.radius,
                0
            );
            emitterGroup.lookAt(0, 0, 0);

            emitters.push({ group: emitterGroup, crystal });
        }

        const ringGroup = new THREE.Group();
        ringGroup.add(ring);
        emitters.forEach(em => ringGroup.add(em.group));
        ringGroup.rotation.x = cfg.tiltX;
        ringGroup.rotation.y = cfg.tiltY;

        realityGroup.add(ringGroup);
        realityRings.push({ ringGroup, ring, emitters, cfg });
    });

    group.add(realityGroup);

    // ========================================================================
    //  6. DIMENSIONAL ANCHORING PYLONS — Six massive pylons on axes
    // ========================================================================
    const pylonGroup = new THREE.Group();
    const pylons = [];
    const pylonDirs = [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];

    pylonDirs.forEach((dir, pIdx) => {
        const pylon = new THREE.Group();

        // Main pylon shaft — tapered cylinder using LatheGeometry
        const shaftPts = [];
        for (let s = 0; s <= 20; s++) {
            const t = s / 20;
            const r = 0.25 * (1 - t * 0.6) + 0.05 * Math.sin(t * Math.PI * 4);
            shaftPts.push(new THREE.Vector2(r, t * 8));
        }
        const shaftGeo = new THREE.LatheGeometry(shaftPts, 32);
        const shaft = new THREE.Mesh(shaftGeo, darkSteel);
        pylon.add(shaft);

        // Pylon energy collector at tip
        const collectorGeo = new THREE.DodecahedronGeometry(0.35, 1);
        const collector = new THREE.Mesh(collectorGeo, singularityOrange);
        collector.position.y = 8;
        pylon.add(collector);

        // Pylon base mounting ring
        const baseRingGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 32);
        const baseRing = new THREE.Mesh(baseRingGeo, cosmicGold);
        baseRing.rotation.x = Math.PI / 2;
        pylon.add(baseRing);

        // Energy flow tube from collector to core
        const flowPoints = [
            new THREE.Vector3(0, 8, 0),
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(0, 0, 0)
        ];
        const flowTube = createTubeAlongCurve(flowPoints, 0.02, quantumBlue, 32);
        pylon.add(flowTube);

        // Stabilizer fins (4 per pylon)
        for (let f = 0; f < 4; f++) {
            const finAngle = (f / 4) * Math.PI * 2;
            const finShape = new THREE.Shape();
            finShape.moveTo(0, 0);
            finShape.lineTo(0.6, 0);
            finShape.lineTo(0.3, 2);
            finShape.lineTo(0, 2);
            finShape.closePath();
            const finExtrudeSettings = { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 };
            const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(Math.cos(finAngle) * 0.25, 1, Math.sin(finAngle) * 0.25);
            fin.rotation.y = -finAngle;
            pylon.add(fin);
        }

        // Orient pylon along its axis direction
        const target = new THREE.Vector3(dir[0], dir[1], dir[2]);
        pylon.lookAt(target.multiplyScalar(100));
        pylon.position.set(dir[0] * 2.5, dir[1] * 2.5, dir[2] * 2.5);

        pylonGroup.add(pylon);
        pylons.push({ group: pylon, collector, shaft });
    });

    group.add(pylonGroup);

    // ========================================================================
    //  7. INFORMATION PROCESSING DYSON BRAIN
    //     A complex lattice of computational nodes surrounding the core
    // ========================================================================
    const brainGroup = new THREE.Group();
    const brainNodes = [];

    // Fibonacci sphere distribution for brain nodes
    const brainNodeCount = 80;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < brainNodeCount; i++) {
        const y = 1 - (i / (brainNodeCount - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const brainR = 3.8;

        const nodeGrp = new THREE.Group();

        // Processing unit — dodecahedron
        const procGeo = new THREE.DodecahedronGeometry(0.08, 0);
        const procNode = new THREE.Mesh(procGeo, holographicCyan);
        nodeGrp.add(procNode);

        // Memory crystal
        const memGeo = new THREE.OctahedronGeometry(0.05, 0);
        const memCrystal = new THREE.Mesh(memGeo, quantumBlue);
        memCrystal.position.y = 0.12;
        nodeGrp.add(memCrystal);

        nodeGrp.position.set(
            radiusAtY * Math.cos(theta) * brainR,
            y * brainR,
            radiusAtY * Math.sin(theta) * brainR
        );

        brainGroup.add(nodeGrp);
        brainNodes.push({ group: nodeGrp, procNode, memCrystal });
    }

    // Interconnection filaments between nearby brain nodes
    for (let i = 0; i < brainNodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, brainNodes.length); j++) {
            const p1 = brainNodes[i].group.position;
            const p2 = brainNodes[j].group.position;
            if (p1.distanceTo(p2) < 2.5) {
                const filament = createTubeAlongCurve([p1.clone(), p2.clone()], 0.005, neutrinoMat, 8);
                brainGroup.add(filament);
            }
        }
    }

    group.add(brainGroup);

    // ========================================================================
    //  8. GRAVITATIONAL WAVE ANTENNA ARRAY
    //     Massive interferometer arms extending from the nexus
    // ========================================================================
    const antennaGroup = new THREE.Group();
    const gwAntennas = [];

    for (let arm = 0; arm < 6; arm++) {
        const armAngle = (arm / 6) * Math.PI * 2;
        const armGroup = new THREE.Group();

        // Main interferometer arm
        const armLength = 10;
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, armLength, 16);
        const armMesh = new THREE.Mesh(armGeo, chrome);
        armMesh.position.y = armLength / 2;
        armGroup.add(armMesh);

        // Test mass at end
        const testMassGeo = new THREE.SphereGeometry(0.15, 32, 16);
        const testMass = new THREE.Mesh(testMassGeo, cosmicGold);
        testMass.position.y = armLength;
        armGroup.add(testMass);

        // Laser beam tube
        const laserGeo = new THREE.CylinderGeometry(0.008, 0.008, armLength, 8);
        const laserMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0,
            transparent: true, opacity: 0.4
        });
        const laser = new THREE.Mesh(laserGeo, laserMat);
        laser.position.y = armLength / 2;
        armGroup.add(laser);

        // Suspension wires (4 per test mass)
        for (let w = 0; w < 4; w++) {
            const wAngle = (w / 4) * Math.PI * 2;
            const wireGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.5, 4);
            const wire = new THREE.Mesh(wireGeo, steel);
            wire.position.set(
                Math.cos(wAngle) * 0.1,
                armLength - 0.25,
                Math.sin(wAngle) * 0.1
            );
            armGroup.add(wire);
        }

        // Orient arm outward
        armGroup.rotation.z = -Math.PI / 2;
        armGroup.rotation.y = armAngle;
        armGroup.position.set(
            Math.cos(armAngle) * 2,
            ((arm % 2) - 0.5) * 2,
            Math.sin(armAngle) * 2
        );

        antennaGroup.add(armGroup);
        gwAntennas.push({ group: armGroup, testMass, laser });
    }

    group.add(antennaGroup);

    // ========================================================================
    //  9. COSMIC STRING HARVESTER TENDRILS
    //     Long, sinuous energy-harvesting tendrils reaching out into space
    // ========================================================================
    const tendrilGroup = new THREE.Group();
    const tendrils = [];

    for (let t = 0; t < 16; t++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const tendrilLength = 8 + Math.random() * 5;
        const segments = 12;
        const tendrilPts = [];

        for (let s = 0; s <= segments; s++) {
            const frac = s / segments;
            const r = 2 + frac * tendrilLength;
            const wobbleX = Math.sin(frac * Math.PI * 3 + t) * 0.8 * frac;
            const wobbleZ = Math.cos(frac * Math.PI * 2.5 + t * 0.7) * 0.8 * frac;
            tendrilPts.push(new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta) + wobbleX,
                r * Math.cos(phi) + wobbleZ,
                r * Math.sin(phi) * Math.sin(theta) + wobbleX * 0.5
            ));
        }

        const tendrilMat = new THREE.MeshStandardMaterial({
            color: 0x00ffaa, emissive: 0x00cc88, emissiveIntensity: 0.5 + Math.random() * 0.5,
            transparent: true, opacity: 0.35
        });
        const tendril = createTubeAlongCurve(tendrilPts, 0.02 + Math.random() * 0.02, tendrilMat, 64);
        tendrilGroup.add(tendril);
        tendrils.push(tendril);

        // Harvester node at tendril tip
        const tipSphere = createGeodesicSphere(0.1, 2, spacetimeGreen);
        tipSphere.position.copy(tendrilPts[tendrilPts.length - 1]);
        tendrilGroup.add(tipSphere);
    }

    group.add(tendrilGroup);

    // ========================================================================
    //  10. DE SITTER SPACE METRIC VISUALIZER
    //      A hyperbolic grid representing the de Sitter spacetime geometry
    // ========================================================================
    const deSitterGroup = new THREE.Group();

    // Concentric rings representing constant-time slices
    for (let r = 0; r < 8; r++) {
        const deSitterR = 3 + r * 1.2;
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x4444ff, emissive: 0x2222aa, emissiveIntensity: 0.3 * (1 - r / 8),
            transparent: true, opacity: 0.15 - r * 0.012, wireframe: true
        });
        const dsRing = new THREE.Mesh(
            new THREE.TorusGeometry(deSitterR, 0.01, 8, 128), ringMat
        );
        dsRing.rotation.x = Math.PI / 2;
        deSitterGroup.add(dsRing);
    }

    // Radial geodesics
    for (let g = 0; g < 24; g++) {
        const gAngle = (g / 24) * Math.PI * 2;
        const geodesicPts = [];
        for (let s = 0; s <= 10; s++) {
            const frac = s / 10;
            const gr = 3 + frac * 9.6;
            geodesicPts.push(new THREE.Vector3(
                Math.cos(gAngle) * gr, 0, Math.sin(gAngle) * gr
            ));
        }
        const geodesic = createTubeAlongCurve(geodesicPts, 0.005, neutrinoMat, 16);
        deSitterGroup.add(geodesic);
    }

    group.add(deSitterGroup);

    // ========================================================================
    //  11. HOLOGRAPHIC PRINCIPLE BOUNDARY LAYER
    //      Information-theoretic surface encoding the bulk volume
    // ========================================================================
    const holoPrincipleGroup = new THREE.Group();

    // Holographic encoding surface — slightly inside the Hubble boundary
    const holoSurfaceGeo = new THREE.IcosahedronGeometry(11, 6);
    const holoSurfaceMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.15,
        transparent: true, opacity: 0.04, wireframe: true
    });
    const holoSurface = new THREE.Mesh(holoSurfaceGeo, holoSurfaceMat);
    holoPrincipleGroup.add(holoSurface);

    // Information density hotspots on the holographic boundary
    const infoHotspots = [];
    for (let h = 0; h < 30; h++) {
        const hTheta = Math.random() * Math.PI * 2;
        const hPhi = Math.random() * Math.PI;
        const hR = 11;
        const hotspot = createGeodesicSphere(0.06 + Math.random() * 0.06, 2, new THREE.MeshStandardMaterial({
            color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 1.2,
            transparent: true, opacity: 0.6
        }));
        hotspot.position.set(
            hR * Math.sin(hPhi) * Math.cos(hTheta),
            hR * Math.cos(hPhi),
            hR * Math.sin(hPhi) * Math.sin(hTheta)
        );
        holoPrincipleGroup.add(hotspot);
        infoHotspots.push(hotspot);
    }

    group.add(holoPrincipleGroup);

    // ========================================================================
    //  12. DARK MATTER SCAFFOLD — invisible mass framework
    // ========================================================================
    const darkMatterGroup = new THREE.Group();

    // Dark matter halo — large translucent sphere
    const dmHaloGeo = new THREE.SphereGeometry(9, 32, 16);
    const dmHaloMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a1a, emissive: 0x060612, emissiveIntensity: 0.1,
        transparent: true, opacity: 0.03, side: THREE.DoubleSide
    });
    const dmHalo = new THREE.Mesh(dmHaloGeo, dmHaloMat);
    darkMatterGroup.add(dmHalo);

    // Dark matter filament skeleton
    for (let dm = 0; dm < 20; dm++) {
        const dmPts = [];
        const dmStart = new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16
        );
        const dmEnd = new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16
        );
        dmPts.push(dmStart, dmEnd);
        const dmFilament = createTubeAlongCurve(dmPts, 0.008, darkEnergy, 8);
        darkMatterGroup.add(dmFilament);
    }

    group.add(darkMatterGroup);

    // ========================================================================
    //  13. ENTROPY REVERSAL ENGINE — Maxwell's Demon at cosmic scale
    // ========================================================================
    const entropyGroup = new THREE.Group();

    // Central entropy processor — complex shape via ExtrudeGeometry
    const entropyShape = new THREE.Shape();
    entropyShape.moveTo(0, 0);
    for (let ep = 0; ep < 12; ep++) {
        const epAngle = (ep / 12) * Math.PI * 2;
        const epR = ep % 2 === 0 ? 0.5 : 0.3;
        entropyShape.lineTo(Math.cos(epAngle) * epR, Math.sin(epAngle) * epR);
    }
    entropyShape.closePath();
    const entropyExtrudeSettings = {
        depth: 0.4, bevelEnabled: true, bevelThickness: 0.05,
        bevelSize: 0.05, bevelSegments: 4
    };
    const entropyGeo = new THREE.ExtrudeGeometry(entropyShape, entropyExtrudeSettings);
    const entropyProcessor = new THREE.Mesh(entropyGeo, chrome);
    entropyProcessor.position.set(0, 4, 0);
    entropyGroup.add(entropyProcessor);

    // Thermal gradient pipes
    for (let tp = 0; tp < 8; tp++) {
        const tpAngle = (tp / 8) * Math.PI * 2;
        const pipePts = [
            new THREE.Vector3(Math.cos(tpAngle) * 0.6, 4, Math.sin(tpAngle) * 0.6),
            new THREE.Vector3(Math.cos(tpAngle) * 1.5, 4 + Math.sin(tpAngle) * 0.5, Math.sin(tpAngle) * 1.5),
            new THREE.Vector3(Math.cos(tpAngle) * 2.5, 3.5, Math.sin(tpAngle) * 2.5)
        ];
        const pipe = createTubeAlongCurve(pipePts, 0.02, copper, 24);
        entropyGroup.add(pipe);
    }

    group.add(entropyGroup);

    // ========================================================================
    //  14. VACUUM DECAY SHIELD GENERATORS
    // ========================================================================
    const shieldGroup = new THREE.Group();
    const shieldGenerators = [];

    // 20 shield generators on a sphere at radius 4.5
    for (let sg = 0; sg < 20; sg++) {
        const sgTheta = goldenAngle * sg;
        const sgY = 1 - (sg / 19) * 2;
        const sgR = Math.sqrt(1 - sgY * sgY);

        const genGroup = new THREE.Group();

        // Generator housing
        const housingGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 8);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        genGroup.add(housing);

        // Shield emitter dish
        const dishGeo = new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const dish = new THREE.Mesh(dishGeo, cosmicGold);
        dish.position.y = 0.15;
        genGroup.add(dish);

        // Emitter glow
        const emGlowGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const emGlow = new THREE.Mesh(emGlowGeo, holographicCyan);
        emGlow.position.y = 0.2;
        genGroup.add(emGlow);

        genGroup.position.set(
            sgR * Math.cos(sgTheta) * 4.5,
            sgY * 4.5,
            sgR * Math.sin(sgTheta) * 4.5
        );
        genGroup.lookAt(0, 0, 0);

        shieldGroup.add(genGroup);
        shieldGenerators.push({ group: genGroup, glow: emGlow });
    }

    // Shield field — translucent dodecahedron
    const shieldFieldGeo = new THREE.DodecahedronGeometry(4.8, 2);
    const shieldFieldMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x0044ff, emissiveIntensity: 0.2,
        transparent: true, opacity: 0.04, wireframe: true
    });
    const shieldField = new THREE.Mesh(shieldFieldGeo, shieldFieldMat);
    shieldGroup.add(shieldField);

    group.add(shieldGroup);

    // ========================================================================
    //  15. QUANTUM ENTANGLEMENT COMMUNICATION ARRAY
    // ========================================================================
    const qeCommGroup = new THREE.Group();
    const qeNodes = [];

    // 8 entangled pairs
    for (let qp = 0; qp < 8; qp++) {
        const qAngle = (qp / 8) * Math.PI * 2;

        // Node A (near core)
        const nodeA = createGeodesicSphere(0.1, 2, quantumBlue);
        nodeA.position.set(Math.cos(qAngle) * 3, 0, Math.sin(qAngle) * 3);
        qeCommGroup.add(nodeA);

        // Node B (far, near Hubble boundary)
        const nodeB = createGeodesicSphere(0.1, 2, quantumBlue);
        nodeB.position.set(Math.cos(qAngle) * 10, 0, Math.sin(qAngle) * 10);
        qeCommGroup.add(nodeB);

        // Entanglement link
        const linkMat = new THREE.MeshStandardMaterial({
            color: 0x00ccff, emissive: 0x0088ff, emissiveIntensity: 0.8,
            transparent: true, opacity: 0.2
        });
        const link = createTubeAlongCurve(
            [nodeA.position.clone(), nodeB.position.clone()],
            0.008, linkMat, 16
        );
        qeCommGroup.add(link);

        qeNodes.push({ nodeA, nodeB, link });
    }

    group.add(qeCommGroup);

    // ========================================================================
    //  MESHES COLLECTION for animation references
    // ========================================================================
    const meshes = {
        singularityCore, singularityCage, quantumShell, darkShell,
        holoBoundary, voidShell, innerKnot1, innerKnot2, innerKnot3,
        hubbleSphere, hubbleWire, particleHorizon, particleHorizon2, particleHorizon3,
        portalMeshes, extractionNodes, realityRings, pylons,
        brainNodes, gwAntennas, galaxyClusters, infoHotspots,
        shieldGenerators, shieldField, entropyProcessor, holoSurface,
        qeNodes, cosmicWebFilaments,
        coreGroup, hubbleGroup, multiverseGroup, extractionGroup,
        realityGroup, brainGroup, tendrilGroup, deSitterGroup,
        holoPrincipleGroup, darkMatterGroup, entropyGroup, shieldGroup, qeCommGroup
    };

    // ========================================================================
    //  PARTS — 20+ richly detailed engineering parts
    // ========================================================================
    const parts = [
        {
            name: 'Singularity Core',
            description: 'A six-layered nested geodesic shell system encasing a controlled artificial singularity. The innermost shell is a Planck-density energy source, surrounded by quantum containment, dark energy dampening, and a Bekenstein-bound holographic information layer.',
            material: 'Exotic matter / Planck-scale metamaterial',
            function: 'Primary energy source — extracts zero-point energy from a stabilized micro-singularity at 10^19 GeV',
            assemblyOrder: 1,
            connections: ['Dimensional Anchoring Pylons', 'Energy Extraction Lattice', 'Dyson Brain'],
            failureEffect: 'Uncontrolled singularity evaporation via Hawking radiation, potential false vacuum collapse',
            cascadeFailures: ['Reality Manipulation Arrays', 'Vacuum Decay Shield'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        },
        {
            name: 'Hubble Volume Boundary',
            description: 'A 12-unit-radius translucent sphere with wireframe cosmological horizon markers and three orthogonal particle horizon rings, visualizing the 46.5 billion light-year co-moving radius of the observable universe.',
            material: 'Stabilized spacetime membrane / Photonic crystal lattice',
            function: 'Defines the causal boundary of the Nexus operational range within the observable universe',
            assemblyOrder: 2,
            connections: ['Multiverse Connection Points', 'Holographic Boundary Layer'],
            failureEffect: 'Loss of causal coherence — operations beyond light cone become uncontrollable',
            cascadeFailures: ['Multiverse Connection Points', 'Cosmic String Harvesters'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 20, z: 0 }
        },
        {
            name: 'Multiverse Connection Points',
            description: '12 massive portal structures positioned beyond the Hubble boundary, each with an octagonal frame, event horizon disc, and 8 emissive stabilizer nodes. Connected to the core via quantum-coherent conduits.',
            material: 'Topological defect-stabilized exotic matter / Alcubierre-class negative energy',
            function: 'Breach the cosmological horizon to establish stable Einstein-Rosen bridges to parallel universe branches',
            assemblyOrder: 3,
            connections: ['Hubble Volume Boundary', 'Singularity Core', 'Quantum Entanglement Array'],
            failureEffect: 'Uncontrolled dimensional bleed-through, potential merging of incompatible physical constants',
            cascadeFailures: ['Reality Manipulation Arrays', 'Vacuum Decay Shield'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -25, z: 0 }
        },
        {
            name: 'Spacetime Energy Extraction Lattice',
            description: 'A 3D lattice of ~90 vacuum energy extraction nodes arranged in an octahedral pattern, each featuring Casimir plate pairs and rotating collection antennae, interconnected by quantum-coherent energy conduits.',
            material: 'Casimir-effect nanoplates / Superconducting metamaterial',
            function: 'Harvests zero-point energy from quantum vacuum fluctuations across the lattice volume using the Casimir effect at cosmological scale',
            assemblyOrder: 4,
            connections: ['Singularity Core', 'Dimensional Anchoring Pylons', 'Entropy Reversal Engine'],
            failureEffect: 'Localized vacuum energy depletion creating negative-pressure bubbles',
            cascadeFailures: ['Entropy Reversal Engine', 'Cosmic String Harvesters'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 25, y: 0, z: 0 }
        },
        {
            name: 'Reality Manipulation Arrays',
            description: 'Three concentric gyroscopic rings (radii 5.5, 6.2, 6.9) with 24 holographic crystal emitters each, tilted at different angles to provide full spherical coverage for reality-editing beam emission.',
            material: 'Phase-conjugate holographic crystal / Planck-frequency resonator',
            function: 'Emits coherent reality-editing beams that can locally modify physical constants (α, G, ℏ) within targeted spacetime volumes',
            assemblyOrder: 5,
            connections: ['Singularity Core', 'Dyson Brain', 'Vacuum Decay Shield'],
            failureEffect: 'Uncontrolled constant variation — local physics becomes unpredictable (proton decay, etc.)',
            cascadeFailures: ['Vacuum Decay Shield', 'Holographic Boundary Layer'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -25, y: 0, z: 0 }
        },
        {
            name: 'Dimensional Anchoring Pylons',
            description: 'Six massive pylons oriented along ±X, ±Y, ±Z axes, each with LatheGeometry-profiled tapered shafts, dodecahedral energy collectors, and four stabilizer fins. They anchor the Nexus in its home dimension.',
            material: 'Neutronium-reinforced dark steel / Graviton-crystal alloy',
            function: 'Provides six-axis dimensional stability, preventing uncontrolled translation through higher-dimensional bulk space',
            assemblyOrder: 6,
            connections: ['Singularity Core', 'Energy Extraction Lattice', 'Shield Generators'],
            failureEffect: 'Dimensional drift — the Nexus begins translating through the bulk, losing its anchor in local spacetime',
            cascadeFailures: ['Multiverse Connection Points', 'Gravitational Wave Array'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 25 }
        },
        {
            name: 'Information Processing Dyson Brain',
            description: '80 computational nodes distributed via Fibonacci-sphere algorithm at radius 3.8, each containing a dodecahedral processing unit and octahedral memory crystal, interconnected by neutrino-flux filaments.',
            material: 'Topological quantum computing substrate / Bose-Einstein condensate logic gates',
            function: 'Performs 10^120 operations per second — sufficient to simulate entire universe histories for predictive modeling',
            assemblyOrder: 7,
            connections: ['Singularity Core', 'Reality Manipulation Arrays', 'Quantum Entanglement Array'],
            failureEffect: 'Loss of predictive capability — reality manipulation becomes blind, risking catastrophic unintended alterations',
            cascadeFailures: ['Reality Manipulation Arrays', 'Entropy Reversal Engine'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -25 }
        },
        {
            name: 'Gravitational Wave Antenna Array',
            description: 'Six interferometer arms extending from the core, each with a chrome shaft, gold test mass, laser beam tube, and four-wire suspension system. Detects spacetime ripples across all frequency bands.',
            material: 'Seismically-isolated fused silica / Squeezed-light laser emitters',
            function: 'Monitors spacetime curvature perturbations to detect incoming threats, dimensional incursions, and cosmic events at all scales',
            assemblyOrder: 8,
            connections: ['Dimensional Anchoring Pylons', 'Dyson Brain', 'De Sitter Metric Visualizer'],
            failureEffect: 'Loss of gravitational wave sensitivity — blind to approaching cosmic-scale threats',
            cascadeFailures: ['Dimensional Anchoring Pylons'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 20, y: 20, z: 0 }
        },
        {
            name: 'Cosmic String Harvester Tendrils',
            description: '16 sinuous energy-harvesting tendrils extending 8–13 units from the core, with oscillating 3D curves and glowing geodesic harvester nodes at their tips.',
            material: 'Topological defect tether / GUT-scale symmetry-breaking filament',
            function: 'Captures and redirects cosmic string defects to harvest their immense linear energy density (10^22 kg/m)',
            assemblyOrder: 9,
            connections: ['Energy Extraction Lattice', 'Hubble Volume Boundary'],
            failureEffect: 'Uncontrolled cosmic string whipping — gravitational lensing catastrophes in local volume',
            cascadeFailures: ['Hubble Volume Boundary', 'De Sitter Metric Visualizer'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -20, y: 20, z: 0 }
        },
        {
            name: 'De Sitter Space Metric Visualizer',
            description: 'Eight concentric rings and 24 radial geodesics forming a 2D cross-section of the de Sitter spacetime metric, showing the exponential expansion geometry of the cosmos.',
            material: 'Photonic crystal display lattice / Graviton-imaging substrate',
            function: 'Real-time visualization of local spacetime geometry to monitor cosmic expansion rate and detect anomalies in the metric tensor',
            assemblyOrder: 10,
            connections: ['Gravitational Wave Array', 'Hubble Volume Boundary', 'Dyson Brain'],
            failureEffect: 'Loss of metric monitoring — unable to detect unexpected changes in cosmic expansion (Big Rip precursors)',
            cascadeFailures: ['Gravitational Wave Array'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 20, y: -20, z: 0 }
        },
        {
            name: 'Holographic Principle Boundary Layer',
            description: 'A high-detail icosahedral wireframe at radius 11 with 30 information-density hotspots, implementing the holographic encoding of the bulk volume onto a 2D surface per the AdS/CFT correspondence.',
            material: 'Holographic information substrate / Planck-area pixel array',
            function: 'Encodes the complete quantum state of the enclosed volume onto a 2D boundary surface, enabling perfect state reconstruction and error correction',
            assemblyOrder: 11,
            connections: ['Hubble Volume Boundary', 'Dyson Brain', 'Reality Manipulation Arrays'],
            failureEffect: 'Information paradox — enclosed volume quantum state becomes undefined, violating unitarity',
            cascadeFailures: ['Dyson Brain', 'Reality Manipulation Arrays'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -20, y: -20, z: 0 }
        },
        {
            name: 'Dark Matter Scaffold',
            description: 'A translucent dark matter halo sphere at radius 9, threaded with 20 dark energy filaments forming the invisible gravitational scaffold that maintains structural coherence.',
            material: 'WIMPs / Axion condensate lattice / Modified dark energy fluid',
            function: 'Provides the gravitational backbone that holds all visible components in their correct positions via dark matter gravitational binding',
            assemblyOrder: 12,
            connections: ['Dimensional Anchoring Pylons', 'Hubble Volume Boundary', 'De Sitter Metric Visualizer'],
            failureEffect: 'Structural dissolution — all components drift apart as gravitational binding is lost',
            cascadeFailures: ['Dimensional Anchoring Pylons', 'Singularity Core'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 25, z: 25 }
        },
        {
            name: 'Entropy Reversal Engine',
            description: 'A star-shaped 12-pointed ExtrudeGeometry processor at +4Y with 8 copper thermal gradient pipes, implementing Maxwells Demon at cosmological scale to locally reverse entropy.',
            material: 'Boltzmann-brain computational substrate / Landauer-limit-breaking logic gates',
            function: 'Locally reverses thermodynamic entropy to maintain system coherence against heat death, extending operational lifetime beyond 10^100 years',
            assemblyOrder: 13,
            connections: ['Energy Extraction Lattice', 'Dyson Brain', 'Singularity Core'],
            failureEffect: 'Accelerated local heat death — all subsystems degrade toward maximum entropy',
            cascadeFailures: ['Dyson Brain', 'Energy Extraction Lattice'],
            originalPosition: { x: 0, y: 4, z: 0 },
            explodedPosition: { x: 0, y: 30, z: -25 }
        },
        {
            name: 'Vacuum Decay Shield Generators',
            description: '20 shield generators distributed via Fibonacci spiral at radius 4.5, each with darkSteel housing, gold emitter dish, and cyan glow node, projecting a dodecahedral shield field.',
            material: 'False vacuum stabilizer array / Metastable potential barrier projector',
            function: 'Prevents catastrophic vacuum decay by locally stabilizing the Higgs field at its current metastable vacuum state',
            assemblyOrder: 14,
            connections: ['Reality Manipulation Arrays', 'Dimensional Anchoring Pylons', 'Dark Matter Scaffold'],
            failureEffect: 'Potential nucleation of true vacuum bubble — destruction of all matter within expanding light cone',
            cascadeFailures: ['ALL SYSTEMS — total existential failure'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 25, y: 0, z: -25 }
        },
        {
            name: 'Quantum Entanglement Communication Array',
            description: '8 entangled qubit pairs with near-core (r=3) and far-boundary (r=10) nodes connected by quantum-coherent links, enabling instantaneous (or near-instantaneous via quantum teleportation protocol) information transfer.',
            material: 'Bell-state entangled photon pairs / Topologically-protected qubit substrate',
            function: 'Provides superluminal-equivalent communication between the core and the multiverse portals via quantum teleportation protocol',
            assemblyOrder: 15,
            connections: ['Multiverse Connection Points', 'Dyson Brain', 'Singularity Core'],
            failureEffect: 'Communication blackout — multiverse portals operate without coordination, risking dimensional collision',
            cascadeFailures: ['Multiverse Connection Points', 'Dyson Brain'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -25, y: 0, z: 25 }
        },
        {
            name: 'Cosmic Web Filament Network',
            description: '40 cosmic web filaments and 60 galaxy cluster nodes distributed throughout the Hubble volume, representing the large-scale structure of the universe that the Nexus monitors and manipulates.',
            material: 'Baryonic matter / Intergalactic medium plasma threads',
            function: 'Maps and monitors the large-scale structure of the observable universe to predict and respond to cosmic-scale events',
            assemblyOrder: 16,
            connections: ['Hubble Volume Boundary', 'Holographic Boundary Layer', 'Gravitational Wave Array'],
            failureEffect: 'Loss of cosmic situational awareness — unable to predict supermassive structure evolution',
            cascadeFailures: ['Holographic Boundary Layer'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -25, z: 25 }
        },
        {
            name: 'Toroidal Knot Energy Conduits',
            description: 'Three toroidal knot structures (p/q = 2/3, 3/5, 5/7) nested inside the core, rotating at different rates and tilts to distribute energy uniformly throughout the singularity containment volume.',
            material: 'Magnetic flux tube / Superconducting strange-quark filament',
            function: 'Distributes energy from the singularity through topologically non-trivial pathways, ensuring uniform power delivery to all subsystems',
            assemblyOrder: 17,
            connections: ['Singularity Core', 'Energy Extraction Lattice'],
            failureEffect: 'Energy distribution asymmetry — some subsystems receive excess power (overload) while others starve',
            cascadeFailures: ['Energy Extraction Lattice', 'Reality Manipulation Arrays'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 30, y: 15, z: 15 }
        }
    ];

    // ========================================================================
    //  QUIZ QUESTIONS — PhD-level cosmology
    // ========================================================================
    const quizQuestions = [
        {
            question: 'In de Sitter spacetime, the cosmological horizon arises because the exponential expansion of space causes distant objects to recede faster than light. What is the radius of the cosmological event horizon in a de Sitter universe with Hubble parameter H₀, and how does this relate to the concept of an observer-dependent causal boundary?',
            answer: 'The de Sitter cosmological event horizon has radius r_H = c/H₀, where c is the speed of light and H₀ is the Hubble parameter. This is observer-dependent because each observer sits at the center of their own Hubble sphere — the locus of points receding at exactly c. Beyond this radius, photons emitted today will never reach the observer due to the superluminal recession velocity. This is analogous to a black hole event horizon turned inside out: rather than trapping light inside, it prevents external light from reaching the observer. The horizon also has thermodynamic properties — Gibbons and Hawking showed it has a temperature T = ℏH₀/(2πk_B) and an entropy S = πc³/(GℏH₀²), making it a holographic boundary encoding information about the unobservable region.',
            difficulty: 'PhD'
        },
        {
            question: 'The holographic principle, originating from the Bekenstein bound and formalized in the AdS/CFT correspondence, suggests that the information content of a volume of space can be encoded on its boundary surface. How does this principle constrain the maximum entropy (and thus information) that can be contained within the Nexus Hubble volume, and what are the implications for the computational capacity of the Dyson Brain?',
            answer: 'The Bekenstein-Hawking entropy bound states that the maximum entropy within a region is S_max = A/(4l_P²), where A is the area of the bounding surface and l_P is the Planck length (~1.616×10⁻³⁵ m). For the Nexus Hubble volume (representing the observable universe with radius ~4.4×10²⁶ m), the bounding area gives S_max ≈ 10^{122} bits — the so-called holographic information bound. This means the Dyson Brain, despite having 10^{120} ops/sec computational capacity, cannot represent more information than the holographic surface can encode. The AdS/CFT correspondence (Maldacena, 1997) further implies that the bulk physics (3+1D) is dual to a conformal field theory on the 2D boundary, meaning all volumetric processes are in principle reducible to boundary computations — the Holographic Boundary Layer literally implements this duality.',
            difficulty: 'PhD'
        },
        {
            question: 'The Nexus includes a Vacuum Decay Shield to prevent false vacuum decay. Explain the metastability of the electroweak vacuum, the role of the Higgs field potential in determining vacuum stability, and calculate the approximate tunneling probability for vacuum decay given the current measured Higgs mass of ~125 GeV and top quark mass of ~173 GeV.',
            answer: 'The electroweak vacuum is currently believed to be metastable based on precision measurements of the Higgs boson mass (125.25 ± 0.17 GeV) and top quark mass (172.69 ± 0.30 GeV). The Higgs effective potential V(φ) develops a second, deeper minimum at field values φ ~ 10^{10}–10^{18} GeV due to the negative contribution of the top quark Yukawa coupling to the running of the Higgs quartic coupling λ(μ). The quartic coupling turns negative at a scale Λ_I ≈ 10^{10} GeV. Quantum tunneling through the potential barrier (via Coleman-De Luccia instanton in curved spacetime, or Coleman bounce in flat space) has a probability per unit volume per unit time Γ/V ~ Λ_I⁴ exp(-S_E), where S_E is the Euclidean bounce action. For current parameters, S_E ≈ 10^{400–600}, making the tunneling timescale vastly longer than the universe age (~10^{10} years). However, local perturbations (such as those from the Reality Manipulation Arrays modifying local α or ℏ) could catastrophically lower this barrier, necessitating the Shield Generators.',
            difficulty: 'PhD'
        },
        {
            question: 'The Cosmic String Harvester Tendrils capture topological defects predicted by Grand Unified Theories. Derive the linear energy density (mass per unit length) of a cosmic string formed during a GUT-scale phase transition at ~10^{16} GeV, and explain why cosmic strings produce conical spacetime geometry rather than Schwarzschild-like curvature.',
            answer: 'A cosmic string formed during a GUT-scale phase transition at energy η ~ 10^{16} GeV has a linear energy density (mass per unit length) μ ~ η²/c² ≈ (10^{16} GeV)²/(ℏc) ≈ 10^{22} kg/m, or equivalently Gμ/c² ≈ 10^{-6} (dimensionless). The spacetime around an infinite straight cosmic string is locally flat (zero Riemann curvature) but globally conical — it has a deficit angle Δθ = 8πGμ/c² ≈ 10^{-5} radians. This means the spatial geometry is that of a cone rather than a curved Schwarzschild metric because the stress-energy tensor of a Nambu-Goto string has the special property T^{tt} = -T^{zz} (tension equals energy density), with T^{rr} = T^{θθ} = 0. This equation of state is unique — it produces no gravitational acceleration (no Newtonian limit force) but does produce gravitational lensing and the Kaiser-Stebbins effect (CMB temperature discontinuities). The harvester tendrils exploit this topology to extract the enormous Gμ ~ 10^{-6} worth of energy per unit length.',
            difficulty: 'PhD'
        },
        {
            question: 'The Entropy Reversal Engine implements "Maxwell\'s Demon" at cosmological scale. Explain how Landauer\'s principle (the thermodynamic cost of information erasure) constrains any entropy-reversing system, calculate the minimum energy cost to erase one bit of information at the cosmic microwave background temperature (T_CMB ≈ 2.725 K), and discuss whether the Engine truly violates the Second Law or merely displaces entropy elsewhere.',
            answer: 'Landauer\'s principle (1961) states that erasing one bit of information in a computation dissipates a minimum energy of E_min = k_B T ln(2), where k_B is Boltzmann\'s constant and T is the temperature of the thermal reservoir. At T_CMB = 2.725 K, this gives E_min = (1.381×10⁻²³ J/K)(2.725 K)(ln 2) ≈ 2.607×10⁻²³ J ≈ 1.63×10⁻⁴ eV per bit erased. The Entropy Reversal Engine does NOT truly violate the Second Law of Thermodynamics — rather, it acts as a sophisticated information engine (like Szilard\'s engine) that acquires information about microstate configurations (using the Dyson Brain\'s 10^{120} ops/sec processing power), then performs work to sort particles into lower-entropy configurations. The information acquisition and eventual erasure of the acquired measurement data generates at least as much entropy (via Landauer\'s principle) as the entropy reduced in the target system. The "trick" is that the Engine expels this waste entropy into the multiverse portals — essentially exporting thermodynamic waste into parallel universe branches, thereby maintaining a local entropy decrease while preserving the global Second Law across the multiverse.',
            difficulty: 'PhD'
        }
    ];

    // ========================================================================
    //  DESCRIPTION
    // ========================================================================
    const description = `Kardashev Type V Civilization Nexus — The ultimate hyper-structure transcending 
the observable universe. This god-tier construct harnesses energy from the quantum vacuum itself via a 
lattice of Casimir-effect extraction nodes, captures cosmic string topological defects, and breaches the 
cosmological horizon through 12 multiverse portal connections. At its heart lies a six-layered singularity 
core threaded by toroidal knot energy conduits, surrounded by a Fibonacci-distributed Dyson Brain with 
10^120 ops/sec computational capacity. Three gyroscopic Reality Manipulation Arrays emit beams that can 
locally modify fundamental constants. A holographic boundary layer encodes the complete quantum state of 
the enclosed volume per the AdS/CFT correspondence. The entire structure is anchored in its home dimension 
by six massive pylons, shielded from false vacuum decay by 20 field generators, and monitored by a 
six-arm gravitational wave interferometer array. The de Sitter metric visualizer provides real-time 
spacetime geometry monitoring, while an entropy reversal engine exports thermodynamic waste through 
multiverse portals to maintain indefinite operational lifetime.`;

    // ========================================================================
    //  ANIMATE — extreme, highly synchronized, multi-system animation
    // ========================================================================
    function animate(time, speed, refMeshes) {
        const t = time * speed;
        const m = refMeshes || meshes;

        // --- CORE ROTATION & PULSATION ---
        if (m.singularityCore) {
            m.singularityCore.rotation.x = t * 1.5;
            m.singularityCore.rotation.y = t * 2.1;
            const coreScale = 1 + 0.15 * Math.sin(t * 4);
            m.singularityCore.scale.set(coreScale, coreScale, coreScale);
            m.singularityCore.material.emissiveIntensity = 1.0 + 0.8 * Math.sin(t * 3);
        }
        if (m.singularityCage) {
            m.singularityCage.rotation.x = -t * 0.8;
            m.singularityCage.rotation.z = t * 1.2;
        }
        if (m.quantumShell) {
            m.quantumShell.rotation.y = t * 0.5;
            m.quantumShell.material.opacity = 0.5 + 0.35 * Math.sin(t * 2.5);
        }
        if (m.darkShell) {
            m.darkShell.rotation.x = -t * 0.3;
            m.darkShell.rotation.z = t * 0.4;
        }
        if (m.holoBoundary) {
            m.holoBoundary.rotation.y = -t * 0.2;
            m.holoBoundary.material.emissiveIntensity = 1.0 + 0.8 * Math.sin(t * 1.8);
            m.holoBoundary.material.opacity = 0.3 + 0.15 * Math.sin(t * 2);
        }
        if (m.voidShell) {
            m.voidShell.rotation.x = t * 0.15;
            m.voidShell.rotation.y = -t * 0.1;
        }

        // --- TOROIDAL KNOT ENERGY CONDUITS ---
        if (m.innerKnot1) {
            m.innerKnot1.rotation.x = t * 2;
            m.innerKnot1.rotation.y = t * 1.5;
            m.innerKnot1.material.emissiveIntensity = 0.8 + 0.5 * Math.sin(t * 5);
        }
        if (m.innerKnot2) {
            m.innerKnot2.rotation.y = -t * 1.8;
            m.innerKnot2.rotation.z = t * 1.3;
            m.innerKnot2.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 4 + 1);
        }
        if (m.innerKnot3) {
            m.innerKnot3.rotation.x = t * 1.1;
            m.innerKnot3.rotation.z = -t * 2.2;
            m.innerKnot3.material.emissiveIntensity = 0.7 + 0.5 * Math.sin(t * 3.5 + 2);
        }

        // --- HUBBLE BOUNDARY PULSATION ---
        if (m.hubbleSphere) {
            const hubbleBreathing = 1 + 0.02 * Math.sin(t * 0.5);
            m.hubbleSphere.scale.set(hubbleBreathing, hubbleBreathing, hubbleBreathing);
        }
        if (m.hubbleWire) {
            m.hubbleWire.rotation.y = t * 0.02;
            m.hubbleWire.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(t * 0.8);
        }
        if (m.particleHorizon) m.particleHorizon.rotation.z = t * 0.15;
        if (m.particleHorizon2) m.particleHorizon2.rotation.y = -t * 0.12;
        if (m.particleHorizon3) m.particleHorizon3.rotation.x = t * 0.1;

        // --- MULTIVERSE PORTALS — swirling event horizons ---
        if (m.portalMeshes) {
            m.portalMeshes.forEach((portal, idx) => {
                if (portal.ring) {
                    portal.ring.rotation.z = t * (1.5 + idx * 0.15);
                    portal.ring.material.emissiveIntensity = 0.8 + 0.6 * Math.sin(t * 2 + idx * 0.5);
                }
                if (portal.disc) {
                    portal.disc.rotation.z = -t * (2 + idx * 0.1);
                    portal.disc.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 3 + idx * 0.8);
                }
                if (portal.node) {
                    const portalPulse = 1 + 0.08 * Math.sin(t * 2.5 + idx);
                    portal.node.scale.set(portalPulse, portalPulse, portalPulse);
                }
            });
        }

        // --- ENERGY EXTRACTION LATTICE — rotating antennae, pulsing spheres ---
        if (m.extractionNodes) {
            m.extractionNodes.forEach((node, idx) => {
                if (node.antenna) {
                    node.antenna.rotation.z = t * 3 + idx * 0.2;
                }
                if (node.sphere) {
                    node.sphere.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 4 + idx * 0.3);
                    const nodeScale = 1 + 0.2 * Math.sin(t * 3 + idx * 0.5);
                    node.sphere.scale.set(nodeScale, nodeScale, nodeScale);
                }
            });
        }

        // --- REALITY MANIPULATION RINGS — counter-rotating gyroscopes ---
        if (m.realityRings) {
            m.realityRings.forEach((rr, rIdx) => {
                const direction = rIdx % 2 === 0 ? 1 : -1;
                rr.ringGroup.rotation.x += direction * 0.008 * speed * (1 + rIdx * 0.3);
                rr.ringGroup.rotation.y += direction * 0.006 * speed * (1 + rIdx * 0.2);
                rr.ringGroup.rotation.z += 0.004 * speed;

                // Pulsing emitter crystals
                rr.emitters.forEach((em, eIdx) => {
                    if (em.crystal) {
                        em.crystal.material.emissiveIntensity = 1.2 + 0.8 * Math.sin(t * 5 + eIdx * 0.3 + rIdx);
                        const cScale = 1 + 0.3 * Math.sin(t * 4 + eIdx * 0.5);
                        em.crystal.scale.set(cScale, cScale * 2.5, cScale);
                    }
                });
            });
        }

        // --- PYLONS — collector glow pulsation ---
        if (m.pylons) {
            m.pylons.forEach((pylon, pIdx) => {
                if (pylon.collector) {
                    pylon.collector.rotation.x = t * 1.5 + pIdx;
                    pylon.collector.rotation.y = t * 2 + pIdx * 0.5;
                    pylon.collector.material.emissiveIntensity = 1.0 + 0.6 * Math.sin(t * 3 + pIdx);
                }
            });
        }

        // --- DYSON BRAIN — twinkling processing nodes ---
        if (m.brainNodes) {
            m.brainNodes.forEach((bn, bIdx) => {
                if (bn.procNode) {
                    bn.procNode.material.emissiveIntensity = 1.0 + 1.0 * Math.sin(t * 8 + bIdx * 0.4);
                    bn.procNode.rotation.y = t * 2;
                }
                if (bn.memCrystal) {
                    bn.memCrystal.rotation.x = t * 3 + bIdx;
                    bn.memCrystal.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 6 + bIdx * 0.6);
                }
            });
        }

        // --- GRAVITATIONAL WAVE ANTENNAS — oscillating test masses ---
        if (m.gwAntennas) {
            m.gwAntennas.forEach((gwa, gIdx) => {
                if (gwa.testMass) {
                    // Simulate gravitational wave strain oscillation
                    const strain = 0.02 * Math.sin(t * 10 + gIdx * Math.PI / 3);
                    gwa.testMass.position.y = 10 + strain;
                    gwa.testMass.material.emissiveIntensity = 0.3 + 0.3 * Math.abs(Math.sin(t * 5 + gIdx));
                }
                if (gwa.laser) {
                    gwa.laser.material.emissiveIntensity = 1.5 + 0.5 * Math.sin(t * 15 + gIdx);
                    gwa.laser.material.opacity = 0.3 + 0.2 * Math.sin(t * 8 + gIdx);
                }
            });
        }

        // --- GALAXY CLUSTERS — slow twinkle ---
        if (m.galaxyClusters) {
            m.galaxyClusters.forEach((gc, gIdx) => {
                gc.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 1.5 + gIdx * 0.3);
                const gcScale = 1 + 0.15 * Math.sin(t * 2 + gIdx * 0.7);
                gc.scale.set(gcScale, gcScale, gcScale);
            });
        }

        // --- HOLOGRAPHIC HOTSPOTS — information processing flicker ---
        if (m.infoHotspots) {
            m.infoHotspots.forEach((hs, hIdx) => {
                hs.material.emissiveIntensity = 0.8 + 1.2 * Math.sin(t * 12 + hIdx * 0.5);
                hs.material.opacity = 0.4 + 0.3 * Math.sin(t * 8 + hIdx);
            });
        }

        // --- SHIELD GENERATORS — rotating glow ---
        if (m.shieldGenerators) {
            m.shieldGenerators.forEach((sg, sIdx) => {
                if (sg.glow) {
                    sg.glow.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 4 + sIdx * 0.3);
                    const glowScale = 1 + 0.4 * Math.sin(t * 3 + sIdx * 0.5);
                    sg.glow.scale.set(glowScale, glowScale, glowScale);
                }
                sg.group.rotation.y += 0.002 * speed;
            });
        }

        // --- SHIELD FIELD — slow rotation, breathing ---
        if (m.shieldField) {
            m.shieldField.rotation.x = t * 0.05;
            m.shieldField.rotation.y = t * 0.07;
            m.shieldField.material.emissiveIntensity = 0.15 + 0.1 * Math.sin(t * 1.5);
        }

        // --- ENTROPY PROCESSOR — spin ---
        if (m.entropyProcessor) {
            m.entropyProcessor.rotation.z = t * 0.8;
            m.entropyProcessor.rotation.x = Math.sin(t * 0.5) * 0.2;
        }

        // --- HOLOGRAPHIC SURFACE — slow shimmer ---
        if (m.holoSurface) {
            m.holoSurface.rotation.y = t * 0.03;
            m.holoSurface.material.emissiveIntensity = 0.1 + 0.08 * Math.sin(t * 2);
        }

        // --- QUANTUM ENTANGLEMENT NODES — synchronized pulsing (entangled!) ---
        if (m.qeNodes) {
            m.qeNodes.forEach((qe, qIdx) => {
                const entangledPhase = Math.sin(t * 6 + qIdx * Math.PI / 4);
                if (qe.nodeA) {
                    qe.nodeA.material.emissiveIntensity = 0.5 + 0.5 * entangledPhase;
                    const aScale = 1 + 0.3 * entangledPhase;
                    qe.nodeA.scale.set(aScale, aScale, aScale);
                }
                if (qe.nodeB) {
                    // Perfectly anti-correlated (entangled pair)
                    qe.nodeB.material.emissiveIntensity = 0.5 - 0.5 * entangledPhase;
                    const bScale = 1 - 0.3 * entangledPhase;
                    qe.nodeB.scale.set(Math.abs(bScale), Math.abs(bScale), Math.abs(bScale));
                }
            });
        }

        // --- GLOBAL SLOW ROTATION of major groups ---
        if (m.coreGroup) {
            m.coreGroup.rotation.y = t * 0.15;
            m.coreGroup.rotation.x = Math.sin(t * 0.1) * 0.05;
        }
        if (m.brainGroup) {
            m.brainGroup.rotation.y = -t * 0.05;
        }
        if (m.deSitterGroup) {
            m.deSitterGroup.rotation.y = t * 0.02;
        }
        if (m.tendrilGroup) {
            m.tendrilGroup.rotation.y = t * 0.03;
            m.tendrilGroup.rotation.x = Math.sin(t * 0.2) * 0.02;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
