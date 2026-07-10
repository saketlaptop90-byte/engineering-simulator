import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createLHC(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const concreteMaterial = tinted(ceramic, 0x555555);
    const dipoleMaterial = tinted(blueAccent, 0x002288);
    const quadrupoleMaterial = tinted(orangeAccent, 0xaa4400);
    const beamPipeMaterial = chrome;
    const rfCavityMaterial = copper;
    const atlasMaterial = tinted(steel, 0x888888);
    const cmsMaterial = darkSteel;
    const protonMaterial = tinted(fire, 0x00ffff); // Glowing cyan
    const protonMaterial2 = tinted(fire, 0xff00ff); // Glowing magenta
    const cryoMaterial = tinted(whitePlastic, 0xddddff);
    const splashMaterial = tinted(fire, 0xffffff);

    // Common Dimensions
    const ringRadius = 50;
    const tubeRadius = 2.5;
    const segments = 128;

    // 1. Tunnel Housing
    const tunnelGroup = new THREE.Group();
    const tunnelGeo = new THREE.TorusGeometry(ringRadius, tubeRadius + 1, 32, segments, Math.PI * 1.5);
    const tunnelMesh = new THREE.Mesh(tunnelGeo, concreteMaterial);
    tunnelMesh.rotation.x = Math.PI / 2;
    tunnelGroup.add(tunnelMesh);

    group.add(tunnelGroup);
    parts.push({
        name: "Tunnel Housing",
        description: "Massive circular concrete tube 100 meters underground.",
        material: concreteMaterial,
        function: "Provides a stable, shielded environment for the collider.",
        assemblyOrder: 1,
        connections: ["Superconducting Dipole Magnets", "Cryogenic System"],
        failureEffect: "Environmental exposure, structural instability.",
        cascadeFailures: ["Beam misalignment", "Magnet quenching"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -30, 0)
    });

    // 2. Superconducting Dipole Magnets
    const dipoleGroup = new THREE.Group();
    const numDipoles = 40;
    for (let i = 0; i < numDipoles; i++) {
        const angle = (i / numDipoles) * Math.PI * 2;
        // Skip detector regions
        if (Math.abs(angle) < 0.2 || Math.abs(angle - Math.PI * 2) < 0.2 || Math.abs(angle - Math.PI) < 0.2) continue;
        
        const dipoleGeo = new THREE.CylinderGeometry(0.8, 0.8, 6.5, 16);
        const dipoleMesh = new THREE.Mesh(dipoleGeo, dipoleMaterial);
        
        dipoleMesh.position.set(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius);
        dipoleMesh.rotation.y = -angle; // Tangent
        dipoleMesh.rotation.z = Math.PI / 2;
        
        dipoleGroup.add(dipoleMesh);
    }
    group.add(dipoleGroup);
    parts.push({
        name: "Superconducting Dipole Magnets",
        description: "Long blue cylindrical tubes inside the tunnel.",
        material: dipoleMaterial,
        function: "Bends the paths of the protons to keep them in the circular ring.",
        assemblyOrder: 2,
        connections: ["Beam Pipes", "Cryogenic Liquid Helium System"],
        failureEffect: "Protons crash into the beam pipe walls.",
        cascadeFailures: ["Beam loss", "Catastrophic damage to pipes"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 15, 0)
    });

    // 3. Quadrupole Magnets
    const quadGroup = new THREE.Group();
    for (let i = 0; i < numDipoles; i++) {
        const angle = ((i + 0.5) / numDipoles) * Math.PI * 2;
        if (Math.abs(angle) < 0.2 || Math.abs(angle - Math.PI * 2) < 0.2 || Math.abs(angle - Math.PI) < 0.2) continue;

        const quadGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.5, 16);
        const quadMesh = new THREE.Mesh(quadGeo, quadrupoleMaterial);
        
        quadMesh.position.set(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius);
        quadMesh.rotation.y = -angle;
        quadMesh.rotation.z = Math.PI / 2;
        
        quadGroup.add(quadMesh);
    }
    group.add(quadGroup);
    parts.push({
        name: "Quadrupole Magnets",
        description: "Shorter focusing magnets interspersed between dipoles.",
        material: quadrupoleMaterial,
        function: "Squeezes and focuses the particle beam to increase collision probability.",
        assemblyOrder: 3,
        connections: ["Beam Pipes", "Superconducting Dipole Magnets"],
        failureEffect: "Beam defocuses and diffuses.",
        cascadeFailures: ["Reduced luminosity", "Collisions fail"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 25, 0)
    });

    // 4. Beam Pipes
    const pipeGroup = new THREE.Group();
    const pipeGeo = new THREE.TorusGeometry(ringRadius, 0.15, 8, segments);
    const pipe1 = new THREE.Mesh(pipeGeo, beamPipeMaterial);
    pipe1.rotation.x = Math.PI / 2;
    pipe1.position.y = 0.2;
    const pipe2 = new THREE.Mesh(pipeGeo, beamPipeMaterial);
    pipe2.rotation.x = Math.PI / 2;
    pipe2.position.y = -0.2;
    
    pipeGroup.add(pipe1);
    pipeGroup.add(pipe2);
    group.add(pipeGroup);
    parts.push({
        name: "Beam Pipes",
        description: "Two ultra-high vacuum tubes running parallel.",
        material: beamPipeMaterial,
        function: "Provides a vacuum environment for the protons to travel without hitting air molecules.",
        assemblyOrder: 4,
        connections: ["RF Cavities", "Magnets"],
        failureEffect: "Air enters pipes.",
        cascadeFailures: ["Beam scattered by air", "Vacuum system failure"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 5, 0)
    });

    // 5. RF Cavities
    const rfGroup = new THREE.Group();
    const rfAngle = Math.PI / 2; // Placed at 90 degrees
    for(let i=0; i<6; i++) {
        const rfGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
        const rfMesh = new THREE.Mesh(rfGeo, rfCavityMaterial);
        const offsetAngle = rfAngle + (i - 2.5) * 0.04;
        rfMesh.position.set(Math.cos(offsetAngle) * ringRadius, 0, Math.sin(offsetAngle) * ringRadius);
        rfMesh.rotation.y = -offsetAngle + Math.PI/2;
        rfGroup.add(rfMesh);
    }
    group.add(rfGroup);
    parts.push({
        name: "RF Cavities",
        description: "Radio-frequency accelerating chambers.",
        material: rfCavityMaterial,
        function: "Accelerates the protons and restores energy lost to synchrotron radiation.",
        assemblyOrder: 5,
        connections: ["Beam Pipes"],
        failureEffect: "Protons lose energy and drift outwards.",
        cascadeFailures: ["Beam decay"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 45, 0)
    });

    // 6. ATLAS Detector
    const atlasGroup = new THREE.Group();
    const atlasBody = new THREE.CylinderGeometry(4.5, 4.5, 12, 32);
    const atlasMesh = new THREE.Mesh(atlasBody, atlasMaterial);
    atlasMesh.rotation.z = Math.PI / 2;
    
    const atlasEndCap1 = new THREE.TorusGeometry(3.5, 0.8, 16, 32);
    const endMesh1 = new THREE.Mesh(atlasEndCap1, yellowAccent);
    endMesh1.rotation.y = Math.PI / 2;
    endMesh1.position.x = 6;
    
    const endMesh2 = new THREE.Mesh(atlasEndCap1, yellowAccent);
    endMesh2.rotation.y = Math.PI / 2;
    endMesh2.position.x = -6;
    
    atlasGroup.add(atlasMesh, endMesh1, endMesh2);

    const splashGroup = new THREE.Group();
    const splashParticles = [];
    for(let i=0; i<50; i++) {
        const sMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), splashMaterial);
        splashGroup.add(sMesh);
        splashParticles.push({
            mesh: sMesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize()
        });
    }
    splashGroup.visible = false;
    atlasGroup.add(splashGroup);

    atlasGroup.position.set(ringRadius, 0, 0); // Positioned at 0 degrees
    group.add(atlasGroup);
    parts.push({
        name: "ATLAS Detector",
        description: "Massive multi-layered cylindrical sensor array at collision point.",
        material: atlasMaterial,
        function: "Detects particles produced in proton-proton collisions to search for new physics like the Higgs Boson.",
        assemblyOrder: 6,
        connections: ["Beam Pipes", "Protons Beams"],
        failureEffect: "Loss of collision data.",
        cascadeFailures: ["Experiment downtime"],
        originalPosition: new THREE.Vector3(ringRadius, 0, 0),
        explodedPosition: new THREE.Vector3(ringRadius + 25, 0, 0)
    });

    // 7. CMS Detector
    const cmsGroup = new THREE.Group();
    const cmsBody = new THREE.CylinderGeometry(3.5, 3.5, 9, 32);
    const cmsMesh = new THREE.Mesh(cmsBody, cmsMaterial);
    cmsMesh.rotation.z = Math.PI / 2;
    
    for (let i = 0; i < 7; i++) {
        const ringGeo = new THREE.TorusGeometry(3.6, 0.4, 16, 32);
        const ringMesh = new THREE.Mesh(ringGeo, redAccent);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.x = -3.5 + i * 1.16;
        cmsGroup.add(ringMesh);
    }
    cmsGroup.add(cmsMesh);

    const splashGroupCMS = new THREE.Group();
    const splashParticlesCMS = [];
    for(let i=0; i<50; i++) {
        const sMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), splashMaterial);
        splashGroupCMS.add(sMesh);
        splashParticlesCMS.push({
            mesh: sMesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize()
        });
    }
    splashGroupCMS.visible = false;
    cmsGroup.add(splashGroupCMS);

    cmsGroup.position.set(-ringRadius, 0, 0); // Positioned at 180 degrees
    group.add(cmsGroup);
    parts.push({
        name: "CMS Detector",
        description: "Compact, dense sensor array at opposite collision point.",
        material: cmsMaterial,
        function: "Cross-verifies discoveries made by ATLAS with a different detector design.",
        assemblyOrder: 7,
        connections: ["Beam Pipes", "Protons Beams"],
        failureEffect: "Loss of verification data.",
        cascadeFailures: ["Experiment downtime"],
        originalPosition: new THREE.Vector3(-ringRadius, 0, 0),
        explodedPosition: new THREE.Vector3(-ringRadius - 25, 0, 0)
    });

    // 8. Protons Beam 1
    const beam1Group = new THREE.Group();
    const b1Pivot = new THREE.Group();
    beam1Group.add(b1Pivot);
    for(let i=0; i<15; i++) {
        const particleGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const p1Mesh = new THREE.Mesh(particleGeo, protonMaterial);
        const angleOffset = i * 0.008;
        p1Mesh.position.set(Math.cos(angleOffset) * ringRadius, 0.2, Math.sin(angleOffset) * ringRadius);
        b1Pivot.add(p1Mesh);
    }
    group.add(beam1Group);
    parts.push({
        name: "Protons Beam 1",
        description: "Glowing stream of particles moving clockwise.",
        material: protonMaterial,
        function: "Provides the collision energy when hitting Beam 2.",
        assemblyOrder: 8,
        connections: ["Beam Pipes", "ATLAS Detector", "CMS Detector"],
        failureEffect: "Beam dump.",
        cascadeFailures: ["No collisions"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -10, 0)
    });

    // 9. Protons Beam 2
    const beam2Group = new THREE.Group();
    const b2Pivot = new THREE.Group();
    beam2Group.add(b2Pivot);
    for(let i=0; i<15; i++) {
        const particleGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const p2Mesh = new THREE.Mesh(particleGeo, protonMaterial2);
        const angleOffset = -i * 0.008;
        p2Mesh.position.set(Math.cos(angleOffset) * ringRadius, -0.2, Math.sin(angleOffset) * ringRadius);
        b2Pivot.add(p2Mesh);
    }
    group.add(beam2Group);
    parts.push({
        name: "Protons Beam 2",
        description: "Glowing stream of particles moving counter-clockwise.",
        material: protonMaterial2,
        function: "Counter-rotating beam for head-on collisions.",
        assemblyOrder: 9,
        connections: ["Beam Pipes", "ATLAS Detector", "CMS Detector"],
        failureEffect: "Beam dump.",
        cascadeFailures: ["No collisions"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 10, 0)
    });

    // 10. Cryogenic Liquid Helium System
    const cryoGroup = new THREE.Group();
    const cryoGeo = new THREE.TorusGeometry(ringRadius, 0.4, 8, segments);
    const cryoMesh = new THREE.Mesh(cryoGeo, cryoMaterial);
    cryoMesh.rotation.x = Math.PI / 2;
    cryoMesh.position.y = 1.3;
    cryoMesh.position.x = -1.3;
    cryoGroup.add(cryoMesh);

    for (let i = 0; i < 12; i++) {
        const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
        const pipeMesh = new THREE.Mesh(pipeGeo, cryoMaterial);
        const angle = (i / 12) * Math.PI * 2;
        pipeMesh.position.set(Math.cos(angle) * (ringRadius - 1), 0.65, Math.sin(angle) * (ringRadius - 1));
        pipeMesh.rotation.x = Math.PI / 2;
        pipeMesh.rotation.z = -angle;
        cryoGroup.add(pipeMesh);
    }
    
    group.add(cryoGroup);
    parts.push({
        name: "Cryogenic Liquid Helium System",
        description: "Piping network chilling the magnets to 1.9 K.",
        material: cryoMaterial,
        function: "Keeps magnets in a superconducting state, allowing massive currents with zero electrical resistance.",
        assemblyOrder: 10,
        connections: ["Superconducting Dipole Magnets", "Quadrupole Magnets"],
        failureEffect: "Magnets quench, turning resistive and heating up rapidly.",
        cascadeFailures: ["Massive helium boil-off", "System shutdown"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 35, 0)
    });

    const description = "The Large Hadron Collider (LHC) is the world's largest and most powerful particle accelerator. It consists of a 27-kilometre ring of superconducting magnets with a number of accelerating structures to boost the energy of the particles along the way. Inside the accelerator, two high-energy particle beams travel at close to the speed of light before they are made to collide. The beams travel in opposite directions in separate beam pipes – two tubes kept at ultrahigh vacuum. They are guided around the accelerator ring by a strong magnetic field maintained by superconducting electromagnets.";

    const quizQuestions = [
        {
            question: "What major particle discovery was confirmed by the ATLAS and CMS experiments at the LHC in 2012?",
            options: ["Top Quark", "Higgs Boson", "Graviton", "Neutrino"],
            correct: 1,
            explanation: "The Higgs Boson was discovered in 2012, confirming the mechanism that gives elementary particles mass.",
            difficulty: "Medium"
        },
        {
            question: "To what temperature must the superconducting magnets be cooled using liquid helium?",
            options: ["77 K", "273 K", "1.9 K", "4.2 K"],
            correct: 2,
            explanation: "The magnets are kept at 1.9 K (-271.3°C), which is colder than outer space, to maintain superconductivity.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the dipole magnets in the LHC?",
            options: ["To accelerate the protons", "To bend the proton paths into a circle", "To focus the beam", "To detect collisions"],
            correct: 1,
            explanation: "Dipole magnets create a uniform magnetic field that bends the trajectory of the protons so they follow the circular ring.",
            difficulty: "Medium"
        },
        {
            question: "What is the difference between dipole and quadrupole magnets?",
            options: ["Dipoles bend the beam, quadrupoles focus it", "Quadrupoles bend the beam, dipoles focus it", "Dipoles are for protons, quadrupoles are for electrons", "They do the exact same thing"],
            correct: 0,
            explanation: "Dipoles bend the beam around the curve, while quadrupoles act like lenses to tightly focus the beam.",
            difficulty: "Medium"
        },
        {
            question: "What is the approximate circumference of the LHC tunnel?",
            options: ["10 km", "27 km", "50 km", "100 km"],
            correct: 1,
            explanation: "The LHC ring is approximately 27 kilometres (17 miles) in circumference.",
            difficulty: "Easy"
        },
        {
            question: "What is the maximum collision energy of the LHC (as of Run 3)?",
            options: ["7 TeV", "13.6 TeV", "100 TeV", "14 GeV"],
            correct: 1,
            explanation: "The LHC currently operates at a record collision energy of 13.6 TeV (Tera-electron volts).",
            difficulty: "Hard"
        }
    ];

    let lastCollision = -1;
    let splashActive = false;
    let splashTimer = 0;
    let collisionPoint = 'ATLAS';

    function animate(time, speed, meshes) {
        const b1 = meshes.find(m => m.name === "Protons Beam 1");
        const b2 = meshes.find(m => m.name === "Protons Beam 2");
        
        if (b1 && b2) {
            const pivot1 = b1.group.children[0];
            const pivot2 = b2.group.children[0];
            
            const currentRot = time * speed * 2;
            pivot1.rotation.y = -currentRot;
            pivot2.rotation.y = currentRot;

            const collisionIndex = Math.floor((currentRot + 0.1) / Math.PI);
            if (lastCollision === -1) {
                lastCollision = collisionIndex;
            }

            if (collisionIndex > lastCollision) {
                lastCollision = collisionIndex;
                splashActive = true;
                splashTimer = 0;
                
                if (collisionIndex % 2 === 0) {
                    collisionPoint = 'ATLAS';
                    splashGroup.visible = true;
                    splashGroupCMS.visible = false;
                } else {
                    collisionPoint = 'CMS';
                    splashGroupCMS.visible = true;
                    splashGroup.visible = false;
                }
            }

            if (splashActive) {
                splashTimer += 0.05 * Math.max(0.5, speed);
                const sParts = collisionPoint === 'ATLAS' ? splashParticles : splashParticlesCMS;
                
                sParts.forEach((p) => {
                    p.mesh.position.copy(p.velocity).multiplyScalar(splashTimer * 10);
                    p.mesh.material.opacity = Math.max(0, 1 - splashTimer * 1.5);
                    p.mesh.material.transparent = true;
                });
                
                if (splashTimer > 1) {
                    splashActive = false;
                    splashGroup.visible = false;
                    splashGroupCMS.visible = false;
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
