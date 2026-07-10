import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const plasterMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
    const liquidNeon = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff, emissive: 0xaa00aa, emissiveIntensity: 1,
        transparent: true, opacity: 0.8, transmission: 0.5
    });

    const moldGeo = new THREE.BoxGeometry(4, 4, 4);
    const moldMesh = new THREE.Mesh(moldGeo, plasterMat);
    moldMesh.position.set(0, 2, 0);
    group.add(moldMesh);
    parts.push({
        name: "Plaster of Paris Mold",
        description: "Two-part porous mold.",
        material: "Plaster",
        function: "Absorbs water from the slip, forming a solid clay wall.",
        assemblyOrder: 1,
        connections: [],
        failureEffect: "Mold gets too wet and breaks.",
        cascadeFailures: ["Slip leaks out"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:-5, y:2, z:0}
    });

    const slipGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.8, 32);
    const slipMesh = new THREE.Mesh(slipGeo, liquidNeon);
    slipMesh.position.set(0, 2, 0);
    group.add(slipMesh);
    parts.push({
        name: "Ceramic Slip (Liquid Clay)",
        description: "Suspension of clay particles in water.",
        material: "Liquid Neon",
        function: "Fills the mold and coats the inner surface.",
        assemblyOrder: 2,
        connections: ["Plaster Mold"],
        failureEffect: "Flocculation (clumping).",
        cascadeFailures: ["Uneven casting thickness"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const hoseGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const hoseMesh = new THREE.Mesh(hoseGeo, rubber);
    hoseMesh.position.set(0, 6, 0);
    group.add(hoseMesh);
    parts.push({
        name: "Slip Delivery Hose",
        description: "Industrial hose to pour slip.",
        material: "Rubber",
        function: "Pours liquid slip into the mold.",
        assemblyOrder: 3,
        connections: ["Slip Reservoir"],
        failureEffect: "Clogging.",
        cascadeFailures: ["Process stops"],
        originalPosition: {x:0, y:6, z:0},
        explodedPosition: {x:5, y:8, z:0}
    });

    const description = "Ceramics Slip Casting: A process where liquid clay (slip) is poured into a porous plaster mold. The mold absorbs water, forming a solid clay layer on the walls. Excess slip is then poured out, leaving a hollow ceramic piece.";

    const quizQuestions = [
        {
            question: "What is the key mechanism that makes slip casting work?",
            options: ["The plaster mold absorbs water, solidifying the clay at the mold wall", "Heat is applied to bake the liquid clay", "Centrifugal force pushes clay to the walls", "Chemical hardeners are added"],
            correct: 0,
            explanation: "The porous nature of the plaster mold uses capillary action to draw water out of the slip, creating a solid 'cast' of clay against the mold surface.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of a deflocculant (like sodium silicate) in the slip?",
            options: ["To reduce the amount of water needed to make it liquid", "To make it dry faster", "To change the color", "To make the plaster mold last longer"],
            correct: 0,
            explanation: "Deflocculants cause clay particles to repel each other, allowing the slip to be highly fluid with a much lower water content, reducing shrinkage when drying.",
            difficulty: "Hard"
        },
        {
            question: "Slip casting is best suited for producing what kind of objects?",
            options: ["Complex hollow shapes (like teapots and sanitaryware)", "Solid bricks", "Flat plates", "Long pipes"],
            correct: 0,
            explanation: "Because excess slip is poured out of the mold, leaving only a shell on the inside walls, it is ideal for creating complex hollow shapes.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Simulate slip level rising and falling
        if (meshes[1]) {
            const level = 2 + Math.sin(time * speed) * 1.5;
            meshes[1].scale.y = level / 3.8;
            meshes[1].position.y = 2 - (3.8 - level)/2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSlipCastingTable() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
