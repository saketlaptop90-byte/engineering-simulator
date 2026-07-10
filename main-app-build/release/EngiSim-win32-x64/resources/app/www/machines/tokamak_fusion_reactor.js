export function createTokamakFusionReactor(THREE) {
    const group = new THREE.Group();
    group.name = "Tokamak_Fusion_Reactor";

    const parts = [];

    // 1. Toroidal Vacuum Vessel
    const vesselGeometry = new THREE.TorusGeometry( 10, 3, 32, 64, Math.PI * 1.5 );
    const vesselMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4, side: THREE.DoubleSide });
    const vacuumVessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
    vacuumVessel.rotation.x = Math.PI / 2;
    vacuumVessel.name = "Toroidal Vacuum Vessel";
    vacuumVessel.userData = { description: "The chamber where the plasma is contained." };
    group.add(vacuumVessel);
    parts.push(vacuumVessel);

    // 2. Central Solenoid
    const solenoidGeometry = new THREE.CylinderGeometry( 2, 2, 12, 32 );
    const solenoidMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.5 });
    const centralSolenoid = new THREE.Mesh(solenoidGeometry, solenoidMaterial);
    centralSolenoid.name = "Central Solenoid";
    centralSolenoid.userData = { description: "Provides the primary magnetic flux change to drive the plasma current." };
    group.add(centralSolenoid);
    parts.push(centralSolenoid);

    // 3. Poloidal Field Coils
    const pfcGroup = new THREE.Group();
    pfcGroup.name = "Poloidal Field Coils";
    pfcGroup.userData = { description: "Used to shape and position the plasma." };
    const pfcRadii = [14, 15, 14];
    const pfcHeights = [5, 0, -5];
    const pfcMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.5, roughness: 0.5 });
    for (let i = 0; i < 3; i++) {
        const pfcGeometry = new THREE.TorusGeometry(pfcRadii[i], 0.5, 16, 64);
        const pfc = new THREE.Mesh(pfcGeometry, pfcMaterial);
        pfc.rotation.x = Math.PI / 2;
        pfc.position.y = pfcHeights[i];
        pfcGroup.add(pfc);
    }
    group.add(pfcGroup);
    parts.push(pfcGroup);

    // 4. Toroidal Field Coils
    const tfcGroup = new THREE.Group();
    tfcGroup.name = "Toroidal Field Coils";
    tfcGroup.userData = { description: "Produce the toroidal magnetic field to confine the plasma." };
    const tfcMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, metalness: 0.7, roughness: 0.3 });
    const numTfc = 16;
    for (let i = 0; i < numTfc; i++) {
        const tfcGeometry = new THREE.TorusGeometry(7.5, 1.2, 16, 32);
        const tfc = new THREE.Mesh(tfcGeometry, tfcMaterial);
        const angle = (i / numTfc) * Math.PI * 2;
        tfc.position.x = Math.cos(angle) * 10;
        tfc.position.z = Math.sin(angle) * 10;
        tfc.rotation.y = -angle;
        tfcGroup.add(tfc);
    }
    group.add(tfcGroup);
    parts.push(tfcGroup);

    // 5. Plasma Torus
    const plasmaGeometry = new THREE.TorusGeometry( 10, 1.5, 32, 64 );
    const plasmaMaterial = new THREE.MeshBasicMaterial({ color: 0xff44ff, transparent: true, opacity: 0.8 });
    const plasmaTorus = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasmaTorus.rotation.x = Math.PI / 2;
    plasmaTorus.name = "Plasma Torus";
    plasmaTorus.userData = { description: "Superheated, ionized gas where fusion reactions occur." };
    group.add(plasmaTorus);
    parts.push(plasmaTorus);

    // 6. Diverter
    const diverterGeometry = new THREE.TorusGeometry( 9.5, 1, 16, 64 );
    const diverterMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.8 });
    const diverter = new THREE.Mesh(diverterGeometry, diverterMaterial);
    diverter.rotation.x = Math.PI / 2;
    diverter.position.y = -4;
    diverter.name = "Diverter";
    diverter.userData = { description: "Extracts heat and ash produced by the fusion reaction." };
    group.add(diverter);
    parts.push(diverter);

    // 7. Cryogenic Cooling System
    const coolingGroup = new THREE.Group();
    coolingGroup.name = "Cryogenic Cooling System";
    coolingGroup.userData = { description: "Cools the superconducting magnets to near absolute zero." };
    const coolingMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.3, roughness: 0.2 });
    for (let i = 0; i < 4; i++) {
        const pipeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 16, 16);
        const pipe = new THREE.Mesh(pipeGeometry, coolingMaterial);
        pipe.position.x = Math.cos((i/4)*Math.PI*2) * 17;
        pipe.position.z = Math.sin((i/4)*Math.PI*2) * 17;
        coolingGroup.add(pipe);
    }
    group.add(coolingGroup);
    parts.push(coolingGroup);

    // 8. Neutral Beam Injector
    const nbiGeometry = new THREE.BoxGeometry(4, 3, 8);
    const nbiMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 });
    const neutralBeamInjector = new THREE.Mesh(nbiGeometry, nbiMaterial);
    neutralBeamInjector.position.set(16, 0, 0);
    neutralBeamInjector.name = "Neutral Beam Injector";
    neutralBeamInjector.userData = { description: "Injects high-energy neutral atoms to heat the plasma." };
    group.add(neutralBeamInjector);
    parts.push(neutralBeamInjector);

    // 9. Microwave Heating Array
    const microwaveGeometry = new THREE.CylinderGeometry(1, 1, 4, 16);
    const microwaveMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.7, roughness: 0.3 });
    const microwaveHeatingArray = new THREE.Mesh(microwaveGeometry, microwaveMaterial);
    microwaveHeatingArray.rotation.z = Math.PI / 2;
    microwaveHeatingArray.position.set(0, 0, -15);
    microwaveHeatingArray.name = "Microwave Heating Array";
    microwaveHeatingArray.userData = { description: "Uses high-frequency electromagnetic waves to heat electrons or ions." };
    group.add(microwaveHeatingArray);
    parts.push(microwaveHeatingArray);

    // 10. Diagnostic Sensors
    const sensorGroup = new THREE.Group();
    sensorGroup.name = "Diagnostic Sensors";
    sensorGroup.userData = { description: "Measure plasma properties like temperature, density, and radiation." };
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 });
    for (let i = 0; i < 6; i++) {
        const sensorGeom = new THREE.SphereGeometry(0.5, 16, 16);
        const sensor = new THREE.Mesh(sensorGeom, sensorMaterial);
        const angle = (i / 6) * Math.PI * 2;
        sensor.position.set(Math.cos(angle) * 12, 5, Math.sin(angle) * 12);
        sensorGroup.add(sensor);
    }
    group.add(sensorGroup);
    parts.push(sensorGroup);

    // Animations
    let time = 0;
    group.tick = (delta) => {
        time += delta;

        // Plasma pulsing and circulating
        if (plasmaTorus) {
            plasmaTorus.scale.set(
                1 + Math.sin(time * 5) * 0.02,
                1 + Math.sin(time * 5) * 0.02,
                1 + Math.sin(time * 5) * 0.02
            );
            plasmaMaterial.opacity = 0.6 + Math.sin(time * 10) * 0.2;
            plasmaTorus.rotation.z -= delta * 2;
        }

        // Coils pulsing
        const pulse = 0.5 + Math.sin(time * 3) * 0.5;
        pfcMaterial.emissive.setHex(0x0000aa).multiplyScalar(pulse * 0.5);
        tfcMaterial.emissive.setHex(0x005500).multiplyScalar((1-pulse) * 0.5);
        
        // Sensor blinking
        sensorMaterial.emissive.setHex(0xff0000).multiplyScalar(Math.sin(time * 8) > 0 ? 1 : 0);
    };

    group.userData.quiz = [
        {
            question: "What is the main purpose of the Central Solenoid in a Tokamak?",
            options: [
                "To extract heat and ash",
                "To provide the primary magnetic flux change driving the plasma current",
                "To inject high-energy neutral atoms",
                "To cool the superconducting magnets"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component creates the toroidal magnetic field that wraps around the plasma?",
            options: [
                "Poloidal Field Coils",
                "Diagnostic Sensors",
                "Toroidal Field Coils",
                "Diverter"
            ],
            correctAnswer: 2
        },
        {
            question: "What state of matter is the fuel inside the Toroidal Vacuum Vessel?",
            options: [
                "Solid",
                "Liquid",
                "Gas",
                "Plasma"
            ],
            correctAnswer: 3
        },
        {
            question: "What is the function of the Diverter?",
            options: [
                "To generate microwave heating",
                "To extract heat and ash produced by the fusion reaction",
                "To provide cryogenic cooling",
                "To confine the plasma"
            ],
            correctAnswer: 1
        },
        {
            question: "Why is a Cryogenic Cooling System necessary in a Tokamak?",
            options: [
                "To cool the superconducting magnets to near absolute zero",
                "To freeze the plasma into a solid state",
                "To provide cold water for the researchers",
                "To lower the temperature of the neutral beam"
            ],
            correctAnswer: 0
        },
        {
            question: "How does a Neutral Beam Injector heat the plasma?",
            options: [
                "By using high-frequency electromagnetic waves",
                "By running an electrical current through it",
                "By injecting high-energy neutral atoms into the plasma",
                "By emitting alpha particles"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}

export { createTokamakFusionReactor as createModel };
