export function createSteamTurbine(THREE) {
    const group = new THREE.Group();

    // 1. Rotor Shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
    const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const rotorShaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    rotorShaft.rotation.z = Math.PI / 2;
    
    // Create a sub-group for rotating parts
    const rotatingGroup = new THREE.Group();
    rotatingGroup.add(rotorShaft);

    // 2. Moving Blades
    const movingBladesGeometry = new THREE.CylinderGeometry(2, 2, 4, 16);
    const movingBladesMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, wireframe: true });
    const movingBlades = new THREE.Mesh(movingBladesGeometry, movingBladesMaterial);
    movingBlades.rotation.z = Math.PI / 2;
    rotatingGroup.add(movingBlades);

    // 3. Governor
    const governorGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const governorMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const governor = new THREE.Mesh(governorGeometry, governorMaterial);
    governor.position.set(-5.5, 0, 0);
    rotatingGroup.add(governor);

    group.add(rotatingGroup);

    // 4. Stationary Blades
    const stationaryBladesGeometry = new THREE.CylinderGeometry(2.1, 2.1, 3.8, 16);
    const stationaryBladesMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444, wireframe: true });
    const stationaryBlades = new THREE.Mesh(stationaryBladesGeometry, stationaryBladesMaterial);
    stationaryBlades.rotation.z = Math.PI / 2;
    group.add(stationaryBlades);

    // 5. Outer Casing
    const casingGeometry = new THREE.CylinderGeometry(2.5, 2.5, 8, 32);
    const casingMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, transparent: true, opacity: 0.3 });
    const outerCasing = new THREE.Mesh(casingGeometry, casingMaterial);
    outerCasing.rotation.z = Math.PI / 2;
    group.add(outerCasing);

    // 6. Steam Inlet
    const inletGeometry = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    const inletMaterial = new THREE.MeshStandardMaterial({ color: 0xffcccc });
    const steamInlet = new THREE.Mesh(inletGeometry, inletMaterial);
    steamInlet.position.set(-3, 2.5, 0);
    group.add(steamInlet);

    // 7. Exhaust Outlet
    const exhaustGeometry = new THREE.CylinderGeometry(1, 1, 3, 16);
    const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0xccccff });
    const exhaustOutlet = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaustOutlet.position.set(3, -2.5, 0);
    group.add(exhaustOutlet);

    // 8. Thrust Bearing
    const thrustBearingGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const thrustBearingMaterial = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const thrustBearing = new THREE.Mesh(thrustBearingGeometry, thrustBearingMaterial);
    thrustBearing.position.set(-4.5, 0, 0);
    thrustBearing.rotation.z = Math.PI / 2;
    group.add(thrustBearing);

    // 9. Journal Bearing
    const journalBearingGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.8, 32);
    const journalBearingMaterial = new THREE.MeshStandardMaterial({ color: 0x22aa22 });
    const journalBearing = new THREE.Mesh(journalBearingGeometry, journalBearingMaterial);
    journalBearing.position.set(4.5, 0, 0);
    journalBearing.rotation.z = Math.PI / 2;
    group.add(journalBearing);

    // 10. Nozzle
    const nozzleGeometry = new THREE.ConeGeometry(0.5, 1.5, 16);
    const nozzleMaterial = new THREE.MeshStandardMaterial({ color: 0xaa55ff });
    const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
    nozzle.position.set(-3, 1, 0);
    group.add(nozzle);

    const update = (delta) => {
        rotatingGroup.rotation.x += 2 * delta;
    };

    const quizzes = [
        {
            question: "What is the primary function of the rotor shaft in a steam turbine?",
            options: ["To cool the steam", "To transmit mechanical power", "To expand the steam", "To regulate pressure"],
            answer: "To transmit mechanical power"
        },
        {
            question: "Which component directs the steam onto the moving blades?",
            options: ["Governor", "Exhaust Outlet", "Nozzle", "Journal Bearing"],
            answer: "Nozzle"
        },
        {
            question: "What do the stationary blades do in a steam turbine?",
            options: ["Rotate to produce work", "Guide the steam to the next stage of moving blades", "Seal the turbine casing", "Lubricate the bearings"],
            answer: "Guide the steam to the next stage of moving blades"
        },
        {
            question: "What is the purpose of the outer casing?",
            options: ["To contain the steam and house the internal components", "To generate steam", "To transmit power to the generator", "To measure steam temperature"],
            answer: "To contain the steam and house the internal components"
        },
        {
            question: "Which part controls the speed of the turbine by regulating steam flow?",
            options: ["Journal Bearing", "Governor", "Thrust Bearing", "Exhaust Outlet"],
            answer: "Governor"
        },
        {
            question: "What is the function of the thrust bearing?",
            options: ["To support the radial load of the rotor", "To prevent axial movement of the rotor", "To increase steam pressure", "To convert steam into water"],
            answer: "To prevent axial movement of the rotor"
        }
    ];

    return { group, update, quizzes };
}
