import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingGas = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc, emissive: 0x00aa88, emissiveIntensity: 1,
        transparent: true, opacity: 0.6
    });

    const liquidMat = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff, transparent: true, opacity: 0.8, roughness: 0.1
    });

    const towerGeo = new THREE.CylinderGeometry(2, 2, 12, 32);
    const towerMesh = new THREE.Mesh(towerGeo, glass);
    towerMesh.position.set(0, 6, 0);
    group.add(towerMesh);
    parts.push({
        name: "Absorption Column Tower",
        description: "Tall glass/steel cylinder.",
        material: "Glass",
        function: "Houses the counter-current flow of gas and liquid.",
        assemblyOrder: 1,
        connections: ["Packing Material", "Gas Inlet", "Solvent Inlet"],
        failureEffect: "Structural rupture.",
        cascadeFailures: ["Toxic gas leak"],
        originalPosition: {x:0, y:6, z:0},
        explodedPosition: {x:0, y:6, z:-10}
    });

    const packingGeo = new THREE.CylinderGeometry(1.9, 1.9, 8, 32);
    const packingMesh = new THREE.Mesh(packingGeo, chrome);
    packingMesh.position.set(0, 6, 0);
    // Add wireframe to simulate packing media like Raschig rings
    packingMesh.material.wireframe = true;
    group.add(packingMesh);
    parts.push({
        name: "Structured Packing Media",
        description: "High surface area metallic mesh or rings.",
        material: "Chrome / Mesh",
        function: "Maximizes contact area between rising gas and falling liquid.",
        assemblyOrder: 2,
        connections: ["Tower"],
        failureEffect: "Channeling (fluid bypassing packing).",
        cascadeFailures: ["Poor absorption efficiency"],
        originalPosition: {x:0, y:6, z:0},
        explodedPosition: {x:5, y:6, z:0}
    });

    const gasGeo = new THREE.CylinderGeometry(1.8, 1.8, 2, 32);
    const gasMesh = new THREE.Mesh(gasGeo, glowingGas);
    gasMesh.position.set(0, 2, 0);
    group.add(gasMesh);
    parts.push({
        name: "Raw Gas Mixture",
        description: "Glowing target gas rising from the bottom.",
        material: "Glowing Gas",
        function: "Flows upward to be stripped of specific components.",
        assemblyOrder: 3,
        connections: ["Packing Media"],
        failureEffect: "Excessive pressure.",
        cascadeFailures: ["Flooding the column"],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:-5, y:2, z:0}
    });

    const liquidGeo = new THREE.CylinderGeometry(1.8, 1.8, 2, 32);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(0, 10, 0);
    group.add(liquidMesh);
    parts.push({
        name: "Solvent (Absorbent)",
        description: "Liquid falling from the top.",
        material: "Liquid Solvent",
        function: "Chemically or physically absorbs the target gas component.",
        assemblyOrder: 4,
        connections: ["Packing Media"],
        failureEffect: "Solvent saturation.",
        cascadeFailures: ["Gas emission breakthrough"],
        originalPosition: {x:0, y:10, z:0},
        explodedPosition: {x:5, y:10, z:0}
    });

    const description = "Chemical Absorption Column: A mass transfer tower where a rising gas mixture is forced into intimate contact with a falling liquid solvent over high-surface-area packing material, scrubbing specific chemical components out of the gas stream.";

    const quizQuestions = [
        {
            question: "Why is an absorption column typically packed with complex shapes like 'Raschig rings'?",
            options: ["To maximize the surface area for gas-liquid contact", "To filter out solid dust particles", "To cool down the gas", "To look cool"],
            correct: 0,
            explanation: "High surface area packing spreads the falling liquid into thin films, allowing maximum interaction and mass transfer with the rising gas.",
            difficulty: "Medium"
        },
        {
            question: "What is 'counter-current flow' in an absorption column?",
            options: ["Gas flows up while liquid flows down", "Gas and liquid flow in the same direction", "Fluids flow horizontally across the column", "The column itself rotates"],
            correct: 0,
            explanation: "Counter-current flow (gas up, liquid down) provides the highest concentration gradient across the entire column, maximizing absorption efficiency.",
            difficulty: "Easy"
        },
        {
            question: "What is 'flooding' in a packed column?",
            options: ["When gas velocity is so high it prevents liquid from flowing down, causing liquid to fill the column", "When too much water is added by mistake", "When the column sinks into the ground", "When the pump breaks"],
            correct: 0,
            explanation: "Flooding occurs when the upward kinetic energy of the gas exceeds the downward gravitational pull on the liquid, causing the column to fill with liquid and choke the gas flow.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Move gas up
        if (meshes[2]) {
            meshes[2].position.y = 2 + ((time * speed * 2) % 8);
            meshes[2].scale.y = 1 + Math.sin(time*speed)*0.2;
        }
        // Move liquid down
        if (meshes[3]) {
            meshes[3].position.y = 10 - ((time * speed * 2.5) % 8);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAbsorptionColumn() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
