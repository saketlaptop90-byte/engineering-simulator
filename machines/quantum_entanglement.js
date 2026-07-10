export function createQuantumEntanglement(THREE) {
    const group = new THREE.Group();

    // Materials
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.05 });
    const splitterMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.5, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
    const detectorMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5 });
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x228822 });

    // 1. Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 16), tableMat);
    table.position.set(0, -0.25, 0);
    table.name = "Base Table";
    group.add(table);

    // 2. Pump Laser
    const pumpLaser = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 3), laserMat);
    pumpLaser.position.set(0, 0.5, -7);
    pumpLaser.name = "Pump Laser";
    group.add(pumpLaser);

    // 3. Non-linear BBO Crystal
    const bboCrystal = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.5), crystalMat);
    bboCrystal.position.set(0, 0.5, -4);
    bboCrystal.name = "Non-linear BBO Crystal";
    group.add(bboCrystal);

    // 4. Mirror 1 (Signal Path)
    const mirror1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), mirrorMat);
    mirror1.position.set(-3, 0.5, -1);
    mirror1.rotation.x = Math.PI / 2;
    mirror1.rotation.y = Math.PI / 2; // Normal along X
    mirror1.name = "Mirror 1 (Signal)";
    group.add(mirror1);

    // 5. Mirror 2 (Idler Path)
    const mirror2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), mirrorMat);
    mirror2.position.set(3, 0.5, -1);
    mirror2.rotation.x = Math.PI / 2;
    mirror2.rotation.y = Math.PI / 2; // Normal along X
    mirror2.name = "Mirror 2 (Idler)";
    group.add(mirror2);

    // 6. Beam Splitter
    const beamSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1.5), splitterMat);
    beamSplitter.position.set(0, 0.5, 2);
    beamSplitter.rotation.y = Math.PI / 2; // Normal along X
    beamSplitter.name = "Beam Splitter";
    group.add(beamSplitter);

    // 7. Photon Detector 1
    const detector1Geo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const detector1 = new THREE.Mesh(detector1Geo, detectorMat);
    detector1.position.set(-2, 0.5, 4);
    detector1.rotation.x = Math.PI / 2;
    detector1.rotation.z = -Math.PI / 4; 
    detector1.name = "Photon Detector 1";
    group.add(detector1);

    // 8. Photon Detector 2
    const detector2Geo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const detector2 = new THREE.Mesh(detector2Geo, detectorMat);
    detector2.position.set(2, 0.5, 4);
    detector2.rotation.x = Math.PI / 2;
    detector2.rotation.z = Math.PI / 4;
    detector2.name = "Photon Detector 2";
    group.add(detector2);

    // 9. Coincidence Counter
    const coincidenceCounter = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1.5), counterMat);
    coincidenceCounter.position.set(0, 0.5, 6);
    coincidenceCounter.name = "Coincidence Counter";
    group.add(coincidenceCounter);

    // Wiring from detectors to counter
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), wireMat);
    wire1.rotation.x = Math.PI / 2;
    wire1.rotation.z = -Math.PI / 6;
    wire1.position.set(-1, -0.4, -1);
    coincidenceCounter.add(wire1);

    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), wireMat);
    wire2.rotation.x = Math.PI / 2;
    wire2.rotation.z = Math.PI / 6;
    wire2.position.set(1, -0.4, -1);
    coincidenceCounter.add(wire2);

    // 10. Photons Particle System
    const photons = new THREE.Group();
    photons.name = "Entangled Photons";
    const pumpGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const pumpPhoton = new THREE.Mesh(pumpGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    const signalPhoton = new THREE.Mesh(pumpGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    const idlerPhoton = new THREE.Mesh(pumpGeo, new THREE.MeshBasicMaterial({ color: 0x0088ff }));
    
    // Add glow effect (using larger transparent spheres)
    const glowGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const pumpGlow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.3 }));
    pumpPhoton.add(pumpGlow);
    const signalGlow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 }));
    signalPhoton.add(signalGlow);
    const idlerGlow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.3 }));
    idlerPhoton.add(idlerGlow);

    photons.add(pumpPhoton);
    photons.add(signalPhoton);
    photons.add(idlerPhoton);
    group.add(photons);

    let time = 0;
    group.userData.update = function(delta) {
        time += delta;
        let t = time % 3.0;

        pumpPhoton.visible = false;
        signalPhoton.visible = false;
        idlerPhoton.visible = false;

        if (t < 0.5) {
            pumpPhoton.visible = true;
            let p = t / 0.5;
            pumpPhoton.position.set(0, 0.5, -5.5 + p * 1.5);
        } else if (t < 1.25) {
            signalPhoton.visible = true;
            idlerPhoton.visible = true;
            let p = (t - 0.5) / 0.75;
            signalPhoton.position.set(0 - p * 3, 0.5, -4 + p * 3);
            idlerPhoton.position.set(0 + p * 3, 0.5, -4 + p * 3);
        } else if (t < 2.0) {
            signalPhoton.visible = true;
            idlerPhoton.visible = true;
            let p = (t - 1.25) / 0.75;
            signalPhoton.position.set(-3 + p * 3, 0.5, -1 + p * 3);
            idlerPhoton.position.set(3 - p * 3, 0.5, -1 + p * 3);
        } else if (t < 2.5) {
            signalPhoton.visible = true;
            idlerPhoton.visible = true;
            let p = (t - 2.0) / 0.5;
            signalPhoton.position.set(0 - p * 2, 0.5, 2 + p * 2);
            idlerPhoton.position.set(0 + p * 2, 0.5, 2 + p * 2);
        }

        if (t >= 2.45 && t < 2.65) {
            coincidenceCounter.material.color.setHex(0x55ff55);
        } else {
            coincidenceCounter.material.color.setHex(0x228822);
        }
    };

    group.userData.quiz = [
        {
            question: "What is spontaneous parametric down-conversion (SPDC)?",
            options: [
                "A process where a high-energy photon is split into two lower-energy entangled photons.",
                "A method for creating black holes in a laboratory.",
                "The process of cooling atoms to absolute zero.",
                "A technique to increase the speed of light."
            ],
            correctAnswer: 0
        },
        {
            question: "What do the terms 'signal' and 'idler' refer to in quantum optics?",
            options: [
                "The two entangled photons generated in the SPDC process.",
                "Radio frequencies used for classical communication.",
                "Components of a classical silicon computer.",
                "Types of quantum processors."
            ],
            correctAnswer: 0
        },
        {
            question: "What is a coincidence counter used for in entanglement experiments?",
            options: [
                "To detect simultaneous arrivals of entangled photon pairs at different detectors.",
                "To count the total number of photons emitted by the pump laser.",
                "To measure the speed of individual photons accurately.",
                "To cool down the optical table to minimize vibrations."
            ],
            correctAnswer: 0
        },
        {
            question: "Why is a non-linear crystal (like BBO) essential in this setup?",
            options: [
                "It enables the SPDC process by interacting non-linearly with the incoming pump laser.",
                "It absorbs all light to prevent reflection.",
                "It focuses the laser beam into a perfect microscopic point.",
                "It acts as a battery to power the photon detectors."
            ],
            correctAnswer: 0
        },
        {
            question: "What does quantum entanglement imply about the two generated photons?",
            options: [
                "Their quantum states are interconnected regardless of the distance separating them.",
                "They are glued together physically by fundamental forces.",
                "They orbit each other like planets in a solar system.",
                "They travel slower than normal photons due to increased mass."
            ],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the pump laser in this entanglement generator?",
            options: [
                "To provide the high-energy incident photons that will be down-converted into entangled pairs.",
                "To physically power the coincidence counter device.",
                "To provide illumination for the experiment.",
                "To heat the non-linear crystal to its operational temperature."
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
