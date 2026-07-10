import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for visual flair
    const mirrorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        metalness: 1.0,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
        envMapIntensity: 2.0
    });
    
    const cherenkovGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const electronicsMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.5,
        emissive: 0x001133
    });

    // 1. Base / Mount
    const baseGeo = new THREE.CylinderGeometry(6, 7, 2, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    
    parts.push({
        name: "Azimuth Drive Base",
        description: "Heavy steel foundation allowing the telescope to track objects horizontally across the sky.",
        material: "Dark Steel",
        function: "Supports structure and provides 360-degree rotation.",
        assemblyOrder: 1,
        connections: ["Elevation Forks"],
        failureEffect: "Telescope cannot track objects.",
        cascadeFailures: ["Camera Focus", "Observation Schedule"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Elevation Forks
    const forkGeo = new THREE.BoxGeometry(2, 14, 3);
    const forkLeft = new THREE.Mesh(forkGeo, steel);
    forkLeft.position.set(-6, 8, 0);
    const forkRight = new THREE.Mesh(forkGeo, steel);
    forkRight.position.set(6, 8, 0);
    
    const forkGroup = new THREE.Group();
    forkGroup.add(forkLeft);
    forkGroup.add(forkRight);
    group.add(forkGroup);

    parts.push({
        name: "Elevation Forks",
        description: "Twin steel arms that hold the mirror dish and allow vertical tilt (altitude adjustment).",
        material: "Steel",
        function: "Vertical pointing and dish support.",
        assemblyOrder: 2,
        connections: ["Base", "Dish Frame"],
        failureEffect: "Cannot adjust altitude; observation restricted.",
        cascadeFailures: ["Drive Motors"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 15 }
    });

    // Dish Group (tilts inside forks)
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 13, 0);
    group.add(dishGroup);

    // 3. Dish Backing Frame
    const dishFrameGeo = new THREE.SphereGeometry(8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishFrameMesh = new THREE.Mesh(dishFrameGeo, steel);
    dishFrameMesh.rotation.x = Math.PI; // Face up initially
    dishGroup.add(dishFrameMesh);

    parts.push({
        name: "Dish Backing Structure",
        description: "Space-frame structure that maintains the precise parabolic shape of the mirror segments.",
        material: "Steel",
        function: "Structural rigidity for mirrors.",
        assemblyOrder: 3,
        connections: ["Elevation Forks", "Mirror Segments", "Camera Masts"],
        failureEffect: "Mirror misalignment.",
        cascadeFailures: ["Optical Aberration"],
        originalPosition: { x: 0, y: 13, z: 0 },
        explodedPosition: { x: 0, y: 13, z: -15 }
    });

    // 4. Mirror Segments
    const mirrorGeo = new THREE.SphereGeometry(7.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 3);
    const mirrorMesh = new THREE.Mesh(mirrorGeo, mirrorMaterial);
    mirrorMesh.rotation.x = Math.PI;
    dishGroup.add(mirrorMesh);

    parts.push({
        name: "Segmented Mirrors",
        description: "Hundreds of hexagonal mirror tiles working together to collect faint Cherenkov flashes.",
        material: "Highly Reflective Glass/Aluminum",
        function: "Focuses light onto the high-speed camera.",
        assemblyOrder: 4,
        connections: ["Dish Backing Structure"],
        failureEffect: "Signal loss or optical blurring.",
        cascadeFailures: ["Data Quality Drop"],
        originalPosition: { x: 0, y: 13, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 5. Camera Support Masts
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 16);
    const masts = new THREE.Group();
    const positions = [
        { x: -5, z: 5, rx: -Math.PI/8, rz: Math.PI/8 },
        { x: 5, z: 5, rx: -Math.PI/8, rz: -Math.PI/8 },
        { x: -5, z: -5, rx: Math.PI/8, rz: Math.PI/8 },
        { x: 5, z: -5, rx: Math.PI/8, rz: -Math.PI/8 }
    ];
    
    positions.forEach(pos => {
        const mast = new THREE.Mesh(mastGeo, aluminum);
        mast.position.set(pos.x, 8, pos.z);
        mast.rotation.set(pos.rx, 0, pos.rz);
        masts.add(mast);
    });
    dishGroup.add(masts);

    parts.push({
        name: "Camera Support Masts",
        description: "Carbon fiber or aluminum struts holding the PMT camera at the focal point without obscuring too much light.",
        material: "Aluminum",
        function: "Maintains exact focal distance for the camera.",
        assemblyOrder: 5,
        connections: ["Dish Frame", "PMT Camera Unit"],
        failureEffect: "Camera becomes misaligned.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 21, z: 0 },
        explodedPosition: { x: -15, y: 21, z: 15 }
    });

    // 6. PMT Camera Unit
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 15, 0); // Focal point
    dishGroup.add(cameraGroup);

    const cameraBoxGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
    const cameraMesh = new THREE.Mesh(cameraBoxGeo, electronicsMaterial);
    cameraGroup.add(cameraMesh);
    
    // Sensor face
    const sensorGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32);
    const sensorMesh = new THREE.Mesh(sensorGeo, cherenkovGlowMaterial);
    sensorMesh.position.set(0, -0.75, 0);
    cameraGroup.add(sensorMesh);

    parts.push({
        name: "PMT Camera & DAQ",
        description: "Ultra-fast photomultiplier tube camera array capable of recording billionths-of-a-second flashes.",
        material: "Electronics/Silicon/Glass",
        function: "Converts individual photons into electrical signals.",
        assemblyOrder: 6,
        connections: ["Support Masts", "Data Cables"],
        failureEffect: "No data recorded.",
        cascadeFailures: ["Trigger System Failure"],
        originalPosition: { x: 0, y: 28, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    const description = "The Cherenkov Telescope Array detects very-high-energy gamma rays by capturing the ultra-brief, faint blue 'Cherenkov radiation' flashes produced when gamma rays strike the Earth's atmosphere, effectively turning the atmosphere itself into a giant detector.";
    
    const quizQuestions = [
        {
            question: "What does a Cherenkov Telescope primarily detect?",
            options: ["Direct Gamma Rays from space", "Microwave Background Radiation", "Cherenkov Radiation in the atmosphere", "X-Ray emissions from black holes"],
            correct: 2,
            explanation: "Gamma rays don't reach the ground; they interact with the atmosphere, creating particle showers that emit a blue flash of Cherenkov radiation, which the telescope detects.",
            difficulty: "Medium"
        },
        {
            question: "Why does the camera use Photomultiplier Tubes (PMTs)?",
            options: ["They are cheaper than CCDs", "They can detect single photons with nanosecond precision", "They are lighter weight", "They have a higher megapixel count"],
            correct: 1,
            explanation: "Cherenkov flashes last only a few nanoseconds and are incredibly faint, requiring sensors that are extraordinarily fast and sensitive to individual photons.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the extremely large segmented mirror?",
            options: ["To block out moonlight", "To act as a radio antenna", "To collect and focus the faint flashes of light", "To track satellites"],
            correct: 2,
            explanation: "The flashes of Cherenkov radiation are extremely dim. A large light-collecting area (the huge mirror) is essential to gather enough photons to trigger the camera.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Slow sky tracking movement
        group.rotation.y = time * speed * 0.05;
        dishGroup.rotation.x = Math.sin(time * speed * 0.1) * 0.2 - Math.PI / 6; // Angled to observe the sky

        // Flash the sensor material to simulate Cherenkov showers
        // Extremely brief, bright flashes
        if (Math.random() > 0.96) {
            sensorMesh.material.opacity = 0.8 + Math.random() * 0.2;
            sensorMesh.material.color.setHex(0x00bfff); // Bright blue
        } else {
            // Rapid fade
            sensorMesh.material.opacity = Math.max(0.1, sensorMesh.material.opacity - 0.2);
            sensorMesh.material.color.setHex(0x001133); // Dim state
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCherenkovTelescope() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
