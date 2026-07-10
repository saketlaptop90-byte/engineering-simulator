import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.9
    });

    const pulseGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.5
    });

    const darkServerFrame = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.9
    });

    // 1. Central Quantum Core (Processor)
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const coreMesh = new THREE.Mesh(coreGeo, glowBlue);
    coreMesh.position.set(0, 5, 0);
    group.add(coreMesh);
    parts.push({
        name: "Quantum Logic Core",
        description: "The primary processing unit containing quantum qubits suspended in an electromagnetic containment field.",
        material: "Glowing Blue Crystalline",
        function: "Executes parallel probability calculations at zero latency.",
        assemblyOrder: 5,
        connections: ["Data Bus", "Cooling Array", "Power Grid"],
        failureEffect: "Complete system collapse, reverting logic to binary failure state.",
        cascadeFailures: ["Cognitive collapse", "Data corruption"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: coreMesh
    });

    // 2. Mainframe Outer Chassis
    const chassisGeo = new THREE.CylinderGeometry(4, 4, 10, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkServerFrame);
    chassisMesh.position.set(0, 5, 0);
    const chassisWireGeo = new THREE.WireframeGeometry(chassisGeo);
    const chassisLines = new THREE.LineSegments(chassisWireGeo, new THREE.LineBasicMaterial({ color: 0x444444 }));
    chassisMesh.add(chassisLines);
    group.add(chassisMesh);
    parts.push({
        name: "Core Containment Chassis",
        description: "A heavily shielded hexagonal enclosure protecting the quantum components from decoherence.",
        material: "Dark Steel / Titanium",
        function: "Environmental and electromagnetic shielding.",
        assemblyOrder: 1,
        connections: ["Neural Network Racks", "Power Supply"],
        failureEffect: "External interference corrupts processing accuracy.",
        cascadeFailures: ["Thermal runaway", "Quantum decoherence"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -10, y: 5, z: -10 },
        mesh: chassisMesh
    });

    // 3. Neural Network Data Racks (Surrounding the core)
    const rackMeshes = [];
    for (let i = 0; i < 4; i++) {
        const rackGeo = new THREE.BoxGeometry(2, 8, 1);
        const rackMesh = new THREE.Mesh(rackGeo, aluminum);
        const angle = (i * Math.PI) / 2;
        rackMesh.position.x = Math.cos(angle) * 6;
        rackMesh.position.z = Math.sin(angle) * 6;
        rackMesh.position.y = 4;
        rackMesh.lookAt(0, 4, 0);

        // Add blinking lights
        for (let j = 0; j < 5; j++) {
            const lightGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
            const lightMesh = new THREE.Mesh(lightGeo, i % 2 === 0 ? glowMagenta : pulseGreen);
            lightMesh.position.set(0, (j * 1.2) - 2.5, 0.5);
            rackMesh.add(lightMesh);
            rackMeshes.push(lightMesh);
        }

        group.add(rackMesh);
        parts.push({
            name: `Neural Synapse Rack ${i+1}`,
            description: "High-density data storage modeling artificial neural pathways.",
            material: "Aluminum and Neon Optics",
            function: "Stores weight matrices and historical cognitive models.",
            assemblyOrder: i + 2,
            connections: ["Data Bus", "Mainframe Outer Chassis"],
            failureEffect: "Loss of memory patterns resulting in 'AI hallucinations'.",
            cascadeFailures: ["Logic loops", "Corrupted outputs"],
            originalPosition: { x: rackMesh.position.x, y: rackMesh.position.y, z: rackMesh.position.z },
            explodedPosition: { x: rackMesh.position.x * 2, y: rackMesh.position.y + i*2, z: rackMesh.position.z * 2 },
            mesh: rackMesh
        });
    }

    // 4. Optical Data Bus (Connecting racks to core)
    const busMeshes = [];
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const busGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const busMesh = new THREE.Mesh(busGeo, glowMagenta);
        busMesh.rotation.x = Math.PI / 2;
        busMesh.rotation.z = angle;
        busMesh.position.x = Math.cos(angle) * 3;
        busMesh.position.z = Math.sin(angle) * 3;
        busMesh.position.y = 5;
        group.add(busMesh);
        busMeshes.push(busMesh);
        
        parts.push({
            name: `Optical Data Bus Line ${i+1}`,
            description: "Fiber-optic pathways transmitting multi-terabyte data streams per nanosecond.",
            material: "Pulsing Glass/Neon",
            function: "Carries information between memory racks and the processor core.",
            assemblyOrder: 6,
            connections: ["Quantum Logic Core", `Neural Synapse Rack ${i+1}`],
            failureEffect: "Data bottlenecks causing cognitive lag.",
            cascadeFailures: ["Timeout errors", "Desynchronization"],
            originalPosition: { x: busMesh.position.x, y: busMesh.position.y, z: busMesh.position.z },
            explodedPosition: { x: busMesh.position.x * 3, y: busMesh.position.y - 5, z: busMesh.position.z * 3 },
            mesh: busMesh
        });
    }

    // 5. Cryogenic Cooling Ring
    const coolingGeo = new THREE.TorusGeometry(5, 0.5, 16, 100);
    const coolingMesh = new THREE.Mesh(coolingGeo, chrome);
    coolingMesh.rotation.x = Math.PI / 2;
    coolingMesh.position.set(0, 1, 0);
    group.add(coolingMesh);
    parts.push({
        name: "Cryogenic Cooling Ring",
        description: "Circulates liquid helium to maintain operational temperatures near absolute zero.",
        material: "Chrome / Superconductor",
        function: "Prevents the quantum core from melting down under intense computational load.",
        assemblyOrder: 2,
        connections: ["Quantum Logic Core", "Base Plate"],
        failureEffect: "Immediate thermal spike followed by automatic safety shutdown.",
        cascadeFailures: ["Core meltdown", "Hardware vaporisation"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: coolingMesh
    });

    const description = "The Artificial Intelligence Cognitive Array is a massive, highly complex synthetic brain structure. It utilizes a quantum processor suspended within a cryogenic core to evaluate probabilities, cross-reference neural weight matrices housed in surrounding synapse racks, and formulate decisions with zero latency.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cryogenic Cooling Ring?",
            options: ["Generating power for the network", "Storing neural weights", "Circulating liquid helium to maintain temperatures near absolute zero", "Transmitting data optically"],
            correct: 2,
            explanation: "The Cryogenic Cooling Ring maintains the quantum core at near absolute zero to prevent meltdown under intense computational load.",
            difficulty: "Medium"
        },
        {
            question: "Which component stores the weight matrices and historical cognitive models?",
            options: ["Optical Data Bus", "Neural Synapse Racks", "Mainframe Outer Chassis", "Quantum Logic Core"],
            correct: 1,
            explanation: "The Neural Synapse Racks hold the high-density data modeling the AI's neural pathways.",
            difficulty: "Easy"
        },
        {
            question: "What failure cascade results from interference penetrating the Mainframe Outer Chassis?",
            options: ["Thermal runaway and quantum decoherence", "Timeout errors", "Cognitive collapse", "Loss of memory patterns"],
            correct: 0,
            explanation: "If the chassis fails to shield the core, external interference causes quantum decoherence and potentially thermal runaway.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the core
        if (coreMesh) {
            coreMesh.rotation.x += 0.01 * speed;
            coreMesh.rotation.y += 0.02 * speed;
            
            // Pulse the emission
            glowBlue.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed) * 0.4;
        }

        // Float the chassis
        if (chassisMesh) {
            chassisMesh.rotation.y -= 0.005 * speed;
            chassisMesh.position.y = 5 + Math.sin(time * speed) * 0.2;
        }

        // Pulse the rack lights
        rackMeshes.forEach((light, i) => {
            const mat = light.material;
            mat.emissiveIntensity = 0.3 + Math.abs(Math.sin(time * 3 * speed + i)) * 0.7;
        });

        // Data bus flow effect (pulse opacity or scale)
        busMeshes.forEach((bus, i) => {
            glowMagenta.emissiveIntensity = 0.4 + Math.cos(time * 5 * speed) * 0.6;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCognitiveArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
