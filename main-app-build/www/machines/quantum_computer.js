export function createQuantumComputer(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.3 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.4 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1.0, roughness: 0.2 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transmission: 0.8, opacity: 0.2, transparent: true, roughness: 0.1 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xffaaaa, metalness: 0.5, roughness: 0.5 });
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const qubitMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x0000ff, metalness: 0.5, roughness: 0.2 });

    // 1. Outer Vacuum Can
    const ovcGeo = new THREE.CylinderGeometry(2.5, 2.5, 10, 32);
    const ovc = new THREE.Mesh(ovcGeo, glassMat);
    ovc.position.set(0, 5, 0);
    ovc.name = "Outer Vacuum Can";
    model.add(ovc);
    parts.push({ name: ovc.name, description: "Provides a vacuum environment to insulate the internal components from room temperature.", object: ovc });

    // 2. 50K Plate
    const plate50KGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.2, 32);
    const plate50K = new THREE.Mesh(plate50KGeo, goldMat);
    plate50K.position.set(0, 9, 0);
    plate50K.name = "50K Plate";
    model.add(plate50K);
    parts.push({ name: plate50K.name, description: "The first cooling stage, typically kept at around 50 Kelvin.", object: plate50K });

    // 3. 4K Plate
    const plate4KGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.2, 32);
    const plate4K = new THREE.Mesh(plate4KGeo, goldMat);
    plate4K.position.set(0, 7.5, 0);
    plate4K.name = "4K Plate";
    model.add(plate4K);
    parts.push({ name: plate4K.name, description: "Cooled by liquid helium to around 4 Kelvin.", object: plate4K });

    // 4. Cryoperm Shield
    const shieldGeo = new THREE.CylinderGeometry(1.9, 1.9, 5, 32, 1, true); // open ended
    const shield = new THREE.Mesh(shieldGeo, darkMetalMat);
    shield.position.set(0, 5, 0);
    shield.name = "Cryoperm Shield";
    model.add(shield);
    parts.push({ name: shield.name, description: "Shields the delicate qubits from external magnetic fields.", object: shield });

    // 5. Still Plate
    const stillGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.2, 32);
    const still = new THREE.Mesh(stillGeo, goldMat);
    still.position.set(0, 6, 0);
    still.name = "Still Plate";
    model.add(still);
    parts.push({ name: still.name, description: "Part of the dilution refrigerator where Helium-3 is evaporated, cooling to ~800 mK.", object: still });

    // 6. Cold Plate
    const coldGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const cold = new THREE.Mesh(coldGeo, copperMat);
    cold.position.set(0, 4.5, 0);
    cold.name = "Cold Plate";
    model.add(cold);
    parts.push({ name: cold.name, description: "Further cools the system down to around 100 mK.", object: cold });

    // 7. Mixing Chamber
    const mixingGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    const mixing = new THREE.Mesh(mixingGeo, silverMat);
    mixing.position.set(0, 3, 0);
    mixing.name = "Mixing Chamber";
    model.add(mixing);
    parts.push({ name: mixing.name, description: "The coldest part of the dilution refrigerator, where He-3 and He-4 mix, reaching ~15 mK.", object: mixing });

    // 8. Coaxial Cables
    const cablesGroup = new THREE.Group();
    cablesGroup.name = "Coaxial Cables";
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*1.5, 9, Math.sin(angle)*1.5),
            new THREE.Vector3(Math.cos(angle)*1.4, 7.5, Math.sin(angle)*1.4),
            new THREE.Vector3(Math.cos(angle)*1.2, 6, Math.sin(angle)*1.2),
            new THREE.Vector3(Math.cos(angle)*1.0, 4.5, Math.sin(angle)*1.0),
            new THREE.Vector3(Math.cos(angle)*0.8, 3.15, Math.sin(angle)*0.8)
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
        const tube = new THREE.Mesh(tubeGeo, wireMat);
        cablesGroup.add(tube);
    }
    model.add(cablesGroup);
    parts.push({ name: cablesGroup.name, description: "Carry microwave signals to and from the qubits with high fidelity and low thermal noise.", object: cablesGroup });

    // 9. Read-Out Resonators
    const resonatorsGroup = new THREE.Group();
    resonatorsGroup.name = "Read-Out Resonators";
    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const resGeo = new THREE.BoxGeometry(0.3, 0.5, 0.1);
        const resMesh = new THREE.Mesh(resGeo, copperMat);
        resMesh.position.set(Math.cos(angle) * 0.8, 2.5, Math.sin(angle) * 0.8);
        resonatorsGroup.add(resMesh);
    }
    model.add(resonatorsGroup);
    parts.push({ name: resonatorsGroup.name, description: "Used to measure the state of the qubits via microwave signals.", object: resonatorsGroup });

    // 10. Qubits (Qubit Chip)
    const qubitGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const qubitChip = new THREE.Mesh(qubitGeo, qubitMat);
    qubitChip.position.set(0, 1.8, 0);
    qubitChip.name = "Qubit Chip";
    model.add(qubitChip);
    parts.push({ name: qubitChip.name, description: "Contains the quantum bits (qubits), the fundamental computing elements that can be in superpositions of 0 and 1.", object: qubitChip });

    // Animation variables
    let time = 0;
    
    // Microwave pulses for animation
    const pulses = [];
    for(let i=0; i<8; i++) {
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), pulseMat);
        pulse.userData = { pathIndex: i, progress: Math.random() };
        model.add(pulse);
        pulses.push(pulse);
    }

    const animate = (delta) => {
        time += delta;
        
        // Qubit state changing (pulsing emissive color)
        const intensity = (Math.sin(time * 3) + 1) / 2; // 0 to 1
        qubitMat.emissive.setHex(0x0000ff).lerp(new THREE.Color(0xff00ff), intensity);
        
        // Microwave pulses travelling down the cables
        pulses.forEach(pulse => {
            pulse.userData.progress += delta * 0.5;
            if(pulse.userData.progress > 1) {
                pulse.userData.progress = 0;
            }
            
            const p = pulse.userData.progress;
            const angle = (pulse.userData.pathIndex / 8) * Math.PI * 2;
            
            let yPos = 9 - p * (9 - 3.15);
            let rad = 1.5;
            if(yPos > 7.5) rad = 1.5 - ((9 - yPos) / 1.5) * 0.1;
            else if(yPos > 6) rad = 1.4 - ((7.5 - yPos) / 1.5) * 0.2;
            else if(yPos > 4.5) rad = 1.2 - ((6 - yPos) / 1.5) * 0.2;
            else rad = 1.0 - ((4.5 - yPos) / 1.35) * 0.2;
            
            pulse.position.set(Math.cos(angle) * rad, yPos, Math.sin(angle) * rad);
        });
    };

    const quiz = [
        {
            question: "What is the primary function of the dilution refrigerator in a superconducting quantum computer?",
            options: [
                "To speed up the processor clock",
                "To cool the qubits to near absolute zero to prevent decoherence",
                "To generate microwave pulses",
                "To store classical data"
            ],
            answer: 1
        },
        {
            question: "What does the Cryoperm Shield protect the qubits from?",
            options: [
                "Cosmic rays",
                "Thermal radiation",
                "External magnetic fields",
                "Acoustic vibrations"
            ],
            answer: 2
        },
        {
            question: "What physical property allows qubits to represent both 0 and 1 simultaneously?",
            options: [
                "Superposition",
                "Entanglement",
                "Interference",
                "Teleportation"
            ],
            answer: 0
        },
        {
            question: "What are coaxial cables primarily used for in this quantum computer model?",
            options: [
                "Providing structural support",
                "Pumping liquid helium",
                "Carrying microwave signals to control and measure qubits",
                "Connecting the computer to the internet"
            ],
            answer: 2
        },
        {
            question: "Which component is responsible for the final stage of cooling to around 15 millikelvin?",
            options: [
                "50K Plate",
                "Outer Vacuum Can",
                "Mixing Chamber",
                "Read-Out Resonators"
            ],
            answer: 2
        },
        {
            question: "Why do superconducting qubits need to operate at extremely low temperatures?",
            options: [
                "To increase electrical resistance",
                "To prevent them from melting",
                "To maintain their superconducting state and minimize thermal noise",
                "To make them visible to the naked eye"
            ],
            answer: 2
        }
    ];

    return {
        model,
        parts,
        animate,
        quiz
    };
}
