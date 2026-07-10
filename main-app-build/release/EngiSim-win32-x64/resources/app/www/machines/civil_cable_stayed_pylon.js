import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, roughness: 1.0 });
    
    // Glowing tension cables
    const cableMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.5,
        roughness: 0.2
    });

    const pylonGeo = new THREE.CylinderGeometry(1, 3, 25, 4); // Square-ish tapering pyramid
    const pylonMesh = new THREE.Mesh(pylonGeo, concreteMat);
    pylonMesh.position.set(0, 12.5, 0);
    group.add(pylonMesh);
    parts.push({
        name: "Central Pylon (Tower)",
        description: "Tall, tapering concrete or steel tower.",
        material: "Reinforced Concrete",
        function: "Absorbs all the tension from the cables and translates it into pure downward compression into the foundation.",
        assemblyOrder: 1,
        connections: ["Cables", "Foundation"],
        failureEffect: "Buckling under compression.",
        cascadeFailures: ["Catastrophic tower collapse"],
        originalPosition: {x:0, y:12.5, z:0},
        explodedPosition: {x:0, y:12.5, z:-8}
    });

    const deckGeo = new THREE.BoxGeometry(30, 0.5, 4);
    const deckMesh = new THREE.Mesh(deckGeo, darkSteel);
    deckMesh.position.set(0, 5, 0);
    group.add(deckMesh);
    parts.push({
        name: "Bridge Deck",
        description: "The roadway surface hanging in mid-air.",
        material: "Steel Box Girder",
        function: "Carries traffic. Instead of being supported from below, it is suspended entirely by the cables from above.",
        assemblyOrder: 2,
        connections: ["Cables"],
        failureEffect: "Aerodynamic flutter.",
        cascadeFailures: ["Deck twists and snaps (like Tacoma Narrows)"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:-3, z:0}
    });

    // Create the 'Fan' of cables
    const cableGrp = new THREE.Group();
    // Cable attachment points on deck (X axis)
    const attachPoints = [-12, -9, -6, -3, 3, 6, 9, 12];
    
    attachPoints.forEach((xPos, index) => {
        // Calculate length and angle
        const dx = xPos;
        const dy = 20 - 5; // Pylon attach height (20) - Deck height (5)
        const length = Math.sqrt(dx*dx + dy*dy);
        
        const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        const cable = new THREE.Mesh(cableGeo, cableMat);
        
        // Position exactly in middle of the line
        cable.position.set(xPos / 2, 5 + (dy / 2), 0);
        
        // Rotate to connect pylon to deck
        cable.rotation.z = Math.atan2(dx, dy);
        
        cableGrp.add(cable);
    });

    group.add(cableGrp);
    parts.push({
        name: "Stay Cables (Harp/Fan Configuration)",
        description: "Thick bundles of high-tensile steel wire encased in plastic.",
        material: "Steel (Glowing)",
        function: "Carries the weight of the deck in pure tension, pulling straight back to the central pylon.",
        assemblyOrder: 3,
        connections: ["Deck", "Pylon"],
        failureEffect: "Cable snap from corrosion/fatigue.",
        cascadeFailures: ["Adjacent cables overload and snap in a chain reaction"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:8}
    });

    const description = "Cable-Stayed Bridge Pylon: A highly efficient, modern bridge design where the deck is supported by straight cables connecting directly to one or more massive vertical towers (pylons). Unlike a suspension bridge (which uses a draped main cable), cable-stayed cables run in straight lines, making the bridge much stiffer.";

    const quizQuestions = [
        {
            question: "What is the primary difference between a Cable-Stayed bridge and a Suspension bridge (like the Golden Gate)?",
            options: ["Cable-stayed cables connect directly from the deck straight to the tower. Suspension bridges have a main draped cable, and vertical suspender cables drop down from it.", "Suspension bridges don't use cables", "Cable-stayed bridges are only for trains", "There is no difference"],
            correct: 0,
            explanation: "In a cable-stayed bridge, the cables form a straight A-shape or fan shape directly from the tower to the deck. This makes them stiffer and cheaper to build for medium-long spans than suspension bridges.",
            difficulty: "Medium"
        },
        {
            question: "What forces are the stay cables and the central pylon experiencing, respectively?",
            options: ["Cables: Tension (pulling). Pylon: Compression (pushing down).", "Cables: Compression. Pylon: Tension.", "Both experience bending", "Both experience torsion"],
            correct: 0,
            explanation: "The weight of the deck pulls on the cables (Tension). The cables pull diagonally down on the top of the tower, driving the tower straight down into the ground (Compression).",
            difficulty: "Hard"
        },
        {
            question: "Why do engineers often install hydraulic dampers (shock absorbers) where the cables meet the deck?",
            options: ["To prevent the cables from violently vibrating or 'galloping' in high winds or rain", "To pull the cables tighter", "To make the bridge bounce on purpose", "To pump oil to the top of the tower"],
            correct: 0,
            explanation: "Long stay cables act like guitar strings. Wind and rain can cause them to violently vibrate (rain-wind induced vibration), leading to metal fatigue. Dampers absorb this kinetic energy.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the cables to simulate varying tension loads as 'traffic' passes
        if (group.children[2]) {
            group.children[2].children.forEach((c, i) => {
                c.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 3 + i) * 0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCableStayedPylon() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
