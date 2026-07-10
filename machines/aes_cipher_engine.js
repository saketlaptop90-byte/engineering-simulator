import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for high-tech AES visualization
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2,
    });

    const neonMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
    });

    const dataBlockMat = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        emissive: 0x2222aa,
        emissiveIntensity: 0.5,
        wireframe: true
    });

    // 1. Core Processor Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 10);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.5, 0);
    group.add(baseMesh);

    parts.push({
        name: "Cipher Core Base",
        description: "The main processing unit housing the cryptographic operations.",
        material: "Dark Steel",
        function: "Structural support and thermal dissipation for cryptographic matrices.",
        assemblyOrder: 1,
        connections: ["S-Box Matrix", "Key Scheduler"],
        failureEffect: "Overheating and complete engine failure.",
        cascadeFailures: ["All components offline"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. S-Box Matrix (Substitution Bytes)
    const sboxGeo = new THREE.BoxGeometry(6, 0.5, 6);
    const sboxMesh = new THREE.Mesh(sboxGeo, chrome);
    sboxMesh.position.set(0, 0.5, 0);
    group.add(sboxMesh);

    const sboxGridGeo = new THREE.PlaneGeometry(5, 5, 16, 16);
    const sboxGridMesh = new THREE.Mesh(sboxGridGeo, neonCyan);
    sboxGridMesh.rotation.x = -Math.PI / 2;
    sboxGridMesh.position.set(0, 0.76, 0);
    group.add(sboxGridMesh);

    parts.push({
        name: "SubBytes Matrix",
        description: "Non-linear substitution step using a lookup table (S-box).",
        material: "Chrome and Neon Cyan",
        function: "Provides non-linearity to the cipher.",
        assemblyOrder: 2,
        connections: ["Cipher Core Base", "ShiftRows Grid"],
        failureEffect: "Cryptographic vulnerability to differential analysis.",
        cascadeFailures: ["Ciphertext predictability"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 3. ShiftRows Mechanism
    const shiftGeo = new THREE.CylinderGeometry(3, 3, 1, 32);
    const shiftMesh = new THREE.Mesh(shiftGeo, aluminum);
    shiftMesh.position.set(0, 2, 0);
    group.add(shiftMesh);

    // Rings for ShiftRows
    const ringMeshes = [];
    for(let i=0; i<4; i++) {
        const ringGeo = new THREE.TorusGeometry(3.2 + i*0.4, 0.1, 16, 64);
        const ring = new THREE.Mesh(ringGeo, neonMagenta);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 2 + (i*0.2 - 0.3), 0);
        group.add(ring);
        ringMeshes.push(ring);
    }

    parts.push({
        name: "ShiftRows Rotator",
        description: "A cyclic shift of the rows of the state matrix.",
        material: "Aluminum and Neon Magenta",
        function: "Provides diffusion by spreading data across columns.",
        assemblyOrder: 3,
        connections: ["SubBytes Matrix", "MixColumns Processor"],
        failureEffect: "Insufficient diffusion, leading to structural weaknesses.",
        cascadeFailures: ["MixColumns ineffective"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. MixColumns Processor
    const mixGeo = new THREE.BoxGeometry(2, 4, 2);
    const mixMesh = new THREE.Mesh(mixGeo, copper);
    mixMesh.position.set(0, 4.5, 0);
    group.add(mixMesh);

    const dataBlocks = [];
    for(let i=0; i<4; i++) {
        const dGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const dMesh = new THREE.Mesh(dGeo, dataBlockMat);
        dMesh.position.set(Math.sin(i*Math.PI/2)*2, 4.5, Math.cos(i*Math.PI/2)*2);
        group.add(dMesh);
        dataBlocks.push(dMesh);
    }

    parts.push({
        name: "MixColumns Transformer",
        description: "Combines the four bytes in each column of the state.",
        material: "Copper and Wireframe Energy",
        function: "Provides further diffusion, ensuring every byte affects multiple bytes in the next round.",
        assemblyOrder: 4,
        connections: ["ShiftRows Rotator", "AddRoundKey Injector"],
        failureEffect: "Lack of complete diffusion.",
        cascadeFailures: ["Cipher easily broken"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 5. Key Scheduler & AddRoundKey
    const keyGeo = new THREE.OctahedronGeometry(1.5, 0);
    const keyMesh = new THREE.Mesh(keyGeo, glowingGreen);
    keyMesh.position.set(0, 7.5, 0);
    group.add(keyMesh);

    parts.push({
        name: "AddRoundKey Injector",
        description: "Combines the subkey with the state.",
        material: "Glowing Green Energy",
        function: "Applies the secret key to the data stream.",
        assemblyOrder: 5,
        connections: ["MixColumns Processor"],
        failureEffect: "No encryption is actually performed.",
        cascadeFailures: ["Total system compromise"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 }
    });

    const description = "The AES (Advanced Encryption Standard) Cipher Engine visualizes the hardware representation of the AES cryptographic algorithm. It features four primary transformation stages: SubBytes (non-linear substitution), ShiftRows (transposition), MixColumns (linear mixing), and AddRoundKey (key injection). These stages work together in multiple rounds to transform plaintext into secure ciphertext.";

    const quizQuestions = [
        {
            question: "Which stage of the AES cipher provides non-linearity?",
            options: ["ShiftRows", "MixColumns", "SubBytes", "AddRoundKey"],
            correct: 2,
            explanation: "SubBytes provides non-linearity through the use of an S-box lookup table.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the ShiftRows and MixColumns steps?",
            options: ["Confusion", "Diffusion", "Key Generation", "Substitution"],
            correct: 1,
            explanation: "ShiftRows and MixColumns provide diffusion, spreading the influence of individual bits across the entire state matrix.",
            difficulty: "Hard"
        },
        {
            question: "Which transformation is NOT applied in the final round of AES?",
            options: ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"],
            correct: 2,
            explanation: "The MixColumns step is omitted in the final round of the AES algorithm to make encryption and decryption more symmetric.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Rotate S-box grid texture/effect slightly
        sboxGridMesh.material.opacity = 0.6 + 0.4 * Math.sin(t * 5);
        
        // Rotate ShiftRows rings at different speeds
        ringMeshes.forEach((ring, idx) => {
            ring.rotation.z = t * (idx + 1);
        });
        
        // Pulse MixColumns and orbit data blocks
        mixMesh.rotation.y = t * 0.5;
        dataBlocks.forEach((db, idx) => {
            const angle = t * 2 + (idx * Math.PI / 2);
            db.position.x = Math.sin(angle) * 2;
            db.position.z = Math.cos(angle) * 2;
            db.rotation.x += 0.05 * speed;
            db.rotation.y += 0.05 * speed;
        });
        
        // Hover and spin Key Scheduler
        keyMesh.position.y = 7.5 + Math.sin(t * 3) * 0.5;
        keyMesh.rotation.y = t * 2;
        keyMesh.rotation.z = t;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAESCipherEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
