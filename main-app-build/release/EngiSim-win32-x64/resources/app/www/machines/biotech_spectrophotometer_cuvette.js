import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech/Neon Materials
    const glowWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const glowRainbow = new THREE.MeshBasicMaterial({ color: 0x88ffff, transparent: true, opacity: 0.6 }); 
    const glowBlue = new THREE.MeshBasicMaterial({ color: 0x0055ff, transparent: true, opacity: 0.8 });
    const attenuatedBlue = new THREE.MeshBasicMaterial({ color: 0x002288, transparent: true, opacity: 0.4 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x051105, emissive: 0x00ff44, emissiveIntensity: 0.8 });
    const liquidMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, transmission: 0.95, opacity: 1, roughness: 0.1, ior: 1.33 });

    const meshes = {};

    function addPart(name, mesh, info) {
        mesh.name = name;
        group.add(mesh);
        parts.push({ name, ...info });
        meshes[name] = mesh;
    }

    // 1. Casing (Base)
    const baseGeo = new THREE.BoxGeometry(11, 0.6, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.3, 0);
    addPart('base', baseMesh, {
        description: 'Main chassis providing optical bench stability and alignment.',
        material: 'Dark Steel, Aluminum',
        function: 'Structural support and vibration damping for high-precision optics.',
        assemblyOrder: 1,
        connections: ['lightSource', 'detector', 'displayUnit'],
        failureEffect: 'Misalignment of optical path.',
        cascadeFailures: ['Signal loss', 'Total measurement failure'],
        originalPosition: { x: 0, y: -0.3, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Light Source
    const lampGroup = new THREE.Group();
    const lampBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16), glass);
    const lampFilament = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8), glowWhite);
    lampGroup.add(lampBulb);
    lampGroup.add(lampFilament);
    lampGroup.position.set(-4.5, 1.2, 0);
    addPart('lightSource', lampGroup, {
        description: 'Broadband Tungsten-Halogen or Deuterium light source.',
        material: 'Glass, Tungsten, Noble Gases',
        function: 'Provides intense, full-spectrum polychromatic illumination.',
        assemblyOrder: 2,
        connections: ['base', 'collimator'],
        failureEffect: 'Zero light emission.',
        cascadeFailures: ['Detector outputs zero', 'Software error reading'],
        originalPosition: { x: -4.5, y: 1.2, z: 0 },
        explodedPosition: { x: -7, y: 3, z: -2 }
    });

    // 3. Collimator
    const lensGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.25, 32);
    const lensMesh = new THREE.Mesh(lensGeo, glass);
    lensMesh.rotation.z = Math.PI / 2;
    lensMesh.position.set(-2.8, 1.2, 0);
    addPart('collimator', lensMesh, {
        description: 'High-precision optical collimating lens.',
        material: 'Optical Glass',
        function: 'Focuses divergent rays from the lamp into a parallel light beam.',
        assemblyOrder: 3,
        connections: ['lightSource', 'monochromator'],
        failureEffect: 'Light beam scatters.',
        cascadeFailures: ['Low signal-to-noise ratio', 'Inaccurate readings'],
        originalPosition: { x: -2.8, y: 1.2, z: 0 },
        explodedPosition: { x: -4, y: 4, z: 2 }
    });

    // 4. Monochromator (Prism)
    const prismGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 3, 1);
    const prismMesh = new THREE.Mesh(prismGeo, tinted);
    prismMesh.position.set(-1.2, 1.2, 0);
    addPart('monochromator', prismMesh, {
        description: 'Diffraction grating or prism.',
        material: 'Optical Glass, Chrome coating',
        function: 'Disperses polychromatic white light into a rainbow spectrum.',
        assemblyOrder: 4,
        connections: ['collimator', 'slit'],
        failureEffect: 'Fails to separate wavelengths.',
        cascadeFailures: ['Sample irradiated with full spectrum', 'Cannot isolate target molecule'],
        originalPosition: { x: -1.2, y: 1.2, z: 0 },
        explodedPosition: { x: -1.2, y: 6, z: 0 }
    });

    // 5. Exit Slit
    const slitGroup = new THREE.Group();
    const slitTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 1.6), darkSteel);
    slitTop.position.set(0, 0.55, 0);
    const slitBot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 1.6), darkSteel);
    slitBot.position.set(0, -0.55, 0);
    slitGroup.add(slitTop);
    slitGroup.add(slitBot);
    slitGroup.position.set(0.5, 1.2, 0);
    addPart('slit', slitGroup, {
        description: 'Adjustable exit slit.',
        material: 'Machined Steel',
        function: 'Physically blocks unwanted wavelengths, isolating a narrow monochromatic band.',
        assemblyOrder: 5,
        connections: ['monochromator', 'cuvetteAssembly'],
        failureEffect: 'Bandwidth too wide or completely blocked.',
        cascadeFailures: ['Poor resolution', 'Loss of specificity in measurement'],
        originalPosition: { x: 0.5, y: 1.2, z: 0 },
        explodedPosition: { x: 0.5, y: 5, z: -3 }
    });

    // 6. Cuvette Assembly
    const holderGroup = new THREE.Group();
    const holderMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.4), plastic);
    holderMesh.position.set(0, -0.6, 0);
    
    const cuvetteMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.0, 0.8), glass);
    const liquidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), liquidMat);
    liquidMesh.position.set(0, -0.25, 0);
    cuvetteMesh.add(liquidMesh);
    cuvetteMesh.position.set(0, 0.4, 0);
    
    holderGroup.add(holderMesh);
    holderGroup.add(cuvetteMesh);
    holderGroup.position.set(2.2, 1.2, 0);
    addPart('cuvetteAssembly', holderGroup, {
        description: 'Sample compartment and Quartz cuvette.',
        material: 'Polymer, Quartz Glass',
        function: 'Holds the biological sample solution precisely in the optical path.',
        assemblyOrder: 6,
        connections: ['slit', 'detector'],
        failureEffect: 'Sample misalignment, cuvette scratches, or fingerprints.',
        cascadeFailures: ['False high absorbance readings', 'Light scattering'],
        originalPosition: { x: 2.2, y: 1.2, z: 0 },
        explodedPosition: { x: 2.2, y: 4, z: 3 }
    });

    // 7. Detector
    const detectorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 1.2), chrome);
    detectorMesh.position.set(4.5, 1.2, 0);
    addPart('detector', detectorMesh, {
        description: 'Photodiode array or Photomultiplier Tube (PMT).',
        material: 'Silicon, Chrome',
        function: 'Converts unabsorbed transmitted photons into a proportional electrical current.',
        assemblyOrder: 7,
        connections: ['cuvetteAssembly', 'displayUnit'],
        failureEffect: 'Fails to detect light.',
        cascadeFailures: ['Infinite OD reading', 'System error'],
        originalPosition: { x: 4.5, y: 1.2, z: 0 },
        explodedPosition: { x: 5, y: 4, z: -2 }
    });

    // 8. Display/Processor Unit
    const displayGroup = new THREE.Group();
    const monitorGeo = new THREE.BoxGeometry(3.5, 2.2, 0.4);
    const monitorMesh = new THREE.Mesh(monitorGeo, plastic);
    const screenGeo = new THREE.PlaneGeometry(3.1, 1.8);
    const screenMesh = new THREE.Mesh(screenGeo, screenGlow);
    screenMesh.position.set(0, 0, 0.21);
    displayGroup.add(monitorMesh);
    displayGroup.add(screenMesh);
    displayGroup.position.set(1.5, 3.5, -1.5);
    displayGroup.rotation.x = -Math.PI / 6;
    addPart('displayUnit', displayGroup, {
        description: 'Microprocessor and digital readout screen.',
        material: 'Polymer, Silicon Electronics',
        function: 'Computes Optical Density (OD = -log10(I/I0)) and displays quantitative results.',
        assemblyOrder: 8,
        connections: ['detector', 'base'],
        failureEffect: 'Screen burnout or processor logic fault.',
        cascadeFailures: ['No data output to user'],
        originalPosition: { x: 1.5, y: 3.5, z: -1.5 },
        explodedPosition: { x: 1.5, y: 7, z: -4 }
    });

    // Visually Stunning Neon Light Beams
    // Beam 1: White light from source to collimator
    const beam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.7), glowWhite);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-3.65, 1.2, 0);
    group.add(beam1);

    // Beam 2: Collimated light hitting the prism
    const beam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.4, 1.6), glowRainbow);
    beam2.rotation.z = Math.PI / 2;
    beam2.position.set(-2.0, 1.2, 0);
    group.add(beam2);

    // Beam 3: Specific isolated wavelength (Blue) passing through slit to cuvette
    const beam3 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.7), glowBlue);
    beam3.rotation.z = Math.PI / 2;
    beam3.position.set(1.35, 1.2, 0);
    group.add(beam3);

    // Beam 4: Attenuated light hitting the detector
    const beam4 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.3), attenuatedBlue);
    beam4.rotation.z = Math.PI / 2;
    beam4.position.set(3.35, 1.2, 0);
    group.add(beam4);

    meshes.monochromatorObj = prismMesh;
    meshes.beamRainbow = beam2;
    meshes.beamBlue = beam3;
    meshes.beamAttenuated = beam4;
    meshes.liquid = liquidMesh;

    const description = "The Spectrophotometer is a high-tech analytical instrument that measures light absorption to quantify molecular concentration in biological samples. It features a precision monochromator to isolate specific wavelengths and a sensitive PMT detector to compute Optical Density (OD) via the Beer-Lambert Law.";

    const quizQuestions = [
        {
            question: "What is the primary function of the monochromator in a spectrophotometer?",
            options: [
                "To hold the biological sample securely",
                "To amplify the electrical signal from the detector",
                "To split polychromatic light and isolate a specific wavelength",
                "To calculate the Optical Density (OD) automatically"
            ],
            correct: 2,
            explanation: "The monochromator disperses white light so that the exit slit can isolate a narrow, monochromatic wavelength band tailored to the sample's absorption spectrum.",
            difficulty: "Medium"
        },
        {
            question: "According to the Beer-Lambert Law, how is Optical Density (Absorbance) related to sample concentration?",
            options: [
                "They are inversely proportional",
                "They are directly proportional",
                "Absorbance increases exponentially as concentration rises",
                "There is no mathematical relationship"
            ],
            correct: 1,
            explanation: "The Beer-Lambert Law states that Absorbance is directly proportional to both the concentration of the absorbing species and the path length of the cuvette (A = εlc).",
            difficulty: "Hard"
        },
        {
            question: "Why must cuvettes used in UV spectrophotometry be made of pure quartz rather than standard glass or plastic?",
            options: [
                "Quartz is highly reflective, boosting the signal",
                "Standard glass and plastic absorb UV light, heavily skewing results",
                "Quartz prevents biological samples from denaturing",
                "Quartz converts UV light into visible light for the detector"
            ],
            correct: 1,
            explanation: "Standard glass and many plastics inherently absorb ultraviolet light. Quartz is completely transparent in the UV range, ensuring the measured absorbance comes only from the sample.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the light intensity (I) compared to the incident light (I0) after passing through an absorbing sample?",
            options: [
                "I is greater than I0",
                "I is equal to I0",
                "I is less than I0",
                "I fluctuates randomly"
            ],
            correct: 2,
            explanation: "As the sample absorbs photons, the transmitted light intensity (I) that reaches the detector is always less than the initial incident light (I0).",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // High-tech sci-fi rotation for the monochromator prism
        if (activeMeshes.monochromatorObj) {
            activeMeshes.monochromatorObj.rotation.y = time * speed * 0.8;
            activeMeshes.monochromatorObj.rotation.x = Math.sin(time * speed) * 0.1;
        }
        
        // Pulsate the glowing neon light beams and sample liquid
        const pulse = (Math.sin(time * speed * 4) + 1) / 2; // oscillates 0 to 1
        if (activeMeshes.beamRainbow) {
            activeMeshes.beamRainbow.material.opacity = 0.3 + pulse * 0.4;
        }
        if (activeMeshes.beamBlue) {
            activeMeshes.beamBlue.material.opacity = 0.5 + pulse * 0.4;
        }
        if (activeMeshes.beamAttenuated) {
            activeMeshes.beamAttenuated.material.opacity = 0.2 + pulse * 0.3;
        }
        if (activeMeshes.liquid) {
            // Subtle glowing oscillation in the sample
            activeMeshes.liquid.material.opacity = 0.8 + pulse * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpectrophotometerCuvette() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
