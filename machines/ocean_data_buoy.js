export function createOceanDataBuoy(THREE) {
    const group = new THREE.Group();

    // Materials
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 }); // Yellow
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x003399, metalness: 0.5, roughness: 0.5 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });

    // Floating parts group
    const floatingParts = new THREE.Group();
    group.add(floatingParts);

    // 1. Floatation Hull
    const hullGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
    const floatationHull = new THREE.Mesh(hullGeo, hullMat);
    floatationHull.position.y = 0;
    floatingParts.add(floatationHull);

    // 2. Mast
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const mast = new THREE.Mesh(mastGeo, metalMat);
    mast.position.y = 2.75;
    floatingParts.add(mast);

    // 3. Anemometer
    const anemometerGroup = new THREE.Group();
    const crossGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const cross1 = new THREE.Mesh(crossGeo, metalMat);
    cross1.rotation.z = Math.PI / 2;
    const cross2 = new THREE.Mesh(crossGeo, metalMat);
    cross2.rotation.x = Math.PI / 2;
    anemometerGroup.add(cross1);
    anemometerGroup.add(cross2);
    
    const cupGeo = new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const positions = [
        [0.75, 0, 0], [-0.75, 0, 0], [0, 0, 0.75], [0, 0, -0.75]
    ];
    positions.forEach((pos, idx) => {
        const cup = new THREE.Mesh(cupGeo, cupMat);
        cup.position.set(pos[0], pos[1], pos[2]);
        if (idx === 0) cup.rotation.z = -Math.PI/2;
        if (idx === 1) cup.rotation.z = Math.PI/2;
        if (idx === 2) cup.rotation.x = Math.PI/2;
        if (idx === 3) cup.rotation.x = -Math.PI/2;
        anemometerGroup.add(cup);
    });
    anemometerGroup.position.y = 5.0;
    floatingParts.add(anemometerGroup);

    // 4. Solar Panels
    const panelGeo = new THREE.BoxGeometry(1.5, 1, 0.05);
    const panel1 = new THREE.Mesh(panelGeo, solarMat);
    panel1.position.set(1.1, 2.5, 0);
    panel1.rotation.z = -Math.PI / 6;
    panel1.rotation.y = Math.PI / 2;
    
    const panel2 = new THREE.Mesh(panelGeo, solarMat);
    panel2.position.set(-1.1, 2.5, 0);
    panel2.rotation.z = Math.PI / 6;
    panel2.rotation.y = -Math.PI / 2;

    floatingParts.add(panel1);
    floatingParts.add(panel2);

    // 5. Radar Reflector
    const reflectorGeo = new THREE.OctahedronGeometry(0.5);
    const radarReflector = new THREE.Mesh(reflectorGeo, metalMat);
    radarReflector.position.y = 3.8;
    floatingParts.add(radarReflector);

    // 6. Mooring Line
    const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const mooringLine = new THREE.Mesh(lineGeo, darkMetalMat);
    mooringLine.position.y = -5.75;
    group.add(mooringLine);

    // 7. Anchor
    const anchorGeo = new THREE.BoxGeometry(2, 1, 2);
    const anchor = new THREE.Mesh(anchorGeo, darkMetalMat);
    anchor.position.y = -11;
    group.add(anchor);

    // 8. Temperature String
    const tempStringGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    for(let i = 1; i <= 4; i++) {
        const node = new THREE.Mesh(nodeGeo, sensorMat);
        node.position.y = - (i * 2);
        node.position.x = 0.1; // slightly offset from line
        tempStringGroup.add(node);
    }
    group.add(tempStringGroup);

    // 9. Data Logger
    const loggerGeo = new THREE.BoxGeometry(0.8, 1, 0.6);
    const dataLogger = new THREE.Mesh(loggerGeo, whiteMat);
    dataLogger.position.set(0, 1.25, 1);
    floatingParts.add(dataLogger);

    // 10. Satellite Transmitter
    const domeGeo = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const satelliteTransmitter = new THREE.Mesh(domeGeo, whiteMat);
    satelliteTransmitter.position.y = 5.2;
    floatingParts.add(satelliteTransmitter);

    // Animation function attached to the main group
    let t = 0;
    group.userData.update = function(deltaTime) {
        const dt = deltaTime || 0.016;
        t += dt;
        
        // Animate anemometer rotation
        anemometerGroup.rotation.y -= dt * 3;
        
        // Animate buoy bobbing on the waves
        const bob = Math.sin(t * 2) * 0.3;
        floatingParts.position.y = bob;
        
        // Stretch mooring line dynamically
        const lineTop = -0.75 + bob;
        const lineBottom = -10.5;
        const lineLength = lineTop - lineBottom;
        mooringLine.scale.y = lineLength / 10;
        mooringLine.position.y = lineBottom + lineLength / 2;
        
        // Move temperature string nodes
        for(let i = 0; i < tempStringGroup.children.length; i++) {
            const node = tempStringGroup.children[i];
            const fraction = (i + 1) / 5;
            node.position.y = lineTop - (lineLength * fraction);
        }
    };

    const quiz = [
        {
            question: "What is the primary function of the floatation hull?",
            options: ["To store data", "To anchor the buoy", "To provide buoyancy and stability", "To measure water depth"],
            answer: 2
        },
        {
            question: "What does the anemometer on an ocean data buoy measure?",
            options: ["Water temperature", "Wind speed and direction", "Wave height", "Solar radiation"],
            answer: 1
        },
        {
            question: "How are ocean data buoys typically powered?",
            options: ["Diesel engines", "Solar panels and batteries", "Wind turbines only", "Nuclear reactors"],
            answer: 1
        },
        {
            question: "What is the purpose of the radar reflector?",
            options: ["To reflect sunlight", "To make the buoy visible to ship radars", "To bounce signals to satellites", "To measure wave frequency"],
            answer: 1
        },
        {
            question: "Why are temperature strings attached to the mooring line?",
            options: ["To measure air temperature", "To measure water temperature at various depths", "To strengthen the line", "To weigh down the buoy"],
            answer: 1
        },
        {
            question: "How does the buoy transmit the data it collects to researchers?",
            options: ["Undersea cables", "Satellite transmitter", "Physical retrieval only", "Radio broadcast to nearby ships"],
            answer: 1
        }
    ];

    return { group, quiz };
}
