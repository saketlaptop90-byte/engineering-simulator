import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const toxicGasMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ff88,
        emissive: 0x228822,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
    });

    const liquidAmineMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
    });

    const heatedAmineMaterial = new THREE.MeshStandardMaterial({
        color: 0xff44ff,
        emissive: 0xcc00cc,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.7,
    });

    const columnMaterial = new THREE.MeshStandardMaterial({
        color: 0x444455,
        roughness: 0.6,
        metalness: 0.7,
        transparent: true,
        opacity: 0.3 // Semi-transparent to see inside
    });

    // 1. Column Shell
    const shellGeometry = new THREE.CylinderGeometry(4, 4, 30, 32);
    const shellMesh = new THREE.Mesh(shellGeometry, columnMaterial);
    shellMesh.position.set(0, 15, 0);
    group.add(shellMesh);
    parts.push({
        name: "Main Column Shell",
        description: "A tall cylindrical pressure vessel that houses the packing materials where the gas-liquid contact occurs.",
        material: "steel",
        function: "Contains the high-pressure gas and liquid amine flow, forcing them into contact.",
        assemblyOrder: 1,
        connections: ["Flue Gas Inlet", "Lean Amine Inlet", "Rich Amine Outlet", "Clean Gas Outlet"],
        failureEffect: "Rupture leading to release of toxic flue gas and amine solution.",
        cascadeFailures: ["Environmental hazard", "System depressurization"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: -10, y: 15, z: 0 },
        mesh: shellMesh
    });

    // 2. Packing Beds (Multiple layers)
    const bedsGeometry = new THREE.CylinderGeometry(3.8, 3.8, 8, 32);
    const bed1 = new THREE.Mesh(bedsGeometry, darkSteel);
    bed1.position.set(0, 10, 0);
    group.add(bed1);
    const bed2 = new THREE.Mesh(bedsGeometry, darkSteel);
    bed2.position.set(0, 20, 0);
    group.add(bed2);
    
    parts.push({
        name: "Structured Packing Beds",
        description: "Layers of structured or random packing material designed to maximize surface area for contact.",
        material: "aluminum", // or stainless steel
        function: "Maximizes the surface area and contact time between the rising flue gas and falling liquid amine.",
        assemblyOrder: 2,
        connections: ["Main Column Shell"],
        failureEffect: "Channeling or flooding, significantly reducing CO2 capture efficiency.",
        cascadeFailures: ["Excessive CO2 emissions", "Increased amine carryover"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 10, y: 15, z: 0 },
        mesh: [bed1, bed2]
    });

    // 3. Flue Gas Inlet
    const gasInletGeom = new THREE.CylinderGeometry(1.5, 1.5, 5, 16);
    const gasInlet = new THREE.Mesh(gasInletGeom, steel);
    gasInlet.rotation.z = Math.PI / 2;
    gasInlet.position.set(-6, 4, 0);
    group.add(gasInlet);
    
    parts.push({
        name: "Flue Gas Inlet",
        description: "Pipes directing the CO2-rich flue gas into the bottom of the scrubber.",
        material: "steel",
        function: "Introduces the raw flue gas from the power plant into the column.",
        assemblyOrder: 3,
        connections: ["Main Column Shell"],
        failureEffect: "Blockage preventing gas from entering, causing backpressure to the source.",
        cascadeFailures: ["Power plant trip"],
        originalPosition: { x: -6, y: 4, z: 0 },
        explodedPosition: { x: -15, y: 4, z: 0 },
        mesh: gasInlet
    });

    // 4. Lean Amine Inlet (Top)
    const amineInletGeom = new THREE.CylinderGeometry(1, 1, 5, 16);
    const amineInlet = new THREE.Mesh(amineInletGeom, steel);
    amineInlet.rotation.z = Math.PI / 2;
    amineInlet.position.set(6, 26, 0);
    group.add(amineInlet);

    parts.push({
        name: "Lean Amine Inlet & Distributor",
        description: "Entry point for CO2-lean amine solution, featuring spray nozzles to evenly distribute the liquid.",
        material: "steel",
        function: "Sprays fresh, CO2-hungry amine solution over the top of the packing beds.",
        assemblyOrder: 4,
        connections: ["Main Column Shell"],
        failureEffect: "Maldistribution of amine, leaving parts of the gas un-treated.",
        cascadeFailures: ["Reduced capture efficiency"],
        originalPosition: { x: 6, y: 26, z: 0 },
        explodedPosition: { x: 15, y: 26, z: 0 },
        mesh: amineInlet
    });

    // 5. Clean Gas Outlet (Top)
    const gasOutletGeom = new THREE.CylinderGeometry(1.5, 1.5, 5, 16);
    const gasOutlet = new THREE.Mesh(gasOutletGeom, steel);
    gasOutlet.position.set(0, 32, 0);
    group.add(gasOutlet);

    parts.push({
        name: "Clean Gas Outlet",
        description: "Exhaust port for the treated flue gas, now largely stripped of CO2.",
        material: "steel",
        function: "Releases the clean gas (mostly nitrogen and water vapor) to the atmosphere.",
        assemblyOrder: 5,
        connections: ["Main Column Shell", "Wash Water Section"],
        failureEffect: "Blockage leading to over-pressurization of the column.",
        cascadeFailures: ["Structural damage to shell"],
        originalPosition: { x: 0, y: 32, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 },
        mesh: gasOutlet
    });

    // 6. Rich Amine Outlet (Bottom)
    const richAmineOutletGeom = new THREE.CylinderGeometry(1, 1, 5, 16);
    const richAmineOutlet = new THREE.Mesh(richAmineOutletGeom, steel);
    richAmineOutlet.rotation.z = Math.PI / 2;
    richAmineOutlet.position.set(6, 2, 0);
    group.add(richAmineOutlet);

    parts.push({
        name: "Rich Amine Outlet",
        description: "Exit point for the amine solution that has absorbed CO2.",
        material: "steel",
        function: "Drains the CO2-loaded 'rich' amine to be pumped to the regenerator.",
        assemblyOrder: 6,
        connections: ["Main Column Shell"],
        failureEffect: "Inability to remove liquid, causing flooding in the column.",
        cascadeFailures: ["Process shutdown", "Amine carried out with exhaust gas"],
        originalPosition: { x: 6, y: 2, z: 0 },
        explodedPosition: { x: 15, y: 2, z: 0 },
        mesh: richAmineOutlet
    });

    // ANIMATION MESHES (Particles)
    const gasParticlesGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const gasParticles = [];
    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(gasParticlesGeom, toxicGasMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 6,
            Math.random() * 30,
            (Math.random() - 0.5) * 6
        );
        group.add(particle);
        gasParticles.push(particle);
    }

    const amineDropsGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const amineDrops = [];
    for (let i = 0; i < 100; i++) {
        const drop = new THREE.Mesh(amineDropsGeom, liquidAmineMaterial);
        drop.position.set(
            (Math.random() - 0.5) * 7,
            Math.random() * 30,
            (Math.random() - 0.5) * 7
        );
        group.add(drop);
        amineDrops.push(drop);
    }

    // Assign meshes for animation logic
    const meshes = { gasParticles, amineDrops, liquidAmineMaterial, heatedAmineMaterial, toxicGasMaterial };

    const description = "The Amine Scrubber Column is the heart of a post-combustion Carbon Capture and Storage (CCS) system. Flue gas containing CO2 enters the bottom and flows upwards through structured packing. Simultaneously, a liquid amine solution (such as MEA) is sprayed from the top and cascades downwards. The amine chemically reacts with the CO2, absorbing it from the gas stream. The clean gas exits the top, while the 'rich' amine loaded with CO2 exits the bottom to be sent to a stripper/regenerator.";

    const quizQuestions = [
        {
            question: "What is the primary function of the structured packing beds inside the scrubber column?",
            options: [
                "To cool down the hot flue gas before it exits.",
                "To chemically react with the CO2.",
                "To maximize surface area and contact time between gas and liquid.",
                "To filter out particulate matter and ash."
            ],
            correct: 2,
            explanation: "Structured packing spreads the liquid amine into thin films, dramatically increasing the surface area for the rising CO2 gas to contact and react with the liquid.",
            difficulty: "Medium"
        },
        {
            question: "Why does the flue gas enter at the bottom while the liquid amine enters at the top?",
            options: [
                "To utilize gravity for liquid flow and buoyancy/pressure for gas flow, creating a counter-current exchange.",
                "Because the gas is heavier than the liquid.",
                "To prevent the column from overheating at the top.",
                "It is a random design choice; concurrent flow is just as effective."
            ],
            correct: 0,
            explanation: "This counter-current design ensures the cleanest gas at the top contacts the freshest amine, maximizing the concentration gradient and overall absorption efficiency.",
            difficulty: "Easy"
        },
        {
            question: "What is the term for the amine solution after it has absorbed CO2 and exits the bottom of the scrubber?",
            options: [
                "Lean Amine",
                "Rich Amine",
                "Regenerated Amine",
                "Stripped Amine"
            ],
            correct: 1,
            explanation: "The solution is called 'Rich Amine' because it is rich in dissolved/reacted carbon dioxide. It must then be heated in a regenerator to release the CO2 and become 'Lean Amine' again.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the amine distributor at the top fails and channels the liquid to only one side of the column?",
            options: [
                "The column will overpressurize and rupture.",
                "The amine will react twice as fast, improving efficiency.",
                "A large portion of the flue gas will pass through untreated, drastically lowering CO2 capture efficiency.",
                "The packing material will dissolve."
            ],
            correct: 2,
            explanation: "Maldistribution leads to 'channeling'. Gas will bypass the liquid, meaning less CO2 is absorbed and emissions will spike.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;
        const { gasParticles, amineDrops } = meshesObj;

        // Animate rising toxic flue gas (CO2)
        if (gasParticles) {
            gasParticles.forEach((particle, i) => {
                particle.position.y += 0.1 * speed;
                // Wiggle
                particle.position.x += Math.sin(time * 2 + i) * 0.05 * speed;
                particle.position.z += Math.cos(time * 2 + i) * 0.05 * speed;

                // Reset to bottom, color changes as it goes up (absorbing)
                if (particle.position.y > 28) {
                    particle.position.y = 4;
                    particle.material.emissiveIntensity = 0.8;
                } else {
                    // Gas gets 'cleaner' / less emissive as it rises
                    particle.material.emissiveIntensity = 0.8 * (1 - ((particle.position.y - 4) / 24));
                }
            });
        }

        // Animate falling liquid amine
        if (amineDrops) {
            amineDrops.forEach((drop, i) => {
                drop.position.y -= 0.15 * speed;
                
                // As it falls and absorbs CO2, it turns from Lean (Blue) to Rich (Purple/Pinkish)
                const fallRatio = (26 - drop.position.y) / 24; 
                
                if (drop.position.y < 2) {
                    drop.position.y = 26;
                    drop.material = meshesObj.liquidAmineMaterial; // Reset to blue
                } else if (fallRatio > 0.5) {
                    drop.material = meshesObj.heatedAmineMaterial; // Just swapping for visual effect of 'Rich'
                }
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createAmineScrubberColumn() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
