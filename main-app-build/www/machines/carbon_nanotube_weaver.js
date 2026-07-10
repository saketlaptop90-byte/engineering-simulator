import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Carbon Nanotube Weaver is an advanced materials spindler designed to spin millions of microscopic, glowing neon nanotube threads into ultra-strong space elevator cables.";

    // Custom glowing materials
    const glowingNeon = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.7
    });

    const energyCore = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3,
        roughness: 0,
        metalness: 1,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(15, 16, 2, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    parts.push({
        name: "Foundation Platform",
        description: "Massive dark steel foundation designed to dampen microscopic vibrations during the weaving process.",
        material: "darkSteel",
        function: "Stability",
        assemblyOrder: 1,
        connections: ["Central Loom Array", "Cooling Pumps"],
        failureEffect: "Vibration introduces flaws in the nanotube crystalline structure.",
        cascadeFailures: ["Thread Snap", "Central Loom Array Misalignment"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Central Loom Array
    const loomGeo = new THREE.CylinderGeometry(8, 8, 20, 32);
    const loomMesh = new THREE.Mesh(loomGeo, chrome);
    loomMesh.position.set(0, 12, 0);
    group.add(loomMesh);
    parts.push({
        name: "Central Loom Array",
        description: "A highly polished chrome cylinder that organizes incoming raw carbon strings into a unified matrix.",
        material: "chrome",
        function: "Thread Alignment",
        assemblyOrder: 2,
        connections: ["Foundation Platform", "Nanotube Threads", "Spindle Rotor"],
        failureEffect: "Misalignment causes tangling of threads.",
        cascadeFailures: ["Catastrophic Snapping"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 3. Spindle Rotor (Outer Ring)
    const rotorGeo = new THREE.TorusGeometry(12, 2, 32, 64);
    const rotorMesh = new THREE.Mesh(rotorGeo, steel);
    rotorMesh.position.set(0, 12, 0);
    rotorMesh.rotation.x = Math.PI / 2;
    group.add(rotorMesh);
    parts.push({
        name: "Spindle Rotor",
        description: "Rotating magnetic ring that twists the organized carbon matrix into an ultra-dense cable.",
        material: "steel",
        function: "Twisting and Compressing",
        assemblyOrder: 3,
        connections: ["Central Loom Array", "Magnetic Stators"],
        failureEffect: "Loss of twisting torque leads to weak cable formation.",
        cascadeFailures: ["Cable Failure under load"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 25 }
    });

    // 4. Glowing Nanotube Threads
    const threadGeo = new THREE.CylinderGeometry(3, 0.5, 20, 32, 1, true);
    const threadMesh = new THREE.Mesh(threadGeo, glowingNeon);
    threadMesh.position.set(0, 12, 0);
    group.add(threadMesh);
    parts.push({
        name: "Nanotube Threads",
        description: "Millions of microscopic glowing carbon nanotube threads converging into a solid cable.",
        material: "glowingNeon",
        function: "Raw Material",
        assemblyOrder: 4,
        connections: ["Central Loom Array", "Output Spool"],
        failureEffect: "Thread fracture and tension loss.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // 5. Output Cable
    const cableGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 16);
    const cableMesh = new THREE.Mesh(cableGeo, glowingPink);
    cableMesh.position.set(0, 29.5, 0);
    group.add(cableMesh);
    parts.push({
        name: "Space Elevator Cable",
        description: "The finalized ultra-strong space elevator cable.",
        material: "glowingPink",
        function: "Finished Product",
        assemblyOrder: 5,
        connections: ["Nanotube Threads"],
        failureEffect: "Production halt.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 29.5, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 6. Magnetic Stators
    for(let i=0; i<4; i++) {
        const statorGeo = new THREE.BoxGeometry(4, 8, 4);
        const statorMesh = new THREE.Mesh(statorGeo, aluminum);
        const angle = (i / 4) * Math.PI * 2;
        statorMesh.position.set(Math.cos(angle)*16, 12, Math.sin(angle)*16);
        group.add(statorMesh);
        
        parts.push({
            name: `Magnetic Stator ${i+1}`,
            description: "Generates the magnetic field needed to levitate and spin the Spindle Rotor frictionlessly.",
            material: "aluminum",
            function: "Magnetic Levitation",
            assemblyOrder: 6 + i,
            connections: ["Foundation Platform", "Spindle Rotor"],
            failureEffect: "Rotor crash and catastrophic friction.",
            cascadeFailures: ["Spindle Rotor Destruction", "Central Loom Array Destruction"],
            originalPosition: { x: Math.cos(angle)*16, y: 12, z: Math.sin(angle)*16 },
            explodedPosition: { x: Math.cos(angle)*35, y: 12, z: Math.sin(angle)*35 }
        });
    }

    const quizQuestions = [
        {
            question: "Why must the Foundation Platform dampen microscopic vibrations?",
            options: [
                "To prevent the machine from sliding across the floor",
                "To reduce noise pollution in the factory",
                "To prevent flaws from forming in the nanotube crystalline structure",
                "To save electricity"
            ],
            correct: 2,
            explanation: "Carbon nanotube weaving occurs at a nearly atomic scale. Any vibration can misalign the threads and cause weak points in the final crystalline structure.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Spindle Rotor?",
            options: [
                "To heat the raw materials",
                "To rotate and twist the organized carbon matrix into an ultra-dense cable",
                "To cool the resulting cable",
                "To cut the cable to length"
            ],
            correct: 1,
            explanation: "The Spindle Rotor applies twisting torque, converting a parallel array of microscopic threads into a single tightly-bound cable.",
            difficulty: "Easy"
        },
        {
            question: "What prevents the Spindle Rotor from generating immense friction at high speeds?",
            options: [
                "Heavy application of synthetic oil",
                "Water cooling jackets",
                "Magnetic levitation via Stators",
                "Ceramic ball bearings"
            ],
            correct: 2,
            explanation: "The Magnetic Stators generate a magnetic field that levitates the rotor, allowing it to spin at extreme speeds without physical contact and friction.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes
        let rotor = null;
        let threads = null;
        let cable = null;

        if (meshes && meshes.length > 3) {
            rotor = meshes[2];
            threads = meshes[3];
            cable = meshes[4];
            
            if (rotor && rotor.geometry.type === 'TorusGeometry') {
                rotor.rotation.z = time * speed * 2.0;
            }

            if (threads && threads.geometry.type === 'CylinderGeometry') {
                // Throbbing emissive effect
                const intensity = 1.5 + Math.sin(time * speed * 5.0) * 0.5;
                if(threads.material && threads.material.emissiveIntensity !== undefined) {
                    threads.material.emissiveIntensity = intensity;
                }
                threads.rotation.y = time * speed;
            }

            if (cable && cable.geometry.type === 'CylinderGeometry') {
                cable.rotation.y = time * speed;
                // Move texture/position up to simulate extrusion
                cable.position.y = 29.5 + (Math.sin(time * speed) * 0.5);
            }
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
export function createCarbonNanotubeWeaver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
