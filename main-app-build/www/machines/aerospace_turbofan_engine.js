import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom materials for sci-fi/ultra futuristic vibe
    const plasmaGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const combustionGlow = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 1.0
    });

    const superChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    // 1. Fan Cowling / Bypass Duct (Outer Shell)
    const cowlGeo = new THREE.CylinderGeometry(4.5, 4.0, 12, 64, 1, true);
    const cowlMesh = new THREE.Mesh(cowlGeo, tinted);
    cowlMesh.rotation.z = Math.PI / 2;
    group.add(cowlMesh);
    
    parts.push({
        name: "Aerodynamic Cowling",
        description: "The outer nacelle that channels bypass air to generate up to 80% of the thrust in a high-bypass turbofan.",
        material: "tinted",
        function: "Provides aerodynamic shielding and contains the bypass airflow.",
        assemblyOrder: 10,
        connections: ["Fan Stage", "Bypass Duct"],
        failureEffect: "Increased drag and loss of bypass thrust efficiency.",
        cascadeFailures: ["Structural vibration", "Fuel efficiency drop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: cowlMesh
    });

    // 2. Intake Fan Blades
    const fanGroup = new THREE.Group();
    const fanHubGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI/2);
    const fanHub = new THREE.Mesh(fanHubGeo, chrome);
    fanHub.rotation.z = -Math.PI / 2;
    fanHub.position.x = -5.5;
    fanGroup.add(fanHub);

    for(let i=0; i<24; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 3.8, 0.8);
        // twist the blade
        const positions = bladeGeo.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            const y = positions.getY(j);
            const x = positions.getX(j);
            const z = positions.getZ(j);
            const angle = y * 0.2; // twist
            const newX = x * Math.cos(angle) - z * Math.sin(angle);
            const newZ = x * Math.sin(angle) + z * Math.cos(angle);
            positions.setX(j, newX);
            positions.setZ(j, newZ);
        }
        bladeGeo.computeVertexNormals();
        
        const blade = new THREE.Mesh(bladeGeo, superChrome);
        const angle = (i / 24) * Math.PI * 2;
        blade.position.set(-5.5, Math.sin(angle) * 2.5, Math.cos(angle) * 2.5);
        blade.rotation.x = angle;
        blade.rotation.y = Math.PI / 12; // pitch
        fanGroup.add(blade);
    }
    group.add(fanGroup);
    
    parts.push({
        name: "Titanium Intake Fan",
        description: "Massive titanium alloy blades that suck in enormous volumes of air, acting essentially as a ducted propeller.",
        material: "chrome / superChrome",
        function: "Accelerates bypass air for primary thrust and feeds core compressor.",
        assemblyOrder: 1,
        connections: ["Low-Pressure Shaft", "Cowling"],
        failureEffect: "Catastrophic loss of thrust and severe engine imbalance.",
        cascadeFailures: ["Blade containment failure", "Compressor stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 },
        mesh: fanGroup
    });

    // 3. Low Pressure Compressor (LPC)
    const lpcGroup = new THREE.Group();
    for(let stage=0; stage<4; stage++) {
        const rad = 2.0 - stage*0.1;
        const lpcDisk = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.4, 32), aluminum);
        lpcDisk.rotation.z = Math.PI/2;
        lpcDisk.position.x = -3.5 + stage * 0.8;
        lpcGroup.add(lpcDisk);
        
        for(let i=0; i<36; i++) {
            const bGeo = new THREE.BoxGeometry(0.1, rad*0.8, 0.3);
            const b = new THREE.Mesh(bGeo, steel);
            const angle = (i / 36) * Math.PI * 2;
            b.position.set(-3.5 + stage * 0.8, Math.sin(angle) * rad, Math.cos(angle) * rad);
            b.rotation.x = angle;
            b.rotation.y = Math.PI / 6;
            lpcGroup.add(b);
        }
    }
    group.add(lpcGroup);
    
    parts.push({
        name: "Low-Pressure Compressor",
        description: "Multiple stages of rotating blades that begin compressing the core airflow before it reaches the high-pressure section.",
        material: "aluminum / steel",
        function: "Increases air pressure and temperature prior to the HPC.",
        assemblyOrder: 2,
        connections: ["Intake Fan", "High-Pressure Compressor"],
        failureEffect: "Core airflow disruption and potential engine surge.",
        cascadeFailures: ["Combustion blowout", "Overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 4, z: 4 },
        mesh: lpcGroup
    });

    // 4. High Pressure Compressor (HPC)
    const hpcGroup = new THREE.Group();
    for(let stage=0; stage<8; stage++) {
        const rad = 1.5 - stage*0.08;
        const hpcDisk = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.3, 32), darkSteel);
        hpcDisk.rotation.z = Math.PI/2;
        hpcDisk.position.x = 0 + stage * 0.4;
        hpcGroup.add(hpcDisk);
        
        for(let i=0; i<48; i++) {
            const bGeo = new THREE.BoxGeometry(0.05, rad*0.6, 0.2);
            const b = new THREE.Mesh(bGeo, copper);
            const angle = (i / 48) * Math.PI * 2;
            b.position.set(0 + stage * 0.4, Math.sin(angle) * rad, Math.cos(angle) * rad);
            b.rotation.x = angle;
            b.rotation.y = Math.PI / 8;
            hpcGroup.add(b);
        }
    }
    group.add(hpcGroup);
    
    parts.push({
        name: "High-Pressure Compressor",
        description: "A densely packed series of axial compressor stages that squeeze the air to over 40 times atmospheric pressure.",
        material: "darkSteel / copper",
        function: "Maximizes air density and temperature for optimal combustion efficiency.",
        assemblyOrder: 3,
        connections: ["Low-Pressure Compressor", "Combustion Chamber"],
        failureEffect: "Compressor stall, severe loss of power.",
        cascadeFailures: ["Turbine over-temp", "Shaft sheer"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: hpcGroup
    });

    // 5. Annular Combustion Chamber (Glowing)
    const combustionGroup = new THREE.Group();
    const combustorGeo = new THREE.TorusGeometry(1.2, 0.4, 32, 64);
    const combustorOuter = new THREE.Mesh(combustorGeo, darkSteel);
    combustorOuter.rotation.y = Math.PI/2;
    combustorOuter.position.x = 3.5;
    combustionGroup.add(combustorOuter);
    
    // Plasma core inside combustor
    const plasmaCoreGeo = new THREE.TorusGeometry(1.2, 0.35, 32, 64);
    const plasmaCore = new THREE.Mesh(plasmaCoreGeo, combustionGlow);
    plasmaCore.rotation.y = Math.PI/2;
    plasmaCore.position.x = 3.5;
    combustionGroup.add(plasmaCore);

    // Fuel Injectors
    for(let i=0; i<16; i++) {
        const injGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.6, 16);
        const injector = new THREE.Mesh(injGeo, superChrome);
        const angle = (i / 16) * Math.PI * 2;
        injector.position.set(3.2, Math.sin(angle) * 1.2, Math.cos(angle) * 1.2);
        injector.rotation.x = angle;
        injector.rotation.z = -Math.PI / 4;
        combustionGroup.add(injector);
    }
    group.add(combustionGroup);

    parts.push({
        name: "Annular Combustion Chamber",
        description: "The heart of the engine where atomized fuel is mixed with highly compressed air and ignited, creating superheated exhaust gases.",
        material: "darkSteel / superheated plasma",
        function: "Adds immense thermal energy to the airflow to drive the turbines.",
        assemblyOrder: 4,
        connections: ["HPC", "HPT"],
        failureEffect: "Flameout, uncontained engine fire.",
        cascadeFailures: ["Meltdown of turbine blades", "Thrust loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3.5, y: -4, z: -4 },
        mesh: combustionGroup
    });

    // 6. High Pressure Turbine (HPT)
    const hptGroup = new THREE.Group();
    for(let stage=0; stage<2; stage++) {
        const rad = 1.2 + stage*0.1;
        const hptDisk = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.3, 32), superChrome);
        hptDisk.rotation.z = Math.PI/2;
        hptDisk.position.x = 4.5 + stage * 0.6;
        hptGroup.add(hptDisk);
        
        for(let i=0; i<50; i++) {
            const bGeo = new THREE.BoxGeometry(0.1, rad*0.5, 0.2);
            const b = new THREE.Mesh(bGeo, plasmaGlow); // Glowing hot blades
            const angle = (i / 50) * Math.PI * 2;
            b.position.set(4.5 + stage * 0.6, Math.sin(angle) * rad, Math.cos(angle) * rad);
            b.rotation.x = angle;
            b.rotation.y = -Math.PI / 6; // opposite angle to extract energy
            hptGroup.add(b);
        }
    }
    group.add(hptGroup);

    parts.push({
        name: "High-Pressure Turbine",
        description: "Extracts kinetic energy from the superheated combustion gases to drive the High-Pressure Compressor via a concentric shaft.",
        material: "superChrome / plasmaGlow",
        function: "Powers the high-pressure compressor stage.",
        assemblyOrder: 5,
        connections: ["Combustion Chamber", "High-Pressure Shaft"],
        failureEffect: "Immediate engine shutdown due to compressor power loss.",
        cascadeFailures: ["Turbine disintegration", "Over-pressurization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 4, z: 0 },
        mesh: hptGroup
    });

    // 7. Low Pressure Turbine (LPT)
    const lptGroup = new THREE.Group();
    for(let stage=0; stage<5; stage++) {
        const rad = 1.5 + stage*0.15;
        const lptDisk = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.3, 32), steel);
        lptDisk.rotation.z = Math.PI/2;
        lptDisk.position.x = 6.0 + stage * 0.5;
        lptGroup.add(lptDisk);
        
        for(let i=0; i<40; i++) {
            const bGeo = new THREE.BoxGeometry(0.1, rad*0.6, 0.25);
            const b = new THREE.Mesh(bGeo, darkSteel);
            const angle = (i / 40) * Math.PI * 2;
            b.position.set(6.0 + stage * 0.5, Math.sin(angle) * rad, Math.cos(angle) * rad);
            b.rotation.x = angle;
            b.rotation.y = -Math.PI / 4;
            lptGroup.add(b);
        }
    }
    group.add(lptGroup);

    parts.push({
        name: "Low-Pressure Turbine",
        description: "Extracts the remaining extractable energy from the exhaust stream to power the massive front intake fan.",
        material: "steel / darkSteel",
        function: "Drives the intake fan and low-pressure compressor via the inner shaft.",
        assemblyOrder: 6,
        connections: ["HPT", "Exhaust Mixer"],
        failureEffect: "Loss of bypass thrust, dramatic reduction in engine efficiency.",
        cascadeFailures: ["Fan deceleration", "Stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: -3, z: 4 },
        mesh: lptGroup
    });

    // 8. Concentric Shafts
    const shaftGroup = new THREE.Group();
    // Inner Shaft (LPT to Fan)
    const innerShaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 14, 16);
    const innerShaft = new THREE.Mesh(innerShaftGeo, neonBlue);
    innerShaft.rotation.z = Math.PI/2;
    innerShaft.position.x = 1.5;
    shaftGroup.add(innerShaft);
    
    // Outer Shaft (HPT to HPC)
    const outerShaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const outerShaft = new THREE.Mesh(outerShaftGeo, steel);
    outerShaft.rotation.z = Math.PI/2;
    outerShaft.position.x = 2;
    shaftGroup.add(outerShaft);
    group.add(shaftGroup);

    parts.push({
        name: "Concentric Drive Shafts",
        description: "A nested dual-shaft system. The inner shaft connects the LPT to the fan, while the outer shaft connects the HPT to the HPC.",
        material: "neonBlue / steel",
        function: "Transmits mechanical torque from the turbines back to the compressors and fan.",
        assemblyOrder: 7,
        connections: ["Turbines", "Compressors", "Fan"],
        failureEffect: "Total uncoupling of power, catastrophic engine failure.",
        cascadeFailures: ["Rotor overspeed", "Engine structural tear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 0, z: -6 },
        mesh: shaftGroup
    });

    // 9. Exhaust Nozzle & Mixer
    const exhaustGroup = new THREE.Group();
    const exhaustGeo = new THREE.CylinderGeometry(2.1, 1.2, 3, 32, 1, true);
    const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
    exhaust.rotation.z = Math.PI/2;
    exhaust.position.x = 9.5;
    exhaustGroup.add(exhaust);
    
    const coneGeo = new THREE.ConeGeometry(1.0, 2.5, 32);
    const cone = new THREE.Mesh(coneGeo, chrome);
    cone.rotation.z = -Math.PI/2;
    cone.position.x = 9.0;
    exhaustGroup.add(cone);
    
    group.add(exhaustGroup);

    parts.push({
        name: "Exhaust Mixer & Nozzle",
        description: "The rear section where hot core exhaust and cool bypass air mix and accelerate out the back to generate thrust.",
        material: "darkSteel / chrome",
        function: "Directs exhaust gases and optimizes final thrust velocity while reducing noise.",
        assemblyOrder: 8,
        connections: ["LPT", "Bypass Duct"],
        failureEffect: "Thrust vector distortion, reduced efficiency.",
        cascadeFailures: ["Turbulence", "Excessive noise"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 },
        mesh: exhaustGroup
    });

    // Magnetic Fields / Plasma Effects (Aesthetic)
    const magFieldGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 64);
    const magField1 = new THREE.Mesh(magFieldGeo, plasmaGlow);
    magField1.rotation.y = Math.PI/2;
    magField1.position.x = -2;
    group.add(magField1);

    const magField2 = new THREE.Mesh(magFieldGeo, plasmaGlow);
    magField2.rotation.y = Math.PI/2;
    magField2.position.x = 2;
    group.add(magField2);

    parts.push({
        name: "Plasma Containment Rings",
        description: "Futuristic magnetic containment fields that stabilize supersonic airflow and superheated plasma within the core.",
        material: "plasmaGlow",
        function: "Prevents thermal degradation of physical casings by suspending the hottest gases.",
        assemblyOrder: 9,
        connections: ["Engine Casing"],
        failureEffect: "Casing meltdown.",
        cascadeFailures: ["Explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: magField1
    });

    const description = "Next-Generation Aerospace Turbofan Engine. Featuring dual-spool concentric shafts, a massive high-bypass titanium intake fan, and a magnetically-contained plasma combustion core. This ultra-high-tech engine powers intercontinental commercial and transport vessels, achieving unmatched fuel efficiency and supersonic thrust capabilities.";

    const quizQuestions = [
        {
            question: "In a high-bypass turbofan, what component generates the majority of the engine's thrust?",
            options: [
                "The Annular Combustion Chamber",
                "The High-Pressure Turbine",
                "The Intake Fan (Bypass Air)",
                "The Exhaust Nozzle"
            ],
            correct: 2,
            explanation: "In modern high-bypass turbofans, the large fan at the front pushes massive amounts of air around the core (bypass air), generating up to 80% of the total thrust.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Low-Pressure Turbine (LPT)?",
            options: [
                "To mix fuel and air for ignition",
                "To extract energy from the exhaust to drive the intake fan",
                "To compress air before it enters the combustion chamber",
                "To magnetically contain the plasma core"
            ],
            correct: 1,
            explanation: "The LPT is located at the rear and extracts kinetic energy from the escaping exhaust gases to spin the inner shaft, which is directly connected to the massive front intake fan.",
            difficulty: "Hard"
        },
        {
            question: "Why are turbofan engines designed with concentric (nested) drive shafts?",
            options: [
                "To allow different sections to spin at their own optimal speeds",
                "To save weight by using less metal",
                "To prevent the engine from vibrating during turbulence",
                "To look incredibly futuristic"
            ],
            correct: 0,
            explanation: "Concentric shafts allow the High-Pressure (core) spools to spin much faster than the Low-Pressure (fan) spools, optimizing the aerodynamic efficiency of both sections simultaneously.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // N1 spool (Low pressure: Fan, LPC, LPT, Inner Shaft) - Spins at speed
        const n1Speed = time * speed * 2.0;
        fanGroup.rotation.x = n1Speed;
        lpcGroup.rotation.x = n1Speed;
        lptGroup.rotation.x = n1Speed;
        innerShaft.rotation.x = n1Speed;

        // N2 spool (High pressure: HPC, HPT, Outer Shaft) - Spins much faster
        const n2Speed = time * speed * 5.0;
        hpcGroup.rotation.x = n2Speed;
        hptGroup.rotation.x = n2Speed;
        outerShaft.rotation.x = n2Speed;

        // Plasma and Combustion effects
        plasmaCore.material.emissiveIntensity = 4 + Math.sin(time * 10 * speed) * 2;
        magField1.scale.setScalar(1 + Math.sin(time * 5 * speed) * 0.05);
        magField2.scale.setScalar(1 + Math.cos(time * 5 * speed) * 0.05);
        magField1.rotation.x = time * speed * 0.5;
        magField2.rotation.x = -time * speed * 0.5;
        
        // Casing subtle vibration
        cowlMesh.position.y = Math.sin(time * 20 * speed) * 0.01;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTurbofanJetEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
