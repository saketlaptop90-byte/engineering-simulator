import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        metalness: 0.3,
        roughness: 0.2
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        metalness: 0.3,
        roughness: 0.2
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00dd33,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8,
        metalness: 0.3,
        roughness: 0.2
    });

    const gridMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(6, 6.5, 0.5, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Transformation Platform",
        description: "The main magnetic base that anchors the vector space and generates the linear transformation.",
        material: "darkSteel",
        function: "Maintains coordinate system stability during shear and scaling transformations.",
        assemblyOrder: 1,
        connections: ["Grid Plane", "Quantum Core"],
        failureEffect: "Vector space collapses into a singularity.",
        cascadeFailures: ["Grid Plane warp", "Vector disorientation"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // Outer decorative ring
    const ringGeo = new THREE.TorusGeometry(6.2, 0.1, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, chrome);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -0.1, 0);
    group.add(ringMesh);
    meshes.ring = ringMesh;
    parts.push({
        name: "Boundary Manifold Ring",
        description: "A superconducting chrome ring confining the linear transformation to the local space.",
        material: "chrome",
        function: "Prevents unbounded spatial scaling from rupturing the simulation.",
        assemblyOrder: 2,
        connections: ["Transformation Platform"],
        failureEffect: "Transformation leaks into surrounding universe.",
        cascadeFailures: ["Simulation crash"],
        originalPosition: { x: 0, y: -0.1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 2. Grid Plane
    const gridGeo = new THREE.PlaneGeometry(10, 10, 20, 20);
    const gridMesh = new THREE.Mesh(gridGeo, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.set(0, 0.05, 0);
    group.add(gridMesh);
    meshes.grid = gridMesh;
    parts.push({
        name: "Coordinate Space Grid",
        description: "A holographic projection of the 2D plane undergoing transformation.",
        material: "gridMaterial (Custom)",
        function: "Visualizes the structural warping of the space, showing shear and scaling along principal axes.",
        assemblyOrder: 3,
        connections: ["Transformation Platform"],
        failureEffect: "Loss of visual reference frame.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.05, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 3. Eigenvector 1 (Lambda 1 -> X-axis)
    const v1Group = new THREE.Group();
    const shaft1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 16), glowBlue);
    shaft1.position.y = 1;
    const head1 = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 16), glowBlue);
    head1.position.y = 2.25;
    v1Group.add(shaft1);
    v1Group.add(head1);
    // Align with X axis
    v1Group.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0));
    v1Group.position.set(0, 0.1, 0);
    group.add(v1Group);
    meshes.eigenvector1 = v1Group;
    parts.push({
        name: "Primary Eigenvector (Blue)",
        description: "A specialized vector that only scales (does not rotate) under the current transformation matrix.",
        material: "glowBlue",
        function: "Represents an invariant subspace corresponding to eigenvalue lambda_1.",
        assemblyOrder: 4,
        connections: ["Coordinate Space Grid"],
        failureEffect: "Matrix loses diagonalizability.",
        cascadeFailures: ["Loss of orthogonal basis"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 4, y: 0.1, z: 0 }
    });

    // 4. Eigenvector 2 (Lambda 2 -> Z-axis)
    const v2Group = new THREE.Group();
    const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 16), glowRed);
    shaft2.position.y = 1;
    const head2 = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 16), glowRed);
    head2.position.y = 2.25;
    v2Group.add(shaft2);
    v2Group.add(head2);
    // Align with Z axis
    v2Group.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1));
    v2Group.position.set(0, 0.1, 0);
    group.add(v2Group);
    meshes.eigenvector2 = v2Group;
    parts.push({
        name: "Secondary Eigenvector (Red)",
        description: "The second eigenvector corresponding to eigenvalue lambda_2.",
        material: "glowRed",
        function: "Compresses or stretches space along its span without changing direction.",
        assemblyOrder: 5,
        connections: ["Coordinate Space Grid"],
        failureEffect: "Incomplete eigenspace coverage.",
        cascadeFailures: ["Rank deficiency"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 0.1, z: 4 }
    });

    // 5. Generic Vector (Gets rotated and scaled)
    const v3Group = new THREE.Group();
    const shaft3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 16), glowGreen);
    shaft3.position.y = 1;
    const head3 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), glowGreen);
    head3.position.y = 2.2;
    v3Group.add(shaft3);
    v3Group.add(head3);
    v3Group.position.set(0, 0.1, 0);
    group.add(v3Group);
    meshes.genericVector = v3Group;
    parts.push({
        name: "Generic Test Vector (Green)",
        description: "An arbitrary vector in the space that is not an eigenvector.",
        material: "glowGreen",
        function: "Demonstrates how vectors off the principal axes are both rotated and scaled by the transformation.",
        assemblyOrder: 6,
        connections: ["Transformation Platform"],
        failureEffect: "Cannot demonstrate shear effect.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 2, y: 3, z: 2 }
    });

    // 6. Quantum Core Emitter
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.OctahedronGeometry(0.5, 1);
    const coreMesh = new THREE.Mesh(coreGeo, tinted);
    
    const coreInnerGeo = new THREE.IcosahedronGeometry(0.2, 0);
    const coreInnerMesh = new THREE.Mesh(coreInnerGeo, glowBlue);
    
    coreGroup.add(coreMesh);
    coreGroup.add(coreInnerMesh);
    coreGroup.position.set(0, 1.0, 0);
    group.add(coreGroup);
    
    meshes.core = coreGroup;
    meshes.coreInner = coreInnerMesh;
    parts.push({
        name: "Matrix Core Emitter",
        description: "The central processing unit calculating the matrix multiplication.",
        material: "tinted glass / glowing core",
        function: "Applies the linear operator T(v) = Av to all vectors in the subspace.",
        assemblyOrder: 7,
        connections: ["Transformation Platform"],
        failureEffect: "Transformation stops updating.",
        cascadeFailures: ["Grid freezes", "Vectors revert to identity"],
        originalPosition: { x: 0, y: 1.0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    const description = "The Algebra Eigenvector Transformation Machine visualizes the core concept of linear algebra: Linear Transformations and Eigenvectors. Eigenvectors (Blue, Red) strictly scale by their eigenvalues without altering their direction line. The Grid and Generic Vector (Green) warp through the transformation space, demonstrating shear, rotation, and non-uniform scaling.";

    const quizQuestions = [
        {
            question: "What defining characteristic distinguishes an eigenvector from a generic vector under a linear transformation?",
            options: [
                "It maintains a constant magnitude.",
                "It remains on its original span (direction) and only gets scaled.",
                "It always rotates by exactly 90 degrees.",
                "It becomes a zero vector."
            ],
            correct: 1,
            explanation: "By definition, an eigenvector v of a matrix A satisfies Av = lambda * v, meaning the transformation only scales it by a scalar lambda without changing its fundamental line of direction.",
            difficulty: "Medium"
        },
        {
            question: "If a linear transformation scales an eigenvector by a factor of 2, what is the value '2' called?",
            options: [
                "The Determinant",
                "The Eigenspace",
                "The Eigenvalue",
                "The Trace"
            ],
            correct: 2,
            explanation: "The scalar factor by which an eigenvector is scaled during the transformation is called the eigenvalue, denoted typically as lambda.",
            difficulty: "Easy"
        },
        {
            question: "In this visualizer, what happens to the generic green vector (which is not an eigenvector) during the matrix transformation?",
            options: [
                "It stays completely still.",
                "It only changes length.",
                "It changes both its direction (span) and its length.",
                "It disappears entirely."
            ],
            correct: 2,
            explanation: "Because it does not lie on an invariant axis (eigenspace), a generic vector will generally be knocked off its original span, undergoing both rotation and scaling depending on the transformation matrix.",
            difficulty: "Medium"
        },
        {
            question: "If the determinant of the transformation matrix is 0, what geometric effect occurs?",
            options: [
                "The 2D space collapses into a 1D line or a point.",
                "The space scales up infinitely.",
                "All vectors rotate by 180 degrees.",
                "Eigenvectors disappear."
            ],
            correct: 0,
            explanation: "A determinant of 0 indicates that the matrix is singular, meaning the space loses dimension, collapsing onto a lower-dimensional subspace such as a line or the origin.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Transformation cycle: oscillates between Identity matrix and Transformation Matrix A
        const t = (Math.sin(time * 0.001 * speed) + 1) / 2; // Oscillates from 0 to 1

        // Transformation Matrix A defined by its action on principal axes
        // Eigenvalue 1 (X axis) goes from 1.0 to 2.5
        // Eigenvalue 2 (Z axis) goes from 1.0 to 0.4
        const lambda1 = 1 + t * 1.5; 
        const lambda2 = 1 - t * 0.6;

        // 1. Update Grid scale to visualize space warping
        activeMeshes.grid.scale.set(lambda1, 1, lambda2);

        // 2. Update Eigenvector 1 (Blue, along X)
        activeMeshes.eigenvector1.scale.set(1, lambda1, 1);
        
        // 3. Update Eigenvector 2 (Red, along Z)
        activeMeshes.eigenvector2.scale.set(1, lambda2, 1);

        // 4. Update Generic Vector (Green)
        // Let its initial coordinates be (1.5, 0, 1.5) in the unscaled space
        const initVx = 1.5;
        const initVz = 1.5;
        const initLength = Math.sqrt(initVx*initVx + initVz*initVz);
        
        const curVx = initVx * lambda1;
        const curVz = initVz * lambda2;
        
        const curLength = Math.sqrt(curVx*curVx + curVz*curVz);
        const dir = new THREE.Vector3(curVx, 0, curVz).normalize();
        
        // Scale generic vector (Y is the length dimension for our cylinder/cone setup)
        activeMeshes.genericVector.scale.set(1, curLength / initLength, 1);
        
        // Rotate generic vector to new direction
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
        activeMeshes.genericVector.quaternion.copy(targetQuat);

        // 5. Core visual effects
        activeMeshes.core.rotation.y += 0.02 * speed;
        activeMeshes.core.rotation.z += 0.01 * speed;
        activeMeshes.coreInner.rotation.x -= 0.03 * speed;
        activeMeshes.coreInner.rotation.y -= 0.02 * speed;
        
        // Pulsing core intensity based on transformation stretch
        const coreScale = 1 + 0.3 * t;
        activeMeshes.core.scale.set(coreScale, coreScale, coreScale);
        
        // 6. Base and Ring rotation
        activeMeshes.base.rotation.y = time * 0.0002 * speed;
        activeMeshes.ring.rotation.z = -time * 0.0005 * speed;
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
export function createEigenvectorTransform() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
