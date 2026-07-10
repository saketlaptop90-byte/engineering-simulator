export function createMarsRoverPerseverance(THREE) {
    const group = new THREE.Group();

    // Materials
    const materialWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.1 });
    const materialBlack = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const materialGold = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4, metalness: 0.8 });
    const materialGrey = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5 });

    // 1. Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 3), materialWhite);
    chassis.position.set(0, 1.2, 0);
    chassis.userData = { id: 'chassis', name: 'Chassis' };
    group.add(chassis);

    // 2. Wheels
    const wheels = new THREE.Group();
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
        [-1.2, 0.4, 1.2], [1.2, 0.4, 1.2],   // Front
        [-1.4, 0.4, 0],   [1.4, 0.4, 0],     // Middle
        [-1.2, 0.4, -1.2],[1.2, 0.4, -1.2]   // Back
    ];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, materialBlack);
        wheel.position.set(...pos);
        wheels.add(wheel);
    });
    wheels.userData = { id: 'wheels', name: 'Wheels' };
    group.add(wheels);

    // 3. Suspension System
    const suspension = new THREE.Group();
    const suspGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8);
    suspGeo.rotateX(Math.PI / 2);
    const suspL = new THREE.Mesh(suspGeo, materialGrey);
    suspL.position.set(-1.2, 1.0, 0);
    const suspR = new THREE.Mesh(suspGeo, materialGrey);
    suspR.position.set(1.2, 1.0, 0);
    suspension.add(suspL, suspR);
    suspension.userData = { id: 'suspension', name: 'Suspension System' };
    group.add(suspension);

    // 4. Robotic Arm
    const roboticArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8), materialWhite);
    roboticArm.position.set(0, 1.0, 2.0);
    roboticArm.rotation.x = Math.PI / 4;
    roboticArm.userData = { id: 'robotic_arm', name: 'Robotic Arm' };
    group.add(roboticArm);

    // 5. SuperCam
    const superCam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), materialWhite);
    superCam.position.set(0.6, 2.8, 1.0);
    superCam.userData = { id: 'supercam', name: 'SuperCam' };
    group.add(superCam);

    // 6. MMRTG (Multi-Mission Radioisotope Thermoelectric Generator)
    const mmrtg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.0, 16), materialGold);
    mmrtg.rotation.z = Math.PI / 2;
    mmrtg.position.set(0, 1.5, -1.7);
    mmrtg.userData = { id: 'mmrtg', name: 'MMRTG' };
    group.add(mmrtg);

    // 7. UHF Antenna
    const uhfAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), materialGrey);
    uhfAntenna.position.set(-0.8, 2.2, -1.0);
    uhfAntenna.userData = { id: 'uhf_antenna', name: 'UHF Antenna' };
    group.add(uhfAntenna);

    // 8. Mastcam-Z
    const mastcamZ = new THREE.Group();
    const cameras = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.3), materialGrey);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2), materialWhite);
    mast.position.set(0, -0.6, 0);
    mastcamZ.add(cameras, mast);
    mastcamZ.position.set(0.6, 2.4, 1.0);
    mastcamZ.userData = { id: 'mastcam_z', name: 'Mastcam-Z' };
    group.add(mastcamZ);

    // 9. Cache Assembly
    const cacheAssembly = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), materialWhite);
    cacheAssembly.position.set(0, 0.6, 0.5);
    cacheAssembly.userData = { id: 'cache_assembly', name: 'Cache Assembly' };
    group.add(cacheAssembly);

    // 10. PIXL (Planetary Instrument for X-ray Lithochemistry)
    const pixl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), materialGrey);
    pixl.position.set(0, 0.4, 2.6); // Attached at the end of the robotic arm
    pixl.userData = { id: 'pixl', name: 'PIXL' };
    group.add(pixl);

    // Update function for animation
    group.update = function(delta) {
        // Rotate the wheels forward
        wheels.children.forEach(wheel => {
            wheel.rotation.x -= delta * 1.5;
        });
        
        // Slightly pan the SuperCam side to side
        superCam.rotation.y = Math.sin(Date.now() * 0.001) * 0.3;
    };

    // Quiz questions
    group.quizzes = [
        {
            question: "What is the primary power source for the Perseverance rover?",
            options: ["Solar Panels", "MMRTG", "Lithium-ion Battery", "Fuel Cells"],
            answer: 1
        },
        {
            question: "Which instrument is used for X-ray Lithochemistry at the end of the robotic arm?",
            options: ["Mastcam-Z", "SuperCam", "PIXL", "SHERLOC"],
            answer: 2
        },
        {
            question: "Where does the rover store the collected rock and soil sample tubes?",
            options: ["MMRTG", "Cache Assembly", "UHF Antenna", "Chassis"],
            answer: 1
        },
        {
            question: "Which instrument shoots a laser to study rock composition from a distance?",
            options: ["PIXL", "SuperCam", "Mastcam-Z", "MEDA"],
            answer: 1
        },
        {
            question: "How many wheels does the Perseverance rover use for mobility?",
            options: ["4", "6", "8", "10"],
            answer: 1
        },
        {
            question: "What is the main antenna used for communicating with orbiters around Mars?",
            options: ["High-Gain Antenna", "UHF Antenna", "VHF Antenna", "X-band Antenna"],
            answer: 1
        }
    ];

    return group;
}
