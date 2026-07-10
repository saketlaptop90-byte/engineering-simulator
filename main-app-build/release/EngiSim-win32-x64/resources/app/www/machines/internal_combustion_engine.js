export function createInternalCombustionEngine(THREE) {
    const group = new THREE.Group();

    // 1. Cylinder Block (transparent/wireframe to see inside)
    const blockGeometry = new THREE.CylinderGeometry(2.5, 2.5, 10, 16, 1, true);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true, transparent: true, opacity: 0.5 });
    const cylinderBlock = new THREE.Mesh(blockGeometry, blockMaterial);
    group.add(cylinderBlock);

    // 2. Piston
    const pistonGeometry = new THREE.CylinderGeometry(2.4, 2.4, 2, 16);
    const pistonMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
    group.add(piston);

    // 3. Connecting Rod
    const rodGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const connectingRod = new THREE.Mesh(rodGeometry, rodMaterial);
    group.add(connectingRod);

    // 4. Crankshaft
    const crankGeometry = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
    const crankMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const crankshaft = new THREE.Mesh(crankGeometry, crankMaterial);
    crankshaft.rotation.z = Math.PI / 2;
    crankshaft.position.y = -6;
    group.add(crankshaft);

    // 5. Intake Valve
    const valveGeometry = new THREE.CylinderGeometry(0.5, 0.1, 2, 16);
    const intakeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const intakeValve = new THREE.Mesh(valveGeometry, intakeMaterial);
    intakeValve.position.set(-1.2, 6, 0);
    group.add(intakeValve);

    // 6. Exhaust Valve
    const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const exhaustValve = new THREE.Mesh(valveGeometry, exhaustMaterial);
    exhaustValve.position.set(1.2, 6, 0);
    group.add(exhaustValve);

    // 7. Spark Plug
    const sparkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
    const sparkMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const sparkPlug = new THREE.Mesh(sparkGeometry, sparkMaterial);
    sparkPlug.position.set(0, 6.5, 0);
    group.add(sparkPlug);

    // 8. Camshaft
    const camGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const camMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const camshaft = new THREE.Mesh(camGeometry, camMaterial);
    camshaft.rotation.z = Math.PI / 2;
    camshaft.position.set(0, 7.5, 0);
    group.add(camshaft);

    // 9. Timing Belt
    const beltGeometry = new THREE.TorusGeometry(7, 0.2, 8, 24);
    const beltMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const timingBelt = new THREE.Mesh(beltGeometry, beltMaterial);
    timingBelt.position.set(0, 0.5, 2);
    timingBelt.scale.set(0.3, 1, 1);
    group.add(timingBelt);

    // 10. Flywheel
    const flywheelGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const flywheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const flywheel = new THREE.Mesh(flywheelGeometry, flywheelMaterial);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(0, -6, -2.5);
    group.add(flywheel);

    // Animation variables
    let time = 0;
    const crankRadius = 1.5;
    const rodLength = 4;

    const update = (delta) => {
        time += delta * 2; // Speed of rotation

        const angle = time;
        crankshaft.rotation.x = angle;
        flywheel.rotation.y = angle;

        const crankPinY = -6 + Math.cos(angle) * crankRadius;
        const crankPinX = Math.sin(angle) * crankRadius;
        
        const pistonDist = crankRadius * Math.cos(angle) + Math.sqrt(rodLength * rodLength - Math.pow(crankRadius * Math.sin(angle), 2));
        piston.position.y = -6 + pistonDist;

        connectingRod.position.x = crankPinX / 2;
        connectingRod.position.y = (crankPinY + piston.position.y) / 2;
        const rodAngle = Math.asin((crankRadius * Math.sin(angle)) / rodLength);
        connectingRod.rotation.z = -rodAngle;

        camshaft.rotation.x = angle / 2;
        timingBelt.rotation.z = angle / 2; 

        const cyclePhase = (time % (Math.PI * 4)) / (Math.PI * 4); 
        
        if (cyclePhase < 0.25) { // Intake
            intakeValve.position.y = 5.5 - Math.sin(cyclePhase * 4 * Math.PI) * 0.5;
            exhaustValve.position.y = 6;
            sparkPlug.material.color.setHex(0xffa500); 
        } 
        else if (cyclePhase < 0.5) { // Compression
            intakeValve.position.y = 6;
            exhaustValve.position.y = 6;
            sparkPlug.material.color.setHex(0xffa500);
        }
        else if (cyclePhase < 0.75) { // Power
            intakeValve.position.y = 6;
            exhaustValve.position.y = 6;
            if (cyclePhase < 0.55) {
                sparkPlug.material.color.setHex(0xffff00); 
            } else {
                sparkPlug.material.color.setHex(0xffa500);
            }
        }
        else { // Exhaust
            intakeValve.position.y = 6;
            exhaustValve.position.y = 5.5 - Math.sin((cyclePhase - 0.75) * 4 * Math.PI) * 0.5;
            sparkPlug.material.color.setHex(0xffa500);
        }
    };

    const quizzes = [
        {
            question: "Which component mixes air and fuel or allows air/fuel mixture into the combustion chamber?",
            options: ["Intake Valve", "Exhaust Valve", "Piston", "Flywheel"],
            answer: "Intake Valve"
        },
        {
            question: "What transfers the linear motion of the piston to the rotational motion of the crankshaft?",
            options: ["Timing Belt", "Camshaft", "Connecting Rod", "Spark Plug"],
            answer: "Connecting Rod"
        },
        {
            question: "In a four-stroke cycle, what ignites the compressed air-fuel mixture?",
            options: ["Flywheel", "Spark Plug", "Camshaft", "Exhaust Valve"],
            answer: "Spark Plug"
        },
        {
            question: "Which part controls the opening and closing of the valves?",
            options: ["Piston", "Connecting Rod", "Camshaft", "Cylinder Block"],
            answer: "Camshaft"
        },
        {
            question: "What stores rotational energy and helps smooth out the engine's power delivery?",
            options: ["Timing Belt", "Flywheel", "Crankshaft", "Cylinder Block"],
            answer: "Flywheel"
        },
        {
            question: "During which stroke are both the intake and exhaust valves closed while the piston moves upward?",
            options: ["Intake Stroke", "Compression Stroke", "Power Stroke", "Exhaust Stroke"],
            answer: "Compression Stroke"
        }
    ];

    return { group, update, quizzes };
}
