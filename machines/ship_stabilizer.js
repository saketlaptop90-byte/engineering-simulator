export function createShipStabilizer(THREE) {
    const machine = new THREE.Group();

    // 1. Hull Mounting Box
    const hullBoxGeom = new THREE.BoxGeometry(4, 2.5, 3);
    const hullBoxMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.5 });
    const hullBox = new THREE.Mesh(hullBoxGeom, hullBoxMat);
    hullBox.name = 'Hull Mounting Box';
    hullBox.position.set(-2, 0, 0);
    machine.add(hullBox);

    // 2. Main Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2 });
    const mainShaft = new THREE.Mesh(shaftGeom, shaftMat);
    mainShaft.name = 'Main Shaft';
    mainShaft.rotation.z = Math.PI / 2;
    mainShaft.position.set(1.5, 0, 0);
    machine.add(mainShaft);

    // 3. Hydraulic Rotary Actuator
    const actuatorGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const actuatorMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.5, roughness: 0.4 });
    const actuator = new THREE.Mesh(actuatorGeom, actuatorMat);
    actuator.name = 'Hydraulic Rotary Actuator';
    actuator.rotation.x = Math.PI / 2;
    actuator.position.set(-0.5, 0, 0);
    machine.add(actuator);

    // 4. Power Unit
    const powerUnitGeom = new THREE.BoxGeometry(1.5, 1.2, 1.5);
    const powerUnitMat = new THREE.MeshStandardMaterial({ color: 0x2255aa, metalness: 0.3, roughness: 0.7 });
    const powerUnit = new THREE.Mesh(powerUnitGeom, powerUnitMat);
    powerUnit.name = 'Power Unit';
    powerUnit.position.set(-2.5, -0.65, -0.5);
    machine.add(powerUnit);

    // 5. Accumulator
    const accumulatorGeom = new THREE.CapsuleGeometry(0.3, 0.8, 16, 16);
    const accumulatorMat = new THREE.MeshStandardMaterial({ color: 0xeeaa11, metalness: 0.6, roughness: 0.3 });
    const accumulator = new THREE.Mesh(accumulatorGeom, accumulatorMat);
    accumulator.name = 'Accumulator';
    accumulator.position.set(-1.2, 1, 0.8);
    machine.add(accumulator);

    // 6. Gyro Sensor
    const gyroGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16);
    const gyroMat = new THREE.MeshStandardMaterial({ color: 0x11bb44, metalness: 0.4, roughness: 0.6 });
    const gyroSensor = new THREE.Mesh(gyroGeom, gyroMat);
    gyroSensor.name = 'Gyro Sensor';
    gyroSensor.position.set(-3.2, 1, -1);
    machine.add(gyroSensor);

    // 7. Control Panel
    const panelGeom = new THREE.BoxGeometry(0.3, 1.5, 1.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.8 });
    const controlPanel = new THREE.Mesh(panelGeom, panelMat);
    controlPanel.name = 'Control Panel';
    controlPanel.position.set(-3.8, 0, 0);
    machine.add(controlPanel);

    // 8. Feedback Linkage
    const linkageGeom = new THREE.BoxGeometry(1.2, 0.1, 0.1);
    const linkageMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.3 });
    const linkage = new THREE.Mesh(linkageGeom, linkageMat);
    linkage.name = 'Feedback Linkage';
    linkage.position.set(-1.5, 0.6, 0);
    machine.add(linkage);

    // Fin Assembly Group (rotates with main shaft)
    const finAssembly = new THREE.Group();
    finAssembly.position.set(3, 0, 0);
    machine.add(finAssembly);

    // 9. Fin Blade
    const finGeom = new THREE.BoxGeometry(4, 0.3, 2.5);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x114466, metalness: 0.3, roughness: 0.5 });
    const finBlade = new THREE.Mesh(finGeom, finMat);
    finBlade.name = 'Fin Blade';
    finBlade.position.set(2, 0, 0);
    finAssembly.add(finBlade);

    // Flap Pivot
    const flapPivot = new THREE.Group();
    flapPivot.position.set(2, 0, 1.25);
    finAssembly.add(flapPivot);

    // 10. Tail Flap
    const flapGeom = new THREE.BoxGeometry(4, 0.15, 0.8);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0x003355, metalness: 0.3, roughness: 0.5 });
    const tailFlap = new THREE.Mesh(flapGeom, flapMat);
    tailFlap.name = 'Tail Flap';
    tailFlap.position.set(0, 0, 0.4);
    flapPivot.add(tailFlap);

    // Internal rotating parts for visual
    const gyroRotorGeom = new THREE.TorusGeometry(0.15, 0.05, 8, 24);
    const gyroRotorMat = new THREE.MeshStandardMaterial({ color: 0xddaa22 });
    const gyroRotor = new THREE.Mesh(gyroRotorGeom, gyroRotorMat);
    gyroSensor.add(gyroRotor);

    machine.update = function(time) {
        // Simulate gyro spinning
        gyroRotor.rotation.y = time * 8;
        gyroRotor.rotation.x = Math.sin(time * 2) * 0.2;

        // Roll phase
        const rollPhase = time * 1.5;
        
        // Counteract roll (tilt fin opposite to the imaginary roll angle)
        const finAngle = Math.sin(rollPhase) * 0.43;
        finAssembly.rotation.x = finAngle;

        // Flap tilts relative to fin to create camber (higher lift)
        flapPivot.rotation.x = finAngle * 0.8;

        // Linkage moves slightly to show feedback
        linkage.position.y = 0.6 + finAngle * 0.2;
        linkage.rotation.x = finAngle * 0.1;
    };

    machine.quiz = [
        {
            question: "What is the primary purpose of an active fin stabilizer on a ship?",
            options: [
                "To counteract ship roll",
                "To increase ship speed",
                "To reduce aerodynamic drag",
                "To counteract ship pitch"
            ],
            answer: "To counteract ship roll"
        },
        {
            question: "Which component detects the roll motion of the ship to send signals to the control unit?",
            options: [
                "Gyro Sensor",
                "Accumulator",
                "Tail Flap",
                "Main Shaft"
            ],
            answer: "Gyro Sensor"
        },
        {
            question: "What provides the high-pressure fluid required to rapidly move the stabilizer fins?",
            options: [
                "Power Unit",
                "Feedback Linkage",
                "Hull Mounting Box",
                "Fin Blade"
            ],
            answer: "Power Unit"
        },
        {
            question: "What is the function of the Accumulator in the hydraulic system?",
            options: [
                "To store hydraulic energy and dampen pressure fluctuations",
                "To measure the speed of the ship",
                "To cool down the hydraulic fluid",
                "To control the ship's rudder"
            ],
            answer: "To store hydraulic energy and dampen pressure fluctuations"
        },
        {
            question: "How does the Tail Flap enhance the performance of the stabilizer?",
            options: [
                "It creates a higher lift coefficient by changing the fin's camber",
                "It reduces the weight of the fin",
                "It protects the main fin from debris",
                "It stores additional fuel for the ship"
            ],
            answer: "It creates a higher lift coefficient by changing the fin's camber"
        },
        {
            question: "What role does the Hydraulic Rotary Actuator play in the system?",
            options: [
                "It rotates the main shaft to tilt the fin blade",
                "It powers the ship's main propellers",
                "It stabilizes the ship's internal temperature",
                "It houses the electronic control boards"
            ],
            answer: "It rotates the main shaft to tilt the fin blade"
        }
    ];

    return machine;
}
