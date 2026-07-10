import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x39ff14,
        emissive: 0x39ff14,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
    });
    
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00f3ff,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.2,
    });

    const highTechAlloy = new THREE.MeshStandardMaterial({
        color: 0x8899aa,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0,
    });

    // 1. Central Main Shaft
    const shaftGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, highTechAlloy);
    shaftGroup.add(shaft);
    group.add(shaftGroup);
    parts.push({
        name: 'Main Shaft',
        description: 'The central rotating axis of the reel assembly.',
        material: 'High-Tech Alloy',
        function: 'Transmits rotational power from the drive mechanism to the entire reel.',
        assemblyOrder: 1,
        connections: ['Reel Spiders', 'Drive Sprocket', 'Support Arms'],
        failureEffect: 'Complete stoppage of the reel, halting crop gathering.',
        cascadeFailures: ['Clogging of cutter bar due to ungathered crop'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Reel Spiders
    const spidersGroup = new THREE.Group();
    const numSpiders = 5;
    const spiderPositions = [-8, -4, 0, 4, 8];
    const numArms = 6;
    
    spiderPositions.forEach((pos) => {
        const spiderHubGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16);
        spiderHubGeo.rotateZ(Math.PI / 2);
        const spiderHub = new THREE.Mesh(spiderHubGeo, neonBlue);
        spiderHub.position.set(pos, 0, 0);
        spidersGroup.add(spiderHub);

        for(let i=0; i<numArms; i++) {
            const angle = (i / numArms) * Math.PI * 2;
            const armGeo = new THREE.BoxGeometry(0.2, 3, 0.2);
            const arm = new THREE.Mesh(armGeo, darkSteel);
            arm.position.set(pos, Math.cos(angle) * 1.5, Math.sin(angle) * 1.5);
            arm.rotation.x = -angle;
            spidersGroup.add(arm);
        }
    });
    group.add(spidersGroup);
    parts.push({
        name: 'Reel Spiders',
        description: 'Star-shaped hubs with arms extending outward.',
        material: 'Dark Steel & Neon Blue Hubs',
        function: 'Holds the bat tubes at the correct distance from the main shaft and maintains structural integrity.',
        assemblyOrder: 2,
        connections: ['Main Shaft', 'Bat Tubes'],
        failureEffect: 'Imbalance in the reel, potentially causing violent vibrations.',
        cascadeFailures: ['Bending of main shaft', 'Shattering of bat tubes'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -5 }
    });

    // 3. Bat Tubes (Crossbars)
    const batTubesGroup = new THREE.Group();
    for(let i=0; i<numArms; i++) {
        const angle = (i / numArms) * Math.PI * 2;
        const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 19.5, 16);
        tubeGeo.rotateZ(Math.PI / 2);
        const tube = new THREE.Mesh(tubeGeo, chrome);
        tube.position.set(0, Math.cos(angle) * 3, Math.sin(angle) * 3);
        batTubesGroup.add(tube);
    }
    group.add(batTubesGroup);
    parts.push({
        name: 'Bat Tubes',
        description: 'Long horizontal bars connecting the tips of the spider arms.',
        material: 'Chrome',
        function: 'Provides a mounting structure for the gathering tines and sweeps crops backwards.',
        assemblyOrder: 3,
        connections: ['Reel Spiders', 'Tines', 'Pitch Control Cam'],
        failureEffect: 'Loss of tines in the affected section, uneven crop flow.',
        cascadeFailures: ['Crop wrapping around the reel'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // 4. Gathering Tines
    const tinesGroup = new THREE.Group();
    for(let i=0; i<numArms; i++) {
        const angle = (i / numArms) * Math.PI * 2;
        const armTinesGroup = new THREE.Group();
        armTinesGroup.position.set(0, Math.cos(angle) * 3, Math.sin(angle) * 3);
        
        for(let j=-9; j<=9; j+=1.5) {
            const tineGeo = new THREE.CylinderGeometry(0.05, 0.02, 1.5, 8);
            tineGeo.translate(0, -0.75, 0); 
            const tine = new THREE.Mesh(tineGeo, neonGreen);
            tine.position.set(j, 0, 0);
            armTinesGroup.add(tine);
        }
        armTinesGroup.userData.armAngle = angle;
        tinesGroup.add(armTinesGroup);
    }
    group.add(tinesGroup);
    parts.push({
        name: 'Gathering Tines',
        description: 'Finger-like prongs extending from the bat tubes.',
        material: 'Neon Green Synthetic Polymer',
        function: 'Gently engages the crop, lifting downed stalks and pulling them into the cutter bar.',
        assemblyOrder: 4,
        connections: ['Bat Tubes'],
        failureEffect: 'Missed or dropped crops, lowering harvest yield.',
        cascadeFailures: ['Tines breaking off and entering the threshing mechanism, causing internal damage'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Pitch Control Cam Mechanism
    const camGroup = new THREE.Group();
    const camGeo = new THREE.TorusGeometry(2, 0.3, 16, 50);
    const cam = new THREE.Mesh(camGeo, steel);
    cam.rotation.y = Math.PI / 2;
    cam.position.set(-9.8, 0, 0);
    camGroup.add(cam);
    group.add(camGroup);
    parts.push({
        name: 'Pitch Control Cam',
        description: 'An eccentric circular track at the end of the reel.',
        material: 'Steel',
        function: 'Adjusts the angle of the tines continuously as the reel rotates, ensuring optimal crop engagement and release.',
        assemblyOrder: 5,
        connections: ['Bat Tubes', 'Support Arms'],
        failureEffect: 'Tines remain at a fixed angle, throwing crops forward instead of pulling them in.',
        cascadeFailures: ['Severe crop loss', 'Reel wrapping'],
        originalPosition: { x: -9.8, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // 6. Drive Sprocket / Hydraulic Motor
    const motorGroup = new THREE.Group();
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    motorGeo.rotateZ(Math.PI / 2);
    const motor = new THREE.Mesh(motorGeo, copper);
    motor.position.set(9.8, 0, 0);
    motorGroup.add(motor);
    group.add(motorGroup);
    parts.push({
        name: 'Hydraulic Drive Motor',
        description: 'Compact power unit mounted at the end of the shaft.',
        material: 'Copper / Brushed Metal',
        function: 'Provides variable speed rotation to the reel assembly independent of the combine ground speed.',
        assemblyOrder: 6,
        connections: ['Main Shaft', 'Support Arms', 'Hydraulic System'],
        failureEffect: 'Reel stops rotating completely.',
        cascadeFailures: ['Overheating of hydraulic lines', 'Pump failure'],
        originalPosition: { x: 9.8, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // 7. Support Arms
    const supportArmsGroup = new THREE.Group();
    const leftArmGeo = new THREE.BoxGeometry(0.5, 8, 1);
    const leftArm = new THREE.Mesh(leftArmGeo, aluminum);
    leftArm.position.set(-10.5, 3, -2);
    leftArm.rotation.x = Math.PI / 4;
    supportArmsGroup.add(leftArm);

    const rightArmGeo = new THREE.BoxGeometry(0.5, 8, 1);
    const rightArm = new THREE.Mesh(rightArmGeo, aluminum);
    rightArm.position.set(10.5, 3, -2);
    rightArm.rotation.x = Math.PI / 4;
    supportArmsGroup.add(rightArm);
    
    group.add(supportArmsGroup);
    parts.push({
        name: 'Hydraulic Lift Support Arms',
        description: 'Sturdy arms connecting the reel to the combine header.',
        material: 'Aluminum',
        function: 'Allows the operator to adjust the height and fore/aft position of the reel on the fly.',
        assemblyOrder: 7,
        connections: ['Main Shaft', 'Header Frame', 'Lift Cylinders'],
        failureEffect: 'Reel drops into the cutter bar or falls off completely.',
        cascadeFailures: ['Catastrophic destruction of the header cutter bar and auger'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: -10 }
    });

    const description = "The reel is a critical component of a combine harvester's header. It acts like a giant rotating comb that gently grabs the standing or lodged (fallen) crops, pulls them backwards over the reciprocating cutter bar, and sweeps the cut material into the header auger. Modern reels use an eccentric cam mechanism to constantly adjust the pitch (angle) of the tines as they rotate, ensuring they point downward to lift crops, then feather backward to release the cut crop smoothly without carrying it over the top.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pitch Control Cam?",
            options: [
                "To control the rotational speed of the reel",
                "To adjust the height of the reel relative to the ground",
                "To continuously adjust the angle of the tines during rotation",
                "To transmit hydraulic power to the drive sprocket"
            ],
            correct: 2,
            explanation: "The pitch control cam is an eccentric track that alters the angle of the bat tubes and their attached tines as the reel rotates, optimizing crop pickup and release.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the reel tines are set too low and too far forward?",
            options: [
                "The reel will carry the cut crop completely over the top (wrapping)",
                "The tines may hit the cutter bar or push crops down before they are cut",
                "The combine will consume less fuel",
                "The hydraulic motor will over-speed"
            ],
            correct: 1,
            explanation: "If positioned too low and far forward, the reel tines can physically interfere with the cutter bar or push the standing crop into the ground, leading to poor cutting and grain loss.",
            difficulty: "Hard"
        },
        {
            question: "Why is an independent hydraulic motor often used to drive the reel instead of a mechanical linkage to the wheels?",
            options: [
                "It allows the reel speed to be adjusted independently of the combine's ground speed",
                "Hydraulic motors are cheaper than belts",
                "It prevents the reel from rotating in reverse",
                "It increases the weight of the header for better traction"
            ],
            correct: 0,
            explanation: "An independent hydraulic drive allows the operator to fine-tune the reel's rotational speed to match the crop conditions and ground speed, which is critical for smooth feeding without shattering grain heads.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes || meshes.length === 0) return;
        
        const rotationSpeed = speed * 0.02;
        
        if (meshes[0]) meshes[0].rotation.x += rotationSpeed;
        if (meshes[1]) meshes[1].rotation.x += rotationSpeed;
        
        if (meshes[2]) {
            meshes[2].rotation.x += rotationSpeed;
        }
        
        if (meshes[3]) {
            meshes[3].rotation.x += rotationSpeed;
            
            meshes[3].children.forEach((armTinesGroup) => {
                const armAngle = armTinesGroup.userData.armAngle;
                const globalAngle = meshes[3].rotation.x + armAngle;
                
                const camEffect = Math.sin(globalAngle) * 0.4;
                
                armTinesGroup.rotation.x = -meshes[3].rotation.x + camEffect;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCombineHarvesterReel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
