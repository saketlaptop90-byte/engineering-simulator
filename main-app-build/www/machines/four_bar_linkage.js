export function createFourBarLinkage(THREE) {
    const group = new THREE.Group();

    // Materials
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const pivotMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4 });
    const crankMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.3, roughness: 0.6 });
    const couplerMat = new THREE.MeshStandardMaterial({ color: 0x00aa00, metalness: 0.3, roughness: 0.6 });
    const leverMat = new THREE.MeshStandardMaterial({ color: 0x0000cc, metalness: 0.3, roughness: 0.6 });
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });

    // 1. baseFrame
    const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 4), frameMat);
    baseFrame.position.set(5, -4, -1);
    group.add(baseFrame);

    // 2. drivingMotor
    const motorGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    motorGeom.rotateX(Math.PI / 2);
    const drivingMotor = new THREE.Mesh(motorGeom, motorMat);
    drivingMotor.position.set(0, 0, -1.5);
    group.add(drivingMotor);

    // 3. basePivot1
    const pivot1Geom = new THREE.BoxGeometry(2, 4.5, 1);
    const basePivot1 = new THREE.Mesh(pivot1Geom, pivotMat);
    basePivot1.position.set(0, -2.25, -0.5);
    group.add(basePivot1);

    // 4. basePivot2
    const pivot2Geom = new THREE.BoxGeometry(2, 4.5, 1);
    const basePivot2 = new THREE.Mesh(pivot2Geom, pivotMat);
    basePivot2.position.set(10, -2.25, -0.5);
    group.add(basePivot2);

    // 5. inputCrank (Length = 3)
    const crankGeom = new THREE.BoxGeometry(3, 0.8, 0.2);
    crankGeom.translate(1.5, 0, 0);
    const inputCrank = new THREE.Mesh(crankGeom, crankMat);
    inputCrank.position.set(0, 0, 0.2);
    group.add(inputCrank);

    // 6. crankPin
    const pinGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
    pinGeom.rotateX(Math.PI / 2);
    const crankPin = new THREE.Mesh(pinGeom, pinMat);
    group.add(crankPin);

    // 7. coupler (Length = 8)
    const couplerGeom = new THREE.BoxGeometry(8, 0.8, 0.2);
    couplerGeom.translate(4, 0, 0);
    const coupler = new THREE.Mesh(couplerGeom, couplerMat);
    group.add(coupler);

    // 8. couplerPin
    const couplerPin = new THREE.Mesh(pinGeom, pinMat);
    group.add(couplerPin);

    // 9. outputLever (Length = 6)
    const leverGeom = new THREE.BoxGeometry(6, 0.8, 0.2);
    leverGeom.translate(3, 0, 0);
    const outputLever = new THREE.Mesh(leverGeom, leverMat);
    outputLever.position.set(10, 0, 0.2);
    group.add(outputLever);

    // 10. leverPin (Axle for output lever)
    const leverPinGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    leverPinGeom.rotateX(Math.PI / 2);
    const leverPin = new THREE.Mesh(leverPinGeom, pinMat);
    leverPin.position.set(10, 0, -0.1);
    group.add(leverPin);

    let time = 0;
    const L1 = 10, L2 = 3, L3 = 8, L4 = 6;
    const O2x = 0, O2y = 0;
    const O4x = 10, O4y = 0;

    function update(delta) {
        time += delta;
        const omega = 2.0; // rad/s
        const theta2 = time * omega;

        // Input Crank
        inputCrank.rotation.z = theta2;
        const Ax = O2x + L2 * Math.cos(theta2);
        const Ay = O2y + L2 * Math.sin(theta2);
        
        // Crank Pin position
        crankPin.position.set(Ax, Ay, 0.4);

        // Solve for B (Coupler Pin)
        const dx = Ax - O4x;
        const dy = Ay - O4y;
        const d = Math.sqrt(dx * dx + dy * dy);
        
        const psi = Math.atan2(dy, dx);
        
        let cosBeta = (d * d + L4 * L4 - L3 * L3) / (2 * d * L4);
        cosBeta = Math.max(-1, Math.min(1, cosBeta));
        const beta = Math.acos(cosBeta);
        
        const theta4 = psi - beta;
        
        const Bx = O4x + L4 * Math.cos(theta4);
        const By = O4y + L4 * Math.sin(theta4);
        
        // Output Lever
        outputLever.rotation.z = theta4;
        
        // Coupler Pin position
        couplerPin.position.set(Bx, By, 0.4);
        
        // Coupler
        const theta3 = Math.atan2(By - Ay, Bx - Ax);
        coupler.position.set(Ax, Ay, 0.6);
        coupler.rotation.z = theta3;
    }

    const quizzes = [
        {
            question: "What is the primary function of a four-bar linkage?",
            options: [
                "To convert continuous rotation into another form of motion",
                "To store electrical energy",
                "To reduce the weight of a machine",
                "To act as a friction brake"
            ],
            answer: "To convert continuous rotation into another form of motion"
        },
        {
            question: "Which link is typically driven by a motor in a crank-rocker mechanism?",
            options: [
                "The input crank",
                "The coupler",
                "The output lever",
                "The base frame"
            ],
            answer: "The input crank"
        },
        {
            question: "What role does the 'coupler' play in the four-bar linkage?",
            options: [
                "It connects the input crank to the output lever",
                "It remains completely stationary",
                "It provides the driving force",
                "It attaches directly to the ground"
            ],
            answer: "It connects the input crank to the output lever"
        },
        {
            question: "Grashof's law predicts the behavior of a four-bar linkage. For continuous rotation of the input link, what must be true?",
            options: [
                "The shortest plus longest link must be less than or equal to the sum of the other two",
                "All links must be of equal length",
                "The input crank must be the longest link",
                "The coupler must be longer than the base frame"
            ],
            answer: "The shortest plus longest link must be less than or equal to the sum of the other two"
        },
        {
            question: "Which part provides the fixed mounting points for the rotating links?",
            options: [
                "The base frame",
                "The crank pin",
                "The coupler",
                "The driving motor"
            ],
            answer: "The base frame"
        },
        {
            question: "What is the function of the crank pin and coupler pin?",
            options: [
                "They act as pivot joints allowing relative rotation between connected links",
                "They prevent any motion between the links",
                "They supply power to the system",
                "They measure the rotational speed of the mechanism"
            ],
            answer: "They act as pivot joints allowing relative rotation between connected links"
        }
    ];

    return { group, update, quizzes };
}
