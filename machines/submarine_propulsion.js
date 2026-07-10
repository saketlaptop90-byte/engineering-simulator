export function createSubmarinePropulsion(THREE) {
    const group = new THREE.Group();

    const parts = [];

    // 1. Reactor Core
    const reactorGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const reactorMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const reactorCore = new THREE.Mesh(reactorGeo, reactorMat);
    reactorCore.position.set(-15, 0, 0);
    group.add(reactorCore);
    parts.push({ mesh: reactorCore, name: "Reactor Core", description: "Generates heat through nuclear fission." });

    // 2. Pressurizer
    const pressurizerGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const pressurizerMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const pressurizer = new THREE.Mesh(pressurizerGeo, pressurizerMat);
    pressurizer.position.set(-13, 4, 0);
    group.add(pressurizer);
    parts.push({ mesh: pressurizer, name: "Pressurizer", description: "Maintains high pressure in the primary coolant loop to prevent boiling." });

    // 3. Steam Generator
    const steamGenGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    const steamGenMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7 });
    const steamGenerator = new THREE.Mesh(steamGenGeo, steamGenMat);
    steamGenerator.position.set(-10, 0, 0);
    group.add(steamGenerator);
    parts.push({ mesh: steamGenerator, name: "Steam Generator", description: "Transfers heat from primary coolant to secondary loop to create steam." });

    // 4. Primary Coolant Pump
    const pumpGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x225588 });
    const primaryPump = new THREE.Mesh(pumpGeo, pumpMat);
    primaryPump.position.set(-12.5, -3, 0);
    group.add(primaryPump);
    parts.push({ mesh: primaryPump, name: "Primary Coolant Pump", description: "Circulates water between the reactor core and steam generator." });

    // 5. High-Pressure Turbine
    const hpTurbineGeo = new THREE.CylinderGeometry(1.5, 2.5, 4, 16);
    hpTurbineGeo.rotateZ(Math.PI / 2);
    const turbineMat = new THREE.MeshStandardMaterial({ color: 0xcc5500, metalness: 0.6, roughness: 0.4 });
    const hpTurbine = new THREE.Mesh(hpTurbineGeo, turbineMat);
    hpTurbine.position.set(-4, 0, 0);
    group.add(hpTurbine);
    parts.push({ mesh: hpTurbine, name: "High-Pressure Turbine", description: "Extracts energy from high-pressure steam to spin the shaft." });

    // 6. Low-Pressure Turbine
    const lpTurbineGeo = new THREE.CylinderGeometry(2.5, 3.5, 5, 16);
    lpTurbineGeo.rotateZ(Math.PI / 2);
    const lpTurbine = new THREE.Mesh(lpTurbineGeo, turbineMat);
    lpTurbine.position.set(2, 0, 0);
    group.add(lpTurbine);
    parts.push({ mesh: lpTurbine, name: "Low-Pressure Turbine", description: "Extracts remaining energy from steam after it leaves the high-pressure turbine." });

    // 7. Condenser
    const condenserGeo = new THREE.BoxGeometry(6, 3, 4);
    const condenserMat = new THREE.MeshStandardMaterial({ color: 0x4488cc, transparent: true, opacity: 0.8 });
    const condenser = new THREE.Mesh(condenserGeo, condenserMat);
    condenser.position.set(2, -4, 0);
    group.add(condenser);
    parts.push({ mesh: condenser, name: "Condenser", description: "Cools the exhaust steam back into liquid water to be reused." });

    // 8. Reduction Gear
    const gearGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 32);
    gearGeo.rotateZ(Math.PI / 2);
    const gearMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.5 });
    const reductionGear = new THREE.Mesh(gearGeo, gearMat);
    reductionGear.position.set(7, 0, 0);
    group.add(reductionGear);
    parts.push({ mesh: reductionGear, name: "Reduction Gear", description: "Reduces the high rotational speed of the turbines to an efficient speed for the propeller." });

    // 9. Thrust Bearing
    const bearingGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 16);
    bearingGeo.rotateZ(Math.PI / 2);
    const bearingMat = new THREE.MeshStandardMaterial({ color: 0xaaaa00, metalness: 0.6 });
    const thrustBearing = new THREE.Mesh(bearingGeo, bearingMat);
    thrustBearing.position.set(10, 0, 0);
    group.add(thrustBearing);
    parts.push({ mesh: thrustBearing, name: "Thrust Bearing", description: "Transfers the forward thrust from the propeller shaft to the hull of the submarine." });

    // 10. Propeller
    const propellerGroup = new THREE.Group();
    const hubGeo = new THREE.SphereGeometry(1, 16, 16);
    const propMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 }); // Bronze
    const hub = new THREE.Mesh(hubGeo, propMat);
    propellerGroup.add(hub);

    for (let i = 0; i < 7; i++) {
        const bladeGroup = new THREE.Group();
        const bladeGeo = new THREE.BoxGeometry(1, 4, 0.2);
        bladeGeo.translate(0, 2, 0);
        const blade = new THREE.Mesh(bladeGeo, propMat);
        blade.rotation.y = Math.PI / 6;
        bladeGroup.add(blade);
        bladeGroup.rotation.x = (i * Math.PI * 2) / 7;
        propellerGroup.add(bladeGroup);
    }
    propellerGroup.position.set(15, 0, 0);
    group.add(propellerGroup);
    parts.push({ mesh: propellerGroup, name: "Propeller", description: "Converts rotational motion into thrust, driving the submarine forward." });

    // Shaft connecting everything
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 20, 16);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(5, 0, 0);
    group.add(shaft);

    const questions = [
        {
            question: "What is the primary function of the Pressurizer in a nuclear submarine?",
            options: [
                "To create steam for the turbines",
                "To maintain high pressure in the primary coolant loop to prevent boiling",
                "To pressurize the submarine's hull",
                "To control the speed of the primary coolant pump"
            ],
            answer: 1
        },
        {
            question: "Why does the submarine propulsion system include a Reduction Gear?",
            options: [
                "To reduce the noise of the propeller",
                "To convert steam back into water",
                "To reduce the high rotational speed of the turbines to an efficient speed for the propeller",
                "To control the nuclear reaction rate"
            ],
            answer: 2
        },
        {
            question: "What role does the Thrust Bearing play?",
            options: [
                "It absorbs vibrations from the reactor",
                "It transfers the forward thrust from the propeller shaft to the hull",
                "It connects the high-pressure and low-pressure turbines",
                "It supports the weight of the reduction gear"
            ],
            answer: 1
        },
        {
            question: "Where is heat from the nuclear reactor transferred to create steam?",
            options: [
                "The Condenser",
                "The Pressurizer",
                "The Reactor Core",
                "The Steam Generator"
            ],
            answer: 3
        },
        {
            question: "What is the purpose of the Condenser?",
            options: [
                "To cool exhaust steam back into liquid water to be reused",
                "To cool the nuclear reactor directly",
                "To condense the size of the propulsion system",
                "To store excess steam pressure"
            ],
            answer: 0
        },
        {
            question: "Which component extracts the initial energy from high-pressure steam?",
            options: [
                "Low-Pressure Turbine",
                "Primary Coolant Pump",
                "High-Pressure Turbine",
                "Propeller"
            ],
            answer: 2
        }
    ];

    return {
        group,
        parts,
        questions,
        update: (delta) => {
            const speed = delta;
            hpTurbine.rotation.x += speed * 5;
            lpTurbine.rotation.x += speed * 5;
            reductionGear.rotation.x -= speed * 2;
            shaft.rotation.x -= speed * 2;
            propellerGroup.rotation.x -= speed * 2;
        }
    };
}
