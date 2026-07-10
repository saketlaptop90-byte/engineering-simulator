import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "A high-resolution DNA Microarray Scanner used for gene expression profiling. It utilizes red and green lasers to excite fluorescently labeled cDNA hybridized to thousands of microscopic spots of DNA oligonucleotides on a solid glass slide surface. The emission is captured by a photomultiplier tube to measure relative gene expression levels.";

    // Custom glowing materials
    const laserRedMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8
    });
    
    const laserGreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8
    });

    const spotRedMat = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        emissive: 0xff0000,
        emissiveIntensity: 0
    });

    const spotGreenMat = new THREE.MeshStandardMaterial({
        color: 0x44ff44,
        emissive: 0x00ff00,
        emissiveIntensity: 0
    });

    const spotYellowMat = new THREE.MeshStandardMaterial({
        color: 0xffff44,
        emissive: 0xffff00,
        emissiveIntensity: 0
    });

    // 1. Main Housing Base
    const housingGeom = new THREE.BoxGeometry(20, 4, 15);
    const housing = new THREE.Mesh(housingGeom, plastic);
    housing.position.set(0, -2, 0);
    group.add(housing);
    parts.push({
        name: "Scanner Chassis",
        description: "Main housing unit providing structural stability and light isolation.",
        material: "High-density Polymer",
        function: "Encloses optical and mechanical components, preventing ambient light interference.",
        assemblyOrder: 1,
        connections: ["Scanning Stage", "Laser Assembly", "Optical System"],
        failureEffect: "Ambient light leak causes high background noise in fluorescence readings.",
        cascadeFailures: ["PMT Saturation"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 2. Scanning Stage (Moves X/Y)
    const stageGroup = new THREE.Group();
    const stageBaseGeom = new THREE.BoxGeometry(8, 0.5, 6);
    const stageBase = new THREE.Mesh(stageBaseGeom, darkSteel);
    stageGroup.add(stageBase);

    // Slide Holder
    const holderGeom = new THREE.BoxGeometry(4, 0.2, 8);
    const slideHolder = new THREE.Mesh(holderGeom, aluminum);
    slideHolder.position.set(0, 0.35, 0);
    stageGroup.add(slideHolder);

    stageGroup.position.set(0, 0.5, 0);
    group.add(stageGroup);
    parts.push({
        name: "Motorized Scanning Stage",
        description: "Precision XY stage for moving the microarray slide under the laser beam.",
        material: "Steel & Aluminum",
        function: "Moves the slide in microscopic increments for pixel-by-pixel scanning.",
        assemblyOrder: 2,
        connections: ["Scanner Chassis", "Microarray Slide"],
        failureEffect: "Image distortion or misalignment of spots.",
        cascadeFailures: ["Inaccurate Data Extraction"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: -10, y: 0.5, z: 0 }
    });

    // 3. Microarray Glass Slide
    const slideGroup = new THREE.Group();
    const slideGeom = new THREE.BoxGeometry(2.5, 0.1, 7.5);
    const glassSlide = new THREE.Mesh(slideGeom, glass);
    slideGroup.add(glassSlide);

    // Microarray Spots
    const spotGeom = new THREE.CircleGeometry(0.04, 8);
    const numRows = 40;
    const numCols = 15;
    const spots = [];

    for(let r=0; r<numRows; r++) {
        for(let c=0; c<numCols; c++) {
            let state = Math.random();
            let mat = spotRedMat;
            if (state > 0.66) mat = spotGreenMat;
            else if (state > 0.33) mat = spotYellowMat;

            const spot = new THREE.Mesh(spotGeom, mat.clone());
            spot.rotation.x = -Math.PI / 2;
            spot.position.set(
                (c - numCols/2) * 0.12 + 0.06,
                0.06,
                (r - numRows/2) * 0.12 + 0.06
            );
            slideGroup.add(spot);
            spots.push(spot);
        }
    }

    slideGroup.position.set(0, 0.5, 0);
    stageGroup.add(slideGroup); // Attach to stage
    parts.push({
        name: "Microarray Slide",
        description: "A solid surface (glass) with thousands of microscopic spots of DNA oligonucleotides.",
        material: "Silicate Glass",
        function: "Acts as the platform for target DNA hybridization and fluorescence emission.",
        assemblyOrder: 3,
        connections: ["Motorized Scanning Stage"],
        failureEffect: "Poor hybridization or high background noise.",
        cascadeFailures: ["False positive/negative gene expression data"],
        originalPosition: { x: 0, y: 1.0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 5 }
    });

    // 4. Laser Assembly
    const laserGroup = new THREE.Group();
    
    // Cy3 Laser (Green 532nm)
    const cy3Geom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const cy3Mesh = new THREE.Mesh(cy3Geom, darkSteel);
    cy3Mesh.rotation.z = Math.PI / 2;
    cy3Mesh.position.set(4, 4, -2);
    laserGroup.add(cy3Mesh);

    // Cy5 Laser (Red 633nm)
    const cy5Mesh = new THREE.Mesh(cy3Geom, darkSteel);
    cy5Mesh.rotation.z = Math.PI / 2;
    cy5Mesh.position.set(4, 4, 2);
    laserGroup.add(cy5Mesh);

    group.add(laserGroup);
    parts.push({
        name: "Excitation Lasers (Cy3 & Cy5)",
        description: "Solid-state lasers providing excitation light at specific wavelengths (typically 532nm green, 633nm red).",
        material: "Steel / Optical Elements",
        function: "Excites the fluorophores attached to the hybridized cDNA molecules.",
        assemblyOrder: 4,
        connections: ["Scanner Chassis", "Optical System"],
        failureEffect: "No excitation energy, meaning no fluorescence emitted.",
        cascadeFailures: ["Blank scan results"],
        originalPosition: { x: 4, y: 4, z: 0 },
        explodedPosition: { x: 12, y: 6, z: 0 }
    });

    // 5. Optical Mirrors and Dichroic Beamsplitter
    const mirrorGeom = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const dichroic = new THREE.Mesh(mirrorGeom, chrome);
    dichroic.rotation.x = Math.PI / 4;
    dichroic.position.set(0, 4, 0);
    group.add(dichroic);
    parts.push({
        name: "Dichroic Beamsplitter",
        description: "A highly specialized mirror that reflects certain wavelengths and transmits others.",
        material: "Optical Glass with Dielectric Coating",
        function: "Directs excitation laser light down to the slide and allows emitted fluorescence to pass up to the detector.",
        assemblyOrder: 5,
        connections: ["Excitation Lasers", "Objective Lens"],
        failureEffect: "Laser light reaches detector or emission light is lost.",
        cascadeFailures: ["Signal wash-out", "Detector damage"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: -5 }
    });

    // 6. Objective Lens
    const lensGeom = new THREE.CylinderGeometry(0.8, 0.4, 1.5, 16);
    const objective = new THREE.Mesh(lensGeom, aluminum);
    objective.position.set(0, 2.5, 0);
    group.add(objective);
    parts.push({
        name: "Microscope Objective",
        description: "High numerical aperture lens system.",
        material: "Aluminum & Optical Glass",
        function: "Focuses the laser to a fine point on the slide and collects the scattered fluorescence emission.",
        assemblyOrder: 6,
        connections: ["Dichroic Beamsplitter", "Microarray Slide"],
        failureEffect: "Blurry scan images, low resolution.",
        cascadeFailures: ["Inability to distinguish adjacent microarray spots"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 7. Photomultiplier Tube (PMT) Detector
    const pmtGeom = new THREE.CylinderGeometry(1, 1, 3, 16);
    const pmt = new THREE.Mesh(pmtGeom, darkSteel);
    pmt.position.set(0, 6.5, 0);
    group.add(pmt);
    parts.push({
        name: "Photomultiplier Tube (PMT)",
        description: "Extremely sensitive light detector.",
        material: "Vacuum Tube, Metal Housing",
        function: "Multiplies current produced by incident light by up to 100 million times, converting faint fluorescence into a measurable electronic signal.",
        assemblyOrder: 7,
        connections: ["Dichroic Beamsplitter", "Data Acquisition System"],
        failureEffect: "No signal output or saturated output.",
        cascadeFailures: ["Loss of quantitative gene expression data"],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // Laser Beams (Visual effects)
    const beamGeom = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    
    // Laser from source to dichroic
    const beamRedSource = new THREE.Mesh(beamGeom, laserRedMat);
    beamRedSource.rotation.z = Math.PI / 2;
    beamRedSource.position.set(2, 4, 2);
    group.add(beamRedSource);

    const beamGreenSource = new THREE.Mesh(beamGeom, laserGreenMat);
    beamGreenSource.rotation.z = Math.PI / 2;
    beamGreenSource.position.set(2, 4, -2);
    group.add(beamGreenSource);

    // Laser from dichroic to slide
    const beamDown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 3.5, 8), laserRedMat);
    beamDown.position.set(0, 2.25, 0);
    group.add(beamDown);

    const meshes = {
        stage: stageGroup,
        beamDown: beamDown,
        spots: spots,
        laserRedMat: laserRedMat,
        laserGreenMat: laserGreenMat
    };

    const quizQuestions = [
        {
            question: "What is the primary function of the Dichroic Beamsplitter in a DNA Microarray Scanner?",
            options: [
                "To move the slide with microscopic precision",
                "To reflect excitation laser light and transmit emitted fluorescence",
                "To amplify the faint electronic signals from the DNA",
                "To synthesize DNA oligonucleotides on the slide"
            ],
            correct: 1,
            explanation: "A dichroic beamsplitter reflects certain wavelengths (e.g., the excitation laser) down to the sample while allowing other wavelengths (e.g., the emitted fluorescence) to pass through to the detector.",
            difficulty: "Medium"
        },
        {
            question: "Why are two different colored lasers (typically Cy3/Green and Cy5/Red) used in comparative microarray analysis?",
            options: [
                "To scan the top and bottom of the slide simultaneously",
                "To excite two different fluorescent dyes representing control and experimental samples",
                "To prevent the PMT from overheating",
                "Because one laser is for scanning and the other is for erasing"
            ],
            correct: 1,
            explanation: "In a two-color microarray, the control cDNA is labeled with one dye (e.g., Cy3) and the experimental cDNA with another (e.g., Cy5). Scanning with both lasers allows calculation of the relative expression ratio of each gene.",
            difficulty: "Hard"
        },
        {
            question: "What component is responsible for converting the faint fluorescent light emitted by the microarray into a measurable electronic signal?",
            options: [
                "Photomultiplier Tube (PMT)",
                "Motorized Scanning Stage",
                "Objective Lens",
                "Excitation Laser"
            ],
            correct: 0,
            explanation: "The Photomultiplier Tube (PMT) absorbs incident photons and multiplies the resulting electron current by a cascade effect, making faint fluorescent signals measurable.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the scanning stage back and forth (Y-axis of the slide, Z-axis of 3D world)
        const scanSpeed = time * speed * 2;
        const zPos = Math.sin(scanSpeed) * 3; // Move back and forth
        const xPos = Math.cos(scanSpeed * 0.1) * 0.5; // Slight X movement for line-by-line effect

        meshes.stage.position.z = zPos;
        meshes.stage.position.x = xPos;

        // Alternate laser colors to simulate Cy3 / Cy5 scanning passes
        const scanPhase = (Math.sin(scanSpeed * 2) + 1) / 2; // 0 to 1
        
        if (scanPhase > 0.5) {
            meshes.beamDown.material = meshes.laserRedMat;
        } else {
            meshes.beamDown.material = meshes.laserGreenMat;
        }

        // Make spots glow when the laser passes over them
        const laserWorldZ = meshes.beamDown.position.z; // usually 0 relative to scanner
        const laserWorldX = meshes.beamDown.position.x;

        meshes.spots.forEach(spot => {
            // Calculate spot position in world space
            const spotWorldZ = spot.position.z + meshes.stage.position.z;
            const spotWorldX = spot.position.x + meshes.stage.position.x;
            
            // Distance from laser center
            const dist = Math.sqrt(
                Math.pow(spotWorldZ - laserWorldZ, 2) + 
                Math.pow(spotWorldX - laserWorldX, 2)
            );

            // If close to laser, increase emissive intensity
            if (dist < 0.5) {
                // Flash based on which laser is active and the spot's color
                const colorHex = spot.material.color.getHex();
                let intensity = 5;
                
                // Simplified simulation: red laser excites red/yellow spots, green laser excites green/yellow spots
                if (scanPhase > 0.5 && (colorHex === 0xff4444 || colorHex === 0xffff44)) {
                    spot.material.emissiveIntensity = intensity;
                } else if (scanPhase <= 0.5 && (colorHex === 0x44ff44 || colorHex === 0xffff44)) {
                    spot.material.emissiveIntensity = intensity;
                } else {
                    spot.material.emissiveIntensity = 0.5;
                }
            } else {
                // Fade out
                spot.material.emissiveIntensity = Math.max(0, spot.material.emissiveIntensity - 0.2);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createDNAMicroarray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
