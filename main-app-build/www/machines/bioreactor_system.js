import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const bioGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.7
    });
    
    // Meshes array for animation reference
    const meshes = {};

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(4, 4.2, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Base Platform",
        description: "Heavy-duty vibration dampening base platform for stability.",
        material: "Dark Steel",
        function: "Supports the entire bioreactor structure and absorbs vibrational forces from the agitator.",
        assemblyOrder: 1,
        connections: ["Vessel Support Structure", "Motor Housing"],
        failureEffect: "Excessive vibration leading to micro-fractures in the glass vessel.",
        cascadeFailures: ["Vessel Rupture", "Contamination"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Glass Culture Vessel
    const vesselGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
    const vesselMesh = new THREE.Mesh(vesselGeo, tinted || glass);
    vesselMesh.position.set(0, 3.5, 0);
    group.add(vesselMesh);
    meshes.vessel = vesselMesh;
    parts.push({
        name: "Culture Vessel",
        description: "Borosilicate glass vessel containing the cell culture medium.",
        material: "Tinted Glass",
        function: "Provides a sterile, controlled environment for cellular growth.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Headplate", "Bio-Fluid"],
        failureEffect: "Loss of sterility and catastrophic spill of bio-hazardous material.",
        cascadeFailures: ["Total Batch Loss", "Lab Contamination"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 5 }
    });

    // 3. Bio-Fluid (Glowing culture)
    const fluidGeo = new THREE.CylinderGeometry(2.4, 2.4, 4.5, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, bioGlowMaterial);
    fluidMesh.position.set(0, 2.8, 0);
    group.add(fluidMesh);
    meshes.fluid = fluidMesh;
    parts.push({
        name: "Bio-Luminescent Culture",
        description: "Engineered cell culture with bio-luminescent protein expression.",
        material: "Bio-Plasma",
        function: "Produces targeted biopharmaceuticals or recombinant proteins.",
        assemblyOrder: 3,
        connections: ["Culture Vessel", "Agitator Impeller"],
        failureEffect: "Cell death or reduced protein yield.",
        cascadeFailures: ["Batch Rejection"],
        originalPosition: { x: 0, y: 2.8, z: 0 },
        explodedPosition: { x: 0, y: 2.8, z: 0 }
    });

    // 4. Headplate (Top Lid)
    const headplateGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.4, 32);
    const headplateMesh = new THREE.Mesh(headplateGeo, chrome);
    headplateMesh.position.set(0, 6.7, 0);
    group.add(headplateMesh);
    meshes.headplate = headplateMesh;
    parts.push({
        name: "Headplate",
        description: "Stainless steel headplate sealing the top of the vessel.",
        material: "Chrome / Stainless Steel",
        function: "Maintains a hermetic seal and provides ports for sensors and feed lines.",
        assemblyOrder: 4,
        connections: ["Culture Vessel", "Agitator Shaft", "Sensors"],
        failureEffect: "Contamination ingress and loss of internal pressure control.",
        cascadeFailures: ["Contamination", "Metabolic Shift"],
        originalPosition: { x: 0, y: 6.7, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 5. Agitator Motor
    const motorGeo = new THREE.CylinderGeometry(1, 1, 1.5, 16);
    const motorMesh = new THREE.Mesh(motorGeo, neonBlueMaterial);
    motorMesh.position.set(0, 7.8, 0);
    group.add(motorMesh);
    meshes.motor = motorMesh;
    parts.push({
        name: "Servo Drive Motor",
        description: "High-torque, precision servo motor.",
        material: "Neon Blue Steel",
        function: "Drives the agitator shaft at precise RPM to maintain optimal mixing and oxygen transfer.",
        assemblyOrder: 5,
        connections: ["Headplate", "Agitator Shaft"],
        failureEffect: "Loss of mixing, leading to cell settling and oxygen starvation.",
        cascadeFailures: ["Cell Asphyxiation", "Lactic Acid Build-up"],
        originalPosition: { x: 0, y: 7.8, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 6. Agitator Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 7, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, steel);
    shaftMesh.position.set(0, 3.5, 0);
    group.add(shaftMesh);
    meshes.shaft = shaftMesh;
    parts.push({
        name: "Agitator Shaft",
        description: "Central rotating shaft connecting motor to impellers.",
        material: "Stainless Steel",
        function: "Transfers rotational kinetic energy to the impellers.",
        assemblyOrder: 6,
        connections: ["Agitator Motor", "Impellers"],
        failureEffect: "Mechanical binding or shearing.",
        cascadeFailures: ["Motor Overload", "Mixing Failure"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 5 }
    });

    // 7. Impellers
    const impellerGroup = new THREE.Group();
    
    // Bottom impeller (Rushton turbine)
    const bladeGeo = new THREE.BoxGeometry(1.5, 0.3, 0.05);
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(bladeGeo, aluminum);
        blade.rotation.y = (Math.PI / 2) * i;
        impellerGroup.add(blade);
    }
    
    // Top impeller (Pitched blade)
    for(let i=0; i<4; i++) {
        const bladeTop = new THREE.Mesh(bladeGeo, aluminum);
        bladeTop.position.y = 2;
        bladeTop.rotation.y = (Math.PI / 2) * i;
        bladeTop.rotation.x = Math.PI / 4;
        impellerGroup.add(bladeTop);
    }
    
    impellerGroup.position.set(0, 2, 0);
    group.add(impellerGroup);
    meshes.impellerGroup = impellerGroup;
    parts.push({
        name: "Dual Impeller System",
        description: "Combination Rushton turbine and pitched blade impellers.",
        material: "Aluminum",
        function: "Provides axial and radial flow for maximum mass transfer and homogenization.",
        assemblyOrder: 7,
        connections: ["Agitator Shaft"],
        failureEffect: "Inadequate mixing zones leading to nutrient gradients.",
        cascadeFailures: ["Sub-optimal Yield", "Foaming"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 5, y: 2, z: 0 }
    });

    // 8. Sparge Ring
    const spargeGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 32);
    const spargeMesh = new THREE.Mesh(spargeGeo, copper);
    spargeMesh.position.set(0, 0.8, 0);
    spargeMesh.rotation.x = Math.PI / 2;
    group.add(spargeMesh);
    meshes.sparge = spargeMesh;
    parts.push({
        name: "Micro-Sparge Ring",
        description: "Sintered metal sparger ring for gas introduction.",
        material: "Copper",
        function: "Introduces fine oxygen bubbles into the culture for cellular respiration.",
        assemblyOrder: 8,
        connections: ["Gas Supply Lines", "Culture Vessel"],
        failureEffect: "Clogging leads to hypoxia in the cell culture.",
        cascadeFailures: ["Cell Death", "Anaerobic Respiration"],
        originalPosition: { x: 0, y: 0.8, z: 0 },
        explodedPosition: { x: -5, y: 0.8, z: 0 }
    });

    // 9. Sensor Probes (pH & DO)
    const probeGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 16);
    const phProbe = new THREE.Mesh(probeGeo, neonRedMaterial);
    phProbe.position.set(1.5, 5, 0);
    phProbe.rotation.z = -Math.PI / 12;
    group.add(phProbe);
    
    const doProbe = new THREE.Mesh(probeGeo, neonBlueMaterial);
    doProbe.position.set(-1.5, 5, 0);
    doProbe.rotation.z = Math.PI / 12;
    group.add(doProbe);
    
    meshes.probes = new THREE.Group();
    meshes.probes.add(phProbe);
    meshes.probes.add(doProbe);
    parts.push({
        name: "Analytical Probes",
        description: "Optical Dissolved Oxygen (DO) and electrochemical pH sensors.",
        material: "Neon Glowing Materials",
        function: "Real-time monitoring of critical process parameters (CPKs).",
        assemblyOrder: 9,
        connections: ["Headplate", "Control System"],
        failureEffect: "Loss of process control leading to extreme pH or DO shifts.",
        cascadeFailures: ["Complete Batch Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    const description = "The Advanced Bioreactor System is a highly controlled environment designed for the mass cultivation of engineered cells. It maintains strict parameters for temperature, pH, dissolved oxygen, and agitation to optimize the production of recombinant proteins and biopharmaceuticals.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Micro-Sparge Ring?",
            options: ["To remove waste gases", "To introduce fine oxygen bubbles for respiration", "To cool the bioreactor", "To measure the pH of the culture"],
            correct: 1,
            explanation: "The sparge ring is responsible for introducing gas (typically oxygen/air) in the form of micro-bubbles into the bottom of the reactor, maximizing the surface area for oxygen transfer to the cells.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for providing both axial and radial fluid flow?",
            options: ["Headplate", "Sparge Ring", "Dual Impeller System", "Sensor Probes"],
            correct: 2,
            explanation: "The Dual Impeller System, often combining Rushton and pitched blade turbines, ensures complete homogenization of the media by driving both radial and axial fluid flows.",
            difficulty: "Easy"
        },
        {
            question: "What cascade failure is likely if the Agitator Motor fails?",
            options: ["Vessel Rupture", "Overheating of the Sparge Ring", "Cell Asphyxiation and Lactic Acid Build-up", "Loss of sterility"],
            correct: 2,
            explanation: "If the motor fails, the impellers stop. Without mixing, cells settle, oxygen cannot distribute (causing asphyxiation), and cells shift to anaerobic metabolism, producing lactic acid.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Continuous rotation of the agitator shaft and impellers
        const rotSpeed = time * speed * 2;
        if (meshesObj.shaft) meshesObj.shaft.rotation.y = rotSpeed;
        if (meshesObj.impellerGroup) meshesObj.impellerGroup.rotation.y = rotSpeed;

        // Pulsating glow on the bio-fluid to simulate metabolic activity
        if (meshesObj.fluid && meshesObj.fluid.material.emissiveIntensity !== undefined) {
            meshesObj.fluid.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 5) * 0.5;
            // Slight scaling to simulate bubbling/movement
            const scalePulse = 1.0 + Math.sin(time * speed * 10) * 0.01;
            meshesObj.fluid.scale.set(scalePulse, 1.0, scalePulse);
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBioreactorSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
