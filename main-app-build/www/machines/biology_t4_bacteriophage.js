import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const capsidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x112244,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85
    });

    const dnaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    const sheathMaterial = new THREE.MeshStandardMaterial({
        color: 0x444455,
        metalness: 0.7,
        roughness: 0.3
    });

    const tailFiberMaterial = new THREE.MeshStandardMaterial({
        color: 0x223344,
        metalness: 0.8,
        roughness: 0.4,
        wireframe: false
    });

    const basePlateMaterial = new THREE.MeshStandardMaterial({
        color: 0x667788,
        metalness: 0.6,
        roughness: 0.5
    });

    // 1. Icosahedral Head (Capsid)
    const capsidGeo = new THREE.IcosahedronGeometry(2.5, 0); // basic icosahedron
    // Scale it to make it slightly elongated (prolate icosahedron)
    capsidGeo.scale(1, 1.2, 1);
    const capsid = new THREE.Mesh(capsidGeo, capsidMaterial);
    capsid.position.set(0, 5, 0);
    group.add(capsid);

    parts.push({
        name: "Icosahedral Head (Capsid)",
        description: "The protein shell that encloses the viral genome.",
        material: "capsidMaterial",
        function: "Protects and stores the viral DNA payload.",
        assemblyOrder: 1,
        connections: ["Viral DNA", "Collar"],
        failureEffect: "Exposure and degradation of the viral genome.",
        cascadeFailures: ["Viral DNA"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: capsid
    });

    // 2. Viral DNA (Inside Capsid)
    const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.2, 64, 8);
    const dna = new THREE.Mesh(dnaGeo, dnaMaterial);
    dna.position.set(0, 5, 0);
    group.add(dna);

    parts.push({
        name: "Viral DNA",
        description: "The double-stranded DNA genome of the virus.",
        material: "dnaMaterial",
        function: "Carries the genetic instructions for replicating the virus.",
        assemblyOrder: 2,
        connections: ["Icosahedral Head (Capsid)", "Tail Tube"],
        failureEffect: "Inability to replicate.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: dna
    });

    // 3. Collar
    const collarGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const collar = new THREE.Mesh(collarGeo, steel);
    collar.position.set(0, 2, 0);
    group.add(collar);

    parts.push({
        name: "Collar",
        description: "A ring-like structure connecting the head to the tail.",
        material: "steel",
        function: "Stabilizes the head-tail junction and holds the whiskers.",
        assemblyOrder: 3,
        connections: ["Icosahedral Head (Capsid)", "Contractile Sheath"],
        failureEffect: "Decapitation of the virus particle.",
        cascadeFailures: ["Contractile Sheath", "Tail Tube"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 5 },
        mesh: collar
    });

    // 4. Contractile Sheath
    const sheathGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    // Add ridges
    const sheathTextureGeo = new THREE.TorusGeometry(0.65, 0.1, 8, 16);
    const sheathGroup = new THREE.Group();
    const centralSheath = new THREE.Mesh(sheathGeo, sheathMaterial);
    sheathGroup.add(centralSheath);
    for(let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(sheathTextureGeo, sheathMaterial);
        ring.position.y = -1.2 + i * 0.48;
        ring.rotation.x = Math.PI / 2;
        sheathGroup.add(ring);
    }
    sheathGroup.position.set(0, 0, 0);
    group.add(sheathGroup);

    parts.push({
        name: "Contractile Sheath",
        description: "A spring-like protein sheath surrounding the tail tube.",
        material: "sheathMaterial",
        function: "Contracts to drive the tail tube through the bacterial cell wall.",
        assemblyOrder: 4,
        connections: ["Collar", "Base Plate"],
        failureEffect: "Inability to penetrate the host cell.",
        cascadeFailures: ["DNA Injection"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 },
        mesh: sheathGroup
    });

    // 5. Tail Tube (Inside Sheath)
    const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const tailTube = new THREE.Mesh(tubeGeo, glass);
    tailTube.position.set(0, 0, 0);
    group.add(tailTube);

    parts.push({
        name: "Tail Tube",
        description: "A hollow tube that acts as a conduit for the DNA.",
        material: "glass",
        function: "Provides a channel for DNA to travel from the head into the host cell.",
        assemblyOrder: 5,
        connections: ["Contractile Sheath", "Base Plate"],
        failureEffect: "DNA leakage during injection.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 },
        mesh: tailTube
    });

    // 6. Base Plate
    const basePlateGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 6);
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMaterial);
    basePlate.position.set(0, -1.7, 0);
    group.add(basePlate);

    parts.push({
        name: "Base Plate",
        description: "A complex multi-protein structure at the tip of the tail.",
        material: "basePlateMaterial",
        function: "Anchors the tail fibers and initiates sheath contraction upon host recognition.",
        assemblyOrder: 6,
        connections: ["Contractile Sheath", "Tail Fibers", "Tail Pins"],
        failureEffect: "Failure to lock onto the host cell surface.",
        cascadeFailures: ["Contractile Sheath"],
        originalPosition: { x: 0, y: -1.7, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: basePlate
    });

    // 7. Tail Fibers (6x)
    const fibersGroup = new THREE.Group();
    fibersGroup.position.set(0, -1.7, 0);
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        
        // Upper leg
        const upperLegGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
        const upperLeg = new THREE.Mesh(upperLegGeo, tailFiberMaterial);
        
        // Position and rotate upper leg
        upperLeg.position.x = Math.cos(angle) * 1.5;
        upperLeg.position.z = Math.sin(angle) * 1.5;
        upperLeg.position.y = 0.5;
        upperLeg.lookAt(0, 2, 0); // Angle upwards and inwards towards collar
        upperLeg.rotation.x += Math.PI / 2;

        // Joint
        const jointGeo = new THREE.SphereGeometry(0.15);
        const joint = new THREE.Mesh(jointGeo, chrome);
        joint.position.x = Math.cos(angle) * 2.5;
        joint.position.z = Math.sin(angle) * 2.5;
        joint.position.y = -0.5;

        // Lower leg
        const lowerLegGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const lowerLeg = new THREE.Mesh(lowerLegGeo, tailFiberMaterial);
        
        // Position and rotate lower leg
        lowerLeg.position.x = Math.cos(angle) * 3.5;
        lowerLeg.position.z = Math.sin(angle) * 3.5;
        lowerLeg.position.y = -1.5;
        
        // Simple rotation for lower leg to point down and out
        const axis = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
        lowerLeg.quaternion.setFromAxisAngle(axis, Math.PI / 4);

        const singleFiber = new THREE.Group();
        singleFiber.add(upperLeg);
        singleFiber.add(joint);
        singleFiber.add(lowerLeg);
        fibersGroup.add(singleFiber);
    }
    group.add(fibersGroup);

    parts.push({
        name: "Tail Fibers",
        description: "Long, jointed sensory appendages.",
        material: "tailFiberMaterial",
        function: "Recognize and bind to specific receptors on the bacterial surface.",
        assemblyOrder: 7,
        connections: ["Base Plate"],
        failureEffect: "Inability to find or bind to the correct host.",
        cascadeFailures: ["Base Plate Activation"],
        originalPosition: { x: 0, y: 0, z: 0 }, // Relative to group
        explodedPosition: { x: 0, y: -8, z: 0 },
        mesh: fibersGroup
    });


    // 8. Tail Pins (Spikes)
    const pinsGroup = new THREE.Group();
    pinsGroup.position.set(0, -1.9, 0);
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const pinGeo = new THREE.ConeGeometry(0.1, 0.6, 8);
        const pin = new THREE.Mesh(pinGeo, chrome);
        pin.position.x = Math.cos(angle) * 1.0;
        pin.position.z = Math.sin(angle) * 1.0;
        pin.position.y = -0.3;
        pin.rotation.x = Math.PI; // point downwards
        pinsGroup.add(pin);
    }
    group.add(pinsGroup);

    parts.push({
        name: "Tail Pins (Spikes)",
        description: "Short spikes located under the base plate.",
        material: "chrome",
        function: "Securely anchor the virus to the cell wall and puncture the outer membrane.",
        assemblyOrder: 8,
        connections: ["Base Plate"],
        failureEffect: "Weak attachment, preventing successful DNA injection.",
        cascadeFailures: ["Sheath Contraction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: pinsGroup
    });


    const quizQuestions = [
        {
            question: "What is the primary function of the contractile sheath in a T4 bacteriophage?",
            options: [
                "To store the viral DNA.",
                "To recognize specific receptors on the host cell.",
                "To contract and drive the tail tube through the bacterial cell wall.",
                "To synthesize new viral proteins."
            ],
            correct: 2,
            explanation: "The contractile sheath acts like a spring, contracting to push the inner tail tube through the host's cell wall to inject the DNA.",
            difficulty: "Medium"
        },
        {
            question: "Which component of the bacteriophage is responsible for initially recognizing and binding to the host bacterium?",
            options: [
                "Icosahedral Head",
                "Tail Fibers",
                "Base Plate",
                "Collar"
            ],
            correct: 1,
            explanation: "The long tail fibers act as sensory appendages that recognize and bind to specific receptor molecules on the surface of the target bacterium.",
            difficulty: "Easy"
        },
        {
            question: "What is the shape of the T4 bacteriophage head (capsid)?",
            options: [
                "Spherical",
                "Helical",
                "Prolate Icosahedral",
                "Complex asymmetric"
            ],
            correct: 2,
            explanation: "The head of the T4 phage is a prolate (elongated) icosahedron, which provides a highly efficient way to package its large double-stranded DNA genome.",
            difficulty: "Medium"
        }
    ];

    const description = "The T4 Bacteriophage is a complex, high-tech 'nanomachine' of the biological world. It specifically infects Escherichia coli bacteria. It consists of a large icosahedral head containing the viral DNA, a contractile tail, and sensory tail fibers. The injection mechanism is akin to a microscopic syringe, triggered when the tail fibers successfully bind to a host cell.";

    function animate(time, speed, meshes) {
        // DNA pulsing
        const viralDNA = parts.find(p => p.name === "Viral DNA")?.mesh;
        if (viralDNA) {
            viralDNA.rotation.x = time * speed;
            viralDNA.rotation.y = time * speed * 0.5;
            const pulse = Math.sin(time * speed * 3) * 0.5 + 0.5;
            viralDNA.material.emissiveIntensity = 1 + pulse * 2;
        }

        // Slight hovering of the entire phage
        group.position.y = Math.sin(time * speed * 2) * 0.2;

        // Tail fibers slightly moving like legs
        const tailFibersGroup = parts.find(p => p.name === "Tail Fibers")?.mesh;
        if (tailFibersGroup) {
            const fibers = tailFibersGroup.children;
            fibers.forEach((fiber, index) => {
                fiber.rotation.y = Math.sin(time * speed * 4 + index) * 0.1;
                // Move joint slightly
                fiber.children[0].rotation.z = Math.sin(time * speed * 4 + index) * 0.05;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createT4Bacteriophage() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
