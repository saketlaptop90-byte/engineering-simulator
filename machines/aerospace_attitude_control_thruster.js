import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material for plasma/exhaust
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
    });
    
    const heatShieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1,
    });

    const catalystMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // platinum/iridium mesh look
        roughness: 0.8,
        metalness: 0.5,
        wireframe: true
    });

    // 1. Mounting Bracket
    const bracketGeo = new THREE.BoxGeometry(1.5, 0.2, 1.5);
    const bracketMesh = new THREE.Mesh(bracketGeo, steel);
    bracketMesh.position.set(0, 0, 0);
    group.add(bracketMesh);
    parts.push({
        name: 'Mounting Bracket',
        description: 'Titanium mounting bracket that attaches the thruster assembly to the spacecraft bus.',
        material: steel,
        function: 'Structural support and thermal isolation.',
        assemblyOrder: 1,
        connections: ['Propellant Valve', 'Spacecraft Frame'],
        failureEffect: 'Misalignment of thrust vector.',
        cascadeFailures: ['Loss of attitude control'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: bracketMesh
    });

    // 2. Propellant Valve (Solenoid)
    const valveGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const valveMesh = new THREE.Mesh(valveGeo, copper);
    valveMesh.rotation.x = Math.PI / 2;
    valveMesh.position.set(0, 0.5, 0);
    group.add(valveMesh);
    parts.push({
        name: 'Solenoid Propellant Valve',
        description: 'Electromagnetically actuated valve to control the flow of hydrazine propellant.',
        material: copper,
        function: 'Precisely pulses propellant flow for micro-adjustments.',
        assemblyOrder: 2,
        connections: ['Mounting Bracket', 'Catalyst Bed'],
        failureEffect: 'Valve stuck open or closed.',
        cascadeFailures: ['Depletion of propellant', 'Uncontrollable spin'],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -2 },
        mesh: valveMesh
    });

    // 3. Catalyst Bed
    const catalystBedGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    const catalystBedMesh = new THREE.Mesh(catalystBedGeo, catalystMaterial);
    catalystBedMesh.position.set(0, 1.5, 0);
    group.add(catalystBedMesh);
    parts.push({
        name: 'Catalyst Bed',
        description: 'Chamber packed with Iridium-coated alumina granules to decompose the hydrazine.',
        material: catalystMaterial,
        function: 'Exothermic decomposition of monopropellant into hot gas.',
        assemblyOrder: 3,
        connections: ['Propellant Valve', 'Combustion Chamber'],
        failureEffect: 'Incomplete decomposition.',
        cascadeFailures: ['Loss of thrust efficiency', 'Toxic propellant leak'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 2, y: 1.5, z: 0 },
        mesh: catalystBedMesh
    });

    // 4. Combustion Chamber / Expansion Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.4, 0.8, 1.5, 32, 1, true);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, darkSteel);
    nozzleMesh.position.set(0, 2.85, 0);
    group.add(nozzleMesh);
    parts.push({
        name: 'Expansion Nozzle',
        description: 'High-temperature alloy nozzle shaped to accelerate exhaust gases to supersonic speeds.',
        material: darkSteel,
        function: 'Converts thermal energy of decomposed gas into kinetic energy (thrust).',
        assemblyOrder: 4,
        connections: ['Catalyst Bed'],
        failureEffect: 'Thermal degradation or burn-through.',
        cascadeFailures: ['Asymmetric thrust', 'Catastrophic thruster disintegration'],
        originalPosition: { x: 0, y: 2.85, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: nozzleMesh
    });

    // 5. Thermal Standoffs (Heaters)
    const heaterGeo = new THREE.TorusGeometry(0.45, 0.05, 16, 100);
    const heaterMesh = new THREE.Mesh(heaterGeo, chrome);
    heaterMesh.rotation.x = Math.PI / 2;
    heaterMesh.position.set(0, 1.5, 0);
    group.add(heaterMesh);
    parts.push({
        name: 'Catalyst Bed Heaters',
        description: 'Electric heating coils wrapped around the catalyst bed.',
        material: chrome,
        function: 'Pre-heats catalyst to operating temperature to ensure rapid and complete propellant decomposition during cold starts.',
        assemblyOrder: 5,
        connections: ['Catalyst Bed'],
        failureEffect: 'Cold start failure.',
        cascadeFailures: ['Catalyst bed poisoning', 'Delayed thrust response'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: -2, y: 1.5, z: 0 },
        mesh: heaterMesh
    });

    // 6. Exhaust Plume (Visual Effect)
    const plumeGeo = new THREE.ConeGeometry(0.7, 3, 32);
    const plumeMesh = new THREE.Mesh(plumeGeo, plasmaMaterial);
    plumeMesh.position.set(0, 4.5, 0);
    plumeMesh.visible = false; // Initially off
    group.add(plumeMesh);
    parts.push({
        name: 'Exhaust Plume',
        description: 'High-velocity gas expanding into vacuum.',
        material: plasmaMaterial,
        function: 'Provides the reaction force.',
        assemblyOrder: 6,
        connections: ['Expansion Nozzle'],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: plumeMesh
    });

    const description = "The Aerospace Attitude Control Thruster (Reaction Control System) is critical for spacecraft orientation. This monopropellant hydrazine thruster uses a solenoid valve to pulse propellant over an Iridium catalyst, creating an exothermic decomposition that expands through a converging-diverging nozzle to produce precise bursts of thrust.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Catalyst Bed in a monopropellant hydrazine thruster?",
            options: [
                "To cool the expanding gases",
                "To electromagnetically accelerate ions",
                "To cause the exothermic decomposition of the propellant",
                "To regulate the flow rate of the propellant"
            ],
            correct: 2,
            explanation: "The catalyst bed, typically coated in Iridium, spontaneously decomposes hydrazine into hot nitrogen and ammonia gas, generating the pressure needed for thrust without requiring an oxidizer.",
            difficulty: "Medium"
        },
        {
            question: "Why are Catalyst Bed Heaters necessary?",
            options: [
                "To prevent the propellant from freezing in the feed lines",
                "To pre-heat the catalyst to ensure rapid and complete decomposition upon cold starts",
                "To increase the specific impulse by adding thermal energy",
                "To keep the solenoid valve from sticking"
            ],
            correct: 1,
            explanation: "Hydrazine decomposition is sluggish on cold catalyst beds. Pre-heating ensures the reaction starts immediately and prevents liquid hydrazine from washing out or 'poisoning' the catalyst.",
            difficulty: "Hard"
        },
        {
            question: "Which component is responsible for controlling the precise duration of a thrust pulse?",
            options: [
                "Expansion Nozzle",
                "Catalyst Bed",
                "Mounting Bracket",
                "Solenoid Propellant Valve"
            ],
            correct: 3,
            explanation: "The solenoid valve can open and close in milliseconds, precisely controlling the amount of propellant entering the catalyst bed and thus the duration and magnitude of the thrust pulse.",
            difficulty: "Easy"
        }
    ];

    let pulseTimer = 0;

    function animate(time, speed, meshes) {
        // Animate the pulsing of the thruster
        pulseTimer += time * speed * 2;
        
        const plumePart = parts.find(p => p.name === 'Exhaust Plume');
        if (plumePart && plumePart.mesh) {
            // Simulated pulsing logic: on for a bit, off for a bit
            const pulseCycle = pulseTimer % 2; // 0 to 2 seconds
            
            if (pulseCycle < 0.2) {
                // Firing burst
                plumePart.mesh.visible = true;
                // Flicker effect
                plumePart.mesh.scale.set(
                    1 + Math.random() * 0.1, 
                    1 + Math.random() * 0.3, 
                    1 + Math.random() * 0.1
                );
                // Heat up the nozzle
                const nozzlePart = parts.find(p => p.name === 'Expansion Nozzle');
                if (nozzlePart && nozzlePart.mesh) {
                    nozzlePart.mesh.material.emissive = new THREE.Color(0xff4400);
                    nozzlePart.mesh.material.emissiveIntensity = 0.5 + Math.random() * 0.2;
                }
            } else {
                // Off
                plumePart.mesh.visible = false;
                
                // Cool down the nozzle
                const nozzlePart = parts.find(p => p.name === 'Expansion Nozzle');
                if (nozzlePart && nozzlePart.mesh) {
                    nozzlePart.mesh.material.emissiveIntensity *= 0.95; // fade out
                }
            }
        }
        
        // Spin the entire assembly slightly for better view
        group.rotation.y += 0.005 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAttitudeControlThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
