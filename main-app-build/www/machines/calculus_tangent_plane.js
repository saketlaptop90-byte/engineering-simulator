import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Mathematical surface function: z = f(x, y)
    // Let's use a combination of sine and cosine: z = A * sin(kx * x) * cos(ky * y)
    const A = 2.0;
    const kx = 0.5;
    const ky = 0.5;
    
    const f = (x, y) => A * Math.sin(kx * x) * Math.cos(ky * y);
    const df_dx = (x, y) => A * kx * Math.cos(kx * x) * Math.cos(ky * y);
    const df_dy = (x, y) => -A * ky * Math.sin(kx * x) * Math.sin(ky * y);

    // High-tech glowing materials
    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0044aa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        wireframe: false
    });
    
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const tangentPlaneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
        metalness: 0.9,
        side: THREE.DoubleSide
    });

    const neonRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const neonGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const neonYellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // 1. Support Structure (Sci-Fi Base)
    const baseGeom = new THREE.CylinderGeometry(6, 6.5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.y = -3.5;
    group.add(baseMesh);
    parts.push({
        name: "Quantum Projector Base",
        description: "Projects the mathematical constructs into physical space.",
        material: "darkSteel",
        function: "Provides a stable frame of reference for the spatial axes.",
        assemblyOrder: 1,
        connections: ["Coordinate Axes", "Holographic Surface"],
        failureEffect: "Loss of spatial stabilization",
        cascadeFailures: ["Axes Misalignment"],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 2. Coordinate Axes
    const axesGroup = new THREE.Group();
    const axisRadius = 0.05;
    const axisLength = 10;
    
    const xAxisGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    const xAxis = new THREE.Mesh(xAxisGeom, neonRed);
    xAxis.rotation.z = Math.PI / 2;
    axesGroup.add(xAxis);
    
    const yAxisGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    const yAxis = new THREE.Mesh(yAxisGeom, neonGreen);
    axesGroup.add(yAxis);
    
    const zAxisGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    const zAxis = new THREE.Mesh(zAxisGeom, neonYellow);
    zAxis.rotation.x = Math.PI / 2;
    axesGroup.add(zAxis);
    
    axesGroup.position.y = -2;
    group.add(axesGroup);
    
    parts.push({
        name: "Coordinate Axes",
        description: "The X (Red), Y (Green), and Z (Yellow) spatial axes.",
        material: "Neon Emissive",
        function: "Defines the 3-dimensional Cartesian coordinate system.",
        assemblyOrder: 2,
        connections: ["Quantum Projector Base", "Holographic Surface"],
        failureEffect: "Inability to locate points in space",
        cascadeFailures: ["Calculus Engine Error"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: -5, y: -5, z: -5 }
    });

    // 3. The 3D Surface z = f(x,y)
    const gridSize = 40;
    const surfaceSize = 10;
    const surfaceGeom = new THREE.PlaneGeometry(surfaceSize, surfaceSize, gridSize, gridSize);
    surfaceGeom.rotateX(-Math.PI / 2); // align with xz plane initially
    
    const positions = surfaceGeom.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i+2]; // y is z in our 3D space for the top-down view
        const yVal = f(x, z);
        positions[i+1] = yVal;
    }
    surfaceGeom.computeVertexNormals();

    const surfaceMesh = new THREE.Mesh(surfaceGeom, surfaceMaterial);
    const surfaceWire = new THREE.Mesh(surfaceGeom, wireframeMaterial);
    surfaceMesh.add(surfaceWire);
    
    // Shift surface up so origin is aligned with axes origin properly
    const surfaceGroup = new THREE.Group();
    surfaceGroup.add(surfaceMesh);
    surfaceGroup.position.y = -2;
    group.add(surfaceGroup);

    parts.push({
        name: "Holographic Surface",
        description: "A continuous, differentiable manifold defined by z = f(x,y).",
        material: "Cyan Plasma",
        function: "Visualizes the scalar function over the domain of x and y.",
        assemblyOrder: 3,
        connections: ["Coordinate Axes", "Tangent Plane"],
        failureEffect: "Collapse of the probability wave function",
        cascadeFailures: ["Tangent Singularity"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 4. Tangent Plane & Normal Vector
    const tangentPlaneSize = 3;
    const tangentGeom = new THREE.PlaneGeometry(tangentPlaneSize, tangentPlaneSize);
    tangentGeom.rotateX(-Math.PI / 2); // Initial horizontal plane
    const tangentMesh = new THREE.Mesh(tangentGeom, tangentPlaneMaterial);
    
    // Point of tangency indicator
    const ptGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const ptMesh = new THREE.Mesh(ptGeom, new THREE.MeshBasicMaterial({color: 0xffffff}));
    tangentMesh.add(ptMesh);
    
    // Normal Vector Arrow
    const arrowLen = 2;
    const arrowGeom = new THREE.CylinderGeometry(0.02, 0.02, arrowLen, 8);
    arrowGeom.translate(0, arrowLen/2, 0); // origin at base
    const normalVector = new THREE.Mesh(arrowGeom, new THREE.MeshBasicMaterial({color: 0x00ffff}));
    const coneGeom = new THREE.ConeGeometry(0.1, 0.3, 16);
    coneGeom.translate(0, arrowLen, 0);
    const coneMesh = new THREE.Mesh(coneGeom, new THREE.MeshBasicMaterial({color: 0x00ffff}));
    normalVector.add(coneMesh);
    tangentMesh.add(normalVector);
    
    // Partial Derivative Vectors (X and Z in 3D scene, which represent dx and dy)
    const pdXGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    pdXGeom.translate(0, 0.75, 0);
    pdXGeom.rotateZ(-Math.PI/2);
    const pdXMesh = new THREE.Mesh(pdXGeom, neonRed);
    tangentMesh.add(pdXMesh);

    const pdZGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    pdZGeom.translate(0, 0.75, 0);
    pdZGeom.rotateX(Math.PI/2);
    const pdZMesh = new THREE.Mesh(pdZGeom, neonGreen);
    tangentMesh.add(pdZMesh);

    surfaceGroup.add(tangentMesh);

    parts.push({
        name: "Tangent Plane Construct",
        description: "A flat plane providing the best linear approximation of the surface at a specific point.",
        material: "Magenta Hard-Light",
        function: "Calculates and visualizes the local linearization of the function.",
        assemblyOrder: 4,
        connections: ["Holographic Surface", "Normal Vector Sensor"],
        failureEffect: "Linearization errors approach infinity",
        cascadeFailures: ["Optimization algorithms crash"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 3, z: 4 }
    });

    parts.push({
        name: "Gradient Vector Sensor",
        description: "Measures the direction of steepest ascent on the surface.",
        material: "Cyan Energy",
        function: "Displays the normal vector to the tangent plane, derived from partial derivatives.",
        assemblyOrder: 5,
        connections: ["Tangent Plane Construct"],
        failureEffect: "Loss of directional awareness",
        cascadeFailures: ["Navigation systems failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 6, z: 6 }
    });

    // Store references for animation
    const meshes = {
        tangentMesh,
        normalVector,
        pdXMesh,
        pdZMesh
    };

    const description = "The Calculus Tangent Plane Machine visualizes the multivariable calculus concept of local linear approximation. By projecting a mathematical surface z = f(x,y) and dynamically calculating the partial derivatives (∂f/∂x and ∂f/∂y) at a roving point, it constructs a real-time tangent plane and normal vector, demonstrating how the gradient characterizes the surface's geometry.";

    const quizQuestions = [
        {
            question: "What does the Tangent Plane represent on a 3D surface?",
            options: [
                "The absolute maximum value of the function",
                "The best linear approximation of the surface at a specific point",
                "The area under the curve",
                "The point of inflection"
            ],
            correct: 1,
            explanation: "In multivariable calculus, the tangent plane provides the local linear approximation to a differentiable surface at a given point.",
            difficulty: "Medium"
        },
        {
            question: "How is the normal vector to the surface z = f(x,y) calculated?",
            options: [
                "Using the cross product of the partial derivative vectors",
                "By integrating the function over the x-y plane",
                "Taking the second derivative of the function",
                "Finding the limit as x and y approach zero"
            ],
            correct: 0,
            explanation: "The normal vector is orthogonal to the tangent plane and can be found via the cross product of the tangent vectors in the x and y directions, generally given by <-fx, -fy, 1>.",
            difficulty: "Hard"
        },
        {
            question: "What do the glowing red and green lines on the tangent plane signify?",
            options: [
                "The absolute boundaries of the domain",
                "The coordinate axes projected onto the surface",
                "The slopes of the surface in the x and y directions (partial derivatives)",
                "The roots of the mathematical function"
            ],
            correct: 2,
            explanation: "These vectors visualize the partial derivatives with respect to x and y, which define the 'tilt' of the tangent plane in the directions of the coordinate axes.",
            difficulty: "Medium"
        }
    ];

    // Animation variables
    let u = 0;

    function animate(time, speed, meshesObj) {
        // time is in seconds
        u += speed * 0.01;
        
        // Let the point wander around the surface in a Lissajous curve
        const t = time * speed;
        const ptX = 3 * Math.sin(t * 0.5);
        const ptZ = 3 * Math.sin(t * 0.31);
        
        // Calculate z value at point
        const ptY = f(ptX, ptZ);
        
        meshesObj.tangentMesh.position.set(ptX, ptY, ptZ);
        
        // Calculate partial derivatives
        const dx = df_dx(ptX, ptZ);
        const dz = df_dy(ptX, ptZ); // y is z in world space
        
        // The normal vector is n = <-dx, 1, -dz> for the surface y = f(x,z)
        // Normalize the vector
        const nx = -dx;
        const ny = 1;
        const nz = -dz;
        
        const normal = new THREE.Vector3(nx, ny, nz).normalize();
        
        // Align the tangent plane such that its local up (Y-axis) matches the normal vector
        // We use lookAt to aim its Z-axis, but we want its Y-axis to point along the normal.
        // Easiest is quaternion setFromUnitVectors from local UP to normal
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        meshesObj.tangentMesh.quaternion.copy(quaternion);
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (t, s) => animate(t, s, meshes)
    };
}

// Auto-generated missing stub
export function createTangentPlane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
