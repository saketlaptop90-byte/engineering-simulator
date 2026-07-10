export function createPathogenMutationSequencer(THREE) {
    const group = new THREE.Group();

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.8, roughness: 0.2 });
    const chamberMat = new THREE.MeshPhysicalMaterial({ color: 0x3498db, transparent: true, opacity: 0.4, transmission: 0.9, roughness: 0.1 });
    const trayMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.5, roughness: 0.5 });
    const reagentMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.3, roughness: 0.4 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf1c40f, emissiveIntensity: 0.5 });
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x002200, emissive: 0x002200, emissiveIntensity: 1 });
    const cyclerMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.7, roughness: 0.3 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x8e44ad, metalness: 0.6, roughness: 0.2 });
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });
    const portMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1 });

    // 1. Main Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 6, 8);
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.set(0, 3, 0);
    group.add(chassis);

    // 2. Sequencing Chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(-2, 5, 1);
    group.add(chamber);

    // 3. Sample Tray
    const trayGeo = new THREE.BoxGeometry(3, 0.2, 3);
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.set(-2, 3.1, 1);
    group.add(tray);

    // 4. Reagent Dispensers
    const reagentGroup = new THREE.Group();
    const reagentGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    for (let i = 0; i < 3; i++) {
        const reagent = new THREE.Mesh(reagentGeo, reagentMat);
        reagent.position.set(-4, 6.75, 0 + i * 1.2);
        reagentGroup.add(reagent);
    }
    group.add(reagentGroup);

    // 5. Laser Scanner
    const laserGeo = new THREE.BoxGeometry(0.5, 0.5, 3);
    const laserScanner = new THREE.Mesh(laserGeo, laserMat);
    laserScanner.position.set(-2, 6.5, 1);
    group.add(laserScanner);

    // 6. Genome Display Monitor
    const monitorGeo = new THREE.BoxGeometry(4, 3, 0.5);
    const monitor = new THREE.Mesh(monitorGeo, monitorMat);
    monitor.position.set(2.5, 5.5, 3.5);
    monitor.rotation.y = -Math.PI / 6;
    
    const screenGeo = new THREE.PlaneGeometry(3.6, 2.6);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 0.26);
    monitor.add(screen);
    group.add(monitor);

    // Sequence Visualization Bands on the screen
    const bands = [];
    const bandColors = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
    for (let i = 0; i < 12; i++) {
        const bandMat = new THREE.MeshBasicMaterial({ color: bandColors[i % 4] });
        const bandGeo = new THREE.PlaneGeometry(0.4, 0.1);
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.position.set(-1.5 + Math.random() * 3, -1.2 + Math.random() * 2.4, 0.27);
        monitor.add(band);
        bands.push(band);
    }

    // 7. Thermal Cycler Module
    const cyclerGeo = new THREE.BoxGeometry(3, 2, 3);
    const cycler = new THREE.Mesh(cyclerGeo, cyclerMat);
    cycler.position.set(2.5, 4, -2);
    group.add(cycler);

    // 8. Mutation Analysis Core
    const coreGeo = new THREE.OctahedronGeometry(1.2);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 4, -2);
    group.add(core);

    // 9. Cooling Fan
    const fanGroup = new THREE.Group();
    const rotorGroup = new THREE.Group();
    const fanBaseGeo = new THREE.CylinderGeometry(1, 1, 0.2, 16);
    const fanBase = new THREE.Mesh(fanBaseGeo, fanMat);
    fanBase.rotation.x = Math.PI / 2;
    rotorGroup.add(fanBase);
    
    const bladeGeo = new THREE.BoxGeometry(0.2, 1.8, 0.05);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeo, fanMat);
        blade.rotation.z = (Math.PI / 2) * i;
        rotorGroup.add(blade);
    }
    fanGroup.add(rotorGroup);
    fanGroup.position.set(5.1, 3, 0);
    fanGroup.rotation.y = Math.PI / 2;
    group.add(fanGroup);

    // 10. Data Ports
    const portGroup = new THREE.Group();
    const portGeo = new THREE.BoxGeometry(0.4, 0.2, 0.2);
    for (let i = 0; i < 3; i++) {
        const port = new THREE.Mesh(portGeo, portMat);
        port.position.set(2 + i * 0.8, 1, 4.05);
        portGroup.add(port);
    }
    group.add(portGroup);

    // Add lighting for visual effect
    const internalLight = new THREE.PointLight(0x3498db, 1, 10);
    internalLight.position.set(-2, 5, 1);
    group.add(internalLight);

    // Animation state
    group.userData.animate = function(delta, time) {
        // Laser scanning animation (moves back and forth over the sample tray)
        laserScanner.position.z = 1 + Math.sin(time * 3) * 1.2;
        laserScanner.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * 10)) * 0.5;

        // Mutation Analysis Core pulsing
        core.rotation.y += delta * 1.5;
        core.rotation.x += delta * 1.0;
        const scale = 1 + Math.sin(time * 4) * 0.15;
        core.scale.set(scale, scale, scale);

        // Cooling Fan rotation
        rotorGroup.rotation.z += delta * 10;

        // Genome Visualization (scrolling bands)
        bands.forEach((band, i) => {
            band.position.y += delta * (1 + (i % 3) * 0.5);
            if (band.position.y > 1.2) {
                band.position.y = -1.2;
                band.position.x = -1.5 + Math.random() * 3;
            }
        });
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary purpose of DNA sequencing?",
            options: [
                "To determine the exact order of nucleotides in a DNA molecule",
                "To measure the weight of a DNA molecule",
                "To count the number of cells in a sample",
                "To synthesize artificial proteins"
            ],
            correctAnswer: 0
        },
        {
            question: "What does the thermal cycler do in the sequencing process?",
            options: [
                "Cools the machine down",
                "Amplifies segments of DNA via Polymerase Chain Reaction (PCR)",
                "Translates DNA into RNA",
                "Stores sequence data"
            ],
            correctAnswer: 1
        },
        {
            question: "What is a genetic mutation?",
            options: [
                "A type of protein",
                "A permanent alteration in the DNA sequence that makes up a gene",
                "A method of DNA extraction",
                "A sequencing error"
            ],
            correctAnswer: 1
        },
        {
            question: "In Next-Generation Sequencing (NGS), what is the function of the laser scanner?",
            options: [
                "To cut the DNA into smaller fragments",
                "To excite fluorescently labeled nucleotides for detection",
                "To heat the sample",
                "To destroy the sample after sequencing"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of the following describes a 'point mutation'?",
            options: [
                "A mutation that changes a single nucleotide base pair",
                "A mutation that deletes an entire chromosome",
                "A mutation that involves moving a segment of DNA to another chromosome",
                "A mutation that replicates the entire genome"
            ],
            correctAnswer: 0
        },
        {
            question: "Why is tracking pathogen mutations important in epidemiology?",
            options: [
                "To make the pathogens look different under a microscope",
                "To understand how diseases spread, evolve, and may evade vaccines or treatments",
                "To increase the speed of DNA sequencing",
                "To generate new names for the pathogens"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
