import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonPink = new THREE.MeshPhysicalMaterial({
        color: 0xff00aa, emissive: 0xff0055, emissiveIntensity: 1,
        transparent: true, opacity: 0.9, roughness: 0.1
    });

    const boneGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const boneMesh = new THREE.Mesh(boneGeo, steel);
    boneMesh.rotation.z = Math.PI / 2;
    boneMesh.position.set(-1.5, 0, 0);
    group.add(boneMesh);
    parts.push({
        name: "Entoglossal Process",
        description: "A rigid bone at the base of the tongue.",
        material: "Bone / Cartilage",
        function: "Acts as the structural launchpad for the tongue projection.",
        assemblyOrder: 1,
        connections: ["Accelerator Muscle"],
        failureEffect: "Inability to aim or launch.",
        cascadeFailures: ["Starvation"],
        originalPosition: {x:-1.5, y:0, z:0},
        explodedPosition: {x:-1.5, y:5, z:0}
    });

    const muscleGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const muscleMesh = new THREE.Mesh(muscleGeo, neonPink);
    muscleMesh.rotation.z = Math.PI / 2;
    muscleMesh.position.set(0, 0, 0);
    group.add(muscleMesh);
    parts.push({
        name: "Accelerator Muscle",
        description: "Tubular, highly elastic muscle wrapping the bone.",
        material: "Neon Muscle Tissue",
        function: "Contracts radially, squeezing itself off the tapered bone to launch forward like a squeezed watermelon seed.",
        assemblyOrder: 2,
        connections: ["Entoglossal Process", "Tongue Pad"],
        failureEffect: "Lethargic tongue extension.",
        cascadeFailures: ["Missed prey"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    const padGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const padMesh = new THREE.Mesh(padGeo, rubber);
    padMesh.position.set(1.2, 0, 0);
    group.add(padMesh);
    parts.push({
        name: "Sticky Tongue Pad",
        description: "The suction-cup-like tip covered in viscous mucus.",
        material: "Rubber / Mucus",
        function: "Creates a vacuum seal and chemical adhesion to grab prey instantly.",
        assemblyOrder: 3,
        connections: ["Accelerator Muscle"],
        failureEffect: "Prey escapes upon contact.",
        cascadeFailures: ["Starvation"],
        originalPosition: {x:1.2, y:0, z:0},
        explodedPosition: {x:5, y:0, z:0}
    });

    const description = "Chameleon Tongue Mechanism: An incredibly fast biological catapult. An elastic accelerator muscle squeezes around a tapered bone, building immense potential energy until it rapidly slides off the tip, launching the sticky pad at 100 Gs.";

    const quizQuestions = [
        {
            question: "How does the chameleon's tongue achieve such extreme acceleration (up to 100 Gs)?",
            options: ["Elastic recoil of collagen tissues storing energy like a bow", "Incredibly fast electrical nerve signals", "Pneumatic air pressure inside the throat", "Magnetic repulsion"],
            correct: 0,
            explanation: "Chameleons use a catapult-like elastic mechanism. They slowly contract muscles to stretch collagen sheaths, storing elastic potential energy, and then release it all at once.",
            difficulty: "Medium"
        },
        {
            question: "What physical analogy best describes how the accelerator muscle slides off the entoglossal process?",
            options: ["Shooting a wet watermelon seed by pinching it", "A bullet exiting a rifled barrel", "A whip cracking", "A spring uncoiling"],
            correct: 0,
            explanation: "The muscle contracts radially, squeezing tightly around the tapered bone until the extreme pressure forces it to rapidly shoot off the tip.",
            difficulty: "Hard"
        },
        {
            question: "How does the tip of the tongue hold onto the prey?",
            options: ["Highly viscous mucus and a vacuum suction cup effect", "Tiny microscopic hooks", "Venom injection", "Electromagnetic static"],
            correct: 0,
            explanation: "The tongue pad forms a pouch upon impact to create suction, while the mucus is highly viscous (400x thicker than human saliva) to ensure strong adhesion.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Fast launch and slow retract simulation
        const cycle = (time * speed) % 3;
        let ext = 0;
        if (cycle < 0.2) {
            ext = (cycle / 0.2) * 8; // launch fast
        } else if (cycle < 1.0) {
            ext = 8 - ((cycle - 0.2) / 0.8) * 8; // retract slower
        }
        
        if (meshes[1]) {
            meshes[1].position.x = ext;
            meshes[1].scale.x = 1 + (ext * 0.1);
        }
        if (meshes[2]) {
            meshes[2].position.x = 1.2 + ext + (ext * 0.1);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createChameleonTongue() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
