import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonPink = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0xff00ff, 
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    // 1. Base Platform
    const baseGeometry = new THREE.CylinderGeometry(8, 8, 1, 32);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    base.position.set(0, 0.5, 0);
    group.add(base);
    meshes.base = base;
    
    parts.push({
        name: "Foundation Base",
        description: "Massive steel and concrete foundation anchoring the ride to the ground.",
        material: "Dark Steel / Concrete",
        function: "Provides stability and absorbs the immense torsional and bending moments exerted by the swinging pendulum.",
        assemblyOrder: 1,
        connections: ["Support Pillars", "Ground"],
        failureEffect: "Catastrophic structural collapse.",
        cascadeFailures: ["Support Pillars", "Pendulum Arm", "Gondola"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Support Pillars (A-Frame)
    const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.8, 20, 16);
    
    // Left A-Frame
    const pillarLeftFront = new THREE.Mesh(pillarGeometry, steel);
    pillarLeftFront.position.set(-5, 10, 4);
    pillarLeftFront.rotation.x = -Math.PI / 8;
    pillarLeftFront.rotation.z = -Math.PI / 16;
    group.add(pillarLeftFront);
    
    const pillarLeftBack = new THREE.Mesh(pillarGeometry, steel);
    pillarLeftBack.position.set(-5, 10, -4);
    pillarLeftBack.rotation.x = Math.PI / 8;
    pillarLeftBack.rotation.z = -Math.PI / 16;
    group.add(pillarLeftBack);

    // Right A-Frame
    const pillarRightFront = new THREE.Mesh(pillarGeometry, steel);
    pillarRightFront.position.set(5, 10, 4);
    pillarRightFront.rotation.x = -Math.PI / 8;
    pillarRightFront.rotation.z = Math.PI / 16;
    group.add(pillarRightFront);
    
    const pillarRightBack = new THREE.Mesh(pillarGeometry, steel);
    pillarRightBack.position.set(5, 10, -4);
    pillarRightBack.rotation.x = Math.PI / 8;
    pillarRightBack.rotation.z = Math.PI / 16;
    group.add(pillarRightBack);

    const supportGroup = new THREE.Group();
    supportGroup.add(pillarLeftFront, pillarLeftBack, pillarRightFront, pillarRightBack);
    meshes.supports = supportGroup;

    parts.push({
        name: "A-Frame Supports",
        description: "Four thick steel columns arranged in an A-frame shape.",
        material: "High-Tensile Steel",
        function: "Supports the main axle and pendulum arm, distributing dynamic loads to the foundation.",
        assemblyOrder: 2,
        connections: ["Foundation Base", "Main Axle"],
        failureEffect: "Loss of support for the pendulum, leading to collapse.",
        cascadeFailures: ["Main Axle", "Pendulum Arm"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: -10, y: 10, z: 10 }
    });

    // 3. Main Axle / Motor Assembly
    const axleGeometry = new THREE.CylinderGeometry(0.6, 0.6, 12, 16);
    const axle = new THREE.Mesh(axleGeometry, chrome);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 19, 0);
    group.add(axle);
    meshes.axle = axle;

    parts.push({
        name: "Main Drive Axle & Motors",
        description: "Heavy-duty rotating shaft powered by massive AC induction motors.",
        material: "Chrome / Steel",
        function: "Drives the pendulum arm back and forth, gradually increasing the swing angle.",
        assemblyOrder: 3,
        connections: ["A-Frame Supports", "Pendulum Arm"],
        failureEffect: "Ride gets stuck or free-swings uncontrollably without damping.",
        cascadeFailures: ["Pendulum Arm"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // Pendulum Group (Swinging Part)
    const pendulumPivot = new THREE.Group();
    pendulumPivot.position.set(0, 19, 0);
    group.add(pendulumPivot);
    meshes.pendulumPivot = pendulumPivot;

    // 4. Pendulum Arm
    const armGeometry = new THREE.BoxGeometry(1, 16, 1);
    const arm = new THREE.Mesh(armGeometry, steel);
    arm.position.set(0, -8, 0);
    pendulumPivot.add(arm);
    meshes.arm = arm;
    
    // Add neon strip to arm
    const neonStripGeo = new THREE.BoxGeometry(1.05, 15, 0.1);
    const neonStrip1 = new THREE.Mesh(neonStripGeo, neonBlue);
    neonStrip1.position.set(0, -8, 0.5);
    pendulumPivot.add(neonStrip1);
    const neonStrip2 = new THREE.Mesh(neonStripGeo, neonPink);
    neonStrip2.position.set(0, -8, -0.5);
    pendulumPivot.add(neonStrip2);

    parts.push({
        name: "Pendulum Arm",
        description: "Reinforced steel boom connecting the axle to the passenger gondola, adorned with neon lights.",
        material: "Steel / Neon Strips",
        function: "Transmits the rotational force from the axle to the gondola, creating the swinging motion.",
        assemblyOrder: 4,
        connections: ["Main Drive Axle", "Gondola Hub"],
        failureEffect: "Arm fracture or detachment.",
        cascadeFailures: ["Gondola"],
        originalPosition: { x: 0, y: -8, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 10 }
    });

    // Gondola Group (Rotating Part)
    const gondolaHub = new THREE.Group();
    gondolaHub.position.set(0, -16, 0);
    pendulumPivot.add(gondolaHub);
    meshes.gondolaHub = gondolaHub;

    // 5. Gondola Core / Motor
    const hubGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const hub = new THREE.Mesh(hubGeometry, darkSteel);
    gondolaHub.add(hub);

    parts.push({
        name: "Gondola Rotation Hub",
        description: "A compact assembly containing a slew drive motor and slip rings.",
        material: "Dark Steel / Copper",
        function: "Rotates the passenger ring independently of the swinging motion.",
        assemblyOrder: 5,
        connections: ["Pendulum Arm", "Passenger Ring"],
        failureEffect: "Gondola stops rotating, reducing ride intensity.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -16, z: 0 },
        explodedPosition: { x: 0, y: -16, z: -10 }
    });

    // 6. Passenger Ring
    const ringGeometry = new THREE.TorusGeometry(3.5, 0.4, 16, 64);
    const ring = new THREE.Mesh(ringGeometry, aluminum);
    ring.rotation.x = Math.PI / 2;
    gondolaHub.add(ring);
    
    parts.push({
        name: "Passenger Ring",
        description: "A large circular frame where the passenger seats are mounted.",
        material: "Aluminum Array",
        function: "Holds the passenger seats securely while rotating.",
        assemblyOrder: 6,
        connections: ["Gondola Rotation Hub", "Passenger Seats"],
        failureEffect: "Structural deformation, compromising seat integrity.",
        cascadeFailures: ["Passenger Seats"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // 7. Passenger Seats (array of meshes)
    const seatsGroup = new THREE.Group();
    gondolaHub.add(seatsGroup);
    
    const seatGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
    const harnessGeo = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
    
    const numSeats = 12;
    for (let i = 0; i < numSeats; i++) {
        const angle = (i / numSeats) * Math.PI * 2;
        const seat = new THREE.Mesh(seatGeo, plastic);
        seat.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        seat.rotation.y = -angle; // Face outward
        
        const harness = new THREE.Mesh(harnessGeo, rubber);
        harness.position.set(0, 0.2, 0.4);
        harness.rotation.x = Math.PI / 2;
        seat.add(harness);
        
        seatsGroup.add(seat);
    }

    parts.push({
        name: "Passenger Seats & Restraints",
        description: "Ergonomic seats with over-the-shoulder hydraulic locking restraints.",
        material: "Plastic / Rubber",
        function: "Secures riders safely against positive and negative G-forces.",
        assemblyOrder: 7,
        connections: ["Passenger Ring"],
        failureEffect: "Rider ejection.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    const description = "A high-thrill amusement park pendulum ride that swings a massive arm back and forth while simultaneously rotating the passenger gondola, subjecting riders to alternating positive and negative G-forces and a feeling of weightlessness at the apex.";

    const quizQuestions = [
        {
            question: "What prevents the pendulum from swinging too fast or uncontrolled on the way down?",
            options: [
                "Air resistance from the gondola",
                "The motor acts as a regenerative brake, controlling the descent",
                "Friction in the main axle bearings",
                "Manual mechanical brakes applied by the operator"
            ],
            correct: 1,
            explanation: "Modern pendulum rides use their electric motors not just for driving, but also as dynamic/regenerative brakes to safely control the swing speed and bring the ride to a smooth stop.",
            difficulty: "medium"
        },
        {
            question: "Why does the gondola rotate while the pendulum swings?",
            options: [
                "To reduce the structural strain on the pendulum arm",
                "To ensure all riders experience the maximum height and different visual orientations",
                "To generate power for the ride's lighting system",
                "To keep the ride balanced"
            ],
            correct: 1,
            explanation: "Rotation ensures a varied experience for all riders. Without rotation, only the people at the very ends of the gondola would experience the maximum height and inverted feeling.",
            difficulty: "easy"
        },
        {
            question: "What combination of forces do riders experience at the very bottom of the swing arc?",
            options: [
                "Only weightlessness (0 Gs)",
                "Maximum negative G-forces (pulling them out of their seats)",
                "Maximum positive G-forces (pushing them into their seats)",
                "Lateral (side-to-side) G-forces only"
            ],
            correct: 2,
            explanation: "At the lowest point, the ride is moving at its maximum speed. The combination of gravity and centripetal acceleration results in maximum positive G-forces pressing riders firmly into their seats.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj.pendulumPivot || !meshesObj.gondolaHub) return;
        
        // Complex swinging motion: Amplitude slowly builds up and down (simplified here to constant max amplitude with slow variation)
        const amplitude = Math.PI * 0.65; // Max swing angle (about 117 degrees)
        const period = 5.0; // Seconds for one full swing
        
        // Calculate the current angle based on a sine wave for pendulum motion
        const swingAngle = Math.sin((time * speed) / period) * amplitude;
        
        meshesObj.pendulumPivot.rotation.z = swingAngle;
        
        // Rotate the gondola
        meshesObj.gondolaHub.rotation.y = (time * speed) * 0.5; // Constant rotation
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createPendulumSwing() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
