export function createHydroelectricTurbine(THREE) {
    const group = new THREE.Group();

    // Materials
    const casingMat = new THREE.MeshStandardMaterial({ color: 0x3a5a40, transparent: true, opacity: 0.4 });
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const runnerMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x223344, transparent: true, opacity: 0.5 });
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.1 });
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.4 }); // Copper-like
    const statorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const exciterMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5 });
    const actuatorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.6 });
    const bearingMat = new THREE.MeshStandardMaterial({ color: 0xaaaa22, metalness: 0.5 });

    // 1. Spiral Casing (Volute/Torus shape to distribute water evenly)
    const casingGeo = new THREE.TorusGeometry(5, 1.5, 16, 64, Math.PI * 1.8);
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    // 2. Wicket Gates (Guide vanes controlling water flow)
    const gatesGroup = new THREE.Group();
    const gateGeo = new THREE.BoxGeometry(0.1, 1.5, 1.2);
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const gate = new THREE.Mesh(gateGeo, gateMat);
        gate.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        gate.rotation.y = -angle + Math.PI / 4; // Angled to direct water
        gatesGroup.add(gate);
    }
    group.add(gatesGroup);

    // Rotating Assembly Group (Everything that spins together)
    const rotatingAssembly = new THREE.Group();
    group.add(rotatingAssembly);

    // 3. Runner Blades (Francis turbine wheel)
    const runnerGeo = new THREE.CylinderGeometry(2, 0.8, 1.5, 16, 1, false);
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    // Add individual blades to the runner core
    for (let i = 0; i < 8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 1.8);
        const blade = new THREE.Mesh(bladeGeo, runnerMat);
        const angle = (i / 8) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 1.4, 0, Math.sin(angle) * 1.4);
        blade.rotation.y = -angle + Math.PI / 4;
        blade.rotation.z = Math.PI / 12; // Slight pitch
        runner.add(blade);
    }
    rotatingAssembly.add(runner);

    // 4. Draft Tube (Diverging tube to recover kinetic energy)
    const draftGeo = new THREE.CylinderGeometry(2, 3.5, 4, 32, 1, true);
    const draftTube = new THREE.Mesh(draftGeo, tubeMat);
    draftTube.position.y = -2.75;
    draftTube.material.side = THREE.DoubleSide;
    group.add(draftTube);

    // 5. Generator Shaft (Connects turbine runner to generator rotor)
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 16);
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 5;
    rotatingAssembly.add(shaft);

    // 6. Rotor (Electromagnet assembly inside the generator)
    const rotorGeo = new THREE.CylinderGeometry(2.8, 2.8, 3, 32);
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.y = 8;
    // Add salient poles for visual detail
    for (let i = 0; i < 12; i++) {
        const poleGeo = new THREE.BoxGeometry(0.4, 3, 0.4);
        const pole = new THREE.Mesh(poleGeo, shaftMat);
        const angle = (i / 12) * Math.PI * 2;
        pole.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
        pole.rotation.y = -angle;
        rotor.add(pole);
    }
    rotatingAssembly.add(rotor);

    // 7. Stator (Stationary armature coils surrounding the rotor)
    const statorGeo = new THREE.CylinderGeometry(3.2, 3.6, 3.2, 32);
    const stator = new THREE.Mesh(statorGeo, statorMat);
    stator.position.y = 8;
    group.add(stator);

    // 8. Exciter (Provides DC excitation current to the rotor)
    const exciterGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 16);
    const exciter = new THREE.Mesh(exciterGeo, exciterMat);
    exciter.position.y = 10.5;
    rotatingAssembly.add(exciter);

    // 9. Guide Vane Actuators (Operating ring to adjust wicket gates)
    const actuatorGeo = new THREE.TorusGeometry(4.2, 0.15, 8, 32);
    const actuator = new THREE.Mesh(actuatorGeo, actuatorMat);
    actuator.rotation.x = Math.PI / 2;
    actuator.position.y = 1.0;
    group.add(actuator);

    // 10. Thrust Bearing (Supports the immense axial load of the rotating parts)
    const bearingGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 32);
    const bearing = new THREE.Mesh(bearingGeo, bearingMat);
    bearing.position.y = 6;
    group.add(bearing);

    // Kinematic Animation
    group.userData.update = function(deltaTime) {
        // The turbine rotates at a constant angular velocity
        const rpm = 120;
        const rps = rpm / 60;
        const angularVelocity = rps * Math.PI * 2;
        
        rotatingAssembly.rotation.y -= angularVelocity * deltaTime;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the draft tube?",
            options: [
                "To increase the speed of the water entering the turbine",
                "To recover kinetic energy from the exiting water and decrease pressure",
                "To filter debris before it hits the blades",
                "To provide excitation current to the rotor"
            ],
            correct: 1
        },
        {
            question: "Which component is responsible for regulating the volume of water entering the turbine runner?",
            options: [
                "Spiral Casing",
                "Thrust Bearing",
                "Wicket Gates",
                "Stator"
            ],
            correct: 2
        },
        {
            question: "What is the purpose of the exciter mounted on top of the generator?",
            options: [
                "To supply DC current to the rotor to create a magnetic field",
                "To brake the turbine in case of overspeed",
                "To actuate the guide vanes",
                "To cool the stator coils"
            ],
            correct: 0
        },
        {
            question: "The component that remains stationary and houses the coils where voltage is induced is the:",
            options: [
                "Rotor",
                "Stator",
                "Runner",
                "Shaft"
            ],
            correct: 1
        },
        {
            question: "What structure evenly distributes the incoming water around the entire circumference of the turbine?",
            options: [
                "Draft Tube",
                "Wicket Gates",
                "Exciter",
                "Spiral Casing"
            ],
            correct: 3
        },
        {
            question: "Which part must support the massive vertical weight of the rotating assembly (shaft, runner, and rotor)?",
            options: [
                "Guide Vane Actuators",
                "Wicket Gates",
                "Thrust Bearing",
                "Generator Shaft"
            ],
            correct: 2
        }
    ];

    return group;
}
