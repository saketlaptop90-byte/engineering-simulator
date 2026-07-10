import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Reality Anchor Core
    const coreGeo = new THREE.DodecahedronGeometry(30, 2);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0x880022, metalness: 0.9, roughness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    meshes.core = core;

    parts.push({
        name: 'Reality_Anchor_Core',
        description: 'Generates a localized Hume field to prevent reality degradation.',
        material: 'Crimson Neutronium',
        function: 'Stabilizes the local ontological constant.',
        assemblyOrder: 1,
        connections: ['Containment_Rings'],
        failureEffect: 'Spontaneous conceptual erasure.',
        cascadeFailures: ['Ontological Collapse'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 2. Multi-Axis Containment Rings
    const ringsGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const ringGeo = new THREE.TorusGeometry(50 + (i*15), 3, 32, 128);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.4 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        
        // Add intricate stabilizing nodes
        for(let j=0; j<12; j++) {
            const node = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), copper);
            const angle = (j / 12) * Math.PI * 2;
            node.position.set(Math.cos(angle)*(50+(i*15)), Math.sin(angle)*(50+(i*15)), 0);
            node.rotation.z = angle;
            ring.add(node);
        }
        
        ringsGroup.add(ring);
        meshes[`ring_${i}`] = ring;
    }
    group.add(ringsGroup);
    meshes.ringsGroup = ringsGroup;

    parts.push({
        name: 'Containment_Rings',
        description: 'Magnetic containment fields enforcing physical laws.',
        material: 'DarkSteel / Copper',
        function: 'Keeps the Hume field from radiating into the void.',
        assemblyOrder: 2,
        connections: ['Reality_Anchor_Core'],
        failureEffect: 'Reality begins to liquefy.',
        cascadeFailures: ['Physics Breakdown'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // 3. Spacetime Stabilizer Pylons
    const pylonsGroup = new THREE.Group();
    const pylonCount = 8;
    for(let i=0; i<pylonCount; i++) {
        const pylonGeo = new THREE.CylinderGeometry(5, 10, 200, 8);
        const pylon = new THREE.Mesh(pylonGeo, steel);
        
        const angle = (i / pylonCount) * Math.PI * 2;
        pylon.position.set(Math.cos(angle)*150, 0, Math.sin(angle)*150);
        
        // Emissive inner core of pylon
        const corePylon = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 210, 8), new THREE.MeshStandardMaterial({emissive: 0x00ffff, emissiveIntensity: 2}));
        pylon.add(corePylon);

        pylonsGroup.add(pylon);
    }
    group.add(pylonsGroup);
    meshes.pylons = pylonsGroup;

    parts.push({
        name: 'Stabilizer_Pylons',
        description: 'Pins the reality anchor to the cosmic fabric.',
        material: 'Steel / Plasma',
        function: 'Prevents spatial drift of the anchor point.',
        assemblyOrder: 3,
        connections: [],
        failureEffect: 'Anchor becomes detached from reality.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 0, z: 0 }
    });

    // 4. Tachyon Energy Swarm (InstancedMesh)
    const particleCount = 2000;
    const pGeo = new THREE.TetrahedronGeometry(1);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 3 });
    const pMesh = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    
    for(let i=0; i<particleCount; i++) {
        const mat = new THREE.Matrix4();
        const r = Math.random() * 100 + 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const pos = new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
        mat.setPosition(pos);
        pMesh.setMatrixAt(i, mat);
    }
    pMesh.instanceMatrix.needsUpdate = true;
    group.add(pMesh);
    meshes.tachyons = { mesh: pMesh, count: particleCount };

    const description = "The Reality Anchor Array. A massive device capable of stabilizing the ontological integrity of an entire galaxy, preventing reality from dissolving into pure chaos.";

    const quizQuestions = [
        {
            question: "In Pataphysics, what does a Hume measure?",
            options: [
                "The concentration of reality in a given area.",
                "The temperature of a false vacuum.",
                "The rate of universal expansion.",
                "The spin of a graviton."
            ],
            correctAnswer: 0,
            explanation: "Hume is a fictional unit of measurement used in speculative fiction (like the SCP Foundation) to quantify the strength and concentration of 'reality' in a local area."
        },
        {
            question: "What is the consequence of a region of space dropping to 0 Humes?",
            options: [
                "Time stops completely.",
                "Gravity reverses.",
                "Reality becomes completely malleable and ceases to have fixed physical laws.",
                "The region collapses into a black hole."
            ],
            correctAnswer: 2,
            explanation: "At 0 Humes, the baseline reality is completely depleted, allowing for arbitrary anomalies, reality bending, and a breakdown of ontological constants."
        },
        {
            question: "How do tachyons theoretically behave as they lose energy?",
            options: [
                "They slow down to the speed of light.",
                "They speed up towards infinite velocity.",
                "They turn into normal matter.",
                "They emit Hawking radiation."
            ],
            correctAnswer: 1,
            explanation: "For hypothetical tachyons (particles that travel faster than light), as their energy decreases, their velocity approaches infinity. Infinite energy is required to slow them down to the speed of light."
        },
        {
            question: "What principle prevents a time traveler from changing the past in a way that prevents their own existence?",
            options: [
                "The Uncertainty Principle",
                "The Novikov Self-Consistency Principle",
                "The Pauli Exclusion Principle",
                "The Anthropic Principle"
            ],
            correctAnswer: 1,
            explanation: "The Novikov self-consistency principle asserts that any actions taken by a time traveler in the past must be part of the history that led to them traveling back in the first place, thus preventing paradoxes."
        },
        {
            question: "What is the theoretical boundary of a black hole where the escape velocity equals the speed of light?",
            options: [
                "Ergosphere",
                "Photon Sphere",
                "Event Horizon",
                "Singularity"
            ],
            correctAnswer: 2,
            explanation: "The event horizon is the critical boundary around a black hole beyond which nothing, not even light, can escape its gravitational pull."
        }
    ];

    function animate(time, speed, meshesObj, exploded) {
        if (meshesObj.core) {
            meshesObj.core.rotation.x = time * speed;
            meshesObj.core.rotation.y = time * speed * 1.3;
            const s = 1 + Math.sin(time * speed * 3) * 0.05;
            meshesObj.core.scale.set(s, s, s);
        }

        if (!exploded) {
            for(let i=0; i<5; i++) {
                if (meshesObj[`ring_${i}`]) {
                    meshesObj[`ring_${i}`].rotation.x = time * speed * (0.3 + i*0.1);
                    meshesObj[`ring_${i}`].rotation.y = time * speed * (0.2 + i*0.15);
                }
            }
        }

        if (meshesObj.tachyons) {
            const pMesh = meshesObj.tachyons.mesh;
            const count = meshesObj.tachyons.count;
            const dummy = new THREE.Object3D();
            
            for(let i=0; i<count; i++) {
                pMesh.getMatrixAt(i, dummy.matrix);
                const pos = new THREE.Vector3();
                pos.setFromMatrixPosition(dummy.matrix);
                
                // Swarm rotation
                const angle = Math.atan2(pos.z, pos.x) + (speed * 0.05 * (i%3 === 0 ? 1 : -1));
                const radius = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
                pos.x = Math.cos(angle) * radius;
                pos.z = Math.sin(angle) * radius;
                
                // Vertical oscillation
                pos.y += Math.sin(time*speed*5 + i) * 2;
                
                dummy.position.copy(pos);
                dummy.rotation.x += speed * 0.1;
                dummy.rotation.y += speed * 0.2;
                dummy.updateMatrix();
                pMesh.setMatrixAt(i, dummy.matrix);
            }
            pMesh.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
