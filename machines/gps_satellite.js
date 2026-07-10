export function createGpsSatellite(THREE) {
    const group = new THREE.Group();

    // Materials
    const goldFoilMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.3 });
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x00008b, metalness: 0.6, roughness: 0.4 });
    const silverMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    
    // 1. Main Bus
    const busGeometry = new THREE.BoxGeometry(2, 2, 3);
    const bus = new THREE.Mesh(busGeometry, goldFoilMaterial);
    group.add(bus);

    // 2. Solar Panel Left
    const panelGeometry = new THREE.BoxGeometry(4, 0.1, 1.5);
    const solarPanelLeftGroup = new THREE.Group();
    solarPanelLeftGroup.position.set(-1, 0, 0); // attachment point
    const solarPanelLeft = new THREE.Mesh(panelGeometry, solarPanelMaterial);
    solarPanelLeft.position.set(-2, 0, 0); // offset from attachment
    solarPanelLeftGroup.add(solarPanelLeft);
    group.add(solarPanelLeftGroup);

    // 3. Solar Panel Right
    const solarPanelRightGroup = new THREE.Group();
    solarPanelRightGroup.position.set(1, 0, 0);
    const solarPanelRight = new THREE.Mesh(panelGeometry, solarPanelMaterial);
    solarPanelRight.position.set(2, 0, 0);
    solarPanelRightGroup.add(solarPanelRight);
    group.add(solarPanelRightGroup);

    // 4. L-Band Navigation Antenna Array (Earth-facing, +Z direction)
    const lBandGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
    const lBandAntenna = new THREE.Mesh(lBandGeometry, whiteMaterial);
    lBandAntenna.position.set(0, 0, 1.6);
    group.add(lBandAntenna);

    // 5. Apogee Kick Motor (-Z direction)
    const akmGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.8, 16);
    const akm = new THREE.Mesh(akmGeometry, blackMaterial);
    akm.rotation.x = Math.PI / 2;
    akm.position.set(0, 0, -1.9);
    group.add(akm);

    // 6. S-Band Telemetry Antenna Group (to rotate around origin)
    const sBandGroup = new THREE.Group();
    sBandGroup.position.set(0.8, 1, 1.0);
    const sBandGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const sBandAntenna = new THREE.Mesh(sBandGeometry, silverMaterial);
    sBandAntenna.position.set(0, 0.75, 0);
    sBandGroup.add(sBandAntenna);
    group.add(sBandGroup);

    // 7. UHF Cross-link Antenna Group
    const uhfGroup = new THREE.Group();
    uhfGroup.position.set(-0.8, 1, 1.0);
    const uhfGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2);
    const uhfAntenna = new THREE.Mesh(uhfGeometry, silverMaterial);
    uhfAntenna.position.set(0, 0.6, 0);
    uhfGroup.add(uhfAntenna);
    group.add(uhfGroup);

    // 8. Laser Retroreflector Array
    const retroGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const retroReflector = new THREE.Mesh(retroGeometry, silverMaterial);
    retroReflector.position.set(0, 0.8, 1.55);
    group.add(retroReflector);

    // 9. Star Tracker
    const starTrackerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5);
    const starTracker = new THREE.Mesh(starTrackerGeometry, blackMaterial);
    starTracker.position.set(0, 1.15, 0);
    group.add(starTracker);

    // 10. Earth Sensor
    const earthSensorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3);
    const earthSensor = new THREE.Mesh(earthSensorGeometry, whiteMaterial);
    earthSensor.position.set(0, -1.15, 1.0);
    group.add(earthSensor);

    let time = 0;

    // Initial folded state
    solarPanelLeftGroup.rotation.z = Math.PI / 2; // Folded down along the bus
    solarPanelRightGroup.rotation.z = -Math.PI / 2;
    sBandGroup.rotation.x = -Math.PI / 2; // Folded flat against bus
    uhfGroup.rotation.x = -Math.PI / 2;

    return {
        model: group,
        update: (delta) => {
            time += delta;
            // Kinematics: Deployment and Tracking
            if (time < 5) {
                // Deployment phase (0 to 5 seconds)
                // Use smoothstep for smoother animation
                const t = time / 5;
                const smoothT = t * t * (3 - 2 * t);
                
                solarPanelLeftGroup.rotation.z = (1 - smoothT) * (Math.PI / 2);
                solarPanelRightGroup.rotation.z = -(1 - smoothT) * (Math.PI / 2);
                
                sBandGroup.rotation.x = (smoothT - 1) * (Math.PI / 2);
                uhfGroup.rotation.x = (smoothT - 1) * (Math.PI / 2);
            } else {
                // Tracking phase
                // Solar panels track the sun (oscillate for demonstration)
                const trackTime = time - 5;
                solarPanelLeftGroup.rotation.x = Math.sin(trackTime * 0.5) * 0.3;
                solarPanelRightGroup.rotation.x = Math.sin(trackTime * 0.5) * 0.3;
                
                // Satellite slowly adjusts orientation (Earth tracking orbit simulation)
                group.rotation.y = trackTime * 0.05;
            }
        },
        metadata: {
            quiz: [
                {
                    question: "What is the primary function of the L-Band antenna array on a GPS satellite?",
                    options: ["Solar power generation", "Transmitting navigation signals to Earth", "Communicating with other satellites", "Orbital maneuvering"],
                    answer: 1
                },
                {
                    question: "Why are solar panels on satellites often articulated (movable)?",
                    options: ["To avoid space debris", "To fold during launch", "To continuously track the sun for maximum power", "To cool down the satellite"],
                    answer: 2
                },
                {
                    question: "What is the purpose of the Star Tracker?",
                    options: ["To take photos of Earth", "To measure the distance to the moon", "To determine the satellite's orientation (attitude) by observing stars", "To track other satellites"],
                    answer: 2
                },
                {
                    question: "What material is typically used on the outer bus for thermal insulation?",
                    options: ["Lead shielding", "Multi-Layer Insulation (MLI), often appearing gold", "Black carbon fiber", "Solid aluminum"],
                    answer: 1
                },
                {
                    question: "What is an Apogee Kick Motor used for?",
                    options: ["Generating electricity", "Circularizing the orbit after reaching apogee", "Transmitting radio signals", "Cooling the internal computers"],
                    answer: 1
                },
                {
                    question: "What does the Laser Retroreflector Array do?",
                    options: ["Fires lasers to clear debris", "Reflects laser pulses from Earth to precisely measure the satellite's orbit", "Communicates with submarines", "Detects missile launches"],
                    answer: 1
                }
            ]
        }
    };
}
