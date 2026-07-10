export function createDoubleSlitQuantum(THREE) {
    const modelGroup = new THREE.Group();

    // 10 Distinct Parts

    // Part 1: Support Base
    const baseGeo = new THREE.BoxGeometry(20, 1, 10);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -0.5, 0);
    base.name = "Support Base";
    modelGroup.add(base);

    // Part 2: Vacuum Tube
    const tubeGeo = new THREE.CylinderGeometry(4, 4, 18, 32);
    const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.15, roughness: 0.1, transmission: 0.9, side: THREE.DoubleSide });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, 4, 0);
    tube.name = "Vacuum Tube";
    modelGroup.add(tube);

    // Part 3: Electron Gun Housing
    const gunGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const gun = new THREE.Mesh(gunGeo, gunMat);
    gun.rotation.z = Math.PI / 2;
    gun.position.set(-8, 4, 0);
    gun.name = "Electron Gun Housing";
    modelGroup.add(gun);

    // Part 4: Emitter Nozzle
    const emitterGeo = new THREE.CylinderGeometry(0.5, 1, 1, 16);
    const emitterMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.rotation.z = Math.PI / 2;
    emitter.position.set(-6.5, 4, 0);
    emitter.name = "Emitter Nozzle";
    modelGroup.add(emitter);

    // Part 5: Collimating Barrier (Single Slit)
    const colBarrierGeo = new THREE.BoxGeometry(0.2, 6, 6);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const colBarrier = new THREE.Mesh(colBarrierGeo, barrierMat);
    colBarrier.position.set(-3, 4, 0);
    colBarrier.name = "Collimating Barrier";

    const singleSlitGeo = new THREE.BoxGeometry(0.21, 2, 0.5);
    const slitMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const singleSlit = new THREE.Mesh(singleSlitGeo, slitMat);
    singleSlit.position.set(0, 0, 0);
    colBarrier.add(singleSlit);
    modelGroup.add(colBarrier);

    // Part 6: Double Slit Barrier
    const dsBarrierGeo = new THREE.BoxGeometry(0.2, 6, 6);
    const dsBarrier = new THREE.Mesh(dsBarrierGeo, barrierMat);
    dsBarrier.position.set(1, 4, 0);
    dsBarrier.name = "Double Slit Barrier";

    const slit1Geo = new THREE.BoxGeometry(0.21, 2, 0.2);
    const slit1 = new THREE.Mesh(slit1Geo, slitMat);
    slit1.position.set(0, 0, 0.8);
    dsBarrier.add(slit1);

    const slit2Geo = new THREE.BoxGeometry(0.21, 2, 0.2);
    const slit2 = new THREE.Mesh(slit2Geo, slitMat);
    slit2.position.set(0, 0, -0.8);
    dsBarrier.add(slit2);
    modelGroup.add(dsBarrier);

    // Part 7: Detector Screen
    const screenGeo = new THREE.BoxGeometry(0.5, 7, 7);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x001100 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(7.5, 4, 0);
    screen.name = "Detector Screen";
    modelGroup.add(screen);

    // Part 8: Wave Pattern Projection
    const patternGeo = new THREE.PlaneGeometry(6.8, 6.8);
    const patternMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
    const patternMesh = new THREE.Mesh(patternGeo, patternMat);
    patternMesh.rotation.y = -Math.PI / 2;
    patternMesh.position.set(7.24, 4, 0);
    patternMesh.name = "Wave Pattern Projection";
    modelGroup.add(patternMesh);

    // Part 9: Voltage Supply
    const supplyGeo = new THREE.BoxGeometry(3, 2, 3);
    const supplyMat = new THREE.MeshStandardMaterial({ color: 0x111155 });
    const supply = new THREE.Mesh(supplyGeo, supplyMat);
    supply.position.set(-8, 1, 3);
    supply.name = "Voltage Supply";
    modelGroup.add(supply);

    // Part 10: Connecting Wires
    const wireGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(-8, 2.5, 1.5);
    wire.rotation.x = Math.PI / 4;
    wire.name = "Connecting Wires";
    modelGroup.add(wire);

    // Particles Group
    const particles = [];
    const hitsGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const hitsMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const hitGroup = new THREE.Group();
    modelGroup.add(hitGroup);

    let time = 0;

    function update(deltaTime) {
        time += deltaTime;

        // Spawn electrons
        if (Math.random() < 0.25) {
            const electronGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const electron = new THREE.Mesh(electronGeo, electronMat);
            electron.position.set(-6, 4, 0);

            // Calculate target hit based on interference pattern (interference fringes)
            let targetZ = (Math.random() - 0.5) * 6;
            let prob = Math.pow(Math.cos(2.0 * targetZ), 2) * Math.exp(-Math.pow(targetZ/2.5, 2));
            while(Math.random() > prob) {
                targetZ = (Math.random() - 0.5) * 6;
                prob = Math.pow(Math.cos(2.0 * targetZ), 2) * Math.exp(-Math.pow(targetZ/2.5, 2));
            }

            electron.userData = {
                stage: 0,
                targetZ: targetZ,
                speed: 8 + Math.random() * 2
            };
            particles.push(electron);
            modelGroup.add(electron);
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            if (p.userData.stage === 0) {
                p.position.x += p.userData.speed * deltaTime;
                if (p.position.x >= 1.0) {
                    p.userData.stage = 1;
                    p.position.z = Math.random() > 0.5 ? 0.8 : -0.8;
                }
            } else if (p.userData.stage === 1) {
                const dx = 7.25 - 1.0;
                const dz = p.userData.targetZ - p.position.z;
                const dist = Math.sqrt(dx*dx + dz*dz);
                const vx = (dx / dist) * p.userData.speed;
                const vz = (dz / dist) * p.userData.speed;

                p.position.x += vx * deltaTime;
                p.position.z += vz * deltaTime;

                if (p.position.x >= 7.25) {
                    // Create dot on screen
                    const hit = new THREE.Mesh(hitsGeo, hitsMat);
                    hit.position.set(7.25, 4 + (Math.random() - 0.5) * 4, p.userData.targetZ);
                    hitGroup.add(hit);

                    modelGroup.remove(p);
                    particles.splice(i, 1);
                }
            }
        }

        // Fading old hits to prevent infinite memory growth
        if (hitGroup.children.length > 600) {
            hitGroup.remove(hitGroup.children[0]);
        }
    }

    const quiz = [
        {
            question: "What does the double-slit experiment primarily demonstrate when performed with individual electrons?",
            options: [
                "That electrons are purely particles.",
                "Wave-particle duality of matter.",
                "That electrons have no mass.",
                "Electromagnetic induction."
            ],
            correctAnswer: 1
        },
        {
            question: "What happens to the interference pattern if a detector is placed to observe which slit the electron goes through?",
            options: [
                "The pattern becomes more distinct.",
                "The pattern shifts to the left.",
                "The interference pattern collapses into a simple clumped particle pattern.",
                "The electrons stop moving."
            ],
            correctAnswer: 2
        },
        {
            question: "Even when electrons are fired one at a time, an interference pattern builds up over time. What does this suggest?",
            options: [
                "Each electron interferes with itself.",
                "Electrons wait for each other at the screen.",
                "The detector is malfunctioning.",
                "Electrons bounce off each other in the vacuum."
            ],
            correctAnswer: 0
        },
        {
            question: "Which feature of the probability distribution dictates the bright bands (maxima) on the screen?",
            options: [
                "Destructive interference.",
                "Constructive interference.",
                "Gravitational lensing.",
                "Photoelectric effect."
            ],
            correctAnswer: 1
        },
        {
            question: "In the quantum mechanical description, what travels through the slits to create the interference pattern?",
            options: [
                "A classical particle.",
                "A solid wave of charge.",
                "A probability wave (wavefunction).",
                "A magnetic monopole."
            ],
            correctAnswer: 2
        },
        {
            question: "If the distance between the two slits is decreased, what happens to the spacing of the interference fringes on the screen?",
            options: [
                "They become closer together.",
                "They spread further apart.",
                "They remain unchanged.",
                "The fringes disappear completely."
            ],
            correctAnswer: 1
        }
    ];

    return {
        group: modelGroup,
        update: update,
        quiz: quiz
    };
}
