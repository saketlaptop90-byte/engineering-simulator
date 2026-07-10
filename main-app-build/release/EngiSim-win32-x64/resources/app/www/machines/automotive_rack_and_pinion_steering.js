import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for visual flair
    const glowBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowRed = new THREE.MeshPhysicalMaterial({
        color: 0xff2200,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.4
    });

    const cyberGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff44,
        emissiveIntensity: 1.0,
        metalness: 0.7,
        roughness: 0.2
    });

    // Helper to build parts with metadata
    function createPart(name, geometry, material, originalPos, explodedPos, partInfo) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(originalPos.x, originalPos.y, originalPos.z);
        group.add(mesh);
        meshes[name] = mesh;

        parts.push({
            name,
            ...partInfo,
            originalPosition: originalPos,
            explodedPosition: explodedPos
        });
        
        return mesh;
    }

    // 1. Steering Wheel
    const wheelGeo = new THREE.TorusGeometry(3, 0.4, 32, 64);
    const wheelPos = { x: 0, y: 12, z: -8 };
    createPart('SteeringWheel', wheelGeo, glowBlue, wheelPos, { x: 0, y: 16, z: -12 }, {
        description: 'Driver interface to steer the vehicle.',
        material: 'GlowBlue (High-Tech)',
        function: 'Rotates to initiate steering movement.',
        assemblyOrder: 1,
        connections: ['SteeringColumn'],
        failureEffect: 'Loss of driver input.',
        cascadeFailures: ['Loss of vehicle control']
    });

    // 2. Steering Column
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 32);
    columnGeo.rotateX(Math.PI / 4);
    const columnPos = { x: 0, y: 7.5, z: -4.5 };
    createPart('SteeringColumn', columnGeo, steel, columnPos, { x: 0, y: 10, z: -6 }, {
        description: 'Connects steering wheel to the steering gear.',
        material: 'Steel',
        function: 'Transfers rotational force from wheel to pinion.',
        assemblyOrder: 2,
        connections: ['SteeringWheel', 'UniversalJoint'],
        failureEffect: 'Disconnection of steering input.',
        cascadeFailures: ['Complete steering failure']
    });

    // 3. Universal Joint
    const ujGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const ujPos = { x: 0, y: 4, z: -1 };
    createPart('UniversalJoint', ujGeo, darkSteel, ujPos, { x: 0, y: 6, z: -2 }, {
        description: 'Allows column to bend at an angle while transferring torque.',
        material: 'DarkSteel',
        function: 'Transfers rotation through a change of angle.',
        assemblyOrder: 3,
        connections: ['SteeringColumn', 'PinionGear'],
        failureEffect: 'Binding or complete breakage of steering column.',
        cascadeFailures: ['Loss of control']
    });

    // 4. Pinion Gear
    const pinionGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    pinionGeo.rotateX(Math.PI / 2);
    const pinionPos = { x: 0, y: 2.5, z: 0 };
    createPart('PinionGear', pinionGeo, chrome, pinionPos, { x: 0, y: 4, z: 2 }, {
        description: 'Small gear that meshes with the steering rack.',
        material: 'Chrome',
        function: 'Converts rotational motion into linear motion.',
        assemblyOrder: 4,
        connections: ['UniversalJoint', 'SteeringRack'],
        failureEffect: 'Steering skips or jams.',
        cascadeFailures: ['Rack damage', 'Lockup']
    });

    // 5. Steering Rack
    const rackGeo = new THREE.BoxGeometry(16, 0.8, 0.8);
    const rackPos = { x: 0, y: 2, z: 0.5 };
    createPart('SteeringRack', rackGeo, steel, rackPos, { x: 0, y: 0, z: 3 }, {
        description: 'Long toothed bar moving left and right.',
        material: 'Steel',
        function: 'Moves linearly to push or pull the tie rods.',
        assemblyOrder: 5,
        connections: ['PinionGear', 'LeftTieRod', 'RightTieRod'],
        failureEffect: 'Loss of steering ratio and precise control.',
        cascadeFailures: ['Uneven tire wear', 'Wandering']
    });

    // 6. Tie Rods
    const tieGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    tieGeo.rotateZ(Math.PI / 2);
    
    createPart('LeftTieRod', tieGeo, aluminum, { x: -11, y: 2, z: 0.5 }, { x: -15, y: 2, z: 4 }, {
        description: 'Connects the rack to the steering knuckle.',
        material: 'Aluminum',
        function: 'Pushes/pulls the knuckle to turn the wheel.',
        assemblyOrder: 6,
        connections: ['SteeringRack', 'LeftKnuckle'],
        failureEffect: 'Left wheel loses steering control.',
        cascadeFailures: ['Severe pulling to one side', 'Accident']
    });

    createPart('RightTieRod', tieGeo, aluminum, { x: 11, y: 2, z: 0.5 }, { x: 15, y: 2, z: 4 }, {
        description: 'Connects the rack to the steering knuckle.',
        material: 'Aluminum',
        function: 'Pushes/pulls the knuckle to turn the wheel.',
        assemblyOrder: 7,
        connections: ['SteeringRack', 'RightKnuckle'],
        failureEffect: 'Right wheel loses steering control.',
        cascadeFailures: ['Severe pulling to one side', 'Accident']
    });

    // 7. Steering Knuckles / Wheel Hubs
    const knuckleGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    knuckleGeo.rotateZ(Math.PI / 2);
    
    createPart('LeftKnuckle', knuckleGeo, cyberGreen, { x: -14, y: 2, z: 0.5 }, { x: -18, y: 2, z: 5 }, {
        description: 'Pivot point for the left wheel.',
        material: 'CyberGreen',
        function: 'Rotates to steer the wheel hub.',
        assemblyOrder: 8,
        connections: ['LeftTieRod'],
        failureEffect: 'Wheel detaches or locks up.',
        cascadeFailures: ['Suspension failure', 'Crash']
    });

    createPart('RightKnuckle', knuckleGeo, glowRed, { x: 14, y: 2, z: 0.5 }, { x: 18, y: 2, z: 5 }, {
        description: 'Pivot point for the right wheel.',
        material: 'GlowRed',
        function: 'Rotates to steer the wheel hub.',
        assemblyOrder: 9,
        connections: ['RightTieRod'],
        failureEffect: 'Wheel detaches or locks up.',
        cascadeFailures: ['Suspension failure', 'Crash']
    });

    const description = "An ultra high-tech, holographic representation of a Rack and Pinion steering system. It seamlessly converts rotational movement from the steering wheel into linear motion along the rack, steering the wheels through the tie rods.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pinion Gear in this steering system?",
            options: [
                "To absorb road shocks",
                "To convert rotational motion into linear motion",
                "To cool the steering fluid",
                "To measure the steering angle"
            ],
            correct: 1,
            explanation: "The pinion gear meshes with the teeth of the steering rack, effectively converting the rotational motion of the steering column into the linear motion of the rack.",
            difficulty: "Medium"
        },
        {
            question: "Which component directly connects the steering rack to the steering knuckles?",
            options: [
                "Universal Joint",
                "Steering Column",
                "Tie Rod",
                "Pinion Gear"
            ],
            correct: 2,
            explanation: "Tie rods connect the outer ends of the steering rack to the steering knuckles, transferring the linear motion required to pivot the wheels.",
            difficulty: "Easy"
        },
        {
            question: "Why is a Universal Joint (U-joint) necessary in the steering column assembly?",
            options: [
                "To allow the column to bend at an angle while maintaining torque transfer",
                "To arbitrarily increase the steering ratio",
                "To safely disconnect steering during a front-end crash",
                "To completely prevent the steering wheel from locking"
            ],
            correct: 0,
            explanation: "The steering wheel and the pinion gear are typically not perfectly aligned. The U-joint allows rotational force to be transferred seamlessly through an angle.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, passedMeshes) {
        const activeMeshes = passedMeshes || meshes;
        const t = time * 0.001 * speed;
        
        // Oscillating steering angle between -45 and 45 degrees
        const angle = Math.sin(t) * Math.PI / 4; 
        
        if (activeMeshes['SteeringWheel']) {
            activeMeshes['SteeringWheel'].rotation.set(0, 0, 0);
            activeMeshes['SteeringWheel'].rotateX(-Math.PI / 4); 
            activeMeshes['SteeringWheel'].rotateZ(angle);
        }
        
        if (activeMeshes['SteeringColumn']) {
            activeMeshes['SteeringColumn'].rotation.set(0, 0, 0);
            activeMeshes['SteeringColumn'].rotateX(Math.PI / 4);
            activeMeshes['SteeringColumn'].rotateY(-angle);
        }

        if (activeMeshes['UniversalJoint']) {
            activeMeshes['UniversalJoint'].rotation.set(0, 0, 0);
            activeMeshes['UniversalJoint'].rotateX(Math.PI / 4);
            activeMeshes['UniversalJoint'].rotateY(-angle);
        }

        if (activeMeshes['PinionGear']) {
            activeMeshes['PinionGear'].rotation.set(0, 0, 0);
            activeMeshes['PinionGear'].rotateX(Math.PI / 2);
            activeMeshes['PinionGear'].rotateZ(-angle);
        }

        // Rack translation (linear movement relative to rotation)
        const rackMove = angle * 2;
        if (activeMeshes['SteeringRack']) {
            activeMeshes['SteeringRack'].position.x = rackMove;
        }

        if (activeMeshes['LeftTieRod']) {
            activeMeshes['LeftTieRod'].position.x = -11 + rackMove;
        }
        if (activeMeshes['RightTieRod']) {
            activeMeshes['RightTieRod'].position.x = 11 + rackMove;
        }

        // Knuckles turn synchronously with the tie rods
        if (activeMeshes['LeftKnuckle']) {
            activeMeshes['LeftKnuckle'].rotation.set(0, 0, 0);
            activeMeshes['LeftKnuckle'].rotateZ(Math.PI / 2);
            activeMeshes['LeftKnuckle'].rotateX(-angle * 0.5); 
        }
        if (activeMeshes['RightKnuckle']) {
            activeMeshes['RightKnuckle'].rotation.set(0, 0, 0);
            activeMeshes['RightKnuckle'].rotateZ(Math.PI / 2);
            activeMeshes['RightKnuckle'].rotateX(-angle * 0.5); 
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRackAndPinionSteering() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
