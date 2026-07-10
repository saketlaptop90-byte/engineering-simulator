import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const fluidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        ior: 1.33
    });

    const heatingJacketMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.6
    });

    const sensorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2288ff,
        emissive: 0x2288ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Base / Control Unit
    const baseGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Control Unit Base",
        description: "Houses the motor, electronics, and mass flow controllers.",
        material: "darkSteel",
        function: "Provides structural support and control infrastructure.",
        assemblyOrder: 1,
        connections: ["Vessel", "Motor", "Sensors"],
        failureEffect: "Complete system shutdown and loss of environmental control.",
        cascadeFailures: ["Culture Death", "Motor Stoppage"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Glass Vessel
    const vesselGeo = new THREE.CylinderGeometry(1.8, 1.8, 4, 32);
    const vesselMesh = new THREE.Mesh(vesselGeo, glass);
    vesselMesh.position.set(0, 3, 0);
    group.add(vesselMesh);
    parts.push({
        name: "Glass Vessel",
        description: "Borosilicate glass container for the culture.",
        material: "glass",
        function: "Maintains sterile boundary while allowing visual inspection.",
        assemblyOrder: 2,
        connections: ["Base", "Headplate"],
        failureEffect: "Contamination of the culture and fluid leakage.",
        cascadeFailures: ["Biohazard Release"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 5 }
    });

    // 3. Culture Fluid
    const fluidGeo = new THREE.CylinderGeometry(1.75, 1.75, 2.5, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, fluidMaterial);
    fluidMesh.position.set(0, 2.25, 0);
    group.add(fluidMesh);
    parts.push({
        name: "Culture Fluid",
        description: "Nutrient broth containing the biological cells.",
        material: "fluidMaterial",
        function: "Provides nutrients and environment for cell growth.",
        assemblyOrder: 3,
        connections: ["Impeller", "Sparger", "Sensors"],
        failureEffect: "Nutrient depletion or toxicity.",
        cascadeFailures: ["Cell Death"],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 2.25, z: -5 }
    });

    // 4. Impeller Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.5, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.position.set(0, 3.25, 0);
    group.add(shaftMesh);
    parts.push({
        name: "Impeller Shaft",
        description: "Central rotating shaft driven by the motor.",
        material: "chrome",
        function: "Transmits rotational force to the impeller blades.",
        assemblyOrder: 4,
        connections: ["Motor", "Impeller Blades"],
        failureEffect: "Loss of agitation.",
        cascadeFailures: ["Poor Mixing", "Oxygen Starvation"],
        originalPosition: { x: 0, y: 3.25, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Impeller Blades (Rushton Turbine)
    const bladeGeo = new THREE.BoxGeometry(1.2, 0.2, 0.05);
    const bladesMesh = new THREE.Group();
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(bladeGeo, steel);
        blade.rotation.y = (i * Math.PI) / 2;
        bladesMesh.add(blade);
    }
    bladesMesh.position.set(0, 2, 0);
    group.add(bladesMesh);
    parts.push({
        name: "Impeller Blades",
        description: "Rushton turbine blades for agitation.",
        material: "steel",
        function: "Provides radial mixing and shear for gas dispersion.",
        assemblyOrder: 5,
        connections: ["Impeller Shaft"],
        failureEffect: "Inadequate mixing and mass transfer.",
        cascadeFailures: ["Low Dissolved Oxygen"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: bladesMesh // Keep reference for animation
    });

    // 6. Sparger
    const spargerGeo = new THREE.TorusGeometry(1, 0.05, 16, 32);
    const spargerMesh = new THREE.Mesh(spargerGeo, aluminum);
    spargerMesh.rotation.x = Math.PI / 2;
    spargerMesh.position.set(0, 1.2, 0);
    group.add(spargerMesh);
    parts.push({
        name: "Ring Sparger",
        description: "Porous ring for gas introduction.",
        material: "aluminum",
        function: "Introduces bubbles of air/oxygen into the media.",
        assemblyOrder: 6,
        connections: ["Gas Inlet"],
        failureEffect: "Clogging leads to zero aeration.",
        cascadeFailures: ["Cell Asphyxiation"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: -4, y: 1.2, z: 0 }
    });

    // 7. Headplate
    const headplateGeo = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const headplateMesh = new THREE.Mesh(headplateGeo, steel);
    headplateMesh.position.set(0, 5.15, 0);
    group.add(headplateMesh);
    parts.push({
        name: "Headplate",
        description: "Stainless steel top cover with multiple ports.",
        material: "steel",
        function: "Seals the vessel and provides access for probes and feeds.",
        assemblyOrder: 7,
        connections: ["Vessel", "Probes", "Exhaust"],
        failureEffect: "Loss of sterility.",
        cascadeFailures: ["Contamination"],
        originalPosition: { x: 0, y: 5.15, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 8. Sensors (pH, DO)
    const sensorGroup = new THREE.Group();
    const probeGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
    
    const phProbe = new THREE.Mesh(probeGeo, sensorMaterial);
    phProbe.position.set(1, 4, 0);
    phProbe.rotation.z = -0.1;
    sensorGroup.add(phProbe);

    const doProbe = new THREE.Mesh(probeGeo, sensorMaterial);
    doProbe.position.set(-1, 4, 0);
    doProbe.rotation.z = 0.1;
    sensorGroup.add(doProbe);
    
    group.add(sensorGroup);
    parts.push({
        name: "Probes (pH & DO)",
        description: "Electrochemical sensors for dissolved oxygen and pH.",
        material: "sensorMaterial",
        function: "Monitors critical process parameters in real-time.",
        assemblyOrder: 8,
        connections: ["Headplate", "Control Unit"],
        failureEffect: "Loss of parameter feedback.",
        cascadeFailures: ["pH Excursion", "Oxygen Depletion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 4, z: 0 }
    });

    // 9. Heating Blanket
    const jacketGeo = new THREE.CylinderGeometry(1.85, 1.85, 2, 32, 1, true, 0, Math.PI);
    const jacketMesh = new THREE.Mesh(jacketGeo, heatingJacketMaterial);
    jacketMesh.position.set(0, 2.5, 0);
    jacketMesh.rotation.y = Math.PI / 2;
    group.add(jacketMesh);
    parts.push({
        name: "Heating Blanket",
        description: "Electric heating element wrapped around the vessel.",
        material: "heatingJacketMaterial",
        function: "Maintains optimal temperature for cell growth.",
        assemblyOrder: 9,
        connections: ["Vessel", "Control Unit"],
        failureEffect: "Temperature deviation.",
        cascadeFailures: ["Reduced Growth Rate", "Protein Denaturation"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: -4 }
    });

    // Description
    const description = "A high-tech Bioengineering Bioreactor used for controlled cultivation of microorganisms or mammalian cells. It features precise agitation, aeration, and environmental control.";

    // Quizzes
    const quizQuestions = [
        {
            question: "What is the primary function of the Rushton turbine (impeller) in this bioreactor?",
            options: [
                "To cool the liquid",
                "To provide radial mixing and disperse gas bubbles",
                "To measure the pH of the culture",
                "To filter exhaust gases"
            ],
            correct: 1,
            explanation: "Rushton turbines provide excellent radial flow and high shear, which is ideal for breaking up gas bubbles from the sparger to improve oxygen mass transfer.",
            difficulty: "Medium"
        },
        {
            question: "Why is the vessel typically made of borosilicate glass?",
            options: [
                "It is lighter than plastic",
                "It withstands high pressures and temperatures during sterilization (autoclaving)",
                "It enhances the magnetic field of the motor",
                "It promotes cell adhesion"
            ],
            correct: 1,
            explanation: "Borosilicate glass is resistant to thermal shock and can be repeatedly autoclaved without degrading.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the sparger becomes completely clogged?",
            options: [
                "The impeller spins faster",
                "pH levels will immediately spike",
                "Aeration stops, leading to oxygen starvation for aerobic cultures",
                "The heating blanket overheats"
            ],
            correct: 2,
            explanation: "The sparger introduces air/oxygen. A clog stops this flow, causing dissolved oxygen (DO) levels to plummet, starving aerobic cells.",
            difficulty: "Medium"
        },
        {
            question: "How does the bioreactor maintain optimal temperature?",
            options: [
                "By spinning the impeller very fast",
                "Through the heating blanket and cooling water fingers (not fully visible here)",
                "By adding cold media continuously",
                "By altering the pH"
            ],
            correct: 1,
            explanation: "Temperature is controlled via a heating jacket/blanket for heating, and often internal cooling loops or a chilled water jacket for cooling.",
            difficulty: "Medium"
        }
    ];

    // Animation loop
    const animate = (time, speed, meshes) => {
        // Find impeller blades and fluid to animate
        const impeller = parts.find(p => p.name === "Impeller Blades");
        if (impeller && impeller.mesh) {
            impeller.mesh.rotation.y += 0.05 * speed;
        }

        // Pulse the fluid emissive intensity slightly to simulate activity
        fluidMaterial.emissiveIntensity = 0.8 + Math.sin(time * 0.002 * speed) * 0.2;
        
        // Pulse heating blanket to simulate PID control
        heatingJacketMaterial.emissiveIntensity = 0.3 + Math.sin(time * 0.001 * speed) * 0.1;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBioreactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
