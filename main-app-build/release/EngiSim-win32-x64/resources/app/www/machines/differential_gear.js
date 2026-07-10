export function createDifferentialGear(THREE) {
    const group = new THREE.Group();

    // Materials
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const pinionMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.5, transparent: true, opacity: 0.4 });
    const spiderMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const sideMat = new THREE.MeshStandardMaterial({ color: 0x33aa33, metalness: 0.7, roughness: 0.3 });

    // Helper to create a Bevel Gear
    function createBevelGear(radiusTop, radiusBottom, thickness, teethCount, material) {
        const gear = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop * 0.8, radiusBottom * 0.8, thickness, 32), material);
        gear.add(body);

        const toothGeom = new THREE.BoxGeometry((radiusBottom - radiusTop)*0.5 + radiusTop*0.4, thickness, Math.max(0.1, radiusBottom * 0.15));
        for (let i = 0; i < teethCount; i++) {
            const angle = (i / teethCount) * Math.PI * 2;
            const tooth = new THREE.Mesh(toothGeom, material);
            const avgRad = (radiusTop + radiusBottom) / 2 * 0.85;
            tooth.position.set(Math.cos(angle) * avgRad, 0, Math.sin(angle) * avgRad);
            tooth.rotation.y = -angle;
            tooth.rotation.z = Math.atan2(radiusBottom - radiusTop, thickness);
            gear.add(tooth);
        }
        return gear;
    }

    // Input Group (Drive Shaft + Pinion Gear)
    const inputGroup = new THREE.Group();
    inputGroup.position.set(-0.5, 0, 0);
    group.add(inputGroup);

    // 1. Drive Shaft
    const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), shaftMat);
    driveShaft.rotation.x = Math.PI / 2;
    driveShaft.position.set(0, 0, -5.5);
    inputGroup.add(driveShaft);

    // 2. Pinion Gear
    const pinionGear = createBevelGear(0.3, 1.0, 1.0, 12, pinionMat);
    pinionGear.rotation.x = Math.PI / 2; 
    pinionGear.position.set(0, 0, -3.5);
    inputGroup.add(pinionGear);

    // Carrier Group (Ring Gear + Differential Case + Spider Gears)
    const carrierGroup = new THREE.Group();
    group.add(carrierGroup);

    // 3. Ring Gear
    const ringGear = createBevelGear(2.5, 3.2, 0.8, 36, ringMat);
    ringGear.rotation.z = -Math.PI / 2; 
    ringGear.position.set(-0.5, 0, 0);
    carrierGroup.add(ringGear);

    // 4. Differential Case
    const diffCase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 3, 32), caseMat);
    diffCase.rotation.z = Math.PI / 2; 
    diffCase.position.set(0, 0, 0);
    carrierGroup.add(diffCase);

    // 5. Spider Gear 1
    const spiderGear1 = createBevelGear(0.2, 0.7, 0.5, 10, spiderMat);
    spiderGear1.position.set(0, 1.2, 0);
    spiderGear1.rotation.x = Math.PI; 
    carrierGroup.add(spiderGear1);

    // 6. Spider Gear 2
    const spiderGear2 = createBevelGear(0.2, 0.7, 0.5, 10, spiderMat);
    spiderGear2.position.set(0, -1.2, 0);
    carrierGroup.add(spiderGear2);

    // Left and Right Axle Groups
    const leftAxleGroup = new THREE.Group();
    group.add(leftAxleGroup);

    const rightAxleGroup = new THREE.Group();
    group.add(rightAxleGroup);

    // 7. Side Gear Left
    const sideGearLeft = createBevelGear(0.4, 1.0, 0.6, 14, sideMat);
    sideGearLeft.rotation.z = -Math.PI / 2; 
    sideGearLeft.position.set(-0.8, 0, 0);
    leftAxleGroup.add(sideGearLeft);

    // 8. Side Gear Right
    const sideGearRight = createBevelGear(0.4, 1.0, 0.6, 14, sideMat);
    sideGearRight.rotation.z = Math.PI / 2; 
    sideGearRight.position.set(0.8, 0, 0);
    rightAxleGroup.add(sideGearRight);

    // 9. Left Axle
    const leftAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 16), shaftMat);
    leftAxle.rotation.z = Math.PI / 2;
    leftAxle.position.set(-3.5, 0, 0);
    leftAxleGroup.add(leftAxle);

    // 10. Right Axle
    const rightAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 16), shaftMat);
    rightAxle.rotation.z = Math.PI / 2;
    rightAxle.position.set(3.5, 0, 0);
    rightAxleGroup.add(rightAxle);

    // Expose parts for UI/Inspection if needed
    group.userData = {
        driveShaft, pinionGear, ringGear, diffCase, 
        spiderGear1, spiderGear2, sideGearLeft, sideGearRight, 
        leftAxle, rightAxle
    };

    // Kinematics Animation
    let time = 0;
    let carrierAngle = 0;
    let inputAngle = 0;
    let leftAngle = 0;
    let rightAngle = 0;
    let spiderAngle = 0;

    group.update = function(dt) {
        time += dt;

        // Input Drive Speed
        const w_drive = 3.0; 
        
        // Pinion to Ring Gear ratio
        const gear_ratio = 36 / 12; 
        const w_carrier = w_drive / gear_ratio;

        // Speed difference to simulate vehicle turning
        const w_diff = Math.sin(time * 0.8) * 1.5; 

        // Axle speeds (Carrier speed +/- differential speed)
        const w_left = w_carrier + w_diff;
        const w_right = w_carrier - w_diff;

        // Spider Gear internal rotation speed
        const spider_ratio = 14 / 10; 
        const w_spider = w_diff * spider_ratio;

        // Update angles
        inputAngle -= w_drive * dt; 
        carrierAngle -= w_carrier * dt; 
        leftAngle -= w_left * dt; 
        rightAngle -= w_right * dt; 
        spiderAngle -= w_spider * dt; 

        // Apply Rotations
        inputGroup.rotation.z = inputAngle; 
        carrierGroup.rotation.x = carrierAngle;
        leftAxleGroup.rotation.x = leftAngle;
        rightAxleGroup.rotation.x = rightAngle;

        // Spider gears counter-rotate relative to the case
        spiderGear1.rotation.y = spiderAngle;
        spiderGear2.rotation.y = -spiderAngle; 
    };

    // Quizzes
    group.quiz = [
        {
            question: "What is the primary function of a differential gear system?",
            options: [
                "To allow the drive wheels to rotate at different speeds",
                "To increase the engine's horsepower",
                "To apply braking force to the wheels",
                "To filter out engine vibrations"
            ],
            correctAnswer: 0
        },
        {
            question: "Which component directly receives power from the drive shaft?",
            options: [
                "Spider Gear",
                "Pinion Gear",
                "Side Gear",
                "Differential Case"
            ],
            correctAnswer: 1
        },
        {
            question: "When a vehicle is driving perfectly straight, what do the spider gears do?",
            options: [
                "They spin rapidly on their own axes",
                "They remain stationary relative to the differential case",
                "They lock the wheels completely",
                "They disconnect from the side gears"
            ],
            correctAnswer: 1
        },
        {
            question: "Which part is typically bolted directly to the differential case and rotates with it?",
            options: [
                "Pinion Gear",
                "Ring Gear",
                "Drive Shaft",
                "Axle Shaft"
            ],
            correctAnswer: 1
        },
        {
            question: "What connects the side gears to the vehicle's wheels?",
            options: [
                "Spider Gears",
                "Drive Shaft",
                "Axle Shafts",
                "Ring Gear"
            ],
            correctAnswer: 2
        },
        {
            question: "If the left wheel is forced to stop completely while the drive shaft is turning, what happens to the right wheel?",
            options: [
                "It also stops completely",
                "It rotates at the exact speed of the ring gear",
                "It rotates at twice the speed of the ring gear",
                "It rotates in the opposite direction"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
