import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Next-Generation Neural Implant (Brain-Computer Interface): Capable of reading and writing high-fidelity synaptic signals to the cerebral cortex.";

    // Custom Materials
    const titanium = new THREE.MeshStandardMaterial({
        color: 0x889299,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.2
    });

    const platinumIridium = new THREE.MeshStandardMaterial({
        color: 0xe5e4e2,
        metalness: 1.0,
        roughness: 0.2
    });

    const glowBlue = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    const glowPulse = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 1,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const chipMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.6,
        roughness: 0.6
    });

    // 1. Biocompatible Titanium Housing
    const housingGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const housing = new THREE.Mesh(housingGeometry, titanium);
    housing.position.set(0, 0, 0);
    group.add(housing);
    parts.push({
        name: "Biocompatible Titanium Housing",
        description: "Provides a durable, non-reactive shell to protect internal components from the body's immune system.",
        material: titanium,
        function: "Protection and structural integrity",
        assemblyOrder: 5,
        connections: ["Signal Processor Chip", "Micro-electrode Array", "Power Coil"],
        failureEffect: "Tissue rejection, internal component short-circuit.",
        cascadeFailures: ["Signal Processor Chip", "Wireless Transceiver"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: housing
    });

    // 2. Micro-electrode Array
    const arrayGroup = new THREE.Group();
    for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
            if (i * i + j * j <= 10) { // circularish layout
                const needleGeo = new THREE.CylinderGeometry(0.02, 0.05, 1.5, 8);
                const needle = new THREE.Mesh(needleGeo, platinumIridium);
                needle.position.set(i * 0.3, -1, j * 0.3);
                arrayGroup.add(needle);
                
                const tipGeo = new THREE.SphereGeometry(0.04, 8, 8);
                const tip = new THREE.Mesh(tipGeo, glowBlue);
                tip.position.set(i * 0.3, -1.75, j * 0.3);
                arrayGroup.add(tip);
            }
        }
    }
    arrayGroup.position.set(0, 0, 0);
    group.add(arrayGroup);
    parts.push({
        name: "Cortical Micro-Electrode Array",
        description: "Thousands of platinum-iridium needles capturing synaptic sparks directly from the cortex.",
        material: platinumIridium,
        function: "Neural signal acquisition and stimulation",
        assemblyOrder: 1,
        connections: ["Signal Processor Chip"],
        failureEffect: "Loss of signal resolution, phantom stimuli.",
        cascadeFailures: ["Signal Processor Chip"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: arrayGroup
    });

    // 3. Signal Processor Chip
    const chipGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
    const chip = new THREE.Mesh(chipGeo, chipMaterial);
    chip.position.set(0, 0.3, 0);
    group.add(chip);
    parts.push({
        name: "Neural Signal Processor (NSP)",
        description: "Advanced neuromorphic chip that filters and decodes raw action potentials in real-time.",
        material: chipMaterial,
        function: "Data decoding and encoding",
        assemblyOrder: 3,
        connections: ["Cortical Micro-Electrode Array", "Wireless Transceiver"],
        failureEffect: "Garbled data transmission, cognitive lag.",
        cascadeFailures: ["Wireless Transceiver"],
        originalPosition: { x: 0, y: 0.3, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 0 },
        mesh: chip
    });

    // 4. Wireless Transceiver
    const transceiverGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const transceiver = new THREE.Mesh(transceiverGeo, chrome);
    transceiver.position.set(0, 0.45, 0);
    group.add(transceiver);
    
    const ledGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const led = new THREE.Mesh(ledGeo, glowPulse);
    led.position.set(0, 0.55, 0);
    group.add(led);

    const transGroup = new THREE.Group();
    transGroup.add(transceiver);
    transGroup.add(led);

    parts.push({
        name: "Quantum Telemetry Transceiver",
        description: "High-bandwidth wireless communicator linking the brain to external compute nodes.",
        material: chrome,
        function: "External data transfer",
        assemblyOrder: 4,
        connections: ["Neural Signal Processor (NSP)", "Power Coil"],
        failureEffect: "Connection drop, offline mode only.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.45, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: transGroup
    });

    // 5. Power Coil
    const coilGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const coil = new THREE.Mesh(coilGeo, copper);
    coil.position.set(0, 0.1, 0);
    coil.rotation.x = Math.PI / 2;
    group.add(coil);
    parts.push({
        name: "Inductive Power Coil",
        description: "Receives power wirelessly through the scalp via magnetic resonance.",
        material: copper,
        function: "Power supply",
        assemblyOrder: 2,
        connections: ["Neural Signal Processor (NSP)", "Quantum Telemetry Transceiver"],
        failureEffect: "Device shut down, loss of connection.",
        cascadeFailures: ["Neural Signal Processor (NSP)", "Quantum Telemetry Transceiver"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 0 },
        mesh: coil
    });

    // 6. Neural Interface Cables
    const cablesGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const cableGeo = new THREE.TorusGeometry(0.8, 0.05, 8, 32, Math.PI / 2);
        const cable = new THREE.Mesh(cableGeo, rubber);
        cable.position.set(
            Math.cos(i * Math.PI/2) * 1,
            -0.2,
            Math.sin(i * Math.PI/2) * 1
        );
        cable.rotation.y = i * Math.PI / 2;
        cable.rotation.x = Math.PI;
        cablesGroup.add(cable);
    }
    group.add(cablesGroup);
    parts.push({
        name: "Biocompatible Flex Cables",
        description: "Routes power and data between the array and the main processing unit.",
        material: rubber,
        function: "Internal connectivity",
        assemblyOrder: 6,
        connections: ["Cortical Micro-Electrode Array", "Neural Signal Processor (NSP)"],
        failureEffect: "Intermittent signal loss, cross-talk.",
        cascadeFailures: ["Neural Signal Processor (NSP)"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -0.5, z: 0 },
        mesh: cablesGroup
    });


    const quizQuestions = [
        {
            question: "What is the primary function of the Cortical Micro-Electrode Array in a Neural Implant?",
            options: [
                "To power the device",
                "To directly capture synaptic sparks and action potentials",
                "To transmit data wirelessly to external devices",
                "To cool the processing chip"
            ],
            correct: 1,
            explanation: "The micro-electrode array consists of needles that penetrate the cortex to physically interface with neurons, capturing their electrical signals.",
            difficulty: "Medium"
        },
        {
            question: "Why is titanium commonly used for the housing of the Neural Implant?",
            options: [
                "It is cheap and abundant",
                "It is highly magnetic, aiding in inductive charging",
                "It is biocompatible and resists rejection by the body's immune system",
                "It is transparent to radio waves"
            ],
            correct: 2,
            explanation: "Titanium is extremely biocompatible and non-reactive, making it ideal for medical implants where tissue rejection is a major risk.",
            difficulty: "Easy"
        },
        {
            question: "If the Inductive Power Coil fails, what cascade failure is most likely?",
            options: [
                "The Micro-electrode array will overheat",
                "The device will lose power, causing the processor and transceiver to shut down",
                "The patient will experience seizures",
                "The titanium housing will degrade"
            ],
            correct: 1,
            explanation: "Without power from the inductive coil, all active electrical components like the NSP and transceiver will cease functioning.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const pulseLED = Math.sin(time * 0.005 * speed) * 0.5 + 0.5;
        glowPulse.emissiveIntensity = pulseLED * 2;

        glowBlue.opacity = Math.sin(time * 0.01 * speed) * 0.2 + 0.6;

        meshes.forEach(meshObj => {
            if (meshObj.name === "Inductive Power Coil") {
                meshObj.mesh.rotation.z = time * 0.001 * speed;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createNeuralImplant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
