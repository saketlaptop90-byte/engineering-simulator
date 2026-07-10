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

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });

    const neonAxis = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.0,
    });

    // 1. The Axis of Revolution (X-axis)
    const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
    const axisMesh = new THREE.Mesh(axisGeometry, neonAxis);
    axisMesh.rotation.z = Math.PI / 2;
    group.add(axisMesh);

    parts.push({
        name: "Axis of Revolution",
        description: "The fixed line around which the 2D curve is rotated to generate the 3D volume.",
        material: "neonAxis",
        function: "Serves as the center of rotation for the sweeping curve.",
        assemblyOrder: 1,
        connections: ["2D Curve", "Swept Volume"],
        failureEffect: "Without an axis, revolution is undefined.",
        cascadeFailures: ["Swept Volume"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. The 2D Curve (Function f(x))
    // Let's use f(x) = sin(x) + 1.5 from x = -Math.PI to Math.PI
    const curvePoints = [];
    for (let x = -Math.PI; x <= Math.PI; x += 0.1) {
        curvePoints.push(new THREE.Vector3(x, Math.sin(x) + 1.5, 0));
    }
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    const curveMesh = new THREE.Line(curveGeometry, curveMaterial);
    group.add(curveMesh);

    parts.push({
        name: "2D Generator Curve f(x)",
        description: "The mathematical function f(x) that defines the profile of the solid.",
        material: "neonBlue",
        function: "Defines the outer boundary or profile of the resulting solid geometry.",
        assemblyOrder: 2,
        connections: ["Axis of Revolution", "Swept Volume"],
        failureEffect: "No curve means no volume is generated.",
        cascadeFailures: ["Swept Volume"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 2 }
    });

    // 3. The Solid Volume (Swept surface)
    // We can simulate this with LatheGeometry
    const lathePoints = [];
    for (let x = -Math.PI; x <= Math.PI; x += 0.1) {
        // LatheGeometry rotates around the Y axis by default, so we map Y to X and X to Y
        lathePoints.push(new THREE.Vector2(Math.sin(x) + 1.5, x));
    }
    const volumeGeometry = new THREE.LatheGeometry(lathePoints, 64, 0, 2 * Math.PI);
    const volumeMesh = new THREE.Mesh(volumeGeometry, neonPink);
    // Rotate to align with the X axis (our axis of revolution)
    volumeMesh.rotation.z = -Math.PI / 2;
    // We add an extra rotation group to animate the sweeping formation
    const volumeGroup = new THREE.Group();
    volumeGroup.add(volumeMesh);
    group.add(volumeGroup);

    parts.push({
        name: "Solid of Revolution Volume",
        description: "The 3D space enclosed by rotating the 2D curve around the axis.",
        material: "neonPink",
        function: "Represents the integral of cross-sectional areas (disk/washer method).",
        assemblyOrder: 3,
        connections: ["Axis of Revolution", "2D Generator Curve f(x)"],
        failureEffect: "Integral calculation evaluates to zero.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: -2 }
    });

    // 4. Integrating Disk Element (dx slice)
    const diskGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const diskMesh = new THREE.Mesh(diskGeometry, chrome);
    diskMesh.rotation.z = Math.PI / 2;
    diskMesh.position.set(0, 0, 0);
    group.add(diskMesh);

    parts.push({
        name: "Differential Disk Element (dx)",
        description: "An infinitesimally thin cylinder representing a slice of the total volume.",
        material: "chrome",
        function: "Used in the disk method to calculate volume by summing all elements: V = ∫ π[f(x)]² dx.",
        assemblyOrder: 4,
        connections: ["Solid of Revolution Volume"],
        failureEffect: "Cannot approximate or integrate the total volume.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 4 }
    });

    const description = "A visualization of Calculus Volume Integration. A 2D curve is revolved 360 degrees around a central axis to form a 3D Solid of Revolution, analyzed using the Disk Method.";

    const quizQuestions = [
        {
            question: "In the disk method, what is the formula for the volume of a single differential disk of thickness dx?",
            options: [
                "V = 2π * f(x) * dx",
                "V = π * [f(x)]² * dx",
                "V = [f(x)]² * dx",
                "V = π * f(x) * dx"
            ],
            correct: 1,
            explanation: "The disk is a cylinder with radius r = f(x) and height h = dx. The volume of a cylinder is πr²h, which gives π[f(x)]²dx.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following determines the radius of revolution in this specific model?",
            options: [
                "The distance along the x-axis",
                "The angle of rotation",
                "The value of the function f(x)",
                "The circumference of the axis"
            ],
            correct: 2,
            explanation: "The distance from the axis of revolution to the 2D curve is defined by the function's value, f(x), which serves as the radius.",
            difficulty: "Easy"
        },
        {
            question: "If the 2D curve was f(x) = x and we revolved it from x=0 to x=r around the x-axis, what 3D shape would it form?",
            options: [
                "Sphere",
                "Cylinder",
                "Cone",
                "Paraboloid"
            ],
            correct: 2,
            explanation: "Rotating a straight line that passes through the origin around an axis creates a cone.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the disk moving back and forth along the x-axis
        const currentX = Math.sin(time * speed * 0.5) * Math.PI;
        
        // Update disk position
        meshes[3].position.x = currentX;
        
        // Update disk radius dynamically based on the function f(x) = sin(x) + 1.5
        const currentRadius = Math.sin(currentX) + 1.5;
        // Since cylinder is rotated, its local X and Z correspond to the disk's flat plane
        meshes[3].scale.set(currentRadius/1.5, 1, currentRadius/1.5); 
        
        // Make the solid volume slowly rotate
        meshes[2].rotation.x = time * speed * 0.2;
    }

    // Pass back meshes mapped to parts
    const meshes = [axisMesh, curveMesh, volumeGroup, diskMesh];

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createSolidRevolution() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
