export function createPterosaurWing(THREE) {
    const group = new THREE.Group();
    
    const partsData = [
        { id: "humerus", name: "Humerus", description: "The stout upper arm bone connecting the wing to the body." },
        { id: "radius", name: "Radius", description: "One of the two forearm bones, often thinner than the ulna." },
        { id: "ulna", name: "Ulna", description: "The thicker forearm bone, bearing much of the aerodynamic load." },
        { id: "pteroid_bone", name: "Pteroid bone", description: "A unique bone pointing towards the body, supporting the forward membrane (propatagium)." },
        { id: "carpals", name: "Carpals", description: "Wrist bones forming a complex joint that allows folding of the wing." },
        { id: "metacarpals", name: "Metacarpals", description: "Elongated hand bones extending from the wrist to the base of the fingers." },
        { id: "first_three_digits", name: "First three digits", description: "Small, clawed fingers used for climbing or walking." },
        { id: "fourth_elongated_digit", name: "Fourth elongated digit", description: "A massively elongated finger that supports the main wing membrane." },
        { id: "patagium_membrane", name: "Patagium membrane", description: "The tough, flexible skin membrane that forms the aerodynamic surface of the wing." },
        { id: "actinofibrils", name: "Actinofibrils", description: "Stiff structural fibers within the patagium that provide strength and prevent fluttering." }
    ];

    function createPart(id, geometry, material, position, rotation) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        if (rotation) mesh.rotation.set(...rotation);
        
        const data = partsData.find(p => p.id === id);
        mesh.userData = { id: data.id, name: data.name };
        
        group.add(mesh);
        return mesh;
    }

    const boneMaterial = new THREE.MeshStandardMaterial({ color: 0xd6cbb3, roughness: 0.7 });
    const membraneMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6f4e, roughness: 0.9, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const fibrilMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, wireframe: true });

    createPart('humerus', new THREE.CylinderGeometry(0.5, 0.4, 4), boneMaterial, [2, 0, 0], [0, 0, Math.PI / 2]);
    createPart('radius', new THREE.CylinderGeometry(0.2, 0.2, 5), boneMaterial, [6.5, 0.3, 0], [0, 0, Math.PI / 2]);
    createPart('ulna', new THREE.CylinderGeometry(0.3, 0.3, 5), boneMaterial, [6.5, -0.3, 0], [0, 0, Math.PI / 2]);
    createPart('pteroid_bone', new THREE.CylinderGeometry(0.1, 0.05, 2), boneMaterial, [4, 1, 0.5], [0, 0, Math.PI / 4]);
    createPart('carpals', new THREE.SphereGeometry(0.6), boneMaterial, [9, 0, 0]);
    createPart('metacarpals', new THREE.CylinderGeometry(0.25, 0.2, 3), boneMaterial, [10.5, 0, 0], [0, 0, Math.PI / 2]);
    createPart('first_three_digits', new THREE.BoxGeometry(0.5, 1, 0.5), boneMaterial, [12, 0.5, 0.5], [0, 0, Math.PI / 4]);
    createPart('fourth_elongated_digit', new THREE.CylinderGeometry(0.2, 0.05, 12), boneMaterial, [18, 0, 0], [0, 0, Math.PI / 2]);
    createPart('patagium_membrane', new THREE.PlaneGeometry(24, 8), membraneMaterial, [12, -4, 0]);
    createPart('actinofibrils', new THREE.PlaneGeometry(24, 8, 24, 8), fibrilMaterial, [12, -4, 0.05]);

    const animation = {
        update: (time) => {
            // Flapping motion
            group.rotation.z = Math.sin(time * 4) * 0.4;
            group.rotation.x = Math.sin(time * 4 + Math.PI/2) * 0.1;
        }
    };

    const quiz = [
        {
            question: "Which digit was massively elongated to support the main wing membrane in pterosaurs?",
            options: ["First digit", "Second digit", "Third digit", "Fourth digit"],
            correctAnswer: 3,
            explanation: "In pterosaurs, the fourth digit (the 'ring finger') was massively elongated to form the main structural support for the wing membrane."
        },
        {
            question: "What is the primary function of the pteroid bone?",
            options: ["To connect the wing to the body", "To support the forward membrane (propatagium)", "To control the tail", "To attach flight muscles"],
            correctAnswer: 1,
            explanation: "The pteroid bone, unique to pterosaurs, points toward the body from the wrist and supports the propatagium, helping control the leading edge of the wing."
        },
        {
            question: "What are actinofibrils?",
            options: ["Hollow bones in the wing", "Feathers on the trailing edge", "Stiff fibers embedded in the patagium", "Muscles that control the fingers"],
            correctAnswer: 2,
            explanation: "Actinofibrils are stiff, structural fibers within the patagium that provided strength and tension, preventing the membrane from fluttering during flight."
        },
        {
            question: "Which part of the wing connects directly to the pterosaur's body?",
            options: ["Ulna", "Radius", "Carpals", "Humerus"],
            correctAnswer: 3,
            explanation: "The humerus is the upper arm bone that articulates with the shoulder joint, connecting the wing to the rest of the body."
        },
        {
            question: "What did pterosaurs primarily use their first three digits for?",
            options: ["Supporting the main wing membrane", "Walking on the ground and climbing", "Steering during flight", "Catching prey mid-air"],
            correctAnswer: 1,
            explanation: "The first three digits were relatively small, clawed fingers used for walking quadrupedally on the ground or clinging to surfaces."
        },
        {
            question: "What material makes up the aerodynamic surface of the pterosaur wing?",
            options: ["Interlocking feathers", "The patagium membrane", "Overlapping scales", "A bony plate"],
            correctAnswer: 1,
            explanation: "The aerodynamic surface of a pterosaur wing was formed by a tough, flexible skin membrane known as the patagium."
        }
    ];

    return {
        group,
        parts: partsData,
        animation,
        quiz
    };
}
