export function createSternGerlach(THREE) {
    const group = new THREE.Group();

    // 1. Silver Oven (Source of silver atoms)
    const ovenGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    ovenGeo.rotateX(Math.PI / 2);
    const ovenMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    const silverOven = new THREE.Mesh(ovenGeo, ovenMat);
    silverOven.position.set(0, 0, -10);
    silverOven.name = 'silverOven';
    group.add(silverOven);

    // 2. Heating Element (Coil around the oven)
    const heaterGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 64);
    const heaterMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xcc2200, metalness: 0.2, roughness: 0.5 });
    const heatingElement = new THREE.Mesh(heaterGeo, heaterMat);
    heatingElement.position.set(0, 0, -10);
    heatingElement.name = 'heatingElement';
    group.add(heatingElement);

    // 3. Collimating Slit 1
    const slitShape = new THREE.Shape();
    slitShape.moveTo(-2, -2);
    slitShape.lineTo(2, -2);
    slitShape.lineTo(2, 2);
    slitShape.lineTo(-2, 2);
    const hole = new THREE.Path();
    hole.moveTo(-0.1, -0.5);
    hole.lineTo(0.1, -0.5);
    hole.lineTo(0.1, 0.5);
    hole.lineTo(-0.1, 0.5);
    slitShape.holes.push(hole);
    const slitGeo = new THREE.ExtrudeGeometry(slitShape, { depth: 0.2, bevelEnabled: false });
    slitGeo.translate(0, 0, -0.1);
    const slitMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.6 });
    const collimatingSlit1 = new THREE.Mesh(slitGeo, slitMat);
    collimatingSlit1.position.set(0, 0, -6);
    collimatingSlit1.name = 'collimatingSlit1';
    group.add(collimatingSlit1);

    // 4. Collimating Slit 2
    const collimatingSlit2 = new THREE.Mesh(slitGeo, slitMat);
    collimatingSlit2.position.set(0, 0, -3);
    collimatingSlit2.name = 'collimatingSlit2';
    group.add(collimatingSlit2);

    // 5. Magnet North Pole (Pointed)
    const northShape = new THREE.Shape();
    northShape.moveTo(-1.2, 2.5);
    northShape.lineTo(1.2, 2.5);
    northShape.lineTo(1.2, 1.5);
    northShape.lineTo(0.1, 0.5);
    northShape.lineTo(-0.1, 0.5);
    northShape.lineTo(-1.2, 1.5);
    const northGeo = new THREE.ExtrudeGeometry(northShape, { depth: 4, bevelEnabled: false });
    northGeo.translate(0, 0, -2);
    const northMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.6, roughness: 0.4 });
    const magnetNorthPole = new THREE.Mesh(northGeo, northMat);
    magnetNorthPole.position.set(0, 0, 2.5);
    magnetNorthPole.name = 'magnetNorthPole';
    group.add(magnetNorthPole);

    // 6. Magnet South Pole (Grooved)
    const southShape = new THREE.Shape();
    southShape.moveTo(-1.2, -1.5);
    southShape.lineTo(1.2, -1.5);
    southShape.lineTo(1.2, -0.5);
    southShape.lineTo(0.5, -0.5);
    southShape.lineTo(0, -1.0);
    southShape.lineTo(-0.5, -0.5);
    southShape.lineTo(-1.2, -0.5);
    const southGeo = new THREE.ExtrudeGeometry(southShape, { depth: 4, bevelEnabled: false });
    southGeo.translate(0, 0, -2);
    const southMat = new THREE.MeshStandardMaterial({ color: 0x2222cc, metalness: 0.6, roughness: 0.4 });
    const magnetSouthPole = new THREE.Mesh(southGeo, southMat);
    magnetSouthPole.position.set(0, 0, 2.5);
    magnetSouthPole.name = 'magnetSouthPole';
    group.add(magnetSouthPole);

    // 7. Magnet Yoke (Connects the poles)
    const yokeShape = new THREE.Shape();
    yokeShape.moveTo(-1.2, -1.5);
    yokeShape.lineTo(-2.5, -1.5);
    yokeShape.lineTo(-2.5, 2.5);
    yokeShape.lineTo(-1.2, 2.5);
    yokeShape.lineTo(-1.2, 1.5);
    yokeShape.lineTo(-1.8, 1.5);
    yokeShape.lineTo(-1.8, -0.5);
    yokeShape.lineTo(-1.2, -0.5);
    const yokeGeo = new THREE.ExtrudeGeometry(yokeShape, { depth: 4, bevelEnabled: false });
    yokeGeo.translate(0, 0, -2);
    const yokeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 });
    const magnetYoke = new THREE.Mesh(yokeGeo, yokeMat);
    magnetYoke.position.set(0, 0, 2.5);
    magnetYoke.name = 'magnetYoke';
    group.add(magnetYoke);

    // 8. Detection Screen
    const screenGeo = new THREE.BoxGeometry(4, 5, 0.2);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xddffff, transparent: true, opacity: 0.8, roughness: 0.1 });
    const detectionScreen = new THREE.Mesh(screenGeo, screenMat);
    detectionScreen.position.set(0, 0, 9);
    detectionScreen.name = 'detectionScreen';
    group.add(detectionScreen);

    // 9. Screen Stand
    const standGeo = new THREE.CylinderGeometry(0.2, 0.4, 3, 16);
    standGeo.translate(0, -1.5, 0);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
    const screenStand = new THREE.Mesh(standGeo, standMat);
    screenStand.position.set(0, -2.5, 9);
    screenStand.name = 'screenStand';
    group.add(screenStand);

    // 10. Particle Streams (Instanced mesh for performance and animation)
    const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa });
    const particleCount = 60;
    const particleStreams = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particleStreams.name = 'particleStreams';
    group.add(particleStreams);

    // Pre-calculate random offsets to simulate a beam
    const dummy = new THREE.Object3D();
    const randomX = new Float32Array(particleCount);
    const randomY = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
        randomX[i] = (Math.random() - 0.5) * 0.1;
        randomY[i] = (Math.random() - 0.5) * 0.1;
    }

    let startTime = Date.now();

    function animate() {
        let t = (Date.now() - startTime) * 0.001;

        for (let i = 0; i < particleCount; i++) {
            let offset = i * 0.1;
            let localTime = (t + offset) % 6; // Particles cycle every 6 seconds
            let f = localTime / 6;
            let z = -10.5 + f * 20; // Travel from -10.5 to 9.5
            let y = 0;
            
            // Assign spin up (1) or spin down (-1)
            let spin = (i < 30) ? 1 : -1;

            if (z < 0.5) {
                // Before entering the magnetic field
                y = 0;
            } else if (z < 4.5) {
                // Inside the inhomogeneous magnetic field
                let dz = z - 0.5;
                // Path deviates quadratically
                y = spin * 0.01875 * dz * dz;
            } else {
                // After exiting the magnetic field, continuing in a straight line
                let dz_after = z - 4.5;
                y = spin * 0.3 + spin * 0.15 * dz_after;
            }

            let rx = randomX[i];
            let ry = randomY[i];

            dummy.position.set(rx, y + ry, z);

            // Hide particles before they leave the oven or after they hit the screen
            if (z < -9.0 || z > 8.9) {
                dummy.scale.set(0, 0, 0);
            } else {
                dummy.scale.set(1, 1, 1);
            }

            dummy.updateMatrix();
            particleStreams.setMatrixAt(i, dummy.matrix);
        }
        
        particleStreams.instanceMatrix.needsUpdate = true;
    }

    const quiz = [
        {
            question: "What property of the silver atoms is measured in the Stern-Gerlach experiment?",
            options: ["Charge", "Mass", "Quantum Spin", "Velocity"],
            correctAnswer: 2
        },
        {
            question: "Why does the beam of silver atoms split into two discrete paths?",
            options: [
                "Because of their different masses",
                "Due to the quantization of angular momentum (spin)",
                "Because they have opposite electrical charges",
                "Due to interference patterns like in the double-slit experiment"
            ],
            correctAnswer: 1
        },
        {
            question: "What kind of magnetic field is required for the Stern-Gerlach experiment?",
            options: [
                "A uniform magnetic field",
                "An inhomogeneous (non-uniform) magnetic field",
                "A rapidly oscillating magnetic field",
                "No magnetic field is required"
            ],
            correctAnswer: 1
        },
        {
            question: "If classical physics applied to the spin of silver atoms, what pattern would be observed on the screen?",
            options: [
                "Two discrete dots",
                "A continuous smear or line",
                "A single dot in the center",
                "An interference fringe pattern"
            ],
            correctAnswer: 1
        },
        {
            question: "Why were silver atoms used in the original experiment?",
            options: [
                "They are highly radioactive",
                "They have a single unpaired electron in their outer shell",
                "They have zero mass",
                "They are perfectly spherical"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the value of the intrinsic spin quantum number of an electron?",
            options: ["1", "0", "1/2", "2"],
            correctAnswer: 2
        }
    ];

    return {
        group,
        animate,
        quiz
    };
}
