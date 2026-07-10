import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff2222,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const glowingPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });

    // 1. Carburetor Body (Main housing with Venturi)
    const bodyPoints = [];
    for (let i = 0; i <= 20; i++) {
        const y = (i / 20) * 10 - 5; // -5 to 5
        let x = 3;
        // Pinched in the middle (venturi)
        if (Math.abs(y) < 2) {
            x = 3 - 1.5 * Math.cos((y * Math.PI) / 4);
        }
        bodyPoints.push(new THREE.Vector2(x, y));
    }
    const bodyGeometry = new THREE.LatheGeometry(bodyPoints, 32);
    const bodyMesh = new THREE.Mesh(bodyGeometry, tinted); 
    bodyMesh.material.opacity = 0.5;
    bodyMesh.material.transparent = true;
    bodyMesh.name = 'CarburetorBody';
    group.add(bodyMesh);

    parts.push({
        name: 'Carburetor Body & Venturi',
        description: 'Main housing containing the air passage. The venturi is a narrowed section that accelerates air, creating low pressure according to Bernoulli\'s principle.',
        material: 'Aluminum / Transparent Shell',
        function: 'Channels air and houses the internal components. The venturi accelerates airflow to create a vacuum that pulls fuel from the float bowl.',
        assemblyOrder: 1,
        connections: ['Throttle Valve', 'Choke Valve', 'Main Jet'],
        failureEffect: 'Vacuum leaks cause a lean air-fuel mixture, resulting in poor performance or engine stalling.',
        cascadeFailures: ['Overheating', 'Engine Knock'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: bodyMesh
    });

    // 2. Throttle Valve (Butterfly Valve at the bottom)
    const throttleGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.1, 32);
    const throttleMesh = new THREE.Mesh(throttleGeometry, steel);
    throttleMesh.position.set(0, -3.5, 0);
    throttleMesh.name = 'ThrottleValve';
    group.add(throttleMesh);

    parts.push({
        name: 'Throttle Valve',
        description: 'A butterfly valve located downstream of the venturi, controlled by the accelerator pedal.',
        material: 'Steel',
        function: 'Regulates the amount of air-fuel mixture entering the engine cylinders, controlling engine RPM and power output.',
        assemblyOrder: 2,
        connections: ['Carburetor Body', 'Accelerator Linkage'],
        failureEffect: 'If stuck open, engine races uncontrollably. If stuck closed, engine cannot accelerate.',
        cascadeFailures: ['Loss of Control', 'Spark Plug Fouling'],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -7, z: 0 },
        mesh: throttleMesh
    });

    // 3. Choke Valve (Butterfly Valve at the top)
    const chokeGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.1, 32);
    const chokeMesh = new THREE.Mesh(chokeGeometry, darkSteel);
    chokeMesh.position.set(0, 3.5, 0);
    chokeMesh.name = 'ChokeValve';
    group.add(chokeMesh);

    parts.push({
        name: 'Choke Valve',
        description: 'A butterfly valve located upstream of the venturi, used during cold engine starts.',
        material: 'Dark Steel',
        function: 'Restricts air flow to create a richer fuel mixture (more fuel, less air) needed to start a cold engine.',
        assemblyOrder: 3,
        connections: ['Carburetor Body', 'Air Filter Assembly'],
        failureEffect: 'If stuck closed, engine runs too rich, wasting fuel and stalling. If stuck open, cold engine is difficult to start.',
        cascadeFailures: ['Carbon Buildup', 'Catalytic Converter Damage'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 },
        mesh: chokeMesh
    });

    // 4. Float Bowl
    const bowlGeometry = new THREE.BoxGeometry(4, 4, 4);
    const bowlMesh = new THREE.Mesh(bowlGeometry, aluminum);
    bowlMesh.position.set(5, -1, 0);
    bowlMesh.name = 'FloatBowl';
    group.add(bowlMesh);

    parts.push({
        name: 'Float Bowl',
        description: 'A reservoir that holds a constant level of fuel, similar to a toilet tank.',
        material: 'Aluminum',
        function: 'Ensures a steady supply of fuel at atmospheric pressure is available for the main jet.',
        assemblyOrder: 4,
        connections: ['Carburetor Body', 'Fuel Line'],
        failureEffect: 'Gasket leak causes fuel spill. Internal blockage starves the engine of fuel.',
        cascadeFailures: ['Fire Hazard', 'Engine Stalling'],
        originalPosition: { x: 5, y: -1, z: 0 },
        explodedPosition: { x: 10, y: -1, z: 0 },
        mesh: bowlMesh
    });

    // 5. Float
    const floatGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const floatMesh = new THREE.Mesh(floatGeometry, plastic);
    floatMesh.position.set(5, -1, 0);
    floatMesh.name = 'Float';
    group.add(floatMesh);

    parts.push({
        name: 'Float',
        description: 'A buoyant object riding on the fuel surface inside the float bowl.',
        material: 'Plastic/Brass',
        function: 'Moves up and down with the fuel level to open or close the needle valve, maintaining a constant fuel level.',
        assemblyOrder: 5,
        connections: ['Float Bowl', 'Needle Valve'],
        failureEffect: 'Punctured float sinks, flooding the carburetor and engine with fuel.',
        cascadeFailures: ['Hydro-lock', 'Washed Cylinders'],
        originalPosition: { x: 5, y: -1, z: 0 },
        explodedPosition: { x: 12, y: -3, z: 0 },
        mesh: floatMesh
    });

    // 6. Main Jet
    const jetGeometry = new THREE.CylinderGeometry(0.2, 0.4, 3, 16);
    const jetMesh = new THREE.Mesh(jetGeometry, copper);
    jetMesh.rotation.z = Math.PI / 2;
    jetMesh.position.set(2.5, 0, 0);
    jetMesh.name = 'MainJet';
    group.add(jetMesh);

    parts.push({
        name: 'Main Jet',
        description: 'A precision-machined brass tube connecting the float bowl to the venturi.',
        material: 'Copper/Brass',
        function: 'Meters the flow of fuel into the venturi vacuum stream.',
        assemblyOrder: 6,
        connections: ['Float Bowl', 'Carburetor Body'],
        failureEffect: 'Clogging from bad fuel or dirt causes engine to run lean, misfire, or stall.',
        cascadeFailures: ['Burnt Valves', 'Overheating'],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 3, z: 0 },
        mesh: jetMesh
    });

    // 7. Glowing Airflow Particles
    const airParticlesGeometry = new THREE.BufferGeometry();
    const airParticleCount = 200;
    const airPositions = new Float32Array(airParticleCount * 3);
    for (let i = 0; i < airParticleCount; i++) {
        airPositions[i * 3] = (Math.random() - 0.5) * 4;
        airPositions[i * 3 + 1] = 5 + Math.random() * 5; 
        airPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    airParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(airPositions, 3));
    const airMaterial = new THREE.PointsMaterial({
        color: 0x00aaff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const airParticles = new THREE.Points(airParticlesGeometry, airMaterial);
    airParticles.name = 'AirParticles';
    group.add(airParticles);

    // 8. Glowing Fuel Particles
    const fuelParticlesGeometry = new THREE.BufferGeometry();
    const fuelParticleCount = 100;
    const fuelPositions = new Float32Array(fuelParticleCount * 3);
    for (let i = 0; i < fuelParticleCount; i++) {
        fuelPositions[i * 3] = 2.5 - Math.random() * 1.5;
        fuelPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        fuelPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    fuelParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(fuelPositions, 3));
    const fuelMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.2,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const fuelParticles = new THREE.Points(fuelParticlesGeometry, fuelMaterial);
    fuelParticles.name = 'FuelParticles';
    group.add(fuelParticles);
    
    // 9. Mixture Particles
    const mixParticlesGeometry = new THREE.BufferGeometry();
    const mixParticleCount = 200;
    const mixPositions = new Float32Array(mixParticleCount * 3);
    for (let i = 0; i < mixParticleCount; i++) {
        mixPositions[i * 3] = (Math.random() - 0.5) * 5;
        mixPositions[i * 3 + 1] = 0 - Math.random() * 5;
        mixPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    mixParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(mixPositions, 3));
    const mixMaterial = new THREE.PointsMaterial({
        color: 0xaa00ff,
        size: 0.2,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const mixParticles = new THREE.Points(mixParticlesGeometry, mixMaterial);
    mixParticles.name = 'MixParticles';
    group.add(mixParticles);

    const description = "The Carburetor is an intricate mechanical device that blends air and fuel for an internal combustion engine. Operating entirely on fluid dynamics and pressure differentials, the 'venturi' effect accelerates incoming air to create a vacuum, which elegantly draws fuel from the float bowl through the main jet. It's a symphony of mechanical precision and fluid mechanics.";

    const quizQuestions = [
        {
            question: "What physical principle allows the carburetor to draw fuel into the air stream?",
            options: ["Archimedes' Principle", "Bernoulli's Principle", "Newton's Third Law", "Thermodynamic Expansion"],
            correct: 1,
            explanation: "Bernoulli's principle states that an increase in the speed of a fluid occurs simultaneously with a decrease in pressure. The venturi speeds up the air, creating a low-pressure zone that sucks fuel from the bowl.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Choke Valve?",
            options: ["To stop the engine entirely", "To control engine RPM during normal driving", "To restrict air and provide a richer fuel mixture for cold starts", "To filter impurities from the incoming air"],
            correct: 2,
            explanation: "The choke valve restricts airflow when the engine is cold, increasing the vacuum and pulling in a richer mixture of fuel, which is necessary because cold fuel doesn't vaporize well.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the float gets punctured and sinks?",
            options: ["The engine runs extremely lean", "The carburetor floods with fuel", "The throttle valve gets stuck closed", "Air stops entering the venturi"],
            correct: 1,
            explanation: "If the float sinks, it fails to close the needle valve. Fuel will continue to pour into the bowl and eventually flood the carburetor and the engine cylinders.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate Throttle Valve opening and closing
        const throttleOscillation = Math.sin(time * speed * 2) * 0.5 + 0.5; // 0 to 1
        if (meshes['ThrottleValve']) {
            meshes['ThrottleValve'].rotation.x = throttleOscillation * (Math.PI / 2.5);
        }

        // Animate Float bobbing
        const floatBob = Math.sin(time * speed * 5) * 0.1;
        if (meshes['Float']) {
            meshes['Float'].position.y = -1 + floatBob;
        }

        // Particle Animations
        if (meshes['AirParticles']) {
            const positions = meshes['AirParticles'].geometry.attributes.position.array;
            for (let i = 0; i < airParticleCount; i++) {
                positions[i * 3 + 1] -= speed * 15;
                const y = positions[i * 3 + 1];
                let radius = 2.5;
                if (Math.abs(y) < 2) {
                    radius = 2.5 - 1.5 * Math.cos((y * Math.PI) / 4);
                }
                
                const x = positions[i*3];
                const z = positions[i*3+2];
                const currentRadius = Math.sqrt(x*x + z*z);
                if (currentRadius > radius) {
                    positions[i*3] *= (radius / currentRadius);
                    positions[i*3+2] *= (radius / currentRadius);
                }

                if (positions[i * 3 + 1] < 0) {
                    positions[i * 3 + 1] = 5 + Math.random() * 2;
                    positions[i * 3] = (Math.random() - 0.5) * 4;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
                }
            }
            meshes['AirParticles'].geometry.attributes.position.needsUpdate = true;
        }

        if (meshes['FuelParticles']) {
            const positions = meshes['FuelParticles'].geometry.attributes.position.array;
            const suctionSpeed = speed * (10 + throttleOscillation * 20);
            for (let i = 0; i < fuelParticleCount; i++) {
                positions[i * 3] -= suctionSpeed * 0.5;
                
                if (positions[i * 3] < 0) {
                    positions[i * 3] = 2.5;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
                }
            }
            meshes['FuelParticles'].geometry.attributes.position.needsUpdate = true;
        }
        
        if (meshes['MixParticles']) {
            const positions = meshes['MixParticles'].geometry.attributes.position.array;
            const mixSpeed = speed * (15 + throttleOscillation * 25);
            for (let i = 0; i < mixParticleCount; i++) {
                positions[i * 3 + 1] -= mixSpeed;
                positions[i * 3] += (Math.random() - 0.5) * 0.1;
                positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
                
                if (positions[i * 3 + 1] < -6) {
                    positions[i * 3 + 1] = 0;
                    positions[i * 3] = (Math.random() - 0.5) * 1.5;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
                }
            }
            meshes['MixParticles'].geometry.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCarburetor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
