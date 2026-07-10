export function createVolcanoMonitoring(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Terrain - Volcano Flank (not counted as a "part" but a base container)
    const terrainGeo = new THREE.ConeGeometry(15, 8, 32);
    const terrainMat = new THREE.MeshStandardMaterial({ 
        color: 0x4a3b32, 
        transparent: true, 
        opacity: 0.7, 
        wireframe: false 
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -4;
    group.add(terrain);

    // Common materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const whiteBoxMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    // 1. Seismometer (buried slightly)
    const seismoGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const seismometer = new THREE.Mesh(seismoGeo, metalMat);
    seismometer.position.set(-3, 0.2, 3);
    group.add(seismometer);
    parts.push({
        name: "Seismometer",
        description: "Detects and records ground vibrations and micro-earthquakes caused by moving magma.",
        mesh: seismometer
    });

    // 2. Tiltmeter Array
    const tiltGroup = new THREE.Group();
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const tube1 = new THREE.Mesh(tubeGeo, metalMat);
    tube1.rotation.z = Math.PI / 2;
    const tube2 = new THREE.Mesh(tubeGeo, metalMat);
    tube2.rotation.x = Math.PI / 2;
    tiltGroup.add(tube1);
    tiltGroup.add(tube2);
    tiltGroup.position.set(-4, 0.1, -1);
    group.add(tiltGroup);
    parts.push({
        name: "Tiltmeter Array",
        description: "Measures minute changes in the slope or tilt of the ground as the volcano inflates or deflates.",
        mesh: tiltGroup
    });

    // 3. GPS Receiver
    const gpsGroup = new THREE.Group();
    const tripodGeo = new THREE.CylinderGeometry(0.05, 0.4, 1.5);
    const tripod = new THREE.Mesh(tripodGeo, metalMat);
    const dishBaseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1);
    const gpsDisk = new THREE.Mesh(dishBaseGeo, whiteBoxMat);
    gpsDisk.position.y = 0.8;
    gpsGroup.add(tripod);
    gpsGroup.add(gpsDisk);
    gpsGroup.position.set(4, 0.75, 2);
    group.add(gpsGroup);
    parts.push({
        name: "GPS Receiver",
        description: "Uses satellite signals to track exact millimeter-scale 3D surface displacements over time.",
        mesh: gpsGroup
    });

    // 4. CO2/SO2 Gas Sensor
    const gasGroup = new THREE.Group();
    const gasBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), whiteBoxMat);
    const gasTube = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), darkMat);
    gasTube.position.y = 0.8;
    gasGroup.add(gasBox);
    gasGroup.add(gasTube);
    gasGroup.position.set(2, 0.6, -4);
    group.add(gasGroup);
    parts.push({
        name: "CO2/SO2 Gas Sensor",
        description: "Samples ambient air to detect increases in volcanic gases that often precede eruptions.",
        mesh: gasGroup
    });

    // 5. Telemetry Antenna
    const antennaGroup = new THREE.Group();
    const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const mast = new THREE.Mesh(mastGeo, metalMat);
    const dishGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeo, whiteBoxMat);
    dish.position.y = 1;
    dish.rotation.x = -Math.PI / 2;
    dish.rotation.y = Math.PI / 4;
    antennaGroup.add(mast);
    antennaGroup.add(dish);
    antennaGroup.position.set(-1, 1.5, -4);
    group.add(antennaGroup);
    parts.push({
        name: "Telemetry Antenna",
        description: "Transmits collected sensor data in real-time to distant volcanology observatories.",
        mesh: antennaGroup
    });

    // 6. Solar Panel Power Supply
    const solarGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(2.5, 0.1, 1.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0033aa, roughness: 0.1, metalness: 0.5 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.rotation.x = Math.PI / 6;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), metalMat);
    stand.position.y = -0.5;
    solarGroup.add(panel);
    solarGroup.add(stand);
    solarGroup.position.set(-4, 1, 4);
    group.add(solarGroup);
    parts.push({
        name: "Solar Panel Power Supply",
        description: "Provides renewable off-grid power to keep the monitoring station running continuously.",
        mesh: solarGroup
    });

    // 7. Data Logger Hub
    const hubGroup = new THREE.Group();
    const hubBoxGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const hubBox = new THREE.Mesh(hubBoxGeo, whiteBoxMat);
    const ledGeo = new THREE.SphereGeometry(0.1);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.6, 0.3, 0.5);
    hubGroup.add(hubBox);
    hubGroup.add(led);
    hubGroup.position.set(0, 0.5, 1);
    group.add(hubGroup);
    parts.push({
        name: "Data Logger Hub",
        description: "The central computer that aggregates, timestamps, and stores data from all connected sensors.",
        mesh: hubGroup
    });

    // 8. Thermal Camera
    const cameraGroup = new THREE.Group();
    const camBodyGeo = new THREE.BoxGeometry(0.4, 0.4, 0.8);
    const camBody = new THREE.Mesh(camBodyGeo, darkMat);
    const lensGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.45;
    const mountGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const mount = new THREE.Mesh(mountGeo, metalMat);
    mount.position.y = -0.4;
    cameraGroup.add(camBody);
    cameraGroup.add(lens);
    cameraGroup.add(mount);
    cameraGroup.position.set(3, 1.2, 4);
    cameraGroup.lookAt(0, 5, -10); // Point roughly towards summit
    group.add(cameraGroup);
    parts.push({
        name: "Thermal Camera",
        description: "Monitors surface temperatures to detect new hot spots or an approaching lava flow.",
        mesh: cameraGroup
    });

    // 9. Underground Magma Displacement
    const magmaGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const magmaMat = new THREE.MeshStandardMaterial({ 
        color: 0xff2200, 
        emissive: 0xff0000, 
        emissiveIntensity: 0.8,
        wireframe: true 
    });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.set(0, -3.5, 0);
    group.add(magma);
    parts.push({
        name: "Underground Magma Displacement",
        description: "A reservoir of molten rock beneath the surface. Its movement causes the ground to bulge and tremble.",
        mesh: magma
    });

    // 10. InSAR Satellite Target
    const insarGroup = new THREE.Group();
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const p1 = new THREE.Mesh(planeGeo, metalMat);
    const p2 = new THREE.Mesh(planeGeo, metalMat);
    p2.rotation.x = Math.PI / 2;
    const p3 = new THREE.Mesh(planeGeo, metalMat);
    p3.rotation.y = Math.PI / 2;
    insarGroup.add(p1);
    insarGroup.add(p2);
    insarGroup.add(p3);
    insarGroup.position.set(-2, 0.5, -2);
    group.add(insarGroup);
    parts.push({
        name: "InSAR Satellite Target",
        description: "A corner reflector that bounces radar signals back to satellites to map wide-area ground deformation.",
        mesh: insarGroup
    });

    // Animation state
    let time = 0;

    const quizzes = [
        {
            question: "What is the primary function of a seismometer on a volcano?",
            options: [
                "Measuring gas emissions",
                "Detecting ground vibrations and micro-earthquakes",
                "Tracking atmospheric pressure",
                "Recording surface temperature"
            ],
            answer: 1
        },
        {
            question: "Why do volcanologists monitor CO2 and SO2 levels?",
            options: [
                "To control the local weather",
                "To measure the age of the volcano",
                "Changes in gas emissions can indicate magma rising to the surface",
                "To calculate the altitude of the summit"
            ],
            answer: 2
        },
        {
            question: "What does a tiltmeter measure?",
            options: [
                "Minute changes in the slope or tilt of the ground",
                "The magnetic field of the earth",
                "The speed of the wind at the summit",
                "The depth of the magma chamber"
            ],
            answer: 0
        },
        {
            question: "How do GPS receivers help predict volcanic eruptions?",
            options: [
                "They navigate rovers on the surface",
                "They track the exact 3D surface displacement as the volcano inflates",
                "They connect to the internet to download weather data",
                "They measure the temperature of the lava"
            ],
            answer: 1
        },
        {
            question: "What is an InSAR Satellite Target used for?",
            options: [
                "Shooting lasers into space",
                "Providing a fixed radar reflection point to map ground deformation from space",
                "Absorbing solar energy",
                "Detecting incoming meteorites"
            ],
            answer: 1
        },
        {
            question: "What role does the Data Logger Hub play in a monitoring station?",
            options: [
                "It physically stops the lava flow",
                "It provides the primary power source",
                "It drills into the ground to find magma",
                "It aggregates, timestamps, and stores data from all connected sensors"
            ],
            answer: 3
        }
    ];

    return {
        group,
        parts,
        update: function(delta) {
            time += delta;
            
            // Blink Data Logger LED
            ledMat.color.setHex(Math.sin(time * 8) > 0 ? 0x00ff00 : 0x003300);

            // Pulse underground magma
            const scale = 1 + Math.sin(time * 2) * 0.05;
            magma.scale.setScalar(scale);
            magmaMat.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.4;

            // Pan thermal camera slightly
            cameraGroup.rotation.y = Math.sin(time * 0.5) * 0.15;

            // Rotate telemetry dish slowly
            antennaGroup.rotation.y += delta * 0.2;
        },
        quizzes
    };
}
