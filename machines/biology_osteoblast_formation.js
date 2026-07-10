import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech/Glowing Materials
    const glowCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const boneMatrixMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc, // Neon bio-mechanical bone
        emissive: 0x002211,
        roughness: 0.2,
        metalness: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });

    const calciumCrystalMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        roughness: 0.1,
        metalness: 0.9
    });

    // 1. Core Cell Body (Cyber-Osteoblast)
    const bodyGeo = new THREE.IcosahedronGeometry(4, 2);
    const bodyMesh = new THREE.Mesh(bodyGeo, tinted); // glass/tinted to see inside
    bodyMesh.position.set(0, 5, 0);
    group.add(bodyMesh);
    meshes.body = bodyMesh;

    parts.push({
        name: "Cell Membrane",
        description: "The protective outer layer of the cyber-osteoblast containing specialized receptors.",
        material: "tinted glass",
        function: "Encloses cellular machinery and responds to systemic hormonal signals (like PTH or Vitamin D).",
        assemblyOrder: 1,
        connections: ["Nucleus", "Receptors"],
        failureEffect: "Loss of cell integrity, inability to respond to bone-building signals.",
        cascadeFailures: ["Stops all bone formation processes"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 2. Nucleus (Instruction Center)
    const nucleusGeo = new THREE.OctahedronGeometry(1.5, 1);
    const nucleusMesh = new THREE.Mesh(nucleusGeo, glowCyan);
    bodyMesh.add(nucleusMesh);
    meshes.nucleus = nucleusMesh;

    parts.push({
        name: "Command Nucleus",
        description: "The central processing unit containing DNA blueprints for collagen and other bone matrix proteins.",
        material: "glowing cyan plasma",
        function: "Transcribes genetic instructions for osteoid production.",
        assemblyOrder: 2,
        connections: ["Endoplasmic Reticulum"],
        failureEffect: "Halt in protein synthesis instructions.",
        cascadeFailures: ["No collagen production", "Bone matrix degradation"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 5, z: -10}
    });

    // 3. Rough ER (Collagen Factory)
    const erGeo = new THREE.TorusKnotGeometry(2, 0.2, 100, 16);
    const erMesh = new THREE.Mesh(erGeo, glowMagenta);
    bodyMesh.add(erMesh);
    meshes.er = erMesh;

    parts.push({
        name: "Rough Endoplasmic Reticulum",
        description: "Extensive network of tubular structures studded with synthetic ribosomes.",
        material: "magenta cyber-tubing",
        function: "Translates instructions into Type I collagen proteins.",
        assemblyOrder: 3,
        connections: ["Nucleus", "Golgi Apparatus"],
        failureEffect: "Defective or insufficient collagen chains.",
        cascadeFailures: ["Brittle bone disease (Osteogenesis Imperfecta)"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 10, y: 5, z: 0}
    });

    // 4. Secretory Vesicles (Delivery Drones)
    meshes.vesicles = [];
    for(let i=0; i<8; i++) {
        const vGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const vMesh = new THREE.Mesh(vGeo, chrome);
        bodyMesh.add(vMesh);
        meshes.vesicles.push({
            mesh: vMesh,
            angle: (i / 8) * Math.PI * 2,
            phase: Math.random() * Math.PI * 2
        });
    }

    parts.push({
        name: "Secretory Vesicles",
        description: "Nano-delivery drones transporting collagen and enzymes to the cell surface.",
        material: "chrome",
        function: "Exocytosis of osteoid (unmineralized bone matrix) into the extracellular space.",
        assemblyOrder: 4,
        connections: ["Cell Membrane", "Bone Matrix"],
        failureEffect: "Intracellular buildup of matrix proteins; no external structure formed.",
        cascadeFailures: ["Matrix fails to deploy"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: -10, y: 5, z: 0}
    });

    // 5. Osteoid Matrix (The 3D Printed Scaffold)
    const matrixGeo = new THREE.BoxGeometry(12, 2, 12, 8, 1, 8);
    const matrixMesh = new THREE.Mesh(matrixGeo, boneMatrixMat);
    matrixMesh.position.set(0, -3, 0);
    group.add(matrixMesh);
    meshes.matrix = matrixMesh;

    parts.push({
        name: "Osteoid Scaffold",
        description: "The 3D-printed organic framework primarily composed of Type I collagen.",
        material: "neon bio-mechanical wireframe",
        function: "Provides tensile strength and a scaffolding for mineral deposition.",
        assemblyOrder: 5,
        connections: ["Secretory Vesicles", "Mineral Nodes"],
        failureEffect: "Weak, uncalcified tissue instead of rigid bone.",
        cascadeFailures: ["Rickets", "Osteomalacia"],
        originalPosition: {x: 0, y: -3, z: 0},
        explodedPosition: {x: 0, y: -12, z: 0}
    });

    // 6. Mineralization Nodes (Calcium Phosphate Crystals)
    meshes.crystals = new THREE.Group();
    for(let i=0; i<60; i++) {
        const cGeo = new THREE.TetrahedronGeometry(0.2 + Math.random()*0.4);
        const cMesh = new THREE.Mesh(cGeo, calciumCrystalMat);
        cMesh.position.set(
            (Math.random() - 0.5) * 11,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 11
        );
        cMesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        meshes.crystals.add(cMesh);
    }
    meshes.crystals.position.set(0, -3, 0);
    group.add(meshes.crystals);

    parts.push({
        name: "Hydroxyapatite Crystals",
        description: "Hardened mineral deposits of calcium and phosphate.",
        material: "glowing cyan-crystal",
        function: "Mineralizes the osteoid matrix to provide compressive strength to the bone.",
        assemblyOrder: 6,
        connections: ["Osteoid Scaffold"],
        failureEffect: "Bones remain soft and bend under weight.",
        cascadeFailures: ["Structural collapse of the skeletal system"],
        originalPosition: {x: 0, y: -3, z: 0},
        explodedPosition: {x: 0, y: -6, z: 12}
    });

    // 7. Mechanical 3D Printer Arms (Extruding matrix)
    meshes.arms = [];
    for(let i=0; i<4; i++) {
        const armGroup = new THREE.Group();
        
        const baseGeo = new THREE.CylinderGeometry(0.2, 0.4, 4);
        const baseMesh = new THREE.Mesh(baseGeo, steel);
        baseMesh.position.y = -2;
        armGroup.add(baseMesh);

        const tipGeo = new THREE.ConeGeometry(0.3, 1.5);
        const tipMesh = new THREE.Mesh(tipGeo, glowCyan);
        tipMesh.position.y = -4.5;
        armGroup.add(tipMesh);

        armGroup.position.set(
            Math.cos((i/4)*Math.PI*2) * 3.5,
            1,
            Math.sin((i/4)*Math.PI*2) * 3.5
        );
        armGroup.rotation.x = Math.PI/6 * Math.cos((i/4)*Math.PI*2);
        armGroup.rotation.z = -Math.PI/6 * Math.sin((i/4)*Math.PI*2);
        
        bodyMesh.add(armGroup);
        meshes.arms.push({ group: armGroup, phase: i });
    }

    parts.push({
        name: "Matrix Extrusion Appendages",
        description: "Specialized mechanical pseudopodia that actively assemble the collagen matrix.",
        material: "steel and cyan emitter",
        function: "Directs the precise spatial arrangement of collagen fibers for optimal structural integrity.",
        assemblyOrder: 7,
        connections: ["Cell Membrane", "Osteoid Scaffold"],
        failureEffect: "Disorganized, woven bone formation instead of strong lamellar bone.",
        cascadeFailures: ["Mechanical instability at micro-level"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 10, z: -10}
    });

    const description = "A highly advanced biological machine: the Cyber-Osteoblast. It acts as a specialized 3D-printing factory that secretes a collagen-based organic scaffold (osteoid) and subsequently hardens it by deploying calcium-phosphate mineral crystals (hydroxyapatite). This process is the foundation of continuous bone modeling and remodeling.";

    const quizQuestions = [
        {
            question: "What is the primary organic component synthesized and extruded by the osteoblast?",
            options: ["Calcium Carbonate", "Type I Collagen", "Keratin", "Myosin"],
            correct: 1,
            explanation: "Osteoblasts synthesize and secrete Type I collagen, which forms the flexible osteoid matrix before it is mineralized.",
            difficulty: "Medium"
        },
        {
            question: "What process turns the soft osteoid into rigid bone?",
            options: ["Ossification via Hydroxyapatite crystallization", "Fermentation", "Cellular Respiration", "Mitosis"],
            correct: 0,
            explanation: "The osteoid is mineralized by the deposition of calcium and phosphate in the form of hydroxyapatite crystals, providing compressive strength.",
            difficulty: "Hard"
        },
        {
            question: "If an osteoblast's secretory vesicles fail to deploy, what is the immediate consequence?",
            options: ["The cell divides uncontrollably", "Bone matrix (osteoid) cannot be secreted into the extracellular space", "The bone dissolves", "Calcium is released into the blood"],
            correct: 1,
            explanation: "Secretory vesicles carry the synthesized matrix proteins to the membrane. If they fail, the matrix is trapped inside the cell and bone formation stops.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the bone if it only contains the osteoid matrix without mineralization?",
            options: ["It shatters like glass", "It becomes overly dense", "It is flexible and rubbery, unable to support weight", "It turns into cartilage"],
            correct: 2,
            explanation: "Without the mineral crystals (calcium phosphate), the collagen-only bone is highly flexible and bends easily, a condition similar to Rickets or Osteomalacia.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Rotate body slowly
        meshesObj.body.rotation.y = time * 0.2 * speed;
        meshesObj.body.position.y = 5 + Math.sin(time * speed) * 0.5;

        // Nucleus pulsing
        meshesObj.nucleus.rotation.x = time * 0.5 * speed;
        meshesObj.nucleus.rotation.z = time * 0.7 * speed;
        meshesObj.nucleus.scale.setScalar(1 + Math.sin(time * speed * 3) * 0.1);

        // ER rotation
        meshesObj.er.rotation.x = time * 0.3 * speed;
        meshesObj.er.rotation.y = time * -0.4 * speed;

        // Vesicles moving outward and returning (delivery cycle)
        meshesObj.vesicles.forEach((v, i) => {
            const t = ((time * speed * 0.5) + v.phase) % 1; // 0 to 1 cycle
            const r = 2 + t * 3; // radius expanding
            v.mesh.position.x = Math.cos(v.angle + time * speed) * r;
            v.mesh.position.z = Math.sin(v.angle + time * speed) * r;
            v.mesh.position.y = -t * 4; // moving downwards towards matrix
            v.mesh.scale.setScalar(Math.max(0, 1 - t)); // shrinking as they deploy
        });

        // Matrix glowing effect
        meshesObj.matrix.material.opacity = 0.5 + Math.sin(time * speed * 2) * 0.2;

        // Crystals twinkling
        meshesObj.crystals.children.forEach((c, i) => {
            c.rotation.x += 0.02 * speed;
            c.rotation.y += 0.03 * speed;
            c.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 4 + i) * 1.5;
        });

        // Arms extruding/printing
        meshesObj.arms.forEach((arm, i) => {
            arm.group.position.y = 1 + Math.sin(time * speed * 4 + arm.phase * Math.PI) * 0.5;
            arm.group.children[1].material.emissiveIntensity = 1 + Math.sin(time * speed * 8) * 2;
        });
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createOsteoblastFormation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
