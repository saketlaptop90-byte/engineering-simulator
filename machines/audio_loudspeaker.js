import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for sci-fi look
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7
    });

    // 1. Magnet (Back)
    const magnetGeometry = new THREE.CylinderGeometry(3, 3, 1, 32);
    const magnet = new THREE.Mesh(magnetGeometry, darkSteel);
    magnet.position.set(0, -2, 0);
    group.add(magnet);
    parts.push({
        name: "Permanent Magnet",
        description: "Creates a stationary magnetic field that interacts with the voice coil to generate motion.",
        material: "darkSteel",
        function: "Provides the fixed magnetic flux for the motor system.",
        assemblyOrder: 1,
        connections: ["Back Plate", "Front Plate"],
        failureEffect: "Loss of magnetic field, completely disabling sound output.",
        cascadeFailures: ["No voice coil movement"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 2. Back Plate and Pole Piece
    const backPlateGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.4, 32);
    const backPlate = new THREE.Mesh(backPlateGeometry, steel);
    backPlate.position.set(0, -2.7, 0);
    group.add(backPlate);
    
    const polePieceGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const polePiece = new THREE.Mesh(polePieceGeometry, steel);
    polePiece.position.set(0, -1.25, 0);
    group.add(polePiece);
    parts.push({
        name: "Back Plate & Pole Piece",
        description: "Focuses the magnetic field into the gap where the voice coil sits.",
        material: "steel",
        function: "Concentrates magnetic flux.",
        assemblyOrder: 2,
        connections: ["Magnet", "Front Plate"],
        failureEffect: "Weak magnetic field, resulting in very low volume and high distortion.",
        cascadeFailures: ["Inefficient motor cooling"],
        originalPosition: { x: 0, y: -2.7, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 }
    });

    // 3. Front Plate
    const frontPlateGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.4, 32);
    // Create a hole in the front plate
    const fpShape = new THREE.Shape();
    fpShape.absarc(0, 0, 3.2, 0, Math.PI * 2, false);
    const fpHole = new THREE.Path();
    fpHole.absarc(0, 0, 1.3, 0, Math.PI * 2, true);
    fpShape.holes.push(fpHole);
    const fpExtrudeSettings = { depth: 0.4, bevelEnabled: false, curveSegments: 32 };
    const fpGeometry = new THREE.ExtrudeGeometry(fpShape, fpExtrudeSettings);
    fpGeometry.rotateX(Math.PI / 2);
    const frontPlate = new THREE.Mesh(fpGeometry, steel);
    frontPlate.position.set(0, -1.3, 0);
    group.add(frontPlate);
    parts.push({
        name: "Front Plate",
        description: "Completes the magnetic circuit, creating a concentrated magnetic gap.",
        material: "steel",
        function: "Directs magnetic lines of force across the voice coil gap.",
        assemblyOrder: 3,
        connections: ["Magnet", "Basket"],
        failureEffect: "Misaligned voice coil gap, causing scraping and short circuits.",
        cascadeFailures: ["Voice Coil burning out"],
        originalPosition: { x: 0, y: -1.3, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 4. Voice Coil (glowing copper)
    const vcGeometry = new THREE.CylinderGeometry(1.25, 1.25, 1.5, 32, 1, true);
    const voiceCoil = new THREE.Mesh(vcGeometry, neonOrange);
    voiceCoil.position.set(0, -0.8, 0);
    // Needed to animate
    voiceCoil.name = "voiceCoilMesh";
    group.add(voiceCoil);
    parts.push({
        name: "Voice Coil",
        description: "A coil of wire that becomes an electromagnet when audio signal flows through it.",
        material: "neonOrange (Copper wire)",
        function: "Generates an alternating magnetic field that pushes and pulls against the permanent magnet.",
        assemblyOrder: 4,
        connections: ["Cone", "Spider", "Terminals"],
        failureEffect: "Thermal burnout, causing open circuit and no sound.",
        cascadeFailures: ["Amplifier damage if shorted"],
        originalPosition: { x: 0, y: -0.8, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 5. Basket / Frame
    const basketGeometry = new THREE.CylinderGeometry(5.5, 3.2, 3, 8, 1, true);
    const basketMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, metalness: 0.5 }); // Wireframe for visibility
    const basket = new THREE.Mesh(basketGeometry, aluminum);
    basket.position.set(0, 0.2, 0);
    
    // Make basket struts
    const strutGeometry = new THREE.CylinderGeometry(0.1, 0.2, 3.2, 8);
    for(let i=0; i<6; i++) {
        const strut = new THREE.Mesh(strutGeometry, chrome);
        const angle = (i / 6) * Math.PI * 2;
        strut.position.set(Math.cos(angle) * 4.2, 0.2, Math.sin(angle) * 4.2);
        strut.rotation.x = -0.6;
        strut.rotation.y = -angle;
        group.add(strut);
    }
    
    // Add top ring
    const topRingGeometry = new THREE.TorusGeometry(5.5, 0.2, 16, 64);
    const topRing = new THREE.Mesh(topRingGeometry, aluminum);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.set(0, 1.6, 0);
    group.add(topRing);

    parts.push({
        name: "Basket (Frame)",
        description: "The rigid structural backbone of the loudspeaker.",
        material: "aluminum / chrome",
        function: "Holds all components in precise alignment.",
        assemblyOrder: 5,
        connections: ["Front Plate", "Surround", "Spider"],
        failureEffect: "Warping, causing voice coil misalignment and severe distortion.",
        cascadeFailures: ["Voice Coil rub", "Cone tearing"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 6. Spider (Suspension)
    const spiderGeometry = new THREE.RingGeometry(1.25, 3.2, 32, 8);
    const spiderMaterial = new THREE.MeshStandardMaterial({ color: 0xddaa44, roughness: 0.9, side: THREE.DoubleSide, wireframe: true });
    const spider = new THREE.Mesh(spiderGeometry, spiderMaterial);
    spider.rotation.x = -Math.PI / 2;
    spider.position.set(0, -0.6, 0);
    spider.name = "spiderMesh";
    group.add(spider);
    parts.push({
        name: "Spider (Inner Suspension)",
        description: "Corrugated fabric disc that keeps the voice coil centered in the magnetic gap.",
        material: "fabric (represented as wireframe)",
        function: "Provides restorative force and centers the voice coil.",
        assemblyOrder: 6,
        connections: ["Basket", "Voice Coil", "Cone"],
        failureEffect: "Sagging or tearing, allowing the voice coil to rub against the magnet.",
        cascadeFailures: ["Voice Coil destruction"],
        originalPosition: { x: 0, y: -0.6, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 7. Cone (Diaphragm)
    const coneGeometry = new THREE.CylinderGeometry(5, 1.25, 2, 32, 1, true);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(0, 0.5, 0);
    cone.name = "coneMesh";
    group.add(cone);
    parts.push({
        name: "Cone (Diaphragm)",
        description: "The main moving surface that pushes air to create sound waves.",
        material: "Carbon Fiber / Paper / Plastic",
        function: "Translates voice coil motion into acoustic waves.",
        assemblyOrder: 7,
        connections: ["Voice Coil", "Surround", "Dust Cap"],
        failureEffect: "Tearing or buckling, leading to extreme distortion and loss of bass.",
        cascadeFailures: ["Acoustic cancellation"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 8. Surround (Outer Suspension)
    const surroundGeometry = new THREE.TorusGeometry(5.25, 0.3, 16, 64);
    const surround = new THREE.Mesh(surroundGeometry, rubber);
    surround.rotation.x = Math.PI / 2;
    surround.position.set(0, 1.5, 0);
    surround.name = "surroundMesh";
    group.add(surround);
    parts.push({
        name: "Surround",
        description: "The flexible ring connecting the cone edge to the basket.",
        material: "rubber",
        function: "Allows linear cone movement while sealing the air.",
        assemblyOrder: 8,
        connections: ["Cone", "Basket"],
        failureEffect: "Rotting or tearing, causing air leaks and loss of control over cone excursion.",
        cascadeFailures: ["Cone bottoming out", "Voice coil damage"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 }
    });

    // 9. Dust Cap
    const dustCapGeometry = new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dustCap = new THREE.Mesh(dustCapGeometry, neonBlue); // Make it glow for sci-fi effect
    dustCap.position.set(0, 0.4, 0);
    dustCap.name = "dustCapMesh";
    group.add(dustCap);
    parts.push({
        name: "Dust Cap",
        description: "Dome covering the voice coil gap.",
        material: "neonBlue (Plastic/Carbon)",
        function: "Prevents debris from entering the magnetic gap and provides structural rigidity to the cone.",
        assemblyOrder: 9,
        connections: ["Cone"],
        failureEffect: "Denting or detachment, causing high-frequency resonance or debris in gap.",
        cascadeFailures: ["Voice coil rubbing from debris"],
        originalPosition: { x: 0, y: 0.4, z: 0 },
        explodedPosition: { x: 0, y: 14, z: 0 }
    });

    // 10. Terminals
    const terminalGeo = new THREE.BoxGeometry(0.2, 0.5, 0.1);
    const terminal1 = new THREE.Mesh(terminalGeo, copper);
    terminal1.position.set(2, 0, 3.5);
    group.add(terminal1);
    
    const terminal2 = new THREE.Mesh(terminalGeo, copper);
    terminal2.position.set(1.5, 0, 3.8);
    group.add(terminal2);
    parts.push({
        name: "Terminals",
        description: "Connection points for speaker wire from the amplifier.",
        material: "copper",
        function: "Inputs the electrical audio signal into the voice coil.",
        assemblyOrder: 10,
        connections: ["Basket", "Voice Coil wires"],
        failureEffect: "Oxidation or breakage, resulting in intermittent or no signal.",
        cascadeFailures: [],
        originalPosition: { x: 1.75, y: 0, z: 3.65 },
        explodedPosition: { x: 5, y: -2, z: 8 }
    });

    const description = "A high-tech electrodynamic loudspeaker driver. It uses an electromagnet (voice coil) suspended in a permanent magnetic field. When alternating current (an audio signal) flows through the coil, it rapidly oscillates, moving the attached cone to push air and generate sound waves. The neon accents highlight the active components.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Voice Coil?",
            options: [
                "To generate a permanent magnetic field",
                "To act as an electromagnet that interacts with the permanent magnet",
                "To center the cone structurally",
                "To seal air inside the speaker enclosure"
            ],
            correct: 1,
            explanation: "The voice coil receives the electrical audio signal, becoming an electromagnet. Its changing polarity causes it to be pushed and pulled by the permanent magnet, driving the cone.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for keeping the voice coil centered in the magnetic gap?",
            options: [
                "The Basket",
                "The Surround",
                "The Spider (Inner Suspension)",
                "The Dust Cap"
            ],
            correct: 2,
            explanation: "The spider (or inner suspension) provides a restoring force and ensures the voice coil remains perfectly centered in the tight magnetic gap, preventing it from scraping the sides.",
            difficulty: "Hard"
        },
        {
            question: "If a speaker's 'Surround' rots away over time, what is the most likely consequence?",
            options: [
                "The permanent magnet loses its charge",
                "The speaker wires short circuit",
                "Air leaks occur and the cone loses controlled linear movement, risking severe damage",
                "The voice coil melts due to overheating"
            ],
            correct: 2,
            explanation: "The surround helps guide the cone linearly and seals the air. Without it, the cone flops uncontrollably (over-excursion) and acoustic short-circuiting severely reduces bass.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Excursion base on a low-frequency sine wave simulation
        const freq = 15; // Hz simulation multiplier
        const amplitude = 0.3; // excursion max
        
        // Complex wave to simulate bass drop
        const excursion = Math.sin(time * speed * freq) * amplitude + Math.sin(time * speed * freq * 0.5) * (amplitude * 0.5);

        meshes.forEach(mesh => {
            if (mesh.name === "voiceCoilMesh" || 
                mesh.name === "coneMesh" || 
                mesh.name === "dustCapMesh") {
                
                // Reset to original position + excursion
                const originalY = parts.find(p => {
                    if (mesh.name === "voiceCoilMesh") return p.name === "Voice Coil";
                    if (mesh.name === "coneMesh") return p.name === "Cone (Diaphragm)";
                    if (mesh.name === "dustCapMesh") return p.name === "Dust Cap";
                    return false;
                })?.originalPosition.y || 0;

                mesh.position.y = originalY + excursion;
                
                // Make the voice coil glow intensity pulse with the audio 'signal'
                if (mesh.name === "voiceCoilMesh" && mesh.material.emissiveIntensity !== undefined) {
                    mesh.material.emissiveIntensity = 0.5 + Math.abs(excursion) * 2;
                }
            }

            if (mesh.name === "spiderMesh") {
                const originalY = parts.find(p => p.name === "Spider (Inner Suspension)")?.originalPosition.y || -0.6;
                // Spider center moves with coil, edges stay fixed. 
                // We'll just move the whole mesh for simplicity in this standard geometry, 
                // but a vertex shader would be cooler for realistic flexing.
                mesh.position.y = originalY + excursion * 0.8; 
            }

            if (mesh.name === "surroundMesh") {
                 const originalY = parts.find(p => p.name === "Surround")?.originalPosition.y || 1.5;
                 // Surround flexes slightly less than cone
                 mesh.position.y = originalY + excursion * 0.9;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLoudspeaker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
