import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const baseGeo = new THREE.BoxGeometry(4, 6, 6);
    const baseMesh = new THREE.Mesh(baseGeo, steel);
    baseMesh.position.set(-6, -2, 0);
    group.add(baseMesh);
    parts.push({
        name: "Concrete Pier Base",
        description: "Massive concrete foundation in the river.",
        material: "Reinforced Concrete",
        function: "Supports the entire weight of the bridge leaf and houses the machinery.",
        assemblyOrder: 1,
        connections: ["Trunnion Bearing", "Riverbed"],
        failureEffect: "Scour (erosion around base).",
        cascadeFailures: ["Bridge collapse"],
        originalPosition: {x:-6, y:-2, z:0},
        explodedPosition: {x:-6, y:-10, z:0}
    });

    // The moving leaf (deck + counterweight)
    const leafGrp = new THREE.Group();
    
    const deckGeo = new THREE.BoxGeometry(16, 0.5, 4);
    const deckMesh = new THREE.Mesh(deckGeo, darkSteel);
    deckMesh.position.set(6, 0, 0); // extend over water
    leafGrp.add(deckMesh);
    
    const counterGeo = new THREE.BoxGeometry(4, 4, 4);
    const counterMesh = new THREE.Mesh(counterGeo, steel);
    counterMesh.position.set(-4, -2, 0); // hang below the pivot
    leafGrp.add(counterMesh);

    leafGrp.position.set(-4, 1, 0); // Pivot point (trunnion)
    group.add(leafGrp);
    parts.push({
        name: "Bascule Leaf & Counterweight",
        description: "The roadway section balanced by a massive hidden block of concrete/steel.",
        material: "Steel / Concrete",
        function: "Lifts to allow ships to pass. The counterweight makes the massive bridge perfectly balanced on the pivot.",
        assemblyOrder: 2,
        connections: ["Trunnion", "Base"],
        failureEffect: "Counterweight detaches.",
        cascadeFailures: ["Bridge slams shut uncontrollably", "Hydraulics explode"],
        originalPosition: {x:-4, y:1, z:0},
        explodedPosition: {x:-4, y:8, z:0}
    });

    const trunnionGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    const trunnionMesh = new THREE.Mesh(trunnionGeo, chrome);
    trunnionMesh.rotation.x = Math.PI / 2;
    trunnionMesh.position.set(-4, 1, 0);
    group.add(trunnionMesh);
    parts.push({
        name: "Trunnion (Pivot Axle)",
        description: "Giant forged steel axle.",
        material: "Forged Steel",
        function: "The single pivot point upon which thousands of tons rotate.",
        assemblyOrder: 3,
        connections: ["Leaf", "Pier Base"],
        failureEffect: "Bearing seize.",
        cascadeFailures: ["Bridge stuck open or closed"],
        originalPosition: {x:-4, y:1, z:0},
        explodedPosition: {x:-4, y:1, z:5}
    });

    const cylinderGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const cylinderMesh = new THREE.Mesh(cylinderGeo, chrome);
    cylinderMesh.position.set(-2, -1, 2.2);
    cylinderMesh.rotation.z = Math.PI / 4;
    group.add(cylinderMesh);
    parts.push({
        name: "Hydraulic Lifting Cylinder",
        description: "Massive hydraulic ram.",
        material: "Chrome / Steel",
        function: "Pushes the beautifully balanced leaf up; it only needs enough power to overcome friction and wind, not the weight of the bridge.",
        assemblyOrder: 4,
        connections: ["Pier Base", "Leaf"],
        failureEffect: "Hydraulic seal blowout.",
        cascadeFailures: ["Bridge drifts down slowly"],
        originalPosition: {x:-2, y:-1, z:2.2},
        explodedPosition: {x:5, y:-1, z:2.2}
    });

    const description = "Civil Bascule Bridge: A drawbridge that uses a massive hidden counterweight to perfectly balance the long roadway 'leaf' over a central pivot (trunnion). Because it is balanced like a seesaw, only a relatively small motor is needed to lift thousands of tons.";

    const quizQuestions = [
        {
            question: "Why does a massive 2,000-ton bascule bridge only require a relatively small motor to open?",
            options: ["Because a hidden counterweight perfectly balances the roadway on the pivot (like a seesaw), so the motor only has to overcome friction and wind", "Because they use nuclear power", "Because the steel is hollow", "Because water pushes it up"],
            correct: 0,
            explanation: "The counterweight is engineered so the center of gravity of the entire moving structure sits exactly on the pivot axle (trunnion). The motor only needs to break inertia.",
            difficulty: "Medium"
        },
        {
            question: "What is the 'Trunnion'?",
            options: ["The massive steel axle and bearing that the entire bridge pivots on", "The roadway surface", "The boat going underneath", "The toll booth"],
            correct: 0,
            explanation: "A trunnion is a cylindrical protrusion used as a mounting/pivoting point. In a bascule bridge, it's the giant axle that supports the entire weight of the moving leaf.",
            difficulty: "Easy"
        },
        {
            question: "If snow or ice accumulates heavily on the roadway of a bascule bridge, what major problem occurs?",
            options: ["It throws off the perfect balance of the counterweight, overloading the lifting motors", "The bridge melts", "The boats crash", "The bridge shrinks"],
            correct: 0,
            explanation: "Bascule bridges are perfectly balanced. Adding tons of unforeseen weight (ice, snow, or even repaving the asphalt) to the long end of the seesaw makes the bridge 'span heavy', easily burning out the lifting motors.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Open and close the drawbridge smoothly
        if (group.children[1]) {
            // Map sine wave to 0 .. 1.2 radians
            const liftAngle = (Math.sin(time * speed) + 1) * 0.6; 
            group.children[1].rotation.z = liftAngle;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBasculeBridge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
