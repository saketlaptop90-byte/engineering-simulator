import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing material for energy absorption
    const energyGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const leadMaterial = new THREE.MeshStandardMaterial({
        color: 0x444455,
        metalness: 0.8,
        roughness: 0.4
    });

    // 1. Lower Mounting Plate (attached to foundation)
    const lowerPlateGeo = new THREE.BoxGeometry(4, 0.4, 4);
    const lowerPlate = new THREE.Mesh(lowerPlateGeo, steel);
    lowerPlate.position.set(0, 0.2, 0);
    group.add(lowerPlate);
    meshes.lowerPlate = lowerPlate;
    parts.push({
        name: "Lower Mounting Plate",
        description: "Secures the base isolation system to the building's foundation.",
        material: "Steel",
        function: "Transmits seismic forces from the foundation to the bearing.",
        assemblyOrder: 1,
        connections: ["Foundation", "Rubber Layers"],
        failureEffect: "Loss of bearing stability.",
        cascadeFailures: ["Complete system failure", "Building damage"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Laminated Rubber and Steel Layers
    // We will create multiple alternating layers
    const layerGroup = new THREE.Group();
    const numLayers = 10;
    const layerHeight = 0.15;
    const totalHeight = numLayers * layerHeight;
    const layerRadius = 1.5;
    
    meshes.rubberLayers = [];
    meshes.steelPlates = [];

    for (let i = 0; i < numLayers; i++) {
        // Steel Shim Plate
        const shimGeo = new THREE.CylinderGeometry(layerRadius, layerRadius, 0.05, 32);
        const shim = new THREE.Mesh(shimGeo, steel);
        shim.position.set(0, 0.4 + i * layerHeight + 0.025, 0);
        layerGroup.add(shim);
        meshes.steelPlates.push(shim);

        // Rubber Layer
        const rubberGeo = new THREE.CylinderGeometry(layerRadius, layerRadius, 0.1, 32);
        const rubberLayer = new THREE.Mesh(rubberGeo, rubber);
        rubberLayer.position.set(0, 0.4 + i * layerHeight + 0.1, 0);
        layerGroup.add(rubberLayer);
        meshes.rubberLayers.push(rubberLayer);
    }
    group.add(layerGroup);
    meshes.layerGroup = layerGroup;

    parts.push({
        name: "Laminated Rubber Bearings",
        description: "Alternating layers of rubber and steel shims.",
        material: "Rubber / Steel",
        function: "Provides horizontal flexibility to isolate the building from seismic ground motions.",
        assemblyOrder: 2,
        connections: ["Lower Mounting Plate", "Upper Mounting Plate"],
        failureEffect: "Loss of lateral flexibility or vertical load capacity.",
        cascadeFailures: ["Building resonance", "Structural damage"],
        originalPosition: { x: 0, y: 0.4 + totalHeight / 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 3. Central Lead Core
    const leadCoreGeo = new THREE.CylinderGeometry(0.4, 0.4, totalHeight, 32);
    const leadCore = new THREE.Mesh(leadCoreGeo, leadMaterial);
    leadCore.position.set(0, 0.4 + totalHeight / 2, 0);
    layerGroup.add(leadCore); // Add to layer group so it shears with it
    meshes.leadCore = leadCore;
    
    parts.push({
        name: "Central Lead Core",
        description: "A solid plug of lead inserted through the center of the bearing.",
        material: "Lead",
        function: "Deforms plastically under shear to absorb and dissipate seismic energy (damping).",
        assemblyOrder: 3,
        connections: ["Rubber Layers"],
        failureEffect: "Reduced energy dissipation capacity.",
        cascadeFailures: ["Excessive building displacement"],
        originalPosition: { x: 0, y: 0.4 + totalHeight / 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -4 }
    });

    // Glowing energy dissipation effect around lead core
    const energyGeo = new THREE.CylinderGeometry(0.45, 0.45, totalHeight * 0.9, 32);
    const energyMesh = new THREE.Mesh(energyGeo, energyGlow);
    energyMesh.position.set(0, 0.4 + totalHeight / 2, 0);
    layerGroup.add(energyMesh);
    meshes.energyMesh = energyMesh;

    // 4. Upper Mounting Plate (attached to building structure)
    const upperPlateGeo = new THREE.BoxGeometry(4, 0.4, 4);
    const upperPlate = new THREE.Mesh(upperPlateGeo, steel);
    upperPlate.position.set(0, 0.4 + totalHeight + 0.2, 0);
    group.add(upperPlate);
    meshes.upperPlate = upperPlate;
    parts.push({
        name: "Upper Mounting Plate",
        description: "Secures the building's superstructure to the base isolation system.",
        material: "Steel",
        function: "Transmits the building's vertical load onto the bearing.",
        assemblyOrder: 4,
        connections: ["Rubber Layers", "Superstructure"],
        failureEffect: "Disconnection from superstructure.",
        cascadeFailures: ["Complete system collapse"],
        originalPosition: { x: 0, y: 0.4 + totalHeight + 0.2, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });


    // Description of the machine
    const description = "A Lead Rubber Bearing (LRB) Base Isolation System is a high-tech structural element used to protect buildings from earthquakes. It consists of laminated layers of rubber and steel plates for horizontal flexibility and vertical load support, combined with a central lead core that dissipates seismic energy through plastic deformation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the alternating steel plates (shims) in a laminated rubber bearing?",
            options: [
                "To increase horizontal flexibility",
                "To prevent the rubber from bulging outwards under vertical load",
                "To conduct electricity through the building",
                "To dissipate heat generated by friction"
            ],
            correct: 1,
            explanation: "The steel plates provide vertical stiffness by confining the rubber layers and preventing them from bulging, allowing the bearing to support the massive weight of the building while remaining laterally flexible.",
            difficulty: "Medium"
        },
        {
            question: "How does the central lead core contribute to the isolation system?",
            options: [
                "It absorbs seismic energy through plastic deformation (damping).",
                "It makes the bearing lighter and easier to install.",
                "It prevents the rubber from degrading over time.",
                "It anchors the system to the bedrock."
            ],
            correct: 0,
            explanation: "Lead yields at relatively low stress. During an earthquake, it deforms plastically, absorbing a significant amount of kinetic energy and providing damping, which reduces the overall displacement of the building.",
            difficulty: "Hard"
        },
        {
            question: "What is the main purpose of base isolation in earthquake engineering?",
            options: [
                "To rigidly tie the building to the ground so it moves exactly with the earthquake.",
                "To make the building completely immune to all natural disasters.",
                "To decouple the building from the ground, significantly reducing the seismic forces transmitted to the structure.",
                "To strengthen the walls and columns of the building."
            ],
            correct: 2,
            explanation: "Base isolation decouples the building from the violent ground motions of an earthquake, allowing the ground to move beneath the building while the structure remains relatively stationary.",
            difficulty: "Easy"
        }
    ];

    let timeOffset = 0;

    const animate = (time, speed, meshesObj) => {
        timeOffset += speed * 0.05;
        
        // Simulate earthquake lateral movement (foundation moves, building stays relatively still)
        // Lower plate moves with the ground
        const groundDisplacement = Math.sin(timeOffset) * 1.5; 
        meshesObj.lowerPlate.position.x = groundDisplacement;
        
        // Upper plate stays mostly still, just slight movement
        const buildingDisplacement = groundDisplacement * 0.1;
        meshesObj.upperPlate.position.x = buildingDisplacement;

        // Shear deformation of the rubber layers and lead core
        // We will skew the layerGroup based on the relative displacement
        const relativeDisplacement = buildingDisplacement - groundDisplacement;
        
        // We can apply a shear matrix to the layerGroup or adjust the vertices/positions of individual layers
        // Adjusting positions of layers is easier and visually correct
        for (let i = 0; i < meshesObj.steelPlates.length; i++) {
            const factor = i / (meshesObj.steelPlates.length - 1); // 0 at bottom, 1 at top
            const layerDisplacement = groundDisplacement + (buildingDisplacement - groundDisplacement) * factor;
            meshesObj.steelPlates[i].position.x = layerDisplacement;
            meshesObj.rubberLayers[i].position.x = layerDisplacement;
        }

        const shearAmount = (buildingDisplacement - groundDisplacement) / totalHeight;
        const shearMatrix = new THREE.Matrix4().makeShear(shearAmount, 0, 0, 0, 0, 0);
        
        const resetMatrixAndApply = (mesh, yPos) => {
            mesh.matrix.identity();
            mesh.matrix.multiply(new THREE.Matrix4().makeTranslation(groundDisplacement, yPos, 0));
            mesh.matrix.multiply(shearMatrix);
            mesh.matrixAutoUpdate = false;
        };

        resetMatrixAndApply(meshesObj.leadCore, 0.4 + totalHeight / 2);
        resetMatrixAndApply(meshesObj.energyMesh, 0.4 + totalHeight / 2);

        // Pulse the energy glow intensity based on the speed of displacement (kinetic energy)
        const velocity = Math.abs(Math.cos(timeOffset) * 1.5);
        meshesObj.energyMesh.material.emissiveIntensity = 0.2 + velocity * 1.5;
        meshesObj.energyMesh.material.opacity = 0.4 + velocity * 0.5;
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBaseIsolationSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
