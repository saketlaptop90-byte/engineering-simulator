import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const neonMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.2
    });

    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x4444ff, transparent: true, opacity: 0.3 });

    // 1. Complex Plane Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x00ff00, 0x4444ff);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    gridHelper.name = "complex_plane_grid";
    group.add(gridHelper);
    
    parts.push({
        name: "complex_plane_grid",
        description: "The 2D complex plane embedded in 3D space, where the x-axis is real and the z-axis is imaginary.",
        material: "GridMaterial",
        function: "Provides the spatial reference for plotting complex numbers.",
        assemblyOrder: 1,
        connections: ["real_axis", "imaginary_axis"],
        failureEffect: "Loss of spatial orientation for roots.",
        cascadeFailures: ["Roots misaligned"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Real and Imaginary Axes
    const axisGeo = new THREE.CylinderGeometry(0.05, 0.05, 12, 16);
    
    const realAxis = new THREE.Mesh(axisGeo, aluminum);
    realAxis.rotation.z = Math.PI / 2;
    realAxis.name = "real_axis";
    group.add(realAxis);
    parts.push({
        name: "real_axis",
        description: "The real axis representing the real part of the complex numbers.",
        material: "aluminum",
        function: "X-coordinate reference.",
        assemblyOrder: 2,
        connections: ["complex_plane_grid"],
        failureEffect: "Cannot determine real values.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 2 }
    });

    const imagAxis = new THREE.Mesh(axisGeo, copper);
    imagAxis.rotation.x = Math.PI / 2;
    imagAxis.name = "imaginary_axis";
    group.add(imagAxis);
    parts.push({
        name: "imaginary_axis",
        description: "The imaginary axis representing the imaginary part (i) of the complex numbers.",
        material: "copper",
        function: "Z-coordinate reference in this 3D representation.",
        assemblyOrder: 3,
        connections: ["complex_plane_grid"],
        failureEffect: "Cannot determine imaginary values.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1, z: -2 }
    });

    // 3. Unit Circle
    const circleGeo = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const unitCircle = new THREE.Mesh(circleGeo, steel);
    unitCircle.rotation.x = Math.PI / 2;
    unitCircle.name = "unit_circle";
    group.add(unitCircle);
    parts.push({
        name: "unit_circle",
        description: "A circle of radius 1, representing numbers with absolute value 1.",
        material: "steel",
        function: "Locus of the roots of unity.",
        assemblyOrder: 4,
        connections: ["complex_plane_grid"],
        failureEffect: "Magnitude scaling visual loss.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // Roots of Unity (n=5)
    const n = 5;
    const radius = 3;
    const rootSpheres = [];
    
    for (let k = 0; k < n; k++) {
        const theta = (2 * Math.PI * k) / n;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta); // using z for imaginary axis
        
        // Sphere
        const sphereGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const sphere = new THREE.Mesh(sphereGeo, neonCyan);
        sphere.position.set(x, 0, z);
        sphere.name = `root_${k}`;
        group.add(sphere);
        rootSpheres.push(sphere);
        
        parts.push({
            name: `root_${k}`,
            description: `Root ${k+1} of unity. z = e^(i * 2π * ${k}/${n}).`,
            material: "neonCyan",
            function: "Visualizes a distinct complex root.",
            assemblyOrder: 5 + k * 2,
            connections: ["unit_circle", `vector_${k}`],
            failureEffect: "Missing root.",
            cascadeFailures: ["Polygon incomplete"],
            originalPosition: { x: x, y: 0, z: z },
            explodedPosition: { x: x * 1.5, y: 1, z: z * 1.5 }
        });

        // Vector to origin
        const vecGeo = new THREE.CylinderGeometry(0.03, 0.03, radius, 8);
        const vector = new THREE.Mesh(vecGeo, chrome);
        vector.position.set(x/2, 0, z/2);
        vector.lookAt(x, 0, z);
        vector.rotateX(Math.PI/2);
        vector.name = `vector_${k}`;
        group.add(vector);
        
        parts.push({
            name: `vector_${k}`,
            description: `Phasor representing the magnitude and angle of root ${k+1}.`,
            material: "chrome",
            function: "Connects origin to the root.",
            assemblyOrder: 6 + k * 2,
            connections: ["origin", `root_${k}`],
            failureEffect: "Phase angle obscure.",
            cascadeFailures: [],
            originalPosition: { x: x/2, y: 0, z: z/2 },
            explodedPosition: { x: x/2, y: 3, z: z/2 }
        });
    }

    // Polygon connecting roots
    for(let k = 0; k < n; k++) {
        const next_k = (k + 1) % n;
        const p1 = rootSpheres[k].position;
        const p2 = rootSpheres[next_k].position;
        
        const dist = p1.distanceTo(p2);
        const edgeGeo = new THREE.CylinderGeometry(0.04, 0.04, dist, 8);
        const edge = new THREE.Mesh(edgeGeo, neonMagenta);
        
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        edge.position.copy(mid);
        edge.lookAt(p2);
        edge.rotateX(Math.PI/2);
        edge.name = `edge_${k}`;
        group.add(edge);
        
        parts.push({
            name: `edge_${k}`,
            description: `Edge connecting root ${k} to root ${next_k}.`,
            material: "neonMagenta",
            function: "Demonstrates the regular polygon formed by roots of unity.",
            assemblyOrder: 15 + k,
            connections: [`root_${k}`, `root_${next_k}`],
            failureEffect: "Breaks polygonal shape.",
            cascadeFailures: [],
            originalPosition: { x: mid.x, y: mid.y, z: mid.z },
            explodedPosition: { x: mid.x * 1.5, y: -2, z: mid.z * 1.5 }
        });
    }

    const description = "An advanced 3D visualization of algebraic complex roots. It illustrates the 5th roots of unity (z^5 = 1) plotted on the complex plane. The roots are distributed evenly around the unit circle, forming a regular pentagon, showcasing the beautiful symmetry inherent in complex arithmetic and De Moivre's formula.";

    const quizQuestions = [
        {
            question: "How are the nth roots of unity geometrically distributed on the complex plane?",
            options: [
                "Randomly distributed within the unit circle",
                "Forming a straight line on the real axis",
                "As vertices of a regular n-sided polygon inscribed in the unit circle",
                "Clustered around the imaginary axis"
            ],
            correct: 2,
            explanation: "The nth roots of unity are defined by e^(i * 2πk / n). Geometrically, these correspond to points on the unit circle separated by equal angles of 2π/n, thus forming a regular n-sided polygon.",
            difficulty: "Medium"
        },
        {
            question: "What is the sum of all the nth roots of unity (for n > 1)?",
            options: [
                "1",
                "n",
                "-1",
                "0"
            ],
            correct: 3,
            explanation: "The sum of the nth roots of unity forms a geometric progression: 1 + w + w^2 + ... + w^(n-1). Since w^n = 1, the sum evaluates to (1 - w^n) / (1 - w) = 0.",
            difficulty: "Hard"
        },
        {
            question: "If z is a complex number, its complex conjugate is geometrically represented as a reflection across which axis?",
            options: [
                "The imaginary axis",
                "The real axis",
                "The origin",
                "The line y = x"
            ],
            correct: 1,
            explanation: "The complex conjugate of z = x + iy is z* = x - iy. The real part remains the same, but the imaginary part is negated, representing a reflection across the real (x) axis.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire complex plane configuration slowly
        group.rotation.y = time * 0.1 * speed;
        
        // Make the roots pulsate
        const pulse = 1 + Math.sin(time * 3 * speed) * 0.2;
        meshes.forEach(mesh => {
            if (mesh.name && mesh.name.startsWith("root_")) {
                mesh.scale.set(pulse, pulse, pulse);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createComplexRoots() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
