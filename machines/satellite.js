export function createSatellite(THREE) {
    const group = new THREE.Group();

    // Materials
    const goldFoilMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.4, metalness: 0.8 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x112255, roughness: 0.2, metalness: 0.7 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.9 });
    const darkGreyMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.2 });

    const parts = [];

    // 1. Main Bus
    const busGeo = new THREE.BoxGeometry(2, 2, 2);
    const mainBus = new THREE.Mesh(busGeo, goldFoilMat);
    mainBus.userData = { name: "Main Bus" };
    group.add(mainBus);
    parts.push(mainBus);

    // 2. Solar Array Left
    const solarArrayLeftGroup = new THREE.Group();
    solarArrayLeftGroup.position.set(-1.1, 0, 0); // Position at the edge of the bus
    const panelGeo = new THREE.BoxGeometry(3, 1, 0.05);
    const solarArrayLeft = new THREE.Mesh(panelGeo, solarMat);
    solarArrayLeft.position.set(-1.5, 0, 0); // Offset to rotate around the joint
    solarArrayLeft.userData = { name: "Solar Array Left" };
    solarArrayLeftGroup.add(solarArrayLeft);
    group.add(solarArrayLeftGroup);
    parts.push(solarArrayLeft);

    // 3. Solar Array Right
    const solarArrayRightGroup = new THREE.Group();
    solarArrayRightGroup.position.set(1.1, 0, 0); // Position at the edge of the bus
    const solarArrayRight = new THREE.Mesh(panelGeo, solarMat);
    solarArrayRight.position.set(1.5, 0, 0);
    solarArrayRight.userData = { name: "Solar Array Right" };
    solarArrayRightGroup.add(solarArrayRight);
    group.add(solarArrayRightGroup);
    parts.push(solarArrayRight);

    // 4. Communication Dish
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 1.0, 0); // Top of the bus
    const dishGeo = new THREE.CylinderGeometry(1, 0.1, 0.5, 32, 1, false, 0, Math.PI * 2);
    const dish = new THREE.Mesh(dishGeo, whiteMat);
    dish.position.set(0, 0.5, 0);
    dish.userData = { name: "Communication Dish" };
    dishGroup.add(dish);
    group.add(dishGroup);
    parts.push(dish);

    // 5. Antennas
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const antennas = new THREE.Mesh(antennaGeo, silverMat);
    antennas.position.set(0.8, 1.75, 0.8);
    antennas.userData = { name: "Antennas" };
    group.add(antennas);
    parts.push(antennas);

    // 6. Thrusters
    const thrusterGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.5, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const thrusters = new THREE.Mesh(thrusterGeo, thrusterMat);
    thrusters.position.set(0, -1.25, 0);
    thrusters.userData = { name: "Thrusters" };
    group.add(thrusters);
    parts.push(thrusters);

    // 7. Star Tracker
    const trackerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const starTracker = new THREE.Mesh(trackerGeo, darkGreyMat);
    starTracker.position.set(-0.8, 0, 1.2);
    starTracker.rotation.x = Math.PI / 2;
    starTracker.userData = { name: "Star Tracker" };
    group.add(starTracker);
    parts.push(starTracker);

    // 8. Battery Module
    const batteryGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
    const batteryModule = new THREE.Mesh(batteryGeo, darkGreyMat);
    batteryModule.position.set(0, -0.75, 0); // Inside the bus, extending downwards
    batteryModule.userData = { name: "Battery Module" };
    group.add(batteryModule);
    parts.push(batteryModule);

    // 9. Thermal Radiator
    const radiatorGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const thermalRadiator = new THREE.Mesh(radiatorGeo, radiatorMat);
    thermalRadiator.position.set(0, 0, -1.05);
    thermalRadiator.userData = { name: "Thermal Radiator" };
    group.add(thermalRadiator);
    parts.push(thermalRadiator);

    // 10. Payload Module
    const payloadGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const payloadModule = new THREE.Mesh(payloadGeo, silverMat);
    payloadModule.position.set(0, 0, 1.5);
    payloadModule.rotation.x = Math.PI / 2;
    payloadModule.userData = { name: "Payload Module" };
    group.add(payloadModule);
    parts.push(payloadModule);

    // Animation function
    const animate = () => {
        const time = Date.now() * 0.001;
        // Rotate solar arrays
        solarArrayLeftGroup.rotation.x = time * 0.5;
        solarArrayRightGroup.rotation.x = time * 0.5;
        
        // Rotate communication dish
        dishGroup.rotation.y = time * 0.8;
        dishGroup.rotation.z = Math.sin(time * 0.5) * 0.2; // Slight wobble
    };

    const questions = [
        {
            question: "What is the primary function of the Main Bus?",
            options: ["To generate power", "To house the satellite's primary subsystems", "To collect space dust", "To communicate with Earth"],
            answer: 1
        },
        {
            question: "What do the Solar Arrays do?",
            options: ["Provide propulsion", "Cool the satellite", "Convert sunlight into electrical power", "Transmit signals"],
            answer: 2
        },
        {
            question: "What is the purpose of the Communication Dish?",
            options: ["To transmit and receive data from Earth", "To monitor space weather", "To generate thrust", "To store energy"],
            answer: 0
        },
        {
            question: "Why are Thrusters used on a satellite?",
            options: ["To reflect sunlight", "To compute orbital trajectories", "To adjust the satellite's orbit and orientation", "To increase weight"],
            answer: 2
        },
        {
            question: "What is the role of the Thermal Radiator?",
            options: ["To heat the payload", "To dissipate excess heat generated by onboard electronics into space", "To emit radio signals", "To absorb solar energy"],
            answer: 1
        },
        {
            question: "What does the Star Tracker do?",
            options: ["Captures images of alien planets", "Determines the satellite's orientation by observing stars", "Tracks the position of the sun", "Computes the speed of light"],
            answer: 1
        }
    ];

    return {
        model: group,
        parts: parts,
        animate: animate,
        questions: questions
    };
}
