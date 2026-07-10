import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const alienAlloy = new THREE.MeshStandardMaterial({ color: 0x151525, metalness: 1.0, roughness: 0.15 });
    const obsidianGlass = new THREE.MeshPhysicalMaterial({ color: 0x050510, metalness: 0.9, roughness: 0.05, transparent: true, opacity: 0.7, transmission: 0.5 });
    const quantumEnergy = new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x8a2be2, emissiveIntensity: 4.5, wireframe: true, transparent: true, opacity: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5 });
    const rustSteel = new THREE.MeshStandardMaterial({ color: 0x332211, metalness: 0.6, roughness: 0.9 });

    // Arrays for animation
    const animatedTires = [];
    const animatedPistons = [];
    const animatedGears = [];
    const animatedShards = [];
    const animatedRings = [];
    let particleSystem;
    let coreMesh;
    let apertureMesh;

    // --- 1. CHASSIS ---
    const chassisGroup = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-20, 0);
    chassisShape.lineTo(20, 0);
    chassisShape.lineTo(25, 5);
    chassisShape.lineTo(25, 12);
    chassisShape.lineTo(-25, 12);
    chassisShape.lineTo(-25, 5);
    chassisShape.lineTo(-20, 0);
    
    const chassisExtrude = { depth: 16, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 3 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 5, -8);
    chassisGroup.add(chassisMesh);
    group.add(chassisGroup);

    parts.push({
        name: 'Heavy Transport Chassis',
        description: 'Massive armored structural frame supporting the resonator and crawler assembly.',
        material: darkSteel,
        function: 'Structural integrity and housing for lower drive train.',
        assemblyOrder: 1,
        connections: ['Tire Assemblies', 'Hydraulic Suspension'],
        failureEffect: 'Structural collapse of the entire vehicle.',
        cascadeFailures: ['All systems'],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // --- 2. COMPLEX TIRES & RIMS ---
    const tireGroup = new THREE.Group();
    const tirePositions = [
        {x: -18, y: 5, z: 12}, {x: -6, y: 5, z: 12}, {x: 6, y: 5, z: 12}, {x: 18, y: 5, z: 12},
        {x: -18, y: 5, z: -12}, {x: -6, y: 5, z: -12}, {x: 6, y: 5, z: -12}, {x: 18, y: 5, z: -12}
    ];

    const tireGeo = new THREE.TorusGeometry(4, 1.5, 32, 64);
    const lugGeo = new THREE.BoxGeometry(1, 0.5, 2.5);
    const rimCyl = new THREE.CylinderGeometry(2.5, 2.5, 3, 32);
    const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);

    tirePositions.forEach(pos => {
        const wheelObj = new THREE.Group();
        
        // Tire base
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireMesh.rotation.x = Math.PI / 2;
        wheelObj.add(tireMesh);

        // Lugs (hundreds of tiny extruded lugs)
        for(let i=0; i<60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle)*5.3, Math.sin(angle)*5.3, 0);
            lug.rotation.z = angle;
            wheelObj.add(lug);
        }

        // Rim
        const rim = new THREE.Mesh(rimCyl, chrome);
        rim.rotation.x = Math.PI/2;
        wheelObj.add(rim);

        // Spokes
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = angle;
            spoke.position.set(Math.cos(angle)*1.2, Math.sin(angle)*1.2, 0);
            wheelObj.add(spoke);
        }

        wheelObj.position.set(pos.x, pos.y, pos.z);
        if (pos.z < 0) wheelObj.rotation.y = Math.PI; // flip right side
        tireGroup.add(wheelObj);
        animatedTires.push(wheelObj);
    });
    group.add(tireGroup);

    parts.push({
        name: 'All-Terrain Quantum Treads',
        description: 'High-traction vulcanized rubber wheels with complex aggressive lug patterns and chrome alloy rims.',
        material: rubber,
        function: 'Locomotion across fractured dimensions and treacherous planetary surfaces.',
        assemblyOrder: 2,
        connections: ['Heavy Transport Chassis', 'Hydraulic Suspension'],
        failureEffect: 'Immobilization and bogging down in harsh terrain.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 5, z: 35}
    });

    // --- 3. HYDRAULICS & PISTONS ---
    const hydraulicGroup = new THREE.Group();
    class PipeCurve extends THREE.Curve {
        constructor(v1, v2, v3) {
            super();
            this.v1 = v1; this.v2 = v2; this.v3 = v3;
        }
        getPoint(t, target = new THREE.Vector3()) {
            const tx = (1-t)*(1-t)*this.v1.x + 2*(1-t)*t*this.v2.x + t*t*this.v3.x;
            const ty = (1-t)*(1-t)*this.v1.y + 2*(1-t)*t*this.v2.y + t*t*this.v3.y;
            const tz = (1-t)*(1-t)*this.v1.z + 2*(1-t)*t*this.v2.z + t*t*this.v3.z;
            return target.set(tx, ty, tz);
        }
    }

    tirePositions.forEach((pos, idx) => {
        const outerPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 16), rustSteel);
        const innerPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 16), chrome);
        
        outerPiston.position.set(pos.x, pos.y + 4, pos.z - Math.sign(pos.z)*2);
        innerPiston.position.set(pos.x, pos.y + 2, pos.z - Math.sign(pos.z)*2);
        
        hydraulicGroup.add(outerPiston);
        hydraulicGroup.add(innerPiston);
        animatedPistons.push({inner: innerPiston, baseY: pos.y + 2, offset: idx});

        // Hydraulic Line
        const start = new THREE.Vector3(pos.x, pos.y + 4, pos.z - Math.sign(pos.z)*2);
        const mid = new THREE.Vector3(pos.x, pos.y + 7, pos.z - Math.sign(pos.z)*5);
        const end = new THREE.Vector3(pos.x, pos.y + 9, 0);
        const curve = new PipeCurve(start, mid, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
        hydraulicGroup.add(tubeMesh);
    });
    group.add(hydraulicGroup);

    parts.push({
        name: 'Hydraulic Suspension & Fluid Lines',
        description: 'High-pressure pneumatic cylinders and rubberized tubing providing immense shock absorption.',
        material: chrome,
        function: 'Dampens kinetic impacts to protect the delicate quantum core above.',
        assemblyOrder: 3,
        connections: ['Heavy Transport Chassis', 'All-Terrain Quantum Treads'],
        failureEffect: 'Ruptured fluid lines, chassis bottoming out, harsh impacts transmitted to core.',
        cascadeFailures: ['Singularity Core'],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: -25, y: 8, z: -25}
    });

    // --- 4. DETAILED OPERATOR CABIN ---
    const cabinGroup = new THREE.Group();
    const cabShape = new THREE.Shape();
    cabShape.moveTo(0, 0);
    cabShape.lineTo(8, 0);
    cabShape.lineTo(8, 6);
    cabShape.lineTo(5, 10);
    cabShape.lineTo(0, 10);
    cabShape.lineTo(0, 0);
    const cabExtrude = { depth: 10, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2 };
    const cabMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(cabShape, cabExtrude), aluminum);
    cabMesh.position.set(12, 17, -5);
    cabinGroup.add(cabMesh);

    // Tinted windows
    const windowGeo = new THREE.PlaneGeometry(3.5, 4);
    const windowMesh1 = new THREE.Mesh(windowGeo, tinted);
    windowMesh1.position.set(18.2, 22.5, 0);
    windowMesh1.rotation.y = Math.PI/2;
    windowMesh1.rotation.x = -0.2;
    cabinGroup.add(windowMesh1);

    // Interior controls
    const consoleGeo = new THREE.BoxGeometry(2, 2, 8);
    const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
    consoleMesh.position.set(18, 19, 0);
    cabinGroup.add(consoleMesh);

    const screenGeo = new THREE.PlaneGeometry(1.5, 1.2);
    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(screenGeo, screenGlow);
        screen.position.set(17.5, 20.2, -2 + i*2);
        screen.rotation.y = -Math.PI/2;
        screen.rotation.x = -Math.PI/6;
        cabinGroup.add(screen);
    }

    const steeringWheelGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, darkSteel);
    steeringWheel.position.set(17, 19.5, 0);
    steeringWheel.rotation.y = Math.PI/2;
    steeringWheel.rotation.x = Math.PI/4;
    cabinGroup.add(steeringWheel);
    
    // Side Mirrors
    const mirrorRod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), steel);
    mirrorRod.position.set(16, 21, 5.5);
    mirrorRod.rotation.x = Math.PI/2;
    const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), chrome);
    mirrorHead.position.set(16, 21, 6.5);
    cabinGroup.add(mirrorRod);
    cabinGroup.add(mirrorHead);

    group.add(cabinGroup);

    parts.push({
        name: 'Command Cabin & Avionics',
        description: 'Reinforced operational bridge with tinted viewports, holographic readouts, and manual overrides.',
        material: aluminum,
        function: 'Enables safe monitoring and maneuvering of the resonator platform.',
        assemblyOrder: 15,
        connections: ['Heavy Transport Chassis', 'Xenodynamic Armor Plating'],
        failureEffect: 'Loss of manual control, blinding of operator by quantum flashes.',
        cascadeFailures: [],
        originalPosition: {x: 12, y: 17, z: 0},
        explodedPosition: {x: 45, y: 25, z: 0}
    });

    // --- 5. LADDERS AND RAILS ---
    const ladderGroup = new THREE.Group();
    const railMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.8, roughness: 0.2});
    for(let i=0; i<10; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), railMat);
        rung.rotation.x = Math.PI/2;
        rung.position.set(12, 6 + i, 5.2);
        ladderGroup.add(rung);
    }
    const side1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 10), railMat);
    side1.position.set(12, 11, 4.2);
    const side2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 10), railMat);
    side2.position.set(12, 11, 6.2);
    ladderGroup.add(side1); ladderGroup.add(side2);
    group.add(ladderGroup);

    parts.push({
        name: 'Maintenance Ladders',
        description: 'Industrial-grade aluminum alloy rungs and handrails.',
        material: steel,
        function: 'Allows crew access to the upper command cabin and quantum arrays.',
        assemblyOrder: 16,
        connections: ['Command Cabin & Avionics', 'Heavy Transport Chassis'],
        failureEffect: 'Reduced accessibility for field repairs.',
        cascadeFailures: [],
        originalPosition: {x: 12, y: 11, z: 5.2},
        explodedPosition: {x: 12, y: 11, z: 25}
    });

    // --- 6. QUANTUM RESONATOR BASE PLATFORM ---
    const basePoints = [];
    for ( let i = 0; i < 25; i ++ ) {
        basePoints.push( new THREE.Vector2( Math.sin( i * 0.15 ) * 8 + 12, i * 0.4 ) );
    }
    const baseGeo = new THREE.LatheGeometry( basePoints, 64 );
    const basePlatform = new THREE.Mesh( baseGeo, alienAlloy );
    basePlatform.position.set(-8, 17, 0);
    group.add( basePlatform );

    parts.push({
        name: 'Gravimetric Platform',
        description: 'Circular xenotech lathe-forged base pulsing with micro-gravitational fields.',
        material: alienAlloy,
        function: 'Serves as the foundation and primary containment cradle for the singularity.',
        assemblyOrder: 4,
        connections: ['Heavy Transport Chassis', 'Singularity Core'],
        failureEffect: 'Core instantly melts through chassis and sinks into the planet.',
        cascadeFailures: ['Singularity Core', 'Heavy Transport Chassis'],
        originalPosition: {x: -8, y: 17, z: 0},
        explodedPosition: {x: -8, y: 17, z: -40}
    });

    // --- 7. SINGULARITY CORE ---
    const coreGeo = new THREE.TorusKnotGeometry(5, 1.5, 300, 80, 4, 9);
    coreMesh = new THREE.Mesh(coreGeo, quantumEnergy);
    coreMesh.position.set(-8, 30, 0);
    group.add(coreMesh);

    parts.push({
        name: 'Singularity Core',
        description: 'A glowing, geometrically impossible knot of pure deep-purple quantum energy.',
        material: quantumEnergy,
        function: 'Generates the immense resonance frequencies required to pierce spacetime.',
        assemblyOrder: 10,
        connections: ['Gravimetric Platform', 'Levitating Obsidian Shards'],
        failureEffect: 'Spontaneous black hole creation.',
        cascadeFailures: ['All systems'],
        originalPosition: {x: -8, y: 30, z: 0},
        explodedPosition: {x: -8, y: 65, z: 0}
    });

    // --- 8. LEVITATING SHARDS ---
    const shardGroup = new THREE.Group();
    shardGroup.position.set(-8, 30, 0);
    const numShards = 16;
    for (let i = 0; i < numShards; i++) {
        const shardGeo = new THREE.IcosahedronGeometry(1.5, 0);
        shardGeo.scale(0.5, 3.5, 0.8);
        const shardMesh = new THREE.Mesh(shardGeo, obsidianGlass);
        const angle = (i / numShards) * Math.PI * 2;
        shardMesh.position.x = Math.cos(angle) * 14;
        shardMesh.position.z = Math.sin(angle) * 14;
        shardMesh.lookAt(new THREE.Vector3(0, 0, 0));
        shardGroup.add(shardMesh);
        animatedShards.push({mesh: shardMesh, angle: angle, dist: 14});
    }
    group.add(shardGroup);

    parts.push({
        name: 'Levitating Obsidian Shards',
        description: 'Dark, semi-transparent crystalline prisms that hover magnetically around the core.',
        material: obsidianGlass,
        function: 'Refracts and modulates the quantum energy fields into stable harmonized waves.',
        assemblyOrder: 11,
        connections: ['Singularity Core'],
        failureEffect: 'Unmodulated waves rip organic matter apart at the molecular level.',
        cascadeFailures: ['Command Cabin & Avionics'],
        originalPosition: {x: -8, y: 30, z: 0},
        explodedPosition: {x: -8, y: 30, z: -40}
    });

    // --- 9. MAGNETIC FLUX RINGS ---
    const ringGroup = new THREE.Group();
    ringGroup.position.set(-8, 30, 0);
    for(let i=0; i<4; i++) {
        const ringGeo = new THREE.TorusGeometry(18 + i*2.5, 0.4, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        ringMesh.rotation.x = Math.PI / 2 + (i*0.1);
        ringGroup.add(ringMesh);
        animatedRings.push(ringMesh);
    }
    group.add(ringGroup);

    parts.push({
        name: 'Magnetic Flux Rings',
        description: 'Massive, hyper-conductive chrome rings spinning on multi-axis gimbals.',
        material: chrome,
        function: 'Generates the magnetic bottle that contains the singularity.',
        assemblyOrder: 9,
        connections: ['Gravimetric Platform', 'Singularity Core'],
        failureEffect: 'Loss of containment, singularity breach.',
        cascadeFailures: ['Singularity Core'],
        originalPosition: {x: -8, y: 30, z: 0},
        explodedPosition: {x: -8, y: 15, z: 45}
    });

    // --- 10. EMITTERS ---
    const emittersGroup = new THREE.Group();
    emittersGroup.position.set(-8, 30, 0);
    for (let i = 0; i < 6; i++) {
        const emitterGeo = new THREE.OctahedronGeometry(2.5, 1);
        const emitterMesh = new THREE.Mesh(emitterGeo, darkSteel);
        const angle = (i / 6) * Math.PI * 2;
        emitterMesh.position.x = Math.cos(angle) * 20;
        emitterMesh.position.z = Math.sin(angle) * 20;
        
        // Add neon glowing tips
        const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 8), neonGreen);
        tipMesh.position.y = 2.5;
        emitterMesh.add(tipMesh);

        emittersGroup.add(emitterMesh);
    }
    group.add(emittersGroup);
    animatedGears.push(emittersGroup);

    parts.push({
        name: 'Field Emitters',
        description: 'Heavy steel octahedrons tipped with glowing neon projectors.',
        material: darkSteel,
        function: 'Directs the modulated quantum waves outward to alter local terrain.',
        assemblyOrder: 8,
        connections: ['Magnetic Flux Rings'],
        failureEffect: 'Waves reflect back inward, damaging the rings.',
        cascadeFailures: ['Magnetic Flux Rings'],
        originalPosition: {x: -8, y: 30, z: 0},
        explodedPosition: {x: -45, y: 30, z: 0}
    });

    // --- 11. QUANTUM PARTICLE SYSTEM ---
    const particleCount = 15000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        const r = 5 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        particlePos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        particlePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        particlePos[i*3+2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xaa00ff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.position.set(-8, 30, 0);
    group.add(particleSystem);

    parts.push({
        name: 'Quantum Particle Field',
        description: 'A visible cloud of bleeding-edge entangled particles.',
        material: quantumEnergy,
        function: 'Bleeds off excess dimensional friction.',
        assemblyOrder: 12,
        connections: ['Singularity Core'],
        failureEffect: 'Friction buildup igniting the surrounding atmosphere.',
        cascadeFailures: [],
        originalPosition: {x: -8, y: 30, z: 0},
        explodedPosition: {x: -8, y: 75, z: 0}
    });

    // --- 12. EXHAUST STACKS ---
    const exhaustGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const stackMesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 12, 16), rustSteel);
        stackMesh.position.set(-20 + i*4, 23, 10);
        
        // Grille cap
        const grille = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 8, 16), chrome);
        grille.position.y = 6;
        grille.rotation.x = Math.PI/2;
        stackMesh.add(grille);

        exhaustGroup.add(stackMesh);
    }
    group.add(exhaustGroup);

    parts.push({
        name: 'Thermal Exhaust Stacks',
        description: 'Thick, rust-pitted cylinders capped with chrome grilles.',
        material: rustSteel,
        function: 'Vents superheated plasma and conventional combustion byproducts from the drive train.',
        assemblyOrder: 6,
        connections: ['Heavy Transport Chassis'],
        failureEffect: 'Chassis overheating and engine block meltdown.',
        cascadeFailures: ['All-Terrain Quantum Treads'],
        originalPosition: {x: -14, y: 23, z: 10},
        explodedPosition: {x: -14, y: 23, z: 30}
    });

    // --- 13. ENERGY SIPHONS ---
    const siphonGroup = new THREE.Group();
    siphonGroup.position.set(-8, 48, 0);
    const siphonGeo = new THREE.ConeGeometry(3, 12, 32);
    for(let i=0; i<3; i++) {
        const siphonMesh = new THREE.Mesh(siphonGeo, rubber);
        const angle = (i / 3) * Math.PI * 2;
        siphonMesh.position.x = Math.cos(angle) * 8;
        siphonMesh.position.z = Math.sin(angle) * 8;
        siphonMesh.rotation.x = Math.PI; // point downwards
        
        // Add a copper coil around it
        const coilGeo = new THREE.TorusKnotGeometry(3, 0.2, 100, 16, 2, 10);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.scale.set(1, 0.3, 1);
        coil.position.y = -2;
        siphonMesh.add(coil);

        siphonGroup.add(siphonMesh);
    }
    group.add(siphonGroup);

    parts.push({
        name: 'Vacuum Energy Siphons',
        description: 'Inverted rubberized cones wrapped in conductive copper coils.',
        material: copper,
        function: 'Draws zero-point energy from the vacuum to sustain the core.',
        assemblyOrder: 13,
        connections: ['Singularity Core'],
        failureEffect: 'Power starvation causing core collapse.',
        cascadeFailures: ['Singularity Core'],
        originalPosition: {x: -8, y: 48, z: 0},
        explodedPosition: {x: -8, y: 85, z: 0}
    });

    // --- 14. DIMENSIONAL TEAR APERTURE ---
    apertureMesh = new THREE.Mesh(new THREE.RingGeometry(8, 12, 64), tinted);
    apertureMesh.position.set(-8, 55, 0);
    apertureMesh.rotation.x = Math.PI / 2;
    group.add(apertureMesh);

    parts.push({
        name: 'Dimensional Tear Aperture',
        description: 'A massive tinted lens floating ominously above the machine.',
        material: tinted,
        function: 'Acts as the focal point where reality is punctured.',
        assemblyOrder: 14,
        connections: ['Vacuum Energy Siphons'],
        failureEffect: 'Uncontrolled spatial ripping, swallowing the machine whole.',
        cascadeFailures: ['All systems'],
        originalPosition: {x: -8, y: 55, z: 0},
        explodedPosition: {x: 25, y: 75, z: -25}
    });

    // --- 15. CHRONITON CAPACITORS ---
    const capacitorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const capGroup = new THREE.Group();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 8, 32), glass);
        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1, 32), steel);
        capTop.position.y = 4;
        const capBot = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1, 32), steel);
        capBot.position.y = -4;
        
        // Inner glowing core
        const innerGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 7, 16), screenGlow);
        
        capGroup.add(cylinder); capGroup.add(capTop); capGroup.add(capBot); capGroup.add(innerGlow);
        
        const angle = (i/8)*Math.PI*2;
        capGroup.position.set(-8 + Math.cos(angle)*12, 22, Math.sin(angle)*12);
        
        capacitorGroup.add(capGroup);
    }
    group.add(capacitorGroup);

    parts.push({
        name: 'Chroniton Capacitors',
        description: 'Thick glass vats bolted with steel, containing a violently bright cyan fluid.',
        material: glass,
        function: 'Stores temporal energy to rewind local time if the core destabilizes.',
        assemblyOrder: 7,
        connections: ['Gravimetric Platform'],
        failureEffect: 'Localized time freezing; the vehicle becomes a permanent statue in time.',
        cascadeFailures: [],
        originalPosition: {x: -8, y: 22, z: 0},
        explodedPosition: {x: -35, y: 22, z: 35}
    });

    // --- 16. XENODYNAMIC PLATING ---
    const platingGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0); shape.lineTo(4, 10); shape.lineTo(8, 10); shape.lineTo(12, 0); shape.lineTo(6, -4);
        const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const plateMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), alienAlloy);
        
        const angle = (i / 6) * Math.PI * 2;
        plateMesh.position.set(-8 + Math.cos(angle) * 16, 8, Math.sin(angle) * 16);
        plateMesh.rotation.y = -angle + Math.PI/2;
        plateMesh.rotation.x = 0.2;
        platingGroup.add(plateMesh);
    }
    group.add(platingGroup);

    parts.push({
        name: 'Xenodynamic Armor Plating',
        description: 'Angular, heavily beveled slabs of unidentifiable black metal.',
        material: alienAlloy,
        function: 'Deflects incoming hostiles and wandering cosmic debris.',
        assemblyOrder: 5,
        connections: ['Heavy Transport Chassis'],
        failureEffect: 'Exposes delicate hydraulics and capacitors to enemy fire.',
        cascadeFailures: ['Chroniton Capacitors', 'Hydraulic Suspension & Fluid Lines'],
        originalPosition: {x: -8, y: 8, z: 0},
        explodedPosition: {x: -8, y: 0, z: -45}
    });

    const description = "The Xenodynamics Quantum Resonator Mobile Platform is an apocalyptic fusion of human heavy-industry mechanics and incomprehensible alien xenotech. Riding on 8 massive off-road quantum treads driven by thick hydraulic pistons, this behemoth crawls across any planetary surface. Its primary payload is a terrifying Torus-knot Singularity Core, bounded by spinning magnetic flux rings, levitating obsidian shards, and intense fields of deep purple quantum energy. Operated from a heavily armored, tinted-glass cabin, it punches temporary apertures through dimensions, leaving glowing particle trails and temporal echoes in its wake.";

    const quizQuestions = [
        {
            question: "How does the machine achieve locomotion across harsh terrain?",
            options: ["Anti-gravity repulsors", "All-Terrain Quantum Treads", "Dimensional jumping", "Mechanical walking legs"],
            correctAnswer: 1,
            explanation: "It uses 8 massive high-traction vulcanized rubber wheels with complex lug patterns."
        },
        {
            question: "What material is used to construct the Singularity Core?",
            options: ["Alien Alloy", "Obsidian Glass", "Quantum Energy", "Void Matter"],
            correctAnswer: 2,
            explanation: "The core is an impossible knot made entirely of glowing, deep-purple quantum energy."
        },
        {
            question: "What is the purpose of the Chroniton Capacitors?",
            options: ["To power the tracks", "To store temporal energy and rewind time", "To filter exhaust", "To provide operator oxygen"],
            correctAnswer: 1,
            explanation: "They contain violently bright cyan fluid used to rewind local time if the core destabilizes."
        },
        {
            question: "What protects the operator from quantum flashes?",
            options: ["Xenodynamic Armor Plating", "Magnetic Flux Rings", "Tinted Viewports in the Command Cabin", "Thermal Exhaust Stacks"],
            correctAnswer: 2,
            explanation: "The reinforced operational bridge uses tinted viewports to prevent the operator from being blinded."
        },
        {
            question: "What is the consequence if the Levitating Obsidian Shards fail?",
            options: ["The engine overheats", "The vehicle gets stuck", "Unmodulated waves rip organic matter apart", "Spontaneous black hole creation"],
            correctAnswer: 2,
            explanation: "If they fail to modulate the fields, unmodulated waves rip organic matter apart at the molecular level."
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Spin wheels
        animatedTires.forEach(wheel => {
            wheel.rotation.z = -t * 2;
        });

        // Hydraulic pistons bobbing
        animatedPistons.forEach(p => {
            p.inner.position.y = p.baseY + Math.sin(t * 5 + p.offset) * 1.5;
        });

        // Emitter Rotation
        animatedGears.forEach(g => {
            g.rotation.y = t * 0.5;
        });

        // Core animation
        if (coreMesh) {
            coreMesh.rotation.x = t * 0.8;
            coreMesh.rotation.y = t * 1.2;
            coreMesh.rotation.z = t * 0.5;
            // Pulsing color intensity
            quantumEnergy.emissiveIntensity = 4 + Math.sin(t * 4) * 2;
        }

        // Levitating Shards
        animatedShards.forEach((s, idx) => {
            // Orbit slowly
            const currentAngle = s.angle + t * 0.3;
            s.mesh.position.x = Math.cos(currentAngle) * s.dist;
            s.mesh.position.z = Math.sin(currentAngle) * s.dist;
            // Bob up and down
            s.mesh.position.y = Math.sin(t * 2 + idx) * 3;
            // Always point at center
            s.mesh.lookAt(new THREE.Vector3(0, 0, 0));
        });

        // Magnetic Flux Rings
        animatedRings.forEach((r, idx) => {
            r.rotation.y = t * (1 + idx*0.3);
            r.rotation.z = t * (0.5 + idx*0.2);
            // Gimbal wobble
            r.rotation.x = Math.PI / 2 + Math.sin(t * 1.5 + idx) * 0.3;
        });

        // Quantum Particles
        if (particleSystem) {
            particleSystem.rotation.y = t * 0.2;
            particleSystem.rotation.x = Math.sin(t * 0.1) * 0.1;
            
            const positions = particleSystem.geometry.attributes.position.array;
            for(let i=0; i<15000; i++) {
                // Chaotic jitter
                positions[i*3] += (Math.random() - 0.5) * 0.05;
                positions[i*3+1] += (Math.random() - 0.5) * 0.05;
                positions[i*3+2] += (Math.random() - 0.5) * 0.05;
                
                // Pull towards center if they stray too far
                const x = positions[i*3];
                const y = positions[i*3+1];
                const z = positions[i*3+2];
                const distSq = x*x + y*y + z*z;
                if (distSq > 150) {
                    positions[i*3] *= 0.99;
                    positions[i*3+1] *= 0.99;
                    positions[i*3+2] *= 0.99;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Aperture pulsing
        if (apertureMesh) {
            const scale = 1 + Math.sin(t * 3) * 0.15;
            apertureMesh.scale.set(scale, scale, 1);
            apertureMesh.rotation.z = t * -0.5;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createQuantumResonator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
