import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const neonVeinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        transmission: 0.5
    });

    const bioGelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.5
    });

    const scaffoldMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.3,
        roughness: 0.6,
        wireframe: true
    });

    const meshes = {};

    // Base Platform (aluminum)
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, aluminum);
    baseMesh.position.set(0, 0, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Containment Base",
        description: "Provides stable support and power delivery to the synthetic matrix.",
        material: "Aluminum",
        function: "Structural foundation and power routing.",
        assemblyOrder: 1,
        connections: ["Bio-Chamber Glass"],
        failureEffect: "System destabilization and potential bio-fluid leakage.",
        cascadeFailures: ["Scaffold Integrity Loss"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // Bio-Chamber Glass
    const chamberGeo = new THREE.CylinderGeometry(4.8, 4.8, 10, 32, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeo, tinted);
    chamberMesh.position.set(0, 5, 0);
    group.add(chamberMesh);
    meshes.chamber = chamberMesh;
    
    parts.push({
        name: "Incubation Chamber",
        description: "Maintains sterile, temperature-controlled environment.",
        material: "Tinted Glass",
        function: "Atmospheric and biological containment.",
        assemblyOrder: 2,
        connections: ["Containment Base", "Scaffold Matrix"],
        failureEffect: "Contamination of the tissue culture.",
        cascadeFailures: ["Cellular Necrosis"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // Scaffold Matrix
    const scaffoldGeo = new THREE.IcosahedronGeometry(2.5, 3);
    const scaffoldMesh = new THREE.Mesh(scaffoldGeo, scaffoldMaterial);
    scaffoldMesh.position.set(0, 5, 0);
    group.add(scaffoldMesh);
    meshes.scaffold = scaffoldMesh;

    parts.push({
        name: "Tissue Scaffold Matrix",
        description: "Biodegradable 3D printed lattice for cellular growth.",
        material: "Bio-Polymer (Wireframe)",
        function: "Guides cellular alignment and structural formation.",
        assemblyOrder: 3,
        connections: ["Vascular Network", "Incubation Chamber"],
        failureEffect: "Organ deformation and structural collapse.",
        cascadeFailures: ["Vascular Rupture", "Tissue Rejection"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: 5, z: 10}
    });

    // Vascular Network
    const vascularGeo = new THREE.TorusKnotGeometry(1.8, 0.2, 100, 16);
    const vascularMesh = new THREE.Mesh(vascularGeo, neonVeinMaterial);
    vascularMesh.position.set(0, 5, 0);
    group.add(vascularMesh);
    meshes.vascular = vascularMesh;

    parts.push({
        name: "Synthetic Vascular Network",
        description: "Pulsing neon-infused tubing for nutrient and oxygen delivery.",
        material: "Neon Polymer",
        function: "Perfusion of the growing organ matrix.",
        assemblyOrder: 4,
        connections: ["Scaffold Matrix", "Nutrient Pump"],
        failureEffect: "Ischemia and localized tissue death.",
        cascadeFailures: ["Organ Failure"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: -10, y: 5, z: 0}
    });

    // Bio-Gel Core
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeo, bioGelMaterial);
    coreMesh.position.set(0, 5, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Stem Cell Core Matrix",
        description: "Concentrated hub of undifferentiated cells suspended in nutrient hydrogel.",
        material: "Bio-Gel",
        function: "Primary source of cellular proliferation.",
        assemblyOrder: 5,
        connections: ["Vascular Network", "Scaffold Matrix"],
        failureEffect: "Stunted organ growth.",
        cascadeFailures: ["Complete Cultivation Failure"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 10, y: 5, z: 0}
    });

    // Top Cap (chrome)
    const capGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const capMesh = new THREE.Mesh(capGeo, chrome);
    capMesh.position.set(0, 10.25, 0);
    group.add(capMesh);
    meshes.cap = capMesh;

    parts.push({
        name: "Environmental Seal",
        description: "Pressurizes the chamber and houses sensor arrays.",
        material: "Chrome",
        function: "Seals the system and monitors growth metrics.",
        assemblyOrder: 6,
        connections: ["Incubation Chamber"],
        failureEffect: "Loss of pressure and sensor data.",
        cascadeFailures: ["Unregulated Growth"],
        originalPosition: {x: 0, y: 10.25, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });


    const description = "The Bio-Synthetic Organ Matrix is a state-of-the-art tissue engineering scaffold. It utilizes a biodegradable wireframe lattice combined with a pulsating, neon-infused synthetic vascular network to cultivate complex organs in a sterile, temperature-controlled bio-gel environment.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Tissue Scaffold Matrix?",
            options: ["To pump nutrients into the chamber", "To guide cellular alignment and structural formation", "To maintain chamber pressure", "To provide a power source"],
            correct: 1,
            explanation: "The tissue scaffold acts as a 3D blueprint, allowing cells to attach and grow in the correct shape to form the desired organ.",
            difficulty: "easy"
        },
        {
            question: "What cascade failure is most likely if the Synthetic Vascular Network fails?",
            options: ["Loss of sensor data", "System destabilization", "Organ Failure due to ischemia", "Over-pressurization"],
            correct: 2,
            explanation: "Without the vascular network delivering nutrients and oxygen, the growing tissue will suffer from ischemia (lack of blood supply) leading to cell death and organ failure.",
            difficulty: "medium"
        },
        {
            question: "Why is a hydrogel (Bio-Gel) used in the core matrix?",
            options: ["To cool down the system", "To look visually appealing", "To provide a supportive, nutrient-rich suspension for stem cells", "To block radiation"],
            correct: 2,
            explanation: "Hydrogels closely mimic the natural extracellular matrix, providing an ideal, hydrated environment that supports cell viability and proliferation.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, explodedProgress) {
        // time: elapsed time in seconds
        // speed: playback speed multiplier
        // explodedProgress: 0 (assembled) to 1 (fully exploded)
        
        const t = time * speed;

        if (meshes.vascular) {
            const pulse = (Math.sin(t * 3) + 1) / 2;
            neonVeinMaterial.emissiveIntensity = 1.0 + pulse * 2.0;
            meshes.vascular.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1 + pulse * 0.05);
        }

        if (meshes.scaffold) {
            meshes.scaffold.rotation.y = t * 0.5;
            meshes.scaffold.rotation.x = t * 0.2;
        }

        if (meshes.core) {
            meshes.core.rotation.y = -t * 0.3;
        }

        parts.forEach((part, index) => {
            const meshName = Object.keys(meshes)[index];
            const mesh = meshes[meshName];
            if (mesh) {
                mesh.position.x = THREE.MathUtils.lerp(part.originalPosition.x, part.explodedPosition.x, explodedProgress);
                if (mesh !== meshes.core || explodedProgress > 0) {
                     mesh.position.y = THREE.MathUtils.lerp(part.originalPosition.y, part.explodedPosition.y, explodedProgress);
                } else {
                     mesh.position.y = part.originalPosition.y + Math.sin(t * 2) * 0.2;
                }
                mesh.position.z = THREE.MathUtils.lerp(part.originalPosition.z, part.explodedPosition.z, explodedProgress);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSyntheticOrganMatrix() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
