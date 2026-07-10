import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
    });

    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.6,
    });
    
    const glowingStrobe = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.0,
    });

    // 1. Base / Plinth
    const baseGeo = new THREE.BoxGeometry(4.5, 0.5, 3.5);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Plinth / Base',
        description: 'The heavy foundation that provides mass and isolates the turntable from external vibrations.',
        material: 'darkSteel',
        function: 'Vibration isolation and structural support',
        assemblyOrder: 1,
        connections: ['Feet', 'Platter Bearing', 'Tonearm Base', 'Motor Assembly'],
        failureEffect: 'Excessive vibration leading to stylus skipping and acoustic feedback.',
        cascadeFailures: ['Stylus Assembly'],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 },
        mesh: baseMesh
    });

    // 2. Isolation Feet (4x)
    const footGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 32);
    for(let i=0; i<4; i++) {
        const footMesh = new THREE.Mesh(footGeo, rubber);
        const px = (i%2 === 0 ? 1 : -1) * 2;
        const pz = (i < 2 ? 1 : -1) * 1.5;
        footMesh.position.set(px, 0.15, pz);
        group.add(footMesh);
    }
    // We'll represent feet as one logical part
    parts.push({
        name: 'Isolation Feet',
        description: 'Rubber-damped feet that decouple the turntable from the surface.',
        material: 'rubber',
        function: 'Damps low-frequency vibrations and resonance.',
        assemblyOrder: 2,
        connections: ['Plinth / Base'],
        failureEffect: 'Transmission of footfalls and bass frequencies to the stylus.',
        cascadeFailures: ['Platter System'],
        originalPosition: { x: 0, y: 0.15, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        // no single mesh reference since there are 4, or we can just group them
    });

    // 3. Platter
    const platterGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 64);
    const platterMesh = new THREE.Mesh(platterGeo, aluminum);
    platterMesh.position.set(-0.5, 0.6, 0);
    group.add(platterMesh);
    parts.push({
        name: 'Platter',
        description: 'Heavy rotating disc that supports the record and maintains speed consistency through rotational inertia.',
        material: 'aluminum',
        function: 'Provides a stable, rotating platform for the record.',
        assemblyOrder: 3,
        connections: ['Plinth / Base', 'Motor Belt', 'Spindle'],
        failureEffect: 'Wow and flutter (speed inconsistencies).',
        cascadeFailures: [],
        originalPosition: { x: -0.5, y: 0.6, z: 0 },
        explodedPosition: { x: -0.5, y: 2, z: 0 },
        mesh: platterMesh
    });

    // Strobe Dots on Platter
    const strobeGroup = new THREE.Group();
    const dotGeo = new THREE.BoxGeometry(0.05, 0.18, 0.05);
    for (let i = 0; i < 36; i++) {
        const dot = new THREE.Mesh(dotGeo, chrome);
        const angle = (i / 36) * Math.PI * 2;
        dot.position.set(Math.cos(angle) * 1.4, 0, Math.sin(angle) * 1.4);
        dot.rotation.y = -angle;
        strobeGroup.add(dot);
    }
    strobeGroup.position.set(-0.5, 0.6, 0);
    group.add(strobeGroup);
    
    // 4. Strobe Light
    const strobeLightGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
    const strobeLightMesh = new THREE.Mesh(strobeLightGeo, neonRed);
    strobeLightMesh.position.set(-2.0, 0.6, 1.2);
    strobeLightMesh.rotation.x = Math.PI / 2;
    group.add(strobeLightMesh);
    parts.push({
        name: 'Strobe Target Light',
        description: 'Emits pulses of light to illuminate the platter dots for visual speed calibration.',
        material: 'neonRed',
        function: 'Speed calibration reference.',
        assemblyOrder: 4,
        connections: ['Plinth / Base'],
        failureEffect: 'Inability to visually calibrate pitch/speed.',
        cascadeFailures: [],
        originalPosition: { x: -2.0, y: 0.6, z: 1.2 },
        explodedPosition: { x: -3.0, y: 1.0, z: 2.0 },
        mesh: strobeLightMesh
    });

    // 5. Tonearm Base / Gimbal
    const gimbalBaseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.4, 32);
    const gimbalBaseMesh = new THREE.Mesh(gimbalBaseGeo, chrome);
    gimbalBaseMesh.position.set(1.2, 0.7, -0.8);
    group.add(gimbalBaseMesh);
    
    const gimbalRingGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 32);
    const gimbalRingMesh = new THREE.Mesh(gimbalRingGeo, steel);
    gimbalRingMesh.position.set(1.2, 1.0, -0.8);
    gimbalRingMesh.rotation.x = Math.PI / 2;
    group.add(gimbalRingMesh);
    
    parts.push({
        name: 'Tonearm Gimbal & Pivot',
        description: 'Ultra-low friction bearing assembly allowing the tonearm to move freely vertically and horizontally.',
        material: 'chrome',
        function: 'Supports the tonearm and ensures precise tracking.',
        assemblyOrder: 5,
        connections: ['Plinth / Base', 'Tonearm Tube'],
        failureEffect: 'Tracking distortion and record wear.',
        cascadeFailures: ['Stylus Assembly', 'Vinyl Record'],
        originalPosition: { x: 1.2, y: 0.7, z: -0.8 },
        explodedPosition: { x: 1.2, y: 2.5, z: -0.8 },
        mesh: gimbalBaseMesh
    });

    // 6. Tonearm Tube
    const tonearmGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 16);
    const tonearmMesh = new THREE.Mesh(tonearmGeo, aluminum);
    // Pivot at gimbal
    tonearmMesh.position.set(1.2, 1.0, 0.0);
    tonearmMesh.rotation.x = Math.PI / 2;
    group.add(tonearmMesh);
    parts.push({
        name: 'Tonearm Tube',
        description: 'Rigid, lightweight S-shaped or straight tube that carries the signal from the cartridge.',
        material: 'aluminum',
        function: 'Positions the cartridge over the record.',
        assemblyOrder: 6,
        connections: ['Tonearm Gimbal & Pivot', 'Headshell & Cartridge', 'Counterweight'],
        failureEffect: 'Resonance, tracking errors.',
        cascadeFailures: [],
        originalPosition: { x: 1.2, y: 1.0, z: 0.0 },
        explodedPosition: { x: 2.5, y: 3.0, z: 0.0 },
        mesh: tonearmMesh
    });

    // 7. Counterweight
    const weightGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 32);
    const weightMesh = new THREE.Mesh(weightGeo, darkSteel);
    weightMesh.position.set(1.2, 1.0, -1.2);
    weightMesh.rotation.x = Math.PI / 2;
    group.add(weightMesh);
    parts.push({
        name: 'Counterweight',
        description: 'Adjustable mass at the rear of the tonearm to set the precise Vertical Tracking Force (VTF).',
        material: 'darkSteel',
        function: 'Balances the tonearm to apply correct stylus pressure.',
        assemblyOrder: 7,
        connections: ['Tonearm Tube'],
        failureEffect: 'Stylus jumping (too light) or record destruction (too heavy).',
        cascadeFailures: ['Stylus Assembly'],
        originalPosition: { x: 1.2, y: 1.0, z: -1.2 },
        explodedPosition: { x: 1.2, y: 3.0, z: -2.0 },
        mesh: weightMesh
    });

    // 8. Headshell, Cartridge & Stylus
    const headshellGroup = new THREE.Group();
    const headGeo = new THREE.BoxGeometry(0.2, 0.05, 0.4);
    const headMesh = new THREE.Mesh(headGeo, plastic);
    headshellGroup.add(headMesh);
    
    const cartridgeGeo = new THREE.BoxGeometry(0.15, 0.1, 0.25);
    const cartridgeMesh = new THREE.Mesh(cartridgeGeo, neonBlue);
    cartridgeMesh.position.set(0, -0.075, 0);
    headshellGroup.add(cartridgeMesh);

    const stylusGeo = new THREE.ConeGeometry(0.01, 0.05, 8);
    const stylusMesh = new THREE.Mesh(stylusGeo, chrome);
    stylusMesh.position.set(0, -0.15, 0.05);
    stylusMesh.rotation.x = Math.PI;
    headshellGroup.add(stylusMesh);

    headshellGroup.position.set(1.2, 1.0, 1.0);
    group.add(headshellGroup);
    parts.push({
        name: 'Cartridge & Stylus',
        description: 'Electromagnetic transducer (MM or MC) with a diamond tip that reads the record grooves.',
        material: 'neonBlue',
        function: 'Converts mechanical vibrations into electrical audio signals.',
        assemblyOrder: 8,
        connections: ['Tonearm Tube'],
        failureEffect: 'Severe audio distortion, loss of high frequencies, or no sound.',
        cascadeFailures: ['Vinyl Record'],
        originalPosition: { x: 1.2, y: 1.0, z: 1.0 },
        explodedPosition: { x: 1.2, y: 2.0, z: 3.0 },
        mesh: headshellGroup
    });

    // 9. Start/Stop Button
    const buttonGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
    const buttonMesh = new THREE.Mesh(buttonGeo, steel);
    buttonMesh.position.set(-1.8, 0.525, 1.3);
    group.add(buttonMesh);
    parts.push({
        name: 'Start/Stop Motor Control',
        description: 'Electronic switch to engage the high-torque direct drive or belt motor.',
        material: 'steel',
        function: 'Controls the rotation state of the platter.',
        assemblyOrder: 9,
        connections: ['Plinth / Base', 'Motor Assembly'],
        failureEffect: 'Platter fails to spin or stop.',
        cascadeFailures: [],
        originalPosition: { x: -1.8, y: 0.525, z: 1.3 },
        explodedPosition: { x: -3.0, y: 1.5, z: 2.5 },
        mesh: buttonMesh
    });

    // 10. Pitch Slider
    const pitchBaseGeo = new THREE.BoxGeometry(0.2, 0.02, 1.0);
    const pitchBaseMesh = new THREE.Mesh(pitchBaseGeo, darkSteel);
    pitchBaseMesh.position.set(1.8, 0.51, 0.5);
    group.add(pitchBaseMesh);
    
    const pitchKnobGeo = new THREE.BoxGeometry(0.25, 0.1, 0.1);
    const pitchKnobMesh = new THREE.Mesh(pitchKnobGeo, neonBlue);
    pitchKnobMesh.position.set(1.8, 0.55, 0.5);
    group.add(pitchKnobMesh);

    parts.push({
        name: 'Pitch Fader',
        description: 'Linear potentiometer for fine-tuning platter rotational speed (typically +/- 8%).',
        material: 'neonBlue',
        function: 'Adjusts motor speed for beatmatching or pitch correction.',
        assemblyOrder: 10,
        connections: ['Plinth / Base', 'Motor Control Circuit'],
        failureEffect: 'Inability to match tempos; erratic speed fluctuations.',
        cascadeFailures: [],
        originalPosition: { x: 1.8, y: 0.55, z: 0.5 },
        explodedPosition: { x: 3.0, y: 1.5, z: 0.5 },
        mesh: pitchKnobMesh
    });

    // Optional Vinyl Record (decorative / context)
    const vinylGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.02, 64);
    const vinylMesh = new THREE.Mesh(vinylGeo, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.1 }));
    vinylMesh.position.set(-0.5, 0.71, 0);
    group.add(vinylMesh);
    // Add grooves texture (simulated with rings)
    const labelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.021, 32);
    const labelMesh = new THREE.Mesh(labelGeo, neonRed);
    labelMesh.position.set(-0.5, 0.71, 0);
    group.add(labelMesh);

    const description = "A high-fidelity Audio Turntable designed for precision playback. Features a massive anti-resonant plinth, heavy machined platter, ultra-low friction gimbal tonearm, and an electromagnetic cartridge. Essential for audiophiles and DJs alike, relying on precise mechanical tracking to extract microscopic analog audio grooves.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Counterweight on a turntable's tonearm?",
            options: [
                "To control the speed of the platter.",
                "To apply the correct Vertical Tracking Force (VTF) for the stylus.",
                "To amplify the electrical signal from the cartridge.",
                "To prevent the tonearm from moving horizontally."
            ],
            correct: 1,
            explanation: "The counterweight precisely balances the tonearm, allowing the user to set the specific downward force (VTF) required by the cartridge manufacturer to track the groove accurately without damaging the record.",
            difficulty: "Medium"
        },
        {
            question: "What component directly converts the physical movement of the needle into an electrical audio signal?",
            options: [
                "The Platter",
                "The Pitch Fader",
                "The Cartridge",
                "The Plinth"
            ],
            correct: 2,
            explanation: "The cartridge contains magnets and coils. As the stylus (needle) traces the groove, it vibrates the cantilever, moving magnets near coils (or vice versa) to induce an electrical signal.",
            difficulty: "Easy"
        },
        {
            question: "Why do audiophile turntables have heavy, massive platters and plinths?",
            options: [
                "To increase the bass response of the audio.",
                "To prevent the turntable from being stolen.",
                "To maximize rotational inertia and reject external vibrations.",
                "To generate enough heat for the vacuum tubes."
            ],
            correct: 2,
            explanation: "Mass is critical in analog playback. A heavy platter maintains consistent speed (low wow & flutter) via inertia, while a heavy plinth resists acoustic feedback and environmental vibrations.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, explodedness) {
        // Spin the platter and strobe dots
        const rotationSpeed = speed * 0.05;
        platterMesh.rotation.y -= rotationSpeed;
        strobeGroup.rotation.y -= rotationSpeed;
        vinylMesh.rotation.y -= rotationSpeed;
        labelMesh.rotation.y -= rotationSpeed;

        // Animate strobe light pulse (if speed > 0)
        if (speed > 0) {
            strobeLightMesh.material.emissiveIntensity = 1.0 + Math.sin(time * 20) * 0.5;
        } else {
            strobeLightMesh.material.emissiveIntensity = 0.5;
        }

        // Move parts based on explodedness
        parts.forEach(part => {
            if (part.mesh && part.originalPosition && part.explodedPosition) {
                part.mesh.position.lerpVectors(
                    new THREE.Vector3(part.originalPosition.x, part.originalPosition.y, part.originalPosition.z),
                    new THREE.Vector3(part.explodedPosition.x, part.explodedPosition.y, part.explodedPosition.z),
                    explodedness
                );
            }
        });
        
        // Handle Tonearm grouping for explosion
        if (headshellGroup) {
            headshellGroup.position.lerpVectors(
                new THREE.Vector3(1.2, 1.0, 1.0),
                new THREE.Vector3(1.2, 2.0, 3.0),
                explodedness
            );
        }
        if (strobeGroup) {
            strobeGroup.position.lerpVectors(
                new THREE.Vector3(-0.5, 0.6, 0),
                new THREE.Vector3(-0.5, 2.0, 0),
                explodedness
            );
        }
        if (vinylMesh) {
            vinylMesh.position.lerpVectors(
                new THREE.Vector3(-0.5, 0.71, 0),
                new THREE.Vector3(-0.5, 2.11, 0),
                explodedness
            );
            labelMesh.position.lerpVectors(
                new THREE.Vector3(-0.5, 0.71, 0),
                new THREE.Vector3(-0.5, 2.11, 0),
                explodedness
            );
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTurntable() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
