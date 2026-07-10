import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0044ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const titaniumBloodPump = new THREE.MeshPhysicalMaterial({
        color: 0xe0e0e0,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const bioPolymer = new THREE.MeshPhysicalMaterial({
        color: 0xddddcc,
        roughness: 0.5,
        transmission: 0.9,
        thickness: 0.5
    });

    // Parts definition
    // 1. Right Ventricle (Pumps to lungs)
    const rightVentricleGeo = new THREE.SphereGeometry(2, 32, 32);
    rightVentricleGeo.scale(1, 1.2, 0.8);
    const rightVentricle = new THREE.Mesh(rightVentricleGeo, titaniumBloodPump);
    rightVentricle.position.set(-2, 0, 0);
    group.add(rightVentricle);
    
    parts.push({
        name: 'Right Artificial Ventricle',
        description: 'Titanium-machined chamber responsible for pumping deoxygenated blood to the lungs.',
        material: 'TitaniumBloodPump',
        function: 'Receives blood from right atrium and pumps to pulmonary artery.',
        assemblyOrder: 1,
        connections: ['Right Inflow Valve', 'Pulmonary Outflow Valve'],
        failureEffect: 'Right-sided heart failure; fluid backs up into the body.',
        cascadeFailures: ['Systemic Edema', 'Liver Congestion'],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 2. Left Ventricle (Pumps to body)
    const leftVentricleGeo = new THREE.SphereGeometry(2.2, 32, 32);
    leftVentricleGeo.scale(1, 1.3, 0.9);
    const leftVentricle = new THREE.Mesh(leftVentricleGeo, titaniumBloodPump);
    leftVentricle.position.set(2, 0, 0);
    group.add(leftVentricle);

    parts.push({
        name: 'Left Artificial Ventricle',
        description: 'Titanium-machined chamber responsible for pumping oxygenated blood to the body. Operates at higher pressures.',
        material: 'TitaniumBloodPump',
        function: 'Pumps blood to systemic circulation.',
        assemblyOrder: 2,
        connections: ['Left Inflow Valve', 'Aortic Outflow Valve'],
        failureEffect: 'Cardiogenic shock; inadequate blood flow to major organs.',
        cascadeFailures: ['Renal Failure', 'Brain Hypoxia'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 3. Right Pneumatic Driveline (Blue Neon for Deoxygenated)
    const rightDriveLineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, -2, 0),
            new THREE.Vector3(-2, -5, 2),
            new THREE.Vector3(-1, -8, 2)
        ]), 64, 0.3, 16, false
    );
    const rightDriveLine = new THREE.Mesh(rightDriveLineGeo, neonBlue);
    group.add(rightDriveLine);

    parts.push({
        name: 'Right Pneumatic Driveline',
        description: 'Transmits pneumatic pulses from external driver to right ventricle diaphragm.',
        material: 'NeonBlue',
        function: 'Actuates right ventricle pumping mechanism.',
        assemblyOrder: 3,
        connections: ['Right Ventricle', 'External Driver Console'],
        failureEffect: 'Loss of right ventricular pumping.',
        cascadeFailures: ['Right Ventricle Stagnation', 'Thrombosis'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -4, z: 2 }
    });

    // 4. Left Pneumatic Driveline (Red Neon for Oxygenated side)
    const leftDriveLineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(2, -2, 0),
            new THREE.Vector3(2, -5, 2),
            new THREE.Vector3(1, -8, 2)
        ]), 64, 0.3, 16, false
    );
    const leftDriveLine = new THREE.Mesh(leftDriveLineGeo, neonRed);
    group.add(leftDriveLine);

    parts.push({
        name: 'Left Pneumatic Driveline',
        description: 'Transmits pneumatic pulses from external driver to left ventricle diaphragm.',
        material: 'NeonRed',
        function: 'Actuates left ventricle pumping mechanism.',
        assemblyOrder: 4,
        connections: ['Left Ventricle', 'External Driver Console'],
        failureEffect: 'Loss of left ventricular pumping, sudden collapse.',
        cascadeFailures: ['Left Ventricle Stagnation', 'Systemic Ischemia'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: -4, z: 2 }
    });

    // 5. Artificial Valves (Mechanical Leaflet)
    const valveGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const valveGroup = new THREE.Group();
    const rightInValve = new THREE.Mesh(valveGeo, chrome);
    rightInValve.position.set(-2, 2.5, 0);
    const rightOutValve = new THREE.Mesh(valveGeo, chrome);
    rightOutValve.position.set(-1.5, 2.2, 1);
    rightOutValve.rotation.x = Math.PI / 4;
    
    const leftInValve = new THREE.Mesh(valveGeo, chrome);
    leftInValve.position.set(2, 2.7, 0);
    const leftOutValve = new THREE.Mesh(valveGeo, chrome);
    leftOutValve.position.set(1.5, 2.4, 1);
    leftOutValve.rotation.x = Math.PI / 4;

    valveGroup.add(rightInValve, rightOutValve, leftInValve, leftOutValve);
    group.add(valveGroup);

    parts.push({
        name: 'Mechanical Valves (Pyrolytic Carbon)',
        description: 'Unidirectional valves ensuring blood flows in only one direction through the heart chambers.',
        material: 'Chrome / Carbon',
        function: 'Prevents backflow (regurgitation) during pumping cycles.',
        assemblyOrder: 5,
        connections: ['Ventricles', 'Atrial Grafts', 'Arterial Grafts'],
        failureEffect: 'Blood regurgitation, drastically reduced cardiac output.',
        cascadeFailures: ['Hemolysis', 'Heart Failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    const description = "A high-tech Artificial Heart representing a total artificial cardiovascular replacement. Features titanium ventricles, mechanical carbon valves, and glowing pneumatic drivelines indicating pulse dynamics.";

    const quizQuestions = [
        {
            question: "Why does the Left Artificial Ventricle typically operate at higher pressures than the Right?",
            options: [
                "It pumps thicker blood.",
                "It has to pump blood to the entire systemic circulation (the body), requiring higher resistance to overcome.",
                "It is structurally smaller and compensates with pressure.",
                "It is located lower in the chest cavity."
            ],
            correct: 1,
            explanation: "The left ventricle pumps oxygenated blood throughout the entire body (systemic circulation), which has much higher resistance compared to the pulmonary circulation (lungs) supplied by the right ventricle.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Pyrolytic Carbon Mechanical Valves?",
            options: [
                "To generate electricity for the heart.",
                "To mix oxygen with the blood.",
                "To ensure unidirectional blood flow and prevent backflow (regurgitation).",
                "To act as a pneumatic driver."
            ],
            correct: 2,
            explanation: "Valves in the artificial (and natural) heart ensure blood only travels in one direction, preventing backflow during the pumping cycle.",
            difficulty: "Easy"
        },
        {
            question: "What would be the most immediate consequence of a Left Pneumatic Driveline failure?",
            options: [
                "A gradual decrease in oxygen saturation.",
                "Immediate loss of systemic cardiac output, leading to sudden cardiogenic shock.",
                "Fluid accumulation in the lungs.",
                "Increased pulse rate to compensate."
            ],
            correct: 1,
            explanation: "The left driveline actuates the left ventricle. Without it, blood is not pumped to the body, causing immediate, catastrophic cardiogenic shock.",
            difficulty: "Hard"
        }
    ];

    // Reference to meshes for animation
    const meshes = {
        rightVentricle,
        leftVentricle,
        rightDriveLine,
        leftDriveLine,
        neonRedMaterial: neonRed,
        neonBlueMaterial: neonBlue
    };

    function animate(time, speed, meshesObj) {
        // Heartbeat animation (systole / diastole)
        const bpm = 80;
        const bps = bpm / 60;
        const beatCycle = (time * speed * bps) % 1.0;
        
        // Simulating the "lub-dub" contraction
        let contraction = 1.0;
        if (beatCycle < 0.2) {
            // Systole (contraction)
            contraction = 1.0 - (Math.sin(beatCycle * Math.PI * 5) * 0.15);
        } else if (beatCycle >= 0.2 && beatCycle < 0.3) {
             // Secondary contraction / stabilization
             contraction = 0.85 + (Math.sin((beatCycle - 0.2) * Math.PI * 10) * 0.15);
        } else {
            // Diastole (filling)
            contraction = 1.0;
        }

        if (meshesObj.rightVentricle) {
            meshesObj.rightVentricle.scale.set(contraction, contraction * 1.2, contraction * 0.8);
        }
        if (meshesObj.leftVentricle) {
            meshesObj.leftVentricle.scale.set(contraction, contraction * 1.3, contraction * 0.9);
        }

        // Pulse the neon drivelines
        if (meshesObj.neonRedMaterial) {
            meshesObj.neonRedMaterial.emissiveIntensity = 1.0 + (contraction < 1.0 ? 3.0 : 0.0);
        }
        if (meshesObj.neonBlueMaterial) {
            meshesObj.neonBlueMaterial.emissiveIntensity = 1.0 + (contraction < 1.0 ? 3.0 : 0.0);
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createArtificialHeart() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
