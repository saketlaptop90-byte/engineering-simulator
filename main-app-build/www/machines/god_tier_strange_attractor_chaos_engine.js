import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // -------------------------------------------------------------------------
    // CUSTOM HIGH-TECH MATERIALS
    // -------------------------------------------------------------------------
    const neonCyan = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 
    });
    const neonMagenta = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2.0, metalness: 0.7, roughness: 0.3 
    });
    const neonAmber = new THREE.MeshStandardMaterial({ 
        color: 0xffbf00, emissive: 0xffbf00, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.5 
    });
    const plasmaCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0, transparent: true, opacity: 0.95 
    });
    const holographicPlane = new THREE.MeshStandardMaterial({
        color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 1.0, transparent: true, opacity: 0.2, side: THREE.DoubleSide
    });
    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x111111, metalness: 0.9, roughness: 0.4
    });

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS FOR PROCEDURAL COMPLEX GEOMETRIES
    // -------------------------------------------------------------------------

    function createGear(radius, teeth, thickness, holeRadius, material) {
        const shape = new THREE.Shape();
        const outerRadius = radius;
        const innerRadius = radius * 0.85;
        const angleStep = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const a1 = i * angleStep;
            const a2 = (i + 0.5) * angleStep;
            const a3 = (i + 1) * angleStep;
            if (i === 0) {
                shape.moveTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
            } else {
                shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
            }
            shape.lineTo(Math.cos(a2) * innerRadius, Math.sin(a2) * innerRadius);
            shape.lineTo(Math.cos(a3) * outerRadius, Math.sin(a3) * outerRadius);
        }
        const path = new THREE.Path();
        path.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(path);
        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    function createHydraulicPiston(length, radius, outerMat, innerMat) {
        const pistonGroup = new THREE.Group();
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        outerMesh.position.y = length * 0.3;
        
        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 0.8, 32);
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        innerMesh.position.y = length * 0.6;
        
        const capGeo = new THREE.SphereGeometry(radius * 1.2, 32, 16);
        const cap1 = new THREE.Mesh(capGeo, outerMat);
        cap1.position.y = 0;
        const cap2 = new THREE.Mesh(capGeo, outerMat);
        cap2.position.y = length;

        // Details
        const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.15, 16, 32);
        const ring1 = new THREE.Mesh(ringGeo, steel);
        ring1.rotation.x = Math.PI / 2;
        ring1.position.y = length * 0.55;
        
        pistonGroup.add(outerMesh, innerMesh, cap1, cap2, ring1);
        
        return { group: pistonGroup, extension: innerMesh, topCap: cap2 };
    }

    function createRoboticArm(baseColor) {
        const armGroup = new THREE.Group();
        
        // Base Swivel
        const baseGeo = new THREE.CylinderGeometry(3, 4, 2, 64);
        const baseMesh = new THREE.Mesh(baseGeo, darkAlloy);
        armGroup.add(baseMesh);

        const shoulderJoint = new THREE.Group();
        shoulderJoint.position.y = 1;
        baseMesh.add(shoulderJoint);

        const shoulderGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const shoulderMesh = new THREE.Mesh(shoulderGeo, steel);
        shoulderJoint.add(shoulderMesh);

        // Bicep
        const bicepGroup = new THREE.Group();
        shoulderMesh.add(bicepGroup);
        const bicepGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
        const bicepMesh = new THREE.Mesh(bicepGeo, baseColor);
        bicepMesh.position.y = 5;
        bicepGroup.add(bicepMesh);

        // Elbow
        const elbowJoint = new THREE.Group();
        elbowJoint.position.y = 10;
        bicepGroup.add(elbowJoint);
        const elbowGeo = new THREE.CylinderGeometry(2, 2, 3.5, 32);
        elbowGeo.rotateZ(Math.PI / 2);
        const elbowMesh = new THREE.Mesh(elbowGeo, steel);
        elbowJoint.add(elbowMesh);

        // Forearm
        const forearmGroup = new THREE.Group();
        elbowJoint.add(forearmGroup);
        const forearmGeo = new THREE.CylinderGeometry(1.2, 0.8, 8, 32);
        const forearmMesh = new THREE.Mesh(forearmGeo, baseColor);
        forearmMesh.position.y = 4;
        forearmGroup.add(forearmMesh);

        // Wrist
        const wristJoint = new THREE.Group();
        wristJoint.position.y = 8;
        forearmGroup.add(wristJoint);
        const wristGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const wristMesh = new THREE.Mesh(wristGeo, chrome);
        wristJoint.add(wristMesh);

        // Claw Extractor
        const clawGroup = new THREE.Group();
        wristJoint.add(clawGroup);
        const palmGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
        const palmMesh = new THREE.Mesh(palmGeo, darkAlloy);
        palmMesh.position.y = 0.5;
        clawGroup.add(palmMesh);

        // Fingers
        const fingerGeo = new THREE.ConeGeometry(0.3, 3, 16);
        for(let i=0; i<4; i++) {
            const finger = new THREE.Mesh(fingerGeo, steel);
            const angle = (i * Math.PI) / 2;
            finger.position.set(Math.cos(angle)*0.8, 2, Math.sin(angle)*0.8);
            finger.rotation.x = Math.PI / 6 * (Math.sin(angle) > 0 ? -1 : (Math.sin(angle) < 0 ? 1 : 0));
            finger.rotation.z = Math.PI / 6 * (Math.cos(angle) > 0 ? 1 : (Math.cos(angle) < 0 ? -1 : 0));
            clawGroup.add(finger);
        }

        // Add hydraulic detailing
        const p1 = createHydraulicPiston(8, 0.4, darkSteel, chrome).group;
        p1.position.set(2, 1, 0);
        p1.rotation.z = 0.1;
        shoulderJoint.add(p1);

        return { root: armGroup, baseSwivel: baseMesh, shoulder: shoulderJoint, elbow: elbowJoint, wrist: wristJoint, claw: clawGroup };
    }

    function createCoolingTower(levels, size) {
        const towerGroup = new THREE.Group();
        for (let i = 0; i < levels; i++) {
            const levelSize = size * Math.pow(0.8, i);
            const yOffset = i * size * 0.9;
            const geo = new THREE.BoxGeometry(levelSize, size * 0.8, levelSize);
            const mesh = new THREE.Mesh(geo, aluminum);
            mesh.position.y = yOffset;
            
            // Add cooling fins
            for(let j=0; j<8; j++) {
                const finGeo = new THREE.BoxGeometry(levelSize * 1.5, size * 0.1, 0.1);
                const fin = new THREE.Mesh(finGeo, copper);
                fin.position.y = yOffset + (j - 3.5) * (size * 0.08);
                mesh.add(fin);
            }
            towerGroup.add(mesh);
        }
        return towerGroup;
    }

    // -------------------------------------------------------------------------
    // 1. LORENZ MANIFOLD BASE
    // -------------------------------------------------------------------------
    const baseAssembly = new THREE.Group();
    
    // Main hexagonal foundation
    const hexShape = new THREE.Shape();
    const hexRadius = 45;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        if (i === 0) hexShape.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
        else hexShape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
    }
    hexShape.closePath();
    const baseExtrude = new THREE.ExtrudeGeometry(hexShape, { depth: 4, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 });
    baseExtrude.rotateX(Math.PI / 2);
    const foundationMesh = new THREE.Mesh(baseExtrude, darkSteel);
    foundationMesh.position.y = -20;
    baseAssembly.add(foundationMesh);

    // Tread lines and industrial grating
    const gratingGeo = new THREE.CylinderGeometry(40, 40, 4.5, 64);
    const gratingMesh = new THREE.Mesh(gratingGeo, steel);
    gratingMesh.position.y = -20;
    baseAssembly.add(gratingMesh);

    // Giant Stabilization Legs
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const legGroup = new THREE.Group();
        legGroup.position.set(Math.cos(angle) * 42, -18, Math.sin(angle) * 42);
        legGroup.rotation.y = -angle;

        const strutGeo = new THREE.BoxGeometry(8, 12, 18);
        const strut = new THREE.Mesh(strutGeo, darkAlloy);
        strut.rotation.x = -Math.PI / 4;
        legGroup.add(strut);
        
        const footGeo = new THREE.CylinderGeometry(6, 8, 3, 32);
        const foot = new THREE.Mesh(footGeo, rubber);
        foot.position.set(0, -6, 6);
        legGroup.add(foot);

        const hydro = createHydraulicPiston(10, 1.5, darkSteel, chrome).group;
        hydro.position.set(0, 0, -5);
        hydro.rotation.x = Math.PI / 6;
        legGroup.add(hydro);

        baseAssembly.add(legGroup);
    }
    group.add(baseAssembly);

    parts.push({
        name: 'Lorenz Manifold Base',
        description: 'A massive tri-hexagonal foundation platform designed to absorb the microscopic gravitational fluctuations produced by the chaotic core.',
        material: 'Dark Steel, Industrial Rubber, Titanium Alloy',
        function: 'Stabilization and terrestrial grounding of non-linear resonance.',
        assemblyOrder: 1,
        connections: ['Bifurcation Hydraulics', 'Fractal Cooling Towers', 'Phase Space Containment Field'],
        failureEffect: 'Micro-seismic tremors resulting in complete structural misalignment and quantum decoherence.',
        cascadeFailures: ['Phase Space Containment Field shatter', 'AttractorCore collapse'],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // -------------------------------------------------------------------------
    // 2. PHASE SPACE CONTAINMENT FIELD
    // -------------------------------------------------------------------------
    const containmentGroup = new THREE.Group();
    
    // Main Glass Sphere
    const sphereGeo = new THREE.SphereGeometry(25, 64, 64);
    const sphereMesh = new THREE.Mesh(sphereGeo, glass);
    containmentGroup.add(sphereMesh);

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(24.5, 4);
    const wireMesh = new THREE.LineSegments(
        new THREE.WireframeGeometry(wireGeo),
        new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15 })
    );
    containmentGroup.add(wireMesh);

    // Encasing Torus Knots
    const knotGeo1 = new THREE.TorusKnotGeometry(26, 0.5, 200, 32, 2, 3);
    const knotMesh1 = new THREE.Mesh(knotGeo1, copper);
    containmentGroup.add(knotMesh1);

    const knotGeo2 = new THREE.TorusKnotGeometry(26.5, 0.3, 200, 32, 3, 5);
    const knotMesh2 = new THREE.Mesh(knotGeo2, neonCyan);
    containmentGroup.add(knotMesh2);

    group.add(containmentGroup);

    parts.push({
        name: 'Phase Space Containment Field',
        description: 'A hyper-pressurized, magnetically sealed spherical vacuum that bounds the topological space of the chaotic attractor orbits.',
        material: 'Quantum-laced Glass, Copper, Neon Emitters',
        function: 'Prevents Strange Particles from escaping into standard spacetime geometries.',
        assemblyOrder: 2,
        connections: ['Lorenz Manifold Base', 'Attractor Core Generator'],
        failureEffect: 'Total vacuum decay; particles leak into the local environment causing chaotic molecular transmutation.',
        cascadeFailures: ['Operator Command Deck irradiation', 'Base Platform melting'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });

    // -------------------------------------------------------------------------
    // 3. ATTRACTOR CORE GENERATOR
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.DodecahedronGeometry(3, 2);
    const coreMesh = new THREE.Mesh(coreGeo, plasmaCoreMat);
    coreGroup.add(coreMesh);

    // Surrounding floating shards
    const shardGeo = new THREE.ConeGeometry(0.5, 4, 3);
    for(let i=0; i<12; i++) {
        const shard = new THREE.Mesh(shardGeo, darkSteel);
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        shard.position.setFromSphericalCoords(6, phi, theta);
        shard.lookAt(0,0,0);
        shard.rotateX(-Math.PI/2);
        coreGroup.add(shard);
    }
    group.add(coreGroup);

    parts.push({
        name: 'Attractor Core Generator',
        description: 'A singularity-driven plasma core that injects raw thermal energy into the containment field, seeding the chaotic state space.',
        material: 'Plasma, Dark Steel',
        function: 'Provides the initial conditions (x0, y0, z0) and continuous energy for the non-linear equations.',
        assemblyOrder: 3,
        connections: ['Phase Space Containment Field'],
        failureEffect: 'System stabilizes into a fixed-point equilibrium, generating exactly zero energy.',
        cascadeFailures: ['Energy Extraction Arms halt', 'Non-Linear Computation Banks crash'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // -------------------------------------------------------------------------
    // 4 & 5. STRANGE PARTICLE SWARMS (Lorenz & Rössler)
    // -------------------------------------------------------------------------
    const particleCount = 1000;
    
    // Lorenz Swarm
    const lorenzGeometry = new THREE.BufferGeometry();
    const lorenzPositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) { lorenzPositions[i] = (Math.random() - 0.5) * 10; }
    lorenzGeometry.setAttribute('position', new THREE.BufferAttribute(lorenzPositions, 3));
    const lorenzMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.4, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const lorenzParticles = new THREE.Points(lorenzGeometry, lorenzMaterial);
    containmentGroup.add(lorenzParticles);

    // Roessler Swarm
    const roesslerGeometry = new THREE.BufferGeometry();
    const roesslerPositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) { roesslerPositions[i] = (Math.random() - 0.5) * 10; }
    roesslerGeometry.setAttribute('position', new THREE.BufferAttribute(roesslerPositions, 3));
    const roesslerMaterial = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.3, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const roesslerParticles = new THREE.Points(roesslerGeometry, roesslerMaterial);
    containmentGroup.add(roesslerParticles);

    parts.push({
        name: 'Strange Particle Swarm (Lorenz/Rössler)',
        description: 'Thousands of subatomic exotic particles tracing the exact paths of the Lorenz and Rössler attractors in physical 3D space.',
        material: 'Exotic Matter, Photonic Emissions',
        function: 'Acts as the kinetic fluid of the chaotic engine, carrying momentum through fractal dimensions.',
        assemblyOrder: 4,
        connections: ['Attractor Core Generator'],
        failureEffect: 'Particles coalesce into a limit cycle, releasing massive gamma bursts.',
        cascadeFailures: ['Containment Field rupture'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 0, z: 30}
    });

    // -------------------------------------------------------------------------
    // 6-8. ENERGY EXTRACTION ARMS (Alpha, Beta, Gamma)
    // -------------------------------------------------------------------------
    const arms = [];
    const armConfigs = [
        { name: 'Alpha', angle: 0, color: darkAlloy },
        { name: 'Beta', angle: (Math.PI * 2) / 3, color: steel },
        { name: 'Gamma', angle: (Math.PI * 4) / 3, color: chrome }
    ];

    armConfigs.forEach((cfg, index) => {
        const arm = createRoboticArm(cfg.color);
        arm.root.position.set(Math.cos(cfg.angle) * 30, -5, Math.sin(cfg.angle) * 30);
        arm.root.lookAt(0, -5, 0);
        group.add(arm.root);
        arms.push(arm);

        parts.push({
            name: `Chaotic Energy Extractor Arm ${cfg.name}`,
            description: `A 5-DOF rapid-response kinematic actuator designed to blindly track the densest clusters of the strange attractor and harvest kinetic potential via magnetic induction.`,
            material: 'Steel, Chrome, Dark Alloy',
            function: 'Energy harvesting through chaotic physical interference.',
            assemblyOrder: 5 + index,
            connections: ['Lorenz Manifold Base', 'Deterministic Chaos Conduits'],
            failureEffect: 'Arm enters severe resonant oscillation, tearing itself from the mounting gasket.',
            cascadeFailures: ['Loss of 33% power output', 'Debris damaging the containment field'],
            originalPosition: {x: Math.cos(cfg.angle) * 30, y: -5, z: Math.sin(cfg.angle) * 30},
            explodedPosition: {x: Math.cos(cfg.angle) * 80, y: 20, z: Math.sin(cfg.angle) * 80}
        });
    });

    // -------------------------------------------------------------------------
    // 9. BIFURCATION HYDRAULICS
    // -------------------------------------------------------------------------
    const hydraulicsGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const hydro = createHydraulicPiston(25, 0.8, steel, copper).group;
        hydro.position.set(Math.cos(angle) * 20, -18, Math.sin(angle) * 20);
        hydro.lookAt(0, 0, 0);
        hydro.rotation.x -= Math.PI / 4;
        hydraulicsGroup.add(hydro);
    }
    group.add(hydraulicsGroup);

    parts.push({
        name: 'Bifurcation Hydraulics',
        description: 'Heavy-duty adaptive dampeners that react to sudden period-doubling bifurcations in the system\'s energy output, preventing critical torque sheer.',
        material: 'Steel, Copper, Hydraulic Fluid',
        function: 'Dynamic stress mitigation during non-linear state changes.',
        assemblyOrder: 8,
        connections: ['Lorenz Manifold Base', 'Phase Space Containment Field'],
        failureEffect: 'Rupture sprays hyper-toxic hydraulic fluid, instantly dissolving local wiring.',
        cascadeFailures: ['Sensory Array blindness', 'Arm tracking failure'],
        originalPosition: {x: 0, y: -18, z: 0},
        explodedPosition: {x: 0, y: -40, z: -40}
    });

    // -------------------------------------------------------------------------
    // 10. NON-LINEAR COMPUTATION BANKS
    // -------------------------------------------------------------------------
    const computeGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bank = new THREE.Group();
        
        const tower = new THREE.Mesh(new THREE.BoxGeometry(4, 15, 4), plastic);
        bank.add(tower);

        // Blinking lights
        for(let j=0; j<5; j++) {
            const light = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 0.5), j%2===0 ? neonCyan : neonMagenta);
            light.position.set(0, (j-2)*2, 2);
            bank.add(light);
        }

        bank.position.set(Math.cos(angle) * 35, -5, Math.sin(angle) * 35);
        bank.lookAt(0, -5, 0);
        computeGroup.add(bank);
    }
    group.add(computeGroup);

    parts.push({
        name: 'Non-Linear Computation Banks',
        description: 'Quantum supercomputing clusters running deep neural networks to predict the next short-term trajectory of the chaotic swarm.',
        material: 'Plastic, Silicon, Neon LEDs',
        function: 'Calculates local Lyapunov exponents and provides predictive IK targets for the extraction arms.',
        assemblyOrder: 9,
        connections: ['Lorenz Manifold Base', 'Extraction Arms'],
        failureEffect: 'Loss of predictive capability; arms flail randomly causing massive internal damage.',
        cascadeFailures: ['Arms destroyed', 'Core overheating'],
        originalPosition: {x: 0, y: -5, z: 0},
        explodedPosition: {x: 0, y: 0, z: -60}
    });

    // -------------------------------------------------------------------------
    // 11. RÖSSLER TRACKING RING
    // -------------------------------------------------------------------------
    const roesslerRingGeo = new THREE.TorusGeometry(32, 1, 32, 100);
    const roesslerRingMesh = new THREE.Mesh(roesslerRingGeo, darkSteel);
    roesslerRingMesh.rotation.x = Math.PI / 2;
    
    // Add greebles to ring
    for(let i=0; i<24; i++) {
        const g = new THREE.Mesh(new THREE.BoxGeometry(3,3,3), neonMagenta);
        const angle = (i/24) * Math.PI * 2;
        g.position.set(Math.cos(angle)*32, 0, Math.sin(angle)*32);
        roesslerRingMesh.add(g);
    }
    group.add(roesslerRingMesh);

    parts.push({
        name: 'Rössler Tracking Ring',
        description: 'A magnetically levitated orbital ring that specifically monitors the z-axis fold of the Rössler attractor state space.',
        material: 'Dark Steel, Neon Magenta Emiters',
        function: 'Isolates and measures the continuous topological mixing of the chaotic set.',
        assemblyOrder: 10,
        connections: ['Phase Space Containment Field'],
        failureEffect: 'De-syncs the phase space, causing particles to clip through the containment glass.',
        cascadeFailures: ['Containment Field shatter'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // -------------------------------------------------------------------------
    // 12. FRACTAL COOLING TOWERS
    // -------------------------------------------------------------------------
    const coolingGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const tower = createCoolingTower(4, 10);
        tower.position.set(Math.cos(angle) * 45, -20, Math.sin(angle) * 45);
        coolingGroup.add(tower);
    }
    group.add(coolingGroup);

    parts.push({
        name: 'Fractal Cooling Towers',
        description: 'Extruded heatsinks designed using Menger sponge fractal algorithms to maximize surface area to volume ratio for extreme heat dissipation.',
        material: 'Aluminum, Copper',
        function: 'Dissipates the staggering thermal output of the quantum computers and plasma core.',
        assemblyOrder: 11,
        connections: ['Lorenz Manifold Base', 'Non-Linear Computation Banks'],
        failureEffect: 'Thermal runaway; computation banks melt into slag.',
        cascadeFailures: ['Computation Banks destroyed', 'Predictive IK failure'],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 70, y: 20, z: 70}
    });

    // -------------------------------------------------------------------------
    // 13. LYAPUNOV EXPONENT SENSORS
    // -------------------------------------------------------------------------
    const sensorGroup = new THREE.Group();
    const sensorGeo = new THREE.ConeGeometry(0.5, 10, 8);
    sensorGeo.translate(0, 5, 0);
    sensorGeo.rotateX(Math.PI / 2);
    for(let i=0; i<20; i++) {
        const s = new THREE.Mesh(sensorGeo, chrome);
        const phi = Math.acos(-1 + (2 * i) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        s.position.setFromSphericalCoords(28, phi, theta);
        s.lookAt(0,0,0);
        sensorGroup.add(s);
    }
    group.add(sensorGroup);

    parts.push({
        name: 'Lyapunov Exponent Sensors',
        description: 'Highly sensitive interferometers measuring the exponential divergence of infinitesimally close trajectories within the containment core.',
        material: 'Chrome, Quantum Optics',
        function: 'Quantifies the exact degree of chaos (lambda > 0) in real-time.',
        assemblyOrder: 12,
        connections: ['Phase Space Containment Field'],
        failureEffect: 'Engine cannot distinguish between deterministic chaos and sheer random noise.',
        cascadeFailures: ['Energy extraction efficiency drops to 0%'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 50}
    });

    // -------------------------------------------------------------------------
    // 14. POINCARE SECTION PROJECTOR
    // -------------------------------------------------------------------------
    const poincareGeo = new THREE.PlaneGeometry(60, 60);
    const poincareMesh = new THREE.Mesh(poincareGeo, holographicPlane);
    poincareMesh.rotation.x = Math.PI / 2;
    group.add(poincareMesh);

    parts.push({
        name: 'Poincaré Section Projector',
        description: 'Projects a trans-dimensional intersecting holographic plane through the state space to reduce the 3D continuous dynamics to a 2D discrete map.',
        material: 'Holographic Emitters, Photonic Gas',
        function: 'Visual and mathematical diagnostic tool for observing the folding geometry of the strange attractor.',
        assemblyOrder: 13,
        connections: ['Phase Space Containment Field', 'Operator Command Deck'],
        failureEffect: 'Loss of visual diagnostic capabilities for operators.',
        cascadeFailures: ['None (Auxiliary System)'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    // -------------------------------------------------------------------------
    // 15. DETERMINISTIC CHAOS CONDUITS
    // -------------------------------------------------------------------------
    const conduitGroup = new THREE.Group();
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t) * 0.5;
            const tz = Math.cos(2 * Math.PI * t) * 0.5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    for(let i=0; i<10; i++) {
        const path = new CustomSinCurve(20);
        const tubeGeo = new THREE.TubeGeometry(path, 64, 0.5, 8, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        tube.position.set(0, -10 + i, (i-5)*3);
        tube.rotation.y = i * 0.3;
        conduitGroup.add(tube);
    }
    group.add(conduitGroup);

    parts.push({
        name: 'Deterministic Chaos Conduits',
        description: 'Tangled, pseudo-randomly routed superconducting cables that transport the raw extracted energy, purposely designed with no straight lines to prevent inductive harmonic feedback.',
        material: 'Copper, Graphene Insulation',
        function: 'Power transmission from Arms to main grid.',
        assemblyOrder: 14,
        connections: ['Extraction Arms', 'Lorenz Manifold Base'],
        failureEffect: 'Inductive feedback loops explode the conduits, severing power.',
        cascadeFailures: ['Complete system blackout'],
        originalPosition: {x: 0, y: -5, z: 0},
        explodedPosition: {x: -50, y: -20, z: 0}
    });

    // -------------------------------------------------------------------------
    // 16. OPERATOR COMMAND DECK
    // -------------------------------------------------------------------------
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 35, 45);
    
    const floor = new THREE.Mesh(new THREE.BoxGeometry(40, 2, 20), steel);
    deckGroup.add(floor);
    
    const windowShape = new THREE.Shape();
    windowShape.moveTo(-20, 0);
    windowShape.lineTo(20, 0);
    windowShape.lineTo(15, 10);
    windowShape.lineTo(-15, 10);
    windowShape.lineTo(-20, 0);
    const windowExtrude = new THREE.ExtrudeGeometry(windowShape, { depth: 0.5, bevelEnabled: false });
    const windowMesh = new THREE.Mesh(windowExtrude, tinted);
    windowMesh.position.set(0, 1, -10);
    windowMesh.rotation.x = -0.2;
    deckGroup.add(windowMesh);

    // Consoles
    for(let i=0; i<3; i++) {
        const desk = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 3), darkAlloy);
        desk.position.set((i-1)*10, 3, -5);
        const screen = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.2), neonCyan);
        screen.position.set(0, 2.5, -1);
        screen.rotation.x = 0.2;
        desk.add(screen);
        deckGroup.add(desk);
    }
    deckGroup.lookAt(0,0,0);
    group.add(deckGroup);

    parts.push({
        name: 'Operator Command Deck',
        description: 'A heavily shielded, vibration-dampened control room where PhD mathematicians monitor the bifurcation diagrams and tune the system parameters in real-time.',
        material: 'Steel, Tinted Lead Glass, Titanium',
        function: 'Human-in-the-loop oversight and parameter tuning (sigma, rho, beta).',
        assemblyOrder: 15,
        connections: ['Lorenz Manifold Base (via external elevator)'],
        failureEffect: 'Loss of human tuning capabilities; AI fallback engages.',
        cascadeFailures: ['Potential AI miscalculation of bifurcation points'],
        originalPosition: {x: 0, y: 35, z: 45},
        explodedPosition: {x: 0, y: 100, z: 100}
    });

    // -------------------------------------------------------------------------
    // 17. QUANTUM MANIFOLD RING
    // -------------------------------------------------------------------------
    const qRingGeo = new THREE.TorusGeometry(55, 3, 64, 128);
    const qRingMesh = new THREE.Mesh(qRingGeo, darkAlloy);
    
    // Add glowing tracks
    const trackGeo = new THREE.TorusGeometry(55.2, 0.5, 16, 128);
    const trackMesh = new THREE.Mesh(trackGeo, neonAmber);
    qRingMesh.add(trackMesh);
    
    group.add(qRingMesh);

    parts.push({
        name: 'Quantum Manifold Ring',
        description: 'A colossal, multi-axis spinning gyroscope that generates a macroscopic quantum coherence field, allowing the macroscopic mechanical arms to interact with subatomic particle states without collapsing their wavefunctions.',
        material: 'Dark Alloy, Superconducting Amber Emitters',
        function: 'Bridges classical mechanics and quantum chaos.',
        assemblyOrder: 16,
        connections: ['Lorenz Manifold Base'],
        failureEffect: 'Wavefunction collapse; the strange particles instantly materialize as highly radioactive solid dust.',
        cascadeFailures: ['Fatal system irradiation', 'Complete engine destruction'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 120}
    });

    // -------------------------------------------------------------------------
    // MATH & ANIMATION STATE SETUP
    // -------------------------------------------------------------------------

    // Lorenz Math State
    let l_sigma = 10.0;
    let l_rho = 28.0;
    let l_beta = 8.0 / 3.0;
    const l_dt = 0.005;
    const lorenzStates = [];
    for(let i=0; i<particleCount; i++) {
        lorenzStates.push({
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 20 + 25
        });
    }

    // Roessler Math State
    let r_a = 0.2;
    let r_b = 0.2;
    let r_c = 5.7;
    const r_dt = 0.05;
    const roesslerStates = [];
    for(let i=0; i<particleCount; i++) {
        roesslerStates.push({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 10
        });
    }

    // Arm Target Points
    const targetPoints = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "Explain the significance of the Lyapunov exponent in characterizing the Strange Attractor Chaos Engine's dynamic stability.",
            options: [
                "A positive exponent indicates exponential divergence of trajectories, confirming the presence of deterministic chaos and ensuring continuous energy generation.",
                "A negative exponent guarantees that the system will infinitely generate power without friction.",
                "The Lyapunov exponent measures the structural integrity of the steel base platform.",
                "It calculates the exact time the engine will run out of fuel."
            ],
            correctAnswerIndex: 0,
            explanation: "In non-linear dynamics, a positive maximal Lyapunov exponent is the defining mathematical signature of chaos, meaning infinitesimally close trajectories diverge exponentially, which this engine harnesses for continuous, non-repeating motion."
        },
        {
            question: "How does the Poincare Section Projector assist operators in diagnosing the quasi-periodic orbit of a particle within the Lorenz manifold?",
            options: [
                "It freezes time completely so operators can manually count the particles.",
                "It reduces the 3D continuous flow into a 2D discrete map, making the fractal folding geometry and structural stability of the attractor visible and analyzable.",
                "It projects a 3D hologram of the engine's external hull for aesthetic purposes.",
                "It generates a magnetic shield to protect the glass."
            ],
            correctAnswerIndex: 1,
            explanation: "A Poincaré section intersects the continuous trajectory of a dynamical system in state space, transforming a complex 3D continuous system into a simpler 2D discrete system, revealing its underlying fractal structure."
        },
        {
            question: "Discuss the implications of Feigenbaum constants when the system undergoes a period-doubling bifurcation sequence due to thermal stress.",
            options: [
                "The Feigenbaum constants dictate the exact color the neon lights will turn.",
                "They predict the universal rate at which bifurcations crowd together as the control parameter approaches the onset of chaos, allowing predictive mitigation.",
                "They are used to calculate the physical weight of the fractal cooling towers.",
                "They ensure the glass sphere remains perfectly transparent."
            ],
            correctAnswerIndex: 1,
            explanation: "Feigenbaum constants (delta approx 4.669) are universal limits in bifurcation diagrams. They allow the Non-Linear Computation Banks to predict exactly when the system will transition from regular periodic orbits into full chaos as thermal parameters increase."
        },
        {
            question: "If the Rössler Tracking Ring experiences a saddle-node bifurcation, what immediate topological failure occurs?",
            options: [
                "The engine instantly explodes in a nuclear fireball.",
                "Two fixed points (a stable node and an unstable saddle) collide and annihilate, destroying a stable periodic orbit and drastically altering the attractor's topology.",
                "The ring begins to spin in the opposite direction.",
                "The holographic projector turns off."
            ],
            correctAnswerIndex: 1,
            explanation: "A saddle-node bifurcation is a local bifurcation where two equilibria collide and annihilate each other. In the context of a strange attractor, this can destroy stable manifolds, radically shifting the system's dynamics."
        },
        {
            question: "Describe the topological structure of the chaotic energy flows in terms of fractal dimension, specifically addressing the Hausdorff dimension.",
            options: [
                "It is exactly 3.0, filling the entire sphere perfectly like a solid block of water.",
                "It is a non-integer value strictly greater than its topological dimension (approx 2.06 for Lorenz), reflecting its infinitely detailed, infinitely thin folded layer structure.",
                "It is a 1-dimensional straight line bouncing between walls.",
                "The Hausdorff dimension is equal to the number of cooling towers (4)."
            ],
            correctAnswerIndex: 1,
            explanation: "Strange attractors possess fractal structures. Their Hausdorff dimension is typically non-integer (e.g., ~2.06 for the classic Lorenz attractor), representing a surface that is more than a 2D plane but less than a solid 3D volume, achieved through infinite folding and stretching."
        }
    ];

    // -------------------------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // -------------------------------------------------------------------------
    const animate = (time, speed, meshes) => {
        const timeMod = time * speed;

        // 1. Update Lorenz Particles (Runge-Kutta approximation via Euler for performance)
        const lPositions = lorenzParticles.geometry.attributes.position.array;
        let lCenter = new THREE.Vector3();
        for(let i=0; i<particleCount; i++) {
            let p = lorenzStates[i];
            
            let dx = l_sigma * (p.y - p.x);
            let dy = p.x * (l_rho - p.z) - p.y;
            let dz = p.x * p.y - l_beta * p.z;

            p.x += dx * l_dt * speed;
            p.y += dy * l_dt * speed;
            p.z += dz * l_dt * speed;

            // Scale and map to 3D space (centering z)
            const sx = p.x * 0.5;
            const sy = p.y * 0.5;
            const sz = (p.z - 28) * 0.5;

            lPositions[i*3] = sx;
            lPositions[i*3+1] = sy;
            lPositions[i*3+2] = sz;

            if (i < 3) targetPoints[0].set(sx, sy, sz); // Simplistic target acquisition for Arm Alpha
        }
        lorenzParticles.geometry.attributes.position.needsUpdate = true;
        lorenzParticles.rotation.y = timeMod * 0.1;

        // 2. Update Roessler Particles
        const rPositions = roesslerParticles.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            let p = roesslerStates[i];
            
            let dx = -(p.y + p.z);
            let dy = p.x + r_a * p.y;
            let dz = r_b + p.z * (p.x - r_c);

            p.x += dx * r_dt * speed;
            p.y += dy * r_dt * speed;
            p.z += dz * r_dt * speed;

            // Prevent explosion in Roessler calculation by bounding
            if(p.x > 50 || p.x < -50 || isNaN(p.x)) p.x = (Math.random() - 0.5) * 10;
            if(p.y > 50 || p.y < -50 || isNaN(p.y)) p.y = (Math.random() - 0.5) * 10;
            if(p.z > 50 || p.z < -50 || isNaN(p.z)) p.z = (Math.random() - 0.5) * 10;

            const sx = p.x * 0.8;
            const sy = p.y * 0.8;
            const sz = p.z * 0.8;

            rPositions[i*3] = sx;
            rPositions[i*3+1] = sy;
            rPositions[i*3+2] = sz;

            if (i >= 3 && i < 6) {
                targetPoints[1].set(sx, sy, sz);
                targetPoints[2].set(-sx, -sy, -sz); // Gamma tracks mirror opposite
            }
        }
        roesslerParticles.geometry.attributes.position.needsUpdate = true;
        roesslerParticles.rotation.x = timeMod * 0.15;
        roesslerParticles.rotation.z = timeMod * 0.05;

        // 3. Animate Rings and Fields
        containmentGroup.children[2].rotation.x = timeMod * 0.5; // Torus knot 1
        containmentGroup.children[2].rotation.y = timeMod * 0.3;
        containmentGroup.children[3].rotation.x = -timeMod * 0.4; // Torus knot 2
        containmentGroup.children[3].rotation.z = timeMod * 0.6;

        roesslerRingMesh.rotation.z = timeMod * 1.5;
        qRingMesh.rotation.x = timeMod * 0.2;
        qRingMesh.rotation.y = timeMod * 0.4;
        qRingMesh.rotation.z = timeMod * 0.1;

        coreMesh.rotation.y = timeMod * 5;
        coreMesh.scale.setScalar(1 + Math.sin(timeMod * 10) * 0.1);

        // 4. Poincare Hologram Pulsing
        poincareMesh.position.y = Math.sin(timeMod) * 15;
        poincareMesh.material.opacity = 0.2 + Math.sin(timeMod * 5) * 0.1;

        // 5. Procedural IK Animation for Extraction Arms
        arms.forEach((arm, idx) => {
            // Very simplified pseudo-IK logic to simulate chaotic tracking
            const target = targetPoints[idx];
            
            // Base Swivel looks towards target horizontally
            const dx = target.x - arm.root.position.x;
            const dz = target.z - arm.root.position.z;
            const targetAngle = Math.atan2(dx, dz);
            arm.baseSwivel.rotation.y = THREE.MathUtils.lerp(arm.baseSwivel.rotation.y, targetAngle, 0.1 * speed);

            // Shoulder, Elbow, Wrist articulation based on noise/sine to simulate chaotic snapping
            arm.shoulder.rotation.x = Math.sin(timeMod * 3 + idx) * 0.5 + 0.5;
            arm.elbow.rotation.x = Math.cos(timeMod * 4 + idx * 2) * 0.5 - 0.5;
            arm.wrist.rotation.x = Math.sin(timeMod * 8 + idx) * 0.8;
            arm.wrist.rotation.z = Math.cos(timeMod * 7 + idx) * 0.8;

            // Claw snapping
            const snap = (Math.sin(timeMod * 15 + idx) > 0.8) ? 0.5 : 0;
            arm.claw.children.forEach((finger, fIdx) => {
                if(fIdx > 0) { // skip palm
                    finger.rotation.x = THREE.MathUtils.lerp(finger.rotation.x, Math.PI / 6 * (Math.sin(fIdx * Math.PI/2)>0 ? -1 : 1) - snap, 0.2);
                }
            });
        });
        
        // 6. Hydraulics Pumping
        hydraulicsGroup.children.forEach((hydro, idx) => {
            const ext = hydro.children[1]; // innerMesh
            const cap = hydro.children[3]; // topCap
            const offset = Math.sin(timeMod * 5 + idx) * 2;
            ext.position.y = 15 + offset; // base length 25 * 0.6 = 15
            cap.position.y = 25 + offset * 1.5;
        });

        // 7. Compute Banks Blinking
        computeGroup.children.forEach((bank, idx) => {
            bank.children.forEach((child, cIdx) => {
                if(cIdx > 0) { // lights
                    child.material.emissiveIntensity = (Math.random() > 0.8) ? 3 : 0.5;
                }
            });
        });
    };

    return {
        group,
        parts,
        description: "The Ultra God Tier Strange Attractor Chaos Engine. A monstrous, hyper-complex machine designed to physically instantiate, contain, and extract usable kinetic energy from the chaotic topological state spaces defined by the Lorenz and Rössler non-linear differential equations. It is an awe-inspiring marvel of quantum mechanics, non-linear dynamics, and extreme heavy engineering.",
        quizQuestions,
        animate
    };
}
