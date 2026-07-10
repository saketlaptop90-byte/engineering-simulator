export function createStomataTranspiration(THREE) {
    const machine = new THREE.Group();

    // 1. Guard Cell Left
    const guardCellGeometryLeft = new THREE.TorusGeometry(3, 1.2, 16, 32, Math.PI);
    const guardCellMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.6, metalness: 0.1 });
    const guardCellLeft = new THREE.Mesh(guardCellGeometryLeft, guardCellMaterial);
    guardCellLeft.rotation.z = Math.PI / 2;
    guardCellLeft.position.set(-1.5, 0, 0);
    guardCellLeft.scale.set(1, 1.2, 1);
    machine.add(guardCellLeft);

    // 2. Guard Cell Right
    const guardCellGeometryRight = new THREE.TorusGeometry(3, 1.2, 16, 32, Math.PI);
    const guardCellRight = new THREE.Mesh(guardCellGeometryRight, guardCellMaterial);
    guardCellRight.rotation.z = -Math.PI / 2;
    guardCellRight.position.set(1.5, 0, 0);
    guardCellRight.scale.set(1, 1.2, 1);
    machine.add(guardCellRight);

    // 3. Stomatal Pore
    const poreGeometry = new THREE.PlaneGeometry(4, 6);
    const poreMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthWrite: false });
    const pore = new THREE.Mesh(poreGeometry, poreMaterial);
    pore.position.set(0, 0, -0.5);
    machine.add(pore);

    // 4. Subsidiary Cells
    const subsidiaryGroup = new THREE.Group();
    const subsidiaryGeo = new THREE.TorusGeometry(6, 2, 16, 32);
    const subsidiaryMat = new THREE.MeshStandardMaterial({ color: 0x8BC34A, transparent: true, opacity: 0.7, roughness: 0.8 });
    const subsidiaryCells = new THREE.Mesh(subsidiaryGeo, subsidiaryMat);
    subsidiaryCells.scale.set(0.8, 1.2, 0.5);
    subsidiaryCells.position.set(0, 0, -1);
    subsidiaryGroup.add(subsidiaryCells);
    machine.add(subsidiaryGroup);

    // 5. Epidermal Cells
    const epidermalGeo = new THREE.PlaneGeometry(35, 25);
    const epidermalMat = new THREE.MeshStandardMaterial({ color: 0xCDDC39, side: THREE.DoubleSide, roughness: 0.9 });
    const epidermal = new THREE.Mesh(epidermalGeo, epidermalMat);
    epidermal.position.set(0, 0, -1.5);
    machine.add(epidermal);

    // 6. Chloroplasts in Guard Cells
    const chloroplastGroup = new THREE.Group();
    const chloroGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const chloroMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20 });
    
    // Left guard cell chloroplasts
    for(let i=0; i<8; i++) {
        let c = new THREE.Mesh(chloroGeo, chloroMat);
        let angle = (i / 7) * Math.PI - Math.PI/2;
        c.position.set(-1.5 - Math.cos(angle)*1.5, Math.sin(angle)*3, 0.8);
        chloroplastGroup.add(c);
    }
    
    // Right guard cell chloroplasts
    for(let i=0; i<8; i++) {
        let c = new THREE.Mesh(chloroGeo, chloroMat);
        let angle = (i / 7) * Math.PI - Math.PI/2;
        c.position.set(1.5 + Math.cos(angle)*1.5, Math.sin(angle)*3, 0.8);
        chloroplastGroup.add(c);
    }
    machine.add(chloroplastGroup);

    // 7. Vacuole in Guard Cells
    const vacuoleGroup = new THREE.Group();
    const vacuoleGeo = new THREE.TorusGeometry(3, 0.6, 16, 32, Math.PI * 0.8);
    const vacuoleMat = new THREE.MeshStandardMaterial({ color: 0x29B6F6, transparent: true, opacity: 0.6, roughness: 0.2 });
    
    const vacuoleLeft = new THREE.Mesh(vacuoleGeo, vacuoleMat);
    vacuoleLeft.rotation.z = Math.PI / 2 + 0.314;
    vacuoleLeft.position.set(-1.5, 0, 0.5);
    vacuoleLeft.scale.set(1, 1.2, 1);
    
    const vacuoleRight = new THREE.Mesh(vacuoleGeo, vacuoleMat);
    vacuoleRight.rotation.z = -Math.PI / 2 + 0.314;
    vacuoleRight.position.set(1.5, 0, 0.5);
    vacuoleRight.scale.set(1, 1.2, 1);
    
    vacuoleGroup.add(vacuoleLeft, vacuoleRight);
    machine.add(vacuoleGroup);

    // 8. Cuticle Layer
    const cuticleGeo = new THREE.PlaneGeometry(35, 25);
    const cuticleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2, side: THREE.DoubleSide, roughness: 0.1 });
    const cuticle = new THREE.Mesh(cuticleGeo, cuticleMat);
    cuticle.position.set(0, 0, 1.2);
    machine.add(cuticle);

    // 9. Mesophyll Air Space
    const mesophyllGeo = new THREE.BoxGeometry(12, 12, 6);
    const mesophyllMat = new THREE.MeshBasicMaterial({ color: 0x388E3C, transparent: true, opacity: 0.1, wireframe: true });
    const mesophyll = new THREE.Mesh(mesophyllGeo, mesophyllMat);
    mesophyll.position.set(0, 0, -4.5);
    machine.add(mesophyll);

    // 10. Water Vapor Molecules
    const vaporGroup = new THREE.Group();
    const vaporGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const vaporMat = new THREE.MeshStandardMaterial({ color: 0xE0F7FA, transparent: true, opacity: 0.8 });
    const vapors = [];
    for(let i=0; i<30; i++) {
        const v = new THREE.Mesh(vaporGeo, vaporMat);
        v.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*8, -6 + Math.random()*4);
        // store velocity and initial state
        v.userData = {
            baseZ: -6 + Math.random()*2,
            speed: 2 + Math.random()*3
        };
        vapors.push(v);
        vaporGroup.add(v);
    }
    machine.add(vaporGroup);

    // Animation variables
    let time = 0;
    
    // Animation Loop
    machine.userData.update = function(deltaTime) {
        time += deltaTime;

        // Turgor pressure: Opens and closes the pore
        // openness from 0 (closed) to 1 (open)
        const openness = (Math.sin(time) + 1) / 2;
        
        const guardOffset = openness * 1.5;
        
        guardCellLeft.position.x = -1.5 - guardOffset;
        guardCellRight.position.x = 1.5 + guardOffset;
        
        vacuoleLeft.position.x = -1.5 - guardOffset;
        vacuoleRight.position.x = 1.5 + guardOffset;

        // Update chloroplasts positions based on openness
        let idx = 0;
        for(let i=0; i<8; i++) {
            let angle = (i / 7) * Math.PI - Math.PI/2;
            chloroplastGroup.children[idx++].position.set(-1.5 - guardOffset - Math.cos(angle)*1.5, Math.sin(angle)*3, 0.8);
        }
        for(let i=0; i<8; i++) {
            let angle = (i / 7) * Math.PI - Math.PI/2;
            chloroplastGroup.children[idx++].position.set(1.5 + guardOffset + Math.cos(angle)*1.5, Math.sin(angle)*3, 0.8);
        }

        pore.scale.x = Math.max(0.01, openness * 1.5);
        
        // Vacuoles scale down slightly when turgor pressure is low (openness -> 0)
        vacuoleLeft.scale.set(1 - (1-openness)*0.3, 1.2 - (1-openness)*0.3, 1);
        vacuoleRight.scale.set(1 - (1-openness)*0.3, 1.2 - (1-openness)*0.3, 1);

        // Water vapor molecules escaping when stomata is open
        vapors.forEach((v) => {
            if (openness > 0.2) {
                v.position.z += deltaTime * v.userData.speed;
                // Add some jitter
                v.position.x += (Math.random() - 0.5) * 0.1;
                v.position.y += (Math.random() - 0.5) * 0.1;

                if (v.position.z > 3) {
                    v.position.z = v.userData.baseZ;
                    v.position.x = (Math.random()-0.5)*2 * openness;
                    v.position.y = (Math.random()-0.5)*4;
                }
            } else {
                // If closed, they mill about in the mesophyll
                v.position.x += (Math.random() - 0.5) * 0.05;
                v.position.y += (Math.random() - 0.5) * 0.05;
                v.position.z += (Math.random() - 0.5) * 0.05;
                
                // Keep them bounded
                if (v.position.z > -1) v.position.z = -1;
                if (v.position.z < -7) v.position.z = -7;
            }
        });
    };

    machine.userData.questions = [
        {
            question: "What regulates the opening and closing of stomata?",
            options: ["Guard cells", "Epidermal cells", "Cuticle layer", "Mesophyll cells"],
            correctAnswer: 0
        },
        {
            question: "What happens when turgor pressure in guard cells increases?",
            options: ["Stomata close", "Stomata open", "Photosynthesis stops", "Water vapor condenses"],
            correctAnswer: 1
        },
        {
            question: "What is the primary function of stomata?",
            options: ["Absorb light", "Gas exchange and transpiration", "Protect the leaf from herbivores", "Store water"],
            correctAnswer: 1
        },
        {
            question: "Which organelles in guard cells are responsible for photosynthesis?",
            options: ["Mitochondria", "Vacuoles", "Chloroplasts", "Nuclei"],
            correctAnswer: 2
        },
        {
            question: "What is transpiration?",
            options: ["Loss of water vapor through stomata", "Absorption of water by roots", "Transport of sugars in phloem", "Conversion of light into chemical energy"],
            correctAnswer: 0
        },
        {
            question: "The space behind the stomata where gases and water vapor collect is called:",
            options: ["Guard cell vacuole", "Mesophyll air space", "Cuticle layer", "Subsidiary chamber"],
            correctAnswer: 1
        }
    ];

    return machine;
}
