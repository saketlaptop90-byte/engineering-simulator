export function createFiberOpticRouter(THREE) {
    const routerGroup = new THREE.Group();

    // Part 1: Main Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 1.5, 3);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.name = "Main Chassis";
    routerGroup.add(chassis);

    // Part 2: Fiber Ports
    const portsGroup = new THREE.Group();
    portsGroup.name = "Fiber Ports";
    const portGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const portMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    for(let i=0; i<8; i++) {
        const port = new THREE.Mesh(portGeo, portMat);
        port.position.set(-1.5 + i*0.4, 0, 1.55);
        portsGroup.add(port);
    }
    routerGroup.add(portsGroup);

    // Part 3: Cooling Fans
    const fansGroup = new THREE.Group();
    fansGroup.name = "Cooling Fans";
    const fanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const fan1 = new THREE.Mesh(fanGeo, fanMat);
    fan1.rotation.x = Math.PI / 2;
    fan1.position.set(-1, 0, -1.55);
    const fan2 = new THREE.Mesh(fanGeo, fanMat);
    fan2.rotation.x = Math.PI / 2;
    fan2.position.set(1, 0, -1.55);
    fansGroup.add(fan1, fan2);
    routerGroup.add(fansGroup);

    // Part 4: Power Supply
    const psuGeo = new THREE.BoxGeometry(1, 1, 1);
    const psuMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const psu = new THREE.Mesh(psuGeo, psuMat);
    psu.name = "Power Supply";
    psu.position.set(1.3, 0, -0.8);
    routerGroup.add(psu);

    // Part 5: Logic Board
    const boardGeo = new THREE.BoxGeometry(3.5, 0.1, 2.5);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x005500 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.name = "Logic Board";
    board.position.set(0, -0.6, 0);
    routerGroup.add(board);

    // Part 6: LED Indicators
    const ledsGroup = new THREE.Group();
    ledsGroup.name = "LED Indicators";
    const ledGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const leds = [];
    for(let i=0; i<8; i++) {
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(-1.5 + i*0.4, 0.25, 1.55);
        ledsGroup.add(led);
        leds.push(led);
    }
    routerGroup.add(ledsGroup);

    // Part 7: Routing Processor
    const processorGeo = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const processorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const processor = new THREE.Mesh(processorGeo, processorMat);
    processor.name = "Routing Processor";
    processor.position.set(-0.5, -0.5, 0);
    routerGroup.add(processor);

    // Part 8: Optical Transceivers
    const transceiversGroup = new THREE.Group();
    transceiversGroup.name = "Optical Transceivers";
    const transceiverGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const transceiverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    for(let i=0; i<4; i++) {
        const transceiver = new THREE.Mesh(transceiverGeo, transceiverMat);
        transceiver.position.set(-1.5 + i*0.8, 0, 1.4);
        transceiversGroup.add(transceiver);
    }
    routerGroup.add(transceiversGroup);

    // Part 9: Antenna
    const antennaGroup = new THREE.Group();
    antennaGroup.name = "Antenna";
    const baseGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(1.5, 0.8, 0);
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(1.5, 1.65, 0);
    antennaGroup.add(base, pole);
    routerGroup.add(antennaGroup);

    // Part 10: Heat Sink
    const heatSinkGroup = new THREE.Group();
    heatSinkGroup.name = "Heat Sink";
    const sinkBaseGeo = new THREE.BoxGeometry(0.9, 0.1, 0.9);
    const sinkMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const sinkBase = new THREE.Mesh(sinkBaseGeo, sinkMat);
    sinkBase.position.set(-0.5, -0.35, 0);
    heatSinkGroup.add(sinkBase);
    for(let i=0; i<5; i++) {
        const finGeo = new THREE.BoxGeometry(0.9, 0.3, 0.05);
        const fin = new THREE.Mesh(finGeo, sinkMat);
        fin.position.set(-0.5, -0.2, -0.4 + i*0.2);
        heatSinkGroup.add(fin);
    }
    routerGroup.add(heatSinkGroup);

    // Animation logic and Quiz
    let time = 0;
    routerGroup.userData = {
        update: function(deltaTime) {
            time += deltaTime;
            // Blink LEDs
            leds.forEach((led, index) => {
                if (Math.sin(time * 5 + index) > 0) {
                    led.material.color.setHex(0x00ff00);
                } else {
                    led.material.color.setHex(0x003300);
                }
            });
            
            // Spin fans
            fan1.rotation.y += deltaTime * 10;
            fan2.rotation.y += deltaTime * 10;
        },
        quiz: [
            {
                question: "What is the primary medium used in fiber optic routers to transmit data?",
                options: ["Copper wire", "Light pulses through glass/plastic strands", "Radio waves", "Microwaves"],
                answer: 1
            },
            {
                question: "Which component converts electrical signals into optical signals in a fiber router?",
                options: ["Cooling Fan", "Optical Transceiver", "Heat Sink", "Main Chassis"],
                answer: 1
            },
            {
                question: "What advantage does fiber optic networking have over traditional copper cables?",
                options: ["Lower bandwidth", "Higher susceptibility to electromagnetic interference", "Higher speed and greater distance", "Cheaper manufacturing cost for all applications"],
                answer: 2
            },
            {
                question: "What is the function of the Routing Processor?",
                options: ["To cool down the device", "To provide physical ports", "To determine the best path for data packets", "To emit light pulses"],
                answer: 2
            },
            {
                question: "What is a common wavelength used in fiber optic communications?",
                options: ["1310 nm", "400 nm", "700 nm", "10 mm"],
                answer: 0
            },
            {
                question: "Which of the following connector types is commonly used for fiber optic connections?",
                options: ["RJ45", "LC or SC", "USB", "HDMI"],
                answer: 1
            }
        ]
    };

    return routerGroup;
}
