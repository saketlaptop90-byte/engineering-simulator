export function createStomach(THREE) {
    const group = new THREE.Group();

    // 10 Distinct Parts
    // 1. Esophagus
    // 2. Fundus
    // 3. Body
    // 4. Antrum
    // 5. Pylorus
    // 6. Duodenum
    // 7. Rugae
    // 8. Lower Esophageal Sphincter
    // 9. Pyloric Sphincter
    // 10. Muscle Layers

    group.userData.quiz = [
        {
            question: "What is the tube that carries food from the mouth to the stomach?",
            options: ["Trachea", "Esophagus", "Duodenum", "Pharynx"],
            answer: "Esophagus"
        },
        {
            question: "What regulates the passage of food from the stomach to the duodenum?",
            options: ["Lower Esophageal Sphincter", "Pyloric Sphincter", "Ileocecal Valve", "Epiglottis"],
            answer: "Pyloric Sphincter"
        },
        {
            question: "What are the internal folds of the stomach called?",
            options: ["Villi", "Microvilli", "Rugae", "Cilia"],
            answer: "Rugae"
        },
        {
            question: "Which part of the stomach is the dome-shaped region superior to the esophageal connection?",
            options: ["Fundus", "Body", "Antrum", "Pylorus"],
            answer: "Fundus"
        },
        {
            question: "What type of muscle contraction moves food through the digestive tract?",
            options: ["Isometric", "Isotonic", "Peristalsis", "Tetanus"],
            answer: "Peristalsis"
        },
        {
            question: "Which of the following is NOT a layer of the stomach wall?",
            options: ["Mucosa", "Submucosa", "Muscle Layers", "Epidermis"],
            answer: "Epidermis"
        }
    ];

    const materialMap = {
        pink: new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.6, metalness: 0.1 }),
        darkPink: new THREE.MeshStandardMaterial({ color: 0xdb7093, roughness: 0.7, metalness: 0.1 }),
        red: new THREE.MeshStandardMaterial({ color: 0xcd5c5c, roughness: 0.6, metalness: 0.1 }),
        transparentRed: new THREE.MeshStandardMaterial({ color: 0x8b0000, transparent: true, opacity: 0.3, roughness: 0.8 }),
        white: new THREE.MeshStandardMaterial({ color: 0xffe4e1, roughness: 0.9, metalness: 0.0 }),
        yellowish: new THREE.MeshStandardMaterial({ color: 0xf5deb3, roughness: 0.8, metalness: 0.1 }),
    };

    // 1. Esophagus
    const esophagusGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    const esophagus = new THREE.Mesh(esophagusGeo, materialMap.pink);
    esophagus.position.set(0, 5, 0);
    esophagus.name = "Esophagus";
    group.add(esophagus);

    // 2. Lower Esophageal Sphincter
    const lesGeo = new THREE.TorusGeometry(0.7, 0.2, 16, 32);
    const les = new THREE.Mesh(lesGeo, materialMap.darkPink);
    les.position.set(0, 3.5, 0);
    les.rotation.x = Math.PI / 2;
    les.name = "Lower Esophageal Sphincter";
    group.add(les);

    // 3. Fundus
    const fundusGeo = new THREE.SphereGeometry(1.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const fundus = new THREE.Mesh(fundusGeo, materialMap.pink);
    fundus.position.set(-1.2, 3.2, 0);
    fundus.name = "Fundus";
    group.add(fundus);

    // 4. Body
    const bodyGeo = new THREE.SphereGeometry(2, 32, 32);
    const body = new THREE.Mesh(bodyGeo, materialMap.pink);
    body.position.set(-0.8, 1.5, 0);
    body.scale.set(1.2, 1.5, 1);
    body.name = "Body";
    group.add(body);

    // 5. Antrum
    const antrumGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const antrum = new THREE.Mesh(antrumGeo, materialMap.pink);
    antrum.position.set(0.5, -0.5, 0);
    antrum.scale.set(1.2, 1, 0.9);
    antrum.name = "Antrum";
    group.add(antrum);

    // 6. Pylorus
    const pylorusGeo = new THREE.CylinderGeometry(0.8, 0.6, 2, 16);
    const pylorus = new THREE.Mesh(pylorusGeo, materialMap.pink);
    pylorus.position.set(2, -1, 0);
    pylorus.rotation.z = Math.PI / 2.5;
    pylorus.name = "Pylorus";
    group.add(pylorus);

    // 7. Pyloric Sphincter
    const psGeo = new THREE.TorusGeometry(0.7, 0.2, 16, 32);
    const ps = new THREE.Mesh(psGeo, materialMap.darkPink);
    ps.position.set(3, -1.3, 0);
    ps.rotation.y = Math.PI / 2;
    ps.rotation.x = Math.PI / 2.5;
    ps.name = "Pyloric Sphincter";
    group.add(ps);

    // 8. Duodenum
    const duodenumGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    const duodenum = new THREE.Mesh(duodenumGeo, materialMap.yellowish);
    duodenum.position.set(4.2, -2.5, 0);
    duodenum.rotation.z = -Math.PI / 4;
    duodenum.name = "Duodenum";
    group.add(duodenum);

    // 9. Rugae
    const rugaeGeo = new THREE.CylinderGeometry(1.9, 1.9, 2.8, 32, 10, true, 0, Math.PI);
    const posAttribute = rugaeGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const radiusOffset = Math.sin(y * 15) * 0.1;
        posAttribute.setX(i, posAttribute.getX(i) + Math.sign(posAttribute.getX(i)) * radiusOffset);
        posAttribute.setZ(i, posAttribute.getZ(i) + Math.sign(posAttribute.getZ(i)) * radiusOffset);
    }
    rugaeGeo.computeVertexNormals();
    const rugae = new THREE.Mesh(rugaeGeo, materialMap.white);
    rugae.position.set(-0.8, 1.5, 0.2);
    rugae.rotation.y = Math.PI; // Face outwards
    rugae.scale.set(1.22, 1.52, 1.05);
    rugae.name = "Rugae";
    group.add(rugae);

    // 10. Muscle Layers
    const muscleGeo = new THREE.SphereGeometry(2.1, 32, 32);
    const muscle = new THREE.Mesh(muscleGeo, materialMap.transparentRed);
    muscle.position.set(-0.8, 1.5, 0);
    muscle.scale.set(1.2, 1.5, 1);
    muscle.name = "Muscle Layers";
    group.add(muscle);

    // Peristalsis Parts and Base Scales
    const peristalsisParts = [
        { mesh: fundus, offset: 0 },
        { mesh: body, offset: 0.5 },
        { mesh: muscle, offset: 0.5 },
        { mesh: rugae, offset: 0.5 },
        { mesh: antrum, offset: 1.5 },
        { mesh: pylorus, offset: 2.5 }
    ];

    const baseScales = peristalsisParts.map(p => p.mesh.scale.clone());

    group.tick = (time) => {
        const speed = 3.0; // Contraction speed
        for (let i = 0; i < peristalsisParts.length; i++) {
            const item = peristalsisParts[i];
            const baseScale = baseScales[i];
            
            // Generate a peristaltic wave moving down
            const wave = Math.sin(time * speed - item.offset);
            
            // Constrain contraction to negative parts of sine wave for a "squeeze" effect
            const contraction = Math.max(0, wave) * 0.15; 
            
            item.mesh.scale.set(
                baseScale.x * (1 - contraction),
                baseScale.y * (1 - contraction * 0.2), 
                baseScale.z * (1 - contraction)
            );
        }
    };

    return group;
}
