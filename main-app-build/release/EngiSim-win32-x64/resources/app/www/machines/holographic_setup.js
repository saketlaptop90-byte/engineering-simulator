export function createHolographicSetup(THREE) {
    const group = new THREE.Group();

    // 1. Isolation Table
    const tableGeo = new THREE.BoxGeometry(10, 0.5, 8);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x223322 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(-1, -0.25, -0.5);
    table.userData.partName = 'Isolation Table';
    group.add(table);

    // 2. Laser Source
    const laserGeo = new THREE.BoxGeometry(1.5, 1, 2);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(-4, 0.5, 2.5);
    laser.userData.partName = 'Laser Source';
    group.add(laser);

    // 3. Beam Splitter
    const splitterGeo = new THREE.BoxGeometry(0.8, 0.8, 0.05);
    const splitterMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
    const splitter = new THREE.Mesh(splitterGeo, splitterMat);
    splitter.position.set(-4, 0.5, 0);
    splitter.rotation.y = -Math.PI / 4;
    splitter.userData.partName = 'Beam Splitter';
    group.add(splitter);

    // 4. Reference Mirror
    const mirrorGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.9, roughness: 0.1 });
    const refMirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    refMirror.position.set(-4, 0.5, -3);
    refMirror.rotation.y = Math.PI / 4;
    refMirror.userData.partName = 'Reference Mirror';
    group.add(refMirror);

    // 5. Object Mirror
    const objMirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    objMirror.position.set(2, 0.5, 0);
    objMirror.rotation.y = -Math.PI / 4;
    objMirror.userData.partName = 'Object Mirror';
    group.add(objMirror);

    // 6. Reference Beam Expander
    const expanderGeo = new THREE.CylinderGeometry(0.3, 0.1, 0.6, 16);
    const expanderMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const refExpander = new THREE.Mesh(expanderGeo, expanderMat);
    refExpander.position.set(-1.5, 0.5, -3);
    refExpander.rotation.z = -Math.PI / 2;
    refExpander.userData.partName = 'Reference Beam Expander';
    group.add(refExpander);

    // 7. Object Beam Expander
    const objExpander = new THREE.Mesh(expanderGeo, expanderMat);
    objExpander.position.set(2, 0.5, -1);
    objExpander.rotation.x = -Math.PI / 2;
    objExpander.userData.partName = 'Object Beam Expander';
    group.add(objExpander);

    // 8. Target Object
    const targetGeo = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
    const targetMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.5, roughness: 0.2 });
    const targetObj = new THREE.Mesh(targetGeo, targetMat);
    targetObj.position.set(2, 0.5, -2);
    targetObj.userData.partName = 'Target Object';
    group.add(targetObj);

    // 9. Photographic Plate
    const plateGeo = new THREE.BoxGeometry(1.5, 1.5, 0.05);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x224422, transparent: true, opacity: 0.8 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(2, 0.5, -3);
    plate.rotation.y = -Math.PI / 4;
    plate.userData.partName = 'Photographic Plate';
    group.add(plate);

    // 10. Coherent Light Paths
    const pathsGroup = new THREE.Group();
    pathsGroup.userData.partName = 'Coherent Light Paths';

    const laserMatSolid = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 });
    const laserMatTrans = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide });

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8), laserMatSolid);
    p1.position.set(-4, 0.5, 0.75);
    p1.rotation.x = Math.PI / 2;
    pathsGroup.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 8), laserMatSolid);
    p2.position.set(-4, 0.5, -1.5);
    p2.rotation.x = Math.PI / 2;
    pathsGroup.add(p2);

    const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 6, 8), laserMatSolid);
    p3.position.set(-1, 0.5, 0);
    p3.rotation.z = Math.PI / 2;
    pathsGroup.add(p3);

    const p4 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8), laserMatSolid);
    p4.position.set(-2.75, 0.5, -3);
    p4.rotation.z = Math.PI / 2;
    pathsGroup.add(p4);

    const p5 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8), laserMatSolid);
    p5.position.set(2, 0.5, -0.5);
    p5.rotation.x = Math.PI / 2;
    pathsGroup.add(p5);

    const p6 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.02, 3.5, 16, 1, true), laserMatTrans);
    p6.position.set(0.25, 0.5, -3);
    p6.rotation.z = -Math.PI / 2;
    pathsGroup.add(p6);

    const p7 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.02, 1.0, 16, 1, true), laserMatTrans);
    p7.position.set(2, 0.5, -1.5);
    p7.rotation.x = -Math.PI / 2;
    pathsGroup.add(p7);

    const p8 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.2, 1.0, 16, 1, true), laserMatTrans);
    p8.position.set(2, 0.5, -2.5);
    p8.rotation.x = -Math.PI / 2;
    pathsGroup.add(p8);

    pathsGroup.children.forEach(c => c.userData.partName = 'Coherent Light Paths');
    group.add(pathsGroup);

    group.update = (time) => {
        targetObj.rotation.x = time * 0.5;
        targetObj.rotation.y = time * 0.3;
        
        laserMatSolid.opacity = 0.6 + Math.sin(time * 5) * 0.2;
        laserMatTrans.opacity = 0.2 + Math.sin(time * 5) * 0.1;
        
        plateMat.color.setHSL(0.33, 1, 0.2 + Math.sin(time * 10) * 0.1);
    };

    group.userData.quiz = [
        {
            question: "What is the primary role of the Beam Splitter in a holographic setup?",
            options: [
                "To divide the laser beam into an object beam and a reference beam",
                "To change the frequency and color of the laser",
                "To combine two separate lasers into a single beam",
                "To absorb excess light that might ruin the hologram"
            ],
            correctAnswer: 0
        },
        {
            question: "Why is an Isolation Table necessary for recording holograms?",
            options: [
                "To prevent microscopic vibrations from ruining the interference pattern",
                "To keep the optical components completely isolated from ambient light",
                "To provide electrical grounding for the high-power lasers",
                "To thermally insulate the photographic plate during exposure"
            ],
            correctAnswer: 0
        },
        {
            question: "What does the Reference Beam do?",
            options: [
                "It shines directly on the plate to interfere with the object beam",
                "It illuminates the target object from behind",
                "It measures the exact distance to the target object",
                "It heats the photographic emulsion to prepare it for recording"
            ],
            correctAnswer: 0
        },
        {
            question: "How does the Object Beam differ from the Reference Beam when they meet at the plate?",
            options: [
                "The object beam has been scattered by the target, carrying its spatial information",
                "The object beam is shifted to a completely different wavelength",
                "The object beam travels significantly faster than the reference beam",
                "The object beam is entirely unpolarized"
            ],
            correctAnswer: 0
        },
        {
            question: "What exactly is recorded on the Photographic Plate to make a hologram?",
            options: [
                "An interference pattern of light waves",
                "A standard two-dimensional photograph of the object",
                "The distinct shadows cast by the target object",
                "A digital depth map of the target object"
            ],
            correctAnswer: 0
        },
        {
            question: "Why must a coherent light source (like a laser) be used?",
            options: [
                "The light waves must be in phase to produce a stable interference pattern",
                "Lasers are the only light sources bright enough for the exposure",
                "Coherent light prevents the photographic plate from overheating",
                "Coherent light travels faster, making the recording process instantaneous"
            ],
            correctAnswer: 0
        }
    ];

    return group;
}
