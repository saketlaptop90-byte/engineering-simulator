import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const bloodGlowingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0x880000,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        transmission: 0.9,
    });

    const dialysateGlowingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ccff,
        emissive: 0x0055ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        transmission: 0.8,
    });

    const fiberMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
    });

    // 1. Filter Housing (Cylinder)
    const housingGeometry = new THREE.CylinderGeometry(2, 2, 10, 32);
    // Make the housing transparent glass-like
    const housingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.1,
        roughness: 0,
        ior: 1.5,
        thickness: 0.1,
        side: THREE.DoubleSide
    });
    const housing = new THREE.Mesh(housingGeometry, housingMaterial);
    group.add(housing);
    parts.push({
        name: "Polycarbonate Housing",
        description: "The transparent outer casing that contains the hollow fiber membranes and facilitates the flow of dialysate.",
        material: "Glass/Plastic",
        function: "Encloses the filter module and directs the flow of counter-current dialysate fluid around the outside of the hollow fibers.",
        assemblyOrder: 5,
        connections: ["Blood Inlet Port", "Blood Outlet Port", "Dialysate Inlet Port", "Dialysate Outlet Port"],
        failureEffect: "External leakage of dialysate or blood, loss of sterility, system pressure drop.",
        cascadeFailures: ["Blood pump shutdown", "Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: housing
    });

    // 2. Hollow Fiber Bundle
    const fiberBundleGeometry = new THREE.CylinderGeometry(1.8, 1.8, 9.8, 32);
    const fiberBundle = new THREE.Mesh(fiberBundleGeometry, fiberMaterial);
    group.add(fiberBundle);
    parts.push({
        name: "Hollow Fiber Membrane Bundle",
        description: "Thousands of microscopic semi-permeable capillary tubes bundled together.",
        material: "Synthetic Polymer (Polysulfone/Polyethersulfone)",
        function: "Provides a massive surface area for diffusion and ultrafiltration. Blood flows inside the fibers, toxins pass through microscopic pores into the dialysate.",
        assemblyOrder: 4,
        connections: ["Polycarbonate Housing", "Potting Resin Headers"],
        failureEffect: "Membrane rupture leading to blood leak into dialysate (internal leak), or clotting reducing clearance efficiency.",
        cascadeFailures: ["Blood Leak Detector Triggered", "Inadequate Dialysis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 },
        mesh: fiberBundle
    });

    // 3. Blood Inlet Port (Top)
    const portGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const bloodInlet = new THREE.Mesh(portGeometry, plastic);
    bloodInlet.position.set(0, 5.75, 0);
    group.add(bloodInlet);
    parts.push({
        name: "Blood Inlet Header",
        description: "Entry point for unfiltered, toxin-rich blood coming from the patient.",
        material: "Medical Grade Polyurethane",
        function: "Distributes incoming blood evenly across the thousands of hollow fibers to ensure maximum utilization of the membrane surface.",
        assemblyOrder: 1,
        connections: ["Patient Arterial Line", "Hollow Fiber Membrane Bundle"],
        failureEffect: "Uneven blood flow, clotting, or disconnection causing severe blood loss.",
        cascadeFailures: ["Arterial Pressure Alarm", "Filter Clotting"],
        originalPosition: { x: 0, y: 5.75, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: bloodInlet
    });

    // 4. Blood Outlet Port (Bottom)
    const bloodOutlet = new THREE.Mesh(portGeometry, plastic);
    bloodOutlet.position.set(0, -5.75, 0);
    group.add(bloodOutlet);
    parts.push({
        name: "Blood Outlet Header",
        description: "Exit point for the purified blood returning to the patient.",
        material: "Medical Grade Polyurethane",
        function: "Collects the cleansed blood from the ends of the hollow fibers and funnels it back into the venous return line.",
        assemblyOrder: 2,
        connections: ["Hollow Fiber Membrane Bundle", "Patient Venous Line"],
        failureEffect: "Blockage leading to high transmembrane pressure, hemolysis, or disconnection.",
        cascadeFailures: ["Venous Pressure Alarm", "Circuit Rupture"],
        originalPosition: { x: 0, y: -5.75, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: bloodOutlet
    });

    // 5. Dialysate Inlet Port (Side Bottom)
    const sidePortGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const dialysateInlet = new THREE.Mesh(sidePortGeometry, plastic);
    dialysateInlet.rotation.z = Math.PI / 2;
    dialysateInlet.position.set(2.75, -4, 0);
    group.add(dialysateInlet);
    parts.push({
        name: "Dialysate Inlet Port",
        description: "Entry point for fresh dialysate fluid.",
        material: "Medical Grade Polypropylene",
        function: "Introduces clean dialysate fluid into the housing. It flows counter-current (opposite direction) to the blood to maximize the concentration gradient.",
        assemblyOrder: 3,
        connections: ["Dialysate Delivery System", "Polycarbonate Housing"],
        failureEffect: "Inadequate dialysate flow, reducing clearance of toxins.",
        cascadeFailures: ["Low clearance alarm", "Temperature drop"],
        originalPosition: { x: 2.75, y: -4, z: 0 },
        explodedPosition: { x: 10, y: -4, z: 0 },
        mesh: dialysateInlet
    });

    // 6. Dialysate Outlet Port (Side Top)
    const dialysateOutlet = new THREE.Mesh(sidePortGeometry, plastic);
    dialysateOutlet.rotation.z = Math.PI / 2;
    dialysateOutlet.position.set(2.75, 4, 0);
    group.add(dialysateOutlet);
    parts.push({
        name: "Dialysate Outlet Port",
        description: "Exit point for used dialysate fluid.",
        material: "Medical Grade Polypropylene",
        function: "Removes dialysate fluid that has now absorbed uremic toxins and excess water (ultrafiltrate) from the blood.",
        assemblyOrder: 6,
        connections: ["Polycarbonate Housing", "Drain Line"],
        failureEffect: "Backpressure in dialysate compartment, halting ultrafiltration.",
        cascadeFailures: ["TMP Alarm", "Fluid overload in patient"],
        originalPosition: { x: 2.75, y: 4, z: 0 },
        explodedPosition: { x: 10, y: 4, z: 0 },
        mesh: dialysateOutlet
    });

    // Glowing Flow Indicators (Internal)
    const bloodFlowGeometry = new THREE.CylinderGeometry(1.7, 1.7, 9.9, 16);
    const bloodFlow = new THREE.Mesh(bloodFlowGeometry, bloodGlowingMaterial);
    group.add(bloodFlow);

    const dialysateFlowGeometry = new THREE.CylinderGeometry(1.9, 1.9, 9.8, 16);
    const dialysateFlow = new THREE.Mesh(dialysateFlowGeometry, dialysateGlowingMaterial);
    // Render dialysate on the outside of blood flow
    dialysateFlow.material.side = THREE.BackSide; 
    group.add(dialysateFlow);

    // Description
    const description = "The Biotech Dialysis Filter (Artificial Kidney) is a marvel of biomedical engineering. It uses thousands of semi-permeable hollow fibers to filter toxins (like urea and creatinine) and excess water from a patient's blood. It operates on the principles of diffusion (movement of solutes down a concentration gradient) and ultrafiltration (movement of fluid due to a pressure gradient). The counter-current flow design, where blood and dialysate flow in opposite directions, maintains a constant concentration gradient along the entire length of the filter, maximizing clearance efficiency.";

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Why do blood and dialysate flow in opposite directions (counter-current flow) inside the dialyzer?",
            options: [
                "To prevent the hollow fibers from tangling.",
                "To maintain a maximum concentration gradient along the entire length of the filter, optimizing diffusion.",
                "To equalize the pressure between the blood and dialysate compartments.",
                "To make it easier to detect blood leaks."
            ],
            correct: 1,
            explanation: "Counter-current flow ensures that as blood gets cleaner, it is constantly exposed to even cleaner dialysate, maintaining a steep concentration gradient and maximizing the diffusion of toxins.",
            difficulty: "Medium"
        },
        {
            question: "What physical process is primarily responsible for the removal of excess fluid (water) from the patient's blood during dialysis?",
            options: [
                "Active transport",
                "Diffusion",
                "Ultrafiltration (Convection)",
                "Osmosis"
            ],
            correct: 2,
            explanation: "Ultrafiltration removes fluid by applying a hydrostatic pressure gradient (Transmembrane Pressure or TMP) across the semi-permeable membrane, forcing water out of the blood compartment.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the hollow fiber membrane bundle?",
            options: [
                "To pump blood through the circuit.",
                "To heat the dialysate fluid.",
                "To provide a massive surface area for the exchange of solutes and fluid between blood and dialysate.",
                "To measure the patient's blood pressure."
            ],
            correct: 2,
            explanation: "The thousands of microscopic fibers provide roughly 1.5 to 2.5 square meters of surface area packed into a small cylinder, maximizing the efficiency of the filtration process.",
            difficulty: "Easy"
        },
        {
            question: "If the 'Blood Leak Alarm' triggers, what component has most likely failed?",
            options: [
                "The Dialysate Inlet Port",
                "The Hollow Fiber Membrane",
                "The Polycarbonate Housing",
                "The Blood Pump"
            ],
            correct: 1,
            explanation: "A blood leak alarm indicates that the semi-permeable hollow fibers have ruptured, allowing whole red blood cells to cross into the dialysate compartment.",
            difficulty: "Medium"
        }
    ];

    // Animation function
    function animate(time, speed, meshes) {
        // Pulsate the glowing materials to simulate flow
        if (bloodFlow) {
            const pulse = Math.sin(time * speed * 2) * 0.5 + 0.5;
            bloodGlowingMaterial.emissiveIntensity = 1.0 + pulse * 1.5;
            // Simulate downward blood flow by scrolling texture if we had one, 
            // but for color we can animate opacity slightly
            bloodGlowingMaterial.opacity = 0.6 + pulse * 0.3;
        }

        if (dialysateFlow) {
            const counterPulse = Math.cos(time * speed * 2) * 0.5 + 0.5;
            dialysateGlowingMaterial.emissiveIntensity = 0.8 + counterPulse * 1.2;
            dialysateGlowingMaterial.opacity = 0.5 + counterPulse * 0.3;
        }

        // Slight rotation to view all sides slowly
        group.rotation.y = time * speed * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDialysisFilter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
