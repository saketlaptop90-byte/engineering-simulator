import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD-TIER NAKED SINGULARITY HARVESTER
 * ------------------------------------
 * WARNING: This file defines a cosmic-scale machine designed to extract infinite energy 
 * from a naked singularity, a region of spacetime where general relativity completely 
 * breaks down and cosmic censorship is violated. 
 * 
 * The singularity possesses infinite density, zero volume, and a divergent curvature 
 * tensor, lacking any event horizon to protect the causal structure of the universe.
 * 
 * Features:
 * - Extreme Kerr ring singularity (a > M).
 * - Ergosphere Penrose-process extraction nodes.
 * - Cauchy horizon mass-inflation stabilizers.
 * - Tachyon conduction networks.
 * - Exotic matter (negative energy) injectors to maintain the exposed state.
 * - Closed Timelike Curve (CTC) chronology protection fields.
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Dictionary to hold references to dynamically animated components
    const anim = {
        core: null,
        kerrRing: null,
        particles: null,
        stabilizers: [],
        injectors: [],
        baffles: [],
        siphons: [],
        coils: [],
        struts: [],
        timeField: null,
        frame: null,
        rotors: [],
        pistons: [],
        energyNodes: []
    };

    // ==========================================
    // 1. ADVANCED CUSTOM MATERIALS
    // ==========================================

    const matSingularityCore = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xeeffff,
        emissiveIntensity: 50,
        metalness: 1.0,
        roughness: 0.0,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95
    });

    const matKerrRing = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveIntensity: 100,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const matExoticMatter = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        emissive: 0x4400aa,
        emissiveIntensity: 5,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 2.5
    });

    const matTachyonGlow = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const matChronologyShield = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        transmission: 0.95,
        opacity: 1,
        transparent: true,
        roughness: 0.0,
        ior: 1.1,
        thickness: 2.0,
        emissive: 0x002244,
        emissiveIntensity: 0.5
    });

    const matHighTempPlasma = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const matDarkStructure = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.5
    });

    const matGoldFoil = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 1.0,
        roughness: 0.3,
        bumpScale: 0.05
    });

    const matHydraulicFluid = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        transmission: 0.8,
        transparent: true,
        roughness: 0.1
    });

    const matNeonAccent = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 4
    });

    const matSuperconductor = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 1.0,
        roughness: 0.5,
        emissive: 0x001122,
        emissiveIntensity: 1
    });

    const matWarningStripes = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        roughness: 0.8,
        metalness: 0.1
    });

    // ==========================================
    // 2. MATHEMATICAL CURVES FOR TUBE GEOMETRIES
    // ==========================================

    class TachyonConduitCurve extends THREE.Curve {
        constructor(scale = 1, phase = 0, frequency = 1) {
            super();
            this.scale = scale;
            this.phase = phase;
            this.frequency = frequency;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.frequency + this.phase;
            const r = 50 + Math.sin(t * Math.PI * 8) * 10;
            const x = Math.cos(angle) * r;
            const y = (t - 0.5) * 200;
            const z = Math.sin(angle) * r;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    class ErgosphereFlowCurve extends THREE.Curve {
        constructor(radius = 1, height = 1) {
            super();
            this.radius = radius;
            this.height = height;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // Toroidal spiral flow simulating Penrose process trajectories
            const u = t * Math.PI * 2 * 10; 
            const v = t * Math.PI * 2;
            const R = this.radius;
            const r = this.radius * 0.3;
            const x = (R + r * Math.cos(u)) * Math.cos(v);
            const y = r * Math.sin(u) + (t - 0.5) * this.height;
            const z = (R + r * Math.cos(u)) * Math.sin(v);
            return optionalTarget.set(x, y, z);
        }
    }

    class InjectorPathCurve extends THREE.Curve {
        constructor(startRadius, endRadius, height) {
            super();
            this.startRadius = startRadius;
            this.endRadius = endRadius;
            this.height = height;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const r = THREE.MathUtils.lerp(this.startRadius, this.endRadius, t);
            const y = THREE.MathUtils.lerp(this.height, 0, t);
            // Spiral inwards
            const angle = t * Math.PI * 4;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            return optionalTarget.set(x, y, z);
        }
    }

    // ==========================================
    // 3. COMPLEX GEOMETRY GENERATORS
    // ==========================================

    function createGearProfile(innerR, outerR, teeth, depth) {
        const shape = new THREE.Shape();
        for (let i = 0; i < teeth; i++) {
            const angle1 = (i / teeth) * Math.PI * 2;
            const angle2 = ((i + 0.4) / teeth) * Math.PI * 2;
            const angle3 = ((i + 0.6) / teeth) * Math.PI * 2;
            const angle4 = ((i + 1.0) / teeth) * Math.PI * 2;
            
            if (i === 0) shape.moveTo(Math.cos(angle1) * innerR, Math.sin(angle1) * innerR);
            else shape.lineTo(Math.cos(angle1) * innerR, Math.sin(angle1) * innerR);
            
            shape.lineTo(Math.cos(angle2) * innerR, Math.sin(angle2) * innerR);
            shape.lineTo(Math.cos(angle2) * outerR, Math.sin(angle2) * outerR);
            shape.lineTo(Math.cos(angle3) * outerR, Math.sin(angle3) * outerR);
            shape.lineTo(Math.cos(angle3) * innerR, Math.sin(angle3) * innerR);
            shape.lineTo(Math.cos(angle4) * innerR, Math.sin(angle4) * innerR);
        }
        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createLatheShell(radius, height, segments, waves) {
        const points = [];
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const r = radius + Math.sin(t * Math.PI * waves) * (radius * 0.1);
            const y = (t - 0.5) * height;
            points.push(new THREE.Vector2(r, y));
        }
        return new THREE.LatheGeometry(points, segments);
    }

    function createHydraulicPiston(length, radius) {
        const pGroup = new THREE.Group();
        
        // Base Cylinder
        const baseGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.position.y = length * 0.3;
        pGroup.add(baseMesh);

        // Rod
        const rodGeo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, length, 16);
        const rodMesh = new THREE.Mesh(rodGeo, chrome);
        rodMesh.position.y = length * 0.5;
        pGroup.add(rodMesh);
        
        // Fluid chamber window
        const windowGeo = new THREE.CylinderGeometry(radius * 1.05, radius * 1.05, length * 0.2, 16, 1, true);
        const windowMesh = new THREE.Mesh(windowGeo, glass);
        windowMesh.position.y = length * 0.3;
        pGroup.add(windowMesh);
        
        const fluidGeo = new THREE.CylinderGeometry(radius * 1.0, radius * 1.0, length * 0.18, 16);
        const fluidMesh = new THREE.Mesh(fluidGeo, matHydraulicFluid);
        fluidMesh.position.y = length * 0.3;
        pGroup.add(fluidMesh);

        // Connectors
        const connGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const conn1 = new THREE.Mesh(connGeo, steel);
        conn1.position.y = 0;
        const conn2 = new THREE.Mesh(connGeo, steel);
        conn2.position.y = length;
        
        pGroup.add(conn1);
        pGroup.add(conn2);

        return pGroup;
    }

    function createComplexTrussRing(radius, thickness, segments) {
        const tGroup = new THREE.Group();
        const mainTorusGeo = new THREE.TorusGeometry(radius, thickness, 16, segments);
        const mainTorus = new THREE.Mesh(mainTorusGeo, steel);
        mainTorus.rotation.x = Math.PI / 2;
        tGroup.add(mainTorus);

        // Add inner cross-bracing
        const strutGeo = new THREE.CylinderGeometry(thickness * 0.2, thickness * 0.2, radius * 2, 8);
        for(let i=0; i<segments/2; i++) {
            const strut = new THREE.Mesh(strutGeo, aluminum);
            strut.rotation.z = Math.PI / 2;
            strut.rotation.y = (i / (segments/2)) * Math.PI;
            tGroup.add(strut);
        }

        // Add outer nodes
        const nodeGeo = new THREE.BoxGeometry(thickness * 3, thickness * 3, thickness * 3);
        for(let i=0; i<segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const node = new THREE.Mesh(nodeGeo, darkSteel);
            node.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            node.lookAt(0,0,0);
            tGroup.add(node);
        }

        return tGroup;
    }

    function createSuperconductingCoilArray(radius, count) {
        const arrayGroup = new THREE.Group();
        const coilGeo = new THREE.TorusGeometry(20, 5, 32, 64);
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const coilGroup = new THREE.Group();
            
            const coil = new THREE.Mesh(coilGeo, matSuperconductor);
            // Wrap wire around the coil
            const wireCurve = new ErgosphereFlowCurve(20, 0); // Hack to get a spiral
            const wireGeo = new THREE.TubeGeometry(wireCurve, 200, 0.5, 8, true);
            const wire = new THREE.Mesh(wireGeo, copper);
            
            coilGroup.add(coil);
            coilGroup.add(wire);
            
            coilGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            coilGroup.rotation.y = -angle; // Face inward
            coilGroup.rotation.x = Math.PI / 2;
            
            arrayGroup.add(coilGroup);
            anim.coils.push(coilGroup);
        }
        return arrayGroup;
    }

    function createOperatorCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main Hull
        const hullShape = new THREE.Shape();
        hullShape.moveTo(0, 0);
        hullShape.lineTo(20, 0);
        hullShape.lineTo(25, 10);
        hullShape.lineTo(15, 20);
        hullShape.lineTo(5, 20);
        hullShape.lineTo(0, 10);
        hullShape.lineTo(0, 0);
        const extrudeSet = { depth: 15, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 };
        const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSet);
        const hull = new THREE.Mesh(hullGeo, steel);
        hull.position.set(-10, -10, -7.5);
        cabinGroup.add(hull);

        // Viewport
        const glassGeo = new THREE.BoxGeometry(22, 8, 16);
        const glassMesh = new THREE.Mesh(glassGeo, tinted);
        glassMesh.position.set(5, 5, 0);
        cabinGroup.add(glassMesh);
        
        // Antennas
        const antGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
        for(let i=0; i<3; i++) {
            const ant = new THREE.Mesh(antGeo, chrome);
            ant.position.set(-5 + i*5, 15, 0);
            cabinGroup.add(ant);
        }

        // Radar Dish
        const dishGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
        const dish = new THREE.Mesh(dishGeo, aluminum);
        dish.position.set(0, 12, 5);
        dish.rotation.x = Math.PI;
        cabinGroup.add(dish);

        return cabinGroup;
    }

    // ==========================================
    // 4. ASSEMBLY OF THE HARVESTER
    // ==========================================
    
    anim.frame = new THREE.Group();
    group.add(anim.frame);

    // --- PART 1: The Naked Singularity Core ---
    const coreGroup = new THREE.Group();
    
    const singularityGeo = new THREE.IcosahedronGeometry(1, 5);
    const singularity = new THREE.Mesh(singularityGeo, matSingularityCore);
    coreGroup.add(singularity);
    
    // Add glowing halo
    const haloGeo = new THREE.SphereGeometry(2, 32, 32);
    const halo = new THREE.Mesh(haloGeo, matTachyonGlow);
    coreGroup.add(halo);
    
    anim.frame.add(coreGroup);
    anim.core = coreGroup;

    parts.push({
        name: "Central Naked Singularity Core",
        description: "The exposed mathematically divergent point of infinite density. Operating without an event horizon, it emits lethal, highly-unpredictable bursts of raw spacetime curvature and chaotic radiation.",
        material: "Infinite Density Spacetime Anomaly",
        function: "The primary source of infinite energy and timeline manipulation.",
        assemblyOrder: 1,
        connections: ["Extreme Kerr Ring", "Chronology Protection Shield"],
        failureEffect: "Instantaneous timeline collapse and retrocausal erasure of the entire harvester facility.",
        cascadeFailures: ["Causality violation", "Universe segment deletion", "Spontaneous vacuum decay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // --- PART 2: Extreme Kerr Ring Singularity ---
    const kerrRingGeo = new THREE.TorusGeometry(5, 0.1, 16, 100);
    const kerrRing = new THREE.Mesh(kerrRingGeo, matKerrRing);
    kerrRing.rotation.x = Math.PI / 2;
    coreGroup.add(kerrRing);
    anim.kerrRing = kerrRing;

    parts.push({
        name: "Extreme Kerr Ring Singularity",
        description: "The infinitely dense, zero-thickness ring at the heart of the system where the metric diverges. Spun past the extreme limit (a > M), exposing closed timelike curves to the rest of the universe.",
        material: "Exposed Gravitational Singularity",
        function: "Allows extraction of rotational energy via the Penrose Process and provides access to non-local temporal states.",
        assemblyOrder: 2,
        connections: ["Singularity Core", "Ergosphere Siphons"],
        failureEffect: "Uncontrolled formation of Closed Timelike Curves, allowing paradoxes to propagate freely.",
        cascadeFailures: ["Chronology Protection Field failure", "Temporal loop induction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // --- PART 3: Quantum Spacetime Particle Field ---
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 50000;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    for(let i=0; i<particleCount*3; i+=3) {
        // Initial random spherical distribution
        const r = Math.random() * 200 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = r * Math.cos(phi);
        
        colorArray[i] = Math.random(); // R
        colorArray[i+1] = Math.random() * 0.5 + 0.5; // G
        colorArray[i+2] = 1.0; // B
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    anim.frame.add(particles);
    anim.particles = particles;

    // --- PART 4: Chronology Protection Shield ---
    const shieldGeo = new THREE.SphereGeometry(30, 64, 64);
    const shield = new THREE.Mesh(shieldGeo, matChronologyShield);
    anim.frame.add(shield);
    anim.timeField = shield;

    parts.push({
        name: "Chronology Protection Shield",
        description: "A spherical boundary of exotic matter and intense gravitational waves designed to suppress the propagation of Closed Timelike Curves (CTCs) beyond the immediate vicinity of the core.",
        material: "Metric-Engineering Field Array / Exotic Matter Lattice",
        function: "Prevents temporal paradoxes from propagating into the larger universe and destroying the harvester's causal history.",
        assemblyOrder: 3,
        connections: ["Superconducting Magnetic Coils", "Exotic Matter Injectors"],
        failureEffect: "Immediate disintegration of the harvester due to retrocausal paradox stress (the machine prevents itself from ever being built).",
        cascadeFailures: ["Total causal collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    // --- PART 5: Superconducting Magnetic Confinement Torus ---
    const coilArray = createSuperconductingCoilArray(60, 36);
    anim.frame.add(coilArray);
    
    parts.push({
        name: "Superconducting Magnetic Confinement Torus",
        description: "An array of 36 massive superconducting coils capable of generating fields measured in billions of Tesla, intended to shape the incoming exotic matter and stabilize the Cauchy horizon.",
        material: "Room-temperature YBCO-Graphene Metamaterial, Copper Shell",
        function: "Contains and shapes the intense high-energy plasma and exotic matter flows, preventing them from destabilizing the singularity.",
        assemblyOrder: 4,
        connections: ["Chronology Protection Shield", "Main Structural Hex-Frame"],
        failureEffect: "Catastrophic plasma breach, incinerating the entire facility in fractions of a microsecond.",
        cascadeFailures: ["Coolant Circulation Manifold failure", "Main structure melt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // --- PART 6: Main Structural Hex-Frame ---
    const frameBaseGeo = createComplexTrussRing(150, 10, 60);
    anim.frame.add(frameBaseGeo);
    
    const frameTopGeo = createComplexTrussRing(150, 10, 60);
    frameTopGeo.position.y = 100;
    anim.frame.add(frameTopGeo);
    
    const frameBotGeo = createComplexTrussRing(150, 10, 60);
    frameBotGeo.position.y = -100;
    anim.frame.add(frameBotGeo);

    // Vertical Struts
    const vStrutGeo = new THREE.CylinderGeometry(5, 5, 200, 16);
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const vStrut = new THREE.Mesh(vStrutGeo, steel);
        vStrut.position.set(Math.cos(angle) * 150, 0, Math.sin(angle) * 150);
        anim.frame.add(vStrut);
    }

    parts.push({
        name: "Main Structural Hex-Frame",
        description: "The primary load-bearing chassis of the harvester. Constructed from ultra-dense degenerate matter alloys to withstand the severe gravitational tidal forces emanating from the naked singularity.",
        material: "Degenerate Neutron-Star Crust Alloy",
        function: "Maintains absolute geometric rigidity of all subsystems against extreme and fluctuating gravitational stresses.",
        assemblyOrder: 5,
        connections: ["Spatial Strain Relief Pistons", "All subsystems"],
        failureEffect: "Spaghettification of all harvester components as tidal forces rip the structure apart.",
        cascadeFailures: ["Total structural collapse", "Singularity breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    // --- PART 7: Spatial Strain Relief Pistons ---
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const piston = createHydraulicPiston(100, 8);
        
        // Orient pistons diagonally from outer frame to inner coil array
        piston.position.set(Math.cos(angle) * 150, -50, Math.sin(angle) * 150);
        const target = new THREE.Vector3(Math.cos(angle) * 60, 0, Math.sin(angle) * 60);
        piston.lookAt(target);
        piston.rotateX(Math.PI / 2); // Align cylinder with lookAt axis
        
        anim.frame.add(piston);
        anim.pistons.push(piston);
    }

    parts.push({
        name: "Spatial Strain Relief Pistons",
        description: "Massive active-hydraulic dampeners filled with incompressible exotic fluid. They dynamically expand and contract millions of times per second to counteract chaotic gravitational waves and frame-dragging shear forces.",
        material: "Dark Steel, Chrome, Exotic Hydraulic Fluid",
        function: "Isolates the rigid outer frame from the intense, vibrating gravitational perturbations of the central core.",
        assemblyOrder: 6,
        connections: ["Main Structural Hex-Frame", "Superconducting Magnetic Confinement Torus"],
        failureEffect: "Harmonic resonance buildup leading to shattering of the main structural frame.",
        cascadeFailures: ["Main Structural Hex-Frame failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 0, z: 300 }
    });

    // --- PART 8: Exotic Matter Injectors (Negative Mass) ---
    const injectorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        
        // Injector body
        const injGeo = createLatheShell(10, 80, 32, 5);
        const inj = new THREE.Mesh(injGeo, darkSteel);
        
        inj.position.set(Math.cos(angle) * 100, 0, Math.sin(angle) * 100);
        inj.lookAt(0,0,0);
        inj.rotateX(Math.PI / 2);
        
        // Injector nozzle glow
        const glowGeo = new THREE.CylinderGeometry(2, 5, 20, 16);
        const glow = new THREE.Mesh(glowGeo, matExoticMatter);
        glow.position.y = 40; // Forward
        inj.add(glow);
        
        injectorGroup.add(inj);
        anim.injectors.push(glow); // We will animate the glow
    }
    anim.frame.add(injectorGroup);

    parts.push({
        name: "Exotic Matter Injectors (Negative Mass)",
        description: "Complex phased-array emitters that inject streams of negative-mass exotic matter directly into the singularity. This is strictly required to violate the weak energy condition and keep the singularity naked, preventing an event horizon from forming.",
        material: "Dark Steel, Exotic Matter Plasma",
        function: "Maintains the naked state of the singularity by actively suppressing the formation of an event horizon.",
        assemblyOrder: 7,
        connections: ["Main Structural Hex-Frame", "Singularity Core"],
        failureEffect: "An event horizon spontaneously forms, plunging the entire harvester inside a newly birthed black hole. No escape is possible.",
        cascadeFailures: ["Total loss of machine and crew", "Cosmic censorship restored"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -300, y: 0, z: -300 }
    });

    // --- PART 9: Ergosphere Siphon Array (Penrose Extractors) ---
    const siphonGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        
        // Huge scoop geometry
        const scoopShape = new THREE.Shape();
        scoopShape.absarc(0, 0, 20, 0, Math.PI, false);
        const extrudeSet = { depth: 40, bevelEnabled: true, bevelSize: 2, bevelThickness: 2 };
        const scoopGeo = new THREE.ExtrudeGeometry(scoopShape, extrudeSet);
        const scoop = new THREE.Mesh(scoopGeo, steel);
        
        scoop.position.set(Math.cos(angle) * 80, -20, Math.sin(angle) * 80);
        scoop.lookAt(0,0,0);
        
        // Add neon accents
        const neonGeo = new THREE.BoxGeometry(42, 2, 2);
        const neon = new THREE.Mesh(neonGeo, matNeonAccent);
        neon.position.set(0, 20, 20);
        scoop.add(neon);
        
        siphonGroup.add(scoop);
        anim.siphons.push(scoop);
    }
    anim.frame.add(siphonGroup);

    parts.push({
        name: "Ergosphere Siphon Array (Penrose Extractors)",
        description: "Massive electromagnetic scoops that drop target mass into the ergosphere, split it, and capture the escaping half. Because the singularity is naked and highly spun, the extraction efficiency exceeds 10,000%, tapping into the infinite rotational energy.",
        material: "Steel, Tungsten Carbides, Neon Accents",
        function: "Primary energy harvesting mechanism utilizing the Penrose process.",
        assemblyOrder: 8,
        connections: ["Energy Capacitors", "Superconducting Magnetic Confinement Torus"],
        failureEffect: "Energy extraction ceases, harvester loses power to maintain exotic matter injection.",
        cascadeFailures: ["Exotic Matter Injector failure", "Event horizon formation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -300, z: 0 }
    });

    // --- PART 10: Hawking Radiation Collector Baffles ---
    const baffleGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const radius = 40 + i * 15;
        const baffleGeo = createGearProfile(radius, radius + 10, 36 + i*4, 5);
        const baffle = new THREE.Mesh(baffleGeo, goldFoil); // Need gold foil for radiation! Wait, I used matGoldFoil.
        baffle.material = matGoldFoil;
        baffle.rotation.x = Math.PI / 2;
        baffle.position.y = 80 + i * 10;
        baffleGroup.add(baffle);
        anim.baffles.push(baffle);
        
        // Mirror on bottom
        const baffleBottom = new THREE.Mesh(baffleGeo, matGoldFoil);
        baffleBottom.rotation.x = Math.PI / 2;
        baffleBottom.position.y = -80 - i * 10;
        baffleGroup.add(baffleBottom);
        anim.baffles.push(baffleBottom);
    }
    anim.frame.add(baffleGroup);

    parts.push({
        name: "Hawking Radiation Collector Baffles",
        description: "Tiered rings of ultra-dense gold-foil-plated metamaterials. Though a naked singularity's Hawking radiation profile is theoretical, these baffles capture the chaotic high-energy X-ray and gamma-ray bursts emitted from the exposed core.",
        material: "Gold-Plated Tungsten-Carbide Extrusions",
        function: "Secondary energy harvesting and thermal shielding for the outer structure.",
        assemblyOrder: 9,
        connections: ["Coolant Circulation Manifold", "Main Structural Hex-Frame"],
        failureEffect: "Outer frame melts under intense gamma-ray bombardment.",
        cascadeFailures: ["Operator Cabin incineration", "Structural failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // --- PART 11: Tachyon Harvester Conduits ---
    const tachyonGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const curve = new TachyonConduitCurve(1, (i/6)*Math.PI*2, 2);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 3, 12, false);
        const tube = new THREE.Mesh(tubeGeo, glass);
        
        // Inner glowing plasma
        const plasmaGeo = new THREE.TubeGeometry(curve, 100, 1.5, 8, false);
        const plasma = new THREE.Mesh(plasmaGeo, matHighTempPlasma);
        
        tachyonGroup.add(tube);
        tachyonGroup.add(plasma);
    }
    anim.frame.add(tachyonGroup);

    parts.push({
        name: "Tachyon Harvester Conduits",
        description: "Intricate spiral tubing designed to capture faster-than-light tachyon emissions predicted by certain quantum gravity models of naked singularities. The conduits channel these particles for superluminal data processing.",
        material: "Transparent Hyper-Glass, High-Temp Plasma",
        function: "Harvests superluminal particles for instantaneous computation and predictive causality control.",
        assemblyOrder: 10,
        connections: ["Chronology Protection Shield", "Singularity Core"],
        failureEffect: "Loss of predictive causality control, making the chaotic singularity unmanageable.",
        cascadeFailures: ["Spatial Strain Relief Piston desynchronization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 200, z: 200 }
    });

    // --- PART 12: Cauchy Horizon Stabilizer Grid ---
    // A network of very thin laser-like beams intersecting around the core
    const stabilizerGroup = new THREE.Group();
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 120, 8);
    for(let i=0; i<20; i++) {
        const beam = new THREE.Mesh(beamGeo, matNeonAccent);
        beam.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60
        );
        beam.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        stabilizerGroup.add(beam);
        anim.stabilizers.push(beam);
    }
    anim.frame.add(stabilizerGroup);

    parts.push({
        name: "Cauchy Horizon Stabilizer Grid",
        description: "A highly complex, seemingly chaotic web of high-intensity laser grids. It continuously measures and counteracts the mass inflation instability at the Cauchy horizon, preventing the singularity from cloaking itself in infinite blue-shifted radiation.",
        material: "Solid-State Photonic Plasma Beams",
        function: "Counteracts the mass inflation instability described by Poisson and Israel.",
        assemblyOrder: 11,
        connections: ["Chronology Protection Shield"],
        failureEffect: "Mass inflation occurs, causing local mass to diverge to infinity, destroying the harvester and creating a new universe segment.",
        cascadeFailures: ["Complete systemic annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: -200, z: 200 }
    });

    // --- PART 13: Coolant Circulation Manifold ---
    const coolantGroup = new THREE.Group();
    const manifoldGeo = new THREE.TorusKnotGeometry(120, 5, 100, 16, 2, 5);
    const manifold = new THREE.Mesh(manifoldGeo, copper);
    coolantGroup.add(manifold);
    anim.frame.add(coolantGroup);

    parts.push({
        name: "Coolant Circulation Manifold",
        description: "A massive, continuous loop of copper-clad tubing carrying liquid helium-3. It wraps entirely around the harvester's outer periphery to bleed off the immense thermal energy generated by frame dragging.",
        material: "Copper, Liquid Helium-3",
        function: "Thermal regulation of the main structural frame and superconducting arrays.",
        assemblyOrder: 12,
        connections: ["Superconducting Magnetic Confinement Torus", "Hawking Radiation Collector Baffles"],
        failureEffect: "Thermal runaway. Superconductors quench, releasing billions of Joules of stored magnetic energy explosively.",
        cascadeFailures: ["Superconducting Magnetic Confinement Torus failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -400 }
    });

    // --- PART 14: Primary Operator and Observation Deck ---
    const cabin = createOperatorCabin();
    cabin.position.set(0, 0, 180); // Placed safely(ish) on the outer edge
    anim.frame.add(cabin);

    parts.push({
        name: "Primary Operator and Observation Deck",
        description: "The heavily shielded control center for the harvester. Contains the predictive causality engines, manual override yokes, and heavily tinted hyper-glass viewports to allow mortal eyes to witness the naked singularity without going mad.",
        material: "Steel, Tinted Hyper-Glass, Chrome, Aluminum",
        function: "Houses the operating crew and primary autonomous control substrates.",
        assemblyOrder: 13,
        connections: ["Main Structural Hex-Frame"],
        failureEffect: "Loss of manual control. The autonomous systems will attempt to safely vent the singularity, usually resulting in destruction.",
        cascadeFailures: ["Loss of predictive causality control"],
        originalPosition: { x: 0, y: 0, z: 180 },
        explodedPosition: { x: 0, y: 0, z: 600 }
    });

    // --- PART 15: Energy Capacitors (Dark Matter Batteries) ---
    const capGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const capGeo = new THREE.CylinderGeometry(15, 15, 60, 32);
        const cap = new THREE.Mesh(capGeo, darkSteel);
        cap.position.set(Math.cos(angle) * 200, 0, Math.sin(angle) * 200);
        
        // Add warning stripes
        const stripeGeo = new THREE.CylinderGeometry(15.2, 15.2, 10, 32);
        const stripe = new THREE.Mesh(stripeGeo, matWarningStripes);
        cap.add(stripe);
        
        capGroup.add(cap);
    }
    anim.frame.add(capGroup);

    parts.push({
        name: "Dark Matter Energy Capacitors",
        description: "Colossal cylindrical silos mounted on the extreme outer frame. They store the near-infinite energy extracted from the Penrose siphons using compressed dark matter states.",
        material: "Dark Steel, Yellow/Black Warning Hazard Paint",
        function: "Temporary buffering and storage of extracted infinite energy.",
        assemblyOrder: 14,
        connections: ["Ergosphere Siphon Array", "Main Structural Hex-Frame"],
        failureEffect: "Capacitor rupture, releasing a shockwave of dark matter that obliterates the local solar system.",
        cascadeFailures: ["Grid-wide blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 0, z: -500 }
    });


    // ==========================================
    // 5. ANIMATION LOGIC (EXTREME COMPLEXITY)
    // ==========================================
    
    // Using a seeded random for the particles to keep things semi-deterministic
    let tick = 0;

    const animate = (time, speed, activeMeshes) => {
        tick += speed;
        
        // 1. Core Pulsing (Chaotic singularity)
        if (anim.core) {
            // Chaotic scaling using multiple sine waves
            const scale = 1.0 + Math.sin(tick * 0.1) * 0.2 + Math.cos(tick * 0.33) * 0.1;
            anim.core.scale.set(scale, scale, scale);
            
            // Emissive intensity pulsing
            matSingularityCore.emissiveIntensity = 50 + Math.sin(tick * 0.5) * 30;
        }

        // 2. Kerr Ring Rotation (Extreme Spin)
        if (anim.kerrRing) {
            // Frame dragging effect: extremely fast rotation
            anim.kerrRing.rotation.z += 0.5 * speed; // Extremely fast
        }

        // 3. Structural Shaking (Simulating extreme gravitational stress)
        if (anim.frame) {
            // High frequency, low amplitude noise
            anim.frame.position.x = Math.sin(tick * 1.5) * 1.5 * Math.cos(tick * 0.7);
            anim.frame.position.y = Math.cos(tick * 1.2) * 1.5 * Math.sin(tick * 0.8);
            anim.frame.position.z = Math.sin(tick * 1.1) * 1.5 * Math.cos(tick * 0.9);
            
            // Slow overall precession due to Lense-Thirring effect
            anim.frame.rotation.y += 0.001 * speed;
        }

        // 4. Particle System (Frame dragging and infall)
        if (anim.particles) {
            const positions = anim.particles.geometry.attributes.position.array;
            const colors = anim.particles.geometry.attributes.color.array;
            
            for(let i=0; i<positions.length; i+=3) {
                let x = positions[i];
                let y = positions[i+1];
                let z = positions[i+2];
                
                // Calculate distance to center
                const r = Math.sqrt(x*x + y*y + z*z);
                
                // Gravity (pull towards center)
                const gravity = 500 / (r*r + 1); // Avoid division by zero
                const dx = -x/r * gravity * speed * 0.1;
                const dy = -y/r * gravity * speed * 0.1;
                const dz = -z/r * gravity * speed * 0.1;
                
                // Frame Dragging (Kerr metric rotation)
                // Closer to center = faster rotation around Y axis
                const drag = 200 / (r + 1);
                const angle = drag * speed * 0.01;
                
                const newX = x * Math.cos(angle) - z * Math.sin(angle);
                const newZ = x * Math.sin(angle) + z * Math.cos(angle);
                
                x = newX + dx;
                y = y + dy;
                z = newZ + dz;
                
                // If sucked into the singularity, spit it back out as Hawking radiation
                if (r < 5) {
                    const ejectR = 150 + Math.random() * 50;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    x = ejectR * Math.sin(phi) * Math.cos(theta);
                    y = ejectR * Math.sin(phi) * Math.sin(theta);
                    z = ejectR * Math.cos(phi);
                    
                    // Flash color to bright blue/white on ejection
                    colors[i] = 0.5;
                    colors[i+1] = 0.8;
                    colors[i+2] = 1.0;
                } else {
                    // Shift color to red as it falls in (Gravitational Redshift)
                    colors[i] = THREE.MathUtils.lerp(colors[i], 1.0, 0.01);
                    colors[i+1] = THREE.MathUtils.lerp(colors[i+1], 0.2, 0.01);
                    colors[i+2] = THREE.MathUtils.lerp(colors[i+2], 0.0, 0.01);
                }
                
                positions[i] = x;
                positions[i+1] = y;
                positions[i+2] = z;
            }
            anim.particles.geometry.attributes.position.needsUpdate = true;
            anim.particles.geometry.attributes.color.needsUpdate = true;
        }

        // 5. Injector Pulsing
        anim.injectors.forEach((inj, index) => {
            const phase = index * (Math.PI / 4);
            const scale = 1.0 + Math.sin(tick * 0.2 + phase) * 0.5;
            inj.scale.set(scale, scale, scale);
        });

        // 6. Coil Rotation
        anim.coils.forEach((coil, index) => {
            // Individual coils twist slightly to shape the magnetic bottle
            coil.rotation.z = Math.sin(tick * 0.05 + index) * 0.2;
        });

        // 7. Siphon Opening/Closing
        anim.siphons.forEach((siphon, index) => {
            // Scoop jaw movement
            siphon.scale.y = 1.0 + Math.sin(tick * 0.1 + index) * 0.2;
        });

        // 8. Piston Compensation
        anim.pistons.forEach((piston, index) => {
            // Pistons expand/contract to offset the frame shaking
            const phase = index * (Math.PI / 6);
            piston.children[1].position.y = 50 + Math.sin(tick * 1.5 + phase) * 10; // Move rod
        });

        // 9. Stabilizer Grid chaotic flickering
        anim.stabilizers.forEach((beam) => {
            if (Math.random() > 0.9) {
                beam.visible = !beam.visible;
            }
            beam.rotation.x += Math.random() * 0.1 * speed;
        });

        // 10. Baffle Rotation
        anim.baffles.forEach((baffle, index) => {
            baffle.rotation.z += (index % 2 === 0 ? 0.01 : -0.01) * speed;
        });

        // 11. Time Field (Chronology Shield) UV scrolling/pulsing
        if (anim.timeField) {
            anim.timeField.material.opacity = 0.8 + Math.sin(tick * 0.05) * 0.1;
            anim.timeField.rotation.y -= 0.005 * speed;
            anim.timeField.rotation.x += 0.002 * speed;
        }
    };


    // ==========================================
    // 6. METADATA AND QUIZ
    // ==========================================

    const description = "The God-Tier Naked Singularity Harvester is the ultimate engineering achievement, designed by a civilization that has transcended the limits of cosmic censorship. By artificially stabilizing a black hole past its extreme spin limit (a > M), the event horizon is stripped away, exposing the infinitely dense ring singularity directly to the universe. This allows for >10,000% efficiency energy extraction via the Penrose process, but introduces catastrophic risks including mass inflation at the Cauchy horizon, the spontaneous formation of closed timelike curves (time travel paradoxes), and raw exposure to lethal chaotic gravitational waves. The massive structural frame and immense arrays of chronal-shields and exotic matter injectors are required simply to prevent the machine from erasing itself from causality.";

    const quizQuestions = [
        {
            question: "In the context of the Kerr metric, which specific mathematical condition describes an over-spun black hole that results in a naked singularity, thereby violating the Weak Cosmic Censorship Conjecture?",
            options: [
                "The spin parameter (a) exceeds the mass parameter (M), resulting in no real roots for the event horizon radius ($r_\\pm = M \\pm \\sqrt{M^2 - a^2}$).",
                "The charge (Q) is perfectly balanced with the mass (M), resulting in a Reissner-Nordström extremal state.",
                "The Schwarzschild radius equals the Planck length, causing quantum gravity effects to dominate the metric.",
                "The Ergosphere extends to infinity, dragging all external observers into co-rotation."
            ],
            correctAnswerIndex: 0,
            explanation: "When the angular momentum per unit mass, $a = J/M$, becomes strictly greater than the mass $M$ ($a > M$), the term under the square root in the horizon equation becomes negative. Thus, no event horizon exists, and the ring singularity is exposed to the external universe."
        },
        {
            question: "What is the primary function of the 'Chronology Protection Shield' on this harvester, as it relates to the exposed Kerr ring singularity?",
            options: [
                "To shield the operators from infinite-energy Hawking radiation bursts.",
                "To prevent the propagation of Closed Timelike Curves (CTCs) into the broader universe, averting causality-breaking paradoxes.",
                "To cool the massive superconducting magnetic arrays using temporally dilated liquid helium.",
                "To reflect gravitational waves back into the singularity to maintain its mass."
            ],
            correctAnswerIndex: 1,
            explanation: "A naked Kerr singularity contains a region near the ring where the azimuthal coordinate $\\phi$ becomes timelike. Moving in this direction allows an observer to travel backward in time, creating a Closed Timelike Curve (CTC). The shield prevents these causal loops from propagating and destroying the timeline."
        },
        {
            question: "The Cauchy Horizon Stabilizer Grid is designed to counteract a specific phenomenon discovered by Poisson and Israel (1990). What is this phenomenon that usually enforces Strong Cosmic Censorship?",
            options: [
                "The Lense-Thirring Effect (Frame Dragging).",
                "Hawking Radiation runaway (Black Hole Evaporation).",
                "Mass Inflation.",
                "The Penrose Process energy exhaustion."
            ],
            correctAnswerIndex: 2,
            explanation: "Mass Inflation occurs at the inner (Cauchy) horizon of a rotating or charged black hole. Infalling radiation gets infinitely blueshifted, causing the local mass parameter to exponentially diverge to infinity. This intense curvature effectively destroys the Cauchy horizon, acting as a 'censorship' mechanism to prevent observers from seeing the singularity."
        },
        {
            question: "Why must the harvester constantly inject streams of 'Exotic Matter' (matter with negative energy density) into the singularity?",
            options: [
                "To increase the rotational speed (a) beyond the speed of light.",
                "To violate the Null Energy Condition (NEC) and prevent the spontaneous formation of an event horizon, keeping the singularity 'naked'.",
                "To convert the singularity from a Kerr metric to a Schwarzschild metric.",
                "To power the primary operator cabin's life support systems."
            ],
            correctAnswerIndex: 1,
            explanation: "According to the Penrose singularity theorems, ordinary matter (which obeys the energy conditions) will naturally tend to form trapped surfaces (event horizons) around singularities. Injecting negative-energy exotic matter violates these conditions, artificially holding the spacetime open."
        },
        {
            question: "In a critical collapse scenario leading to a naked singularity (such as the Choptuik scaling phenomenon in scalar fields), what happens to the mass of the black hole exactly at the critical parameter threshold ($p = p^*$)?",
            options: [
                "The mass diverges to infinity.",
                "The mass scales to precisely zero, creating an infinitesimally small naked singularity before a horizon can form.",
                "The mass stabilizes at the Planck mass.",
                "The mass becomes negative, repelling all surrounding matter."
            ],
            correctAnswerIndex: 1,
            explanation: "Matthew Choptuik discovered that in the critical collapse of a scalar field, as the tuning parameter $p$ approaches the critical threshold $p^*$, the mass of the forming black hole scales as $M_{BH} \\propto (p - p^*)^{\\gamma}$. Exactly at $p = p^*$, a singularity forms with zero mass, meaning no event horizon can cloak it, representing a precise violation of cosmic censorship."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
