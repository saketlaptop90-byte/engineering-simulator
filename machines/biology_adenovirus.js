import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for Adenovirus
    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff00aa,
        emissive: 0xff0055,
        emissiveIntensity: 1.2,
        metalness: 0.3,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffaaaa,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    
    // 1. Icosahedral Capsid
    const capsidGeometry = new THREE.IcosahedronGeometry(5, 1); // Subdivided icosahedron
    const capsidMesh = new THREE.Mesh(capsidGeometry, glowingBlue);
    capsidMesh.name = "Icosahedral Capsid";
    group.add(capsidMesh);

    parts.push({
        name: "Icosahedral Capsid",
        description: "The main protein shell of the adenovirus, protecting the viral genome.",
        material: "glowingBlue",
        function: "Protects the double-stranded DNA genome and facilitates cell entry.",
        assemblyOrder: 1,
        connections: ["Viral Genome", "Penton Bases"],
        failureEffect: "Exposure and degradation of the viral genome, neutralizing the virus.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Viral Genome (dsDNA Core)
    const genomeGeometry = new THREE.TorusKnotGeometry(2.5, 0.5, 100, 16);
    const genomeMesh = new THREE.Mesh(genomeGeometry, coreMaterial);
    genomeMesh.name = "Viral Genome";
    group.add(genomeMesh);

    parts.push({
        name: "Viral Genome",
        description: "Linear, double-stranded DNA molecule packed inside the capsid.",
        material: "coreMaterial",
        function: "Carries the genetic blueprint necessary for viral replication.",
        assemblyOrder: 2,
        connections: ["Icosahedral Capsid"],
        failureEffect: "Inability to replicate within the host cell.",
        cascadeFailures: ["Host Cell Hijacking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 3. Penton Bases and Fiber Knobs
    const pentonPositions = [
        [0, 5, 2.6], [0, -5, 2.6], [0, 5, -2.6], [0, -5, -2.6],
        [5, 2.6, 0], [-5, 2.6, 0], [5, -2.6, 0], [-5, -2.6, 0],
        [2.6, 0, 5], [-2.6, 0, 5], [2.6, 0, -5], [-2.6, 0, -5]
    ]; // Approximate vertices of an icosahedron (radius ~5.6)

    const fiberGroup = new THREE.Group();
    fiberGroup.name = "Fiber Knobs";
    group.add(fiberGroup);

    pentonPositions.forEach((pos, index) => {
        const vPos = new THREE.Vector3(...pos).normalize().multiplyScalar(5.5);
        
        // Penton Base
        const baseGeo = new THREE.CylinderGeometry(0.5, 0.8, 1, 6);
        const baseMesh = new THREE.Mesh(baseGeo, chrome);
        baseMesh.position.copy(vPos);
        baseMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vPos.clone().normalize());
        fiberGroup.add(baseMesh);

        // Fiber Shaft
        const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const shaftMesh = new THREE.Mesh(shaftGeo, darkSteel);
        shaftMesh.position.copy(vPos.clone().add(vPos.clone().normalize().multiplyScalar(2.5)));
        shaftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vPos.clone().normalize());
        fiberGroup.add(shaftMesh);

        // Fiber Knob
        const knobGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const knobMesh = new THREE.Mesh(knobGeo, neonPink);
        knobMesh.position.copy(vPos.clone().add(vPos.clone().normalize().multiplyScalar(5)));
        fiberGroup.add(knobMesh);
    });

    parts.push({
        name: "Penton Bases & Fiber Knobs",
        description: "Protrusions at the vertices of the capsid.",
        material: "neonPink / chrome / darkSteel",
        function: "Responsible for attaching to specific receptors on the surface of the host cell.",
        assemblyOrder: 3,
        connections: ["Icosahedral Capsid"],
        failureEffect: "Virus cannot bind to or infect host cells.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the adenovirus fiber knobs?",
            options: [
                "To store genetic material",
                "To synthesize proteins",
                "To attach to host cell receptors",
                "To provide energy for the virus"
            ],
            correct: 2,
            explanation: "The fiber knobs, located at the ends of the penton fibers, are specialized structures that bind to specific receptors on the surface of a target cell, initiating infection.",
            difficulty: "easy"
        },
        {
            question: "What geometric shape characterizes the main capsid of an adenovirus?",
            options: [
                "Helical",
                "Icosahedral",
                "Complex",
                "Spherical"
            ],
            correct: 1,
            explanation: "Adenoviruses have a non-enveloped icosahedral capsid, which is a polyhedron with 20 faces, providing a robust container for the viral genome.",
            difficulty: "easy"
        },
        {
            question: "Which component of the adenovirus is responsible for containing its linear double-stranded DNA?",
            options: [
                "Fiber Knobs",
                "Penton Base",
                "Icosahedral Capsid",
                "Viral Envelope"
            ],
            correct: 2,
            explanation: "The icosahedral capsid is the protein shell that encloses and protects the adenovirus's double-stranded DNA genome.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire capsid slowly
        const capsid = meshes.find(m => m.name === "Icosahedral Capsid");
        if (capsid) {
            capsid.rotation.x = time * 0.2 * speed;
            capsid.rotation.y = time * 0.3 * speed;
            
            // Pulsate emission
            capsid.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(time * 2 * speed);
        }

        // Pulse and rotate genome core
        const genome = meshes.find(m => m.name === "Viral Genome");
        if (genome) {
            genome.rotation.x = -time * 0.5 * speed;
            genome.rotation.y = -time * 0.4 * speed;
            genome.scale.setScalar(1 + 0.05 * Math.sin(time * 3 * speed));
        }

        // Rotate fiber knobs group
        const fiberGroup = meshes.find(m => m.name === "Fiber Knobs");
        if (fiberGroup) {
            fiberGroup.rotation.x = time * 0.2 * speed;
            fiberGroup.rotation.y = time * 0.3 * speed;
        }
    }

    return { group, parts, description: "Detailed 3D model of an Adenovirus featuring an Icosahedral Capsid, Penton Bases, and Fiber Knobs.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createAdenovirusCapsid() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
