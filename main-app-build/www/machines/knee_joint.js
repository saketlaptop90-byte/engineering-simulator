export function createKneeJoint(THREE) {
    const group = new THREE.Group();

    // Materials
    const boneMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dac9, roughness: 0.8, metalness: 0.1 });
    const ligamentMaterial = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.6, metalness: 0.0, transparent: true, opacity: 0.8 });
    const cartilageMaterial = new THREE.MeshStandardMaterial({ color: 0xa8c8e6, roughness: 0.3, metalness: 0.1 });
    const meniscusMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7, metalness: 0.0 });
    const patellaMaterial = new THREE.MeshStandardMaterial({ color: 0xe3dac9, roughness: 0.8, metalness: 0.1 });

    // 1. Femur
    const femur = new THREE.Group();
    femur.name = "Femur";
    const femurShaftGeo = new THREE.CylinderGeometry(0.8, 1, 8, 16);
    const femurShaft = new THREE.Mesh(femurShaftGeo, boneMaterial);
    femurShaft.position.y = 5;
    femur.add(femurShaft);
    
    const condyleGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const medialCondyle = new THREE.Mesh(condyleGeo, boneMaterial);
    medialCondyle.position.set(-1.1, 0.5, 0);
    femur.add(medialCondyle);
    
    const lateralCondyle = new THREE.Mesh(condyleGeo, boneMaterial);
    lateralCondyle.position.set(1.1, 0.5, 0);
    femur.add(lateralCondyle);
    
    group.add(femur);

    // 2. Tibia
    const tibiaGroup = new THREE.Group(); 
    group.add(tibiaGroup);
    
    const tibia = new THREE.Group();
    tibia.name = "Tibia";
    const tibiaShaftGeo = new THREE.CylinderGeometry(0.9, 0.6, 8, 16);
    const tibiaShaft = new THREE.Mesh(tibiaShaftGeo, boneMaterial);
    tibiaShaft.position.y = -5;
    tibia.add(tibiaShaft);
    
    const plateauGeo = new THREE.CylinderGeometry(1.4, 0.9, 1, 16);
    const plateau = new THREE.Mesh(plateauGeo, boneMaterial);
    plateau.position.y = -0.5;
    tibia.add(plateau);
    tibiaGroup.add(tibia);

    // 3. Fibula
    const fibula = new THREE.Group();
    fibula.name = "Fibula";
    const fibulaShaftGeo = new THREE.CylinderGeometry(0.4, 0.3, 8, 16);
    const fibulaShaft = new THREE.Mesh(fibulaShaftGeo, boneMaterial);
    fibulaShaft.position.set(1.6, -5.5, -0.5);
    fibula.add(fibulaShaft);
    
    const fibulaHeadGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const fibulaHead = new THREE.Mesh(fibulaHeadGeo, boneMaterial);
    fibulaHead.position.set(1.6, -1.5, -0.5);
    fibula.add(fibulaHead);
    tibiaGroup.add(fibula);

    // 4. Patella
    const patellaGeo = new THREE.SphereGeometry(0.6, 16, 16);
    patellaGeo.scale(1, 1, 0.4);
    const patella = new THREE.Mesh(patellaGeo, patellaMaterial);
    patella.name = "Patella";
    group.add(patella);

    // Helper for ligaments
    function createLigament(name, radius) {
        const geo = new THREE.CylinderGeometry(radius, radius, 1, 8);
        geo.translate(0, 0.5, 0);
        const mesh = new THREE.Mesh(geo, ligamentMaterial);
        mesh.name = name;
        group.add(mesh);
        return mesh;
    }

    // 5. ACL
    const acl = createLigament("ACL", 0.15);
    
    // 6. PCL
    const pcl = createLigament("PCL", 0.18);
    
    // 8. MCL
    const mcl = createLigament("MCL", 0.2);
    
    // 9. LCL
    const lcl = createLigament("LCL", 0.15);

    // 7. Meniscus
    const meniscus = new THREE.Group();
    meniscus.name = "Meniscus";
    const meniscusGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16, Math.PI);
    
    const medialMeniscus = new THREE.Mesh(meniscusGeo, meniscusMaterial);
    medialMeniscus.rotation.x = -Math.PI / 2;
    medialMeniscus.position.set(-0.6, 0.1, 0);
    meniscus.add(medialMeniscus);
    
    const lateralMeniscus = new THREE.Mesh(meniscusGeo, meniscusMaterial);
    lateralMeniscus.rotation.x = -Math.PI / 2;
    lateralMeniscus.rotation.z = Math.PI;
    lateralMeniscus.position.set(0.6, 0.1, 0);
    meniscus.add(lateralMeniscus);
    
    tibiaGroup.add(meniscus);

    // 10. Articular Cartilage
    const articularCartilage = new THREE.Group();
    articularCartilage.name = "Articular Cartilage";
    const cartilageGeo = new THREE.SphereGeometry(1.22, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    
    const medialCartilage = new THREE.Mesh(cartilageGeo, cartilageMaterial);
    medialCartilage.position.set(-1.1, 0.5, 0);
    medialCartilage.rotation.x = Math.PI;
    articularCartilage.add(medialCartilage);
    
    const lateralCartilage = new THREE.Mesh(cartilageGeo, cartilageMaterial);
    lateralCartilage.position.set(1.1, 0.5, 0);
    lateralCartilage.rotation.x = Math.PI;
    articularCartilage.add(lateralCartilage);
    
    femur.add(articularCartilage);

    // Ligament anchor points
    const aclFemurPt = new THREE.Vector3(0.3, 0.5, -0.5);
    const aclTibiaPt = new THREE.Vector3(0, 0, 0.6);

    const pclFemurPt = new THREE.Vector3(-0.3, 0.5, 0.3);
    const pclTibiaPt = new THREE.Vector3(0, -0.2, -0.8);

    const mclFemurPt = new THREE.Vector3(-1.2, 1, 0);
    const mclTibiaPt = new THREE.Vector3(-1.1, -1.5, 0);

    const lclFemurPt = new THREE.Vector3(1.2, 1, 0);
    const lclTibiaPt = new THREE.Vector3(1.6, -1.5, -0.5);

    function updateLigament(ligament, ptA, ptB) {
        const distance = ptA.distanceTo(ptB);
        ligament.position.copy(ptA);
        ligament.scale.set(1, distance, 1);
        
        const dir = new THREE.Vector3().subVectors(ptB, ptA).normalize();
        const axis = new THREE.Vector3(0, 1, 0);
        ligament.quaternion.setFromUnitVectors(axis, dir);
    }

    // Kinematics Animation loop
    group.tick = (time) => {
        // Flexion up to ~120 degrees
        const angle = (Math.sin(time) + 1) * 0.5 * (120 * Math.PI / 180);
        tibiaGroup.rotation.x = angle; 
        
        tibiaGroup.updateMatrixWorld();

        const currentAclTibiaPt = aclTibiaPt.clone().applyMatrix4(tibiaGroup.matrix);
        const currentPclTibiaPt = pclTibiaPt.clone().applyMatrix4(tibiaGroup.matrix);
        const currentMclTibiaPt = mclTibiaPt.clone().applyMatrix4(tibiaGroup.matrix);
        const currentLclTibiaPt = lclTibiaPt.clone().applyMatrix4(tibiaGroup.matrix);

        updateLigament(acl, aclFemurPt, currentAclTibiaPt);
        updateLigament(pcl, pclFemurPt, currentPclTibiaPt);
        updateLigament(mcl, mclFemurPt, currentMclTibiaPt);
        updateLigament(lcl, lclFemurPt, currentLclTibiaPt);

        // Patella tracking
        const patellaY = 1.5 - (angle / (120 * Math.PI / 180)) * 1.5;
        const patellaZ = 1.3 - (angle / (120 * Math.PI / 180)) * 0.3;
        patella.position.set(0, patellaY, patellaZ);
        patella.rotation.x = angle * 0.3;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "Which bone is the primary weight-bearing bone of the lower leg?",
            options: ["Femur", "Fibula", "Tibia", "Patella"],
            answer: 2
        },
        {
            question: "What ligament prevents the tibia from sliding out in front of the femur?",
            options: ["LCL", "PCL", "ACL", "MCL"],
            answer: 2
        },
        {
            question: "Which structure acts as a shock absorber between the femur and tibia?",
            options: ["Patella", "Meniscus", "Cartilage", "Bursa"],
            answer: 1
        },
        {
            question: "What is the anatomical term for the kneecap?",
            options: ["Tibia", "Fibula", "Meniscus", "Patella"],
            answer: 3
        },
        {
            question: "Which ligament connects the femur to the fibula?",
            options: ["LCL", "MCL", "ACL", "PCL"],
            answer: 0
        },
        {
            question: "What tissue covers the ends of the bones to reduce friction in the joint?",
            options: ["Ligament", "Tendon", "Meniscus", "Articular Cartilage"],
            answer: 3
        }
    ];

    return group;
}
