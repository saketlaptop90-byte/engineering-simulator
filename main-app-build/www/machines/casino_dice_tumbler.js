import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const pressurizedGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.05,
        ior: 1.5,
        thickness: 0.5,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.5
    });

    // 1. Base Platform (Aluminum/Steel)
    const baseGeom = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Reinforced Chassis",
        description: "Heavy steel base housing the pneumatic pumps and control circuitry.",
        material: "darkSteel",
        function: "Provides stability and houses high-pressure air compressors.",
        assemblyOrder: 1,
        connections: ["Pneumatic Pumps", "Control Ring"],
        failureEffect: "Severe vibration causing inaccurate dice reads.",
        cascadeFailures: ["Ruptured air lines", "Glass dome shatter"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Neon Control Ring
    const ringGeom = new THREE.TorusGeometry(5.2, 0.2, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeom, neonBlue);
    ringMesh.position.set(0, 1, 0);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);
    parts.push({
        name: "LED Status Ring",
        description: "Indicates system pressure and tumble state.",
        material: "neonBlue",
        function: "Visual feedback for casino floor operators.",
        assemblyOrder: 2,
        connections: ["Reinforced Chassis", "Glass Dome"],
        failureEffect: "Loss of visual status, possible regulatory violation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 5 },
        mesh: ringMesh
    });

    // 3. Pressurized Glass Dome
    const domeGeom = new THREE.SphereGeometry(4.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeom, pressurizedGlass);
    domeMesh.position.set(0, 1, 0);
    group.add(domeMesh);
    parts.push({
        name: "High-Pressure Containment Dome",
        description: "Impact-resistant polycarbonate dome containing the tumbling environment.",
        material: "pressurizedGlass",
        function: "Keeps dice enclosed while allowing high-pressure air jets to agitate them.",
        assemblyOrder: 3,
        connections: ["Reinforced Chassis", "Air Jets"],
        failureEffect: "Explosive decompression, dice ejection.",
        cascadeFailures: ["Complete system shutdown", "Injury hazard"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: domeMesh
    });

    // 4. Center Air Blower Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(0.5, 1, 1.5, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, chrome);
    nozzleMesh.position.set(0, 1.75, 0);
    group.add(nozzleMesh);
    parts.push({
        name: "Central Pneumatic Nozzle",
        description: "Primary directed air jet for randomizing dice trajectory.",
        material: "chrome",
        function: "Fires high-velocity bursts of air from the compressor.",
        assemblyOrder: 4,
        connections: ["Reinforced Chassis"],
        failureEffect: "Predictable dice patterns, compromising casino fairness.",
        cascadeFailures: ["Regulatory audit"],
        originalPosition: { x: 0, y: 1.75, z: 0 },
        explodedPosition: { x: 0, y: 3, z: -5 },
        mesh: nozzleMesh
    });

    // 5. Casino Dice
    const diceMeshes = [];
    for (let i = 0; i < 5; i++) {
        const dieGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const dieMesh = new THREE.Mesh(dieGeom, neonRed);
        dieMesh.position.set(
            Math.random() * 4 - 2,
            Math.random() * 2 + 2,
            Math.random() * 4 - 2
        );
        dieMesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            ),
            rotationSpeed: new THREE.Vector3(
                Math.random() * 5,
                Math.random() * 5,
                Math.random() * 5
            )
        };
        group.add(dieMesh);
        diceMeshes.push(dieMesh);
        
        parts.push({
            name: `Translucent Casino Die ${i+1}`,
            description: "Precision-machined, security-chipped 19mm die.",
            material: "neonRed",
            function: "Generates cryptographic-grade random outcomes via physical collision.",
            assemblyOrder: 5 + i,
            connections: ["High-Pressure Containment Dome"],
            failureEffect: "Chipped corner causing biased rolls.",
            cascadeFailures: [],
            originalPosition: dieMesh.position.clone(),
            explodedPosition: { x: (i-2)*2, y: 8, z: (i%2)*2 },
            mesh: dieMesh
        });
    }

    const description = "Automated Casino Dice Tumbler utilizing advanced pneumatic systems to provide statistically perfect, tamper-proof random number generation in a visually spectacular format.";

    const quizQuestions = [
        {
            question: "What is the primary function of the High-Pressure Containment Dome?",
            options: [
                "To magnify the dice for cameras.",
                "To enclose the dice and withstand pneumatic pressure.",
                "To chill the dice to prevent thermal expansion.",
                "To muffle the sound of the air compressor."
            ],
            correct: 1,
            explanation: "The dome must enclose the dice to prevent them from flying out while withstanding the intense, high-velocity air jets used to agitate them.",
            difficulty: "easy"
        },
        {
            question: "Why is a failure of the Central Pneumatic Nozzle considered critical for a casino?",
            options: [
                "It causes explosive decompression.",
                "It leads to predictable dice patterns, compromising game fairness.",
                "It shatters the glass dome.",
                "It overheats the chassis."
            ],
            correct: 1,
            explanation: "If the nozzle fails to randomize the airflow, the dice trajectories might become predictable, violating gaming regulations and fairness.",
            difficulty: "medium"
        },
        {
            question: "What material property is crucial for the Casino Dice to prevent biased outcomes?",
            options: [
                "High electrical conductivity.",
                "Perfectly uniform density and sharp edges (precision-machined).",
                "Extreme thermal insulation.",
                "High malleability."
            ],
            correct: 1,
            explanation: "Casino dice are precision-machined to have a perfectly uniform density and sharp corners to ensure that outcomes are genuinely random and unbiased.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const domeRadius = 4.0;
        
        diceMeshes.forEach(die => {
            const v = die.userData.velocity;
            const r = die.userData.rotationSpeed;
            const delta = 0.016 * speed;

            v.y -= 9.8 * delta;

            die.position.x += v.x * delta;
            die.position.y += v.y * delta;
            die.position.z += v.z * delta;

            die.rotation.x += r.x * delta;
            die.rotation.y += r.y * delta;
            die.rotation.z += r.z * delta;

            if (die.position.y < 1.4) {
                die.position.y = 1.4;
                v.y = Math.abs(v.y) * 0.8;
                
                if (Math.random() < 0.1 * speed) {
                    v.y += 10 + Math.random() * 10;
                    v.x += (Math.random() - 0.5) * 10;
                    v.z += (Math.random() - 0.5) * 10;
                }
            }

            const distFromCenter = Math.sqrt(die.position.x ** 2 + die.position.z ** 2);
            if (distFromCenter > domeRadius - 0.4) {
                const normalX = -die.position.x / distFromCenter;
                const normalZ = -die.position.z / distFromCenter;
                
                const dotProduct = v.x * normalX + v.z * normalZ;
                v.x -= 2 * dotProduct * normalX;
                v.z -= 2 * dotProduct * normalZ;
                
                v.x *= 0.9;
                v.z *= 0.9;
                
                die.position.x = (domeRadius - 0.45) * -normalX;
                die.position.z = (domeRadius - 0.45) * -normalZ;
            }
            
            const hDist = Math.sqrt(die.position.x ** 2 + die.position.y ** 2 + die.position.z ** 2);
            if(hDist > 4.4 && die.position.y > 1) {
                v.y = -Math.abs(v.y);
            }
        });
        
        if (ringMesh) {
            const intensity = 0.6 + Math.sin(time * 5 * speed) * 0.4;
            ringMesh.material.emissiveIntensity = intensity;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDiceTumbler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
