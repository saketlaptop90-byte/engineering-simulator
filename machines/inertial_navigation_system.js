export function createInertialNavigationSystem(THREE) {
    const machine = new THREE.Group();
    const parts = [];

    function addPart(mesh, name, description) {
        mesh.userData = { name, description };
        parts.push(mesh);
        machine.add(mesh);
        return mesh;
    }

    const gimbalGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const gimbalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.set(0, 0, 0);
    addPart(gimbal, "Gimbal platform", "A stable mounting platform that isolates the sensors from the vehicle's rotational movements.");

    const gyroGeoX = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const gyroMat = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.8, roughness: 0.2 });
    const gyroX = new THREE.Mesh(gyroGeoX, gyroMat);
    gyroX.rotation.y = Math.PI / 2;
    gyroX.position.set(1.5, 1, 0);
    addPart(gyroX, "Ring laser gyro X", "Measures angular velocity around the X axis using counter-propagating laser beams.");

    const gyroGeoY = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const gyroY = new THREE.Mesh(gyroGeoY, gyroMat);
    gyroY.rotation.x = Math.PI / 2;
    gyroY.position.set(0, 1, 0);
    addPart(gyroY, "Ring laser gyro Y", "Measures angular velocity around the Y axis.");

    const gyroGeoZ = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const gyroZ = new THREE.Mesh(gyroGeoZ, gyroMat);
    gyroZ.position.set(-1.5, 1, 0);
    addPart(gyroZ, "Ring laser gyro Z", "Measures angular velocity around the Z axis.");

    const accGeo = new THREE.BoxGeometry(0.4, 0.4, 0.8);
    const accMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.5, roughness: 0.5 });
    const accX = new THREE.Mesh(accGeo, accMat);
    accX.rotation.y = Math.PI / 2;
    accX.position.set(1, 0.5, 1.5);
    addPart(accX, "Accelerometer X", "Measures linear acceleration along the X axis.");

    const accY = new THREE.Mesh(accGeo, accMat);
    accY.rotation.x = Math.PI / 2;
    accY.position.set(0, 0.5, 1.5);
    addPart(accY, "Accelerometer Y", "Measures linear acceleration along the Y axis.");

    const accZ = new THREE.Mesh(accGeo, accMat);
    accZ.position.set(-1, 0.5, 1.5);
    addPart(accZ, "Accelerometer Z", "Measures linear acceleration along the Z axis.");

    const isoGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const isoMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const isolatorsGroup = new THREE.Group();
    const positions = [
        [-1.8, -0.5, -1.8], [1.8, -0.5, -1.8],
        [-1.8, -0.5, 1.8], [1.8, -0.5, 1.8]
    ];
    positions.forEach(pos => {
        const iso = new THREE.Mesh(isoGeo, isoMat);
        iso.position.set(...pos);
        isolatorsGroup.add(iso);
    });
    addPart(isolatorsGroup, "Vibration isolators", "Dampens vibrations and shocks to protect sensitive measurement instruments.");

    const cpuGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const cpu = new THREE.Mesh(cpuGeo, cpuMat);
    cpu.position.set(0, 0.3, -1);
    addPart(cpu, "Microprocessor", "Processes sensor data to compute position, velocity, and orientation continuously.");

    const tempGeo = new THREE.BoxGeometry(0.8, 0.4, 0.6);
    const tempMat = new THREE.MeshStandardMaterial({ color: 0xaa5500, metalness: 0.6, roughness: 0.4 });
    const tempController = new THREE.Mesh(tempGeo, tempMat);
    tempController.position.set(1.5, 0.4, -1);
    addPart(tempController, "Temperature controller", "Maintains a stable temperature for the gyros and accelerometers to prevent drift.");

    machine.userData.animate = function(time) {
        gimbal.rotation.x = Math.sin(time * 0.001) * 0.05;
        gimbal.rotation.z = Math.cos(time * 0.0012) * 0.05;
        gyroX.rotation.z = time * 0.005;
        gyroY.rotation.z = time * 0.005;
        gyroZ.rotation.z = time * 0.005;
    };

    const quiz = [
        {
            question: "What is the primary function of the Ring Laser Gyros in an INS?",
            options: [
                "To measure linear acceleration",
                "To measure angular velocity or rotation",
                "To cool the system",
                "To process navigation algorithms"
            ],
            answer: 1,
            explanation: "Ring laser gyros measure changes in angular velocity (rotation) using the Sagnac effect."
        },
        {
            question: "Why are vibration isolators necessary?",
            options: [
                "To prevent electrical short circuits",
                "To amplify sensor signals",
                "To protect sensitive sensors from vehicle vibrations and shocks",
                "To cool the microprocessor"
            ],
            answer: 2,
            explanation: "Vibration isolators dampen high-frequency vibrations that can degrade sensor accuracy or cause physical damage."
        },
        {
            question: "How many accelerometers are typically needed for full 3D linear motion tracking?",
            options: ["1", "2", "3", "4"],
            answer: 2,
            explanation: "Three accelerometers mounted orthogonally are required to measure acceleration in all three spatial dimensions (X, Y, Z)."
        },
        {
            question: "What is the role of the microprocessor in the INS?",
            options: [
                "It stores fuel",
                "It integrates sensor data over time to compute position and velocity",
                "It acts as a vibration dampener",
                "It generates the laser beams for the gyros"
            ],
            answer: 1,
            explanation: "The microprocessor uses dead reckoning algorithms to continuously integrate acceleration and rotation data to calculate current position, orientation, and velocity."
        },
        {
            question: "Why does an INS include a temperature controller?",
            options: [
                "To keep the pilot warm",
                "Sensors like gyros and accelerometers are sensitive to temperature changes, which can cause measurement drift",
                "To melt ice on the external sensors",
                "To power the laser beams"
            ],
            answer: 1,
            explanation: "Thermal variations can cause expansion and change the properties of the sensors, leading to errors (drift) in navigation data. The controller keeps the environment stable."
        },
        {
            question: "Which component acts as the foundational mount for the sensors, isolating them from outside rotation if active?",
            options: [
                "Vibration isolators",
                "Gimbal platform",
                "Temperature controller",
                "Microprocessor"
            ],
            answer: 1,
            explanation: "The gimbal platform provides a stable, sometimes actively leveled, base for the sensors to maintain a known orientation reference."
        }
    ];

    return {
        model: machine,
        parts: parts,
        quiz: quiz
    };
}
