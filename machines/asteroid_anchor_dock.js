import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const forceFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 0.3,
        transparent: true,
        roughness: 0.1,
        side: THREE.DoubleSide
    });

    // 1. Central Hub
    const hubGeo = new THREE.CylinderGeometry(4, 4, 10, 32);
    const hubMesh = new THREE.Mesh(hubGeo, darkSteel);
    hubMesh.position.set(0, 0, 0);
    group.add(hubMesh);
    meshes.hub = hubMesh;

    parts.push({
        name: "Central Command Hub",
        description: "The main processing and structural core of the anchor dock.",
        material: "darkSteel",
        function: "Houses power distribution and quantum communication arrays.",
        assemblyOrder: 1,
        connections: ["thrusterRings", "harpoonBays", "dockingPort"],
        failureEffect: "Complete loss of station control and anchor release.",
        cascadeFailures: ["tetherSnap", "powerOutage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Thruster Rings (Top & Bottom)
    const ringGeo = new THREE.TorusGeometry(6, 1.5, 16, 64);
    const topRing = new THREE.Mesh(ringGeo, chrome);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.set(0, 4, 0);
    const bottomRing = new THREE.Mesh(ringGeo, chrome);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.set(0, -4, 0);
    
    group.add(topRing);
    group.add(bottomRing);
    meshes.topRing = topRing;
    meshes.bottomRing = bottomRing;

    parts.push({
        name: "Maneuvering Thruster Rings",
        description: "Twin gyroscopic stabilization rings for deep space positioning.",
        material: "chrome",
        function: "Maintains orbital stability relative to the asteroid surface.",
        assemblyOrder: 2,
        connections: ["hub"],
        failureEffect: "Station drift leading to tether over-tension.",
        cascadeFailures: ["anchorFracture"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 3. Glowing Thruster Exhausts
    const exhaustGeo = new THREE.SphereGeometry(1, 16, 16);
    const exhausts = new THREE.Group();
    for (let i=0; i<4; i++) {
        const e1 = new THREE.Mesh(exhaustGeo, neonBlue);
        e1.position.set(Math.cos(i*Math.PI/2)*6, 4, Math.sin(i*Math.PI/2)*6);
        const e2 = new THREE.Mesh(exhaustGeo, neonBlue);
        e2.position.set(Math.cos(i*Math.PI/2)*6, -4, Math.sin(i*Math.PI/2)*6);
        exhausts.add(e1);
        exhausts.add(e2);
    }
    group.add(exhausts);
    meshes.exhausts = exhausts;

    // 4. Harpoon Bays
    const harpoonBays = new THREE.Group();
    for (let i=0; i<3; i++) {
        const angle = i * (Math.PI * 2 / 3);
        const bayGeo = new THREE.BoxGeometry(3, 8, 3);
        const bayMesh = new THREE.Mesh(bayGeo, steel);
        bayMesh.position.set(Math.cos(angle)*5, 0, Math.sin(angle)*5);
        bayMesh.lookAt(0,0,0);
        harpoonBays.add(bayMesh);

        // Tether lines (glowing)
        const tetherGeo = new THREE.CylinderGeometry(0.2, 0.2, 15);
        const tetherMesh = new THREE.Mesh(tetherGeo, neonOrange);
        tetherMesh.position.set(Math.cos(angle)*5, -11, Math.sin(angle)*5);
        harpoonBays.add(tetherMesh);
    }
    group.add(harpoonBays);
    meshes.harpoonBays = harpoonBays;

    parts.push({
        name: "Tri-Axial Harpoon Bays & Tethers",
        description: "Deployable kinetic anchors with plasma-forged tethers.",
        material: "steel/neonOrange",
        function: "Embeds into the asteroid bedrock to secure the station.",
        assemblyOrder: 3,
        connections: ["hub"],
        failureEffect: "Loss of secure anchoring, catastrophic breakaway.",
        cascadeFailures: ["structuralShear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 10 }
    });

    // 5. Force Field Dome
    const domeGeo = new THREE.SphereGeometry(12, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, forceFieldMat);
    domeMesh.position.set(0, 0, 0);
    group.add(domeMesh);
    meshes.dome = domeMesh;

    parts.push({
        name: "Micrometeoroid Force Field",
        description: "Electromagnetic energy shield enclosing the upper hemisphere.",
        material: "forceField",
        function: "Deflects incoming debris and solar radiation.",
        assemblyOrder: 4,
        connections: ["hub"],
        failureEffect: "Station exposed to lethal debris impacts.",
        cascadeFailures: ["hullBreach", "lifeSupportFailure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });


    const description = "The Deep Space Asteroid Anchor Dock is a specialized station designed to secure itself to massive asteroids. It features tri-axial harpoon bays with plasma-forged tethers, stabilized by twin gyroscopic thruster rings and protected by a micrometeoroid force field.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Maneuvering Thruster Rings?",
            options: [
                "Generating electrical power",
                "Deflecting solar radiation",
                "Maintaining orbital stability relative to the asteroid",
                "Storing harpoon tethers"
            ],
            correct: 2,
            explanation: "The thruster rings act as gyroscopic stabilizers to counteract rotational drift of the asteroid.",
            difficulty: "Medium"
        },
        {
            question: "What material properties make the force field dome effective?",
            options: [
                "High density steel",
                "Electromagnetic energy deflection",
                "Rubberized impact absorption",
                "Thermal glass"
            ],
            correct: 1,
            explanation: "The dome uses an electromagnetic shield to deflect debris and radiation without physical mass.",
            difficulty: "Easy"
        },
        {
            question: "Which component failure directly leads to an 'anchor release' cascade?",
            options: [
                "Force Field Dome",
                "Thruster Exhausts",
                "Central Command Hub",
                "Harpoon Tethers"
            ],
            correct: 2,
            explanation: "The Central Hub houses all control systems; its failure drops station control and releases anchors.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Rotate thruster rings
            meshes.topRing.rotation.z += 0.02 * speed;
            meshes.bottomRing.rotation.z -= 0.02 * speed;

            // Pulse exhausts
            const pulse = (Math.sin(time * 5) + 1) / 2;
            meshes.exhausts.children.forEach(c => {
                c.scale.set(1 + pulse*0.5, 1 + pulse*0.5, 1 + pulse*0.5);
                c.material.emissiveIntensity = 1.0 + pulse;
            });

            // Rotate dome slowly
            meshes.dome.rotation.y -= 0.005 * speed;

            // Harpoon tethers slight vibration
            meshes.harpoonBays.position.y = Math.sin(time * 10 * speed) * 0.05;
        } else {
            meshes.exhausts.children.forEach(c => {
                c.scale.set(1,1,1);
            });
            meshes.harpoonBays.position.y = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAsteroidAnchorDock() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
