import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0044ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.9,
    });

    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
    });
    
    const organicRubber = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.8,
    });
    
    const tissueMembrane = new THREE.MeshPhysicalMaterial({
        color: 0xffccdd,
        transparent: true,
        opacity: 0.4,
        roughness: 0.5,
        metalness: 0.1,
        transmission: 0.5,
        thickness: 0.1
    });

    // Outer Cup (Infundibulum)
    const infundibulumGeom = new THREE.CylinderGeometry(4, 2, 1.5, 32, 4, true);
    const infundibulumMesh = new THREE.Mesh(infundibulumGeom, organicRubber);
    infundibulumMesh.position.set(0, 0, 0);
    group.add(infundibulumMesh);
    meshes.infundibulum = infundibulumMesh;
    parts.push({
        name: "Infundibulum",
        description: "The exposed outer portion of the sucker that conforms to surfaces, establishing an initial seal.",
        material: "organicRubber",
        function: "Surface conformation and sealing",
        assemblyOrder: 1,
        connections: ["Acetabulum", "RadialMuscles"],
        failureEffect: "Loss of initial seal, preventing pressure differential.",
        cascadeFailures: ["Acetabulum"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -4, z: 0}
    });
    
    // Suction Cavity (Acetabulum)
    const acetabulumGeom = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const acetabulumMesh = new THREE.Mesh(acetabulumGeom, tissueMembrane);
    acetabulumMesh.rotation.x = Math.PI;
    acetabulumMesh.position.set(0, 0.75, 0);
    group.add(acetabulumMesh);
    meshes.acetabulum = acetabulumMesh;
    parts.push({
        name: "Acetabulum",
        description: "The spherical upper cavity that expands to create a pressure differential (suction).",
        material: "tissueMembrane",
        function: "Volume expansion for suction generation",
        assemblyOrder: 2,
        connections: ["Infundibulum", "RadialMuscles", "CircularMuscles"],
        failureEffect: "Inability to generate or maintain low internal pressure.",
        cascadeFailures: ["RadialMuscles"],
        originalPosition: {x: 0, y: 0.75, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // Radial Muscles (Glowing elements)
    meshes.radialMuscles = [];
    const numMuscles = 16;
    for (let i = 0; i < numMuscles; i++) {
        const angle = (i / numMuscles) * Math.PI * 2;
        const muscleGeom = new THREE.CylinderGeometry(0.1, 0.1, 2);
        muscleGeom.translate(0, 1, 0);
        const muscleMesh = new THREE.Mesh(muscleGeom, neonBlue);
        
        muscleMesh.position.set(Math.cos(angle) * 2.5, 0.75, Math.sin(angle) * 2.5);
        muscleMesh.lookAt(new THREE.Vector3(0, 2.75, 0));
        muscleMesh.rotateX(Math.PI / 2);
        
        group.add(muscleMesh);
        meshes.radialMuscles.push(muscleMesh);
    }
    
    parts.push({
        name: "Radial Muscles",
        description: "Muscles extending outward from the center. Their contraction expands the acetabulum, lowering internal pressure.",
        material: "neonBlue",
        function: "Active expansion of the suction cavity",
        assemblyOrder: 3,
        connections: ["Acetabulum", "ExtrinsicMuscles"],
        failureEffect: "Cannot expand cavity; zero suction force.",
        cascadeFailures: ["Acetabulum"],
        originalPosition: {x: 0, y: 0.75, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // Circular Muscles (Constrictors)
    const circularMuscleGeom = new THREE.TorusGeometry(2.5, 0.2, 16, 32);
    const circularMuscleMesh = new THREE.Mesh(circularMuscleGeom, neonRed);
    circularMuscleMesh.rotation.x = Math.PI / 2;
    circularMuscleMesh.position.set(0, 1.5, 0);
    group.add(circularMuscleMesh);
    meshes.circularMuscles = circularMuscleMesh;
    
    parts.push({
        name: "Circular Muscles",
        description: "Sphincter-like muscles that contract to release the suction by reducing cavity volume.",
        material: "neonRed",
        function: "Suction release and cavity compression",
        assemblyOrder: 4,
        connections: ["Acetabulum"],
        failureEffect: "Inability to release suction, getting stuck to the surface.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0}
    });

    // Central Piston / Protuberance
    const pistonGeom = new THREE.ConeGeometry(0.8, 1.5, 16);
    const pistonMesh = new THREE.Mesh(pistonGeom, neonCyan);
    pistonMesh.position.set(0, 0, 0);
    group.add(pistonMesh);
    meshes.piston = pistonMesh;
    
    parts.push({
        name: "Central Protuberance",
        description: "A muscular piston inside the acetabulum that aids in sealing and pressure modulation.",
        material: "neonCyan",
        function: "Pressure regulation and mechanical grip",
        assemblyOrder: 5,
        connections: ["Infundibulum", "Acetabulum"],
        failureEffect: "Weakened seal, leading to cavitation or slippage.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 16, z: 0}
    });

    // Ambient/fluid particle indicators for pressure (Visual flair)
    meshes.particles = [];
    const particleGeom = new THREE.SphereGeometry(0.05, 8, 8);
    for (let i = 0; i < 30; i++) {
        const pMesh = new THREE.Mesh(particleGeom, neonCyan);
        pMesh.position.set(
            (Math.random() - 0.5) * 4,
            Math.random() * 2,
            (Math.random() - 0.5) * 4
        );
        group.add(pMesh);
        meshes.particles.push(pMesh);
    }

    const description = "The octopus sucker is a highly advanced biological adhesion system. It operates via muscular hydrostats, using radial muscles to expand an internal cavity (acetabulum) while the outer rim (infundibulum) maintains a seal, creating a powerful negative pressure differential.";

    const quizQuestions = [
        {
            question: "Which component is primarily responsible for creating the initial seal against a surface?",
            options: ["Acetabulum", "Infundibulum", "Radial Muscles", "Central Protuberance"],
            correct: 1,
            explanation: "The infundibulum is the exposed outer portion that conforms to the target surface to create a tight seal before pressure drops.",
            difficulty: "Medium"
        },
        {
            question: "Contraction of which muscle group leads to an increase in suction force?",
            options: ["Circular Muscles", "Radial Muscles", "Longitudinal Muscles", "Transverse Muscles"],
            correct: 1,
            explanation: "Contraction of radial muscles expands the volume of the acetabulum cavity, lowering the internal pressure and increasing suction.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the circular muscles contract?",
            options: ["Suction force increases", "The sucker detaches from the surface", "The infundibulum expands", "The radial muscles are destroyed"],
            correct: 1,
            explanation: "Circular muscles act as antagonists to the radial muscles. Their contraction reduces cavity volume, equalizing pressure and releasing the sucker.",
            difficulty: "Medium"
        }
    ];

    let phase = 0;
    const animate = (time, speed, activeMeshes) => {
        phase += speed * 0.05;
        
        // Simulate suction cycle
        // 0 to PI: Contracting/Suction, PI to 2PI: Relaxing/Release
        const cycle = Math.sin(phase);
        const isSuction = cycle > 0;
        
        if (activeMeshes.acetabulum) {
            // Expand cavity during suction
            const scale = 1 + (isSuction ? cycle * 0.2 : 0);
            activeMeshes.acetabulum.scale.set(scale, scale, scale);
        }
        
        if (activeMeshes.piston) {
            // Piston pulls up during suction
            activeMeshes.piston.position.y = isSuction ? cycle * 0.5 : 0;
        }
        
        if (activeMeshes.radialMuscles) {
            // Radial muscles glow and thicken during suction
            activeMeshes.radialMuscles.forEach(m => {
                m.material.emissiveIntensity = isSuction ? 2.0 + cycle * 2.0 : 0.5;
                m.scale.x = m.scale.z = isSuction ? 1 + cycle * 0.5 : 1;
            });
        }
        
        if (activeMeshes.circularMuscles) {
            // Circular muscles glow during release
            activeMeshes.circularMuscles.material.emissiveIntensity = !isSuction ? 2.0 + (-cycle) * 2.0 : 0.5;
            activeMeshes.circularMuscles.scale.set(
                !isSuction ? 1 - (-cycle)*0.1 : 1,
                !isSuction ? 1 - (-cycle)*0.1 : 1,
                !isSuction ? 1 - (-cycle)*0.1 : 1
            );
        }

        if (activeMeshes.particles) {
            // Particles swirl inside to visualize pressure
            activeMeshes.particles.forEach((p, i) => {
                p.position.y += Math.sin(phase + i) * 0.01;
                p.position.x += Math.cos(phase + i) * 0.01;
                p.position.z += Math.sin(phase * 0.5 + i) * 0.01;
                
                // Keep inside acetabulum
                if (p.position.length() > 2) {
                    p.position.set(
                        (Math.random() - 0.5) * 2,
                        Math.random() * 1.5,
                        (Math.random() - 0.5) * 2
                    );
                }
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOctopusSucker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
