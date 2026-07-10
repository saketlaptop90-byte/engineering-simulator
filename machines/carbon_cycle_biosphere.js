import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech/Neon Materials
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
    });

    const darkSmoke = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0x111111,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
    });

    const bioGlass = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const cyberBark = new THREE.MeshStandardMaterial({
        color: 0x4a3b22,
        roughness: 0.9,
        metalness: 0.3,
    });

    // 1. Bio-Dome Base
    const baseGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -0.25, 0);
    group.add(base);
    parts.push({
        name: "Cybernetic Substrate Base",
        description: "Foundational platform simulating planetary crust. Houses root sensors and geological storage systems.",
        material: "darkSteel",
        function: "Supports the biosphere and acts as a massive long-term carbon sink.",
        assemblyOrder: 1,
        connections: ["Bio-Dome Enclosure", "Cyber-Tree Trunk"],
        failureEffect: "Structural collapse of the simulated biosphere.",
        cascadeFailures: ["Complete System Failure"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: base
    });

    // 2. Bio-Dome Enclosure
    const domeGeo = new THREE.SphereGeometry(4.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, bioGlass);
    dome.position.set(0, 0, 0);
    group.add(dome);
    parts.push({
        name: "Atmospheric Bio-Dome Enclosure",
        description: "Nanotech glass dome containing the localized cyber-atmosphere.",
        material: "bioGlass",
        function: "Maintains atmospheric conditions and securely contains greenhouse gas particles.",
        assemblyOrder: 2,
        connections: ["Cybernetic Substrate Base"],
        failureEffect: "Atmospheric venting, immediate loss of CO2 containment.",
        cascadeFailures: ["Flora Asphyxiation", "Particle Dispersion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: dome
    });

    // 3. Cyber-Tree Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 16);
    const trunk = new THREE.Mesh(trunkGeo, cyberBark);
    trunk.position.set(0, 2, 0);
    group.add(trunk);
    parts.push({
        name: "Central Cyber-Tree Trunk",
        description: "Main structural and vascular support for the cybernetic flora.",
        material: "cyberBark",
        function: "Transports captured carbon from the foliage to the geological substrate sink.",
        assemblyOrder: 3,
        connections: ["Cybernetic Substrate Base", "Photonic Absorption Foliage"],
        failureEffect: "Cessation of vertical carbon transport.",
        cascadeFailures: ["Atmospheric Toxicity", "Photosynthetic Shutdown"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -3, y: 2, z: 0 },
        mesh: trunk
    });

    // 4. Neon Foliage (Leaves)
    const foliageGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const foliage = new THREE.Mesh(foliageGeo, neonGreen);
    foliage.position.set(0, 4.5, 0);
    group.add(foliage);
    parts.push({
        name: "Photonic Absorption Foliage",
        description: "High-tech synthetic canopy that aggressively filters CO2.",
        material: "neonGreen",
        function: "Performs artificial photosynthesis, scrubbing the ambient air.",
        assemblyOrder: 4,
        connections: ["Central Cyber-Tree Trunk"],
        failureEffect: "Critical loss of CO2 scrubbing capability.",
        cascadeFailures: ["Runaway Greenhouse Effect"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: -4, y: 6, z: 0 },
        mesh: foliage
    });

    // 5. Industrial Emitter
    const factoryGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const factory = new THREE.Mesh(factoryGeo, darkSteel);
    factory.position.set(2.5, 1, 2.5);
    group.add(factory);
    parts.push({
        name: "Anthropogenic Emission Node",
        description: "Simulation of an industrial sector emitting high levels of carbon.",
        material: "darkSteel",
        function: "Continuously injects simulated CO2 particles into the enclosed dome.",
        assemblyOrder: 5,
        connections: ["Cybernetic Substrate Base", "Exhaust Stack"],
        failureEffect: "Cessation of simulated anthropogenic emissions.",
        cascadeFailures: ["Ecosystem Carbon Starvation (Long Term)"],
        originalPosition: { x: 2.5, y: 1, z: 2.5 },
        explodedPosition: { x: 6, y: 1, z: 6 },
        mesh: factory
    });

    // 6. Emitter Stack
    const stackGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.5, 16);
    const stack = new THREE.Mesh(stackGeo, chrome);
    stack.position.set(2.5, 2.75, 2.5);
    group.add(stack);
    parts.push({
        name: "Exhaust Stack",
        description: "Chimney structure venting raw simulated pollutants.",
        material: "chrome",
        function: "Directs emitted carbon aerosols into the upper dome atmosphere.",
        assemblyOrder: 6,
        connections: ["Anthropogenic Emission Node"],
        failureEffect: "Blockage of emissions.",
        cascadeFailures: ["Internal Factory Overpressure"],
        originalPosition: { x: 2.5, y: 2.75, z: 2.5 },
        explodedPosition: { x: 6, y: 4, z: 6 },
        mesh: stack
    });

    // 7. Ocean Sink
    const oceanGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const ocean = new THREE.Mesh(oceanGeo, neonBlue);
    ocean.position.set(-2, 0.1, -2);
    group.add(ocean);
    parts.push({
        name: "Synthetic Hydrosphere",
        description: "A compact oceanic simulation module acting as a secondary carbon sink.",
        material: "neonBlue",
        function: "Absorbs ambient atmospheric CO2 through aggressive surface exchange.",
        assemblyOrder: 7,
        connections: ["Cybernetic Substrate Base"],
        failureEffect: "Ocean acidification simulation maxed out; absorption halts.",
        cascadeFailures: ["Secondary Sink Failure"],
        originalPosition: { x: -2, y: 0.1, z: -2 },
        explodedPosition: { x: -6, y: 0.1, z: -6 },
        mesh: ocean
    });

    // CO2 Particles Array Setup
    const co2Particles = [];
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    for (let i = 0; i < 30; i++) {
        const particle = new THREE.Mesh(particleGeo, darkSmoke);
        particle.position.set(2.5, 3.5, 2.5); 
        group.add(particle);
        co2Particles.push({
            mesh: particle,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            state: 'emitting' // States: 'emitting', 'atmospheric', 'absorbing_tree', 'absorbing_ocean'
        });
    }

    const description = "The Carbon Cycle Biosphere is a state-of-the-art simulation module demonstrating the delicate balance of global climate mechanics. It visually juxtaposes aggressive anthropogenic industrial emissions against the mitigating effects of natural carbon sinks, utilizing high-tech cybernetic flora and a synthetic hydrosphere.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Photonic Absorption Foliage in this model?",
            options: [
                "To generate anthropogenic emissions",
                "To simulate oceanic surface exchange",
                "To perform artificial photosynthesis and scrub CO2 from the air",
                "To act as a foundational platform for the biosphere"
            ],
            correct: 2,
            explanation: "The Photonic Absorption Foliage represents natural terrestrial sinks like forests, which take in CO2 through photosynthesis, acting as a critical carbon sink.",
            difficulty: "easy"
        },
        {
            question: "In the global carbon cycle, what does the Synthetic Hydrosphere primarily represent?",
            options: [
                "Industrial pollution and toxic runoff",
                "The ocean's critical role as a major carbon sink",
                "The Earth's geological substrate",
                "The upper atmospheric boundaries"
            ],
            correct: 1,
            explanation: "The ocean is the largest carbon sink on Earth, absorbing roughly a quarter of the CO2 emissions humans produce globally.",
            difficulty: "medium"
        },
        {
            question: "What occurs dynamically if the Anthropogenic Emission Node's output significantly outpaces the absorption capabilities of both the cyber-flora and hydrosphere?",
            options: [
                "Carbon equilibrium is safely maintained",
                "Global cooling occurs due to blocked sunlight from smog",
                "Atmospheric CO2 levels drop",
                "Atmospheric CO2 accumulates, potentially driving a runaway greenhouse effect"
            ],
            correct: 3,
            explanation: "When emissions exceed natural sink capacities, CO2 rapidly accumulates in the atmosphere, trapping heat and driving severe global climate change.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed) {
        // Animate Foliage Breathing Effect
        foliage.scale.setScalar(1 + Math.sin(time * 2 * speed) * 0.03);
        foliage.material.emissiveIntensity = 0.8 + Math.sin(time * 4 * speed) * 0.2;

        // Animate Oceanic Waves
        ocean.scale.set(1 + Math.sin(time * speed) * 0.05, 1, 1 + Math.cos(time * speed) * 0.05);

        // Animate Factory Stack Intensity
        stack.material.emissiveIntensity = 0.2 + Math.abs(Math.sin(time * 5 * speed)) * 0.5;

        // Animate Global CO2 Particle Lifecycle
        co2Particles.forEach((p) => {
            if (p.state === 'emitting') {
                p.mesh.position.y += p.speed * 0.05 * speed;
                p.mesh.position.x += (Math.random() - 0.5) * 0.05;
                p.mesh.position.z += (Math.random() - 0.5) * 0.05;
                
                if (p.mesh.position.y > 4.2) {
                    p.state = 'atmospheric';
                }
            } else if (p.state === 'atmospheric') {
                // Swirl particles around the atmospheric dome
                const angle = time * p.speed * 0.5 * speed + p.phase;
                const radius = 2.5 + Math.sin(time * 0.5 + p.phase) * 1.5;
                p.mesh.position.x = Math.cos(angle) * radius;
                p.mesh.position.z = Math.sin(angle) * radius;
                p.mesh.position.y = 3 + Math.sin(time * p.speed + p.phase) * 1.5;

                // Randomly trigger absorption into a sink
                if (Math.random() < 0.005 * speed) {
                    p.state = Math.random() > 0.5 ? 'absorbing_tree' : 'absorbing_ocean';
                }
            } else if (p.state === 'absorbing_tree') {
                // Draw particle towards the cyber-tree foliage
                p.mesh.position.lerp(new THREE.Vector3(0, 4.5, 0), 0.05 * speed);
                if (p.mesh.position.distanceTo(new THREE.Vector3(0, 4.5, 0)) < 0.5) {
                    p.state = 'emitting'; // Recycle back to factory
                    p.mesh.position.set(2.5, 3.5, 2.5);
                }
            } else if (p.state === 'absorbing_ocean') {
                // Draw particle towards the ocean surface
                p.mesh.position.lerp(new THREE.Vector3(-2, 0.1, -2), 0.05 * speed);
                if (p.mesh.position.distanceTo(new THREE.Vector3(-2, 0.1, -2)) < 0.5) {
                    p.state = 'emitting'; // Recycle back to factory
                    p.mesh.position.set(2.5, 3.5, 2.5);
                }
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCarbonCycleBiosphere() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
