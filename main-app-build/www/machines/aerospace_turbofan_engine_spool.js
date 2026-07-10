import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.2
    });

    const meshes = {};

    // 1. N1 Shaft (Low Pressure Shaft) - Inner Shaft
    const n1ShaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 12, 32);
    n1ShaftGeo.rotateZ(Math.PI / 2);
    const n1ShaftMesh = new THREE.Mesh(n1ShaftGeo, steel);
    group.add(n1ShaftMesh);
    meshes.n1Shaft = n1ShaftMesh;
    
    parts.push({
        name: "N1 Low-Pressure Shaft",
        description: "The inner shaft connecting the fan and low-pressure compressor to the low-pressure turbine.",
        material: "Steel",
        function: "Transmits torque from the LPT to the Fan and LPC.",
        assemblyOrder: 1,
        connections: ["Fan", "LPC", "LPT"],
        failureEffect: "Loss of primary thrust from the fan; potential engine core structural failure.",
        cascadeFailures: ["Fan stoppage", "LPC stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. N2 Shaft (High Pressure Shaft) - Outer Shaft
    const n2ShaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    n2ShaftGeo.rotateZ(Math.PI / 2);
    const n2ShaftMesh = new THREE.Mesh(n2ShaftGeo, darkSteel);
    n2ShaftMesh.position.x = -1; // Center N2 around compressor/turbine section
    group.add(n2ShaftMesh);
    meshes.n2Shaft = n2ShaftMesh;
    
    parts.push({
        name: "N2 High-Pressure Shaft",
        description: "The hollow outer shaft concentric to N1, connecting the high-pressure compressor to the high-pressure turbine.",
        material: "Dark Steel / Titanium Alloy",
        function: "Transmits torque from HPT to HPC.",
        assemblyOrder: 2,
        connections: ["HPC", "HPT"],
        failureEffect: "Immediate core engine shutdown; loss of compression.",
        cascadeFailures: ["Combustion failure", "HPT overheat"],
        originalPosition: { x: -1, y: 0, z: 0 },
        explodedPosition: { x: -1, y: 2, z: 0 }
    });

    // 3. Fan (Driven by N1)
    const fanGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    fanGeo.rotateZ(Math.PI / 2);
    const fanMesh = new THREE.Mesh(fanGeo, chrome);
    fanMesh.position.x = -5.5;
    n1ShaftMesh.add(fanMesh); // Rotate with N1
    
    // Add fan blades
    for(let i=0; i<24; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 2.5, 0.1);
        bladeGeo.translate(0, 1.5, 0);
        const blade = new THREE.Mesh(bladeGeo, chrome);
        blade.rotation.x = (i / 24) * Math.PI * 2;
        blade.rotation.z = Math.PI/12; // Pitch
        fanMesh.add(blade);
    }
    
    parts.push({
        name: "Main Fan",
        description: "Large diameter fan at the front of the engine providing the majority of thrust.",
        material: "Titanium / Chrome",
        function: "Draws in air, forcing it around the engine core (bypass) for thrust.",
        assemblyOrder: 3,
        connections: ["N1 Shaft"],
        failureEffect: "Massive thrust loss, heavy vibrations.",
        cascadeFailures: ["N1 Shaft imbalance"],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 }
    });

    // 4. Low-Pressure Compressor (LPC) - Driven by N1
    const lpcGeo = new THREE.ConeGeometry(1.5, 2, 32);
    lpcGeo.rotateZ(-Math.PI / 2);
    const lpcMesh = new THREE.Mesh(lpcGeo, aluminum);
    lpcMesh.position.x = -3;
    n1ShaftMesh.add(lpcMesh);
    
    parts.push({
        name: "Low-Pressure Compressor (LPC)",
        description: "First stage of compression after the fan.",
        material: "Aluminum",
        function: "Compresses core air before it enters the HPC.",
        assemblyOrder: 4,
        connections: ["N1 Shaft"],
        failureEffect: "Reduced core airflow.",
        cascadeFailures: ["Engine surge/stall"],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 3, z: 0 }
    });

    // 5. High-Pressure Compressor (HPC) - Driven by N2
    const hpcGeo = new THREE.ConeGeometry(1.2, 2.5, 32, 1, false, 0, Math.PI * 2);
    hpcGeo.rotateZ(-Math.PI / 2);
    const hpcMesh = new THREE.Mesh(hpcGeo, steel);
    hpcMesh.position.x = -1; // Relative to N2
    n2ShaftMesh.add(hpcMesh);
    
    parts.push({
        name: "High-Pressure Compressor (HPC)",
        description: "Final stages of compression before combustion.",
        material: "Steel",
        function: "Highly compresses air to extreme pressures for combustion.",
        assemblyOrder: 5,
        connections: ["N2 Shaft"],
        failureEffect: "Compressor stall, flameout.",
        cascadeFailures: ["Total power loss"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 4, z: 0 }
    });

    // 6. Combustion Chamber (Static)
    const combustorGeo = new THREE.TorusGeometry(1.4, 0.4, 16, 64);
    combustorGeo.rotateY(Math.PI / 2);
    const combustorMesh = new THREE.Mesh(combustorGeo, glowOrange);
    combustorMesh.position.x = 1;
    group.add(combustorMesh);
    meshes.combustor = combustorMesh;
    
    parts.push({
        name: "Combustion Chamber",
        description: "Annular chamber where fuel mixes with compressed air and ignites.",
        material: "Glowing Orange / Ceramic",
        function: "Ignites mixture to drastically expand gas.",
        assemblyOrder: 6,
        connections: ["HPC", "HPT"],
        failureEffect: "Flameout or engine fire.",
        cascadeFailures: ["Turbine blade melting if uncontrolled"],
        originalPosition: { x: 1, y: 0, z: 0 },
        explodedPosition: { x: 1, y: -4, z: 0 }
    });

    // 7. High-Pressure Turbine (HPT) - Drives N2
    const hptGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.5, 32);
    hptGeo.rotateZ(Math.PI / 2);
    const hptMesh = new THREE.Mesh(hptGeo, glowRed);
    hptMesh.position.x = 2; // Relative to N2
    n2ShaftMesh.add(hptMesh);
    
    parts.push({
        name: "High-Pressure Turbine (HPT)",
        description: "First turbine stage, exposed to extreme temperatures.",
        material: "Glowing Red / Superalloys",
        function: "Extracts energy from expanding gas to drive the HPC via the N2 shaft.",
        assemblyOrder: 7,
        connections: ["N2 Shaft"],
        failureEffect: "Instant loss of N2 drive.",
        cascadeFailures: ["Catastrophic core destruction"],
        originalPosition: { x: 1, y: 0, z: 0 },
        explodedPosition: { x: 1, y: 5, z: 0 }
    });

    // 8. Low-Pressure Turbine (LPT) - Drives N1
    const lptGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 32);
    lptGeo.rotateZ(Math.PI / 2);
    const lptMesh = new THREE.Mesh(lptGeo, glowBlue);
    lptMesh.position.x = 4.5;
    n1ShaftMesh.add(lptMesh);
    
    parts.push({
        name: "Low-Pressure Turbine (LPT)",
        description: "Final turbine stages extracting remaining energy.",
        material: "Glowing Blue / Superalloys",
        function: "Extracts energy to drive the Fan and LPC via the N1 shaft.",
        assemblyOrder: 8,
        connections: ["N1 Shaft"],
        failureEffect: "Loss of fan drive.",
        cascadeFailures: ["Loss of thrust"],
        originalPosition: { x: 4.5, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });


    const description = "Aerospace Turbofan Engine Twin-Spool System (N1 & N2 Shafts). Demonstrates the concentric shaft architecture of modern high-bypass turbofan engines. The N1 shaft (low pressure) spins the fan and LPC driven by the LPT, while the N2 shaft (high pressure, hollow, enclosing N1) spins the HPC driven by the HPT at a much higher RPM.";

    const quizQuestions = [
        {
            question: "Why does a twin-spool engine use two concentric shafts (N1 and N2)?",
            options: [
                "To reduce the overall weight of the engine.",
                "To allow the high-pressure and low-pressure components to rotate at their own optimal speeds.",
                "To act as a backup in case one shaft breaks.",
                "To mix fuel and air more efficiently."
            ],
            correct: 1,
            explanation: "High-pressure compressors and turbines are smaller and need to spin much faster than the larger low-pressure components and fan. Separating them onto two independently rotating shafts optimizes aerodynamic efficiency for both.",
            difficulty: "Medium"
        },
        {
            question: "Which component is directly driven by the High-Pressure Turbine (HPT)?",
            options: [
                "The Fan",
                "The Low-Pressure Compressor (LPC)",
                "The High-Pressure Compressor (HPC)",
                "The Low-Pressure Turbine (LPT)"
            ],
            correct: 2,
            explanation: "The HPT extracts energy from the hottest, highest-pressure gas right after the combustor and uses it to drive the HPC via the N2 shaft.",
            difficulty: "Easy"
        },
        {
            question: "What physical configuration characterizes the N1 and N2 shafts?",
            options: [
                "They are placed side-by-side (parallel).",
                "They are arranged linearly, one after the other.",
                "The N1 shaft is hollow, and the N2 shaft runs inside it.",
                "The N2 shaft is hollow, and the N1 shaft runs inside it (concentric)."
            ],
            correct: 3,
            explanation: "The N2 (high-pressure) shaft is shorter and hollow, allowing the longer N1 (low-pressure) shaft to pass completely through its center, connecting the front fan to the rear LPT.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // N1 (Low Pressure Spool) rotates slower
        meshesObj.n1Shaft.rotation.x = time * speed * 2.0; 
        
        // N2 (High Pressure Spool) rotates faster and often in the same or counter direction depending on design.
        // Counter-rotating spools reduce gyroscopic forces. Let's make it counter-rotate!
        meshesObj.n2Shaft.rotation.x = -time * speed * 5.0;
        
        // Pulsating combustor glow
        const pulse = (Math.sin(time * 10) + 1) / 2;
        meshesObj.combustor.material.emissiveIntensity = 0.5 + pulse * 0.5;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createTurbofanEngineSpool() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
