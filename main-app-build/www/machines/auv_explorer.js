import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.5
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.9
    });

    const titaniumHulls = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        roughness: 0.4,
        metalness: 0.8,
        clearcoat: 0.3
    });

    // 1. Main Pressure Hull
    const hullGeometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    hullGeometry.rotateZ(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeometry, titaniumHulls);
    
    parts.push({
        name: 'Titanium Pressure Hull',
        description: 'The primary structure housing sensitive electronics and resisting extreme deep-sea pressure.',
        material: 'Titanium Alloy',
        function: 'Structural integrity, pressure resistance, and buoyancy control.',
        assemblyOrder: 1,
        connections: ['Nose Cone', 'Tail Section', 'Sensor Array'],
        failureEffect: 'Catastrophic implosion, immediate mission failure.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: hullMesh
    });

    // 2. Acrylic Observation Dome (Nose)
    const domeGeometry = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeometry.rotateZ(-Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeometry, glass);
    
    parts.push({
        name: 'Acrylic Observation Dome',
        description: 'Thick acrylic dome providing structural strength and optical clarity for forward cameras.',
        material: 'High-Strength Acrylic',
        function: 'Provides a viewport for imaging arrays while maintaining pressure seal.',
        assemblyOrder: 2,
        connections: ['Titanium Pressure Hull', 'Forward Imaging System'],
        failureEffect: 'Flooding of forward compartments.',
        cascadeFailures: ['Forward Imaging System', 'Navigation Computer'],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 },
        mesh: domeMesh
    });

    // 3. Tail Propulsion Section
    const tailGeometry = new THREE.ConeGeometry(2, 3, 32);
    tailGeometry.rotateZ(Math.PI / 2);
    const tailMesh = new THREE.Mesh(tailGeometry, darkSteel);
    
    parts.push({
        name: 'Hydrodynamic Tail Section',
        description: 'Tapered aft section reducing drag and housing the main drive systems.',
        material: 'Carbon Composite / Steel',
        function: 'Drag reduction, houses main propulsion stators.',
        assemblyOrder: 3,
        connections: ['Titanium Pressure Hull', 'Main Thruster'],
        failureEffect: 'Increased drag, potential loss of propulsion mounting.',
        cascadeFailures: ['Main Thruster'],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 },
        mesh: tailMesh
    });

    // 4. Main Thruster (Propeller)
    const propellerGroup = new THREE.Group();
    const hubGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    hubGeom.rotateZ(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeom, chrome);
    propellerGroup.add(hubMesh);
    
    for (let i = 0; i < 5; i++) {
        const bladeGeom = new THREE.BoxGeometry(0.1, 2, 0.5);
        const blade = new THREE.Mesh(bladeGeom, aluminum);
        blade.position.y = 1;
        
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI * 2) / 5;
        blade.rotation.y = Math.PI / 8; // pitch
        pivot.add(blade);
        propellerGroup.add(pivot);
    }

    parts.push({
        name: 'Magnetic Drive Propeller',
        description: 'Five-blade silent running propeller driven by a hubless magnetic motor.',
        material: 'Aluminum / Chrome',
        function: 'Primary forward and reverse propulsion.',
        assemblyOrder: 4,
        connections: ['Hydrodynamic Tail Section', 'Power Core'],
        failureEffect: 'Loss of forward mobility.',
        cascadeFailures: [],
        originalPosition: { x: -7.5, y: 0, z: 0 },
        explodedPosition: { x: -14, y: 0, z: 0 },
        mesh: propellerGroup
    });

    // 5. Sensor Array (Dorsal)
    const sensorGeom = new THREE.BoxGeometry(3, 0.5, 1);
    const sensorMesh = new THREE.Mesh(sensorGeom, darkSteel);
    const lightGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const lightMesh = new THREE.Mesh(lightGeom, neonBlue);
    lightMesh.position.set(0, 0.5, 0);
    sensorMesh.add(lightMesh);

    parts.push({
        name: 'Dorsal Sensor Array',
        description: 'Array of multi-beam sonars, CTD sensors, and acoustic communication beacons.',
        material: 'Dark Steel / Neodymium',
        function: 'Environmental mapping and surface communication.',
        assemblyOrder: 5,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Loss of telemetry and depth mapping.',
        cascadeFailures: ['Navigation Computer'],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: sensorMesh
    });

    // 6. Power Core / Battery Bank
    const powerGeom = new THREE.CylinderGeometry(1, 1, 4, 32);
    powerGeom.rotateZ(Math.PI / 2);
    const powerMesh = new THREE.Mesh(powerGeom, copper);
    const glowGeom = new THREE.CylinderGeometry(1.05, 1.05, 3.8, 32);
    glowGeom.rotateZ(Math.PI / 2);
    const glowMesh = new THREE.Mesh(glowGeom, neonGreen);
    powerMesh.add(glowMesh);

    parts.push({
        name: 'High-Density Battery Core',
        description: 'Advanced solid-state battery bank providing deep-sea endurance.',
        material: 'Copper / Lithium Solid-State',
        function: 'Provides power to all subsystems.',
        assemblyOrder: 6,
        connections: ['Titanium Pressure Hull', 'Main Thruster', 'Sensor Array'],
        failureEffect: 'Total system blackout, triggering emergency ascent drop-weights.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: powerMesh
    });

    // 7. Lateral Thrusters (Port & Starboard)
    const lateralGroup = new THREE.Group();
    const thrusterGeom = new THREE.CylinderGeometry(0.4, 0.4, 4.5, 16);
    thrusterGeom.rotateX(Math.PI / 2);
    const portThruster = new THREE.Mesh(thrusterGeom, steel);
    portThruster.position.z = 2.25;
    const stbdThruster = new THREE.Mesh(thrusterGeom, steel);
    stbdThruster.position.z = -2.25;
    lateralGroup.add(portThruster, stbdThruster);

    parts.push({
        name: 'Lateral Maneuvering Thrusters',
        description: 'Cross-body tunnel thrusters for strafing and precise heading adjustments.',
        material: 'Steel',
        function: 'Provides yaw and lateral translation control.',
        assemblyOrder: 7,
        connections: ['Titanium Pressure Hull', 'Navigation Computer'],
        failureEffect: 'Loss of fine positioning control.',
        cascadeFailures: [],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 0, z: 6 },
        mesh: lateralGroup
    });

    // Assemble everything
    parts.forEach(part => {
        part.mesh.position.copy(part.originalPosition);
        group.add(part.mesh);
    });

    const description = "The AUV (Autonomous Underwater Vehicle) Explorer is a highly advanced, untethered robotic submarine designed for deep-ocean research. Operating at extreme pressures, it utilizes a titanium hull, magnetic drive propulsion, and multi-beam sonar arrays to map the seafloor and gather oceanographic data autonomously.";

    const quizQuestions = [
        {
            question: "Why is the pressure hull typically constructed from materials like Titanium in deep-sea AUVs?",
            options: [
                "It is completely invisible to sonar.",
                "It offers an extremely high strength-to-weight ratio and corrosion resistance.",
                "It provides unlimited battery life.",
                "It is the cheapest metal available."
            ],
            correct: 1,
            explanation: "Titanium is favored for deep-sea applications due to its excellent strength-to-weight ratio, allowing it to withstand extreme crushing pressures without being too heavy, and its high resistance to saltwater corrosion.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the primary High-Density Battery Core fails during a dive?",
            options: [
                "The AUV switches to a diesel backup generator.",
                "The AUV deploys solar panels to recharge.",
                "It triggers emergency drop-weights to allow positive buoyancy to return it to the surface.",
                "The AUV buries itself in the sand."
            ],
            correct: 2,
            explanation: "Deep-sea AUVs are often designed to be slightly positively buoyant, carrying disposable 'drop weights'. If a total power failure occurs, electromagnets holding the weights lose power, dropping the weights and allowing the AUV to float to the surface.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the Lateral Maneuvering Thrusters?",
            options: [
                "To propel the AUV forward at maximum speed.",
                "To provide yaw control and precise sideways movement.",
                "To dig into the seafloor.",
                "To communicate with satellites."
            ],
            correct: 1,
            explanation: "Lateral thrusters are mounted perpendicular to the main axis of the AUV, allowing it to strafe left/right (translation) or turn precisely on its vertical axis (yaw).",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Find the propeller and rotate it
        const propeller = parts.find(p => p.name === 'Magnetic Drive Propeller').mesh;
        if (propeller) {
            propeller.rotation.x += 0.1 * speed;
        }

        // Pulse the battery core neon light
        const battery = parts.find(p => p.name === 'High-Density Battery Core').mesh;
        if (battery && battery.children.length > 0) {
            const glow = battery.children[0];
            const pulse = (Math.sin(time * 0.005) + 1) / 2; // 0 to 1
            glow.material.emissiveIntensity = 0.2 + pulse * 0.8;
        }

        // Rotate the dorsal sensor light beacon
        const sensor = parts.find(p => p.name === 'Dorsal Sensor Array').mesh;
        if (sensor && sensor.children.length > 0) {
            const light = sensor.children[0];
            light.position.y = 0.5 + Math.sin(time * 0.01) * 0.2;
        }
        
        // Gentle bobbing motion of the entire group to simulate being underwater
        group.position.y = Math.sin(time * 0.002) * 0.5;
        group.rotation.z = Math.sin(time * 0.001) * 0.05;
        group.rotation.x = Math.cos(time * 0.0015) * 0.05;
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
export function createAuvExplorer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
