import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing/neon materials for visual flair
    const neonBlueMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const neonRedMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0022,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2
    });

    const interferenceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0x6600ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        side: THREE.DoubleSide
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(15, 16, 2, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.y = -1;
    group.add(baseMesh);
    parts.push({
        name: "Demonstrator Base",
        description: "Heavy platform providing stability for precision acoustic experiments.",
        material: "darkSteel",
        function: "Structural support and vibration dampening.",
        assemblyOrder: 1,
        connections: ["Transducer Mounts", "Control Interface"],
        failureEffect: "Misalignment of transducers.",
        cascadeFailures: ["Loss of interference pattern accuracy"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Control Interface Ring
    const interfaceGeo = new THREE.TorusGeometry(15.5, 0.5, 16, 64);
    const interfaceMesh = new THREE.Mesh(interfaceGeo, chrome);
    interfaceMesh.position.y = 0;
    interfaceMesh.rotation.x = Math.PI / 2;
    group.add(interfaceMesh);
    parts.push({
        name: "Control Interface",
        description: "Holographic parameter control system for adjusting phase and frequency.",
        material: "chrome",
        function: "Operator input and system monitoring.",
        assemblyOrder: 2,
        connections: ["Demonstrator Base"],
        failureEffect: "Inability to tune acoustic properties.",
        cascadeFailures: ["Transducer desynchronization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Transducers (Sources)
    const sourceGeo = new THREE.SphereGeometry(1.5, 32, 32);
    
    // Source 1 (Left)
    const source1Group = new THREE.Group();
    source1Group.position.set(-5, 0, -5);
    const s1Mesh = new THREE.Mesh(sourceGeo, neonBlueMaterial);
    source1Group.add(s1Mesh);
    const s1Mount = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 4), aluminum);
    s1Mount.position.y = -2;
    source1Group.add(s1Mount);
    group.add(source1Group);
    
    parts.push({
        name: "Acoustic Transducer Alpha",
        description: "High-frequency acoustic emitter generating precisely tuned sound waves.",
        material: "neonBlueMaterial",
        function: "Emits the primary acoustic signal.",
        assemblyOrder: 3,
        connections: ["Demonstrator Base", "Waveform Controller"],
        failureEffect: "No primary wave generation.",
        cascadeFailures: ["Loss of interference pattern"],
        originalPosition: { x: -5, y: 0, z: -5 },
        explodedPosition: { x: -10, y: 5, z: -10 }
    });

    // Source 2 (Right)
    const source2Group = new THREE.Group();
    source2Group.position.set(5, 0, -5);
    const s2Mesh = new THREE.Mesh(sourceGeo, neonRedMaterial);
    source2Group.add(s2Mesh);
    const s2Mount = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 4), aluminum);
    s2Mount.position.y = -2;
    source2Group.add(s2Mount);
    group.add(source2Group);

    parts.push({
        name: "Acoustic Transducer Beta",
        description: "Secondary high-frequency acoustic emitter for interference generation.",
        material: "neonRedMaterial",
        function: "Emits the secondary acoustic signal.",
        assemblyOrder: 4,
        connections: ["Demonstrator Base", "Waveform Controller"],
        failureEffect: "No secondary wave generation.",
        cascadeFailures: ["Loss of interference pattern"],
        originalPosition: { x: 5, y: 0, z: -5 },
        explodedPosition: { x: 10, y: 5, z: -10 }
    });

    // Interference Field Visualization (Wave ripples)
    const numRipples = 10;
    const rippleMeshes = [];
    
    for (let i = 0; i < numRipples; i++) {
        const tGeo = new THREE.TorusGeometry(0.1, 0.2, 8, 64);
        const rMesh1 = new THREE.Mesh(tGeo, interferenceMaterial);
        const rMesh2 = new THREE.Mesh(tGeo, interferenceMaterial);
        
        rMesh1.rotation.x = Math.PI / 2;
        rMesh2.rotation.x = Math.PI / 2;
        
        rMesh1.position.copy(source1Group.position);
        rMesh2.position.copy(source2Group.position);
        
        // Store initial data for animation
        rMesh1.userData = { offset: i * (10 / numRipples), source: 1 };
        rMesh2.userData = { offset: i * (10 / numRipples), source: 2 };
        
        group.add(rMesh1);
        group.add(rMesh2);
        rippleMeshes.push(rMesh1, rMesh2);
    }
    
    parts.push({
        name: "Holographic Field Visualizer",
        description: "Projects the acoustic interference pattern visibly using laser suspension.",
        material: "interferenceMaterial",
        function: "Renders invisible acoustic waves visible.",
        assemblyOrder: 5,
        connections: ["Control Interface"],
        failureEffect: "Waves remain invisible.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // Detector Array
    const detectorGeo = new THREE.BoxGeometry(20, 1, 2);
    const detectorMesh = new THREE.Mesh(detectorGeo, steel);
    detectorMesh.position.set(0, 0, 8);
    group.add(detectorMesh);
    
    for(let i=0; i<11; i++) {
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.4), glass);
        node.position.set(-9 + i*1.8, 0.8, 8);
        group.add(node);
        // Tag node for pulsing
        node.userData = { isDetectorNode: true, index: i, x: node.position.x };
    }

    parts.push({
        name: "Acoustic Detector Array",
        description: "Linear array of high-sensitivity microphones to measure amplitude.",
        material: "steel",
        function: "Measures nodes and antinodes of the interference pattern.",
        assemblyOrder: 6,
        connections: ["Demonstrator Base"],
        failureEffect: "Unable to measure amplitude.",
        cascadeFailures: ["Data logging failure"],
        originalPosition: { x: 0, y: 0, z: 8 },
        explodedPosition: { x: 0, y: 5, z: 15 }
    });

    const description = "The Acoustics Interference Pattern Demonstrator visualizes the superposition of sound waves from two coherent sources. When waves intersect, they interfere constructively (increasing amplitude) or destructively (canceling out), creating a distinct pattern of nodes and antinodes detectable along the array.";

    const quizQuestions = [
        {
            question: "What phenomenon occurs when the crests of two waves from Transducer Alpha and Beta meet?",
            options: [
                "Destructive interference",
                "Constructive interference",
                "Refraction",
                "Diffraction"
            ],
            correct: 1,
            explanation: "Constructive interference happens when waves are in phase, and their amplitudes add together to create a larger wave crest.",
            difficulty: "easy"
        },
        {
            question: "What causes a 'node' (point of zero amplitude) along the Detector Array?",
            options: [
                "The waves are entirely absorbed.",
                "The sources stop emitting sound.",
                "A crest from one wave meets a trough from the other.",
                "The waves travel at different speeds."
            ],
            correct: 2,
            explanation: "A node is formed by destructive interference, where waves are exactly out of phase (crest meets trough) and cancel each other out.",
            difficulty: "medium"
        },
        {
            question: "If the distance between the two transducers is increased while keeping frequency constant, what happens to the distance between the antinodes on the detector array?",
            options: [
                "It increases",
                "It decreases",
                "It remains the same",
                "It fluctuates randomly"
            ],
            correct: 1,
            explanation: "Increasing the source separation (d) decreases the spacing between antinodes, as they are inversely proportional in the interference equation (y = L*lambda/d).",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate transducers pulsating
        s1Mesh.scale.setScalar(1 + 0.1 * Math.sin(time * speed * 5));
        s2Mesh.scale.setScalar(1 + 0.1 * Math.sin(time * speed * 5));

        // Animate ripples
        const maxRadius = 18;
        group.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'TorusGeometry' && child.userData.offset !== undefined) {
                let r = ((time * speed * 4 + child.userData.offset) % 10) / 10; // 0 to 1
                let currentRadius = r * maxRadius;
                
                // Avoid scale 0 error
                if (currentRadius < 0.1) currentRadius = 0.1;
                
                child.scale.set(currentRadius, currentRadius, 1);
                child.material.opacity = 0.6 * (1 - r); // Fade out as it expands
            }
            
            // Animate detector nodes based on interference math
            if (child.userData.isDetectorNode) {
                // Simplistic interference simulation
                const d1 = Math.sqrt(Math.pow(child.position.x - (-5), 2) + Math.pow(8 - (-5), 2));
                const d2 = Math.sqrt(Math.pow(child.position.x - (5), 2) + Math.pow(8 - (-5), 2));
                
                const wavelength = 2.0; // Arbitrary lambda
                const phaseDiff = (2 * Math.PI / wavelength) * Math.abs(d1 - d2);
                
                // Resultant amplitude
                const amplitude = Math.abs(Math.cos(phaseDiff / 2));
                
                // Pulse color and scale based on amplitude
                const intensity = (Math.sin(time * speed * 5) * 0.5 + 0.5) * amplitude;
                child.material.emissiveIntensity = intensity * 2;
                child.material.emissive.setHex(0x00ff00);
                child.scale.setScalar(0.5 + intensity * 0.8);
            }
        });
        
        interfaceMesh.rotation.z = time * speed * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticsInterferencePattern() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
