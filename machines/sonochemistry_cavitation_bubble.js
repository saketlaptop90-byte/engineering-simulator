import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing/Neon materials for Sonochemistry
    const emissivePlasma = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x44ffff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    
    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 1.0
    });

    const jetMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const shockwaveMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    // 1. Mobile Reactor Base (To satisfy macro-scale mobility & TIRES requirement)
    const baseGroup = new THREE.Group();
    
    const chassisGeo = new THREE.BoxGeometry( 40, 5, 60 );
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.y = 5;
    baseGroup.add(chassis);
    parts.push({
        name: "Reactor Chassis",
        description: "Heavy-duty steel chassis for the macroscopic sonochemical reactor gantry.",
        material: "darkSteel",
        function: "Supports the transducer and resonance chamber.",
        assemblyOrder: 1,
        connections: ["Wheels", "Resonance Chamber"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Chamber rupture"],
        originalPosition: {x: 0, y: 5, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 2-5. Tires (Extreme Off-road tread pattern)
    const wheelPositions = [
        [-20, 5, -25], [20, 5, -25], [-20, 5, 25], [20, 5, 25]
    ];
    
    const wheels = [];
    wheelPositions.forEach((pos, idx) => {
        const wheelGroup = new THREE.Group();
        
        // Tire Core
        const tireGeo = new THREE.TorusGeometry( 4, 1.5, 32, 100 );
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const lugCount = 60;
        const lugGeo = new THREE.BoxGeometry( 0.4, 2.0, 3.2 );
        for (let i = 0; i < lugCount; i++) {
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (i / lugCount) * Math.PI * 2;
            lug.position.set( Math.cos(angle)*4, Math.sin(angle)*4, 0 );
            lug.rotation.z = angle;
            wheelGroup.add(lug);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry( 2.8, 2.8, 2, 32 );
        rimGeo.rotateX(Math.PI/2);
        const rim = new THREE.Mesh(rimGeo, chrome);
        wheelGroup.add(rim);

        // Complex Spoke Array
        const spokeGeo = new THREE.CylinderGeometry( 0.2, 0.2, 5.6, 16 );
        spokeGeo.rotateX(Math.PI/2);
        const spokeCount = 8;
        for (let i = 0; i < spokeCount; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.z = (i / spokeCount) * Math.PI;
            wheelGroup.add(spoke);
        }

        wheelGroup.position.set(...pos);
        wheelGroup.rotation.y = Math.PI/2;
        baseGroup.add(wheelGroup);
        wheels.push(wheelGroup);
        
        parts.push({
            name: `All-Terrain Reactor Tire ${idx+1}`,
            description: "High-traction wheeled mobility system for transporting the immense transducer array, using advanced off-road lug treads.",
            material: "rubber, chrome",
            function: "Mobility and severe vibration isolation.",
            assemblyOrder: 2 + idx,
            connections: ["Reactor Chassis"],
            failureEffect: "Loss of mobility and dampening",
            cascadeFailures: ["Vibration transmission to facility floor"],
            originalPosition: {x: pos[0], y: pos[1], z: pos[2]},
            explodedPosition: {x: pos[0]*2, y: pos[1], z: pos[2]*2}
        });
    });

    group.add(baseGroup);

    // 6. Resonance Chamber (Vessel)
    const chamberGeo = new THREE.CylinderGeometry( 15, 15, 40, 64, 1, true );
    const chamber = new THREE.Mesh(chamberGeo, tinted);
    chamber.position.set(0, 30, 0);
    group.add(chamber);
    parts.push({
        name: "Acoustic Resonance Chamber",
        description: "Heavy borosilicate tinted glass vessel to contain the fluid and withstand extreme acoustic standing wave pressures.",
        material: "tinted glass",
        function: "Contains fluid and establishes standing waves.",
        assemblyOrder: 6,
        connections: ["Reactor Chassis", "Working Fluid"],
        failureEffect: "Catastrophic fluid leak and implosion",
        cascadeFailures: ["Transducer short circuit", "Loss of cavitation"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 0, y: 30, z: -40}
    });

    // 7. Fluid Medium
    const fluidGeo = new THREE.CylinderGeometry( 14.8, 14.8, 38, 64 );
    const fluidMat = new THREE.MeshPhysicalMaterial({
        color: 0x002255,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.33,
        thickness: 5.0,
        side: THREE.DoubleSide
    });
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.set(0, 30, 0);
    group.add(fluid);
    parts.push({
        name: "Working Fluid (Degassed Solvent)",
        description: "The highly pure liquid medium, meticulously degassed and optimized for maximum yield cavitation and sonoluminescence.",
        material: "fluid",
        function: "Medium for cavitation bubble formation.",
        assemblyOrder: 7,
        connections: ["Acoustic Resonance Chamber"],
        failureEffect: "Boiling or vapor lock",
        cascadeFailures: ["Bubble suppression", "Cushioned collapse"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });

    // 8. Acoustic Reflector
    const reflectorGeo = new THREE.CylinderGeometry(14.5, 14.5, 2, 32);
    const reflector = new THREE.Mesh(reflectorGeo, steel);
    reflector.position.set(0, 11, 0);
    group.add(reflector);
    parts.push({
        name: "Tuned Acoustic Reflector",
        description: "Heavy steel plate positioned exactly at a half-wavelength multiple to establish a perfect resonant standing wave.",
        material: "steel",
        function: "Wave reflection.",
        assemblyOrder: 8,
        connections: ["Acoustic Resonance Chamber"],
        failureEffect: "Traveling waves instead of standing waves",
        cascadeFailures: ["No localized cavitation node"],
        originalPosition: {x: 0, y: 11, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 9. Piezoelectric Transducer Horn
    const hornPoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        hornPoints.push( new THREE.Vector2( 2 + 10 * Math.exp(-0.2 * i), i * 1.5 ) );
    }
    const hornGeo = new THREE.LatheGeometry( hornPoints, 64 );
    const horn = new THREE.Mesh(hornGeo, aluminum);
    horn.rotation.x = Math.PI; // point downwards
    horn.position.set(0, 60, 0);
    group.add(horn);
    parts.push({
        name: "Exponential Titanium Horn",
        description: "Acoustic amplifier that concentrates ultrasonic mechanical energy directly into the fluid focal point.",
        material: "aluminum (titanium equivalent)",
        function: "Amplifies acoustic amplitude.",
        assemblyOrder: 9,
        connections: ["PZT Piezoelectric Stack", "Working Fluid"],
        failureEffect: "Fatigue cracking at antinode",
        cascadeFailures: ["Total loss of acoustic coupling"],
        originalPosition: {x: 0, y: 60, z: 0},
        explodedPosition: {x: 0, y: 120, z: 0}
    });

    // 10. Piezoelectric Stack
    const piezoGroup = new THREE.Group();
    const piezoCount = 6;
    for(let i=0; i<piezoCount; i++) {
        const ringGeo = new THREE.CylinderGeometry( 12, 12, 3, 32 );
        const ring = new THREE.Mesh(ringGeo, i%2===0 ? steel : copper);
        ring.position.y = i * 4;
        piezoGroup.add(ring);
    }
    piezoGroup.position.set(0, 65, 0);
    group.add(piezoGroup);
    parts.push({
        name: "PZT Piezoelectric Stack",
        description: "Array of Lead Zirconate Titanate crystals that convert high-voltage alternating current into intense mechanical vibration.",
        material: "copper, steel, PZT",
        function: "Generates ultrasonic waves.",
        assemblyOrder: 10,
        connections: ["Exponential Titanium Horn", "High-Voltage RF Shielded Cables"],
        failureEffect: "Thermal runaway and dielectric depolarization",
        cascadeFailures: ["Short circuit", "Horn detachment"],
        originalPosition: {x: 0, y: 65, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // 11. Hydraulic Positioning Pistons for Horn
    const pistonGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const angle = (i/3)*Math.PI*2;
        const pistonOuterGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
        const pistonOuter = new THREE.Mesh(pistonOuterGeo, darkSteel);
        pistonOuter.position.set(Math.cos(angle)*16, 50, Math.sin(angle)*16);
        pistonGroup.add(pistonOuter);

        const pistonInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
        const pistonInner = new THREE.Mesh(pistonInnerGeo, chrome);
        pistonInner.position.set(Math.cos(angle)*16, 65, Math.sin(angle)*16);
        pistonGroup.add(pistonInner);
    }
    group.add(pistonGroup);
    parts.push({
        name: "Hydraulic Z-Axis Actuators",
        description: "Precision hydraulic cylinders to dynamically tune the resonance cavity length by adjusting horn height.",
        material: "darkSteel, chrome",
        function: "Adjusts horn immersion depth.",
        assemblyOrder: 11,
        connections: ["Acoustic Transducer Housing", "Reactor Chassis"],
        failureEffect: "Loss of resonance lock",
        cascadeFailures: ["Inefficient energy transfer"],
        originalPosition: {x: 0, y: 57, z: 0},
        explodedPosition: {x: 40, y: 57, z: 0}
    });

    // 12. Transducer Housing
    const housingPoints = [];
    for(let i=0; i<=15; i++) {
        housingPoints.push(new THREE.Vector2(14, i*1.2));
    }
    const housingGeo = new THREE.LatheGeometry(housingPoints, 32);
    const housingMat = new THREE.MeshPhysicalMaterial({
        color: 0x999999,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.5
    });
    const transparentHousing = new THREE.Mesh(housingGeo, housingMat);
    transparentHousing.position.set(0, 60, 0);
    group.add(transparentHousing);
    parts.push({
        name: "Acoustic Transducer Housing",
        description: "Polycarbonate transparent protective shell surrounding the high-voltage piezo array to protect operators.",
        material: "polycarbonate",
        function: "Protection and electrical isolation.",
        assemblyOrder: 12,
        connections: ["Hydraulic Z-Axis Actuators", "PZT Piezoelectric Stack"],
        failureEffect: "Exposure of high voltage",
        cascadeFailures: ["Severe personnel hazard"],
        originalPosition: {x: 0, y: 60, z: 0},
        explodedPosition: {x: 0, y: 150, z: 50}
    });

    // 13. Cavitation Bubble Core (The focal microscopic simulation)
    const bubbleGroup = new THREE.Group();
    bubbleGroup.position.set(0, 30, 0); 
    
    // Core geometry (Icosahedron for complex dynamic deformations)
    const bubbleGeo = new THREE.IcosahedronGeometry( 4, 8 ); 
    const bubbleCore = new THREE.Mesh(bubbleGeo, emissivePlasma);
    bubbleGroup.add(bubbleCore);
    
    // Internal glowing light for Sonoluminescence
    const glowLight = new THREE.PointLight( 0x44ffff, 100, 50 );
    bubbleGroup.add(glowLight);

    // Ultra-hot inner core (Sonoluminescence flash)
    const innerCoreGeo = new THREE.SphereGeometry( 0.5, 32, 32 );
    const innerCore = new THREE.Mesh(innerCoreGeo, plasmaCoreMat);
    bubbleGroup.add(innerCore);

    group.add(bubbleGroup);
    parts.push({
        name: "Cavitation Bubble Core",
        description: "The primary void formed by negative acoustic pressure, undergoing violent expansion and inertial collapse.",
        material: "plasma",
        function: "Concentrates immense energy via localized implosion.",
        assemblyOrder: 13,
        connections: ["Working Fluid", "Liquid Microjet"],
        failureEffect: "Dissolution into fluid without collapse",
        cascadeFailures: ["Total loss of sonochemical reactions"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: -30, y: 30, z: 30}
    });

    // 14. Microjet (Formed during collapse)
    const microjetGeo = new THREE.ConeGeometry( 0.8, 12, 32 );
    microjetGeo.translate(0, -6, 0);
    const microjet = new THREE.Mesh(microjetGeo, jetMaterial);
    microjet.position.set(0, 34, 0); 
    microjet.scale.y = 0.001; 
    bubbleGroup.add(microjet);
    parts.push({
        name: "Liquid Microjet",
        description: "A high-velocity jet of liquid that pierces the bubble during asymmetric collapse, often exceeding speeds of 100 m/s.",
        material: "fluid",
        function: "Surface pitting, local mixing, and erosion.",
        assemblyOrder: 14,
        connections: ["Cavitation Bubble Core"],
        failureEffect: "Symmetric spherical collapse instead",
        cascadeFailures: ["Reduced boundary mixing"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: -40, y: 30, z: 40}
    });

    // 15. Acoustic Shockwaves (Expanding transient rings)
    const shockwaves = [];
    for(let i=0; i<3; i++) {
        const swGeo = new THREE.TorusGeometry( 5, 0.2, 16, 64 );
        const sw = new THREE.Mesh(swGeo, shockwaveMat);
        sw.rotation.x = Math.PI/2;
        bubbleGroup.add(sw);
        shockwaves.push(sw);
    }
    parts.push({
        name: "Emission Shockwaves",
        description: "Supersonic pressure transients emitted into the liquid during the moment of maximum bubble compression and rebound.",
        material: "pressure gradient",
        function: "Energy dissipation and secondary cavitation seeding.",
        assemblyOrder: 15,
        connections: ["Cavitation Bubble Core", "Working Fluid"],
        failureEffect: "Damped emission",
        cascadeFailures: ["Reduced chemical yield"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 0, y: 30, z: 60}
    });

    // 16. Dissolved Gas Molecules / Hydroxyl Radicals
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xff00ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const radicals = new THREE.Points(particlesGeo, particlesMat);
    bubbleGroup.add(radicals);
    parts.push({
        name: "Hydroxyl Radicals & Plasma Particles",
        description: "Dissociated molecular fragments generated by the 5000K+ internal temperatures inside the collapsing bubble.",
        material: "plasma particles",
        function: "Drives intense local sonochemical reactions.",
        assemblyOrder: 16,
        connections: ["Cavitation Bubble Core"],
        failureEffect: "Immediate recombination",
        cascadeFailures: ["No reaction products formed"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 50, y: 30, z: 50}
    });

    // 17. Laser Diagnostic Probe
    const probeGroup = new THREE.Group();
    const probeBodyGeo = new THREE.CylinderGeometry( 0.5, 0.5, 15, 16 );
    const probeBody = new THREE.Mesh(probeBodyGeo, chrome);
    probeBody.rotation.z = Math.PI/2;
    probeBody.position.set(-20, 30, 0);
    probeGroup.add(probeBody);
    
    const laserBeamGeo = new THREE.CylinderGeometry( 0.05, 0.05, 40, 16 );
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserMat);
    laserBeam.rotation.z = Math.PI/2;
    laserBeam.position.set(0, 30, 0);
    probeGroup.add(laserBeam);
    
    group.add(probeGroup);
    parts.push({
        name: "Mie Scattering Laser Probe",
        description: "High-speed laser diagnostic tool for measuring bubble radius R(t) in real-time by analyzing light scattering.",
        material: "chrome, laser optics",
        function: "Data acquisition and bubble tracking.",
        assemblyOrder: 17,
        connections: ["Acoustic Resonance Chamber"],
        failureEffect: "Loss of measurement telemetry",
        cascadeFailures: ["Feedback loop failure"],
        originalPosition: {x: -20, y: 30, z: 0},
        explodedPosition: {x: -60, y: 30, z: 0}
    });

    // 18. Cryogenic Cooling Coils
    const coilGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3( (function(){
            const pts = [];
            for(let i=0; i<100; i++) {
                const a = i * 0.5;
                pts.push(new THREE.Vector3(Math.cos(a)*16, i*0.4 + 10, Math.sin(a)*16));
            }
            return pts;
        })() ),
        200, 0.6, 16, false
    );
    const coil = new THREE.Mesh(coilGeo, copper);
    group.add(coil);
    parts.push({
        name: "Cryogenic Cooling Coils",
        description: "Copper heat exchangers to maintain extremely low liquid temperature, drastically enhancing collapse intensity.",
        material: "copper",
        function: "Thermal regulation.",
        assemblyOrder: 18,
        connections: ["Acoustic Resonance Chamber", "Cryo-Coolant Centrifugal Pump"],
        failureEffect: "Overheating of solvent",
        cascadeFailures: ["High vapor pressure", "Weak cushioned cavitation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -60}
    });

    // 19. Coolant Pump
    const pumpGroup = new THREE.Group();
    const pumpMotorGeo = new THREE.CylinderGeometry(4, 4, 10, 32);
    const pumpMotor = new THREE.Mesh(pumpMotorGeo, darkSteel);
    pumpMotor.rotation.z = Math.PI/2;
    pumpGroup.add(pumpMotor);

    const pumpHeadGeo = new THREE.CylinderGeometry(5, 5, 4, 32);
    const pumpHead = new THREE.Mesh(pumpHeadGeo, aluminum);
    pumpHead.position.x = 7;
    pumpHead.rotation.z = Math.PI/2;
    pumpGroup.add(pumpHead);
    
    pumpGroup.position.set(-15, 10, -15);
    group.add(pumpGroup);
    parts.push({
        name: "Cryo-Coolant Centrifugal Pump",
        description: "High-pressure pump circulating liquid nitrogen or chilled glycol through the copper cooling coils.",
        material: "darkSteel, aluminum",
        function: "Circulates thermodynamic coolant.",
        assemblyOrder: 19,
        connections: ["Cryogenic Cooling Coils", "Reactor Chassis"],
        failureEffect: "Coolant stagnation",
        cascadeFailures: ["Overheating", "Vapor lock"],
        originalPosition: {x: -15, y: 10, z: -15},
        explodedPosition: {x: -40, y: 10, z: -40}
    });

    // 20. Power Supply Unit
    const psuGeo = new THREE.BoxGeometry( 20, 15, 15 );
    const psu = new THREE.Mesh(psuGeo, darkSteel);
    psu.position.set(15, 12, -15);
    
    const ventGeo = new THREE.BoxGeometry( 18, 1, 13 );
    const vent = new THREE.Mesh(ventGeo, chrome);
    vent.position.y = 7.5;
    psu.add(vent);

    group.add(psu);
    parts.push({
        name: "High-Frequency RF Power Supply",
        description: "20 kW RF generator capable of driving the piezoelectric stack at precisely 20.1 kHz resonance.",
        material: "darkSteel, chrome",
        function: "Provides driving AC voltage.",
        assemblyOrder: 20,
        connections: ["High-Voltage RF Shielded Cables", "Reactor Chassis"],
        failureEffect: "Loss of power",
        cascadeFailures: ["Immediate cessation of cavitation"],
        originalPosition: {x: 15, y: 12, z: -15},
        explodedPosition: {x: 50, y: 12, z: -50}
    });

    // 21. Wiring Harness
    const wireCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(15, 19, -15),
        new THREE.Vector3(15, 40, -10),
        new THREE.Vector3(5, 60, -5),
        new THREE.Vector3(0, 65, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wireCurve, 64, 0.5, 8, false);
    const wireMat = new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.8});
    const wiring = new THREE.Mesh(wireGeo, wireMat);
    group.add(wiring);
    parts.push({
        name: "High-Voltage RF Shielded Cables",
        description: "Heavily insulated cabling to deliver extremely high voltage without RF interference to diagnostics.",
        material: "rubber, copper core",
        function: "Transmits electrical power.",
        assemblyOrder: 21,
        connections: ["High-Frequency RF Power Supply", "PZT Piezoelectric Stack"],
        failureEffect: "Arcing or short circuit",
        cascadeFailures: ["PSU overload", "Fires"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: 40, z: -20}
    });

    // 22. Control Panel
    const panelGeo = new THREE.BoxGeometry( 15, 10, 2 );
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, 15, 32);
    panel.rotation.x = -Math.PI/6;
    
    // Screen
    const screenGeo = new THREE.PlaneGeometry( 13, 8 );
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x001100 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 1.1);
    panel.add(screen);

    // Glowing graph lines
    const graphGeo = new THREE.BufferGeometry();
    const graphPts = [];
    for(let i=0; i<50; i++) {
        graphPts.push(new THREE.Vector3(-6 + (i/50)*12, Math.sin(i*0.5)*2, 1.2));
    }
    graphGeo.setFromPoints(graphPts);
    const graphLine = new THREE.Line(graphGeo, new THREE.LineBasicMaterial({color: 0x00ff00}));
    panel.add(graphLine);
    
    group.add(panel);
    parts.push({
        name: "Acoustic Synthesizer Panel",
        description: "Control interface monitoring driving frequency, acoustic pressure, and sonoluminescence intensity.",
        material: "darkSteel, glass, electronics",
        function: "User interface and closed-loop phase lock control.",
        assemblyOrder: 22,
        connections: ["Reactor Chassis"],
        failureEffect: "System shutdown",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 15, z: 32},
        explodedPosition: {x: 0, y: 15, z: 70}
    });

    const description = "The Sonochemical Cavitation Reactor represents the absolute cutting edge of acoustic chemistry. By driving a specialized fluid with immense ultrasonic fields via a titanium exponential horn and high-voltage PZT piezo stack, it induces severe cavitation. The main Cavitation Bubble Core experiences alternating cycles of massive expansion and violently inertial collapse. During collapse, internal gases are compressed so rapidly that temperatures exceed 5000 Kelvin, generating localized plasma, intense shockwaves, high-velocity microjets, and Sonoluminescence. The entire macroscopic rig—complete with hydraulic leveling, extreme off-road mobility tires, and laser diagnostics—is designed to study and harvest these microscopic extreme events.";

    const quizQuestions = [
        {
            question: "What geometric structure is used for the extreme off-road tires supporting the reactor?",
            options: ["BoxGeometry", "SphereGeometry", "TorusGeometry with BoxGeometry lugs", "CylinderGeometry only"],
            correctAnswer: 2,
            explanation: "The tires are painstakingly built using TorusGeometry wrapped in hundreds of extruded BoxGeometry lugs for maximum traction and vibration dampening."
        },
        {
            question: "What physical phenomenon occurs in the cavitation bubble to produce localized light flashes?",
            options: ["Bioluminescence", "Sonoluminescence", "Triboluminescence", "Electroluminescence"],
            correctAnswer: 1,
            explanation: "Sonoluminescence is the emission of short bursts of light from imploding bubbles in a liquid when excited by sound, resulting from extreme internal heating."
        },
        {
            question: "Why is the high-velocity liquid microjet formed during bubble collapse?",
            options: ["Because of extreme heat", "Due to asymmetric collapse near boundaries or acoustic gradients", "Because it is injected by a pump", "To cool the bubble"],
            correctAnswer: 1,
            explanation: "Asymmetric collapse, often caused by proximity to a solid surface or interfering shockwaves, forces the surrounding fluid to pierce the bubble as a high-speed microjet."
        },
        {
            question: "What material is the exponential horn typically made from in this simulation to withstand immense stress?",
            options: ["Rubber", "Titanium (Aluminum equivalent material)", "Glass", "Plastic"],
            correctAnswer: 1,
            explanation: "Titanium is typically used for acoustic horns due to its incredibly high fatigue strength and excellent acoustic transmission properties without cracking."
        },
        {
            question: "What is the primary purpose of the cryogenic cooling coils surrounding the resonance chamber?",
            options: ["To freeze the fluid solid", "To heat the fluid", "To lower vapor pressure and enhance collapse intensity", "To provide structural support"],
            correctAnswer: 2,
            explanation: "Lowering the temperature drastically reduces the vapor pressure of the liquid, which prevents internal cushioning during collapse and leads to a much more violent, higher-temperature implosion."
        }
    ];

    // Animation state variables
    let phase = 0;

    function animate(time, speed, meshes) {
        // Subtle idle vibration and wheel wobble for the massive cart structure
        wheels.forEach(w => {
            w.rotation.x = Math.sin(time * speed) * 0.1;
        });

        // Hydraulic pistons pulsing to tune resonance
        pistonGroup.children.forEach((c, idx) => {
            if (idx % 2 === 1) { // Inner chrome piston
                c.position.y = 65 + Math.sin(time * speed * 2) * 2;
            }
        });

        // Piezo stack vibrating at extremely high frequency visually
        piezoGroup.position.y = 65 + Math.sin(time * speed * 20) * 0.1;
        horn.position.y = 60 + Math.sin(time * speed * 20) * 0.2;

        // Bubble Dynamics - Rayleigh-Plesset approximation
        // Custom cycle: 0 to 0.8 is expansion, 0.8 to 1.0 is collapse and rebound
        phase = (time * speed * 0.5) % 1.0;
        
        let radius = 1;
        let brightness = 0;
        let jetScale = 0.001;
        let shockOpacity = 0;

        if (phase < 0.8) {
            // Expansion phase (Negative acoustic pressure)
            let t = phase / 0.8;
            radius = 1 + t * 4; // Grows up to scale 5
            brightness = 0;
            jetScale = 0.001;
            shockOpacity = 0;
            
            // Random jitter on vertices for realism during unstable expansion
            const positions = bubbleCore.geometry.attributes.position;
            for(let i=0; i<positions.count; i++) {
                const vec = new THREE.Vector3().fromBufferAttribute(positions, i).normalize();
                const noise = 1.0 + Math.sin(time*10 + vec.x*5 + vec.y*8)*0.03;
                positions.setXYZ(i, vec.x*4*noise, vec.y*4*noise, vec.z*4*noise);
            }
            bubbleCore.geometry.attributes.position.needsUpdate = true;
        } else {
            // Collapse phase (0.8 to 0.95) and rebound (0.95 to 1.0)
            let t = (phase - 0.8) / 0.2;
            
            if (t < 0.7) {
                // Violent inertial collapse
                let ct = t / 0.7; // 0 to 1
                radius = 5 - Math.pow(ct, 4) * 4.9; // Collapses down to 0.1 rapidly
                brightness = Math.pow(ct, 10); // Heat spikes at the very end (adiabatic compression)
                jetScale = Math.max(0.001, Math.pow(ct, 2)); // Jet begins to form
            } else {
                // Rebound and shockwave emission
                let rt = (t - 0.7) / 0.3; // 0 to 1
                radius = 0.1 + Math.sin(rt * Math.PI) * 1.5; // Small rebound bounces
                brightness = Math.max(0, 1.0 - rt * 3); // Flash fades instantly
                jetScale = Math.max(0.001, 1.0 - rt);
                shockOpacity = 1.0 - rt;
            }

            // Restore perfect sphere shape for collapse to simulate surface tension stabilization
            const positions = bubbleCore.geometry.attributes.position;
            for(let i=0; i<positions.count; i++) {
                const vec = new THREE.Vector3().fromBufferAttribute(positions, i).normalize();
                positions.setXYZ(i, vec.x*4, vec.y*4, vec.z*4);
            }
            bubbleCore.geometry.attributes.position.needsUpdate = true;
        }

        bubbleCore.scale.set(radius, radius, radius);
        
        // Sonoluminescence Glow and inner heat core dynamics
        glowLight.intensity = brightness * 1000;
        innerCore.scale.set(radius*0.5 + brightness*2, radius*0.5 + brightness*2, radius*0.5 + brightness*2);
        plasmaCoreMat.emissiveIntensity = brightness * 30;

        // Microjet piercing downward through the bubble
        microjet.scale.y = jetScale;
        microjet.position.y = 34 - (jetScale * 6);

        // Acoustic Shockwaves expanding outward through the liquid
        if (shockOpacity > 0) {
            shockwaves.forEach((sw, idx) => {
                let swScale = 1 + (1 - shockOpacity) * (idx + 1) * 20;
                sw.scale.set(swScale, swScale, swScale);
                sw.material.opacity = shockOpacity * 0.8;
            });
        } else {
            shockwaves.forEach(sw => sw.material.opacity = 0);
        }

        // Dissolved gas/radicals spinning frantically inside the core
        radicals.rotation.y = time * speed * 8;
        radicals.rotation.z = time * speed * 5;
        // Radicals concentrate tightly during collapse
        let radScale = Math.max(0.1, radius * 0.9);
        radicals.scale.set(radScale, radScale, radScale);

        // Update control panel graphs
        const graphPositions = graphLine.geometry.attributes.position;
        for(let i=0; i<50; i++) {
            let y = Math.sin(i*0.5 - time*speed*10)*2;
            // Add spike during collapse
            if (phase > 0.8 && phase < 0.95 && Math.abs(i - 25) < 5) {
                y += 5;
            }
            graphPositions.setY(i, y);
        }
        graphLine.geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCavitationBubble() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
