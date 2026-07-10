import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const sunGlow = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xff8c00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const co2Glow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ccff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        metalness: 0.2,
        roughness: 0.1
    });

    const fuelGlow = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 2.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const plasmaFluid = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    // Parts definitions
    // 1. Main Housing / Core Frame
    const frameGeometry = new THREE.CylinderGeometry(5, 5, 12, 8, 1, false);
    const frameMesh = new THREE.Mesh(frameGeometry, darkSteel);
    frameMesh.position.set(0, 6, 0);
    group.add(frameMesh);
    parts.push({
        name: "Hexagonal Core Frame",
        description: "The primary structural housing for the photosynthetic arrays.",
        material: "Dark Steel",
        function: "Provides structural integrity and houses the internal reaction chambers.",
        assemblyOrder: 1,
        connections: ["Solar Collector Array", "Gas Intake Vents"],
        failureEffect: "Structural instability leading to misalignment of solar collectors.",
        cascadeFailures: ["Solar Collector Array", "Reaction Chamber"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: frameMesh
    });

    // 2. Solar Collector Array (Leaves)
    const leafGeometry = new THREE.ConeGeometry(8, 2, 6, 1, true);
    const leafMesh = new THREE.Mesh(leafGeometry, sunGlow);
    leafMesh.position.set(0, 13, 0);
    leafMesh.rotation.x = Math.PI;
    group.add(leafMesh);
    parts.push({
        name: "Solar Collector Array",
        description: "Nanostructured light-harvesting 'leaves' that capture and funnel photons.",
        material: "SunGlow Photonic Metamaterial",
        function: "Captures solar energy to drive the artificial photosynthetic reaction.",
        assemblyOrder: 2,
        connections: ["Hexagonal Core Frame", "Reaction Chamber"],
        failureEffect: "Loss of energy input, halting the conversion process.",
        cascadeFailures: ["Reaction Chamber"],
        originalPosition: { x: 0, y: 13, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 },
        mesh: leafMesh
    });

    // 3. CO2 Gas Intake Vents
    const ventGeometry = new THREE.TorusGeometry(5.5, 0.5, 16, 100);
    const ventMesh = new THREE.Mesh(ventGeometry, chrome);
    ventMesh.position.set(0, 8, 0);
    ventMesh.rotation.x = Math.PI / 2;
    group.add(ventMesh);
    parts.push({
        name: "CO2 Gas Intake Vents",
        description: "High-flow intake ring for Direct Air Capture of atmospheric CO2.",
        material: "Chrome",
        function: "Draws in ambient air and filters out pure CO2 for the reaction.",
        assemblyOrder: 3,
        connections: ["Hexagonal Core Frame", "CO2 Concentrator"],
        failureEffect: "Reduced CO2 intake, causing reaction starvation.",
        cascadeFailures: ["Reaction Chamber"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 15 },
        mesh: ventMesh
    });

    // 4. CO2 Concentrator Ring
    const concentratorGeometry = new THREE.TorusGeometry(4.5, 0.8, 16, 100);
    const concentratorMesh = new THREE.Mesh(concentratorGeometry, co2Glow);
    concentratorMesh.position.set(0, 6, 0);
    concentratorMesh.rotation.x = Math.PI / 2;
    group.add(concentratorMesh);
    parts.push({
        name: "CO2 Concentrator Ring",
        description: "Pressurizes and concentrates CO2 gas before injecting it into the reaction chamber.",
        material: "Cyan Neon Pulse",
        function: "Maintains optimal CO2 pressure for efficient syngas production.",
        assemblyOrder: 4,
        connections: ["CO2 Gas Intake Vents", "Reaction Chamber"],
        failureEffect: "Low reaction pressure resulting in inefficient fuel synthesis.",
        cascadeFailures: ["Fuel Synthesis Matrix"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 6, z: -15 },
        mesh: concentratorMesh
    });

    // 5. Reaction Chamber
    const chamberGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const chamberMesh = new THREE.Mesh(chamberGeometry, plasmaFluid);
    chamberMesh.position.set(0, 6, 0);
    group.add(chamberMesh);
    parts.push({
        name: "Reaction Chamber Core",
        description: "The heart of the reactor where photons split water and reduce CO2.",
        material: "Plasma Fluid",
        function: "Houses the catalytic environment for artificial photosynthesis.",
        assemblyOrder: 5,
        connections: ["Solar Collector Array", "CO2 Concentrator Ring", "Fuel Synthesis Matrix"],
        failureEffect: "Total systemic failure; no conversion takes place.",
        cascadeFailures: ["Fuel Output Manifold"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: -15, y: 6, z: 0 },
        mesh: chamberMesh
    });

    // 6. Fuel Synthesis Matrix
    const matrixGeometry = new THREE.IcosahedronGeometry(2, 0);
    const matrixMesh = new THREE.Mesh(matrixGeometry, fuelGlow);
    matrixMesh.position.set(0, 2, 0);
    group.add(matrixMesh);
    parts.push({
        name: "Fuel Synthesis Matrix",
        description: "Catalytic grid that bonds carbon and hydrogen into synthetic liquid fuels.",
        material: "Magenta Neon Core",
        function: "Finalizes the chemical transformation into stable, energetic synthetic fuel.",
        assemblyOrder: 6,
        connections: ["Reaction Chamber Core", "Fuel Output Manifold"],
        failureEffect: "Production of unwanted byproducts instead of clean fuel.",
        cascadeFailures: ["Fuel Output Manifold"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 15, y: 2, z: 0 },
        mesh: matrixMesh
    });

    // 7. Fuel Output Manifold
    const outputGeometry = new THREE.CylinderGeometry(1, 2, 4, 16);
    const outputMesh = new THREE.Mesh(outputGeometry, copper);
    outputMesh.position.set(0, -2, 0);
    group.add(outputMesh);
    parts.push({
        name: "Fuel Output Manifold",
        description: "Collects and dispenses the synthesized liquid fuel.",
        material: "Copper",
        function: "Safely extracts the highly energetic synthetic fuel from the reactor.",
        assemblyOrder: 7,
        connections: ["Fuel Synthesis Matrix"],
        failureEffect: "Fuel backup or leakage, highly dangerous.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: outputMesh
    });

    // Particle system for glowing fuel droplets
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 2; // initial random spread
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xff00aa,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particleMesh = new THREE.Points(particlesGeo, particleMaterial);
    particleMesh.position.set(0, -4, 0);
    group.add(particleMesh);


    const description = "The Artificial Photosynthetic Leaf Reactor is an advanced Direct Air Capture system that mimics plant biology to pull CO2 from the atmosphere and combine it with water and sunlight to produce clean, energy-dense synthetic fuels.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Solar Collector Array in this reactor?",
            options: ["To cool down the reactor core", "To capture photons for the photosynthetic reaction", "To filter out nitrogen from the air", "To store synthesized fuel"],
            correct: 1,
            explanation: "Like real leaves, the Solar Collector Array captures sunlight (photons) to provide the energy needed to drive the chemical reactions.",
            difficulty: "Easy"
        },
        {
            question: "What is the critical input gas captured by the Intake Vents for this process?",
            options: ["Oxygen (O2)", "Methane (CH4)", "Carbon Dioxide (CO2)", "Hydrogen (H2)"],
            correct: 2,
            explanation: "The Artificial Leaf Reactor utilizes Direct Air Capture to pull Carbon Dioxide (CO2) from the atmosphere, which serves as the carbon source for the synthetic fuel.",
            difficulty: "Medium"
        },
        {
            question: "In the context of the Fuel Synthesis Matrix, what occurs if the Reaction Chamber fails?",
            options: ["The matrix produces cleaner fuel", "The process halts entirely, causing a cascade failure", "The matrix substitutes CO2 with Nitrogen", "The core overheats instantly"],
            correct: 1,
            explanation: "The Reaction Chamber splits water and prepares the CO2. If it fails, the Fuel Synthesis Matrix receives no raw materials, halting the entire conversion cascade.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate Solar Collector
        const leaf = meshes.find(p => p.name === "Solar Collector Array").mesh;
        if (leaf) leaf.rotation.y = time * speed * 0.5;

        // Pulse CO2 Concentrator
        const concentrator = meshes.find(p => p.name === "CO2 Concentrator Ring").mesh;
        if (concentrator) {
            const scale = 1 + Math.sin(time * speed * 2) * 0.05;
            concentrator.scale.set(scale, scale, scale);
            concentrator.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 4) * 0.5;
        }

        // Rotate and throb Reaction Chamber
        const chamber = meshes.find(p => p.name === "Reaction Chamber Core").mesh;
        if (chamber) {
            chamber.rotation.y = -time * speed;
            chamber.rotation.z = Math.sin(time * speed) * 0.2;
        }

        // Spin Fuel Synthesis Matrix rapidly
        const matrix = meshes.find(p => p.name === "Fuel Synthesis Matrix").mesh;
        if (matrix) {
            matrix.rotation.x = time * speed * 2;
            matrix.rotation.y = time * speed * 3;
            matrix.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 8) * 0.5;
        }

        // Animate particles (fuel drops falling)
        const positions = particleMesh.geometry.attributes.position.array;
        for(let i = 1; i < particlesCount * 3; i += 3) {
            positions[i] -= speed * 0.05; // fall down y axis
            if(positions[i] < -5) {
                positions[i] = 0; // reset to top of output
                positions[i-1] = (Math.random() - 0.5) * 1.5; // randomize x
                positions[i+1] = (Math.random() - 0.5) * 1.5; // randomize z
            }
        }
        particleMesh.geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArtificialPhotosyntheticLeafReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
