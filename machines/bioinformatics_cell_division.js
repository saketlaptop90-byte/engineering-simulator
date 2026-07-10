import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingDNA = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
    });

    const glowingSpindle = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        wireframe: true,
    });

    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2244aa,
        transparent: true,
        opacity: 0.2,
        roughness: 0.3,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.2
    });

    const centrioleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0x555500,
        roughness: 0.4,
        metalness: 0.6
    });

    // 1. Cell Membrane
    const membraneGeo = new THREE.SphereGeometry(10, 64, 64);
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMaterial);
    group.add(membraneMesh);
    parts.push({
        name: "Cell Membrane",
        description: "The semipermeable membrane surrounding the cytoplasm of a cell.",
        material: "membraneMaterial",
        function: "Encloses cell contents and regulates transport.",
        assemblyOrder: 1,
        connections: ["Cytoplasm"],
        failureEffect: "Cell lysis",
        cascadeFailures: ["Total cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });
    membraneMesh.userData.name = "Cell Membrane";

    // 2. Chromosomes (Left and Right halves)
    const chromosomePairs = new THREE.Group();
    const chromoGeo = new THREE.CapsuleGeometry(0.5, 3, 8, 16);
    
    // Create 4 pairs of chromosomes
    for(let i=0; i<4; i++) {
        const pair = new THREE.Group();
        const chromatid1 = new THREE.Mesh(chromoGeo, glowingDNA);
        const chromatid2 = new THREE.Mesh(chromoGeo, glowingDNA);
        
        chromatid1.position.set(-0.6, 0, 0);
        chromatid2.position.set(0.6, 0, 0);
        
        // Centromere
        const centromereGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const centromere = new THREE.Mesh(centromereGeo, chrome);
        
        pair.add(chromatid1);
        pair.add(chromatid2);
        pair.add(centromere);
        
        pair.position.y = (i - 1.5) * 4;
        pair.rotation.z = Math.random() * Math.PI / 4 - Math.PI / 8;
        
        chromosomePairs.add(pair);
    }
    group.add(chromosomePairs);
    
    parts.push({
        name: "Chromosomes",
        description: "Thread-like structures of nucleic acids and protein found in the nucleus.",
        material: "glowingDNA",
        function: "Carries genetic information in the form of genes.",
        assemblyOrder: 2,
        connections: ["Spindle Fibers", "Centromeres"],
        failureEffect: "Genetic mutation",
        cascadeFailures: ["Apoptosis", "Cancer"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 15 }
    });
    chromosomePairs.userData.name = "Chromosomes";

    // 3. Centrosomes / Centrioles
    const centrosomeGroup = new THREE.Group();
    const centrioleGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    
    const centrosomeTop = new THREE.Group();
    const c1 = new THREE.Mesh(centrioleGeo, centrioleMaterial);
    const c2 = new THREE.Mesh(centrioleGeo, centrioleMaterial);
    c1.rotation.x = Math.PI / 2;
    centrosomeTop.add(c1);
    centrosomeTop.add(c2);
    centrosomeTop.position.set(0, 8, 0);
    
    const centrosomeBottom = new THREE.Group();
    const c3 = new THREE.Mesh(centrioleGeo, centrioleMaterial);
    const c4 = new THREE.Mesh(centrioleGeo, centrioleMaterial);
    c3.rotation.x = Math.PI / 2;
    centrosomeBottom.add(c3);
    centrosomeBottom.add(c4);
    centrosomeBottom.position.set(0, -8, 0);
    
    centrosomeGroup.add(centrosomeTop);
    centrosomeGroup.add(centrosomeBottom);
    group.add(centrosomeGroup);

    parts.push({
        name: "Centrosomes",
        description: "Organelles near the nucleus of a cell that contain the centrioles.",
        material: "centrioleMaterial",
        function: "Organizes microtubules and provides structure for the cell, as well as works to pull chromatids apart during cell division.",
        assemblyOrder: 3,
        connections: ["Spindle Fibers"],
        failureEffect: "Unequal chromosome segregation",
        cascadeFailures: ["Aneuploidy"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: -15 }
    });
    centrosomeGroup.userData.name = "Centrosomes";

    // 4. Spindle Fibers
    const spindleGroup = new THREE.Group();
    const fiberGeo = new THREE.CylinderGeometry(0.05, 0.05, 16, 8);
    for(let i=0; i<16; i++) {
        const fiber = new THREE.Mesh(fiberGeo, glowingSpindle);
        fiber.position.set(
            (Math.random() - 0.5) * 4,
            0,
            (Math.random() - 0.5) * 4
        );
        fiber.rotation.z = fiber.position.x * -0.1;
        fiber.rotation.x = fiber.position.z * 0.1;
        spindleGroup.add(fiber);
    }
    group.add(spindleGroup);

    parts.push({
        name: "Spindle Fibers",
        description: "Form a protein structure that divides the genetic material in a cell.",
        material: "glowingSpindle",
        function: "Separates chromosomes into two daughter cells during mitosis.",
        assemblyOrder: 4,
        connections: ["Chromosomes", "Centrosomes"],
        failureEffect: "Failed mitosis",
        cascadeFailures: ["Cell cycle arrest"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -20 }
    });
    spindleGroup.userData.name = "Spindle Fibers";

    const meshes = {
        membrane: membraneMesh,
        chromosomes: chromosomePairs,
        centrosomes: centrosomeGroup,
        spindles: spindleGroup
    };

    const description = "A highly detailed, visually stunning biomechanical simulation of Cell Division (Mitosis). Witness the glowing DNA strands duplicate, align, and separate as the mitotic spindle fibers coordinate complex chromosomal movements within a dynamically deforming cell membrane.";

    const quizQuestions = [
        {
            question: "During which phase of mitosis do chromosomes align along the cell equator?",
            options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
            correct: 1,
            explanation: "During metaphase, the spindle fibers pull the chromosomes to align them along the metaphase plate or equator of the cell.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the spindle fibers during cell division?",
            options: ["To replicate DNA", "To dissolve the nuclear envelope", "To pull sister chromatids apart", "To synthesize proteins"],
            correct: 2,
            explanation: "Spindle fibers attach to the centromeres of the chromosomes and pull the sister chromatids towards opposite poles during anaphase.",
            difficulty: "Medium"
        },
        {
            question: "What structure forms to divide an animal cell into two daughter cells during cytokinesis?",
            options: ["Cell plate", "Cleavage furrow", "Centrosome", "Nuclear envelope"],
            correct: 1,
            explanation: "In animal cells, a cleavage furrow forms to pinch the cell membrane inwards, eventually splitting the cell into two distinct daughter cells.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Anaphase simulation loop using sine waves
        const stage = (Math.sin(time * speed * 0.5) + 1) / 2; // 0 to 1

        // Membrane stretches
        meshesObj.membrane.scale.set(1 + stage * 0.5, 1 - stage * 0.2, 1 + stage * 0.5);
        meshesObj.membrane.rotation.y = time * speed * 0.1;

        // Centrosomes move further apart
        meshesObj.centrosomes.children[0].position.y = 8 + stage * 4;
        meshesObj.centrosomes.children[1].position.y = -8 - stage * 4;

        // Chromosomes pull apart
        meshesObj.chromosomes.children.forEach((pair) => {
            pair.children[0].position.x = -0.6 - stage * 5; // Pull left
            pair.children[1].position.x = 0.6 + stage * 5;  // Pull right
            pair.children[0].rotation.z = stage * Math.PI / 4;
            pair.children[1].rotation.z = -stage * Math.PI / 4;
            
            // Centromere fades or splits
            pair.children[2].scale.setScalar(1 - Math.max(0, stage * 1.2));
        });

        // Spindle fibers stretch and fade
        meshesObj.spindles.scale.y = 1 + stage * 0.5;
        meshesObj.spindles.children.forEach((fiber, i) => {
            fiber.rotation.y = time * speed * (0.2 + i * 0.01);
            fiber.material.opacity = 0.7 * (1 - stage * 0.5);
        });
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createCellDivision() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
