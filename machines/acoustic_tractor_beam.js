import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for acoustic waves and levitating object
    const acousticWaveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const levitatingMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
    });
    
    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(4, 4.5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, 0, 0);
    group.add(base);
    parts.push({
        name: "Power Base",
        description: "Houses the high-voltage power supply and acoustic modulation circuitry.",
        material: darkSteel,
        function: "Provides power and structural stability.",
        assemblyOrder: 1,
        connections: ["Transducer Array Support"],
        failureEffect: "Loss of power, dropping the levitated object.",
        cascadeFailures: ["Transducer Array", "Control Interface"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: base
    });

    // 2. Transducer Array Support (Lower)
    const lowerSupportGeo = new THREE.TorusGeometry(3.5, 0.3, 16, 64);
    const lowerSupport = new THREE.Mesh(lowerSupportGeo, chrome);
    lowerSupport.rotation.x = Math.PI / 2;
    lowerSupport.position.set(0, 0.5, 0);
    group.add(lowerSupport);
    parts.push({
        name: "Lower Transducer Ring",
        description: "Mounting ring for the lower phased acoustic transducers.",
        material: chrome,
        function: "Supports and aligns the lower acoustic emitters.",
        assemblyOrder: 2,
        connections: ["Power Base", "Support Pillars"],
        failureEffect: "Misalignment of acoustic field, causing object instability.",
        cascadeFailures: ["Acoustic Field"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        mesh: lowerSupport
    });

    // Lower Transducers
    for(let i=0; i<12; i++) {
        const transGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
        const trans = new THREE.Mesh(transGeo, copper);
        const angle = (i / 12) * Math.PI * 2;
        trans.position.set(Math.cos(angle) * 3.5, 0.6, Math.sin(angle) * 3.5);
        // point towards center slightly
        trans.lookAt(0, 3, 0);
        group.add(trans);
    }

    // 3. Support Pillars
    const pillars = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
        const pillar = new THREE.Mesh(pillarGeo, aluminum);
        const angle = (i / 3) * Math.PI * 2;
        pillar.position.set(Math.cos(angle) * 3.8, 4.5, Math.sin(angle) * 3.8);
        pillars.add(pillar);
    }
    group.add(pillars);
    parts.push({
        name: "Support Pillars",
        description: "Maintains exact distance between upper and lower transducer arrays.",
        material: aluminum,
        function: "Structural support and acoustic resonance dampening.",
        assemblyOrder: 3,
        connections: ["Lower Transducer Ring", "Upper Transducer Ring"],
        failureEffect: "Collapse of upper array, destroying the device.",
        cascadeFailures: ["Upper Transducer Ring", "Levitating Object"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 4.5, z: 3 },
        mesh: pillars
    });

    // 4. Transducer Array Support (Upper)
    const upperSupportGeo = new THREE.TorusGeometry(3.5, 0.3, 16, 64);
    const upperSupport = new THREE.Mesh(upperSupportGeo, chrome);
    upperSupport.rotation.x = Math.PI / 2;
    upperSupport.position.set(0, 8.5, 0);
    group.add(upperSupport);
    parts.push({
        name: "Upper Transducer Ring",
        description: "Mounting ring for the upper phased acoustic transducers.",
        material: chrome,
        function: "Reflects and focuses acoustic waves downwards.",
        assemblyOrder: 4,
        connections: ["Support Pillars"],
        failureEffect: "Loss of acoustic interference pattern.",
        cascadeFailures: ["Acoustic Field"],
        originalPosition: { x: 0, y: 8.5, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 },
        mesh: upperSupport
    });

    // Upper Transducers
    for(let i=0; i<12; i++) {
        const transGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
        const trans = new THREE.Mesh(transGeo, copper);
        const angle = (i / 12) * Math.PI * 2;
        trans.position.set(Math.cos(angle) * 3.5, 8.4, Math.sin(angle) * 3.5);
        // point towards center slightly
        trans.lookAt(0, 5, 0);
        group.add(trans);
    }

    // 5. Central Control Interface
    const controlGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const control = new THREE.Mesh(controlGeo, plastic);
    control.position.set(0, 0.5, 4.5);
    group.add(control);
    
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.8);
    const screenMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.5, 5.01);
    group.add(screen);

    parts.push({
        name: "Control Interface",
        description: "Touchscreen interface for adjusting frequency, amplitude, and focal point.",
        material: plastic,
        function: "User control and telemetry readout.",
        assemblyOrder: 5,
        connections: ["Power Base"],
        failureEffect: "Inability to adjust the beam.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.5, z: 4.5 },
        explodedPosition: { x: 0, y: 0.5, z: 7 },
        mesh: control
    });

    // 6. Levitating Object (Target)
    const targetGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const target = new THREE.Mesh(targetGeo, levitatingMaterial);
    target.position.set(0, 4.5, 0);
    group.add(target);
    parts.push({
        name: "Levitating Object",
        description: "A test mass suspended in the acoustic nodes.",
        material: levitatingMaterial,
        function: "Demonstrates the capability of the tractor beam.",
        assemblyOrder: 6,
        connections: ["Acoustic Field"],
        failureEffect: "Falls to the base.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 6.5, z: 0 },
        mesh: target
    });

    // 7. Acoustic Waves (Visuals)
    const waves = new THREE.Group();
    for(let i = 0; i < 5; i++) {
        const waveGeo = new THREE.TorusGeometry(1 + i * 0.2, 0.05, 8, 32);
        const wave = new THREE.Mesh(waveGeo, acousticWaveMaterial);
        wave.rotation.x = Math.PI / 2;
        wave.position.y = 1 + i;
        waves.add(wave);
    }
    group.add(waves);
    parts.push({
        name: "Acoustic Waves",
        description: "Visual representation of the high-intensity ultrasonic standing waves.",
        material: acousticWaveMaterial,
        function: "Creates pressure nodes to trap and manipulate matter.",
        assemblyOrder: 7,
        connections: ["Lower Transducer Ring", "Upper Transducer Ring"],
        failureEffect: "Disperses into random noise.",
        cascadeFailures: ["Levitating Object"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 4.5, z: 0 },
        mesh: waves
    });

    const description = "The Acoustic Tractor Beam uses phased arrays of ultrasonic transducers to create complex acoustic standing waves. By electronically shifting the phases of the emitted sound waves, high-pressure acoustic nodes can trap objects in mid-air and move them dynamically, effectively creating a 'tractor beam' that functions in atmospheric conditions.";

    const quizQuestions = [
        {
            question: "What physical phenomenon does the Acoustic Tractor Beam use to trap objects?",
            options: ["Electromagnetic induction", "Acoustic standing waves", "Quantum locking", "Gravitational waves"],
            correct: 1,
            explanation: "It uses acoustic standing waves created by intersecting ultrasonic beams to form high and low pressure nodes that hold objects in place.",
            difficulty: "Medium"
        },
        {
            question: "How does the beam move the trapped object?",
            options: ["By physically tilting the machine", "By altering the ambient air pressure", "By electronically shifting the phase of the emitted sound waves", "By using a magnetic field"],
            correct: 2,
            explanation: "By electronically adjusting the phase of the transducers, the position of the acoustic nodes moves, dragging the trapped object with it.",
            difficulty: "Hard"
        },
        {
            question: "What is a major limitation of an Acoustic Tractor Beam compared to theoretical electromagnetic ones?",
            options: ["It only works on magnetic materials", "It requires a transmission medium like air or water to function", "It is only effective at absolute zero", "It requires a nuclear power source"],
            correct: 1,
            explanation: "Because sound requires a physical medium to travel, an acoustic tractor beam cannot work in a vacuum like outer space.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate levitating object hovering and rotating
        const targetMesh = parts.find(p => p.name === "Levitating Object")?.mesh;
        if (targetMesh) {
            targetMesh.rotation.y += 0.02 * speed;
            targetMesh.rotation.x += 0.01 * speed;
            targetMesh.position.y = 4.5 + Math.sin(time * speed * 2) * 0.5;
        }

        // Animate acoustic waves pulsating and moving towards the center
        const wavesMesh = parts.find(p => p.name === "Acoustic Waves")?.mesh;
        if (wavesMesh) {
            wavesMesh.children.forEach((wave, index) => {
                wave.scale.setScalar(1 + Math.sin(time * speed * 5 + index) * 0.1);
                // Move waves vertically to simulate traveling wave interference
                let targetY = 1.5 + ((index + (time * speed * 2)) % 5) * 1.2;
                wave.position.y = targetY;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticTractorBeam() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
