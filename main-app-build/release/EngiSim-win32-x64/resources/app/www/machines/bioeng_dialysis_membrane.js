import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing/Neon Materials
    const bloodRedNeon = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0x880000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const dialysateBlueNeon = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0044aa,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const hollowFiberMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.3,
        transmission: 0.9,
        thickness: 0.2,
        emissive: 0x222222,
        emissiveIntensity: 0.8
    });
    
    const housingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e0e0,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        transmission: 1.0,
        ior: 1.5,
        clearcoat: 1.0
    });

    // Outer Housing (Cylinder)
    const housingGeom = new THREE.CylinderGeometry(2, 2, 10, 32);
    const housingMesh = new THREE.Mesh(housingGeom, housingMaterial);
    group.add(housingMesh);
    parts.push({
        name: "Polycarbonate Housing",
        description: "Clear protective casing enclosing the hollow fibers, maintaining structural integrity and sterility.",
        material: "Polycarbonate",
        function: "Encloses and protects internal fibers; routes dialysate fluid.",
        assemblyOrder: 5,
        connections: ["Blood Inlet/Outlet", "Dialysate Ports", "Fiber Bundle"],
        failureEffect: "External fluid leak; risk of system infection.",
        cascadeFailures: ["Complete fluid loss", "Loss of dialysis efficacy"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 },
        mesh: housingMesh
    });

    // Blood Inlet Header
    const inletHeaderGeom = new THREE.CylinderGeometry(2, 1.5, 2, 32);
    const inletHeaderMesh = new THREE.Mesh(inletHeaderGeom, plastic);
    inletHeaderMesh.position.set(0, 6, 0);
    group.add(inletHeaderMesh);
    parts.push({
        name: "Blood Inlet Header",
        description: "Cap that distributes incoming blood evenly across the thousands of hollow fibers.",
        material: "Medical Grade Plastic",
        function: "Distributes unfiltered blood to hollow fibers.",
        assemblyOrder: 1,
        connections: ["Patient Blood Line", "Housing", "Fiber Bundle"],
        failureEffect: "Blood clotting at inlet; uneven distribution.",
        cascadeFailures: ["Fiber clotting", "Pressure alarm"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: inletHeaderMesh
    });

    // Blood Outlet Header
    const outletHeaderGeom = new THREE.CylinderGeometry(1.5, 2, 2, 32);
    const outletHeaderMesh = new THREE.Mesh(outletHeaderGeom, plastic);
    outletHeaderMesh.position.set(0, -6, 0);
    group.add(outletHeaderMesh);
    parts.push({
        name: "Blood Outlet Header",
        description: "Collects the cleansed blood from the fibers before returning it to the patient.",
        material: "Medical Grade Plastic",
        function: "Re-collects filtered blood from hollow fibers.",
        assemblyOrder: 2,
        connections: ["Patient Venous Line", "Housing", "Fiber Bundle"],
        failureEffect: "Flow restriction.",
        cascadeFailures: ["Venous pressure alarm"],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: outletHeaderMesh
    });

    // Dialysate Inlet Port
    const dialysateInletGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const dialysateInletMesh = new THREE.Mesh(dialysateInletGeom, plastic);
    dialysateInletMesh.rotation.z = Math.PI / 2;
    dialysateInletMesh.position.set(2.5, -4, 0);
    group.add(dialysateInletMesh);
    parts.push({
        name: "Dialysate Inlet",
        description: "Port where fresh dialysate enters the casing to flow counter-current to the blood.",
        material: "Medical Plastic",
        function: "Supplies fresh dialysate solution to the extraluminal space.",
        assemblyOrder: 3,
        connections: ["Housing", "Dialysate Delivery System"],
        failureEffect: "No dialysate flow.",
        cascadeFailures: ["Loss of diffusion gradient", "Treatment failure"],
        originalPosition: { x: 2.5, y: -4, z: 0 },
        explodedPosition: { x: 6, y: -4, z: 0 },
        mesh: dialysateInletMesh
    });

    // Dialysate Outlet Port
    const dialysateOutletGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const dialysateOutletMesh = new THREE.Mesh(dialysateOutletGeom, plastic);
    dialysateOutletMesh.rotation.z = Math.PI / 2;
    dialysateOutletMesh.position.set(-2.5, 4, 0);
    group.add(dialysateOutletMesh);
    parts.push({
        name: "Dialysate Outlet",
        description: "Port where used dialysate containing toxins and excess fluid exits.",
        material: "Medical Plastic",
        function: "Removes waste-laden dialysate.",
        assemblyOrder: 4,
        connections: ["Housing", "Waste Drain"],
        failureEffect: "Dialysate back-pressure.",
        cascadeFailures: ["Membrane rupture from transmembrane pressure"],
        originalPosition: { x: -2.5, y: 4, z: 0 },
        explodedPosition: { x: -6, y: 4, z: 0 },
        mesh: dialysateOutletMesh
    });

    // Hollow Fibers Bundle (Visual representation)
    const fiberBundle = new THREE.Group();
    const fiberMeshes = [];
    for(let i=0; i<20; i++) {
        const fiberGeom = new THREE.CylinderGeometry(0.08, 0.08, 10, 8);
        const fiberMesh = new THREE.Mesh(fiberGeom, hollowFiberMaterial);
        // Distribute fibers inside the housing
        const radius = Math.random() * 1.5;
        const angle = Math.random() * Math.PI * 2;
        fiberMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        fiberBundle.add(fiberMesh);
        fiberMeshes.push(fiberMesh);
    }
    group.add(fiberBundle);
    parts.push({
        name: "Semi-permeable Hollow Fibers Bundle",
        description: "Thousands of microscopic capillary-like tubes where mass transfer occurs. Blood flows inside, dialysate flows outside.",
        material: "Polysulfone/Cellulose Blend",
        function: "Provides massive surface area for diffusion and ultrafiltration.",
        assemblyOrder: 6,
        connections: ["Blood Headers", "Housing Internal Space"],
        failureEffect: "Membrane rupture leading to blood leak.",
        cascadeFailures: ["Blood leak alarm", "System shutdown", "Blood loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -6 },
        mesh: fiberBundle
    });

    // Animated Flow Particles
    const bloodParticles = new THREE.Group();
    const bloodParticleMeshes = [];
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), bloodRedNeon);
        // Position inside fibers roughly
        const radius = Math.random() * 1.5;
        const angle = Math.random() * Math.PI * 2;
        p.position.set(Math.cos(angle) * radius, (Math.random()-0.5)*10, Math.sin(angle) * radius);
        bloodParticles.add(p);
        bloodParticleMeshes.push({ mesh: p, y: p.position.y });
    }
    group.add(bloodParticles);

    const dialysateParticles = new THREE.Group();
    const dialysateParticleMeshes = [];
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), dialysateBlueNeon);
        // Position outside fibers roughly
        const radius = 0.5 + Math.random() * 1.3;
        const angle = Math.random() * Math.PI * 2;
        p.position.set(Math.cos(angle) * radius, (Math.random()-0.5)*10, Math.sin(angle) * radius);
        dialysateParticles.add(p);
        dialysateParticleMeshes.push({ mesh: p, y: p.position.y });
    }
    group.add(dialysateParticles);

    const description = "The Hemodialyzer (Artificial Kidney) is the critical component of a dialysis machine. It uses a semi-permeable membrane shaped into thousands of hollow fibers to filter waste products (like urea and creatinine) and excess fluid from the blood. The counter-current flow (blood flowing one way, dialysate the other) maximizes the concentration gradient for optimal diffusion.";

    const quizQuestions = [
        {
            question: "Why do blood and dialysate flow in opposite directions (counter-current) in the dialyzer?",
            options: [
                "To prevent the machine from overheating",
                "To maintain the maximum concentration gradient across the entire length of the filter",
                "To reduce the transmembrane pressure",
                "To mix the fluids more effectively"
            ],
            correct: 1,
            explanation: "Counter-current flow ensures that as blood gets cleaner, it encounters even cleaner dialysate, maintaining a steep concentration gradient for diffusion along the entire length of the fiber.",
            difficulty: "Medium"
        },
        {
            question: "Which process is primarily responsible for removing excess water from the patient's blood?",
            options: [
                "Diffusion",
                "Active Transport",
                "Ultrafiltration",
                "Osmosis"
            ],
            correct: 2,
            explanation: "Ultrafiltration is driven by hydrostatic pressure differences (transmembrane pressure) and is used to push excess fluid out of the blood compartment into the dialysate compartment.",
            difficulty: "Hard"
        },
        {
            question: "What would trigger a 'Blood Leak Alarm' during treatment?",
            options: [
                "A kink in the blood tubing",
                "A rupture in the semi-permeable hollow fibers",
                "Empty dialysate jug",
                "Power failure"
            ],
            correct: 1,
            explanation: "If the microscopic fibers rupture, blood cells will leak into the dialysate compartment. Optical sensors in the dialysate effluent path detect this and trigger an alarm to prevent significant blood loss.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Blood flows down (from top header to bottom header)
        bloodParticleMeshes.forEach((pData, index) => {
            pData.y -= 2.5 * speed;
            if (pData.y < -5) pData.y = 5;
            pData.mesh.position.y = pData.y;
            // Pulsate emissive intensity for glowing effect
            pData.mesh.material.emissiveIntensity = 2 + Math.sin(time * 5 + index) * 1.5;
        });

        // Dialysate flows up (counter-current)
        dialysateParticleMeshes.forEach((pData, index) => {
            pData.y += 2.5 * speed;
            if (pData.y > 5) pData.y = -5;
            pData.mesh.position.y = pData.y;
            pData.mesh.material.emissiveIntensity = 2 + Math.cos(time * 5 + index) * 1.5;
        });

        // Slight rotation to show the 3D structure better
        group.rotation.y = time * 0.1 * speed;
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
export function createDialysisMembrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
