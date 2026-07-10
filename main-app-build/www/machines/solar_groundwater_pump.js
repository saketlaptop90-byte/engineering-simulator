export function createSolarGroundwaterPump(THREE) {
    const group = new THREE.Group();

    // 1. Solar Array
    const solarArray = new THREE.Group();
    solarArray.userData.name = "Solar Array";
    for(let i=0; i<3; i++) {
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.1, 3), 
            new THREE.MeshStandardMaterial({color: 0x001155, metalness: 0.8, roughness: 0.1})
        );
        panel.position.set((i-1)*2, 0, 0);
        solarArray.add(panel);
    }
    solarArray.position.set(0, 3, 0);
    solarArray.rotation.x = Math.PI / 6;

    // 2. Tracking Mount
    const trackingMount = new THREE.Group();
    trackingMount.userData.name = "Tracking Mount";
    const mountPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 3), 
        new THREE.MeshStandardMaterial({color: 0x888888})
    );
    mountPole.position.set(0, 1.5, 0);
    trackingMount.add(mountPole);
    trackingMount.add(solarArray);
    trackingMount.position.set(-6, 0, 0);
    group.add(trackingMount);

    // 3. Inverter
    const inverter = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 0.6), 
        new THREE.MeshStandardMaterial({color: 0xdddddd})
    );
    inverter.position.set(-6, 0.6, 1);
    inverter.userData.name = "Inverter";
    group.add(inverter);

    // 4. Submersible Pump
    const submersiblePump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 2), 
        new THREE.MeshStandardMaterial({color: 0x222222})
    );
    submersiblePump.position.set(0, -7.5, 0);
    submersiblePump.userData.name = "Submersible Pump";
    group.add(submersiblePump);

    // 5. Riser Pipe
    const riserPipe = new THREE.Group();
    riserPipe.userData.name = "Riser Pipe";
    const vPipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 8.5), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    vPipe1.position.set(0, -3.25, 0);
    const hPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    hPipe.rotation.z = Math.PI / 2;
    hPipe.position.set(3, 1, 0);
    const vPipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.5), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    vPipe2.position.set(6, 2.75, 0);
    riserPipe.add(vPipe1, hPipe, vPipe2);
    group.add(riserPipe);

    // 6. Well Casing
    const wellCasing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 8), 
        new THREE.MeshStandardMaterial({color: 0x555555, transparent: true, opacity: 0.6})
    );
    wellCasing.position.set(0, -4, 0);
    wellCasing.userData.name = "Well Casing";
    group.add(wellCasing);

    // 7. Water Storage Tank
    const waterStorageTank = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 5), 
        new THREE.MeshStandardMaterial({color: 0x33aaff, transparent: true, opacity: 0.7})
    );
    waterStorageTank.position.set(6, 2.5, 0);
    waterStorageTank.userData.name = "Water Storage Tank";
    group.add(waterStorageTank);

    // 8. Float Switch
    const floatSwitch = new THREE.Mesh(
        new THREE.SphereGeometry(0.4), 
        new THREE.MeshStandardMaterial({color: 0xff4444})
    );
    floatSwitch.position.set(6, 3.5, 0);
    floatSwitch.userData.name = "Float Switch";
    group.add(floatSwitch);

    // 9. Overflow Pipe
    const overflowPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 2), 
        new THREE.MeshStandardMaterial({color: 0xaaaaaa})
    );
    overflowPipe.rotation.z = Math.PI / 2;
    overflowPipe.position.set(8, 4, 0);
    overflowPipe.userData.name = "Overflow Pipe";
    group.add(overflowPipe);

    // 10. Filtration Unit
    const filtrationUnit = new THREE.Group();
    filtrationUnit.userData.name = "Filtration Unit";
    
    const filterBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 1.5), 
        new THREE.MeshStandardMaterial({color: 0x228822})
    );
    filterBody.rotation.x = Math.PI / 2;
    filterBody.position.set(6, 0.5, 3.5);
    filtrationUnit.add(filterBody);

    const outletPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 2.5), 
        new THREE.MeshStandardMaterial({color: 0xaaaaaa})
    );
    outletPipe.rotation.x = Math.PI / 2;
    outletPipe.position.set(6, 0.5, 1.5);
    filtrationUnit.add(outletPipe);
    
    group.add(filtrationUnit);

    // Ground plane (decorative)
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({color: 0x448844})
    );
    ground.rotation.x = -Math.PI / 2;
    group.add(ground);

    let time = 0;
    const update = (delta) => {
        time += delta;
        // Tracking mount follows the sun
        trackingMount.rotation.y = Math.sin(time * 0.3) * 0.5;
        // Float switch bobbing on water
        floatSwitch.position.y = 3.5 + Math.sin(time * 2) * 0.1;
        // Subtle water effect on tank opacity
        waterStorageTank.material.opacity = 0.6 + Math.sin(time * 5) * 0.05;
    };

    const quiz = [
        {
            question: "What is the primary function of the inverter in a solar pumping system?",
            options: [
                "To convert DC electricity from solar panels into AC electricity for the pump",
                "To store water for later use",
                "To track the movement of the sun",
                "To filter impurities from the groundwater"
            ],
            answer: "To convert DC electricity from solar panels into AC electricity for the pump"
        },
        {
            question: "Why is a tracking mount used for solar arrays?",
            options: [
                "To maximize solar energy capture by continuously facing the sun",
                "To protect the panels from strong winds",
                "To cool down the solar panels",
                "To increase the water pressure in the pipes"
            ],
            answer: "To maximize solar energy capture by continuously facing the sun"
        },
        {
            question: "What is the purpose of the submersible pump?",
            options: [
                "To push groundwater from deep within the well to the surface",
                "To purify the water before it enters the tank",
                "To regulate the voltage from the solar panels",
                "To prevent the well borehole from collapsing"
            ],
            answer: "To push groundwater from deep within the well to the surface"
        },
        {
            question: "What role does the well casing play in a groundwater system?",
            options: [
                "It prevents the borehole from collapsing and protects groundwater from contamination",
                "It generates electricity from water flow",
                "It monitors the water level in the storage tank",
                "It connects the solar panels to the inverter"
            ],
            answer: "It prevents the borehole from collapsing and protects groundwater from contamination"
        },
        {
            question: "How does a float switch operate within the water storage tank?",
            options: [
                "It automatically turns the pump on or off based on the tank's water level",
                "It adds chlorine to the water for purification",
                "It measures the temperature of the water",
                "It manually overrides the solar panel tracking"
            ],
            answer: "It automatically turns the pump on or off based on the tank's water level"
        },
        {
            question: "What is the function of the filtration unit?",
            options: [
                "To remove particulate matter and impurities from the pumped water before use",
                "To store excess energy generated by solar panels",
                "To prevent water from overflowing out of the tank",
                "To track the sun's position throughout the day"
            ],
            answer: "To remove particulate matter and impurities from the pumped water before use"
        }
    ];

    return { model: group, update, quiz };
}
