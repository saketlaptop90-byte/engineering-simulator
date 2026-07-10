export function createHPLCSystem(THREE) {
    const group = new THREE.Group();

    // Materials
    const glassMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 
    });
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x888888, metalness: 0.8, roughness: 0.3 
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({ 
        color: 0x444444, metalness: 0.7, roughness: 0.5 
    });
    const plasticMat = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee, roughness: 0.6 
    });
    const screenMat = new THREE.MeshBasicMaterial({ 
        color: 0x004488 
    });
    
    // 1. Solvent Reservoirs
    const reservoirs = new THREE.Group();
    const resGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const resA = new THREE.Mesh(resGeo, glassMat);
    resA.position.set(-0.8, 4.25, 0);
    const resB = new THREE.Mesh(resGeo, glassMat);
    resB.position.set(0.8, 4.25, 0);
    reservoirs.add(resA, resB);
    reservoirs.userData.name = "Solvent Reservoirs";
    group.add(reservoirs);

    // 2. Degasser
    const degasserGeo = new THREE.BoxGeometry(3, 1, 2);
    const degasser = new THREE.Mesh(degasserGeo, plasticMat);
    degasser.position.set(0, 3, 0);
    degasser.userData.name = "Degasser";
    group.add(degasser);

    // 3. High-Pressure Pump
    const pumpGroup = new THREE.Group();
    const pumpBodyGeo = new THREE.BoxGeometry(3, 1.5, 2);
    const pumpBody = new THREE.Mesh(pumpBodyGeo, darkMetalMat);
    
    // Pump pistons (animated)
    const pistonGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const piston1 = new THREE.Mesh(pistonGeo, metalMat);
    piston1.rotation.z = Math.PI / 2;
    piston1.position.set(-1.6, 0.2, 0.5);
    const piston2 = new THREE.Mesh(pistonGeo, metalMat);
    piston2.rotation.z = Math.PI / 2;
    piston2.position.set(-1.6, -0.2, 0.5);
    pumpGroup.add(pumpBody, piston1, piston2);
    pumpGroup.position.set(0, 1.5, 0);
    pumpGroup.userData.name = "High-Pressure Pump";
    group.add(pumpGroup);

    // 4. Autosampler
    const autosamplerGeo = new THREE.BoxGeometry(3, 1.5, 2);
    const autosampler = new THREE.Mesh(autosamplerGeo, plasticMat);
    autosampler.position.set(0, -0.25, 0);
    autosampler.userData.name = "Autosampler";
    group.add(autosampler);

    // 5. Injector Valve
    const valveGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    const valve = new THREE.Mesh(valveGeo, metalMat);
    valve.rotation.x = Math.PI / 2;
    // Positioned on the front panel of the autosampler
    valve.position.set(1.0, -0.25, 1.1);
    valve.userData.name = "Injector Valve";
    group.add(valve);

    // 6. Column Oven
    const ovenGeo = new THREE.BoxGeometry(1.5, 4, 1);
    const oven = new THREE.Mesh(ovenGeo, darkMetalMat);
    oven.position.set(2.5, 1.5, 0);
    oven.userData.name = "Column Oven";
    group.add(oven);

    // 7. HPLC Column
    const columnGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
    const column = new THREE.Mesh(columnGeo, metalMat);
    column.position.set(2.5, 1.5, 0.6); // Slightly protruding from oven for visibility
    column.userData.name = "HPLC Column";
    group.add(column);

    // 8. UV-Vis Detector
    const detectorGeo = new THREE.BoxGeometry(3, 1.5, 2);
    const detector = new THREE.Mesh(detectorGeo, plasticMat);
    detector.position.set(0, -2, 0);
    detector.userData.name = "UV-Vis Detector";
    group.add(detector);

    // 9. Waste Container
    const wasteGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16);
    const waste = new THREE.Mesh(wasteGeo, glassMat);
    waste.position.set(-2.5, -2, 0);
    waste.userData.name = "Waste Container";
    group.add(waste);

    // 10. Workstation Screen
    const screenGroup = new THREE.Group();
    const monitorGeo = new THREE.BoxGeometry(2.5, 1.5, 0.1);
    const monitor = new THREE.Mesh(monitorGeo, darkMetalMat);
    const displayGeo = new THREE.PlaneGeometry(2.3, 1.3);
    const display = new THREE.Mesh(displayGeo, screenMat);
    display.position.z = 0.06;
    screenGroup.add(monitor, display);
    screenGroup.position.set(4, 3, 0);
    screenGroup.rotation.y = -Math.PI / 6;
    screenGroup.userData.name = "Workstation Screen";
    group.add(screenGroup);

    // Animation state
    group.userData.update = function(t) {
        // 1. Pump pistons oscillating (reciprocating motion out of phase by 180 degrees)
        piston1.position.x = -1.6 + Math.sin(t * 6) * 0.15;
        piston2.position.x = -1.6 + Math.sin(t * 6 + Math.PI) * 0.15;

        // 2. Injector Valve switching from load to inject every few seconds
        const cycle = t % 6;
        if (cycle < 3) {
            // Load position (0 degrees)
            valve.rotation.z = THREE.MathUtils.lerp(valve.rotation.z, 0, 0.1);
        } else {
            // Inject position (60 degrees)
            valve.rotation.z = THREE.MathUtils.lerp(valve.rotation.z, Math.PI / 3, 0.1);
        }

        // 3. Workstation Screen graph update (chromatogram drawing simulation)
        // Pulsating color to simulate real-time plotting of peaks
        const intensity = (Math.sin(t * 8) * Math.sin(t * 3) + 1) / 2;
        screenMat.color.setHSL(0.55, 0.8, 0.2 + intensity * 0.4);
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the Degasser in an HPLC system?",
            options: [
                "To remove dissolved gases from the mobile phase",
                "To heat the solvent to vaporization point",
                "To detect analytes in the mobile phase",
                "To inject the sample into the flow path"
            ],
            answer: 0
        },
        {
            question: "Which component is responsible for forcing the mobile phase through the HPLC Column at high pressure?",
            options: [
                "Injector Valve",
                "High-Pressure Pump",
                "Solvent Reservoir",
                "Waste Container"
            ],
            answer: 1
        },
        {
            question: "What does the HPLC Column contain to facilitate the separation of the mixture?",
            options: [
                "Stationary phase",
                "Mobile phase",
                "Photodiode array",
                "Vacuum pump"
            ],
            answer: 0
        },
        {
            question: "What is the purpose of the Column Oven?",
            options: [
                "To evaporate the solvent after detection",
                "To maintain a constant and precise temperature for reproducible separations",
                "To sterilize the column before use",
                "To mix the sample with the mobile phase"
            ],
            answer: 1
        },
        {
            question: "How does the UV-Vis Detector identify chemical components?",
            options: [
                "By measuring the mass-to-charge ratio of ions",
                "By measuring the absorption of ultraviolet or visible light by the analytes",
                "By detecting radioactive decay of tagged molecules",
                "By measuring the electrical conductivity of the solution"
            ],
            answer: 1
        },
        {
            question: "What happens when the Injector Valve switches from the 'load' to the 'inject' position?",
            options: [
                "The sample is sent directly to the waste container",
                "The high-pressure pump is temporarily stopped",
                "The sample loop is connected to the high-pressure mobile phase stream, pushing the sample onto the column",
                "The degasser is bypassed to increase flow rate"
            ],
            answer: 2
        }
    ];

    return group;
}
