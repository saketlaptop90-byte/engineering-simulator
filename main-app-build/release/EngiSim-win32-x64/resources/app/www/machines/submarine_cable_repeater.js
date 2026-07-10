export function createSubmarineCableRepeater(THREE) {
    const group = new THREE.Group();

    // 1. Polyethylene Insulation (Outer layer)
    const insulationGeo = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
    const insulationMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        transparent: true, 
        opacity: 0.3 
    });
    const insulation = new THREE.Mesh(insulationGeo, insulationMat);
    insulation.rotation.z = Math.PI / 2;
    insulation.userData.name = "Polyethylene Insulation";
    group.add(insulation);

    // 2. Beryllium Copper Casing (Inner strength layer)
    const casingGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.8, 32);
    const casingMat = new THREE.MeshStandardMaterial({ 
        color: 0xb87333,
        transparent: true,
        opacity: 0.5
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.z = Math.PI / 2;
    casing.userData.name = "Beryllium Copper Casing";
    group.add(casing);

    // 3. Pressure Housing (Core housing)
    const housingGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.6, 32);
    const housingMat = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        transparent: true,
        opacity: 0.6
    });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.rotation.z = Math.PI / 2;
    housing.userData.name = "Pressure Housing";
    group.add(housing);

    // 4. Fiber Splice Box
    const spliceBoxGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const spliceBoxMat = new THREE.MeshStandardMaterial({ color: 0x224488 });
    const spliceBox = new THREE.Mesh(spliceBoxGeo, spliceBoxMat);
    spliceBox.position.set(-1.2, 0, 0);
    spliceBox.userData.name = "Fiber Splice Box";
    group.add(spliceBox);

    // 5. Erbium-Doped Fiber Amplifier (EDFA)
    const edfaGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
    const edfaMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.2 });
    const edfa = new THREE.Mesh(edfaGeo, edfaMat);
    edfa.rotation.y = Math.PI / 2;
    edfa.userData.name = "Erbium-Doped Fiber Amplifier";
    group.add(edfa);

    // 6. Power Feed Line
    const powerLineGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.4, 16);
    const powerLineMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const powerLine = new THREE.Mesh(powerLineGeo, powerLineMat);
    powerLine.rotation.z = Math.PI / 2;
    powerLine.position.set(0, 0.3, 0);
    powerLine.userData.name = "Power Feed Line";
    group.add(powerLine);

    // 7. Pump Lasers
    const pumpGeo = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.2 });
    const pumpLaser = new THREE.Mesh(pumpGeo, pumpMat);
    pumpLaser.position.set(0, -0.3, 0);
    pumpLaser.userData.name = "Pump Lasers";
    group.add(pumpLaser);

    // 8. Optical Isolator
    const isolatorGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
    const isolatorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const isolator = new THREE.Mesh(isolatorGeo, isolatorMat);
    isolator.rotation.z = Math.PI / 2;
    isolator.position.set(0.6, 0, 0);
    isolator.userData.name = "Optical Isolator";
    group.add(isolator);

    // 9. Gain Equalization Filter
    const filterGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const filterMat = new THREE.MeshStandardMaterial({ color: 0xddaa00 });
    const filter = new THREE.Mesh(filterGeo, filterMat);
    filter.position.set(1.2, 0, 0);
    filter.userData.name = "Gain Equalization Filter";
    group.add(filter);

    // 10. Sea Ground
    const groundGeo = new THREE.ConeGeometry(0.1, 0.5, 16);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const seaGround = new THREE.Mesh(groundGeo, groundMat);
    seaGround.position.set(0, 0, 0.6);
    seaGround.rotation.x = Math.PI / 2;
    seaGround.userData.name = "Sea Ground";
    group.add(seaGround);

    group.userData.update = function(time) {
        // Animation: Pump lasers fire, sending energy to EDFA which then amplifies the signal
        const pumpPulse = (Math.sin(time * 4) + 1) / 2; 
        pumpLaser.material.emissiveIntensity = 0.1 + pumpPulse * 0.9;
        
        // EDFA amplifies slightly out of phase with the pump
        const edfaPulse = (Math.sin(time * 4 - Math.PI / 4) + 1) / 2;
        edfa.material.emissiveIntensity = 0.1 + edfaPulse * 0.9;
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the Erbium-Doped Fiber Amplifier (EDFA) in a submarine cable repeater?",
            options: ["To convert optical signals to electrical signals", "To optically amplify the signal without electrical conversion", "To ground the cable to the sea floor", "To filter out different colors of light"],
            answer: 1
        },
        {
            question: "Why is a Beryllium Copper Casing often used in submarine repeaters?",
            options: ["It is highly transparent", "It provides high strength and resistance to high pressures at the ocean floor", "It is an optical isolator", "It acts as the primary data conductor"],
            answer: 1
        },
        {
            question: "What role do Pump Lasers play in an EDFA?",
            options: ["They cut the fiber during splicing", "They transmit the primary data signal", "They excite the erbium ions to provide optical gain", "They supply electrical power to the repeater"],
            answer: 2
        },
        {
            question: "What is the purpose of an Optical Isolator in a repeater?",
            options: ["To prevent light from reflecting backward and causing noise or instability", "To separate the power feed from the optical signal", "To combine multiple wavelengths together", "To block all light during maintenance"],
            answer: 0
        },
        {
            question: "How are submarine cable repeaters powered?",
            options: ["By solar panels floating on the surface", "By onboard nuclear batteries", "By a constant electrical current sent through the Power Feed Line from the shore stations", "By harvesting tidal energy"],
            answer: 2
        },
        {
            question: "What does the Gain Equalization Filter do?",
            options: ["It equalizes the pressure inside the housing", "It ensures all amplified wavelengths (channels) have roughly the same optical power", "It filters out electrical noise from the power line", "It balances the physical weight of the repeater"],
            answer: 1
        }
    ];

    return group;
}
