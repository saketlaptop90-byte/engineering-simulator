export function createTransformer(THREE) {
    const group = new THREE.Group();

    // 1. Primary Coil
    const primaryGeometry = new THREE.TorusGeometry(1.2, 0.4, 32, 100);
    const primaryMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 });
    const primaryCoil = new THREE.Mesh(primaryGeometry, primaryMaterial);
    primaryCoil.position.set(-1.5, 0, 0);
    primaryCoil.rotation.x = Math.PI / 2;
    primaryCoil.name = "Primary Coil";
    group.add(primaryCoil);

    // 2. Secondary Coil
    const secondaryGeometry = new THREE.TorusGeometry(1.2, 0.6, 32, 100);
    const secondaryMaterial = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.8, roughness: 0.4 });
    const secondaryCoil = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
    secondaryCoil.position.set(1.5, 0, 0);
    secondaryCoil.rotation.x = Math.PI / 2;
    secondaryCoil.name = "Secondary Coil";
    group.add(secondaryCoil);

    // 3. Iron Core
    const coreGeometry = new THREE.BoxGeometry(6, 4, 1.5);
    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.2 });
    const ironCore = new THREE.Mesh(coreGeometry, coreMaterial);
    ironCore.name = "Iron Core";
    group.add(ironCore);

    // 4. Insulation
    const insulationGeometry = new THREE.BoxGeometry(5.5, 3.5, 1.6);
    const insulationMaterial = new THREE.MeshStandardMaterial({ color: 0xddddcc, transparent: true, opacity: 0.3 });
    const insulation = new THREE.Mesh(insulationGeometry, insulationMaterial);
    insulation.name = "Insulation";
    group.add(insulation);

    // 5. Tank
    const tankGeometry = new THREE.BoxGeometry(8, 7, 5);
    const tankMaterial = new THREE.MeshStandardMaterial({ color: 0x334455, transparent: true, opacity: 0.3, metalness: 0.5 });
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    tank.name = "Tank";
    group.add(tank);

    // 6. Bushings
    const bushingsGroup = new THREE.Group();
    bushingsGroup.name = "Bushings";
    const bushingGeo = new THREE.CylinderGeometry(0.2, 0.4, 2, 16);
    const bushingMat = new THREE.MeshStandardMaterial({ color: 0xaa9988, roughness: 0.7 });
    for (let i = -1; i <= 1; i++) {
        const b = new THREE.Mesh(bushingGeo, bushingMat);
        b.position.set(i * 2, 4.5, 0);
        bushingsGroup.add(b);
    }
    group.add(bushingsGroup);

    // 7. Cooling Radiator
    const radiatorGroup = new THREE.Group();
    radiatorGroup.name = "Cooling Radiator";
    const radGeo = new THREE.BoxGeometry(0.1, 5, 2);
    const radMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.6 });
    for (let i = 0; i < 6; i++) {
        const rad1 = new THREE.Mesh(radGeo, radMat);
        rad1.position.set(4.1 + i * 0.3, 0, 0);
        radiatorGroup.add(rad1);
        
        const rad2 = new THREE.Mesh(radGeo, radMat);
        rad2.position.set(-4.1 - i * 0.3, 0, 0);
        radiatorGroup.add(rad2);
    }
    group.add(radiatorGroup);

    // 8. Conservator
    const conservatorGeometry = new THREE.CylinderGeometry(1, 1, 4, 32);
    const conservatorMaterial = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.5 });
    const conservator = new THREE.Mesh(conservatorGeometry, conservatorMaterial);
    conservator.position.set(0, 5, 2);
    conservator.rotation.z = Math.PI / 2;
    conservator.name = "Conservator";
    group.add(conservator);

    // 9. Breather
    const breatherGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const breatherMaterial = new THREE.MeshStandardMaterial({ color: 0x66ccff, transparent: true, opacity: 0.7 });
    const breather = new THREE.Mesh(breatherGeometry, breatherMaterial);
    breather.position.set(2, 4.5, 3);
    breather.name = "Breather";
    group.add(breather);

    // 10. Tap Changer
    const tapChangerGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const tapChangerMaterial = new THREE.MeshStandardMaterial({ color: 0x223344 });
    const tapChanger = new THREE.Mesh(tapChangerGeometry, tapChangerMaterial);
    tapChanger.position.set(-2, 2.5, 3);
    tapChanger.name = "Tap Changer";
    group.add(tapChanger);

    // Animation function
    let time = 0;
    group.userData.update = (delta) => {
        time += delta;
        // Pulsate primary coil
        const pIntensity = (Math.sin(time * 6) + 1) / 2;
        primaryMaterial.emissive.setHex(0xff8800);
        primaryMaterial.emissiveIntensity = pIntensity * 0.6;

        // Pulsate secondary coil (lower voltage, different phase)
        const sIntensity = (Math.sin(time * 6 + Math.PI) + 1) / 2;
        secondaryMaterial.emissive.setHex(0x0088ff);
        secondaryMaterial.emissiveIntensity = sIntensity * 0.4;
        
        // Micro-vibrations of the iron core
        ironCore.position.y = Math.sin(time * 50) * 0.02;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of a step-down transformer?",
            options: [
                "To increase voltage and decrease current",
                "To decrease voltage and increase current",
                "To convert AC to DC",
                "To change the frequency of the power supply"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component provides the magnetic path to channel the flux between the coils?",
            options: [
                "Bushings",
                "Cooling Radiator",
                "Iron Core",
                "Conservator"
            ],
            correctAnswer: 2
        },
        {
            question: "In a step-down transformer, how does the number of turns in the secondary coil compare to the primary coil?",
            options: [
                "It has more turns than the primary coil",
                "It has fewer turns than the primary coil",
                "It has the same number of turns",
                "It changes dynamically during operation"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Conservator tank in a transformer?",
            options: [
                "To store excess electrical charge",
                "To provide space for the expansion of insulating oil",
                "To step down the voltage",
                "To protect against lightning strikes"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component is responsible for extracting moisture from the air entering the conservator?",
            options: [
                "Tap Changer",
                "Bushings",
                "Breather",
                "Radiator"
            ],
            correctAnswer: 2
        },
        {
            question: "What does a Tap Changer do in a power transformer?",
            options: [
                "It changes the frequency of the current",
                "It allows for voltage regulation by altering the turn ratio",
                "It switches the transformer on and off",
                "It changes the phase of the alternating current"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
