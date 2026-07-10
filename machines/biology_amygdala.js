import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Create glowing materials
    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff1493,
        emissive: 0xff1493,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.3
    });

    const neuralSynapseGlow = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xff8c00,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // Parts geometry
    const createPart = (geometry, material, originalPosition, explodedPosition, metadata) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(originalPosition);
        mesh.userData = { ...metadata, originalPosition, explodedPosition };
        group.add(mesh);
        parts.push(mesh.userData);
        return mesh;
    };

    // Amygdala Central Nucleus (Almond shape)
    const centralNucleusGeo = new THREE.SphereGeometry(2, 32, 32);
    // make it almond shaped
    centralNucleusGeo.scale(1, 0.6, 0.5);
    const meshes = {};

    meshes.centralNucleus = createPart(
        centralNucleusGeo,
        neonPink,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 2, 0),
        {
            name: "Central Nucleus",
            description: "The core almond-shaped structure responsible for immediate fear responses.",
            material: "neonPink",
            function: "Initiates the body's acute stress response (fight or flight).",
            assemblyOrder: 1,
            connections: ["Basolateral Complex", "Hypothalamus Pathway"],
            failureEffect: "Inability to exhibit normal fear responses to threats.",
            cascadeFailures: ["Hypothalamus Pathway", "Autonomic Nervous System"]
        }
    );

    // Basolateral Complex
    const basolateralGeo = new THREE.CapsuleGeometry(1, 2, 16, 32);
    meshes.basolateralComplex = createPart(
        basolateralGeo,
        glass,
        new THREE.Vector3(2.5, 0, 0),
        new THREE.Vector3(5, 0, 0),
        {
            name: "Basolateral Complex",
            description: "The primary input region of the amygdala for sensory information.",
            material: "glass",
            function: "Receives sensory input and attaches emotional significance.",
            assemblyOrder: 2,
            connections: ["Central Nucleus", "Cortical Pathway"],
            failureEffect: "Impaired fear conditioning and emotional learning.",
            cascadeFailures: ["Central Nucleus"]
        }
    );

    // Hypothalamus Pathway (Neural Tracts)
    const tractGeo = new THREE.TorusGeometry(3, 0.2, 16, 100);
    meshes.hypothalamusTract = createPart(
        tractGeo,
        neuralSynapseGlow,
        new THREE.Vector3(-1.5, -2, 0),
        new THREE.Vector3(-4, -5, 0),
        {
            name: "Hypothalamus Output Tract",
            description: "Neural pathway transmitting signals to the hypothalamus.",
            material: "neuralSynapseGlow",
            function: "Triggers the release of stress hormones like cortisol and adrenaline.",
            assemblyOrder: 3,
            connections: ["Central Nucleus"],
            failureEffect: "Lack of physiological stress response despite perceiving a threat.",
            cascadeFailures: []
        }
    );

    // Cortical Pathway (Cognitive processing)
    const corticalGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8);
    meshes.corticalPathway = createPart(
        corticalGeo,
        neonBlue,
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(0, 6, 0),
        {
            name: "Cortical Pathway",
            description: "Connections to the prefrontal cortex for cognitive evaluation.",
            material: "neonBlue",
            function: "Modulates and potentially overrides the immediate fear response based on rational assessment.",
            assemblyOrder: 4,
            connections: ["Basolateral Complex"],
            failureEffect: "Inability to regulate or suppress irrational fears (phobias).",
            cascadeFailures: []
        }
    );

    const description = "The Amygdala is a vital almond-shaped cluster of nuclei located deep within the brain's medial temporal lobe. It acts as the integrative center for emotions, emotional behavior, and motivation, playing a paramount role in processing fear and threat-detection. This high-tech visualization illustrates its main subregions and neural pathways.";

    const quizQuestions = [
        {
            question: "Which part of the amygdala is primarily responsible for initiating the acute stress response?",
            options: ["Basolateral Complex", "Central Nucleus", "Cortical Pathway", "Cerebellum"],
            correct: 1,
            explanation: "The Central Nucleus is the main output region that sends signals to the brainstem and hypothalamus to initiate the physical 'fight or flight' response.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the Basolateral Complex?",
            options: ["Regulating heart rate", "Releasing cortisol", "Receiving sensory input and attaching emotional significance", "Controlling rational thought"],
            correct: 2,
            explanation: "The Basolateral Complex receives extensive sensory inputs from the cortex and thalamus, evaluating them for emotional and threat significance.",
            difficulty: "Hard"
        },
        {
            question: "Damage to the Cortical Pathway connecting the amygdala to the prefrontal cortex would most likely result in:",
            options: ["Complete blindness", "Inability to regulate or suppress irrational fears", "Loss of all motor function", "Enhanced memory recall"],
            correct: 1,
            explanation: "The prefrontal cortex helps to cognitively evaluate and dampen the amygdala's fear response. Without this top-down regulation, fears can become unchecked.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshesList) => {
        const t = time * speed;
        
        if (meshes.centralNucleus) {
            meshes.centralNucleus.rotation.y = t * 0.5;
            meshes.centralNucleus.rotation.z = Math.sin(t * 2) * 0.1;
            // Pulsing glow effect
            const intensity = 1.0 + Math.sin(t * 5) * 0.5;
            meshes.centralNucleus.material.emissiveIntensity = intensity;
        }

        if (meshes.basolateralComplex) {
            meshes.basolateralComplex.position.y = meshes.basolateralComplex.userData.originalPosition.y + Math.sin(t * 3) * 0.2;
            meshes.basolateralComplex.rotation.x = t * 0.3;
        }

        if (meshes.hypothalamusTract) {
            // Simulate action potentials firing
            meshes.hypothalamusTract.rotation.z = -t * 1.5;
            meshes.hypothalamusTract.scale.setScalar(1.0 + Math.sin(t * 10) * 0.05);
            meshes.hypothalamusTract.material.emissiveIntensity = 2.0 + Math.cos(t * 8) * 1.5;
        }

        if (meshes.corticalPathway) {
            meshes.corticalPathway.rotation.x = t * 0.8;
            meshes.corticalPathway.rotation.y = t * 0.6;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAmygdala() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
