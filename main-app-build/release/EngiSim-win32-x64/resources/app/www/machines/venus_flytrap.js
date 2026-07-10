export function createVenusFlytrap(THREE) {
    const group = new THREE.Group();

    // Materials
    const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 });
    const redInnerMaterial = new THREE.MeshStandardMaterial({ color: 0xDC143C, roughness: 0.6 });
    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x556B2F, roughness: 0.9 });
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });
    const glandMaterial = new THREE.MeshStandardMaterial({ color: 0xFF1493, roughness: 0.4 });
    const nectarMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, transparent: true, opacity: 0.7 });
    const petioleMaterial = new THREE.MeshStandardMaterial({ color: 0x32CD32, roughness: 0.8 });
    const midribMaterial = new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.9 });
    const turgorMaterial = new THREE.MeshStandardMaterial({ color: 0x98FB98, roughness: 0.7 });
    const insectMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.5 });

    // 1. Petiole
    const petioleGeom = new THREE.CylinderGeometry(0.2, 0.4, 4, 16);
    const petiole = new THREE.Mesh(petioleGeom, petioleMaterial);
    petiole.position.set(0, -2, 0);
    petiole.userData.name = "Petiole";
    group.add(petiole);

    // 2. Midrib
    const midribGeom = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    midribGeom.rotateX(Math.PI / 2); // along Z
    const midrib = new THREE.Mesh(midribGeom, midribMaterial);
    midrib.position.set(0, 0, 0);
    midrib.userData.name = "Midrib";
    group.add(midrib);

    // 3. Hinge Turgor Cells
    const turgorGeom = new THREE.BoxGeometry(0.4, 0.3, 3);
    const turgor = new THREE.Mesh(turgorGeom, turgorMaterial);
    turgor.position.set(0, -0.1, 0);
    turgor.userData.name = "Hinge Turgor Cells";
    group.add(turgor);

    // 4. Lobe Left
    const lobeLeftPivot = new THREE.Group();
    const leftGeom = new THREE.BoxGeometry(2, 0.1, 3);
    leftGeom.translate(1, 0, 0);
    const lobeLeft = new THREE.Mesh(leftGeom, greenMaterial);
    const innerLeftGeom = new THREE.BoxGeometry(1.8, 0.05, 2.8);
    innerLeftGeom.translate(1, 0.05, 0);
    const innerLeft = new THREE.Mesh(innerLeftGeom, redInnerMaterial);
    lobeLeft.add(innerLeft);
    lobeLeftPivot.add(lobeLeft);
    lobeLeftPivot.userData.name = "Lobe Left";
    group.add(lobeLeftPivot);

    // 5. Lobe Right
    const lobeRightPivot = new THREE.Group();
    const rightGeom = new THREE.BoxGeometry(2, 0.1, 3);
    rightGeom.translate(-1, 0, 0);
    const lobeRight = new THREE.Mesh(rightGeom, greenMaterial);
    const innerRightGeom = new THREE.BoxGeometry(1.8, 0.05, 2.8);
    innerRightGeom.translate(-1, 0.05, 0);
    const innerRight = new THREE.Mesh(innerRightGeom, redInnerMaterial);
    lobeRight.add(innerRight);
    lobeRightPivot.add(lobeRight);
    lobeRightPivot.userData.name = "Lobe Right";
    group.add(lobeRightPivot);

    // 6. Marginal Spikes
    const spikesLeftGroup = new THREE.Group();
    spikesLeftGroup.userData.name = "Marginal Spikes";
    const spikesRightGroup = new THREE.Group();
    for (let z = -1.3; z <= 1.3; z += 0.3) {
        const spikeG = new THREE.ConeGeometry(0.05, 0.6, 8);
        spikeG.translate(0, 0.3, 0);
        spikeG.rotateZ(-Math.PI / 2);
        const spikeL = new THREE.Mesh(spikeG, spikeMaterial);
        spikeL.position.set(2, 0, z);
        spikesLeftGroup.add(spikeL);

        const spikeG2 = new THREE.ConeGeometry(0.05, 0.6, 8);
        spikeG2.translate(0, 0.3, 0);
        spikeG2.rotateZ(Math.PI / 2);
        const spikeR = new THREE.Mesh(spikeG2, spikeMaterial);
        spikeR.position.set(-2, 0, z);
        spikesRightGroup.add(spikeR);
    }
    lobeLeftPivot.add(spikesLeftGroup);
    lobeRightPivot.add(spikesRightGroup);

    // 7. Trigger Hairs
    const hairLeftGroup = new THREE.Group();
    hairLeftGroup.userData.name = "Trigger Hairs";
    const hairRightGroup = new THREE.Group();
    const hairPosL = [[1, 0.1, -0.5], [1.5, 0.1, 0], [1, 0.1, 0.5]];
    hairPosL.forEach(pos => {
        const hG = new THREE.CylinderGeometry(0.015, 0.03, 0.4);
        hG.translate(0, 0.2, 0);
        const hair = new THREE.Mesh(hG, hairMaterial);
        hair.position.set(...pos);
        hairLeftGroup.add(hair);
    });
    lobeLeftPivot.add(hairLeftGroup);

    const hairPosR = [[-1, 0.1, -0.5], [-1.5, 0.1, 0], [-1, 0.1, 0.5]];
    hairPosR.forEach(pos => {
        const hG = new THREE.CylinderGeometry(0.015, 0.03, 0.4);
        hG.translate(0, 0.2, 0);
        const hair = new THREE.Mesh(hG, hairMaterial);
        hair.position.set(...pos);
        hairRightGroup.add(hair);
    });
    lobeRightPivot.add(hairRightGroup);

    // 8. Digestive Glands
    const digestGroup = new THREE.Group();
    digestGroup.userData.name = "Digestive Glands";
    for(let i = 0; i < 30; i++) {
        const gL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), glandMaterial);
        gL.position.set(0.5 + Math.random() * 1.2, 0.08, -1.2 + Math.random() * 2.4);
        digestGroup.add(gL);
        
        const gR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), glandMaterial);
        gR.position.set(-(0.5 + Math.random() * 1.2), 0.08, -1.2 + Math.random() * 2.4);
        lobeRightPivot.add(gR);
    }
    lobeLeftPivot.add(digestGroup);

    // 9. Nectar Glands
    const nectarGroup = new THREE.Group();
    nectarGroup.userData.name = "Nectar Glands";
    for(let z = -1.4; z <= 1.4; z += 0.2) {
        const nL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), nectarMaterial);
        nL.position.set(1.9, 0.08, z);
        nectarGroup.add(nL);

        const nR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), nectarMaterial);
        nR.position.set(-1.9, 0.08, z);
        lobeRightPivot.add(nR);
    }
    lobeLeftPivot.add(nectarGroup);

    // 10. Prey Insect
    const insectGroup = new THREE.Group();
    insectGroup.userData.name = "Prey Insect";
    const insectBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2, 4, 8), insectMaterial);
    insectBody.rotation.z = Math.PI / 2;
    const wingMat = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide});
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.1), wingMat);
    wingL.position.set(0, 0.1, 0.1);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.1), wingMat);
    wingR.position.set(0, 0.1, -0.1);
    insectGroup.add(insectBody, wingL, wingR);
    group.add(insectGroup);

    // Initial state
    lobeLeftPivot.rotation.z = Math.PI / 4;
    lobeRightPivot.rotation.z = -Math.PI / 4;

    let time = 0;
    let phase = 'waiting';
    let phaseTime = 0;

    group.userData.update = function(delta) {
        time += delta;
        
        if (phase === 'waiting') {
            insectGroup.position.x = Math.sin(time * 3) * 1.5;
            insectGroup.position.y = 1 + Math.cos(time * 5) * 0.5;
            insectGroup.position.z = Math.sin(time * 2) * 1.5;

            wingL.rotation.x = Math.sin(time * 50) * 0.5;
            wingR.rotation.x = -Math.sin(time * 50) * 0.5;

            if (Math.abs(insectGroup.position.x) < 1.0 && insectGroup.position.y < 0.5 && Math.abs(insectGroup.position.z) < 1.0) {
                if (Math.random() > 0.98) {
                    phase = 'snapping';
                    phaseTime = 0;
                }
            }
        } else if (phase === 'snapping') {
            phaseTime += delta * 12; // Fast snap
            let t = Math.min(phaseTime, 1);
            let easeT = 1 - Math.pow(1 - t, 3); // easeOutCubic
            
            lobeLeftPivot.rotation.z = (Math.PI / 4) + easeT * (Math.PI / 4 - 0.1);
            lobeRightPivot.rotation.z = -(Math.PI / 4) - easeT * (Math.PI / 4 - 0.1);

            insectGroup.position.lerp(new THREE.Vector3(0, 0.2, 0), t);
            
            wingL.rotation.x = 0;
            wingR.rotation.x = 0;

            if (t === 1) {
                phase = 'digesting';
                phaseTime = 0;
            }
        } else if (phase === 'digesting') {
            phaseTime += delta;
            if (phaseTime < 1) {
                insectGroup.position.x = (Math.random() - 0.5) * 0.1;
                insectGroup.position.z = (Math.random() - 0.5) * 0.1;
            } else {
                insectGroup.scale.setScalar(Math.max(0, 1 - (phaseTime - 1) / 2));
            }

            if (phaseTime > 3) {
                phase = 'reopening';
                phaseTime = 0;
            }
        } else if (phase === 'reopening') {
            phaseTime += delta * 0.5;
            let t = Math.min(phaseTime, 1);

            lobeLeftPivot.rotation.z = (Math.PI / 2 - 0.1) - t * (Math.PI / 4 - 0.1);
            lobeRightPivot.rotation.z = -(Math.PI / 2 - 0.1) + t * (Math.PI / 4 - 0.1);

            if (t === 1) {
                phase = 'waiting';
                phaseTime = 0;
                insectGroup.scale.setScalar(1);
                insectGroup.position.set(0, 2, 0);
            }
        }
    };

    const questions = [
        {
            question: "What triggers the snapping mechanism of the Venus Flytrap?",
            options: [
                "The scent of the insect",
                "Two touches of the trigger hairs within 20 seconds",
                "Changes in sunlight",
                "The weight of the insect"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the primary function of the marginal spikes on the lobes?",
            options: [
                "To inject venom into the prey",
                "To interlock and form a cage to prevent prey from escaping",
                "To sense the presence of prey",
                "To absorb nutrients"
            ],
            correctAnswer: 1
        },
        {
            question: "How do the hinge turgor cells cause the trap to close rapidly?",
            options: [
                "By rapidly changing cell water pressure (turgor)",
                "By contracting muscle fibers",
                "By growing new cells instantly",
                "By releasing elastic bands"
            ],
            correctAnswer: 0
        },
        {
            question: "Why do Venus Flytraps digest insects?",
            options: [
                "For energy, like animals do",
                "Because they cannot perform photosynthesis",
                "To supplement poor soil nutrients, especially nitrogen and phosphorus",
                "To protect themselves from being eaten"
            ],
            correctAnswer: 2
        },
        {
            question: "What happens if the trap closes but does not catch any prey?",
            options: [
                "The trap dies and falls off",
                "It reopens in about 12 to 24 hours",
                "It secretes digestive juices anyway",
                "It turns into a flower"
            ],
            correctAnswer: 1
        },
        {
            question: "Which glands are responsible for attracting the prey to the trap?",
            options: [
                "Digestive Glands",
                "Trigger Glands",
                "Nectar Glands",
                "Poison Glands"
            ],
            correctAnswer: 2
        }
    ];

    return {
        model: group,
        questions: questions
    };
}
