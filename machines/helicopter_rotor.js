export function createHelicopterRotor(THREE) {
    const group = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const aluminumMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.6, roughness: 0.4 });
    const compositeMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.2, roughness: 0.8 });
    const rubberMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.4 });

    // 1. Mast (Central shaft)
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
    const mast = new THREE.Mesh(mastGeo, steelMaterial);
    group.add(mast);

    // 2. Control Rods (inside or alongside mast)
    const controlRodsGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const controlRods1 = new THREE.Mesh(controlRodsGeo, aluminumMaterial);
    controlRods1.position.set(0.3, -1, 0);
    const controlRods2 = new THREE.Mesh(controlRodsGeo, aluminumMaterial);
    controlRods2.position.set(-0.3, -1, 0);
    group.add(controlRods1);
    group.add(controlRods2);

    const swashplateTiltGroup = new THREE.Group();
    swashplateTiltGroup.position.y = 0;
    group.add(swashplateTiltGroup);

    // 3. Non-rotating swashplate
    const nonRotSwashGrp = new THREE.Group();
    const nonRotatingSwashplateGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 64);
    const nonRotatingSwashplate = new THREE.Mesh(nonRotatingSwashplateGeo, brassMaterial);
    nonRotatingSwashplate.rotation.x = Math.PI / 2;
    nonRotSwashGrp.add(nonRotatingSwashplate);
    swashplateTiltGroup.add(nonRotSwashGrp);

    // 4. Rotating swashplate
    const rotSwashGrp = new THREE.Group();
    rotSwashGrp.position.y = 0.2; // slightly above non-rotating
    const rotatingSwashplateGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 64);
    const rotatingSwashplate = new THREE.Mesh(rotatingSwashplateGeo, aluminumMaterial);
    rotatingSwashplate.rotation.x = Math.PI / 2;
    rotSwashGrp.add(rotatingSwashplate);
    swashplateTiltGroup.add(rotSwashGrp);

    // Assembly that rotates together
    const rotatingAssembly = new THREE.Group();
    group.add(rotatingAssembly);

    // 5. Rotor hub
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    const hub = new THREE.Mesh(hubGeo, steelMaterial);
    hub.position.y = 1.8;
    rotatingAssembly.add(hub);

    const numBlades = 4;
    const blades = [];
    
    for(let i=0; i<numBlades; i++) {
        const angle = (i * Math.PI * 2) / numBlades;
        const bladeAssembly = new THREE.Group();
        bladeAssembly.rotation.y = angle;
        
        // 6. Flapping hinges
        const flappingHingeGeo = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const flappingHinge = new THREE.Mesh(flappingHingeGeo, brassMaterial);
        flappingHinge.position.set(0.6, 1.8, 0);
        bladeAssembly.add(flappingHinge);

        // 7. Lead-lag hinges
        const leadLagHingeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
        const leadLagHinge = new THREE.Mesh(leadLagHingeGeo, aluminumMaterial);
        leadLagHinge.position.set(0.8, 1.8, 0);
        bladeAssembly.add(leadLagHinge);

        // 8. Drag dampers
        const damperGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
        const damper = new THREE.Mesh(damperGeo, rubberMaterial);
        damper.rotation.x = Math.PI / 2;
        damper.position.set(0.8, 1.8, 0.2);
        bladeAssembly.add(damper);

        // We want to pitch the blade, so we put it in a pitch group
        const pitchGroup = new THREE.Group();
        pitchGroup.position.set(0.8, 1.8, 0);
        
        // 9. Main rotor blades
        const bladeGeo = new THREE.BoxGeometry(4, 0.05, 0.4);
        const blade = new THREE.Mesh(bladeGeo, compositeMaterial);
        blade.position.set(2.0, 0, 0); // relative to pitch group
        pitchGroup.add(blade);
        bladeAssembly.add(pitchGroup);
        blades.push(pitchGroup);

        // 10. Pitch links
        const pitchLinkGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 16);
        const pitchLink = new THREE.Mesh(pitchLinkGeo, steelMaterial);
        pitchLink.position.set(0.6, 1.1, 0.2);
        bladeAssembly.add(pitchLink);

        rotatingAssembly.add(bladeAssembly);
    }

    // Animation function
    group.userData.update = function(deltaTime) {
        const rpm = 60;
        const rotationSpeed = (rpm / 60) * Math.PI * 2;
        
        // Rotate mast and rotating assembly
        mast.rotation.y += rotationSpeed * deltaTime;
        rotatingAssembly.rotation.y += rotationSpeed * deltaTime;
        rotSwashGrp.rotation.y += rotationSpeed * deltaTime;

        // Cyclic pitch change (simplified)
        const time = Date.now() * 0.001;
        blades.forEach((blade, index) => {
            const azimuth = rotatingAssembly.rotation.y + (index * Math.PI * 2) / numBlades;
            // cyclic pitch variation
            blade.rotation.x = Math.sin(azimuth) * 0.2; 
        });
        
        // Animate swashplate tilt
        const tiltX = Math.sin(time) * 0.1;
        const tiltZ = Math.cos(time) * 0.1;
        swashplateTiltGroup.rotation.x = tiltX;
        swashplateTiltGroup.rotation.z = tiltZ;
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What is the primary function of the swashplate in a helicopter?",
            options: [
                "To cool the engine",
                "To transmit control inputs from the non-rotating fuselage to the rotating rotor hub",
                "To reduce vibration in the tail rotor",
                "To store excess fuel"
            ],
            correctAnswer: 1
        },
        {
            question: "What aerodynamic phenomenon limits the forward speed of a helicopter?",
            options: [
                "Ground effect",
                "Retreating blade stall",
                "Transverse flow effect",
                "Vortex ring state"
            ],
            correctAnswer: 1
        },
        {
            question: "Which hinge allows the rotor blade to move up and down to compensate for dissymmetry of lift?",
            options: [
                "Lead-lag hinge",
                "Flapping hinge",
                "Pitch hinge",
                "Teetering hinge"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of lead-lag dampers on a fully articulated rotor system?",
            options: [
                "To prevent ground resonance",
                "To increase lift",
                "To control the blade's pitch angle",
                "To keep the swashplate level"
            ],
            correctAnswer: 0
        },
        {
            question: "What does collective pitch control do?",
            options: [
                "Changes the pitch angle of all main rotor blades simultaneously",
                "Changes the pitch angle of individual blades depending on their position",
                "Controls the tail rotor pitch",
                "Tilts the rotor disc forward and backward"
            ],
            correctAnswer: 0
        },
        {
            question: "Dissymmetry of lift in forward flight is compensated primarily by:",
            options: [
                "Increasing engine RPM",
                "Blade flapping",
                "Lead-lag motion",
                "Cyclic feathering alone"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
