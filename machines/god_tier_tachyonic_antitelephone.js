import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM TACHYONIC ANTITELEPHONE MATERIALS
    // ==========================================
    const tachyonFieldMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xcc00cc, emissiveIntensity: 4.0, transparent: true, opacity: 0.3, side: 2 });
    const causalMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00cc66, emissiveIntensity: 3.0 });
    const acausalMat = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xcc0033, emissiveIntensity: 3.0 });
    const machineFrameMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.15 });
    const emitterMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x2266ff, emissiveIntensity: 3.0 });
    const receiverMat = new THREE.MeshStandardMaterial({ color: 0xff8844, emissive: 0xff6622, emissiveIntensity: 3.0 });
    const lightConeMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xdddd00, emissiveIntensity: 2.0, transparent: true, opacity: 0.15, wireframe: true, side: 2 });
    const signalMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 6.0, transparent: true, opacity: 0.7 });
    const worldlineMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00cccc, emissiveIntensity: 2.0 });
    const paradoxMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0, transparent: true, opacity: 0.5 });
    const clockMat = new THREE.MeshStandardMaterial({ color: 0xeeeedd, metalness: 0.6, roughness: 0.3 });
    const boostMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2.0, transparent: true, opacity: 0.25, wireframe: true });

    // Dynamic arrays
    const tachyonSignals = [];
    const lightCones = [];
    const worldlines = [];
    const clockElements = [];
    const boostFrames = [];
    const paradoxIndicators = [];
    const emitterParts = [];
    const receiverParts = [];

    // ==========================================
    // 1. MINKOWSKI SPACETIME GRID
    // ==========================================
    const gridGroup = new THREE.Group();

    // Spatial axis (x)
    const xAxisGeo = new THREE.CylinderGeometry(0.3, 0.3, 400, 4);
    const xAxisMesh = new THREE.Mesh(xAxisGeo, machineFrameMat);
    xAxisMesh.rotation.z = Math.PI / 2;
    gridGroup.add(xAxisMesh);

    // Time axis (y - vertical)
    const tAxisGeo = new THREE.CylinderGeometry(0.3, 0.3, 400, 4);
    const tAxisMesh = new THREE.Mesh(tAxisGeo, machineFrameMat);
    gridGroup.add(tAxisMesh);

    // Grid lines (spatial)
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        const lineGeo = new THREE.CylinderGeometry(0.1, 0.1, 400, 4);
        const lineMesh = new THREE.Mesh(lineGeo, new THREE.MeshStandardMaterial({ color: 0x333344, wireframe: true, transparent: true, opacity: 0.1 }));
        lineMesh.position.x = i * 20;
        gridGroup.add(lineMesh);
    }
    // Grid lines (temporal)
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        const lineGeo = new THREE.CylinderGeometry(0.1, 0.1, 400, 4);
        const lineMesh = new THREE.Mesh(lineGeo, new THREE.MeshStandardMaterial({ color: 0x333344, wireframe: true, transparent: true, opacity: 0.1 }));
        lineMesh.rotation.z = Math.PI / 2;
        lineMesh.position.y = i * 20;
        gridGroup.add(lineMesh);
    }

    group.add(gridGroup);

    // ==========================================
    // 2. LIGHT CONES (at origin and key events)
    // ==========================================
    // Future light cone at origin
    const futureLCGeo = new THREE.ConeGeometry(100, 100, 16, 1, true);
    const futureLCMesh = new THREE.Mesh(futureLCGeo, lightConeMat);
    futureLCMesh.position.y = 50;
    group.add(futureLCMesh);
    lightCones.push({ mesh: futureLCMesh, type: 'future', baseY: 50 });
    parts.push({ mesh: futureLCMesh, name: 'Future Light Cone' });

    // Past light cone at origin
    const pastLCGeo = new THREE.ConeGeometry(100, 100, 16, 1, true);
    const pastLCMesh = new THREE.Mesh(pastLCGeo, lightConeMat);
    pastLCMesh.position.y = -50;
    pastLCMesh.rotation.x = Math.PI;
    group.add(pastLCMesh);
    lightCones.push({ mesh: pastLCMesh, type: 'past', baseY: -50 });
    parts.push({ mesh: pastLCMesh, name: 'Past Light Cone' });

    // ==========================================
    // 3. TACHYON EMITTER STATION (Alice's frame)
    // ==========================================
    const emitterGroup = new THREE.Group();

    // Station platform
    const ePlatformGeo = new THREE.BoxGeometry(40, 5, 30);
    const ePlatformMesh = new THREE.Mesh(ePlatformGeo, machineFrameMat);
    emitterGroup.add(ePlatformMesh);

    // Tachyon emitter device
    const eDeviceGeo = new THREE.CylinderGeometry(5, 8, 25, 12);
    const eDeviceMesh = new THREE.Mesh(eDeviceGeo, emitterMat);
    eDeviceMesh.position.y = 15;
    emitterGroup.add(eDeviceMesh);
    parts.push({ mesh: eDeviceMesh, name: 'Tachyon Emitter (Alice)' });
    emitterParts.push({ mesh: eDeviceMesh, type: 'device' });

    // Emitter barrel
    const eBarrelGeo = new THREE.CylinderGeometry(3, 3, 30, 8);
    const eBarrelMesh = new THREE.Mesh(eBarrelGeo, darkSteel);
    eBarrelMesh.rotation.z = Math.PI / 2;
    eBarrelMesh.position.set(15, 18, 0);
    emitterGroup.add(eBarrelMesh);
    emitterParts.push({ mesh: eBarrelMesh, type: 'barrel' });

    // Emitter coils
    for (let i = 0; i < 5; i++) {
        const eCoilGeo = new THREE.TorusGeometry(4, 0.5, 6, 16);
        const eCoilMesh = new THREE.Mesh(eCoilGeo, copper);
        eCoilMesh.rotation.y = Math.PI / 2;
        eCoilMesh.position.set(5 + i * 5, 18, 0);
        emitterGroup.add(eCoilMesh);
    }

    // Alice's clock
    const aClockGroup = new THREE.Group();
    const aClockFaceGeo = new THREE.CircleGeometry(6, 24);
    const aClockFaceMesh = new THREE.Mesh(aClockFaceGeo, clockMat);
    aClockGroup.add(aClockFaceMesh);

    const aClockRimGeo = new THREE.TorusGeometry(6, 0.5, 8, 24);
    const aClockRimMesh = new THREE.Mesh(aClockRimGeo, darkSteel);
    aClockGroup.add(aClockRimMesh);

    // Clock hand
    const aHandGeo = new THREE.BoxGeometry(0.3, 5, 0.2);
    const aHandMesh = new THREE.Mesh(aHandGeo, acausalMat);
    aHandMesh.position.y = 2.5;
    aClockGroup.add(aHandMesh);

    aClockGroup.position.set(0, 35, 0);
    emitterGroup.add(aClockGroup);
    clockElements.push({ group: aClockGroup, hand: aHandMesh, name: 'Alice' });
    parts.push({ mesh: aClockGroup, name: 'Alice\'s Clock' });

    emitterGroup.position.set(-100, -80, 0);
    group.add(emitterGroup);

    // ==========================================
    // 4. TACHYON RECEIVER STATION (Bob's frame, boosted)
    // ==========================================
    const receiverGroup = new THREE.Group();

    const rPlatformGeo = new THREE.BoxGeometry(40, 5, 30);
    const rPlatformMesh = new THREE.Mesh(rPlatformGeo, machineFrameMat);
    receiverGroup.add(rPlatformMesh);

    const rDeviceGeo = new THREE.CylinderGeometry(5, 8, 25, 12);
    const rDeviceMesh = new THREE.Mesh(rDeviceGeo, receiverMat);
    rDeviceMesh.position.y = 15;
    receiverGroup.add(rDeviceMesh);
    parts.push({ mesh: rDeviceMesh, name: 'Tachyon Receiver (Bob, boosted)' });
    receiverParts.push({ mesh: rDeviceMesh, type: 'device' });

    // Receiver antenna
    const rAntennaGeo = new THREE.ConeGeometry(8, 15, 8);
    const rAntennaMesh = new THREE.Mesh(rAntennaGeo, darkSteel);
    rAntennaMesh.rotation.z = -Math.PI / 2;
    rAntennaMesh.position.set(-15, 18, 0);
    receiverGroup.add(rAntennaMesh);

    for (let i = 0; i < 5; i++) {
        const rCoilGeo = new THREE.TorusGeometry(4, 0.5, 6, 16);
        const rCoilMesh = new THREE.Mesh(rCoilGeo, copper);
        rCoilMesh.rotation.y = Math.PI / 2;
        rCoilMesh.position.set(-5 - i * 5, 18, 0);
        receiverGroup.add(rCoilMesh);
    }

    // Bob's clock
    const bClockGroup = new THREE.Group();
    const bClockFaceGeo = new THREE.CircleGeometry(6, 24);
    const bClockFaceMesh = new THREE.Mesh(bClockFaceGeo, clockMat);
    bClockGroup.add(bClockFaceMesh);
    const bClockRimGeo = new THREE.TorusGeometry(6, 0.5, 8, 24);
    const bClockRimMesh = new THREE.Mesh(bClockRimGeo, darkSteel);
    bClockGroup.add(bClockRimMesh);
    const bHandGeo = new THREE.BoxGeometry(0.3, 5, 0.2);
    const bHandMesh = new THREE.Mesh(bHandGeo, causalMat);
    bHandMesh.position.y = 2.5;
    bClockGroup.add(bHandMesh);

    bClockGroup.position.set(0, 35, 0);
    receiverGroup.add(bClockGroup);
    clockElements.push({ group: bClockGroup, hand: bHandMesh, name: 'Bob' });
    parts.push({ mesh: bClockGroup, name: 'Bob\'s Clock (Boosted Frame)' });

    receiverGroup.position.set(100, -80, 0);
    group.add(receiverGroup);

    // ==========================================
    // 5. LORENTZ BOOST VISUALIZATION
    // ==========================================
    // Tilted simultaneity surface for Bob's frame
    const boostPlaneGeo = new THREE.PlaneGeometry(300, 300);
    const boostPlaneMesh = new THREE.Mesh(boostPlaneGeo, boostMat);
    boostPlaneMesh.rotation.z = 0.3; // Lorentz tilt
    group.add(boostPlaneMesh);
    boostFrames.push({ mesh: boostPlaneMesh, baseTilt: 0.3 });
    parts.push({ mesh: boostPlaneMesh, name: 'Boosted Simultaneity Surface' });

    // ==========================================
    // 6. TACHYON SIGNAL PARTICLES (InstancedMesh)
    // ==========================================
    // Forward signal: Alice -> Bob (spacelike, outside light cone)
    const fwdSignalCount = 100;
    const sigGeo = new THREE.SphereGeometry(1.2, 6, 6);
    const fwdSignalMesh = new THREE.InstancedMesh(sigGeo, signalMat, fwdSignalCount);
    const fwdDummy = new THREE.Object3D();
    const fwdData = [];
    for (let i = 0; i < fwdSignalCount; i++) {
        fwdData.push({
            phase: i / fwdSignalCount,
            spread: (Math.random() - 0.5) * 5,
            ySpread: (Math.random() - 0.5) * 3,
            size: 0.5 + Math.random() * 1.0
        });
    }
    group.add(fwdSignalMesh);
    tachyonSignals.push({ mesh: fwdSignalMesh, data: fwdData, dummy: fwdDummy, direction: 'forward' });
    parts.push({ mesh: fwdSignalMesh, name: 'Forward Tachyon Signal' });

    // Return signal: Bob -> Alice (goes backward in time in Alice's frame!)
    const retSignalCount = 100;
    const retSignalMesh = new THREE.InstancedMesh(sigGeo, paradoxMat, retSignalCount);
    const retDummy = new THREE.Object3D();
    const retData = [];
    for (let i = 0; i < retSignalCount; i++) {
        retData.push({
            phase: i / retSignalCount,
            spread: (Math.random() - 0.5) * 5,
            ySpread: (Math.random() - 0.5) * 3,
            size: 0.5 + Math.random() * 1.0
        });
    }
    group.add(retSignalMesh);
    tachyonSignals.push({ mesh: retSignalMesh, data: retData, dummy: retDummy, direction: 'return' });
    parts.push({ mesh: retSignalMesh, name: 'Return Signal (Backward in Time!)' });

    // ==========================================
    // 7. WORLDLINES
    // ==========================================
    // Alice's worldline (vertical - at rest)
    const alicePoints = [];
    for (let t = -180; t <= 180; t += 5) {
        alicePoints.push(new THREE.Vector3(-100, t, 0));
    }
    const aliceCurve = new THREE.CatmullRomCurve3(alicePoints);
    const aliceWLGeo = new THREE.TubeGeometry(aliceCurve, 40, 1, 4, false);
    const aliceWLMesh = new THREE.Mesh(aliceWLGeo, causalMat);
    group.add(aliceWLMesh);
    worldlines.push({ mesh: aliceWLMesh, name: 'Alice' });
    parts.push({ mesh: aliceWLMesh, name: 'Alice Worldline (Rest Frame)' });

    // Bob's worldline (tilted - moving at 0.6c relative to Alice)
    const bobPoints = [];
    for (let t = -180; t <= 180; t += 5) {
        bobPoints.push(new THREE.Vector3(100 + t * 0.3, t, 0)); // v = 0.3 spatial units per time unit
    }
    const bobCurve = new THREE.CatmullRomCurve3(bobPoints);
    const bobWLGeo = new THREE.TubeGeometry(bobCurve, 40, 1, 4, false);
    const bobWLMesh = new THREE.Mesh(bobWLGeo, receiverMat);
    group.add(bobWLMesh);
    worldlines.push({ mesh: bobWLMesh, name: 'Bob' });
    parts.push({ mesh: bobWLMesh, name: 'Bob Worldline (Boosted Frame, v=0.6c)' });

    // ==========================================
    // 8. PARADOX INDICATOR
    // ==========================================
    const paradoxGroup = new THREE.Group();

    // Warning sphere at the closed timelike curve point
    const paradoxGeo = new THREE.IcosahedronGeometry(10, 2);
    const paradoxMesh = new THREE.Mesh(paradoxGeo, paradoxMat);
    paradoxGroup.add(paradoxMesh);
    paradoxIndicators.push({ mesh: paradoxMesh });

    // "CAUSALITY VIOLATION" warning ring
    const warningRingGeo = new THREE.TorusGeometry(15, 1, 6, 32);
    const warningRingMesh = new THREE.Mesh(warningRingGeo, acausalMat);
    paradoxGroup.add(warningRingMesh);

    const warningRing2Geo = new THREE.TorusGeometry(18, 0.5, 6, 32);
    const warningRing2Mesh = new THREE.Mesh(warningRing2Geo, acausalMat);
    paradoxGroup.add(warningRing2Mesh);

    paradoxGroup.position.set(-100, -120, 0); // Where the return signal arrives before emission
    group.add(paradoxGroup);
    parts.push({ mesh: paradoxGroup, name: 'Causality Violation Point' });

    // ==========================================
    // 9. SPACETIME CURVATURE MARKERS
    // ==========================================
    // Event markers on the spacetime diagram
    const events = [
        { pos: [-100, -80, 5], color: 0x00ff88, name: 'Emission Event A' },
        { pos: [100, -40, 5], color: 0xff8844, name: 'Reception Event B' },
        { pos: [100, -50, 5], color: 0xff0044, name: 'Re-emission Event B\'' },
        { pos: [-100, -120, 5], color: 0xff0000, name: 'Paradox Event A\' (before A!)' }
    ];
    events.forEach(evt => {
        const evtGeo = new THREE.SphereGeometry(4, 12, 12);
        const evtMat = new THREE.MeshStandardMaterial({ color: evt.color, emissive: evt.color, emissiveIntensity: 3.0 });
        const evtMesh = new THREE.Mesh(evtGeo, evtMat);
        evtMesh.position.set(...evt.pos);
        group.add(evtMesh);
        parts.push({ mesh: evtMesh, name: evt.name });
    });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "The tachyonic antitelephone paradox demonstrates that if faster-than-light signals exist, causality is violated. Specifically, how does combining two superluminal signals between relatively moving observers create a closed causal loop?",
            options: [
                "The signals interfere destructively, creating a time reversal",
                "Alice sends a tachyon to Bob (spacelike separation). In Bob's boosted frame, the tachyon arrival is simultaneous with or before emission (due to the relativity of simultaneity for spacelike intervals). Bob immediately sends a return tachyon to Alice at the same superluminal speed in HIS rest frame. Due to the Lorentz boost, this return signal travels backward in time in Alice's frame, arriving before Alice sent the original message",
                "The signals create a wormhole through which information flows backward",
                "Gravitational time dilation near the emitter slows time enough for the return signal to arrive early"
            ],
            correct: 1,
            explanation: "The key is the relativity of simultaneity for spacelike-separated events. If Alice emits a tachyon at event A with speed v_t > c, it arrives at Bob at event B. The spacetime interval AB is spacelike, so there exists a Lorentz frame (Bob's, if v_Bob > c²/v_t) where B is simultaneous with or before A. When Bob retransmits at the same tachyon speed in HIS frame, the same logic applies in reverse: the return signal's arrival A' occurs before A in Alice's frame. The condition for paradox is v_t · v_Bob > c², which is satisfied whenever both v_t > c and v_Bob > c²/v_t. For v_t >> c, even small relative velocities between Alice and Bob suffice."
        },
        {
            question: "In special relativity, the time ordering of spacelike-separated events is frame-dependent. For a tachyon emitted at event A = (0,0) and received at event B = (x_B, t_B) with t_B > 0, x_B > ct_B, in what range of observer velocities v does the reception appear to occur BEFORE emission?",
            options: [
                "For any v > 0",
                "For v > c²t_B/x_B. Under a Lorentz boost with velocity v, the time of event B transforms as t_B' = γ(t_B - vx_B/c²). Setting t_B' < 0 gives v > c²t_B/x_B. Since the tachyon has v_tachyon = x_B/t_B > c, this threshold is v > c²/v_tachyon < c, meaning it's achievable by a subluminal observer",
                "For v > c (only superluminal observers can see time reversal)",
                "Time reversal never occurs; the emission event is always first in all frames"
            ],
            correct: 1,
            explanation: "Under a Lorentz boost: t_B' = γ(t_B - vx_B/c²). For t_B' < 0: v > c²t_B/x_B = c²/v_tachyon. Since v_tachyon > c, we get c²/v_tachyon < c. So the threshold velocity is subluminal—ordinary moving observers will see the tachyon arrive before it was sent! For example, if v_tachyon = 2c, then v_threshold = c/2. Any observer moving at v > c/2 relative to the emitter sees backward-in-time propagation. This is not a quirk of coordinates but a genuine prediction of special relativity for superluminal signals."
        },
        {
            question: "Feinberg (1967) attempted to construct a consistent quantum field theory of tachyons. What fundamental problem arises when trying to second-quantize a tachyonic field with m² < 0?",
            options: [
                "The field has no Lagrangian density",
                "The vacuum state is unstable: a scalar field with m² < 0 has a potential V(φ) = ½m²φ² that is an inverted parabola (unbounded below). The 'vacuum' at φ = 0 is a local maximum, not a minimum. Quantum fluctuations grow exponentially (tachyonic instability), indicating the system will undergo spontaneous symmetry breaking and roll to a true minimum where m² > 0",
                "Tachyonic fields violate gauge invariance",
                "The partition function diverges at any finite temperature"
            ],
            correct: 1,
            explanation: "For m² < 0, the dispersion relation E² = p²c² + m²c⁴ gives E² = p²c² - |m|²c⁴. The field φ satisfies (□ - |m|²)φ = 0. The mode with p = 0 has E² = -|m|²c⁴, meaning ω = i|m|c²/ℏ—an imaginary frequency indicating exponential growth of the zero-mode: φ ~ e^{|m|c²t/ℏ}. This is the tachyonic instability. Physically, φ = 0 sits at a potential maximum. The system 'rolls' to a true minimum (like the Mexican hat in the Higgs mechanism, where the Higgs field has m² < 0 at the symmetric point but m² > 0 at the VEV). So 'tachyonic' really means 'unstable vacuum,' not 'faster than light.'"
        },
        {
            question: "The Tolman (1917) antitelephone argument predates special relativity's full framework. What is the modern resolution proposed by those who want to preserve both tachyons and causality?",
            options: [
                "Tachyons exist but can never be detected",
                "The 'reinterpretation principle' (Bilaniuk, Deshpande, Sudarshan): a negative-energy tachyon traveling backward in time is reinterpreted as a positive-energy tachyon traveling forward in time in the opposite spatial direction. This makes tachyon emission, not absorption, the fundamental process in every frame. However, this sacrifices the ability to control what message is sent—the 'signal' is fundamentally uncontrollable",
                "Quantum mechanics prevents the construction of a tachyon emitter",
                "General relativity provides frame-dragging effects that prevent the paradox"
            ],
            correct: 1,
            explanation: "The reinterpretation principle (switching principle) says: whenever a tachyon has negative energy in some frame (which happens for backward-in-time propagation), reinterpret it as a positive-energy tachyon moving in the opposite direction with the emission and absorption events swapped. This preserves causality by making every observer see forward-in-time propagation. However, it means: if Alice 'sends' a tachyon to Bob, and Bob sees it arriving before being sent (in his frame), he reinterprets this as himself emitting a tachyon toward Alice. So Bob sees himself as the sender, not the receiver. This makes tachyon 'signals' uncontrollable—you can't choose the message content—arguably defeating the purpose of communication."
        },
        {
            question: "If tachyons existed and the antitelephone paradox were real, which of the following fundamental principles of physics would be directly violated?",
            options: [
                "Conservation of energy only",
                "The second law of thermodynamics only",
                "Relativistic causality (no closed causal loops), and by extension, the unitarity of quantum mechanics—since a CTC allows preparation of states that evolve into their own past, creating a non-unitary evolution that destroys the probability interpretation of quantum mechanics",
                "Only Lorentz invariance would be violated; causality is preserved"
            ],
            correct: 2,
            explanation: "CTCs from tachyonic antitelephones violate: (1) Relativistic causality—effects precede causes, enabling grandfather paradoxes. (2) Unitarity of QM—Deutsch (1991) showed that CTCs require nonlinear extensions of quantum mechanics (D-CTCs) where the density matrix evolves non-unitarily: ρ_out = Tr_CTC[U(ρ_in ⊗ ρ_CTC)U†] with ρ_CTC determined self-consistently. This destroys the linearity that ensures quantum no-cloning, no-signaling, and the probabilistic interpretation. (3) The second law—CTCs allow entropy decrease by sending information about microstates backward in time. This is why most physicists view the antitelephone paradox as evidence against tachyons rather than against causality."
        }
    ];

    const description = `<h2>Tachyonic Antitelephone</h2>
<p>The Tachyonic Antitelephone is a thought experiment device that demonstrates the causal paradoxes inherent in faster-than-light communication. First described by Tolman (1917) and formalized by Benford, Book, and Newcomb (1970), this device uses hypothetical tachyons—particles with spacelike four-momenta (m² < 0)—to send signals into the past, creating closed causal loops.</p>

<h3>Paradox Mechanism</h3>
<ul>
<li><strong>Alice's Emitter:</strong> Sends a tachyonic signal from event A at her time t=0. The signal travels faster than light and arrives at Bob (event B) at a spacelike separation.</li>
<li><strong>Bob's Receiver/Re-emitter (Boosted Frame):</strong> Bob moves relative to Alice at velocity v. Due to the relativity of simultaneity, in Bob's frame the tachyon arrives BEFORE it was sent. Bob immediately re-sends a tachyon back to Alice.</li>
<li><strong>Causality Violation:</strong> The return signal arrives at Alice (event A') BEFORE she sent the original signal at event A—she receives the reply before asking the question.</li>
</ul>

<h3>Resolution</h3>
<p>The paradox is considered strong evidence that either: (1) tachyons do not exist, (2) the reinterpretation principle makes tachyonic signals fundamentally uncontrollable, or (3) new physics (Novikov self-consistency) prevents paradox-creating configurations.</p>`;

    // ==========================================
    // ANIMATION
    // ==========================================
    function animate(time, speed) {
        time *= 0.001;

        // Communication cycle
        const cycleTime = 12;
        const phase = (time * speed) % cycleTime;
        const cycleFraction = phase / cycleTime;

        // Phase 0-0.3: Forward tachyon signal (Alice -> Bob)
        // Phase 0.3-0.6: Bob receives and re-emits
        // Phase 0.6-0.9: Return signal (backward in time!)
        // Phase 0.9-1.0: Paradox flash

        // 1. Forward tachyon signal
        tachyonSignals.forEach(sig => {
            const { mesh, data, dummy, direction } = sig;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                let show = false;
                let posX = 0, posY = 0;

                if (direction === 'forward' && cycleFraction > 0 && cycleFraction < 0.4) {
                    const progress = (cycleFraction - 0 + p.phase * 0.1) % 0.4 / 0.4;
                    posX = -100 + progress * 200; // Alice -> Bob (left to right)
                    posY = -80 + progress * 40;   // Slightly upward (spacelike)
                    show = progress > 0 && progress < 1;
                }

                if (direction === 'return' && cycleFraction > 0.4 && cycleFraction < 0.85) {
                    const progress = (cycleFraction - 0.4 + p.phase * 0.1) % 0.45 / 0.45;
                    posX = 100 - progress * 200; // Bob -> Alice (right to left)
                    posY = -50 - progress * 70;  // Downward (backward in time!)
                    show = progress > 0 && progress < 1;
                }

                if (show) {
                    dummy.position.set(
                        posX + p.spread,
                        posY + p.ySpread,
                        0
                    );
                    dummy.scale.setScalar(p.size * (0.5 + Math.sin(time * speed * 10 + i) * 0.3));
                } else {
                    dummy.position.set(0, -500, 0);
                    dummy.scale.setScalar(0);
                }
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });

        // 2. Light cone subtle breathing
        lightCones.forEach(lc => {
            const breathe = 1 + Math.sin(time * speed * 1.5) * 0.02;
            lc.mesh.scale.set(breathe, 1, breathe);
            lc.mesh.material.opacity = 0.12 + Math.sin(time * speed * 2) * 0.03;
        });

        // 3. Clock hands rotation (at different rates to show time dilation)
        clockElements.forEach((clk, idx) => {
            const clockSpeed = idx === 0 ? 1.0 : 0.8; // Bob's clock runs slower
            clk.hand.rotation.z = -time * speed * clockSpeed;
        });

        // 4. Emitter/Receiver glow during active phases
        emitterParts.forEach(ep => {
            const active = cycleFraction < 0.3;
            const intensity = active ? 3 + Math.sin(time * speed * 8) * 2 : 1;
            ep.mesh.material.emissiveIntensity = intensity;
        });
        receiverParts.forEach(rp => {
            const active = cycleFraction > 0.25 && cycleFraction < 0.6;
            const intensity = active ? 3 + Math.sin(time * speed * 8) * 2 : 1;
            rp.mesh.material.emissiveIntensity = intensity;
        });

        // 5. Boost frame tilt animation
        boostFrames.forEach(bf => {
            const tilt = bf.baseTilt + Math.sin(time * speed * 0.5) * 0.05;
            bf.mesh.rotation.z = tilt;
        });

        // 6. Paradox indicator (flashes when CTC forms)
        paradoxIndicators.forEach(pi => {
            const paradoxActive = cycleFraction > 0.8;
            if (paradoxActive) {
                const flash = Math.sin(time * speed * 12) * 0.5 + 0.5;
                pi.mesh.material.emissiveIntensity = 5 + flash * 5;
                pi.mesh.scale.setScalar(1 + flash * 0.5);
                pi.mesh.rotation.x = time * speed * 5;
                pi.mesh.rotation.y = time * speed * 3;
            } else {
                pi.mesh.material.emissiveIntensity = 2;
                pi.mesh.scale.setScalar(0.8);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
