export function createInductionMotor(THREE) {
    const group = new THREE.Group();

    // 1. Stator core (and casing)
    const statorShape = new THREE.Shape();
    const outerRadius = 10;
    const numFins = 36;
    
    // Corrugated outer surface
    for (let i = 0; i < numFins * 2; i++) {
        const angle = (i * Math.PI) / numFins;
        const radius = (i % 2 === 0) ? outerRadius + 1 : outerRadius;
        if (i === 0) {
            statorShape.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
        } else {
            statorShape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
    }
    
    // Inner hole with slots
    const statorHole = new THREE.Path();
    const numSlots = 24;
    for (let i = 0; i < numSlots * 2; i++) {
        const angleHole = - (i * Math.PI) / numSlots; 
        const radius = (i % 2 === 0) ? 7 : 8.8; // slots
        if (i === 0) {
            statorHole.moveTo(radius * Math.cos(angleHole), radius * Math.sin(angleHole));
        } else {
            statorHole.lineTo(radius * Math.cos(angleHole), radius * Math.sin(angleHole));
        }
    }
    statorShape.holes.push(statorHole);

    const extrudeSettings = { depth: 15, bevelEnabled: false, curveSegments: 12 };
    const statorGeom = new THREE.ExtrudeGeometry(statorShape, extrudeSettings);
    statorGeom.translate(0, 0, -7.5);
    const paintMat = new THREE.MeshStandardMaterial({ color: 0x2e5984, metalness: 0.3, roughness: 0.6, side: THREE.DoubleSide });
    const statorCore = new THREE.Mesh(statorGeom, paintMat);
    group.add(statorCore);

    // 2. Stator windings
    const windingsGroup = new THREE.Group();
    const phaseMats = [
        new THREE.MeshStandardMaterial({ color: 0xb87333, emissive: 0xff3333, emissiveIntensity: 0 }),
        new THREE.MeshStandardMaterial({ color: 0xb87333, emissive: 0x33ff33, emissiveIntensity: 0 }),
        new THREE.MeshStandardMaterial({ color: 0xb87333, emissive: 0x3333ff, emissiveIntensity: 0 })
    ];
    
    const coilGeom = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
    coilGeom.rotateX(Math.PI / 2);
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const phaseMat = phaseMats[i % 3];
        const coil = new THREE.Mesh(coilGeom, phaseMat);
        coil.position.x = 8.0 * Math.cos(angle);
        coil.position.y = 8.0 * Math.sin(angle);
        windingsGroup.add(coil);
    }

    const tubeGeom = new THREE.TorusGeometry(8.0, 0.8, 16, 64, Math.PI / 3);
    for(let j = 0; j < 2; j++) {
        const zPos = j === 0 ? 10.0 : -10.0;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const phaseMat = phaseMats[i % 3];
            const segment = new THREE.Mesh(tubeGeom, phaseMat);
            segment.position.z = zPos;
            segment.rotation.z = angle;
            windingsGroup.add(segment);
        }
    }
    group.add(windingsGroup);

    // Rotating Assembly
    const rotorAssembly = new THREE.Group();

    // 3. Rotor core
    const rotorGeom = new THREE.CylinderGeometry(6.8, 6.8, 15, 64);
    rotorGeom.rotateX(Math.PI / 2);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.5, roughness: 0.7 });
    const rotorCore = new THREE.Mesh(rotorGeom, rotorMat);
    rotorAssembly.add(rotorCore);

    // 4. Squirrel cage bars
    const barGeom = new THREE.CylinderGeometry(0.3, 0.3, 16, 8);
    barGeom.rotateX(Math.PI / 2);
    const cageMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < 24; i++) {
        const theta = (i * Math.PI * 2) / 24;
        const bar = new THREE.Mesh(barGeom, cageMat);
        bar.position.set(6.5 * Math.cos(theta), 6.5 * Math.sin(theta), 0);
        rotorAssembly.add(bar);
    }

    // 5. End rings
    const ringGeom = new THREE.TorusGeometry(6.5, 0.4, 16, 64);
    const frontRing = new THREE.Mesh(ringGeom, cageMat);
    frontRing.position.z = 8;
    const backRing = new THREE.Mesh(ringGeom, cageMat);
    backRing.position.z = -8;
    rotorAssembly.add(frontRing);
    rotorAssembly.add(backRing);

    // 6. Shaft
    const shaftGeom = new THREE.CylinderGeometry(1.5, 1.5, 28, 32);
    shaftGeom.rotateX(Math.PI / 2);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.4 });
    const shaft = new THREE.Mesh(shaftGeom, shaftMat);
    shaft.position.z = -2; // Extends from -16 to 12
    rotorAssembly.add(shaft);

    // 8. Cooling fan
    const fanGroup = new THREE.Group();
    fanGroup.position.z = -13;
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const hubGeom = new THREE.CylinderGeometry(2, 2, 2, 16);
    hubGeom.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, fanMat);
    fanGroup.add(hub);
    
    const bladeGeom = new THREE.BoxGeometry(16, 0.2, 2);
    for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(bladeGeom, fanMat);
        blade.rotation.z = (i * Math.PI) / 3;
        blade.rotation.x = 0.4;
        fanGroup.add(blade);
    }
    rotorAssembly.add(fanGroup);

    group.add(rotorAssembly);

    // 7. Bearings (and housings)
    const bearingMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.2 });
    const buildBearing = (zPos) => {
        const housing = new THREE.Group();
        housing.position.z = zPos;
        
        const tubeHubGeom = new THREE.TorusGeometry(2.25, 0.75, 16, 32);
        const tubeHub = new THREE.Mesh(tubeHubGeom, bearingMat);
        housing.add(tubeHub);

        const spokeGeom = new THREE.BoxGeometry(0.8, 19, 0.8);
        for(let i=0; i<4; i++){
            const spoke = new THREE.Mesh(spokeGeom, bearingMat);
            spoke.rotation.z = (i * Math.PI) / 4;
            housing.add(spoke);
        }
        
        const rimGeom = new THREE.TorusGeometry(9.6, 0.4, 16, 64);
        const rim = new THREE.Mesh(rimGeom, bearingMat);
        housing.add(rim);

        const connectGeom = new THREE.CylinderGeometry(10, 10, 3, 32, 1, true);
        connectGeom.rotateX(Math.PI / 2);
        const connect = new THREE.Mesh(connectGeom, bearingMat);
        connect.position.z = (zPos > 0) ? -1.5 : 1.5;
        housing.add(connect);

        return housing;
    };
    group.add(buildBearing(10.5));
    group.add(buildBearing(-10.5));

    // 9. Fan cover
    const coverGeom = new THREE.CylinderGeometry(10.2, 10.2, 4.5, 32, 1, true);
    coverGeom.rotateX(Math.PI / 2);
    const fanCover = new THREE.Mesh(coverGeom, paintMat);
    fanCover.position.z = -12.75;
    group.add(fanCover);

    const grilleGroup = new THREE.Group();
    grilleGroup.position.z = -15;
    const grilleRingGeom = new THREE.RingGeometry(9.5, 10.2, 32);
    const grilleRing = new THREE.Mesh(grilleRingGeom, paintMat);
    grilleGroup.add(grilleRing);
    const grilleSpokeGeom = new THREE.BoxGeometry(0.5, 20, 0.2);
    for (let i = 0; i < 4; i++) {
        const spoke = new THREE.Mesh(grilleSpokeGeom, paintMat);
        spoke.rotation.z = (i * Math.PI) / 4;
        grilleGroup.add(spoke);
    }
    const grilleHubGeom = new THREE.CircleGeometry(2, 16);
    const grilleHub = new THREE.Mesh(grilleHubGeom, paintMat);
    grilleGroup.add(grilleHub);
    group.add(grilleGroup);

    // 10. Terminal box
    const boxGeom = new THREE.BoxGeometry(6, 4, 8);
    const box = new THREE.Mesh(boxGeom, paintMat);
    box.position.set(0, 13, 0);
    group.add(box);

    const lidGeom = new THREE.BoxGeometry(6.4, 0.5, 8.4);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x1a365d, metalness: 0.3, roughness: 0.6 });
    const lid = new THREE.Mesh(lidGeom, lidMat);
    lid.position.set(0, 15.25, 0);
    group.add(lid);

    let time = 0;
    const syncSpeed = 10;
    const slip = 0.05;
    const rotorSpeed = syncSpeed * (1 - slip);

    return {
        mesh: group,
        update: function(delta) {
            time += delta;
            
            // Rotating Magnetic Field Effect in Stator Windings
            phaseMats[0].emissiveIntensity = Math.max(0, Math.sin(syncSpeed * time)) * 0.8;
            phaseMats[1].emissiveIntensity = Math.max(0, Math.sin(syncSpeed * time - (2 * Math.PI / 3))) * 0.8;
            phaseMats[2].emissiveIntensity = Math.max(0, Math.sin(syncSpeed * time - (4 * Math.PI / 3))) * 0.8;

            // Rotor and Fan spinning with slip
            rotorAssembly.rotation.z = rotorSpeed * time;
        },
        quiz: [
            {
                question: "What is the primary purpose of a squirrel cage in an induction motor?",
                options: [
                    "To generate a magnetic field from direct current",
                    "To provide a closed circuit for induced rotor currents",
                    "To cool the internal components of the motor",
                    "To connect the rotor to an external power supply"
                ],
                correctAnswer: 1
            },
            {
                question: "What does 'slip' refer to in an induction motor?",
                options: [
                    "The friction in the bearings",
                    "The difference between synchronous speed and rotor speed",
                    "The physical gap between the stator and the rotor",
                    "The loss of power due to heat"
                ],
                correctAnswer: 1
            },
            {
                question: "How is the rotating magnetic field generated in the stator?",
                options: [
                    "By physical rotation of the stator core",
                    "By applying three-phase AC power to the stator windings",
                    "By permanent magnets inside the stator",
                    "By mechanical gears attached to the shaft"
                ],
                correctAnswer: 1
            },
            {
                question: "Why are the squirrel cage bars often skewed (angled) rather than parallel to the shaft?",
                options: [
                    "To reduce magnetic hum and prevent cogging (locking)",
                    "To make manufacturing easier and cheaper",
                    "To increase the weight of the rotor",
                    "To prevent the bars from melting under high heat"
                ],
                correctAnswer: 0
            },
            {
                question: "What material is commonly used for the squirrel cage bars and end rings in standard induction motors?",
                options: [
                    "Carbon fiber",
                    "Magnetic steel",
                    "Aluminum or Copper",
                    "Tungsten"
                ],
                correctAnswer: 2
            },
            {
                question: "What happens if the slip becomes zero during motor operation?",
                options: [
                    "The motor achieves maximum efficiency",
                    "The torque produced becomes zero",
                    "The motor overheats instantly",
                    "The motor reverses its direction of rotation"
                ],
                correctAnswer: 1
            }
        ]
    };
}
