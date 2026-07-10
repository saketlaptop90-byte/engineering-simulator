import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const xenonGlow = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xe0f7ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonLaser = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });

    // 1. Lamp House
    const lampHouseGeometry = new THREE.BoxGeometry(4, 5, 6);
    const lampHouse = new THREE.Mesh(lampHouseGeometry, darkSteel);
    lampHouse.position.set(-6, 0, 0);
    group.add(lampHouse);
    meshes.lampHouse = lampHouse;
    parts.push({
        name: "Lamp House",
        description: "Enclosure housing the massive Xenon short-arc lamp and reflector.",
        material: "Dark Steel",
        function: "Contains the extremely bright and hot light source, directing it into the projector head.",
        assemblyOrder: 1,
        connections: ["Xenon Lamp", "Reflector", "Heat Exhaust"],
        failureEffect: "Complete loss of illumination.",
        cascadeFailures: ["Film melting if cooling fails while lamp is on"],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 2, z: 0 }
    });

    // 2. Xenon Arc Lamp
    const lampGeometry = new THREE.CapsuleGeometry(0.5, 2, 8, 16);
    const lamp = new THREE.Mesh(lampGeometry, xenonGlow);
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(-6, 0, 0);
    group.add(lamp);
    meshes.lamp = lamp;
    parts.push({
        name: "Xenon Arc Lamp",
        description: "15,000-watt short-arc lamp generating intense white light.",
        material: "Quartz Glass / Xenon Gas",
        function: "Provides the intense illumination required for massive IMAX screens.",
        assemblyOrder: 2,
        connections: ["Lamp House"],
        failureEffect: "No light produced. Lamp explosion can shatter the reflector.",
        cascadeFailures: ["Reflector damage"],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 5, z: 0 }
    });

    // 3. Projector Head / Film Gate
    const headGeometry = new THREE.BoxGeometry(3, 4, 3);
    const head = new THREE.Mesh(headGeometry, aluminum);
    head.position.set(0, 0, 0);
    group.add(head);
    meshes.head = head;
    parts.push({
        name: "Projector Head & Film Gate",
        description: "The core precision mechanism where the film is exposed to light.",
        material: "Machined Aluminum",
        function: "Holds the film flat and registers each frame with vacuum precision.",
        assemblyOrder: 3,
        connections: ["Lamp House", "Rolling Loop Mechanism", "Lens Array"],
        failureEffect: "Film jamming, focus issues.",
        cascadeFailures: ["Film destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Rotor (Rolling Loop Mechanism)
    const rotorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const rotor = new THREE.Mesh(rotorGeometry, chrome);
    rotor.rotation.x = Math.PI / 2;
    rotor.position.set(0, 0, 0);
    group.add(rotor);
    meshes.rotor = rotor;
    parts.push({
        name: "Rotor (Rolling Loop)",
        description: "The unique IMAX film transport mechanism.",
        material: "Chrome / Steel",
        function: "Advances the 70mm film horizontally, creating a rolling loop to minimize stress on the film.",
        assemblyOrder: 4,
        connections: ["Projector Head", "Film Spools"],
        failureEffect: "Film mis-registration or snapping.",
        cascadeFailures: ["Shutter timing offset"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 5. Film Platter / Reels
    const reelGroup = new THREE.Group();
    const reelGeom = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const feedReel = new THREE.Mesh(reelGeom, steel);
    feedReel.position.set(0, 6, -1);
    const takeupReel = new THREE.Mesh(reelGeom, steel);
    takeupReel.position.set(0, -6, -1);
    reelGroup.add(feedReel);
    reelGroup.add(takeupReel);
    group.add(reelGroup);
    meshes.feedReel = feedReel;
    meshes.takeupReel = takeupReel;
    parts.push({
        name: "Film Platters",
        description: "Massive platters holding miles of 15-perf 70mm film.",
        material: "Steel",
        function: "Feeds the film into the projector head and takes up the exposed film.",
        assemblyOrder: 5,
        connections: ["Rotor"],
        failureEffect: "Film spillage or tension loss.",
        cascadeFailures: ["Complete film jam in the projector head"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 6. Objective Lens
    const lensGeometry = new THREE.CylinderGeometry(0.8, 1.2, 3, 32);
    const lens = new THREE.Mesh(lensGeometry, glass);
    lens.rotation.z = Math.PI / 2;
    lens.position.set(3, 0, 0);
    group.add(lens);
    meshes.lens = lens;
    parts.push({
        name: "Objective Lens",
        description: "High-precision optics for projecting the 70mm frame.",
        material: "Optical Glass",
        function: "Focuses the extremely bright image onto the IMAX screen.",
        assemblyOrder: 6,
        connections: ["Projector Head"],
        failureEffect: "Blurry image.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    const description = "The IMAX 70mm Film Projector is a marvel of engineering, using a unique 'Rolling Loop' mechanism to transport massive 15-perforation 70mm film horizontally. It utilizes a 15,000-watt Xenon arc lamp to project images of unparalleled resolution and brightness.";

    const quizQuestions = [
        {
            question: "What unique mechanism does an IMAX projector use to transport film without tearing it at high speeds?",
            options: ["Maltese Cross", "Rolling Loop", "Continuous Pull-down", "Digital Servo Motor"],
            correct: 1,
            explanation: "IMAX projectors use a 'Rolling Loop' mechanism to advance the film horizontally in a wave-like motion, spreading the stress across the film base rather than pulling it harshly.",
            difficulty: "Medium"
        },
        {
            question: "How many perforations (sprocket holes) are there per frame on standard IMAX 70mm film?",
            options: ["4", "5", "8", "15"],
            correct: 3,
            explanation: "IMAX film is known as 15/70 because each massive frame is 15 perforations wide, moving horizontally through the projector.",
            difficulty: "Hard"
        },
        {
            question: "What type of light source is typically used in a classic 70mm IMAX projector to illuminate the massive screen?",
            options: ["Halogen Bulb", "LED Array", "Xenon Short-Arc Lamp", "Carbon Arc"],
            correct: 2,
            explanation: "A high-powered Xenon short-arc lamp (often 15,000 watts) is used to generate the intense brightness required for the huge IMAX screens.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the rotor
        if (meshes.rotor) {
            meshes.rotor.rotation.y = time * speed * 5;
        }
        
        // Spin the film reels
        if (meshes.feedReel && meshes.takeupReel) {
            meshes.feedReel.rotation.y = -time * speed * 2;
            meshes.takeupReel.rotation.y = -time * speed * 2;
        }

        // Pulse the Xenon Lamp slightly
        if (meshes.lamp && meshes.lamp.material) {
            meshes.lamp.material.emissiveIntensity = 5.0 + Math.sin(time * speed * 20) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createImaxProjector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
