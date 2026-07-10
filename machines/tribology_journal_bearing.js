import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions
    function createBolt(x, y, z) {
        const boltGroup = new THREE.Group();
        const headGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 6);
        const head = new THREE.Mesh(headGeo, chrome);
        head.position.y = 0.5;
        const threadGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
        const thread = new THREE.Mesh(threadGeo, steel);
        thread.position.y = -2;
        boltGroup.add(head);
        boltGroup.add(thread);
        boltGroup.position.set(x, y, z);
        return boltGroup;
    }

    // 1. Base Plate
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-15, -10);
    baseShape.lineTo(15, -10);
    baseShape.lineTo(15, 10);
    baseShape.lineTo(-15, 10);
    const baseExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const basePlate = new THREE.Mesh(baseGeo, darkSteel);
    basePlate.rotation.x = Math.PI / 2;
    basePlate.position.set(0, -15, -1);
    group.add(basePlate);
    parts.push({
        name: 'Base Plate',
        description: 'Heavy mounting plate for the entire bearing assembly, designed to absorb high vibrations.',
        material: 'darkSteel',
        function: 'Support structure',
        assemblyOrder: 1,
        connections: ['lower_housing', 'oil_drain_pan'],
        failureEffect: 'Catastrophic misalignment of the shaft.',
        cascadeFailures: ['Bearing failure', 'Shaft fracture'],
        originalPosition: { x: 0, y: -15, z: -1 },
        explodedPosition: { x: 0, y: -30, z: -1 }
    });

    // 2. Lower Housing
    const lowerHousingShape = new THREE.Shape();
    lowerHousingShape.moveTo(-12, 0);
    lowerHousingShape.lineTo(12, 0);
    lowerHousingShape.lineTo(12, -12);
    lowerHousingShape.lineTo(-12, -12);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 7.5, Math.PI, 0, true);
    lowerHousingShape.holes.push(holePath);
    
    const housingExtrude = { depth: 14, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const lowerBlockGeo = new THREE.ExtrudeGeometry(lowerHousingShape, housingExtrude);
    const lowerBlock = new THREE.Mesh(lowerBlockGeo, darkSteel);
    lowerBlock.position.set(0, -2, -7);
    group.add(lowerBlock);
    
    parts.push({
        name: 'Lower Housing Block',
        description: 'Bottom half of the bearing pedestal housing, precision machined to hold the lower bearing shell.',
        material: 'darkSteel',
        function: 'Retains lower bearing shell and transfers load to base.',
        assemblyOrder: 2,
        connections: ['base_plate', 'lower_bearing_shell'],
        failureEffect: 'Excessive vibration and rapid bearing wear.',
        cascadeFailures: ['Shaft scoring', 'Thermal runaway'],
        originalPosition: { x: 0, y: -2, z: -7 },
        explodedPosition: { x: 0, y: -15, z: -7 }
    });

    // 3. Upper Housing (Bearing Cap)
    const upperHousingShape = new THREE.Shape();
    upperHousingShape.moveTo(-12, 0);
    upperHousingShape.lineTo(12, 0);
    upperHousingShape.lineTo(12, 6);
    // arch
    upperHousingShape.absarc(0, 0, 10.5, 0, Math.PI, false);
    upperHousingShape.lineTo(-12, 6);
    
    const upperHolePath = new THREE.Path();
    upperHolePath.absarc(0, 0, 7.5, 0, Math.PI, false);
    upperHousingShape.holes.push(upperHolePath);
    
    const upperBlockGeo = new THREE.ExtrudeGeometry(upperHousingShape, housingExtrude);
    const upperBlock = new THREE.Mesh(upperBlockGeo, steel);
    upperBlock.position.set(0, -2, -7);
    group.add(upperBlock);
    meshes.upperBlock = upperBlock;

    parts.push({
        name: 'Upper Housing Cap',
        description: 'Top half of the bearing housing, secured with large bolts. Contains oil feed ports.',
        material: 'steel',
        function: 'Secures the upper bearing shell and provides structural rigidity.',
        assemblyOrder: 12,
        connections: ['lower_housing', 'upper_bearing_shell', 'housing_bolts'],
        failureEffect: 'Loss of hydrodynamic pressure and bearing lift-off.',
        cascadeFailures: ['Oil film collapse', 'Metal-to-metal contact'],
        originalPosition: { x: 0, y: -2, z: -7 },
        explodedPosition: { x: 0, y: 15, z: -7 }
    });

    // 4. Housing Bolts
    const bolts = new THREE.Group();
    const boltPositions = [
        [-10, 0, -4], [-10, 0, 4], [10, 0, -4], [10, 0, 4]
    ];
    boltPositions.forEach(pos => {
        const bolt = createBolt(pos[0], pos[1], pos[2]);
        bolts.add(bolt);
    });
    group.add(bolts);
    parts.push({
        name: 'Housing Fasteners',
        description: 'High-tensile steel bolts maintaining exact clamping force on the bearing shells.',
        material: 'chrome',
        function: 'Clamps upper and lower housing halves.',
        assemblyOrder: 13,
        connections: ['upper_housing', 'lower_housing'],
        failureEffect: 'Housing separation and instantaneous failure.',
        cascadeFailures: ['Explosive disassembly', 'Oil fire hazard'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 5. Lower Bearing Shell (Babbitt)
    const lowerShellGeo = new THREE.CylinderGeometry(7.5, 7.5, 13.8, 64, 1, true, Math.PI, Math.PI);
    const lowerShellMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide }); // Copper/Babbitt
    const lowerShell = new THREE.Mesh(lowerShellGeo, lowerShellMat);
    lowerShell.rotation.z = Math.PI / 2;
    lowerShell.position.set(0, -2, 0);
    group.add(lowerShell);
    parts.push({
        name: 'Lower Bearing Shell (Babbitt)',
        description: 'Soft metal alloy (Babbitt) lined lower shell. Designed to embed contaminants and prevent shaft scoring.',
        material: 'copper',
        function: 'Provides low friction surface and conforms to shaft.',
        assemblyOrder: 3,
        connections: ['lower_housing', 'oil_film_layer'],
        failureEffect: 'Wiping of Babbitt material, increased friction.',
        cascadeFailures: ['Journal scoring', 'Overheating'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 6. Upper Bearing Shell (Babbitt)
    const upperShellGeo = new THREE.CylinderGeometry(7.5, 7.5, 13.8, 64, 1, true, 0, Math.PI);
    const upperShell = new THREE.Mesh(upperShellGeo, lowerShellMat);
    upperShell.rotation.z = Math.PI / 2;
    upperShell.position.set(0, -2, 0);
    group.add(upperShell);
    parts.push({
        name: 'Upper Bearing Shell (Babbitt)',
        description: 'Top shell insert featuring an oil distribution groove to feed lubricant into the clearance space.',
        material: 'copper',
        function: 'Distributes oil and reacts to dynamic upward loads.',
        assemblyOrder: 11,
        connections: ['upper_housing', 'oil_film_layer'],
        failureEffect: 'Starvation of oil supply to the load zone.',
        cascadeFailures: ['Dry running', 'Bearing seizure'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 7. Rotating Journal Shaft
    const shaftGeo = new THREE.CylinderGeometry(7.2, 7.2, 40, 64);
    const shaft = new THREE.Mesh(shaftGeo, chrome);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, -2, 0);
    group.add(shaft);
    meshes.shaft = shaft;
    parts.push({
        name: 'Main Journal Shaft',
        description: 'Heavy-duty forged steel shaft rotating at high speeds. Precision ground to a mirror finish.',
        material: 'chrome',
        function: 'Transmits torque and is supported by the hydrodynamic oil film.',
        assemblyOrder: 10,
        connections: ['oil_film_layer'],
        failureEffect: 'Shaft bowing and catastrophic vibration.',
        cascadeFailures: ['Bearing obliteration', 'System shutdown'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: -30, y: -2, z: 0 }
    });

    // 8 & 9. Shaft Flanges
    const flangeGeo = new THREE.CylinderGeometry(11, 11, 2, 32);
    const flangeLeft = new THREE.Mesh(flangeGeo, steel);
    flangeLeft.rotation.z = Math.PI / 2;
    flangeLeft.position.set(-18, -2, 0);
    group.add(flangeLeft);
    meshes.flangeLeft = flangeLeft;

    const flangeRight = new THREE.Mesh(flangeGeo, steel);
    flangeRight.rotation.z = Math.PI / 2;
    flangeRight.position.set(18, -2, 0);
    group.add(flangeRight);
    meshes.flangeRight = flangeRight;
    
    parts.push({
        name: 'Drive Flange (Left)',
        description: 'Connects the journal shaft to the prime mover (motor/turbine).',
        material: 'steel',
        function: 'Torque transmission interface.',
        assemblyOrder: 8,
        connections: ['rotating_journal_shaft'],
        failureEffect: 'Loss of drive power.',
        cascadeFailures: [],
        originalPosition: { x: -18, y: -2, z: 0 },
        explodedPosition: { x: -45, y: -2, z: 0 }
    });
    parts.push({
        name: 'Driven Flange (Right)',
        description: 'Connects the journal shaft to the driven load (pump/generator).',
        material: 'steel',
        function: 'Torque transmission interface.',
        assemblyOrder: 9,
        connections: ['rotating_journal_shaft'],
        failureEffect: 'Load decoupling.',
        cascadeFailures: ['Overspeed event'],
        originalPosition: { x: 18, y: -2, z: 0 },
        explodedPosition: { x: 45, y: -2, z: 0 }
    });

    // 10. Oil Film Layer (Hydrodynamic Film)
    const oilFilmGeo = new THREE.CylinderGeometry(7.35, 7.35, 13.9, 64, 1, true);
    const oilMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe5c100,
        transmission: 0.9,
        opacity: 0.7,
        transparent: true,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        side: THREE.DoubleSide,
        emissive: 0xaa8800,
        emissiveIntensity: 0.4
    });
    const oilFilm = new THREE.Mesh(oilFilmGeo, oilMaterial);
    oilFilm.rotation.z = Math.PI / 2;
    oilFilm.position.set(0, -2, 0);
    group.add(oilFilm);
    meshes.oilFilm = oilFilm;
    
    parts.push({
        name: 'Hydrodynamic Oil Film',
        description: 'A pressurized micron-thin layer of synthetic lubricant dynamically generated by shaft rotation (converging wedge).',
        material: 'tinted',
        function: 'Completely separates the shaft from the bearing shells, carrying the load with zero metal-to-metal contact.',
        assemblyOrder: 15,
        connections: ['rotating_journal_shaft', 'lower_bearing_shell', 'upper_bearing_shell'],
        failureEffect: 'Instant boundary friction transition.',
        cascadeFailures: ['Severe wiping', 'Bearing destruction'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 20 }
    });

    // 11. Pressure Distribution Visualizer
    const pressureVisGroup = new THREE.Group();
    meshes.pressureArrows = [];
    // Create multiple glowing arrows around the bottom half of the bearing
    for(let i=0; i<15; i++) {
        let angle = Math.PI + (Math.PI/14) * i;
        let arrowGeo = new THREE.ConeGeometry(0.3, 2, 8);
        let arrowMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1.0
        });
        let arrow = new THREE.Mesh(arrowGeo, arrowMat);
        // Position at radius 7.5
        let r = 8.5;
        arrow.position.set(0, Math.sin(angle)*r - 2, Math.cos(angle)*r);
        arrow.rotation.x = -angle - Math.PI/2;
        pressureVisGroup.add(arrow);
        meshes.pressureArrows.push({ mesh: arrow, angle: angle });
    }
    group.add(pressureVisGroup);
    meshes.pressureVisGroup = pressureVisGroup;
    
    parts.push({
        name: 'Pressure Profile Array',
        description: 'Holographic sensors depicting the dynamic hydrodynamic pressure wedge forming under the shaft.',
        material: 'glass',
        function: 'Visualizes peak pressure zones in real-time.',
        assemblyOrder: 16,
        connections: ['oil_film_layer'],
        failureEffect: 'Loss of telemetry.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });

    // 12. Oil Feed Pipe Main
    const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 15, -7),
        new THREE.Vector3(0, 10, -7),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 4, 0)
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.8, 16, false);
    const pipe = new THREE.Mesh(pipeGeo, copper);
    group.add(pipe);
    parts.push({
        name: 'Main Oil Feed Line',
        description: 'High-pressure copper hydraulic line supplying cool, filtered lubricant to the bearing.',
        material: 'copper',
        function: 'Delivers lubricant to the upper bearing groove.',
        assemblyOrder: 14,
        connections: ['upper_housing', 'hydraulic_pump'],
        failureEffect: 'Oil starvation.',
        cascadeFailures: ['Film collapse', 'Bearing meltdown'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: -10 }
    });

    // 13. Oil Drain Pan/Sump
    const panShape = new THREE.Shape();
    panShape.moveTo(-10, -5);
    panShape.lineTo(10, -5);
    panShape.lineTo(8, -10);
    panShape.lineTo(-8, -10);
    const panExtrude = { depth: 16, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const panGeo = new THREE.ExtrudeGeometry(panShape, panExtrude);
    const pan = new THREE.Mesh(panGeo, aluminum);
    pan.position.set(0, -11, -8);
    group.add(pan);
    parts.push({
        name: 'Oil Sump / Drain Pan',
        description: 'Collects hot oil exiting the bearing sides for return to the cooling and filtration system.',
        material: 'aluminum',
        function: 'Oil collection and recirculation.',
        assemblyOrder: 4,
        connections: ['base_plate', 'hydraulic_pump'],
        failureEffect: 'Oil spill and environmental hazard.',
        cascadeFailures: ['Loss of system fluid'],
        originalPosition: { x: 0, y: -11, z: -8 },
        explodedPosition: { x: 0, y: -25, z: -8 }
    });

    // 14. Hydraulic Pump System
    const pumpGroup = new THREE.Group();
    const motorGeo = new THREE.CylinderGeometry(2, 2, 5, 32);
    const pumpMotor = new THREE.Mesh(motorGeo, steel);
    pumpMotor.rotation.z = Math.PI / 2;
    pumpMotor.position.set(0, 16, -7);
    
    const pumpHeadGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 16);
    const pumpHead = new THREE.Mesh(pumpHeadGeo, darkSteel);
    pumpHead.rotation.z = Math.PI/2;
    pumpHead.position.set(-3.5, 16, -7);
    
    pumpGroup.add(pumpMotor);
    pumpGroup.add(pumpHead);
    group.add(pumpGroup);
    meshes.pumpMotor = pumpMotor;
    
    parts.push({
        name: 'Lube Oil Pump',
        description: 'Positive displacement gear pump providing continuous pressurized oil flow.',
        material: 'steel',
        function: 'Pressurizes the lubrication system.',
        assemblyOrder: 5,
        connections: ['oil_feed_pipe_main'],
        failureEffect: 'Loss of oil pressure.',
        cascadeFailures: ['Journal bearing failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 25, z: -15 }
    });

    // 15. Sensor Array & Control Panel
    const panelGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(4, 6, 0.5);
    const panelMain = new THREE.Mesh(panelGeo, darkSteel);
    
    const screenGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0x00ff00, emissiveIntensity: 0.5, side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.5, 0.26);
    meshes.screen = screen;
    
    const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const dial = new THREE.Mesh(dialGeo, plastic);
    dial.rotation.x = Math.PI/2;
    dial.position.set(-1, -2, 0.26);
    meshes.dial = dial;

    const buttonGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const button = new THREE.Mesh(buttonGeo, new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0x550000}));
    button.rotation.x = Math.PI/2;
    button.position.set(1, -2, 0.26);

    panelGroup.add(panelMain);
    panelGroup.add(screen);
    panelGroup.add(dial);
    panelGroup.add(button);
    
    panelGroup.position.set(12, 5, 2);
    panelGroup.rotation.y = -Math.PI/6;
    group.add(panelGroup);

    parts.push({
        name: 'Telemetry Control Panel',
        description: 'Monitors vibration, oil pressure, film thickness, and Babbitt temperature.',
        material: 'plastic',
        function: 'Provides operator feedback and safety interlocks.',
        assemblyOrder: 6,
        connections: ['base_plate', 'sensor_array'],
        failureEffect: 'Loss of monitoring capability.',
        cascadeFailures: ['Unnoticed catastrophic failure'],
        originalPosition: { x: 12, y: 5, z: 2 },
        explodedPosition: { x: 25, y: 10, z: 15 }
    });

    // 16. Oil Return Lines
    const returnCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(8, -10, -2),
        new THREE.Vector3(12, -15, -2),
        new THREE.Vector3(15, -15, -7),
        new THREE.Vector3(15, 15, -7),
        new THREE.Vector3(4, 16, -7)
    ]);
    const returnGeo = new THREE.TubeGeometry(returnCurve, 30, 0.5, 12, false);
    const returnPipe = new THREE.Mesh(returnGeo, rubber);
    group.add(returnPipe);
    parts.push({
        name: 'Oil Return & Cooling Loop',
        description: 'High-temp rubber hosing routing scavenged oil back through a heat exchanger to the pump.',
        material: 'rubber',
        function: 'Closes the lubrication loop and removes heat.',
        assemblyOrder: 7,
        connections: ['oil_drain_pan', 'hydraulic_pump'],
        failureEffect: 'Oil accumulation in sump and overflow.',
        cascadeFailures: ['System fire'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: -20, z: -10 }
    });

    // 17. Bearing Thermocouple Probes
    const probeGroup = new THREE.Group();
    const probeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const probe = new THREE.Mesh(probeGeo, chrome);
    probe.position.set(0, 4, 0);
    const wireCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(2, 8, 2),
        new THREE.Vector3(10, 8, 2),
        new THREE.Vector3(12, 6, 2)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 16, 0.05, 8, false);
    const wire = new THREE.Mesh(wireGeo, rubber);
    probeGroup.add(probe);
    probeGroup.add(wire);
    group.add(probeGroup);

    parts.push({
        name: 'RTD Thermocouple Probes',
        description: 'Embedded resistance temperature detectors measuring Babbitt metal temperature near the load zone.',
        material: 'chrome',
        function: 'Monitors for excessive friction heat.',
        assemblyOrder: 17,
        connections: ['upper_bearing_shell', 'Telemetry Control Panel'],
        failureEffect: 'False temperature readings.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 10 }
    });

    // Detailed shaft features (Keyways, cooling fins on flanges)
    const finGeo = new THREE.TorusGeometry(11, 0.2, 8, 48);
    for(let i=0; i<3; i++) {
        let finL = new THREE.Mesh(finGeo, darkSteel);
        finL.rotation.y = Math.PI/2;
        finL.position.set(-18 + i*0.8 - 0.8, -2, 0);
        group.add(finL);
        meshes.flangeLeft.add(finL.clone()); // attach to flange for rotation
        
        let finR = new THREE.Mesh(finGeo, darkSteel);
        finR.rotation.y = Math.PI/2;
        finR.position.set(18 + i*0.8 - 0.8, -2, 0);
        group.add(finR);
        meshes.flangeRight.add(finR.clone());
    }
    
    // Animated particles for oil (simulating flow)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const pPos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 14;
        pPos[i*3+1] = (Math.random() - 0.5) * 14;
        pPos[i*3+2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffff00, size: 0.2, transparent: true, opacity: 0.6 });
    const oilParticles = new THREE.Points(particleGeo, particleMat);
    oilParticles.position.set(0, -2, 0);
    group.add(oilParticles);
    meshes.oilParticles = oilParticles;

    const description = `
### Tribology Journal Bearing (Hydrodynamic)
A high-tech, massive industrial fluid-film journal bearing. Unlike rolling-element bearings, this machine relies entirely on fluid dynamics. As the heavy forged shaft rotates, it drags viscous lubricating oil into a converging wedge geometry, generating immense hydrodynamic pressure. 

This pressure lifts the shaft, preventing metal-to-metal contact with the Babbitt-lined stationary shells. Featuring a pressurized closed-loop hydraulic feed, real-time pressure profile telemetry, RTD temperature monitoring, and high-tensile housing brackets. The system exemplifies the critical balance of fluid viscosity, rotational velocity, and bearing load.
    `;

    const quizQuestions = [
        {
            question: "What principle allows the journal bearing to support heavy loads without metal-to-metal contact?",
            options: [
                "Hydrodynamic wedge pressure",
                "Magnetic levitation",
                "Rolling element friction",
                "Aerodynamic lift"
            ],
            correctAnswer: 0,
            explanation: "As the shaft rotates, it drags oil into a converging clearance space, forming a high-pressure hydrodynamic wedge that lifts the shaft."
        },
        {
            question: "Why are the bearing shells lined with Babbitt metal?",
            options: [
                "It is softer than the shaft, allowing contaminants to embed and preventing shaft scoring.",
                "It is harder than diamond and prevents wear.",
                "It is highly magnetic and repels the shaft.",
                "It is cheap and lightweight."
            ],
            correctAnswer: 0,
            explanation: "Babbitt is a soft alloy that conforms to slight misalignments and allows hard particulate contaminants to embed in it safely without scoring the expensive steel shaft."
        },
        {
            question: "What occurs if the rotational speed drops too low while under load?",
            options: [
                "The hydrodynamic film collapses, causing boundary friction (metal-to-metal contact).",
                "The oil pressure increases exponentially.",
                "The shaft begins to rotate backwards.",
                "The Babbitt metal hardens."
            ],
            correctAnswer: 0,
            explanation: "Hydrodynamic lift requires sufficient surface velocity. If speed drops, the fluid wedge cannot generate enough pressure to support the load, leading to boundary lubrication."
        },
        {
            question: "In a fully developed hydrodynamic film, where is the peak pressure located?",
            options: [
                "Just ahead of the minimum film thickness point.",
                "At the top of the bearing.",
                "Exactly at the bottom dead center.",
                "Uniformly distributed around the entire shaft."
            ],
            correctAnswer: 0,
            explanation: "Peak pressure builds in the converging wedge just before the point of minimum clearance (minimum film thickness)."
        },
        {
            question: "What is the function of the RTD thermocouple probes?",
            options: [
                "To monitor the temperature of the Babbitt metal near the load zone.",
                "To measure the rotational RPM of the shaft.",
                "To cool the oil returning to the sump.",
                "To tighten the housing bolts automatically."
            ],
            correctAnswer: 0,
            explanation: "RTDs (Resistance Temperature Detectors) monitor the bearing shell temperature to warn operators of impending failure due to overheating."
        }
    ];

    function animate(time, speed, m) {
        const timeSec = time * 0.001;
        const rpm = speed * 10; 
        
        // Rotate shaft and flanges
        if(m.shaft) m.shaft.rotation.x -= 0.1 * rpm;
        if(m.flangeLeft) m.flangeLeft.rotation.x -= 0.1 * rpm;
        if(m.flangeRight) m.flangeRight.rotation.x -= 0.1 * rpm;
        if(m.pumpMotor) m.pumpMotor.rotation.x += 0.2 * rpm;

        // Dynamic oil film pulse/color shift based on speed
        if(m.oilFilm && m.oilFilm.material) {
            // Emissive intensity goes up with speed (simulating heat/pressure)
            m.oilFilm.material.emissiveIntensity = 0.2 + (speed * 0.5);
            // Slightly wobble the film to simulate dynamic eccentricity
            m.oilFilm.position.y = -2 + Math.sin(timeSec * 20 * speed) * 0.02;
            m.oilFilm.position.z = Math.cos(timeSec * 20 * speed) * 0.02;
        }

        // Animate pressure arrows
        if(m.pressureArrows) {
            m.pressureArrows.forEach(data => {
                const arrow = data.mesh;
                const angle = data.angle;
                // Peak pressure is usually slightly offset from bottom center in the direction of rotation.
                // Assuming rotation is counter-clockwise. Peak pressure around angle Pi + 0.5 rad.
                const peakAngle = Math.PI + 0.5; 
                // Calculate distance from peak angle
                let dist = Math.abs(angle - peakAngle);
                if (dist > Math.PI) dist = 2*Math.PI - dist;
                
                // Scale arrows based on speed and proximity to peak pressure
                // Gaussian-like distribution
                let intensity = Math.exp(-(dist*dist)/(2 * 0.5 * 0.5));
                let scale = 0.5 + intensity * speed * 2;
                
                arrow.scale.set(1, scale, 1);
                
                // Color shift from cyan to red at high pressure/speed
                if(arrow.material) {
                    let r = intensity * speed;
                    let g = 1.0 - (intensity * speed);
                    let b = 1.0;
                    arrow.material.emissive.setRGB(Math.min(r, 1), Math.max(g, 0), Math.max(b, 0));
                }
            });
        }
        
        // Oil particles flow
        if(m.oilParticles) {
            m.oilParticles.rotation.x -= 0.1 * rpm;
            const positions = m.oilParticles.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                // Flow outward from center to sides
                let x = positions[i];
                if (x > 0) positions[i] += 0.1 * speed;
                else positions[i] -= 0.1 * speed;
                
                if(Math.abs(positions[i]) > 7) {
                    positions[i] = (Math.random() - 0.5) * 2; // reset to center
                }
            }
            m.oilParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Control Panel Screen Flashing
        if(m.screen) {
            // Pulse based on speed
            m.screen.material.emissiveIntensity = 0.5 + Math.sin(timeSec * 10 * speed) * 0.2;
            if(speed > 1.8) {
                m.screen.material.emissive.setHex(0xff0000); // Danger! Over speed
            } else {
                m.screen.material.emissive.setHex(0x00ff00); // Normal
            }
        }
        if(m.dial) {
            // Dial sweeps back and forth slightly, based on speed
            m.dial.rotation.y = (speed - 1) * Math.PI/4 + Math.sin(timeSec * 5) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createJournalBearing() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
