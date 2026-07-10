export function createGeothermalHeatPump(THREE) {
    const group = new THREE.Group();

    // 1. Ground soil representation
    const soilGeo = new THREE.BoxGeometry(10, 5, 10);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, transparent: true, opacity: 0.4 });
    const groundSoil = new THREE.Mesh(soilGeo, soilMat);
    groundSoil.position.set(0, -2.5, 0);
    group.add(groundSoil);

    // 2. Underground ground loop pipes (Outer casing)
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 16);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const groundLoopPipe1 = new THREE.Mesh(pipeGeo, pipeMat);
    groundLoopPipe1.position.set(-2, -2.25, 0);
    const groundLoopPipe2 = new THREE.Mesh(pipeGeo, pipeMat);
    groundLoopPipe2.position.set(2, -2.25, 0);
    group.add(groundLoopPipe1);
    group.add(groundLoopPipe2);

    // Fluid for ground loop (animated)
    const loopCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(-2, -4, 0),
        new THREE.Vector3(2, -4, 0),
        new THREE.Vector3(2, 0, 0)
    ]);
    const fluidGeo = new THREE.TubeGeometry(loopCurve, 64, 0.1, 8, false);
    
    // Create a canvas texture for fluid dash animation to represent circulating fluid
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0000ff'; // darker blue
    ctx.fillRect(0, 0, 128, 16);
    ctx.fillStyle = '#00aaff'; // lighter blue
    ctx.fillRect(128, 0, 128, 16);
    const fluidTexture = new THREE.CanvasTexture(canvas);
    fluidTexture.wrapS = THREE.RepeatWrapping;
    fluidTexture.wrapT = THREE.RepeatWrapping;
    fluidTexture.repeat.set(10, 1);

    const fluidMat = new THREE.MeshBasicMaterial({ map: fluidTexture });
    const groundLoopFluid = new THREE.Mesh(fluidGeo, fluidMat);
    group.add(groundLoopFluid);

    // 3. Primary heat exchanger
    const hexGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const heatExchanger = new THREE.Mesh(hexGeo, metalMat);
    heatExchanger.position.set(0, 1, 0);
    group.add(heatExchanger);

    // 4. Compressor
    const compGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 });
    const compressor = new THREE.Mesh(compGeo, blackMat);
    compressor.position.set(-2, 0.75, 2);
    group.add(compressor);

    // 5. Reversing valve
    const revValveGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.2 });
    const reversingValve = new THREE.Mesh(revValveGeo, brassMat);
    reversingValve.position.set(-2, 2, 2);
    group.add(reversingValve);

    // 6. Expansion device
    const expGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const expansionDevice = new THREE.Mesh(expGeo, brassMat);
    expansionDevice.position.set(2, 2, 2);
    expansionDevice.rotation.z = Math.PI / 2;
    group.add(expansionDevice);

    // 7. Indoor air handler
    const airGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
    const greyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const airHandler = new THREE.Mesh(airGeo, greyMat);
    airHandler.position.set(3, 1.5, -2);
    group.add(airHandler);

    // 8. Blower fan
    const blowerGroup = new THREE.Group();
    const fanCenterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const fanCenter = new THREE.Mesh(fanCenterGeo, blackMat);
    fanCenter.rotation.x = Math.PI / 2;
    blowerGroup.add(fanCenter);

    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 0.8, 0.4);
        const blade = new THREE.Mesh(bladeGeo, blackMat);
        blade.position.y = 0.5;
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI) / 2;
        pivot.add(blade);
        blowerGroup.add(pivot);
    }
    blowerGroup.position.set(3, 2, -1);
    group.add(blowerGroup);

    // 9. Refrigerant lines
    const linesGroup = new THREE.Group();
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    
    const line1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), copperMat);
    line1.position.set(-1, 0.5, 1);
    line1.rotation.x = Math.PI / 2;
    line1.rotation.z = Math.PI / 4;
    linesGroup.add(line1);

    const line2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), copperMat);
    line2.position.set(-2, 1.5, 2);
    linesGroup.add(line2);

    const line3Geo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.7, 2, 2),
            new THREE.Vector3(3, 2, 2),
            new THREE.Vector3(3, 2, -0.5)
        ]), 20, 0.05, 8, false
    );
    const line3 = new THREE.Mesh(line3Geo, copperMat);
    linesGroup.add(line3);

    group.add(linesGroup);

    // 10. Thermostat
    const thermoGeo = new THREE.BoxGeometry(0.4, 0.3, 0.1);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const thermostat = new THREE.Mesh(thermoGeo, whiteMat);
    thermostat.position.set(5, 2, 0);
    
    const screenGeo = new THREE.PlaneGeometry(0.25, 0.15);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 0.051);
    thermostat.add(screen);
    group.add(thermostat);

    // Animation mixin
    group.tick = (delta) => {
        // Animate the fluid texture circulating through the ground loop
        if (fluidTexture) {
            fluidTexture.offset.x -= delta * 0.5;
        }

        // Animate blower fan rotating
        if (blowerGroup) {
            blowerGroup.rotation.z -= delta * 10;
        }
    };

    // 6 Quiz questions
    group.userData.quizzes = [
        {
            question: "What is the primary source of heat for a geothermal heat pump in winter?",
            options: ["The ground/soil", "The outside air", "The sun", "Electricity"],
            answer: 0
        },
        {
            question: "What component compresses the refrigerant gas to increase its temperature?",
            options: ["Expansion valve", "Compressor", "Evaporator", "Condenser"],
            answer: 1
        },
        {
            question: "Which part allows the heat pump to switch between heating and cooling modes?",
            options: ["Thermostat", "Expansion device", "Reversing valve", "Blower fan"],
            answer: 2
        },
        {
            question: "What happens to the refrigerant as it passes through the expansion device?",
            options: ["Its pressure and temperature drop", "Its pressure and temperature rise", "It turns into a solid", "It turns completely into a gas"],
            answer: 0
        },
        {
            question: "What is the function of the ground loop in a geothermal system?",
            options: ["To filter the indoor air", "To exchange heat with the earth", "To power the compressor", "To generate electricity"],
            answer: 1
        },
        {
            question: "The process of transferring heat from a colder area to a hotter area using mechanical work is based on which thermodynamic principle?",
            options: ["Zeroth Law of Thermodynamics", "Second Law of Thermodynamics (Refrigeration cycle)", "Ideal Gas Law", "Pascal's Principle"],
            answer: 1
        }
    ];

    return group;
}
