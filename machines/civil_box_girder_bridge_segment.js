import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({
        color: 0xcccccc, roughness: 1.0, metalness: 0.1
    });

    const tendonMat = new THREE.MeshPhysicalMaterial({
        color: 0xff4400, emissive: 0xaa2200, roughness: 0.2 // Glowing to show tension
    });

    // We will build a hollow box girder using multiple boxes to form a cross-section
    const girderGrp = new THREE.Group();
    
    // Top deck (roadway)
    const deckGeo = new THREE.BoxGeometry(10, 0.5, 6);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, 2.5, 0);
    girderGrp.add(deck);

    // Bottom slab
    const botGeo = new THREE.BoxGeometry(6, 0.5, 6);
    const bot = new THREE.Mesh(botGeo, concreteMat);
    bot.position.set(0, -2.5, 0);
    girderGrp.add(bot);

    // Left web
    const webGeo = new THREE.BoxGeometry(0.5, 4.5, 6);
    const webL = new THREE.Mesh(webGeo, concreteMat);
    // Slant it slightly inward
    webL.position.set(-2.75, 0, 0);
    webL.rotation.z = -0.1;
    girderGrp.add(webL);

    // Right web
    const webR = new THREE.Mesh(webGeo, concreteMat);
    webR.position.set(2.75, 0, 0);
    webR.rotation.z = 0.1;
    girderGrp.add(webR);

    group.add(girderGrp);
    parts.push({
        name: "Hollow Concrete Box Section",
        description: "Massive precast concrete segment.",
        material: "High-Strength Concrete",
        function: "Provides the incredibly stiff, torsion-resistant aerodynamic shape required for long highway bridges.",
        assemblyOrder: 1,
        connections: ["Adjacent Segments", "Post-Tensioning Cables"],
        failureEffect: "Shear cracking.",
        cascadeFailures: ["Water intrusion", "Rebar rust"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    // Post-Tensioning Tendons running through the webs
    const tendonGrp = new THREE.Group();
    const tGeo = new THREE.CylinderGeometry(0.1, 0.1, 7, 16);
    const t1 = new THREE.Mesh(tGeo, tendonMat);
    t1.rotation.x = Math.PI / 2;
    t1.position.set(-2.75, -2, 0);
    tendonGrp.add(t1);
    
    const t2 = new THREE.Mesh(tGeo, tendonMat);
    t2.rotation.x = Math.PI / 2;
    t2.position.set(2.75, -2, 0);
    tendonGrp.add(t2);

    const t3 = new THREE.Mesh(tGeo, tendonMat);
    t3.rotation.x = Math.PI / 2;
    t3.position.set(0, 2.2, 0); // Top deck tendons
    tendonGrp.add(t3);

    group.add(tendonGrp);
    parts.push({
        name: "Post-Tensioning Tendons",
        description: "Bundles of high-tensile steel cables threaded through ducts in the concrete.",
        material: "Steel (Glowing Orange)",
        function: "Pulled to millions of pounds of tension to squeeze the concrete blocks together, eliminating tension forces in the concrete.",
        assemblyOrder: 2,
        connections: ["Anchors", "Concrete Segment"],
        failureEffect: "Tendon snap.",
        cascadeFailures: ["Loss of compression", "Concrete cracks under tension", "Bridge collapse"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    const keyGeo = new THREE.BoxGeometry(0.5, 0.5, 6);
    const keyMesh = new THREE.Mesh(keyGeo, steel);
    keyMesh.position.set(0, 0, 3);
    group.add(keyMesh);
    parts.push({
        name: "Epoxy Shear Keys",
        description: "Interlocking jagged teeth on the face of the segment.",
        material: "Concrete / Epoxy",
        function: "Locks into the adjacent segment like Lego blocks, glued together with high-strength epoxy to transfer vertical shear forces.",
        assemblyOrder: 3,
        connections: ["Adjacent Segment"],
        failureEffect: "Epoxy fails to cure.",
        cascadeFailures: ["Segments slip vertically"],
        originalPosition: {x:0, y:0, z:3},
        explodedPosition: {x:0, y:0, z:8}
    });

    const description = "Civil Box Girder Bridge Segment: A massive, hollow precast concrete block used to build modern elevated highways. They are hoisted into the air, glued together, and squeezed incredibly tight by steel cables (post-tensioning) to form a bridge without needing scaffolding underneath.";

    const quizQuestions = [
        {
            question: "Why is the bridge segment hollow (a 'box') instead of a solid block of concrete?",
            options: ["A hollow tube provides massive torsional (twisting) stiffness and bending strength while shedding unnecessary dead weight", "To run cars inside it", "Because they ran out of concrete", "To let the wind blow through it"],
            correct: 0,
            explanation: "Concrete in the middle of a solid block does very little structural work but adds immense weight. Pushing the material to the outer edges (creating a box) maximizes the moment of inertia, making it extremely stiff against bending and twisting.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the 'Post-Tensioning Tendons' (steel cables)?",
            options: ["Concrete is weak in tension. The cables act like a rubber band, squeezing the blocks together so tightly that they never experience tension, only compression", "To tie the bridge to the ground", "To carry electrical power", "To catch the bridge if it falls"],
            correct: 0,
            explanation: "Concrete crushes a soda can easily (high compressive strength) but pulls apart easily (low tensile strength). By pulling steel cables tight through the blocks, it pre-squeezes them. When a truck drives over, it just reduces the squeeze, rather than tearing the concrete apart.",
            difficulty: "Hard"
        },
        {
            question: "How are these segments typically assembled over deep water or busy highways?",
            options: ["Using the 'balanced cantilever' method, adding one block to each side of a pillar to stay balanced like a seesaw", "By building a massive dirt ramp", "By flying them in by helicopters", "They are poured in place"],
            correct: 0,
            explanation: "To avoid building scaffolding from the ground up, cranes sit on top of the bridge pillar and place one segment on the left, then one on the right, gluing and tensioning them as they grow outward in perfect balance.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the tendons to show they are under extreme tension
        if (group.children[1]) {
            group.children[1].children.forEach(t => {
                t.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBoxGirderBridgeSegment() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
