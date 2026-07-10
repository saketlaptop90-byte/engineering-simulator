export function createHexapodWalker(THREE) {
    const group = new THREE.Group();

    const parts = [
        { id: "main_chassis", name: "Main Chassis", description: "The central body frame of the hexapod, providing structural support for all other components." },
        { id: "microcontroller", name: "Microcontroller", description: "The brain of the hexapod, processing sensor data and controlling leg movements." },
        { id: "battery", name: "Battery Pack", description: "Supplies power to the servos, microcontroller, and sensors." },
        { id: "coxa_joints", name: "Coxa Joints (Hips)", description: "The first joint of each leg, providing horizontal forward and backward movement." },
        { id: "femur_linkages", name: "Femur Linkages (Thighs)", description: "The middle segment of the leg, responsible for raising and lowering the leg." },
        { id: "tibia_linkages", name: "Tibia Linkages (Calves)", description: "The lower segment of the leg, extending to the ground for walking." },
        { id: "foot_pads", name: "Foot Pads", description: "Rubberized tips at the end of the tibia for grip and shock absorption." },
        { id: "ultrasonic_sensor", name: "Ultrasonic Sensor", description: "Provides obstacle detection and distance measurement for autonomous navigation." },
        { id: "power_distribution_board", name: "Power Distribution Board", description: "Regulates and distributes power from the battery to all electronic components." },
        { id: "wiring_harness", name: "Wiring Harness", description: "A structured collection of cables connecting the electronics, sensors, and servos." }
    ];

    const quizQuestions = [
        {
            question: "What is the primary function of the coxa joints in a hexapod?",
            options: ["Vertical lifting", "Horizontal forward and backward movement", "Power distribution", "Sensory input"],
            answer: 1,
            explanation: "The coxa is the hip joint, typically attached to the chassis, providing the horizontal swing (forward and backward) of the leg."
        },
        {
            question: "Which component is responsible for processing sensor data and coordinating the leg servos?",
            options: ["Power Distribution Board", "Ultrasonic Sensor", "Battery Pack", "Microcontroller"],
            answer: 3,
            explanation: "The microcontroller acts as the brain, executing algorithms to coordinate the complex movements of the multiple legs based on sensor data."
        },
        {
            question: "In a typical hexapod walking gait (like the tripod gait), how many legs are on the ground at any given time?",
            options: ["2", "3", "4", "6"],
            answer: 1,
            explanation: "In a standard tripod gait, three legs (a triangle formed by the front and back legs on one side and the middle leg on the other) are on the ground while the other three move."
        },
        {
            question: "What role does the femur linkage play in the leg mechanism?",
            options: ["Ground contact and grip", "Horizontal swinging", "Raising and lowering the leg", "Detecting obstacles"],
            answer: 2,
            explanation: "The femur (thigh) linkage is primarily responsible for lifting the leg off the ground and pushing it down, providing vertical clearance and lift."
        },
        {
            question: "Why are rubberized foot pads commonly used on the tibia linkages?",
            options: ["To increase aesthetic appeal", "To improve grip and provide shock absorption", "To process tactile data", "To conduct electricity"],
            answer: 1,
            explanation: "Rubberized foot pads increase friction with the walking surface, preventing slipping and helping absorb the impact of the steps."
        },
        {
            question: "What is the purpose of the Power Distribution Board (PDB)?",
            options: ["To compute inverse kinematics", "To detect objects using sound waves", "To regulate and distribute electrical power safely", "To provide structural rigidity"],
            answer: 2,
            explanation: "The PDB takes power from the battery and distributes it safely to the microcontroller, sensors, and multiple high-current servos, often providing necessary voltage regulation."
        }
    ];

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const electronicsMat = new THREE.MeshStandardMaterial({ color: 0x008800, roughness: 0.7 });
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x1111ee, metalness: 0.3, roughness: 0.6 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.7, roughness: 0.3 });
    const footMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.2 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.8 });

    // 1. Main Chassis
    const chassisGeo = new THREE.CylinderGeometry(2, 2, 0.5, 6); // Hexagonal body
    const mainChassis = new THREE.Mesh(chassisGeo, chassisMat);
    mainChassis.position.y = 2;
    group.add(mainChassis);

    // 2. Microcontroller
    const mcuGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
    const mcu = new THREE.Mesh(mcuGeo, electronicsMat);
    mcu.position.set(0, 0.35, -0.5);
    mainChassis.add(mcu);

    // 3. Battery Pack
    const batteryGeo = new THREE.BoxGeometry(1.5, 0.4, 1.0);
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(0, -0.45, 0);
    mainChassis.add(battery);

    // 9. Power Distribution Board
    const pdbGeo = new THREE.BoxGeometry(1.0, 0.1, 1.0);
    const pdb = new THREE.Mesh(pdbGeo, electronicsMat);
    pdb.position.set(0, 0.3, 0.8);
    mainChassis.add(pdb);

    // 10. Wiring Harness (simplified representation)
    const wireGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 20);
    const wiring = new THREE.Mesh(wireGeo, wireMat);
    wiring.rotation.x = Math.PI / 2;
    wiring.position.set(0, 0.15, 0);
    mainChassis.add(wiring);

    // 8. Ultrasonic Sensor
    const sensorGroup = new THREE.Group();
    const sensorBaseGeo = new THREE.BoxGeometry(0.8, 0.3, 0.2);
    const sensorBase = new THREE.Mesh(sensorBaseGeo, electronicsMat);
    const eyeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const leftEye = new THREE.Mesh(eyeGeo, sensorMat);
    leftEye.rotation.x = Math.PI / 2;
    leftEye.position.set(-0.2, 0, 0.1);
    const rightEye = new THREE.Mesh(eyeGeo, sensorMat);
    rightEye.rotation.x = Math.PI / 2;
    rightEye.position.set(0.2, 0, 0.1);
    sensorGroup.add(sensorBase, leftEye, rightEye);
    sensorGroup.position.set(0, 0.2, 1.8);
    mainChassis.add(sensorGroup);

    // Legs
    const numLegs = 6;
    const legGroups = []; 
    
    // Groups for logical parts
    const coxaGroup = new THREE.Group();
    const femurGroup = new THREE.Group();
    const tibiaGroup = new THREE.Group();
    const footGroup = new THREE.Group();
    
    // Attach these so they don't get garbage collected if accessed later by parts system
    group.add(coxaGroup, femurGroup, tibiaGroup, footGroup);
    coxaGroup.visible = false; 
    femurGroup.visible = false;
    tibiaGroup.visible = false;
    footGroup.visible = false;

    for (let i = 0; i < numLegs; i++) {
        const angle = (i * Math.PI * 2) / numLegs;
        
        // Leg container
        const leg = new THREE.Group();
        
        // 4. Coxa Joint
        const coxaGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
        const coxa = new THREE.Mesh(coxaGeo, jointMat);
        coxa.rotation.x = Math.PI / 2;
        
        // Position coxa on the edge of the hex chassis
        const radius = 1.9;
        const coxaPivot = new THREE.Group();
        coxaPivot.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        coxaPivot.rotation.y = -angle; 
        
        coxaPivot.add(coxa);
        
        // 5. Femur Linkage
        const femurGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const femur = new THREE.Mesh(femurGeo, boneMat);
        femur.position.set(0, 0.5, 0.2);
        
        const femurPivot = new THREE.Group();
        femurPivot.position.set(0, 0, 0.2);
        femurPivot.add(femur);
        femurPivot.rotation.x = Math.PI / 4; 

        // 6. Tibia Linkage
        const tibiaGeo = new THREE.BoxGeometry(0.15, 2.0, 0.15);
        const tibia = new THREE.Mesh(tibiaGeo, boneMat);
        tibia.position.set(0, -0.8, 0);

        const tibiaPivot = new THREE.Group();
        tibiaPivot.position.set(0, 1.2, 0.2); 
        tibiaPivot.add(tibia);
        tibiaPivot.rotation.x = -Math.PI / 2; 

        // 7. Foot Pad
        const footGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.position.set(0, -1.0, 0);
        tibia.add(foot);

        femur.add(tibiaPivot);
        coxaPivot.add(femurPivot);
        leg.add(coxaPivot);
        
        mainChassis.add(leg);
        
        legGroups.push({
            coxaPivot,
            femurPivot,
            tibiaPivot,
        });
    }

    let walkPhase = 0;

    function update(time) {
        walkPhase = time * 3; 

        legGroups.forEach((leg, i) => {
            const isTripod1 = i % 2 === 0;
            const phaseOffset = isTripod1 ? 0 : Math.PI;
            const legPhase = walkPhase + phaseOffset;

            // Horizontal swing (Coxa)
            const swingAmplitude = 0.3;
            leg.coxaPivot.rotation.y = Math.sin(legPhase) * swingAmplitude;

            // Vertical lift
            const liftPhase = Math.sin(legPhase);
            const isLifting = liftPhase > 0;
            const liftAmplitude = 0.4;
            
            if (isLifting) {
                leg.femurPivot.rotation.x = (Math.PI / 4) - (liftPhase * liftAmplitude);
                leg.tibiaPivot.rotation.x = (-Math.PI / 2) + (liftPhase * liftAmplitude * 0.5);
            } else {
                leg.femurPivot.rotation.x = Math.PI / 4;
                leg.tibiaPivot.rotation.x = -Math.PI / 2;
            }
        });
        
        mainChassis.position.y = 2 + Math.abs(Math.sin(walkPhase * 2)) * 0.1;
    }

    return {
        group,
        update,
        parts,
        quizQuestions
    };
}
