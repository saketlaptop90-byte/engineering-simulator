export function createMarineDieselEngine(THREE) {
    const group = new THREE.Group();

    // Materials
    const ironMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.3 });
    const darkMetalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x224488, metalness: 0.5, roughness: 0.5 });
    const redMaterial = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.6, roughness: 0.4 });

    // 1. Cylinder Liner
    const linerGeo = new THREE.CylinderGeometry(2.2, 2.2, 7, 32, 1, true);
    const liner = new THREE.Mesh(linerGeo, ironMaterial);
    liner.position.y = 11.5;
    group.add(liner);

    // 2. Piston
    const pistonGeo = new THREE.CylinderGeometry(2.1, 2.1, 2, 32);
    const piston = new THREE.Mesh(pistonGeo, steelMaterial);
    group.add(piston);

    // 3. Crosshead (Includes Piston Rod)
    const crossheadGroup = new THREE.Group();
    const crossheadBlock = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.5), darkMetalMaterial);
    crossheadGroup.add(crossheadBlock);
    
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 16), steelMaterial);
    pistonRod.position.y = 3;
    crossheadGroup.add(pistonRod);
    group.add(crossheadGroup);

    // 4. Connecting Rod
    const conRodGeo = new THREE.CylinderGeometry(0.6, 0.6, 6, 16);
    conRodGeo.translate(0, -3, 0); // Pivot at the top (crosshead pin)
    const conRod = new THREE.Mesh(conRodGeo, steelMaterial);
    group.add(conRod);

    // 5. Crankshaft
    const crankshaftGroup = new THREE.Group();
    
    const mainJournalGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    mainJournalGeo.rotateZ(Math.PI / 2);
    const mainJournal = new THREE.Mesh(mainJournalGeo, steelMaterial);
    crankshaftGroup.add(mainJournal);

    const crankWebGeo = new THREE.BoxGeometry(1.5, 5, 2);
    crankWebGeo.translate(0, 1, 0);
    const crankWeb1 = new THREE.Mesh(crankWebGeo, darkMetalMaterial);
    crankWeb1.position.x = -1.5;
    crankshaftGroup.add(crankWeb1);
    
    const crankWeb2 = new THREE.Mesh(crankWebGeo, darkMetalMaterial);
    crankWeb2.position.x = 1.5;
    crankshaftGroup.add(crankWeb2);

    const crankPinGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    crankPinGeo.rotateZ(Math.PI / 2);
    const crankPin = new THREE.Mesh(crankPinGeo, steelMaterial);
    crankPin.position.y = 2; // crank radius
    crankshaftGroup.add(crankPin);
    
    group.add(crankshaftGroup);

    // 6. Exhaust Valve
    const valveGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const valveStemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    valveStemGeo.translate(0, 1.5, 0);
    
    const exhaustValve = new THREE.Group();
    const valveHead = new THREE.Mesh(valveGeo, steelMaterial);
    const valveStem = new THREE.Mesh(valveStemGeo, steelMaterial);
    exhaustValve.add(valveHead);
    exhaustValve.add(valveStem);
    exhaustValve.position.y = 15.5;
    group.add(exhaustValve);

    // 7. Fuel Injector
    const injectorGeo = new THREE.CylinderGeometry(0.3, 0.1, 1.5, 16);
    const injector = new THREE.Mesh(injectorGeo, brassMaterial);
    injector.position.set(1.5, 15.5, 0);
    injector.rotation.z = Math.PI / 4;
    group.add(injector);

    // 8. Scavenge Air Receiver
    const scavengeGeo = new THREE.BoxGeometry(3, 4, 5);
    const scavengeReceiver = new THREE.Mesh(scavengeGeo, blueMaterial);
    scavengeReceiver.position.set(-3.5, 9, 0);
    group.add(scavengeReceiver);

    // 9. Turbocharger
    const turboGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 32);
    turboGeo.rotateX(Math.PI / 2);
    const turbocharger = new THREE.Mesh(turboGeo, redMaterial);
    turbocharger.position.set(-3.5, 14, 0);
    group.add(turbocharger);

    // 10. Thrust Block
    const thrustGeo = new THREE.BoxGeometry(4, 3, 4);
    const thrustBlock = new THREE.Mesh(thrustGeo, darkMetalMaterial);
    thrustBlock.position.set(0, -2, -6);
    group.add(thrustBlock);

    const questions = [
        {
            question: "What is the primary function of the crosshead in a large two-stroke marine diesel engine?",
            options: [
                "To absorb lateral forces from the connecting rod and ensure the piston moves strictly vertically",
                "To control the injection of fuel into the cylinder",
                "To regulate the temperature of the exhaust gases",
                "To compress the scavenge air before it enters the cylinder"
            ],
            correctAnswer: 0
        },
        {
            question: "In a two-stroke marine diesel engine, how many revolutions of the crankshaft are required to complete one power cycle?",
            options: [
                "Half a revolution",
                "One revolution",
                "Two revolutions",
                "Four revolutions"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the scavenge air receiver?",
            options: [
                "To collect unburnt fuel",
                "To store pressurized air for pushing exhaust gases out and filling the cylinder with fresh air",
                "To separate oil from water in the engine room",
                "To cool the lubricating oil"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component is driven by exhaust gases and used to increase the pressure of incoming air?",
            options: [
                "Thrust block",
                "Crosshead",
                "Turbocharger",
                "Exhaust valve"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the thrust block do in a ship's propulsion system?",
            options: [
                "Transmits the propulsive thrust from the propeller to the ship's hull",
                "Blocks the flow of exhaust gases during compression",
                "Absorbs the vertical forces of the piston",
                "Increases the fuel injection pressure"
            ],
            correctAnswer: 0
        },
        {
            question: "In modern large two-stroke marine engines, how is the exhaust valve typically operated?",
            options: [
                "Manually by the engineer",
                "Hydraulically actuated and closed by an air spring",
                "By a direct mechanical linkage to the piston",
                "By electrical solenoids only"
            ],
            correctAnswer: 1
        }
    ];

    let time = 0;
    const crankRadius = 2;
    const conRodLength = 6;
    const rpm = 60; // 60 RPM = 1 rev per sec

    return {
        model: group,
        questions: questions,
        update: (delta) => {
            time += delta;
            
            // Crankshaft rotation
            const angle = time * (rpm / 60) * Math.PI * 2;
            crankshaftGroup.rotation.z = -angle;

            // Kinematics calculations
            const crankX = crankRadius * Math.sin(-angle);
            const crankY = crankRadius * Math.cos(-angle);
            
            // Crosshead moves vertically
            const crossheadY = crankY + Math.sqrt(conRodLength ** 2 - crankX ** 2);
            crossheadGroup.position.y = crossheadY;
            
            // Piston follows crosshead
            piston.position.y = crossheadY + 6;

            // Connecting Rod pivot and rotation
            conRod.position.set(0, crossheadY, 0);
            const beta = Math.asin(-crankX / conRodLength);
            conRod.rotation.z = beta;

            // Exhaust Valve operation
            const normalizedAngle = ((-angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            let valveOpen = 0;
            // Open exhaust valve during the scavenging phase
            if (normalizedAngle > Math.PI * 0.6 && normalizedAngle < Math.PI * 1.4) {
                valveOpen = Math.sin((normalizedAngle - Math.PI * 0.6) / 0.8 * Math.PI);
            }
            exhaustValve.position.y = 15.5 - valveOpen * 0.8;
        }
    };
}
