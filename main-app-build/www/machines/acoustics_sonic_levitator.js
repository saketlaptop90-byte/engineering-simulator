import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2
    });

    const neonPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const forceFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const intenseHeatMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        roughness: 0.4,
        metalness: 0.6
    });

    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.9,
    });

    const brightCopper = new THREE.MeshStandardMaterial({
        color: 0xffa550,
        roughness: 0.2,
        metalness: 1.0,
    });

    const screenMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function createGearProfile(radius, teeth, depth) {
        const shape = new THREE.Shape();
        const steps = teeth * 2;
        const angleStep = (Math.PI * 2) / steps;
        for (let i = 0; i < steps; i++) {
            const r = i % 2 === 0 ? radius : radius - depth;
            const x = Math.cos(i * angleStep) * r;
            const y = Math.sin(i * angleStep) * r;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        return shape;
    }

    function createTrussProfile(width, height, thickness) {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2, -height / 2);
        shape.lineTo(width / 2, -height / 2);
        shape.lineTo(width / 2, height / 2);
        shape.lineTo(-width / 2, height / 2);
        shape.closePath();
        
        // Add cutouts for the truss
        const hole1 = new THREE.Path();
        hole1.absarc(0, height/4, width/4, 0, Math.PI*2, false);
        const hole2 = new THREE.Path();
        hole2.absarc(0, -height/4, width/4, 0, Math.PI*2, false);
        shape.holes.push(hole1, hole2);
        
        return shape;
    }

    function deformAsteroid(geometry, scale) {
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            // Simple deterministic noise
            const noise = Math.sin(x*1.5)*Math.cos(y*1.5)*Math.sin(z*1.5) * scale;
            pos.setXYZ(i, x*(1+noise), y*(1+noise), z*(1+noise));
        }
        geometry.computeVertexNormals();
        return geometry;
    }

    // ==========================================
    // ANIMATION REGISTRY
    // ==========================================
    const animatables = {
        rotators: [],
        vibrators: [],
        pistons: [],
        waves: [],
        nodes: [],
        asteroids: [],
        screens: []
    };

    // ==========================================
    // 1. FOUNDATION & MAIN POWER CORE
    // ==========================================
    const foundationGroup = new THREE.Group();
    
    // Base Gear Extrusion
    const baseGearShape = createGearProfile(40, 24, 4);
    const baseExtrudeOpts = { depth: 5, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 3, curveSegments: 12 };
    const baseGeo = new THREE.ExtrudeGeometry(baseGearShape, baseExtrudeOpts);
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, darkAlloy);
    baseMesh.position.y = -20;
    foundationGroup.add(baseMesh);

    // Magnetic Containment Rings
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(38 - (i * 2), 1.5, 32, 100);
        const ringMesh = new THREE.Mesh(ringGeo, neonBlue);
        ringMesh.position.y = -18 + (i * 2.5);
        ringMesh.rotation.x = Math.PI / 2;
        foundationGroup.add(ringMesh);
        animatables.rotators.push({ mesh: ringMesh, speed: (i % 2 === 0 ? 0.05 : -0.05) * (i + 1) });
    }

    // Core Reactor Cylinder
    const coreGeo = new THREE.CylinderGeometry(25, 35, 15, 64);
    const coreMesh = new THREE.Mesh(coreGeo, steel);
    coreMesh.position.y = -10;
    foundationGroup.add(coreMesh);

    // Heat Exchangers
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const hxGeo = new THREE.BoxGeometry(4, 12, 8);
        const hxMesh = new THREE.Mesh(hxGeo, intenseHeatMat);
        hxMesh.position.set(Math.cos(angle) * 30, -10, Math.sin(angle) * 30);
        hxMesh.lookAt(0, -10, 0);
        foundationGroup.add(hxMesh);
        animatables.vibrators.push({ mesh: hxMesh, amplitude: 0.05, frequency: 20 + i });
    }

    group.add(foundationGroup);

    parts.push({
        name: "Primary Power Core",
        description: "A massive zero-point energy reactor supplying gigawatts of power to the acoustic arrays.",
        material: "Dark Alloy & Steel",
        function: "Energy Generation",
        assemblyOrder: 1,
        connections: ["Foundation Base", "Cooling System"],
        failureEffect: "Complete system blackout, acoustic field collapses dropping payload.",
        cascadeFailures: ["Magnetic Containment Rings", "Phased Arrays"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // ==========================================
    // 2. LOWER ACOUSTIC PHASED ARRAY
    // ==========================================
    const lowerArrayGroup = new THREE.Group();
    lowerArrayGroup.position.y = -2;

    // Chassis
    const lowerChassisGeo = new THREE.CylinderGeometry(30, 25, 4, 12);
    const lowerChassisMesh = new THREE.Mesh(lowerChassisGeo, darkSteel);
    lowerArrayGroup.add(lowerChassisMesh);

    // Transducers (Hexagonal Grid)
    const transducersGroup = new THREE.Group();
    const transducerGeo = new THREE.CylinderGeometry(1.2, 1.8, 2, 16);
    const tCount = 8;
    const tSpacing = 3.5;
    for (let q = -tCount; q <= tCount; q++) {
        const r1 = Math.max(-tCount, -q - tCount);
        const r2 = Math.min(tCount, -q + tCount);
        for (let r = r1; r <= r2; r++) {
            const x = tSpacing * Math.sqrt(3) * (q + r / 2);
            const z = tSpacing * 3 / 2 * r;
            // Check if within circle
            if (x * x + z * z < 26 * 26) {
                const tMesh = new THREE.Mesh(transducerGeo, chrome);
                tMesh.position.set(x, 2, z);
                
                // Add glowing emitter center
                const tGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.1, 16), neonPurple);
                tMesh.add(tGlow);

                transducersGroup.add(tMesh);
                animatables.vibrators.push({ mesh: tMesh, amplitude: 0.03, frequency: 50 + (x+z)*0.1 });
            }
        }
    }
    lowerArrayGroup.add(transducersGroup);
    group.add(lowerArrayGroup);

    parts.push({
        name: "Lower Phased Emitter Array",
        description: "A hexagonal matrix of ultra-high-frequency ultrasonic transducers. Generates the lifting force.",
        material: "Chrome & Piezoelectric Crystals",
        function: "Acoustic Wave Emission",
        assemblyOrder: 2,
        connections: ["Primary Power Core", "Lower Array Chassis"],
        failureEffect: "Asymmetric acoustic field, payload destabilization.",
        cascadeFailures: ["Standing Wave Visualizer"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // ==========================================
    // 3. STRUCTURAL SUPPORT ARMS & HYDRAULICS
    // ==========================================
    const supportGroup = new THREE.Group();
    
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const armBase = new THREE.Group();
        armBase.rotation.y = angle;

        // Main Arm Extrusion
        const armShape = new THREE.Shape();
        armShape.moveTo(35, -5);
        armShape.lineTo(45, -5);
        armShape.bezierCurveTo(60, 20, 60, 60, 45, 85);
        armShape.lineTo(35, 85);
        armShape.bezierCurveTo(50, 60, 50, 20, 35, -5);
        
        const armGeo = new THREE.ExtrudeGeometry(armShape, { depth: 6, bevelEnabled: true, curveSegments: 20 });
        armGeo.translate(0, 0, -3); // center depth
        const armMesh = new THREE.Mesh(armGeo, steel);
        armBase.add(armMesh);

        // Hydraulic Pistons
        const cylinderGeo = new THREE.CylinderGeometry(2, 2, 30, 16);
        const pistonGeo = new THREE.CylinderGeometry(1, 1, 35, 16);
        
        const hydraulicGroup = new THREE.Group();
        hydraulicGroup.position.set(40, 40, 0);
        hydraulicGroup.rotation.z = Math.PI / 12;

        const cylMesh = new THREE.Mesh(cylinderGeo, darkAlloy);
        const pistMesh = new THREE.Mesh(pistonGeo, chrome);
        pistMesh.position.y = 15;

        hydraulicGroup.add(cylMesh);
        hydraulicGroup.add(pistMesh);
        armBase.add(hydraulicGroup);

        animatables.pistons.push({ mesh: pistMesh, baseY: 15, range: 2, speed: 1.5, offset: i });

        // Power cables routing up the arm
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(35, -5, 4),
            new THREE.Vector3(42, 40, 4),
            new THREE.Vector3(35, 85, 4)
        ]);
        const cableGeo = new THREE.TubeGeometry(path, 20, 0.5, 8, false);
        const cableMesh = new THREE.Mesh(cableGeo, rubber);
        armBase.add(cableMesh);

        supportGroup.add(armBase);
    }
    group.add(supportGroup);

    parts.push({
        name: "Titanium Support Architecture",
        description: "Massive sweeping arms that perfectly align the upper array with the lower array, compensating for immense acoustic recoil.",
        material: "Titanium-Steel Alloy",
        function: "Structural Integrity",
        assemblyOrder: 3,
        connections: ["Foundation Base", "Upper Array Chassis"],
        failureEffect: "Structural shear, catastrophic collapse of upper array onto payload.",
        cascadeFailures: ["Upper Phased Array", "Hydraulic Actuators"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 50, y: 40, z: 50 }
    });

    // ==========================================
    // 4. UPPER ACOUSTIC PHASED ARRAY
    // ==========================================
    const upperArrayGroup = new THREE.Group();
    upperArrayGroup.position.y = 80;
    // Rotate so transducers face downwards
    upperArrayGroup.rotation.x = Math.PI;

    // Upper Chassis
    const upperChassisGeo = new THREE.CylinderGeometry(30, 25, 4, 12);
    const upperChassisMesh = new THREE.Mesh(upperChassisGeo, darkSteel);
    upperArrayGroup.add(upperChassisMesh);

    // Upper Transducers
    const upperTransducersGroup = new THREE.Group();
    for (let q = -tCount; q <= tCount; q++) {
        const r1 = Math.max(-tCount, -q - tCount);
        const r2 = Math.min(tCount, -q + tCount);
        for (let r = r1; r <= r2; r++) {
            const x = tSpacing * Math.sqrt(3) * (q + r / 2);
            const z = tSpacing * 3 / 2 * r;
            if (x * x + z * z < 26 * 26) {
                const tMesh = new THREE.Mesh(transducerGeo, chrome);
                tMesh.position.set(x, 2, z);
                
                const tGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.1, 16), neonBlue);
                tMesh.add(tGlow);

                upperTransducersGroup.add(tMesh);
                animatables.vibrators.push({ mesh: tMesh, amplitude: 0.03, frequency: 55 + (x+z)*0.1 });
            }
        }
    }
    upperArrayGroup.add(upperTransducersGroup);
    group.add(upperArrayGroup);

    parts.push({
        name: "Upper Phased Emitter Array",
        description: "Inverted array to create standing waves. Matches phase precisely with the lower array.",
        material: "Chrome & Piezoelectric Crystals",
        function: "Acoustic Reflection / Opposing Emission",
        assemblyOrder: 4,
        connections: ["Titanium Support Architecture"],
        failureEffect: "Standing wave collapses into a traveling wave, violently ejecting the payload upwards.",
        cascadeFailures: ["Standing Wave Visualizer", "Levitation Payload"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 120, z: 0 }
    });

    // ==========================================
    // 5. ACOUSTIC BEAM & PRESSURE NODES
    // ==========================================
    const acousticFieldGroup = new THREE.Group();
    acousticFieldGroup.position.y = 40; // Center between arrays

    // Resonance Chamber Shield
    const shieldGeo = new THREE.CylinderGeometry(28, 28, 76, 32, 1, true);
    const shieldMesh = new THREE.Mesh(shieldGeo, forceFieldMat);
    acousticFieldGroup.add(shieldMesh);
    animatables.rotators.push({ mesh: shieldMesh, speed: 0.02 });

    // Node Visualizers (Glowing spheres at standing wave nodes)
    const nodeCount = 7;
    const nodeSpacing = 76 / nodeCount;
    for (let i = 0; i < nodeCount; i++) {
        const nodeGeo = new THREE.SphereGeometry(6 - Math.abs(i-3)*1, 32, 32);
        const nodeMesh = new THREE.Mesh(nodeGeo, neonPurple);
        nodeMesh.position.y = -38 + (i * nodeSpacing) + (nodeSpacing / 2);
        
        // Add an inner hotter core
        const coreGeo = new THREE.SphereGeometry(3 - Math.abs(i-3)*0.5, 16, 16);
        const coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
        nodeMesh.add(coreMesh);

        acousticFieldGroup.add(nodeMesh);
        animatables.nodes.push({ mesh: nodeMesh, baseY: nodeMesh.position.y, index: i });
    }

    // Acoustic Travelling Waves (Expanding Toruses)
    for (let i = 0; i < 15; i++) {
        const waveGeo = new THREE.TorusGeometry(5, 0.5, 8, 64);
        const waveMesh = new THREE.Mesh(waveGeo, neonBlue);
        waveMesh.rotation.x = Math.PI / 2;
        acousticFieldGroup.add(waveMesh);
        animatables.waves.push({ mesh: waveMesh, offset: i / 15 });
    }

    group.add(acousticFieldGroup);

    parts.push({
        name: "Acoustic Pressure Node Visualizer",
        description: "High-energy plasma injected into the acoustic nodes to visualize the extreme sound pressure levels (SPL > 190 dB).",
        material: "Argon Plasma",
        function: "Field Visualization & Containment",
        assemblyOrder: 5,
        connections: ["Lower Phased Array", "Upper Phased Array"],
        failureEffect: "Loss of visual feedback, potential unnoticed field drift.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // ==========================================
    // 6. LEVITATION PAYLOAD (Asteroids/Boulders)
    // ==========================================
    const payloadGroup = new THREE.Group();
    payloadGroup.position.y = 40;

    const rockMat = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.9,
        metalness: 0.2,
        bumpScale: 0.2
    });

    // Center Massive Boulder
    let centerRockGeo = new THREE.DodecahedronGeometry(8, 3);
    centerRockGeo = deformAsteroid(centerRockGeo, 0.3);
    const centerRock = new THREE.Mesh(centerRockGeo, rockMat);
    payloadGroup.add(centerRock);
    animatables.asteroids.push({ mesh: centerRock, spinX: 0.01, spinY: 0.015, hoverAmp: 1.5, hoverSpeed: 2, offset: 0 });

    // Smaller orbiting rocks trapped in off-axis nodes
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        let smallRockGeo = new THREE.IcosahedronGeometry(2 + Math.random(), 2);
        smallRockGeo = deformAsteroid(smallRockGeo, 0.4);
        const smallRock = new THREE.Mesh(smallRockGeo, rockMat);
        
        const dist = 15 + Math.random() * 5;
        const heightOff = (Math.random() - 0.5) * 20;
        
        smallRock.position.set(Math.cos(angle) * dist, heightOff, Math.sin(angle) * dist);
        payloadGroup.add(smallRock);
        
        animatables.asteroids.push({ 
            mesh: smallRock, 
            spinX: Math.random() * 0.05, 
            spinY: Math.random() * 0.05, 
            hoverAmp: 2 + Math.random(), 
            hoverSpeed: 1 + Math.random() * 2, 
            offset: Math.random() * Math.PI * 2 
        });
    }

    group.add(payloadGroup);

    parts.push({
        name: "Class-IV Asteroid Payload",
        description: "Dense silicate and metallic boulders trapped within the primary Gor'kov potential wells.",
        material: "Silicate & Iron",
        function: "Experimental Mass",
        assemblyOrder: 6,
        connections: ["Acoustic Resonance Chamber"],
        failureEffect: "Uncontrolled ballistic trajectory, causing catastrophic facility damage.",
        cascadeFailures: ["Control Cabin", "Support Architecture"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: -80, y: 40, z: 0 }
    });

    // ==========================================
    // 7. OPERATOR CONTROL CABIN & CATWALK
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 0, 60);

    // Platform
    const platformGeo = new THREE.BoxGeometry(30, 2, 20);
    const platformMesh = new THREE.Mesh(platformGeo, darkAlloy);
    cabinGroup.add(platformMesh);

    // Control Room
    const roomGeo = new THREE.BoxGeometry(20, 15, 15);
    const roomMesh = new THREE.Mesh(roomGeo, glass);
    roomMesh.position.y = 8.5;
    cabinGroup.add(roomMesh);

    // Frame for room
    const frameGeo = new THREE.EdgesGeometry(roomGeo);
    const frameMesh = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 }));
    roomMesh.add(frameMesh);

    // Holographic Displays inside
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 8, -5);
    for (let i = 0; i < 3; i++) {
        const scnGeo = new THREE.PlaneGeometry(5, 3);
        const scnMesh = new THREE.Mesh(scnGeo, screenMat);
        scnMesh.position.set((i - 1) * 6, 0, (i === 1 ? -2 : 0));
        if (i === 0) scnMesh.rotation.y = Math.PI / 6;
        if (i === 2) scnMesh.rotation.y = -Math.PI / 6;
        screenGroup.add(scnMesh);
        animatables.screens.push(scnMesh);
    }
    cabinGroup.add(screenGroup);

    // Connecting Catwalk to foundation
    const bridgeGeo = new THREE.BoxGeometry(10, 1, 30);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, darkSteel);
    bridgeMesh.position.set(0, -9, -25);
    bridgeMesh.rotation.x = Math.PI / 8; // Sloped down to foundation
    cabinGroup.add(bridgeMesh);

    // Railings for catwalk
    const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 30, 8);
    const railGeoMesh = new THREE.Mesh(railGeo, steel);
    railGeoMesh.rotation.x = Math.PI / 2;
    railGeoMesh.position.set(5, 2, 0);
    bridgeMesh.add(railGeoMesh);
    const railGeoMesh2 = railGeoMesh.clone();
    railGeoMesh2.position.set(-5, 2, 0);
    bridgeMesh.add(railGeoMesh2);

    group.add(cabinGroup);

    parts.push({
        name: "Acoustics Command Center",
        description: "Heavily shielded operations cabin. Contains supercomputers running phase-conjugation algorithms in real-time.",
        material: "Tinted Polycarbonate & Steel",
        function: "Operator Control & Telemetry",
        assemblyOrder: 7,
        connections: ["Foundation Base", "Catwalk"],
        failureEffect: "Loss of manual override, automatic SCRAM protocol initiates.",
        cascadeFailures: ["Primary Power Core"],
        originalPosition: { x: 0, y: 0, z: 60 },
        explodedPosition: { x: 0, y: 0, z: 120 }
    });

    // ==========================================
    // 8. ENVIRONMENTAL EFFECTS (Pipes, Vents, Lights)
    // ==========================================
    const detailsGroup = new THREE.Group();
    
    // Perimeter Warning Lights
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const lightGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
        const warningLightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0 });
        const lightMesh = new THREE.Mesh(lightGeo, warningLightMat);
        lightMesh.position.set(Math.cos(angle) * 45, -18, Math.sin(angle) * 45);
        detailsGroup.add(lightMesh);
        // Blinking logic in animate
        animatables.vibrators.push({ mesh: lightMesh, type: 'light', blinkRate: 0.1 });
    }

    // Heavy Coolant Pipes around Base
    const pipeCurve = new THREE.TorusKnotGeometry(32, 1.5, 128, 8, 2, 5);
    const pipeMesh = new THREE.Mesh(pipeCurve, copper);
    pipeMesh.position.y = -15;
    pipeMesh.rotation.x = Math.PI / 2;
    detailsGroup.add(pipeMesh);

    group.add(detailsGroup);

    parts.push({
        name: "Coolant & Diagnostics Array",
        description: "Intricate network of liquid helium pipes and warning beacons ensuring thermal limits are not exceeded.",
        material: "Copper & LEDs",
        function: "Thermal Management & Safety",
        assemblyOrder: 8,
        connections: ["Foundation Base"],
        failureEffect: "Thermal runaway in transducers, leading to explosive piezoelectric failure.",
        cascadeFailures: ["Lower Phased Array"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });


    // ==========================================
    // QUIZ QUESTIONS (PhD LEVEL)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of acoustic levitation, the primary acoustic radiation force on a small spherical particle (radius 'a' << wavelength 'λ') in a standing wave field is described by the Gor'kov potential. Which of the following best characterizes the dependence of this force on the particle radius (a)?",
            options: [
                "Proportional to a^2 (surface area dependent)",
                "Proportional to a^3 (volume dependent)",
                "Proportional to a^4",
                "Linearly proportional to a"
            ],
            answer: 1,
            explanation: "The Gor'kov potential, which describes the time-averaged acoustic radiation force on a sub-wavelength particle, scales directly with the volume of the particle, hence it is proportional to a^3."
        },
        {
            question: "When dealing with massive particles, acoustic streaming (a secondary non-linear effect generating steady fluid flow) can drag particles out of the acoustic nodes. How does the magnitude of the acoustic streaming velocity conceptually scale with the acoustic velocity amplitude (v_a)?",
            options: [
                "Proportional to v_a",
                "Proportional to v_a^2",
                "Inversely proportional to v_a",
                "Proportional to √v_a"
            ],
            answer: 1,
            explanation: "Acoustic streaming is a second-order, non-linear effect driven by the dissipation of acoustic energy (Reynolds stresses). The driving force is proportional to the square of the acoustic velocity amplitude (v_a^2)."
        },
        {
            question: "To levitate an object much larger than the acoustic wavelength (a >> λ) using phased arrays, standing waves are insufficient. What technique must be utilized?",
            options: [
                "Near-field acoustic levitation (squeeze-film effect)",
                "Rayleigh scattering dominance",
                "Gor'kov potential inversion",
                "Cavitation bubble trapping"
            ],
            answer: 0,
            explanation: "For objects significantly larger than the wavelength, traditional standing wave nodes cannot encompass the object. Near-field acoustic levitation, which relies on the rapid compression and expansion of a thin film of gas (squeeze-film effect), generates massive repulsive forces capable of lifting large, flat objects."
        },
        {
            question: "What is the acoustic contrast factor (Φ) in the Gor'kov potential dependent upon?",
            options: [
                "Only the density ratio between the particle and the fluid.",
                "Only the compressibility ratio between the particle and the fluid.",
                "Both the density ratio and the compressibility ratio of the particle relative to the host fluid.",
                "The acoustic impedance of the transducer."
            ],
            answer: 2,
            explanation: "The acoustic contrast factor Φ determines the direction of the acoustic radiation force (whether the particle moves to pressure nodes or antinodes). It is a function of both the relative density and relative compressibility of the particle to the surrounding fluid."
        },
        {
            question: "In a phased array acoustic levitator utilizing focal points (acoustic tweezers), the axial trapping force is generally weaker than the lateral trapping force. What phenomenon fundamentally limits the maximum axial trapping force?",
            options: [
                "The diffraction limit of the transducers.",
                "The onset of acoustic streaming and momentum transfer from the traveling wave component pushing the particle away from the source.",
                "Thermal expansion of the particle due to acoustic absorption.",
                "Viscous boundary layer separation."
            ],
            answer: 1,
            explanation: "While focusing creates a 3D trap, the propagating nature of the waves imparts a forward scattering force (radiation pressure from the traveling wave component). This outward momentum transfer pushes the particle axially away from the transducers, fundamentally limiting the restoring axial trapping force compared to the lateral gradient forces."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // Time multiplier for high-tech fast visuals
        const t = time * speed * 2.0;

        // 1. Rotators (Containment Rings, Shields)
        animatables.rotators.forEach(rot => {
            rot.mesh.rotation.z += rot.speed * speed;
        });

        // 2. Vibrators (Transducers, Heat Exchangers, Lights)
        animatables.vibrators.forEach(vib => {
            if (vib.type === 'light') {
                // Strobe effect
                const intensity = Math.sin(t * 10) > 0.8 ? 5.0 : 0.5;
                vib.mesh.material.emissiveIntensity = intensity;
            } else {
                // High frequency jitter
                const jitter = Math.sin(time * vib.frequency) * vib.amplitude;
                vib.mesh.position.y += jitter * speed;
                vib.mesh.position.y -= jitter * speed; // Reset immediately to avoid drift, just visual jitter
                vib.mesh.scale.set(1 + jitter, 1 + jitter, 1 + jitter);
            }
        });

        // 3. Pistons (Hydraulic tracking)
        animatables.pistons.forEach(pist => {
            const ext = Math.sin(t * pist.speed + pist.offset) * pist.range;
            pist.mesh.position.y = pist.baseY + ext;
        });

        // 4. Acoustic Waves (Expanding toruses)
        animatables.waves.forEach((wave, index) => {
            // Calculate a looping phase from 0 to 1
            let phase = ((t * 0.5) + wave.offset) % 1.0;
            
            // Scale expands outward
            const scale = 1 + (phase * 10);
            wave.mesh.scale.set(scale, scale, scale);
            
            // Move from arrays toward center
            // Top array is at y=80, bottom at y=0 roughly relative to group. Center is 40.
            // Half start top, half start bottom
            if (index % 2 === 0) {
                wave.mesh.position.y = -40 + (phase * 40); // moving up to center
            } else {
                wave.mesh.position.y = 40 - (phase * 40); // moving down to center
            }
            
            // Opacity fades as it reaches center
            wave.mesh.material.opacity = (1.0 - phase) * 0.8;
        });

        // 5. Standing Wave Nodes (Pulsing intensity & slight breathing)
        animatables.nodes.forEach(node => {
            const pulse = Math.sin(t * 5 + node.index) * 0.2;
            node.mesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
            node.mesh.material.emissiveIntensity = 2.0 + pulse * 5;
            
            // Inner core gets incredibly bright randomly to simulate plasma arcs
            const innerCore = node.mesh.children[0];
            if (Math.random() > 0.95) {
                innerCore.material.color.setHex(0xffffff);
            } else {
                innerCore.material.color.setHex(0xaaaaaa);
            }
        });
        
        // Correcting Asteroid bobbing safely:
        animatables.asteroids.forEach(ast => {
            ast.mesh.rotation.x += ast.spinX * speed;
            ast.mesh.rotation.y += ast.spinY * speed;
            
            if(ast.mesh.userData.baseY === undefined) {
                ast.mesh.userData.baseY = ast.mesh.position.y;
            }
            const bob1 = Math.sin(t * ast.hoverSpeed + ast.offset);
            const bob2 = Math.cos(t * ast.hoverSpeed * 1.5 + ast.offset * 2);
            const totalBob = (bob1 * 0.6 + bob2 * 0.4) * ast.hoverAmp;
            ast.mesh.position.y = ast.mesh.userData.baseY + totalBob;
        });

        // 7. Holographic Screens
        animatables.screens.forEach((scn, idx) => {
            // Matrix-like data scrolling effect on opacity/color
            const glitch = Math.random() > 0.9 ? 0.5 : 1.0;
            scn.material.opacity = (0.5 + Math.sin(t * 10 + idx) * 0.2) * glitch;
            if (Math.random() > 0.98) {
                scn.position.x += (Math.random() - 0.5) * 0.2; // glitch position
            } else {
                // Snap back
                scn.position.x = (idx - 1) * 6; 
            }
        });
    }

    return {
        group,
        parts,
        description: "The Ultra God Tier Sonic Levitator is a colossal acoustic engineering marvel. Utilizing massive opposing arrays of piezoelectric transducers, it generates a highly focused standing wave field capable of generating an acoustic radiation force strong enough to levitate dense boulders. The system features gigawatt power cores, titanium structural support arms with active hydraulic tracking, and a visual resonance chamber that superheats trace argon gas to visualize the immense sound pressure levels at the nodes. Extreme acoustic streaming and nonlinear effects are contained within a magnetic shield.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createSonicLevitator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
