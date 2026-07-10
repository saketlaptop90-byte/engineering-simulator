export function createDnaOrigamiFabricator(THREE) {
    const group = new THREE.Group();

    // 1. basePlate
    const baseGeom = new THREE.BoxGeometry(10, 0.5, 6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const basePlate = new THREE.Mesh(baseGeom, baseMat);
    basePlate.position.set(0, 0.25, 0);
    basePlate.name = "Base Plate";
    basePlate.userData.description = "The foundational platform for the DNA origami fabricator.";
    group.add(basePlate);

    // 2. scaffoldSpool
    const spoolGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const spoolMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const scaffoldSpool = new THREE.Mesh(spoolGeom, spoolMat);
    scaffoldSpool.position.set(-3.5, 1.5, -1.5);
    scaffoldSpool.rotation.x = Math.PI / 2;
    scaffoldSpool.name = "Scaffold Spool";
    scaffoldSpool.userData.description = "Dispenses the long single-stranded M13mp18 viral DNA used as the scaffold.";
    group.add(scaffoldSpool);

    // 3. stapleCartridge
    const cartridgeGeom = new THREE.BoxGeometry(1.5, 2, 1.5);
    const cartridgeMat = new THREE.MeshStandardMaterial({ color: 0x1E90FF });
    const stapleCartridge = new THREE.Mesh(cartridgeGeom, cartridgeMat);
    stapleCartridge.position.set(-3.5, 1.5, 1.5);
    stapleCartridge.name = "Staple Cartridge";
    stapleCartridge.userData.description = "Stores hundreds of short, complementary synthetic DNA staple strands.";
    group.add(stapleCartridge);

    // 4. mixingChamber
    const vatGeom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const vatMat = new THREE.MeshStandardMaterial({ color: 0xFF8C00, transparent: true, opacity: 0.8 });
    const mixingChamber = new THREE.Mesh(vatGeom, vatMat);
    mixingChamber.position.set(-0.5, 1.75, 0);
    mixingChamber.name = "Mixing Chamber";
    mixingChamber.userData.description = "A vat where the scaffold and staple strands are combined in buffer solution.";
    group.add(mixingChamber);

    // 5. thermalCycler
    const cyclerGeom = new THREE.BoxGeometry(2, 2.5, 2);
    const cyclerMat = new THREE.MeshStandardMaterial({ color: 0xB22222 });
    const thermalCycler = new THREE.Mesh(cyclerGeom, cyclerMat);
    thermalCycler.position.set(2, 1.75, 0);
    thermalCycler.name = "Thermal Cycler";
    thermalCycler.userData.description = "Precisely controls temperature to heat and slowly cool (anneal) the DNA mixture, folding it into shape.";
    group.add(thermalCycler);

    // 6. purificationColumn
    const columnGeom = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const purificationColumn = new THREE.Mesh(columnGeom, columnMat);
    purificationColumn.position.set(2, 1.75, 1.8);
    purificationColumn.name = "Purification Column";
    purificationColumn.userData.description = "Filters out excess staple strands and purifies the assembled DNA origami structures.";
    group.add(purificationColumn);

    // 7. inspectionStage
    const stageGeom = new THREE.BoxGeometry(2, 0.2, 2);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const inspectionStage = new THREE.Mesh(stageGeom, stageMat);
    inspectionStage.position.set(2, 0.6, -1.8);
    inspectionStage.name = "Inspection Stage";
    inspectionStage.userData.description = "A microscopic stage for validating the final folded nanostructures.";
    group.add(inspectionStage);

    // 8. laserScanner
    const scannerGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const laserScanner = new THREE.Mesh(scannerGeom, scannerMat);
    laserScanner.position.set(2, 1.2, -1.8);
    laserScanner.rotation.x = Math.PI / 2;
    laserScanner.name = "Laser Scanner";
    laserScanner.userData.description = "An AFM or fluorescent laser component used to visualize and confirm the structural integrity.";
    group.add(laserScanner);

    // 9. controlPanel
    const panelGeom = new THREE.BoxGeometry(2.5, 1.5, 0.2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const controlPanel = new THREE.Mesh(panelGeom, panelMat);
    controlPanel.position.set(0, 1.5, 2.5);
    controlPanel.rotation.x = -Math.PI / 6;
    controlPanel.name = "Control Panel";
    controlPanel.userData.description = "Interface to set annealing protocols, staple concentration, and sequence data.";
    group.add(controlPanel);

    // 10. outputTray
    const trayGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0xD3D3D3 });
    const outputTray = new THREE.Mesh(trayGeom, trayMat);
    outputTray.position.set(4.2, 0.75, 0);
    outputTray.name = "Output Tray";
    outputTray.userData.description = "Collects the finalized vials of purified DNA origami structures ready for deployment.";
    group.add(outputTray);

    // Animation state variables
    let time = 0;

    group.update = function(delta) {
        time += delta;
        // Rotate scaffold spool
        scaffoldSpool.rotation.y += delta;
        
        // Pulse mixing chamber
        mixingChamber.scale.y = 1 + Math.sin(time * 5) * 0.05;

        // Sweep laser scanner back and forth
        laserScanner.position.x = 2 + Math.sin(time * 3) * 0.5;
    };

    group.quiz = [
        {
            question: "What is the role of the 'scaffold' strand in DNA origami?",
            options: [
                "It provides the long backbone that is folded",
                "It cuts the DNA into smaller pieces",
                "It is the short strand that pins the structure together",
                "It replicates the DNA structure"
            ],
            correctAnswer: 0
        },
        {
            question: "What are 'staple' strands?",
            options: [
                "Enzymes that glue the DNA together",
                "Long viral genomes used as a backbone",
                "Short synthetic DNA strands that bind to the scaffold to hold it in a specific shape",
                "Proteins that coat the DNA"
            ],
            correctAnswer: 2
        },
        {
            question: "Which of the following is typically used as a scaffold strand in standard DNA origami?",
            options: [
                "Human chromosome 1",
                "M13mp18 viral genome",
                "Synthetic RNA",
                "E. coli plasmid pUC19"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the process called where the scaffold and staples are heated and slowly cooled to form the structure?",
            options: [
                "Polymerase Chain Reaction (PCR)",
                "DNA Ligation",
                "Gel Electrophoresis",
                "Thermal Annealing"
            ],
            correctAnswer: 3
        },
        {
            question: "How is the shape of a DNA origami structure typically verified?",
            options: [
                "Light microscopy",
                "Nuclear Magnetic Resonance (NMR)",
                "Atomic Force Microscopy (AFM) or Transmission Electron Microscopy (TEM)",
                "X-ray crystallography"
            ],
            correctAnswer: 2
        },
        {
            question: "What is a key application of DNA origami?",
            options: [
                "Creating stronger building materials for houses",
                "Generating electricity for power grids",
                "Accelerating human evolution",
                "Targeted drug delivery systems using nanoscale boxes"
            ],
            correctAnswer: 3
        }
    ];

    return group;
}
