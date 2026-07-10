import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // Material definitions
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1
    });
    
    const copperMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.9,
        roughness: 0.3
    });

    const silverMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.8,
        roughness: 0.4
    });

    // --- 1. Dilution Refrigerator Tiers ---
    // A series of descending plates with decreasing radii
    const tiers = [
        { radius: 3.5, y: 5, temp: '4 Kelvin', name: '4K Plate' },
        { radius: 2.8, y: 3, temp: '1 Kelvin', name: '1K Plate' },
        { radius: 2.0, y: 1, temp: '100 milliKelvin', name: 'Still Plate' },
        { radius: 1.2, y: -1, temp: '50 milliKelvin', name: 'Cold Plate' },
        { radius: 0.8, y: -3, temp: '15 milliKelvin', name: 'Mixing Chamber' }
    ];

    const tierGroup = new THREE.Group();
    tiers.forEach((tier, index) => {
        const plateGeo = new THREE.CylinderGeometry(tier.radius, tier.radius, 0.2, 32);
        const plate = new THREE.Mesh(plateGeo, goldMaterial);
        plate.position.y = tier.y;
        plate.userData = { id: `plate_${index}`, name: tier.name, description: `Cools the quantum processor down to ${tier.temp}.` };
        tierGroup.add(plate);

        // Add structural supports between tiers
        if (index < tiers.length - 1) {
            const nextTier = tiers[index + 1];
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const supportGeo = new THREE.CylinderGeometry(0.05, 0.05, Math.abs(tier.y - nextTier.y), 8);
                const support = new THREE.Mesh(supportGeo, copperMaterial);
                support.position.y = (tier.y + nextTier.y) / 2;
                support.position.x = Math.cos(angle) * nextTier.radius * 0.8;
                support.position.z = Math.sin(angle) * nextTier.radius * 0.8;
                tierGroup.add(support);
            }
        }
    });
    group.add(tierGroup);

    // --- 2. Intricate Wiring (Coaxial cables) ---
    // We'll simulate dense wiring by wrapping lines around the supports
    const wireGeo = new THREE.CylinderGeometry(0.6, 0.2, 8, 16, 20, true);
    const wireMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.6,
        roughness: 0.8,
        wireframe: true // creates a beautiful mesh of wires
    });
    const wiring = new THREE.Mesh(wireGeo, wireMat);
    wiring.position.y = 1;
    wiring.userData = { id: 'superconducting_wires', name: 'Superconducting Coax Cables', description: 'Transmits microwave pulses to control and read qubits without generating heat.' };
    group.add(wiring);

    // --- 3. The Quantum Processor (QPU) ---
    const qpuGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const qpuMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const qpu = new THREE.Mesh(qpuGeo, qpuMat);
    qpu.position.y = -3.5;
    qpu.userData = { id: 'qpu', name: 'Hyper Quantum Chip', description: 'Contains 1024 superconducting qubits arranged in a lattice.' };
    group.add(qpu);

    // --- 4. Quantum Entanglement Particles ---
    // Create a particle system floating around the QPU
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Random positions near the QPU
        particlePositions[i * 3] = (Math.random() - 0.5) * 3;
        particlePositions[i * 3 + 1] = -3.5 + (Math.random() - 0.5) * 2;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        
        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Shader for glowing qubits/particles
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    particleSystem.userData = { id: 'entanglement_field', name: 'Entanglement Field', description: 'Visual representation of quantum superposition and entanglement states.' };
    group.add(particleSystem);

    // --- 5. Animation Loop ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        
        // Rotate the whole structure slowly
        group.rotation.y = Math.sin(time * 0.2) * 0.1;

        // Animate particles (floating around the QPU)
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += particleVelocities[i].x;
            positions[i * 3 + 1] += particleVelocities[i].y;
            positions[i * 3 + 2] += particleVelocities[i].z;

            // Constrain particles to a box around the QPU
            if (positions[i * 3] > 1.5 || positions[i * 3] < -1.5) particleVelocities[i].x *= -1;
            if (positions[i * 3 + 1] > -2 || positions[i * 3 + 1] < -5) particleVelocities[i].y *= -1;
            if (positions[i * 3 + 2] > 1.5 || positions[i * 3 + 2] < -1.5) particleVelocities[i].z *= -1;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Pulse the particle colors between blue and purple
        particleMat.color.setHSL(0.5 + Math.sin(time) * 0.2, 1.0, 0.6);
    };

    return group;
}
