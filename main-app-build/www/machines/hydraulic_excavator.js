export function createHydraulicExcavator(THREE) {
    const excavator = new THREE.Group();

    // Materials
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xfcc72d }); // Excavator Yellow
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const hydraulicMat = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Silver
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

    // 1. Undercarriage
    const undercarriageGeom = new THREE.BoxGeometry(2, 0.5, 2.5);
    const undercarriage = new THREE.Mesh(undercarriageGeom, trackMat);
    undercarriage.position.y = 0.5;
    excavator.add(undercarriage);

    // 2. Tracks
    const trackGeom = new THREE.BoxGeometry(0.6, 0.8, 3.5);
    const leftTrack = new THREE.Mesh(trackGeom, trackMat);
    leftTrack.position.set(-1.3, 0, 0);
    const rightTrack = new THREE.Mesh(trackGeom, trackMat);
    rightTrack.position.set(1.3, 0, 0);
    undercarriage.add(leftTrack);
    undercarriage.add(rightTrack);

    // 3. Turntable (Slew Bearing)
    const turntableGeom = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const turntable = new THREE.Mesh(turntableGeom, engineMat);
    turntable.position.y = 0.35;
    undercarriage.add(turntable);

    const upperStructure = new THREE.Group();
    turntable.add(upperStructure);

    // 4. Engine Housing
    const engineGeom = new THREE.BoxGeometry(2.2, 1.2, 2);
    const engineHousing = new THREE.Mesh(engineGeom, bodyMat);
    engineHousing.position.set(0, 0.6, -0.5);
    upperStructure.add(engineHousing);

    // 5. Cab
    const cabGeom = new THREE.BoxGeometry(1, 1.5, 1.2);
    const cab = new THREE.Mesh(cabGeom, cabMat);
    cab.position.set(0.6, 1.35, 0.5);
    upperStructure.add(cab);

    // 6. Boom Pivot
    const boomPivotGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    boomPivotGeom.rotateX(Math.PI / 2);
    const boomPivot = new THREE.Mesh(boomPivotGeom, hydraulicMat);
    boomPivot.position.set(-0.3, 0.6, 1);
    upperStructure.add(boomPivot);

    const boomGroup = new THREE.Group();
    boomPivot.add(boomGroup);

    // 7. Boom
    const boomGeom = new THREE.BoxGeometry(0.4, 3, 0.4);
    boomGeom.translate(0, 1.5, 0);
    const boom = new THREE.Mesh(boomGeom, bodyMat);
    boom.rotation.x = Math.PI / 4; // Angle forward
    boomGroup.add(boom);

    // 8. Stick (Dipper)
    const stickPivot = new THREE.Group();
    // Position at the end of the boom
    stickPivot.position.set(0, 3 * Math.cos(Math.PI/4), 3 * Math.sin(Math.PI/4));
    boomGroup.add(stickPivot);

    const stickGeom = new THREE.BoxGeometry(0.3, 2.5, 0.3);
    stickGeom.translate(0, -1.25, 0);
    const stick = new THREE.Mesh(stickGeom, bodyMat);
    stickPivot.add(stick);

    // 9. Bucket
    const bucketPivot = new THREE.Group();
    bucketPivot.position.set(0, -2.5, 0);
    stickPivot.add(bucketPivot);

    const bucketGeom = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    bucketGeom.translate(0, -0.4, 0.2); // Offset to pivot point
    const bucket = new THREE.Mesh(bucketGeom, bucketMat);
    bucketPivot.add(bucket);

    // 10. Hydraulic Cylinders
    const cylinderGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const hydraulicCylinders = new THREE.Mesh(cylinderGeom, hydraulicMat);
    hydraulicCylinders.position.set(0, 1.5, 0.3);
    hydraulicCylinders.rotation.x = Math.PI / 4;
    boomGroup.add(hydraulicCylinders);

    // Kinematic Animation Logic
    excavator.userData.time = 0;
    excavator.userData.update = function(deltaTime) {
        excavator.userData.time += deltaTime;
        const t = excavator.userData.time;
        
        // Digging cycle animation
        turntable.rotation.y = Math.sin(t * 0.5) * 0.5; // Slew rotation
        boomPivot.rotation.x = Math.sin(t) * 0.3; // Boom lower and raise
        stickPivot.rotation.x = Math.cos(t) * 0.5 - 0.5; // Stick retract and extend
        bucketPivot.rotation.x = Math.sin(t) * 0.6 + 0.6; // Bucket curling
    };

    // Quiz Questions
    excavator.userData.quiz = [
        {
            question: "What is the primary function of the Boom on a hydraulic excavator?",
            options: ["To drive the vehicle", "To provide the main lifting power and reach", "To hold the operator", "To rotate the upper structure"],
            correct: 1
        },
        {
            question: "Which component connects the boom to the bucket?",
            options: ["Turntable", "Undercarriage", "Stick (Dipper)", "Tracks"],
            correct: 2
        },
        {
            question: "What allows the upper structure of the excavator to rotate 360 degrees?",
            options: ["The Tracks", "The Boom Pivot", "The Slew Bearing (Turntable)", "The Hydraulic Cylinders"],
            correct: 2
        },
        {
            question: "How is mechanical force transmitted to move the boom, stick, and bucket?",
            options: ["Electric motors", "Cables and pulleys", "Pneumatic air pressure", "Hydraulic cylinders and fluid pressure"],
            correct: 3
        },
        {
            question: "What part of the excavator is directly used to scoop and dig material?",
            options: ["The Cab", "The Bucket", "The Undercarriage", "The Stick"],
            correct: 1
        },
        {
            question: "Why do excavators typically use tracks instead of wheels?",
            options: ["To move faster on highways", "To distribute weight over a larger area on soft or uneven ground", "Because tracks are cheaper to maintain", "To increase fuel efficiency"],
            correct: 1
        }
    ];

    return excavator;
}
