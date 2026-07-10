import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const bioGelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        transparent: true,
        emissive: 0x004433,
        emissiveIntensity: 0.2
    });

    const neonRedBlood = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9
    });

    const glowBlueCore = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5
    });

    const sterileWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5.5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -2, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Sterile Base Platform",
        description: "Vibration-dampened magnetic base for precise organoid printing.",
        material: "darkSteel",
        function: "Structural support and vibration isolation.",
        assemblyOrder: 1,
        connections: ["mainPillar"],
        failureEffect: "Micro-vibrations blur capillary structures.",
        cascadeFailures: ["extruderNozzle"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Central Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1, 6, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, sterileWhite);
    pillarMesh.position.set(-3, 1, 0);
    group.add(pillarMesh);
    meshes.pillar = pillarMesh;
    parts.push({
        name: "Main Support Pillar",
        description: "Houses the z-axis linear actuators and bio-ink conduits.",
        material: "sterileWhite",
        function: "Vertical movement control and fluid routing.",
        assemblyOrder: 2,
        connections: ["base", "armBase"],
        failureEffect: "Z-axis resolution drops, causing layer delamination.",
        cascadeFailures: ["armBase"],
        originalPosition: { x: -3, y: 1, z: 0 },
        explodedPosition: { x: -8, y: 1, z: 0 }
    });

    // 3. Extruder Arm Base
    const armBaseGeo = new THREE.BoxGeometry(3, 1, 1.5);
    const armBaseMesh = new THREE.Mesh(armBaseGeo, aluminum);
    armBaseMesh.position.set(-1.5, 3.5, 0);
    group.add(armBaseMesh);
    meshes.armBase = armBaseMesh;
    parts.push({
        name: "Actuator Arm Mount",
        description: "High-precision stepper motor housing for the X-Y gantry.",
        material: "aluminum",
        function: "Translates the extruder head across the printing plane.",
        assemblyOrder: 3,
        connections: ["pillar", "extruderHead"],
        failureEffect: "XY misalignment leading to network occlusion.",
        cascadeFailures: ["extruderHead"],
        originalPosition: { x: -1.5, y: 3.5, z: 0 },
        explodedPosition: { x: -1.5, y: 7, z: 0 }
    });

    // 4. Extruder Head (Main Body)
    const headGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 16);
    const headMesh = new THREE.Mesh(headGeo, chrome);
    headMesh.position.set(1.5, 3.5, 0);
    group.add(headMesh);
    meshes.head = headMesh;
    parts.push({
        name: "Co-Axial Extruder Head",
        description: "Dual-chamber microfluidic head for hydrogel and endothelial cells.",
        material: "chrome",
        function: "Combines matrix gel with cell lines in real-time.",
        assemblyOrder: 4,
        connections: ["armBase", "nozzle", "gelReservoir"],
        failureEffect: "Cell death due to shear stress variations.",
        cascadeFailures: ["nozzle"],
        originalPosition: { x: 1.5, y: 3.5, z: 0 },
        explodedPosition: { x: 5, y: 7, z: 0 }
    });

    // 5. Bio-Gel Reservoir
    const reservoirGeo = new THREE.SphereGeometry(1, 32, 32);
    const reservoirMesh = new THREE.Mesh(reservoirGeo, bioGelMaterial);
    reservoirMesh.position.set(1.5, 5, 0);
    group.add(reservoirMesh);
    meshes.reservoir = reservoirMesh;
    parts.push({
        name: "Hydrogel Matrix Reservoir",
        description: "Temperature-controlled chamber holding the support matrix.",
        material: "bioGelMaterial",
        function: "Stores and thermalizes the hydrogel before extrusion.",
        assemblyOrder: 5,
        connections: ["head"],
        failureEffect: "Gel solidifies prematurely, clogging the system.",
        cascadeFailures: ["head"],
        originalPosition: { x: 1.5, y: 5, z: 0 },
        explodedPosition: { x: 5, y: 9, z: 0 }
    });

    // 6. Extrusion Nozzle
    const nozzleGeo = new THREE.ConeGeometry(0.3, 1, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, copper);
    nozzleMesh.rotation.x = Math.PI;
    nozzleMesh.position.set(1.5, 2, 0);
    group.add(nozzleMesh);
    meshes.nozzle = nozzleMesh;
    parts.push({
        name: "Micro-Capillary Nozzle",
        description: "10-micron diameter tip for single-cell line extrusion.",
        material: "copper",
        function: "Precise deposition of endothelial cells into the gel matrix.",
        assemblyOrder: 6,
        connections: ["head", "laserCurer"],
        failureEffect: "Uneven vessel walls leading to simulated aneurysms.",
        cascadeFailures: ["printBed"],
        originalPosition: { x: 1.5, y: 2, z: 0 },
        explodedPosition: { x: 5, y: 2, z: 0 }
    });

    // 7. UV Crosslinking Laser
    const laserGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const laserMesh = new THREE.Mesh(laserGeo, glowBlueCore);
    laserMesh.position.set(2.2, 2.2, 0);
    laserMesh.rotation.z = Math.PI / 4;
    group.add(laserMesh);
    meshes.laser = laserMesh;
    parts.push({
        name: "UV Curing Laser",
        description: "Low-intensity UV diode to instantly crosslink the hydrogel.",
        material: "glowBlueCore",
        function: "Solidifies the printed matrix to hold capillaries in place.",
        assemblyOrder: 7,
        connections: ["head"],
        failureEffect: "Matrix collapses before solidifying.",
        cascadeFailures: [],
        originalPosition: { x: 2.2, y: 2.2, z: 0 },
        explodedPosition: { x: 6, y: 2.2, z: 0 }
    });

    // 8. Capillary Output (The Printed Part)
    const printedGeo = new THREE.TorusKnotGeometry(1.5, 0.1, 100, 16);
    const printedMesh = new THREE.Mesh(printedGeo, neonRedBlood);
    printedMesh.position.set(1.5, 0, 0);
    printedMesh.rotation.x = Math.PI / 2;
    group.add(printedMesh);
    meshes.printed = printedMesh;
    parts.push({
        name: "Printed Capillary Network",
        description: "An intricate, glowing network of bio-printed blood vessels.",
        material: "neonRedBlood",
        function: "Simulates the vascularization of engineered tissue.",
        assemblyOrder: 8,
        connections: ["base"],
        failureEffect: "Necrosis in the target organoid.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 1.5, y: 0, z: 5 }
    });

    const description = "The Bio-Capillary Network Extruder represents the pinnacle of tissue engineering. By utilizing a co-axial extrusion method, it simultaneously deposits a photosensitive hydrogel matrix and a continuous line of endothelial cells. A synchronized UV laser crosslinks the matrix instantly, locking the microscopic blood vessels in 3D space, enabling the vascularization of complex artificial organs.";

    const quizQuestions = [
        {
            question: "Why is a co-axial extrusion head critical for this machine?",
            options: [
                "It prints faster by using two identical nozzles",
                "It allows simultaneous printing of the support matrix and the inner cell line",
                "It cools the bio-ink before it leaves the nozzle",
                "It cleans the nozzle automatically during printing"
            ],
            correct: 1,
            explanation: "Co-axial extrusion allows a core material (cells) to be surrounded by a sheath material (hydrogel matrix), forming a tube-like structure instantly.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the UV curing laser?",
            options: [
                "To sterilize the print bed",
                "To kill unwanted bacteria in the bio-ink",
                "To instantly crosslink (solidify) the hydrogel matrix",
                "To heat the nozzle to extrusion temperature"
            ],
            correct: 2,
            explanation: "The UV laser activates photo-initiators in the hydrogel, turning it from a liquid to a solid to support the delicate capillaries.",
            difficulty: "Easy"
        },
        {
            question: "What cascade failure results from micro-vibrations in the Sterile Base Platform?",
            options: [
                "The UV laser overheats",
                "The bio-gel solidifies in the reservoir",
                "Z-axis resolution drops leading to layer delamination",
                "Blurring of the capillary structures and extruder nozzle misalignment"
            ],
            correct: 3,
            explanation: "Vibrations at the micron scale directly impact the precision of the extruder nozzle, ruining the fine structure of the capillaries.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshesObj) => {
        const t = time * speed;
        
        // Extruder head moves slightly to simulate printing
        meshesObj.head.position.x = 1.5 + Math.sin(t * 2) * 0.5;
        meshesObj.head.position.z = Math.cos(t * 1.5) * 0.5;
        
        // Nozzle follows the head
        meshesObj.nozzle.position.x = meshesObj.head.position.x;
        meshesObj.nozzle.position.z = meshesObj.head.position.z;

        // Laser follows the head and pulses
        meshesObj.laser.position.x = meshesObj.head.position.x + 0.7;
        meshesObj.laser.position.z = meshesObj.head.position.z;
        meshesObj.laser.material.emissiveIntensity = 1.5 + Math.sin(t * 10) * 0.5;

        // Reservoir pulses slightly
        meshesObj.reservoir.position.x = meshesObj.head.position.x;
        meshesObj.reservoir.position.z = meshesObj.head.position.z;
        meshesObj.reservoir.scale.setScalar(1 + Math.sin(t * 4) * 0.02);

        // Printed network rotates and pulses slowly
        meshesObj.printed.rotation.z = t * 0.2;
        meshesObj.printed.material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 1.0;
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createCapillaryNetworkExtruder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
