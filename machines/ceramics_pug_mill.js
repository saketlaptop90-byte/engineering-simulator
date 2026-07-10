import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x00cc00, emissiveIntensity: 1.5,
        roughness: 0.2, metalness: 0.1
    });

    const barrelGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const barrelMesh = new THREE.Mesh(barrelGeo, aluminum);
    barrelMesh.rotation.z = Math.PI / 2;
    barrelMesh.position.set(0, 2, 0);
    group.add(barrelMesh);
    parts.push({
        name: "Mixing Chamber / Barrel",
        description: "Main cylindrical housing.",
        material: "Aluminum",
        function: "Houses the auger and maintains vacuum.",
        assemblyOrder: 1,
        connections: ["Auger Shaft", "Vacuum Pump"],
        failureEffect: "Loss of vacuum.",
        cascadeFailures: ["Air bubbles in extruded clay"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:10, z:0}
    });

    const augerGeo = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const augerMesh = new THREE.Mesh(augerGeo, chrome);
    augerMesh.rotation.z = Math.PI / 2;
    augerMesh.scale.set(1, 2, 1);
    augerMesh.position.set(0, 2, 0);
    group.add(augerMesh);
    parts.push({
        name: "Internal Auger",
        description: "Large helical screw mechanism.",
        material: "Chrome",
        function: "Mixes, compresses, and pushes the clay forward.",
        assemblyOrder: 2,
        connections: ["Drive Motor"],
        failureEffect: "Jamming.",
        cascadeFailures: ["Motor burnout"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:-5, y:2, z:0}
    });

    const clayGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const clayMesh = new THREE.Mesh(clayGeo, neonGreen);
    clayMesh.rotation.z = Math.PI / 2;
    clayMesh.position.set(5.5, 2, 0);
    group.add(clayMesh);
    parts.push({
        name: "Extruded De-aired Clay",
        description: "Glowing neon green processed clay log.",
        material: "Clay (Neon Green)",
        function: "Ready-to-use clay free of air bubbles.",
        assemblyOrder: 3,
        connections: ["Extrusion Die"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:5.5, y:2, z:0},
        explodedPosition: {x:12, y:2, z:0}
    });

    const description = "Ceramics Pug Mill: A machine used to mix, compress, and extrude clay. De-airing pug mills also use a vacuum to suck out all air bubbles, preventing explosions in the kiln.";

    const quizQuestions = [
        {
            question: "Why is a vacuum pump attached to many ceramic pug mills?",
            options: ["To remove air bubbles from the clay", "To dry the clay faster", "To cool the motor", "To pull the clay through the barrel"],
            correct: 0,
            explanation: "The vacuum removes trapped air bubbles from the clay, making it denser and preventing air-pocket explosions during firing.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary moving component inside a pug mill?",
            options: ["An auger or screw", "A piston", "A centrifugal fan", "A rotating blade"],
            correct: 0,
            explanation: "An auger (screw) rotates inside the barrel to slice, mix, and push the clay through the extrusion die.",
            difficulty: "Easy"
        },
        {
            question: "What happens if air bubbles remain in the clay when it is fired in a kiln?",
            options: ["The air expands and shatters the piece", "The clay turns a different color", "The clay melts", "Nothing"],
            correct: 0,
            explanation: "Trapped air expands violently when heated, causing the ceramic piece to explode and potentially ruin other pieces in the kiln.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the auger
        if (meshes[1]) meshes[1].rotation.x = time * speed * 3;
        // Slowly push clay forward
        if (meshes[2]) {
            meshes[2].position.x = 5.5 + (time * speed) % 2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPugMill() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
