import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for advanced glowing/cybernetic materials
    function createGlowingMaterial(color, intensity) {
        return new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity,
            metalness: 0.8,
            roughness: 0.2
        });
    }

    const neonBlue = createGlowingMaterial(0x00ffff, 2.5);
    const neonPurple = createGlowingMaterial(0x8a2be2, 2.0);
    const neonRed = createGlowingMaterial(0xff0000, 3.0);
    const neonGreen = createGlowingMaterial(0x00ff00, 1.5);
    const neonOrange = createGlowingMaterial(0xffa500, 2.0);
    const dataGlow = createGlowingMaterial(0x00aaff, 1.5);

    // ==========================================
    // 1. Titanium Protective Casing (Outer Shell)
    // ==========================================
    const casingGroup = new THREE.Group();
    const casingPoints = [];
    // Creating a sleek, domed cortical shape
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const x = Math.sin(t * Math.PI) * 4.5 * Math.pow(Math.cos(t * Math.PI * 0.5), 0.5);
        const y = t * 2.5;
        casingPoints.push(new THREE.Vector2(x === 0 ? 0.001 : x, y));
    }
    const casingGeom = new THREE.LatheGeometry(casingPoints, 128);
    const casingMesh = new THREE.Mesh(casingGeom, darkSteel);
    casingMesh.rotation.x = Math.PI; // Pointing downwards to nestle into the skull
    casingGroup.add(casingMesh);

    // Add locking ridges around the casing rim
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const ridgeGeom = new THREE.CylinderGeometry(0.15, 0.1, 0.4, 16);
        const ridge = new THREE.Mesh(ridgeGeom, chrome);
        ridge.position.set(Math.cos(angle) * 4.2, -2.4, Math.sin(angle) * 4.2);
        ridge.rotation.x = Math.PI / 2;
        ridge.rotation.z = angle;
        casingGroup.add(ridge);
    }
    
    casingGroup.position.set(0, 6, 0);
    group.add(casingGroup);
    meshes.casingGroup = casingGroup;

    parts.push({
        name: "Titanium Protective Casing",
        description: "The primary structural housing designed to shield the delicate internal neural matrix from cranial fluid and mechanical trauma. Machined from aerospace-grade titanium alloy.",
        material: "darkSteel, chrome",
        function: "Provides hermetic sealing and structural integrity for the entire implant, deflecting external electromagnetic interference.",
        assemblyOrder: 1,
        connections: ["Cranial Attachment Brackets", "Cooling Micro-Fins", "Core Processor Housing"],
        failureEffect: "Exposure of internal components to cerebrospinal fluid, leading to catastrophic short-circuits and severe neural shock.",
        cascadeFailures: ["Quantum Neural Matrix", "Bio-Electric Power Core", "Memory Backup Drive"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // ==========================================
    // 2. Quantum Neural Matrix (Inner Processing Core)
    // ==========================================
    const matrixGroup = new THREE.Group();
    
    // Base silicon wafer
    const waferGeom = new THREE.CylinderGeometry(3.5, 3.5, 0.1, 64);
    const waferMesh = new THREE.Mesh(waferGeom, plastic);
    matrixGroup.add(waferMesh);

    // Thousands of microscopic neuro-transistors represented by detailed clusters
    for (let i = 0; i < 150; i++) {
        const radius = Math.random() * 3.3;
        const theta = Math.random() * Math.PI * 2;
        const isCore = radius < 1.0;
        const nodeHeight = isCore ? 0.4 : 0.15 + Math.random() * 0.1;
        
        const nodeGeom = new THREE.CylinderGeometry(0.04, 0.04, nodeHeight, 8);
        const nodeMat = isCore ? neonBlue : (Math.random() > 0.3 ? copper : chrome);
        const node = new THREE.Mesh(nodeGeom, nodeMat);
        
        node.position.set(Math.cos(theta) * radius, nodeHeight / 2, Math.sin(theta) * radius);
        matrixGroup.add(node);
    }

    matrixGroup.position.set(0, 4.5, 0);
    group.add(matrixGroup);
    meshes.matrixGroup = matrixGroup;

    parts.push({
        name: "Quantum Neural Matrix",
        description: "A highly advanced computing core featuring millions of quantum gates that translates biological action potentials into digital signals and vice versa in real-time.",
        material: "plastic, copper, glowing neon",
        function: "Performs real-time quantum calculations to decode thoughts, memories, and sensory inputs.",
        assemblyOrder: 2,
        connections: ["Titanium Protective Casing", "Synaptic Modulators", "Sensory Override Module"],
        failureEffect: "Complete loss of user consciousness, severe cognitive decoupling, or synthetic hallucinations as signal translation degrades.",
        cascadeFailures: ["Sensory Override Module", "Motor Control Relay"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 }
    });

    // ==========================================
    // 3. Bio-Electric Power Core
    // ==========================================
    const powerGroup = new THREE.Group();
    
    const coreSphereGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const coreSphere = new THREE.Mesh(coreSphereGeom, neonPurple);
    powerGroup.add(coreSphere);
    meshes.powerCoreSphere = coreSphere;

    // Outer containment rings (Gyroscopic)
    const ring1Geom = new THREE.TorusGeometry(1.5, 0.08, 16, 64);
    const ring1 = new THREE.Mesh(ring1Geom, steel);
    powerGroup.add(ring1);
    meshes.powerCoreOuterRing = ring1;

    const ring2Geom = new THREE.TorusGeometry(1.3, 0.06, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geom, chrome);
    ring2.rotation.x = Math.PI / 2;
    powerGroup.add(ring2);
    meshes.powerCoreInnerRing = ring2;

    powerGroup.position.set(0, 7, 0); // Nested within the dome
    group.add(powerGroup);
    meshes.powerGroup = powerGroup;

    parts.push({
        name: "Bio-Electric Power Core",
        description: "A continuously spinning gyroscopic fusion micro-reactor that siphons trace biological thermal energy and combines it with a high-density isotope cell.",
        material: "neon purple, steel, chrome",
        function: "Provides virtually infinite, stable power to all subsystems without needing external recharging.",
        assemblyOrder: 3,
        connections: ["Quantum Neural Matrix", "Cerebrospinal Fluid Pump"],
        failureEffect: "Instant blackout of all implant functionalities; emergency biological reboot required to maintain host vitals.",
        cascadeFailures: ["All Subsystems"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 19, z: 0 }
    });

    // ==========================================
    // 4. Cooling Micro-Fins (Heat Sink Array)
    // ==========================================
    const finsGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.6, 0.2);
    finShape.lineTo(0.5, 1.5);
    finShape.lineTo(0.1, 1.8);
    finShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    
    for (let i = 0; i < 90; i++) {
        const angle = (i / 90) * Math.PI * 2;
        const finGeom = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
        const finMesh = new THREE.Mesh(finGeom, aluminum);
        // Position radially around the matrix
        finMesh.position.set(Math.cos(angle) * 3.4, 4.5, Math.sin(angle) * 3.4);
        finMesh.rotation.y = -angle + Math.PI/2;
        finMesh.rotation.x = -Math.PI / 8;
        finsGroup.add(finMesh);
    }
    
    group.add(finsGroup);
    meshes.finsGroup = finsGroup;

    parts.push({
        name: "Cooling Micro-Fins Array",
        description: "An array of 90 high-surface-area aluminum extrusions that dynamically channel heat away from the quantum matrix into surrounding cranial fluid.",
        material: "aluminum",
        function: "Dissipates extreme thermal loads generated by quantum superposition calculations, preventing host brain tissue boiling.",
        assemblyOrder: 4,
        connections: ["Quantum Neural Matrix", "Titanium Protective Casing"],
        failureEffect: "Thermal runaway resulting in localized brain tissue necrosis and catastrophic cognitive damage.",
        cascadeFailures: ["Quantum Neural Matrix", "Synaptic Modulators"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 4.5, z: 5 } // Explodes outward radially in concept, but we use a fixed offset for the array
    });

    // ==========================================
    // 5. Cerebral Interface Mesh (Neural Webs)
    // ==========================================
    const meshGroup = new THREE.Group();
    const numTendrils = 40;
    meshes.tendrils = [];

    for (let i = 0; i < numTendrils; i++) {
        const angle = (i / numTendrils) * Math.PI * 2;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5),
            new THREE.Vector3(Math.cos(angle) * 2.5 + (Math.random() - 0.5), -1.5, Math.sin(angle) * 2.5 + (Math.random() - 0.5)),
            new THREE.Vector3(Math.cos(angle) * 3.5 + (Math.random() - 0.5), -3.0, Math.sin(angle) * 3.5 + (Math.random() - 0.5)),
            new THREE.Vector3(Math.cos(angle) * 4.5, -4.5 + Math.random(), Math.sin(angle) * 4.5)
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
        const tubeMat = i % 3 === 0 ? neonBlue : copper;
        const tendril = new THREE.Mesh(tubeGeom, tubeMat);
        meshGroup.add(tendril);
        meshes.tendrils.push(tendril);
    }
    
    meshGroup.position.set(0, 4.4, 0);
    group.add(meshGroup);

    parts.push({
        name: "Cerebral Interface Mesh",
        description: "A web of ultra-fine, highly flexible bio-conductive nanowires that physically penetrate the cerebral cortex to establish direct synaptic links.",
        material: "copper, glowing neon",
        function: "Acts as the physical bridge between the host's neurons and the digital architecture of the implant.",
        assemblyOrder: 5,
        connections: ["Quantum Neural Matrix", "Neural Electrodes"],
        failureEffect: "Loss of specific motor or sensory functions, Phantom Limb Syndrome, or severe phantom pain.",
        cascadeFailures: ["Motor Control Relay"],
        originalPosition: { x: 0, y: 4.4, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // ==========================================
    // 6. Neural Electrodes (Deep Brain Penetrators)
    // ==========================================
    const electrodeGroup = new THREE.Group();
    meshes.electrodes = [];
    
    for (let i = 0; i < 120; i++) {
        const radius = Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const length = 2 + Math.random() * 3;
        
        const elGeom = new THREE.CylinderGeometry(0.015, 0.005, length, 8);
        const elMesh = new THREE.Mesh(elGeom, steel);
        
        // Pointing straight down
        elMesh.position.set(Math.cos(angle) * radius, -length / 2, Math.sin(angle) * radius);
        electrodeGroup.add(elMesh);
        meshes.electrodes.push({ mesh: elMesh, baseLength: length, phase: Math.random() * Math.PI * 2 });
    }
    
    electrodeGroup.position.set(0, 4.4, 0);
    group.add(electrodeGroup);

    parts.push({
        name: "Deep Brain Penetrator Electrodes",
        description: "Microscopic titanium needles that reach deep into the hippocampus, amygdala, and brain stem.",
        material: "steel",
        function: "Monitors and writes to deep subconscious sectors, regulating emotion, extreme memory retrieval, and autonomic overrides.",
        assemblyOrder: 6,
        connections: ["Cerebral Interface Mesh", "Synaptic Modulators"],
        failureEffect: "Emotional dysregulation, sudden intense bursts of fear or euphoria, corruption of long-term memory.",
        cascadeFailures: ["Dopamine Regulation Valve"],
        originalPosition: { x: 0, y: 4.4, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // ==========================================
    // 7. Synaptic Modulators (Dual Units)
    // ==========================================
    const modGroup = new THREE.Group();
    meshes.modulators = [];
    
    const modGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    
    // Left Modulator
    const leftMod = new THREE.Mesh(modGeom, rubber);
    leftMod.position.set(-2.5, 0, 0);
    leftMod.rotation.x = Math.PI / 2;
    modGroup.add(leftMod);
    meshes.modulators.push(leftMod);

    // Right Modulator
    const rightMod = new THREE.Mesh(modGeom, rubber);
    rightMod.position.set(2.5, 0, 0);
    rightMod.rotation.x = Math.PI / 2;
    modGroup.add(rightMod);
    meshes.modulators.push(rightMod);

    // Add glowing bands to modulators
    const bandGeom = new THREE.TorusGeometry(0.62, 0.05, 16, 32);
    const leftBand = new THREE.Mesh(bandGeom, neonGreen);
    leftBand.position.set(-2.5, 0, 0);
    leftBand.rotation.y = Math.PI / 2;
    modGroup.add(leftBand);
    
    const rightBand = new THREE.Mesh(bandGeom, neonGreen);
    rightBand.position.set(2.5, 0, 0);
    rightBand.rotation.y = Math.PI / 2;
    modGroup.add(rightBand);

    modGroup.position.set(0, 5, 0);
    group.add(modGroup);

    parts.push({
        name: "Synaptic Modulators",
        description: "High-frequency resonance chambers that synthetically trigger neurotransmitter release.",
        material: "rubber, neon green",
        function: "Balances the brain's chemical state to prevent rejection of the implant and accelerate neuro-plasticity.",
        assemblyOrder: 7,
        connections: ["Quantum Neural Matrix", "Dopamine Regulation Valve"],
        failureEffect: "Immediate onset of severe depression, mania, or hyper-aggression due to chemical imbalance.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 4 }
    });

    // ==========================================
    // 8. Dopamine Regulation Valve
    // ==========================================
    const valveGroup = new THREE.Group();
    const vBaseGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
    const vBase = new THREE.Mesh(vBaseGeom, steel);
    valveGroup.add(vBase);
    
    const vWheelGeom = new THREE.TorusGeometry(0.4, 0.08, 16, 16);
    const vWheel = new THREE.Mesh(vWheelGeom, neonOrange);
    vWheel.position.y = 0.4;
    vWheel.rotation.x = Math.PI / 2;
    valveGroup.add(vWheel);
    meshes.valveWheel = vWheel;
    
    valveGroup.position.set(0, 5.5, -2.5);
    valveGroup.rotation.x = Math.PI / 4;
    group.add(valveGroup);

    parts.push({
        name: "Dopamine Regulation Valve",
        description: "A precision micro-fluidic mechanical valve governing synthetic dopamine delivery.",
        material: "steel, neon orange",
        function: "Rewards the host brain for completing optimized computational cycles, ensuring physiological compliance.",
        assemblyOrder: 8,
        connections: ["Synaptic Modulators"],
        failureEffect: "Dopamine flooding causing uncontrollable euphoria and addictive behavioral feedback loops.",
        cascadeFailures: ["Synaptic Modulators"],
        originalPosition: { x: 0, y: 5.5, z: -2.5 },
        explodedPosition: { x: 0, y: 8, z: -6 }
    });

    // ==========================================
    // 9. Cranial Attachment Brackets
    // ==========================================
    const bracketGroup = new THREE.Group();
    const bracketShape = new THREE.Shape();
    bracketShape.moveTo(0, 0);
    bracketShape.lineTo(1.0, 0);
    bracketShape.lineTo(0.8, 1.2);
    bracketShape.lineTo(0.2, 1.2);
    bracketShape.lineTo(0, 0);
    
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const bracketGeom = new THREE.ExtrudeGeometry(bracketShape, { depth: 0.3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 });
        const bracket = new THREE.Mesh(bracketGeom, darkSteel);
        
        bracket.position.set(Math.cos(angle) * 4.4, 3.5, Math.sin(angle) * 4.4);
        bracket.rotation.y = -angle + Math.PI/2;
        bracket.rotation.x = -Math.PI / 6;
        bracketGroup.add(bracket);
    }
    
    group.add(bracketGroup);

    parts.push({
        name: "Cranial Attachment Brackets",
        description: "Six heavy-duty osseointegrated locking arms.",
        material: "darkSteel",
        function: "Surgically anchors the massive implant directly to the parietal and frontal bones of the skull, resisting massive G-forces.",
        assemblyOrder: 9,
        connections: ["Titanium Protective Casing"],
        failureEffect: "Implant migration resulting in massive brain hemorrhaging and severed neural pathways.",
        cascadeFailures: ["Cerebral Interface Mesh", "Titanium Protective Casing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Static explosion offset via children usually, kept 0 for simplicity
    });

    // ==========================================
    // 10. Data Fiber Bundles (Optical Output)
    // ==========================================
    const fiberGroup = new THREE.Group();
    meshes.fibers = [];
    const bundleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 2, -1),
        new THREE.Vector3(2, 3, -3),
        new THREE.Vector3(3, 2, -6)
    ]);
    
    for(let i=0; i<8; i++) {
        const fGeom = new THREE.TubeGeometry(bundleCurve, 32, 0.15, 8, false);
        const fMesh = new THREE.Mesh(fGeom, glass);
        
        // Arrange in a circular bundle
        const angle = (i/8)*Math.PI*2;
        fMesh.position.set(Math.cos(angle)*0.4, 0, Math.sin(angle)*0.4);
        fiberGroup.add(fMesh);
        meshes.fibers.push(fMesh);
    }
    
    fiberGroup.position.set(2, 5, 2);
    fiberGroup.rotation.y = Math.PI / 4;
    group.add(fiberGroup);

    parts.push({
        name: "Optical Data Fiber Bundles",
        description: "Thick, high-bandwidth fiber-optic cables meant to route out of the skull to external data ports.",
        material: "glass, glowing data",
        function: "Transmits exabytes of raw neuro-data to external servers for backup, processing, or network uploading.",
        assemblyOrder: 10,
        connections: ["Quantum Neural Matrix"],
        failureEffect: "Severe data bottleneck causing internal cognitive lag, looping thoughts, and a sensation of time-dilation.",
        cascadeFailures: ["Memory Backup Drive"],
        originalPosition: { x: 2, y: 5, z: 2 },
        explodedPosition: { x: 6, y: 8, z: 6 }
    });

    // ==========================================
    // 11. Sensory Override Module
    // ==========================================
    const sensoryGroup = new THREE.Group();
    const sensGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 6);
    const sensMesh = new THREE.Mesh(sensGeom, tinted);
    sensoryGroup.add(sensMesh);
    
    // Glowing nodes on the module
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const nGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const nMesh = new THREE.Mesh(nGeom, neonRed);
        nMesh.position.set(Math.cos(angle) * 0.6, 0.2, Math.sin(angle) * 0.6);
        sensoryGroup.add(nMesh);
        meshes[`sensNode_${i}`] = nMesh;
    }
    
    sensoryGroup.position.set(0, 5, 2.5);
    sensoryGroup.rotation.x = Math.PI / 2;
    group.add(sensoryGroup);

    parts.push({
        name: "Sensory Override Module",
        description: "A hexagonal coprocessor with high-speed direct access to the optical and auditory nerves.",
        material: "tinted glass, neon red",
        function: "Allows for augmented reality projection directly into the visual cortex and synthetic audio injection, overriding physical senses.",
        assemblyOrder: 11,
        connections: ["Quantum Neural Matrix", "Cerebral Interface Mesh"],
        failureEffect: "Permanent visual static, audio screeching, or complete sensory deprivation.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 5, z: 2.5 },
        explodedPosition: { x: 0, y: 5, z: 7 }
    });

    // ==========================================
    // 12. Motor Control Relay
    // ==========================================
    const motorGroup = new THREE.Group();
    const mGeom = new THREE.CylinderGeometry(0.5, 0.7, 1.0, 16);
    const mMesh = new THREE.Mesh(mGeom, steel);
    motorGroup.add(mMesh);
    
    const pistonGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    const pistonMesh = new THREE.Mesh(pistonGeom, chrome);
    pistonMesh.rotation.z = Math.PI / 2;
    motorGroup.add(pistonMesh);
    meshes.motorPiston = pistonMesh;

    motorGroup.position.set(-2.5, 4.5, 2.0);
    motorGroup.rotation.x = Math.PI / 4;
    motorGroup.rotation.z = -Math.PI / 4;
    group.add(motorGroup);

    parts.push({
        name: "Motor Control Relay",
        description: "A reinforced node physically connected to the brain's motor cortex.",
        material: "steel, chrome",
        function: "Hijacks or heavily assists voluntary muscle movements, enabling superhuman reaction times or remote puppeteering.",
        assemblyOrder: 12,
        connections: ["Quantum Neural Matrix", "Cerebral Interface Mesh"],
        failureEffect: "Violent seizures, localized paralysis, or 'locked-in' syndrome.",
        cascadeFailures: ["None"],
        originalPosition: { x: -2.5, y: 4.5, z: 2.0 },
        explodedPosition: { x: -6, y: 6, z: 5 }
    });

    // ==========================================
    // 13. Security Encryption Chip
    // ==========================================
    const secGroup = new THREE.Group();
    const secBoxGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 4); // Square diamond
    const secBox = new THREE.Mesh(secBoxGeom, plastic);
    secGroup.add(secBox);
    
    const secGlowGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 4);
    const secGlow = new THREE.Mesh(secGlowGeom, neonBlue);
    secGroup.add(secGlow);
    meshes.securityGlow = secGlow;
    
    secGroup.position.set(1.5, 4.8, -1.5);
    group.add(secGroup);

    parts.push({
        name: "Security Encryption Chip",
        description: "A self-destructing, quantum-encrypted solid-state chip.",
        material: "plastic, neon blue",
        function: "Protects the host's consciousness and data from being hacked, altered, or copied by rogue network agents.",
        assemblyOrder: 13,
        connections: ["Quantum Neural Matrix", "Data Fiber Bundles"],
        failureEffect: "Vulnerability to 'Ghost-hacking' where hostile entities can rewrite memories or steal consciousness.",
        cascadeFailures: ["Quantum Neural Matrix"],
        originalPosition: { x: 1.5, y: 4.8, z: -1.5 },
        explodedPosition: { x: 4, y: 7, z: -4 }
    });

    // ==========================================
    // 14. Memory Backup Drive
    // ==========================================
    const memGroup = new THREE.Group();
    const memBaseGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32);
    const memBase = new THREE.Mesh(memBaseGeom, darkSteel);
    memGroup.add(memBase);

    // Spinning platters
    meshes.memPlatters = [];
    for(let i=0; i<3; i++) {
        const platGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
        const platMesh = new THREE.Mesh(platGeom, chrome);
        platMesh.position.y = (i * 0.15) - 0.15;
        memGroup.add(platMesh);
        meshes.memPlatters.push(platMesh);
    }
    
    memGroup.position.set(-1.5, 4.8, -1.5);
    group.add(memGroup);

    parts.push({
        name: "Holographic Memory Backup Drive",
        description: "High-density spinning holographic storage platters in a vacuum-sealed chamber.",
        material: "darkSteel, chrome",
        function: "Continuously backs up short-term and long-term memory to prevent amnesia during traumatic system resets.",
        assemblyOrder: 14,
        connections: ["Quantum Neural Matrix"],
        failureEffect: "Irreversible short-term memory loss and anterograde amnesia (inability to form new memories).",
        cascadeFailures: ["None"],
        originalPosition: { x: -1.5, y: 4.8, z: -1.5 },
        explodedPosition: { x: -4, y: 7, z: -4 }
    });

    // ==========================================
    // 15. Nanobot Dispenser Port
    // ==========================================
    const nanoGroup = new THREE.Group();
    const nTubeGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16);
    const nTube = new THREE.Mesh(nTubeGeom, steel);
    nanoGroup.add(nTube);

    const nCapGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const nCap = new THREE.Mesh(nCapGeom, tinted);
    nCap.position.y = 0.5;
    nanoGroup.add(nCap);
    meshes.nanoCap = nCap;

    nanoGroup.position.set(0, 4.5, -3.5);
    nanoGroup.rotation.x = -Math.PI / 4;
    group.add(nanoGroup);

    parts.push({
        name: "Nanobot Dispenser Port",
        description: "A micro-silo containing billions of dormant medical nanobots suspended in a nutrient gel.",
        material: "steel, tinted glass",
        function: "Deploys nanobots directly into the bloodstream and cerebrospinal fluid to repair damaged neurons and fight rejection infections.",
        assemblyOrder: 15,
        connections: ["Titanium Protective Casing", "Cerebrospinal Fluid Pump"],
        failureEffect: "Rapid biological rejection of the implant, causing massive auto-immune response and death.",
        cascadeFailures: ["All Biological Systems"],
        originalPosition: { x: 0, y: 4.5, z: -3.5 },
        explodedPosition: { x: 0, y: 6, z: -7 }
    });

    // ==========================================
    // 16. Diagnostic LED Ring
    // ==========================================
    const ledGeom = new THREE.TorusGeometry(3.6, 0.05, 16, 64);
    const ledMesh = new THREE.Mesh(ledGeom, neonBlue);
    ledMesh.position.set(0, 5.5, 0);
    ledMesh.rotation.x = Math.PI / 2;
    group.add(ledMesh);
    meshes.ledRing = ledMesh;

    parts.push({
        name: "Diagnostic LED Ring",
        description: "A luminous ring visible through the scalp (if uncovered), indicating the implant's current operational phase.",
        material: "neon blue",
        function: "Provides immediate visual feedback to technicians regarding system health, power draw, and neural sync ratios.",
        assemblyOrder: 16,
        connections: ["Titanium Protective Casing"],
        failureEffect: "Loss of external diagnostic telemetry.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 5.5, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 }
    });

    // ==========================================
    // 17. Cerebrospinal Fluid Pump
    // ==========================================
    const pumpGroup = new THREE.Group();
    const pBodyGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const pBody = new THREE.Mesh(pBodyGeom, darkSteel);
    pumpGroup.add(pBody);

    const pGearGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 12);
    const pGear = new THREE.Mesh(pGearGeom, copper);
    pGear.rotation.x = Math.PI / 2;
    pGear.position.set(0, 0, 0.3);
    pumpGroup.add(pGear);
    meshes.pumpGear = pGear;

    pumpGroup.position.set(3.0, 4.5, -1.0);
    pumpGroup.rotation.z = Math.PI / 8;
    group.add(pumpGroup);

    parts.push({
        name: "Cerebrospinal Fluid Pump",
        description: "A high-pressure mechanical pump utilizing copper impellers.",
        material: "darkSteel, copper",
        function: "Actively cycles cerebrospinal fluid through the implant's heat sinks and filters out biological debris from the nanobots.",
        assemblyOrder: 17,
        connections: ["Cooling Micro-Fins", "Nanobot Dispenser Port"],
        failureEffect: "Fluid stagnation causing massive pressure build-up inside the cranium (hydrocephalus), leading to brain crushing.",
        cascadeFailures: ["Cooling Micro-Fins"],
        originalPosition: { x: 3.0, y: 4.5, z: -1.0 },
        explodedPosition: { x: 7, y: 6, z: -2 }
    });

    // ==========================================
    // 18. Signal Amplification Coils
    // ==========================================
    const coilGroup = new THREE.Group();
    meshes.coils = [];
    
    for(let i=0; i<4; i++) {
        const coilCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.5, 0),
            new THREE.Vector3(0.5, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(-0.5, 1.0, 0),
            new THREE.Vector3(0, 1.5, 0)
        ]);
        const cGeom = new THREE.TubeGeometry(coilCurve, 64, 0.08, 12, false);
        const cMesh = new THREE.Mesh(cGeom, copper);
        
        const angle = (i/4)*Math.PI*2;
        cMesh.position.set(Math.cos(angle)*2.5, 4.0, Math.sin(angle)*2.5);
        cMesh.rotation.y = -angle;
        coilGroup.add(cMesh);
        meshes.coils.push(cMesh);
    }
    
    group.add(coilGroup);

    parts.push({
        name: "Signal Amplification Coils",
        description: "Large, heavily wound copper induction coils wrapped around the lower matrix housing.",
        material: "copper",
        function: "Boosts faint biological neural signals to a readable voltage for the Quantum Neural Matrix, and step-downs high-voltage digital responses to safe biological levels.",
        assemblyOrder: 18,
        connections: ["Quantum Neural Matrix", "Cerebral Interface Mesh"],
        failureEffect: "Voltage spikes being sent directly into the brain, acting like a localized electro-shock therapy session.",
        cascadeFailures: ["Cerebral Interface Mesh"],
        originalPosition: { x: 0, y: 4.0, z: 0 },
        explodedPosition: { x: 0, y: 4.0, z: 0 }
    });

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the Cooling Micro-Fins Array?",
            options: [
                "To look aesthetically pleasing through the skull.",
                "To channel heat away from the quantum matrix into cranial fluid.",
                "To act as antennas for network connectivity.",
                "To slice through bone during installation."
            ],
            correctAnswer: 1,
            explanation: "The 90 high-surface-area aluminum extrusions dynamically channel heat away from the quantum matrix into the surrounding cranial fluid, preventing localized brain tissue boiling due to extreme thermal loads."
        },
        {
            question: "Which component is responsible for synthetically triggering neurotransmitter release to prevent rejection?",
            options: [
                "Motor Control Relay",
                "Diagnostic LED Ring",
                "Synaptic Modulators",
                "Bio-Electric Power Core"
            ],
            correctAnswer: 2,
            explanation: "The Synaptic Modulators are high-frequency resonance chambers that balance the brain's chemical state to prevent rejection of the implant and accelerate neuro-plasticity."
        },
        {
            question: "What catastrophic failure occurs if the Cerebrospinal Fluid Pump breaks down?",
            options: [
                "The user forgets how to speak.",
                "The implant runs out of battery.",
                "Massive pressure build-up inside the cranium (hydrocephalus), leading to brain crushing.",
                "The nanobots turn hostile."
            ],
            correctAnswer: 2,
            explanation: "Without the pump actively cycling fluid, stagnation causes massive fluid pressure build-up, literally crushing the brain against the skull."
        },
        {
            question: "How does the Security Encryption Chip protect the host?",
            options: [
                "By firing lasers at attackers.",
                "By using a self-destructing, quantum-encrypted solid-state chip to prevent ghost-hacking.",
                "By shocking the host awake if they are hacked.",
                "By downloading an antivirus from the internet."
            ],
            correctAnswer: 1,
            explanation: "It prevents hostile entities from 'Ghost-hacking' — rewriting memories or stealing the host's consciousness — by utilizing advanced quantum encryption."
        },
        {
            question: "What powers this massive cybernetic implant?",
            options: [
                "AA Batteries.",
                "Solar panels located on top of the head.",
                "A spinning gyroscopic fusion micro-reactor siphoning trace biological thermal energy.",
                "Kinetic motion from walking."
            ],
            correctAnswer: 2,
            explanation: "The Bio-Electric Power Core is a spinning gyroscopic fusion micro-reactor that provides virtually infinite, stable power without needing external recharging."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, activeMeshes) {
        const t = time * speed;

        // 1. Power Core Gyroscopes
        if (meshes.powerCoreOuterRing) {
            meshes.powerCoreOuterRing.rotation.x = t * 3.0;
            meshes.powerCoreOuterRing.rotation.y = t * 1.5;
        }
        if (meshes.powerCoreInnerRing) {
            meshes.powerCoreInnerRing.rotation.y = -t * 4.0;
            meshes.powerCoreInnerRing.rotation.z = t * 2.5;
        }
        if (meshes.powerCoreSphere) {
            // Pulsate emissive intensity
            meshes.powerCoreSphere.material.emissiveIntensity = 2.0 + Math.sin(t * 8) * 1.0;
        }

        // 2. Diagnostic LED Ring Breathing Effect
        if (meshes.ledRing) {
            meshes.ledRing.material.emissiveIntensity = 1.0 + Math.sin(t * 3) * 1.5;
        }

        // 3. Cerebrospinal Fluid Pump Gear
        if (meshes.pumpGear) {
            meshes.pumpGear.rotation.y = t * 5.0; // Spinning fast
        }

        // 4. Dopamine Valve Wheel Oscillating
        if (meshes.valveWheel) {
            meshes.valveWheel.rotation.z = Math.sin(t * 2) * Math.PI / 2;
        }

        // 5. Memory Backup Platters
        if (meshes.memPlatters) {
            meshes.memPlatters.forEach((platter, index) => {
                platter.rotation.y = t * (10 + index * 2); // Extremely fast spinning
            });
        }

        // 6. Security Chip Glitch/Blink
        if (meshes.securityGlow) {
            // Random blinking effect
            meshes.securityGlow.material.emissiveIntensity = Math.random() > 0.9 ? 0 : 3.0;
        }

        // 7. Motor Piston Pumping
        if (meshes.motorPiston) {
            meshes.motorPiston.position.x = Math.sin(t * 15) * 0.2;
        }

        // 8. Sensory Nodes Chaser Lights
        for (let i = 0; i < 6; i++) {
            const node = meshes[`sensNode_${i}`];
            if (node) {
                const phase = (i / 6) * Math.PI * 2;
                node.material.emissiveIntensity = Math.max(0, Math.sin(t * 10 + phase) * 3);
            }
        }

        // 9. Neural Electrodes Micro-adjustments
        if (meshes.electrodes) {
            meshes.electrodes.forEach((elData) => {
                // Electrodes constantly probing up and down microscopically
                const offset = Math.sin(t * 20 + elData.phase) * 0.1;
                elData.mesh.position.y = -(elData.baseLength / 2) + offset;
            });
        }

        // 10. Data Fibers Data-Flow Effect
        if (meshes.fibers) {
            meshes.fibers.forEach((fiber, index) => {
                // Change color randomly to simulate data pulses
                if (Math.random() > 0.95) {
                    fiber.material = Math.random() > 0.5 ? dataGlow : glass;
                }
            });
        }
    }

    return { group, parts, description: "A hyper-advanced, massively complex Cybernetic Neural Implant designed to bridge human consciousness with quantum computational networks. Features extensive life-support, bio-chemical regulation, and military-grade encryption.", quizQuestions, animate };
}
