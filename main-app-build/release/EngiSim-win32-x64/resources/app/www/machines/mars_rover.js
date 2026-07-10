export function createMarsRover(THREE) {
    const group = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.3 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    
    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(2, 0.8, 3);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = 1.5;
    group.add(chassis);

    // 2. Rocker-Bogie Suspension
    const suspensionGeo = new THREE.CylinderGeometry(0.08, 0.08, 4);
    const suspensionL = new THREE.Mesh(suspensionGeo, darkMat);
    suspensionL.rotation.x = Math.PI / 2;
    suspensionL.position.set(-1.2, 1.5, 0);
    const suspensionR = suspensionL.clone();
    suspensionR.position.set(1.2, 1.5, 0);
    group.add(suspensionL);
    group.add(suspensionR);

    // 3. Wheels
    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 24);
    wheelGeo.rotateZ(Math.PI / 2);
    
    const wheelPositions = [
        [-1.35, 0.4, 1.5], [-1.35, 0.4, 0], [-1.35, 0.4, -1.5],
        [1.35, 0.4, 1.5], [1.35, 0.4, 0], [1.35, 0.4, -1.5]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(...pos);
        
        // Add spokes/treads for visual rotation
        const spokeGeo = new THREE.BoxGeometry(0.32, 0.1, 0.8);
        const spoke1 = new THREE.Mesh(spokeGeo, whiteMat);
        const spoke2 = new THREE.Mesh(spokeGeo, whiteMat);
        spoke2.rotation.x = Math.PI / 2;
        wheel.add(spoke1);
        wheel.add(spoke2);
        
        wheels.push(wheel);
        group.add(wheel);
    });

    // 4. Mast (Camera)
    const mastGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.5);
    const mast = new THREE.Mesh(mastGeo, whiteMat);
    mast.position.set(0.8, 2.5, 1.2);
    
    const camGeo = new THREE.BoxGeometry(0.4, 0.2, 0.3);
    const camera = new THREE.Mesh(camGeo, darkMat);
    camera.position.y = 0.75;
    mast.add(camera);
    group.add(mast);

    // 5. RTG Power Source
    const rtgGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const rtg = new THREE.Mesh(rtgGeo, goldMat);
    rtg.position.set(0, 2.0, -1.2);
    rtg.rotation.z = Math.PI / 2;
    group.add(rtg);

    // 6. Robotic Arm
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
    const arm = new THREE.Mesh(armGeo, whiteMat);
    arm.position.set(0, 1.4, 2.0);
    arm.rotation.x = -Math.PI / 4;
    group.add(arm);

    // 7. Drill
    const drillGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5);
    const drill = new THREE.Mesh(drillGeo, darkMat);
    drill.position.set(0, -0.75, 0);
    arm.add(drill);

    // 8. High-Gain Antenna
    const hgaGroup = new THREE.Group();
    hgaGroup.position.set(-0.8, 2.0, -0.8);
    const hgaDishGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const hgaDish = new THREE.Mesh(hgaDishGeo, whiteMat);
    hgaDish.rotation.x = -Math.PI / 2;
    const hgaBaseGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    const hgaBase = new THREE.Mesh(hgaBaseGeo, darkMat);
    hgaBase.position.y = -0.2;
    hgaGroup.add(hgaDish);
    hgaGroup.add(hgaBase);
    group.add(hgaGroup);

    // 9. UHF Antenna
    const uhfGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const uhf = new THREE.Mesh(uhfGeo, darkMat);
    uhf.position.set(0.6, 2.2, -0.8);
    group.add(uhf);

    // 10. Spectrometer
    const specGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
    const spec = new THREE.Mesh(specGeo, goldMat);
    spec.position.set(0, 2.1, 0);
    group.add(spec);

    // Update function for animation
    let time = 0;
    function update(delta) {
        time += delta;
        // Animate wheels
        wheels.forEach(w => {
            w.rotation.x += delta * 1.5;
        });
        
        // Animate mast (panning)
        mast.rotation.y = Math.sin(time * 0.8) * 0.6;
        
        // Animate high-gain antenna (tracking)
        hgaGroup.rotation.y = Math.cos(time * 0.5) * 0.4;
        hgaGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // Quiz questions
    const questions = [
        {
            question: "What is the purpose of the Rocker-Bogie suspension system on a rover?",
            options: [
                "To increase the rover's top speed",
                "To keep all wheels on the ground over uneven terrain",
                "To store additional battery power",
                "To act as an antenna for communication"
            ],
            correctAnswer: 1,
            explanation: "The rocker-bogie suspension is designed to maintain contact with the ground for all wheels, providing stability and traction over obstacles."
        },
        {
            question: "What does RTG stand for in the context of rover power sources?",
            options: [
                "Rotating Terrain Gear",
                "Radioisotope Thermoelectric Generator",
                "Rover Tracking Group",
                "Redundant Telemetry Gadget"
            ],
            correctAnswer: 1,
            explanation: "An RTG uses the heat from the natural decay of radioisotopes to generate electricity, providing reliable power for missions where solar power is insufficient."
        },
        {
            question: "Why are rover wheels typically made of rigid materials like aluminum rather than rubber tires?",
            options: [
                "Rubber is too heavy",
                "Rubber becomes brittle and breaks in extreme cold and radiation",
                "Aluminum provides better grip on ice",
                "Aluminum is cheaper to manufacture"
            ],
            correctAnswer: 1,
            explanation: "The extreme temperatures and high radiation environments on planets like Mars cause rubber to degrade, become brittle, and shatter, making metal wheels necessary."
        },
        {
            question: "What is the primary function of a High-Gain Antenna on a planetary rover?",
            options: [
                "To communicate directly with Earth at high data rates",
                "To search for underground water",
                "To transmit power to orbiting satellites",
                "To provide local Wi-Fi for the rover's instruments"
            ],
            correctAnswer: 0,
            explanation: "The High-Gain Antenna focuses radio signals into a narrow beam, allowing the rover to transmit large amounts of data directly to Earth over interplanetary distances."
        },
        {
            question: "How does a rover's spectrometer aid in planetary exploration?",
            options: [
                "By measuring the exact distance to Earth",
                "By analyzing light to determine the chemical composition of rocks and soil",
                "By generating oxygen for future missions",
                "By recording high-definition video of the terrain"
            ],
            correctAnswer: 1,
            explanation: "Spectrometers analyze the spectrum of light emitted, absorbed, or scattered by materials to identify their chemical elements and mineralogy."
        },
        {
            question: "What is the typical time delay (one-way light time) for communicating with a rover on Mars?",
            options: [
                "Almost instantaneous",
                "About 3 to 22 minutes depending on planetary alignment",
                "Exactly 1 hour",
                "More than a day"
            ],
            correctAnswer: 1,
            explanation: "Because of the vast distance between Earth and Mars, radio signals take anywhere from roughly 3 minutes to 22 minutes to travel one way, making real-time remote control impossible."
        }
    ];

    return {
        group,
        update,
        questions
    };
}
