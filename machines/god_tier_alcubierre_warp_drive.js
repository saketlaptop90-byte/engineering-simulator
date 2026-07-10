import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM ADVANCED MATERIALS ---
    const exoticMatterMat = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x440099,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044aa,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff1100,
        emissive: 0xaa0000,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const intenseNeonBlue = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const intenseNeonPurple = new THREE.MeshBasicMaterial({ color: 0xff00ff });

    const hullMaterial = chrome.clone();
    hullMaterial.metalness = 0.9;
    hullMaterial.roughness = 0.2;
    hullMaterial.color = new THREE.Color(0xaaaaaa);

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.3,
        bumpScale: 0.05
    });

    const darkAlloy = darkSteel.clone();
    darkAlloy.metalness = 0.8;
    darkAlloy.roughness = 0.6;

    // --- PROCEDURAL CHASSIS GENERATION (LATHE) ---
    // The main fuselage of the starship, shaped to minimize cross-sectional drag in the quantum vacuum
    const chassisGroup = new THREE.Group();
    const chassisPoints = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const x = t * 300 - 150; // length from -150 to 150
        // Complex aerodynamic curve for the hull
        let y = 0;
        if (t < 0.1) y = Math.sin(t * 10 * Math.PI / 2) * 10;
        else if (t < 0.8) y = 10 + Math.sin((t - 0.1) * Math.PI / 0.7) * 8;
        else y = 10 - ((t - 0.8) * 50) * 0.4;
        y = Math.max(1, y);
        // Add ribbed details
        if (i % 5 === 0 && t > 0.2 && t < 0.7) y += 1.5;
        chassisPoints.push(new THREE.Vector2(y, x));
    }
    const chassisGeo = new THREE.LatheGeometry(chassisPoints, 128);
    const chassisMesh = new THREE.Mesh(chassisGeo, hullMaterial);
    chassisMesh.rotation.z = Math.PI / 2;
    chassisGroup.add(chassisMesh);

    parts.push({
        name: "Central Fuselage & Crew Habitat",
        description: "The primary chassis of the vessel, heavily shielded against Hawking radiation and blue-shifted cosmic rays. Contains the crew quarters, command bridge, and life support systems.",
        material: "Chrome / Hull Material",
        function: "Houses all sensitive equipment and crew in a localized flat-spacetime bubble.",
        assemblyOrder: 1,
        connections: ["Warp Struts", "Deflector Dish", "Antimatter Core"],
        failureEffect: "Exposure to intense Hawking radiation and immediate crew vaporization.",
        cascadeFailures: ["Life Support", "Command Bridge", "Navigation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 },
        mesh: chassisGroup
    });
    group.add(chassisGroup);

    // --- MASSIVE EXOTIC MATTER RINGS ---
    // Forward Ring
    const ring1Group = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(80, 8, 64, 256);
    const ring1Mesh = new THREE.Mesh(ringGeo, darkAlloy);
    
    // Add intricate details to the ring
    const ringDetailsGeo = new THREE.CylinderGeometry(10, 10, 20, 32);
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const detailMesh = new THREE.Mesh(ringDetailsGeo, copper);
        detailMesh.position.set(Math.cos(angle) * 80, Math.sin(angle) * 80, 0);
        detailMesh.rotation.z = angle + Math.PI / 2;
        ring1Mesh.add(detailMesh);

        // Add glowing injectors
        const injectorGeo = new THREE.CylinderGeometry(2, 2, 24, 16);
        const injectorMesh = new THREE.Mesh(injectorGeo, intenseNeonPurple);
        injectorMesh.position.set(Math.cos(angle) * 80, Math.sin(angle) * 80, 0);
        injectorMesh.rotation.z = angle + Math.PI / 2;
        ring1Mesh.add(injectorMesh);
    }
    ring1Group.add(ring1Mesh);
    ring1Group.position.set(0, 0, 75); // Forward

    parts.push({
        name: "Forward Exotic Matter Ring (Spacetime Compressor)",
        description: "A colossal torus composed of super-dense metamaterials and superconducting magnets. Injects negative energy to contract spacetime ahead of the vessel.",
        material: "Dark Steel / Copper / Neon Purple",
        function: "Compresses spacetime in the forward vector, generating the 'downhill' portion of the warp metric.",
        assemblyOrder: 2,
        connections: ["Central Fuselage", "Negative Energy Injectors", "Warp Struts"],
        failureEffect: "Spacetime compression ceases. Vessel violently drops out of warp, emitting a devastating gamma-ray burst.",
        cascadeFailures: ["Warp Bubble Collapse", "Structural Integrity Loss"],
        originalPosition: { x: 0, y: 0, z: 75 },
        explodedPosition: { x: 0, y: 200, z: 150 },
        mesh: ring1Group
    });
    group.add(ring1Group);

    // Aft Ring
    const ring2Group = ring1Group.clone();
    ring2Group.position.set(0, 0, -75); // Aft
    
    // Change injector colors for the aft ring to indicate expansion
    ring2Group.children[0].children.forEach((child, index) => {
        if (child.material === intenseNeonPurple) {
            const mat = intenseNeonBlue.clone();
            child.material = mat;
        }
    });

    parts.push({
        name: "Aft Exotic Matter Ring (Spacetime Expander)",
        description: "The twin to the forward ring, this structure injects positive and negative energy fields to expand spacetime behind the vessel.",
        material: "Dark Steel / Copper / Neon Blue",
        function: "Expands spacetime in the aft vector, pushing the vessel forward continuously without local acceleration.",
        assemblyOrder: 3,
        connections: ["Central Fuselage", "Negative Energy Injectors", "Warp Struts"],
        failureEffect: "Vessel becomes trapped in a compressed spacetime state, potentially forming a micro-singularity.",
        cascadeFailures: ["Warp Bubble Collapse", "Sublight Thruster Destruction"],
        originalPosition: { x: 0, y: 0, z: -75 },
        explodedPosition: { x: 0, y: -200, z: -150 },
        mesh: ring2Group
    });
    group.add(ring2Group);

    // --- WARP RING SUPPORT STRUTS ---
    const strutGroup = new THREE.Group();
    const strutGeo = new THREE.CylinderGeometry(2, 4, 110, 32);
    // Forward struts
    for(let i=0; i<8; i++){
        const angle = (i/8) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeo, steel);
        // Connect chassis to ring at radius 80, z 75
        // Chassis radius at z=75 is roughly 10
        strut.position.set(Math.cos(angle)*45, Math.sin(angle)*45, 37.5);
        strut.lookAt(new THREE.Vector3(Math.cos(angle)*80, Math.sin(angle)*80, 75));
        strut.rotateX(Math.PI/2);
        strutGroup.add(strut);
    }
    // Aft struts
    for(let i=0; i<8; i++){
        const angle = (i/8) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.position.set(Math.cos(angle)*45, Math.sin(angle)*45, -37.5);
        strut.lookAt(new THREE.Vector3(Math.cos(angle)*80, Math.sin(angle)*80, -75));
        strut.rotateX(Math.PI/2);
        strutGroup.add(strut);
    }

    parts.push({
        name: "Warp Coil Support Lattice",
        description: "High-tensile, carbon-nanotube reinforced structural struts. Transfers immense shearing forces generated by the warp metric to the main chassis.",
        material: "Steel",
        function: "Structural support and power routing to the warp rings.",
        assemblyOrder: 4,
        connections: ["Forward Exotic Matter Ring", "Aft Exotic Matter Ring", "Central Fuselage"],
        failureEffect: "Rings shear off from the chassis, completely obliterating the ship as it falls out of the warp bubble unevenly.",
        cascadeFailures: ["Complete Vessel Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 0 },
        mesh: strutGroup
    });
    group.add(strutGroup);

    // --- FORWARD NAVIGATIONAL DEFLECTOR ---
    const deflectorGroup = new THREE.Group();
    
    // Outer Dish
    const dishGeo = new THREE.SphereGeometry(25, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4);
    const dishMesh = new THREE.Mesh(dishGeo, darkAlloy);
    dishMesh.rotation.x = -Math.PI / 2;
    dishMesh.position.z = 140;
    deflectorGroup.add(dishMesh);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
    const coreMesh = new THREE.Mesh(coreGeo, glowingBlue);
    coreMesh.rotation.x = -Math.PI / 2;
    coreMesh.position.z = 145;
    deflectorGroup.add(coreMesh);

    // Antenna array
    const antennaBaseGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
    const antennaBase = new THREE.Mesh(antennaBaseGeo, steel);
    antennaBase.rotation.x = Math.PI / 2;
    antennaBase.position.z = 160;
    deflectorGroup.add(antennaBase);

    for(let i=0; i<4; i++){
        const prongGeo = new THREE.CylinderGeometry(0.5, 0.5, 30, 8);
        const prong = new THREE.Mesh(prongGeo, chrome);
        prong.position.set(Math.cos(i * Math.PI/2) * 5, Math.sin(i * Math.PI/2) * 5, 175);
        prong.rotation.x = Math.PI / 2;
        deflectorGroup.add(prong);
    }

    parts.push({
        name: "Navigational Deflector Array",
        description: "Generates powerful electromagnetic and gravimetric fields to clear interstellar dust, micro-meteoroids, and quantum foam fluctuations from the vessel's path.",
        material: "Dark Alloy / Glowing Blue / Chrome",
        function: "Path clearing and forward sensor array at supraluminal velocities.",
        assemblyOrder: 5,
        connections: ["Central Fuselage", "Sensor Relays"],
        failureEffect: "Impact with single hydrogen atom at Warp 9 causes catastrophic explosive decompression.",
        cascadeFailures: ["Forward Sensors", "Hull Integrity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 250 },
        mesh: deflectorGroup
    });
    group.add(deflectorGroup);

    // --- ANTIMATTER ANNIHILATION CORE ---
    const coreGroup = new THREE.Group();
    // Glass containment sphere
    const containmentGeo = new THREE.SphereGeometry(18, 64, 64);
    const containmentMesh = new THREE.Mesh(containmentGeo, glass);
    coreGroup.add(containmentMesh);

    // Swirling energy (represented by complex nested toruses)
    const energyGeo1 = new THREE.TorusKnotGeometry(10, 2, 100, 16);
    const energyMesh1 = new THREE.Mesh(energyGeo1, glowingRed);
    coreGroup.add(energyMesh1);

    const energyGeo2 = new THREE.TorusKnotGeometry(12, 1.5, 100, 16, 3, 4);
    const energyMesh2 = new THREE.Mesh(energyGeo2, glowingBlue);
    energyMesh2.rotation.y = Math.PI / 2;
    coreGroup.add(energyMesh2);

    coreGroup.position.set(0, 0, -20);

    parts.push({
        name: "Matter-Antimatter Annihilation Reactor",
        description: "The beating heart of the starship. Annihilates antideuterium and deuterium moderated by dilithium/exotic crystals to generate the terawatts needed for the warp coils.",
        material: "Glass / Plasma",
        function: "Primary power generation.",
        assemblyOrder: 6,
        connections: ["Power Transfer Conduits", "Coolant Radiators", "Exotic Matter Injectors"],
        failureEffect: "Containment loss results in a localized supernova-level explosion.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: -20 },
        explodedPosition: { x: 0, y: -150, z: 0 },
        mesh: coreGroup
    });
    group.add(coreGroup);

    // --- COOLANT RADIATOR PANELS ---
    const radiatorGroup = new THREE.Group();
    const radiatorGeo = new THREE.BoxGeometry(40, 2, 120);
    // Create 4 massive fins extending from the aft section
    for(let i=0; i<4; i++){
        const angle = (i * Math.PI) / 2 + Math.PI/4;
        const panel = new THREE.Mesh(radiatorGeo, glowingRed); // Red hot
        
        // Add metallic framing to panel
        const frameGeo = new THREE.BoxGeometry(42, 4, 122);
        const frame = new THREE.Mesh(frameGeo, darkAlloy);
        panel.add(frame);
        
        // Add pipes
        const pipeGeo = new THREE.CylinderGeometry(1, 1, 120, 8);
        for(let p=-15; p<=15; p+=5) {
            const pipe = new THREE.Mesh(pipeGeo, copper);
            pipe.position.set(p, 0, 0);
            pipe.rotation.x = Math.PI/2;
            panel.add(pipe);
        }

        panel.position.set(Math.cos(angle) * 35, Math.sin(angle) * 35, -80);
        panel.rotation.z = angle;
        radiatorGroup.add(panel);
    }

    parts.push({
        name: "Graphene-Isotope Heat Radiators",
        description: "Dissipates the immense waste heat generated by the matter-antimatter reaction and exotic matter conversion. Emits primarily in the infrared and visible red spectrum.",
        material: "Dark Alloy / Glowing Red / Copper",
        function: "Thermal regulation of the engineering hull.",
        assemblyOrder: 7,
        connections: ["Annihilation Reactor", "Coolant Pumps"],
        failureEffect: "Reactor overheating and subsequent core breach.",
        cascadeFailures: ["Annihilation Core", "Main Power"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: 0, z: -200 },
        mesh: radiatorGroup
    });
    group.add(radiatorGroup);

    // --- SUBLIGHT IMPULSE ENGINES ---
    const sublightGroup = new THREE.Group();
    const engineBodyGeo = new THREE.CylinderGeometry(8, 12, 40, 32);
    const nozzleGeo = new THREE.CylinderGeometry(12, 6, 15, 32, 1, true);
    
    for(let i=0; i<2; i++){
        const engine = new THREE.Group();
        const body = new THREE.Mesh(engineBodyGeo, steel);
        body.rotation.x = Math.PI/2;
        
        const nozzle = new THREE.Mesh(nozzleGeo, darkAlloy);
        nozzle.position.z = -25;
        nozzle.rotation.x = Math.PI/2;
        
        // Glow inside nozzle
        const exhaustGeo = new THREE.SphereGeometry(5, 16, 16);
        const exhaust = new THREE.Mesh(exhaustGeo, intenseNeonBlue);
        exhaust.position.z = -30;
        
        engine.add(body);
        engine.add(nozzle);
        engine.add(exhaust);
        
        engine.position.set(i === 0 ? -25 : 25, 15, -130);
        sublightGroup.add(engine);
    }

    parts.push({
        name: "Fusion Impulse Engines",
        description: "Deuterium-powered fusion rockets for sublight maneuvering and orbital insertions. Uses highly directed plasma exhaust.",
        material: "Steel / Dark Alloy / Neon Blue",
        function: "Provides Newtonian thrust when the warp drive is offline.",
        assemblyOrder: 8,
        connections: ["Central Fuselage", "Deuterium Tanks"],
        failureEffect: "Loss of sublight maneuverability.",
        cascadeFailures: ["Orbital Navigation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: -300 },
        mesh: sublightGroup
    });
    group.add(sublightGroup);

    // --- ANTIMATTER STORAGE PODS ---
    const storageGroup = new THREE.Group();
    const podGeo = new THREE.CapsuleGeometry(4, 15, 16, 32);
    for(let i=0; i<6; i++){
        const angle = (i/6) * Math.PI * 2;
        const pod = new THREE.Mesh(podGeo, goldFoil);
        pod.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20, -50);
        pod.rotation.x = Math.PI/2;
        
        // Add magnetic containment rings
        const magRingGeo = new THREE.TorusGeometry(4.5, 0.5, 16, 32);
        const ring1 = new THREE.Mesh(magRingGeo, chrome);
        ring1.position.y = 5;
        pod.add(ring1);
        const ring2 = new THREE.Mesh(magRingGeo, chrome);
        ring2.position.y = -5;
        pod.add(ring2);

        storageGroup.add(pod);
    }

    parts.push({
        name: "Antideuterium Cryo-Pods",
        description: "Heavily shielded, magnetically suspended pods holding liquid antideuterium. Wrapped in gold foil for thermal reflection.",
        material: "Gold Foil / Chrome",
        function: "Stores antimatter fuel.",
        assemblyOrder: 9,
        connections: ["Annihilation Reactor", "Magnetic Containment Fields"],
        failureEffect: "Antimatter contacts pod walls. Immediate, non-survivable ship destruction.",
        cascadeFailures: ["Total"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -250, z: -50 },
        mesh: storageGroup
    });
    group.add(storageGroup);

    // --- HYDRAULIC/PLASMA MANIFOLDS ---
    const manifoldGroup = new THREE.Group();
    class CustomCurve extends THREE.Curve {
        constructor(scale = 1, offset = 0) {
            super();
            this.scale = scale;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = Math.cos(t * Math.PI * 4 + this.offset) * 12;
            const y = Math.sin(t * Math.PI * 4 + this.offset) * 12;
            const z = (t * 200) - 100;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    for(let i=0; i<4; i++){
        const path = new CustomCurve(1, i * Math.PI/2);
        const tubeGeo = new THREE.TubeGeometry(path, 200, 1.5, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, copper);
        manifoldGroup.add(tubeMesh);
    }

    parts.push({
        name: "Exotic Plasma Conduits",
        description: "Spiraling conduits that transfer super-heated plasma and negative energy fluid from the reactor to the warp rings.",
        material: "Copper",
        function: "Energy distribution.",
        assemblyOrder: 10,
        connections: ["Annihilation Reactor", "Warp Rings"],
        failureEffect: "Plasma leakage causing severe hull melting and localized gravitational anomalies.",
        cascadeFailures: ["Warp Rings", "Hull Integrity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: -150, z: 0 },
        mesh: manifoldGroup
    });
    group.add(manifoldGroup);

    // --- COMMAND BRIDGE & OBSERVATION DECK ---
    const bridgeGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    domeMesh.position.set(0, 18, 50);
    
    // Add inner details
    const consoleGeo = new THREE.CylinderGeometry(4, 4, 1, 16);
    const consoleMesh = new THREE.Mesh(consoleGeo, steel);
    consoleMesh.position.set(0, 18, 50);
    bridgeGroup.add(consoleMesh);
    bridgeGroup.add(domeMesh);

    parts.push({
        name: "Command Bridge & Astrometrics",
        description: "The nerve center of the ship. Features heavily tinted transparent aluminum viewports and holographic control interfaces.",
        material: "Tinted Glass / Steel",
        function: "Vessel command, navigation, and crew coordination.",
        assemblyOrder: 11,
        connections: ["Central Fuselage", "Life Support"],
        failureEffect: "Loss of vessel control.",
        cascadeFailures: ["Navigation", "Communications"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 50 },
        mesh: bridgeGroup
    });
    group.add(bridgeGroup);

    // --- SPACETIME METRIC VISUALIZATION (THE WARP BUBBLE) ---
    // This represents the Alcubierre spacetime geometry.
    // We create a massive mesh of lines to visualize the expansion/contraction.
    const gridGroup = new THREE.Group();
    const gridSize = 40;
    const gridSpacing = 8;
    const gridPointsGeo = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    // Create a 3D grid of points
    for(let x = -gridSize; x <= gridSize; x++){
        for(let y = -gridSize; y <= gridSize; y++){
            for(let z = -gridSize; z <= gridSize; z++){
                // Skip inner core to not obscure the ship too much
                if (Math.abs(x) < 5 && Math.abs(y) < 5 && Math.abs(z) < 15) continue;
                
                let px = x * gridSpacing;
                let py = y * gridSpacing;
                let pz = z * gridSpacing;
                vertices.push(px, py, pz);
                
                // Color based on Z position (Blue shift front, Red shift back)
                let r = z < 0 ? 1.0 : 0.2;
                let g = 0.2;
                let b = z > 0 ? 1.0 : 0.2;
                
                // Intensity based on distance from center
                let dist = Math.sqrt(x*x + y*y + z*z);
                let alpha = Math.max(0, 1 - dist/gridSize);
                colors.push(r * alpha, g * alpha, b * alpha);
            }
        }
    }
    gridPointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    gridPointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const gridMaterial = new THREE.PointsMaterial({ 
        size: 2, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const spacetimeGrid = new THREE.Points(gridPointsGeo, gridMaterial);
    gridGroup.add(spacetimeGrid);

    parts.push({
        name: "Quantum Spacetime Metric Field",
        description: "A visualization of the York time trace of the extrinsic curvature. Represents the compression of spacetime ahead of the ship (blue shift) and expansion behind (red shift).",
        material: "Energy / Photons",
        function: "The actual 'track' of warped space the ship surfs on.",
        assemblyOrder: 12,
        connections: ["Forward Exotic Matter Ring", "Aft Exotic Matter Ring"],
        failureEffect: "Bubble collapse, resulting in the ship being subjected to infinite relativistic mass and temporal paradoxes.",
        cascadeFailures: ["Causality"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 400, y: 400, z: 400 },
        mesh: gridGroup
    });
    group.add(gridGroup);

    // --- NEGATIVE ENERGY PARTICLES ---
    // Particles flowing from front to back along the outer rings
    const particleGeo = new THREE.BufferGeometry();
    const pCount = 5000;
    const pVertices = [];
    for(let i=0; i<pCount; i++){
        pVertices.push(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 400
        );
    }
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(pVertices, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 1.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const exoticParticles = new THREE.Points(particleGeo, particleMat);
    group.add(exoticParticles);

    parts.push({
        name: "Exotic Matter / Tachyon Field",
        description: "Streams of negative-mass tachyons and exotic matter particles maintaining the structural integrity of the warp bubble.",
        material: "Tachyons",
        function: "Violates the weak energy condition to allow metric engineering.",
        assemblyOrder: 13,
        connections: ["Warp Rings"],
        failureEffect: "Spacetime snaps back to flatness.",
        cascadeFailures: ["Warp Metric"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -400, y: -400, z: 400 },
        mesh: exoticParticles
    });

    // --- GRAVIMETRIC SENSORS ---
    const sensorGroup = new THREE.Group();
    for(let i=0; i<8; i++){
        const angle = (i/8) * Math.PI * 2;
        const sensorBodyGeo = new THREE.BoxGeometry(4, 4, 10);
        const sensor = new THREE.Mesh(sensorBodyGeo, darkAlloy);
        sensor.position.set(Math.cos(angle)*15, Math.sin(angle)*15, 120);
        sensor.rotation.z = angle;
        
        const lensGeo = new THREE.SphereGeometry(2, 16, 16);
        const lens = new THREE.Mesh(lensGeo, intenseNeonPurple);
        lens.position.z = 5;
        sensor.add(lens);

        sensorGroup.add(sensor);
    }
    parts.push({
        name: "Interferometric Gravimetry Arrays",
        description: "Extremely sensitive laser interferometers designed to detect micro-fluctuations in the local gravitational field.",
        material: "Dark Alloy / Neon Purple Lens",
        function: "Monitors the stability of the warp bubble metric in real-time.",
        assemblyOrder: 14,
        connections: ["Central Fuselage"],
        failureEffect: "Inability to tune the warp rings, leading to bubble shearing.",
        cascadeFailures: ["Warp Rings", "Deflector Dish"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 300 },
        mesh: sensorGroup
    });
    group.add(sensorGroup);

    // --- SHIELD GENERATORS ---
    const shieldGenGroup = new THREE.Group();
    const genGeo = new THREE.DodecahedronGeometry(6, 1);
    for(let i=0; i<4; i++){
        const angle = (i/4) * Math.PI * 2;
        const gen = new THREE.Mesh(genGeo, chrome);
        gen.position.set(Math.cos(angle)*25, Math.sin(angle)*25, 20);
        
        const innerGlowGeo = new THREE.IcosahedronGeometry(4, 2);
        const glow = new THREE.Mesh(innerGlowGeo, glowingBlue);
        gen.add(glow);
        
        shieldGenGroup.add(gen);
    }
    parts.push({
        name: "Spatial Distortion Shield Emitters",
        description: "Creates secondary spatial folds to deflect directed energy weapons and massive kinetic impacts.",
        material: "Chrome / Glowing Blue",
        function: "Tactical defense and micro-meteoroid repulsion.",
        assemblyOrder: 15,
        connections: ["Central Fuselage", "Power Transfer Conduits"],
        failureEffect: "Hull exposed to hazardous environments.",
        cascadeFailures: ["Hull Integrity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 250, y: 250, z: 0 },
        mesh: shieldGenGroup
    });
    group.add(shieldGenGroup);


    // --- ADVANCED PHD-LEVEL PHYSICS QUIZ ---
    const quizQuestions = [
        {
            question: "In the Alcubierre warp metric, $ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2$, what is the physical interpretation of the shaping function $f(r_s)$ at the center of the bubble ($r_s = 0$) and at asymptotic infinity ($r_s \\to \\infty$)?",
            options: [
                "f(0) = 1 (inside bubble is flat and comoving), f(infinity) = 0 (outside is asymptotically flat Minkowski space).",
                "f(0) = 0 (infinite time dilation), f(infinity) = 1 (light speed constraint).",
                "f(0) = c (speed of light), f(infinity) = v_s (velocity of ship).",
                "f(r_s) is a constant everywhere to maintain uniform negative energy density."
            ],
            correctAnswer: 0,
            explanation: "The shaping function f(r_s) defines the boundaries of the warp bubble. At the ship's location (r_s = 0), f(0) = 1, meaning the metric reduces to flat Minkowski space moving at v_s. Far away, f(infinity) = 0, returning the metric to stationary flat space."
        },
        {
            question: "The expansion of volume elements in a spacetime is given by the trace of the extrinsic curvature (York time), $\\theta$. For the Alcubierre drive moving along the x-axis, which equation correctly describes $\\theta$, dictating where space expands and contracts?",
            options: [
                "$\\theta = v_s \\frac{x_s}{r_s} \\frac{df}{dr_s}$",
                "$\\theta = \\nabla_\\mu T^{\\mu\\nu}$",
                "$\\theta = -\\frac{v_s^2 (y^2 + z^2)}{4 r_s^2} (\\frac{df}{dr_s})^2$",
                "$\\theta = 8\\pi G T_{00}$"
            ],
            correctAnswer: 0,
            explanation: "The expansion scalar θ is exactly $v_s \\frac{x_s}{r_s} \\frac{df}{dr_s}$. Ahead of the ship ($x_s > 0$), the derivative of f is negative, making θ < 0 (space contracts). Behind the ship ($x_s < 0$), θ > 0 (space expands)."
        },
        {
            question: "Evaluating the Einstein tensor $G^{\\mu\\nu}$ for the Alcubierre metric reveals that the Eulerian energy density $T^{00}$ is strictly negative. What is the explicit form of $T^{00}$ (assuming c=G=1)?",
            options: [
                "$T^{00} = -\\frac{1}{8\\pi} \\frac{v_s^2 (y^2 + z^2)}{4 r_s^2} \\left(\\frac{df}{dr_s}\\right)^2$",
                "$T^{00} = \\frac{mc^2}{\\sqrt{1 - v_s^2}}$",
                "$T^{00} = -\\frac{1}{2} R + \\Lambda$",
                "$T^{00} = \\frac{1}{8\\pi} \\left( E^2 + B^2 \\right)$"
            ],
            correctAnswer: 0,
            explanation: "The energy density required is proportional to the square of the bubble velocity and the square of the derivative of the shaping function, and it is strictly negative. This implies a violation of the Weak Energy Condition (WEC), requiring exotic matter."
        },
        {
            question: "An observer located inside the warp bubble (where $f(r_s) = 1$) is in a locally flat spacetime. As the bubble's velocity $v_s$ exceeds the speed of light, what horizon phenomena occur from the perspective of the ship's crew?",
            options: [
                "An apparent horizon forms in front of the ship, and a cosmological horizon forms behind it, exposing the leading edge to immense Hawking radiation.",
                "The ship undergoes infinite length contraction and time dilation.",
                "The event horizon encapsulates the ship uniformly, acting as a black hole.",
                "No horizons form because the metric is globally globally hyperbolic."
            ],
            correctAnswer: 0,
            explanation: "When v_s > c, parts of the warp bubble become causally disconnected from the center. A forward horizon forms where signals from the ship cannot reach, and a rear horizon forms where external signals cannot reach the ship, analogous to black hole and cosmological horizons, leading to Hawking radiation at the front."
        },
        {
            question: "To reduce the macroscopic 'Jupiter-mass' negative energy requirement of the original Alcubierre metric to physically plausible limits (e.g., the mass-energy of Voyager 1), Chris Van Den Broeck proposed a modification. What was the mathematical nature of this modification?",
            options: [
                "Expanding the internal spatial volume of the bubble to microscopic scales while keeping the surface area macroscopic.",
                "Expanding the internal spatial volume of the bubble to macroscopic scales while keeping the 'throat' or surface area microscopic.",
                "Oscillating the velocity parameter v_s rapidly to average out the energy condition violations.",
                "Using non-linear electrodynamics (Born-Infeld) to shield the singularities."
            ],
            correctAnswer: 1,
            explanation: "Van Den Broeck modified the spatial part of the metric to create a 'pocket' universe. The internal volume is large enough to hold a ship, but the external surface area (the 'bubble wall' where negative energy is needed) is microscopic, vastly reducing the exotic matter requirements."
        }
    ];

    // --- COMPLEX ANIMATION LOGIC ---
    const animate = (time, speed, meshes) => {
        // time: elapsed time in seconds
        // speed: overall animation speed multiplier
        
        const realTime = time * speed;

        // 1. Rotate the exotic matter rings at immense speeds
        if (meshes["Forward Exotic Matter Ring (Spacetime Compressor)"]) {
            meshes["Forward Exotic Matter Ring (Spacetime Compressor)"].rotation.z = realTime * 5.0;
        }
        if (meshes["Aft Exotic Matter Ring (Spacetime Expander)"]) {
            meshes["Aft Exotic Matter Ring (Spacetime Expander)"].rotation.z = -realTime * 5.0;
        }

        // 2. Animate the swirling energy in the annihilation core
        if (meshes["Matter-Antimatter Annihilation Reactor"]) {
            const core = meshes["Matter-Antimatter Annihilation Reactor"];
            core.children[1].rotation.x = realTime * 2.0;
            core.children[1].rotation.y = realTime * 3.0;
            core.children[2].rotation.z = -realTime * 4.0;
            core.children[2].rotation.x = realTime * 1.5;
            
            // Pulse emissive intensity
            const intensity = 3.5 + Math.sin(realTime * 10) * 1.5;
            core.children[1].material.emissiveIntensity = intensity;
        }

        // 3. Animate exotic plasma flowing through conduits
        if (meshes["Exotic Plasma Conduits"]) {
            const conduits = meshes["Exotic Plasma Conduits"];
            conduits.rotation.z = realTime * 0.5;
        }

        // 4. Animate the deflector dish scanning
        if (meshes["Navigational Deflector Array"]) {
            const deflector = meshes["Navigational Deflector Array"];
            // Antennae spinning
            for(let i=3; i<7; i++){
                if(deflector.children[i]) {
                    deflector.children[i].rotation.y = realTime * 2.0;
                }
            }
            // Core pulsing
            deflector.children[1].material.emissiveIntensity = 3.0 + Math.sin(realTime * 5) * 2.0;
        }

        // 5. Spacetime Grid Animation (The Warp Wave)
        if (meshes["Quantum Spacetime Metric Field"]) {
            const grid = meshes["Quantum Spacetime Metric Field"].children[0];
            const positions = grid.geometry.attributes.position.array;
            
            // We simulate the space flowing past the ship
            for(let i=0; i<positions.length; i+=3) {
                // Move z backwards to simulate forward movement
                positions[i+2] -= 200 * speed * 0.016; // rough delta time approximation
                
                // If it goes too far back, loop it to the front
                if (positions[i+2] < -320) {
                    positions[i+2] = 320;
                }

                // Apply Alcubierre warp metric distortion (compression front, expansion back)
                // x = positions[i], y = positions[i+1], z = positions[i+2]
                let r = Math.sqrt(positions[i]*positions[i] + positions[i+1]*positions[i+1]);
                let z = positions[i+2];
                
                // Warp bubble boundary is roughly around r=80, z between -100 and 100
                let distToShip = Math.sqrt(r*r + z*z);
                
                // Base grid positions (unwarped)
                let baseX = gridPointsGeo_originalX ? gridPointsGeo_originalX[i/3] : positions[i];
                let baseY = gridPointsGeo_originalY ? gridPointsGeo_originalY[i/3] : positions[i+1];
                
                if (!window.gridPointsGeo_originalX) {
                    window.gridPointsGeo_originalX = [];
                    window.gridPointsGeo_originalY = [];
                }
                if (window.gridPointsGeo_originalX.length < positions.length / 3) {
                    window.gridPointsGeo_originalX.push(positions[i]);
                    window.gridPointsGeo_originalY.push(positions[i+1]);
                } else {
                    baseX = window.gridPointsGeo_originalX[i/3];
                    baseY = window.gridPointsGeo_originalY[i/3];
                }

                // Apply pinch effect at the front and bulge at the back
                if (distToShip < 200) {
                    let warpFactor = Math.sin(distToShip * 0.05 - realTime * 5) * 5;
                    // Compress in front (z > 0)
                    if (z > 0) {
                        positions[i] = baseX - (baseX / r) * warpFactor;
                        positions[i+1] = baseY - (baseY / r) * warpFactor;
                    } 
                    // Expand in back (z < 0)
                    else {
                        positions[i] = baseX + (baseX / r) * warpFactor;
                        positions[i+1] = baseY + (baseY / r) * warpFactor;
                    }
                } else {
                    positions[i] = baseX;
                    positions[i+1] = baseY;
                }
            }
            grid.geometry.attributes.position.needsUpdate = true;
        }

        // 6. Tachyon Particle Stream Animation
        if (meshes["Exotic Matter / Tachyon Field"]) {
            const particles = meshes["Exotic Matter / Tachyon Field"];
            const positions = particles.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                // Tachyons move faster than light (very fast backwards)
                positions[i+2] -= 800 * speed * 0.016; 
                
                // Add a swirling vortex effect around the rings
                let r = Math.sqrt(positions[i]*positions[i] + positions[i+1]*positions[i+1]);
                let angle = Math.atan2(positions[i+1], positions[i]);
                angle += 0.1 * speed;
                positions[i] = r * Math.cos(angle);
                positions[i+1] = r * Math.sin(angle);

                if (positions[i+2] < -400) {
                    positions[i+2] = 400;
                    positions[i] = (Math.random() - 0.5) * 200;
                    positions[i+1] = (Math.random() - 0.5) * 200;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        // 7. Shield Generators Pulsing
        if (meshes["Spatial Distortion Shield Emitters"]) {
            const emitters = meshes["Spatial Distortion Shield Emitters"];
            emitters.rotation.z = realTime * 1.0;
            emitters.children.forEach((gen, index) => {
                const glow = gen.children[0];
                glow.scale.setScalar(1.0 + Math.sin(realTime * 8 + index) * 0.2);
            });
        }
    };

    return {
        group,
        parts,
        description: "The God-Tier Alcubierre Warp Drive. A macroscopic metric engineering marvel. By injecting immense quantities of negative energy (exotic matter) via the forward ring, it contracts spacetime ahead of the ship. Simultaneously, the aft ring expands spacetime. The vessel itself resides in a localized pocket of flat Minkowski space, experiencing zero proper acceleration and zero time dilation, while riding the resulting spacetime wave at supraluminal velocities.",
        quizQuestions,
        animate
    };
}
