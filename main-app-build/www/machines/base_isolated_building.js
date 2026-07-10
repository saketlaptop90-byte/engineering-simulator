import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8
    });

    const foundationMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0.1
    });

    // 1. Ground/Bedrock
    const groundGeometry = new THREE.BoxGeometry(20, 2, 20);
    const ground = new THREE.Mesh(groundGeometry, foundationMaterial);
    ground.position.set(0, -1, 0);
    group.add(ground);
    meshes.ground = ground;

    parts.push({
        name: "Bedrock Foundation",
        description: "The solid ground which experiences the full force of seismic waves.",
        material: "foundationMaterial",
        function: "Transmits seismic energy to the structure.",
        assemblyOrder: 1,
        connections: ["Isolators"],
        failureEffect: "Ground liquefaction or complete collapse.",
        cascadeFailures: ["Complete structure failure"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Base Isolators (Lead Rubber Bearings)
    const isolatorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const isolatorPositions = [
        [-5, 0.5, -5],
        [5, 0.5, -5],
        [-5, 0.5, 5],
        [5, 0.5, 5],
        [0, 0.5, 0]
    ];
    
    meshes.isolators = [];

    isolatorPositions.forEach((pos, index) => {
        const isolator = new THREE.Mesh(isolatorGeometry, rubber);
        isolator.position.set(...pos);
        isolator.userData.origX = pos[0];
        isolator.userData.origZ = pos[2];
        
        // Add lead core indicator
        const coreGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.01, 16);
        const core = new THREE.Mesh(coreGeo, chrome);
        isolator.add(core);

        group.add(isolator);
        meshes.isolators.push(isolator);

        parts.push({
            name: `Base Isolator LRB-${index + 1}`,
            description: "Lead Rubber Bearing. Layers of rubber and steel with a central lead core.",
            material: "Rubber / Chrome",
            function: "Decouples the building from ground motion while damping energy.",
            assemblyOrder: 2,
            connections: ["Bedrock Foundation", "Base Slab"],
            failureEffect: "Excessive displacement causing bearing rupture.",
            cascadeFailures: ["Building impact with moat wall", "Structural yield"],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] * 1.5, y: 0.5, z: pos[2] * 1.5 }
        });
    });

    // 3. Base Slab
    const slabGeometry = new THREE.BoxGeometry(14, 0.5, 14);
    const baseSlab = new THREE.Mesh(slabGeometry, steel);
    baseSlab.position.set(0, 1.25, 0);
    group.add(baseSlab);
    meshes.baseSlab = baseSlab;

    parts.push({
        name: "Isolation Base Slab",
        description: "Rigid platform resting on the isolators.",
        material: "Steel",
        function: "Provides a uniform base for the superstructure to move as a single unit.",
        assemblyOrder: 3,
        connections: ["Isolators", "Superstructure Columns"],
        failureEffect: "Differential settling and structural cracking.",
        cascadeFailures: ["Column buckling"],
        originalPosition: { x: 0, y: 1.25, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 4. Superstructure (Floors and Columns)
    meshes.floors = [];
    meshes.columns = [];
    const numFloors = 5;
    const floorHeight = 3;

    for (let i = 0; i < numFloors; i++) {
        // Floor slab
        const floorGeo = new THREE.BoxGeometry(12, 0.4, 12);
        const floor = new THREE.Mesh(floorGeo, darkSteel);
        const yPos = 1.25 + 0.2 + floorHeight * (i + 1);
        floor.position.set(0, yPos, 0);
        
        // Add neon edge
        const edgeGeo = new THREE.BoxGeometry(12.2, 0.1, 12.2);
        const edge = new THREE.Mesh(edgeGeo, neonBlue);
        floor.add(edge);

        group.add(floor);
        meshes.floors.push(floor);

        parts.push({
            name: `Floor Slab ${i + 1}`,
            description: `Structural floor ${i + 1} of the superstructure.`,
            material: "Dark Steel / Neon Blue",
            function: "Supports building loads and provides diaphragm action.",
            assemblyOrder: 4 + i * 2,
            connections: ["Columns"],
            failureEffect: "Floor collapse.",
            cascadeFailures: ["Pancake collapse of lower floors"],
            originalPosition: { x: 0, y: yPos, z: 0 },
            explodedPosition: { x: 0, y: yPos + (i + 1) * 2, z: 0 }
        });

        // Columns
        const colGeo = new THREE.BoxGeometry(0.6, floorHeight, 0.6);
        const colPositions = [
            [-5.5, yPos - floorHeight/2, -5.5],
            [5.5, yPos - floorHeight/2, -5.5],
            [-5.5, yPos - floorHeight/2, 5.5],
            [5.5, yPos - floorHeight/2, 5.5],
            [-2, yPos - floorHeight/2, -2],
            [2, yPos - floorHeight/2, 2]
        ];

        colPositions.forEach((pos, colIdx) => {
            const col = new THREE.Mesh(colGeo, aluminum);
            col.position.set(...pos);
            col.userData.origX = pos[0];
            col.userData.origZ = pos[2];
            group.add(col);
            meshes.columns.push({mesh: col, floorIndex: i});

            if (colIdx === 0) {
                parts.push({
                    name: `Columns Level ${i + 1}`,
                    description: "Vertical load-bearing elements.",
                    material: "Aluminum",
                    function: "Transfers vertical loads and resists inter-story drift.",
                    assemblyOrder: 4 + i * 2 + 1,
                    connections: ["Floor Slabs"],
                    failureEffect: "Soft-story mechanism.",
                    cascadeFailures: ["Total collapse"],
                    originalPosition: { x: 0, y: pos[1], z: 0 },
                    explodedPosition: { x: 0, y: pos[1] + (i + 1) * 2, z: 0 }
                });
            }
        });
    }

    // 5. Seismic Wave Visualizer
    const waveGeo = new THREE.TorusGeometry(8, 0.2, 16, 100);
    const wave = new THREE.Mesh(waveGeo, neonOrange);
    wave.rotation.x = Math.PI / 2;
    wave.position.y = -0.5;
    group.add(wave);
    meshes.wave = wave;

    const description = "A high-tech visualization of a Base Isolated Building. Unlike fixed-base structures that amplify ground shaking, base-isolated buildings rest on flexible bearings (like Lead Rubber Bearings). These isolators decouple the building from ground motion, significantly reducing the seismic forces entering the superstructure.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of base isolation in a building?",
            options: [
                "To make the building heavier",
                "To decouple the building from ground motion",
                "To firmly anchor the building to the bedrock",
                "To increase the stiffness of the structure"
            ],
            correct: 1,
            explanation: "Base isolation decouples the building from ground shaking, allowing the ground to move beneath the building while the structure remains relatively stationary.",
            difficulty: "easy"
        },
        {
            question: "What role does the lead core play in a Lead Rubber Bearing (LRB)?",
            options: [
                "It provides vertical load capacity",
                "It prevents rust",
                "It provides energy dissipation (damping) through plastic deformation",
                "It makes the bearing more flexible"
            ],
            correct: 2,
            explanation: "The rubber provides flexibility to increase the structural period, while the lead core deforms plastically during an earthquake, dissipating energy (damping) and reducing displacements.",
            difficulty: "medium"
        },
        {
            question: "Compared to a traditional fixed-base building, how does a base-isolated building move during an earthquake?",
            options: [
                "It undergoes large inter-story drifts (floors moving relative to each other)",
                "It acts essentially as a rigid block with most displacement occurring at the isolators",
                "It vibrates at a much higher frequency",
                "It experiences much higher floor accelerations"
            ],
            correct: 1,
            explanation: "Because the isolators are much more flexible than the superstructure above, the building moves almost uniformly as a rigid body, concentrating the displacement at the isolation level and reducing inter-story drifts.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed) {
        const t = time * speed;
        
        // Simulate earthquake (ground motion)
        const groundX = Math.sin(t * 5) * 1.5 * Math.sin(t * 1.2); 
        const groundZ = Math.cos(t * 4.3) * 1.0 * Math.sin(t * 0.8);
        
        meshes.ground.position.x = groundX;
        meshes.ground.position.z = groundZ;
        
        // Wave expansion
        meshes.wave.position.x = groundX;
        meshes.wave.position.z = groundZ;
        meshes.wave.scale.setScalar(1 + (t % 2) * 2);
        meshes.wave.material.opacity = Math.max(0, 1 - (t % 2));

        // Superstructure motion (highly damped, longer period)
        // Building moves much less than the ground
        const bldgX = groundX * 0.15; 
        const bldgZ = groundZ * 0.15;

        meshes.baseSlab.position.x = bldgX;
        meshes.baseSlab.position.z = bldgZ;

        meshes.floors.forEach((floor, idx) => {
            // Slight inter-story drift
            const driftX = bldgX + Math.sin(t * 3 - idx * 0.1) * 0.05 * idx;
            const driftZ = bldgZ + Math.cos(t * 3 - idx * 0.1) * 0.05 * idx;
            floor.position.x = driftX;
            floor.position.z = driftZ;
        });

        meshes.columns.forEach((colData) => {
            const floorIdx = colData.floorIndex;
            const driftX = bldgX + Math.sin(t * 3 - floorIdx * 0.1) * 0.05 * floorIdx;
            const driftZ = bldgZ + Math.cos(t * 3 - floorIdx * 0.1) * 0.05 * floorIdx;
            colData.mesh.position.x = colData.mesh.userData.origX + driftX;
            colData.mesh.position.z = colData.mesh.userData.origZ + driftZ;
        });

        // Isolators shear deformation
        meshes.isolators.forEach(iso => {
            // Midpoint between ground movement and building movement
            iso.position.x = iso.userData.origX + (groundX + bldgX) / 2;
            iso.position.z = iso.userData.origZ + (groundZ + bldgZ) / 2;
            
            // Shear approximation
            iso.rotation.z = (groundX - bldgX) * 0.6;
            iso.rotation.x = -(groundZ - bldgZ) * 0.6;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBaseIsolatedBuilding() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
