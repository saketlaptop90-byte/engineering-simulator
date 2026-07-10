export function createFusionRocketEngine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({color: 0x777777, metalness: 0.9, roughness: 0.4});
    const darkMetalMat = new THREE.MeshStandardMaterial({color: 0x333333, metalness: 0.8, roughness: 0.5});
    const shinyMetalMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 1.0, roughness: 0.1});
    const coilMat = new THREE.MeshStandardMaterial({color: 0xb87333, metalness: 0.6, roughness: 0.3});
    const fuelTankMat = new THREE.MeshStandardMaterial({color: 0x228822, metalness: 0.5, roughness: 0.4});
    const plasmaMat = new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, transparent: true, opacity: 0.7});
    const shieldMat = new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.2, roughness: 0.8});

    // 1. Magnetic Confinement Nozzle
    const nozzleGroup = new THREE.Group();
    const nozzleGeo = new THREE.CylinderGeometry(2, 6, 12, 32, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, metalMat);
    nozzle.position.set(0, -6, 0);
    nozzleGroup.add(nozzle);
    
    // Inner plasma (visual effect)
    const plasmaGeo = new THREE.CylinderGeometry(1.5, 5, 11, 32);
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.position.set(0, -6, 0);
    nozzleGroup.add(plasma);
    
    parts.push({name: 'Magnetic Confinement Nozzle', object: nozzleGroup});

    // 2. Plasma Heating Injectors
    const injectorsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const injectorGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 16);
        const injector = new THREE.Mesh(injectorGeo, shinyMetalMat);
        injector.rotation.x = Math.PI / 2;
        injector.position.set(Math.cos(i*Math.PI/2)*3.5, 0, Math.sin(i*Math.PI/2)*3.5);
        injectorsGroup.add(injector);
    }
    group.add(injectorsGroup);
    parts.push({name: 'Plasma Heating Injectors', object: injectorsGroup});

    // 3. Superconducting Coils
    const coilsGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const torusGeo = new THREE.TorusGeometry(3.5 + i*0.3, 0.4, 16, 64);
        const coil = new THREE.Mesh(torusGeo, coilMat);
        coil.rotation.x = Math.PI / 2;
        coil.position.set(0, -1 - i*1.5, 0);
        coilsGroup.add(coil);
    }
    parts.push({name: 'Superconducting Coils', object: coilsGroup});

    // 4. Deuterium-Tritium Fuel Tanks
    const tanksGroup = new THREE.Group();
    for(let i=0; i<2; i++) {
        const tankGeo = new THREE.CapsuleGeometry(1.5, 4, 16, 32);
        const tank = new THREE.Mesh(tankGeo, fuelTankMat);
        tank.position.set((i===0?-4:4), 6, 0);
        tanksGroup.add(tank);
    }
    group.add(tanksGroup);
    parts.push({name: 'Deuterium-Tritium Fuel Tanks', object: tanksGroup});

    // 5. Lithium Blanket
    const blanketGeo = new THREE.CylinderGeometry(4.5, 4.5, 6, 32);
    const blanket = new THREE.Mesh(blanketGeo, shieldMat);
    blanket.position.set(0, 2, 0);
    group.add(blanket);
    parts.push({name: 'Lithium Blanket', object: blanket});

    // 6. Radiation Shielding
    const shieldActualGeo = new THREE.CylinderGeometry(5.2, 5.2, 7, 32, 1, true);
    const shieldActual = new THREE.Mesh(shieldActualGeo, darkMetalMat);
    shieldActual.position.set(0, 2, 0);
    group.add(shieldActual);
    parts.push({name: 'Radiation Shielding', object: shieldActual});

    // 7. Laser Ignition Array
    const laserGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const laserDeviceGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
        const laserDevice = new THREE.Mesh(laserDeviceGeo, metalMat);
        const angle = i * Math.PI / 4;
        laserDevice.position.set(Math.cos(angle)*3, 4, Math.sin(angle)*3);
        laserDevice.lookAt(0, 0, 0);
        laserGroup.add(laserDevice);
    }
    group.add(laserGroup);
    parts.push({name: 'Laser Ignition Array', object: laserGroup});

    // 8. Heat Exchangers
    const exchangerGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const exGeo = new THREE.BoxGeometry(2, 6, 1);
        const exMesh = new THREE.Mesh(exGeo, darkMetalMat);
        const angle = i * Math.PI / 2 + Math.PI/4;
        exMesh.position.set(Math.cos(angle)*4, 3, Math.sin(angle)*4);
        exMesh.lookAt(0, 3, 0);
        exchangerGroup.add(exMesh);
    }
    group.add(exchangerGroup);
    parts.push({name: 'Heat Exchangers', object: exchangerGroup});

    // 9. Structural Spine
    const spineGeo = new THREE.CylinderGeometry(1, 1, 18, 16);
    const spine = new THREE.Mesh(spineGeo, metalMat);
    spine.position.set(0, 5, 0);
    group.add(spine);
    parts.push({name: 'Structural Spine', object: spine});

    // 10. Vector Control Gimbals
    const gimbalRig = new THREE.Group();
    const gimbalGeo = new THREE.TorusGeometry(4.5, 0.4, 16, 64);
    const gimbal = new THREE.Mesh(gimbalGeo, shinyMetalMat);
    gimbal.rotation.x = Math.PI / 2;
    gimbalRig.add(gimbal);
    gimbalRig.position.set(0, -1, 0);
    group.add(gimbalRig);
    parts.push({name: 'Vector Control Gimbals', object: gimbalRig});

    // Thrust vectoring assembly
    const thrustVectorGroup = new THREE.Group();
    thrustVectorGroup.position.set(0, -1, 0);
    thrustVectorGroup.add(nozzleGroup);
    thrustVectorGroup.add(coilsGroup);
    group.add(thrustVectorGroup);

    let time = 0;
    const tick = (dt) => {
        time += dt;

        // Plasma ignition pulses
        const pulse = (Math.sin(time * 15) + 1) / 2;
        plasmaMat.emissiveIntensity = 1.0 + pulse * 2.0;
        plasma.scale.set(1 + pulse*0.1, 1, 1 + pulse*0.1);

        // Magnetic field constriction
        coilsGroup.children.forEach((coil, index) => {
            const coilPulse = Math.sin(time * 5 + index) * 0.05;
            coil.scale.set(1 + coilPulse, 1 + coilPulse, 1 + coilPulse);
        });

        // Nozzle vectoring
        const vectorX = Math.sin(time * 1.2) * 0.15;
        const vectorZ = Math.cos(time * 0.8) * 0.15;
        thrustVectorGroup.rotation.x = vectorX;
        thrustVectorGroup.rotation.z = vectorZ;
        gimbal.rotation.x = Math.PI / 2 + vectorX;
        gimbal.rotation.y = vectorZ;
    };

    const questions = [
        {
            question: "What is the primary function of the superconducting coils in a fusion rocket?",
            options: [
                "To cool down the spacecraft",
                "To confine and direct the high-energy plasma",
                "To store electrical energy",
                "To generate thrust directly from electromagnetism"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is a lithium blanket typically used in D-T fusion reactors?",
            options: [
                "To breed tritium and absorb fast neutrons",
                "To provide structural support",
                "To lubricate the engine parts",
                "To act as the primary propellant"
            ],
            correctAnswer: 0
        },
        {
            question: "What role do the plasma heating injectors and laser ignition array play?",
            options: [
                "They navigate the ship",
                "They initiate and sustain the fusion reaction by providing necessary heat and pressure",
                "They communicate with ground control",
                "They cool the magnetic nozzle"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the main advantage of a fusion rocket engine over traditional chemical rockets?",
            options: [
                "It is much cheaper to build",
                "It produces zero radiation",
                "It has a significantly higher specific impulse (efficiency)",
                "It requires no fuel"
            ],
            correctAnswer: 2
        },
        {
            question: "How does the magnetic confinement nozzle produce thrust?",
            options: [
                "By burning chemical fuel in a combustion chamber",
                "By directing the fusion plasma out the back of the engine without it touching physical walls",
                "By spinning rapidly",
                "By emitting photons from a laser array"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the vector control gimbals?",
            options: [
                "To control the direction of the thrust for steering the spacecraft",
                "To measure the velocity of the exhaust",
                "To spin the fuel tanks",
                "To regulate the temperature of the lithium blanket"
            ],
            correctAnswer: 0
        }
    ];

    return {
        model: group,
        parts: parts,
        tick: tick,
        questions: questions
    };
}
