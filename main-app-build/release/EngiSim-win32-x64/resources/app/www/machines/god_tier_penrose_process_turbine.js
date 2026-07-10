import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ============================================================================
    // CUSTOM MEGASTRUCTURE MATERIALS (God Tier Glowing & Emissive)
    // ============================================================================
    const ergosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x4b0082,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
    });

    const superheatedPlasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9,
    });

    const eventHorizonMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
    });

    const accretionDiskMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 4.0
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 4.0
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 3.5
    });

    // ============================================================================
    // PROCEDURAL GEOMETRY HELPERS
    // ============================================================================
    function createExtrudedShape(points, depth, bevel = true) {
        const shape = new THREE.Shape();
        if (points.length > 0) {
            shape.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                shape.lineTo(points[i].x, points[i].y);
            }
        }
        const extrudeSettings = {
            depth: depth,
            bevelEnabled: bevel,
            bevelSegments: 5,
            steps: 4,
            bevelSize: 0.2,
            bevelThickness: 0.2
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createLatheGeometry(points, segments, phiStart = 0, phiLength = Math.PI * 2) {
        const vecPoints = points.map(p => new THREE.Vector2(p.x, p.y));
        return new THREE.LatheGeometry(vecPoints, segments, phiStart, phiLength);
    }

    function createTubeAlongCurve(curvePoints, radius, segments) {
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        return new THREE.TubeGeometry(curve, segments, radius, 12, false);
    }

    // ============================================================================
    // COMPONENT 1: THE KERR BLACK HOLE (EVENT HORIZON)
    // ============================================================================
    const bhRadius = 50;
    const eventHorizonGeom = new THREE.SphereGeometry(bhRadius, 128, 128);
    const eventHorizon = new THREE.Mesh(eventHorizonGeom, eventHorizonMaterial);
    group.add(eventHorizon);

    parts.push({
        name: "Kerr Singularity Event Horizon",
        description: "The absolute boundary of the rotating black hole. Beyond this point, not even light can escape. Its immense angular momentum dictates the structure of the ergosphere.",
        material: "Pure Black Absorptive Material (Perfect Blackbody)",
        function: "Gravitational anchor and rotational energy source for the entire Penrose Process megastructure.",
        assemblyOrder: 1,
        connections: ["Ergosphere", "Quantum Gravity Stabilizers"],
        failureEffect: "Spaghettification of the entire facility and complete obliteration from reality.",
        cascadeFailures: ["Time Dilation Imbalance", "Causality Violation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ============================================================================
    // COMPONENT 2: THE ERGOSPHERE
    // ============================================================================
    // The ergosphere is oblate. We'll use a modified sphere or highly segmented lathe.
    const ergoPoints = [];
    for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI;
        const r = bhRadius * (1.2 + 0.8 * Math.sin(t)); // Oblate shape
        const y = bhRadius * 1.5 * Math.cos(t);
        ergoPoints.push({ x: r, y: y });
    }
    const ergosphereGeom = createLatheGeometry(ergoPoints, 128);
    const ergosphere = new THREE.Mesh(ergosphereGeom, ergosphereMaterial);
    group.add(ergosphere);

    parts.push({
        name: "Ergosphere Field Boundary",
        description: "The region outside the event horizon where spacetime is dragged along with the black hole's rotation faster than the speed of light. Static objects cannot exist here.",
        material: "Ergospheric Glow (Visualized Spacetime Metric)",
        function: "The zone where the Penrose process occurs. Matter injected here is forced to co-rotate, gaining immense kinetic energy.",
        assemblyOrder: 2,
        connections: ["Event Horizon", "Frame-Dragging Stators"],
        failureEffect: "Loss of frame-dragging extraction capability. Turbine spin-down.",
        cascadeFailures: ["Matter Injection Bounce-back"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // ============================================================================
    // COMPONENT 3: ACCRETION DISK
    // ============================================================================
    const accretionDiskGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const diskGeom = new THREE.TorusGeometry(bhRadius * 2.5 + i * 15, i * 2 + 1, 32, 128);
        const diskRing = new THREE.Mesh(diskGeom, accretionDiskMaterial);
        diskRing.rotation.x = Math.PI / 2;
        diskRing.rotation.y = (Math.random() - 0.5) * 0.1;
        accretionDiskGroup.add(diskRing);
    }
    group.add(accretionDiskGroup);

    parts.push({
        name: "Relativistic Accretion Disk",
        description: "Superheated matter spiraling into the black hole. Emits massive amounts of X-rays and thermal radiation.",
        material: "Superheated Plasma (Visualized)",
        function: "Provides the raw mass needed for the splitting process. Also acts as a secondary thermal power source.",
        assemblyOrder: 3,
        connections: ["Matter Injectors", "Thermal Radiators"],
        failureEffect: "Fuel starvation for the Penrose Process.",
        cascadeFailures: ["Thermal Power Loss", "Radiator Freezing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // ============================================================================
    // COMPONENT 4: PENROSE RING HUB (MEGASTRUCTURE FOUNDATION)
    // ============================================================================
    const hubPoints = [
        {x: 200, y: -20}, {x: 220, y: -30}, {x: 240, y: -20}, {x: 250, y: 0},
        {x: 240, y: 20}, {x: 220, y: 30}, {x: 200, y: 20}, {x: 190, y: 0}, {x: 200, y: -20}
    ];
    const hubGeom = createLatheGeometry(hubPoints, 128);
    const penroseHub = new THREE.Mesh(hubGeom, darkSteel);
    group.add(penroseHub);

    parts.push({
        name: "Penrose Ring Hub",
        description: "The primary structural foundation of the megastructure, orbiting safely outside the ergosphere. Houses the command centers, energy storage, and structural tethers.",
        material: "Dark Steel & Carbon Nanotube Weave",
        function: "Anchors all injector, scoop, and stator assemblies.",
        assemblyOrder: 4,
        connections: ["Structural Struts", "Energy Conduits"],
        failureEffect: "Catastrophic structural failure. Entire facility collapses into the black hole.",
        cascadeFailures: ["Complete Facility Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Base anchor
    });

    // ============================================================================
    // COMPONENT 5: MATTER INJECTORS (8x SYMMETRICAL)
    // ============================================================================
    const injectorGroup = new THREE.Group();
    const injectorCount = 8;
    const injectors = [];
    
    const injectorProfile = [
        {x: 2, y: 0}, {x: 8, y: 0}, {x: 10, y: 20}, {x: 6, y: 50}, {x: 12, y: 80}, {x: 4, y: 120}, {x: 0, y: 120}
    ];

    for (let i = 0; i < injectorCount; i++) {
        const angle = (i / injectorCount) * Math.PI * 2;
        const injGeom = createLatheGeometry(injectorProfile, 32);
        const injector = new THREE.Mesh(injGeom, steel);
        
        // Orient pointing INWARD towards the black hole
        injector.position.set(Math.cos(angle) * 190, 0, Math.sin(angle) * 190);
        injector.rotation.x = Math.PI / 2;
        injector.rotation.z = -angle - Math.PI/2;
        
        injectorGroup.add(injector);
        injectors.push(injector);
    }
    group.add(injectorGroup);

    parts.push({
        name: "Relativistic Matter Injectors",
        description: "Massive railguns that fire dense chunks of degenerate matter directly into the ergosphere on carefully calculated trajectories.",
        material: "Steel / Chrome Plating",
        function: "Delivers the payload that will be split to extract rotational energy.",
        assemblyOrder: 5,
        connections: ["Penrose Ring Hub", "Accretion Disk Siphon"],
        failureEffect: "Inability to perform Penrose extraction. Energy output drops to zero.",
        cascadeFailures: ["Stator Desync", "Grid Brownout"],
        originalPosition: { x: 190, y: 0, z: 0 },
        explodedPosition: { x: 400, y: 0, z: 0 }
    });

    // ============================================================================
    // COMPONENT 6: HIGH-ENERGY SCOOPS (8x SYMMETRICAL)
    // ============================================================================
    const scoopGroup = new THREE.Group();
    const scoops = [];
    
    // Scoop shape (complex extruded shape)
    const scoopShapePoints = [
        {x: 0, y: -10}, {x: 30, y: -40}, {x: 40, y: -10}, {x: 35, y: 20}, {x: 15, y: 30}, {x: 0, y: 10}
    ];

    for (let i = 0; i < injectorCount; i++) {
        // Offset scoops from injectors slightly to catch the escaping matter
        const angle = (i / injectorCount) * Math.PI * 2 + (Math.PI / injectorCount);
        const scoopGeom = createExtrudedShape(scoopShapePoints, 20, true);
        const scoop = new THREE.Mesh(scoopGeom, chrome);
        
        scoop.position.set(Math.cos(angle) * 140, 20, Math.sin(angle) * 140);
        // Aim scoops at the escaping trajectories
        scoop.rotation.y = -angle;
        scoop.rotation.x = Math.PI / 4;
        
        scoopGroup.add(scoop);
        scoops.push(scoop);
    }
    group.add(scoopGroup);

    parts.push({
        name: "Ergospheric Plasma Scoops",
        description: "Incredibly durable hyper-alloy catchers designed to absorb the high-velocity escaping fragments after the matter splitting event.",
        material: "Chrome / Experimental Hyper-Alloy",
        function: "Captures the extracted kinetic energy and channels it into the energy conduits.",
        assemblyOrder: 6,
        connections: ["Energy Conduits", "Penrose Ring Hub"],
        failureEffect: "High-energy plasma fragments breach the hull, melting the megastructure.",
        cascadeFailures: ["Hub Breach", "Conduit Vaporization"],
        originalPosition: { x: 140, y: 20, z: 0 },
        explodedPosition: { x: 300, y: 100, z: 0 }
    });

    // ============================================================================
    // COMPONENT 7: SPLITTER ANVILS (INSIDE ERGOSPHERE)
    // ============================================================================
    const anvilGroup = new THREE.Group();
    const anvils = [];
    for (let i = 0; i < injectorCount; i++) {
        const angle = (i / injectorCount) * Math.PI * 2;
        // Anvils sit very close to the event horizon, deep in the ergosphere
        const anvilRadius = bhRadius * 1.3;
        
        const anvilGeom = new THREE.OctahedronGeometry(8, 2);
        const anvil = new THREE.Mesh(anvilGeom, darkSteel);
        
        anvil.position.set(Math.cos(angle) * anvilRadius, 0, Math.sin(angle) * anvilRadius);
        anvilGroup.add(anvil);
        anvils.push(anvil);
    }
    group.add(anvilGroup);

    parts.push({
        name: "Quantum Splitter Anvils",
        description: "Dense gravitational anomaly generators that force the injected matter chunk to split into two precisely calculated fragments. One falls into the black hole with negative energy, the other escapes with more energy than the original.",
        material: "Dark Steel / Condensed Exotic Matter",
        function: "The catalyst for the Penrose Process.",
        assemblyOrder: 7,
        connections: ["Matter Injectors", "Ergosphere"],
        failureEffect: "Matter does not split. Payload simply falls into the black hole, adding to its mass rather than extracting energy.",
        cascadeFailures: ["Efficiency Drop", "Black Hole Expansion"],
        originalPosition: { x: 70, y: 0, z: 0 },
        explodedPosition: { x: 150, y: -50, z: 0 }
    });

    // ============================================================================
    // COMPONENT 8: FRAME-DRAGGING STATORS
    // ============================================================================
    const statorGroup = new THREE.Group();
    const statorCount = 16;
    const stators = [];
    for (let i = 0; i < statorCount; i++) {
        const angle = (i / statorCount) * Math.PI * 2;
        // Giant curving fins wrapping around the black hole's poles
        const statorGeom = new THREE.CylinderGeometry(2, 8, 150, 16);
        const stator = new THREE.Mesh(statorGeom, copper);
        
        stator.position.set(Math.cos(angle) * 100, 100, Math.sin(angle) * 100);
        stator.rotation.z = Math.PI / 4;
        stator.rotation.y = -angle;
        
        statorGroup.add(stator);
        stators.push(stator);
        
        // Lower stators
        const statorLower = new THREE.Mesh(statorGeom, copper);
        statorLower.position.set(Math.cos(angle) * 100, -100, Math.sin(angle) * 100);
        statorLower.rotation.z = -Math.PI / 4;
        statorLower.rotation.y = -angle;
        statorGroup.add(statorLower);
        stators.push(statorLower);
    }
    group.add(statorGroup);

    parts.push({
        name: "Frame-Dragging Stators",
        description: "Massive electromagnetic coils that couple directly with the twisted spacetime (Lense-Thirring effect) to extract inductive power.",
        material: "Superconducting Copper",
        function: "Auxiliary power generation from spacetime torsion.",
        assemblyOrder: 8,
        connections: ["Magnetic Confinement Coils", "Penrose Ring Hub"],
        failureEffect: "Loss of auxiliary power. Megastructure stabilization compromised.",
        cascadeFailures: ["Magnetic Containment Failure"],
        originalPosition: { x: 100, y: 100, z: 0 },
        explodedPosition: { x: 100, y: 300, z: 0 }
    });

    // ============================================================================
    // COMPONENT 9: ENERGY CONDUITS
    // ============================================================================
    const conduitGroup = new THREE.Group();
    for (let i = 0; i < injectorCount; i++) {
        const angle = (i / injectorCount) * Math.PI * 2 + (Math.PI / injectorCount);
        // Curves from scoops to hub
        const start = new THREE.Vector3(Math.cos(angle) * 140, 20, Math.sin(angle) * 140);
        const control1 = new THREE.Vector3(Math.cos(angle) * 160, 40, Math.sin(angle) * 160);
        const control2 = new THREE.Vector3(Math.cos(angle) * 180, 20, Math.sin(angle) * 180);
        const end = new THREE.Vector3(Math.cos(angle) * 210, 0, Math.sin(angle) * 210);
        
        const curvePoints = [start, control1, control2, end];
        const conduitGeom = createTubeAlongCurve(curvePoints, 4, 32);
        const conduit = new THREE.Mesh(conduitGeom, neonBlue);
        conduitGroup.add(conduit);
    }
    group.add(conduitGroup);

    parts.push({
        name: "Hyper-Relativistic Energy Conduits",
        description: "Massive optical and plasma conduits that route the unimaginable energy from the scoops to the main hub batteries.",
        material: "Plasma-filled Neon Glass",
        function: "Energy Transmission.",
        assemblyOrder: 9,
        connections: ["Scoops", "Penrose Ring Hub"],
        failureEffect: "Energy bottleneck leading to localized explosions.",
        cascadeFailures: ["Hub Battery Overload"],
        originalPosition: { x: 175, y: 20, z: 0 },
        explodedPosition: { x: 250, y: 150, z: 0 }
    });

    // ============================================================================
    // COMPONENT 10: MAGNETIC CONFINEMENT COILS
    // ============================================================================
    const coilGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const coilGeom = new THREE.TorusGeometry(180 + i*15, 3, 32, 100);
        const coil = new THREE.Mesh(coilGeom, steel);
        coil.rotation.x = Math.PI / 2;
        coil.position.y = (i - 1) * 25;
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    parts.push({
        name: "Superconducting Containment Coils",
        description: "Immense torus structures holding millions of amps of current to keep the extracted plasma streams from melting the physical structure.",
        material: "Steel & YBCO Superconductors",
        function: "Plasma containment and magnetic shielding against intense hard radiation.",
        assemblyOrder: 10,
        connections: ["Penrose Ring Hub", "Frame-Dragging Stators"],
        failureEffect: "Plasma breach. Extreme radiation hazard.",
        cascadeFailures: ["Crew Fatalities", "Structural Melting"],
        originalPosition: { x: 0, y: 25, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ============================================================================
    // COMPONENT 11: THERMAL RADIATORS
    // ============================================================================
    const radiatorGroup = new THREE.Group();
    const radCount = 24;
    for (let i = 0; i < radCount; i++) {
        const angle = (i / radCount) * Math.PI * 2;
        // Complex radiator fin arrays
        const radGeom = new THREE.BoxGeometry(40, 2, 60);
        const radiator = new THREE.Mesh(radGeom, aluminum);
        radiator.position.set(Math.cos(angle) * 270, 0, Math.sin(angle) * 270);
        radiator.rotation.y = -angle;
        // Add neon glowing stripes to represent heat
        const heatGeom = new THREE.BoxGeometry(38, 2.5, 2);
        const heatStrip1 = new THREE.Mesh(heatGeom, neonRed);
        heatStrip1.position.z = -15;
        radiator.add(heatStrip1);
        const heatStrip2 = new THREE.Mesh(heatGeom, neonRed);
        heatStrip2.position.z = 15;
        radiator.add(heatStrip2);

        radiatorGroup.add(radiator);
    }
    group.add(radiatorGroup);

    parts.push({
        name: "Exotic Matter Thermal Radiators",
        description: "Massive fin arrays dissipating the petawatts of waste heat generated by the near-light-speed particle impacts and accretion disk radiation.",
        material: "Aluminum & Graphene Composite",
        function: "Waste heat management via blackbody radiation into deep space.",
        assemblyOrder: 11,
        connections: ["Penrose Ring Hub"],
        failureEffect: "Thermal runaway. The entire megastructure boils into vapor.",
        cascadeFailures: ["Superconductor Quench", "Total Failure"],
        originalPosition: { x: 270, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 0, z: 0 }
    });

    // ============================================================================
    // COMPONENT 12: RELATIVISTIC PLASMA STREAMS (ANIMATED LOGIC)
    // ============================================================================
    const plasmaStreamGroup = new THREE.Group();
    const streamCount = injectorCount * 2; // Two streams per injector (one escaping, one falling)
    const plasmaStreams = [];

    for (let i = 0; i < streamCount; i++) {
        // We will just create small long cylinders that we will animate moving along paths
        const streamGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 8);
        streamGeom.rotateX(Math.PI / 2); // align along Z
        const streamMat = (i % 2 === 0) ? plasmaMaterial : superheatedPlasmaMaterial;
        const stream = new THREE.Mesh(streamGeom, streamMat);
        
        plasmaStreamGroup.add(stream);
        plasmaStreams.push({
            mesh: stream,
            index: i,
            progress: Math.random() // Start at random positions along their path
        });
    }
    group.add(plasmaStreamGroup);

    parts.push({
        name: "Relativistic Plasma Streams",
        description: "The actual matter undergoing the Penrose process. The blue streams represent the high-energy escaping fragments, while the purple streams represent the negative-energy fragments falling into the black hole.",
        material: "Glowing Plasma",
        function: "The working fluid of the megastructure.",
        assemblyOrder: 12,
        connections: ["Injectors", "Anvils", "Scoops", "Event Horizon"],
        failureEffect: "Stream misalignment causes destructive collisions with the stators.",
        cascadeFailures: ["Stator Destruction"],
        originalPosition: { x: 100, y: 0, z: 0 },
        explodedPosition: { x: 100, y: -100, z: 0 }
    });

    // ============================================================================
    // COMPONENT 13: COMMAND AND CONTROL SPHERES
    // ============================================================================
    const commandGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const cmdGeom = new THREE.SphereGeometry(15, 32, 32);
        const cmdSphere = new THREE.Mesh(cmdGeom, tinted);
        cmdSphere.position.set(Math.cos(angle) * 230, 40, Math.sin(angle) * 230);
        
        // Add a dark steel ring around it
        const cmdRingGeom = new THREE.TorusGeometry(20, 2, 16, 64);
        const cmdRing = new THREE.Mesh(cmdRingGeom, darkSteel);
        cmdRing.rotation.x = Math.PI / 2;
        cmdSphere.add(cmdRing);
        
        commandGroup.add(cmdSphere);
    }
    group.add(commandGroup);

    parts.push({
        name: "Geodesic Command Spheres",
        description: "Heavily shielded, tinted-glass command centers housing the AI and unfortunate organic overseers managing the hyper-complex orbital mechanics required to keep the facility from being shredded.",
        material: "Tinted Transparent Aluminum",
        function: "Overall facility management, telemetry processing, and orbital station-keeping.",
        assemblyOrder: 13,
        connections: ["Penrose Ring Hub"],
        failureEffect: "Loss of telemetry. Automated systems will attempt to safe the facility by purging all plasma, but a crash into the black hole is likely.",
        cascadeFailures: ["Orbit Decay", "Manual Override Required"],
        originalPosition: { x: 230, y: 40, z: 0 },
        explodedPosition: { x: 230, y: 200, z: 0 }
    });

    // ============================================================================
    // COMPONENT 14: THRUST STABILIZATION VENTS
    // ============================================================================
    const ventGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const ventGeom = new THREE.ConeGeometry(5, 20, 16);
        const vent = new THREE.Mesh(ventGeom, steel);
        // Positioned on the underside of the hub
        vent.position.set(Math.cos(angle) * 220, -35, Math.sin(angle) * 220);
        vent.rotation.x = Math.PI; // Pointing down
        
        // Emissive thruster plume
        const plumeGeom = new THREE.CylinderGeometry(4, 0, 30, 16);
        const plume = new THREE.Mesh(plumeGeom, neonBlue);
        plume.position.y = -25;
        vent.add(plume);

        ventGroup.add(vent);
    }
    group.add(ventGroup);

    parts.push({
        name: "Orbital Stabilization Thrusters",
        description: "Massive plasma vents pointing downwards (towards the black hole's poles) to counteract the gravitational pull and frame-dragging turbulence, maintaining the hub's orbit.",
        material: "Steel / Plasma Exhaust",
        function: "Station-keeping and attitude control.",
        assemblyOrder: 14,
        connections: ["Penrose Ring Hub"],
        failureEffect: "Orbital decay. The megastructure slowly falls into the ergosphere and gets torn apart by tidal forces.",
        cascadeFailures: ["Ergospheric Breach"],
        originalPosition: { x: 220, y: -35, z: 0 },
        explodedPosition: { x: 220, y: -200, z: 0 }
    });

    // ============================================================================
    // COMPONENT 15: STRUCTURAL STRUTS (INTERNAL LATTICE)
    // ============================================================================
    const strutGroup = new THREE.Group();
    for (let i = 0; i < injectorCount; i++) {
        const angle1 = (i / injectorCount) * Math.PI * 2;
        const angle2 = ((i + 1) / injectorCount) * Math.PI * 2;
        
        // Cross bracing between injectors
        const p1 = new THREE.Vector3(Math.cos(angle1) * 190, 0, Math.sin(angle1) * 190);
        const p2 = new THREE.Vector3(Math.cos(angle2) * 190, 20, Math.sin(angle2) * 190);
        
        const distance = p1.distanceTo(p2);
        const strutGeom = new THREE.CylinderGeometry(2, 2, distance, 8);
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        
        // Position at midpoint
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        strut.position.copy(midPoint);
        strut.lookAt(p2);
        strut.rotateX(Math.PI / 2);
        
        strutGroup.add(strut);
    }
    group.add(strutGroup);

    parts.push({
        name: "Tensegrity Strut Lattice",
        description: "A complex web of carbon-nanotube reinforced dark steel struts providing shear strength against the immense tidal forces of the black hole.",
        material: "Dark Steel / Carbon Nanotubes",
        function: "Distributes mechanical stress across the entire megastructure.",
        assemblyOrder: 15,
        connections: ["Penrose Ring Hub", "Injectors"],
        failureEffect: "Shearing of the megastructure ring into individual, uncoordinated fragments.",
        cascadeFailures: ["Total Disassembly"],
        originalPosition: { x: 190, y: 10, z: 0 },
        explodedPosition: { x: 190, y: 100, z: 0 }
    });

    // ============================================================================
    // COMPONENT 16: TACHYON RELAYS
    // ============================================================================
    const tachyonGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const relayGeom = new THREE.OctahedronGeometry(6, 1);
        const relay = new THREE.Mesh(relayGeom, glass);
        
        relay.position.set(Math.cos(angle)*260, 60, Math.sin(angle)*260);
        
        const coreGeom = new THREE.SphereGeometry(3, 16, 16);
        const core = new THREE.Mesh(coreGeom, neonGreen);
        relay.add(core);

        tachyonGroup.add(relay);
    }
    group.add(tachyonGroup);

    parts.push({
        name: "Superluminal Tachyon Relays",
        description: "Communication spires utilizing theoretical tachyon particles to transmit telemetry out of the deep gravity well without suffering from infinite time dilation.",
        material: "Glass / Neon Core",
        function: "Communication with the outside universe.",
        assemblyOrder: 16,
        connections: ["Penrose Ring Hub"],
        failureEffect: "Complete loss of contact with outside observers. Time dilation renders the facility functionally isolated from the rest of history.",
        cascadeFailures: ["Command Desync"],
        originalPosition: { x: 260, y: 60, z: 0 },
        explodedPosition: { x: 260, y: 300, z: 0 }
    });

    // ============================================================================
    // COMPONENT 17: HAWKING RADIATION COLLECTORS
    // ============================================================================
    const hawkingGroup = new THREE.Group();
    for(let i=0; i<32; i++) {
        const angle = (i/32)*Math.PI*2;
        // Small parabolic dishes facing the event horizon
        const dishGeom = createLatheGeometry([
            {x:0, y:0}, {x:5, y:2}, {x:8, y:6}
        ], 16);
        const dish = new THREE.Mesh(dishGeom, chrome);
        
        // Position them just outside the ergosphere on long booms
        dish.position.set(Math.cos(angle)*150, 0, Math.sin(angle)*150);
        // Aim at origin
        dish.lookAt(new THREE.Vector3(0,0,0));
        dish.rotateX(-Math.PI/2); // Align lathe to point at origin
        
        hawkingGroup.add(dish);
    }
    group.add(hawkingGroup);

    parts.push({
        name: "Hawking Radiation Collector Array",
        description: "Delicate parabolic chrome mirrors designed to capture the minuscule amount of Hawking radiation evaporating from the black hole. A highly inefficient secondary power source, mostly used for sensor calibration.",
        material: "Polished Chrome",
        function: "Secondary power and quantum sensor calibration.",
        assemblyOrder: 17,
        connections: ["Penrose Ring Hub"],
        failureEffect: "Minor power loss. Sensor calibration drift.",
        cascadeFailures: ["None"],
        originalPosition: { x: 150, y: 0, z: 0 },
        explodedPosition: { x: 150, y: -150, z: 0 }
    });

    // ============================================================================
    // QUIZ QUESTIONS (PhD Level General Relativity)
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the Penrose process operating within a Kerr spacetime, the extraction of energy depends on the existence of negative-energy orbits. Which specific metric property is mathematically responsible for allowing the energy of a particle, as measured by a distant observer (killing vector field ∂t), to become negative?",
            options: [
                "The vanishing of the lapse function (α) at the event horizon.",
                "The g_tt component of the metric tensor changing sign (becoming positive) inside the ergosphere.",
                "The off-diagonal g_tφ component dominating the metric determinant.",
                "The divergence of the Christoffel symbols near the Cauchy horizon."
            ],
            correctAnswer: 1,
            explanation: "Inside the ergosphere, the g_tt component of the Kerr metric becomes positive. The time-translation Killing vector field ∂t becomes spacelike. Because the conserved energy E is the projection of the particle's 4-momentum onto ∂t (E = -p_μ ξ^μ), E can be negative if the 4-momentum aligns appropriately with this now-spacelike vector, allowing a particle dropped into the hole to decrease the hole's total mass/energy."
        },
        {
            question: "The theoretical maximum efficiency of energy extraction via the Penrose process from an extreme Kerr black hole (where angular momentum a = M) is approximately what percentage of the black hole's initial rest mass?",
            options: [
                "11%",
                "20.7%",
                "29%",
                "42.3%"
            ],
            correctAnswer: 2,
            explanation: "The irreducible mass of a black hole dictates the limit of energy extraction. For an extreme Kerr black hole, the irreducible mass M_irr is M/sqrt(2). The extractable rotational energy is M - M_irr, which is M(1 - 1/sqrt(2)), approximately 0.29M, or 29%."
        },
        {
            question: "To execute a successful Penrose process, a particle must split into two fragments inside the ergosphere. What is the necessary condition regarding the relative velocities of the fragments for the escaping fragment to gain substantial energy?",
            options: [
                "The fragments must separate at a speed exceeding the local speed of light.",
                "The relative separation velocity must be highly relativistic (often > 0.5c) to overcome the gravitational binding energy and access the negative energy states.",
                "The fragments must separate strictly along the z-axis (axis of rotation).",
                "The splitting must occur exactly on the equatorial plane (θ = π/2) with zero radial velocity."
            ],
            correctAnswer: 1,
            explanation: "To impart enough momentum to one fragment so that it enters a negative-energy orbit (which requires it to strongly oppose the frame-dragging direction), the splitting event must involve highly relativistic relative velocities (a 'hydrodynamic kick' or explosive separation). Without this relativistic split, both fragments would typically just fall into the black hole."
        },
        {
            question: "The boundary of the ergosphere (the stationary limit surface) is defined by the locus of points where:",
            options: [
                "The radial metric component g_rr approaches infinity.",
                "The frame-dragging angular velocity ω equals the speed of light.",
                "The time-translation Killing vector ∂t becomes null.",
                "The curvature scalar (Kretschmann invariant) reaches its maximum finite value."
            ],
            correctAnswer: 2,
            explanation: "The stationary limit surface (outer boundary of the ergosphere) is precisely where the time-translation Killing vector ∂t becomes null (g_tt = 0). Inside this surface, ∂t is spacelike, meaning no observer can remain stationary relative to infinity; they are inexorably dragged by the rotating spacetime."
        },
        {
            question: "In the superradiant scattering equivalent of the Penrose process (Zel'dovich-Starobinsky effect), a bosonic wave incident on a Kerr black hole is amplified if its frequency ω satisfies which condition? (where m is the azimuthal quantum number and Ω_H is the angular velocity of the event horizon)",
            options: [
                "0 < ω < mΩ_H",
                "ω > mΩ_H",
                "ω = mΩ_H / 2",
                "ω < 0"
            ],
            correctAnswer: 0,
            explanation: "Superradiant amplification occurs when the frequency of the incoming wave ω is less than m times the angular velocity of the event horizon Ω_H (0 < ω < mΩ_H). In this regime, the wave extracts rotational energy and angular momentum from the black hole, emerging with a larger amplitude."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    function animate(time, speed, meshes) {
        // time: elapsed time
        // speed: user defined playback speed
        // meshes: array of meshes/groups to animate if needed, though we captured them in closures

        const t = time * speed;

        // 1. Rotate the Hub slowly
        penroseHub.rotation.y = t * 0.05;
        strutGroup.rotation.y = t * 0.05;
        ventGroup.rotation.y = t * 0.05;
        commandGroup.rotation.y = t * 0.05;
        radiatorGroup.rotation.y = t * 0.05;
        tachyonGroup.rotation.y = t * 0.05;
        hawkingGroup.rotation.y = t * 0.05;
        conduitGroup.rotation.y = t * 0.05;
        
        // Injectors, scoops, and anvils also rotate with the hub
        injectorGroup.rotation.y = t * 0.05;
        scoopGroup.rotation.y = t * 0.05;
        anvilGroup.rotation.y = t * 0.05;

        // 2. Accretion Disk rotates extremely fast
        accretionDiskGroup.children.forEach((ring, index) => {
            // Inner rings rotate faster (Keplerian-ish, though highly relativistic)
            const ringSpeed = 0.5 + (5 - index) * 0.2;
            ring.rotation.z = t * ringSpeed; // because it's rotated X by PI/2
            // Material pulsing
            ring.material.emissiveIntensity = 3.5 + Math.sin(t * 5 + index) * 1.5;
        });

        // 3. Ergosphere pulsating and rotating (Frame dragging visualization)
        ergosphere.rotation.y = t * 0.8;
        ergosphere.scale.set(
            1 + Math.sin(t * 3) * 0.02, 
            1 + Math.cos(t * 2.5) * 0.02, 
            1 + Math.sin(t * 3) * 0.02
        );

        // 4. Stators pulse and counter-rotate slightly or shift phase
        statorGroup.rotation.y = t * 0.1;
        statorGroup.children.forEach((stator, index) => {
            // Emulate drawing energy
            if (stator.material.emissive) {
                stator.material.emissiveIntensity = 2 + Math.sin(t * 10 + index) * 1.5;
            }
        });

        // 5. Plasma Streams Animation (The Penrose Process)
        // Blue streams move outward from anvils to scoops
        // Purple streams move inward from anvils to event horizon
        plasmaStreams.forEach((streamData, index) => {
            // update progress
            streamData.progress += 0.01 * speed * (index % 2 === 0 ? 1 : 1.5);
            if (streamData.progress > 1) {
                streamData.progress = 0; // reset
            }

            const p = streamData.progress;
            const isEscaping = (index % 2 === 0);
            
            // Map index to a specific injector/anvil angle
            const injectorIndex = Math.floor(index / 2);
            const baseAngle = (injectorIndex / injectorCount) * Math.PI * 2;
            const currentAngle = baseAngle + (t * 0.05); // account for hub rotation

            const anvilPos = new THREE.Vector3(
                Math.cos(currentAngle) * (bhRadius * 1.3), 
                0, 
                Math.sin(currentAngle) * (bhRadius * 1.3)
            );

            if (isEscaping) {
                // Moving to scoops
                // Scoop is slightly offset in angle
                const scoopAngle = currentAngle + (Math.PI / injectorCount);
                const scoopPos = new THREE.Vector3(
                    Math.cos(scoopAngle) * 140, 
                    20, 
                    Math.sin(scoopAngle) * 140
                );
                
                // Interpolate
                streamData.mesh.position.lerpVectors(anvilPos, scoopPos, p);
                streamData.mesh.lookAt(scoopPos);
                // Pulse size to show extreme energy
                streamData.mesh.scale.setScalar(1 + p * 2);
            } else {
                // Moving to event horizon (falling in)
                const centerPos = new THREE.Vector3(0, 0, 0);
                // Plunging orbit curves in direction of rotation
                const plungeAngle = currentAngle + (p * Math.PI / 2);
                const currentRadius = (bhRadius * 1.3) * (1 - p);
                
                streamData.mesh.position.set(
                    Math.cos(plungeAngle) * currentRadius,
                    0,
                    Math.sin(plungeAngle) * currentRadius
                );
                streamData.mesh.lookAt(centerPos);
                // Shrink as it approaches horizon
                streamData.mesh.scale.setScalar(1 - p * 0.8);
            }
        });

        // 6. Coil Magnetic Confinement Pulsing
        coilGroup.children.forEach((coil, index) => {
            const scaleOffset = Math.sin(t * 8 + index * 2) * 0.05;
            coil.scale.set(1 + scaleOffset, 1 + scaleOffset, 1 + scaleOffset);
        });

        // 7. Tachyon Relays blinking randomly
        tachyonGroup.children.forEach(relay => {
            const core = relay.children[0];
            if(Math.random() > 0.95) {
                core.material.emissiveIntensity = 10;
            } else {
                core.material.emissiveIntensity = 2;
            }
        });

        // 8. Event Horizon absolute rotation
        eventHorizon.rotation.y = t * 1.2;
    }

    // ============================================================================
    // RETURN OBJECT
    // ============================================================================
    return {
        group,
        parts,
        description: "The Penrose Process Turbine is an ultra-god-tier class megastructure built around an extreme Kerr (rotating) black hole. By injecting massive payloads of matter into the black hole's ergosphere and forcing them to split at highly relativistic speeds, the machine ensures one fragment falls into the black hole with negative energy (relative to a distant observer) while the other escapes with greater mass-energy than the original payload. The resulting high-energy plasma is caught by the scoops and converted into useful work. This represents the absolute pinnacle of Type III civilization engineering, extracting energy directly from the angular momentum of spacetime itself.",
        quizQuestions,
        animate
    };
}
