export function createOpticalFiberLink(THREE) {
    const group = new THREE.Group();

    // 1. Laser Transmitter
    const laserGeo = new THREE.BoxGeometry(3, 3, 3);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x550000 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(-14.5, 0, 0);
    laser.userData.partName = "Laser Transmitter";
    group.add(laser);

    // 2. Optical Modulator
    const modGeo = new THREE.BoxGeometry(2, 2, 2);
    const modMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const modulator = new THREE.Mesh(modGeo, modMat);
    modulator.position.set(-11.5, 0, 0);
    modulator.userData.partName = "Optical Modulator";
    group.add(modulator);

    // 3. Fiber Core
    const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 21, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x88ccff, 
        transparent: true, 
        opacity: 0.9,
        roughness: 0.1,
        transmission: 0.9
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.z = Math.PI / 2;
    core.position.set(0, 0, 0);
    core.userData.partName = "Fiber Core";
    group.add(core);

    // 4. Fiber Cladding
    const cladGeo = new THREE.CylinderGeometry(0.6, 0.6, 21, 32);
    const cladMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.2,
        roughness: 0.1
    });
    const cladding = new THREE.Mesh(cladGeo, cladMat);
    cladding.rotation.z = Math.PI / 2;
    cladding.position.set(0, 0, 0);
    cladding.userData.partName = "Fiber Cladding";
    group.add(cladding);

    // 5. Protective Buffer
    const bufGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
    const bufMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.8 });
    const buffer = new THREE.Mesh(bufGeo, bufMat);
    buffer.rotation.z = Math.PI / 2;
    buffer.position.set(-7.5, 0, 0);
    buffer.userData.partName = "Protective Buffer";
    group.add(buffer);

    // 6. Splice Connector
    const spliceGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.5, 32);
    const spliceMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const splice = new THREE.Mesh(spliceGeo, spliceMat);
    splice.rotation.z = Math.PI / 2;
    splice.position.set(-3.75, 0, 0);
    splice.userData.partName = "Splice Connector";
    group.add(splice);

    // 7. Erbium-Doped Fiber Amplifier (EDFA)
    const edfaGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const edfaMat = new THREE.MeshStandardMaterial({ color: 0x004400, metalness: 0.5, roughness: 0.4 });
    const edfa = new THREE.Mesh(edfaGeo, edfaMat);
    edfa.position.set(3, 0, 0);
    edfa.userData.partName = "Erbium-Doped Fiber Amplifier (EDFA)";
    group.add(edfa);

    // 8. Receiver Photodiode
    const rxGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
    const rxMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 });
    const rx = new THREE.Mesh(rxGeo, rxMat);
    rx.rotation.z = Math.PI / 2;
    rx.position.set(11.25, 0, 0);
    rx.userData.partName = "Receiver Photodiode";
    group.add(rx);

    // 9. Demodulator
    const demodGeo = new THREE.BoxGeometry(3, 3, 3);
    const demodMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const demod = new THREE.Mesh(demodGeo, demodMat);
    demod.position.set(13.5, 0, 0);
    demod.userData.partName = "Demodulator";
    group.add(demod);

    // 10. Light Pulses
    const pulsesGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pulsesMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const pulses = new THREE.Group();
    pulses.userData.partName = "Light Pulses";
    const numPulses = 20;
    for (let i = 0; i < numPulses; i++) {
        const p = new THREE.Mesh(pulsesGeo, pulsesMat.clone());
        p.userData.partName = "Light Pulses";
        p.userData.offset = i * (21 / numPulses);
        pulses.add(p);
    }
    group.add(pulses);

    // Animation
    group.update = (time) => {
        pulses.children.forEach((p) => {
            // move from -10.5 to 10.5 (length 21)
            let xPos = ((time * 6 + p.userData.offset) % 21) - 10.5;
            p.position.x = xPos;
            
            // Total internal reflection effect (bouncing within core)
            let bounce = Math.sin(xPos * 6); 
            p.position.y = bounce * 0.08;
            
            // Flash brighter when passing through EDFA
            if (xPos > 1.75 && xPos < 4.25) {
                p.scale.set(1.8, 1.8, 1.8);
                p.material.color.setHex(0xffffff);
            } else {
                p.scale.set(1, 1, 1);
                p.material.color.setHex(0x00ffcc);
            }
        });
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What principle allows light to stay inside the fiber core?",
            options: ["Refraction", "Diffraction", "Total Internal Reflection", "Dispersion"],
            correctAnswer: 2
        },
        {
            question: "Which component boosts the optical signal without converting it to electricity?",
            options: ["Receiver Photodiode", "Optical Modulator", "Erbium-Doped Fiber Amplifier (EDFA)", "Splice Connector"],
            correctAnswer: 2
        },
        {
            question: "What is the purpose of the fiber cladding?",
            options: ["To provide structural support", "To lower the refractive index around the core", "To convert light to electrical signals", "To filter out unwanted wavelengths"],
            correctAnswer: 1
        },
        {
            question: "What does the Optical Modulator do in a fiber link?",
            options: ["Amplifies the light", "Encodes data onto the light wave", "Receives the light", "Generates the laser light"],
            correctAnswer: 1
        },
        {
            question: "Why is a protective buffer necessary?",
            options: ["To keep the light inside", "To protect the glass fibers from physical damage and moisture", "To connect two fibers together", "To demodulate the signal"],
            correctAnswer: 1
        },
        {
            question: "What component is used to join two separate optical fibers together?",
            options: ["EDFA", "Optical Modulator", "Laser Transmitter", "Splice Connector"],
            correctAnswer: 3
        }
    ];

    return group;
}
