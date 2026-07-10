export function createWaterTreatmentPlant(THREE) {
    const group = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6, roughness: 0.4 });
    const blueWaterMat = new THREE.MeshStandardMaterial({ color: 0x44aaff, transparent: true, opacity: 0.8 });
    const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.4 });
    const greenPumpMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });

    // 1. Intake Pipe
    const intakeGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const intakePipe = new THREE.Mesh(intakeGeom, steelMaterial);
    intakePipe.position.set(-8, 1, 0);
    intakePipe.rotation.z = Math.PI / 2;
    intakePipe.userData = { name: "Intake Pipe", description: "Draws raw water from the source." };
    group.add(intakePipe);

    // 2. Bar Screen
    const barScreenGroup = new THREE.Group();
    for (let i = -0.8; i <= 0.8; i += 0.2) {
        const barGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const bar = new THREE.Mesh(barGeom, steelMaterial);
        bar.position.set(0, 0, i);
        barScreenGroup.add(bar);
    }
    barScreenGroup.position.set(-6, 1, 0);
    barScreenGroup.rotation.z = Math.PI / 6;
    barScreenGroup.userData = { name: "Bar Screen", description: "Removes large debris like branches and plastics." };
    group.add(barScreenGroup);

    // 3. Coagulation Tank
    const coagTankGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const coagTank = new THREE.Mesh(coagTankGeom, concreteMaterial);
    coagTank.position.set(-3, 1.5, 0);
    const coagWaterGeom = new THREE.CylinderGeometry(1.4, 1.4, 2.8, 32);
    const coagWater = new THREE.Mesh(coagWaterGeom, blueWaterMat);
    coagWater.position.set(-3, 1.5, 0);
    group.add(coagTank);
    group.add(coagWater);
    coagTank.userData = { name: "Coagulation Tank", description: "Chemicals are added to neutralize the electrical charge of particles." };

    // 4. Flocculation Basin
    const flocBasinGeom = new THREE.BoxGeometry(3, 2, 3);
    const flocBasin = new THREE.Mesh(flocBasinGeom, concreteMaterial);
    flocBasin.position.set(1, 1, 0);
    const flocPaddleGeom = new THREE.BoxGeometry(2, 0.1, 2);
    const flocPaddle = new THREE.Mesh(flocPaddleGeom, steelMaterial);
    flocPaddle.position.set(1, 1, 0);
    group.add(flocBasin);
    group.add(flocPaddle);
    flocBasin.userData = { name: "Flocculation Basin", description: "Gentle mixing encourages particles to collide and form larger flocs." };

    // 5. Sedimentation Tank
    const sedTankGeom = new THREE.CylinderGeometry(2.5, 2.5, 2, 32);
    const sedTank = new THREE.Mesh(sedTankGeom, concreteMaterial);
    sedTank.position.set(5, 1, 0);
    const sedWater = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.8, 32), blueWaterMat);
    sedWater.position.set(5, 1, 0);
    group.add(sedTank);
    group.add(sedWater);
    sedTank.userData = { name: "Sedimentation Tank", description: "Heavy flocs settle to the bottom by gravity." };

    // 6. Filtration Bed
    const filterBedGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const filterBed = new THREE.Mesh(filterBedGeom, concreteMaterial);
    filterBed.position.set(9, 1.25, 0);
    const sandLayerGeom = new THREE.BoxGeometry(2.3, 1.5, 2.3);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xdeb887 });
    const sandLayer = new THREE.Mesh(sandLayerGeom, sandMat);
    sandLayer.position.set(9, 1, 0);
    group.add(filterBed);
    group.add(sandLayer);
    filterBed.userData = { name: "Filtration Bed", description: "Water passes through layers of sand, gravel, and charcoal to remove remaining particles." };

    // 7. Disinfection Chamber
    const disChamberGeom = new THREE.BoxGeometry(2, 2, 2);
    const disChamber = new THREE.Mesh(disChamberGeom, concreteMaterial);
    disChamber.position.set(12.5, 1, 0);
    disChamber.userData = { name: "Disinfection Chamber", description: "Chlorine, ozone, or UV light is used to kill any remaining bacteria and viruses." };
    group.add(disChamber);

    // 8. Clear Well
    const clearWellGeom = new THREE.CylinderGeometry(2, 2, 3, 32);
    const clearWell = new THREE.Mesh(clearWellGeom, glassMaterial);
    clearWell.position.set(16, 1.5, 0);
    const clearWater = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 2.8, 32), blueWaterMat);
    clearWater.position.set(16, 1.5, 0);
    group.add(clearWell);
    group.add(clearWater);
    clearWell.userData = { name: "Clear Well", description: "Stores the treated, clean water before distribution." };

    // 9. Effluent Pump
    const pumpGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const pump = new THREE.Mesh(pumpGeom, greenPumpMat);
    pump.position.set(19, 0.75, 0);
    pump.rotation.z = Math.PI / 2;
    pump.userData = { name: "Effluent Pump", description: "Pumps the clean water into the distribution system." };
    group.add(pump);

    // 10. Control Panel
    const panelGeom = new THREE.BoxGeometry(0.5, 2, 1);
    const controlPanel = new THREE.Mesh(panelGeom, panelMat);
    controlPanel.position.set(-2, 1, 3);
    controlPanel.userData = { name: "Control Panel", description: "Monitors and controls the entire treatment process." };
    group.add(controlPanel);

    // Add interactivity to meshes
    const parts = [intakePipe, barScreenGroup, coagTank, flocBasin, sedTank, filterBed, disChamber, clearWell, pump, controlPanel];
    parts.forEach(part => {
        part.userData.isMachinePart = true;
    });

    // Animation function
    group.userData.update = function(deltaTime) {
        // Rotate the mixing paddle in the flocculation basin
        flocPaddle.rotation.y += 1.0 * deltaTime;
        // Animate water level in clear well (pulsing slightly)
        clearWater.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.1;
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the Bar Screen?",
            options: [
                "To kill bacteria",
                "To remove large debris like branches and plastics",
                "To add chemicals",
                "To filter out fine sand"
            ],
            correctAnswer: 1
        },
        {
            question: "What happens in the Coagulation Tank?",
            options: [
                "Water is stored for distribution",
                "Chemicals are added to neutralize the electrical charge of particles",
                "Heavy flocs settle to the bottom",
                "Water passes through layers of sand"
            ],
            correctAnswer: 1
        },
        {
            question: "Which part of the plant encourages particles to collide and form larger flocs?",
            options: [
                "Flocculation Basin",
                "Intake Pipe",
                "Disinfection Chamber",
                "Clear Well"
            ],
            correctAnswer: 0
        },
        {
            question: "How does the Sedimentation Tank work?",
            options: [
                "It uses UV light to clean water",
                "It pumps water into the distribution system",
                "It allows heavy flocs to settle to the bottom by gravity",
                "It mixes water vigorously"
            ],
            correctAnswer: 2
        },
        {
            question: "What materials are typically used in a Filtration Bed?",
            options: [
                "Steel and concrete",
                "Layers of sand, gravel, and charcoal",
                "Chlorine and ozone",
                "Plastic and glass"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Disinfection Chamber?",
            options: [
                "To store treated water",
                "To remove large debris",
                "To monitor the treatment process",
                "To kill any remaining bacteria and viruses"
            ],
            correctAnswer: 3
        }
    ];

    return group;
}
