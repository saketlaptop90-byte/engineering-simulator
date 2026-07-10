import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const antibodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
    });

    const antigenMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0055,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0xff0022,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
    });

    const macrophageMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaffaa,
        metalness: 0.1,
        roughness: 0.8,
        emissive: 0x113311,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6,
    });

    const bindingSiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffffaa,
        emissiveIntensity: 1.2,
    });

    // 1. Antigen (Pathogen Surface Protein)
    const antigenGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const antigenMesh = new THREE.Mesh(antigenGeometry, antigenMaterial);
    antigenMesh.position.set(0, 0, 0);
    group.add(antigenMesh);

    // Antigen Epitopes (Binding sites)
    const epitopeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const epitope1 = new THREE.Mesh(epitopeGeometry, bindingSiteMaterial);
    epitope1.position.set(1.4, 0.5, 0);
    antigenMesh.add(epitope1);

    const epitope2 = new THREE.Mesh(epitopeGeometry, bindingSiteMaterial);
    epitope2.position.set(-1.4, -0.5, 0);
    antigenMesh.add(epitope2);

    parts.push({
        name: "Antigen (Pathogen)",
        description: "A foreign substance or toxin that induces an immune response in the body, especially the production of antibodies.",
        material: "Organic Pathogenic",
        function: "Triggers immune response",
        assemblyOrder: 1,
        connections: ["Epitopes"],
        failureEffect: "Unchecked infection and pathogen proliferation",
        cascadeFailures: ["Cellular damage", "Systemic failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    parts.push({
        name: "Epitopes",
        description: "The part of an antigen molecule to which an antibody attaches itself.",
        material: "Glowing Binding Site",
        function: "Specific structural target for antibodies",
        assemblyOrder: 2,
        connections: ["Antigen", "Paratope"],
        failureEffect: "Antibodies cannot target the pathogen",
        cascadeFailures: ["Immune evasion"],
        originalPosition: {x: 1.4, y: 0.5, z: 0},
        explodedPosition: {x: 3, y: 5, z: 0}
    });

    // 2. Antibody (Immunoglobulin G - IgG)
    // Create a Y-shaped structure
    const antibodyGroup = new THREE.Group();
    
    // Fc region (base)
    const fcGeometry = new THREE.CapsuleGeometry(0.2, 1.5, 8, 16);
    const fcMesh = new THREE.Mesh(fcGeometry, antibodyMaterial);
    fcMesh.position.set(0, -1, 0);
    antibodyGroup.add(fcMesh);

    // Fab regions (arms)
    const fabGeometry = new THREE.CapsuleGeometry(0.18, 1.2, 8, 16);
    
    const fabLeft = new THREE.Mesh(fabGeometry, antibodyMaterial);
    fabLeft.position.set(-0.6, 0.4, 0);
    fabLeft.rotation.z = Math.PI / 4;
    antibodyGroup.add(fabLeft);

    const fabRight = new THREE.Mesh(fabGeometry, antibodyMaterial);
    fabRight.position.set(0.6, 0.4, 0);
    fabRight.rotation.z = -Math.PI / 4;
    antibodyGroup.add(fabRight);

    // Paratopes (Antibody binding sites on the tips of the arms)
    const paratopeGeometry = new THREE.TorusGeometry(0.2, 0.08, 16, 32);
    
    const paratopeLeft = new THREE.Mesh(paratopeGeometry, bindingSiteMaterial);
    paratopeLeft.position.set(0, 0.7, 0);
    paratopeLeft.rotation.x = Math.PI / 2;
    fabLeft.add(paratopeLeft);

    const paratopeRight = new THREE.Mesh(paratopeGeometry, bindingSiteMaterial);
    paratopeRight.position.set(0, 0.7, 0);
    paratopeRight.rotation.x = Math.PI / 2;
    fabRight.add(paratopeRight);

    antibodyGroup.position.set(5, 2, 0);
    
    // We'll create two antibodies to demonstrate binding to multiple epitopes
    const antibody1 = antibodyGroup.clone();
    group.add(antibody1);
    
    const antibody2 = antibodyGroup.clone();
    antibody2.position.set(-5, -2, 0);
    antibody2.rotation.z = Math.PI;
    group.add(antibody2);

    parts.push({
        name: "Antibody (IgG)",
        description: "Y-shaped protein produced mainly by plasma cells that is used by the immune system to neutralize pathogens.",
        material: "Glowing Immune Protein",
        function: "Identifies and neutralizes specific pathogens",
        assemblyOrder: 3,
        connections: ["Paratope", "Fc Receptor"],
        failureEffect: "Inability to neutralize specific threats",
        cascadeFailures: ["Chronic infection", "Immunodeficiency"],
        originalPosition: {x: 5, y: 2, z: 0},
        explodedPosition: {x: 8, y: 2, z: 0}
    });

    parts.push({
        name: "Paratope",
        description: "The part of an antibody which recognizes an antigen, the antigen-binding site.",
        material: "Glowing Binding Site",
        function: "Lock-and-key specific binding to epitope",
        assemblyOrder: 4,
        connections: ["Epitope"],
        failureEffect: "Cross-reactivity or failure to bind",
        cascadeFailures: ["Autoimmunity", "Ineffective immune response"],
        originalPosition: {x: 0, y: 0.7, z: 0},
        explodedPosition: {x: 0, y: 1.5, z: 0}
    });
    
    // Optional: Macrophage background element
    const macrophageGeometry = new THREE.SphereGeometry(8, 32, 32);
    const macrophageMesh = new THREE.Mesh(macrophageGeometry, macrophageMaterial);
    macrophageMesh.position.set(-15, 5, -10);
    group.add(macrophageMesh);

    parts.push({
        name: "Macrophage",
        description: "A large phagocytic cell found in stationary form in the tissues or as a mobile white blood cell, especially at sites of infection.",
        material: "Cellular Membrane",
        function: "Phagocytosis of antibody-coated pathogens",
        assemblyOrder: 5,
        connections: ["Antibody Fc Region"],
        failureEffect: "Pathogens remain uncleared after neutralization",
        cascadeFailures: ["Toxic accumulation"],
        originalPosition: {x: -15, y: 5, z: -10},
        explodedPosition: {x: -25, y: 10, z: -15}
    });

    const quizQuestions = [
        {
            question: "What is the specific region on an antigen where an antibody binds?",
            options: ["Paratope", "Epitope", "Fc Region", "Variable Domain"],
            correct: 1,
            explanation: "The epitope is the specific molecular structure on an antigen that is recognized and bound by an antibody's paratope.",
            difficulty: "Medium"
        },
        {
            question: "The Y-shaped antibody consists of two main regions. Which region is responsible for binding to the antigen?",
            options: ["Fc (Fragment crystallizable) region", "Fab (Fragment antigen-binding) region", "Hinge region", "Disulfide bonds"],
            correct: 1,
            explanation: "The Fab regions form the 'arms' of the Y-shape and contain the variable domains that bind to specific antigens.",
            difficulty: "Easy"
        },
        {
            question: "What happens after an antibody successfully binds to an antigen?",
            options: [
                "The antigen is immediately destroyed by the antibody.",
                "The antibody turns into a macrophage.",
                "It marks the pathogen for destruction by other immune cells (opsonization).",
                "The antibody multiplies to create more of itself."
            ],
            correct: 2,
            explanation: "Antibodies generally do not destroy pathogens directly. They neutralize them or mark them (opsonization) so cells like macrophages can engulf and destroy them.",
            difficulty: "Hard"
        }
    ];

    const description = "Ultra High-Tech Molecular simulation of Antibody-Antigen Binding. Demonstrates the specific 'lock and key' interaction between the paratopes of Immunoglobulin G (IgG) antibodies and the epitopes on a pathogen's surface. Glowing elements highlight the dynamic interaction points.";

    let animationTime = 0;

    function animate(time, speed, meshes) {
        animationTime += 0.01 * speed;
        
        // Gentle floating of the antigen
        antigenMesh.position.y = Math.sin(animationTime * 0.5) * 0.2;
        antigenMesh.rotation.y = animationTime * 0.2;
        antigenMesh.rotation.x = Math.sin(animationTime * 0.1) * 0.1;
        
        // Epitope pulsing
        const pulse = (Math.sin(animationTime * 5) + 1) * 0.5 + 0.5; // 0.5 to 1.5
        epitope1.scale.set(pulse, pulse, pulse);
        epitope2.scale.set(pulse, pulse, pulse);

        // Antibody 1 animation (Seeking and binding to epitope 1)
        const e1Pos = new THREE.Vector3();
        epitope1.getWorldPosition(e1Pos);
        
        const bindPhase = (Math.sin(animationTime * 0.5) + 1) / 2; // 0 to 1
        
        const targetPos1 = e1Pos.clone().add(e1Pos.clone().normalize().multiplyScalar(1.2));
        const startPos1 = new THREE.Vector3(5, 2, 0);
        
        antibody1.position.lerpVectors(startPos1, targetPos1, bindPhase);
        antibody1.lookAt(e1Pos);
        antibody1.rotateX(Math.PI / 2);

        // Antibody 2 animation (Seeking and binding to epitope 2)
        const e2Pos = new THREE.Vector3();
        epitope2.getWorldPosition(e2Pos);
        
        const targetPos2 = e2Pos.clone().add(e2Pos.clone().normalize().multiplyScalar(1.2));
        const startPos2 = new THREE.Vector3(-5, -2, 0);
        
        antibody2.position.lerpVectors(startPos2, targetPos2, bindPhase);
        antibody2.lookAt(e2Pos);
        antibody2.rotateX(Math.PI / 2);
        
        // Macrophage slow undulating
        macrophageMesh.scale.x = 1 + Math.sin(animationTime * 0.3) * 0.05;
        macrophageMesh.scale.y = 1 + Math.cos(animationTime * 0.4) * 0.05;
        macrophageMesh.position.z = -10 + Math.sin(animationTime * 0.2) * 2;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAntibodyAntigen() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
