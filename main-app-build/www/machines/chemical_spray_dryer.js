import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingMist = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, emissive: 0x0088cc, emissiveIntensity: 1,
        transparent: true, opacity: 0.4
    });

    const powderMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 1.0, metalness: 0.0
    });

    const towerGeo = new THREE.CylinderGeometry(4, 1, 10, 32);
    const towerMesh = new THREE.Mesh(towerGeo, glass);
    towerMesh.position.set(0, 5, 0);
    group.add(towerMesh);
    parts.push({
        name: "Drying Chamber (Cyclone Tower)",
        description: "Large conical vessel (rendered transparent).",
        material: "Stainless Steel (Glass)",
        function: "Provides the volume needed for the sprayed droplets to dry before hitting the walls.",
        assemblyOrder: 1,
        connections: ["Atomizer", "Air Heater", "Powder Collection"],
        failureEffect: "Wall build-up.",
        cascadeFailures: ["Product degradation", "Fire hazard"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:-10}
    });

    const atomizerGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const atomizerMesh = new THREE.Mesh(atomizerGeo, chrome);
    atomizerMesh.position.set(0, 10.5, 0);
    group.add(atomizerMesh);
    parts.push({
        name: "Rotary Atomizer",
        description: "Ultra high-speed spinning wheel (up to 30,000 RPM).",
        material: "Chrome / Titanium",
        function: "Shears the incoming liquid slurry into millions of microscopic mist droplets.",
        assemblyOrder: 2,
        connections: ["Drying Chamber"],
        failureEffect: "Large droplets.",
        cascadeFailures: ["Wet product hitting walls", "Wet bottom dump"],
        originalPosition: {x:0, y:10.5, z:0},
        explodedPosition: {x:0, y:15, z:0}
    });

    const mistGeo = new THREE.ConeGeometry(3, 6, 32);
    const mistMesh = new THREE.Mesh(mistGeo, glowingMist);
    mistMesh.rotation.z = Math.PI; // pointing down
    mistMesh.position.set(0, 7, 0);
    group.add(mistMesh);
    parts.push({
        name: "Atomized Mist Cloud",
        description: "Glowing microscopic droplets.",
        material: "Liquid Slurry",
        function: "Flash-dries instantly when contacting the injected hot air.",
        assemblyOrder: 3,
        connections: ["Atomizer"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:7, z:0},
        explodedPosition: {x:-8, y:7, z:0}
    });

    const powderGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const powderMesh = new THREE.Mesh(powderGeo, powderMat);
    powderMesh.position.set(0, -1, 0);
    group.add(powderMesh);
    parts.push({
        name: "Dry Powder Product",
        description: "Fine, free-flowing dry powder.",
        material: "Solid Powder",
        function: "The final collected product falling from the bottom cone.",
        assemblyOrder: 4,
        connections: ["Drying Chamber"],
        failureEffect: "Clumping.",
        cascadeFailures: ["Blockage of rotary valve"],
        originalPosition: {x:0, y:-1, z:0},
        explodedPosition: {x:8, y:-1, z:0}
    });

    const description = "Chemical Spray Dryer: A machine that rapidly transforms a liquid solution or slurry into a dry powder. It uses a high-speed atomizer to create a fine mist, which is instantly flash-dried by a blast of hot air before the droplets can hit the chamber walls.";

    const quizQuestions = [
        {
            question: "Why is spray drying so effective for heat-sensitive materials (like milk powder or pharmaceuticals)?",
            options: ["The evaporation happens so quickly (flash drying) that the droplet cools itself and the product never actually gets hot", "It uses cold air instead of hot air", "The atomizer adds ice", "It happens in a vacuum"],
            correct: 0,
            explanation: "Evaporative cooling protects the product. Because the mist has massive surface area, the water flashes to steam instantly. The latent heat of vaporization absorbs the thermal energy, keeping the solid particle cool.",
            difficulty: "Hard"
        },
        {
            question: "What does the 'Atomizer' do in a spray dryer?",
            options: ["It violently breaks the liquid stream into millions of microscopic droplets to maximize surface area", "It splits the atoms to create nuclear energy", "It adds oxygen", "It sweeps the powder off the floor"],
            correct: 0,
            explanation: "An atomizer (either a high-pressure nozzle or a high-speed spinning wheel) shears the liquid into a fine mist, which is required for instantaneous drying.",
            difficulty: "Medium"
        },
        {
            question: "What shape is the bottom of a typical spray drying chamber?",
            options: ["A steep cone", "Perfectly flat", "A sphere", "A square box"],
            correct: 0,
            explanation: "The bottom is conical to allow the newly formed dry powder to funnel smoothly down into the collection valve via gravity.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin atomizer at extreme speed
        if (meshes[1]) meshes[1].rotation.y = time * speed * 20;
        
        // Pulse mist to simulate spray
        if (meshes[2]) {
            meshes[2].scale.set(1 + Math.sin(time*speed*10)*0.05, 1 + Math.sin(time*speed*10)*0.05, 1 + Math.sin(time*speed*10)*0.05);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSprayDryerSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
