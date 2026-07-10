export function createHumanoidBipedalRobot(THREE) {
    const group = new THREE.Group();
    
    const parts = [
        { name: "Torso Frame", description: "Central structure housing main processing and power units." },
        { name: "Head Unit with Vision", description: "Contains stereoscopic cameras and advanced sensor arrays." },
        { name: "Shoulder Actuators", description: "Provides omnidirectional movement for the arms." },
        { name: "Arm Assemblies", description: "Rigid links connecting shoulders to hands." },
        { name: "Hand Manipulators", description: "Prehensile tools for interacting with the environment." },
        { name: "Hip Joints", description: "Multi-axis joints connecting the torso to the legs." },
        { name: "Upper Legs", description: "High-torque sections carrying the primary payload." },
        { name: "Knee Actuators", description: "Heavy-duty joints for impact absorption and locomotion." },
        { name: "Lower Legs", description: "Structural supports leading to the stabilizers." },
        { name: "Ankle/Foot Stabilizers", description: "Wide bases equipped with gyroscopic stabilization and grip pads." }
    ];

    const quizQuestions = [
        {
            question: "What is the primary function of the Head Unit?",
            options: ["Locomotion", "Stereoscopic vision and sensing", "Power storage", "Payload delivery"],
            answer: "Stereoscopic vision and sensing",
            explanation: "The head unit contains the visual sensors and cameras required for navigation and object recognition."
        },
        {
            question: "Which components connect the torso directly to the legs?",
            options: ["Knee Actuators", "Ankle Stabilizers", "Hip Joints", "Shoulder Actuators"],
            answer: "Hip Joints",
            explanation: "Hip joints are the primary connection points between the central torso and the leg assemblies."
        },
        {
            question: "What is crucial for the robot to maintain balance while walking?",
            options: ["Hand Manipulators", "Arm Assemblies", "Ankle/Foot Stabilizers", "Head Unit"],
            answer: "Ankle/Foot Stabilizers",
            explanation: "The ankle and foot stabilizers use gyroscopic systems and grip to keep the robot upright."
        },
        {
            question: "Which part provides omnidirectional movement for the arms?",
            options: ["Shoulder Actuators", "Knee Actuators", "Torso Frame", "Upper Legs"],
            answer: "Shoulder Actuators",
            explanation: "Shoulder actuators allow the arms to move freely in multiple axes."
        },
        {
            question: "Where are the primary processing and power units typically housed?",
            options: ["Head Unit", "Lower Legs", "Torso Frame", "Hand Manipulators"],
            answer: "Torso Frame",
            explanation: "The torso serves as the central chassis, making it ideal for large batteries and central computing."
        },
        {
            question: "What absorbs impact during the robot's locomotion?",
            options: ["Shoulder Actuators", "Hand Manipulators", "Knee Actuators", "Head Unit"],
            answer: "Knee Actuators",
            explanation: "Knee actuators are heavy-duty joints designed to handle the impact and stress of walking or running."
        }
    ];

    // Materials
    const matGrey = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const matBlue = new THREE.MeshStandardMaterial({ color: 0x2266cc, metalness: 0.5, roughness: 0.5 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.8 });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(1.2, 1.8, 0.8);
    const torso = new THREE.Mesh(torsoGeo, matGrey);
    torso.position.y = 3.5;
    group.add(torso);

    // 2. Head
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const head = new THREE.Mesh(headGeo, matBlue);
    head.position.y = 1.3;
    
    const visorGeo = new THREE.PlaneGeometry(0.6, 0.3);
    const visor = new THREE.Mesh(visorGeo, matGlass);
    visor.position.z = 0.41;
    visor.position.y = 0.1;
    head.add(visor);
    torso.add(head);

    // 3. Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    const shoulderL = new THREE.Mesh(shoulderGeo, matDark);
    shoulderL.rotation.z = Math.PI / 2;
    shoulderL.position.set(-0.75, 0.7, 0);
    const shoulderR = shoulderL.clone();
    shoulderR.position.set(0.75, 0.7, 0);
    torso.add(shoulderL);
    torso.add(shoulderR);

    // 4. Arms
    const armGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.2, 16);
    const armL = new THREE.Mesh(armGeo, matGrey);
    armL.position.set(0, -0.6, 0);
    const armR = armL.clone();
    
    // We'll pivot the arms at the shoulders
    const armPivotL = new THREE.Group();
    armPivotL.position.set(-0.9, 0.7, 0);
    armPivotL.add(armL);
    torso.add(armPivotL);

    const armPivotR = new THREE.Group();
    armPivotR.position.set(0.9, 0.7, 0);
    armPivotR.add(armR);
    torso.add(armPivotR);

    // 5. Hands
    const handGeo = new THREE.BoxGeometry(0.25, 0.3, 0.2);
    const handL = new THREE.Mesh(handGeo, matDark);
    handL.position.set(0, -0.7, 0);
    armL.add(handL);
    const handR = handL.clone();
    armR.add(handR);

    // 6. Hips
    const hipGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 16);
    const hips = new THREE.Mesh(hipGeo, matDark);
    hips.rotation.z = Math.PI / 2;
    hips.position.set(0, -0.9, 0);
    torso.add(hips);

    // 7. Upper Legs
    const upperLegGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.2, 16);
    const upperLegL = new THREE.Mesh(upperLegGeo, matGrey);
    upperLegL.position.set(0, -0.6, 0);
    const upperLegR = upperLegL.clone();

    const legPivotL = new THREE.Group();
    legPivotL.position.set(-0.4, -0.9, 0);
    legPivotL.add(upperLegL);
    torso.add(legPivotL);

    const legPivotR = new THREE.Group();
    legPivotR.position.set(0.4, -0.9, 0);
    legPivotR.add(upperLegR);
    torso.add(legPivotR);

    // 8. Knees
    const kneeGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const kneeL = new THREE.Mesh(kneeGeo, matDark);
    kneeL.position.set(0, -0.6, 0);
    upperLegL.add(kneeL);
    const kneeR = kneeL.clone();
    upperLegR.add(kneeR);

    // 9. Lower Legs
    const lowerLegGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.2, 16);
    const lowerLegL = new THREE.Mesh(lowerLegGeo, matGrey);
    lowerLegL.position.set(0, -0.6, 0);
    
    const kneePivotL = new THREE.Group();
    kneePivotL.add(lowerLegL);
    kneeL.add(kneePivotL);

    const lowerLegR = lowerLegL.clone();
    const kneePivotR = new THREE.Group();
    kneePivotR.add(lowerLegR);
    kneeR.add(kneePivotR);

    // 10. Ankles / Feet
    const footGeo = new THREE.BoxGeometry(0.4, 0.2, 0.8);
    const footL = new THREE.Mesh(footGeo, matDark);
    footL.position.set(0, -0.6, 0.2);
    lowerLegL.add(footL);
    const footR = footL.clone();
    lowerLegR.add(footR);

    // Add references for animation
    const animatedParts = {
        torso,
        armPivotL,
        armPivotR,
        legPivotL,
        legPivotR,
        kneePivotL,
        kneePivotR,
        head
    };

    function update(time) {
        // Walking animation
        const walkSpeed = 3;
        
        // Torso bobbing
        animatedParts.torso.position.y = 3.5 + Math.sin(time * walkSpeed * 2) * 0.1;
        
        // Arm swinging (opposite to legs)
        animatedParts.armPivotL.rotation.x = Math.sin(time * walkSpeed) * 0.5;
        animatedParts.armPivotR.rotation.x = -Math.sin(time * walkSpeed) * 0.5;

        // Leg swinging
        animatedParts.legPivotL.rotation.x = -Math.sin(time * walkSpeed) * 0.5;
        animatedParts.legPivotR.rotation.x = Math.sin(time * walkSpeed) * 0.5;

        // Knee bending (bending backward when leg swings back, straight when swinging forward)
        animatedParts.kneePivotL.rotation.x = Math.max(0, -Math.sin(time * walkSpeed) * 0.8);
        animatedParts.kneePivotR.rotation.x = Math.max(0, Math.sin(time * walkSpeed) * 0.8);

        // Head looking around slightly
        animatedParts.head.rotation.y = Math.sin(time * 0.5) * 0.2;
    }

    return { group, update, parts, quizQuestions };
}
