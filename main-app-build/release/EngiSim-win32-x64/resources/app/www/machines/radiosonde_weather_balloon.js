export function createRadiosondeWeatherBalloon(THREE) {
    const group = new THREE.Group();

    // 10 distinct parts

    // 1. Latex Balloon
    const balloonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const balloonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.8 
    });
    const latexBalloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
    latexBalloon.position.set(0, 5, 0);
    group.add(latexBalloon);

    // 2. Parachute
    const parachuteGeometry = new THREE.ConeGeometry(0.8, 1, 16);
    const parachuteMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const parachute = new THREE.Mesh(parachuteGeometry, parachuteMaterial);
    parachute.position.set(0, 2.5, 0);
    group.add(parachute);

    // 3. Unwinder
    const unwinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
    const unwinderMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const unwinder = new THREE.Mesh(unwinderGeometry, unwinderMaterial);
    unwinder.position.set(0, 1.8, 0);
    group.add(unwinder);

    // 4. Flight String
    const stringMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const stringPoints = [
        new THREE.Vector3(0, 3, 0), // From balloon base
        new THREE.Vector3(0, -1.0, 0) // To radiosonde housing
    ];
    const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const flightString = new THREE.Line(stringGeometry, stringMaterial);
    group.add(flightString);

    // 5. Radiosonde Housing
    const housingGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.3);
    const housingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const radiosondeHousing = new THREE.Mesh(housingGeometry, housingMaterial);
    radiosondeHousing.position.set(0, -1.3, 0);
    group.add(radiosondeHousing);

    // 6. Thermistor Boom
    const boomGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
    const boomMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const thermistorBoom = new THREE.Mesh(boomGeometry, boomMaterial);
    thermistorBoom.position.set(0.25, -1.2, 0);
    thermistorBoom.rotation.z = Math.PI / 4;
    group.add(thermistorBoom);

    // 7. Hygristor
    const hygristorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
    const hygristorMaterial = new THREE.MeshStandardMaterial({ color: 0x2222ff });
    const hygristor = new THREE.Mesh(hygristorGeometry, hygristorMaterial);
    hygristor.position.set(0.35, -1.1, 0);
    group.add(hygristor);

    // 8. GPS Antenna
    const gpsGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const gpsMaterial = new THREE.MeshStandardMaterial({ color: 0x22ff22 });
    const gpsAntenna = new THREE.Mesh(gpsGeometry, gpsMaterial);
    gpsAntenna.position.set(0, -0.9, 0);
    group.add(gpsAntenna);

    // 9. Radio Transmitter
    const txGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.4);
    const txMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const radioTransmitter = new THREE.Mesh(txGeometry, txMaterial);
    radioTransmitter.position.set(-0.1, -1.6, 0);
    group.add(radioTransmitter);

    // 10. Battery Pack
    const batteryGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    const batteryMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const batteryPack = new THREE.Mesh(batteryGeometry, batteryMaterial);
    batteryPack.position.set(0, -1.5, 0);
    group.add(batteryPack);

    // Animation: swaying and balloon expanding
    let time = 0;
    const update = (delta) => {
        const dt = delta || 0.016;
        time += dt;
        
        // Gentle swaying of the entire assembly due to wind
        group.rotation.z = Math.sin(time * 0.5) * 0.05;
        group.position.y = Math.sin(time * 0.3) * 0.1;

        // Expanding balloon slightly as if rising to lower pressures
        const scale = 1 + Math.sin(time * 0.2) * 0.05;
        latexBalloon.scale.set(scale, scale, scale);
    };

    // Quiz questions
    const quiz = [
        {
            question: "What is the primary purpose of a radiosonde?",
            options: [
                "To measure atmospheric pressure, temperature, and humidity", 
                "To act as a satellite communication relay", 
                "To track migrating birds", 
                "To clean the atmosphere of greenhouse gases"
            ],
            answer: 0
        },
        {
            question: "What does the thermistor boom measure?",
            options: ["Wind speed", "Temperature", "Radiation", "Humidity"],
            answer: 1
        },
        {
            question: "Which component measures humidity on a radiosonde?",
            options: ["Thermistor", "GPS Antenna", "Hygristor", "Radio Transmitter"],
            answer: 2
        },
        {
            question: "How does a modern radiosonde calculate wind speed and direction?",
            options: [
                "Anemometer attached to the balloon", 
                "Tracking the GPS antenna's position over time", 
                "Measuring the sway of the flight string", 
                "Using a compass in the radiosonde housing"
            ],
            answer: 1
        },
        {
            question: "Why does the latex balloon expand as it rises?",
            options: [
                "Heating from the sun", 
                "Chemical reaction inside the balloon", 
                "Decreasing atmospheric pressure outside the balloon", 
                "Continuous pumping of gas from the unwinder"
            ],
            answer: 2
        },
        {
            question: "What happens to the radiosonde when the balloon bursts?",
            options: [
                "It deploys a parachute and falls back to Earth", 
                "It burns up in the atmosphere", 
                "It stays in orbit indefinitely", 
                "It glides back to the launch site automatically"
            ],
            answer: 0
        }
    ];

    return {
        group,
        update,
        quiz
    };
}
