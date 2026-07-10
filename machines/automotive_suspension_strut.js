import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing material
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.2
    });

    // 1. Shock Absorber Body (Damper Cylinder)
    const damperGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    const damperMesh = new THREE.Mesh(damperGeom, chrome);
    damperMesh.position.set(0, 0, 0);
    group.add(damperMesh);
    parts.push({
        name: "Damper Cylinder",
        description: "The main body of the shock absorber containing hydraulic fluid and valves to dampen spring oscillation.",
        material: "chrome",
        function: "Dissipates kinetic energy as heat.",
        assemblyOrder: 1,
        connections: ["Piston Rod", "Lower Mount"],
        failureEffect: "Loss of damping, bouncy ride, poor handling.",
        cascadeFailures: ["Coil Spring Fatigue", "Tire Wear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: damperMesh
    });

    // 2. Piston Rod
    const rodGeom = new THREE.CylinderGeometry(0.2, 0.2, 5, 32);
    const rodMesh = new THREE.Mesh(rodGeom, steel);
    rodMesh.position.set(0, 4, 0);
    group.add(rodMesh);
    parts.push({
        name: "Piston Rod",
        description: "Connects the piston valve inside the damper to the upper strut mount.",
        material: "steel",
        function: "Transmits suspension movement to the internal valving.",
        assemblyOrder: 2,
        connections: ["Damper Cylinder", "Upper Mount"],
        failureEffect: "Strut lockup or fluid leak if scored.",
        cascadeFailures: ["Damper Cylinder"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: rodMesh
    });

    // 3. Coil Spring
    const path = new THREE.CatmullRomCurve3(
        Array.from({ length: 100 }, (_, i) => {
            const t = i / 99;
            const angle = t * Math.PI * 2 * 6; // 6 coils
            const radius = 1.5;
            const height = t * 8 - 2;
            return new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
        })
    );
    const springGeom = new THREE.TubeGeometry(path, 200, 0.25, 16, false);
    const springMesh = new THREE.Mesh(springGeom, neonRed); // High-tech look
    springMesh.position.set(0, 0, 0);
    group.add(springMesh);
    parts.push({
        name: "Coil Spring",
        description: "Heavy-duty steel spring that supports vehicle weight and absorbs large impacts.",
        material: "neonRed",
        function: "Absorbs road shocks and maintains vehicle ride height.",
        assemblyOrder: 3,
        connections: ["Spring Seat", "Upper Mount"],
        failureEffect: "Sagging ride height, harsh bottoming out.",
        cascadeFailures: ["Damper Cylinder blowout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 },
        mesh: springMesh
    });

    // 4. Spring Seat (Lower)
    const seatGeom = new THREE.TorusGeometry(1.5, 0.3, 16, 32);
    const seatMesh = new THREE.Mesh(seatGeom, darkSteel);
    seatMesh.rotation.x = Math.PI / 2;
    seatMesh.position.set(0, -2, 0);
    group.add(seatMesh);
    parts.push({
        name: "Lower Spring Seat",
        description: "Welded flange on the damper body that holds the bottom of the coil spring.",
        material: "darkSteel",
        function: "Provides a resting base for the coil spring.",
        assemblyOrder: 4,
        connections: ["Damper Cylinder", "Coil Spring"],
        failureEffect: "Spring misalignment or detachment.",
        cascadeFailures: ["Coil Spring", "Tire Damage"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: seatMesh
    });

    // 5. Upper Strut Mount & Bearing
    const mountGeom = new THREE.CylinderGeometry(1.8, 2.0, 0.8, 32);
    const mountMesh = new THREE.Mesh(mountGeom, rubber);
    mountMesh.position.set(0, 6, 0);
    group.add(mountMesh);
    parts.push({
        name: "Upper Strut Mount",
        description: "Rubber-isolated mounting plate with an integrated bearing.",
        material: "rubber",
        function: "Attaches strut to the chassis and allows steering rotation.",
        assemblyOrder: 5,
        connections: ["Piston Rod", "Coil Spring", "Chassis"],
        failureEffect: "Clunking noise, stiff steering, vibration.",
        cascadeFailures: ["Steering Rack", "Tire Alignment"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 },
        mesh: mountMesh
    });

    // 6. Dust Boot & Bump Stop
    const bootGeom = new THREE.CylinderGeometry(0.8, 0.6, 3, 16, 8, true);
    // Add corrugation
    const posAttribute = bootGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const radiusModifier = 1 + 0.1 * Math.sin(y * Math.PI * 4);
        posAttribute.setX(i, posAttribute.getX(i) * radiusModifier);
        posAttribute.setZ(i, posAttribute.getZ(i) * radiusModifier);
    }
    bootGeom.computeVertexNormals();
    const bootMesh = new THREE.Mesh(bootGeom, plastic);
    bootMesh.position.set(0, 3, 0);
    group.add(bootMesh);
    parts.push({
        name: "Dust Boot & Bump Stop",
        description: "Protective accordion sleeve and polyurethane bumper.",
        material: "plastic",
        function: "Keeps dirt off the rod and prevents harsh metal-to-metal bottoming.",
        assemblyOrder: 6,
        connections: ["Piston Rod", "Upper Mount"],
        failureEffect: "Premature seal wear from dirt; harsh impacts.",
        cascadeFailures: ["Damper Cylinder Seals"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: -4, y: 3, z: 0 },
        mesh: bootMesh
    });

    // 7. Lower Mounting Bracket (to Steering Knuckle)
    const bracketGeom = new THREE.BoxGeometry(1.5, 2, 2);
    const bracketMesh = new THREE.Mesh(bracketGeom, darkSteel);
    bracketMesh.position.set(0.75, -2, 0);
    group.add(bracketMesh);
    parts.push({
        name: "Lower Mounting Bracket",
        description: "Heavy steel bracket with bolt holes for the steering knuckle.",
        material: "darkSteel",
        function: "Secures the strut to the wheel hub assembly.",
        assemblyOrder: 7,
        connections: ["Damper Cylinder", "Steering Knuckle"],
        failureEffect: "Loss of wheel camber, catastrophic suspension failure.",
        cascadeFailures: ["Wheel Hub", "Axle"],
        originalPosition: { x: 0.75, y: -2, z: 0 },
        explodedPosition: { x: 3, y: -6, z: 0 },
        mesh: bracketMesh
    });

    // 8. Glowing Tech Rings (Fictional/Sci-Fi element)
    const ringGeom = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeom, neonBlue);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, 1.5, 0);
    group.add(ringMesh);
    parts.push({
        name: "Adaptive Damping Sensor Ring",
        description: "High-tech magnetic sensor reading rod velocity in real-time.",
        material: "neonBlue",
        function: "Provides data for active suspension control.",
        assemblyOrder: 8,
        connections: ["Damper Cylinder", "ECU"],
        failureEffect: "Suspension reverts to passive mode.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -3 },
        mesh: ringMesh
    });

    const description = "The Automotive Suspension Strut is a highly critical assembly combining a shock absorber and a coil spring into a single structural unit. It supports the vehicle's weight, absorbs road impacts, and provides the steering pivot axis for the front wheels.";

    const quizQuestions = [
        {
            question: "What is the primary function of the damper cylinder (shock absorber)?",
            options: [
                "To support the weight of the vehicle.",
                "To dissipate kinetic energy and control spring oscillation.",
                "To connect the steering wheel to the tires.",
                "To provide power to the wheel hub."
            ],
            correct: 1,
            explanation: "The damper uses hydraulic fluid forced through valves to turn the kinetic energy of the moving suspension into heat, stopping the spring from bouncing continuously.",
            difficulty: "Medium"
        },
        {
            question: "Which component allows the entire strut assembly to rotate when the steering wheel is turned?",
            options: [
                "Lower Mounting Bracket",
                "Piston Rod",
                "Coil Spring",
                "Upper Strut Mount Bearing"
            ],
            correct: 3,
            explanation: "The Upper Strut Mount contains a bearing that allows the strut to pivot smoothly as the vehicle is steered.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the dust boot is torn or missing?",
            options: [
                "The spring will lose its tension.",
                "The car will steer in reverse.",
                "Dirt and debris will damage the piston rod seal, leading to fluid leaks.",
                "The lower mount will detach from the knuckle."
            ],
            correct: 2,
            explanation: "The dust boot protects the highly polished piston rod. If dirt gets on the rod, it acts like sandpaper on the hydraulic seal, causing the strut to leak and fail.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // time is continuous elapsed time in seconds
        // speed is a multiplier
        
        // Simulate driving over a bumpy road
        const bounce = Math.sin(time * speed * 5) * 0.5 + Math.sin(time * speed * 12) * 0.2;
        
        if (meshes["Piston Rod"]) {
            meshes["Piston Rod"].position.y = 4 - bounce;
        }
        if (meshes["Upper Strut Mount"]) {
            meshes["Upper Strut Mount"].position.y = 6 - bounce;
        }
        if (meshes["Dust Boot & Bump Stop"]) {
            meshes["Dust Boot & Bump Stop"].position.y = 3 - bounce * 0.5;
            meshes["Dust Boot & Bump Stop"].scale.y = 1 - bounce * 0.15;
        }
        
        // Spring compresses
        if (meshes["Coil Spring"]) {
            meshes["Coil Spring"].scale.y = 1 - bounce * 0.12;
        }

        // Sensor ring pulses
        if (meshes["Adaptive Damping Sensor Ring"]) {
            const pulse = (Math.sin(time * speed * 10) + 1) / 2;
            meshes["Adaptive Damping Sensor Ring"].material.emissiveIntensity = 0.5 + pulse * 1.5;
            meshes["Adaptive Damping Sensor Ring"].rotation.z = time * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSuspensionStrut() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
