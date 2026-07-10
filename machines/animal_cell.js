import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowNucleus = new THREE.MeshPhysicalMaterial({ color: 0x9933ff, emissive: 0x4400aa, emissiveIntensity: 0.8, transmission: 0.5, opacity: 0.9, transparent: true });
    const glowMitochondria = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xcc2200, emissiveIntensity: 0.5, wireframe: true });
    const glowER = new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x0055aa, emissiveIntensity: 0.6, transparent: true, opacity: 0.7 });
    const cellMembraneMat = new THREE.MeshPhysicalMaterial({ color: 0x5588cc, transmission: 0.5, opacity: 0.4, transparent: true, clearcoat: 1.0 });

    // Cell Membrane
    const cellGeo = new THREE.SphereGeometry(10, 64, 64);
    const cellMembrane = new THREE.Mesh(cellGeo, cellMembraneMat);
    group.add(cellMembrane);
    parts.push({
        name: "Cell Membrane",
        description: "Semi-permeable lipid bilayer that protects the cell and regulates what enters and exits.",
        material: "lipid",
        function: "Protection and Transport",
        assemblyOrder: 1,
        connections: ["Cytoplasm"],
        failureEffect: "Cell lysis, uncontrolled substance entry/exit.",
        cascadeFailures: ["Homeostasis collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // Nucleus
    const nucleusGeo = new THREE.SphereGeometry(3, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeo, glowNucleus);
    group.add(nucleus);
    parts.push({
        name: "Nucleus",
        description: "The control center of the cell, housing DNA and coordinating cell activities.",
        material: "protein/lipid",
        function: "Information storage and control",
        assemblyOrder: 2,
        connections: ["Cytoplasm", "Endoplasmic Reticulum"],
        failureEffect: "Loss of genetic regulation, failure to synthesize proteins.",
        cascadeFailures: ["Cell death", "Loss of reproduction capability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: nucleus
    });

    // Mitochondria (Create a few)
    const mitoGeo = new THREE.CapsuleGeometry(0.8, 1.5, 16, 32);
    const mitoPositions = [
        { x: 4, y: 2, z: 3 },
        { x: -3, y: -4, z: 2 },
        { x: -5, y: 1, z: -4 },
        { x: 2, y: -3, z: -5 }
    ];

    const mitochondriaMeshes = [];
    mitoPositions.forEach((pos, index) => {
        const mito = new THREE.Mesh(mitoGeo, glowMitochondria);
        mito.position.set(pos.x, pos.y, pos.z);
        mito.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        group.add(mito);
        mitochondriaMeshes.push(mito);
        parts.push({
            name: `Mitochondrion ${index + 1}`,
            description: "The powerhouse of the cell, generating ATP through cellular respiration.",
            material: "protein/lipid",
            function: "Energy Production",
            assemblyOrder: 3 + index,
            connections: ["Cytoplasm"],
            failureEffect: "Energy depletion, inability to power cellular processes.",
            cascadeFailures: ["Active transport failure", "Apoptosis"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x * 2, y: pos.y * 2, z: pos.z * 2 },
            mesh: mito
        });
    });

    // Endoplasmic Reticulum (Rough and Smooth)
    const erGeo = new THREE.TorusKnotGeometry(4, 0.5, 100, 16);
    const er = new THREE.Mesh(erGeo, glowER);
    er.position.set(0, 0, 0);
    group.add(er);
    parts.push({
        name: "Endoplasmic Reticulum",
        description: "Network of membranes involved in protein and lipid synthesis.",
        material: "lipid/protein",
        function: "Synthesis and Transport",
        assemblyOrder: 7,
        connections: ["Nucleus", "Cytoplasm"],
        failureEffect: "Protein misfolding, lipid shortage.",
        cascadeFailures: ["Membrane breakdown", "Enzyme deficiency"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 15 },
        mesh: er
    });

    const description = "A high-tech, glowing representation of an Animal Cell. It highlights the primary organelles such as the Nucleus, Mitochondria, and Endoplasmic Reticulum, suspended within the Cell Membrane.";

    const quizQuestions = [
        {
            question: "Which organelle is considered the powerhouse of the animal cell?",
            options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi Apparatus"],
            correct: 2,
            explanation: "Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the Cell Membrane?",
            options: ["Energy production", "Regulating transport of substances in and out", "Storing genetic material", "Synthesizing proteins"],
            correct: 1,
            explanation: "The cell membrane is semi-permeable, protecting the cell and controlling the movement of substances.",
            difficulty: "easy"
        },
        {
            question: "Where is the genetic material (DNA) primarily located within the animal cell?",
            options: ["Cytoplasm", "Endoplasmic Reticulum", "Mitochondria", "Nucleus"],
            correct: 3,
            explanation: "The nucleus acts as the control center of the cell and houses the majority of its genetic material.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // time is time in ms
        const t = time * 0.001 * speed;
        
        // Gentle rotation of the whole cell
        group.rotation.y = t * 0.1;
        group.rotation.x = t * 0.05;

        // Animate mitochondria floating
        mitochondriaMeshes.forEach((mito, i) => {
            mito.position.y += Math.sin(t * 2 + i) * 0.01;
            mito.rotation.x += 0.01 * speed;
            mito.rotation.z += 0.015 * speed;
        });

        // ER subtle pulsing and rotation
        if(er) {
            er.rotation.x = Math.sin(t * 0.5) * 0.2;
            er.rotation.y = Math.cos(t * 0.5) * 0.2;
            const scale = 1 + Math.sin(t * 3) * 0.02;
            er.scale.set(scale, scale, scale);
        }

        // Nucleus slow spin
        if(nucleus) {
            nucleus.rotation.y = -t * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAnimalCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
