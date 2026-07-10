export function createWankelEngine(THREE) {
    const group = new THREE.Group();
    
    const e = 1.0;
    const R = 6.0;
    const depth = 3.0;

    // 1. Housing
    const housingShape = new THREE.Shape();
    const housingPoints = 180;
    for (let i = 0; i <= housingPoints; i++) {
        const t = (i / housingPoints) * Math.PI * 2;
        const x = (e * Math.cos(3 * t) + R * Math.cos(t)) * 1.08;
        const y = (e * Math.sin(3 * t) + R * Math.sin(t)) * 1.08;
        if (i === 0) housingShape.moveTo(x, y);
        else housingShape.lineTo(x, y);
    }
    const housingHole = new THREE.Path();
    for (let i = 0; i <= housingPoints; i++) {
        const t = -(i / housingPoints) * Math.PI * 2; // CW
        const x = e * Math.cos(3 * t) + R * Math.cos(t);
        const y = e * Math.sin(3 * t) + R * Math.sin(t);
        if (i === 0) housingHole.moveTo(x, y);
        else housingHole.lineTo(x, y);
    }
    housingShape.holes.push(housingHole);

    const housingGeom = new THREE.ExtrudeGeometry(housingShape, { depth: depth, bevelEnabled: false });
    housingGeom.translate(0, 0, -depth / 2);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.4, metalness: 0.5, roughness: 0.5 });
    const housing = new THREE.Mesh(housingGeom, housingMat);
    housing.name = "Housing";
    group.add(housing);

    // 2. Cooling Jacket
    const jacketShape = new THREE.Shape();
    for (let i = 0; i <= housingPoints; i++) {
        const t = (i / housingPoints) * Math.PI * 2;
        const x = (e * Math.cos(3 * t) + R * Math.cos(t)) * 1.25;
        const y = (e * Math.sin(3 * t) + R * Math.sin(t)) * 1.25;
        if (i === 0) jacketShape.moveTo(x, y);
        else jacketShape.lineTo(x, y);
    }
    const jacketHole = new THREE.Path();
    for (let i = 0; i <= housingPoints; i++) {
        const t = -(i / housingPoints) * Math.PI * 2; // CW
        const x = (e * Math.cos(3 * t) + R * Math.cos(t)) * 1.08;
        const y = (e * Math.sin(3 * t) + R * Math.sin(t)) * 1.08;
        if (i === 0) jacketHole.moveTo(x, y);
        else jacketHole.lineTo(x, y);
    }
    jacketShape.holes.push(jacketHole);

    const jacketGeom = new THREE.ExtrudeGeometry(jacketShape, { depth: depth + 0.4, bevelEnabled: false });
    jacketGeom.translate(0, 0, -(depth + 0.4) / 2);
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, wireframe: true, transparent: true, opacity: 0.2 });
    const coolingJacket = new THREE.Mesh(jacketGeom, jacketMat);
    coolingJacket.name = "Cooling Jacket";
    group.add(coolingJacket);

    // 3. Rotor
    const rotorShape = new THREE.Shape();
    const v1 = { x: R, y: 0 };
    const v2 = { x: R * Math.cos(Math.PI * 2 / 3), y: R * Math.sin(Math.PI * 2 / 3) };
    const v3 = { x: R * Math.cos(Math.PI * 4 / 3), y: R * Math.sin(Math.PI * 4 / 3) };
    rotorShape.moveTo(v1.x, v1.y);
    const cpDist = R * 0.65;
    rotorShape.quadraticCurveTo(cpDist * Math.cos(Math.PI / 3), cpDist * Math.sin(Math.PI / 3), v2.x, v2.y);
    rotorShape.quadraticCurveTo(cpDist * Math.cos(Math.PI), cpDist * Math.sin(Math.PI), v3.x, v3.y);
    rotorShape.quadraticCurveTo(cpDist * Math.cos(Math.PI * 5 / 3), cpDist * Math.sin(Math.PI * 5 / 3), v1.x, v1.y);

    const intGearHole = new THREE.Path();
    const intGearRadius = e * 2.8; // Give it some clearance
    const intTeeth = 36;
    for (let i = 0; i <= intTeeth * 2; i++) {
        const angle = -(i / (intTeeth * 2)) * Math.PI * 2; // CW
        const rad = (i % 2 === 0) ? intGearRadius : intGearRadius * 1.05;
        if (i === 0) intGearHole.moveTo(rad * Math.cos(angle), rad * Math.sin(angle));
        else intGearHole.lineTo(rad * Math.cos(angle), rad * Math.sin(angle));
    }
    rotorShape.holes.push(intGearHole);

    const rotorGeom = new THREE.ExtrudeGeometry(rotorShape, { depth: depth - 0.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    rotorGeom.translate(0, 0, -(depth - 0.2) / 2);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    const rotor = new THREE.Mesh(rotorGeom, rotorMat);
    rotor.name = "Rotor";
    group.add(rotor);

    // 4. Apex Seal
    const apexSealGroup = new THREE.Group();
    apexSealGroup.name = "Apex Seal";
    const sealGeom = new THREE.BoxGeometry(0.3, 0.15, depth + 0.1);
    const sealMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    for (let i = 0; i < 3; i++) {
        const angle = i * Math.PI * 2 / 3;
        const seal = new THREE.Mesh(sealGeom, sealMat);
        seal.position.set(R * Math.cos(angle), R * Math.sin(angle), 0);
        seal.rotation.z = angle;
        apexSealGroup.add(seal);
    }
    group.add(apexSealGroup);

    // 5. Eccentric Shaft
    const eccentricShaft = new THREE.Group();
    eccentricShaft.name = "Eccentric Shaft";
    
    const shaftGeom = new THREE.CylinderGeometry(0.8, 0.8, depth + 6, 32);
    shaftGeom.rotateX(Math.PI / 2);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const shaft = new THREE.Mesh(shaftGeom, shaftMat);
    
    const lobeGeom = new THREE.CylinderGeometry(1.8, 1.8, depth - 0.4, 32);
    lobeGeom.rotateX(Math.PI / 2);
    const lobe = new THREE.Mesh(lobeGeom, shaftMat);
    lobe.position.set(e, 0, 0);
    
    eccentricShaft.add(shaft);
    eccentricShaft.add(lobe);
    group.add(eccentricShaft);

    // 6. Stationary Gear
    const statGearRadius = e * 2;
    const statTeeth = 24;
    const statGearShape = new THREE.Shape();
    for (let i = 0; i <= statTeeth * 2; i++) {
        const angle = (i / (statTeeth * 2)) * Math.PI * 2;
        const rad = (i % 2 === 0) ? statGearRadius : statGearRadius * 0.9;
        if (i === 0) statGearShape.moveTo(rad * Math.cos(angle), rad * Math.sin(angle));
        else statGearShape.lineTo(rad * Math.cos(angle), rad * Math.sin(angle));
    }
    const statHole = new THREE.Path();
    statHole.absarc(0, 0, 0.9, 0, Math.PI * 2, true);
    statGearShape.holes.push(statHole);

    const statGearGeom = new THREE.ExtrudeGeometry(statGearShape, { depth: 0.6, bevelEnabled: false });
    statGearGeom.translate(0, 0, -0.3);
    const statGearMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.6, roughness: 0.4 });
    const stationaryGear = new THREE.Mesh(statGearGeom, statGearMat);
    stationaryGear.position.z = -depth / 2 + 0.3;
    stationaryGear.name = "Stationary Gear";
    group.add(stationaryGear);

    // 7. Intake Port
    const intakeGeom = new THREE.CylinderGeometry(1.0, 1.0, 4, 32);
    intakeGeom.rotateZ(Math.PI / 4);
    const intakeMat = new THREE.MeshStandardMaterial({ color: 0x3366ff, metalness: 0.3, roughness: 0.7 });
    const intakePort = new THREE.Mesh(intakeGeom, intakeMat);
    intakePort.position.set(-5, 5, 0);
    intakePort.name = "Intake Port";
    group.add(intakePort);

    // 8. Exhaust Port
    const exhaustGeom = new THREE.CylinderGeometry(1.0, 1.0, 4, 32);
    exhaustGeom.rotateZ(-Math.PI / 4);
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xff3322, metalness: 0.3, roughness: 0.7 });
    const exhaustPort = new THREE.Mesh(exhaustGeom, exhaustMat);
    exhaustPort.position.set(-5, -5, 0);
    exhaustPort.name = "Exhaust Port";
    group.add(exhaustPort);

    // 9. Spark Plug 1
    const sparkGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    sparkGeom.rotateZ(-Math.PI / 2);
    const sparkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.9 });
    const sparkPlug1 = new THREE.Mesh(sparkGeom, sparkMat);
    sparkPlug1.position.set(7.5, 1.5, 0);
    sparkPlug1.name = "Spark Plug 1";
    group.add(sparkPlug1);

    // 10. Spark Plug 2
    const sparkPlug2 = new THREE.Mesh(sparkGeom, sparkMat);
    sparkPlug2.position.set(7.5, -1.5, 0);
    sparkPlug2.name = "Spark Plug 2";
    group.add(sparkPlug2);

    // Animation function
    group.update = function(time) {
        const speed = 2.5; // rad/s
        const alpha = time * speed;
        
        // Eccentric shaft rotates at alpha
        eccentricShaft.rotation.z = alpha;
        
        // Rotor center rotates around origin at e distance
        rotor.position.set(e * Math.cos(alpha), e * Math.sin(alpha), 0);
        // Rotor rotates around its center at 1/3 speed
        rotor.rotation.z = alpha / 3;
        
        // Apex seals follow the rotor exactly
        apexSealGroup.position.copy(rotor.position);
        apexSealGroup.rotation.copy(rotor.rotation);
    };

    // Quizzes
    group.quiz = [
        {
            question: "What is the primary moving part in a Wankel engine that replaces the pistons of a conventional engine?",
            options: ["Eccentric Shaft", "Housing", "Rotor", "Apex Seal"],
            answer: 2
        },
        {
            question: "In a Wankel engine, how many rotations does the eccentric shaft make for every one complete rotation of the rotor?",
            options: ["One", "Two", "Three", "Four"],
            answer: 2
        },
        {
            question: "Which component is responsible for separating the different combustion chambers in a Wankel engine?",
            options: ["Cooling Jacket", "Stationary Gear", "Apex Seal", "Spark Plug"],
            answer: 2
        },
        {
            question: "What mathematical curve defines the shape of the Wankel engine's housing?",
            options: ["Parabola", "Epitrochoid", "Ellipse", "Hyperbola"],
            answer: 1
        },
        {
            question: "Which part of the Wankel engine coordinates the rotation of the rotor to ensure it moves in the correct planetary motion?",
            options: ["Intake Port", "Stationary Gear", "Exhaust Port", "Spark Plug"],
            answer: 1
        },
        {
            question: "What is a known advantage of the Wankel rotary engine compared to a traditional piston engine?",
            options: ["Higher fuel efficiency", "Fewer moving parts and smoother operation", "Lower emissions", "No need for oil"],
            answer: 1
        }
    ];

    return group;
}
