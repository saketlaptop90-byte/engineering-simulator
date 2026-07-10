import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
        color: 0x8c92ac,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.4
    });
    
    const bloodContactMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.1,
        roughness: 0.1,
        clearcoat: 1.0
    });

    // 1. Titanium Outer Housing (Main Body)
    const housingGeom = new THREE.CylinderGeometry(2, 2, 3, 32);
    const housingMesh = new THREE.Mesh(housingGeom, titaniumMaterial);
    housingMesh.position.set(0, 0, 0);
    housingMesh.rotation.z = Math.PI / 2;
    group.add(housingMesh);
    parts.push({
        name: 'Titanium Housing',
        mesh: housingMesh,
        description: 'Biocompatible titanium outer casing that protects internal components and interfaces with the body.',
        material: 'Titanium Alloy',
        function: 'Houses internal components, provides hermetic seal against bodily fluids, and resists corrosion.',
        assemblyOrder: 1,
        connections: ['Inflow Cannula', 'Outflow Graft', 'Stator Housing'],
        failureEffect: 'Loss of hermetic seal leading to short circuit and pump failure.',
        cascadeFailures: ['Electromagnetic Stator', 'Controller'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Magnetically Levitated Impeller
    const impellerGeom = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 16);
    const impellerMesh = new THREE.Mesh(impellerGeom, glowCoreMaterial);
    impellerMesh.position.set(0, 0, 0);
    impellerMesh.rotation.z = Math.PI / 2;
    group.add(impellerMesh);
    parts.push({
        name: 'MagLev Impeller',
        mesh: impellerMesh,
        description: 'Centrifugal impeller suspended entirely by magnetic fields, preventing friction and minimizing blood damage (hemolysis).',
        material: 'Polycarbonate with Embedded Magnets',
        function: 'Spins rapidly to pump blood continuously from the heart to the aorta.',
        assemblyOrder: 3,
        connections: ['Titanium Housing', 'Electromagnetic Stator'],
        failureEffect: 'Pump stoppage leading to immediate loss of cardiac support.',
        cascadeFailures: ['Patient Hemodynamics'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 3. Electromagnetic Stator
    const statorGeom = new THREE.TorusGeometry(1.8, 0.4, 16, 32);
    const statorMesh = new THREE.Mesh(statorGeom, coilMaterial);
    statorMesh.position.set(0, 0, 0);
    statorMesh.rotation.y = Math.PI / 2;
    group.add(statorMesh);
    parts.push({
        name: 'Electromagnetic Stator',
        mesh: statorMesh,
        description: 'Coils that generate rotating magnetic fields to both levitate and spin the impeller without physical bearings.',
        material: 'Copper Coils & Silicon Steel',
        function: 'Provides motive force and levitation control.',
        assemblyOrder: 2,
        connections: ['Titanium Housing', 'Driveline Cable'],
        failureEffect: 'Loss of levitation or rotation, causing the impeller to crash and halt.',
        cascadeFailures: ['MagLev Impeller'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 4. Inflow Cannula
    const inflowGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const inflowMesh = new THREE.Mesh(inflowGeom, titaniumMaterial);
    inflowMesh.position.set(0, 2.5, 0);
    group.add(inflowMesh);
    parts.push({
        name: 'Inflow Cannula',
        mesh: inflowMesh,
        description: 'Tube surgically inserted into the apex of the left ventricle to draw blood into the pump.',
        material: 'Textured Sintered Titanium',
        function: 'Provides a secure path for blood to enter the pump housing.',
        assemblyOrder: 4,
        connections: ['Titanium Housing', 'Left Ventricle'],
        failureEffect: 'Thrombosis (clotting) or suction event (ventricular collapse).',
        cascadeFailures: ['MagLev Impeller'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Outflow Graft
    const outflowGeom = new THREE.TorusGeometry(1, 0.5, 16, 32, Math.PI);
    const outflowMesh = new THREE.Mesh(outflowGeom, rubber);
    outflowMesh.position.set(2, 0, 0);
    outflowMesh.rotation.z = -Math.PI / 2;
    group.add(outflowMesh);
    parts.push({
        name: 'Outflow Graft',
        mesh: outflowMesh,
        description: 'Flexible woven graft that directs pressurized blood from the pump to the ascending aorta.',
        material: 'Dacron (Polyester)',
        function: 'Returns pumped blood to systemic circulation.',
        assemblyOrder: 5,
        connections: ['Titanium Housing', 'Aorta'],
        failureEffect: 'Kinking or twisting, drastically reducing blood flow.',
        cascadeFailures: ['MagLev Impeller (due to back-pressure)'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    // 6. Percutaneous Driveline
    const drivelineGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const drivelineMesh = new THREE.Mesh(drivelineGeom, rubber);
    drivelineMesh.position.set(-1.5, -2, 0);
    drivelineMesh.rotation.z = Math.PI / 4;
    group.add(drivelineMesh);
    parts.push({
        name: 'Driveline Cable',
        mesh: drivelineMesh,
        description: 'Cable exiting the skin that connects the internal pump to the external controller and batteries.',
        material: 'Silicone & Velour',
        function: 'Transmits power and telemetry data.',
        assemblyOrder: 6,
        connections: ['Electromagnetic Stator', 'External Controller'],
        failureEffect: 'Driveline infection or wire fracture, leading to power loss.',
        cascadeFailures: ['Electromagnetic Stator', 'MagLev Impeller'],
        originalPosition: { x: -1.5, y: -2, z: 0 },
        explodedPosition: { x: -6, y: -6, z: 0 }
    });

    const description = "The Continuous-Flow Left Ventricular Assist Device (LVAD) is a high-tech medical pump implanted in patients with severe heart failure. Utilizing magnetic levitation, the impeller spins without physical bearings, pumping blood with extreme reliability and minimal damage to red blood cells.";

    const quizQuestions = [
        {
            question: "Why is the impeller magnetically levitated instead of using mechanical bearings?",
            options: [
                "To reduce the weight of the device",
                "To prevent mechanical wear and reduce damage to blood cells",
                "To make the device completely silent",
                "To allow it to run without a power source"
            ],
            correct: 1,
            explanation: "Mechanical bearings cause friction which can damage delicate red blood cells (hemolysis) and cause clotting (thrombosis). Magnetic levitation eliminates this contact.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Outflow Graft?",
            options: [
                "To draw blood from the left ventricle",
                "To supply electrical power to the motor",
                "To direct pressurized blood from the pump to the aorta",
                "To cool the electromagnetic stator"
            ],
            correct: 2,
            explanation: "The outflow graft is surgically attached to the aorta to return the oxygenated, pressurized blood back into the body's systemic circulation.",
            difficulty: "Easy"
        },
        {
            question: "What material is typically used for the outer housing of a VAD and why?",
            options: [
                "Plastic, because it is lightweight",
                "Stainless Steel, because it is cheap",
                "Titanium, because it is highly biocompatible and corrosion-resistant",
                "Copper, because of its electrical properties"
            ],
            correct: 2,
            explanation: "Titanium is extremely well tolerated by the human body, does not corrode in bodily fluids, and provides a strong, hermetically sealed casing.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by part name
        const impeller = meshes['MagLev Impeller'];
        const stator = meshes['Electromagnetic Stator'];

        if (impeller) {
            // Impeller spins very rapidly (continuous flow)
            impeller.rotation.x += 0.2 * speed;
            // Slight levitation pulsing effect
            impeller.position.y = Math.sin(time * 0.01) * 0.05;
        }

        if (stator) {
            // Pulse the emission color intensity to simulate electromagnetic fields
            stator.material.emissiveIntensity = 0.5 + Math.sin(time * 0.02) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHeartPump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
