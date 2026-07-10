export function createVentilator(THREE) {
    const ventilatorGroup = new THREE.Group();

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x002244 });
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
    const bellowsMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const humidifierMat = new THREE.MeshPhysicalMaterial({ color: 0x4488ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const maskMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.6 });
    const connectorMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const valveMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });

    // 1. Main Chassis
    const chassisGeom = new THREE.BoxGeometry(2, 3, 1.5);
    const mainChassis = new THREE.Mesh(chassisGeom, chassisMat);
    mainChassis.position.set(0, 1.5, 0);
    ventilatorGroup.add(mainChassis);

    // 2. Display Screen
    const screenGeom = new THREE.PlaneGeometry(1.6, 1.2);
    const displayScreen = new THREE.Mesh(screenGeom, screenMat);
    displayScreen.position.set(0, 2.2, 0.76);
    ventilatorGroup.add(displayScreen);

    // 3. Control Knobs
    const controlKnobs = new THREE.Group();
    const knobGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    knobGeom.rotateX(Math.PI / 2);
    for (let i = 0; i < 3; i++) {
        const knob = new THREE.Mesh(knobGeom, knobMat);
        knob.position.set(-0.5 + i * 0.5, 1.2, 0.76);
        controlKnobs.add(knob);
    }
    ventilatorGroup.add(controlKnobs);

    // 4. Bellows
    const bellowsGeom = new THREE.CylinderGeometry(0.45, 0.45, 1, 32);
    bellowsGeom.translate(0, 0.5, 0); // Scale from bottom
    const bellows = new THREE.Mesh(bellowsGeom, bellowsMat);
    bellows.position.set(1.5, 1.0, 0);
    ventilatorGroup.add(bellows);

    // 5. Humidifier
    const humidifierGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
    const humidifier = new THREE.Mesh(humidifierGeom, humidifierMat);
    humidifier.position.set(-1.2, 0.3, 0.5);
    ventilatorGroup.add(humidifier);

    // 6. Inspiration Tube
    const inspTubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.2, 0.6, 0.5),
        new THREE.Vector3(-2.0, 1.0, 1.0),
        new THREE.Vector3(-2.5, 1.5, 1.5)
    ]);
    const inspTubeGeom = new THREE.TubeGeometry(inspTubeCurve, 20, 0.1, 8, false);
    const inspirationTube = new THREE.Mesh(inspTubeGeom, tubeMat);
    ventilatorGroup.add(inspirationTube);

    // 7. Expiration Tube
    const expTubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.5, 1.5, 1.5),
        new THREE.Vector3(-1.5, 1.8, 2.0),
        new THREE.Vector3(-0.5, 1.5, 0.8)
    ]);
    const expTubeGeom = new THREE.TubeGeometry(expTubeCurve, 20, 0.1, 8, false);
    const expirationTube = new THREE.Mesh(expTubeGeom, tubeMat);
    ventilatorGroup.add(expirationTube);

    // 8. Y-Piece
    const yPieceGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    yPieceGeom.rotateZ(Math.PI / 4);
    const yPiece = new THREE.Mesh(yPieceGeom, connectorMat);
    yPiece.position.set(-2.5, 1.5, 1.5);
    ventilatorGroup.add(yPiece);

    // 9. Patient Mask
    const maskGeom = new THREE.ConeGeometry(0.3, 0.4, 16);
    maskGeom.rotateX(-Math.PI / 2);
    const patientMask = new THREE.Mesh(maskGeom, maskMat);
    patientMask.position.set(-2.8, 1.6, 1.8);
    ventilatorGroup.add(patientMask);

    // 10. Expiratory Valve
    const valveGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
    const expiratoryValve = new THREE.Mesh(valveGeom, valveMat);
    expiratoryValve.position.set(-0.5, 1.5, 0.75);
    ventilatorGroup.add(expiratoryValve);

    // Kinematics Animation
    ventilatorGroup.userData.tick = (time) => {
        const cycleSpeed = 2.0; // rad/s
        const cycle = time * cycleSpeed;
        
        // Bellows compressing and expanding (Inspiration / Expiration)
        const bellowsScale = 0.5 + 0.5 * Math.sin(cycle); // 0 to 1
        bellows.scale.y = 0.2 + 0.8 * bellowsScale;

        // Tube inflating/deflating in sync
        const inspInflation = 1.0 + 0.2 * Math.cos(cycle);
        inspirationTube.scale.set(inspInflation, 1, inspInflation);

        const expInflation = 1.0 + 0.2 * Math.sin(cycle + Math.PI);
        expirationTube.scale.set(expInflation, 1, expInflation);

        // Valve moves slightly to show it opening/closing
        expiratoryValve.position.y = 1.5 + 0.05 * Math.sin(cycle + Math.PI);
    };

    // Quiz Questions
    ventilatorGroup.userData.quiz = [
        {
            question: "What is the function of the Bellows in a mechanical ventilator?",
            options: ["To humidify the air", "To drive the gas mixture into the patient's lungs", "To display patient vitals", "To filter exhaled gases"],
            answer: 1
        },
        {
            question: "Which component connects the Inspiration and Expiration tubes to the Patient Mask?",
            options: ["Humidifier", "Main Chassis", "Y-Piece", "Expiratory Valve"],
            answer: 2
        },
        {
            question: "What is the purpose of the Humidifier in the ventilator circuit?",
            options: ["To cool down the electronic components", "To add moisture and warmth to the inspired gas", "To measure the oxygen concentration", "To drive the bellows"],
            answer: 1
        },
        {
            question: "During the inspiration phase, what does the Expiratory Valve typically do?",
            options: ["It opens completely", "It closes to ensure gas flows into the patient's lungs", "It vibrates", "It disconnects from the system"],
            answer: 1
        },
        {
            question: "Why are the Inspiration and Expiration tubes kept separate until the Y-Piece?",
            options: ["To prevent rebreathing of exhaled carbon dioxide", "To make the machine look more complex", "To save manufacturing costs", "To reduce the overall weight of the tubes"],
            answer: 0
        },
        {
            question: "What parameter is primarily adjusted using the Control Knobs?",
            options: ["Room temperature", "Tidal volume, respiratory rate, and oxygen concentration", "Screen brightness", "Patient's heart rate"],
            answer: 1
        }
    ];

    return ventilatorGroup;
}
