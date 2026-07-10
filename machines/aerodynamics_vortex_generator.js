import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.3
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.7,
        metalness: 0.6,
        roughness: 0.2
    });

    // 1. Wind Tunnel Base
    const baseGeo = new THREE.BoxGeometry(10, 0.5, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Wind Tunnel Base",
        description: "Heavy steel base supporting the wind tunnel testing chamber.",
        material: "Dark Steel",
        function: "Provides stability and houses lower instrumentation.",
        assemblyOrder: 1,
        connections: ["Testing Chamber", "Power Supply"],
        failureEffect: "Vibration introduces noise into aerodynamic readings.",
        cascadeFailures: ["Sensor Misalignment"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Testing Chamber (Glass Tube)
    const chamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeo, glass);
    chamberMesh.rotation.z = Math.PI / 2;
    chamberMesh.position.set(0, 1.5, 0);
    group.add(chamberMesh);
    parts.push({
        name: "Testing Chamber",
        description: "Transparent cylindrical chamber for observing fluid flow.",
        material: "Glass",
        function: "Contains the air flow and test subjects while allowing visual inspection.",
        assemblyOrder: 2,
        connections: ["Wind Tunnel Base", "Air Intake", "Exhaust"],
        failureEffect: "Air leaks reduce tunnel efficiency.",
        cascadeFailures: ["Flow Disruption"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Air Intake / Fan Housing
    const intakeGeo = new THREE.CylinderGeometry(1.6, 1.6, 2, 32);
    const intakeMesh = new THREE.Mesh(intakeGeo, chrome);
    intakeMesh.rotation.z = Math.PI / 2;
    intakeMesh.position.set(-4, 1.5, 0);
    group.add(intakeMesh);
    parts.push({
        name: "Air Intake & Fan",
        description: "High-speed multi-blade fan pulling air into the tunnel.",
        material: "Chrome / Steel",
        function: "Generates the high-velocity air stream.",
        assemblyOrder: 3,
        connections: ["Testing Chamber", "Flow Straightener"],
        failureEffect: "Reduced air velocity, stopping tests.",
        cascadeFailures: ["Overheating", "Motor Burnout"],
        originalPosition: { x: -4, y: 1.5, z: 0 },
        explodedPosition: { x: -6, y: 1.5, z: 0 }
    });

    // Fan Blades (Child of intake for animation)
    const fanGroup = new THREE.Group();
    intakeMesh.add(fanGroup); // local coords relative to intake
    for (let i = 0; i < 6; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.4);
        const bladeMesh = new THREE.Mesh(bladeGeo, steel);
        bladeMesh.position.y = 0.7; // shift up
        
        const pivot = new THREE.Group();
        pivot.rotation.x = (i / 6) * Math.PI * 2;
        pivot.add(bladeMesh);
        fanGroup.add(pivot);
    }
    parts.push({
        name: "Fan Blades",
        description: "Six high-pitch blades for moving air.",
        material: "Steel",
        function: "Pushes air through the tunnel.",
        assemblyOrder: 4,
        connections: ["Air Intake & Fan"],
        failureEffect: "Unbalanced rotation causes catastrophic vibration.",
        cascadeFailures: ["Chamber Shatter"],
        originalPosition: { x: -4, y: 1.5, z: 0 },
        explodedPosition: { x: -8, y: 1.5, z: 0 }
    });

    // 4. Flow Straightener (Honeycomb)
    const straightenerGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.5, 32);
    const straightenerMesh = new THREE.Mesh(straightenerGeo, aluminum);
    straightenerMesh.rotation.z = Math.PI / 2;
    straightenerMesh.position.set(-2.5, 1.5, 0);
    group.add(straightenerMesh);
    parts.push({
        name: "Flow Straightener",
        description: "Honeycomb lattice that removes turbulence.",
        material: "Aluminum",
        function: "Ensures laminar flow before reaching the test subject.",
        assemblyOrder: 5,
        connections: ["Air Intake", "Testing Chamber"],
        failureEffect: "Turbulent flow ruins aerodynamic measurements.",
        cascadeFailures: ["Invalid Data"],
        originalPosition: { x: -2.5, y: 1.5, z: 0 },
        explodedPosition: { x: -2.5, y: 4.5, z: 2 }
    });

    // 5. Test Subject (Aerofoil / Wing Section)
    const aerofoilGeo = new THREE.ConeGeometry(0.8, 2, 3, 1, false, 0, Math.PI);
    const aerofoilMesh = new THREE.Mesh(aerofoilGeo, neonBlue);
    aerofoilMesh.rotation.z = -Math.PI / 2;
    aerofoilMesh.rotation.x = Math.PI / 8; // Angle of attack
    aerofoilMesh.scale.set(1, 1, 0.2);
    aerofoilMesh.position.set(0, 1.5, 0);
    group.add(aerofoilMesh);
    parts.push({
        name: "Test Subject: Aerofoil",
        description: "A scale model of an aircraft wing section.",
        material: "Neon Blue Composite",
        function: "Interacts with the airflow to generate lift and drag data.",
        assemblyOrder: 6,
        connections: ["Force Balance Mount"],
        failureEffect: "Structural failure of the wing model.",
        cascadeFailures: ["Debris Damage"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: -3 }
    });

    // 6. Force Balance Mount
    const mountGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const mountMesh = new THREE.Mesh(mountGeo, steel);
    mountMesh.position.set(0, 0.5, 0);
    group.add(mountMesh);
    parts.push({
        name: "Force Balance Mount",
        description: "Precision load cells connecting the aerofoil to the base.",
        material: "Steel",
        function: "Measures lift, drag, and pitching moments.",
        assemblyOrder: 7,
        connections: ["Test Subject: Aerofoil", "Wind Tunnel Base"],
        failureEffect: "Inaccurate force measurements.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -2 }
    });

    // 7. Vortex Generators (Tiny fins on the aerofoil)
    const vgGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const vgGeo = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        const vgMesh = new THREE.Mesh(vgGeo, neonRed);
        vgMesh.position.set(-0.5 + i * 0.25, 0.1, 0); // Along the leading edge roughly
        vgMesh.rotation.z = Math.PI / 6; // Angled
        vgGroup.add(vgMesh);
    }
    aerofoilMesh.add(vgGroup); // Attach to aerofoil
    parts.push({
        name: "Vortex Generators",
        description: "Small aerodynamic surfaces placed on the wing.",
        material: "Neon Red Titanium",
        function: "Creates micro-vortices to delay flow separation and stall.",
        assemblyOrder: 8,
        connections: ["Test Subject: Aerofoil"],
        failureEffect: "Premature flow separation and loss of lift.",
        cascadeFailures: ["Stall"],
        originalPosition: { x: 0, y: 1.6, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: -3.5 }
    });

    // 8. Laser Flow Visualizers
    const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 10);
    const laserGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const laser = new THREE.Mesh(laserGeo, neonGreen);
        laser.rotation.z = Math.PI / 2;
        laser.position.set(0, 1.2 + i * 0.3, 0);
        laserGroup.add(laser);
    }
    group.add(laserGroup);
    parts.push({
        name: "Laser Flow Visualizers",
        description: "High-intensity lasers highlighting smoke particles in the flow.",
        material: "Neon Green Emitter",
        function: "Makes the invisible air flow patterns visible to cameras.",
        assemblyOrder: 9,
        connections: ["Testing Chamber"],
        failureEffect: "Loss of flow visualization data.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 2, y: 1.5, z: 3 }
    });

    const description = "The Aerodynamics Vortex Generator is a specialized wind tunnel apparatus designed to study the effects of micro-vortices on boundary layer separation. Using laser-illuminated flow visualization and a high-speed axial fan, it provides real-time data on lift, drag, and stall characteristics of various aerofoil designs.";

    const quizQuestions = [
        {
            question: "What is the primary function of the vortex generators on the aerofoil?",
            options: [
                "To reduce the overall weight of the wing.",
                "To create drag and slow the aircraft down.",
                "To delay boundary layer separation and prevent stall.",
                "To increase the structural integrity of the wing."
            ],
            correct: 2,
            explanation: "Vortex generators energize the boundary layer by mixing high-energy free-stream air with the slower air near the surface, delaying flow separation and allowing the wing to maintain lift at higher angles of attack.",
            difficulty: "Medium"
        },
        {
            question: "What role does the Flow Straightener (honeycomb) play in a wind tunnel?",
            options: [
                "It cools the air before it reaches the test section.",
                "It creates artificial turbulence to test structural limits.",
                "It removes swirl and creates a smooth, laminar air flow.",
                "It measures the exact speed of the air."
            ],
            correct: 2,
            explanation: "The honeycomb structure of the flow straightener forces the air to travel in parallel lines, reducing turbulence and swirl generated by the fan, resulting in laminar flow.",
            difficulty: "Easy"
        },
        {
            question: "In this machine, what component directly measures the aerodynamic forces acting on the aerofoil?",
            options: [
                "The Force Balance Mount",
                "The Laser Flow Visualizers",
                "The Air Intake & Fan",
                "The Wind Tunnel Base"
            ],
            correct: 0,
            explanation: "The Force Balance Mount typically contains precision load cells or strain gauges that measure the physical forces (lift, drag, pitch) exerted on the model by the moving air.",
            difficulty: "Easy"
        },
        {
            question: "Why might laser visualization be preferred over simple smoke injection?",
            options: [
                "Lasers are cheaper to run than smoke generators.",
                "Lasers illuminate specific 2D planes of flow, allowing precise cross-sectional analysis.",
                "Lasers physically push the air molecules faster.",
                "Lasers prevent the glass chamber from shattering."
            ],
            correct: 1,
            explanation: "Laser sheets illuminate specific slices of the flow (seeded with particles or smoke), providing clear, 2D cross-sections of complex 3D flow fields like vortices without scattering light everywhere.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (fanGroup) {
            fanGroup.rotation.x -= speed * 0.5; // Rotate fan blades
        }

        // Animate lasers to simulate flow speed
        laserGroup.children.forEach((laser, index) => {
            laser.position.x = ((time * speed * 2 + index) % 5) - 2.5; // Simulate moving particles
            laser.scale.y = 0.5 + Math.abs(Math.sin(time * speed * 5 + index)) * 0.5; // pulsing
        });

        // Wiggle the aerofoil slightly to simulate buffeting
        if (aerofoilMesh) {
            aerofoilMesh.rotation.x = Math.PI / 8 + Math.sin(time * speed * 10) * 0.02;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVortexGenerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
