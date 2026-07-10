import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const runwayDark = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.9 });
    
    const glowingWhite = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2
    });
    const glowingGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2
    });
    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2
    });

    const runwayGeo = new THREE.PlaneGeometry(10, 40);
    const runwayMesh = new THREE.Mesh(runwayGeo, runwayDark);
    runwayMesh.rotation.x = -Math.PI / 2;
    group.add(runwayMesh);
    parts.push({
        name: "Asphalt Runway Surface",
        description: "High-friction grooved asphalt.",
        material: "Asphalt",
        function: "Provides the landing surface.",
        assemblyOrder: 1,
        connections: ["Lighting Mounts"],
        failureEffect: "Hydroplaning.",
        cascadeFailures: ["Aircraft skids off runway"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:-5, z:0}
    });

    // Approach Lighting System (ALSF)
    const approachGrp = new THREE.Group();
    const lightGeo = new THREE.SphereGeometry(0.2, 16, 16);
    for(let i=0; i<10; i++) {
        const l = new THREE.Mesh(lightGeo, glowingWhite);
        l.position.set(0, 0.2, 22 + i);
        approachGrp.add(l);
    }
    group.add(approachGrp);
    parts.push({
        name: "Approach Lighting System (ALS)",
        description: "Sequence of flashing white lights leading to the threshold.",
        material: "High-Intensity Strobe",
        function: "Acts like a 'rabbit' guiding the pilot visually to the start of the runway through thick fog.",
        assemblyOrder: 2,
        connections: ["Runway"],
        failureEffect: "Loss of visual reference.",
        cascadeFailures: ["Missed approach / Go-around"],
        originalPosition: {x:0, y:0.2, z:25},
        explodedPosition: {x:0, y:5, z:25}
    });

    // Threshold Lights (Green)
    const thresholdGrp = new THREE.Group();
    for(let i=-4; i<=4; i++) {
        const l = new THREE.Mesh(lightGeo, glowingGreen);
        l.position.set(i, 0.2, 20);
        thresholdGrp.add(l);
    }
    group.add(thresholdGrp);
    parts.push({
        name: "Runway Threshold Lights",
        description: "Row of bright green lights spanning the width.",
        material: "Green LED / Halogen",
        function: "Positively identifies the beginning of the safe landing zone.",
        assemblyOrder: 3,
        connections: ["Runway"],
        failureEffect: "Undershoot.",
        cascadeFailures: ["Aircraft lands short on grass/dirt"],
        originalPosition: {x:0, y:0.2, z:20},
        explodedPosition: {x:0, y:8, z:20}
    });

    // Edge Lights (White/Yellow)
    const edgeGrp = new THREE.Group();
    for(let i=-18; i<=18; i+=2) {
        const l1 = new THREE.Mesh(lightGeo, glowingWhite);
        l1.position.set(-5, 0.2, i);
        const l2 = new THREE.Mesh(lightGeo, glowingWhite);
        l2.position.set(5, 0.2, i);
        edgeGrp.add(l1, l2);
    }
    group.add(edgeGrp);
    parts.push({
        name: "Runway Edge Lights",
        description: "Elevated or flush white lights marking the sides.",
        material: "White LED",
        function: "Defines the lateral limits of the usable runway.",
        assemblyOrder: 4,
        connections: ["Runway"],
        failureEffect: "Lateral drift.",
        cascadeFailures: ["Aircraft runs off into the mud"],
        originalPosition: {x:0, y:0.2, z:0},
        explodedPosition: {x:-10, y:0.2, z:0} // pulls both sides? Just a rough representation
    });

    // End Lights (Red)
    const endGrp = new THREE.Group();
    for(let i=-4; i<=4; i++) {
        const l = new THREE.Mesh(lightGeo, glowingRed);
        l.position.set(i, 0.2, -20);
        endGrp.add(l);
    }
    group.add(endGrp);
    parts.push({
        name: "Runway End Lights",
        description: "Row of bright red lights.",
        material: "Red LED",
        function: "Warns the pilot that the runway is ending; STOP NOW.",
        assemblyOrder: 5,
        connections: ["Runway"],
        failureEffect: "Overrun.",
        cascadeFailures: ["Aircraft crashes off the end of the runway"],
        originalPosition: {x:0, y:0.2, z:-20},
        explodedPosition: {x:0, y:8, z:-20}
    });

    const description = "Civil Airport Runway Lighting System: A critical safety infrastructure that uses standardized colors (White, Green, Red) and flashing sequences to allow pilots to visually align, land, and stop perfectly center in near-zero visibility conditions.";

    const quizQuestions = [
        {
            question: "What color are the 'Threshold' lights that mark the very beginning of the safe landing zone?",
            options: ["Green", "Red", "Blue", "Yellow"],
            correct: 0,
            explanation: "Threshold lights are always green when viewed from an approaching aircraft, signaling the start of the runway. (If viewed from the other side, they appear red to signal the end).",
            difficulty: "Easy"
        },
        {
            question: "What is the 'rabbit' in aviation lighting?",
            options: ["A sequence of flashing white strobe lights in the approach system that appear to run toward the runway", "A small vehicle that leads planes", "A type of radar", "A light that scares animals away"],
            correct: 0,
            explanation: "The sequenced flashing lights of the Approach Lighting System (ALS) fire one after another toward the runway twice a second. Pilots call this 'catching the rabbit', helping them align in thick fog.",
            difficulty: "Medium"
        },
        {
            question: "Why are runway lights often installed in a 'series' electrical circuit (Constant Current) rather than parallel (Constant Voltage)?",
            options: ["So that every single light bulb along the 2-mile runway burns at the exact same brightness regardless of voltage drop", "To save electricity", "So if one bulb burns out, they all turn off", "It's cheaper to wire"],
            correct: 0,
            explanation: "In a 2-mile long parallel circuit, the lights at the far end would be much dimmer due to voltage drop in the wires. A series Constant Current Regulator ensures exactly 6.6 Amps flows through the whole loop, so every light is equally bright.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Sequence the approach 'rabbit'
        if (group.children[1]) {
            const rabbitIndex = Math.floor(time * speed * 5) % 10;
            group.children[1].children.forEach((l, idx) => {
                if(idx === rabbitIndex) l.material.emissiveIntensity = 5; // Flash bright
                else l.material.emissiveIntensity = 0.5; // Dim
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirportRunwayLightingSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
