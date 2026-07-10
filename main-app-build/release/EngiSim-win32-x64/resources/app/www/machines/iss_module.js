export function createIssModule(THREE) {
    const group = new THREE.Group();

    // Materials
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.6, roughness: 0.4 });
    const portMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.3 });

    // 1. Cylindrical Hull
    const hullGeom = new THREE.CylinderGeometry(2, 2, 10, 32);
    const hull = new THREE.Mesh(hullGeom, hullMat);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // 2. Forward Docking Port
    const forwardPortGeom = new THREE.CylinderGeometry(1.2, 1.2, 1, 16);
    const forwardPort = new THREE.Mesh(forwardPortGeom, portMat);
    forwardPort.position.set(5.5, 0, 0);
    forwardPort.rotation.z = Math.PI / 2;
    group.add(forwardPort);

    // 3. Aft Docking Port
    const aftPortGeom = new THREE.CylinderGeometry(1.2, 1.2, 1, 16);
    const aftPort = new THREE.Mesh(aftPortGeom, portMat);
    aftPort.position.set(-5.5, 0, 0);
    aftPort.rotation.z = Math.PI / 2;
    group.add(aftPort);

    // 4. Viewing Cupola
    const cupolaGroup = new THREE.Group();
    const cupolaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 0.5, 8), hullMat);
    cupolaBase.rotation.x = Math.PI / 2;
    const cupolaGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.52, 8), glassMat);
    cupolaGlass.rotation.x = Math.PI / 2;
    cupolaGroup.add(cupolaBase);
    cupolaGroup.add(cupolaGlass);
    cupolaGroup.position.set(2, 2, 0);
    group.add(cupolaGroup);

    // 5. Radiator Panels
    const radiatorGroup = new THREE.Group();
    const radiatorGeom = new THREE.BoxGeometry(4, 0.1, 2);
    const radiator1 = new THREE.Mesh(radiatorGeom, radiatorMat);
    radiator1.position.set(0, 3, 0);
    const radiator2 = new THREE.Mesh(radiatorGeom, radiatorMat);
    radiator2.position.set(0, -3, 0);
    // Connectors
    const conn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), hullMat);
    conn1.position.set(0, 2.5, 0);
    const conn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), hullMat);
    conn2.position.set(0, -2.5, 0);
    radiatorGroup.add(radiator1, radiator2, conn1, conn2);
    group.add(radiatorGroup);

    // 6. Exterior Handrails
    const railsGroup = new THREE.Group();
    const railGeom = new THREE.CylinderGeometry(0.05, 0.05, 8, 8);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xdddd00 }); // Yellow handrails
    const rail1 = new THREE.Mesh(railGeom, railMat);
    rail1.rotation.z = Math.PI / 2;
    rail1.position.set(0, 2.1, 0.5);
    const rail2 = new THREE.Mesh(railGeom, railMat);
    rail2.rotation.z = Math.PI / 2;
    rail2.position.set(0, 2.1, -0.5);
    railsGroup.add(rail1, rail2);
    group.add(railsGroup);

    // 7. Robotic Grapple Fixture
    const grappleGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.4);
    const grapple = new THREE.Mesh(grappleGeom, goldMat);
    grapple.position.set(-2, 1.8, 1.2);
    grapple.rotation.x = Math.PI / 4;
    group.add(grapple);

    // 8. Communications Array
    const commsGroup = new THREE.Group();
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI), hullMat);
    dish.rotation.x = -Math.PI / 2;
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), hullMat);
    antenna.position.set(0, 0.5, 0);
    commsGroup.add(dish, antenna);
    commsGroup.position.set(-3, 0, 2.2);
    commsGroup.rotation.x = Math.PI / 2;
    group.add(commsGroup);

    // 9. Life Support Vent
    const ventGeom = new THREE.BoxGeometry(0.6, 0.6, 0.2);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const vent = new THREE.Mesh(ventGeom, ventMat);
    vent.position.set(1, -1.8, 1.2);
    vent.rotation.x = Math.PI / 4;
    group.add(vent);

    // 10. Solar Alpha Rotary Joint
    const sarjGroup = new THREE.Group();
    const sarjRing = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.3, 16, 32), hullMat);
    sarjRing.rotation.y = Math.PI / 2;
    sarjGroup.add(sarjRing);
    
    // Add some details to SARJ to see it rotate
    for(let i=0; i<8; i++) {
        const detail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), goldMat);
        detail.position.set(0, Math.cos(i*Math.PI/4)*2.3, Math.sin(i*Math.PI/4)*2.3);
        sarjGroup.add(detail);
    }
    sarjGroup.position.set(-4, 0, 0);
    group.add(sarjGroup);

    // Animation
    let time = 0;
    function update(delta) {
        time += delta;
        // Adjust radiator panels slightly
        radiatorGroup.rotation.x = Math.sin(time * 0.2) * 0.2;
        // Rotate Solar Alpha Rotary Joint
        sarjGroup.rotation.x = time * 0.5;
        // Rotate communications dish slightly to track "satellites"
        commsGroup.rotation.z = Math.sin(time * 0.1) * 0.5;
    }

    // Questions
    const questions = [
        {
            question: "What is the primary function of the radiators on a space station?",
            options: ["Generating power from sunlight", "Rejecting excess heat into space", "Shielding from micrometeoroids", "Communicating with Earth"],
            correctAnswer: 1,
            explanation: "In the vacuum of space, convection doesn't work. Spacecraft must use radiators to reject excess heat generated by electronics and life support systems into space via radiation."
        },
        {
            question: "Why are space station modules typically cylindrical?",
            options: ["To minimize aerodynamic drag", "To fit inside the launch vehicle's payload fairing and efficiently hold pressurized air", "To reflect sunlight better", "To generate artificial gravity"],
            correctAnswer: 1,
            explanation: "Cylindrical modules distribute internal air pressure evenly (like a balloon) and fit naturally within the cylindrical payload fairings of rockets used to launch them."
        },
        {
            question: "What does the Solar Alpha Rotary Joint (SARJ) do?",
            options: ["Recycles water", "Spins the station for gravity", "Allows the solar arrays to track the sun while the station orbits", "Docks visiting spacecraft"],
            correctAnswer: 2,
            explanation: "The SARJ rotates the massive solar array wings to keep them pointed at the sun for maximum power generation as the station orbits the Earth."
        },
        {
            question: "What is the purpose of the Cupola on the ISS?",
            options: ["A solar observatory", "A robotic control station with direct visual observation", "A sleep quarters", "A greenhouse"],
            correctAnswer: 1,
            explanation: "The Cupola provides a pressurized observation and work area, giving astronauts a direct, wide-angle view for operating the robotic arm and observing Earth."
        },
        {
            question: "Why are handrails painted yellow or bright colors on the exterior?",
            options: ["For aesthetic reasons", "To prevent thermal expansion", "To make them easily visible for spacewalking astronauts", "To conduct electricity"],
            correctAnswer: 2,
            explanation: "High-visibility colors like yellow help astronauts on Extravehicular Activities (EVAs) quickly locate safe handholds against the glaring or dark backdrop of space."
        },
        {
            question: "What system is responsible for removing CO2 from the module's atmosphere?",
            options: ["Thermal Control System", "Environmental Control and Life Support System (ECLSS)", "Attitude Control System", "Telecommunications System"],
            correctAnswer: 1,
            explanation: "The ECLSS manages air quality, including scrubbing carbon dioxide, generating oxygen, and maintaining cabin pressure and temperature."
        }
    ];

    return {
        group,
        update,
        questions
    };
}
