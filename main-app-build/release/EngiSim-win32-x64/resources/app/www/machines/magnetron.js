export function createMagnetron(THREE) {
    const group = new THREE.Group();

    // Materials
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });
    const magnetMatN = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.6, roughness: 0.4 });
    const magnetMatS = new THREE.MeshStandardMaterial({ color: 0x0000cc, metalness: 0.6, roughness: 0.4 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xcc2200, metalness: 0.5, roughness: 0.8 });
    const filamentMat = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffddaa, emissiveIntensity: 2 });
    const rfBoxMat = new THREE.MeshStandardMaterial({ color: 0x556655, metalness: 0.7, roughness: 0.6 });

    // 1. Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    group.add(cathode);

    // 2. Filament (inside cathode, protruding slightly)
    const filamentGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.4, 16);
    const filament = new THREE.Mesh(filamentGeo, filamentMat);
    group.add(filament);

    // 3. Anode block with resonant cavities (represented by an outer cylinder and 8 vanes)
    const anodeGroup = new THREE.Group();
    
    // Outer anode shell
    const outerAnodeGeo = new THREE.CylinderGeometry(3.5, 3.2, 4, 64);
    const outerAnode = new THREE.Mesh(outerAnodeGeo, copperMat);
    anodeGroup.add(outerAnode);

    // 8 Vanes forming cavities
    const numVanes = 8;
    for (let i = 0; i < numVanes; i++) {
        const vaneGeo = new THREE.BoxGeometry(1.7, 4, 0.4);
        const vane = new THREE.Mesh(vaneGeo, copperMat);
        // Position vane: center of vane is at r = 2.35
        const angle = (i / numVanes) * Math.PI * 2;
        vane.position.set(Math.cos(angle) * 2.35, 0, Math.sin(angle) * 2.35);
        vane.rotation.y = -angle;
        anodeGroup.add(vane);
    }
    group.add(anodeGroup);

    // 4. Permanent magnets
    const magnetGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.8, 64);
    const topMagnet = new THREE.Mesh(magnetGeo, magnetMatN);
    topMagnet.position.y = 2.8;
    group.add(topMagnet);
    
    const bottomMagnet = new THREE.Mesh(magnetGeo, magnetMatS);
    bottomMagnet.position.y = -2.8;
    group.add(bottomMagnet);

    // 5. Cooling fins
    const numFins = 6;
    for(let i=0; i<numFins; i++) {
        const finGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.05, 64);
        const fin = new THREE.Mesh(finGeo, copperMat);
        fin.position.y = -1.5 + i * 0.6;
        group.add(fin);
    }

    // 6. Vacuum envelope (glass tube between cathode and anode)
    const glassGeo = new THREE.CylinderGeometry(1.3, 1.3, 4.2, 32);
    const glassTube = new THREE.Mesh(glassGeo, glassMat);
    group.add(glassTube);

    // 7. Strap rings (inner and outer rings connecting vanes)
    const strapGeo1 = new THREE.TorusGeometry(1.7, 0.08, 16, 64);
    const strap1 = new THREE.Mesh(strapGeo1, copperMat);
    strap1.rotation.x = Math.PI / 2;
    strap1.position.y = 1.9;
    group.add(strap1);

    const strapGeo2 = new THREE.TorusGeometry(2.0, 0.08, 16, 64);
    const strap2 = new THREE.Mesh(strapGeo2, copperMat);
    strap2.rotation.x = Math.PI / 2;
    strap2.position.y = 2.0;
    group.add(strap2);

    // 8. Antenna / output probe
    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const antenna = new THREE.Mesh(antennaGeo, copperMat);
    // Tapping into one of the cavities
    const tapAngle = Math.PI / 8; // between vane 0 and 1
    antenna.position.set(Math.cos(tapAngle) * 3.0, 1.5, Math.sin(tapAngle) * 3.0);
    antenna.rotation.x = Math.PI / 2;
    group.add(antenna);

    // 9. RF filter box
    const rfBoxGeo = new THREE.BoxGeometry(2, 1.5, 1.5);
    const rfBox = new THREE.Mesh(rfBoxGeo, rfBoxMat);
    rfBox.position.set(4.5, 1.5, 1.0);
    group.add(rfBox);

    // 10. Mounting bracket
    const bracketGeo = new THREE.BoxGeometry(6, 0.4, 6);
    const bracket = new THREE.Mesh(bracketGeo, steelMat);
    bracket.position.y = -3.4;
    group.add(bracket);

    // --- ANIMATION: Electrons forming spokes ---
    const numElectrons = 600;
    const electronGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
    const electronMesh = new THREE.InstancedMesh(electronGeo, electronMat, numElectrons);
    
    const electrons = [];
    for(let i=0; i<numElectrons; i++) {
        electrons.push({
            age: Math.random(), // 0 to 1
            spoke: Math.floor(Math.random() * 4), // 4 spokes for 8 cavities (pi mode)
            offset: (Math.random() - 0.5) * 1.5, // angular spread
            yOffset: (Math.random() - 0.5) * 3.8
        });
    }
    group.add(electronMesh);

    // --- ANIMATION: RF Fields in cavities ---
    const rfFields = [];
    const rfFieldGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.8, 16);
    const rfFieldMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    
    for (let i = 0; i < numVanes; i++) {
        const rfMesh = new THREE.Mesh(rfFieldGeo, rfFieldMat.clone());
        const angle = (i + 0.5) * (Math.PI * 2 / numVanes); // centered in cavity
        rfMesh.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
        group.add(rfMesh);
        rfFields.push(rfMesh);
    }

    const dummy = new THREE.Object3D();
    let time = 0;

    const update = (delta) => {
        time += delta;
        const omegaSpoke = 3.0; // rotation speed of the space-charge wheel
        
        // Update electrons kinematics
        for(let i=0; i<numElectrons; i++) {
            const el = electrons[i];
            el.age += delta * 0.5; // lifespan speed
            if (el.age > 1.0) {
                el.age = 0;
                el.spoke = Math.floor(Math.random() * 4);
                el.offset = (Math.random() - 0.5) * 1.5;
                el.yOffset = (Math.random() - 0.5) * 3.8;
            }
            
            // Radius grows from cathode (0.55) to anode (1.5)
            const r = 0.55 + el.age * 0.9;
            
            // Angle: Spirals out, groups into spokes due to crossed E and B fields interacting with RF fields
            const spokeTarget = (el.spoke * Math.PI / 2) + omegaSpoke * time;
            
            // The closer to anode, the tighter they group
            const grouping = Math.pow(el.age, 2); 
            const angle = spokeTarget - (1.0 - el.age) * 3.0 + el.offset * (1.0 - grouping);
            
            dummy.position.set(Math.cos(angle) * r, el.yOffset, Math.sin(angle) * r);
            dummy.scale.setScalar(1.0 - el.age * 0.5); // shrink slightly as they hit anode
            dummy.updateMatrix();
            electronMesh.setMatrixAt(i, dummy.matrix);
        }
        electronMesh.instanceMatrix.needsUpdate = true;

        // Update RF Fields intensity/color based on Pi-mode resonance
        const rfOmega = omegaSpoke * 4; // RF frequency relates to spoke passage
        for (let i = 0; i < numVanes; i++) {
            // Alternating phase for Pi-mode
            const phase = i % 2 === 0 ? 0 : Math.PI;
            const intensity = (Math.sin(rfOmega * time + phase) + 1) / 2;
            rfFields[i].material.opacity = 0.1 + 0.4 * intensity;
            // Pulsate color slightly between pinkish and bluish representing field shifts
            rfFields[i].material.color.setHSL(0.8 + 0.2 * intensity, 1.0, 0.5);
        }
    };

    const quiz = [
        {
            question: "What is the primary mechanism for emitting electrons from the central cathode in a magnetron?",
            options: [
                "Photoelectric emission",
                "Thermionic emission",
                "Secondary emission",
                "Field emission"
            ],
            correctAnswer: 1
        },
        {
            question: "A cavity magnetron is classified as a 'crossed-field' device. What does this mean?",
            options: [
                "It uses two crossed antennas for output",
                "The static electric and magnetic fields are perpendicular to each other",
                "The electron beams cross paths in the interaction space",
                "It requires alternating current fields that cross at 90 degrees"
            ],
            correctAnswer: 1
        },
        {
            question: "What dictates the fundamental operating frequency (microwave wavelength) of the magnetron?",
            options: [
                "The voltage applied to the cathode",
                "The strength of the permanent magnets",
                "The physical dimensions and geometry of the resonant cavities",
                "The temperature of the filament"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the main purpose of the 'strap rings' connecting the anode vanes?",
            options: [
                "To conduct heat away from the anode block",
                "To structurally reinforce the vacuum envelope",
                "To lock the magnetron into the highly efficient pi-mode (π-mode) by tying alternate segments together",
                "To filter out low-frequency noise from the RF output"
            ],
            correctAnswer: 2
        },
        {
            question: "What forms as a result of the complex interaction between the spiraling electrons and the RF fields in the cavities?",
            options: [
                "A stationary electron cloud",
                "A rotating space-charge wheel with 'spokes'",
                "A linear particle beam",
                "A pure vacuum void"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the role of the strong permanent magnets located above and below the anode block?",
            options: [
                "To cool the device by magnetic convection",
                "To keep the magnetron mounted securely to its base",
                "To generate the axial magnetic field that curves the paths of the electrons",
                "To tune the resonant frequency of the output probe"
            ],
            correctAnswer: 2
        }
    ];

    return { mesh: group, update, quiz };
}
