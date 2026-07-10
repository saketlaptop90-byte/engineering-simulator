export function createScanningElectronMicroscope(THREE) {
    const group = new THREE.Group();
    
    // 1. Housing (Column)
    const housingGeom = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const housing = new THREE.Mesh(housingGeom, housingMat);
    housing.position.y = 0.5;
    housing.name = "Housing";
    group.add(housing);

    // 2. Electron Gun
    const gunGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const electronGun = new THREE.Mesh(gunGeom, gunMat);
    electronGun.position.y = 2.6;
    electronGun.name = "ElectronGun";
    group.add(electronGun);

    // 3. Anode
    const anodeGeom = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const anode = new THREE.Mesh(anodeGeom, anodeMat);
    anode.rotation.x = Math.PI / 2;
    anode.position.y = 1.8;
    anode.name = "Anode";
    group.add(anode);

    // 4. Electromagnetic Lenses
    const lensGeom = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    const electromagneticLenses = new THREE.Group();
    const lens1 = new THREE.Mesh(lensGeom, lensMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.y = 1.0;
    const lens2 = new THREE.Mesh(lensGeom, lensMat);
    lens2.rotation.x = Math.PI / 2;
    lens2.position.y = 0.0;
    electromagneticLenses.add(lens1);
    electromagneticLenses.add(lens2);
    electromagneticLenses.name = "ElectromagneticLenses";
    group.add(electromagneticLenses);

    // 5. Scanning Coils
    const coilGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xaa33aa });
    const scanningCoils = new THREE.Mesh(coilGeom, coilMat);
    scanningCoils.position.y = -0.8;
    scanningCoils.name = "ScanningCoils";
    group.add(scanningCoils);

    // 6. Sample Chamber
    const chamberGeom = new THREE.BoxGeometry(3.5, 2.5, 3.5);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
    const sampleChamber = new THREE.Mesh(chamberGeom, chamberMat);
    sampleChamber.position.y = -2.75;
    sampleChamber.name = "SampleChamber";
    group.add(sampleChamber);

    // 7. Sample Stage
    const stageGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const sampleStage = new THREE.Mesh(stageGeom, stageMat);
    sampleStage.position.y = -3.8;
    sampleStage.name = "SampleStage";
    group.add(sampleStage);

    // 8. Secondary Electron Detector
    const detectorGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16);
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x33aa33 });
    const secondaryElectronDetector = new THREE.Mesh(detectorGeom, detectorMat);
    secondaryElectronDetector.position.set(1.2, -3.2, 0);
    secondaryElectronDetector.rotation.z = Math.PI / 4;
    secondaryElectronDetector.name = "SecondaryElectronDetector";
    group.add(secondaryElectronDetector);

    // 9. Vacuum System
    const vacuumGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const vacuumMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
    const vacuumSystem = new THREE.Mesh(vacuumGeom, vacuumMat);
    vacuumSystem.position.set(-2.2, -2.75, 0);
    vacuumSystem.rotation.z = Math.PI / 2;
    vacuumSystem.name = "VacuumSystem";
    group.add(vacuumSystem);

    // 10. Electron Beam
    const beamGeom = new THREE.CylinderGeometry(0.03, 0.03, 6.4, 8);
    // Translate geometry so origin is at the top, allowing it to pivot from the gun
    beamGeom.translate(0, -3.2, 0);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const electronBeam = new THREE.Mesh(beamGeom, beamMat);
    electronBeam.position.y = 2.6;
    electronBeam.name = "ElectronBeam";
    group.add(electronBeam);

    let time = 0;
    const update = (delta) => {
        time += delta;
        
        // Pulse the beam opacity to simulate electron flow
        electronBeam.material.opacity = 0.4 + 0.4 * Math.sin(time * 20);

        // Raster scan the beam in a small cone angle
        electronBeam.rotation.z = Math.sin(time * 10) * 0.03;
        electronBeam.rotation.x = Math.cos(time * 13) * 0.03;
    };

    const questions = [
        {
            question: "What is the primary function of the electron gun in an SEM?",
            options: [
                "To detect secondary electrons",
                "To generate the electron beam",
                "To create a vacuum in the chamber",
                "To focus the beam on the sample"
            ],
            correctAnswer: 1,
            explanation: "The electron gun generates the initial beam of electrons, usually by thermionic emission or field emission."
        },
        {
            question: "Why is a vacuum system essential in a Scanning Electron Microscope?",
            options: [
                "To keep the sample cold",
                "To prevent electrons from colliding with gas molecules",
                "To enhance the color of the image",
                "To increase the magnetic field strength"
            ],
            correctAnswer: 1,
            explanation: "A high vacuum is required so that the electron beam can travel without being scattered by air molecules."
        },
        {
            question: "What is the role of the electromagnetic lenses?",
            options: [
                "To accelerate the electrons",
                "To convert electrons into photons",
                "To focus the electron beam into a fine probe",
                "To detect backscattered electrons"
            ],
            correctAnswer: 2,
            explanation: "Electromagnetic lenses use magnetic fields to demagnify and focus the electron beam down to a very small spot on the sample."
        },
        {
            question: "Which component is responsible for scanning the electron beam across the sample surface?",
            options: [
                "Anode",
                "Sample stage",
                "Scanning coils",
                "Secondary electron detector"
            ],
            correctAnswer: 2,
            explanation: "Scanning coils deflect the electron beam in a raster pattern across the surface of the sample."
        },
        {
            question: "What does the secondary electron detector primarily measure?",
            options: [
                "X-rays emitted from the sample",
                "Light photons from the vacuum",
                "High-energy backscattered electrons",
                "Low-energy electrons emitted from the sample's surface"
            ],
            correctAnswer: 3,
            explanation: "The secondary electron detector picks up low-energy secondary electrons emitted near the surface, providing topographic information."
        },
        {
            question: "What is the purpose of the anode in the SEM column?",
            options: [
                "To accelerate electrons down the column",
                "To provide the initial electrons",
                "To cool the electromagnetic lenses",
                "To hold the sample in place"
            ],
            correctAnswer: 0,
            explanation: "The anode applies a positive voltage relative to the electron gun, accelerating the electrons to high speeds down the column."
        }
    ];

    return { group, update, questions };
}
