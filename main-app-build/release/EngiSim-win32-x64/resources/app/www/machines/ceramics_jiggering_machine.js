import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 2,
        transparent: true, opacity: 0.9
    });

    const tableGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const tableMesh = new THREE.Mesh(tableGeo, steel);
    tableMesh.position.set(0, 1, 0);
    group.add(tableMesh);
    parts.push({
        name: "Rotating Plaster Mold",
        description: "Spinning base mold that forms the outside of the plate/bowl.",
        material: "Plaster / Steel base",
        function: "Rotates the clay while drawing out moisture.",
        assemblyOrder: 1,
        connections: ["Motor Drive"],
        failureEffect: "Off-center wobble.",
        cascadeFailures: ["Warped ceramic plate"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    const clayGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 32);
    const clayMesh = new THREE.Mesh(clayGeo, neonBlue);
    clayMesh.position.set(0, 1.35, 0);
    group.add(clayMesh);
    parts.push({
        name: "Ceramic Clay Bat",
        description: "Glowing neon wet clay being shaped.",
        material: "Clay (Neon Blue)",
        function: "The raw material being formed into flatware.",
        assemblyOrder: 2,
        connections: ["Plaster Mold", "Jigger Profile Tool"],
        failureEffect: "Tearing or cracking.",
        cascadeFailures: ["Scrapped part"],
        originalPosition: {x:0, y:1.35, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    const toolGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const toolMesh = new THREE.Mesh(toolGeo, chrome);
    toolMesh.position.set(1.5, 1.55, 0);
    group.add(toolMesh);
    parts.push({
        name: "Jigger Profile Tool",
        description: "Shaped metallic template arm.",
        material: "Chrome",
        function: "Presses down on the spinning clay to form the inside profile of the plate.",
        assemblyOrder: 3,
        connections: ["Hydraulic Arm"],
        failureEffect: "Gouging the clay.",
        cascadeFailures: ["Uneven plate thickness"],
        originalPosition: {x:1.5, y:1.55, z:0},
        explodedPosition: {x:5, y:5, z:0}
    });

    const description = "Ceramics Jiggering Machine: An automated pottery wheel process where a shaped template presses into spinning clay on a plaster mold to rapidly mass-produce plates and bowls.";

    const quizQuestions = [
        {
            question: "What is the main difference between jiggering and jolleying?",
            options: ["Jiggering forms flatware (plates), jolleying forms hollowware (cups)", "Jiggering uses heat, jolleying uses cold", "Jiggering is manual, jolleying is automated", "There is no difference"],
            correct: 0,
            explanation: "Jiggering is traditionally used for flatware like plates (tool shapes the inside), while jolleying is used for hollowware like cups (tool shapes the outside).",
            difficulty: "Hard"
        },
        {
            question: "Why is the rotating mold usually made of plaster?",
            options: ["It absorbs moisture from the clay to help it release", "It is cheap", "It is lightweight", "It spins faster"],
            correct: 0,
            explanation: "Plaster is porous and absorbs water from the wet clay, shrinking it slightly and allowing it to release easily from the mold.",
            difficulty: "Medium"
        },
        {
            question: "What does the metal profile tool do in the jiggering process?",
            options: ["Shapes the non-mold side of the ceramic piece", "Cuts the clay off the wheel", "Sprays glaze", "Dries the clay"],
            correct: 0,
            explanation: "The profile tool descends onto the spinning clay and forces it against the plaster mold, shaping the opposite surface.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the table and clay
        if (meshes[0]) meshes[0].rotation.y = time * speed * 5;
        if (meshes[1]) meshes[1].rotation.y = time * speed * 5;
        // Move the tool down and up
        if (meshes[2]) meshes[2].position.y = 1.55 + Math.sin(time * speed) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createJiggeringMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
