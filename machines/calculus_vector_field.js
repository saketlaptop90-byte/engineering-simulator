import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9d00ff,
        emissive: 0x9d00ff,
        emissiveIntensity: 0.5,
        wireframe: true
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff003c,
        emissive: 0xff003c,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.3 });

    // 1. Central Vortex/Singularity Core
    const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeometry, neonPurple);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Singularity Core",
        description: "The central point of the vector field, representing a sink where divergence is highly negative, or a source depending on the flow state.",
        material: "neonPurple",
        function: "Acts as the origin point generating the vector field lines, influencing gradient, divergence, and curl in its vicinity.",
        assemblyOrder: 1,
        connections: ["Vector Arrows", "Grid Frame"],
        failureEffect: "Vector field collapses; field vectors point randomly.",
        cascadeFailures: ["Vector Field Dynamics"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Field Vectors (Hundreds of tiny glowing arrows)
    const arrowGroup = new THREE.Group();
    meshes.arrows = [];
    
    const gridSize = 4;
    const spacing = 1.5;
    
    // Geometry for arrow body and head
    const cylinderGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
    cylinderGeo.translate(0, 0.2, 0); // shift origin to base
    const coneGeo = new THREE.ConeGeometry(0.12, 0.3, 8);
    coneGeo.translate(0, 0.55, 0);
    
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                if (x === 0 && y === 0 && z === 0) continue; // Skip core
                
                const distance = Math.sqrt(x*x + y*y + z*z);
                if (distance > gridSize * 1.2) continue; // spherical bound
                
                const arrow = new THREE.Group();
                
                // Mix colors based on position
                const mat = (x*y*z % 2 === 0) ? neonBlue : neonRed;
                
                const body = new THREE.Mesh(cylinderGeo, mat);
                const head = new THREE.Mesh(coneGeo, mat);
                
                arrow.add(body);
                arrow.add(head);
                
                arrow.position.set(x * spacing, y * spacing, z * spacing);
                arrow.userData = {
                    initialPos: new THREE.Vector3(x * spacing, y * spacing, z * spacing),
                    radius: distance * spacing,
                    phase: Math.random() * Math.PI * 2,
                    speed: 1 / (distance + 1)
                };
                
                arrowGroup.add(arrow);
                meshes.arrows.push(arrow);
            }
        }
    }
    group.add(arrowGroup);
    
    parts.push({
        name: "Field Vectors",
        description: "A 3D matrix of vectors visualizing the magnitude and direction of the vector field at discrete points.",
        material: "neonBlue / neonRed",
        function: "Demonstrates the flow of the field. Their orientation represents the gradient, and their collective swirling visualizes the curl.",
        assemblyOrder: 2,
        connections: ["Singularity Core"],
        failureEffect: "Vectors lose orientation and tumble randomly in space.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Grid Frame / Coordinate System
    const boxGeo = new THREE.BoxGeometry(gridSize * 3, gridSize * 3, gridSize * 3);
    const gridMesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        gridMaterial
    );
    group.add(gridMesh);
    meshes.grid = gridMesh;

    parts.push({
        name: "Coordinate Manifold",
        description: "The underlying spatial grid defining the reference frame (x, y, z) for the vector field.",
        material: "darkSteel wireframe",
        function: "Provides a basis for measuring partial derivatives necessary for calculating divergence and curl.",
        assemblyOrder: 3,
        connections: ["Singularity Core"],
        failureEffect: "Spatial distortion; vector coordinates become unmeasurable.",
        cascadeFailures: ["Vector Field Dynamics"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: -10 }
    });

    // 4. Flux Shells (Concentric transparent spheres)
    const shellGeo = new THREE.SphereGeometry(3, 32, 32);
    const shellMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    group.add(shellMesh);
    meshes.shell = shellMesh;

    parts.push({
        name: "Gaussian Flux Surface",
        description: "A closed spherical surface enclosing the core.",
        material: "tinted glass / wireframe",
        function: "Used to visually demonstrate the Divergence Theorem, showing net flux of vectors passing through the surface.",
        assemblyOrder: 4,
        connections: ["Coordinate Manifold"],
        failureEffect: "Surface ruptures, unable to calculate net flux.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 10 }
    });


    const description = "The Calculus Vector Field simulator visualizes multivariable calculus concepts in 3D space. It features a singularity core generating a dynamic field of vectors. By observing the flow, users can intuitively grasp Gradient (direction of steepest ascent), Divergence (net flow in/out of a region), and Curl (macroscopic rotation or swirling of the field).";

    const quizQuestions = [
        {
            question: "If the vector field vectors are all pointing outward from the 'Singularity Core', what can we say about the Divergence at the core?",
            options: [
                "It is zero.",
                "It is positive (acting as a source).",
                "It is negative (acting as a sink).",
                "It is a vector pointing outwards."
            ],
            correct: 1,
            explanation: "Divergence measures the magnitude of a vector field's source or sink at a given point. If vectors are flowing outward, there is a net positive flow out of the region, indicating a positive divergence (a source).",
            difficulty: "Medium"
        },
        {
            question: "What does the 'Curl' of this 3D vector field represent physically?",
            options: [
                "The net flow of vectors passing through the Gaussian Flux Surface.",
                "The rate of change of the field's magnitude along the z-axis.",
                "The tendency of the field to induce rotation about a point.",
                "The steepest direction of increase of the underlying scalar potential."
            ],
            correct: 2,
            explanation: "Curl is a vector operator that describes the infinitesimal rotation (or swirling) of a 3D vector field. High curl indicates that if a tiny paddlewheel were placed in the field, it would spin rapidly.",
            difficulty: "Hard"
        },
        {
            question: "If this vector field is Conservative (i.e., it is the Gradient of some scalar potential function), what must be true about its Curl?",
            options: [
                "The Curl must be equal to the Divergence.",
                "The Curl must be exactly 1 everywhere.",
                "The Curl is a scalar value greater than zero.",
                "The Curl must be zero everywhere (irrotational)."
            ],
            correct: 3,
            explanation: "A fundamental theorem of vector calculus states that the curl of the gradient of any twice-differentiable scalar function is always the zero vector. Thus, conservative fields are always irrotational.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the core
        const pulse = 1 + 0.1 * Math.sin(time * speed * 2);
        if (meshes.core) meshes.core.scale.set(pulse, pulse, pulse);
        
        // Rotate the shell
        if (meshes.shell) {
            meshes.shell.rotation.y = time * speed * 0.2;
            meshes.shell.rotation.x = time * speed * 0.1;
        }

        // Animate the vector field (Swirling effect for curl, pointing inwards/outwards for divergence)
        if (meshes.arrows) {
            meshes.arrows.forEach(arrow => {
                const pos = arrow.userData.initialPos;
                
                // Complex flow vector field equation
                // V(x,y,z) = [ -y - z, x + z, x - y ]  <-- creates a swirling (curl) effect
                // We combine this with a slight inward sink (divergence)
                
                const dx = -pos.y * 0.5 - pos.z * 0.2 - pos.x * 0.1;
                const dy = pos.x * 0.5 + pos.z * 0.2 - pos.y * 0.1;
                const dz = pos.x * 0.2 - pos.y * 0.2 - pos.z * 0.1;
                
                // Create a target point to look at
                const target = new THREE.Vector3(pos.x + dx, pos.y + dy, pos.z + dz);
                
                // Make arrow point along the vector
                // In Three.js, Object3D.lookAt points the local -Z axis towards the target
                // But our cylinder/cone combo points along local +Y by default
                // Let's create a dummy object to handle the orientation
                const dummy = new THREE.Object3D();
                dummy.position.copy(pos);
                dummy.lookAt(target);
                dummy.rotateX(Math.PI / 2); // Rotate 90 degrees around X to align +Y with -Z
                
                // Add a dynamic wave effect to the magnitude/scale of vectors
                const wave = Math.sin(time * speed * 3 + arrow.userData.radius) * 0.5 + 0.5;
                const mag = Math.sqrt(dx*dx + dy*dy + dz*dz) * (0.5 + wave * 0.5);
                
                arrow.quaternion.copy(dummy.quaternion);
                
                // Optional: orbit them around slightly
                const angle = time * speed * arrow.userData.speed;
                const radius = arrow.userData.radius;
                
                // Slight orbital displacement
                arrow.position.x = pos.x + Math.sin(angle + pos.y) * 0.2;
                arrow.position.y = pos.y + Math.cos(angle + pos.x) * 0.2;
                arrow.position.z = pos.z + Math.sin(angle + pos.z) * 0.2;
                
                // Pulse the emissive intensity based on speed
                const material = arrow.children[0].material;
                if (material) {
                    material.emissiveIntensity = 0.5 + wave * 0.8;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createVectorField() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
