import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingOil = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.1
    });

    // 1. Camshaft Tube
    const camGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
    const camshaftTube = new THREE.Mesh(camGeometry, steel);
    camshaftTube.rotation.z = Math.PI / 2;
    group.add(camshaftTube);

    parts.push({
        name: 'Camshaft Tube',
        description: 'Main hollow shaft carrying the cam lobes and supplying pressurized oil to the VVT phaser.',
        material: 'steel',
        function: 'Transmits rotational motion from the timing chain to the cam lobes.',
        assemblyOrder: 1,
        connections: ['VVT Phaser', 'Cam Lobes', 'Oil Passages'],
        failureEffect: 'Loss of valve timing synchronization, potential engine destruction.',
        cascadeFailures: ['Bent valves', 'Piston damage'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 2. VVT Phaser Sprocket
    const phaserGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const phaser = new THREE.Mesh(phaserGeometry, darkSteel);
    phaser.position.set(-5.5, 0, 0);
    phaser.rotation.z = Math.PI / 2;
    group.add(phaser);

    parts.push({
        name: 'VVT Phaser Sprocket',
        description: 'Hydraulically actuated sprocket assembly that alters the relative angle of the camshaft.',
        material: 'darkSteel',
        function: 'Advances or retards camshaft timing based on engine RPM and load.',
        assemblyOrder: 2,
        connections: ['Camshaft Tube', 'Timing Chain', 'Oil Control Valve'],
        failureEffect: 'Poor engine performance, check engine light, rough idle.',
        cascadeFailures: ['Increased emissions', 'Decreased fuel economy'],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // 3. Phaser Internals (Rotor)
    const rotorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1.05, 16);
    const rotor = new THREE.Mesh(rotorGeometry, aluminum);
    rotor.position.set(-5.5, 0, 0);
    rotor.rotation.z = Math.PI / 2;
    group.add(rotor);

    parts.push({
        name: 'Phaser Rotor',
        description: 'Internal multi-vane rotor connected to the camshaft, moved by oil pressure inside the phaser housing.',
        material: 'aluminum',
        function: 'Creates separate advance and retard oil chambers within the phaser.',
        assemblyOrder: 3,
        connections: ['VVT Phaser Sprocket', 'Camshaft Tube'],
        failureEffect: 'Inability to adjust timing, fixed valve timing operation.',
        cascadeFailures: ['Sluggish acceleration'],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 }
    });

    // 4. Cam Lobes
    for (let i = 0; i < 4; i++) {
        const shape = new THREE.Shape();
        shape.arc(0, 0, 0.8, 0, Math.PI * 2, false);
        
        const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const lobeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        lobeGeometry.translate(0, 0.4, -0.25);

        const lobe = new THREE.Mesh(lobeGeometry, chrome);
        lobe.position.set(-3 + i * 2, 0, 0);
        lobe.rotation.x = i * Math.PI / 2;
        lobe.rotation.y = Math.PI / 2;
        group.add(lobe);
    }

    parts.push({
        name: 'Cam Lobes',
        description: 'Eccentric lobes that convert rotary motion into linear motion to open the valves.',
        material: 'chrome',
        function: 'Depresses the valve lifters/rocker arms at precise intervals.',
        assemblyOrder: 4,
        connections: ['Camshaft Tube', 'Valve Lifters'],
        failureEffect: 'Misfires, reduced compression, tapping noise.',
        cascadeFailures: ['Valve train wear', 'Lifter failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 5. Oil Control Valve (OCV)
    const ocvGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const ocv = new THREE.Mesh(ocvGeometry, copper);
    ocv.position.set(-5.5, 2.5, 0);
    group.add(ocv);

    parts.push({
        name: 'Oil Control Valve (OCV)',
        description: 'Electronic solenoid valve that directs oil flow to the advance or retard chambers of the phaser.',
        material: 'copper',
        function: 'Regulates oil pressure to the VVT phaser based on ECU signals.',
        assemblyOrder: 5,
        connections: ['ECU', 'Oil Pump', 'VVT Phaser Sprocket'],
        failureEffect: 'VVT system disabled, check engine light.',
        cascadeFailures: ['Engine knock', 'Stalling'],
        originalPosition: { x: -5.5, y: 2.5, z: 0 },
        explodedPosition: { x: -5.5, y: 5, z: 0 }
    });

    // 6. Glowing Oil Flow Indicator
    const oilRingGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 32);
    const oilRing = new THREE.Mesh(oilRingGeo, glowingOil);
    oilRing.position.set(-5.5, 0, 0);
    oilRing.rotation.y = Math.PI / 2;
    group.add(oilRing);

    parts.push({
        name: 'Pressurized Oil Flow',
        description: 'Engine oil under high pressure acts as hydraulic fluid for the VVT mechanism.',
        material: 'glowingOil',
        function: 'Provides hydraulic force to actuate the phaser rotor.',
        assemblyOrder: 6,
        connections: ['OCV', 'Phaser Rotor'],
        failureEffect: 'Phaser jamming, timing stuck at base angle.',
        cascadeFailures: ['Overheating components'],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -5.5, y: 0, z: -3 }
    });

    const description = "The Variable Valve Timing (VVT) Camshaft system dynamically adjusts valve timing by changing the phase angle of the camshaft relative to the timing sprocket. An Oil Control Valve (OCV) directs pressurized engine oil into advance or retard chambers within the phaser, pushing an internal rotor connected to the camshaft. This allows for optimal engine performance, reduced emissions, and improved fuel economy across different RPM ranges.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Oil Control Valve (OCV) in a VVT system?",
            options: [
                "To lubricate the cam lobes directly",
                "To direct pressurized oil to advance or retard chambers in the phaser",
                "To measure engine RPM",
                "To cool down the timing chain"
            ],
            correct: 1,
            explanation: "The OCV is an electronic solenoid that routes high-pressure engine oil into the specific chambers of the VVT phaser to alter the camshaft's timing.",
            difficulty: "Medium"
        },
        {
            question: "What actually changes when a VVT phaser advances or retards timing?",
            options: [
                "The duration the valve stays open",
                "The maximum lift of the valve",
                "The phase angle of the camshaft relative to the timing sprocket",
                "The clearance between the cam lobe and lifter"
            ],
            correct: 2,
            explanation: "Most basic VVT systems change the phase angle (timing) of the camshaft relative to the sprocket, rather than lift or duration, shifting when the valves open and close.",
            difficulty: "Hard"
        },
        {
            question: "Which component acts as the hydraulic fluid to operate the VVT phaser?",
            options: [
                "Power steering fluid",
                "Coolant",
                "Engine oil",
                "Brake fluid"
            ],
            correct: 2,
            explanation: "The VVT system utilizes the engine's existing pressurized oil to hydraulically move the internal rotor of the phaser.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Base rotation from engine timing chain
        const baseRotation = time * speed;
        
        // VVT Phase modulation (simulating advance/retard over time)
        const phaseShift = Math.sin(time * 0.5) * 0.5; // oscillate between -0.5 and 0.5 radians

        // Meshes:
        // [0] = camshaftTube
        // [1] = phaser
        // [2] = rotor
        // [3,4,5,6] = lobes
        // [7] = ocv
        // [8] = oilRing

        // Sprocket rotates at base engine half-speed
        if(meshes[1]) meshes[1].rotation.x = baseRotation;
        
        // Camshaft and rotor rotate at base speed + phase shift
        const totalRotation = baseRotation + phaseShift;
        if(meshes[0]) meshes[0].rotation.x = totalRotation;
        if(meshes[2]) meshes[2].rotation.x = totalRotation;
        
        // Lobes
        if(meshes[3]) meshes[3].rotation.x = totalRotation + (0 * Math.PI / 2);
        if(meshes[4]) meshes[4].rotation.x = totalRotation + (1 * Math.PI / 2);
        if(meshes[5]) meshes[5].rotation.x = totalRotation + (2 * Math.PI / 2);
        if(meshes[6]) meshes[6].rotation.x = totalRotation + (3 * Math.PI / 2);

        // Oil ring glow effect based on phaseShift
        if(meshes[8]) {
            const shiftIntensity = Math.abs(phaseShift) / 0.5; // 0 to 1
            meshes[8].material.emissiveIntensity = 0.5 + shiftIntensity * 2.0;
            meshes[8].scale.setScalar(1 + shiftIntensity * 0.1);
            meshes[8].rotation.x = baseRotation;
        }
        
        // OCV spool valve movement simulation
        if(meshes[7]) meshes[7].position.y = 2.5 + (phaseShift * 0.2);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVVTCamshaft() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
