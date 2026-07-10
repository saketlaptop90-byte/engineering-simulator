import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM STRANGELET REACTOR MATERIALS
    // ==========================================
    const strangeCoreMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 6.0 });
    const strangeAuraMat = new THREE.MeshStandardMaterial({ color: 0xdd00dd, emissive: 0xaa00aa, emissiveIntensity: 3.0, transparent: true, opacity: 0.3, wireframe: true });
    const magBottleMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.2, side: 2 });
    const acceleratorMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.15 });
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 4.0, transparent: true, opacity: 0.6 });
    const quarkGluonMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 5.0, transparent: true, opacity: 0.7 });
    const colorChargeMats = [
        new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 4.0 }), // Red
        new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 4.0 }), // Green
        new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 4.0 })  // Blue
    ];
    const warningMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3.0 });
    const containmentMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.95, roughness: 0.1, emissive: 0x112233, emissiveIntensity: 0.3 });
    const coolantMat = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0066cc, emissiveIntensity: 1.5, transparent: true, opacity: 0.5 });
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });

    // Dynamic arrays
    const coreElements = [];
    const magneticFieldRings = [];
    const injectedParticles = [];
    const conversionParticles = [];
    const warningLights = [];
    const coolingPulses = [];
    const colorRadiation = [];
    const containmentFields = [];

    // ==========================================
    // 1. STRANGELET CORE
    // ==========================================
    const coreGroup = new THREE.Group();

    // Central strangelet droplet
    const coreGeo = new THREE.IcosahedronGeometry(8, 3);
    const coreMesh = new THREE.Mesh(coreGeo, strangeCoreMat);
    coreGroup.add(coreMesh);
    parts.push({ mesh: coreMesh, name: 'Strangelet Core (u,d,s Quark Matter)' });
    coreElements.push({ mesh: coreMesh, type: 'core' });

    // Core aura (deconfined quark-gluon plasma boundary)
    const auraGeo = new THREE.IcosahedronGeometry(12, 2);
    const auraMesh = new THREE.Mesh(auraGeo, strangeAuraMat);
    coreGroup.add(auraMesh);
    coreElements.push({ mesh: auraMesh, type: 'aura' });

    // Strange quark visualization (3 types of quarks orbiting)
    for (let q = 0; q < 3; q++) {
        const quarkCount = 20;
        const qGeo = new THREE.SphereGeometry(0.8, 6, 6);
        const qMesh = new THREE.InstancedMesh(qGeo, colorChargeMats[q], quarkCount);
        const qDummy = new THREE.Object3D();
        const qData = [];
        for (let i = 0; i < quarkCount; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            qData.push({ phi, theta, r: 5 + Math.random() * 5, speed: 3 + Math.random() * 5 });
        }
        coreGroup.add(qMesh);
        colorRadiation.push({ mesh: qMesh, data: qData, dummy: qDummy, colorIndex: q });
    }

    group.add(coreGroup);

    // ==========================================
    // 2. MAGNETIC BOTTLE CONTAINMENT
    // ==========================================
    const bottleGroup = new THREE.Group();

    // Primary containment sphere
    const primaryContainGeo = new THREE.SphereGeometry(30, 32, 32);
    const primaryContainMesh = new THREE.Mesh(primaryContainGeo, magBottleMat);
    bottleGroup.add(primaryContainMesh);
    parts.push({ mesh: primaryContainMesh, name: 'Primary Magnetic Bottle' });
    containmentFields.push({ mesh: primaryContainMesh, type: 'primary' });

    // Secondary containment
    const secondContainGeo = new THREE.SphereGeometry(45, 24, 24);
    const secondContainMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, emissive: 0x1133aa, emissiveIntensity: 1.0, transparent: true, opacity: 0.1, wireframe: true, side: 2 });
    const secondContainMesh = new THREE.Mesh(secondContainGeo, secondContainMat);
    bottleGroup.add(secondContainMesh);
    containmentFields.push({ mesh: secondContainMesh, type: 'secondary' });

    // Magnetic coil arrays (toroidal)
    for (let i = 0; i < 8; i++) {
        const coilAngle = (i / 8) * Math.PI;
        const coilGeo = new THREE.TorusGeometry(35, 3, 8, 32);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        coilMesh.rotation.x = coilAngle;
        coilMesh.rotation.y = coilAngle * 0.5;
        bottleGroup.add(coilMesh);
        magneticFieldRings.push({ mesh: coilMesh, baseAngle: coilAngle, index: i });
    }

    // Magnetic field line visualization
    for (let i = 0; i < 12; i++) {
        const fieldPoints = [];
        const fAngle = (i / 12) * Math.PI * 2;
        for (let t = 0; t <= 30; t++) {
            const param = (t / 30) * Math.PI;
            const r = 15 + Math.sin(param) * 20;
            fieldPoints.push(new THREE.Vector3(
                Math.cos(fAngle) * Math.sin(param) * r * 0.3,
                Math.cos(param) * r,
                Math.sin(fAngle) * Math.sin(param) * r * 0.3
            ));
        }
        const fieldCurve = new THREE.CatmullRomCurve3(fieldPoints);
        const fieldGeo = new THREE.TubeGeometry(fieldCurve, 25, 0.3, 4, false);
        const fieldMesh = new THREE.Mesh(fieldGeo, magBottleMat);
        bottleGroup.add(fieldMesh);
    }

    group.add(bottleGroup);

    // ==========================================
    // 3. PARTICLE ACCELERATOR INJECTION RING
    // ==========================================
    const accelGroup = new THREE.Group();

    // Main accelerator ring
    const accelRingGeo = new THREE.TorusGeometry(80, 5, 16, 64);
    const accelRingMesh = new THREE.Mesh(accelRingGeo, acceleratorMat);
    accelRingMesh.rotation.x = Math.PI / 2;
    accelGroup.add(accelRingMesh);
    parts.push({ mesh: accelRingMesh, name: 'Hadron Injection Accelerator Ring' });

    // Accelerator cavity segments
    for (let i = 0; i < 24; i++) {
        const cavAngle = (i / 24) * Math.PI * 2;
        const cavGeo = new THREE.BoxGeometry(8, 12, 8);
        const cavMesh = new THREE.Mesh(cavGeo, acceleratorMat);
        cavMesh.position.set(
            Math.cos(cavAngle) * 80,
            0,
            Math.sin(cavAngle) * 80
        );
        cavMesh.rotation.y = -cavAngle;
        accelGroup.add(cavMesh);
    }

    // RF cavities
    for (let i = 0; i < 8; i++) {
        const rfAngle = (i / 8) * Math.PI * 2;
        const rfGeo = new THREE.CylinderGeometry(4, 4, 15, 12);
        const rfMesh = new THREE.Mesh(rfGeo, copper);
        rfMesh.position.set(
            Math.cos(rfAngle) * 80,
            10,
            Math.sin(rfAngle) * 80
        );
        accelGroup.add(rfMesh);
    }

    // Injection beam lines (connecting accelerator to core)
    for (let i = 0; i < 4; i++) {
        const beamAngle = (i / 4) * Math.PI * 2;
        const beamGeo = new THREE.CylinderGeometry(1.5, 1.5, 45, 6);
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        const midR = 57;
        beamMesh.position.set(
            Math.cos(beamAngle) * midR,
            0,
            Math.sin(beamAngle) * midR
        );
        beamMesh.rotation.z = Math.PI / 2;
        beamMesh.rotation.y = -beamAngle;
        accelGroup.add(beamMesh);
        parts.push({ mesh: beamMesh, name: `Injection Beam Line ${i + 1}` });
    }

    group.add(accelGroup);

    // ==========================================
    // 4. INJECTED PARTICLE STREAM (InstancedMesh)
    // ==========================================
    const injCount = 300;
    const injGeo = new THREE.SphereGeometry(0.8, 6, 6);
    const injMesh = new THREE.InstancedMesh(injGeo, beamMat, injCount);
    const injDummy = new THREE.Object3D();
    const injData = [];

    for (let i = 0; i < injCount; i++) {
        const beamLine = Math.floor(Math.random() * 4);
        const beamAngle = (beamLine / 4) * Math.PI * 2;
        injData.push({
            beamAngle,
            phase: Math.random(),
            speed: 1 + Math.random() * 3,
            size: 0.5 + Math.random() * 0.5
        });
    }
    group.add(injMesh);
    injectedParticles.push({ mesh: injMesh, data: injData, dummy: injDummy });
    parts.push({ mesh: injMesh, name: 'Injected Hadronic Matter Stream' });

    // ==========================================
    // 5. CONVERSION VISUALIZATION (InstancedMesh)
    // ==========================================
    const convCount = 200;
    const convGeo = new THREE.OctahedronGeometry(1, 0);
    const convMesh = new THREE.InstancedMesh(convGeo, quarkGluonMat, convCount);
    const convDummy = new THREE.Object3D();
    const convData = [];

    for (let i = 0; i < convCount; i++) {
        convData.push({
            phi: Math.acos(2 * Math.random() - 1),
            theta: Math.random() * Math.PI * 2,
            radius: 8 + Math.random() * 5,
            speed: 2 + Math.random() * 4,
            phase: Math.random() * Math.PI * 2,
            converting: Math.random() > 0.5
        });
    }
    group.add(convMesh);
    conversionParticles.push({ mesh: convMesh, data: convData, dummy: convDummy });
    parts.push({ mesh: convMesh, name: 'Phase Transition Visualization' });

    // ==========================================
    // 6. WARNING/CONTAINMENT SYSTEMS
    // ==========================================
    // Warning light towers
    for (let i = 0; i < 6; i++) {
        const warnAngle = (i / 6) * Math.PI * 2;
        const warnGroup = new THREE.Group();

        const pillarGeo = new THREE.CylinderGeometry(2, 2, 40, 6);
        const pillarMesh = new THREE.Mesh(pillarGeo, darkSteel);
        warnGroup.add(pillarMesh);

        const lightGeo = new THREE.SphereGeometry(3, 8, 8);
        const lightMesh = new THREE.Mesh(lightGeo, warningMat);
        lightMesh.position.y = 22;
        warnGroup.add(lightMesh);
        warningLights.push({ mesh: lightMesh, index: i });

        warnGroup.position.set(
            Math.cos(warnAngle) * 100,
            0,
            Math.sin(warnAngle) * 100
        );
        group.add(warnGroup);
    }
    parts.push({ mesh: warningLights[0]?.mesh, name: 'Warning System' });

    // Emergency containment shutters
    for (let i = 0; i < 12; i++) {
        const shutterAngle = (i / 12) * Math.PI * 2;
        const shutterGeo = new THREE.BoxGeometry(15, 40, 3);
        const shutterMesh = new THREE.Mesh(shutterGeo, shieldMat);
        shutterMesh.position.set(
            Math.cos(shutterAngle) * 55,
            0,
            Math.sin(shutterAngle) * 55
        );
        shutterMesh.rotation.y = -shutterAngle;
        group.add(shutterMesh);
    }
    parts.push({ mesh: group, name: 'Emergency Containment Shutters' });

    // ==========================================
    // 7. COOLING SYSTEM
    // ==========================================
    const coolGroup = new THREE.Group();

    // Coolant pipes
    for (let i = 0; i < 8; i++) {
        const pipeAngle = (i / 8) * Math.PI * 2;
        const pipeGeo = new THREE.CylinderGeometry(1.5, 1.5, 60, 6);
        const pipeMesh = new THREE.Mesh(pipeGeo, coolantMat);
        pipeMesh.position.set(
            Math.cos(pipeAngle) * 40,
            0,
            Math.sin(pipeAngle) * 40
        );
        coolGroup.add(pipeMesh);

        // Coolant flow indicators
        for (let c = 0; c < 4; c++) {
            const flowGeo = new THREE.SphereGeometry(2, 6, 6);
            const flowMesh = new THREE.Mesh(flowGeo, coolantMat);
            flowMesh.position.set(
                Math.cos(pipeAngle) * 40,
                -25 + c * 15,
                Math.sin(pipeAngle) * 40
            );
            coolGroup.add(flowMesh);
            coolingPulses.push({ mesh: flowMesh, baseY: -25 + c * 15, pipeAngle, index: i * 4 + c });
        }
    }

    // Heat exchangers
    for (let i = 0; i < 4; i++) {
        const hexAngle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const hexGeo = new THREE.BoxGeometry(12, 8, 12);
        const hexMesh = new THREE.Mesh(hexGeo, containmentMat);
        hexMesh.position.set(
            Math.cos(hexAngle) * 65,
            -25,
            Math.sin(hexAngle) * 65
        );
        coolGroup.add(hexMesh);
    }

    group.add(coolGroup);
    parts.push({ mesh: coolGroup, name: 'Cryogenic Cooling System' });

    // ==========================================
    // 8. CONTROL & MONITORING STATIONS
    // ==========================================
    const controlGroup = new THREE.Group();

    for (let i = 0; i < 4; i++) {
        const ctrlAngle = (i / 4) * Math.PI * 2;
        const ctrlGroup = new THREE.Group();

        const deskGeo = new THREE.BoxGeometry(10, 5, 8);
        const deskMesh = new THREE.Mesh(deskGeo, containmentMat);
        ctrlGroup.add(deskMesh);

        const screenGeo = new THREE.BoxGeometry(8, 6, 0.5);
        const screenMat = new THREE.MeshStandardMaterial({ color: 0x001122, emissive: 0x003366, emissiveIntensity: 2.0 });
        const screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.set(0, 5, -3);
        screenMesh.rotation.x = -0.3;
        ctrlGroup.add(screenMesh);

        ctrlGroup.position.set(
            Math.cos(ctrlAngle) * 110,
            0,
            Math.sin(ctrlAngle) * 110
        );
        ctrlGroup.lookAt(0, 0, 0);
        controlGroup.add(ctrlGroup);
    }

    group.add(controlGroup);
    parts.push({ mesh: controlGroup, name: 'Control Stations' });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "The Bodmer-Witten hypothesis proposes that strange quark matter (SQM) containing roughly equal numbers of up, down, and strange quarks may be the true ground state of hadronic matter. What is the physical reasoning behind this conjecture?",
            options: [
                "Strange quarks have zero mass, reducing the total rest mass energy of the system",
                "Adding a third quark flavor (strange) opens new Fermi sea levels, allowing quarks to occupy lower energy states. The extra Fermi sea reduces the Fermi energy per quark despite the strange quark mass penalty (~95 MeV), potentially making the energy per baryon lower than ⁵⁶Fe (930 MeV/baryon)",
                "The strong force becomes repulsive for normal nuclear matter at high density but attractive for strange matter",
                "The Higgs field coupling is minimized in the SQM configuration"
            ],
            correct: 1,
            explanation: "In normal nuclear matter, quarks are confined in nucleons with only up and down flavors. The Pauli exclusion principle forces quarks into high-energy Fermi levels. Adding a third flavor (strange) provides a new Fermi sea: quarks can 'drain' from the overfilled u and d seas into the initially empty s sea, reducing the average Fermi energy. If the energy gained from this flavor democratization exceeds the mass penalty of strange quarks (m_s ≈ 95 MeV), then SQM has lower energy per baryon than ordinary nuclear matter. Witten (1984) and Bodmer (1971) showed this is plausible for m_s in certain ranges, though not yet experimentally confirmed."
        },
        {
            question: "If the Bodmer-Witten hypothesis is correct and strange matter is absolutely stable, why hasn't all ordinary matter in the universe already converted to strange matter?",
            options: [
                "The conversion requires temperatures above 10¹² K, only found in the Big Bang and neutron star interiors",
                "There is a large energy barrier (analogous to nucleation in a first-order phase transition): converting a single nucleon to strange matter costs energy because the surface energy penalty exceeds the bulk energy gain until a critical strangelet size of A ~ 10-100 baryons is reached",
                "Dark energy prevents the conversion from propagating at macroscopic scales",
                "The weak interaction required for s-quark production is too slow at ordinary temperatures"
            ],
            correct: 1,
            explanation: "The conversion is a first-order phase transition with a nucleation barrier. A strangelet of baryon number A has energy E(A) = E_bulk × A + E_surface × A^(2/3). For small A, the positive surface energy dominates, making small strangelets unstable. Only above a critical size A_crit ~ 10-100 (depending on model parameters) does the negative bulk energy win, and the strangelet becomes self-sustaining. In the early universe, the QCD phase transition produced only baryonic matter because the temperature dropped too quickly for critical-size strangelets to nucleate. Random thermal fluctuations almost never produce a large enough seed."
        },
        {
            question: "In the MIT bag model description of strange quark matter, what determines whether SQM is absolutely stable (lower energy than ⁵⁶Fe), metastable, or unstable?",
            options: [
                "The electromagnetic fine structure constant α_EM",
                "The bag constant B, strange quark mass m_s, and QCD coupling constant α_s. The stability window requires B^(1/4) ~ 145-165 MeV (large enough for confinement but small enough that the energy per baryon E/A < 930 MeV) and m_s < ~200 MeV",
                "The Cabibbo angle θ_C, which controls s-quark production rates",
                "The density of the surrounding environment"
            ],
            correct: 1,
            explanation: "In the MIT bag model, quarks are confined within a 'bag' with constant energy density B (the vacuum pressure that maintains confinement). The energy per baryon of SQM is: E/A = (bag energy + kinetic energy + mass energy - gluon exchange)/(baryon number). For SQM to be absolutely stable: E/A < 930 MeV (the energy per baryon of ⁵⁶Fe). This requires: B^(1/4) ∈ [145, 165] MeV approximately, m_s ≲ 200 MeV, and α_s ~ 0.3-0.6. Current lattice QCD estimates of B and m_s are consistent with but do not confirm the stability window. This is why the hypothesis remains unresolved."
        },
        {
            question: "If a strangelet above the critical size were to contact ordinary matter (such as a neutron star's core), what would the conversion process look like at the microscopic level?",
            options: [
                "The ordinary matter would annihilate with the strange matter, releasing pure energy",
                "Neutrons at the contact surface would absorb strange quarks through the strong interaction (on timescales of ~10⁻²³ s), then the weak interaction converts excess down quarks to strange quarks via d → u + e⁻ + ν̄ₑ followed by u + e⁻ → s + νₑ, proceeding layer by layer as a conversion front",
                "The electromagnetic force would repel the strangelet from normal matter indefinitely",
                "The normal matter would fission into lighter elements before reaching the strangelet"
            ],
            correct: 1,
            explanation: "The conversion proceeds as a 'strange combustion front.' At the interface: (1) Normal nuclear matter dissolves into free quarks (deconfinement) upon contact with the SQM surface, occurring on strong-interaction timescales (~10⁻²³ s). (2) The liberated u and d quarks join the strange matter droplet. (3) The weak interaction then equilibrates flavors by converting d → s through d → u + W⁻ → u + e⁻ + ν̄ₑ and u + e⁻ → s + νₑ, on timescales of ~10⁻⁸ s. The front propagates inward at a speed set by the slower weak interaction rate, estimated at ~10⁴ m/s for neutron star conditions. A neutron star would be fully converted in ~10⁻² seconds."
        },
        {
            question: "Several experiments (RHIC, LHC) have searched for strangelet production in heavy-ion collisions. What would be the experimental signature of a strangelet, and why haven't any been found despite creating quark-gluon plasma?",
            options: [
                "Strangelets would appear as particles with anomalous charge-to-mass ratio (Z/A much less than normal nuclei) and unusual penetrating power. They haven't been found because the QGP created in colliders is too hot and too small: thermal fluctuations prevent nucleation below the critical size, and the fireball expands too rapidly for the weak interaction to equilibrate strangeness",
                "Strangelets would be invisible to all detectors due to their exotic properties",
                "They have been found but the results are classified for safety reasons",
                "Strangelets can only form at temperatures below 100 MeV, while colliders produce temperatures of 300+ MeV"
            ],
            correct: 0,
            explanation: "A strangelet with baryon number A has charge Z ≈ 0.1A (much lower Z/A than normal nuclei, where Z/A ≈ 0.4-0.5) and would register as an anomalously heavy, low-charge track in detectors. No strangelets have been observed because: (1) The QGP in colliders (volume ~10³ fm³, duration ~10⁻²³ s) is far too small and brief for a critical-size strangelet (~100 baryons) to nucleate against the surface energy barrier. (2) The high temperature (T > 150 MeV) means entropy favors a kaon gas over a compact strangelet. (3) Rapid expansion dilutes any nascent strange clusters. Astrophysical environments (neutron star mergers) may be more favorable for strangelet formation."
        }
    ];

    const description = `<h2>Strangelet Conversion Reactor</h2>
<p>The Strangelet Conversion Reactor is a theoretical facility that converts ordinary hadronic matter into strange quark matter (SQM)—a hypothetically more stable form of matter containing approximately equal numbers of up, down, and strange quarks. Based on the Bodmer-Witten hypothesis, this represents the most dangerous and energy-dense matter manipulation conceivable.</p>

<h3>Core Systems</h3>
<ul>
<li><strong>Strangelet Core:</strong> A seed droplet of strange quark matter, suspended in absolute vacuum by intense magnetic fields. Contains deconfined quarks in three color charges (red, green, blue).</li>
<li><strong>Magnetic Bottle Containment:</strong> Multiple layers of superconducting magnetic coils generating fields of ~10¹⁵ Gauss to prevent the strangelet from contacting any normal matter—which would trigger uncontrolled conversion.</li>
<li><strong>Hadron Injection Accelerator:</strong> A circular accelerator that delivers precisely metered doses of normal nuclear matter into the core for controlled conversion.</li>
<li><strong>Phase Transition Monitoring:</strong> Real-time visualization of the strong-to-weak interaction cascade as injected matter undergoes quark deconfinement and flavor equilibration.</li>
</ul>

<h3>Danger Level</h3>
<p>If the Bodmer-Witten hypothesis is correct, a strangelet above critical size (~100 baryons) that escapes containment would catalytically convert all matter it contacts into strange matter—a runaway phase transition sometimes called an "ice-9" scenario. The reactor maintains triple-redundant containment to prevent this catastrophic possibility.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // 1. Core pulsation (chaotic, dangerous-looking)
        coreElements.forEach(elem => {
            if (elem.type === 'core') {
                const chaoticPulse = 1.0 + Math.sin(time * speed * 7) * 0.15 + Math.sin(time * speed * 11) * 0.08;
                elem.mesh.scale.setScalar(chaoticPulse);
                elem.mesh.rotation.x = time * speed * 3;
                elem.mesh.rotation.y = time * speed * 2.3;
                elem.mesh.rotation.z = time * speed * 1.7;
                elem.mesh.material.emissiveIntensity = 4 + Math.sin(time * speed * 13) * 3;
            }
            if (elem.type === 'aura') {
                elem.mesh.rotation.x = -time * speed * 1.5;
                elem.mesh.rotation.z = time * speed * 1.1;
                const auraPulse = 1.0 + Math.sin(time * speed * 5) * 0.1;
                elem.mesh.scale.setScalar(auraPulse);
            }
        });

        // 2. Color charge quark orbits
        colorRadiation.forEach(cr => {
            const { mesh, data, dummy, colorIndex } = cr;
            for (let i = 0; i < data.length; i++) {
                const q = data[i];
                q.theta += q.speed * speed * 0.03;
                q.phi += q.speed * speed * 0.01 * (colorIndex + 1);
                const r = q.r + Math.sin(time * speed * 4 + i) * 2;
                dummy.position.set(
                    r * Math.sin(q.phi) * Math.cos(q.theta),
                    r * Math.cos(q.phi),
                    r * Math.sin(q.phi) * Math.sin(q.theta)
                );
                dummy.scale.setScalar(0.5 + Math.sin(time * speed * 8 + i) * 0.3);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 3. Magnetic bottle field oscillation
        containmentFields.forEach(cf => {
            if (cf.type === 'primary') {
                const oscScale = 1.0 + Math.sin(time * speed * 4) * 0.02;
                cf.mesh.scale.setScalar(oscScale);
                cf.mesh.material.opacity = 0.15 + Math.sin(time * speed * 6) * 0.08;
            }
            if (cf.type === 'secondary') {
                cf.mesh.rotation.y = time * speed * 0.3;
                cf.mesh.rotation.x = time * speed * 0.2;
            }
        });

        // 4. Magnetic coil rotation
        magneticFieldRings.forEach(ring => {
            const wobble = Math.sin(time * speed * 3 + ring.index * 0.5) * 0.05;
            ring.mesh.rotation.x = ring.baseAngle + wobble;
        });

        // 5. Injected particle stream
        injectedParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                p.phase = (p.phase + p.speed * speed * 0.01) % 1.0;
                const radius = 80 - p.phase * 70; // From accelerator ring inward
                dummy.position.set(
                    Math.cos(p.beamAngle) * radius,
                    Math.sin(time * speed + i) * 2,
                    Math.sin(p.beamAngle) * radius
                );
                dummy.scale.setScalar(p.size * (1 - p.phase * 0.5));
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 6. Conversion particles (chaotic near core)
        conversionParticles.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const c = data[i];
                c.theta += c.speed * speed * 0.04;
                c.phi += c.speed * speed * 0.02;
                const r = c.radius + Math.sin(time * speed * 6 + c.phase) * 3;
                dummy.position.set(
                    r * Math.sin(c.phi) * Math.cos(c.theta),
                    r * Math.cos(c.phi),
                    r * Math.sin(c.phi) * Math.sin(c.theta)
                );
                const convScale = c.converting ? 1.2 + Math.sin(time * speed * 10 + i) * 0.5 : 0.5;
                dummy.scale.setScalar(convScale);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 7. Warning lights flashing (danger!)
        warningLights.forEach(wl => {
            const flash = Math.sin(time * speed * 6 + wl.index * Math.PI / 3) > 0 ? 5.0 : 0.5;
            wl.mesh.material.emissiveIntensity = flash;
            const flashScale = flash > 2 ? 1.3 : 0.8;
            wl.mesh.scale.setScalar(flashScale);
        });

        // 8. Cooling pulses
        coolingPulses.forEach(cp => {
            const flowY = cp.baseY + ((time * speed * 20 + cp.index * 5) % 40) - 20;
            cp.mesh.position.y = flowY;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
