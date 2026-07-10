import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const vesselWallMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaaaa,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.1,
        side: THREE.DoubleSide
    });

    const rbcOxygenatedMat = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.1
    });

    const rbcDeoxygenatedMat = new THREE.MeshStandardMaterial({
        color: 0x4411ff,
        emissive: 0x2200aa,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.1
    });

    const wbcMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        roughness: 0.8
    });

    const plasmaMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.1,
        transmission: 0.9,
        roughness: 0.1
    });

    // 1. Arteriole (Input)
    const arterioleGeo = new THREE.CylinderGeometry(0.5, 0.4, 2, 32);
    const arteriole = new THREE.Mesh(arterioleGeo, vesselWallMat);
    arteriole.rotation.z = Math.PI / 2;
    arteriole.position.set(-3, 0, 0);
    group.add(arteriole);
    
    parts.push({
        name: 'Arteriole',
        description: 'Small branch of an artery leading into capillaries.',
        material: vesselWallMat,
        function: 'Delivers oxygen-rich blood to the capillary bed under high pressure.',
        assemblyOrder: 1,
        connections: ['Capillary Network'],
        failureEffect: 'Ischemia (lack of blood supply) to the tissue.',
        cascadeFailures: ['Tissue hypoxia', 'Cell death'],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 2. Precapillary Sphincters
    const sphincterGeo = new THREE.TorusGeometry(0.45, 0.1, 16, 32);
    const sphincterMat = new THREE.MeshStandardMaterial({ color: 0xcc5555, roughness: 0.7 });
    
    const sphincter1 = new THREE.Mesh(sphincterGeo, sphincterMat);
    sphincter1.rotation.y = Math.PI / 2;
    sphincter1.position.set(-1.8, 0.8, 0);
    group.add(sphincter1);

    const sphincter2 = new THREE.Mesh(sphincterGeo, sphincterMat);
    sphincter2.rotation.y = Math.PI / 2;
    sphincter2.position.set(-1.8, -0.8, 0);
    group.add(sphincter2);

    parts.push({
        name: 'Precapillary Sphincters',
        description: 'Rings of smooth muscle at the origin of capillaries.',
        material: sphincterMat,
        function: 'Regulates blood flow into the capillary bed based on tissue needs.',
        assemblyOrder: 2,
        connections: ['Arteriole', 'Capillary Network'],
        failureEffect: 'Unregulated blood flow, leading to localized edema or poor perfusion.',
        cascadeFailures: ['Impaired thermoregulation', 'Nutrient imbalance'],
        originalPosition: { x: -1.8, y: 0, z: 0 },
        explodedPosition: { x: -1.8, y: 2, z: 0 }
    });

    // 3. Capillary Network
    const capillaryNetwork = new THREE.Group();
    const capPath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 0.8, 0),
        new THREE.Vector3(-1, 1.2, 0.5),
        new THREE.Vector3(0, 0.8, -0.5),
        new THREE.Vector3(1, 1.0, 0.2),
        new THREE.Vector3(2, 0.6, 0)
    ]);
    const capGeo1 = new THREE.TubeGeometry(capPath1, 64, 0.15, 16, false);
    const cap1 = new THREE.Mesh(capGeo1, vesselWallMat);
    capillaryNetwork.add(cap1);

    const capPath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, -0.8, 0),
        new THREE.Vector3(-1, -1.0, -0.5),
        new THREE.Vector3(0, -0.5, 0.5),
        new THREE.Vector3(1, -0.8, -0.2),
        new THREE.Vector3(2, -0.4, 0)
    ]);
    const capGeo2 = new THREE.TubeGeometry(capPath2, 64, 0.15, 16, false);
    const cap2 = new THREE.Mesh(capGeo2, vesselWallMat);
    capillaryNetwork.add(cap2);

    const capPath3 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1, 1.2, 0.5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, -0.8, -0.2)
    ]);
    const capGeo3 = new THREE.TubeGeometry(capPath3, 64, 0.1, 16, false);
    const cap3 = new THREE.Mesh(capGeo3, vesselWallMat);
    capillaryNetwork.add(cap3);

    group.add(capillaryNetwork);

    parts.push({
        name: 'Capillary Network',
        description: 'Microscopic blood vessels with walls one cell thick.',
        material: vesselWallMat,
        function: 'Site of exchange for gases, nutrients, and waste between blood and tissues.',
        assemblyOrder: 3,
        connections: ['Precapillary Sphincters', 'Venule'],
        failureEffect: 'Failure of gas/nutrient exchange.',
        cascadeFailures: ['Hypoxia', 'Toxic waste buildup'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2 }
    });

    // 4. Venule (Output)
    const venuleGeo = new THREE.CylinderGeometry(0.4, 0.5, 2, 32);
    const venule = new THREE.Mesh(venuleGeo, vesselWallMat);
    venule.rotation.z = Math.PI / 2;
    venule.position.set(3, 0, 0);
    group.add(venule);

    parts.push({
        name: 'Venule',
        description: 'Small blood vessel that collects blood from capillaries.',
        material: vesselWallMat,
        function: 'Transports deoxygenated blood and metabolic waste away from tissues.',
        assemblyOrder: 4,
        connections: ['Capillary Network'],
        failureEffect: 'Blood pooling and accumulation of metabolic waste.',
        cascadeFailures: ['Tissue acidosis', 'Swelling'],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 5. Red Blood Cells (RBCs)
    const rbcGroup = new THREE.Group();
    const rbcGeo = new THREE.TorusGeometry(0.06, 0.03, 16, 32);
    rbcGeo.scale(1, 1, 0.5); // Flatten the torus to resemble a biconcave disc
    
    const rbcData = [];
    const numRBCs = 30;

    for (let i = 0; i < numRBCs; i++) {
        const isOxygenated = Math.random() > 0.5;
        const rbc = new THREE.Mesh(rbcGeo, isOxygenated ? rbcOxygenatedMat : rbcDeoxygenatedMat);
        
        // Distribute along capPath1 and capPath2
        const path = Math.random() > 0.5 ? capPath1 : capPath2;
        const progress = Math.random();
        
        const pos = path.getPointAt(progress);
        rbc.position.copy(pos);
        
        rbc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        
        rbcGroup.add(rbc);
        rbcData.push({ mesh: rbc, path, progress, isOxygenated });
    }
    
    group.add(rbcGroup);

    parts.push({
        name: 'Erythrocytes (Red Blood Cells)',
        description: 'Biconcave cells containing hemoglobin.',
        material: rbcOxygenatedMat,
        function: 'Transports oxygen to tissues and carbon dioxide to lungs. Squeezes single-file through capillaries.',
        assemblyOrder: 5,
        connections: ['Plasma'],
        failureEffect: 'Decreased oxygen carrying capacity (Anemia).',
        cascadeFailures: ['Lethargy', 'Organ failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    const description = "A microscopic simulation of a Capillary Bed, showcasing the transition of oxygenated to deoxygenated blood, precision flow control via precapillary sphincters, and the intricate single-file movement of erythrocytes.";

    const quizQuestions = [
        {
            question: "What is the primary function of precapillary sphincters?",
            options: [
                "To carry oxygen to cells",
                "To regulate blood flow into the capillary bed",
                "To filter waste from the blood",
                "To connect veins to the heart"
            ],
            correct: 1,
            explanation: "Precapillary sphincters are rings of smooth muscle that control how much blood enters a specific capillary bed based on the tissue's immediate needs.",
            difficulty: "Medium"
        },
        {
            question: "Why do red blood cells pass through capillaries single-file?",
            options: [
                "To prevent blood clots",
                "Because capillaries have a very narrow diameter (approx 5-10 micrometers)",
                "To speed up blood flow",
                "To avoid white blood cells"
            ],
            correct: 1,
            explanation: "Capillaries are extremely narrow, often only wide enough to allow a single red blood cell to pass at a time. This maximizes surface area contact for efficient gas exchange.",
            difficulty: "Easy"
        },
        {
            question: "What process drives the exchange of gases and nutrients across the capillary wall?",
            options: [
                "Active transport only",
                "Diffusion and filtration",
                "Osmosis only",
                "Phagocytosis"
            ],
            correct: 1,
            explanation: "Gases like oxygen and carbon dioxide move via diffusion along concentration gradients, while fluid and nutrients/waste are driven by hydrostatic and osmotic pressures (filtration and reabsorption).",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed = 1, meshes) {
        // Animate RBCs moving along the capillary paths
        const timeFactor = time * 0.2 * speed;
        
        rbcData.forEach(data => {
            data.progress += 0.002 * speed;
            if (data.progress > 1) {
                data.progress = 0; // Loop back
            }
            
            const pos = data.path.getPointAt(data.progress);
            data.mesh.position.copy(pos);
            
            // Color shift from oxygenated to deoxygenated as they move right
            if (data.progress > 0.4 && data.progress < 0.6) {
                // Transition zone
                data.mesh.material = rbcDeoxygenatedMat;
            } else if (data.progress <= 0.4) {
                data.mesh.material = rbcOxygenatedMat;
            } else {
                data.mesh.material = rbcDeoxygenatedMat;
            }

            data.mesh.rotation.x += 0.05 * speed;
            data.mesh.rotation.y += 0.02 * speed;
        });

        // Pulsate the arterioles to simulate heartbeat
        const pulse = 1 + Math.sin(timeFactor * 10) * 0.02;
        arteriole.scale.set(pulse, pulse, pulse);
        venule.scale.set(1 + Math.sin(timeFactor * 10 - Math.PI) * 0.01, 1 + Math.sin(timeFactor * 10 - Math.PI) * 0.01, 1);
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
export function createCapillaryBed() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
