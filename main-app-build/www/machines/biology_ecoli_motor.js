import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const glowPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.5,
        wireframe: true
    });
    
    const organicMembrane = new THREE.MeshPhysicalMaterial({
        color: 0x2c4a3b,
        emissive: 0x112211,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const bioMetal = new THREE.MeshStandardMaterial({
        color: 0xaabbcc,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x112233
    });

    // Helper to add parts
    function addPart(mesh, info) {
        mesh.name = info.name;
        mesh.position.set(info.originalPosition.x, info.originalPosition.y, info.originalPosition.z);
        group.add(mesh);
        
        parts.push({
            ...info,
            mesh: mesh
        });
    }

    // 1. Inner Membrane (Stator Framework)
    const innerMembraneGeo = new THREE.TorusGeometry(3, 0.5, 32, 64);
    const innerMembraneMesh = new THREE.Mesh(innerMembraneGeo, organicMembrane);
    innerMembraneMesh.rotation.x = Math.PI / 2;
    addPart(innerMembraneMesh, {
        name: "Inner Membrane Framework",
        description: "The inner bacterial membrane that anchors the stator complexes.",
        material: "Organic Membrane",
        function: "Structural support and separation of the periplasm from the cytoplasm.",
        assemblyOrder: 1,
        connections: ["MotA/MotB Complex"],
        failureEffect: "Loss of structural integrity, motor detachment.",
        cascadeFailures: ["Complete motor disassembly"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 2. C Ring (Cytoplasmic Ring / Rotor)
    const cRingGeo = new THREE.CylinderGeometry(2.5, 2.8, 1.5, 64);
    const cRingMesh = new THREE.Mesh(cRingGeo, glowBlue);
    addPart(cRingMesh, {
        name: "C Ring (Switch Complex)",
        description: "The cytoplasmic ring acting as a rotor and directional switch.",
        material: "Bioluminescent Protein (FliG/FliM/FliN)",
        function: "Determines the direction of rotation (CW/CCW) and interacts with stator to generate torque.",
        assemblyOrder: 2,
        connections: ["MS Ring", "Stator"],
        failureEffect: "Inability to switch rotation direction or generate torque.",
        cascadeFailures: ["Loss of motility"],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 3. MS Ring (Membrane/Supramembrane Ring)
    const msRingGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 64);
    const msRingMesh = new THREE.Mesh(msRingGeo, bioMetal);
    addPart(msRingMesh, {
        name: "MS Ring",
        description: "The first structural component assembled in the membrane.",
        material: "Bio-Metal (FliF)",
        function: "Acts as a foundation for the motor, connecting the rotor to the rod.",
        assemblyOrder: 3,
        connections: ["C Ring", "Rod"],
        failureEffect: "Complete failure to assemble motor.",
        cascadeFailures: ["Flagellar agenesis"],
        originalPosition: { x: 0, y: -1.8, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 4. Stator (MotA/MotB complexes) - multiple cylinders around the rings
    const statorGroup = new THREE.Group();
    const statorCount = 11;
    for(let i=0; i<statorCount; i++) {
        const angle = (i / statorCount) * Math.PI * 2;
        const statorGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
        const statorM = new THREE.Mesh(statorGeo, glowGreen);
        statorM.position.set(Math.cos(angle) * 3, -2.5, Math.sin(angle) * 3);
        statorGroup.add(statorM);
    }
    addPart(statorGroup, {
        name: "Stator Complex (MotA/MotB)",
        description: "Proton-conducting channels anchored to the peptidoglycan layer.",
        material: "Neon Protein Matrix",
        function: "Conducts protons (H+) across the membrane to generate torque on the rotor.",
        assemblyOrder: 4,
        connections: ["C Ring", "Peptidoglycan Layer"],
        failureEffect: "Loss of power source.",
        cascadeFailures: ["Motor stalls completely"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 6 }
    });

    // 5. Rod (Drive Shaft)
    const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    const rodMesh = new THREE.Mesh(rodGeo, steel);
    addPart(rodMesh, {
        name: "Drive Shaft (Rod)",
        description: "Transmits torque from the motor to the hook.",
        material: "Titanium-Protein Composite",
        function: "Mechanical transmission of rotational energy.",
        assemblyOrder: 5,
        connections: ["MS Ring", "Hook", "P Ring", "L Ring"],
        failureEffect: "Snapping of the shaft.",
        cascadeFailures: ["Flagellum detachment", "Loss of propulsion"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 6. P & L Rings (Bushings)
    const plRingGroup = new THREE.Group();
    const pRingGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
    const pRing = new THREE.Mesh(pRingGeo, glass);
    pRing.rotation.x = Math.PI / 2;
    pRing.position.y = -0.5;
    
    const lRingGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
    const lRing = new THREE.Mesh(lRingGeo, chrome);
    lRing.rotation.x = Math.PI / 2;
    lRing.position.y = 1.0;
    
    plRingGroup.add(pRing);
    plRingGroup.add(lRing);
    
    addPart(plRingGroup, {
        name: "P & L Rings (Bushings)",
        description: "Rings acting as a bushing to allow the rod to spin with minimal friction.",
        material: "Glass/Chrome Biopolymer",
        function: "Reduces friction and acts as a seal as the rod passes through the outer membrane.",
        assemblyOrder: 6,
        connections: ["Rod", "Outer Membrane"],
        failureEffect: "High friction, motor burnout.",
        cascadeFailures: ["Structural damage to cell wall"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 7. Hook (Universal Joint)
    const hookCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1.5, 0),
        new THREE.Vector3(1.5, 2.5, 0)
    );
    const hookGeo = new THREE.TubeGeometry(hookCurve, 20, 0.5, 16, false);
    const hookMesh = new THREE.Mesh(hookGeo, rubber);
    addPart(hookMesh, {
        name: "Universal Joint (Hook)",
        description: "A flexible coupling made of FlgE proteins.",
        material: "Flexible Bio-Rubber",
        function: "Transmits torque while allowing the flagellar filament to operate at an angle.",
        assemblyOrder: 7,
        connections: ["Rod", "Filament"],
        failureEffect: "Inability to orient thrust.",
        cascadeFailures: ["Erratic swimming patterns"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 8. Filament (Propeller)
    const filamentGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16, 64);
    // Twist the geometry to look like a helix/flagellum
    const positionAttribute = filamentGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const y = positionAttribute.getY(i);
        const angle = y * 1.5;
        const radiusOffset = Math.sin(y * 2) * 0.5;
        const x = positionAttribute.getX(i) + Math.cos(angle) * radiusOffset;
        const z = positionAttribute.getZ(i) + Math.sin(angle) * radiusOffset;
        positionAttribute.setXYZ(i, x, y, z);
    }
    filamentGeo.computeVertexNormals();
    
    const filamentMesh = new THREE.Mesh(filamentGeo, glowPurple);
    // Align filament with the end of the hook
    filamentMesh.position.set(1.5, 7.5, 0);
    // We group it to rotate around the hook connection point
    const filamentGroup = new THREE.Group();
    filamentGroup.position.set(1.5, 2.5, 0); // Hook end
    filamentMesh.position.set(0, 5, 0); // Relative to hook end
    filamentGroup.add(filamentMesh);

    addPart(filamentGroup, {
        name: "Flagellar Filament (Propeller)",
        description: "A long helical polymer of flagellin extending into the environment.",
        material: "Holographic Purple Matrix",
        function: "Acts as a propeller to drive the bacterium forward.",
        assemblyOrder: 8,
        connections: ["Hook"],
        failureEffect: "Loss of propulsion.",
        cascadeFailures: ["Bacterium becomes stationary"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 3, y: 15, z: 0 }
    });

    // Particle System: Protons flowing through the Stator
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        particlePos[i*3] = (Math.random() - 0.5) * 8;
        particlePos[i*3+1] = Math.random() * 4 - 4;
        particlePos[i*3+2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const protons = new THREE.Points(particleGeo, particleMat);
    group.add(protons);

    const description = "The E. Coli Flagellar Motor is a marvel of biological engineering. It is a highly efficient rotary engine powered by an electrochemical gradient of protons across the bacterial inner membrane. Capable of spinning up to 1000 Hz, it features a stator, a rotor, a drive shaft, a universal joint, and a helical propeller.";

    const quizQuestions = [
        {
            question: "What powers the E. Coli flagellar motor?",
            options: [
                "ATP hydrolysis",
                "Proton motive force (H+ gradient)",
                "Solar energy",
                "Magnetic fields"
            ],
            correct: 1,
            explanation: "The MotA/MotB stator complex conducts protons across the inner membrane, converting the electrochemical gradient into mechanical torque.",
            difficulty: "Medium"
        },
        {
            question: "Which component acts as a universal joint to transmit torque to an off-axis propeller?",
            options: [
                "C Ring",
                "Hook",
                "L Ring",
                "Rod"
            ],
            correct: 1,
            explanation: "The hook is a flexible coupling that connects the rigid drive shaft (rod) to the helical filament, allowing it to act as a universal joint.",
            difficulty: "Medium"
        },
        {
            question: "Which ring acts as the directional switch (CW / CCW) for the motor?",
            options: [
                "P Ring",
                "L Ring",
                "MS Ring",
                "C Ring"
            ],
            correct: 3,
            explanation: "The C Ring (cytoplasmic ring) interacts with chemotaxis proteins to switch the motor's rotation direction, enabling the bacterium to tumble or run.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by name
        const cRing = meshes.find(m => m.name === "C Ring (Switch Complex)")?.mesh;
        const rod = meshes.find(m => m.name === "Drive Shaft (Rod)")?.mesh;
        const hook = meshes.find(m => m.name === "Universal Joint (Hook)")?.mesh;
        const filament = meshes.find(m => m.name === "Flagellar Filament (Propeller)")?.mesh;

        // Base rotation logic
        const rotationSpeed = speed * 0.02;

        if (cRing) cRing.rotation.y = time * rotationSpeed;
        if (rod) rod.rotation.y = time * rotationSpeed;
        
        // The filament rotates rapidly
        if (filament) {
            filament.rotation.y = time * rotationSpeed * 2; 
        }

        // Animate protons flowing downwards through stators
        const positions = protons.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            positions[i*3+1] -= speed * 0.05; // move down
            if(positions[i*3+1] < -5) {
                positions[i*3+1] = 0; // reset to top of stator
            }
        }
        protons.geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createEcoliMotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
