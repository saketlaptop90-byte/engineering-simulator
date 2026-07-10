import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const chloroplastGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x004400, emissiveIntensity: 1,
        transparent: true, opacity: 0.7, roughness: 0.2
    });

    const thylakoidMat = new THREE.MeshPhysicalMaterial({
        color: 0x00cc00, emissive: 0x009900, emissiveIntensity: 1.5,
        roughness: 0.5
    });

    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const outerMembraneGeo = new THREE.SphereGeometry(4, 32, 32);
    outerMembraneGeo.scale(1, 0.6, 0.8); // Make it an ellipsoid
    const outerMembraneMesh = new THREE.Mesh(outerMembraneGeo, chloroplastGreen);
    outerMembraneMesh.position.set(0, 0, 0);
    group.add(outerMembraneMesh);
    parts.push({
        name: "Outer & Inner Envelope Membranes",
        description: "Double phospholipid bilayer.",
        material: "Translucent Green Membrane",
        function: "Regulates the flow of materials in and out of the organelle.",
        assemblyOrder: 1,
        connections: ["Stroma"],
        failureEffect: "Cellular leakage.",
        cascadeFailures: ["Organelle death"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:6, z:0}
    });

    // Create Grana (Stacks of Thylakoids)
    const granaGroup = new THREE.Group();
    const thylakoidGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
    
    // Create 5 grana stacks
    const positions = [
        {x: -1.5, z: 0}, {x: 1.5, z: 0}, {x: 0, z: 1.5}, {x: 0, z: -1.5}, {x: 0, z: 0}
    ];
    
    positions.forEach(pos => {
        for(let j=0; j<6; j++) { // 6 discs per stack
            const t = new THREE.Mesh(thylakoidGeo, thylakoidMat);
            t.position.set(pos.x, -0.6 + (j * 0.15), pos.z);
            granaGroup.add(t);
        }
    });
    group.add(granaGroup);
    parts.push({
        name: "Grana (Thylakoid Stacks)",
        description: "Stacks of hollow disk-like membranes.",
        material: "Glowing Thylakoid",
        function: "Contains the chlorophyll pigment; site of the light-dependent reactions of photosynthesis.",
        assemblyOrder: 2,
        connections: ["Stroma"],
        failureEffect: "Inability to capture light.",
        cascadeFailures: ["Plant starves"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-4, z:0}
    });

    const photonGrp = new THREE.Group();
    const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
    for(let i=0; i<10; i++) {
        const p = new THREE.Mesh(pGeo, photonMat);
        p.position.set((Math.random()-0.5)*5, 5 + Math.random()*5, (Math.random()-0.5)*5);
        photonGrp.add(p);
    }
    group.add(photonGrp);
    parts.push({
        name: "Incoming Photons",
        description: "Particles of light from the sun.",
        material: "Pure Energy",
        function: "Provides the energy to split water and excite electrons in the chlorophyll.",
        assemblyOrder: 3,
        connections: ["Grana"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:10, z:0}
    });

    const description = "Chloroplast: The biological solar panel found in plant cells. It uses complex stacked membranes filled with chlorophyll to capture sunlight and convert carbon dioxide and water into glucose and oxygen.";

    const quizQuestions = [
        {
            question: "What is the specific name of the pancake-like membrane discs where the light reactions occur?",
            options: ["Thylakoids", "Mitochondria", "Nuclei", "Vacuoles"],
            correct: 0,
            explanation: "Thylakoids are the flattened sacs inside a chloroplast. They are stacked into 'grana' to maximize the surface area exposed to sunlight.",
            difficulty: "Medium"
        },
        {
            question: "What is the 'Stroma'?",
            options: ["The aqueous fluid surrounding the thylakoids where the Calvin cycle occurs", "The hard outer shell of the chloroplast", "The root system of the plant", "A type of sugar"],
            correct: 0,
            explanation: "The stroma is the liquid-filled inner space of the chloroplast. While light reactions happen in the thylakoids, the 'dark reactions' (Calvin cycle) that actually build the sugar occur in the stroma.",
            difficulty: "Hard"
        },
        {
            question: "Which pigment is primarily responsible for giving chloroplasts their green color and absorbing light energy?",
            options: ["Chlorophyll", "Hemoglobin", "Melanin", "Carotene"],
            correct: 0,
            explanation: "Chlorophyll absorbs blue and red light for energy, but reflects green light, giving plants their characteristic color.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rain down photons
        if (meshes[2]) {
            meshes[2].children.forEach((p) => {
                p.position.y -= speed * 5;
                if (p.position.y < -2) p.position.y = 8;
            });
        }
        // Pulse the grana to show energy absorption
        if (meshes[1]) {
            meshes[1].children.forEach((t, idx) => {
                t.material.emissiveIntensity = 1.5 + Math.sin(time*speed*5 + idx)*0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createChloroplast() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
