// ============================================================================
// GOD TIER BLACK HOLE FARM — Primordial Black Hole Hawking Radiation Harvester
// A facility farming multiple primordial black holes for limitless energy.
// Features: containment spheres, accretion disks, energy harvesting arrays,
//           mass feeding systems, central power collection grid, and extreme
//           synchronized animations.
// ============================================================================
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {

    const group = new THREE.Group();
    const animatedMeshes = {};

    // ── Custom Materials ─────────────────────────────────────────────────────
    const voidBlack = new THREE.MeshStandardMaterial({
        color: 0x000000, roughness: 0.0, metalness: 1.0
    });
    const eventHorizonMat = new THREE.MeshStandardMaterial({
        color: 0x020208, roughness: 0.0, metalness: 1.0,
        emissive: 0x0a0018, emissiveIntensity: 0.4
    });
    const accretionHot = new THREE.MeshStandardMaterial({
        color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.85, side: THREE.DoubleSide
    });
    const accretionMid = new THREE.MeshStandardMaterial({
        color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 1.8,
        transparent: true, opacity: 0.7, side: THREE.DoubleSide
    });
    const accretionCool = new THREE.MeshStandardMaterial({
        color: 0x990033, emissive: 0x880022, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.55, side: THREE.DoubleSide
    });
    const hawkingGlow = new THREE.MeshStandardMaterial({
        color: 0x88ccff, emissive: 0x44aaff, emissiveIntensity: 3.0,
        transparent: true, opacity: 0.6
    });
    const hawkingParticleMat = new THREE.MeshStandardMaterial({
        color: 0xaaddff, emissive: 0x66bbff, emissiveIntensity: 4.0,
        transparent: true, opacity: 0.75
    });
    const containmentFieldMat = new THREE.MeshStandardMaterial({
        color: 0x2244aa, emissive: 0x1133ff, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.15, side: THREE.DoubleSide, wireframe: true
    });
    const containmentShellMat = new THREE.MeshStandardMaterial({
        color: 0x334455, roughness: 0.2, metalness: 0.95,
        transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    const energyBeamMat = new THREE.MeshStandardMaterial({
        color: 0x00ffaa, emissive: 0x00ff88, emissiveIntensity: 3.5,
        transparent: true, opacity: 0.7
    });
    const powerGridMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, emissive: 0x00ddaa, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.6
    });
    const matterStreamMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.65
    });
    const magneticCoilMat = new THREE.MeshStandardMaterial({
        color: 0x5566cc, emissive: 0x3344aa, emissiveIntensity: 1.5,
        metalness: 0.9, roughness: 0.15
    });
    const reactorCoreMat = new THREE.MeshStandardMaterial({
        color: 0x112233, roughness: 0.1, metalness: 0.98
    });
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00cccc, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.8
    });
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0x8800cc, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.7
    });
    const warningRed = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xcc0000, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.9
    });
    const coolantBlueMat = new THREE.MeshStandardMaterial({
        color: 0x0055ff, emissive: 0x0033cc, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.5
    });
    const dataScreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 3.0
    });

    // ── Helper: Create Torus Ring ────────────────────────────────────────────
    function makeTorusRing(radius, tube, radSeg, tubeSeg, mat) {
        const geo = new THREE.TorusGeometry(radius, tube, radSeg, tubeSeg);
        return new THREE.Mesh(geo, mat);
    }

    // ── Helper: Create Tube along curve ─────────────────────────────────────
    function makeTube(points, radius, segments, mat) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, segments, radius, 8, false);
        return new THREE.Mesh(geo, mat);
    }

    // ── Helper: Create Lathe profile ────────────────────────────────────────
    function makeLathe(profilePoints, segments, mat) {
        const geo = new THREE.LatheGeometry(profilePoints, segments);
        return new THREE.Mesh(geo, mat);
    }

    // ========================================================================
    // SECTION 1: FACILITY BASE PLATFORM
    // ========================================================================
    const basePlatformGroup = new THREE.Group();
    // Main hexagonal base using Shape + ExtrudeGeometry
    const hexShape = new THREE.Shape();
    const hexRadius = 18;
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = hexRadius * Math.cos(angle);
        const z = hexRadius * Math.sin(angle);
        if (i === 0) hexShape.moveTo(x, z);
        else hexShape.lineTo(x, z);
    }
    hexShape.closePath();
    const hexExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.2, bevelSegments: 4 };
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);
    const hexPlatform = new THREE.Mesh(hexGeo, darkSteel);
    hexPlatform.rotation.x = -Math.PI / 2;
    hexPlatform.position.y = -1.5;
    basePlatformGroup.add(hexPlatform);

    // Sub-platform layered rings
    for (let ring = 0; ring < 3; ring++) {
        const ringMesh = makeTorusRing(hexRadius - 2 - ring * 3, 0.15, 16, 64, chrome);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = -0.5 + ring * 0.2;
        basePlatformGroup.add(ringMesh);
    }

    // Floor panel grid lines
    for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 / 24) * i;
        const linePoints = [
            new THREE.Vector3(0, -0.3, 0),
            new THREE.Vector3(Math.cos(angle) * hexRadius * 0.95, -0.3, Math.sin(angle) * hexRadius * 0.95)
        ];
        const line = makeTube(linePoints, 0.04, 12, neonCyan);
        basePlatformGroup.add(line);
    }
    group.add(basePlatformGroup);

    // ========================================================================
    // SECTION 2: CENTRAL POWER COLLECTION CORE
    // ========================================================================
    const centralCoreGroup = new THREE.Group();

    // Core reactor tower (Lathe profile)
    const coreProfile = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1.8, 0),
        new THREE.Vector2(2.2, 1.0),
        new THREE.Vector2(2.5, 2.5),
        new THREE.Vector2(2.8, 4.0),
        new THREE.Vector2(2.5, 6.0),
        new THREE.Vector2(2.0, 8.0),
        new THREE.Vector2(1.5, 10.0),
        new THREE.Vector2(1.8, 11.5),
        new THREE.Vector2(2.2, 12.5),
        new THREE.Vector2(1.0, 14.0),
        new THREE.Vector2(0.5, 15.0),
        new THREE.Vector2(0, 15.5)
    ];
    const coreLathe = makeLathe(coreProfile, 48, reactorCoreMat);
    centralCoreGroup.add(coreLathe);

    // Core energy sphere at the top
    const coreSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 5.0,
            transparent: true, opacity: 0.85
        })
    );
    coreSphere.position.y = 15.5;
    centralCoreGroup.add(coreSphere);
    animatedMeshes.coreEnergySphere = coreSphere;

    // Orbiting energy collector rings around core
    const coreRings = [];
    for (let r = 0; r < 4; r++) {
        const ring = makeTorusRing(3.5 + r * 0.4, 0.08, 8, 64, energyBeamMat);
        ring.position.y = 6 + r * 2;
        centralCoreGroup.add(ring);
        coreRings.push(ring);
    }
    animatedMeshes.coreRings = coreRings;

    // Vertical power conduits (6 around core)
    const powerConduits = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const conduitR = 3.2;
        const conduitPoints = [];
        for (let s = 0; s <= 20; s++) {
            const t = s / 20;
            conduitPoints.push(new THREE.Vector3(
                Math.cos(angle) * conduitR,
                t * 14,
                Math.sin(angle) * conduitR
            ));
        }
        const conduit = makeTube(conduitPoints, 0.12, 24, powerGridMat);
        centralCoreGroup.add(conduit);
        powerConduits.push(conduit);
    }

    // Central magnetic stabilization coils
    for (let c = 0; c < 5; c++) {
        const coil = makeTorusRing(3.0, 0.2, 12, 48, magneticCoilMat);
        coil.position.y = 2 + c * 2.8;
        coil.rotation.x = Math.PI / 2;
        centralCoreGroup.add(coil);
    }

    group.add(centralCoreGroup);

    // ========================================================================
    // SECTION 3: BLACK HOLE CONTAINMENT UNITS (x4 around facility)
    // ========================================================================
    const blackHoleUnits = [];
    const accretionDisks = [];
    const hawkingParticles = [];
    const containmentSpheres = [];
    const harvestingArrays = [];
    const feedingStreams = [];

    const bhPositions = [
        { x: 8, z: 0 }, { x: -8, z: 0 }, { x: 0, z: 8 }, { x: 0, z: -8 }
    ];

    for (let bh = 0; bh < 4; bh++) {
        const bhGroup = new THREE.Group();
        const pos = bhPositions[bh];
        bhGroup.position.set(pos.x, 5, pos.z);

        // ── Event Horizon (black sphere) ────────────────────────────────
        const eventHorizon = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 48, 48),
            eventHorizonMat
        );
        bhGroup.add(eventHorizon);

        // ── Photon Sphere (dim glow shell) ──────────────────────────────
        const photonSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.85, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0x110022, emissive: 0x220044, emissiveIntensity: 1.2,
                transparent: true, opacity: 0.25
            })
        );
        bhGroup.add(photonSphere);

        // ── Accretion Disk (multi-layered torus rings) ──────────────────
        const diskGroup = new THREE.Group();
        // Inner hot disk
        const innerDisk = makeTorusRing(1.3, 0.15, 4, 128, accretionHot);
        innerDisk.rotation.x = Math.PI / 2;
        diskGroup.add(innerDisk);
        // Mid disk
        const midDisk = makeTorusRing(1.7, 0.2, 4, 128, accretionMid);
        midDisk.rotation.x = Math.PI / 2;
        diskGroup.add(midDisk);
        // Outer cool disk
        const outerDisk = makeTorusRing(2.2, 0.25, 4, 128, accretionCool);
        outerDisk.rotation.x = Math.PI / 2;
        diskGroup.add(outerDisk);
        // Spiral streamers within disk
        for (let s = 0; s < 6; s++) {
            const spiralPoints = [];
            for (let p = 0; p <= 60; p++) {
                const t = p / 60;
                const spiralAngle = t * Math.PI * 4 + (Math.PI * 2 / 6) * s;
                const spiralR = 0.8 + t * 1.5;
                spiralPoints.push(new THREE.Vector3(
                    Math.cos(spiralAngle) * spiralR,
                    Math.sin(t * Math.PI * 2) * 0.08,
                    Math.sin(spiralAngle) * spiralR
                ));
            }
            const spiral = makeTube(spiralPoints, 0.035, 48, accretionHot);
            diskGroup.add(spiral);
        }
        diskGroup.rotation.x = Math.PI * 0.15 * (bh % 2 === 0 ? 1 : -1);
        bhGroup.add(diskGroup);
        accretionDisks.push(diskGroup);

        // ── Hawking Radiation Particles ──────────────────────────────────
        const particleGroup = new THREE.Group();
        for (let hp = 0; hp < 40; hp++) {
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const rad = 0.7 + Math.random() * 2.5;
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 8, 8),
                hawkingParticleMat
            );
            particle.position.set(
                Math.sin(theta) * Math.cos(phi) * rad,
                Math.sin(theta) * Math.sin(phi) * rad,
                Math.cos(theta) * rad
            );
            particle.userData = { phi, theta, baseRad: rad, speed: 0.3 + Math.random() * 0.7 };
            particleGroup.add(particle);
        }
        bhGroup.add(particleGroup);
        hawkingParticles.push(particleGroup);

        // ── Hawking Radiation Glow Shell ────────────────────────────────
        const hawkingShell = new THREE.Mesh(
            new THREE.SphereGeometry(1.0, 24, 24),
            hawkingGlow
        );
        bhGroup.add(hawkingShell);

        // ── Containment Sphere (wireframe geodesic) ─────────────────────
        const containmentOuter = new THREE.Mesh(
            new THREE.IcosahedronGeometry(3.2, 2),
            containmentFieldMat
        );
        bhGroup.add(containmentOuter);

        const containmentInner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2.8, 1),
            containmentShellMat
        );
        bhGroup.add(containmentInner);
        containmentSpheres.push({ outer: containmentOuter, inner: containmentInner });

        // ── Magnetic Confinement Rings (3 per BH) ───────────────────────
        const confineRings = [];
        for (let cr = 0; cr < 3; cr++) {
            const confRing = makeTorusRing(3.0, 0.12, 12, 48, magneticCoilMat);
            confRing.rotation.x = (Math.PI / 3) * cr;
            confRing.rotation.z = (Math.PI / 6) * cr;
            bhGroup.add(confRing);
            confineRings.push(confRing);
        }

        // ── Energy Harvesting Array (collector dishes) ──────────────────
        const harvestGroup = new THREE.Group();
        for (let ea = 0; ea < 8; ea++) {
            const eaAngle = (Math.PI * 2 / 8) * ea;
            const dishGroup = new THREE.Group();

            // Parabolic dish (lathe)
            const dishProfile = [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(0.5, -0.1),
                new THREE.Vector2(0.8, -0.3),
                new THREE.Vector2(0.9, -0.5),
                new THREE.Vector2(0.85, -0.55)
            ];
            const dish = makeLathe(dishProfile, 24, aluminum);
            dish.scale.set(0.5, 0.5, 0.5);
            dishGroup.add(dish);

            // Focus receiver
            const receiver = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
                energyBeamMat
            );
            receiver.position.y = 0.2;
            dishGroup.add(receiver);

            dishGroup.position.set(
                Math.cos(eaAngle) * 3.8,
                0,
                Math.sin(eaAngle) * 3.8
            );
            dishGroup.lookAt(0, 0, 0);
            harvestGroup.add(dishGroup);
        }
        bhGroup.add(harvestGroup);
        harvestingArrays.push(harvestGroup);

        // ── Support Pylons (4 legs per BH unit) ─────────────────────────
        for (let leg = 0; leg < 4; leg++) {
            const legAngle = (Math.PI * 2 / 4) * leg + Math.PI / 4;
            const pylonPoints = [
                new THREE.Vector3(Math.cos(legAngle) * 2.5, -5, Math.sin(legAngle) * 2.5),
                new THREE.Vector3(Math.cos(legAngle) * 1.5, -2, Math.sin(legAngle) * 1.5),
                new THREE.Vector3(Math.cos(legAngle) * 0.8, 0, Math.sin(legAngle) * 0.8)
            ];
            const pylon = makeTube(pylonPoints, 0.15, 16, darkSteel);
            bhGroup.add(pylon);
        }

        group.add(bhGroup);
        blackHoleUnits.push(bhGroup);
    }

    // ========================================================================
    // SECTION 4: MASS FEEDING SYSTEMS (pipelines from edge to each BH)
    // ========================================================================
    const feedingSystemGroup = new THREE.Group();
    const feedingPulses = [];

    for (let f = 0; f < 4; f++) {
        const pos = bhPositions[f];
        const feedGroup = new THREE.Group();

        // Main feed pipeline from facility edge to BH
        const startAngle = Math.atan2(pos.z, pos.x);
        const feedStart = new THREE.Vector3(
            Math.cos(startAngle) * 16, 1, Math.sin(startAngle) * 16
        );
        const feedMid1 = new THREE.Vector3(
            Math.cos(startAngle) * 12, 3, Math.sin(startAngle) * 12
        );
        const feedMid2 = new THREE.Vector3(
            pos.x * 1.2, 4.5, pos.z * 1.2
        );
        const feedEnd = new THREE.Vector3(pos.x, 5, pos.z);

        const mainPipe = makeTube(
            [feedStart, feedMid1, feedMid2, feedEnd],
            0.2, 32, steel
        );
        feedGroup.add(mainPipe);

        // Inner matter stream (glowing)
        const innerStream = makeTube(
            [feedStart, feedMid1, feedMid2, feedEnd],
            0.12, 32, matterStreamMat
        );
        feedGroup.add(innerStream);
        feedingStreams.push(innerStream);

        // Feed injector nozzles (3 per BH)
        for (let nz = 0; nz < 3; nz++) {
            const nzAngle = startAngle + (nz - 1) * 0.3;
            const nozzle = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.6, 12),
                chrome
            );
            nozzle.position.set(
                pos.x + Math.cos(nzAngle) * 3,
                5,
                pos.z + Math.sin(nzAngle) * 3
            );
            nozzle.lookAt(pos.x, 5, pos.z);
            feedGroup.add(nozzle);
        }

        // Matter reservoir tank at edge
        const tankProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.8, 0),
            new THREE.Vector2(1.0, 0.5),
            new THREE.Vector2(1.0, 2.0),
            new THREE.Vector2(0.9, 2.5),
            new THREE.Vector2(0.6, 2.8),
            new THREE.Vector2(0, 3.0)
        ];
        const tank = makeLathe(tankProfile, 24, steel);
        tank.position.set(feedStart.x, feedStart.y - 1, feedStart.z);
        feedGroup.add(tank);

        // Feed pump mechanism
        const pumpBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16),
            darkSteel
        );
        pumpBody.position.set(feedMid1.x, feedMid1.y - 0.5, feedMid1.z);
        feedGroup.add(pumpBody);

        // Pump piston
        const piston = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.8, 12),
            chrome
        );
        piston.position.set(feedMid1.x, feedMid1.y + 0.3, feedMid1.z);
        feedGroup.add(piston);
        feedingPulses.push(piston);

        // Pressure indicators (glowing dots along pipe)
        for (let pi = 0; pi < 6; pi++) {
            const t = (pi + 1) / 7;
            const indicator = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                warningRed
            );
            indicator.position.set(
                feedStart.x + (feedEnd.x - feedStart.x) * t,
                feedStart.y + (feedEnd.y - feedStart.y) * t + 0.3,
                feedStart.z + (feedEnd.z - feedStart.z) * t
            );
            feedGroup.add(indicator);
        }

        feedingSystemGroup.add(feedGroup);
    }
    group.add(feedingSystemGroup);
    animatedMeshes.feedingPulses = feedingPulses;

    // ========================================================================
    // SECTION 5: ENERGY TRANSFER BEAMS (from each BH to central core)
    // ========================================================================
    const energyBeamsGroup = new THREE.Group();
    const beamMeshes = [];

    for (let eb = 0; eb < 4; eb++) {
        const pos = bhPositions[eb];
        const beamPoints = [
            new THREE.Vector3(pos.x, 5, pos.z),
            new THREE.Vector3(pos.x * 0.6, 8, pos.z * 0.6),
            new THREE.Vector3(pos.x * 0.2, 12, pos.z * 0.2),
            new THREE.Vector3(0, 14, 0)
        ];
        const beam = makeTube(beamPoints, 0.08, 24, energyBeamMat);
        energyBeamsGroup.add(beam);
        beamMeshes.push(beam);

        // Secondary transfer conduit
        const beam2Points = [
            new THREE.Vector3(pos.x * 0.9, 5.5, pos.z * 0.9),
            new THREE.Vector3(pos.x * 0.45, 9, pos.z * 0.45),
            new THREE.Vector3(0, 13, 0)
        ];
        const beam2 = makeTube(beam2Points, 0.05, 20, powerGridMat);
        energyBeamsGroup.add(beam2);
    }
    group.add(energyBeamsGroup);
    animatedMeshes.beamMeshes = beamMeshes;

    // ========================================================================
    // SECTION 6: PERIPHERAL INFRASTRUCTURE
    // ========================================================================

    // ── Coolant Circulation System ──────────────────────────────────────────
    const coolantGroup = new THREE.Group();
    for (let cl = 0; cl < 12; cl++) {
        const clAngle = (Math.PI * 2 / 12) * cl;
        const r1 = 14;
        const coolantPipePoints = [
            new THREE.Vector3(Math.cos(clAngle) * r1, -0.5, Math.sin(clAngle) * r1),
            new THREE.Vector3(Math.cos(clAngle) * (r1 - 2), 0.5, Math.sin(clAngle) * (r1 - 2)),
            new THREE.Vector3(Math.cos(clAngle) * (r1 - 5), 1.5, Math.sin(clAngle) * (r1 - 5)),
            new THREE.Vector3(Math.cos(clAngle) * 4, 2.5, Math.sin(clAngle) * 4)
        ];
        const coolantPipe = makeTube(coolantPipePoints, 0.08, 20, coolantBlueMat);
        coolantGroup.add(coolantPipe);
    }
    // Coolant radiator fins
    for (let rf = 0; rf < 6; rf++) {
        const rfAngle = (Math.PI * 2 / 6) * rf;
        const fin = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 1.5, 3),
            aluminum
        );
        fin.position.set(
            Math.cos(rfAngle) * 15, 0, Math.sin(rfAngle) * 15
        );
        fin.rotation.y = rfAngle;
        coolantGroup.add(fin);
    }
    group.add(coolantGroup);

    // ── Sensor Arrays (placed between BH units) ────────────────────────────
    const sensorGroup = new THREE.Group();
    for (let sa = 0; sa < 8; sa++) {
        const saAngle = (Math.PI * 2 / 8) * sa;
        const sensorMast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 3, 8),
            darkSteel
        );
        sensorMast.position.set(
            Math.cos(saAngle) * 12, 1.5, Math.sin(saAngle) * 12
        );
        sensorGroup.add(sensorMast);

        // Sensor dish
        const sensorDishProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.3, -0.05),
            new THREE.Vector2(0.5, -0.15),
            new THREE.Vector2(0.55, -0.2)
        ];
        const sensorDish = makeLathe(sensorDishProfile, 16, chrome);
        sensorDish.position.set(
            Math.cos(saAngle) * 12, 3.2, Math.sin(saAngle) * 12
        );
        sensorGroup.add(sensorDish);

        // Sensor indicator light
        const sensorLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            neonCyan
        );
        sensorLight.position.set(
            Math.cos(saAngle) * 12, 3.5, Math.sin(saAngle) * 12
        );
        sensorGroup.add(sensorLight);
    }
    group.add(sensorGroup);

    // ── Control Station / Operator Cabin ────────────────────────────────────
    const controlStation = new THREE.Group();
    controlStation.position.set(13, 0, 13);

    // Cabin base
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-1.5, -1);
    cabinShape.lineTo(1.5, -1);
    cabinShape.lineTo(1.5, 1);
    cabinShape.lineTo(-1.5, 1);
    cabinShape.closePath();
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 2.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 2 });
    const cabinBody = new THREE.Mesh(cabinGeo, darkSteel);
    cabinBody.rotation.x = -Math.PI / 2;
    controlStation.add(cabinBody);

    // Tinted observation windows
    for (let w = 0; w < 3; w++) {
        const window = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.6),
            tinted
        );
        window.position.set(-1 + w, 2.0, 1.02);
        controlStation.add(window);
    }

    // Control panels with glowing screens
    for (let cp = 0; cp < 4; cp++) {
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.3, 0.05),
            plastic
        );
        panel.position.set(-0.75 + cp * 0.55, 1.2, 0.8);
        panel.rotation.x = -0.3;
        controlStation.add(panel);

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(0.4, 0.2),
            dataScreenMat
        );
        screen.position.set(-0.75 + cp * 0.55, 1.25, 0.83);
        screen.rotation.x = -0.3;
        controlStation.add(screen);
    }

    // Chair
    const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.05, 0.5),
        rubber
    );
    chairSeat.position.set(0, 1.0, 0.2);
    controlStation.add(chairSeat);
    const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.6, 0.05),
        rubber
    );
    chairBack.position.set(0, 1.3, -0.05);
    controlStation.add(chairBack);

    // Communication antenna
    const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 2, 6),
        chrome
    );
    antenna.position.set(1, 3.5, 0);
    controlStation.add(antenna);
    const antennaDish = makeLathe([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.2, -0.02),
        new THREE.Vector2(0.35, -0.08),
        new THREE.Vector2(0.4, -0.12)
    ], 12, aluminum);
    antennaDish.position.set(1, 4.5, 0);
    controlStation.add(antennaDish);

    group.add(controlStation);

    // ── Safety Blast Shields ────────────────────────────────────────────────
    const blastShieldGroup = new THREE.Group();
    for (let bs = 0; bs < 8; bs++) {
        const bsAngle = (Math.PI * 2 / 8) * bs + Math.PI / 8;
        const shieldProfile = new THREE.Shape();
        shieldProfile.moveTo(0, 0);
        shieldProfile.lineTo(3, 0);
        shieldProfile.lineTo(3, 5);
        shieldProfile.lineTo(2.5, 5.5);
        shieldProfile.lineTo(0.5, 5.5);
        shieldProfile.lineTo(0, 5);
        shieldProfile.closePath();
        const shieldGeo = new THREE.ExtrudeGeometry(shieldProfile, { depth: 0.15, bevelEnabled: false });
        const shield = new THREE.Mesh(shieldGeo, steel);
        shield.position.set(
            Math.cos(bsAngle) * 10, 0, Math.sin(bsAngle) * 10
        );
        shield.rotation.y = -bsAngle + Math.PI / 2;
        blastShieldGroup.add(shield);

        // Warning stripe on shield
        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.15, 0.02),
            warningRed
        );
        stripe.position.set(
            Math.cos(bsAngle) * 10.1, 4.5, Math.sin(bsAngle) * 10.1
        );
        stripe.rotation.y = -bsAngle + Math.PI / 2;
        blastShieldGroup.add(stripe);
    }
    group.add(blastShieldGroup);

    // ── Access Ladders (to elevated BH platforms) ───────────────────────────
    const ladderGroup = new THREE.Group();
    for (let ld = 0; ld < 4; ld++) {
        const pos = bhPositions[ld];
        const ladAngle = Math.atan2(pos.z, pos.x) + 0.3;
        const ladX = Math.cos(ladAngle) * 6;
        const ladZ = Math.sin(ladAngle) * 6;

        // Ladder rails
        for (let side = -1; side <= 1; side += 2) {
            const rail = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 5, 6),
                darkSteel
            );
            rail.position.set(ladX + side * 0.15, 2.5, ladZ);
            ladderGroup.add(rail);
        }
        // Rungs
        for (let rung = 0; rung < 10; rung++) {
            const rungMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6),
                chrome
            );
            rungMesh.rotation.z = Math.PI / 2;
            rungMesh.position.set(ladX, 0.3 + rung * 0.5, ladZ);
            ladderGroup.add(rungMesh);
        }
    }
    group.add(ladderGroup);

    // ── Gravitational Wave Detectors (interferometer arms) ──────────────────
    const gwDetectorGroup = new THREE.Group();
    for (let gw = 0; gw < 4; gw++) {
        const gwAngle = (Math.PI * 2 / 4) * gw + Math.PI / 4;
        const armLength = 12;
        const armPoints = [
            new THREE.Vector3(
                Math.cos(gwAngle) * 5, 0.5,
                Math.sin(gwAngle) * 5
            ),
            new THREE.Vector3(
                Math.cos(gwAngle) * armLength, 0.5,
                Math.sin(gwAngle) * armLength
            )
        ];
        const arm = makeTube(armPoints, 0.06, 12, neonPurple);
        gwDetectorGroup.add(arm);

        // End mirror housing
        const mirrorHousing = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            chrome
        );
        mirrorHousing.position.set(
            Math.cos(gwAngle) * armLength, 0.5,
            Math.sin(gwAngle) * armLength
        );
        gwDetectorGroup.add(mirrorHousing);
    }
    group.add(gwDetectorGroup);

    // ── Exhaust Vents / Heat Dissipation Stacks ─────────────────────────────
    const exhaustGroup = new THREE.Group();
    for (let ex = 0; ex < 6; ex++) {
        const exAngle = (Math.PI * 2 / 6) * ex;
        const stackProfile = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.3, 0),
            new THREE.Vector2(0.35, 0.5),
            new THREE.Vector2(0.3, 2.0),
            new THREE.Vector2(0.25, 3.0),
            new THREE.Vector2(0.35, 3.2),
            new THREE.Vector2(0.4, 3.5),
            new THREE.Vector2(0.35, 3.8),
            new THREE.Vector2(0, 4.0)
        ];
        const stack = makeLathe(stackProfile, 16, darkSteel);
        stack.position.set(
            Math.cos(exAngle) * 16, 0, Math.sin(exAngle) * 16
        );
        exhaustGroup.add(stack);

        // Heat glow at top
        const heatGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8),
            new THREE.MeshStandardMaterial({
                color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 3.0,
                transparent: true, opacity: 0.6
            })
        );
        heatGlow.position.set(
            Math.cos(exAngle) * 16, 4.0, Math.sin(exAngle) * 16
        );
        exhaustGroup.add(heatGlow);
    }
    group.add(exhaustGroup);

    // ── Power Distribution Cables (ground level network) ────────────────────
    const cableGroup = new THREE.Group();
    for (let cab = 0; cab < 16; cab++) {
        const cabAngle1 = (Math.PI * 2 / 16) * cab;
        const cabAngle2 = (Math.PI * 2 / 16) * ((cab + 3) % 16);
        const r1 = 5 + Math.random() * 8;
        const r2 = 5 + Math.random() * 8;
        const cablePoints = [
            new THREE.Vector3(Math.cos(cabAngle1) * r1, -0.2, Math.sin(cabAngle1) * r1),
            new THREE.Vector3(
                (Math.cos(cabAngle1) * r1 + Math.cos(cabAngle2) * r2) / 2,
                -0.5,
                (Math.sin(cabAngle1) * r1 + Math.sin(cabAngle2) * r2) / 2
            ),
            new THREE.Vector3(Math.cos(cabAngle2) * r2, -0.2, Math.sin(cabAngle2) * r2)
        ];
        const cable = makeTube(cablePoints, 0.04, 16, copper);
        cableGroup.add(cable);
    }
    group.add(cableGroup);

    // ── Gravitational Lensing Visual Effect Rings ───────────────────────────
    const lensingGroup = new THREE.Group();
    for (let bh = 0; bh < 4; bh++) {
        const pos = bhPositions[bh];
        for (let lr = 0; lr < 3; lr++) {
            const lensRing = makeTorusRing(1.2 + lr * 0.5, 0.02, 6, 64,
                new THREE.MeshStandardMaterial({
                    color: 0xffffff, emissive: 0xaaccff, emissiveIntensity: 1.5,
                    transparent: true, opacity: 0.15 - lr * 0.04
                })
            );
            lensRing.position.set(pos.x, 5, pos.z);
            lensRing.rotation.x = Math.PI / 2 + lr * 0.2;
            lensingGroup.add(lensRing);
        }
    }
    group.add(lensingGroup);

    // Store references for animation
    animatedMeshes.accretionDisks = accretionDisks;
    animatedMeshes.hawkingParticles = hawkingParticles;
    animatedMeshes.containmentSpheres = containmentSpheres;
    animatedMeshes.feedingStreams = feedingStreams;

    // ========================================================================
    // PARTS MANIFEST (15+ hyper-detailed parts)
    // ========================================================================
    const parts = [
        {
            name: 'Primordial Black Hole (x4)',
            description: 'Micro black holes (~10^12 kg) stabilized at sub-lunar mass. Each emits Hawking radiation at ~120 GK temperature, providing the energy source for the entire facility.',
            material: 'Exotic degenerate matter / event horizon boundary',
            function: 'Primary energy source via Hawking radiation emission',
            assemblyOrder: 1,
            connections: ['Containment Sphere', 'Accretion Disk', 'Energy Harvesting Array'],
            failureEffect: 'Uncontrolled evaporation burst releasing ~10^25 joules',
            cascadeFailures: ['Containment Sphere', 'Blast Shields', 'Central Power Core'],
            originalPosition: { x: 8, y: 5, z: 0 },
            explodedPosition: { x: 16, y: 12, z: 0 }
        },
        {
            name: 'Accretion Disk Assembly',
            description: 'Multi-layered toroidal matter disk spiraling into each black hole. Inner ring reaches 10^9 K with relativistic orbital velocities. Generates X-ray and gamma emissions harvested by collector arrays.',
            material: 'Ionized plasma / superhot hydrogen-helium mix',
            function: 'Converts gravitational potential energy to thermal radiation for harvesting',
            assemblyOrder: 2,
            connections: ['Primordial Black Hole', 'Mass Feeding System'],
            failureEffect: 'Disk instability causing jets and uncontrolled mass ejection',
            cascadeFailures: ['Energy Harvesting Array', 'Containment Sphere'],
            originalPosition: { x: 8, y: 5, z: 0 },
            explodedPosition: { x: 18, y: 8, z: 0 }
        },
        {
            name: 'Containment Sphere',
            description: 'Dual-layer geodesic containment using magnetic confinement and exotic matter shielding. Inner icosahedral frame at 10^15 Tesla field strength. Prevents gravitational tidal disruption of facility.',
            material: 'Neutronium-reinforced metamaterial lattice',
            function: 'Gravitational and electromagnetic containment of each black hole',
            assemblyOrder: 3,
            connections: ['Primordial Black Hole', 'Magnetic Confinement Rings'],
            failureEffect: 'Black hole escapes containment — gravitational disruption of facility',
            cascadeFailures: ['All systems — total facility loss'],
            originalPosition: { x: 8, y: 5, z: 0 },
            explodedPosition: { x: 20, y: 10, z: 4 }
        },
        {
            name: 'Energy Harvesting Array',
            description: '8 parabolic collector dishes per BH unit tuned to capture Hawking radiation across all wavelengths from radio to gamma. Focus receivers convert radiation to electrical current via quantum rectenna technology.',
            material: 'Graphene-metamaterial composite reflectors',
            function: 'Captures and converts Hawking radiation to usable energy',
            assemblyOrder: 4,
            connections: ['Primordial Black Hole', 'Energy Transfer Beams', 'Central Power Core'],
            failureEffect: 'Energy collection drops — BH may cool and evaporate faster without feedback regulation',
            cascadeFailures: ['Central Power Core', 'Mass Feeding System'],
            originalPosition: { x: 8, y: 5, z: 0 },
            explodedPosition: { x: 22, y: 6, z: 0 }
        },
        {
            name: 'Mass Feeding System',
            description: 'High-pressure matter injection pipeline delivering compressed hydrogen pellets at relativistic speeds. Prevents black hole evaporation by maintaining mass above critical threshold. Includes reservoir tanks, pumps, and injector nozzles.',
            material: 'Tungsten-carbide reinforced conduit / chrome injectors',
            function: 'Feeds matter to black holes to counteract Hawking radiation mass loss',
            assemblyOrder: 5,
            connections: ['Primordial Black Hole', 'Matter Reservoir Tanks'],
            failureEffect: 'Black hole mass decreases — runaway evaporation accelerates exponentially',
            cascadeFailures: ['Primordial Black Hole', 'Containment Sphere', 'All downstream systems'],
            originalPosition: { x: 12, y: 3, z: 0 },
            explodedPosition: { x: 24, y: 3, z: 0 }
        },
        {
            name: 'Central Power Collection Core',
            description: 'Lathe-profiled reactor tower with superconducting conduits collecting energy from all 4 BH units. Top energy sphere acts as a capacitor storing 10^18 joules. Orbiting collector rings provide magnetic flux compression.',
            material: 'Superconducting niobium-titanium alloy / quantum dot capacitor',
            function: 'Aggregates and stores harvested energy from all black hole units',
            assemblyOrder: 6,
            connections: ['Energy Transfer Beams', 'Power Distribution Network', 'Energy Harvesting Array'],
            failureEffect: 'Total power output ceases — facility enters emergency shutdown',
            cascadeFailures: ['Mass Feeding System (no power for pumps)', 'Containment Spheres (no power for magnets)'],
            originalPosition: { x: 0, y: 7, z: 0 },
            explodedPosition: { x: 0, y: 22, z: 0 }
        },
        {
            name: 'Energy Transfer Beams',
            description: 'Focused energy conduits using coherent X-ray waveguides to transmit harvested energy from each BH unit to the central core. Dual-redundant paths ensure continuous transfer.',
            material: 'Photonic crystal waveguide / vacuum-sealed conduit',
            function: 'Transfers collected energy from BH units to central core',
            assemblyOrder: 7,
            connections: ['Energy Harvesting Array', 'Central Power Core'],
            failureEffect: 'Energy buildup at BH unit — potential thermal overload',
            cascadeFailures: ['Central Power Core'],
            originalPosition: { x: 4, y: 8, z: 0 },
            explodedPosition: { x: 10, y: 18, z: 0 }
        },
        {
            name: 'Magnetic Confinement Rings',
            description: 'Triple-axis superconducting magnetic rings generating 10^15 Tesla fields. Provide primary gravitational lensing compensation and prevent tidal disruption beyond containment sphere.',
            material: 'YBCO high-temperature superconductor',
            function: 'Magnetic confinement and stabilization of black hole position',
            assemblyOrder: 8,
            connections: ['Containment Sphere', 'Coolant System'],
            failureEffect: 'Black hole drifts from center — asymmetric accretion and containment breach',
            cascadeFailures: ['Containment Sphere', 'Accretion Disk'],
            originalPosition: { x: 8, y: 5, z: 0 },
            explodedPosition: { x: 20, y: 14, z: 2 }
        },
        {
            name: 'Coolant Circulation System',
            description: '12-line liquid helium coolant network maintaining superconductor temperatures below 4K. Includes radiator fins for waste heat rejection into space.',
            material: 'Liquid helium-3 in titanium conduit',
            function: 'Thermal management for superconducting systems',
            assemblyOrder: 9,
            connections: ['Magnetic Confinement Rings', 'Radiator Fins'],
            failureEffect: 'Superconductor quench — magnetic containment failure',
            cascadeFailures: ['Magnetic Confinement Rings', 'Containment Sphere'],
            originalPosition: { x: 10, y: 1, z: 0 },
            explodedPosition: { x: 22, y: 1, z: 6 }
        },
        {
            name: 'Gravitational Wave Detectors',
            description: 'Laser interferometer arms measuring spacetime distortions from BH dynamics. Provides real-time feedback for containment field adjustments and mass feeding rate calibration.',
            material: 'Ultra-stable Zerodur mirrors / frequency-stabilized laser',
            function: 'Monitors gravitational wave emissions for containment feedback',
            assemblyOrder: 10,
            connections: ['Control Station', 'Magnetic Confinement Rings'],
            failureEffect: 'Loss of gravitational monitoring — blind containment operation',
            cascadeFailures: ['Containment Sphere (delayed response)'],
            originalPosition: { x: 8, y: 0.5, z: 8 },
            explodedPosition: { x: 16, y: 0.5, z: 16 }
        },
        {
            name: 'Control Station',
            description: 'Shielded operator cabin with tinted radiation-proof observation windows, 4 holographic control screens, ergonomic chair, and communication antenna. Manages all facility operations.',
            material: 'Lead-lined darksteel hull / borosilicate tinted glass',
            function: 'Human oversight and manual control of all facility systems',
            assemblyOrder: 11,
            connections: ['All systems via data network'],
            failureEffect: 'Loss of manual override capability',
            cascadeFailures: ['None (autonomous systems continue)'],
            originalPosition: { x: 13, y: 1.25, z: 13 },
            explodedPosition: { x: 26, y: 4, z: 26 }
        },
        {
            name: 'Blast Shields',
            description: '8 reinforced steel panels positioned between BH units and facility perimeter. Rated to withstand partial BH evaporation burst energies up to 10^20 joules.',
            material: 'Depleted uranium core / steel composite armor',
            function: 'Protects facility perimeter from energetic events',
            assemblyOrder: 12,
            connections: ['Facility Base Platform'],
            failureEffect: 'Reduced blast protection — personnel and equipment at risk',
            cascadeFailures: ['Control Station', 'Sensor Arrays'],
            originalPosition: { x: 10, y: 2.5, z: 0 },
            explodedPosition: { x: 20, y: 2.5, z: 0 }
        },
        {
            name: 'Sensor Arrays',
            description: '8 multi-spectrum sensor masts monitoring Hawking radiation flux, accretion disk temperature, magnetic field strength, and gravitational tidal forces in real-time.',
            material: 'Cadmium-zinc-telluride gamma detectors / SQUID magnetometers',
            function: 'Real-time monitoring of all BH parameters',
            assemblyOrder: 13,
            connections: ['Control Station', 'Gravitational Wave Detectors'],
            failureEffect: 'Loss of real-time telemetry — increased response latency',
            cascadeFailures: ['Control Station feedback loops'],
            originalPosition: { x: 12, y: 2, z: 0 },
            explodedPosition: { x: 24, y: 8, z: 0 }
        },
        {
            name: 'Exhaust / Heat Dissipation Stacks',
            description: '6 thermal exhaust towers venting waste heat from energy conversion processes. Lathe-profiled stacks with radiative cooling fins and thermal glow indicators.',
            material: 'High-emissivity ceramic / darksteel structural shell',
            function: 'Radiates waste thermal energy to prevent facility overheating',
            assemblyOrder: 14,
            connections: ['Coolant System', 'Central Power Core'],
            failureEffect: 'Thermal buildup — potential superconductor quench cascade',
            cascadeFailures: ['Coolant System', 'Magnetic Confinement Rings'],
            originalPosition: { x: 16, y: 2, z: 0 },
            explodedPosition: { x: 28, y: 6, z: 0 }
        },
        {
            name: 'Facility Base Platform',
            description: 'Hexagonal extruded platform with triple concentric structural rings, 24-spoke neon-lit floor grid, and embedded power distribution cabling. Foundation for all facility systems.',
            material: 'Carbon-nanotube reinforced darksteel',
            function: 'Structural foundation and power distribution substrate',
            assemblyOrder: 15,
            connections: ['All systems'],
            failureEffect: 'Structural collapse — total facility loss',
            cascadeFailures: ['All systems'],
            originalPosition: { x: 0, y: -1, z: 0 },
            explodedPosition: { x: 0, y: -8, z: 0 }
        },
        {
            name: 'Power Distribution Cable Network',
            description: '16-line ground-level superconducting cable mesh distributing energy from central core to all facility subsystems. Copper-sheathed with cryogenic insulation.',
            material: 'REBCO superconductor / copper sheath',
            function: 'Distributes collected energy throughout facility',
            assemblyOrder: 16,
            connections: ['Central Power Core', 'All subsystems'],
            failureEffect: 'Localized power outages to dependent systems',
            cascadeFailures: ['Dependent subsystems lose power'],
            originalPosition: { x: 0, y: -0.3, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 0 }
        }
    ];

    // ========================================================================
    // QUIZ QUESTIONS (5 PhD-level black hole thermodynamics)
    // ========================================================================
    const quizQuestions = [
        {
            question: 'The Hawking temperature of a Schwarzschild black hole is T_H = ℏc³/(8πGMk_B). For a primordial black hole of mass M = 10¹² kg, what is the approximate Hawking temperature, and how does this compare to the CMB temperature (2.725 K)?',
            options: [
                'T_H ≈ 1.2 × 10¹¹ K — roughly 10¹⁰ times hotter than the CMB, confirming it radiates intensely across all electromagnetic bands',
                'T_H ≈ 2.725 K — exactly matches the CMB, meaning the black hole is in thermal equilibrium and neither gains nor loses mass',
                'T_H ≈ 10⁻⁷ K — far colder than the CMB, so the black hole absorbs CMB photons and grows indefinitely',
                'T_H ≈ 10²⁰ K — the temperature exceeds the Hagedorn temperature, converting the black hole into a string theory fireball'
            ],
            correctAnswer: 0,
            explanation: 'Substituting M = 10¹² kg into the Hawking formula: T_H = (1.055×10⁻³⁴ × (3×10⁸)³) / (8π × 6.674×10⁻¹¹ × 10¹² × 1.381×10⁻²³) ≈ 1.227 × 10¹¹ K. This is ~4.5 × 10¹⁰ times the CMB temperature, meaning the BH radiates enormous power and must be continuously fed to prevent runaway evaporation.'
        },
        {
            question: 'The Bekenstein-Hawking entropy of a black hole is S = k_B·A/(4ℓ_P²), where A = 16πG²M²/c⁴ is the horizon area and ℓ_P is the Planck length. What is the entropy of a 10¹² kg black hole in units of k_B, and what does this imply about its information content?',
            options: [
                'S/k_B ≈ 10²⁸ — encoding roughly 10²⁸ bits of quantum information on the horizon, consistent with the holographic principle',
                'S/k_B ≈ 10⁸⁰ — comparable to the observable universe total entropy',
                'S/k_B ≈ 1 — a micro black hole has minimal entropy like a single quantum state',
                'S/k_B ≈ 10⁵⁰ — matching the entropy of the Sun'
            ],
            correctAnswer: 0,
            explanation: 'The Schwarzschild radius r_s = 2GM/c² ≈ 1.485 × 10⁻¹⁵ m. The horizon area A = 4πr_s² ≈ 2.77 × 10⁻²⁹ m². Dividing by 4ℓ_P² = 4 × (1.616×10⁻³⁵)² ≈ 1.045 × 10⁻⁶⁹ m² gives S/k_B ≈ 2.65 × 10⁴⁰. Each Planck area encodes ~1 bit of information per the holographic principle, meaning this "small" black hole stores an astronomical amount of quantum information.'
        },
        {
            question: 'The Page time marks the point at which a black hole has emitted approximately half its initial Bekenstein-Hawking entropy in Hawking radiation. After the Page time, the von Neumann entropy of the emitted radiation begins to decrease. What physical phenomenon does this imply about information retrieval?',
            options: [
                'After the Page time, the radiation becomes increasingly entangled with the remaining black hole interior, and information about the initial state begins to be recoverable from the radiation — resolving the information paradox unitarily',
                'The Page time marks when Hawking radiation transitions from thermal to coherent laser-like emission',
                'After the Page time, the black hole ceases to radiate and enters a stable remnant state',
                'The Page time is when the black hole\'s temperature drops below the CMB, halting evaporation'
            ],
            correctAnswer: 0,
            explanation: 'Don Page showed that for a unitarily evolving black hole, the entanglement entropy of emitted radiation follows a "Page curve": rising until the Page time (when ~half the initial entropy is radiated), then falling back to zero at complete evaporation. This implies information is preserved and gradually becomes accessible in the radiation, consistent with AdS/CFT unitarity. The Page time for a BH of mass M scales as t_Page ~ G²M³/(ℏc⁴).'
        },
        {
            question: 'The Stefan-Boltzmann law for black hole luminosity gives P = ℏc⁶/(15360πG²M²). For a farming operation requiring sustained 10 GW output per black hole, what mass must each BH be maintained at, and what is the corresponding mass feeding rate to counteract evaporation?',
            options: [
                'M ≈ 10⁹ kg, requiring a feed rate of ~111 μg/s (= P/c²) to maintain stable mass — achievable with high-velocity hydrogen pellet injection',
                'M ≈ 10²⁰ kg, requiring negligible feeding since the BH absorbs more CMB than it radiates',
                'M ≈ 10⁵ kg, but the feeding rate exceeds global hydrogen production, making it impractical',
                'M ≈ 10¹⁵ kg, requiring zero feeding because black holes of this mass are thermodynamically stable'
            ],
            correctAnswer: 0,
            explanation: 'Setting P = 10¹⁰ W and solving M² = ℏc⁶/(15360πG²P): M² ≈ (1.055×10⁻³⁴ × 7.29×10⁴⁸)/(15360π × 4.45×10⁻²¹ × 10¹⁰) ≈ 10¹⁸, so M ≈ 10⁹ kg. The mass-loss rate is dM/dt = P/c² = 10¹⁰/(9×10¹⁶) ≈ 1.11×10⁻⁷ kg/s = 111 μg/s. This must be precisely matched by the feeding system to maintain equilibrium.'
        },
        {
            question: 'In a black hole farming scenario, the black hole\'s negative heat capacity (dT/dM < 0) creates a fundamental engineering challenge. As the BH radiates and loses mass, its temperature rises, increasing the radiation rate — a positive feedback loop. What control theory concept best describes the required mass-feeding regulation, and why is PID control insufficient?',
            options: [
                'The system requires nonlinear model-predictive control (NMPC) because the Hawking luminosity scales as M⁻², creating a runaway instability where linear PID gains cannot track the exponentially accelerating dynamics near critical mass thresholds',
                'Simple bang-bang control (on/off feeding) is sufficient because the BH mass changes slowly relative to control loop frequency',
                'Standard PID is perfectly adequate — the system is linearizable around any operating point',
                'No active control is needed — the accretion disk provides natural self-regulation via radiation pressure feedback'
            ],
            correctAnswer: 0,
            explanation: 'A BH has negative heat capacity: C = dE/dT = -8π²G²M²k_B²/(ℏc³) < 0. This means any mass perturbation δM < 0 increases T, increasing P, accelerating mass loss — a thermodynamic runaway. The nonlinearity (P ∝ M⁻²) means the system dynamics change dramatically across operating regimes. PID controllers assume local linearity and fixed gain scheduling, which fails when the plant dynamics change by orders of magnitude. NMPC uses a physics-based model of BH thermodynamics to predict future states and compute optimal feed rates over a receding horizon, naturally handling the nonlinear M⁻² coupling.'
        }
    ];

    // ========================================================================
    // ANIMATION FUNCTION
    // ========================================================================
    function animate(time, speed, meshes) {
        const t = time * speed;

        // ── Accretion Disk Rotation ─────────────────────────────────────
        if (animatedMeshes.accretionDisks) {
            animatedMeshes.accretionDisks.forEach((disk, i) => {
                // Inner disk rotates faster (Keplerian: ω ∝ r^-3/2)
                disk.rotation.y = t * (2.5 + i * 0.3);
                // Slight wobble (Lense-Thirring precession simulation)
                disk.rotation.x = Math.PI * 0.15 * (i % 2 === 0 ? 1 : -1) + Math.sin(t * 0.5 + i) * 0.05;
                disk.rotation.z = Math.sin(t * 0.3 + i * 1.5) * 0.03;
            });
        }

        // ── Hawking Radiation Particles ─────────────────────────────────
        if (animatedMeshes.hawkingParticles) {
            animatedMeshes.hawkingParticles.forEach((particleGroup, gi) => {
                particleGroup.children.forEach((p, pi) => {
                    const ud = p.userData;
                    const oscillation = Math.sin(t * ud.speed + pi * 0.5) * 0.5;
                    const rad = ud.baseRad + oscillation;
                    const phi = ud.phi + t * ud.speed * 0.3;
                    const theta = ud.theta + Math.sin(t * 0.2 + pi) * 0.1;
                    p.position.set(
                        Math.sin(theta) * Math.cos(phi) * rad,
                        Math.sin(theta) * Math.sin(phi) * rad,
                        Math.cos(theta) * rad
                    );
                    // Pulsing opacity
                    if (p.material && p.material.opacity !== undefined) {
                        p.material.opacity = 0.4 + Math.sin(t * 3 + pi) * 0.35;
                    }
                });
            });
        }

        // ── Containment Sphere Rotation ─────────────────────────────────
        if (animatedMeshes.containmentSpheres) {
            animatedMeshes.containmentSpheres.forEach((cs, i) => {
                cs.outer.rotation.x = t * 0.15 + i;
                cs.outer.rotation.y = t * 0.2 + i * 0.5;
                cs.inner.rotation.x = -t * 0.1 + i;
                cs.inner.rotation.z = t * 0.12 + i * 0.3;
            });
        }

        // ── Core Energy Sphere Pulsation ────────────────────────────────
        if (animatedMeshes.coreEnergySphere) {
            const pulse = 1.0 + Math.sin(t * 2) * 0.15;
            animatedMeshes.coreEnergySphere.scale.set(pulse, pulse, pulse);
            if (animatedMeshes.coreEnergySphere.material) {
                animatedMeshes.coreEnergySphere.material.emissiveIntensity = 4.0 + Math.sin(t * 3) * 2.0;
            }
        }

        // ── Core Orbiting Rings ─────────────────────────────────────────
        if (animatedMeshes.coreRings) {
            animatedMeshes.coreRings.forEach((ring, i) => {
                ring.rotation.x = t * (0.5 + i * 0.2) + i * Math.PI / 4;
                ring.rotation.y = t * (0.3 + i * 0.15);
                ring.rotation.z = Math.sin(t * 0.5 + i) * 0.4;
            });
        }

        // ── Feeding System Pump Pistons ─────────────────────────────────
        if (animatedMeshes.feedingPulses) {
            animatedMeshes.feedingPulses.forEach((piston, i) => {
                piston.position.y += Math.sin(t * 4 + i * Math.PI / 2) * 0.005;
            });
        }

        // ── Feeding Stream Opacity Pulsation ────────────────────────────
        if (animatedMeshes.feedingStreams) {
            animatedMeshes.feedingStreams.forEach((stream, i) => {
                if (stream.material) {
                    stream.material.opacity = 0.4 + Math.sin(t * 5 + i * 1.2) * 0.3;
                    stream.material.emissiveIntensity = 1.5 + Math.sin(t * 3 + i) * 1.5;
                }
            });
        }

        // ── Energy Beam Pulsation ───────────────────────────────────────
        if (animatedMeshes.beamMeshes) {
            animatedMeshes.beamMeshes.forEach((beam, i) => {
                if (beam.material) {
                    beam.material.opacity = 0.4 + Math.sin(t * 4 + i * Math.PI / 2) * 0.35;
                    beam.material.emissiveIntensity = 2.0 + Math.sin(t * 6 + i) * 2.0;
                }
            });
        }
    }

    // ========================================================================
    // RETURN
    // ========================================================================
    const description = `BLACK HOLE FARM — Primordial Black Hole Hawking Radiation Harvesting Facility

This ultra-advanced energy facility farms four primordial black holes (~10⁹-10¹² kg each) 
for their Hawking radiation output. Each micro black hole is suspended inside a dual-layer 
geodesic containment sphere with triple-axis magnetic confinement rings generating 10¹⁵ Tesla 
fields. Multi-layered accretion disks with spiral streamers feed matter into each event horizon 
while 8-dish energy harvesting arrays capture emitted Hawking radiation across all wavelengths.

Mass feeding systems deliver compressed hydrogen pellets via high-pressure injection pipelines 
to counteract the negative heat capacity runaway: as BHs radiate and lose mass, their temperature 
rises (T ∝ M⁻¹), increasing luminosity (P ∝ M⁻²), requiring precisely calibrated feeding rates 
managed by nonlinear model-predictive control systems.

Energy is transmitted via coherent X-ray waveguide beams to the central power collection core — 
a lathe-profiled reactor tower with superconducting conduits, orbiting magnetic flux compression 
rings, and a quantum-dot capacitor sphere storing 10¹⁸ joules. The facility includes gravitational 
wave interferometer detectors, coolant circulation systems, sensor arrays, blast shields, exhaust 
stacks, and a shielded operator control station.

Total theoretical output: 40+ GW continuous power from the thermodynamic exploitation of 
spacetime curvature and quantum vacuum fluctuations at the event horizon boundary.`;

    return { group, parts, description, quizQuestions, animate };
}
