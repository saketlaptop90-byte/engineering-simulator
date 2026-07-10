import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const brassHornMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.5,
    });

    const woodBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2314,
        roughness: 0.8,
        metalness: 0.1,
    });

    const glowingSoundMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // Base Box
    const baseGeom = new THREE.BoxGeometry(4, 1.5, 4);
    const base = new THREE.Mesh(baseGeom, woodBaseMaterial);
    base.position.set(0, 0.75, 0);
    group.add(base);
    meshes.base = base;
    parts.push({
        name: "Wooden Base Cabinet",
        description: "Houses the spring motor and gearing mechanism.",
        material: "Mahogany Wood",
        function: "Structural support and acoustic resonance.",
        assemblyOrder: 1,
        connections: ["Spring Motor", "Turntable Platter"],
        failureEffect: "Vibrations and acoustic distortion.",
        cascadeFailures: ["Tracking error in stylus"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // Turntable Platter
    const platterGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    const platter = new THREE.Mesh(platterGeom, steel);
    platter.position.set(0, 1.55, 0);
    group.add(platter);
    meshes.platter = platter;
    parts.push({
        name: "Turntable Platter",
        description: "Rotates the record at a constant speed.",
        material: "Steel / Felt",
        function: "Spin the vinyl or shellac record.",
        assemblyOrder: 2,
        connections: ["Base", "Record", "Motor Shaft"],
        failureEffect: "Inconsistent playback speed (wow and flutter).",
        cascadeFailures: ["Unlistenable audio output"],
        originalPosition: { x: 0, y: 1.55, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // Record
    const recordGeom = new THREE.CylinderGeometry(1.7, 1.7, 0.05, 32);
    const recordMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const record = new THREE.Mesh(recordGeom, recordMat);
    record.position.set(0, 1.625, 0);
    group.add(record);
    meshes.record = record;
    parts.push({
        name: "Shellac Record",
        description: "Contains the audio information encoded in physical grooves.",
        material: "Shellac",
        function: "Audio storage medium.",
        assemblyOrder: 3,
        connections: ["Turntable Platter", "Stylus"],
        failureEffect: "Skipping or audio loss.",
        cascadeFailures: ["Stylus damage"],
        originalPosition: { x: 0, y: 1.625, z: 0 },
        explodedPosition: { x: 0, y: 4.5, z: 0 }
    });

    // Tonearm Base
    const tonearmBaseGeom = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 16);
    const tonearmBase = new THREE.Mesh(tonearmBaseGeom, darkSteel);
    tonearmBase.position.set(1.5, 1.9, 1.5);
    group.add(tonearmBase);
    meshes.tonearmBase = tonearmBase;

    // Tonearm
    const tonearmGeom = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16);
    const tonearm = new THREE.Mesh(tonearmGeom, chrome);
    tonearm.position.set(1.5, 2.3, 0.5);
    tonearm.rotation.x = Math.PI / 2;
    tonearm.rotation.z = -Math.PI / 6;
    group.add(tonearm);
    meshes.tonearm = tonearm;

    // Soundbox / Reproducer
    const soundboxGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const soundbox = new THREE.Mesh(soundboxGeom, copper);
    soundbox.position.set(0.5, 2.3, -0.2);
    soundbox.rotation.x = Math.PI / 2;
    group.add(soundbox);
    meshes.soundbox = soundbox;

    parts.push({
        name: "Tonearm & Reproducer",
        description: "Holds the stylus and converts physical vibrations into acoustic waves.",
        material: "Chrome / Copper / Mica",
        function: "Track grooves and generate initial acoustic energy.",
        assemblyOrder: 4,
        connections: ["Record", "Tonearm Base", "Horn"],
        failureEffect: "No audio picked up from the record.",
        cascadeFailures: ["Damage to record grooves"],
        originalPosition: { x: 1.5, y: 2.3, z: 0.5 },
        explodedPosition: { x: 3, y: 3, z: 2 }
    });

    // Horn Base (Connector)
    const hornBaseGeom = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const hornBase = new THREE.Mesh(hornBaseGeom, brassHornMaterial);
    hornBase.position.set(1.5, 2.3, 1.5);
    hornBase.rotation.x = Math.PI / 2;
    group.add(hornBase);

    // Horn
    const hornGeom = new THREE.CylinderGeometry(1.5, 0.1, 3, 32, 1, true);
    const horn = new THREE.Mesh(hornGeom, brassHornMaterial);
    horn.material.side = THREE.DoubleSide;
    horn.position.set(2.5, 4, 1.5);
    horn.rotation.z = Math.PI / 4;
    horn.rotation.x = -Math.PI / 8;
    group.add(horn);
    meshes.horn = horn;

    parts.push({
        name: "Acoustic Horn",
        description: "Massive brass horn that acts as an acoustic impedance transformer.",
        material: "Brass",
        function: "Amplify the sound waves generated by the reproducer.",
        assemblyOrder: 5,
        connections: ["Tonearm Base"],
        failureEffect: "Extremely quiet or muffled sound.",
        cascadeFailures: [],
        originalPosition: { x: 2.5, y: 4, z: 1.5 },
        explodedPosition: { x: 5, y: 6, z: 3 }
    });

    // Glowing Sound Waves (Visual Flair)
    const waveGeom = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
    const wave1 = new THREE.Mesh(waveGeom, glowingSoundMaterial);
    const wave2 = new THREE.Mesh(waveGeom, glowingSoundMaterial);
    const wave3 = new THREE.Mesh(waveGeom, glowingSoundMaterial);
    
    horn.add(wave1);
    horn.add(wave2);
    horn.add(wave3);
    
    meshes.waves = [wave1, wave2, wave3];

    // Crank
    const crankHandleGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const crankHandle = new THREE.Mesh(crankHandleGeom, steel);
    crankHandle.position.set(2.2, 1, 0);
    crankHandle.rotation.z = Math.PI / 2;
    group.add(crankHandle);
    meshes.crank = crankHandle;
    
    parts.push({
        name: "Winding Crank",
        description: "Used to manually wind the mainspring motor.",
        material: "Steel / Wood handle",
        function: "Provide mechanical energy to the system.",
        assemblyOrder: 6,
        connections: ["Spring Motor"],
        failureEffect: "Inability to power the gramophone.",
        cascadeFailures: ["Total system shutdown"],
        originalPosition: { x: 2.2, y: 1, z: 0 },
        explodedPosition: { x: 4, y: 1, z: 0 }
    });

    const description = "A vintage acoustic gramophone that utilizes mechanical energy from a spring motor to spin a record. The physical grooves are read by a stylus, creating vibrations that are mechanically amplified by an acoustic horn, all rendered with a stunning high-tech twist.";

    const quizQuestions = [
        {
            question: "What is the primary function of the massive brass horn on a vintage gramophone?",
            options: [
                "To electronically amplify the sound",
                "To act as an acoustic impedance transformer to couple the heavy reproducer diaphragm to the light air",
                "To cool the mechanical spring motor",
                "To prevent dust from settling on the record"
            ],
            correct: 1,
            explanation: "The horn acts as an acoustic transformer, matching the high acoustic impedance at the small reproducer to the low acoustic impedance of the open air, effectively amplifying the sound without electricity.",
            difficulty: "medium"
        },
        {
            question: "How does a purely acoustic gramophone receive power to turn the record?",
            options: [
                "A small battery pack hidden in the base",
                "Plugging into a wall outlet",
                "A manually wound mechanical spring motor",
                "Solar energy collected by the brass horn"
            ],
            correct: 2,
            explanation: "Vintage gramophones were entirely mechanical and relied on the user turning a crank to wind a coiled spring, which stored potential energy to rotate the turntable.",
            difficulty: "easy"
        },
        {
            question: "What component directly translates the physical grooves of the record into vibrations?",
            options: [
                "The Winding Crank",
                "The Turntable Platter",
                "The Stylus (needle) and Reproducer",
                "The Brass Horn"
            ],
            correct: 2,
            explanation: "The stylus traces the undulating grooves of the record, transferring these microscopic movements to the reproducer diaphragm, which creates sound waves.",
            difficulty: "easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the platter and record
        if (meshes.platter) meshes.platter.rotation.y += 0.05 * speed;
        if (meshes.record) meshes.record.rotation.y += 0.05 * speed;

        // Oscillate tonearm slightly to simulate tracking grooves
        if (meshes.tonearm) {
            meshes.tonearm.rotation.y = Math.sin(time * 0.5) * 0.05;
        }

        // Animate glowing sound waves emanating from the horn
        if (meshes.waves) {
            meshes.waves.forEach((wave, index) => {
                const offset = index * (Math.PI * 2 / 3);
                // Move waves out of the horn
                const wavePos = (time * speed * 2 + offset) % 4; 
                wave.position.y = wavePos - 1.5; // Moving along local Y of the horn
                
                // Expand radius as it moves out
                const scale = 1 + wavePos * 0.5;
                wave.scale.set(scale, scale, scale);
                
                // Fade out
                wave.material.opacity = Math.max(0, 0.8 - (wavePos / 4));
            });
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createGramophone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
