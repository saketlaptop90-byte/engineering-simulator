import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const fanMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc8c8c8, metalness: 0.9, roughness: 0.2, clearcoat: 0.8 });
    const titaniumMaterial = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.4 });
    const glowingCoreMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const hotExhaustMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 1.5, wireframe: true });
    const neonPlasmaMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ccff, emissiveIntensity: 3, transparent: true, opacity: 0.6, wireframe: true });
    const casingMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.1, clearcoat: 1.0, transparent: true, opacity: 0.25 });
    
    // Helper to create fan blades
    function createFanBlades(numBlades, radius, bladeWidth, material) {
        const fanGroup = new THREE.Group();
        const bladeGeo = new THREE.BoxGeometry(radius, bladeWidth, 0.1);
        for (let i = 0; i < numBlades; i++) {
            const angle = (i / numBlades) * Math.PI * 2;
            const blade = new THREE.Mesh(bladeGeo, material);
            blade.position.x = (radius / 2) * Math.cos(angle);
            blade.position.y = (radius / 2) * Math.sin(angle);
            blade.rotation.z = angle;
            blade.rotation.x = 0.5; // Pitch
            fanGroup.add(blade);
        }
        return fanGroup;
    }

    // 1. Intake Cowl & Bypass Duct (Outer Shell)
    const cowlGeo = new THREE.CylinderGeometry(4.2, 4.0, 10, 64, 1, true);
    const cowl = new THREE.Mesh(cowlGeo, casingMaterial);
    cowl.rotation.z = Math.PI / 2;
    group.add(cowl);
    meshes.cowl = cowl;
    parts.push({
        name: "Intake Cowl & Bypass Duct",
        description: "Aerodynamic outer housing that guides air into the engine and bypasses the core for thrust and noise reduction.",
        material: "Carbon Composite / Aluminum",
        function: "Streamlines airflow and provides structural housing.",
        assemblyOrder: 1,
        connections: ["Bypass Fan", "Stator Vanes"],
        failureEffect: "Increased drag and severe disruption of bypass airflow.",
        cascadeFailures: ["Fan blade stall", "Engine overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 2. Huge Bypass Fan
    const bypassFan = new THREE.Group();
    const noseConeGeo = new THREE.ConeGeometry(0.8, 1.5, 32);
    const noseCone = new THREE.Mesh(noseConeGeo, chrome);
    noseCone.rotation.z = -Math.PI / 2;
    noseCone.position.x = -4.5;
    bypassFan.add(noseCone);
    
    const hugeBlades = createFanBlades(24, 8, 0.4, fanMaterial);
    hugeBlades.rotation.y = Math.PI / 2;
    hugeBlades.position.x = -3.5;
    bypassFan.add(hugeBlades);
    group.add(bypassFan);
    meshes.bypassFan = bypassFan;
    parts.push({
        name: "High-Bypass Fan",
        description: "Massive front fan that draws in huge volumes of air, providing up to 80% of total engine thrust.",
        material: "Titanium / Composite",
        function: "Accelerates bypass air around the core and forces air into the compressor.",
        assemblyOrder: 2,
        connections: ["Low Pressure Shaft", "Intake Cowl"],
        failureEffect: "Massive thrust loss and severe vibration.",
        cascadeFailures: ["Shattering of containment casing", "Engine separation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // 3. Low Pressure Compressor (LPC)
    const lpc = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const comp = createFanBlades(36, 3 - i * 0.2, 0.2, titaniumMaterial);
        comp.rotation.y = Math.PI / 2;
        comp.position.x = -2 + i * 0.5;
        lpc.add(comp);
    }
    group.add(lpc);
    meshes.lpc = lpc;
    parts.push({
        name: "Low Pressure Compressor",
        description: "First stage of core compression, increasing the pressure and temperature of the air before the HPC.",
        material: "Titanium Alloy",
        function: "Pre-compresses core airflow.",
        assemblyOrder: 3,
        connections: ["Bypass Fan", "High Pressure Compressor"],
        failureEffect: "Surge and stall in the core airflow.",
        cascadeFailures: ["Flameout", "Turbine overtemp"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -4, z: -3 }
    });

    // 4. High Pressure Compressor (HPC)
    const hpc = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const comp = createFanBlades(48, 2 - i * 0.15, 0.15, darkSteel);
        comp.rotation.y = Math.PI / 2;
        comp.position.x = 0 + i * 0.4;
        hpc.add(comp);
    }
    group.add(hpc);
    meshes.hpc = hpc;
    parts.push({
        name: "High Pressure Compressor",
        description: "Dense multi-stage compressor that squeezes air to extreme pressures before combustion.",
        material: "Nickel Alloy",
        function: "Maximizes air density for optimal combustion efficiency.",
        assemblyOrder: 4,
        connections: ["Low Pressure Compressor", "Combustion Chamber"],
        failureEffect: "Compressor stall and catastrophic loss of core power.",
        cascadeFailures: ["Combustion blowout", "Shaft shearing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 5. Combustion Chamber
    const combustorGeo = new THREE.TorusGeometry(1.2, 0.6, 16, 64);
    const combustor = new THREE.Mesh(combustorGeo, glowingCoreMat);
    combustor.rotation.y = Math.PI / 2;
    combustor.position.x = 2.5;
    
    const plasmaCore = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), neonPlasmaMat);
    plasmaCore.position.x = 2.5;
    group.add(combustor);
    group.add(plasmaCore);
    meshes.combustor = combustor;
    meshes.plasmaCore = plasmaCore;
    parts.push({
        name: "Annular Combustion Chamber",
        description: "The heart of the engine where highly compressed air is mixed with jet fuel and ignited.",
        material: "Ceramic Matrix Composites",
        function: "Generates high-energy expanding gases to drive the turbines.",
        assemblyOrder: 5,
        connections: ["High Pressure Compressor", "High Pressure Turbine"],
        failureEffect: "Loss of ignition (flameout) or engine fire.",
        cascadeFailures: ["Turbine meltdown", "Total thrust loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 5, z: 3 }
    });

    // 6. High Pressure Turbine (HPT)
    const hpt = createFanBlades(40, 1.8, 0.2, hotExhaustMat);
    hpt.rotation.y = Math.PI / 2;
    hpt.position.x = 3.5;
    group.add(hpt);
    meshes.hpt = hpt;
    parts.push({
        name: "High Pressure Turbine",
        description: "Extracts energy from the intensely hot combustion gases to drive the High Pressure Compressor.",
        material: "Single-Crystal Superalloy",
        function: "Drives the HPC via the outer concentric shaft.",
        assemblyOrder: 6,
        connections: ["Combustion Chamber", "Low Pressure Turbine"],
        failureEffect: "Rotor burst due to thermal fatigue or overspeed.",
        cascadeFailures: ["HPC stoppage", "Catastrophic engine destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: -4, z: -3 }
    });

    // 7. Low Pressure Turbine (LPT)
    const lpt = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const turb = createFanBlades(36, 2.2 + i * 0.2, 0.25, steel);
        turb.rotation.y = Math.PI / 2;
        turb.position.x = 4.2 + i * 0.6;
        lpt.add(turb);
    }
    group.add(lpt);
    meshes.lpt = lpt;
    parts.push({
        name: "Low Pressure Turbine",
        description: "Extracts remaining energy from the exhaust stream to drive the massive Bypass Fan.",
        material: "Nickel-based Superalloy",
        function: "Drives the Bypass Fan and LPC via the inner concentric shaft.",
        assemblyOrder: 7,
        connections: ["High Pressure Turbine", "Exhaust Nozzle"],
        failureEffect: "Inability to drive the main fan.",
        cascadeFailures: ["Loss of bypass thrust", "Core overspeed"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -5, z: 0 }
    });

    // 8. Core Exhaust Nozzle
    const exhaustGeo = new THREE.CylinderGeometry(1.5, 0.8, 2, 32, 1, true);
    const exhaust = new THREE.Mesh(exhaustGeo, hotExhaustMat);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.x = 6;
    group.add(exhaust);
    meshes.exhaust = exhaust;
    parts.push({
        name: "Core Exhaust Nozzle",
        description: "Shapes and accelerates the remaining core exhaust gases.",
        material: "Titanium / Inconel",
        function: "Provides residual core thrust and mixes with bypass air.",
        assemblyOrder: 8,
        connections: ["Low Pressure Turbine"],
        failureEffect: "Thrust vectoring failure or exhaust blockage.",
        cascadeFailures: ["Engine stall", "Reverse flow"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 9, y: 0, z: 0 }
    });

    // 9. Central Concentric Shafts
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const shaft = new THREE.Mesh(shaftGeo, chrome);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = 1;
    group.add(shaft);
    meshes.shaft = shaft;
    parts.push({
        name: "Concentric Drive Shafts",
        description: "Dual-spool shaft system (inner for LP, outer for HP) connecting turbines to compressors.",
        material: "High-Strength Maraging Steel",
        function: "Transmits immense rotational torque from turbines to compressors and fan.",
        assemblyOrder: 9,
        connections: ["All Compressors", "All Turbines"],
        failureEffect: "Sheared shaft resulting in immediate turbine overspeed.",
        cascadeFailures: ["Uncontained engine failure", "Turbine disk burst"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    const description = "The Aerospace Turbofan Bypass System is a marvel of modern engineering, powering large commercial airliners. It utilizes a massive front fan to bypass the majority of air around the engine core, providing high thrust with incredible fuel efficiency and reduced noise. The core itself operates at extreme temperatures and pressures, using a dual-spool design to optimize compressor and turbine speeds.";

    const quizQuestions = [
        {
            question: "In a high-bypass turbofan engine, where does the majority of the thrust come from?",
            options: ["The combustion chamber", "The high pressure turbine", "The bypass fan air", "The core exhaust nozzle"],
            correct: 2,
            explanation: "In modern high-bypass turbofans, up to 80% or more of the total thrust is generated by the massive bypass fan pushing air around the engine core.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the dual-spool concentric shaft system?",
            options: ["To pump jet fuel to the combustor", "To allow the high-pressure and low-pressure sections to spin at different optimal speeds", "To provide structural support to the wings", "To cool the exhaust gases"],
            correct: 1,
            explanation: "A dual-spool design uses an inner shaft to connect the LP turbine to the fan/LPC, and an outer shaft to connect the HP turbine to the HPC, allowing each spool to rotate at its most efficient aerodynamic speed.",
            difficulty: "Hard"
        },
        {
            question: "Which component is subjected to the highest operating temperatures in the engine?",
            options: ["The Bypass Fan", "The High Pressure Turbine", "The Low Pressure Compressor", "The Intake Cowl"],
            correct: 1,
            explanation: "The High Pressure Turbine sits immediately downstream of the combustion chamber and must withstand gases that are often hotter than the melting point of the turbine blade material itself (requiring advanced cooling).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        const baseSpeed = time * speed;
        
        // Low Pressure Spool (Fan, LPC, LPT) spins at base speed
        if (activeMeshes.bypassFan) activeMeshes.bypassFan.rotation.x = baseSpeed * 2;
        if (activeMeshes.lpc) activeMeshes.lpc.rotation.x = baseSpeed * 2;
        if (activeMeshes.lpt) activeMeshes.lpt.rotation.x = baseSpeed * 2;
        
        // High Pressure Spool (HPC, HPT) spins much faster
        if (activeMeshes.hpc) activeMeshes.hpc.rotation.x = baseSpeed * 4.5;
        if (activeMeshes.hpt) activeMeshes.hpt.rotation.x = baseSpeed * 4.5;
        if (activeMeshes.shaft) activeMeshes.shaft.rotation.x = baseSpeed * 4.5;

        // Combustion and plasma effects
        if (activeMeshes.combustor) {
            const pulse = (Math.sin(time * speed * 10) + 1) / 2;
            activeMeshes.combustor.material.emissiveIntensity = 1.5 + pulse * 1.5;
        }
        if (activeMeshes.plasmaCore) {
            activeMeshes.plasmaCore.scale.setScalar(1 + Math.sin(time * speed * 20) * 0.05);
            activeMeshes.plasmaCore.rotation.y = time * speed;
            activeMeshes.plasmaCore.rotation.z = time * speed * 0.5;
        }
        
        // Exhaust flicker
        if (activeMeshes.exhaust) {
            activeMeshes.exhaust.material.emissiveIntensity = 1.0 + Math.random() * 0.8;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTurbofanBypass() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
