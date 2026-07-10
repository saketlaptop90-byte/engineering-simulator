export function createInnerEar(THREE) {
    const group = new THREE.Group();

    // Materials
    const membraneMat = new THREE.MeshPhongMaterial({ color: 0xffddcc, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const cochleaMat = new THREE.MeshPhongMaterial({ color: 0xcc99aa, shininess: 30 });
    const nerveMat = new THREE.MeshPhongMaterial({ color: 0xffff33 });
    const tubeMat = new THREE.MeshPhongMaterial({ color: 0xaa6666 });
    const windowMat = new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });

    // 1. Tympanic Membrane (Eardrum)
    const tmGeom = new THREE.CylinderGeometry(2, 2, 0.1, 32);
    const tympanicMembrane = new THREE.Mesh(tmGeom, membraneMat);
    tympanicMembrane.rotation.z = Math.PI / 2;
    tympanicMembrane.rotation.y = 0.2;
    tympanicMembrane.position.set(-8, 0, 0);
    group.add(tympanicMembrane);

    // 2. Malleus (Hammer)
    const malleusGroup = new THREE.Group();
    const handleGeom = new THREE.CylinderGeometry(0.2, 0.1, 2.5);
    const handle = new THREE.Mesh(handleGeom, boneMat);
    handle.position.set(0.5, 1, 0);
    handle.rotation.z = -Math.PI / 4;
    const headGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const head = new THREE.Mesh(headGeom, boneMat);
    head.position.set(1.5, 2, 0);
    malleusGroup.add(handle);
    malleusGroup.add(head);
    malleusGroup.position.set(-7.5, 0, 0);
    group.add(malleusGroup);

    // 3. Incus (Anvil)
    const incusGroup = new THREE.Group();
    const bodyGeom = new THREE.BoxGeometry(1.2, 1.2, 1);
    const body = new THREE.Mesh(bodyGeom, boneMat);
    const longProcessGeom = new THREE.CylinderGeometry(0.15, 0.1, 2);
    const longProcess = new THREE.Mesh(longProcessGeom, boneMat);
    longProcess.position.set(0, -1.2, 0.5);
    longProcess.rotation.x = Math.PI / 6;
    incusGroup.add(body);
    incusGroup.add(longProcess);
    incusGroup.position.set(-5.5, 2, 0);
    group.add(incusGroup);

    // 4. Stapes (Stirrup)
    const stapesGroup = new THREE.Group();
    const archGeom = new THREE.TorusGeometry(0.5, 0.1, 8, 16, Math.PI);
    const arch = new THREE.Mesh(archGeom, boneMat);
    arch.rotation.y = Math.PI / 2;
    const baseGeom = new THREE.BoxGeometry(0.1, 1.2, 0.8);
    const base = new THREE.Mesh(baseGeom, boneMat);
    base.position.set(0.5, 0, 0);
    stapesGroup.add(arch);
    stapesGroup.add(base);
    stapesGroup.position.set(-4.5, 0.8, 0.5);
    group.add(stapesGroup);

    // 5. Cochlea
    const cochleaGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const radius = 1.5 - i * 0.4;
        const tube = 0.4 - i * 0.08;
        const spiralGeom = new THREE.TorusGeometry(radius, tube, 16, 32, Math.PI * 1.8);
        const spiral = new THREE.Mesh(spiralGeom, cochleaMat);
        spiral.position.set(0, 0, i * 0.6);
        spiral.rotation.z = i;
        cochleaGroup.add(spiral);
    }
    const cochleaBase = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 16), cochleaMat);
    cochleaBase.position.set(0, 0, -1);
    cochleaGroup.add(cochleaBase);
    cochleaGroup.position.set(-1, 0, 0);
    group.add(cochleaGroup);

    // 6. Semicircular Canals
    const canalsGroup = new THREE.Group();
    const c1Geom = new THREE.TorusGeometry(1.2, 0.15, 8, 32, Math.PI);
    const c1 = new THREE.Mesh(c1Geom, cochleaMat);
    c1.position.set(0, 1.2, 0);

    const c2Geom = new THREE.TorusGeometry(1.2, 0.15, 8, 32, Math.PI);
    const c2 = new THREE.Mesh(c2Geom, cochleaMat);
    c2.rotation.y = Math.PI / 2;
    c2.position.set(1.2, 0, 0);

    const c3Geom = new THREE.TorusGeometry(1.2, 0.15, 8, 32, Math.PI);
    const c3 = new THREE.Mesh(c3Geom, cochleaMat);
    c3.rotation.x = Math.PI / 2;
    c3.position.set(0, 0, -1.2);

    canalsGroup.add(c1);
    canalsGroup.add(c2);
    canalsGroup.add(c3);
    canalsGroup.position.set(-1, 2.5, -1);
    group.add(canalsGroup);

    // 7. Auditory Nerve
    const nerveGeom = new THREE.CylinderGeometry(0.6, 0.6, 4, 16);
    const auditoryNerve = new THREE.Mesh(nerveGeom, nerveMat);
    auditoryNerve.rotation.z = Math.PI / 2;
    auditoryNerve.position.set(2.5, 0, 1);
    group.add(auditoryNerve);

    // 8. Eustachian Tube
    const eustachianGeom = new THREE.CylinderGeometry(0.4, 0.3, 5, 16);
    const eustachianTube = new THREE.Mesh(eustachianGeom, tubeMat);
    eustachianTube.position.set(-4, -3, 0);
    eustachianTube.rotation.z = -Math.PI / 4;
    group.add(eustachianTube);

    // 9. Oval Window
    const ovalWindowGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);
    const ovalWindow = new THREE.Mesh(ovalWindowGeom, windowMat);
    ovalWindow.rotation.z = Math.PI / 2;
    ovalWindow.position.set(-3.5, 0.8, 0.5);
    group.add(ovalWindow);

    // 10. Round Window
    const roundWindowGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16);
    const roundWindow = new THREE.Mesh(roundWindowGeom, windowMat);
    roundWindow.rotation.z = Math.PI / 2;
    roundWindow.position.set(-3.5, -0.5, 0.5);
    group.add(roundWindow);

    // Initial positions for animation
    const tmBaseX = tympanicMembrane.position.x;
    const malBaseX = malleusGroup.position.x;
    const malBaseRotZ = malleusGroup.rotation.z;
    const incBaseRotZ = incusGroup.rotation.z;
    const staBaseX = stapesGroup.position.x;
    const ovalBaseX = ovalWindow.position.x;
    const roundBaseX = roundWindow.position.x;

    group.tick = (time) => {
        // High frequency vibration simulating sound wave (slowed down for visibility)
        const freq = time * 10;
        const amplitude = 0.2;
        const vibration = Math.sin(freq) * amplitude;
        
        // Sound wave hits Tympanic Membrane
        tympanicMembrane.position.x = tmBaseX + vibration;

        // Malleus follows membrane
        malleusGroup.rotation.z = malBaseRotZ + vibration * 0.5;

        // Incus is articulated with Malleus
        incusGroup.rotation.z = incBaseRotZ - vibration * 0.3;

        // Stapes is pushed by Incus into the Oval Window
        stapesGroup.position.x = staBaseX + vibration * 0.8;

        // Oval Window bulges inward
        ovalWindow.position.x = ovalBaseX + vibration * 0.8;

        // Round Window bulges outward (phase inverted) due to incompressible fluid
        roundWindow.position.x = roundBaseX - vibration * 0.8;

        // Cilia in cochlea could be animated, but cochlea itself can pulse slightly
        cochleaGroup.scale.set(
            1 + vibration * 0.05,
            1 + vibration * 0.05,
            1 + vibration * 0.05
        );
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the Tympanic Membrane?",
            options: [
                "To produce earwax",
                "To vibrate in response to sound waves",
                "To balance the body",
                "To connect to the brain directly"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of the ossicles is also known as the stirrup?",
            options: [
                "Malleus",
                "Incus",
                "Stapes",
                "Cochlea"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the main function of the Cochlea?",
            options: [
                "To amplify sound mechanically",
                "To convert vibrations into electrical nerve impulses",
                "To equalize air pressure",
                "To detect angular acceleration"
            ],
            correctAnswer: 1
        },
        {
            question: "What role do the Semicircular Canals play?",
            options: [
                "Hearing high frequencies",
                "Maintaining balance and spatial orientation",
                "Protecting the inner ear",
                "Draining fluid to the throat"
            ],
            correctAnswer: 1
        },
        {
            question: "What does the Eustachian Tube connect the middle ear to?",
            options: [
                "The brain",
                "The outer ear",
                "The nasopharynx (back of the throat)",
                "The auditory nerve"
            ],
            correctAnswer: 2
        },
        {
            question: "Why does the Round Window bulge outward when the Oval Window is pushed inward?",
            options: [
                "Because of air pressure from the lungs",
                "Because the fluid in the cochlea is incompressible",
                "Because of magnetic repulsion",
                "To pull the stapes back out"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
