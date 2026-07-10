import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.5
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.3
    });

    const actinMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3366,
        roughness: 0.4,
        metalness: 0.2
    });

    // 1. Microtubule Structure (The Track)
    // A hollow tube made of tubulin dimers
    const microtubuleGroup = new THREE.Group();
    const numProtofilaments = 13;
    const microtubuleLength = 40;
    const tubulinRadius = 0.5;
    const mtRadius = 2.5;

    for (let p = 0; p < numProtofilaments; p++) {
        const angle = (p / numProtofilaments) * Math.PI * 2;
        for (let l = -microtubuleLength / 2; l <= microtubuleLength / 2; l += tubulinRadius * 2.1) {
            // Alpha/Beta tubulin alternating colors
            const isAlpha = Math.abs((l % (tubulinRadius * 4.2)) / (tubulinRadius * 2.1)) < 0.5;
            const mat = isAlpha ? glowingBlue : glass;
            
            const tubulinGeom = new THREE.SphereGeometry(tubulinRadius, 16, 16);
            const tubulinMesh = new THREE.Mesh(tubulinGeom, mat);
            
            // Apply a slight helical twist
            const twist = l * 0.05;
            
            tubulinMesh.position.set(
                Math.cos(angle + twist) * mtRadius,
                l,
                Math.sin(angle + twist) * mtRadius
            );
            
            microtubuleGroup.add(tubulinMesh);
        }
    }
    
    microtubuleGroup.rotation.z = Math.PI / 2;
    microtubuleGroup.position.set(0, -2, 0);
    group.add(microtubuleGroup);
    meshes.microtubule = microtubuleGroup;

    parts.push({
        name: "Microtubule",
        description: "A hollow tube formed by tubulin dimers, acting as a structural track for intracellular transport.",
        material: "Glowing Blue / Glass",
        function: "Provides structural support and serves as tracks for motor proteins.",
        assemblyOrder: 1,
        connections: ["Centrosome", "Kinesin Motors"],
        failureEffect: "Loss of track causes failure in vesicle transport.",
        cascadeFailures: ["Vesicle buildup", "Cell polarity loss"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Kinesin Motor Proteins
    // Walk along the microtubule carrying cargo
    const motorGroup = new THREE.Group();
    const numMotors = 3;
    const motors = [];

    for (let i = 0; i < numMotors; i++) {
        const motor = new THREE.Group();
        
        // Feet (Motor Domains)
        const footGeom = new THREE.CapsuleGeometry(0.3, 0.6, 8, 8);
        const foot1 = new THREE.Mesh(footGeom, glowingRed);
        const foot2 = new THREE.Mesh(footGeom, glowingRed);
        foot1.position.set(0, 0.5, 0.5);
        foot2.position.set(0, 0.5, -0.5);
        foot1.name = "foot1";
        foot2.name = "foot2";
        
        // Stalk
        const stalkGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const stalk = new THREE.Mesh(stalkGeom, rubber);
        stalk.position.set(0, 2.5, 0);
        
        // Cargo Binding Domain (Tail)
        const tailGeom = new THREE.SphereGeometry(0.6, 16, 16);
        const tail = new THREE.Mesh(tailGeom, chrome);
        tail.position.set(0, 4, 0);
        
        // Vesicle Cargo
        const vesicleGeom = new THREE.SphereGeometry(2.5, 32, 32);
        const vesicle = new THREE.Mesh(vesicleGeom, glowingGreen);
        vesicle.position.set(0, 6.5, 0);
        
        motor.add(foot1);
        motor.add(foot2);
        motor.add(stalk);
        motor.add(tail);
        motor.add(vesicle);
        
        const offset = (i - 1) * 10;
        motor.position.set(offset, 1.5, 0); // Ride on top of MT
        
        motors.push({
            group: motor,
            baseX: offset,
            phase: i * Math.PI
        });
        
        motorGroup.add(motor);
    }
    group.add(motorGroup);
    meshes.motors = motors;
    
    parts.push({
        name: "Kinesin Motor & Vesicle Cargo",
        description: "Motor proteins that 'walk' along microtubules to transport vesicles and organelles.",
        material: "Glowing Red / Glowing Green / Chrome",
        function: "Converts ATP into mechanical work to transport cargo towards the plus end of the microtubule.",
        assemblyOrder: 2,
        connections: ["Microtubule", "Vesicle Cargo"],
        failureEffect: "Cargo cannot be delivered to target destinations.",
        cascadeFailures: ["Neurodegeneration", "Synaptic failure"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 3. Actin Filaments (Microfilaments)
    // Double helix of globular actin (G-actin)
    const actinGroup = new THREE.Group();
    const actinLength = 30;
    const actinRadius = 0.4;
    const actinSpacing = 0.7;
    
    for (let a = -actinLength / 2; a <= actinLength / 2; a += actinSpacing) {
        const twist1 = a * 0.3;
        const twist2 = a * 0.3 + Math.PI;
        
        const actinMesh1 = new THREE.Mesh(new THREE.SphereGeometry(actinRadius, 12, 12), actinMaterial);
        actinMesh1.position.set(a, Math.sin(twist1) * 0.5, Math.cos(twist1) * 0.5);
        actinGroup.add(actinMesh1);
        
        const actinMesh2 = new THREE.Mesh(new THREE.SphereGeometry(actinRadius, 12, 12), actinMaterial);
        actinMesh2.position.set(a, Math.sin(twist2) * 0.5, Math.cos(twist2) * 0.5);
        actinGroup.add(actinMesh2);
    }
    
    actinGroup.position.set(5, 8, -5);
    actinGroup.rotation.y = Math.PI / 4;
    actinGroup.rotation.z = Math.PI / 6;
    group.add(actinGroup);
    meshes.actinGroup = actinGroup;
    
    parts.push({
        name: "Actin Filament",
        description: "A thin, flexible double helix of actin monomers.",
        material: "Red Actin",
        function: "Provides structural support beneath the cell membrane and enables cell motility.",
        assemblyOrder: 3,
        connections: ["Myosin Motors", "Cell Membrane"],
        failureEffect: "Cell loses shape and motility.",
        cascadeFailures: ["Inability to divide", "Loss of structure"],
        originalPosition: { x: 5, y: 8, z: -5 },
        explodedPosition: { x: 15, y: 15, z: -15 }
    });
    
    // 4. Centrosome (Microtubule Organizing Center)
    const centrosomeGroup = new THREE.Group();
    
    const centrioleGeom = new THREE.CylinderGeometry(1, 1, 3, 9);
    const centriole1 = new THREE.Mesh(centrioleGeom, aluminum);
    const centriole2 = new THREE.Mesh(centrioleGeom, aluminum);
    
    centriole1.rotation.x = Math.PI / 2;
    centriole2.position.set(1.5, 0, 0);
    
    const pcmGeom = new THREE.SphereGeometry(3, 32, 32);
    const pcmMat = new THREE.MeshStandardMaterial({
        color: 0x8844ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const pcm = new THREE.Mesh(pcmGeom, pcmMat);
    
    centrosomeGroup.add(centriole1);
    centrosomeGroup.add(centriole2);
    centrosomeGroup.add(pcm);
    
    centrosomeGroup.position.set(-25, -2, 0);
    group.add(centrosomeGroup);
    meshes.centrosome = centrosomeGroup;
    
    parts.push({
        name: "Centrosome (MTOC)",
        description: "The primary microtubule organizing center containing a pair of centrioles surrounded by pericentriolar material.",
        material: "Aluminum / Glowing Purple Wireframe",
        function: "Nucleates and anchors microtubules.",
        assemblyOrder: 4,
        connections: ["Microtubule Minus Ends"],
        failureEffect: "Disorganized microtubule network.",
        cascadeFailures: ["Mitotic spindle failure", "Aneuploidy"],
        originalPosition: { x: -25, y: -2, z: 0 },
        explodedPosition: { x: -35, y: -2, z: 0 }
    });

    const description = "The Cytoskeleton Network forms the structural framework of the cell. Microtubules act as high-speed tracks for motor proteins like kinesin, which haul vital cargo across the cell. Actin filaments provide cellular shape and drive motility. Together with intermediate filaments, they form a dynamic, constantly remodeling machine powered by ATP and GTP.";

    const quizQuestions = [
        {
            question: "Which component serves as the track for Kinesin motor proteins?",
            options: ["Actin Filaments", "Microtubules", "Intermediate Filaments", "Centrosome"],
            correct: 1,
            explanation: "Kinesins walk specifically along microtubules to transport cellular cargo.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Centrosome?",
            options: ["Generating ATP", "Synthesizing proteins", "Nucleating and organizing microtubules", "Degrading waste"],
            correct: 2,
            explanation: "The centrosome acts as the main Microtubule Organizing Center (MTOC) in animal cells.",
            difficulty: "Easy"
        },
        {
            question: "Actin filaments are primarily composed of which monomer?",
            options: ["Alpha-tubulin", "Beta-tubulin", "G-actin", "Myosin"],
            correct: 2,
            explanation: "Actin filaments are formed by the polymerization of globular actin (G-actin) into a double helix.",
            difficulty: "Medium"
        },
        {
            question: "Which motor protein moves toward the 'plus' end of the microtubule?",
            options: ["Dynein", "Kinesin", "Myosin", "Actin"],
            correct: 1,
            explanation: "Kinesins generally move toward the plus end (anterograde transport), whereas dyneins move toward the minus end.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate microtubule slightly
        meshes.microtubule.rotation.x = time * 0.2 * speed;
        
        // Animate Actin filament undulation
        meshes.actinGroup.position.y = 8 + Math.sin(time * 2 * speed) * 0.5;
        meshes.actinGroup.rotation.x = Math.sin(time * speed) * 0.1;
        
        // Rotate centrosome slowly
        meshes.centrosome.rotation.y = time * 0.5 * speed;
        meshes.centrosome.rotation.z = time * 0.3 * speed;
        
        // Animate Kinesin walking
        meshes.motors.forEach(motorObj => {
            const m = motorObj.group;
            
            // Move motor forward along microtubule track
            // Track is from x=-20 to x=20 roughly
            let xPos = motorObj.baseX + (time * 5 * speed) % 40;
            if (xPos > 20) xPos -= 40; // Loop around
            
            m.position.x = xPos;
            
            // Walking animation (stepping feet)
            const walkCycle = (time * 10 * speed + motorObj.phase);
            
            const foot1 = m.getObjectByName("foot1");
            const foot2 = m.getObjectByName("foot2");
            
            if (foot1 && foot2) {
                // Lift and place feet alternatingly
                const lift1 = Math.max(0, Math.sin(walkCycle));
                const lift2 = Math.max(0, Math.sin(walkCycle + Math.PI));
                
                foot1.position.y = 0.5 + lift1;
                foot2.position.y = 0.5 + lift2;
                
                // Swing feet forward and back
                const strideLength = 1.0;
                foot1.position.x = Math.cos(walkCycle) * strideLength;
                foot2.position.x = Math.cos(walkCycle + Math.PI) * strideLength;
                
                // Slight wobble to the stalk and cargo
                m.rotation.z = Math.sin(walkCycle) * 0.1;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCytoskeletonNetwork() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
