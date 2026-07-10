import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom Materials
    const chitinBase = new THREE.MeshPhysicalMaterial({
        color: 0x1a0f00,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
    });

    const neonBioluminescence = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
    });

    const muscleTissue = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.6,
        metalness: 0.0,
    });

    const sensoryHairs = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.9,
        wireframe: true,
    });

    const parts = [];
    const meshes = {};

    // Helper to create a part
    function addPart(id, name, geometry, material, origPos, explPos, desc, func, connections, failEff, cascade, assemOrder) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        mesh.userData = { originalPosition: origPos, explodedPosition: explPos };
        group.add(mesh);
        meshes[id] = mesh;

        parts.push({
            id: id,
            name: name,
            description: desc,
            material: material.name || 'Custom',
            function: func,
            assemblyOrder: assemOrder,
            connections: connections,
            failureEffect: failEff,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // 1. Head Capsule (Base)
    const headGeom = new THREE.SphereGeometry(3, 32, 32);
    headGeom.scale(1, 0.8, 1.2);
    addPart(
        'head_capsule', 'Head Capsule', headGeom, chitinBase,
        { x: 0, y: 0, z: -3 }, { x: 0, y: 5, z: -5 },
        'The heavily armored cranium housing the brain and muscle attachments.',
        'Provides structural support and anchors the massive adductor muscles.',
        ['adductor_muscle_left', 'adductor_muscle_right'],
        'Loss of structural integrity, fatal to organism.',
        ['adductor_muscle_left', 'adductor_muscle_right', 'mandible_left', 'mandible_right'],
        1
    );

    // 2. Left Mandible
    const mandibleShape = new THREE.Shape();
    mandibleShape.moveTo(0, 0);
    mandibleShape.quadraticCurveTo(2, 2, 0, 5);
    mandibleShape.quadraticCurveTo(-1, 3, -0.5, 0);
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const mandibleGeomLeft = new THREE.ExtrudeGeometry(mandibleShape, extrudeSettings);
    mandibleGeomLeft.center();
    
    // Create a pivot group for the left mandible
    const pivotLeft = new THREE.Group();
    pivotLeft.position.set(-1.5, 0, 0); // Hinge location
    group.add(pivotLeft);
    
    const meshLeft = new THREE.Mesh(mandibleGeomLeft, chitinBase);
    meshLeft.position.set(0, 0, 2); // Relative to pivot
    meshLeft.rotation.z = -Math.PI / 6;
    pivotLeft.add(meshLeft);
    meshes['mandible_left_pivot'] = pivotLeft;

    parts.push({
        id: 'mandible_left',
        name: 'Left Mandible',
        description: 'Sclerotized crushing appendage, operating like a high-force plier jaw.',
        material: 'Chitin Armor',
        function: 'Crushing, carrying, and defense.',
        assemblyOrder: 3,
        connections: ['head_capsule', 'adductor_muscle_left'],
        failureEffect: 'Inability to grasp or crush efficiently on the left side.',
        cascadeFailures: ['foraging_efficiency'],
        originalPosition: { x: -1.5, y: 0, z: 2 },
        explodedPosition: { x: -4, y: 0, z: 4 }
    });

    // 3. Right Mandible
    const mandibleGeomRight = new THREE.ExtrudeGeometry(mandibleShape, extrudeSettings);
    mandibleGeomRight.center();
    
    const pivotRight = new THREE.Group();
    pivotRight.position.set(1.5, 0, 0); // Hinge location
    group.add(pivotRight);
    
    const meshRight = new THREE.Mesh(mandibleGeomRight, chitinBase);
    meshRight.position.set(0, 0, 2); // Relative to pivot
    meshRight.rotation.z = Math.PI / 6;
    // mirror X
    meshRight.scale.x = -1;
    pivotRight.add(meshRight);
    meshes['mandible_right_pivot'] = pivotRight;

    parts.push({
        id: 'mandible_right',
        name: 'Right Mandible',
        description: 'Sclerotized crushing appendage, interlocking with the left mandible.',
        material: 'Chitin Armor',
        function: 'Crushing, carrying, and defense.',
        assemblyOrder: 4,
        connections: ['head_capsule', 'adductor_muscle_right'],
        failureEffect: 'Inability to grasp or crush efficiently on the right side.',
        cascadeFailures: ['foraging_efficiency'],
        originalPosition: { x: 1.5, y: 0, z: 2 },
        explodedPosition: { x: 4, y: 0, z: 4 }
    });

    // 4. Left Adductor Muscle (Glowing representation)
    const muscleGeomLeft = new THREE.CylinderGeometry(0.8, 0.4, 3, 16);
    muscleGeomLeft.rotateX(Math.PI / 2);
    addPart(
        'adductor_muscle_left', 'Left Adductor Muscle', muscleGeomLeft, muscleTissue,
        { x: -1.2, y: 0, z: -1 }, { x: -3, y: 2, z: -2 },
        'Massive striated muscle fiber bundles.',
        'Generates extreme force to close the mandible.',
        ['head_capsule', 'mandible_left'],
        'Loss of biting force on the left.',
        ['mandible_left'],
        2
    );

    // 5. Right Adductor Muscle
    const muscleGeomRight = new THREE.CylinderGeometry(0.8, 0.4, 3, 16);
    muscleGeomRight.rotateX(Math.PI / 2);
    addPart(
        'adductor_muscle_right', 'Right Adductor Muscle', muscleGeomRight, muscleTissue,
        { x: 1.2, y: 0, z: -1 }, { x: 3, y: 2, z: -2 },
        'Massive striated muscle fiber bundles.',
        'Generates extreme force to close the mandible.',
        ['head_capsule', 'mandible_right'],
        'Loss of biting force on the right.',
        ['mandible_right'],
        2
    );

    // 6. Sensilla (Sensory Hairs) - Glowing
    const sensillaGeom = new THREE.CylinderGeometry(0.05, 0.01, 1, 8);
    sensillaGeom.translate(0, 0.5, 0);
    const sensillaGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const hair = new THREE.Mesh(sensillaGeom, neonBioluminescence);
        hair.position.set(Math.random()*4 - 2, 1.5, Math.random()*2 + 1);
        hair.rotation.x = Math.random() * Math.PI/4;
        hair.rotation.z = (Math.random() - 0.5) * Math.PI/4;
        sensillaGroup.add(hair);
    }
    sensillaGroup.position.set(0, 0, 0);
    group.add(sensillaGroup);
    meshes['sensilla'] = sensillaGroup;

    parts.push({
        id: 'sensilla',
        name: 'Tactile Sensilla',
        description: 'Bioluminescent highly sensitive mechanoreceptors along the mandibles and head.',
        material: 'Bioluminescent Chitin',
        function: 'Provides tactile feedback for precise manipulation and strike timing.',
        assemblyOrder: 5,
        connections: ['mandible_left', 'mandible_right', 'head_capsule'],
        failureEffect: 'Loss of precision, inability to detect object density.',
        cascadeFailures: ['mandible_damage_from_overexertion'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 3 }
    });

    const description = "A high-tech biomechanical simulation of Ant Mandibles. Ants can generate incredible forces relative to their body size, operating their mandibles like a mechanical trap. This model highlights the sclerotized chitin plates, the massive adductor muscles, and the glowing mechanoreceptor sensilla that trigger the snap-jaw mechanism.";

    const quizQuestions = [
        {
            question: "What is the primary function of the enormous Adductor Muscles in the ant's head capsule?",
            options: [
                "To process complex visual information.",
                "To generate the extreme force required to snap the mandibles shut.",
                "To digest solid food particles.",
                "To open the mandibles rapidly."
            ],
            correct: 1,
            explanation: "The adductor muscles are responsible for closing the mandibles with tremendous force, acting like powerful biological springs and motors.",
            difficulty: "easy"
        },
        {
            question: "Why is the exoskeleton (chitin) highly sclerotized around the mandibles?",
            options: [
                "To make it flexible and lightweight for flight.",
                "To increase water retention.",
                "To harden the structure, allowing it to withstand extreme crushing forces without fracturing.",
                "To change color for camouflage."
            ],
            correct: 2,
            explanation: "Sclerotization is a hardening process that reinforces the chitin, creating a durable armor capable of crushing seeds or armor of other insects without breaking.",
            difficulty: "medium"
        },
        {
            question: "What role do the Sensilla (sensory hairs) play in the mandible's operation?",
            options: [
                "They act as mechanoreceptors, providing tactile feedback to precisely time the jaw strike.",
                "They secrete venom to paralyze prey.",
                "They are solely for detecting airborne pheromones.",
                "They act as a secondary set of microscopic teeth."
            ],
            correct: 0,
            explanation: "Sensilla are highly sensitive hairs that detect physical contact, feeding sensory data to the nervous system to trigger rapid and precise jaw closures.",
            difficulty: "hard"
        }
    ];

    let phase = 0;
    function animate(time, speed, explodedProgress) {
        phase += speed * 0.05;
        
        // Snapping animation when not exploded
        let biteAngle = 0;
        if (explodedProgress < 0.1) {
            // Rhythmic slow open, fast snap
            const cycle = phase % (Math.PI * 2);
            if (cycle < Math.PI) {
                // Opening slowly
                biteAngle = (cycle / Math.PI) * (Math.PI / 4);
            } else {
                // Snapping shut rapidly and holding
                const snapProgress = (cycle - Math.PI) / (Math.PI / 4); // snap over a fraction of the cycle
                if (snapProgress < 1) {
                    biteAngle = (Math.PI / 4) * (1 - Math.pow(snapProgress, 3)); // fast ease in
                } else {
                    biteAngle = 0;
                }
            }
        } else {
            biteAngle = Math.PI / 6; // Open position when exploded
        }

        // Apply rotation to pivots
        if (meshes['mandible_left_pivot']) {
            // interpolate between original rotation and bite rotation based on exploded state
            meshes['mandible_left_pivot'].rotation.y = -biteAngle * (1 - explodedProgress);
        }
        if (meshes['mandible_right_pivot']) {
            meshes['mandible_right_pivot'].rotation.y = biteAngle * (1 - explodedProgress);
        }
        
        // Muscle pulsing when biting
        if (explodedProgress < 0.1 && biteAngle < 0.1) {
            meshes['adductor_muscle_left'].scale.set(1 + Math.sin(time*10)*0.1, 1, 1 + Math.sin(time*10)*0.1);
            meshes['adductor_muscle_right'].scale.set(1 + Math.sin(time*10)*0.1, 1, 1 + Math.sin(time*10)*0.1);
            if (meshes['adductor_muscle_left'].material) meshes['adductor_muscle_left'].material.emissiveIntensity = 0.5 + Math.sin(time*10)*0.5;
            if (meshes['adductor_muscle_right'].material) meshes['adductor_muscle_right'].material.emissiveIntensity = 0.5 + Math.sin(time*10)*0.5;
        } else {
            meshes['adductor_muscle_left'].scale.set(1, 1, 1);
            meshes['adductor_muscle_right'].scale.set(1, 1, 1);
            if (meshes['adductor_muscle_left'].material) meshes['adductor_muscle_left'].material.emissiveIntensity = 0;
            if (meshes['adductor_muscle_right'].material) meshes['adductor_muscle_right'].material.emissiveIntensity = 0;
        }

        // Sensilla glow pulse
        if (meshes['sensilla']) {
            meshes['sensilla'].children.forEach((hair, i) => {
                if (hair.material) hair.material.emissiveIntensity = 1.0 + Math.sin(time * 3 + i) * 1.0;
                // Move with exploded progress
                hair.position.y = 1.5 + (4 * explodedProgress);
                hair.position.z = Math.random()*2 + 1 + (3 * explodedProgress);
            });
        }

        // Handle standard exploded view positioning
        ['head_capsule', 'adductor_muscle_left', 'adductor_muscle_right'].forEach(id => {
            if(meshes[id]) {
                const orig = meshes[id].userData.originalPosition;
                const expl = meshes[id].userData.explodedPosition;
                meshes[id].position.x = orig.x + (expl.x - orig.x) * explodedProgress;
                meshes[id].position.y = orig.y + (expl.y - orig.y) * explodedProgress;
                meshes[id].position.z = orig.z + (expl.z - orig.z) * explodedProgress;
            }
        });
        
        // Handle pivot objects for exploded view
        if(meshes['mandible_left_pivot']) {
            const id = 'mandible_left';
            const part = parts.find(p => p.id === id);
            meshes['mandible_left_pivot'].position.x = part.originalPosition.x + (part.explodedPosition.x - part.originalPosition.x) * explodedProgress;
            meshes['mandible_left_pivot'].position.y = part.originalPosition.y + (part.explodedPosition.y - part.originalPosition.y) * explodedProgress;
            meshes['mandible_left_pivot'].position.z = part.originalPosition.z + (part.explodedPosition.z - part.originalPosition.z) * explodedProgress;
        }
        if(meshes['mandible_right_pivot']) {
            const id = 'mandible_right';
            const part = parts.find(p => p.id === id);
            meshes['mandible_right_pivot'].position.x = part.originalPosition.x + (part.explodedPosition.x - part.originalPosition.x) * explodedProgress;
            meshes['mandible_right_pivot'].position.y = part.originalPosition.y + (part.explodedPosition.y - part.originalPosition.y) * explodedProgress;
            meshes['mandible_right_pivot'].position.z = part.originalPosition.z + (part.explodedPosition.z - part.originalPosition.z) * explodedProgress;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAntMandibles() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
