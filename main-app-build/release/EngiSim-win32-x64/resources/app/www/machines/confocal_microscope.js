export function createConfocalMicroscope(THREE) {
    const group = new THREE.Group();

    // 1. Laser Source
    const laserGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    laserGeo.rotateZ(Math.PI / 2);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(-8, 0, 0);
    laser.userData.partName = "Laser Source";
    group.add(laser);

    // 2. Excitation Pinhole
    const exPinholeGeo = new THREE.TorusGeometry(1, 0.3, 16, 32);
    exPinholeGeo.rotateY(Math.PI / 2);
    const pinholeMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    const exPinhole = new THREE.Mesh(exPinholeGeo, pinholeMat);
    exPinhole.position.set(-4, 0, 0);
    exPinhole.userData.partName = "Excitation Pinhole";
    group.add(exPinhole);

    // 3. Dichroic Mirror
    const dichroicGeo = new THREE.BoxGeometry(2.5, 0.1, 2.5);
    dichroicGeo.rotateZ(-Math.PI / 4);
    const dichroicMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff, transparent: true, opacity: 0.6, metalness: 0.1, roughness: 0.1, transmission: 0.9
    });
    const dichroic = new THREE.Mesh(dichroicGeo, dichroicMat);
    dichroic.position.set(0, 0, 0);
    dichroic.userData.partName = "Dichroic Mirror";
    group.add(dichroic);

    // 4. Beam Scanner
    const scannerGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    scannerGeo.rotateX(Math.PI / 2);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const scanner = new THREE.Mesh(scannerGeo, scannerMat);
    scanner.position.set(0, -4, 0);
    scanner.userData.partName = "Beam Scanner";
    group.add(scanner);

    // 5. Objective Lens
    const objGeo = new THREE.CylinderGeometry(1.5, 0.6, 3, 32);
    const objMat = new THREE.MeshPhysicalMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.5 });
    const objective = new THREE.Mesh(objGeo, objMat);
    objective.position.set(0, -7.5, 0);
    objective.userData.partName = "Objective Lens";
    group.add(objective);

    // 6. Specimen
    const specimenGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const specimenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
    const specimen = new THREE.Mesh(specimenGeo, specimenMat);
    specimen.position.set(0, -10.5, 0);
    specimen.userData.partName = "Specimen";
    group.add(specimen);

    // 7. Sample Stage
    const stageGeo = new THREE.BoxGeometry(8, 0.5, 5);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, -11.25, 0);
    stage.userData.partName = "Sample Stage";
    group.add(stage);

    // 8. Emission Filter
    const filterGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
    const filterMat = new THREE.MeshPhysicalMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });
    const filter = new THREE.Mesh(filterGeo, filterMat);
    filter.position.set(0, 4, 0);
    filter.userData.partName = "Emission Filter";
    group.add(filter);

    // 9. Emission Pinhole
    const emPinholeGeo = new THREE.TorusGeometry(1, 0.3, 16, 32);
    emPinholeGeo.rotateX(Math.PI / 2);
    const emPinhole = new THREE.Mesh(emPinholeGeo, pinholeMat);
    emPinhole.position.set(0, 8, 0);
    emPinhole.userData.partName = "Emission Pinhole";
    group.add(emPinhole);

    // 10. Photomultiplier Tube Detector
    const pmtGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const pmtMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.3 });
    const pmt = new THREE.Mesh(pmtGeo, pmtMat);
    pmt.position.set(0, 12, 0);
    pmt.userData.partName = "Photomultiplier Tube Detector";
    group.add(pmt);

    // Beams (Decorative optical paths)
    function createBeam(color, opacity, radius) {
        const geo = new THREE.CylinderGeometry(radius, radius, 1, 16);
        geo.translate(0, -0.5, 0);
        const mat = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: opacity, 
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData.isDecorative = true;
        return mesh;
    }

    const beam1 = createBeam(0x0088ff, 0.6, 0.05);
    beam1.position.set(-6, 0, 0);
    beam1.scale.set(1, 6, 1);
    beam1.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0));
    group.add(beam1);

    const beam2 = createBeam(0x0088ff, 0.6, 0.05);
    beam2.position.set(0, 0, 0);
    beam2.scale.set(1, 4, 1);
    group.add(beam2);

    const beam2_green = createBeam(0x00ff00, 0.4, 0.08);
    beam2_green.position.set(0, -4, 0);
    beam2_green.scale.set(1, 4, 1);
    beam2_green.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0));
    group.add(beam2_green);

    const beam4_green = createBeam(0x00ff00, 0.6, 0.08);
    beam4_green.position.set(0, 0, 0);
    beam4_green.scale.set(1, 10, 1);
    beam4_green.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0));
    group.add(beam4_green);

    const beam3_blue = createBeam(0x0088ff, 0.6, 0.05);
    group.add(beam3_blue);

    const beam3_green = createBeam(0x00ff00, 0.4, 0.08);
    group.add(beam3_green);

    const spotGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const spotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const spot = new THREE.Mesh(spotGeo, spotMat);
    spot.userData.isDecorative = true;
    group.add(spot);

    const vStart = new THREE.Vector3();
    const vEnd = new THREE.Vector3();
    const vDir = new THREE.Vector3();
    const vDown = new THREE.Vector3(0, -1, 0);

    function updateDynamicBeam(mesh, start, end) {
        mesh.position.copy(start);
        vDir.subVectors(end, start);
        const dist = vDir.length();
        vDir.normalize();
        mesh.scale.set(1, dist, 1);
        mesh.quaternion.setFromUnitVectors(vDown, vDir);
    }

    group.update = (time) => {
        const t = time * (time > 1000 ? 0.001 : 1); 
        
        // Oscillate scanner
        const sweepAngle = Math.sin(t * 3) * 0.15; 
        scanner.rotation.z = sweepAngle;
        
        const beamAngle = sweepAngle * 2;
        const dir = new THREE.Vector3(Math.sin(beamAngle), -Math.cos(beamAngle), 0);
        
        // Raycast logic against the specimen sphere
        const oc = new THREE.Vector3(0, 6.5, 0); 
        const bHalf = dir.dot(oc);
        const cVal = oc.dot(oc) - 0.8 * 0.8;
        const discriminant = bHalf * bHalf - cVal;
        
        vStart.set(0, -4, 0);

        if (discriminant > 0) {
            const tHit = -bHalf - Math.sqrt(discriminant);
            vEnd.copy(vStart).addScaledVector(dir, tHit);
            
            // Specimen hit (green emission active)
            specimen.material.emissiveIntensity = 0.8;
            spot.material.color.setHex(0xaaffaa);
            beam3_green.material.opacity = 0.8;
            beam2_green.material.opacity = 0.6;
            beam4_green.material.opacity = 0.6;
        } else {
            const tStage = (-11.0 - (-4)) / dir.y;
            vEnd.copy(vStart).addScaledVector(dir, tStage);
            
            // Missed specimen, hit stage (no emission)
            specimen.material.emissiveIntensity = 0.1;
            spot.material.color.setHex(0x0088ff); 
            beam3_green.material.opacity = 0.0;
            beam2_green.material.opacity = 0.0;
            beam4_green.material.opacity = 0.0;
        }
        
        updateDynamicBeam(beam3_blue, vStart, vEnd);
        updateDynamicBeam(beam3_green, vEnd, vStart); 
        
        spot.position.copy(vEnd);
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the pinhole in a confocal microscope?",
            options: ["To reject out-of-focus light", "To increase the laser power", "To magnify the image", "To change the color of the laser"],
            correctAnswer: 0
        },
        {
            question: "Which component separates the excitation light from the emission light?",
            options: ["Dichroic Mirror", "Objective Lens", "Sample Stage", "Beam Scanner"],
            correctAnswer: 0
        },
        {
            question: "What is the role of the Beam Scanner?",
            options: ["To sweep the focused laser beam across the specimen", "To detect the emitted photons", "To filter out specific wavelengths of light", "To hold the sample in place"],
            correctAnswer: 0
        },
        {
            question: "Which part detects the fluorescent light emitted by the specimen?",
            options: ["Photomultiplier Tube Detector", "Excitation Pinhole", "Laser Source", "Dichroic Mirror"],
            correctAnswer: 0
        },
        {
            question: "Why is a confocal microscope able to create 3D images?",
            options: ["It acquires multiple sharp optical sections at different depths", "It uses a 3D laser beam", "The objective lens physically moves the sample in 3D", "The detector senses depth directly from the photons"],
            correctAnswer: 0
        },
        {
            question: "What type of light is typically collected by the detector in fluorescence confocal microscopy?",
            options: ["Longer wavelength emitted light", "Shorter wavelength excitation light", "Reflected laser light", "Infrared heat emissions"],
            correctAnswer: 0
        }
    ];

    return group;
}
