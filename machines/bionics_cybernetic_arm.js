import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 1.2,
        metalness: 0.8,
        roughness: 0.2
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.7,
        wireframe: true // Simulating a high-tech mesh/carbon pattern
    });

    // 1. Shoulder Socket (Base)
    const shoulderGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const shoulder = new THREE.Mesh(shoulderGeo, darkSteel);
    shoulder.position.set(0, 0, 0);
    group.add(shoulder);
    parts.push({
        name: 'Shoulder Socket Matrix',
        description: 'Multi-axis titanium joint connecting to the host nervous system.',
        material: 'Dark Steel / Titanium',
        function: 'Anchor point and primary neural interface.',
        assemblyOrder: 1,
        connections: ['Upper Arm Actuator', 'Neural Port'],
        failureEffect: 'Complete loss of arm mobility.',
        cascadeFailures: ['Bionic rejection syndrome'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: shoulder
    });

    // 2. Neural Interface Port
    const portGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const port = new THREE.Mesh(portGeo, neonBlue);
    port.rotation.x = Math.PI / 2;
    port.position.set(0, 0, 1.5);
    shoulder.add(port);
    parts.push({
        name: 'Neural Uplink Port',
        description: 'Direct neural interface transmitting motor cortex signals to the limb.',
        material: 'Synthetic Sapphire',
        function: 'Signal transduction.',
        assemblyOrder: 2,
        connections: ['Shoulder Socket Matrix'],
        failureEffect: 'Delayed reaction time or spontaneous phantom movements.',
        cascadeFailures: ['Sensory feedback overload'],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: port
    });

    // 3. Upper Arm Core Actuator
    const upperArmGeo = new THREE.CylinderGeometry(0.8, 0.6, 4, 32);
    const upperArm = new THREE.Mesh(upperArmGeo, carbonFiber);
    upperArm.position.set(0, -2.5, 0);
    shoulder.add(upperArm);
    parts.push({
        name: 'Upper Arm Linear Actuator',
        description: 'Carbon-nanotube reinforced synthetic muscle housing.',
        material: 'Carbon Fiber',
        function: 'Provides primary lifting strength (up to 5 tons).',
        assemblyOrder: 3,
        connections: ['Shoulder Socket Matrix', 'Elbow Joint'],
        failureEffect: 'Reduced lifting capacity.',
        cascadeFailures: ['Hydraulic pressure blowout'],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: upperArm
    });

    // 4. Liquid Cooling Pipes
    const pipeGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,2,0), new THREE.Vector3(0,-2,0)), 20, 0.1, 8, false);
    const pipe1 = new THREE.Mesh(pipeGeo, neonBlue);
    pipe1.position.set(0.9, 0, 0);
    upperArm.add(pipe1);
    const pipe2 = new THREE.Mesh(pipeGeo, neonBlue);
    pipe2.position.set(-0.9, 0, 0);
    upperArm.add(pipe2);
    parts.push({
        name: 'Sub-dermal Coolant Lines',
        description: 'Cryo-fluid circulation system to prevent actuator overheating during heavy loads.',
        material: 'Reinforced Glass/Neon',
        function: 'Thermal regulation.',
        assemblyOrder: 4,
        connections: ['Upper Arm Linear Actuator'],
        failureEffect: 'Overheating leading to automatic limb shutdown.',
        cascadeFailures: ['Actuator melting'],
        originalPosition: { x: 0.9, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 },
        mesh: pipe1
    });

    // 5. Elbow Joint
    const elbowGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, chrome);
    elbow.position.set(0, -2.5, 0);
    upperArm.add(elbow);
    parts.push({
        name: 'Chrome Gyroscopic Elbow',
        description: 'High-torque gyroscopic joint allowing 360-degree rotation.',
        material: 'Chrome',
        function: 'Articulation and rotation.',
        assemblyOrder: 5,
        connections: ['Upper Arm Linear Actuator', 'Forearm Assembly'],
        failureEffect: 'Joint lockup.',
        cascadeFailures: ['Gyroscopic misalignment'],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: -3, y: -2.5, z: 3 },
        mesh: elbow
    });

    // 6. Forearm Assembly
    const forearmGeo = new THREE.CylinderGeometry(0.7, 0.4, 3.5, 32);
    const forearm = new THREE.Mesh(forearmGeo, steel);
    forearm.position.set(0, -2.5, 0);
    elbow.add(forearm);
    parts.push({
        name: 'Forearm Myomer Bundle',
        description: 'Synthetic muscle fibers encased in a steel chassis.',
        material: 'Steel',
        function: 'Fine motor control and wrist articulation.',
        assemblyOrder: 6,
        connections: ['Chrome Gyroscopic Elbow', 'Wrist Connector'],
        failureEffect: 'Loss of fine motor skills.',
        cascadeFailures: ['Finger actuator desynchronization'],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -3 },
        mesh: forearm
    });

    // 7. Power Core (Forearm Embedded)
    const coreGeo = new THREE.OctahedronGeometry(0.4, 0);
    const core = new THREE.Mesh(coreGeo, neonRed);
    core.position.set(0, 0, 0.5);
    forearm.add(core);
    parts.push({
        name: 'Micro-Fusion Cell',
        description: 'Localized power generation unit for the limb.',
        material: 'Energy / Neon Red',
        function: 'Provides independent power, preventing drain on host metabolism.',
        assemblyOrder: 7,
        connections: ['Forearm Myomer Bundle'],
        failureEffect: 'Limb operates in low-power safe mode.',
        cascadeFailures: ['Core breach (critical)'],
        originalPosition: { x: 0, y: 0, z: 0.5 },
        explodedPosition: { x: 0, y: 0, z: 3 },
        mesh: core
    });
    
    // 8. Wrist
    const wristGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const wrist = new THREE.Mesh(wristGeo, darkSteel);
    wrist.position.set(0, -2, 0);
    forearm.add(wrist);
    parts.push({
        name: 'Multi-directional Wrist',
        description: 'Magnetic levitation joint for frictionless movement.',
        material: 'Dark Steel',
        function: 'Provides full 360-degree rotation of the hand.',
        assemblyOrder: 8,
        connections: ['Forearm Myomer Bundle', 'Cybernetic Hand'],
        failureEffect: 'Limited hand rotation.',
        cascadeFailures: ['Magnetic field collapse'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: wrist
    });

    // 9. Hand/Fingers
    const palmGeo = new THREE.BoxGeometry(1.2, 1.2, 0.4);
    const palm = new THREE.Mesh(palmGeo, chrome);
    palm.position.set(0, -1, 0);
    wrist.add(palm);
    
    // Fingers
    const fingerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    for (let i = 0; i < 4; i++) {
        const finger = new THREE.Mesh(fingerGeo, steel);
        finger.position.set(-0.4 + i*0.26, -1, 0);
        palm.add(finger);
    }
    const thumbGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
    const thumb = new THREE.Mesh(thumbGeo, steel);
    thumb.rotation.z = Math.PI / 4;
    thumb.position.set(0.7, -0.2, 0);
    palm.add(thumb);
    
    parts.push({
        name: 'Tactile Manipulators (Hand)',
        description: 'High-precision digits with built-in sub-molecular sensors.',
        material: 'Chrome / Steel',
        function: 'Grasping and microscopic tactile feedback.',
        assemblyOrder: 9,
        connections: ['Multi-directional Wrist'],
        failureEffect: 'Inability to grip objects.',
        cascadeFailures: ['Sensor array short-circuit'],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: palm
    });

    const description = "The Cybernetic Arm (Full Limb Augmentation) is a pinnacle of modern bionics, replacing biological limbs with a titanium-carbon fiber composite structure powered by a micro-fusion core. It features direct neural interfacing, liquid coolant systems, and gyroscopic joints capable of lifting up to 5 tons while maintaining the precision to thread a microscopic needle.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Sub-dermal Coolant Lines?",
            options: ["To provide lubrication for the joints", "To regulate temperature and prevent actuator overheating", "To supply blood to the host", "To conduct electrical signals from the brain"],
            correct: 1,
            explanation: "The Sub-dermal Coolant Lines circulate cryo-fluid to manage the massive heat generated by the high-torque actuators during heavy loads.",
            difficulty: "Medium"
        },
        {
            question: "Which component allows for frictionless movement of the hand?",
            options: ["Chrome Gyroscopic Elbow", "Multi-directional Wrist", "Upper Arm Linear Actuator", "Micro-Fusion Cell"],
            correct: 1,
            explanation: "The Multi-directional Wrist utilizes magnetic levitation technology to provide a completely frictionless, 360-degree range of motion.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Neural Uplink Port fails?",
            options: ["The arm explodes", "Immediate loss of power", "Delayed reaction time or phantom movements", "The arm continues to work perfectly on AI autopilot"],
            correct: 2,
            explanation: "Failure of the Neural Uplink Port disrupts the direct motor cortex signals, resulting in delayed reaction times, spontaneous movements (phantom movements), and sensory feedback overload.",
            difficulty: "Medium"
        },
        {
            question: "Where is the Micro-Fusion Cell located in this augmentation?",
            options: ["In the Shoulder Socket", "In the Hand", "In the Host's Chest", "Embedded in the Forearm Assembly"],
            correct: 3,
            explanation: "The Micro-Fusion Cell is a localized power generation unit embedded within the forearm, ensuring the limb doesn't drain the host's biological energy reserves.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the neural port slowly
        port.rotation.z = time * speed * 0.5;
        
        // Pulse the core
        const pulse = (Math.sin(time * speed * 2) + 1) / 2; // 0 to 1
        core.scale.set(1 + pulse * 0.2, 1 + pulse * 0.2, 1 + pulse * 0.2);
        neonRed.emissiveIntensity = 0.5 + pulse * 1.5;
        
        // Coolant pipes glow intensity pulsing
        neonBlue.emissiveIntensity = 0.8 + Math.cos(time * speed) * 0.7;

        // Slight natural swing in the arm if not exploded (simulating standby mode)
        shoulder.rotation.z = Math.sin(time * speed * 0.5) * 0.05;
        elbow.rotation.x = Math.sin(time * speed * 0.7) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCyberneticArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
