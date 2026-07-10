import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const capsidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4488ff,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const dnaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.2
    });

    const glowingCellMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    // 1. Capsid (Head)
    const capsidGeometry = new THREE.IcosahedronGeometry(2, 0);
    const capsidMesh = new THREE.Mesh(capsidGeometry, capsidMaterial);
    capsidMesh.position.set(0, 7, 0);
    group.add(capsidMesh);
    parts.push({
        name: "Icosahedral Head (Capsid)",
        description: "The protective protein shell that encloses the viral genetic material.",
        material: "capsidMaterial",
        function: "Protects the viral DNA from degradation and delivers it to the host cell.",
        assemblyOrder: 1,
        connections: ["Collar", "Viral DNA"],
        failureEffect: "Viral DNA would be exposed and destroyed by environmental enzymes.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });
    
    // 2. Viral DNA
    const dnaGeometry = new THREE.TorusKnotGeometry(0.8, 0.2, 120, 16);
    const dnaMesh = new THREE.Mesh(dnaGeometry, dnaMaterial);
    dnaMesh.position.set(0, 7, 0);
    group.add(dnaMesh);
    parts.push({
        name: "Viral DNA",
        description: "The glowing genetic blueprint of the bacteriophage.",
        material: "dnaMaterial",
        function: "Hijacks the host cell's machinery to produce new phages.",
        assemblyOrder: 2,
        connections: ["Icosahedral Head (Capsid)"],
        failureEffect: "The virus could not replicate inside the host.",
        cascadeFailures: ["Replication"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 4 }
    });

    // 3. Collar
    const collarGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const collarMesh = new THREE.Mesh(collarGeometry, bodyMaterial);
    collarMesh.position.set(0, 5, 0);
    group.add(collarMesh);
    parts.push({
        name: "Collar",
        description: "The connecting structure between the head and the tail.",
        material: "bodyMaterial",
        function: "Attaches the head to the tail sheath.",
        assemblyOrder: 3,
        connections: ["Icosahedral Head (Capsid)", "Tail Sheath"],
        failureEffect: "The head would detach from the tail.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -4, y: 8, z: 0 }
    });

    // 4. Tail Sheath
    const sheathGeometry = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
    const sheathMesh = new THREE.Mesh(sheathGeometry, chrome);
    sheathMesh.position.set(0, 2.75, 0);
    group.add(sheathMesh);
    parts.push({
        name: "Tail Sheath",
        description: "A contractile structure surrounding the tail tube.",
        material: "chrome",
        function: "Contracts to drive the tail tube through the host's cell membrane.",
        assemblyOrder: 4,
        connections: ["Collar", "Baseplate", "Tail Tube"],
        failureEffect: "The virus could not puncture the host cell membrane.",
        cascadeFailures: ["DNA Injection"],
        originalPosition: { x: 0, y: 2.75, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 5. Tail Tube (Inner)
    const tubeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 32);
    const tubeMesh = new THREE.Mesh(tubeGeometry, darkSteel);
    tubeMesh.position.set(0, 2.5, 0);
    group.add(tubeMesh);
    parts.push({
        name: "Tail Tube",
        description: "A hollow tube that acts as a conduit for the viral DNA.",
        material: "darkSteel",
        function: "Creates a channel through which the viral DNA is injected into the host.",
        assemblyOrder: 5,
        connections: ["Tail Sheath", "Baseplate"],
        failureEffect: "Viral DNA would spill out instead of entering the host cell.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 4, y: 5, z: 0 }
    });

    // 6. Baseplate
    const baseplateGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 6);
    const baseplateMesh = new THREE.Mesh(baseplateGeometry, bodyMaterial);
    baseplateMesh.position.set(0, 0.5, 0);
    group.add(baseplateMesh);
    parts.push({
        name: "Baseplate",
        description: "The structure at the base of the tail to which tail fibers attach.",
        material: "bodyMaterial",
        function: "Coordinates the attachment to the host cell and triggers the contraction of the tail sheath.",
        assemblyOrder: 6,
        connections: ["Tail Sheath", "Tail Fibers"],
        failureEffect: "The virus could not securely attach to the host cell.",
        cascadeFailures: ["Infection Process"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 7. Tail Fibers (Legs)
    const fibersGroup = new THREE.Group();
    fibersGroup.position.set(0, 0.5, 0);
    for (let i = 0; i < 6; i++) {
        const fiberGroup = new THREE.Group();
        const upperFiberGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
        const upperFiber = new THREE.Mesh(upperFiberGeometry, steel);
        upperFiber.position.set(1.5, -0.8, 0);
        upperFiber.rotation.z = Math.PI / 4;
        
        const lowerFiberGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
        const lowerFiber = new THREE.Mesh(lowerFiberGeometry, steel);
        lowerFiber.position.set(3, -2.5, 0);
        lowerFiber.rotation.z = -Math.PI / 6;

        fiberGroup.add(upperFiber);
        fiberGroup.add(lowerFiber);
        fiberGroup.rotation.y = (Math.PI / 3) * i;
        fibersGroup.add(fiberGroup);
    }
    group.add(fibersGroup);
    parts.push({
        name: "Tail Fibers",
        description: "Long, leg-like appendages extending from the baseplate.",
        material: "steel",
        function: "Recognize and bind to specific receptor sites on the host cell surface.",
        assemblyOrder: 7,
        connections: ["Baseplate"],
        failureEffect: "The virus could not locate or bind to a suitable host.",
        cascadeFailures: ["Attachment"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 8. Host Cell Membrane
    const cellGeometry = new THREE.PlaneGeometry(25, 25, 20, 20);
    const cellMesh = new THREE.Mesh(cellGeometry, glowingCellMaterial);
    cellMesh.rotation.x = -Math.PI / 2;
    cellMesh.position.set(0, -2, 0);
    group.add(cellMesh);
    parts.push({
        name: "Host Cell Membrane",
        description: "The outer boundary of the bacterial cell being infected.",
        material: "glowingCellMaterial",
        function: "Provides the surface receptors for the bacteriophage to bind to and the barrier to be breached.",
        assemblyOrder: 8,
        connections: ["Tail Fibers"],
        failureEffect: "Without a host cell membrane, infection cannot occur.",
        cascadeFailures: ["Replication Cycle"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    const description = "A highly detailed, visually stunning simulation of a bacteriophage virus, representing its complex infection machinery and interaction with a host cell membrane.";

    const quizQuestions = [
        {
            question: "What is the function of the bacteriophage's tail sheath?",
            options: ["To store viral DNA", "To contract and drive the tail tube through the host membrane", "To recognize host cell receptors", "To synthesize new viral proteins"],
            correct: 1,
            explanation: "The tail sheath acts like a syringe, contracting to puncture the host cell membrane and inject viral DNA.",
            difficulty: "Medium"
        },
        {
            question: "Where is the viral DNA stored before infection?",
            options: ["In the baseplate", "In the tail fibers", "In the icosahedral head (capsid)", "In the collar"],
            correct: 2,
            explanation: "The viral DNA is enclosed and protected within the icosahedral protein capsid (head) of the bacteriophage.",
            difficulty: "Easy"
        },
        {
            question: "What structures allow the bacteriophage to recognize and bind to specific host cells?",
            options: ["The tail tube", "The tail fibers", "The capsid", "The tail sheath"],
            correct: 1,
            explanation: "The tail fibers are responsible for identifying and binding to specific receptor molecules on the surface of the host cell.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const timeFactor = time * speed;
        
        // Spin the viral DNA inside the capsid
        if (meshes && meshes[1]) {
            meshes[1].rotation.x = timeFactor * 2.0;
            meshes[1].rotation.y = timeFactor * 3.0;
        }

        // Simulating the infection process - sheath contraction and head dropping
        const contractCycle = Math.sin(timeFactor * 1.5);
        if (contractCycle > 0.5) {
            const contractionAmount = (contractCycle - 0.5) * 2; // 0 to 1
            if (meshes && meshes[3]) {
                meshes[3].scale.y = 1 - (contractionAmount * 0.4);
                meshes[3].position.y = 2.75 - (contractionAmount * 0.8);
            }
            if (meshes && meshes[0] && meshes[1] && meshes[2]) {
                const moveDown = contractionAmount * 1.6;
                meshes[0].position.y = 7 - moveDown;
                meshes[1].position.y = 7 - moveDown;
                meshes[2].position.y = 5 - moveDown;
                
                // Injecting DNA effect: scale down DNA in head
                meshes[1].scale.setScalar(Math.max(0.2, 1 - contractionAmount * 0.8));
            }
        } else {
            if (meshes && meshes[3]) {
                meshes[3].scale.y = 1;
                meshes[3].position.y = 2.75;
            }
            if (meshes && meshes[0] && meshes[1] && meshes[2]) {
                meshes[0].position.y = 7;
                meshes[1].position.y = 7;
                meshes[2].position.y = 5;
                meshes[1].scale.setScalar(1);
            }
        }
        
        // Host cell membrane glowing and pulsating
        if (meshes && meshes[7]) {
            meshes[7].material.emissiveIntensity = 0.5 + 0.5 * Math.sin(timeFactor * 3);
            meshes[7].position.y = -2 + 0.1 * Math.sin(timeFactor * 2);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBacteriophageVirus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
