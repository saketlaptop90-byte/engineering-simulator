import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM HIGHLIGHT MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8a2be2, emissive: 0x8a2be2, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.7 });
    const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const glassEmissive = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, transmission: 0.9, opacity: 1, metalness: 0.1, roughness: 0.1, ior: 1.5, emissive: 0x00ffcc, emissiveIntensity: 0.5 });
    const warningOrange = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.8, roughness: 0.4, metalness: 0.5 });

    const animatedMeshes = {
        tesseractNodes: [],
        tesseractEdges: [],
        gimbals: [],
        energyBeams: [],
        wheels: [],
        hydraulics: [],
        radars: []
    };

    // ==========================================
    // 4D MATHEMATICS & TESSERACT GENERATION
    // ==========================================
    
    // 16 vertices of a tesseract in 4D space
    const vertices4D = [];
    for(let x=-1; x<=1; x+=2) {
        for(let y=-1; y<=1; y+=2) {
            for(let z=-1; z<=1; z+=2) {
                for(let w=-1; w<=1; w+=2) {
                    vertices4D.push([x, y, z, w]);
                }
            }
        }
    }

    // Edges connect vertices that differ by exactly 1 coordinate
    const edges4D = [];
    for(let i=0; i<16; i++) {
        for(let j=i+1; j<16; j++) {
            let diffCount = 0;
            for(let k=0; k<4; k++) {
                if(vertices4D[i][k] !== vertices4D[j][k]) diffCount++;
            }
            if(diffCount === 1) {
                edges4D.push([i, j]);
            }
        }
    }

    const tesseractGroup = new THREE.Group();
    tesseractGroup.position.y = 25; // Elevated in the center of the containment chamber
    group.add(tesseractGroup);

    // Create Nodes (Spheres)
    const nodeGeom = new THREE.SphereGeometry(0.6, 32, 32);
    for(let i=0; i<16; i++) {
        const node = new THREE.Mesh(nodeGeom, glassEmissive);
        tesseractGroup.add(node);
        animatedMeshes.tesseractNodes.push({ mesh: node, orig: vertices4D[i] });
    }

    // Create Edges (Cylinders)
    const edgeGeom = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);
    edgeGeom.translate(0, 0.5, 0); // Pivot at the base to make scaling easier
    for(let i=0; i<32; i++) {
        const edge = new THREE.Mesh(edgeGeom, neonBlue);
        tesseractGroup.add(edge);
        animatedMeshes.tesseractEdges.push({ mesh: edge, indices: edges4D[i] });
    }

    parts.push({
        name: "Hyper-Dimensional Nodes",
        description: "16 quantum-locked spherical vertex projectors that maintain the 4D coordinate anchors of the tesseract in our 3D space.",
        material: "glassEmissive",
        function: "Anchor points for 4D-to-3D geometric translation.",
        assemblyOrder: 14,
        connections: ["Hyper-Dimensional Struts", "Containment Pylons"],
        failureEffect: "Spontaneous multi-dimensional implosion, erasing local causality.",
        cascadeFailures: ["Tesseract Unfolding", "Observer Deletion"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    parts.push({
        name: "Hyper-Dimensional Struts",
        description: "32 dynamic binding beams of solid light and exotic matter connecting the nodes.",
        material: "neonBlue",
        function: "Maintains structural integrity of the 4D manifold during rotation.",
        assemblyOrder: 15,
        connections: ["Hyper-Dimensional Nodes"],
        failureEffect: "Tesseract unravels into 8 separate 3D cubes causing severe spatial distortion.",
        cascadeFailures: ["Gravity Reversal", "Time Dilation"],
        originalPosition: {x: 0, y: 25, z: 0},
        explodedPosition: {x: 0, y: 60, z: 0}
    });


    // ==========================================
    // CONTAINMENT GIMBAL RINGS
    // ==========================================
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.y = 25;
    group.add(gimbalGroup);

    const ringSizes = [12, 16, 20];
    const ringMaterials = [chrome, darkSteel, steel];
    const gimbalNames = ["Alpha (Inner)", "Beta (Middle)", "Gamma (Outer)"];

    for(let r=0; r<3; r++) {
        const ringWrapper = new THREE.Group();
        
        // Main Ring Geometry
        const ringGeom = new THREE.TorusGeometry(ringSizes[r], 0.8, 32, 100);
        const ringMesh = new THREE.Mesh(ringGeom, ringMaterials[r]);
        
        // Add Gear Teeth along the outside of the ring
        const teethCount = 120 + (r * 40);
        const toothGeom = new THREE.BoxGeometry(0.4, 0.4, 2.0);
        for(let t=0; t<teethCount; t++) {
            const angle = (t / teethCount) * Math.PI * 2;
            const tooth = new THREE.Mesh(toothGeom, copper);
            tooth.position.set(Math.cos(angle) * (ringSizes[r] + 0.8), Math.sin(angle) * (ringSizes[r] + 0.8), 0);
            tooth.rotation.z = angle;
            ringMesh.add(tooth);
        }

        // Add Emissive Track inside the ring
        const trackGeom = new THREE.TorusGeometry(ringSizes[r] - 0.7, 0.2, 16, 100);
        const trackMesh = new THREE.Mesh(trackGeom, neonPurple);
        ringMesh.add(trackMesh);

        ringWrapper.add(ringMesh);
        
        // Initial rotations to make them nested gimbals
        if (r === 0) ringWrapper.rotation.x = Math.PI / 2;
        if (r === 1) ringWrapper.rotation.y = Math.PI / 2;
        
        gimbalGroup.add(ringWrapper);
        animatedMeshes.gimbals.push({ mesh: ringWrapper, axis: (r === 0 ? 'x' : r === 1 ? 'y' : 'z'), speed: (0.01 + r * 0.005) * (r%2==0?1:-1) });

        parts.push({
            name: `Containment Gimbal ${gimbalNames[r]}`,
            description: `Massive precision-engineered torus with electro-magnetic gear teeth. Dampens rotational kinetic energy bleeding from higher dimensions.`,
            material: "Mixed Metals",
            function: "Gyroscopic stabilization of the spatial anomaly.",
            assemblyOrder: 10 + r,
            connections: [r > 0 ? `Containment Gimbal ${gimbalNames[r-1]}` : "Tesseract Fields"],
            failureEffect: "Asymmetrical spatial sheer tears the facility in half.",
            cascadeFailures: ["Pylon Decoupling", "Reactor Overload"],
            originalPosition: {x: 0, y: 25, z: 0},
            explodedPosition: {x: 0, y: 25 + (r*15), z: 0}
        });
    }

    // ==========================================
    // MASSIVE MOBILE CHASSIS (CRAWLER PLATFORM)
    // ==========================================
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);

    // Main hull - a massive multi-tiered octagonal platform
    const chassisShape = new THREE.Shape();
    const chassisRadius = 45;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8);
        const px = Math.cos(angle) * chassisRadius;
        const pz = Math.sin(angle) * chassisRadius;
        if (i === 0) chassisShape.moveTo(px, pz);
        else chassisShape.lineTo(px, pz);
    }
    chassisShape.closePath();

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    // Rotate to lie flat
    chassisGeom.rotateX(Math.PI / 2);
    chassisGeom.translate(0, 8, 0);

    const chassisMesh = new THREE.Mesh(chassisGeom, darkSteel);
    chassisGroup.add(chassisMesh);

    parts.push({
        name: "Main Crawler Chassis",
        description: "A titanic, heavily armored octagonal mobile platform designed to traverse hostile terrain while maintaining absolute levelness for the containment fields.",
        material: "darkSteel",
        function: "Base foundation and locomotion support.",
        assemblyOrder: 1,
        connections: ["Locomotion Tire Assemblies", "Containment Pylons", "Power Core Reactor"],
        failureEffect: "Total structural collapse, plunging anomaly into the earth.",
        cascadeFailures: ["Planetary Core Breach"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // Sub-chassis details (vents, grating, access panels)
    for(let i=0; i<16; i++) {
        const ventGeom = new THREE.BoxGeometry(4, 2, 2);
        const vent = new THREE.Mesh(ventGeom, steel);
        const angle = (i/16) * Math.PI * 2;
        vent.position.set(Math.cos(angle) * 44, 4, Math.sin(angle) * 44);
        vent.lookAt(0, 4, 0);
        chassisGroup.add(vent);
    }

    // Power Core Reactor (Bottom Center)
    const reactorGeom = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(8, 2),
        new THREE.Vector2(10, 6),
        new THREE.Vector2(6, 12),
        new THREE.Vector2(12, 14),
        new THREE.Vector2(0, 15)
    ], 64);
    const reactor = new THREE.Mesh(reactorGeom, copper);
    reactor.position.y = 8;
    chassisGroup.add(reactor);

    // Glowing core bands
    const coreBandGeom = new THREE.TorusGeometry(10.2, 0.5, 16, 64);
    const coreBand = new THREE.Mesh(coreBandGeom, neonOrange());
    coreBand.position.y = 14;
    coreBand.rotation.x = Math.PI / 2;
    chassisGroup.add(coreBand);

    parts.push({
        name: "Zero-Point Power Core Reactor",
        description: "A lathed copper-alloy containment vessel housing a miniature zero-point energy tap to power the hyper-dimensional gimbals.",
        material: "copper / neonOrange",
        function: "Generates the 1.21 Yottawatts needed to run the stabilizing lasers.",
        assemblyOrder: 2,
        connections: ["Main Crawler Chassis", "Quantum Cooling Pipes"],
        failureEffect: "Catastrophic energy starvation leading to immediate tesseract de-containment.",
        cascadeFailures: ["Facility Vaporization"],
        originalPosition: {x: 0, y: 12, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    function neonOrange() { return warningOrange; }

    // ==========================================
    // EXTREME TIRES & LOCOMOTION (MANDATORY REQUIREMENT)
    // ==========================================
    // Must use TorusGeometry with hundreds of tiny extruded BoxGeometry lugs.
    // Rims must use CylinderGeometry with complex spoke arrays.
    
    const wheelPositions = [
        [-35, 12, -35], [35, 12, -35], [-35, 12, 35], [35, 12, 35],
        [-45, 12, 0], [45, 12, 0], [0, 12, -45], [0, 12, 45]
    ];

    const wheelRotations = [ // align to point outward from center radially or fixed axes? Let's make them fixed along X and Z for a multi-directional crawler.
        [0, 0, Math.PI/2], [0, 0, Math.PI/2], [0, 0, Math.PI/2], [0, 0, Math.PI/2],
        [0, 0, Math.PI/2], [0, 0, Math.PI/2], [Math.PI/2, 0, 0], [Math.PI/2, 0, 0]
    ];

    for(let i=0; i<8; i++) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(wheelPositions[i][0], 12, wheelPositions[i][2]);
        
        // Determine rotation to point wheel correctly
        const angleToCenter = Math.atan2(wheelPositions[i][2], wheelPositions[i][0]);
        wheelGroup.rotation.y = -angleToCenter;

        // Main Tire Torus
        const tireRadius = 8;
        const tireTube = 3.5;
        const tireGeom = new THREE.TorusGeometry(tireRadius, tireTube, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.x = Math.PI / 2; // Lie flat initially, then wheelGroup handles orientation
        
        // Hundreds of BoxGeometry Lugs
        const lugCount = 80;
        const lugGeom = new THREE.BoxGeometry(2, 4, 1.5);
        for(let l=0; l<lugCount; l++) {
            const lAngle = (l / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position on the outer surface of the torus
            lug.position.set(Math.cos(lAngle) * (tireRadius + tireTube - 0.2), 0, Math.sin(lAngle) * (tireRadius + tireTube - 0.2));
            lug.lookAt(0,0,0);
            // Offset slightly in Y for alternating tread pattern
            lug.position.y = (l % 2 === 0) ? 1.5 : -1.5;
            // Angle the lug for aggressive grip
            lug.rotation.z = (l % 2 === 0) ? 0.2 : -0.2;
            tire.add(lug);
        }

        // Complex Rims (CylinderGeometry)
        const rimGeom = new THREE.CylinderGeometry(tireRadius - tireTube + 0.5, tireRadius - tireTube + 0.5, 4, 32);
        rimGeom.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, chrome);
        
        // Complex Spoke Array
        const spokeCount = 12;
        const spokeGeom = new THREE.CylinderGeometry(0.3, 0.8, tireRadius * 2, 8);
        spokeGeom.rotateX(Math.PI / 2);
        for(let s=0; s<spokeCount; s++) {
            const sAngle = (s / spokeCount) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.y = sAngle;
            rim.add(spoke);
        }

        // Central hub
        const hubGeom = new THREE.CylinderGeometry(2, 2, 6, 16);
        hubGeom.rotateX(Math.PI/2);
        const hub = new THREE.Mesh(hubGeom, darkSteel);
        rim.add(hub);

        wheelGroup.add(tire);
        wheelGroup.add(rim);

        // Suspension / Hydraulic strut connecting wheel to chassis
        const strutGroup = new THREE.Group();
        const mainStrutGeom = new THREE.CylinderGeometry(1.5, 1.5, 10, 16);
        const mainStrut = new THREE.Mesh(mainStrutGeom, steel);
        mainStrut.position.y = 5;
        strutGroup.add(mainStrut);

        const innerStrutGeom = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
        const innerStrut = new THREE.Mesh(innerStrutGeom, chrome);
        innerStrut.position.y = -2;
        strutGroup.add(innerStrut);

        strutGroup.position.copy(wheelGroup.position);
        strutGroup.position.y += 10;
        
        // Point strut towards chassis center
        strutGroup.lookAt(0, 20, 0);
        strutGroup.rotateX(Math.PI/2);

        group.add(strutGroup);
        group.add(wheelGroup);

        animatedMeshes.wheels.push(wheelGroup);
        animatedMeshes.hydraulics.push({ outer: mainStrut, inner: innerStrut, baseY: innerStrut.position.y, phase: i });
    }

    parts.push({
        name: "Omni-Directional Locomotion Tire Assemblies",
        description: "Massive Torus-based tires enveloped in hundreds of extruded BoxGeometry traction lugs. Capable of crushing bedrock.",
        material: "Reinforced Rubber / Chrome",
        function: "Provides mobility to the entire containment facility.",
        assemblyOrder: 3,
        connections: ["Hydraulic Suspension System"],
        failureEffect: "Immobilization, leaving the facility vulnerable to localized gravity wells.",
        cascadeFailures: ["Suspension Collapse"],
        originalPosition: {x: 35, y: 12, z: 35},
        explodedPosition: {x: 70, y: 12, z: 70}
    });

    parts.push({
        name: "Hydraulic Suspension System",
        description: "Nested CylinderGeometry pistons constantly adjusting to absorb shock and maintain a perfectly level deck.",
        material: "Steel / Chrome",
        function: "Shock absorption and deck leveling.",
        assemblyOrder: 4,
        connections: ["Main Crawler Chassis", "Locomotion Tire Assemblies"],
        failureEffect: "Violent shaking transferred to the gimbals, risking destabilization.",
        cascadeFailures: ["Gimbal Misalignment"],
        originalPosition: {x: 35, y: 22, z: 35},
        explodedPosition: {x: 60, y: 30, z: 60}
    });

    // ==========================================
    // OBSERVATION GALLERY & PYLONS
    // ==========================================
    
    // 8 Massive Pylons
    for(let p=0; p<8; p++) {
        const pylonGroup = new THREE.Group();
        const pAngle = (p / 8) * Math.PI * 2;
        const pRad = 32;
        pylonGroup.position.set(Math.cos(pAngle) * pRad, 8, Math.sin(pAngle) * pRad);
        pylonGroup.lookAt(0, 8, 0); // Face the center

        // Pylon Base
        const pBaseGeom = new THREE.BoxGeometry(8, 10, 8);
        const pBase = new THREE.Mesh(pBaseGeom, darkSteel);
        pBase.position.y = 5;
        pylonGroup.add(pBase);

        // Pylon Main Shaft (Extrude)
        const shaftShape = new THREE.Shape();
        shaftShape.moveTo(-3, -3);
        shaftShape.lineTo(3, -3);
        shaftShape.lineTo(4, 0);
        shaftShape.lineTo(3, 3);
        shaftShape.lineTo(-3, 3);
        shaftShape.lineTo(-4, 0);
        shaftShape.closePath();

        const shaftGeom = new THREE.ExtrudeGeometry(shaftShape, { depth: 40, bevelEnabled: false });
        shaftGeom.rotateX(-Math.PI/2);
        const shaft = new THREE.Mesh(shaftGeom, steel);
        shaft.position.y = 10;
        pylonGroup.add(shaft);

        // Intricate scaffolding on the shaft
        const scaffoldGeom = new THREE.CylinderGeometry(0.2, 0.2, 40, 4);
        for(let s=0; s<4; s++) {
            const scaf = new THREE.Mesh(scaffoldGeom, copper);
            scaf.position.set((s%2===0?3:-3), 30, (s<2?3:-3));
            pylonGroup.add(scaf);
            
            // Crossbars
            for(let cb=0; cb<10; cb++) {
                const crossbarGeom = new THREE.CylinderGeometry(0.1, 0.1, 6, 4);
                crossbarGeom.rotateZ(Math.PI/2);
                const crossbar = new THREE.Mesh(crossbarGeom, copper);
                crossbar.position.set(0, 12 + cb*3, (s<2?3:-3));
                pylonGroup.add(crossbar);
            }
        }

        // Energy Emitter Array (Top of pylon)
        const emitterGeom = new THREE.LatheGeometry([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 2),
            new THREE.Vector2(4, 4),
            new THREE.Vector2(0.5, 6),
            new THREE.Vector2(0, 6)
        ], 32);
        const emitter = new THREE.Mesh(emitterGeom, chrome);
        emitter.position.set(0, 45, 3); // Pointing slightly inward
        emitter.rotation.x = Math.PI / 4;
        pylonGroup.add(emitter);

        // Radar / Sensory Array at the very top
        const radarGeom = new THREE.LatheGeometry([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(3, 1),
            new THREE.Vector2(5, 2),
            new THREE.Vector2(5.5, 4)
        ], 16, 0, Math.PI);
        const radar = new THREE.Mesh(radarGeom, plastic);
        radar.position.set(0, 52, 0);
        radar.rotation.x = -Math.PI / 4;
        pylonGroup.add(radar);
        animatedMeshes.radars.push(radar);

        // Observation Cabin embedded in the pylon
        const cabinGeom = new THREE.BoxGeometry(6, 4, 4);
        const cabin = new THREE.Mesh(cabinGeom, darkSteel);
        cabin.position.set(0, 25, -2);
        
        // Window for cabin
        const windowGeom = new THREE.PlaneGeometry(5, 3);
        const cabinWindow = new THREE.Mesh(windowGeom, tinted);
        cabinWindow.position.set(0, 0, 2.01);
        cabin.add(cabinWindow);

        // Control panels inside window
        const panelGeom = new THREE.BoxGeometry(4, 1, 1);
        const panel = new THREE.Mesh(panelGeom, neonBlue);
        panel.position.set(0, -1, 1);
        panel.rotation.x = -Math.PI/4;
        cabin.add(panel);

        pylonGroup.add(cabin);

        group.add(pylonGroup);

        // Create Energy Beam in World Space
        const beamGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
        beamGeom.translate(0, 0.5, 0);
        const beam = new THREE.Mesh(beamGeom, laserMaterial);
        
        const emitterWorldPos = new THREE.Vector3(
            Math.cos(pAngle) * pRad + Math.sin(pAngle) * 3, // rough estimation of local z offset
            8 + 45,
            Math.sin(pAngle) * pRad - Math.cos(pAngle) * 3
        );
        beam.position.copy(emitterWorldPos);
        const targetPos = new THREE.Vector3(0, 25, 0);
        beam.lookAt(targetPos);
        beam.rotateX(Math.PI/2);
        const dist = emitterWorldPos.distanceTo(targetPos);
        beam.scale.set(1, dist, 1);
        group.add(beam);
        animatedMeshes.energyBeams.push(beam);
    }

    parts.push({
        name: "Containment Pylons",
        description: "8 highly complex extruded towers housing the cooling systems, crew cabins, and emitter arrays.",
        material: "Steel / Copper / Chrome",
        function: "Structural framework and energy distribution.",
        assemblyOrder: 5,
        connections: ["Main Crawler Chassis", "Stabilization Energy Beams", "Observation Gallery"],
        failureEffect: "Pylon collapse causing catastrophic energy beam misalignment.",
        cascadeFailures: ["Tesseract Escape"],
        originalPosition: {x: 32, y: 8, z: 0},
        explodedPosition: {x: 80, y: 40, z: 0}
    });

    parts.push({
        name: "Stabilization Energy Beams",
        description: "High-intensity tachyon particle beams projected from the pylons directly into the hypercube's core.",
        material: "laserMaterial",
        function: "Forces the 4D geometry to remain partially anchored in our 3D slice of spacetime.",
        assemblyOrder: 13,
        connections: ["Containment Pylons", "Hyper-Dimensional Nodes"],
        failureEffect: "Tesseract immediately folds back into the 4th dimension, vanishing entirely.",
        cascadeFailures: ["Mission Complete Failure"],
        originalPosition: {x: 16, y: 35, z: 0},
        explodedPosition: {x: 50, y: 80, z: 0}
    });

    parts.push({
        name: "Sensory Radar Arrays",
        description: "Spinning LatheGeometry arrays tuning into higher-frequency gravitational waves.",
        material: "Plastic",
        function: "Detects micro-fluctuations in localized spacetime.",
        assemblyOrder: 6,
        connections: ["Containment Pylons"],
        failureEffect: "Blindness to incoming dimensional rifts.",
        cascadeFailures: ["None"],
        originalPosition: {x: 32, y: 60, z: 0},
        explodedPosition: {x: 80, y: 100, z: 0}
    });

    // Walkways / Catwalks Ringing the inside
    const catwalkGroup = new THREE.Group();
    catwalkGroup.position.y = 8;
    for(let wLevel=0; wLevel<3; wLevel++) {
        const cRad = 26 + wLevel*2;
        const cHeight = 15 + wLevel*12;
        
        // Walkway track
        const walkGeom = new THREE.TorusGeometry(cRad, 1.5, 4, 64);
        walkGeom.rotateX(Math.PI/2);
        const walk = new THREE.Mesh(walkGeom, steel);
        walk.position.y = cHeight;
        
        // Handrails
        const railGeom = new THREE.TorusGeometry(cRad - 1.2, 0.1, 8, 64);
        railGeom.rotateX(Math.PI/2);
        const rail1 = new THREE.Mesh(railGeom, copper);
        rail1.position.y = cHeight + 1;
        const rail2 = new THREE.Mesh(railGeom, copper);
        rail2.position.y = cHeight + 0.5;
        
        catwalkGroup.add(walk);
        catwalkGroup.add(rail1);
        catwalkGroup.add(rail2);

        // Vertical supports for rails
        const vRailGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        for(let vr=0; vr<64; vr++) {
            const vrAngle = (vr/64) * Math.PI * 2;
            const vRail = new THREE.Mesh(vRailGeom, copper);
            vRail.position.set(Math.cos(vrAngle)*(cRad - 1.2), cHeight + 0.75, Math.sin(vrAngle)*(cRad - 1.2));
            catwalkGroup.add(vRail);
        }
    }
    group.add(catwalkGroup);

    parts.push({
        name: "Observation Gallery Catwalks",
        description: "Intricate TorusGeometry and CylinderGeometry pathways allowing researchers to physically walk near the anomaly.",
        material: "Steel / Copper",
        function: "Personnel access and manual override stations.",
        assemblyOrder: 7,
        connections: ["Containment Pylons"],
        failureEffect: "Personnel plunge to the chassis deck.",
        cascadeFailures: ["Loss of Life"],
        originalPosition: {x: 0, y: 25, z: 26},
        explodedPosition: {x: 0, y: 25, z: 60}
    });

    // Quantum Cooling Pipes weaving through the base
    const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-20, 10, -20),
        new THREE.Vector3(0, 12, -25),
        new THREE.Vector3(20, 9, -15),
        new THREE.Vector3(25, 11, 0),
        new THREE.Vector3(15, 8, 20),
        new THREE.Vector3(0, 10, 25),
        new THREE.Vector3(-20, 12, 15),
        new THREE.Vector3(-25, 9, 0),
        new THREE.Vector3(-20, 10, -20)
    ]);
    const pipeGeom = new THREE.TubeGeometry(pipeCurve, 128, 1.5, 16, true);
    const pipeMesh = new THREE.Mesh(pipeGeom, neonBlue);
    group.add(pipeMesh);

    parts.push({
        name: "Quantum Cooling Pipes",
        description: "A continuous TubeGeometry loop pumping super-fluid helium-3 mixed with exotic dark matter to cool the reactor.",
        material: "neonBlue",
        function: "Thermal regulation of the zero-point core.",
        assemblyOrder: 8,
        connections: ["Power Core Reactor"],
        failureEffect: "Thermal runaway. Reactor melts through the chassis.",
        cascadeFailures: ["Total System Meltdown"],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: 0, y: -5, z: -30}
    });

    // Operator Command Deck (Main control room sticking out front)
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 30, 42);
    deckGroup.lookAt(0, 30, 0);

    const deckGeom = new THREE.CylinderGeometry(8, 6, 8, 8);
    deckGeom.rotateX(Math.PI/2);
    const deckMesh = new THREE.Mesh(deckGeom, darkSteel);
    deckGroup.add(deckMesh);

    const deckWindowGeom = new THREE.CylinderGeometry(7.8, 5.8, 6, 8, 1, true, 0, Math.PI);
    deckWindowGeom.rotateX(Math.PI/2);
    deckWindowGeom.rotateY(Math.PI);
    const deckWindow = new THREE.Mesh(deckWindowGeom, tinted);
    deckGroup.add(deckWindow);

    group.add(deckGroup);

    parts.push({
        name: "Operator Command Deck",
        description: "The primary nerve center. A fortified geometric construct with heavily tinted quantum-glass viewing ports.",
        material: "darkSteel / tinted",
        function: "Central processing, telemetry monitoring, and primary control.",
        assemblyOrder: 9,
        connections: ["Main Crawler Chassis", "Observation Gallery Catwalks"],
        failureEffect: "Loss of facility control.",
        cascadeFailures: ["Unmonitored Anomaly Growth"],
        originalPosition: {x: 0, y: 30, z: 42},
        explodedPosition: {x: 0, y: 50, z: 80}
    });


    // ==========================================
    // EXTREME ANIMATION LOGIC & 4D ROTATION
    // ==========================================
    
    // 4D Rotation matrices application
    // We will rotate in the XW and YZ planes
    
    let timeAngle = 0;
    
    function rotate4D(vertex, angleXW, angleYZ) {
        let x = vertex[0];
        let y = vertex[1];
        let z = vertex[2];
        let w = vertex[3];
        
        // Rotate XW
        let cxw = Math.cos(angleXW);
        let sxw = Math.sin(angleXW);
        let nx = x * cxw - w * sxw;
        let nw = x * sxw + w * cxw;
        x = nx;
        w = nw;

        // Rotate YZ
        let cyz = Math.cos(angleYZ);
        let syz = Math.sin(angleYZ);
        let ny = y * cyz - z * syz;
        let nz = y * syz + z * cyz;
        y = ny;
        z = nz;

        // Stereographic Projection to 3D
        // The distance from the projection pole
        let distance = 3.5;
        let wOffset = 1.0 / (distance - w); 
        
        // Scale factor for aesthetic sizing
        let scale = 6;
        
        return new THREE.Vector3(
            x * wOffset * scale,
            y * wOffset * scale,
            z * wOffset * scale
        );
    }

    const animate = (deltaTime, speed, meshes) => {
        timeAngle += deltaTime * speed * 0.5;

        // 1. Animate Tesseract Nodes
        const projectedVertices = [];
        for(let i=0; i<16; i++) {
            const orig = animatedMeshes.tesseractNodes[i].orig;
            // Complex rotation functions
            const angleXW = timeAngle * 0.8;
            const angleYZ = timeAngle * 1.2;
            const proj3D = rotate4D(orig, angleXW, angleYZ);
            projectedVertices.push(proj3D);
            
            animatedMeshes.tesseractNodes[i].mesh.position.copy(proj3D);
            
            // Pulse node size based on 4D W coordinate (simulated by distance from origin)
            const d = proj3D.length();
            const s = 0.5 + d * 0.1;
            animatedMeshes.tesseractNodes[i].mesh.scale.set(s,s,s);
        }

        // 2. Animate Tesseract Edges
        for(let i=0; i<32; i++) {
            const edgeData = animatedMeshes.tesseractEdges[i];
            const p1 = projectedVertices[edgeData.indices[0]];
            const p2 = projectedVertices[edgeData.indices[1]];
            
            edgeData.mesh.position.copy(p1);
            
            const direction = new THREE.Vector3().subVectors(p2, p1);
            const dist = direction.length();
            
            // LookAt requires a target in world space relative to the object's parent
            // Since the cylinder is pivoted at the base via translate(0,0.5,0) and faces Y up by default,
            // we use quaternion setFromUnitVectors.
            direction.normalize();
            if (direction.length() > 0.001) {
                edgeData.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            }
            
            edgeData.mesh.scale.set(1, dist, 1);
        }

        // 3. Animate Gimbals
        animatedMeshes.gimbals.forEach(g => {
            g.mesh.rotation[g.axis] += deltaTime * speed * g.speed * 100;
        });

        // 4. Animate Wheels and Hydraulics
        animatedMeshes.wheels.forEach(w => {
            // Wheels roll forward (rotate around local X)
            w.children[0].rotation.y += deltaTime * speed * 2; // Tire
            w.children[1].rotation.z += deltaTime * speed * 2; // Rim
        });

        animatedMeshes.hydraulics.forEach(h => {
            // Pumping motion
            const offset = Math.sin(timeAngle * 5 + h.phase) * 1.5;
            h.inner.position.y = h.baseY + offset;
        });

        // 5. Animate Energy Beams
        animatedMeshes.energyBeams.forEach((beam, idx) => {
            // Pulse opacity/thickness
            const pulse = (Math.sin(timeAngle * 10 + idx) + 1) / 2; // 0 to 1
            beam.scale.x = 1 + pulse * 2;
            beam.scale.z = 1 + pulse * 2;
            beam.material.opacity = 0.4 + pulse * 0.6;
        });

        // 6. Animate Radars
        animatedMeshes.radars.forEach(r => {
            r.rotation.y += deltaTime * speed * 5;
        });
    };

    const description = "The God Tier Hyper-Dimensional Hypercube Containment Facility. A monumental mobile crawler platform utilizing zero-point energy to project stabilizing tachyon fields, effectively trapping and observing a 4-dimensional tesseract unfolding in real-time within our 3-dimensional space. Features millions of tons of steel, hyper-advanced gimbal locks, quantum cooling systems, and omni-directional all-terrain crawler treads.";

    const quizQuestions = [
        {
            question: "In the context of the rotating tesseract, how does the stereographic projection map a point (x,y,z,w) from the 3-sphere S^3 down to R^3?",
            options: [
                "By dividing the x, y, and z coordinates by (1 - w), assuming the projection pole is at w=1.",
                "By taking the cross product of the 4D vector with a normalized 3D basis.",
                "By applying a standard affine orthographic matrix dropping the w coordinate.",
                "By mapping the surface area to a 2D plane and wrapping it around a Torus."
            ],
            answer: 0,
            explanation: "Stereographic projection from S^3 to R^3 takes a point on the hypersphere and projects it from a pole (usually w=1) onto the equatorial hyperplane (w=0). The coordinates become x/(1-w), y/(1-w), z/(1-w)."
        },
        {
            question: "When applying a double rotation to a 4D object (e.g., rotating simultaneously in the XW and YZ planes), what characterizes an 'isoclinic' rotation?",
            options: [
                "The object stops rotating completely in 3D projection.",
                "The two angles of rotation are exactly equal in magnitude.",
                "The object turns inside-out without self-intersecting.",
                "It requires a 5-dimensional manifold to compute."
            ],
            answer: 1,
            explanation: "An isoclinic rotation in 4D occurs when the two invariant planes of rotation have exactly the same angular velocity (magnitude). Under this condition, all points undergo the same angular displacement."
        },
        {
            question: "What is the Euler characteristic (χ) of a standard 4-dimensional hypercube (Tesseract), calculated as Vertices - Edges + Faces - Cells?",
            options: [
                "0",
                "1",
                "2",
                "8"
            ],
            answer: 0,
            explanation: "For a tesseract: 16 vertices - 32 edges + 24 faces - 8 cells = 0. In general, the Euler characteristic of any boundary of a 4D convex polytope is spherical, so for the surface it's 2, but for the solid hypercube (contractible), it's 1. However, the alternating sum of its complete elements (V-E+F-C) = 0."
        },
        {
            question: "If a catastrophic failure causes the containment gimbals to lose synchronization, what mathematical theorem describes the inevitable topological singularity if the hypercube attempts to fold into a Calabi-Yau manifold?",
            options: [
                "The Gauss-Bonnet Theorem.",
                "The Poincare Conjecture.",
                "Yau's proof of the Calabi conjecture regarding Ricci-flat metrics.",
                "The Banach-Tarski Paradox."
            ],
            answer: 2,
            explanation: "Calabi-Yau manifolds are complex manifolds that admit a Ricci-flat metric. Yau's theorem proves their existence, which governs the vacuum solutions in string theory where higher dimensions curl up."
        },
        {
            question: "The energy beams use a Lie group symmetry to lock the Tesseract. Which exceptional Lie group is traditionally associated with string theory and the grand unified theory in higher dimensions?",
            options: [
                "SU(3)",
                "E8",
                "SO(3,1)",
                "U(1)"
            ],
            answer: 1,
            explanation: "E8 is an exceptional simple Lie group of rank 8. The E8 x E8 heterotic string theory is a major candidate for a unified theory of physics combining gravity and quantum mechanics in 10 dimensions."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
