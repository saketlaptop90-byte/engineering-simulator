import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials for the Lysosome
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        emissive: 0x220044,
        emissiveIntensity: 0.5
    });

    const innerAcidMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.7,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.8,
        shininess: 100
    });

    const enzymeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff0088,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8
    });

    const proteinPumpMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0044aa,
        emissiveIntensity: 0.6,
        roughness: 0.4,
        metalness: 0.9
    });

    const debrisMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa5500,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
    });

    // 1. Outer Lipid Bilayer Membrane (The Shell)
    const membraneGeo = new THREE.SphereGeometry(5, 64, 64);
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMaterial);
    group.add(membraneMesh);
    parts.push({
        name: 'Lipid Bilayer Membrane',
        description: 'A robust single membrane that encloses the acidic environment of the lysosome, protecting the rest of the cell from hydrolytic enzymes.',
        material: 'membraneMaterial',
        function: 'Containment of acidic lumen and enzymes; fusion with other vesicles.',
        assemblyOrder: 1,
        connections: ['Proton Pumps', 'Transport Proteins'],
        failureEffect: 'Enzyme leakage leading to cellular autolysis (cell death).',
        cascadeFailures: ['Cell Destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: membraneMesh
    });

    // 2. Inner Acidic Lumen
    const lumenGeo = new THREE.SphereGeometry(4.8, 32, 32);
    const lumenMesh = new THREE.Mesh(lumenGeo, innerAcidMaterial);
    group.add(lumenMesh);
    parts.push({
        name: 'Acidic Lumen',
        description: 'The internal environment of the lysosome, maintained at a pH of around 4.5 to 5.0, optimal for enzyme activity.',
        material: 'innerAcidMaterial',
        function: 'Provides the optimal pH for acid hydrolases to break down waste.',
        assemblyOrder: 2,
        connections: ['Hydrolytic Enzymes', 'Debris'],
        failureEffect: 'Inability of enzymes to function, leading to waste accumulation.',
        cascadeFailures: ['Lysosomal Storage Disease'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: lumenMesh
    });

    // 3. Proton Pumps (V-ATPases)
    const pumpGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
    const pumpMeshes = [];
    const numPumps = 12;
    for (let i = 0; i < numPumps; i++) {
        const pump = new THREE.Mesh(pumpGeo, proteinPumpMaterial);
        const phi = Math.acos(-1 + (2 * i) / numPumps);
        const theta = Math.sqrt(numPumps * Math.PI) * phi;
        
        pump.position.set(
            4.9 * Math.cos(theta) * Math.sin(phi),
            4.9 * Math.cos(phi),
            4.9 * Math.sin(theta) * Math.sin(phi)
        );
        pump.lookAt(0,0,0);
        pump.rotateX(Math.PI / 2);
        group.add(pump);
        pumpMeshes.push(pump);
    }
    parts.push({
        name: 'Proton Pumps (V-ATPase)',
        description: 'Transmembrane proteins that actively transport hydrogen ions (H+) into the lysosome using ATP.',
        material: 'proteinPumpMaterial',
        function: 'Maintains the low pH of the lysosomal lumen.',
        assemblyOrder: 3,
        connections: ['Membrane'],
        failureEffect: 'Loss of acidity, neutralizing enzymes.',
        cascadeFailures: ['Digestion Failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 },
        mesh: pumpMeshes // Array of meshes for animation
    });

    // 4. Hydrolytic Enzymes
    const enzymeGeo = new THREE.TetrahedronGeometry(0.4, 1);
    const enzymeMeshes = [];
    for(let i=0; i<30; i++) {
        const enzyme = new THREE.Mesh(enzymeGeo, enzymeMaterial);
        enzyme.position.set(
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7
        );
        // keep inside lumen
        if(enzyme.position.length() > 4.5) {
            enzyme.position.normalize().multiplyScalar(Math.random() * 4.5);
        }
        group.add(enzyme);
        enzymeMeshes.push({ mesh: enzyme, speed: new THREE.Vector3((Math.random()-0.5)*0.05, (Math.random()-0.5)*0.05, (Math.random()-0.5)*0.05) });
    }
    parts.push({
        name: 'Acid Hydrolases (Enzymes)',
        description: 'A suite of roughly 50 different degradative enzymes (proteases, nucleases, lipases) capable of breaking down all types of biological polymers.',
        material: 'enzymeMaterial',
        function: 'Break down complex molecules into simpler compounds.',
        assemblyOrder: 4,
        connections: ['Acidic Lumen', 'Debris'],
        failureEffect: 'Accumulation of specific undegraded substances.',
        cascadeFailures: ['Cellular Toxicity'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 },
        mesh: enzymeMeshes
    });

    // 5. Cellular Debris (being digested)
    const debrisGeo = new THREE.DodecahedronGeometry(0.6, 0);
    const debrisMeshes = [];
    for(let i=0; i<8; i++) {
        const debris = new THREE.Mesh(debrisGeo, debrisMaterial);
        debris.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        if(debris.position.length() > 3.5) {
            debris.position.normalize().multiplyScalar(Math.random() * 3.5);
        }
        // random rotation
        debris.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        group.add(debris);
        debrisMeshes.push(debris);
    }
    parts.push({
        name: 'Cellular Debris / Phagophore',
        description: 'Old organelles, misfolded proteins, or engulfed pathogens that have been delivered to the lysosome for destruction.',
        material: 'debrisMaterial',
        function: 'The substrate for the hydrolytic enzymes.',
        assemblyOrder: 5,
        connections: ['Enzymes'],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 10 },
        mesh: debrisMeshes
    });

    const description = "The Lysosome is the cell's waste disposal and recycling center. It is a membrane-bound organelle containing highly reactive hydrolytic enzymes in a highly acidic environment (pH ~4.5). It breaks down cellular waste, obsolete organelles (autophagy), and engulfed pathogens (phagocytosis) into basic building blocks that the cell can reuse.";

    const quizQuestions = [
        {
            question: "Why must the lysosome's enzymes be kept enclosed within a membrane?",
            options: [
                "They require sunlight to activate.",
                "They are extremely acidic and would destroy the rest of the cell.",
                "They need to be kept cold.",
                "To prevent them from escaping the cell completely."
            ],
            correct: 1,
            explanation: "Lysosomal enzymes (acid hydrolases) can break down almost all organic molecules. If they leak into the neutral pH of the cytosol en masse, they can digest the cell from the inside out.",
            difficulty: "Medium"
        },
        {
            question: "What mechanism maintains the acidic pH inside the lysosome?",
            options: [
                "Diffusion of acid from the cytoplasm.",
                "Proton pumps (V-ATPases) actively transport H+ ions into the lumen.",
                "Enzymes produce acid as a byproduct.",
                "The membrane absorbs acidic water from the environment."
            ],
            correct: 1,
            explanation: "Proton pumps embedded in the lysosomal membrane use ATP to pump hydrogen ions (protons) into the lysosome against their concentration gradient, lowering the pH.",
            difficulty: "Hard"
        },
        {
            question: "What is the term for the process where a lysosome digests the cell's own obsolete organelles?",
            options: [
                "Phagocytosis",
                "Pinocytosis",
                "Autophagy",
                "Apoptosis"
            ],
            correct: 2,
            explanation: "Autophagy (literally 'self-eating') is the process by which a cell breaks down and recycles its own old or damaged organelles using lysosomes.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, partsInfo) {
        // Pulse the membrane slightly
        const membraneScale = 1 + Math.sin(time * 2 * speed) * 0.02;
        membraneMesh.scale.set(membraneScale, membraneScale, membraneScale);

        // Rotate the inner acid slightly for a fluid feel
        lumenMesh.rotation.y = time * 0.2 * speed;
        lumenMesh.rotation.z = time * 0.1 * speed;

        // Pulse Proton Pumps
        pumpMeshes.forEach((pump, index) => {
            const pulse = 1 + Math.sin(time * 5 * speed + index) * 0.1;
            pump.scale.set(pulse, 1, pulse);
        });

        // Move enzymes around randomly like fluid particles
        enzymeMeshes.forEach(enzObj => {
            enzObj.mesh.position.add(enzObj.speed.clone().multiplyScalar(speed * 20));
            enzObj.mesh.rotation.x += 0.05 * speed * 20;
            enzObj.mesh.rotation.y += 0.05 * speed * 20;
            
            // Bounce off lumen wall
            if(enzObj.mesh.position.length() > 4.5) {
                const normal = enzObj.mesh.position.clone().normalize();
                enzObj.speed.reflect(normal);
                // push back inside
                enzObj.mesh.position.copy(normal.multiplyScalar(4.4));
            }
        });

        // Rotate debris slowly, shrink and grow slightly to simulate digestion
        debrisMeshes.forEach((deb, index) => {
            deb.rotation.x += 0.01 * speed * 20;
            deb.rotation.y += 0.02 * speed * 20;
            const debScale = 0.8 + Math.sin(time * 3 * speed + index) * 0.2;
            deb.scale.set(debScale, debScale, debScale);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLysosome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
