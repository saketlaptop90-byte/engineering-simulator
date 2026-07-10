import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonSlurry = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x008800, emissiveIntensity: 1,
        transparent: true, opacity: 0.8
    });

    const outerCasingGeo = new THREE.CylinderGeometry(4, 4, 3, 32);
    const outerCasingMesh = new THREE.Mesh(outerCasingGeo, darkSteel);
    outerCasingMesh.position.set(0, 1.5, 0);
    // Make outer casing transparent to see inside
    outerCasingMesh.material = tinted;
    group.add(outerCasingMesh);
    parts.push({
        name: "Stationary Casing",
        description: "Heavy steel outer shell.",
        material: "Tinted Glass / Steel",
        function: "Contains the spinning bowl and collects the separated liquids and solids.",
        assemblyOrder: 1,
        connections: ["Bearings", "Rotor"],
        failureEffect: "Vibration and structural damage.",
        cascadeFailures: ["Catastrophic casing explosion"],
        originalPosition: {x:0, y:1.5, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const bowlGeo = new THREE.CylinderGeometry(3.5, 2, 2.5, 32);
    const bowlMesh = new THREE.Mesh(bowlGeo, chrome);
    bowlMesh.position.set(0, 1.5, 0);
    group.add(bowlMesh);
    parts.push({
        name: "Spinning Centrifuge Bowl",
        description: "Conical high-speed rotating basket.",
        material: "Chrome / Titanium",
        function: "Generates massive G-forces to separate mixtures by density.",
        assemblyOrder: 2,
        connections: ["Motor Shaft"],
        failureEffect: "Imbalance.",
        cascadeFailures: ["Bearing destruction"],
        originalPosition: {x:0, y:1.5, z:0},
        explodedPosition: {x:0, y:1.5, z:8}
    });

    const slurryGeo = new THREE.TorusGeometry(3.3, 0.2, 16, 100);
    const slurryMesh = new THREE.Mesh(slurryGeo, neonSlurry);
    slurryMesh.rotation.x = Math.PI / 2;
    slurryMesh.position.set(0, 1.5, 0);
    group.add(slurryMesh);
    parts.push({
        name: "Dense Solid Cake",
        description: "Glowing separated solids.",
        material: "Neon Slurry",
        function: "Heavy particles forced to the outer wall of the bowl.",
        assemblyOrder: 3,
        connections: ["Bowl"],
        failureEffect: "Clogging the discharge ports.",
        cascadeFailures: ["Process shutdown"],
        originalPosition: {x:0, y:1.5, z:0},
        explodedPosition: {x:0, y:-4, z:0}
    });

    const description = "Chemical Centrifuge: An industrial machine spinning at extreme speeds to separate mixtures of liquids and solids (or immiscible liquids) using centrifugal force, effectively amplifying gravity thousands of times.";

    const quizQuestions = [
        {
            question: "How does a centrifuge separate a mixture?",
            options: ["By applying centrifugal force that pushes denser materials to the outside", "By evaporating the lighter liquid", "By passing the mixture through a microscopic filter", "By chemically reacting the components"],
            correct: 0,
            explanation: "The high-speed rotation creates centrifugal force, driving the heaviest/densest particles to the outer wall while lighter liquids stay near the center.",
            difficulty: "Easy"
        },
        {
            question: "What is a major danger of operating an industrial centrifuge?",
            options: ["Rotor imbalance leading to catastrophic mechanical failure", "Spontaneous combustion of the liquids", "Radiation leaks", "Freezing of the slurry"],
            correct: 0,
            explanation: "Because they spin at thousands of RPMs, even a slight imbalance in the mass distribution can cause violent vibrations, destroying the bearings and shattering the machine.",
            difficulty: "Medium"
        },
        {
            question: "What type of centrifuge uses a helical screw conveyor to continuously push solids out?",
            options: ["Decanter centrifuge", "Tubular bowl centrifuge", "Basket centrifuge", "Disk-stack centrifuge"],
            correct: 0,
            explanation: "A decanter centrifuge uses an internal scroll (screw conveyor) that spins at a slightly different speed than the main bowl to scrape and push solid 'cake' out continuously.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // High speed spin for bowl and slurry
        if (meshes[1]) meshes[1].rotation.y = time * speed * 15;
        if (meshes[2]) meshes[2].rotation.z = time * speed * 15;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCentrifugalSeparator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
