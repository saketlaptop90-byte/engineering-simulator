export function createSubmersibleROV(THREE) {
    const group = new THREE.Group();

    const parts = [
        { id: "frame", name: "Frame", description: "Main structural skeleton protecting the internal components." },
        { id: "buoyancy", name: "Buoyancy Foam", description: "Syntactic foam blocks providing neutral buoyancy in deep water." },
        { id: "thrusters", name: "Thrusters", description: "Propulsion units for multi-directional maneuverability." },
        { id: "arm", name: "Manipulator Arm", description: "Robotic arm used for sampling and interacting with marine environments." },
        { id: "camera", name: "Camera", description: "High-definition camera for observing marine life and geology." },
        { id: "lights", name: "Lighting System", description: "LED arrays to illuminate the dark abyssal zones." },
        { id: "tether", name: "Tether", description: "Umbilical cable providing power and real-time data transfer." },
        { id: "tms", name: "TMS", description: "Tether Management System to prevent cable entanglement." },
        { id: "sensors", name: "Sensors", description: "Instruments like CTD and Sonar to measure water properties." },
        { id: "battery", name: "Battery Pack", description: "Auxiliary power unit for emergency operations." }
    ];

    // 1. Frame
    const frameGeo = new THREE.BoxGeometry(2.5, 1.5, 3.5);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x555555, wireframe: true });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    group.add(frameMesh);

    // 2. Buoyancy Foam (top block)
    const foamGeo = new THREE.BoxGeometry(2.4, 0.5, 3.4);
    const foamMat = new THREE.MeshStandardMaterial({ color: 0xeed202 });
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    foamMesh.position.y = 1;
    group.add(foamMesh);

    // 3. Thrusters (4 corners)
    const thrusterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const thrusters = new THREE.Group();
    const positions = [
        [-1.3, -0.5, 1.5], [1.3, -0.5, 1.5],
        [-1.3, -0.5, -1.5], [1.3, -0.5, -1.5]
    ];
    const props = [];
    positions.forEach(pos => {
        const t = new THREE.Mesh(thrusterGeo, thrusterMat);
        t.position.set(...pos);
        t.rotation.x = Math.PI / 2;
        
        // Propeller
        const propGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05);
        const propMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const prop = new THREE.Mesh(propGeo, propMat);
        prop.position.y = 0.35;
        t.add(prop);
        props.push(prop);
        
        thrusters.add(t);
    });
    group.add(thrusters);

    // 4. Manipulator Arm
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const armMesh = new THREE.Mesh(armGeo, armMat);
    armMesh.position.set(0.5, -0.5, 2);
    armMesh.rotation.x = Math.PI / 4;
    group.add(armMesh);

    // 5. Camera (front)
    const camGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const camMesh = new THREE.Mesh(camGeo, camMat);
    camMesh.position.set(0, 0.2, 1.8);
    group.add(camMesh);

    // 6. Lighting System
    const lightGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff });
    const light1 = new THREE.Mesh(lightGeo, lightMat);
    light1.position.set(-0.8, 0.5, 1.8);
    light1.rotation.x = Math.PI / 2;
    const light2 = light1.clone();
    light2.position.set(0.8, 0.5, 1.8);
    group.add(light1, light2);

    // 7. Tether (cable going up)
    const tetherGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const tetherMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const tetherMesh = new THREE.Mesh(tetherGeo, tetherMat);
    tetherMesh.position.set(0, 2.5, -1);
    group.add(tetherMesh);

    // 8. TMS (small box at end of tether)
    const tmsGeo = new THREE.BoxGeometry(1, 0.5, 1);
    const tmsMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const tmsMesh = new THREE.Mesh(tmsGeo, tmsMat);
    tmsMesh.position.set(0, 4, -1);
    group.add(tmsMesh);

    // 9. Sensors (side cylinders)
    const sensorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(-1.4, 0, 0);
    group.add(sensorMesh);

    // 10. Battery Pack (bottom)
    const batteryGeo = new THREE.BoxGeometry(1.5, 0.4, 2);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const batteryMesh = new THREE.Mesh(batteryGeo, batteryMat);
    batteryMesh.position.set(0, -0.7, 0);
    group.add(batteryMesh);

    const questions = [
        {
            question: "What is the primary role of an ROV in marine biology?",
            options: [
                "Catching fish for commercial use",
                "Observing and sampling deep-sea marine life and habitats",
                "Transporting passengers underwater",
                "Generating underwater currents"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is syntactic foam used as buoyancy material in deep-sea ROVs?",
            options: [
                "It expands under pressure",
                "It is completely fireproof",
                "It can withstand immense hydrostatic pressure without crushing",
                "It dissolves slowly in saltwater to release nutrients"
            ],
            correctAnswer: 2
        },
        {
            question: "How are ROVs primarily powered and controlled?",
            options: [
                "Wind energy",
                "Solar panels on the surface",
                "Internal combustion engines",
                "Through an umbilical tether connected to a surface ship"
            ],
            correctAnswer: 3
        },
        {
            question: "Which of the following is a common sensor on a marine biology ROV to measure water properties?",
            options: [
                "Anemometer",
                "CTD (Conductivity, Temperature, Depth)",
                "Seismograph",
                "Barometer"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Manipulator Arm on an ROV?",
            options: [
                "To steer the ROV",
                "To defend against sharks",
                "To gently collect delicate biological and geological samples",
                "To clean the camera lens"
            ],
            correctAnswer: 2
        },
        {
            question: "Why are powerful lighting systems essential for deep-sea ROVs?",
            options: [
                "To scare away predators",
                "To provide warmth for the electronics",
                "Because sunlight does not penetrate into the deep ocean (aphotic zone)",
                "To communicate with other ROVs using Morse code"
            ],
            correctAnswer: 2
        }
    ];

    let time = 0;
    const animate = () => {
        time += 0.05;
        // Spin propellers
        props.forEach(prop => {
            prop.rotation.y += 0.3;
        });
        // Slight hovering motion for the whole ROV
        group.position.y = Math.sin(time) * 0.1;
        // Slow movement of manipulator arm
        armMesh.rotation.z = Math.sin(time * 0.5) * 0.2;
    };

    return {
        model: group,
        parts,
        questions,
        animate
    };
}
