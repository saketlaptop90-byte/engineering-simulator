export function createRovManipulator(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // 1. ROV Frame
    const frameGeometry = new THREE.BoxGeometry(2, 1.5, 3);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    model.add(frame);
    parts.push({ name: "ROV Frame", description: "Structural chassis holding all components together.", mesh: frame });

    // 2. Buoyancy block
    const buoyancyGeom = new THREE.BoxGeometry(2.1, 0.6, 3.1);
    const buoyancyMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const buoyancy = new THREE.Mesh(buoyancyGeom, buoyancyMat);
    buoyancy.position.y = 1.05;
    model.add(buoyancy);
    parts.push({ name: "Buoyancy Block", description: "Syntactic foam block providing positive buoyancy.", mesh: buoyancy });

    // 3. Main tether (umbilical)
    const tetherGeom = new THREE.CylinderGeometry(0.08, 0.08, 5);
    tetherGeom.translate(0, 2.5, 0);
    const tetherMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const tether = new THREE.Mesh(tetherGeom, tetherMat);
    tether.position.set(0, 1.35, -1);
    model.add(tether);
    parts.push({ name: "Main Tether (Umbilical)", description: "Delivers power and telemetry to the ROV.", mesh: tether });

    // 4. Pan-tilt camera
    const cameraBase = new THREE.Group();
    cameraBase.position.set(0, 0.4, 1.55);
    const cameraGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.25);
    cameraGeom.rotateZ(Math.PI / 2);
    const cameraMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const camera = new THREE.Mesh(cameraGeom, cameraMat);
    cameraBase.add(camera);
    model.add(cameraBase);
    parts.push({ name: "Pan-Tilt Camera", description: "Main high-definition camera for pilot vision.", mesh: camera });

    // 5. Heavy-duty manipulator arm
    const heavyArmBase = new THREE.Group();
    heavyArmBase.position.set(0.6, -0.5, 1.5);
    
    const hArm1Geom = new THREE.CylinderGeometry(0.08, 0.08, 1.2);
    hArm1Geom.translate(0, 0.6, 0);
    const heavyArm1 = new THREE.Mesh(hArm1Geom, new THREE.MeshStandardMaterial({ color: 0xcc2222 }));
    heavyArm1.rotation.x = Math.PI / 2;
    heavyArmBase.add(heavyArm1);
    
    const heavyElbow = new THREE.Group();
    heavyElbow.position.set(0, 1.2, 0);
    const hArm2Geom = new THREE.CylinderGeometry(0.06, 0.06, 0.9);
    hArm2Geom.translate(0, 0.45, 0);
    const heavyArm2 = new THREE.Mesh(hArm2Geom, new THREE.MeshStandardMaterial({ color: 0xaa1111 }));
    heavyElbow.add(heavyArm2);
    heavyArm1.add(heavyElbow);
    
    model.add(heavyArmBase);
    parts.push({ name: "Heavy-Duty Manipulator Arm", description: "7-function hydraulic arm for heavy lifting and tooling.", mesh: heavyArm1 });

    // 6. Dexterous manipulator arm
    const dextArmBase = new THREE.Group();
    dextArmBase.position.set(-0.6, -0.5, 1.5);
    
    const dArm1Geom = new THREE.CylinderGeometry(0.06, 0.06, 1.0);
    dArm1Geom.translate(0, 0.5, 0);
    const dextArm1 = new THREE.Mesh(dArm1Geom, new THREE.MeshStandardMaterial({ color: 0x2222cc }));
    dextArm1.rotation.x = Math.PI / 2;
    dextArmBase.add(dextArm1);
    
    const dextElbow = new THREE.Group();
    dextElbow.position.set(0, 1.0, 0);
    const dArm2Geom = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
    dArm2Geom.translate(0, 0.4, 0);
    const dextArm2 = new THREE.Mesh(dArm2Geom, new THREE.MeshStandardMaterial({ color: 0x1111aa }));
    dextElbow.add(dextArm2);
    dextArm1.add(dextElbow);
    
    model.add(dextArmBase);
    parts.push({ name: "Dexterous Manipulator Arm", description: "5-function arm for precise object manipulation.", mesh: dextArm1 });

    // 7. Tooling skid
    const skidGeom = new THREE.BoxGeometry(2, 0.4, 3);
    const skidMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const skid = new THREE.Mesh(skidGeom, skidMat);
    skid.position.y = -0.95;
    model.add(skid);
    parts.push({ name: "Tooling Skid", description: "Interchangeable payload bay for mission-specific tools.", mesh: skid });

    // 8. Thruster assembly
    const thrusterGroup = new THREE.Group();
    const tGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.4);
    const tMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    const tPositions = [
        [1.1, 0, 1], [-1.1, 0, 1],
        [1.1, 0, -1], [-1.1, 0, -1],
        [0.8, 0.5, 0], [-0.8, 0.5, 0]
    ];
    tPositions.forEach((p, idx) => {
        const t = new THREE.Mesh(tGeom, tMat);
        t.position.set(...p);
        if (idx < 4) {
            t.rotation.x = Math.PI / 2;
        }
        thrusterGroup.add(t);
    });
    const thrusterBoxGeom = new THREE.BoxGeometry(2.4, 1.4, 2.4);
    const thrusterBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const thrusterBox = new THREE.Mesh(thrusterBoxGeom, thrusterBoxMat);
    thrusterGroup.add(thrusterBox);
    model.add(thrusterGroup);
    parts.push({ name: "Thruster Assembly", description: "Provides vectored thrust for 6-DOF movement.", mesh: thrusterBox });

    // 9. Lighting system
    const lightGeom = new THREE.BoxGeometry(0.3, 0.15, 0.15);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff });
    const lightGroup = new THREE.Group();
    const l1 = new THREE.Mesh(lightGeom, lightMat);
    l1.position.set(0.6, 0.6, 1.55);
    const l2 = new THREE.Mesh(lightGeom, lightMat);
    l2.position.set(-0.6, 0.6, 1.55);
    lightGroup.add(l1);
    lightGroup.add(l2);
    model.add(lightGroup);
    parts.push({ name: "Lighting System", description: "High-intensity LED arrays for deep-sea visibility.", mesh: l1 });

    // 10. Hydraulic power unit
    const hpuGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.2);
    const hpuMat = new THREE.MeshStandardMaterial({ color: 0x778899 });
    const hpu = new THREE.Mesh(hpuGeom, hpuMat);
    hpu.rotation.z = Math.PI / 2;
    hpu.position.set(0, -0.2, 0);
    model.add(hpu);
    parts.push({ name: "Hydraulic Power Unit", description: "Powers the hydraulic manipulators and tools.", mesh: hpu });

    let time = 0;
    function update(deltaTime) {
        time += deltaTime;

        // Camera panning
        cameraBase.rotation.y = Math.sin(time * 0.5) * 0.5;
        camera.rotation.x = Math.sin(time * 0.7) * 0.3;

        // Heavy arm articulating
        heavyArmBase.rotation.y = Math.sin(time * 0.8) * 0.4;
        heavyArmBase.rotation.x = Math.cos(time * 1.2) * 0.2;
        heavyElbow.rotation.x = 0.5 + Math.sin(time * 1.5) * 0.4;

        // Dexterous arm articulating
        dextArmBase.rotation.y = Math.cos(time * 0.9) * 0.4;
        dextArmBase.rotation.x = Math.sin(time * 1.3) * 0.2;
        dextElbow.rotation.x = 0.4 + Math.cos(time * 1.6) * 0.5;
    }

    const quizzes = [
        {
            question: "What is the primary function of the syntactic foam buoyancy block?",
            options: [
                "To store electrical power",
                "To provide positive buoyancy and keep the ROV upright",
                "To protect against sharks",
                "To cool the hydraulic unit"
            ],
            answer: 1
        },
        {
            question: "What does the main tether (umbilical) provide to the ROV?",
            options: [
                "Hydraulic fluid and air",
                "Power, video, and data telemetry",
                "Additional thrust",
                "Buoyancy control"
            ],
            answer: 1
        },
        {
            question: "What distinguishes the heavy-duty manipulator from the dexterous manipulator?",
            options: [
                "It has a built-in camera",
                "It operates electrically rather than hydraulically",
                "It is designed for heavy lifting and high grip force, often with 7 functions",
                "It can stretch up to 10 meters long"
            ],
            answer: 2
        },
        {
            question: "What is the purpose of the tooling skid?",
            options: [
                "To slide the ROV on the deck",
                "To house interchangeable mission-specific tools and payloads",
                "To act as a secondary tether",
                "To provide emergency buoyancy"
            ],
            answer: 1
        },
        {
            question: "How do work-class ROVs typically power their manipulator arms?",
            options: [
                "Using compressed air",
                "Using individual electrical servo motors",
                "Using a central Hydraulic Power Unit (HPU)",
                "Using springs and cables"
            ],
            answer: 2
        },
        {
            question: "Why do ROVs use vectored thruster arrangements?",
            options: [
                "To look aesthetically pleasing",
                "To allow 6-degrees-of-freedom movement, including strafing and rotating",
                "To minimize electrical consumption",
                "To create a strong current to clear debris"
            ],
            answer: 1
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
