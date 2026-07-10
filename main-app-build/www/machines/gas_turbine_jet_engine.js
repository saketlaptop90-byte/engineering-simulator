export function createGasTurbineJetEngine(THREE) {
    const model = new THREE.Group();

    // Materials
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4 });
    const compBladeMat = new THREE.MeshStandardMaterial({ color: 0x4444dd, roughness: 0.3 });
    const statorMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.5 });
    const combustorMat = new THREE.MeshStandardMaterial({ color: 0xaa3300, roughness: 0.7 });
    const injectorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const turbBladeMat = new THREE.MeshStandardMaterial({ color: 0xdd4444, roughness: 0.4 });
    const intakeMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide });
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });

    // 1. Air Intake
    const intakeGeo = new THREE.CylinderGeometry(2.5, 2.0, 1.5, 32, 1, true);
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.rotation.z = Math.PI / 2;
    intake.position.x = -5.75;
    model.add(intake);

    // 7. Central Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.z = Math.PI / 2;
    
    const rotatingGroup = new THREE.Group();
    rotatingGroup.add(shaft);
    model.add(rotatingGroup);

    // Helper for blades
    const createBlades = (x, radius, count, mat, isRotating) => {
        const stageGroup = new THREE.Group();
        stageGroup.position.x = x;
        for(let i=0; i<count; i++) {
            const bladeGeo = new THREE.BoxGeometry(0.2, radius, 0.05);
            bladeGeo.translate(0, radius/2 + 0.3, 0);
            const blade = new THREE.Mesh(bladeGeo, mat);
            blade.rotation.x = (i * Math.PI * 2) / count;
            blade.rotation.y = Math.PI / 6; // Twist
            stageGroup.add(blade);
        }
        if (isRotating) rotatingGroup.add(stageGroup);
        else model.add(stageGroup);
    };

    // 2. Axial Compressor Blades
    createBlades(-4.0, 1.6, 12, compBladeMat, true);
    createBlades(-3.2, 1.5, 12, compBladeMat, true);
    createBlades(-2.4, 1.4, 12, compBladeMat, true);

    // 9. Stator Vanes
    createBlades(-3.6, 1.55, 16, statorMat, false);
    createBlades(-2.8, 1.45, 16, statorMat, false);

    // 3. Combustion Chamber
    const combustorGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
    const combustor = new THREE.Mesh(combustorGeo, combustorMat);
    combustor.rotation.y = Math.PI / 2;
    combustor.position.x = -0.5;
    model.add(combustor);

    // 4. Fuel Injectors
    for(let i=0; i<8; i++) {
        const injGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const injector = new THREE.Mesh(injGeo, injectorMat);
        const angle = (i * Math.PI * 2) / 8;
        injector.position.x = -1.2;
        injector.position.y = 1.2 * Math.sin(angle);
        injector.position.z = 1.2 * Math.cos(angle);
        injector.rotation.x = -angle;
        injector.rotation.z = -Math.PI / 4;
        model.add(injector);
    }

    // 5. Turbine Blades
    createBlades(1.0, 1.3, 16, turbBladeMat, true);
    createBlades(2.0, 1.4, 16, turbBladeMat, true);

    // 6. Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(1.8, 1.2, 2.5, 32, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.x = 4.25;
    model.add(nozzle);

    // 8. Outer Casing
    const casingGeo = new THREE.CylinderGeometry(2.0, 1.8, 8, 32, 1, true);
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.z = Math.PI / 2;
    casing.position.x = -1.0;
    model.add(casing);

    // 10. Bypass Duct
    const ductGeo = new THREE.CylinderGeometry(2.6, 2.6, 11, 32, 1, true);
    const duct = new THREE.Mesh(ductGeo, ductMat);
    duct.rotation.z = Math.PI / 2;
    duct.position.x = -0.5;
    model.add(duct);

    // Fire particles for animation
    const fireGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
    const fires = [];
    for(let i=0; i<25; i++) {
        const f = new THREE.Mesh(fireGeo, fireMat);
        f.position.x = -0.5 + (Math.random() - 0.5) * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const r = 1.0 + Math.random() * 0.4;
        f.position.y = r * Math.sin(angle);
        f.position.z = r * Math.cos(angle);
        f.userData = { angle, r, speed: 0.05 + Math.random() * 0.05 };
        model.add(f);
        fires.push(f);
    }

    // Animation loop
    const update = (deltaTime) => {
        // Rotate shaft and blades
        rotatingGroup.rotation.x += 10 * deltaTime;

        // Animate combustion chamber glow
        const time = Date.now() * 0.005;
        const glow = 0.5 + 0.5 * Math.sin(time);
        combustor.material.emissive.setRGB(0.5 * glow, 0.1 * glow, 0);
        
        // Animate fire particles
        fires.forEach(f => {
            f.position.x += f.userData.speed * deltaTime * 60;
            if (f.position.x > 1.5) {
                f.position.x = -0.8;
                f.userData.angle = Math.random() * Math.PI * 2;
                f.userData.r = 1.0 + Math.random() * 0.4;
                f.position.y = f.userData.r * Math.sin(f.userData.angle);
                f.position.z = f.userData.r * Math.cos(f.userData.angle);
            }
            f.material.opacity = Math.max(0, 1.0 - (f.position.x + 0.8) / 2.3);
            
            // Flicker effect
            const rColor = 0.8 + Math.random() * 0.2;
            const gColor = 0.4 + Math.random() * 0.3;
            f.material.color.setRGB(rColor, gColor, 0);
        });
    };

    // Quiz
    const quiz = [
        {
            question: "Which thermodynamic cycle describes the operation of a gas turbine engine?",
            options: ["Otto cycle", "Diesel cycle", "Brayton cycle", "Rankine cycle"],
            answer: 2
        },
        {
            question: "What is the primary function of the compressor in a gas turbine engine?",
            options: ["To ignite the fuel", "To increase the pressure of incoming air", "To extract energy from the exhaust", "To cool the engine"],
            answer: 1
        },
        {
            question: "In which component is fuel injected and ignited?",
            options: ["Combustion chamber", "Air intake", "Turbine", "Bypass duct"],
            answer: 0
        },
        {
            question: "What drives the compressor in a basic turbojet engine?",
            options: ["An electric motor", "The bypass duct", "The turbine", "The combustion chamber"],
            answer: 2
        },
        {
            question: "What does the exhaust nozzle do?",
            options: ["Compresses the air", "Mixes fuel and air", "Accelerates exhaust gases to produce thrust", "Cools the turbine blades"],
            answer: 2
        },
        {
            question: "What is the advantage of a bypass duct in a turbofan engine compared to a turbojet?",
            options: ["It increases fuel efficiency and reduces noise", "It makes the engine smaller", "It eliminates the need for a compressor", "It burns fuel at a higher temperature"],
            answer: 0
        }
    ];

    return {
        model,
        update,
        quiz
    };
}
