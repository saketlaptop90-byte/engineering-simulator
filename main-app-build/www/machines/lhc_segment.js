export function createLHCSegment(THREE) {
    const group = new THREE.Group();

    // Materials
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const dipoleMat = new THREE.MeshStandardMaterial({ color: 0x0033cc, metalness: 0.6, roughness: 0.4 });
    const quadMat = new THREE.MeshStandardMaterial({ color: 0xcc6600, metalness: 0.6, roughness: 0.4 });
    const heliumMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const rfMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.7, roughness: 0.3 });
    const detectorMat = new THREE.MeshStandardMaterial({ 
        color: 0x33aa33, 
        metalness: 0.5, 
        roughness: 0.5, 
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const muonMat = new THREE.MeshStandardMaterial({ color: 0xaa3333, metalness: 0.4, roughness: 0.6 });

    const beam1Mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const beam2Mat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const collisionMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });

    // 1. Superconducting dipole magnets
    const dipoleGroup = new THREE.Group();
    dipoleGroup.name = "superconducting dipole magnets";
    dipoleGroup.userData = { partName: dipoleGroup.name };
    const dipoleGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    dipoleGeo.rotateZ(Math.PI / 2);
    [8, 15, -8].forEach(x => {
        const mesh = new THREE.Mesh(dipoleGeo, dipoleMat);
        mesh.position.set(x, 0, 0);
        dipoleGroup.add(mesh);
    });
    group.add(dipoleGroup);

    // 2. Quadrupole focusing magnets
    const quadGroup = new THREE.Group();
    quadGroup.name = "quadrupole focusing magnets";
    quadGroup.userData = { partName: quadGroup.name };
    const quadGeo = new THREE.CylinderGeometry(2.2, 2.2, 2, 32);
    quadGeo.rotateZ(Math.PI / 2);
    [4, 12, 19, -4, -12].forEach(x => {
        const mesh = new THREE.Mesh(quadGeo, quadMat);
        mesh.position.set(x, 0, 0);
        quadGroup.add(mesh);
    });
    group.add(quadGroup);

    // 3. Main beam pipe
    const beamPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 40, 16), pipeMat);
    beamPipe.rotation.z = Math.PI / 2;
    beamPipe.name = "main beam pipe";
    beamPipe.userData = { partName: beamPipe.name };
    group.add(beamPipe);

    // 4. Proton beam 1 (moving right +X)
    const beam1Group = new THREE.Group();
    beam1Group.name = "proton beam 1";
    beam1Group.userData = { partName: beam1Group.name };
    const pGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const p1 = new THREE.Mesh(pGeo, beam1Mat);
    beam1Group.add(p1);
    group.add(beam1Group);

    // 5. Proton beam 2 (moving left -X)
    const beam2Group = new THREE.Group();
    beam2Group.name = "proton beam 2";
    beam2Group.userData = { partName: beam2Group.name };
    const p2 = new THREE.Mesh(pGeo, beam2Mat);
    beam2Group.add(p2);
    group.add(beam2Group);

    // 6. Collision point
    const collisionPoint = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), collisionMat);
    collisionPoint.name = "collision point";
    collisionPoint.userData = { partName: collisionPoint.name };
    group.add(collisionPoint);

    // 7. Particle detector layer
    const detectorLayer = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 6, 32, 1, true), detectorMat);
    detectorLayer.rotation.z = Math.PI / 2;
    detectorLayer.name = "particle detector layer";
    detectorLayer.userData = { partName: detectorLayer.name };
    group.add(detectorLayer);

    // 8. Cryogenic helium pipe
    const heliumPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 40, 16), heliumMat);
    heliumPipe.rotation.z = Math.PI / 2;
    heliumPipe.position.set(0, 2.8, 0);
    heliumPipe.name = "cryogenic helium pipe";
    heliumPipe.userData = { partName: heliumPipe.name };
    group.add(heliumPipe);

    // 9. Radio frequency cavity
    const rfGroup = new THREE.Group();
    rfGroup.name = "radio frequency cavity";
    rfGroup.userData = { partName: rfGroup.name };
    const rfGeo = new THREE.TorusGeometry(1.5, 0.6, 16, 32);
    rfGeo.rotateY(Math.PI / 2);
    [-16, -18].forEach(x => {
        const mesh = new THREE.Mesh(rfGeo, rfMat);
        mesh.position.set(x, 0, 0);
        rfGroup.add(mesh);
    });
    group.add(rfGroup);

    // 10. Muon chamber
    const muonGroup = new THREE.Group();
    muonGroup.name = "muon chamber";
    muonGroup.userData = { partName: muonGroup.name };
    const muonGeo = new THREE.BoxGeometry(1.5, 12, 12);
    [-3.5, 3.5].forEach(x => {
        const mesh = new THREE.Mesh(muonGeo, muonMat);
        mesh.position.set(x, 0, 0);
        muonGroup.add(mesh);
    });
    group.add(muonGroup);

    // Scattered particles for collision animation (attached to collision point logic)
    const scatterGroup = new THREE.Group();
    const scatterMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const scatterGeo = new THREE.SphereGeometry(0.08, 4, 4);
    const particles = [];
    for(let i = 0; i < 30; i++) {
        const p = new THREE.Mesh(scatterGeo, scatterMat);
        scatterGroup.add(p);
        particles.push({
            mesh: p,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            ).normalize().multiplyScalar(5 + Math.random() * 10),
            life: Math.random()
        });
    }
    group.add(scatterGroup);

    let time = 0;
    group.tick = (delta) => {
        time += delta;

        // Animate proton beams moving towards and through each other repeatedly
        beam1Group.position.x = ((time * 30) % 40) - 20; // -20 to 20
        beam2Group.position.x = 20 - ((time * 30) % 40); // 20 to -20

        // Pulse collision point slightly
        const scale = 1 + 0.3 * Math.sin(time * 15);
        collisionPoint.scale.set(scale, scale, scale);
        collisionPoint.material.opacity = 0.5 + 0.5 * Math.sin(time * 15);

        // Particles scatter
        particles.forEach(p => {
            p.life -= delta * 1.5;
            if(p.life <= 0) {
                p.mesh.position.set(0, 0, 0); // Reset at collision center
                p.life = 1.0;
            } else {
                p.mesh.position.addScaledVector(p.velocity, delta);
            }
            p.mesh.material.opacity = p.life;
            p.mesh.material.transparent = true;
        });

        // RF Cavity subtle pulse or rotation
        rfGroup.children.forEach((mesh, index) => {
            mesh.scale.setScalar(1 + 0.05 * Math.sin(time * 10 + index));
        });
    };

    // Include exactly 6 quiz questions
    group.userData.quiz = [
        {
            question: "What is the main purpose of the superconducting dipole magnets in the LHC?",
            options: ["To accelerate particles", "To focus the beam", "To bend the particle beams around the ring", "To detect collisions"],
            answer: "To bend the particle beams around the ring"
        },
        {
            question: "What is the function of the quadrupole magnets?",
            options: ["To focus the particle beams", "To slow down the particles", "To generate power", "To measure the particle mass"],
            answer: "To focus the particle beams"
        },
        {
            question: "What temperature are the superconducting magnets maintained at using liquid helium?",
            options: ["77 Kelvin (-196°C)", "1.9 Kelvin (-271.3°C)", "273 Kelvin (0°C)", "4.2 Kelvin (-269°C)"],
            answer: "1.9 Kelvin (-271.3°C)"
        },
        {
            question: "What particles are primarily accelerated and collided in the main LHC experiments?",
            options: ["Electrons", "Protons", "Neutrons", "Photons"],
            answer: "Protons"
        },
        {
            question: "What component is responsible for accelerating the particles and increasing their energy?",
            options: ["Radio Frequency (RF) cavities", "Dipole magnets", "Muon chambers", "Beam pipes"],
            answer: "Radio Frequency (RF) cavities"
        },
        {
            question: "Which detector component is specifically designed to detect muons, which are highly penetrating particles?",
            options: ["Tracker", "Calorimeter", "Muon chambers", "Beam pipe"],
            answer: "Muon chambers"
        }
    ];

    return group;
}
