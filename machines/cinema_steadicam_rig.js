import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonVest = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x005500, emissiveIntensity: 1,
        roughness: 0.8, metalness: 0.1
    });

    const vestGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const vestMesh = new THREE.Mesh(vestGeo, neonVest);
    vestMesh.position.set(0, 3, 0);
    group.add(vestMesh);
    parts.push({
        name: "Operator Vest",
        description: "Glowing neon padded vest worn by the camera operator.",
        material: "Kevlar / Nylon",
        function: "Distributes the massive weight of the rig across the operator's hips and shoulders.",
        assemblyOrder: 1,
        connections: ["Iso-Elastic Arm"],
        failureEffect: "Operator fatigue/injury.",
        cascadeFailures: ["Camera dropped"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:3, z:-8}
    });

    const armGrp = new THREE.Group();
    const linkGeo = new THREE.BoxGeometry(0.5, 0.5, 4);
    const link1 = new THREE.Mesh(linkGeo, chrome);
    link1.position.set(2.5, 3, 1.5);
    armGrp.add(link1);
    
    // Add springs inside the arm
    const springGeo = new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8, 2, 10);
    const spring1 = new THREE.Mesh(springGeo, steel);
    spring1.position.set(2.5, 3.5, 1.5);
    armGrp.add(spring1);

    group.add(armGrp);
    parts.push({
        name: "Iso-Elastic Spring Arm",
        description: "Dual-articulating arm with heavy-duty tension springs.",
        material: "Titanium / Steel Springs",
        function: "Isolates the camera from the vertical bouncing motion of the operator's footsteps.",
        assemblyOrder: 2,
        connections: ["Vest", "Gimbal"],
        failureEffect: "Bottoming out.",
        cascadeFailures: ["Shaky footage"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:5, y:0, z:0}
    });

    const sledGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
    const sledMesh = new THREE.Mesh(sledGeo, aluminum);
    sledMesh.position.set(2.5, 3, 4);
    group.add(sledMesh);
    parts.push({
        name: "Center Post / Sled",
        description: "Long vertical carbon-fiber pole.",
        material: "Carbon Fiber",
        function: "Acts as the structural spine, holding the camera at the top and the batteries/monitor at the bottom to create a perfect pendulum balance.",
        assemblyOrder: 3,
        connections: ["Gimbal", "Camera", "Batteries"],
        failureEffect: "Imbalance.",
        cascadeFailures: ["Rig tips over uncontrollably"],
        originalPosition: {x:2.5, y:3, z:4},
        explodedPosition: {x:2.5, y:3, z:8}
    });

    const gimbalGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const gimbalMesh = new THREE.Mesh(gimbalGeo, chrome);
    gimbalMesh.position.set(2.5, 5, 4);
    group.add(gimbalMesh);
    parts.push({
        name: "3-Axis Gimbal",
        description: "Precision low-friction bearing mount.",
        material: "Steel Bearings",
        function: "Allows the sled to freely pan, tilt, and roll around its center of gravity without resistance.",
        assemblyOrder: 4,
        connections: ["Arm", "Sled"],
        failureEffect: "Friction.",
        cascadeFailures: ["Jitter transfers to camera"],
        originalPosition: {x:2.5, y:5, z:4},
        explodedPosition: {x:8, y:5, z:4}
    });

    const description = "Steadicam Rig: A mechanical camera stabilization system invented by Garrett Brown. It separates the operator's movement from the camera by using a precisely balanced sled (pendulum) and an iso-elastic spring arm to absorb the shock of footsteps, creating smooth, floating cinematic shots without laying dolly tracks.";

    const quizQuestions = [
        {
            question: "What is the primary function of the 'iso-elastic arm' on a Steadicam?",
            options: ["To absorb vertical bouncing caused by the operator walking or running", "To power the camera", "To automatically pull focus", "To fly the camera in the air"],
            correct: 0,
            explanation: "The heavy springs inside the articulating arm act as shock absorbers, smoothing out the vertical 'bobbing' of human footsteps.",
            difficulty: "Medium"
        },
        {
            question: "Why does the Steadicam sled have the camera on top, but heavy batteries and a monitor hanging way at the bottom?",
            options: ["To expand the moment of inertia and place the center of gravity exactly at the gimbal", "Because there is no room on top", "To keep the batteries cold", "To act as a kickstand"],
            correct: 0,
            explanation: "Separating the mass (camera high, batteries low) creates a large moment of inertia, making the rig highly resistant to accidental tilting (wobble). Balancing it places the center of gravity right at the gimbal, so it floats perfectly level.",
            difficulty: "Hard"
        },
        {
            question: "Who famously invented the Steadicam in the 1970s?",
            options: ["Garrett Brown", "Steven Spielberg", "George Lucas", "James Cameron"],
            correct: 0,
            explanation: "Garrett Brown invented the Steadicam. Its iconic debut included films like 'Rocky' (running up the stairs) and 'The Shining' (following Danny's tricycle through the hotel).",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Simulate walking bounce on the vest
        if (group.children[0]) {
            group.children[0].position.y = 3 + Math.sin(time * speed * 4) * 0.5;
        }
        // The sled stays perfectly smooth due to the arm
        if (group.children[2]) {
            // Sled is mesh index 2
            group.children[2].position.y = 3; 
        }
        // Flex the arm
        if (group.children[1]) {
            group.children[1].position.y = group.children[0].position.y;
            // The tip of the arm connects to the smooth sled
            group.children[1].lookAt(2.5, 3, 4);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSteadicamRig() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
