import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const iridiumCoating = new THREE.MeshPhysicalMaterial({
        color: 0x8888aa,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0
    });

    const zerodurGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        transmission: 0.9,
        ior: 1.5
    });

    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.4,
        bumpScale: 0.02
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        metalness: 0.1,
        roughness: 0.2
    });

    // Helper functions to create parts
    function createPart(name, geometry, material, position, explodedPosition, description, partFunction, assemblyOrder, connections, failureEffect, cascadeFailures) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        group.add(mesh);
        
        parts.push({
            name,
            description,
            material: material.type,
            function: partFunction,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: position,
            explodedPosition: explodedPosition,
            mesh: mesh
        });
        return mesh;
    }

    // 1. Central Support Tube
    const supportGeometry = new THREE.CylinderGeometry(0.8, 0.8, 10, 32);
    createPart(
        "Central Support Tube",
        supportGeometry,
        chrome,
        {x: 0, y: 0, z: 0},
        {x: 0, y: -5, z: 0},
        "The main backbone structure supporting the mirror shells.",
        "Provides rigid support and alignment for the concentric mirror shells.",
        1,
        ["Mirror Shells", "Support Struts"],
        "Misalignment of the entire optical assembly.",
        ["Loss of focus", "Degraded image resolution"]
    );

    // 2. Paraboloid Mirror Shells (Inner)
    // Simulating the grazing incidence mirrors using truncated cones/cylinders
    const pMirrorGeo = new THREE.CylinderGeometry(1.4, 1.5, 4, 64, 1, true);
    const pMirror = createPart(
        "Paraboloid Shell (Inner)",
        pMirrorGeo,
        iridiumCoating,
        {x: 0, y: 2, z: 0},
        {x: 0, y: 5, z: 0},
        "Highly polished inner paraboloid mirror shell.",
        "Performs the initial grazing incidence reflection of incoming X-rays.",
        2,
        ["Central Support Tube", "Hyperboloid Shell (Inner)"],
        "X-rays are scattered instead of focused.",
        ["Reduced collecting area", "Blurry imaging"]
    );
    pMirror.material.side = THREE.DoubleSide;

    // 3. Hyperboloid Mirror Shells (Inner)
    const hMirrorGeo = new THREE.CylinderGeometry(1.3, 1.4, 4, 64, 1, true);
    const hMirror = createPart(
        "Hyperboloid Shell (Inner)",
        hMirrorGeo,
        iridiumCoating,
        {x: 0, y: -2, z: 0},
        {x: 0, y: -8, z: 0},
        "Highly polished inner hyperboloid mirror shell.",
        "Performs the secondary reflection, focusing X-rays to the focal point.",
        3,
        ["Paraboloid Shell (Inner)"],
        "Improper focusing of X-rays.",
        ["Complete loss of high-resolution imaging"]
    );
    hMirror.material.side = THREE.DoubleSide;

    // 4. Paraboloid Mirror Shells (Outer)
    const pOuterGeo = new THREE.CylinderGeometry(2.4, 2.5, 4, 64, 1, true);
    const pOuter = createPart(
        "Paraboloid Shell (Outer)",
        pOuterGeo,
        iridiumCoating,
        {x: 0, y: 2, z: 0},
        {x: 5, y: 5, z: 0},
        "Outer paraboloid mirror shell.",
        "Increases the total collecting area for X-rays.",
        4,
        ["Support Struts"],
        "Decreased sensitivity to faint X-ray sources.",
        ["Longer required exposure times"]
    );
    pOuter.material.side = THREE.DoubleSide;

    // 5. Hyperboloid Mirror Shells (Outer)
    const hOuterGeo = new THREE.CylinderGeometry(2.3, 2.4, 4, 64, 1, true);
    const hOuter = createPart(
        "Hyperboloid Shell (Outer)",
        hOuterGeo,
        iridiumCoating,
        {x: 0, y: -2, z: 0},
        {x: -5, y: -8, z: 0},
        "Outer hyperboloid mirror shell.",
        "Secondary reflection for outer shell, focuses to the common focal point.",
        5,
        ["Paraboloid Shell (Outer)"],
        "Decreased sensitivity and focus for outer aperture.",
        ["Loss of faint object detection"]
    );
    hOuter.material.side = THREE.DoubleSide;

    // 6. Thermal Pre-collimator
    const collimatorGeo = new THREE.CylinderGeometry(2.6, 2.6, 1, 32, 1, true);
    const collimator = createPart(
        "Thermal Pre-collimator",
        collimatorGeo,
        goldFoil,
        {x: 0, y: 4.5, z: 0},
        {x: 0, y: 10, z: 0},
        "A grid-like structure at the entrance aperture.",
        "Maintains thermal stability and prevents stray light/particles from entering.",
        6,
        ["Paraboloid Shells"],
        "Thermal expansion of mirrors.",
        ["Severe focus degradation", "Mirror distortion"]
    );
    collimator.material.side = THREE.DoubleSide;

    // 7. Support Struts (Spiders)
    const strutGeo = new THREE.BoxGeometry(5.2, 0.2, 0.2);
    createPart(
        "Support Struts (Top)",
        strutGeo,
        darkSteel,
        {x: 0, y: 3.9, z: 0},
        {x: 0, y: 12, z: 0},
        "Radial struts holding the nested shells.",
        "Keeps the nested mirror shells perfectly aligned concentrically.",
        7,
        ["Central Support Tube", "Mirror Shells"],
        "Loss of concentricity among shells.",
        ["Ghost images", "Catastrophic optical failure"]
    );

    const strutGeo2 = new THREE.BoxGeometry(0.2, 0.2, 5.2);
    createPart(
        "Support Struts (Cross)",
        strutGeo2,
        darkSteel,
        {x: 0, y: 3.9, z: 0},
        {x: 0, y: 12, z: 5},
        "Cross radial struts for structural integrity.",
        "Provides lateral stability to the mirror assembly.",
        8,
        ["Central Support Tube", "Mirror Shells"],
        "Vibration induced misalignment.",
        ["Blurry imaging during spacecraft maneuvers"]
    );

    // 8. Optical Bench Interface Ring
    const ringGeo = new THREE.TorusGeometry(2.8, 0.3, 16, 64);
    createPart(
        "Interface Ring",
        ringGeo,
        aluminum,
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: -8},
        "Heavy mounting ring at the center of mass.",
        "Attaches the High Resolution Mirror Assembly to the telescope optical bench.",
        9,
        ["Central Support Tube", "Spacecraft Bus"],
        "Detachment from spacecraft.",
        ["Complete mission failure"]
    );

    // 9. X-ray Particle Path Sensors (Visual flair)
    const sensorGeo = new THREE.SphereGeometry(0.3, 16, 16);
    createPart(
        "Alignment Sensor Alpha",
        sensorGeo,
        neonBlue,
        {x: 2.8, y: 0, z: 0},
        {x: 8, y: 0, z: 0},
        "High-tech laser alignment sensor.",
        "Monitors structural deformation at sub-micron levels.",
        10,
        ["Interface Ring"],
        "Loss of telemetry.",
        ["Inability to correct thermal drift"]
    );

    createPart(
        "Alignment Sensor Beta",
        sensorGeo,
        neonRed,
        {x: -2.8, y: 0, z: 0},
        {x: -8, y: 0, z: 0},
        "Redundant thermal/alignment sensor.",
        "Provides backup monitoring for the optical assembly.",
        11,
        ["Interface Ring"],
        "Loss of redundancy.",
        ["Risk of undetected misalignment"]
    );

    // 10. Thermal Blankets (Zerodur simulation layer)
    const blanketGeo = new THREE.CylinderGeometry(2.6, 2.6, 8, 32, 1, true);
    const blanket = createPart(
        "Zerodur Thermal Shield",
        blanketGeo,
        zerodurGlass,
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 10},
        "Outer protective layer made of ultra-low expansion glass material.",
        "Protects the assembly from extreme temperature gradients in space.",
        12,
        ["Interface Ring"],
        "Thermal shock.",
        ["Mirror cracking", "Catastrophic failure"]
    );
    blanket.material.side = THREE.DoubleSide;

    const description = "The Space X-Ray Mirror (Grazing Incidence) is a high-precision optical assembly used in telescopes like Chandra. It features nested paraboloid and hyperboloid shells coated with iridium. Because X-rays would pass straight through standard mirrors, these mirrors use 'grazing incidence' (very shallow angles) to gently reflect and focus the X-rays onto a detector.";

    const quizQuestions = [
        {
            question: "Why do X-ray telescopes use 'grazing incidence' mirrors instead of standard perpendicular mirrors?",
            options: [
                "To reduce the weight of the telescope",
                "Because X-rays would be absorbed or pass right through standard mirrors at direct angles",
                "To capture visible light alongside X-rays",
                "Grazing incidence mirrors are easier to manufacture"
            ],
            correct: 1,
            explanation: "X-rays are highly energetic. If they strike a mirror straight on, they penetrate or are absorbed. By striking at a very shallow 'grazing' angle, they skip off the surface like a stone skipping on water.",
            difficulty: "Medium"
        },
        {
            question: "What are the shapes of the two sequential mirror shells used to focus the X-rays?",
            options: [
                "Spherical and Flat",
                "Convex and Concave",
                "Paraboloid followed by Hyperboloid",
                "Hyperboloid followed by Paraboloid"
            ],
            correct: 2,
            explanation: "The Wolter Type I design, used in most X-ray telescopes, utilizes a paraboloid mirror followed by a hyperboloid mirror to successfully focus X-rays.",
            difficulty: "Hard"
        },
        {
            question: "What heavy metal is commonly used to coat the inside of the mirror shells to improve X-ray reflectivity?",
            options: [
                "Aluminum",
                "Iridium",
                "Iron",
                "Copper"
            ],
            correct: 1,
            explanation: "Iridium, a highly dense metal, is often used as a thin coating on X-ray mirrors (like in the Chandra X-ray Observatory) because of its excellent X-ray reflectivity.",
            difficulty: "Hard"
        },
        {
            question: "Why are multiple mirror shells 'nested' inside one another?",
            options: [
                "To provide structural support",
                "To focus different wavelengths of light separately",
                "To increase the total collecting area for X-rays",
                "As backups in case the outer mirror breaks"
            ],
            correct: 2,
            explanation: "Because the grazing angle is so small, a single cylindrical mirror presents a very small cross-section to incoming X-rays. Nesting many mirrors increases the total collecting area.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle pulsing of neon sensors
        const alphaSensor = meshes.find(m => m.name === "Alignment Sensor Alpha");
        if (alphaSensor && alphaSensor.material.emissiveIntensity !== undefined) {
            alphaSensor.material.emissiveIntensity = 0.5 + Math.sin(time * 3 * speed) * 0.4;
        }

        const betaSensor = meshes.find(m => m.name === "Alignment Sensor Beta");
        if (betaSensor && betaSensor.material.emissiveIntensity !== undefined) {
            betaSensor.material.emissiveIntensity = 0.5 + Math.cos(time * 3 * speed) * 0.4;
        }

        // Slow rotation of the entire assembly to show it's active in space
        group.rotation.y = time * 0.1 * speed;
        group.rotation.z = Math.sin(time * 0.05 * speed) * 0.05;

        // Subtle thermal shield shimmer
        const shield = meshes.find(m => m.name === "Zerodur Thermal Shield");
        if (shield && shield.material.opacity !== undefined) {
            shield.material.opacity = 0.5 + Math.sin(time * speed) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createXRayMirror() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
