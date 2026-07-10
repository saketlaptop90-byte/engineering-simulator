export function createMagnetoOpticalTrap(THREE) {
    const group = new THREE.Group();

    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide
    });

    const copperMaterial = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.8,
        roughness: 0.4
    });

    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // 1. Vacuum Chamber
    const chamberGeo = new THREE.BoxGeometry(4, 4, 4);
    const chamber = new THREE.Mesh(chamberGeo, glassMaterial);
    chamber.name = "VacuumChamber";
    group.add(chamber);

    // 2. Anti-Helmholtz Coil Top
    const coilGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    const coilTop = new THREE.Mesh(coilGeo, copperMaterial);
    coilTop.position.set(0, 2.5, 0);
    coilTop.rotation.x = Math.PI / 2;
    coilTop.name = "AntiHelmholtzCoilTop";
    group.add(coilTop);

    // 3. Anti-Helmholtz Coil Bottom
    const coilBottom = new THREE.Mesh(coilGeo, copperMaterial);
    coilBottom.position.set(0, -2.5, 0);
    coilBottom.rotation.x = Math.PI / 2;
    coilBottom.name = "AntiHelmholtzCoilBottom";
    group.add(coilBottom);

    // 4-9. Laser Beams (6 orthogonal)
    const laserGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16, 1, true);
    
    // Laser X+
    const laserXP = new THREE.Mesh(laserGeo, laserMaterial);
    laserXP.position.set(3, 0, 0);
    laserXP.rotation.z = Math.PI / 2;
    laserXP.name = "LaserBeamXPlus";
    group.add(laserXP);

    // Laser X-
    const laserXM = new THREE.Mesh(laserGeo, laserMaterial);
    laserXM.position.set(-3, 0, 0);
    laserXM.rotation.z = Math.PI / 2;
    laserXM.name = "LaserBeamXMinus";
    group.add(laserXM);

    // Laser Y+
    const laserYP = new THREE.Mesh(laserGeo, laserMaterial);
    laserYP.position.set(0, 3, 0);
    laserYP.name = "LaserBeamYPlus";
    group.add(laserYP);

    // Laser Y-
    const laserYM = new THREE.Mesh(laserGeo, laserMaterial);
    laserYM.position.set(0, -3, 0);
    laserYM.name = "LaserBeamYMinus";
    group.add(laserYM);

    // Laser Z+
    const laserZP = new THREE.Mesh(laserGeo, laserMaterial);
    laserZP.position.set(0, 0, 3);
    laserZP.rotation.x = Math.PI / 2;
    laserZP.name = "LaserBeamZPlus";
    group.add(laserZP);

    // Laser Z-
    const laserZM = new THREE.Mesh(laserGeo, laserMaterial);
    laserZM.position.set(0, 0, -3);
    laserZM.rotation.x = Math.PI / 2;
    laserZM.name = "LaserBeamZMinus";
    group.add(laserZM);

    // 10. Cold Atom Cloud
    const particleCount = 2000;
    const atomGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 3.8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 3.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3.8;

        velocities[i * 3] = (Math.random() - 0.5) * 5;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    atomGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    atomGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const atomMaterial = new THREE.PointsMaterial({
        color: 0xff5555,
        size: 0.08,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const atomCloud = new THREE.Points(atomGeo, atomMaterial);
    atomCloud.name = "ColdAtomCloud";
    group.add(atomCloud);

    // Kinematics animation
    const springConstant = 8.0;
    const dampingCoefficient = 4.0;
    const noiseAmplitude = 6.0;

    group.userData.update = function(delta, time) {
        const positions = atomCloud.geometry.attributes.position.array;
        const velocities = atomCloud.geometry.attributes.velocity.array;

        // Limit delta to prevent instabilities
        const dt = Math.min(delta, 0.05);

        for (let i = 0; i < particleCount; i++) {
            let px = positions[i * 3];
            let py = positions[i * 3 + 1];
            let pz = positions[i * 3 + 2];

            let vx = velocities[i * 3];
            let vy = velocities[i * 3 + 1];
            let vz = velocities[i * 3 + 2];

            // Restoring force
            let forceX = -springConstant * px;
            let forceY = -springConstant * py;
            let forceZ = -springConstant * pz;

            // Damping force
            forceX -= dampingCoefficient * vx;
            forceY -= dampingCoefficient * vy;
            forceZ -= dampingCoefficient * vz;

            // Random thermal kick
            forceX += (Math.random() - 0.5) * noiseAmplitude;
            forceY += (Math.random() - 0.5) * noiseAmplitude;
            forceZ += (Math.random() - 0.5) * noiseAmplitude;

            vx += forceX * dt;
            vy += forceY * dt;
            vz += forceZ * dt;

            px += vx * dt;
            py += vy * dt;
            pz += vz * dt;

            // Respawn if hit chamber
            if (Math.abs(px) > 1.9 || Math.abs(py) > 1.9 || Math.abs(pz) > 1.9) {
                px = (Math.random() - 0.5) * 3.8;
                py = (Math.random() - 0.5) * 3.8;
                pz = (Math.random() - 0.5) * 3.8;
                vx = (Math.random() - 0.5) * 10;
                vy = (Math.random() - 0.5) * 10;
                vz = (Math.random() - 0.5) * 10;
            }

            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = pz;

            velocities[i * 3] = vx;
            velocities[i * 3 + 1] = vy;
            velocities[i * 3 + 2] = vz;
        }

        atomCloud.geometry.attributes.position.needsUpdate = true;
        atomCloud.geometry.attributes.velocity.needsUpdate = true;

        laserMaterial.opacity = 0.3 + 0.1 * Math.sin(time * 15);
    };

    group.userData.quiz = [
        {
            question: "What is the primary purpose of the anti-Helmholtz coils in a Magneto-Optical Trap?",
            options: [
                "To heat the atoms",
                "To provide a spatially varying magnetic field for position-dependent restoring force",
                "To cancel Earth's magnetic field",
                "To generate the laser beams"
            ],
            correct: 1
        },
        {
            question: "What principle is used to cool the atoms in optical molasses?",
            options: [
                "Doppler effect",
                "Zeeman effect",
                "Stark effect",
                "Meissner effect"
            ],
            correct: 0
        },
        {
            question: "How many mutually orthogonal, counter-propagating laser beams are typically required for a 3D MOT?",
            options: [
                "2",
                "4",
                "6",
                "8"
            ],
            correct: 2
        },
        {
            question: "The laser frequency in a MOT is typically tuned to be:",
            options: [
                "Exactly at the atomic resonance",
                "Slightly above the atomic resonance (blue-detuned)",
                "Slightly below the atomic resonance (red-detuned)",
                "Far away from atomic resonance"
            ],
            correct: 2
        },
        {
            question: "What is the typical temperature range achieved in a standard Rubidium MOT?",
            options: [
                "Room temperature (~300 K)",
                "Liquid nitrogen temperature (~77 K)",
                "Microkelvin range (~100 µK)",
                "Absolute zero (0 K)"
            ],
            correct: 2
        },
        {
            question: "The restoring force in a MOT is created by the combination of the magnetic field gradient and what effect?",
            options: [
                "The photoelectric effect",
                "The Zeeman effect shifting the atomic energy levels",
                "Gravitational pull",
                "Thermal convection"
            ],
            correct: 1
        }
    ];

    return group;
}
