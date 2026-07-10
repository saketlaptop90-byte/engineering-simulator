export function createRelaySwitch(THREE) {
    const group = new THREE.Group();

    // 1. Base Plastic
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 0.2, 2.0),
        new THREE.MeshStandardMaterial({color: 0x222222})
    );
    base.position.set(0, 0.1, 0);
    base.name = "Base Plastic";
    group.add(base);

    // 2. Yoke
    const yoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.4, 0.5),
        new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.7, roughness: 0.3})
    );
    yoke.position.set(-0.9, 0.9, 0);
    yoke.name = "Yoke";
    group.add(yoke);

    // 3. Iron Core
    const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.2),
        new THREE.MeshStandardMaterial({color: 0x444444, metalness: 0.8, roughness: 0.3})
    );
    core.position.set(-0.3, 0.8, 0);
    core.name = "Iron Core";
    group.add(core);

    // 4. Electromagnetic Coil
    const coil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1.0),
        new THREE.MeshStandardMaterial({color: 0xb87333, roughness: 0.6})
    );
    coil.position.set(-0.3, 0.8, 0);
    coil.name = "Electromagnetic Coil";
    group.add(coil);

    // 5. Armature (Needs to pivot)
    const armaturePivot = new THREE.Group();
    armaturePivot.position.set(-0.9, 1.6, 0);
    group.add(armaturePivot);

    const armature = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.08, 0.5),
        new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.6, roughness: 0.4})
    );
    // Offset so the armature extends from the pivot point
    armature.position.set(0.7, 0, 0);
    armature.name = "Armature";
    armaturePivot.add(armature);

    // 6. Spring
    const spring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8, 10),
        new THREE.MeshStandardMaterial({color: 0xcccccc, wireframe: true})
    );
    spring.position.set(-0.7, 1.9, 0);
    spring.rotation.z = 0.2;
    spring.name = "Spring";
    group.add(spring);

    // 7. Common Terminal
    const commonTerminal = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.8, 0.3),
        new THREE.MeshStandardMaterial({color: 0xffd700, metalness: 0.8, roughness: 0.2})
    );
    commonTerminal.position.set(0.7, 0.6, 0);
    commonTerminal.name = "Common Terminal";
    group.add(commonTerminal);

    // 8. Normally Open Contact
    const noContact = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.3),
        new THREE.MeshStandardMaterial({color: 0xffaa00, metalness: 0.9, roughness: 0.1})
    );
    noContact.position.set(0.7, 1.4, 0);
    noContact.name = "Normally Open Contact";
    group.add(noContact);

    // 9. Normally Closed Contact
    const ncContact = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.3),
        new THREE.MeshStandardMaterial({color: 0xffaa00, metalness: 0.9, roughness: 0.1})
    );
    ncContact.position.set(0.7, 1.7, 0);
    ncContact.name = "Normally Closed Contact";
    group.add(ncContact);

    // 10. Clear Casing
    const clearCasing = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.2, 2.2),
        new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.25,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 0.1
        })
    );
    clearCasing.position.set(0, 1.2, 0);
    clearCasing.name = "Clear Casing";
    group.add(clearCasing);

    // Animation
    let time = 0;
    group.userData.update = (delta) => {
        time += delta;
        // Cycle 1s energized, 1s de-energized
        const isEnergized = (time % 2.0) < 1.0;

        // Rotate armature: snaps down when energized (towards core), up when not (towards NC contact)
        const targetAngle = isEnergized ? -0.12 : 0.08;
        armaturePivot.rotation.z += (targetAngle - armaturePivot.rotation.z) * 15 * delta;

        // Visual effect for coil: glows slightly when energized
        if (isEnergized) {
            coil.material.emissive.setHex(0x552200);
        } else {
            coil.material.emissive.setHex(0x000000);
        }
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of an electromechanical relay?",
            options: [
                "To generate electrical power",
                "To measure voltage in a circuit",
                "To control a high-power circuit using a low-power signal",
                "To permanently connect two wires"
            ],
            correctAnswer: 2
        },
        {
            question: "Which component generates a magnetic field when electric current passes through it?",
            options: [
                "Armature",
                "Electromagnetic Coil",
                "Spring",
                "Clear Casing"
            ],
            correctAnswer: 1
        },
        {
            question: "What pulls the armature back to its resting position when the coil is de-energized?",
            options: [
                "Gravity",
                "The normally open contact",
                "The spring",
                "Magnetic repulsion"
            ],
            correctAnswer: 2
        },
        {
            question: "Which contact is connected to the common terminal when the relay is NOT energized?",
            options: [
                "Normally Closed (NC) Contact",
                "Normally Open (NO) Contact",
                "Electromagnetic Coil",
                "Iron Core"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the Iron Core inside the coil?",
            options: [
                "To insulate the coil wires",
                "To provide a physical structure for the casing",
                "To concentrate and enhance the magnetic field",
                "To conduct the main high-power current"
            ],
            correctAnswer: 2
        },
        {
            question: "What happens immediately after the coil is energized?",
            options: [
                "The spring expands",
                "The common terminal breaks from the NC contact and snaps to the NO contact",
                "The clear casing changes color",
                "The relay permanently locks in place"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
