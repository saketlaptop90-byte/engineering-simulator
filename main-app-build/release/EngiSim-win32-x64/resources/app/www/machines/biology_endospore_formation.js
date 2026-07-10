import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const dnaGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const cytoplasmMat = new THREE.MeshPhysicalMaterial({
        color: 0x44aaff,
        transmission: 0.5,
        opacity: 0.5,
        transparent: true,
        roughness: 0.1,
        ior: 1.5
    });

    const membraneMat = new THREE.MeshStandardMaterial({
        color: 0x2288ff,
        emissive: 0x114488,
        emissiveIntensity: 0.5,
        wireframe: true
    });

    const cortexMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        emissiveIntensity: 0.4,
        roughness: 0.8
    });

    const sporeCoatMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0.2,
        bumpScale: 0.05
    });

    const exosporiumMat = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        transmission: 0.8,
        transparent: true,
        roughness: 0.4
    });

    const motherCellWall = new THREE.MeshStandardMaterial({
        color: 0x555555,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    // Mother Cell (Vegetative Cell) - Outer Shell
    const motherGeom = new THREE.CapsuleGeometry(2, 6, 16, 32);
    const motherMesh = new THREE.Mesh(motherGeom, motherCellWall);
    motherMesh.rotation.z = Math.PI / 2;
    group.add(motherMesh);
    
    parts.push({
        name: "Mother Cell Wall",
        description: "The original vegetative cell undergoing asymmetric division.",
        material: "motherCellWall",
        function: "Encompasses the entire sporulation process and eventually lyses to release the mature spore.",
        assemblyOrder: 1,
        connections: ["Cytoplasm", "Septum"],
        failureEffect: "Premature lysis leading to spore abortion.",
        cascadeFailures: ["Forespore Development", "Cortex Synthesis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: motherMesh
    });

    // Forespore (Developing Spore)
    const foresporeGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const foresporeMesh = new THREE.Mesh(foresporeGeom, cytoplasmMat);
    foresporeMesh.position.set(-2.5, 0, 0);
    group.add(foresporeMesh);

    parts.push({
        name: "Forespore Core",
        description: "The compartment that will become the mature endospore.",
        material: "cytoplasmMat",
        function: "Houses the spore DNA, ribosomes, and dipicolinic acid for extreme resistance.",
        assemblyOrder: 2,
        connections: ["Mother Cell Wall", "Inner Membrane"],
        failureEffect: "Lack of core components leads to a non-viable spore.",
        cascadeFailures: ["Germination"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 },
        mesh: foresporeMesh
    });

    // DNA in Forespore
    const dnaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0, -0.5),
        new THREE.Vector3(0.5, 0.5, 0),
        new THREE.Vector3(-0.2, -0.5, 0.5),
        new THREE.Vector3(0.5, 0, -0.5),
        new THREE.Vector3(-0.5, 0, -0.5)
    ]);
    const dnaGeom = new THREE.TubeGeometry(dnaCurve, 64, 0.05, 8, true);
    const dnaMesh = new THREE.Mesh(dnaGeom, dnaGlow);
    foresporeMesh.add(dnaMesh);

    parts.push({
        name: "Spore Nucleoid",
        description: "Highly compacted copy of the bacterial chromosome.",
        material: "dnaGlow",
        function: "Contains the genetic information necessary for the spore to germinate into a vegetative cell.",
        assemblyOrder: 3,
        connections: ["Forespore Core", "SASP Proteins"],
        failureEffect: "Genetic corruption due to radiation or heat.",
        cascadeFailures: ["Vegetative Growth"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 3, z: 0 },
        mesh: dnaMesh
    });

    // Inner Membrane
    const innerMemGeom = new THREE.SphereGeometry(1.25, 32, 32);
    const innerMemMesh = new THREE.Mesh(innerMemGeom, membraneMat);
    foresporeMesh.add(innerMemMesh);

    parts.push({
        name: "Inner Membrane",
        description: "The lipid bilayer surrounding the core.",
        material: "membraneMat",
        function: "Acts as a permeability barrier against damaging chemicals.",
        assemblyOrder: 4,
        connections: ["Forespore Core", "Cortex"],
        failureEffect: "Chemical damage to the core.",
        cascadeFailures: ["DNA Integrity"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: -3, z: 0 },
        mesh: innerMemMesh
    });

    // Cortex
    const cortexGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const cortexMesh = new THREE.Mesh(cortexGeom, cortexMat);
    foresporeMesh.add(cortexMesh);

    parts.push({
        name: "Peptidoglycan Cortex",
        description: "A thick layer of specialized peptidoglycan.",
        material: "cortexMat",
        function: "Maintains the core's dehydrated state, conferring extreme heat resistance.",
        assemblyOrder: 5,
        connections: ["Inner Membrane", "Outer Membrane", "Spore Coat"],
        failureEffect: "Hydration of the core, leading to loss of heat resistance.",
        cascadeFailures: ["Heat Tolerance", "Enzyme Function"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 3 },
        mesh: cortexMesh
    });

    // Spore Coats (Inner & Outer)
    const coatGeom = new THREE.SphereGeometry(1.6, 32, 32);
    const coatMesh = new THREE.Mesh(coatGeom, sporeCoatMat);
    foresporeMesh.add(coatMesh);

    parts.push({
        name: "Spore Coat",
        description: "Several proteinaceous layers covering the cortex.",
        material: "sporeCoatMat",
        function: "Provides resistance to enzymes and chemicals like hydrogen peroxide.",
        assemblyOrder: 6,
        connections: ["Cortex", "Exosporium"],
        failureEffect: "Vulnerability to lytic enzymes and toxic chemicals.",
        cascadeFailures: ["Environmental Survival"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: -3 },
        mesh: coatMesh
    });

    // Exosporium (optional outermost layer)
    const exoGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const exoMesh = new THREE.Mesh(exoGeom, exosporiumMat);
    foresporeMesh.add(exoMesh);

    parts.push({
        name: "Exosporium",
        description: "A loose, thin outermost layer found in some species (like B. anthracis).",
        material: "exosporiumMat",
        function: "Interacts with the environment and host immune system.",
        assemblyOrder: 7,
        connections: ["Spore Coat"],
        failureEffect: "Altered adhesion properties.",
        cascadeFailures: ["Host Infection"],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -9, y: 0, z: 0 },
        mesh: exoMesh
    });

    const description = "Bacterial Endospore Formation (Sporulation) is a complex developmental process triggered by starvation. The vegetative cell undergoes an asymmetric cell division, creating a large mother cell and a smaller forespore. The mother cell engulfs the forespore, and over several stages, synthesizes protective layers (cortex, coats, exosporium) around the forespore while heavily dehydrating its core. Finally, the mother cell lyses, releasing the highly resilient mature endospore, which can survive extreme heat, radiation, and chemicals for centuries.";

    const quizQuestions = [
        {
            question: "Which spore layer is primarily responsible for maintaining the core's dehydrated state, conferring heat resistance?",
            options: ["Exosporium", "Spore Coat", "Peptidoglycan Cortex", "Inner Membrane"],
            correct: 2,
            explanation: "The cortex is a specialized, thick peptidoglycan layer that mechanically dehydrates the core, which is critical for the spore's extreme heat resistance.",
            difficulty: "Medium"
        },
        {
            question: "During sporulation, the mother cell completely engulfs the forespore. What is the result of this engulfment?",
            options: ["The forespore is destroyed", "The forespore gains a second (outer) membrane", "The mother cell replicates its DNA again", "The forespore divides into two spores"],
            correct: 1,
            explanation: "Engulfment wraps the forespore in a layer of the mother cell's membrane, giving the forespore two membranes with opposite polarity (inner and outer membranes) between which the cortex will be built.",
            difficulty: "Hard"
        },
        {
            question: "What triggers the initiation of endospore formation in bacteria like Bacillus subtilis?",
            options: ["High nutrient availability", "UV radiation", "Nutrient starvation and high cell density", "Infection by a bacteriophage"],
            correct: 2,
            explanation: "Sporulation is typically a last-resort survival mechanism triggered by severe nutrient depletion and sensed via quorum sensing (high cell density).",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotating the entire mother cell slowly
        if (meshes["Mother Cell Wall"]) {
            meshes["Mother Cell Wall"].rotation.x = Math.sin(time * 0.5 * speed) * 0.1;
        }

        // Forespore pulsing and building layers
        if (meshes["Peptidoglycan Cortex"]) {
            const cortexScale = 1 + Math.sin(time * speed) * 0.02;
            meshes["Peptidoglycan Cortex"].scale.set(cortexScale, cortexScale, cortexScale);
        }

        // DNA spinning and compacting
        if (meshes["Spore Nucleoid"]) {
            meshes["Spore Nucleoid"].rotation.x += 0.05 * speed;
            meshes["Spore Nucleoid"].rotation.y += 0.03 * speed;
            const compactScale = 1 + Math.sin(time * speed * 2) * 0.05;
            meshes["Spore Nucleoid"].scale.set(compactScale, compactScale, compactScale);
        }

        // Outer layers undulating
        if (meshes["Exosporium"]) {
            const exoScale = 1 + Math.sin(time * 1.5 * speed) * 0.03;
            meshes["Exosporium"].scale.set(exoScale, exoScale, exoScale);
            meshes["Exosporium"].rotation.y += 0.01 * speed;
            meshes["Exosporium"].rotation.z += 0.01 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createEndosporeFormation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
