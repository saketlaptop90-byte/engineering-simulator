export function createTrilobiteAnatomy(THREE) {
    const group = new THREE.Group();

    // Materials
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.8, metalness: 0.1 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2e2318, roughness: 0.9 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    const sutureMat = new THREE.MeshStandardMaterial({ color: 0x3a2b1c, roughness: 0.9 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });

    // 1. Cephalon (Head shield)
    const cephalonGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI, 0, Math.PI/2);
    cephalonGeo.scale(1, 0.4, 0.8);
    const cephalonMesh = new THREE.Mesh(cephalonGeo, shellMat);
    cephalonMesh.position.set(0, 0.2, 1.8);
    cephalonMesh.name = "Cephalon";
    group.add(cephalonMesh);

    // 2. Glabella (Central bulge on head)
    const glabellaGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI*2, 0, Math.PI/2);
    glabellaGeo.scale(0.8, 0.5, 1.4);
    const glabellaMesh = new THREE.Mesh(glabellaGeo, shellMat);
    glabellaMesh.position.set(0, 0.4, 2.3);
    glabellaMesh.name = "Glabella";
    group.add(glabellaMesh);

    // 3. CompoundEyes (InstancedMesh)
    const eyeGeo = new THREE.SphereGeometry(0.25, 16, 16);
    eyeGeo.scale(1, 0.6, 1.5);
    const eyesMesh = new THREE.InstancedMesh(eyeGeo, eyeMat, 2);
    eyesMesh.name = "CompoundEyes";
    
    const dummy = new THREE.Object3D();
    dummy.position.set(-1.0, 0.45, 2.3);
    dummy.rotation.set(0, 0.3, 0);
    dummy.updateMatrix();
    eyesMesh.setMatrixAt(0, dummy.matrix);
    
    dummy.position.set(1.0, 0.45, 2.3);
    dummy.rotation.set(0, -0.3, 0);
    dummy.updateMatrix();
    eyesMesh.setMatrixAt(1, dummy.matrix);
    group.add(eyesMesh);

    // 4. FacialSuture (Mesh)
    const sutureGeo = new THREE.TorusGeometry(1.3, 0.03, 8, 32, Math.PI);
    const sutureMesh = new THREE.Mesh(sutureGeo, sutureMat);
    sutureMesh.rotation.x = -Math.PI / 2;
    sutureMesh.position.set(0, 0.6, 1.8);
    sutureMesh.name = "FacialSuture";
    group.add(sutureMesh);

    // 5. Thorax (Mesh - base)
    const thoraxGeo = new THREE.BoxGeometry(3.2, 0.1, 4.6);
    const thoraxMesh = new THREE.Mesh(thoraxGeo, bodyMat);
    thoraxMesh.position.set(0, 0.1, -0.5);
    thoraxMesh.name = "Thorax";
    group.add(thoraxMesh);

    // 6. PleuralLobes (InstancedMesh)
    const pleuralGeo = new THREE.BoxGeometry(1.2, 0.15, 0.4);
    const pleuralMesh = new THREE.InstancedMesh(pleuralGeo, shellMat, 20);
    pleuralMesh.name = "PleuralLobes";
    for (let i = 0; i < 10; i++) {
        let z = 1.57 - i * 0.46;
        // Left
        dummy.position.set(-1.0, 0.2, z);
        dummy.rotation.set(0, 0, 0.15); // angle down
        dummy.updateMatrix();
        pleuralMesh.setMatrixAt(i * 2, dummy.matrix);
        // Right
        dummy.position.set(1.0, 0.2, z);
        dummy.rotation.set(0, 0, -0.15);
        dummy.updateMatrix();
        pleuralMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    group.add(pleuralMesh);

    // 7. AxialLobe (InstancedMesh)
    const axialGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16);
    axialGeo.rotateZ(Math.PI / 2);
    const axialMesh = new THREE.InstancedMesh(axialGeo, shellMat, 10);
    axialMesh.name = "AxialLobe";
    for (let i = 0; i < 10; i++) {
        let z = 1.57 - i * 0.46;
        dummy.position.set(0, 0.3, z);
        dummy.scale.set(1, 0.6, 0.4);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        axialMesh.setMatrixAt(i, dummy.matrix);
    }
    group.add(axialMesh);

    // 8. Pygidium (Tail shield)
    const pygidiumGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI, 0, Math.PI/2);
    pygidiumGeo.scale(1, 0.3, 0.8);
    const pygidiumMesh = new THREE.Mesh(pygidiumGeo, shellMat);
    pygidiumMesh.rotation.y = Math.PI; // Point backward
    pygidiumMesh.position.set(0, 0.2, -2.8);
    pygidiumMesh.name = "Pygidium";
    group.add(pygidiumMesh);

    // 9. BiramousAppendages (InstancedMesh)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 1.2, 8);
    legGeo.translate(0, -0.6, 0); // pivot at top
    const appendagesMesh = new THREE.InstancedMesh(legGeo, legMat, 40);
    appendagesMesh.name = "BiramousAppendages";
    for(let i = 0; i < 20; i++) {
        let z = 2.4 - i * 0.305;
        dummy.position.set(-0.6, 0.1, z);
        dummy.rotation.set(0, 0, -0.3);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        appendagesMesh.setMatrixAt(i * 2, dummy.matrix);
        
        dummy.position.set(0.6, 0.1, z);
        dummy.rotation.set(0, 0, 0.3);
        dummy.updateMatrix();
        appendagesMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    group.add(appendagesMesh);

    // 10. Antennae (InstancedMesh)
    const antennaGeo = new THREE.CylinderGeometry(0.03, 0.01, 2.5, 8);
    antennaGeo.translate(0, 1.25, 0);
    const antennaeMesh = new THREE.InstancedMesh(antennaGeo, legMat, 2);
    antennaeMesh.name = "Antennae";
    
    dummy.position.set(-0.5, 0.1, 3.2);
    dummy.rotation.set(Math.PI/2, 0, 0.4);
    dummy.updateMatrix();
    antennaeMesh.setMatrixAt(0, dummy.matrix);
    
    dummy.position.set(0.5, 0.1, 3.2);
    dummy.rotation.set(Math.PI/2, 0, -0.4);
    dummy.updateMatrix();
    antennaeMesh.setMatrixAt(1, dummy.matrix);
    group.add(antennaeMesh);

    // Animation
    group.update = function(delta, time) {
        const timeSpeed = time * 5;
        
        // Update appendages for swimming/crawling motion
        for(let i = 0; i < 20; i++) {
            let z = 2.4 - i * 0.305;
            const angleOffset = i * 0.5;
            
            // Left leg
            dummy.position.set(-0.6, 0.1, z);
            const swingLeft = Math.sin(timeSpeed + angleOffset) * 0.4;
            dummy.rotation.set(swingLeft, 0, -0.3);
            dummy.updateMatrix();
            appendagesMesh.setMatrixAt(i * 2, dummy.matrix);
            
            // Right leg
            dummy.position.set(0.6, 0.1, z);
            const swingRight = Math.sin(timeSpeed + angleOffset + Math.PI) * 0.4;
            dummy.rotation.set(swingRight, 0, 0.3);
            dummy.updateMatrix();
            appendagesMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
        }
        appendagesMesh.instanceMatrix.needsUpdate = true;

        // Update antennae
        dummy.position.set(-0.5, 0.1, 3.2);
        dummy.rotation.set(Math.PI/2 - 0.2 + Math.sin(time * 2)*0.1, 0, 0.4 + Math.cos(time * 2)*0.1);
        dummy.updateMatrix();
        antennaeMesh.setMatrixAt(0, dummy.matrix);

        dummy.position.set(0.5, 0.1, 3.2);
        dummy.rotation.set(Math.PI/2 - 0.2 + Math.sin(time * 2 + 1)*0.1, 0, -0.4 - Math.cos(time * 2 + 1)*0.1);
        dummy.updateMatrix();
        antennaeMesh.setMatrixAt(1, dummy.matrix);
        antennaeMesh.instanceMatrix.needsUpdate = true;

        // Bob the whole body slightly
        group.position.y = Math.sin(time * 3) * 0.05;
        group.rotation.z = Math.sin(time * 2) * 0.02;
    };

    // Metadata & Quizzes
    group.metadata = {
        title: "Trilobite Anatomy",
        description: "Anatomy of an extinct marine arthropod, the Trilobite, highlighting its characteristic three-lobed structure.",
        quizzes: [
            {
                question: "What marine arthropods are trilobites classified as?",
                options: ["Arachnids", "Crustaceans", "Trilobitomorpha", "Chelicerata"],
                correctAnswer: 2
            },
            {
                question: "The trilobite body is divided into how many main sections (tagmata) longitudinally?",
                options: ["Two", "Three", "Four", "Five"],
                correctAnswer: 1
            },
            {
                question: "What is the head shield of a trilobite called?",
                options: ["Pygidium", "Cephalon", "Thorax", "Carapace"],
                correctAnswer: 1
            },
            {
                question: "Which part of the trilobite body is composed of flexible, articulated segments?",
                options: ["Cephalon", "Glabella", "Pygidium", "Thorax"],
                correctAnswer: 3
            },
            {
                question: "The tail shield of a trilobite is known as the:",
                options: ["Telson", "Pleura", "Pygidium", "Cephalon"],
                correctAnswer: 2
            },
            {
                question: "Trilobite eyes were unique because their lenses were primarily composed of:",
                options: ["Chitin", "Calcite", "Keratin", "Silica"],
                correctAnswer: 1
            }
        ]
    };

    return group;
}
