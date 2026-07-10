export function createTidalTurbine(THREE) {
    const group = new THREE.Group();

    // Base Group (Non-rotating with yaw)
    const baseGroup = new THREE.Group();
    group.add(baseGroup);

    // 1. Monopile Foundation
    const foundationGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const foundationMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = -4;
    foundation.name = "Monopile Foundation";
    foundation.userData.description = "Secures the turbine structure to the seabed.";
    baseGroup.add(foundation);

    // 2. Submarine Power Cable
    const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    cable.position.y = -4;
    cable.position.x = 0.6;
    cable.name = "Submarine Power Cable";
    cable.userData.description = "Transmits the generated electricity to the onshore grid.";
    baseGroup.add(cable);

    // 3. Yaw Drive Mechanism
    const yawGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 16);
    const yawMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const yawDrive = new THREE.Mesh(yawGeometry, yawMaterial);
    yawDrive.position.y = 0;
    yawDrive.name = "Yaw Drive Mechanism";
    yawDrive.userData.description = "Rotates the nacelle to face the incoming tidal flow, maximizing efficiency.";
    baseGroup.add(yawDrive);

    // Nacelle Group (Rotates with yaw)
    const nacelleGroup = new THREE.Group();
    nacelleGroup.position.y = 0.5;
    group.add(nacelleGroup);

    // 4. Nacelle Housing
    const nacelleGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const nacelleMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.name = "Nacelle Housing";
    nacelle.userData.description = "Encloses and protects the main internal components.";
    nacelleGroup.add(nacelle);

    // 5. Planetary Gearbox
    const gearboxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1);
    const gearboxMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const gearbox = new THREE.Mesh(gearboxGeometry, gearboxMaterial);
    gearbox.position.z = 0.5;
    gearbox.name = "Planetary Gearbox";
    gearbox.userData.description = "Steps up the slow rotational speed of the rotor to the high speed needed for the generator.";
    nacelleGroup.add(gearbox);

    // 6. Induction Generator
    const generatorGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
    const generatorMaterial = new THREE.MeshStandardMaterial({ color: 0xcc6600 });
    const generator = new THREE.Mesh(generatorGeometry, generatorMaterial);
    generator.rotation.x = Math.PI / 2;
    generator.position.z = -0.8;
    generator.name = "Induction Generator";
    generator.userData.description = "Converts the mechanical energy from the gearbox into electrical energy.";
    nacelleGroup.add(generator);

    // 7. Blade Pitch Control
    const pitchGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const pitchMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const pitchControl = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitchControl.position.z = 1.2;
    pitchControl.rotation.x = Math.PI / 2;
    pitchControl.name = "Blade Pitch Control";
    pitchControl.userData.description = "Adjusts the angle of the blades to optimize energy capture and prevent damage during extreme currents.";
    nacelleGroup.add(pitchControl);

    // Rotor Group (Spins)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.z = 1.6;
    nacelleGroup.add(rotorGroup);

    // 8. Central Hub
    const hubGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.name = "Central Hub";
    hub.userData.description = "Connects the rotor blades to the main shaft.";
    rotorGroup.add(hub);

    // 9. Hydrodynamic Rotor Blades
    const bladesGroup = new THREE.Group();
    const bladesGeometry = new THREE.CylinderGeometry(0.1, 0.3, 4, 16);
    const bladesMaterial = new THREE.MeshStandardMaterial({ color: 0x3366cc });

    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladesGeometry, bladesMaterial);
        blade.position.y = 2; // Offset so bottom connects to hub
        
        const bGroup = new THREE.Group();
        bGroup.add(blade);
        bGroup.rotation.z = (i * 2 * Math.PI) / 3;
        bladesGroup.add(bGroup);
    }
    bladesGroup.name = "Hydrodynamic Rotor Blades";
    bladesGroup.userData.description = "Capture kinetic energy from tidal currents to turn the central hub.";
    rotorGroup.add(bladesGroup);

    // 10. Environmental Monitoring Sensor
    const sensorGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(0, 1.0, 0);
    sensor.name = "Environmental Monitoring Sensor";
    sensor.userData.description = "Monitors water flow, salinity, and potential marine life interactions.";
    nacelleGroup.add(sensor);

    const animator = (time) => {
        // Rotor blades spinning with tidal current
        rotorGroup.rotation.z = -time * 1.5;
        // Yaw mechanism adjusting
        nacelleGroup.rotation.y = Math.sin(time * 0.2) * 0.3;
    };

    const quiz = [
        {
            question: "What is the primary function of the Planetary Gearbox in a tidal turbine?",
            options: [
                "To control the yaw angle",
                "To step up rotational speed for the generator",
                "To monitor environmental conditions",
                "To anchor the turbine to the seabed"
            ],
            correctAnswer: 1
        },
        {
            question: "Why does the turbine need a Yaw Drive Mechanism?",
            options: [
                "To align the blades with the direction of the tidal flow",
                "To transport electricity to the shore",
                "To increase water salinity",
                "To prevent corrosion on the blades"
            ],
            correctAnswer: 0
        },
        {
            question: "What do the Hydrodynamic Rotor Blades capture?",
            options: [
                "Solar radiation",
                "Thermal gradients",
                "Kinetic energy from tidal currents",
                "Osmotic pressure"
            ],
            correctAnswer: 2
        },
        {
            question: "What role does the Blade Pitch Control play?",
            options: [
                "It adjusts blade angle to optimize efficiency and protect against damage",
                "It regulates voltage output to the grid",
                "It steers the submarine cable",
                "It detects marine mammals"
            ],
            correctAnswer: 0
        },
        {
            question: "Which component converts mechanical energy into electricity?",
            options: [
                "Monopile Foundation",
                "Induction Generator",
                "Central Hub",
                "Nacelle Housing"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Monopile Foundation?",
            options: [
                "To provide buoyancy to the turbine",
                "To step down voltage for transmission",
                "To secure the turbine firmly to the seabed",
                "To generate a magnetic field"
            ],
            correctAnswer: 2
        }
    ];

    return {
        model: group,
        animator: animator,
        quiz: quiz
    };
}
