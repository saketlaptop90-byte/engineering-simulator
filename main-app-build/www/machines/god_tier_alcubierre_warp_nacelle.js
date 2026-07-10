import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM WARP-DRIVE MATERIALS
    // ==========================================
    const exoticMatterMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 4.0, transparent: true, opacity: 0.6 });
    const nacellePlating = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.95, roughness: 0.15, emissive: 0x112233, emissiveIntensity: 0.3 });
    const cherenkovBlue = new THREE.MeshStandardMaterial({ color: 0x0066ff, emissive: 0x0088ff, emissiveIntensity: 5.0, transparent: true, opacity: 0.5 });
    const warpBubbleMat = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x6600cc, emissiveIntensity: 2.5, transparent: true, opacity: 0.15, wireframe: true, side: 2 });
    const energyConduitMat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ff88, emissiveIntensity: 3.0, transparent: true, opacity: 0.8 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff6600, emissiveIntensity: 4.0, transparent: true, opacity: 0.7 });
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.2 });
    const darkCoreMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 1.0, roughness: 0.05, emissive: 0x0a0a2a, emissiveIntensity: 0.5 });
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff44, emissiveIntensity: 2.0, wireframe: true, transparent: true, opacity: 0.4 });
    const redAlertMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3.0 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0 });

    // Dynamic arrays
    const ringSegments = [];
    const conduitPulses = [];
    const starFieldParticles = [];
    const warpBubbleMeshes = [];
    const cherenkovRings = [];
    const nacelleParts = [];
    const reactorCoreElements = [];
    const fieldEmitters = [];

    // ==========================================
    // 1. CENTRAL NACELLE HULL - MAIN STRUCTURE
    // ==========================================
    const nacelleGroup = new THREE.Group();

    // Primary nacelle body - elongated octagonal prism
    const nacelleShape = new THREE.Shape();
    const nacelleRadius = 30;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = nacelleRadius + (i % 2 === 0 ? 3 : 0);
        if (i === 0) nacelleShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else nacelleShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    nacelleShape.closePath();
    const nacelleExtrudeSettings = { depth: 300, bevelEnabled: true, bevelSegments: 3, steps: 4, bevelSize: 5, bevelThickness: 3 };
    const nacelleGeo = new THREE.ExtrudeGeometry(nacelleShape, nacelleExtrudeSettings);
    const nacelleMesh = new THREE.Mesh(nacelleGeo, nacellePlating);
    nacelleMesh.rotation.x = Math.PI / 2;
    nacelleMesh.position.set(0, 0, -150);
    nacelleGroup.add(nacelleMesh);
    parts.push({ mesh: nacelleMesh, name: 'Primary Nacelle Hull' });

    // Forward deflector dish
    const deflectorGeo = new THREE.SphereGeometry(25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const deflectorMesh = new THREE.Mesh(deflectorGeo, cherenkovBlue);
    deflectorMesh.position.set(0, 0, 155);
    deflectorMesh.rotation.x = -Math.PI / 2;
    nacelleGroup.add(deflectorMesh);
    parts.push({ mesh: deflectorMesh, name: 'Forward Deflector Dish' });

    // Aft exhaust nozzle cone
    const exhaustGeo = new THREE.ConeGeometry(35, 60, 12, 4, true);
    const exhaustMesh = new THREE.Mesh(exhaustGeo, darkCoreMat);
    exhaustMesh.position.set(0, 0, -180);
    exhaustMesh.rotation.x = Math.PI / 2;
    nacelleGroup.add(exhaustMesh);
    parts.push({ mesh: exhaustMesh, name: 'Aft Exhaust Nozzle' });

    // Hull reinforcement ribs (8 ribs along the nacelle)
    for (let i = 0; i < 8; i++) {
        const ribGeo = new THREE.BoxGeometry(2, 70, 300);
        const ribMesh = new THREE.Mesh(ribGeo, hullMat);
        const ribAngle = (i / 8) * Math.PI * 2;
        ribMesh.position.set(Math.cos(ribAngle) * 32, Math.sin(ribAngle) * 32, 0);
        ribMesh.rotation.z = ribAngle;
        nacelleGroup.add(ribMesh);
    }

    // Viewport windows along the hull
    for (let i = 0; i < 12; i++) {
        const windowGeo = new THREE.BoxGeometry(8, 4, 2);
        const windowMesh = new THREE.Mesh(windowGeo, glass);
        const wAngle = (i / 12) * Math.PI * 2;
        windowMesh.position.set(Math.cos(wAngle) * 34, Math.sin(wAngle) * 34, -100 + i * 20);
        windowMesh.lookAt(0, 0, windowMesh.position.z);
        nacelleGroup.add(windowMesh);
    }

    group.add(nacelleGroup);

    // ==========================================
    // 2. EXOTIC MATTER CONTAINMENT RING
    // ==========================================
    const ringGroup = new THREE.Group();

    // Primary torus ring - negative energy density generator
    const mainRingGeo = new THREE.TorusGeometry(120, 8, 24, 64);
    const mainRingMesh = new THREE.Mesh(mainRingGeo, exoticMatterMat);
    mainRingMesh.rotation.x = Math.PI / 2;
    ringGroup.add(mainRingMesh);
    parts.push({ mesh: mainRingMesh, name: 'Exotic Matter Containment Ring' });
    ringSegments.push({ mesh: mainRingMesh, baseOpacity: 0.6, phase: 0 });

    // Secondary containment ring (counter-rotating)
    const secondRingGeo = new THREE.TorusGeometry(125, 4, 16, 64);
    const secondRingMesh = new THREE.Mesh(secondRingGeo, energyConduitMat);
    secondRingMesh.rotation.x = Math.PI / 2;
    ringGroup.add(secondRingMesh);
    ringSegments.push({ mesh: secondRingMesh, baseOpacity: 0.8, phase: Math.PI });

    // Tertiary stabilization ring
    const thirdRingGeo = new THREE.TorusGeometry(115, 3, 12, 48);
    const thirdRingMesh = new THREE.Mesh(thirdRingGeo, cherenkovBlue);
    thirdRingMesh.rotation.x = Math.PI / 2;
    ringGroup.add(thirdRingMesh);
    ringSegments.push({ mesh: thirdRingMesh, baseOpacity: 0.5, phase: Math.PI / 2 });

    // Ring support pylons connecting nacelle to exotic matter ring
    for (let i = 0; i < 6; i++) {
        const pylonAngle = (i / 6) * Math.PI * 2;
        const pylonGeo = new THREE.CylinderGeometry(3, 5, 85, 8);
        const pylonMesh = new THREE.Mesh(pylonGeo, nacellePlating);
        pylonMesh.position.set(Math.cos(pylonAngle) * 60, Math.sin(pylonAngle) * 60, 0);
        pylonMesh.rotation.z = pylonAngle + Math.PI / 2;
        pylonMesh.rotation.x = Math.PI / 2;
        ringGroup.add(pylonMesh);

        // Pylon energy conduit
        const conduitGeo = new THREE.CylinderGeometry(1.5, 1.5, 85, 6);
        const conduitMesh = new THREE.Mesh(conduitGeo, energyConduitMat);
        conduitMesh.position.copy(pylonMesh.position);
        conduitMesh.rotation.copy(pylonMesh.rotation);
        ringGroup.add(conduitMesh);
    }

    // Field emitter nodes along the ring (24 total)
    for (let i = 0; i < 24; i++) {
        const emitterAngle = (i / 24) * Math.PI * 2;
        const emitterGroup = new THREE.Group();

        const emitterBaseGeo = new THREE.CylinderGeometry(6, 8, 12, 8);
        const emitterBaseMesh = new THREE.Mesh(emitterBaseGeo, darkSteel);
        emitterGroup.add(emitterBaseMesh);

        const emitterTipGeo = new THREE.SphereGeometry(4, 16, 16);
        const emitterTipMesh = new THREE.Mesh(emitterTipGeo, exoticMatterMat);
        emitterTipMesh.position.y = 10;
        emitterGroup.add(emitterTipMesh);

        // Emitter coils
        const coilGeo = new THREE.TorusGeometry(5, 1, 8, 16);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        coilMesh.position.y = 5;
        emitterGroup.add(coilMesh);

        emitterGroup.position.set(
            Math.cos(emitterAngle) * 120,
            Math.sin(emitterAngle) * 120,
            0
        );
        emitterGroup.lookAt(0, 0, 0);

        ringGroup.add(emitterGroup);
        fieldEmitters.push({ group: emitterGroup, tip: emitterTipMesh, angle: emitterAngle });
    }

    group.add(ringGroup);
    parts.push({ mesh: ringGroup, name: 'Exotic Matter Ring Assembly' });

    // ==========================================
    // 3. WARP BUBBLE VOLUMETRIC REPRESENTATION
    // ==========================================
    const bubbleGroup = new THREE.Group();

    // Inner warp bubble (compressed space - front)
    const frontBubbleGeo = new THREE.SphereGeometry(180, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
    const frontBubbleMesh = new THREE.Mesh(frontBubbleGeo, warpBubbleMat);
    frontBubbleMesh.position.z = 20;
    frontBubbleMesh.rotation.x = -Math.PI / 2;
    bubbleGroup.add(frontBubbleMesh);
    warpBubbleMeshes.push({ mesh: frontBubbleMesh, type: 'compress', baseScale: 1.0 });

    // Outer warp bubble (expanded space - rear)
    const rearBubbleGeo = new THREE.SphereGeometry(200, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
    const rearBubbleMesh = new THREE.Mesh(rearBubbleGeo, warpBubbleMat);
    rearBubbleMesh.position.z = -20;
    rearBubbleMesh.rotation.x = Math.PI / 2;
    bubbleGroup.add(rearBubbleMesh);
    warpBubbleMeshes.push({ mesh: rearBubbleMesh, type: 'expand', baseScale: 1.0 });

    // Spacetime grid visualization (like a gravity well)
    for (let row = 0; row < 12; row++) {
        const gridRingGeo = new THREE.TorusGeometry(50 + row * 18, 0.3, 4, 64);
        const gridRingMesh = new THREE.Mesh(gridRingGeo, gridMat);
        gridRingMesh.rotation.x = Math.PI / 2;
        gridRingMesh.position.z = 0;
        bubbleGroup.add(gridRingMesh);
        warpBubbleMeshes.push({ mesh: gridRingMesh, type: 'grid', baseScale: 1.0, row: row });
    }

    // Radial grid lines
    for (let i = 0; i < 16; i++) {
        const lineAngle = (i / 16) * Math.PI * 2;
        const lineGeo = new THREE.CylinderGeometry(0.3, 0.3, 250, 4);
        const lineMesh = new THREE.Mesh(lineGeo, gridMat);
        lineMesh.rotation.z = lineAngle;
        lineMesh.rotation.x = Math.PI / 2;
        bubbleGroup.add(lineMesh);
    }

    group.add(bubbleGroup);
    parts.push({ mesh: bubbleGroup, name: 'Warp Bubble Field' });

    // ==========================================
    // 4. REACTOR CORE - NEGATIVE ENERGY GENERATOR
    // ==========================================
    const reactorGroup = new THREE.Group();

    // Central reactor sphere (Casimir vacuum energy core)
    const coreGeo = new THREE.IcosahedronGeometry(15, 3);
    const coreMesh = new THREE.Mesh(coreGeo, exoticMatterMat);
    reactorGroup.add(coreMesh);
    reactorCoreElements.push({ mesh: coreMesh, type: 'core' });
    parts.push({ mesh: coreMesh, name: 'Casimir Vacuum Energy Core' });

    // Core containment lattice (dodecahedral cage)
    const cageGeo = new THREE.DodecahedronGeometry(22, 0);
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff44, emissiveIntensity: 1.5, wireframe: true });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    reactorGroup.add(cageMesh);
    reactorCoreElements.push({ mesh: cageMesh, type: 'cage' });

    // Superconducting magnetic coils around reactor
    for (let i = 0; i < 6; i++) {
        const coilGeo = new THREE.TorusGeometry(20, 2, 8, 32);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        const coilAngle = (i / 6) * Math.PI;
        coilMesh.rotation.x = coilAngle;
        coilMesh.rotation.y = coilAngle * 0.5;
        reactorGroup.add(coilMesh);
    }

    // Plasma injectors feeding the core
    for (let i = 0; i < 8; i++) {
        const injectorAngle = (i / 8) * Math.PI * 2;
        const injGeo = new THREE.CylinderGeometry(2, 4, 25, 6);
        const injMesh = new THREE.Mesh(injGeo, plasmaMat);
        injMesh.position.set(
            Math.cos(injectorAngle) * 28,
            Math.sin(injectorAngle) * 28,
            0
        );
        injMesh.lookAt(0, 0, 0);
        reactorGroup.add(injMesh);

        // Injector nozzle
        const nozzleGeo = new THREE.ConeGeometry(3, 8, 6);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, chrome);
        nozzleMesh.position.set(
            Math.cos(injectorAngle) * 22,
            Math.sin(injectorAngle) * 22,
            0
        );
        nozzleMesh.lookAt(0, 0, 0);
        reactorGroup.add(nozzleMesh);
    }

    reactorGroup.position.set(0, 0, 0);
    group.add(reactorGroup);

    // ==========================================
    // 5. CHERENKOV RADIATION RING EFFECTS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const cherenkovRingGeo = new THREE.TorusGeometry(130 + i * 5, 1.5, 8, 64);
        const cherenkovRingMesh = new THREE.Mesh(cherenkovRingGeo, cherenkovBlue);
        cherenkovRingMesh.rotation.x = Math.PI / 2;
        cherenkovRingMesh.position.z = -30 + i * 8;
        group.add(cherenkovRingMesh);
        cherenkovRings.push({ mesh: cherenkovRingMesh, phase: i * 0.5, baseZ: -30 + i * 8 });
    }
    parts.push({ mesh: cherenkovRings[0]?.mesh, name: 'Cherenkov Radiation Array' });

    // ==========================================
    // 6. FIELD COIL ARRAY - METRIC TENSOR GENERATORS
    // ==========================================
    const fieldCoilGroup = new THREE.Group();

    for (let ring = 0; ring < 4; ring++) {
        const coilRadius = 140 + ring * 12;
        const numCoils = 12 + ring * 4;
        for (let i = 0; i < numCoils; i++) {
            const theta = (i / numCoils) * Math.PI * 2;

            const coilHousingGeo = new THREE.BoxGeometry(8, 8, 15);
            const coilHousingMesh = new THREE.Mesh(coilHousingGeo, nacellePlating);
            coilHousingMesh.position.set(
                Math.cos(theta) * coilRadius,
                Math.sin(theta) * coilRadius,
                ring * 30 - 45
            );
            coilHousingMesh.lookAt(0, 0, coilHousingMesh.position.z);
            fieldCoilGroup.add(coilHousingMesh);

            // Internal superconducting winding
            const windingGeo = new THREE.TorusGeometry(3, 0.8, 6, 12);
            const windingMesh = new THREE.Mesh(windingGeo, energyConduitMat);
            windingMesh.position.copy(coilHousingMesh.position);
            windingMesh.rotation.copy(coilHousingMesh.rotation);
            fieldCoilGroup.add(windingMesh);
        }
    }

    group.add(fieldCoilGroup);
    parts.push({ mesh: fieldCoilGroup, name: 'Metric Tensor Field Coil Array' });

    // ==========================================
    // 7. STARFIELD PARTICLE SYSTEM (InstancedMesh)
    // ==========================================
    const starCount = 2000;
    const starGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });
    const starsMesh = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const starDummy = new THREE.Object3D();
    const starData = [];

    for (let i = 0; i < starCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const cosTheta = (Math.random() - 0.5) * 2;
        const r = 400 + Math.random() * 600;
        const theta = Math.acos(cosTheta);

        starData.push({
            x: r * Math.sin(theta) * Math.cos(phi),
            y: r * Math.sin(theta) * Math.sin(phi),
            z: r * Math.cos(theta),
            originalX: r * Math.sin(theta) * Math.cos(phi),
            originalY: r * Math.sin(theta) * Math.sin(phi),
            originalZ: r * Math.cos(theta),
            speed: 0.5 + Math.random() * 2.0,
            size: 0.3 + Math.random() * 1.0
        });

        starDummy.position.set(starData[i].x, starData[i].y, starData[i].z);
        starDummy.scale.setScalar(starData[i].size);
        starDummy.updateMatrix();
        starsMesh.setMatrixAt(i, starDummy.matrix);
    }
    starsMesh.instanceMatrix.needsUpdate = true;
    group.add(starsMesh);
    starFieldParticles.push({ mesh: starsMesh, data: starData, dummy: starDummy });

    // ==========================================
    // 8. ENERGY CONDUIT PULSES
    // ==========================================
    const pulseCount = 30;
    const pulseGeo = new THREE.SphereGeometry(2, 8, 8);
    for (let i = 0; i < pulseCount; i++) {
        const pulseMesh = new THREE.Mesh(pulseGeo, energyConduitMat);
        const pulseAngle = (i / pulseCount) * Math.PI * 2;
        pulseMesh.position.set(Math.cos(pulseAngle) * 120, Math.sin(pulseAngle) * 120, 0);
        group.add(pulseMesh);
        conduitPulses.push({
            mesh: pulseMesh,
            angle: pulseAngle,
            radius: 120,
            speed: 2 + Math.random() * 3,
            phase: Math.random() * Math.PI * 2
        });
    }

    // ==========================================
    // 9. CONTROL BRIDGE & INSTRUMENTATION
    // ==========================================
    const bridgeGroup = new THREE.Group();

    // Bridge dome on top of nacelle
    const bridgeDomeGeo = new THREE.SphereGeometry(12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bridgeDomeMesh = new THREE.Mesh(bridgeDomeGeo, glass);
    bridgeDomeMesh.position.set(0, 35, 80);
    bridgeGroup.add(bridgeDomeMesh);

    // Sensor array forward
    const sensorArrayGeo = new THREE.CylinderGeometry(2, 5, 20, 6);
    const sensorArrayMesh = new THREE.Mesh(sensorArrayGeo, chrome);
    sensorArrayMesh.position.set(0, 0, 160);
    sensorArrayMesh.rotation.x = Math.PI / 2;
    bridgeGroup.add(sensorArrayMesh);

    // Antenna mast
    const antennaMastGeo = new THREE.CylinderGeometry(0.5, 0.5, 40, 4);
    const antennaMastMesh = new THREE.Mesh(antennaMastGeo, aluminum);
    antennaMastMesh.position.set(0, 55, 80);
    bridgeGroup.add(antennaMastMesh);

    // Communication dish
    const commDishGeo = new THREE.SphereGeometry(8, 12, 12, 0, Math.PI * 2, 0, Math.PI / 3);
    const commDishMesh = new THREE.Mesh(commDishGeo, aluminum);
    commDishMesh.position.set(0, 75, 80);
    commDishMesh.rotation.x = Math.PI;
    bridgeGroup.add(commDishMesh);

    // Status indicator lights
    for (let i = 0; i < 6; i++) {
        const lightGeo = new THREE.SphereGeometry(1.5, 8, 8);
        const lightMat = i < 3 ? energyConduitMat : redAlertMat;
        const lightMesh = new THREE.Mesh(lightGeo, lightMat);
        lightMesh.position.set(-8 + i * 3, 34, 70 + i * 5);
        bridgeGroup.add(lightMesh);
    }

    group.add(bridgeGroup);
    parts.push({ mesh: bridgeGroup, name: 'Command Bridge' });

    // ==========================================
    // 10. SECONDARY WARP SUSTAINER COILS
    // ==========================================
    for (let side = -1; side <= 1; side += 2) {
        const sustainerGroup = new THREE.Group();

        // Sustainer coil housing
        const sustainerHullGeo = new THREE.CylinderGeometry(10, 10, 100, 12);
        const sustainerHullMesh = new THREE.Mesh(sustainerHullGeo, nacellePlating);
        sustainerHullMesh.rotation.x = Math.PI / 2;
        sustainerGroup.add(sustainerHullMesh);

        // Sustainer coil rings
        for (let j = 0; j < 8; j++) {
            const scoilGeo = new THREE.TorusGeometry(12, 1.5, 8, 24);
            const scoilMesh = new THREE.Mesh(scoilGeo, copper);
            scoilMesh.position.z = -35 + j * 10;
            sustainerGroup.add(scoilMesh);
        }

        // Internal plasma flow tube
        const flowTubeGeo = new THREE.CylinderGeometry(5, 5, 110, 8, 1, true);
        const flowTubeMesh = new THREE.Mesh(flowTubeGeo, plasmaMat);
        flowTubeMesh.rotation.x = Math.PI / 2;
        sustainerGroup.add(flowTubeMesh);

        sustainerGroup.position.set(side * 60, side * 40, 0);
        group.add(sustainerGroup);
        nacelleParts.push({ group: sustainerGroup, side: side });
    }
    parts.push({ mesh: nacelleParts[0]?.group, name: 'Warp Sustainer Coils' });

    // ==========================================
    // 11. GRAVITON EMITTER ARRAYS
    // ==========================================
    const gravitonGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const gAngle = (i / 16) * Math.PI * 2;
        const emitterGeo = new THREE.ConeGeometry(4, 15, 8);
        const emitterMesh = new THREE.Mesh(emitterGeo, darkSteel);
        emitterMesh.position.set(
            Math.cos(gAngle) * 135,
            Math.sin(gAngle) * 135,
            0
        );
        emitterMesh.lookAt(0, 0, 0);
        gravitonGroup.add(emitterMesh);

        // Graviton beam (thin cylinder)
        const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 100, 4);
        const beamMesh = new THREE.Mesh(beamGeo, cherenkovBlue);
        const midX = Math.cos(gAngle) * 85;
        const midY = Math.sin(gAngle) * 85;
        beamMesh.position.set(midX, midY, 0);
        beamMesh.rotation.z = gAngle + Math.PI / 2;
        gravitonGroup.add(beamMesh);
    }
    group.add(gravitonGroup);
    parts.push({ mesh: gravitonGroup, name: 'Graviton Emitter Array' });

    // ==========================================
    // 12. EXOTIC MATTER GENERATION PODS
    // ==========================================
    for (let i = 0; i < 4; i++) {
        const podAngle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const podGroup = new THREE.Group();

        // Pod body
        const podBodyGeo = new THREE.CapsuleGeometry(8, 30, 8, 16);
        const podBodyMesh = new THREE.Mesh(podBodyGeo, hullMat);
        podGroup.add(podBodyMesh);

        // Pod window
        const podWindowGeo = new THREE.SphereGeometry(6, 12, 12, 0, Math.PI);
        const podWindowMesh = new THREE.Mesh(podWindowGeo, exoticMatterMat);
        podWindowMesh.position.y = 5;
        podGroup.add(podWindowMesh);

        // Connection arm
        const armGeo = new THREE.CylinderGeometry(2, 2, 40, 6);
        const armMesh = new THREE.Mesh(armGeo, nacellePlating);
        armMesh.rotation.z = Math.PI / 2;
        armMesh.position.set(-25, 0, 0);
        podGroup.add(armMesh);

        podGroup.position.set(
            Math.cos(podAngle) * 80,
            Math.sin(podAngle) * 80,
            0
        );
        podGroup.lookAt(0, 0, 0);
        group.add(podGroup);
    }
    parts.push({ mesh: group, name: 'Exotic Matter Generation Pods' });

    // ==========================================
    // 13. EMERGENCY CONTAINMENT SHUTTERS
    // ==========================================
    const shutterGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const shutterAngle = (i / 12) * Math.PI * 2;
        const shutterGeo = new THREE.BoxGeometry(25, 2, 40);
        const shutterMesh = new THREE.Mesh(shutterGeo, darkSteel);
        shutterMesh.position.set(
            Math.cos(shutterAngle) * 125,
            Math.sin(shutterAngle) * 125,
            0
        );
        shutterMesh.rotation.z = shutterAngle;
        shutterGroup.add(shutterMesh);
    }
    group.add(shutterGroup);
    parts.push({ mesh: shutterGroup, name: 'Emergency Containment Shutters' });

    // ==========================================
    // 14. POWER DISTRIBUTION MANIFOLD
    // ==========================================
    const manifoldGroup = new THREE.Group();

    // Central power bus
    const busGeo = new THREE.CylinderGeometry(4, 4, 200, 8);
    const busMesh = new THREE.Mesh(busGeo, copper);
    busMesh.rotation.x = Math.PI / 2;
    manifoldGroup.add(busMesh);

    // Distribution nodes
    for (let i = 0; i < 10; i++) {
        const nodeGeo = new THREE.OctahedronGeometry(5, 1);
        const nodeMesh = new THREE.Mesh(nodeGeo, energyConduitMat);
        nodeMesh.position.set(0, 0, -90 + i * 20);
        manifoldGroup.add(nodeMesh);
        reactorCoreElements.push({ mesh: nodeMesh, type: 'node', index: i });
    }

    manifoldGroup.position.y = -40;
    group.add(manifoldGroup);
    parts.push({ mesh: manifoldGroup, name: 'Power Distribution Manifold' });

    // ==========================================
    // 15. SUBSPACE FIELD GEOMETRY PROCESSOR
    // ==========================================
    const processorGroup = new THREE.Group();
    const processorCoreGeo = new THREE.IcosahedronGeometry(10, 2);
    const processorCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ccff, emissive: 0x0088ff, emissiveIntensity: 2.0, wireframe: true
    });
    const processorCoreMesh = new THREE.Mesh(processorCoreGeo, processorCoreMat);
    processorGroup.add(processorCoreMesh);
    reactorCoreElements.push({ mesh: processorCoreMesh, type: 'processor' });

    // Data relay spines
    for (let i = 0; i < 12; i++) {
        const spineGeo = new THREE.CylinderGeometry(0.5, 0.5, 30, 4);
        const spineMesh = new THREE.Mesh(spineGeo, energyConduitMat);
        const spineAngle = (i / 12) * Math.PI * 2;
        spineMesh.position.set(Math.cos(spineAngle) * 15, Math.sin(spineAngle) * 15, 0);
        spineMesh.lookAt(0, 0, 0);
        processorGroup.add(spineMesh);
    }

    processorGroup.position.set(0, -20, -80);
    group.add(processorGroup);
    parts.push({ mesh: processorGroup, name: 'Subspace Geometry Processor' });

    // ==========================================
    // QUIZ QUESTIONS - PhD Level Metric Tensor / Warp Drive Physics
    // ==========================================
    const quizQuestions = [
        {
            question: "In the Alcubierre metric ds² = -dt² + (dx - vₛf(rₛ)dt)² + dy² + dz², what is the physical interpretation of the shape function f(rₛ) approaching unity inside the warp bubble and zero outside?",
            options: [
                "It creates a uniform gravitational field throughout the bubble interior",
                "It ensures the interior spacetime is flat Minkowski space while the metric modification is confined to the bubble walls",
                "It generates a Schwarzschild-like event horizon at the bubble boundary",
                "It produces tidal forces proportional to the gradient of the velocity parameter vₛ"
            ],
            correct: 1,
            explanation: "When f(rₛ) = 1 inside the bubble, the metric reduces to ds² = -(1-vₛ²)dt² - 2vₛdxdt + dx² + dy² + dz², which via a coordinate transformation x' = x - ∫vₛdt recovers flat Minkowski space. The passengers experience no acceleration or tidal forces. When f(rₛ) = 0 outside, the metric is also flat. All spacetime curvature is concentrated in the bubble walls where f transitions between 0 and 1."
        },
        {
            question: "The Alcubierre drive requires exotic matter because the stress-energy tensor component T⁰⁰ (energy density) measured by Eulerian observers is proportional to which quantity?",
            options: [
                "The positive-definite square of the expansion scalar θ = ∇ᵤuᵘ",
                "-(vₛ²/32π) × (df/drₛ)² × (y² + z²)/rₛ², which is everywhere non-positive",
                "The Kretschner scalar RᵤᵥₐβR^ᵤᵥₐβ evaluated at the bubble wall",
                "The trace of the extrinsic curvature Kᵢⱼ of the constant-time hypersurface"
            ],
            correct: 1,
            explanation: "The energy density as measured by Eulerian observers (those at rest in the coordinates) is T⁰⁰ = -(1/8π)Gⁱⱼvⁱvʲ = -(vₛ²/32π)(df/drₛ)² × (y² + z²)/rₛ². Since this is a negative quantity for all non-zero transverse positions (y,z ≠ 0), the Weak Energy Condition (WEC) is violated everywhere within the bubble walls. This necessitates exotic matter with negative energy density."
        },
        {
            question: "Van Den Broeck's modification of the Alcubierre metric reduces the total negative energy required by introducing what geometric feature?",
            options: [
                "A Kerr-like frame-dragging term that recycles energy from the bubble rotation",
                "A microscopic bubble externally (small cross-section) that contains a macroscopically large interior volume via a spatial warp factor B(rₛ)",
                "A series of nested concentric bubbles that destructively interfere to cancel the negative energy requirement",
                "A time-dependent oscillation of the warp factor that averages the energy density to zero"
            ],
            correct: 1,
            explanation: "Van Den Broeck introduced a spatial expansion factor B(rₛ) that is very large (~10¹⁷) inside the bubble but transitions to 1 outside over a microscopic distance. This means the bubble's cross-sectional area (as seen externally) can be ~10⁻³³ m² while the interior is large enough to contain a spacecraft. Since the total energy scales with the bubble wall area, the requirement drops from ~10⁶⁴ J (original) to ~1 kg of exotic matter."
        },
        {
            question: "Why does the horizon problem in the Alcubierre metric imply that a warp bubble cannot be created or controlled by its occupants once in superluminal flight?",
            options: [
                "The exotic matter decays via Hawking-like radiation at superluminal speeds",
                "Gravitational time dilation inside the bubble causes the crew's clocks to stop",
                "The front wall of the bubble lies beyond the causal future of the bubble interior, so no signal from inside can reach or modify the bubble wall ahead",
                "Quantum decoherence destroys the exotic matter wavefunctions at v > c"
            ],
            correct: 2,
            explanation: "At superluminal speeds (vₛ > c), the forward portion of the bubble wall lies outside the future light cone of any point inside the bubble. This creates a horizon analogous to a cosmological event horizon: signals from the interior cannot reach the front wall to modify it. The bubble must therefore be pre-programmed or controlled by external entities along the flight path. This is the 'horizon problem' first identified by Hiscock (1997)."
        },
        {
            question: "Finazzi et al. (2009) demonstrated that the Alcubierre warp bubble is semiclassically unstable. What is the specific mechanism of this instability?",
            options: [
                "Virtual particle pairs created at the bubble walls accumulate exponentially, producing a divergent energy flux analogous to the Cauchy horizon instability in Kerr black holes",
                "The Unruh effect experienced by Eulerian observers causes spontaneous ignition of the exotic matter",
                "Gravitational lensing focuses external radiation to infinite density at the rear wall",
                "The Weyl tensor components diverge logarithmically at the bubble center due to frame-dragging"
            ],
            correct: 0,
            explanation: "Finazzi et al. showed that the warp bubble geometry contains trapped and anti-trapped surfaces similar to black/white hole horizons. Quantum fields on this background produce a renormalized stress-energy tensor ⟨Tᵤᵥ⟩ that diverges exponentially on the inner horizon (front wall), analogous to the mass-inflation instability of charged/rotating black holes. The exponential blueshift of vacuum fluctuations at the bubble wall makes the semiclassical backreaction grow without bound, destroying the bubble."
        }
    ];

    // ==========================================
    // DESCRIPTION
    // ==========================================
    const description = `<h2>Alcubierre Warp Drive Nacelle</h2>
<p>The Alcubierre Warp Drive Nacelle is the engineering realization of Miguel Alcubierre's 1994 theoretical framework for faster-than-light travel within the constraints of general relativity. Rather than accelerating through space (which is limited by special relativity), the nacelle contracts spacetime ahead and expands it behind, moving a flat-space bubble at arbitrary velocity.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Exotic Matter Containment Ring:</strong> A toroidal structure maintaining negative energy density matter required to generate the warp bubble. Uses Casimir-effect vacuum energy amplification and quantum coherence stabilization to sustain the exotic matter state.</li>
<li><strong>Metric Tensor Field Coils:</strong> 64 precisely tuned superconducting coil assemblies that shape the spacetime geometry according to the Alcubierre metric, ensuring a smooth transition function f(rₛ) at the bubble walls.</li>
<li><strong>Casimir Vacuum Energy Core:</strong> The central reactor that generates negative energy by exploiting quantum vacuum fluctuations between precisely spaced conducting plates at astronomical scale.</li>
<li><strong>Cherenkov Radiation Array:</strong> When the bubble exceeds light speed, spacetime curvature at the walls produces an effect analogous to Cherenkov radiation in dielectric media, visualized as brilliant blue rings.</li>
<li><strong>Subspace Geometry Processor:</strong> A quantum computer that solves the Einstein field equations in real-time to continuously adjust the field coils, maintaining bubble stability at superluminal velocities.</li>
</ul>

<h3>Theoretical Basis</h3>
<p>The drive operates on the Alcubierre metric: ds² = -dt² + (dx - vₛf(rₛ)dt)² + dy² + dz², where vₛ is the bubble velocity and f(rₛ) is a smooth top-hat shape function. This metric is an exact solution to Einstein's field equations, requiring exotic matter with negative energy density—a quantity permitted by quantum field theory (as in the Casimir effect) but not yet produced at macroscopic scales.</p>`;

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Rotate exotic matter rings
        ringSegments.forEach((ring, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            ring.mesh.rotation.z = time * speed * 0.5 * dir + ring.phase;
            // Pulsing glow effect
            if (ring.mesh.material.opacity !== undefined) {
                ring.mesh.material.opacity = ring.baseOpacity + Math.sin(time * speed * 3 + ring.phase) * 0.15;
            }
        });

        // 2. Animate warp bubble breathing
        warpBubbleMeshes.forEach(bubble => {
            if (bubble.type === 'compress') {
                const compressionScale = 1.0 - Math.sin(time * speed * 2) * 0.08;
                bubble.mesh.scale.set(compressionScale, compressionScale, 1.0 + Math.sin(time * speed * 2) * 0.05);
            } else if (bubble.type === 'expand') {
                const expansionScale = 1.0 + Math.sin(time * speed * 2) * 0.08;
                bubble.mesh.scale.set(expansionScale, expansionScale, 1.0 - Math.sin(time * speed * 2) * 0.05);
            } else if (bubble.type === 'grid') {
                // Undulate spacetime grid rings
                const waveOffset = Math.sin(time * speed * 1.5 + bubble.row * 0.6) * 8;
                bubble.mesh.position.z = waveOffset;
                const distortion = 1.0 + Math.sin(time * speed * 2 + bubble.row * 0.4) * 0.03;
                bubble.mesh.scale.set(distortion, distortion, 1);
            }
        });

        // 3. Cherenkov ring propagation
        cherenkovRings.forEach(ring => {
            ring.mesh.position.z = ring.baseZ - ((time * speed * 40 + ring.phase * 20) % 80);
            const scalePulse = 1.0 + Math.sin(time * speed * 5 + ring.phase) * 0.05;
            ring.mesh.scale.set(scalePulse, scalePulse, 1);
            ring.mesh.material.opacity = 0.3 + Math.sin(time * speed * 4 + ring.phase) * 0.2;
        });

        // 4. Reactor core rotation and pulsation
        reactorCoreElements.forEach(elem => {
            if (elem.type === 'core') {
                elem.mesh.rotation.x = time * speed * 2;
                elem.mesh.rotation.y = time * speed * 1.5;
                const pulse = 1.0 + Math.sin(time * speed * 6) * 0.15;
                elem.mesh.scale.setScalar(pulse);
                elem.mesh.material.emissiveIntensity = 3.0 + Math.sin(time * speed * 8) * 2.0;
            } else if (elem.type === 'cage') {
                elem.mesh.rotation.x = -time * speed * 1.2;
                elem.mesh.rotation.z = time * speed * 0.8;
            } else if (elem.type === 'processor') {
                elem.mesh.rotation.y = time * speed * 3;
                elem.mesh.rotation.z = time * speed * 1.5;
            } else if (elem.type === 'node') {
                const nodeScale = 1.0 + Math.sin(time * speed * 4 + elem.index * 0.6) * 0.2;
                elem.mesh.scale.setScalar(nodeScale);
                elem.mesh.rotation.y = time * speed * 2;
            }
        });

        // 5. Energy conduit pulses orbiting the ring
        conduitPulses.forEach(pulse => {
            pulse.angle += pulse.speed * speed * 0.02;
            pulse.mesh.position.x = Math.cos(pulse.angle) * pulse.radius;
            pulse.mesh.position.y = Math.sin(pulse.angle) * pulse.radius;
            pulse.mesh.position.z = Math.sin(time * speed * 3 + pulse.phase) * 15;
            const pulseScale = 1.0 + Math.sin(time * speed * 8 + pulse.phase) * 0.5;
            pulse.mesh.scale.setScalar(pulseScale);
        });

        // 6. Field emitter tip pulsation
        fieldEmitters.forEach((emitter, idx) => {
            const glowIntensity = 3.0 + Math.sin(time * speed * 5 + idx * 0.5) * 2.0;
            emitter.tip.material.emissiveIntensity = glowIntensity;
            const tipScale = 1.0 + Math.sin(time * speed * 6 + idx * 0.3) * 0.3;
            emitter.tip.scale.setScalar(tipScale);
        });

        // 7. Star field warping effect (stars stretch near bubble)
        starFieldParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const s = data[i];
                const dist = Math.sqrt(s.originalX * s.originalX + s.originalY * s.originalY);
                const warpFactor = dist < 250 ? 0.3 : 1.0;

                // Stars near the bubble get stretched along Z axis
                const zStretch = dist < 300 ? (1.0 + Math.sin(time * speed * 2) * 0.5) : 1.0;
                const drift = time * speed * s.speed * warpFactor;

                dummy.position.set(s.originalX, s.originalY, s.originalZ - drift * 5);
                dummy.scale.set(s.size, s.size, s.size * zStretch);

                // Wrap around
                if (dummy.position.z < -800) dummy.position.z += 1600;
                if (dummy.position.z > 800) dummy.position.z -= 1600;

                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
