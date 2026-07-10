export function createVaccineColdChainDeliverySystem(THREE) {
    const group = new THREE.Group();

    // 1. transportTruckBase
    const truckGeometry = new THREE.BoxGeometry(10, 1, 4);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const transportTruckBase = new THREE.Mesh(truckGeometry, truckMaterial);
    transportTruckBase.position.y = 0.5;
    group.add(transportTruckBase);

    // 2. cryogenicStorageTank
    const tankGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const tankMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const cryogenicStorageTank = new THREE.Mesh(tankGeometry, tankMaterial);
    cryogenicStorageTank.position.set(0, 3, 0);
    group.add(cryogenicStorageTank);

    // 3. temperatureSensors
    const sensorGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const temperatureSensors = new THREE.Mesh(sensorGeometry, sensorMaterial);
    temperatureSensors.position.set(0, 5.1, 1.5);
    group.add(temperatureSensors);

    // 4. coolingCompressors
    const compressorGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const compressorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const coolingCompressors = new THREE.Mesh(compressorGeometry, compressorMaterial);
    coolingCompressors.position.set(3, 1.75, 0);
    group.add(coolingCompressors);

    // 5. vaccineVials
    const vialsGroup = new THREE.Group();
    const vialGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
    const vialMaterial = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true });
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const vial = new THREE.Mesh(vialGeometry, vialMaterial);
            vial.position.set(i * 0.4, 0, j * 0.4);
            vialsGroup.add(vial);
        }
    }
    vialsGroup.position.set(0, 1.5, 2.5);
    group.add(vialsGroup);

    // 6. insulatedWalls
    const wallGeometry = new THREE.BoxGeometry(8, 4, 0.2);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const insulatedWalls = new THREE.Mesh(wallGeometry, wallMaterial);
    insulatedWalls.position.set(0, 3, -2);
    group.add(insulatedWalls);

    // 7. monitoringDashboard
    const dashGeometry = new THREE.PlaneGeometry(1, 0.5);
    const dashMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const monitoringDashboard = new THREE.Mesh(dashGeometry, dashMaterial);
    monitoringDashboard.position.set(0, 4, 1.55);
    monitoringDashboard.rotation.x = -Math.PI / 8;
    group.add(monitoringDashboard);

    // 8. powerBackup
    const batteryGeometry = new THREE.BoxGeometry(2, 1, 1);
    const batteryMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const powerBackup = new THREE.Mesh(batteryGeometry, batteryMaterial);
    powerBackup.position.set(-3, 1.5, 0);
    group.add(powerBackup);

    // 9. loadingRamp
    const rampGeometry = new THREE.BoxGeometry(3, 0.2, 3);
    const rampMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const loadingRamp = new THREE.Mesh(rampGeometry, rampMaterial);
    loadingRamp.position.set(-6, 0.5, 0);
    loadingRamp.rotation.z = -Math.PI / 8;
    group.add(loadingRamp);

    // 10. airCirculationVents
    const ventsGroup = new THREE.Group();
    const ventGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const ventMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const airCirculationVents = new THREE.Mesh(ventGeometry, ventMaterial);
    airCirculationVents.rotation.x = Math.PI / 2;
    airCirculationVents.position.set(3, 1.75, 0.8);
    ventsGroup.add(airCirculationVents);
    
    const fanGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const fanMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.position.set(3, 1.75, 0.9);
    ventsGroup.add(fan);
    group.add(ventsGroup);

    // Cooling effect particles
    const coolingAuraGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coolingAuraMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const coolingAura = new THREE.Mesh(coolingAuraGeometry, coolingAuraMaterial);
    coolingAura.position.copy(vialsGroup.position);
    group.add(coolingAura);

    // Animation
    let time = 0;
    group.userData.update = function(delta) {
        time += delta;
        // Rotate fan
        fan.rotation.z += delta * 5;
        // Pulse cooling aura
        coolingAura.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
        coolingAura.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;
        // Blink sensor
        sensorMaterial.color.setHex(Math.sin(time * 5) > 0 ? 0xff0000 : 0x550000);
        // Dashboard flash
        dashMaterial.color.setHex(Math.random() > 0.95 ? 0x88ff88 : 0x00ff00);
    };

    group.userData.quiz = [
        {
            question: "What is the primary purpose of a vaccine cold chain?",
            options: [
                "To maintain optimal temperature during transport and storage",
                "To transport vaccines quickly",
                "To freeze all vaccines solid",
                "To sterilize the vaccine vials"
            ],
            answer: 0
        },
        {
            question: "What temperature range is typically required for standard vaccine refrigeration?",
            options: [
                "20°C to 25°C",
                "2°C to 8°C",
                "-20°C to 0°C",
                "-70°C to -50°C"
            ],
            answer: 1
        },
        {
            question: "Which component actively removes heat from the storage compartment?",
            options: [
                "Insulated walls",
                "Cooling compressor",
                "Temperature sensor",
                "Loading ramp"
            ],
            answer: 1
        },
        {
            question: "Why are ultra-low temperature freezers needed for certain mRNA vaccines?",
            options: [
                "To increase their volume",
                "To make them easier to inject",
                "To prevent rapid degradation of fragile genetic material",
                "To activate the immune response"
            ],
            answer: 2
        },
        {
            question: "What role does the power backup play in a cold chain delivery system?",
            options: [
                "Increases the speed of the transport truck",
                "Provides lighting for the dashboard",
                "Ensures continuous cooling during power outages or transport delays",
                "Heats the compartment if it gets too cold"
            ],
            answer: 2
        },
        {
            question: "How does the insulated wall contribute to the cold chain?",
            options: [
                "It generates cold air",
                "It minimizes heat transfer from the external environment",
                "It monitors the internal temperature",
                "It powers the cooling compressors"
            ],
            answer: 1
        }
    ];

    return group;
}
