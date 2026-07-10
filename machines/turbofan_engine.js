export function createTurbofanEngine(THREE) {
    const engineGroup = new THREE.Group();

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const outerCowlMat = new THREE.MeshStandardMaterial({ color: 0x113355, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const hotMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xaa2200, transparent: true, opacity: 0.8 });

    // Helper to generate rotating blade stages
    function createBladedStage(radius, hubRadius, numBlades, bladeWidth, colorHex) {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
        
        const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, bladeWidth, 16);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, material);
        group.add(hub);

        const bladeGeo = new THREE.BoxGeometry(radius - hubRadius, 0.02, bladeWidth * 0.8);
        bladeGeo.translate((radius + hubRadius) / 2, 0, 0);

        for (let i = 0; i < numBlades; i++) {
            const angle = (i / numBlades) * Math.PI * 2;
            const pivot = new THREE.Group();
            pivot.rotation.z = angle;
            
            const blade = new THREE.Mesh(bladeGeo, material);
            blade.rotation.x = Math.PI / 6; // Pitch angle
            
            pivot.add(blade);
            group.add(pivot);
        }
        return group;
    }

    // 1. Fan
    const fan = createBladedStage(2.1, 0.3, 24, 0.4, 0xdddddd);
    fan.position.z = 4.0;
    fan.name = "Fan";
    
    // Fan Spinner (Nose Cone)
    const spinnerGeo = new THREE.ConeGeometry(0.3, 0.8, 16);
    spinnerGeo.rotateX(Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, metalMat);
    spinner.position.z = 0.4;
    fan.add(spinner);
    
    engineGroup.add(fan);

    // 2. Low Pressure Compressor (LPC)
    const lpc = new THREE.Group();
    lpc.name = "LowPressureCompressor";
    for(let i = 0; i < 3; i++) {
        const stage = createBladedStage(1.2, 0.3, 20, 0.3, 0x999999);
        stage.position.z = 2.8 - i * 0.5;
        lpc.add(stage);
    }
    engineGroup.add(lpc);

    // 3. High Pressure Compressor (HPC)
    const hpc = new THREE.Group();
    hpc.name = "HighPressureCompressor";
    for(let i = 0; i < 5; i++) {
        const stage = createBladedStage(0.9, 0.4, 28, 0.2, 0x888888);
        stage.position.z = 1.0 - i * 0.3;
        hpc.add(stage);
    }
    engineGroup.add(hpc);

    // 4. Combustion Chamber
    const ccGeo = new THREE.TorusGeometry(0.65, 0.25, 16, 32);
    const combustionChamber = new THREE.Mesh(ccGeo, hotMat);
    combustionChamber.scale.set(1, 1, 3.5);
    combustionChamber.position.z = -0.6;
    combustionChamber.name = "CombustionChamber";
    engineGroup.add(combustionChamber);

    // 5. High Pressure Turbine (HPT)
    const hpt = new THREE.Group();
    hpt.name = "HighPressureTurbine";
    for(let i = 0; i < 2; i++) {
        const stage = createBladedStage(0.9, 0.4, 24, 0.25, 0x776655);
        stage.position.z = -1.4 - i * 0.4;
        hpt.add(stage);
    }
    engineGroup.add(hpt);

    // 6. Low Pressure Turbine (LPT)
    const lpt = new THREE.Group();
    lpt.name = "LowPressureTurbine";
    for(let i = 0; i < 4; i++) {
        const stage = createBladedStage(1.2, 0.3, 20, 0.3, 0x665544);
        stage.position.z = -2.4 - i * 0.4;
        lpt.add(stage);
    }
    
    // Tail Cone attached to LPT
    const tailConeGeo = new THREE.ConeGeometry(0.3, 1.5, 16);
    tailConeGeo.rotateX(-Math.PI / 2); // Pointing backwards
    const tailCone = new THREE.Mesh(tailConeGeo, darkMetalMat);
    tailCone.position.z = -4.5;
    lpt.add(tailCone);
    
    engineGroup.add(lpt);

    // 7. Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(1.3, 0.8, 1.5, 32, 1, true);
    nozzleGeo.rotateX(Math.PI / 2); // Base faces front (+Z), tip faces back (-Z)
    const exhaustNozzle = new THREE.Mesh(nozzleGeo, darkMetalMat);
    exhaustNozzle.position.z = -4.5;
    exhaustNozzle.name = "ExhaustNozzle";
    engineGroup.add(exhaustNozzle);

    // 8. Bypass Duct (Core Casing)
    const ductGeo = new THREE.CylinderGeometry(1.3, 1.3, 7.2, 32, 1, true);
    ductGeo.rotateX(Math.PI / 2);
    const bypassDuct = new THREE.Mesh(ductGeo, casingMat);
    bypassDuct.position.z = -0.5; // Encloses from Z=3.1 to Z=-4.1
    bypassDuct.name = "BypassDuct";
    engineGroup.add(bypassDuct);

    // 9. Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 9.5, 16);
    shaftGeo.rotateX(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, darkMetalMat);
    shaft.position.z = -0.5;
    shaft.name = "Shaft";
    engineGroup.add(shaft);

    // 10. Cowling
    const cowling = new THREE.Group();
    cowling.name = "Cowling";
    
    const cowlGeo = new THREE.CylinderGeometry(2.2, 2.1, 9.0, 32, 1, true);
    cowlGeo.rotateX(Math.PI / 2);
    const cowlMesh = new THREE.Mesh(cowlGeo, outerCowlMat);
    cowlMesh.position.z = 0.0;
    cowling.add(cowlMesh);

    // Inlet Lip for aerodynamic entry
    const lipGeo = new THREE.TorusGeometry(2.15, 0.05, 16, 32);
    const lip = new THREE.Mesh(lipGeo, outerCowlMat);
    lip.position.z = 4.5;
    cowling.add(lip);

    engineGroup.add(cowling);

    // Kinematics Animation
    engineGroup.update = function(dt) {
        if (!dt) return;
        
        // Typical dual-spool rotation speeds
        const w1 = 5.0 * dt; // Low pressure spool (N1) speed
        const w2 = 8.0 * dt; // High pressure spool (N2) speed

        // LP Spool Rotation
        fan.rotation.z -= w1;
        lpc.rotation.z -= w1;
        lpt.rotation.z -= w1;
        shaft.rotation.z -= w1; // Visual shaft rotating with LP

        // HP Spool Rotation
        hpc.rotation.z -= w2;
        hpt.rotation.z -= w2;

        // Combustion flicker effect
        const time = Date.now() * 0.005;
        hotMat.emissiveIntensity = 0.7 + 0.3 * Math.sin(time);
    };

    // Quiz Questions
    engineGroup.quiz = [
        {
            question: "Which component provides the majority of the thrust in a modern commercial turbofan engine?",
            options: ["Fan", "Exhaust Nozzle", "High Pressure Compressor", "Combustion Chamber"],
            answer: "Fan"
        },
        {
            question: "What is the primary purpose of the bypass duct?",
            options: [
                "To route air around the engine core for increased efficiency and thrust",
                "To mix fuel and air before combustion",
                "To cool the turbine blades",
                "To reduce the engine's weight"
            ],
            answer: "To route air around the engine core for increased efficiency and thrust"
        },
        {
            question: "Which turbine component directly drives the high-pressure compressor?",
            options: ["High Pressure Turbine", "Low Pressure Turbine", "Power Turbine", "Fan Turbine"],
            answer: "High Pressure Turbine"
        },
        {
            question: "What happens to the highly compressed air inside the combustion chamber?",
            options: [
                "It is mixed with fuel and ignited, expanding rapidly",
                "It is compressed further to its maximum pressure",
                "It is bypassed around the core",
                "It is cooled rapidly to prevent engine melting"
            ],
            answer: "It is mixed with fuel and ignited, expanding rapidly"
        },
        {
            question: "Why does the high-pressure shaft rotate significantly faster than the low-pressure shaft?",
            options: [
                "It has smaller diameter components and extracts energy from the highest-pressure gas flow",
                "It is physically lighter than the low-pressure shaft",
                "It is powered entirely by the bypass airflow",
                "It contains fewer compressor stages"
            ],
            answer: "It has smaller diameter components and extracts energy from the highest-pressure gas flow"
        },
        {
            question: "What is the key function of the low-pressure turbine?",
            options: [
                "To extract residual energy from exhaust gases to drive the fan and low-pressure compressor",
                "To ignite the highly pressurized fuel-air mixture",
                "To provide an aerodynamic seal for the outer cowling",
                "To deliberately slow down the incoming air for combustion"
            ],
            answer: "To extract residual energy from exhaust gases to drive the fan and low-pressure compressor"
        }
    ];

    return engineGroup;
}
