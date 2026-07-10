import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });
    
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.2
    });

    const activeSignalMaterial = new THREE.MeshStandardMaterial({
        color: 0x55ff55,
        emissive: 0x55ff55,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6
    });

    // --- Array Base Platform ---
    const baseGeo = new THREE.CylinderGeometry(8, 8, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    
    parts.push({
        name: "Array Base Platform",
        description: "Heavy concrete and dark steel foundation supporting the primary telescope dishes and managing subterranean data trunklines.",
        material: "darkSteel",
        function: "Provides absolute stability against seismic noise, ensuring millimeter-level precision.",
        assemblyOrder: 1,
        connections: ["Central Hub", "Antenna Mounts"],
        failureEffect: "Misalignment of array, rendering interferometry calculations inaccurate.",
        cascadeFailures: ["Signal Correlator", "Azimuth Bearings"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // --- Central Hub / Cryogenic Receiver ---
    const hubGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
    const hubMesh = new THREE.Mesh(hubGeo, chrome);
    hubMesh.position.set(0, 1, 0);
    group.add(hubMesh);
    meshes.hub = hubMesh;

    parts.push({
        name: "Cryogenic Receiver Hub",
        description: "Supercooled central node that captures and digitizes faint radio frequency (RF) signals from the cosmos.",
        material: "chrome",
        function: "Cools the low-noise amplifiers (LNAs) to near absolute zero to minimize thermal noise.",
        assemblyOrder: 2,
        connections: ["Array Base Platform", "Waveguides"],
        failureEffect: "Thermal noise overwhelms cosmic signals, dropping signal-to-noise ratio to zero.",
        cascadeFailures: ["Data Processor"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // --- Parabolic Dishes (Array of 3) ---
    const dishCenters = [
        { x: 0, z: -4 },
        { x: -3.46, z: 2 },
        { x: 3.46, z: 2 }
    ];

    meshes.mounts = [];
    meshes.yokes = [];
    meshes.dishes = [];
    meshes.subreflectors = [];
    meshes.signals = [];

    dishCenters.forEach((pos, i) => {
        // Mount
        const mountGeo = new THREE.CylinderGeometry(0.5, 0.8, 2, 16);
        const mountMesh = new THREE.Mesh(mountGeo, steel);
        mountMesh.position.set(pos.x, 1, pos.z);
        group.add(mountMesh);
        meshes.mounts.push(mountMesh);

        // Yoke (Azimuth/Elevation mount)
        const yokeGroup = new THREE.Group();
        yokeGroup.position.set(pos.x, 2, pos.z);
        
        const yokeGeo = new THREE.BoxGeometry(1.2, 0.5, 0.5);
        const yokeMesh = new THREE.Mesh(yokeGeo, aluminum);
        yokeGroup.add(yokeMesh);
        
        // Dish
        const dishGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3);
        const dishMesh = new THREE.Mesh(dishGeo, neonCyan);
        dishMesh.material.side = THREE.DoubleSide;
        dishMesh.rotation.x = Math.PI; // Face up initially
        dishMesh.position.set(0, 0.5, 0);
        yokeGroup.add(dishMesh);

        // Subreflector support legs
        const legMat = steel;
        for(let j=0; j<4; j++) {
            const angle = (j * Math.PI / 2);
            const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(Math.cos(angle)*1.2, 1.2, Math.sin(angle)*1.2);
            leg.lookAt(0, 2, 0);
            leg.rotation.x -= Math.PI/2;
            dishMesh.add(leg);
        }

        // Subreflector
        const subGeo = new THREE.CylinderGeometry(0.3, 0, 0.2, 16);
        const subMesh = new THREE.Mesh(subGeo, neonMagenta);
        subMesh.position.set(0, -1.8, 0); // Relative to inverted dish
        subMesh.rotation.x = Math.PI;
        dishMesh.add(subMesh);

        // Signal Beam (Invisible initially, pulses during animation)
        const signalGeo = new THREE.CylinderGeometry(0.1, 2, 5, 16);
        const signalMesh = new THREE.Mesh(signalGeo, activeSignalMaterial);
        signalMesh.position.set(0, 2.5, 0);
        dishMesh.add(signalMesh);
        
        group.add(yokeGroup);
        meshes.yokes.push(yokeGroup);
        meshes.dishes.push(dishMesh);
        meshes.subreflectors.push(subMesh);
        meshes.signals.push(signalMesh);
    });

    parts.push({
        name: "Primary Parabolic Reflectors",
        description: "Three highly polished, geometrically perfect parabolic dishes that collect radio waves and focus them onto the subreflectors.",
        material: "neonCyan",
        function: "Acts as a massive 'light bucket' for low-frequency electromagnetic radiation.",
        assemblyOrder: 3,
        connections: ["Azimuth-Elevation Yokes", "Subreflectors"],
        failureEffect: "Scattering of incoming waves, severe loss of sensitivity.",
        cascadeFailures: ["Signal Correlator"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    parts.push({
        name: "Subreflectors",
        description: "Secondary hyperbolic mirrors situated at the focal point of the primary dish.",
        material: "neonMagenta",
        function: "Redirects focused radio waves down into the feed horn and cryogenic receiver.",
        assemblyOrder: 4,
        connections: ["Primary Parabolic Reflectors", "Feed Horn"],
        failureEffect: "Signals are lost to space instead of entering the receiver.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // --- Data Correlator Lines ---
    const linesMat = new THREE.LineBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.8 });
    const linesGroup = new THREE.Group();
    dishCenters.forEach(pos => {
        const points = [];
        points.push(new THREE.Vector3(pos.x, 0, pos.z));
        points.push(new THREE.Vector3(0, 0, 0));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, linesMat);
        linesGroup.add(line);
    });
    linesGroup.position.y = 0.5;
    group.add(linesGroup);
    meshes.dataLines = linesGroup;

    parts.push({
        name: "Fiber Optic Correlator Network",
        description: "Underground, ultra-low latency fiber optic cables connecting each telescope to the central hub.",
        material: "neonBlue",
        function: "Transmits digitized signals to the central supercomputer for interferometric synthesis.",
        assemblyOrder: 5,
        connections: ["Cryogenic Receiver Hub", "Antenna Mounts"],
        failureEffect: "Data from individual antennas cannot be combined; interferometry fails completely.",
        cascadeFailures: ["Image Synthesis Engine"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    const description = "The Astrophysics Radio Telescope Array is an advanced interferometric observatory designed to map the universe at radio wavelengths. By combining signals from multiple parabolic dishes scattered across a wide area, it achieves the angular resolution of a single, massive telescope kilometers in diameter. It specializes in observing cold cosmic dust, pulsars, quasars, and the cosmic microwave background.";

    const quizQuestions = [
        {
            question: "What is the primary function of the cryogenic cooling system in a radio telescope's receiver?",
            options: [
                "To prevent the metal parts from melting due to solar radiation",
                "To reduce thermal noise in the amplifiers, allowing detection of extremely faint cosmic signals",
                "To contract the metal and keep the focal length exact",
                "To create a superconducting magnetic field for tracking"
            ],
            correct: 1,
            explanation: "In radio astronomy, cosmic signals are incredibly weak. Heat in the electronic components generates 'thermal noise' that can easily drown out these signals. Cooling the Low-Noise Amplifiers (LNAs) to near absolute zero drastically reduces this noise.",
            difficulty: "Medium"
        },
        {
            question: "How does a radio telescope array (interferometer) achieve higher resolution than a single dish?",
            options: [
                "By overlapping the dishes physically to create a larger surface",
                "By observing at much higher frequencies than a single dish can",
                "By combining the signals from separated antennas, mimicking a telescope the size of the distance between them",
                "By using powerful lasers to link the antennas together"
            ],
            correct: 2,
            explanation: "Interferometry combines signals from multiple telescopes. The maximum distance between the antennas (the baseline) determines the resolution, effectively creating a 'virtual' telescope as large as that baseline.",
            difficulty: "Hard"
        },
        {
            question: "Why are the primary reflector dishes often made of metal mesh rather than solid metal?",
            options: [
                "To make them lighter and less susceptible to wind resistance",
                "Because radio waves pass right through solid metal",
                "To allow rainwater to pass through easily",
                "Metal mesh is significantly cheaper than solid metal"
            ],
            correct: 0,
            explanation: "As long as the holes in the mesh are significantly smaller than the wavelength of the radio waves being observed, the mesh acts exactly like a solid mirror. A mesh design vastly reduces weight and wind load, which is critical for large, movable structures.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the subreflector in a Cassegrain antenna design?",
            options: [
                "To act as a backup if the primary dish fails",
                "To focus the incoming radio waves down into the receiver located behind the primary dish",
                "To transmit signals out to satellites",
                "To measure local weather conditions"
            ],
            correct: 1,
            explanation: "In a Cassegrain design, the large primary dish reflects signals up to the secondary subreflector, which then focuses them back down through a hole in the center of the primary dish into the receiver.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly rotate the entire array hub
        if(meshes.hub) {
            meshes.hub.rotation.y = time * 0.1 * speed;
        }

        // Track a celestial object (sweeping motion)
        const targetElevation = Math.PI / 4 + Math.sin(time * 0.2 * speed) * 0.2; 
        const targetAzimuth = Math.sin(time * 0.1 * speed) * Math.PI / 2;

        meshes.yokes.forEach((yoke, i) => {
            // Add slight phase offsets to make them look like they are tracking together
            yoke.rotation.y = targetAzimuth;
            meshes.dishes[i].rotation.x = -targetElevation;
        });

        // Pulse the data lines and subreflectors to simulate signal processing
        const pulse = (Math.sin(time * 5 * speed) + 1) / 2; // 0 to 1
        
        meshes.subreflectors.forEach(sub => {
            sub.material.emissiveIntensity = 0.2 + pulse * 0.8;
        });

        if(meshes.dataLines) {
            meshes.dataLines.children.forEach(line => {
                line.material.opacity = 0.4 + pulse * 0.6;
            });
        }

        // Pulse incoming signal beams
        meshes.signals.forEach((sig, i) => {
            // Stagger the signal pulses
            const sigPulse = (Math.sin(time * 3 * speed + i) + 1) / 2;
            sig.scale.y = 1 + sigPulse * 2;
            sig.material.opacity = sigPulse * 0.5;
            sig.position.y = 2.5 + (sig.scale.y - 1) * 2.5; // keep base at dish
        });
        
        // Emissive color shifting on primary dish
        meshes.dishes.forEach(dish => {
            const r = 0.0;
            const g = 0.5 + Math.sin(time * speed) * 0.5;
            const b = 1.0;
            dish.material.color.setRGB(r, g, b);
            dish.material.emissive.setRGB(r * 0.5, g * 0.5, b * 0.5);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRadioTelescope() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
