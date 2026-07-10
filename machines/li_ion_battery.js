export function createLiIonBattery(THREE) {
    const group = new THREE.Group();

    // Materials
    const caseMat = new THREE.MeshStandardMaterial({ color: 0xb0c4de, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide });
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.4, roughness: 0.8, side: THREE.DoubleSide });
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x1f1a38, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });
    const separatorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const terminalMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.3 });
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xc87b3f, metalness: 0.7, roughness: 0.4 });
    const cidMat = new THREE.MeshStandardMaterial({ color: 0x5a9e7d, metalness: 0.6, roughness: 0.5 });
    const ptcMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 });
    const electrolyteMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888, emissiveIntensity: 0.8 });

    // 1. Casing (Can)
    const caseGeo = new THREE.CylinderGeometry(2.0, 2.0, 10, 64, 1, true, 0, Math.PI * 1.5);
    const casing = new THREE.Mesh(caseGeo, caseMat);
    group.add(casing);

    // 2. Anode (Graphite)
    const anodeGeo = new THREE.CylinderGeometry(1.2, 1.2, 9, 64, 1, true, 0, Math.PI * 1.5);
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.y = -0.2;
    group.add(anode);

    // 3. Cathode (Lithium Cobalt Oxide)
    const cathodeGeo = new THREE.CylinderGeometry(1.6, 1.6, 9, 64, 1, true, 0, Math.PI * 1.5);
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.position.y = -0.2;
    group.add(cathode);

    // 4. Separator
    const sepGeo = new THREE.CylinderGeometry(1.4, 1.4, 9.2, 64, 1, true, 0, Math.PI * 1.5);
    const separator = new THREE.Mesh(sepGeo, separatorMat);
    separator.position.y = -0.1;
    group.add(separator);

    // 5. Positive Terminal
    const posPoints = [];
    posPoints.push(new THREE.Vector2(0, 0.4));
    posPoints.push(new THREE.Vector2(0.8, 0.4));
    posPoints.push(new THREE.Vector2(0.8, 0.2));
    posPoints.push(new THREE.Vector2(1.8, 0.2));
    posPoints.push(new THREE.Vector2(1.8, 0));
    posPoints.push(new THREE.Vector2(0, 0));
    const posTermGeo = new THREE.LatheGeometry(posPoints, 32);
    const posTerm = new THREE.Mesh(posTermGeo, terminalMat);
    posTerm.position.y = 4.9;
    group.add(posTerm);

    // 6. Negative Terminal
    const negTermGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.2, 32);
    const negTerm = new THREE.Mesh(negTermGeo, terminalMat);
    negTerm.position.y = -5.1;
    group.add(negTerm);

    // 7. Safety Vent
    const ventGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 32);
    const vent = new THREE.Mesh(ventGeo, ventMat);
    vent.position.y = 4.6;
    group.add(vent);

    // 8. Current Interrupt Device (CID)
    const cidGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.08, 32);
    const cid = new THREE.Mesh(cidGeo, cidMat);
    cid.position.y = 4.45;
    group.add(cid);

    // 9. PTC Coefficient Thermistor
    const ptcGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 32);
    const ptc = new THREE.Mesh(ptcGeo, ptcMat);
    ptc.rotation.x = Math.PI / 2;
    ptc.position.y = 4.75;
    group.add(ptc);

    // 10. Electrolyte Representation (Lithium Ions)
    const ions = new THREE.Group();
    const ionGeo = new THREE.SphereGeometry(0.04, 16, 16);
    
    const numIons = 200;
    const ionData = [];
    
    for (let i = 0; i < numIons; i++) {
        const ion = new THREE.Mesh(ionGeo, electrolyteMat);
        
        const angle = Math.random() * Math.PI * 1.5;
        const h = (Math.random() - 0.5) * 8.5 - 0.2;
        const progress = Math.random();
        
        const r = 1.2 + progress * 0.4;
        
        ion.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
        
        ions.add(ion);
        ionData.push({
            mesh: ion,
            angle: angle,
            h: h,
            progress: progress,
            speed: 0.1 + Math.random() * 0.2
        });
    }
    group.add(ions);

    // Kinematics animation
    let time = 0;

    const update = function(delta) {
        time += delta;
        // Cycle between charge and discharge (8 second full cycle)
        // Math.sin(time) > 0: discharging (anode -> cathode)
        // Math.sin(time) < 0: charging (cathode -> anode)
        const cycle = Math.sin(time * 2 * Math.PI / 8);
        
        for (let i = 0; i < numIons; i++) {
            const data = ionData[i];
            
            // Target direction
            const targetDirection = cycle > 0 ? 1 : -1;
            
            data.progress += targetDirection * data.speed * delta * Math.abs(cycle);
            
            if (data.progress > 1) data.progress = 1;
            if (data.progress < 0) data.progress = 0;
            
            const r = 1.2 + data.progress * 0.4;
            data.mesh.position.set(Math.cos(data.angle) * r, data.h, Math.sin(data.angle) * r);
        }
    };

    const quiz = [
        {
            question: "During the discharge of a Lithium-ion battery, where do the lithium ions intercalate?",
            options: [
                "Into the Anode (Graphite)",
                "Into the Cathode (e.g., Lithium Cobalt Oxide)",
                "Into the Separator",
                "Into the Electrolyte"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the primary function of the Positive Temperature Coefficient (PTC) thermistor in a cell?",
            options: [
                "To increase capacity at high temperatures",
                "To act as a catalyst for intercalation",
                "To rapidly increase resistance and limit current if the cell overheats",
                "To provide structural support to the positive terminal"
            ],
            correctAnswer: 2
        },
        {
            question: "What role does the Current Interrupt Device (CID) play?",
            options: [
                "It permanently disconnects the cell circuit if internal gas pressure becomes too high",
                "It converts DC current to AC current",
                "It manages the charge rate dynamically",
                "It cools the battery during fast charging"
            ],
            correctAnswer: 0
        },
        {
            question: "Which material is most commonly used for the anode in commercial Lithium-ion cells?",
            options: [
                "Lithium Iron Phosphate",
                "Graphite",
                "Silicon dioxide",
                "Metallic Lithium"
            ],
            correctAnswer: 1
        },
        {
            question: "What is 'Thermal Runaway' in the context of Lithium-ion batteries?",
            options: [
                "A rapid discharge of energy causing the battery to freeze",
                "A safe mode where the battery slowly cools down",
                "An uncontrollable, self-heating state that can lead to fire or explosion",
                "The process of heat escaping safely through the safety vent"
            ],
            correctAnswer: 2
        },
        {
            question: "What prevents the anode and cathode from physically touching while allowing ions to pass through?",
            options: [
                "The solid electrolyte interphase (SEI) layer",
                "The casing",
                "The safety vent",
                "The porous separator"
            ],
            correctAnswer: 3
        }
    ];

    return {
        mesh: group,
        update: update,
        quiz: quiz
    };
}
