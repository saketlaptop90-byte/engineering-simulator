import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom neon materials for high-tech visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const energyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    const meshes = {};

    function addPart(id, name, geometry, material, position, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, explodedPosition) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.userData = { id, name };
        group.add(mesh);
        meshes[id] = mesh;

        parts.push({
            id,
            name,
            description: `${name} component.`,
            material: material.type || 'Custom',
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { x: position[0], y: position[1], z: position[2] },
            explodedPosition: { x: explodedPosition[0], y: explodedPosition[1], z: explodedPosition[2] }
        });
        return mesh;
    }

    // 1. Lower Control Arm (A-Arm)
    const lowerArmGeo = new THREE.BoxGeometry(4, 0.4, 3);
    addPart('lowerArm', 'Lower Control Arm', lowerArmGeo, steel, [0, -1.5, 0], 
        'Controls wheel motion and carries the lower end of the suspension upright.', 
        1, ['chassis', 'upright', 'shock'], 'Total loss of wheel control, wheel collapse.', ['upright', 'shock'], [0, -4, 0]);

    // 2. Upper Control Arm (A-Arm)
    const upperArmGeo = new THREE.BoxGeometry(3, 0.3, 2);
    addPart('upperArm', 'Upper Control Arm', upperArmGeo, steel, [0.5, 1.5, 0], 
        'Stabilizes the top of the upright and determines camber angle geometry.', 
        2, ['chassis', 'upright'], 'Severe camber change, poor handling.', ['upright'], [0, 4, 0]);

    // 3. Upright / Knuckle
    const uprightGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.2, 16);
    const uprightMesh = addPart('upright', 'Upright (Knuckle)', uprightGeo, aluminum, [2.5, 0, 0], 
        'Connects the wheel to the control arms and houses the wheel bearing.', 
        3, ['upperArm', 'lowerArm', 'wheelHub'], 'Wheel detachment.', ['wheelHub', 'brake'], [5, 0, 0]);
    meshes['upright'].rotation.z = 0; // vertical

    // 4. Coilover Shock Absorber (Spring and Damper)
    const shockBodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
    addPart('shock', 'Shock Absorber', shockBodyGeo, chrome, [1, 0, 0], 
        'Dampens spring oscillations and controls ride height.', 
        4, ['lowerArm', 'chassis'], 'Bouncy ride, loss of tire contact patch.', ['tire', 'chassis'], [0, 0, -4]);

    const springGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 30, Math.PI * 10);
    const springMesh = addPart('spring', 'Coil Spring', springGeo, neonRed, [1, 0, 0], 
        'Supports vehicle weight and absorbs road shocks. Glowing red high-performance spec.', 
        5, ['shock'], 'Sagging suspension, bottoming out.', ['shock'], [0, 0, -6]);
    meshes['spring'].rotation.x = Math.PI / 2;

    // 5. Wheel Hub
    const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    addPart('hub', 'Wheel Hub', hubGeo, darkSteel, [3, 0, 0], 
        'Provides mounting point for the wheel and brake rotor.', 
        6, ['upright', 'rotor'], 'Wheel falls off.', ['wheel'], [7, 0, 0]);
    meshes['hub'].rotation.z = Math.PI / 2;

    // 6. Brake Rotor
    const rotorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    addPart('rotor', 'Brake Rotor', rotorGeo, steel, [3.3, 0, 0], 
        'Provides friction surface for brake pads to slow the vehicle.', 
        7, ['hub', 'caliper'], 'Loss of braking ability.', ['caliper'], [9, 0, 0]);
    meshes['rotor'].rotation.z = Math.PI / 2;

    // 7. Brake Caliper
    const caliperGeo = new THREE.BoxGeometry(0.5, 0.8, 1);
    addPart('caliper', 'Brake Caliper', caliperGeo, neonBlue, [3.3, 1, 0], 
        'Squeezes brake pads against the rotor. High-tech glowing blue compound.', 
        8, ['upright', 'rotor'], 'Ineffective braking.', ['rotor'], [9, 3, 0]);

    // 8. Sway Bar Link
    const swayLinkGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    addPart('swayLink', 'Sway Bar Link', swayLinkGeo, aluminum, [0, -1, 1.5], 
        'Connects the lower arm to the anti-roll bar.', 
        9, ['lowerArm', 'swayBar'], 'Increased body roll during cornering.', [], [0, -3, 4]);

    const description = "The double wishbone suspension is an independent suspension design using two (usually parallel) wishbone-shaped arms to locate the wheel. Each wishbone or arm has two mounting points to the chassis and one joint at the knuckle. The shock absorber and coil spring mount to the wishbones to control vertical movement. This design allows the engineer to carefully control the motion of the wheel throughout suspension travel, controlling parameters such as camber angle, caster angle, toe pattern, roll center height, and scrub radius.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a double wishbone suspension over a MacPherson strut?",
            options: [
                "Lower cost and complexity",
                "Takes up less space in the engine bay",
                "Better control over camber angle during suspension travel",
                "Fewer moving parts"
            ],
            correct: 2,
            explanation: "Double wishbone suspensions allow engineers to tune the upper and lower arm lengths to keep the tire flat on the ground (maintaining negative camber gain) as the suspension compresses.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for dampening the oscillations of the coil spring?",
            options: [
                "Lower Control Arm",
                "Upright (Knuckle)",
                "Shock Absorber",
                "Sway Bar Link"
            ],
            correct: 2,
            explanation: "The shock absorber (or damper) converts kinetic energy from suspension movement into heat, preventing the vehicle from bouncing continuously on its springs.",
            difficulty: "Easy"
        },
        {
            question: "In a typical SLA (Short-Long Arm) double wishbone setup, which control arm is shorter?",
            options: [
                "Upper Control Arm",
                "Lower Control Arm",
                "Both are equal length",
                "It depends on the brake caliper position"
            ],
            correct: 0,
            explanation: "The upper control arm is typically shorter. As the suspension compresses, the shorter upper arm pulls the top of the upright inward, inducing negative camber and improving cornering grip.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Simulate driving over a bumpy road
        const bumpFrequency = 2.0;
        const amplitude = 0.5;
        
        // Complex wave for road surface
        const verticalDisplacement = Math.sin(time * speed * bumpFrequency * Math.PI * 2) * amplitude + 
                                     Math.sin(time * speed * bumpFrequency * Math.PI * 3.7) * amplitude * 0.3;
        
        // Upright, Hub, Rotor, Caliper all move together vertically
        const wheelAssembly = ['upright', 'hub', 'rotor', 'caliper'];
        wheelAssembly.forEach(id => {
            if (activeMeshes[id]) {
                const originalY = parts.find(p => p.id === id).originalPosition.y;
                activeMeshes[id].position.y = originalY + verticalDisplacement;
            }
        });

        // Lower arm pivots around chassis point
        if (activeMeshes['lowerArm']) {
            const angle = Math.asin(verticalDisplacement / 4); // ~4 is arm length
            activeMeshes['lowerArm'].rotation.z = angle;
        }

        // Upper arm pivots around chassis point
        if (activeMeshes['upperArm']) {
            const angle = Math.asin(verticalDisplacement / 3); // ~3 is arm length
            activeMeshes['upperArm'].rotation.z = angle;
        }

        // Shock compresses
        if (activeMeshes['shock']) {
            const shockStretch = 1 - (verticalDisplacement * 0.2);
            activeMeshes['shock'].scale.y = Math.max(0.1, shockStretch);
            activeMeshes['shock'].position.y = verticalDisplacement / 2;
        }

        // Spring compresses
        if (activeMeshes['spring']) {
            const springStretch = 1 - (verticalDisplacement * 0.3);
            activeMeshes['spring'].scale.z = Math.max(0.1, springStretch); 
            activeMeshes['spring'].position.y = verticalDisplacement / 2;
        }
        
        // Rotor and Hub rotate
        const rotationSpeed = speed * 5;
        if (activeMeshes['rotor']) {
            activeMeshes['rotor'].rotation.x -= rotationSpeed * 0.016;
        }
        if (activeMeshes['hub']) {
            activeMeshes['hub'].rotation.x -= rotationSpeed * 0.016;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDoubleWishbone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
