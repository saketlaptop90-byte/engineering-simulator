export function createNMRSpectrometer(THREE) {
    const group = new THREE.Group();

    // 1. Superconducting Magnet (Outer Shell)
    const magnetGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const magnetMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
    const magnet = new THREE.Mesh(magnetGeo, magnetMat);
    magnet.name = 'Superconducting Magnet';
    group.add(magnet);

    // 2. Liquid Nitrogen Dewar (Middle Shell)
    const n2DewarGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
    const n2DewarMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 });
    const nitrogenDewar = new THREE.Mesh(n2DewarGeo, n2DewarMat);
    nitrogenDewar.name = 'Liquid Nitrogen Dewar';
    group.add(nitrogenDewar);

    // 3. Liquid Helium Dewar (Inner Shell)
    const heDewarGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.6, 32);
    const heDewarMat = new THREE.MeshStandardMaterial({ color: 0xffddaa, transparent: true, opacity: 0.3 });
    const heliumDewar = new THREE.Mesh(heDewarGeo, heDewarMat);
    heliumDewar.name = 'Liquid Helium Dewar';
    group.add(heliumDewar);

    // 4. Shim Coils (Inside the bore)
    const shimGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16, 1, true);
    const shimMat = new THREE.MeshStandardMaterial({ color: 0xb87333, wireframe: true });
    const shimCoils = new THREE.Mesh(shimGeo, shimMat);
    shimCoils.name = 'Shim Coils';
    group.add(shimCoils);

    // 5. Probe Housing (Base holding the sample)
    const probeGeo = new THREE.CylinderGeometry(0.25, 0.25, 1, 16);
    const probeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
    const probeHousing = new THREE.Mesh(probeGeo, probeMat);
    probeHousing.position.y = -1;
    probeHousing.name = 'Probe Housing';
    group.add(probeHousing);

    // 6. Sample Tube (Center)
    const sampleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 16);
    const sampleMat = new THREE.MeshStandardMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.8 });
    const sampleTube = new THREE.Mesh(sampleGeo, sampleMat);
    sampleTube.position.y = -0.5;
    sampleTube.name = 'Sample Tube';
    group.add(sampleTube);

    // 7. RF Transmitter Coil
    const txGeo = new THREE.TorusGeometry(0.08, 0.01, 8, 24);
    const txMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const rfTransmitterCoil = new THREE.Mesh(txGeo, txMat);
    rfTransmitterCoil.rotation.x = Math.PI / 2;
    rfTransmitterCoil.position.y = -0.5;
    rfTransmitterCoil.name = 'RF Transmitter Coil';
    group.add(rfTransmitterCoil);

    // 8. Receiver Coil
    const rxGeo = new THREE.TorusGeometry(0.06, 0.01, 8, 24);
    const rxMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const receiverCoil = new THREE.Mesh(rxGeo, rxMat);
    receiverCoil.rotation.y = Math.PI / 2;
    receiverCoil.position.y = -0.5;
    receiverCoil.name = 'Receiver Coil';
    group.add(receiverCoil);

    // 9. Console/Computer
    const consoleGeo = new THREE.BoxGeometry(1, 2, 1);
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const consoleComputer = new THREE.Mesh(consoleGeo, consoleMat);
    consoleComputer.position.set(3, -0.5, 0);
    consoleComputer.name = 'Console/Computer';
    group.add(consoleComputer);

    // 10. Console Cables (connecting console to probe)
    class CustomCurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = 3 * (1 - t);
            const y = -1;
            const z = 0;
            return optionalTarget.set(x, y, z);
        }
    }
    const cableGeo = new THREE.TubeGeometry(new CustomCurve(), 20, 0.05, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const consoleCables = new THREE.Mesh(cableGeo, cableMat);
    consoleCables.name = 'Console Cables';
    group.add(consoleCables);

    // Kinematics and Animation Loop
    group.userData.update = function(t) {
        // 1. Sample spinning (spins rapidly around its vertical axis)
        sampleTube.rotation.y = t * 15;

        // 2. RF pulses emitting
        // Pulse every 2 seconds
        const pulseCycle = t % 2.0;
        if (pulseCycle < 0.1) {
            rfTransmitterCoil.material.color.setHex(0xffaa00); // Pulse active
            rfTransmitterCoil.scale.setScalar(1 + pulseCycle * 2);
        } else {
            rfTransmitterCoil.material.color.setHex(0xff0000); // Idle
            rfTransmitterCoil.scale.setScalar(1);
        }

        // 3. Magnetization vectors precessing (Receiver coil induction simulation)
        // FID signal exponentially decays after pulse
        let signalStrength = 0;
        if (pulseCycle >= 0.1) {
            signalStrength = Math.exp(-(pulseCycle - 0.1) * 3) * Math.abs(Math.sin(t * 20));
        }
        receiverCoil.material.color.setRGB(0, signalStrength, 0);
        
        // Visual representation of precession via microscopic sample wobble
        sampleTube.position.x = Math.sin(t * 50) * 0.002 * signalStrength; 
        sampleTube.position.z = Math.cos(t * 50) * 0.002 * signalStrength;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the purpose of the liquid helium dewar in an NMR spectrometer?",
            options: [
                "To keep the superconducting magnet below its critical temperature",
                "To cool the sample to absolute zero",
                "To increase the resistance of the magnet",
                "To provide a source of protons for the NMR signal"
            ],
            correctAnswer: 0
        },
        {
            question: "Why is the sample tube rotated during an NMR experiment?",
            options: [
                "To average out magnetic field inhomogeneities",
                "To create a centrifugal force for separation",
                "To prevent the sample from freezing",
                "To induce the RF pulse"
            ],
            correctAnswer: 0
        },
        {
            question: "What role does the RF transmitter coil play?",
            options: [
                "It cools the system",
                "It excites the nuclear spins, tipping the net magnetization",
                "It detects the Free Induction Decay",
                "It generates the main B0 magnetic field"
            ],
            correctAnswer: 1
        },
        {
            question: "What are the shim coils used for?",
            options: [
                "To make the main magnetic field highly homogeneous",
                "To hold the liquid nitrogen",
                "To transmit the RF signal",
                "To spin the sample tube"
            ],
            correctAnswer: 0
        },
        {
            question: "What signal does the receiver coil detect?",
            options: [
                "The Free Induction Decay (FID) of the precessing magnetization",
                "The temperature of the helium",
                "The static B0 magnetic field",
                "The rotational speed of the sample"
            ],
            correctAnswer: 0
        },
        {
            question: "Why is liquid nitrogen used in addition to liquid helium?",
            options: [
                "To act as a thermal buffer, reducing the boil-off rate of the expensive liquid helium",
                "To power the superconducting magnet",
                "To dilute the sample",
                "To create the RF pulse"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
