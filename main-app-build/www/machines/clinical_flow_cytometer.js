export function createClinicalFlowCytometer(THREE) {
    const machine = new THREE.Group();

    // 1. Fluidics System
    const fluidicsGroup = new THREE.Group();
    fluidicsGroup.name = "Fluidics System";
    const fluidTankGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const fluidTankMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.3, roughness: 0.4 });
    const fluidTank = new THREE.Mesh(fluidTankGeo, fluidTankMat);
    fluidTank.position.set(-3, 1.5, -2);
    fluidicsGroup.add(fluidTank);
    
    const tubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.8, 8);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    // Position the tube to connect tank (-3, 2.5, -2) to SIP (0, 3, 0)
    tube.position.set(-1.5, 2.75, -1);
    tube.lookAt(new THREE.Vector3(0, 3, 0));
    tube.rotateX(Math.PI / 2);
    fluidicsGroup.add(tube);
    machine.add(fluidicsGroup);

    // 2. Flow Cell
    const flowCellGeo = new THREE.BoxGeometry(0.6, 3, 0.6);
    const flowCellMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xaaddff, 
        transparent: true, 
        opacity: 0.4, 
        transmission: 0.9, 
        roughness: 0.0,
        ior: 1.5
    });
    const flowCell = new THREE.Mesh(flowCellGeo, flowCellMat);
    flowCell.position.set(0, 0, 0);
    flowCell.name = "Flow Cell";
    machine.add(flowCell);

    // 3. Laser Array
    const laserGroup = new THREE.Group();
    laserGroup.name = "Laser Array";
    const laserBoxGeo = new THREE.BoxGeometry(2, 1.2, 1.2);
    const laserBoxMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const laserBox = new THREE.Mesh(laserBoxGeo, laserBoxMat);
    laserBox.position.set(-4, 0, 0);
    laserGroup.add(laserBox);

    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.7, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.6 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(-1.85, 0, 0);
    laserGroup.add(beam);
    machine.add(laserGroup);

    // 4. Forward Scatter Detector (FSC)
    const fscGroup = new THREE.Group();
    fscGroup.name = "Forward Scatter Detector";
    const detBoxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const detBoxMat = new THREE.MeshStandardMaterial({ color: 0x444455 });
    const fscBox = new THREE.Mesh(detBoxGeo, detBoxMat);
    fscBox.position.set(4, 0, 0);
    
    const coneGeo = new THREE.CylinderGeometry(0.6, 0.1, 1, 16);
    const fscCone = new THREE.Mesh(coneGeo, detBoxMat);
    fscCone.rotation.z = Math.PI / 2;
    fscCone.position.set(2.9, 0, 0);
    fscGroup.add(fscBox);
    fscGroup.add(fscCone);
    
    // Light passing through flow cell to FSC
    const fscBeamGeo = new THREE.CylinderGeometry(0.1, 0.6, 2.6, 16);
    const fscBeamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 });
    const fscBeam = new THREE.Mesh(fscBeamGeo, fscBeamMat);
    fscBeam.rotation.z = -Math.PI / 2;
    fscBeam.position.set(1.3, 0, 0);
    fscGroup.add(fscBeam);
    
    machine.add(fscGroup);

    // 5. Side Scatter Detector (SSC)
    const sscGroup = new THREE.Group();
    sscGroup.name = "Side Scatter Detector";
    const sscBox = new THREE.Mesh(detBoxGeo, detBoxMat);
    sscBox.position.set(3, 0, 2);
    const sscCone = new THREE.Mesh(coneGeo, detBoxMat);
    sscCone.rotation.z = Math.PI / 2;
    sscCone.position.set(1.9, 0, 2);
    sscGroup.add(sscBox);
    sscGroup.add(sscCone);
    machine.add(sscGroup);

    // 6. Fluorescence Detectors
    const flGroup = new THREE.Group();
    flGroup.name = "Fluorescence Detectors";
    
    const fl1Box = new THREE.Mesh(detBoxGeo, new THREE.MeshStandardMaterial({ color: 0x228822 })); // Green FL
    fl1Box.position.set(3, 0, 4);
    const fl1Cone = new THREE.Mesh(coneGeo, detBoxMat);
    fl1Cone.rotation.z = Math.PI / 2;
    fl1Cone.position.set(1.9, 0, 4);
    flGroup.add(fl1Box);
    flGroup.add(fl1Cone);
    
    const fl2Box = new THREE.Mesh(detBoxGeo, new THREE.MeshStandardMaterial({ color: 0x882222 })); // Red FL
    fl2Box.position.set(3, 0, 6);
    const fl2Cone = new THREE.Mesh(coneGeo, detBoxMat);
    fl2Cone.rotation.z = Math.PI / 2;
    fl2Cone.position.set(1.9, 0, 6);
    flGroup.add(fl2Box);
    flGroup.add(fl2Cone);
    
    machine.add(flGroup);

    // 7. Optical Filters
    const filterGroup = new THREE.Group();
    filterGroup.name = "Optical Filters";
    const filterGeo = new THREE.PlaneGeometry(1.2, 1.2);
    
    // SSC Filter (Dichroic reflecting to X)
    const filterMat1 = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.6, side: THREE.DoubleSide, metalness: 0.5 });
    const filter1 = new THREE.Mesh(filterGeo, filterMat1);
    filter1.position.set(0, 0, 2);
    filter1.rotation.y = -Math.PI / 4;
    filterGroup.add(filter1);

    // FL1 Filter
    const filterMat2 = new THREE.MeshPhysicalMaterial({ color: 0x55ff55, transparent: true, opacity: 0.6, side: THREE.DoubleSide, metalness: 0.5 });
    const filter2 = new THREE.Mesh(filterGeo, filterMat2);
    filter2.position.set(0, 0, 4);
    filter2.rotation.y = -Math.PI / 4;
    filterGroup.add(filter2);

    // FL2 Filter
    const filterMat3 = new THREE.MeshPhysicalMaterial({ color: 0xff5555, transparent: true, opacity: 0.6, side: THREE.DoubleSide, metalness: 0.5 });
    const filter3 = new THREE.Mesh(filterGeo, filterMat3);
    filter3.position.set(0, 0, 6);
    filter3.rotation.y = -Math.PI / 4;
    filterGroup.add(filter3);
    
    // Base light path to filters (side scatter + fluorescence path)
    const zPathGeo = new THREE.CylinderGeometry(0.1, 0.4, 6, 16);
    const zPathMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const zPath = new THREE.Mesh(zPathGeo, zPathMat);
    zPath.rotation.x = Math.PI / 2;
    zPath.position.set(0, 0, 3);
    filterGroup.add(zPath);

    machine.add(filterGroup);

    // 8. Sample Injection Port
    const sipGroup = new THREE.Group();
    sipGroup.name = "Sample Injection Port";
    const sipBodyGeo = new THREE.CylinderGeometry(0.2, 0.05, 1.5, 16);
    const sipMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const sipBody = new THREE.Mesh(sipBodyGeo, sipMat);
    sipBody.position.set(0, 2.25, 0);
    sipGroup.add(sipBody);
    
    const sipTopGeo = new THREE.CylinderGeometry(0.4, 0.2, 0.5, 16);
    const sipTop = new THREE.Mesh(sipTopGeo, sipMat);
    sipTop.position.set(0, 3.25, 0);
    sipGroup.add(sipTop);
    
    const sipNeedleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8);
    const sipNeedle = new THREE.Mesh(sipNeedleGeo, new THREE.MeshStandardMaterial({color: 0x888888}));
    sipNeedle.position.set(0, 3.75, 0);
    sipGroup.add(sipNeedle);
    machine.add(sipGroup);

    // 9. Signal Processing Electronics
    const elecGroup = new THREE.Group();
    elecGroup.name = "Signal Processing Electronics";
    const elecGeo = new THREE.BoxGeometry(2.5, 4, 1.5);
    const elecMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const electronics = new THREE.Mesh(elecGeo, elecMat);
    electronics.position.set(-4, -1, 4);
    elecGroup.add(electronics);
    
    // Add some screen/lights to electronics
    const screenGeo = new THREE.PlaneGeometry(2, 1.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x004400 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-2.74, 0, 4);
    screen.rotation.y = Math.PI / 2;
    elecGroup.add(screen);
    machine.add(elecGroup);

    // 10. Waste Reservoir
    const wasteGroup = new THREE.Group();
    wasteGroup.name = "Waste Reservoir";
    const wasteGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const wasteMat = new THREE.MeshPhysicalMaterial({ color: 0xddaa55, transparent: true, opacity: 0.6, roughness: 0.1 });
    const waste = new THREE.Mesh(wasteGeo, wasteMat);
    waste.position.set(0, -3, 0);
    wasteGroup.add(waste);
    
    const wasteTubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const wasteTube = new THREE.Mesh(wasteTubeGeo, new THREE.MeshStandardMaterial({color: 0x777777}));
    wasteTube.position.set(0, -1.5, 0);
    wasteGroup.add(wasteTube);
    machine.add(wasteGroup);

    // Cells for animation
    const cells = [];
    const cellGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const cellMatNorm = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Normal cell (greenish)
    const cellMatLeuk = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Leukemic cell (reddish)

    for (let i = 0; i < 15; i++) {
        const isLeukemic = Math.random() > 0.7;
        const cell = new THREE.Mesh(cellGeo, isLeukemic ? cellMatLeuk : cellMatNorm);
        cell.userData = {
            offset: i * 0.4,
            speed: 2.0,
            isLeukemic: isLeukemic
        };
        machine.add(cell);
        cells.push(cell);
    }
    
    // Flash light at laser intersection
    const flashLight = new THREE.PointLight(0xffffff, 0, 5);
    flashLight.position.set(0, 0, 0);
    machine.add(flashLight);
    
    // Pulsing beams to detectors
    const sscBeamGeo = new THREE.CylinderGeometry(0.05, 0.3, 1.9, 16);
    const sscBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const sscBeam = new THREE.Mesh(sscBeamGeo, sscBeamMat);
    sscBeam.rotation.z = -Math.PI / 2;
    sscBeam.position.set(0.95, 0, 2);
    machine.add(sscBeam);

    const fl1BeamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
    const fl1Beam = new THREE.Mesh(sscBeamGeo, fl1BeamMat);
    fl1Beam.rotation.z = -Math.PI / 2;
    fl1Beam.position.set(0.95, 0, 4);
    machine.add(fl1Beam);

    const fl2BeamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
    const fl2Beam = new THREE.Mesh(sscBeamGeo, fl2BeamMat);
    fl2Beam.rotation.z = -Math.PI / 2;
    fl2Beam.position.set(0.95, 0, 6);
    machine.add(fl2Beam);

    // --- Machine Metadata ---

    machine.parts = [
        { name: "Fluidics System", description: "Pumps and tubes that carry the sample and sheath fluid, utilizing hydrodynamic focusing to align cells." },
        { name: "Flow Cell", description: "The central chamber where cells flow single file and intersect the laser beam." },
        { name: "Laser Array", description: "Provides the excitation light for scattering and fluorescence analysis." },
        { name: "Forward Scatter Detector", description: "Measures light scattered along the axis of the laser beam, indicating relative cell size." },
        { name: "Side Scatter Detector", description: "Measures light scattered at a 90-degree angle, indicating internal complexity or granularity." },
        { name: "Fluorescence Detectors", description: "Photomultiplier tubes (PMTs) that measure specific wavelengths of emitted fluorescent light, often linked to labeled antibodies." },
        { name: "Optical Filters", description: "Dichroic mirrors and bandpass filters that route specific wavelengths of light to the appropriate detectors." },
        { name: "Sample Injection Port", description: "Where the patient sample (e.g., blood or bone marrow) is introduced into the system." },
        { name: "Signal Processing Electronics", description: "Converts analog optical signals into digital data, displaying results as scatter plots or histograms." },
        { name: "Waste Reservoir", description: "Collects the fluid and sample after they have passed through the flow cell." }
    ];

    machine.quiz = [
        {
            question: "In flow cytometry, what does Forward Scatter (FSC) primarily measure?",
            options: ["Cell size", "Cell granularity", "Fluorescence intensity", "DNA content"],
            answer: 0
        },
        {
            question: "What does Side Scatter (SSC) primarily indicate about a cell?",
            options: ["Internal complexity or granularity", "Cell surface area", "Total volume", "Membrane potential"],
            answer: 0
        },
        {
            question: "Which component is responsible for focusing cells into a single file line?",
            options: ["Fluidics System (hydrodynamic focusing)", "Laser Array", "Optical Filters", "Signal Processing Electronics"],
            answer: 0
        },
        {
            question: "What is the function of optical filters (dichroic mirrors) in a flow cytometer?",
            options: ["To route specific wavelengths of light to different detectors", "To focus the laser beam", "To pump sheath fluid", "To digitize analog signals"],
            answer: 0
        },
        {
            question: "Which detector is typically positioned at a 90-degree angle to the laser path?",
            options: ["Side Scatter Detector", "Forward Scatter Detector", "Sample Injection Port", "Waste Reservoir"],
            answer: 0
        },
        {
            question: "In oncology, flow cytometry is frequently used to rapidly analyze cells for what condition?",
            options: ["Leukemia and Lymphoma", "Lung Cancer", "Breast Cancer", "Melanoma"],
            answer: 0
        }
    ];

    machine.animation = (time) => {
        const t = time * 0.001;
        let isFlashing = false;
        let activeColor = 0xffffff;
        let isLeuk = false;

        cells.forEach(cell => {
            // Y goes from 3.5 down to -2.5 (length = 6)
            let y = 3.5 - ((t * cell.userData.speed + cell.userData.offset) % 6);
            cell.position.set(0, y, 0);

            // Trigger flash when crossing y=0
            if (Math.abs(y) < 0.15) {
                isFlashing = true;
                isLeuk = cell.userData.isLeukemic;
                activeColor = isLeuk ? 0xff5555 : 0x55ff55;
            }
        });

        if (isFlashing) {
            flashLight.color.setHex(activeColor);
            flashLight.intensity = 5;
            
            // Pulse scatter and fluorescence beams
            sscBeamMat.opacity = 0.8;
            if (isLeuk) {
                fl2BeamMat.opacity = 0.8; // Red fluorescence for leukemic
                fl1BeamMat.opacity = 0.1;
            } else {
                fl1BeamMat.opacity = 0.8; // Green fluorescence for normal
                fl2BeamMat.opacity = 0.1;
            }
            
            // Randomly update screen color based on cells
            screenMat.color.setHex(activeColor);
        } else {
            flashLight.intensity *= 0.8;
            sscBeamMat.opacity *= 0.8;
            fl1BeamMat.opacity *= 0.8;
            fl2BeamMat.opacity *= 0.8;
            screenMat.color.lerp(new THREE.Color(0x002200), 0.1);
        }
    };

    return machine;
}
