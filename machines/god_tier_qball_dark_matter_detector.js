import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM Q-BALL DETECTOR MATERIALS
    // ==========================================
    const superfluidMat = new THREE.MeshStandardMaterial({ color: 0x0044aa, emissive: 0x003388, emissiveIntensity: 1.5, transparent: true, opacity: 0.35, side: 2 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.9, roughness: 0.15 });
    const squidMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ddaa, emissiveIntensity: 3.0 });
    const cryoMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, emissive: 0x4488cc, emissiveIntensity: 1.0, transparent: true, opacity: 0.3 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x554433, roughness: 0.9, metalness: 0.1 });
    const shockwaveMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 5.0, transparent: true, opacity: 0.4 });
    const qballMat = new THREE.MeshStandardMaterial({ color: 0x440066, emissive: 0x330055, emissiveIntensity: 0.5, transparent: true, opacity: 0.15 });
    const dataMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00cc44, emissiveIntensity: 2.0 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.85, roughness: 0.2 });
    const nucleationMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffcc00, emissiveIntensity: 6.0, transparent: true, opacity: 0.7 });
    const insulationMat = new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.8, metalness: 0.1 });

    // Dynamic arrays
    const squidSensors = [];
    const superfluidBubbles = [];
    const shockwaveRings = [];
    const qballTrajectory = [];
    const dataReadouts = [];
    const cryoPipes = [];
    const nucleationSites = [];

    // ==========================================
    // 1. UNDERGROUND CAVERN
    // ==========================================
    const cavernGroup = new THREE.Group();

    // Cavern walls (rough rock)
    const cavernGeo = new THREE.SphereGeometry(250, 16, 16, 0, Math.PI * 2, 0, Math.PI);
    const cavernMesh = new THREE.Mesh(cavernGeo, rockMat);
    cavernMesh.material.side = 1; // BackSide for interior view
    cavernGroup.add(cavernMesh);
    parts.push({ mesh: cavernMesh, name: 'Underground Cavern (2km depth)' });

    // Rock pillars
    for (let i = 0; i < 6; i++) {
        const pillarAngle = (i / 6) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(8 + Math.random() * 5, 10 + Math.random() * 5, 200, 8);
        const pillarMesh = new THREE.Mesh(pillarGeo, rockMat);
        pillarMesh.position.set(
            Math.cos(pillarAngle) * 200,
            0,
            Math.sin(pillarAngle) * 200
        );
        cavernGroup.add(pillarMesh);
    }

    group.add(cavernGroup);

    // ==========================================
    // 2. MAIN CRYOGENIC TANK
    // ==========================================
    const tankGroup = new THREE.Group();

    // Outer tank shell
    const outerTankGeo = new THREE.CylinderGeometry(80, 80, 150, 32, 1, false);
    const outerTankMesh = new THREE.Mesh(outerTankGeo, tankMat);
    tankGroup.add(outerTankMesh);
    parts.push({ mesh: outerTankMesh, name: 'Outer Cryogenic Tank Shell' });

    // Thermal insulation layer
    const insulGeo = new THREE.CylinderGeometry(75, 75, 145, 24, 1, true);
    const insulMesh = new THREE.Mesh(insulGeo, insulationMat);
    tankGroup.add(insulMesh);

    // Inner tank (contains superfluid)
    const innerTankGeo = new THREE.CylinderGeometry(70, 70, 140, 32, 1, false);
    const innerTankMesh = new THREE.Mesh(innerTankGeo, superfluidMat);
    tankGroup.add(innerTankMesh);
    parts.push({ mesh: innerTankMesh, name: 'Superfluid Helium-4 Volume' });

    // Tank top dome
    const topDomeGeo = new THREE.SphereGeometry(80, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDomeMesh = new THREE.Mesh(topDomeGeo, tankMat);
    topDomeMesh.position.y = 75;
    tankGroup.add(topDomeMesh);

    // Tank bottom dome
    const botDomeGeo = new THREE.SphereGeometry(80, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botDomeMesh = new THREE.Mesh(botDomeGeo, tankMat);
    botDomeMesh.position.y = -75;
    tankGroup.add(botDomeMesh);

    // Access hatches
    for (let i = 0; i < 4; i++) {
        const hatchAngle = (i / 4) * Math.PI * 2;
        const hatchGeo = new THREE.CylinderGeometry(8, 8, 5, 12);
        const hatchMesh = new THREE.Mesh(hatchGeo, darkSteel);
        hatchMesh.position.set(
            Math.cos(hatchAngle) * 80,
            40,
            Math.sin(hatchAngle) * 80
        );
        hatchMesh.rotation.z = Math.PI / 2;
        hatchMesh.rotation.y = hatchAngle;
        tankGroup.add(hatchMesh);
    }

    // Structural ring reinforcements
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(82, 3, 8, 32);
        const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
        ringMesh.position.y = -50 + i * 25;
        tankGroup.add(ringMesh);
    }

    group.add(tankGroup);

    // ==========================================
    // 3. SQUID SENSOR ARRAYS
    // ==========================================
    const squidGroup = new THREE.Group();

    // Sensors covering the tank interior walls
    const squidPerRing = 16;
    const squidRings = 6;
    for (let ring = 0; ring < squidRings; ring++) {
        const ringY = -50 + ring * 20;
        for (let s = 0; s < squidPerRing; s++) {
            const sAngle = (s / squidPerRing) * Math.PI * 2;
            const sensorGroup = new THREE.Group();

            // SQUID housing
            const housingGeo = new THREE.BoxGeometry(5, 5, 3);
            const housingMesh = new THREE.Mesh(housingGeo, darkSteel);
            sensorGroup.add(housingMesh);

            // Josephson junction indicator
            const junctionGeo = new THREE.SphereGeometry(1.5, 8, 8);
            const junctionMesh = new THREE.Mesh(junctionGeo, squidMat);
            junctionMesh.position.z = 2;
            sensorGroup.add(junctionMesh);

            // Pickup coil
            const coilGeo = new THREE.TorusGeometry(2.5, 0.3, 6, 12);
            const coilMesh = new THREE.Mesh(coilGeo, copper);
            coilMesh.position.z = 1;
            sensorGroup.add(coilMesh);

            sensorGroup.position.set(
                Math.cos(sAngle) * 68,
                ringY,
                Math.sin(sAngle) * 68
            );
            sensorGroup.lookAt(0, ringY, 0);

            squidGroup.add(sensorGroup);
            squidSensors.push({
                group: sensorGroup,
                junction: junctionMesh,
                ring, index: s,
                angle: sAngle, y: ringY
            });
        }
    }

    group.add(squidGroup);
    parts.push({ mesh: squidGroup, name: 'SQUID Magnetometer Array' });

    // ==========================================
    // 4. Q-BALL TRAJECTORY VISUALIZATION
    // ==========================================
    // The Q-ball path through Earth and the tank
    const qballPoints = [];
    for (let t = 0; t <= 40; t++) {
        const param = t / 40;
        qballPoints.push(new THREE.Vector3(
            Math.sin(param * 0.5) * 20,
            250 - param * 500,
            Math.cos(param * 0.3) * 15
        ));
    }
    const qballCurve = new THREE.CatmullRomCurve3(qballPoints);
    const qballPathGeo = new THREE.TubeGeometry(qballCurve, 40, 1.5, 6, false);
    const qballPathMesh = new THREE.Mesh(qballPathGeo, qballMat);
    group.add(qballPathMesh);
    parts.push({ mesh: qballPathMesh, name: 'Q-ball Trajectory Path' });

    // Q-ball object itself
    const qballGeo = new THREE.SphereGeometry(8, 16, 16);
    const qballObjMesh = new THREE.Mesh(qballGeo, qballMat);
    qballObjMesh.position.y = 200; // Start above
    group.add(qballObjMesh);
    qballTrajectory.push({ mesh: qballObjMesh, curve: qballCurve, phase: 0 });
    parts.push({ mesh: qballObjMesh, name: 'Q-ball Dark Matter Soliton' });

    // ==========================================
    // 5. SHOCKWAVE/NUCLEATION EVENT
    // ==========================================
    for (let i = 0; i < 8; i++) {
        const swGeo = new THREE.TorusGeometry(5 + i * 8, 1, 6, 32);
        const swMesh = new THREE.Mesh(swGeo, i < 4 ? nucleationMat : shockwaveMat);
        swMesh.scale.setScalar(0.01); // Start invisible
        group.add(swMesh);
        shockwaveRings.push({ mesh: swMesh, baseRadius: 5 + i * 8, index: i });
    }
    parts.push({ mesh: shockwaveRings[0]?.mesh, name: 'Nucleation Shockwave' });

    // Nucleation flash point
    const flashGeo = new THREE.IcosahedronGeometry(3, 2);
    const flashMesh = new THREE.Mesh(flashGeo, nucleationMat);
    flashMesh.scale.setScalar(0.01);
    group.add(flashMesh);
    nucleationSites.push({ mesh: flashMesh });
    parts.push({ mesh: flashMesh, name: 'Phase Transition Flash' });

    // ==========================================
    // 6. SUPERFLUID BUBBLE SYSTEM (InstancedMesh)
    // ==========================================
    const bubbleCount = 300;
    const bubbleGeo = new THREE.SphereGeometry(1, 6, 6);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x4488ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.4 });
    const bubbleMesh = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    const bubbleDummy = new THREE.Object3D();
    const bubbleData = [];

    for (let i = 0; i < bubbleCount; i++) {
        const bAngle = Math.random() * Math.PI * 2;
        const bR = Math.random() * 65;
        const bY = (Math.random() - 0.5) * 130;
        bubbleData.push({
            angle: bAngle, radius: bR, y: bY,
            speed: 0.2 + Math.random() * 0.8,
            size: 0.5 + Math.random() * 1.5,
            riseSpeed: 0.1 + Math.random() * 0.5
        });
    }
    group.add(bubbleMesh);
    superfluidBubbles.push({ mesh: bubbleMesh, data: bubbleData, dummy: bubbleDummy });
    parts.push({ mesh: bubbleMesh, name: 'Superfluid Bubble Chamber' });

    // ==========================================
    // 7. CRYOGENIC COOLING INFRASTRUCTURE
    // ==========================================
    const cryoGroup = new THREE.Group();

    // Main coolant lines
    for (let i = 0; i < 4; i++) {
        const pipeAngle = (i / 4) * Math.PI * 2 + Math.PI / 8;

        // Vertical pipe
        const vPipeGeo = new THREE.CylinderGeometry(4, 4, 200, 8);
        const vPipeMesh = new THREE.Mesh(vPipeGeo, pipeMat);
        vPipeMesh.position.set(
            Math.cos(pipeAngle) * 95,
            0,
            Math.sin(pipeAngle) * 95
        );
        cryoGroup.add(vPipeMesh);

        // Horizontal feeder
        const hPipeGeo = new THREE.CylinderGeometry(3, 3, 20, 6);
        const hPipeMesh = new THREE.Mesh(hPipeGeo, pipeMat);
        hPipeMesh.rotation.z = Math.PI / 2;
        hPipeMesh.rotation.y = pipeAngle;
        hPipeMesh.position.set(
            Math.cos(pipeAngle) * 88,
            30,
            Math.sin(pipeAngle) * 88
        );
        cryoGroup.add(hPipeMesh);

        // Coolant flow indicators
        for (let c = 0; c < 6; c++) {
            const flowGeo = new THREE.SphereGeometry(2, 6, 6);
            const flowMesh = new THREE.Mesh(flowGeo, cryoMat);
            flowMesh.position.set(
                Math.cos(pipeAngle) * 95,
                -80 + c * 30,
                Math.sin(pipeAngle) * 95
            );
            cryoGroup.add(flowMesh);
            cryoPipes.push({ mesh: flowMesh, baseY: -80 + c * 30, pipeIndex: i, flowIndex: c });
        }
    }

    // Compressor units
    for (let i = 0; i < 4; i++) {
        const compAngle = (i / 4) * Math.PI * 2;
        const compGeo = new THREE.BoxGeometry(15, 20, 15);
        const compMesh = new THREE.Mesh(compGeo, darkSteel);
        compMesh.position.set(
            Math.cos(compAngle) * 130,
            -60,
            Math.sin(compAngle) * 130
        );
        cryoGroup.add(compMesh);
    }

    group.add(cryoGroup);
    parts.push({ mesh: cryoGroup, name: 'Cryogenic Cooling Plant' });

    // ==========================================
    // 8. DATA ACQUISITION & READOUT
    // ==========================================
    const daqGroup = new THREE.Group();

    for (let i = 0; i < 6; i++) {
        const daqAngle = (i / 6) * Math.PI * 2;
        const rackGeo = new THREE.BoxGeometry(8, 30, 5);
        const rackMesh = new THREE.Mesh(rackGeo, darkSteel);
        rackMesh.position.set(
            Math.cos(daqAngle) * 120,
            -10,
            Math.sin(daqAngle) * 120
        );
        daqGroup.add(rackMesh);

        // Status LEDs
        for (let led = 0; led < 8; led++) {
            const ledGeo = new THREE.SphereGeometry(0.5, 4, 4);
            const ledMesh = new THREE.Mesh(ledGeo, dataMat);
            ledMesh.position.set(
                Math.cos(daqAngle) * 120 + 3,
                -20 + led * 4,
                Math.sin(daqAngle) * 120 + 3
            );
            daqGroup.add(ledMesh);
            dataReadouts.push({ mesh: ledMesh, index: i * 8 + led });
        }
    }

    group.add(daqGroup);
    parts.push({ mesh: daqGroup, name: 'Data Acquisition System' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Q-balls are non-topological solitons that arise in supersymmetric extensions of the Standard Model. What conserved charge gives them their stability, and why can't they simply decay into lighter particles?",
            options: [
                "Electric charge conservation prevents their decay into photons",
                "They carry a conserved global U(1) charge (such as baryon number B in SUSY models). A Q-ball with charge Q has energy E(Q) < Q·m_q (where m_q is the lightest charged particle mass), meaning they are energetically forbidden from decaying into Q individual particles because the soliton's binding energy makes the bound state lighter",
                "They are topologically stable like magnetic monopoles, with a non-trivial winding number",
                "The Pauli exclusion principle prevents their constituent fermions from escaping"
            ],
            correct: 1,
            explanation: "In SUSY theories with flat directions in the scalar potential, a scalar field φ carrying U(1) charge Q can form a coherent lump (Q-ball) with energy E(Q) = ω·Q + (surface terms), where ω < m_φ is the internal rotation frequency. If E(Q)/Q < m_lightest (energy per unit charge is less than the lightest charged particle's mass), the Q-ball cannot decay into free quanta because this would cost more energy than the Q-ball possesses. This is Coleman's stability criterion. For SUSY Q-balls carrying baryon number, this makes them absolutely stable dark matter candidates."
        },
        {
            question: "If Q-balls constitute a significant fraction of dark matter, how would a Q-ball interact with a superfluid ⁴He detector as it passes through?",
            options: [
                "It would produce Cherenkov radiation in the superfluid",
                "The Q-ball's large cross-section (~πR² where R ~ Q^(1/3)·m_φ⁻¹ for large Q) causes nuclear-scale energy deposition along its path. In superfluid helium, this creates a localized heating event that nucleates a bubble in the metastable superheated superfluid, producing a detectable acoustic shockwave and scintillation light",
                "It would pass through without any interaction due to its dark matter nature",
                "It would be gravitationally captured and orbit inside the tank"
            ],
            correct: 1,
            explanation: "SUSY Q-balls with baryon number have geometric cross-sections σ ~ πR² with R ~ 1/m_φ · Q^(1/3). For Q ~ 10²⁰-10²⁶ (cosmologically motivated values), R ~ 10⁻¹³ to 10⁻¹¹ cm—nuclear scale. As the Q-ball traverses superfluid helium, it deposits energy through interactions with nuclei along its path. In a superheated or supersaturated superfluid, this energy deposition nucleates a phase transition (bubble formation) at the interaction site. The resulting acoustic pulse is detectable by SQUID-based pressure sensors, and the helium scintillation produces detectable photons. This is analogous to a bubble chamber but at ultra-low temperatures."
        },
        {
            question: "SQUIDs (Superconducting Quantum Interference Devices) are used in Q-ball detectors for their extraordinary sensitivity. What physical quantity do they measure, and what is their sensitivity limit?",
            options: [
                "Temperature, with sensitivity ~10⁻⁶ K",
                "Magnetic flux, with sensitivity approaching the single flux quantum Φ₀ = h/(2e) ≈ 2.07 × 10⁻¹⁵ Wb, enabling detection of the minute magnetic field changes caused by the superconducting current response to energy deposition in the superfluid",
                "Electric current, with sensitivity ~10⁻³ A",
                "Pressure, with sensitivity ~10⁻² Pa"
            ],
            correct: 1,
            explanation: "A SQUID consists of a superconducting loop interrupted by two Josephson junctions. The critical current through the device oscillates as a function of the magnetic flux threading the loop, with period Φ₀ = h/(2e) ≈ 2.07 × 10⁻¹⁵ Wb. Modern SQUIDs achieve flux noise levels of ~10⁻⁶ Φ₀/√Hz, corresponding to magnetic field sensitivities of ~10⁻¹⁸ T/√Hz—the most sensitive magnetic field detectors known. In Q-ball detection, SQUIDs detect the magnetic field changes from: (1) superconducting current redistribution after energy deposition, (2) motion of quantized vortices in the superfluid, and (3) thermal magnetic noise changes at the nucleation site."
        },
        {
            question: "Kusenko and Shaposhnikov proposed that SUSY Q-balls formed during the Affleck-Dine baryogenesis mechanism in the early universe could simultaneously explain dark matter and the baryon asymmetry. How does this work?",
            options: [
                "Q-balls converted all antimatter into dark matter through direct annihilation",
                "During Affleck-Dine baryogenesis, a rotating scalar condensate carrying baryon number fragments into Q-balls. Stable B-balls (Q-balls carrying baryon number) survive as dark matter, while the baryon number they DON'T capture remains as ordinary baryonic matter. The ratio Ω_DM/Ω_B ~ 5 is then determined by the fragmentation dynamics",
                "Q-balls catalyze proton decay, converting excess baryons into dark matter",
                "The Q-balls act as seeds for structure formation, gravitationally attracting baryonic matter"
            ],
            correct: 1,
            explanation: "In Affleck-Dine baryogenesis, a SUSY flat direction scalar field φ acquires a large VEV and net baryon number in the early universe. As it oscillates and fragments, it produces Q-balls carrying baryon number. If Q-balls with B > B_crit are stable (E/B < m_proton), they survive as dark matter. The total baryon number B_total = B_in_Qballs + B_free. The dark matter density is Ω_DM ~ (E/B)·B_in_Qballs, while Ω_B ~ m_p·B_free. The observed ratio Ω_DM/Ω_B ≈ 5 constrains the fragmentation efficiency and Q-ball properties, providing a natural explanation for the cosmological coincidence that dark and baryonic matter densities are within an order of magnitude."
        },
        {
            question: "What distinguishes a Q-ball's experimental signature from that of a WIMP (Weakly Interacting Massive Particle) in a direct dark matter detection experiment?",
            options: [
                "WIMPs and Q-balls produce identical signals and cannot be distinguished",
                "WIMPs produce single nuclear recoil events (point-like energy deposition ~1-100 keV), while Q-balls produce extended, track-like signatures with continuous energy deposition along their path through the detector, potentially depositing MeV-scale energy over centimeter-scale path lengths due to their macroscopic cross-section",
                "Q-balls produce only electromagnetic signals while WIMPs produce only acoustic signals",
                "WIMPs interact only with electrons while Q-balls interact only with nuclei"
            ],
            correct: 1,
            explanation: "The key distinction is geometric: WIMPs are point particles with weak-scale cross-sections (σ ~ 10⁻⁴⁶ cm²), producing rare, localized single-scatter events. Q-balls are extended objects (R ~ 10⁻¹³-10⁻¹¹ cm for cosmological Q-balls) with geometric cross-sections (σ ~ πR² ~ 10⁻²⁶-10⁻²² cm²), interacting with every nucleus along their path. A Q-ball traversing a detector leaves a continuous track of energy deposition—more like a heavily-ionizing particle than a WIMP. The total energy deposited can be MeV or higher, well above WIMP recoil energies. This makes Q-ball detection easier in some ways but requires different detector geometries (large volume, directional sensitivity)."
        }
    ];

    const description = `<h2>Q-ball Dark Matter Detector</h2>
<p>The Q-ball Dark Matter Detector is a massive underground cryogenic facility designed to detect macroscopic dark matter solitons predicted by supersymmetric extensions of the Standard Model. Q-balls are non-topological solitons—coherent lumps of scalar field carrying conserved charge (such as baryon number)—that may constitute a significant fraction of cosmic dark matter.</p>

<h3>Detection Principle</h3>
<ul>
<li><strong>Superfluid Target:</strong> A 500-tonne superfluid ⁴He tank maintained at 15 mK in a supersaturated metastable state. A passing Q-ball deposits energy along its track, nucleating a localized phase transition.</li>
<li><strong>SQUID Arrays:</strong> 96 superconducting quantum interference devices line the tank walls, detecting the magnetic flux changes from energy deposition with sensitivity approaching single flux quanta (Φ₀ ≈ 2×10⁻¹⁵ Wb).</li>
<li><strong>Acoustic Detection:</strong> The nucleation event produces a shockwave in the superfluid, detectable by piezoelectric sensors.</li>
<li><strong>Track Reconstruction:</strong> Unlike point-like WIMP interactions, Q-balls leave extended tracks through the detector, enabling directional reconstruction of the dark matter velocity vector.</li>
</ul>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // Event cycle: Q-ball passes through periodically
        const cycleTime = 20;
        const phase = (time * speed) % cycleTime;
        const eventPhase = phase / cycleTime;

        // 1. Q-ball trajectory (passes through tank)
        qballTrajectory.forEach(qb => {
            if (eventPhase < 0.4) {
                // Q-ball approaching and passing through
                const t = eventPhase / 0.4;
                const point = qb.curve.getPoint(t);
                qb.mesh.position.copy(point);
                qb.mesh.material.opacity = 0.15 + Math.sin(time * speed * 5) * 0.05;
                const qScale = 1 + Math.sin(time * speed * 8) * 0.1;
                qb.mesh.scale.setScalar(qScale);
            } else {
                qb.mesh.position.set(0, -300, 0); // Hide
            }
        });

        // 2. Shockwave expansion (after Q-ball passes through tank ~phase 0.2-0.5)
        shockwaveRings.forEach(sw => {
            if (eventPhase > 0.2 && eventPhase < 0.6) {
                const swProgress = (eventPhase - 0.2) / 0.4;
                const swScale = swProgress * 3;
                sw.mesh.scale.setScalar(swScale);
                sw.mesh.material.opacity = 0.4 * (1 - swProgress);
                sw.mesh.rotation.x = Math.PI / 2 + Math.sin(time * speed + sw.index) * 0.2;
                sw.mesh.rotation.y = time * speed * 0.5;
            } else {
                sw.mesh.scale.setScalar(0.01);
            }
        });

        // 3. Nucleation flash
        nucleationSites.forEach(ns => {
            if (eventPhase > 0.2 && eventPhase < 0.35) {
                const flashProgress = (eventPhase - 0.2) / 0.15;
                const flashScale = Math.sin(flashProgress * Math.PI) * 5;
                ns.mesh.scale.setScalar(flashScale);
                ns.mesh.material.emissiveIntensity = 6 * (1 - flashProgress);
                ns.mesh.rotation.x = time * speed * 10;
                ns.mesh.rotation.y = time * speed * 7;
            } else {
                ns.mesh.scale.setScalar(0.01);
            }
        });

        // 4. SQUID sensor response
        squidSensors.forEach(sq => {
            const inEvent = eventPhase > 0.2 && eventPhase < 0.7;
            if (inEvent) {
                const responseDelay = sq.ring * 0.02;
                const eventProgress = Math.max(0, (eventPhase - 0.2 - responseDelay) / 0.5);
                const intensity = 3 + Math.sin(eventProgress * Math.PI * 4) * 4;
                sq.junction.material.emissiveIntensity = intensity;
                const jScale = 1 + Math.sin(eventProgress * Math.PI * 6 + sq.index) * 0.3;
                sq.junction.scale.setScalar(jScale);
            } else {
                sq.junction.material.emissiveIntensity = 1 + Math.sin(time * speed * 2 + sq.index * 0.3) * 0.5;
                sq.junction.scale.setScalar(1);
            }
        });

        // 5. Superfluid bubbles
        superfluidBubbles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            const bubblesActive = eventPhase > 0.2 && eventPhase < 0.8;
            for (let i = 0; i < data.length; i++) {
                const b = data[i];
                if (bubblesActive) {
                    b.y += b.riseSpeed * speed * 0.5;
                    if (b.y > 65) b.y = -65;
                    b.angle += b.speed * speed * 0.01;
                    dummy.position.set(
                        Math.cos(b.angle) * b.radius,
                        b.y,
                        Math.sin(b.angle) * b.radius
                    );
                    dummy.scale.setScalar(b.size * (0.5 + Math.sin(time * speed * 3 + i) * 0.3));
                } else {
                    b.y += b.riseSpeed * speed * 0.1;
                    if (b.y > 65) b.y = -65;
                    dummy.position.set(
                        Math.cos(b.angle) * b.radius,
                        b.y,
                        Math.sin(b.angle) * b.radius
                    );
                    dummy.scale.setScalar(b.size * 0.3);
                }
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 6. Cryogenic coolant flow
        cryoPipes.forEach(cp => {
            const flowY = cp.baseY + ((time * speed * 15 + cp.flowIndex * 8) % 30);
            cp.mesh.position.y = flowY;
        });

        // 7. Data readout LEDs (rapid flashing during event)
        dataReadouts.forEach(dr => {
            const inEvent = eventPhase > 0.2 && eventPhase < 0.8;
            if (inEvent) {
                const flash = Math.sin(time * speed * 15 + dr.index * 0.5) > 0 ? 3.0 : 0.5;
                dr.mesh.material.emissiveIntensity = flash;
            } else {
                dr.mesh.material.emissiveIntensity = 1 + Math.sin(time * speed * 0.5 + dr.index * 0.2) * 0.3;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
