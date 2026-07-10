import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const moltenGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.1,
        ior: 1.5
    });

    const flameMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    // 1. Central Hub
    const hubGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const hubMesh = new THREE.Mesh(hubGeometry, darkSteel);
    const hubPos = { x: 0, y: 0, z: 0 };
    hubMesh.position.set(hubPos.x, hubPos.y, hubPos.z);
    group.add(hubMesh);
    meshes.hub = hubMesh;
    parts.push({
        name: "Central Hub",
        description: "The main rotating core that distributes power and orchestrates the carousel's rotation.",
        material: "Dark Steel",
        function: "Rotates the entire carousel assembly and coordinates the timing of each station.",
        assemblyOrder: 1,
        connections: ["Support Arms", "Main Drive Motor"],
        failureEffect: "Carousel rotation ceases, disrupting the entire manufacturing pipeline.",
        cascadeFailures: ["Molten Glass Cooling Prematurely", "Burner Misalignment"],
        originalPosition: hubPos,
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Carousel Arms (4 Arms)
    const armsGroup = new THREE.Group();
    meshes.arms = [];
    const armGeometry = new THREE.BoxGeometry(4, 0.2, 0.4);
    for (let i = 0; i < 4; i++) {
        const armMesh = new THREE.Mesh(armGeometry, aluminum);
        const angle = (Math.PI / 2) * i;
        const radius = 2.0;
        armMesh.position.set(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
        armMesh.rotation.y = -angle;
        armsGroup.add(armMesh);
        meshes.arms.push(armMesh);
    }
    group.add(armsGroup);
    parts.push({
        name: "Articulated Carousel Arms",
        description: "Four reinforced aluminum arms that transport glass blanks between processing stations.",
        material: "Aluminum",
        function: "Holds the glass blowpipes and rotates them through the heating, blowing, and cooling phases.",
        assemblyOrder: 2,
        connections: ["Central Hub", "Blowpipes"],
        failureEffect: "Arms lock in place; glass cannot advance to the next station.",
        cascadeFailures: ["Product Rejection", "Thermal Stress Fractures"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 0.1, z: -5 }
    });

    // 3. Blowpipes
    meshes.blowpipes = [];
    meshes.glassBlobs = [];
    const pipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
    const blobGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    for (let i = 0; i < 4; i++) {
        const pipeMesh = new THREE.Mesh(pipeGeometry, steel);
        const angle = (Math.PI / 2) * i;
        const radius = 4;
        pipeMesh.position.set(Math.cos(angle) * radius, -1.0, Math.sin(angle) * radius);
        
        const blobMesh = new THREE.Mesh(blobGeometry, moltenGlassMat.clone());
        blobMesh.position.set(0, -1.5, 0); // Bottom of the pipe
        pipeMesh.add(blobMesh);
        
        armsGroup.add(pipeMesh);
        meshes.blowpipes.push(pipeMesh);
        meshes.glassBlobs.push(blobMesh);
    }
    parts.push({
        name: "Pneumatic Blowpipes & Glass Blobs",
        description: "Hollow steel tubes carrying molten glass, equipped with pneumatic valves for automated blowing.",
        material: "Steel / Molten Glass",
        function: "Injects compressed air into the molten glass to form hollow vessels.",
        assemblyOrder: 3,
        connections: ["Carousel Arms", "Pneumatic System"],
        failureEffect: "Air leak prevents proper expansion of the glass.",
        cascadeFailures: ["Misshapen Vessels", "Glass Collapse"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 5, y: -1, z: 0 }
    });

    // 4. Burner Station
    const burnerGroup = new THREE.Group();
    const burnerBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), darkSteel);
    burnerBase.position.set(4, -2.5, 0);
    const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 16), flameMat);
    flameMesh.position.set(4, -1.25, 0);
    burnerGroup.add(burnerBase);
    burnerGroup.add(flameMesh);
    group.add(burnerGroup);
    meshes.flame = flameMesh;
    parts.push({
        name: "High-Intensity Gas Burner",
        description: "An automated multi-nozzle gas burner that maintains the glass at optimal working temperature.",
        material: "Dark Steel",
        function: "Provides intense, focused heat to keep the silica mixture malleable.",
        assemblyOrder: 4,
        connections: ["Gas Supply Line", "Thermal Sensors"],
        failureEffect: "Temperature drops, causing glass to harden prematurely.",
        cascadeFailures: ["Shattering Glass", "Mechanical Strain on Blowpipes"],
        originalPosition: { x: 4, y: -2.5, z: 0 },
        explodedPosition: { x: 8, y: -2.5, z: 0 }
    });

    // 5. Cooling Mold Station
    const moldGeometry = new THREE.CylinderGeometry(0.6, 0.4, 1.2, 16, 1, true);
    const moldMesh = new THREE.Mesh(moldGeometry, chrome);
    moldMesh.position.set(-4, -2.5, 0);
    group.add(moldMesh);
    meshes.mold = moldMesh;
    parts.push({
        name: "Precision Cooling Mold",
        description: "A two-part chrome mold that shapes the final product and provides controlled cooling.",
        material: "Chrome",
        function: "Clamps around the blown glass to give it final shape and rapidly cools the exterior.",
        assemblyOrder: 5,
        connections: ["Coolant Lines", "Actuators"],
        failureEffect: "Mold fails to close completely, causing seam defects.",
        cascadeFailures: ["Product Asymmetry", "Thermal Shock"],
        originalPosition: { x: -4, y: -2.5, z: 0 },
        explodedPosition: { x: -8, y: -2.5, z: 0 }
    });

    const description = "The Automated Glassblower Carousel represents the pinnacle of modern glass manufacturing. It synchronizes extreme thermal environments with precise pneumatic control, rotating molten glass blanks through heating, blowing, and rapid-cooling stations to mass-produce flawless glass vessels.";

    const quizQuestions = [
        {
            question: "What is the primary function of the High-Intensity Gas Burner in the carousel?",
            options: [
                "To melt the metal components together",
                "To maintain the glass at a malleable working temperature",
                "To polish the final glass surface",
                "To generate steam for the pneumatic system"
            ],
            correct: 1,
            explanation: "The burner provides focused heat to keep the silica (glass) mixture soft and malleable enough to be shaped by the blowpipes.",
            difficulty: "easy"
        },
        {
            question: "A failure in the pneumatic blowpipe valves would most likely result in:",
            options: [
                "The central hub spinning out of control",
                "The burner extinguishing",
                "An inability to expand the molten glass into hollow vessels",
                "The cooling mold freezing shut"
            ],
            correct: 2,
            explanation: "The blowpipes inject compressed air to expand the glass. A valve failure means no air pressure, leading to collapsed or unformed glass blobs.",
            difficulty: "medium"
        },
        {
            question: "Why is the cooling mold typically made of a highly polished metal like Chrome?",
            options: [
                "To reflect heat back into the central hub",
                "To ensure a smooth surface finish on the glass and facilitate rapid heat transfer",
                "Because chrome is the cheapest material available",
                "To prevent the machine from rusting in humid environments"
            ],
            correct: 1,
            explanation: "Polished metals like chrome provide an ultra-smooth surface for the glass to mold against, preventing texture defects, and their thermal conductivity helps rapidly pull heat away from the glass.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, expanded) {
        const t = time * speed;
        
        if (!expanded) {
            // Rotate the entire arms assembly
            armsGroup.rotation.y = t * 0.5;

            // Animate blowpipes (spin them around their own axis to keep glass round)
            meshes.blowpipes.forEach((pipe, index) => {
                pipe.rotation.y = t * 2.0; // spin pipe

                // Pulsate the glass blobs to simulate blowing
                const blob = meshes.glassBlobs[index];
                const cycle = (t * 0.5 - (Math.PI / 2) * index) % (Math.PI * 2);
                
                // Pulsing
                blob.scale.setScalar(1.0 + Math.sin(t * 5 + index) * 0.1);
                blob.material.emissiveIntensity = 1.5 + Math.sin(t * 5 + index) * 0.5;
            });

            // Flicker the burner flame
            meshes.flame.scale.y = 1.0 + Math.random() * 0.2;
            meshes.flame.material.opacity = 0.6 + Math.random() * 0.3;
            
            // Subtle rotation of the mold
            meshes.mold.rotation.y = Math.sin(t) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAutomatedGlassblowerCarousel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
