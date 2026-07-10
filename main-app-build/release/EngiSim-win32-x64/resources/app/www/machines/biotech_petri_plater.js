import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const agarGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });
    
    const neonAccent = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.0
    });
    
    const uvLight = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6
    });

    const createPart = (name, geometry, material, position, explodedPosition, properties) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.userData = { 
            name,
            originalPosition: position.clone(),
            explodedPosition: explodedPosition.clone()
        };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        parts.push({
            name,
            mesh,
            ...properties,
            originalPosition: position,
            explodedPosition
        });
        return mesh;
    };

    // 1. Base Housing
    const baseGeo = new THREE.BoxGeometry(10, 1, 8);
    createPart('Base Housing', baseGeo, darkSteel, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -5, 0), {
        description: 'Main structural chassis housing electronics and motors.',
        material: 'Dark Steel',
        function: 'Provides stability and houses critical components.',
        assemblyOrder: 1,
        connections: ['Power Supply', 'Carousel Motor'],
        failureEffect: 'Structural instability',
        cascadeFailures: ['Misalignment of dispensing head', 'Carousel jam']
    });

    // 2. Carousel Motor
    const motorGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    createPart('Stepper Motor', motorGeo, copper, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -2, -3), {
        description: 'High-torque stepper motor for precise rotational indexing.',
        material: 'Copper/Steel',
        function: 'Drives the rotary carousel positioning petri dishes.',
        assemblyOrder: 2,
        connections: ['Base Housing', 'Rotary Carousel'],
        failureEffect: 'Carousel fails to rotate',
        cascadeFailures: ['Agar dispensed in wrong location']
    });

    // 3. Rotary Carousel
    const carouselGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
    createPart('Rotary Carousel', carouselGeo, aluminum, new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, 3, -6), {
        description: 'Rotating platform that holds multiple petri dishes.',
        material: 'Anodized Aluminum',
        function: 'Advances dishes to the dispensing station.',
        assemblyOrder: 3,
        connections: ['Stepper Motor', 'Petri Dishes'],
        failureEffect: 'Jammed rotation',
        cascadeFailures: ['Stepper motor stall', 'Missed plates']
    });

    // 4. Petri Dishes (Group of 4)
    const dishGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    for(let i=0; i<4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        createPart(`Petri Dish ${i+1}`, dishGeo, glass, new THREE.Vector3(x, 2.2, z), new THREE.Vector3(x*2, 5, z*2), {
            description: 'Standard 90mm glass petri dish for culturing.',
            material: 'Borosilicate Glass',
            function: 'Receptacle for growth media and biological samples.',
            assemblyOrder: 4,
            connections: ['Rotary Carousel'],
            failureEffect: 'Dish fracture',
            cascadeFailures: ['Agar leak', 'Contamination']
        });
    }

    // 5. Dispensing Tower
    const towerGeo = new THREE.BoxGeometry(1, 6, 1);
    createPart('Dispensing Tower', towerGeo, steel, new THREE.Vector3(4, 3, 0), new THREE.Vector3(8, 4, 0), {
        description: 'Vertical support for the agar dispensing head.',
        material: 'Stainless Steel',
        function: 'Positions the dispensing nozzle over the active dish.',
        assemblyOrder: 5,
        connections: ['Base Housing', 'Peristaltic Pump'],
        failureEffect: 'Tower misalignment',
        cascadeFailures: ['Agar spills outside dish']
    });

    // 6. Peristaltic Pump
    const pumpGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    pumpGeo.rotateX(Math.PI/2);
    createPart('Peristaltic Pump', pumpGeo, chrome, new THREE.Vector3(4, 5, 1), new THREE.Vector3(10, 6, 2), {
        description: 'Precision pump that displaces fluid without contamination.',
        material: 'Chrome/Rubber',
        function: 'Meters exact volumes of molten agar.',
        assemblyOrder: 6,
        connections: ['Dispensing Tower', 'Fluid Tubing'],
        failureEffect: 'Inaccurate volume dispensed',
        cascadeFailures: ['Overfilled or underfilled plates']
    });

    // 7. Fluid Tubing (Neon)
    const tubeGeo = new THREE.TorusGeometry(1, 0.1, 8, 24, Math.PI);
    tubeGeo.rotateY(Math.PI/2);
    createPart('Silicone Tubing', tubeGeo, neonAccent, new THREE.Vector3(4, 4, 1.5), new THREE.Vector3(12, 5, 4), {
        description: 'Sterile pathway for molten media.',
        material: 'Medical Grade Silicone',
        function: 'Transports agar from reservoir to nozzle.',
        assemblyOrder: 7,
        connections: ['Peristaltic Pump', 'Dispensing Nozzle'],
        failureEffect: 'Tube rupture',
        cascadeFailures: ['Internal electronics short circuit', 'Biohazard spill']
    });

    // 8. Dispensing Nozzle
    const nozzleGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
    nozzleGeo.rotateX(Math.PI);
    createPart('Dispensing Nozzle', nozzleGeo, steel, new THREE.Vector3(2, 4, 0), new THREE.Vector3(6, 6, -2), {
        description: 'Precision tip for laminar flow dispensing.',
        material: 'Stainless Steel',
        function: 'Directs agar into the petri dish without splashing.',
        assemblyOrder: 8,
        connections: ['Fluid Tubing'],
        failureEffect: 'Clogged nozzle',
        cascadeFailures: ['Pump backpressure', 'Tube blowout']
    });

    // 9. UV Sterilization Lamp
    const uvGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    uvGeo.rotateZ(Math.PI/2);
    createPart('UV-C Lamp', uvGeo, uvLight, new THREE.Vector3(0, 4, 0), new THREE.Vector3(0, 8, 0), {
        description: 'Ultraviolet germicidal irradiation source.',
        material: 'Quartz Glass',
        function: 'Maintains sterility of the dispensing zone.',
        assemblyOrder: 9,
        connections: ['Dispensing Tower'],
        failureEffect: 'Lamp burnout',
        cascadeFailures: ['System-wide contamination of cultures']
    });

    // 10. Glowing Agar Stream
    const streamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    createPart('Agar Stream', streamGeo, agarGlow, new THREE.Vector3(2, 3, 0), new THREE.Vector3(5, 5, -4), {
        description: 'Molten LB broth or agar being dispensed.',
        material: 'Bio-Matrix',
        function: 'Provides nutrients for bacterial growth.',
        assemblyOrder: 10,
        connections: ['Dispensing Nozzle', 'Petri Dish'],
        failureEffect: 'Premature gelation',
        cascadeFailures: ['System clog']
    });


    const description = "The Automated Petri Plater is a high-throughput, precision agar dispensing system. It utilizes a rotary carousel, a sterile peristaltic pump, and UV-C sterilization to rapidly prepare culture plates while maintaining a strict aseptic environment.";

    const quizQuestions = [
        {
            question: "Why is a peristaltic pump preferred for dispensing agar in this system?",
            options: [
                "It generates the highest pressure possible.",
                "The fluid only contacts the sterile tubing, preventing pump contamination.",
                "It cools the agar down faster.",
                "It spins the petri dishes simultaneously."
            ],
            correct: 1,
            explanation: "Peristaltic pumps work by squeezing a flexible tube. The fluid never touches the internal pump mechanisms, ensuring sterility.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the UV-C Lamp?",
            options: [
                "To keep the agar warm and liquid.",
                "To cure the agar so it hardens.",
                "To provide germicidal irradiation and maintain a sterile dispensing zone.",
                "To illuminate the workspace for the operator."
            ],
            correct: 2,
            explanation: "UV-C light disrupts the DNA/RNA of microorganisms, effectively sterilizing exposed surfaces and air.",
            difficulty: "Easy"
        },
        {
            question: "What cascade failure is most likely if the Dispensing Nozzle becomes clogged and the pump continues to run?",
            options: [
                "The UV lamp will shatter.",
                "The rotary carousel will spin out of control.",
                "Backpressure will build up, leading to a tube blowout or rupture.",
                "The petri dishes will melt."
            ],
            correct: 2,
            explanation: "A clog prevents fluid escape. A positive displacement pump like a peristaltic pump will continue to build pressure until a weak point (like the tubing) ruptures.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Rotate carousel and dishes
        const carouselMesh = meshes.find(m => m.userData.name === 'Rotary Carousel');
        if (carouselMesh) carouselMesh.rotation.y = time * speed * 0.5;

        for(let i=0; i<4; i++) {
            const dish = meshes.find(m => m.userData.name === `Petri Dish ${i+1}`);
            if (dish) {
                const angle = (Math.PI / 2) * i + (time * speed * 0.5);
                dish.position.x = Math.cos(angle) * 2;
                dish.position.z = Math.sin(angle) * 2;
            }
        }

        // Animate pump rollers (spin on its axis)
        const pumpMesh = meshes.find(m => m.userData.name === 'Peristaltic Pump');
        if (pumpMesh) pumpMesh.rotation.y = time * speed * 2;

        // Pulsate the Agar Stream
        const streamMesh = meshes.find(m => m.userData.name === 'Agar Stream');
        if (streamMesh) {
            streamMesh.scale.y = 1 + Math.sin(time * speed * 4) * 0.2;
            streamMesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 4) * 0.5;
        }

        // Pulsate UV Light
        const uvMesh = meshes.find(m => m.userData.name === 'UV-C Lamp');
        if (uvMesh) {
            uvMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 10) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPetriPlater() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
