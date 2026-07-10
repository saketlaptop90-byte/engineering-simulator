export function createTsunamiWarningBuoy(THREE) {
    const model = new THREE.Group();

    // Materials
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.6, metalness: 0.2 });
    const grayMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, metalness: 0.1 });
    const darkGrayMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9, metalness: 0.1 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.5, metalness: 0.3 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, roughness: 0.2, metalness: 0.8 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.5 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.6 });
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0x800080, roughness: 0.5 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc143c, roughness: 0.7 });

    const surfaceGroup = new THREE.Group();
    model.add(surfaceGroup);

    // 1. Surface Float
    const floatGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 32);
    const surfaceFloat = new THREE.Mesh(floatGeo, yellowMat);
    surfaceFloat.position.set(0, 0, 0);
    surfaceGroup.add(surfaceFloat);

    // 2. Solar Panels
    const solarGeo = new THREE.BoxGeometry(2.2, 0.05, 2.2);
    const solarPanels = new THREE.Mesh(solarGeo, blueMat);
    solarPanels.position.set(0, 0.625, 0);
    surfaceGroup.add(solarPanels);

    // 3. Telemetry Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.04, 0.04, 3, 8);
    const telemetryAntenna = new THREE.Mesh(antennaGeo, whiteMat);
    telemetryAntenna.position.set(0, 2.1, 0);
    surfaceGroup.add(telemetryAntenna);

    // 4. Battery Module
    const batteryGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const batteryModule = new THREE.Mesh(batteryGeo, greenMat);
    batteryModule.position.set(0.6, 0.9, 0.6); // Placed slightly above float
    surfaceGroup.add(batteryModule);

    // 5. CPU Controller
    const cpuGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const cpuController = new THREE.Mesh(cpuGeo, purpleMat);
    cpuController.position.set(-0.6, 0.85, -0.6);
    surfaceGroup.add(cpuController);

    // 6. Acoustic Transducer
    const transducerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const acousticTransducer = new THREE.Mesh(transducerGeo, blackMat);
    acousticTransducer.position.set(0, -1.0, 0);
    surfaceGroup.add(acousticTransducer);

    // Subsurface components
    
    // 7. Mooring Line
    const mooringGeo = new THREE.CylinderGeometry(0.05, 0.05, 18.5, 8);
    const mooringLine = new THREE.Mesh(mooringGeo, grayMat);
    mooringLine.position.set(0, -9.25, 0);
    model.add(mooringLine);

    // 8. Anchor
    const anchorGeo = new THREE.BoxGeometry(2.5, 1.2, 2.5);
    const anchor = new THREE.Mesh(anchorGeo, darkGrayMat);
    anchor.position.set(0, -19.1, 0);
    model.add(anchor);

    // 9. Acoustic Release
    const releaseGeo = new THREE.CylinderGeometry(0.25, 0.25, 1, 16);
    const acousticRelease = new THREE.Mesh(releaseGeo, redMat);
    acousticRelease.position.set(0, -18.0, 0);
    model.add(acousticRelease);

    // 10. Bottom Pressure Recorder
    const bprGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const bottomPressureRecorder = new THREE.Mesh(bprGeo, orangeMat);
    bottomPressureRecorder.position.set(4, -18.9, 0);
    model.add(bottomPressureRecorder);

    const parts = [
        {
            name: "Surface Float",
            description: "The main buoyant structure that houses communication equipment and stays on the ocean surface.",
            mesh: surfaceFloat
        },
        {
            name: "Mooring Line",
            description: "A long cable that connects the surface float to the anchor on the ocean floor.",
            mesh: mooringLine
        },
        {
            name: "Bottom Pressure Recorder",
            description: "A highly sensitive device on the seafloor that detects minute changes in water pressure indicative of a passing tsunami.",
            mesh: bottomPressureRecorder
        },
        {
            name: "Acoustic Transducer",
            description: "Receives acoustic data signals from the Bottom Pressure Recorder and transmits them to the surface buoy.",
            mesh: acousticTransducer
        },
        {
            name: "Solar Panels",
            description: "Provides renewable energy to charge the buoy's batteries.",
            mesh: solarPanels
        },
        {
            name: "Telemetry Antenna",
            description: "Transmits tsunami data from the surface float to satellite networks and warning centers.",
            mesh: telemetryAntenna
        },
        {
            name: "Anchor",
            description: "A heavy weight that secures the entire mooring system to the seabed.",
            mesh: anchor
        },
        {
            name: "Battery Module",
            description: "Stores electrical energy from the solar panels to power the buoy continuously.",
            mesh: batteryModule
        },
        {
            name: "CPU Controller",
            description: "The main computer unit that processes data, manages communications, and controls buoy operations.",
            mesh: cpuController
        },
        {
            name: "Acoustic Release",
            description: "A mechanism that can be triggered acoustically to disconnect the mooring line from the anchor for maintenance or recovery.",
            mesh: acousticRelease
        }
    ];

    const quizzes = [
        {
            question: "What is the primary purpose of the Bottom Pressure Recorder (BPR)?",
            options: [
                "To measure wave height",
                "To detect tiny changes in water pressure caused by tsunamis",
                "To anchor the mooring line",
                "To power the buoy"
            ],
            correctAnswer: 1
        },
        {
            question: "How does the BPR communicate with the surface buoy?",
            options: [
                "Via satellite",
                "Through physical wires",
                "Using an acoustic transducer",
                "Via radio waves"
            ],
            correctAnswer: 2
        },
        {
            question: "What provides power to the surface buoy's electronics?",
            options: [
                "Tidal energy",
                "Solar panels and a battery module",
                "Geothermal heat",
                "Wind turbines"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the function of the telemetry antenna?",
            options: [
                "To transmit data to warning centers via satellite",
                "To listen to whales",
                "To communicate with the BPR",
                "To measure wind speed"
            ],
            correctAnswer: 0
        },
        {
            question: "Which component secures the buoy system to the ocean floor?",
            options: [
                "Surface Float",
                "Mooring Line",
                "Acoustic Release",
                "Anchor"
            ],
            correctAnswer: 3
        },
        {
            question: "What is the purpose of the acoustic release mechanism?",
            options: [
                "To make loud noises to scare marine life",
                "To detach the mooring line from the anchor for maintenance and recovery",
                "To release air bubbles",
                "To deploy the Bottom Pressure Recorder"
            ],
            correctAnswer: 1
        }
    ];

    function update(time) {
        // Buoy bobs up and down with the ocean waves
        surfaceGroup.position.y = Math.sin(time * 2) * 0.3;
        
        // Slight rotation to simulate wave tilt
        surfaceGroup.rotation.z = Math.sin(time * 1.5) * 0.05;
        surfaceGroup.rotation.x = Math.cos(time * 1.2) * 0.05;
    }

    return { model, update, parts, quizzes };
}
