import * as THREE from 'three';

export function createCVDReactor(THREE) {
    const group = new THREE.Group();

    // 10. Reactor Housing
    const housingGeometry = new THREE.BoxGeometry(10, 2, 10);
    const housingMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.3 });
    const reactorHousing = new THREE.Mesh(housingGeometry, housingMaterial);
    reactorHousing.position.set(0, -1, 0);
    reactorHousing.name = 'reactorHousing';
    group.add(reactorHousing);

    // 1. Quartz Reaction Chamber
    const chamberGeometry = new THREE.CylinderGeometry(3, 3, 8, 32);
    const chamberMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x88ccff, 
        transparent: true, 
        opacity: 0.3, 
        roughness: 0.1, 
        transmission: 0.9, 
        thickness: 0.1 
    });
    const quartzReactionChamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    quartzReactionChamber.position.set(0, 4, 0);
    quartzReactionChamber.name = 'quartzReactionChamber';
    group.add(quartzReactionChamber);

    // 8. Cooling Jacket
    const jacketGeometry = new THREE.CylinderGeometry(3.5, 3.5, 7.5, 32);
    const jacketMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xaaaaaa, 
        transparent: true, 
        opacity: 0.2,
        wireframe: true
    });
    const coolingJacket = new THREE.Mesh(jacketGeometry, jacketMaterial);
    coolingJacket.position.set(0, 4, 0);
    coolingJacket.name = 'coolingJacket';
    group.add(coolingJacket);

    // 2. RF Heating Coil
    const coilGroup = new THREE.Group();
    const coilMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.2 }); // Copper
    for (let i = 0; i < 5; i++) {
        const torusGeometry = new THREE.TorusGeometry(3.6, 0.15, 16, 64);
        const coilTurn = new THREE.Mesh(torusGeometry, coilMaterial);
        coilTurn.rotation.x = Math.PI / 2;
        coilTurn.position.y = i * 1.0 - 2.0;
        coilGroup.add(coilTurn);
    }
    coilGroup.position.set(0, 4, 0);
    coilGroup.name = 'rfHeatingCoil';
    group.add(coilGroup);

    // 3. Substrate Wafer (and susceptor)
    const susceptorGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const susceptorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const susceptor = new THREE.Mesh(susceptorGeometry, susceptorMaterial);
    susceptor.position.set(0, 1.5, 0);
    
    const waferGeometry = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const waferMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaadd, metalness: 1, roughness: 0.1 });
    const substrateWafer = new THREE.Mesh(waferGeometry, waferMaterial);
    substrateWafer.position.set(0, 0.275, 0);
    substrateWafer.name = 'substrateWafer';
    susceptor.add(substrateWafer);
    
    group.add(susceptor);

    // 4. Gas Inlet Showerhead
    const showerheadGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.4, 32);
    const showerheadMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.4 });
    const gasInletShowerhead = new THREE.Mesh(showerheadGeometry, showerheadMaterial);
    gasInletShowerhead.position.set(0, 7.5, 0);
    gasInletShowerhead.name = 'gasInletShowerhead';
    group.add(gasInletShowerhead);

    // 7. Plasma Generator
    const plasmaGenGeometry = new THREE.BoxGeometry(3, 1.5, 3);
    const plasmaGenMaterial = new THREE.MeshStandardMaterial({ color: 0x4444aa, metalness: 0.5, roughness: 0.5 });
    const plasmaGenerator = new THREE.Mesh(plasmaGenGeometry, plasmaGenMaterial);
    plasmaGenerator.position.set(0, 8.75, 0);
    plasmaGenerator.name = 'plasmaGenerator';
    group.add(plasmaGenerator);

    // 5. Mass Flow Controllers
    const mfcGroup = new THREE.Group();
    const mfcGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const mfcMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, metalness: 0.3, roughness: 0.6 });
    for (let i = -1; i <= 1; i += 2) {
        const mfc = new THREE.Mesh(mfcGeometry, mfcMaterial);
        mfc.position.set(i * 2, 8.75, 2.5);
        mfcGroup.add(mfc);
    }
    mfcGroup.name = 'massFlowControllers';
    group.add(mfcGroup);

    // 6. Vacuum Exhaust Pump
    const pumpGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const pumpMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.7, roughness: 0.3 });
    const vacuumExhaustPump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    vacuumExhaustPump.position.set(4, 1.5, 0);
    vacuumExhaustPump.rotation.x = Math.PI / 2;
    vacuumExhaustPump.name = 'vacuumExhaustPump';
    group.add(vacuumExhaustPump);
    
    // Pump pipe
    const pipeGeom = new THREE.CylinderGeometry(0.5, 0.5, 4);
    const pipeMesh = new THREE.Mesh(pipeGeom, pumpMaterial);
    pipeMesh.position.set(2, 1.5, 0);
    pipeMesh.rotation.z = Math.PI / 2;
    group.add(pipeMesh);

    // 9. Pressure Sensor
    const sensorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xdd2222, metalness: 0.5, roughness: 0.5 });
    const pressureSensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    pressureSensor.position.set(-3.5, 5, 0);
    pressureSensor.rotation.z = Math.PI / 2;
    pressureSensor.name = 'pressureSensor';
    group.add(pressureSensor);

    // Animation Particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2.5;
        const angle = Math.random() * Math.PI * 2;
        particlePositions[i * 3] = Math.cos(angle) * radius; // x
        particlePositions[i * 3 + 1] = 7.3 - Math.random() * 5.5; // y
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius; // z
        
        particleSpeeds[i] = 1.0 + Math.random() * 2.0; // speed
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffcc,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const update = (delta) => {
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] -= particleSpeeds[i] * delta; 
            
            if (positions[i * 3 + 1] < 1.8) {
                const radius = Math.random() * 2.5;
                const angle = Math.random() * Math.PI * 2;
                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = 7.3;
                positions[i * 3 + 2] = Math.sin(angle) * radius;
                
                waferMaterial.emissive.setHex(0x222255);
            }
        }
        
        waferMaterial.emissive.lerp(new THREE.Color(0x000000), 0.1);
        particles.geometry.attributes.position.needsUpdate = true;
        
        coilGroup.rotation.y += delta * 0.5;
    };

    const questions = [
        {
            question: "What is the primary purpose of a CVD reactor?",
            options: [
                "To grow thin solid films from gaseous precursors",
                "To melt solid metals into liquids",
                "To measure the electrical resistance of materials",
                "To cool down high-temperature plasmas"
            ],
            correctAnswer: 0,
            explanation: "Chemical Vapor Deposition (CVD) is used to produce high-quality, high-performance, solid materials, typically under vacuum, by reacting gaseous precursors."
        },
        {
            question: "What role does the RF heating coil play in CVD?",
            options: [
                "It cools the reactor chamber",
                "It induces a magnetic field to heat the susceptor and substrate",
                "It pumps exhaust gases out",
                "It measures the pressure of the system"
            ],
            correctAnswer: 1,
            explanation: "RF heating coils generate an alternating magnetic field that induces eddy currents in a conductive susceptor, heating it and the substrate resting on it."
        },
        {
            question: "Which component ensures uniform distribution of precursor gases over the substrate?",
            options: [
                "Vacuum Exhaust Pump",
                "Mass Flow Controller",
                "Gas Inlet Showerhead",
                "Cooling Jacket"
            ],
            correctAnswer: 2,
            explanation: "The gas inlet showerhead is designed with a pattern of holes to evenly distribute the reactant gases across the surface of the substrate wafer."
        },
        {
            question: "What is the purpose of Mass Flow Controllers (MFCs) in a CVD system?",
            options: [
                "To regulate the temperature of the substrate",
                "To control and measure the flow rate of specific gases",
                "To prevent plasma from escaping",
                "To maintain the vacuum in the exhaust pipe"
            ],
            correctAnswer: 1,
            explanation: "MFCs are precision instruments used to measure and control the flow of specific precursor gases into the reactor chamber."
        },
        {
            question: "How does Plasma-Enhanced CVD (PECVD) differ from thermal CVD?",
            options: [
                "It relies solely on thermal energy to break molecular bonds",
                "It operates at much higher substrate temperatures",
                "It uses plasma to generate reactive species at lower temperatures",
                "It does not require vacuum pumps"
            ],
            correctAnswer: 2,
            explanation: "PECVD utilizes plasma to create highly reactive ions and radicals, allowing chemical reactions to occur at significantly lower substrate temperatures than thermal CVD."
        },
        {
            question: "Why is a vacuum exhaust pump necessary in a low-pressure CVD (LPCVD) system?",
            options: [
                "To keep the substrate from oxidizing by removing air and reaction byproducts",
                "To increase the pressure to atmospheric levels",
                "To generate the plasma for deposition",
                "To cool the reactor walls"
            ],
            correctAnswer: 0,
            explanation: "The vacuum pump maintains a low-pressure environment, removing unreacted precursors and byproducts while preventing contamination from atmospheric gases."
        }
    ];

    return { group, update, questions };
}
