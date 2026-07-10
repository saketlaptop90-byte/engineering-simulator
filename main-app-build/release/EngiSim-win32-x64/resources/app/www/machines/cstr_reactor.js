export function createCSTRReactor(THREE) {
    const group = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, transmission: 0.9, roughness: 0.1 });
    const jacketMaterial = new THREE.MeshStandardMaterial({ color: 0x336699, transparent: true, opacity: 0.5 });
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333, metalness: 0.5, roughness: 0.5 });
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.3 });

    // 1. Reactor Vessel
    const vesselGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const vessel = new THREE.Mesh(vesselGeo, glassMaterial);
    group.add(vessel);

    // 2. Cooling Jacket
    const jacketGeo = new THREE.CylinderGeometry(2.3, 2.3, 5, 32);
    const jacket = new THREE.Mesh(jacketGeo, jacketMaterial);
    group.add(jacket);

    // 3. Motor
    const motorGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const motor = new THREE.Mesh(motorGeo, steelMaterial);
    motor.position.y = 4;
    group.add(motor);

    // 4. Agitator Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 7, 16);
    const shaft = new THREE.Mesh(shaftGeo, steelMaterial);
    shaft.position.y = 0.5;
    group.add(shaft);

    // 5. Impeller Blades
    const impellerGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const blade1 = new THREE.Mesh(bladeGeo, bladeMaterial);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMaterial);
    blade2.rotation.y = Math.PI / 2;
    impellerGroup.add(blade1);
    impellerGroup.add(blade2);
    impellerGroup.position.y = -2;
    shaft.add(impellerGroup); 

    // 6. Feed Pipe 1
    const feedPipe1Geo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const feedPipe1 = new THREE.Mesh(feedPipe1Geo, pipeMaterial);
    feedPipe1.rotation.z = Math.PI / 2;
    feedPipe1.position.set(-2.5, 2.5, 0);
    group.add(feedPipe1);

    // 7. Feed Pipe 2
    const feedPipe2Geo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const feedPipe2 = new THREE.Mesh(feedPipe2Geo, pipeMaterial);
    feedPipe2.rotation.z = Math.PI / 2;
    feedPipe2.position.set(-2.5, 1.5, 0);
    group.add(feedPipe2);

    // 8. Product Discharge Pipe
    const dischargeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const dischargePipe = new THREE.Mesh(dischargeGeo, pipeMaterial);
    dischargePipe.rotation.z = Math.PI / 2;
    dischargePipe.position.set(2.5, -2.5, 0);
    group.add(dischargePipe);

    // 9. Baffles
    const bafflesGroup = new THREE.Group();
    const baffleGeo = new THREE.BoxGeometry(0.2, 5, 0.5);
    for (let i = 0; i < 4; i++) {
        const baffle = new THREE.Mesh(baffleGeo, steelMaterial);
        const angle = (Math.PI / 2) * i;
        baffle.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
        baffle.rotation.y = -angle;
        bafflesGroup.add(baffle);
    }
    group.add(bafflesGroup);

    // 10. Temperature Probe
    const probeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const probe = new THREE.Mesh(probeGeo, sensorMaterial);
    probe.position.set(1.2, 1, 1.2);
    group.add(probe);

    // Particles for mixing simulation
    const particleCount = 150;
    const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.userData = {
            angleOffset: Math.random() * Math.PI * 2,
            radius: Math.random() * 1.7 + 0.1,
            yOffset: (Math.random() - 0.5) * 5,
            speed: Math.random() * 4 + 2,
            verticalSpeed: (Math.random() - 0.5) * 2
        };
        group.add(p);
        particles.push(p);
    }

    const radPerSec = Math.PI * 4;

    group.userData.update = function(t) {
        shaft.rotation.y = radPerSec * t;
        
        particles.forEach(p => {
            const currentAngle = p.userData.angleOffset + p.userData.speed * t;
            const currentY = p.userData.yOffset + p.userData.verticalSpeed * t;
            
            // Wrap particles within the vessel height bounds (-2.5 to 2.5)
            const wrappedY = ((currentY + 2.5) % 5.0 + 5.0) % 5.0 - 2.5;
            
            p.position.x = Math.cos(currentAngle) * p.userData.radius;
            p.position.z = Math.sin(currentAngle) * p.userData.radius;
            p.position.y = wrappedY;
        });
    };

    group.userData.quiz = [
        {
            question: "What is the primary defining characteristic of a Continuous Stirred-Tank Reactor (CSTR)?",
            options: [
                "It operates in batches without continuous input.",
                "Reactants are continuously fed into the reactor and products are continuously withdrawn.",
                "It uses a fixed bed of catalyst to perform reactions.",
                "Temperature is always kept strictly at absolute zero."
            ],
            answer: 1
        },
        {
            question: "What is the primary function of baffles in a CSTR?",
            options: [
                "To increase the overall volume of the tank.",
                "To cool the reactor down rapidly.",
                "To prevent swirling and vortex formation, enhancing mixing.",
                "To filter out solid particles from the liquid."
            ],
            answer: 2
        },
        {
            question: "In an ideal CSTR, how does the concentration of reactants inside the reactor compare to the exit stream?",
            options: [
                "The concentration inside is perfectly uniform and identical to the exit stream.",
                "The concentration inside is higher than the exit stream.",
                "The concentration inside varies radially from the center to the walls.",
                "The concentration inside is lower than the exit stream."
            ],
            answer: 0
        },
        {
            question: "What is a cooling jacket used for in a CSTR?",
            options: [
                "To freeze the reactants for storage.",
                "To remove heat generated by exothermic reactions and control temperature.",
                "To protect the reactor from external physical impacts.",
                "To add heat to exothermic reactions."
            ],
            answer: 1
        },
        {
            question: "Which formula relates the volume (V), volumetric flow rate (v), and space time (τ) in a CSTR?",
            options: [
                "τ = V / v",
                "τ = v / V",
                "V = τ / v",
                "v = V * τ"
            ],
            answer: 0
        },
        {
            question: "When are CSTRs typically preferred over Plug Flow Reactors (PFRs)?",
            options: [
                "When a high conversion is needed in a very small volume.",
                "When handling reactions with highly viscous liquids or requiring intense agitation.",
                "For gas phase reactions requiring high pressure.",
                "When no mixing is required."
            ],
            answer: 1
        }
    ];

    return group;
}
