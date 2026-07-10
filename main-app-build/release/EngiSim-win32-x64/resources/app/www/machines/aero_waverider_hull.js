import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const thermalTileMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.2,
        bumpScale: 0.02
    });

    const plasmaGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const inletMaterial = new THREE.MeshStandardMaterial({
        color: 0x333344,
        metalness: 0.8,
        roughness: 0.4
    });

    const highTempEdgeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.3
    });

    // 1. Main Fuselage (Wedge Shape)
    const fuselageShape = new THREE.Shape();
    fuselageShape.moveTo(0, 0); // nose
    fuselageShape.lineTo(4, 1); // top rear
    fuselageShape.lineTo(4, -1); // bottom rear
    fuselageShape.lineTo(0, 0); // close
    
    const extrudeSettings = {
        steps: 1,
        depth: 3,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    const fuselageGeometry = new THREE.ExtrudeGeometry(fuselageShape, extrudeSettings);
    fuselageGeometry.center();
    const fuselageMesh = new THREE.Mesh(fuselageGeometry, thermalTileMaterial);
    fuselageMesh.rotation.y = Math.PI / 2;
    fuselageMesh.scale.set(1.5, 0.5, 2.5); // Flatten and elongate

    group.add(fuselageMesh);
    parts.push({
        name: "Main Fuselage (Waverider Hull)",
        description: "A wedge-like aerodynamic hull designed to trap its own supersonic shockwave underneath for compression lift.",
        material: thermalTileMaterial,
        function: "Provides structural integrity, houses internal systems, and creates the primary aerodynamic surface.",
        assemblyOrder: 1,
        connections: ["Leading Edges", "Scramjet Inlets", "Canopy"],
        failureEffect: "Loss of aerodynamic stability and destruction from extreme thermal loads.",
        cascadeFailures: ["Complete structural disintegration", "Engine starvation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: fuselageMesh
    });

    // 2. Leading Edges (Ablative/High-Temp)
    const edgeGeo = new THREE.CylinderGeometry(0.05, 0.05, 8, 8);
    const leftEdge = new THREE.Mesh(edgeGeo, highTempEdgeMaterial);
    leftEdge.position.set(-2, 0, 1.8);
    leftEdge.rotation.z = Math.PI / 2;
    leftEdge.rotation.y = -Math.PI / 8;
    
    const rightEdge = new THREE.Mesh(edgeGeo, highTempEdgeMaterial);
    rightEdge.position.set(2, 0, 1.8);
    rightEdge.rotation.z = Math.PI / 2;
    rightEdge.rotation.y = Math.PI / 8;

    const leadingEdgesGroup = new THREE.Group();
    leadingEdgesGroup.add(leftEdge);
    leadingEdgesGroup.add(rightEdge);
    group.add(leadingEdgesGroup);

    parts.push({
        name: "High-Temperature Leading Edges",
        description: "Specialized carbon-carbon composite edges that withstand the extreme heat of hypersonic flight.",
        material: highTempEdgeMaterial,
        function: "Pierces the air to form the initial bow shock and dissipates intense kinetic heating.",
        assemblyOrder: 2,
        connections: ["Main Fuselage"],
        failureEffect: "Rapid melting of the hull and catastrophic aerodynamic failure.",
        cascadeFailures: ["Thermal shield failure", "Shockwave destabilization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 },
        mesh: leadingEdgesGroup
    });

    // 3. Cockpit Canopy
    const canopyGeo = new THREE.CapsuleGeometry(0.4, 1.5, 4, 8);
    const canopyMesh = new THREE.Mesh(canopyGeo, tinted);
    canopyMesh.rotation.x = Math.PI / 2;
    canopyMesh.position.set(0, 0.6, 1);
    canopyMesh.scale.set(1, 0.5, 1);
    group.add(canopyMesh);

    parts.push({
        name: "Armored Canopy",
        description: "Aerodynamic viewport for crew or sensors, heavily shielded against thermal radiation.",
        material: tinted,
        function: "Allows visibility while maintaining hull integrity under high mach numbers.",
        assemblyOrder: 3,
        connections: ["Main Fuselage"],
        failureEffect: "Depressurization and immediate crew fatality or sensor loss.",
        cascadeFailures: ["Avionics failure"],
        originalPosition: { x: 0, y: 0.6, z: 1 },
        explodedPosition: { x: 0, y: 3, z: 1 },
        mesh: canopyMesh
    });

    // 4. Scramjet Inlets
    const inletGeo = new THREE.BoxGeometry(2.5, 0.5, 3);
    const inletMesh = new THREE.Mesh(inletGeo, inletMaterial);
    inletMesh.position.set(0, -0.6, -1);
    group.add(inletMesh);

    parts.push({
        name: "Scramjet Inlets",
        description: "Underbelly intakes positioned specifically to ingest the high-pressure air from the trapped shockwave.",
        material: inletMaterial,
        function: "Channels compressed, supersonic air directly into the scramjet combustion chamber.",
        assemblyOrder: 4,
        connections: ["Main Fuselage", "Exhaust Nozzle"],
        failureEffect: "Engine unstart, immediate loss of thrust.",
        cascadeFailures: ["Loss of altitude", "Stall"],
        originalPosition: { x: 0, y: -0.6, z: -1 },
        explodedPosition: { x: 0, y: -3, z: -1 },
        mesh: inletMesh
    });

    // 5. Plasma Shockwave (Visualizer)
    const shockGeo = new THREE.ConeGeometry(5, 12, 16, 1, true);
    const shockMesh = new THREE.Mesh(shockGeo, plasmaGlowMaterial);
    shockMesh.rotation.x = -Math.PI / 2;
    shockMesh.position.set(0, -1, 2);
    group.add(shockMesh);

    parts.push({
        name: "Compression Lift Shockwave (Visual Effect)",
        description: "The high-pressure shockwave generated by the vehicle's shape at hypersonic speeds.",
        material: plasmaGlowMaterial,
        function: "Provides the 'lift' in compression lift by trapping high pressure under the hull.",
        assemblyOrder: 5,
        connections: [],
        failureEffect: "Loss of lift and catastrophic descent.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 2 },
        explodedPosition: { x: 0, y: -5, z: 5 },
        mesh: shockMesh
    });

    const description = "The Aero Hypersonic Waverider is an experimental aircraft design that uses its own shockwave to generate lift. Operating at hypersonic speeds (Mach 5+), the hull is uniquely shaped to trap the high-pressure air wave underneath it, a principle known as compression lift. This model features a sleek wedge fuselage, high-temperature leading edges, scramjet inlets, and a visual representation of the plasma shockwave it rides.";

    const quizQuestions = [
        {
            question: "What is the primary function of a waverider's unique hull shape?",
            options: [
                "To reduce radar cross-section",
                "To trap the bow shockwave underneath it for compression lift",
                "To carry maximum fuel payload",
                "To act as a large heat sink"
            ],
            correct: 1,
            explanation: "A waverider gets its name from 'riding' its own shockwave. The wedge shape traps the high-pressure shockwave underneath the vehicle, providing significant lift, known as compression lift.",
            difficulty: "Medium"
        },
        {
            question: "Why do the leading edges glow or require special materials in hypersonic flight?",
            options: [
                "They generate electricity for the ship",
                "Friction from the air causes extreme kinetic heating",
                "They are exhaust vents for the engine",
                "To help with visual tracking from the ground"
            ],
            correct: 1,
            explanation: "At hypersonic speeds, the friction and compression of air molecules create immense heat, enough to turn the surrounding air into plasma. Leading edges must be made of high-temperature ablative or carbon-carbon composite materials to survive.",
            difficulty: "Easy"
        },
        {
            question: "Where are the engine inlets typically placed on a waverider?",
            options: [
                "On the top to avoid heat",
                "On the wings to maximize air flow",
                "On the underbelly to ingest the high-pressure shockwave air",
                "At the very tip of the nose"
            ],
            correct: 2,
            explanation: "Scramjet inlets are strategically placed on the underbelly so they can directly intake the highly compressed, supersonic air generated by the bow shock, making the engine much more efficient.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the shockwave to pulse and slide to simulate hypersonic flow
        const shockwave = meshes.find(m => m.name === "Compression Lift Shockwave (Visual Effect)");
        if (shockwave && shockwave.mesh) {
            shockwave.mesh.scale.set(
                1 + Math.sin(time * speed * 5) * 0.05,
                1,
                1 + Math.cos(time * speed * 5) * 0.05
            );
            shockwave.mesh.material.opacity = 0.3 + Math.sin(time * speed * 10) * 0.1;
        }

        // Animate leading edges glowing
        const edges = meshes.find(m => m.name === "High-Temperature Leading Edges");
        if (edges && edges.mesh) {
            edges.mesh.children.forEach(edge => {
                edge.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 3) * 0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createWaveriderHull() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
