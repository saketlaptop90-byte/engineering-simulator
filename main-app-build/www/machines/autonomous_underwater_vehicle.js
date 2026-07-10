import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing/neon materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.6
    });

    const sensorPulse = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.7
    });

    // Helper function to assemble and register parts
    function addPart(name, mesh, options) {
        mesh.name = name;
        if (options.originalPosition) {
            mesh.position.copy(options.originalPosition);
        }
        group.add(mesh);

        parts.push({
            name: name,
            mesh: mesh,
            description: options.description || 'AUV component',
            material: options.material || 'Custom',
            function: options.function || 'General operation',
            assemblyOrder: options.assemblyOrder || 1,
            connections: options.connections || [],
            failureEffect: options.failureEffect || 'Loss of efficiency',
            cascadeFailures: options.cascadeFailures || [],
            originalPosition: options.originalPosition || new THREE.Vector3(),
            explodedPosition: options.explodedPosition || new THREE.Vector3()
        });
    }

    // 1. Main Hull (Pressure Vessel)
    const hullGeometry = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
    hullGeometry.rotateZ(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeometry, aluminum);
    addPart('Titanium Pressure Hull', hullMesh, {
        description: 'The main pressure vessel protecting internal electronics and batteries.',
        material: 'Titanium Alloy',
        function: 'Withstands extreme deep-sea pressure up to 6000m.',
        assemblyOrder: 1,
        connections: ['Nose Cone', 'Tail Section', 'Sensor Payload', 'Li-ion Battery Bank'],
        failureEffect: 'Implosion and complete catastrophic failure.',
        cascadeFailures: ['All Internal Systems'],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 5, 0)
    });

    // 2. Nose Cone
    const noseGeometry = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    noseGeometry.rotateZ(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeometry, darkSteel);
    addPart('Hydrodynamic Nose Cone', noseMesh, {
        description: 'Acoustically transparent dome housing the forward obstacle avoidance sonar.',
        material: 'Carbon Fiber / Polyurethane',
        function: 'Reduces drag and houses forward sensors safely.',
        assemblyOrder: 2,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Increased drag and loss of forward obstacle detection.',
        cascadeFailures: ['Collision Risk'],
        originalPosition: new THREE.Vector3(4, 0, 0),
        explodedPosition: new THREE.Vector3(10, 0, 0)
    });

    // 3. Tail Section & Thruster Assembly
    const tailGeometry = new THREE.ConeGeometry(1.2, 3, 32);
    tailGeometry.rotateZ(-Math.PI / 2);
    const tailMesh = new THREE.Mesh(tailGeometry, darkSteel);
    addPart('Tail Cone Assembly', tailMesh, {
        description: 'Tapered tail section housing the main propulsion motor and steering actuators.',
        material: 'Aluminum & Composites',
        function: 'Houses main propulsion and minimizes turbulent wake.',
        assemblyOrder: 3,
        connections: ['Titanium Pressure Hull', 'Main Thruster'],
        failureEffect: 'Loss of propulsion sealing and water ingress.',
        cascadeFailures: ['Propulsion Motor'],
        originalPosition: new THREE.Vector3(-5.5, 0, 0),
        explodedPosition: new THREE.Vector3(-12, 0, 0)
    });

    // 4. Main Thruster Housing
    const thrusterGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
    thrusterGeometry.rotateZ(Math.PI / 2);
    const thrusterMesh = new THREE.Mesh(thrusterGeometry, chrome);
    addPart('Main Thruster', thrusterMesh, {
        description: 'High-torque brushless DC motor coupled to a ducted propeller.',
        material: 'Stainless Steel & Carbon Fiber',
        function: 'Provides primary forward and reverse propulsion.',
        assemblyOrder: 4,
        connections: ['Tail Cone Assembly'],
        failureEffect: 'Loss of mobility.',
        cascadeFailures: ['Mission Abortion'],
        originalPosition: new THREE.Vector3(-7.4, 0, 0),
        explodedPosition: new THREE.Vector3(-15, 0, 0)
    });

    // 5. Thruster Propeller Blades
    const propGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.2);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.position.set(0, 0.6, 0);
        const pivot = new THREE.Group();
        pivot.rotation.x = (Math.PI / 2) * i;
        pivot.add(blade);
        propGroup.add(pivot);
    }
    // Add central spinner
    const spinnerGeo = new THREE.ConeGeometry(0.15, 0.4, 16);
    spinnerGeo.rotateZ(-Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, neonOrange);
    spinner.position.set(-0.2, 0, 0);
    propGroup.add(spinner);
    
    addPart('Propeller Blades', propGroup, {
        description: 'Four-blade high-efficiency skewed propeller.',
        material: 'Bronze Alloy',
        function: 'Converts rotational energy into thrust in water.',
        assemblyOrder: 5,
        connections: ['Main Thruster'],
        failureEffect: 'Reduced or zero thrust, poor efficiency.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(-7.6, 0, 0),
        explodedPosition: new THREE.Vector3(-18, 0, 0)
    });
    // Ensure the group has a name for the animation function
    propGroup.name = "PropellerGroup";

    // 6. Side Fins (Steering)
    const finGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.0);
    const finLocations = [
        { name: 'Port Fin', pos: new THREE.Vector3(-6, 0, 1.2), rot: 0, ex: new THREE.Vector3(-6, 0, 5) },
        { name: 'Starboard Fin', pos: new THREE.Vector3(-6, 0, -1.2), rot: 0, ex: new THREE.Vector3(-6, 0, -5) },
        { name: 'Dorsal Fin', pos: new THREE.Vector3(-6, 1.2, 0), rot: Math.PI / 2, ex: new THREE.Vector3(-6, 5, 0) },
        { name: 'Ventral Fin', pos: new THREE.Vector3(-6, -1.2, 0), rot: Math.PI / 2, ex: new THREE.Vector3(-6, -5, 0) }
    ];

    finLocations.forEach((finInfo, index) => {
        const finMesh = new THREE.Mesh(finGeometry, plastic);
        finMesh.rotation.x = finInfo.rot;
        addPart(finInfo.name, finMesh, {
            description: `Actuated control surface for maneuvering in the ${finInfo.name.includes('Fin') && index > 1 ? 'pitch/yaw' : 'roll/pitch'} axes.`,
            material: 'Polyurethane',
            function: 'Vehicle steering, stabilization, and depth control.',
            assemblyOrder: 6 + index,
            connections: ['Tail Cone Assembly'],
            failureEffect: 'Loss of directional control, spiraling.',
            cascadeFailures: ['Collision with Seafloor'],
            originalPosition: finInfo.pos,
            explodedPosition: finInfo.ex
        });
    });

    // 7. Sensor Payload (Sonar & Cameras)
    const sensorBaseGeo = new THREE.BoxGeometry(3, 1, 1);
    const sensorBase = new THREE.Mesh(sensorBaseGeo, steel);
    addPart('Multibeam Echosounder (MBES)', sensorBase, {
        description: 'High-resolution acoustic sonar for 3D mapping of the seafloor.',
        material: 'Titanium and Acoustic Polyurethane',
        function: 'Bathymetric surveying and bottom tracking.',
        assemblyOrder: 10,
        connections: ['Titanium Pressure Hull', 'Data Processing Unit'],
        failureEffect: 'Loss of mapping capability.',
        cascadeFailures: ['Mission Data Collection'],
        originalPosition: new THREE.Vector3(0, -1.2, 0),
        explodedPosition: new THREE.Vector3(0, -5, 0)
    });

    // 8. MBES Glowing Emitters
    const mbesEmitterGeo = new THREE.BoxGeometry(2.8, 0.2, 0.8);
    const mbesEmitter = new THREE.Mesh(mbesEmitterGeo, neonBlue);
    mbesEmitter.name = 'MBESEmitter';
    addPart('MBES Transducer Array', mbesEmitter, {
        description: 'Acoustic array emitting dense sonar ping swaths.',
        material: 'Piezoelectric Ceramics',
        function: 'Emits and receives high-frequency acoustic pulses.',
        assemblyOrder: 11,
        connections: ['Multibeam Echosounder (MBES)'],
        failureEffect: 'Complete sonar failure.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, -1.6, 0),
        explodedPosition: new THREE.Vector3(0, -7, 0)
    });

    // 9. Battery Modules
    const batteryGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    batteryGeo.rotateZ(Math.PI / 2);
    const batteryMesh = new THREE.Mesh(batteryGeo, neonOrange);
    addPart('Li-ion Battery Bank', batteryMesh, {
        description: 'High-capacity pressure-tolerant lithium-ion battery modules.',
        material: 'Lithium-Ion & Aluminum casing',
        function: 'Provides electrical power to all AUV systems.',
        assemblyOrder: 12,
        connections: ['Titanium Pressure Hull', 'Power Distribution Board'],
        failureEffect: 'Complete loss of power.',
        cascadeFailures: ['All Systems', 'Vehicle Loss'],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 5)
    });

    // 10. Camera Pod
    const podGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    const podMesh = new THREE.Mesh(podGeo, chrome);
    addPart('Deep Sea Camera System', podMesh, {
        description: 'High-definition optical camera for seafloor and target imaging.',
        material: 'Sapphire Glass & Titanium',
        function: 'Captures visual data of underwater anomalies.',
        assemblyOrder: 13,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Loss of visual imaging.',
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(3, -1.0, 0.8),
        explodedPosition: new THREE.Vector3(5, -4, 4)
    });

    // 11. LED Strobe Light
    const ledGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const ledMesh = new THREE.Mesh(ledGeo, sensorPulse);
    ledMesh.name = 'LEDStrobe';
    addPart('LED Strobe Light', ledMesh, {
        description: 'High-intensity LED strobe for deep-sea illumination.',
        material: 'Sapphire Glass / Neon Green Elements',
        function: 'Illuminates the pitch-black seafloor for the camera system.',
        assemblyOrder: 14,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Camera images will be pitch black.',
        cascadeFailures: ['Deep Sea Camera System'],
        originalPosition: new THREE.Vector3(3, -1.0, -0.8),
        explodedPosition: new THREE.Vector3(5, -4, -4)
    });

    // 12. Antenna Mast (for surface comms)
    const mastGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const mastMesh = new THREE.Mesh(mastGeo, darkSteel);
    addPart('Comms Mast', mastMesh, {
        description: 'Houses GPS, Iridium satellite, and RF antennas for surface communication.',
        material: 'Carbon Fiber',
        function: 'Surface communication and satellite positioning.',
        assemblyOrder: 15,
        connections: ['Titanium Pressure Hull'],
        failureEffect: 'Loss of surface communication and GPS fix.',
        cascadeFailures: ['Vehicle Recovery', 'Data Offload'],
        originalPosition: new THREE.Vector3(-2, 1.5, 0),
        explodedPosition: new THREE.Vector3(-4, 6, 0)
    });

    const description = "The Autonomous Underwater Vehicle (AUV) is a highly capable, untethered robotic submarine designed for deep-sea exploration, bathymetric mapping, and oceanographic data collection. Operating independently of a surface vessel during missions, it relies on advanced onboard batteries, navigation systems (like Inertial Navigation and Doppler Velocity Logs), and sophisticated sonar payloads to safely survey the ocean floor.";

    const quizQuestions = [
        {
            question: "Why does an AUV rely primarily on sonar (acoustics) rather than cameras for underwater mapping?",
            options: [
                "Cameras are too expensive to waterproof at depth.",
                "Sonar uses significantly less battery power than optical cameras.",
                "Light is rapidly absorbed by water, limiting camera range to a few meters.",
                "Sonar can see through the solid rock of the ocean floor."
            ],
            correct: 2,
            explanation: "In the ocean, light attenuates very quickly. Even with powerful strobes, cameras can only see a few meters. Sonar uses sound waves, which travel great distances underwater, allowing the AUV to map wide swathes of the seafloor.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the AUV's main pressure hull?",
            options: [
                "To make the vehicle heavier so it can dive efficiently.",
                "To protect delicate internal electronics and batteries from extreme hydrostatic pressure.",
                "To reflect sonar waves back to the surface for tracking.",
                "To store ballast water for depth regulation."
            ],
            correct: 1,
            explanation: "At deep ocean depths, pressure is immense. The pressure hull is a rigid, sealed container usually made of titanium or high-grade aluminum that keeps the internal environment near 1 atmosphere, protecting the electronics from being crushed.",
            difficulty: "Easy"
        },
        {
            question: "Why do AUVs often surface periodically during long missions?",
            options: [
                "To recharge their batteries using deployable solar panels.",
                "To cool down their electronics in the surface air.",
                "To obtain a GPS fix and transmit data via satellite, since radio waves don't travel well underwater.",
                "To wait for manual joystick instructions from human divers."
            ],
            correct: 2,
            explanation: "Radio waves (like GPS and Wi-Fi) do not penetrate seawater effectively. AUVs must surface to expose their antennas to the sky to receive GPS coordinates to correct navigation drift and to send data to operators via satellite.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin propeller continuously based on speed
        const prop = meshes.find(m => m.name === 'PropellerGroup');
        if (prop) {
            prop.rotation.x -= 0.2 * speed;
        }

        // Pulse the MBES Emitter to simulate sonar pings
        const mbes = meshes.find(m => m.name === 'MBESEmitter');
        if (mbes) {
            mbes.material.emissiveIntensity = 0.5 + Math.sin(time * 0.005 * speed) * 0.5;
        }

        // Pulse the LED strobe with bright flashes
        const led = meshes.find(m => m.name === 'LEDStrobe');
        if (led) {
            const strobeTime = (time * speed) % 2000;
            if (strobeTime < 100 || (strobeTime > 200 && strobeTime < 300)) {
                led.material.emissiveIntensity = 2.0;
                led.material.opacity = 1.0;
            } else {
                led.material.emissiveIntensity = 0.2;
                led.material.opacity = 0.4;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAutonomousUnderwaterVehicle() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
