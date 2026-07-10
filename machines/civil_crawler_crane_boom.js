import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingCable = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xaa5500, emissiveIntensity: 1.5,
        roughness: 0.3
    });

    // Lattice boom structure
    const boomGrp = new THREE.Group();
    
    // Main chords
    const chordGeo = new THREE.CylinderGeometry(0.2, 0.2, 30, 16);
    const c1 = new THREE.Mesh(chordGeo, steel);
    c1.position.set(-1, 15, -1);
    const c2 = new THREE.Mesh(chordGeo, steel);
    c2.position.set(1, 15, -1);
    const c3 = new THREE.Mesh(chordGeo, steel);
    c3.position.set(-1, 15, 1);
    const c4 = new THREE.Mesh(chordGeo, steel);
    c4.position.set(1, 15, 1);
    
    boomGrp.add(c1, c2, c3, c4);
    
    // Diagonal lacings (simplified representation)
    const laceGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.8, 8);
    for(let i=1; i<29; i+=2) {
        const l1 = new THREE.Mesh(laceGeo, chrome);
        l1.position.set(0, i, -1);
        l1.rotation.z = Math.PI / 4;
        boomGrp.add(l1);
        
        const l2 = new THREE.Mesh(laceGeo, chrome);
        l2.position.set(0, i+1, -1);
        l2.rotation.z = -Math.PI / 4;
        boomGrp.add(l2);
    }

    // Angle the boom
    boomGrp.rotation.x = Math.PI / 6; // 30 degrees forward
    group.add(boomGrp);
    parts.push({
        name: "Steel Lattice Boom",
        description: "Massive truss structure made of thin steel tubes.",
        material: "High-Strength Steel",
        function: "Provides immense strength in compression while remaining lightweight enough for the crane to lift itself.",
        assemblyOrder: 1,
        connections: ["Crane Cab", "Pendant Cables"],
        failureEffect: "Lacing buckles.",
        cascadeFailures: ["Catastrophic boom collapse (folding in half)"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    const cabGeo = new THREE.BoxGeometry(6, 4, 8);
    const cabMesh = new THREE.Mesh(cabGeo, darkSteel);
    cabMesh.position.set(0, -2, -4);
    group.add(cabMesh);
    parts.push({
        name: "Rotating Superstructure (Cab & Winches)",
        description: "The engine, cab, and massive hoist drums.",
        material: "Steel",
        function: "Houses the power plant and the winches that pull the cables to lift the load and the boom.",
        assemblyOrder: 2,
        connections: ["Boom Base", "Counterweight"],
        failureEffect: "Winch brake slips.",
        cascadeFailures: ["Load drops uncontrollably"],
        originalPosition: {x:0, y:-2, z:-4},
        explodedPosition: {x:0, y:-8, z:-4}
    });

    const counterGeo = new THREE.BoxGeometry(6, 3, 3);
    const counterMesh = new THREE.Mesh(counterGeo, steel);
    counterMesh.position.set(0, -1.5, -9);
    group.add(counterMesh);
    parts.push({
        name: "Rear Counterweights",
        description: "Massive solid iron blocks stacked on the back.",
        material: "Cast Iron",
        function: "Prevents the crane from tipping forward when lifting a massive load.",
        assemblyOrder: 3,
        connections: ["Superstructure"],
        failureEffect: "Incorrect weight ratio.",
        cascadeFailures: ["Crane tips over forwards or backwards"],
        originalPosition: {x:0, y:-1.5, z:-9},
        explodedPosition: {x:0, y:-1.5, z:-15}
    });

    const pendantGeo = new THREE.CylinderGeometry(0.1, 0.1, 28, 16);
    const pendantMesh = new THREE.Mesh(pendantGeo, glowingCable);
    pendantMesh.position.set(0, 10, -5);
    pendantMesh.rotation.x = -Math.PI / 10;
    group.add(pendantMesh);
    parts.push({
        name: "Pendant Cables & Gantry",
        description: "Thick steel wire ropes connecting the top of the boom to the rear of the crane.",
        material: "Wire Rope",
        function: "Holds the boom up, keeping it purely in compression so it doesn't snap.",
        assemblyOrder: 4,
        connections: ["Boom Tip", "Gantry Mast"],
        failureEffect: "Cable snap.",
        cascadeFailures: ["Boom drops instantly"],
        originalPosition: {x:0, y:10, z:-5},
        explodedPosition: {x:0, y:15, z:-10}
    });

    const description = "Civil Crawler Crane Boom: A massive lattice boom crane mounted on tank tracks. By using a lightweight 'lattice' truss structure instead of a solid hydraulic tube, these cranes can reach hundreds of feet into the air and lift over 1,000 tons.";

    const quizQuestions = [
        {
            question: "Why do massive crawler cranes use a 'Lattice' boom (crisscrossing thin pipes) instead of a solid telescopic hydraulic boom?",
            options: ["A lattice boom is vastly lighter while offering incredible strength in compression, allowing it to be built much longer without collapsing under its own weight", "Because solid booms are too shiny", "Because the wind blows right through it", "To save money on steel"],
            correct: 0,
            explanation: "Telescopic hydraulic booms are incredibly heavy. If you tried to build one 300 feet long, it couldn't even lift itself, let alone a load. Lattice booms use triangulation to maximize strength-to-weight ratio.",
            difficulty: "Medium"
        },
        {
            question: "What actually holds the lattice boom up in the air?",
            options: ["The pendant cables pulling back from the tip of the boom to the massive counterweights at the rear of the crane", "Giant hydraulic cylinders underneath it", "Air pressure", "It locks into place with a pin"],
            correct: 0,
            explanation: "The boom acts like a massive strut under pure compression. The pendant cables hold it in place, transferring the pulling force (tension) directly back into the heavy counterweights.",
            difficulty: "Hard"
        },
        {
            question: "What is the greatest danger to a long lattice boom crane, besides overloading it?",
            options: ["High Winds", "Rain", "Loud noises", "Sunlight"],
            correct: 0,
            explanation: "Even though wind blows through the lattice, a 300-foot boom has massive surface area. A strong gust of wind hitting the side of the boom can easily snap it sideways (where it is weakest) or tip the entire crane over.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Boom bobs slightly under load
        if (group.children[0]) {
            group.children[0].rotation.x = Math.PI / 6 + Math.sin(time * speed * 4) * 0.02;
        }
        // Pendant cable shifts
        if (group.children[3]) {
            group.children[3].rotation.x = -Math.PI / 10 + Math.sin(time * speed * 4) * 0.01;
            group.children[3].material.emissiveIntensity = 1.5 + Math.cos(time * speed * 10) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCrawlerCraneBoom() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
