import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // High-tech Custom Glowing/Neon Materials
    const energyGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.85,
        metalness: 0.1,
        roughness: 0.2
    });

    const muscleGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff0055,
        emissive: 0xaa0033,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.5
    });

    const cyberBone = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.3,
        metalness: 0.8,
        envMapIntensity: 1.5
    });

    // 1. Humerus (Main Bone)
    const humerusGeo = new THREE.CylinderGeometry(0.5, 0.4, 6, 16);
    const humerus = new THREE.Mesh(humerusGeo, cyberBone);
    humerus.position.set(-6, 0, 0);
    humerus.rotation.z = Math.PI / 2;
    humerusGeo.translate(0, 3, 0); // Pivot at shoulder
    group.add(humerus);
    meshes.humerus = humerus;

    parts.push({
        name: "Humerus",
        description: "The main upper bone of the wing, providing structural support and anchorage for flight muscles.",
        material: "cyberBone",
        function: "Withstands the immense aerodynamic forces generated during the power stroke.",
        assemblyOrder: 1,
        connections: ["Radius", "Ulna", "Pectoralis Muscle"],
        failureEffect: "Loss of primary lifting force generation.",
        cascadeFailures: ["Flight inability", "Muscle tearing", "Chassis crash"],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 2, z: 2 }
    });

    // 2. Radius & Ulna (Forearm)
    const forearmGroup = new THREE.Group();
    humerus.add(forearmGroup);
    forearmGroup.position.set(0, 6, 0);

    const radiusGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    radiusGeo.translate(0, 2.5, 0);
    const radius = new THREE.Mesh(radiusGeo, aluminum);
    radius.position.set(-0.5, 0, 0);
    forearmGroup.add(radius);
    meshes.radius = radius;

    const ulnaGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    ulnaGeo.translate(0, 2.5, 0);
    const ulna = new THREE.Mesh(ulnaGeo, steel);
    ulna.position.set(0.5, 0, 0);
    forearmGroup.add(ulna);
    meshes.ulna = ulna;

    parts.push({
        name: "Radius and Ulna",
        description: "The forearm structure housing the secondary flight feathers.",
        material: "aluminum/steel",
        function: "Act together in parallel to control the angle of the outer wing and facilitate wing folding.",
        assemblyOrder: 2,
        connections: ["Humerus", "Carpometacarpus", "Secondary Feathers"],
        failureEffect: "Inability to steer or brake effectively.",
        cascadeFailures: ["Feather detachment", "Joint dislocation"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 3, z: -2 }
    });

    // 3. Carpometacarpus (Hand Wing)
    const handGroup = new THREE.Group();
    forearmGroup.add(handGroup);
    handGroup.position.set(0, 5, 0);
    
    const handGeo = new THREE.BoxGeometry(0.6, 4, 0.2);
    handGeo.translate(0, 2, 0);
    const hand = new THREE.Mesh(handGeo, chrome);
    handGroup.add(hand);
    meshes.handGroup = handGroup;

    parts.push({
        name: "Carpometacarpus",
        description: "Fused bones of the 'hand' supporting the primary flight feathers.",
        material: "chrome",
        function: "Provides thrust during the flight cycle via primary feather manipulation.",
        assemblyOrder: 3,
        connections: ["Radius", "Ulna", "Primary Feathers"],
        failureEffect: "Complete loss of forward thrust.",
        cascadeFailures: ["Stall", "Loss of aerodynamic lift"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 4 }
    });

    // 4. Primary Feathers (Neon Glowing Airfoils)
    const featherGeo = new THREE.PlaneGeometry(0.8, 6);
    featherGeo.translate(0, -3, 0);
    meshes.primaries = [];
    
    for(let i = 0; i < 6; i++) {
        const feather = new THREE.Mesh(featherGeo, energyGlow);
        feather.position.set(0, 2 + i * 0.5, 0);
        feather.rotation.z = -Math.PI / 4 + (i * 0.05);
        handGroup.add(feather);
        meshes.primaries.push(feather);
    }

    parts.push({
        name: "Primary Flight Feathers",
        description: "Asymmetrical bio-synthetic airfoils attached to the hand bones.",
        material: "energyGlow",
        function: "Act as individual propellers to generate forward thrust and slice through the air.",
        assemblyOrder: 4,
        connections: ["Carpometacarpus"],
        failureEffect: "Drastic reduction in propulsion efficiency.",
        cascadeFailures: ["Aerodynamic drag increase", "Flight path instability"],
        originalPosition: { x: 4, y: -2, z: 0 },
        explodedPosition: { x: 6, y: -4, z: -3 }
    });

    // 5. Bio-Synthetic Flight Muscle (Pectoralis)
    const muscleGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const muscle = new THREE.Mesh(muscleGeo, muscleGlow);
    muscle.position.set(-6, -1, 1);
    muscle.scale.set(1, 0.5, 1.5);
    group.add(muscle);
    meshes.muscle = muscle;

    parts.push({
        name: "Bio-Synthetic Pectoralis Muscle",
        description: "The primary power generator for the wing's downstroke.",
        material: "muscleGlow",
        function: "Contracts rapidly to pull the wing downwards, creating the primary lift vector.",
        assemblyOrder: 5,
        connections: ["Humerus", "Sternum Chassis"],
        failureEffect: "Cannot initiate or sustain flight.",
        cascadeFailures: ["Energy system overload", "Critical failure of ascent"],
        originalPosition: { x: -6, y: -1, z: 1 },
        explodedPosition: { x: -6, y: -5, z: 4 }
    });

    const description = "The Avian Wing Structure is an ultra high-tech bio-mechanical marvel designed to replicate the immense lifting power and agility of bird wings. Featuring glowing synthetic muscles, titanium-reinforced cyber-bone structures, and advanced aerodynamic plasma-feathers, it demonstrates the interplay of thrust, drag, lift, and gravity in a mesmerizing display of futuristic engineering.";

    const quizQuestions = [
        {
            question: "Which skeletal structure is directly responsible for supporting the primary flight feathers that generate thrust?",
            options: ["The Humerus", "The Radius and Ulna", "The Carpometacarpus", "The Sternum Chassis"],
            correct: 2,
            explanation: "The primary feathers, which act like individual propellers to produce thrust, are anchored directly to the carpometacarpus (the 'hand' bones).",
            difficulty: "Medium"
        },
        {
            question: "During active flight, what is the critical function of the bio-synthetic Pectoralis muscle?",
            options: ["To lift the wing upwards during the recovery stroke", "To stabilize the tail section", "To fold the wing for diving", "To forcefully pull the wing downwards for the power stroke"],
            correct: 3,
            explanation: "The pectoralis muscle is the largest muscle in flying bio-mechanisms. It contracts forcefully to pull the wing down, providing the main source of aerodynamic lift and thrust.",
            difficulty: "Easy"
        },
        {
            question: "Why are the primary flight feathers designed with an asymmetrical shape?",
            options: ["To optimize energy consumption", "To act as individual airfoils during the downstroke", "To maintain thermal regulation in high altitudes", "To reduce the overall weight of the wing chassis"],
            correct: 1,
            explanation: "The asymmetrical shape allows each primary feather to twist and act as an individual airfoil, generating thrust efficiently as the wing cuts through the air.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, externalMeshes) {
        const t = time * speed;
        // Use provided meshes or fallback to internal closure if undefined
        const activeMeshes = externalMeshes || meshes;
        
        // 1. Flapping motion (Humerus pivot)
        const flapAngle = Math.sin(t * 3) * 0.5;
        if(activeMeshes.humerus) {
            activeMeshes.humerus.rotation.x = flapAngle;
        }

        // 2. Wing folding dynamics (Forearm)
        const foldAngle = Math.sin(t * 3 + Math.PI/4) * 0.2 - 0.2;
        if(activeMeshes.radius && activeMeshes.radius.parent) {
            activeMeshes.radius.parent.rotation.z = foldAngle;
        }

        // 3. Wrist/Hand rotation
        const handAngle = Math.sin(t * 3 + Math.PI/2) * 0.3 - 0.1;
        if(activeMeshes.handGroup) {
            activeMeshes.handGroup.rotation.z = handAngle;
        }

        // 4. Feather splaying and twisting during upstroke/downstroke
        if(activeMeshes.primaries) {
            activeMeshes.primaries.forEach((feather, i) => {
                const splay = Math.sin(t * 3) * 0.1;
                feather.rotation.y = splay * (i / 6);
                // Glowing intensity oscillates with flap
                feather.material.emissiveIntensity = 1.5 + Math.sin(t * 6) * 0.5;
            });
        }

        // 5. Muscle pulsing based on flap cycle
        if(activeMeshes.muscle) {
            // Pulse peak correlates with downstroke
            const musclePulse = Math.abs(Math.sin(t * 3)) * 0.4 + 1.0;
            activeMeshes.muscle.scale.set(1, 0.5 * musclePulse, 1.5 * musclePulse);
            activeMeshes.muscle.material.emissiveIntensity = 1.0 + musclePulse;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAvianWingStructure() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
