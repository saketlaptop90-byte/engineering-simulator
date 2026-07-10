import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.1,
        wireframe: true,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2
    });

    const rbcMaterial = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x440000,
        emissiveIntensity: 0.5
    });

    const wasteMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ff00,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x44aa00,
        emissiveIntensity: 0.8
    });

    // 1. Outer Cartridge Casing (Main body)
    const casingGeo = new THREE.CylinderGeometry(3, 3, 12, 32);
    const casing = new THREE.Mesh(casingGeo, glass);
    casing.rotation.z = Math.PI / 2;
    group.add(casing);
    parts.push({
        name: 'Polycarbonate Casing',
        description: 'Clear, rigid outer shell that houses the hollow fiber membranes and directs the flow of dialysate fluid.',
        material: glass,
        function: 'Structural containment and fluid routing.',
        assemblyOrder: 5,
        connections: ['Dialysate Inlet', 'Dialysate Outlet', 'End Caps'],
        failureEffect: 'Dialysate leak, loss of pressure, contamination.',
        cascadeFailures: ['Ineffective dialysis', 'Patient infection risk'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: casing
    });

    // 2. End Caps (Blood Inlet/Outlet)
    const capGeo = new THREE.CylinderGeometry(3.2, 2.5, 2, 32);
    const leftCap = new THREE.Mesh(capGeo, plastic);
    leftCap.position.set(-7, 0, 0);
    leftCap.rotation.z = Math.PI / 2;
    group.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, plastic);
    rightCap.position.set(7, 0, 0);
    rightCap.rotation.z = -Math.PI / 2;
    group.add(rightCap);

    parts.push({
        name: 'Blood Port End Caps',
        description: 'Polyurethane potted ends that distribute blood into the hollow fibers.',
        material: plastic,
        function: 'Connects blood lines to the membrane fibers, sealing off dialysate compartment.',
        assemblyOrder: 4,
        connections: ['Polycarbonate Casing', 'Hollow Fibers'],
        failureEffect: 'Blood leak, mixing of blood and dialysate.',
        cascadeFailures: ['Hemolysis', 'Massive blood loss'],
        originalPosition: { x: -7, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 },
        mesh: leftCap
    });
    
    // 3. Hollow Fiber Bundle (Represented as a core cylinder)
    const bundleGeo = new THREE.CylinderGeometry(2.5, 2.5, 11.8, 32);
    const bundleMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        wireframe: true // Visual representation of thousands of fibers
    });
    const bundle = new THREE.Mesh(bundleGeo, bundleMaterial);
    bundle.rotation.z = Math.PI / 2;
    group.add(bundle);
    parts.push({
        name: 'Hollow Fiber Bundle',
        description: 'Thousands of semi-permeable capillary tubes.',
        material: bundleMaterial,
        function: 'Provides massive surface area for diffusion of solutes between blood and dialysate.',
        assemblyOrder: 1,
        connections: ['Blood Port End Caps'],
        failureEffect: 'Clotting, fiber rupture.',
        cascadeFailures: ['Blood/dialysate mixing', 'Decreased clearance rate'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: bundle
    });

    // 4. Zoomed-In Cross Section: Membrane Wall
    const membraneGeo = new THREE.PlaneGeometry(8, 6, 20, 20);
    const membranePlane = new THREE.Mesh(membraneGeo, membraneMaterial);
    membranePlane.position.set(0, 0, 5); // Pull forward to be visible
    group.add(membranePlane);
    parts.push({
        name: 'Semi-Permeable Membrane (Zoomed)',
        description: 'Microscopic view of the synthetic polymer membrane separating blood and dialysate.',
        material: membraneMaterial,
        function: 'Allows passage of water and uremic toxins while retaining blood cells and large proteins.',
        assemblyOrder: 2,
        connections: [],
        failureEffect: 'Pore clogging (fouling) or tearing.',
        cascadeFailures: ['Protein loss', 'Toxin buildup in patient'],
        originalPosition: { x: 0, y: 0, z: 5 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: membranePlane
    });

    // 5. Red Blood Cells (RBCs)
    const rbcMeshes = [];
    const rbcGeometry = new THREE.TorusGeometry(0.3, 0.15, 16, 32);
    for (let i = 0; i < 15; i++) {
        const rbc = new THREE.Mesh(rbcGeometry, rbcMaterial);
        // Position them behind the membrane (blood side)
        rbc.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, 4.5 - Math.random());
        rbc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        // Store custom properties for animation
        rbc.userData = {
            speedX: 2 + Math.random() * 2,
            rotSpeed: Math.random() * 0.05,
            startY: rbc.position.y,
            offset: Math.random() * Math.PI * 2
        };
        group.add(rbc);
        rbcMeshes.push(rbc);
    }
    parts.push({
        name: 'Erythrocytes (Red Blood Cells)',
        description: 'Crucial blood components that must be retained in the blood compartment.',
        material: rbcMaterial,
        function: 'Carry oxygen; too large to pass through membrane pores.',
        assemblyOrder: 3,
        connections: [],
        failureEffect: 'Hemolysis (destruction) due to shear stress.',
        cascadeFailures: ['Anemia', 'Hyperkalemia'],
        originalPosition: { x: 0, y: 0, z: 4.5 },
        explodedPosition: { x: 0, y: 0, z: 4.5 },
        mesh: rbcMeshes[0]
    });

    // 6. Waste Particles (Urea, Creatinine)
    const wasteMeshes = [];
    const wasteGeometry = new THREE.DodecahedronGeometry(0.1);
    for (let i = 0; i < 30; i++) {
        const waste = new THREE.Mesh(wasteGeometry, wasteMaterial);
        // Start on blood side, will animate moving through membrane
        waste.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, 4.5 - Math.random() * 0.5);
        waste.userData = {
            speedZ: 0.5 + Math.random(),
            speedX: 1 + Math.random(),
            phase: Math.random() * Math.PI * 2
        };
        group.add(waste);
        wasteMeshes.push(waste);
    }
    parts.push({
        name: 'Uremic Toxins',
        description: 'Small molecular weight waste products (e.g., urea, creatinine).',
        material: wasteMaterial,
        function: 'Diffuse down concentration gradient from blood to dialysate.',
        assemblyOrder: 6,
        connections: [],
        failureEffect: 'Incomplete clearance.',
        cascadeFailures: ['Uremia', 'Neurological symptoms'],
        originalPosition: { x: 0, y: 0, z: 5 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: wasteMeshes[0]
    });

    const description = "The biomedical dialysis membrane cartridge, or artificial kidney, is a highly engineered medical device. It utilizes thousands of semi-permeable hollow fibers to filter waste products and excess water from a patient's blood while retaining vital proteins and cellular components. Operating on principles of diffusion, osmosis, and ultrafiltration, counter-current flow between blood and dialysate maximizes the concentration gradient, optimizing clearance efficiency.";

    const quizQuestions = [
        {
            question: "What is the primary driving force for the removal of small molecular weight uremic toxins (like urea) across the dialysis membrane?",
            options: [
                "Active transport by membrane pumps",
                "Diffusion down a concentration gradient",
                "Convection via transmembrane pressure",
                "Phagocytosis by the membrane material"
            ],
            correct: 1,
            explanation: "Small molecules like urea and creatinine move primarily via diffusion, from the higher concentration in the blood to the lower concentration in the dialysate.",
            difficulty: "Medium"
        },
        {
            question: "Why do blood and dialysate flow in opposite directions (counter-current flow) within the cartridge?",
            options: [
                "To prevent the membrane fibers from collapsing",
                "To maintain a maximized concentration gradient along the entire length of the filter",
                "To reduce the shear stress on red blood cells",
                "To ensure the dialysate stays warm"
            ],
            correct: 1,
            explanation: "Counter-current flow ensures that as blood travels and loses toxins, it encounters progressively cleaner dialysate, maintaining a steep concentration gradient and maximizing diffusion efficiency.",
            difficulty: "Hard"
        },
        {
            question: "Which blood component is specifically meant to be PREVENTED from passing through the semi-permeable membrane?",
            options: [
                "Potassium ions",
                "Urea",
                "Water molecules",
                "Red Blood Cells and Albumin"
            ],
            correct: 3,
            explanation: "The membrane pores are sized to allow small waste molecules and water to pass through, but are too small to allow large proteins like albumin or cellular components like red blood cells to escape.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        if (membranePlane) {
            membranePlane.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
        }

        rbcMeshes.forEach(rbc => {
            rbc.position.x += rbc.userData.speedX * speed * 0.05;
            rbc.position.y = rbc.userData.startY + Math.sin(time * 3 + rbc.userData.offset) * 0.2;
            rbc.rotation.x += rbc.userData.rotSpeed;
            rbc.rotation.y += rbc.userData.rotSpeed;

            if (rbc.position.x > 4) {
                rbc.position.x = -4;
            }
        });

        wasteMeshes.forEach(waste => {
            waste.position.x += waste.userData.speedX * speed * 0.02;
            waste.position.z += waste.userData.speedZ * speed * 0.01;
            waste.position.y += Math.sin(time * 5 + waste.userData.phase) * 0.01;

            if (waste.position.z > 6 || waste.position.x > 4) {
                waste.position.x = -4;
                waste.position.z = 4.5 - Math.random() * 0.5;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDialysisMembraneCartridge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
