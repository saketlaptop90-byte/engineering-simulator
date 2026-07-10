import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const glowingPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff0088,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9
    });
    
    const softTissue = new THREE.MeshStandardMaterial({
        color: 0xffaaaa,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
    });

    // 1. Thyroid Cartilage (Adam's Apple)
    const thyroidGeo = new THREE.CylinderGeometry(1.5, 1.2, 3, 32, 1, false, Math.PI, Math.PI);
    const thyroidMesh = new THREE.Mesh(thyroidGeo, plastic);
    thyroidMesh.position.set(0, 0, -0.5);
    thyroidMesh.rotation.x = Math.PI / 10;
    group.add(thyroidMesh);
    meshes.thyroid = thyroidMesh;
    parts.push({
        name: "Thyroid Cartilage",
        description: "The largest cartilage of the larynx, forming the anterior and lateral walls.",
        material: "High-density Polymer",
        function: "Protects the vocal folds and provides an attachment point for muscles.",
        assemblyOrder: 1,
        connections: ["Cricoid Cartilage", "Vocal Folds"],
        failureEffect: "Loss of structural protection for vocal cords.",
        cascadeFailures: ["Voice alteration", "Airway vulnerability"],
        originalPosition: { x: 0, y: 0, z: -0.5 },
        explodedPosition: { x: 0, y: 2, z: -3 }
    });

    // 2. Cricoid Cartilage
    const cricoidGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
    const cricoidMesh = new THREE.Mesh(cricoidGeo, chrome);
    cricoidMesh.position.set(0, -2, 0);
    cricoidMesh.rotation.x = Math.PI / 2;
    group.add(cricoidMesh);
    meshes.cricoid = cricoidMesh;
    parts.push({
        name: "Cricoid Cartilage",
        description: "A ring-shaped cartilage forming the inferior wall of the larynx.",
        material: "Chrome Alloy",
        function: "Provides attachments for muscles and ligaments involved in opening and closing the airway.",
        assemblyOrder: 2,
        connections: ["Thyroid Cartilage", "Trachea", "Arytenoid Cartilages"],
        failureEffect: "Inability to properly tension vocal folds.",
        cascadeFailures: ["Dysphonia", "Breathing difficulties"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 3. Arytenoid Cartilages
    const aryGeo = new THREE.TetrahedronGeometry(0.5);
    const aryLeftMesh = new THREE.Mesh(aryGeo, darkSteel);
    aryLeftMesh.position.set(-0.6, -1, 0.8);
    const aryRightMesh = new THREE.Mesh(aryGeo, darkSteel);
    aryRightMesh.position.set(0.6, -1, 0.8);
    group.add(aryLeftMesh);
    group.add(aryRightMesh);
    meshes.aryLeft = aryLeftMesh;
    meshes.aryRight = aryRightMesh;
    parts.push({
        name: "Arytenoid Cartilages",
        description: "Paired pyramidal cartilages that articulate with the cricoid cartilage.",
        material: "Dark Steel",
        function: "Crucial for allowing vocal folds to be tensed, relaxed, or approximated.",
        assemblyOrder: 3,
        connections: ["Cricoid Cartilage", "Vocal Folds"],
        failureEffect: "Paralysis of vocal folds.",
        cascadeFailures: ["Aspiration", "Aphonia"],
        originalPosition: { x: 0, y: -1, z: 0.8 },
        explodedPosition: { x: 0, y: -1, z: 3 }
    });

    // 4. Vocal Folds (True Vocal Cords)
    // Create a shape that can "open" and "close"
    const cordGeo = new THREE.BoxGeometry(0.8, 0.2, 2);
    const cordLeftMesh = new THREE.Mesh(cordGeo, glowingPink);
    cordLeftMesh.position.set(-0.4, 0, 0);
    const cordRightMesh = new THREE.Mesh(cordGeo, glowingPink);
    cordRightMesh.position.set(0.4, 0, 0);
    group.add(cordLeftMesh);
    group.add(cordRightMesh);
    meshes.cordLeft = cordLeftMesh;
    meshes.cordRight = cordRightMesh;
    parts.push({
        name: "Vocal Folds",
        description: "Twin infoldings of mucous membrane stretched horizontally across the larynx.",
        material: "Bio-synthetic Neon Tissue",
        function: "Vibrate to produce sound (phonation) and protect the airway from choking.",
        assemblyOrder: 4,
        connections: ["Thyroid Cartilage", "Arytenoid Cartilages"],
        failureEffect: "Inability to produce voice.",
        cascadeFailures: ["Choking", "Respiratory distress"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 0, z: 2 } // generic offset, animation handles sides
    });

    // 5. Airflow Simulation (Neon Particles/Energy)
    const airFlowGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const airFlowMesh = new THREE.Mesh(airFlowGeo, glowingBlue);
    airFlowMesh.position.set(0, 0, 0);
    group.add(airFlowMesh);
    meshes.airFlow = airFlowMesh;
    parts.push({
        name: "Airflow Stream",
        description: "Pulmonary air driving the phonation process.",
        material: "Glowing Azure Plasma",
        function: "Provides the aerodynamic power necessary to cause the vocal folds to vibrate.",
        assemblyOrder: 5,
        connections: ["Trachea", "Vocal Folds"],
        failureEffect: "No sound generation possible.",
        cascadeFailures: ["Hypoxia", "Systemic failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 0, z: 2 }
    });

    // 6. Epiglottis
    const epGeo = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI, 0, Math.PI/2);
    const epMesh = new THREE.Mesh(epGeo, softTissue);
    epMesh.position.set(0, 2, 0.5);
    epMesh.rotation.x = -Math.PI / 4;
    group.add(epMesh);
    meshes.epiglottis = epMesh;
    parts.push({
        name: "Epiglottis",
        description: "A leaf-shaped flap of cartilage located behind the tongue, at the top of the larynx.",
        material: "Soft Bio-Matrix",
        function: "Seals off the windpipe during eating to prevent accidental inhalation.",
        assemblyOrder: 6,
        connections: ["Thyroid Cartilage", "Tongue Root"],
        failureEffect: "Food/liquid enters trachea.",
        cascadeFailures: ["Aspiration pneumonia", "Choking"],
        originalPosition: { x: 0, y: 2, z: 0.5 },
        explodedPosition: { x: 0, y: 5, z: 1 }
    });


    const description = "An ultra high-tech, bio-mechanical simulation of the Human Larynx. It visualizes the intricate interplay of cartilages and glowing synthetic vocal folds as they modulate high-energy airflow to produce sound.";

    const quizQuestions = [
        {
            question: "Which cartilage forms the 'Adam's Apple' in humans?",
            options: ["Cricoid Cartilage", "Thyroid Cartilage", "Arytenoid Cartilage", "Epiglottis"],
            correct: 1,
            explanation: "The thyroid cartilage is the largest laryngeal cartilage and its anterior prominence is known as the Adam's Apple.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the Epiglottis?",
            options: ["To vibrate and produce sound", "To support the trachea", "To prevent food from entering the airway", "To control the pitch of the voice"],
            correct: 2,
            explanation: "The epiglottis acts as a trapdoor, folding down to cover the glottis during swallowing.",
            difficulty: "Medium"
        },
        {
            question: "Which structures articulate with the cricoid cartilage and are primarily responsible for adjusting vocal fold tension?",
            options: ["Arytenoid Cartilages", "Hyoid Bone", "Thyroid Cartilage", "Tracheal Rings"],
            correct: 0,
            explanation: "The arytenoid cartilages pivot and slide on the cricoid cartilage to abduct, adduct, and alter the tension of the vocal folds.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // High frequency vibration of vocal cords depending on 'sound'
        const vibrateSpeed = time * speed * 20;
        
        // Opening and closing of vocal folds
        const foldGap = Math.abs(Math.sin(time * speed * 2)) * 0.4 + 0.05;
        meshesObj.cordLeft.position.x = -0.4 - foldGap;
        meshesObj.cordRight.position.x = 0.4 + foldGap;
        
        // High speed micro-vibrations for phonation effect
        meshesObj.cordLeft.position.y = Math.sin(vibrateSpeed) * 0.05;
        meshesObj.cordRight.position.y = -Math.sin(vibrateSpeed) * 0.05;
        
        // Emissive pulsing on cords
        meshesObj.cordLeft.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(vibrateSpeed * 0.5));
        meshesObj.cordRight.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(vibrateSpeed * 0.5));
        
        // Airflow visual effect
        meshesObj.airFlow.scale.x = 0.8 + Math.abs(Math.sin(time * speed * 5)) * 0.2;
        meshesObj.airFlow.scale.z = 0.8 + Math.abs(Math.sin(time * speed * 5)) * 0.2;
        meshesObj.airFlow.material.opacity = (1.0 - foldGap) * 0.8 + 0.1; // more opaque when cords are closed
        
        // Subtle cartilage movement
        meshesObj.thyroid.rotation.x = Math.PI / 10 + Math.sin(time * speed) * 0.05;
        meshesObj.aryLeft.rotation.z = Math.sin(time * speed * 2) * 0.2;
        meshesObj.aryRight.rotation.z = -Math.sin(time * speed * 2) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVocalCords() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
