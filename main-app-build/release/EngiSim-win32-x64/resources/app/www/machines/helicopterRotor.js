export function createHelicopterRotorSystem(THREE) {
    const group = new THREE.Group();

    // 1. Mast
    const mastGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 5;
    group.add(mast);

    // 2. Swashplate Actuator (Base)
    const actuatorGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const actuatorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const actuator = new THREE.Mesh(actuatorGeo, actuatorMat);
    actuator.position.y = 1;
    group.add(actuator);

    // 3. Control Rods
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const controlRods = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const rod = new THREE.Mesh(rodGeo, rodMat);
        rod.position.set(Math.cos(i * Math.PI * 2 / 3) * 1.5, 2.5, Math.sin(i * Math.PI * 2 / 3) * 1.5);
        controlRods.add(rod);
    }
    group.add(controlRods);

    // 4. Non-Rotating Swashplate
    const nonRotSwashGeo = new THREE.CylinderGeometry(2, 2, 0.4, 32);
    const nonRotSwashMat = new THREE.MeshStandardMaterial({ color: 0x2244cc });
    const nonRotSwashplate = new THREE.Mesh(nonRotSwashGeo, nonRotSwashMat);
    nonRotSwashplate.position.y = 4;
    group.add(nonRotSwashplate);

    // Creating a rotating sub-group for things that spin with the mast
    const rotatingGroup = new THREE.Group();
    rotatingGroup.position.y = 0;
    group.add(rotatingGroup);

    // 5. Rotating Swashplate
    const rotSwashGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 32);
    const rotSwashMat = new THREE.MeshStandardMaterial({ color: 0xcc2222 });
    const rotSwashplate = new THREE.Mesh(rotSwashGeo, rotSwashMat);
    rotSwashplate.position.y = 4.4;
    rotatingGroup.add(rotSwashplate);

    // 6. Rotor Hub
    const hubGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.y = 10;
    rotatingGroup.add(hub);

    // 7. Main Rotor Blades
    const bladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(16, 0.1, 1.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        // Position blade so one end is at the hub
        blade.position.x = 8; 
        
        const bladePivot = new THREE.Group();
        bladePivot.add(blade);
        bladePivot.rotation.y = i * Math.PI / 2;
        bladePivot.position.y = 10;
        
        bladesGroup.add(bladePivot);
    }
    rotatingGroup.add(bladesGroup);

    // 8. Pitch Links
    const pitchLinkGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.2);
    const pitchLinkMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    for (let i = 0; i < 4; i++) {
        const pitchLink = new THREE.Mesh(pitchLinkGeo, pitchLinkMat);
        pitchLink.position.set(
            Math.cos(i * Math.PI / 2 + 0.2) * 1.6,
            7.2,
            Math.sin(i * Math.PI / 2 + 0.2) * 1.6
        );
        rotatingGroup.add(pitchLink);
    }

    // 9. Blade Dampers
    const damperGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
    const damperMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    for (let i = 0; i < 4; i++) {
        const damper = new THREE.Mesh(damperGeo, damperMat);
        damper.position.set(
            Math.cos(i * Math.PI / 2) * 2,
            10,
            Math.sin(i * Math.PI / 2) * 2
        );
        damper.rotation.y = -i * Math.PI / 2;
        rotatingGroup.add(damper);
    }

    // 10. Anti-torque Tail Rotor
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-15, 8, 0);
    
    // Tail boom 
    const boomGeo = new THREE.CylinderGeometry(0.6, 0.3, 15);
    const boom = new THREE.Mesh(boomGeo, mastMat);
    boom.rotation.z = Math.PI / 2;
    boom.position.set(-7.5, 8, 0);
    group.add(boom);

    const tailRotorHubGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5);
    const tailRotorHub = new THREE.Mesh(tailRotorHubGeo, hubMat);
    tailRotorHub.rotation.x = Math.PI / 2;
    tailGroup.add(tailRotorHub);

    const tailBladeGeo = new THREE.BoxGeometry(4, 0.4, 0.05);
    const tailBladeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const tailBlade1 = new THREE.Mesh(tailBladeGeo, tailBladeMat);
    const tailBlade2 = new THREE.Mesh(tailBladeGeo, tailBladeMat);
    tailBlade2.rotation.z = Math.PI / 2;
    tailGroup.add(tailBlade1);
    tailGroup.add(tailBlade2);

    group.add(tailGroup);

    // Animation
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        // Main rotor spin
        rotatingGroup.rotation.y -= delta * 5; 
        
        // Tail rotor spin
        tailGroup.rotation.x -= delta * 15;

        // Swashplate tilt (Cyclic control animation)
        const tiltX = Math.sin(time) * 0.1;
        const tiltZ = Math.cos(time) * 0.1;
        nonRotSwashplate.rotation.x = tiltX;
        nonRotSwashplate.rotation.z = tiltZ;
        rotSwashplate.rotation.x = tiltX;
        rotSwashplate.rotation.z = tiltZ;

        // Blade pitch variation based on swashplate tilt
        bladesGroup.children.forEach((bladePivot, index) => {
            const angle = index * Math.PI / 2 + rotatingGroup.rotation.y;
            const pitch = tiltX * Math.cos(angle) + tiltZ * Math.sin(angle);
            bladePivot.children[0].rotation.x = pitch;
        });
    };

    group.userData.questions = [
        {
            question: "What is the primary function of the tail rotor?",
            options: ["Provide forward thrust", "Counteract the torque from the main rotor", "Provide lift", "Steer the helicopter downwards"],
            correctAnswer: 1
        },
        {
            question: "Which component allows the pilot to change the pitch of the main rotor blades simultaneously?",
            options: ["Collective pitch control", "Cyclic pitch control", "Anti-torque pedals", "Throttle"],
            correctAnswer: 0
        },
        {
            question: "What does the cyclic control do?",
            options: ["Increases engine RPM", "Tilts the swashplate to change blade pitch individually as they rotate", "Controls the tail rotor pitch", "Moves the helicopter vertically"],
            correctAnswer: 1
        },
        {
            question: "What connects the rotating swashplate to the rotor blades to alter their pitch?",
            options: ["Control rods", "Pitch links", "Blade dampers", "Mast"],
            correctAnswer: 1
        },
        {
            question: "Why are blade dampers needed on a fully articulated rotor system?",
            options: ["To prevent the blades from snapping during lead-lag motion", "To stop the rotor from spinning when parked", "To reduce engine noise", "To provide structural support to the mast"],
            correctAnswer: 0
        },
        {
            question: "What happens when a helicopter enters autorotation?",
            options: ["The engine power is increased to maximum", "Upward flowing air turns the rotor to maintain lift without engine power", "The tail rotor takes over providing all lift", "The main rotor stops spinning completely"],
            correctAnswer: 1
        }
    ];

    return group;
}
