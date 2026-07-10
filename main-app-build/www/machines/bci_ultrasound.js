import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const acousticWaveMat = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    const targetGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9
    });

    // Parts Construction

    // 1. Base / Positioning System
    const baseGeo = new THREE.CylinderGeometry(2.5, 2.8, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, 0, 0);
    group.add(base);
    meshes.base = base;
    parts.push({
        name: "Stereotactic Frame Base",
        description: "Provides rigid, high-precision positioning for the ultrasound transducer array, ensuring millimeter accuracy over the target area.",
        material: "Dark Steel",
        function: "Structural support and coordinate anchoring.",
        assemblyOrder: 1,
        connections: ["Robotic Positioning Arm"],
        failureEffect: "Loss of precision",
        cascadeFailures: ["Transducer Array", "Acoustic Coupling"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Robotic Positioning Arm
    const armGeo = new THREE.BoxGeometry(0.8, 4, 0.8);
    const arm = new THREE.Mesh(armGeo, aluminum);
    arm.position.set(0, 2.25, -1.5);
    arm.rotation.x = Math.PI / 8;
    group.add(arm);
    meshes.arm = arm;
    parts.push({
        name: "Multi-Axis Robotic Arm",
        description: "Motorized positioning arm with 6 degrees of freedom to orient the transducer array precisely against the skull.",
        material: "Aluminum",
        function: "Dynamic positioning",
        assemblyOrder: 2,
        connections: ["Stereotactic Frame Base", "Transducer Array"],
        failureEffect: "Inability to aim the focal point",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.25, z: -1.5},
        explodedPosition: {x: 0, y: 3, z: -3}
    });

    // 3. Transducer Array Housing (Hemispherical)
    const arrayGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const arrayMesh = new THREE.Mesh(arrayGeo, chrome);
    arrayMesh.position.set(0, 3.5, 0);
    arrayMesh.rotation.x = Math.PI; // Face downwards
    group.add(arrayMesh);
    meshes.transducerArray = arrayMesh;
    parts.push({
        name: "Phased Transducer Array Housing",
        description: "Houses hundreds of individual piezoelectric elements. Its hemispherical shape helps focus acoustic energy naturally.",
        material: "Chrome/Steel",
        function: "Encapsulates acoustic emitters",
        assemblyOrder: 3,
        connections: ["Robotic Positioning Arm", "Piezoelectric Elements"],
        failureEffect: "Array detachment",
        cascadeFailures: ["Piezoelectric Elements", "Cooling System"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0}
    });

    // 4. Piezoelectric Elements (Inner surface of the hemisphere)
    const elementsGeo = new THREE.SphereGeometry(1.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.3);
    const elementsMesh = new THREE.Mesh(elementsGeo, copper);
    elementsMesh.position.set(0, 3.48, 0);
    elementsMesh.rotation.x = Math.PI;
    group.add(elementsMesh);
    meshes.elements = elementsMesh;
    parts.push({
        name: "Piezoelectric Emitters",
        description: "Converts electrical pulses into high-frequency ultrasonic waves. Can be individually phase-shifted to steer the focal point.",
        material: "Copper/Ceramic",
        function: "Ultrasound generation",
        assemblyOrder: 4,
        connections: ["Transducer Array Housing"],
        failureEffect: "Loss of acoustic output",
        cascadeFailures: ["Acoustic Wave Focusing"],
        originalPosition: {x: 0, y: 3.48, z: 0},
        explodedPosition: {x: 0, y: 5.5, z: 0}
    });

    // 5. Acoustic Coupling Fluid/Membrane
    const membraneGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.2, 32);
    const membrane = new THREE.Mesh(membraneGeo, rubber);
    membrane.position.set(0, 1.8, 0);
    group.add(membrane);
    meshes.membrane = membrane;
    parts.push({
        name: "Acoustic Coupling Membrane",
        description: "A flexible, water-filled silicone membrane that interfaces with the scalp to ensure efficient transmission of ultrasound waves without air gaps.",
        material: "Rubber/Silicone",
        function: "Impedance matching",
        assemblyOrder: 5,
        connections: ["Transducer Array Housing", "Target Skull"],
        failureEffect: "Ultrasound reflection at boundary",
        cascadeFailures: ["Energy Delivery"],
        originalPosition: {x: 0, y: 1.8, z: 0},
        explodedPosition: {x: 0, y: 1.8, z: 2}
    });

    // 6. Deep Brain Target (Glowing Node)
    const targetGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const target = new THREE.Mesh(targetGeo, targetGlowMat);
    target.position.set(0, 0.5, 0);
    group.add(target);
    meshes.target = target;
    parts.push({
        name: "Neuromodulation Target (Focal Point)",
        description: "The precise 3D coordinate in deep brain tissue where acoustic waves constructively interfere, modulating neural activity.",
        material: "Glowing Energy",
        function: "Energy convergence zone",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "Off-target neuromodulation",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: 0.5, z: -2}
    });

    // 7. Converging Acoustic Waves (Visual effect)
    const waveGeo = new THREE.ConeGeometry(1.7, 1.5, 32, 1, true);
    const waveMesh = new THREE.Mesh(waveGeo, acousticWaveMat);
    waveMesh.position.set(0, 1.25, 0);
    waveMesh.rotation.x = Math.PI; // Point downwards
    group.add(waveMesh);
    meshes.waves = waveMesh;
    parts.push({
        name: "Acoustic Wavefronts",
        description: "High-frequency pressure waves converging from the array through the skull to the millimeter-sized focal point.",
        material: "Energy/Plasma",
        function: "Energy transmission",
        assemblyOrder: 7,
        connections: ["Piezoelectric Emitters", "Neuromodulation Target"],
        failureEffect: "Acoustic scattering",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 1.25, z: 0},
        explodedPosition: {x: -3, y: 1.25, z: 0}
    });

    // 8. Power & Control Cables
    const cableGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 24, Math.PI);
    const cable1 = new THREE.Mesh(cableGeo, plastic);
    cable1.position.set(1.5, 3.8, 0);
    cable1.rotation.y = Math.PI / 2;
    group.add(cable1);
    meshes.cable = cable1;
    parts.push({
        name: "Phase Control Bus",
        description: "High-bandwidth cables delivering precisely timed electrical impulses to each transducer element for phase steering.",
        material: "Plastic/Copper",
        function: "Signal routing",
        assemblyOrder: 8,
        connections: ["Transducer Array Housing"],
        failureEffect: "Loss of phase steering",
        cascadeFailures: ["Focal Point Accuracy"],
        originalPosition: {x: 1.5, y: 3.8, z: 0},
        explodedPosition: {x: 3, y: 4, z: 0}
    });

    const description = "Transcranial Focused Ultrasound (tFUS) is a non-invasive neuromodulation technology. By utilizing a phased array of hundreds of ultrasonic emitters, it focuses acoustic energy through the skull to a precise millimeter-scale target deep within the brain. At the focal point, the acoustic pressure waves modulate neural ion channels via mechanotransduction, temporarily inhibiting or exciting neural activity without surgical intervention.";

    const quizQuestions = [
        {
            question: "What is the primary mechanism by which tFUS alters neural activity?",
            options: [
                "Ionizing radiation causing DNA mutations",
                "Mechanotransduction affecting stretch-sensitive ion channels",
                "Direct electrical stimulation of the cortex",
                "Magnetic induction of currents"
            ],
            correct: 1,
            explanation: "tFUS uses acoustic pressure waves that exert mechanical force on cell membranes, opening or closing mechanosensitive ion channels to modulate action potentials.",
            difficulty: "Medium"
        },
        {
            question: "Why is a hemispherical phased array typically used in tFUS?",
            options: [
                "It looks aesthetically pleasing",
                "To geometrically concentrate the acoustic waves naturally at a central focal point",
                "To reduce the weight of the device",
                "To prevent the brain from overheating"
            ],
            correct: 1,
            explanation: "The hemispherical geometry naturally directs all transducer elements toward a common center. Phase-shifting individual elements allows fine-tuning and steering of this focal point.",
            difficulty: "Easy"
        },
        {
            question: "What is the purpose of the acoustic coupling membrane/fluid?",
            options: [
                "To cool down the patient's head",
                "To inject contrast dye into the scalp",
                "To eliminate air gaps, preventing ultrasound waves from reflecting off the skin",
                "To measure EEG signals"
            ],
            correct: 2,
            explanation: "Ultrasound waves reflect heavily at air-tissue interfaces due to impedance mismatch. Coupling fluid or gel ensures smooth transmission of energy from the device into the body.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the focal target
        const pulse = (Math.sin(time * speed * 5) + 1) / 2; // 0 to 1
        if (meshes.target && meshes.target.material) {
            meshes.target.material.emissiveIntensity = 2 + pulse * 3;
            meshes.target.scale.setScalar(1 + pulse * 0.2);
        }

        // Animate the acoustic waves (opacity fading and scaling)
        if (meshes.waves) {
            meshes.waves.scale.y = 1 + (Math.sin(time * speed * 3) * 0.05);
            meshes.waves.material.opacity = 0.3 + (Math.sin(time * speed * 8) + 1) * 0.15;
        }
        
        // Slight hovering of the arm to simulate micro-adjustments
        if (meshes.arm) {
            meshes.arm.position.y = 2.25 + Math.sin(time * speed) * 0.02;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFocusedUltrasound() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
