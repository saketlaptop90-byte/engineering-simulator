import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const laserRedMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const laserGreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const indicatorBlueMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1
    });

    // 1. Base Housing
    const housingGeom = new THREE.BoxGeometry(10, 2, 8);
    const housingMesh = new THREE.Mesh(housingGeom, plastic);
    housingMesh.position.set(0, 1, 0);
    group.add(housingMesh);
    parts.push({
        name: "Main Housing",
        description: "Encloses and protects the delicate optics and precision mechanics.",
        material: "High-density polymer",
        function: "Structural support and light shielding",
        assemblyOrder: 1,
        connections: ["Optical Bench", "Vibration Isolators"],
        failureEffect: "Ambient light leakage causing background noise in scans.",
        cascadeFailures: ["Signal degradation", "False positive readings"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: housingMesh
    });

    // 2. Optical Bench
    const benchGeom = new THREE.BoxGeometry(8, 0.5, 6);
    const benchMesh = new THREE.Mesh(benchGeom, aluminum);
    benchMesh.position.set(0, 2.25, 0);
    group.add(benchMesh);
    parts.push({
        name: "Optical Bench",
        description: "Rigid platform for mounting lasers, mirrors, and lenses.",
        material: "Machined Aluminum",
        function: "Maintains exact optical alignment",
        assemblyOrder: 2,
        connections: ["Main Housing", "Laser Assemblies", "Detector"],
        failureEffect: "Misalignment of optical paths.",
        cascadeFailures: ["Loss of focus", "Reduced scanning resolution"],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: benchMesh
    });

    // 3. Slide Stage (Moving platform)
    const stageGeom = new THREE.BoxGeometry(3, 0.2, 5);
    const stageMesh = new THREE.Mesh(stageGeom, darkSteel);
    stageMesh.position.set(0, 2.6, 0);
    group.add(stageMesh);
    parts.push({
        name: "Scanning Stage",
        description: "Precision motorized stage that holds the DNA microarray slide.",
        material: "Steel alloy",
        function: "Moves the slide in X and Y axes under the laser beams",
        assemblyOrder: 3,
        connections: ["Optical Bench", "Stepper Motors", "Microarray Slide"],
        failureEffect: "Uneven scanning or spatial distortion.",
        cascadeFailures: ["Image warping", "Data quantification errors"],
        originalPosition: { x: 0, y: 2.6, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: stageMesh
    });

    // 4. Microarray Slide
    const slideGeom = new THREE.BoxGeometry(1, 0.05, 3);
    const slideMesh = new THREE.Mesh(slideGeom, glass);
    slideMesh.position.set(0, 2.75, 0);
    // Add glowing spots to the slide
    const spotGroup = new THREE.Group();
    for (let i = -1.2; i <= 1.2; i += 0.2) {
        for (let j = -0.4; j <= 0.4; j += 0.2) {
            const spot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 8), indicatorBlueMat.clone());
            spot.rotation.x = -Math.PI / 2;
            spot.position.set(j, 0.03, i);
            spotGroup.add(spot);
        }
    }
    slideMesh.add(spotGroup);
    group.add(slideMesh);
    parts.push({
        name: "Microarray Slide",
        description: "Glass slide containing thousands of microscopic DNA spots.",
        material: "Glass",
        function: "Holds the biological sample to be analyzed",
        assemblyOrder: 4,
        connections: ["Scanning Stage"],
        failureEffect: "Sample contamination or scratch.",
        cascadeFailures: ["Loss of data for affected genes"],
        originalPosition: { x: 0, y: 2.75, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 },
        mesh: slideMesh
    });

    // 5. Red Laser Source (Cy5)
    const redLaserGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    redLaserGeom.rotateZ(Math.PI / 2);
    const redLaserMesh = new THREE.Mesh(redLaserGeom, chrome);
    redLaserMesh.position.set(-2, 3.5, -1.5);
    group.add(redLaserMesh);
    parts.push({
        name: "HeNe Laser (633nm)",
        description: "Excites the Cy5 fluorophore dyes.",
        material: "Chrome/Glass",
        function: "Provides specific wavelength for red fluorescence excitation",
        assemblyOrder: 5,
        connections: ["Optical Bench", "Dichroic Mirrors"],
        failureEffect: "No red signal detected.",
        cascadeFailures: ["Incomplete gene expression ratio calculation"],
        originalPosition: { x: -2, y: 3.5, z: -1.5 },
        explodedPosition: { x: -6, y: 4, z: -4 },
        mesh: redLaserMesh
    });

    // 6. Green Laser Source (Cy3)
    const greenLaserGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    greenLaserGeom.rotateZ(Math.PI / 2);
    const greenLaserMesh = new THREE.Mesh(greenLaserGeom, chrome);
    greenLaserMesh.position.set(-2, 3.5, 1.5);
    group.add(greenLaserMesh);
    parts.push({
        name: "Nd:YAG Laser (532nm)",
        description: "Excites the Cy3 fluorophore dyes.",
        material: "Chrome/Glass",
        function: "Provides specific wavelength for green fluorescence excitation",
        assemblyOrder: 6,
        connections: ["Optical Bench", "Dichroic Mirrors"],
        failureEffect: "No green signal detected.",
        cascadeFailures: ["Incomplete gene expression ratio calculation"],
        originalPosition: { x: -2, y: 3.5, z: 1.5 },
        explodedPosition: { x: -6, y: 4, z: 4 },
        mesh: greenLaserMesh
    });

    // 7. PMT Detector (Photomultiplier Tube)
    const pmtGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const pmtMesh = new THREE.Mesh(pmtGeom, copper);
    pmtMesh.position.set(2, 4, 0);
    group.add(pmtMesh);
    parts.push({
        name: "Photomultiplier Tube (PMT)",
        description: "Extremely sensitive light detector.",
        material: "Copper/Glass vacuum tube",
        function: "Converts weak emitted fluorescence photons into measurable electrical signals",
        assemblyOrder: 7,
        connections: ["Optical Bench", "Data Acquisition Board"],
        failureEffect: "High dark current or signal saturation.",
        cascadeFailures: ["Poor signal-to-noise ratio", "Inaccurate quantification"],
        originalPosition: { x: 2, y: 4, z: 0 },
        explodedPosition: { x: 6, y: 6, z: 0 },
        mesh: pmtMesh
    });

    // Laser Beams (Animated parts)
    const beamRedGeom = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
    beamRedGeom.rotateZ(Math.PI / 2);
    beamRedGeom.translate(1.5, 0, 0);
    const beamRedMesh = new THREE.Mesh(beamRedGeom, laserRedMat);
    beamRedMesh.position.copy(redLaserMesh.position);
    group.add(beamRedMesh);

    const beamGreenGeom = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
    beamGreenGeom.rotateZ(Math.PI / 2);
    beamGreenGeom.translate(1.5, 0, 0);
    const beamGreenMesh = new THREE.Mesh(beamGreenGeom, laserGreenMat);
    beamGreenMesh.position.copy(greenLaserMesh.position);
    group.add(beamGreenMesh);
    
    // Objective Lens
    const lensGeom = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const lensMesh = new THREE.Mesh(lensGeom, tinted);
    lensMesh.position.set(0, 3.5, 0);
    group.add(lensMesh);
    parts.push({
        name: "Objective Lens",
        description: "Focuses laser light onto the slide and collects emitted fluorescence.",
        material: "High-grade optical glass",
        function: "Focusing and light collection",
        assemblyOrder: 8,
        connections: ["Optical Bench"],
        failureEffect: "Blurred focal spot.",
        cascadeFailures: ["Cross-talk between adjacent microarray spots"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: lensMesh
    });

    const description = "A high-precision optical instrument used to scan DNA microarrays. It utilizes specific laser wavelengths (usually 532nm and 633nm) to excite fluorescent dyes attached to target DNA sequences, allowing researchers to measure gene expression levels across thousands of genes simultaneously.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Photomultiplier Tube (PMT) in a microarray scanner?",
            options: [
                "To focus the laser onto the slide",
                "To excite the fluorophores",
                "To convert faint fluorescent light into electrical signals",
                "To move the microarray slide precisely"
            ],
            correct: 2,
            explanation: "PMTs are highly sensitive detectors that multiply the current produced by incident light by as much as 100 million times, enabling the detection of very faint fluorescence.",
            difficulty: "Medium"
        },
        {
            question: "Why does the scanner typically use two different lasers (e.g., Red and Green)?",
            options: [
                "To scan the slide twice as fast",
                "To excite two different fluorescent dyes (e.g., Cy3 and Cy5) simultaneously",
                "To provide a backup in case one laser fails",
                "To create a 3D image of the DNA"
            ],
            correct: 1,
            explanation: "Microarray experiments often use a two-color setup where a control sample is labeled with one dye (e.g., Cy3/Green) and the experimental sample with another (e.g., Cy5/Red). Both lasers are needed to read both signals to compute expression ratios.",
            difficulty: "Easy"
        },
        {
            question: "If the motorized scanning stage becomes misaligned, what is the most direct consequence?",
            options: [
                "The lasers will burn the DNA",
                "Spatial distortion in the scanned image leading to inaccurate spot quantification",
                "The PMT will saturate and break",
                "The glass slide will shatter"
            ],
            correct: 1,
            explanation: "The stage must move with micrometer precision. Misalignment causes the image pixels to not map correctly to the physical spots on the slide, ruining data quantification.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const stage = meshes.find(p => p.name === "Scanning Stage")?.mesh;
        const slide = meshes.find(p => p.name === "Microarray Slide")?.mesh;
        
        if (stage && slide) {
            const scanSpeed = time * speed * 2;
            const zMotion = Math.sin(scanSpeed * 5) * 1.5;
            const xMotion = Math.sin(scanSpeed * 0.5) * 0.5;
            
            stage.position.z = zMotion;
            stage.position.x = xMotion;
            
            slide.position.z = zMotion;
            slide.position.x = xMotion;
        }

        laserRedMat.emissiveIntensity = 2 + Math.sin(time * speed * 20) * 0.5;
        laserGreenMat.emissiveIntensity = 2 + Math.cos(time * speed * 20) * 0.5;
        
        beamRedMesh.scale.x = 1 + Math.sin(time * speed * 50) * 0.05;
        beamGreenMesh.scale.x = 1 + Math.cos(time * speed * 50) * 0.05;
        
        if (slide && slide.children.length > 0) {
            slide.children[0].children.forEach((spot) => {
                const globalZ = spot.position.z + slide.position.z;
                if (Math.abs(globalZ) < 0.2) {
                    spot.material.emissiveIntensity = 2 + Math.random();
                } else {
                    spot.material.emissiveIntensity = 0.5;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMicroarrayScanner() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
