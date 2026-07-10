import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingReaction = new THREE.MeshPhysicalMaterial({
        color: 0x00ffaa, emissive: 0x008855, emissiveIntensity: 1,
        transparent: true, opacity: 0.8, roughness: 0.2
    });

    const tankGeo = new THREE.CylinderGeometry(4, 4, 8, 32);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(0, 4, 0);
    group.add(tankMesh);
    parts.push({
        name: "CSTR Vessel",
        description: "Continuous Stirred-Tank Reactor shell.",
        material: "Steel (Rendered as Glass)",
        function: "Contains the chemical reaction at steady-state.",
        assemblyOrder: 1,
        connections: ["Agitator", "Baffles", "Cooling Jacket"],
        failureEffect: "Over-pressurization.",
        cascadeFailures: ["Vessel rupture", "Spill"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:0, y:4, z:-10}
    });

    const agitatorGeo = new THREE.CylinderGeometry(0.2, 0.2, 7, 16);
    const agitatorMesh = new THREE.Mesh(agitatorGeo, chrome);
    agitatorMesh.position.set(0, 4.5, 0);
    
    // Rushton turbine blades
    const turbineGeo = new THREE.BoxGeometry(2.5, 0.5, 0.1);
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(turbineGeo, chrome);
        blade.rotation.y = (Math.PI / 4) * i;
        blade.position.set(0, -2, 0);
        agitatorMesh.add(blade);
    }
    
    group.add(agitatorMesh);
    parts.push({
        name: "Rushton Turbine Agitator",
        description: "High-shear mixing impeller.",
        material: "Chrome / Alloy",
        function: "Ensures perfect mixing so that the concentration and temperature are identical everywhere in the tank.",
        assemblyOrder: 2,
        connections: ["Motor", "Tank"],
        failureEffect: "Poor mixing.",
        cascadeFailures: ["Hot spots", "Unreacted chemicals leaving tank"],
        originalPosition: {x:0, y:4.5, z:0},
        explodedPosition: {x:0, y:12, z:0}
    });

    const baffleGeo = new THREE.BoxGeometry(0.2, 7, 1);
    for(let i=0; i<4; i++) {
        const baffle = new THREE.Mesh(baffleGeo, steel);
        const theta = (Math.PI / 2) * i;
        baffle.position.set(Math.sin(theta)*3.5, 4, Math.cos(theta)*3.5);
        baffle.rotation.y = theta;
        group.add(baffle);
    }
    parts.push({
        name: "Wall Baffles",
        description: "Flat plates welded to the inner wall.",
        material: "Steel",
        function: "Prevents the fluid from just swirling in a solid vortex; forces it to mix vertically and radially.",
        assemblyOrder: 3,
        connections: ["Vessel Wall"],
        failureEffect: "Solid body rotation.",
        cascadeFailures: ["Zero mixing efficiency"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:8, y:4, z:0}
    });

    const fluidGeo = new THREE.CylinderGeometry(3.8, 3.8, 6, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, glowingReaction);
    fluidMesh.position.set(0, 3.5, 0);
    group.add(fluidMesh);
    parts.push({
        name: "Reacting Mixture",
        description: "Glowing continuous reaction fluid.",
        material: "Glowing Reactant",
        function: "Raw materials flow in, mix instantly, react, and products flow out continuously.",
        assemblyOrder: 4,
        connections: ["Agitator"],
        failureEffect: "Thermal runaway.",
        cascadeFailures: ["Explosion"],
        originalPosition: {x:0, y:3.5, z:0},
        explodedPosition: {x:-8, y:3.5, z:0}
    });

    const description = "Continuous Stirred-Tank Reactor (CSTR): The most basic continuous chemical reactor. It relies on a powerful agitator and wall baffles to achieve 'perfect mixing', assuming the chemical concentration is exactly the same everywhere inside the tank.";

    const quizQuestions = [
        {
            question: "Why are vertical 'baffles' added to the inside walls of a stirred tank?",
            options: ["To break the vortex and force the fluid to actually mix instead of just spinning in a circle", "To hold the tank together", "To heat the fluid", "To filter out solids"],
            correct: 0,
            explanation: "Without baffles, the impeller will just spin the entire mass of liquid as a solid cylinder (a vortex), resulting in almost zero actual mixing or turbulence.",
            difficulty: "Medium"
        },
        {
            question: "What is the key assumption made when designing a CSTR?",
            options: ["Perfect mixing (temperature and concentration are identical everywhere in the tank)", "No heat is generated", "The fluid moves in a straight line", "The tank is completely empty"],
            correct: 0,
            explanation: "The math for a CSTR relies on the 'perfect mixing' assumption, meaning the moment a drop of reactant enters, it is instantly and uniformly dispersed throughout the entire vessel.",
            difficulty: "Hard"
        },
        {
            question: "What is the difference between a Batch Reactor and a CSTR?",
            options: ["A CSTR has material flowing in and out continuously, while a Batch Reactor is filled once, reacts, and is then emptied", "A CSTR is much smaller", "A batch reactor has no mixer", "There is no difference"],
            correct: 0,
            explanation: "Batch reactors operate in discrete batches, while CSTRs operate continuously at a steady-state.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the agitator fast
        if (meshes[1]) meshes[1].rotation.y = time * speed * 5;
        // Pulse fluid to simulate reaction
        if (meshes[7]) {
            meshes[7].material.emissiveIntensity = 1 + Math.sin(time*speed*3)*0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStirredTankReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
