import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 0.8, clearcoat: 1.0, clearcoatRoughness: 0.1, wireframe: false });
    const glowingRed = new THREE.MeshPhysicalMaterial({ color: 0xff0000, emissive: 0xaa0000, emissiveIntensity: 0.5, clearcoat: 0.5 });
    const medicalGreen = new THREE.MeshPhysicalMaterial({ color: 0x00ff88, emissive: 0x00aa55, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 });
    const translucentPlastic = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, transmission: 0.9, roughness: 0.2 });

    // Bellows Chamber (Clear outer casing)
    const chamberGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const chamber = new THREE.Mesh(chamberGeo, translucentPlastic);
    chamber.position.set(0, 1.5, 0);
    group.add(chamber);
    parts.push({
        name: "Bellows Chamber",
        description: "Clear, airtight outer casing for the bellows assembly, holding driving gas.",
        material: "Translucent Plastic",
        function: "Contains the driving gas that compresses the bellows.",
        assemblyOrder: 1,
        connections: ["Base Plate", "Top Cap", "Bellows Membrane"],
        failureEffect: "Loss of driving gas pressure, preventing ventilation.",
        cascadeFailures: ["Ventilation Failure", "Patient Hypoxia"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 0 }
    });

    // Bellows Membrane (The actual folding part)
    const bellowsGeo = new THREE.CylinderGeometry(1, 1, 2.8, 32, 14); 
    const bellows = new THREE.Mesh(bellowsGeo, neonBlue);
    bellows.position.set(0, 1.5, 0);
    bellows.name = "BellowsMembrane";
    group.add(bellows);
    parts.push({
        name: "Bellows Membrane",
        description: "Flexible, accordion-like structure that contains the patient gas.",
        material: "Medical Grade Elastomer",
        function: "Separates patient gas from driving gas and pushes gas to patient when compressed.",
        assemblyOrder: 2,
        connections: ["Base Plate"],
        failureEffect: "Mixing of patient and driving gas, failure to deliver tidal volume.",
        cascadeFailures: ["Contamination", "Inadequate Ventilation"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 0 }
    });

    // Top Cap (Indicator)
    const topCapGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.2, 32);
    const topCap = new THREE.Mesh(topCapGeo, chrome);
    topCap.position.set(0, 3.1, 0);
    group.add(topCap);
    parts.push({
        name: "Upper Cap",
        description: "Seals the chamber and provides structural integrity.",
        material: "Chrome/Aluminum",
        function: "Maintains airtight seal of the outer chamber.",
        assemblyOrder: 3,
        connections: ["Bellows Chamber"],
        failureEffect: "Gas leak from chamber.",
        cascadeFailures: ["Low Pressure Alarm"],
        originalPosition: { x: 0, y: 3.1, z: 0 },
        explodedPosition: { x: 0, y: 5.0, z: 0 }
    });

    // Base Plate (Manifold)
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 32);
    const basePlate = new THREE.Mesh(baseGeo, darkSteel);
    basePlate.position.set(0, -0.2, 0);
    group.add(basePlate);
    parts.push({
        name: "Manifold Base",
        description: "Base plate with inlet and outlet valves.",
        material: "Dark Steel",
        function: "Routes patient gas and driving gas in and out of the bellows assembly.",
        assemblyOrder: 0,
        connections: ["Inlet Valve", "Outlet Valve", "Bellows Membrane", "Bellows Chamber"],
        failureEffect: "Total structural or pneumatic failure.",
        cascadeFailures: ["System Shutdown"],
        originalPosition: { x: 0, y: -0.2, z: 0 },
        explodedPosition: { x: 0, y: -1.5, z: 0 }
    });

    // Inlet Valve
    const valveGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const inletValve = new THREE.Mesh(valveGeo, medicalGreen);
    inletValve.position.set(-0.8, -0.4, 0);
    inletValve.rotation.z = Math.PI / 2;
    inletValve.name = "InletValve";
    group.add(inletValve);
    parts.push({
        name: "Inlet Valve",
        description: "One-way valve allowing fresh gas into the bellows.",
        material: "Green Polymer",
        function: "Allows filling of the bellows during the expiratory phase.",
        assemblyOrder: 4,
        connections: ["Manifold Base"],
        failureEffect: "Bellows fails to refill.",
        cascadeFailures: ["Hypoventilation"],
        originalPosition: { x: -0.8, y: -0.4, z: 0 },
        explodedPosition: { x: -2.5, y: -0.4, z: 0 }
    });

    // Outlet Valve
    const outletValveGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const outletValve = new THREE.Mesh(outletValveGeo, glowingRed);
    outletValve.position.set(0.8, -0.4, 0);
    outletValve.rotation.z = Math.PI / 2;
    outletValve.name = "OutletValve";
    group.add(outletValve);
    parts.push({
        name: "Outlet Valve",
        description: "One-way valve routing gas to the patient.",
        material: "Red Polymer",
        function: "Directs gas to the breathing circuit during inspiration.",
        assemblyOrder: 5,
        connections: ["Manifold Base"],
        failureEffect: "Gas escapes out the wrong path, patient receives no volume.",
        cascadeFailures: ["Hypoxia", "High Pressure Alarm"],
        originalPosition: { x: 0.8, y: -0.4, z: 0 },
        explodedPosition: { x: 2.5, y: -0.4, z: 0 }
    });

    const description = "A high-tech mechanical ventilator bellows system. During inspiration, driving gas pressurizes the outer chamber, compressing the bellows membrane and pushing patient gas through the outlet valve. During expiration, the bellows re-expands to fill with fresh gas.";

    const quizQuestions = [
        {
            question: "What is the primary function of the driving gas in a pneumatic bellows system?",
            options: [
                "It is delivered directly to the patient.",
                "It compresses the bellows membrane to push patient gas out.",
                "It cools the internal electronic components.",
                "It provides moisture to the breathing circuit."
            ],
            correct: 1,
            explanation: "In a double-circuit ventilator, driving gas (often oxygen or air) fills the outer chamber to compress the bellows, which in turn pushes the patient gas mixture into the breathing circuit.",
            difficulty: "Medium"
        },
        {
            question: "What happens if there is a hole in the bellows membrane?",
            options: [
                "The ventilator operates normally but uses more power.",
                "Driving gas mixes with patient gas, altering the delivered FiO2 and potentially causing barotrauma.",
                "The outer chamber shatters due to pressure buildup.",
                "The inlet valve permanently seals shut."
            ],
            correct: 1,
            explanation: "A breach in the membrane breaks the separation between the driving gas circuit and the patient gas circuit, leading to mixing of gases and inaccurate volume delivery.",
            difficulty: "Hard"
        },
        {
            question: "Why is the bellows chamber typically made of transparent material?",
            options: [
                "To reduce the weight of the machine.",
                "To allow for visual monitoring of the bellows movement and volume delivery.",
                "Because plastic is cheaper than metal.",
                "To prevent static electricity buildup."
            ],
            correct: 1,
            explanation: "A transparent chamber allows clinicians to visually confirm that the bellows is compressing and expanding correctly with each breath cycle.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed = 1, meshes = {}) {
        // Find meshes if not passed explicitly as a map
        const membrane = meshes.BellowsMembrane || group.getObjectByName("BellowsMembrane");
        const inValve = meshes.InletValve || group.getObjectByName("InletValve");
        const outValve = meshes.OutletValve || group.getObjectByName("OutletValve");

        if (!membrane || !inValve || !outValve) return;

        const cycle = (time * speed * 2) % (Math.PI * 2);
        const breathPhase = (Math.sin(cycle) + 1) / 2; // 0 to 1
        
        // Bellows compression
        const scale = 1.0 - (breathPhase * 0.7); // compress to 30% height
        membrane.scale.y = scale;
        membrane.position.y = 0.1 + (2.8 * scale) / 2;

        // Valve pulsing
        if (breathPhase > 0.5) { // Inspiration
            outValve.material.emissiveIntensity = 1.0;
            inValve.material.emissiveIntensity = 0.2;
        } else { // Expiration
            outValve.material.emissiveIntensity = 0.2;
            inValve.material.emissiveIntensity = 1.0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVentilatorBellows() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
