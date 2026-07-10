import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const laserGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const indicatorBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5
    });

    const indicatorRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5
    });

    const sensorCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xaa5500,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.2
    });

    // 1. Base Structure / Housing
    const housingGeometry = new THREE.CylinderGeometry(2, 2, 5, 32);
    const housingMesh = new THREE.Mesh(housingGeometry, darkSteel);
    housingMesh.position.set(0, 0, 0);
    group.add(housingMesh);
    parts.push({
        name: "Main Chassis",
        description: "Heavy-duty radiation-shielded housing for the altimeter components.",
        material: "Dark Steel",
        function: "Protects delicate instruments from the harsh environment of space and regulates internal temperature.",
        assemblyOrder: 1,
        connections: ["Power Core", "Laser Transmitter", "Receiver Telescope"],
        failureEffect: "Thermal instability and radiation damage to sensitive electronics.",
        cascadeFailures: ["Complete system failure due to environmental exposure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: housingMesh
    });

    // 2. Power Core
    const powerCoreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const powerCoreMesh = new THREE.Mesh(powerCoreGeometry, sensorCoreMaterial);
    powerCoreMesh.position.set(0, -1, 0);
    group.add(powerCoreMesh);
    parts.push({
        name: "RTG Power Core",
        description: "Radioisotope Thermoelectric Generator providing steady, reliable power.",
        material: "Isotope/Ceramic Core",
        function: "Converts heat from radioactive decay into electricity to power the laser pulses and sensors.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Capacitor Bank"],
        failureEffect: "Loss of system power, preventing laser firing and data collection.",
        cascadeFailures: ["Thermal control failure", "Telemetry loss"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -1, z: -8 },
        mesh: powerCoreMesh
    });

    // 3. Capacitor Bank
    const capGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
    const capMesh = new THREE.Mesh(capGeometry, copper);
    capMesh.position.set(0, 0.5, 0);
    group.add(capMesh);
    parts.push({
        name: "Pulse Capacitor Bank",
        description: "High-density energy storage for the laser emitter.",
        material: "Copper/Dielectric",
        function: "Stores electrical energy from the RTG and discharges it rapidly to generate powerful laser pulses.",
        assemblyOrder: 3,
        connections: ["Power Core", "Laser Transmitter"],
        failureEffect: "Inability to fire laser or reduced pulse intensity.",
        cascadeFailures: ["No return signal detectable"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 5, y: 0.5, z: 0 },
        mesh: capMesh
    });

    // 4. Laser Transmitter
    const transmitterGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const transmitterMesh = new THREE.Mesh(transmitterGeometry, chrome);
    transmitterMesh.position.set(0, 2, 1);
    transmitterMesh.rotation.x = Math.PI / 2;
    group.add(transmitterMesh);
    parts.push({
        name: "Nd:YAG Laser Transmitter",
        description: "High-power pulsed solid-state laser emitter.",
        material: "Chrome/Synthetic Crystal",
        function: "Generates intense, short bursts of coherent light directed at the celestial body's surface.",
        assemblyOrder: 4,
        connections: ["Capacitor Bank", "Optical Assembly"],
        failureEffect: "No laser beam produced.",
        cascadeFailures: ["Zero scientific data return"],
        originalPosition: { x: 0, y: 2, z: 1 },
        explodedPosition: { x: 0, y: 6, z: 4 },
        mesh: transmitterMesh
    });

    // Laser Beam (Visual)
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
    const beamMesh = new THREE.Mesh(beamGeometry, laserGlowMaterial);
    beamMesh.position.set(0, 2, 6);
    beamMesh.rotation.x = Math.PI / 2;
    group.add(beamMesh);
    parts.push({
        name: "Laser Pulse",
        description: "Intense beam of green light measuring distance.",
        material: "Photons (Neon Glow)",
        function: "Travels to the surface and reflects back to determine distance via time-of-flight.",
        assemblyOrder: 5,
        connections: ["Laser Transmitter"],
        failureEffect: "Signal attenuation or scattering.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2, z: 6 },
        explodedPosition: { x: 0, y: 2, z: 15 },
        mesh: beamMesh
    });

    // 5. Receiver Telescope
    const telescopeGeometry = new THREE.CylinderGeometry(1.5, 1, 3, 32);
    const telescopeMesh = new THREE.Mesh(telescopeGeometry, aluminum);
    telescopeMesh.position.set(0, -1, 1.5);
    telescopeMesh.rotation.x = Math.PI / 2;
    group.add(telescopeMesh);
    parts.push({
        name: "Receiver Telescope",
        description: "High-aperture optical telescope.",
        material: "Aluminum/Beryllium",
        function: "Collects the scattered laser photons bouncing back from the target surface.",
        assemblyOrder: 6,
        connections: ["Main Chassis", "Detector Unit"],
        failureEffect: "Inability to gather enough return photons.",
        cascadeFailures: ["Signal lost in noise"],
        originalPosition: { x: 0, y: -1, z: 1.5 },
        explodedPosition: { x: -6, y: -1, z: 5 },
        mesh: telescopeMesh
    });

    // Telescope Lens
    const lensGeometry = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32);
    const lensMesh = new THREE.Mesh(lensGeometry, glass);
    lensMesh.position.set(0, -1, 3.1);
    lensMesh.rotation.x = Math.PI / 2;
    group.add(lensMesh);
    parts.push({
        name: "Primary Lens",
        description: "Precision-ground objective lens.",
        material: "Optical Glass",
        function: "Focuses the incoming scattered light onto the detector array.",
        assemblyOrder: 7,
        connections: ["Receiver Telescope"],
        failureEffect: "Blurry or unfocused return signal.",
        cascadeFailures: ["Inaccurate timing measurements"],
        originalPosition: { x: 0, y: -1, z: 3.1 },
        explodedPosition: { x: -6, y: -1, z: 8 },
        mesh: lensMesh
    });

    // 6. Detector Unit (Avalanche Photodiode)
    const detectorGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.5);
    const detectorMesh = new THREE.Mesh(detectorGeometry, steel);
    detectorMesh.position.set(0, -1, -0.2);
    group.add(detectorMesh);
    parts.push({
        name: "Detector Unit (APD)",
        description: "Avalanche Photodiode array with sub-nanosecond precision.",
        material: "Silicon/Steel",
        function: "Detects individual returning photons and triggers a precise timing stop signal.",
        assemblyOrder: 8,
        connections: ["Receiver Telescope", "Timing Electronics"],
        failureEffect: "Failure to register returning light pulses.",
        cascadeFailures: ["No range data calculated"],
        originalPosition: { x: 0, y: -1, z: -0.2 },
        explodedPosition: { x: -6, y: -1, z: -3 },
        mesh: detectorMesh
    });

    // 7. Timing & Control Electronics
    const electronicsGeometry = new THREE.BoxGeometry(2, 2, 0.5);
    const electronicsMesh = new THREE.Mesh(electronicsGeometry, plastic);
    electronicsMesh.position.set(0, 1.5, -1.5);
    group.add(electronicsMesh);
    parts.push({
        name: "Timing Electronics",
        description: "Ultra-precise clock and data processing unit.",
        material: "Silicon/Plastic",
        function: "Calculates the time difference between laser pulse emission and photon return to compute altitude.",
        assemblyOrder: 9,
        connections: ["Detector Unit", "Main Chassis", "Capacitor Bank"],
        failureEffect: "Erroneous altitude readings or total failure to calculate range.",
        cascadeFailures: ["Spacecraft crash if used for navigation"],
        originalPosition: { x: 0, y: 1.5, z: -1.5 },
        explodedPosition: { x: 0, y: 5, z: -5 },
        mesh: electronicsMesh
    });

    // Status Indicators
    const indicator1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), indicatorBlueMaterial);
    indicator1.position.set(-0.8, 2, -1.2);
    group.add(indicator1);
    
    const indicator2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), indicatorRedMaterial);
    indicator2.position.set(-0.4, 2, -1.2);
    group.add(indicator2);

    const description = "The Astronomical Laser Altimeter uses time-of-flight measurements of intense laser pulses to map the topography of planets and moons with extreme precision. It features a solid-state laser transmitter and a highly sensitive optical receiver.";

    const quizQuestions = [
        {
            question: "What is the primary method an Astronomical Laser Altimeter uses to measure distance?",
            options: [
                "Measuring the Doppler shift of a continuous laser beam",
                "Measuring the time it takes for a laser pulse to travel to the surface and reflect back",
                "Calculating parallax using two distinct lasers",
                "Analyzing the atmospheric absorption of specific light frequencies"
            ],
            correct: 1,
            explanation: "Laser altimeters work on a 'time-of-flight' principle, measuring the exact time taken for a short pulse of light to hit a target and return to the detector.",
            difficulty: "easy"
        },
        {
            question: "Why is a high-aperture receiver telescope necessary for a space-based laser altimeter?",
            options: [
                "To focus the outgoing laser beam more tightly",
                "To prevent solar radiation from damaging the detector",
                "To collect as many scattered returning photons as possible from the weak reflection",
                "To act as a secondary gyroscope for spacecraft stabilization"
            ],
            correct: 2,
            explanation: "When a laser pulse hits a planetary surface, it scatters in all directions. Only a tiny fraction of photons bounce back toward the spacecraft, so a large telescope mirror/lens is needed to capture enough of them to register a signal.",
            difficulty: "medium"
        },
        {
            question: "If the spacecraft is orbiting at 150 km altitude, and the time-of-flight for a laser pulse is exactly 1 millisecond, what does this tell you? (Speed of light ≈ 300,000 km/s)",
            options: [
                "The altimeter is functioning correctly",
                "The surface being mapped is completely flat",
                "The spacecraft is flying over a deep canyon or depression",
                "The laser pulse bounced off a cloud layer"
            ],
            correct: 0,
            explanation: "Distance = (Speed of Light * Time) / 2. (300,000 km/s * 0.001 s) / 2 = 150 km. The measured distance matches the orbital altitude, indicating nominal operation over an area at the reference elevation.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes
        const pulse = meshes.find(m => m.name === "Laser Pulse");
        const capBank = meshes.find(m => m.name === "Pulse Capacitor Bank");
        const core = meshes.find(m => m.name === "RTG Power Core");

        // Pulsing laser beam effect
        if (pulse) {
            const cycle = (time * speed * 2) % 1;
            // Beam shoots out quickly, then disappears
            if (cycle < 0.2) {
                pulse.mesh.visible = true;
                pulse.mesh.scale.y = cycle * 10;
                pulse.mesh.position.z = 6 + (cycle * 5); // Move outward
            } else {
                pulse.mesh.visible = false;
            }
        }

        // Capacitor charging glow effect
        if (capBank) {
            const chargeCycle = (time * speed * 2) % 1;
            capBank.mesh.material.emissiveIntensity = chargeCycle * 0.5;
        }

        // Slow rotation of the power core to show it's active
        if (core) {
            core.mesh.rotation.y = time * speed * 0.5;
            core.mesh.rotation.z = time * speed * 0.3;
        }
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
export function createLaserAltimeter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
