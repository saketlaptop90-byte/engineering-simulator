import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // 1. Base / Platform
    const baseGeo = new THREE.CylinderGeometry(15, 15, 0.5, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Foundation",
        description: "A solid concrete and steel base providing stability for the entire coaster structure.",
        material: "Dark Steel / Concrete",
        function: "Supports dynamic loads and prevents structural displacement.",
        assemblyOrder: 1,
        connections: ["Support Columns"],
        failureEffect: "Total structural collapse.",
        cascadeFailures: ["Support Columns", "Track", "Train"],
        originalPosition: {x: 0, y: -0.25, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: baseMesh
    });

    // 2. Track Spline Curve
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 10),
        new THREE.Vector3(8, 12, 5),
        new THREE.Vector3(10, 18, -5),
        new THREE.Vector3(0, 10, -10),
        new THREE.Vector3(-8, 5, -5),
        new THREE.Vector3(-5, 8, 5),
        new THREE.Vector3(0, 5, 10) // loop back
    ], true, 'centripetal', 0.5);

    const trackGeo = new THREE.TubeGeometry(curve, 100, 0.3, 8, true);
    const trackMesh = new THREE.Mesh(trackGeo, chrome);
    group.add(trackMesh);
    parts.push({
        name: "Main Track Spine",
        description: "The primary structural spine of the rollercoaster track, constructed from high-tensile chrome steel.",
        material: "Chrome Steel",
        function: "Guides the coaster train and withstands extreme centripetal forces.",
        assemblyOrder: 3,
        connections: ["Support Columns", "Rails"],
        failureEffect: "Derailment of the train.",
        cascadeFailures: ["Train", "Passengers"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0},
        mesh: trackMesh
    });

    // 3. Glowing Rails
    const railRadius = 0.1;
    const leftRailGeo = new THREE.TubeGeometry(curve, 100, railRadius, 8, true);
    const leftRailMesh = new THREE.Mesh(leftRailGeo, neonBlue);
    leftRailMesh.scale.set(1.02, 1.02, 1.02); // slight offset simulation
    leftRailMesh.position.y += 0.4;
    group.add(leftRailMesh);

    parts.push({
        name: "Magnetic Induction Rails",
        description: "Electromagnetic rails providing frictionless propulsion and braking.",
        material: "Superconductor / Neon",
        function: "Accelerates and decelerates the train smoothly.",
        assemblyOrder: 4,
        connections: ["Main Track Spine"],
        failureEffect: "Loss of speed control, potential crash.",
        cascadeFailures: ["Train Safety Systems"],
        originalPosition: {x: 0, y: 0.4, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0},
        mesh: leftRailMesh
    });

    // 4. Support Columns
    const columnsGeo = new THREE.Group();
    const points = curve.getSpacedPoints(12);
    points.forEach((pt) => {
        const height = pt.y;
        const colGeo = new THREE.CylinderGeometry(0.2, 0.4, height, 16);
        const colMesh = new THREE.Mesh(colGeo, darkSteel);
        colMesh.position.set(pt.x, height / 2, pt.z);
        columnsGeo.add(colMesh);
    });
    group.add(columnsGeo);
    parts.push({
        name: "Lattice Support Columns",
        description: "Vertical and diagonal steel members transmitting loads to the foundation.",
        material: "Dark Steel",
        function: "Resists gravity and lateral forces from the moving train.",
        assemblyOrder: 2,
        connections: ["Foundation", "Main Track Spine"],
        failureEffect: "Track sagging or collapse.",
        cascadeFailures: ["Main Track Spine"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 0, z: 10},
        mesh: columnsGeo
    });

    // 5. Rollercoaster Train
    const trainGroup = new THREE.Group();
    
    // Train Car (Chassis)
    const carGeo = new THREE.BoxGeometry(2, 1, 1);
    const carMesh = new THREE.Mesh(carGeo, neonPink);
    carMesh.position.set(0, 0.5, 0);
    trainGroup.add(carMesh);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
    wheelGeo.rotateX(Math.PI / 2);
    const frontWheels = new THREE.Mesh(wheelGeo, steel);
    frontWheels.position.set(0.6, 0.25, 0);
    trainGroup.add(frontWheels);
    
    const backWheels = new THREE.Mesh(wheelGeo, steel);
    backWheels.position.set(-0.6, 0.25, 0);
    trainGroup.add(backWheels);

    group.add(trainGroup);
    parts.push({
        name: "Hyper-Train Chassis",
        description: "Aerodynamic passenger vehicle equipped with active suspension and magnetic levitation.",
        material: "Carbon Fiber / Neon Pink",
        function: "Safely houses passengers while traveling at extreme velocities.",
        assemblyOrder: 5,
        connections: ["Magnetic Induction Rails"],
        failureEffect: "Immediate halt via emergency brakes.",
        cascadeFailures: ["Passenger Restraints"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 5, z: 0},
        mesh: trainGroup
    });

    const description = "The Amusement Rollercoaster is a highly advanced, physics-based thrill ride. It utilizes magnetic induction for propulsion and features a complex track spline designed to maximize positive and negative G-forces while maintaining absolute safety. The structure relies on deep foundations, lattice support columns, and an aerodynamic train chassis.";

    const quizQuestions = [
        {
            question: "What physical force is primarily responsible for keeping passengers in their seats during a loop?",
            options: ["Gravity", "Centripetal force", "Friction", "Magnetism"],
            correct: 1,
            explanation: "Centripetal force, directed towards the center of the loop, is required to keep the train moving in a circular path. The track pushes against the train, providing this force and creating the feeling of being pushed into the seat.",
            difficulty: "Medium"
        },
        {
            question: "Why are rollercoaster loops typically teardrop-shaped (clothoid) rather than perfectly circular?",
            options: ["Aesthetics", "To reduce the maximum G-force on riders", "To save material", "To increase speed at the top"],
            correct: 1,
            explanation: "A perfectly circular loop would require a massive amount of centripetal force upon entering it, causing dangerous G-forces. A clothoid loop has a gradually decreasing radius, which smooths out the transition and limits maximum G-forces.",
            difficulty: "Hard"
        },
        {
            question: "What mechanism is used in this futuristic coaster to accelerate the train?",
            options: ["Chain lift hill", "Hydraulic launch", "Magnetic Induction", "Pneumatic launch"],
            correct: 2,
            explanation: "As described in the parts list, this advanced rollercoaster uses Magnetic Induction Rails to provide frictionless propulsion and braking.",
            difficulty: "Easy"
        }
    ];

    // Animation variables
    let progress = 0;
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3();

    function animate(time, speed, meshes) {
        // Move the train along the spline curve
        progress += (speed * 0.001);
        if (progress > 1) progress = 0;
        if (progress < 0) progress = 1;

        const position = curve.getPointAt(progress);
        const tangent = curve.getTangentAt(progress).normalize();

        trainGroup.position.copy(position);

        // Align train to the tangent
        axis.crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        trainGroup.quaternion.setFromAxisAngle(axis, radians);

        // Pulse the neon materials
        const pulse = Math.sin(time * 2.0) * 0.5 + 0.5;
        neonBlue.emissiveIntensity = 0.5 + pulse * 1.5;
        neonPink.emissiveIntensity = 0.5 + (1 - pulse) * 1.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRollercoaster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
