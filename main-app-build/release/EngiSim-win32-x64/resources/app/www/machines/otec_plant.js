export function createOtecPlant(THREE) {
    const plantGroup = new THREE.Group();

    // 1. Warm Surface Water Intake
    const intakeGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    const intakeMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500, transparent: true, opacity: 0.8 });
    const intake = new THREE.Mesh(intakeGeometry, intakeMaterial);
    intake.position.set(-6, 8, 0);
    intake.name = "Warm Surface Water Intake";
    intake.userData.description = "Draws in warm surface seawater to vaporize the working fluid.";
    plantGroup.add(intake);

    // 2. Ammonia Evaporator
    const evaporatorGeometry = new THREE.BoxGeometry(4, 6, 4);
    const evaporatorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const evaporator = new THREE.Mesh(evaporatorGeometry, evaporatorMaterial);
    evaporator.position.set(-6, 3, 0);
    evaporator.name = "Ammonia Evaporator";
    evaporator.userData.description = "Heat exchanger where warm water evaporates the low-boiling-point working fluid (ammonia).";
    plantGroup.add(evaporator);

    // 3. Steam Turbine
    const turbineGeometry = new THREE.CylinderGeometry(1.5, 2, 5, 16);
    const turbineMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const turbine = new THREE.Mesh(turbineGeometry, turbineMaterial);
    turbine.rotation.z = Math.PI / 2;
    turbine.position.set(0, 3, 0);
    turbine.name = "Steam Turbine";
    turbine.userData.description = "The expanding ammonia vapor drives this turbine to produce mechanical energy.";
    plantGroup.add(turbine);

    // 4. Electrical Generator
    const generatorGeometry = new THREE.BoxGeometry(3, 3, 3);
    const generatorMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const generator = new THREE.Mesh(generatorGeometry, generatorMaterial);
    generator.position.set(4, 3, 0);
    generator.name = "Electrical Generator";
    generator.userData.description = "Converts the mechanical energy from the turbine into electrical power.";
    plantGroup.add(generator);

    // 5. Deep Cold Water Pipe
    const pipeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x00008b, transparent: true, opacity: 0.8 });
    const coldPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    coldPipe.position.set(0, -10, 0);
    coldPipe.name = "Deep Cold Water Pipe";
    coldPipe.userData.description = "Brings cold seawater from the deep ocean to the condenser.";
    plantGroup.add(coldPipe);

    // 6. Condenser Unit
    const condenserGeometry = new THREE.BoxGeometry(4, 6, 4);
    const condenserMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff });
    const condenser = new THREE.Mesh(condenserGeometry, condenserMaterial);
    condenser.position.set(0, -2, 0);
    condenser.name = "Condenser Unit";
    condenser.userData.description = "Heat exchanger where cold water cools the ammonia vapor back into a liquid.";
    plantGroup.add(condenser);

    // 7. Working Fluid Pump
    const pumpGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const pumpMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const pump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    pump.position.set(-3, 0, 0);
    pump.name = "Working Fluid Pump";
    pump.userData.description = "Pumps the condensed liquid working fluid back to the evaporator.";
    plantGroup.add(pump);

    // 8. Mixed Water Discharge
    const dischargeGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    const dischargeMaterial = new THREE.MeshStandardMaterial({ color: 0x4682b4 });
    const discharge = new THREE.Mesh(dischargeGeometry, dischargeMaterial);
    discharge.position.set(6, -4, 0);
    discharge.rotation.z = Math.PI / 4;
    discharge.name = "Mixed Water Discharge";
    discharge.userData.description = "Releases the mixed warm and cold seawater back into the ocean.";
    plantGroup.add(discharge);

    // 9. Floating Hull Structure
    const hullGeometry = new THREE.BoxGeometry(20, 2, 10);
    const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.set(0, -3.5, 0);
    hull.name = "Floating Hull Structure";
    hull.userData.description = "The main platform supporting all the OTEC plant components.";
    plantGroup.add(hull);

    // 10. Mooring System
    const mooringGeometry = new THREE.CylinderGeometry(0.2, 0.2, 20, 8);
    const mooringMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const mooringLine1 = new THREE.Mesh(mooringGeometry, mooringMaterial);
    mooringLine1.position.set(-9, -13.5, 4);
    mooringLine1.rotation.z = Math.PI / 6;
    const mooringLine2 = new THREE.Mesh(mooringGeometry, mooringMaterial);
    mooringLine2.position.set(9, -13.5, -4);
    mooringLine2.rotation.z = -Math.PI / 6;
    
    const mooringSystem = new THREE.Group();
    mooringSystem.add(mooringLine1);
    mooringSystem.add(mooringLine2);
    mooringSystem.name = "Mooring System";
    mooringSystem.userData.description = "Anchors the floating OTEC facility to the ocean floor.";
    plantGroup.add(mooringSystem);

    const animator = (time) => {
        turbine.rotation.x = time * 2;
        pump.scale.set(1 + 0.1 * Math.sin(time * 5), 1 + 0.1 * Math.sin(time * 5), 1 + 0.1 * Math.sin(time * 5));
    };

    const quiz = [
        {
            question: "What is the primary heat source for an Ocean Thermal Energy Conversion (OTEC) plant?",
            options: [
                "Geothermal vents",
                "Solar-heated surface seawater",
                "Deep ocean currents",
                "Fossil fuels"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of the following is commonly used as a working fluid in a closed-cycle OTEC system?",
            options: [
                "Water",
                "Helium",
                "Ammonia",
                "Carbon dioxide"
            ],
            correctAnswer: 2
        },
        {
            question: "What component is responsible for turning the working fluid vapor back into a liquid?",
            options: [
                "Evaporator",
                "Turbine",
                "Condenser",
                "Pump"
            ],
            correctAnswer: 2
        },
        {
            question: "OTEC relies on the temperature difference between warm surface water and cold deep water. What is the typical minimum temperature difference required for OTEC to be viable?",
            options: [
                "5°C",
                "10°C",
                "20°C",
                "50°C"
            ],
            correctAnswer: 2
        },
        {
            question: "In thermodynamics, what limits the theoretical maximum efficiency of an OTEC plant?",
            options: [
                "Carnot efficiency",
                "Betz's limit",
                "Shockley-Queisser limit",
                "Rankine efficiency"
            ],
            correctAnswer: 0
        },
        {
            question: "What does the deep cold water pipe do in an OTEC system?",
            options: [
                "Discharges waste heat into the deep ocean",
                "Brings cold water up to condense the working fluid",
                "Pumps warm water down to heat the deep ocean",
                "Anchors the plant to the seabed"
            ],
            correctAnswer: 1
        }
    ];

    return {
        model: plantGroup,
        animator,
        quiz
    };
}
