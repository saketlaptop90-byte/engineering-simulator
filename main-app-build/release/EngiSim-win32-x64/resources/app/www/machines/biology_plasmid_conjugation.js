import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const dnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
    });

    const donorMembraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4466ff,
        transmission: 0.6,
        opacity: 0.7,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const recipientMembraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff4466,
        transmission: 0.6,
        opacity: 0.7,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const pilusMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffdd00,
        emissive: 0x886600,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.2,
    });

    const proteinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff8800,
        roughness: 0.6,
        metalness: 0.1,
    });

    const chromosomeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        emissive: 0x222222,
        wireframe: true,
    });

    // 1. Donor Bacterium
    const donorGeo = new THREE.CapsuleGeometry(2, 4, 16, 32);
    const donorMesh = new THREE.Mesh(donorGeo, donorMembraneMaterial);
    donorMesh.position.set(-6, 0, 0);
    donorMesh.rotation.z = Math.PI / 2;
    group.add(donorMesh);

    parts.push({
        name: "Donor Bacterium (F+)",
        description: "The bacterium containing the F-plasmid, initiating the conjugation process.",
        material: "Semi-transparent Cell Membrane",
        function: "Houses the plasmid and forms the sex pilus to connect to the recipient.",
        assemblyOrder: 1,
        connections: ["Sex Pilus", "Plasmid DNA", "Chromosomal DNA"],
        failureEffect: "Cannot initiate conjugation.",
        cascadeFailures: ["No pilus formation", "No DNA transfer"],
        originalPosition: {x: -6, y: 0, z: 0},
        explodedPosition: {x: -12, y: 0, z: 0}
    });

    // 2. Recipient Bacterium
    const recipientGeo = new THREE.CapsuleGeometry(2, 4, 16, 32);
    const recipientMesh = new THREE.Mesh(recipientGeo, recipientMembraneMaterial);
    recipientMesh.position.set(6, 0, 0);
    recipientMesh.rotation.z = Math.PI / 2;
    group.add(recipientMesh);

    parts.push({
        name: "Recipient Bacterium (F-)",
        description: "The bacterium lacking the F-plasmid, receiving the genetic material.",
        material: "Semi-transparent Cell Membrane",
        function: "Receives a single strand of the F-plasmid and synthesizes the complementary strand to become F+.",
        assemblyOrder: 2,
        connections: ["Sex Pilus", "Chromosomal DNA"],
        failureEffect: "Cannot receive DNA.",
        cascadeFailures: ["Transfer fails"],
        originalPosition: {x: 6, y: 0, z: 0},
        explodedPosition: {x: 12, y: 0, z: 0}
    });

    // 3. Chromosomes (Abstract representations)
    const chromoGeo = new THREE.TorusKnotGeometry(1, 0.2, 64, 8, 3, 7);
    const donorChromo = new THREE.Mesh(chromoGeo, chromosomeMaterial);
    donorChromo.position.set(-7, 0, 0);
    donorChromo.scale.set(0.6, 0.6, 0.6);
    group.add(donorChromo);

    const recipientChromo = new THREE.Mesh(chromoGeo, chromosomeMaterial);
    recipientChromo.position.set(7, 0, 0);
    recipientChromo.scale.set(0.6, 0.6, 0.6);
    group.add(recipientChromo);

    parts.push({
        name: "Chromosomal DNA",
        description: "The main bacterial genome, distinct from the plasmid.",
        material: "Wireframe Material",
        function: "Carries essential housekeeping genes.",
        assemblyOrder: 3,
        connections: ["Cell Cytoplasm"],
        failureEffect: "Cell death.",
        cascadeFailures: ["Conjugation ceases"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: -5}
    });

    // 4. Sex Pilus
    const pilusGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    pilusGeo.translate(0, 4, 0); // Pivot at the base
    const pilusMesh = new THREE.Mesh(pilusGeo, pilusMaterial);
    pilusMesh.position.set(-4, 0, 0);
    pilusMesh.rotation.z = -Math.PI / 2;
    group.add(pilusMesh);

    parts.push({
        name: "Sex Pilus",
        description: "A tubular appendage extending from the donor to the recipient.",
        material: "Glowing Pilin Protein",
        function: "Connects the two cells and draws them together to form a mating bridge.",
        assemblyOrder: 4,
        connections: ["Donor Bacterium", "Recipient Bacterium"],
        failureEffect: "Cells cannot connect.",
        cascadeFailures: ["DNA transfer blocked"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 5}
    });

    // 5. Transfer Apparatus / Relaxosome
    const relaxGeo = new THREE.DodecahedronGeometry(0.5);
    const relaxMesh = new THREE.Mesh(relaxGeo, proteinMaterial);
    relaxMesh.position.set(-4.5, 0, 0);
    group.add(relaxMesh);

    parts.push({
        name: "Relaxosome Complex",
        description: "A protein complex at the origin of transfer (oriT).",
        material: "Protein Material",
        function: "Nicks the plasmid DNA to initiate single-strand transfer.",
        assemblyOrder: 5,
        connections: ["Plasmid DNA", "Transfer Apparatus"],
        failureEffect: "Plasmid cannot be nicked.",
        cascadeFailures: ["DNA remains in donor"],
        originalPosition: {x: -4.5, y: 0, z: 0},
        explodedPosition: {x: -4.5, y: 4, z: 2}
    });

    // 6. Plasmid DNA (Donor Intact/Nicked)
    const plasmidGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 64);
    const plasmidMesh = new THREE.Mesh(plasmidGeo, dnaMaterial);
    plasmidMesh.position.set(-5, 0, 0);
    plasmidMesh.rotation.x = Math.PI / 2;
    group.add(plasmidMesh);

    parts.push({
        name: "F-Plasmid DNA",
        description: "A circular extrachromosomal DNA molecule containing transfer genes.",
        material: "Neon Glowing DNA",
        function: "Provides the genetic material for conjugation.",
        assemblyOrder: 6,
        connections: ["Relaxosome Complex"],
        failureEffect: "No genetic advantage transferred.",
        cascadeFailures: ["Recipient remains F-"],
        originalPosition: {x: -5, y: 0, z: 0},
        explodedPosition: {x: -5, y: -4, z: -2}
    });

    // 7. Transferring DNA Strand (Dynamic)
    const numPoints = 50;
    const transferPoints = [];
    for(let i=0; i<numPoints; i++) {
        transferPoints.push(new THREE.Vector3(0,0,0));
    }
    const transferGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(transferPoints), 64, 0.05, 8, false);
    const transferMesh = new THREE.Mesh(transferGeo, dnaMaterial);
    group.add(transferMesh);

    parts.push({
        name: "Transferred T-DNA Strand",
        description: "The single-stranded DNA moving through the mating pore.",
        material: "Neon Glowing DNA",
        function: "Crosses into the recipient cell to be replicated.",
        assemblyOrder: 7,
        connections: ["Sex Pilus", "Recipient Bacterium"],
        failureEffect: "Incomplete transfer.",
        cascadeFailures: ["Plasmid degradation in recipient"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 3, z: 0}
    });

    // Store meshes for animation
    const meshes = {
        donorMesh,
        recipientMesh,
        donorChromo,
        recipientChromo,
        pilusMesh,
        relaxMesh,
        plasmidMesh,
        transferMesh,
        transferPoints,
        transferGeo
    };

    const description = "Plasmid conjugation is a process of horizontal gene transfer in bacteria. A donor bacterium (F+) extends a sex pilus to a recipient (F-), drawing them together to form a mating pore. The relaxosome nicks the F-plasmid at the origin of transfer, and a single strand of DNA is actively pumped into the recipient. Both bacteria then synthesize complementary strands, resulting in two F+ cells. This mechanism plays a major role in the spread of antibiotic resistance.";

    const quizQuestions = [
        {
            question: "What is the primary function of the sex pilus during conjugation?",
            options: [
                "To synthesize new DNA",
                "To draw the two bacteria together and form a connection",
                "To store the plasmid inside the donor cell",
                "To destroy the recipient cell's chromosome"
            ],
            correct: 1,
            explanation: "The sex pilus extends from the donor to the recipient, attaches, and retracts to bring the cells into contact, allowing a mating bridge to form.",
            difficulty: "Medium"
        },
        {
            question: "In what form is the plasmid DNA transferred from the donor to the recipient?",
            options: [
                "As a complete double-stranded circular molecule",
                "As fragments of chromosomes",
                "As a single-stranded linear DNA molecule",
                "As an RNA transcript"
            ],
            correct: 2,
            explanation: "The relaxosome nicks the double-stranded plasmid, and a single strand is peeled off and threaded through the pore into the recipient cell.",
            difficulty: "Hard"
        },
        {
            question: "What is the status of the recipient cell after a successful F-plasmid conjugation?",
            options: [
                "It remains F- but gains a chromosome",
                "It becomes an F+ donor cell",
                "It undergoes lysis (bursts)",
                "It loses its original chromosome"
            ],
            correct: 1,
            explanation: "Because it receives a copy of the F-plasmid (which carries the genes for conjugation) and synthesizes the complementary strand, it becomes F+ and can act as a donor.",
            difficulty: "Medium"
        }
    ];

    let phase = 0;

    function animate(time, speed, meshesObj) {
        const m = meshesObj;
        
        m.donorChromo.rotation.x = time * speed * 0.2;
        m.donorChromo.rotation.y = time * speed * 0.3;
        m.recipientChromo.rotation.x = time * speed * 0.2;
        m.recipientChromo.rotation.y = time * speed * 0.3;

        m.plasmidMesh.rotation.z = time * speed;

        const cycleTime = 15; 
        const t = (time * speed) % cycleTime;
        
        if (t < 3) {
            phase = 0;
            const progress = t / 3;
            m.pilusMesh.scale.y = Math.max(0.001, progress);
            m.recipientMesh.position.x = 6 + (1 - progress) * 4; 
            m.transferMesh.visible = false;
        } else if (t < 6) {
            phase = 1;
            const progress = (t - 3) / 3;
            m.pilusMesh.scale.y = Math.max(0.001, 1 - (progress * 0.8)); 
            m.recipientMesh.position.x = 6 - (progress * 2);
            m.transferMesh.visible = false;
        } else if (t < 12) {
            phase = 2;
            m.transferMesh.visible = true;
            m.recipientMesh.position.x = 4;
            m.pilusMesh.scale.y = 0.2;

            const progress = (t - 6) / 6;
            
            const startX = -4.5;
            const endX = 4.5;
            const distance = endX - startX;
            
            const curveArr = [];
            for(let i=0; i<50; i++) {
                const perc = i / 49;
                if (perc > progress) {
                    curveArr.push(new THREE.Vector3(startX + distance * progress, Math.sin(t*10 + i)*0.2, Math.cos(t*10 + i)*0.2));
                } else {
                    const x = startX + distance * perc;
                    const y = Math.sin(t*20 - i*0.5) * 0.3;
                    const z = Math.cos(t*20 - i*0.5) * 0.3;
                    curveArr.push(new THREE.Vector3(x, y, z));
                }
            }
            
            m.transferMesh.geometry.dispose();
            m.transferMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curveArr), 64, 0.05, 8, false);

            m.recipientMesh.material.emissive.setHex(0xff4466);
            m.recipientMesh.material.emissiveIntensity = progress * 0.5;

        } else {
            phase = 3;
            m.transferMesh.visible = false;
            const progress = (t - 12) / 3;
            
            m.recipientMesh.position.x = 4 + progress * 2;
            m.pilusMesh.scale.y = Math.max(0.001, 0.2 * (1 - progress));
            
            m.recipientMesh.material.emissiveIntensity = 0.5 * (1 - progress);
        }
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createPlasmidConjugation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
