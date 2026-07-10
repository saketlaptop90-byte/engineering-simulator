import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Glowing Nucleus Pulposus Material
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff0088,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.3,
        wireframe: true // High-tech vibe
    });

    // Glowing Annulus Fibrosus rings
    const glowingAnnulus = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x008888,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.8
    });

    const endplateMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        emissive: 0x222222,
        roughness: 0.7,
        metalness: 0.5,
        transparent: true,
        opacity: 0.95
    });

    const nerveMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xddaa00,
        emissiveIntensity: 0.8,
        roughness: 0.4,
        metalness: 0.1
    });

    // --- Components ---

    // 1. Superior Endplate
    const endplateGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.4, 64);
    const superiorEndplate = new THREE.Mesh(endplateGeo, endplateMaterial);
    superiorEndplate.position.set(0, 1.2, 0);
    superiorEndplate.name = "Superior Endplate";
    group.add(superiorEndplate);

    parts.push({
        name: "Superior Endplate",
        description: "The top cartilaginous layer attaching the disc to the adjacent vertebra.",
        material: "Cartilage / Bone",
        function: "Distributes compressive loads and provides nutrients to the disc.",
        assemblyOrder: 1,
        connections: ["Annulus Fibrosus", "Nucleus Pulposus"],
        failureEffect: "Endplate fracture, Schmorl's nodes, accelerated disc degeneration.",
        cascadeFailures: ["Loss of disc height", "Herniation"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Inferior Endplate
    const inferiorEndplate = new THREE.Mesh(endplateGeo, endplateMaterial);
    inferiorEndplate.position.set(0, -1.2, 0);
    inferiorEndplate.name = "Inferior Endplate";
    group.add(inferiorEndplate);

    parts.push({
        name: "Inferior Endplate",
        description: "The bottom cartilaginous layer attaching the disc to the adjacent vertebra.",
        material: "Cartilage / Bone",
        function: "Acts as a semi-permeable membrane for nutrient transport.",
        assemblyOrder: 2,
        connections: ["Annulus Fibrosus", "Nucleus Pulposus"],
        failureEffect: "Nutrient starvation of the inner disc.",
        cascadeFailures: ["Cell death in Nucleus Pulposus", "Disc desiccation"],
        originalPosition: { x: 0, y: -1.2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Annulus Fibrosus
    const annulusGroup = new THREE.Group();
    annulusGroup.name = "Annulus Fibrosus";
    
    for (let i = 0; i < 6; i++) {
        const radius = 2.2 + (i * 0.4);
        const tubeRadius = 0.15 + (i * 0.02);
        const ringGeo = new THREE.TubeGeometry(
            new THREE.EllipseCurve(0, 0, radius, radius * 0.85, 0, Math.PI * 2, false, 0),
            64, tubeRadius, 16, true
        );
        const ringMesh = new THREE.Mesh(ringGeo, glowingAnnulus.clone());
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.userData.isRing = true;
        ringMesh.userData.baseEmissive = 0.5 + (i * 0.1);
        annulusGroup.add(ringMesh);
    }
    group.add(annulusGroup);

    parts.push({
        name: "Annulus Fibrosus",
        description: "Concentric lamellae of collagen fibers forming the tough outer ring.",
        material: "Fibrocartilage",
        function: "Contains the nucleus pulposus and resists tensile and torsional forces.",
        assemblyOrder: 3,
        connections: ["Nucleus Pulposus", "Endplates"],
        failureEffect: "Annular tear, allowing nuclear material to herniate.",
        cascadeFailures: ["Nerve root compression", "Sciatica"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 4. Nucleus Pulposus
    const nucleusGeo = new THREE.SphereGeometry(2.0, 32, 32);
    // Scale the geometry itself to make it disc-shaped
    nucleusGeo.scale(1, 0.4, 0.8);
    
    // Core Mesh
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMaterial);
    nucleus.name = "Nucleus Pulposus";
    group.add(nucleus);

    parts.push({
        name: "Nucleus Pulposus",
        description: "The jelly-like core consisting mostly of water and proteoglycans.",
        material: "Hydrated Gel / Proteoglycans",
        function: "Acts as a hydrostatic shock absorber, converting compression into radial tension.",
        assemblyOrder: 4,
        connections: ["Annulus Fibrosus", "Endplates"],
        failureEffect: "Desiccation (loss of water), losing shock absorption capability.",
        cascadeFailures: ["Bulging disc", "Increased load on facet joints"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 5. Nerve Roots
    const nerveGroup = new THREE.Group();
    nerveGroup.name = "Nerve Roots";
    
    const nerveGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const leftNerve = new THREE.Mesh(nerveGeo, nerveMaterial.clone());
    leftNerve.position.set(-3.5, 0, -2.5);
    leftNerve.userData.baseEmissive = 0.8;
    const rightNerve = new THREE.Mesh(nerveGeo, nerveMaterial.clone());
    rightNerve.position.set(3.5, 0, -2.5);
    rightNerve.userData.baseEmissive = 0.8;

    nerveGroup.add(leftNerve);
    nerveGroup.add(rightNerve);
    group.add(nerveGroup);

    parts.push({
        name: "Nerve Roots",
        description: "Spinal nerve roots branching from the spinal cord, situated posterior to the disc.",
        material: "Nervous Tissue",
        function: "Transmit motor and sensory signals.",
        assemblyOrder: 5,
        connections: ["Spinal Cord", "Peripheral Nerves"],
        failureEffect: "Compression leads to radiculopathy.",
        cascadeFailures: ["Pain", "Numbness", "Muscle weakness"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -5 }
    });

    const description = "An ultra high-tech interactive visualization of the Intervertebral Disc. As the spine's primary hydrostatic shock absorber, it converts axial compressive forces into radial tensile strains distributed across its tough collagenous outer rings. The model features dynamic glowing neon components highlighting its biomechanical behavior under load.";

    const quizQuestions = [
        {
            question: "What is the primary mechanical function of the Nucleus Pulposus?",
            options: [
                "To resist extreme torsional twisting",
                "To act as a hydrostatic shock absorber by dispersing axial loads radially",
                "To generate bone marrow cells",
                "To anchor the vertebrae together rigidly"
            ],
            correct: 1,
            explanation: "The high water content of the nucleus pulposus allows it to act as an incompressible fluid, absorbing axial spinal loads and pushing outward against the annulus fibrosus.",
            difficulty: "Medium"
        },
        {
            question: "Which component of the disc is most likely to fail first under excessive repetitive torsion (twisting)?",
            options: [
                "Nucleus Pulposus",
                "Annulus Fibrosus",
                "Vertebral Endplate",
                "Spinal Nerve Root"
            ],
            correct: 1,
            explanation: "The Annulus Fibrosus has collagen fibers angled to resist tension, but excessive torsion places sheer stress on these lamellae, often leading to annular tears.",
            difficulty: "Hard"
        },
        {
            question: "What cascade failure occurs when the Nucleus Pulposus desiccates (loses water) due to age or injury?",
            options: [
                "The annulus fibrosus becomes thicker and stronger",
                "The vertebral endplates detach completely",
                "The disc space narrows, transferring excessive load to the facet joints",
                "The spine fuses into a single bone immediately"
            ],
            correct: 2,
            explanation: "Loss of water reduces the disc's height and shock-absorbing capacity. The load normally borne by the disc is shifted backward to the facet joints, leading to facet arthropathy.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        let supEndplate, infEndplate, annulusGrp, nucGrp, nervesGrp;

        group.traverse((child) => {
            if (child.name === "Superior Endplate") supEndplate = child;
            if (child.name === "Inferior Endplate") infEndplate = child;
            if (child.name === "Annulus Fibrosus") annulusGrp = child;
            if (child.name === "Nucleus Pulposus") nucGrp = child;
            if (child.name === "Nerve Roots") nervesGrp = child;
        });

        // Simulating compression cycles
        const cycle = Math.sin(time * speed * 2.5); // ranges -1 to 1
        const compression = (cycle + 1) / 2; // normalizes to 0 to 1

        if (supEndplate) supEndplate.position.y = 1.2 - (0.25 * compression);
        if (infEndplate) infEndplate.position.y = -1.2 + (0.25 * compression);

        if (annulusGrp) {
            // Annulus expands radially when compressed
            const scaleXZ = 1.0 + (0.08 * compression);
            const scaleY = 1.0 - (0.2 * compression);
            annulusGrp.scale.set(scaleXZ, scaleY, scaleXZ);

            annulusGrp.children.forEach(ring => {
                if (ring.userData.isRing && ring.material) {
                    ring.material.emissiveIntensity = ring.userData.baseEmissive + (0.5 * compression);
                }
            });
        }

        if (nucGrp) {
            // Nucleus squishes
            const scaleXZ = 1.0 + (0.12 * compression);
            const scaleY = 1.0 - (0.25 * compression);
            nucGrp.scale.set(scaleXZ, scaleY, scaleXZ);

            if (nucGrp.material) {
                nucGrp.material.emissiveIntensity = 0.5 + (0.8 * compression);
            }
        }

        if (nervesGrp) {
            // Nerves pulse with energy
            nervesGrp.children.forEach((nerve, index) => {
                if (nerve.material) {
                    const pulse = Math.sin(time * speed * 8 + index) * 0.5 + 0.5;
                    nerve.material.emissiveIntensity = nerve.userData.baseEmissive + pulse * 0.5;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createIntervertebralDisc() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
