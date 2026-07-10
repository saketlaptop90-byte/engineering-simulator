import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Add custom glowing materials
    const vesicleGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const neuroGlow = new THREE.MeshStandardMaterial({
        color: 0xff00aa,
        emissive: 0xff00aa,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.5
    });
    
    const preSynapticMembrane = new THREE.MeshStandardMaterial({
        color: 0x224488,
        transparent: true,
        opacity: 0.6,
        roughness: 0.5,
        metalness: 0.2
    });
    
    const postSynapticMembrane = new THREE.MeshStandardMaterial({
        color: 0x882244,
        transparent: true,
        opacity: 0.6,
        roughness: 0.5,
        metalness: 0.2
    });

    const receptorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffee00,
        emissive: 0xaa8800,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.6
    });

    // 1. Pre-synaptic terminal
    const preGeo = new THREE.SphereGeometry(6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const preSynapticMesh = new THREE.Mesh(preGeo, preSynapticMembrane);
    preSynapticMesh.position.set(0, 4, 0);
    preSynapticMesh.rotation.x = Math.PI;
    group.add(preSynapticMesh);
    
    parts.push({
        name: "Pre-synaptic Terminal",
        description: "The axon terminal of the transmitting neuron where neurotransmitters are stored.",
        material: "preSynapticMembrane",
        function: "Releases neurotransmitters into the synaptic cleft upon action potential arrival.",
        assemblyOrder: 1,
        connections: ["Synaptic Vesicles", "Calcium Channels"],
        failureEffect: "Failure to release neurotransmitters, stopping signal transmission.",
        cascadeFailures: ["Post-synaptic Activation Failure"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Post-synaptic membrane
    const postGeo = new THREE.BoxGeometry(16, 2, 16);
    const postMesh = new THREE.Mesh(postGeo, postSynapticMembrane);
    postMesh.position.set(0, -6, 0);
    group.add(postMesh);
    
    parts.push({
        name: "Post-synaptic Membrane",
        description: "The dendrite surface of the receiving neuron containing specific receptors.",
        material: "postSynapticMembrane",
        function: "Receives neurotransmitters to initiate a new electrical signal.",
        assemblyOrder: 2,
        connections: ["Receptors"],
        failureEffect: "Inability to respond to neurotransmitters, causing signal loss.",
        cascadeFailures: ["Neural Network Inactivity"],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 }
    });
    
    // 3. Synaptic Vesicles
    const vesicles = [];
    const vesicleGeo = new THREE.SphereGeometry(0.8, 16, 16);
    for (let i = 0; i < 6; i++) {
        const vMesh = new THREE.Mesh(vesicleGeo, vesicleGlow);
        vMesh.position.set((Math.random() - 0.5) * 6, 6 + Math.random() * 3, (Math.random() - 0.5) * 6);
        group.add(vMesh);
        vesicles.push({
            mesh: vMesh,
            initialY: vMesh.position.y,
            phase: Math.random() * Math.PI * 2
        });
    }
    
    parts.push({
        name: "Synaptic Vesicles",
        description: "Membrane-bound sacs containing neurotransmitters.",
        material: "vesicleGlow",
        function: "Fuses with the pre-synaptic membrane to perform exocytosis of neurotransmitters.",
        assemblyOrder: 3,
        connections: ["Pre-synaptic Terminal"],
        failureEffect: "Depletion of neurotransmitter supply.",
        cascadeFailures: ["Synaptic Fatigue"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: -8, y: 14, z: 8 }
    });

    // 4. Receptors
    const receptorsGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    for (let i = 0; i < 8; i++) {
        const rMesh = new THREE.Mesh(receptorsGeo, receptorMaterial);
        rMesh.position.set((Math.random() - 0.5) * 10, -5, (Math.random() - 0.5) * 10);
        group.add(rMesh);
    }
    
    parts.push({
        name: "Neurotransmitter Receptors",
        description: "Proteins embedded in the post-synaptic membrane.",
        material: "receptorMaterial",
        function: "Binds specific neurotransmitters to open ion channels.",
        assemblyOrder: 4,
        connections: ["Post-synaptic Membrane", "Neurotransmitters"],
        failureEffect: "Receptor blockade (e.g., by toxins/drugs), stopping transmission.",
        cascadeFailures: ["Paralysis or Cognitive Dysfunction"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 8, y: -10, z: -8 }
    });

    // 5. Neurotransmitters
    const neuroGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const neuros = [];
    for (let i = 0; i < 30; i++) {
        const nMesh = new THREE.Mesh(neuroGeo, neuroGlow);
        nMesh.position.set((Math.random() - 0.5) * 8, Math.random() * 8 - 4, (Math.random() - 0.5) * 8);
        group.add(nMesh);
        neuros.push({
            mesh: nMesh,
            speed: 0.02 + Math.random() * 0.03
        });
    }

    parts.push({
        name: "Neurotransmitters",
        description: "Chemical messengers that cross the synaptic gaps between neurons.",
        material: "neuroGlow",
        function: "Transmits signals across the synaptic cleft.",
        assemblyOrder: 5,
        connections: ["Synaptic Vesicles", "Neurotransmitter Receptors"],
        failureEffect: "Imbalance causing neurological disorders (e.g., Depression, Parkinson's).",
        cascadeFailures: ["Systemic Neurological Imbalance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 10 }
    });

    const description = "The Synaptic Cleft is the ultra-microscopic gap between neurons where neurotransmitters are released to propagate electrical impulses chemically. It features glowing synaptic vesicles fusing with the pre-synaptic membrane to release neon neurotransmitters that travel to receptors.";

    const quizQuestions = [
        {
            question: "What triggers the synaptic vesicles to fuse with the pre-synaptic membrane?",
            options: ["Sodium influx", "Potassium efflux", "Calcium influx", "Chloride influx"],
            correct: 2,
            explanation: "An action potential causes voltage-gated Calcium channels to open, and the influx of Calcium ions triggers vesicle fusion and neurotransmitter release.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of neurotransmitter receptors?",
            options: ["To synthesize new neurotransmitters", "To bind specific neurotransmitters and open ion channels", "To reuptake neurotransmitters back into the terminal", "To physically connect the two neurons"],
            correct: 1,
            explanation: "Receptors on the post-synaptic membrane bind to specific neurotransmitters, leading to the opening of ion channels and the generation of a new electrical signal.",
            difficulty: "Easy"
        },
        {
            question: "Which of the following processes removes neurotransmitters from the synaptic cleft?",
            options: ["Exocytosis", "Endocytosis", "Reuptake by transport proteins", "Receptor binding"],
            correct: 2,
            explanation: "Neurotransmitters are cleared from the cleft via reuptake into the pre-synaptic terminal, enzymatic degradation, or diffusion to terminate the signal.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Vesicle floating animation and pulsing glow
        vesicles.forEach((v) => {
            const cycle = (time * speed * 0.5 + v.phase) % (Math.PI * 2);
            v.mesh.position.y = v.initialY + Math.sin(cycle) * 1.5;
            v.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 2 + v.phase) * 0.5;
        });

        // Neon neurotransmitters cascading across the cleft
        neuros.forEach((n) => {
            n.mesh.position.y -= n.speed * speed * 10;
            if (n.mesh.position.y < -5) {
                n.mesh.position.y = 4; // Reset to pre-synaptic terminal
                n.mesh.position.x = (Math.random() - 0.5) * 8;
                n.mesh.position.z = (Math.random() - 0.5) * 8;
            }
            n.mesh.material.emissiveIntensity = 1 + Math.sin(time * speed * 5) * 0.8;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSynapticCleft() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
