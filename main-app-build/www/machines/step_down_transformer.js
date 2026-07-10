export function createStepDownTransformer(THREE) {
    const group = new THREE.Group();
    
    // Materials
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8, metalness: 0.6 });
    const primaryMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.5, metalness: 0.7 });
    const secondaryMat = new THREE.MeshStandardMaterial({ color: 0x00008b, roughness: 0.5, metalness: 0.7 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x556b2f, transparent: true, opacity: 0.4, roughness: 0.2, metalness: 0.3 }); // Dark olive green transparent
    const finMat = new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 0.7, metalness: 0.4 });
    const insulatorMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.9, metalness: 0.1 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, roughness: 0.3, metalness: 0.8 });
    const fluxMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const energyMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });

    // 1. Laminated iron core
    const coreGroup = new THREE.Group();
    const legGeo = new THREE.BoxGeometry(1, 4, 1);
    const yokeGeo = new THREE.BoxGeometry(4, 1, 1);
    
    const leftLeg = new THREE.Mesh(legGeo, coreMat);
    leftLeg.position.set(-1.5, 0, 0);
    const rightLeg = new THREE.Mesh(legGeo, coreMat);
    rightLeg.position.set(1.5, 0, 0);
    const topYoke = new THREE.Mesh(yokeGeo, coreMat);
    topYoke.position.set(0, 2.5, 0);
    const bottomYoke = new THREE.Mesh(yokeGeo, coreMat);
    bottomYoke.position.set(0, -2.5, 0);
    
    // Core flux visualization
    const fluxLeft = new THREE.Mesh(legGeo, fluxMat);
    fluxLeft.position.set(-1.5, 0, 0);
    fluxLeft.scale.set(1.05, 1.05, 1.05);
    const fluxRight = new THREE.Mesh(legGeo, fluxMat);
    fluxRight.position.set(1.5, 0, 0);
    fluxRight.scale.set(1.05, 1.05, 1.05);
    const fluxTop = new THREE.Mesh(yokeGeo, fluxMat);
    fluxTop.position.set(0, 2.5, 0);
    fluxTop.scale.set(1.05, 1.05, 1.05);
    const fluxBottom = new THREE.Mesh(yokeGeo, fluxMat);
    fluxBottom.position.set(0, -2.5, 0);
    fluxBottom.scale.set(1.05, 1.05, 1.05);

    coreGroup.add(leftLeg, rightLeg, topYoke, bottomYoke);
    coreGroup.add(fluxLeft, fluxRight, fluxTop, fluxBottom);
    
    // 2. Primary coil (Step down: Primary has MORE turns, thinner wire)
    const primaryGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32);
    const primaryCoil = new THREE.Mesh(primaryGeo, primaryMat);
    primaryCoil.position.set(-1.5, 0, 0);
    
    // 3. Secondary coil (LESS turns, thicker wire)
    const secondaryGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32);
    const secondaryCoil = new THREE.Mesh(secondaryGeo, secondaryMat);
    secondaryCoil.position.set(1.5, 0, 0);

    // Main tank (Encasing the core and coils)
    const tankGeo = new THREE.BoxGeometry(5, 6, 3);
    const mainTank = new THREE.Mesh(tankGeo, tankMat);
    
    // 4. Cooling fins
    const coolingFins = new THREE.Group();
    const finGeometry = new THREE.BoxGeometry(0.1, 4, 0.5);
    for (let i = -2.2; i <= 2.2; i += 0.4) {
        const finFront = new THREE.Mesh(finGeometry, finMat);
        finFront.position.set(i, 0, 1.75);
        const finBack = new THREE.Mesh(finGeometry, finMat);
        finBack.position.set(i, 0, -1.75);
        coolingFins.add(finFront, finBack);
    }
    for (let i = -1.2; i <= 1.2; i += 0.4) {
        const finLeft = new THREE.Mesh(finGeometry, finMat);
        finLeft.rotation.y = Math.PI / 2;
        finLeft.position.set(-2.75, 0, i);
        const finRight = new THREE.Mesh(finGeometry, finMat);
        finRight.rotation.y = Math.PI / 2;
        finRight.position.set(2.75, 0, i);
        coolingFins.add(finLeft, finRight);
    }

    // 5. Bushing insulators
    const bushings = new THREE.Group();
    const createBushing = (x, y, z, scale) => {
        const bGroup = new THREE.Group();
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 1.5 * scale, 16), insulatorMat);
        bGroup.add(core);
        for(let i=0; i<6; i++) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(0.18 * scale, 0.06 * scale, 8, 16), insulatorMat);
            rib.rotation.x = Math.PI / 2;
            rib.position.y = -0.5 * scale + i * 0.2 * scale;
            bGroup.add(rib);
        }
        bGroup.position.set(x, y, z);
        return bGroup;
    };
    bushings.add(createBushing(-1.5, 3.75, 0.8, 1.2)); // Primary HV
    bushings.add(createBushing(-1.5, 3.75, -0.8, 1.2)); // Primary HV
    bushings.add(createBushing(1.5, 3.45, 0.8, 0.7)); // Secondary LV
    bushings.add(createBushing(1.5, 3.45, -0.8, 0.7)); // Secondary LV

    // 6. Tap changer
    const tapChanger = new THREE.Group();
    const tapBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), finMat);
    const tapDial = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), brassMat);
    tapDial.rotation.z = Math.PI / 2;
    tapDial.position.set(0.4, 0, 0);
    tapChanger.add(tapBox, tapDial);
    tapChanger.position.set(2.9, 1, 0);

    // 7. Conservator tank
    const conservatorTank = new THREE.Group();
    const consBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32), finMat);
    consBody.rotation.z = Math.PI / 2;
    const oilIndicator = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), new THREE.MeshStandardMaterial({color: 0xffffff}));
    oilIndicator.rotation.x = Math.PI / 2;
    oilIndicator.position.set(1.5, 0, 0.8);
    conservatorTank.add(consBody, oilIndicator);
    conservatorTank.position.set(0, 4.8, -1.2);

    // 8. Buchholz relay
    const buchholzRelay = new THREE.Group();
    const relayBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), brassMat);
    const relayPipeDown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.0), finMat);
    relayPipeDown.position.set(0, -0.5, 0);
    const relayPipeUp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), finMat);
    relayPipeUp.position.set(0, 0.5, 0);
    buchholzRelay.add(relayBody, relayPipeDown, relayPipeUp);
    buchholzRelay.position.set(0, 3.6, -1.2);

    // 9. Breather
    const breather = new THREE.Group();
    const breatherMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.7, roughness: 0.1 });
    const breatherBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.7, 16), breatherMat);
    const breatherCap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 16), brassMat);
    breatherCap.position.y = 0.4;
    const brPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), finMat);
    brPipe.position.set(0, 0.7, 0);
    breather.add(breatherBody, breatherCap, brPipe);
    breather.position.set(1.5, 3.5, -1.2);

    // 10. Oil drain valve
    const oilDrainValve = new THREE.Group();
    const valvePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), finMat);
    valvePipe.rotation.z = Math.PI / 2;
    const valveWheel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16), brassMat);
    valveWheel.rotation.y = Math.PI / 2;
    valveWheel.position.set(-0.3, 0, 0);
    oilDrainValve.add(valvePipe, valveWheel);
    oilDrainValve.position.set(-2.8, -2.5, 0);

    // Stylized energy transfer particles
    const particles = new THREE.Group();
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), energyMat);
        p.userData = { offset: i / particleCount };
        particles.add(p);
    }

    group.add(
        coreGroup, 
        primaryCoil, 
        secondaryCoil, 
        mainTank, 
        coolingFins, 
        bushings, 
        tapChanger, 
        conservatorTank, 
        buchholzRelay, 
        breather, 
        oilDrainValve, 
        particles
    );

    // Kinematics and Animation
    let time = 0;
    const update = function(delta) {
        time += delta;

        // Pulsating magnetic flux in the core
        const fluxOpacity = (Math.sin(time * 6) + 1) / 2 * 0.4; // Range 0 to 0.4
        fluxLeft.material.opacity = fluxOpacity;
        fluxRight.material.opacity = fluxOpacity;
        fluxTop.material.opacity = fluxOpacity;
        fluxBottom.material.opacity = fluxOpacity;

        // Stylized energy transfer: particles moving in a rectangular loop around the core
        particles.children.forEach((p) => {
            let t = (time * 0.3 + p.userData.offset) % 1.0;
            const pathLength = 16; // 2 * 3 (yokes) + 2 * 5 (legs)
            let dist = t * pathLength;
            
            if (dist < 3) {
                // Top yoke
                p.position.set(-1.5 + dist, 2.5, 0);
            } else if (dist < 8) {
                // Right leg
                p.position.set(1.5, 2.5 - (dist - 3), 0);
            } else if (dist < 11) {
                // Bottom yoke
                p.position.set(1.5 - (dist - 8), -2.5, 0);
            } else {
                // Left leg
                p.position.set(-1.5, -2.5 + (dist - 11), 0);
            }
            
            // Pulse particle scale
            const pScale = 0.5 + Math.sin(t * Math.PI * 40) * 0.5;
            p.scale.set(pScale, pScale, pScale);
        });
        
        // Coils pulsing slightly to simulate electromagnetism
        const coilPulse = 1 + fluxOpacity * 0.1;
        primaryCoil.scale.set(coilPulse, 1, coilPulse);
        secondaryCoil.scale.set(coilPulse, 1, coilPulse);
    };

    const quiz = [
        {
            question: "What is the primary principle behind the operation of a transformer?",
            options: ["Electromagnetic induction", "Electrostatic induction", "Ohm's Law", "Lorentz force"],
            correctAnswer: 0
        },
        {
            question: "In a step-down transformer, how does the number of turns in the primary coil compare to the secondary coil?",
            options: ["Primary has fewer turns", "Primary has more turns", "Both have equal turns", "Turns ratio varies dynamically"],
            correctAnswer: 1
        },
        {
            question: "Why is the iron core of a transformer laminated?",
            options: ["To increase magnetic flux", "To reduce eddy current losses", "To improve structural strength", "To increase the weight"],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Buchholz relay?",
            options: ["To regulate voltage", "To cool the transformer", "To detect internal gas faults and protect the transformer", "To change the tap settings"],
            correctAnswer: 2
        },
        {
            question: "What role does the breather play in a transformer?",
            options: ["Filters oil", "Absorbs moisture from the air entering the conservator", "Releases excess pressure", "Increases magnetic field"],
            correctAnswer: 1
        },
        {
            question: "Which component allows for the adjustment of the output voltage by changing the turns ratio?",
            options: ["Conservator tank", "Bushing insulators", "Tap changer", "Cooling fins"],
            correctAnswer: 2
        }
    ];

    return {
        mesh: group,
        update: update,
        quiz: quiz
    };
}
