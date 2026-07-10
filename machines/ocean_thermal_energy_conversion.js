export function createOceanThermalEnergyConversion(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // 1. Platform Structure
    const platformGeo = new THREE.CylinderGeometry(15, 15, 5, 32);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7, metalness: 0.3 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0, 0);
    model.add(platform);
    parts.push({
        name: "Platform Structure",
        description: "The main floating facility housing the OTEC components.",
        mesh: platform
    });

    // 2. Warm Water Intake
    const intakeGeo = new THREE.CylinderGeometry(2, 2, 10, 16);
    const intakeMat = new THREE.MeshStandardMaterial({ color: 0xff6644, roughness: 0.5 });
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.position.set(12, 1, 8);
    intake.rotation.z = Math.PI / 2;
    intake.rotation.y = Math.PI / 4;
    model.add(intake);
    parts.push({
        name: "Warm Water Intake",
        description: "Draws warm surface seawater to vaporize the working fluid.",
        mesh: intake
    });

    // 3. Cold Water Pipe
    const cwpGeo = new THREE.CylinderGeometry(3, 3, 40, 32);
    const cwpMat = new THREE.MeshStandardMaterial({ color: 0x4466ff, roughness: 0.6 });
    const cwp = new THREE.Mesh(cwpGeo, cwpMat);
    cwp.position.set(0, -22.5, 0);
    model.add(cwp);
    parts.push({
        name: "Cold Water Pipe",
        description: "A long pipe extending deep into the ocean to bring up cold water.",
        mesh: cwp
    });

    // 4. Evaporator
    const evapGeo = new THREE.CylinderGeometry(3.5, 3.5, 8, 32);
    const evapMat = new THREE.MeshStandardMaterial({ color: 0xffaa22, roughness: 0.4, metalness: 0.5 });
    const evaporator = new THREE.Mesh(evapGeo, evapMat);
    evaporator.position.set(-6, 6.5, 0);
    model.add(evaporator);
    parts.push({
        name: "Evaporator",
        description: "Heat exchanger where warm seawater boils the working fluid into vapor.",
        mesh: evaporator
    });

    // 5. Condenser
    const condGeo = new THREE.CylinderGeometry(3.5, 3.5, 8, 32);
    const condMat = new THREE.MeshStandardMaterial({ color: 0x22aaff, roughness: 0.4, metalness: 0.5 });
    const condenser = new THREE.Mesh(condGeo, condMat);
    condenser.position.set(6, 6.5, 0);
    model.add(condenser);
    parts.push({
        name: "Condenser",
        description: "Heat exchanger where cold seawater condenses the vapor back into a liquid.",
        mesh: condenser
    });

    // 6. Turbine
    const turbineGeo = new THREE.CylinderGeometry(2, 2, 5, 16);
    const turbineMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.8 });
    const turbine = new THREE.Mesh(turbineGeo, turbineMat);
    turbine.position.set(0, 6.5, 0);
    turbine.rotation.z = Math.PI / 2;
    model.add(turbine);
    parts.push({
        name: "Turbine",
        description: "Spun by the expanding vapor from the evaporator to generate mechanical energy.",
        mesh: turbine
    });

    // Turbine blades for visual animation
    const bladeGeo = new THREE.BoxGeometry(4.5, 0.2, 4.5);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    turbine.add(blade1);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade2.rotation.y = Math.PI / 2;
    turbine.add(blade2);

    // 7. Generator
    const genGeo = new THREE.BoxGeometry(4, 4, 5);
    const genMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.6, metalness: 0.4 });
    const generator = new THREE.Mesh(genGeo, genMat);
    generator.position.set(0, 6.5, -4.5);
    model.add(generator);
    parts.push({
        name: "Generator",
        description: "Converts the mechanical energy from the turbine into electrical energy.",
        mesh: generator
    });

    // 8. Working Fluid Pump
    const pumpGeo = new THREE.SphereGeometry(2, 32, 32);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.7 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(0, 3.5, 4);
    model.add(pump);
    parts.push({
        name: "Working Fluid Pump",
        description: "Pumps the condensed liquid working fluid back into the evaporator.",
        mesh: pump
    });

    // 9. Mooring System
    const moorGeo = new THREE.CylinderGeometry(0.5, 0.5, 35, 16);
    const moorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const mooring = new THREE.Mesh(moorGeo, moorMat);
    mooring.position.set(-8, -18, 8);
    mooring.rotation.x = -Math.PI / 8;
    mooring.rotation.z = Math.PI / 8;
    model.add(mooring);
    parts.push({
        name: "Mooring System",
        description: "Secures the OTEC platform to the ocean floor.",
        mesh: mooring
    });

    // 10. Power Export Cable
    const cableGeo = new THREE.CylinderGeometry(0.8, 0.8, 30, 16);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(15, -5, 0);
    cable.rotation.z = Math.PI / 2;
    cable.rotation.y = -Math.PI / 6;
    model.add(cable);
    parts.push({
        name: "Power Export Cable",
        description: "Transmits the generated electricity from the plant to the onshore grid.",
        mesh: cable
    });

    // Pipes connecting heat exchangers and turbine
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.5 });
    
    const p1Geo = new THREE.CylinderGeometry(0.8, 0.8, 2.5);
    const p1 = new THREE.Mesh(p1Geo, pipeMat);
    p1.position.set(-2.5, 6.5, 0);
    p1.rotation.z = Math.PI / 2;
    model.add(p1);

    const p2 = new THREE.Mesh(p1Geo, pipeMat);
    p2.position.set(2.5, 6.5, 0);
    p2.rotation.z = Math.PI / 2;
    model.add(p2);

    const update = (time) => {
        // Spin the turbine around its local axis
        turbine.rotation.x = time * 5;

        // Bobbing animation for the platform to simulate floating on ocean waves
        model.position.y = Math.sin(time * 2) * 0.5;
    };

    const quizzes = [
        {
            question: "What is the primary heat source for an Ocean Thermal Energy Conversion (OTEC) plant?",
            options: ["Geothermal vents", "Solar radiation on surface water", "Nuclear reactions", "Fossil fuels"],
            correctAnswer: 1
        },
        {
            question: "What is the purpose of the Cold Water Pipe?",
            options: ["To cool the generator", "To condense the working fluid vapor", "To evaporate the working fluid", "To provide drinking water"],
            correctAnswer: 1
        },
        {
            question: "Which component converts the mechanical energy from the turbine into electricity?",
            options: ["Evaporator", "Condenser", "Working Fluid Pump", "Generator"],
            correctAnswer: 3
        },
        {
            question: "What happens in the Evaporator of a closed-cycle OTEC system?",
            options: ["Warm seawater boils a working fluid with a low boiling point", "Cold seawater is heated by the sun", "Vapor is condensed back into a liquid", "Electricity is stepped up for transmission"],
            correctAnswer: 0
        },
        {
            question: "What is the role of the Working Fluid Pump?",
            options: ["To pump warm water into the plant", "To pump condensed working fluid back to the evaporator", "To pump cold water from the deep ocean", "To export electricity to the grid"],
            correctAnswer: 1
        },
        {
            question: "Why must the Cold Water Pipe extend deep into the ocean?",
            options: ["To reach water that is cold enough to condense the working fluid", "To anchor the platform", "To avoid surface storms", "To reach underwater power cables"],
            correctAnswer: 0
        }
    ];

    return { model, update, parts, quizzes };
}
