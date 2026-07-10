import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffeebb,
        transparent: true,
        opacity: 0.9,
    });
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });
    const sensorGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00aa88,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });
    const solarPanelMat = new THREE.MeshStandardMaterial({
        color: 0x051535,
        roughness: 0.3,
        metalness: 0.9,
        wireframe: true
    });
    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.2,
        metalness: 1.0,
        bumpScale: 0.05
    });

    // 1. Telescope Tube
    const tubeGeo = new THREE.CylinderGeometry(2, 2, 10, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, goldFoil);
    tube.rotation.x = Math.PI / 2;
    group.add(tube);
    meshes.tube = tube;
    parts.push({
        name: 'Telescope Tube',
        description: 'Main structural housing for the optical components, wrapped in thermal foil.',
        material: 'goldFoil',
        function: 'Structural support and thermal regulation.',
        assemblyOrder: 1,
        connections: ['primaryMirror', 'sunshield'],
        failureEffect: 'Thermal expansion causing optical misalignment.',
        cascadeFailures: ['primaryMirror', 'secondaryMirror'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Occulting Disk
    const diskGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const disk = new THREE.Mesh(diskGeo, darkSteel);
    disk.rotation.x = Math.PI / 2;
    disk.position.set(0, 0, 15);
    group.add(disk);
    meshes.disk = disk;
    parts.push({
        name: 'Occulting Disk',
        description: 'Blocks the direct light from the central star, allowing faint surrounding objects to be seen.',
        material: 'darkSteel',
        function: 'Starlight suppression.',
        assemblyOrder: 5,
        connections: ['tube'],
        failureEffect: 'Detector saturation from direct starlight, rendering the instrument useless.',
        cascadeFailures: ['detectorCamera'],
        originalPosition: { x: 0, y: 0, z: 15 },
        explodedPosition: { x: 0, y: 0, z: 25 }
    });

    // 3. Primary Mirror
    const mirrorGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
    const mirror = new THREE.Mesh(mirrorGeo, chrome);
    mirror.rotation.x = Math.PI / 2;
    mirror.position.set(0, 0, -4.5);
    group.add(mirror);
    meshes.primaryMirror = mirror;
    parts.push({
        name: 'Primary Mirror',
        description: 'Collects and focuses the light from the target star system.',
        material: 'chrome',
        function: 'Light collection and focusing.',
        assemblyOrder: 2,
        connections: ['tube', 'secondaryMirror'],
        failureEffect: 'Loss of light gathering capability.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -4.5 },
        explodedPosition: { x: 0, y: -5, z: -10 }
    });

    // 4. Secondary Mirror
    const secMirrorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const secMirror = new THREE.Mesh(secMirrorGeo, chrome);
    secMirror.rotation.x = Math.PI / 2;
    secMirror.position.set(0, 0, 4);
    group.add(secMirror);
    meshes.secondaryMirror = secMirror;
    parts.push({
        name: 'Secondary Mirror',
        description: 'Reflects the converging light from the primary mirror towards the detector.',
        material: 'chrome',
        function: 'Focal plane projection.',
        assemblyOrder: 3,
        connections: ['tube', 'primaryMirror'],
        failureEffect: 'Inability to focus light on the detector.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 5, z: 8 }
    });

    // 5. Detector Camera
    const cameraGeo = new THREE.BoxGeometry(2, 2, 2);
    const camera = new THREE.Mesh(cameraGeo, steel);
    camera.position.set(0, 0, -6);
    
    const sensorGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const sensor = new THREE.Mesh(sensorGeo, sensorGlow);
    sensor.position.set(0, 0, 1.01);
    camera.add(sensor);
    
    group.add(camera);
    meshes.detectorCamera = camera;
    parts.push({
        name: 'Detector Camera',
        description: 'High-sensitivity imaging sensor designed to capture faint light from exoplanets and stellar coronas.',
        material: 'steel, sensorGlow',
        function: 'Image acquisition.',
        assemblyOrder: 4,
        connections: ['tube'],
        failureEffect: 'No data collection.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -6 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // 6. Solar Panels
    const panelsGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(10, 0.1, 3);
    const panel1 = new THREE.Mesh(panelGeo, solarPanelMat);
    panel1.position.set(6, 0, -2);
    panelsGroup.add(panel1);
    
    const panel2 = new THREE.Mesh(panelGeo, solarPanelMat);
    panel2.position.set(-6, 0, -2);
    panelsGroup.add(panel2);
    group.add(panelsGroup);
    meshes.solarPanels = panelsGroup;
    
    parts.push({
        name: 'Solar Arrays',
        description: 'Provides power to the spacecraft and instruments.',
        material: 'solarPanelMat',
        function: 'Power generation.',
        assemblyOrder: 6,
        connections: ['tube'],
        failureEffect: 'Loss of power, system shutdown.',
        cascadeFailures: ['detectorCamera', 'tube'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 } 
    });

    // Simulated Target: Star & Corona
    const starSpace = new THREE.Group();
    starSpace.position.set(0, 0, 45); // Far away
    
    const centralStarGeo = new THREE.SphereGeometry(3, 32, 32);
    const centralStar = new THREE.Mesh(centralStarGeo, starMaterial);
    starSpace.add(centralStar);
    
    const coronaShapeGeo = new THREE.SphereGeometry(6, 32, 32);
    const corona = new THREE.Mesh(coronaShapeGeo, coronaMaterial);
    starSpace.add(corona);
    
    group.add(starSpace);
    meshes.starSpace = starSpace;

    const description = "A space-based coronagraph designed to directly image exoplanets and stellar coronas by blocking the overwhelming light of the host star.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Occulting Disk in a coronagraph?",
            options: [
                "To collect more light from the star.",
                "To block the direct light from the central star.",
                "To generate power for the telescope.",
                "To focus the light onto the detector."
            ],
            correct: 1,
            explanation: "The occulting disk acts like an artificial eclipse, blocking the bright central star so that faint objects nearby (like exoplanets or the corona) can be seen.",
            difficulty: "easy"
        },
        {
            question: "Why is a coronagraph deployed in space rather than on the ground?",
            options: [
                "To be closer to the target stars.",
                "To avoid the scattering of light caused by Earth's atmosphere.",
                "Because it is cheaper to build in space.",
                "To reduce the effect of Earth's magnetic field."
            ],
            correct: 1,
            explanation: "Earth's atmosphere scatters starlight, creating a 'halo' that masks faint companions. Space telescopes avoid this atmospheric scattering entirely.",
            difficulty: "medium"
        },
        {
            question: "If the Occulting Disk fails or is misaligned, what is the immediate cascade failure?",
            options: [
                "The primary mirror shatters.",
                "The solar panels lose power.",
                "The detector camera becomes saturated or damaged.",
                "The telescope tube bends."
            ],
            correct: 2,
            explanation: "Without the occulting disk blocking the intense starlight, the high-sensitivity detector camera will be flooded with light, causing saturation or permanent damage.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, externalMeshes) {
        // Rotate the entire observatory slowly
        group.rotation.y = time * 0.05 * speed;
        group.rotation.z = Math.sin(time * 0.02 * speed) * 0.05;

        // Pulsate the central star
        const starScale = 1 + Math.sin(time * speed * 3) * 0.02;
        meshes.starSpace.children[0].scale.set(starScale, starScale, starScale);
        
        // Rotate and pulsate corona
        meshes.starSpace.children[1].rotation.y = time * 0.8 * speed;
        meshes.starSpace.children[1].rotation.x = time * 0.4 * speed;
        const coronaScale = 1 + Math.cos(time * speed * 2) * 0.08;
        meshes.starSpace.children[1].scale.set(coronaScale, coronaScale, coronaScale);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCoronagraphMask() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
