import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const bladderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x222222,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4
    });

    // 1. Main Hull (Torpedo shape)
    const hullGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 32);
    hullGeo.rotateZ(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, aluminum);
    hull.position.set(0, 0, 0);
    group.add(hull);
    
    // Nose Cone
    const noseGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI);
    noseGeo.rotateZ(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, darkSteel);
    nose.position.set(6, 0, 0);
    group.add(nose);
    
    // Tail Cone
    const tailGeo = new THREE.ConeGeometry(1.5, 4, 32);
    tailGeo.rotateZ(-Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, darkSteel);
    tail.position.set(-8, 0, 0);
    group.add(tail);

    parts.push({
        name: 'Pressure Hull',
        description: 'Main cylindrical hull made of high-strength titanium or aluminum alloy. Houses electronics and payload while withstanding intense ocean depth pressures.',
        material: 'Aluminum / Titanium',
        function: 'Protects internal components from extreme hydrostatic pressure and saltwater corrosion.',
        assemblyOrder: 1,
        connections: ['Nose Cone', 'Tail Cone', 'Wings', 'Antenna', 'Buoyancy Engine'],
        failureEffect: 'Catastrophic implosion, total loss of the vehicle.',
        cascadeFailures: ['All internal electronics destroyed', 'Buoyancy control failure'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 2. Wings (Swept back)
    const wingGeo = new THREE.BoxGeometry(4, 0.2, 8);
    const rightWing = new THREE.Mesh(wingGeo, chrome);
    rightWing.position.set(0, 0, 4.5);
    rightWing.rotation.y = -Math.PI / 6;
    group.add(rightWing);

    const leftWing = new THREE.Mesh(wingGeo, chrome);
    leftWing.position.set(0, 0, -4.5);
    leftWing.rotation.y = Math.PI / 6;
    group.add(leftWing);

    parts.push({
        name: 'Fixed Wings',
        description: 'Hydrodynamic lifting surfaces crucial for the glider\'s movement.',
        material: 'Carbon Fiber / Chrome',
        function: 'Translates vertical motion (from buoyancy changes) into forward horizontal motion.',
        assemblyOrder: 2,
        connections: ['Pressure Hull'],
        failureEffect: 'Vehicle can only bob up and down, completely losing forward propulsion.',
        cascadeFailures: ['Mission failure due to lack of navigation'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 8}
    });

    // 3. Buoyancy Engine (Inside hull, represented by a visible bladder/pump)
    const engineGroup = new THREE.Group();
    
    // Pump
    const pumpGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    pumpGeo.rotateZ(Math.PI / 2);
    const pump = new THREE.Mesh(pumpGeo, steel);
    pump.position.set(-2, 0, 0);
    engineGroup.add(pump);

    // Bladder (expands/contracts)
    const bladderGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const bladder = new THREE.Mesh(bladderGeo, bladderMaterial);
    bladder.position.set(2, 0, 0);
    engineGroup.add(bladder);
    
    group.add(engineGroup);

    parts.push({
        name: 'Buoyancy Engine',
        description: 'A sophisticated pump system that shifts oil between an internal reservoir and an external bladder.',
        material: 'Steel / Polyurethane',
        function: 'Changes the vehicle\'s overall density. Inflating the bladder increases volume without adding mass, increasing buoyancy to ascend. Deflating causes descent.',
        assemblyOrder: 3,
        connections: ['Pressure Hull', 'Battery Pack', 'Control Unit'],
        failureEffect: 'Vehicle becomes stuck at current depth or sinks to the bottom.',
        cascadeFailures: ['Loss of vehicle if permanently negatively buoyant'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 4. Battery / Mass Shifter
    const batteryGeo = new THREE.BoxGeometry(3, 1, 1);
    const battery = new THREE.Mesh(batteryGeo, darkSteel);
    battery.position.set(-1, -0.8, 0);
    group.add(battery);

    parts.push({
        name: 'Pitch Control Battery Mass',
        description: 'Heavy battery packs mounted on a linear actuator.',
        material: 'Lithium / Steel',
        function: 'Moves forward and backward to shift the center of gravity, controlling the pitch (nose up or nose down) of the glider during ascent and descent.',
        assemblyOrder: 4,
        connections: ['Pressure Hull', 'Linear Actuator'],
        failureEffect: 'Inability to point the nose up or down, destroying gliding efficiency.',
        cascadeFailures: ['Stall conditions', 'Severely reduced forward speed'],
        originalPosition: {x: -1, y: -0.8, z: 0},
        explodedPosition: {x: -1, y: -8, z: 0}
    });

    // 5. Tail Fin (Rudder)
    const rudderGeo = new THREE.BoxGeometry(2, 3, 0.2);
    const rudder = new THREE.Mesh(rudderGeo, chrome);
    rudder.position.set(-7, 2, 0);
    group.add(rudder);

    parts.push({
        name: 'Vertical Rudder',
        description: 'A movable vertical fin at the rear of the glider.',
        material: 'Carbon Fiber / Chrome',
        function: 'Steers the vehicle left or right (yaw control) to follow waypoints.',
        assemblyOrder: 5,
        connections: ['Tail Cone', 'Servo Motor'],
        failureEffect: 'Loss of directional control. Vehicle will drift with ocean currents.',
        cascadeFailures: ['Navigation errors', 'Missed targets'],
        originalPosition: {x: -7, y: 2, z: 0},
        explodedPosition: {x: -12, y: 5, z: 0}
    });

    // 6. Antenna / Sensor Mast
    const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const mast = new THREE.Mesh(mastGeo, plastic);
    mast.position.set(-6, 3, 0);
    group.add(mast);
    
    // Glowing tip
    const tipGeo = new THREE.SphereGeometry(0.3);
    const tip = new THREE.Mesh(tipGeo, neonCyan);
    tip.position.set(-6, 5, 0);
    group.add(tip);

    parts.push({
        name: 'Communication & Sensor Mast',
        description: 'Houses GPS, Iridium satellite modem, and external sensors. Kept above water when surfaced.',
        material: 'Plastic / Fiberglass',
        function: 'Acquires location fixes and transmits data back to researchers when the glider surfaces between dive cycles.',
        assemblyOrder: 6,
        connections: ['Pressure Hull', 'Control Unit'],
        failureEffect: 'Vehicle cannot report position or transmit data. Essentially lost.',
        cascadeFailures: ['Complete mission data loss'],
        originalPosition: {x: -6, y: 4, z: 0},
        explodedPosition: {x: -6, y: 10, z: 0}
    });

    const description = "The Underwater Glider is an autonomous underwater vehicle (AUV) that uses small changes in its buoyancy in conjunction with wings to convert vertical motion into horizontal, propelling itself forward with very low power consumption.";

    const quizQuestions = [
        {
            question: "How does the underwater glider propel itself forward?",
            options: [
                "By using a high-speed rotating propeller.",
                "By using wings to translate vertical buoyancy-driven motion into horizontal motion.",
                "By expelling water jets from the rear.",
                "By drifting passively with ocean currents without any active control."
            ],
            correct: 1,
            explanation: "The glider changes its buoyancy to sink or rise. As it does, water flowing over its fixed wings generates lift that pushes it forward, creating a sawtooth dive profile.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the shifting battery mass inside the hull?",
            options: [
                "To generate electricity through kinetic motion.",
                "To cool the electronic components by moving them away from the pump.",
                "To alter the center of gravity, controlling the pitch angle (nose up or down).",
                "To provide an acoustic signal for underwater communication."
            ],
            correct: 2,
            explanation: "By sliding the heavy battery pack forward, the nose points down for descent. Sliding it backward points the nose up for ascent.",
            difficulty: "Hard"
        },
        {
            question: "Why does the glider need a buoyancy engine?",
            options: [
                "To generate thrust like a rocket engine.",
                "To increase or decrease the vehicle's volume, thereby changing its density and buoyancy.",
                "To power the radio antenna.",
                "To pump water over the sensor payload for continuous sampling."
            ],
            correct: 1,
            explanation: "The engine pumps oil into an external bladder to increase the vehicle's volume (making it less dense than water so it rises), or pulls it back in to decrease volume (making it denser so it sinks).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const cycle = (time * speed * 0.5) % (Math.PI * 2);
        
        // Vertical motion (sine wave)
        group.position.y = Math.sin(cycle) * 5;
        
        // Pitch motion (cosine wave - derivative of sine, so it points where it's going)
        group.rotation.z = Math.cos(cycle) * 0.3;

        // Buoyancy bladder inflation/deflation
        const bladderScale = 1.0 + (Math.cos(cycle) * 0.4); 
        bladder.scale.set(bladderScale, bladderScale, bladderScale);

        // Bladder glow intensity correlates with size
        bladderMaterial.emissiveIntensity = 0.2 + (bladderScale - 1) * 2;

        // Battery mass shifting
        battery.position.x = -1 - (Math.cos(cycle) * 1.5);

        // Subtle wing flutter or water resistance effect
        rightWing.rotation.z = Math.sin(time * speed * 5) * 0.05;
        leftWing.rotation.z = -Math.sin(time * speed * 5) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAUVGlider() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
