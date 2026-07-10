export function createSpaceShuttle(THREE) {
    const group = new THREE.Group();

    const parts = {};

    // Materials
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const matBlack = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }); // TPS
    const matDarkGrey = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5 }); // Engines/OMS
    const matSilver = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });

    // 1. Forward Fuselage (Nose)
    const forwardFuselageGeom = new THREE.ConeGeometry(1.5, 4, 32);
    forwardFuselageGeom.rotateX(-Math.PI / 2);
    const forwardFuselage = new THREE.Mesh(forwardFuselageGeom, matWhite);
    forwardFuselage.position.set(0, 0.5, 6);
    forwardFuselage.userData = { name: "Forward Fuselage", description: "Houses the crew compartment, flight deck, and forward reaction control system." };
    group.add(forwardFuselage);
    parts.forwardFuselage = forwardFuselage;

    // 2. Mid Fuselage
    const midFuselageGeom = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    midFuselageGeom.rotateX(-Math.PI / 2);
    const midFuselage = new THREE.Mesh(midFuselageGeom, matWhite);
    midFuselage.position.set(0, 0.5, 0);
    midFuselage.userData = { name: "Mid Fuselage", description: "The primary structural section, containing the payload bay." };
    group.add(midFuselage);
    parts.midFuselage = midFuselage;

    // 3. Aft Fuselage
    const aftFuselageGeom = new THREE.CylinderGeometry(1.5, 1.8, 3, 32);
    aftFuselageGeom.rotateX(-Math.PI / 2);
    const aftFuselage = new THREE.Mesh(aftFuselageGeom, matWhite);
    aftFuselage.position.set(0, 0.5, -5.5);
    aftFuselage.userData = { name: "Aft Fuselage", description: "Houses the main engines, orbital maneuvering system, and auxiliary power units." };
    group.add(aftFuselage);
    parts.aftFuselage = aftFuselage;

    // 4. Payload Bay Doors
    const doorsGroup = new THREE.Group();
    doorsGroup.position.set(0, 0.5, 0); 
    
    // Right Door
    const rightDoorContainer = new THREE.Group();
    rightDoorContainer.position.set(1.5, 0, 0); 
    const rightDoorGeom = new THREE.CylinderGeometry(1.51, 1.51, 8, 32, 1, false, 0, Math.PI / 2);
    rightDoorGeom.rotateX(-Math.PI / 2);
    const rightDoor = new THREE.Mesh(rightDoorGeom, matSilver);
    rightDoor.position.set(-1.5, 0, 0); 
    rightDoorContainer.add(rightDoor);
    
    // Left Door
    const leftDoorContainer = new THREE.Group();
    leftDoorContainer.position.set(-1.5, 0, 0); 
    const leftDoorGeom = new THREE.CylinderGeometry(1.51, 1.51, 8, 32, 1, false, Math.PI / 2, Math.PI / 2);
    leftDoorGeom.rotateX(-Math.PI / 2);
    const leftDoor = new THREE.Mesh(leftDoorGeom, matSilver);
    leftDoor.position.set(1.5, 0, 0); 
    leftDoorContainer.add(leftDoor);

    doorsGroup.add(rightDoorContainer);
    doorsGroup.add(leftDoorContainer);
    
    doorsGroup.userData = { name: "Payload Bay Doors", description: "Protect the payload during launch and reentry, and radiate excess heat while in orbit." };
    group.add(doorsGroup);
    parts.payloadBayDoors = doorsGroup;

    parts.rightDoorContainer = rightDoorContainer;
    parts.leftDoorContainer = leftDoorContainer;

    // 5. Main Engines (SSMEs)
    const enginesGroup = new THREE.Group();
    const engineGeom = new THREE.ConeGeometry(0.5, 1.5, 16);
    engineGeom.rotateX(Math.PI / 2);
    
    const engine1 = new THREE.Mesh(engineGeom, matDarkGrey);
    engine1.position.set(0, 1.2, -7.5);
    const engine2 = new THREE.Mesh(engineGeom, matDarkGrey);
    engine2.position.set(0.8, 0, -7.5);
    const engine3 = new THREE.Mesh(engineGeom, matDarkGrey);
    engine3.position.set(-0.8, 0, -7.5);

    enginesGroup.add(engine1, engine2, engine3);
    enginesGroup.userData = { name: "Main Engines", description: "Three RS-25 liquid-propellant rocket engines used during ascent." };
    group.add(enginesGroup);
    parts.mainEngines = enginesGroup;

    // 6. OMS Pods
    const omsGroup = new THREE.Group();
    const omsGeom = new THREE.CapsuleGeometry(0.6, 1.5, 8, 16);
    omsGeom.rotateX(Math.PI / 2);
    
    const omsLeft = new THREE.Mesh(omsGeom, matWhite);
    omsLeft.position.set(-1.4, 1.5, -6);
    const omsRight = new THREE.Mesh(omsGeom, matWhite);
    omsRight.position.set(1.4, 1.5, -6);
    
    const omsNozzleGeom = new THREE.ConeGeometry(0.3, 0.8, 16);
    omsNozzleGeom.rotateX(Math.PI / 2);
    const omsNozzleLeft = new THREE.Mesh(omsNozzleGeom, matDarkGrey);
    omsNozzleLeft.position.set(-1.4, 1.5, -7);
    const omsNozzleRight = new THREE.Mesh(omsNozzleGeom, matDarkGrey);
    omsNozzleRight.position.set(1.4, 1.5, -7);

    omsGroup.add(omsLeft, omsRight, omsNozzleLeft, omsNozzleRight);
    omsGroup.userData = { name: "OMS Pods", description: "Orbital Maneuvering System engines used for orbital insertion, major maneuvers, and deorbit burn." };
    group.add(omsGroup);
    parts.omsPods = omsGroup;

    // 7. Vertical Stabilizer
    const vertStabGeom = new THREE.BoxGeometry(0.2, 3, 2);
    const posAttribute = vertStabGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        let y = posAttribute.getY(i);
        let z = posAttribute.getZ(i);
        if (y > 0) {
            posAttribute.setZ(i, z - 1.5);
        }
    }
    vertStabGeom.computeVertexNormals();
    const tail = new THREE.Mesh(vertStabGeom, matWhite);
    tail.position.set(0, 3, -5.5);
    tail.userData = { name: "Vertical Stabilizer", description: "Provides aerodynamic stability and contains the speed brake/rudder." };
    group.add(tail);
    parts.verticalStabilizer = tail;

    // 8. Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 4); 
    wingShape.lineTo(4, -4); 
    wingShape.lineTo(0, -4); 
    wingShape.lineTo(0, 4);

    const wingGeomRight = new THREE.ExtrudeGeometry(wingShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.1 });
    wingGeomRight.rotateX(Math.PI / 2);
    const rightWing = new THREE.Mesh(wingGeomRight, matWhite);
    rightWing.position.set(1.5, 0.2, 0);

    const wingShapeLeft = new THREE.Shape();
    wingShapeLeft.moveTo(0, 4);
    wingShapeLeft.lineTo(-4, -4);
    wingShapeLeft.lineTo(0, -4);
    wingShapeLeft.lineTo(0, 4);

    const wingGeomLeft = new THREE.ExtrudeGeometry(wingShapeLeft, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.1 });
    wingGeomLeft.rotateX(Math.PI / 2);
    const leftWing = new THREE.Mesh(wingGeomLeft, matWhite);
    leftWing.position.set(-1.5, 0.2, 0);

    const wingsGroup = new THREE.Group();
    wingsGroup.add(rightWing, leftWing);
    wingsGroup.userData = { name: "Wings", description: "Double delta wings providing aerodynamic lift during reentry and atmospheric flight." };
    group.add(wingsGroup);
    parts.wings = wingsGroup;

    // 9. Elevons
    const elevonGroup = new THREE.Group();
    const elevonGeom = new THREE.BoxGeometry(3.5, 0.1, 1);
    
    const rightElevon = new THREE.Mesh(elevonGeom, matWhite);
    rightElevon.position.set(3.25, 0.2, -4.5);
    
    const leftElevon = new THREE.Mesh(elevonGeom, matWhite);
    leftElevon.position.set(-3.25, 0.2, -4.5);

    elevonGroup.add(rightElevon, leftElevon);
    elevonGroup.userData = { name: "Elevons", description: "Control surfaces on the trailing edge of the wings, functioning as both elevators and ailerons." };
    group.add(elevonGroup);
    parts.elevons = elevonGroup;

    // 10. Thermal Protection System (TPS)
    const tpsGroup = new THREE.Group();
    
    const tpsFuselageGeom = new THREE.CylinderGeometry(1.52, 1.52, 15, 32, 1, false, Math.PI, Math.PI);
    tpsFuselageGeom.rotateX(-Math.PI / 2);
    const tpsFuselage = new THREE.Mesh(tpsFuselageGeom, matBlack);
    tpsFuselage.position.set(0, 0.5, 0.5); 
    
    const wingTpsGeomRight = new THREE.ExtrudeGeometry(wingShape, { depth: 0.05, bevelEnabled: false });
    wingTpsGeomRight.rotateX(Math.PI / 2);
    const rightWingTps = new THREE.Mesh(wingTpsGeomRight, matBlack);
    rightWingTps.position.set(1.5, 0.05, 0);

    const wingTpsGeomLeft = new THREE.ExtrudeGeometry(wingShapeLeft, { depth: 0.05, bevelEnabled: false });
    wingTpsGeomLeft.rotateX(Math.PI / 2);
    const leftWingTps = new THREE.Mesh(wingTpsGeomLeft, matBlack);
    leftWingTps.position.set(-1.5, 0.05, 0);

    tpsGroup.add(tpsFuselage, rightWingTps, leftWingTps);
    tpsGroup.userData = { name: "Thermal Protection System", description: "Specialized heat-resistant tiles and blankets protecting the orbiter during the intense heat of reentry." };
    group.add(tpsGroup);
    parts.tps = tpsGroup;

    // Animation state
    let doorOpenProgress = 0;
    let doorDirection = 1;

    group.userData.update = function(deltaTime) {
        doorOpenProgress += deltaTime * 0.5 * doorDirection;
        if (doorOpenProgress >= 1) {
            doorOpenProgress = 1;
            doorDirection = -1;
        } else if (doorOpenProgress <= 0) {
            doorOpenProgress = 0;
            doorDirection = 1;
        }

        const maxAngle = 2.1;
        parts.rightDoorContainer.rotation.z = -doorOpenProgress * maxAngle;
        parts.leftDoorContainer.rotation.z = doorOpenProgress * maxAngle;
    };

    return group;
}

export const quizzes = [
    {
        question: "What was the main purpose of the Payload Bay Doors?",
        options: [
            "To deploy aerodynamic wings",
            "To protect the payload during launch and radiate heat in orbit",
            "To serve as landing gear storage",
            "To house extra crew members"
        ],
        answer: 1
    },
    {
        question: "How many main engines (SSMEs) are located on the Aft Fuselage?",
        options: ["Two", "Three", "Four", "Five"],
        answer: 1
    },
    {
        question: "What role do the Elevons play on the space shuttle?",
        options: [
            "Act as solar panels",
            "Function as both elevators and ailerons for aerodynamic control",
            "Regulate engine fuel flow",
            "Cool the Thermal Protection System"
        ],
        answer: 1
    },
    {
        question: "Which component protects the orbiter from the extreme heat of atmospheric reentry?",
        options: [
            "OMS Pods",
            "Forward Fuselage",
            "Vertical Stabilizer",
            "Thermal Protection System (TPS)"
        ],
        answer: 3
    },
    {
        question: "What is the primary function of the OMS (Orbital Maneuvering System) pods?",
        options: [
            "Orbital insertion, maneuvers, and deorbit burns",
            "Primary thrust during liftoff",
            "Providing life support to the crew",
            "Deploying satellites into deep space"
        ],
        answer: 0
    },
    {
        question: "Which part of the shuttle houses the flight deck and crew compartment?",
        options: [
            "Forward Fuselage",
            "Mid Fuselage",
            "Aft Fuselage",
            "Vertical Stabilizer"
        ],
        answer: 0
    }
];
