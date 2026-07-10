import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const wetConcreteMat = new THREE.MeshPhysicalMaterial({
        color: 0x888888, roughness: 1.0, metalness: 0.1
    });

    const drumGeo = new THREE.CylinderGeometry(2.5, 3.5, 6, 32);
    const drumMesh = new THREE.Mesh(drumGeo, steel);
    drumMesh.rotation.z = Math.PI / 2;
    drumMesh.position.set(0, 3, 0);
    // Make the drum open at the front
    drumMesh.material.side = THREE.DoubleSide;
    group.add(drumMesh);
    parts.push({
        name: "Reversible Mixing Drum",
        description: "Heavy steel conical drum.",
        material: "Steel",
        function: "Rotates to tumble the heavy aggregate, cement, and water.",
        assemblyOrder: 1,
        connections: ["Drive Motor", "Chassis"],
        failureEffect: "Drum puncture.",
        cascadeFailures: ["Wet concrete spills everywhere"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const bladeGrp = new THREE.Group();
    // Create an Archimedes screw inside the drum
    const spiralGeo = new THREE.TorusKnotGeometry(2.2, 0.4, 64, 8, 2, 8);
    const spiralMesh = new THREE.Mesh(spiralGeo, darkSteel);
    spiralMesh.rotation.y = Math.PI / 2;
    bladeGrp.add(spiralMesh);
    bladeGrp.position.set(0, 3, 0);
    group.add(bladeGrp);
    parts.push({
        name: "Internal Archimedes Screw Blades",
        description: "Continuous spiral steel fins welded to the inside of the drum.",
        material: "Hardened Steel",
        function: "When spinning one way, it pulls concrete deep inside to mix it. When reversed, it acts like a giant screw conveyor to push the concrete out the top opening.",
        assemblyOrder: 2,
        connections: ["Inside Drum"],
        failureEffect: "Blade wear.",
        cascadeFailures: ["Unable to discharge concrete"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:3, z:-8}
    });

    const concreteGeo = new THREE.CylinderGeometry(2, 2.5, 4, 32);
    const concreteMesh = new THREE.Mesh(concreteGeo, wetConcreteMat);
    concreteMesh.rotation.z = Math.PI / 2;
    concreteMesh.position.set(-0.5, 2.5, 0);
    group.add(concreteMesh);
    parts.push({
        name: "Wet Ready-Mix Concrete",
        description: "Viscous, heavy mixture of cement, sand, gravel, and water.",
        material: "Wet Concrete",
        function: "The product being mixed. It must be kept moving so the heavy gravel doesn't sink to the bottom (segregation).",
        assemblyOrder: 3,
        connections: ["Drum Blades"],
        failureEffect: "Premature hydration (setting).",
        cascadeFailures: ["Turns into a 5-ton rock inside the drum"],
        originalPosition: {x:-0.5, y:2.5, z:0},
        explodedPosition: {x:-8, y:2.5, z:0}
    });

    const chuteGeo = new THREE.BoxGeometry(4, 0.2, 1.5);
    const chuteMesh = new THREE.Mesh(chuteGeo, chrome);
    chuteMesh.position.set(4, 2, 0);
    chuteMesh.rotation.z = -Math.PI / 6;
    group.add(chuteMesh);
    parts.push({
        name: "Discharge Chute",
        description: "Foldable steel slide.",
        material: "Chrome / Steel",
        function: "Directs the poured concrete from the high drum opening down to the ground or wheelbarrow.",
        assemblyOrder: 4,
        connections: ["Drum Opening"],
        failureEffect: "Chute jam.",
        cascadeFailures: ["Overflow"],
        originalPosition: {x:4, y:2, z:0},
        explodedPosition: {x:8, y:2, z:0}
    });

    const description = "Civil Concrete Mixer: The classic revolving drum mixer. It uses a brilliant dual-purpose internal screw (Archimedes spiral). Spinning one direction mixes the concrete perfectly; reversing the rotation magically forces the concrete uphill and out of the drum.";

    const quizQuestions = [
        {
            question: "How does a concrete mixer get the heavy concrete UP and OUT of the elevated drum hole?",
            options: ["The drum reverses its rotation. The internal spiral blades act like an Archimedes screw, actively pushing the concrete uphill.", "It uses a powerful vacuum", "It tips the entire truck upside down", "Workers shovel it out by hand"],
            correct: 0,
            explanation: "The blades inside aren't just paddles; they form a continuous spiral. Spinning 'forward' drives the concrete down into the belly to mix. Spinning 'backward' drives it up the spiral and out the chute.",
            difficulty: "Medium"
        },
        {
            question: "Why must the drum keep spinning slowly while a concrete truck is driving down the highway?",
            options: ["To prevent 'segregation' (the heavy rocks sinking to the bottom and the water floating to the top)", "To keep the engine cool", "To prevent the cement from drying in the wind", "To go faster"],
            correct: 0,
            explanation: "Continuous slow rotation (agitation) keeps the heavy aggregate evenly suspended in the cement paste. If it stops, the mixture separates and becomes useless, and can begin to set.",
            difficulty: "Hard"
        },
        {
            question: "What happens if a mixer truck breaks down in traffic and the concrete 'sets' inside the drum?",
            options: ["The drum is ruined. Workers must use jackhammers to chip the solid rock out, or the entire drum must be thrown away.", "It turns back to powder", "They just add more water to melt it", "They heat it up"],
            correct: 0,
            explanation: "Concrete hardens via a chemical reaction, not by drying. Once it starts, it cannot be stopped or reversed. A loaded, broken truck is a multi-million dollar disaster.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the drum and the blades inside it
        if (meshes[0]) meshes[0].rotation.x = time * speed * 2;
        if (meshes[1]) meshes[1].rotation.x = time * speed * 2;
        
        // Jiggle concrete slightly to show mixing
        if (meshes[2]) {
            meshes[2].rotation.x = Math.sin(time * speed * 2) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createConcreteBatchingPlantMixer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
