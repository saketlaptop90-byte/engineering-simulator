import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/high-tech materials for biological entities
    const betaCellMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x005555,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const alphaCellMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x550055,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.1
    });

    const deltaCellMat = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0x555500,
        transparent: true,
        opacity: 0.8,
        roughness: 0.4
    });

    const capillaryMat = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5
    });
    
    const glucoseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
    });

    const insulinMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8
    });
    
    const glucagonMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.8
    });

    // 1. Capillary Network (Blood supply)
    const capillaryGeometry = new THREE.TorusKnotGeometry(2, 0.3, 100, 16);
    const capillaryMesh = new THREE.Mesh(capillaryGeometry, capillaryMat);
    group.add(capillaryMesh);
    meshes.capillary = capillaryMesh;
    
    parts.push({
        name: "Capillary Network",
        description: "Dense network of fenestrated capillaries supplying the islet.",
        material: "Semi-transparent Red Blood Vessel",
        function: "Transports glucose into the islet and carries secreted hormones (insulin, glucagon) out to the body.",
        assemblyOrder: 1,
        connections: ["Beta Cells", "Alpha Cells", "Delta Cells"],
        failureEffect: "Ischemia leading to cell death and failure of hormone distribution.",
        cascadeFailures: ["Loss of glycemic control", "Systemic tissue damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Beta Cells (Core, Insulin)
    const betaGroup = new THREE.Group();
    const betaGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const betaCells = [];
    for(let i=0; i<30; i++) {
        const mesh = new THREE.Mesh(betaGeo, betaCellMat);
        const radius = Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        betaGroup.add(mesh);
        betaCells.push({mesh, origPos: mesh.position.clone()});
    }
    group.add(betaGroup);
    meshes.betaCellsGroup = betaGroup;
    meshes.betaCells = betaCells;

    parts.push({
        name: "Beta Cells",
        description: "Predominant cell type located primarily in the core of the islet.",
        material: "Cyan Glowing Cell",
        function: "Detects high blood glucose levels and synthesizes/secretes insulin to lower it.",
        assemblyOrder: 2,
        connections: ["Capillary Network"],
        failureEffect: "Inability to produce insulin, leading to Type 1 or late-stage Type 2 Diabetes.",
        cascadeFailures: ["Hyperglycemia", "Diabetic ketoacidosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Alpha Cells (Mantle, Glucagon)
    const alphaGroup = new THREE.Group();
    const alphaGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const alphaCells = [];
    for(let i=0; i<15; i++) {
        const mesh = new THREE.Mesh(alphaGeo, alphaCellMat);
        const radius = 1.6 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        alphaGroup.add(mesh);
        alphaCells.push({mesh, origPos: mesh.position.clone()});
    }
    group.add(alphaGroup);
    meshes.alphaCellsGroup = alphaGroup;
    meshes.alphaCells = alphaCells;

    parts.push({
        name: "Alpha Cells",
        description: "Cells located mostly in the periphery (mantle) of the islet.",
        material: "Magenta Glowing Cell",
        function: "Detects low blood glucose and secretes glucagon to stimulate hepatic glucose release.",
        assemblyOrder: 3,
        connections: ["Capillary Network"],
        failureEffect: "Impaired response to hypoglycemia.",
        cascadeFailures: ["Severe hypoglycemic episodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 4. Delta Cells (Somatostatin)
    const deltaGroup = new THREE.Group();
    const deltaGeo = new THREE.TetrahedronGeometry(0.25, 2);
    const deltaCells = [];
    for(let i=0; i<8; i++) {
        const mesh = new THREE.Mesh(deltaGeo, deltaCellMat);
        const radius = 1.2 + Math.random() * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        deltaGroup.add(mesh);
        deltaCells.push({mesh, origPos: mesh.position.clone()});
    }
    group.add(deltaGroup);
    meshes.deltaCellsGroup = deltaGroup;
    meshes.deltaCells = deltaCells;

    parts.push({
        name: "Delta Cells",
        description: "Scattered cells throughout the islet.",
        material: "Yellow Glowing Cell",
        function: "Secretes somatostatin to locally inhibit both insulin and glucagon secretion.",
        assemblyOrder: 4,
        connections: ["Alpha Cells", "Beta Cells"],
        failureEffect: "Loss of paracrine regulation.",
        cascadeFailures: ["Erratic hormone secretion patterns"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // Particles (Glucose, Insulin, Glucagon)
    const particlesGroup = new THREE.Group();
    group.add(particlesGroup);
    meshes.particlesGroup = particlesGroup;
    
    const molecules = [];
    const glucGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const insGeo = new THREE.OctahedronGeometry(0.06, 0);
    const glucagonGeo = new THREE.TetrahedronGeometry(0.06, 0);

    for(let i=0; i<40; i++) {
        // 0: Glucose, 1: Insulin, 2: Glucagon
        const type = Math.floor(Math.random() * 3);
        let mesh;
        if(type === 0) mesh = new THREE.Mesh(glucGeo, glucoseMat);
        else if(type === 1) mesh = new THREE.Mesh(insGeo, insulinMat);
        else mesh = new THREE.Mesh(glucagonGeo, glucagonMat);
        
        mesh.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        
        particlesGroup.add(mesh);
        molecules.push({
            mesh,
            type,
            speed: 0.5 + Math.random(),
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 2.5 + 0.5
        });
    }
    meshes.molecules = molecules;

    parts.push({
        name: "Hormones & Substrates",
        description: "Glucose (White), Insulin (Green), Glucagon (Orange)",
        material: "Glowing Particles",
        function: "Glucose acts as the primary stimulus. Insulin lowers glucose. Glucagon raises glucose.",
        assemblyOrder: 5,
        connections: ["Capillary Network", "Target Tissues"],
        failureEffect: "Metabolic crisis.",
        cascadeFailures: ["Ketoacidosis", "Coma"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    const description = "The Pancreatic Islet of Langerhans is a micro-organ acting as the endocrine hub of the pancreas. It constantly measures blood glucose via fenestrated capillaries and orchestrates the release of hormones like Insulin (from beta cells) and Glucagon (from alpha cells) to maintain glucose homeostasis.";

    const quizQuestions = [
        {
            question: "Which cell type within the pancreatic islet is responsible for producing insulin?",
            options: ["Alpha Cells", "Beta Cells", "Delta Cells", "Acinar Cells"],
            correct: 1,
            explanation: "Beta cells, which make up the majority of the islet, are responsible for sensing high glucose and releasing insulin.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the hormone glucagon, secreted by alpha cells?",
            options: [
                "To lower blood glucose levels",
                "To stimulate glycogenolysis and gluconeogenesis in the liver",
                "To inhibit the secretion of insulin and somatostatin",
                "To facilitate glucose uptake into muscle cells"
            ],
            correct: 1,
            explanation: "Glucagon is secreted in response to low blood glucose and signals the liver to produce and release glucose into the bloodstream.",
            difficulty: "Medium"
        },
        {
            question: "How do delta cells exert paracrine control over the islet?",
            options: [
                "By secreting somatostatin, which inhibits both alpha and beta cells",
                "By increasing blood flow through the capillary network",
                "By converting glucose into glycogen locally",
                "By secreting digestive enzymes into the pancreatic duct"
            ],
            correct: 0,
            explanation: "Delta cells release somatostatin, acting as a local (paracrine) brake on the secretion of both insulin and glucagon, fine-tuning the islet's output.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Rotate capillary gently
        if(meshes.capillary) {
            meshes.capillary.rotation.x = t * 0.2;
            meshes.capillary.rotation.y = t * 0.3;
        }

        // Pulsate Beta cells based on \"insulin secretion\"
        const betaPulse = Math.sin(t * 2) * 0.05 + 1;
        if(meshes.betaCells) {
            meshes.betaCells.forEach((c, idx) => {
                c.mesh.scale.set(betaPulse, betaPulse, betaPulse);
                c.mesh.material.emissiveIntensity = 0.5 + Math.sin(t*3 + idx)*0.3;
            });
        }

        // Alpha cells breathing
        const alphaPulse = Math.cos(t * 1.5) * 0.05 + 1;
        if(meshes.alphaCells) {
            meshes.alphaCells.forEach((c, idx) => {
                c.mesh.scale.set(alphaPulse, alphaPulse, alphaPulse);
                c.mesh.material.emissiveIntensity = 0.5 + Math.cos(t*2 + idx)*0.3;
            });
        }

        // Orbit molecules
        if(meshes.molecules) {
            meshes.molecules.forEach(mol => {
                mol.angle += mol.speed * speed * 0.02;
                mol.mesh.position.x = Math.cos(mol.angle) * mol.radius;
                mol.mesh.position.z = Math.sin(mol.angle) * mol.radius;
                // Vertical drift
                mol.mesh.position.y += Math.sin(t * mol.speed + mol.angle) * 0.02;
                
                // Wrap around y
                if(mol.mesh.position.y > 3) mol.mesh.position.y = -3;
                if(mol.mesh.position.y < -3) mol.mesh.position.y = 3;
                
                mol.mesh.rotation.x += 0.05;
                mol.mesh.rotation.y += 0.05;
            });
        }
        
        // Rotate the whole groups slowly
        if(meshes.betaCellsGroup) meshes.betaCellsGroup.rotation.y = t * 0.1;
        if(meshes.alphaCellsGroup) meshes.alphaCellsGroup.rotation.y = -t * 0.05;
        if(meshes.deltaCellsGroup) meshes.deltaCellsGroup.rotation.y = t * 0.08;
        if(meshes.particlesGroup) meshes.particlesGroup.rotation.y = t * 0.15;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPancreaticIslet() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
