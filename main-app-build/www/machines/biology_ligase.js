import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        metalness: 0.4,
        roughness: 0.3
    });

    const energyCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.5,
        wireframe: true
    });
    
    // Core Enzyme Body (The clamp)
    const bodyGeometry = new THREE.TorusGeometry(3, 1, 32, 64, Math.PI * 1.5);
    const enzymeBody = new THREE.Mesh(bodyGeometry, chrome);
    enzymeBody.position.set(0, 0, 0);
    group.add(enzymeBody);
    meshes.enzymeBody = enzymeBody;
    parts.push({
        name: "Ligase Core Structure",
        description: "The main body of the DNA Ligase enzyme that wraps around the DNA double helix.",
        material: "chrome",
        function: "Provides the structural framework and aligns the active sites for ligation.",
        assemblyOrder: 1,
        connections: ["ATP Binding Domain", "Catalytic Active Site"],
        failureEffect: "Inability to hold the DNA strands, completely halting the ligation process.",
        cascadeFailures: ["Loss of ATP binding", "Active site misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // ATP Binding Domain
    const atpDomainGeometry = new THREE.DodecahedronGeometry(1.2);
    const atpDomain = new THREE.Mesh(atpDomainGeometry, neonPink);
    atpDomain.position.set(-2, 2.5, 0);
    group.add(atpDomain);
    meshes.atpDomain = atpDomain;
    parts.push({
        name: "ATP Binding Domain",
        description: "The region where Adenosine Triphosphate (ATP) or NAD+ binds to power the reaction.",
        material: "neonPink",
        function: "Hydrolyzes ATP to AMP, transferring the AMP to the enzyme's active site.",
        assemblyOrder: 2,
        connections: ["Ligase Core Structure", "AMP Intermediate"],
        failureEffect: "No energy source available. The enzyme cannot form the AMP-enzyme intermediate.",
        cascadeFailures: ["Catalytic failure", "Unsealed DNA nicks"],
        originalPosition: { x: -2, y: 2.5, z: 0 },
        explodedPosition: { x: -4, y: 6, z: 2 }
    });

    // Catalytic Active Site
    const activeSiteGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const activeSite = new THREE.Mesh(activeSiteGeometry, neonBlue);
    activeSite.position.set(2, 2.5, 0);
    group.add(activeSite);
    meshes.activeSite = activeSite;
    parts.push({
        name: "Catalytic Active Site",
        description: "The highly conserved region where the phosphodiester bond is formed.",
        material: "neonBlue",
        function: "Catalyzes the nucleophilic attack of the 3'-OH end on the 5'-phosphate end.",
        assemblyOrder: 3,
        connections: ["Ligase Core Structure", "DNA Strand Fragments"],
        failureEffect: "Nick remains unsealed, leading to DNA fragmentation or repair failure.",
        cascadeFailures: ["Cell death or mutation accumulation"],
        originalPosition: { x: 2, y: 2.5, z: 0 },
        explodedPosition: { x: 4, y: 6, z: -2 }
    });

    // DNA Backbone Fragments (Representing the nick)
    const dnaPath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(-2.5, 1, 0),
        new THREE.Vector3(0, 0, 0)
    ]);
    const dnaPath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2.5, -1, 0),
        new THREE.Vector3(5, 0, 0)
    ]);
    
    const dnaGeometry1 = new THREE.TubeGeometry(dnaPath1, 20, 0.3, 8, false);
    const dnaGeometry2 = new THREE.TubeGeometry(dnaPath2, 20, 0.3, 8, false);
    
    const dnaFragment1 = new THREE.Mesh(dnaGeometry1, aluminum);
    const dnaFragment2 = new THREE.Mesh(dnaGeometry2, aluminum);
    
    group.add(dnaFragment1);
    group.add(dnaFragment2);
    meshes.dnaFragment1 = dnaFragment1;
    meshes.dnaFragment2 = dnaFragment2;
    
    parts.push({
        name: "5'-Phosphate End Fragment",
        description: "The downstream DNA fragment with a free 5' phosphate group.",
        material: "aluminum",
        function: "Acts as the electrophile in the ligation reaction.",
        assemblyOrder: 4,
        connections: ["Catalytic Active Site"],
        failureEffect: "Ligation cannot proceed without a viable 5' end.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -4, z: 0 }
    });

    parts.push({
        name: "3'-Hydroxyl End Fragment",
        description: "The upstream DNA fragment with a free 3' OH group.",
        material: "aluminum",
        function: "Provides the nucleophile (OH-) to attack the activated 5' phosphate.",
        assemblyOrder: 5,
        connections: ["Catalytic Active Site"],
        failureEffect: "Ligation cannot proceed without a viable 3' end.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: -4, z: 0 }
    });

    // Sealing Energy Ring (Animation effect)
    const ringGeo = new THREE.RingGeometry(0.5, 0.8, 32);
    const energyRing = new THREE.Mesh(ringGeo, energyCoreMat);
    energyRing.position.set(0, 0, 0);
    energyRing.rotation.y = Math.PI / 2;
    group.add(energyRing);
    meshes.energyRing = energyRing;

    parts.push({
        name: "Phosphodiester Bond Energy",
        description: "The high-energy intermediate state during bond formation.",
        material: "energyCoreMat",
        function: "Represents the transient joining of the DNA backbone.",
        assemblyOrder: 6,
        connections: ["5'-Phosphate End Fragment", "3'-Hydroxyl End Fragment"],
        failureEffect: "Bond formation fails, leaving a nick.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });


    const description = "DNA Ligase is an essential enzyme, known as 'molecular glue', that repairs irregularities or breaks in the backbone of double-stranded DNA molecules. It forms a phosphodiester bond between the 3'-hydroxyl of one DNA strand and the 5'-phosphate of another. It plays a crucial role in DNA replication, repair, and recombinant DNA technology.";

    const quizQuestions = [
        {
            question: "What is the primary function of DNA Ligase?",
            options: [
                "Unwinding the DNA double helix",
                "Synthesizing new DNA strands",
                "Sealing nicks in the DNA backbone by forming phosphodiester bonds",
                "Breaking hydrogen bonds between base pairs"
            ],
            correct: 2,
            explanation: "DNA Ligase is responsible for repairing breaks (nicks) in the sugar-phosphate backbone of DNA by creating phosphodiester bonds between adjacent nucleotides.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following is required as an energy source for DNA Ligase in eukaryotes and archaea?",
            options: [
                "GTP",
                "ATP",
                "NAD+",
                "FADH2"
            ],
            correct: 1,
            explanation: "Eukaryotic and archaeal DNA ligases, as well as many viral ligases, utilize Adenosine Triphosphate (ATP) to drive the ligation reaction.",
            difficulty: "Hard"
        },
        {
            question: "In the context of the ligation reaction, what is the role of the 3'-OH end of the DNA fragment?",
            options: [
                "It acts as a leaving group",
                "It provides the nucleophile to attack the 5'-phosphate",
                "It binds to ATP",
                "It unwinds the DNA"
            ],
            correct: 1,
            explanation: "The 3'-hydroxyl group acts as a nucleophile, attacking the activated 5'-phosphate group to form the phosphodiester linkage.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes = meshes) {
        if (!activeMeshes) return;
        
        // Pulsate ATP domain
        if (activeMeshes.atpDomain) {
            activeMeshes.atpDomain.rotation.x += 0.02 * speed;
            activeMeshes.atpDomain.rotation.y += 0.03 * speed;
            const scale = 1 + Math.sin(time * 0.005) * 0.1;
            activeMeshes.atpDomain.scale.set(scale, scale, scale);
        }

        // Active site glowing/breathing
        if (activeMeshes.activeSite) {
            activeMeshes.activeSite.rotation.y -= 0.01 * speed;
            const glow = 0.8 + Math.abs(Math.sin(time * 0.003)) * 0.4;
            if (activeMeshes.activeSite.material.emissiveIntensity !== undefined) {
                activeMeshes.activeSite.material.emissiveIntensity = glow;
            }
        }

        // Sealing ring animation (scanning/pulsating)
        if (activeMeshes.energyRing) {
            activeMeshes.energyRing.rotation.z += 0.1 * speed;
            const ringScale = 1 + Math.abs(Math.sin(time * 0.008)) * 0.5;
            activeMeshes.energyRing.scale.set(ringScale, ringScale, 1);
            
            // Move the ring slightly back and forth
            activeMeshes.energyRing.position.x = Math.sin(time * 0.004) * 0.5;
        }

        // Gentle floating of the whole enzyme
        if (activeMeshes.enzymeBody) {
            activeMeshes.enzymeBody.position.y = Math.sin(time * 0.002) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLigase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
