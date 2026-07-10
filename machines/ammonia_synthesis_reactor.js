import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Materials
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingCatalyst = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff4400,
        emissiveIntensity: 0.6,
        roughness: 0.9,
        metalness: 0.1
    });

    const highPressureGlass = new THREE.MeshPhysicalMaterial({
        color: 0x2244ff,
        transmission: 0.9,
        opacity: 0.5,
        metalness: 0.1,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });
    
    const energyBeam = new THREE.MeshBasicMaterial({
        color: 0x55ff55,
        transparent: true,
        opacity: 0.6
    });

    // Outer Pressure Vessel
    const vesselGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const vessel = new THREE.Mesh(vesselGeo, darkSteel);
    vessel.position.set(0, 5, 0);
    group.add(vessel);
    parts.push({
        name: "Outer Pressure Vessel",
        description: "Thick steel shell capable of withstanding 150-300 atmospheres of pressure.",
        material: "darkSteel",
        function: "Contains the high-pressure, high-temperature reaction.",
        assemblyOrder: 1,
        connections: ["Gas Inlet", "Gas Outlet"],
        failureEffect: "Catastrophic depressurization and explosion.",
        cascadeFailures: ["Complete system destruction"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -6, y: 5, z: 0 }
    });

    // Observation Port
    const windowGeo = new THREE.CylinderGeometry(2.05, 2.05, 8, 16, 1, false, Math.PI * 0.25, Math.PI * 0.5);
    const windowMesh = new THREE.Mesh(windowGeo, highPressureGlass);
    windowMesh.position.set(0, 5, 0);
    group.add(windowMesh);
    parts.push({
        name: "Observation Port",
        description: "Reinforced transparent port for internal monitoring.",
        material: "highPressureGlass",
        function: "Visual inspection of glowing catalyst beds.",
        assemblyOrder: 2,
        connections: ["Outer Pressure Vessel"],
        failureEffect: "High-pressure gas leak.",
        cascadeFailures: ["Vessel depressurization"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -6, y: 5, z: 4 }
    });

    // Catalyst Bed 1 (Top)
    const catBed1Geo = new THREE.CylinderGeometry(1.6, 1.6, 2, 32);
    const catBed1 = new THREE.Mesh(catBed1Geo, glowingCatalyst);
    catBed1.position.set(0, 8, 0);
    group.add(catBed1);
    parts.push({
        name: "Catalyst Bed 1",
        description: "First layer of iron-based catalyst.",
        material: "glowingCatalyst",
        function: "Initial conversion of N2 and H2 to NH3. High heat generation.",
        assemblyOrder: 3,
        connections: ["Gas Inlet", "Inter-bed Quench 1"],
        failureEffect: "Reduced conversion efficiency.",
        cascadeFailures: ["Overheating of subsequent beds"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // Inter-bed Quench 1
    const quench1Geo = new THREE.TorusGeometry(1.4, 0.2, 16, 32);
    const quench1 = new THREE.Mesh(quench1Geo, neonCyan);
    quench1.position.set(0, 6.7, 0);
    quench1.rotation.x = Math.PI / 2;
    group.add(quench1);
    parts.push({
        name: "Quench Gas Injector 1",
        description: "Injects cold reactant gas to cool the mixture.",
        material: "neonCyan",
        function: "Controls temperature to maintain thermodynamic equilibrium favoring NH3.",
        assemblyOrder: 4,
        connections: ["Catalyst Bed 1", "Catalyst Bed 2"],
        failureEffect: "Thermal runaway in bed 2.",
        cascadeFailures: ["Catalyst sintering", "Vessel overheating"],
        originalPosition: { x: 0, y: 6.7, z: 0 },
        explodedPosition: { x: 4, y: 8, z: 0 }
    });

    // Catalyst Bed 2 (Middle)
    const catBed2Geo = new THREE.CylinderGeometry(1.6, 1.6, 2.5, 32);
    const catBed2 = new THREE.Mesh(catBed2Geo, glowingCatalyst);
    catBed2.position.set(0, 5, 0);
    group.add(catBed2);
    parts.push({
        name: "Catalyst Bed 2",
        description: "Second, larger layer of iron-based catalyst.",
        material: "glowingCatalyst",
        function: "Further conversion of reactants as equilibrium shifts.",
        assemblyOrder: 5,
        connections: ["Inter-bed Quench 1", "Inter-bed Quench 2"],
        failureEffect: "Lower overall yield.",
        cascadeFailures: ["Increased load on recycle loop"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 6 }
    });

    // Inter-bed Quench 2
    const quench2Geo = new THREE.TorusGeometry(1.4, 0.2, 16, 32);
    const quench2 = new THREE.Mesh(quench2Geo, neonCyan);
    quench2.position.set(0, 3.4, 0);
    quench2.rotation.x = Math.PI / 2;
    group.add(quench2);
    parts.push({
        name: "Quench Gas Injector 2",
        description: "Second temperature control injection point.",
        material: "neonCyan",
        function: "Cools gas before final catalyst bed.",
        assemblyOrder: 6,
        connections: ["Catalyst Bed 2", "Catalyst Bed 3"],
        failureEffect: "Overheating in bed 3.",
        cascadeFailures: ["Catalyst deactivation"],
        originalPosition: { x: 0, y: 3.4, z: 0 },
        explodedPosition: { x: -4, y: 3.4, z: -4 }
    });

    // Catalyst Bed 3 (Bottom)
    const catBed3Geo = new THREE.CylinderGeometry(1.6, 1.6, 3, 32);
    const catBed3 = new THREE.Mesh(catBed3Geo, glowingCatalyst);
    catBed3.position.set(0, 1.5, 0);
    group.add(catBed3);
    parts.push({
        name: "Catalyst Bed 3",
        description: "Final and largest catalyst bed.",
        material: "glowingCatalyst",
        function: "Pushes the reaction to maximum possible conversion (approx 15%).",
        assemblyOrder: 7,
        connections: ["Inter-bed Quench 2", "Heat Exchanger"],
        failureEffect: "Poor final conversion.",
        cascadeFailures: ["High separation costs"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 6 }
    });

    // Internal Heat Exchanger
    const exchangerGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    const exchanger = new THREE.Mesh(exchangerGeo, chrome);
    exchanger.position.set(0, -1, 0);
    group.add(exchanger);
    parts.push({
        name: "Internal Heat Exchanger",
        description: "Preheats incoming gas using hot outgoing gas.",
        material: "chrome",
        function: "Improves thermal efficiency of the reactor.",
        assemblyOrder: 8,
        connections: ["Catalyst Bed 3", "Gas Outlet", "Gas Inlet"],
        failureEffect: "Loss of thermal efficiency.",
        cascadeFailures: ["Reaction drops below activation temperature"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });
    
    // Animated Particles System (Reactants/Products flow)
    const particleCount = 300;
    const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const particleInstanced = new THREE.InstancedMesh(particleGeo, energyBeam, particleCount);
    
    const dummy = new THREE.Object3D();
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 2.8;
        const y = Math.random() * 10;
        const z = (Math.random() - 0.5) * 2.8;
        
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        particleInstanced.setMatrixAt(i, dummy.matrix);
        
        particleData.push({
            speed: 0.02 + Math.random() * 0.03,
            initialY: y
        });
    }
    group.add(particleInstanced);
    
    parts.push({
        name: "Reactant/Product Gas Flow",
        description: "Visualization of gas flowing through the reactor.",
        material: "energyBeam",
        function: "Shows the continuous flow of Nitrogen, Hydrogen, and Ammonia.",
        assemblyOrder: 9,
        connections: ["Catalyst Bed 1", "Catalyst Bed 2", "Catalyst Bed 3"],
        failureEffect: "Blockage of gas flow.",
        cascadeFailures: ["Pressure build-up"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 6, y: 5, z: 0 }
    });

    const description = "The Ammonia Synthesis Reactor is the heart of the Haber-Bosch process. It combines Nitrogen (N2) and Hydrogen (H2) gases under extreme pressure (150-300 atm) and temperature (400-500°C) over an iron catalyst to produce Ammonia (NH3). The reaction is exothermic, requiring careful temperature control via quench gases between catalyst beds to maintain the delicate thermodynamic equilibrium.";

    const quizQuestions = [
        {
            question: "Why is an iron catalyst necessary in the Haber-Bosch process?",
            options: [
                "To shift the thermodynamic equilibrium towards ammonia",
                "To lower the activation energy and increase the reaction rate",
                "To increase the pressure of the system",
                "To cool the reactor down"
            ],
            correct: 1,
            explanation: "Nitrogen has a very strong triple bond. The iron catalyst lowers the activation energy required to break this bond, allowing the reaction to proceed at a reasonable rate at lower temperatures.",
            difficulty: "Medium"
        },
        {
            question: "The synthesis of ammonia is an exothermic reaction (releases heat). According to Le Chatelier's principle, how does temperature affect the equilibrium yield of ammonia?",
            options: [
                "Higher temperatures increase the yield",
                "Temperature has no effect on the yield",
                "Lower temperatures increase the equilibrium yield",
                "Higher temperatures only affect the pressure, not yield"
            ],
            correct: 2,
            explanation: "Because the reaction is exothermic, lower temperatures shift the equilibrium to the right, favoring ammonia production. However, lower temperatures also slow the reaction rate, so a compromise temperature of 400-500°C is used.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary purpose of the inter-bed quench injectors in this reactor design?",
            options: [
                "To inject more catalyst into the system",
                "To introduce oxygen to burn impurities",
                "To cool the hot reacting gases between catalyst beds",
                "To extract liquid ammonia directly from the beds"
            ],
            correct: 2,
            explanation: "The reaction releases heat, which raises the gas temperature. High temperatures reduce the equilibrium conversion to ammonia. Injecting cool reactant gas (quench) lowers the temperature before the next bed, improving overall yield.",
            difficulty: "Medium"
        }
    ];

    let timeObj = { value: 0 };

    const animate = (time, speed, meshes) => {
        timeObj.value += speed * 0.01;
        
        // Pulsate glowing catalyst beds based on "reaction intensity"
        const pulse = (Math.sin(timeObj.value * 3) + 1) / 2;
        catBed1.material.emissiveIntensity = 0.5 + pulse * 0.4;
        catBed2.material.emissiveIntensity = 0.4 + pulse * 0.3;
        catBed3.material.emissiveIntensity = 0.3 + pulse * 0.2;
        
        // Rotate quench gas rings to simulate injection flow
        quench1.rotation.z += 0.03 * speed;
        quench2.rotation.z -= 0.03 * speed;

        // Flow particles downwards through the reactor
        for (let i = 0; i < particleCount; i++) {
            particleInstanced.getMatrixAt(i, dummy.matrix);
            dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            
            dummy.position.y -= particleData[i].speed * speed;
            
            // Loop particles back to the top
            if (dummy.position.y < -1.5) {
                dummy.position.y = 9.5;
            }
            
            dummy.updateMatrix();
            particleInstanced.setMatrixAt(i, dummy.matrix);
        }
        particleInstanced.instanceMatrix.needsUpdate = true;
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAmmoniaSynthesisReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
