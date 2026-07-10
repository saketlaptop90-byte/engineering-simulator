import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.5
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    const translucentLatex = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.8,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.4,
        thickness: 0.5
    });

    const styrofoam = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.9,
        metalness: 0.0,
        bumpScale: 0.05
    });

    // 1. Balloon Envelope
    const balloonGeo = new THREE.SphereGeometry( 4, 64, 64 );
    // Deform to teardrop shape
    const pos = balloonGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i);
        if (y < 0) {
            let scale = 1 + (y * 0.1);
            pos.setX(i, pos.getX(i) * scale);
            pos.setZ(i, pos.getZ(i) * scale);
        }
    }
    balloonGeo.computeVertexNormals();
    
    const balloonMesh = new THREE.Mesh(balloonGeo, translucentLatex);
    balloonMesh.position.set(0, 15, 0);
    group.add(balloonMesh);
    parts.push({
        name: "High-Altitude Latex Balloon",
        description: "Expands as it rises due to decreasing atmospheric pressure, eventually bursting at high altitudes.",
        material: "translucentLatex",
        function: "Provides lift for the entire payload via lighter-than-air gas (Helium or Hydrogen).",
        assemblyOrder: 10,
        connections: ["Tether", "Parachute"],
        failureEffect: "Premature burst leads to immediate payload descent and mission failure.",
        cascadeFailures: ["Parachute deployment may fail if burst is violent."],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 },
        mesh: balloonMesh
    });

    // 2. Neon Lift Gas Core (Sci-fi visualization)
    const gasCoreGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const gasCoreMesh = new THREE.Mesh(gasCoreGeo, neonBlue);
    gasCoreMesh.position.set(0, 15, 0);
    group.add(gasCoreMesh);
    parts.push({
        name: "Lifting Gas Visualization",
        description: "Visual representation of the Helium/Hydrogen lifting gas.",
        material: "neonBlue",
        function: "Generates upward buoyant force.",
        assemblyOrder: 11,
        connections: ["High-Altitude Latex Balloon"],
        failureEffect: "Loss of lift.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 },
        mesh: gasCoreMesh
    });

    // 3. Parachute
    const chuteGeo = new THREE.ConeGeometry( 1.5, 1, 16 );
    const chuteMesh = new THREE.Mesh(chuteGeo, plastic);
    chuteMesh.position.set(0, 8, 0);
    group.add(chuteMesh);
    parts.push({
        name: "Descent Parachute",
        description: "A small parachute folded on the ascent, deploys upon balloon burst.",
        material: "plastic",
        function: "Slows the descent of the payload to prevent damage to people/property on the ground.",
        assemblyOrder: 9,
        connections: ["High-Altitude Latex Balloon", "Tether"],
        failureEffect: "Payload crashes at terminal velocity.",
        cascadeFailures: ["Complete destruction of radiosonde."],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 18, z: 0 },
        mesh: chuteMesh
    });

    // 4. Tether / Line
    const tetherGeo = new THREE.CylinderGeometry(0.02, 0.02, 14, 8);
    const tetherMesh = new THREE.Mesh(tetherGeo, darkSteel);
    tetherMesh.position.set(0, 8, 0);
    group.add(tetherMesh);
    parts.push({
        name: "Nylon Tether",
        description: "Strong, lightweight line connecting the balloon/parachute to the radiosonde.",
        material: "darkSteel",
        function: "Maintains distance between payload and balloon to prevent wake interference with sensors.",
        assemblyOrder: 8,
        connections: ["Descent Parachute", "Radiosonde Housing"],
        failureEffect: "Payload detaches and falls prematurely.",
        cascadeFailures: ["Loss of payload", "Mission failure"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 2, y: 13, z: 0 },
        mesh: tetherMesh
    });

    // 5. Radiosonde Housing
    const housingGeo = new THREE.BoxGeometry( 1.5, 2, 1 );
    const housingMesh = new THREE.Mesh(housingGeo, styrofoam);
    housingMesh.position.set(0, 1, 0);
    group.add(housingMesh);
    parts.push({
        name: "Radiosonde Housing",
        description: "Insulated, lightweight EPS foam enclosure.",
        material: "styrofoam",
        function: "Protects delicate electronics from extreme cold (-60°C) and moisture.",
        assemblyOrder: 1,
        connections: ["Nylon Tether", "Data Processing Unit", "Sensor Boom"],
        failureEffect: "Electronics exposed to elements.",
        cascadeFailures: ["Battery freezing", "Sensor malfunctions"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: -4, y: 1, z: 0 },
        mesh: housingMesh
    });

    // 6. Data Processing Unit & Battery
    const cpuGeo = new THREE.BoxGeometry( 0.8, 1, 0.5 );
    const cpuMesh = new THREE.Mesh(cpuGeo, chrome);
    cpuMesh.position.set(0, 1, 0);
    group.add(cpuMesh);
    parts.push({
        name: "Flight Computer & Telemetry Unit",
        description: "Microcontroller, GPS receiver, and radio transmitter with water-activated battery.",
        material: "chrome",
        function: "Processes sensor data, calculates GPS wind speeds, and transmits telemetry to ground stations.",
        assemblyOrder: 2,
        connections: ["Radiosonde Housing", "Transmission Antenna", "Sensor Boom"],
        failureEffect: "Loss of all data transmission.",
        cascadeFailures: ["Ground station loses track of balloon."],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 4 },
        mesh: cpuMesh
    });

    // 7. CPU glowing core
    const cpuCoreGeo = new THREE.BoxGeometry( 0.6, 0.8, 0.6 );
    const cpuCoreMesh = new THREE.Mesh(cpuCoreGeo, neonPink);
    cpuCoreMesh.position.set(0, 1, 0);
    group.add(cpuCoreMesh);
    parts.push({
        name: "Quantum Processing Matrix",
        description: "High-tech data processor visualization.",
        material: "neonPink",
        function: "Handles millions of meteorological calculations per second.",
        assemblyOrder: 3,
        connections: ["Flight Computer & Telemetry Unit"],
        failureEffect: "Data corruption.",
        cascadeFailures: ["Inaccurate weather forecasting."],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 6 },
        mesh: cpuCoreMesh
    });

    // 8. Sensor Boom
    const boomGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const boomMesh = new THREE.Mesh(boomGeo, aluminum);
    boomMesh.position.set(1.5, 1.5, 0);
    boomMesh.rotation.z = Math.PI / 2;
    group.add(boomMesh);
    parts.push({
        name: "Sensor Boom",
        description: "Arm extending away from the housing to minimize thermal contamination.",
        material: "aluminum",
        function: "Holds thermodynamic sensors in free-flowing air.",
        assemblyOrder: 4,
        connections: ["Radiosonde Housing", "Thermistor", "Hygrometer"],
        failureEffect: "Sensors read housing temperature instead of ambient.",
        cascadeFailures: ["Invalid atmospheric profile data."],
        originalPosition: { x: 1.5, y: 1.5, z: 0 },
        explodedPosition: { x: 4, y: 1.5, z: 0 },
        mesh: boomMesh
    });

    // 9. Thermistor (Temperature)
    const thermistorGeo = new THREE.SphereGeometry( 0.15, 16, 16 );
    const thermistorMesh = new THREE.Mesh(thermistorGeo, glowingGreen);
    thermistorMesh.position.set(2.5, 1.5, 0);
    group.add(thermistorMesh);
    parts.push({
        name: "Capacitive Thermistor",
        description: "Highly sensitive temperature sensor with fast response time.",
        material: "glowingGreen",
        function: "Measures ambient atmospheric temperature.",
        assemblyOrder: 5,
        connections: ["Sensor Boom"],
        failureEffect: "Temperature data loss.",
        cascadeFailures: ["Inability to calculate atmospheric density."],
        originalPosition: { x: 2.5, y: 1.5, z: 0 },
        explodedPosition: { x: 6, y: 1.5, z: 0 },
        mesh: thermistorMesh
    });

    // 10. Hygrometer (Humidity)
    const hygroGeo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const hygroMesh = new THREE.Mesh(hygroGeo, copper);
    hygroMesh.position.set(2.0, 1.6, 0);
    group.add(hygroMesh);
    parts.push({
        name: "Thin-Film Capacitor Hygrometer",
        description: "Measures relative humidity.",
        material: "copper",
        function: "Detects atmospheric moisture layers (clouds, dry air).",
        assemblyOrder: 6,
        connections: ["Sensor Boom"],
        failureEffect: "Humidity data loss.",
        cascadeFailures: ["Cloud layer identification fails."],
        originalPosition: { x: 2.0, y: 1.6, z: 0 },
        explodedPosition: { x: 5, y: 2.5, z: 0 },
        mesh: hygroMesh
    });

    // 11. Transmission Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
    const antennaMesh = new THREE.Mesh(antennaGeo, copper);
    antennaMesh.position.set(0, -1, 0);
    group.add(antennaMesh);
    parts.push({
        name: "UHF Transmission Antenna",
        description: "Quarter-wave monopole wire antenna.",
        material: "copper",
        function: "Transmits telemetry data down to the tracking station at ~400 MHz.",
        assemblyOrder: 7,
        connections: ["Flight Computer & Telemetry Unit"],
        failureEffect: "Telemetry cannot reach ground.",
        cascadeFailures: ["Mission failure"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: antennaMesh
    });

    // 12. Radio Waves (Animation elements)
    const waves = [];
    for(let i=0; i<3; i++) {
        const waveGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 64);
        const waveMesh = new THREE.Mesh(waveGeo, neonBlue);
        waveMesh.position.set(0, -2.5, 0);
        waveMesh.rotation.x = Math.PI / 2;
        group.add(waveMesh);
        waves.push(waveMesh);
        parts.push({
            name: `Radio Wave ${i+1}`,
            description: "Visual representation of UHF telemetry signals.",
            material: "neonBlue",
            function: "Data broadcast.",
            assemblyOrder: 12 + i,
            connections: ["UHF Transmission Antenna"],
            failureEffect: "N/A",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -2.5, z: 0 },
            explodedPosition: { x: 0, y: -6 - i, z: 0 },
            mesh: waveMesh,
            isWave: true,
            waveIndex: i
        });
    }

    const description = "The Atmospheric Weather Balloon (Radiosonde) is an expendable meteorological telemetry instrument carried into the atmosphere. It measures atmospheric parameters like temperature, humidity, pressure, wind speed, and wind direction, transmitting the data back to a ground receiving station. Essential for global weather forecasting and atmospheric research.";

    const quizQuestions = [
        {
            question: "Why is the sensor boom extended away from the main radiosonde housing?",
            options: [
                "To act as an antenna for transmission",
                "To balance the payload during high winds",
                "To prevent thermal contamination from the housing's retained heat",
                "To ensure the balloon doesn't hit it upon bursting"
            ],
            correct: 2,
            explanation: "The housing can retain heat from the ground or electronics. Extending the sensors into the free-flowing air prevents this heat from corrupting the delicate temperature readings.",
            difficulty: "Medium"
        },
        {
            question: "What causes the high-altitude latex balloon to eventually burst?",
            options: [
                "UV degradation from the sun",
                "Decreasing external atmospheric pressure causing the gas inside to expand",
                "Extreme cold making the latex brittle",
                "A built-in self-destruct timer"
            ],
            correct: 1,
            explanation: "As the balloon rises, the surrounding atmospheric pressure drops. The gas inside expands until the latex reaches its elastic limit and bursts, typically between 20km and 30km altitude.",
            difficulty: "Easy"
        },
        {
            question: "How does the radiosonde calculate wind speed and direction?",
            options: [
                "Using a miniature anemometer on the boom",
                "By tracking the GPS coordinates over time as it drifts",
                "Using Doppler radar from the ground station",
                "By measuring the angle of the tether"
            ],
            correct: 1,
            explanation: "Modern radiosondes use an onboard GPS receiver. By tracking its precise location changes as it floats with the air masses, it calculates the wind speed and direction.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the parachute on a radiosonde?",
            options: [
                "To slow descent and prevent injury or damage when falling back to Earth",
                "To stabilize the payload during the ascent",
                "To catch wind currents for better wind speed measurement",
                "To trap air for barometric pressure readings"
            ],
            correct: 0,
            explanation: "After the balloon bursts, the payload falls. The parachute deploys to slow the descent, ensuring the heavy radiosonde box does not cause damage or injury upon landing.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Balloon pulsate slightly
        const balloon = meshes.find(p => p.name === "High-Altitude Latex Balloon");
        if (balloon) {
            const scale = 1 + Math.sin(time * speed * 2) * 0.02;
            balloon.mesh.scale.set(scale, scale, scale);
        }
        
        // Gas core pulsate faster
        const core = meshes.find(p => p.name === "Lifting Gas Visualization");
        if (core) {
            core.mesh.rotation.y += speed * 0.05;
            core.mesh.rotation.x += speed * 0.03;
            const coreScale = 1 + Math.sin(time * speed * 5) * 0.05;
            core.mesh.scale.set(coreScale, coreScale, coreScale);
        }

        // CPU Core floating and spinning
        const cpuCore = meshes.find(p => p.name === "Quantum Processing Matrix");
        if (cpuCore) {
            cpuCore.mesh.rotation.x += speed * 0.1;
            cpuCore.mesh.rotation.y += speed * 0.2;
        }

        // Thermistor glowing pulse
        const thermistor = meshes.find(p => p.name === "Capacitive Thermistor");
        if (thermistor) {
            const intensity = 0.5 + Math.abs(Math.sin(time * speed * 4)) * 0.5;
            thermistor.mesh.material.emissiveIntensity = intensity;
        }

        // Sway the payload slightly relative to balloon
        const housingParts = ["Radiosonde Housing", "Flight Computer & Telemetry Unit", "Quantum Processing Matrix", "Sensor Boom", "Capacitive Thermistor", "Thin-Film Capacitor Hygrometer", "UHF Transmission Antenna"];
        const swayAngle = Math.sin(time * speed) * 0.05;
        
        meshes.forEach(part => {
            if (housingParts.includes(part.name)) {
                // Apply a slight rotational sway around the tether point
                part.mesh.rotation.z = swayAngle;
                part.mesh.position.x = part.originalPosition.x + Math.sin(time * speed) * 0.2;
            }
            if (part.name === "Nylon Tether") {
                part.mesh.rotation.z = swayAngle / 2;
            }

            // Radio waves expanding
            if (part.isWave) {
                const waveTime = (time * speed * 2 + part.waveIndex * 2) % 6;
                const waveScale = 1 + waveTime * 2;
                part.mesh.scale.set(waveScale, waveScale, waveScale);
                part.mesh.material.opacity = Math.max(0, 1 - (waveTime / 6));
                part.mesh.position.y = part.originalPosition.y - waveTime * 0.5;
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createWeatherBalloon() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
