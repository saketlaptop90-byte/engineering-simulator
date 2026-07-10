export function createGravitationalWaveInterferometer(THREE) {
    const interferometer = new THREE.Group();

    // Materials
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.0, transparent: true, opacity: 0.8 });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.3 });
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    
    // 1. Laser Source
    const laserGeo = new THREE.BoxGeometry(4, 2, 2);
    const laserSource = new THREE.Mesh(laserGeo, laserMat);
    laserSource.position.set(-10, 0, 0);
    interferometer.add(laserSource);

    // 2. Beam Splitter
    const splitterGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const beamSplitter = new THREE.Mesh(splitterGeo, mirrorMat);
    beamSplitter.position.set(0, 0, 0);
    beamSplitter.rotation.x = Math.PI / 2;
    beamSplitter.rotation.y = Math.PI / 4;
    interferometer.add(beamSplitter);

    // 3. X-arm vacuum tube
    const xTubeGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    const xArmTube = new THREE.Mesh(xTubeGeo, tubeMat);
    xArmTube.position.set(11, 0, 0);
    xArmTube.rotation.z = Math.PI / 2;
    interferometer.add(xArmTube);

    // 4. Y-arm vacuum tube
    const yTubeGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    const yArmTube = new THREE.Mesh(yTubeGeo, tubeMat);
    yArmTube.position.set(0, 0, -11);
    yArmTube.rotation.x = Math.PI / 2;
    interferometer.add(yArmTube);

    // 5. X-arm end mirror
    const endMirrorGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const xEndMirror = new THREE.Mesh(endMirrorGeo, mirrorMat);
    xEndMirror.position.set(22, 0, 0);
    xEndMirror.rotation.z = Math.PI / 2;
    interferometer.add(xEndMirror);

    // 6. Y-arm end mirror
    const yEndMirror = new THREE.Mesh(endMirrorGeo, mirrorMat);
    yEndMirror.position.set(0, 0, -22);
    yEndMirror.rotation.x = Math.PI / 2;
    interferometer.add(yEndMirror);

    // 7. Photodetector
    const detectorGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const photodetector = new THREE.Mesh(detectorGeo, detectorMat);
    photodetector.position.set(0, 0, 10);
    photodetector.rotation.x = Math.PI / 2;
    interferometer.add(photodetector);

    // 8. Passing gravitational wave ripple
    const waveGeo = new THREE.RingGeometry(15, 16, 64);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const gwRipple = new THREE.Mesh(waveGeo, waveMat);
    gwRipple.position.set(10, 0, -10);
    gwRipple.rotation.x = Math.PI / 2;
    interferometer.add(gwRipple);

    // 9. Vibration isolation suspension (above splitter)
    const suspensionGeo = new THREE.CylinderGeometry(2, 2, 4, 16);
    const suspensionMat = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const vibrationIsolation = new THREE.Mesh(suspensionGeo, suspensionMat);
    vibrationIsolation.position.set(0, 4, 0);
    interferometer.add(vibrationIsolation);

    // 10. Signal processing unit
    const spuGeo = new THREE.BoxGeometry(3, 3, 3);
    const spuMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const signalProcessingUnit = new THREE.Mesh(spuGeo, spuMat);
    signalProcessingUnit.position.set(5, -2, 10);
    interferometer.add(signalProcessingUnit);


    // Animation setup
    interferometer.userData.update = function(time) {
        // Gravitational wave ripple propagating
        const waveScale = 1 + (time % 5);
        gwRipple.scale.set(waveScale, waveScale, waveScale);
        gwRipple.material.opacity = Math.max(0, 1 - (time % 5) / 5);

        // GW effect on arms (differential change in length)
        // GW passing causes one arm to stretch, the other to compress
        const gwEffect = Math.sin(time * 2) * 0.2; // small oscillation
        xEndMirror.position.x = 22 + gwEffect;
        yEndMirror.position.z = -22 - gwEffect; 

        // Interference pattern changing at detector
        // We simulate this by changing the color/intensity of the detector
        const interference = (Math.sin(time * 2 * Math.PI) + 1) / 2; // 0 to 1
        photodetector.material.color.setHSL(0.3, 1.0, 0.2 + interference * 0.6); // Green flashing
        
        // Signal processing unit blinking lights
        if (Math.floor(time * 10) % 2 === 0) {
            signalProcessingUnit.material.emissive.setHex(0x0000ff);
        } else {
            signalProcessingUnit.material.emissive.setHex(0x000000);
        }
    };

    // Quiz Questions
    interferometer.userData.quiz = [
        {
            question: "What does an interferometer measure to detect gravitational waves?",
            options: [
                "Changes in temperature in the vacuum tubes",
                "The difference in length between its two perpendicular arms",
                "The speed of light increasing in one direction",
                "The total mass of the mirrors"
            ],
            correctAnswer: 1
        },
        {
            question: "What creates gravitational waves?",
            options: [
                "The expansion of the universe",
                "Accelerating massive objects, like colliding black holes",
                "Magnetic storms on the Sun",
                "Supernovae exploding symmetrically"
            ],
            correctAnswer: 1
        },
        {
            question: "Why does LIGO have two arms at right angles?",
            options: [
                "To detect waves coming from any direction equally",
                "Because gravitational waves stretch space in one direction and compress it in the perpendicular direction",
                "To act as a backup in case one arm breaks",
                "Because lasers can only be split at 90-degree angles"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the beam splitter in the interferometer?",
            options: [
                "To divide the laser light into two identical beams",
                "To reflect gravitational waves back into space",
                "To change the frequency of the laser",
                "To absorb extra photons to prevent overheating"
            ],
            correctAnswer: 0
        },
        {
            question: "How small of a distance change can modern gravitational wave detectors like LIGO measure?",
            options: [
                "About the width of a human hair",
                "About the size of a red blood cell",
                "About the diameter of an atom",
                "Less than one ten-thousandth the diameter of a proton"
            ],
            correctAnswer: 3
        },
        {
            question: "According to General Relativity, what are gravitational waves?",
            options: [
                "Sound waves traveling through a vacuum",
                "Ripples in the fabric of spacetime itself",
                "Electromagnetic pulses from pulsars",
                "Dark matter particles interacting with normal matter"
            ],
            correctAnswer: 1
        }
    ];

    return interferometer;
}
