export function createFossilExcavationSite(THREE) {
    const group = new THREE.Group();
    const parts = [];

    function addPart(id, name, description, geometry, material, position, rotation = [0, 0, 0]) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.userData = { id, name };
        group.add(mesh);
        parts.push({ id, name, description });
        return mesh;
    }

    // 1. Grid lines
    const gridLines = new THREE.Group();
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for(let i=0; i<=10; i++) {
        const hLine = new THREE.Mesh(new THREE.BoxGeometry(10, 0.05, 0.05), gridMaterial);
        hLine.position.set(0, 0.05, i - 5);
        const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 10), gridMaterial);
        vLine.position.set(i - 5, 0.05, 0);
        gridLines.add(hLine);
        gridLines.add(vLine);
    }
    gridLines.userData = { id: 'part_1_grid_lines', name: 'Grid lines' };
    group.add(gridLines);
    parts.push({ id: 'part_1_grid_lines', name: 'Grid lines', description: 'Used to map the exact location and orientation of fossils.' });

    // 2. Excavation pit
    const pitGeom = new THREE.BoxGeometry(12, 1, 12);
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    addPart('part_2_excavation_pit', 'Excavation pit', 'The area of earth removed to access the fossil layer.', pitGeom, pitMat, [0, -0.5, 0]);

    // 3. Exposed femur fossil
    const femurGeom = new THREE.CylinderGeometry(0.2, 0.3, 4, 16);
    const femurMat = new THREE.MeshStandardMaterial({ color: 0xdfd8c8 });
    addPart('part_3_exposed_femur_fossil', 'Exposed femur fossil', 'A large dinosaur leg bone being carefully uncovered.', femurGeom, femurMat, [1, 0.2, 0], [Math.PI/2, 0, Math.PI/6]);

    // 4. Rock matrix
    const rockGeom = new THREE.DodecahedronGeometry(1.5, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x696969 });
    addPart('part_4_rock_matrix', 'Rock matrix', 'The solid rock surrounding and encasing the fossil.', rockGeom, rockMat, [-2, 0.5, -1]);

    // 5. Trowel
    const trowelGeom = new THREE.ConeGeometry(0.15, 0.6, 3);
    const trowelMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    addPart('part_5_trowel', 'Trowel', 'A small hand tool used for carefully scraping away sediment.', trowelGeom, trowelMat, [-1, 0.1, 2], [Math.PI/2, 0, 0]);

    // 6. Brush
    const brushGeom = new THREE.BoxGeometry(0.3, 0.1, 0.8);
    const brushMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    const brushMesh = addPart('part_6_brush', 'Brush', 'Used to sweep away loose dirt and dust from the fossil surface.', brushGeom, brushMat, [1.5, 0.4, 1]);

    // 7. Pickaxe
    const pickGeom = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const pickMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    addPart('part_7_pickaxe', 'Pickaxe', 'A heavy tool for breaking up hard rock layers above the fossil.', pickGeom, pickMat, [3, 0.1, -2], [0, 0, Math.PI/2]);

    // 8. Plaster jacket
    const jacketGeom = new THREE.CapsuleGeometry(0.6, 2, 4, 8);
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    addPart('part_8_plaster_jacket', 'Plaster jacket', 'A protective covering of plaster and burlap applied to fossils for safe transport.', jacketGeom, jacketMat, [-3, 0.5, 3], [Math.PI/2, 0, Math.PI/4]);

    // 9. Field notes
    const notesGeom = new THREE.BoxGeometry(0.8, 0.05, 1.2);
    const notesMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    addPart('part_9_field_notes', 'Field notes', 'A notebook used to record data, sketches, and observations.', notesGeom, notesMat, [2, 0.1, 3], [0, Math.PI/8, 0]);

    // 10. Scale bar
    const scaleGeom = new THREE.BoxGeometry(1, 0.05, 0.1);
    const scaleMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    addPart('part_10_scale_bar', 'Scale bar', 'A reference object placed next to fossils for size comparison in photographs.', scaleGeom, scaleMat, [0.5, 0.1, -1.5]);

    // Animation
    const animation = {
        update(time) {
            brushMesh.position.x = 1.5 + Math.sin(time * 3) * 0.5;
            brushMesh.position.z = 1 + Math.cos(time * 3) * 0.2;
            brushMesh.rotation.y = Math.sin(time * 3) * 0.2;
        }
    };

    // Quiz
    const quiz = [
        {
            question: "What is the primary purpose of a grid system at an excavation site?",
            options: [
                "To keep the site clean",
                "To map the exact location and spatial context of findings",
                "To prevent water from entering the site",
                "To trap small animals"
            ],
            correctAnswer: "To map the exact location and spatial context of findings",
            explanation: "Grid systems allow paleontologists to record the precise coordinates of every fossil, preserving valuable context about how the animal died and was buried."
        },
        {
            question: "Why are fossils often wrapped in a 'plaster jacket'?",
            options: [
                "To make them look white",
                "To dissolve the surrounding rock",
                "To protect fragile bones during transport back to the lab",
                "To measure their exact volume"
            ],
            correctAnswer: "To protect fragile bones during transport back to the lab",
            explanation: "A plaster jacket made of burlap and plaster of Paris hardens around the fossil, protecting it from breaking during transportation."
        },
        {
            question: "Which tool is typically used for delicate work right next to the bone?",
            options: [
                "Pickaxe",
                "Jackhammer",
                "Backhoe",
                "Brush and dental pick"
            ],
            correctAnswer: "Brush and dental pick",
            explanation: "Brushes and small picks are used for fine detail work to remove matrix without scratching or damaging the fossil."
        },
        {
            question: "What does the term 'matrix' refer to in paleontology?",
            options: [
                "A mathematical equation used to date fossils",
                "The rock or sediment that surrounds a fossil",
                "A type of ancient plant",
                "The chemical composition of bone"
            ],
            correctAnswer: "The rock or sediment that surrounds a fossil",
            explanation: "The matrix is the geological material that encased the fossil over millions of years."
        },
        {
            question: "Why is a scale bar placed next to fossils in photographs?",
            options: [
                "To weigh the fossil",
                "To provide a visual reference for the true size of the specimen",
                "To point towards North",
                "To stabilize the camera"
            ],
            correctAnswer: "To provide a visual reference for the true size of the specimen",
            explanation: "A scale bar provides a known measurement so that anyone viewing the photograph can understand the actual size of the fossil."
        },
        {
            question: "What should be done immediately after exposing a new fossil, before moving it?",
            options: [
                "Wash it with water",
                "Document its position, orientation, and context",
                "Paint it with a protective coating",
                "Break it into smaller pieces for easier transport"
            ],
            correctAnswer: "Document its position, orientation, and context",
            explanation: "Detailed documentation (notes, drawings, photographs, GPS data) must be collected before any fossil is moved, as context is lost forever once it is extracted."
        }
    ];

    return { group, parts, animation, quiz };
}
