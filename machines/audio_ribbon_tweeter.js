import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const magneticGlow = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0x550088,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6
    });

    const ultraThinAluminum = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        metalness: 1.0,
        roughness: 0.1,
        side: THREE.DoubleSide,
        clearcoat: 0.5
    });

    const neodymium = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.4,
        envMapIntensity: 1.5
    });

    // 1. Frame/Housing
    const frameGeo = new THREE.BoxGeometry(4, 8, 2);
    const frame = new THREE.Mesh(frameGeo, darkSteel);
    frame.position.set(0, 0, 0);
    group.add(frame);
    parts.push({
        name: "Housing Frame",
        description: "Heavy-duty steel frame housing the magnetic structure and ribbon.",
        material: "darkSteel",
        function: "Provides structural integrity and resonance damping.",
        assemblyOrder: 1,
        connections: ["Front Plate", "Back Plate"],
        failureEffect: "Mechanical instability and distortion.",
        cascadeFailures: ["Ribbon Tear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 2. Neodymium Magnets (Left and Right Arrays)
    const magnetGeo = new THREE.BoxGeometry(0.8, 6, 1.2);
    
    const leftMagnet = new THREE.Mesh(magnetGeo, neodymium);
    leftMagnet.position.set(-1.2, 0, 0);
    group.add(leftMagnet);
    parts.push({
        name: "Left Neodymium Magnet",
        description: "High-strength rare-earth magnet generating a powerful uniform magnetic field.",
        material: "Neodymium",
        function: "Creates the intense static magnetic field required for the ribbon motor.",
        assemblyOrder: 2,
        connections: ["Housing Frame"],
        failureEffect: "Loss of magnetic field, zero audio output.",
        cascadeFailures: [],
        originalPosition: { x: -1.2, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 }
    });

    const rightMagnet = new THREE.Mesh(magnetGeo, neodymium);
    rightMagnet.position.set(1.2, 0, 0);
    group.add(rightMagnet);
    parts.push({
        name: "Right Neodymium Magnet",
        description: "High-strength rare-earth magnet working in tandem with the left magnet.",
        material: "Neodymium",
        function: "Completes the magnetic circuit across the air gap.",
        assemblyOrder: 3,
        connections: ["Housing Frame"],
        failureEffect: "Loss of magnetic field, zero audio output.",
        cascadeFailures: [],
        originalPosition: { x: 1.2, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // 3. Corrugated Aluminum Ribbon
    const ribbonGeo = new THREE.PlaneGeometry(0.8, 6, 10, 60);
    // Apply corrugation via vertices
    const posAttribute = ribbonGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const z = Math.sin(y * 20) * 0.05; // Corrugation depth
        posAttribute.setZ(i, z);
    }
    ribbonGeo.computeVertexNormals();

    const ribbon = new THREE.Mesh(ribbonGeo, ultraThinAluminum);
    ribbon.position.set(0, 0, 0);
    group.add(ribbon);
    parts.push({
        name: "Corrugated Aluminum Ribbon",
        description: "Ultra-thin, lightweight aluminum diaphragm acting as both voice coil and radiator.",
        material: "Ultra-thin Aluminum",
        function: "Vibrates electromagnetically to produce high-frequency sound waves.",
        assemblyOrder: 4,
        connections: ["Terminal Clamps"],
        failureEffect: "No sound, open circuit.",
        cascadeFailures: ["Amplifier Short (if torn into gap)"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 }
    });
    // Add ribbon to group context for animation
    ribbon.name = 'RibbonDiaphragm';

    // 4. Flux Concentrators / Magnetic Field Visualizer (Glowing elements)
    const fluxGeo = new THREE.BoxGeometry(1.6, 6.2, 0.1);
    const fluxGlow = new THREE.Mesh(fluxGeo, magneticGlow);
    fluxGlow.position.set(0, 0, -0.6);
    group.add(fluxGlow);
    parts.push({
        name: "Magnetic Flux Field",
        description: "Visual representation of the intense magnetic gap.",
        material: "Neon Energy",
        function: "Maintains linear flux density across the ribbon.",
        assemblyOrder: 5,
        connections: ["Left Magnet", "Right Magnet"],
        failureEffect: "Non-linear distortion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -0.6 },
        explodedPosition: { x: 0, y: 0, z: -2 }
    });

    // 5. Terminal Clamps (Top and Bottom)
    const clampGeo = new THREE.BoxGeometry(1.5, 0.5, 0.5);
    const topClamp = new THREE.Mesh(clampGeo, chrome);
    topClamp.position.set(0, 3.25, 0.1);
    group.add(topClamp);
    parts.push({
        name: "Top Terminal Clamp",
        description: "Secure mounting clamp and electrical contact for the ribbon.",
        material: "Chrome",
        function: "Suspends the ribbon and passes audio signal current.",
        assemblyOrder: 6,
        connections: ["Housing Frame", "Ribbon"],
        failureEffect: "Intermittent signal, structural failure of ribbon.",
        cascadeFailures: ["Ribbon Tear"],
        originalPosition: { x: 0, y: 3.25, z: 0.1 },
        explodedPosition: { x: 0, y: 5, z: 2 }
    });

    const bottomClamp = new THREE.Mesh(clampGeo, chrome);
    bottomClamp.position.set(0, -3.25, 0.1);
    group.add(bottomClamp);
    parts.push({
        name: "Bottom Terminal Clamp",
        description: "Secure mounting clamp and electrical contact for the ribbon.",
        material: "Chrome",
        function: "Suspends the ribbon and passes audio signal current.",
        assemblyOrder: 7,
        connections: ["Housing Frame", "Ribbon"],
        failureEffect: "Intermittent signal, structural failure of ribbon.",
        cascadeFailures: ["Ribbon Tear"],
        originalPosition: { x: 0, y: -3.25, z: 0.1 },
        explodedPosition: { x: 0, y: -5, z: 2 }
    });

    // 6. Signal Wires
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    
    const topWire = new THREE.Mesh(wireGeo, wireMat);
    topWire.position.set(0.5, 4.25, 0.1);
    group.add(topWire);
    
    const bottomWire = new THREE.Mesh(wireGeo, wireMat);
    bottomWire.position.set(0.5, -4.25, 0.1);
    bottomWire.material = new THREE.MeshStandardMaterial({ color: 0x111111 });
    group.add(bottomWire);
    
    parts.push({
        name: "Audio Terminals",
        description: "Input connections for the amplified audio signal.",
        material: "Copper/Plastic",
        function: "Delivers alternating current to the ribbon diaphragm.",
        assemblyOrder: 8,
        connections: ["Top Terminal Clamp", "Bottom Terminal Clamp"],
        failureEffect: "No audio signal.",
        cascadeFailures: [],
        originalPosition: { x: 0.5, y: 4.25, z: 0.1 },
        explodedPosition: { x: 2, y: 6, z: 2 }
    });

    const description = "The Audio Ribbon Tweeter uses an ultra-thin, corrugated aluminum ribbon suspended in a powerful magnetic field. As audio current passes through the ribbon, it interacts with the magnetic field, causing the entire ribbon to move back and forth, producing exceptionally fast, detailed high-frequency sound with incredibly low mass.";

    const quizQuestions = [
        {
            question: "Why is the aluminum ribbon corrugated?",
            options: [
                "For aesthetic purposes",
                "To increase electrical resistance",
                "To provide structural stiffness preventing it from collapsing while remaining flexible",
                "To reduce the magnetic field strength"
            ],
            correct: 2,
            explanation: "Corrugation gives the ultra-thin aluminum foil mechanical stiffness across its width, preventing it from bowing out or collapsing during excursion, while allowing longitudinal flexibility to vibrate.",
            difficulty: "Medium"
        },
        {
            question: "In a true ribbon tweeter, what serves as the voice coil?",
            options: [
                "A copper wire wrapped around a former",
                "The magnetic flux concentrators",
                "The aluminum ribbon itself",
                "There is no voice coil"
            ],
            correct: 2,
            explanation: "In a true ribbon tweeter, the aluminum ribbon acts as both the electrical voice coil (carrying the audio signal) and the acoustic diaphragm (moving the air).",
            difficulty: "Easy"
        },
        {
            question: "What is the primary advantage of a ribbon tweeter over a traditional dome tweeter?",
            options: [
                "It can handle much lower frequencies",
                "Extremely low moving mass leading to superior transient response and detail",
                "It is much cheaper to manufacture",
                "It requires no magnets"
            ],
            correct: 1,
            explanation: "Because the diaphragm is just a microscopic layer of aluminum, its mass is incredibly low. This allows it to start and stop instantly, yielding exceptional high-frequency detail and transient response.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Find the ribbon mesh in the group (or passed meshes)
        const ribbonMesh = group.children.find(m => m.name === 'RibbonDiaphragm');
        if (ribbonMesh) {
            // Animate the ribbon vibrating back and forth
            // Using a complex high-frequency wave combined with lower frequency envelope
            const highFreq = Math.sin(time * speed * 50);
            const lowFreq = Math.sin(time * speed * 5);
            
            // Apply displacement on Z axis
            ribbonMesh.position.z = highFreq * lowFreq * 0.15;
            
            // Also subtly deform the vertices for a rippling effect
            const posAttr = ribbonMesh.geometry.attributes.position;
            const vertexCount = posAttr.count;
            for (let i = 0; i < vertexCount; i++) {
                const origZ = Math.sin(posAttr.getY(i) * 20) * 0.05; // Base corrugation
                const wave = Math.sin(time * speed * 20 + posAttr.getY(i) * 5) * 0.02 * highFreq;
                posAttr.setZ(i, origZ + wave);
            }
            ribbonMesh.geometry.computeVertexNormals();
            ribbonMesh.geometry.attributes.position.needsUpdate = true;
        }

        // Pulse the magnetic glow
        const glowMesh = group.children[4]; // The flux visualizer
        if (glowMesh && glowMesh.material.emissiveIntensity !== undefined) {
            glowMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 2) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRibbonTweeter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
