export function createSubsonicWindTunnel(THREE) {
    const group = new THREE.Group();

    const solidMaterial = new THREE.MeshStandardMaterial({color: 0x888888});
    const metalMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
    
    // 1. Test Section (central part where model goes)
    const testSectionGeo = new THREE.BoxGeometry(4, 2, 2);
    const testSectionMat = new THREE.MeshStandardMaterial({color: 0xaaddff, transparent: true, opacity: 0.3});
    const testSection = new THREE.Mesh(testSectionGeo, testSectionMat);
    testSection.position.set(0, 0, 0);
    group.add(testSection);

    // 2. Contraction Cone (front of test section)
    const contractionGeo = new THREE.CylinderGeometry(2, 3, 3, 32, 1, false, 0, Math.PI * 2);
    contractionGeo.rotateZ(Math.PI / 2);
    const contraction = new THREE.Mesh(contractionGeo, solidMaterial);
    contraction.position.set(-3.5, 0, 0);
    group.add(contraction);

    // 3. Honeycomb Flow Straightener (in front of contraction)
    const honeycombGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    honeycombGeo.rotateZ(Math.PI / 2);
    const honeycombMat = new THREE.MeshStandardMaterial({color: 0x333333, wireframe: true});
    const honeycomb = new THREE.Mesh(honeycombGeo, honeycombMat);
    honeycomb.position.set(-5.25, 0, 0);
    group.add(honeycomb);

    // 4. Nozzle (inlet)
    const nozzleGeo = new THREE.CylinderGeometry(3, 4, 2, 32);
    nozzleGeo.rotateZ(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeo, solidMaterial);
    nozzle.position.set(-6.5, 0, 0);
    group.add(nozzle);

    // 5. Diffuser (back of test section)
    const diffuserGeo = new THREE.CylinderGeometry(3, 1.414, 4, 32);
    diffuserGeo.rotateZ(Math.PI / 2);
    const diffuser = new THREE.Mesh(diffuserGeo, solidMaterial);
    diffuser.position.set(4, 0, 0);
    group.add(diffuser);

    // 6. Fan (inside diffuser/back section)
    const fanGroup = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, metalMaterial);
    fanGroup.add(hub);
    
    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 2.5, 0.5);
        const blade = new THREE.Mesh(bladeGeo, metalMaterial);
        blade.position.set(0, Math.cos(i * Math.PI / 2) * 1.25, Math.sin(i * Math.PI / 2) * 1.25);
        blade.rotation.x = i * Math.PI / 2;
        blade.rotation.y = Math.PI / 8; // pitch
        fanGroup.add(blade);
    }
    fanGroup.position.set(5.5, 0, 0);
    group.add(fanGroup);

    // 7. Stator (behind fan)
    const statorGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const vaneGeo = new THREE.BoxGeometry(0.2, 3, 0.2);
        const vane = new THREE.Mesh(vaneGeo, solidMaterial);
        vane.position.set(0, Math.cos(i * Math.PI / 3) * 1.5, Math.sin(i * Math.PI / 3) * 1.5);
        vane.rotation.x = i * Math.PI / 3;
        statorGroup.add(vane);
    }
    statorGroup.position.set(6.5, 0, 0);
    group.add(statorGroup);

    // 8. Airfoil Test Model
    const airfoilShape = new THREE.Shape();
    airfoilShape.moveTo(1, 0);
    airfoilShape.quadraticCurveTo(0, 0.5, -1, 0);
    airfoilShape.quadraticCurveTo(0, -0.2, 1, 0);
    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const airfoilGeo = new THREE.ExtrudeGeometry(airfoilShape, extrudeSettings);
    airfoilGeo.center();
    const airfoilMat = new THREE.MeshStandardMaterial({color: 0xff4444});
    const airfoil = new THREE.Mesh(airfoilGeo, airfoilMat);
    airfoil.position.set(0, 0, 0);
    group.add(airfoil);

    // 9. Mounting Sting (holding the airfoil)
    const stingGeo = new THREE.CylinderGeometry(0.1, 0.2, 2);
    const sting = new THREE.Mesh(stingGeo, metalMaterial);
    sting.position.set(1, -1, 0);
    sting.rotation.z = Math.PI / 4;
    group.add(sting);

    // 10. Pitot Tube (for measuring velocity)
    const pitotGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    pitotGeo.rotateZ(Math.PI / 2);
    const pitot = new THREE.Mesh(pitotGeo, metalMaterial);
    pitot.position.set(-1, 0.5, 0.5);
    group.add(pitot);

    // Particle system for airflow
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 14 - 7;
        positions[i * 3 + 1] = Math.random() * 2 - 1;
        positions[i * 3 + 2] = Math.random() * 2 - 1;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.1});
    const particles = new THREE.Points(particlesGeo, particlesMat);
    group.add(particles);

    // Add animation logic
    group.userData.animate = function(delta) {
        // Spin the fan
        fanGroup.rotation.x -= 10 * delta;
        
        // Move particles
        const posAttribute = particlesGeo.attributes.position;
        for (let i = 0; i < particleCount; i++) {
            posAttribute.array[i * 3] += 5 * delta;
            if (posAttribute.array[i * 3] > 7) {
                posAttribute.array[i * 3] = -7;
            }
        }
        posAttribute.needsUpdate = true;
    };

    // Add quiz questions
    group.userData.questions = [
        {
            question: "What is the primary purpose of the contraction cone in a wind tunnel?",
            options: ["To increase the air velocity and reduce turbulence", "To slow down the air", "To cool the air", "To measure the air pressure"],
            correctAnswer: 0
        },
        {
            question: "Which component is used to straighten the airflow and reduce large scale turbulence before it enters the test section?",
            options: ["Diffuser", "Honeycomb", "Fan", "Sting"],
            correctAnswer: 1
        },
        {
            question: "What does a Pitot tube measure in a wind tunnel?",
            options: ["Temperature", "Humidity", "Stagnation pressure to determine airspeed", "Model weight"],
            correctAnswer: 2
        },
        {
            question: "Why does the diffuser gradually increase in cross-sectional area?",
            options: ["To decrease air velocity and recover pressure, minimizing energy loss", "To speed up the air", "To hold the fan", "To create a vacuum"],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the stator vanes behind the fan?",
            options: ["To increase fan speed", "To remove the swirl or rotational motion introduced by the fan blades", "To measure thrust", "To cool the motor"],
            correctAnswer: 1
        },
        {
            question: "Which term describes the support structure holding the test model in the tunnel?",
            options: ["Stator", "Diffuser", "Sting", "Plenum"],
            correctAnswer: 2
        }
    ];

    return group;
}
