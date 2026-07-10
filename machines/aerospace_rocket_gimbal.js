import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom Materials for Ultra-level Visual Flair
    const plasmaGlow = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 3, 
        transparent: true, 
        opacity: 0.8, 
        wireframe: true 
    });
    const energyCore = new THREE.MeshPhysicalMaterial({ 
        color: 0xff00aa, 
        emissive: 0xff00aa, 
        emissiveIntensity: 2, 
        transparent: true, 
        opacity: 0.9 
    });
    const neonAccent = new THREE.MeshStandardMaterial({ 
        color: 0x00ffcc, 
        emissive: 0x00ffcc, 
        emissiveIntensity: 1.5 
    });
    const darkAlloy = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.9, 
        roughness: 0.2 
    });
    const goldFoil = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        metalness: 0.8, 
        roughness: 0.4 
    });

    const meshes = {};

    // 1. Base Mount
    const baseMountGeo = new THREE.CylinderGeometry(5, 5, 1, 64);
    meshes.BaseMount = new THREE.Mesh(baseMountGeo, darkSteel);
    meshes.BaseMount.position.set(0, 5, 0);
    group.add(meshes.BaseMount);

    // 2. Vector Controller (Avionics)
    const avionicsGeo = new THREE.BoxGeometry(2, 1.5, 2);
    meshes.VectorController = new THREE.Mesh(avionicsGeo, goldFoil);
    meshes.VectorController.position.set(4, 5.5, 0);
    group.add(meshes.VectorController);
    
    // Add glowing chips to controller
    const chipGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const chip1 = new THREE.Mesh(chipGeo, neonAccent);
    chip1.position.set(0, 0.8, 0);
    meshes.VectorController.add(chip1);

    // Gimbal mechanism group (centered at origin for rotation)
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, 3, 0);
    group.add(gimbalGroup);

    // 3. Gimbal Ring
    const gimbalRingGeo = new THREE.TorusGeometry(4, 0.4, 32, 64);
    meshes.GimbalRing = new THREE.Mesh(gimbalRingGeo, chrome);
    meshes.GimbalRing.rotation.x = Math.PI / 2;
    gimbalGroup.add(meshes.GimbalRing);

    // 4. Thrust Chamber
    const pitchYawGroup = new THREE.Group();
    gimbalGroup.add(pitchYawGroup);

    const chamberGeo = new THREE.CylinderGeometry(2.5, 1.5, 4, 32);
    meshes.ThrustChamber = new THREE.Mesh(chamberGeo, darkAlloy);
    meshes.ThrustChamber.position.set(0, -1, 0);
    pitchYawGroup.add(meshes.ThrustChamber);

    // 5. Nozzle Extension
    const nozzleGeo = new THREE.CylinderGeometry(1.5, 4, 6, 32, 1, true);
    meshes.NozzleExtension = new THREE.Mesh(nozzleGeo, steel);
    meshes.NozzleExtension.position.set(0, -6, 0);
    pitchYawGroup.add(meshes.NozzleExtension);

    // Nozzle inner glow
    const nozzleGlowGeo = new THREE.CylinderGeometry(1.4, 3.8, 5.8, 32, 1, true);
    const nozzleGlow = new THREE.Mesh(nozzleGlowGeo, plasmaGlow);
    nozzleGlow.position.set(0, 0, 0);
    meshes.NozzleExtension.add(nozzleGlow);

    // 6. Plasma Injector
    const injectorGeo = new THREE.SphereGeometry(1.2, 32, 32);
    meshes.PlasmaInjector = new THREE.Mesh(injectorGeo, energyCore);
    meshes.PlasmaInjector.position.set(0, 0, 0);
    meshes.ThrustChamber.add(meshes.PlasmaInjector);

    // 7. Magnetic Confinement Rings
    const magGeo = new THREE.TorusGeometry(3, 0.2, 16, 64);
    meshes.MagneticConfinement = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(magGeo, glass);
        ring.position.set(0, -3 - i * 1.5, 0);
        ring.rotation.x = Math.PI / 2;
        meshes.MagneticConfinement.add(ring);
    }
    pitchYawGroup.add(meshes.MagneticConfinement);

    // 8. Flex Lines (Fuel & Oxidizer)
    const flexLineGeo = new THREE.TorusKnotGeometry(2.5, 0.2, 100, 16, 2, 3);
    meshes.FlexLines = new THREE.Mesh(flexLineGeo, rubber);
    meshes.FlexLines.position.set(0, 2, 0);
    pitchYawGroup.add(meshes.FlexLines);

    // 9. Pitch Actuator
    const actuatorBaseGeo = new THREE.CylinderGeometry(0.4, 0.4, 2);
    meshes.PitchActuator = new THREE.Mesh(actuatorBaseGeo, aluminum);
    meshes.PitchActuator.position.set(0, 2, 3);
    pitchYawGroup.add(meshes.PitchActuator);

    const pitchPistonGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const pitchPiston = new THREE.Mesh(pitchPistonGeo, chrome);
    pitchPiston.position.set(0, -1.5, 0);
    meshes.PitchActuator.add(pitchPiston);

    // 10. Yaw Actuator
    meshes.YawActuator = new THREE.Mesh(actuatorBaseGeo, aluminum);
    meshes.YawActuator.position.set(3, 2, 0);
    meshes.YawActuator.rotation.y = Math.PI / 2;
    pitchYawGroup.add(meshes.YawActuator);

    const yawPiston = new THREE.Mesh(pitchPistonGeo, chrome);
    yawPiston.position.set(0, -1.5, 0);
    meshes.YawActuator.add(yawPiston);

    // Internal Spinning Turbines (Visual flair)
    const turbineGeo = new THREE.CylinderGeometry(2, 2, 0.5, 16);
    const turbine1 = new THREE.Mesh(turbineGeo, copper);
    turbine1.position.set(0, 1, 0);
    meshes.ThrustChamber.add(turbine1);
    
    const bladeGeo = new THREE.BoxGeometry(4, 0.1, 0.5);
    for(let i=0; i<4; i++) {
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.rotation.y = (Math.PI / 4) * i;
        turbine1.add(blade);
    }
    
    // Assign object names for the platform logic
    Object.keys(meshes).forEach(key => {
        if (meshes[key]) meshes[key].name = key;
    });

    // We can also name the structural groups we don't necessarily export as parts but are animated
    meshes.Turbine = turbine1;
    meshes.PitchYawGroup = pitchYawGroup;

    // Define the parts for the encyclopedia
    const parts = [
        {
            name: 'BaseMount',
            description: 'Titanium-alloy structural base mounting the engine to the vehicle fuselage.',
            material: 'Dark Steel',
            function: 'Provides a rigid attachment point for the gimbal mechanism and distributes immense thrust loads.',
            assemblyOrder: 1,
            connections: ['GimbalRing', 'VectorController', 'VehicleFuselage'],
            failureEffect: 'Catastrophic structural failure leading to engine detachment.',
            cascadeFailures: ['Complete loss of vehicle control'],
            originalPosition: { x: 0, y: 5, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 0 }
        },
        {
            name: 'VectorController',
            description: 'Quantum-core avionics unit calculating micro-second thrust vector corrections.',
            material: 'Gold Foil & Neon Circuitry',
            function: 'Processes IMU data and commands the servo-actuators to correct pitch and yaw.',
            assemblyOrder: 2,
            connections: ['BaseMount', 'PitchActuator', 'YawActuator'],
            failureEffect: 'Loss of thrust vector control (TVC), leading to uncontrolled spin.',
            cascadeFailures: ['Aerodynamic breakup due to high G-forces'],
            originalPosition: { x: 4, y: 5.5, z: 0 },
            explodedPosition: { x: 10, y: 10, z: 0 }
        },
        {
            name: 'GimbalRing',
            description: 'Two-axis universal joint ring allowing free rotation in pitch and yaw axes.',
            material: 'Chrome',
            function: 'Transmits thrust loads to the base mount while allowing the engine to pivot seamlessly.',
            assemblyOrder: 3,
            connections: ['BaseMount', 'ThrustChamber'],
            failureEffect: 'Jammed engine vector, causing deviation from flight trajectory.',
            cascadeFailures: ['Actuator burnout due to stall currents'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 10, z: -5 }
        },
        {
            name: 'ThrustChamber',
            description: 'Primary high-pressure combustion zone with internal turbomachinery.',
            material: 'Dark Alloy & Copper',
            function: 'Mixes and ignites propellants to produce high-velocity exhaust.',
            assemblyOrder: 4,
            connections: ['GimbalRing', 'PlasmaInjector', 'NozzleExtension'],
            failureEffect: 'Combustion instability or chamber rupture.',
            cascadeFailures: ['Loss of vehicle', 'Explosion'],
            originalPosition: { x: 0, y: -1, z: 0 },
            explodedPosition: { x: 0, y: 5, z: -10 }
        },
        {
            name: 'PlasmaInjector',
            description: 'Central ignition core generating a super-heated plasma state.',
            material: 'Energy Core (Glowing)',
            function: 'Vaporizes and ionizes propellants instantly upon injection for maximum efficiency.',
            assemblyOrder: 5,
            connections: ['ThrustChamber', 'FlexLines'],
            failureEffect: 'Flameout or hard start (explosion).',
            cascadeFailures: ['Chamber pressure collapse'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 5, z: -15 }
        },
        {
            name: 'FlexLines',
            description: 'Corrugated cryogenic delivery pipes that flex as the engine gimbals.',
            material: 'Reinforced Rubber / Composite',
            function: 'Transports liquid propellants across the gimbal joint without restricting movement.',
            assemblyOrder: 6,
            connections: ['BaseMount', 'PlasmaInjector'],
            failureEffect: 'Propellant leak due to metal fatigue or over-bending.',
            cascadeFailures: ['Engine fire', 'Thrust loss'],
            originalPosition: { x: 0, y: 2, z: 0 },
            explodedPosition: { x: 0, y: 8, z: 10 }
        },
        {
            name: 'PitchActuator',
            description: 'Hydraulic servo-piston for pitch-axis vectoring.',
            material: 'Aluminum & Chrome',
            function: 'Extends and retracts to tilt the engine along the pitch axis with massive force.',
            assemblyOrder: 7,
            connections: ['BaseMount', 'ThrustChamber'],
            failureEffect: 'Inability to control vehicle pitch.',
            cascadeFailures: ['Unrecoverable aerodynamic stall'],
            originalPosition: { x: 0, y: 2, z: 3 },
            explodedPosition: { x: -8, y: 5, z: 5 }
        },
        {
            name: 'YawActuator',
            description: 'Hydraulic servo-piston for yaw-axis vectoring.',
            material: 'Aluminum & Chrome',
            function: 'Extends and retracts to tilt the engine along the yaw axis.',
            assemblyOrder: 8,
            connections: ['BaseMount', 'ThrustChamber'],
            failureEffect: 'Inability to control vehicle yaw.',
            cascadeFailures: ['Lateral spin-out'],
            originalPosition: { x: 3, y: 2, z: 0 },
            explodedPosition: { x: 8, y: 5, z: 5 }
        },
        {
            name: 'MagneticConfinement',
            description: 'Superconducting electromagnetic rings surrounding the exhaust path.',
            material: 'Glass / Plasma Glow',
            function: 'Focuses the plasma exhaust to prevent thermal erosion of the nozzle walls.',
            assemblyOrder: 9,
            connections: ['NozzleExtension', 'VectorController'],
            failureEffect: 'Plasma impingement on nozzle walls.',
            cascadeFailures: ['Nozzle melt-through', 'Asymmetric thrust'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -5, z: -10 }
        },
        {
            name: 'NozzleExtension',
            description: 'Radiatively cooled niobium expansion nozzle.',
            material: 'Steel & Plasma Glow',
            function: 'Expands exhaust gases to maximize supersonic thrust efficiency in a vacuum.',
            assemblyOrder: 10,
            connections: ['ThrustChamber'],
            failureEffect: 'Thrust efficiency drops dramatically.',
            cascadeFailures: ['Failure to reach orbit'],
            originalPosition: { x: 0, y: -6, z: 0 },
            explodedPosition: { x: 0, y: -15, z: 0 }
        }
    ];

    const quizQuestions = [
        {
            question: "What is the primary function of the Flex Lines in a gimbaled rocket engine?",
            options: [
                "To structurally support the engine mass",
                "To transport propellants across the moving gimbal joint",
                "To cool the exterior of the Thrust Chamber",
                "To transmit electrical signals to the Vector Controller"
            ],
            correct: 1,
            explanation: "Flex lines are corrugated pipes designed to transport fuel and oxidizer while bending, allowing the engine to gimbal freely without snapping rigid pipes.",
            difficulty: "Medium"
        },
        {
            question: "How does the Magnetic Confinement system prevent nozzle destruction?",
            options: [
                "By freezing the exhaust gases",
                "By absorbing all thermal energy",
                "By electromagnetically focusing the super-heated plasma away from the walls",
                "By physically blocking the exhaust flow"
            ],
            correct: 2,
            explanation: "The superconducting magnetic rings generate a field that repels and focuses the ionized plasma, preventing it from touching and melting the nozzle walls.",
            difficulty: "Hard"
        },
        {
            question: "If the Yaw Actuator fails while the engine is firing, what is the most likely immediate cascade effect?",
            options: [
                "The engine will instantly shut down safely",
                "The Flex Lines will freeze",
                "The vehicle will experience an uncontrollable lateral spin",
                "The Plasma Injector will over-pressurize"
            ],
            correct: 2,
            explanation: "A failed yaw actuator removes control over the yaw axis. The immense off-center thrust would immediately cause the vehicle to spin out laterally.",
            difficulty: "Easy"
        },
        {
            question: "What hardware component is responsible for calculating the micro-second corrections for the actuators?",
            options: [
                "Base Mount",
                "Thrust Chamber",
                "Gimbal Ring",
                "Vector Controller"
            ],
            correct: 3,
            explanation: "The Vector Controller (Avionics) processes flight data and commands the actuators to execute precise thrust vectoring maneuvers.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed) {
        // 1. Gimbal motion (Pitch and Yaw complex sine waves)
        const pitchAngle = Math.sin(time * 1.5 * speed) * 0.3; // +/- 17 degrees approx
        const yawAngle = Math.cos(time * 1.1 * speed) * 0.2;
        
        meshes.GimbalRing.rotation.x = (Math.PI / 2) + pitchAngle;
        meshes.PitchYawGroup.rotation.z = yawAngle;

        // 2. Actuator extension/retraction visual faking
        if (meshes.PitchActuator && meshes.YawActuator) {
            meshes.PitchActuator.scale.y = 1 - pitchAngle;
            meshes.YawActuator.scale.y = 1 + yawAngle * 1.5;
        }

        // 3. Turbine spinning very fast
        if (meshes.Turbine) {
            meshes.Turbine.rotation.y += 0.8 * speed;
        }

        // 4. Plasma Core pulsating heavily
        const pulseIntensity = (Math.sin(time * 8 * speed) + 1) * 0.5;
        if (meshes.PlasmaInjector) {
            meshes.PlasmaInjector.scale.setScalar(1 + pulseIntensity * 0.15);
            meshes.PlasmaInjector.material.emissiveIntensity = 2 + pulseIntensity * 3;
        }

        // 5. Magnetic rings glowing & spinning sequentially
        if (meshes.MagneticConfinement) {
            meshes.MagneticConfinement.children.forEach((ring, index) => {
                const ringPulse = (Math.sin(time * 4 * speed + index * 2) + 1) * 0.5;
                ring.scale.setScalar(1 + ringPulse * 0.08);
                ring.rotation.z += (0.05 + index * 0.02) * speed;
            });
        }
        
        // 6. Vector controller processing lights rapid blinking
        if (meshes.VectorController && meshes.VectorController.children[0]) {
            meshes.VectorController.children[0].material.emissiveIntensity = Math.random() > 0.3 ? 2.5 : 0.5;
        }
    }

    return {
        group,
        parts,
        description: "An ultra-complex, high-tech Thrust Vectoring Gimbal System featuring magnetic plasma confinement, quantum-core avionics, and high-pressure hydraulic actuators.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createRocketEngineGimbal() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
