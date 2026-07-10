import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Main Mast
    const mastGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const mastMesh = new THREE.Mesh(mastGeo, darkSteel);
    mastMesh.position.set(0, 0, 0);
    group.add(mastMesh);
    parts.push({
        name: "Main Mast",
        description: "The primary drive shaft that transmits torque from the transmission to the rotor hub.",
        material: "darkSteel",
        function: "Power transmission",
        assemblyOrder: 1,
        connections: ["Transmission", "Rotor Hub"],
        failureEffect: "Complete loss of rotor drive, catastrophic failure",
        cascadeFailures: ["Rotor stall", "Loss of lift"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: mastMesh
    });

    // 2. Stationary Swashplate
    const statSwashGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 64);
    const statSwashMesh = new THREE.Mesh(statSwashGeo, aluminum);
    statSwashMesh.rotation.x = Math.PI / 2;
    statSwashMesh.position.set(0, -1, 0);
    group.add(statSwashMesh);
    parts.push({
        name: "Stationary Swashplate",
        description: "Non-rotating ring that tilts and slides vertically to transfer control inputs to the rotating swashplate.",
        material: "aluminum",
        function: "Flight control input translation",
        assemblyOrder: 2,
        connections: ["Flight Controls", "Rotating Swashplate"],
        failureEffect: "Loss of cyclic and collective control",
        cascadeFailures: ["Uncontrolled flight path"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -3, z: 0},
        mesh: statSwashMesh
    });

    // 3. Rotating Swashplate
    const rotSwashGeo = new THREE.TorusGeometry(1.5, 0.25, 16, 64);
    const rotSwashMesh = new THREE.Mesh(rotSwashGeo, chrome);
    rotSwashMesh.rotation.x = Math.PI / 2;
    rotSwashMesh.position.set(0, -0.7, 0);
    
    // Add glowing accent to rotating swashplate
    const rotSwashGlowGeo = new THREE.TorusGeometry(1.52, 0.05, 16, 64);
    const rotSwashGlow = new THREE.Mesh(rotSwashGlowGeo, neonBlue);
    rotSwashMesh.add(rotSwashGlow);

    group.add(rotSwashMesh);
    parts.push({
        name: "Rotating Swashplate",
        description: "Follows the movement of the stationary swashplate while rotating with the mast to pitch the blades.",
        material: "chrome",
        function: "Dynamic pitch control",
        assemblyOrder: 3,
        connections: ["Stationary Swashplate", "Pitch Links"],
        failureEffect: "Loss of rotor blade pitch control",
        cascadeFailures: ["Rotor blade divergence"],
        originalPosition: {x: 0, y: -0.7, z: 0},
        explodedPosition: {x: 0, y: -1, z: 0},
        mesh: rotSwashMesh
    });

    // 4. Rotor Hub
    const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 32);
    const hubMesh = new THREE.Mesh(hubGeo, steel);
    hubMesh.position.set(0, 2, 0);
    group.add(hubMesh);
    parts.push({
        name: "Rotor Hub",
        description: "The central mounting point for the rotor blades, attaching them to the main mast.",
        material: "steel",
        function: "Blade retention and force distribution",
        assemblyOrder: 4,
        connections: ["Main Mast", "Blade Grips"],
        failureEffect: "Blade separation",
        cascadeFailures: ["Catastrophic airframe loss"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0},
        mesh: hubMesh
    });

    // Blades and Pitch Links (4-blade system)
    const bladeCount = 4;
    const bladesGroup = new THREE.Group();
    hubMesh.add(bladesGroup); // attached to hub so they rotate together
    
    const pitchLinksGroup = new THREE.Group();
    rotSwashMesh.add(pitchLinksGroup);

    for (let i = 0; i < bladeCount; i++) {
        const angle = (i / bladeCount) * Math.PI * 2;
        
        // Blade Grip
        const gripGeo = new THREE.BoxGeometry(2, 0.4, 0.6);
        const gripMesh = new THREE.Mesh(gripGeo, aluminum);
        gripMesh.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
        gripMesh.rotation.y = -angle;
        bladesGroup.add(gripMesh);

        // Blade
        const bladeGeo = new THREE.BoxGeometry(10, 0.1, 1);
        const bladeMesh = new THREE.Mesh(bladeGeo, darkSteel);
        bladeMesh.position.set(5, 0, 0);
        
        // Glowing tip
        const tipGeo = new THREE.BoxGeometry(0.5, 0.15, 1.05);
        const tipMesh = new THREE.Mesh(tipGeo, neonOrange);
        tipMesh.position.set(4.8, 0, 0);
        bladeMesh.add(tipMesh);

        gripMesh.add(bladeMesh);

        parts.push({
            name: `Rotor Blade & Grip ${i+1}`,
            description: "Aerodynamic surface providing lift and thrust, mounted in a grip allowing pitch changes.",
            material: "darkSteel/aluminum",
            function: "Lift generation",
            assemblyOrder: 5 + i,
            connections: ["Rotor Hub", "Pitch Link"],
            failureEffect: "Severe vibration, loss of lift",
            cascadeFailures: ["Structural disintegration"],
            originalPosition: {x: Math.cos(angle) * 2, y: 2, z: Math.sin(angle) * 2},
            explodedPosition: {x: Math.cos(angle) * 8, y: 2, z: Math.sin(angle) * 8},
            mesh: gripMesh
        });

        // Pitch Link
        const linkLength = 2.7;
        const linkGeo = new THREE.CylinderGeometry(0.08, 0.08, linkLength, 16);
        const linkMesh = new THREE.Mesh(linkGeo, steel);
        
        // Positioned between rotating swashplate and blade grip horn
        const linkX = Math.cos(angle) * 1.3;
        const linkZ = Math.sin(angle) * 1.3;
        linkMesh.position.set(linkX, linkLength / 2, linkZ);
        pitchLinksGroup.add(linkMesh);
        
        parts.push({
            name: `Pitch Link ${i+1}`,
            description: "Mechanical linkage transferring swashplate tilt to the blade grip to change blade pitch.",
            material: "steel",
            function: "Pitch actuation",
            assemblyOrder: 9 + i,
            connections: ["Rotating Swashplate", "Blade Grip"],
            failureEffect: "Loss of pitch control for single blade",
            cascadeFailures: ["Extreme vibration", "Mast bumping"],
            originalPosition: {x: linkX, y: -0.7 + (linkLength / 2), z: linkZ},
            explodedPosition: {x: linkX * 3, y: 0, z: linkZ * 3},
            mesh: linkMesh
        });
    }

    const description = "The Aerospace Helicopter Rotor Hub is a complex mechanical assembly responsible for transmitting engine power, altering blade pitch for collective and cyclic control, and managing aerodynamic forces.";

    const quizQuestions = [
        {
            question: "What is the primary function of the swashplate assembly?",
            options: [
                "To cool the transmission during high-torque operations.",
                "To translate non-rotating flight control inputs into rotating blade pitch changes.",
                "To measure the RPM of the main rotor.",
                "To dampen vibrations from the tail rotor."
            ],
            correct: 1,
            explanation: "The swashplate assembly consists of a stationary and a rotating plate, allowing control inputs from the cockpit to be transferred to the spinning rotor blades.",
            difficulty: "Medium"
        },
        {
            question: "Which component directly links the rotating swashplate to the blade grips?",
            options: [
                "Main Mast",
                "Scissor Links",
                "Pitch Links",
                "Dampers"
            ],
            correct: 2,
            explanation: "Pitch links are rods that connect the rotating swashplate to the pitch horn of the blade grips, physically changing the pitch angle of the blades.",
            difficulty: "Easy"
        },
        {
            question: "What would be the effect of a complete stationary swashplate failure?",
            options: [
                "Immediate engine shutdown.",
                "Loss of collective and cyclic control.",
                "The tail rotor would compensate automatically.",
                "Only forward flight would be disabled."
            ],
            correct: 1,
            explanation: "Because the stationary swashplate transmits all pilot collective and cyclic inputs to the rotating swashplate, its failure results in total loss of main rotor flight control.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // time: elapsed time in seconds
        // speed: user defined animation speed multiplier
        
        const rotationSpeed = time * speed * 5;
        
        // Rotate Mast and Hub
        mastMesh.rotation.y = rotationSpeed;
        hubMesh.rotation.y = rotationSpeed;
        
        // Cyclic Pitch simulation (Swashplate tilting)
        const cyclicTiltX = Math.sin(time * speed) * 0.15;
        const cyclicTiltZ = Math.cos(time * speed) * 0.15;
        
        statSwashMesh.rotation.x = Math.PI / 2 + cyclicTiltX;
        statSwashMesh.rotation.y = cyclicTiltZ;
        
        // Rotate the Rotating Swashplate
        rotSwashMesh.rotation.order = 'YXZ';
        rotSwashMesh.rotation.y = rotationSpeed;
        rotSwashMesh.rotation.x = Math.PI / 2 + cyclicTiltX;
        rotSwashMesh.rotation.z = cyclicTiltZ;

        // Animate blade pitch dynamically based on rotation position (cyclic)
        bladesGroup.children.forEach((grip, i) => {
            const angle = (i / bladeCount) * Math.PI * 2;
            const currentWorldAngle = angle + rotationSpeed;
            // Collective pitch (base) + Cyclic pitch (sine wave based on position)
            const collectivePitch = 0.1;
            const cyclicPitch = Math.sin(currentWorldAngle) * 0.2;
            grip.rotation.x = collectivePitch + cyclicPitch;
        });
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
export function createHelicopterRotorHead() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
