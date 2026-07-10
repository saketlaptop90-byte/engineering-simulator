import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const algaeGlow = new THREE.MeshStandardMaterial({
        color: 0x39ff14,
        emissive: 0x11aa00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonPlastic = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088cc,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.2
    });

    const uvLightMat = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.5,
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, 0.25, 0);
    group.add(base);
    parts.push({
        name: "Base Platform",
        description: "Heavy steel platform anchoring the reactor.",
        material: "darkSteel",
        function: "Provides structural stability and houses main power relays.",
        assemblyOrder: 1,
        connections: ["Algae Cultivation Vat", "Extruder Base"],
        failureEffect: "Structural instability leading to vibrations.",
        cascadeFailures: ["Ruptured Pipes", "Misaligned Extruder"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: base
    });

    // 2. Algae Cultivation Vat (Central Tank)
    const vatGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const vat = new THREE.Mesh(vatGeo, glass);
    vat.position.set(0, 3.5, 0);
    group.add(vat);
    parts.push({
        name: "Cultivation Vat",
        description: "High-pressure glass chamber for rapid algae growth.",
        material: "glass",
        function: "Maintains optimal conditions (light, temp, nutrients) for bio-synthesis.",
        assemblyOrder: 2,
        connections: ["Base Platform", "UV Growth Arrays", "Extraction Pump"],
        failureEffect: "Contamination of algae culture.",
        cascadeFailures: ["Halted Production", "Bio-hazard Alert"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 4 },
        mesh: vat
    });

    // 3. Glowing Algae Biomass (Inside Vat)
    const algaeGeo = new THREE.CylinderGeometry(1.9, 1.9, 5.5, 32);
    const algae = new THREE.Mesh(algaeGeo, algaeGlow);
    algae.position.set(0, 3.5, 0);
    group.add(algae);
    parts.push({
        name: "Algae Biomass",
        description: "Genetically modified algae synthesizing plastic precursors.",
        material: "algaeGlow",
        function: "Biological engine converting CO2 and light into biopolymers.",
        assemblyOrder: 3,
        connections: ["Cultivation Vat"],
        failureEffect: "Low yield.",
        cascadeFailures: ["Economic Loss"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: -4 },
        mesh: algae
    });

    // 4. UV Growth Arrays
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const uvGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const uvLight = new THREE.Mesh(uvGeo, uvLightMat);
        uvLight.position.set(Math.cos(angle) * 2.2, 3.5, Math.sin(angle) * 2.2);
        group.add(uvLight);
        parts.push({
            name: `UV Array ${i+1}`,
            description: "High-intensity photon emitters.",
            material: "uvLightMat",
            function: "Stimulates rapid photosynthesis and lipid production in algae.",
            assemblyOrder: 4 + i,
            connections: ["Cultivation Vat"],
            failureEffect: "Slowed algae growth.",
            cascadeFailures: ["Reduced Biopolymer Yield"],
            originalPosition: { x: uvLight.position.x, y: uvLight.position.y, z: uvLight.position.z },
            explodedPosition: { x: uvLight.position.x * 3, y: uvLight.position.y, z: uvLight.position.z * 3 },
            mesh: uvLight
        });
    }

    // 5. Extraction Pump
    const pumpGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const pump = new THREE.Mesh(pumpGeo, chrome);
    pump.position.set(2, 1.25, 0);
    group.add(pump);
    parts.push({
        name: "Centrifugal Extraction Pump",
        description: "High-speed centrifuge pump.",
        material: "chrome",
        function: "Separates biopolymers from the liquid algae broth.",
        assemblyOrder: 8,
        connections: ["Cultivation Vat", "Extruder Base"],
        failureEffect: "Clogged extraction lines.",
        cascadeFailures: ["Vat Over-pressurization"],
        originalPosition: { x: 2, y: 1.25, z: 0 },
        explodedPosition: { x: 5, y: 1.25, z: 0 },
        mesh: pump
    });

    // 6. Connecting Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2);
    const pipe = new THREE.Mesh(pipeGeo, copper);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(3, 1.25, 0);
    group.add(pipe);
    parts.push({
        name: "Transfer Conduit",
        description: "Copper piping for polymer transfer.",
        material: "copper",
        function: "Transfers raw biopolymer to the extruder.",
        assemblyOrder: 9,
        connections: ["Extraction Pump", "Extruder Array"],
        failureEffect: "Polymer leakage.",
        cascadeFailures: ["Pump Burnout"],
        originalPosition: { x: 3, y: 1.25, z: 0 },
        explodedPosition: { x: 6, y: 1.25, z: 0 },
        mesh: pipe
    });

    // 7. Extruder Array
    const extruderGeo = new THREE.CylinderGeometry(0.8, 0.5, 3, 16);
    const extruder = new THREE.Mesh(extruderGeo, steel);
    extruder.position.set(4, 2.5, 0);
    group.add(extruder);
    parts.push({
        name: "Thermal Extruder",
        description: "Precision thermal forming nozzle.",
        material: "steel",
        function: "Heats and shapes the raw polymer into continuous filaments.",
        assemblyOrder: 10,
        connections: ["Transfer Conduit", "Cooling Bath"],
        failureEffect: "Malformed filaments.",
        cascadeFailures: ["Jammed Production Line"],
        originalPosition: { x: 4, y: 2.5, z: 0 },
        explodedPosition: { x: 8, y: 2.5, z: 0 },
        mesh: extruder
    });

    // 8. Extruded Bioplastic Filaments
    const filamentGeo = new THREE.TorusGeometry(1, 0.1, 16, 100);
    const filament = new THREE.Mesh(filamentGeo, neonPlastic);
    filament.position.set(4, 4.5, 0);
    filament.rotation.x = Math.PI / 2;
    group.add(filament);
    parts.push({
        name: "Bioplastic Spool",
        description: "Finished neon bioplastic ready for use.",
        material: "neonPlastic",
        function: "Final product of the reactor.",
        assemblyOrder: 11,
        connections: ["Extruder Array"],
        failureEffect: "Tangled spool.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: 4.5, z: 0 },
        explodedPosition: { x: 8, y: 6, z: 0 },
        mesh: filament
    });

    // Grouping up
    const description = "The Algae Plastic Reactor is a state-of-the-art bio-manufacturing unit. It uses genetically modified algae to convert light and CO2 into high-grade, sustainable biopolymers, extruding them into glowing neon filaments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the UV Growth Arrays?",
            options: [
                "To heat the biopolymer",
                "To stimulate rapid photosynthesis in the algae",
                "To sterilize the output filaments",
                "To power the extraction pump"
            ],
            correct: 1,
            explanation: "The UV Arrays emit photons that drive photosynthesis, allowing the algae to rapidly produce the lipids/polymers needed for the plastic.",
            difficulty: "easy"
        },
        {
            question: "What component separates the raw biopolymers from the algae broth?",
            options: [
                "Cultivation Vat",
                "Thermal Extruder",
                "Centrifugal Extraction Pump",
                "Transfer Conduit"
            ],
            correct: 2,
            explanation: "The centrifugal force in the extraction pump separates the heavier polymer materials from the lighter liquid broth.",
            difficulty: "medium"
        },
        {
            question: "If the Transfer Conduit fails, what cascade failure is most likely?",
            options: [
                "Algae Mutation",
                "Pump Burnout",
                "UV Array Overload",
                "Extruder Freezing"
            ],
            correct: 1,
            explanation: "A blocked or leaking conduit causes backpressure or loss of flow, forcing the pump to overwork and eventually burn out.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes from the parts array by name for animation
        const algaeMesh = meshes.find(m => m.name === "Algae Biomass")?.mesh;
        const uv1 = meshes.find(m => m.name === "UV Array 1")?.mesh;
        const uv2 = meshes.find(m => m.name === "UV Array 2")?.mesh;
        const pumpMesh = meshes.find(m => m.name === "Centrifugal Extraction Pump")?.mesh;
        const spoolMesh = meshes.find(m => m.name === "Bioplastic Spool")?.mesh;

        if (algaeMesh) {
            // Pulsating glow effect
            algaeMesh.material.emissiveIntensity = 0.6 + Math.sin(time * speed * 2) * 0.4;
            // Slight rotation to simulate bubbling/movement
            algaeMesh.rotation.y = time * speed * 0.2;
        }

        if (uv1 && uv2) {
            // Flickering UV lights
            uv1.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
            uv2.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
        }

        if (pumpMesh) {
            // Rapid vibration/rotation
            pumpMesh.rotation.x = time * speed * 5;
        }

        if (spoolMesh) {
            // Spool winding
            spoolMesh.rotation.z -= speed * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAlgaeReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
