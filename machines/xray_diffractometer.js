export function createXRayDiffractometer(THREE) {
    const group = new THREE.Group();

    // 1. Shielding Enclosure
    const enclosure = new THREE.Group();
    enclosure.name = "Shielding Enclosure";
    
    const enclosureMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x90a4ae, 
        transparent: true, 
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    const baseGeom = new THREE.BoxGeometry(10, 0.5, 6);
    const base = new THREE.Mesh(baseGeom, enclosureMaterial);
    base.position.set(0, -2.25, 0);
    enclosure.add(base);
    
    const backWallGeom = new THREE.BoxGeometry(10, 8, 0.5);
    const backWall = new THREE.Mesh(backWallGeom, enclosureMaterial);
    backWall.position.set(0, 1.5, -2.75);
    enclosure.add(backWall);
    
    group.add(enclosure);

    // 2. High Voltage Generator
    const hvGeom = new THREE.BoxGeometry(2, 3, 2);
    const hvMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f });
    const hvGen = new THREE.Mesh(hvGeom, hvMat);
    hvGen.position.set(-3.5, -0.5, -1);
    hvGen.name = "High Voltage Generator";
    group.add(hvGen);

    // 3. Cooling Unit
    const coolingGeom = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    const coolingMat = new THREE.MeshStandardMaterial({ color: 0x1976d2 });
    const coolingUnit = new THREE.Mesh(coolingGeom, coolingMat);
    coolingUnit.position.set(3.5, -0.75, -1);
    coolingUnit.name = "Cooling Unit";
    group.add(coolingUnit);

    // 4. Goniometer Circle
    const goniometerGeom = new THREE.TorusGeometry(2, 0.1, 16, 64);
    const goniometerMat = new THREE.MeshStandardMaterial({ color: 0x757575 });
    const goniometer = new THREE.Mesh(goniometerGeom, goniometerMat);
    goniometer.name = "Goniometer Circle";
    group.add(goniometer);

    // 5. Sample Holder
    const sampleGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const sampleMat = new THREE.MeshStandardMaterial({ color: 0xffb300 });
    const sampleHolder = new THREE.Mesh(sampleGeom, sampleMat);
    sampleHolder.rotation.x = Math.PI / 2;
    sampleHolder.name = "Sample Holder";
    group.add(sampleHolder);

    // 6. Beam Stop
    const beamStopGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
    const beamStopMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
    const beamStop = new THREE.Mesh(beamStopGeom, beamStopMat);
    beamStop.position.set(0, 0.5, 0.2); 
    beamStop.rotation.x = Math.PI / 2;
    beamStop.name = "Beam Stop";
    group.add(beamStop);

    // Arms for scanning
    const sourceArm = new THREE.Group();
    const detectorArm = new THREE.Group();
    group.add(sourceArm);
    group.add(detectorArm);

    // 7. X-ray Tube Source
    const tubeGeom = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 32);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xff8a65 });
    const xrayTube = new THREE.Mesh(tubeGeom, tubeMat);
    xrayTube.position.set(-2, 0, 0);
    xrayTube.rotation.z = Math.PI / 2;
    xrayTube.name = "X-ray Tube Source";
    sourceArm.add(xrayTube);

    // 8. Primary Collimator
    const pCollimatorGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
    const pCollimatorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const pCollimator = new THREE.Mesh(pCollimatorGeom, pCollimatorMat);
    pCollimator.position.set(-1.0, 0, 0);
    pCollimator.rotation.z = Math.PI / 2;
    pCollimator.name = "Primary Collimator";
    sourceArm.add(pCollimator);

    // 9. X-ray Detector
    const detectorGeom = new THREE.BoxGeometry(0.8, 0.6, 0.6);
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const xrayDetector = new THREE.Mesh(detectorGeom, detectorMat);
    xrayDetector.position.set(2, 0, 0);
    xrayDetector.name = "X-ray Detector";
    detectorArm.add(xrayDetector);

    // 10. Receiving Slit
    const slitGeom = new THREE.BoxGeometry(0.4, 0.3, 0.3);
    const slitMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const receivingSlit = new THREE.Mesh(slitGeom, slitMat);
    receivingSlit.position.set(1.2, 0, 0);
    receivingSlit.name = "Receiving Slit";
    detectorArm.add(receivingSlit);

    let time = 0;
    const update = (delta) => {
        time += delta;
        // theta scan from 10 to 80 degrees
        const minTheta = Math.PI * 10 / 180;
        const maxTheta = Math.PI * 80 / 180;
        
        // Oscillation between minTheta and maxTheta
        const cycle = Math.sin(time * 0.5); 
        const theta = minTheta + (cycle + 1) / 2 * (maxTheta - minTheta);

        sourceArm.rotation.z = -theta;
        detectorArm.rotation.z = theta;
    };

    const questions = [
        {
            question: "What does Bragg's law describe?",
            options: [
                "Condition for constructive interference of X-rays from crystal planes",
                "The rate of radioactive decay in a sample",
                "The scattering of light by particles in a colloid",
                "The relationship between voltage and current in an X-ray tube"
            ],
            correctAnswer: 0,
            explanation: "Bragg's law gives the angles for coherent and incoherent scattering from a crystal lattice."
        },
        {
            question: "In Bragg's law equation (nλ = 2d sinθ), what does 'd' represent?",
            options: [
                "The distance between the X-ray source and the detector",
                "The spacing between adjacent crystal planes",
                "The diameter of the crystalline sample",
                "The density of the material being analyzed"
            ],
            correctAnswer: 1,
            explanation: "'d' is the interplanar distance, which is the spacing between parallel planes of atoms in the crystal."
        },
        {
            question: "What is the primary purpose of an X-ray diffractometer?",
            options: [
                "To determine the atomic and molecular structure of a crystal",
                "To measure the chemical composition of a gas",
                "To capture high-resolution images of cellular organelles",
                "To measure the exact mass of individual atoms"
            ],
            correctAnswer: 0,
            explanation: "X-ray diffractometers are primarily used to determine the crystallographic structure of materials."
        },
        {
            question: "Why are X-rays used in crystallography instead of visible light?",
            options: [
                "X-rays have a wavelength comparable to the spacing between atoms",
                "X-rays are safer to use in laboratory environments",
                "Visible light cannot penetrate any solid materials",
                "X-rays travel faster than visible light"
            ],
            correctAnswer: 0,
            explanation: "X-rays have wavelengths in the angstrom range, which matches the interatomic spacing in crystals, allowing diffraction to occur."
        },
        {
            question: "What is the purpose of the goniometer in an X-ray diffractometer?",
            options: [
                "To precisely position the sample and detector at specific angles",
                "To generate the high-voltage electricity needed for X-rays",
                "To cool the X-ray tube during continuous operation",
                "To filter out unwanted wavelengths of X-rays"
            ],
            correctAnswer: 0,
            explanation: "A goniometer is an instrument that measures angles or allows an object to be rotated to a precise angular position."
        },
        {
            question: "What is powder X-ray diffraction primarily used for?",
            options: [
                "Phase identification of a crystalline material",
                "Determining the sequence of amino acids in a protein",
                "Measuring the electrical conductivity of semiconductors",
                "Observing living cells in real-time"
            ],
            correctAnswer: 0,
            explanation: "Powder XRD is a widely used technique for characterizing the crystallographic structure, crystallite size, and preferred orientation in polycrystalline or powdered solid samples."
        }
    ];

    return { group, update, questions };
}
