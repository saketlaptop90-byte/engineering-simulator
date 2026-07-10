import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingBed = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 2,
        transparent: true, opacity: 0.9, roughness: 0.3
    });

    const reactorGeo = new THREE.CylinderGeometry(4, 4, 12, 32);
    const reactorMesh = new THREE.Mesh(reactorGeo, glass);
    reactorMesh.position.set(0, 6, 0);
    group.add(reactorMesh);
    parts.push({
        name: "Fluidized Bed Reactor Vessel",
        description: "Tall cylindrical container.",
        material: "Glass / Steel",
        function: "Contains the solid catalyst particles and process gas.",
        assemblyOrder: 1,
        connections: ["Gas Distributor", "Cyclones"],
        failureEffect: "Loss of containment.",
        cascadeFailures: ["Toxic gas release", "Explosion"],
        originalPosition: {x:0, y:6, z:0},
        explodedPosition: {x:0, y:6, z:-10}
    });

    const plateGeo = new THREE.CylinderGeometry(3.9, 3.9, 0.2, 32);
    const plateMesh = new THREE.Mesh(plateGeo, chrome);
    plateMesh.position.set(0, 1, 0);
    // Grid pattern
    plateMesh.material.wireframe = true;
    group.add(plateMesh);
    parts.push({
        name: "Gas Distributor Plate",
        description: "Perforated metal grid at the bottom.",
        material: "Chrome",
        function: "Injects high-velocity gas evenly across the entire bottom of the bed.",
        assemblyOrder: 2,
        connections: ["Reactor Vessel", "Gas Inlet Compressor"],
        failureEffect: "Uneven gas distribution.",
        cascadeFailures: ["Dead zones", "Channeling", "Loss of fluidization"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:-2, z:0}
    });

    // Create bubbling fluidized bed particles
    const bedGroup = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    for(let i=0; i<80; i++) {
        const p = new THREE.Mesh(particleGeo, glowingBed);
        p.position.set((Math.random()-0.5)*6, Math.random()*6, (Math.random()-0.5)*6);
        bedGroup.add(p);
    }
    bedGroup.position.set(0, 1.2, 0);
    group.add(bedGroup);
    parts.push({
        name: "Fluidized Catalyst Bed",
        description: "Millions of tiny glowing catalyst particles.",
        material: "Glowing Ceramic/Metal Particles",
        function: "Suspended by the upward gas flow, behaving exactly like a boiling liquid to maximize reaction surface area.",
        assemblyOrder: 3,
        connections: ["Distributor Plate"],
        failureEffect: "Particle attrition (grinding to dust).",
        cascadeFailures: ["Dust blown out exhaust", "Loss of catalyst"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:8, y:4, z:0}
    });

    const description = "Chemical Fluidized Bed: An advanced reactor where an upward flow of gas suspends solid granular particles (usually a catalyst), making the solid bed behave like a bubbling, boiling liquid with incredible heat and mass transfer properties.";

    const quizQuestions = [
        {
            question: "What does it mean when a solid bed becomes 'fluidized'?",
            options: ["The upward force of the gas exactly counteracts gravity, suspending the particles so they flow like a liquid", "The solid particles actually melt into a liquid", "Water is added to make mud", "The gas turns into a solid"],
            correct: 0,
            explanation: "When gas velocity reaches the 'minimum fluidization velocity', the drag force balances gravity. The solid particles unlock and move freely, behaving macroscopically exactly like a boiling fluid.",
            difficulty: "Medium"
        },
        {
            question: "Why is a fluidized bed often preferred over a packed (stationary) bed?",
            options: ["It provides completely uniform temperature with no hot-spots", "It requires less energy to pump the gas", "It prevents the catalyst from moving", "It is much smaller"],
            correct: 0,
            explanation: "Because the particles are violently mixing like a boiling liquid, heat is transferred incredibly fast, resulting in a perfectly uniform temperature throughout the reactor (no dangerous hot-spots).",
            difficulty: "Hard"
        },
        {
            question: "What is a major downside of a fluidized bed?",
            options: ["Particle attrition (the particles grind against each other and turn to dust)", "It is too quiet", "It doesn't work with gases", "It creates too much ice"],
            correct: 0,
            explanation: "The constant violent collisions cause 'attrition', grinding the expensive catalyst particles into fine dust which gets blown out the top of the reactor.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the boiling bed
        if (meshes[2]) {
            meshes[2].children.forEach((p, idx) => {
                p.position.y += Math.sin(time * speed * 5 + idx) * 0.1;
                if(p.position.y > 6) p.position.y = 0; // wrap around
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFluidizedBed() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
