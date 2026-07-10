export function createWeatherSatellite(THREE) {
    const group = new THREE.Group();

    // 1. Main Bus
    const busGeometry = new THREE.BoxGeometry(2, 3, 2);
    const busMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const bus = new THREE.Mesh(busGeometry, busMaterial);
    bus.name = 'main bus';
    group.add(bus);

    // 2. Solar Panels
    const panelsGroup = new THREE.Group();
    panelsGroup.name = 'solar panels';
    const panelGeometry = new THREE.BoxGeometry(6, 0.1, 2);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x0033aa });
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-4, 0, 0);
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(4, 0, 0);
    panelsGroup.add(leftPanel);
    panelsGroup.add(rightPanel);
    group.add(panelsGroup);

    // 3. Radiometer
    const radiometerGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
    const radiometerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const radiometer = new THREE.Mesh(radiometerGeometry, radiometerMaterial);
    radiometer.name = 'radiometer';
    radiometer.position.set(0, -1.75, 0.5);
    radiometer.rotation.x = Math.PI / 2;
    group.add(radiometer);

    // 4. Sounder
    const sounderGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const sounderMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const sounder = new THREE.Mesh(sounderGeometry, sounderMaterial);
    sounder.name = 'sounder';
    sounder.position.set(0.5, -1.5, -0.5);
    group.add(sounder);

    // 5. High-Gain Antenna
    const antennaGroup = new THREE.Group();
    antennaGroup.name = 'high-gain antenna';
    const antennaGeometry = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    const antennaDish = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antennaDish.position.set(0, 1.5, 1);
    antennaDish.rotation.x = Math.PI / 4;
    const antennaMast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({ color: 0x777777 }));
    antennaMast.position.set(0, 1.5, 0.5);
    antennaMast.rotation.x = Math.PI / 4;
    antennaGroup.add(antennaDish);
    antennaGroup.add(antennaMast);
    group.add(antennaGroup);

    // 6. Reaction Wheels
    const rwGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const rwMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const rw = new THREE.Mesh(rwGeometry, rwMaterial);
    rw.name = 'reaction wheels';
    rw.position.set(-0.8, 1.2, 0.8);
    group.add(rw);

    // 7. Star Tracker
    const starTrackerGeometry = new THREE.ConeGeometry(0.15, 0.4, 16);
    const starTrackerMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const starTracker = new THREE.Mesh(starTrackerGeometry, starTrackerMaterial);
    starTracker.name = 'star tracker';
    starTracker.position.set(-0.8, 1.2, -0.8);
    starTracker.rotation.x = -Math.PI / 4;
    group.add(starTracker);

    // 8. Earth Sensor
    const earthSensorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const earthSensorMaterial = new THREE.MeshStandardMaterial({ color: 0x880000 });
    const earthSensor = new THREE.Mesh(earthSensorGeometry, earthSensorMaterial);
    earthSensor.name = 'earth sensor';
    earthSensor.position.set(0.8, -1.6, 0);
    group.add(earthSensor);

    // 9. Thermal Blankets
    const blanketGeometry = new THREE.BoxGeometry(2.05, 2.05, 2.05);
    const blanketMaterial = new THREE.MeshStandardMaterial({ color: 0xddaa00, transparent: true, opacity: 0.8 });
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.name = 'thermal blankets';
    blanket.position.set(0, 0.5, 0); 
    group.add(blanket);

    // 10. Thrusters
    const thrusterGroup = new THREE.Group();
    thrusterGroup.name = 'thrusters';
    const thrusterGeometry = new THREE.ConeGeometry(0.1, 0.2, 16);
    const thrusterMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const thruster1 = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
    thruster1.position.set(-0.9, -1.6, 0.9);
    const thruster2 = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
    thruster2.position.set(0.9, -1.6, 0.9);
    thrusterGroup.add(thruster1);
    thrusterGroup.add(thruster2);
    group.add(thrusterGroup);

    // Animation
    let time = 0;
    const update = (deltaTime) => {
        time += deltaTime;
        // Solar panels tracking the sun (rotating back and forth slightly for effect)
        panelsGroup.rotation.x = Math.sin(time * 0.5) * 0.3;
        
        // Radiometer scanning (rotating continuously)
        radiometer.rotation.y = time * 2;
    };

    // Quiz Questions (6)
    const quiz = [
        {
            question: "What is the primary function of a radiometer on a weather satellite?",
            options: ["To measure temperature and moisture", "To provide propulsion", "To generate electricity", "To communicate with Earth"],
            answer: 0
        },
        {
            question: "What type of orbit do Geostationary Operational Environmental Satellites (GOES) generally use?",
            options: ["Low Earth Orbit", "Polar Orbit", "Geostationary Orbit", "Sun-synchronous Orbit"],
            answer: 2
        },
        {
            question: "Why are thermal blankets used on satellites?",
            options: ["To protect against space debris", "To regulate the satellite's temperature", "To absorb solar energy", "To hide from radar"],
            answer: 1
        },
        {
            question: "What instrument is commonly used to create vertical profiles of the atmosphere?",
            options: ["Star Tracker", "Sounder", "Reaction Wheels", "High-Gain Antenna"],
            answer: 1
        },
        {
            question: "What is the purpose of reaction wheels in a satellite?",
            options: ["To provide thrust for orbit changes", "To orient and stabilize the spacecraft", "To spin the solar panels", "To measure wind speed"],
            answer: 1
        },
        {
            question: "Which component is used by the satellite to orient itself relative to the stars?",
            options: ["Earth Sensor", "Sun Sensor", "Star Tracker", "Radiometer"],
            answer: 2
        }
    ];

    return { group, update, quiz };
}
