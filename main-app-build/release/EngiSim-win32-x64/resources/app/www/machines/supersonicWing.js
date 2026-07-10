export function createSupersonicDeltaWing(THREE) {
    const group = new THREE.Group();

    // Helper material
    const mat = (color, opacity=1) => new THREE.MeshStandardMaterial({ 
        color, 
        transparent: opacity < 1, 
        opacity,
        side: THREE.DoubleSide
    });

    // 1. Delta Wing Body
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0); // Nose
    wingShape.lineTo(5, 10); // Right trailing
    wingShape.lineTo(-5, 10); // Left trailing
    wingShape.lineTo(0, 0);
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    const wingBody = new THREE.Mesh(wingGeo, mat(0xcccccc));
    wingBody.rotation.x = Math.PI / 2; // Extrusion Z goes down
    group.add(wingBody); // Trailing edge is at Z = -10

    // 2. Leading Edge
    const leGeo = new THREE.CylinderGeometry(0.1, 0.1, 11.18, 8);
    const leftLeadingEdge = new THREE.Mesh(leGeo, mat(0x888888));
    leftLeadingEdge.position.set(-2.5, 0, -5);
    leftLeadingEdge.rotation.x = Math.PI / 2;
    leftLeadingEdge.rotation.z = Math.atan2(-5, 10); // adjust to match edge
    group.add(leftLeadingEdge);

    // 3. Trailing Edge
    const teGeo = new THREE.BoxGeometry(10, 0.1, 0.2);
    const trailingEdge = new THREE.Mesh(teGeo, mat(0x777777));
    trailingEdge.position.set(0, 0, -10);
    group.add(trailingEdge);

    // 4. Elevons
    const elevonGeo = new THREE.BoxGeometry(4, 0.2, 1);
    const leftElevon = new THREE.Mesh(elevonGeo, mat(0x444444));
    leftElevon.position.set(-2.5, 0, -10.5);
    group.add(leftElevon);

    // 5. Wingtip Vortices
    const vortexGeo = new THREE.ConeGeometry(0.5, 5, 16);
    const leftVortex = new THREE.Mesh(vortexGeo, mat(0xaaaaff, 0.5));
    leftVortex.position.set(-5, 0, -12.5);
    leftVortex.rotation.x = -Math.PI / 2;
    group.add(leftVortex);

    // 6. Attached Shockwave Cone
    const shockwaveGeo = new THREE.ConeGeometry(8, 20, 32, 1, true);
    const shockwave = new THREE.Mesh(shockwaveGeo, mat(0xffffff, 0.3));
    shockwave.position.set(0, 0, -10); // base at z=-20, tip at z=0
    shockwave.rotation.x = -Math.PI / 2;
    group.add(shockwave);

    // 7. Expansion Fan
    const expFanGeo = new THREE.TorusGeometry(5, 0.5, 8, 24, Math.PI);
    const expansionFan = new THREE.Mesh(expFanGeo, mat(0x00ffff, 0.4));
    expansionFan.position.set(0, 0.5, -5);
    expansionFan.rotation.x = Math.PI / 2;
    group.add(expansionFan);

    // 8. Fuselage Mounting
    const mountGeo = new THREE.BoxGeometry(2, 1, 10);
    const fuselageMount = new THREE.Mesh(mountGeo, mat(0x555555));
    fuselageMount.position.set(0, -0.5, -5);
    group.add(fuselageMount);

    // 9. Pitot-static Probe
    const probeGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const pitotProbe = new THREE.Mesh(probeGeo, mat(0xff0000));
    pitotProbe.position.set(0, 0, 1);
    pitotProbe.rotation.x = Math.PI / 2;
    group.add(pitotProbe);

    // 10. Boundary Layer Diverter
    const diverterGeo = new THREE.BoxGeometry(0.5, 0.5, 2);
    const diverter = new THREE.Mesh(diverterGeo, mat(0x222222));
    diverter.position.set(0, -1.25, -2);
    group.add(diverter);

    // Add animation logic
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        const scale = 1 + Math.sin(time * 5) * 0.05;
        shockwave.scale.set(scale, scale, scale);
        leftVortex.rotation.y += delta * 5;
        leftElevon.rotation.x = Math.sin(time * 2) * 0.2;
    };

    // Add quiz questions
    group.userData.questions = [
        {
            question: "What is the primary function of a delta wing design in supersonic aircraft?",
            options: [
                "To reduce wave drag and remain within the shock cone",
                "To increase lift at low speeds",
                "To provide maximum cargo space",
                "To completely eliminate sonic booms"
            ],
            correctAnswer: 0
        },
        {
            question: "What forms at the nose of the aircraft when it travels faster than the speed of sound?",
            options: [
                "An expansion fan",
                "An attached or detached shockwave",
                "A boundary layer diverter",
                "A wingtip vortex"
            ],
            correctAnswer: 1
        },
        {
            question: "Which component measures the aircraft's airspeed and Mach number?",
            options: [
                "Wingtip vortices",
                "Elevons",
                "Pitot-static probe",
                "Boundary layer diverter"
            ],
            correctAnswer: 2
        },
        {
            question: "What happens to the airflow as it passes through an expansion fan?",
            options: [
                "Its pressure increases and velocity decreases",
                "Its pressure decreases and velocity increases",
                "It immediately becomes subsonic",
                "It separates from the wing surface"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the boundary layer diverter?",
            options: [
                "To prevent slow-moving, turbulent air from entering the engine intakes",
                "To generate lift during takeoff",
                "To reduce the intensity of the sonic boom",
                "To control the pitch and roll of the aircraft"
            ],
            correctAnswer: 0
        },
        {
            question: "What control surfaces are typically used on a tailless delta wing for both pitch and roll control?",
            options: [
                "Ailerons and elevators",
                "Rudders",
                "Elevons",
                "Flaps"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
