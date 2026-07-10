import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowWhite = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });

    const gratingMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1.0,
        roughness: 0.2,
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [100, 400]
    });

    // 1. Base Platform
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Optical Table Base",
        description: "A vibration-isolated platform holding all optical components rigidly in place.",
        material: "Dark Steel",
        function: "Provides a stable frame of reference, preventing thermal and vibrational distortions.",
        assemblyOrder: 1,
        connections: ["Collimator Mount", "Grating Mount", "Camera Mount", "Detector Mount"],
        failureEffect: "Misalignment of the entire optical path.",
        cascadeFailures: ["Loss of spectral resolution", "Signal loss at detector"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 2. Collimator Mirror
    const collimatorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const collimatorMesh = new THREE.Mesh(collimatorGeo, chrome);
    collimatorMesh.rotation.x = Math.PI / 2;
    collimatorMesh.position.set(-3, 1, 3);
    collimatorMesh.lookAt(0, 1, 0); // Point towards center
    group.add(collimatorMesh);
    parts.push({
        name: "Collimator Mirror",
        description: "A parabolic mirror that takes diverging light from the telescope slit and makes it parallel.",
        material: "Chrome / Glass",
        function: "Ensures the light hitting the grating consists of parallel rays for proper diffraction.",
        assemblyOrder: 2,
        connections: ["Optical Table Base", "Incident Beam"],
        failureEffect: "Light rays are not parallel when hitting the grating.",
        cascadeFailures: ["Blurred spectrum", "Overlapping spectral lines"],
        originalPosition: { x: -3, y: 1, z: 3 },
        explodedPosition: { x: -6, y: 2, z: 6 },
        mesh: collimatorMesh
    });

    // 3. Diffraction Grating & Mount
    const gratingMountGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const gratingMountMesh = new THREE.Mesh(gratingMountGeo, aluminum);
    gratingMountMesh.position.set(0, 0.5, 0);
    group.add(gratingMountMesh);

    const gratingGeo = new THREE.BoxGeometry(2, 2, 0.1);
    const gratingMesh = new THREE.Mesh(gratingGeo, gratingMat);
    gratingMesh.position.set(0, 1.5, 0);
    gratingMesh.rotation.y = Math.PI / 4;
    group.add(gratingMesh);
    
    parts.push({
        name: "Diffraction Grating",
        description: "An optical component with thousands of microscopic parallel grooves that disperse light into its component colors.",
        material: "Reflective Iridescent Chrome",
        function: "Splits the incident white light into a spectrum based on wavelength.",
        assemblyOrder: 3,
        connections: ["Grating Mount", "Incident Beam", "Diffracted Beams"],
        failureEffect: "Light is simply reflected or scattered instead of dispersed.",
        cascadeFailures: ["No spectrum generated", "Total instrument failure"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: gratingMesh
    });

    // 4. Camera Mirror
    const cameraMirrorGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const cameraMirrorMesh = new THREE.Mesh(cameraMirrorGeo, chrome);
    cameraMirrorMesh.rotation.x = Math.PI / 2;
    cameraMirrorMesh.position.set(3, 1, 3);
    cameraMirrorMesh.lookAt(0, 1, 0);
    group.add(cameraMirrorMesh);
    parts.push({
        name: "Camera Focusing Mirror",
        description: "A secondary mirror that collects the dispersed, parallel light rays and focuses them onto the detector.",
        material: "Chrome / Glass",
        function: "Focuses different wavelengths of light onto specific physical locations on the CCD array.",
        assemblyOrder: 4,
        connections: ["Optical Table Base", "Diffracted Beams", "Detector Array"],
        failureEffect: "Dispersed light is not focused.",
        cascadeFailures: ["Fuzzy spectral lines", "Low signal-to-noise ratio"],
        originalPosition: { x: 3, y: 1, z: 3 },
        explodedPosition: { x: 6, y: 2, z: 6 },
        mesh: cameraMirrorMesh
    });

    // 5. CCD Detector
    const ccdGeo = new THREE.BoxGeometry(1.5, 0.5, 0.1);
    const ccdMesh = new THREE.Mesh(ccdGeo, copper);
    ccdMesh.position.set(3, 1, -1);
    ccdMesh.lookAt(3, 1, 3);
    group.add(ccdMesh);
    parts.push({
        name: "CCD Detector Array",
        description: "A highly sensitive, cryogenically cooled digital sensor that records the intensity of light at each wavelength.",
        material: "Copper / Silicon",
        function: "Converts focused photons into electrical signals to generate the digital spectrum.",
        assemblyOrder: 5,
        connections: ["Optical Table Base", "Camera Focusing Mirror"],
        failureEffect: "No light is recorded.",
        cascadeFailures: ["No data output", "Thermal noise swamping signal (if cooling fails)"],
        originalPosition: { x: 3, y: 1, z: -1 },
        explodedPosition: { x: 6, y: 1, z: -4 },
        mesh: ccdMesh
    });

    // 6. Light Beams (Visual Effects)
    const beamGroup = new THREE.Group();
    
    // Slit to Collimator
    const slitToColGeo = new THREE.CylinderGeometry(0.1, 0.5, 4, 16);
    const slitToColMesh = new THREE.Mesh(slitToColGeo, glowWhite);
    slitToColMesh.position.set(-3, 1, 5);
    slitToColMesh.rotation.x = Math.PI / 2;
    beamGroup.add(slitToColMesh);

    // Collimator to Grating
    const colToGratGeo = new THREE.CylinderGeometry(0.5, 0.5, 4.24, 16);
    const colToGratMesh = new THREE.Mesh(colToGratGeo, glowWhite);
    colToGratMesh.position.set(-1.5, 1, 1.5);
    colToGratMesh.lookAt(0, 1, 0);
    colToGratMesh.rotation.x = Math.PI / 2;
    colToGratMesh.rotation.z = Math.PI / 4;
    beamGroup.add(colToGratMesh);

    // Grating to Camera Mirror (Red, Green, Blue)
    const createBeam = (mat, offsetZ) => {
        const geo = new THREE.CylinderGeometry(0.3, 0.3, 4.24, 16);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(1.5, 1, 1.5 + offsetZ);
        mesh.lookAt(3, 1, 3 + offsetZ);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = -Math.PI / 4;
        return mesh;
    };

    const redBeam1 = createBeam(glowRed, -0.2);
    const greenBeam1 = createBeam(glowGreen, 0);
    const blueBeam1 = createBeam(glowBlue, 0.2);
    beamGroup.add(redBeam1, greenBeam1, blueBeam1);

    // Camera Mirror to CCD
    const createFocusBeam = (mat, offsetX, offsetZ) => {
        const geo = new THREE.CylinderGeometry(0.3, 0.05, 4, 16);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(3 + offsetX, 1, 1);
        mesh.lookAt(3, 1, -1);
        mesh.rotation.x = Math.PI / 2;
        // slightly angle them to converge at CCD
        mesh.rotation.z = offsetX * 0.1;
        return mesh;
    };

    const redBeam2 = createFocusBeam(glowRed, -0.2, 0);
    const greenBeam2 = createFocusBeam(glowGreen, 0, 0);
    const blueBeam2 = createFocusBeam(glowBlue, 0.2, 0);
    beamGroup.add(redBeam2, greenBeam2, blueBeam2);

    group.add(beamGroup);

    parts.push({
        name: "Photon Path",
        description: "The trajectory of light through the spectrograph, splitting from white into a rainbow spectrum.",
        material: "Photons",
        function: "Carries astronomical information from the star to the detector.",
        assemblyOrder: 6,
        connections: ["All Optical Components"],
        failureEffect: "Obstruction causes signal loss.",
        cascadeFailures: ["Vignetting", "Flux calibration errors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: beamGroup
    });


    const description = "An Astronomical Spectrograph Grating instrument uses precise optics and a diffraction grating to split incoming starlight into its component wavelengths. This allows astronomers to analyze the chemical composition, temperature, density, and radial velocity of celestial objects.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Collimator Mirror?",
            options: [
                "To focus the spectrum onto the CCD",
                "To split the white light into a rainbow",
                "To make the diverging light rays parallel before they hit the grating",
                "To magnify the incoming image of the star"
            ],
            correct: 2,
            explanation: "The collimator takes the diverging light entering through the slit and makes it parallel. The grating requires parallel light to accurately diffract different wavelengths at specific angles.",
            difficulty: "Medium"
        },
        {
            question: "How does a diffraction grating disperse light?",
            options: [
                "By absorbing certain wavelengths and re-emitting others",
                "Using microscopic parallel grooves to cause interference patterns",
                "By refracting light through a prism-shaped piece of glass",
                "Using a magnetic field to separate photons by energy"
            ],
            correct: 1,
            explanation: "A diffraction grating consists of thousands of microscopic grooves per millimeter. Light waves reflecting off (or passing through) these grooves interfere with each other, creating peaks of intensity at different angles for different wavelengths.",
            difficulty: "Hard"
        },
        {
            question: "Why is the CCD Detector cryogenically cooled in professional spectrographs?",
            options: [
                "To prevent the grating from melting due to concentrated starlight",
                "To reduce thermal noise (dark current) that could drown out faint astronomical signals",
                "To increase the speed at which the data can be read out",
                "To shrink the pixels so they can achieve higher resolution"
            ],
            correct: 1,
            explanation: "Astronomical sources are often very faint. Heat generates loose electrons in the CCD (dark current), which looks like real light. Cooling the CCD to very low temperatures minimizes this thermal noise.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly rotate the grating to simulate scanning different wavelength regions
        const gratingPart = meshes.find(m => m.name === "Diffraction Grating");
        if (gratingPart && gratingPart.mesh) {
            gratingPart.mesh.rotation.y = Math.PI / 4 + Math.sin(time * speed * 0.5) * 0.05;
        }

        // Pulse the light beams to simulate photon flux
        const beamPart = meshes.find(m => m.name === "Photon Path");
        if (beamPart && beamPart.mesh) {
            beamPart.mesh.children.forEach(child => {
                if (child.material && child.material.opacity !== undefined) {
                    child.material.opacity = 0.5 + 0.3 * Math.sin(time * speed * 5 - child.position.z);
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpectrographGrating() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
