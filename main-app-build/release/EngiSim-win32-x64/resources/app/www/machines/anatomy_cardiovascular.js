import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom Materials
    const muscleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaa2222,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        side: THREE.DoubleSide
    });
    
    const glowingOxygenated = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const glowingDeoxygenated = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const valveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.5
    });

    // Meshes
    const heartGeo = new THREE.SphereGeometry(2, 64, 64);
    const heartMesh = new THREE.Mesh(heartGeo, muscleMaterial);
    
    const leftAtriumGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const leftAtriumMesh = new THREE.Mesh(leftAtriumGeo, muscleMaterial);
    leftAtriumMesh.position.set(1.2, 1.5, 0.5);
    
    const rightAtriumGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const rightAtriumMesh = new THREE.Mesh(rightAtriumGeo, muscleMaterial);
    rightAtriumMesh.position.set(-1.2, 1.5, 0.5);
    
    const leftVentricleGeo = new THREE.CylinderGeometry(1.5, 0.5, 2.5, 32);
    const leftVentricleMesh = new THREE.Mesh(leftVentricleGeo, muscleMaterial);
    leftVentricleMesh.position.set(0.8, -1.0, 0);
    leftVentricleMesh.rotation.z = Math.PI / 8;
    
    const rightVentricleGeo = new THREE.CylinderGeometry(1.5, 0.5, 2.5, 32);
    const rightVentricleMesh = new THREE.Mesh(rightVentricleGeo, muscleMaterial);
    rightVentricleMesh.position.set(-0.8, -1.0, 0);
    rightVentricleMesh.rotation.z = -Math.PI / 8;
    
    const aortaGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 64, Math.PI);
    const aortaMesh = new THREE.Mesh(aortaGeo, glowingOxygenated);
    aortaMesh.position.set(0, 2.5, -0.5);
    
    const pulmonaryArteryGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.5, 1.5, 0),
        new THREE.Vector3(-1.0, 2.5, 0),
        new THREE.Vector3(-2.0, 2.0, 0)
    ), 20, 0.3, 8, false);
    const pulmonaryArteryMesh = new THREE.Mesh(pulmonaryArteryGeo, glowingDeoxygenated);
    
    const venaCavaGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const venaCavaMesh = new THREE.Mesh(venaCavaGeo, glowingDeoxygenated);
    venaCavaMesh.position.set(-1.5, 0, -1);
    
    const leftPulmonaryVeinGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const leftPulmonaryVeinMesh = new THREE.Mesh(leftPulmonaryVeinGeo, glowingOxygenated);
    leftPulmonaryVeinMesh.position.set(1.5, 1.5, -1);
    leftPulmonaryVeinMesh.rotation.z = Math.PI / 2;

    heartMesh.add(leftAtriumMesh);
    heartMesh.add(rightAtriumMesh);
    heartMesh.add(leftVentricleMesh);
    heartMesh.add(rightVentricleMesh);
    heartMesh.add(aortaMesh);
    heartMesh.add(pulmonaryArteryMesh);
    heartMesh.add(venaCavaMesh);
    heartMesh.add(leftPulmonaryVeinMesh);
    
    group.add(heartMesh);

    const parts = [
        {
            name: "Heart Muscle (Myocardium)",
            description: "The muscular tissue of the heart responsible for pumping blood throughout the body.",
            material: "Muscle Tissue",
            function: "Contracts rhythmically to pump blood",
            assemblyOrder: 1,
            connections: ["Aorta", "Pulmonary Artery", "Vena Cava"],
            failureEffect: "Heart failure, inability to pump blood effectively",
            cascadeFailures: ["Organ failure", "Hypoxia"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -5 }
        },
        {
            name: "Aorta",
            description: "The main artery that carries oxygen-rich blood from the heart to the rest of the body.",
            material: "Glowing Oxygenated Tissue",
            function: "Distributes oxygenated blood",
            assemblyOrder: 2,
            connections: ["Left Ventricle", "Systemic Arteries"],
            failureEffect: "Severe internal bleeding or impaired blood flow",
            cascadeFailures: ["Systemic hypoxia", "Shock"],
            originalPosition: { x: 0, y: 2.5, z: -0.5 },
            explodedPosition: { x: 0, y: 5, z: 0 }
        },
        {
            name: "Vena Cava",
            description: "The large veins (superior and inferior) that carry deoxygenated blood to the heart.",
            material: "Glowing Deoxygenated Tissue",
            function: "Returns deoxygenated blood to the right atrium",
            assemblyOrder: 3,
            connections: ["Right Atrium", "Systemic Veins"],
            failureEffect: "Reduced venous return, right-sided heart failure",
            cascadeFailures: ["Edema", "Reduced cardiac output"],
            originalPosition: { x: -1.5, y: 0, z: -1 },
            explodedPosition: { x: -4, y: 0, z: 0 }
        },
        {
            name: "Pulmonary Artery",
            description: "Carries deoxygenated blood from the right ventricle to the lungs.",
            material: "Glowing Deoxygenated Tissue",
            function: "Transports blood for oxygenation",
            assemblyOrder: 4,
            connections: ["Right Ventricle", "Lungs"],
            failureEffect: "Pulmonary hypertension",
            cascadeFailures: ["Right ventricular hypertrophy"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -3, y: 3, z: 2 }
        },
        {
            name: "Left Atrium",
            description: "Receives oxygenated blood from the lungs.",
            material: "Muscle Tissue",
            function: "Pumps blood into the left ventricle",
            assemblyOrder: 5,
            connections: ["Pulmonary Veins", "Left Ventricle"],
            failureEffect: "Atrial fibrillation, blood clots",
            cascadeFailures: ["Stroke", "Heart failure"],
            originalPosition: { x: 1.2, y: 1.5, z: 0.5 },
            explodedPosition: { x: 3, y: 2, z: 1 }
        }
    ];

    const description = "The cardiovascular system, featuring an anatomically inspired heart model with glowing circulatory vessels. Demonstrates systemic and pulmonary circulation with active pulsation mechanics.";

    const quizQuestions = [
        {
            question: "Which vessel carries oxygenated blood from the heart to the rest of the body?",
            options: ["Vena Cava", "Aorta", "Pulmonary Artery", "Pulmonary Vein"],
            correct: 1,
            explanation: "The aorta is the main systemic artery that distributes oxygen-rich blood from the left ventricle to the body.",
            difficulty: "Easy"
        },
        {
            question: "Deoxygenated blood enters the heart through which structure?",
            options: ["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"],
            correct: 1,
            explanation: "The right atrium receives deoxygenated blood returning from the systemic circulation via the vena cava.",
            difficulty: "Medium"
        },
        {
            question: "Which part of the heart has the thickest muscular wall?",
            options: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle"],
            correct: 3,
            explanation: "The left ventricle has the thickest wall because it must pump blood at a higher pressure to overcome systemic resistance and supply the entire body.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Heartbeat pulsation
        // A typical heartbeat has a systolic contraction and diastolic relaxation
        const beatFreq = 2 * speed;
        // complex wave form for heartbeat
        const beatPhase = (time * beatFreq) % (Math.PI * 2);
        
        // Simulating the "lub-dub" double beat
        let scale = 1.0;
        if (beatPhase < 0.5) {
            scale = 1.0 + Math.sin(beatPhase * Math.PI * 2) * 0.1;
        } else if (beatPhase > 0.8 && beatPhase < 1.3) {
            scale = 1.0 + Math.sin((beatPhase - 0.8) * Math.PI * 2) * 0.05;
        }

        heartMesh.scale.set(scale, scale, scale);
        
        // Pulse glow effect on arteries and veins
        aortaMesh.material.emissiveIntensity = 0.5 + Math.sin(time * beatFreq * 2) * 0.3;
        venaCavaMesh.material.emissiveIntensity = 0.5 + Math.cos(time * beatFreq * 2) * 0.3;
        pulmonaryArteryMesh.material.emissiveIntensity = 0.5 + Math.sin(time * beatFreq * 2 + Math.PI) * 0.3;
        leftPulmonaryVeinMesh.material.emissiveIntensity = 0.5 + Math.cos(time * beatFreq * 2 + Math.PI) * 0.3;
        
        // Slight rotation to show the 3D structure
        group.rotation.y = time * 0.2 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCardiovascular() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
