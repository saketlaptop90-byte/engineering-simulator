import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const hotAsphalt = new THREE.MeshPhysicalMaterial({
        color: 0x222222, emissive: 0x442211, emissiveIntensity: 0.5,
        roughness: 0.9
    });

    const bodyGeo = new THREE.BoxGeometry(4, 2, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.position.set(0, 1.5, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Tractor Unit",
        description: "Main heavy steel chassis with engine and crawler tracks.",
        material: "Steel",
        function: "Provides the incredibly slow, steady forward motion required for a perfectly smooth road.",
        assemblyOrder: 1,
        connections: ["Hopper", "Screed"],
        failureEffect: "Jerky movement.",
        cascadeFailures: ["Wavy, bumpy road surface"],
        originalPosition: {x:0, y:1.5, z:0},
        explodedPosition: {x:0, y:1.5, z:-8}
    });

    const hopperGeo = new THREE.BoxGeometry(5, 1.5, 3);
    const hopperMesh = new THREE.Mesh(hopperGeo, steel);
    hopperMesh.position.set(0, 2, 4);
    // Make it look like a bucket
    hopperMesh.geometry.translate(0, 0, 0);
    group.add(hopperMesh);
    parts.push({
        name: "Receiving Hopper",
        description: "Large steel bucket at the front.",
        material: "Steel",
        function: "Receives hot asphalt mix dumped directly from a moving dump truck.",
        assemblyOrder: 2,
        connections: ["Conveyor", "Tractor"],
        failureEffect: "Hopper runs empty.",
        cascadeFailures: ["Paver stops", "Cold joint forms in road"],
        originalPosition: {x:0, y:2, z:4},
        explodedPosition: {x:0, y:6, z:6}
    });

    const screedGeo = new THREE.BoxGeometry(6, 0.5, 2);
    const screedMesh = new THREE.Mesh(screedGeo, chrome);
    screedMesh.position.set(0, 0.25, -4);
    group.add(screedMesh);
    parts.push({
        name: "Heated Screed Plate",
        description: "Heavy, heated floating iron plate dragged behind the tractor.",
        material: "Heavy Iron",
        function: "The most important part: it floats on the hot asphalt, ironing it out to the exact thickness, crown, and smoothness.",
        assemblyOrder: 3,
        connections: ["Tow Arms", "Asphalt"],
        failureEffect: "Screed heater fails.",
        cascadeFailures: ["Asphalt sticks to screed", "Tears holes in road"],
        originalPosition: {x:0, y:0.25, z:-4},
        explodedPosition: {x:0, y:0.25, z:-10}
    });

    const asphaltGeo = new THREE.PlaneGeometry(6, 10);
    const asphaltMesh = new THREE.Mesh(asphaltGeo, hotAsphalt);
    asphaltMesh.rotation.x = -Math.PI / 2;
    asphaltMesh.position.set(0, 0.05, -9);
    group.add(asphaltMesh);
    parts.push({
        name: "Hot Asphalt Mat",
        description: "Newly laid strip of road.",
        material: "Hot Asphalt",
        function: "Cools to become the durable road surface.",
        assemblyOrder: 4,
        connections: ["Screed", "Ground"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:0.05, z:-9},
        explodedPosition: {x:-8, y:0.05, z:-9}
    });

    const description = "Civil Asphalt Paver: A highly specialized heavy machine that receives hot asphalt from dump trucks, conveys it to the rear, and uses a massive heated 'floating screed' to iron it into a perfectly flat, uniform layer of road surface.";

    const quizQuestions = [
        {
            question: "What is the secret to a perfectly smooth road laid by a paver?",
            options: ["The screed is not rigidly fixed; it 'floats' on the hot asphalt, allowing it to naturally average out bumps in the ground below", "The machine has laser-guided tires", "The asphalt is liquid like water", "A massive steamroller goes first"],
            correct: 0,
            explanation: "The screed is towed by long arms and is freely floating. Because it floats, if the tractor goes over a bump, the screed only rises a fraction of that height, naturally smoothing out the road.",
            difficulty: "Hard"
        },
        {
            question: "Why must the screed plate be heated (often using diesel burners or electricity)?",
            options: ["To prevent the sticky hot asphalt from cooling and sticking to the metal plate, which would tear holes in the new road", "To melt the dirt underneath", "To keep the driver warm", "To dry the rain"],
            correct: 0,
            explanation: "Hot mix asphalt is sticky. If the heavy iron screed plate is cold, the asphalt cools on contact, sticks to it, and tears ugly chunks out of the mat as the paver moves forward.",
            difficulty: "Medium"
        },
        {
            question: "What happens if a paver has to stop because it runs out of asphalt from the trucks?",
            options: ["The asphalt cools down, creating a 'cold joint' bump when they restart", "The paver explodes", "The road becomes stronger", "Nothing, it's fine"],
            correct: 0,
            explanation: "Pavers must ideally move continuously. If they stop, the asphalt cools. When they start again, the transition between cold and hot asphalt creates a noticeable bump or weak seam (a cold joint).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly 'extrude' the asphalt out the back
        if (group.children[3]) {
            group.children[3].scale.y = 1 + Math.sin(time * speed * 0.5) * 0.1; 
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAsphaltPaver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
