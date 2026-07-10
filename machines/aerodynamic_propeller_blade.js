import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Ultra_God_Tier_Quantum_Entangled_Propeller_Blade";

    // -------------------------------------------------------------------------
    // 1. CUSTOM HIGH-TECH QUANTUM MATERIALS
    // -------------------------------------------------------------------------
    
    // We create extremely complex custom materials emphasizing high-tech, glowing, 
    // and reality-warping physical properties.
    const quantumGlowBlue = new THREE.MeshStandardMaterial({
        color: 0x0022ff,
        emissive: 0x0055ff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.8
    });

    const quantumGlowPurple = new THREE.MeshStandardMaterial({
        color: 0x4400ff,
        emissive: 0x7700ff,
        emissiveIntensity: 4.2,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.9
    });

    const tachyonStreamMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const darkMatterContainment = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x000000,
        roughness: 0.9,
        metalness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const zeroPointEnergyCore = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xeeffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.95,
        roughness: 0.0,
        metalness: 1.0
    });

    // -------------------------------------------------------------------------
    // 2. MATHEMATICAL SPLINE & SHAPE GENERATION
    // -------------------------------------------------------------------------

    // Core Hub Lathe Geometry points
    const hubPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const radius = 5 + 3 * Math.sin(t * Math.PI * 4) * Math.exp(-t * 2) + 2 * Math.cos(t * Math.PI * 8);
        const height = (t - 0.5) * 20;
        hubPoints.push(new THREE.Vector2(radius > 0.5 ? radius : 0.5, height));
    }
    const coreHubGeo = new THREE.LatheGeometry(hubPoints, 128);
    const coreHubMesh = new THREE.Mesh(coreHubGeo, darkSteel);
    coreHubMesh.rotation.x = Math.PI / 2;
    group.add(coreHubMesh);

    // Probability Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(2, 2, 40, 64);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.position.z = -15;
    shaftMesh.rotation.x = Math.PI / 2;
    group.add(shaftMesh);

    // Quantum Singularity Core (Torus Knot inside the hub)
    const singularityGeo = new THREE.TorusKnotGeometry(3, 0.8, 300, 64, 5, 7);
    const singularityMesh = new THREE.Mesh(singularityGeo, zeroPointEnergyCore);
    group.add(singularityMesh);

    // -------------------------------------------------------------------------
    // 3. ZERO-PITCH NON-LOCAL PROPULSION BLADES
    // -------------------------------------------------------------------------
    // The blades have NO physical pitch. They are completely flat along the Z-axis,
    // relying purely on quantum entanglement superposition emitters to move fluid.

    const bladeCount = 7;
    const bladesGroup = new THREE.Group();
    const emittersGroup = new THREE.Group();

    // Complex Blade Shape via ExtrudeGeometry
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.bezierCurveTo(5, 5, 10, 10, 25, 8);
    bladeShape.bezierCurveTo(35, 6, 40, 15, 45, 20);
    bladeShape.bezierCurveTo(50, 25, 45, 30, 35, 28);
    bladeShape.bezierCurveTo(20, 25, 10, 35, 0, 0);

    const extrudeSettings = {
        steps: 1,
        depth: 0.5, // Extremely thin, no pitch twist
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 8
    };

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    // Center the extrusion on Z
    bladeGeo.translate(0, 0, -0.25);

    // Pre-calculate emitter positions on the blade surface for the InstancedMesh
    const emitterPositions = [];
    for (let i = 0; i < 400; i++) {
        // Randomly distribute points that fall roughly within the blade shape
        // Using a basic rejection sampling approach
        let x, y;
        let valid = false;
        while (!valid) {
            x = Math.random() * 50;
            y = Math.random() * 35;
            // Rough bounding check
            if (y < x && y > (x * 0.2) - 5 && x > 5) {
                valid = true;
            }
        }
        emitterPositions.push(new THREE.Vector3(x, y, 0.3)); // Front face
        emitterPositions.push(new THREE.Vector3(x, y, -0.3)); // Back face
    }

    // Instanced Mesh for Superposition Emitters
    const totalEmitters = emitterPositions.length * bladeCount;
    const emitterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    emitterGeo.rotateX(Math.PI / 2);
    const emitterInstanced = new THREE.InstancedMesh(emitterGeo, quantumGlowBlue, totalEmitters);
    
    let emitterIndex = 0;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < bladeCount; i++) {
        const angle = (i / bladeCount) * Math.PI * 2;
        
        // Main Blade Mesh
        const bladeMesh = new THREE.Mesh(bladeGeo, darkMatterContainment);
        bladeMesh.rotation.z = angle;
        bladesGroup.add(bladeMesh);

        // Blade Inner Core Traces ( Glowing inlays )
        const traceGeo = new THREE.ExtrudeGeometry(bladeShape, { ...extrudeSettings, depth: 0.55, bevelEnabled: false });
        const traceMesh = new THREE.Mesh(traceGeo, quantumGlowPurple);
        traceMesh.rotation.z = angle;
        traceMesh.scale.set(0.9, 0.9, 1);
        bladesGroup.add(traceMesh);

        // Position Emitters
        for (let j = 0; j < emitterPositions.length; j++) {
            dummy.position.copy(emitterPositions[j]);
            // Apply blade rotation to the dummy
            dummy.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
            dummy.rotation.z = angle;
            dummy.updateMatrix();
            emitterInstanced.setMatrixAt(emitterIndex, dummy.matrix);
            emitterIndex++;
        }
    }

    emitterInstanced.instanceMatrix.needsUpdate = true;
    bladesGroup.add(emitterInstanced);
    group.add(bladesGroup);

    // -------------------------------------------------------------------------
    // 4. CONTAINMENT RINGS & TACHYON MANIFOLDS
    // -------------------------------------------------------------------------
    
    const ringGroup = new THREE.Group();

    // Inner Phase-Shift Ring
    const innerRingGeo = new THREE.TorusGeometry(48, 1.5, 64, 256);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, chrome);
    ringGroup.add(innerRingMesh);

    // Outer Phase-Shift Ring
    const outerRingGeo = new THREE.TorusGeometry(52, 2.5, 64, 256);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, darkSteel);
    ringGroup.add(outerRingMesh);

    // Ring Interconnector Nodes & Hydraulics
    const nodeCount = 36;
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        
        // Connecting Strut
        const strutGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
        const strutMesh = new THREE.Mesh(strutGeo, steel);
        strutMesh.position.set(Math.cos(angle) * 50, Math.sin(angle) * 50, 0);
        strutMesh.rotation.z = angle + Math.PI / 2;
        ringGroup.add(strutMesh);

        // Magnetic Clamp Node
        const clampGeo = new THREE.BoxGeometry(3, 4, 6);
        const clampMesh = new THREE.Mesh(clampGeo, copper);
        clampMesh.position.set(Math.cos(angle) * 48, Math.sin(angle) * 48, 0);
        clampMesh.rotation.z = angle;
        ringGroup.add(clampMesh);
        
        // Emitter Node on Outer Ring
        const ringEmitterGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const ringEmitterMesh = new THREE.Mesh(ringEmitterGeo, quantumGlowBlue);
        ringEmitterMesh.position.set(Math.cos(angle) * 53, Math.sin(angle) * 53, 0);
        ringGroup.add(ringEmitterMesh);
    }
    
    group.add(ringGroup);

    // -------------------------------------------------------------------------
    // 5. CRYOGENIC COOLING LINES & HYDRAULIC PISTONS
    // -------------------------------------------------------------------------
    
    const coolingGroup = new THREE.Group();
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        
        // Generative CatmullRom curves for chaotic, high-tech plumbing
        const curvePoints = [];
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * 5, Math.sin(angle) * 5, 10));
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * 15, Math.sin(angle) * 15, 15));
        curvePoints.push(new THREE.Vector3(Math.cos(angle + 0.2) * 25, Math.sin(angle + 0.2) * 25, 5));
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * 45, Math.sin(angle) * 45, 0));
        
        const tubeCurve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 64, 0.6, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, glass);
        coolingGroup.add(tubeMesh);

        // Inner glowing liquid for the tubes
        const liquidGeo = new THREE.TubeGeometry(tubeCurve, 64, 0.4, 16, false);
        const liquidMesh = new THREE.Mesh(liquidGeo, tachyonStreamMat);
        coolingGroup.add(liquidMesh);

        // Massive extraction pistons
        const pistonBaseGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
        const pistonBaseMesh = new THREE.Mesh(pistonBaseGeo, darkMatterContainment);
        pistonBaseMesh.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20, -10);
        pistonBaseMesh.rotation.x = Math.PI / 2;
        coolingGroup.add(pistonBaseMesh);

        const pistonRodGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 32);
        const pistonRodMesh = new THREE.Mesh(pistonRodGeo, chrome);
        pistonRodMesh.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20, -15);
        pistonRodMesh.rotation.x = Math.PI / 2;
        coolingGroup.add(pistonRodMesh);
    }

    group.add(coolingGroup);

    // -------------------------------------------------------------------------
    // 6. SPATIOTEMPORAL WARPING LENS
    // -------------------------------------------------------------------------
    
    // A massive glass dome at the front to protect the singularity core
    const lensGeo = new THREE.SphereGeometry(12, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensMesh = new THREE.Mesh(lensGeo, tinted);
    lensMesh.rotation.x = -Math.PI / 2;
    lensMesh.position.z = 8;
    group.add(lensMesh);

    // -------------------------------------------------------------------------
    // 7. MACROSCOPIC DECOHERENCE SHIELD
    // -------------------------------------------------------------------------
    
    // Wireframe geometric barrier protecting the outer layers
    const shieldGeo = new THREE.IcosahedronGeometry(55, 3);
    const shieldMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shieldMesh);

    // -------------------------------------------------------------------------
    // 8. NON-LOCAL FLUID TELEPORTATION MATRIX (THE PARTICLES)
    // -------------------------------------------------------------------------
    // This represents the fluid (air/water) being physically teleported from 
    // the front of the blade to the back via quantum entanglement, avoiding 
    // classical aerodynamic drag entirely.

    const particleCount = 15000;
    const particleGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const particleInstanced = new THREE.InstancedMesh(particleGeo, tachyonStreamMat, particleCount);
    
    // We store metadata for each particle to handle the teleportation logic
    const particleData = new Float32Array(particleCount * 4); // x, y, z, speed

    for (let i = 0; i < particleCount; i++) {
        // Randomly distribute particles in a cylindrical volume in front of the propeller
        const radius = Math.random() * 45 + 5;
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        // Start them far in front (Z is positive in front of the blade, negative behind)
        // Wait, standard THREE coordinates: +Z is towards camera, -Z is away.
        // Let's have flow from +Z to -Z.
        const z = Math.random() * 100 + 10; 
        const speed = Math.random() * 2 + 1.0;

        particleData[i * 4 + 0] = x;
        particleData[i * 4 + 1] = y;
        particleData[i * 4 + 2] = z;
        particleData[i * 4 + 3] = speed;

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        particleInstanced.setMatrixAt(i, dummy.matrix);
    }
    
    particleInstanced.instanceMatrix.needsUpdate = true;
    group.add(particleInstanced);

    // -------------------------------------------------------------------------
    // 9. PARTS METADATA ARRAY (15+ Highly Detailed Entries)
    // -------------------------------------------------------------------------
    
    const parts = [
        {
            name: "Quantum_Singularity_Core",
            description: "A magnetically contained microscopic wormhole that provides infinite zero-point energy to the system. It bends local spacetime to eliminate inertial mass constraints.",
            material: "ZeroPointEnergy / DarkSteel",
            function: "Generates infinite rotational torque and powers the entanglement grids.",
            assemblyOrder: 1,
            connections: ["Probability_Drive_Shaft", "Cryogenic_Cooling_Manifold"],
            failureEffect: "Spontaneous spatiotemporal collapse resulting in a microscopic black hole.",
            cascadeFailures: ["Complete system implosion", "Local gravity inversion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 50 }
        },
        {
            name: "Probability_Drive_Shaft",
            description: "A chrome-plated multi-dimensional driveshaft that transmits rotational momentum simultaneously across multiple timelines to ensure 0% mechanical slippage.",
            material: "Chrome / Neutonium",
            function: "Translates core output into non-local rotational kinetic energy.",
            assemblyOrder: 2,
            connections: ["Quantum_Singularity_Core", "Entanglement_SubProcessor_Hub"],
            failureEffect: "Temporal shearing; the shaft spins in the past but remains stationary in the present.",
            cascadeFailures: ["Chronological desynchronization of the blade array"],
            originalPosition: { x: 0, y: 0, z: -15 },
            explodedPosition: { x: 0, y: 0, z: -80 }
        },
        {
            name: "Entanglement_SubProcessor_Hub",
            description: "The primary housing containing the quantum computers that calculate the exact superposition states required for the fluid teleportation matrix.",
            material: "DarkMatterContainment",
            function: "Calculates probability vectors for 10^24 fluid particles per microsecond.",
            assemblyOrder: 3,
            connections: ["Probability_Drive_Shaft", "NonLocal_Propulsion_Blades"],
            failureEffect: "Calculation errors resulting in fluid particles fusing with solid matter.",
            cascadeFailures: ["Catastrophic matter-antimatter annihilation at the blade surface"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 0 }
        },
        {
            name: "NonLocal_Propulsion_Blade_Array",
            description: "Seven completely flat, zero-pitch extrusions of dark matter alloy. They do not physically push the air; instead, they act as macroscopic quantum emitters.",
            material: "DarkMatterContainment / QuantumGlowPurple",
            function: "Provides the physical substrate for the Superposition Emitter Grid.",
            assemblyOrder: 4,
            connections: ["Entanglement_SubProcessor_Hub", "Superposition_Emitter_Grid"],
            failureEffect: "Physical drag is reintroduced, shattering the blades instantly under infinite torque.",
            cascadeFailures: ["Decoherence shield collapse", "Rings shatter"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 100, z: 0 }
        },
        {
            name: "Superposition_Emitter_Grid",
            description: "Thousands of microscopic torus nodes embedded into the blade faces. They emit a localized entanglement field that links fluid particles in front of the blade to a point in space behind the blade.",
            material: "QuantumGlowBlue",
            function: "Entangles local fluid particles for instantaneous spatial translation.",
            assemblyOrder: 5,
            connections: ["NonLocal_Propulsion_Blade_Array"],
            failureEffect: "Fluid accumulates normally, causing conventional stall conditions.",
            cascadeFailures: ["Overheating of the SubProcessor Hub"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 120, y: 120, z: 20 }
        },
        {
            name: "Phase_Shift_Ring_Inner",
            description: "A chrome torus rotating counter to the primary blade array. It generates an interference pattern that prevents the entanglement field from affecting the external hull.",
            material: "Chrome",
            function: "Contains the quantum anomaly within a defined cylindrical volume.",
            assemblyOrder: 6,
            connections: ["Phase_Shift_Ring_Outer", "Magnetic_Clamp_Nodes"],
            failureEffect: "The entanglement field expands infinitely, teleporting the entire surrounding atmosphere into a vacuum.",
            cascadeFailures: ["Global atmospheric depletion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -50 }
        },
        {
            name: "Phase_Shift_Ring_Outer",
            description: "A secondary dark steel containment ring providing structural support and housing the primary tachyon exhaust nodes.",
            material: "DarkSteel",
            function: "Structural integrity and tachyon venting.",
            assemblyOrder: 7,
            connections: ["Phase_Shift_Ring_Inner", "Hydraulic_Struts"],
            failureEffect: "Tachyon buildup causes the machine to accelerate backward in time.",
            cascadeFailures: ["Causality loop collapse"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -80 }
        },
        {
            name: "Magnetic_Clamp_Nodes",
            description: "36 high-density copper electromagnet boxes that bridge the inner and outer containment rings, regulating the phase shift frequency.",
            material: "Copper",
            function: "Frequency regulation of the containment field.",
            assemblyOrder: 8,
            connections: ["Phase_Shift_Ring_Inner", "Phase_Shift_Ring_Outer"],
            failureEffect: "Rings lose synchronization, causing catastrophic harmonic resonance.",
            cascadeFailures: ["Total structural shattering of the rings"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 150, y: -150, z: 0 }
        },
        {
            name: "Ring_Emitter_Nodes",
            description: "Glowing blue spheres mounted on the outer ring that vent excess zero-point energy as harmless Hawking radiation.",
            material: "QuantumGlowBlue",
            function: "Hawking radiation exhaust system.",
            assemblyOrder: 9,
            connections: ["Phase_Shift_Ring_Outer"],
            failureEffect: "Energy backs up into the singularity, expanding its event horizon.",
            cascadeFailures: ["Singularity core breach"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -150, y: 150, z: 0 }
        },
        {
            name: "Cryogenic_Cooling_Manifold",
            description: "Chaotic, generative plumbing made of transparent diamantine glass, pumping liquid tachyon-infused helium to keep the singularity stable.",
            material: "Glass / TachyonStream",
            function: "Thermal regulation of the zero-point core down to 0.000001 Kelvin.",
            assemblyOrder: 10,
            connections: ["Quantum_Singularity_Core", "Extraction_Pistons"],
            failureEffect: "Core temperature exceeds the Planck temperature, melting reality.",
            cascadeFailures: ["Vacuum decay of the universe"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: -100 }
        },
        {
            name: "Zero_Point_Extraction_Pistons",
            description: "Massive dark matter alloy pistons that rhythmically extract energy pulses from the core to power the emitter grid.",
            material: "DarkMatterContainment / Chrome",
            function: "Pulse-width modulation of the quantum energy stream.",
            assemblyOrder: 11,
            connections: ["Cryogenic_Cooling_Manifold", "Entanglement_SubProcessor_Hub"],
            failureEffect: "Continuous, unregulated power flow causes the blades to achieve infinite RPM.",
            cascadeFailures: ["Centrifugal dismemberment across multiple dimensions"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 0, z: -100 }
        },
        {
            name: "Spatiotemporal_Warping_Lens",
            description: "A heavily tinted forward dome that physically bends incoming fluid particles into the optimal vectors for quantum entanglement.",
            material: "TintedGlass",
            function: "Vector alignment of incoming fluid media.",
            assemblyOrder: 12,
            connections: ["Entanglement_SubProcessor_Hub"],
            failureEffect: "Particles enter the array unaligned, resulting in a 50% drop in teleportation efficiency.",
            cascadeFailures: ["Backwash of entangled particles", "Mild localized explosions"],
            originalPosition: { x: 0, y: 0, z: 8 },
            explodedPosition: { x: 0, y: 0, z: 150 }
        },
        {
            name: "Macroscopic_Decoherence_Shield",
            description: "An external icosahedron energy barrier that isolates the quantum systems from cosmic ray interference.",
            material: "EnergyField",
            function: "Prevents spontaneous decoherence of the teleporting fluid particles.",
            assemblyOrder: 13,
            connections: ["Phase_Shift_Ring_Outer"],
            failureEffect: "Fluid particles decohere mid-teleportation, turning into highly radioactive plasma.",
            cascadeFailures: ["Incineration of the host vessel"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -200, y: -200, z: 200 }
        },
        {
            name: "Fluid_Teleportation_Matrix",
            description: "The actual stream of fluid (air/water) currently in a state of quantum superposition, physically disappearing in front of the blade and reappearing behind it.",
            material: "TachyonStream",
            function: "Provides the reactionary mass required for thrust without moving parts interacting with the fluid.",
            assemblyOrder: 14,
            connections: ["Superposition_Emitter_Grid"],
            failureEffect: "Fluid fails to exit superposition, effectively deleting mass from the universe.",
            cascadeFailures: ["Violation of the conservation of mass", "Universal debugging protocols triggered"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 300 }
        },
        {
            name: "Casimir_Effect_Plates",
            description: "Micro-fractal plates located within the core hub that exploit vacuum fluctuations to generate the initial seed energy for the singularity.",
            material: "DarkSteel",
            function: "Ignition system for the zero-point reactor.",
            assemblyOrder: 15,
            connections: ["Quantum_Singularity_Core"],
            failureEffect: "Failure to ignite; the propeller remains an incredibly expensive paperweight.",
            cascadeFailures: ["Embarrassment to the engineering team"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 50 }
        }
    ];

    // -------------------------------------------------------------------------
    // 10. PHD-LEVEL QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    
    const quizQuestions = [
        {
            question: "In the context of non-local propulsion, how does the system resolve the paradox of momentum conservation when fluid particles are instantaneously translated across the Superposition Emitter Grid?",
            options: [
                "Momentum is transferred into the cosmic microwave background via tachyon emission.",
                "The system relies on a localized spatiotemporal warp that shifts the reference frame of the universe, rendering the fluid's momentum relative strictly to the Probability Drive Shaft.",
                "Momentum is stored as potential energy in the Casimir Effect Plates and slowly bled off as Hawking radiation.",
                "Momentum is strictly conserved within the many-worlds interpretation by offloading equal and opposite kinetic vectors into a parallel vacuum state."
            ],
            correctAnswer: 3,
            explanation: "According to advanced quantum fluid dynamics, instantaneous spatial translation (teleportation) of mass requires momentum to be conserved cross-dimensionally. The system offloads the reactive vector into a parallel vacuum state, resulting in thrust in our dimension without violating Newtonian mechanics globally."
        },
        {
            question: "What is the primary function of the Phase-Shift Rings rotating counter to the main zero-pitch blade array?",
            options: [
                "To generate a macroscopic decoherence boundary that prevents the entanglement field from infinitely propagating through the surrounding atmosphere.",
                "To physically chop up any debris that bypassing the Spatiotemporal Warping Lens.",
                "To act as a classical flywheel, storing kinetic energy in case the Quantum Singularity Core misfires.",
                "To induce a Faraday cage effect to block incoming electromagnetic pulses."
            ],
            correctAnswer: 0,
            explanation: "The entanglement field generated by the blades would naturally cascade and entangle the entire planet's atmosphere. The counter-rotating phase-shift rings create a destructive interference pattern in the quantum waveform, strictly bounding the teleportation matrix to a cylindrical volume."
        },
        {
            question: "Why do the Non-Local Propulsion Blades have exactly zero degrees of physical pitch?",
            options: [
                "Manufacturing defects in dark matter alloy prevent complex curvature extrusion.",
                "Because physical pitch would induce classical aerodynamic drag, leading to spontaneous wave-function collapse of the entangled fluid particles via forced observation by air friction.",
                "Zero pitch is aesthetically pleasing to higher-dimensional entities.",
                "To allow the system to operate equally efficiently in both forward and reverse by simply reversing the polarity of the Superposition Emitter Grid."
            ],
            correctAnswer: 1,
            explanation: "Classical aerodynamic drag constitutes a physical 'measurement' or interaction with the fluid particles. This interaction forces a wave-function collapse (decoherence). By having zero pitch, the blades physically slice through the fluid without displacing it, allowing the quantum emitters to teleport the fluid undisturbed."
        },
        {
            question: "If the Cryogenic Cooling Manifold fails, leading to a core temperature exceeding the Planck temperature, what is the predicted cascade failure?",
            options: [
                "The singularity evaporates instantly via Hawking radiation.",
                "The coolant boils, rupturing the diamantine glass tubes.",
                "Vacuum decay of the universe, initiated by a false vacuum collapse spreading at the speed of light.",
                "The Probability Drive Shaft shears out of its temporal alignment."
            ],
            correctAnswer: 2,
            explanation: "Exceeding the Planck temperature introduces sufficient thermal energy to push local spacetime out of its metastable false vacuum state, initiating a true vacuum bubble that expands outward at c, annihilating all matter and physical laws within its expanding radius."
        },
        {
            question: "How does the Spatiotemporal Warping Lens prepare the incoming chaotic fluid media (e.g., turbulent atmospheric air) for the entanglement matrix?",
            options: [
                "It cools the air to near absolute zero to form a Bose-Einstein condensate.",
                "It physically filters out dust particles using a microscopic mesh.",
                "It bends local spacetime to perfectly align the quantum spin vectors of the incoming fluid molecules, minimizing calculation overhead for the Entanglement SubProcessor Hub.",
                "It refracts incoming light to make the propeller visually invisible."
            ],
            correctAnswer: 2,
            explanation: "Turbulent fluid possesses highly randomized quantum states. The Warping Lens gently bends spacetime, forcing the incoming molecules into a uniform vector and spin state. This vastly reduces the computational complexity required by the SubProcessors to calculate the teleportation probability matrices."
        }
    ];

    // -------------------------------------------------------------------------
    // 11. EXTREME ANIMATION LOGIC
    // -------------------------------------------------------------------------
    
    function animate(time, speed, meshes) {
        // Core Hub and Singularity Animation
        coreHubMesh.rotation.z = time * speed * 2;
        singularityMesh.rotation.x = time * speed * 5;
        singularityMesh.rotation.y = time * speed * 4.3;
        singularityMesh.scale.setScalar(1 + Math.sin(time * 10) * 0.05);

        // Blade Array spinning silently and insanely fast
        // (Visual rotation, though thrust is non-local)
        const bladeSpeed = speed * 15;
        bladesGroup.rotation.z = time * bladeSpeed;

        // Counter-rotating Containment Rings
        ringGroup.rotation.z = -time * bladeSpeed * 0.4;
        
        // Inner and Outer rings oscillate slightly on the Z axis
        innerRingMesh.position.z = Math.sin(time * speed * 3) * 2;
        outerRingMesh.position.z = Math.cos(time * speed * 3) * 2;

        // Emitter Grid Pulsing
        quantumGlowBlue.emissiveIntensity = 3.5 + Math.sin(time * 20) * 1.5;
        quantumGlowPurple.emissiveIntensity = 4.2 + Math.cos(time * 15) * 1.0;

        // Icosahedron Shield Rotation
        shieldMesh.rotation.x = time * speed * 0.5;
        shieldMesh.rotation.y = time * speed * 0.7;
        shieldMat.opacity = 0.05 + Math.sin(time * 5) * 0.02;

        // Spatiotemporal Warping Lens color shifting
        lensMesh.material.color.setHSL((time * 0.1) % 1.0, 0.8, 0.5);

        // ---------------------------------------------------------------------
        // FLUID TELEPORTATION MATRIX LOGIC (The core visual spectacle)
        // ---------------------------------------------------------------------
        // Particles flow from +Z (front) to -Z (back). 
        // When they hit Z = 0 (the blade plane), they INSTANTLY teleport to Z = -20.
        // This visualizes the non-local propulsion.
        
        const flowSpeed = speed * 40; 
        
        for (let i = 0; i < particleCount; i++) {
            let x = particleData[i * 4 + 0];
            let y = particleData[i * 4 + 1];
            let z = particleData[i * 4 + 2];
            let pSpeed = particleData[i * 4 + 3];

            // Move particle towards the blade (-Z direction)
            z -= pSpeed * flowSpeed;

            // Bizarre non-local flow patterns
            // As they approach the blade (Z between 20 and 0), they spiral tightly
            if (z > 0 && z < 20) {
                const angle = 0.1 * pSpeed * flowSpeed;
                const newX = x * Math.cos(angle) - y * Math.sin(angle);
                const newY = x * Math.sin(angle) + y * Math.cos(angle);
                x = newX;
                y = newY;
            }

            // THE QUANTUM JUMP (Teleportation)
            // If the particle crosses the blade threshold (Z hits 0)
            if (z <= 0 && z > -15) {
                // Instantly teleport to behind the blade, plus add a massive velocity boost
                z = -20 - Math.random() * 10;
                // Add extreme chaotic scattering to simulate tachyon exhaust
                x *= 1.2;
                y *= 1.2;
            }

            // Reset particles that have gone too far back
            if (z < -150) {
                const radius = Math.random() * 45 + 5;
                const theta = Math.random() * Math.PI * 2;
                x = Math.cos(theta) * radius;
                y = Math.sin(theta) * radius;
                z = Math.random() * 50 + 50; // Spawn far in front again
            }

            // Save back to array
            particleData[i * 4 + 0] = x;
            particleData[i * 4 + 1] = y;
            particleData[i * 4 + 2] = z;

            // Update instance matrix
            dummy.position.set(x, y, z);
            
            // Stretch the particle along the Z axis to look like a motion-blurred streak
            // The faster it moves, the longer the streak
            const stretch = (z < 0) ? 8.0 : 2.0; // Huge streak after teleport
            dummy.scale.set(1, 1, stretch);
            
            dummy.updateMatrix();
            particleInstanced.setMatrixAt(i, dummy.matrix);
        }
        
        particleInstanced.instanceMatrix.needsUpdate = true;
    }

    const description = "The Ultra God Tier Quantum Entangled Propeller Blade is a Class-V non-local propulsion system. Bypassing physical aerodynamics entirely, it utilizes a zero-pitch dark matter alloy blade embedded with a microscopic torus Superposition Emitter Grid. Powered by a magnetically contained microscopic wormhole (Zero-Point Singularity), the system mathematically entangles atmospheric fluid particles in front of the craft with spatial coordinates behind the craft. As the blades spin—silently and without physical drag—they force instantaneous spatial translation of massive volumes of air, providing god-like thrust via momentum offloading into parallel vacuum states. Complete with spatiotemporal warping lenses, tachyon exhaust manifolds, and a macroscopic decoherence shield to prevent spontaneous universal collapse.";

    return { group, parts, description, quizQuestions, animate };
}
