import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const thrustGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.4
    });

    // 1. Motor Housing
    const housingGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    housingGeometry.rotateZ(Math.PI / 2);
    const housing = new THREE.Mesh(housingGeometry, darkSteel);
    housing.position.set(0, 0, 0);
    group.add(housing);

    parts.push({
        name: 'Motor Housing',
        description: 'Contains the electric motor and provides structural support for the propeller assembly.',
        material: 'darkSteel',
        function: 'Structural support and protection of internal components.',
        assemblyOrder: 1,
        connections: ['Stator', 'Mounting Bracket'],
        failureEffect: 'Vibration and loss of structural integrity.',
        cascadeFailures: ['Bearing failure', 'Propeller strike'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 2. Shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    shaftGeometry.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeometry, chrome);
    shaft.position.set(1, 0, 0);
    group.add(shaft);
    
    parts.push({
        name: 'Drive Shaft',
        description: 'Transmits rotational energy from the motor to the propeller hub.',
        material: 'chrome',
        function: 'Power transmission.',
        assemblyOrder: 2,
        connections: ['Motor Housing', 'Propeller Hub'],
        failureEffect: 'Loss of thrust.',
        cascadeFailures: ['Motor overspeed'],
        originalPosition: { x: 1, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 0, z: 0 }
    });

    // 3. Propeller Hub
    const hubGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const hub = new THREE.Mesh(hubGeometry, aluminum);
    hub.position.set(4, 0, 0);
    group.add(hub);

    parts.push({
        name: 'Propeller Hub',
        description: 'Central mounting point for the propeller blades.',
        material: 'aluminum',
        function: 'Blade retention and pitch control.',
        assemblyOrder: 3,
        connections: ['Drive Shaft', 'Propeller Blades'],
        failureEffect: 'Blade separation.',
        cascadeFailures: ['Catastrophic structural failure'],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // 4. Propeller Blades
    const blades = new THREE.Group();
    blades.position.set(4, 0, 0);
    const numBlades = 3;
    for (let i = 0; i < numBlades; i++) {
        const bladeGroup = new THREE.Group();
        
        // Blade profile
        const shape = new THREE.Shape();
        shape.moveTo(0, -0.2);
        shape.quadraticCurveTo(2, -0.4, 4, -0.1);
        shape.quadraticCurveTo(4.2, 0, 4, 0.1);
        shape.quadraticCurveTo(2, 0.3, 0, 0.2);
        shape.lineTo(0, -0.2);

        const extrudeSettings = {
            steps: 2,
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 2
        };

        const bladeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Center the geometry so it rotates around the hub properly
        bladeGeometry.translate(0.5, 0, -0.05);
        const blade = new THREE.Mesh(bladeGeometry, steel);
        
        // Add glowing edge
        const edgeGeometry = new THREE.BoxGeometry(3.5, 0.05, 0.15);
        const edge = new THREE.Mesh(edgeGeometry, neonBlue);
        edge.position.set(2.5, 0, 0);
        
        bladeGroup.add(blade);
        bladeGroup.add(edge);
        
        // Apply pitch (twist)
        bladeGroup.rotation.x = Math.PI / 6;
        
        // Distribute blades radially
        const angle = (i / numBlades) * Math.PI * 2;
        bladeGroup.rotation.z = angle;
        
        blades.add(bladeGroup);
    }
    group.add(blades);

    parts.push({
        name: 'Propeller Blades',
        description: 'Airfoils designed to convert rotational motion into aerodynamic thrust.',
        material: 'steel, neonBlue',
        function: 'Thrust generation via momentum transfer to air.',
        assemblyOrder: 4,
        connections: ['Propeller Hub'],
        failureEffect: 'Severe vibration, loss of thrust.',
        cascadeFailures: ['Engine mount failure', 'Loss of control'],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 7, y: 0, z: 0 }
    });

    // 5. Thrust Vector (Visual Representation)
    const thrustConeGeo = new THREE.ConeGeometry(2, 8, 32);
    thrustConeGeo.rotateZ(-Math.PI / 2);
    const thrustCone = new THREE.Mesh(thrustConeGeo, thrustGlow);
    thrustCone.position.set(8, 0, 0);
    group.add(thrustCone);

    parts.push({
        name: 'Thrust Vector',
        description: 'Visualizes the accelerated air mass (slipstream) generated by the propeller.',
        material: 'thrustGlow',
        function: 'Visualization of aerodynamic forces.',
        assemblyOrder: 5,
        connections: [],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 8, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    const description = "The Aerodynamics Propeller Thrust System demonstrates the principles of momentum theory and blade element theory. As the motor spins the propeller blades, they act like rotating wings. The specific shape (airfoil), pitch angle, and rotational speed accelerate the air backwards. According to Newton's Third Law of Motion, the force exerted on the air mass creates an equal and opposite reaction force, which is thrust.";

    const quizQuestions = [
        {
            question: "According to momentum theory, what causes a propeller to generate thrust?",
            options: [
                "Heating the air behind the propeller.",
                "Accelerating a mass of air in the direction opposite to the desired thrust.",
                "Creating a vacuum in front of the propeller.",
                "The friction between the blades and the air."
            ],
            correct: 1,
            explanation: "Thrust is generated by imparting a change in momentum to the air. By accelerating air backwards, the propeller creates a forward reaction force (thrust).",
            difficulty: "Medium"
        },
        {
            question: "What is the term for the cross-sectional shape of a propeller blade?",
            options: [
                "Cylinder",
                "Airfoil",
                "Chord",
                "Camber"
            ],
            correct: 1,
            explanation: "Like an airplane wing, the cross-section of a propeller blade is an airfoil designed to generate aerodynamic forces (lift/thrust) efficiently.",
            difficulty: "Easy"
        },
        {
            question: "How does the 'pitch' of a propeller blade affect its performance?",
            options: [
                "It changes the weight of the propeller.",
                "It determines the angle of attack of the blade relative to the oncoming air.",
                "It alters the color of the thrust vector.",
                "It has no effect on thrust."
            ],
            correct: 1,
            explanation: "Pitch is the angle of the blade relative to its plane of rotation. It dictates the 'bite' the propeller takes out of the air, analogous to the angle of attack of a wing.",
            difficulty: "Hard"
        }
    ];

    const meshes = {
        blades: blades,
        thrustCone: thrustCone,
        shaft: shaft
    };

    function animate(time, speed, meshes) {
        // Rotate the propeller and shaft
        const rotationSpeed = speed * 10;
        meshes.blades.rotation.x = time * rotationSpeed;
        meshes.shaft.rotation.x = time * rotationSpeed;

        // Pulsate thrust cone based on speed
        const thrustIntensity = Math.max(0.1, speed);
        meshes.thrustCone.scale.set(thrustIntensity, 1, thrustIntensity);
        meshes.thrustCone.material.opacity = 0.2 + (thrustIntensity * 0.4);
        
        // Add slight wobble to thrust to simulate turbulence
        meshes.thrustCone.position.y = Math.sin(time * 20) * 0.1 * speed;
        meshes.thrustCone.position.z = Math.cos(time * 15) * 0.1 * speed;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPropellerThrust() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
