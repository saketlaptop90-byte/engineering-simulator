import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingLight = new THREE.MeshPhysicalMaterial({
        color: 0xffffee, emissive: 0xffffff, emissiveIntensity: 2.5,
        transparent: true, opacity: 0.9, roughness: 0.1
    });

    const bodyGeo = new THREE.BoxGeometry(4, 6, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.position.set(0, 3, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Projector Housing",
        description: "Heavy cast-iron and steel casing.",
        material: "Dark Steel",
        function: "Encloses the high-intensity lamp house and delicate mechanical gears.",
        assemblyOrder: 1,
        connections: ["Lamp House", "Lens Mount"],
        failureEffect: "Light leak.",
        cascadeFailures: ["Fogged film", "Overheating"],
        originalPosition: {x:0, y:3, z:0},
        explodedPosition: {x:0, y:3, z:-8}
    });

    const lensGeo = new THREE.CylinderGeometry(0.8, 1.2, 3, 32);
    const lensMesh = new THREE.Mesh(lensGeo, glass);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 3, 5.5);
    group.add(lensMesh);
    parts.push({
        name: "Projection Lens",
        description: "Multi-element precision optical glass lens.",
        material: "Glass / Aluminum",
        function: "Focuses the light passing through the 35mm film frame onto the distant cinema screen.",
        assemblyOrder: 2,
        connections: ["Housing"],
        failureEffect: "Blurry image.",
        cascadeFailures: ["Audience complaints"],
        originalPosition: {x:0, y:3, z:5.5},
        explodedPosition: {x:0, y:3, z:12}
    });

    const beamGeo = new THREE.ConeGeometry(5, 10, 32);
    const beamMesh = new THREE.Mesh(beamGeo, glowingLight);
    beamMesh.rotation.x = Math.PI / 2;
    beamMesh.position.set(0, 3, 12);
    // Make the beam originate from the lens
    beamMesh.geometry.translate(0, -5, 0);
    group.add(beamMesh);
    parts.push({
        name: "High-Intensity Xenon Light Beam",
        description: "Intense, focused photon stream.",
        material: "Glowing Light",
        function: "Illuminates the film and projects it thousands of times larger.",
        assemblyOrder: 3,
        connections: ["Lens"],
        failureEffect: "Lamp burnout.",
        cascadeFailures: ["Black screen"],
        originalPosition: {x:0, y:3, z:12},
        explodedPosition: {x:10, y:3, z:12}
    });

    const reelGeo = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const reel1 = new THREE.Mesh(reelGeo, chrome);
    reel1.rotation.z = Math.PI / 2;
    reel1.position.set(0, 9, -2);
    group.add(reel1);
    
    const reel2 = new THREE.Mesh(reelGeo, chrome);
    reel2.rotation.z = Math.PI / 2;
    reel2.position.set(0, 9, 3);
    group.add(reel2);

    parts.push({
        name: "Film Reels (Feed & Take-Up)",
        description: "Large metal spools holding thousands of feet of 35mm film.",
        material: "Chrome / Film",
        function: "Feeds unprojected film into the mechanism and rolls it back up after projection.",
        assemblyOrder: 4,
        connections: ["Sprockets"],
        failureEffect: "Film snap or tangle.",
        cascadeFailures: ["Melted film", "Show stopped"],
        originalPosition: {x:0, y:9, z:0.5},
        explodedPosition: {x:0, y:15, z:0.5}
    });

    const description = "Cinema Film Projector: A classic mechanical and optical marvel that rapidly pulls 35mm celluloid film through a high-intensity light beam at 24 frames per second, using a Geneva drive to stop each frame perfectly still for a fraction of a second to project the illusion of motion.";

    const quizQuestions = [
        {
            question: "Why does a film projector use a 'Maltese Cross' or 'Geneva Drive' mechanism?",
            options: ["To intermittently pull the film down, stopping it perfectly still for a fraction of a second while the light flashes", "To keep the film moving smoothly at a constant speed", "To rewind the film", "To create color"],
            correct: 0,
            explanation: "If the film moved continuously, the image would be a blur. The Geneva drive converts continuous rotation into intermittent motion, jerking the next frame into place and stopping it dead while the shutter opens.",
            difficulty: "Hard"
        },
        {
            question: "What is the standard frame rate for traditional cinematic film projection?",
            options: ["24 frames per second", "30 frames per second", "60 frames per second", "12 frames per second"],
            correct: 0,
            explanation: "24 frames per second (fps) was established as the industry standard for 35mm sound film, balancing the cost of film stock with smooth motion and adequate audio fidelity.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the film jams in the projector gate?",
            options: ["The intense heat from the Xenon lamp will melt and literally ignite the film frame within seconds", "It just stops playing", "The lens shatters", "The colors invert"],
            correct: 0,
            explanation: "The concentrated heat from the projector lamp is so intense that if the film stops moving for even a second, it will burn through, causing a classic 'melted frame' effect.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the reels
        if (meshes[3]) {
            // Using meshes[3] logic; but we added 4 meshes total.
            // reel1 and reel2 were added directly. Let's find them by traversing or just use hardcoded indices.
        }
        // Since we added meshes directly to group:
        // group.children[0] = body
        // group.children[1] = lens
        // group.children[2] = beam
        // group.children[3] = reel1
        // group.children[4] = reel2
        if (group.children[3]) group.children[3].rotation.x = time * speed * 2;
        if (group.children[4]) group.children[4].rotation.x = time * speed * 2;
        
        // Flicker the projector beam
        if (group.children[2]) {
            group.children[2].material.opacity = 0.8 + Math.random() * 0.2;
            group.children[2].scale.set(1 + Math.random()*0.02, 1 + Math.random()*0.02, 1 + Math.random()*0.02);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFilmProjector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
