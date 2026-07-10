export function createScanningTunnelingMicroscope(THREE) {
    const group = new THREE.Group();

    // 1. Vibration Isolation Base
    const baseGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({color: 0x333333, metalness: 0.6, roughness: 0.7});
    const vibrationIsolationBase = new THREE.Mesh(baseGeo, baseMat);
    vibrationIsolationBase.position.y = 0.25;
    group.add(vibrationIsolationBase);

    // 2. Sample Stage
    const stageGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const stageMat = new THREE.MeshStandardMaterial({color: 0x666666, metalness: 0.8, roughness: 0.4});
    const sampleStage = new THREE.Mesh(stageGeo, stageMat);
    sampleStage.position.y = 0.75;
    group.add(sampleStage);

    // 3. Conductive Sample
    const sampleGeo = new THREE.PlaneGeometry(2, 2, 40, 40);
    sampleGeo.rotateX(-Math.PI / 2);
    const pos = sampleGeo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
        const vx = pos[i];
        const vz = pos[i+2];
        pos[i+1] = 0.05 * Math.sin(vx * 20) * Math.sin(vz * 20);
    }
    sampleGeo.computeVertexNormals();
    const sampleMat = new THREE.MeshStandardMaterial({color: 0xffaa00, metalness: 1.0, roughness: 0.3, side: THREE.DoubleSide});
    const conductiveSample = new THREE.Mesh(sampleGeo, sampleMat);
    conductiveSample.position.y = 1.0;
    group.add(conductiveSample);

    // 4. Scanning Tip
    const tipGeo = new THREE.ConeGeometry(0.05, 0.5, 16);
    tipGeo.rotateX(Math.PI);
    tipGeo.translate(0, -0.25, 0);
    const tipMat = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 1.0, roughness: 0.1});
    const scanningTip = new THREE.Mesh(tipGeo, tipMat);
    group.add(scanningTip);

    // 5. Piezoelectric Scanner
    const piezoGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    piezoGeo.translate(0, -1, 0);
    const piezoMat = new THREE.MeshStandardMaterial({color: 0xdcdcdc, metalness: 0.1, roughness: 0.9});
    const piezoelectricScanner = new THREE.Mesh(piezoGeo, piezoMat);
    piezoelectricScanner.position.set(0, 3.5, 0);
    group.add(piezoelectricScanner);

    // 6. Scanner Support
    const shape = new THREE.Shape();
    shape.moveTo(-3, 0);
    shape.lineTo(-3, 4);
    shape.lineTo(3, 4);
    shape.lineTo(3, 0);
    shape.lineTo(2, 0);
    shape.lineTo(2, 3);
    shape.lineTo(-2, 3);
    shape.lineTo(-2, 0);
    shape.lineTo(-3, 0);
    const extSettings = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const supportGeo = new THREE.ExtrudeGeometry(shape, extSettings);
    supportGeo.translate(0, 0, -0.5);
    const supportMat = new THREE.MeshStandardMaterial({color: 0x556677, metalness: 0.7, roughness: 0.5});
    const scannerSupport = new THREE.Mesh(supportGeo, supportMat);
    scannerSupport.position.y = 0.5;
    group.add(scannerSupport);

    // 7. Voltage Source
    const voltageGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const voltageMat = new THREE.MeshStandardMaterial({color: 0xaa3333, metalness: 0.4, roughness: 0.6});
    const voltageSource = new THREE.Mesh(voltageGeo, voltageMat);
    voltageSource.position.set(-2.5, 1.0, 2.5);
    group.add(voltageSource);

    // 8. Current Detector
    const detectorGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const detectorMat = new THREE.MeshStandardMaterial({color: 0x33aa33, metalness: 0.4, roughness: 0.6});
    const currentDetector = new THREE.Mesh(detectorGeo, detectorMat);
    currentDetector.position.set(2.5, 1.0, 2.5);
    group.add(currentDetector);

    // 9. Feedback Electronics
    const feedbackGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const feedbackMat = new THREE.MeshStandardMaterial({color: 0x3333aa, metalness: 0.4, roughness: 0.6});
    const feedbackElectronics = new THREE.Mesh(feedbackGeo, feedbackMat);
    feedbackElectronics.position.set(0, 1.25, -2.5);
    group.add(feedbackElectronics);

    // 10. Vacuum Chamber
    const chamberGeo = new THREE.CylinderGeometry(4.2, 4.2, 5.5, 32);
    const chamberMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaff,
        transparent: true,
        opacity: 0.25,
        transmission: 0.9,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    const vacuumChamber = new THREE.Mesh(chamberGeo, chamberMat);
    vacuumChamber.position.y = 3.25;
    group.add(vacuumChamber);

    // Animation
    group.userData.update = function(delta, time) {
        const scanSpeedX = 2.0; 
        let phaseX = (time * scanSpeedX) % 4; 
        let x = phaseX < 2 ? -1 + phaseX : 3 - phaseX; 
        x *= 0.8;

        const scanSpeedZ = 0.1;
        let phaseZ = (time * scanSpeedZ) % 4;
        let z = phaseZ < 2 ? -1 + phaseZ : 3 - phaseZ;
        z *= 0.8;

        const topography = 0.05 * Math.sin(x * 20) * Math.sin(z * 20);

        const topPos = new THREE.Vector3(0, 3.5, 0);
        const bottomY = 1.5 + topography + 0.02; 
        const bottomPos = new THREE.Vector3(x, bottomY, z);

        const dir = new THREE.Vector3().subVectors(bottomPos, topPos);
        const length = dir.length();
        dir.normalize();

        const up = new THREE.Vector3(0, -1, 0);
        const axis = new THREE.Vector3().crossVectors(up, dir);
        if (axis.lengthSq() > 0.000001) {
            axis.normalize();
            const angle = up.angleTo(dir);
            piezoelectricScanner.quaternion.setFromAxisAngle(axis, angle);
        } else {
            piezoelectricScanner.quaternion.identity();
        }
        piezoelectricScanner.scale.y = length / 2;

        scanningTip.position.copy(bottomPos);
        scanningTip.quaternion.copy(piezoelectricScanner.quaternion); 
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What does STM stand for?",
            options: ["Scanning Thermal Microscope", "Scanning Tunneling Microscope", "Standard Transmission Microscope", "Static Tunneling Machine"],
            correct: 1
        },
        {
            question: "What fundamental physics phenomenon does an STM rely on to image atomic surfaces?",
            options: ["Quantum tunneling", "Electromagnetic induction", "Thermionic emission", "Optical diffraction"],
            correct: 0
        },
        {
            question: "What is the primary role of the piezoelectric scanner in an STM?",
            options: ["To amplify the tunneling current", "To provide the vacuum environment", "To move the tip with sub-angstrom precision in 3D", "To generate the bias voltage"],
            correct: 2
        },
        {
            question: "Why is an ultra-high vacuum chamber often used for STM operation?",
            options: ["To prevent the tip from oxidizing", "To keep the sample surface atomically clean and free of adsorbates", "To increase the tunneling current", "To cool the system to absolute zero"],
            correct: 1
        },
        {
            question: "What is the function of the feedback electronics during constant-current STM scanning?",
            options: ["It maintains a constant distance by adjusting the tip height to keep the tunneling current steady.", "It constantly changes the bias voltage to match the surface topography.", "It regulates the temperature of the sample.", "It vibrates the sample to create a resonance image."],
            correct: 0
        },
        {
            question: "What is a major limitation regarding the types of samples an STM can image?",
            options: ["They must be perfectly flat.", "They must be highly magnetic.", "They must be transparent to visible light.", "They must be conductive or semi-conductive."],
            correct: 3
        }
    ];

    return group;
}
