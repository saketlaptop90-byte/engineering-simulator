import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for visual flair
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xaa0000,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        metalness: 0.3,
        roughness: 0.2
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x11ff11,
        emissive: 0x00aa00,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        metalness: 0.3,
        roughness: 0.2
    });

    const bioArmor = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const bioBlade = new THREE.MeshStandardMaterial({
        color: 0xbdc3c7,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 1.0
    });

    const bioSensor = new THREE.MeshStandardMaterial({
        color: 0xf1c40f,
        emissive: 0xd4ac0d,
        emissiveIntensity: 0.5,
        metalness: 0.7,
        roughness: 0.2
    });

    // Central axis length
    const length = 12;
    
    // 1. Labium (Outer Sheath) - Protective gutter that bends back
    const labiumGeo = new THREE.CylinderGeometry(1.0, 1.0, length, 32, 1, false, 0, Math.PI * 1.3);
    const labiumMesh = new THREE.Mesh(labiumGeo, bioArmor);
    labiumMesh.rotation.x = Math.PI / 2; // Align along Z axis
    labiumMesh.position.z = 0;
    
    const labiumGroup = new THREE.Group();
    labiumGroup.add(labiumMesh);
    group.add(labiumGroup);
    
    parts.push({
        name: "Labium (Outer Sheath)",
        description: "A flexible, gutter-like protective sheath for the inner needles (fascicle). It retracts and bows backward when the mosquito pierces the skin.",
        material: "bioArmor",
        function: "Protection and structural guidance.",
        assemblyOrder: 1,
        connections: ["Head", "Sensors"],
        failureEffect: "Inner needles exposed and easily damaged.",
        cascadeFailures: ["Fascicle damage", "Inability to bite"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: labiumMesh,
        group: labiumGroup
    });

    // 2. Labrum (Blood Tube) - Main central needle
    const labrumGeo = new THREE.CylinderGeometry(0.3, 0.15, length + 1, 16);
    const labrumMesh = new THREE.Mesh(labrumGeo, glowingRed);
    labrumMesh.rotation.x = Math.PI / 2;
    labrumMesh.position.set(0, 0.3, 0.5);
    
    // Add sensory tips
    const sensorGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const sensorTip = new THREE.Mesh(sensorGeo, bioSensor);
    sensorTip.position.set(0, (length + 1) / 2, 0);
    labrumMesh.add(sensorTip);

    const labrumGroup = new THREE.Group();
    labrumGroup.add(labrumMesh);
    group.add(labrumGroup);

    parts.push({
        name: "Labrum (Blood Tube)",
        description: "The primary needle that pieces the skin and serves as the main conduit for drawing blood. It is equipped with chemical sensors to find blood vessels.",
        material: "glowingRed",
        function: "Drawing blood.",
        assemblyOrder: 2,
        connections: ["Blood Pump", "Sensors"],
        failureEffect: "Inability to feed on blood.",
        cascadeFailures: ["Starvation", "Reproductive failure"],
        originalPosition: { x: 0, y: 0.3, z: 0.5 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: labrumMesh,
        group: labrumGroup
    });

    // 3. Hypopharynx (Saliva Tube)
    const hypoGeo = new THREE.CylinderGeometry(0.15, 0.08, length + 0.8, 16);
    const hypoMesh = new THREE.Mesh(hypoGeo, glowingGreen);
    hypoMesh.rotation.x = Math.PI / 2;
    hypoMesh.position.set(0, -0.3, 0.4);

    const hypoGroup = new THREE.Group();
    hypoGroup.add(hypoMesh);
    group.add(hypoGroup);

    parts.push({
        name: "Hypopharynx (Saliva Tube)",
        description: "A specialized thin tube that injects saliva containing anticoagulants and anesthetics, preventing blood clotting and numbing the bite.",
        material: "glowingGreen",
        function: "Injecting saliva.",
        assemblyOrder: 3,
        connections: ["Salivary Gland"],
        failureEffect: "Host detects the bite immediately or blood clots prematurely.",
        cascadeFailures: ["Feeding interrupted", "Host counter-attack"],
        originalPosition: { x: 0, y: -0.3, z: 0.4 },
        explodedPosition: { x: 0, y: -3, z: 3 },
        mesh: hypoMesh,
        group: hypoGroup
    });

    // 4. Mandibles (Piercing Blades)
    const mandGroup = new THREE.Group();
    const mandibleGeo = new THREE.CylinderGeometry(0.08, 0.01, length + 0.5, 8);
    mandibleGeo.scale(1, 1, 0.2); // Flatten into a sharp blade
    
    const mandLeft = new THREE.Mesh(mandibleGeo, bioBlade);
    mandLeft.rotation.x = Math.PI / 2;
    mandLeft.position.set(-0.45, 0, 0.25);
    
    const mandRight = new THREE.Mesh(mandibleGeo, bioBlade);
    mandRight.rotation.x = Math.PI / 2;
    mandRight.position.set(0.45, 0, 0.25);

    mandGroup.add(mandLeft, mandRight);
    group.add(mandGroup);

    parts.push({
        name: "Mandibles",
        description: "Two extremely sharp, needle-like structures that initially pierce the host's skin alongside the maxillae.",
        material: "bioBlade",
        function: "Piercing skin.",
        assemblyOrder: 4,
        connections: ["Muscles"],
        failureEffect: "Difficulty piercing tough skin.",
        cascadeFailures: ["Increased feeding time"],
        originalPosition: { x: 0, y: 0, z: 0.25 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        mesh: mandLeft, 
        meshes: [mandLeft, mandRight],
        group: mandGroup
    });

    // 5. Maxillae (Saw-toothed Blades)
    const maxGeo = new THREE.CylinderGeometry(0.12, 0.03, length + 0.6, 16);
    const maxGroup = new THREE.Group();
    
    const maxLeft = new THREE.Mesh(maxGeo, chrome);
    maxLeft.rotation.x = Math.PI / 2;
    maxLeft.position.set(-0.7, -0.15, 0.3);
    
    const maxRight = new THREE.Mesh(maxGeo, chrome);
    maxRight.rotation.x = Math.PI / 2;
    maxRight.position.set(0.7, -0.15, 0.3);
    
    // Add micro saw teeth to maxillae tips
    const toothGeo = new THREE.ConeGeometry(0.06, 0.2, 4);
    toothGeo.rotateX(Math.PI/2);
    for(let i=0; i<20; i++) {
        let toothL = new THREE.Mesh(toothGeo, chrome);
        toothL.position.set(-0.1, (length/2) - (i * 0.15) - 0.5, 0);
        toothL.rotation.z = Math.PI / 4;
        maxLeft.add(toothL);

        let toothR = new THREE.Mesh(toothGeo, chrome);
        toothR.position.set(0.1, (length/2) - (i * 0.15) - 0.5, 0);
        toothR.rotation.z = -Math.PI / 4;
        maxRight.add(toothR);
    }

    maxGroup.add(maxLeft, maxRight);
    group.add(maxGroup);

    parts.push({
        name: "Maxillae (Saw Blades)",
        description: "Two serrated blades that act like reciprocating saws. They cut into the tissue and anchor the proboscis, providing leverage for the other needles to penetrate deeper.",
        material: "chrome",
        function: "Cutting, sawing, and anchoring.",
        assemblyOrder: 5,
        connections: ["Muscles"],
        failureEffect: "Inability to penetrate skin deeply enough.",
        cascadeFailures: ["Feeding impossible"],
        originalPosition: { x: 0, y: -0.15, z: 0.3 },
        explodedPosition: { x: 3, y: 0, z: 0 },
        mesh: maxLeft,
        meshes: [maxLeft, maxRight],
        group: maxGroup
    });

    const description = "The mosquito proboscis is a masterpiece of micro-engineering. Rather than a single needle, it is a complex bundle of six highly specialized stylets (the fascicle) protected by an outer sheath (the labium). Two mandibles pierce the skin, two serrated maxillae saw and anchor, the hypopharynx injects anticoagulant saliva, and the labrum acts as the primary conduit for drawing blood.";

    const quizQuestions = [
        {
            question: "How many distinct needles (stylets) make up the mosquito's piercing fascicle?",
            options: ["1", "2", "4", "6"],
            correct: 3,
            explanation: "The fascicle consists of six distinct needles: two mandibles, two maxillae, one labrum, and one hypopharynx.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for injecting the anticoagulant saliva that numbs the bite area?",
            options: ["Labium", "Labrum", "Hypopharynx", "Maxillae"],
            correct: 2,
            explanation: "The hypopharynx is a specialized thin tube used to pump saliva into the host, preventing blood clotting and numbing the area.",
            difficulty: "Hard"
        },
        {
            question: "What is the mechanical function of the maxillae?",
            options: ["To suck up blood", "To inject saliva", "To act as a protective sheath", "To saw through tissue and anchor the proboscis"],
            correct: 3,
            explanation: "The maxillae are serrated, saw-like blades that reciprocate to cut into tissue and grip the flesh, providing leverage for the other needles to drive deeper.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Retrieve dynamic parts
        const labium = parts.find(p => p.name === "Labium (Outer Sheath)");
        const labrum = parts.find(p => p.name === "Labrum (Blood Tube)");
        const hypo = parts.find(p => p.name === "Hypopharynx (Saliva Tube)");
        const mandibles = parts.find(p => p.name === "Mandibles");
        const maxillae = parts.find(p => p.name === "Maxillae (Saw Blades)");

        // 1. Labium retracts and bows backward during a bite
        if (labium && labium.group) {
            const retractCycle = Math.sin(time * speed);
            const retraction = Math.max(0, retractCycle); // 0 to 1 range
            labium.group.position.z = retraction * -4;
            // Flare out slightly as it bows
            labium.group.scale.x = 1 + retraction * 0.4;
            labium.group.scale.y = 1 + retraction * 0.4;
        }

        // 2. Maxillae reciprocate (sawing motion alternating left and right)
        if (maxillae && maxillae.meshes) {
            const sawCycle = Math.sin(time * speed * 10);
            maxillae.meshes[0].position.z = maxillae.originalPosition.z + sawCycle * 0.3;
            maxillae.meshes[1].position.z = maxillae.originalPosition.z - sawCycle * 0.3;
        }

        // 3. Mandibles pulse laterally
        if (mandibles && mandibles.meshes) {
            const pulse = Math.sin(time * speed * 6) * 0.08;
            mandibles.meshes[0].position.x = mandibles.originalPosition.x - 0.45 - pulse;
            mandibles.meshes[1].position.x = mandibles.originalPosition.x + 0.45 + pulse;
        }

        // 4. Labrum (blood flow optical effect)
        if (labrum && labrum.mesh) {
            const bloodPulse = Math.sin(time * speed * 4) * 0.5 + 0.5;
            labrum.mesh.material.emissiveIntensity = 0.8 + bloodPulse;
        }

        // 5. Hypopharynx (saliva flow optical effect)
        if (hypo && hypo.mesh) {
            const salivaPulse = Math.sin(time * speed * 5 + Math.PI) * 0.5 + 0.5;
            hypo.mesh.material.emissiveIntensity = 0.8 + salivaPulse;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMosquitoProboscis() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
