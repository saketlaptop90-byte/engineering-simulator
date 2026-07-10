import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, roughness: 1.0 });

    // Build an H-shape pylon
    const pylonGrp = new THREE.Group();
    
    // Left leg
    const legGeo = new THREE.BoxGeometry(2, 20, 3);
    const leftLeg = new THREE.Mesh(legGeo, concreteMat);
    leftLeg.position.set(-4, 10, 0);
    pylonGrp.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeo, concreteMat);
    rightLeg.position.set(4, 10, 0);
    pylonGrp.add(rightLeg);
    
    // Lower crossbeam
    const beamGeo = new THREE.BoxGeometry(6, 2, 3);
    const lowBeam = new THREE.Mesh(beamGeo, concreteMat);
    lowBeam.position.set(0, 6, 0);
    pylonGrp.add(lowBeam);
    
    // Upper crossbeam
    const highBeam = new THREE.Mesh(beamGeo, concreteMat);
    highBeam.position.set(0, 16, 0);
    pylonGrp.add(highBeam);

    group.add(pylonGrp);
    parts.push({
        name: "Reinforced Concrete Pylon (H-Shape)",
        description: "Massive vertical tower.",
        material: "Concrete",
        function: "Transfers the immense vertical dead load of the bridge and live load of traffic down to the foundation.",
        assemblyOrder: 1,
        connections: ["Foundation", "Bridge Deck"],
        failureEffect: "Buckling or Shear failure.",
        cascadeFailures: ["Total bridge collapse"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    const deckGeo = new THREE.BoxGeometry(16, 1, 6);
    const deckMesh = new THREE.Mesh(deckGeo, darkSteel);
    deckMesh.position.set(0, 7, 0); // resting on the lower crossbeam
    group.add(deckMesh);
    parts.push({
        name: "Suspended Bridge Deck",
        description: "Steel and asphalt roadway.",
        material: "Steel / Asphalt",
        function: "Carries the vehicles. Its weight rests entirely on the lower crossbeam of the pylon.",
        assemblyOrder: 2,
        connections: ["Pylon Lower Beam"],
        failureEffect: "Bearing failure.",
        cascadeFailures: ["Deck drops slightly, causing massive bumps"],
        originalPosition: {x:0, y:7, z:0},
        explodedPosition: {x:0, y:7, z:8}
    });

    const foundationGeo = new THREE.CylinderGeometry(6, 6, 4, 32);
    const foundationMesh = new THREE.Mesh(foundationGeo, concreteMat);
    foundationMesh.position.set(0, -2, 0);
    group.add(foundationMesh);
    parts.push({
        name: "Caisson / Pile Cap Foundation",
        description: "Massive block of concrete buried in the earth or riverbed.",
        material: "Concrete",
        function: "Distributes the millions of pounds of force from the pylon across a wide area of bedrock.",
        assemblyOrder: 3,
        connections: ["Pylon Legs", "Bedrock"],
        failureEffect: "Differential settlement.",
        cascadeFailures: ["Pylon leans", "Bridge geometry distorts"],
        originalPosition: {x:0, y:-2, z:0},
        explodedPosition: {x:0, y:-8, z:0}
    });

    const description = "Civil Bridge Pylon: The primary vertical support structure for large suspension, cable-stayed, or continuous girder bridges. It is engineered to withstand immense compressive forces pushing straight down, while resisting lateral wind and earthquake forces.";

    const quizQuestions = [
        {
            question: "What is the primary force that a bridge pylon must be engineered to withstand?",
            options: ["Compression (pushing down)", "Tension (pulling apart)", "Torsion (twisting)", "Buoyancy"],
            correct: 0,
            explanation: "The entire weight of the bridge deck, the cars on it, and the cables (dead load and live load) all push straight down on the pylon. Concrete is extremely strong in compression, making it the perfect material.",
            difficulty: "Easy"
        },
        {
            question: "Why are bridge pylons often built in an 'H' or 'A' shape rather than just a single solid block?",
            options: ["To provide a wide stance that resists lateral forces (like hurricane winds or earthquakes) pushing against the side of the bridge", "To save concrete", "To let airplanes fly through", "It looks more modern"],
            correct: 0,
            explanation: "A single vertical pillar could snap or tip over in high winds. By spreading the legs wide and connecting them with crossbeams (an H or A shape), the pylon becomes a highly stable portal frame against lateral loads.",
            difficulty: "Medium"
        },
        {
            question: "What is 'Scour' and why is it dangerous to bridge pylons?",
            options: ["Scour is when fast-moving river water erodes the dirt and sand from underneath the pylon's foundation, causing it to sink or collapse", "Scour is when rust eats the steel", "Scour is when birds nest on the crossbeams", "Scour is a type of concrete disease"],
            correct: 0,
            explanation: "Bridge scour is the number one cause of bridge failures worldwide. Fast-flowing water creates vortexes around the pylon base, digging a hole that eventually undermines the entire foundation.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Bridges are static, but we can simulate a heavy load compressing it microscopically
        if (group.children[1]) { // The deck
            group.children[1].position.y = 7 - (Math.sin(time * speed * 2) + 1) * 0.05; // tiny bounce
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBridgePylon() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
