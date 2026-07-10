import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const opticFiberMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0
    });

    const myelinMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.4,
        metalness: 0.1,
        bumpScale: 0.05
    });

    const dataPacketMat = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    const chiasmMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2
    });

    // Part 1: Axon Bundle (Main Nerve Body)
    const bundleGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 32, 10, true);
    const bundleMesh = new THREE.Mesh(bundleGeometry, opticFiberMat);
    bundleMesh.rotation.z = Math.PI / 2;
    bundleMesh.position.set(-2, 0, 0);
    group.add(bundleMesh);
    meshes.axonBundle = bundleMesh;
    
    parts.push({
        name: "Axon Bundle",
        description: "A dense bundle of over a million retinal ganglion cell axons acting as biological fiber optics.",
        material: "Optic Fiber Material",
        function: "Transmits raw visual information from the retina to the brain's visual centers.",
        assemblyOrder: 1,
        connections: ["Retina", "Optic Chiasm"],
        failureEffect: "Complete loss of visual data transmission (blindness in affected eye).",
        cascadeFailures: ["Visual Cortex Atrophy", "Loss of depth perception"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 2, z: 0 }
    });

    // Part 2: Myelin Sheath (Insulation)
    const sheathGroup = new THREE.Group();
    for (let i = -5; i <= 1; i += 2) {
        const sheathGeom = new THREE.CylinderGeometry(1.6, 1.6, 1.5, 32);
        const sheathMesh = new THREE.Mesh(sheathGeom, myelinMat);
        sheathMesh.rotation.z = Math.PI / 2;
        sheathMesh.position.set(i, 0, 0);
        sheathGroup.add(sheathMesh);
    }
    group.add(sheathGroup);
    meshes.myelinSheath = sheathGroup;

    parts.push({
        name: "Myelin Sheath",
        description: "Lipid-rich insulation wrapping the axons, produced by oligodendrocytes.",
        material: "Myelin Lipid",
        function: "Dramatically increases the speed of action potentials via saltatory conduction.",
        assemblyOrder: 2,
        connections: ["Axon Bundle"],
        failureEffect: "Slowed or blocked visual signals (Optic Neuritis/MS).",
        cascadeFailures: ["Signal degradation", "Delayed visual processing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // Part 3: Data Packets (Action Potentials)
    const packets = [];
    const packetGroup = new THREE.Group();
    const packetGeom = new THREE.SphereGeometry(0.15, 16, 16);
    for (let i = 0; i < 20; i++) {
        const packet = new THREE.Mesh(packetGeom, dataPacketMat);
        // Random distribution along the cylinder
        const x = Math.random() * 10 - 7;
        const radius = Math.random() * 1.3;
        const theta = Math.random() * Math.PI * 2;
        const y = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        packet.position.set(x, y, z);
        packet.userData = { offset: x, radius: radius, theta: theta, speed: 2 + Math.random() * 2 };
        packets.push(packet);
        packetGroup.add(packet);
    }
    group.add(packetGroup);
    meshes.dataPackets = packets;

    parts.push({
        name: "Action Potentials",
        description: "Electrochemical impulses carrying encoded light, color, and motion data.",
        material: "Bioelectric Energy",
        function: "Propagates discrete packets of visual information along the nerve.",
        assemblyOrder: 3,
        connections: ["Axon Bundle"],
        failureEffect: "Intermittent visual static or localized blind spots.",
        cascadeFailures: ["Visual hallucinations", "Information bottleneck"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // Part 4: Optic Chiasm
    const chiasmGeom = new THREE.TorusGeometry(1.2, 0.5, 16, 32, Math.PI);
    const chiasmMesh = new THREE.Mesh(chiasmGeom, chiasmMat);
    chiasmMesh.rotation.y = Math.PI / 2;
    chiasmMesh.position.set(3, 0, 0);
    group.add(chiasmMesh);
    meshes.chiasm = chiasmMesh;

    parts.push({
        name: "Optic Chiasm",
        description: "X-shaped structure where half of the optic nerve fibers cross to the opposite side of the brain.",
        material: "Neural Tissue",
        function: "Integrates binocular vision, allowing the brain to process depth.",
        assemblyOrder: 4,
        connections: ["Axon Bundle", "Optic Tracts"],
        failureEffect: "Bitemporal hemianopsia (loss of peripheral vision).",
        cascadeFailures: ["Complete loss of stereoscopic depth"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    const description = "The Optic Nerve is a high-bandwidth biological data cable transmitting massive arrays of visual information from the retina to the visual cortex. Composed of bundled retinal ganglion axons and insulated by myelin sheaths for high-speed transmission, it converges at the Optic Chiasm to enable stereoscopic depth perception.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Myelin Sheath in the optic nerve?",
            options: [
                "To supply blood to the retina",
                "To increase the speed of electrical signal transmission",
                "To filter out ultraviolet light",
                "To connect directly to the visual cortex"
            ],
            correct: 1,
            explanation: "Myelin sheaths act as insulation around axons, enabling action potentials to 'jump' across nodes (saltatory conduction), greatly increasing transmission speed.",
            difficulty: "Medium"
        },
        {
            question: "What structural feature occurs at the Optic Chiasm?",
            options: [
                "Signals are converted from chemical to electrical",
                "The blind spot is formed",
                "Nerve fibers from the nasal half of each retina cross to the opposite hemisphere",
                "Color processing begins"
            ],
            correct: 2,
            explanation: "At the Optic Chiasm, roughly half of the axons (the nasal fibers) cross over to the contralateral side of the brain, a crucial step for binocular vision.",
            difficulty: "Hard"
        },
        {
            question: "Which cells form the axons that make up the Optic Nerve?",
            options: [
                "Photoreceptors",
                "Bipolar cells",
                "Retinal Ganglion Cells",
                "Schwann cells"
            ],
            correct: 2,
            explanation: "The optic nerve is essentially a bundle of the long axons extending from the Retinal Ganglion Cells located in the innermost layer of the retina.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the axon bundle
        if (meshes.axonBundle) {
            meshes.axonBundle.material.emissiveIntensity = 0.5 + Math.sin(time * 3 * speed) * 0.2;
        }

        // Rotate the chiasm slightly
        if (meshes.chiasm) {
            meshes.chiasm.rotation.x = Math.sin(time * speed) * 0.1;
        }

        // Move data packets along the nerve
        if (meshes.dataPackets) {
            meshes.dataPackets.forEach(packet => {
                let xOffset = packet.userData.offset + (packet.userData.speed * speed * 0.1);
                if (xOffset > 3) {
                    xOffset = -7; // loop back
                }
                packet.userData.offset = xOffset;
                
                // Add some spiral motion
                packet.userData.theta += 0.05 * speed;
                const y = Math.cos(packet.userData.theta) * packet.userData.radius;
                const z = Math.sin(packet.userData.theta) * packet.userData.radius;
                
                packet.position.set(xOffset, y, z);
                
                // Flash white/cyan
                const flash = Math.sin(time * 10 + packet.userData.offset) > 0 ? 1 : 0.5;
                packet.material.color.setRGB(flash, 1, 1);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOpticNervePathway() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
