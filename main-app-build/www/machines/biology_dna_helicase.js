import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Glowing/Neon Materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingCore = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.1
    });

    // 1. Helicase Hexameric Ring (Main Body)
    const helicaseGeo = new THREE.TorusGeometry(3, 1, 32, 64);
    const helicaseMesh = new THREE.Mesh(helicaseGeo, chrome);
    helicaseMesh.rotation.x = Math.PI / 2;
    group.add(helicaseMesh);
    
    parts.push({
        name: "Hexameric Motor Ring",
        description: "The main body of the DNA helicase, composed of six protein subunits that hydrolyze ATP to drive unwinding.",
        material: "Chrome/Protein Core",
        function: "Drives the separation of DNA strands by moving along the phosphodiester backbone.",
        assemblyOrder: 1,
        connections: ["DNA Strands", "ATP Binding Sites"],
        failureEffect: "Complete halt of DNA replication, stopping the cell cycle.",
        cascadeFailures: ["Replication Fork Collapse", "Cellular Senescence"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: helicaseMesh
    });
    
    // 2. ATP Hydrolysis Subunits (Glowing Power Cores)
    const subunits = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const subunitGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const subunit = new THREE.Mesh(subunitGeo, glowingCore);
        const angle = (Math.PI * 2 / 6) * i;
        subunit.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
        subunits.add(subunit);
    }
    group.add(subunits);
    
    parts.push({
        name: "ATP Hydrolysis Subunits",
        description: "Individual protein components that undergo conformational changes upon ATP binding and hydrolysis.",
        material: "Glowing Energy Core",
        function: "Converts chemical energy from ATP into mechanical work for translocation.",
        assemblyOrder: 2,
        connections: ["Hexameric Motor Ring"],
        failureEffect: "Loss of motor function, rendering the helicase inactive.",
        cascadeFailures: ["Motor Ring Stalls"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: subunits
    });

    // 3. DNA Strands (Double Helix splitting into single strands)
    const dnaGroup = new THREE.Group();
    const helixRadius = 1.5;
    const dnaStrand1 = new THREE.Group();
    const dnaStrand2 = new THREE.Group();
    
    // Generate nucleotide particles
    for (let i = -20; i <= 20; i++) {
        const y = i * 0.4;
        const angle = i * 0.4;
        
        const nucGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const nuc1 = new THREE.Mesh(nucGeo, neonCyan);
        const nuc2 = new THREE.Mesh(nucGeo, neonMagenta);
        
        let splitRadius1 = helixRadius;
        let splitRadius2 = helixRadius;
        let pAngle1 = angle;
        let pAngle2 = angle + Math.PI;
        
        if (y > 0) {
            splitRadius1 += y * 0.5; // Unzipping outward
            splitRadius2 += y * 0.5;
        }
        
        nuc1.position.set(Math.cos(pAngle1) * splitRadius1, y, Math.sin(pAngle1) * splitRadius1);
        nuc2.position.set(Math.cos(pAngle2) * splitRadius2, y, Math.sin(pAngle2) * splitRadius2);
        
        nuc1.userData = { baseRadius: helixRadius, angleOffset: 0, yPos: y };
        nuc2.userData = { baseRadius: helixRadius, angleOffset: Math.PI, yPos: y };
        
        dnaStrand1.add(nuc1);
        dnaStrand2.add(nuc2);
    }
    
    dnaGroup.add(dnaStrand1);
    dnaGroup.add(dnaStrand2);
    group.add(dnaGroup);
    
    parts.push({
        name: "Double-Stranded DNA (dsDNA)",
        description: "The genetic blueprint, bound in a double helix structure that enters the helicase pore to be unwound.",
        material: "Neon Cyan & Magenta",
        function: "Contains the genetic information to be replicated or transcribed.",
        assemblyOrder: 3,
        connections: ["Helicase Central Pore"],
        failureEffect: "DNA damage or strand breaks.",
        cascadeFailures: ["Genetic Mutation", "Cell Apoptosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 },
        mesh: dnaGroup
    });

    const description = "The DNA Helicase is a highly complex molecular motor that utilizes the chemical energy from ATP hydrolysis to actively unwind double-stranded DNA into two individual single strands, paving the essential way for the entire replication machinery.";

    const quizQuestions = [
        {
            question: "What is the primary function of DNA Helicase?",
            options: [
                "Synthesize new DNA strands",
                "Unwind the DNA double helix",
                "Repair DNA mutations",
                "Fold proteins into their 3D structure"
            ],
            correct: 1,
            explanation: "Helicase acts like a molecular zipper, breaking the hydrogen bonds between DNA strands to unwind the double helix.",
            difficulty: "easy"
        },
        {
            question: "Where does the DNA Helicase obtain the energy required to physically unwind DNA?",
            options: [
                "GTP hydrolysis",
                "Solar radiation",
                "ATP hydrolysis",
                "Thermal fluctuations"
            ],
            correct: 2,
            explanation: "Helicases contain specialized ATPase domains that hydrolyze ATP to provide the mechanical energy needed for translocation and unwinding.",
            difficulty: "medium"
        },
        {
            question: "Which geometric structure best represents the functional form of many replicative helicases?",
            options: [
                "Tetramer",
                "Monomer",
                "Hexameric Ring",
                "Icosahedron"
            ],
            correct: 2,
            explanation: "Most replicative helicases (such as DnaB in E. coli or MCM in eukaryotes) function as hexameric rings composed of six subunits encircling a single strand of DNA.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        const ring = meshes.find(m => m.name === "Hexameric Motor Ring")?.mesh;
        const motorSubunits = meshes.find(m => m.name === "ATP Hydrolysis Subunits")?.mesh;
        const dna = meshes.find(m => m.name === "Double-Stranded DNA (dsDNA)")?.mesh;
        
        const animatedSpeed = speed * 2;
        
        if (ring) {
            // Spin the hexameric ring rapidly
            ring.rotation.z = time * animatedSpeed * 0.5;
        }
        
        if (motorSubunits) {
            // Counter-rotate the core subunits for visual complexity
            motorSubunits.rotation.y = time * animatedSpeed * -0.5;
            
            // Pulsate the subunits to simulate ATP burning
            motorSubunits.children.forEach((subunit, idx) => {
                const scale = 1 + 0.15 * Math.sin(time * 5 * speed + idx);
                subunit.scale.set(scale, scale, scale);
            });
        }
        
        if (dna) {
            // Rotate the DNA to simulate unwinding forces
            dna.rotation.y = time * animatedSpeed * 0.3;
            
            const strand1 = dna.children[0];
            const strand2 = dna.children[1];
            const offsetSpeed = time * animatedSpeed;
            
            const updateStrand = (strand) => {
                strand.children.forEach(nuc => {
                    // Simulate downward feed of the DNA
                    let currentY = nuc.userData.yPos - offsetSpeed;
                    
                    // Wrap nucleotides to create infinite unwinding loop
                    currentY = ((currentY + 20) % 40) - 20;
                    if (currentY < -20) currentY += 40;
                    
                    let currentRadius = nuc.userData.baseRadius;
                    if (currentY > 0) {
                        currentRadius += currentY * 0.6; // Split apart above the helicase
                    }
                    
                    const angle = currentY * 0.4 + nuc.userData.angleOffset;
                    nuc.position.set(
                        Math.cos(angle) * currentRadius,
                        currentY,
                        Math.sin(angle) * currentRadius
                    );
                });
            };
            
            updateStrand(strand1);
            updateStrand(strand2);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDNAHelicase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
