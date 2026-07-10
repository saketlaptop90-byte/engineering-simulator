export function createRadarAltimeter(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const getMaterial = (color) => new THREE.MeshStandardMaterial({ color: color, roughness: 0.7, metalness: 0.3 });

    // 1. Transmitting antenna
    const txAntennaGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const txAntennaMat = getMaterial(0xaaaaaa);
    const txAntenna = new THREE.Mesh(txAntennaGeom, txAntennaMat);
    txAntenna.position.set(-1, -0.5, 1);
    txAntenna.userData = { name: "Transmitting antenna", description: "Emits continuous or pulsed radio frequency waves towards the ground." };
    group.add(txAntenna);
    parts.push(txAntenna);

    // 2. Receiving antenna
    const rxAntennaGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const rxAntennaMat = getMaterial(0x888888);
    const rxAntenna = new THREE.Mesh(rxAntennaGeom, rxAntennaMat);
    rxAntenna.position.set(1, -0.5, 1);
    rxAntenna.userData = { name: "Receiving antenna", description: "Collects the reflected radio waves returning from the ground." };
    group.add(rxAntenna);
    parts.push(rxAntenna);

    // 3. Transmitter unit
    const txUnitGeom = new THREE.BoxGeometry(1.5, 1, 1);
    const txUnitMat = getMaterial(0x333333);
    const txUnit = new THREE.Mesh(txUnitGeom, txUnitMat);
    txUnit.position.set(-1, 0.5, -0.5);
    txUnit.userData = { name: "Transmitter unit", description: "Generates the radio frequency signal to be transmitted." };
    group.add(txUnit);
    parts.push(txUnit);

    // 4. Receiver unit
    const rxUnitGeom = new THREE.BoxGeometry(1.5, 1, 1);
    const rxUnitMat = getMaterial(0x444444);
    const rxUnit = new THREE.Mesh(rxUnitGeom, rxUnitMat);
    rxUnit.position.set(1, 0.5, -0.5);
    rxUnit.userData = { name: "Receiver unit", description: "Amplifies and processes the weak reflected signals received." };
    group.add(rxUnit);
    parts.push(rxUnit);

    // 5. Signal processor
    const processorGeom = new THREE.BoxGeometry(2, 0.5, 1);
    const processorMat = getMaterial(0x225588);
    const processor = new THREE.Mesh(processorGeom, processorMat);
    processor.position.set(0, 1.5, -0.5);
    processor.userData = { name: "Signal processor", description: "Calculates altitude based on the time delay or frequency shift of the signal." };
    group.add(processor);
    parts.push(processor);

    // 6. Display unit
    const displayGeom = new THREE.PlaneGeometry(1, 0.8);
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const display = new THREE.Mesh(displayGeom, displayMat);
    display.position.set(0, 2.5, -0.5);
    display.userData = { name: "Display unit", description: "Shows the calculated altitude to the flight crew." };
    group.add(display);
    parts.push(display);

    // 7. Power supply
    const powerGeom = new THREE.BoxGeometry(1, 1, 1);
    const powerMat = getMaterial(0x882222);
    const power = new THREE.Mesh(powerGeom, powerMat);
    power.position.set(2.5, 0.5, -0.5);
    power.userData = { name: "Power supply", description: "Provides necessary electrical power to all system components." };
    group.add(power);
    parts.push(power);

    // 8. Coaxial cables
    const cablesGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const cablesMat = getMaterial(0x111111);
    const cables = new THREE.Mesh(cablesGeom, cablesMat);
    cables.rotation.x = Math.PI / 2;
    cables.position.set(0, 0, 0.25);
    cables.userData = { name: "Coaxial cables", description: "Connects antennas to the transmitter and receiver units." };
    group.add(cables);
    parts.push(cables);

    // 9. Calibration unit
    const calibGeom = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    const calibMat = getMaterial(0xddaa00);
    const calib = new THREE.Mesh(calibGeom, calibMat);
    calib.position.set(-2.5, 0.25, -0.5);
    calib.userData = { name: "Calibration unit", description: "Ensures the accuracy of the altimeter by providing reference signals." };
    group.add(calib);
    parts.push(calib);

    // 10. Interface module
    const interfaceGeom = new THREE.BoxGeometry(1.2, 0.4, 0.8);
    const interfaceMat = getMaterial(0x55aa55);
    const interfaceModule = new THREE.Mesh(interfaceGeom, interfaceMat);
    interfaceModule.position.set(0, 2, -0.5);
    interfaceModule.userData = { name: "Interface module", description: "Connects the altimeter data to other avionics systems like autopilot." };
    group.add(interfaceModule);
    parts.push(interfaceModule);

    // Animation variables
    let time = 0;

    // Simulate radar wave visually
    const waveGeom = new THREE.RingGeometry(0.1, 0.2, 32);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const wave = new THREE.Mesh(waveGeom, waveMat);
    wave.rotation.x = Math.PI / 2;
    wave.position.set(-1, -0.6, 1);
    group.add(wave);

    group.update = function(delta) {
        time += delta;

        // Wave expands and resets
        const scale = (time % 2) * 5;
        wave.scale.set(scale, scale, scale);
        wave.material.opacity = Math.max(0, 1 - (time % 2) / 2);

        // Subtly blink display unit
        display.material.opacity = Math.abs(Math.sin(time * 5)) > 0.5 ? 1 : 0.8;
    };

    group.parts = parts;

    group.quizzes = [
        {
            question: "What is the primary function of the Transmitting antenna?",
            options: [
                "To cool the internal components",
                "To display altitude data",
                "To emit radio frequency waves towards the ground",
                "To connect to the aircraft autopilot"
            ],
            correctAnswer: 2
        },
        {
            question: "Which component processes the returning signals to calculate altitude?",
            options: [
                "Signal processor",
                "Power supply",
                "Receiving antenna",
                "Coaxial cables"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the role of the Receiver unit?",
            options: [
                "It generates the transmission pulse",
                "It amplifies and processes the weak reflected signals",
                "It provides the primary power supply",
                "It displays the altitude to the crew"
            ],
            correctAnswer: 1
        },
        {
            question: "How do the transmitter and receiver units connect to their respective antennas?",
            options: [
                "Via wireless bluetooth links",
                "Using heavy steel chains",
                "Through Coaxial cables",
                "Via the Interface module directly"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the Calibration unit do?",
            options: [
                "Provides reference signals to ensure altimeter accuracy",
                "Stores historical flight data",
                "Absorbs excess heat from the transmitter",
                "Cools the receiving antenna"
            ],
            correctAnswer: 0
        },
        {
            question: "Where is the computed altitude visually presented to the pilots?",
            options: [
                "On the Display unit",
                "In the Calibration unit",
                "On the Receiving antenna",
                "Through the Power supply LED"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
