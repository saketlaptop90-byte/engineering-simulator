import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for the heart
    const muscleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x990000,
        metalness: 0.1,
        roughness: 0.7,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        emissive: 0x220000,
        emissiveIntensity: 0.5
    });

    const electricalGlow = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    const oxygenatedBloodMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
    });

    const deoxygenatedBloodMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x0000ff,
        emissiveIntensity: 0.2
    });

    // 1. Left Ventricle (Thick walled pump)
    const leftVentricleGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const leftVentricle = new THREE.Mesh(leftVentricleGeo, muscleMaterial);
    leftVentricle.position.set(0.5, -0.5, 0);
    leftVentricle.scale.set(1, 1.5, 1);
    leftVentricle.name = "leftVentricle";
    group.add(leftVentricle);
    
    parts.push({
        name: 'Left Ventricle',
        description: 'The main pumping chamber of the heart that sends oxygenated blood to the body.',
        material: 'Muscle',
        function: 'Pumps blood at high pressure through the aorta to the systemic circulation.',
        assemblyOrder: 1,
        connections: ['Left Atrium', 'Aorta'],
        failureEffect: 'Severe drop in systemic blood pressure, heart failure.',
        cascadeFailures: ['Multi-organ failure due to lack of oxygen'],
        originalPosition: { x: 0.5, y: -0.5, z: 0 },
        explodedPosition: { x: 2, y: -2, z: 2 }
    });

    // 2. Right Ventricle (Thinner pump)
    const rightVentricleGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const rightVentricle = new THREE.Mesh(rightVentricleGeo, muscleMaterial);
    rightVentricle.position.set(-1, -0.2, 0.5);
    rightVentricle.scale.set(1, 1.2, 1);
    rightVentricle.name = "rightVentricle";
    group.add(rightVentricle);

    parts.push({
        name: 'Right Ventricle',
        description: 'Pumps deoxygenated blood to the lungs.',
        material: 'Muscle',
        function: 'Pumps blood through the pulmonary artery to the lungs for oxygenation.',
        assemblyOrder: 2,
        connections: ['Right Atrium', 'Pulmonary Artery'],
        failureEffect: 'Blood backs up into systemic circulation, causing edema.',
        cascadeFailures: ['Right-sided heart failure', 'Liver congestion'],
        originalPosition: { x: -1, y: -0.2, z: 0.5 },
        explodedPosition: { x: -3, y: -1, z: 3 }
    });

    // 3. Left Atrium
    const leftAtriumGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const leftAtrium = new THREE.Mesh(leftAtriumGeo, muscleMaterial);
    leftAtrium.position.set(0.8, 1.2, -0.5);
    leftAtrium.name = "leftAtrium";
    group.add(leftAtrium);

    parts.push({
        name: 'Left Atrium',
        description: 'Receives oxygenated blood from the lungs.',
        material: 'Muscle',
        function: 'Acts as a holding chamber for blood returning from the lungs and pumps it into the left ventricle.',
        assemblyOrder: 3,
        connections: ['Pulmonary Veins', 'Left Ventricle'],
        failureEffect: 'Blood backs up into the lungs, causing pulmonary edema.',
        cascadeFailures: ['Shortness of breath', 'Hypoxia'],
        originalPosition: { x: 0.8, y: 1.2, z: -0.5 },
        explodedPosition: { x: 2, y: 3, z: -2 }
    });

    // 4. Right Atrium
    const rightAtriumGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const rightAtrium = new THREE.Mesh(rightAtriumGeo, muscleMaterial);
    rightAtrium.position.set(-0.8, 1.0, 0.2);
    rightAtrium.name = "rightAtrium";
    group.add(rightAtrium);

    parts.push({
        name: 'Right Atrium',
        description: 'Receives deoxygenated blood from the body.',
        material: 'Muscle',
        function: 'Receives blood from the vena cavae and pumps it into the right ventricle.',
        assemblyOrder: 4,
        connections: ['Vena Cava', 'Right Ventricle'],
        failureEffect: 'Decreased cardiac output to the lungs.',
        cascadeFailures: ['Systemic venous congestion'],
        originalPosition: { x: -0.8, y: 1.0, z: 0.2 },
        explodedPosition: { x: -2, y: 3, z: 1 }
    });

    // 5. Aorta
    const aortaGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 100, Math.PI);
    const aorta = new THREE.Mesh(aortaGeo, oxygenatedBloodMaterial);
    aorta.position.set(0, 1.5, 0);
    aorta.rotation.x = Math.PI / 2;
    aorta.rotation.y = Math.PI / 4;
    aorta.name = "aorta";
    group.add(aorta);

    parts.push({
        name: 'Aorta',
        description: 'The main artery that carries blood away from your heart to the rest of your body.',
        material: 'Elastic Tissue',
        function: 'Distributes oxygenated blood to all parts of the body through the systemic circulation.',
        assemblyOrder: 5,
        connections: ['Left Ventricle', 'Systemic Arteries'],
        failureEffect: 'Aortic aneurysm or dissection leading to massive internal bleeding.',
        cascadeFailures: ['Hypovolemic shock', 'Rapid death'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -1 }
    });
    
    // 6. Purkinje Fibers (Electrical system)
    const fibersGeo = new THREE.TorusKnotGeometry(1.2, 0.05, 100, 16);
    const fibers = new THREE.Mesh(fibersGeo, electricalGlow);
    fibers.position.set(0, -0.2, 0);
    fibers.name = "fibers";
    group.add(fibers);
    
    parts.push({
        name: 'Purkinje Fibers',
        description: 'Specialized conducting fibers composed of electrically excitable cells.',
        material: 'Nerve Tissue',
        function: 'Conducts electrical signals rapidly throughout the ventricles, ensuring synchronized contraction.',
        assemblyOrder: 6,
        connections: ['AV Node', 'Ventricular Muscle'],
        failureEffect: 'Arrhythmia or ventricular fibrillation.',
        cascadeFailures: ['Loss of coordinated pumping', 'Cardiac arrest'],
        originalPosition: { x: 0, y: -0.2, z: 0 },
        explodedPosition: { x: 0, y: -0.2, z: -4 }
    });

    const description = "The human heart is an intricate biological pump, consisting of four chambers (two atria and two ventricles) and a complex electrical conduction system. It operates continuously to circulate blood through two distinct circuits: the pulmonary circuit (lungs) and the systemic circuit (rest of the body).";

    const quizQuestions = [
        {
            question: "Which chamber of the heart is responsible for pumping oxygenated blood to the entire body?",
            options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
            correct: 3,
            explanation: "The left ventricle is the thickest and most powerful chamber. It pumps oxygenated blood through the aorta to the systemic circulation.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the Purkinje fibers in the heart's electrical system?",
            options: ["To slow down the electrical signal", "To rapidly conduct electrical signals to the ventricles for synchronized contraction", "To generate the initial electrical impulse", "To prevent backflow of blood"],
            correct: 1,
            explanation: "The Purkinje fibers are specialized conducting cells that spread the electrical impulse rapidly throughout the ventricular walls, ensuring they contract in a coordinated and forceful manner.",
            difficulty: "Medium"
        },
        {
            question: "Failure of the right ventricle primarily leads to which of the following cascading effects?",
            options: ["Pulmonary edema (fluid in lungs)", "Systemic venous congestion (blood backs up in body)", "Immediate aortic dissection", "Lack of oxygenated blood in the left atrium"],
            correct: 1,
            explanation: "The right ventricle pumps blood to the lungs. If it fails, blood backs up into the right atrium and then into the systemic veins, causing swelling (edema) in the body, such as the legs and liver.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes if not passed explicitly as an object
        const la = leftAtrium;
        const ra = rightAtrium;
        const lv = leftVentricle;
        const rv = rightVentricle;
        const ao = aorta;
        const pf = fibers;

        // Simulating a heartbeat (systole and diastole)
        const heartbeatFreq = speed * 2;
        const phase = (time * heartbeatFreq) % (Math.PI * 2);
        
        // Atrial contraction (lub)
        let atrialScale = 1.0;
        if (phase < Math.PI / 2) {
            atrialScale = 1.0 - 0.2 * Math.sin(phase * 2);
        }
        
        // Ventricular contraction (dub)
        let ventricularScale = 1.0;
        if (phase > Math.PI / 2 && phase < Math.PI) {
            ventricularScale = 1.0 - 0.3 * Math.sin((phase - Math.PI / 2) * 2);
        }
        
        // Apply scales
        la.scale.set(atrialScale, atrialScale, atrialScale);
        ra.scale.set(atrialScale, atrialScale, atrialScale);
        
        // Maintain base scale ratios for ventricles while applying contraction
        lv.scale.set(ventricularScale, ventricularScale * 1.5, ventricularScale);
        rv.scale.set(ventricularScale, ventricularScale * 1.2, ventricularScale);
        
        // Aorta pulsing as blood is pushed into it
        ao.scale.set(2.0 - ventricularScale, 2.0 - ventricularScale, 2.0 - ventricularScale);

        // Electrical signal pulsing
        const glowIntensity = 0.5 + 0.5 * Math.sin(time * heartbeatFreq * 2);
        pf.material.opacity = glowIntensity;
        pf.rotation.y = time * 0.5 * speed;
        pf.rotation.x = time * 0.2 * speed;
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
