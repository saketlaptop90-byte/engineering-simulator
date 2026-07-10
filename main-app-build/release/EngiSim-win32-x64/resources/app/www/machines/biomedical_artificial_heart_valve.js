import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.4
    });

    const pyrolyticCarbon = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const titaniumRingMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.3
    });

    const dacronSewingRingMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.9,
        metalness: 0.1,
        wireframe: true // Simulating mesh
    });

    // 1. Titanium Suture Ring / Orifice Ring
    const ringGeo = new THREE.TorusGeometry(10, 1.5, 32, 64);
    const orificeRing = new THREE.Mesh(ringGeo, titaniumRingMat);
    group.add(orificeRing);
    parts.push({
        name: "Titanium Orifice Ring",
        description: "The main structural housing that holds the leaflets and allows the valve to be seated.",
        material: "Titanium Alloy",
        function: "Provides rigid support and pivot points for the leaflets.",
        assemblyOrder: 1,
        connections: ["Sewing Cuff", "Leaflets"],
        failureEffect: "Structural deformation leading to severe regurgitation.",
        cascadeFailures: ["Leaflet dislodgement", "Paravalvular leak"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 20 }
    });

    // 2. Dacron Sewing Cuff
    const cuffGeo = new THREE.TorusGeometry(12, 1.8, 16, 64);
    const sewingCuff = new THREE.Mesh(cuffGeo, dacronSewingRingMat);
    sewingCuff.position.z = -1;
    group.add(sewingCuff);
    parts.push({
        name: "Dacron Sewing Cuff",
        description: "A woven fabric ring surrounding the orifice ring.",
        material: "Dacron (PET)",
        function: "Allows the surgeon to suture the valve to the heart tissue.",
        assemblyOrder: 2,
        connections: ["Orifice Ring", "Heart Tissue (simulated)"],
        failureEffect: "Suture dehiscence resulting in paravalvular leak.",
        cascadeFailures: ["Hemolysis", "Heart Failure"],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: 0, y: 0, z: -30 }
    });

    // 3. Leaflets (Pyrolytic Carbon Bi-leaflet)
    const leafletGeo = new THREE.CylinderGeometry(9.5, 9.5, 0.5, 32, 1, false, 0, Math.PI);
    
    // Left leaflet
    const leafletLeftGroup = new THREE.Group();
    const leafletLeft = new THREE.Mesh(leafletGeo, pyrolyticCarbon);
    leafletLeft.rotation.x = Math.PI / 2;
    leafletLeft.rotation.z = Math.PI / 2;
    leafletLeft.position.x = -0.5;
    leafletLeftGroup.add(leafletLeft);
    group.add(leafletLeftGroup);
    
    // Right leaflet
    const leafletRightGroup = new THREE.Group();
    const leafletRight = new THREE.Mesh(leafletGeo, pyrolyticCarbon);
    leafletRight.rotation.x = Math.PI / 2;
    leafletRight.rotation.z = -Math.PI / 2;
    leafletRight.position.x = 0.5;
    leafletRightGroup.add(leafletRight);
    group.add(leafletRightGroup);

    parts.push({
        name: "Bi-leaflet Assembly (Pyrolytic Carbon)",
        description: "Two semicircular discs that open and close to regulate blood flow.",
        material: "Pyrolytic Carbon",
        function: "Opens during systole to allow blood flow, closes during diastole to prevent backflow.",
        assemblyOrder: 3,
        connections: ["Orifice Ring Hinges"],
        failureEffect: "Thrombus formation restricting movement.",
        cascadeFailures: ["Stenosis", "Stroke", "Valve thrombosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 4. Hinge Mechanisms (Pivots)
    const pivotGeo = new THREE.SphereGeometry(1, 16, 16);
    const pivot1 = new THREE.Mesh(pivotGeo, chrome);
    pivot1.position.set(0, 9.5, 0);
    const pivot2 = new THREE.Mesh(pivotGeo, chrome);
    pivot2.position.set(0, -9.5, 0);
    group.add(pivot1);
    group.add(pivot2);
    parts.push({
        name: "Pivot Hinges",
        description: "Butterfly hinges that allow the leaflets to swing open to about 85 degrees.",
        material: "Titanium/Pyrolytic Carbon",
        function: "Minimizes wear and allows smooth, responsive opening and closing.",
        assemblyOrder: 4,
        connections: ["Leaflets", "Orifice Ring"],
        failureEffect: "Hinge fracture or wear.",
        cascadeFailures: ["Leaflet escape", "Catastrophic valve failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 }
    });

    // 5. Blood Flow Dynamics (Glowing Fluid Paths)
    const flowGeo = new THREE.CylinderGeometry(8, 8, 40, 16);
    const bloodFlow = new THREE.Mesh(flowGeo, glowingRed);
    bloodFlow.rotation.x = Math.PI / 2;
    group.add(bloodFlow);
    parts.push({
        name: "Simulated Blood Flow Dynamics",
        description: "Visual representation of hemodynamics through the valve.",
        material: "Energy/Light",
        function: "Demonstrates laminar flow when open and washing jets when closed.",
        assemblyOrder: 5,
        connections: [],
        failureEffect: "Turbulence indicating stenosis.",
        cascadeFailures: ["Hemolysis", "Clotting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    const description = "A highly detailed simulation of a Bi-leaflet Mechanical Heart Valve. Features pyrolytic carbon leaflets, a titanium orifice ring, and a Dacron sewing cuff, simulating the rapid hemodynamics and precise mechanical action required for biomedical prostheses.";

    const quizQuestions = [
        {
            question: "Why is pyrolytic carbon heavily used in mechanical heart valve leaflets?",
            options: [
                "It is extremely cheap to manufacture.",
                "It is thromboresistant (resists blood clotting) and exceptionally durable.",
                "It is flexible and expands with blood pressure.",
                "It dissolves over time to be replaced by natural tissue."
            ],
            correct: 1,
            explanation: "Pyrolytic carbon is biocompatible, thromboresistant, and can endure millions of opening/closing cycles without significant wear.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Dacron Sewing Cuff?",
            options: [
                "To generate electrical pulses for the heart.",
                "To filter out impurities in the blood.",
                "To provide a fabric margin that surgeons can suture directly into the heart tissue.",
                "To lubricate the pivot hinges."
            ],
            correct: 2,
            explanation: "The sewing cuff allows the rigid mechanical valve to be securely attached to the soft cardiac tissue using sutures.",
            difficulty: "Easy"
        },
        {
            question: "Mechanical valves typically require patients to be on what lifelong medication?",
            options: [
                "Immunosuppressants",
                "Anticoagulants (Blood thinners)",
                "Beta blockers",
                "Antibiotics"
            ],
            correct: 1,
            explanation: "Because the artificial materials can still trigger some blood clot formation, lifelong anticoagulation therapy is required.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // time is the elapsed time
        // Calculate a heartbeat cycle using sine wave
        const heartRate = 1.2 * speed; // cycles per second roughly
        const cycle = Math.sin(time * heartRate * Math.PI * 2);
        
        // Leaflet opening angle: 0 (closed) to ~85 degrees (open)
        let angle = 0;
        if (cycle > 0) {
            angle = Math.min(cycle * 4, 1) * (85 * Math.PI / 180); // Rapid open
            bloodFlow.material.opacity = 0.6 + Math.sin(time * 10) * 0.2; // Pulsing flow
            bloodFlow.scale.set(1, 1, 1);
            bloodFlow.material = glowingBlue; // Oxygenated/Flowing
        } else {
            angle = Math.max((cycle + 0.2) * 4, 0) * (85 * Math.PI / 180); // Rapid close, allowing a small washing jet
            bloodFlow.material.opacity = 0.2;
            bloodFlow.scale.set(0.9, 0.2, 0.9);
            bloodFlow.material = glowingRed; // Blocked/Pooling
        }
        
        // Left leaflet rotates around y-axis locally
        leafletLeftGroup.rotation.y = angle;
        // Right leaflet rotates oppositely
        leafletRightGroup.rotation.y = -angle;

        // Subtle pulsing of the sewing cuff to simulate heart muscle contraction
        const pulse = 1 + (cycle > 0 ? cycle * 0.05 : 0);
        sewingCuff.scale.set(pulse, pulse, pulse);
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createArtificialHeartValve() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
