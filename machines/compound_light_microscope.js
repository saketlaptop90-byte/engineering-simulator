export function createCompoundLightMicroscope(THREE) {
    const group = new THREE.Group();

    // 1. Base & Arm
    const baseShape = new THREE.Shape();
    baseShape.moveTo(3, 0);
    baseShape.lineTo(3, 1);
    baseShape.lineTo(-1, 1);
    baseShape.lineTo(-1, 6.5);
    baseShape.lineTo(2, 6.5);
    baseShape.lineTo(2, 7.5);
    baseShape.lineTo(-2, 7.5);
    baseShape.lineTo(-2, 1);
    baseShape.lineTo(-3, 1);
    baseShape.lineTo(-3, 0);
    baseShape.lineTo(3, 0);

    const baseExtrudeSettings = { depth: 2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeo.translate(0, 0, -1);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.name = "Base";
    baseMesh.userData = { 
        id: 'base', 
        name: 'Base & Arm', 
        description: 'The structural support of the microscope, housing the illuminator and acting as a handle.' 
    };
    group.add(baseMesh);

    // 2. Light Source
    const lightGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 32);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, emissive: 0xffffff, emissiveIntensity: 0.6 });
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.position.set(1.5, 1.2, 0);
    lightMesh.name = "Light_Source";
    lightMesh.userData = { 
        id: 'light_source', 
        name: 'Light Source', 
        description: 'Provides the light needed to view the specimen.' 
    };
    group.add(lightMesh);

    // 3. Iris Diaphragm
    const irisGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.position.set(1.5, 2.9, 0);
    irisMesh.name = "Iris_Diaphragm";
    irisMesh.userData = { 
        id: 'iris_diaphragm', 
        name: 'Iris Diaphragm', 
        description: 'Controls the amount of light reaching the specimen.' 
    };
    group.add(irisMesh);

    // 4. Condenser
    const condenserGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.4, 32);
    const condenserMat = new THREE.MeshStandardMaterial({ color: 0x34495e });
    const condenserMesh = new THREE.Mesh(condenserGeo, condenserMat);
    condenserMesh.position.set(1.5, 3.2, 0);
    condenserMesh.name = "Condenser";
    condenserMesh.userData = { 
        id: 'condenser', 
        name: 'Condenser', 
        description: 'Focuses light through the specimen.' 
    };
    group.add(condenserMesh);

    // 5. Stage
    const stageGeo = new THREE.BoxGeometry(3, 0.1, 2.5);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(0.5, 3.5, 0);
    stageMesh.name = "Stage";
    stageMesh.userData = { 
        id: 'stage', 
        name: 'Stage', 
        description: 'The flat platform where slides are placed.' 
    };
    group.add(stageMesh);

    // 6. Revolving Nosepiece
    const nosepieceGeo = new THREE.CylinderGeometry(1.0, 0.8, 0.4, 32);
    const nosepieceMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.5, roughness: 0.4 });
    const nosepieceMesh = new THREE.Mesh(nosepieceGeo, nosepieceMat);
    nosepieceMesh.position.set(1.5, 6.3, 0);
    nosepieceMesh.name = "Revolving_Nosepiece";
    nosepieceMesh.userData = { 
        id: 'revolving_nosepiece', 
        name: 'Revolving Nosepiece', 
        description: 'Holds objective lenses and rotates to change magnification.' 
    };
    group.add(nosepieceMesh);

    // 7. Objective Lenses
    const objectiveGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const objectiveMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const objectiveMesh = new THREE.Mesh(objectiveGeo, objectiveMat);

    const lensGeo1 = new THREE.CylinderGeometry(0.15, 0.2, 1.0, 16);
    const lens1 = new THREE.Mesh(lensGeo1, objectiveMat);
    lens1.position.set(0.6, -0.5, 0);
    objectiveMesh.add(lens1);

    const lensGeo2 = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 16);
    const lens2 = new THREE.Mesh(lensGeo2, objectiveMat);
    lens2.position.set(-0.3, -0.75, 0.52);
    objectiveMesh.add(lens2);

    const lensGeo3 = new THREE.CylinderGeometry(0.15, 0.2, 2.0, 16);
    const lens3 = new THREE.Mesh(lensGeo3, objectiveMat);
    lens3.position.set(-0.3, -1.0, -0.52);
    objectiveMesh.add(lens3);

    objectiveMesh.position.set(1.5, 6.1, 0);
    objectiveMesh.name = "Objective_Lenses";
    objectiveMesh.userData = { 
        id: 'objective_lenses', 
        name: 'Objective Lenses', 
        description: 'Primary lenses providing various levels of magnification.' 
    };
    group.add(objectiveMesh);

    // 8. Coarse Adjustment Knob
    const coarseGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    coarseGeo.rotateX(Math.PI / 2);
    const coarseMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const coarseMesh = new THREE.Mesh(coarseGeo, coarseMat);
    coarseMesh.position.set(-1.5, 2.5, 0);
    coarseMesh.name = "Coarse_Adjustment_Knob";
    coarseMesh.userData = { 
        id: 'coarse_knob', 
        name: 'Coarse Adjustment Knob', 
        description: 'Moves the stage to bring the specimen into general focus.' 
    };
    group.add(coarseMesh);

    // 9. Fine Adjustment Knob
    const fineGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.6, 32);
    fineGeo.rotateX(Math.PI / 2);
    const fineMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const fineMesh = new THREE.Mesh(fineGeo, fineMat);
    fineMesh.position.set(-1.5, 2.5, 0);
    fineMesh.name = "Fine_Adjustment_Knob";
    fineMesh.userData = { 
        id: 'fine_knob', 
        name: 'Fine Adjustment Knob', 
        description: 'Fine-tunes the focus and increases the detail of the specimen.' 
    };
    group.add(fineMesh);

    // 10. Eyepiece
    const eyepieceGeo = new THREE.CylinderGeometry(0.2, 0.25, 2, 32);
    const eyepieceMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3 });
    const eyepieceMesh = new THREE.Mesh(eyepieceGeo, eyepieceMat);
    eyepieceMesh.position.set(2.0, 8.366, 0);
    eyepieceMesh.rotation.z = -Math.PI / 6;
    eyepieceMesh.name = "Eyepiece";
    eyepieceMesh.userData = { 
        id: 'eyepiece', 
        name: 'Eyepiece', 
        description: 'The lens you look through, usually magnifying by 10x.' 
    };
    group.add(eyepieceMesh);

    // Animation
    group.tick = (time) => {
        nosepieceMesh.rotation.y = time * 0.5;
        objectiveMesh.rotation.y = time * 0.5;
        stageMesh.position.y = 3.5 + Math.sin(time * 2) * 0.05;
        coarseMesh.rotation.z = time * 2;
        fineMesh.rotation.z = time * 2;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "Which part of the microscope controls the amount of light reaching the specimen?",
            options: ["Iris Diaphragm", "Condenser", "Stage", "Fine Adjustment Knob"],
            correctAnswer: 0
        },
        {
            question: "What is the function of the Coarse Adjustment Knob?",
            options: ["Controls light intensity", "Holds the specimen", "Moves the stage up and down for initial focusing", "Changes the magnification"],
            correctAnswer: 2
        },
        {
            question: "Which component holds two or more objective lenses and can be rotated?",
            options: ["Eyepiece", "Revolving Nosepiece", "Stage", "Base"],
            correctAnswer: 1
        },
        {
            question: "What does the Condenser do?",
            options: ["Focuses light through the specimen", "Magnifies the image", "Moves the slide", "Provides structural support"],
            correctAnswer: 0
        },
        {
            question: "Where do you place the slide containing the specimen?",
            options: ["Revolving Nosepiece", "Stage", "Light Source", "Eyepiece"],
            correctAnswer: 1
        },
        {
            question: "Which lens do you look directly through?",
            options: ["Objective Lens", "Condenser Lens", "Eyepiece", "Iris Lens"],
            correctAnswer: 2
        }
    ];

    return group;
}
