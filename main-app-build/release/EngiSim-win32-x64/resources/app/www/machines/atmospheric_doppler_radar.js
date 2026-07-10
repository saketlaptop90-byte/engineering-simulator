import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const radomeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.8,
        transmission: 0.8, // glass-like
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        envMapIntensity: 1.0,
    });
    
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.5
    });

    const pedestalMaterial = darkSteel;
    const dishMaterial = aluminum;
    const antennaMaterial = chrome;

    // 1. Tower Base
    const towerGeometry = new THREE.CylinderGeometry(2, 2.5, 10, 16);
    const tower = new THREE.Mesh(towerGeometry, pedestalMaterial);
    tower.position.set(0, 5, 0);
    group.add(tower);
    parts.push({
        name: "Steel Lattice Tower",
        description: "Provides structural support and elevation to ensure an unobstructed field of view for the radar beam.",
        material: "Dark Steel",
        function: "Elevation and Support",
        assemblyOrder: 1,
        connections: ["Pedestal"],
        failureEffect: "Structural collapse or extreme vibrations affecting radar accuracy.",
        cascadeFailures: ["Pedestal", "Dish Antenna"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Pedestal / Rotary Joint
    const pedestalGeometry = new THREE.CylinderGeometry(1.5, 2, 2, 32);
    const pedestal = new THREE.Mesh(pedestalGeometry, steel);
    pedestal.position.set(0, 11, 0);
    group.add(pedestal);
    parts.push({
        name: "Rotary Pedestal",
        description: "Houses the azimuth drive motors and slip rings to allow continuous 360-degree rotation of the antenna.",
        material: "Steel",
        function: "Azimuth Rotation",
        assemblyOrder: 2,
        connections: ["Steel Lattice Tower", "Elevation Drive"],
        failureEffect: "Loss of scanning capability; radar gets stuck in one azimuth direction.",
        cascadeFailures: ["Dish Antenna", "Waveguide System"],
        originalPosition: {x: 0, y: 11, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 3. Elevation Drive
    const elevationGeometry = new THREE.BoxGeometry(2.5, 1.5, 2.5);
    const elevationDrive = new THREE.Mesh(elevationGeometry, copper);
    elevationDrive.position.set(0, 12.5, 0);
    group.add(elevationDrive);
    parts.push({
        name: "Elevation Drive",
        description: "Tilts the parabolic antenna to scan different vertical slices of the atmosphere (volume scans).",
        material: "Copper/Steel",
        function: "Elevation Control",
        assemblyOrder: 3,
        connections: ["Rotary Pedestal", "Dish Antenna"],
        failureEffect: "Inability to scan different altitudes, limiting weather profiling.",
        cascadeFailures: ["Dish Antenna"],
        originalPosition: {x: 0, y: 12.5, z: 0},
        explodedPosition: {x: -5, y: 15, z: 0}
    });

    // 4. Parabolic Dish Antenna
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 13.5, 0);
    
    // The dish itself
    const dishGeometry = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3);
    const dishMesh = new THREE.Mesh(dishGeometry, dishMaterial);
    dishMesh.rotation.x = Math.PI; // Face forward initially
    dishGroup.add(dishMesh);
    
    // Antenna Feed Horn
    const feedGeometry = new THREE.CylinderGeometry(0.1, 0.3, 2, 16);
    const feed = new THREE.Mesh(feedGeometry, neonBlue);
    feed.position.set(0, 1.5, 0);
    dishGroup.add(feed);

    group.add(dishGroup);
    parts.push({
        name: "Parabolic Dish Antenna",
        description: "Focuses the transmitted radio waves into a narrow beam and collects the weak backscattered signals from precipitation.",
        material: "Aluminum",
        function: "Signal Transmission and Reception",
        assemblyOrder: 4,
        connections: ["Elevation Drive", "Feed Horn"],
        failureEffect: "Severe loss of radar range, sensitivity, and spatial resolution.",
        cascadeFailures: ["Receiver"],
        originalPosition: {x: 0, y: 13.5, z: 0},
        explodedPosition: {x: 0, y: 22, z: 0}
    });

    // 5. Radome
    const radomeGeometry = new THREE.SphereGeometry(5, 32, 32);
    const radome = new THREE.Mesh(radomeGeometry, radomeMaterial);
    radome.position.set(0, 13.5, 0);
    group.add(radome);
    parts.push({
        name: "Fiberglass Radome",
        description: "A weatherproof enclosure that protects the delicate antenna components from wind, ice, and debris without interfering with RF signals.",
        material: "Fiberglass/Composite",
        function: "Environmental Protection",
        assemblyOrder: 5,
        connections: ["Tower Base"],
        failureEffect: "Exposes antenna to wind loads and weather, potentially causing mechanical failure of the drives.",
        cascadeFailures: ["Parabolic Dish Antenna", "Rotary Pedestal"],
        originalPosition: {x: 0, y: 13.5, z: 0},
        explodedPosition: {x: 10, y: 13.5, z: 0}
    });

    // 6. Waveguide & Transmitter Box
    const txGeometry = new THREE.BoxGeometry(2, 4, 2);
    const txBox = new THREE.Mesh(txGeometry, glowingRed);
    txBox.position.set(0, 7, -1.5);
    group.add(txBox);
    parts.push({
        name: "Klystron Transmitter & Waveguide",
        description: "Generates high-power radio frequency pulses and guides them to the antenna feed horn with minimal signal loss.",
        material: "Copper/Alloys",
        function: "RF Generation and Transport",
        assemblyOrder: 6,
        connections: ["Feed Horn", "Rotary Pedestal"],
        failureEffect: "No RF pulse transmitted; radar is completely blind.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 7, z: -1.5},
        explodedPosition: {x: 0, y: 7, z: -8}
    });

    const description = "The Atmospheric Doppler Radar (similar to NEXRAD WSR-88D) is a vital meteorological instrument. It detects precipitation, calculates its motion, and estimates its type. By analyzing the Doppler shift of backscattered radio waves, it can determine wind velocities and detect severe weather phenomena like tornadoes.";

    const quizQuestions = [
        {
            question: "What is the primary function of the fiberglass Radome?",
            options: [
                "To amplify the transmitted radio signals",
                "To protect the antenna from wind, ice, and weather without blocking RF signals",
                "To convert analog signals to digital weather maps",
                "To cool down the Klystron transmitter"
            ],
            correct: 1,
            explanation: "The radome is a structural, weatherproof enclosure that protects the radar antenna from the elements (reducing wind load) while being virtually transparent to radio waves.",
            difficulty: "Medium"
        },
        {
            question: "How does the radar determine the speed and direction of wind within a storm?",
            options: [
                "By measuring the temperature of the raindrops",
                "By analyzing the Doppler shift in the frequency of the returned signal",
                "By tracking the shadow cast by the clouds",
                "By changing the elevation angle of the antenna"
            ],
            correct: 1,
            explanation: "Doppler radar measures the phase shift (Doppler effect) between the transmitted and received pulses, which correlates directly to the radial velocity of the particles (wind).",
            difficulty: "Hard"
        },
        {
            question: "What component is responsible for generating the high-power RF pulses?",
            options: [
                "The Feed Horn",
                "The Rotary Pedestal",
                "The Klystron Transmitter",
                "The Radome"
            ],
            correct: 2,
            explanation: "The Klystron transmitter generates the extremely high-power microwave pulses (often over 700,000 watts) needed for long-range atmospheric scanning.",
            difficulty: "Medium"
        }
    ];

    let timeAcc = 0;
    const animate = (time, speed, meshes) => {
        timeAcc += speed * 0.01;
        
        if (group.children[3]) {
            // Rotate the entire dish assembly around Y (Azimuth)
            group.children[3].rotation.y = timeAcc;
            group.children[1].rotation.y = timeAcc; // Pedestal rotates too
            
            // Tilt the dish around X (Elevation Scan)
            const elevationTilt = Math.sin(timeAcc * 0.5) * 0.3 + 0.3; // 0 to 0.6 rad
            group.children[3].children[0].rotation.x = Math.PI - elevationTilt; 
        }

        // Pulse the transmitter box
        if(group.children[5]) {
            const txMat = group.children[5].material;
            txMat.emissiveIntensity = 1.0 + Math.sin(timeAcc * 10) * 0.8;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDopplerRadar() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
