import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/high-tech materials
    const bloodRed = new THREE.MeshPhysicalMaterial({
        color: 0xcc0000,
        emissive: 0x550000,
        emissiveIntensity: 0.6,
        transmission: 0.5,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
    });

    const dialysateBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x003366,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 0.7,
        transparent: true,
        roughness: 0.1,
    });
    
    const fiberMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.6,
        opacity: 0.5,
        transparent: true,
        roughness: 0.3,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const toxicGlow = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    // 1. Main Casing (Outer Cylinder)
    const casingGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const casing = new THREE.Mesh(casingGeo, glass);
    casing.position.set(0, 0, 0);
    group.add(casing);
    
    parts.push({
        name: "Main Housing",
        description: "Clear polycarbonate casing that holds the semipermeable hollow fibers.",
        material: "Medical-grade Polycarbonate",
        function: "Encloses the dialysis process, separating the external environment from the sterile blood circuit.",
        assemblyOrder: 1,
        connections: ["Top Blood Header", "Bottom Blood Header", "Dialysate Inlet Port", "Dialysate Outlet Port"],
        failureEffect: "External dialysate leak or loss of pressure boundary.",
        cascadeFailures: ["Complete system failure", "Contamination of sterile field"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: casing
    });

    // 2. Hollow Fibers Bundle
    const bundleGroup = new THREE.Group();
    // Simulate thousands of fibers visually
    for (let i = 0; i < 80; i++) {
        const r = Math.random() * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        
        const fiberGeo = new THREE.CylinderGeometry(0.04, 0.04, 9.8, 8);
        const fiber = new THREE.Mesh(fiberGeo, fiberMaterial);
        fiber.position.set(x, 0, z);
        bundleGroup.add(fiber);
    }
    group.add(bundleGroup);

    parts.push({
        name: "Hollow Fiber Bundle",
        description: "Thousands of microscopic semipermeable tubes carrying patient's blood.",
        material: "Polysulfone / Polyethersulfone",
        function: "Allows uremic toxins and excess water to pass through pores into the dialysate while retaining blood cells and large proteins.",
        assemblyOrder: 2,
        connections: ["Main Housing", "Top Blood Header", "Bottom Blood Header"],
        failureEffect: "Blood leak into dialysate compartment.",
        cascadeFailures: ["Blood loss", "Hemolysis", "Inadequate toxin clearance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -8 },
        mesh: bundleGroup
    });

    // 3. Top Blood Header (Inlet)
    const topHeaderGeo = new THREE.CylinderGeometry(2.1, 2, 1, 32);
    const topHeader = new THREE.Mesh(topHeaderGeo, plastic);
    topHeader.position.set(0, 5.5, 0);
    group.add(topHeader);
    
    parts.push({
        name: "Top Blood Header (Inlet)",
        description: "Manifold for patient's untreated arterial blood.",
        material: "Polyurethane",
        function: "Distributes incoming blood evenly across the internal lumens of all hollow fibers.",
        assemblyOrder: 3,
        connections: ["Main Housing", "Hollow Fiber Bundle", "Blood Inlet Port"],
        failureEffect: "Uneven blood distribution causing clotting in fibers.",
        cascadeFailures: ["Loss of clearance efficiency", "Increased transmembrane pressure"],
        originalPosition: { x: 0, y: 5.5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: topHeader
    });

    // 4. Bottom Blood Header (Outlet)
    const bottomHeaderGeo = new THREE.CylinderGeometry(2, 2.1, 1, 32);
    const bottomHeader = new THREE.Mesh(bottomHeaderGeo, plastic);
    bottomHeader.position.set(0, -5.5, 0);
    group.add(bottomHeader);

    parts.push({
        name: "Bottom Blood Header (Outlet)",
        description: "Manifold collecting the treated, clean venous blood.",
        material: "Polyurethane",
        function: "Collects blood exiting the fibers and channels it back to the patient.",
        assemblyOrder: 4,
        connections: ["Main Housing", "Hollow Fiber Bundle", "Blood Outlet Port"],
        failureEffect: "Flow restriction causing backpressure.",
        cascadeFailures: ["Blood cell damage", "Clotting"],
        originalPosition: { x: 0, y: -5.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: bottomHeader
    });

    // 5. Blood Inlet Port
    const bloodInPortGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const bloodInPort = new THREE.Mesh(bloodInPortGeo, bloodRed);
    bloodInPort.position.set(0, 6.5, 0);
    group.add(bloodInPort);

    parts.push({
        name: "Blood Inlet Port",
        description: "Connector for the arterial blood line.",
        material: "Rigid Medical Plastic",
        function: "Channels high-pressure untreated blood from the patient into the top header.",
        assemblyOrder: 5,
        connections: ["Top Blood Header"],
        failureEffect: "Line disconnection or rupture.",
        cascadeFailures: ["Exsanguination risk", "Air embolism"],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 },
        mesh: bloodInPort
    });

    // 6. Dialysate Inlet Port
    const dialysateInGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    dialysateInGeo.rotateZ(Math.PI / 2);
    const dialysateIn = new THREE.Mesh(dialysateInGeo, dialysateBlue);
    dialysateIn.position.set(2.2, -4, 0);
    group.add(dialysateIn);
    
    parts.push({
        name: "Dialysate Inlet Port",
        description: "Side port injecting fresh dialysate fluid.",
        material: "Molded Polycarbonate",
        function: "Introduces clean dialysate fluid around the outside of the fibers, flowing counter-current to the blood.",
        assemblyOrder: 6,
        connections: ["Main Housing"],
        failureEffect: "Dialysate leak or air entering dialysate circuit.",
        cascadeFailures: ["Loss of concentration gradient", "Inadequate dialysis"],
        originalPosition: { x: 2.2, y: -4, z: 0 },
        explodedPosition: { x: 6, y: -4, z: 0 },
        mesh: dialysateIn
    });
    
    // 7. Dialysate Outlet Port
    const dialysateOutGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    dialysateOutGeo.rotateZ(Math.PI / 2);
    const dialysateOut = new THREE.Mesh(dialysateOutGeo, toxicGlow);
    dialysateOut.position.set(-2.2, 4, 0);
    group.add(dialysateOut);

    parts.push({
        name: "Dialysate Outlet Port",
        description: "Exit port for used dialysate containing extracted uremic toxins.",
        material: "Molded Polycarbonate",
        function: "Removes urea, creatinine, and ultrafiltrated excess water from the casing.",
        assemblyOrder: 7,
        connections: ["Main Housing"],
        failureEffect: "Back-pressure buildup in the dialysate compartment.",
        cascadeFailures: ["Transmembrane membrane rupture", "Reverse filtration"],
        originalPosition: { x: -2.2, y: 4, z: 0 },
        explodedPosition: { x: -6, y: 4, z: 0 },
        mesh: dialysateOut
    });
    
    // Glowing Toxic Particles for dynamic visualization
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i=0; i < particlesCount * 3; i+=3) {
        // Random position within the cylinder
        const r = Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        posArray[i] = r * Math.cos(theta); // x
        posArray[i+1] = (Math.random() - 0.5) * 10; // y (-5 to 5)
        posArray[i+2] = r * Math.sin(theta); // z
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const toxins = new THREE.Points(particlesGeo, particlesMat);
    group.add(toxins);

    const description = "A high-flux hollow fiber dialyzer, acting as an artificial kidney. Blood flows downwards through thousands of microscopic semipermeable fibers while dialysate flows upwards around them in a counter-current direction, removing toxic urea via diffusion and excess water via ultrafiltration.";

    const quizQuestions = [
        {
            question: "Why do blood and dialysate flow in opposite directions (counter-current flow)?",
            options: [
                "To prevent blood from clotting within the fibers",
                "To maximize the concentration gradient across the entire length of the dialyzer",
                "To reduce the structural pressure on the hollow fibers",
                "To minimize the amount of dialysate fluid needed"
            ],
            correct: 1,
            explanation: "Counter-current flow ensures that blood always encounters dialysate with a lower concentration of toxins, maintaining a steady concentration gradient along the entire length of the filter and maximizing diffusion.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary physical mechanism that removes urea and creatinine in the dialyzer?",
            options: [
                "Active transport",
                "Ultrafiltration",
                "Diffusion",
                "Osmosis"
            ],
            correct: 2,
            explanation: "Toxins like urea and creatinine move from an area of higher concentration (blood) to an area of lower concentration (dialysate) across the semipermeable membrane purely via passive diffusion.",
            difficulty: "Medium"
        },
        {
            question: "What prevents essential red blood cells and large proteins from passing into the waste dialysate?",
            options: [
                "The dialysate fluid pressure constantly pushes them back",
                "They are bound to specialized chemical receptors in the headers",
                "The microscopic pores in the semipermeable fibers are too small for them to pass",
                "An electric charge applied to the casing repels them"
            ],
            correct: 2,
            explanation: "The semipermeable membrane of the hollow fibers is precisely engineered with pores sized to allow small molecules like water, electrolytes, and urea to pass, but strictly restrict large elements like blood cells and albumin.",
            difficulty: "Easy"
        },
        {
            question: "What occurs if the transmembrane pressure (TMP) becomes too high?",
            options: [
                "The fibers clean the blood faster",
                "The dialysate becomes ultra-purified",
                "Excessive fluid is removed or fibers may rupture",
                "Blood clots are instantly dissolved"
            ],
            correct: 2,
            explanation: "High Transmembrane Pressure (TMP) drives fluid out of the blood (ultrafiltration), but if it exceeds safety limits, it can remove too much fluid from the patient or cause the hollow fibers to rupture, leaking blood into the dialysate.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the neon toxic glow material to make it look active
        toxicGlow.emissiveIntensity = 1.0 + 0.8 * Math.sin(time * 6);
        
        // Move toxins particles UPWARDS (simulating counter-current dialysate flow taking toxins away)
        const positions = toxins.geometry.attributes.position.array;
        for(let i=1; i < positions.length; i+=3) {
            positions[i] += speed * 3.0;
            // Loop particles back to bottom
            if (positions[i] > 5) {
                positions[i] = -5;
            }
        }
        toxins.geometry.attributes.position.needsUpdate = true;
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
