export function createHumanLungs(THREE) {
    const group = new THREE.Group();

    // Materials
    const tissueMaterial = new THREE.MeshStandardMaterial({ color: 0xff6666, transparent: true, opacity: 0.85, roughness: 0.4 });
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.7 });
    const boneMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.8 });
    const muscleMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4444, roughness: 0.9 });
    const smallTissueMaterial = new THREE.MeshStandardMaterial({ color: 0xff9999 });
    const cavityMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.1 });

    // 1. Trachea
    const tracheaGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const trachea = new THREE.Mesh(tracheaGeo, tubeMaterial);
    trachea.position.set(0, 3, 0);
    trachea.name = "Trachea";
    group.add(trachea);

    // 2. Epiglottis (Top of Trachea)
    const epiglottisGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const epiglottis = new THREE.Mesh(epiglottisGeo, muscleMaterial);
    epiglottis.position.set(0, 4.1, 0);
    epiglottis.scale.set(1, 0.5, 0.8);
    epiglottis.name = "Epiglottis";
    group.add(epiglottis);

    // 3. Left Bronchus
    const bronchusGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const leftBronchus = new THREE.Mesh(bronchusGeo, tubeMaterial);
    leftBronchus.position.set(0.6, 1.5, 0);
    leftBronchus.rotation.z = -Math.PI / 4;
    leftBronchus.name = "Left Bronchus";
    group.add(leftBronchus);

    // 4. Right Bronchus
    const rightBronchus = new THREE.Mesh(bronchusGeo, tubeMaterial);
    rightBronchus.position.set(-0.6, 1.5, 0);
    rightBronchus.rotation.z = Math.PI / 4;
    rightBronchus.name = "Right Bronchus";
    group.add(rightBronchus);

    // Lungs container
    const lungsGroup = new THREE.Group();
    group.add(lungsGroup);

    // 5. Left Lung
    const lungGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const leftLung = new THREE.Mesh(lungGeo, tissueMaterial);
    leftLung.position.set(1.5, 0, 0);
    leftLung.scale.set(0.8, 1.5, 1);
    leftLung.name = "Left Lung";
    lungsGroup.add(leftLung);

    // 6. Right Lung
    const rightLung = new THREE.Mesh(lungGeo, tissueMaterial);
    rightLung.position.set(-1.5, 0, 0);
    rightLung.scale.set(0.85, 1.5, 1);
    rightLung.name = "Right Lung";
    lungsGroup.add(rightLung);

    // 7. Alveoli
    const alveoliGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const alveoli = new THREE.InstancedMesh(alveoliGeo, smallTissueMaterial, 50);
    alveoli.name = "Alveoli";
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 50; i++) {
        const isLeft = Math.random() > 0.5;
        const x = (isLeft ? 1.5 : -1.5) + (Math.random() - 0.5) * 1.5;
        const y = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 1.5;
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        alveoli.setMatrixAt(i, dummy.matrix);
    }
    lungsGroup.add(alveoli);

    // 8. Pleural Cavity
    const cavityGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const pleuralCavityL = new THREE.Mesh(cavityGeo, cavityMaterial);
    pleuralCavityL.position.set(1.5, 0, 0);
    pleuralCavityL.scale.set(0.85, 1.55, 1.05);
    const pleuralCavityR = new THREE.Mesh(cavityGeo, cavityMaterial);
    pleuralCavityR.position.set(-1.5, 0, 0);
    pleuralCavityR.scale.set(0.9, 1.55, 1.05);
    
    const pleuralCavity = new THREE.Group();
    pleuralCavity.add(pleuralCavityL);
    pleuralCavity.add(pleuralCavityR);
    pleuralCavity.name = "Pleural Cavity";
    lungsGroup.add(pleuralCavity);

    // 9. Diaphragm
    const diaphragmGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    const diaphragm = new THREE.Mesh(diaphragmGeo, muscleMaterial);
    diaphragm.position.set(0, -2.5, 0);
    diaphragm.scale.set(1.2, 1, 0.8);
    diaphragm.name = "Diaphragm";
    group.add(diaphragm);

    // 10. Ribcage
    const ribcageGroup = new THREE.Group();
    ribcageGroup.name = "Ribcage";
    for (let i = 0; i < 7; i++) {
        const ribGeo = new THREE.TorusGeometry(2 + i * 0.05, 0.1, 8, 24, Math.PI);
        const rib = new THREE.Mesh(ribGeo, boneMaterial);
        rib.rotation.x = Math.PI / 2;
        rib.rotation.z = Math.PI / 2;
        rib.position.set(0, 1.5 - i * 0.5, 0);
        rib.scale.set(1, 0.8, 1);
        ribcageGroup.add(rib);
    }
    group.add(ribcageGroup);

    // Kinematics Animation
    group.tick = (time) => {
        // Breathing cycle: period of ~4 seconds
        const cycle = Math.sin(time * Math.PI / 2); 
        
        // Normalize cycle to 0..1 for expansion, where 1 is fully inhaled
        const inhaleFactor = (cycle + 1) / 2; 

        // Diaphragm moves down and flattens
        diaphragm.position.y = -2.5 - inhaleFactor * 0.5;
        diaphragm.scale.y = 1 - inhaleFactor * 0.3;

        // Lungs expand
        lungsGroup.scale.set(1 + inhaleFactor * 0.15, 1 + inhaleFactor * 0.15, 1 + inhaleFactor * 0.2);
        
        // Ribcage expands slightly up and out
        ribcageGroup.scale.set(1 + inhaleFactor * 0.05, 1, 1 + inhaleFactor * 0.1);
        ribcageGroup.position.y = inhaleFactor * 0.1;
    };

    // Quizzes
    group.userData.quiz = [
        {
            question: "What is the primary function of the Diaphragm?",
            options: ["To pump blood", "To expand the lungs during inhalation", "To digest food", "To protect the heart"],
            answer: 1
        },
        {
            question: "Where does gas exchange occur in the lungs?",
            options: ["Trachea", "Bronchi", "Alveoli", "Pleural Cavity"],
            answer: 2
        },
        {
            question: "What prevents food from entering the trachea?",
            options: ["Diaphragm", "Epiglottis", "Bronchus", "Alveoli"],
            answer: 1
        },
        {
            question: "Which lung is typically slightly smaller to make room for the heart?",
            options: ["Right Lung", "Left Lung", "They are identical", "Neither"],
            answer: 1
        },
        {
            question: "What is the fluid-filled space surrounding the lungs called?",
            options: ["Alveoli", "Pleural Cavity", "Trachea", "Bronchioles"],
            answer: 1
        },
        {
            question: "What happens to the ribcage during inhalation?",
            options: ["It contracts and moves down", "It stays still", "It expands and moves up", "It dissolves"],
            answer: 2
        }
    ];

    return group;
}
