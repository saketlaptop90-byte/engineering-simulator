export function createCommSatellite(THREE) {
    const group = new THREE.Group();

    // Materials
    const busMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x1122aa, metalness: 0.5, roughness: 0.1 });
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3, roughness: 0.5 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4 });
    const radiatorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const thrusterMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
    const goldFoilMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.4 });

    // 1. Central Bus
    const busGeometry = new THREE.BoxGeometry(2, 2.5, 2);
    const centralBus = new THREE.Mesh(busGeometry, goldFoilMaterial);
    group.add(centralBus);

    // 2. Solar Arrays (Left and Right)
    const solarArraysGroup = new THREE.Group();
    const panelGeometry = new THREE.BoxGeometry(6, 0.1, 1.5);
    const leftArray = new THREE.Mesh(panelGeometry, solarPanelMaterial);
    leftArray.position.set(-4, 0, 0);
    const rightArray = new THREE.Mesh(panelGeometry, solarPanelMaterial);
    rightArray.position.set(4, 0, 0);
    const strutGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2);
    strutGeometry.rotateZ(Math.PI / 2);
    const leftStrut = new THREE.Mesh(strutGeometry, busMaterial);
    leftStrut.position.set(-2, 0, 0);
    const rightStrut = new THREE.Mesh(strutGeometry, busMaterial);
    rightStrut.position.set(2, 0, 0);
    
    solarArraysGroup.add(leftArray);
    solarArraysGroup.add(rightArray);
    solarArraysGroup.add(leftStrut);
    solarArraysGroup.add(rightStrut);
    group.add(solarArraysGroup);

    // 3. Primary Reflector Antenna
    const primaryAntennaGroup = new THREE.Group();
    const dishGeometry = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const primaryDish = new THREE.Mesh(dishGeometry, antennaMaterial);
    primaryDish.material.side = THREE.DoubleSide;
    primaryDish.position.set(0, 1.25, 0.5);
    primaryDish.rotation.x = -Math.PI / 2;
    primaryAntennaGroup.add(primaryDish);
    
    const feedHornGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.8);
    const feedHorn = new THREE.Mesh(feedHornGeo, darkMaterial);
    feedHorn.position.set(0, 1.25, 1.2);
    feedHorn.rotation.x = Math.PI / 2;
    primaryAntennaGroup.add(feedHorn);
    group.add(primaryAntennaGroup);

    // 4. Secondary Antenna
    const secondaryDishGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const secondaryDish = new THREE.Mesh(secondaryDishGeo, antennaMaterial);
    secondaryDish.material.side = THREE.DoubleSide;
    secondaryDish.position.set(1.5, 0, 1.2);
    secondaryDish.rotation.x = -Math.PI / 2;
    secondaryDish.rotation.y = Math.PI / 4;
    group.add(secondaryDish);

    // 5. Star Tracker
    const starTrackerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
    const starTracker = new THREE.Mesh(starTrackerGeo, darkMaterial);
    starTracker.position.set(-0.8, 1.25, -0.8);
    starTracker.rotation.x = Math.PI / 4;
    group.add(starTracker);

    // 6. Reaction Wheels
    const reactionWheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1);
    const rw1 = new THREE.Mesh(reactionWheelGeo, darkMaterial);
    rw1.position.set(0, -0.5, 0);
    rw1.rotation.x = Math.PI / 2;
    const rw2 = new THREE.Mesh(reactionWheelGeo, darkMaterial);
    rw2.position.set(0, 0.5, 0);
    rw2.rotation.z = Math.PI / 2;
    group.add(rw1);
    group.add(rw2);

    // 7. Telemetry Transmitter
    const telemetryGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
    const telemetryAntenna = new THREE.Mesh(telemetryGeo, antennaMaterial);
    telemetryAntenna.position.set(-1.2, 1.5, 0);
    group.add(telemetryAntenna);

    // 8. Station-Keeping Thrusters
    const thrusterGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.2);
    const t1 = new THREE.Mesh(thrusterGeo, thrusterMaterial);
    t1.position.set(0.8, -1.25, 0.8);
    const t2 = new THREE.Mesh(thrusterGeo, thrusterMaterial);
    t2.position.set(-0.8, -1.25, 0.8);
    const t3 = new THREE.Mesh(thrusterGeo, thrusterMaterial);
    t3.position.set(0.8, -1.25, -0.8);
    const t4 = new THREE.Mesh(thrusterGeo, thrusterMaterial);
    t4.position.set(-0.8, -1.25, -0.8);
    group.add(t1);
    group.add(t2);
    group.add(t3);
    group.add(t4);

    // 9. Heat Radiators
    const radiatorGeo = new THREE.PlaneGeometry(1.5, 2);
    const radiator1 = new THREE.Mesh(radiatorGeo, radiatorMaterial);
    radiator1.position.set(0, 0, -1.01);
    radiator1.rotation.y = Math.PI;
    const radiator2 = new THREE.Mesh(radiatorGeo, radiatorMaterial);
    radiator2.position.set(0, 0, 1.01);
    group.add(radiator1);
    group.add(radiator2);

    // 10. Apogee Kick Motor
    const akmGeo = new THREE.CylinderGeometry(0.3, 0.6, 0.8);
    const akm = new THREE.Mesh(akmGeo, thrusterMaterial);
    akm.position.set(0, -1.65, 0);
    group.add(akm);

    // 2. Define an update function for animation
    let time = 0;
    function update(delta) {
        time += delta;
        // Animate solar arrays rotating to face the sun
        solarArraysGroup.rotation.x = Math.sin(time * 0.5) * 0.3;
    }

    // 3. Define 6 quiz questions
    const questions = [
        {
            question: "What is the primary function of the Central Bus in a satellite?",
            options: [
                "To carry the payload and provide essential systems like power and thermal control",
                "To generate thrust for orbital maneuvers",
                "To reflect signals back to Earth",
                "To track stars for navigation"
            ],
            correctAnswer: 0,
            explanation: "The Central Bus is the main body of the satellite, housing and providing power, thermal control, and structural support to the payload and other subsystems."
        },
        {
            question: "What do the Solar Arrays do on a Geostationary Communications Satellite?",
            options: [
                "Provide propulsion",
                "Convert sunlight into electrical power",
                "Transmit telemetry data",
                "Dissipate excess heat"
            ],
            correctAnswer: 1,
            explanation: "Solar arrays consist of photovoltaic cells that convert sunlight into electrical power, which is essential for running the satellite's systems."
        },
        {
            question: "Which component is responsible for dissipating excess heat generated by the satellite's electronics?",
            options: [
                "Apogee Kick Motor",
                "Primary Reflector Antenna",
                "Heat Radiators",
                "Reaction Wheels"
            ],
            correctAnswer: 2,
            explanation: "Heat radiators dissipate the excess thermal energy generated by onboard electronics out into the cold of space."
        },
        {
            question: "What is the purpose of the Apogee Kick Motor (AKM)?",
            options: [
                "To maintain the satellite's orientation",
                "To provide the final thrust needed to circularize the orbit at geostationary altitude",
                "To communicate with ground stations",
                "To track the sun's position"
            ],
            correctAnswer: 1,
            explanation: "The Apogee Kick Motor is fired at the highest point (apogee) of the transfer orbit to circularize the orbit, placing the satellite into its final geostationary orbit."
        },
        {
            question: "How do Reaction Wheels help the satellite?",
            options: [
                "By generating electrical power",
                "By managing the satellite's attitude (orientation) without using propellant",
                "By acting as a backup communication antenna",
                "By keeping the satellite warm"
            ],
            correctAnswer: 1,
            explanation: "Reaction wheels use the conservation of angular momentum to precisely adjust and maintain the satellite's orientation without expending thruster propellant."
        },
        {
            question: "What role does the Star Tracker play?",
            options: [
                "It takes high-resolution images of Earth",
                "It determines the satellite's precise orientation by comparing visible stars with a catalog",
                "It serves as a backup solar panel",
                "It boosts the communication signal"
            ],
            correctAnswer: 1,
            explanation: "A Star Tracker is an optical device used to determine the satellite's attitude by capturing images of the starfield and comparing them against a known star catalog."
        }
    ];

    return {
        group,
        update,
        questions
    };
}
