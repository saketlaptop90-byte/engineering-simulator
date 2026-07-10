import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for glowing/neon effects
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const neonGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.6
    });

    const glowingCore = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 3
    });

    // --- Enzyme Core ---
    const coreGeo = new THREE.TorusGeometry(3, 1.2, 16, 64, Math.PI * 1.5);
    const enzymeCoreMesh = new THREE.Mesh(coreGeo, chrome);
    enzymeCoreMesh.rotation.x = Math.PI / 2;
    group.add(enzymeCoreMesh);
    parts.push({
        name: 'N-Gate (Enzyme Core)',
        description: 'The main structural chassis of the Topoisomerase enzyme, responsible for capturing the DNA segment.',
        material: 'chrome',
        function: 'Captures and secures the double-stranded DNA segment to be cleaved.',
        assemblyOrder: 1,
        connections: ['C-Gate', 'DNA Strand'],
        failureEffect: 'Inability to bind to DNA, rendering the enzyme inactive.',
        cascadeFailures: ['DNA supercoiling buildup', 'Replication fork stall'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // --- Catalytic Jaw Top (C-Gate) ---
    const jawTopGeo = new THREE.CylinderGeometry(1.5, 2.5, 2, 32);
    const jawTopMesh = new THREE.Mesh(jawTopGeo, aluminum);
    jawTopMesh.position.set(0, 2.5, 0);
    group.add(jawTopMesh);
    parts.push({
        name: 'Cleavage Core (C-Gate) Top',
        description: 'The upper catalytic domain containing the active site tyrosine that cleaves the DNA backbone.',
        material: 'aluminum',
        function: 'Cuts the phosphodiester backbone of the DNA strand.',
        assemblyOrder: 2,
        connections: ['N-Gate', 'DNA Strand'],
        failureEffect: 'DNA cleavage fails; tension cannot be relieved.',
        cascadeFailures: ['DNA strand breakage', 'Cell apoptosis'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // --- Catalytic Jaw Bottom (C-Gate) ---
    const jawBottomGeo = new THREE.CylinderGeometry(2.5, 1.5, 2, 32);
    const jawBottomMesh = new THREE.Mesh(jawBottomGeo, aluminum);
    jawBottomMesh.position.set(0, -2.5, 0);
    group.add(jawBottomMesh);
    parts.push({
        name: 'Cleavage Core (C-Gate) Bottom',
        description: 'The lower catalytic domain that stabilizes the cleaved DNA ends.',
        material: 'aluminum',
        function: 'Holds the cut DNA ends to prevent them from flying apart uncontrollably.',
        assemblyOrder: 3,
        connections: ['N-Gate', 'DNA Strand'],
        failureEffect: 'DNA ends detach prematurely, causing double-strand breaks.',
        cascadeFailures: ['Severe genetic mutation', 'Lethal chromosomal fragmentation'],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // --- Swivel Mechanism ---
    const swivelGeo = new THREE.TorusGeometry(2.5, 0.5, 16, 64);
    const swivelMesh = new THREE.Mesh(swivelGeo, neonBlue);
    swivelMesh.rotation.x = Math.PI / 2;
    group.add(swivelMesh);
    parts.push({
        name: 'Swivel Domain',
        description: 'A highly flexible joint that allows the cleaved DNA to rotate around the intact strand.',
        material: 'neonBlue',
        function: 'Facilitates the controlled rotation of DNA to relieve torsional strain.',
        assemblyOrder: 4,
        connections: ['Cleavage Core', 'T-Segment DNA'],
        failureEffect: 'DNA cannot rotate; tension remains unrelieved.',
        cascadeFailures: ['Replication machinery halts'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // --- ATP Binding Pockets ---
    const atpGeo = new THREE.SphereGeometry(1, 16, 16);
    const atpLeft = new THREE.Mesh(atpGeo, glowingCore);
    atpLeft.position.set(-3, 1, 0);
    const atpRight = new THREE.Mesh(atpGeo, glowingCore);
    atpRight.position.set(3, 1, 0);
    group.add(atpLeft);
    group.add(atpRight);
    parts.push({
        name: 'ATPase Domains',
        description: 'Energy modules that hydrolyze ATP to drive the conformational changes required for strand passage.',
        material: 'glowingCore',
        function: 'Provides the mechanical energy required to open and close the enzyme gates.',
        assemblyOrder: 5,
        connections: ['N-Gate'],
        failureEffect: 'Enzyme locks in a closed or open state; cycle halts.',
        cascadeFailures: ['ATP depletion (if futile cycling occurs)', 'Enzyme permanently bound to DNA'],
        originalPosition: { x: -3, y: 1, z: 0 },
        explodedPosition: { x: -8, y: 5, z: 0 }
    });

    // --- DNA Strand (Helical Structure) ---
    const dnaGroup = new THREE.Group();
    const strandGeo1 = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16, 2, 5);
    const strandMesh1 = new THREE.Mesh(strandGeo1, neonGreen);
    strandMesh1.scale.set(0.8, 0.8, 2);
    strandMesh1.rotation.x = Math.PI / 2;
    dnaGroup.add(strandMesh1);
    group.add(dnaGroup);

    parts.push({
        name: 'Supercoiled DNA Strand',
        description: 'The target molecule experiencing extreme torsional stress ahead of the replication fork.',
        material: 'neonGreen',
        function: 'Stores genetic information; requires untangling to be read or copied.',
        assemblyOrder: 6,
        connections: ['Cleavage Core', 'Swivel Domain'],
        failureEffect: 'N/A (Target molecule)',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // Map meshes to parts for animation
    const meshes = {
        enzymeCore: enzymeCoreMesh,
        jawTop: jawTopMesh,
        jawBottom: jawBottomMesh,
        swivel: swivelMesh,
        atpLeft: atpLeft,
        atpRight: atpRight,
        dna: dnaGroup,
        strandMesh: strandMesh1
    };

    const description = "Topoisomerases are highly specialized molecular machines that solve the topological problems of DNA. As DNA unwinds during replication or transcription, it becomes tangled and overwound (supercoiled) ahead of the molecular machinery. Topoisomerases act like mechanical wire-cutters and swivels: they bind to the DNA, deliberately break one or both strands, pass the uncut strand through the break to relieve the tension, and then seamlessly ligate (glue) the broken ends back together. This high-tech representation visualizes this process with an N-Gate clamping the DNA, a C-Gate cleaving it, and ATPase domains powering the conformational shifts.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Topoisomerase enzyme?",
            options: [
                "To synthesize new DNA strands",
                "To relieve torsional stress (supercoiling) in DNA",
                "To degrade old or damaged DNA",
                "To transport ATP across the cell membrane"
            ],
            correct: 1,
            explanation: "Topoisomerases resolve topological problems in DNA, primarily by relieving the torsional tension (supercoiling) that builds up ahead of replication and transcription complexes.",
            difficulty: "Medium"
        },
        {
            question: "What would happen if the ATPase domains failed to function?",
            options: [
                "The enzyme would work faster without needing energy",
                "The DNA would spontaneously untangle",
                "The enzyme would be unable to undergo the conformational changes needed to pass the DNA strand",
                "The enzyme would permanently destroy the DNA"
            ],
            correct: 2,
            explanation: "The ATPase domains hydrolyze ATP to provide the mechanical energy required to drive the opening and closing of the enzyme's gates (conformational changes). Without this energy, the cycle halts.",
            difficulty: "Hard"
        },
        {
            question: "Why must the Cleavage Core hold onto the cut DNA ends tightly?",
            options: [
                "To prevent the DNA from turning into RNA",
                "To stop the ends from flying apart, which would cause lethal double-strand breaks",
                "To squeeze the DNA until it breaks completely",
                "To stretch the DNA so it fits in the nucleus"
            ],
            correct: 1,
            explanation: "By covalently bonding to the cut DNA ends (forming a cleavage complex), the enzyme prevents the broken ends from dissociating. If they dissociate, it results in DNA double-strand breaks, which are highly toxic to the cell.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Complex animation cycle representing the DNA unwinding process
        const cycleSpeed = time * speed * 2;
        
        // Swivel rotation representing DNA untwisting
        meshes.swivel.rotation.z = cycleSpeed * 2;
        meshes.strandMesh.rotation.z = cycleSpeed * 0.5;

        // Jaws opening and closing periodically
        const jawMovement = Math.sin(cycleSpeed) * 0.5 + 0.5; // 0 to 1
        meshes.jawTop.position.y = 2.5 + jawMovement * 1.5;
        meshes.jawBottom.position.y = -2.5 - jawMovement * 1.5;

        // Enzyme Core breathing/flexing
        const coreScale = 1 + Math.sin(cycleSpeed * 2) * 0.05;
        meshes.enzymeCore.scale.set(coreScale, coreScale, coreScale);

        // ATPase glowing intensity pulses with the opening/closing
        const atpPulse = Math.sin(cycleSpeed * 4) * 0.5 + 0.5;
        meshes.atpLeft.material.emissiveIntensity = 1 + atpPulse * 3;
        meshes.atpRight.material.emissiveIntensity = 1 + atpPulse * 3;
        meshes.atpLeft.scale.setScalar(1 + atpPulse * 0.2);
        meshes.atpRight.scale.setScalar(1 + atpPulse * 0.2);
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createTopoisomerase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
