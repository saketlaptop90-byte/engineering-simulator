export function createLaserStrainmeter(THREE) {
    const group = new THREE.Group();

    // Materials
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x880000, metalness: 0.8, roughness: 0.2 });
    const beamSplitterMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, metalness: 0.1, roughness: 0.1 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.4 });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.3 });
    const reflectorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x446688 });
    const insulationMat = new THREE.MeshStandardMaterial({ color: 0xffddaa, roughness: 0.9, transparent: true, opacity: 0.7 });
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const dataUnitMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });

    const parts = [];

    // 1. LaserSource
    const laserSource = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 3), laserMat);
    laserSource.position.set(-5, 0, 0);
    group.add(laserSource);
    parts.push({ name: 'LaserSource', description: 'Generates a highly stable, coherent laser beam.' });

    // 2. BeamSplitter
    const beamSplitter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32), beamSplitterMat);
    beamSplitter.position.set(0, 0, 0);
    beamSplitter.rotation.y = Math.PI / 4;
    group.add(beamSplitter);
    parts.push({ name: 'BeamSplitter', description: 'Splits the laser beam into the reference arm and measurement arm.' });

    // 3. ReferenceArm
    const referenceArm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 32), armMat);
    referenceArm.position.set(0, 0, 2);
    referenceArm.rotation.x = Math.PI / 2;
    group.add(referenceArm);
    parts.push({ name: 'ReferenceArm', description: 'A fixed-length arm acting as a stable reference for the interferometer.' });

    // 4. VacuumTubeArm
    const vacuumTubeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 10, 32), tubeMat);
    vacuumTubeArm.position.set(5, 0, 0);
    vacuumTubeArm.rotation.z = Math.PI / 2;
    group.add(vacuumTubeArm);
    parts.push({ name: 'VacuumTubeArm', description: 'A long evacuated tube containing the measurement arm laser path.' });

    // 5. EndReflectors
    const endReflectors = new THREE.Group();
    const ref1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 1.2), reflectorMat);
    ref1.position.set(0, 0, 4);
    const ref2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 1.2), reflectorMat);
    ref2.position.set(10, 0, 0);
    endReflectors.add(ref1);
    endReflectors.add(ref2);
    group.add(endReflectors);
    parts.push({ name: 'EndReflectors', description: 'Mirrors that reflect the laser beams back to the beam splitter.' });

    // 6. InterferenceDetector
    const interferenceDetector = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), detectorMat);
    interferenceDetector.position.set(0, 0, -3);
    group.add(interferenceDetector);
    parts.push({ name: 'InterferenceDetector', description: 'Detects the recombined laser beams and measures the interference pattern.' });

    // 7. VacuumPump
    const vacuumPump = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), pumpMat);
    vacuumPump.position.set(5, -2, 2);
    group.add(vacuumPump);
    parts.push({ name: 'VacuumPump', description: 'Maintains a high vacuum in the measurement arm to eliminate air refraction.' });

    // 8. ThermalInsulation
    const thermalInsulation = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 9.8, 16), insulationMat);
    thermalInsulation.position.set(5, 0, 0);
    thermalInsulation.rotation.z = Math.PI / 2;
    group.add(thermalInsulation);
    parts.push({ name: 'ThermalInsulation', description: 'Protects the instrument from temperature fluctuations.' });

    // 9. AnchorPiers
    const anchorPiers = new THREE.Group();
    const pier1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), anchorMat);
    pier1.position.set(0, -2, 0);
    const pier2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), anchorMat);
    pier2.position.set(10, -2, 0);
    anchorPiers.add(pier1);
    anchorPiers.add(pier2);
    group.add(anchorPiers);
    parts.push({ name: 'AnchorPiers', description: 'Deeply anchored pillars connecting the optics to the bedrock.' });

    // 10. DataAcquisitionUnit
    const dataAcquisitionUnit = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), dataUnitMat);
    dataAcquisitionUnit.position.set(-2, 0, -4);
    group.add(dataAcquisitionUnit);
    parts.push({ name: 'DataAcquisitionUnit', description: 'Processes interference data to calculate ground strain.' });

    // --- Animation components ---
    // Laser Beams
    const sourceBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 8), laserBeamMat);
    sourceBeam.position.set(-2.5, 0, 0);
    sourceBeam.rotation.z = Math.PI / 2;
    group.add(sourceBeam);

    const refBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), laserBeamMat);
    refBeam.position.set(0, 0, 2);
    refBeam.rotation.x = Math.PI / 2;
    group.add(refBeam);

    const measureBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 10, 8), laserBeamMat);
    measureBeam.position.set(5, 0, 0);
    measureBeam.rotation.z = Math.PI / 2;
    group.add(measureBeam);

    const detectorBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 8), laserBeamMat);
    detectorBeam.position.set(0, 0, -1.5);
    detectorBeam.rotation.x = Math.PI / 2;
    group.add(detectorBeam);

    // Pattern visualization on detector
    const patternMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xffaaaa }));
    patternMesh.position.set(0, 0, -2.2);
    group.add(patternMesh);

    group.userData = {
        parts: parts,
        animation: function(time) {
            // Tectonic expansion simulation (slow, minute shifts)
            const expansion = Math.sin(time * 0.5) * 0.2;
            
            // Move the end reflector slightly
            ref2.position.set(10 + expansion, 0, 0);
            
            // Update measurement beam length to match reflector
            measureBeam.scale.y = (10 + expansion) / 10;
            measureBeam.position.set((10 + expansion) / 2, 0, 0);
            
            // Interference pattern shift (color/opacity pulsing simulating moving fringes)
            const fringeShift = (Math.sin(time * 10 + expansion * 20) + 1) / 2; // 0 to 1
            patternMesh.material.color.setRGB(1, 0.2 + fringeShift * 0.6, 0.2 + fringeShift * 0.6);
            
            // Subtle pulsing of laser beams to show activity
            const pulse = 0.8 + 0.2 * Math.sin(time * 20);
            sourceBeam.material.opacity = pulse;
            refBeam.material.opacity = pulse;
            measureBeam.material.opacity = pulse;
            detectorBeam.material.opacity = pulse;
        },
        quiz: [
            {
                question: "What is the primary function of a laser strainmeter?",
                options: [
                    "To measure temperature variations in rock",
                    "To measure minute changes in the distance between two anchored points",
                    "To generate seismic waves",
                    "To detect magnetic anomalies"
                ],
                answer: 1
            },
            {
                question: "Why is the measurement arm housed in a vacuum tube?",
                options: [
                    "To prevent the laser from scattering",
                    "To eliminate changes in the refractive index of air caused by temperature and pressure",
                    "To protect the laser from dust",
                    "To increase the speed of light"
                ],
                answer: 1
            },
            {
                question: "What phenomenon is used to measure the changes in distance?",
                options: [
                    "Diffraction",
                    "Interference",
                    "Polarization",
                    "Refraction"
                ],
                answer: 1
            },
            {
                question: "What does the beam splitter do in this setup?",
                options: [
                    "Changes the color of the laser",
                    "Increases the intensity of the laser",
                    "Divides the laser beam into a reference arm and a measurement arm",
                    "Filters out unwanted light frequencies"
                ],
                answer: 2
            },
            {
                question: "How do anchor piers contribute to the accuracy of the instrument?",
                options: [
                    "They provide electrical grounding",
                    "They connect the optical components directly to stable bedrock, avoiding surface noise",
                    "They absorb thermal expansion",
                    "They shield the detector from radiation"
                ],
                answer: 1
            },
            {
                question: "What causes the interference pattern to shift?",
                options: [
                    "A change in the power of the laser source",
                    "A relative change in the optical path length between the two arms",
                    "A change in the ambient light in the room",
                    "A failure of the vacuum pump"
                ],
                answer: 1
            }
        ]
    };

    return group;
}
