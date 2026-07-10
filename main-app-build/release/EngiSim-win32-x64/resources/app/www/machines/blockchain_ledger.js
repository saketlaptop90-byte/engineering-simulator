import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const glowYellow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8
    });

    // --- Block 1: The Genesis Block ---
    const genesisGeometry = new THREE.BoxGeometry(2, 2, 2);
    const genesisBlock = new THREE.Mesh(genesisGeometry, glowBlue);
    genesisBlock.position.set(-6, 0, 0);
    group.add(genesisBlock);

    // Inner Core for Genesis
    const core1Geom = new THREE.OctahedronGeometry(0.8, 0);
    const core1 = new THREE.Mesh(core1Geom, glass);
    core1.position.copy(genesisBlock.position);
    group.add(core1);

    parts.push({
        name: "Genesis Block",
        description: "The very first block in the blockchain ledger.",
        material: "glowBlue / glass",
        function: "Serves as the foundation and anchor for all subsequent blocks.",
        assemblyOrder: 1,
        connections: ["Hash Link 1"],
        failureEffect: "Invalidates the entire blockchain history.",
        cascadeFailures: ["Hash Link 1", "Block 2", "Hash Link 2", "Block 3"],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: -5 },
        mesh: genesisBlock,
        innerMesh: core1
    });

    // --- Hash Link 1 ---
    const link1Geometry = new THREE.CylinderGeometry(0.2, 0.2, 4);
    const link1 = new THREE.Mesh(link1Geometry, neonPurple);
    link1.rotation.z = Math.PI / 2;
    link1.position.set(-3, 0, 0);
    group.add(link1);

    parts.push({
        name: "Cryptographic Hash Link 1",
        description: "A cryptographic link containing the hash of the previous block.",
        material: "neonPurple",
        function: "Ensures immutability by cryptographically chaining Block 2 to the Genesis Block.",
        assemblyOrder: 2,
        connections: ["Genesis Block", "Block 2"],
        failureEffect: "Breaks the chain, creating an orphaned branch.",
        cascadeFailures: ["Block 2", "Block 3"],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 5, z: 0 },
        mesh: link1
    });

    // --- Block 2: Transaction Block ---
    const block2Geometry = new THREE.BoxGeometry(2, 2, 2);
    const block2 = new THREE.Mesh(block2Geometry, glowGreen);
    block2.position.set(0, 0, 0);
    group.add(block2);

    const core2 = new THREE.Mesh(core1Geom, glass);
    core2.position.copy(block2.position);
    group.add(core2);

    parts.push({
        name: "Block 2 (Transaction Data)",
        description: "A block containing verified transaction records.",
        material: "glowGreen / glass",
        function: "Stores a Merkle tree of transactions permanently.",
        assemblyOrder: 3,
        connections: ["Hash Link 1", "Hash Link 2"],
        failureEffect: "Corrupts transaction data.",
        cascadeFailures: ["Hash Link 2", "Block 3"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: block2,
        innerMesh: core2
    });

    // --- Hash Link 2 ---
    const link2 = new THREE.Mesh(link1Geometry, neonPurple);
    link2.rotation.z = Math.PI / 2;
    link2.position.set(3, 0, 0);
    group.add(link2);

    parts.push({
        name: "Cryptographic Hash Link 2",
        description: "A cryptographic link containing the hash of Block 2.",
        material: "neonPurple",
        function: "Chains Block 3 to Block 2, securing the transaction history.",
        assemblyOrder: 4,
        connections: ["Block 2", "Block 3"],
        failureEffect: "Chain fork or split.",
        cascadeFailures: ["Block 3"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 3, y: -5, z: 0 },
        mesh: link2
    });

    // --- Block 3: Latest Block ---
    const block3Geometry = new THREE.BoxGeometry(2, 2, 2);
    const block3 = new THREE.Mesh(block3Geometry, glowYellow);
    block3.position.set(6, 0, 0);
    group.add(block3);

    const core3 = new THREE.Mesh(core1Geom, glass);
    core3.position.copy(block3.position);
    group.add(core3);

    parts.push({
        name: "Block 3 (Current/Head Block)",
        description: "The most recently mined block in the chain.",
        material: "glowYellow / glass",
        function: "Accepts new transactions and acts as the current tip of the blockchain.",
        assemblyOrder: 5,
        connections: ["Hash Link 2"],
        failureEffect: "Requires re-mining of the latest block.",
        cascadeFailures: [],
        originalPosition: { x: 6, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: -5 },
        mesh: block3,
        innerMesh: core3
    });

    // Floating Particles (representing P2P network nodes)
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particles = [];
    for(let i=0; i<20; i++) {
        const p = new THREE.Mesh(particleGeo, chrome);
        p.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        group.add(p);
        particles.push(p);
    }
    parts.push({
        name: "P2P Network Nodes",
        description: "Distributed computers maintaining copies of the ledger.",
        material: "chrome",
        function: "Validates and relays transactions to maintain consensus.",
        assemblyOrder: 6,
        connections: ["All Blocks"],
        failureEffect: "Network stalls or becomes centralized.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        particles: particles
    });

    const description = "A high-tech visualization of a Blockchain Ledger, representing cryptographic blocks (Genesis, Data, Head) linked by unforgeable hash connections, surrounded by distributed P2P network nodes.";

    const quizQuestions = [
        {
            question: "What is the primary function of the cryptographic hash links between blocks?",
            options: ["To compress data", "To ensure immutability by chaining blocks securely", "To speed up transaction processing", "To hide the sender's identity"],
            correct: 1,
            explanation: "Cryptographic hash links contain the hash of the previous block, ensuring that any alteration in a past block changes its hash, which breaks the subsequent links. This makes the blockchain immutable.",
            difficulty: "Medium"
        },
        {
            question: "What happens if a node in the P2P network fails or drops offline?",
            options: ["The entire blockchain is destroyed", "The blockchain stops working temporarily", "Other nodes continue to maintain the ledger consensus", "All pending transactions are deleted"],
            correct: 2,
            explanation: "Blockchain operates on a decentralized peer-to-peer (P2P) network. If some nodes fail, the rest of the network continues to validate transactions and maintain the ledger.",
            difficulty: "Easy"
        },
        {
            question: "Why is the Genesis Block considered special?",
            options: ["It is the only block without a previous hash", "It holds all the cryptocurrency", "It can be modified freely", "It encrypts the entire network"],
            correct: 0,
            explanation: "The Genesis Block is the very first block in a blockchain. Because there are no blocks before it, its 'previous hash' value is generally hardcoded to zero or a null value.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate outer blocks
        if(meshes[0] && meshes[0].mesh) {
            meshes[0].mesh.rotation.x = time * speed * 0.5;
            meshes[0].mesh.rotation.y = time * speed * 0.5;
        }
        if(meshes[2] && meshes[2].mesh) {
            meshes[2].mesh.rotation.x = time * speed * 0.6;
            meshes[2].mesh.rotation.y = time * speed * 0.4;
        }
        if(meshes[4] && meshes[4].mesh) {
            meshes[4].mesh.rotation.x = time * speed * 0.4;
            meshes[4].mesh.rotation.y = time * speed * 0.6;
        }

        // Pulse inner cores
        const pulse = Math.sin(time * speed * 2) * 0.2 + 1;
        if(meshes[0] && meshes[0].innerMesh) meshes[0].innerMesh.scale.set(pulse, pulse, pulse);
        if(meshes[2] && meshes[2].innerMesh) meshes[2].innerMesh.scale.set(pulse, pulse, pulse);
        if(meshes[4] && meshes[4].innerMesh) meshes[4].innerMesh.scale.set(pulse, pulse, pulse);

        // Pulse links
        const linkPulse = Math.cos(time * speed * 5) * 0.1 + 1.1;
        if(meshes[1] && meshes[1].mesh) meshes[1].mesh.scale.set(linkPulse, linkPulse, 1);
        if(meshes[3] && meshes[3].mesh) meshes[3].mesh.scale.set(linkPulse, linkPulse, 1);

        // Orbit P2P nodes
        if(meshes[5] && meshes[5].particles) {
            meshes[5].particles.forEach((p, index) => {
                const offset = index * 0.5;
                p.position.y += Math.sin(time * speed * 3 + offset) * 0.05;
                p.rotation.x += 0.02 * speed;
                p.rotation.y += 0.03 * speed;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBlockchainLedger() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
