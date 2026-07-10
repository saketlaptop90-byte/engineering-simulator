import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom advanced materials for deep-sea realism
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 1.5, metalness: 0.8, roughness: 0.2 });
    const oilMaterial = new THREE.MeshPhysicalMaterial({ color: 0xcca822, transmission: 0.9, opacity: 0.8, transparent: true, roughness: 0.05, metalness: 0.1, ior: 1.45 });
    const goldPin = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.3 });
    const zinc = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.4, roughness: 0.8 });
    const pottingCompound = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.9 });
    const titaniumMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 });

    function registerPart(name, mesh, description, materialName, func, order, connections, failEffect, cascade, origPos, explPos) {
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder: order,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // 1. Kort Nozzle (Ducted Propeller Housing)
    const nozzlePoints = [];
    for(let i=0; i<=50; i++) {
        let t = i / 50;
        let r = 12 + Math.sin(t * Math.PI) * 2;
        let y = (t - 0.5) * 15;
        nozzlePoints.push(new THREE.Vector2(r, y));
    }
    for(let i=50; i>=0; i--) {
        let t = i / 50;
        let r = 11.5 + Math.sin(t * Math.PI) * 1.5;
        let y = (t - 0.5) * 15;
        nozzlePoints.push(new THREE.Vector2(r, y));
    }
    const nozzleGeom = new THREE.LatheGeometry(nozzlePoints, 128);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, darkSteel);
    nozzleMesh.rotation.x = Math.PI / 2;
    registerPart('KortNozzle', nozzleMesh, 'Hydrodynamic ducted housing to increase thrust efficiency at low speeds.', 'Dark Steel', 'Directs water flow and protects propeller', 1, ['StatorSupports'], 'Loss of thrust efficiency, increased cavitation', ['PropellerDamage'], {x:0, y:0, z:0}, {x:0, y:0, z:25});

    // 2. Propeller Hub
    const hubGeom = new THREE.CylinderGeometry(2, 3, 6, 64);
    const hubMesh = new THREE.Mesh(hubGeom, chrome);
    hubMesh.rotation.x = Math.PI / 2;
    registerPart('PropellerHub', hubMesh, 'Central hub for propeller blades, tapering for hydrodynamics.', 'Chrome', 'Transmits torque from shaft to blades', 2, ['DriveShaft', 'PropellerBlades'], 'Loss of propulsion', ['DriveShaftShear'], {x:0, y:0, z:-2}, {x:0, y:0, z:-15});

    // 3. Propeller Blades
    const bladeGroup = new THREE.Group();
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(5, 5, 10, 2);
    bladeShape.quadraticCurveTo(11, -2, 8, -5);
    bladeShape.quadraticCurveTo(3, -6, 0, 0);
    const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 0.1, bevelThickness: 0.1 };
    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    bladeGeom.translate(2.5, 0, 0);
    for(let i=0; i<7; i++) {
        const blade = new THREE.Mesh(bladeGeom, steel);
        const angle = i * (Math.PI * 2 / 7);
        blade.rotation.z = angle;
        blade.rotation.x = 0.3;
        blade.rotation.y = 0.2;
        bladeGroup.add(blade);
    }
    registerPart('PropellerBlades', bladeGroup, 'Seven skewed blades optimized for low acoustic signature.', 'Steel', 'Generates thrust from rotational kinetic energy', 3, ['PropellerHub'], 'Imbalanced rotation, intense vibration', ['BearingFailure', 'ShaftSealRupture'], {x:0, y:0, z:-2}, {x:20, y:0, z:-15});

    // 4. Drive Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.8, 0.8, 20, 32);
    const shaftMesh = new THREE.Mesh(shaftGeom, steel);
    shaftMesh.rotation.x = Math.PI / 2;
    registerPart('DriveShaft', shaftMesh, 'Precision-machined high-torque transmission shaft.', 'Steel', 'Transfers rotational power from rotor to hub', 4, ['PropellerHub', 'RotorAssembly'], 'Complete loss of power transfer', ['PropellerLoss'], {x:0, y:0, z:5}, {x:0, y:0, z:5});

    // 5. Motor Housing Outer
    const housingOuterGeom = new THREE.CylinderGeometry(5.5, 5.5, 18, 64);
    const housingOuterMesh = new THREE.Mesh(housingOuterGeom, darkSteel);
    housingOuterMesh.rotation.x = Math.PI / 2;
    for(let i=0; i<15; i++) {
        const finGeom = new THREE.TorusGeometry(5.6, 0.3, 16, 64);
        const fin = new THREE.Mesh(finGeom, darkSteel);
        fin.position.y = -7 + i * 1.0;
        fin.rotation.x = Math.PI/2;
        housingOuterMesh.add(fin);
    }
    registerPart('MotorHousingOuter', housingOuterMesh, 'Pressure-resistant outer hull of the electric motor.', 'Dark Steel', 'Protects internals from extreme deep-sea pressure', 5, ['StatorSupports', 'EndCapFront', 'EndCapRear'], 'Implosion, instant catastrophic failure', ['CompleteSystemDestruction'], {x:0, y:0, z:12}, {x:0, y:30, z:12});

    // 6. Stator Supports
    const statorSupportGroup = new THREE.Group();
    const strutShape = new THREE.Shape();
    strutShape.moveTo(-0.5, 0);
    strutShape.lineTo(0.5, 0);
    strutShape.lineTo(0.2, 4);
    strutShape.lineTo(-0.2, 4);
    strutShape.lineTo(-0.5, 0);
    const strutGeom = new THREE.ExtrudeGeometry(strutShape, {depth: 6, bevelEnabled: true, bevelThickness: 0.1});
    strutGeom.translate(0, 5.5, -3);
    for(let i=0; i<4; i++) {
        const sup = new THREE.Mesh(strutGeom, steel);
        sup.rotation.z = i * Math.PI/2;
        statorSupportGroup.add(sup);
    }
    registerPart('StatorSupports', statorSupportGroup, 'Hydrodynamic struts connecting motor housing to Kort nozzle.', 'Steel', 'Structural integrity and vibration dampening', 6, ['MotorHousingOuter', 'KortNozzle'], 'Vibration, eventual shearing', ['KortNozzleLoss'], {x:0, y:0, z:10}, {x:0, y:-30, z:10});

    // 7. Stator Core
    const statorGeom = new THREE.CylinderGeometry(4.8, 4.8, 14, 64);
    const statorMesh = new THREE.Mesh(statorGeom, steel);
    statorMesh.rotation.x = Math.PI / 2;
    for(let i=0; i<24; i++) {
        const coilGroup = new THREE.Group();
        const angle = i * Math.PI / 12;
        coilGroup.rotation.y = angle;
        
        const windingPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4.3, -6, 0),
            new THREE.Vector3(4.5, -6.5, 0),
            new THREE.Vector3(4.5, 6.5, 0),
            new THREE.Vector3(4.3, 6, 0)
        ]);
        const windingGeom = new THREE.TubeGeometry(windingPath, 20, 0.3, 8, false);
        const winding = new THREE.Mesh(windingGeom, copper);
        coilGroup.add(winding);
        statorMesh.add(coilGroup);
    }
    registerPart('StatorCore', statorMesh, 'Stationary electromagnetic coils generating rotating magnetic field.', 'Copper/Steel', 'Induces rotation in the rotor', 7, ['MotorHousingOuter'], 'Motor short-circuit, thrust loss', ['Overheat', 'ElectricalFire'], {x:0, y:0, z:12}, {x:-30, y:0, z:12});

    // 8. Rotor Assembly
    const rotorGeom = new THREE.CylinderGeometry(3.8, 3.8, 13, 64);
    const rotorMesh = new THREE.Mesh(rotorGeom, steel);
    rotorMesh.rotation.x = Math.PI / 2;
    for(let i=0; i<8; i++) {
        const magShape = new THREE.Shape();
        magShape.moveTo(-0.7, 0);
        magShape.lineTo(0.7, 0);
        magShape.lineTo(0.6, 0.4);
        magShape.lineTo(-0.6, 0.4);
        magShape.lineTo(-0.7, 0);
        const magGeom = new THREE.ExtrudeGeometry(magShape, {depth: 12, bevelEnabled: false});
        magGeom.translate(0, 3.7, -6);
        const mag = new THREE.Mesh(magGeom, darkSteel);
        const angle = i * Math.PI / 4;
        mag.rotation.y = angle;
        rotorMesh.add(mag);
    }
    registerPart('RotorAssembly', rotorMesh, 'Permanent magnet synchronous rotor core.', 'Steel', 'Rotates under stator magnetic field', 8, ['DriveShaft', 'StatorCore'], 'Loss of synchronization, violent stutter', ['BearingShatter'], {x:0, y:0, z:12}, {x:30, y:0, z:12});

    // 9. Bearing Assemblies
    const bearingGroup = new THREE.Group();
    const brgGeom = new THREE.TorusGeometry(1.5, 0.4, 16, 64);
    const frontBrg = new THREE.Mesh(brgGeom, chrome);
    frontBrg.position.z = 6;
    const rearBrg = new THREE.Mesh(brgGeom, chrome);
    rearBrg.position.z = 18;
    bearingGroup.add(frontBrg);
    bearingGroup.add(rearBrg);
    const ballGeom = new THREE.SphereGeometry(0.35, 16, 16);
    for(let i=0; i<12; i++) {
        const fb = new THREE.Mesh(ballGeom, chrome);
        fb.position.set(1.5*Math.cos(i*Math.PI/6), 1.5*Math.sin(i*Math.PI/6), 6);
        bearingGroup.add(fb);
        const rb = new THREE.Mesh(ballGeom, chrome);
        rb.position.set(1.5*Math.cos(i*Math.PI/6), 1.5*Math.sin(i*Math.PI/6), 18);
        bearingGroup.add(rb);
    }
    registerPart('BearingAssemblies', bearingGroup, 'Ceramic high-load ball bearings for frictionless rotation.', 'Chrome/Ceramic', 'Supports shaft alignment and absorbs axial thrust', 9, ['DriveShaft', 'MotorHousingOuter'], 'Friction, intense heat, seizing', ['ShaftShear', 'MotorBurnout'], {x:0, y:0, z:0}, {x:0, y:20, z:-5});

    // 10. Rotary Shaft Seals
    const sealGroup = new THREE.Group();
    const sealGeom = new THREE.TorusGeometry(1.0, 0.2, 16, 64);
    for(let i=0; i<3; i++) {
        const seal = new THREE.Mesh(sealGeom, rubber);
        seal.position.z = 4.5 + i*0.4;
        sealGroup.add(seal);
    }
    registerPart('RotaryShaftSeals', sealGroup, 'Triple-redundant mechanical lip seals maintaining oil containment.', 'Rubber', 'Prevents seawater ingress and oil egress', 10, ['DriveShaft', 'EndCapFront'], 'Water intrusion', ['ShortCircuit', 'OilContamination'], {x:0, y:0, z:0}, {x:0, y:-20, z:-5});

    // 11. End Cap Front
    const endCapFGeom = new THREE.CylinderGeometry(5.5, 5.5, 1, 64);
    const endCapFMesh = new THREE.Mesh(endCapFGeom, darkSteel);
    endCapFMesh.rotation.x = Math.PI / 2;
    for(let i=0; i<12; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), chrome);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(4.8 * Math.cos(i*Math.PI/6), 0, 4.8 * Math.sin(i*Math.PI/6));
        endCapFMesh.add(bolt);
    }
    registerPart('EndCapFront', endCapFMesh, 'Forward pressure bulkhead with shaft penetration.', 'Dark Steel', 'Seals the forward section of the motor housing', 11, ['MotorHousingOuter', 'RotaryShaftSeals'], 'Catastrophic flooding', ['CompleteSystemDestruction'], {x:0, y:0, z:4}, {x:0, y:0, z:-20});

    // 12. End Cap Rear
    const endCapRGeom = new THREE.CylinderGeometry(5.5, 5.5, 1, 64);
    const endCapRMesh = new THREE.Mesh(endCapRGeom, darkSteel);
    endCapRMesh.rotation.x = Math.PI / 2;
    for(let i=0; i<12; i++) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16), chrome);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(4.8 * Math.cos(i*Math.PI/6), 0, 4.8 * Math.sin(i*Math.PI/6));
        endCapRMesh.add(bolt);
    }
    registerPart('EndCapRear', endCapRMesh, 'Aft pressure bulkhead containing penetrators and compensation port.', 'Dark Steel', 'Seals the aft section, routes power and fluid', 12, ['MotorHousingOuter', 'PressureCompensator'], 'Catastrophic flooding', ['CompleteSystemDestruction'], {x:0, y:0, z:21}, {x:0, y:0, z:30});

    // 13. Pressure Compensator
    const compGroup = new THREE.Group();
    const compBaseGeom = new THREE.CylinderGeometry(3, 3, 4, 32);
    const compBase = new THREE.Mesh(compBaseGeom, rubber);
    compBase.rotation.x = Math.PI / 2;
    compBase.position.z = 24;
    compGroup.add(compBase);
    for(let i=0; i<8; i++) {
        const corrugationGeom = new THREE.TorusGeometry(3.1, 0.15, 16, 64);
        const corr = new THREE.Mesh(corrugationGeom, rubber);
        corr.position.z = 22.5 + i*0.4;
        compGroup.add(corr);
    }
    registerPart('PressureCompensator', compGroup, 'Flexible elastomeric bladder filled with dielectric oil.', 'Rubber/Oil', 'Equalizes internal motor pressure with ambient ocean pressure', 13, ['EndCapRear'], 'Housing crush or seal blowout', ['Flooding', 'Implosion'], {x:0, y:0, z:0}, {x:-20, y:20, z:35});

    // 14. Dielectric Oil
    const oilGeom = new THREE.CylinderGeometry(4.7, 4.7, 16, 32);
    const oilMesh = new THREE.Mesh(oilGeom, oilMaterial);
    oilMesh.rotation.x = Math.PI / 2;
    registerPart('DielectricOil', oilMesh, 'Non-conductive, incompressible fluid filling all void spaces.', 'Oil', 'Provides pressure compensation and cooling', 14, ['PressureCompensator', 'StatorCore'], 'Overheating, pressure differential', ['Implosion', 'ElectricalShort'], {x:0, y:0, z:12.5}, {x:-30, y:-30, z:20});

    // 15. Electrical Connector
    const connGroup = new THREE.Group();
    const connBaseGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const connBase = new THREE.Mesh(connBaseGeom, pottingCompound);
    connBase.rotation.x = Math.PI / 2;
    connBase.position.set(0, 4, 21.5);
    connGroup.add(connBase);
    for(let i=0; i<6; i++) {
        const pinGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
        const pin = new THREE.Mesh(pinGeom, goldPin);
        pin.rotation.x = Math.PI / 2;
        const angle = i * Math.PI / 3;
        pin.position.set(0.6 * Math.cos(angle), 4 + 0.6 * Math.sin(angle), 23);
        connGroup.add(pin);
    }
    const keyGeom = new THREE.BoxGeometry(0.3, 0.3, 3);
    const key = new THREE.Mesh(keyGeom, plastic);
    key.position.set(0, 5.15, 21.5);
    connGroup.add(key);
    registerPart('ElectricalConnector', connGroup, 'Wet-mateable high-voltage connector with gold-plated pins.', 'Potting/Gold', 'Delivers three-phase power and telemetry', 15, ['EndCapRear', 'UmbilicalCable'], 'Power loss, arcing', ['ThrusterShutdown'], {x:0, y:0, z:0}, {x:20, y:30, z:40});

    // 16. Umbilical Cable
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4, 23),
        new THREE.Vector3(0, 6, 26),
        new THREE.Vector3(-3, 10, 28),
        new THREE.Vector3(-5, 15, 35)
    ]);
    const cableGeom = new THREE.TubeGeometry(cableCurve, 64, 0.8, 16, false);
    const cableMesh = new THREE.Mesh(cableGeom, rubber);
    registerPart('UmbilicalCable', cableMesh, 'Heavy-duty armored power and data tether.', 'Rubber/Steel', 'Connects thruster to ROV main power bus', 16, ['ElectricalConnector'], 'Loss of power and communication', ['TotalFailure'], {x:0, y:0, z:0}, {x:40, y:40, z:40});

    // 17. Telemetry Sensor
    const sensorGroup = new THREE.Group();
    const sensBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2, 32), titaniumMaterial);
    sensBody.rotation.x = Math.PI/2;
    sensBody.position.set(-3.5, 3.5, 19);
    sensorGroup.add(sensBody);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), glass);
    lens.rotation.x = Math.PI/2;
    lens.position.set(-3.5, 3.5, 17.9);
    sensorGroup.add(lens);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.2), neonBlue);
    led.position.set(-3.5, 4.5, 19);
    sensorGroup.add(led);
    registerPart('TelemetrySensor', sensorGroup, 'Integrated pressure, temperature, and RPM sensor package.', 'Titanium/Glass', 'Provides real-time diagnostic feedback to controller', 17, ['EndCapRear'], 'Loss of telemetry', ['SuboptimalPerformance'], {x:0, y:0, z:0}, {x:-40, y:30, z:20});

    // 18. Sacrificial Anodes
    const anodeGroup = new THREE.Group();
    const anodeShape = new THREE.Shape();
    anodeShape.moveTo(-1, -0.25);
    anodeShape.lineTo(1, -0.25);
    anodeShape.lineTo(0.8, 0.25);
    anodeShape.lineTo(-0.8, 0.25);
    anodeShape.lineTo(-1, -0.25);
    const anodeGeom = new THREE.ExtrudeGeometry(anodeShape, {depth: 4, bevelEnabled: true, bevelThickness: 0.05});
    anodeGeom.translate(0, 5.7, -2);
    for(let i=0; i<4; i++) {
        const anode = new THREE.Mesh(anodeGeom, zinc);
        anode.rotation.z = i * Math.PI/2 + Math.PI/4;
        anodeGroup.add(anode);
    }
    registerPart('SacrificialAnodes', anodeGroup, 'Galvanic corrosion protection blocks.', 'Zinc', 'Oxidizes preferentially to protect structural steel', 18, ['MotorHousingOuter'], 'Rapid galvanic corrosion of hull', ['StructuralFailure'], {x:0, y:0, z:0}, {x:0, y:-40, z:30});

    // 19. Mounting Bracket
    const bracketShape = new THREE.Shape();
    bracketShape.moveTo(-3, 0);
    bracketShape.lineTo(3, 0);
    bracketShape.lineTo(4, 5);
    bracketShape.lineTo(8, 5);
    bracketShape.lineTo(8, 7);
    bracketShape.lineTo(-8, 7);
    bracketShape.lineTo(-8, 5);
    bracketShape.lineTo(-4, 5);
    bracketShape.lineTo(-3, 0);
    const bracketGeom = new THREE.ExtrudeGeometry(bracketShape, {depth: 10, bevelEnabled: true, bevelThickness: 0.2});
    bracketGeom.translate(0, 0, -5);
    const bracketMesh = new THREE.Mesh(bracketGeom, darkSteel);
    bracketMesh.position.set(0, 5.5, 12);
    registerPart('MountingBracket', bracketMesh, 'Heavy-duty interface for attaching to ROV frame.', 'Dark Steel', 'Transfers thrust force to vehicle chassis', 19, ['MotorHousingOuter'], 'Thruster detaches from vehicle', ['LossOfVehicleControl'], {x:0, y:0, z:0}, {x:0, y:40, z:-10});

    // 20. Compensation Lines
    const lineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 3, 22),
        new THREE.Vector3(2, 4, 21),
        new THREE.Vector3(4, 3, 18),
        new THREE.Vector3(4, 0, 16)
    ]);
    const lineGeom = new THREE.TubeGeometry(lineCurve, 32, 0.2, 8, false);
    const lineMesh = new THREE.Mesh(lineGeom, copper);
    registerPart('CompensationLines', lineMesh, 'Tubes routing dielectric oil between compartments.', 'Copper', 'Ensures equal pressure distribution', 20, ['PressureCompensator', 'MotorHousingOuter'], 'Pressure differential buildup', ['SealBlowout'], {x:0, y:0, z:0}, {x:30, y:0, z:25});

    const description = "The Deep Sea Thruster is a highly advanced, ultra-durable propulsion unit designed for extreme ocean depths (up to 6000m). It features a flooded, oil-compensated permanent magnet synchronous motor, Kort nozzle for maximum bollard pull, and multi-redundant ceramic bearings. Every component is engineered to withstand immense hydrostatic pressures while delivering precise vector control for ROVs and AUVs.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pressure Compensator in this deep-sea thruster?",
            options: [
                "To increase the rotational speed of the propeller",
                "To equalize the internal oil pressure with the external ambient ocean pressure",
                "To cool down the stator core electromagnetically",
                "To prevent galvanic corrosion"
            ],
            correctAnswer: 1,
            explanation: "The Pressure Compensator uses a flexible diaphragm filled with dielectric oil to ensure the internal pressure perfectly matches the crushing external pressure, preventing the housing from imploding or seals from blowing out."
        },
        {
            question: "Why are the Sacrificial Anodes made of Zinc?",
            options: [
                "Zinc is heavier and provides better ballast",
                "Zinc oxidizes preferentially, protecting the more noble structural metals from galvanic corrosion",
                "Zinc is a superconductor for the electric motor",
                "Zinc makes the thruster invisible to sonar"
            ],
            correctAnswer: 1,
            explanation: "In a saltwater environment, dissimilar metals create a battery effect. Zinc is highly anodic and corrodes first (sacrificed), protecting the critical steel and titanium components."
        },
        {
            question: "What is the purpose of the Kort Nozzle?",
            options: [
                "To make the thruster look aerodynamic",
                "To act as a secondary electric generator",
                "To direct water flow efficiently and increase thrust at low speeds while protecting the blades",
                "To store extra dielectric oil"
            ],
            correctAnswer: 2,
            explanation: "A Kort nozzle is a ducted propeller housing that significantly increases thrust efficiency (bollard pull) at lower speeds and physically protects the spinning blades from debris or impacts."
        },
        {
            question: "Why is Dielectric Oil used inside the motor housing instead of air?",
            options: [
                "Oil is highly conductive and helps the stator work",
                "Air is compressible and would lead to implosion at extreme depths; oil is incompressible and non-conductive",
                "Oil smells better when the thruster is serviced",
                "It reduces the weight of the thruster"
            ],
            correctAnswer: 1,
            explanation: "At 6000m depth, the pressure is immense. An air-filled void would require massively thick, heavy walls to prevent implosion. Filling the void with incompressible, non-conductive (dielectric) oil allows thin walls, as the pressure is equalized inside and out."
        },
        {
            question: "What component prevents seawater from entering along the spinning drive shaft?",
            options: [
                "The Stator Core",
                "The Propeller Hub",
                "The Rotary Shaft Seals (Lip Seals)",
                "The Sacrificial Anodes"
            ],
            correctAnswer: 2,
            explanation: "The Rotary Shaft Seals maintain a tight dynamic barrier around the spinning shaft, holding the oil inside and keeping the highly pressurized seawater out."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const rpm = speed * 15;
        
        if (activeMeshes['PropellerBlades']) activeMeshes['PropellerBlades'].rotation.z = -time * rpm;
        if (activeMeshes['PropellerHub']) activeMeshes['PropellerHub'].rotation.y = -time * rpm;
        if (activeMeshes['DriveShaft']) activeMeshes['DriveShaft'].rotation.y = -time * rpm;
        if (activeMeshes['RotorAssembly']) activeMeshes['RotorAssembly'].rotation.y = -time * rpm;

        if (activeMeshes['BearingAssemblies']) {
            activeMeshes['BearingAssemblies'].children.forEach((child, index) => {
                if (child.geometry.type === 'SphereGeometry') {
                    const angle = (time * rpm * 0.5) + (index * Math.PI / 6);
                    const r = 1.5;
                    const zPos = child.position.z;
                    child.position.set(r * Math.cos(angle), r * Math.sin(angle), zPos);
                    child.rotation.x = time * rpm * 2;
                    child.rotation.y = time * rpm * 2;
                }
            });
        }

        if (activeMeshes['TelemetrySensor']) {
            const led = activeMeshes['TelemetrySensor'].children.find(c => c.material && c.material.emissive);
            if (led) {
                const pulse = (Math.sin(time * 5) + 1) / 2;
                led.material.emissiveIntensity = 0.5 + pulse * 2.0;
            }
        }

        if (activeMeshes['MountingBracket']) {
            const vib = speed > 0.5 ? Math.sin(time * 50) * 0.02 * speed : 0;
            activeMeshes['MountingBracket'].position.x = vib;
        }

        if (activeMeshes['PressureCompensator']) {
            const flex = Math.sin(time * 2) * 0.05 * speed;
            activeMeshes['PressureCompensator'].scale.set(1 + flex, 1 + flex, 1 + (flex * 0.5));
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createUnderwaterThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
