export function createNextGenCellTower(THREE) {
    const group = new THREE.Group();

    // 1. Monopole Base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.8, 20, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const monopoleBase = new THREE.Mesh(baseGeo, baseMat);
    monopoleBase.position.y = 10;
    monopoleBase.name = "Monopole Base";
    group.add(monopoleBase);

    // 2. Maintenance Platform
    const platformGeo = new THREE.CylinderGeometry(2, 2, 0.2, 16);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const maintenancePlatform = new THREE.Mesh(platformGeo, platformMat);
    maintenancePlatform.position.y = 18;
    maintenancePlatform.name = "Maintenance Platform";
    group.add(maintenancePlatform);

    // 3. Sector Antennas
    const antennaGeo = new THREE.BoxGeometry(0.3, 2, 0.1);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const sectorAntennas = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const antenna = new THREE.Mesh(antennaGeo, antennaMat);
        const angle = (i / 3) * Math.PI * 2;
        antenna.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
        antenna.lookAt(0, 0, 0);
        sectorAntennas.add(antenna);
    }
    sectorAntennas.position.y = 19;
    sectorAntennas.name = "Sector Antennas";
    group.add(sectorAntennas);

    // 4. Remote Radio Unit
    const rruGeo = new THREE.BoxGeometry(0.4, 0.6, 0.2);
    const rruMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const remoteRadioUnit = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const rru = new THREE.Mesh(rruGeo, rruMat);
        const angle = (i / 3) * Math.PI * 2;
        rru.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
        rru.lookAt(0, 0, 0);
        remoteRadioUnit.add(rru);
    }
    remoteRadioUnit.position.y = 18.5;
    remoteRadioUnit.name = "Remote Radio Unit";
    group.add(remoteRadioUnit);

    // 5. Microwave Dish
    const dishGeo = new THREE.CylinderGeometry(0.8, 0.1, 0.3, 16);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const actualDishGroup = new THREE.Group();
    actualDishGroup.name = "Microwave Dish";
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.rotation.x = Math.PI / 2;
    dishMesh.rotation.z = Math.PI / 2;
    dishMesh.position.set(1.2, 0, 0);
    actualDishGroup.add(dishMesh);
    actualDishGroup.position.y = 15;
    group.add(actualDishGroup);

    // 6. Cabling Tray
    const trayGeo = new THREE.BoxGeometry(0.2, 18, 0.1);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const cablingTray = new THREE.Mesh(trayGeo, trayMat);
    cablingTray.position.set(0.6, 9, 0);
    cablingTray.name = "Cabling Tray";
    group.add(cablingTray);

    // 7. Lightning Rod
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const lightningRod = new THREE.Mesh(rodGeo, rodMat);
    lightningRod.position.set(0, 21.5, 0);
    lightningRod.name = "Lightning Rod";
    group.add(lightningRod);

    // 8. Grounding Ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.1, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xb87333 });
    const groundingRing = new THREE.Mesh(ringGeo, ringMat);
    groundingRing.rotation.x = Math.PI / 2;
    groundingRing.position.y = 0.1;
    groundingRing.name = "Grounding Ring";
    group.add(groundingRing);

    // 9. Baseband Unit
    const bbuGeo = new THREE.BoxGeometry(1.5, 2, 1);
    const bbuMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const basebandUnit = new THREE.Mesh(bbuGeo, bbuMat);
    basebandUnit.position.set(2, 1, 0);
    basebandUnit.name = "Baseband Unit";
    group.add(basebandUnit);

    // 10. Power Cabinet
    const powerGeo = new THREE.BoxGeometry(1.2, 1.8, 1.2);
    const powerMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const powerCabinet = new THREE.Mesh(powerGeo, powerMat);
    powerCabinet.position.set(-2, 0.9, 0);
    powerCabinet.name = "Power Cabinet";
    group.add(powerCabinet);

    // Animation
    group.userData.update = function(deltaTime) {
        const dt = deltaTime || 0.016;
        actualDishGroup.rotation.y += 0.5 * dt;
        
        const time = Date.now() * 0.005;
        const intensity = (Math.sin(time) + 1) / 2;
        antennaMat.emissive.setHex(0x00ff00);
        antennaMat.emissiveIntensity = intensity * 0.5;
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What is the primary function of the Baseband Unit (BBU) in a cell tower?",
            options: ["Generating backup power", "Processing baseband signals and managing radio resources", "Emitting microwave signals", "Grounding the tower"],
            answer: 1
        },
        {
            question: "Which component converts digital baseband signals into radio frequency (RF) signals?",
            options: ["Lightning Rod", "Remote Radio Unit (RRU)", "Cabling Tray", "Power Cabinet"],
            answer: 1
        },
        {
            question: "What is a key advantage of 5G technology over 4G?",
            options: ["Longer battery life for the tower", "Higher latency", "Massive MIMO and lower latency", "Fewer sector antennas required"],
            answer: 2
        },
        {
            question: "What is the purpose of the Microwave Dish on a cell tower?",
            options: ["To provide wireless backhaul connectivity to the core network", "To broadcast 5G directly to smartphones", "To distribute power to the RRUs", "To act as a lightning arrester"],
            answer: 0
        },
        {
            question: "Why are Sector Antennas typically arranged in a triangular configuration?",
            options: ["To make the tower look aesthetic", "To prevent bird nesting", "To provide 360-degree coverage by dividing the area into 120-degree sectors", "To reduce wind resistance"],
            answer: 2
        },
        {
            question: "What does the Grounding Ring protect the cell tower from?",
            options: ["Power surges and lightning strikes", "Software hacking", "Wind and earthquakes", "Signal interference from other towers"],
            answer: 0
        }
    ];

    return group;
}
