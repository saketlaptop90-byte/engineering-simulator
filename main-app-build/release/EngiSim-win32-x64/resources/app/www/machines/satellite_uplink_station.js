export function createSatelliteUplinkStation(THREE) {
    const station = new THREE.Group();
    station.name = "SatelliteUplinkStation";

    // 1. Antenna Mount
    const mountGeo = new THREE.CylinderGeometry(0.5, 0.8, 5, 16);
    const mountMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const antennaMount = new THREE.Mesh(mountGeo, mountMat);
    antennaMount.position.set(0, 2.5, 0);
    antennaMount.name = "AntennaMount";
    station.add(antennaMount);

    // 2. Transmitter
    const txGeo = new THREE.BoxGeometry(2, 2, 2);
    const txMat = new THREE.MeshStandardMaterial({ color: 0xaa3333, metalness: 0.3, roughness: 0.7 });
    const transmitter = new THREE.Mesh(txGeo, txMat);
    transmitter.position.set(3, 1, 0);
    transmitter.name = "Transmitter";
    station.add(transmitter);

    // 3. Receiver
    const rxGeo = new THREE.BoxGeometry(2, 2, 2);
    const rxMat = new THREE.MeshStandardMaterial({ color: 0x33aa33, metalness: 0.3, roughness: 0.7 });
    const receiver = new THREE.Mesh(rxGeo, rxMat);
    receiver.position.set(-3, 1, 0);
    receiver.name = "Receiver";
    station.add(receiver);

    // 4. Control Terminal
    const ctrlGeo = new THREE.BoxGeometry(1.5, 1.5, 1);
    const ctrlMat = new THREE.MeshStandardMaterial({ color: 0x3333aa, metalness: 0.2, roughness: 0.8 });
    const controlTerminal = new THREE.Mesh(ctrlGeo, ctrlMat);
    controlTerminal.position.set(0, 0.75, 3);
    controlTerminal.name = "ControlTerminal";
    station.add(controlTerminal);

    // 5. Generator
    const genGeo = new THREE.BoxGeometry(2.5, 3, 2);
    const genMat = new THREE.MeshStandardMaterial({ color: 0xaaaa33, metalness: 0.4, roughness: 0.6 });
    const generator = new THREE.Mesh(genGeo, genMat);
    generator.position.set(0, 1.5, -3);
    generator.name = "Generator";
    station.add(generator);

    // Pan assembly handles Y-axis rotation (azimuth)
    const panAssembly = new THREE.Group();
    panAssembly.position.set(0, 5, 0);
    station.add(panAssembly);

    // 6. Tracking Motor
    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.3 });
    const trackingMotor = new THREE.Mesh(motorGeo, motorMat);
    trackingMotor.rotation.z = Math.PI / 2;
    trackingMotor.name = "TrackingMotor";
    panAssembly.add(trackingMotor);

    // Tilt assembly handles X-axis rotation (elevation)
    const tiltAssembly = new THREE.Group();
    panAssembly.add(tiltAssembly);

    // 7. Parabolic Dish
    const dishGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3.5);
    dishGeo.translate(0, -4, 0); // Move vertex to 0,0,0
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const parabolicDish = new THREE.Mesh(dishGeo, dishMat);
    parabolicDish.rotation.x = -Math.PI / 2; // Opens towards +Z
    parabolicDish.name = "ParabolicDish";
    tiltAssembly.add(parabolicDish);

    // 8. Feed Horn
    const hornGeo = new THREE.CylinderGeometry(0.2, 0.05, 0.5, 16);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.4 });
    const feedHorn = new THREE.Mesh(hornGeo, hornMat);
    feedHorn.position.set(0, 0, 2);
    feedHorn.rotation.x = -Math.PI / 2; // Wide end faces dish
    feedHorn.name = "FeedHorn";
    tiltAssembly.add(feedHorn);

    // 9. LNB (Low Noise Block)
    const lnbGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const lnbMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 });
    const lnb = new THREE.Mesh(lnbGeo, lnbMat);
    lnb.position.set(0, 0, 2.3);
    lnb.name = "LNB";
    tiltAssembly.add(lnb);

    // 10. Waveguide
    const waveGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.3, 8);
    const waveMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.1 });
    const waveguide = new THREE.Mesh(waveGeo, waveMat);
    waveguide.position.set(0, 0, 1.15);
    waveguide.rotation.x = Math.PI / 2;
    waveguide.name = "Waveguide";
    tiltAssembly.add(waveguide);

    // Animation
    station.userData.update = function(deltaTime) {
        const time = Date.now() * 0.001;
        // Azimuth (pan)
        panAssembly.rotation.y = Math.sin(time * 0.5) * Math.PI / 4;
        // Elevation (tilt)
        const tilt = Math.PI / 8 + Math.cos(time * 0.3) * Math.PI / 16;
        tiltAssembly.rotation.x = -tilt;
    };

    // Quiz
    station.userData.quiz = [
        {
            question: "What is the primary function of a Parabolic Dish in a satellite uplink station?",
            options: [
                "To generate electricity for the station",
                "To focus radio frequency signals into a narrow beam",
                "To store digital data before transmission",
                "To cool down the transmitter"
            ],
            correctAnswer: 1
        },
        {
            question: "What does LNB stand for in satellite communications?",
            options: [
                "Low Noise Block downconverter",
                "Large Network Broadcaster",
                "Linear Node Base",
                "Local Navigation Beacon"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the Feed Horn?",
            options: [
                "To produce sound alarms",
                "To gather reflected signals from the dish and route them to the LNB",
                "To provide physical support to the dish",
                "To measure wind speed"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component guides electromagnetic waves from the transmitter to the antenna?",
            options: [
                "Control Terminal",
                "Generator",
                "Waveguide",
                "Tracking Motor"
            ],
            correctAnswer: 2
        },
        {
            question: "Why is a Tracking Motor essential for some satellite uplink stations?",
            options: [
                "To keep the antenna aligned with a moving satellite in orbit",
                "To spin the dish to clean off debris",
                "To generate power from wind",
                "To transport the station to different locations"
            ],
            correctAnswer: 0
        },
        {
            question: "What role does the Transmitter play in an uplink station?",
            options: [
                "It decodes incoming signals from space",
                "It converts data into high-power radio frequency signals for spacebound transmission",
                "It monitors weather conditions",
                "It tracks the exact time of day"
            ],
            correctAnswer: 1
        }
    ];

    return station;
}
