import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const glowingGridMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });

    const holographicMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        emissive: 0x224488,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });

    // 1. Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(5, 6, 1, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -5, 0);
    group.add(baseMesh);

    parts.push({
        name: "Quantum Base Pedestal",
        description: "A solid dark steel base that grounds the hyperbolic paraboloid projection matrix.",
        material: "Dark Steel",
        function: "Provides structural stability and houses the primary energy conduit.",
        assemblyOrder: 1,
        connections: ["Holographic Projector Core"],
        failureEffect: "Complete structural collapse of the projection.",
        cascadeFailures: ["Holographic Projector Core", "Surface Mesh"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: baseMesh
    });

    // 2. Holographic Projector Core
    const coreGeo = new THREE.TorusGeometry(3, 0.4, 32, 100);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreMesh.rotation.x = Math.PI / 2;
    coreMesh.position.set(0, -4, 0);
    group.add(coreMesh);

    parts.push({
        name: "Holographic Projector Core",
        description: "A toroid array of photon emitters.",
        material: "Chrome",
        function: "Generates the base light field that creates the mathematical surface.",
        assemblyOrder: 2,
        connections: ["Quantum Base Pedestal", "Central Axis Pillar"],
        failureEffect: "Projection dims and loses cohesion.",
        cascadeFailures: ["Surface Mesh", "Wireframe Grid"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: coreMesh
    });

    // 3. Central Axis Pillar
    const axisGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);
    const axisMesh = new THREE.Mesh(axisGeo, neonBlue);
    group.add(axisMesh);

    parts.push({
        name: "Central Axis Pillar (Z-Axis)",
        description: "The primary coordinate axis around which the surface is plotted.",
        material: "Neon Blue Plasma",
        function: "Defines the Z-axis for the parametric equation rendering.",
        assemblyOrder: 3,
        connections: ["Holographic Projector Core", "Surface Mesh"],
        failureEffect: "Spatial distortion of the mathematical model.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: axisMesh
    });

    // 4. The Hyperbolic Paraboloid Surface (z = x^2/a^2 - y^2/b^2)
    const width = 50;
    const height = 50;
    const surfaceGeo = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uvs = [];

    const aParam = 2;
    const bParam = 2;

    for ( let i = 0; i <= width; i ++ ) {
        const u = i / width;
        const x = (u - 0.5) * 10;

        for ( let j = 0; j <= height; j ++ ) {
            const v = j / height;
            const y = (v - 0.5) * 10;
            
            const z = (x*x)/(aParam*aParam) - (y*y)/(bParam*bParam);

            vertices.push( x, z * 0.2, y );
            uvs.push( u, v );
        }
    }

    for ( let i = 0; i < width; i ++ ) {
        for ( let j = 0; j < height; j ++ ) {
            const a = i * ( height + 1 ) + j;
            const b = i * ( height + 1 ) + j + 1;
            const c = ( i + 1 ) * ( height + 1 ) + j;
            const d = ( i + 1 ) * ( height + 1 ) + j + 1;

            indices.push( a, b, d );
            indices.push( a, d, c );
        }
    }

    surfaceGeo.setIndex( indices );
    surfaceGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    surfaceGeo.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
    surfaceGeo.computeVertexNormals();

    const surfaceMesh = new THREE.Mesh(surfaceGeo, holographicMat);
    group.add(surfaceMesh);

    parts.push({
        name: "Hyperbolic Paraboloid Surface",
        description: "A doubly ruled mathematical surface, commonly known as a saddle shape.",
        material: "Holographic Polymer",
        function: "Visualizes the quadratic equation z = (x²/a²) - (y²/b²).",
        assemblyOrder: 4,
        connections: ["Central Axis Pillar"],
        failureEffect: "Surface destabilizes into random point clouds.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 },
        mesh: surfaceMesh
    });

    // 5. Dynamic Wireframe Overlay
    const wireframeGeo = surfaceGeo.clone();
    const wireframeMesh = new THREE.Mesh(wireframeGeo, glowingGridMat);
    group.add(wireframeMesh);

    parts.push({
        name: "Parametric Wireframe Grid",
        description: "A glowing magenta wireframe highlighting the ruling lines of the surface.",
        material: "Glowing Magenta Grid",
        function: "Displays the underlying parametric UV mapping and straight-line rulings.",
        assemblyOrder: 5,
        connections: ["Hyperbolic Paraboloid Surface"],
        failureEffect: "Loss of topological mapping visibility.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: wireframeMesh
    });

    const description = "The Algebraic Quadratic Surface machine generates an interactive, high-tech holographic visualization of a Hyperbolic Paraboloid. Often called a 'saddle surface', this doubly ruled surface is unique because it contains two families of straight lines, despite being curved everywhere. It is a critical shape in architecture, structural engineering, and optics.";

    const quizQuestions = [
        {
            question: "Which of the following equations represents a hyperbolic paraboloid?",
            options: [
                "x² + y² + z² = r²",
                "z = x² + y²",
                "z = (x²/a²) - (y²/b²)",
                "x²/a² + y²/b² + z²/c² = 1"
            ],
            correct: 2,
            explanation: "The equation z = x²/a² - y²/b² defines a hyperbolic paraboloid, showing its saddle-like shape which curves upward along one axis and downward along the perpendicular axis.",
            difficulty: "Medium"
        },
        {
            question: "A hyperbolic paraboloid is an example of a doubly ruled surface. What does this mean?",
            options: [
                "It can only be drawn using two colors.",
                "Through every point on the surface, there are exactly two distinct straight lines that lie entirely on the surface.",
                "It has exactly two lines of symmetry.",
                "It is formed by ruling out two types of geometric shapes."
            ],
            correct: 1,
            explanation: "A doubly ruled surface is a surface where through every point, there are two distinct straight lines that lie completely on the surface. For the hyperbolic paraboloid, these form the 'grid' lines.",
            difficulty: "Hard"
        },
        {
            question: "Why is the hyperbolic paraboloid commonly used in modern architecture (like roof structures)?",
            options: [
                "It reflects all sound to a single focal point.",
                "It can be constructed from straight beams despite forming a curved surface, making it strong and economical.",
                "It is the only shape that perfectly sheds water.",
                "It acts as a giant solar parabolic mirror."
            ],
            correct: 1,
            explanation: "Because it's a doubly ruled surface, builders can create strong, rigid, curved shell structures (like roofs) using straight steel beams or wooden planks, which is much cheaper and easier than creating curved beams.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire group slowly
        group.rotation.y = time * 0.2 * speed;
        
        // Morph the wireframe colors
        const hue = (time * 0.1 * speed) % 1;
        glowingGridMat.color.setHSL(hue, 1, 0.5);
        glowingGridMat.emissive.setHSL(hue, 1, 0.5);
        
        // Pulse the central axis
        neonBlue.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed) * 0.5;
        
        // Float the core projector
        coreMesh.position.y = -4 + Math.sin(time * 1.5 * speed) * 0.2;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createQuadraticSurface() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
