import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const aortaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff1111,
        emissive: 0x550000,
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.2, // slight transparency
        thickness: 0.5
    });

    const flowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3333,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    // We'll use a tube geometry to represent the aortic arch
    class CustomCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }

        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = -Math.cos(t * Math.PI) * 4;
            const ty = Math.sin(t * Math.PI) * 6;
            const tz = Math.sin(t * Math.PI) * 2;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const path = new CustomCurve(1);
    const aortaGeo = new THREE.TubeGeometry(path, 64, 1.5, 32, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMaterial);
    
    // Position it slightly
    aortaMesh.position.set(0, -3, 0);
    
    const aortaOriginalPos = { x: 0, y: -3, z: 0 };
    const aortaExplodedPos = { x: 0, y: -3, z: 5 };

    group.add(aortaMesh);

    parts.push({
        name: "Main Arch Pipeline",
        description: "The primary curve of the aorta distributing oxygenated blood.",
        material: "Organic Polymer",
        function: "Withstands high pressure from the left ventricle and channels blood to systemic circulation.",
        assemblyOrder: 1,
        connections: ["Left Ventricle", "Descending Aorta"],
        failureEffect: "Aneurysm or rupture, leading to catastrophic internal bleeding.",
        cascadeFailures: ["Systemic Ischemia", "Cardiac Arrest"],
        originalPosition: aortaOriginalPos,
        explodedPosition: aortaExplodedPos
    });

    // Add branches (Brachiocephalic, Common Carotid, Subclavian)
    const branchGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    
    // Branch 1: Brachiocephalic
    const b1Mesh = new THREE.Mesh(branchGeo, aortaMaterial);
    b1Mesh.position.set(-2, 3.5, 2);
    b1Mesh.rotation.z = -0.2;
    b1Mesh.rotation.x = -0.3;
    group.add(b1Mesh);

    parts.push({
        name: "Brachiocephalic Artery",
        description: "First major branch of the aortic arch.",
        material: "Organic Polymer",
        function: "Supplies blood to the right arm and head/neck.",
        assemblyOrder: 2,
        connections: ["Main Arch Pipeline"],
        failureEffect: "Reduced blood flow to right hemisphere of brain.",
        cascadeFailures: ["Stroke", "Syncope"],
        originalPosition: { x: -2, y: 3.5, z: 2 },
        explodedPosition: { x: -4, y: 5, z: 4 }
    });

    // Branch 2: Left Common Carotid
    const b2Mesh = new THREE.Mesh(branchGeo, aortaMaterial);
    b2Mesh.position.set(0, 4, 2.2);
    b2Mesh.rotation.z = 0;
    b2Mesh.rotation.x = -0.2;
    group.add(b2Mesh);

    parts.push({
        name: "Left Common Carotid Artery",
        description: "Second branch of the aortic arch.",
        material: "Organic Polymer",
        function: "Directly supplies blood to the left side of the head and neck.",
        assemblyOrder: 3,
        connections: ["Main Arch Pipeline"],
        failureEffect: "Cognitive impairment, stroke.",
        cascadeFailures: ["Left Brain Infarction"],
        originalPosition: { x: 0, y: 4, z: 2.2 },
        explodedPosition: { x: 0, y: 6, z: 4.5 }
    });

    // Branch 3: Left Subclavian
    const b3Mesh = new THREE.Mesh(branchGeo, aortaMaterial);
    b3Mesh.position.set(2, 3.5, 2);
    b3Mesh.rotation.z = 0.2;
    b3Mesh.rotation.x = -0.2;
    group.add(b3Mesh);

    parts.push({
        name: "Left Subclavian Artery",
        description: "Third branch of the aortic arch.",
        material: "Organic Polymer",
        function: "Supplies blood to the left arm.",
        assemblyOrder: 4,
        connections: ["Main Arch Pipeline"],
        failureEffect: "Ischemia of the left arm.",
        cascadeFailures: ["Muscle Necrosis in Arm"],
        originalPosition: { x: 2, y: 3.5, z: 2 },
        explodedPosition: { x: 4, y: 5, z: 4 }
    });

    // Inner flow indicator
    const flowPath = new CustomCurve(0.98); // slightly smaller
    const flowGeo = new THREE.TubeGeometry(flowPath, 64, 1.3, 16, false);
    const innerFlowMesh = new THREE.Mesh(flowGeo, flowMaterial);
    innerFlowMesh.position.copy(aortaMesh.position);
    group.add(innerFlowMesh);

    const description = "The Aortic Arch acts as a high-pressure manifold, distributing oxygen-rich blood from the heart to the rest of the body. Its compliance (elasticity) dampens pulsatile pressure.";

    const quizQuestions = [
        {
            question: "What property of the aortic arch allows it to dampen the pulsatile pressure from the heart?",
            options: ["Incompressibility", "Compliance (Elasticity)", "Rigidity", "Thermal conductivity"],
            correct: 1,
            explanation: "Arterial compliance (elasticity) allows the aorta to expand during systole and recoil during diastole, buffering pressure changes.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following is typically the first branch of the aortic arch?",
            options: ["Left Subclavian Artery", "Coronary Artery", "Brachiocephalic Artery", "Left Common Carotid Artery"],
            correct: 2,
            explanation: "The brachiocephalic artery is the first of the three main branches arising from the aortic arch.",
            difficulty: "Easy"
        },
        {
            question: "In fluid dynamics terms, what happens to velocity when the aorta branches out?",
            options: ["Velocity increases to maintain flow rate", "Velocity decreases as total cross-sectional area increases", "Velocity remains exactly the same", "Flow becomes fully turbulent immediately"],
            correct: 1,
            explanation: "As blood vessels branch, the total cross-sectional area increases, causing the mean velocity of the blood to decrease.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // time is continuous, speed is a multiplier
        const t = time * speed * 2;
        
        // Simulate heart beat (systole and diastole)
        const beat = 1 + 0.05 * Math.sin(t * Math.PI * 2);
        
        // Pulse the main aorta
        aortaMesh.scale.set(beat, beat, beat);
        innerFlowMesh.scale.set(beat, beat, beat);

        // Pulse branches with a slight phase delay
        const branchBeat = 1 + 0.04 * Math.sin((t - 0.1) * Math.PI * 2);
        b1Mesh.scale.set(branchBeat, 1, branchBeat);
        b2Mesh.scale.set(branchBeat, 1, branchBeat);
        b3Mesh.scale.set(branchBeat, 1, branchBeat);

        // Animate the flow wireframe to look like flowing fluid
        innerFlowMesh.rotation.x = Math.sin(t) * 0.02;
        
        // Emissive pulsing
        aortaMaterial.emissiveIntensity = 0.3 + 0.2 * Math.max(0, Math.sin(t * Math.PI * 2));
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAorticArch() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
