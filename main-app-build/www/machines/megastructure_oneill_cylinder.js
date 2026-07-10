import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- ENHANCED MATERIALS ---
    const hullMaterial = darkSteel.clone();
    hullMaterial.metalness = 0.8;
    hullMaterial.roughness = 0.4;
    
    const terrainMaterial = copper.clone();
    terrainMaterial.color = new THREE.Color(0x2d4c1e); // Dark pseudo-vegetation / synthetic terrain
    terrainMaterial.roughness = 0.9;
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9
    });

    const glowingWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 3.0
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const windowMaterial = glass.clone();
    windowMaterial.transparent = true;
    windowMaterial.opacity = 0.2;
    windowMaterial.color = new THREE.Color(0xaaddff);
    windowMaterial.side = THREE.DoubleSide;

    const structuralMaterial = steel.clone();
    structuralMaterial.roughness = 0.3;
    structuralMaterial.metalness = 0.9;

    const goldFoil = copper.clone();
    goldFoil.color = new THREE.Color(0xffd700);
    goldFoil.metalness = 1.0;
    goldFoil.roughness = 0.1;

    // --- DIMENSIONS ---
    const R = 150; // Cylinder radius
    const H = 600; // Cylinder height
    const HUB_R = 10; // Central hub radius
    
    // --- COMPONENT GROUPS ---
    const cylinderAssembly = new THREE.Group();
    const mirrorsAssembly = new THREE.Group();
    const hubAssembly = new THREE.Group();
    const innerCityAssembly = new THREE.Group();
    const atmosphereAssembly = new THREE.Group();
    
    group.add(cylinderAssembly);
    group.add(mirrorsAssembly);
    group.add(hubAssembly);
    cylinderAssembly.add(innerCityAssembly);
    cylinderAssembly.add(atmosphereAssembly);

    // --- PART 1: THE PRIMARY HULL & TERRAIN STRIPS ---
    // Instead of one solid cylinder, an O'Neill cylinder has alternating strips of land and window.
    // We'll use 3 land strips and 3 window strips (60 degrees each).
    const hullGeometry = new THREE.CylinderGeometry(R, R, H, 64, 10, true, 0, Math.PI / 3);
    const windowGeometry = new THREE.CylinderGeometry(R, R, H, 64, 1, true, 0, Math.PI / 3);
    
    const landStrips = new THREE.Group();
    const windowStrips = new THREE.Group();

    for (let i = 0; i < 3; i++) {
        const angle = i * (Math.PI * 2) / 3;
        
        // Land Strip
        const land = new THREE.Mesh(hullGeometry, hullMaterial);
        land.rotation.y = angle;
        landStrips.add(land);
        
        // Inner Terrain (slightly smaller radius)
        const innerTerrainGeo = new THREE.CylinderGeometry(R - 2, R - 2, H, 32, 10, true, 0, Math.PI / 3);
        const innerTerrain = new THREE.Mesh(innerTerrainGeo, terrainMaterial);
        innerTerrain.rotation.y = angle;
        innerCityAssembly.add(innerTerrain);
        
        // Window Strip
        const win = new THREE.Mesh(windowGeometry, windowMaterial);
        win.rotation.y = angle + (Math.PI / 3);
        windowStrips.add(win);
    }
    
    cylinderAssembly.add(landStrips);
    cylinderAssembly.add(windowStrips);
    cylinderAssembly.rotation.x = Math.PI / 2; // Orient along Z axis

    parts.push({
        name: "Primary Habitat Shell",
        description: "Massive carbon-nanotube reinforced cylindrical hull with alternating terrain and window strips.",
        material: "Dark Steel / Glass",
        function: "Provides structural integrity and contains the artificial atmosphere under high centripetal forces.",
        assemblyOrder: 1,
        connections: ["Zero-G Hub", "Exterior Ribs", "Solar Mirrors"],
        failureEffect: "Catastrophic decompression and loss of habitat spin.",
        cascadeFailures: ["Atmosphere loss", "Biological extinction event"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -200 }
    });

    // --- PART 2: STRUCTURAL RIBS & EXTERIOR GREEBLES ---
    // Hyper-complex exterior framing
    const ribGroup = new THREE.Group();
    const numRibs = 12;
    for(let i=0; i <= numRibs; i++) {
        const yPos = -H/2 + (H/numRibs)*i;
        // Main circular rib
        const ribGeo = new THREE.TorusGeometry(R + 3, 2, 16, 64);
        const rib = new THREE.Mesh(ribGeo, structuralMaterial);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = yPos;
        ribGroup.add(rib);

        // Add extreme detailing (lugs/nodes) around the rib
        const numNodes = 24;
        for(let j=0; j<numNodes; j++) {
            const nodeAngle = (j / numNodes) * Math.PI * 2;
            const nodeGeo = new THREE.BoxGeometry(6, 6, 8);
            const node = new THREE.Mesh(nodeGeo, darkSteel);
            node.position.set(Math.cos(nodeAngle) * (R + 4), yPos, Math.sin(nodeAngle) * (R + 4));
            node.lookAt(0, yPos, 0);
            ribGroup.add(node);
        }
    }
    cylinderAssembly.add(ribGroup);

    parts.push({
        name: "Exterior Toroidal Rib Framework",
        description: "Heavy steel framing wrapping the primary shell to resist the immense outward pressure of the spin-gravity.",
        material: "Structural Steel",
        function: "Prevents longitudinal and radial shear forces from tearing the cylinder apart.",
        assemblyOrder: 2,
        connections: ["Primary Habitat Shell", "Attitude Thrusters"],
        failureEffect: "Hull deformation, micro-fractures in glass panels.",
        cascadeFailures: ["Window blowout", "Pressure loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --- PART 3: ZERO-G HUB (CENTRAL SPINE) ---
    const hubGeo = new THREE.CylinderGeometry(HUB_R, HUB_R, H + 100, 32);
    const hub = new THREE.Mesh(hubGeo, aluminum);
    hub.rotation.x = Math.PI / 2;
    hubAssembly.add(hub);
    
    // Add glowing plasma core inside the hub
    const plasmaCoreGeo = new THREE.CylinderGeometry(HUB_R - 2, HUB_R - 2, H + 100, 16);
    const plasmaCore = new THREE.Mesh(plasmaCoreGeo, plasmaMaterial);
    plasmaCore.rotation.x = Math.PI / 2;
    hubAssembly.add(plasmaCore);

    parts.push({
        name: "Central Zero-G Hub",
        description: "The non-rotating central axis running the entire length of the structure, containing power lines and zero-g industry.",
        material: "Aluminum / Plasma",
        function: "Serves as the main transport artery, docking interface, and artificial sun projector.",
        assemblyOrder: 3,
        connections: ["Elevator Spokes", "Solar Mirrors"],
        failureEffect: "Complete loss of power and illumination.",
        cascadeFailures: ["Habitat freezing", "Ecosystem collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    // --- PART 4: ELEVATOR SPOKES ---
    // Connect the hub to the inner terrain
    const spokeGroup = new THREE.Group();
    const numSpokeSets = 4;
    for (let k = 0; k < numSpokeSets; k++) {
        const yPos = -H/3 + k * (H/1.5);
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3 + (Math.PI/6); // Align with land strips
            
            // Complex spoke structure
            const spokeGeo = new THREE.CylinderGeometry(3, 5, R - HUB_R, 16);
            const spoke = new THREE.Mesh(spokeGeo, steel);
            
            spoke.position.set(
                Math.cos(angle) * (R/2),
                yPos,
                Math.sin(angle) * (R/2)
            );
            
            // Align spoke
            spoke.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize()
            );

            spokeGroup.add(spoke);
            
            // Spoke elevator cars (glowy bits)
            const carGeo = new THREE.BoxGeometry(6, 10, 6);
            const car = new THREE.Mesh(carGeo, glowingBlue);
            car.position.copy(spoke.position);
            spokeGroup.add(car);
        }
    }
    cylinderAssembly.add(spokeGroup);

    parts.push({
        name: "Transport Elevator Spokes",
        description: "Pressurized elevator shafts connecting the zero-g hub to the 1G habitat surface.",
        material: "Steel / Glass",
        function: "Transports cargo and citizens between the docking hub and the living sectors.",
        assemblyOrder: 4,
        connections: ["Zero-G Hub", "Primary Habitat Shell"],
        failureEffect: "Isolation of habitat sectors from the docking ring.",
        cascadeFailures: ["Supply chain disruption"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 0 }
    });

    // --- PART 5: GIANT SOLAR MIRRORS ---
    // O'Neill cylinders have 3 massive mirrors that hinge outward to reflect light inside
    const mirrorLength = H;
    const mirrorWidth = R * 1.5;
    
    for (let i = 0; i < 3; i++) {
        const angle = i * (Math.PI * 2) / 3;
        
        const mirrorPivot = new THREE.Group();
        // Pivot point at the rear of the cylinder
        mirrorPivot.position.set(
            Math.cos(angle) * HUB_R,
            0,
            H/2 // Back end
        );
        // Rotate pivot to face outward
        mirrorPivot.rotation.z = angle + Math.PI/2;
        
        // The mirror itself
        // Shape to make it look advanced rather than a simple plane
        const mirrorShape = new THREE.Shape();
        mirrorShape.moveTo(0, 0);
        mirrorShape.lineTo(mirrorLength, mirrorWidth * 0.2);
        mirrorShape.lineTo(mirrorLength, mirrorWidth * 0.8);
        mirrorShape.lineTo(0, mirrorWidth);
        mirrorShape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 2, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.5, bevelSegments: 2 };
        const mirrorGeo = new THREE.ExtrudeGeometry(mirrorShape, extrudeSettings);
        
        const mirror = new THREE.Mesh(mirrorGeo, chrome);
        
        // Position mirror relative to pivot
        mirror.rotation.x = Math.PI / 2;
        mirror.position.set(0, -mirrorWidth/2, 0);
        
        // Mirror structural backing
        const backing = new THREE.Mesh(mirrorGeo, goldFoil);
        backing.position.set(0, -mirrorWidth/2, -0.5);
        backing.rotation.x = Math.PI / 2;
        
        // Hydraulic actuator arms
        const actuatorGeo = new THREE.CylinderGeometry(2, 2, mirrorWidth, 16);
        const actuator = new THREE.Mesh(actuatorGeo, darkSteel);
        actuator.rotation.z = Math.PI / 4;
        actuator.position.set(mirrorLength/2, 0, -20);
        
        mirrorPivot.add(mirror);
        mirrorPivot.add(backing);
        mirrorPivot.add(actuator);
        
        // Angle the mirror outwards (45 degrees typical to reflect light from 90deg sun into the cylinder)
        mirrorPivot.rotation.y = -Math.PI / 4;
        
        // Add to main group, not cylinder, because mirrors don't spin with the cylinder (or they counter-spin)
        // Actually, they track the sun. We'll attach to hubAssembly which doesn't spin, or spins counter.
        hubAssembly.add(mirrorPivot);
        
        // Save references for animation
        mirrorPivot.userData = { isMirror: true, index: i };
    }

    parts.push({
        name: "Primary Solar Reflectors",
        description: "Three massive hinged mirrors, coated in hyper-reflective chrome, spanning the length of the cylinder.",
        material: "Chrome / Gold Foil",
        function: "Reflects external solar radiation through the atmospheric windows to simulate daylight and regulate temperature.",
        assemblyOrder: 5,
        connections: ["Zero-G Hub", "Mirror Actuators"],
        failureEffect: "Loss of primary illumination and dramatic drop in internal temperature.",
        cascadeFailures: ["Crop failure", "Atmospheric freezing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 0, z: 300 }
    });

    // --- PART 6: INNER CITY PROCEDURAL BUILDINGS ---
    // Generate an insane amount of tiny intricate geometries to simulate cities
    const cityGroup = new THREE.Group();
    const numBuildings = 800; // MASSIVE detail
    
    // We only place buildings on the land strips (angles: 0-60, 120-180, 240-300 degrees)
    for (let i = 0; i < numBuildings; i++) {
        // Pick a strip
        const stripIndex = Math.floor(Math.random() * 3);
        const baseAngle = stripIndex * (Math.PI * 2) / 3;
        
        // Random angle within the 60 degree strip (leaving slight margins)
        const localAngle = (Math.random() * 0.8 + 0.1) * (Math.PI / 3);
        const angle = baseAngle + localAngle;
        
        // Random Y position along cylinder
        const yPos = (Math.random() - 0.5) * (H * 0.9);
        
        // Complex building geometry (Lathe or layered cylinders)
        const bHeight = Math.random() * 15 + 5;
        const bRadius = Math.random() * 2 + 1;
        
        // High tech spires instead of cubes
        const bGeo = new THREE.ConeGeometry(bRadius, bHeight, 6);
        const bMaterial = (Math.random() > 0.8) ? glowingWhite : aluminum;
        const bMesh = new THREE.Mesh(bGeo, bMaterial);
        
        // Position on the INNER surface
        const bDist = R - 3;
        bMesh.position.set(
            Math.cos(angle) * bDist,
            yPos,
            Math.sin(angle) * bDist
        );
        
        // Point towards the center axis
        bMesh.lookAt(0, yPos, 0);
        bMesh.rotation.x -= Math.PI / 2; // Adjust for Cone pointing along Y
        
        cityGroup.add(bMesh);
    }
    innerCityAssembly.add(cityGroup);

    parts.push({
        name: "Megacity Archologies",
        description: "Thousands of high-density residential and industrial spires built into the habitat terrain.",
        material: "Aluminum / Glass",
        function: "Housing and infrastructure for millions of citizens.",
        assemblyOrder: 6,
        connections: ["Primary Habitat Shell"],
        failureEffect: "Localized structural collapse.",
        cascadeFailures: ["Loss of life", "Debris generation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Too complex to explode linearly
    });

    // --- PART 7: DOCKING BAY RING ---
    // Huge intricate toroids at the 'front' of the hub
    const dockingRingGroup = new THREE.Group();
    dockingRingGroup.position.z = -H/2 - 50;

    const dockGeo1 = new THREE.TorusGeometry(30, 8, 32, 64);
    const dockRing1 = new THREE.Mesh(dockGeo1, darkSteel);
    dockingRingGroup.add(dockRing1);

    const dockGeo2 = new THREE.TorusGeometry(50, 4, 16, 64);
    const dockRing2 = new THREE.Mesh(dockGeo2, steel);
    dockingRingGroup.add(dockRing2);

    // Docking arms connecting rings
    for(let i=0; i<8; i++) {
        const angle = i * Math.PI / 4;
        const armGeo = new THREE.CylinderGeometry(2, 2, 50, 16);
        const arm = new THREE.Mesh(armGeo, plastic);
        arm.position.set(Math.cos(angle)*25, Math.sin(angle)*25, 0);
        arm.rotation.z = angle;
        arm.rotation.x = Math.PI/2;
        dockingRingGroup.add(arm);
    }
    
    hubAssembly.add(dockingRingGroup);

    parts.push({
        name: "Zero-G Docking Terminus",
        description: "A counter-rotating ring complex for interstellar freighters and transport shuttles.",
        material: "Dark Steel / Titanium",
        function: "Facilitates safe docking in a zero-gravity environment without the sheer forces of the spinning habitat.",
        assemblyOrder: 7,
        connections: ["Zero-G Hub"],
        failureEffect: "Inability to receive shipments or offload exports.",
        cascadeFailures: ["Economic collapse", "Starvation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -300 }
    });

    // --- PART 8: ATTITUDE THRUSTERS / STATION KEEPING ---
    // Exhaust bells on the exterior
    const thrusterGroup = new THREE.Group();
    const numThrusters = 12;
    for(let i=0; i<numThrusters; i++) {
        const angle = (i/numThrusters) * Math.PI * 2;
        
        // Thruster bell
        const bellGeo = new THREE.CylinderGeometry(5, 2, 15, 16, 1, true);
        const bell = new THREE.Mesh(bellGeo, darkSteel);
        bell.position.set(
            Math.cos(angle) * (R + 10),
            -H/2 + 20, // rear of the cylinder
            Math.sin(angle) * (R + 10)
        );
        bell.lookAt(0, -H/2 + 20, 0);
        
        // Plume
        const plumeGeo = new THREE.ConeGeometry(4, 20, 16);
        const plume = new THREE.Mesh(plumeGeo, plasmaMaterial);
        plume.position.set(0, -10, 0);
        bell.add(plume);
        
        thrusterGroup.add(bell);
    }
    cylinderAssembly.add(thrusterGroup);

    parts.push({
        name: "Station-Keeping Thruster Array",
        description: "Massive plasma thruster bells distributed around the aft hull perimeter.",
        material: "Tungsten / Dark Steel",
        function: "Maintains orbital positioning and corrects precession/wobble induced by internal mass shifts.",
        assemblyOrder: 8,
        connections: ["Exterior Toroidal Rib Framework", "Primary Habitat Shell"],
        failureEffect: "Orbital decay and unstable axial precession.",
        cascadeFailures: ["Catastrophic wobble", "Structural shear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // --- PART 9: RADIATOR FINS ---
    // Massive fins on the hub extending far out to bleed heat
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.z = -H/2 - 120; // Behind docking
    
    for(let i=0; i<6; i++) {
        const angle = i * Math.PI / 3;
        
        const finGeo = new THREE.BoxGeometry(100, 2, 40);
        const fin = new THREE.Mesh(finGeo, copper);
        
        fin.position.set(
            Math.cos(angle) * 70,
            Math.sin(angle) * 70,
            0
        );
        fin.rotation.z = angle;
        
        // Heat glow
        const glowGeo = new THREE.BoxGeometry(98, 2.5, 38);
        const glow = new THREE.Mesh(glowGeo, new THREE.MeshStandardMaterial({
            color: 0xff3300, emissive: 0xaa1100, emissiveIntensity: 2
        }));
        fin.add(glow);

        radiatorGroup.add(fin);
    }
    hubAssembly.add(radiatorGroup);

    parts.push({
        name: "Thermal Radiator Array",
        description: "Gigantic copper-graphene fins glowing with infrared heat.",
        material: "Copper",
        function: "Dissipates the immense waste heat generated by millions of inhabitants and industrial sectors.",
        assemblyOrder: 9,
        connections: ["Zero-G Hub"],
        failureEffect: "Thermal runaway inside the cylinder.",
        cascadeFailures: ["Atmospheric boiling", "Core meltdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -400 }
    });

    // --- PART 10: COMM ARRAY ---
    const commGeo = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI);
    const commDish = new THREE.Mesh(commGeo, chrome);
    commDish.rotation.x = -Math.PI / 2;
    commDish.position.z = -H/2 - 200; // Very front tip
    hubAssembly.add(commDish);

    const commSpike = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 40), darkSteel);
    commSpike.position.z = -H/2 - 200;
    commSpike.rotation.x = Math.PI / 2;
    hubAssembly.add(commSpike);

    parts.push({
        name: "Deep Space Comm Array",
        description: "Hyper-sensitive parabolic transceiver at the very tip of the hub.",
        material: "Chrome / Steel",
        function: "Maintains high-bandwidth quantum entanglement telemetry with Earth and other colonies.",
        assemblyOrder: 10,
        connections: ["Zero-G Hub"],
        failureEffect: "Loss of interstellar communications.",
        cascadeFailures: ["Navigation errors", "Isolation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -500 }
    });

    // --- PART 11: ATMOSPHERIC CLOUD RINGS ---
    // Inner volumetric-like cylinders to simulate clouds inside the habitat
    for(let i=0; i<3; i++) {
        const cloudGeo = new THREE.CylinderGeometry(R - 40, R - 40, H * 0.8, 32, 1, true);
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        cloud.rotation.y = i * Math.PI/4;
        // slightly randomize geometry vertices for cloud effect
        const pos = cloud.geometry.attributes.position;
        for(let j=0; j<pos.count; j++) {
            pos.setY(j, pos.getY(j) + (Math.random() - 0.5) * 20);
        }
        cloud.geometry.computeVertexNormals();
        atmosphereAssembly.add(cloud);
        // Track for animation
        cloud.userData = { speed: (Math.random() - 0.5) * 0.002 };
    }

    parts.push({
        name: "Artificial Weather System",
        description: "Dense moisture control systems forming visible condensation clouds.",
        material: "Water Vapor",
        function: "Regulates humidity, disperses rain, and diffuses harsh light from the solar mirrors.",
        assemblyOrder: 11,
        connections: ["Primary Habitat Shell"],
        failureEffect: "Droughts, unregulated UV exposure.",
        cascadeFailures: ["Agriculture collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // --- PART 12: HYDRAULIC LINES (TUBE GEOMETRY) ---
    // Complex piping running along the hub
    const pipeGroup = new THREE.Group();
    class CustomPipeCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const z = (t - 0.5) * H;
            const x = Math.cos(t * Math.PI * 10) * (HUB_R + 3);
            const y = Math.sin(t * Math.PI * 10) * (HUB_R + 3);
            return optionalTarget.set(x, y, z);
        }
    }
    
    for(let i=0; i<3; i++) {
        const path = new CustomPipeCurve();
        const pipeGeo = new THREE.TubeGeometry(path, 100, 1.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, rubber);
        pipe.rotation.z = i * Math.PI * 2 / 3;
        pipeGroup.add(pipe);
    }
    hubAssembly.add(pipeGroup);

    parts.push({
        name: "Helical Coolant Pipelines",
        description: "Massive rubberized conduits wrapping the central hub.",
        material: "Industrial Rubber",
        function: "Transfers super-heated coolant from the habitat sectors to the external radiator fins.",
        assemblyOrder: 12,
        connections: ["Zero-G Hub", "Thermal Radiator Array"],
        failureEffect: "Coolant leak causing localized freezing or hub fires.",
        cascadeFailures: ["Radiator inefficiency", "Hub destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // --- PART 13: SECONDARY GRAVITY RINGS ---
    // Small rings rotating independently for specific scientific experiments
    const secRingGeo = new THREE.TorusGeometry(HUB_R + 25, 4, 16, 64);
    const secRing = new THREE.Mesh(secRingGeo, plastic);
    secRing.position.z = H/2 + 50; // Aft section
    
    // Tiny connector spokes
    for(let i=0; i<4; i++) {
        const ang = i * Math.PI/2;
        const spGeo = new THREE.CylinderGeometry(1, 1, 25, 8);
        const sp = new THREE.Mesh(spGeo, darkSteel);
        sp.position.set(Math.cos(ang)*12.5, Math.sin(ang)*12.5, 0);
        sp.rotation.z = ang;
        sp.rotation.x = Math.PI/2;
        secRing.add(sp);
    }
    hubAssembly.add(secRing);
    secRing.userData = { isSecondaryRing: true };

    parts.push({
        name: "Variable-G Research Ring",
        description: "An independently rotating centrifuge attached to the aft hub.",
        material: "Advanced Plastics / Steel",
        function: "Provides variable gravity environments (0.1G to 3G) for agricultural and materials research.",
        assemblyOrder: 13,
        connections: ["Zero-G Hub"],
        failureEffect: "Loss of research data and extreme centripetal shear if rotation locks.",
        cascadeFailures: ["Ring detachment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 400 }
    });

    // --- PART 14: CARGO SHIPS ---
    // Moving ships near the docking bay
    const fleetGroup = new THREE.Group();
    const shipGeo = new THREE.ConeGeometry(2, 8, 8);
    shipGeo.rotateX(Math.PI/2);
    
    for(let i=0; i<5; i++) {
        const ship = new THREE.Mesh(shipGeo, tinted);
        ship.position.set(
            Math.cos(i) * 60,
            Math.sin(i) * 60,
            -H/2 - 100 + (Math.random() * 50)
        );
        
        // Engine glow
        const engine = new THREE.Mesh(new THREE.SphereGeometry(1.5), glowingBlue);
        engine.position.z = -4;
        ship.add(engine);
        
        fleetGroup.add(ship);
        ship.userData = { angle: i, speed: 0.005 + Math.random()*0.005, dist: 60 + Math.random()*20 };
    }
    hubAssembly.add(fleetGroup);

    parts.push({
        name: "Inter-Orbital Freight Fleet",
        description: "A swarm of automated cargo haulers staging near the docking rings.",
        material: "Tinted Alloys",
        function: "Imports volatile elements (water, nitrogen) and exports high-tech zero-g manufactured goods.",
        assemblyOrder: 14,
        connections: ["Zero-G Docking Terminus"],
        failureEffect: "Traffic congestion and potential kinetic impacts.",
        cascadeFailures: ["Docking bay destruction", "Hull breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 100, z: -300 }
    });

    // --- PART 15: HUB END-CAPS (MAGNETIC BEARINGS) ---
    const capGeo = new THREE.SphereGeometry(HUB_R + 5, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    
    const frontCap = new THREE.Mesh(capGeo, copper);
    frontCap.rotation.x = -Math.PI/2;
    frontCap.position.z = -H/2;
    hubAssembly.add(frontCap);
    
    const rearCap = new THREE.Mesh(capGeo, copper);
    rearCap.rotation.x = Math.PI/2;
    rearCap.position.z = H/2;
    hubAssembly.add(rearCap);

    parts.push({
        name: "Magnetic Bearing End-Caps",
        description: "Massive frictionless superconducting magnetic bearings at both ends of the cylinder.",
        material: "Copper / Superconductors",
        function: "Decouples the rotating main cylinder from the non-rotating central hub.",
        assemblyOrder: 15,
        connections: ["Primary Habitat Shell", "Zero-G Hub"],
        failureEffect: "Mechanical friction triggering immediate, violent structural torsion.",
        cascadeFailures: ["Cylinder shearing in half", "Complete structural annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -600 }
    });

    // --- ANIMATION LOGIC ---
    const animate = (time, speed, meshes) => {
        // Rotate main cylinder to simulate spin-gravity (1G requires specific RPM depending on radius)
        cylinderAssembly.rotation.y += 0.001 * speed; // cylinder is rotated by X, so it spins on its local Y
        
        // Counter-rotate the hub slightly to simulate momentum conservation (or keep it static, let's make it slowly precess)
        hubAssembly.rotation.z = Math.sin(time * 0.0001 * speed) * 0.02;

        // Animate clouds
        atmosphereAssembly.children.forEach(cloud => {
            cloud.rotation.y += cloud.userData.speed * speed;
        });

        // Animate solar mirrors (tracking a virtual sun, pivoting slightly)
        hubAssembly.children.forEach(child => {
            if (child.userData.isMirror) {
                // Slight adjustments to mirror angle to track sun
                child.rotation.y = -Math.PI/4 + Math.sin(time * 0.0005 * speed + child.userData.index) * 0.05;
            }
            if (child.userData.isSecondaryRing) {
                // Fast spin for high-G
                child.rotation.z += 0.01 * speed;
            }
        });

        // Animate cargo ships circling the dock
        fleetGroup.children.forEach(ship => {
            ship.userData.angle += ship.userData.speed * speed;
            ship.position.x = Math.cos(ship.userData.angle) * ship.userData.dist;
            ship.position.y = Math.sin(ship.userData.angle) * ship.userData.dist;
            // Point ship forward along its path
            ship.rotation.z = ship.userData.angle + Math.PI; 
            ship.rotation.y = Math.PI/2; // Orient correctly
            
            // Pulsing engine glow
            const engine = ship.children[0];
            if (engine) {
                engine.material.emissiveIntensity = 2 + Math.sin(time * 0.01 * speed) * 1.5;
            }
        });

        // Pulse plasma core
        plasmaCore.material.emissiveIntensity = 3 + Math.sin(time * 0.002 * speed) * 1;
    };

    return {
        group,
        parts,
        description: "The 'Island Three' O'Neill Cylinder Megastructure. A colossal space habitat generating artificial gravity via rotation. Features alternating terrain and window strips, a massive zero-G hub for docking, and giant actuated mirrors to reflect sunlight into the interior, supporting millions of inhabitants in a self-sustaining biosphere.",
        quizQuestions: [
            {
                question: "Why must the massive external solar mirrors be independently actuated rather than fixed rigidly to the rotating habitat hull?",
                options: [
                    "To prevent them from tearing off due to extreme centripetal forces at the cylinder's maximum radius.",
                    "Because the primary habitat spins to generate gravity; if mirrors were fixed, they would wildly sweep the sky rather than constantly tracking the sun.",
                    "To create a strobe-light effect inside the cylinder to simulate thunderstorms.",
                    "To intentionally induce orbital drag and slow down the cylinder's rotation over time."
                ],
                correctAnswer: 1,
                explanation: "An O'Neill cylinder spins rapidly (e.g., 1 RPM) to create gravity. The sun, however, remains stationary relative to the colony. Therefore, mirrors must be de-coupled from the main spin and actively track the sun to provide continuous, controlled illumination."
            },
            {
                question: "What physical force acts on an elevator traveling radially from the zero-g hub down the spoke to the 1G inner surface?",
                options: [
                    "Electromagnetic induction.",
                    "The Coriolis force.",
                    "Quantum entanglement shear.",
                    "The strong nuclear force."
                ],
                correctAnswer: 1,
                explanation: "As the elevator moves outward from the center (hub) to the rim, its tangential velocity must increase to match the rim. This causes a perceived sideways push against the elevator shaft, known as the Coriolis force."
            },
            {
                question: "If the radius of this O'Neill cylinder is 'R', and it requires 1 Earth Gravity (1G) at the inner surface, which formula determines the required angular velocity (ω)?",
                options: [
                    "ω = R * g",
                    "ω = √(g / R)",
                    "ω = g / R²",
                    "ω = R² / g"
                ],
                correctAnswer: 1,
                explanation: "The centripetal acceleration is a = ω²R. Setting a to Earth's gravity (g), we get g = ω²R. Solving for angular velocity (ω) yields ω = √(g / R)."
            },
            {
                question: "What is the primary function of the superconducting magnetic bearings at the hub end-caps?",
                options: [
                    "To generate a magnetic field that deflects cosmic radiation and solar flares.",
                    "To physically decouple the high-speed spinning habitat shell from the stationary (or counter-spinning) central hub with zero friction.",
                    "To magnetically attract rogue asteroids for mining.",
                    "To store electrical power in the form of a magnetic flux ring."
                ],
                correctAnswer: 1,
                explanation: "The main hull must spin to create gravity, while the hub must remain relatively stationary for safe spaceship docking and mirror alignment. Superconducting bearings prevent friction from transferring the immense rotational momentum from the hull to the hub."
            },
            {
                question: "Why is the internal atmosphere prone to forming 'weather' like clouds and rain along the central axis?",
                options: [
                    "Because a hidden weather-machine sprays water directly onto the windows.",
                    "Because gravity decreases to zero near the center, causing warm moist air rising from the surface to expand, cool, and condense into clouds near the hub.",
                    "Because the external solar mirrors emit UV radiation that vaporizes the glass.",
                    "Because the cylinder is secretly leaking oxygen into space."
                ],
                correctAnswer: 1,
                explanation: "Just like on Earth, warm moist air rises. In a spinning cylinder, 'up' is towards the center hub. As air moves inward, the pressure drops (due to the column of air pushing 'down' outward). This expansion cools the air, causing moisture to condense into clouds and rain around the zero-g axis."
            }
        ],
        animate
    };
}
