import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingSensor = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff, emissive: 0x0055aa, emissiveIntensity: 1.5,
        roughness: 0.1, metalness: 0.8
    });

    const bodyGeo = new THREE.BoxGeometry(4, 5, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.position.set(0, 2.5, 0);
    group.add(bodyMesh);
    parts.push({
        name: "IMAX Camera Body",
        description: "Heavy, robust acoustic housing.",
        material: "Magnesium / Steel",
        function: "Houses the colossal 70mm film transport mechanism and motor.",
        assemblyOrder: 1,
        connections: ["Magazines", "Lens Mount"],
        failureEffect: "Vibration blur.",
        cascadeFailures: ["Unusable extremely expensive footage"],
        originalPosition: {x:0, y:2.5, z:0},
        explodedPosition: {x:0, y:2.5, z:-8}
    });

    const magGeo = new THREE.CylinderGeometry(3, 3, 4, 32);
    const magMesh = new THREE.Mesh(magGeo, plastic);
    magMesh.rotation.z = Math.PI / 2;
    magMesh.position.set(0, 7, -2);
    group.add(magMesh);
    parts.push({
        name: "1000-foot Film Magazine",
        description: "Massive twin spool housing mounted on top.",
        material: "Carbon Fiber / Plastic",
        function: "Holds about 3 minutes of highly expensive 70mm IMAX film.",
        assemblyOrder: 2,
        connections: ["Camera Body"],
        failureEffect: "Light leak.",
        cascadeFailures: ["Ruins thousands of dollars of film"],
        originalPosition: {x:0, y:7, z:-2},
        explodedPosition: {x:0, y:12, z:-2}
    });

    const lensGeo = new THREE.CylinderGeometry(1.5, 2, 4, 32);
    const lensMesh = new THREE.Mesh(lensGeo, chrome);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 2.5, 6);
    group.add(lensMesh);
    parts.push({
        name: "Medium Format Prime Lens",
        description: "Massive, ultra-high-resolution glass optics.",
        material: "Chrome / Glass",
        function: "Projects a massive image circle required to cover the huge 70mm IMAX frame.",
        assemblyOrder: 3,
        connections: ["Lens Mount"],
        failureEffect: "Chromatic aberration.",
        cascadeFailures: ["Soft image on giant screen"],
        originalPosition: {x:0, y:2.5, z:6},
        explodedPosition: {x:0, y:2.5, z:12}
    });

    const filmGeo = new THREE.PlaneGeometry(3, 2);
    const filmMesh = new THREE.Mesh(filmGeo, glowingSensor);
    filmMesh.position.set(0, 2.5, 3.9);
    group.add(filmMesh);
    parts.push({
        name: "70mm Film Frame (15-perf)",
        description: "Glowing neon blue representing the exposure area.",
        material: "Glowing Film",
        function: "Records an image area roughly 10 times larger than standard 35mm film for unmatched resolution.",
        assemblyOrder: 4,
        connections: ["Film Transport Vacuum"],
        failureEffect: "Jitter.",
        cascadeFailures: ["Image shake on screen"],
        originalPosition: {x:0, y:2.5, z:3.9},
        explodedPosition: {x:-5, y:2.5, z:3.9}
    });

    const description = "Cinema IMAX Camera: The pinnacle of analog filmmaking. It runs massive 70mm film horizontally (15 perforations per frame) through the camera at breakneck speeds using a vacuum to hold it perfectly flat against the lens, creating images with theoretical resolution exceeding 18K.";

    const quizQuestions = [
        {
            question: "How does 15/70 IMAX film travel through the camera compared to standard 35mm film?",
            options: ["It travels horizontally, allowing for a frame that is 15 perforations wide", "It travels vertically", "It doesn't move, the lens moves", "It travels in a loop"],
            correct: 0,
            explanation: "To achieve its massive size, IMAX 70mm film is fed horizontally through the camera, allowing a single frame to span 15 perforations (holes) across, creating an image size ten times larger than standard 35mm.",
            difficulty: "Hard"
        },
        {
            question: "Why is an IMAX film camera notoriously loud?",
            options: ["The massive mechanical force required to yank large, heavy 70mm film into place 24 times a second sounds like a sewing machine on steroids", "It has a built-in speaker", "The vacuum pump exhausts gas", "The lens grinds against the glass"],
            correct: 0,
            explanation: "The sheer physical mass of the 70mm film creates incredible noise as the mechanics violently pull and stop it 24 times a second. It is so loud that actors often have to re-record their dialogue (ADR) later.",
            difficulty: "Medium"
        },
        {
            question: "How does the IMAX camera ensure the massive film frame is perfectly flat during exposure to maintain extreme sharpness?",
            options: ["It uses a vacuum to suck the film flat against the glass of the lens element", "It uses heavy metal clamps", "It heats the film to stretch it", "It uses electrostatic charge"],
            correct: 0,
            explanation: "Because the frame is so large, it could bow or warp, ruining focus. IMAX cameras use a vacuum to pull the film perfectly flat against the rear glass element during exposure.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the magazines very fast
        if (group.children[1]) {
            group.children[1].rotation.x = time * speed * 8;
        }
        // Flicker the film to simulate 24fps shutter
        if (group.children[3]) {
            group.children[3].material.emissiveIntensity = 1 + Math.sin(time*speed*24)*1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createImaxCamera() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
