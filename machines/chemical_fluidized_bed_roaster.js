import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingOre = new THREE.MeshPhysicalMaterial({
        color: 0xff3300, emissive: 0xff1100, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.9, roughness: 0.4
    });

    const shellGeo = new THREE.CylinderGeometry(5, 5, 10, 32);
    const shellMesh = new THREE.Mesh(shellGeo, darkSteel);
    shellMesh.position.set(0, 5, 0);
    group.add(shellMesh);
    parts.push({
        name: "Refractory-Lined Roaster Shell",
        description: "Massive steel cylinder lined with heat-resistant brick.",
        material: "Steel / Firebrick",
        function: "Contains extreme temperatures (up to 1000°C) for metallurgical roasting.",
        assemblyOrder: 1,
        connections: ["Tuyeres", "Exhaust"],
        failureEffect: "Refractory brick collapse.",
        cascadeFailures: ["Steel shell melts", "Catastrophic breach"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:-12}
    });

    const tuyereGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const tuyereMesh = new THREE.Mesh(tuyereGeo, chrome);
    tuyereMesh.rotation.z = Math.PI / 2;
    tuyereMesh.position.set(0, 1, 0);
    group.add(tuyereMesh);
    parts.push({
        name: "Air Tuyeres (Injectors)",
        description: "Pipes injecting high-pressure air/oxygen.",
        material: "Chrome / Alloy",
        function: "Provides the oxygen required for the roasting reaction and fluidizes the ore.",
        assemblyOrder: 2,
        connections: ["Blower", "Roaster Shell"],
        failureEffect: "Clogging with molten ore.",
        cascadeFailures: ["Loss of fluidization", "Bed slumps and solidifies"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:-3, z:0}
    });

    // Bubbling hot ore bed
    const bedGroup = new THREE.Group();
    const oreGeo = new THREE.DodecahedronGeometry(0.3);
    for(let i=0; i<60; i++) {
        const p = new THREE.Mesh(oreGeo, glowingOre);
        p.position.set((Math.random()-0.5)*8, Math.random()*5, (Math.random()-0.5)*8);
        bedGroup.add(p);
    }
    bedGroup.position.set(0, 1.5, 0);
    group.add(bedGroup);
    parts.push({
        name: "Fluidized Sulfide Ore Bed",
        description: "Roiling, bubbling bed of glowing hot metallic ore.",
        material: "Glowing Sulfide Ore",
        function: "Reacts violently with oxygen to burn off sulfur as SO2 gas, leaving metal oxides.",
        assemblyOrder: 3,
        connections: ["Air Tuyeres"],
        failureEffect: "Defluidization (sintering).",
        cascadeFailures: ["Ore melts into a giant solid block (clinker)"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:10, y:4, z:0}
    });

    const description = "Fluidized Bed Roaster: A highly exothermic metallurgical furnace where finely crushed sulfide ores (like zinc or copper) are suspended in an upward blast of air, literally burning the sulfur out of the rock to prepare it for smelting.";

    const quizQuestions = [
        {
            question: "What is the primary chemical purpose of 'roasting' a sulfide ore?",
            options: ["To convert metal sulfides into metal oxides and sulfur dioxide gas", "To melt the metal into a liquid puddle", "To wash the dirt off the rocks", "To freeze the ore"],
            correct: 0,
            explanation: "Sulfide ores are difficult to smelt directly. Roasting burns them in oxygen to convert them to Metal Oxides (which are easy to smelt) and SO2 gas (which is captured to make sulfuric acid).",
            difficulty: "Hard"
        },
        {
            question: "Why does the fluidized bed roaster often not need external fuel (like gas or coal) once it starts?",
            options: ["The oxidation of the sulfur in the ore is highly exothermic (it generates its own massive heat)", "It uses solar panels", "It operates at room temperature", "It runs on electricity"],
            correct: 0,
            explanation: "The reaction of sulfide ore with oxygen is fiercely exothermic. Once ignited, the burning sulfur provides all the heat needed to keep the bed at 800-1000°C (autogenous roasting).",
            difficulty: "Medium"
        },
        {
            question: "What is a 'clinker' in the context of a roaster?",
            options: ["A solid chunk of fused/melted ore that forms if the bed gets too hot and stops fluidizing", "The spark plug that ignites it", "The exhaust gas", "A type of coal"],
            correct: 0,
            explanation: "If the temperature exceeds the melting point of the ore, the particles fuse together into giant solid masses called clinkers, causing the bed to slump and requiring a complete shutdown and jackhammering to fix.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the boiling hot ore bed
        if (meshes[2]) {
            meshes[2].children.forEach((p, idx) => {
                p.position.y += Math.sin(time * speed * 6 + idx) * 0.15;
                p.rotation.x += 0.05;
                p.rotation.y += 0.05;
                if(p.position.y > 5) p.position.y = 0; 
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFluidizedBedRoaster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
