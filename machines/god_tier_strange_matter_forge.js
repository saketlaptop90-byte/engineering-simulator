import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    
    // Extreme Animation State Tracking
    const anim = {
        wheels: [],
        rings: [],
        crushers: [],
        pistons: [],
        particles: [],
        plasmaPipes: [],
        core: null,
        coreShells: [],
        timeOffset: 0
    };

    // Custom High-Tech Glowing Materials
    const strangeGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 8.0,
        wireframe: true,
        transparent: true,
        opacity: 0.85
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        roughness: 0.1,
        metalness: 1.0
    });

    const intenseCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaaff,
        emissiveIntensity: 12.0,
        roughness: 0.0,
        metalness: 0.8
    });

    const screenGlow = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3.0,
        roughness: 0.4
    });

    const hotMetal = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xcc2200,
        emissiveIntensity: 2.0,
        metalness: 0.9,
        roughness: 0.3
    });

    // --------------------------------------------------------
    // SUBSYSTEM 1: Colossal Off-Road Treads & Wheels
    // --------------------------------------------------------
    const NUM_WHEELS = 8;
    const WHEEL_RADIUS = 30;
    const WHEEL_TUBE = 10;
    const LUGS_PER_WHEEL = 144;
    
    function createTreadLug() {
        const shape = new THREE.Shape();
        shape.moveTo(-3, -1);
        shape.lineTo(0, 2);
        shape.lineTo(3, -1);
        shape.lineTo(2, -2);
        shape.lineTo(0, 0);
        shape.lineTo(-2, -2);
        shape.lineTo(-3, -1);

        const extrudeSettings = { depth: WHEEL_TUBE * 1.8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, rubber);
    }

    function createWheel(x, y, z) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);

        // Main Tire Torus
        const tireGeo = new THREE.TorusGeometry(WHEEL_RADIUS, WHEEL_TUBE, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);

        // Hundreds of tiny extruded lugs
        const lugTemplate = createTreadLug();
        for (let i = 0; i < LUGS_PER_WHEEL; i++) {
            const angle = (i / LUGS_PER_WHEEL) * Math.PI * 2;
            const lug = lugTemplate.clone();
            
            // Position along the circumference
            lug.position.x = Math.cos(angle) * (WHEEL_RADIUS + WHEEL_TUBE - 0.5);
            lug.position.y = Math.sin(angle) * (WHEEL_RADIUS + WHEEL_TUBE - 0.5);
            
            // Rotate to face outward
            lug.rotation.z = angle + Math.PI / 2;
            
            // Alternate lug alignment for aggressive V-tread
            if (i % 2 === 0) {
                lug.position.z = -WHEEL_TUBE / 3;
                lug.rotation.x = Math.PI / 12;
            } else {
                lug.position.z = WHEEL_TUBE / 3;
                lug.rotation.x = -Math.PI / 12;
            }
            wheelGroup.add(lug);
        }

        // Complex Rim with CylinderGeometry Spoke Arrays
        const rimGeo = new THREE.CylinderGeometry(WHEEL_RADIUS - WHEEL_TUBE + 1, WHEEL_RADIUS - WHEEL_TUBE + 1, WHEEL_TUBE * 1.5, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        const hubGeo = new THREE.CylinderGeometry(WHEEL_RADIUS / 4, WHEEL_RADIUS / 4, WHEEL_TUBE * 1.8, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        for (let j = 0; j < 24; j++) {
            const spokeAngle = (j / 24) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.8, 1.2, WHEEL_RADIUS - WHEEL_TUBE, 16);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = spokeAngle;
            spoke.rotation.x = Math.PI / 2;
            spoke.position.set(
                Math.cos(spokeAngle) * (WHEEL_RADIUS / 2),
                Math.sin(spokeAngle) * (WHEEL_RADIUS / 2),
                0
            );
            wheelGroup.add(spoke);
        }

        group.add(wheelGroup);
        anim.wheels.push(wheelGroup);
        return wheelGroup;
    }

    // Generate 8 massive wheels
    const wheelX = 70;
    const wheelZ = 120;
    createWheel(wheelX, WHEEL_RADIUS, wheelZ);
    createWheel(-wheelX, WHEEL_RADIUS, wheelZ);
    createWheel(wheelX, WHEEL_RADIUS, wheelZ * 0.33);
    createWheel(-wheelX, WHEEL_RADIUS, wheelZ * 0.33);
    createWheel(wheelX, WHEEL_RADIUS, -wheelZ * 0.33);
    createWheel(-wheelX, WHEEL_RADIUS, -wheelZ * 0.33);
    createWheel(wheelX, WHEEL_RADIUS, -wheelZ);
    createWheel(-wheelX, WHEEL_RADIUS, -wheelZ);

    // --------------------------------------------------------
    // SUBSYSTEM 2: Massive Chassis & Hexagonal Framework
    // --------------------------------------------------------
    function createHexBeam(length, radius) {
        const geo = new THREE.CylinderGeometry(radius, radius, length, 6);
        const mesh = new THREE.Mesh(geo, darkSteel);
        return mesh;
    }

    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = WHEEL_RADIUS + 20;
    group.add(chassisGroup);

    // Main longitudinal beams
    for(let i=0; i<4; i++) {
        const beam = createHexBeam(320, 4);
        beam.rotation.x = Math.PI / 2;
        beam.position.set(-45 + i*30, 0, 0);
        chassisGroup.add(beam);
    }

    // Cross beams
    for(let i=0; i<12; i++) {
        const cross = createHexBeam(100, 3.5);
        cross.rotation.z = Math.PI / 2;
        cross.position.set(0, 0, -150 + i*27);
        chassisGroup.add(cross);
    }

    // Diagonal lattice support struts
    for(let i=0; i<11; i++) {
        const zPos = -136.5 + i*27;
        const diag1 = createHexBeam(35, 2);
        diag1.rotation.x = Math.PI / 2;
        diag1.rotation.y = Math.PI / 4;
        diag1.position.set(-15, 0, zPos);
        chassisGroup.add(diag1);
        
        const diag2 = createHexBeam(35, 2);
        diag2.rotation.x = Math.PI / 2;
        diag2.rotation.y = -Math.PI / 4;
        diag2.position.set(15, 0, zPos);
        chassisGroup.add(diag2);
    }

    // Floor Grating (Multi-layered thin grids)
    const floorGeo = new THREE.CylinderGeometry(80, 80, 2, 8);
    const floorMesh = new THREE.Mesh(floorGeo, steel);
    floorMesh.position.y = 10;
    chassisGroup.add(floorMesh);

    // Exhaust Stacks
    for(let i=0; i<4; i++) {
        const exhaust = new THREE.Group();
        
        const pipeGeo = new THREE.CylinderGeometry(3, 4, 60, 16);
        const pipe = new THREE.Mesh(pipeGeo, chrome);
        pipe.position.y = 30;
        exhaust.add(pipe);

        const capGeo = new THREE.CylinderGeometry(4.5, 4.5, 5, 16);
        const cap = new THREE.Mesh(capGeo, hotMetal);
        cap.position.y = 60;
        exhaust.add(cap);

        exhaust.position.set(i % 2 === 0 ? 55 : -55, 10, i < 2 ? 80 : -80);
        chassisGroup.add(exhaust);
    }

    // --------------------------------------------------------
    // SUBSYSTEM 3: Strange Matter Core & Magnetic Rings
    // --------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, WHEEL_RADIUS + 70, 0);
    group.add(coreGroup);

    // The Impossibly Dense Core
    const coreGeo = new THREE.IcosahedronGeometry(15, 4);
    const core = new THREE.Mesh(coreGeo, intenseCoreMaterial);
    coreGroup.add(core);
    anim.core = core;

    // Energy Shells
    for(let i=1; i<=3; i++) {
        const shellGeo = new THREE.IcosahedronGeometry(15 + i*4, 3);
        const shell = new THREE.Mesh(shellGeo, strangeGlow);
        coreGroup.add(shell);
        anim.coreShells.push({mesh: shell, speed: i * 0.02, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()});
    }

    // Magnetic Containment Rings (Colossal TorusKnots & Tori)
    const ringColors = [0x00aaff, 0xff00aa, 0xaaff00, 0xffaa00, 0x00ffaa, 0xaa00ff];
    for(let i=0; i<6; i++) {
        const ringGeo = new THREE.TorusKnotGeometry(35 + i*5, 1.5, 256, 32, 2, 3 + (i%3));
        
        const ringMat = new THREE.MeshStandardMaterial({
            color: ringColors[i],
            emissive: ringColors[i],
            emissiveIntensity: 2.0,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        coreGroup.add(ring);
        
        anim.rings.push({
            mesh: ring,
            axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
            speed: 0.01 + (Math.random() * 0.02)
        });
    }

    // Swirling Particle Cloud
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        const r = 60 + Math.random() * 40;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        particlePositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i*3+2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.6 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particleSystem);
    anim.particles.push(particleSystem);

    // --------------------------------------------------------
    // SUBSYSTEM 4: Gravitational Crushers & Hydraulics
    // --------------------------------------------------------
    function createHydraulicCylinder(radius, length) {
        const cylGroup = new THREE.Group();
        
        // Outer housing
        const housingGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
        const housing = new THREE.Mesh(housingGeo, steel);
        cylGroup.add(housing);

        // Fluid ports
        const portGeo = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, radius * 2.5, 8);
        const port1 = new THREE.Mesh(portGeo, copper);
        port1.rotation.z = Math.PI / 2;
        port1.position.y = length / 2 - radius;
        cylGroup.add(port1);

        const port2 = port1.clone();
        port2.position.y = -length / 2 + radius;
        cylGroup.add(port2);

        // Inner Rod
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length / 2;
        cylGroup.add(rod);

        return { group: cylGroup, rod: rod };
    }

    const CRUSHER_COUNT = 12;
    for(let i=0; i<CRUSHER_COUNT; i++) {
        const crusherGroup = new THREE.Group();
        const angle = (i / CRUSHER_COUNT) * Math.PI * 2;
        
        crusherGroup.rotation.y = angle;
        
        // Base Pivot Mount
        const mountGeo = new THREE.BoxGeometry(10, 15, 10); // Extruded-like shape functionally
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.position.set(0, 0, 90);
        crusherGroup.add(mount);

        // Primary Boom
        const boomGeo = new THREE.CylinderGeometry(4, 6, 45, 8);
        const boom = new THREE.Mesh(boomGeo, aluminum);
        boom.rotation.x = Math.PI / 2;
        boom.position.set(0, 0, 65);
        crusherGroup.add(boom);

        // Crusher Pad
        const padGeo = new THREE.CylinderGeometry(12, 10, 8, 16);
        const pad = new THREE.Mesh(padGeo, hotMetal);
        pad.rotation.x = Math.PI / 2;
        pad.position.set(0, 0, 35);
        crusherGroup.add(pad);

        // Twin Hydraulic Pistons
        const leftHydraulic = createHydraulicCylinder(2.5, 25);
        leftHydraulic.group.position.set(-6, 0, 75);
        leftHydraulic.group.rotation.x = Math.PI / 2;
        crusherGroup.add(leftHydraulic.group);

        const rightHydraulic = createHydraulicCylinder(2.5, 25);
        rightHydraulic.group.position.set(6, 0, 75);
        rightHydraulic.group.rotation.x = Math.PI / 2;
        crusherGroup.add(rightHydraulic.group);

        coreGroup.add(crusherGroup);
        
        anim.crushers.push({
            group: crusherGroup,
            boom: boom,
            pad: pad,
            pistons: [leftHydraulic.rod, rightHydraulic.rod],
            baseOffset: 35,
            phaseOffset: i * 0.5
        });
    }

    // --------------------------------------------------------
    // SUBSYSTEM 5: Hydraulic Lines & Quark-Gluon Injectors
    // --------------------------------------------------------
    class CustomSplineCurve extends THREE.Curve {
        constructor(points) {
            super();
            this.points = points;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const index = (this.points.length - 1) * t;
            const i = Math.floor(index);
            const f = index - i;
            if (i >= this.points.length - 1) return optionalTarget.copy(this.points[this.points.length - 1]);
            return optionalTarget.copy(this.points[i]).lerp(this.points[i + 1], f);
        }
    }

    // Create complex tangled piping around the core
    for(let i=0; i<8; i++) {
        const points = [];
        let curR = 80;
        let curY = -40;
        let angle = i * (Math.PI / 4);
        
        for(let j=0; j<10; j++) {
            points.push(new THREE.Vector3(
                Math.cos(angle) * curR,
                curY,
                Math.sin(angle) * curR
            ));
            curR -= 3 + Math.random() * 4;
            curY += 8 + Math.random() * 5;
            angle += 0.5 + Math.random() * 0.5;
        }

        const pipeCurve = new THREE.CatmullRomCurve3(points);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 64, 1.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        coreGroup.add(pipe);
    }

    // Plasma Injector Tubes (Glowing)
    for(let i=0; i<4; i++) {
        const points = [];
        let angle = i * (Math.PI / 2);
        points.push(new THREE.Vector3(Math.cos(angle)*120, -80, Math.sin(angle)*120));
        points.push(new THREE.Vector3(Math.cos(angle)*90, -20, Math.sin(angle)*90));
        points.push(new THREE.Vector3(Math.cos(angle)*60, 0, Math.sin(angle)*60));
        points.push(new THREE.Vector3(Math.cos(angle)*30, 20, Math.sin(angle)*30));

        const injCurve = new THREE.CatmullRomCurve3(points);
        const injGeo = new THREE.TubeGeometry(injCurve, 64, 2.5, 12, false);
        const injector = new THREE.Mesh(injGeo, plasmaMaterial);
        coreGroup.add(injector);
        anim.plasmaPipes.push(injector);
    }

    // --------------------------------------------------------
    // SUBSYSTEM 6: Operator Control Cabin
    // --------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, WHEEL_RADIUS + 90, 110);
    group.add(cabinGroup);

    // Cabin Shell (Extruded aerodynamic / high-tech pod)
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-15, 0);
    cabinShape.lineTo(15, 0);
    cabinShape.lineTo(20, 20);
    cabinShape.lineTo(10, 35);
    cabinShape.lineTo(-10, 35);
    cabinShape.lineTo(-20, 20);
    cabinShape.lineTo(-15, 0);
    
    const cabinExtrude = { depth: 40, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    cabinGeo.center();
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    // Tinted Glass Windshield
    const glassGeo = new THREE.CylinderGeometry(18, 18, 30, 8, 1, false, 0, Math.PI);
    const windshield = new THREE.Mesh(glassGeo, tinted);
    windshield.rotation.z = Math.PI / 2;
    windshield.position.set(0, 5, 20);
    cabinGroup.add(windshield);

    // Glowing Control Panels inside
    const panelGeo = new THREE.CylinderGeometry(5, 5, 15, 4);
    const panel = new THREE.Mesh(panelGeo, screenGlow);
    panel.rotation.z = Math.PI / 2;
    panel.position.set(0, -5, 15);
    cabinGroup.add(panel);

    // Joysticks
    const joyBaseGeo = new THREE.CylinderGeometry(1, 1, 2, 8);
    const joyBase = new THREE.Mesh(joyBaseGeo, darkSteel);
    joyBase.position.set(-5, -2, 10);
    cabinGroup.add(joyBase);
    
    const joyStickGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
    const joyStick = new THREE.Mesh(joyStickGeo, plastic);
    joyStick.position.set(-5, 1, 10);
    joyStick.rotation.x = Math.PI / 8;
    cabinGroup.add(joyStick);

    // --------------------------------------------------------
    // SUBSYSTEM 7: Power Pylons & Subatomic Sensors
    // --------------------------------------------------------
    for(let i=0; i<4; i++) {
        const pylonGroup = new THREE.Group();
        const angle = i * (Math.PI / 2) + Math.PI/4;
        const radius = 100;
        
        pylonGroup.position.set(Math.cos(angle)*radius, WHEEL_RADIUS + 40, Math.sin(angle)*radius);

        const baseGeo = new THREE.CylinderGeometry(12, 16, 20, 8);
        const pBase = new THREE.Mesh(baseGeo, darkSteel);
        pylonGroup.add(pBase);

        const towerGeo = new THREE.CylinderGeometry(4, 8, 80, 8);
        const tower = new THREE.Mesh(towerGeo, aluminum);
        tower.position.y = 50;
        pylonGroup.add(tower);

        const emitterGeo = new THREE.IcosahedronGeometry(6, 1);
        const emitter = new THREE.Mesh(emitterGeo, strangeGlow);
        emitter.position.y = 95;
        pylonGroup.add(emitter);

        group.add(pylonGroup);
    }

    // --------------------------------------------------------
    // PARTS ARRAY DEFINITION (Massive Detail)
    // --------------------------------------------------------
    parts.push({
        name: "Strange Quark Matter Core",
        description: "An impossibly dense sphere of stable strangelets. Maintained at absolute zero pressure via quantum chromodynamic locking. Emits a blinding exotic radiation signature.",
        material: "intenseCoreMaterial (Custom)",
        function: "Transmutes ordinary hadronic matter into stable strange quark matter, releasing colossal energy.",
        assemblyOrder: 1,
        connections: ["Magnetic Containment Rings", "Gravitational Crushers", "Quark-Gluon Plasma Injectors"],
        failureEffect: "Instantaneous strangelet conversion cascade, consuming the planet in milliseconds.",
        cascadeFailures: ["Containment Field Collapse", "Planetary Assimilation"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 70, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    for(let i=1; i<=12; i++) {
        parts.push({
            name: `Gravitational Crusher Arm ${i}`,
            description: `Massive articulating hydraulic press. Capable of exerting pressures exceeding the core of a neutron star (10^34 Pascals).`,
            material: "aluminum, darkSteel, hotMetal",
            function: "Compresses incoming atomic nuclei past the neutron drip line to force hyperon formation.",
            assemblyOrder: i + 1,
            connections: ["Core Vessel", "Primary Hydraulic Manifold"],
            failureEffect: "Asymmetric core pressure, leading to deadly strangelet micro-jets breaching the hull.",
            cascadeFailures: ["Hydraulic Line Rupture", "Operator Vaporization"],
            originalPosition: { x: 0, y: WHEEL_RADIUS + 70, z: 0 },
            explodedPosition: { x: Math.cos((i/12)*Math.PI*2)*150, y: 150, z: Math.sin((i/12)*Math.PI*2)*150 }
        });
    }

    parts.push({
        name: "Magnetic Containment Rings",
        description: "Six interlocking superconducting TorusKnots generating a 500 Tera-Tesla magnetic field.",
        material: "Custom StandardMaterial (Multi-color emissive)",
        function: "Confines the charged strangelet surface plasma, preventing it from touching the physical crusher pads.",
        assemblyOrder: 15,
        connections: ["Core Vessel", "Superconducting Coils"],
        failureEffect: "Magnetic reconnection event releasing energy equivalent to a small solar flare.",
        cascadeFailures: ["EMP Blast", "Total Sensor Blackout"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 70, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    parts.push({
        name: "Quark-Gluon Plasma Injectors",
        description: "High-pressure tubing delivering superheated QGP directly to the core boundary layer.",
        material: "plasmaMaterial (Custom)",
        function: "Provides the necessary extreme thermal environment to temporarily melt hadronic boundaries.",
        assemblyOrder: 16,
        connections: ["Heat Exchangers", "Core Vessel"],
        failureEffect: "QGP leak causing immediate local vaporization of all baryonic matter.",
        cascadeFailures: ["Chassis Melting", "Atmospheric Ignition"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 70, z: 0 },
        explodedPosition: { x: -100, y: 200, z: -100 }
    });

    parts.push({
        name: "Mega-Tread Wheel Assemblies",
        description: "Eight colossal wheels with aggressive rubber chevron lugs and complex cylindrical spoke rims.",
        material: "rubber, darkSteel, chrome",
        function: "Provides mobility to the Forge, allowing it to traverse apocalyptic wastelands to seek out raw matter.",
        assemblyOrder: 17,
        connections: ["Suspension A-Arms", "Axle Hubs"],
        failureEffect: "Immobilization of the multi-megaton facility, causing it to sink into the Earth's crust.",
        cascadeFailures: ["Chassis Stress Fracture", "Seismic Anomalies"],
        originalPosition: { x: 0, y: WHEEL_RADIUS, z: 0 },
        explodedPosition: { x: 200, y: WHEEL_RADIUS, z: 200 }
    });

    parts.push({
        name: "Hexagonal Lattice Chassis",
        description: "Hundreds of interconnected heavy dark steel hexagonal beams forming the main superstructure.",
        material: "darkSteel",
        function: "Supports the millions of tons of equipment and prevents structural warping under extreme gravity gradients.",
        assemblyOrder: 18,
        connections: ["Mega-Tread Wheel Assemblies", "Operator Control Cabin", "Power Pylons"],
        failureEffect: "Structural collapse under its own induced gravity.",
        cascadeFailures: ["Total System Pancaking"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 20, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    parts.push({
        name: "Operator Control Cabin",
        description: "A heavily armored, lead-lined pod with tinted glass and glowing multi-function displays.",
        material: "steel, tinted glass, plastic",
        function: "Houses the brave/foolish scientists controlling the transmutation process via analog joysticks.",
        assemblyOrder: 19,
        connections: ["Hexagonal Lattice Chassis", "Data Uplink Trunk"],
        failureEffect: "Lethal radiation exposure to the crew.",
        cascadeFailures: ["Loss of Manual Override", "Rogue Core Expansion"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 90, z: 110 },
        explodedPosition: { x: 0, y: 400, z: 400 }
    });

    parts.push({
        name: "Tachyon Power Pylons",
        description: "Four massive towers capped with strange-glowing icosahedral emitters.",
        material: "aluminum, darkSteel, strangeGlow",
        function: "Broadcasts stabilizing tachyon fields to prevent the strange matter from decaying into regular hadrons during power fluctuations.",
        assemblyOrder: 20,
        connections: ["Hexagonal Lattice Chassis", "Core Control Systems"],
        failureEffect: "Temporal causality breakdown in the immediate vicinity.",
        cascadeFailures: ["Chronological Inconsistencies", "Spontaneous Component Reassembly"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 40, z: 0 },
        explodedPosition: { x: 300, y: 300, z: -300 }
    });

    parts.push({
        name: "Hydraulic Fluid Reservoirs",
        description: "Massive tanks holding specialized ultra-dense non-Newtonian hydraulic fluid.",
        material: "copper, steel",
        function: "Provides the immense hydrostatic pressure required by the Gravitational Crusher Arms.",
        assemblyOrder: 21,
        connections: ["Gravitational Crusher Arms", "Hydraulic Pumps"],
        failureEffect: "Loss of crushing pressure, causing the core to bounce back and shatter the containment vessel.",
        cascadeFailures: ["Catastrophic Decompression"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 40, z: 0 },
        explodedPosition: { x: -300, y: 100, z: 300 }
    });

    parts.push({
        name: "Muon Shielding Floor Grates",
        description: "Multi-layered steel grating covering the main chassis.",
        material: "steel",
        function: "Provides a walking surface while absorbing deadly high-energy muons ejected from the forge.",
        assemblyOrder: 22,
        connections: ["Hexagonal Lattice Chassis"],
        failureEffect: "Crew members falling into the machinery or suffering severe radiation burns.",
        cascadeFailures: ["Bio-Hazard Alarm Trip"],
        originalPosition: { x: 0, y: WHEEL_RADIUS + 30, z: 0 },
        explodedPosition: { x: 0, y: 50, z: -400 }
    });

    // --------------------------------------------------------
    // PhD-Level Particle Physics Quiz Questions
    // --------------------------------------------------------
    const quizQuestions = [
        {
            question: "The Bodmer-Witten hypothesis proposes that strange quark matter is the true ground state of hadronic matter. Under this assumption, which of the following mechanisms prevents the immediate spontaneous conversion of all ordinary nuclei into strangelets at zero temperature and pressure?",
            options: [
                "The strong force potential well prevents flavor changing neutral currents across the boundary.",
                "Coulomb barrier repulsion and the finite size effects (surface tension) of small strangelets.",
                "Color confinement entirely suppresses the weak interaction at low temperatures.",
                "The mass of the strange quark inherently exceeds the binding energy per nucleon of Iron-56."
            ],
            correctAnswer: 1,
            explanation: "Ordinary nuclei are metastable. Conversion to SQM requires simultaneous weak decays to produce strange quarks. The immense Coulomb barrier of a macroscopic strangelet and the positive surface energy (finite size effects) create a huge energy barrier preventing spontaneous fusion/conversion."
        },
        {
            question: "In the exploration of the QCD phase diagram, the Color-Flavor Locked (CFL) phase is predicted to occur at asymptotic densities. What are the distinctive features of the CFL phase concerning chiral symmetry and superconductivity?",
            options: [
                "Chiral symmetry is restored, and only the up and down quarks form a color superconductor.",
                "It completely breaks chiral symmetry while simultaneously forming a color superconductor where all three colors and three light flavors pair.",
                "Chiral symmetry remains unbroken, but it exhibits standard electromagnetic superconductivity via electron-phonon interactions.",
                "It is an insulating phase where gluons acquire an infinite mass, confining quarks completely."
            ],
            correctAnswer: 1,
            explanation: "At ultra-high densities, the CFL phase forms where quarks of all three colors and three flavors (u, d, s) pair up in a highly symmetric manner. This pairing explicitly breaks chiral symmetry, analogous to the chiral condensate in the vacuum, making it a unique state of matter."
        },
        {
            question: "During the creation of a Quark-Gluon Plasma (QGP) in heavy-ion collisions, elliptic flow (v2) is a critical observable. What does a large elliptic flow indicate about the nature of the produced QGP?",
            options: [
                "It indicates the QGP behaves as a weakly interacting gas of free quarks and gluons.",
                "It indicates the QGP behaves as a strongly interacting, nearly perfect fluid with a very low shear viscosity to entropy density ratio (η/s).",
                "It signifies that chiral magnetic effects have completely polarized the strange quarks.",
                "It proves that the collision did not reach the critical temperature for deconfinement."
            ],
            correctAnswer: 1,
            explanation: "A large elliptic flow means the initial spatial anisotropy of the overlapping nuclei is efficiently converted into momentum anisotropy. This requires strong interactions and rapid thermalization, characteristic of a 'perfect liquid' with minimal viscosity, rather than a free gas."
        },
        {
            question: "Within the phenomenological MIT Bag Model, how does the Bag Constant (B) mathematically contribute to the energy density of a postulated strangelet?",
            options: [
                "It provides an attractive negative energy term that binds the quarks together universally.",
                "It represents the vacuum energy density difference between the perturbative QCD vacuum inside the bag and the non-perturbative true vacuum outside, adding a positive volume energy term.",
                "It accounts for the kinetic energy of the massless gluons exchanged between the strange quarks.",
                "It is a surface tension parameter that only applies to the boundary layer of the strangelet."
            ],
            correctAnswer: 1,
            explanation: "The Bag Constant B is an energy penalty per unit volume for creating the 'bubble' of perturbative vacuum where quarks are asymptotically free. It acts as an inward pressure confining the quarks, balanced by the outward kinetic pressure of the quarks."
        },
        {
            question: "Astrophysical observations of massive (~2 solar mass) pulsars tightly constrain neutron star equations of state (EoS). How does the theoretical appearance of hyperons in the core typically affect the EoS, giving rise to the 'Hyperon Puzzle'?",
            options: [
                "It severely softens the EoS, drastically lowering the maximum theoretical mass, making it difficult to explain the existence of 2-solar-mass neutron stars.",
                "It drastically stiffens the EoS, predicting maximum masses well above 3 solar masses, contradicting black hole formation rates.",
                "It causes immediate gravitational collapse regardless of mass due to strange quark decay.",
                "It catalyzes the immediate formation of a naked singularity by violating the null energy condition."
            ],
            correctAnswer: 0,
            explanation: "The appearance of new degrees of freedom (like hyperons) at high densities relieves Fermi pressure, which 'softens' the equation of state. A softer EoS cannot support as much mass against gravity, struggling to explain observed 2-solar-mass pulsars unless offset by unknown strong repulsive forces."
        }
    ];

    // --------------------------------------------------------
    // EXTREME ANIMATION LOGIC
    // --------------------------------------------------------
    function animate(time, speed, meshes) {
        anim.timeOffset += speed * 0.016; // Assuming ~60fps step
        const t = anim.timeOffset;

        // 1. Rotate Mega-Treads (Wheels)
        anim.wheels.forEach(wheel => {
            wheel.rotation.x = t * 2.0; // Fast rotation
        });

        // 2. Complex Magnetic Ring Gyration
        anim.rings.forEach(ringObj => {
            ringObj.mesh.rotateOnAxis(ringObj.axis, ringObj.speed * speed);
        });

        // 3. Core Pulsation
        if (anim.core) {
            const scalePulse = 1.0 + Math.sin(t * 5.0) * 0.1;
            anim.core.scale.set(scalePulse, scalePulse, scalePulse);
            
            // Pulse emissive intensity
            intenseCoreMaterial.emissiveIntensity = 12.0 + Math.sin(t * 10.0) * 4.0;
        }

        // 4. Core Shells Counter-Rotation
        anim.coreShells.forEach(shellObj => {
            shellObj.mesh.rotateOnAxis(shellObj.axis, shellObj.speed * speed);
            const sPulse = 1.0 + Math.cos(t * 3.0 + shellObj.speed * 100) * 0.05;
            shellObj.mesh.scale.set(sPulse, sPulse, sPulse);
        });

        // 5. Gravitational Crusher Articulation (Sine wave driven hydraulics)
        anim.crushers.forEach((crusherObj, index) => {
            // Complex pressing motion
            const pressCycle = Math.sin(t * 3.0 + crusherObj.phaseOffset);
            
            // Move the pressing pad inward and outward
            const pressDist = crusherObj.baseOffset - (pressCycle * 10);
            crusherObj.pad.position.z = pressDist;
            
            // Adjust the boom to follow the pad (simplistic IK approximation)
            crusherObj.boom.position.z = pressDist + 20;

            // Animate the hydraulic pistons extending/retracting
            crusherObj.pistons.forEach(rod => {
                rod.position.y = 12.5 + (pressCycle * 5); // Extend/retract rod
            });
            
            // Change pad color based on pressure
            if (crusherObj.pad.material.emissive) {
                const heat = Math.max(0, pressCycle);
                crusherObj.pad.material.emissiveIntensity = 2.0 + heat * 5.0;
            }
        });

        // 6. Swirling Particle Cloud
        anim.particles.forEach(ps => {
            ps.rotation.y = t * 0.5;
            ps.rotation.z = Math.sin(t * 0.2) * 0.2;
        });

        // 7. Plasma Injector Flow Effect (Simulated via emissive pulsing)
        anim.plasmaPipes.forEach((pipe, idx) => {
            // A wave moving along the pipes
            const flow = Math.sin(t * 10.0 + idx * 1.5) * 0.5 + 0.5;
            pipe.material.emissiveIntensity = 2.0 + flow * 8.0;
        });
    }

    return { group, parts, description: "Ultra God Tier Strange Matter Forge. A mobile, multi-megaton facility utilizing immense gravitational crushers, superconducting magnetic confinement rings, and high-pressure quark-gluon plasma injectors to force atomic nuclei into the absolute ground state of hadronic matter: stable strangelets. Features colossal off-road treads, extremely complex articulated hydraulics, and blindingly intense glowing core mechanics.", quizQuestions, animate };
}
