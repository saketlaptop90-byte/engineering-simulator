import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for visual flair
    const enzymeGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        ior: 1.5,
        roughness: 0.2
    });

    const sugarFluid = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        transmission: 0.8,
        ior: 1.4,
        roughness: 0.1
    });

    const electronArc = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    // 1. Base Housing
    const housingGeom = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const housingMesh = new THREE.Mesh(housingGeom, darkSteel);
    housingMesh.position.set(0, 0, 0);
    group.add(housingMesh);
    parts.push({
        name: "Bio-Battery Housing Base",
        mesh: housingMesh,
        description: "The main structural foundation of the bio-battery, containing coolant channels and power output terminals.",
        material: "darkSteel",
        function: "Provides structural support and environmental protection for internal biological components.",
        assemblyOrder: 1,
        connections: ["Sugar Reservoir", "Anode Chamber", "Power Output Node"],
        failureEffect: "Loss of structural integrity, potential leakage of biological fluids.",
        cascadeFailures: ["Complete system failure", "Fluid containment breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Sugar Reservoir (Fuel Tank)
    const tankGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const tankMesh = new THREE.Mesh(tankGeom, glass);
    const fluidGeom = new THREE.CylinderGeometry(1.4, 1.4, 1.8, 32);
    const fluidMesh = new THREE.Mesh(fluidGeom, sugarFluid);
    
    const tankGroup = new THREE.Group();
    tankGroup.add(tankMesh);
    tankGroup.add(fluidMesh);
    tankGroup.position.set(0, 1.25, 0);
    group.add(tankGroup);

    parts.push({
        name: "Sugar Fuel Reservoir",
        mesh: tankGroup,
        description: "Contains the high-density glucose solution acting as fuel for the biological reaction.",
        material: "glass / sugarFluid",
        function: "Supplies steady stream of glucose to the anode chamber.",
        assemblyOrder: 2,
        connections: ["Bio-Battery Housing Base", "Microfluidic Pump"],
        failureEffect: "Fuel starvation.",
        cascadeFailures: ["Current drop", "Enzyme starvation"],
        originalPosition: { x: 0, y: 1.25, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Microfluidic Pump
    const pumpGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const pumpMesh = new THREE.Mesh(pumpGeom, aluminum);
    pumpMesh.position.set(0, 2.5, 0);
    group.add(pumpMesh);
    parts.push({
        name: "Microfluidic Delivery Pump",
        mesh: pumpMesh,
        description: "Precision pump that regulates the flow of glucose into the enzyme chamber.",
        material: "aluminum",
        function: "Maintains optimal fuel-to-enzyme ratio for maximum electron yield.",
        assemblyOrder: 3,
        connections: ["Sugar Fuel Reservoir", "Enzyme Reaction Chamber"],
        failureEffect: "Irregular fuel delivery.",
        cascadeFailures: ["Power fluctuation", "Enzyme oversaturation"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Enzyme Reaction Chamber (Anode)
    const anodeGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const anodeMesh = new THREE.Mesh(anodeGeom, enzymeGlow);
    anodeMesh.position.set(0, 3.8, 0);
    group.add(anodeMesh);
    parts.push({
        name: "Enzyme Reaction Chamber",
        mesh: anodeMesh,
        description: "The core anode chamber where immobilized enzymes strip electrons from glucose molecules.",
        material: "enzymeGlow",
        function: "Catalyzes glucose oxidation to generate free electrons and hydrogen ions.",
        assemblyOrder: 4,
        connections: ["Microfluidic Delivery Pump", "Proton Exchange Membrane", "Electron Collector"],
        failureEffect: "Enzyme denaturing or reaction stoppage.",
        cascadeFailures: ["Immediate voltage drop", "Cell death"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Electron Collector (Conductive Mesh)
    const collectorGeom = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.25, 16, 16));
    const collectorMesh = new THREE.LineSegments(collectorGeom, new THREE.LineBasicMaterial({ color: 0xaaaaaa }));
    collectorMesh.position.set(0, 3.8, 0);
    group.add(collectorMesh);
    parts.push({
        name: "Electron Collector Matrix",
        mesh: collectorMesh,
        description: "A highly conductive nanomaterial mesh surrounding the enzyme chamber.",
        material: "chrome",
        function: "Captures free electrons from the enzymatic reaction and funnels them to the external circuit.",
        assemblyOrder: 5,
        connections: ["Enzyme Reaction Chamber", "Power Output Node"],
        failureEffect: "High internal resistance.",
        cascadeFailures: ["Overheating", "Lowered power output"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 6. Proton Exchange Membrane (PEM)
    const pemGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32);
    const pemMesh = new THREE.Mesh(pemGeom, tinted);
    pemMesh.position.set(0, 4.6, 0);
    group.add(pemMesh);
    parts.push({
        name: "Proton Exchange Membrane",
        mesh: pemMesh,
        description: "A semi-permeable membrane that only allows hydrogen ions (protons) to pass through to the cathode.",
        material: "tinted",
        function: "Prevents electron short-circuiting while allowing proton flow to maintain charge balance.",
        assemblyOrder: 6,
        connections: ["Enzyme Reaction Chamber", "Cathode Chamber"],
        failureEffect: "Membrane rupture or fouling.",
        cascadeFailures: ["Short circuit", "Thermal runaway"],
        originalPosition: { x: 0, y: 4.6, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 7. Cathode Chamber
    const cathodeGeom = new THREE.SphereGeometry(1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const cathodeMesh = new THREE.Mesh(cathodeGeom, copper);
    cathodeMesh.position.set(0, 4.7, 0);
    group.add(cathodeMesh);
    parts.push({
        name: "Oxygen Cathode Chamber",
        mesh: cathodeMesh,
        description: "The top chamber where oxygen, electrons from the circuit, and protons meet to form water.",
        material: "copper",
        function: "Completes the circuit by reducing oxygen to water.",
        assemblyOrder: 7,
        connections: ["Proton Exchange Membrane", "Power Input Node"],
        failureEffect: "Oxygen starvation.",
        cascadeFailures: ["Reaction bottleneck", "Water buildup"],
        originalPosition: { x: 0, y: 4.7, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 8. Power Output Node
    const nodeGeom = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const nodeMesh = new THREE.Mesh(nodeGeom, plastic);
    nodeMesh.rotation.x = Math.PI / 2;
    nodeMesh.position.set(0, 3.8, 0);
    group.add(nodeMesh);
    parts.push({
        name: "Power Output Ring",
        mesh: nodeMesh,
        description: "The main terminal where generated electricity is drawn from the battery.",
        material: "plastic",
        function: "Interfaces with external devices to provide biological power.",
        assemblyOrder: 8,
        connections: ["Electron Collector Matrix"],
        failureEffect: "Power delivery failure.",
        cascadeFailures: ["Device shutdown"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 3.8, z: 4 }
    });

    // 9. Electric Arc / Energy Beam (Visual effect)
    const arcGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8);
    const arcMesh = new THREE.Mesh(arcGeom, electronArc);
    arcMesh.position.set(0, 3.8, 0);
    arcMesh.rotation.z = Math.PI / 4;
    group.add(arcMesh);
    parts.push({
        name: "Energy Discharge Arc",
        mesh: arcMesh,
        description: "Visual manifestation of the dense electron flow generated by the enzymes.",
        material: "electronArc",
        function: "Indicates active power generation and electron transfer.",
        assemblyOrder: 9,
        connections: ["Electron Collector Matrix", "Power Output Ring"],
        failureEffect: "Arc dissipation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: -3, y: 8, z: 0 }
    });

    const description = "The Enzyme Bio-Battery utilizes specialized immobilized enzymes to strip electrons from glucose (sugar), acting as a biological fuel cell. It represents a green, renewable energy source capable of powering high-tech micro-devices using simple sugars.";

    const quizQuestions = [
        {
            question: "What is the primary fuel source utilized by this Enzyme Bio-Battery?",
            options: ["Lithium Ions", "Glucose (Sugar)", "Hydrogen Gas", "Solar Energy"],
            correct: 1,
            explanation: "Enzyme bio-batteries function similarly to cellular respiration, using enzymes to break down glucose and extract energy in the form of electrons.",
            difficulty: "easy"
        },
        {
            question: "What role does the Proton Exchange Membrane (PEM) play in the bio-battery?",
            options: ["It pumps glucose into the chamber", "It absorbs water from the cathode", "It allows only protons to pass, forcing electrons through the external circuit", "It cools the enzymes"],
            correct: 2,
            explanation: "The PEM is crucial because it blocks electrons from taking a direct path to the cathode, forcing them to travel through the external circuit to do useful work as electrical current, while allowing protons to pass through to balance the charge.",
            difficulty: "medium"
        },
        {
            question: "Which component is responsible for directly capturing the free electrons generated by the enzymes?",
            options: ["Sugar Fuel Reservoir", "Electron Collector Matrix", "Cathode Chamber", "Proton Exchange Membrane"],
            correct: 1,
            explanation: "The Electron Collector Matrix, often a conductive nanomaterial, surrounds the enzymes to immediately capture freed electrons and route them out of the battery.",
            difficulty: "medium"
        },
        {
            question: "What are the byproducts produced at the cathode chamber of this bio-battery?",
            options: ["Carbon Dioxide and Water", "Sulfuric Acid", "Methane", "Pure Oxygen"],
            correct: 0,
            explanation: "At the cathode, protons, electrons, and ambient oxygen combine to form water. The breakdown of glucose at the anode also produces carbon dioxide.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Pulsate enzyme glow
        if (meshes["Enzyme Reaction Chamber"]) {
            meshes["Enzyme Reaction Chamber"].material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 0.5;
            meshes["Enzyme Reaction Chamber"].rotation.y = t * 0.5;
        }

        // Fluid movement
        if (meshes["Sugar Fuel Reservoir"]) {
            meshes["Sugar Fuel Reservoir"].position.y = 1.25 + Math.sin(t * 2) * 0.05;
        }

        // Pump spinning
        if (meshes["Microfluidic Delivery Pump"]) {
            meshes["Microfluidic Delivery Pump"].rotation.y = t * 10;
        }

        // Arc flicker and rotation
        if (meshes["Energy Discharge Arc"]) {
            meshes["Energy Discharge Arc"].rotation.y = t * 15;
            meshes["Energy Discharge Arc"].scale.set(1 + Math.random() * 0.2, 1, 1 + Math.random() * 0.2);
            meshes["Energy Discharge Arc"].material.opacity = 0.5 + Math.random() * 0.5;
        }

        // Collector matrix spinning
        if (meshes["Electron Collector Matrix"]) {
            meshes["Electron Collector Matrix"].rotation.y = -t;
            meshes["Electron Collector Matrix"].rotation.z = Math.sin(t) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createEnzymeBioBattery() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
