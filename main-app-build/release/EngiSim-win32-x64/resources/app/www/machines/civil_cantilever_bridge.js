import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0x999999 });

    // A Cantilever bridge is built from two massive arms reaching out from piers, supporting a central suspended span.
    
    // Left Pier and Cantilever Arm
    const leftArmGrp = new THREE.Group();
    
    const pierGeo = new THREE.BoxGeometry(2, 10, 2);
    const leftPier = new THREE.Mesh(pierGeo, concreteMat);
    leftPier.position.set(-8, 5, 0);
    leftArmGrp.add(leftPier);

    // Anchor Arm (goes back to land)
    const anchorArmGeo = new THREE.BoxGeometry(8, 1, 2);
    const leftAnchor = new THREE.Mesh(anchorArmGeo, steel);
    leftAnchor.position.set(-12, 10, 0);
    leftArmGrp.add(leftAnchor);
    
    // Cantilever Arm (reaches over water)
    const cantArmGeo = new THREE.BoxGeometry(6, 1, 2);
    const leftCant = new THREE.Mesh(cantArmGeo, steel);
    leftCant.position.set(-5, 10, 0);
    leftArmGrp.add(leftCant);

    group.add(leftArmGrp);
    parts.push({
        name: "Left Cantilever & Anchor Arm",
        description: "Massive steel truss structure balanced on a single pier.",
        material: "Steel / Concrete",
        function: "Acts like a giant diving board or seesaw. The heavy anchor arm holds down the back so the cantilever arm can reach out over the river.",
        assemblyOrder: 1,
        connections: ["Suspended Span", "Left Foundation"],
        failureEffect: "Anchor tie-down failure.",
        cascadeFailures: ["Entire structure tips forward into the river"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:-5, y:5, z:0}
    });

    // Right Pier and Cantilever Arm
    const rightArmGrp = new THREE.Group();
    const rightPier = new THREE.Mesh(pierGeo, concreteMat);
    rightPier.position.set(8, 5, 0);
    rightArmGrp.add(rightPier);

    const rightAnchor = new THREE.Mesh(anchorArmGeo, steel);
    rightAnchor.position.set(12, 10, 0);
    rightArmGrp.add(rightAnchor);

    const rightCant = new THREE.Mesh(cantArmGeo, steel);
    rightCant.position.set(5, 10, 0);
    rightArmGrp.add(rightCant);

    group.add(rightArmGrp);
    parts.push({
        name: "Right Cantilever & Anchor Arm",
        description: "Symmetrical steel truss balanced on the right pier.",
        material: "Steel / Concrete",
        function: "Reaches out from the opposite shore to meet in the middle.",
        assemblyOrder: 2,
        connections: ["Suspended Span", "Right Foundation"],
        failureEffect: "Truss buckling.",
        cascadeFailures: ["Catastrophic structural collapse"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:5, y:5, z:0}
    });

    // Suspended central span
    const spanGeo = new THREE.BoxGeometry(4, 0.8, 2);
    const spanMesh = new THREE.Mesh(spanGeo, darkSteel);
    spanMesh.position.set(0, 10, 0); // Sits between the two cantilever arms
    group.add(spanMesh);
    parts.push({
        name: "Central Suspended Span",
        description: "A completely separate, simple beam bridge section.",
        material: "Steel",
        function: "Rests entirely on the tips of the two reaching cantilever arms to bridge the final gap in the middle of the river.",
        assemblyOrder: 3,
        connections: ["Left Cantilever", "Right Cantilever"],
        failureEffect: "Hinge failure.",
        cascadeFailures: ["Central span drops straight into the water"],
        originalPosition: {x:0, y:10, z:0},
        explodedPosition: {x:0, y:15, z:0}
    });

    const description = "Civil Cantilever Bridge: A brilliant engineering solution for crossing deep or turbulent rivers without building scaffolding in the water. It works like two giant diving boards reaching out from the shores, with a smaller, simple bridge dropped between their tips to connect them.";

    const quizQuestions = [
        {
            question: "How does a Cantilever bridge stay standing without tipping over into the river?",
            options: ["It operates like a perfectly balanced seesaw; the massive weight of the 'anchor arm' pulling down on land counterbalances the 'cantilever arm' reaching over the water", "It is held up by hot air balloons", "It is glued to the sky", "The water pushes it up"],
            correct: 0,
            explanation: "The pier acts as a fulcrum (pivot). The short, heavy 'anchor arm' is tied firmly into massive bedrock on the shore, which balances the long, lighter 'cantilever arm' reaching out over the river.",
            difficulty: "Medium"
        },
        {
            question: "Why was the cantilever bridge design so revolutionary for crossing dangerous rivers?",
            options: ["It can be built outward piece-by-piece entirely from the air, without needing to build temporary wooden scaffolding (falsework) from the bottom of a deep/fast river", "It was the first bridge made of plastic", "It floats", "It can fold up"],
            correct: 0,
            explanation: "Because it's balanced, workers can build it outward piece by piece over thin air. This is vital when the river is too deep, fast, or prone to ice-jams to allow building support pillars in the middle.",
            difficulty: "Hard"
        },
        {
            question: "What is the 'Suspended Span'?",
            options: ["A simple bridge segment that is dropped into place, resting entirely on the tips of the two opposing cantilever arms", "The cables holding the bridge", "The road going to the bridge", "The toll booth"],
            correct: 0,
            explanation: "The two reaching cantilever arms often don't touch each other. A third, smaller, completely separate bridge section is simply hung between their tips, bridging the final gap.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Simulate heavy load causing bending
        if (group.children[2]) {
            // Central span sags slightly
            const sag = Math.sin(time * speed * 2) * 0.1;
            group.children[2].position.y = 10 - sag;
            
            // Cantilever tips bend down slightly with the load
            if(group.children[0] && group.children[1]) {
                group.children[0].rotation.z = -sag * 0.02; // left arm tilts right
                group.children[1].rotation.z = sag * 0.02;  // right arm tilts left
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCantileverBridgeSection() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
