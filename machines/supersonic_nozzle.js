export function createSupersonicNozzle(THREE) {
    const group = new THREE.Group();

    // Materials
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const inletMaterial = new THREE.MeshStandardMaterial({ color: 0xff4400, metalness: 0.5, roughness: 0.5 });
    const expansionMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3, wireframe: true });
    const shockMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
    const plumeMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.5 });
    const coolingMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.6, roughness: 0.4 });
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1. Converging Section (Cylinder/Cone)
    const convergingGeo = new THREE.CylinderGeometry(2, 0.5, 3, 32, 1, true);
    const convergingSection = new THREE.Mesh(convergingGeo, wallMaterial);
    convergingSection.rotation.z = Math.PI / 2;
    convergingSection.position.x = -1.5;
    group.add(convergingSection);

    // 2. Throat (Cylinder)
    const throatGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1, true);
    const throat = new THREE.Mesh(throatGeo, wallMaterial);
    throat.rotation.z = Math.PI / 2;
    throat.position.x = 0.5;
    group.add(throat);

    // 3. Diverging Section (Cylinder/Cone)
    const divergingGeo = new THREE.CylinderGeometry(0.5, 3, 5, 32, 1, true);
    const divergingSection = new THREE.Mesh(divergingGeo, wallMaterial);
    divergingSection.rotation.z = Math.PI / 2;
    divergingSection.position.x = 3.5;
    group.add(divergingSection);

    // 4. Combustion Gas Inlet
    const inletGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const inlet = new THREE.Mesh(inletGeo, inletMaterial);
    inlet.rotation.z = Math.PI / 2;
    inlet.position.x = -3.25;
    group.add(inlet);

    // 5. Expansion Wave Region
    const expansionGeo = new THREE.CylinderGeometry(0.5, 2, 3, 16, 1, true);
    const expansionRegion = new THREE.Mesh(expansionGeo, expansionMaterial);
    expansionRegion.rotation.z = Math.PI / 2;
    expansionRegion.position.x = 2.5;
    group.add(expansionRegion);

    // 6. Shock Wave Representation
    const shockGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);
    const shockWave = new THREE.Mesh(shockGeo, shockMaterial);
    shockWave.rotation.z = Math.PI / 2;
    shockWave.position.x = 4.5;
    group.add(shockWave);

    // 7. Exhaust Plume
    const plumeGeo = new THREE.CylinderGeometry(3, 4, 4, 32, 1, true);
    const plume = new THREE.Mesh(plumeGeo, plumeMaterial);
    plume.rotation.z = Math.PI / 2;
    plume.position.x = 8;
    group.add(plume);

    // 8. Nozzle Wall (outer casing shell)
    const wallGeo = new THREE.CylinderGeometry(3.5, 3.5, 9.5, 32, 1, true);
    const nozzleWall = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true }));
    nozzleWall.rotation.z = Math.PI / 2;
    nozzleWall.position.x = 1.25;
    group.add(nozzleWall);

    // 9. Cooling Channels
    const coolingGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const channelGeo = new THREE.CylinderGeometry(0.1, 0.1, 9, 8);
        const channel = new THREE.Mesh(channelGeo, coolingMaterial);
        channel.rotation.z = Math.PI / 2;
        channel.position.set(1.5, Math.cos(angle) * 3.3, Math.sin(angle) * 3.3);
        coolingGroup.add(channel);
    }
    group.add(coolingGroup);

    // 10. Pressure Gradient Indicators
    const pressureGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const indGeo = new THREE.TorusGeometry(3.6, 0.05, 8, 32);
        const indicator = new THREE.Mesh(indGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1 - i*0.2, 0) }));
        indicator.rotation.y = Math.PI / 2;
        indicator.position.x = -2 + i * 1.8;
        pressureGroup.add(indicator);
    }
    group.add(pressureGroup);

    // Flow particles for animation
    const particles = [];
    for (let i = 0; i < 50; i++) {
        const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const pMesh = new THREE.Mesh(pGeo, particleMaterial);
        pMesh.position.set(-3, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5);
        pMesh.userData = {
            r: Math.sqrt(pMesh.position.y**2 + pMesh.position.z**2),
            angle: Math.atan2(pMesh.position.z, pMesh.position.y),
            xOffset: Math.random() * 10
        };
        particles.push(pMesh);
        group.add(pMesh);
    }

    // Animation
    group.userData.update = function(deltaTime) {
        particles.forEach(p => {
            p.position.x += 5 * deltaTime;
            if (p.position.x > 8) {
                p.position.x = -3;
            }
            
            // Adjust radius based on section (approximate profile)
            let maxR = 2;
            if (p.position.x < 0) {
                maxR = 2 - 1.5 * ((p.position.x + 3) / 3); // Converging
            } else if (p.position.x < 1) {
                maxR = 0.5; // Throat
            } else if (p.position.x < 6) {
                maxR = 0.5 + 2.5 * ((p.position.x - 1) / 5); // Diverging
            } else {
                maxR = 3 + 1 * ((p.position.x - 6) / 4); // Plume
            }
            maxR = Math.max(0.1, maxR * 0.8);
            
            const currentR = p.userData.r * maxR;
            p.position.y = Math.cos(p.userData.angle) * currentR;
            p.position.z = Math.sin(p.userData.angle) * currentR;
            
            // Color mapping: hot at inlet, cool at expansion, hot at shock
            if (p.position.x < 0) p.material.color.setHex(0xffaa00);
            else if (p.position.x < 4) p.material.color.setHex(0x00aaff);
            else p.material.color.setHex(0xff5500);
        });

        shockWave.scale.set(1 + Math.sin(Date.now() * 0.01) * 0.05, 1 + Math.sin(Date.now() * 0.01) * 0.05, 1);
        plume.material.opacity = 0.5 + Math.sin(Date.now() * 0.015) * 0.1;
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What happens to the flow velocity in the diverging section of a supersonic nozzle if the flow is already supersonic at the throat?",
            options: ["It decreases", "It increases", "It remains constant", "It becomes subsonic"],
            correctAnswer: 1
        },
        {
            question: "In a converging-diverging nozzle, where is Mach 1 achieved under choked conditions?",
            options: ["At the inlet", "In the diverging section", "At the throat", "At the exit"],
            correctAnswer: 2
        },
        {
            question: "What is the primary purpose of a de Laval nozzle in rocket engines?",
            options: ["To decrease exhaust temperature", "To increase combustion pressure", "To accelerate hot gases to supersonic speeds", "To mix fuel and oxidizer"],
            correctAnswer: 2
        },
        {
            question: "What forms in the diverging section or outside the nozzle when the exit pressure is lower than the ambient pressure?",
            options: ["Expansion waves", "Normal shock waves", "Oblique shock waves", "Boundary layer separation"],
            correctAnswer: 2
        },
        {
            question: "Which of the following properties decreases as flow accelerates through a supersonic nozzle?",
            options: ["Velocity", "Mach number", "Dynamic pressure", "Static temperature"],
            correctAnswer: 3
        },
        {
            question: "Why are cooling channels essential in a supersonic rocket nozzle?",
            options: ["To cool the exhaust gases", "To prevent the nozzle walls from melting due to extreme heat flux", "To increase the exit velocity", "To reduce acoustic noise"],
            correctAnswer: 1
        }
    ];

    return group;
}
