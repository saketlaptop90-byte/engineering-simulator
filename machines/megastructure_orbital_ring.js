import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- Custom Emissive & High-Tech Materials ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const energyField = new THREE.MeshPhysicalMaterial({ 
        color: 0x00aaff, emissive: 0x0044ff, emissiveIntensity: 0.8, 
        transparent: true, opacity: 0.3, transmission: 0.9, roughness: 0.1 
    });

    // --- Core Constants ---
    const RING_RADIUS = 400;
    const STATOR_TUBE_RADIUS = 15;
    const ROTOR_TUBE_RADIUS = 8;
    const NUM_SPACEPORTS = 8;
    const NUM_TETHERS = 16;
    const HAB_RADIUS = RING_RADIUS + 60;
    const TETHER_LENGTH = 1000;

    // ==========================================
    // 1. STATOR SHELL (Main Outer Ring)
    // ==========================================
    const statorGeom = new THREE.TorusGeometry(RING_RADIUS, STATOR_TUBE_RADIUS, 128, 512);
    const statorMesh = new THREE.Mesh(statorGeom, darkSteel);
    group.add(statorMesh);
    meshes.stator = statorMesh;
    
    parts.push({
        name: "Stator Shell",
        description: "The stationary outer casing of the orbital ring, encasing the hyper-velocity rotor and serving as the foundation for all spaceports, tethers, and habitation zones.",
        material: "darkSteel",
        function: "Provides immense structural integrity, electromagnetic confinement shielding, and physical mounting points for all ring facilities.",
        assemblyOrder: 1,
        connections: ["Rotor Core", "Spaceports", "Tethers", "Structural Ribs"],
        failureEffect: "Loss of vacuum confinement for rotor, catastrophic structural deformation, breaking of tethers.",
        cascadeFailures: ["Rotor Core", "All Tethers"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // ==========================================
    // 1B. STRUCTURAL RIBS (TorusKnot wrapped around stator)
    // ==========================================
    // Creates a complex interlacing support structure around the main ring
    const ribGeom = new THREE.TorusKnotGeometry(RING_RADIUS, STATOR_TUBE_RADIUS + 0.5, 512, 16, 128, 1);
    const ribMesh = new THREE.Mesh(ribGeom, steel);
    group.add(ribMesh);

    parts.push({
        name: "Interlaced Structural Ribs",
        description: "A continuous, interlocking web of advanced diamond-titanium alloy reinforcing the stator against extreme centrifugal and tidal stresses.",
        material: "steel",
        function: "Distributes kinetic and acoustic stress evenly across the entire circumference of the megastructure.",
        assemblyOrder: 2,
        connections: ["Stator Shell"],
        failureEffect: "Localized stress fractures in the Stator Shell leading to vacuum breach.",
        cascadeFailures: ["Stator Shell"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 100, z: 0}
    });

    // ==========================================
    // 2. INNER ROTOR (Hyper-Velocity Magnetic Mass)
    // ==========================================
    // Slightly protruding through gaps or visible in wireframe conceptualization
    const rotorGeom = new THREE.TorusGeometry(RING_RADIUS, ROTOR_TUBE_RADIUS, 64, 512);
    const rotorMesh = new THREE.Mesh(rotorGeom, neonBlue);
    // Let's make it slightly scale pulsating in animation
    group.add(rotorMesh);
    meshes.rotor = rotorMesh;

    parts.push({
        name: "Hyper-Velocity Rotor Core",
        description: "A continuous ring of superconductive iron-alloy mass rotating at speeds exceeding orbital velocity. It supports the stator dynamically via centrifugal force.",
        material: "neonBlue",
        function: "Counteracts the planet's gravity to keep the massive structure suspended dynamically, rather than purely orbiting.",
        assemblyOrder: 3,
        connections: ["Stator Shell", "Magnetic Confinement Coils"],
        failureEffect: "Instant loss of levitation, causing the entire ring megastructure to collapse gravitationally onto the planet.",
        cascadeFailures: ["Stator Shell", "Spaceports", "Tethers"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -80, z: 0}
    });

    // ==========================================
    // 3. MAGNETIC CONFINEMENT COILS
    // ==========================================
    const coilsGroup = new THREE.Group();
    const coilGeom = new THREE.TorusGeometry(STATOR_TUBE_RADIUS + 2.5, 2.0, 32, 64);
    meshes.coils = [];
    for(let i=0; i<360; i+=1.5) {
        const coil = new THREE.Mesh(coilGeom, copper);
        coil.rotation.x = Math.PI / 2;
        coil.rotation.y = (i * Math.PI) / 180;
        coil.position.x = Math.cos((i * Math.PI) / 180) * RING_RADIUS;
        coil.position.z = Math.sin((i * Math.PI) / 180) * RING_RADIUS;
        coilsGroup.add(coil);
        meshes.coils.push(coil);
    }
    group.add(coilsGroup);

    parts.push({
        name: "Superconducting Confinement Coils",
        description: "Massive copper-graphene hybrid coils wrapping around the stator. They generate the intensely powerful magnetic fields required to levitate and accelerate the hyper-velocity rotor.",
        material: "copper",
        function: "Maintains the vacuum gap between the stator and the rotor, preventing physical contact at high speeds.",
        assemblyOrder: 4,
        connections: ["Stator Shell", "Rotor Core", "Power Distribution Grid"],
        failureEffect: "Rotor touches the stator, creating immense friction, vaporizing the ring sector in seconds.",
        cascadeFailures: ["Stator Shell", "Rotor Core"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // ==========================================
    // 4. EQUATORIAL SPACEPORTS
    // ==========================================
    const spaceportsGroup = new THREE.Group();
    meshes.radars = [];
    meshes.docks = [];
    meshes.cargoContainers = [];
    
    // Extrude geometry for the main hub base
    const hubShape = new THREE.Shape();
    hubShape.moveTo(0, 30);
    hubShape.lineTo(30, 10);
    hubShape.lineTo(20, -20);
    hubShape.lineTo(-20, -20);
    hubShape.lineTo(-30, 10);
    hubShape.lineTo(0, 30);
    
    const hubExtrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const hubGeom = new THREE.ExtrudeGeometry(hubShape, hubExtrudeSettings);
    hubGeom.center();

    for(let i=0; i<NUM_SPACEPORTS; i++) {
        const angle = (i / NUM_SPACEPORTS) * Math.PI * 2;
        const portGroup = new THREE.Group();
        
        // 4A. Main Hub Base
        const hub = new THREE.Mesh(hubGeom, aluminum);
        hub.rotation.x = Math.PI/2;
        portGroup.add(hub);

        // 4B. Control Tower (Complex Lathe)
        const towerPoints = [];
        for ( let j = 0; j <= 20; j ++ ) {
            const h = j * 3;
            const w = 8 + Math.sin(j * 0.5) * 2 - (j * 0.2);
            towerPoints.push( new THREE.Vector2( w, h ) );
        }
        const towerGeom = new THREE.LatheGeometry(towerPoints, 32);
        const tower = new THREE.Mesh(towerGeom, steel);
        tower.position.y = 15;
        portGroup.add(tower);

        // 4C. Control Tower Observation Deck
        const deckPoints = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(12, 4),
            new THREE.Vector2(16, 10),
            new THREE.Vector2(12, 16),
            new THREE.Vector2(0, 20)
        ];
        const deckGeom = new THREE.LatheGeometry(deckPoints, 64);
        const deck = new THREE.Mesh(deckGeom, tinted);
        deck.position.y = 75;
        portGroup.add(deck);

        // 4D. Radar / Sensor Dish Array
        const dishGeom = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const radarGroup = new THREE.Group();
        const radar = new THREE.Mesh(dishGeom, chrome);
        
        // Add antenna to radar
        const antennaGeom = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
        const antenna = new THREE.Mesh(antennaGeom, neonRed);
        antenna.position.y = 5;
        radarGroup.add(radar);
        radarGroup.add(antenna);

        radarGroup.position.y = 100;
        radarGroup.rotation.x = Math.PI / 4;
        portGroup.add(radarGroup);
        meshes.radars.push(radarGroup);

        // 4E. Hydraulic Docking Arms with Cargo
        for(let j=0; j<6; j++) {
            const armGroup = new THREE.Group();
            const armAngle = (j / 6) * Math.PI * 2;
            
            // Complex arm geometry
            const armPath = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(25, 10, 0),
                new THREE.Vector3(45, 0, 0)
            ]);
            const armTube = new THREE.TubeGeometry(armPath, 32, 3, 12, false);
            const armMesh = new THREE.Mesh(armTube, darkSteel);
            armMesh.rotation.y = armAngle;
            
            // Hydraulic Pistons on the arm
            const pistonGeom = new THREE.CylinderGeometry(1, 1, 20, 16);
            const piston = new THREE.Mesh(pistonGeom, chrome);
            piston.position.set(Math.cos(armAngle)*12, 5, -Math.sin(armAngle)*12);
            piston.rotation.z = Math.PI/4;
            piston.rotation.y = armAngle;
            
            // Docking Ring
            const dockRingGeom = new THREE.TorusGeometry(6, 1, 32, 64);
            const dockRing = new THREE.Mesh(dockRingGeom, neonPurple);
            dockRing.position.set(Math.cos(armAngle)*45, 0, -Math.sin(armAngle)*45);
            dockRing.rotation.y = armAngle + Math.PI/2;

            // Animated Cargo Container moving through the dock
            const cargoGeom = new THREE.BoxGeometry(4, 4, 8);
            const cargo = new THREE.Mesh(cargoGeom, plastic);
            cargo.position.set(Math.cos(armAngle)*45, 0, -Math.sin(armAngle)*45);
            cargo.rotation.y = armAngle;
            cargo.userData = { 
                baseX: Math.cos(armAngle)*45, 
                baseZ: -Math.sin(armAngle)*45,
                angle: armAngle,
                phase: Math.random() * Math.PI * 2
            };
            meshes.cargoContainers.push(cargo);
            
            armGroup.add(armMesh);
            armGroup.add(piston);
            armGroup.add(dockRing);
            armGroup.add(cargo);
            portGroup.add(armGroup);
            meshes.docks.push(dockRing);
        }

        // Position the entire port on the stator
        portGroup.position.x = Math.cos(angle) * (RING_RADIUS);
        portGroup.position.y = STATOR_TUBE_RADIUS + 10; 
        portGroup.position.z = Math.sin(angle) * (RING_RADIUS);
        
        // Align port group outward
        portGroup.rotation.y = -angle;

        spaceportsGroup.add(portGroup);
    }
    group.add(spaceportsGroup);

    parts.push({
        name: "Equatorial Spaceports",
        description: "Gigantic multi-hub logistics centers for deep space vessels to dock, load cargo, and ferry passengers down to the planet surface.",
        material: "aluminum",
        function: "Docking, cargo transfer, control tower operations, and zero-G manufacturing hosting.",
        assemblyOrder: 5,
        connections: ["Stator Shell", "Tether Terminals", "Mag-Lev Train Network"],
        failureEffect: "Inability to launch or receive interstellar craft, stranding billions of tons of cargo.",
        cascadeFailures: ["Tether Terminals"],
        originalPosition: {x: 0, y: STATOR_TUBE_RADIUS + 10, z: RING_RADIUS},
        explodedPosition: {x: 0, y: 250, z: RING_RADIUS + 100}
    });

    parts.push({
        name: "Observation & Control Decks",
        description: "Heavily shielded command centers with tinted glass, housing automated AI systems and organic overseers.",
        material: "tinted",
        function: "Monitors ring structural integrity, rotor speed, magnetic field stability, and incoming spacecraft.",
        assemblyOrder: 6,
        connections: ["Equatorial Spaceports"],
        failureEffect: "Loss of local operational control, requiring manual overrides from ground control.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: STATOR_TUBE_RADIUS + 85, z: RING_RADIUS},
        explodedPosition: {x: 0, y: 350, z: RING_RADIUS + 100}
    });

    parts.push({
        name: "Hydraulic Docking Umbilicals",
        description: "Massive articulated arms fitted with high-pressure hydraulic pistons and plasma-sealed docking rings.",
        material: "darkSteel",
        function: "Securely attaches to multi-megaton interstellar freighters for cargo and personnel transfer.",
        assemblyOrder: 7,
        connections: ["Equatorial Spaceports", "Cargo Containment Grid"],
        failureEffect: "Spacecraft detachment during transfer, venting cargo and atmosphere into the void.",
        cascadeFailures: [],
        originalPosition: {x: 45, y: STATOR_TUBE_RADIUS + 10, z: RING_RADIUS},
        explodedPosition: {x: 100, y: 200, z: RING_RADIUS + 50}
    });

    // ==========================================
    // 5. TETHERS TO GROUND (Space Elevators)
    // ==========================================
    const tethersGroup = new THREE.Group();
    meshes.elevators = [];
    
    // Complex tether geometry (bundled cables)
    const tetherGeom = new THREE.CylinderGeometry(4, 6, TETHER_LENGTH, 32);
    const tetherWireGeom = new THREE.CylinderGeometry(0.5, 0.5, TETHER_LENGTH, 8);
    
    for(let i=0; i<NUM_TETHERS; i++) {
        const angle = (i / NUM_TETHERS) * Math.PI * 2;
        const tetherGroup = new THREE.Group();

        // Main Core Cable
        const tetherMesh = new THREE.Mesh(tetherGeom, steel);
        tetherMesh.position.y = -TETHER_LENGTH / 2;
        tetherGroup.add(tetherMesh);

        // Outer bundled wires wrapped around
        for(let w=0; w<6; w++) {
            const wAngle = (w/6) * Math.PI*2;
            const wire = new THREE.Mesh(tetherWireGeom, copper);
            wire.position.set(Math.cos(wAngle)*5, -TETHER_LENGTH/2, Math.sin(wAngle)*5);
            tetherGroup.add(wire);
        }

        // Tether Attachment Base on Stator
        const baseGeom = new THREE.CylinderGeometry(16, 24, 20, 32);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        base.position.y = -STATOR_TUBE_RADIUS - 10;
        
        // Add glowing ring to base
        const baseGlowGeom = new THREE.TorusGeometry(18, 1, 16, 64);
        const baseGlow = new THREE.Mesh(baseGlowGeom, neonBlue);
        baseGlow.position.y = -STATOR_TUBE_RADIUS - 5;
        baseGlow.rotation.x = Math.PI/2;
        
        tetherGroup.add(base);
        tetherGroup.add(baseGlow);

        // Elevators / Climbers moving up and down the tether
        for(let k=0; k<4; k++) {
            const climberGroup = new THREE.Group();
            
            // Climber Body
            const climberGeom = new THREE.CapsuleGeometry(6, 15, 32, 32);
            const climber = new THREE.Mesh(climberGeom, chrome);
            
            // Climber Windows/Details
            const windowGeom = new THREE.CylinderGeometry(6.2, 6.2, 4, 32);
            const window = new THREE.Mesh(windowGeom, tinted);
            
            // Climber Drive Rings
            const driveGeom = new THREE.TorusGeometry(7, 1.5, 16, 32);
            const drive1 = new THREE.Mesh(driveGeom, neonRed);
            drive1.position.y = 10;
            drive1.rotation.x = Math.PI/2;
            
            const drive2 = new THREE.Mesh(driveGeom, neonRed);
            drive2.position.y = -10;
            drive2.rotation.x = Math.PI/2;
            
            climberGroup.add(climber);
            climberGroup.add(window);
            climberGroup.add(drive1);
            climberGroup.add(drive2);

            climberGroup.position.y = - (Math.random() * TETHER_LENGTH);
            
            // Animation data
            climberGroup.userData = { 
                offset: Math.random() * Math.PI * 2, 
                speed: 0.1 + Math.random()*0.2, 
                yStart: -TETHER_LENGTH + 50, 
                yRange: TETHER_LENGTH - 100 
            };
            
            tetherGroup.add(climberGroup);
            meshes.elevators.push(climberGroup);
        }

        tetherGroup.position.x = Math.cos(angle) * (RING_RADIUS);
        tetherGroup.position.z = Math.sin(angle) * (RING_RADIUS);
        
        tethersGroup.add(tetherGroup);
    }
    group.add(tethersGroup);

    parts.push({
        name: "Carbon-Nanotube Tethers",
        description: "Immensely strong bundled tethers extending from the orbital ring down to the planetary surface, anchoring the ring and providing elevator tracks.",
        material: "steel",
        function: "Anchors the ring, transfers momentum to the planet, and acts as the track for super-heavy space elevators.",
        assemblyOrder: 8,
        connections: ["Stator Shell", "Ground Anchors", "Space Elevators"],
        failureEffect: "Tether snaps, unleashing megatons of kinetic energy, whipping around the planet and causing mass devastation.",
        cascadeFailures: ["Stator Shell Structural Integrity"],
        originalPosition: {x: 0, y: -500, z: RING_RADIUS},
        explodedPosition: {x: 0, y: -600, z: RING_RADIUS + 200}
    });

    parts.push({
        name: "High-Capacity Space Elevators (Climbers)",
        description: "Capsule-shaped aerodynamic heavy-lift vehicles that traverse the tethers using electromagnetic induction motors.",
        material: "chrome",
        function: "Transports raw materials, manufactured goods, and passengers between the surface and the orbital ring.",
        assemblyOrder: 9,
        connections: ["Carbon-Nanotube Tethers", "Equatorial Spaceports"],
        failureEffect: "Elevator falls back to the planet or gets stuck, bottlenecking planetary logistics.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -250, z: RING_RADIUS},
        explodedPosition: {x: 80, y: -250, z: RING_RADIUS + 80}
    });

    // ==========================================
    // 6. HABITATION RINGS & BIO-DOMES
    // ==========================================
    // A secondary immense ring orbiting just outside the stator, spinning for gravity
    const habRingGeom = new THREE.TorusGeometry(HAB_RADIUS, 8, 64, 512);
    const habRing = new THREE.Mesh(habRingGeom, steel);
    
    // Add Bio-Domes along the hab ring
    const domeGeom = new THREE.SphereGeometry(12, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
    for(let d=0; d<24; d++) {
        const dAngle = (d/24) * Math.PI*2;
        const dome = new THREE.Mesh(domeGeom, glass);
        dome.position.set(Math.cos(dAngle)*HAB_RADIUS, 6, Math.sin(dAngle)*HAB_RADIUS);
        
        // Inner glowing city center
        const cityGeom = new THREE.BoxGeometry(6, 4, 6);
        const city = new THREE.Mesh(cityGeom, neonGreen);
        city.position.set(Math.cos(dAngle)*HAB_RADIUS, 2, Math.sin(dAngle)*HAB_RADIUS);
        
        habRing.add(dome);
        habRing.add(city);
    }
    
    group.add(habRing);
    meshes.habRing = habRing;

    // Struts connecting Stator to Hab Ring
    const strutsGroup = new THREE.Group();
    for(let i=0; i<128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        // Complex strut
        const strutGeom = new THREE.CylinderGeometry(1.5, 1.5, 60, 16);
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        
        strut.position.x = Math.cos(angle) * (RING_RADIUS + 30);
        strut.position.z = Math.sin(angle) * (RING_RADIUS + 30);
        strut.rotation.x = Math.PI/2;
        strut.rotation.z = -angle;

        // Add a shock absorber piston detail
        const shockGeom = new THREE.CylinderGeometry(2.5, 2.5, 20, 16);
        const shock = new THREE.Mesh(shockGeom, chrome);
        shock.position.copy(strut.position);
        shock.rotation.copy(strut.rotation);
        
        strutsGroup.add(strut);
        strutsGroup.add(shock);
    }
    group.add(strutsGroup);

    parts.push({
        name: "Outer Habitation Centrifuge",
        description: "A colossal continuous toroidal structure floating parallel to the main ring, spinning to provide simulated gravity for permanent residents.",
        material: "steel",
        function: "Residential zones, commercial districts, and recreational bioscapes inside vast glass domes for millions of citizens.",
        assemblyOrder: 10,
        connections: ["Radial Struts", "Life Support Systems"],
        failureEffect: "Loss of life support or artificial gravity, resulting in massive casualties.",
        cascadeFailures: ["Life Support Systems"],
        originalPosition: {x: 0, y: 0, z: HAB_RADIUS},
        explodedPosition: {x: 0, y: -150, z: HAB_RADIUS + 100}
    });

    parts.push({
        name: "Radial Shock-Absorbing Struts",
        description: "Thick cylindrical pylons connecting the Habitation Ring to the main Stator, fitted with chrome hydraulic shock absorbers.",
        material: "darkSteel",
        function: "Structural linkage and vibration damping, isolating delicate habitation zones from the hyper-velocity rotor's acoustic resonance.",
        assemblyOrder: 11,
        connections: ["Stator Shell", "Outer Habitation Centrifuge"],
        failureEffect: "Severe micro-fractures in the Habitation Centrifuge due to intense acoustic and kinetic resonance.",
        cascadeFailures: ["Outer Habitation Centrifuge"],
        originalPosition: {x: 0, y: 0, z: RING_RADIUS + 30},
        explodedPosition: {x: 0, y: -75, z: RING_RADIUS + 60}
    });

    // ==========================================
    // 7. SOLAR RADIATOR WINGS
    // ==========================================
    const radiatorGroup = new THREE.Group();
    const radShape = new THREE.Shape();
    radShape.moveTo(0, 0);
    radShape.lineTo(40, 15);
    radShape.lineTo(120, 15);
    radShape.lineTo(160, 0);
    radShape.lineTo(120, -15);
    radShape.lineTo(40, -15);
    radShape.lineTo(0, 0);

    const radExtrude = { depth: 2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const radGeom = new THREE.ExtrudeGeometry(radShape, radExtrude);
    radGeom.center();
    
    // Place radiators along the inner radius to dump heat
    meshes.radiators = [];
    for(let i=0; i<48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const radGroup = new THREE.Group();
        
        const rad = new THREE.Mesh(radGeom, copper); 
        
        // Add glowing coolant lines on the radiator
        const lineGeom = new THREE.BoxGeometry(140, 2, 3);
        const line = new THREE.Mesh(lineGeom, neonBlue);
        
        radGroup.add(rad);
        radGroup.add(line);

        radGroup.position.x = Math.cos(angle) * (RING_RADIUS - 60);
        radGroup.position.z = Math.sin(angle) * (RING_RADIUS - 60);
        radGroup.rotation.y = -angle + Math.PI/2;
        
        radiatorGroup.add(radGroup);
        meshes.radiators.push(radGroup);
    }
    group.add(radiatorGroup);

    parts.push({
        name: "Thermodynamic Radiator Fins",
        description: "Gigantic hexagonal extrusions composed of graphene-copper composite, designed to radiate the immense heat generated by magnetic confinement coils into deep space.",
        material: "copper",
        function: "Thermal regulation. Prevents the superconducting coils from exceeding critical temperature thresholds.",
        assemblyOrder: 12,
        connections: ["Coolant Loops", "Stator Shell"],
        failureEffect: "Coils lose superconductivity, rotor crashes into the stator, catastrophic annihilation of the ring.",
        cascadeFailures: ["Superconducting Confinement Coils", "Hyper-Velocity Rotor Core"],
        originalPosition: {x: 0, y: 0, z: RING_RADIUS - 60},
        explodedPosition: {x: 0, y: -150, z: RING_RADIUS - 120}
    });

    // ==========================================
    // 8. HIGH-SPEED MAG-LEV TRANSIT TUBES
    // ==========================================
    const transitGroup = new THREE.Group();
    // 3 Parallel transparent tubes
    for(let t=0; t<3; t++) {
        const offset = (t-1) * 6;
        const transitTubeGeom = new THREE.TorusGeometry(RING_RADIUS + offset, 2.5, 32, 512);
        const transitTube = new THREE.Mesh(transitTubeGeom, glass);
        transitTube.position.y = STATOR_TUBE_RADIUS + 3.5;
        transitGroup.add(transitTube);
    }
    group.add(transitGroup);

    // Transit Pods inside the tube
    const podsGroup = new THREE.Group();
    meshes.pods = [];
    const podGeom = new THREE.CapsuleGeometry(1.5, 8, 32, 32);
    for(let i=0; i<60; i++) {
        const pod = new THREE.Mesh(podGeom, neonGreen);
        pod.rotation.x = Math.PI / 2; // lie flat
        
        const tubeIndex = i % 3;
        const offset = (tubeIndex - 1) * 6;

        pod.userData = { 
            angle: (i / 60) * Math.PI * 2, 
            speed: 0.08 + Math.random() * 0.04,
            radius: RING_RADIUS + offset,
            direction: tubeIndex === 1 ? -1 : 1 // Middle tube goes opposite direction
        };
        
        podsGroup.add(pod);
        meshes.pods.push(pod);
    }
    podsGroup.position.y = STATOR_TUBE_RADIUS + 3.5;
    group.add(podsGroup);

    parts.push({
        name: "Vacuum Transit Tubes",
        description: "Transparent reinforced glass-steel alloy tubes running along the circumference of the ring, maintaining a perfect vacuum for zero-drag transport.",
        material: "glass",
        function: "Provides a frictionless environment for high-speed mag-lev commuter pods.",
        assemblyOrder: 13,
        connections: ["Stator Shell", "Transit Hubs"],
        failureEffect: "Decompression of the tube, massive aerodynamic drag destroying transit pods instantly.",
        cascadeFailures: ["Mag-Lev Transit Pods"],
        originalPosition: {x: 0, y: STATOR_TUBE_RADIUS + 3.5, z: RING_RADIUS},
        explodedPosition: {x: 0, y: STATOR_TUBE_RADIUS + 120, z: RING_RADIUS + 20}
    });

    parts.push({
        name: "Mag-Lev Transit Pods",
        description: "Aerodynamic pressurized capsules driven by linear induction motors, reaching speeds of Mach 20 relative to the stator.",
        material: "neonGreen",
        function: "Rapid transit of personnel and sensitive cargo across the entire circumference of the orbital ring.",
        assemblyOrder: 14,
        connections: ["Vacuum Transit Tubes"],
        failureEffect: "Pod crashes, potentially breaching the transit tube and halting all ring commuter traffic.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: STATOR_TUBE_RADIUS + 3.5, z: RING_RADIUS},
        explodedPosition: {x: 0, y: STATOR_TUBE_RADIUS + 150, z: RING_RADIUS + 50}
    });

    // ==========================================
    // 9. PLANETARY SHIELD GENERATORS
    // ==========================================
    const shieldGenGroup = new THREE.Group();
    meshes.shieldRotors = [];
    meshes.shieldPulses = [];
    
    for(let i=0; i<NUM_SPACEPORTS; i++) {
        const angle = ((i + 0.5) / NUM_SPACEPORTS) * Math.PI * 2; // Offset from spaceports
        
        const genBodyGeom = new THREE.CylinderGeometry(12, 4, 30, 16);
        const genBody = new THREE.Mesh(genBodyGeom, darkSteel);
        
        const genRotorGeom = new THREE.TorusGeometry(18, 2, 32, 128);
        const genRotor = new THREE.Mesh(genRotorGeom, neonBlue);
        genRotor.rotation.x = Math.PI/2;
        
        const genCoreGeom = new THREE.SphereGeometry(6, 32, 32);
        const genCore = new THREE.Mesh(genCoreGeom, energyField);
        
        genBody.add(genRotor);
        genBody.add(genCore);
        
        // Add downward emitting laser/plasma stream
        const streamGeom = new THREE.CylinderGeometry(1, 10, 100, 32);
        const stream = new THREE.Mesh(streamGeom, energyField);
        stream.position.y = -50;
        genBody.add(stream);
        meshes.shieldPulses.push(stream);

        genBody.position.x = Math.cos(angle) * (RING_RADIUS);
        genBody.position.y = -STATOR_TUBE_RADIUS - 30;
        genBody.position.z = Math.sin(angle) * (RING_RADIUS);
        
        shieldGenGroup.add(genBody);
        meshes.shieldRotors.push(genRotor);
    }
    group.add(shieldGenGroup);

    parts.push({
        name: "Planetary Shield Projectors",
        description: "Massive downward-facing emitters that generate a magnetohydrodynamic deflector shield around the planet below.",
        material: "darkSteel",
        function: "Deflects micrometeorites, solar flares, and kinetic strikes away from the planet and the ring.",
        assemblyOrder: 15,
        connections: ["Stator Shell", "Power Grid"],
        failureEffect: "Planet exposed to solar radiation storms and orbital debris, endangering surface life.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -STATOR_TUBE_RADIUS - 30, z: RING_RADIUS},
        explodedPosition: {x: 0, y: -STATOR_TUBE_RADIUS - 200, z: RING_RADIUS}
    });

    parts.push({
        name: "Shield Generator Spinning Rotors",
        description: "Super-cooled glowing toroidal components that focus the plasma fields into a continuous deflector grid.",
        material: "neonBlue",
        function: "Focuses and modulates the energy shield's frequency to intercept varying threats.",
        assemblyOrder: 16,
        connections: ["Planetary Shield Projectors"],
        failureEffect: "Shield becomes unstable and localized gaps appear in the planetary deflector grid.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: -STATOR_TUBE_RADIUS - 30, z: RING_RADIUS},
        explodedPosition: {x: 0, y: -STATOR_TUBE_RADIUS - 250, z: RING_RADIUS}
    });

    // ==========================================
    // 10. ENERGY CONDUITS / PIPING
    // ==========================================
    const conduitGroup = new THREE.Group();
    meshes.conduitPulses = [];
    for(let j=0; j<5; j++) { 
        const conduitRadius = RING_RADIUS + (j - 2) * 3;
        const conduitGeom = new THREE.TorusGeometry(conduitRadius, 0.8, 16, 512);
        const conduit = new THREE.Mesh(conduitGeom, steel);
        conduit.position.y = STATOR_TUBE_RADIUS - 3;
        
        const pulseGeom = new THREE.SphereGeometry(1.2, 16, 16);
        for(let k=0; k<15; k++) {
            const pulse = new THREE.Mesh(pulseGeom, neonRed);
            pulse.userData = { 
                angle: (k / 15) * Math.PI * 2, 
                speed: 0.15 + Math.random()*0.05,
                radius: conduitRadius
            };
            conduitGroup.add(pulse);
            meshes.conduitPulses.push(pulse);
        }
        
        conduitGroup.add(conduit);
    }
    group.add(conduitGroup);

    parts.push({
        name: "Main Power Conduits",
        description: "Heavy-duty cryogenic pipelines wrapping the ring, carrying liquid helium and extreme-voltage power to all sectors.",
        material: "steel",
        function: "Distributes energy from the planetary core taps and orbital solar arrays across the entire megastructure.",
        assemblyOrder: 17,
        connections: ["Stator Shell", "Superconducting Confinement Coils", "Equatorial Spaceports"],
        failureEffect: "Sector-wide power blackout. Local confinement coils fail, leading to imminent structural collapse.",
        cascadeFailures: ["Superconducting Confinement Coils", "Outer Habitation Centrifuge"],
        originalPosition: {x: 0, y: STATOR_TUBE_RADIUS - 3, z: RING_RADIUS},
        explodedPosition: {x: 0, y: STATOR_TUBE_RADIUS + 60, z: RING_RADIUS + 30}
    });

    // ==========================================
    // DESCRIPTION & QUIZ QUESTIONS
    // ==========================================
    const description = "The Orbital Ring is a colossal megastructure of unprecedented scale. It consists of a stationary outer shell (stator) suspended in space by the immense centrifugal force of a hyper-velocity magnetic rotor spinning within it. Tethered directly to the planetary surface, it functions as the ultimate spaceport, a continuous orbital habitation zone, and a planetary defense grid. Featuring highly complex interlocking geometries, immense hydraulic docks, mag-lev transit networks, and bio-dome centrifuge habitats, it is the pinnacle of high-tech planetary engineering.";

    const quizQuestions = [
        {
            question: "How does the Orbital Ring maintain its altitude without being in a traditional orbit?",
            options: [
                "It hangs from geostationary counterweights.",
                "It uses constant thruster burns.",
                "It is supported by the centrifugal force of a hyper-velocity internal rotor.",
                "It rests on impossibly strong pillars from the ground."
            ],
            correctAnswer: 2,
            explanation: "The hyper-velocity rotor spins faster than orbital velocity, generating outward centrifugal force that supports the stationary stator shell dynamically."
        },
        {
            question: "What is the primary function of the Superconducting Confinement Coils?",
            options: [
                "To generate electricity for the planet.",
                "To maintain the vacuum gap between the stator and the hyper-velocity rotor.",
                "To power the mag-lev transit pods.",
                "To deflect solar radiation."
            ],
            correctAnswer: 1,
            explanation: "The coils generate massive magnetic fields that levitate the rotor, preventing catastrophic physical friction with the stator."
        },
        {
            question: "Why are Thermodynamic Radiator Fins necessary for this megastructure?",
            options: [
                "To collect solar energy.",
                "To cool the outer hull during atmospheric entry.",
                "To radiate immense heat generated by the confinement coils into space.",
                "To act as aerodynamic stabilizers."
            ],
            correctAnswer: 2,
            explanation: "The superconducting coils and hyper-velocity friction generate immense heat, which must be constantly dumped into space by the radiator fins to prevent critical failure."
        },
        {
            question: "What devastating effect would occur if a Carbon-Nanotube Tether snapped?",
            options: [
                "The ring would immediately fly off into deep space.",
                "Megatons of kinetic energy would be unleashed, whipping around the planet and causing mass devastation.",
                "Only the elevator pods would be lost.",
                "The planetary shield would instantly deactivate."
            ],
            correctAnswer: 1,
            explanation: "Tethers hold immense tension. Snapping one would release that stored energy, causing the massive cable to whip through the atmosphere, devastating the surface below."
        },
        {
            question: "What is the purpose of the Outer Habitation Centrifuge?",
            options: [
                "To store extra fuel for outgoing spaceships.",
                "To balance the mass of the equatorial spaceports.",
                "To spin and provide simulated gravity for millions of permanent residents.",
                "To generate a planetary deflector shield."
            ],
            correctAnswer: 2,
            explanation: "Since the main stator is stationary relative to the tethers (and in zero/micro gravity), the Habitation Centrifuge spins to create artificial gravity for its residents."
        },
        {
            question: "What role do the Planetary Shield Projectors play?",
            options: [
                "They generate oxygen for the bio-domes.",
                "They emit a magnetohydrodynamic deflector shield to protect the planet from meteors and solar flares.",
                "They provide thrust to adjust the ring's orbit.",
                "They communicate with deep space vessels."
            ],
            correctAnswer: 1,
            explanation: "The downward-facing emitters create an immense energy field that acts as a planetary deflector grid against spatial hazards."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // 1. Rotor Pulse (Conceptual hyper-velocity)
        if(meshes.rotor) {
            meshes.rotor.rotation.y += 0.5 * speed;
            const pulse = (Math.sin(time * 10 * speed) + 1) / 2; // 0 to 1
            meshes.rotor.material.emissiveIntensity = 2.0 + pulse;
        }

        // 2. Confinement Coils Sequence
        if(meshes.coils && meshes.coils.length > 0) {
            const coilPacing = (time * 20 * speed) % meshes.coils.length;
            for(let i=0; i<meshes.coils.length; i++) {
                const dist = Math.abs(i - coilPacing);
                if(dist < 8 || (meshes.coils.length - dist) < 8) {
                    meshes.coils[i].scale.set(1.15, 1.15, 1.15);
                    meshes.coils[i].material.emissiveIntensity = 2.5;
                } else {
                    meshes.coils[i].scale.set(1.0, 1.0, 1.0);
                    meshes.coils[i].material.emissiveIntensity = 0.2;
                }
            }
        }

        // 3. Radar Dishes
        if(meshes.radars) {
            meshes.radars.forEach(radar => {
                radar.rotation.z += 0.02 * speed;
                radar.rotation.y += 0.01 * speed;
            });
        }

        // 4. Hydraulic Docking Rings & Cargo
        if(meshes.docks) {
            meshes.docks.forEach(dock => {
                dock.rotation.x += 0.08 * speed;
            });
        }
        if(meshes.cargoContainers) {
            meshes.cargoContainers.forEach(cargo => {
                const data = cargo.userData;
                data.phase += 0.05 * speed;
                // Move back and forth through the docking ring
                const offset = Math.sin(data.phase) * 15;
                cargo.position.x = data.baseX + Math.cos(data.angle)*offset;
                cargo.position.z = data.baseZ - Math.sin(data.angle)*offset;
            });
        }

        // 5. Space Elevators on Tethers
        if(meshes.elevators) {
            meshes.elevators.forEach(elevator => {
                const data = elevator.userData;
                const cycle = Math.sin((time * data.speed * speed) + data.offset);
                const normalized = (cycle + 1) / 2; // 0 to 1
                elevator.position.y = data.yStart + (normalized * data.yRange);
            });
        }

        // 6. Habitation Centrifuge
        if(meshes.habRing) {
            meshes.habRing.rotation.y += 0.008 * speed;
        }

        // 7. Mag-Lev Transit Pods
        if(meshes.pods) {
            meshes.pods.forEach(pod => {
                const data = pod.userData;
                data.angle += data.speed * speed * data.direction;
                pod.position.x = Math.cos(data.angle) * data.radius;
                pod.position.z = Math.sin(data.angle) * data.radius;
                pod.rotation.z = -data.angle + (data.direction === -1 ? Math.PI : 0);
            });
        }

        // 8. Planetary Shield Projectors
        if(meshes.shieldRotors) {
            meshes.shieldRotors.forEach(rotor => {
                rotor.rotation.z += 0.15 * speed;
            });
        }
        if(meshes.shieldPulses) {
            meshes.shieldPulses.forEach(pulse => {
                // Modulate opacity for plasma stream effect
                pulse.material.opacity = 0.2 + (Math.sin(time * 15 * speed) + 1) * 0.2;
            });
        }

        // 9. Energy Conduits
        if(meshes.conduitPulses) {
            meshes.conduitPulses.forEach(pulse => {
                const data = pulse.userData;
                data.angle += data.speed * speed;
                pulse.position.x = Math.cos(data.angle) * data.radius;
                pulse.position.z = Math.sin(data.angle) * data.radius;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
