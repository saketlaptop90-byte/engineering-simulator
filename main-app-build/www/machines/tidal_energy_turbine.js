export function createTidalEnergyTurbine(THREE) {
    const turbineGroup = new THREE.Group();

    // Materials
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.2, roughness: 0.4 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x114488, metalness: 0.6, roughness: 0.3 });
    const generatorMaterial = new THREE.MeshStandardMaterial({ color: 0xcc7722, metalness: 0.9, roughness: 0.1 });
    const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

    // 1. Foundation Base (concrete block on the sea floor)
    const foundationGeo = new THREE.CylinderGeometry(4, 5, 2, 32);
    const foundation = new THREE.Mesh(foundationGeo, concreteMaterial);
    foundation.position.y = 1;
    turbineGroup.add(foundation);

    // 2. Support Pylon (column rising from the foundation)
    const pylonGeo = new THREE.CylinderGeometry(1.5, 2, 15, 32);
    const pylon = new THREE.Mesh(pylonGeo, steelMaterial);
    pylon.position.y = 9.5;
    turbineGroup.add(pylon);

    // 3. Yaw Drive (mechanism at the top of the pylon to turn the turbine to face the tide)
    const yawGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 32);
    const yawDrive = new THREE.Mesh(yawGeo, blueMaterial);
    yawDrive.position.y = 17.75;
    turbineGroup.add(yawDrive);

    // Head Group (rotates with yaw)
    const headGroup = new THREE.Group();
    headGroup.position.y = 18.5;
    turbineGroup.add(headGroup);

    // 4. Nacelle (main housing)
    const nacelleGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    nacelleGeo.rotateX(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, steelMaterial);
    nacelle.position.z = -2;
    headGroup.add(nacelle);

    // 5. Gearbox (inside the nacelle, steps up rotation speed)
    const gearboxGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const gearbox = new THREE.Mesh(gearboxGeo, blueMaterial);
    gearbox.position.z = -1;
    headGroup.add(gearbox);

    // 6. Generator (converts mechanical energy to electrical energy)
    const generatorGeo = new THREE.CylinderGeometry(1.8, 1.8, 3, 32);
    generatorGeo.rotateX(Math.PI / 2);
    const generator = new THREE.Mesh(generatorGeo, generatorMaterial);
    generator.position.z = -4.5;
    headGroup.add(generator);

    // 7. Power Export Cable (takes electricity down to the seabed)
    // Create a path for the cable
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, -4.5),
        new THREE.Vector3(0, -5, -2),
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, -17.5, 2)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.3, 8, false);
    const cable = new THREE.Mesh(cableGeo, blackMaterial);
    headGroup.add(cable);

    // Rotor Group
    const rotorGroup = new THREE.Group();
    rotorGroup.position.z = 2.5;
    headGroup.add(rotorGroup);

    // 8. Hub (center of the rotor)
    const hubGeo = new THREE.SphereGeometry(1.5, 32, 32);
    hubGeo.scale(1, 1, 1.5);
    const hub = new THREE.Mesh(hubGeo, blueMaterial);
    rotorGroup.add(hub);

    // 9. Pitch Mechanism (adjusts blade angle, inside hub, represented by a ring)
    const pitchGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const pitchMech = new THREE.Mesh(pitchGeo, steelMaterial);
    pitchMech.position.z = -0.5;
    rotorGroup.add(pitchMech);

    // 10. Rotor Blades
    for (let i = 0; i < 3; i++) {
        const bladeGroup = new THREE.Group();
        bladeGroup.rotation.z = (i * Math.PI * 2) / 3;

        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(0, 0);
        bladeShape.lineTo(0.5, 2);
        bladeShape.lineTo(0.8, 6);
        bladeShape.lineTo(0.4, 10);
        bladeShape.lineTo(-0.2, 10);
        bladeShape.lineTo(-0.6, 6);
        bladeShape.lineTo(-0.4, 2);
        bladeShape.closePath();

        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
        bladeGeo.translate(0, 1, -0.1); // Offset from center
        
        const blade = new THREE.Mesh(bladeGeo, bladeMaterial);
        bladeGroup.add(blade);
        rotorGroup.add(bladeGroup);
    }

    // Animation
    turbineGroup.userData.update = function(time) {
        // Rotate the rotor blades
        rotorGroup.rotation.z -= 0.02; // Slower than wind turbines due to water density
        // Slowly oscillate the yaw drive to simulate changing tide directions
        headGroup.rotation.y = Math.sin(time * 0.1) * 0.2;
    };

    const quiz = [
        {
            question: "What is the primary function of the Nacelle in a tidal energy turbine?",
            options: ["To float on the water surface", "To house the gearbox and generator", "To capture solar energy", "To anchor the turbine to the seabed"],
            answer: "To house the gearbox and generator"
        },
        {
            question: "Why do tidal energy turbines typically rotate slower than wind turbines?",
            options: ["Water is much denser than air", "There is less energy in tides", "To avoid scaring fish", "The generator is less efficient"],
            answer: "Water is much denser than air"
        },
        {
            question: "What does the Gearbox do in the turbine system?",
            options: ["Stores electrical energy", "Increases the rotational speed from the rotor to the generator", "Pumps water through the turbine", "Controls the pitch of the blades"],
            answer: "Increases the rotational speed from the rotor to the generator"
        },
        {
            question: "What is the role of the Yaw Drive?",
            options: ["To adjust the angle of the rotor blades", "To spin the generator", "To turn the turbine to face the direction of the tidal flow", "To transmit electricity to the shore"],
            answer: "To turn the turbine to face the direction of the tidal flow"
        },
        {
            question: "Where is the Pitch Mechanism located, and what is its purpose?",
            options: ["In the foundation to level the turbine", "In the hub to optimize the angle of the rotor blades", "On the pylon to adjust the height", "In the generator to regulate voltage"],
            answer: "In the hub to optimize the angle of the rotor blades"
        },
        {
            question: "What component is responsible for converting mechanical rotation into electrical energy?",
            options: ["Support Pylon", "Rotor Blades", "Generator", "Gearbox"],
            answer: "Generator"
        }
    ];

    return {
        group: turbineGroup,
        quiz: quiz
    };
}
