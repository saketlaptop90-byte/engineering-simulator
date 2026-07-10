import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingSteam = new THREE.MeshPhysicalMaterial({
        color: 0xcccccc, emissive: 0xffffff, emissiveIntensity: 0.8,
        transparent: true, opacity: 0.5
    });
    
    const glowingLiquid = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x008800, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.9
    });

    const tubeGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const tubeMesh = new THREE.Mesh(tubeGeo, glass);
    tubeMesh.position.set(0, 5, 0);
    group.add(tubeMesh);
    parts.push({
        name: "Vertical Heat Exchange Tubes",
        description: "Bundled vertical tubes in a shell.",
        material: "Glass / Steel",
        function: "Transfers heat from the shell side (steam) to the liquid falling inside the tubes.",
        assemblyOrder: 1,
        connections: ["Shell", "Liquid Distributor"],
        failureEffect: "Tube fouling or scaling.",
        cascadeFailures: ["Loss of heat transfer efficiency"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:-8}
    });

    const distributorGeo = new THREE.CylinderGeometry(1.8, 1.8, 1, 32);
    const distributorMesh = new THREE.Mesh(distributorGeo, chrome);
    distributorMesh.position.set(0, 10, 0);
    group.add(distributorMesh);
    parts.push({
        name: "Liquid Distributor",
        description: "Precision engineered weir or spray system at the top.",
        material: "Chrome",
        function: "Ensures the liquid flows down the tube walls as a perfectly even, thin film.",
        assemblyOrder: 2,
        connections: ["Feed Pipe", "Tubes"],
        failureEffect: "Maldistribution.",
        cascadeFailures: ["Dry spots on tubes", "Product burning"],
        originalPosition: {x:0, y:10, z:0},
        explodedPosition: {x:0, y:15, z:0}
    });

    const filmGeo = new THREE.CylinderGeometry(1.9, 1.9, 8, 32, 1, true); // Open ended
    const filmMesh = new THREE.Mesh(filmGeo, glowingLiquid);
    filmMesh.position.set(0, 5, 0);
    // Double sided so it's visible as a film
    filmMesh.material.side = THREE.DoubleSide;
    group.add(filmMesh);
    parts.push({
        name: "Falling Thin Film",
        description: "Glowing neon liquid cascading down the inner walls.",
        material: "Glowing Liquid",
        function: "Provides extremely high surface area for rapid, gentle evaporation.",
        assemblyOrder: 3,
        connections: ["Distributor", "Tubes"],
        failureEffect: "Film boiling/breakdown.",
        cascadeFailures: ["Degradation of heat-sensitive chemicals"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:5, y:5, z:0}
    });

    const steamGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const steamMesh = new THREE.Mesh(steamGeo, glowingSteam);
    steamMesh.position.set(0, 5, 0);
    group.add(steamMesh);
    parts.push({
        name: "Evaporated Vapor (Steam)",
        description: "Vapor rising through the center of the tubes.",
        material: "Glowing Vapor",
        function: "The volatile solvent boiling off the thin film.",
        assemblyOrder: 4,
        connections: ["Tubes"],
        failureEffect: "Vapor entrainment of liquid drops.",
        cascadeFailures: ["Product loss in vapor line"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:-5, y:5, z:0}
    });

    const description = "Chemical Falling Film Evaporator: A highly efficient heat exchanger where liquid is distributed to fall as a continuous, ultra-thin film down the inside of heated tubes, causing rapid evaporation. Highly suitable for heat-sensitive materials.";

    const quizQuestions = [
        {
            question: "Why is the liquid spread into an ultra-thin 'falling film'?",
            options: ["To maximize surface area for extremely rapid heat transfer and evaporation", "To look cool", "To prevent the tubes from rusting", "To filter out solid particles"],
            correct: 0,
            explanation: "A thin film has minimal thermal resistance, allowing rapid evaporation. Because it's so fast, the product spends very little time in the hot zone, protecting heat-sensitive chemicals.",
            difficulty: "Medium"
        },
        {
            question: "What is the most critical mechanical component for a falling film evaporator to work correctly?",
            options: ["The Liquid Distributor at the top", "The vacuum pump", "The bottom catch tank", "The insulation"],
            correct: 0,
            explanation: "If the liquid distributor fails to coat the entire inner circumference of the tubes evenly, dry spots form. Dry spots will overheat, burn the product, and cause severe scaling.",
            difficulty: "Hard"
        },
        {
            question: "What direction does the liquid flow in a falling film evaporator?",
            options: ["Downward, driven by gravity", "Upward, driven by pressure", "Horizontally, driven by fans", "It doesn't move, it sits still"],
            correct: 0,
            explanation: "The liquid flows straight down the inside of the vertical tubes under the force of gravity.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Film flows down
        if (meshes[2]) meshes[2].rotation.y = time * speed;
        // Vapor rises
        if (meshes[3]) {
            meshes[3].position.y = 5 + (Math.sin(time*speed)*0.5);
            meshes[3].scale.set(1 + Math.sin(time*speed)*0.1, 1, 1 + Math.sin(time*speed)*0.1);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFallingFilmEvaporator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
