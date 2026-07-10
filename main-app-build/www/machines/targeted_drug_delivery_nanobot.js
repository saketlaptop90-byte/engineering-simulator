export function createTargetedDrugDeliveryNanobot(THREE) {
    const group = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const payloadMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const propellerMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 });
    const injectorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7 });
    const powerMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const navMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    // 1. Main Capsule (Body)
    const bodyGeo = new THREE.CapsuleGeometry( 2, 6, 4, 16 );
    const mainCapsule = new THREE.Mesh(bodyGeo, bodyMat);
    mainCapsule.name = "Main Capsule";
    mainCapsule.userData.description = "The biocompatible outer hull protecting the internal components.";
    mainCapsule.rotation.z = Math.PI / 2;
    group.add(mainCapsule);

    // 2. Propeller Motor
    const motorGeo = new THREE.CylinderGeometry( 1, 1, 2, 16 );
    const propellerMotor = new THREE.Mesh(motorGeo, bodyMat);
    propellerMotor.name = "Propeller Motor";
    propellerMotor.userData.description = "Drives the propulsion system of the nanobot.";
    propellerMotor.position.set(-4, 0, 0);
    propellerMotor.rotation.z = Math.PI / 2;
    group.add(propellerMotor);

    // 3. Propeller Blade
    const bladeGeo = new THREE.BoxGeometry( 0.2, 4, 1 );
    const propellerBlade = new THREE.Mesh(bladeGeo, propellerMat);
    propellerBlade.name = "Propeller Blade";
    propellerBlade.userData.description = "Spins to propel the nanobot through the bloodstream.";
    propellerBlade.position.set(-5.1, 0, 0);
    group.add(propellerBlade);

    // 4. Payload Chamber
    const payloadGeo = new THREE.SphereGeometry( 1.5, 16, 16 );
    const payloadChamber = new THREE.Mesh(payloadGeo, payloadMat);
    payloadChamber.name = "Payload Chamber";
    payloadChamber.userData.description = "Contains the concentrated therapeutic drug.";
    payloadChamber.position.set(1, 0, 0);
    group.add(payloadChamber);

    // 5. Targeting Sensor
    const tSensorGeo = new THREE.ConeGeometry( 0.5, 1, 8 );
    const targetingSensor = new THREE.Mesh(tSensorGeo, sensorMat);
    targetingSensor.name = "Targeting Sensor";
    targetingSensor.userData.description = "Detects specific disease biomarkers on target cells.";
    targetingSensor.position.set(4, 1, 0);
    targetingSensor.rotation.z = -Math.PI / 2;
    group.add(targetingSensor);

    // 6. Chemical Sensor
    const cSensorGeo = new THREE.SphereGeometry( 0.4, 8, 8 );
    const chemicalSensor = new THREE.Mesh(cSensorGeo, sensorMat);
    chemicalSensor.name = "Chemical Sensor";
    chemicalSensor.userData.description = "Monitors local pH levels and chemical gradients.";
    chemicalSensor.position.set(4, -1, 0);
    group.add(chemicalSensor);

    // 7. Release Valve
    const valveGeo = new THREE.CylinderGeometry( 0.3, 0.3, 1, 8 );
    const releaseValve = new THREE.Mesh(valveGeo, bodyMat);
    releaseValve.name = "Release Valve";
    releaseValve.userData.description = "Regulates the flow of the drug from the payload chamber.";
    releaseValve.position.set(1.5, 1.8, 0);
    group.add(releaseValve);

    // 8. Micro-injector
    const injectorGeo = new THREE.CylinderGeometry( 0.1, 0.1, 2, 8 );
    const microInjector = new THREE.Mesh(injectorGeo, injectorMat);
    microInjector.name = "Micro-Injector";
    microInjector.userData.description = "Pierces target cell membranes for direct drug delivery.";
    microInjector.position.set(5, 0, 0);
    microInjector.rotation.z = Math.PI / 2;
    group.add(microInjector);

    // 9. Power Battery
    const powerGeo = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
    const powerBattery = new THREE.Mesh(powerGeo, powerMat);
    powerBattery.name = "Power Battery";
    powerBattery.userData.description = "Provides energy derived from blood glucose.";
    powerBattery.position.set(-1.5, 0, 0);
    group.add(powerBattery);

    // 10. Navigation Chip
    const navGeo = new THREE.BoxGeometry( 1, 1, 0.5 );
    const navigationChip = new THREE.Mesh(navGeo, navMat);
    navigationChip.name = "Navigation Chip";
    navigationChip.userData.description = "Processes sensor data to steer the nanobot.";
    navigationChip.position.set(0, 1.5, 0);
    group.add(navigationChip);

    // Animation variables
    let time = 0;

    group.update = function(delta) {
        time += delta;
        // Spin the propeller
        propellerBlade.rotation.x += delta * 15;
        
        // Pulse the targeting sensor
        const scale = 1 + Math.sin(time * 5) * 0.2;
        targetingSensor.scale.set(scale, scale, scale);

        // Injector extending and retracting
        microInjector.position.x = 4.5 + Math.sin(time * 3) * 0.5;

        // Bobbing motion for the whole bot
        group.position.y = Math.sin(time * 2) * 0.5;
        group.rotation.y = Math.sin(time * 1) * 0.1;
    };

    group.quiz = [
        {
            question: "What is the primary advantage of targeted drug delivery?",
            options: [
                "Reducing side effects by affecting only diseased cells",
                "Making the drug cheaper",
                "Increasing the size of the pill",
                "Allowing drugs to be taken with food"
            ],
            correctAnswer: 0
        },
        {
            question: "Which mechanism is often used by nanobots to identify target cells?",
            options: [
                "Echolocation",
                "Magnetic resonance",
                "Specific receptor-ligand binding",
                "Thermal expansion"
            ],
            correctAnswer: 2
        },
        {
            question: "How are drugs typically released from a nanocarrier at the target site?",
            options: [
                "Through a loud sound wave",
                "Triggered by environmental changes like pH or temperature",
                "By melting the entire body of the patient",
                "Through Bluetooth signals from a smartphone"
            ],
            correctAnswer: 1
        },
        {
            question: "What is a common material used to create biocompatible nanobots?",
            options: [
                "Lead",
                "Uranium",
                "DNA or biodegradable polymers",
                "Asbestos"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the term 'EPR effect' stand for in nanomedicine?",
            options: [
                "Enhanced Permeability and Retention",
                "Extra Power Requirement",
                "Electromagnetic Pulse Radiation",
                "Extended Payload Release"
            ],
            correctAnswer: 0
        },
        {
            question: "What is a major challenge in designing nanobots for the bloodstream?",
            options: [
                "Avoiding the immune system",
                "Making them heavy enough to sink",
                "Keeping them dry",
                "Preventing them from conducting electricity"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
