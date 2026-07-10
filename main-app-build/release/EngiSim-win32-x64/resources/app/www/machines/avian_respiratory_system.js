import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Glowing materials for air flow representation
    const blueNeon = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    const redNeon = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    const membraneMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcccc,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.2
    });

    // 1. Trachea
    const tracheaGeom = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
    const tracheaMesh = new THREE.Mesh(tracheaGeom, plastic);
    tracheaMesh.position.set(0, 8, 0);
    group.add(tracheaMesh);
    parts.push({
        name: "Trachea",
        description: "The main airway conducting air from the mouth to the syrinx.",
        material: "plastic",
        function: "Conducts inhaled and exhaled air.",
        assemblyOrder: 1,
        connections: ["Primary Bronchi"],
        failureEffect: "Suffocation due to airway blockage.",
        cascadeFailures: ["Entire respiratory system failure"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0}
    });

    // 2. Syrinx (voice box)
    const syrinxGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const syrinxMesh = new THREE.Mesh(syrinxGeom, rubber);
    syrinxMesh.position.set(0, 5.2, 0);
    group.add(syrinxMesh);
    parts.push({
        name: "Syrinx",
        description: "The vocal organ of birds, located at the base of the trachea.",
        material: "rubber",
        function: "Produces sound.",
        assemblyOrder: 2,
        connections: ["Trachea", "Primary Bronchi"],
        failureEffect: "Loss of vocalization.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 5.2, z: 0},
        explodedPosition: {x: 0, y: 9, z: 3}
    });

    // 3. Primary Bronchi (left & right)
    const bronchusGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const rightBronchus = new THREE.Mesh(bronchusGeom, plastic);
    rightBronchus.position.set(1, 3.5, 0);
    rightBronchus.rotation.z = -Math.PI / 6;
    const leftBronchus = new THREE.Mesh(bronchusGeom, plastic);
    leftBronchus.position.set(-1, 3.5, 0);
    leftBronchus.rotation.z = Math.PI / 6;
    group.add(rightBronchus);
    group.add(leftBronchus);
    parts.push({
        name: "Primary Bronchi",
        description: "Tubes that branch from the syrinx, leading air into the posterior air sacs and lungs.",
        material: "plastic",
        function: "Airflow distribution to lungs and air sacs.",
        assemblyOrder: 3,
        connections: ["Syrinx", "Posterior Air Sacs", "Lungs"],
        failureEffect: "Impaired air distribution.",
        cascadeFailures: ["Posterior Air Sacs", "Lungs"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 6, z: -3}
    });

    // 4. Posterior Air Sacs
    const postSacGeom = new THREE.SphereGeometry(2, 32, 32);
    const rightPostSac = new THREE.Mesh(postSacGeom, membraneMaterial);
    rightPostSac.position.set(2.5, 0, -1);
    rightPostSac.scale.set(1, 1.5, 1);
    const leftPostSac = new THREE.Mesh(postSacGeom, membraneMaterial);
    leftPostSac.position.set(-2.5, 0, -1);
    leftPostSac.scale.set(1, 1.5, 1);
    group.add(rightPostSac);
    group.add(leftPostSac);
    parts.push({
        name: "Posterior Air Sacs",
        description: "Act as bellows receiving fresh, oxygenated air during inhalation.",
        material: "membraneMaterial",
        function: "Store fresh air and push it to the lungs during exhalation.",
        assemblyOrder: 4,
        connections: ["Primary Bronchi", "Parabronchial Lungs"],
        failureEffect: "Inability to hold oxygenated reserve.",
        cascadeFailures: ["Reduced gas exchange efficiency"],
        originalPosition: {x: 0, y: 0, z: -1},
        explodedPosition: {x: 0, y: 0, z: -6}
    });

    // 5. Parabronchial Lungs
    const lungGeom = new THREE.BoxGeometry(2.5, 3, 2);
    const rightLung = new THREE.Mesh(lungGeom, blueNeon);
    rightLung.position.set(2, 3, 1);
    const leftLung = new THREE.Mesh(lungGeom, blueNeon);
    leftLung.position.set(-2, 3, 1);
    group.add(rightLung);
    group.add(leftLung);
    parts.push({
        name: "Parabronchial Lungs",
        description: "Rigid structures composed of parabronchi where continuous gas exchange occurs.",
        material: "blueNeon",
        function: "Gas exchange (oxygen absorption, carbon dioxide release).",
        assemblyOrder: 5,
        connections: ["Posterior Air Sacs", "Anterior Air Sacs"],
        failureEffect: "Hypoxia and immediate death.",
        cascadeFailures: ["Systemic oxygen deprivation"],
        originalPosition: {x: 0, y: 3, z: 1},
        explodedPosition: {x: 0, y: 3, z: 6}
    });

    // 6. Anterior Air Sacs
    const antSacGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const rightAntSac = new THREE.Mesh(antSacGeom, membraneMaterial);
    rightAntSac.position.set(1.5, 6, 1.5);
    rightAntSac.scale.set(1, 1.2, 1);
    const leftAntSac = new THREE.Mesh(antSacGeom, membraneMaterial);
    leftAntSac.position.set(-1.5, 6, 1.5);
    leftAntSac.scale.set(1, 1.2, 1);
    group.add(rightAntSac);
    group.add(leftAntSac);
    parts.push({
        name: "Anterior Air Sacs",
        description: "Act as bellows receiving deoxygenated air from the lungs.",
        material: "membraneMaterial",
        function: "Receive stale air from the lungs and push it out through the trachea during exhalation.",
        assemblyOrder: 6,
        connections: ["Parabronchial Lungs", "Primary Bronchi"],
        failureEffect: "Inability to expel CO2-rich air.",
        cascadeFailures: ["CO2 poisoning"],
        originalPosition: {x: 0, y: 6, z: 1.5},
        explodedPosition: {x: 0, y: 6, z: 8}
    });

    const meshes = {
        rightPostSac,
        leftPostSac,
        rightAntSac,
        leftAntSac,
        rightLung,
        leftLung,
        blueNeon,
        redNeon
    };

    const description = "The Avian Respiratory System is a highly efficient, continuous unidirectional airflow system. It utilizes rigid lungs for gas exchange and flexible air sacs as bellows, allowing birds to extract oxygen during both inhalation and exhalation. This high-tech biological engineering marvel sustains the intense metabolic demands of flight.";

    const quizQuestions = [
        {
            question: "What is the primary function of the air sacs in the avian respiratory system?",
            options: ["Gas exchange", "Acting as bellows to move air continuously", "Vocalization", "Digestion"],
            correct: 1,
            explanation: "Air sacs do not participate in gas exchange; they act as bellows to maintain a continuous, unidirectional flow of air through the rigid lungs.",
            difficulty: "Medium"
        },
        {
            question: "Which structures inside the avian lungs are the actual sites of gas exchange?",
            options: ["Alveoli", "Bronchioles", "Parabronchi", "Trachea"],
            correct: 2,
            explanation: "Avian lungs contain millions of tiny, parallel tubes called parabronchi where continuous gas exchange occurs.",
            difficulty: "Hard"
        },
        {
            question: "How does the airflow pattern in birds differ from mammals?",
            options: ["It is bidirectional (tidal)", "It is continuous and unidirectional", "They do not breathe air", "Air moves randomly"],
            correct: 1,
            explanation: "Unlike mammals that have a bidirectional (tidal) breathing system, birds have a highly efficient continuous and unidirectional airflow through their lungs.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed) {
        const cycle = Math.sin(time * speed);
        
        // Posterior sacs expand on inhalation
        const postSacScale = 1 + (cycle * 0.3);
        meshes.rightPostSac.scale.set(1, 1.5 * postSacScale, 1);
        meshes.leftPostSac.scale.set(1, 1.5 * postSacScale, 1);

        // Anterior sacs also contract/expand based on the cycle
        const antSacScale = 1 + (-cycle * 0.3);
        meshes.rightAntSac.scale.set(1, 1.2 * antSacScale, 1);
        meshes.leftAntSac.scale.set(1, 1.2 * antSacScale, 1);

        // Neon materials pulsate based on airflow
        meshes.blueNeon.emissiveIntensity = 1.0 + (Math.sin(time * speed * 2) * 0.5);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAvianRespiratorySystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
