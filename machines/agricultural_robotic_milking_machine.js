import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing/neon materials
    const laserGlow = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.6
    });

    const milkFlow = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });
    
    const sensorGlow = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x00ccff,
        emissiveIntensity: 2
    });

    // 1. Base Platform
    const platformGeom = new THREE.BoxGeometry(4, 0.2, 8);
    const platformMesh = new THREE.Mesh(platformGeom, steel);
    platformMesh.position.set(0, 0.1, 0);
    group.add(platformMesh);
    parts.push({
        name: "Stall Platform",
        description: "The main standing area for the dairy cow, equipped with integrated weigh scales and RFID antennas to identify the animal and monitor health metrics.",
        material: "Steel",
        function: "Supports the cow and provides structural mounting for robotic components.",
        assemblyOrder: 1,
        connections: ["Feed Trough", "Robotic Arm Base"],
        failureEffect: "Unstable footing or failure to identify cow.",
        cascadeFailures: ["Milking process halted", "Data tracking interrupted"],
        originalPosition: {x: 0, y: 0.1, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: platformMesh
    });

    // 2. Feed Trough
    const troughGeom = new THREE.BoxGeometry(2, 1, 1.5);
    const troughMesh = new THREE.Mesh(troughGeom, plastic);
    troughMesh.position.set(0, 0.7, 3.25);
    group.add(troughMesh);
    parts.push({
        name: "Feed Trough",
        description: "Dispenses a customized pelleted feed ration based on the cow's specific nutritional needs and current milk yield.",
        material: "Plastic",
        function: "Incentivizes the cow to enter the robot voluntarily and keeps her calm during milking.",
        assemblyOrder: 2,
        connections: ["Stall Platform", "Feed Auger"],
        failureEffect: "Cow may not enter the stall voluntarily or becomes agitated.",
        cascadeFailures: ["Reduced milk yield", "Herd congestion in waiting area"],
        originalPosition: {x: 0, y: 0.7, z: 3.25},
        explodedPosition: {x: 0, y: 2, z: 6},
        mesh: troughMesh
    });

    // 3. Robotic Arm Base
    const baseGeom = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(2.2, 0.6, 0);
    group.add(baseMesh);
    parts.push({
        name: "Robotic Arm Base",
        description: "Heavy-duty rotational mount containing high-torque servo motors and the primary lift cylinder.",
        material: "Dark Steel",
        function: "Provides stable rotational and vertical lifting power for the manipulator.",
        assemblyOrder: 3,
        connections: ["Stall Platform", "Primary Arm Segment"],
        failureEffect: "Arm cannot deploy from its resting position.",
        cascadeFailures: ["Complete system failure", "Cows missed milking"],
        originalPosition: {x: 2.2, y: 0.6, z: 0},
        explodedPosition: {x: 5, y: 0.6, z: 0},
        mesh: baseMesh
    });

    // 4. Primary Arm Segment
    const arm1Geom = new THREE.BoxGeometry(0.3, 2, 0.3);
    const arm1Mesh = new THREE.Mesh(arm1Geom, aluminum);
    arm1Geom.translate(0, 1, 0); // pivot at bottom
    arm1Mesh.position.set(2.2, 1.2, 0);
    group.add(arm1Mesh);
    parts.push({
        name: "Primary Arm Segment",
        description: "First articulated linkage that swings the attachment unit under the cow.",
        material: "Aluminum",
        function: "Extends the attachment head towards the udder.",
        assemblyOrder: 4,
        connections: ["Robotic Arm Base", "Secondary Arm Segment"],
        failureEffect: "Loss of reach.",
        cascadeFailures: ["Attachment failure"],
        originalPosition: {x: 2.2, y: 1.2, z: 0},
        explodedPosition: {x: 6, y: 3, z: 0},
        mesh: arm1Mesh
    });

    // 5. Secondary Arm Segment
    const arm2Geom = new THREE.BoxGeometry(0.2, 1.8, 0.2);
    const arm2Mesh = new THREE.Mesh(arm2Geom, aluminum);
    arm2Geom.translate(0, 0.9, 0);
    arm2Mesh.position.set(0, 2, 0); // Relative to arm1
    arm1Mesh.add(arm2Mesh); 
    parts.push({
        name: "Secondary Arm Segment",
        description: "Fine-positioning arm segment that allows complex vertical and horizontal translation.",
        material: "Aluminum",
        function: "Provides delicate adjustments to track the cow's movements.",
        assemblyOrder: 5,
        connections: ["Primary Arm Segment", "Attachment Head"],
        failureEffect: "Inaccurate tracking if the cow shifts weight.",
        cascadeFailures: ["Sensor misalignment", "Teat cup drop"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 2, y: 2, z: 0},
        mesh: arm2Mesh
    });

    // 6. Attachment Head & Sensor
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.8, 0); // Relative to arm2
    arm2Mesh.add(headGroup);
    
    const headGeom = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const headMesh = new THREE.Mesh(headGeom, chrome);
    headGroup.add(headMesh);
    
    const sensorGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const sensorMesh = new THREE.Mesh(sensorGeom, sensorGlow);
    sensorMesh.position.set(0, 0.15, 0.3);
    headGroup.add(sensorMesh);

    parts.push({
        name: "Optical Sensor Array",
        description: "Uses Time-of-Flight cameras and 3D lasers to map the udder topography in real-time.",
        material: "Chrome and Glowing Optics",
        function: "Locates individual teats and guides the cups into precise position for attachment.",
        assemblyOrder: 6,
        connections: ["Secondary Arm Segment", "Teat Cups"],
        failureEffect: 'System cannot "see" the udder.',
        cascadeFailures: ["Milking aborted", "Arm retracts"],
        originalPosition: {x: 0, y: 1.8, z: 0},
        explodedPosition: {x: 0, y: 3, z: 0},
        mesh: headGroup // use the group to explode the head and cups together
    });

    // 7. Teat Cups
    const cupGeom = new THREE.CylinderGeometry(0.06, 0.05, 0.3, 16);
    const cups = [];
    const cupPositions = [
        [-0.2, 0.2, -0.2], [0.2, 0.2, -0.2],
        [-0.2, 0.2, 0.2], [0.2, 0.2, 0.2]
    ];
    
    cupPositions.forEach((pos) => {
        const cup = new THREE.Mesh(cupGeom, chrome);
        cup.position.set(...pos);
        headGroup.add(cup);
        cups.push(cup);
    });

    parts.push({
        name: "Teat Cups (Cluster)",
        description: "Four specialized cups with silicone inflations that dynamically expand and contract.",
        material: "Chrome and Rubber",
        function: "Extracts milk using a pulsating vacuum that mimics a calf's suckling action.",
        assemblyOrder: 7,
        connections: ["Attachment Head", "Milk Hoses"],
        failureEffect: "Loss of vacuum seal.",
        cascadeFailures: ["Cup slips off", "Milk yield dropped", "Mastitis risk"],
        originalPosition: {x: -0.2, y: 0.2, z: -0.2},
        explodedPosition: {x: -1, y: 1, z: -1},
        mesh: cups[0] 
    });

    // 8. Milk Receiver Jar
    const jarGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    const jarMesh = new THREE.Mesh(jarGeom, glass);
    jarMesh.position.set(-2.5, 1.5, -2);
    group.add(jarMesh);
    
    const milkFluidGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 32);
    const milkFluidMesh = new THREE.Mesh(milkFluidGeom, milkFlow);
    milkFluidMesh.position.set(-2.5, 1.3, -2);
    group.add(milkFluidMesh);

    parts.push({
        name: "Receiver Jar",
        description: "Transparent collection vessel that briefly holds milk, measuring flow rate, conductivity, and color.",
        material: "Glass",
        function: "Separates air from milk, stabilizes vacuum, and acts as an inline quality testing chamber.",
        assemblyOrder: 8,
        connections: ["Milk Hoses", "Cooling Tank Line"],
        failureEffect: "Milk backs up or vacuum fluctuates wildly.",
        cascadeFailures: ["System flood", "Contamination risk"],
        originalPosition: {x: -2.5, y: 1.5, z: -2},
        explodedPosition: {x: -5, y: 3, z: -5},
        mesh: jarMesh
    });

    // 9. Laser Scan Beams (Visual Effect)
    const beamGeom = new THREE.CylinderGeometry(0.01, 1.5, 1.5, 16);
    beamGeom.translate(0, -0.75, 0);
    const beam1 = new THREE.Mesh(beamGeom, laserGlow);
    beam1.rotation.x = Math.PI / 4;
    sensorMesh.add(beam1);
    
    const beam2 = new THREE.Mesh(beamGeom, laserGlow);
    beam2.rotation.x = -Math.PI / 4;
    sensorMesh.add(beam2);

    const description = "The Agricultural Robotic Milking Machine represents the pinnacle of precision dairy farming. It autonomously detects, cleans, attaches to, and milks cows without human intervention. Using advanced 3D Time-of-Flight sensors and laser mapping, the highly articulated robotic arm delicately attaches teat cups while inline sensors monitor milk quality, flow rate, and animal health metrics in real-time.";

    const quizQuestions = [
        {
            question: "What is the primary function of the 3D optical sensor?",
            options: ["To measure the cow's weight", "To map the udder and accurately locate teats", "To analyze the milk quality chemically", "To scan the cow's RFID collar"],
            correct: 1,
            explanation: "The 3D optical sensors and lasers map the precise topography of the udder to safely and accurately guide the robotic arm to attach the teat cups.",
            difficulty: "Medium"
        },
        {
            question: "Why is a feed trough integrated directly into the robotic milking stall?",
            options: ["To keep the cow stationary by physically blocking her", "To incentivize voluntary entry and keep the cow calm", "To weigh the feed consumption for the farm ledger", "To force the cow to eat faster"],
            correct: 1,
            explanation: "Robotic milking relies on 'voluntary traffic'. Providing a customized feed ration at the trough incentivizes cows to visit the robot on their own schedule and keeps them relaxed during the process.",
            difficulty: "Easy"
        },
        {
            question: "What crucial role does the receiver jar play in the milking vacuum system?",
            options: ["It permanently stores the milk until the truck arrives", "It separates air from the milk and stabilizes the vacuum", "It pasteurizes the milk using heat", "It washes and sterilizes the teat cups"],
            correct: 1,
            explanation: "The receiver jar temporarily collects milk coming from the cow, allowing air to separate out. This is critical to maintain a stable, continuous vacuum before the milk is pumped to the bulk cooling tank.",
            difficulty: "Hard"
        }
    ];

    let t = 0;
    function animate(time, speed, meshes) {
        t += 0.02 * speed;
        
        // Base rotation (Swinging the arm in and out)
        baseMesh.rotation.y = Math.sin(t * 0.5) * 0.5 - Math.PI/4;
        
        // Primary arm angle
        arm1Mesh.rotation.x = Math.sin(t * 0.7) * 0.3 + 0.5;
        arm1Mesh.rotation.z = Math.cos(t * 0.4) * 0.2;
        
        // Secondary arm reaches under
        arm2Mesh.rotation.x = -Math.sin(t * 0.7) * 0.5 - 1.2;
        
        // Head stabilization (keeping it relatively flat pointing up)
        headGroup.rotation.x = -arm1Mesh.rotation.x - arm2Mesh.rotation.x;
        headGroup.rotation.y = Math.sin(t * 1.5) * 0.1;

        // Sensor scanning glow and laser beams
        sensorMesh.material.emissiveIntensity = 1.5 + Math.sin(t * 5) * 1.0;
        
        beam1.scale.set(1, 1 + Math.sin(t * 8) * 0.2, 1);
        beam1.material.opacity = 0.3 + Math.sin(t * 8) * 0.2;
        
        beam2.scale.set(1, 1 + Math.cos(t * 8) * 0.2, 1);
        beam2.material.opacity = 0.3 + Math.cos(t * 8) * 0.2;

        // Milk flow pulsing in the receiver jar
        milkFluidMesh.scale.y = 1 + Math.sin(t * 3) * 0.05;
        milkFluidMesh.material.emissiveIntensity = 0.6 + Math.sin(t * 6) * 0.4;
        
        // Teat cups slight jiggle (simulating vacuum pulsation)
        cups.forEach((cup, idx) => {
            cup.position.y = 0.2 + Math.sin(t * 10 + idx) * 0.02;
        });
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
export function createRoboticMilkingMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
