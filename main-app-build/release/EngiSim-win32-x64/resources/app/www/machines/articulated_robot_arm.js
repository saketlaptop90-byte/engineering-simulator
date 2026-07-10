import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowRedLaser = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);

    parts.push({
        name: "Mounting Base",
        description: "The heavy foundation of the robot arm.",
        material: "Dark Steel",
        function: "Anchors the entire robotic system to the floor or work surface.",
        assemblyOrder: 1,
        connections: ["Waist Joint"],
        failureEffect: "Total system collapse or severe inaccuracy.",
        cascadeFailures: ["Structural damage to all components"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Waist (Axis 1)
    const waistGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 32);
    const waistMesh = new THREE.Mesh(waistGeo, steel);
    waistMesh.position.set(0, 1, 0);
    group.add(waistMesh);
    
    parts.push({
        name: "Waist (Axis 1)",
        description: "The primary rotational joint.",
        material: "Steel",
        function: "Provides 360-degree rotation for the entire upper arm assembly.",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Shoulder Joint"],
        failureEffect: "Inability to rotate the arm horizontally.",
        cascadeFailures: ["Collision with surrounding equipment"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 3. Shoulder (Axis 2)
    const shoulderGeo = new THREE.SphereGeometry(1, 32, 32);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, chrome);
    shoulderMesh.position.set(0, 2, 0);
    group.add(shoulderMesh);

    // Glowing Servo Indicator at Shoulder
    const servoIndGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 100);
    const servoIndMesh = new THREE.Mesh(servoIndGeo, glowBlue);
    servoIndMesh.rotation.x = Math.PI / 2;
    shoulderMesh.add(servoIndMesh);

    parts.push({
        name: "Shoulder (Axis 2)",
        description: "The main lifting joint of the arm.",
        material: "Chrome / Servos",
        function: "Controls the elevation of the entire arm structure.",
        assemblyOrder: 3,
        connections: ["Waist Joint", "Upper Arm"],
        failureEffect: "Arm drops due to gravity, potential load drop.",
        cascadeFailures: ["Damage to payload and base"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -3 }
    });

    // 4. Upper Arm Link
    const upperArmGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, aluminum);
    upperArmMesh.position.set(0, 4, 0);
    group.add(upperArmMesh);

    parts.push({
        name: "Upper Arm Link",
        description: "The longest structural segment of the arm.",
        material: "Aluminum",
        function: "Provides reach and structural support between shoulder and elbow.",
        assemblyOrder: 4,
        connections: ["Shoulder Joint", "Elbow Joint"],
        failureEffect: "Bending or snapping under heavy loads.",
        cascadeFailures: ["Loss of control over lower arm assembly"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: -4, y: 4, z: 0 }
    });

    // 5. Elbow (Axis 3)
    const elbowGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const elbowMesh = new THREE.Mesh(elbowGeo, chrome);
    elbowMesh.position.set(0, 6, 0);
    group.add(elbowMesh);

    // Glowing Indicator at Elbow
    const elbowIndGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 100);
    const elbowIndMesh = new THREE.Mesh(elbowIndGeo, glowOrange);
    elbowIndMesh.rotation.x = Math.PI / 2;
    elbowMesh.add(elbowIndMesh);

    parts.push({
        name: "Elbow (Axis 3)",
        description: "The secondary lifting joint.",
        material: "Chrome / Servos",
        function: "Controls the angle of the forearm relative to the upper arm.",
        assemblyOrder: 5,
        connections: ["Upper Arm Link", "Forearm Link"],
        failureEffect: "Loss of reach control, unpredictable forearm movement.",
        cascadeFailures: ["Wrist joint stress overload"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 4, y: 6, z: 0 }
    });

    // 6. Forearm Link & Wrist (Axes 4,5,6)
    const forearmGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const forearmMesh = new THREE.Mesh(forearmGeo, steel);
    forearmMesh.position.set(0, 7.5, 0);
    group.add(forearmMesh);

    const wristGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const wristMesh = new THREE.Mesh(wristGeo, darkSteel);
    wristMesh.position.set(0, 9, 0);
    group.add(wristMesh);

    parts.push({
        name: "Wrist Assembly (Axes 4,5,6)",
        description: "The complex joint providing roll, pitch, and yaw.",
        material: "Steel / Dark Steel",
        function: "Provides precise orientation control for the end-effector.",
        assemblyOrder: 6,
        connections: ["Forearm Link", "End-Effector"],
        failureEffect: "Loss of precise tool orientation.",
        cascadeFailures: ["Damaged workpieces"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 }
    });

    // 7. End-Effector (Laser Cutter)
    const endEffGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
    const endEffMesh = new THREE.Mesh(endEffGeo, copper);
    endEffMesh.position.set(0, 9.6, 0);
    endEffMesh.rotation.x = Math.PI;
    group.add(endEffMesh);

    // Laser Beam
    const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
    const laserMesh = new THREE.Mesh(laserGeo, glowRedLaser);
    laserMesh.position.set(0, 12, 0); // Originating from tip
    group.add(laserMesh);

    parts.push({
        name: "Laser End-Effector",
        description: "The active tool attached to the robot's wrist.",
        material: "Copper / Laser Diode",
        function: "Performs the primary task, such as cutting or welding.",
        assemblyOrder: 7,
        connections: ["Wrist Assembly"],
        failureEffect: "Inability to perform assigned tasks.",
        cascadeFailures: ["Laser misfire, potential safety hazard"],
        originalPosition: { x: 0, y: 9.6, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 }
    });

    const meshes = {
        base: baseMesh,
        waist: waistMesh,
        shoulder: shoulderMesh,
        upperArm: upperArmMesh,
        elbow: elbowMesh,
        forearm: forearmMesh,
        wrist: wristMesh,
        endEffector: endEffMesh,
        laser: laserMesh
    };

    const description = "A 6-axis articulated robot arm featuring advanced inverse kinematics simulation, high-torque servos, and a precision laser end-effector. Highly versatile for automated manufacturing tasks.";

    const quizQuestions = [
        {
            question: "Which joint is primarily responsible for the 360-degree horizontal rotation of the entire robot arm?",
            options: ["Shoulder (Axis 2)", "Elbow (Axis 3)", "Waist (Axis 1)", "Wrist Assembly"],
            correct: 2,
            explanation: "The Waist (Axis 1) connects the mounting base to the rest of the arm and provides the primary sweeping rotation.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the wrist assembly (Axes 4, 5, and 6) in a 6-axis robot?",
            options: ["To lift heavy payloads", "To provide reach and extension", "To anchor the robot to the floor", "To control the orientation (roll, pitch, yaw) of the end-effector"],
            correct: 3,
            explanation: "While the base, shoulder, and elbow position the tool in 3D space (x, y, z), the wrist axes adjust the precise angle and orientation of the tool.",
            difficulty: "medium"
        },
        {
            question: "In the event of a total failure of the Shoulder (Axis 2) servo without a holding brake, what is the most likely immediate cascade failure?",
            options: ["The laser will misfire.", "The arm drops due to gravity, potentially damaging the payload and base.", "The wrist assembly will detach.", "The waist will spin uncontrollably."],
            correct: 1,
            explanation: "Axis 2 supports the majority of the arm's weight and leverage. Without power or brakes, gravity causes the arm to collapse downward.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Simple procedural animation simulating an operational loop
        const t = time * speed;
        
        // Waist rotation
        meshes.waist.rotation.y = Math.sin(t * 0.5) * Math.PI / 2;
        
        // Shoulder rotation (pitch)
        const shoulderAngle = Math.sin(t * 0.8) * 0.5;
        meshes.shoulder.rotation.z = shoulderAngle;
        
        // Update positions based on hierarchy (simplified FK simulation)
        // Upper arm follows shoulder
        meshes.upperArm.position.x = Math.sin(shoulderAngle) * 2;
        meshes.upperArm.position.y = 2 + Math.cos(shoulderAngle) * 2;
        meshes.upperArm.rotation.z = shoulderAngle;

        // Elbow follows upper arm
        meshes.elbow.position.x = Math.sin(shoulderAngle) * 4;
        meshes.elbow.position.y = 2 + Math.cos(shoulderAngle) * 4;
        
        // Elbow joint bending
        const elbowAngle = Math.cos(t * 0.8) * 0.8;
        meshes.elbow.rotation.z = shoulderAngle + elbowAngle;

        // Forearm follows elbow
        meshes.forearm.position.x = meshes.elbow.position.x + Math.sin(shoulderAngle + elbowAngle) * 1.5;
        meshes.forearm.position.y = meshes.elbow.position.y + Math.cos(shoulderAngle + elbowAngle) * 1.5;
        meshes.forearm.rotation.z = shoulderAngle + elbowAngle;

        // Wrist follows forearm
        meshes.wrist.position.x = meshes.elbow.position.x + Math.sin(shoulderAngle + elbowAngle) * 3;
        meshes.wrist.position.y = meshes.elbow.position.y + Math.cos(shoulderAngle + elbowAngle) * 3;
        meshes.wrist.rotation.z = shoulderAngle + elbowAngle + Math.sin(t * 2) * 0.5; // Wrist action

        // End-effector follows wrist
        meshes.endEffector.position.x = meshes.wrist.position.x + Math.sin(meshes.wrist.rotation.z) * 0.6;
        meshes.endEffector.position.y = meshes.wrist.position.y + Math.cos(meshes.wrist.rotation.z) * 0.6;
        meshes.endEffector.rotation.z = meshes.wrist.rotation.z + Math.PI;

        // Laser pulsing
        meshes.laser.position.x = meshes.wrist.position.x + Math.sin(meshes.wrist.rotation.z) * 3;
        meshes.laser.position.y = meshes.wrist.position.y + Math.cos(meshes.wrist.rotation.z) * 3;
        meshes.laser.rotation.z = meshes.wrist.rotation.z;
        meshes.laser.material.opacity = (Math.sin(t * 10) * 0.5 + 0.5) * 0.8;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArticulatedRobotArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
