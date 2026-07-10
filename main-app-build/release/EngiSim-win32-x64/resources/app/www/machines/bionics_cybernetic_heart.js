import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const glowingMyocardiumMaterial = new THREE.MeshStandardMaterial({
        color: 0x880000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const glowingCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const bioTitaniumMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0
    });
    
    const meshes = {};
    
    // 1. Main Ventricular Housing
    const ventricleGeo = new THREE.CylinderGeometry(1.5, 0.5, 3, 32);
    const ventricleMesh = new THREE.Mesh(ventricleGeo, bioTitaniumMaterial);
    ventricleMesh.position.set(0, -1, 0);
    group.add(ventricleMesh);
    meshes.ventricle = ventricleMesh;
    parts.push({
        name: "Titanium Ventricular Housing",
        description: "Main casing that houses the synthetic pumping chambers.",
        material: "Bio-Titanium Alloy",
        function: "Provides structural integrity and protects internal mechanisms.",
        assemblyOrder: 1,
        connections: ["Myocardium Actuators", "Atrial Chambers"],
        failureEffect: "Structural breach leading to critical pressure loss.",
        cascadeFailures: ["Complete systemic circulatory collapse"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 2. Synthetic Myocardium (Muscle Actuators)
    const muscleGeo = new THREE.TorusKnotGeometry(1.6, 0.2, 100, 16);
    const muscleMesh = new THREE.Mesh(muscleGeo, glowingMyocardiumMaterial);
    muscleMesh.position.set(0, -0.5, 0);
    group.add(muscleMesh);
    meshes.muscle = muscleMesh;
    parts.push({
        name: "Carbon-Nanotube Myocardium",
        description: "Synthetic muscle fibers that contract to pump blood.",
        material: "Carbon Nanotubes",
        function: "Generates the contractile force necessary for blood circulation.",
        assemblyOrder: 2,
        connections: ["Ventricular Housing", "Power Core"],
        failureEffect: "Arrhythmia or complete pump failure.",
        cascadeFailures: ["Power Core Overload", "Valve Desync"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 3, y: -1, z: 3 }
    });

    // 3. Atrial Chambers
    const atrialGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const atrialMesh = new THREE.Mesh(atrialGeo, tinted);
    atrialMesh.position.set(0, 1.2, 0);
    atrialMesh.scale.set(1.5, 0.8, 1);
    group.add(atrialMesh);
    meshes.atria = atrialMesh;
    parts.push({
        name: "Polycarbonate Atrial Chambers",
        description: "Receiving chambers for blood returning to the heart.",
        material: "Medical-grade Polycarbonate",
        function: "Temporarily holds blood before it enters the ventricles.",
        assemblyOrder: 3,
        connections: ["Ventricular Housing", "Venous Conduits"],
        failureEffect: "Blood pooling and insufficient ventricular filling.",
        cascadeFailures: ["Systemic Hypoxia"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 4. Arc Reactor Power Core / Pacemaker
    const coreGeo = new THREE.OctahedronGeometry(0.5, 2);
    const coreMesh = new THREE.Mesh(coreGeo, glowingCoreMaterial);
    coreMesh.position.set(0, -0.5, 1.8);
    group.add(coreMesh);
    meshes.core = coreMesh;
    parts.push({
        name: "Isotope Micro-Reactor Core",
        description: "Provides continuous electrical power and pacing signals.",
        material: "Tritium-infused Plasma",
        function: "Powers the myocardium actuators and regulates heartbeat rhythms.",
        assemblyOrder: 4,
        connections: ["Myocardium Actuators"],
        failureEffect: "Immediate cessation of all cardiac functions.",
        cascadeFailures: ["Complete System Failure"],
        originalPosition: { x: 0, y: -0.5, z: 1.8 },
        explodedPosition: { x: 0, y: -0.5, z: 5 }
    });

    // 5. Aortic Arch (Arterial Output)
    const aortaGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 1.5, 0),
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(-2, 2, 0)
    ), 20, 0.4, 8, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, chrome);
    group.add(aortaMesh);
    meshes.aorta = aortaMesh;
    parts.push({
        name: "Synthetic Aorta",
        description: "The main artery carrying oxygenated blood to the body.",
        material: "Chrome/Teflon Composite",
        function: "Distributes high-pressure blood from the left ventricle.",
        assemblyOrder: 5,
        connections: ["Ventricular Housing"],
        failureEffect: "Catastrophic internal hemorrhage.",
        cascadeFailures: ["Rapid pressure drop", "System shutdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 3, z: 0 }
    });

    const description = "A state-of-the-art Cybernetic Heart replacing biological cardiac tissue with bio-titanium structures, carbon-nanotube muscles, and a micro-reactor core.";

    const quizQuestions = [
        {
            question: "Which component is responsible for generating the contractile force in the cybernetic heart?",
            options: ["Titanium Ventricular Housing", "Carbon-Nanotube Myocardium", "Polycarbonate Atrial Chambers", "Isotope Micro-Reactor Core"],
            correct: 1,
            explanation: "The Carbon-Nanotube Myocardium acts as the synthetic muscle, contracting to pump blood just like biological heart muscles.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the Isotope Micro-Reactor Core?",
            options: ["To pump blood directly", "To provide structural support", "To power actuators and regulate heartbeat rhythms", "To filter impurities from the blood"],
            correct: 2,
            explanation: "The Micro-Reactor Core serves as both the power source and the pacemaker, regulating rhythm and powering the synthetic muscles.",
            difficulty: "medium"
        },
        {
            question: "What cascade failure is most likely to occur if the Atrial Chambers fail?",
            options: ["Complete System Failure", "Rapid pressure drop", "Systemic Hypoxia", "Valve Desync"],
            correct: 2,
            explanation: "Failure of the Atrial Chambers prevents proper blood filling of the ventricles, leading to insufficient oxygen delivery (Systemic Hypoxia) to the body.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Heartbeat animation (systole and diastole)
            const t = time * speed * 3;
            const beat = Math.sin(t) * 0.5 + Math.sin(t * 2) * 0.25;
            const scale = 1 + beat * 0.1;
            
            meshes.ventricle.scale.set(scale, scale, scale);
            meshes.atria.scale.set(1.5 / scale, 0.8 / scale, 1 / scale); 
            
            // Glowing myocardium pulses
            const pulse = (Math.sin(t) + 1) / 2;
            meshes.muscle.material.emissiveIntensity = 0.5 + pulse;
            meshes.muscle.rotation.y = time * speed * 0.5;
            
            // Core spins and pulsates
            meshes.core.rotation.x = time * speed;
            meshes.core.rotation.y = time * speed * 1.5;
            meshes.core.material.emissiveIntensity = 1 + Math.sin(time * speed * 4) * 0.5;
            
            meshes.aorta.scale.set(scale * 1.05, 1, scale * 1.05);
        } else {
            meshes.ventricle.scale.set(1, 1, 1);
            meshes.atria.scale.set(1.5, 0.8, 1);
            meshes.aorta.scale.set(1, 1, 1);
            meshes.muscle.material.emissiveIntensity = 0.8;
            meshes.core.material.emissiveIntensity = 1.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCyberneticHeart() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
