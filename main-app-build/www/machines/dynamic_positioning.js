export function createDynamicPositioning(THREE) {
    const group = new THREE.Group();

    // Part 1: Azimuth Thruster
    const azimuthGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const azimuthMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const azimuthThruster = new THREE.Mesh(azimuthGeometry, azimuthMaterial);
    azimuthThruster.position.set(0, -2, 2);
    azimuthThruster.userData.name = "Azimuth Thruster";
    group.add(azimuthThruster);

    // Part 2: Bow Thruster
    const bowThrusterGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const bowThrusterMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const bowThruster = new THREE.Mesh(bowThrusterGeom, bowThrusterMat);
    bowThruster.rotation.z = Math.PI / 2;
    bowThruster.position.set(0, -1, -3);
    bowThruster.userData.name = "Bow Thruster";
    group.add(bowThruster);

    // Part 3: Gyrocompass
    const gyroGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const gyroMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const gyrocompass = new THREE.Mesh(gyroGeom, gyroMat);
    gyrocompass.position.set(0, 1, 0);
    gyrocompass.userData.name = "Gyrocompass";
    group.add(gyrocompass);

    // Part 4: Anemometer
    const anemometerGeom = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const anemometerMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const anemometer = new THREE.Mesh(anemometerGeom, anemometerMat);
    anemometer.position.set(-1, 3, -1);
    anemometer.userData.name = "Anemometer";
    group.add(anemometer);

    // Part 5: DGPS Receiver
    const dgpsGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const dgpsMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const dgpsReceiver = new THREE.Mesh(dgpsGeom, dgpsMat);
    dgpsReceiver.position.set(1, 3, -1);
    dgpsReceiver.userData.name = "DGPS Receiver";
    group.add(dgpsReceiver);

    // Part 6: Reference Sensor
    const sensorGeom = new THREE.ConeGeometry(0.2, 0.5);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const referenceSensor = new THREE.Mesh(sensorGeom, sensorMat);
    referenceSensor.position.set(0, -1, 0);
    referenceSensor.userData.name = "Reference Sensor";
    group.add(referenceSensor);

    // Part 7: Controller Unit
    const controllerGeom = new THREE.BoxGeometry(1, 1.5, 0.5);
    const controllerMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const controllerUnit = new THREE.Mesh(controllerGeom, controllerMat);
    controllerUnit.position.set(0, 1, 2);
    controllerUnit.userData.name = "Controller Unit";
    group.add(controllerUnit);

    // Part 8: Power Management System
    const pmsGeom = new THREE.BoxGeometry(1.5, 1, 1);
    const pmsMat = new THREE.MeshStandardMaterial({ color: 0x884400 });
    const powerManagementSystem = new THREE.Mesh(pmsGeom, pmsMat);
    powerManagementSystem.position.set(-2, 0, 1);
    powerManagementSystem.userData.name = "Power Management System";
    group.add(powerManagementSystem);

    // Part 9: Drive Motor
    const motorGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
    const driveMotor = new THREE.Mesh(motorGeom, motorMat);
    driveMotor.position.set(0, -1.5, 2);
    driveMotor.userData.name = "Drive Motor";
    group.add(driveMotor);

    // Part 10: Pitch Mechanism
    const pitchGeom = new THREE.BoxGeometry(0.2, 0.2, 0.8);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0xff8844 });
    const pitchMechanism = new THREE.Mesh(pitchGeom, pitchMat);
    pitchMechanism.position.set(0, -2.5, 2);
    pitchMechanism.userData.name = "Pitch Mechanism";
    group.add(pitchMechanism);

    const questions = [
        {
            question: "What is the primary function of a Dynamic Positioning (DP) System?",
            options: [
                "To automatically maintain a ship's position and heading",
                "To increase the ship's maximum speed",
                "To reduce fuel consumption in open seas",
                "To filter drinking water for the crew"
            ],
            correctAnswer: 0
        },
        {
            question: "Which component measures the ship's heading?",
            options: [
                "Anemometer",
                "Gyrocompass",
                "DGPS Receiver",
                "Azimuth Thruster"
            ],
            correctAnswer: 1
        },
        {
            question: "What environmental force is measured by an Anemometer in a DP system?",
            options: [
                "Ocean currents",
                "Wave height",
                "Wind speed and direction",
                "Water depth"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the Power Management System (PMS) do in DP operations?",
            options: [
                "Coordinates crew shifts",
                "Ensures sufficient power is available for thrusters to prevent blackouts",
                "Manages the ship's cargo loading",
                "Controls the entertainment systems"
            ],
            correctAnswer: 1
        },
        {
            question: "Which thruster type can rotate 360 degrees to provide thrust in any direction?",
            options: [
                "Bow Thruster",
                "Tunnel Thruster",
                "Azimuth Thruster",
                "Fixed Propeller"
            ],
            correctAnswer: 2
        },
        {
            question: "Why does a DP system use multiple reference sensors (like DGPS and lasers)?",
            options: [
                "To calculate cargo weight",
                "For redundancy and improved position accuracy",
                "To communicate with other vessels",
                "To monitor engine temperature"
            ],
            correctAnswer: 1
        }
    ];

    let time = 0;
    const update = (delta) => {
        time += delta;
        // Animation showing thrusters rotating and adjusting pitch
        azimuthThruster.rotation.y = Math.sin(time * 0.5) * Math.PI;
        bowThruster.rotation.x = time * 2;
        anemometer.rotation.y = time * 3;
        pitchMechanism.rotation.z = Math.sin(time) * 0.2;
        driveMotor.rotation.y = time * 5;
    };

    return {
        model: group,
        update: update,
        questions: questions
    };
}
