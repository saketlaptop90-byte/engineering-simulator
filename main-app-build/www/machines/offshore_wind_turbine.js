export function createOffshoreWindTurbine(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const yellowMaterial = new THREE.MeshStandardMaterial({ color: 0xe6c229, metalness: 0.5, roughness: 0.5 });
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.3 });
    const darkGreyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.4, roughness: 0.7 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });

    // 1. Monopile Foundation
    const foundationGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const foundation = new THREE.Mesh(foundationGeo, steelMaterial);
    foundation.position.y = 5;
    model.add(foundation);
    parts.push({
        name: "Monopile Foundation",
        description: "A steel tube driven deep into the seabed to support the turbine.",
        mesh: foundation
    });

    // 2. Transition Piece
    const transitionGeo = new THREE.CylinderGeometry(1.6, 1.6, 3, 32);
    const transition = new THREE.Mesh(transitionGeo, yellowMaterial);
    transition.position.y = 11.5;
    model.add(transition);
    parts.push({
        name: "Transition Piece",
        description: "Connects the monopile foundation to the turbine tower, often painted yellow for visibility.",
        mesh: transition
    });

    // 3. Tower
    const towerGeo = new THREE.CylinderGeometry(1.2, 1.5, 20, 32);
    const tower = new THREE.Mesh(towerGeo, whiteMaterial);
    tower.position.y = 23;
    model.add(tower);
    parts.push({
        name: "Tower",
        description: "Tubular steel structure that supports the nacelle and rotor.",
        mesh: tower
    });

    // Yaw Group (Nacelle, Rotor, Anemometer)
    const yawGroup = new THREE.Group();
    yawGroup.position.y = 33;
    model.add(yawGroup);

    // 4. Nacelle
    const nacelleGeo = new THREE.BoxGeometry(2.5, 2.5, 6);
    const nacelle = new THREE.Mesh(nacelleGeo, whiteMaterial);
    nacelle.position.z = 1;
    yawGroup.add(nacelle);
    parts.push({
        name: "Nacelle",
        description: "Houses the generator, gearbox, and control systems.",
        mesh: nacelle
    });

    // 5. Rotor Hub
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0, -2.5);
    yawGroup.add(rotorGroup);

    const hubGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const hub = new THREE.Mesh(hubGeo, whiteMaterial);
    rotorGroup.add(hub);
    parts.push({
        name: "Rotor Hub",
        description: "Connects the blades to the main shaft and contains the pitch mechanism.",
        mesh: hub
    });

    // Blade shape helper
    function createBladeGeo() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(1, 5, 0.5, 15);
        shape.lineTo(0, 16);
        shape.lineTo(-0.5, 15);
        shape.quadraticCurveTo(-1, 5, 0, 0);

        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.translate(0, 1.2, -0.1);
        return geo;
    }

    const bladeGeo = createBladeGeo();

    // 6. Blade 1
    const blade1 = new THREE.Mesh(bladeGeo, whiteMaterial);
    rotorGroup.add(blade1);
    parts.push({
        name: "Blade 1",
        description: "Aerodynamic blade that captures wind energy and converts it into rotational force.",
        mesh: blade1
    });

    // 7. Blade 2
    const blade2 = new THREE.Mesh(bladeGeo, whiteMaterial);
    blade2.rotation.z = (2 * Math.PI) / 3;
    rotorGroup.add(blade2);
    parts.push({
        name: "Blade 2",
        description: "Aerodynamic blade that captures wind energy and converts it into rotational force.",
        mesh: blade2
    });

    // 8. Blade 3
    const blade3 = new THREE.Mesh(bladeGeo, whiteMaterial);
    blade3.rotation.z = (4 * Math.PI) / 3;
    rotorGroup.add(blade3);
    parts.push({
        name: "Blade 3",
        description: "Aerodynamic blade that captures wind energy and converts it into rotational force.",
        mesh: blade3
    });

    // 9. Anemometer
    const anemometerGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const anemometer = new THREE.Mesh(anemometerGeo, darkGreyMaterial);
    anemometer.position.set(0, 1.75, 3);
    yawGroup.add(anemometer);
    parts.push({
        name: "Anemometer",
        description: "Measures wind speed and direction, feeding data to the turbine's control system.",
        mesh: anemometer
    });

    // 10. Submarine Cable
    const cableGeo = new THREE.CylinderGeometry(0.3, 0.3, 15, 16);
    const cable = new THREE.Mesh(cableGeo, blackMaterial);
    cable.position.set(1.5, 0, 0);
    cable.rotation.z = Math.PI / 8;
    model.add(cable);
    parts.push({
        name: "Submarine Cable",
        description: "Transmits the electricity generated by the turbine to the offshore substation or shore.",
        mesh: cable
    });

    // Kinematics State
    let windDirection = 0; // target yaw angle
    let currentYaw = 0;
    let windSpeed = 10; // basic speed

    const update = (deltaTime) => {
        // Randomly adjust wind speed and direction slightly
        windSpeed += (Math.random() - 0.5) * deltaTime;
        windSpeed = Math.max(2, Math.min(25, windSpeed)); // clamp between 2 and 25 m/s

        windDirection += (Math.random() - 0.5) * 0.1 * deltaTime;

        // Yaw control: smoothly interpolate current yaw towards wind direction
        const yawDiff = windDirection - currentYaw;
        currentYaw += yawDiff * 0.5 * deltaTime;
        yawGroup.rotation.y = currentYaw;

        // Rotor spinning based on wind speed
        const rotorRpm = windSpeed * 2; // Arbitrary correlation
        const radiansPerSecond = (rotorRpm * 2 * Math.PI) / 60;
        rotorGroup.rotation.z -= radiansPerSecond * deltaTime; // rotate backwards to look correct from front
        
        // Anemometer spinning
        anemometer.rotation.y += windSpeed * deltaTime;
    };

    const quizzes = [
        {
            question: "What is the primary function of the transition piece in an offshore wind turbine?",
            options: [
                "To generate electricity",
                "To connect the foundation to the tower and provide a safe access point",
                "To control the pitch of the blades",
                "To store generated power"
            ],
            answer: 1
        },
        {
            question: "Why are offshore wind turbines often larger than onshore turbines?",
            options: [
                "Because they are cheaper to build",
                "To capture stronger and more consistent offshore winds",
                "Because of strict height regulations onshore",
                "To serve as navigation landmarks"
            ],
            answer: 1
        },
        {
            question: "What does the anemometer on a wind turbine do?",
            options: [
                "Measures the electrical output",
                "Cools the generator",
                "Measures wind speed and direction",
                "Acts as a lightning rod"
            ],
            answer: 2
        },
        {
            question: "What is the purpose of the nacelle?",
            options: [
                "To house the generator, gearbox, and control electronics",
                "To anchor the turbine to the seabed",
                "To transmit electricity to the shore",
                "To pitch the blades"
            ],
            answer: 0
        },
        {
            question: "How is electricity typically transmitted from an offshore wind farm to land?",
            options: [
                "Via overhead power lines",
                "Through wireless energy transfer",
                "Using high-voltage submarine cables",
                "By battery-carrying ships"
            ],
            answer: 2
        },
        {
            question: "Which component allows the wind turbine to face the wind directly?",
            options: [
                "Pitch mechanism",
                "Yaw mechanism",
                "Gearbox",
                "Monopile"
            ],
            answer: 1
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
