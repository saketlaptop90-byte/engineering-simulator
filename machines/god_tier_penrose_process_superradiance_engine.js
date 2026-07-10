import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for the black hole environment
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const ergosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a0080,
        emissive: 0x2a0060,
        transparent: true,
        opacity: 0.35,
        wireframe: true
    });
    
    // Glowing plasma and jet materials
    const accretionDiskMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });
    
    const accretionDiskOuterMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        emissive: 0xff8800,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });

    const jetMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x00aaff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });

    const jetCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const energyStreamMaterial = new THREE.MeshStandardMaterial({
        color: 0xcc00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 5.0
    });
    
    // --- PART 1: KERR BLACK HOLE & ERGOSPHERE ---
    // Event Horizon
    const eventHorizonGeom = new THREE.SphereGeometry(20, 128, 128);
    // Oblate spheroid for Kerr black hole event horizon
    eventHorizonGeom.scale(1.2, 0.8, 1.2);
    const eventHorizon = new THREE.Mesh(eventHorizonGeom, eventHorizonMaterial);
    group.add(eventHorizon);
    parts.push({
        name: "Event Horizon",
        description: "The boundary where escape velocity exceeds the speed of light.",
        material: "Black Absolute",
        function: "Singularity encapsulation",
        assemblyOrder: 1,
        connections: ["Ergosphere"],
        failureEffect: "Spaghettification and localized reality breakdown",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Ergosphere
    const ergosphereGeom = new THREE.SphereGeometry(38, 64, 64);
    // Highly oblate, touching event horizon at poles
    ergosphereGeom.scale(1.4, 0.42, 1.4); 
    const ergosphere = new THREE.Mesh(ergosphereGeom, ergosphereMaterial);
    group.add(ergosphere);
    parts.push({
        name: "Ergosphere Boundary",
        description: "Region where spacetime is dragged along with the black hole's rotation. Objects cannot remain stationary here.",
        material: "Quantum Vacuum Resonance",
        function: "Frame-dragging and Penrose energy extraction zone",
        assemblyOrder: 2,
        connections: ["Event Horizon"],
        failureEffect: "Loss of frame dragging effect",
        cascadeFailures: ["Penrose Accelerators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --- PART 2: ACCRETION DISK ---
    const accretionGroup = new THREE.Group();
    
    // Complex layered disk
    const numLayers = 15;
    const diskMeshes = [];
    for(let i=0; i<numLayers; i++) {
        const radius = 45 + (i * 12);
        const tube = 2 - (i * 0.1);
        const diskGeom = new THREE.TorusGeometry(radius, tube, 16, 200);
        diskGeom.scale(1, 0.1, 1);
        const diskMat = i < 5 ? accretionDiskMaterial : accretionDiskOuterMaterial;
        const diskMesh = new THREE.Mesh(diskGeom, diskMat);
        diskMesh.rotation.x = Math.PI / 2;
        // slight variations
        diskMesh.rotation.y = (Math.random() - 0.5) * 0.05;
        diskMesh.rotation.z = (Math.random() - 0.5) * 0.05;
        accretionGroup.add(diskMesh);
        diskMeshes.push({ mesh: diskMesh, speed: 0.02 - (i * 0.001) });
    }

    // Add swirling plasma noise to disk (represented by thousands of small glowing meshes)
    const plasmaParticles = new THREE.Group();
    const plasmaParticleGeom = new THREE.OctahedronGeometry(0.5, 0);
    const plasmaData = [];
    for(let i=0; i<3000; i++) {
        const r = 40 + Math.random() * 180;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * (150 / r) * 5; // thicker near center, very thin far away
        const p = new THREE.Mesh(plasmaParticleGeom, (Math.random()>0.5)? accretionDiskMaterial : accretionDiskOuterMaterial);
        p.position.set(r * Math.cos(theta), y, r * Math.sin(theta));
        
        // Scale randomly
        const s = Math.random() * 2 + 0.5;
        p.scale.set(s, s*0.2, s);

        plasmaParticles.add(p);
        plasmaData.push({ mesh: p, r: r, theta: theta, y: y, speed: 100 / r });
    }
    accretionGroup.add(plasmaParticles);

    // Tilt the entire accretion disk slightly
    accretionGroup.rotation.x = 0.1;
    accretionGroup.rotation.z = 0.05;
    group.add(accretionGroup);

    parts.push({
        name: "Super-luminous Accretion Disk",
        description: "Superheated plasma spiraling into the black hole. Emits massive X-ray radiation.",
        material: "Superheated Plasma",
        function: "Provides raw material and ambient energy environment",
        assemblyOrder: 3,
        connections: ["Ergosphere"],
        failureEffect: "Thermal runaway and structural vaporization",
        cascadeFailures: ["Megastructure Shell"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // --- PART 3: RELATIVISTIC JETS ---
    const jetsGroup = new THREE.Group();
    
    const jetLatheGeom = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(2, 20),
        new THREE.Vector2(8, 150),
        new THREE.Vector2(30, 800)
    ], 64);
    
    const topJet = new THREE.Mesh(jetLatheGeom, jetMaterial);
    const topJetCore = new THREE.Mesh(jetLatheGeom, jetCoreMaterial);
    topJetCore.scale.set(0.4, 1, 0.4);
    topJet.add(topJetCore);
    
    const bottomJet = topJet.clone();
    bottomJet.rotation.x = Math.PI;

    jetsGroup.add(topJet);
    jetsGroup.add(bottomJet);
    group.add(jetsGroup);

    parts.push({
        name: "Relativistic Plasma Jets",
        description: "Collimated beams of plasma accelerated to near light speed by extreme magnetic fields.",
        material: "Plasma Stream",
        function: "Energy dissipation and momentum transfer",
        assemblyOrder: 4,
        connections: ["Event Horizon", "Magnetic Confinement Rings"],
        failureEffect: "Uncontrolled gamma ray bursts",
        cascadeFailures: ["Megastructure Habitat", "Accelerators"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // Magnetic confinement rings around jets
    const magneticRingsGroup = new THREE.Group();
    const magneticRingGeom = new THREE.TorusGeometry(1, 0.2, 16, 64);
    for (let i = 1; i <= 20; i++) {
        const yPos = i * 35;
        const radiusMultiplier = Math.pow(i, 0.7) * 2;
        
        const topRing = new THREE.Mesh(magneticRingGeom, steel);
        topRing.scale.set(radiusMultiplier, radiusMultiplier, radiusMultiplier);
        topRing.position.y = yPos;
        topRing.rotation.x = Math.PI/2;
        magneticRingsGroup.add(topRing);
        
        const bottomRing = topRing.clone();
        bottomRing.position.y = -yPos;
        magneticRingsGroup.add(bottomRing);

        // Sub-details on rings
        for(let j = 0; j < 8; j++) {
            const detailGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
            const detailMesh = new THREE.Mesh(detailGeom, copper);
            detailMesh.position.set(
                Math.cos(j * Math.PI/4) * radiusMultiplier,
                0,
                Math.sin(j * Math.PI/4) * radiusMultiplier
            );
            detailMesh.rotation.x = Math.PI/2;
            topRing.add(detailMesh);
            
            const detailMeshBot = detailMesh.clone();
            bottomRing.add(detailMeshBot);
        }
    }
    jetsGroup.add(magneticRingsGroup);

    // --- PART 4: MEGASTRUCTURE RING (STATITE) ---
    // A massive rigid ring world hovering above the accretion disk via magnetic levitation
    const megastructureGroup = new THREE.Group();
    
    // Main structural torus
    const mainRingGeom = new THREE.TorusGeometry(300, 25, 64, 256);
    const mainRing = new THREE.Mesh(mainRingGeom, darkSteel);
    mainRing.rotation.x = Math.PI / 2;
    megastructureGroup.add(mainRing);
    
    parts.push({
        name: "Megastructure Containment Ring",
        description: "A colossal statite structure maintaining position against immense gravity using radiation pressure and advanced thrusters.",
        material: "Neutronium-Alloy Superstructure",
        function: "Base platform for Penrose extraction engines",
        assemblyOrder: 5,
        connections: ["Penrose Accelerators", "Energy Capacitors"],
        failureEffect: "Orbital decay, falling into singularity",
        cascadeFailures: ["Complete System Annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    // Add immense greebling to main ring
    const ringGreebles = new THREE.Group();
    const panelGeom = new THREE.BoxGeometry(40, 10, 30);
    const antennaGeom = new THREE.CylinderGeometry(1, 0.1, 50, 8);
    for (let i = 0; i < 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        const x = 300 * Math.cos(theta);
        const z = 300 * Math.sin(theta);
        
        const panel = new THREE.Mesh(panelGeom, aluminum);
        panel.position.set(x, 0, z);
        panel.lookAt(0, 0, 0);
        
        // Add layers
        const innerPanel = new THREE.Mesh(new THREE.BoxGeometry(38, 12, 28), chrome);
        panel.add(innerPanel);

        if (i % 3 === 0) {
            const antenna = new THREE.Mesh(antennaGeom, copper);
            antenna.position.set(0, 30, 0);
            panel.add(antenna);
            
            // Glowing tips
            const tip = new THREE.Mesh(new THREE.SphereGeometry(2), energyStreamMaterial);
            tip.position.set(0, 25, 0);
            antenna.add(tip);
        }

        ringGreebles.add(panel);
    }
    megastructureGroup.add(ringGreebles);
    group.add(megastructureGroup);

    // --- PART 5: PENROSE ACCELERATORS ---
    // Huge linear accelerators pointing inwards towards the ergosphere.
    const acceleratorsGroup = new THREE.Group();
    const numAccelerators = 8;
    const acceleratorData = [];

    // Accelerator base geometry
    const accBaseGeom = new THREE.BoxGeometry(60, 40, 180);
    const accBarrelGeom = new THREE.CylinderGeometry(15, 15, 250, 32);
    const coilGeom = new THREE.TorusGeometry(18, 4, 16, 64);
    
    for (let i = 0; i < numAccelerators; i++) {
        const acc = new THREE.Group();
        const theta = (i / numAccelerators) * Math.PI * 2;
        
        // Position on the megastructure ring
        acc.position.set(300 * Math.cos(theta), 0, 300 * Math.sin(theta));
        
        // Point towards center (black hole)
        acc.lookAt(0, 0, 0);
        
        // Shift barrel forwards towards BH
        const base = new THREE.Mesh(accBaseGeom, darkSteel);
        acc.add(base);
        
        const barrel = new THREE.Mesh(accBarrelGeom, steel);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = 125; // extend inwards
        acc.add(barrel);

        // Add magnetic coils along barrel
        const numCoils = 12;
        const coilMeshes = [];
        for(let c = 0; c < numCoils; c++) {
            const coil = new THREE.Mesh(coilGeom, copper);
            coil.position.z = 20 + c * 20;
            // Glowing inner ring
            const innerGlow = new THREE.Mesh(new THREE.TorusGeometry(14.5, 1, 16, 64), jetMaterial);
            coil.add(innerGlow);
            barrel.add(coil);
            coilMeshes.push(innerGlow);
        }

        // Add intricate hydraulic support struts
        const strut1 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 80), steel);
        strut1.position.set(20, -20, 50);
        strut1.rotation.x = Math.PI / 4;
        acc.add(strut1);
        const strut2 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 80), steel);
        strut2.position.set(-20, -20, 50);
        strut2.rotation.x = Math.PI / 4;
        acc.add(strut2);

        acceleratorsGroup.add(acc);
        
        acceleratorData.push({
            group: acc,
            coils: coilMeshes,
            theta: theta,
            chargeTimer: i * (100 / numAccelerators),
            state: 'charging' // charging, firing, reloading
        });
    }

    megastructureGroup.add(acceleratorsGroup);

    parts.push({
        name: "Mass Injection Accelerators",
        description: "Electromagnetic railguns that fire masses at relativistic speeds into the ergosphere precisely aligned with retrograde orbits.",
        material: "Superconducting YBCO arrays",
        function: "Deliver raw mass for Penrose splitting",
        assemblyOrder: 6,
        connections: ["Megastructure Ring", "Ergosphere Trajectory Matrix"],
        failureEffect: "Mass fails to enter ergosphere, wasted energy",
        cascadeFailures: ["Power Output Drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: -200, z: 200 }
    });


    // --- PART 6: ENERGY CAPTURE ARRAYS ---
    // Massive collector dishes situated adjacent to accelerators but angled to catch the escaping hyper-energized masses
    const captureArraysGroup = new THREE.Group();
    const captureDishGeom = new THREE.SphereGeometry(40, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const catcherArmGeom = new THREE.CylinderGeometry(8, 12, 120, 16);

    for (let i = 0; i < numAccelerators; i++) {
        const catcher = new THREE.Group();
        // Position slightly offset from the accelerators
        const theta = ((i + 0.3) / numAccelerators) * Math.PI * 2;
        catcher.position.set(300 * Math.cos(theta), 0, 300 * Math.sin(theta));
        catcher.lookAt(0, 0, 0);

        const arm = new THREE.Mesh(catcherArmGeom, aluminum);
        arm.rotation.x = Math.PI / 2;
        arm.position.z = 60;
        catcher.add(arm);

        const dish = new THREE.Mesh(captureDishGeom, chrome);
        dish.rotation.x = Math.PI; // point inwards
        dish.position.z = 120;
        
        // Dish center energy core
        const core = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 32), energyStreamMaterial);
        core.position.y = 20; // inside the dish
        dish.add(core);

        // Dish details
        const dishRim = new THREE.Mesh(new THREE.TorusGeometry(39, 2, 32, 64), darkSteel);
        dishRim.rotation.x = Math.PI/2;
        dishRim.position.y = 30;
        dish.add(dishRim);

        catcher.add(dish);
        captureArraysGroup.add(catcher);
    }
    megastructureGroup.add(captureArraysGroup);

    parts.push({
        name: "Momentum Capture Arrays",
        description: "Impact dampeners and magnetic decelerators designed to catch the hyper-energized half of the split mass escaping the ergosphere.",
        material: "Impact-Resistant Metamaterial / Magnetic Dampers",
        function: "Convert kinetic energy of escaping mass into usable grid power",
        assemblyOrder: 7,
        connections: ["Megastructure Ring", "Grid Capacitors"],
        failureEffect: "Hyper-velocity impact destroying the ring",
        cascadeFailures: ["Catastrophic Structural Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: -200, z: -200 }
    });

    // --- PART 7: ANIMATED PENROSE MASSES ---
    // The actual objects being fired, splitting, and escaping.
    const activeMasses = new THREE.Group();
    group.add(activeMasses);
    
    // We will manage a pool of masses in the animate function
    const massGeom = new THREE.SphereGeometry(3, 16, 16);
    const massMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888, metalness: 0.9, roughness: 0.1
    });
    const energizedMassMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.0
    });
    const doomedMassMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0
    });

    const massData = [];
    
    // Create a pool of reusable masses
    for(let i=0; i<20; i++) {
        const mGrp = new THREE.Group();
        
        const mainMass = new THREE.Mesh(massGeom, massMaterial);
        mGrp.add(mainMass);
        
        const escMass = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), energizedMassMaterial);
        escMass.visible = false;
        mGrp.add(escMass);
        
        const fallMass = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), doomedMassMaterial);
        fallMass.visible = false;
        mGrp.add(fallMass);

        // Particle trail
        const trailGeom = new THREE.BufferGeometry();
        const trailPos = new Float32Array(30 * 3);
        trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
        const trailMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.6 });
        const trailLine = new THREE.Line(trailGeom, trailMat);
        // Add to main group so trail is in world space
        group.add(trailLine);

        mGrp.visible = false;
        activeMasses.add(mGrp);
        
        massData.push({
            group: mGrp,
            main: mainMass,
            esc: escMass,
            fall: fallMass,
            trail: trailLine,
            trailPositions: [],
            active: false,
            phase: 'idle', // idle, incoming, splitting, escaping/falling
            progress: 0,
            sourceIndex: 0,
            targetTheta: 0,
            pathParams: {}
        });
    }

    parts.push({
        name: "Sacrificial Baryonic Masses",
        description: "Dense atomic payloads fired into the ergosphere. They detonate and split precisely at the turning point.",
        material: "Compressed Baryonic Matter",
        function: "The working fluid of the Penrose process. One half falls into BH with negative energy, the other escapes with >100% original energy.",
        assemblyOrder: 8,
        connections: ["Accelerators"],
        failureEffect: "Mass fails to split, orbits harmlessly or is consumed",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 200 }
    });

    // --- PART 8: SWIRLING ENERGY STREAMS ---
    // Visualize the transfer of energy from the catchers to the main grid
    const energyStreams = new THREE.Group();
    const streamCurves = [];
    const streamMeshes = [];
    
    for (let i = 0; i < numAccelerators; i++) {
        const catcherTheta = ((i + 0.3) / numAccelerators) * Math.PI * 2;
        const cX = 260 * Math.cos(catcherTheta);
        const cZ = 260 * Math.sin(catcherTheta);
        
        // Control points for a curved path along the ring
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(cX, 20, cZ),
            new THREE.Vector3(cX * 0.8, 100, cZ * 0.8),
            new THREE.Vector3(cX * 1.1, 150, cZ * 1.1),
            new THREE.Vector3(300 * Math.cos(catcherTheta + 0.5), 0, 300 * Math.sin(catcherTheta + 0.5))
        );
        streamCurves.push(curve);

        const tubeGeom = new THREE.TubeGeometry(curve, 64, 3, 8, false);
        const streamMesh = new THREE.Mesh(tubeGeom, new THREE.MeshStandardMaterial({
            color: 0xaa00ff,
            emissive: 0x8800ff,
            emissiveIntensity: 1.5,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        }));
        energyStreams.add(streamMesh);

        // Flowing energy pulses inside the stream
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), energyStreamMaterial);
        energyStreams.add(pulse);
        streamMeshes.push({ pulse: pulse, curve: curve, progress: Math.random() });
    }
    megastructureGroup.add(energyStreams);

    // Add immense central glowing halo to simulate gravitational lensing effect vaguely
    const lensingHaloGeom = new THREE.RingGeometry(40, 43, 128);
    const lensingHaloMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const lensingHalo = new THREE.Mesh(lensingHaloGeom, lensingHaloMat);
    // Needs to constantly look at camera in real engine, but we'll just rotate it
    group.add(lensingHalo);


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the Penrose process, a mass splits into two pieces within the ergosphere. What is the fundamental requirement for energy to be extracted from the Kerr black hole?",
            options: [
                "The escaping mass must exceed the speed of light.",
                "The piece falling into the event horizon must be assigned negative orbital energy as measured by an observer at infinity.",
                "The splitting must occur inside the event horizon.",
                "The black hole must have zero angular momentum."
            ],
            correctAnswer: 1,
            explanation: "For the escaping piece to have more energy than the original mass, the piece crossing the event horizon must possess negative energy relative to infinity. This is only possible within the ergosphere, where the time-like Killing vector becomes space-like."
        },
        {
            question: "What specific region of spacetime allows for the existence of negative-energy orbits required by the Penrose process?",
            options: [
                "The Photon Sphere",
                "The Ergosphere",
                "The Innermost Stable Circular Orbit (ISCO)",
                "The Cauchy Horizon"
            ],
            correctAnswer: 1,
            explanation: "The ergosphere is the region between the event horizon and the stationary limit surface. Inside it, spacetime dragging is so extreme that all objects must co-rotate, allowing orbits with negative energy relative to an observer at infinity."
        },
        {
            question: "According to the irreducible mass theorem formulated by Christodoulou and Ruffini, what is the maximum theoretical efficiency (mass-to-energy conversion) of the Penrose process for an extreme Kerr black hole?",
            options: [
                "10.5%",
                "20.7%",
                "29% (approx)",
                "100%"
            ],
            correctAnswer: 2,
            explanation: "For an extreme Kerr black hole (where a = M), up to ~29% of its total mass can be extracted via the Penrose process before its angular momentum is depleted and it becomes a Schwarzschild black hole."
        },
        {
            question: "Which tensor component describes the frame-dragging effect (Lense-Thirring effect) in the Kerr metric, making the ergosphere possible?",
            options: [
                "g_tt (time-time)",
                "g_rr (radial-radial)",
                "g_tφ (time-azimuthal)",
                "g_θθ (polar-polar)"
            ],
            correctAnswer: 2,
            explanation: "The g_tφ off-diagonal term in the Kerr metric represents the coupling between time and angular coordinates, resulting in the dragging of inertial frames and the formation of the ergosphere."
        },
        {
            question: "Superradiance, a wave analogue of the Penrose process, relies on which condition for an incident bosonic wave (frequency ω, azimuthal quantum number m) to be amplified by a Kerr black hole with angular velocity Ω_H?",
            options: [
                "ω > m Ω_H",
                "ω < m Ω_H",
                "ω = m Ω_H",
                "ω < 0"
            ],
            correctAnswer: 1,
            explanation: "The superradiant condition is 0 < ω < m Ω_H. When an incoming wave's frequency is less than the product of its azimuthal number and the black hole's horizon angular velocity, the scattered wave returns with greater amplitude, extracting rotational energy."
        }
    ];

    // --- ANIMATION LOGIC ---
    let time = 0;
    
    function animate(delta, speed = 1, customMeshes = null) {
        time += delta * speed;

        // 1. Rotate Event Horizon and Ergosphere
        eventHorizon.rotation.y = time * 2.5; // Very fast spin
        ergosphere.rotation.y = time * 2.0;

        // Pulsate ergosphere opacity/scale slightly
        ergosphere.scale.set(
            1.4 + Math.sin(time*5)*0.03,
            0.42 + Math.sin(time*5 + 1)*0.01,
            1.4 + Math.sin(time*5)*0.03
        );
        ergosphereMaterial.opacity = 0.35 + Math.sin(time*10)*0.05;

        // 2. Animate Accretion Disk Layers
        diskMeshes.forEach((d, idx) => {
            d.mesh.rotation.z += d.speed * speed;
        });

        // 3. Animate Plasma Particles in Disk
        plasmaData.forEach(p => {
            p.theta += p.speed * speed * 0.05;
            p.mesh.position.x = p.r * Math.cos(p.theta);
            p.mesh.position.z = p.r * Math.sin(p.theta);
            // Slight bobbing
            p.mesh.position.y = p.y + Math.sin(time * 10 + p.r) * 2;
        });

        // 4. Rotate Relativistic Jets and Magnetic Rings
        topJet.rotation.y = time * -5;
        jetsGroup.children[1].rotation.y = time * -5;
        
        // Pulse jet materials
        jetMaterial.emissiveIntensity = 4.0 + Math.sin(time*15) * 1.5;
        jetCoreMaterial.emissiveIntensity = 5.0 + Math.random() * 2.0;

        // 5. Megastructure Ring slow rotation (counter to BH)
        megastructureGroup.rotation.y = time * -0.05;

        // 6. Penrose Accelerators & Mass Firing Logic
        acceleratorData.forEach((acc, idx) => {
            // Charging animation
            acc.chargeTimer += speed;
            if (acc.chargeTimer > 100) acc.chargeTimer = 0;

            // Pulse coils based on charge
            acc.coils.forEach((coil, cIdx) => {
                const threshold = (cIdx / acc.coils.length) * 100;
                if (acc.chargeTimer > threshold && acc.chargeTimer < threshold + 15) {
                    coil.material.emissiveIntensity = 10;
                    coil.scale.set(1.2, 1.2, 1.2);
                } else {
                    coil.material.emissiveIntensity = 2;
                    coil.scale.set(1, 1, 1);
                }
            });

            // Fire a mass
            if (acc.chargeTimer > 98) {
                // Find inactive mass
                const m = massData.find(md => !md.active);
                if (m) {
                    m.active = true;
                    m.group.visible = true;
                    m.main.visible = true;
                    m.esc.visible = false;
                    m.fall.visible = false;
                    m.phase = 'incoming';
                    m.progress = 0;
                    m.sourceIndex = idx;
                    m.targetTheta = acc.theta + Math.PI; // Opposite side for catch
                    m.trailPositions = [];
                    m.trail.visible = true;
                    
                    // Starting pos (at end of accelerator barrel)
                    const startX = 180 * Math.cos(acc.theta);
                    const startZ = 180 * Math.sin(acc.theta);
                    
                    // The splitting point inside the ergosphere (r ~ 30)
                    // Slightly offset to mimic an orbit
                    const splitTheta = acc.theta + Math.PI/2;
                    const splitX = 25 * Math.cos(splitTheta);
                    const splitZ = 25 * Math.sin(splitTheta);

                    // The catch point
                    const catcherTheta = ((idx + 0.3) / numAccelerators) * Math.PI * 2;
                    // Account for the ring rotation over time... 
                    // To keep it simple, just aim for the local coordinate catcher
                    const endX = 260 * Math.cos(catcherTheta);
                    const endZ = 260 * Math.sin(catcherTheta);

                    m.pathParams = {
                        start: new THREE.Vector3(startX, 0, startZ),
                        split: new THREE.Vector3(splitX, 0, splitZ),
                        end: new THREE.Vector3(endX, 0, endZ),
                        // Control points for bezier incoming
                        c1: new THREE.Vector3(100 * Math.cos(acc.theta), 0, 100 * Math.sin(acc.theta)),
                        // Control points for bezier escape
                        c2: new THREE.Vector3(100 * Math.cos(catcherTheta - 0.2), 0, 100 * Math.sin(catcherTheta - 0.2))
                    };
                }
            }
        });

        // 7. Update Active Masses
        massData.forEach(m => {
            if (!m.active) return;

            // Update trail
            m.trailPositions.push(m.group.position.x, m.group.position.y, m.group.position.z);
            if (m.trailPositions.length > 90) { // 30 points * 3
                m.trailPositions.splice(0, 3);
            }
            const positions = new Float32Array(m.trailPositions.length);
            for(let i=0; i<m.trailPositions.length; i++) positions[i] = m.trailPositions[i];
            m.trail.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            m.trail.geometry.attributes.position.needsUpdate = true;

            // Animate along path
            if (m.phase === 'incoming') {
                m.progress += speed * 0.02; // Fast incoming
                if (m.progress >= 1.0) {
                    m.progress = 1.0;
                    m.phase = 'splitting';
                } else {
                    // Quadratic bezier
                    const t = m.progress;
                    const omt = 1 - t;
                    const p = new THREE.Vector3();
                    p.x = omt*omt*m.pathParams.start.x + 2*omt*t*m.pathParams.c1.x + t*t*m.pathParams.split.x;
                    p.y = 0;
                    p.z = omt*omt*m.pathParams.start.z + 2*omt*t*m.pathParams.c1.z + t*t*m.pathParams.split.z;
                    
                    // Transform to world coordinates based on megastructure rotation
                    p.applyAxisAngle(new THREE.Vector3(0,1,0), megastructureGroup.rotation.y);
                    m.group.position.copy(p);
                }
            } 
            else if (m.phase === 'splitting') {
                // Instantly split
                m.main.visible = false;
                m.esc.visible = true;
                m.fall.visible = true;
                
                // Flash effect at split point
                jetMaterial.emissiveIntensity += 5; // Flash the jets briefly as energy is disturbed

                m.phase = 'escaping';
                m.progress = 0;
            }
            else if (m.phase === 'escaping') {
                m.progress += speed * 0.015; // Slower escape
                
                // 1. Escaping mass (gains energy)
                const t = m.progress;
                if (t <= 1.0) {
                    const omt = 1 - t;
                    const pE = new THREE.Vector3();
                    pE.x = omt*omt*m.pathParams.split.x + 2*omt*t*m.pathParams.c2.x + t*t*m.pathParams.end.x;
                    pE.y = 0;
                    pE.z = omt*omt*m.pathParams.split.z + 2*omt*t*m.pathParams.c2.z + t*t*m.pathParams.end.z;
                    pE.applyAxisAngle(new THREE.Vector3(0,1,0), megastructureGroup.rotation.y);
                    m.esc.position.copy(pE).sub(m.group.position); // Relative to group
                }

                // 2. Falling mass (negative energy, spirals into BH)
                // Spiral equation
                const r = 25 * (1 - t);
                const theta = t * Math.PI * 4; // spin fast
                const pF = new THREE.Vector3(
                    r * Math.cos(m.pathParams.split.x + theta),
                    -t * 10, // fall downwards slightly
                    r * Math.sin(m.pathParams.split.z + theta)
                );
                pF.applyAxisAngle(new THREE.Vector3(0,1,0), megastructureGroup.rotation.y);
                m.fall.position.copy(pF).sub(m.group.position);
                
                // Scale falling mass down to 0
                const scale = Math.max(0.01, 1 - t);
                m.fall.scale.set(scale, scale, scale);

                if (t >= 1.0) {
                    // Reached catcher
                    m.active = false;
                    m.group.visible = false;
                    m.trail.visible = false;
                    
                    // Trigger energy stream pulse
                    streamMeshes[m.sourceIndex].progress = 0;
                }
            }
        });

        // 8. Update Energy Streams
        streamMeshes.forEach(sm => {
            sm.progress += speed * 0.03;
            if (sm.progress > 1) sm.progress = 1;
            
            if (sm.progress < 1) {
                sm.pulse.visible = true;
                const pos = sm.curve.getPointAt(sm.progress);
                sm.pulse.position.copy(pos);
                // Pulse scale
                const scale = 1 + Math.sin(time*20)*0.5;
                sm.pulse.scale.set(scale, scale, scale);
            } else {
                sm.pulse.visible = false;
            }
        });

        // 9. Lensing halo rotation
        lensingHalo.rotation.z += 0.01 * speed;
        lensingHalo.lookAt(0,0,0); // in a real app would look at camera
    }

    return {
        group,
        parts,
        description: "The Penrose Process Superradiance Engine extracts rotational energy from an extreme Kerr Black Hole. By firing baryonic masses into the ergosphere precisely aligned with retrograde orbits, the mass decays into two parts. One part crosses the event horizon with negative orbital energy, while the other escapes with greater mass-energy than the original projectile, theoretically allowing up to 29% of the black hole's mass to be harvested.",
        quizQuestions,
        animate
    };
}
