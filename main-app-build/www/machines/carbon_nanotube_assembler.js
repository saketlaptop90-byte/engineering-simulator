import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.7
    });

    const carbonAtomMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Vacuum Chamber Base
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -0.5, 0);
    group.add(base);
    parts.push({
        name: "Vacuum Chamber Base",
        description: "Provides a stable, isolated environment for atomic assembly.",
        material: "darkSteel",
        function: "Supports the entire structure and houses vacuum pumps.",
        assemblyOrder: 1,
        connections: ["Containment Dome", "Central Pedestal"],
        failureEffect: "Loss of vacuum, contamination of the assembly.",
        cascadeFailures: ["Nanobot Arms", "Carbon Lattice"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Central Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.5, 2, 2, 16);
    const pedestal = new THREE.Mesh(pedestalGeo, steel);
    pedestal.position.set(0, 1, 0);
    group.add(pedestal);
    parts.push({
        name: "Central Pedestal",
        description: "The primary stage where the carbon nanotube is grown.",
        material: "steel",
        function: "Holds the catalyst seed and aligns the nanobot arms.",
        assemblyOrder: 2,
        connections: ["Vacuum Chamber Base", "Catalyst Seed"],
        failureEffect: "Misalignment of the nanotube structure.",
        cascadeFailures: ["Carbon Lattice"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 3. Containment Dome
    const domeGeo = new THREE.SphereGeometry(4.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, tinted);
    dome.position.set(0, 0, 0);
    group.add(dome);
    parts.push({
        name: "Containment Dome",
        description: "High-strength tinted glass dome enclosing the vacuum.",
        material: "tinted",
        function: "Maintains vacuum and shields from external electromagnetic interference.",
        assemblyOrder: 3,
        connections: ["Vacuum Chamber Base"],
        failureEffect: "Implosion or vacuum leak.",
        cascadeFailures: ["Vacuum Chamber Base", "Nanobot Arms"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 4. Carbon Source Injector
    const injectorGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const injector = new THREE.Mesh(injectorGeo, chrome);
    injector.position.set(0, 4, 0);
    group.add(injector);
    parts.push({
        name: "Carbon Source Injector",
        description: "Injects precisely metered carbon feedstock gas.",
        material: "chrome",
        function: "Supplies raw carbon atoms for the assembly process.",
        assemblyOrder: 4,
        connections: ["Containment Dome", "Plasma Field Generator"],
        failureEffect: "Starvation or flooding of carbon atoms.",
        cascadeFailures: ["Carbon Lattice"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 5. Plasma Field Generator
    const plasmaGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
    const plasmaField = new THREE.Mesh(plasmaGeo, plasmaCoreMat);
    plasmaField.position.set(0, 3, 0);
    plasmaField.rotation.x = Math.PI / 2;
    group.add(plasmaField);
    parts.push({
        name: "Plasma Field Generator",
        description: "Generates a localized plasma field to crack feedstock gas.",
        material: "plasmaCoreMat",
        function: "Strips carbon atoms from the feedstock gas, readying them for assembly.",
        assemblyOrder: 5,
        connections: ["Carbon Source Injector"],
        failureEffect: "Failure to break down feedstock gas.",
        cascadeFailures: ["Carbon Lattice"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 6. Nanobot Arms (Array of 3)
    const armGroup = new THREE.Group();
    const armGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
    for (let i = 0; i < 3; i++) {
        const arm = new THREE.Mesh(armGeo, aluminum);
        const angle = (i / 3) * Math.PI * 2;
        arm.position.set(Math.cos(angle) * 2, 2, Math.sin(angle) * 2);
        arm.lookAt(0, 2, 0);
        arm.rotation.x -= Math.PI / 4;
        
        // Add glowing tip
        const tipGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const tip = new THREE.Mesh(tipGeo, neonBlue);
        tip.position.set(0, 1, 0);
        arm.add(tip);

        armGroup.add(arm);
    }
    group.add(armGroup);
    parts.push({
        name: "Manipulator Arms",
        description: "High-precision robotic arms with atomic-force manipulation tips.",
        material: "aluminum",
        function: "Picks and places individual carbon atoms into the hexagonal lattice.",
        assemblyOrder: 6,
        connections: ["Vacuum Chamber Base"],
        failureEffect: "Defects in the carbon nanotube structure.",
        cascadeFailures: ["Carbon Lattice"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 7. Growing Carbon Nanotube (Lattice)
    const latticeGroup = new THREE.Group();
    const atomRadius = 0.08;
    const bondRadius = 0.02;
    const hexRadius = 0.5;
    const heightLayers = 10;
    
    // Create a simplified cylindrical hexagonal lattice
    for (let y = 0; y < heightLayers; y++) {
        const numAtoms = 12;
        for (let i = 0; i < numAtoms; i++) {
            const angle = (i / numAtoms) * Math.PI * 2;
            const x = Math.cos(angle) * hexRadius;
            const z = Math.sin(angle) * hexRadius;
            
            const atom = new THREE.Mesh(new THREE.SphereGeometry(atomRadius, 8, 8), carbonAtomMat);
            atom.position.set(x, y * 0.2 + 1.5, z);
            latticeGroup.add(atom);
        }
    }
    // Add glowing construction ring
    const constructRingGeo = new THREE.TorusGeometry(hexRadius * 1.2, 0.05, 8, 32);
    const constructRing = new THREE.Mesh(constructRingGeo, neonBlue);
    constructRing.position.set(0, 1.5 + (heightLayers * 0.2), 0);
    constructRing.rotation.x = Math.PI / 2;
    latticeGroup.add(constructRing);

    group.add(latticeGroup);
    parts.push({
        name: "Carbon Lattice",
        description: "The growing carbon nanotube structure.",
        material: "carbonAtomMat",
        function: "The final product, forming a perfect sp2 hybridized carbon structure.",
        assemblyOrder: 7,
        connections: ["Central Pedestal", "Manipulator Arms"],
        failureEffect: "Structural collapse or chirality error.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the primary purpose of the Plasma Field Generator?",
            options: [
                "To cool down the central pedestal",
                "To break down carbon feedstock gas into individual atoms",
                "To illuminate the vacuum chamber",
                "To provide power to the nanobot arms"
            ],
            correct: 1,
            explanation: "The plasma field provides the energy needed to 'crack' or break the chemical bonds of the feedstock gas, freeing carbon atoms for assembly.",
            difficulty: "Medium"
        },
        {
            question: "Why must this assembly take place inside a vacuum chamber?",
            options: [
                "To prevent the carbon atoms from floating away",
                "To reduce the noise of the machinery",
                "To prevent contamination from air molecules during atomic assembly",
                "To keep the nanobots from rusting"
            ],
            correct: 2,
            explanation: "At the atomic scale, stray molecules from the air (like oxygen or nitrogen) would bond with the highly reactive free carbon atoms, contaminating the nanotube.",
            difficulty: "Easy"
        },
        {
            question: "What geometric structure do the carbon atoms form in a carbon nanotube?",
            options: [
                "Cubic lattice",
                "Tetrahedral lattice",
                "Hexagonal lattice (rolled graphene sheet)",
                "Octahedral lattice"
            ],
            correct: 2,
            explanation: "Carbon nanotubes are essentially sheets of graphene (a flat hexagonal lattice of carbon atoms) rolled into a seamless cylinder.",
            difficulty: "Hard"
        }
    ];

    const description = "The Carbon Nanotube Assembler is a highly advanced piece of nanotechnology equipment designed to construct carbon nanotubes atom-by-atom. It operates in an ultra-high vacuum environment, using a plasma field to dissociate carbon feedstock gas. Precision manipulator arms then pick and place these free carbon atoms onto a growing hexagonal lattice structure, allowing for complete control over the nanotube's chirality and properties.";

    function animate(time, speed, meshes) {
        // Find meshes by part index or name if needed, or just animate the group's children
        const plasmaField = group.children[4];
        const armGroup = group.children[5];
        const latticeGroup = group.children[6];
        const constructRing = latticeGroup.children[latticeGroup.children.length - 1];

        // Animate Plasma Field
        if (plasmaField) {
            plasmaField.rotation.z = time * 2 * speed;
            plasmaField.scale.setScalar(1 + Math.sin(time * 5 * speed) * 0.1);
        }

        // Animate Arms
        if (armGroup) {
            armGroup.rotation.y = time * 0.5 * speed;
            armGroup.children.forEach((arm, index) => {
                const offset = index * Math.PI * 0.6;
                arm.rotation.z = Math.sin(time * 3 * speed + offset) * 0.2;
            });
        }

        // Animate construction ring moving up and down slightly
        if (constructRing) {
            constructRing.position.y = 1.5 + (10 * 0.2) + Math.sin(time * 4 * speed) * 0.1;
            constructRing.material.opacity = 0.5 + Math.sin(time * 8 * speed) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCarbonNanotubeAssembler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
