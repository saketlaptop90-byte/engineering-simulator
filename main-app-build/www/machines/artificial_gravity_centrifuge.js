import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM MATERIALS ---
    const plasmaGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const forceField = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        wireframe: true
    });

    const radiatorGlow = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        roughness: 0.6,
        metalness: 0.8
    });

    const neonAccent = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5
    });

    const solarMat = new THREE.MeshPhysicalMaterial({
        color: 0x112255,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 1.0
    });

    // --- 1. CENTRAL HUB ASSEMBLY ---
    const hubGroup = new THREE.Group();
    
    const frontGeo = new THREE.CylinderGeometry(3, 3, 16, 32);
    const frontMesh = new THREE.Mesh(frontGeo, darkSteel);
    frontMesh.rotation.x = Math.PI / 2;
    frontMesh.position.z = 10; 
    hubGroup.add(frontMesh);
    
    const backGeo = new THREE.CylinderGeometry(3, 3, 16, 32);
    const backMesh = new THREE.Mesh(backGeo, darkSteel);
    backMesh.rotation.x = Math.PI / 2;
    backMesh.position.z = -10; 
    hubGroup.add(backMesh);

    const innerRingGeo = new THREE.TorusGeometry(3.5, 0.8, 32, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, steel);
    hubGroup.add(innerRingMesh);

    const accentGeo = new THREE.TorusGeometry(3.05, 0.1, 16, 64);
    for(let z of [4, 8, 12, 16, -4, -8, -12, -16]) {
        const accentMesh = new THREE.Mesh(accentGeo, neonAccent);
        accentMesh.position.z = z;
        hubGroup.add(accentMesh);
    }

    group.add(hubGroup);
    parts.push({
        name: "Central Command Hub",
        description: "The non-rotating central axis housing navigation, zero-G manufacturing, and core computing.",
        material: "darkSteel",
        function: "Maintains overall station stability and acts as the structural spine.",
        assemblyOrder: 1,
        connections: ["Transit Spokes", "Fusion Plasma Core", "Photovoltaic Solar Array", "Thermal Radiators"],
        failureEffect: "Loss of station control and potential structural collapse.",
        cascadeFailures: ["Navigation offline", "Life support systems isolation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 },
        mesh: hubGroup
    });

    // --- 2. HABITATION TORUS ---
    const torusGroup = new THREE.Group();
    
    const mainRingGeo = new THREE.TorusGeometry(25, 3, 64, 128);
    const mainRing = new THREE.Mesh(mainRingGeo, steel);
    torusGroup.add(mainRing);

    const modGeo = new THREE.BoxGeometry(8, 8, 10);
    const windowGeo = new THREE.BoxGeometry(8.2, 4, 8);
    
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        
        const modMesh = new THREE.Mesh(modGeo, chrome);
        modMesh.position.x = Math.cos(angle) * 25;
        modMesh.position.y = Math.sin(angle) * 25;
        modMesh.rotation.z = angle;
        torusGroup.add(modMesh);

        const windowMesh = new THREE.Mesh(windowGeo, glass);
        windowMesh.position.copy(modMesh.position);
        windowMesh.rotation.z = angle;
        torusGroup.add(windowMesh);
    }
    
    group.add(torusGroup);
    parts.push({
        name: "Habitation Torus",
        description: "The primary living quarters where artificial gravity is generated via centripetal force.",
        material: "chrome",
        function: "Provides 1G environment for long-term crew health and habitation.",
        assemblyOrder: 3,
        connections: ["Transit Spokes"],
        failureEffect: "Loss of gravity, immediate microgravity health hazards.",
        cascadeFailures: ["Fluid systems backup", "Crew disorientation", "Bone density decay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 },
        mesh: torusGroup
    });

    // --- 3. TRANSIT SPOKES ---
    const spokeGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        
        const pivot = new THREE.Group();
        pivot.rotation.z = angle;
        
        const elevatorGeo = new THREE.CylinderGeometry(1.0, 1.0, 19, 16);
        const elevatorMesh = new THREE.Mesh(elevatorGeo, forceField);
        elevatorMesh.position.y = 14;
        pivot.add(elevatorMesh);

        const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 19, 8);
        for(let j=0; j<3; j++) {
            const beamAngle = (j/3) * Math.PI * 2;
            const beamMesh = new THREE.Mesh(beamGeo, aluminum);
            beamMesh.position.y = 14;
            beamMesh.position.x = Math.cos(beamAngle) * 1.5;
            beamMesh.position.z = Math.sin(beamAngle) * 1.5;
            pivot.add(beamMesh);
        }
        
        spokeGroup.add(pivot);
    }
    group.add(spokeGroup);
    parts.push({
        name: "Transit Spokes",
        description: "Pressurized elevator shafts connecting the zero-G hub to the 1G habitation ring.",
        material: "aluminum",
        function: "Facilitates crew and cargo transit between different gravity zones.",
        assemblyOrder: 2,
        connections: ["Central Command Hub", "Habitation Torus"],
        failureEffect: "Crew trapped in respective gravity zones.",
        cascadeFailures: ["Logistics bottleneck", "Emergency evacuation blocked"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 30, z: 0 },
        mesh: spokeGroup
    });

    // --- 4. GYROSCOPIC STABILIZER RING ---
    const stabGeo = new THREE.TorusGeometry(15, 1.5, 32, 100);
    const stabMesh = new THREE.Mesh(stabGeo, darkSteel);
    stabMesh.position.z = -12;
    group.add(stabMesh);
    parts.push({
        name: "Gyroscopic Stabilizer Ring",
        description: "Massive counter-rotating ring located at the rear of the hub to cancel angular momentum.",
        material: "darkSteel",
        function: "Prevents the station from spinning out of control due to torque from the Habitation Torus.",
        assemblyOrder: 4,
        connections: ["Central Command Hub"],
        failureEffect: "Station begins tumbling uncontrollably along its axis.",
        cascadeFailures: ["Navigation lock lost", "Solar arrays lose alignment"],
        originalPosition: { x: 0, y: 0, z: -12 },
        explodedPosition: { x: 0, y: -40, z: -12 },
        mesh: stabMesh
    });

    // --- 5. FUSION PLASMA CORE ---
    const coreGroup = new THREE.Group();
    const coreGeo1 = new THREE.IcosahedronGeometry(2.2, 1);
    const coreMesh1 = new THREE.Mesh(coreGeo1, plasmaGlow);
    const coreGeo2 = new THREE.IcosahedronGeometry(2.8, 2);
    const coreMesh2 = new THREE.Mesh(coreGeo2, forceField);
    
    coreGroup.add(coreMesh1);
    coreGroup.add(coreMesh2);
    group.add(coreGroup);
    parts.push({
        name: "Fusion Plasma Core",
        description: "Advanced compact fusion reactor powering the station, visible in the center of the hub.",
        material: "plasmaGlow",
        function: "Generates massive electrical output for life support, rotation motors, and electromagnetic shielding.",
        assemblyOrder: 5,
        connections: ["Central Command Hub", "Magnetic Containment Fields"],
        failureEffect: "Total station blackout.",
        cascadeFailures: ["Life support failure", "Orbit decay", "Rotation deceleration"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 40 },
        mesh: coreGroup
    });

    // --- 6. MAGNETIC CONTAINMENT FIELDS ---
    const magGroup = new THREE.Group();
    const magGeo = new THREE.TorusGeometry(3.6, 0.2, 16, 64);
    for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(magGeo, forceField);
        magGroup.add(m);
    }
    group.add(magGroup);
    parts.push({
        name: "Magnetic Containment Fields",
        description: "Electromagnetic emitter rings that glide along the hub, stabilizing the fusion core and shielding the station from radiation.",
        material: "forceField",
        function: "Contains high-energy plasma and dynamically redirects harmful cosmic radiation.",
        assemblyOrder: 6,
        connections: ["Fusion Plasma Core", "Central Command Hub"],
        failureEffect: "Lethal radiation exposure in the central hub.",
        cascadeFailures: ["Reactor breach", "Electronics frying"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 0, z: 0 },
        mesh: magGroup
    });

    // --- 7. THERMAL RADIATORS ---
    const radGroup = new THREE.Group();
    for(let i = 0; i < 4; i++) {
        const radGeo = new THREE.BoxGeometry(12, 0.5, 10);
        const radMesh = new THREE.Mesh(radGeo, radiatorGlow);
        const angle = (i / 4) * Math.PI * 2;
        radMesh.position.x = Math.cos(angle) * 7;
        radMesh.position.y = Math.sin(angle) * 7;
        radMesh.rotation.z = angle;
        radGroup.add(radMesh);
    }
    radGroup.position.z = -16;
    group.add(radGroup);
    parts.push({
        name: "Thermal Radiators",
        description: "High-surface-area fins glowing with waste heat from the reactor.",
        material: "radiatorGlow",
        function: "Dissipates excess thermal energy into the vacuum of space via infrared radiation.",
        assemblyOrder: 7,
        connections: ["Central Command Hub"],
        failureEffect: "Station overheating, core meltdown.",
        cascadeFailures: ["Coolant boil-off", "Reactor scram", "Structural warping"],
        originalPosition: { x: 0, y: 0, z: -16 },
        explodedPosition: { x: -30, y: -30, z: -16 },
        mesh: radGroup
    });

    // --- 8. PHOTOVOLTAIC SOLAR ARRAY ---
    const solarGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(15, 0.2, 4);
    
    for(let i = 0; i < 2; i++) {
        const panel = new THREE.Mesh(panelGeo, solarMat);
        panel.position.x = (i === 0 ? 1 : -1) * 12;
        solarGroup.add(panel);
    }
    solarGroup.position.z = 16;
    group.add(solarGroup);
    parts.push({
        name: "Photovoltaic Solar Array",
        description: "Auxiliary power panels tracking the local star.",
        material: "solarMat",
        function: "Provides backup power to core life support in the event of reactor shutdown.",
        assemblyOrder: 8,
        connections: ["Central Command Hub"],
        failureEffect: "Loss of redundancy.",
        cascadeFailures: ["Total death upon reactor failure"],
        originalPosition: { x: 0, y: 0, z: 16 },
        explodedPosition: { x: 30, y: -30, z: 16 },
        mesh: solarGroup
    });

    const description = "The Artificial Gravity Centrifuge is a pinnacle of deep-space engineering, relying on rotational inertia to create simulated gravity for its inhabitants. It features a massive habitation torus, transit spokes, a counter-rotating gyroscopic stabilizer to manage angular momentum, and a dense fusion plasma core for immense power generation.";

    const quizQuestions = [
        {
            question: "What physical principle does the Habitation Torus use to simulate gravity?",
            options: [
                "Magnetism",
                "Centripetal Force",
                "Dark Energy",
                "Linear Acceleration"
            ],
            correct: 1,
            explanation: "The torus rotates, creating centripetal force that pushes inhabitants against the outer wall, simulating the feeling of gravity.",
            difficulty: "Easy"
        },
        {
            question: "Why does the station require a Gyroscopic Stabilizer Ring?",
            options: [
                "To generate power",
                "To cool the reactor",
                "To cancel angular momentum",
                "To shield against radiation"
            ],
            correct: 2,
            explanation: "According to the conservation of angular momentum, spinning a massive ring in one direction would cause the central hub to spin in the opposite direction unless countered by a stabilizer ring.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary risk if the Thermal Radiators fail in the vacuum of space?",
            options: [
                "The station freezes",
                "The reactor melts down due to trapped heat",
                "Gravity fails immediately",
                "The magnetic field collapses"
            ],
            correct: 1,
            explanation: "Space is an excellent insulator. Without radiators to dissipate waste heat from the fusion core via infrared radiation, the station would quickly overheat and suffer a meltdown.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const rotSpeed = speed * 0.005;

        torusGroup.rotation.z -= rotSpeed;
        spokeGroup.rotation.z -= rotSpeed;
        stabMesh.rotation.z += rotSpeed * 2.5;

        coreMesh1.rotation.x += rotSpeed * 3;
        coreMesh1.rotation.y += rotSpeed * 4;
        coreMesh2.rotation.x -= rotSpeed * 2;
        coreMesh2.rotation.y -= rotSpeed * 5;

        const pulse = 1.0 + Math.sin(time * 0.005 * speed) * 0.15;
        coreGroup.scale.set(pulse, pulse, pulse);
        plasmaGlow.emissiveIntensity = 2.0 + Math.sin(time * 0.008 * speed) * 1.5;

        magGroup.children.forEach((ring, idx) => {
            const offset = (idx / 6) * Math.PI * 2;
            ring.position.z = Math.sin(time * 0.002 * speed + offset) * 12;
            ring.rotation.z += rotSpeed * 3;
        });

        radiatorGlow.emissiveIntensity = 1.0 + Math.abs(Math.sin(time * 0.001 * speed)) * 1.5;
        
        solarGroup.rotation.y = Math.sin(time * 0.0005 * speed) * 0.5;
        solarGroup.rotation.z += rotSpeed * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}
