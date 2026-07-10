export function createHaberBoschReactor(THREE) {
    const reactorGroup = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const catalystMaterial = new THREE.MeshStandardMaterial({ color: 0x5c4033, metalness: 0.3, roughness: 0.9 });
    const heatExchangerMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.1 });
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
    const heaterMaterial = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 0.5 });
    const insulationMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.6, roughness: 0.9 });
    const gaugeMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.5 });
    const gasMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    // 1. Thick-Walled Steel Reactor
    const reactorGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    const reactor = new THREE.Mesh(reactorGeom, steelMaterial);
    reactorGroup.add(reactor);

    // 2. Catalyst Beds (Iron)
    const bedsGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const bedGeom = new THREE.CylinderGeometry(1.8, 1.8, 1, 32);
        const bed = new THREE.Mesh(bedGeom, catalystMaterial);
        bed.position.y = 1.5 - i * 1.5;
        bedsGroup.add(bed);
    }
    reactorGroup.add(bedsGroup);

    // 3. Heat Exchangers
    const heatExchangerGroup = new THREE.Group();
    const hexGeom = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    for (let i = 0; i < 4; i++) {
        const hex = new THREE.Mesh(hexGeom, heatExchangerMaterial);
        hex.rotation.x = Math.PI / 2;
        hex.position.y = 2.5 - i * 1.6;
        heatExchangerGroup.add(hex);
    }
    reactorGroup.add(heatExchangerGroup);

    // 4. Gas Inlet (N2/H2)
    const inletGeom = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const inlet = new THREE.Mesh(inletGeom, pipeMaterial);
    inlet.position.set(0, 5, 0);
    reactorGroup.add(inlet);

    // 5. Ammonia Outlet
    const outletGeom = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const outlet = new THREE.Mesh(outletGeom, pipeMaterial);
    outlet.position.set(0, -5, 0);
    reactorGroup.add(outlet);

    // 6. Unreacted Gas Recycle Loop
    const recycleLoopGeom = new THREE.TorusGeometry(3, 0.2, 16, 64, Math.PI);
    const recycleLoop = new THREE.Mesh(recycleLoopGeom, pipeMaterial);
    recycleLoop.position.set(2, 0, 0);
    recycleLoop.rotation.y = Math.PI / 2;
    recycleLoop.scale.set(1, 1.6, 1);
    reactorGroup.add(recycleLoop);
    
    // Connectors for recycle loop
    const recTop = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), pipeMaterial);
    recTop.rotation.z = Math.PI / 2;
    recTop.position.set(1, 4.8, 0);
    reactorGroup.add(recTop);

    const recBot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), pipeMaterial);
    recBot.rotation.z = Math.PI / 2;
    recBot.position.set(1, -4.8, 0);
    reactorGroup.add(recBot);

    // 7. Heating Elements
    const heatingGeom = new THREE.TorusGeometry(2.1, 0.15, 16, 64);
    const heaters = new THREE.Group();
    for(let i=0; i<6; i++) {
        const heater = new THREE.Mesh(heatingGeom, heaterMaterial);
        heater.rotation.x = Math.PI / 2;
        heater.position.y = 3 - i * 1.2;
        heaters.add(heater);
    }
    reactorGroup.add(heaters);

    // 8. Pressure Gauge
    const gaugeGroup = new THREE.Group();
    const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), gaugeMaterial);
    gaugeBody.rotation.x = Math.PI / 2;
    gaugeBody.position.set(0, 0, 2.2);
    
    const gaugeNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.05), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    gaugeNeedle.position.set(0, 0, 2.3);
    gaugeNeedle.geometry.translate(0, 0.2, 0); // pivot at base
    
    gaugeGroup.add(gaugeBody);
    gaugeGroup.add(gaugeNeedle);
    gaugeGroup.position.set(0, 2, 0);
    reactorGroup.add(gaugeGroup);

    // 9. Thermal Insulation
    const insulationGeom = new THREE.CylinderGeometry(2.4, 2.4, 8.2, 32);
    const insulation = new THREE.Mesh(insulationGeom, insulationMaterial);
    reactorGroup.add(insulation);

    // 10. Support Legs
    const legsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), steelMaterial);
        const angle = (i * Math.PI) / 2;
        leg.position.set(Math.cos(angle) * 1.5, -5.5, Math.sin(angle) * 1.5);
        legsGroup.add(leg);
    }
    reactorGroup.add(legsGroup);

    // Gas Particles (Kinematics)
    const particleCount = 20;
    const particles = new THREE.Group();
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), gasMaterial);
        particle.userData = {
            offset: Math.random() * Math.PI * 2,
            speed: 1 + Math.random(),
            path: Math.random() > 0.5 ? 'main' : 'recycle',
            progress: Math.random()
        };
        particles.add(particle);
    }
    reactorGroup.add(particles);

    // Kinematics Animation Loop
    reactorGroup.userData.update = function(t) {
        // Heating elements pulsing based on temperature fluctuations
        const intensity = 0.5 + Math.sin(t * 2) * 0.3;
        heaters.children.forEach(heater => {
            heater.material.emissiveIntensity = intensity;
        });

        // Pressure gauge needle fluctuating around high pressure (e.g. 200 atm)
        const pressureFluctuation = Math.sin(t * 5) * 0.1 + Math.cos(t * 3.1) * 0.05;
        // Needle rotation between -PI/4 and PI/4 corresponding to high pressure
        gaugeNeedle.rotation.z = -Math.PI / 4 + pressureFluctuation;

        // Gas Flow Kinematics
        particles.children.forEach(particle => {
            let p = particle.userData;
            p.progress += 0.01 * p.speed;
            if (p.progress > 1) {
                p.progress = 0;
                p.path = Math.random() > 0.3 ? 'main' : 'recycle'; // 30% recycle
            }

            if (p.path === 'main') {
                // Flow down through the reactor
                // From y = 6 (inlet) to y = -6 (outlet)
                const y = 6 - p.progress * 12;
                // Add some spiral/random movement inside the reactor
                const radius = p.progress > 0.1 && p.progress < 0.9 ? 1.5 : 0.2;
                const angle = p.offset + t * 2;
                particle.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
                particle.material.color.setHex(0x00ffff); // N2 + H2
            } else {
                // Recycle loop path
                // Ascend along the curved torus
                // Torus is centered at x=2, y=0, z=0, radius=3, rotated by PI/2 on Y, scaled on Y by 1.6
                // So the path is an ellipse
                const angle = -Math.PI/2 + p.progress * Math.PI; // from bottom to top
                particle.position.set(2 + Math.cos(angle) * 3, Math.sin(angle) * 4.8, 0);
                particle.material.color.setHex(0x00ff00); // Unreacted gas
            }
        });
    };

    // Quiz Questions
    reactorGroup.userData.quiz = [
        {
            question: "What are the primary reactants used in the Haber-Bosch process?",
            options: ["Carbon dioxide and Water", "Nitrogen and Hydrogen", "Methane and Oxygen", "Ammonia and Oxygen"],
            correctAnswer: 1
        },
        {
            question: "What catalyst is typically used in the Haber-Bosch process to speed up the reaction?",
            options: ["Platinum", "Vanadium(V) oxide", "Iron with promoters", "Nickel"],
            correctAnswer: 2
        },
        {
            question: "What is the typical operating pressure for the Haber-Bosch reactor to favor ammonia production?",
            options: ["1-5 atm", "10-50 atm", "150-300 atm", "1000-2000 atm"],
            correctAnswer: 2
        },
        {
            question: "What is the typical operating temperature range for the Haber-Bosch process?",
            options: ["0-100 °C", "200-300 °C", "400-500 °C", "800-1000 °C"],
            correctAnswer: 2
        },
        {
            question: "Why is an unreacted gas recycle loop necessary in the Haber-Bosch process?",
            options: ["To prevent explosion", "To cool down the reactor", "To increase overall yield due to low single-pass conversion", "To synthesize by-products"],
            correctAnswer: 2
        },
        {
            question: "What is the main chemical product of the Haber-Bosch process?",
            options: ["Ammonia", "Nitric Acid", "Urea", "Ammonium Nitrate"],
            correctAnswer: 0
        }
    ];

    return reactorGroup;
}
