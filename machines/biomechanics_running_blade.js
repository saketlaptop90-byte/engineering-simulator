import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for high-tech aesthetic
    const carbonFiberMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        roughness: 0.6,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const glowingStressMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
    });

    const neonBlueMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.0,
    });

    const socketMat = new THREE.MeshPhysicalMaterial({
        color: 0x2c3e50,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 0.5,
    });

    // 1. Socket (Attachment to residual limb)
    const socketGeo = new THREE.CylinderGeometry(0.8, 0.6, 2, 32, 1, false, 0, Math.PI * 2);
    const socket = new THREE.Mesh(socketGeo, socketMat);
    socket.position.set(0, 5, 0);
    group.add(socket);
    parts.push({
        name: "Socket",
        description: "Custom-fitted interface that connects the prosthetic to the athlete's residual limb.",
        material: "Carbon-fiber composite & silicone lining",
        function: "Transfers the athlete's body weight and movement forces seamlessly into the blade.",
        assemblyOrder: 1,
        connections: ["Pylon Adapter"],
        failureEffect: "Loss of control, chafing, and immediate discontinuation of running.",
        cascadeFailures: ["Increased stress on the Pylon Adapter"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 },
        mesh: socket
    });

    // 2. Pylon Adapter (Connection piece)
    const adapterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const adapter = new THREE.Mesh(adapterGeo, chrome);
    adapter.position.set(0, 3.75, 0);
    group.add(adapter);
    parts.push({
        name: "Pylon Adapter",
        description: "Titanium alignment adapter connecting the socket to the J-shaped carbon blade.",
        material: "Titanium",
        function: "Allows micro-adjustments in alignment to optimize the athlete's gait.",
        assemblyOrder: 2,
        connections: ["Socket", "J-Blade"],
        failureEffect: "Misalignment of forces, leading to joint pain or blade snapping.",
        cascadeFailures: ["J-Blade fracture"],
        originalPosition: { x: 0, y: 3.75, z: 0 },
        explodedPosition: { x: 0, y: 3.75, z: -2 },
        mesh: adapter
    });

    // 3. J-Blade (The main carbon-fiber spring)
    const jCurveGeo = new THREE.TorusGeometry(2, 0.2, 16, 64, Math.PI);
    const jBladeBase = new THREE.Mesh(jCurveGeo, carbonFiberMat);
    jBladeBase.rotation.y = Math.PI / 2;
    jBladeBase.rotation.x = Math.PI;
    jBladeBase.position.set(0, 1.75, 2);

    const bladeGroup = new THREE.Group();
    bladeGroup.add(jBladeBase);
    
    const straightGeo = new THREE.BoxGeometry(0.4, 2, 0.4);
    const straightPart = new THREE.Mesh(straightGeo, carbonFiberMat);
    straightPart.position.set(0, 2.75, 0);
    bladeGroup.add(straightPart);

    bladeGroup.position.set(0, 0, 0);
    group.add(bladeGroup);
    
    parts.push({
        name: "J-Blade Carbon Spring",
        description: "The core dynamic component designed to store and release kinetic energy.",
        material: "High-grade Carbon Fiber",
        function: "Compresses under the athlete's weight and springs back, simulating calf muscle and Achilles tendon function.",
        assemblyOrder: 3,
        connections: ["Pylon Adapter", "Sole Spike Plate"],
        failureEffect: "Catastrophic failure causing immediate collapse.",
        cascadeFailures: ["Athlete fall, destruction of sole plate"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2 },
        mesh: bladeGroup
    });

    // 4. Energy Return Indicator (Neon accents)
    const indicatorGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.1, 16);
    const indicator = new THREE.Mesh(indicatorGeo, neonBlueMat);
    indicator.position.set(0, 2.75, 0);
    bladeGroup.add(indicator);
    
    parts.push({
        name: "Kinetic Energy Sensors",
        description: "Embedded sensors visualizing energy storage and release in real-time.",
        material: "Optic Fibers & Neon Gas",
        function: "Provides biomechanical feedback on the efficiency of energy return.",
        assemblyOrder: 4,
        connections: ["J-Blade Carbon Spring"],
        failureEffect: "Loss of telemetry data.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2.75, z: 0 },
        explodedPosition: { x: 2, y: 2.75, z: 0 },
        mesh: indicator
    });

    // 5. Sole / Spike Plate (Ground contact)
    const soleGeo = new THREE.BoxGeometry(0.8, 0.2, 1.5);
    const sole = new THREE.Mesh(soleGeo, rubber);
    sole.position.set(0, -0.1, 4); // Based on Torus geometry radius
    group.add(sole);
    parts.push({
        name: "Traction Sole",
        description: "High-grip rubber and spike plate located at the distal end of the blade.",
        material: "Vulcanized Rubber and Steel Spikes",
        function: "Provides grip on track surfaces and prevents lateral slipping during impact.",
        assemblyOrder: 5,
        connections: ["J-Blade Carbon Spring"],
        failureEffect: "Slipping, leading to dangerous falls at high speeds.",
        cascadeFailures: ["Socket misalignment from impact"],
        originalPosition: { x: 0, y: -0.1, z: 4 },
        explodedPosition: { x: 0, y: -1, z: 4 },
        mesh: sole
    });

    // 6. Stress Heatmap Overlay (Glowing red under load)
    const stressGeo = new THREE.TorusGeometry(2.05, 0.22, 16, 64, Math.PI / 2);
    const stressOverlay = new THREE.Mesh(stressGeo, glowingStressMat);
    stressOverlay.rotation.y = Math.PI / 2;
    stressOverlay.rotation.x = Math.PI;
    stressOverlay.position.set(0, 1.75, 2);
    bladeGroup.add(stressOverlay);
    parts.push({
        name: "Stress Hotspots",
        description: "Visualizes the areas of maximum material stress during the compression phase.",
        material: "Smart Polymer",
        function: "Indicates peak load to prevent structural failure.",
        assemblyOrder: 6,
        connections: ["J-Blade Carbon Spring"],
        failureEffect: "Invisible micro-fractures going unnoticed.",
        cascadeFailures: ["Catastrophic J-Blade fracture"],
        originalPosition: { x: 0, y: 1.75, z: 2 },
        explodedPosition: { x: -2, y: 1.75, z: 2 },
        mesh: stressOverlay
    });


    const description = "The Running Blade Prosthetic is an advanced biomechanical device engineered for elite sprinters. By utilizing a J-shaped carbon-fiber spring, it perfectly stores potential energy upon ground impact and releases it as kinetic energy. This model features glowing stress indicators and dynamic compression animations to visualize the physics of high-speed running.";

    const quizQuestions = [
        {
            question: "What biological structure does the J-shaped carbon blade primarily emulate?",
            options: [
                "The femur and knee joint",
                "The Achilles tendon and calf muscle",
                "The metatarsal bones of the foot",
                "The shin bone (tibia)"
            ],
            correct: 1,
            explanation: "The blade compresses and rebounds, storing and releasing energy much like the Achilles tendon and calf muscles do during a natural running stride.",
            difficulty: "Medium"
        },
        {
            question: "Why is Carbon Fiber the material of choice for the main spring blade?",
            options: [
                "It is extremely heavy and provides stability.",
                "It is completely rigid and prevents any bending.",
                "It has an extremely high strength-to-weight ratio and excellent elastic memory.",
                "It is the cheapest material available for prosthetics."
            ],
            correct: 2,
            explanation: "Carbon fiber is exceptionally light and strong. Its elastic properties allow it to bend under weight and snap back to its original shape, providing the necessary energy return.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Pylon Adapter is misaligned?",
            options: [
                "The blade becomes stiffer and stores more energy.",
                "The socket will detach entirely in mid-air.",
                "Forces are transferred unevenly, leading to joint pain or potential blade fracture.",
                "The traction sole will automatically adjust its angle."
            ],
            correct: 2,
            explanation: "Proper alignment is critical. Misalignment causes uneven stress distribution which can harm the athlete's joints and increase the risk of the carbon fiber snapping under torsional strain.",
            difficulty: "Hard"
        }
    ];

    let timeOffset = 0;

    function animate(time, speed, meshes) {
        timeOffset += speed * 0.05;
        
        // Simulating the running cycle (compression and release)
        const compressionCycle = Math.sin(timeOffset * 4); // Varies between -1 and 1
        
        // Only compress (0 to 1)
        const load = Math.max(0, compressionCycle);
        
        const blade = meshes.find(m => m.name === "J-Blade Carbon Spring");
        const socketMesh = meshes.find(m => m.name === "Socket");
        const adapterMesh = meshes.find(m => m.name === "Pylon Adapter");
        const indicatorMesh = meshes.find(m => m.name === "Kinetic Energy Sensors");
        const stressMesh = meshes.find(m => m.name === "Stress Hotspots");

        if (blade && blade.mesh) {
            // Compress the blade downwards slightly and bend it
            blade.mesh.scale.y = 1 - (load * 0.15);
            blade.mesh.scale.z = 1 + (load * 0.05);
            blade.mesh.position.y = -load * 0.5;
        }

        if (socketMesh && socketMesh.mesh && adapterMesh && adapterMesh.mesh) {
            // Move socket and adapter down with the compression
            socketMesh.mesh.position.y = socketMesh.originalPosition.y - (load * 0.8);
            adapterMesh.mesh.position.y = adapterMesh.originalPosition.y - (load * 0.8);
        }

        if (indicatorMesh && indicatorMesh.mesh && indicatorMesh.mesh.material) {
            // Pulse the neon indicator based on energy storage
            indicatorMesh.mesh.material.emissiveIntensity = 0.5 + load * 2.0;
        }

        if (stressMesh && stressMesh.mesh && stressMesh.mesh.material) {
            // Increase opacity of stress hotspots when under load
            stressMesh.mesh.material.opacity = load * 0.9;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRunningBlade() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
