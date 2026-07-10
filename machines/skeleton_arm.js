export function createSkeletonArm(THREE) {
    const root = new THREE.Group();
    root.name = "SkeletonArm";

    const boneMat = new THREE.MeshStandardMaterial({ 
        color: 0xe3dac9, 
        roughness: 0.7, 
        metalness: 0.1 
    });
    const jointMat = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc, 
        roughness: 0.9, 
        metalness: 0.0 
    });

    // 1. Humerus (Upper arm bone)
    const humerus = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 3, 16), boneMat);
    humerus.position.set(0, 1.5, 0); 
    root.add(humerus);

    // Elbow Pivot point
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, 0, 0); 
    root.add(elbowPivot);

    // 2. Elbow Joint
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), jointMat);
    elbowPivot.add(elbowJoint);

    // 3. Radius (Forearm bone, thumb side)
    const radius = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.8, 16), boneMat);
    radius.position.set(0.15, -1.4, 0);
    elbowPivot.add(radius);

    // 4. Ulna (Forearm bone, pinky side)
    const ulna = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 2.8, 16), boneMat);
    ulna.position.set(-0.15, -1.4, 0);
    elbowPivot.add(ulna);

    // Wrist Pivot point
    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, -2.8, 0);
    elbowPivot.add(wristPivot);

    // 5. Wrist Joint
    const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), jointMat);
    wristPivot.add(wristJoint);

    // 6. Carpals (Wrist bones)
    const carpals = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.3), boneMat);
    carpals.position.set(0, -0.3, 0);
    wristPivot.add(carpals);

    // Metacarpals Pivot
    const metacarpalsPivot = new THREE.Group();
    metacarpalsPivot.position.set(0, -0.5, 0);
    wristPivot.add(metacarpalsPivot);

    // 7. Metacarpals (Palm bones)
    const metacarpals = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.25), boneMat);
    metacarpals.position.set(0, -0.4, 0);
    metacarpalsPivot.add(metacarpals);

    // Proximal Pivot
    const proximalPivot = new THREE.Group();
    proximalPivot.position.set(0, -0.8, 0);
    metacarpalsPivot.add(proximalPivot);

    // 8. Proximal Phalanges (First finger segments)
    const proximalPhalanges = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.2), boneMat);
    proximalPhalanges.position.set(0, -0.3, 0);
    proximalPivot.add(proximalPhalanges);

    // Intermediate Pivot
    const intermediatePivot = new THREE.Group();
    intermediatePivot.position.set(0, -0.6, 0);
    proximalPivot.add(intermediatePivot);

    // 9. Intermediate Phalanges (Middle finger segments)
    const intermediatePhalanges = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.15), boneMat);
    intermediatePhalanges.position.set(0, -0.2, 0);
    intermediatePivot.add(intermediatePhalanges);

    // Distal Pivot
    const distalPivot = new THREE.Group();
    distalPivot.position.set(0, -0.4, 0);
    intermediatePivot.add(distalPivot);

    // 10. Distal Phalanges (Finger tips)
    const distalPhalanges = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.1), boneMat);
    distalPhalanges.position.set(0, -0.15, 0);
    distalPivot.add(distalPhalanges);

    // Allow parts to cast and receive shadows
    root.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Kinematics Update Function
    root.userData.update = function(time) {
        // Elbow bends forwards/backwards: 0 to ~120 degrees
        const elbowAngle = (Math.sin(time * 2) + 1) * 0.5 * (Math.PI / 1.5);
        elbowPivot.rotation.x = elbowAngle;
        
        // Forearm pronation/supination (rotation around Y axis)
        const forearmTwist = Math.sin(time * 1.5) * 0.5;
        elbowPivot.rotation.y = forearmTwist;

        // Wrist articulates (extension/flexion and radial/ulnar deviation)
        const wristExtension = Math.sin(time * 3) * 0.4;
        const wristDeviation = Math.cos(time * 2.5) * 0.2;
        wristPivot.rotation.x = wristExtension;
        wristPivot.rotation.z = wristDeviation;

        // Fingers curling motion
        const fingerCurl = (Math.sin(time * 4) + 1) * 0.5 * 0.6; // 0 to 0.6 radians
        metacarpalsPivot.rotation.x = fingerCurl * 0.2;
        proximalPivot.rotation.x = fingerCurl;
        intermediatePivot.rotation.x = fingerCurl * 1.2;
        distalPivot.rotation.x = fingerCurl * 1.2;
    };

    // Quiz Questions
    root.userData.quiz = [
        {
            question: "Which bone is located in the upper arm?",
            options: ["Humerus", "Radius", "Ulna", "Femur"],
            answer: 0
        },
        {
            question: "Which forearm bone is typically located on the thumb side?",
            options: ["Ulna", "Radius", "Humerus", "Fibula"],
            answer: 1
        },
        {
            question: "What is the group of bones that make up the wrist called?",
            options: ["Metacarpals", "Tarsals", "Phalanges", "Carpals"],
            answer: 3
        },
        {
            question: "The elbow joint acts primarily as what type of joint?",
            options: ["Ball and socket joint", "Hinge joint", "Saddle joint", "Gliding joint"],
            answer: 1
        },
        {
            question: "How many phalanges are typically in a human thumb?",
            options: ["1", "2", "3", "4"],
            answer: 1
        },
        {
            question: "Which motion describes the turning of the forearm so the palm faces upward?",
            options: ["Supination", "Pronation", "Flexion", "Extension"],
            answer: 0
        }
    ];

    return root;
}
