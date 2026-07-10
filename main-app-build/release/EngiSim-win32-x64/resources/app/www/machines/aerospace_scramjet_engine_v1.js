import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const hotGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const plasmaGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2
    });

    const highTechAlloy = new THREE.MeshPhysicalMaterial({
        color: 0x8899a6,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3
    });

    const thermalTiles = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.9,
        bumpScale: 0.05
    });

    // Helper for adding parts
    const addPart = (mesh, name, description, material, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, expPos) => {
        mesh.name = name;
        mesh.userData = { name, materialName: material.name || 'Custom' };
        group.add(mesh);
        
        parts.push({
            name,
            description,
            material: material.name || 'Custom',
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: expPos
        });
        return mesh;
    };

    // 1. Inlet Cowling / Forebody (Compression Ramp)
    const inletGeo = new THREE.CylinderGeometry(1, 2, 6, 32, 1, false, 0, Math.PI);
    const inlet = new THREE.Mesh(inletGeo, thermalTiles);
    inlet.rotation.x = Math.PI / 2;
    inlet.position.set(0, 0, -5);
    addPart(
        inlet,
        "Compression Ramp / Inlet",
        "Aerodynamic surface that pre-compresses supersonic airflow using shockwaves.",
        thermalTiles,
        "Slows and compresses incoming air using vehicle speed, without rotating compressor blades.",
        1,
        ["Isolator"],
        "Unstarts the engine, causing violent drag and loss of thrust.",
        ["Combustor Blowout", "Structural Failure"],
        { x: 0, y: 3, z: -5 }
    );

    // 2. Isolator
    const isolatorGeo = new THREE.BoxGeometry(4, 1.5, 4);
    const isolator = new THREE.Mesh(isolatorGeo, highTechAlloy);
    isolator.position.set(0, -0.5, -1);
    addPart(
        isolator,
        "Isolator Section",
        "Constant-area duct between the inlet and combustor.",
        highTechAlloy,
        "Prevents pressure disturbances from the combustor from propagating upstream to the inlet.",
        2,
        ["Compression Ramp", "Combustor"],
        "Engine unstart or boundary layer separation.",
        ["Inlet Choke", "Flameout"],
        { x: -4, y: 0, z: -1 }
    );

    // 3. Supersonic Combustor
    const combustorGeo = new THREE.BoxGeometry(4, 1.8, 5);
    const combustor = new THREE.Mesh(combustorGeo, darkSteel);
    combustor.position.set(0, -0.5, 3.5);
    addPart(
        combustor,
        "Supersonic Combustor",
        "Chamber where fuel is injected and burned in supersonic airflow.",
        darkSteel,
        "Mixes hydrogen/hydrocarbon fuel with supersonic air, achieving ignition in milliseconds.",
        3,
        ["Isolator", "Fuel Injectors", "Expansion Nozzle"],
        "Flameout, zero thrust production.",
        ["Thermal Runaway", "Mission Failure"],
        { x: 4, y: 0, z: 3.5 }
    );

    // 4. Fuel Injectors (Struts)
    const injectorGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const injector1 = new THREE.Mesh(injectorGeo, chrome);
    injector1.position.set(-1, 0.2, 2.5);
    injector1.rotation.x = Math.PI / 2;
    
    const injector2 = new THREE.Mesh(injectorGeo, chrome);
    injector2.position.set(1, 0.2, 2.5);
    injector2.rotation.x = Math.PI / 2;
    
    group.add(injector1, injector2);
    parts.push({
        name: "Fuel Injector Struts",
        description: "High-pressure fuel delivery struts inside the combustor.",
        material: "Chrome",
        function: "Injects and mixes fuel directly into the supersonic air stream.",
        assemblyOrder: 4,
        connections: ["Supersonic Combustor", "Fuel Lines"],
        failureEffect: "Lean/Rich blowout, flameout.",
        cascadeFailures: ["Combustor Flameout"],
        originalPosition: { x: 0, y: 0.2, z: 2.5 },
        explodedPosition: { x: 0, y: -3, z: 2.5 }
    });

    // 5. Active Cooling Jacket
    const jacketGeo = new THREE.BoxGeometry(4.2, 2.0, 5.2);
    const jacket = new THREE.Mesh(jacketGeo, new THREE.MeshPhysicalMaterial({ color: 0x555555, wireframe: true }));
    jacket.position.set(0, -0.5, 3.5);
    addPart(
        jacket,
        "Regenerative Cooling Jacket",
        "Network of tubes circulating cryogenic fuel around the combustor before injection.",
        steel,
        "Absorbs extreme heat from the combustor walls while pre-heating fuel for better combustion.",
        5,
        ["Supersonic Combustor", "Fuel Injectors"],
        "Wall meltdown within seconds due to extreme thermal loads.",
        ["Catastrophic Engine Disintegration"],
        { x: 0, y: 3, z: 3.5 }
    );

    // 6. Expansion Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(2, 3.5, 6, 32, 1, false, 0, Math.PI);
    const nozzle = new THREE.Mesh(nozzleGeo, hotGlow);
    nozzle.rotation.x = -Math.PI / 2;
    nozzle.position.set(0, -1, 9);
    addPart(
        nozzle,
        "Expansion Nozzle",
        "Divergent section at the rear of the engine.",
        hotGlow,
        "Accelerates high-temperature, high-pressure exhaust gases to produce forward thrust.",
        6,
        ["Supersonic Combustor"],
        "Loss of thrust efficiency, vehicle drag.",
        ["Overheating of aft section"],
        { x: 0, y: -4, z: 9 }
    );

    // 7. Exhaust Plume (Visual)
    const plumeGeo = new THREE.ConeGeometry(3, 8, 32);
    const plume = new THREE.Mesh(plumeGeo, plasmaGlow);
    plume.rotation.x = Math.PI / 2;
    plume.position.set(0, -1, 14);
    plume.name = "ExhaustPlume";
    group.add(plume);

    const description = "The Scramjet (Supersonic Combustion Ramjet) is an airbreathing jet engine where combustion takes place in supersonic airflow. Unlike traditional jet engines, it has no moving parts like compressors or turbines, relying purely on the vehicle's high speed to compress incoming air. It operates efficiently at hypersonic speeds (Mach 5+), using specialized internal geometries and regenerative cooling.";

    const quizQuestions = [
        {
            question: "Why does a scramjet not require a mechanical compressor or turbine?",
            options: [
                "It uses an electric motor to compress air.",
                "It relies on the vehicle's forward supersonic speed and inlet geometry to compress the air.",
                "It doesn't use air at all; it uses liquid oxygen.",
                "It uses an afterburner instead."
            ],
            correct: 1,
            explanation: "Scramjets use 'ram' effect—the incredible speed of the vehicle forces air into the converging inlet, compressing it purely through shockwaves and aerodynamics.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Isolator section?",
            options: [
                "To cool down the incoming air.",
                "To inject fuel into the engine.",
                "To prevent pressure changes in the combustor from moving upstream and unstarting the inlet.",
                "To steer the vehicle."
            ],
            correct: 2,
            explanation: "The Isolator creates a shock train that adjusts the flow pressure, shielding the inlet from combustion pressure spikes that could cause boundary layer separation or an 'unstart'.",
            difficulty: "Hard"
        },
        {
            question: "Why is 'regenerative cooling' critical in a scramjet?",
            options: [
                "The engine operates in the vacuum of space.",
                "Friction from hypersonic air and combustion temperatures would melt the engine walls without it.",
                "It cools the exhaust to reduce infrared signature.",
                "It freezes the fuel before combustion."
            ],
            correct: 1,
            explanation: "At Mach 5+, aerodynamic heating and internal combustion generate extreme heat. Regenerative cooling circulates cryogenic fuel through the engine walls to absorb this heat before the fuel is injected.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Animate the exhaust plume
        const plumeMesh = group.children.find(c => c.name === "ExhaustPlume");
        if (plumeMesh) {
            plumeMesh.scale.z = 1 + Math.sin(time * 20 * speed) * 0.1;
            plumeMesh.scale.x = 1 + Math.sin(time * 15 * speed) * 0.05;
            plumeMesh.scale.y = 1 + Math.sin(time * 15 * speed) * 0.05;
            
            // Flicker effect
            const mat = plumeMesh.material;
            if (mat && mat.emissiveIntensity !== undefined) {
                mat.emissiveIntensity = 4.0 + Math.random() * 2.0;
            }
        }
        
        // Pulse the expansion nozzle glow
        const nozzleMesh = group.children.find(c => c.name === "Expansion Nozzle");
        if (nozzleMesh && nozzleMesh.material) {
            nozzleMesh.material.emissiveIntensity = 1.5 + Math.sin(time * 10 * speed) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createScramjetEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
