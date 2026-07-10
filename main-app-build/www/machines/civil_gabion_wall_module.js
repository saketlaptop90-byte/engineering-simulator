import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const wireMat = new THREE.MeshPhysicalMaterial({
        color: 0x888888, metalness: 0.8, roughness: 0.4, wireframe: true
    });
    
    const rockMat = new THREE.MeshPhysicalMaterial({
        color: 0x665544, roughness: 1.0
    });

    const boxGeo = new THREE.BoxGeometry(4, 2, 2);
    const boxMesh = new THREE.Mesh(boxGeo, wireMat);
    group.add(boxMesh);
    parts.push({
        name: "Galvanized Steel Wire Mesh Basket",
        description: "Heavy-duty wire grid shaped into a rectangular box.",
        material: "Zinc-Coated Steel Wire",
        function: "Provides the structural container that holds the loose rocks together in a flexible block.",
        assemblyOrder: 1,
        connections: ["Rocks", "Adjacent Gabions"],
        failureEffect: "Wire corrosion/rust.",
        cascadeFailures: ["Wire snaps", "Rocks spill out", "Wall collapses"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:3, z:0}
    });

    const rockGrp = new THREE.Group();
    const rockGeo = new THREE.DodecahedronGeometry(0.3, 1);
    // Fill the box with 'rocks'
    for(let x=-1.5; x<=1.5; x+=0.6) {
        for(let y=-0.7; y<=0.7; y+=0.6) {
            for(let z=-0.7; z<=0.7; z+=0.6) {
                // Randomize a bit
                if(Math.random() > 0.2) {
                    const r = new THREE.Mesh(rockGeo, rockMat);
                    r.position.set(
                        x + (Math.random()-0.5)*0.2,
                        y + (Math.random()-0.5)*0.2,
                        z + (Math.random()-0.5)*0.2
                    );
                    r.rotation.set(Math.random(), Math.random(), Math.random());
                    rockGrp.add(r);
                }
            }
        }
    }
    group.add(rockGrp);
    parts.push({
        name: "Angular Rock Fill",
        description: "Hard, durable, interlocking quarried stones.",
        material: "Basalt / Granite",
        function: "Provides the massive weight (gravity) required to hold back earth, while allowing water to flow freely through the gaps.",
        assemblyOrder: 2,
        connections: ["Wire Mesh"],
        failureEffect: "Rocks too small.",
        cascadeFailures: ["Rocks wash out through mesh holes", "Gabion empties out"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-3, z:0}
    });

    const tieGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const tieMesh = new THREE.Mesh(tieGeo, chrome);
    tieMesh.position.set(0, 1, 1);
    group.add(tieMesh);
    parts.push({
        name: "Lacing Wire / Hog Rings",
        description: "Heavy steel clips.",
        material: "Steel",
        function: "Binds the edges of adjacent gabion baskets together, forming one massive, continuous monolithic structure.",
        assemblyOrder: 3,
        connections: ["Wire Baskets"],
        failureEffect: "Improper lacing.",
        cascadeFailures: ["Baskets shift independently", "Wall bulges and fails"],
        originalPosition: {x:0, y:1, z:1},
        explodedPosition: {x:0, y:4, z:4}
    });

    const description = "Civil Gabion Wall Module: A remarkably simple but highly effective gravity retaining wall system. It consists of heavy wire baskets filled with rocks. Stacked together, their massive weight holds back unstable hillsides, while the porous rocks allow heavy rainwater to drain harmlessly through the wall.";

    const quizQuestions = [
        {
            question: "Why use Gabion baskets instead of pouring a solid concrete retaining wall?",
            options: ["Solid concrete traps groundwater behind it, creating massive hydrostatic pressure that can blow out the wall. Gabions are totally porous and let the water drain safely.", "Gabions are completely waterproof", "Gabions are lighter than air", "Concrete is illegal"],
            correct: 0,
            explanation: "Water weight is the primary cause of retaining wall failures. A gabion wall is basically a giant French drain; water flows right through it, completely eliminating dangerous hydrostatic pressure behind the wall.",
            difficulty: "Medium"
        },
        {
            question: "What is a major advantage of the gabion's flexible wire structure?",
            options: ["If the ground settles or shifts slightly, the gabion simply flexes and conforms to the ground. A solid concrete wall would crack and break.", "It bounces back rocks", "It catches fish", "It conducts electricity well"],
            correct: 0,
            explanation: "Gabions are highly flexible. They can withstand significant ground movement, frost heave, or foundation settling without losing their structural integrity, unlike rigid concrete.",
            difficulty: "Hard"
        },
        {
            question: "What type of rock must be used to fill the baskets?",
            options: ["Hard, durable, angular rocks that are larger than the holes in the wire mesh", "Round, smooth river pebbles", "Soft sandstone", "Sand"],
            correct: 0,
            explanation: "The rocks must be angular so they interlock like puzzle pieces (adding friction and stability), and obviously, they must be larger than the mesh openings so they don't simply fall out.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Very slight pulsing to highlight it
        if (meshes[0]) {
            meshes[0].rotation.y = Math.sin(time * speed * 0.5) * 0.1;
            if(meshes[1]) meshes[1].rotation.y = meshes[0].rotation.y;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGabionWallModule() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
