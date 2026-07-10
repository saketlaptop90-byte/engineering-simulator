export function createStirlingEngine(THREE) {
    const group = new THREE.Group();

    // 10 distinct parts
    
    // 1. Hot Cylinder
    const hotCylGeom = new THREE.CylinderGeometry(1, 1, 4, 32);
    const hotCylMat = new THREE.MeshStandardMaterial({ color: 0xff4444, transparent: true, opacity: 0.5 });
    const hotCylinder = new THREE.Mesh(hotCylGeom, hotCylMat);
    hotCylinder.position.set(-2, 0, 0);
    group.add(hotCylinder);

    // 2. Cold Cylinder
    const coldCylGeom = new THREE.CylinderGeometry(1, 1, 4, 32);
    const coldCylMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.5 });
    const coldCylinder = new THREE.Mesh(coldCylGeom, coldCylMat);
    coldCylinder.position.set(2, 0, 0);
    group.add(coldCylinder);

    // 3. Hot Piston
    const hotPistGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, 32);
    const hotPistMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const hotPiston = new THREE.Mesh(hotPistGeom, hotPistMat);
    hotCylinder.add(hotPiston);

    // 4. Cold Piston
    const coldPistGeom = new THREE.CylinderGeometry(0.9, 0.9, 1, 32);
    const coldPistMat = new THREE.MeshStandardMaterial({ color: 0x2222aa });
    const coldPiston = new THREE.Mesh(coldPistGeom, coldPistMat);
    coldCylinder.add(coldPiston);

    // 5. Regenerator
    const regGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    regGeom.rotateZ(Math.PI / 2);
    const regMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const regenerator = new THREE.Mesh(regGeom, regMat);
    regenerator.position.set(0, -1, 0);
    group.add(regenerator);

    // 6. Crankshaft
    const crankGeom = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    crankGeom.rotateZ(Math.PI / 2);
    const crankMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const crankshaft = new THREE.Mesh(crankGeom, crankMat);
    crankshaft.position.set(0, 3, 0);
    group.add(crankshaft);

    // 7. Flywheel
    const flyGeom = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    flyGeom.rotateX(Math.PI / 2);
    const flyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const flywheel = new THREE.Mesh(flyGeom, flyMat);
    flywheel.position.set(0, 3, 2.5);
    group.add(flywheel);

    // 8. Connecting Rods
    const rodsGroup = new THREE.Group();
    const rodGeom = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const hotRod = new THREE.Mesh(rodGeom, rodMat);
    const coldRod = new THREE.Mesh(rodGeom, rodMat);
    rodsGroup.add(hotRod);
    rodsGroup.add(coldRod);
    group.add(rodsGroup);

    // 9. Heat Source
    const heatSourceGeom = new THREE.BoxGeometry(3, 0.5, 3);
    const heatSourceMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const heatSource = new THREE.Mesh(heatSourceGeom, heatSourceMat);
    heatSource.position.set(-2, -2.5, 0);
    group.add(heatSource);

    // 10. Heat Sink
    const heatSinkGeom = new THREE.BoxGeometry(3, 0.5, 3);
    const heatSinkMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const heatSink = new THREE.Mesh(heatSinkGeom, heatSinkMat);
    heatSink.position.set(2, -2.5, 0);
    group.add(heatSink);

    // Animation variables
    let time = 0;
    const speed = 0.05;
    const stroke = 1.5;

    // Animation function
    group.userData.animate = function() {
        time += speed;

        // Flywheel rotation
        flywheel.rotation.z = time;
        crankshaft.rotation.x = time;

        // 90-degree phase shift (PI/2)
        const hotPhase = time;
        const coldPhase = time - Math.PI / 2;

        hotPiston.position.y = Math.sin(hotPhase) * (stroke / 2);
        coldPiston.position.y = Math.sin(coldPhase) * (stroke / 2);

        // Simple connecting rod animation approximation
        hotRod.position.set(-2, 3 + Math.sin(hotPhase) * (stroke / 2) - 1, 0);
        coldRod.position.set(2, 3 + Math.sin(coldPhase) * (stroke / 2) - 1, 0);
    };

    group.userData.quiz = [
        {
            question: "What is the primary heat transfer process in a Stirling engine that increases efficiency?",
            options: ["Conduction", "Convection", "Radiation", "Regeneration"],
            answer: "Regeneration"
        },
        {
            question: "What is the typical phase angle difference between the pistons in an alpha-type Stirling engine?",
            options: ["0 degrees", "45 degrees", "90 degrees", "180 degrees"],
            answer: "90 degrees"
        },
        {
            question: "Which of the following is an idealized thermodynamic cycle for a Stirling engine?",
            options: ["Otto cycle", "Diesel cycle", "Stirling cycle", "Carnot cycle"],
            answer: "Stirling cycle"
        },
        {
            question: "What does the regenerator do in a Stirling engine?",
            options: ["Generates electricity", "Stores and releases heat during the cycle", "Cools the engine continuously", "Provides continuous heat source"],
            answer: "Stores and releases heat during the cycle"
        },
        {
            question: "A Stirling engine is an example of what type of engine?",
            options: ["Internal combustion engine", "External combustion engine", "Electric motor", "Jet engine"],
            answer: "External combustion engine"
        },
        {
            question: "What working fluids are commonly used in high-performance Stirling engines to increase efficiency?",
            options: ["Water and steam", "Air and nitrogen", "Hydrogen and helium", "Oil and refrigerant"],
            answer: "Hydrogen and helium"
        }
    ];

    return group;
}
