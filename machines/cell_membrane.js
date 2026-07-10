import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const lipidHeadMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
    });

    const lipidTailMaterial = new THREE.MeshStandardMaterial({
        color: 0xe2a04a,
        roughness: 0.8,
        metalness: 0.1,
    });

    const proteinPumpMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x9b59b6,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0x5a2d6f,
        emissiveIntensity: 0.5,
        clearcoat: 0.8,
    });

    const ionMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
    });
    
    const cholesterolMaterial = new THREE.MeshStandardMaterial({
        color: 0xf1c40f,
        roughness: 0.6,
        metalness: 0.2
    });

    const receptorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2ecc71,
        emissive: 0x117a3a,
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0
    });

    // 1. Phospholipid Bilayer
    const bilayerGroup = new THREE.Group();
    const lipidGeometry = new THREE.Group();
    
    // Create single lipid molecule geometry
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, lipidHeadMaterial);
    
    const tailGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
    const tail1 = new THREE.Mesh(tailGeo, lipidTailMaterial);
    tail1.position.set(-0.1, -0.6, 0);
    const tail2 = new THREE.Mesh(tailGeo, lipidTailMaterial);
    tail2.position.set(0.1, -0.6, 0);

    lipidGeometry.add(headMesh);
    lipidGeometry.add(tail1);
    lipidGeometry.add(tail2);

    const bilayerWidth = 10;
    const bilayerDepth = 10;
    const lipids = [];

    // Top and Bottom Layers
    for (let x = -bilayerWidth / 2; x < bilayerWidth / 2; x++) {
        for (let z = -bilayerDepth / 2; z < bilayerDepth / 2; z++) {
            // Leave space for the protein pump
            if (x > -1.5 && x < 1.5 && z > -1.5 && z < 1.5) continue;

            const topLipid = lipidGeometry.clone();
            topLipid.position.set(x + (Math.random() * 0.2 - 0.1), 1.2, z + (Math.random() * 0.2 - 0.1));
            topLipid.userData = { initialY: 1.2, randomOffset: Math.random() * Math.PI * 2 };
            bilayerGroup.add(topLipid);
            lipids.push(topLipid);

            const bottomLipid = lipidGeometry.clone();
            bottomLipid.rotation.x = Math.PI;
            bottomLipid.position.set(x + (Math.random() * 0.2 - 0.1), -1.2, z + (Math.random() * 0.2 - 0.1));
            bottomLipid.userData = { initialY: -1.2, randomOffset: Math.random() * Math.PI * 2 };
            bilayerGroup.add(bottomLipid);
            lipids.push(bottomLipid);
            
            // Randomly add cholesterol
            if (Math.random() > 0.8) {
                const cholGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
                const chol = new THREE.Mesh(cholGeo, cholesterolMaterial);
                const isTop = Math.random() > 0.5;
                chol.position.set(x + (Math.random() * 0.4 - 0.2), isTop ? 0.5 : -0.5, z + (Math.random() * 0.4 - 0.2));
                chol.rotation.z = (Math.random() * 0.2 - 0.1);
                chol.rotation.x = (Math.random() * 0.2 - 0.1);
                bilayerGroup.add(chol);
                lipids.push(chol);
            }
        }
    }
    group.add(bilayerGroup);
    meshes.lipids = lipids;

    parts.push({
        name: 'Phospholipid Bilayer',
        description: 'The fundamental structure of the cell membrane, composed of hydrophilic heads and hydrophobic tails.',
        material: 'lipidHeadMaterial & lipidTailMaterial',
        function: 'Forms a semi-permeable barrier separating the cell interior from the external environment.',
        assemblyOrder: 1,
        connections: ['Transmembrane Proteins', 'Cholesterol'],
        failureEffect: 'Cell lysis (rupture) and loss of internal contents.',
        cascadeFailures: ['Complete cellular failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: -5 }
    });

    // 2. Transmembrane Protein Pump (Ion Channel)
    const pumpGroup = new THREE.Group();
    const pumpGeoOuter = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32, 1, true, 0, Math.PI * 1.5);
    const pumpMeshOuter = new THREE.Mesh(pumpGeoOuter, proteinPumpMaterial);
    
    // Create custom shape for pump
    const pumpGeoInner = new THREE.TorusGeometry(0.8, 0.4, 16, 32, Math.PI * 2);
    const pumpInnerTop = new THREE.Mesh(pumpGeoInner, proteinPumpMaterial);
    pumpInnerTop.rotation.x = Math.PI / 2;
    pumpInnerTop.position.y = 1.7;
    const pumpInnerBottom = new THREE.Mesh(pumpGeoInner, proteinPumpMaterial);
    pumpInnerBottom.rotation.x = Math.PI / 2;
    pumpInnerBottom.position.y = -1.7;

    const pumpCoreGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.5, 16);
    const pumpCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8e44ad,
        transparent: true,
        opacity: 0.4,
        emissive: 0x3a1a4c,
    });
    const pumpCore = new THREE.Mesh(pumpCoreGeo, pumpCoreMaterial);

    pumpGroup.add(pumpMeshOuter);
    pumpGroup.add(pumpInnerTop);
    pumpGroup.add(pumpInnerBottom);
    pumpGroup.add(pumpCore);
    
    group.add(pumpGroup);
    meshes.pump = pumpGroup;
    meshes.pumpCore = pumpCore;

    parts.push({
        name: 'Ion Channel (Protein Pump)',
        description: 'A specialized transmembrane protein that actively transports specific ions across the membrane.',
        material: 'proteinPumpMaterial',
        function: 'Regulates electrochemical gradients by moving ions against their concentration gradient using ATP.',
        assemblyOrder: 2,
        connections: ['Phospholipid Bilayer', 'Transport Ions'],
        failureEffect: 'Loss of membrane potential and inability to transmit signals.',
        cascadeFailures: ['Cellular depolarization', 'Osmotic imbalance'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Receptor Protein
    const receptorGroup = new THREE.Group();
    const recStemGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const recStem = new THREE.Mesh(recStemGeo, receptorMaterial);
    const recHeadGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const recHead = new THREE.Mesh(recHeadGeo, receptorMaterial);
    recHead.position.y = 1.5;
    
    receptorGroup.add(recStem);
    receptorGroup.add(recHead);
    receptorGroup.position.set(3, 0.5, 2);
    receptorGroup.rotation.z = 0.2;
    
    group.add(receptorGroup);
    meshes.receptor = receptorGroup;

    parts.push({
        name: 'Receptor Protein',
        description: 'Integral membrane protein that binds to signaling molecules outside the cell.',
        material: 'receptorMaterial',
        function: 'Initiates intracellular signaling pathways upon ligand binding.',
        assemblyOrder: 3,
        connections: ['Phospholipid Bilayer', 'Ligands'],
        failureEffect: 'Inability to respond to external signals.',
        cascadeFailures: ['Loss of cell communication'],
        originalPosition: { x: 3, y: 0.5, z: 2 },
        explodedPosition: { x: 8, y: 3, z: 5 }
    });

    // 4. Neon Transport Ions
    const ionsGroup = new THREE.Group();
    const ions = [];
    const ionGeo = new THREE.SphereGeometry(0.15, 16, 16);
    
    for (let i = 0; i < 15; i++) {
        const ion = new THREE.Mesh(ionGeo, ionMaterial);
        // Start below the membrane
        ion.position.set(
            (Math.random() - 0.5) * 1.5,
            -3 - Math.random() * 3,
            (Math.random() - 0.5) * 1.5
        );
        ion.userData = {
            phase: Math.random() * Math.PI * 2,
            speed: 1 + Math.random() * 2,
            transporting: false
        };
        
        // Add a point light to each ion for the neon effect
        const ionLight = new THREE.PointLight(0x00ffcc, 0.5, 2);
        ionLight.position.copy(ion.position);
        ion.add(ionLight);

        ionsGroup.add(ion);
        ions.push(ion);
    }
    group.add(ionsGroup);
    meshes.ions = ions;

    parts.push({
        name: 'Transport Ions',
        description: 'Charged particles (e.g., Na+, K+) moved by the protein pump.',
        material: 'ionMaterial (Neon)',
        function: 'Creates electrochemical gradients essential for cellular function.',
        assemblyOrder: 4,
        connections: ['Ion Channel (Protein Pump)'],
        failureEffect: 'Stagnation of concentration gradients.',
        cascadeFailures: ['Cell death'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    const description = "A detailed interactive visualization of a Cell Membrane showcasing the Fluid Mosaic Model. Features a dynamic phospholipid bilayer with embedded cholesterol, a glowing ion channel protein pump actively transporting neon ions, and a receptor protein.";

    const quizQuestions = [
        {
            question: "What is the primary structural component of the cell membrane?",
            options: ["Proteins", "Carbohydrates", "Phospholipids", "Nucleic Acids"],
            correct: 2,
            explanation: "The cell membrane is primarily composed of a phospholipid bilayer, which forms the fundamental structural barrier.",
            difficulty: "Easy"
        },
        {
            question: "How do ion channels transport specific molecules across the membrane?",
            options: ["By simple diffusion", "By actively pumping them against their gradient using ATP", "By dissolving them in the lipid tail region", "By passive osmosis"],
            correct: 1,
            explanation: "Active transport ion pumps use energy (ATP) to move specific ions against their concentration gradient, which is visualized here.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the cholesterol embedded within the bilayer?",
            options: ["To transport ions", "To synthesize proteins", "To regulate membrane fluidity", "To act as a receptor for hormones"],
            correct: 2,
            explanation: "Cholesterol molecules embedded in the hydrophobic tail region help modulate and stabilize the fluidity of the cell membrane.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        
        const adjustedTime = time * speed;

        // Fluid Mosaic: Lipids bobbing slightly
        if (activeMeshes.lipids) {
            activeMeshes.lipids.forEach((lipid) => {
                const offset = lipid.userData.randomOffset;
                const base = lipid.userData.initialY || lipid.position.y;
                lipid.position.y = base + Math.sin(adjustedTime * 2 + offset) * 0.05;
            });
        }

        // Pump breathing/pulsing effect
        if (activeMeshes.pumpCore) {
            const pulse = (Math.sin(adjustedTime * 4) + 1) / 2;
            activeMeshes.pumpCore.scale.set(1 + pulse * 0.1, 1, 1 + pulse * 0.1);
            activeMeshes.pumpCore.material.emissiveIntensity = 0.5 + pulse * 0.5;
        }

        // Receptor swaying
        if (activeMeshes.receptor) {
            activeMeshes.receptor.rotation.z = 0.2 + Math.sin(adjustedTime * 1.5) * 0.1;
            activeMeshes.receptor.rotation.x = Math.sin(adjustedTime * 1.2) * 0.05;
        }

        // Ion transport logic
        if (activeMeshes.ions) {
            activeMeshes.ions.forEach((ion) => {
                // Move upwards
                if (ion.position.y < 4) {
                    // Pull ions towards the center when close to pump
                    if (ion.position.y > -2 && ion.position.y < 2) {
                        ion.position.x += (0 - ion.position.x) * 0.1;
                        ion.position.z += (0 - ion.position.z) * 0.1;
                        ion.position.y += 0.05 * speed;
                        
                        // Increase brightness while in pump
                        ion.material.color.setHex(0xffffff);
                    } else {
                        ion.position.y += 0.02 * speed;
                        ion.material.color.setHex(0x00ffcc);
                        // Add slight wobble
                        ion.position.x += Math.sin(adjustedTime * 5 + ion.userData.phase) * 0.01;
                    }
                } else {
                    // Reset to bottom
                    ion.position.set(
                        (Math.random() - 0.5) * 1.5,
                        -4 - Math.random() * 2,
                        (Math.random() - 0.5) * 1.5
                    );
                }
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createCellMembrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
