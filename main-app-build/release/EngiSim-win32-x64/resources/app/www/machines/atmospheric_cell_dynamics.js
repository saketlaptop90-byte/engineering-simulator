import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech/neon materials for visual flair
    const glowMaterialRed = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    const glowMaterialBlue = new THREE.MeshStandardMaterial({
        color: 0x3333ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    const glowMaterialGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    // We can also incorporate the imported materials onto the base components
    const earthCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x111133,
        roughness: 0.5,
        metalness: 0.8,
        wireframe: true
    });

    const meshes = {};

    // 1. Earth Core (Holographic projection)
    const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
    const earthMesh = new THREE.Mesh(earthGeometry, earthCoreMaterial);
    earthMesh.position.set(0, 0, 0);
    group.add(earthMesh);
    meshes['earth'] = earthMesh;
    
    parts.push({
        name: "Earth Core (Holographic)",
        description: "The planetary body driving atmospheric circulation via solar heating and rotation.",
        material: "Earth Hologram Material",
        function: "Base surface for the atmospheric cells.",
        assemblyOrder: 1,
        connections: ["Equator Heating Zone", "Polar Cooling Zone"],
        failureEffect: "Loss of gravitational and thermal base.",
        cascadeFailures: ["Complete system collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Hadley Cell
    const hadleyGeometry = new THREE.TorusGeometry(12, 1.5, 16, 100, Math.PI);
    const hadleyMesh = new THREE.Mesh(hadleyGeometry, glowMaterialRed);
    hadleyMesh.rotation.x = Math.PI / 2;
    hadleyMesh.position.set(0, 0, 0);
    group.add(hadleyMesh);
    meshes['hadley'] = hadleyMesh;
    
    parts.push({
        name: "Hadley Cell",
        description: "Low-latitude overturning circulation with air rising at the equator and sinking at 30° latitude.",
        material: "Neon Red Energy Flow",
        function: "Transports heat from the equator towards higher latitudes.",
        assemblyOrder: 2,
        connections: ["Earth Core", "Ferrel Cell"],
        failureEffect: "Disruption of trade winds and extreme equatorial overheating.",
        cascadeFailures: ["Ferrel Cell stabilization failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 3. Ferrel Cell
    const ferrelGeometry = new THREE.TorusGeometry(10.5, 1.2, 16, 100, Math.PI / 2);
    const ferrelMeshN = new THREE.Mesh(ferrelGeometry, glowMaterialGreen);
    ferrelMeshN.rotation.x = Math.PI / 2;
    ferrelMeshN.rotation.z = Math.PI / 4;
    ferrelMeshN.position.set(0, 4.5, 0);
    group.add(ferrelMeshN);
    meshes['ferrelN'] = ferrelMeshN;
    
    parts.push({
        name: "Ferrel Cell",
        description: "Mid-latitude circulation, acts as a gear between Hadley and Polar cells.",
        material: "Neon Green Energy Flow",
        function: "Transports heat from mid-latitudes to polar regions.",
        assemblyOrder: 3,
        connections: ["Hadley Cell", "Polar Cell"],
        failureEffect: "Extreme temperature gradients across mid-latitudes.",
        cascadeFailures: ["Polar cell isolation", "Jet stream collapse"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // 4. Polar Cell
    const polarGeometry = new THREE.TorusGeometry(8, 1, 16, 100, Math.PI / 4);
    const polarMeshN = new THREE.Mesh(polarGeometry, glowMaterialBlue);
    polarMeshN.rotation.x = Math.PI / 2;
    polarMeshN.rotation.z = Math.PI / 2 - Math.PI / 8;
    polarMeshN.position.set(0, 8, 0);
    group.add(polarMeshN);
    meshes['polarN'] = polarMeshN;

    parts.push({
        name: "Polar Cell",
        description: "High-latitude circulation with cold air sinking at poles and rising at 60° latitude.",
        material: "Neon Blue Energy Flow",
        function: "Cooling system of the Earth, distributing frigid polar air.",
        assemblyOrder: 4,
        connections: ["Ferrel Cell", "Earth Core"],
        failureEffect: "Runaway polar melting and circulation stall.",
        cascadeFailures: ["Global thermohaline circulation shutdown"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });
    
    // Add particle system to simulate Coriolis wind
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const windParticles = new THREE.Points(particleGeo, particleMat);
    group.add(windParticles);
    meshes['wind'] = windParticles;

    const description = "A high-tech 3D model of Earth's atmospheric circulation cells: Hadley, Ferrel, and Polar. These large-scale cells drive global wind patterns, heat transport, and climate zones.";

    const quizQuestions = [
        {
            question: "Which cell is responsible for the trade winds and spans from the equator to 30° latitude?",
            options: ["Ferrel Cell", "Hadley Cell", "Polar Cell", "Equatorial Cell"],
            correct: 1,
            explanation: "The Hadley Cell operates between the equator and 30° latitude, characterized by rising warm air at the equator and sinking cooler air at 30°.",
            difficulty: "Medium"
        },
        {
            question: "What acts as a 'gear' between the Hadley and Polar cells?",
            options: ["Polar vortex", "Ferrel Cell", "Jet stream", "Coriolis force"],
            correct: 1,
            explanation: "The Ferrel Cell is mechanically driven by the Hadley and Polar cells, operating between 30° and 60° latitude.",
            difficulty: "Hard"
        },
        {
            question: "Why does air sink at the poles in the Polar Cell?",
            options: ["It is dense and cold", "It is light and warm", "It is pushed by the Ferrel Cell", "Due to the lack of Coriolis effect"],
            correct: 0,
            explanation: "Extremely cold temperatures at the poles cause the air to become dense and sink, creating high-pressure systems.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, exploded) {
        const explodeFactor = exploded ? 1 : 0;
        
        // Lerp positions for exploded view
        meshes['earth'].position.y = THREE.MathUtils.lerp(meshes['earth'].position.y, parts[0].originalPosition.y + (parts[0].explodedPosition.y - parts[0].originalPosition.y) * explodeFactor, 0.05);
        meshes['hadley'].position.y = THREE.MathUtils.lerp(meshes['hadley'].position.y, parts[1].originalPosition.y + (parts[1].explodedPosition.y - parts[1].originalPosition.y) * explodeFactor, 0.05);
        meshes['ferrelN'].position.y = THREE.MathUtils.lerp(meshes['ferrelN'].position.y, parts[2].originalPosition.y + (parts[2].explodedPosition.y - parts[2].originalPosition.y) * explodeFactor, 0.05);
        meshes['polarN'].position.y = THREE.MathUtils.lerp(meshes['polarN'].position.y, parts[3].originalPosition.y + (parts[3].explodedPosition.y - parts[3].originalPosition.y) * explodeFactor, 0.05);
        
        // Rotations
        meshes['earth'].rotation.y += 0.005 * speed;
        meshes['hadley'].rotation.z += 0.01 * speed;
        meshes['ferrelN'].rotation.z -= 0.008 * speed; // Counter-rotating due to gear effect
        meshes['polarN'].rotation.z += 0.012 * speed;
        
        // Animate particles
        const positions = meshes['wind'].geometry.attributes.position.array;
        for(let i=0; i < particleCount; i++) {
            // Move up and swirl to represent complex coriolis currents
            positions[i*3 + 1] += 0.05 * speed; 
            if (positions[i*3 + 1] > 15) {
                positions[i*3 + 1] = -15;
            }
            positions[i*3] += Math.sin(time * 0.001 + positions[i*3+1]) * 0.02 * speed;
            positions[i*3+2] += Math.cos(time * 0.001 + positions[i*3+1]) * 0.02 * speed;
        }
        meshes['wind'].geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAtmosphericCellDynamics() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
