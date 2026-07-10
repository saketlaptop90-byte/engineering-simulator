import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 1.0 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transparent: true, opacity: 0.7, roughness: 0.1 });

    const wallsGeo = new THREE.BoxGeometry(10, 8, 2);
    const wallLeft = new THREE.Mesh(wallsGeo, concreteMat);
    wallLeft.position.set(0, 4, -4);
    group.add(wallLeft);
    
    const wallRight = new THREE.Mesh(wallsGeo, concreteMat);
    wallRight.position.set(0, 4, 4);
    group.add(wallRight);

    const floorGeo = new THREE.BoxGeometry(10, 1, 10);
    const floorMesh = new THREE.Mesh(floorGeo, concreteMat);
    floorMesh.position.set(0, -0.5, 0);
    group.add(floorMesh);

    parts.push({
        name: "Lock Chamber (Concrete Walls)",
        description: "Massive concrete enclosure.",
        material: "Reinforced Concrete",
        function: "Holds thousands of tons of water, allowing the water level inside to be raised or lowered to match the adjacent river.",
        assemblyOrder: 1,
        connections: ["Miter Gates"],
        failureEffect: "Structural blowout.",
        cascadeFailures: ["Catastrophic flood down the canal"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    // Miter Gates (Point upstream against the water pressure)
    const gateGrp = new THREE.Group();
    const gateGeo = new THREE.BoxGeometry(0.5, 6, 3.5);
    
    const gate1 = new THREE.Mesh(gateGeo, steel);
    gate1.position.set(0, 3, -1.75);
    gate1.rotation.y = -Math.PI / 6; // Angled to form a V
    gateGrp.add(gate1);
    
    const gate2 = new THREE.Mesh(gateGeo, steel);
    gate2.position.set(0, 3, 1.75);
    gate2.rotation.y = Math.PI / 6;
    gateGrp.add(gate2);
    
    gateGrp.position.set(-4, 0, 0); // Positioned at one end of the lock
    group.add(gateGrp);
    parts.push({
        name: "Miter Gates",
        description: "Two massive steel doors that meet at a V-angle.",
        material: "Steel",
        function: "Seals the lock. They point 'upstream' so the immense water pressure naturally forces them tightly closed.",
        assemblyOrder: 2,
        connections: ["Chamber Walls", "Hydraulic Actuators"],
        failureEffect: "Ship collision.",
        cascadeFailures: ["Gates burst open", "Lake drains uncontrollably"],
        originalPosition: {x:-4, y:0, z:0},
        explodedPosition: {x:-8, y:0, z:0}
    });

    const waterGeo = new THREE.BoxGeometry(10, 4, 6);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 2, 0); // Water level inside chamber
    group.add(waterMesh);
    parts.push({
        name: "Chamber Water Level",
        description: "The volume of water inside the lock.",
        material: "Water",
        function: "Acts as a hydraulic elevator, lifting massive cargo ships simply by letting water flow in via gravity.",
        assemblyOrder: 3,
        connections: ["Valves", "Chamber"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:0, y:10, z:0}
    });

    const description = "Canal Lock System: A water elevator for ships. When a river has a dam or a steep elevation change, a lock chamber is built. By simply opening underwater valves, gravity fills or drains the chamber, gently lifting or lowering 50,000-ton ships without using any massive lifting machinery.";

    const quizQuestions = [
        {
            question: "Why do the large steel 'Miter Gates' always close at an angle, pointing like an arrow against the higher water level?",
            options: ["Because the immense pressure of the higher water pushes against the V-shape, forcing the gates to squeeze tightly shut and seal themselves", "To make them look like a ship's bow", "To make them open faster", "Because a straight wall would be too heavy"],
            correct: 0,
            explanation: "This brilliant engineering trick (invented by Leonardo da Vinci) ensures that the harder the water pushes, the tighter the gates seal. A straight flat gate would easily blow open or leak under millions of pounds of pressure.",
            difficulty: "Hard"
        },
        {
            question: "What powers the lifting of a massive cargo ship inside a canal lock?",
            options: ["Gravity. Water flows from the higher lake into the lower lock chamber naturally.", "Giant electric cranes", "Nuclear submarines pushing from below", "Giant airbags"],
            correct: 0,
            explanation: "No pumps or motors are used to lift the ships. Underground culvert valves are opened, and gravity simply allows water from the high side to fill the lock, lifting the ship like a rubber duck in a bathtub.",
            difficulty: "Medium"
        },
        {
            question: "What is the most catastrophic danger to a canal lock?",
            options: ["A ship failing to brake and ramming the closed gates, bursting them open and draining the entire lake above", "The water evaporating", "Fish getting stuck", "The steel rusting slowly"],
            correct: 0,
            explanation: "If a ship rams and breaks the gates, there is nothing stopping the entire upper river/lake from rushing through the gap in a devastating artificial tsunami.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the water level rising and falling
        if (group.children[3]) {
            const water = group.children[3];
            // Scale Y from 0.1 to 1.5
            const cycle = (Math.sin(time * speed * 0.5) + 1) / 2; // 0 to 1
            const height = 0.5 + cycle * 5.5; // 0.5 to 6.0
            water.geometry.dispose(); // clean up old
            water.geometry = new THREE.BoxGeometry(10, height, 6);
            water.position.y = height / 2;
            
            // Open/close gates based on water level
            if (group.children[2]) {
                const gates = group.children[2];
                // If water is high (cycle > 0.9), open the gates
                if (cycle > 0.9) {
                    gates.children[0].rotation.y = -Math.PI / 2; // open straight
                    gates.children[1].rotation.y = Math.PI / 2;
                } else {
                    gates.children[0].rotation.y = -Math.PI / 6; // closed V
                    gates.children[1].rotation.y = Math.PI / 6;
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCanalLockGates() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
