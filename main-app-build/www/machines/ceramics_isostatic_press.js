import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Material
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500, emissive: 0xff3300, emissiveIntensity: 2,
        transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8
    });

    const bodyGeo = new THREE.CylinderGeometry(4, 4, 10, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.position.set(0, 5, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Pressure Vessel",
        description: "Massive ultra-high pressure steel chamber.",
        material: "Dark Steel",
        function: "Contains the isostatic fluid at extreme pressures.",
        assemblyOrder: 1,
        connections: ["Hydraulic Pump", "Ceramic Mold"],
        failureEffect: "Catastrophic decompression and shrapnel.",
        cascadeFailures: ["Rupture of fluid lines"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:15, z:0}
    });

    const moldGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const moldMesh = new THREE.Mesh(moldGeo, neonOrange);
    moldMesh.position.set(0, 5, 0);
    group.add(moldMesh);
    parts.push({
        name: "Ceramic Powder Mold",
        description: "Flexible rubber or elastomer mold filled with ceramic powder.",
        material: "Rubber / Ceramic",
        function: "Compresses uniformly from all sides.",
        assemblyOrder: 2,
        connections: ["Pressure Vessel"],
        failureEffect: "Uneven powder density.",
        cascadeFailures: ["Cracking during sintering"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:10}
    });

    const pumpGeo = new THREE.BoxGeometry(3, 4, 3);
    const pumpMesh = new THREE.Mesh(pumpGeo, chrome);
    pumpMesh.position.set(5, 2, 0);
    group.add(pumpMesh);
    parts.push({
        name: "Hydraulic Intensifier",
        description: "High-tech fluid pump system.",
        material: "Chrome/Aluminum",
        function: "Pumps fluid into the vessel to reach isostatic pressure.",
        assemblyOrder: 3,
        connections: ["Pressure Vessel"],
        failureEffect: "Loss of pressure.",
        cascadeFailures: ["Incomplete part formation"],
        originalPosition: {x:5, y:2, z:0},
        explodedPosition: {x:15, y:2, z:0}
    });

    const description = "Ceramics Isostatic Press: Uses extreme fluid pressure applied uniformly from all directions to compact ceramic powders into highly dense, uniform parts.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of isostatic pressing over uniaxial pressing?",
            options: ["Uniform density from all directions", "Faster cycle time", "Lower pressure requirements", "No need for molds"],
            correct: 0,
            explanation: "Isostatic pressing applies pressure equally from all directions, resulting in uniform density without internal stress gradients.",
            difficulty: "Medium"
        },
        {
            question: "What material is typically used for the mold in cold isostatic pressing (CIP)?",
            options: ["Hardened Steel", "Elastomer or Rubber", "Glass", "Tungsten Carbide"],
            correct: 1,
            explanation: "Flexible elastomer or rubber molds are used to transmit the fluid pressure directly to the ceramic powder.",
            difficulty: "Hard"
        },
        {
            question: "What fluid is typically used to transmit pressure in CIP?",
            options: ["Liquid Nitrogen", "Water or Oil", "Molten Metal", "Compressed Air"],
            correct: 1,
            explanation: "Water or specialized oils are used as the incompressible fluid medium to transmit pressure.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the mold to simulate compression
        const scale = 1.0 - 0.1 * Math.sin(time * speed * 2);
        if (meshes[1]) meshes[1].scale.set(scale, scale, scale);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createIsostaticPress() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
