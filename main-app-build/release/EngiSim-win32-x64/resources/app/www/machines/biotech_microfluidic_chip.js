import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0022,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const clearPolymer = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        ior: 1.5,
        thickness: 0.5
    });

    // Substrate Base (Glass/Polymer)
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 15);
    const baseMesh = new THREE.Mesh(baseGeo, clearPolymer);
    baseMesh.position.set(0, 0, 0);
    group.add(baseMesh);
    parts.push({
        name: 'PDMS Substrate Base',
        description: 'The foundation of the microfluidic chip, typically made of polydimethylsiloxane (PDMS) or glass, allowing optical transparency for microscopic observation.',
        material: 'Clear Polymer/Glass',
        function: 'Provides structural support and encloses the microchannels.',
        assemblyOrder: 1,
        connections: ['Microchannels', 'Inlet Ports', 'Outlet Ports'],
        failureEffect: 'Cracking causes fluid leakage and loss of channel pressurization.',
        cascadeFailures: ['Sample Contamination', 'Assay Failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // Microchannels
    const channelGeo = new THREE.BoxGeometry(0.2, 0.2, 10);
    const channel1 = new THREE.Mesh(channelGeo, glowingBlue);
    channel1.position.set(-2, 0, 0);
    group.add(channel1);
    parts.push({
        name: 'Reagent A Channel',
        description: 'Microscale channel directing the primary reagent.',
        material: 'Fluid (Blue)',
        function: 'Transports fluid accurately via laminar flow.',
        assemblyOrder: 2,
        connections: ['Reaction Chamber', 'Inlet A'],
        failureEffect: 'Clogging stops fluid flow.',
        cascadeFailures: ['Reaction Starvation'],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 2, z: 0 },
        mesh: channel1
    });

    const channelGeo2 = new THREE.BoxGeometry(0.2, 0.2, 10);
    const channel2 = new THREE.Mesh(channelGeo2, glowingRed);
    channel2.position.set(2, 0, 0);
    group.add(channel2);
    parts.push({
        name: 'Sample Channel',
        description: 'Microscale channel directing the biological sample.',
        material: 'Fluid (Red)',
        function: 'Transports the biological sample into the mixing zone.',
        assemblyOrder: 3,
        connections: ['Reaction Chamber', 'Inlet B'],
        failureEffect: 'Channel deformation leads to inconsistent flow rates.',
        cascadeFailures: ['Incorrect Mixing Ratio'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 2, z: 0 },
        mesh: channel2
    });

    // Reaction Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, glowingGreen);
    chamberMesh.position.set(0, 0, 5);
    group.add(chamberMesh);
    parts.push({
        name: 'Reaction Chamber',
        description: 'Zone where reagents and samples mix and react, often containing micro-pillars or surface functionalization.',
        material: 'Fluid/Polymer Mix',
        function: 'Facilitates rapid mixing and biochemical reactions at the microscale.',
        assemblyOrder: 4,
        connections: ['Reagent A Channel', 'Sample Channel', 'Detection Zone'],
        failureEffect: 'Incomplete mixing leads to false assay readings.',
        cascadeFailures: ['Diagnostic Error'],
        originalPosition: { x: 0, y: 0, z: 5 },
        explodedPosition: { x: 0, y: 6, z: 5 },
        mesh: chamberMesh
    });

    // Inlet Ports
    const portGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const port1 = new THREE.Mesh(portGeo, steel);
    port1.position.set(-2, 0.5, -4.5);
    group.add(port1);
    parts.push({
        name: 'Inlet Port A',
        description: 'Interface for macroscopic fluid delivery systems (e.g., syringe pumps) to connect to the microchip.',
        material: 'Steel/Polymer',
        function: 'Allows injection of Reagent A.',
        assemblyOrder: 5,
        connections: ['Reagent A Channel'],
        failureEffect: 'Delamination causes fluid to leak before entering the chip.',
        cascadeFailures: ['Loss of Pressure'],
        originalPosition: { x: -2, y: 0.5, z: -4.5 },
        explodedPosition: { x: -4, y: 8, z: -8 },
        mesh: port1
    });

    const port2 = new THREE.Mesh(portGeo, steel);
    port2.position.set(2, 0.5, -4.5);
    group.add(port2);
    parts.push({
        name: 'Inlet Port B',
        description: 'Interface for macroscopic fluid delivery.',
        material: 'Steel/Polymer',
        function: 'Allows injection of biological sample.',
        assemblyOrder: 6,
        connections: ['Sample Channel'],
        failureEffect: 'Delamination causes fluid to leak.',
        cascadeFailures: ['Loss of Pressure'],
        originalPosition: { x: 2, y: 0.5, z: -4.5 },
        explodedPosition: { x: 4, y: 8, z: -8 },
        mesh: port2
    });
    
    // Top Cover
    const coverGeo = new THREE.BoxGeometry(10, 0.1, 15);
    const coverMesh = new THREE.Mesh(coverGeo, clearPolymer);
    coverMesh.position.set(0, 0.3, 0);
    group.add(coverMesh);
    parts.push({
        name: 'Glass/Polymer Cover Slip',
        description: 'The top seal of the microfluidic device, bonded via plasma treatment or adhesives.',
        material: 'Glass',
        function: 'Seals the channels while allowing optical inspection.',
        assemblyOrder: 7,
        connections: ['PDMS Substrate Base'],
        failureEffect: 'Poor bonding causes cross-talk between adjacent microchannels.',
        cascadeFailures: ['Complete Assay Failure'],
        originalPosition: { x: 0, y: 0.3, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: coverMesh
    });

    // Particle representations inside the chamber (visual flair)
    const particleGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const pMesh = new THREE.Mesh(pGeo, glowingBlue);
        pMesh.position.set((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2 + 5);
        particleGroup.add(pMesh);
    }
    for (let i = 0; i < 20; i++) {
        const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const pMesh = new THREE.Mesh(pGeo, glowingRed);
        pMesh.position.set((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2 + 5);
        particleGroup.add(pMesh);
    }
    group.add(particleGroup);
    
    // Keep reference for animation
    const state = {
        particleGroup,
        chamberMesh
    };

    const description = "A high-tech microfluidic chip (lab-on-a-chip) utilizing continuous-flow and droplet-based fluidics for biochemical analysis. It features micro-scale channels, reaction chambers, and inlet ports. Fluids flow at a low Reynolds number, resulting in laminar flow. Such devices are vital for PCR, DNA sequencing, and rapid diagnostics.";

    const quizQuestions = [
        {
            question: "What is the primary flow regime in microfluidic channels?",
            options: ["Turbulent flow", "Laminar flow", "Transitional flow", "Supersonic flow"],
            correct: 1,
            explanation: "Due to the small dimensions, the Reynolds number is very low, leading to strictly laminar flow where fluids flow in parallel streams without mixing.",
            difficulty: "Medium"
        },
        {
            question: "What material is most commonly used for rapid prototyping of microfluidic devices due to its gas permeability and optical transparency?",
            options: ["Silicon", "Aluminum", "Polydimethylsiloxane (PDMS)", "Polycarbonate"],
            correct: 2,
            explanation: "PDMS is widely used in academia and R&D for microfluidics because it is optically transparent, gas permeable (useful for cell culture), and easily molded.",
            difficulty: "Easy"
        },
        {
            question: "How is mixing primarily achieved in simple microfluidic channels under standard conditions?",
            options: ["Mechanical stirring", "Turbulent eddies", "Convection", "Diffusion"],
            correct: 3,
            explanation: "Because the flow is laminar, mixing between adjacent fluid streams occurs strictly through molecular diffusion, which can be slow unless specialized micro-mixers are used.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the chamber
        if (state.chamberMesh) {
            state.chamberMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 2) * 0.8;
        }
        
        // Rotate and swirl the particles inside the chamber to simulate a reaction
        if (state.particleGroup) {
            state.particleGroup.rotation.y = time * speed;
            state.particleGroup.children.forEach((p, i) => {
                p.position.y = Math.sin(time * speed * 5 + i) * 0.1;
            });
        }
        
        // Fluid flow simulation
        meshes.forEach((meshPart) => {
            if (meshPart.mesh && meshPart.name && meshPart.name.includes('Channel')) {
                meshPart.mesh.material.opacity = 0.5 + 0.3 * Math.sin(time * speed * 3 - meshPart.mesh.position.x);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMicrofluidicChip() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
