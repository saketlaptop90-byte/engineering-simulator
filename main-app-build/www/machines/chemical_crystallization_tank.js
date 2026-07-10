import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingCrystal = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, emissive: 0x0088cc, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.9, roughness: 0.1, transmission: 0.8
    });

    const tankGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(0, 3, 0);
    group.add(tankMesh);
    parts.push({
        name: "Crystallization Tank",
        description: "Jacketed glass/steel vessel.",
        material: "Glass",
        function: "Holds the supersaturated solution and controls the cooling rate.",
        assemblyOrder: 1,
        connections: ["Agitator", "Cooling Jacket"],
        failureEffect: "Thermal shock cracking.",
        cascadeFailures: ["Loss of containment"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:3, z:-8}
    });

    const agitatorGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const agitatorMesh = new THREE.Mesh(agitatorGeo, steel);
    agitatorMesh.position.set(0, 3, 0);
    
    // add impeller blades
    const bladeGeo = new THREE.BoxGeometry(2.5, 0.2, 0.5);
    const blade1 = new THREE.Mesh(bladeGeo, steel);
    blade1.position.set(0, -2, 0);
    agitatorMesh.add(blade1);
    const blade2 = new THREE.Mesh(bladeGeo, steel);
    blade2.position.set(0, -2, 0);
    blade2.rotation.y = Math.PI / 2;
    agitatorMesh.add(blade2);

    group.add(agitatorMesh);
    parts.push({
        name: "Agitator Impeller",
        description: "Slow-moving mixing blades.",
        material: "Stainless Steel",
        function: "Keeps crystals suspended and ensures uniform temperature.",
        assemblyOrder: 2,
        connections: ["Motor", "Tank"],
        failureEffect: "Crystal settling and agglomeration.",
        cascadeFailures: ["Formation of a solid rock at the bottom"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:10, z:0}
    });

    // Create a bunch of crystals inside
    const crystalsGrp = new THREE.Group();
    const crysGeo = new THREE.OctahedronGeometry(0.3);
    for(let i=0; i<20; i++){
        const crys = new THREE.Mesh(crysGeo, glowingCrystal);
        crys.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
        crys.rotation.set(Math.random(), Math.random(), Math.random());
        crystalsGrp.add(crys);
    }
    crystalsGrp.position.set(0, 3, 0);
    group.add(crystalsGrp);
    parts.push({
        name: "Supersaturated Crystals",
        description: "Glowing neon crystalline structures.",
        material: "Glowing Crystal",
        function: "The purified solid product precipitating out of solution.",
        assemblyOrder: 3,
        connections: ["Tank Solution"],
        failureEffect: "Too many small crystals (nucleation instead of growth).",
        cascadeFailures: ["Difficult filtration downstream"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:8, y:3, z:0}
    });

    const description = "Chemical Crystallization Tank: A precise vessel that carefully cools or evaporates a supersaturated liquid solution, causing pure solid crystals to nucleate and grow while leaving impurities in the remaining liquid (mother liquor).";

    const quizQuestions = [
        {
            question: "What is 'supersaturation'?",
            options: ["A state where a liquid contains more dissolved solid than it normally can hold at that temperature", "When a liquid becomes a gas", "When water is completely pure", "When a crystal melts"],
            correct: 0,
            explanation: "Supersaturation is the driving force of crystallization. The solution is pushed beyond its solubility limit (often by cooling), forcing the excess solute to precipitate out as solid crystals.",
            difficulty: "Medium"
        },
        {
            question: "Why is an agitator (mixer) important during crystallization?",
            options: ["To prevent crystals from settling and ensure uniform crystal growth", "To break the crystals into dust", "To heat the solution", "To cause cavitation"],
            correct: 0,
            explanation: "Agitation keeps the crystals suspended, allowing fresh supersaturated solution to reach all faces of the crystal for even growth, and prevents them from clumping into a giant block.",
            difficulty: "Medium"
        },
        {
            question: "What happens if a solution is cooled too rapidly in a crystallizer?",
            options: ["Rapid 'nucleation' occurs, creating a huge number of tiny, impure crystals", "Large, highly pure crystals form", "The solution explodes", "The crystals dissolve"],
            correct: 0,
            explanation: "Rapid cooling creates a huge driving force that favors 'nucleation' (spawning new crystals) rather than 'growth' (adding to existing crystals), resulting in very fine, hard-to-filter crystal dust.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate agitator
        if (meshes[1]) meshes[1].rotation.y = time * speed * 2;
        // Slowly rotate and scale crystals to simulate growth
        if (meshes[2]) {
            meshes[2].rotation.y = time * speed * 0.5;
            const scale = 1 + (Math.sin(time*speed)*0.5);
            meshes[2].scale.set(scale, scale, scale);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCrystallizationTank() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
