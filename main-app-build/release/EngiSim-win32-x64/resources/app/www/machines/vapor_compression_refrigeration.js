export function createVaporCompressionRefrigeration(THREE) {
    const group = new THREE.Group();

    // 1. Compressor
    const compressorGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const compressorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const compressor = new THREE.Mesh(compressorGeo, compressorMat);
    compressor.position.set(-4, -2, 0);
    group.add(compressor);

    // 2. Condenser Coils
    const condenserGeo = new THREE.TorusGeometry(1, 0.2, 16, 100);
    const condenserMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const condenserCoils = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const coil = new THREE.Mesh(condenserGeo, condenserMat);
        coil.position.y = i * 0.5;
        coil.rotation.x = Math.PI / 2;
        condenserCoils.add(coil);
    }
    condenserCoils.position.set(4, 0, -2);
    group.add(condenserCoils);

    // 3. Evaporator Coils
    const evaporatorGeo = new THREE.TorusGeometry(1, 0.2, 16, 100);
    const evaporatorMat = new THREE.MeshStandardMaterial({ color: 0x2222aa });
    const evaporatorCoils = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const coil = new THREE.Mesh(evaporatorGeo, evaporatorMat);
        coil.position.y = i * 0.5;
        coil.rotation.x = Math.PI / 2;
        evaporatorCoils.add(coil);
    }
    evaporatorCoils.position.set(-4, 2, 0);
    group.add(evaporatorCoils);

    // 4. Expansion Valve
    const valveGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const valveMat = new THREE.MeshStandardMaterial({ color: 0xaaaa22 });
    const expansionValve = new THREE.Mesh(valveGeo, valveMat);
    expansionValve.position.set(0, 3, 0);
    group.add(expansionValve);

    // 5. High-Pressure Line
    const hpCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, -0.5, 0),
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(4, 0, -2)
    ]);
    const hpLineGeo = new THREE.TubeGeometry(hpCurve, 20, 0.1, 8, false);
    const hpLineMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const hpLine = new THREE.Mesh(hpLineGeo, hpLineMat);
    group.add(hpLine);

    // 6. Low-Pressure Line
    const lpCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 2, 0),
        new THREE.Vector3(-4, 0, 0),
        new THREE.Vector3(-4, -1, 0)
    ]);
    const lpLineGeo = new THREE.TubeGeometry(lpCurve, 20, 0.1, 8, false);
    const lpLineMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const lpLine = new THREE.Mesh(lpLineGeo, lpLineMat);
    group.add(lpLine);

    // 7. Cooling Fan
    const coolingFan = new THREE.Group();
    const fanGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const fanMesh = new THREE.Mesh(fanGeo, fanMat);
    fanMesh.rotation.x = Math.PI / 2;
    coolingFan.add(fanMesh);
    coolingFan.position.set(4, 1, 1);
    
    // Blades for fan
    const bladeGeo = new THREE.BoxGeometry(3, 0.1, 0.5);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade2.rotation.y = Math.PI / 2;
    fanMesh.add(blade1);
    fanMesh.add(blade2);
    group.add(coolingFan);

    // 8. Refrigerant Fluid
    const fluidGroup = new THREE.Group();
    const fluidGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const numParticles = 20;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(fluidGeo, mat);
        fluidGroup.add(mesh);
        particles.push({ mesh, offset: i / numParticles });
    }
    group.add(fluidGroup);

    // 9. Casing
    const casingGeo = new THREE.BoxGeometry(12, 8, 6);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.3 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.set(0, 1, 0);
    group.add(casing);

    // 10. Temperature Display
    const displayGeo = new THREE.PlaneGeometry(2, 1);
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const temperatureDisplay = new THREE.Mesh(displayGeo, displayMat);
    temperatureDisplay.position.set(0, 4, 3.1);
    group.add(temperatureDisplay);

    let fluidProgress = 0;
    const fullCycleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, -0.5, 0), // from compressor
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(4, 0, -2), // to condenser
        new THREE.Vector3(4, 2, -2), // up through condenser
        new THREE.Vector3(0, 3, 0), // to expansion valve
        new THREE.Vector3(-4, 2, 0), // to evaporator
        new THREE.Vector3(-4, -0.5, 0) // back to compressor
    ], true);

    function animate(deltaTime = 0.016) {
        // Fan rotation
        coolingFan.rotation.z += 5 * deltaTime;

        // Refrigerant flow
        fluidProgress += 0.2 * deltaTime;
        if (fluidProgress > 1) fluidProgress -= 1;
        
        for (let p of particles) {
            let prog = (fluidProgress + p.offset) % 1;
            const point = fullCycleCurve.getPoint(prog);
            p.mesh.position.copy(point);
            
            // Change color based on position in cycle
            if (prog < 0.4) {
                p.mesh.material.color.setHex(0xff0000); // High-pressure hot
            } else if (prog < 0.6) {
                p.mesh.material.color.setHex(0xffaa00); // Expansion phase
            } else {
                p.mesh.material.color.setHex(0x0000ff); // Low-pressure cold
            }
        }
    }

    const quiz = [
        {
            question: "What is the primary function of the compressor in a vapor compression refrigeration system?",
            options: [
                "To increase the pressure and temperature of the refrigerant vapor",
                "To condense the refrigerant into a liquid",
                "To expand the refrigerant and lower its pressure",
                "To absorb heat from the refrigerated space"
            ],
            answer: 0
        },
        {
            question: "In which component does the refrigerant release heat to the surroundings?",
            options: [
                "Evaporator",
                "Compressor",
                "Condenser",
                "Expansion Valve"
            ],
            answer: 2
        },
        {
            question: "What state is the refrigerant in as it enters the expansion valve?",
            options: [
                "High-pressure vapor",
                "Low-pressure liquid",
                "High-pressure liquid",
                "Low-pressure vapor"
            ],
            answer: 2
        },
        {
            question: "Which component is responsible for absorbing heat from the refrigerated space?",
            options: [
                "Condenser",
                "Compressor",
                "Expansion Valve",
                "Evaporator"
            ],
            answer: 3
        },
        {
            question: "What is the purpose of the expansion valve?",
            options: [
                "To compress the refrigerant vapor",
                "To reduce the pressure and temperature of the liquid refrigerant",
                "To reject heat to the environment",
                "To transport liquid refrigerant to the condenser"
            ],
            answer: 1
        },
        {
            question: "During which process does the refrigerant change from a liquid to a vapor?",
            options: [
                "Compression",
                "Condensation",
                "Expansion",
                "Evaporation"
            ],
            answer: 3
        }
    ];

    return {
        model: group,
        animate: animate,
        quiz: quiz
    };
}
