export function createHurricaneHunterAircraft(THREE) {
    const group = new THREE.Group();

    // Materials
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const greyMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const darkGreyMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1e3f66 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.7 });
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x00cc44 });

    // 1. Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(2, 2, 20, 32);
    fuselageGeo.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, whiteMat);
    group.add(fuselage);

    // 2. Wings
    const wingGeo = new THREE.BoxGeometry(4, 0.4, 24);
    const wings = new THREE.Mesh(wingGeo, greyMat);
    wings.position.set(1, 0, 0);
    group.add(wings);

    // 3. Turboprop Engines (Group containing nacelles and animated propellers)
    const turbopropEngines = new THREE.Group();
    const propellers = [];
    // 4 engines: 2 on left wing, 2 on right wing
    const enginePositions = [
        [1.5, -0.4, 6], [1.5, -0.4, 10], [1.5, -0.4, -6], [1.5, -0.4, -10]
    ];
    
    enginePositions.forEach(pos => {
        const engineGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        engineGeo.rotateZ(Math.PI / 2);
        const engineMesh = new THREE.Mesh(engineGeo, greyMat);
        engineMesh.position.set(pos[0], pos[1], pos[2]);
        
        // Propeller
        const propGeo = new THREE.BoxGeometry(0.1, 3.5, 0.4);
        const propMesh = new THREE.Mesh(propGeo, blackMat);
        // Position propeller at the front of the engine nacelle
        propMesh.position.set(pos[0] + 1.6, pos[1], pos[2]);
        propellers.push(propMesh);
        
        turbopropEngines.add(engineMesh);
        turbopropEngines.add(propMesh);
    });
    group.add(turbopropEngines);

    // 4. Tail Assembly
    const tailAssembly = new THREE.Group();
    const vTailGeo = new THREE.BoxGeometry(3, 4, 0.4);
    const vTail = new THREE.Mesh(vTailGeo, whiteMat);
    vTail.position.set(-8, 3, 0);
    
    const hTailGeo = new THREE.BoxGeometry(2, 0.3, 8);
    const hTail = new THREE.Mesh(hTailGeo, greyMat);
    hTail.position.set(-9, 1, 0);
    
    tailAssembly.add(vTail);
    tailAssembly.add(hTail);
    group.add(tailAssembly);

    // 5. Nose Radome (weather radar at the front)
    const radomeGeo = new THREE.SphereGeometry(2, 32, 32);
    const noseRadome = new THREE.Mesh(radomeGeo, blackMat);
    noseRadome.scale.set(1.5, 1, 1);
    noseRadome.position.set(10, 0, 0);
    group.add(noseRadome);

    // 6. Step-Frequency Microwave Radiometer (SFMR) pod under the wing
    const sfmrGeo = new THREE.BoxGeometry(1.2, 0.6, 0.6);
    const sfmr = new THREE.Mesh(sfmrGeo, blueMat);
    sfmr.position.set(1, -0.8, 11);
    group.add(sfmr);

    // 7. Dropsonde Launch Tube (bottom of fuselage)
    const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
    const dropsondeLaunchTube = new THREE.Mesh(tubeGeo, darkGreyMat);
    dropsondeLaunchTube.position.set(-2, -2, 0);
    group.add(dropsondeLaunchTube);

    // 8. Flight Deck (Cockpit windows)
    const deckGeo = new THREE.BoxGeometry(3, 1.2, 2.5);
    const flightDeck = new THREE.Mesh(deckGeo, glassMat);
    flightDeck.position.set(6, 1.6, 0);
    group.add(flightDeck);

    // 9. Tail Radar Pod (Doppler radar sticking out the back)
    const tailPodGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    tailPodGeo.rotateZ(Math.PI / 2);
    const tailRadarPod = new THREE.Mesh(tailPodGeo, greyMat);
    tailRadarPod.position.set(-11, 3, 0);
    group.add(tailRadarPod);

    // 10. Data Systems Console (visible through cutaway or partially exposed for educational purposes)
    const consoleGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const dataSystemsConsole = new THREE.Mesh(consoleGeo, consoleMat);
    // Placed on the outside / protruding slightly to make it easily recognizable as a distinct part
    dataSystemsConsole.position.set(-1, 0, 1.8);
    group.add(dataSystemsConsole);

    // Animation function
    const update = (deltaTime) => {
        // Prevent undefined deltaTime errors
        const dt = deltaTime !== undefined ? deltaTime : 0.016;
        const rotationSpeed = 25 * dt;
        
        propellers.forEach(prop => {
            // Spin propellers around the X axis since they face forward (+X)
            prop.rotation.x += rotationSpeed;
        });
    };

    // Quiz Questions
    const quiz = [
        {
            question: "What is the primary function of the Step-Frequency Microwave Radiometer (SFMR) on a Hurricane Hunter?",
            options: [
                "To measure surface wind speeds and rain rates directly below the aircraft",
                "To measure the altitude of the aircraft",
                "To launch dropsondes",
                "To communicate with satellites"
            ],
            answer: "To measure surface wind speeds and rain rates directly below the aircraft"
        },
        {
            question: "What does a dropsonde do?",
            options: [
                "It drops from the aircraft to collect temperature, humidity, and wind data as it falls to the ocean",
                "It serves as a radar decoy",
                "It measures the cloud ceiling height",
                "It intercepts radio frequencies from storms"
            ],
            answer: "It drops from the aircraft to collect temperature, humidity, and wind data as it falls to the ocean"
        },
        {
            question: "Why do Hurricane Hunters fly directly into the eye of a hurricane?",
            options: [
                "To obtain the most accurate readings of the central pressure and maximum winds",
                "To practice extreme weather navigation",
                "To drop chemical suppressants to weaken the storm",
                "Because the eye wall is the safest part of the storm"
            ],
            answer: "To obtain the most accurate readings of the central pressure and maximum winds"
        },
        {
            question: "What aircraft type is most commonly known as the 'Hurricane Hunter' used by NOAA and the USAF?",
            options: [
                "Lockheed WP-3D Orion and WC-130J Super Hercules",
                "Boeing 747",
                "Cessna 172",
                "F-22 Raptor"
            ],
            answer: "Lockheed WP-3D Orion and WC-130J Super Hercules"
        },
        {
            question: "What is the purpose of the Tail Radar Pod (Tail Doppler Radar)?",
            options: [
                "To scan the storm vertically and horizontally to map precipitation and wind structures",
                "To detect enemy aircraft",
                "To measure water temperature",
                "To provide a counterweight to the nose radome"
            ],
            answer: "To scan the storm vertically and horizontally to map precipitation and wind structures"
        },
        {
            question: "Who monitors and interprets the data from the dropsondes and radars onboard?",
            options: [
                "Meteorologists and flight directors at the Data Systems Console",
                "The pilot flying the aircraft",
                "Ground control via satellite only",
                "The navigator"
            ],
            answer: "Meteorologists and flight directors at the Data Systems Console"
        }
    ];

    return {
        group,
        update,
        quiz
    };
}
