import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 1.0 });

    const siloGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const siloMesh1 = new THREE.Mesh(siloGeo, steel);
    siloMesh1.position.set(-4, 6, -2);
    group.add(siloMesh1);
    
    const siloMesh2 = new THREE.Mesh(siloGeo, steel);
    siloMesh2.position.set(-4, 6, 2);
    group.add(siloMesh2);

    parts.push({
        name: "Cement Silos",
        description: "Tall steel storage tanks.",
        material: "Steel",
        function: "Stores dry cement powder (the binder) and fly ash, keeping it completely dry.",
        assemblyOrder: 1,
        connections: ["Screw Conveyor", "Weigh Hopper"],
        failureEffect: "Moisture ingress.",
        cascadeFailures: ["Cement hardens inside silo", "Solid blockage"],
        originalPosition: {x:-4, y:6, z:0},
        explodedPosition: {x:-10, y:6, z:0}
    });

    const binGeo = new THREE.BoxGeometry(6, 4, 6);
    const binMesh = new THREE.Mesh(binGeo, darkSteel);
    binMesh.position.set(4, 8, 0);
    // Make it look like a funnel/bin
    group.add(binMesh);
    parts.push({
        name: "Aggregate Bins",
        description: "Large compartmentalized hoppers loaded by wheel loaders.",
        material: "Steel / Heavy Iron",
        function: "Stores different sizes of sand and gravel (aggregate) which make up 75% of concrete's volume.",
        assemblyOrder: 2,
        connections: ["Weigh Belt"],
        failureEffect: "Material bridging/jamming.",
        cascadeFailures: ["Incorrect mix proportions", "Weak concrete"],
        originalPosition: {x:4, y:8, z:0},
        explodedPosition: {x:10, y:8, z:0}
    });

    const weighGeo = new THREE.CylinderGeometry(1.5, 0.5, 3, 16);
    const weighMesh = new THREE.Mesh(weighGeo, chrome);
    weighMesh.position.set(0, 4, 0);
    group.add(weighMesh);
    parts.push({
        name: "Precision Weigh Hopper",
        description: "Funnel suspended on highly accurate electronic load cells.",
        material: "Chrome",
        function: "Weighs the exact required mass of cement, sand, stone, and water for the specific 'recipe' (mix design).",
        assemblyOrder: 3,
        connections: ["Mixer", "Silos", "Bins"],
        failureEffect: "Load cell calibration error.",
        cascadeFailures: ["Entire batch fails strength tests", "Structural liability"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:0, y:4, z:8}
    });

    const mixerGeo = new THREE.CylinderGeometry(2.5, 2.5, 3, 32);
    const mixerMesh = new THREE.Mesh(mixerGeo, steel);
    mixerMesh.rotation.x = Math.PI / 2;
    mixerMesh.position.set(0, 1, 0);
    group.add(mixerMesh);
    parts.push({
        name: "Twin-Shaft Central Mixer",
        description: "Massive rotating drum with heavy steel paddles.",
        material: "Hardened Steel",
        function: "Violently mixes the dry ingredients with water and chemical admixtures into wet concrete.",
        assemblyOrder: 4,
        connections: ["Weigh Hopper", "Discharge Chute"],
        failureEffect: "Motor stall under load.",
        cascadeFailures: ["Concrete sets solid inside the mixer", "Catastrophic damage"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    const description = "Civil Concrete Batching Plant: An industrial facility that stores raw materials (cement, water, sand, gravel) and precisely weighs and combines them according to strict chemical 'mix designs' to produce ready-mix concrete for construction.";

    const quizQuestions = [
        {
            question: "What is the difference between 'Cement' and 'Concrete'?",
            options: ["Cement is just the grey powder (the glue). Concrete is the final hardened mixture of cement, water, sand, and gravel", "They are exactly the same thing", "Concrete is liquid, cement is solid", "Cement has steel in it"],
            correct: 0,
            explanation: "Cement is just an ingredient. When cement reacts chemically with water (hydration), it binds the sand and gravel (aggregate) together to form rock-hard Concrete.",
            difficulty: "Easy"
        },
        {
            question: "Why must a batching plant use precision electronic 'load cells' instead of measuring by volume (like a measuring cup)?",
            options: ["Because sand and gravel can be fluffy or compacted, and contain varying amounts of rainwater. Only measuring by exact mass (weight) guarantees the chemical ratios.", "Because scales are cheaper", "Because volume is illegal", "To prevent spills"],
            correct: 0,
            explanation: "Moisture in sand makes it swell (bulking). A cubic yard of wet sand contains less actual sand than dry sand. Weighing is the only way to ensure the strict water-to-cement chemical ratio is met for structural strength.",
            difficulty: "Hard"
        },
        {
            question: "What is the worst-case scenario at a batching plant?",
            options: ["The central mixer breaks down while full of wet concrete, and it cures into a solid 5-ton rock inside the machine", "Running out of water", "The silos get painted the wrong color", "A truck gets a flat tire"],
            correct: 0,
            explanation: "Concrete waits for no one. If it begins its exothermic hydration reaction and sets inside the mixer, it turns into solid rock. Workers literally have to go inside with jackhammers for days to chip it out.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the mixer drum
        if (group.children[3]) {
            group.children[3].rotation.z = time * speed * 2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBatchingPlant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
