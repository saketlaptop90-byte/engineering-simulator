export function createPnJunctionDiode(THREE) {
    const group = new THREE.Group();

    // 1. P-type semiconductor
    const pTypeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const pTypeMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444, transparent: true, opacity: 0.8 }); // Reddish
    const pType = new THREE.Mesh(pTypeGeometry, pTypeMaterial);
    pType.position.set(-1.1, 0, 0);
    group.add(pType);

    // 2. N-type semiconductor
    const nTypeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const nTypeMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.8 }); // Bluish
    const nType = new THREE.Mesh(nTypeGeometry, nTypeMaterial);
    nType.position.set(1.1, 0, 0);
    group.add(nType);

    // 3. Depletion region
    const depletionGeometry = new THREE.BoxGeometry(0.2, 2, 2);
    const depletionMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.6 });
    const depletionRegion = new THREE.Mesh(depletionGeometry, depletionMaterial);
    depletionRegion.position.set(0, 0, 0);
    group.add(depletionRegion);

    // 4. Anode terminal
    const terminalGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const terminalMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const anode = new THREE.Mesh(terminalGeometry, terminalMaterial);
    anode.rotation.z = Math.PI / 2;
    anode.position.set(-3.6, 0, 0);
    group.add(anode);

    // 5. Cathode terminal
    const cathode = new THREE.Mesh(terminalGeometry, terminalMaterial);
    cathode.rotation.z = Math.PI / 2;
    cathode.position.set(3.6, 0, 0);
    group.add(cathode);

    // 6. Encapsulation casing (Glass/Plastic body)
    const casingGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4.4, 32);
    const casingMaterial = new THREE.MeshPhysicalMaterial({ color: 0x222222, transparent: true, opacity: 0.4, roughness: 0.1, transmission: 0.9, thickness: 0.5 });
    const casing = new THREE.Mesh(casingGeometry, casingMaterial);
    casing.rotation.z = Math.PI / 2;
    casing.position.set(0, 0, 0);
    group.add(casing);

    // 7. Wire bonds
    const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
    const wireMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });
    
    const anodeWire = new THREE.Mesh(wireGeometry, wireMaterial);
    anodeWire.rotation.z = Math.PI / 2;
    anodeWire.position.set(-2.25, 0, 0);
    group.add(anodeWire);

    const cathodeWire = new THREE.Mesh(wireGeometry, wireMaterial);
    cathodeWire.rotation.z = Math.PI / 2;
    cathodeWire.position.set(2.25, 0, 0);
    group.add(cathodeWire);

    // 8. Metal contacts
    const contactGeometry = new THREE.BoxGeometry(0.1, 2, 2);
    const pContact = new THREE.Mesh(contactGeometry, terminalMaterial);
    pContact.position.set(-2.15, 0, 0);
    group.add(pContact);

    const nContact = new THREE.Mesh(contactGeometry, terminalMaterial);
    nContact.position.set(2.15, 0, 0);
    group.add(nContact);

    // 9. Heat sink
    const sinkGeometry = new THREE.BoxGeometry(4.4, 0.2, 2.2);
    const sinkMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const heatSink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    heatSink.position.set(0, -1.6, 0);
    group.add(heatSink);

    // 10. Polarity marking (Cathode band)
    const bandGeometry = new THREE.CylinderGeometry(1.51, 1.51, 0.4, 32);
    const bandMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const polarityBand = new THREE.Mesh(bandGeometry, bandMaterial);
    polarityBand.rotation.z = Math.PI / 2;
    polarityBand.position.set(1.6, 0, 0);
    group.add(polarityBand);

    // Particles (Holes and Electrons)
    const particlesGroup = new THREE.Group();
    group.add(particlesGroup);
    
    const holes = [];
    const electrons = [];
    
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0xffaacc });
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xaaccff });

    for(let i=0; i<20; i++) {
        // Holes in P-type
        const hole = new THREE.Mesh(particleGeo, holeMat);
        hole.userData = {
            baseX: -1.1 + (Math.random() - 0.5) * 1.8,
            y: (Math.random() - 0.5) * 1.8,
            z: (Math.random() - 0.5) * 1.8,
            phase: Math.random() * Math.PI * 2,
            speed: 1 + Math.random()
        };
        hole.position.set(hole.userData.baseX, hole.userData.y, hole.userData.z);
        holes.push(hole);
        particlesGroup.add(hole);

        // Electrons in N-type
        const electron = new THREE.Mesh(particleGeo, electronMat);
        electron.userData = {
            baseX: 1.1 + (Math.random() - 0.5) * 1.8,
            y: (Math.random() - 0.5) * 1.8,
            z: (Math.random() - 0.5) * 1.8,
            phase: Math.random() * Math.PI * 2,
            speed: 1 + Math.random()
        };
        electron.position.set(electron.userData.baseX, electron.userData.y, electron.userData.z);
        electrons.push(electron);
        particlesGroup.add(electron);
    }

    let time = 0;

    return {
        mesh: group,
        update: function(delta) {
            time += delta;
            
            // Bias oscillation: sin(time)
            // positive = forward bias, negative = reverse bias
            const bias = Math.sin(time);
            
            // Depletion region expands under reverse bias, shrinks under forward bias
            const depletionWidth = 0.5 - 0.4 * bias; // width ranges from 0.1 (forward) to 0.9 (reverse)
            depletionRegion.scale.x = depletionWidth / 0.2; // base width is 0.2
            
            // Adjust P and N region positions to match depletion width visually
            pType.position.x = -1.0 - depletionWidth / 2;
            pType.scale.x = (2 - depletionWidth / 2) / 2;
            
            nType.position.x = 1.0 + depletionWidth / 2;
            nType.scale.x = (2 - depletionWidth / 2) / 2;

            // Animate particles
            const flowSpeed = bias > 0 ? bias * 2 : 0; // Only flow significantly in forward bias

            holes.forEach(hole => {
                hole.userData.phase += delta * hole.userData.speed;
                // Base jiggle
                let x = hole.userData.baseX + Math.sin(hole.userData.phase) * 0.1;
                
                if (bias > 0) {
                    // Move towards N-type
                    hole.userData.baseX += delta * flowSpeed;
                    if (hole.userData.baseX > 2.0) hole.userData.baseX = -2.0;
                } else {
                    // Pulled slightly away from junction
                    const targetX = -1.5 + (Math.random() - 0.5) * 0.5;
                    hole.userData.baseX += (targetX - hole.userData.baseX) * delta;
                }
                
                hole.position.set(x, hole.userData.y, hole.userData.z);
            });

            electrons.forEach(electron => {
                electron.userData.phase += delta * electron.userData.speed;
                let x = electron.userData.baseX + Math.cos(electron.userData.phase) * 0.1;
                
                if (bias > 0) {
                    // Move towards P-type
                    electron.userData.baseX -= delta * flowSpeed;
                    if (electron.userData.baseX < -2.0) electron.userData.baseX = 2.0;
                } else {
                    // Pulled slightly away from junction
                    const targetX = 1.5 + (Math.random() - 0.5) * 0.5;
                    electron.userData.baseX += (targetX - electron.userData.baseX) * delta;
                }
                
                electron.position.set(x, electron.userData.y, electron.userData.z);
            });
        },
        quiz: [
            {
                question: "What are the majority charge carriers in a P-type semiconductor?",
                options: ["Electrons", "Holes", "Neutrons", "Protons"],
                correctAnswer: 1
            },
            {
                question: "What happens to the depletion region when a PN junction is forward-biased?",
                options: ["It expands", "It remains the same", "It narrows", "It reverses polarity"],
                correctAnswer: 2
            },
            {
                question: "Which terminal is connected to the P-type material in a diode?",
                options: ["Cathode", "Gate", "Source", "Anode"],
                correctAnswer: 3
            },
            {
                question: "What is the primary function of the depletion region in thermal equilibrium?",
                options: ["To generate heat", "To act as a barrier to charge flow", "To increase conductivity", "To emit light"],
                correctAnswer: 1
            },
            {
                question: "What happens to the current in an ideal PN junction diode under reverse bias?",
                options: ["It increases exponentially", "It becomes very large", "It is virtually zero", "It oscillates"],
                correctAnswer: 2
            },
            {
                question: "Which physical process primarily creates the depletion region?",
                options: ["Drift of electrons", "Diffusion of charge carriers across the junction", "Magnetic repulsion", "Thermal expansion"],
                correctAnswer: 1
            }
        ]
    };
}
