export function createOceanographicBuoy(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Materials
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4, metalness: 0.1 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.5 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x112255, roughness: 0.2, metalness: 0.9 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.5, metalness: 0.2 });
    
    // Group for the floating portion of the buoy to animate wave kinematics
    const buoyantParts = new THREE.Group();
    model.add(buoyantParts);

    // 1. Floatation Collar
    const collarGeom = new THREE.TorusGeometry(2, 0.8, 16, 32);
    const collar = new THREE.Mesh(collarGeom, yellowMat);
    collar.rotation.x = Math.PI / 2;
    buoyantParts.add(collar);
    parts.push({
        name: "Floatation Collar",
        description: "Provides buoyancy to keep the main structure afloat and stable in rough seas.",
        mesh: collar
    });

    // 2. Battery Compartment
    const batteryGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const battery = new THREE.Mesh(batteryGeom, yellowMat);
    battery.position.y = -1.5;
    buoyantParts.add(battery);
    parts.push({
        name: "Battery Compartment",
        description: "Watertight hull containing the power supply (batteries) and primary data loggers.",
        mesh: battery
    });

    // 3. Sensor Mast
    const mastGeom = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const mast = new THREE.Mesh(mastGeom, metalMat);
    mast.position.y = 2;
    buoyantParts.add(mast);
    parts.push({
        name: "Sensor Mast",
        description: "Elevates meteorological sensors and telemetry antennas above the waves to minimize interference.",
        mesh: mast
    });

    // 4. Solar Panels
    const solarGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const panelGeom = new THREE.BoxGeometry(1.5, 1.5, 0.1);
        const panel = new THREE.Mesh(panelGeom, solarMat);
        panel.position.set(0, 0, 0.6);
        
        const mount = new THREE.Group();
        mount.add(panel);
        mount.rotation.y = (Math.PI / 2) * i;
        mount.rotation.x = -Math.PI / 6; // Angle upwards
        mount.position.y = 2.5;
        solarGroup.add(mount);
    }
    buoyantParts.add(solarGroup);
    parts.push({
        name: "Solar Panels",
        description: "Harvests solar energy to recharge the buoy's batteries for extended deployment.",
        mesh: solarGroup
    });

    // 5. Wind Sensor
    const windGroup = new THREE.Group();
    const windBaseGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const windBase = new THREE.Mesh(windBaseGeom, darkMetalMat);
    windGroup.add(windBase);
    
    const cupsGeom = new THREE.Group();
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.02), darkMetalMat);
    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.8), darkMetalMat);
    cupsGeom.add(cross1);
    cupsGeom.add(cross2);
    
    // Add 4 cups to the cross
    for(let i=0; i<4; i++) {
        const cupGeom = new THREE.SphereGeometry(0.08, 8, 8, 0, Math.PI);
        const cup = new THREE.Mesh(cupGeom, darkMetalMat);
        cup.position.set(Math.cos(i * Math.PI/2) * 0.4, 0, Math.sin(i * Math.PI/2) * 0.4);
        cup.rotation.y = i * Math.PI/2;
        cupsGeom.add(cup);
    }

    cupsGeom.position.y = 0.25;
    windGroup.add(cupsGeom);
    
    windGroup.position.y = 4.25;
    windGroup.position.x = 0.5;
    buoyantParts.add(windGroup);
    parts.push({
        name: "Wind Sensor",
        description: "An anemometer that measures wind speed and direction.",
        mesh: windGroup
    });

    // 6. Telemetry Antenna
    const antennaGeom = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
    const antenna = new THREE.Mesh(antennaGeom, whiteMat);
    antenna.position.set(-0.5, 5, 0);
    buoyantParts.add(antenna);
    parts.push({
        name: "Telemetry Antenna",
        description: "Transmits collected scientific data back to shore or satellites via Iridium or other networks.",
        mesh: antenna
    });

    // 7. Subsurface CTD Sensor
    const ctdGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const ctd = new THREE.Mesh(ctdGeom, metalMat);
    ctd.position.set(1.3, -2, 0);
    buoyantParts.add(ctd);
    parts.push({
        name: "Subsurface CTD Sensor",
        description: "Measures Conductivity (Salinity), Temperature, and Depth of the surrounding water.",
        mesh: ctd
    });

    // 8. Mooring Chain
    const chainGeom = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const chain = new THREE.Mesh(chainGeom, darkMetalMat);
    model.add(chain);
    parts.push({
        name: "Mooring Chain",
        description: "A heavy chain connecting the surface buoy to the sea floor anchor, keeping it on station.",
        mesh: chain
    });

    // 9. Acoustic Release
    const releaseGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const release = new THREE.Mesh(releaseGeom, redMat);
    release.position.y = -12.5;
    model.add(release);
    parts.push({
        name: "Acoustic Release",
        description: "A remotely triggered mechanism that disconnects the buoy from the anchor for recovery.",
        mesh: release
    });

    // 10. Anchor
    const anchorGeom = new THREE.BoxGeometry(3, 1, 3);
    const anchor = new THREE.Mesh(anchorGeom, darkMetalMat);
    anchor.position.y = -13.5;
    model.add(anchor);
    parts.push({
        name: "Anchor",
        description: "A heavy deadweight (often train wheels or concrete blocks) that keeps the mooring in place on the seabed.",
        mesh: anchor
    });

    // Kinematics State
    let time = 0;

    const update = (deltaTime) => {
        time += deltaTime;

        // Wave simulation for the buoy: sway (pitch and roll) and heave (bobbing)
        buoyantParts.rotation.x = Math.sin(time * 1.5) * 0.1;
        buoyantParts.rotation.z = Math.cos(time * 1.2) * 0.08;
        buoyantParts.position.y = Math.sin(time * 2.0) * 0.4;

        // Anemometer cups spin wildly in the wind
        cupsGeom.rotation.y -= deltaTime * 12.0; 

        // Chain stretches to connect floating buoy and static acoustic release
        const batteryBottomY = buoyantParts.position.y - 3;
        const releaseTopY = release.position.y + 0.4;
        const chainLength = batteryBottomY - releaseTopY;
        
        chain.scale.y = chainLength / 10; // Default geometry length is 10
        chain.position.y = releaseTopY + chainLength / 2;
    };

    const quizzes = [
        {
            question: "What does the acronym CTD stand for in oceanography?",
            options: ["Conductivity, Temperature, Depth", "Current, Tides, Density", "Climate Tracking Device", "Coastal Terrain Data"],
            answer: 0
        },
        {
            question: "What is the primary function of the acoustic release?",
            options: ["To play sounds to repel marine life", "To detach the mooring from the anchor for recovery", "To communicate with passing submarines", "To measure ocean depth via sonar"],
            answer: 1
        },
        {
            question: "Why are meteorological sensors elevated on a mast?",
            options: ["To act as a lightning rod", "To stay out of reach of marine predators", "To minimize interference from sea spray and wave action", "To increase the weight of the buoy"],
            answer: 2
        },
        {
            question: "How does an oceanographic buoy typically transmit data back to shore?",
            options: ["Underwater fiber optic cables", "Physical data retrieval only", "Sonar bursts", "Satellite telemetry (e.g., Iridium)"],
            answer: 3
        },
        {
            question: "Which component measures wind speed and direction on the buoy?",
            options: ["Anemometer", "Barometer", "Thermistor", "Hygrometer"],
            answer: 0
        },
        {
            question: "What typically provides long-term operational power for deep-ocean buoys?",
            options: ["Nuclear reactors", "Wind turbines and tidal generators", "Solar panels combined with rechargeable batteries", "Diesel generators"],
            answer: 2
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
