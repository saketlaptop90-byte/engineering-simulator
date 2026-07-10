export function createFlowCytometer(THREE) {
    const cytometerGroup = new THREE.Group();
    cytometerGroup.name = "Flow Cytometer";

    // 1. Laser
    const laserGeo = new THREE.BoxGeometry(2, 1, 1);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.name = "Laser";
    laser.position.set(-6, 0, 0);
    cytometerGroup.add(laser);

    // Visual laser beam
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5.5, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
    const laserBeam = new THREE.Mesh(beamGeo, beamMat);
    laserBeam.rotation.z = Math.PI / 2;
    laserBeam.position.set(3.75, 0, 0);
    laser.add(laserBeam);

    // 2. Fluidics System
    const fluidicsGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const fluidicsMat = new THREE.MeshStandardMaterial({ color: 0x44aaee, transparent: true, opacity: 0.8 });
    const fluidics = new THREE.Mesh(fluidicsGeo, fluidicsMat);
    fluidics.name = "Fluidics System";
    fluidics.position.set(0, 4, 0);
    cytometerGroup.add(fluidics);

    // 3. Flow Cell
    const flowCellGeo = new THREE.CylinderGeometry(0.2, 0.05, 3, 16);
    const flowCellMat = new THREE.MeshStandardMaterial({ color: 0xaaccff, transparent: true, opacity: 0.4, wireframe: true });
    const flowCell = new THREE.Mesh(flowCellGeo, flowCellMat);
    flowCell.name = "Flow Cell";
    flowCell.position.set(0, 1, 0);
    cytometerGroup.add(flowCell);

    // Visual cell particles inside flow cell
    const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cell1 = new THREE.Mesh(particleGeo, particleMat);
    const cell2 = new THREE.Mesh(particleGeo, particleMat);
    const cell3 = new THREE.Mesh(particleGeo, particleMat);
    flowCell.add(cell1, cell2, cell3);

    // 4. Forward Scatter Detector
    const fscGeo = new THREE.CylinderGeometry(0.8, 1.2, 2, 16);
    const fscMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const fsc = new THREE.Mesh(fscGeo, fscMat);
    fsc.name = "Forward Scatter Detector";
    fsc.rotation.z = -Math.PI / 2;
    fsc.position.set(5, 0, 0);
    cytometerGroup.add(fsc);

    // 5. Side Scatter Detector
    const sscGeo = new THREE.CylinderGeometry(0.8, 1.2, 2, 16);
    const sscMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const ssc = new THREE.Mesh(sscGeo, sscMat);
    ssc.name = "Side Scatter Detector";
    ssc.rotation.x = Math.PI / 2;
    ssc.position.set(0, 0, 5);
    cytometerGroup.add(ssc);

    // 6. Fluorescence Detectors
    const flGeo = new THREE.BoxGeometry(2, 3, 2);
    const flMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const fluorescence = new THREE.Mesh(flGeo, flMat);
    fluorescence.name = "Fluorescence Detectors";
    fluorescence.position.set(0, -2, 4);
    cytometerGroup.add(fluorescence);

    // 7. Sample Tube
    const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 });
    const sampleTube = new THREE.Mesh(tubeGeo, tubeMat);
    sampleTube.name = "Sample Tube";
    sampleTube.position.set(0, 6.5, 0);
    cytometerGroup.add(sampleTube);

    // 8. Optics
    const opticsGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const opticsMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const optics = new THREE.Mesh(opticsGeo, opticsMat);
    optics.name = "Optics";
    optics.rotation.y = Math.PI / 2;
    optics.position.set(-2, 0, 0);
    cytometerGroup.add(optics);

    // 9. Sorting Deflector
    const deflectorGeo = new THREE.BoxGeometry(2, 1, 2);
    const deflectorMat = new THREE.MeshStandardMaterial({ color: 0xdd8822 });
    const deflector = new THREE.Mesh(deflectorGeo, deflectorMat);
    deflector.name = "Sorting Deflector";
    deflector.position.set(0, -3, 0);
    cytometerGroup.add(deflector);

    // 10. Waste
    const wasteGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 16);
    const wasteMat = new THREE.MeshStandardMaterial({ color: 0x882222 });
    const waste = new THREE.Mesh(wasteGeo, wasteMat);
    waste.name = "Waste";
    waste.position.set(-3, -5, 0);
    cytometerGroup.add(waste);

    // Animation update loop
    cytometerGroup.userData.update = function(time) {
        // Pulse laser intensity
        beamMat.opacity = 0.4 + 0.4 * Math.sin(time * 8);

        // Move cells continuously through the flow cell
        const speed = 2;
        cell1.position.y = 1.5 - ((time * speed) % 3);
        cell2.position.y = 1.5 - (((time * speed) + 1) % 3);
        cell3.position.y = 1.5 - (((time * speed) + 2) % 3);

        // Slightly deflect cells horizontally once they pass the observation point (simulated sorting)
        [cell1, cell2, cell3].forEach(cell => {
            if (cell.position.y < -0.5) {
                cell.position.x = -Math.sin(cell.position.y * 5) * 0.5;
            } else {
                cell.position.x = 0;
            }
        });
    };

    // Quiz questions
    cytometerGroup.userData.quiz = [
        {
            question: "What is the primary function of the flow cell in a flow cytometer?",
            options: [
                "To align cells in a single file for analysis",
                "To generate the laser beam",
                "To collect waste fluid",
                "To sort cells into different tubes"
            ],
            correctAnswer: 0
        },
        {
            question: "Which parameter is typically measured by the Forward Scatter (FSC) detector?",
            options: [
                "Cell granularity or internal complexity",
                "Cell size or volume",
                "Fluorescence emission",
                "Fluid pressure"
            ],
            correctAnswer: 1
        },
        {
            question: "What does the Side Scatter (SSC) detector primarily measure?",
            options: [
                "Cell size",
                "Cell granularity and internal complexity",
                "DNA content",
                "Cell surface charge"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of fluorescence detectors in flow cytometry?",
            options: [
                "To measure the power of the main laser",
                "To detect specific fluorophores bound to the cells",
                "To align the flow cell",
                "To regulate fluidic pressure"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component is responsible for directing the sample fluid into the flow cell?",
            options: [
                "Optics system",
                "Fluidics system",
                "Sorting deflector",
                "Waste container"
            ],
            correctAnswer: 1
        },
        {
            question: "How does a sorting deflector work in a fluorescence-activated cell sorter (FACS)?",
            options: [
                "It physically pushes cells with a robotic arm",
                "It uses an electromagnetic field to deflect charged droplets containing cells",
                "It uses acoustic waves to destroy unwanted cells",
                "It stops the flow to manually remove cells"
            ],
            correctAnswer: 1
        }
    ];

    return cytometerGroup;
}
