import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    const neonMagenta = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xff00ff, 
        emissiveIntensity: 0.8 
    });
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2.4,
        thickness: 0.5,
        clearcoat: 1.0
    });
    const goldPlated = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // 1. Cartridge Body (Shell)
    const bodyGeometry = new THREE.BoxGeometry(3, 2, 4);
    const bodyMesh = new THREE.Mesh(bodyGeometry, darkSteel);
    const bodyPos = { x: 0, y: 1, z: 0 };
    bodyMesh.position.set(bodyPos.x, bodyPos.y, bodyPos.z);
    group.add(bodyMesh);

    parts.push({
        name: "Cartridge Body",
        description: "The outer shell housing the delicate internal components, usually made of low-resonance materials like machined aluminum or dark steel.",
        material: "darkSteel",
        function: "Protects internal components and provides a rigid mounting point to the tonearm.",
        assemblyOrder: 1,
        connections: ["Tonearm Mount", "Suspension Block"],
        failureEffect: "Resonance issues and distortion.",
        cascadeFailures: ["Signal degradation"],
        originalPosition: { ...bodyPos },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: bodyMesh
    });

    // 2. Cantilever
    const cantileverGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16);
    // Rotate to point somewhat downwards and forwards
    cantileverGeometry.rotateX(Math.PI / 2);
    cantileverGeometry.rotateX(Math.PI / 8); 
    const cantileverMesh = new THREE.Mesh(cantileverGeometry, aluminum);
    const cantileverPos = { x: 0, y: -0.5, z: 1.5 };
    cantileverMesh.position.set(cantileverPos.x, cantileverPos.y, cantileverPos.z);
    group.add(cantileverMesh);

    parts.push({
        name: "Cantilever",
        description: "A tiny, rigid tube (often aluminum, boron, or ruby) that transfers the movement of the stylus to the coils.",
        material: "aluminum",
        function: "Acts as a mechanical lever, translating the microscopic grooves of the record into movement at the generator.",
        assemblyOrder: 3,
        connections: ["Stylus", "Suspension Block", "Coils"],
        failureEffect: "Total loss of signal or severe distortion if bent.",
        cascadeFailures: ["Coil misalignment", "Stylus tracking error"],
        originalPosition: { ...cantileverPos },
        explodedPosition: { x: 0, y: -2, z: 3 },
        mesh: cantileverMesh
    });

    // 3. Stylus (Diamond)
    const stylusGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    stylusGeometry.rotateX(Math.PI);
    const stylusMesh = new THREE.Mesh(stylusGeometry, diamondMaterial);
    const stylusPos = { x: 0, y: -1.0, z: 2.6 };
    stylusMesh.position.set(stylusPos.x, stylusPos.y, stylusPos.z);
    group.add(stylusMesh);

    parts.push({
        name: "Diamond Stylus",
        description: "A precisely cut industrial diamond that physically traces the modulations in the record groove.",
        material: "diamond",
        function: "Reads the analog audio signal physically pressed into the vinyl.",
        assemblyOrder: 4,
        connections: ["Cantilever", "Record Groove"],
        failureEffect: "Skipping, severe record wear, muffled high frequencies.",
        cascadeFailures: ["Vinyl damage", "Distortion"],
        originalPosition: { ...stylusPos },
        explodedPosition: { x: 0, y: -4, z: 4 },
        mesh: stylusMesh
    });

    // 4. Moving Coils (Left and Right)
    const coilGroup = new THREE.Group();
    const coilGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    
    const coilL = new THREE.Mesh(coilGeom, copper);
    coilL.rotation.z = Math.PI / 4;
    coilL.position.set(-0.2, 0, 0);
    
    const coilR = new THREE.Mesh(coilGeom, copper);
    coilR.rotation.z = -Math.PI / 4;
    coilR.position.set(0.2, 0, 0);

    coilGroup.add(coilL);
    coilGroup.add(coilR);
    
    const coilPos = { x: 0, y: 0.2, z: 0.5 };
    coilGroup.position.set(coilPos.x, coilPos.y, coilPos.z);
    group.add(coilGroup);

    parts.push({
        name: "Moving Coils",
        description: "Microscopic coils of ultra-pure copper or silver wire attached directly to the cantilever.",
        material: "copper",
        function: "Moves within the magnetic field to induce a tiny electrical current (the audio signal). Low mass allows incredible high-frequency tracking.",
        assemblyOrder: 5,
        connections: ["Cantilever", "Terminal Pins"],
        failureEffect: "Channel imbalance or dead channel.",
        cascadeFailures: ["Signal dropout"],
        originalPosition: { ...coilPos },
        explodedPosition: { x: 0, y: 0, z: -2 },
        mesh: coilGroup
    });

    // 5. Magnet System (Neodymium)
    const magnetGeom = new THREE.BoxGeometry(1.5, 0.8, 1.5);
    const magnetMesh = new THREE.Mesh(magnetGeom, neonBlue); // Give it a high-tech glowing look
    const magnetPos = { x: 0, y: 0.5, z: -0.5 };
    magnetMesh.position.set(magnetPos.x, magnetPos.y, magnetPos.z);
    group.add(magnetMesh);

    parts.push({
        name: "Neodymium Magnet Array",
        description: "Powerful fixed magnets that create a dense, uniform magnetic field around the moving coils.",
        material: "neonBlue",
        function: "Provides the magnetic flux necessary for electromagnetic induction as the coils vibrate.",
        assemblyOrder: 2,
        connections: ["Cartridge Body", "Yoke"],
        failureEffect: "Low output voltage, poor dynamics.",
        cascadeFailures: ["Low signal-to-noise ratio at preamp"],
        originalPosition: { ...magnetPos },
        explodedPosition: { x: 0, y: 2, z: -3 },
        mesh: magnetMesh
    });

    // 6. Terminal Pins
    const pinGroup = new THREE.Group();
    const pinGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    pinGeom.rotateX(Math.PI / 2);
    
    const pinPositions = [
        { x: -0.5, y: 0.5, z: -2 },
        { x: 0.5, y: 0.5, z: -2 },
        { x: -0.5, y: -0.5, z: -2 },
        { x: 0.5, y: -0.5, z: -2 }
    ];

    pinPositions.forEach(p => {
        const pin = new THREE.Mesh(pinGeom, goldPlated);
        pin.position.set(p.x, p.y, p.z);
        pinGroup.add(pin);
    });
    
    group.add(pinGroup);

    parts.push({
        name: "Gold-Plated Terminal Pins",
        description: "Four connection points (Left/Right Hot/Ground) exiting the rear of the cartridge.",
        material: "goldPlated",
        function: "Transmits the delicate induced electrical signal from the internal coils to the tonearm wires.",
        assemblyOrder: 6,
        connections: ["Moving Coils", "Tonearm Headshell Wires"],
        failureEffect: "Hum, buzzing, or intermittent signal.",
        cascadeFailures: ["Ground loop noise"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: pinGroup
    });

    // 7. Glowing Record Groove (Visual Flair)
    const grooveGeom = new THREE.PlaneGeometry(8, 8, 32, 32);
    // Displace vertices to make it look like a groove
    const posAttribute = grooveGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        // Create wavy ridges
        const z = Math.sin(x * 10) * 0.05 + Math.cos(y * 10) * 0.05;
        posAttribute.setZ(i, z);
    }
    grooveGeom.computeVertexNormals();
    grooveGeom.rotateX(-Math.PI / 2);
    
    const grooveMesh = new THREE.Mesh(grooveGeom, neonMagenta);
    const groovePos = { x: 0, y: -1.2, z: 2.6 };
    grooveMesh.position.set(groovePos.x, groovePos.y, groovePos.z);
    group.add(grooveMesh);

    parts.push({
        name: "Vinyl Record Groove",
        description: "A microscopic canyon pressed into PVC, containing left and right channel audio cut at 45-degree angles.",
        material: "neonMagenta",
        function: "Physically forces the stylus to vibrate in complex patterns corresponding to the original sound wave.",
        assemblyOrder: 7,
        connections: ["Stylus"],
        failureEffect: "Scratches, pops, clicks.",
        cascadeFailures: [],
        originalPosition: { ...groovePos },
        explodedPosition: { x: 0, y: -5, z: 5 },
        mesh: grooveMesh
    });


    const description = "The Moving Coil (MC) Phono Cartridge is an ultra-precise electromechanical transducer. By attaching microscopic coils directly to the cantilever and placing them within a powerful fixed magnetic field, it generates audio signals with exceptionally low moving mass. This allows the stylus to trace intricate high-frequency groove modulations far more accurately than Moving Magnet designs, delivering unparalleled sonic resolution, transient response, and clarity.";

    const quizQuestions = [
        {
            question: "Why does a Moving Coil (MC) cartridge generally offer better high-frequency detail than a Moving Magnet (MM) cartridge?",
            options: [
                "Because the magnets used are heavier.",
                "Because the coils are attached to the cantilever, resulting in much lower moving mass.",
                "Because MC cartridges use a larger diamond stylus.",
                "Because they output a much higher voltage."
            ],
            correct: 1,
            explanation: "In an MC cartridge, tiny coils are attached to the moving cantilever instead of heavy magnets. This lower moving mass allows the assembly to react faster to microscopic high-frequency groove variations.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the neodymium magnet in this design?",
            options: [
                "To attract the tonearm to the record.",
                "To provide a fixed, powerful magnetic field for the moving coils to interact with.",
                "To move back and forth along the cantilever.",
                "To ground the electrical signal."
            ],
            correct: 1,
            explanation: "The powerful fixed neodymium magnets create a dense magnetic flux. When the tiny coils attached to the cantilever move within this field, a current is induced.",
            difficulty: "Easy"
        },
        {
            question: "What electrical characteristic is typical of Moving Coil cartridges compared to Moving Magnet types?",
            options: [
                "They output a much higher voltage (around 5mV).",
                "They require no pre-amplification.",
                "They output a much lower voltage (around 0.2mV to 0.5mV) requiring a specialized step-up transformer or MC phono stage.",
                "They run on direct current batteries."
            ],
            correct: 2,
            explanation: "Because the coils must be extremely small to keep mass low, they have very few windings. This results in a very low output voltage, requiring specialized, high-gain, low-noise pre-amplification.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Vibrating cantilever and stylus based on the 'groove'
        const vibrateSpeed = time * 20 * speed;
        const vibrationX = Math.sin(vibrateSpeed) * 0.02;
        const vibrationY = Math.cos(vibrateSpeed * 1.5) * 0.01;

        if (cantileverMesh) {
            cantileverMesh.rotation.z = vibrationX;
            cantileverMesh.position.y = cantileverPos.y + vibrationY;
        }

        if (stylusMesh) {
            stylusMesh.position.x = stylusPos.x + vibrationX * 2;
            stylusMesh.position.y = stylusPos.y + vibrationY;
        }

        if (coilGroup) {
            coilGroup.rotation.y = vibrationX;
            coilGroup.position.x = coilPos.x + vibrationX;
        }

        if (grooveMesh) {
            // Scroll the groove to simulate record spinning
            grooveMesh.position.z = groovePos.z + (time * speed) % 1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMovingCoilCartridge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
