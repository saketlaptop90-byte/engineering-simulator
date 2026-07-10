import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const amberMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        ior: 1.54,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const innerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc44,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const insectBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.8,
        metalness: 0.2
    });

    const wingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        iridescence: 1.0,
        iridescenceIOR: 1.3
    });

    const displayBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.2,
        metalness: 0.9
    });

    const hologramMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        blending: THREE.AdditiveBlending
    });

    // 1. Display Base
    const baseGeom = new THREE.CylinderGeometry(4, 4.5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeom, displayBaseMaterial);
    baseMesh.position.set(0, -0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Containment Base",
        description: "High-tech stabilization platform holding the fossil specimen.",
        material: "Steel / Chrome",
        function: "Provides structural support and environmental control for the amber.",
        assemblyOrder: 1,
        connections: ["Amber Matrix"],
        failureEffect: "Specimen becomes unstable and may degrade.",
        cascadeFailures: ["Fossil Core Integrity"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: baseMesh
    });

    // 2. Amber Matrix (Outer Shell)
    const amberGeom = new THREE.IcosahedronGeometry(3, 3);
    const amberMesh = new THREE.Mesh(amberGeom, amberMaterial);
    amberMesh.position.set(0, 3, 0);
    // slight distortion to look natural
    const positions = amberGeom.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        positions.setX(i, positions.getX(i) * (1 + Math.random() * 0.1 - 0.05));
        positions.setY(i, positions.getY(i) * (1 + Math.random() * 0.1 - 0.05));
        positions.setZ(i, positions.getZ(i) * (1 + Math.random() * 0.1 - 0.05));
    }
    amberGeom.computeVertexNormals();
    group.add(amberMesh);
    parts.push({
        name: "Amber Matrix",
        description: "Fossilized tree resin from the Cretaceous period.",
        material: "Organic Resin",
        function: "Preserves the biological specimen in a near-perfect vacuum.",
        assemblyOrder: 2,
        connections: ["Containment Base", "Trapped Specimen"],
        failureEffect: "Loss of optical clarity and potential fracture.",
        cascadeFailures: ["Specimen Preservation"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0},
        mesh: amberMesh
    });

    // 3. Trapped Specimen - Prehistoric Insect
    const insectGroup = new THREE.Group();
    insectGroup.position.set(0, 3, 0);
    
    // Thorax
    const thoraxGeom = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const thoraxMesh = new THREE.Mesh(thoraxGeom, insectBodyMaterial);
    thoraxMesh.rotation.z = Math.PI / 2;
    insectGroup.add(thoraxMesh);

    // Head
    const headGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const headMesh = new THREE.Mesh(headGeom, insectBodyMaterial);
    headMesh.position.set(0.6, 0, 0);
    insectGroup.add(headMesh);

    // Wings
    const wingGeom = new THREE.PlaneGeometry(1.5, 0.5);
    const wingL = new THREE.Mesh(wingGeom, wingMaterial);
    wingL.position.set(0, 0.3, 0.5);
    wingL.rotation.x = -Math.PI / 6;
    wingL.rotation.y = Math.PI / 8;
    insectGroup.add(wingL);

    const wingR = new THREE.Mesh(wingGeom, wingMaterial);
    wingR.position.set(0, 0.3, -0.5);
    wingR.rotation.x = Math.PI / 6;
    wingR.rotation.y = Math.PI / 8;
    insectGroup.add(wingR);

    // Legs
    for (let i = 0; i < 3; i++) {
        const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
        const legL = new THREE.Mesh(legGeom, insectBodyMaterial);
        legL.position.set(-0.3 + i * 0.3, -0.3, 0.4);
        legL.rotation.x = -Math.PI / 4;
        insectGroup.add(legL);

        const legR = new THREE.Mesh(legGeom, insectBodyMaterial);
        legR.position.set(-0.3 + i * 0.3, -0.3, -0.4);
        legR.rotation.x = Math.PI / 4;
        insectGroup.add(legR);
    }

    insectGroup.rotation.y = Math.PI / 4;
    insectGroup.rotation.z = Math.PI / 6;
    group.add(insectGroup);

    parts.push({
        name: "Trapped Specimen (Formicidae)",
        description: "Prehistoric insect preserved in extraordinary detail.",
        material: "Organic Matter",
        function: "Scientific subject of study and DNA extraction.",
        assemblyOrder: 3,
        connections: ["Amber Matrix"],
        failureEffect: "Genetic data corruption.",
        cascadeFailures: ["Cloning Protocols"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 4, y: 3, z: 4},
        mesh: insectGroup
    });

    // 4. Analysis Laser Rings
    const ringGeom = new THREE.TorusGeometry(3.5, 0.05, 16, 64);
    const ring1 = new THREE.Mesh(ringGeom, hologramMaterial);
    ring1.position.set(0, 3, 0);
    group.add(ring1);
    
    parts.push({
        name: "Biometric Scanner Ring",
        description: "Projects non-destructive analysis waves through the amber.",
        material: "Holographic/Neon",
        function: "Maps the internal structure of the inclusion at sub-micron levels.",
        assemblyOrder: 4,
        connections: ["Containment Base"],
        failureEffect: "Analysis data stream interruption.",
        cascadeFailures: ["3D Reconstruction"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 3, z: -6},
        mesh: ring1
    });

    const description = "The Amber Fossil Resin module simulates the high-tech analysis and containment of a prehistoric biological specimen trapped in Cretaceous tree sap. It features advanced optical refraction materials to mimic genuine fossilized resin, allowing researchers to study the preserved insect inclusion inside.";

    const quizQuestions = [
        {
            question: "What primary material property allows us to see the insect inside the amber?",
            options: ["Reflectivity", "Transparency and Transmission", "Magnetism", "Density"],
            correct: 1,
            explanation: "Amber is semi-transparent. In computer graphics, we simulate this using transmission and IOR (Index of Refraction), allowing light to pass through.",
            difficulty: "Medium"
        },
        {
            question: "Why is amber uniquely suited for preserving prehistoric insects?",
            options: ["It freezes the insect instantly.", "It acts as a desiccant and creates an airtight seal.", "It emits radiation that kills bacteria.", "It is made of indestructible diamond-like carbon."],
            correct: 1,
            explanation: "Tree resin flows over organisms, encapsulating them. As it fossilizes into amber over millions of years, it creates an anoxic, dehydrated environment that prevents decay.",
            difficulty: "Easy"
        },
        {
            question: "In the context of the Biometric Scanner Ring, what does 'non-destructive analysis' mean?",
            options: ["Destroying the amber but saving the insect.", "Scanning without causing any damage to the specimen.", "Using acid to dissolve the outer layers.", "Applying extreme heat to melt the amber."],
            correct: 1,
            explanation: "Non-destructive techniques (like CT scanning) allow researchers to map the internal structures without breaking or altering the rare fossil.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const amber = parts.find(p => p.name === 'Amber Matrix')?.mesh;
        const ring = parts.find(p => p.name === 'Biometric Scanner Ring')?.mesh;
        const insect = parts.find(p => p.name === 'Trapped Specimen (Formicidae)')?.mesh;

        if (amber) {
            amber.rotation.y = time * speed * 0.1;
            amber.rotation.z = Math.sin(time * speed * 0.05) * 0.1;
        }
        
        if (insect) {
            insect.rotation.y = time * speed * 0.1 + Math.PI / 4;
            insect.position.y = 3 + Math.sin(time * speed * 0.5) * 0.05;
        }

        if (ring) {
            ring.rotation.x = Math.PI / 2 + Math.sin(time * speed * 0.2) * 0.2;
            ring.rotation.y = time * speed * 0.5;
            ring.position.y = 3 + Math.sin(time * speed) * 2;
            
            // Pulse hologram intensity
            ring.material.opacity = 0.15 + Math.sin(time * speed * 2) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAmberFossilResin() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
