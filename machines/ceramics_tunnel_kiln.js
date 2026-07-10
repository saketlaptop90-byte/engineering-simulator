import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingFire = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 3,
        transparent: true, opacity: 0.9
    });

    const kilnGeo = new THREE.BoxGeometry(20, 5, 6);
    const kilnMesh = new THREE.Mesh(kilnGeo, darkSteel);
    kilnMesh.position.set(0, 2.5, 0);
    group.add(kilnMesh);
    parts.push({
        name: "Refractory Tunnel",
        description: "Massive insulated structure.",
        material: "Refractory Brick / Steel",
        function: "Maintains extreme temperature gradients.",
        assemblyOrder: 1,
        connections: ["Gas Burners"],
        failureEffect: "Heat loss.",
        cascadeFailures: ["Uneven firing, cracked ceramics"],
        originalPosition: {x:0, y:2.5, z:0},
        explodedPosition: {x:0, y:15, z:0}
    });

    const fireGeo = new THREE.BoxGeometry(6, 4, 5);
    const fireMesh = new THREE.Mesh(fireGeo, glowingFire);
    fireMesh.position.set(0, 2.5, 0);
    group.add(fireMesh);
    parts.push({
        name: "Firing Zone",
        description: "The hottest central section of the kiln.",
        material: "Plasma / Fire",
        function: "Vitrifies the ceramics at temperatures over 1200°C.",
        assemblyOrder: 2,
        connections: ["Refractory Tunnel"],
        failureEffect: "Flame out.",
        cascadeFailures: ["Unfired products"],
        originalPosition: {x:0, y:2.5, z:0},
        explodedPosition: {x:0, y:2.5, z:10}
    });

    const cartGeo = new THREE.BoxGeometry(3, 1, 4);
    const cartMesh = new THREE.Mesh(cartGeo, steel);
    cartMesh.position.set(-10, 0.5, 0);
    group.add(cartMesh);
    parts.push({
        name: "Kiln Car",
        description: "Refractory-lined cart carrying ceramics.",
        material: "Steel / Firebrick",
        function: "Continuously moves products through preheating, firing, and cooling zones.",
        assemblyOrder: 3,
        connections: ["Tracks"],
        failureEffect: "Derailment inside kiln.",
        cascadeFailures: ["Massive factory shutdown and jam"],
        originalPosition: {x:-10, y:0.5, z:0},
        explodedPosition: {x:-15, y:0.5, z:5}
    });

    const description = "Ceramics Tunnel Kiln: A continuous industrial kiln where refractory cars loaded with ceramics slowly pass through a long tunnel with specific temperature zones (preheating, firing, cooling) for continuous mass production.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a tunnel kiln over a periodic (batch) kiln?",
            options: ["Extremely high energy efficiency from continuous operation", "It takes up less space", "It can fire hotter", "It uses less refractory brick"],
            correct: 0,
            explanation: "Tunnel kilns operate continuously, so the heat from the cooling zone is used to preheat incoming air/ware, making them massively more energy-efficient for large scale production than kilns that heat up and cool down for every batch.",
            difficulty: "Medium"
        },
        {
            question: "What are the three main temperature zones in a tunnel kiln?",
            options: ["Preheating, Firing, Cooling", "Washing, Firing, Glazing", "Drying, Stamping, Firing", "Ignition, Combustion, Exhaust"],
            correct: 0,
            explanation: "Ceramics must be slowly preheated, fired at peak temperature, and then slowly cooled to avoid thermal shock.",
            difficulty: "Easy"
        },
        {
            question: "What happens during the 'vitrification' stage in the firing zone?",
            options: ["The clay particles melt slightly and fuse into a dense, glass-like state", "The water evaporates", "The glaze changes color", "The clay turns to ash"],
            correct: 0,
            explanation: "Vitrification is the process where silicates in the clay melt and fill the pores, fusing the material into a strong, non-porous ceramic.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Move the kiln car through the tunnel
        if (meshes[2]) {
            let xPos = -12 + (time * speed * 2) % 24;
            meshes[2].position.x = xPos;
        }
        // Flicker the fire
        if (meshes[1]) {
            meshes[1].scale.set(1 + Math.random()*0.05, 1 + Math.random()*0.05, 1 + Math.random()*0.05);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTunnelKiln() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
