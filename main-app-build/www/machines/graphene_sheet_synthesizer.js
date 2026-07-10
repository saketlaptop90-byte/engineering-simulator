export function createGrapheneSheetSynthesizer(THREE) {
    const group = new THREE.Group();

    // Materials
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const furnaceMat = new THREE.MeshStandardMaterial({ color: 0xdd4411, emissive: 0x551100 });
    const substrateMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.3 }); // Copper
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, transparent: true, opacity: 0.8 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
    const coolingMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, roughness: 0.5 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const spoolMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.7 });

    // Part 1: Main Chamber
    const chamberGeom = new THREE.BoxGeometry(10, 4, 6);
    const chamber = new THREE.Mesh(chamberGeom, chamberMat);
    chamber.name = "MainVacuumChamber";
    chamber.userData.description = "Main vacuum chamber for CVD process.";
    group.add(chamber);

    // Part 2: Heating Furnace
    const furnaceGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    furnaceGeom.rotateZ(Math.PI / 2);
    const furnace = new THREE.Mesh(furnaceGeom, furnaceMat);
    furnace.position.set(0, 0, 0);
    furnace.name = "HeatingFurnace";
    furnace.userData.description = "High-temperature furnace surrounding the substrate.";
    group.add(furnace);

    // Part 3: Copper Substrate
    const substrateGeom = new THREE.BoxGeometry(6, 0.1, 2);
    const substrate = new THREE.Mesh(substrateGeom, substrateMat);
    substrate.position.set(0, -0.5, 0);
    substrate.name = "CopperSubstrate";
    substrate.userData.description = "Catalytic copper foil for graphene growth.";
    group.add(substrate);

    // Part 4: Gas Inlet
    const inletGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const inlet = new THREE.Mesh(inletGeom, pipeMat);
    inlet.position.set(-4.5, 2, 0);
    inlet.name = "GasInlet";
    inlet.userData.description = "Inlet for methane and hydrogen gas precursors.";
    group.add(inlet);

    // Part 5: Gas Exhaust
    const exhaustGeom = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const exhaust = new THREE.Mesh(exhaustGeom, pipeMat);
    exhaust.position.set(4.5, -2, 0);
    exhaust.name = "GasExhaust";
    exhaust.userData.description = "Exhaust for unreacted gases and byproducts.";
    group.add(exhaust);

    // Part 6: Plasma Generator
    const plasmaGeom = new THREE.SphereGeometry(1, 32, 32);
    const plasma = new THREE.Mesh(plasmaGeom, plasmaMat);
    plasma.position.set(-2, 0, 0);
    plasma.name = "PlasmaGenerator";
    plasma.userData.description = "Plasma source for PECVD synthesis.";
    group.add(plasma);

    // Part 7: Laser Source
    const laserGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const laser = new THREE.Mesh(laserGeom, laserMat);
    laser.position.set(2, 2.5, 0);
    laser.name = "LaserSource";
    laser.userData.description = "Laser for precise defect engineering or annealing.";
    group.add(laser);

    // Part 8: Cooling Block
    const coolingGeom = new THREE.BoxGeometry(2, 1, 3);
    const cooling = new THREE.Mesh(coolingGeom, coolingMat);
    cooling.position.set(4, -1, 0);
    cooling.name = "CoolingBlock";
    cooling.userData.description = "Rapid cooling mechanism to freeze graphene structure.";
    group.add(cooling);

    // Part 9: Control Panel
    const panelGeom = new THREE.BoxGeometry(0.5, 2, 3);
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.position.set(0, 0, 3.25);
    panel.name = "ControlPanel";
    panel.userData.description = "Monitors temperature, pressure, and gas flow rates.";
    group.add(panel);

    // Part 10: Output Spool
    const spoolGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    spoolGeom.rotateX(Math.PI / 2);
    const spool = new THREE.Mesh(spoolGeom, spoolMat);
    spool.position.set(6, 0, 0);
    spool.name = "OutputSpool";
    spool.userData.description = "Roll-to-roll spooling system for collecting the synthesized sheet.";
    group.add(spool);

    let time = 0;
    group.update = (delta) => {
        time += delta;
        // Spool rotation
        spool.rotation.x -= delta * 1.5;
        
        // Plasma pulsation
        const scale = 1 + 0.1 * Math.sin(time * 5);
        plasma.scale.set(scale, scale, scale);
        
        // Laser scanning back and forth along Z-axis
        laser.position.z = Math.sin(time * 2) * 1.5;
        
        // Furnace pulsing heat emission
        furnaceMat.emissiveIntensity = 0.5 + 0.5 * Math.abs(Math.sin(time * 3));
    };

    group.quiz = [
        {
            question: "Which material is most commonly used as a catalytic substrate for Chemical Vapor Deposition (CVD) of graphene?",
            options: ["Silicon", "Aluminum", "Copper", "Glass"],
            correctAnswer: 2
        },
        {
            question: "What is the primary carbon source gas used in CVD graphene synthesis?",
            options: ["Methane", "Carbon dioxide", "Ethane", "Carbon monoxide"],
            correctAnswer: 0
        },
        {
            question: "What property makes graphene exceptional for electronics?",
            options: ["High bandgap", "Low thermal conductivity", "Magnetic properties", "High electron mobility"],
            correctAnswer: 3
        },
        {
            question: "What is the primary purpose of hydrogen gas during the CVD graphene growth process?",
            options: ["To form water", "To etch amorphous carbon and co-catalyze growth", "To cool the system", "To create plasma"],
            correctAnswer: 1
        },
        {
            question: "Graphene consists of carbon atoms arranged in which type of lattice?",
            options: ["Cubic", "Tetrahedral", "Hexagonal (honeycomb)", "Orthorhombic"],
            correctAnswer: 2
        },
        {
            question: "In roll-to-roll graphene synthesis, what process typically follows growth on a metal foil?",
            options: ["Melting the foil", "Freezing to -200C", "Polymer coating and metal etching", "Hammering the foil"],
            correctAnswer: 2
        }
    ];

    return group;
}
