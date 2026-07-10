import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowRed = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        emissive: 0xff0000, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const glowBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    // 1. Base Structure
    const baseGeo = new THREE.CylinderGeometry(4, 4.5, 2, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -1, 0);
    group.add(base);
    parts.push({
        name: 'Base Structure',
        description: 'Heavy duty steel base to damp extreme vibrations at high RPMs.',
        material: 'darkSteel',
        function: 'Structural Support',
        assemblyOrder: 1,
        connections: ['Motor Housing'],
        failureEffect: 'Severe vibrations causing catastrophic structural failure',
        cascadeFailures: ['Main Bearing', 'Spindle'],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: base
    });

    // 2. Motor Housing
    const motorGeo = new THREE.CylinderGeometry(3, 3.5, 4, 32);
    const motor = new THREE.Mesh(motorGeo, chrome);
    motor.position.set(0, 2, 0);
    group.add(motor);
    parts.push({
        name: 'Drive Motor',
        description: 'High-torque electric motor capable of reaching 15,000 RPM.',
        material: 'chrome',
        function: 'Rotational Power',
        assemblyOrder: 2,
        connections: ['Base Structure', 'Spindle'],
        failureEffect: 'Loss of rotational speed, poor separation',
        cascadeFailures: ['Inverter Drive'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -8, y: 2, z: 0 },
        mesh: motor
    });

    // 3. Spindle
    const spindleGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const spindle = new THREE.Mesh(spindleGeo, steel);
    spindle.position.set(0, 5, 0);
    group.add(spindle);
    parts.push({
        name: 'Main Spindle',
        description: 'Precision-machined shaft transferring torque from motor to bowl.',
        material: 'steel',
        function: 'Power Transmission',
        assemblyOrder: 3,
        connections: ['Motor Housing', 'Separation Bowl'],
        failureEffect: 'Eccentric rotation causing rapid bearing failure',
        cascadeFailures: ['Separation Bowl', 'Bearings'],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -8 },
        mesh: spindle
    });

    // 4. Separation Bowl (The rotating part)
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(0, 7, 0);
    group.add(bowlGroup);

    const bowlGeo = new THREE.CylinderGeometry(5, 2, 6, 32, 1, true); // Open ends
    const bowl = new THREE.Mesh(bowlGeo, aluminum);
    bowl.material.side = THREE.DoubleSide;
    bowlGroup.add(bowl);
    
    // Add some neon accents to the bowl to make it look cool when spinning
    const bowlAccentGeo = new THREE.TorusGeometry(5, 0.1, 16, 64);
    const bowlAccent1 = new THREE.Mesh(bowlAccentGeo, neonCyan);
    bowlAccent1.position.set(0, 3, 0);
    bowlAccent1.rotation.x = Math.PI / 2;
    bowlGroup.add(bowlAccent1);

    parts.push({
        name: 'Conical Separation Bowl',
        description: 'The primary chamber where centrifugal force acts on the liquid mixture.',
        material: 'aluminum',
        function: 'Phase Separation',
        assemblyOrder: 4,
        connections: ['Spindle', 'Disc Stack'],
        failureEffect: 'Imbalance and catastrophic disintegration due to extreme g-forces',
        cascadeFailures: ['Casing', 'Spindle'],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: bowlGroup // Attach the whole group to the part for animation
    });

    // 5. Disc Stack (Inside the bowl)
    const discGeo = new THREE.ConeGeometry(4.5, 2, 32, 1, true);
    for (let i = 0; i < 10; i++) {
        const disc = new THREE.Mesh(discGeo, chrome);
        disc.position.set(0, -2 + (i * 0.4), 0);
        disc.material.side = THREE.DoubleSide;
        bowlGroup.add(disc);
    }
    parts.push({
        name: 'Disc Stack',
        description: 'A series of conical discs that reduce the settling distance, drastically increasing separation efficiency.',
        material: 'chrome',
        function: 'Increase Separation Area',
        assemblyOrder: 5,
        connections: ['Separation Bowl'],
        failureEffect: 'Reduced separation efficiency, product contamination',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 7, z: 0 }, // Same as bowl, inside it
        explodedPosition: { x: 8, y: 12, z: 0 },
        mesh: bowlGroup // Animates with bowl
    });

    // 6. Protective Casing (Outer shell, transparent to see inside)
    const casingGeo = new THREE.CylinderGeometry(6, 6, 8, 32);
    const casing = new THREE.Mesh(casingGeo, new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    }));
    casing.position.set(0, 7, 0);
    group.add(casing);
    parts.push({
        name: 'Protective Casing',
        description: 'Heavy containment vessel designed to absorb energy in case of a bowl failure.',
        material: 'glass/tinted',
        function: 'Containment and Safety',
        assemblyOrder: 6,
        connections: ['Base Structure'],
        failureEffect: 'Exposure of high-speed rotating parts to environment',
        cascadeFailures: ['Operator Safety'],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 12 },
        mesh: casing
    });

    // 7. Inlet Pipe
    const inletGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
    const inlet = new THREE.Mesh(inletGeo, copper);
    inlet.position.set(0, 11, 0);
    group.add(inlet);
    parts.push({
        name: 'Feed Inlet',
        description: 'Delivers the unseparated mixture directly into the center of the spinning bowl.',
        material: 'copper',
        function: 'Fluid Input',
        assemblyOrder: 7,
        connections: ['Separation Bowl'],
        failureEffect: 'Leakage of feed fluid, loss of pressure',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 11, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: inlet
    });

    // Visual Particles for animation (Heavy vs Light)
    const particleCount = 100;
    const heavyParticlesGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const heavyParticlesGroup = new THREE.InstancedMesh(heavyParticlesGeo, glowRed, particleCount);
    
    const lightParticlesGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const lightParticlesGroup = new THREE.InstancedMesh(lightParticlesGeo, glowBlue, particleCount);

    const dummy = new THREE.Object3D();
    for(let i=0; i<particleCount; i++) {
        // Initial random positions inside the bowl
        dummy.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2
        );
        dummy.updateMatrix();
        heavyParticlesGroup.setMatrixAt(i, dummy.matrix);
        lightParticlesGroup.setMatrixAt(i, dummy.matrix);
    }
    
    bowlGroup.add(heavyParticlesGroup);
    bowlGroup.add(lightParticlesGroup);

    const description = "The Centrifugal Separator utilizes extreme centrifugal force to separate mixtures of liquids with different densities, or to remove solids from liquids. The high-speed rotation generates forces thousands of times greater than gravity. The internal disc stack divides the fluid into thin layers, vastly reducing the distance particles must travel to settle, thereby making the separation process highly efficient and continuous.";

    const quizQuestions = [
        {
            question: "What is the primary function of the disc stack inside the separation bowl?",
            options: [
                "To structurally reinforce the bowl against extreme forces.",
                "To cool the fluid during the high-speed separation process.",
                "To reduce the settling distance and increase the effective separation area.",
                "To chop solid particles into smaller pieces before separation."
            ],
            correct: 2,
            explanation: "The disc stack divides the fluid volume into many thin layers. This drastically reduces the distance a particle must travel under centrifugal force before it hits a surface and is separated, significantly increasing the machine's efficiency.",
            difficulty: "Medium"
        },
        {
            question: "In a centrifugal separator, where do the heaviest components of the mixture accumulate?",
            options: [
                "Near the center axis of rotation.",
                "At the topmost part of the casing.",
                "At the farthest outer periphery of the spinning bowl.",
                "In the inlet pipe."
            ],
            correct: 2,
            explanation: "Centrifugal force drives the densest, heaviest materials radially outward to the inner wall of the rotating bowl, while lighter components are displaced towards the center axis.",
            difficulty: "Easy"
        },
        {
            question: "Why is precision balancing of the spindle and separation bowl absolutely critical?",
            options: [
                "To ensure the fluids mix evenly before separation.",
                "To prevent extreme vibrations that could cause catastrophic bearing failure at high RPMs.",
                "To keep the electric motor from overheating.",
                "To maintain the visual aesthetics of the machine."
            ],
            correct: 1,
            explanation: "Because the machine operates at extremely high RPMs, even a tiny mass imbalance generates massive centrifugal forces that will rapidly destroy the bearings and potentially shatter the machine.",
            difficulty: "Hard"
        }
    ];

    // Animation state
    let particlePhase = new Float32Array(particleCount * 2);
    for(let i=0; i<particleCount*2; i++) particlePhase[i] = Math.random() * Math.PI * 2;

    const animate = (time, speed, meshes) => {
        // Spin the bowl, spindle, and motor shaft
        if(meshes && meshes.parts) {
            const bowlMesh = meshes.parts.find(p => p.name === 'Conical Separation Bowl');
            if(bowlMesh && bowlMesh.mesh) {
                // High speed rotation
                bowlMesh.mesh.rotation.y += speed * 0.5;
                
                // Animate particles inside the bowl during operation
                if(speed > 0) {
                    for(let i=0; i<particleCount; i++) {
                        // Heavy particles move outward and down
                        let hAngle = particlePhase[i] + time * speed * 2;
                        let hRadius = 2 + Math.sin(time*0.5 + i)*1.5; // push towards 4.5
                        let hY = -2 + (i % 10) * 0.4; // roughly align with discs
                        dummy.position.set(Math.cos(hAngle)*hRadius, hY, Math.sin(hAngle)*hRadius);
                        dummy.updateMatrix();
                        heavyParticlesGroup.setMatrixAt(i, dummy.matrix);

                        // Light particles stay inward and move up
                        let lAngle = particlePhase[i+particleCount] + time * speed * 1.5;
                        let lRadius = 0.5 + Math.cos(time*0.7 + i)*0.5; // keep near center
                        let lY = -1 + (i % 15) * 0.3 + (time % 2); // move up
                        if(lY > 3) lY = -2;
                        dummy.position.set(Math.cos(lAngle)*lRadius, lY, Math.sin(lAngle)*lRadius);
                        dummy.updateMatrix();
                        lightParticlesGroup.setMatrixAt(i, dummy.matrix);
                    }
                    heavyParticlesGroup.instanceMatrix.needsUpdate = true;
                    lightParticlesGroup.instanceMatrix.needsUpdate = true;
                }
            }

            const spindleMesh = meshes.parts.find(p => p.name === 'Main Spindle');
            if(spindleMesh && spindleMesh.mesh) {
                spindleMesh.mesh.rotation.y += speed * 0.5;
            }
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCentrifugalSeparator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
