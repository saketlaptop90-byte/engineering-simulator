import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 1.0 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8, roughness: 0.1 });
    const turbulentWaterMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, roughness: 1.0 });

    // The massive gravity dam wall
    // Cross section of a gravity dam is a right triangle (flat vertical on water side, sloped on dry side)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);       // Bottom heel (water side)
    shape.lineTo(8, 0);       // Bottom toe (dry side)
    shape.lineTo(2, 12);      // Top crest
    shape.lineTo(0, 12);      // Top water side
    shape.lineTo(0, 0);

    const extrudeSettings = { depth: 10, bevelEnabled: false };
    const damGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const damMesh = new THREE.Mesh(damGeo, concreteMat);
    // Center it
    damMesh.position.set(-4, -6, -5);
    group.add(damMesh);
    parts.push({
        name: "Massive Concrete Gravity Profile",
        description: "Solid, unreinforced mass of concrete. Thick at the bottom, thin at the top.",
        material: "Mass Concrete",
        function: "Uses its sheer, astronomical dead weight to hold back the immense hydrostatic pressure of the reservoir.",
        assemblyOrder: 1,
        connections: ["Bedrock", "Spillway"],
        failureEffect: "Sliding or overturning.",
        cascadeFailures: ["Catastrophic valley flood"],
        originalPosition: {x:-4, y:-6, z:-5},
        explodedPosition: {x:-4, y:-6, z:-15}
    });

    const lakeGeo = new THREE.BoxGeometry(8, 11, 10);
    const lakeMesh = new THREE.Mesh(lakeGeo, waterMat);
    lakeMesh.position.set(-8, -0.5, 0);
    group.add(lakeMesh);
    parts.push({
        name: "Reservoir (Hydrostatic Pressure)",
        description: "Millions of tons of pent-up water.",
        material: "Water",
        function: "Pushes laterally against the flat vertical face of the dam. Pressure increases massively with depth.",
        assemblyOrder: 2,
        connections: ["Dam Face"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:-8, y:-0.5, z:0},
        explodedPosition: {x:-15, y:-0.5, z:0}
    });

    // Ogee Spillway Crest cut into the top
    const ogeeGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32, 1, false, 0, Math.PI);
    const ogeeMesh = new THREE.Mesh(ogeeGeo, concreteMat);
    ogeeMesh.rotation.z = Math.PI / 2;
    ogeeMesh.position.set(-1.5, 5, 0);
    group.add(ogeeMesh);
    parts.push({
        name: "Ogee Spillway Crest",
        description: "A smoothly curved 'S-shape' concrete drop-off.",
        material: "Smooth Concrete",
        function: "Provides a safe, controlled path for floodwaters to overflow the dam without ripping the concrete apart through cavitation.",
        assemblyOrder: 3,
        connections: ["Dam Body", "Stilling Basin"],
        failureEffect: "Cavitation (vacuum bubbles).",
        cascadeFailures: ["Concrete torn apart by imploding bubbles"],
        originalPosition: {x:-1.5, y:5, z:0},
        explodedPosition: {x:-1.5, y:10, z:0}
    });

    // Flowing water over spillway
    const spillFlowGeo = new THREE.BoxGeometry(0.5, 12, 4);
    const spillFlowMesh = new THREE.Mesh(spillFlowGeo, turbulentWaterMat);
    spillFlowMesh.rotation.z = -0.5; // slope down the face
    spillFlowMesh.position.set(1.5, 0, 0);
    group.add(spillFlowMesh);

    const basinGeo = new THREE.BoxGeometry(6, 2, 4);
    const basinMesh = new THREE.Mesh(basinGeo, turbulentWaterMat);
    basinMesh.position.set(5, -5, 0);
    group.add(basinMesh);

    const spillGrp = new THREE.Group();
    spillGrp.add(spillFlowMesh, basinMesh);
    group.add(spillGrp);

    parts.push({
        name: "Stilling Basin / Hydraulic Jump",
        description: "Pool of violently churning white water at the bottom.",
        material: "Turbulent Water",
        function: "Forces the terrifyingly fast, destructive water shooting off the spillway to crash into a slow pool, dissipating its kinetic energy before it destroys the riverbed.",
        assemblyOrder: 4,
        connections: ["Spillway Toe", "River"],
        failureEffect: "Basin sweep-out.",
        cascadeFailures: ["Riverbed eroded", "Dam foundation undermined"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:5, y:-5, z:0}
    });

    const description = "Civil Gravity Dam & Spillway: A monument to brute force engineering. It relies entirely on its massive weight to combat the pressure of the lake. The Ogee spillway is a mathematically precise curve designed to let catastrophic floodwaters safely glide over the top and crash into a shock-absorbing pool at the bottom.";

    const quizQuestions = [
        {
            question: "Why is a gravity dam shaped like a right triangle (thick at the bottom, thin at the top)?",
            options: ["Water pressure (hydrostatic pressure) increases linearly with depth. The bottom of the dam experiences massively more pushing force than the top.", "To save concrete", "To make it easier for fish to climb", "To act as a boat ramp"],
            correct: 0,
            explanation: "Because water gets heavier the deeper you go, the pressure trying to slide or tip the dam is concentrated at the bottom. Therefore, the dam must be incredibly thick and heavy at its base.",
            difficulty: "Medium"
        },
        {
            question: "What specific danger does an 'Ogee' curved spillway prevent?",
            options: ["Cavitation: If water falls too fast off a sharp edge, it creates a vacuum. The vacuum bubbles implode with enough force to literally blast holes in solid concrete.", "Evaporation", "Fish jumping out", "Lightning strikes"],
            correct: 0,
            explanation: "If the water separates from the concrete face, the vacuum creates cavitation. The Ogee curve perfectly matches the natural parabolic arc of falling water, keeping the water clinging tightly to the concrete.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the 'Stilling Basin' at the bottom of the spillway?",
            options: ["To force a 'Hydraulic Jump', intentionally crashing the fast water into a churning pool to destroy its kinetic energy so it doesn't wash away the downstream riverbed", "To store drinking water", "To act as a swimming pool", "To generate electricity"],
            correct: 0,
            explanation: "Water hitting the bottom of a 300-foot dam has terrifying destructive power. The stilling basin forces it to crash into itself, converting that kinetic energy into harmless heat and noise.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the violent hydraulic jump at the bottom
        if (group.children[3]) {
            const flow = group.children[3].children[0];
            const basin = group.children[3].children[1];
            
            // Flow slides down
            flow.position.x = 1.5 + Math.sin(time * speed * 10) * 0.05;
            flow.position.y = Math.cos(time * speed * 10) * 0.05;
            
            // Basin churns
            basin.scale.y = 1 + Math.sin(time * speed * 15) * 0.2;
            basin.scale.x = 1 + Math.random() * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGravityDamSpillway() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
