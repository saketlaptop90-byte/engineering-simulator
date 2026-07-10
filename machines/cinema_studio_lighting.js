import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingLED = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, emissive: 0xffddaa, emissiveIntensity: 3, // Tungsten warmth
        transparent: true, opacity: 0.9
    });

    const housingGeo = new THREE.CylinderGeometry(2, 2.5, 3, 32);
    const housingMesh = new THREE.Mesh(housingGeo, darkSteel);
    housingMesh.rotation.x = Math.PI / 2;
    housingMesh.position.set(0, 5, 0);
    group.add(housingMesh);
    parts.push({
        name: "Lamp Housing",
        description: "Vented aluminum and steel barrel.",
        material: "Dark Steel / Aluminum",
        function: "Contains the intense heat of the lamp and prevents light spill.",
        assemblyOrder: 1,
        connections: ["Yoke", "Fresnel Lens"],
        failureEffect: "Overheating.",
        cascadeFailures: ["Lamp explosion"],
        originalPosition: {x:0, y:5, z:0},
        explodedPosition: {x:0, y:5, z:-5}
    });

    const lensGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
    const lensMesh = new THREE.Mesh(lensGeo, glass);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 5, 1.6);
    // Give it ridges
    lensMesh.material.wireframe = true;
    group.add(lensMesh);
    parts.push({
        name: "Fresnel Lens",
        description: "Glass lens with concentric stepped rings.",
        material: "Glass",
        function: "Focuses the light beam smoothly without the thickness and weight of a solid convex lens.",
        assemblyOrder: 2,
        connections: ["Housing"],
        failureEffect: "Cracked glass.",
        cascadeFailures: ["Uneven light beam", "Safety hazard"],
        originalPosition: {x:0, y:5, z:1.6},
        explodedPosition: {x:0, y:5, z:6}
    });

    const doorsGeo = new THREE.BoxGeometry(4.5, 0.1, 1);
    const doorMesh1 = new THREE.Mesh(doorsGeo, darkSteel);
    doorMesh1.position.set(0, 7, 2);
    doorMesh1.rotation.x = -Math.PI / 4;
    group.add(doorMesh1);
    
    const doorMesh2 = new THREE.Mesh(doorsGeo, darkSteel);
    doorMesh2.position.set(0, 3, 2);
    doorMesh2.rotation.x = Math.PI / 4;
    group.add(doorMesh2);
    
    parts.push({
        name: "Barndoors",
        description: "Adjustable metal flaps attached to the front.",
        material: "Black Steel",
        function: "Shapes the light beam and cuts off light spill from hitting unwanted areas of the set.",
        assemblyOrder: 3,
        connections: ["Housing"],
        failureEffect: "Loose hinge.",
        cascadeFailures: ["Unintended light spill ruining contrast"],
        originalPosition: {x:0, y:5, z:2},
        explodedPosition: {x:5, y:5, z:2}
    });

    const beamGeo = new THREE.ConeGeometry(8, 15, 32);
    const beamMesh = new THREE.Mesh(beamGeo, glowingLED);
    beamMesh.rotation.x = Math.PI / 2;
    beamMesh.position.set(0, 5, 9);
    group.add(beamMesh);
    parts.push({
        name: "Tungsten/HMI Light Beam",
        description: "Powerful, directional photons.",
        material: "Glowing Light",
        function: "Illuminates the subject with a high Color Rendering Index (CRI).",
        assemblyOrder: 4,
        connections: ["Lens"],
        failureEffect: "Flicker.",
        cascadeFailures: ["Strobing on camera"],
        originalPosition: {x:0, y:5, z:9},
        explodedPosition: {x:0, y:-5, z:9}
    });

    const description = "Cinema Studio Lighting (Fresnel): The workhorse light of Hollywood. It uses a stepped 'Fresnel' glass lens to focus the light of an intensely hot Tungsten or HMI bulb into a smooth, even pool of light, which is then shaped by metal barndoors.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a Fresnel lens over a standard plano-convex lens in large studio lights?",
            options: ["It achieves the same focal length but is much thinner, lighter, and doesn't crack as easily from extreme heat", "It changes the color of the light to blue", "It uses mirrors instead of glass", "It makes the light completely soft and shadowless"],
            correct: 0,
            explanation: "A standard glass lens large enough for a studio light would be incredibly thick, heavy, and would likely crack from thermal stress. A Fresnel lens 'steps' the curvature, making it thin and light while still focusing the beam.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the 'Barndoors' on the front of the light?",
            options: ["To block and shape the light, preventing it from spilling onto walls or areas you want kept in shadow", "To protect the glass lens during transport", "To act as a heat sink", "To change the color temperature"],
            correct: 0,
            explanation: "Cinematographers use barndoors to 'cut' the light, allowing them to illuminate an actor while keeping the background dark to create contrast and depth.",
            difficulty: "Easy"
        },
        {
            question: "In film lighting, what does an HMI light do compared to a traditional Tungsten light?",
            options: ["It emits daylight-balanced (blue-ish 5600K) light and is vastly more energy efficient", "It emits warm orange light", "It uses a glowing filament", "It is powered by batteries only"],
            correct: 0,
            explanation: "Hydrargyrum Medium-arc Iodide (HMI) lights use an electrical arc through mercury vapor to create a massive amount of light that matches the color temperature of the sun (daylight), unlike tungsten which is warm/orange.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Flicker light intensity slightly
        if (group.children[3]) {
            group.children[3].material.emissiveIntensity = 3 + Math.random() * 0.2;
        }
        // Sweep light left and right slowly
        group.rotation.y = Math.sin(time * speed) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStudioLightingTruss() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
