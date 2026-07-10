export function createElectromagneticRelay(THREE) {
    const group = new THREE.Group();

    // Materials
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.5 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.3 });
    const springMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 });
    const plasticMat = new THREE.MeshPhysicalMaterial({ color: 0xaaddff, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 });
    const basePlasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    // 1. Yoke (L-shaped iron frame that forms the magnetic circuit base)
    const yokeGroup = new THREE.Group();
    const yokeBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 4), ironMat);
    yokeBase.position.set(0, -2.2, 0);
    const yokeVertical = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.4, 4), ironMat);
    yokeVertical.position.set(-2.8, 0, 0);
    yokeGroup.add(yokeBase, yokeVertical);
    group.add(yokeGroup);

    // Insulation base under yoke
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 4.5), basePlasticMat);
    basePlate.position.set(0, -2.6, 0);
    group.add(basePlate);

    // 2. Iron Core (Concentrates the magnetic field)
    const coreGeom = new THREE.CylinderGeometry(0.4, 0.4, 3.5, 16);
    const core = new THREE.Mesh(coreGeom, ironMat);
    core.rotation.z = Math.PI / 2;
    core.position.set(-1, -1, 0);
    group.add(core);

    // 3. Coil / Electromagnet (Wraps around the core)
    const coilGeom = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
    // Clone copper material so we can animate emissive properties independently
    const animCopperMat = copperMat.clone();
    const coil = new THREE.Mesh(coilGeom, animCopperMat);
    coil.rotation.z = Math.PI / 2;
    coil.position.set(-1, -1, 0);
    group.add(coil);

    // 4. Armature (Movable iron piece attracted by the core)
    const armatureGroup = new THREE.Group();
    armatureGroup.position.set(-2.8, 2.2, 0); // Pivot point at the top of the yoke
    const armatureBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 3), ironMat);
    armatureBody.position.set(2.25, 0, 0); // Offset so it pivots accurately
    armatureGroup.add(armatureBody);
    group.add(armatureGroup);

    // 5. Spring (Pulls the armature back when de-energized)
    const springGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 8);
    const spring = new THREE.Mesh(springGeom, springMat);
    spring.position.set(-0.5, 1.2, 1.5); 
    group.add(spring);

    // 6. Movable Contact (Attached to armature)
    const movableContactArm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.5), brassMat);
    movableContactArm.position.set(4.5, 0, 0);
    const movableContactPoint = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), silverMat);
    movableContactPoint.position.set(5.5, 0, 0);
    armatureGroup.add(movableContactArm, movableContactPoint);

    // 7. Normally Closed (NC) Contact (Fixed top position)
    const ncContactGroup = new THREE.Group();
    const ncContactArm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.5), brassMat);
    ncContactArm.position.set(2.2, 2.4, 0); // Above the movable contact
    const ncContactPoint = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), silverMat);
    ncContactPoint.position.set(2.7, 2.3, 0);
    ncContactGroup.add(ncContactArm, ncContactPoint);
    group.add(ncContactGroup);

    // 8. Normally Open (NO) Contact (Fixed bottom position)
    const noContactGroup = new THREE.Group();
    const noContactArm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.5), brassMat);
    noContactArm.position.set(2.2, 1.8, 0); // Below the movable contact
    const noContactPoint = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), silverMat);
    noContactPoint.position.set(2.7, 1.9, 0);
    noContactGroup.add(noContactArm, noContactPoint);
    group.add(noContactGroup);

    // 9. Terminal Pins (For PCB mounting or wiring)
    const pinsGroup = new THREE.Group();
    const pinPositions = [
        [-2, -3.2, 1], [-2, -3.2, -1], // Coil pins
        [2, -3.2, 0],                  // Common (movable) pin
        [3, -3.2, 1],                  // NO pin
        [3, -3.2, -1]                  // NC pin
    ];
    pinPositions.forEach(pos => {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), brassMat);
        pin.position.set(pos[0], pos[1], pos[2]);
        pinsGroup.add(pin);
    });
    group.add(pinsGroup);

    // 10. Plastic Casing (Protects the internal components)
    const casing = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 4.5), plasticMat);
    casing.position.set(0, 0.4, 0);
    group.add(casing);

    // Add lighting for internal components
    const pointLight = new THREE.PointLight(0xffaa00, 0, 5);
    pointLight.position.set(-1, -1, 0);
    group.add(pointLight);

    let time = 0;

    return {
        mesh: group,
        update: function(delta) {
            time += delta;
            
            // State Machine: 4 seconds total cycle (2s OFF, 2s ON)
            const cycle = time % 4;
            const energized = cycle > 2;

            // Target rotation for the armature pivot
            // Resting state: 0 rad (touching NC)
            // Energized state: -0.12 rad (attracted to core, touching NO)
            const targetRotation = energized ? -0.12 : 0;
            
            // Smoothly interpolate the armature movement
            armatureGroup.rotation.z = THREE.MathUtils.lerp(armatureGroup.rotation.z, targetRotation, 10 * delta);

            // Animate coil to simulate magnetic flux / current flow
            if (energized) {
                animCopperMat.emissive.setHex(0x662200);
                pointLight.intensity = 1.5; // Simulate a glowing indicator of energy
            } else {
                animCopperMat.emissive.setHex(0x000000);
                pointLight.intensity = 0;
            }

            // Animate the return spring stretching/compressing based on armature rotation
            spring.scale.y = 1 + (armatureGroup.rotation.z * -1.5);
            spring.position.y = 1.2 + (armatureGroup.rotation.z * 0.7); // Shift midpoint slightly
        },
        quiz: [
            {
                question: "What generates the magnetic field in an electromagnetic relay?",
                options: [
                    "The iron core alone",
                    "The return spring",
                    "The coil (electromagnet) when current flows through it",
                    "The movable contact"
                ],
                correctAnswer: 2
            },
            {
                question: "What is the primary function of the armature?",
                options: [
                    "To generate electrical power",
                    "To act as a movable lever that toggles the switch contacts when attracted by the magnetic field",
                    "To insulate the coil from the core",
                    "To keep the relay cool during operation"
                ],
                correctAnswer: 1
            },
            {
                question: "In relay terminology, what does 'NO' stand for?",
                options: [
                    "Normally Open (circuit is open when unenergized)",
                    "Never Opens (circuit cannot be broken)",
                    "Negative Output",
                    "Neutral Oscillation"
                ],
                correctAnswer: 0
            },
            {
                question: "What role does the spring play in the relay mechanism?",
                options: [
                    "It conducts the high voltage to the contacts",
                    "It generates the magnetic field",
                    "It returns the armature to its resting (de-energized) position",
                    "It connects the NO and NC terminals together"
                ],
                correctAnswer: 2
            },
            {
                question: "Why are relays heavily utilized in control circuits?",
                options: [
                    "To eliminate the need for wiring",
                    "To increase the resistance of a circuit",
                    "To allow a low-power control signal to safely switch a high-power load circuit",
                    "To convert direct current into alternating current"
                ],
                correctAnswer: 2
            },
            {
                question: "How does an electromagnetic relay provide electrical isolation?",
                options: [
                    "By using a transformer step-down mechanism",
                    "Through physical separation; there is no direct electrical connection between the control coil and the load contacts",
                    "By housing the components inside a plastic casing",
                    "By using highly conductive gold contacts"
                ],
                correctAnswer: 1
            }
        ]
    };
}
