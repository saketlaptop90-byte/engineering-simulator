export function createNdYagLaser(THREE) {
    const group = new THREE.Group();

    // 1. Optical Cavity Base
    const baseGeom = new THREE.BoxGeometry(10, 0.5, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.set(0, -0.25, 0);
    base.userData.partName = "Optical Cavity Base";
    group.add(base);

    // 2. Power Supply
    const psGeom = new THREE.BoxGeometry(2, 2, 2);
    const psMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const powerSupply = new THREE.Mesh(psGeom, psMat);
    powerSupply.position.set(-2, 1, -2.5);
    powerSupply.userData.partName = "Power Supply";
    group.add(powerSupply);

    // 3. High Reflector Mirror
    const hrGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const hrMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1, roughness: 0.1 });
    const highReflector = new THREE.Mesh(hrGeom, hrMat);
    highReflector.rotation.z = -Math.PI / 2;
    highReflector.position.set(-4, 1, 0);
    highReflector.userData.partName = "High Reflector Mirror";
    group.add(highReflector);

    // 4. Nd:YAG Crystal Rod
    const rodGeom = new THREE.CylinderGeometry(0.15, 0.15, 4, 32);
    const rodMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffaaff, 
        transmission: 0.9, 
        opacity: 1, 
        transparent: true, 
        emissive: 0xff00ff, 
        emissiveIntensity: 0.2,
        roughness: 0.1 
    });
    const rod = new THREE.Mesh(rodGeom, rodMat);
    rod.rotation.z = -Math.PI / 2;
    rod.position.set(-1.5, 1, 0);
    rod.userData.partName = "Nd:YAG Crystal Rod";
    group.add(rod);

    // 5. Flashlamp Pump
    const flashGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 32);
    const flashMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffffff, 
        emissiveIntensity: 0 
    });
    const flashlamp = new THREE.Mesh(flashGeom, flashMat);
    flashlamp.rotation.z = -Math.PI / 2;
    flashlamp.position.set(-1.5, 1.4, 0);
    flashlamp.userData.partName = "Flashlamp Pump";
    group.add(flashlamp);

    // 6. Cooling Tube
    const tubeGeom = new THREE.CylinderGeometry(0.6, 0.6, 4.2, 32);
    const tubeMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x88ccff, 
        transmission: 0.8, 
        opacity: 0.3, 
        transparent: true, 
        roughness: 0.1 
    });
    const coolingTube = new THREE.Mesh(tubeGeom, tubeMat);
    coolingTube.rotation.z = -Math.PI / 2;
    coolingTube.position.set(-1.5, 1.2, 0);
    coolingTube.userData.partName = "Cooling Tube";
    group.add(coolingTube);

    // 7. Q-Switch
    const qsGeom = new THREE.BoxGeometry(0.8, 1, 0.8);
    const qsMat = new THREE.MeshStandardMaterial({ color: 0x2222ff, emissive: 0x0000aa, emissiveIntensity: 0 });
    const qSwitch = new THREE.Mesh(qsGeom, qsMat);
    qSwitch.position.set(1.5, 1, 0);
    qSwitch.userData.partName = "Q-Switch";
    group.add(qSwitch);

    // 8. Output Coupler Mirror
    const ocGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const ocMat = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa, 
        metalness: 0.8, 
        roughness: 0.3, 
        transparent: true, 
        opacity: 0.7 
    });
    const outputCoupler = new THREE.Mesh(ocGeom, ocMat);
    outputCoupler.rotation.z = -Math.PI / 2;
    outputCoupler.position.set(3, 1, 0);
    outputCoupler.userData.partName = "Output Coupler Mirror";
    group.add(outputCoupler);

    // 9. Focusing Lens
    const lensGeom = new THREE.SphereGeometry(0.4, 32, 16);
    const lensMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        transmission: 1.0, 
        opacity: 0.5, 
        transparent: true, 
        roughness: 0.05,
        clearcoat: 1 
    });
    const focusingLens = new THREE.Mesh(lensGeom, lensMat);
    focusingLens.scale.set(0.3, 1, 1);
    focusingLens.position.set(4.5, 1, 0);
    focusingLens.userData.partName = "Focusing Lens";
    group.add(focusingLens);

    // 10. Output Laser Beam
    const beamLength = 6;
    const beamGeom = new THREE.CylinderGeometry(0.05, 0.05, beamLength, 32);
    beamGeom.translate(0, beamLength / 2, 0);
    const beamMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0 
    });
    const laserBeam = new THREE.Mesh(beamGeom, beamMat);
    laserBeam.rotation.z = -Math.PI / 2;
    laserBeam.position.set(4.5, 1, 0);
    laserBeam.userData.partName = "Output Laser Beam";
    group.add(laserBeam);

    group.userData.quiz = [
        {
            question: "What does Nd:YAG stand for?",
            options: [
                "Neodymium-doped Yttrium Aluminum Garnet",
                "Nitrogen-doped Yttrium Aluminum Garnet",
                "Neodymium-doped Yttrium Argon Gas",
                "Neon-doped Yttrium Aluminum Garnet"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the typical fundamental wavelength of an Nd:YAG laser?",
            options: [
                "532 nm",
                "1064 nm",
                "632.8 nm",
                "10.6 µm"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the role of the flashlamp in this laser?",
            options: [
                "To cool down the crystal",
                "To reflect the laser beam",
                "To optically pump the Nd ions to a higher energy state",
                "To focus the output beam"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the purpose of the Q-Switch?",
            options: [
                "To continuously cool the laser",
                "To generate short, high-peak-power pulses",
                "To convert infrared light to visible light",
                "To supply continuous electrical power"
            ],
            correctAnswer: 1
        },
        {
            question: "How does the High Reflector Mirror differ from the Output Coupler Mirror?",
            options: [
                "The High Reflector lets light out, while the Output Coupler keeps it in",
                "There is no difference between them",
                "The High Reflector is made of glass, and the Output Coupler is made of plastic",
                "The High Reflector reflects ~100% of the light, while the Output Coupler allows some light to escape"
            ],
            correctAnswer: 3
        },
        {
            question: "What type of laser is an Nd:YAG laser?",
            options: [
                "Gas laser",
                "Solid-state laser",
                "Dye laser",
                "Semiconductor laser"
            ],
            correctAnswer: 1
        }
    ];

    group.update = (time) => {
        const cycle = time % 2; 
        
        if (cycle < 0.8) {
            flashlamp.material.emissiveIntensity = (cycle / 0.8) * 2;
            rod.material.emissiveIntensity = 0.2 + (cycle / 0.8) * 0.8;
            laserBeam.material.opacity = 0;
            laserBeam.scale.set(1, 0.01, 1);
            qSwitch.material.emissiveIntensity = 0.2;
        } else if (cycle < 1.2) {
            flashlamp.material.emissiveIntensity = 2 - ((cycle - 0.8) / 0.4) * 2;
            rod.material.emissiveIntensity = 1.0 - ((cycle - 0.8) / 0.4) * 0.5;
            
            laserBeam.material.opacity = 1;
            const progress = (cycle - 0.8) / 0.4;
            laserBeam.scale.set(1, progress, 1);
            
            qSwitch.material.emissiveIntensity = Math.random() > 0.5 ? 0.8 : 0;
            rod.material.emissiveIntensity += Math.sin(time * 50) * 0.3;
        } else if (cycle < 1.5) {
            rod.material.emissiveIntensity = 0.5 - ((cycle - 1.2) / 0.3) * 0.3;
            laserBeam.material.opacity = 1 - ((cycle - 1.2) / 0.3);
            qSwitch.material.emissiveIntensity = 0.2;
        } else {
            flashlamp.material.emissiveIntensity = 0;
            rod.material.emissiveIntensity = 0.2;
            laserBeam.material.opacity = 0;
            qSwitch.material.emissiveIntensity = 0;
        }
    };

    return group;
}
