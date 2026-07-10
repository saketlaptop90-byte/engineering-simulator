import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingCatalyst = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x005500, emissiveIntensity: 2,
        roughness: 0.8, metalness: 0.1
    });

    const gasA = new THREE.MeshPhysicalMaterial({
        color: 0xff0000, emissive: 0xaa0000, transparent: true, opacity: 0.6
    });

    const gasB = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff, emissive: 0x0000aa, transparent: true, opacity: 0.6
    });

    const vesselGeo = new THREE.CylinderGeometry(3, 3, 10, 32);
    const vesselMesh = new THREE.Mesh(vesselGeo, glass);
    vesselMesh.position.set(0, 5, 0);
    group.add(vesselMesh);
    parts.push({
        name: "Reactor Vessel",
        description: "Heavy-walled steel cylinder (rendered in glass).",
        material: "Steel (Glass)",
        function: "Contains the high-pressure catalyst bed and reactants.",
        assemblyOrder: 1,
        connections: ["Catalyst Bed"],
        failureEffect: "Rupture under pressure.",
        cascadeFailures: ["Explosive decompression", "Toxic leak"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:-10}
    });

    const bedGroup = new THREE.Group();
    const pelletGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8);
    for(let i=0; i<150; i++) {
        const p = new THREE.Mesh(pelletGeo, glowingCatalyst);
        p.position.set((Math.random()-0.5)*5, (Math.random()-0.5)*7, (Math.random()-0.5)*5);
        p.rotation.set(Math.random(), Math.random(), Math.random());
        bedGroup.add(p);
    }
    bedGroup.position.set(0, 5, 0);
    group.add(bedGroup);
    parts.push({
        name: "Stationary Catalyst Bed",
        description: "Thousands of solid, porous glowing catalyst pellets packed tightly.",
        material: "Glowing Catalyst",
        function: "Lowers the activation energy of the reaction without being consumed.",
        assemblyOrder: 2,
        connections: ["Vessel"],
        failureEffect: "Catalyst poisoning or coking.",
        cascadeFailures: ["Reaction stops completely"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:8, y:5, z:0}
    });

    const flowAGeo = new THREE.CylinderGeometry(2.8, 2.8, 2, 32);
    const flowAMesh = new THREE.Mesh(flowAGeo, gasA);
    flowAMesh.position.set(0, 8, 0);
    group.add(flowAMesh);
    parts.push({
        name: "Unreacted Feed Gas (Red)",
        description: "Raw chemical reactants entering the top.",
        material: "Red Gas",
        function: "Flows downward through the voids in the catalyst bed.",
        assemblyOrder: 3,
        connections: ["Catalyst Bed"],
        failureEffect: "Incorrect feed ratio.",
        cascadeFailures: ["Runaway thermal reaction"],
        originalPosition: {x:0, y:8, z:0},
        explodedPosition: {x:-5, y:8, z:0}
    });

    const flowBGeo = new THREE.CylinderGeometry(2.8, 2.8, 2, 32);
    const flowBMesh = new THREE.Mesh(flowBGeo, gasB);
    flowBMesh.position.set(0, 2, 0);
    group.add(flowBMesh);
    parts.push({
        name: "Product Gas (Blue)",
        description: "Newly formed chemical products exiting the bottom.",
        material: "Blue Gas",
        function: "The desired output after reacting on the catalyst surface.",
        assemblyOrder: 4,
        connections: ["Catalyst Bed"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:2, z:0},
        explodedPosition: {x:5, y:2, z:0}
    });

    const description = "Chemical Packed Bed Reactor: A foundational industrial reactor consisting of a tube filled with solid catalyst pellets. Reactant gases flow through the stationary bed, reacting on the high-surface-area pellets to form the product.";

    const quizQuestions = [
        {
            question: "What is the primary role of the solid pellets in a packed bed reactor?",
            options: ["To act as a catalyst, speeding up the chemical reaction without being consumed", "To filter out dirt", "To heat the gas", "To absorb water"],
            correct: 0,
            explanation: "The pellets are a solid catalyst (like platinum or palladium on a ceramic support) that provide active sites for molecules to react much faster than they would in empty space.",
            difficulty: "Easy"
        },
        {
            question: "Why is a packed bed sometimes called a 'fixed bed'?",
            options: ["Because the solid catalyst particles are entirely stationary and don't move", "Because it is bolted to the floor", "Because it fixes broken chemicals", "Because the temperature is fixed"],
            correct: 0,
            explanation: "Unlike a 'fluidized' bed where particles bubble and boil, a 'packed' or 'fixed' bed has the catalyst pellets tightly packed so they remain completely stationary as fluid flows past them.",
            difficulty: "Medium"
        },
        {
            question: "What is a major challenge regarding heat in a large packed bed reactor?",
            options: ["Poor heat transfer leading to dangerous localized 'hot spots' inside the bed", "It gets too cold too fast", "It produces too much electricity", "The metal rusts"],
            correct: 0,
            explanation: "Because the solid pellets don't move and gas is a poor conductor, highly exothermic reactions can cause extreme 'hot spots' deep inside the bed, melting the catalyst or causing explosions.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Feed gas moves down and turns into product
        if (meshes[2]) {
            meshes[2].position.y = 8 - ((time * speed * 2) % 6);
        }
        if (meshes[3]) {
            meshes[3].position.y = 5 - ((time * speed * 2) % 4);
        }
        // Pulse the catalyst
        if (meshes[1]) {
            meshes[1].children.forEach((p, idx) => {
                p.material.emissiveIntensity = 1 + Math.sin(time*speed*5 + idx);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPackedBedReactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
