import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for biological/high-tech aesthetics
    const tracheaMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaaaa,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const bronchioleMat = new THREE.MeshPhysicalMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.8,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.5
    });

    const alveoliMat = new THREE.MeshPhysicalMaterial({
        color: 0xff1133,
        emissive: 0xff0044,
        emissiveIntensity: 0.4,
        roughness: 0.7,
        transparent: true,
        opacity: 0.9
    });

    const glowingAirMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const meshes = [];
    const airParticles = [];

    // Fractal recursive function to build the tree
    function buildBranch(startPoint, dir, length, radius, generation, maxGenerations, parentName) {
        if (generation > maxGenerations) return;

        const endPoint = new THREE.Vector3().copy(startPoint).add(dir.clone().multiplyScalar(length));
        
        // Create cylinder for this branch
        const geom = new THREE.CylinderGeometry(radius * 0.75, radius, length, 12, 1, false);
        geom.translate(0, length / 2, 0); // Origin at base
        
        const branchMesh = new THREE.Mesh(geom, generation < 2 ? tracheaMat : bronchioleMat);
        
        // Align cylinder to direction
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize());
        branchMesh.position.copy(startPoint);
        branchMesh.setRotationFromQuaternion(quaternion);
        
        group.add(branchMesh);
        meshes.push({ mesh: branchMesh, gen: generation });

        let partName = "";
        if (generation === 0) partName = "Trachea";
        else if (generation === 1) partName = "Primary Bronchi";
        else if (generation === maxGenerations) partName = "Terminal Bronchioles";
        else partName = `Bronchial Branch Gen ${generation}`;
        
        parts.push({
            name: `${partName} (Gen ${generation})`,
            description: generation === 0 ? "The main windpipe conducting air to the lungs." : "Subsequent branches of the airway.",
            material: generation < 2 ? "Cartilage/Membrane" : "Smooth Muscle",
            function: "Air conduction",
            assemblyOrder: generation,
            connections: [parentName],
            failureEffect: generation === 0 ? "Total loss of airflow (Asphyxiation)" : "Localized loss of airflow to specific lung segment",
            cascadeFailures: ["Hypoxia", "Organ failure"],
            originalPosition: startPoint.clone(),
            explodedPosition: startPoint.clone().add(dir.clone().multiplyScalar(5 * generation))
        });

        // Next generations
        if (generation < maxGenerations) {
            const angle1 = Math.PI / 6 + Math.random() * 0.1;
            const angle2 = -Math.PI / 6 - Math.random() * 0.1;

            // Simple bifurcation in local XY plane, then randomly rotated around Z slightly
            let axisZ = dir.clone().cross(new THREE.Vector3(0,0,1)).normalize();
            if (axisZ.lengthSq() < 0.001) axisZ.set(1,0,0);

            const dir1 = dir.clone().applyAxisAngle(axisZ, angle1).normalize();
            const dir2 = dir.clone().applyAxisAngle(axisZ, angle2).normalize();

            // Twist slightly to make it 3D
            const axisDir = dir.clone().normalize();
            dir1.applyAxisAngle(axisDir, Math.random() * Math.PI / 2);
            dir2.applyAxisAngle(axisDir, -Math.random() * Math.PI / 2);

            buildBranch(endPoint, dir1, length * 0.75, radius * 0.75, generation + 1, maxGenerations, partName);
            buildBranch(endPoint, dir2, length * 0.75, radius * 0.75, generation + 1, maxGenerations, partName);
        } else {
            // Add alveoli clusters at the terminals
            const sphereGeom = new THREE.SphereGeometry(radius * 3.5, 12, 12);
            const alveoli = new THREE.Mesh(sphereGeom, alveoliMat);
            alveoli.position.copy(endPoint);
            group.add(alveoli);
            meshes.push({ mesh: alveoli, type: 'alveoli' });

            parts.push({
                name: "Alveoli Cluster",
                description: "Tiny air sacs where gas exchange occurs.",
                material: "Pulmonary Membrane",
                function: "Gas exchange (Oxygen/Carbon Dioxide)",
                assemblyOrder: generation + 1,
                connections: [partName],
                failureEffect: "Reduced gas exchange efficiency (Emphysema/Pneumonia)",
                cascadeFailures: ["Hypoxemia", "Respiratory Acidosis"],
                originalPosition: endPoint.clone(),
                explodedPosition: endPoint.clone().add(dir.clone().multiplyScalar(8))
            });
        }
    }

    // Initialize fractal tree building
    buildBranch(new THREE.Vector3(0, 15, 0), new THREE.Vector3(0, -1, 0), 6, 1.2, 0, 5, "Pharynx");

    // Add glowing airflow particles
    const particleGeom = new THREE.SphereGeometry(0.12, 6, 6);
    for (let i = 0; i < 300; i++) {
        const particle = new THREE.Mesh(particleGeom, glowingAirMat);
        // Start them randomly around the trachea
        particle.position.set((Math.random() - 0.5) * 2, 15 + Math.random() * 5, (Math.random() - 0.5) * 2);
        particle.userData = { 
            baseSpeed: 0.1 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2
        };
        group.add(particle);
        airParticles.push(particle);
    }

    const description = "An ultra high-tech fractal simulation of the human bronchial tree, demonstrating biological bifurcation, scale reduction, and the fluid dynamics of airflow passing through generations of bronchi down to the alveoli.";

    const quizQuestions = [
        {
            question: "Why does the bronchial tree branch fractally?",
            options: [
                "To minimize surface area.",
                "To maximize surface area in a confined volume for gas exchange.",
                "To increase air resistance.",
                "To reduce the number of alveoli."
            ],
            correct: 1,
            explanation: "Fractal branching allows the lungs to pack an enormous surface area (the alveoli) into the relatively small volume of the chest cavity, optimizing gas exchange.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the combined cross-sectional area of the airways at each deeper generation?",
            options: [
                "It remains exactly the same.",
                "It drops rapidly.",
                "It increases significantly.",
                "It fluctuates randomly."
            ],
            correct: 2,
            explanation: "Although individual airways get narrower, their numbers grow exponentially. The combined cross-sectional area increases dramatically, which slows down airflow and allows efficient gas exchange.",
            difficulty: "Hard"
        },
        {
            question: "Which structure represents the final destination of airflow in this model where gas exchange occurs?",
            options: [
                "Trachea",
                "Primary Bronchi",
                "Alveoli",
                "Larynx"
            ],
            correct: 2,
            explanation: "Alveoli are the tiny, highly-vascularized balloon-like structures at the ends of the bronchial tree where oxygen enters the blood and carbon dioxide leaves.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Breathing animation: expanding and contracting the alveoli and glowing intensity
        const breathingCycle = Math.sin(time * speed * 2);
        
        meshes.forEach(m => {
            if (m.type === 'alveoli') {
                const scale = 1 + 0.15 * breathingCycle;
                m.mesh.scale.set(scale, scale, scale);
                // Pulse emissive glow to simulate oxygenation
                m.mesh.material.emissiveIntensity = 0.3 + 0.4 * Math.max(0, breathingCycle);
            }
        });

        // Airflow particles animation flowing downwards
        airParticles.forEach(p => {
            p.position.y -= (p.userData.baseSpeed * speed * (1 + Math.max(0, breathingCycle))); // Flow faster on "inhale"
            
            // Jitter for fluidic turbulence
            p.position.x += (Math.random() - 0.5) * 0.1;
            p.position.z += (Math.random() - 0.5) * 0.1;

            // Reset when reaching bottom or randomly
            if (p.position.y < -15 || Math.random() < 0.005) {
                p.position.set((Math.random() - 0.5) * 2, 15 + Math.random() * 5, (Math.random() - 0.5) * 2);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBronchialTree() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
