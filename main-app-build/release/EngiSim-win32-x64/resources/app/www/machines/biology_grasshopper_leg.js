import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech/Neon Materials
    const glowingMuscle = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        roughness: 0.4,
        metalness: 0.1
    });

    const glowingSpring = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const bioArmor = new THREE.MeshStandardMaterial({
        color: 0x2e8b57, // Sea green
        roughness: 0.6,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2
    });
    
    // 1. Femur (Upper leg)
    const femurGeo = new THREE.CylinderGeometry(0.8, 0.4, 4, 32);
    femurGeo.rotateZ(Math.PI / 4);
    femurGeo.translate(-1.5, 2, 0);
    const femur = new THREE.Mesh(femurGeo, bioArmor);
    group.add(femur);
    parts.push({
        name: "Femur",
        description: "The large upper segment of the leg containing the massive muscles used for jumping.",
        material: "bioArmor",
        function: "Houses the flexor and extensor muscles and provides structural leverage.",
        assemblyOrder: 1,
        connections: ["Knee Joint", "Flexor Muscle", "Extensor Muscle"],
        failureEffect: "Inability to jump or move.",
        cascadeFailures: ["Tibia"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 3, z: 0 }
    });

    // 2. Tibia (Lower leg)
    const tibiaGeo = new THREE.CylinderGeometry(0.2, 0.1, 5, 16);
    tibiaGeo.translate(0, -2.5, 0); // Origin at top (knee joint)
    const tibia = new THREE.Mesh(tibiaGeo, bioArmor);
    tibia.position.set(0, 0.6, 0); // Attach at knee
    tibia.rotation.z = -Math.PI / 6;
    group.add(tibia);
    parts.push({
        name: "Tibia",
        description: "The long, thin lower segment of the leg that strikes the ground.",
        material: "bioArmor",
        function: "Transfers the force from the knee joint to the ground for jumping.",
        assemblyOrder: 2,
        connections: ["Knee Joint", "Tarsus"],
        failureEffect: "Loss of jumping distance and stability.",
        cascadeFailures: ["Tarsus"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: 3, y: -2, z: 0 }
    });

    // 3. Semi-lunar process (Spring)
    const springGeo = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI);
    const spring = new THREE.Mesh(springGeo, glowingSpring);
    spring.position.set(0, 0.6, 0);
    spring.rotation.z = Math.PI / 2;
    group.add(spring);
    parts.push({
        name: "Semi-lunar Process",
        description: "A piece of specialized cuticle acting as an incredibly powerful elastic spring.",
        material: "glowingSpring",
        function: "Stores elastic potential energy from muscle contraction and releases it instantly like a catapult.",
        assemblyOrder: 3,
        connections: ["Femur", "Tibia"],
        failureEffect: "Total loss of explosive jumping capability.",
        cascadeFailures: ["Flexor Muscle"],
        originalPosition: { x: 0, y: 0.6, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 3 }
    });

    // 4. Flexor Muscle
    const flexorGeo = new THREE.CapsuleGeometry(0.3, 2, 16, 16);
    flexorGeo.rotateZ(Math.PI / 4);
    const flexor = new THREE.Mesh(flexorGeo, glowingMuscle);
    flexor.position.set(-1.2, 1.8, 0.3);
    group.add(flexor);
    parts.push({
        name: "Flexor Muscle",
        description: "The primary muscle that bends the leg and loads the semi-lunar process.",
        material: "glowingMuscle",
        function: "Contracts slowly to bend the knee and store immense energy in the elastic spring.",
        assemblyOrder: 4,
        connections: ["Femur", "Semi-lunar Process"],
        failureEffect: "Cannot load the spring for jumping.",
        cascadeFailures: [],
        originalPosition: { x: -1.2, y: 1.8, z: 0.3 },
        explodedPosition: { x: -2, y: 2, z: 2 }
    });

    // 5. Extensor Muscle
    const extensorGeo = new THREE.CapsuleGeometry(0.2, 1.5, 16, 16);
    extensorGeo.rotateZ(Math.PI / 4);
    const extensor = new THREE.Mesh(extensorGeo, darkSteel);
    extensor.position.set(-1.5, 2.2, -0.3);
    group.add(extensor);
    parts.push({
        name: "Extensor Muscle",
        description: "The muscle that straightens the leg.",
        material: "darkSteel",
        function: "Helps straighten the leg after a jump or during walking.",
        assemblyOrder: 5,
        connections: ["Femur", "Tibia"],
        failureEffect: "Leg cannot fully extend during walking.",
        cascadeFailures: [],
        originalPosition: { x: -1.5, y: 2.2, z: -0.3 },
        explodedPosition: { x: -2, y: 3, z: -2 }
    });
    
    // 6. Tarsus (Foot)
    const tarsusGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
    const tarsus = new THREE.Mesh(tarsusGeo, rubber);
    tarsus.position.set(0, -4.5, 0); // Attach to end of tibia
    tibia.add(tarsus); // Attach as child so it moves with tibia
    parts.push({
        name: "Tarsus",
        description: "The foot of the grasshopper, equipped with pads and claws.",
        material: "rubber",
        function: "Provides traction and grip before launching.",
        assemblyOrder: 6,
        connections: ["Tibia"],
        failureEffect: "Slipping during jump attempt.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -4.5, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    const description = "The Grasshopper Leg is a marvel of biological engineering, acting essentially as a biomechanical catapult. Rather than relying purely on muscle contraction to jump, which is too slow, the grasshopper slowly contracts its flexor muscle to bend the knee. This stores massive amounts of elastic potential energy in a specialized spring-like structure called the semi-lunar process. When ready to jump, a catch mechanism releases, and the stored energy violently snaps the tibia backwards, propelling the insect incredible distances in milliseconds.";

    const quizQuestions = [
        {
            question: "Why does the grasshopper use an elastic mechanism (the semi-lunar process) instead of just jumping with muscles directly?",
            options: [
                "Muscles are too heavy to lift the grasshopper.",
                "Direct muscle contraction is too slow to generate sufficient launch velocity.",
                "Elastic energy is less tiring for the grasshopper.",
                "It allows the grasshopper to jump backward."
            ],
            correct: 1,
            explanation: "Muscle contraction takes time. For a small insect to jump far, it needs extreme acceleration over a tiny fraction of a second. Loading a spring over a longer period and releasing it instantly bypasses the speed limit of muscles.",
            difficulty: "Medium"
        },
        {
            question: "Which component acts as the main energy storage 'spring' in this catapult mechanism?",
            options: [
                "Femur",
                "Tibia",
                "Semi-lunar process",
                "Tarsus"
            ],
            correct: 2,
            explanation: "The semi-lunar process, made of specialized elastic cuticle, acts as a spring that stores the energy generated by the slow contraction of the flexor muscle.",
            difficulty: "Easy"
        },
        {
            question: "During the loading phase before a jump, what does the flexor muscle do?",
            options: [
                "It relaxes completely.",
                "It contracts slowly to bend the knee and load the spring.",
                "It snaps instantly to extend the leg.",
                "It detaches from the femur."
            ],
            correct: 1,
            explanation: "The flexor muscle contracts slowly, overcoming the resistance of the elastic structures to store potential energy for the impending jump.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Full cycle duration: 4 seconds
        // 0 to 2s: loading (slowly bending knee)
        // 2s to 2.5s: holding (max tension)
        // 2.5s to 2.6s: jumping (instant snap)
        // 2.6s to 4.0s: resetting/resting
        
        const cycle = 4;
        const t = (time * speed) % cycle;
        
        if (t < 2.0) {
            // Loading
            let progress = t / 2.0; // 0 to 1
            tibia.rotation.z = -Math.PI/6 - (Math.PI/1.5 - Math.PI/6) * progress;
            flexor.scale.set(1 + 0.2*progress, 1, 1 + 0.2*progress);
            glowingSpring.emissiveIntensity = 0.5 + 2 * progress;
            glowingMuscle.emissiveIntensity = 0.8 + 1 * progress;
        } else if (t < 2.5) {
            // Holding
            tibia.rotation.z = -Math.PI/1.5;
            flexor.scale.set(1.2, 1, 1.2);
            glowingSpring.emissiveIntensity = 2.5;
            glowingMuscle.emissiveIntensity = 1.8;
        } else if (t < 2.6) {
            // Jumping (Release)
            let progress = (t - 2.5) / 0.1; // 0 to 1
            // Use easing out for the snap
            let easeOut = 1 - Math.pow(1 - progress, 3);
            tibia.rotation.z = -Math.PI/1.5 + (Math.PI/1.5 - Math.PI/6) * easeOut;
            flexor.scale.set(1.2 - 0.2*progress, 1, 1.2 - 0.2*progress);
            glowingSpring.emissiveIntensity = 2.5 - 2.0 * progress;
            glowingMuscle.emissiveIntensity = 1.8 - 1.0 * progress;
        } else {
            // Resting
            tibia.rotation.z = -Math.PI/6;
            flexor.scale.set(1, 1, 1);
            glowingSpring.emissiveIntensity = 0.5;
            glowingMuscle.emissiveIntensity = 0.8;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGrasshopperLeg() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
