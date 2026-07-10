export function createSelectiveLaserMeltingPrinter(THREE) {
    const group = new THREE.Group();

    // Materials
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const powderMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xaa0000 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x44aaff, transparent: true, opacity: 0.5 });
    const recoaterMat = new THREE.MeshStandardMaterial({ color: 0xddaa11 });

    // 1. Machine Housing
    const housingGeom = new THREE.BoxGeometry(10, 5, 6);
    const machineHousing = new THREE.Mesh(housingGeom, housingMat);
    machineHousing.position.set(0, 2.5, 0);
    machineHousing.name = "machineHousing";
    group.add(machineHousing);

    // 2. Inert Gas Chamber
    const chamberGeom = new THREE.BoxGeometry(9, 6, 5);
    const inertGasChamber = new THREE.Mesh(chamberGeom, glassMat);
    inertGasChamber.position.set(0, 8, 0);
    inertGasChamber.name = "inertGasChamber";
    group.add(inertGasChamber);

    // 3. Powder Hopper
    const hopperGeom = new THREE.BoxGeometry(2, 4, 4);
    const powderHopper = new THREE.Mesh(hopperGeom, metalMat);
    powderHopper.position.set(-2.5, 7, 0);
    powderHopper.name = "powderHopper";
    group.add(powderHopper);

    // 4. Build Platform
    const platformGeom = new THREE.BoxGeometry(3, 4, 4);
    const buildPlatform = new THREE.Mesh(platformGeom, metalMat);
    buildPlatform.position.set(0, 7, 0);
    buildPlatform.name = "buildPlatform";
    group.add(buildPlatform);

    // 5. Powder Bed
    const bedGeom = new THREE.BoxGeometry(2.8, 0.1, 3.8);
    const powderBed = new THREE.Mesh(bedGeom, powderMat);
    powderBed.position.set(0, 9.05, 0);
    powderBed.name = "powderBed";
    group.add(powderBed);

    // 6. Recoater Blade
    const bladeGeom = new THREE.BoxGeometry(0.2, 0.6, 4.2);
    const recoaterBlade = new THREE.Mesh(bladeGeom, recoaterMat);
    recoaterBlade.position.set(-3.6, 9.3, 0);
    recoaterBlade.name = "recoaterBlade";
    group.add(recoaterBlade);

    // 7. Overflow Bin
    const binGeom = new THREE.BoxGeometry(1.5, 4, 4);
    const overflowBin = new THREE.Mesh(binGeom, metalMat);
    overflowBin.position.set(2.25, 7, 0);
    overflowBin.name = "overflowBin";
    group.add(overflowBin);

    // 8. Laser Source
    const laserGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const laserSource = new THREE.Mesh(laserGeom, laserMat);
    laserSource.position.set(0, 13.5, 0);
    laserSource.name = "laserSource";
    group.add(laserSource);

    // 9. Galvo Mirror Scanner
    const scannerGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const galvoMirrorScanner = new THREE.Mesh(scannerGeom, metalMat);
    galvoMirrorScanner.position.set(0, 11.5, 0);
    galvoMirrorScanner.name = "galvoMirrorScanner";
    group.add(galvoMirrorScanner);

    // 10. F-Theta Lens
    const lensGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const fThetaLens = new THREE.Mesh(lensGeom, lensMat);
    fThetaLens.position.set(0, 10.5, 0);
    fThetaLens.name = "fThetaLens";
    group.add(fThetaLens);

    // Animation variables
    let time = 0;

    const update = (delta) => {
        time += delta;
        const cycle = time % 4; // 4 seconds cycle
        const startX = -3.6;
        const endX = 3.1;

        if (cycle < 1.5) {
            // Recoater spreading powder (0 to 1.5s)
            const t = cycle / 1.5;
            recoaterBlade.position.x = startX + t * (endX - startX);
            galvoMirrorScanner.rotation.set(0, 0, 0);
        } else if (cycle < 2.0) {
            // Recoater returns quickly (1.5 to 2.0s)
            const t = (cycle - 1.5) / 0.5;
            recoaterBlade.position.x = endX - t * (endX - startX);
            galvoMirrorScanner.rotation.set(0, 0, 0);
        } else {
            // Laser scanning (2.0 to 4.0s)
            recoaterBlade.position.x = startX;
            // Wiggle galvo mirrors rapidly to simulate scanning
            galvoMirrorScanner.rotation.x = Math.sin((cycle - 2.0) * 20) * 0.2;
            galvoMirrorScanner.rotation.z = Math.cos((cycle - 2.0) * 15) * 0.2;
        }
    };

    const questions = [
        {
            question: "What does SLM stand for in additive manufacturing?",
            options: [
                "Selective Laser Melting",
                "Solid Laser Manufacturing",
                "Selective Liquid Molding",
                "Sintered Layer Melting"
            ],
            correctAnswer: 0,
            explanation: "SLM stands for Selective Laser Melting, a 3D printing process that uses a high power-density laser to melt and fuse metallic powders together."
        },
        {
            question: "What is the primary purpose of the inert gas chamber in SLM?",
            options: [
                "To cool the laser source",
                "To prevent oxidation of the metal powder during melting",
                "To increase the melting temperature of the metal",
                "To compress the powder bed"
            ],
            correctAnswer: 1,
            explanation: "The inert gas chamber (usually filled with argon or nitrogen) prevents the heated metal powder from reacting with oxygen and forming oxides."
        },
        {
            question: "Which component is responsible for spreading a thin, even layer of metal powder across the build area?",
            options: [
                "F-theta lens",
                "Galvo mirror",
                "Build platform",
                "Recoater blade"
            ],
            correctAnswer: 3,
            explanation: "The recoater blade (or roller) spreads fresh powder from the hopper evenly over the build platform before each laser scanning pass."
        },
        {
            question: "What is the function of the F-theta lens in an SLM printer?",
            options: [
                "To split the laser into multiple beams",
                "To generate the laser beam",
                "To ensure the laser beam remains focused on a flat plane across the entire build area",
                "To magnify the size of the printed object"
            ],
            correctAnswer: 2,
            explanation: "The F-theta lens is a specialized lens that focuses the laser beam to a flat plane (the powder bed), ensuring consistent spot size and focus across the entire area."
        },
        {
            question: "How are support structures typically utilized in SLM?",
            options: [
                "They are never used in SLM",
                "To add color to the final print",
                "To prevent the powder from blowing away",
                "To anchor the part to the build plate and dissipate heat"
            ],
            correctAnswer: 3,
            explanation: "In SLM, support structures are crucial for anchoring the part to resist thermal curling and acting as a heat sink to draw heat away from the melted areas."
        },
        {
            question: "Why is SLM considered a 'powder bed fusion' technique?",
            options: [
                "It extrudes powder through a heated nozzle",
                "Thermal energy selectively fuses regions of a powder bed",
                "It binds powder using a liquid adhesive",
                "It cuts shapes from a solid block of compressed powder"
            ],
            correctAnswer: 1,
            explanation: "SLM falls under powder bed fusion because a thermal source (laser) is used to selectively melt and fuse particles in a bed of powder layer by layer."
        }
    ];

    return { group, update, questions };
}
