import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const microwaveGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const indicatorGlow = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });
    
    // 1. Base Flange (Connects to waveguide)
    const baseFlangeGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const baseFlange = new THREE.Mesh(baseFlangeGeo, darkSteel);
    baseFlange.position.set(0, -2, 0);
    group.add(baseFlange);
    parts.push({
        name: 'Base Waveguide Flange',
        description: 'Heavy duty mounting flange that connects the feed horn to the main receiver waveguide.',
        material: 'Dark Steel',
        function: 'Structural support and seamless microwave transition.',
        assemblyOrder: 1,
        connections: ['Corrugated Waveguide', 'Receiver System'],
        failureEffect: 'Loss of signal alignment, increased noise temperature.',
        cascadeFailures: ['Signal reflection causing amplifier damage'],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -4, z: 0}
    });

    // 2. Corrugated Waveguide Throat
    const throatGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 32, 10, false);
    const throat = new THREE.Mesh(throatGeo, copper);
    throat.position.set(0, -1.15, 0);
    group.add(throat);
    parts.push({
        name: 'Corrugated Waveguide Throat',
        description: 'Precision-machined copper throat with internal corrugations.',
        material: 'Copper',
        function: 'Transitions impedance and mode converts from circular waveguide to the horn flare.',
        assemblyOrder: 2,
        connections: ['Base Flange', 'Horn Flare', 'Microwave Plasma'],
        failureEffect: 'Mode conversion degradation, loss of cross-polarization isolation.',
        cascadeFailures: ['Increased side-lobes'],
        originalPosition: {x: 0, y: -1.15, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // Throat interior glowing plasma representation (animated)
    const plasmaGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.4, 16);
    const plasma = new THREE.Mesh(plasmaGeo, microwaveGlow);
    plasma.position.set(0, -1.15, 0);
    group.add(plasma);
    // don't add to parts, it's just a visual effect
    
    // 3. Main Horn Flare
    const hornGeo = new THREE.CylinderGeometry(2, 0.3, 2, 64, 10, true);
    const horn = new THREE.Mesh(hornGeo, aluminum);
    horn.position.set(0, 0.6, 0);
    group.add(horn);
    
    const flareGroup = new THREE.Group();
    flareGroup.add(horn);
    
    // Add rings (corrugations) to the interior/exterior
    for(let i=0; i<=10; i++) {
        const radius = 0.3 + (i/10) * 1.7;
        const ringGeo = new THREE.TorusGeometry(radius, 0.05, 16, 64);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.position.set(0, -0.4 + (i/10)*2, 0);
        ring.rotation.x = Math.PI / 2;
        flareGroup.add(ring);
    }
    
    group.add(flareGroup);
    
    parts.push({
        name: 'Corrugated Horn Flare',
        description: 'Expanding aluminum flare with deep corrugations.',
        material: 'Aluminum / Chrome',
        function: 'Provides a smooth impedance transition to free space while controlling the radiation pattern and maintaining low cross-polarization.',
        assemblyOrder: 3,
        connections: ['Waveguide Throat', 'Radome Window'],
        failureEffect: 'Beam deformation, increased spillover noise.',
        cascadeFailures: ['Overall sensitivity loss of the radio telescope'],
        originalPosition: {x: 0, y: 0.6, z: 0},
        explodedPosition: {x: 0, y: 1.5, z: 0}
    });

    // 4. Environmental Radome Window
    const radomeGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 64);
    const radome = new THREE.Mesh(radomeGeo, tinted); // transparent/tinted material
    radome.position.set(0, 1.65, 0);
    group.add(radome);
    parts.push({
        name: 'Kapton Radome Window',
        description: 'A thin, microwave-transparent protective layer sealing the horn.',
        material: 'Kapton / Tinted Polymer',
        function: 'Prevents moisture, dust, and debris from entering the waveguide while allowing radio waves to pass unhindered.',
        assemblyOrder: 4,
        connections: ['Horn Flare'],
        failureEffect: 'Moisture ingress, massive signal attenuation.',
        cascadeFailures: ['Corrosion of internal throat', 'Short circuits in receiver electronics'],
        originalPosition: {x: 0, y: 1.65, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 5. Cryogenic Cooling Lines
    const coolingGroup = new THREE.Group();
    const pipeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, -2, 0),
        new THREE.Vector3(0.8, -1, 0),
        new THREE.Vector3(1.2, 0, 0),
        new THREE.Vector3(2.1, 1, 0)
    ]), 20, 0.05, 8, false);
    
    const pipe1 = new THREE.Mesh(pipeGeo, copper);
    const pipe2 = new THREE.Mesh(pipeGeo, copper);
    pipe2.rotation.y = Math.PI; // opposite side
    
    coolingGroup.add(pipe1);
    coolingGroup.add(pipe2);
    group.add(coolingGroup);
    
    parts.push({
        name: 'Cryogenic Cooling Manifold',
        description: 'Liquid helium cooling lines wrapping around the structure.',
        material: 'Copper',
        function: 'Cools the feed horn to near absolute zero to minimize thermal noise from the metal itself.',
        assemblyOrder: 5,
        connections: ['Waveguide Throat', 'Horn Flare', 'Cryo Compressor'],
        failureEffect: 'Thermal noise overwhelms faint astronomical signals.',
        cascadeFailures: ['System overheating', 'Boil-off of cryogens'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 2, y: 0, z: 0}
    });

    // 6. Sensor Array and Telemetry
    const sensorBoxGeo = new THREE.BoxGeometry(0.3, 0.4, 0.2);
    const sensorBox = new THREE.Mesh(sensorBoxGeo, plastic);
    sensorBox.position.set(0, -1, 0.6);
    group.add(sensorBox);
    
    const indicatorGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const indicator = new THREE.Mesh(indicatorGeo, indicatorGlow);
    indicator.position.set(0, -0.85, 0.7);
    group.add(indicator);

    parts.push({
        name: 'Telemetry & Sensor Node',
        description: 'Monitors temperature, pressure, and alignment data.',
        material: 'Composite Plastic',
        function: 'Provides real-time health diagnostics to the control room.',
        assemblyOrder: 6,
        connections: ['Base Flange', 'Data Bus'],
        failureEffect: 'Loss of telemetry, blind operation.',
        cascadeFailures: ['Inability to detect cryo failures in time'],
        originalPosition: {x: 0, y: -1, z: 0.6},
        explodedPosition: {x: 0, y: -1, z: 2}
    });

    const description = "The Astro Space Radio Feed Horn is a highly specialized antenna component used in advanced radio telescopes. It features a corrugated, flared structure designed to gather faint electromagnetic signals from deep space with minimal noise and maximum cross-polarization purity. Operating at cryogenic temperatures to reduce thermal noise, it funnel radio waves into a single-mode waveguide for ultra-sensitive receiver systems.";

    const quizQuestions = [
        {
            question: "Why are the internal walls of the feed horn corrugated (ringed)?",
            options: [
                "To increase structural strength against wind",
                "To control the radiation pattern and minimize cross-polarization",
                "To look aesthetically pleasing",
                "To slow down the radio waves"
            ],
            correct: 1,
            explanation: "Corrugations create specific boundary conditions that equalize the E and H plane radiation patterns, reducing side lobes and cross-polarization, making it highly efficient.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary purpose of the cryogenic cooling lines?",
            options: [
                "To prevent the metal from melting under intense radio beams",
                "To reduce the thermal noise generated by the horn itself",
                "To increase the electrical resistance of the copper",
                "To keep the radome window clear of ice"
            ],
            correct: 1,
            explanation: "At radio frequencies, any heat in the receiving equipment generates thermal noise that can drown out faint astronomical signals. Cooling the feed horn minimizes this noise.",
            difficulty: "Medium"
        },
        {
            question: "What function does the Kapton Radome Window serve?",
            options: [
                "It amplifies the incoming radio signals",
                "It acts as a lens to focus the beam",
                "It seals the horn from the environment while remaining transparent to microwaves",
                "It reflects unwanted frequencies away"
            ],
            correct: 2,
            explanation: "The radome is a thin layer that lets radio waves pass through easily but keeps out water, dust, and other contaminants that could destroy the delicate internal waveguide.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsating glow effect for plasma
        plasma.material.opacity = 0.4 + Math.sin(time * speed * 2) * 0.2;
        plasma.scale.y = 1 + Math.sin(time * speed * 5) * 0.05;
        
        // Blink telemetry indicator
        if (Math.sin(time * speed * 4) > 0) {
            indicator.material.emissiveIntensity = 2;
        } else {
            indicator.material.emissiveIntensity = 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRadioFeedHorn() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
