import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingFire = new THREE.MeshPhysicalMaterial({
        color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 3,
        transparent: true, opacity: 0.9
    });

    const kilnGeo = new THREE.CylinderGeometry(3, 3, 20, 32);
    const kilnMesh = new THREE.Mesh(kilnGeo, darkSteel);
    // Slight tilt
    kilnMesh.rotation.z = Math.PI / 2 - 0.1;
    kilnMesh.position.set(0, 5, 0);
    group.add(kilnMesh);
    parts.push({
        name: "Rotary Steel Shell",
        description: "Massive steel cylinder lined with refractory brick, tilted slightly downwards.",
        material: "Steel / Refractory",
        function: "Rotates slowly to tumble the solid material while the tilt moves it toward the burner.",
        assemblyOrder: 1,
        connections: ["Trunnion Rollers", "Burner"],
        failureEffect: "Refractory collapse.",
        cascadeFailures: ["Steel shell warp", "Catastrophic failure"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:12, z:0}
    });

    const rollerGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const r1 = new THREE.Mesh(rollerGeo, steel);
    r1.rotation.x = Math.PI / 2;
    r1.position.set(-6, 1.5, 2);
    group.add(r1);
    const r2 = new THREE.Mesh(rollerGeo, steel);
    r2.rotation.x = Math.PI / 2;
    r2.position.set(-6, 1.5, -2);
    group.add(r2);
    const r3 = new THREE.Mesh(rollerGeo, steel);
    r3.rotation.x = Math.PI / 2;
    r3.position.set(6, 1.5, 2);
    group.add(r3);
    const r4 = new THREE.Mesh(rollerGeo, steel);
    r4.rotation.x = Math.PI / 2;
    r4.position.set(6, 1.5, -2);
    group.add(r4);

    const rollerGrp = new THREE.Group();
    rollerGrp.add(r1, r2, r3, r4);
    group.add(rollerGrp);
    parts.push({
        name: "Trunnion Rollers",
        description: "Massive steel wheels supporting the kiln.",
        material: "Forged Steel",
        function: "Supports the hundreds of tons of rotating kiln weight.",
        assemblyOrder: 2,
        connections: ["Kiln Shell"],
        failureEffect: "Bearing failure.",
        cascadeFailures: ["Kiln derivation", "Structural collapse"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-4, z:0}
    });

    const fireGeo = new THREE.ConeGeometry(2, 10, 32);
    const fireMesh = new THREE.Mesh(fireGeo, glowingFire);
    fireMesh.rotation.z = -Math.PI / 2;
    fireMesh.position.set(4, 5, 0);
    group.add(fireMesh);
    parts.push({
        name: "Burner Flame",
        description: "Roaring 1500°C plasma/flame injected into the lower end.",
        material: "Plasma Fire",
        function: "Provides the intense heat required for calcination or cement clinker formation.",
        assemblyOrder: 3,
        connections: ["Kiln Shell"],
        failureEffect: "Flame out.",
        cascadeFailures: ["Uncooked product"],
        originalPosition: {x:4, y:5, z:0},
        explodedPosition: {x:12, y:5, z:0}
    });

    const description = "Chemical Rotary Kiln: A colossal, slightly tilted, slowly rotating steel tube lined with firebrick. Solids are fed into the high end, tumbling down toward a roaring burner at the low end, commonly used to make cement or roast ores at extreme temperatures.";

    const quizQuestions = [
        {
            question: "Why is a rotary kiln tilted at a slight angle?",
            options: ["So gravity slowly pulls the tumbling solid material from the feed end down to the discharge/burner end", "To let the exhaust gas out easier", "Because it is too heavy to place flat", "To make it spin faster"],
            correct: 0,
            explanation: "The combination of the slow rotation and the slight downward tilt naturally conveys the solid material through the long tube without needing internal conveyor belts.",
            difficulty: "Easy"
        },
        {
            question: "What is the most common product manufactured globally in colossal rotary kilns?",
            options: ["Portland Cement (Clinker)", "Glass", "Plastics", "Paper"],
            correct: 0,
            explanation: "Rotary kilns are the heart of cement manufacturing, where limestone and clay are heated to 1450°C to form cement 'clinker'.",
            difficulty: "Medium"
        },
        {
            question: "Why does the kiln rotate continuously, even when cooling down?",
            options: ["To prevent the massive steel shell from sagging and permanently warping under its own weight and heat", "To keep the fire going", "It cannot be turned off", "To clean the inside"],
            correct: 0,
            explanation: "A hot rotary kiln is so massive that if it stops spinning while hot, the top cools faster than the bottom, causing the tube to permanently bend (warp) like a banana.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the massive shell slowly
        if (meshes[0]) meshes[0].rotation.x = time * speed * 0.5;
        
        // Flicker the burner flame
        if (meshes[2]) {
            meshes[2].scale.set(1 + Math.random()*0.1, 1 + Math.random()*0.2, 1 + Math.random()*0.1);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRotaryKiln() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
