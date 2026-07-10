import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, transparent: true, opacity: 0.9 });
    const glowCyan = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2 });
    const glowRed = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff3300, emissiveIntensity: 2 });
    const synthWhite = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 0.1, roughness: 0.2 });
    const goldPin = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.3 });
    const matteBlack = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.8 });

    // 1. Synthetic Sclera Casing
    const scleraGeo = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, Math.PI * 0.25, Math.PI * 0.75);
    const sclera = new THREE.Mesh(scleraGeo, synthWhite);
    sclera.rotation.x = Math.PI / 2;
    group.add(sclera);
    meshes.sclera = sclera;
    parts.push({
        name: "Synthetic Sclera Casing",
        description: "Polycarbonate-titanium composite shell providing structural integrity and protecting internal biotronics.",
        material: "Poly-Titanium Composite",
        function: "Protection and structural housing",
        assemblyOrder: 1,
        connections: ["Optic Interface", "Cornea Casing"],
        failureEffect: "Loss of physical integrity, exposing delicate internals to fluid and debris.",
        cascadeFailures: ["Lens misalignment", "Processor short-circuit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // 2. Cornea Window
    const corneaGeo = new THREE.SphereGeometry(2.05, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const cornea = new THREE.Mesh(corneaGeo, glass);
    cornea.rotation.x = Math.PI / 2;
    group.add(cornea);
    meshes.cornea = cornea;
    parts.push({
        name: "Cornea Window",
        description: "Scratch-resistant sapphire glass window with anti-reflective nanocoating.",
        material: "Sapphire Glass",
        function: "Allows light entry while shielding the lens and aperture.",
        assemblyOrder: 7,
        connections: ["Sclera Casing"],
        failureEffect: "Blurry vision or complete blockage of incoming light.",
        cascadeFailures: ["Aperture jam", "Lens damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // 3. Mechanical Iris Aperture
    const apertureGroup = new THREE.Group();
    const blades = [];
    const numBlades = 8;
    for(let i=0; i<numBlades; i++) {
        const bladeGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 3);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.scale.set(1, 1, 0.5); // flatten and stretch
        
        // Pivot point setup
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / numBlades) * Math.PI * 2;
        
        blade.position.set(0.6, 0, 0);
        blade.rotation.y = Math.PI / 2;
        
        pivot.add(blade);
        apertureGroup.add(pivot);
        blades.push(pivot);
    }
    apertureGroup.position.set(0, 0, 1.3);
    group.add(apertureGroup);
    meshes.apertureBlades = blades;
    parts.push({
        name: "Mechanical Iris Aperture",
        description: "Motorized overlapping blades that dynamically adjust to regulate light intake.",
        material: "Carbon Nanotube Steel",
        function: "Light regulation and focal depth adjustment.",
        assemblyOrder: 5,
        connections: ["Lens Assembly", "Light Sensor Array"],
        failureEffect: "Overexposure or underexposure of the digital retina.",
        cascadeFailures: ["Sensor burnout"],
        originalPosition: { x: 0, y: 0, z: 1.3 },
        explodedPosition: { x: 0, y: 0, z: 2 }
    });

    // 4. Photonic Lens Array
    const lensGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.3, 32);
    const lens = new THREE.Mesh(lensGeo, tinted);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 1.0);
    group.add(lens);
    meshes.lens = lens;
    parts.push({
        name: "Photonic Lens Array",
        description: "Variable-focus liquid crystal lens capable of microscopic and telescopic zooming.",
        material: "Liquid Crystal / Glass",
        function: "Focuses light rays onto the digital retina.",
        assemblyOrder: 4,
        connections: ["Iris Aperture", "Focus Motor"],
        failureEffect: "Inability to focus on objects, severe optical distortion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 1.0 },
        explodedPosition: { x: 0, y: 0, z: 0.5 }
    });

    // 5. Digital Retina Sensor
    const retinaGeo = new THREE.SphereGeometry(1.9, 64, 64, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4);
    const retina = new THREE.Mesh(retinaGeo, glowBlue);
    retina.rotation.x = Math.PI / 2;
    group.add(retina);
    meshes.retina = retina;
    parts.push({
        name: "Digital Retina Sensor",
        description: "Hyper-sensitive photon-capturing surface with 500-megapixel equivalent resolution and night-vision capabilities.",
        material: "Graphene / Silicon",
        function: "Converts light into digital neural signals.",
        assemblyOrder: 3,
        connections: ["Neural Processor"],
        failureEffect: "Complete or partial blindness in the visual field.",
        cascadeFailures: ["Neural processor desync"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -1.5 }
    });

    // 6. Neural Image Processor
    const processorGeo = new THREE.BoxGeometry(1.2, 1.2, 0.6);
    const processor = new THREE.Mesh(processorGeo, matteBlack);
    processor.position.set(0, 0, -1.0);
    group.add(processor);
    meshes.processor = processor;

    const chipDecalGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const chipDecal = new THREE.Mesh(chipDecalGeo, glowCyan);
    chipDecal.position.set(0, 0, 0.31);
    processor.add(chipDecal);

    parts.push({
        name: "Neural Image Processor",
        description: "Quantum-assisted chip that processes raw visual data and runs object recognition algorithms.",
        material: "Silicon / Gold",
        function: "Visual data processing and enhancement.",
        assemblyOrder: 2,
        connections: ["Digital Retina Sensor", "Optic Nerve Interface"],
        failureEffect: "Visual hallucinations, lag, or complete failure to interpret images.",
        cascadeFailures: ["Neural feedback loop", "Cortex overload"],
        originalPosition: { x: 0, y: 0, z: -1.0 },
        explodedPosition: { x: 0, y: 0, z: -2.5 }
    });

    // 7. Optic Nerve Interface
    const nerveGroup = new THREE.Group();
    const nerveBaseGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.8, 32);
    const nerveBase = new THREE.Mesh(nerveBaseGeo, chrome);
    nerveBase.rotation.x = Math.PI / 2;
    nerveGroup.add(nerveBase);
    
    // Glowing pins for nerve interface
    for(let i=0; i<12; i++) {
        const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const pin = new THREE.Mesh(pinGeo, goldPin);
        pin.rotation.x = Math.PI / 2;
        const angle = (i / 12) * Math.PI * 2;
        pin.position.set(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, -0.5);
        nerveGroup.add(pin);
    }
    // Main optical data trunk
    const centerPinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const centerPin = new THREE.Mesh(centerPinGeo, glowRed);
    centerPin.rotation.x = Math.PI / 2;
    centerPin.position.set(0, 0, -0.5);
    nerveGroup.add(centerPin);

    nerveGroup.position.set(0, 0, -2.0);
    group.add(nerveGroup);
    meshes.nerve = nerveGroup;
    parts.push({
        name: "Optic Nerve Interface",
        description: "Bio-digital connector socket that physically grafts to the biological optic nerve.",
        material: "Chrome / Gold / Bio-resin",
        function: "Transmits digital visual data into biological neural signals.",
        assemblyOrder: 0,
        connections: ["Neural Image Processor", "Biological Host"],
        failureEffect: "Severe neural feedback, migraines, or disconnection from visual cortex.",
        cascadeFailures: ["Host rejection", "Processor overload"],
        originalPosition: { x: 0, y: 0, z: -2.0 },
        explodedPosition: { x: 0, y: 0, z: -5.5 }
    });

    // 8. Micro-Tension Focus Motors
    const motorGroup = new THREE.Group();
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.1, 16, 64);
    const ring1 = new THREE.Mesh(ring1Geo, copper);
    ring1.position.z = 0.8;
    motorGroup.add(ring1);
    
    const ring2Geo = new THREE.TorusGeometry(1.2, 0.08, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geo, aluminum);
    ring2.position.z = 0.6;
    motorGroup.add(ring2);
    
    group.add(motorGroup);
    meshes.motors = motorGroup;
    parts.push({
        name: "Micro-Tension Focus Motors",
        description: "Electromagnetic rings that stretch or compress the lens for rapid focal shifts.",
        material: "Copper / Aluminum",
        function: "Actuates the lens for zooming and focusing.",
        assemblyOrder: 6,
        connections: ["Photonic Lens Array", "Neural Processor"],
        failureEffect: "Stuck focal length, unable to track moving objects.",
        cascadeFailures: ["Lens misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 1.5 }
    });

    const description = "The Bionic Eye (Cybernetic Vision Implant) is a marvel of bio-engineering. It interfaces directly with the human optic nerve, translating photons into neural impulses. Featuring a carbon nanotube iris, a liquid crystal lens for extreme zoom, and a quantum processor that provides real-time augmented reality overlays, this implant far surpasses the capabilities of natural human vision.";

    const quizQuestions = [
        {
            question: "Which component directly translates incoming light into digital neural signals?",
            options: [
                "Photonic Lens Array",
                "Digital Retina Sensor",
                "Optic Nerve Interface",
                "Neural Image Processor"
            ],
            correct: 1,
            explanation: "The Digital Retina Sensor captures photons and converts them into digital signals before processing.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Optic Nerve Interface?",
            options: [
                "To regulate light intake",
                "To process augmented reality overlays",
                "To connect the digital eye to the biological brain",
                "To physically zoom the lens"
            ],
            correct: 2,
            explanation: "The Optic Nerve Interface grafts to the biological optic nerve, transmitting digital data into the visual cortex.",
            difficulty: "Easy"
        },
        {
            question: "A failure in the Mechanical Iris Aperture can lead to what cascading effect?",
            options: [
                "Host rejection",
                "Lens damage",
                "Sensor burnout",
                "Migraines"
            ],
            correct: 2,
            explanation: "If the aperture gets stuck open, an influx of intense light could cause Sensor burnout.",
            difficulty: "Hard"
        },
        {
            question: "Which material is heavily used in the Focusing Motors to generate electromagnetic actuation?",
            options: [
                "Copper",
                "Glass",
                "Titanium",
                "Bio-resin"
            ],
            correct: 0,
            explanation: "Copper rings are used in the focusing motors to generate the necessary electromagnetic fields.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshesObj) => {
        // Pulse the digital retina sensor
        meshesObj.retina.material.emissiveIntensity = 1.0 + Math.sin(time * 3 * speed) * 0.5;
        
        // Spin the processor decal color to simulate calculation
        const hue = (time * 0.5 * speed) % 1;
        meshesObj.processor.children[0].material.emissive.setHSL(hue, 1, 0.5);

        // Animate aperture blades opening and closing slightly
        const aperturePhase = (Math.sin(time * speed) + 1) / 2; // oscillates between 0 and 1
        meshesObj.apertureBlades.forEach(blade => {
            blade.children[0].rotation.z = aperturePhase * 0.5;
        });

        // Rotate the focus motor rings dynamically
        meshesObj.motors.rotation.z = Math.sin(time * 2 * speed) * 0.2;
        meshesObj.motors.children[0].rotation.z = time * 2 * speed;
        meshesObj.motors.children[1].rotation.z = -time * 3 * speed;
        
        // Animate the main optical data trunk on the nerve interface
        meshesObj.nerve.children[12].material.emissiveIntensity = 1.5 + Math.cos(time * 5 * speed) * 1.0;
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBionicEye() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
