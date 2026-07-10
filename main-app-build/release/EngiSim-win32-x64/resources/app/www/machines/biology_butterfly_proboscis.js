import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const bioTissue = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513, // SaddleBrown
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        transparent: true,
        opacity: 0.9,
    });

    const muscleFiber = new THREE.MeshStandardMaterial({
        color: 0xA52A2A, // Brown
        roughness: 0.8,
        metalness: 0.0,
    });

    const neonNectar = new THREE.MeshStandardMaterial({
        color: 0x00FFCC,
        emissive: 0x00FFCC,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
    });

    const chitinArmor = new THREE.MeshPhysicalMaterial({
        color: 0x2A2A2A,
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
    });

    // 1. Head Structure (Base)
    const headGeom = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const head = new THREE.Mesh(headGeom, chitinArmor);
    head.position.set(0, 5, -2);
    group.add(head);

    parts.push({
        name: "Exoskeletal Head Plate",
        description: "The main structural anchor point for the proboscis muscles and fluid pumps.",
        material: "Chitin Armor",
        function: "Supports the entire feeding apparatus and houses the pharyngeal pump.",
        assemblyOrder: 1,
        connections: ["Proboscis Base", "Pharyngeal Pump"],
        failureEffect: "Inability to anchor the proboscis, preventing feeding.",
        cascadeFailures: ["Muscle Detachment", "Proboscis Collapse"],
        originalPosition: { x: 0, y: 5, z: -2 },
        explodedPosition: { x: 0, y: 8, z: -4 }
    });

    // 2. Proboscis Galea (Left and Right halves forming the tube)
    const proboscisGroup = new THREE.Group();
    proboscisGroup.position.set(0, 5, -0.5);
    group.add(proboscisGroup);

    const segmentCount = 30;
    const segments = [];
    const radius = 0.3;
    const segLength = 0.5;

    for (let i = 0; i < segmentCount; i++) {
        const segGeom = new THREE.CylinderGeometry(radius - (i * 0.005), radius - ((i+1) * 0.005), segLength, 16);
        segGeom.translate(0, -segLength / 2, 0);
        
        const seg = new THREE.Mesh(segGeom, bioTissue);
        
        // Add glowing nectar tube inside
        const innerTubeGeom = new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, segLength, 8);
        innerTubeGeom.translate(0, -segLength / 2, 0);
        const innerTube = new THREE.Mesh(innerTubeGeom, neonNectar);
        seg.add(innerTube);
        
        if (i === 0) {
            proboscisGroup.add(seg);
        } else {
            seg.position.y = -segLength;
            segments[i - 1].add(seg);
        }
        segments.push(seg);
    }

    parts.push({
        name: "Galeae (Segmented Tube)",
        description: "Two interlocking C-shaped halves that form the central food canal.",
        material: "Bio-Tissue",
        function: "Acts as a flexible straw to draw up nectar. Coils for storage, uncoils for feeding.",
        assemblyOrder: 2,
        connections: ["Head Plate", "Sensillae"],
        failureEffect: "Inability to uncoil or form a sealed tube, leaking nectar.",
        cascadeFailures: ["Starvation", "Pump Cavitation"],
        originalPosition: { x: 0, y: 5, z: -0.5 },
        explodedPosition: { x: 0, y: 5, z: 2 }
    });

    // 3. Pharyngeal Pump
    const pumpGeom = new THREE.TorusGeometry(1, 0.4, 16, 32);
    const pump = new THREE.Mesh(pumpGeom, muscleFiber);
    pump.position.set(0, 5.5, -2.5);
    pump.rotation.x = Math.PI / 2;
    group.add(pump);

    parts.push({
        name: "Pharyngeal Pump",
        description: "A muscular sac in the head that creates negative pressure.",
        material: "Muscle Fiber",
        function: "Pumps fluid up through the proboscis by expanding and contracting.",
        assemblyOrder: 3,
        connections: ["Head Plate", "Food Canal"],
        failureEffect: "Loss of suction pressure.",
        cascadeFailures: ["Nectar Stagnation"],
        originalPosition: { x: 0, y: 5.5, z: -2.5 },
        explodedPosition: { x: 0, y: 10, z: -6 }
    });

    // 4. Sensillae (Tips)
    const tipGeom = new THREE.ConeGeometry(0.2, 0.5, 16);
    tipGeom.translate(0, -0.25, 0);
    const tip = new THREE.Mesh(tipGeom, neonNectar);
    tip.position.y = -segLength;
    segments[segments.length - 1].add(tip);

    parts.push({
        name: "Sensillae (Chemoreceptors)",
        description: "Tiny sensory organs at the tip of the proboscis.",
        material: "Neon Sensor",
        function: "Detects the presence and quality of nectar (tasting).",
        assemblyOrder: 4,
        connections: ["Galeae"],
        failureEffect: "Inability to detect food.",
        cascadeFailures: ["Malnutrition"],
        originalPosition: { x: 0, y: 5 - (segmentCount * segLength), z: -0.5 },
        explodedPosition: { x: 0, y: -5, z: 2 }
    });

    const description = "The Butterfly Proboscis is a highly specialized, coiled feeding tube composed of two interlocking halves (galeae). It relies on muscular action and fluid pressure to uncoil, acting as a flexible straw. The internal pharyngeal pump creates suction to draw up nectar.";

    const quizQuestions = [
        {
            question: "What physical mechanism causes the butterfly's proboscis to uncoil?",
            options: [
                "Bones extending",
                "Increased hemolymph (blood) pressure",
                "Wind catching the coil",
                "Gravity pulling it down"
            ],
            correct: 1,
            explanation: "The proboscis uncoils due to an increase in hemolymph pressure driven by tiny muscles in the head, acting like a party horn.",
            difficulty: "Medium"
        },
        {
            question: "What are the two interlocking C-shaped structures that form the proboscis tube called?",
            options: [
                "Maxillae",
                "Mandibles",
                "Galeae",
                "Antennae"
            ],
            correct: 2,
            explanation: "The proboscis is formed by two elongated maxillary galeae that interlock using tiny hooks and fringes to create a central fluid canal.",
            difficulty: "Hard"
        },
        {
            question: "How does the butterfly draw nectar up through the uncoiled proboscis?",
            options: [
                "Capillary action alone",
                "By chewing and swallowing",
                "Using the muscular pharyngeal pump",
                "Pushing nectar with the sensillae"
            ],
            correct: 2,
            explanation: "The pharyngeal pump in the butterfly's head expands and contracts to create negative pressure (suction), drawing nectar up the canal.",
            difficulty: "Medium"
        }
    ];

    let coilPhase = 0;

    function animate(time, speed, meshes) {
        const coiledAngle = 0.25; 
        const uncoiledAngle = 0.02;

        const cycle = (time * speed) % 10;
        let targetAngle = coiledAngle;
        
        if (cycle > 2 && cycle < 7) {
            targetAngle = uncoiledAngle;
        }

        coilPhase += (targetAngle - coilPhase) * 0.05;

        for (let i = 0; i < segments.length; i++) {
            segments[i].rotation.x = coilPhase;
            if (targetAngle === uncoiledAngle) {
                segments[i].rotation.z = Math.sin(time * speed * 2 + i * 0.2) * 0.01;
            } else {
                segments[i].rotation.z = 0;
            }
        }

        if (targetAngle === uncoiledAngle) {
            const throb = 1 + Math.sin(time * speed * 10) * 0.1;
            pump.scale.set(throb, throb, throb);
        } else {
            pump.scale.set(1, 1, 1);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createButterflyProboscis() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
