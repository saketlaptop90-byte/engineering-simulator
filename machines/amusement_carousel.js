import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const neonYellow = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const meshes = {};

    // 1. Base Platform
    const baseGeometry = new THREE.CylinderGeometry(8, 8, 0.5, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Main Platform Base",
        description: "Heavy steel platform housing the main drive motor and bearing assemblies.",
        material: "Dark Steel",
        function: "Supports the entire rotating structure of the carousel.",
        assemblyOrder: 1,
        connections: ["Center Pole", "Drive Motor"],
        failureEffect: "Structural instability leading to catastrophic tilt.",
        cascadeFailures: ["Center Pole", "Drive Motor", "All Rider Seats"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Rotating Deck
    const deckGeometry = new THREE.CylinderGeometry(7.8, 7.8, 0.2, 64);
    const deckMesh = new THREE.Mesh(deckGeometry, chrome);
    deckMesh.position.set(0, 0.6, 0);
    group.add(deckMesh);
    meshes.deck = deckMesh;

    parts.push({
        name: "Rotating Deck",
        description: "Chrome-finished deck where riders walk and access mounts.",
        material: "Chrome",
        function: "Provides the rotating floor interface for patrons.",
        assemblyOrder: 2,
        connections: ["Main Platform Base", "Center Pole", "Mount Poles"],
        failureEffect: "Friction against base, causing sudden stops.",
        cascadeFailures: ["Drive Motor"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 3. Center Pole
    const centerPoleGeometry = new THREE.CylinderGeometry(0.8, 0.8, 8, 32);
    const centerPoleMesh = new THREE.Mesh(centerPoleGeometry, steel);
    centerPoleMesh.position.set(0, 4.6, 0);
    group.add(centerPoleMesh);
    meshes.centerPole = centerPoleMesh;

    parts.push({
        name: "Central Support Axis",
        description: "Main central pillar providing vertical support to the canopy and drive mechanism.",
        material: "Steel",
        function: "Rotates and acts as the structural spine of the machine.",
        assemblyOrder: 3,
        connections: ["Main Platform Base", "Rotating Deck", "Canopy", "Drive Gear"],
        failureEffect: "Total structural collapse.",
        cascadeFailures: ["Canopy", "Mount Poles", "Rotating Deck"],
        originalPosition: { x: 0, y: 4.6, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 4. Canopy Top
    const canopyGeometry = new THREE.ConeGeometry(8.5, 2, 64);
    const canopyMesh = new THREE.Mesh(canopyGeometry, neonPink);
    canopyMesh.position.set(0, 9.6, 0);
    group.add(canopyMesh);
    meshes.canopy = canopyMesh;

    parts.push({
        name: "High-Tech Canopy",
        description: "Neon-lined roof structure shielding riders and housing upper bearings.",
        material: "Neon Pink Matrix",
        function: "Aesthetic cover and structural brace for the top of the mount poles.",
        assemblyOrder: 4,
        connections: ["Central Support Axis", "Mount Poles"],
        failureEffect: "Mount poles lose upper stabilization, causing immense stress.",
        cascadeFailures: ["Mount Poles", "Rider Seats"],
        originalPosition: { x: 0, y: 9.6, z: 0 },
        explodedPosition: { x: 0, y: 14, z: 0 }
    });

    // 5. Mount Poles and Riders (Horses/Vehicles)
    const poleCount = 8;
    meshes.poles = [];
    meshes.riders = [];
    
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 7, 16);
    const riderGeometry = new THREE.BoxGeometry(1, 1, 2); // Abstract futuristic vehicle

    for (let i = 0; i < poleCount; i++) {
        const angle = (i / poleCount) * Math.PI * 2;
        const radius = 5.5;
        
        const poleGroup = new THREE.Group();
        poleGroup.position.set(Math.cos(angle) * radius, 4.2, Math.sin(angle) * radius);
        
        const poleMesh = new THREE.Mesh(poleGeometry, chrome);
        poleGroup.add(poleMesh);
        
        const riderMesh = new THREE.Mesh(riderGeometry, i % 2 === 0 ? neonBlue : neonYellow);
        riderMesh.position.set(0, 0, 0);
        // Face tangential to circle
        riderMesh.rotation.y = -angle;
        poleGroup.add(riderMesh);
        
        group.add(poleGroup);
        
        meshes.poles.push({ group: poleGroup, rider: riderMesh, angle: angle });
        
        parts.push({
            name: `Pneumatic Mount Pole ${i+1}`,
            description: `Chrome pole with internal pneumatic lift for vehicle ${i+1}.`,
            material: "Chrome",
            function: "Moves vehicle up and down while stabilizing it rotationally.",
            assemblyOrder: 5 + i * 2,
            connections: ["Rotating Deck", "High-Tech Canopy", `Futuristic Vehicle ${i+1}`],
            failureEffect: `Vehicle ${i+1} jams in place.`,
            cascadeFailures: [],
            originalPosition: { x: Math.cos(angle) * radius, y: 4.2, z: Math.sin(angle) * radius },
            explodedPosition: { x: Math.cos(angle) * (radius + 5), y: 4.2, z: Math.sin(angle) * (radius + 5) }
        });

        parts.push({
            name: `Futuristic Vehicle ${i+1}`,
            description: `Neon-lit abstract vehicle module for riders.`,
            material: i % 2 === 0 ? "Neon Blue" : "Neon Yellow",
            function: "Safely houses the rider during operation.",
            assemblyOrder: 6 + i * 2,
            connections: [`Pneumatic Mount Pole ${i+1}`],
            failureEffect: "Rider exposed to unsafe g-forces.",
            cascadeFailures: [],
            originalPosition: { x: Math.cos(angle) * radius, y: 4.2, z: Math.sin(angle) * radius },
            explodedPosition: { x: Math.cos(angle) * (radius + 8), y: 4.2, z: Math.sin(angle) * (radius + 8) }
        });
    }

    const description = "A highly advanced, cyber-themed amusement carousel. Features a massive central axis, pneumatic mount poles, and striking neon-lit futuristic vehicles. Demonstrates centripetal force and complex dual-axis animation mechanics.";

    const quizQuestions = [
        {
            question: "In this carousel, what mechanism is responsible for moving the futuristic vehicles up and down?",
            options: ["The Main Drive Motor", "The Rotating Deck", "Internal Pneumatic Lifts in the Mount Poles", "Centrifugal Force"],
            correct: 2,
            explanation: "The mount poles feature internal pneumatic lifts that actuate the vertical motion of the vehicles independent of the main rotational drive.",
            difficulty: "Medium"
        },
        {
            question: "Why is the High-Tech Canopy structurally important?",
            options: ["It protects the neon lights from rain.", "It provides an upper stabilization brace for the mount poles.", "It houses the main drive motor.", "It powers the central axis."],
            correct: 1,
            explanation: "The canopy acts as a crucial upper bearing brace for the mount poles, preventing them from snapping outward due to centrifugal forces.",
            difficulty: "Hard"
        },
        {
            question: "If the main rotating deck experiences extreme friction against the base platform, which component is at highest risk of cascading failure?",
            options: ["The Futuristic Vehicles", "The High-Tech Canopy", "The Drive Motor", "The Neon Lights"],
            correct: 2,
            explanation: "Excessive friction on the rotating deck would require the drive motor to exert torque beyond its design limits, leading to overheating and mechanical failure.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Global rotation
        const rotationSpeed = speed * 0.5;
        
        // Rotate the entire group that needs to spin (deck, pole, canopy, mounts)
        // Note: base platform stays still
        if(meshesObj.deck) meshesObj.deck.rotation.y = time * rotationSpeed;
        if(meshesObj.centerPole) meshesObj.centerPole.rotation.y = time * rotationSpeed;
        if(meshesObj.canopy) meshesObj.canopy.rotation.y = time * rotationSpeed;
        
        if (meshesObj.poles) {
            meshesObj.poles.forEach((poleData, index) => {
                // Rotate pole around center
                const currentAngle = poleData.angle + time * rotationSpeed;
                const radius = 5.5;
                poleData.group.position.x = Math.cos(currentAngle) * radius;
                poleData.group.position.z = Math.sin(currentAngle) * radius;
                
                // Keep rider facing tangentially
                poleData.rider.rotation.y = -currentAngle;
                
                // Bobbing motion up and down (pneumatic lift)
                // Use index to offset the wave phase
                const bobOffset = Math.sin((time * speed * 2) + index) * 1.5;
                poleData.rider.position.y = bobOffset;
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createGrandCarousel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
