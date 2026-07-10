import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials for ions and energy effects
    const ionMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const activeAnodeMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0xff4500,
        emissiveIntensity: 0.2
    });

    const activeCathodeMat = new THREE.MeshStandardMaterial({
        color: 0x2f4f4f,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x00ff7f,
        emissiveIntensity: 0.2
    });

    const separatorMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    // 1. Casing (Outer shell, cutaway)
    const casingGeo = new THREE.CylinderGeometry(2.1, 2.1, 8, 32, 1, false, 0, Math.PI * 1.5); // cutaway
    const casing = new THREE.Mesh(casingGeo, chrome);
    group.add(casing);
    meshes.casing = casing;
    parts.push({
        name: "Outer Casing",
        description: "A durable protective cylinder holding internal components and maintaining structural integrity under thermal stress.",
        material: "Stainless Steel / Chrome",
        function: "Protects internal components from physical damage and provides external structural support.",
        assemblyOrder: 1,
        connections: ["Positive Terminal", "Negative Terminal"],
        failureEffect: "Physical breach leads to electrolyte leakage, loss of pressure, and potential thermal runaway.",
        cascadeFailures: ["Complete cell failure", "Fire hazard"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // 2. Anode Layer (Graphite)
    const anodeGeo = new THREE.CylinderGeometry(1.6, 1.6, 7.6, 32, 1, false, 0, Math.PI * 1.5);
    const anode = new THREE.Mesh(anodeGeo, activeAnodeMat);
    group.add(anode);
    meshes.anode = anode;
    parts.push({
        name: "Anode (Negative Electrode)",
        description: "Typically made of graphite coated on copper foil, it stores lithium ions during charging.",
        material: "Graphite / Copper Foil",
        function: "Releases electrons to the external circuit and lithium ions to the electrolyte during discharge.",
        assemblyOrder: 2,
        connections: ["Separator", "Negative Terminal", "Electrolyte"],
        failureEffect: "Lithium plating leading to internal short circuits.",
        cascadeFailures: ["Thermal runaway", "Capacity fade"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 }
    });

    // 3. Separator
    const separatorGeo = new THREE.CylinderGeometry(1.2, 1.2, 7.8, 32, 1, false, 0, Math.PI * 1.5);
    const separator = new THREE.Mesh(separatorGeo, separatorMat);
    group.add(separator);
    meshes.separator = separator;
    parts.push({
        name: "Micro-porous Separator",
        description: "A thin porous membrane preventing direct contact between anode and cathode while allowing ion flow.",
        material: "Polymer (PE/PP)",
        function: "Prevents electrical short circuits between electrodes but allows ionic transport.",
        assemblyOrder: 3,
        connections: ["Anode", "Cathode", "Electrolyte"],
        failureEffect: "Internal short circuit, rapid discharge.",
        cascadeFailures: ["Catastrophic thermal runaway", "Explosion/Fire"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 4. Cathode Layer (Lithium Metal Oxide)
    const cathodeGeo = new THREE.CylinderGeometry(0.8, 0.8, 7.6, 32, 1, false, 0, Math.PI * 1.5);
    const cathode = new THREE.Mesh(cathodeGeo, activeCathodeMat);
    group.add(cathode);
    meshes.cathode = cathode;
    parts.push({
        name: "Cathode (Positive Electrode)",
        description: "Lithium metal oxide coated on an aluminum current collector, acting as the ion source.",
        material: "Lithium Cobalt Oxide / Aluminum",
        function: "Accepts electrons from external circuit and lithium ions from the electrolyte during discharge.",
        assemblyOrder: 4,
        connections: ["Separator", "Positive Terminal", "Electrolyte"],
        failureEffect: "Structural degradation and oxygen release at high temperatures.",
        cascadeFailures: ["Exothermic reaction", "Fire"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 }
    });

    // 5. Positive Terminal (Cap)
    const topGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 32);
    const topCap = new THREE.Mesh(topGeo, steel);
    topCap.position.y = 4.25;
    group.add(topCap);
    meshes.topCap = topCap;
    parts.push({
        name: "Positive Terminal (Cap with PTC)",
        description: "Top cap featuring a Positive Temperature Coefficient (PTC) switch and pressure relief vent.",
        material: "Steel / Aluminum",
        function: "Serves as positive electrical connection and houses safety mechanisms.",
        assemblyOrder: 5,
        connections: ["Cathode", "Outer Casing"],
        failureEffect: "Vent rupture or PTC failure leads to swelling or explosion if pressure isn't released safely.",
        cascadeFailures: ["Rupture", "Loss of electrical contact"],
        originalPosition: { x: 0, y: 4.25, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 6. Negative Terminal (Base)
    const baseGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.4, 32);
    const baseCap = new THREE.Mesh(baseGeo, steel);
    baseCap.position.y = -4.2;
    group.add(baseCap);
    meshes.baseCap = baseCap;
    parts.push({
        name: "Negative Terminal",
        description: "The flat bottom of the cell connected to the anode current collector.",
        material: "Steel / Copper",
        function: "Provides the negative electrical contact point for external circuits.",
        assemblyOrder: 6,
        connections: ["Anode", "Outer Casing"],
        failureEffect: "Poor contact leads to high resistance and local heating.",
        cascadeFailures: ["Efficiency loss", "Heat generation"],
        originalPosition: { x: 0, y: -4.2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 7. Lithium Ions (Particle System)
    const ionGroup = new THREE.Group();
    const ionCount = 80;
    meshes.ions = [];
    
    const ionGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    for (let i = 0; i < ionCount; i++) {
        const ion = new THREE.Mesh(ionGeometry, ionMaterial);
        
        // Distribute ions between cathode (r=0.8) and anode (r=1.6)
        const radius = 0.8 + Math.random() * 0.8;
        const theta = Math.random() * Math.PI * 1.5; // only in cutaway visible area
        const yPos = (Math.random() - 0.5) * 7.0;
        
        ion.position.set(radius * Math.cos(theta), yPos, radius * Math.sin(theta));
        
        // Save initial state for animation
        ion.userData = {
            baseRadius: radius,
            theta: theta,
            yPos: yPos,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
        };
        
        ionGroup.add(ion);
        meshes.ions.push(ion);
    }
    group.add(ionGroup);
    meshes.ionGroup = ionGroup;
    parts.push({
        name: "Lithium Ions & Electrolyte",
        description: "Lithium ions dissolved in organic solvents facilitating ionic charge transfer.",
        material: "Lithium Salts / Liquid Solvents",
        function: "Acts as the transport medium for lithium ions between anode and cathode.",
        assemblyOrder: 7,
        connections: ["Anode", "Cathode", "Separator"],
        failureEffect: "Electrolyte decomposition generates gas, causing cell swelling.",
        cascadeFailures: ["Swelling", "Venting", "Thermal runaway"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 3 }
    });

    const description = "The Lithium-Ion Battery is an advanced rechargeable energy storage device. It operates by moving lithium ions from the negative electrode (anode) to the positive electrode (cathode) during discharge, and back when charging. Its high energy density, lack of memory effect, and slow loss of charge when not in use make it the standard for portable electronics and electric vehicles. Safety mechanisms like the separator, PTC, and relief vents are critical to prevent thermal runaway.";

    const quizQuestions = [
        {
            question: "What is the primary function of the micro-porous separator in a lithium-ion battery?",
            options: [
                "To conduct electrons directly between the electrodes.",
                "To store lithium ions when fully charged.",
                "To prevent direct electrical contact between electrodes while allowing ion flow.",
                "To cool the battery during rapid charging."
            ],
            correct: 2,
            explanation: "The separator acts as a physical barrier to stop a short circuit (electron flow) while its microscopic pores allow lithium ions to pass back and forth through the liquid electrolyte.",
            difficulty: "Medium"
        },
        {
            question: "During battery discharge, in which direction do the lithium ions flow?",
            options: [
                "From the cathode to the anode.",
                "From the anode to the cathode.",
                "From the separator to the outer casing.",
                "They remain stationary within the electrolyte."
            ],
            correct: 1,
            explanation: "During discharge, the anode releases lithium ions which travel through the electrolyte and separator to the cathode, while electrons flow through the external circuit.",
            difficulty: "Medium"
        },
        {
            question: "What catastrophic event can occur if the battery experiences an internal short circuit?",
            options: [
                "Reverse polarity charging.",
                "Voltage spike to 120V.",
                "Complete crystallization of the electrolyte.",
                "Thermal runaway and potential fire/explosion."
            ],
            correct: 3,
            explanation: "An internal short circuit causes rapid, uncontrolled discharge and extreme heat generation. This can ignite the flammable organic electrolyte, leading to a dangerous 'thermal runaway' chain reaction.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Animate glowing effects based on 'charge/discharge' cycle
        const cycle = Math.sin(time * speed); // -1 to 1 (simulate discharge to charge)
        
        // Pulse anode and cathode emissions
        activeAnodeMat.emissiveIntensity = 0.2 + ((cycle + 1) / 2) * 0.4;
        activeCathodeMat.emissiveIntensity = 0.2 + ((1 - cycle) / 2) * 0.4;

        // Animate ions migrating between anode and cathode
        if (activeMeshes.ions && activeMeshes.ions.length > 0) {
            activeMeshes.ions.forEach(ion => {
                // Target radius: Cathode (0.8) during discharge, Anode (1.6) during charge
                const targetRadius = 1.2 + 0.4 * cycle; // sweeps between 0.8 and 1.6
                
                // Add some chaotic movement simulating diffusion
                const jitterR = Math.sin(time * 5 * ion.userData.speed + ion.userData.phase) * 0.05;
                const currentRadius = targetRadius + jitterR;
                
                const currentY = ion.userData.yPos + Math.cos(time * 3 * ion.userData.speed + ion.userData.phase) * 0.1;

                ion.position.x = currentRadius * Math.cos(ion.userData.theta);
                ion.position.z = currentRadius * Math.sin(ion.userData.theta);
                ion.position.y = currentY;
                
                // Fade out ions if they get too close to the separator (simulating crossing)
                const distToSeparator = Math.abs(currentRadius - 1.2);
                ion.material.opacity = 0.4 + (0.4 * (distToSeparator / 0.4));
            });
        }
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
export function createBattery() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
