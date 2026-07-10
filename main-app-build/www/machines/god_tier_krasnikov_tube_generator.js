import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM KRASNIKOV TUBE MATERIALS
    // ==========================================
    const spacetimeWallMat = new THREE.MeshStandardMaterial({ color: 0x6600ff, emissive: 0x4400cc, emissiveIntensity: 3.0, transparent: true, opacity: 0.25, side: 2 });
    const exoticNodeMat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ff88, emissiveIntensity: 4.0 });
    const shipHullMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.9, roughness: 0.15 });
    const engineGlowMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 6.0 });
    const tubeInteriorMat = new THREE.MeshStandardMaterial({ color: 0x220044, emissive: 0x110033, emissiveIntensity: 1.0, transparent: true, opacity: 0.15, side: 1 });
    const metricDistortMat = new THREE.MeshStandardMaterial({ color: 0x8844ff, emissive: 0x6622ff, emissiveIntensity: 2.5, wireframe: true, transparent: true, opacity: 0.3 });
    const cherenkovMat = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0066ff, emissiveIntensity: 5.0, transparent: true, opacity: 0.4 });
    const stabilityMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 2.0 });
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x885500, emissive: 0x663300, emissiveIntensity: 1.0, wireframe: true, transparent: true, opacity: 0.2 });
    const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });

    // Dynamic arrays
    const tubeSegments = [];
    const exoticNodes = [];
    const shipElements = [];
    const distortionRings = [];
    const cherenkovWakes = [];
    const starParticles = [];
    const energyPulses = [];
    const stabilityBeacons = [];

    // ==========================================
    // 1. RELATIVISTIC SHIP (laying the tube)
    // ==========================================
    const shipGroup = new THREE.Group();

    // Main hull - elongated sleek design
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, -8);
    hullShape.quadraticCurveTo(12, -8, 15, 0);
    hullShape.quadraticCurveTo(12, 8, 0, 8);
    hullShape.quadraticCurveTo(-12, 8, -15, 0);
    hullShape.quadraticCurveTo(-12, -8, 0, -8);
    const hullExtrudeSettings = { depth: 80, bevelEnabled: true, bevelSegments: 3, bevelSize: 2, bevelThickness: 2 };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrudeSettings);
    const hullMesh = new THREE.Mesh(hullGeo, shipHullMat);
    hullMesh.rotation.x = Math.PI / 2;
    hullMesh.position.set(0, 0, -40);
    shipGroup.add(hullMesh);
    parts.push({ mesh: hullMesh, name: 'Relativistic Ship Hull' });

    // Forward deflector
    const deflectorGeo = new THREE.ConeGeometry(10, 25, 12);
    const deflectorMesh = new THREE.Mesh(deflectorGeo, shipHullMat);
    deflectorMesh.rotation.x = -Math.PI / 2;
    deflectorMesh.position.z = 55;
    shipGroup.add(deflectorMesh);
    parts.push({ mesh: deflectorMesh, name: 'Interstellar Deflector' });

    // Engine array (4 engines)
    for (let i = 0; i < 4; i++) {
        const engineAngle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const engineGeo = new THREE.CylinderGeometry(4, 6, 20, 8);
        const engineMesh = new THREE.Mesh(engineGeo, darkSteel);
        engineMesh.rotation.x = Math.PI / 2;
        engineMesh.position.set(
            Math.cos(engineAngle) * 12,
            Math.sin(engineAngle) * 12,
            -50
        );
        shipGroup.add(engineMesh);

        // Engine glow
        const glowGeo = new THREE.ConeGeometry(5, 15, 8);
        const glowMesh = new THREE.Mesh(glowGeo, engineGlowMat);
        glowMesh.rotation.x = Math.PI / 2;
        glowMesh.position.set(
            Math.cos(engineAngle) * 12,
            Math.sin(engineAngle) * 12,
            -62
        );
        shipGroup.add(glowMesh);
        shipElements.push({ mesh: glowMesh, type: 'engineGlow', index: i });
    }

    // Tube generator emitter ring at ship's stern
    const emitterRingGeo = new THREE.TorusGeometry(18, 2, 8, 32);
    const emitterRingMesh = new THREE.Mesh(emitterRingGeo, exoticNodeMat);
    emitterRingMesh.position.z = -45;
    shipGroup.add(emitterRingMesh);
    parts.push({ mesh: emitterRingMesh, name: 'Spacetime Tube Emitter Ring' });
    shipElements.push({ mesh: emitterRingMesh, type: 'emitterRing' });

    // Bridge/command section
    const bridgeGeo = new THREE.SphereGeometry(6, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, glass);
    bridgeMesh.position.set(0, 10, 20);
    shipGroup.add(bridgeMesh);

    // Sensor arrays
    for (let i = 0; i < 6; i++) {
        const sensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 4);
        const sensorMesh = new THREE.Mesh(sensorGeo, chrome);
        sensorMesh.position.set(
            (Math.random() - 0.5) * 20,
            8 + Math.random() * 5,
            (Math.random() - 0.5) * 40
        );
        shipGroup.add(sensorMesh);
    }

    shipGroup.position.z = 200; // Ship at the front of the tube
    group.add(shipGroup);

    // ==========================================
    // 2. KRASNIKOV TUBE - MAIN STRUCTURE
    // ==========================================
    const tubeGroup = new THREE.Group();

    // The tube stretches behind the ship
    const tubeLength = 400;
    const tubeRadius = 25;
    const segmentCount = 20;

    for (let seg = 0; seg < segmentCount; seg++) {
        const segZ = -tubeLength + (seg / segmentCount) * tubeLength;
        const segGroup = new THREE.Group();

        // Tube wall segment
        const wallGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeLength / segmentCount, 24, 1, true);
        const wallMesh = new THREE.Mesh(wallGeo, spacetimeWallMat);
        wallMesh.rotation.x = Math.PI / 2;
        segGroup.add(wallMesh);

        // Interior negative-energy lining
        const interiorGeo = new THREE.CylinderGeometry(tubeRadius - 2, tubeRadius - 2, tubeLength / segmentCount, 16, 1, true);
        const interiorMesh = new THREE.Mesh(interiorGeo, tubeInteriorMat);
        interiorMesh.rotation.x = Math.PI / 2;
        segGroup.add(interiorMesh);

        // Structural ring at segment boundary
        const ringGeo = new THREE.TorusGeometry(tubeRadius + 1, 1.5, 8, 32);
        const ringMesh = new THREE.Mesh(ringGeo, exoticNodeMat);
        segGroup.add(ringMesh);

        segGroup.position.z = segZ + tubeLength / (segmentCount * 2);
        tubeGroup.add(segGroup);
        tubeSegments.push({ group: segGroup, wall: wallMesh, ring: ringMesh, segIndex: seg, baseZ: segZ });
    }

    group.add(tubeGroup);
    parts.push({ mesh: tubeGroup, name: 'Krasnikov Tube Structure' });

    // ==========================================
    // 3. EXOTIC MATTER ANCHOR NODES
    // ==========================================
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
        const nodeZ = -tubeLength + (i / nodeCount) * tubeLength;
        const nodeGroup = new THREE.Group();

        // Central node (icosahedron)
        const nodeCoreGeo = new THREE.IcosahedronGeometry(4, 1);
        const nodeCoreMesh = new THREE.Mesh(nodeCoreGeo, exoticNodeMat);
        nodeGroup.add(nodeCoreMesh);

        // Stabilization coils around node
        for (let c = 0; c < 3; c++) {
            const coilGeo = new THREE.TorusGeometry(6, 0.5, 6, 16);
            const coilMesh = new THREE.Mesh(coilGeo, copper);
            const coilAngle = (c / 3) * Math.PI;
            coilMesh.rotation.x = coilAngle;
            coilMesh.rotation.y = coilAngle * 0.5;
            nodeGroup.add(coilMesh);
        }

        // Support struts connecting to tube wall
        for (let s = 0; s < 4; s++) {
            const strutAngle = (s / 4) * Math.PI * 2;
            const strutGeo = new THREE.CylinderGeometry(0.5, 0.5, tubeRadius - 5, 4);
            const strutMesh = new THREE.Mesh(strutGeo, aluminum);
            strutMesh.position.set(
                Math.cos(strutAngle) * (tubeRadius / 2 - 2),
                Math.sin(strutAngle) * (tubeRadius / 2 - 2),
                0
            );
            strutMesh.rotation.z = strutAngle + Math.PI / 2;
            nodeGroup.add(strutMesh);
        }

        nodeGroup.position.set(0, 0, nodeZ);
        group.add(nodeGroup);
        exoticNodes.push({ group: nodeGroup, core: nodeCoreMesh, index: i, baseZ: nodeZ });
    }
    parts.push({ mesh: exoticNodes[0]?.core, name: 'Exotic Matter Anchor Nodes' });

    // ==========================================
    // 4. SPACETIME METRIC DISTORTION VISUALIZATION
    // ==========================================
    for (let i = 0; i < 15; i++) {
        const distortZ = -tubeLength + (i / 15) * (tubeLength + 100);
        const distortGeo = new THREE.TorusGeometry(tubeRadius + 10 + i * 2, 0.5, 4, 48);
        const distortMesh = new THREE.Mesh(distortGeo, metricDistortMat);
        distortMesh.position.z = distortZ;
        group.add(distortMesh);
        distortionRings.push({ mesh: distortMesh, baseZ: distortZ, index: i });
    }
    parts.push({ mesh: distortionRings[0]?.mesh, name: 'Spacetime Metric Distortion Field' });

    // ==========================================
    // 5. CHERENKOV-LIKE WAKE CONES
    // ==========================================
    for (let i = 0; i < 6; i++) {
        const wakeZ = -50 - i * 60;
        const wakeGeo = new THREE.ConeGeometry(tubeRadius + 15 + i * 5, 30, 16, 1, true);
        const wakeMesh = new THREE.Mesh(wakeGeo, cherenkovMat);
        wakeMesh.rotation.x = Math.PI / 2;
        wakeMesh.position.z = wakeZ;
        group.add(wakeMesh);
        cherenkovWakes.push({ mesh: wakeMesh, baseZ: wakeZ, index: i });
    }
    parts.push({ mesh: cherenkovWakes[0]?.mesh, name: 'Superluminal Cherenkov Wake' });

    // ==========================================
    // 6. STABILITY BEACONS
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const beaconZ = -tubeLength + (i / 8) * tubeLength + 25;
        const beaconGroup = new THREE.Group();

        for (let side = 0; side < 4; side++) {
            const beaconAngle = (side / 4) * Math.PI * 2;
            const beaconGeo = new THREE.OctahedronGeometry(2, 0);
            const beaconMesh = new THREE.Mesh(beaconGeo, stabilityMat);
            beaconMesh.position.set(
                Math.cos(beaconAngle) * (tubeRadius + 8),
                Math.sin(beaconAngle) * (tubeRadius + 8),
                0
            );
            beaconGroup.add(beaconMesh);
            stabilityBeacons.push({ mesh: beaconMesh, angle: beaconAngle, index: i * 4 + side });
        }

        beaconGroup.position.z = beaconZ;
        group.add(beaconGroup);
    }
    parts.push({ mesh: stabilityBeacons[0]?.mesh, name: 'Tube Stability Beacons' });

    // ==========================================
    // 7. ENERGY CONDUIT PULSES (along tube)
    // ==========================================
    const pulseCount = 40;
    const pulseGeo = new THREE.SphereGeometry(1.5, 8, 8);
    for (let i = 0; i < pulseCount; i++) {
        const pulseMesh = new THREE.Mesh(pulseGeo, exoticNodeMat);
        const pulseAngle = Math.random() * Math.PI * 2;
        pulseMesh.position.set(
            Math.cos(pulseAngle) * tubeRadius,
            Math.sin(pulseAngle) * tubeRadius,
            Math.random() * tubeLength - tubeLength
        );
        group.add(pulseMesh);
        energyPulses.push({
            mesh: pulseMesh,
            angle: pulseAngle,
            speed: 1 + Math.random() * 3,
            z: pulseMesh.position.z,
            radius: tubeRadius
        });
    }

    // ==========================================
    // 8. SPACETIME GRID BACKGROUND
    // ==========================================
    // Flat grid showing spacetime curvature
    for (let x = -8; x <= 8; x++) {
        const lineGeo = new THREE.CylinderGeometry(0.15, 0.15, tubeLength + 200, 4);
        const lineMesh = new THREE.Mesh(lineGeo, gridMat);
        lineMesh.rotation.x = Math.PI / 2;
        lineMesh.position.set(x * 20, -tubeRadius - 20, 0);
        group.add(lineMesh);
    }
    for (let z = 0; z < 20; z++) {
        const lineGeo = new THREE.CylinderGeometry(0.15, 0.15, 320, 4);
        const lineMesh = new THREE.Mesh(lineGeo, gridMat);
        lineMesh.position.set(0, -tubeRadius - 20, -tubeLength + z * (tubeLength + 200) / 20);
        lineMesh.rotation.z = Math.PI / 2;
        group.add(lineMesh);
    }

    // ==========================================
    // 9. STARFIELD (InstancedMesh)
    // ==========================================
    const starCount = 1500;
    const sGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const sMesh = new THREE.InstancedMesh(sGeo, starMat, starCount);
    const sDummy = new THREE.Object3D();
    const sData = [];

    for (let i = 0; i < starCount; i++) {
        const sx = (Math.random() - 0.5) * 800;
        const sy = (Math.random() - 0.5) * 800;
        const sz = (Math.random() - 0.5) * 800;
        sData.push({ x: sx, y: sy, z: sz, size: 0.3 + Math.random() * 0.8 });
        sDummy.position.set(sx, sy, sz);
        sDummy.scale.setScalar(sData[i].size);
        sDummy.updateMatrix();
        sMesh.setMatrixAt(i, sDummy.matrix);
    }
    sMesh.instanceMatrix.needsUpdate = true;
    group.add(sMesh);
    starParticles.push({ mesh: sMesh, data: sData, dummy: sDummy });

    // ==========================================
    // 10. DEPARTURE/ARRIVAL STATIONS
    // ==========================================
    // Departure station at tube entrance
    const departStation = new THREE.Group();
    const dStationGeo = new THREE.TorusGeometry(tubeRadius + 5, 5, 8, 32);
    const dStationMesh = new THREE.Mesh(dStationGeo, darkSteel);
    departStation.add(dStationMesh);
    for (let i = 0; i < 6; i++) {
        const armAngle = (i / 6) * Math.PI * 2;
        const armGeo = new THREE.BoxGeometry(3, 15, 3);
        const armMesh = new THREE.Mesh(armGeo, aluminum);
        armMesh.position.set(
            Math.cos(armAngle) * (tubeRadius + 15),
            Math.sin(armAngle) * (tubeRadius + 15),
            0
        );
        departStation.add(armMesh);
    }
    departStation.position.z = -tubeLength;
    group.add(departStation);
    parts.push({ mesh: dStationMesh, name: 'Departure Station' });

    // Arrival gate marker
    const arriveStation = new THREE.Group();
    const aStationGeo = new THREE.TorusGeometry(tubeRadius + 5, 5, 8, 32);
    const aStationMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00dd66, emissiveIntensity: 2.0, metalness: 0.8 });
    const aStationMesh = new THREE.Mesh(aStationGeo, aStationMat);
    arriveStation.add(aStationMesh);
    arriveStation.position.z = 200;
    group.add(arriveStation);
    parts.push({ mesh: aStationMesh, name: 'Arrival Gate' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "The Krasnikov tube, unlike the Alcubierre warp drive, does not allow FTL travel on the outbound journey. Why must the first trip be subluminal, and how does the tube enable FTL on the return?",
            options: [
                "The tube requires pre-planted exotic matter at regular intervals, which can only be deployed at subluminal speeds",
                "The ship modifies the spacetime metric along its subluminal worldline, creating a tube where the effective light cone is widened. A subsequent traveler through the tube finds their forward light cone encompasses the return path, allowing effective FTL without locally exceeding c",
                "The outbound trip generates gravitational waves that destructively interfere with the tube's structure until it stabilizes",
                "Quantum decoherence prevents the tube from forming during superluminal flight"
            ],
            correct: 1,
            explanation: "Krasnikov (1995) showed that a ship traveling subluminally from A to B can modify the metric along its path such that the interior of the tube has a modified causal structure. Inside the tube, the light cones are 'tilted' or 'widened' so that the future light cone of a point near B includes points near A that are in the causal past in the external metric. This means a return traveler enters the tube and finds that the path from B to A lies within their future light cone—they arrive at A before a light signal in the external spacetime would. The first trip must be subluminal because the tube doesn't exist yet; you can't use a tube that hasn't been created."
        },
        {
            question: "Everett and Roman proved that a Krasnikov tube, combined with time dilation from relative motion, can be used to construct a closed timelike curve (CTC). How does this work?",
            options: [
                "Two Krasnikov tubes are built in opposite directions by ships traveling at high relativistic speeds. Due to the relativity of simultaneity, the tube endpoints become time-shifted, and combining two tubes allows a traveler to arrive before they departed",
                "A single tube naturally develops CTCs at its center due to the extreme spacetime curvature",
                "The exotic matter in the tube undergoes spontaneous temporal reversal, carrying signals backward in time",
                "The tube's interior metric violates the dominant energy condition, which automatically implies CTCs by Tipler's theorem"
            ],
            correct: 0,
            explanation: "Everett and Roman (1997) showed: Ship 1 builds tube AB at near-c, taking time T₁ (ship frame). Ship 2 builds tube CD (parallel, displaced) in the opposite direction. Due to the relativity of simultaneity at high relative velocity, the endpoint synchronization differs: A's clock reads t₁ when B reads t₁ + ΔT, but in the second tube, the shift is reversed. By connecting the tubes' endpoints with ordinary subluminal travel, a closed path exists where the total proper time is negative—a CTC. This is analogous to the 'tachyonic antitelephone' paradox but with macroscopic spacetime structures."
        },
        {
            question: "What is the specific exotic matter requirement for maintaining a Krasnikov tube, and how does it compare to the Alcubierre drive's requirement?",
            options: [
                "The Krasnikov tube requires no exotic matter; it is a vacuum solution to Einstein's equations",
                "Both require the same amount of exotic matter, approximately one Jupiter mass",
                "The tube requires exotic matter with negative energy density distributed along its walls. Unlike the Alcubierre bubble (which requires exotic matter proportional to bubble wall area), the tube's requirement scales with its length, growing linearly and potentially becoming arbitrarily large for interstellar distances",
                "The tube uses only positive-energy matter arranged in a specific Casimir configuration"
            ],
            correct: 2,
            explanation: "The Krasnikov tube metric requires stress-energy that violates the Weak Energy Condition (WEC) throughout the tube walls. The total negative energy scales as E_exotic ~ -L × (cross-section factors), where L is the tube length. For a tube from Earth to a star 10 light-years away, this is enormous. The Alcubierre drive's exotic energy scales with bubble wall area (~R²), which is fixed. The tube's linear scaling with distance makes it increasingly expensive for longer routes, though Krasnikov argued the tube might be 'self-sustaining' once formed, requiring exotic matter only during construction."
        },
        {
            question: "The Krasnikov tube metric can be written as ds² = -(dt - dx)(dt + k(x,t)dx) + dy² + dz² where k(x,t) is a function that transitions from 1 (flat space) outside the tube to some value inside. What constraint on k is required for the tube to function as an FTL shortcut?",
            options: [
                "k must be imaginary inside the tube to create a spacelike metric signature",
                "k must become negative inside the tube, which tilts the light cones so that the x-direction becomes timelike even for signals traveling faster than the external speed of light",
                "k must equal zero inside the tube, creating a null metric along the x-axis",
                "k must oscillate sinusoidally to create constructive interference of gravitational waves"
            ],
            correct: 1,
            explanation: "When k < 0, the metric ds² = -(dt-dx)(dt+kdx) + dy² + dz² has the property that the null condition (ds² = 0) for signals along x gives dt/dx = -k or dt/dx = 1. When k < 0, the null geodesic dt/dx = -k means dx/dt = -1/k > 1 (if |k| < 1), allowing signals to traverse the tube faster than light in the external frame. The light cones inside the tube are tilted relative to the external ones, so a traveler inside follows a perfectly causal (timelike) path through the tube while covering a spacelike interval in the external metric. k must transition smoothly to 1 at the tube walls."
        },
        {
            question: "Hawking's Chronology Protection Conjecture (1992) suggests that quantum effects prevent the formation of closed timelike curves. How would this apply to a Krasnikov tube CTC construction?",
            options: [
                "The Casimir energy between the tube walls would diverge, destroying the tube structure",
                "As the tube configuration approaches the CTC-forming threshold, the renormalized stress-energy tensor ⟨Tμν⟩ of quantum fields on the tube background diverges on the chronology horizon (the Cauchy horizon bounding the CTC region), producing infinite backreaction that either destroys the tube or prevents CTC formation",
                "Quantum tunneling would cause the exotic matter to decay before the CTC forms",
                "The uncertainty principle would prevent precise enough construction of the tube endpoints"
            ],
            correct: 1,
            explanation: "Hawking argued that quantum vacuum fluctuations on backgrounds approaching CTC formation experience exponential blueshifting at the chronology horizon (the boundary of the CTC region). The renormalized ⟨Tμν⟩ diverges there, producing backreaction that modifies the geometry and prevents CTC formation. For Krasnikov tubes, Kay, Radzikowski, and Wald (1997) proved rigorously that the Hadamard condition for quantum field theory fails on spacetimes with CTCs, meaning ⟨Tμν⟩ cannot even be defined. This strongly suggests that the semiclassical approximation breaks down precisely where it would need to hold for CTCs to form—nature may enforce chronology protection."
        }
    ];

    const description = `<h2>Krasnikov Tube Generator</h2>
<p>The Krasnikov Tube Generator is a relativistic spacecraft that permanently modifies the spacetime metric along its flight path, creating a tubular region where effective faster-than-light travel is possible for subsequent travelers. Proposed by Sergei Krasnikov in 1995, this structure offers a persistent FTL corridor without the continuous exotic matter expenditure of a warp drive.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Relativistic Ship:</strong> The primary vessel traveling at near-lightspeed (v ~ 0.9999c), carrying exotic matter generators that modify spacetime behind it as it moves.</li>
<li><strong>Spacetime Tube:</strong> The permanently altered corridor of spacetime left in the ship's wake, where the light cone structure is modified to allow effective FTL transit.</li>
<li><strong>Exotic Matter Anchor Nodes:</strong> Distributed along the tube, these nodes maintain the negative energy density required to sustain the modified metric.</li>
<li><strong>Stability Beacons:</strong> Monitor and maintain the tube's structural integrity against quantum fluctuations and metric instabilities.</li>
</ul>

<h3>Key Distinction from Warp Drive</h3>
<p>Unlike the Alcubierre drive (which creates a moving bubble), the Krasnikov tube is a permanent infrastructure investment. The first trip must be subluminal, but once the tube is laid, any subsequent traveler can traverse it effectively faster than light. The tube modifies the metric from ds² = -dt² + dx² to one where k(x,t) < 0 inside, tilting light cones to encompass FTL worldlines.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Ship engine glow pulsation
        shipElements.forEach(elem => {
            if (elem.type === 'engineGlow') {
                const pulse = 1.0 + Math.sin(time * speed * 8 + elem.index * 1.5) * 0.3;
                elem.mesh.scale.set(pulse, pulse, 1 + Math.sin(time * speed * 6) * 0.2);
                elem.mesh.material.emissiveIntensity = 4 + Math.sin(time * speed * 10 + elem.index) * 3;
            }
            if (elem.type === 'emitterRing') {
                elem.mesh.rotation.z = time * speed * 3;
                const ringPulse = 1.0 + Math.sin(time * speed * 5) * 0.1;
                elem.mesh.scale.setScalar(ringPulse);
            }
        });

        // 2. Tube segment wall oscillation
        tubeSegments.forEach(seg => {
            const wave = Math.sin(time * speed * 2 - seg.segIndex * 0.5) * 0.02;
            seg.wall.scale.set(1 + wave, 1, 1 + wave);
            seg.wall.material.opacity = 0.2 + Math.sin(time * speed * 3 + seg.segIndex * 0.3) * 0.08;
            seg.ring.rotation.z = time * speed * 1.5 + seg.segIndex * 0.5;
        });

        // 3. Exotic matter node pulsation
        exoticNodes.forEach(node => {
            const pulse = 1.0 + Math.sin(time * speed * 4 + node.index * 0.8) * 0.3;
            node.core.scale.setScalar(pulse);
            node.core.rotation.x = time * speed * 2;
            node.core.rotation.y = time * speed * 1.5;
            node.core.material.emissiveIntensity = 3 + Math.sin(time * speed * 6 + node.index) * 2;
        });

        // 4. Metric distortion ring rippling
        distortionRings.forEach(ring => {
            const ripple = Math.sin(time * speed * 2 - ring.index * 0.6) * 3;
            ring.mesh.position.y = ripple;
            const distortScale = 1 + Math.sin(time * speed * 1.5 + ring.index * 0.4) * 0.05;
            ring.mesh.scale.set(distortScale, distortScale, 1);
        });

        // 5. Cherenkov wake propagation
        cherenkovWakes.forEach(wake => {
            const propZ = wake.baseZ - ((time * speed * 30 + wake.index * 30) % 120);
            wake.mesh.position.z = propZ;
            wake.mesh.material.opacity = 0.3 + Math.sin(time * speed * 4 + wake.index) * 0.15;
            const scaleP = 1 + Math.sin(time * speed * 3 + wake.index) * 0.1;
            wake.mesh.scale.set(scaleP, scaleP, 1);
        });

        // 6. Energy pulse flow along tube
        energyPulses.forEach(pulse => {
            pulse.z -= pulse.speed * speed * 2;
            if (pulse.z < -tubeLength - 50) pulse.z = 200;
            pulse.mesh.position.z = pulse.z;
            const glow = 1 + Math.sin(time * speed * 8 + pulse.z * 0.05) * 0.5;
            pulse.mesh.scale.setScalar(glow);
        });

        // 7. Stability beacon flashing
        stabilityBeacons.forEach(beacon => {
            const flash = Math.sin(time * speed * 5 + beacon.index * 0.7) > 0.5 ? 1.5 : 0.5;
            beacon.mesh.scale.setScalar(flash);
            beacon.mesh.rotation.y = time * speed * 3;
        });

        // 8. Star parallax effect (simulate ship motion)
        starParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const s = data[i];
                const parallaxZ = s.z - time * speed * 0.5;
                const wrappedZ = ((parallaxZ % 800) + 800) % 800 - 400;
                dummy.position.set(s.x, s.y, wrappedZ);
                dummy.scale.setScalar(s.size);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
