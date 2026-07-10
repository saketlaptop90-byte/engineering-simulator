import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff4400,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x9900ff,
        emissiveIntensity: 1.2
    });

    // 1. Engine Block
    const blockGeom = new THREE.BoxGeometry(4, 2, 4);
    const blockMesh = new THREE.Mesh(blockGeom, darkSteel);
    group.add(blockMesh);

    parts.push({
        name: 'Engine Block',
        description: 'The core casing that holds the horizontally opposed cylinders.',
        material: 'darkSteel',
        function: 'Houses cylinders, crankshaft, and internal components.',
        assemblyOrder: 1,
        connections: ['Crankshaft', 'Cylinder Heads'],
        failureEffect: 'Catastrophic failure, loss of compression, oil leaks.',
        cascadeFailures: ['Crankshaft bearing failure', 'Piston scoring'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: blockMesh
    });

    // 2. Crankshaft
    const crankGeom = new THREE.CylinderGeometry(0.3, 0.3, 5, 32);
    const crankMesh = new THREE.Mesh(crankGeom, chrome);
    crankMesh.rotation.x = Math.PI / 2;
    group.add(crankMesh);

    parts.push({
        name: 'Crankshaft',
        description: 'Converts the linear motion of the pistons into rotational motion.',
        material: 'chrome',
        function: 'Translates piston force into torque.',
        assemblyOrder: 2,
        connections: ['Engine Block', 'Connecting Rods', 'Flywheel'],
        failureEffect: 'Engine stall, severe knocking.',
        cascadeFailures: ['Connecting rod breakage', 'Engine block cracking'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: crankMesh
    });

    // 3. Pistons & Rods (4 of them)
    const pistons = [];
    const combustions = [];
    for (let i = 0; i < 4; i++) {
        const pGroup = new THREE.Group();
        
        // Piston Head
        const headGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);
        const headMesh = new THREE.Mesh(headGeom, steel);
        
        // Connecting Rod
        const rodGeom = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const rodMesh = new THREE.Mesh(rodGeom, aluminum);
        rodMesh.position.y = -1;

        // Combustion Glow
        const combGeom = new THREE.SphereGeometry(0.7, 16, 16);
        const combMesh = new THREE.Mesh(combGeom, glowingOrange);
        combMesh.position.y = 0.5;
        
        pGroup.add(headMesh);
        pGroup.add(rodMesh);
        pGroup.add(combMesh);

        // Position pistons: two on left, two on right
        const side = i % 2 === 0 ? -1 : 1;
        const zPos = i < 2 ? -1.5 : 1.5;
        
        pGroup.position.set(side * 2, 0, zPos);
        pGroup.rotation.z = side === 1 ? -Math.PI / 2 : Math.PI / 2;

        group.add(pGroup);
        pistons.push({ mesh: pGroup, side, offset: i * Math.PI });
        combustions.push(combMesh);

        parts.push({
            name: `Piston Assembly ${i + 1}`,
            description: 'Reciprocating part that compresses air/fuel and receives combustion force.',
            material: 'steel/aluminum',
            function: 'Transfers combustion force to the crankshaft.',
            assemblyOrder: 3 + i,
            connections: ['Crankshaft', 'Cylinder Head'],
            failureEffect: 'Loss of power in one cylinder.',
            cascadeFailures: ['Valve damage', 'Cylinder wall scoring'],
            originalPosition: { x: side * 2, y: 0, z: zPos },
            explodedPosition: { x: side * 5, y: 0, z: zPos },
            mesh: pGroup
        });
    }

    // 4. Cylinder Heads (Left and Right)
    const headLeftGeom = new THREE.BoxGeometry(1, 2, 4);
    const headLeftMesh = new THREE.Mesh(headLeftGeom, glowingBlue);
    headLeftMesh.position.set(-2.5, 0, 0);
    group.add(headLeftMesh);

    parts.push({
        name: 'Left Cylinder Head',
        description: 'Covers the left bank of cylinders, housing valves and spark plugs.',
        material: 'glowingBlue',
        function: 'Seals cylinders and manages intake/exhaust.',
        assemblyOrder: 7,
        connections: ['Engine Block', 'Pistons'],
        failureEffect: 'Coolant leak, loss of compression.',
        cascadeFailures: ['Engine overheating', 'Oil contamination'],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -7, y: 0, z: 0 },
        mesh: headLeftMesh
    });

    const headRightGeom = new THREE.BoxGeometry(1, 2, 4);
    const headRightMesh = new THREE.Mesh(headRightGeom, glowingBlue);
    headRightMesh.position.set(2.5, 0, 0);
    group.add(headRightMesh);

    parts.push({
        name: 'Right Cylinder Head',
        description: 'Covers the right bank of cylinders, housing valves and spark plugs.',
        material: 'glowingBlue',
        function: 'Seals cylinders and manages intake/exhaust.',
        assemblyOrder: 8,
        connections: ['Engine Block', 'Pistons'],
        failureEffect: 'Coolant leak, loss of compression.',
        cascadeFailures: ['Engine overheating', 'Oil contamination'],
        originalPosition: { x: 2.5, y: 0, z: 0 },
        explodedPosition: { x: 7, y: 0, z: 0 },
        mesh: headRightMesh
    });

    const description = "The Boxer Engine (Horizontally Opposed) features pistons that lie flat and move directly against each other, canceling out primary vibrations and providing a very low center of gravity. Commonly used in high-performance and aviation applications.";

    const quizQuestions = [
        {
            question: "What is the primary mechanical advantage of a Boxer engine configuration?",
            options: ["Higher peak horsepower", "Perfect primary balance canceling vibration", "Better fuel efficiency", "Lower manufacturing cost"],
            correct: 1,
            explanation: "Because the pistons move directly away from and towards each other simultaneously, their momentum cancels out, providing perfect primary balance and smooth operation.",
            difficulty: "Medium"
        },
        {
            question: "How does the layout of a Boxer engine affect a vehicle's handling?",
            options: ["It raises the center of gravity", "It has no effect on handling", "It lowers the center of gravity", "It creates uneven weight distribution"],
            correct: 2,
            explanation: "The flat, horizontally opposed design allows the engine to be mounted very low in the chassis, significantly lowering the vehicle's center of gravity and improving handling.",
            difficulty: "Easy"
        },
        {
            question: "Which component converts the linear motion of the opposing pistons into rotational motion?",
            options: ["Camshaft", "Crankshaft", "Cylinder Head", "Timing Belt"],
            correct: 1,
            explanation: "The crankshaft is the central shaft that connects to the connecting rods of all pistons, translating their reciprocating linear motion into the rotational torque needed to drive the wheels.",
            difficulty: "Easy"
        }
    ];

    let animate = function(time, speed, meshes) {
        // Crankshaft rotation
        crankMesh.rotation.y = time * speed;

        // Piston reciprocation and combustion glow
        pistons.forEach((p, index) => {
            // local Y is the axis of the cylinder
            const phase = time * speed * 2 + p.offset;
            const extension = Math.sin(phase);
            
            p.mesh.position.x = p.originalPosition.x + p.side * extension * 0.8;
            
            // Combustion effect when piston is fully extended
            const comb = combustions[index];
            if (extension > 0.8) {
                comb.scale.setScalar(1 + (extension - 0.8) * 5);
                comb.material.opacity = (extension - 0.8) * 5;
            } else {
                comb.scale.setScalar(0.1);
                comb.material.opacity = 0;
            }
        });
        
        // Pulsing glow on cylinder heads
        headLeftMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 4) * 0.5;
        headRightMesh.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 4) * 0.5;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBoxerEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
