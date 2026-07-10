export function createWindTunnel(THREE) {
    const group = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x2255aa, metalness: 0.3, roughness: 0.7 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.4 });
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const honeycombMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });

    // 1. Test Section
    const testSectionGeo = new THREE.BoxGeometry(4, 2, 2);
    const testSection = new THREE.Mesh(testSectionGeo, steelMaterial);
    testSection.position.set(0, 0, 0);
    group.add(testSection);

    // 2. Observation Window (placed on the side of the test section)
    const windowGeo = new THREE.PlaneGeometry(3, 1.5);
    const observationWindow = new THREE.Mesh(windowGeo, glassMaterial);
    observationWindow.position.set(0, 0, 1.01);
    group.add(observationWindow);

    // 3. Contraction Cone
    const contractionGeo = new THREE.CylinderGeometry(2, 1, 3, 32);
    contractionGeo.rotateZ(Math.PI / 2);
    const contractionCone = new THREE.Mesh(contractionGeo, blueMaterial);
    contractionCone.position.set(-3.5, 0, 0);
    group.add(contractionCone);

    // 4. Flow Straightener / Honeycomb
    const honeycombGeo = new THREE.CylinderGeometry(2, 2, 0.5, 16);
    honeycombGeo.rotateZ(Math.PI / 2);
    const flowStraightener = new THREE.Mesh(honeycombGeo, honeycombMaterial);
    flowStraightener.position.set(-5.25, 0, 0);
    group.add(flowStraightener);

    // 5. Diffuser
    const diffuserGeo = new THREE.CylinderGeometry(1, 2.5, 5, 32);
    diffuserGeo.rotateZ(Math.PI / 2);
    const diffuser = new THREE.Mesh(diffuserGeo, blueMaterial);
    diffuser.position.set(4.5, 0, 0);
    group.add(diffuser);

    // 6. Fan (inside diffuser/exhaust area)
    const fan = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, darkMetal);
    fan.add(hub);
    
    for (let i = 0; i < 5; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 2, 0.4);
        const blade = new THREE.Mesh(bladeGeo, darkMetal);
        blade.position.y = 1.1;
        
        const pivot = new THREE.Group();
        pivot.rotation.x = (i / 5) * Math.PI * 2;
        pivot.add(blade);
        fan.add(pivot);
    }
    fan.position.set(6, 0, 0);
    group.add(fan);

    // 7. Stator Vanes (stationary fins behind the fan)
    const statorVanes = new THREE.Group();
    const statorGeo = new THREE.BoxGeometry(0.1, 4.8, 0.5);
    for (let i = 0; i < 4; i++) {
        const vane = new THREE.Mesh(statorGeo, steelMaterial);
        const pivot = new THREE.Group();
        pivot.rotation.x = (i / 4) * Math.PI * 2 + Math.PI / 4;
        pivot.add(vane);
        statorVanes.add(pivot);
    }
    statorVanes.position.set(6.8, 0, 0);
    group.add(statorVanes);

    // 8. Exhaust
    const exhaustGeo = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
    exhaustGeo.rotateZ(Math.PI / 2);
    const exhaust = new THREE.Mesh(exhaustGeo, blueMaterial);
    exhaust.position.set(7.5, 0, 0);
    group.add(exhaust);

    // 9. Model Mount (sting inside test section)
    const mountGeo = new THREE.CylinderGeometry(0.05, 0.1, 1, 16);
    const modelMount = new THREE.Mesh(mountGeo, darkMetal);
    modelMount.position.set(0, -0.5, 0);
    group.add(modelMount);

    // 10. Pressure Sensors (top of test section)
    const sensorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const pressureSensors = new THREE.Group();
    for(let i = -1; i <= 1; i++) {
        const sensor = new THREE.Mesh(sensorGeo, sensorMaterial);
        sensor.position.set(i, 1.1, 0);
        pressureSensors.add(sensor);
    }
    group.add(pressureSensors);

    // Particles for flow animation
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 12; // x
        posArray[i*3+1] = (Math.random() - 0.5) * 1.5; // y
        posArray[i*3+2] = (Math.random() - 0.5) * 1.5; // z
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particlesGeo, particleMat);
    group.add(particles);

    // Animation
    group.userData.update = function(deltaTime) {
        fan.rotation.x -= 10 * deltaTime; // fan rotating
        
        const positions = particlesGeo.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            positions[i*3] += 8 * deltaTime; // move in x direction (flow from left to right)
            if (positions[i*3] > 7) {
                positions[i*3] = -5; // reset to start of flow straightener
                positions[i*3+1] = (Math.random() - 0.5) * 1.5;
                positions[i*3+2] = (Math.random() - 0.5) * 1.5;
            }
        }
        particlesGeo.attributes.position.needsUpdate = true;
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What is the primary purpose of the contraction cone in a wind tunnel?",
            options: ["To slow down the air", "To accelerate the air and improve flow quality", "To measure the air pressure", "To house the fan"],
            correctAnswer: 1
        },
        {
            question: "Where is the test model usually placed in a wind tunnel?",
            options: ["In the diffuser", "In the contraction cone", "In the test section", "In the exhaust"],
            correctAnswer: 2
        },
        {
            question: "What is the function of the honeycomb or flow straightener?",
            options: ["To reduce turbulence and create uniform laminar flow", "To heat the air", "To power the fan", "To collect exhaust gases"],
            correctAnswer: 0
        },
        {
            question: "Why does the diffuser expand in cross-sectional area?",
            options: ["To increase airspeed", "To slow down the airflow and recover pressure", "To store test models", "To increase air temperature"],
            correctAnswer: 1
        },
        {
            question: "Which component actually drives the air through the wind tunnel?",
            options: ["Stator vanes", "Test section", "Fan or compressor", "Observation window"],
            correctAnswer: 2
        },
        {
            question: "What is the role of the stator vanes?",
            options: ["To visualize the flow", "To mount the test model", "To remove swirl from the air flow created by the fan", "To measure airspeed"],
            correctAnswer: 2
        }
    ];

    return group;
}
