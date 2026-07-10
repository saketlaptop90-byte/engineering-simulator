import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for visual flair
    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });

    const arrowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const divergenceGlow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    // Base Platform
    const baseGeo = new THREE.CylinderGeometry(15, 15, 1, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -10, 0);
    group.add(baseMesh);

    parts.push({
        name: "Containment Base",
        description: "The primary containment platform for the algebraic vector field.",
        material: "darkSteel",
        function: "Provides a stable spatial frame of reference for the field vectors.",
        assemblyOrder: 1,
        connections: ["Vector Field Emitters"],
        failureEffect: "Reference frame collapse, causing spatial disorientation and singularity drift.",
        cascadeFailures: ["Singularity Core", "Vector Field Emitters"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 },
        mesh: baseMesh
    });

    // Core Singularity
    const coreGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const coreMesh = new THREE.Mesh(coreGeo, divergenceGlow);
    group.add(coreMesh);
    
    parts.push({
        name: "Singularity Core",
        description: "The origin point of the vector field, exhibiting extremely high divergence.",
        material: "divergenceGlow",
        function: "Acts as the source emitting the flux lines of the vector field.",
        assemblyOrder: 2,
        connections: ["Containment Base", "Vector Arrows"],
        failureEffect: "Field collapses to zero divergence, eliminating local flux.",
        cascadeFailures: ["Vector Arrows"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: coreMesh
    });

    // Vector Arrow Generator
    const arrowCount = 400; // Thousands conceptually, kept at 400 for performance while still stunning
    const arrowMeshes = [];
    const arrowGroup = new THREE.Group();

    // Reusable geometries
    const coneGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const sphereGeo = new THREE.SphereGeometry(0.1, 8, 8);

    for (let i = 0; i < arrowCount; i++) {
        // Distribute uniformly in a spherical volume
        const r = 3 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        const arrowObj = new THREE.Group();
        arrowObj.position.set(x, y, z);
        
        // Define Field: F(x, y, z) = (-y, x, z)
        // This field has both curl (around z) and divergence (outwards in z, and planar depending on sign)
        const vx = -y;
        const vy = x;
        const vz = z;

        const dir = new THREE.Vector3(vx, vy, vz).normalize();
        
        const shaft = new THREE.Mesh(cylinderGeo, glowMaterial);
        shaft.position.y = 0.75;
        const head = new THREE.Mesh(coneGeo, arrowMaterial);
        head.position.y = 1.9;
        const tail = new THREE.Mesh(sphereGeo, glowMaterial);
        tail.position.y = 0;
        
        const arrowMeshGroup = new THREE.Group();
        arrowMeshGroup.add(shaft);
        arrowMeshGroup.add(head);
        arrowMeshGroup.add(tail);

        // Orient arrow to face direction
        const quaternion = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(up, dir);
        arrowMeshGroup.setRotationFromQuaternion(quaternion);

        arrowObj.add(arrowMeshGroup);
        arrowGroup.add(arrowObj);

        arrowMeshes.push({
            obj: arrowObj,
            dir: dir,
            baseX: x,
            baseY: y,
            baseZ: z,
            vx: vx,
            vy: vy,
            vz: vz,
            speedOffset: Math.random() * Math.PI * 2
        });
    }

    group.add(arrowGroup);

    parts.push({
        name: "Vector Emitters Array",
        description: "Discrete samples mapping the continuous algebraic field F(x,y,z).",
        material: "Neon Emissive",
        function: "Visualizes the magnitude, direction, curl, and divergence of the local vector math.",
        assemblyOrder: 3,
        connections: ["Singularity Core"],
        failureEffect: "Vectors lose their mathematical alignment, falling into chaos.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: arrowGroup
    });

    // Vorticity Rings
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(8, 0.15, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo1, chrome);
    ringMesh1.rotation.x = Math.PI / 2;
    ringGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(12, 0.15, 16, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, chrome);
    ringMesh2.rotation.x = Math.PI / 2;
    ringGroup.add(ringMesh2);

    group.add(ringGroup);

    parts.push({
        name: "Vorticity Rings",
        description: "Metallic boundary rings representing the macroscopic curl and circulation.",
        material: "chrome",
        function: "Highlights the rotational component (curl) of the field mathematically.",
        assemblyOrder: 4,
        connections: ["Containment Base"],
        failureEffect: "Loss of rotational boundary definition, resulting in infinite curl expansion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 15 },
        mesh: ringGroup
    });

    const description = "An ultra high-tech algebraic vector field simulation demonstrating fundamental principles of vector calculus. Featuring pulsating neon arrows mapping the mathematical space F(x,y,z) = (-y, x, z) to illustrate divergence (outward flux) and curl (circulation).";

    const quizQuestions = [
        {
            question: "What does the divergence of a vector field represent physically?",
            options: [
                "The tendency of the field to rotate about a point",
                "The magnitude of the source or sink at a given point",
                "The gradient of the scalar potential",
                "The work done moving a particle along a path"
            ],
            correct: 1,
            explanation: "Divergence measures the net outward flux per unit volume at a point. Positive divergence acts as a source, while negative acts as a sink.",
            difficulty: "Medium"
        },
        {
            question: "If a vector field has zero curl everywhere, it is considered:",
            options: [
                "Solenoidal",
                "Conservative (Irrotational)",
                "Harmonic",
                "Orthogonal"
            ],
            correct: 1,
            explanation: "A field with zero curl is irrotational, meaning it has no circulation. It is often called conservative, implying it can be expressed as the gradient of a scalar potential.",
            difficulty: "Hard"
        },
        {
            question: "For the vector field F(x, y, z) = -y i + x j + z k, what axis is the rotation (curl) primarily oriented around?",
            options: [
                "The x-axis",
                "The y-axis",
                "The z-axis",
                "It does not rotate"
            ],
            correct: 2,
            explanation: "The terms -y i + x j correspond to a counter-clockwise rotation in the xy-plane, meaning the curl (axis of rotation) points along the z-axis.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // Core pulsing
        coreMesh.scale.setScalar(1 + 0.15 * Math.sin(t * 3));
        coreMesh.rotation.y = t;
        coreMesh.rotation.x = t * 0.5;
        divergenceGlow.emissiveIntensity = 1.5 + 0.5 * Math.sin(t * 5);

        // Vorticity Rings rotation
        ringMesh1.rotation.z = t * 2.0;
        ringMesh2.rotation.z = t * 1.5;

        // Vector Field Animation (Flow and Scale)
        arrowMeshes.forEach((item) => {
            // Oscillate size to simulate energy waves flowing outward
            const wave = Math.sin(t * 4 + item.speedOffset);
            const scale = 0.8 + 0.4 * wave;
            item.obj.scale.set(scale, scale, scale);

            // Flow displacement
            const flowOffset = (t * 2 + item.speedOffset) % (Math.PI * 2);
            item.obj.position.x = item.baseX + item.vx * Math.sin(flowOffset) * 0.1;
            item.obj.position.y = item.baseY + item.vy * Math.sin(flowOffset) * 0.1;
            item.obj.position.z = item.baseZ + item.vz * Math.sin(flowOffset) * 0.1;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVectorField() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
