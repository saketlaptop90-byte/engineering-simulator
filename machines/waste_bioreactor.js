export function createWasteBioreactor(THREE) {
    const group = new THREE.Group();

    // Materials
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7, metalness: 0.1 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.8 });
    const hopperMat = new THREE.MeshStandardMaterial({ color: 0x44aa44, roughness: 0.6 });
    const controlMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const filterMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });

    // 1. Bio-chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.rotation.z = Math.PI / 2;
    chamber.castShadow = true;
    chamber.receiveShadow = true;
    group.add(chamber);

    // 2. Feed Hopper
    const hopperGeo = new THREE.CylinderGeometry(1.5, 0.5, 2, 16);
    const hopper = new THREE.Mesh(hopperGeo, hopperMat);
    hopper.position.set(-2, 3, 0);
    hopper.castShadow = true;
    group.add(hopper);

    // 3. Shredder
    const shredderGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const shredder = new THREE.Mesh(shredderGeo, metalMat);
    shredder.position.set(-2, 1.5, 0);
    shredder.castShadow = true;
    group.add(shredder);

    // 4. Agitator Shaft
    const agitator = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 6.2, 16);
    const shaft = new THREE.Mesh(shaftGeo, metalMat);
    shaft.rotation.z = Math.PI / 2;
    agitator.add(shaft);

    // Add paddles to the agitator shaft
    const paddleGeo = new THREE.BoxGeometry(0.1, 3.5, 0.4);
    for(let i=0; i<5; i++) {
        const paddle = new THREE.Mesh(paddleGeo, metalMat);
        paddle.position.set(-2 + i*1, 0, 0);
        paddle.rotation.x = i * Math.PI / 4;
        agitator.add(paddle);
    }
    group.add(agitator);

    // 5. Aeration Blower
    const blowerGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const blower = new THREE.Mesh(blowerGeo, metalMat);
    blower.position.set(0, -2.5, 0);
    blower.castShadow = true;
    group.add(blower);

    // 6. Temperature Sensor
    const sensorGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const sensor = new THREE.Mesh(sensorGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    sensor.position.set(1, 2.2, 0);
    group.add(sensor);

    // 7. Moisture Sprayer
    const sprayerGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const sprayer = new THREE.Mesh(sprayerGeo, metalMat);
    sprayer.position.set(0, 1.9, 0);
    group.add(sprayer);

    // 8. Exhaust Gas Filter
    const filterGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5);
    const filter = new THREE.Mesh(filterGeo, filterMat);
    filter.position.set(2, 2.75, 0);
    filter.castShadow = true;
    group.add(filter);

    // 9. Compost Discharge
    const dischargeGeo = new THREE.BoxGeometry(1.2, 1.5, 1.2);
    const discharge = new THREE.Mesh(dischargeGeo, hopperMat);
    discharge.position.set(2, -2, 0);
    discharge.castShadow = true;
    group.add(discharge);

    // 10. Control Unit
    const controlGeo = new THREE.BoxGeometry(0.5, 1.5, 1.5);
    const control = new THREE.Mesh(controlGeo, controlMat);
    control.position.set(0, 0, 2.25);
    
    // Control Unit Screen
    const screenGeo = new THREE.PlaneGeometry(0.4, 0.8);
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    screen.position.set(0.26, 0.2, 0);
    screen.rotation.y = Math.PI / 2;
    control.add(screen);
    
    group.add(control);

    // Animation
    group.userData.animate = function(delta) {
        // Rotate the agitator shaft
        agitator.rotation.x += delta * 1.5;
    };

    // Quiz Questions
    group.userData.questions = [
        {
            question: "What is the primary function of a waste bioreactor?",
            options: ["To store waste indefinitely", "To accelerate the decomposition of organic waste", "To burn waste at high temperatures", "To freeze organic matter"],
            answer: 1
        },
        {
            question: "Which part is responsible for breaking down large waste pieces before they enter the bio-chamber?",
            options: ["Shredder", "Aeration Blower", "Exhaust Gas Filter", "Moisture Sprayer"],
            answer: 0
        },
        {
            question: "Why is an agitator shaft important in a composting bioreactor?",
            options: ["It keeps the machine from moving", "It cools down the reactor", "It mixes the compost to ensure uniform decomposition and aeration", "It filters the outgoing gases"],
            answer: 2
        },
        {
            question: "What role does the aeration blower play?",
            options: ["It removes excess water", "It provides oxygen for aerobic microorganisms", "It creates a vacuum seal", "It powers the control unit"],
            answer: 1
        },
        {
            question: "Why is a moisture sprayer necessary in the bio-chamber?",
            options: ["To clean the interior", "To maintain optimal humidity for microbial activity", "To dilute toxic chemicals", "To cool the agitator shaft"],
            answer: 1
        },
        {
            question: "What does the exhaust gas filter do?",
            options: ["It removes odors and harmful gases from the released air", "It captures solid waste particles", "It generates electricity from biogas", "It prevents oxygen from entering"],
            answer: 0
        }
    ];

    return group;
}
