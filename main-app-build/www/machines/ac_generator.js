import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const magneticMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        wireframe: true
    });

    const baseGeo = new THREE.BoxGeometry(10, 1, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Stator Base',
        description: 'Heavy duty base supporting the AC Generator structure.',
        material: 'darkSteel',
        function: 'Provides structural stability and vibration damping.',
        assemblyOrder: 1,
        connections: ['Stator Frame'],
        failureEffect: 'Severe vibrations leading to mechanical failure.',
        cascadeFailures: ['Rotor shaft misalignment', 'Bearing failure'],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    const magnetGeo = new THREE.BoxGeometry(2, 6, 4);
    const magnetN = new THREE.Mesh(magnetGeo, new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 }));
    magnetN.position.set(-4, 3, 0);
    const magnetS = new THREE.Mesh(magnetGeo, new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.8, roughness: 0.2 }));
    magnetS.position.set(4, 3, 0);
    group.add(magnetN, magnetS);
    parts.push({
        name: 'Stator Magnets',
        description: 'Permanent magnets producing a strong, constant magnetic field.',
        material: 'steel (painted)',
        function: 'Creates the magnetic field necessary for electromagnetic induction.',
        assemblyOrder: 2,
        connections: ['Stator Base'],
        failureEffect: 'Loss of magnetic field, zero voltage generation.',
        cascadeFailures: ['No power output'],
        originalPosition: { x: -4, y: 3, z: 0 },
        explodedPosition: { x: -8, y: 3, z: 0 },
        mesh: magnetN
    });

    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 3, 0);
    
    const coilGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 100);
    const coilMesh = new THREE.Mesh(coilGeo, copper);
    coilMesh.rotation.x = Math.PI / 2;
    rotorGroup.add(coilMesh);
    
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.rotation.z = Math.PI / 2;
    rotorGroup.add(shaftMesh);

    group.add(rotorGroup);
    parts.push({
        name: 'Armature Coil & Shaft',
        description: 'Conducting copper coil rotating within the magnetic field.',
        material: 'copper, chrome',
        function: 'Induces alternating current as it cuts through magnetic flux lines.',
        assemblyOrder: 3,
        connections: ['Slip Rings', 'Turbine/Prime Mover'],
        failureEffect: 'Short circuit or broken connection, halting power generation.',
        cascadeFailures: ['Overheating', 'Slip ring arcing'],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: rotorGroup
    });

    const ringGeo = new THREE.TorusGeometry(0.8, 0.15, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo, aluminum);
    ring1.position.set(3, 3, 0);
    ring1.rotation.y = Math.PI / 2;
    const ring2 = new THREE.Mesh(ringGeo, aluminum);
    ring2.position.set(4, 3, 0);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring1, ring2);
    parts.push({
        name: 'Slip Rings',
        description: 'Continuous conductive rings attached to the rotating coil.',
        material: 'aluminum',
        function: 'Maintains electrical connection between the rotating coil and stationary external circuit without tangling.',
        assemblyOrder: 4,
        connections: ['Armature Coil', 'Brushes'],
        failureEffect: 'Poor electrical contact, causing arcing and power loss.',
        cascadeFailures: ['Brush degradation', 'Electrical fires'],
        originalPosition: { x: 3.5, y: 3, z: 0 },
        explodedPosition: { x: 7, y: 3, z: 0 },
        mesh: ring1
    });

    const brushGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const brush1 = new THREE.Mesh(brushGeo, rubber);
    brush1.position.set(3, 4, 0);
    const brush2 = new THREE.Mesh(brushGeo, rubber);
    brush2.position.set(4, 4, 0);
    group.add(brush1, brush2);
    parts.push({
        name: 'Carbon Brushes',
        description: 'Stationary contacts pressing against the slip rings.',
        material: 'carbon/rubber',
        function: 'Transfers induced alternating current from the rotating slip rings to the external circuit.',
        assemblyOrder: 5,
        connections: ['Slip Rings', 'External Circuit'],
        failureEffect: 'Loss of contact due to wear.',
        cascadeFailures: ['Voltage drops', 'Arcing'],
        originalPosition: { x: 3.5, y: 4, z: 0 },
        explodedPosition: { x: 7, y: 6, z: 0 },
        mesh: brush1
    });

    const waveGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
    const waveMesh = new THREE.Mesh(waveGeo, glowMaterial);
    waveMesh.position.set(0, 6, 0);
    group.add(waveMesh);
    parts.push({
        name: 'Energy Output Hologram',
        description: 'Visualizes the generated alternating current.',
        material: 'Neon Glow',
        function: 'Displays real-time electrical output.',
        assemblyOrder: 6,
        connections: [],
        failureEffect: 'None (UI Element)',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: waveMesh
    });

    const description = "The AC Generator operates on Faraday's Law of Electromagnetic Induction. As the armature coil rotates within the uniform magnetic field created by the stator magnets, the changing magnetic flux passing through the coil induces an electromotive force (EMF). Unlike DC generators, it uses continuous slip rings instead of a split-ring commutator, resulting in an alternating current (AC) output that changes direction every half rotation.";

    const quizQuestions = [
        {
            question: "Which component allows an AC generator to produce alternating current instead of direct current?",
            options: ["Split-ring commutator", "Permanent Magnets", "Slip rings", "Carbon brushes"],
            correct: 2,
            explanation: "Slip rings maintain a continuous connection to the same ends of the coil, causing the output current to alternate as the coil rotates through the magnetic field.",
            difficulty: "Medium"
        },
        {
            question: "What physical principle is primarily responsible for generating voltage in an AC Generator?",
            options: ["Ohm's Law", "Faraday's Law of Induction", "Newton's Third Law", "Thermodynamics"],
            correct: 1,
            explanation: "Faraday's Law states that a changing magnetic flux through a coil induces an electromotive force (EMF) in the coil.",
            difficulty: "Easy"
        },
        {
            question: "If the rotation speed of the armature coil is doubled, what happens to the induced peak voltage?",
            options: ["It remains the same", "It halves", "It doubles", "It quadruples"],
            correct: 2,
            explanation: "The induced voltage is proportional to the rate of change of magnetic flux. Doubling the rotation speed doubles the rate of change, thereby doubling the peak voltage.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (rotorGroup) {
            rotorGroup.rotation.x += 0.05 * speed;
        }
        if (waveMesh) {
            waveMesh.scale.setScalar(1 + 0.5 * Math.sin(time * speed * 2));
            if (waveMesh.material) {
                waveMesh.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * speed * 2);
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcGenerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
