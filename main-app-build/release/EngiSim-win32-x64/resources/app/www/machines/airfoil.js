import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for visual flair (e.g., streamline particles bending over the wing)
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.5
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.5
    });

    const airfoilMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
    });

    // Create the Airfoil geometry using a Shape
    const airfoilShape = new THREE.Shape();
    // Simple NACA-like airfoil shape approximation
    airfoilShape.moveTo(1, 0); // Trailing edge
    airfoilShape.splineThru([
        new THREE.Vector2(0.8, 0.05),
        new THREE.Vector2(0.5, 0.12),
        new THREE.Vector2(0.2, 0.15),
        new THREE.Vector2(0.05, 0.1),
        new THREE.Vector2(0, 0),    // Leading edge
        new THREE.Vector2(0.05, -0.05),
        new THREE.Vector2(0.2, -0.08),
        new THREE.Vector2(0.5, -0.05),
        new THREE.Vector2(0.8, -0.02),
        new THREE.Vector2(1, 0)
    ]);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02
    };

    const airfoilGeometry = new THREE.ExtrudeGeometry(airfoilShape, extrudeSettings);
    airfoilGeometry.center(); // Center the geometry
    const airfoilMesh = new THREE.Mesh(airfoilGeometry, airfoilMaterial);
    
    // Scale and position
    airfoilMesh.scale.set(3, 3, 3);
    
    group.add(airfoilMesh);

    parts.push({
        name: "Airfoil Body",
        description: "The primary cross-section of an aircraft wing, designed to generate lift by manipulating air pressure.",
        material: "Advanced Composite / Titanium",
        function: "Creates a pressure differential (lower pressure on top, higher on bottom) to generate aerodynamic lift.",
        assemblyOrder: 1,
        connections: ["Wind Tunnel Supports"],
        failureEffect: "Loss of aerodynamic properties, leading to stall or complete loss of lift.",
        cascadeFailures: ["Aerodynamic stall", "Aircraft crash"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: airfoilMesh
    });

    // Create wind tunnel streamline particles
    const particleCount = 200;
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleGroup = new THREE.Group();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const isUpper = Math.random() > 0.5; // Top or bottom stream
        const material = isUpper ? neonBlue : neonRed;
        const particle = new THREE.Mesh(particleGeometry, material);
        
        // Initial setup
        const startX = -8 - Math.random() * 5;
        const startY = isUpper ? (0.2 + Math.random() * 1.5) : (-0.2 - Math.random() * 1.5);
        const startZ = (Math.random() - 0.5) * 5;
        
        particle.position.set(startX, startY, startZ);
        
        particle.userData = {
            isUpper: isUpper,
            baseY: startY,
            speed: 0.05 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2
        };

        particleGroup.add(particle);
        particles.push(particle);
    }
    
    group.add(particleGroup);

    parts.push({
        name: "Fluid Streamlines",
        description: "High-tech visualizations of air flow over the aerodynamic surface.",
        material: "Neon Particle Emitters",
        function: "Demonstrates Bernoulli's principle. Blue particles move faster over the curved top surface, while red particles move slower underneath.",
        assemblyOrder: 2,
        connections: ["Airfoil Body"],
        failureEffect: "Disrupted flow visualization.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        mesh: particleGroup
    });

    // Adding wind tunnel walls
    const tunnelGeo = new THREE.BoxGeometry(20, 10, 8);
    const tunnelMat = new THREE.MeshPhysicalMaterial({
        color: 0x112233,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        roughness: 0.0,
        metalness: 0.2
    });
    const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    group.add(tunnel);

    parts.push({
        name: "Wind Tunnel Enclosure",
        description: "A controlled aerodynamic testing environment.",
        material: "Reinforced Polycarbonate Glass",
        function: "Channels airflow directly over the airfoil with minimal external turbulence.",
        assemblyOrder: 3,
        connections: ["Airfoil Body"],
        failureEffect: "Loss of controlled environment, causing inaccurate aerodynamic readings.",
        cascadeFailures: ["Turbulence", "Data corruption"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: tunnel
    });

    // Lift and Drag Vector Arrows
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    const liftArrowGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const liftArrow = new THREE.Mesh(liftArrowGeo, arrowMat);
    liftArrow.position.set(0, 1, 0);
    
    const liftHeadGeo = new THREE.ConeGeometry(0.3, 0.5, 8);
    const liftHead = new THREE.Mesh(liftHeadGeo, arrowMat);
    liftHead.position.set(0, 2, 0);
    
    const liftVector = new THREE.Group();
    liftVector.add(liftArrow);
    liftVector.add(liftHead);
    group.add(liftVector);

    parts.push({
        name: "Lift Force Vector",
        description: "Visual representation of the upward lift force generated by pressure differences.",
        material: "Holographic Projection",
        function: "Indicates the magnitude and direction of aerodynamic lift.",
        assemblyOrder: 4,
        connections: ["Airfoil Body"],
        failureEffect: "Visual readout failure.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: liftVector
    });

    const description = "Ultra high-tech Fluid Dynamics simulator. Visualizes air flow, lift, and drag around a NACA airfoil using dynamic streamlines.";

    const quizQuestions = [
        {
            question: "According to Bernoulli's principle, what happens to the pressure of a fluid when its velocity increases?",
            options: [
                "It increases",
                "It decreases",
                "It remains the same",
                "It fluctuates rapidly"
            ],
            correct: 1,
            explanation: "Bernoulli's principle states that an increase in the speed of a fluid occurs simultaneously with a decrease in static pressure.",
            difficulty: "Medium"
        },
        {
            question: "Why is the top surface of an airfoil typically curved more than the bottom?",
            options: [
                "To make the wing look aesthetically pleasing",
                "To increase structural integrity",
                "To force air to travel faster over the top, reducing pressure and generating lift",
                "To increase drag during landing"
            ],
            correct: 2,
            explanation: "The curved upper surface (camber) forces air to travel a longer distance in the same amount of time, increasing its speed and thereby decreasing pressure relative to the bottom, generating lift.",
            difficulty: "Easy"
        },
        {
            question: "What aerodynamic force opposes the forward motion of an airfoil?",
            options: [
                "Lift",
                "Thrust",
                "Weight",
                "Drag"
            ],
            correct: 3,
            explanation: "Drag is the aerodynamic force that opposes an aircraft's motion through the air, caused by friction and differences in air pressure.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed = 1, meshes = parts) {
        // Find the airfoil part mesh
        const airfoilMesh = meshes.find(p => p.name === "Airfoil Body")?.mesh;
        
        // Gentle hovering effect for the airfoil
        if (airfoilMesh) {
            airfoilMesh.position.y = Math.sin(time * 2) * 0.1;
            airfoilMesh.rotation.z = Math.sin(time * 0.5) * 0.05; // Slight angle of attack oscillation
        }

        const liftVector = meshes.find(p => p.name === "Lift Force Vector")?.mesh;
        if (liftVector) {
            liftVector.position.y = Math.sin(time * 2) * 0.1; // Follow airfoil
            const liftMagnitude = 1 + Math.sin(time * 0.5) * 0.2;
            liftVector.scale.set(1, liftMagnitude, 1);
        }

        // Animate fluid particles
        const particleMeshGroup = meshes.find(p => p.name === "Fluid Streamlines")?.mesh;
        if (particleMeshGroup) {
            particleMeshGroup.children.forEach(particle => {
                const data = particle.userData;
                
                // Move particle forward
                particle.position.x += data.speed * speed * 20;

                // Airfoil influence (approximate bounding box of airfoil from x=-1.5 to x=1.5)
                const distToCenter = particle.position.x;
                
                if (distToCenter > -2 && distToCenter < 2) {
                    // Over the airfoil
                    if (data.isUpper) {
                        // Bend up and accelerate
                        const arch = Math.sin((distToCenter + 2) / 4 * Math.PI);
                        particle.position.y = data.baseY + arch * 0.8;
                        particle.position.x += data.speed * speed * 10; // Speed up over top
                    } else {
                        // Bend down slightly
                        const dip = Math.sin((distToCenter + 2) / 4 * Math.PI);
                        particle.position.y = data.baseY - dip * 0.2;
                    }
                } else {
                    // Flatten out
                    particle.position.y += (data.baseY - particle.position.y) * 0.1;
                }

                // Reset particle when it goes out of bounds
                if (particle.position.x > 8) {
                    particle.position.x = -8 - Math.random() * 2;
                    particle.position.y = data.baseY;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirfoil() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
