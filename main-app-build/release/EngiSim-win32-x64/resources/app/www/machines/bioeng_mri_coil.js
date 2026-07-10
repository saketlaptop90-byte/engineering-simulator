import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });
    
    const pulseMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.5
    });

    // 1. Base Cylinder / Shield
    const shieldGeo = new THREE.CylinderGeometry(12, 12, 30, 32, 1, true);
    const shield = new THREE.Mesh(shieldGeo, aluminum);
    shield.rotation.z = Math.PI / 2;
    group.add(shield);
    parts.push({
        name: 'RF Shield',
        description: 'Prevents external electromagnetic interference and contains the RF field within the coil volume.',
        material: 'aluminum',
        function: 'Electromagnetic Isolation',
        assemblyOrder: 1,
        connections: ['Coil Form'],
        failureEffect: 'Severe image artifacts due to external RF noise.',
        cascadeFailures: ['Signal-to-Noise Ratio Degradation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: shield
    });
    
    // 2. Inner Support Form
    const formGeo = new THREE.CylinderGeometry(10, 10, 28, 32, 1, true);
    const form = new THREE.Mesh(formGeo, plastic);
    form.rotation.z = Math.PI / 2;
    group.add(form);
    parts.push({
        name: 'Coil Support Form',
        description: 'Dielectric cylinder that structurally supports the conductive rungs and rings.',
        material: 'plastic',
        function: 'Structural Support',
        assemblyOrder: 2,
        connections: ['RF Shield', 'Conductive Rungs'],
        failureEffect: 'Mechanical instability leading to detuning.',
        cascadeFailures: ['RF Field Asymmetry'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -20 },
        mesh: form
    });

    // 3. Birdcage Rungs
    const rungsGroup = new THREE.Group();
    const numRungs = 16;
    for (let i = 0; i < numRungs; i++) {
        const rungGeo = new THREE.BoxGeometry(26, 0.5, 0.5);
        const rung = new THREE.Mesh(rungGeo, copper);
        const angle = (i / numRungs) * Math.PI * 2;
        rung.position.y = Math.sin(angle) * 10;
        rung.position.z = Math.cos(angle) * 10;
        rungsGroup.add(rung);
    }
    group.add(rungsGroup);
    parts.push({
        name: 'Conductive Rungs',
        description: 'Longitudinal conductive segments of the birdcage coil that generate the B1 RF field.',
        material: 'copper',
        function: 'RF Field Generation',
        assemblyOrder: 3,
        connections: ['End Rings', 'Coil Support Form'],
        failureEffect: 'Loss of RF uniformity or complete failure to transmit.',
        cascadeFailures: ['Image Dropout', 'SAR Increase'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 },
        mesh: rungsGroup
    });

    // 4. End Rings
    const ringsGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(10, 0.3, 16, 64);
    
    const ring1 = new THREE.Mesh(ringGeo, copper);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.x = 13;
    ringsGroup.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeo, copper);
    ring2.rotation.y = Math.PI / 2;
    ring2.position.x = -13;
    ringsGroup.add(ring2);
    
    group.add(ringsGroup);

    parts.push({
        name: 'End Rings',
        description: 'Circular conductive loops that connect the rungs, forming a resonant structure.',
        material: 'copper',
        function: 'Current Return Path',
        assemblyOrder: 4,
        connections: ['Conductive Rungs', 'Tuning Capacitors'],
        failureEffect: 'Shift in resonant frequency, rendering coil useless.',
        cascadeFailures: ['Impedance Mismatch'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 0, z: 0 },
        mesh: ringsGroup
    });

    // 5. Tuning Capacitors
    const capsGroup = new THREE.Group();
    for (let i = 0; i < numRungs; i++) {
        const capGeo = new THREE.BoxGeometry(1, 1, 1);
        const cap = new THREE.Mesh(capGeo, chrome);
        const angle = (i / numRungs) * Math.PI * 2;
        cap.position.y = Math.sin(angle) * 10;
        cap.position.z = Math.cos(angle) * 10;
        cap.position.x = 13;
        capsGroup.add(cap);
        
        const cap2 = new THREE.Mesh(capGeo, chrome);
        cap2.position.y = Math.sin(angle) * 10;
        cap2.position.z = Math.cos(angle) * 10;
        cap2.position.x = -13;
        capsGroup.add(cap2);
    }
    group.add(capsGroup);
    parts.push({
        name: 'Tuning Capacitors',
        description: 'Distributed capacitance used to tune the coil to the exact Larmor frequency of the nucleus (e.g., 64MHz for 1.5T).',
        material: 'chrome',
        function: 'Resonance Tuning',
        assemblyOrder: 5,
        connections: ['End Rings', 'Conductive Rungs'],
        failureEffect: 'Detuning of the coil, destroying SNR.',
        cascadeFailures: ['Reflected Power to Amplifier'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 },
        mesh: capsGroup
    });

    // 6. Phantom / Imaging Subject
    const phantomGeo = new THREE.CylinderGeometry(4, 4, 20, 32);
    const phantom = new THREE.Mesh(phantomGeo, glass);
    phantom.rotation.z = Math.PI / 2;
    group.add(phantom);
    parts.push({
        name: 'Calibration Phantom',
        description: 'A liquid-filled container (often doped water) used to calibrate and test the RF coil.',
        material: 'glass',
        function: 'Signal Source',
        assemblyOrder: 6,
        connections: [],
        failureEffect: 'Inaccurate calibration if concentration is wrong.',
        cascadeFailures: ['Incorrect Flip Angles'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 20 },
        mesh: phantom
    });

    // 7. RF Pulse Visualizer
    const visualizerGroup = new THREE.Group();
    const pulseGeo = new THREE.TorusGeometry(5, 0.5, 16, 64);
    const pulse1 = new THREE.Mesh(pulseGeo, pulseMaterial);
    pulse1.rotation.y = Math.PI / 2;
    visualizerGroup.add(pulse1);
    
    const pulse2 = new THREE.Mesh(pulseGeo, glowMaterial);
    pulse2.rotation.y = Math.PI / 2;
    visualizerGroup.add(pulse2);
    
    group.add(visualizerGroup);

    parts.push({
        name: 'RF Field Visualizer',
        description: 'Visualization of the oscillating B1 field produced by the RF coil.',
        material: 'glowing',
        function: 'Visual Feedback',
        assemblyOrder: 7,
        connections: [],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: visualizerGroup
    });

    const description = "The MRI Birdcage Radio Frequency (RF) Coil is a highly homogeneous volume resonator used to transmit B1 fields and receive NMR signals from hydrogen protons in a patient.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the birdcage coil design in MRI?",
            options: [
                "To generate the strong B0 static magnetic field.",
                "To generate highly homogeneous B1 RF fields.",
                "To spatially encode the signal with gradients.",
                "To shield the patient from radiation."
            ],
            correct: 1,
            explanation: "The birdcage design produces a highly homogeneous B1 radiofrequency field across its interior volume.",
            difficulty: "Medium"
        },
        {
            question: "What role do the tuning capacitors play in the RF coil?",
            options: [
                "They generate the main magnetic field.",
                "They cool down the copper rungs.",
                "They adjust the resonant frequency to match the Larmor frequency.",
                "They protect the patient from acoustic noise."
            ],
            correct: 2,
            explanation: "Capacitors distributed along the rings or rungs tune the coil's resonant frequency to precisely match the Larmor frequency of the nucleus being imaged.",
            difficulty: "Hard"
        },
        {
            question: "Why is the RF shield important?",
            options: [
                "It isolates the coil from external electromagnetic noise and prevents the coil's RF from radiating outward.",
                "It prevents the patient from seeing the coil.",
                "It acts as the primary signal amplifier.",
                "It generates the gradient fields."
            ],
            correct: 0,
            explanation: "The shield contains the RF energy within the coil and prevents environmental RF noise from entering and causing image artifacts.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the RF pulses
        if (meshes && meshes['RF Field Visualizer'] && meshes['RF Field Visualizer'].mesh) {
            const visualizerGroup = meshes['RF Field Visualizer'].mesh;
            const pulse1 = visualizerGroup.children[0];
            const pulse2 = visualizerGroup.children[1];
            
            if (pulse1 && pulse2) {
                // Pulsing effect
                const scale = 1 + Math.sin(time * speed * 5) * 0.5;
                pulse1.scale.set(scale, scale, scale);
                pulse2.scale.set(1.5 - scale * 0.5, 1.5 - scale * 0.5, 1.5 - scale * 0.5);
                
                pulse1.material.opacity = Math.max(0.1, Math.sin(time * speed * 5) * 0.8);
                pulse2.material.opacity = Math.max(0.1, Math.cos(time * speed * 5) * 0.8);
                
                // Rotation
                pulse1.rotation.x += 0.05 * speed;
                pulse2.rotation.z -= 0.05 * speed;
            }
        }
        
        // Spin the phantom slightly
        if (meshes && meshes['Calibration Phantom'] && meshes['Calibration Phantom'].mesh) {
            meshes['Calibration Phantom'].mesh.rotation.x += 0.01 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMriCoil() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
