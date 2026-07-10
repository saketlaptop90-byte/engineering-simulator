import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const voidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        roughness: 1, 
        metalness: 0,
        side: THREE.DoubleSide
    });
    
    const singularityMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffffff, 
        emissiveIntensity: 20 
    });
    
    const nascentUniverseMaterial = new THREE.MeshStandardMaterial({
        color: 0x88bbff,
        emissive: 0x2244ff,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    
    const entropyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff0000,
        emissiveIntensity: 8,
        transparent: true,
        opacity: 0.7
    });
    
    const neonBlueMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 3 
    });
    
    const neonPurpleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff, 
        emissive: 0xaa00ff, 
        emissiveIntensity: 3 
    });
    
    const quantumGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeff, 
        transmission: 0.98, 
        opacity: 1, 
        metalness: 0.1, 
        roughness: 0.05, 
        ior: 1.6,
        thickness: 3.0, 
        specularIntensity: 2, 
        side: THREE.DoubleSide
    });

    const HUDMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const parts = [];

    // ==========================================
    // HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // ==========================================

    function createGear(radius, thickness, teethCount, material) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.8;
        for (let i = 0; i < teethCount * 2; i++) {
            const angle = (i / (teethCount * 2)) * Math.PI * 2;
            const r = (i % 2 === 0) ? radius : innerRadius;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        
        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center();
        return new THREE.Mesh(geom, material);
    }

    function createComplexRing(radius, tube, magnetCount, mainMat, accentMat) {
        const ringGroup = new THREE.Group();
        
        // Main Torus
        const torusGeom = new THREE.TorusGeometry(radius, tube, 64, 200);
        const torus = new THREE.Mesh(torusGeom, mainMat);
        ringGroup.add(torus);

        // Inner Gear track
        const gearTrack = createGear(radius - tube, tube * 0.5, 60, darkSteel);
        gearTrack.rotation.x = Math.PI/2;
        ringGroup.add(gearTrack);

        // Magnetic accelerators around the ring
        const magnetGeom = new THREE.BoxGeometry(tube * 3, tube * 3, tube * 4);
        const coilGeom = new THREE.TorusGeometry(tube * 2, tube * 0.2, 16, 32);
        
        for(let i=0; i<magnetCount; i++) {
            const angle = (i / magnetCount) * Math.PI * 2;
            
            const magGroup = new THREE.Group();
            
            const mag = new THREE.Mesh(magnetGeom, accentMat);
            magGroup.add(mag);

            for(let j=0; j<3; j++) {
                const coil = new THREE.Mesh(coilGeom, copper);
                coil.position.z = (j - 1) * tube;
                magGroup.add(coil);
            }
            
            const nodeGeom = new THREE.SphereGeometry(tube * 0.8, 32, 32);
            const node = new THREE.Mesh(nodeGeom, neonBlueMaterial);
            node.position.y = tube * 1.5;
            magGroup.add(node);

            magGroup.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            magGroup.rotation.z = angle;
            ringGroup.add(magGroup);
        }
        return ringGroup;
    }

    function createRivetedCylinder(rTop, rBottom, height, rSegs, rivetCount, material) {
        const cylGroup = new THREE.Group();
        const mainGeom = new THREE.CylinderGeometry(rTop, rBottom, height, rSegs);
        const mainMesh = new THREE.Mesh(mainGeom, material);
        cylGroup.add(mainMesh);

        const rivetGeom = new THREE.SphereGeometry(rTop * 0.03, 16, 16);
        for(let i=0; i<rivetCount; i++) {
            const angle = (i / rivetCount) * Math.PI * 2;
            
            const rivet1 = new THREE.Mesh(rivetGeom, chrome);
            rivet1.position.set(Math.cos(angle) * rTop, height/2 - height*0.05, Math.sin(angle) * rTop);
            cylGroup.add(rivet1);

            const rivet2 = new THREE.Mesh(rivetGeom, chrome);
            rivet2.position.set(Math.cos(angle) * rBottom, -height/2 + height*0.05, Math.sin(angle) * rBottom);
            cylGroup.add(rivet2);

            // Add vertical ribs
            const ribGeom = new THREE.BoxGeometry(rTop * 0.1, height * 0.8, rTop * 0.1);
            const rib = new THREE.Mesh(ribGeom, darkSteel);
            rib.position.set(Math.cos(angle) * (rTop + rTop*0.02), 0, Math.sin(angle) * (rBottom + rBottom*0.02));
            rib.rotation.y = -angle;
            cylGroup.add(rib);
        }
        return cylGroup;
    }

    function createHydraulicPiston(radius, length) {
        const group = new THREE.Group();
        
        // Outer cylinder
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length * 0.6, 32), darkSteel);
        outer.position.y = length * 0.3;
        group.add(outer);

        // Inner rod
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length, 32), chrome);
        inner.position.y = length * 0.5;
        group.add(inner);

        // Mountings
        const mountGeom = new THREE.BoxGeometry(radius * 3, radius * 2, radius * 3);
        const mountBottom = new THREE.Mesh(mountGeom, steel);
        const mountTop = new THREE.Mesh(mountGeom, steel);
        mountTop.position.y = length;
        group.add(mountBottom, mountTop);

        return { group, innerRod: inner };
    }

    // ==========================================
    // PART 1: GRAVITON STABILIZER BASE
    // ==========================================
    const baseGroup = new THREE.Group();
    const base1 = createRivetedCylinder(35, 40, 8, 128, 72, darkSteel);
    base1.position.y = 4;
    const base2 = createRivetedCylinder(32, 35, 6, 128, 72, steel);
    base2.position.y = 11;
    const base3 = createRivetedCylinder(28, 32, 4, 128, 36, copper);
    base3.position.y = 16;
    
    baseGroup.add(base1, base2, base3);

    // Add Reality Anchors to Base
    const anchorGeom = new THREE.BoxGeometry(8, 20, 12);
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const anchorGrp = new THREE.Group();
        
        const anchorMain = new THREE.Mesh(anchorGeom, chrome);
        anchorGrp.add(anchorMain);

        const anchorGlow = new THREE.Mesh(new THREE.BoxGeometry(8.2, 18, 2), neonPurpleMaterial);
        anchorGlow.position.z = 6;
        anchorGrp.add(anchorGlow);

        const drillGeom = new THREE.ConeGeometry(4, 15, 32);
        const drill = new THREE.Mesh(drillGeom, darkSteel);
        drill.position.y = -15;
        drill.rotation.x = Math.PI;
        anchorGrp.add(drill);

        anchorGrp.position.set(Math.cos(angle)*34, 10, Math.sin(angle)*34);
        anchorGrp.rotation.y = -angle;
        baseGroup.add(anchorGrp);
    }
    baseGroup.position.set(0, 0, 0);
    group.add(baseGroup);

    parts.push({
        name: "gravitonStabilizer",
        description: "Massive foundation anchoring the device to local spacetime, preventing local black hole collapse via graviton dampening fields.",
        material: "Dark Steel / Chrome / Copper",
        function: "Structural anchoring & graviton field stabilization",
        assemblyOrder: 1,
        connections: ["tachyonManifolds", "plasmaConduits"],
        failureEffect: "Spontaneous singularity formation consuming the entire star system.",
        cascadeFailures: ["containmentCore"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // ==========================================
    // PART 2: TACHYON MANIFOLDS & PLASMA CONDUITS
    // ==========================================
    const manifoldGroup = new THREE.Group();
    const manifoldCore = createRivetedCylinder(20, 28, 25, 64, 48, copper);
    manifoldCore.position.y = 30.5;
    manifoldGroup.add(manifoldCore);

    class CustomHelixCurve extends THREE.Curve {
        constructor(radius, height, coils, phase) {
            super();
            this.radius = radius;
            this.height = height;
            this.coils = coils;
            this.phase = phase;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const a = t * Math.PI * 2 * this.coils + this.phase;
            const x = Math.cos(a) * this.radius;
            const z = Math.sin(a) * this.radius;
            const y = 18 + t * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    const tubes = [];
    for(let i=0; i<6; i++) {
        const path = new CustomHelixCurve(22, 25, 3, (i/6)*Math.PI*2);
        const tubeGeom = new THREE.TubeGeometry(path, 300, 1.5, 32, false);
        const tube = new THREE.Mesh(tubeGeom, glass);
        
        // Inner glowing plasma stream
        const innerTubeGeom = new THREE.TubeGeometry(path, 300, 0.8, 16, false);
        const innerTube = new THREE.Mesh(innerTubeGeom, neonBlueMaterial);
        
        tube.add(innerTube);
        manifoldGroup.add(tube);
        tubes.push(innerTube);
    }
    group.add(manifoldGroup);

    parts.push({
        name: "tachyonManifolds",
        description: "Intricate spiraling manifolds managing FTL tachyon fluid flow to offset extreme temporal dilation caused by the genesis event.",
        material: "Copper / Quantum Glass",
        function: "Time-dilation management",
        assemblyOrder: 2,
        connections: ["gravitonStabilizer", "chronotonPumps"],
        failureEffect: "Extreme temporal anomalies; local time loops permanently trapping operators.",
        cascadeFailures: ["chronotonPumps", "containmentCore"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // ==========================================
    // PART 3: CHRONOTON PUMPS
    // ==========================================
    const pumpGroup = new THREE.Group();
    const pistons = [];
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const pObj = createHydraulicPiston(3, 20);
        const pump = pObj.group;
        
        const pumpCap = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), neonPurpleMaterial);
        pumpCap.position.y = 20;
        pObj.innerRod.add(pumpCap);
        
        pump.position.set(Math.cos(angle)*35, 18, Math.sin(angle)*35);
        pump.rotation.z = -Math.PI/6 * Math.cos(angle);
        pump.rotation.x = Math.PI/6 * Math.sin(angle);
        
        pumpGroup.add(pump);
        pistons.push({ rod: pObj.innerRod, offset: i });
    }
    group.add(pumpGroup);

    parts.push({
        name: "chronotonPumps",
        description: "Heavy-duty hydraulic systems injecting artificial chronoton particles into the nascent universe to establish a unidirectional temporal arrow.",
        material: "Steel / Chrome / Neon",
        function: "Establishes linear time",
        assemblyOrder: 3,
        connections: ["tachyonManifolds", "containmentCore"],
        failureEffect: "Universe freezes in a single instant of time permanently, or time runs completely backwards.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 60 }
    });

    // ==========================================
    // PART 4: BOSON INJECTORS
    // ==========================================
    const bosonGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12)*Math.PI*2;
        
        const injectorGrp = new THREE.Group();
        const injectorBody = new THREE.Mesh(new THREE.CylinderGeometry(1, 3, 18, 32), copper);
        const injectorTip = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 32), chrome);
        injectorTip.position.y = 11;
        
        const injectorGlow = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 16, 32), neonBlueMaterial);
        injectorGlow.position.y = -5;
        injectorGlow.rotation.x = Math.PI/2;

        injectorGrp.add(injectorBody, injectorTip, injectorGlow);
        injectorGrp.position.set(Math.cos(angle)*18, 48, Math.sin(angle)*18);
        
        // Point inwards towards center (y=85)
        injectorGrp.lookAt(new THREE.Vector3(0, 85, 0));
        injectorGrp.rotateX(Math.PI/2); // Align cylinder along lookAt axis

        bosonGroup.add(injectorGrp);
    }
    group.add(bosonGroup);
    
    parts.push({
        name: "bosonInjectors",
        description: "Precision-engineered nozzles that spray Higgs Bosons into the expanding plasma to generate mass for the new universe via symmetry breaking.",
        material: "Copper / Chrome",
        function: "Mass generation",
        assemblyOrder: 4,
        connections: ["containmentCore"],
        failureEffect: "Universe remains purely massless energy; no galaxies, stars, or atoms can ever form.",
        cascadeFailures: ["darkEnergyCondensers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: -60 }
    });

    // ==========================================
    // PART 5: DARK ENERGY CONDENSERS
    // ==========================================
    const condenserGroup = new THREE.Group();
    const condenserRing = createComplexRing(26, 3, 24, darkSteel, steel);
    condenserRing.position.y = 55;
    condenserRing.rotation.x = Math.PI/2;
    condenserGroup.add(condenserRing);

    // Cooling fins on condenser
    for(let i=0; i<72; i++) {
        const angle = (i/72)*Math.PI*2;
        const fin = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 0.5), aluminum);
        fin.position.set(Math.cos(angle)*30, 55, Math.sin(angle)*30);
        fin.rotation.y = -angle;
        condenserGroup.add(fin);
    }
    group.add(condenserGroup);

    parts.push({
        name: "darkEnergyCondensers",
        description: "Regulates the cosmological constant (Λ) and expansion rate of the nascent universe to prevent an immediate Big Rip scenario.",
        material: "Dark Steel / Aluminum",
        function: "Expansion regulation",
        assemblyOrder: 5,
        connections: ["tachyonManifolds"],
        failureEffect: "Accelerated expansion tears the new universe apart instantly down to the subatomic level.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -60, y: 30, z: 0 }
    });

    // ==========================================
    // PART 6: ANTI-MATTER BAFFLES
    // ==========================================
    const baffleGroup = new THREE.Group();
    const baffleGeom = new THREE.TorusKnotGeometry(28, 1.5, 300, 32, 3, 5);
    const baffleMesh = new THREE.Mesh(baffleGeom, chrome);
    baffleMesh.position.y = 65;
    baffleGroup.add(baffleMesh);

    // Baffle nodes
    for(let i=0; i<20; i++) {
        const node = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), copper);
        // Approximate positions along torus knot
        const t = i / 20;
        const p = 3, q = 5;
        const r = 28, tube = 1.5;
        const cu = Math.cos(p * t * Math.PI * 2);
        const su = Math.sin(p * t * Math.PI * 2);
        const qu = t * Math.PI * 2 * q;
        const x = (r + tube * Math.cos(qu)) * cu;
        const y = (r + tube * Math.cos(qu)) * su;
        const z = tube * Math.sin(qu);
        
        node.position.set(x, 65 + z, y); 
        baffleGroup.add(node);
    }
    group.add(baffleGroup);

    parts.push({
        name: "antiMatterBaffles",
        description: "Complex topological filters that selectively trap rogue anti-matter particles from annihilating the newly forming baryonic matter structure.",
        material: "Chrome / Copper",
        function: "Baryon asymmetry generation",
        assemblyOrder: 6,
        connections: ["gravitonStabilizer"],
        failureEffect: "100% matter/anti-matter annihilation leaving only a universe of photons.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: 40, z: 0 }
    });

    // ==========================================
    // PART 7, 8, 9: CONTAINMENT RINGS (X, Y, Z)
    // ==========================================
    const containmentCenter = 85;

    const ringX = createComplexRing(38, 2.5, 24, steel, chrome);
    const ringY = createComplexRing(42, 2.5, 24, copper, darkSteel);
    const ringZ = createComplexRing(46, 2.5, 24, darkSteel, copper);
    
    ringX.position.y = containmentCenter;
    ringY.position.y = containmentCenter;
    ringZ.position.y = containmentCenter;

    group.add(ringX, ringY, ringZ);

    parts.push({
        name: "containmentRing_X",
        description: "Inner primary gyroscopic containment ring generating a strong-nuclear repulsor field.",
        material: "Steel / Chrome",
        function: "Spatial containment",
        assemblyOrder: 7,
        connections: ["containmentRing_Y"],
        failureEffect: "Spatial breach.",
        cascadeFailures: ["containmentRing_Y", "containmentRing_Z"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 80, y: 85, z: 0 }
    });
    
    parts.push({
        name: "containmentRing_Y",
        description: "Middle gyroscopic containment ring stabilizing electroweak forces to prevent spontaneous symmetry breaking errors.",
        material: "Copper / Dark Steel",
        function: "Electroweak stabilization",
        assemblyOrder: 8,
        connections: ["containmentRing_X", "containmentRing_Z"],
        failureEffect: "Force unification collapse.",
        cascadeFailures: ["containmentRing_Z"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 130, z: 0 }
    });

    parts.push({
        name: "containmentRing_Z",
        description: "Outer gyroscopic containment ring nullifying gravitational radiation emitted by the big bang.",
        material: "Dark Steel / Copper",
        function: "Gravitational nullification",
        assemblyOrder: 9,
        connections: ["containmentRing_Y", "realityTethers"],
        failureEffect: "Gravitational waves destroy the laboratory and shear the planet in half.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 85, z: 0 }
    });

    // ==========================================
    // PART 10: REALITY TETHERS
    // ==========================================
    const tetherGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        
        // Huge structural pillar
        const pillarGeom = new THREE.CylinderGeometry(4, 8, 120, 32);
        const pillar = new THREE.Mesh(pillarGeom, darkSteel);
        pillar.position.set(Math.cos(angle)*65, 60, Math.sin(angle)*65);
        pillar.rotation.x = Math.PI/12 * Math.sin(angle);
        pillar.rotation.z = Math.PI/12 * Math.cos(angle);
        
        // Emissive inner core of pillar
        const coreGeom = new THREE.CylinderGeometry(2, 2, 122, 32);
        const core = new THREE.Mesh(coreGeom, neonBlueMaterial);
        pillar.add(core);

        // Arc emitters from pillars to rings
        const arcGeom = new THREE.CylinderGeometry(1, 1, 30, 16);
        const arc = new THREE.Mesh(arcGeom, neonPurpleMaterial);
        arc.position.set(0, 45, -15);
        arc.rotation.x = Math.PI/2;
        pillar.add(arc);

        // Heavy chains/cables wrapping the pillar
        for(let j=0; j<5; j++) {
            const cableGeom = new THREE.TorusGeometry(5 + j*0.5, 0.4, 16, 32);
            const cable = new THREE.Mesh(cableGeom, rubber);
            cable.position.y = -40 + j*20;
            cable.rotation.x = Math.PI/2;
            pillar.add(cable);
        }

        tetherGroup.add(pillar);
    }
    group.add(tetherGroup);

    parts.push({
        name: "realityTethers",
        description: "Massive grounding pillars containing localized cosmic strings that bind the genesis event to our specific multi-versal coordinate.",
        material: "Dark Steel / Neon / Rubber",
        function: "Multiversal anchoring",
        assemblyOrder: 10,
        connections: ["containmentRing_Z", "gravitonStabilizer"],
        failureEffect: "The new universe drifts into the higher-dimensional bulk, lost to us forever.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 100 }
    });

    // ==========================================
    // PART 11: CONTAINMENT CORE (QUANTUM GLASS SPHERE)
    // ==========================================
    const coreGroup = new THREE.Group();
    const coreGeom = new THREE.IcosahedronGeometry(32, 6); // High poly sphere
    const coreMesh = new THREE.Mesh(coreGeom, quantumGlassMaterial);
    coreGroup.position.y = containmentCenter;
    coreGroup.add(coreMesh);

    // Extreme detailed structural frame for the glass sphere
    const frameGeom = new THREE.IcosahedronGeometry(32.5, 3);
    const frameMesh = new THREE.Mesh(frameGeom, new THREE.MeshStandardMaterial({
        color: 0x111111, metalness: 0.9, roughness: 0.2, wireframe: true, wireframeLinewidth: 4
    }));
    coreGroup.add(frameMesh);
    
    // Add connection nodes at vertices of frame
    const nodeGeom = new THREE.SphereGeometry(1.5, 16, 16);
    const posAttribute = frameGeom.attributes.position;
    for(let i = 0; i < posAttribute.count; i += 5) { // Skip some to reduce object count slightly
        const vertex = new THREE.Vector3().fromBufferAttribute(posAttribute, i);
        const node = new THREE.Mesh(nodeGeom, copper);
        node.position.copy(vertex);
        coreGroup.add(node);
    }

    group.add(coreGroup);

    parts.push({
        name: "containmentCore",
        description: "Quantum-glass geodesic sphere holding the extreme pressure and 10^32 Kelvin temperature of the genesis event.",
        material: "Quantum Glass / Chrome / Copper",
        function: "Absolute isolation barrier",
        assemblyOrder: 11,
        connections: ["innerVoid"],
        failureEffect: "Total release of quark-gluon plasma into the local room, vaporizing the planet.",
        cascadeFailures: ["innerVoid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 85, z: -90 }
    });

    // ==========================================
    // PART 12: INNER VOID
    // ==========================================
    const voidGeom = new THREE.SphereGeometry(31, 64, 64);
    const voidMesh = new THREE.Mesh(voidGeom, voidMaterial);
    voidMesh.position.y = containmentCenter;
    group.add(voidMesh);

    parts.push({
        name: "innerVoid",
        description: "A manufactured pocket of pure false-vacuum, devoid of all quantum fields, strings, and branes.",
        material: "Pure Nothingness",
        function: "Blank canvas for creation",
        assemblyOrder: 12,
        connections: ["singularity"],
        failureEffect: "Pre-existing quantum fluctuations ruin the highly-tuned initial conditions.",
        cascadeFailures: ["singularity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -90, y: 85, z: -90 }
    });

    // ==========================================
    // PART 13: SINGULARITY
    // ==========================================
    const singularityGeom = new THREE.SphereGeometry(1, 64, 64);
    const singularity = new THREE.Mesh(singularityGeom, singularityMaterial);
    singularity.position.y = containmentCenter;
    
    // Add intense point light to singularity
    const singularityLight = new THREE.PointLight(0xffffff, 100, 100);
    singularity.add(singularityLight);

    group.add(singularity);

    parts.push({
        name: "singularity",
        description: "The infinitely dense, infinitely hot point of origin. All mass and energy of a universe compacted into a zero-dimensional point.",
        material: "Pure Light / Energy",
        function: "Source of all existence",
        assemblyOrder: 13,
        connections: ["nascentUniverse"],
        failureEffect: "Evaporates via Hawking radiation before inflation triggers.",
        cascadeFailures: ["nascentUniverse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 85, z: 0 }
    });

    // ==========================================
    // PART 14: NASCENT UNIVERSE
    // ==========================================
    // Complex geometry made of multiple layers
    const universeGroup = new THREE.Group();
    universeGroup.position.y = containmentCenter;

    const nascentGeom1 = new THREE.IcosahedronGeometry(12, 6); 
    const nascentUniverse1 = new THREE.Mesh(nascentGeom1, nascentUniverseMaterial);
    universeGroup.add(nascentUniverse1);

    const nascentGeom2 = new THREE.IcosahedronGeometry(13, 4); 
    const nascentUniverse2 = new THREE.Mesh(nascentGeom2, new THREE.MeshStandardMaterial({
        color: 0xff00ff, emissive: 0xaa00aa, emissiveIntensity: 2, transparent: true, opacity: 0.5, wireframe: true
    }));
    universeGroup.add(nascentUniverse2);

    const nascentGeom3 = new THREE.SphereGeometry(11, 32, 32);
    const nascentUniverse3 = new THREE.Mesh(nascentGeom3, new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8, transparent: true, opacity: 0.9
    }));
    universeGroup.add(nascentUniverse3);

    group.add(universeGroup);

    parts.push({
        name: "nascentUniverse",
        description: "The violently expanding super-heated plasma of quarks and gluons post-inflation.",
        material: "Plasma / Neon / Energy",
        function: "The actual universe being formed",
        assemblyOrder: 14,
        connections: ["entropyVents_Left", "entropyVents_Right"],
        failureEffect: "Big Crunch - immediate collapse back into a singularity due to insufficient expansion momentum.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // ==========================================
    // PART 15 & 16: ENTROPY VENTS
    // ==========================================
    const ventsGroupLeft = new THREE.Group();
    const ventsGroupRight = new THREE.Group();
    
    const ventBodyGeom = new THREE.CylinderGeometry(8, 12, 30, 32);
    
    // Left Vent Assembly
    const ventL = new THREE.Mesh(ventBodyGeom, darkSteel);
    ventL.position.set(-45, containmentCenter, 0);
    ventL.rotation.z = Math.PI/2;
    
    // Add intricate grill
    for(let i=0; i<10; i++) {
        const grill = new THREE.Mesh(new THREE.TorusGeometry(8, 0.5, 16, 32), steel);
        grill.position.y = -10 + i*2;
        grill.rotation.x = Math.PI/2;
        ventL.add(grill);
    }
    ventsGroupLeft.add(ventL);

    // Right Vent Assembly
    const ventR = new THREE.Mesh(ventBodyGeom, darkSteel);
    ventR.position.set(45, containmentCenter, 0);
    ventR.rotation.z = -Math.PI/2;
    
    for(let i=0; i<10; i++) {
        const grill = new THREE.Mesh(new THREE.TorusGeometry(8, 0.5, 16, 32), steel);
        grill.position.y = -10 + i*2;
        grill.rotation.x = Math.PI/2;
        ventR.add(grill);
    }
    ventsGroupRight.add(ventR);

    group.add(ventsGroupLeft, ventsGroupRight);

    parts.push({
        name: "entropyVents_Left",
        description: "Exhaust vents directing the massive entropic byproduct of ordered creation away from the core.",
        material: "Dark Steel / Steel",
        function: "Entropy dumping",
        assemblyOrder: 15,
        connections: ["containmentCore"],
        failureEffect: "Maximum entropy reached instantly; heat death of the new universe within seconds.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -90, y: 85, z: 45 }
    });

    parts.push({
        name: "entropyVents_Right",
        description: "Exhaust vents directing the massive entropic byproduct of ordered creation away from the core.",
        material: "Dark Steel / Steel",
        function: "Entropy dumping",
        assemblyOrder: 16,
        connections: ["containmentCore"],
        failureEffect: "Maximum entropy reached instantly; heat death of the new universe within seconds.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 90, y: 85, z: 45 }
    });

    // ==========================================
    // PART 17: ENTROPY PLUMES
    // ==========================================
    // Particle-like plumes using complex nested cylinders
    const plumeLGroup = new THREE.Group();
    const plumeRGroup = new THREE.Group();

    for(let i=0; i<5; i++) {
        const pGeom = new THREE.CylinderGeometry(1 + i*2, 10 + i*3, 60, 32, 1, true);
        
        const pl = new THREE.Mesh(pGeom, entropyMaterial);
        pl.position.set(-80, containmentCenter, 0);
        pl.rotation.z = Math.PI/2;
        plumeLGroup.add(pl);

        const pr = new THREE.Mesh(pGeom, entropyMaterial);
        pr.position.set(80, containmentCenter, 0);
        pr.rotation.z = -Math.PI/2;
        plumeRGroup.add(pr);
    }
    group.add(plumeLGroup, plumeRGroup);

    parts.push({
        name: "entropyPlume",
        description: "Visible emission of raw chaotic energy being bled off to allow order to form in the new universe.",
        material: "Entropy Plasma",
        function: "Waste byproduct",
        assemblyOrder: 17,
        connections: ["entropyVents_Left", "entropyVents_Right"],
        failureEffect: "None; purely an exhaust stream. But standing in it will un-weave your molecular bonds.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -120 }
    });

    // ==========================================
    // PART 18: OPERATOR CONSOLE (GOD SEAT)
    // ==========================================
    const consoleGroup = new THREE.Group();
    
    // Main Desk
    const deskGeom = new THREE.BoxGeometry(40, 10, 20);
    const desk = new THREE.Mesh(deskGeom, plastic);
    desk.position.set(0, 5, 80);
    consoleGroup.add(desk);

    // Side panels
    const sideGeom = new THREE.BoxGeometry(10, 15, 20);
    const sideL = new THREE.Mesh(sideGeom, darkSteel);
    sideL.position.set(-25, 7.5, 80);
    const sideR = new THREE.Mesh(sideGeom, darkSteel);
    sideR.position.set(25, 7.5, 80);
    consoleGroup.add(sideL, sideR);

    // Main Holographic Screen
    const screenGeom = new THREE.PlaneGeometry(36, 18);
    const screen = new THREE.Mesh(screenGeom, HUDMaterial);
    screen.position.set(0, 25, 75);
    screen.rotation.x = -Math.PI/8;
    consoleGroup.add(screen);

    // Intricate Keyboard / Dials
    for(let i=0; i<40; i++) {
        const btnGeom = new THREE.BoxGeometry(1, 1, 1);
        const btnMat = (i%3===0) ? neonBlueMaterial : (i%5===0 ? neonPurpleMaterial : plastic);
        const btn = new THREE.Mesh(btnGeom, btnMat);
        
        const row = Math.floor(i / 10);
        const col = i % 10;
        
        btn.position.set(-15 + col*3.3, 10.5, 75 + row*2.5);
        btn.rotation.x = -Math.PI/16;
        consoleGroup.add(btn);
    }

    // Huge joysticks for tweaking spacetime curvature
    const joyGeom = new THREE.CylinderGeometry(0.5, 1, 6, 16);
    const joyL = new THREE.Mesh(joyGeom, chrome);
    joyL.position.set(-18, 13, 85);
    joyL.rotation.x = -Math.PI/6;
    const joyR = new THREE.Mesh(joyGeom, chrome);
    joyR.position.set(18, 13, 85);
    joyR.rotation.x = -Math.PI/6;
    
    const joyBallGeom = new THREE.SphereGeometry(2, 16, 16);
    const joyBallL = new THREE.Mesh(joyBallGeom, entropyMaterial);
    joyBallL.position.y = 3;
    joyL.add(joyBallL);
    const joyBallR = new THREE.Mesh(joyBallGeom, neonBlueMaterial);
    joyBallR.position.y = 3;
    joyR.add(joyBallR);

    consoleGroup.add(joyL, joyR);
    group.add(consoleGroup);

    parts.push({
        name: "operatorConsole",
        description: "The God-Tier command station to dictate the fundamental constants (Speed of light, Planck length, Fine-structure constant) of the new universe.",
        material: "Plastic / Dark Steel / Neon HUD",
        function: "Parameter input and universal monitoring",
        assemblyOrder: 18,
        connections: ["gravitonStabilizer"],
        failureEffect: "Inability to tune constants; universe might default to 2 spatial dimensions or no time dimension.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 150 }
    });


    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const state = {
        inflationStage: 0,
        time: 0
    };

    function animate(time, speed, meshes) {
        state.time += speed * 0.01;
        
        // 1. Gyroscopic Rings Frantic Rotation
        // Ring X rotates on X and slightly Y
        ringX.rotation.x += speed * 0.08;
        ringX.rotation.y = Math.sin(state.time * 0.5) * 0.2;
        
        // Ring Y rotates on Y and Z
        ringY.rotation.y -= speed * 0.12;
        ringY.rotation.z += speed * 0.05;
        
        // Ring Z rotates frantically on Z and X
        ringZ.rotation.z += speed * 0.15;
        ringZ.rotation.x -= speed * 0.07;

        // 2. Hydraulic Piston Pumping
        pistons.forEach(p => {
            // Complex sine wave mapping to create mechanical pumping action
            p.rod.position.y = 10 + Math.sin(state.time * 8 + p.offset * Math.PI/2) * 5;
        });

        // 3. Plasma Conduits Flow
        tubes.forEach((t, index) => {
            // Shift texture/opacity or scale to simulate flow
            t.material.opacity = 0.5 + Math.sin(state.time * 10 + index) * 0.5;
            t.scale.setScalar(1 + Math.sin(state.time * 15 + index) * 0.1);
        });

        // 4. Universe Inflation Lifecycle Logic
        // Loop every ~30 seconds (assuming standard speed)
        state.inflationStage = (state.time * 0.5) % 15; 
        
        if(state.inflationStage < 2) {
            // Phase 1: Pre-inflation - Singularity charging
            singularity.scale.set(1 + Math.sin(state.time * 20)*0.2, 1 + Math.sin(state.time * 20)*0.2, 1 + Math.sin(state.time * 20)*0.2);
            singularity.material.emissiveIntensity = 20 + Math.random() * 30; // Extreme flickering
            
            universeGroup.scale.set(0.01, 0.01, 0.01);
            nascentUniverse1.material.opacity = 0;
            nascentUniverse2.material.opacity = 0;
            nascentUniverse3.material.opacity = 0;
            
            // Plumes inactive
            plumeLGroup.scale.set(0.1, 1, 0.1);
            plumeRGroup.scale.set(0.1, 1, 0.1);
            
        } else if (state.inflationStage >= 2 && state.inflationStage < 5) {
            // Phase 2: Inflation! Exponential expansion
            const progress = (state.inflationStage - 2) / 3;
            // Easing function for explosive growth
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const targetScale = 0.01 + easeOutQuart * 2.2; 
            
            universeGroup.scale.set(targetScale, targetScale, targetScale);
            nascentUniverse1.material.opacity = easeOutQuart * 0.9;
            nascentUniverse2.material.opacity = easeOutQuart * 0.5;
            nascentUniverse3.material.opacity = easeOutQuart * 0.9;
            
            // Singularity consumed
            singularity.scale.setScalar(Math.max(0.01, 1 - easeOutQuart)); 

            // Plumes erupt
            plumeLGroup.scale.set(easeOutQuart, 1, easeOutQuart);
            plumeRGroup.scale.set(easeOutQuart, 1, easeOutQuart);
            
        } else if (state.inflationStage >= 5 && state.inflationStage < 12) {
            // Phase 3: Post-inflation cooling and structure formation
            // Throbbing slightly due to acoustic baryon oscillations
            const osc = Math.sin(state.time * 4) * 0.05;
            universeGroup.scale.setScalar(2.21 + osc); 
            
            // Complex internal rotations
            nascentUniverse1.rotation.y += speed * 0.02;
            nascentUniverse1.rotation.x += speed * 0.01;
            nascentUniverse2.rotation.y -= speed * 0.03;
            nascentUniverse2.rotation.z += speed * 0.015;
            
            // Color shift from hot white/blue to cooler purples/reds (redshift/cooling)
            const coolProgress = (state.inflationStage - 5) / 7;
            nascentUniverse1.material.color.setHSL(0.6 + coolProgress * 0.3, 1.0, 0.5); 
            nascentUniverse1.material.emissive.setHSL(0.6 + coolProgress * 0.3, 1.0, 0.5); 
            
            // Plumes fluctuate
            plumeLGroup.scale.x = 1 + Math.sin(state.time * 12) * 0.3;
            plumeLGroup.scale.z = 1 + Math.cos(state.time * 12) * 0.3;
            
            plumeRGroup.scale.x = 1 + Math.cos(state.time * 12) * 0.3;
            plumeRGroup.scale.z = 1 + Math.sin(state.time * 12) * 0.3;

            // Plume opacity pulsates
            plumeLGroup.children.forEach(c => c.material.opacity = 0.5 + Math.sin(state.time * 10)*0.2);
            plumeRGroup.children.forEach(c => c.material.opacity = 0.5 + Math.cos(state.time * 10)*0.2);

        } else {
            // Phase 4: Big Crunch / Heat Death (Resetting for loop)
            const shrink = 1 - ((state.inflationStage - 12) / 3);
            const easeInQuad = shrink * shrink;
            universeGroup.scale.setScalar(Math.max(0.01, 2.21 * easeInQuad));
            
            nascentUniverse1.material.opacity = easeInQuad * 0.9;
            nascentUniverse2.material.opacity = easeInQuad * 0.5;
            nascentUniverse3.material.opacity = easeInQuad * 0.9;

            plumeLGroup.scale.set(easeInQuad, 1, easeInQuad);
            plumeRGroup.scale.set(easeInQuad, 1, easeInQuad);
        }
    }

    const description = "The Vacuum Genesis Device (God Tier) is an unfathomably complex apparatus capable of engineering a localized Big Bang within a confined false-vacuum pocket. By carefully managing tachyonic time-dilation, gravitational shearing, and massive entropic byproducts, the creator can tune the fundamental constants of a brand new, bespoke universe before it expands into the higher-dimensional bulk.";

    const quizQuestions = [
        {
            question: "In the context of cosmic inflation theory, what is the role of the 'inflaton field' scalar during the first 10^-36 seconds of the universe's genesis?",
            options: [
                "It transitions from a false vacuum to a true vacuum, releasing potential energy that drives exponential spatial expansion.",
                "It generates the gravitational singularity by condensing dark matter into supermassive black holes.",
                "It creates the baryon asymmetry by violating CP symmetry in the electroweak epoch.",
                "It cools the quark-gluon plasma, allowing quarks to form the first protons and neutrons."
            ],
            answer: 0,
            explanation: "Cosmic inflation is driven by the potential energy of the inflaton scalar field rolling down to its minimum (true vacuum). This release of energy exerts a negative pressure, causing space to expand exponentially, solving the horizon and flatness problems."
        },
        {
            question: "To prevent a localized genesis event from collapsing into a black hole (the Hoop Conjecture limit), the device must nullify extreme gravitational energy. What hypothetical spin-2 gauge boson mediates this nullification field?",
            options: [
                "The Higgs Boson",
                "The Tachyon",
                "The Graviton",
                "The Sterile Neutrino"
            ],
            answer: 2,
            explanation: "The graviton is the hypothetical massless spin-2 gauge boson that mediates the force of gravity in quantum field theory. Nullifying or cancelling graviton interactions is required to prevent extreme mass-energy densities from forming an event horizon."
        },
        {
            question: "During the genesis of the new universe, the device dumps massive amounts of entropy via the exhaust vents. According to the Second Law of Thermodynamics, why is this strictly necessary?",
            options: [
                "Because creating a highly ordered, low-entropy initial state for the new universe requires a massive increase in entropy in the surrounding environment (the lab).",
                "Because entropy is directly converted into the mass of the new universe via E=mc^2.",
                "Because without entropy dumping, the universe would freeze at absolute zero instantly.",
                "Because entropy acts as a catalyst for quantum tunneling across the multiverse barrier."
            ],
            answer: 0,
            explanation: "The initial state of a universe (like our Big Bang) must be extremely low entropy to allow for future thermodynamic arrows of time. Establishing this highly ordered state locally requires expelling a massive amount of entropy to the exterior to satisfy the Second Law of Thermodynamics (total entropy of a closed system must increase)."
        },
        {
            question: "If the 'Dark Energy Condensers' fail and the cosmological constant (Λ) is set too high (w < -1), what is the ultimate thermodynamic fate of the new universe?",
            options: [
                "The Big Crunch",
                "The Big Bounce",
                "The Big Rip",
                "False Vacuum Decay"
            ],
            answer: 2,
            explanation: "A very high cosmological constant (specifically phantom energy where the equation of state parameter w < -1) causes the expansion rate of the universe to accelerate so violently that it eventually overcomes all fundamental forces, tearing apart galaxies, stars, planets, and eventually atomic nuclei themselves in a 'Big Rip'."
        },
        {
            question: "The 'Boson Injectors' spray Higgs Bosons to give the universe mass. By what exact mechanism does the Higgs field confer mass to elementary fermions (like electrons and quarks)?",
            options: [
                "Through gravitational attraction between the Higgs boson and the fermion.",
                "Through Yukawa coupling to the non-zero vacuum expectation value of the Higgs field after electroweak symmetry breaking.",
                "By strong nuclear force interactions binding quarks together via gluon exchange.",
                "By converting massless photons into heavy W and Z bosons via radioactive beta decay."
            ],
            answer: 1,
            explanation: "Fermions acquire mass through Yukawa coupling with the Higgs field. When the universe cools and the Higgs field acquires a non-zero vacuum expectation value (spontaneous symmetry breaking), the interaction (coupling) with this ubiquitous field manifests as inertial mass for the particles."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
