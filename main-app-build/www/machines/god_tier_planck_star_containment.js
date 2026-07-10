import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // CUSTOM HIGH-TECH & GLOWING MATERIALS
    // ==========================================
    
    const hyperCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.95,
        roughness: 0.0,
        metalness: 0.1
    });

    const dilationGridMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const plasmaContainmentMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xcc00cc,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.8
    });

    const heavyScaffoldMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.6,
        side: THREE.DoubleSide
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0x332200,
        emissiveIntensity: 0.5
    });

    const neonBlueMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 5.0
    });

    const neonRedMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================

    function createLatheProfile(pointsData) {
        const points = [];
        for (let i = 0; i < pointsData.length; i++) {
            points.push(new THREE.Vector2(pointsData[i][0], pointsData[i][1]));
        }
        return new THREE.LatheGeometry(points, 128); // high poly
    }

    function createExtrudedGear(teeth, outerRadius, innerRadius, depth) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle1 = i * step;
            const angle2 = angle1 + step / 2;
            shape.lineTo(Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius);
            shape.lineTo(Math.cos(angle2) * innerRadius, Math.sin(angle2) * innerRadius);
        }
        shape.lineTo(Math.cos(0) * outerRadius, Math.sin(0) * outerRadius);
        
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius * 0.5, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createIntricateScaffold() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(2, 0);
        shape.lineTo(2.5, 1);
        shape.lineTo(1.5, 2);
        shape.lineTo(1.5, 4);
        shape.lineTo(3, 4.5);
        shape.lineTo(3, 5);
        shape.lineTo(0.5, 5);
        shape.lineTo(0, 4);
        shape.lineTo(0, 0);

        const hole1 = new THREE.Path();
        hole1.absarc(1, 1, 0.4, 0, Math.PI * 2, false);
        shape.holes.push(hole1);

        const hole2 = new THREE.Path();
        hole2.absarc(1.2, 3, 0.5, 0, Math.PI * 2, false);
        shape.holes.push(hole2);

        return new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 });
    }

    // ==========================================
    // COMPONENT GENERATION
    // ==========================================
    const meshesToAnimate = [];

    // 1. PLANCK STAR CORE (Microscopic but impossibly bright)
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 5);
    const coreMesh = new THREE.Mesh(coreGeo, hyperCoreMat);
    coreGroup.add(coreMesh);

    // Inner horizon shell (distorted spacetime bounding)
    const horizonGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const horizonMesh = new THREE.Mesh(horizonGeo, plasmaContainmentMat);
    coreGroup.add(horizonMesh);
    
    // Core spikes of intense gravity waves
    for(let i=0; i<20; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.1, 4, 16);
        const spike = new THREE.Mesh(spikeGeo, hyperCoreMat);
        spike.position.set(0,0,0);
        spike.lookAt(new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5));
        spike.rotateX(Math.PI/2);
        coreGroup.add(spike);
    }
    group.add(coreGroup);
    meshesToAnimate.push({ mesh: coreGroup, type: 'core' });
    meshesToAnimate.push({ mesh: horizonMesh, type: 'horizon' });

    parts.push({
        name: "Planck Star Core",
        description: "An exploding black hole halted at the Planck density, its bounce heavily slowed by extreme time dilation. It emits Hawking radiation and fierce gravitational waves.",
        material: "Hyper-Emissive Degenerate Matter",
        function: "Source of unlimited, quasi-infinite energy density.",
        assemblyOrder: 1,
        connections: ["Inner Time-Dilation Grid", "Quantum Horizon Stabilizers"],
        failureEffect: "Instantaneous macro-scale bounce; localized destruction of spacetime topology.",
        cascadeFailures: ["Spacetime Grid Collapse", "Containment Scaffolding Vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 2. TIME DILATION GRIDS (Complex nested wireframes)
    const dilationGroup = new THREE.Group();
    const grid1Geo = new THREE.TorusKnotGeometry(3, 0.5, 256, 64, 3, 5);
    const grid1 = new THREE.Mesh(grid1Geo, dilationGridMat);
    dilationGroup.add(grid1);
    
    const grid2Geo = new THREE.TorusKnotGeometry(4.5, 0.8, 256, 64, 5, 7);
    const grid2 = new THREE.Mesh(grid2Geo, dilationGridMat);
    dilationGroup.add(grid2);
    
    const grid3Geo = new THREE.IcosahedronGeometry(6, 4);
    const grid3 = new THREE.Mesh(grid3Geo, new THREE.MeshStandardMaterial({
        color: 0x0022ff, emissive: 0x001188, emissiveIntensity: 2, wireframe: true, transparent: true, opacity: 0.3
    }));
    dilationGroup.add(grid3);

    group.add(dilationGroup);
    meshesToAnimate.push({ mesh: dilationGroup, type: 'dilationGrids' });

    parts.push({
        name: "Time-Dilation Manifolds",
        description: "Gravitomagnetic field generators projecting a localized metric tensor distortion. Slows the Planck Star's outward explosion from milliseconds to millennia.",
        material: "Exotic Matter-infused Metamaterials",
        function: "Modifies the local flow of time.",
        assemblyOrder: 2,
        connections: ["Planck Star Core", "Superconducting Coils"],
        failureEffect: "Time accelerates to normal; explosion occurs instantly.",
        cascadeFailures: ["Core Detonation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 }
    });

    // 3. QUANTUM STABILIZER RINGS
    const ringGroup = new THREE.Group();
    const numRings = 8;
    const ringRadii = [8, 9, 10, 11, 12, 13, 14, 15];
    const rings = [];
    
    for (let i = 0; i < numRings; i++) {
        const r = ringRadii[i];
        const rGeo = new THREE.TorusGeometry(r, 0.4 + i*0.1, 32, 100);
        const rMesh = new THREE.Mesh(rGeo, i % 2 === 0 ? steel : chrome);
        
        // Add intricate details to the ring
        for (let j = 0; j < 36; j++) {
            const angle = (j / 36) * Math.PI * 2;
            const nodeGeo = new THREE.CylinderGeometry(0.6 + i*0.1, 0.6 + i*0.1, 1.2, 16);
            const node = new THREE.Mesh(nodeGeo, goldFoilMat);
            node.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
            node.rotation.x = Math.PI / 2;
            node.rotation.z = angle;
            rMesh.add(node);
            
            // Add glowing neon emitters to nodes
            if (j % 4 === 0) {
                const emitter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.5), neonBlueMat);
                emitter.position.copy(node.position);
                emitter.rotation.copy(node.rotation);
                rMesh.add(emitter);
            }
        }
        
        // Tilt the ring
        rMesh.rotation.x = Math.random() * Math.PI;
        rMesh.rotation.y = Math.random() * Math.PI;
        ringGroup.add(rMesh);
        rings.push(rMesh);
    }
    group.add(ringGroup);
    meshesToAnimate.push({ mesh: rings, type: 'stabilizerRings' });

    parts.push({
        name: "Quantum Stabilizer Ring Array",
        description: "Eight massive interlocking rings that project a confining Penrose-Carter geometric boundary.",
        material: "Chrome and Gold-Foil wrapped Superconductors",
        function: "Maintains the spatial integrity of the containment field.",
        assemblyOrder: 3,
        connections: ["Main Scaffolding", "Hydraulic Dampeners"],
        failureEffect: "Spatial geometry tears, causing intense gravitational shearing.",
        cascadeFailures: ["Scaffold Collapse", "Coolant Line Rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 20, z: 40 }
    });

    // 4. MAIN CONTAINMENT SCAFFOLDING (Extruded and Lathed Geometries)
    const scaffoldGroup = new THREE.Group();
    
    // Top and Bottom massive hub caps
    const hubPoints = [
        [2, 0], [15, 2], [16, 4], [14, 5], [10, 5], [8, 8], [4, 8], [2, 10], [0, 10]
    ];
    const topHubGeo = createLatheProfile(hubPoints);
    const topHub = new THREE.Mesh(topHubGeo, heavyScaffoldMat);
    topHub.position.y = 16;
    scaffoldGroup.add(topHub);
    
    const bottomHub = new THREE.Mesh(topHubGeo, heavyScaffoldMat);
    bottomHub.rotation.x = Math.PI;
    bottomHub.position.y = -16;
    scaffoldGroup.add(bottomHub);

    // Huge Pillars connecting hubs
    const numPillars = 12;
    const pillars = [];
    for (let i = 0; i < numPillars; i++) {
        const angle = (i / numPillars) * Math.PI * 2;
        const radius = 14;
        
        const pillarGeo = new THREE.CylinderGeometry(1, 1.5, 32, 32);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel);
        pillar.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        
        // Add intricate bands to pillars
        for (let y = -14; y <= 14; y += 4) {
            const bandGeo = new THREE.TorusGeometry(1.6, 0.3, 16, 32);
            const band = new THREE.Mesh(bandGeo, copper);
            band.position.y = y;
            band.rotation.x = Math.PI / 2;
            pillar.add(band);
        }

        // Add extreme hydraulic pistons inside pillars
        const pistonBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
        const pistonBase = new THREE.Mesh(pistonBaseGeo, chrome);
        pistonBase.position.y = -10;
        pillar.add(pistonBase);

        const pistonRodGeo = new THREE.CylinderGeometry(0.4, 0.4, 15, 16);
        const pistonRod = new THREE.Mesh(pistonRodGeo, steel);
        pistonRod.position.y = 5;
        pillar.add(pistonRod);
        
        pillars.push({ base: pistonBase, rod: pistonRod, originalY: 5, phase: i });

        // Add side intricate scaffolds
        const sideScaffoldGeo = createIntricateScaffold();
        const sideScaffold = new THREE.Mesh(sideScaffoldGeo, aluminum);
        sideScaffold.position.set(2, 0, 0);
        sideScaffold.rotation.y = -angle; // face outward
        pillar.add(sideScaffold);

        scaffoldGroup.add(pillar);
    }
    meshesToAnimate.push({ mesh: pillars, type: 'hydraulicPillars' });
    group.add(scaffoldGroup);

    parts.push({
        name: "Macro-Scaffolding and Hydraulic Dampeners",
        description: "Gigantic superstructure built to withstand the immense outward pressure of the containment fields. Features active hydraulic load balancing.",
        material: "Dark Steel, Chrome, Copper Bands",
        function: "Structural integrity and physical load distribution.",
        assemblyOrder: 4,
        connections: ["Quantum Stabilizer Rings", "Base Hubs", "Coolant Systems"],
        failureEffect: "Catastrophic structural failure; physical collapse of the facility.",
        cascadeFailures: ["Containment Breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: 0, z: -50 }
    });

    // 5. MAGNETIC CONTAINMENT COILS (Complex winding tubes)
    const coilGroup = new THREE.Group();
    class WindingCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            // Complex winding path wrapping around the whole core and rings
            const r = 16 + Math.sin(t * Math.PI * 10) * 2;
            const tx = Math.cos(t * Math.PI * 2 * 5) * r;
            const ty = Math.sin(t * Math.PI * 2 * 3) * 18;
            const tz = Math.sin(t * Math.PI * 2 * 5) * r;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const path1 = new WindingCurve(1.0);
    const coilGeo1 = new THREE.TubeGeometry(path1, 512, 0.4, 16, true);
    const coilMesh1 = new THREE.Mesh(coilGeo1, superConductorMat);
    coilGroup.add(coilMesh1);

    const path2 = new WindingCurve(1.05);
    const coilGeo2 = new THREE.TubeGeometry(path2, 512, 0.2, 16, true);
    const coilMesh2 = new THREE.Mesh(coilGeo2, neonRedMat);
    coilMesh2.rotation.y = Math.PI / 4;
    coilGroup.add(coilMesh2);

    group.add(coilGroup);
    meshesToAnimate.push({ mesh: coilGroup, type: 'magneticCoils' });

    parts.push({
        name: "Superconducting Magnetic Coils",
        description: "Kilometers of hyper-cooled superconducting cables winding around the containment vessel to generate multi-tesla fields.",
        material: "Carbon-Nanotube YBCO Superconductors",
        function: "Deflects charged plasma jets emitted by the Planck Star.",
        assemblyOrder: 5,
        connections: ["Coolant Pipelines", "Energy Injectors"],
        failureEffect: "Plasma jets slice through the physical scaffolding.",
        cascadeFailures: ["Scaffold Collapse", "Operator Cabin Incineration"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 50 }
    });

    // 6. ENERGY INJECTORS (Pulsing massive cylinders)
    const injectorsGroup = new THREE.Group();
    const injectorCount = 6;
    const injectors = [];
    for(let i=0; i<injectorCount; i++) {
        const angle = (i/injectorCount) * Math.PI * 2;
        const injGroup = new THREE.Group();
        
        const barrelGeo = new THREE.CylinderGeometry(2, 2.5, 20, 32);
        const barrel = new THREE.Mesh(barrelGeo, darkSteel);
        barrel.rotation.x = Math.PI / 2;
        injGroup.add(barrel);
        
        const coreGlowGeo = new THREE.CylinderGeometry(1.5, 1.5, 20.2, 32);
        const coreGlow = new THREE.Mesh(coreGlowGeo, neonBlueMat);
        coreGlow.rotation.x = Math.PI / 2;
        injGroup.add(coreGlow);
        injectors.push(coreGlow);

        const ringGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
        for(let z=-8; z<=8; z+=4) {
            const ring = new THREE.Mesh(ringGeo, aluminum);
            ring.position.z = z;
            injGroup.add(ring);
        }

        injGroup.position.set(Math.cos(angle) * 22, 0, Math.sin(angle) * 22);
        injGroup.lookAt(0,0,0);
        injectorsGroup.add(injGroup);
    }
    group.add(injectorsGroup);
    meshesToAnimate.push({ mesh: injectors, type: 'energyInjectors' });

    parts.push({
        name: "Zero-Point Energy Injectors",
        description: "Massive cannons firing coherent vacuum energy into the dilation field to sustain the extreme relativistic conditions.",
        material: "Dark Steel and Glowing Plasma Chambers",
        function: "Provides the immense power required to keep the time-dilation grid active.",
        assemblyOrder: 6,
        connections: ["Time-Dilation Manifolds", "Main Power Grid"],
        failureEffect: "Dilation field decays exponentially.",
        cascadeFailures: ["Time-Dilation Grid Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 60, y: -20, z: -60 }
    });

    // 7. EXHAUST VENTS (Arrays of intricately louvered vents)
    const ventGroup = new THREE.Group();
    const ventCapGeo = new THREE.BoxGeometry(4, 1, 4);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const v = new THREE.Mesh(ventCapGeo, steel);
        v.position.set(Math.cos(angle) * 12, 16, Math.sin(angle) * 12);
        v.lookAt(0, 16, 0);
        
        // Louvers
        for(let l=-1.5; l<=1.5; l+=0.5) {
            const louver = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 0.8), rubber);
            louver.position.set(0, 0.5, l);
            louver.rotation.x = Math.PI / 4;
            v.add(louver);
        }
        
        // Emissive steam indicator
        const steam = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 3.5), neonRedMat);
        steam.position.y = 0.4;
        v.add(steam);
        
        ventGroup.add(v);
    }
    group.add(ventGroup);

    parts.push({
        name: "Hawking Radiation Exhaust Vents",
        description: "Heat sinks and louvered vents designed to bleed off excess thermal radiation and quantum fluctuations.",
        material: "Steel and Thermal Rubber Louvers",
        function: "Thermal regulation of the upper hubs.",
        assemblyOrder: 7,
        connections: ["Top Hub"],
        failureEffect: "Thermal runaway in the hub superstructure.",
        cascadeFailures: ["Hub Melt", "Pillar Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 40, z: 20 }
    });

    // 8. COOLANT PIPELINES (Complex network)
    const pipeGroup = new THREE.Group();
    const pipeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88, metalness: 0.5, roughness: 0.2, clearcoat: 1.0
    });
    for(let i=0; i<40; i++) {
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3((Math.random()-0.5)*30, -16, (Math.random()-0.5)*30),
            new THREE.Vector3((Math.random()-0.5)*20, -5, (Math.random()-0.5)*20),
            new THREE.Vector3((Math.random()-0.5)*25, 5, (Math.random()-0.5)*25),
            new THREE.Vector3((Math.random()-0.5)*30, 16, (Math.random()-0.5)*30)
        ]);
        const pGeo = new THREE.TubeGeometry(pipePath, 64, 0.3 + Math.random()*0.3, 8, false);
        const pipe = new THREE.Mesh(pGeo, pipeMaterial);
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);

    parts.push({
        name: "Cryogenic Coolant Pipeline Network",
        description: "A chaotic but precisely calculated network of pipes circulating liquid helium and exotic phase-change coolants.",
        material: "Reinforced Plasteel",
        function: "Prevents the magnetic coils and physical scaffolding from melting due to radiant energy.",
        assemblyOrder: 8,
        connections: ["Magnetic Containment Coils", "Main Scaffolding"],
        failureEffect: "Rapid heating of superconductor coils.",
        cascadeFailures: ["Superconductor Quench", "Magnetic Field Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 30, z: -40 }
    });

    // 9. OPERATOR CABIN (Highly detailed observation deck)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 0, 30);
    
    // Main Hull
    const cabinHullGeo = new THREE.BoxGeometry(10, 6, 8);
    const cabinHull = new THREE.Mesh(cabinHullGeo, plastic);
    cabinGroup.add(cabinHull);

    // Front Window (Tinted Glass)
    const windowGeo = new THREE.BoxGeometry(9.6, 3, 0.5);
    const cabinWindow = new THREE.Mesh(windowGeo, tinted);
    cabinWindow.position.set(0, 0.5, -4);
    cabinGroup.add(cabinWindow);

    // Control Panels inside (visible through window if camera goes inside)
    const deskGeo = new THREE.BoxGeometry(8, 1, 2);
    const desk = new THREE.Mesh(deskGeo, darkSteel);
    desk.position.set(0, -1, -2.5);
    cabinGroup.add(desk);

    // Glowing screens on desk
    for(let i=0; i<4; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), neonBlueMat);
        screen.position.set(-3 + i*2, -0.2, -3);
        screen.rotation.x = -Math.PI / 4;
        cabinGroup.add(screen);
    }

    // Antennas on cabin
    for(let i=0; i<2; i++) {
        const antGeo = new THREE.CylinderGeometry(0.05, 0.1, 4);
        const ant = new THREE.Mesh(antGeo, chrome);
        ant.position.set(-4 + i*8, 5, 2);
        cabinGroup.add(ant);
    }

    group.add(cabinGroup);

    parts.push({
        name: "Observation & Control Cabin",
        description: "Heavily shielded, lead-lined control room featuring tinted quantum-glass windows. Operators monitor the containment stability here.",
        material: "Plasteel, Tinted Quantum Glass",
        function: "Human-in-the-loop oversight and telemetry processing.",
        assemblyOrder: 9,
        connections: ["Main Telemetry Bus", "External Walkways"],
        failureEffect: "Loss of manual override capabilities.",
        cascadeFailures: ["Automated Systems Desynchronization"],
        originalPosition: { x: 0, y: 0, z: 30 },
        explodedPosition: { x: 0, y: 0, z: 80 }
    });

    // 10. EXTERNAL CATWALKS (Ladders and walkways for maintenance)
    const walkGroup = new THREE.Group();
    const ringWalkGeo = new THREE.TorusGeometry(26, 0.8, 4, 64); // Flat torus
    const ringWalk = new THREE.Mesh(ringWalkGeo, steel);
    ringWalk.rotation.x = Math.PI / 2;
    ringWalk.position.y = 0;
    walkGroup.add(ringWalk);

    // Railings
    const railingGeo = new THREE.TorusGeometry(26.6, 0.1, 4, 64);
    const railing = new THREE.Mesh(railingGeo, aluminum);
    railing.rotation.x = Math.PI / 2;
    railing.position.y = 1;
    walkGroup.add(railing);

    // Spokes to connect walk to hubs
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const spokeGeo = new THREE.BoxGeometry(10, 0.5, 2);
        const spoke = new THREE.Mesh(spokeGeo, darkSteel);
        spoke.position.set(Math.cos(angle)*21, 0, Math.sin(angle)*21);
        spoke.rotation.y = -angle;
        walkGroup.add(spoke);
    }
    group.add(walkGroup);

    parts.push({
        name: "Maintenance Catwalks",
        description: "Ring walkways and access spokes for drone and human maintenance of the outer scaffolding.",
        material: "Steel Grating and Aluminum Railings",
        function: "Provides access to the massive superstructure.",
        assemblyOrder: 10,
        connections: ["Operator Cabin", "Main Scaffolding Pillars"],
        failureEffect: "Maintenance impossible.",
        cascadeFailures: ["Gradual Component Degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 11. GEARBOX ARRAYS (Giant spinning gears at the bases)
    const gearGroup = new THREE.Group();
    const gears = [];
    const gearGeo = createExtrudedGear(24, 6, 4, 2);
    for(let i=0; i<4; i++) {
        const gear = new THREE.Mesh(gearGeo, copper);
        gear.position.set((i%2===0?1:-1)*10, -18, (i<2?1:-1)*10);
        gear.rotation.x = Math.PI / 2;
        gearGroup.add(gear);
        gears.push({ mesh: gear, speed: (i%2===0?1:-1)*0.02 });
    }
    group.add(gearGroup);
    meshesToAnimate.push({ mesh: gears, type: 'gears' });

    parts.push({
        name: "Gyroscopic Stabilizer Gears",
        description: "Massive copper-beryllium gears that provide physical gyroscopic stabilization to the lower hub.",
        material: "Copper-Beryllium Alloy",
        function: "Counters torsional shear forces exerted by the time-dilation fields.",
        assemblyOrder: 11,
        connections: ["Bottom Hub"],
        failureEffect: "Torsional vibrations rip the lower hub apart.",
        cascadeFailures: ["Scaffold Collapse"],
        originalPosition: { x: 0, y: -18, z: 0 },
        explodedPosition: { x: -40, y: -40, z: 40 }
    });

    // 12. GRAVITY ANCHORS (Pyramidal structures digging into the floor)
    const anchorGroup = new THREE.Group();
    const anchorGeo = new THREE.CylinderGeometry(0, 4, 8, 4);
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        const anchor = new THREE.Mesh(anchorGeo, darkSteel);
        anchor.position.set(Math.cos(angle)*24, -20, Math.sin(angle)*24);
        anchor.rotation.y = -angle;
        
        // Add glowing trim to anchors
        const trim = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1, 4), neonRedMat);
        trim.position.y = -3;
        anchor.add(trim);

        anchorGroup.add(anchor);
    }
    group.add(anchorGroup);

    parts.push({
        name: "Tectonic Gravity Anchors",
        description: "Deep-crust penetrating spikes that anchor the entire containment facility to the planet's bedrock.",
        material: "Dark Steel and Plasteel",
        function: "Prevents the facility from being lifted into the air by the localized gravity inversion.",
        assemblyOrder: 12,
        connections: ["Gyroscopic Gears", "Planetary Crust"],
        failureEffect: "Facility detaches from bedrock and accelerates upwards.",
        cascadeFailures: ["Catastrophic Structural Tear"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -60, z: 0 }
    });

    // 13. SENSOR ARRAYS (Dishes orbiting the core)
    const sensorGroup = new THREE.Group();
    const dishGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    for(let i=0; i<6; i++) {
        const dish = new THREE.Mesh(dishGeo, chrome);
        const pivot = new THREE.Group();
        dish.position.set(0, 0, 10);
        dish.rotation.x = -Math.PI / 2; // face core
        pivot.rotation.y = (i/6) * Math.PI * 2;
        pivot.rotation.x = (Math.random() - 0.5) * Math.PI;
        
        // Add antenna to dish
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), steel);
        ant.position.set(0, 1, 0);
        dish.add(ant);
        
        pivot.add(dish);
        sensorGroup.add(pivot);
    }
    group.add(sensorGroup);
    meshesToAnimate.push({ mesh: sensorGroup, type: 'sensors' });

    parts.push({
        name: "Quantum Interferometry Sensors",
        description: "Highly sensitive dishes arrayed in a spherical constellation to measure the exact radius of the exploding Planck Core.",
        material: "Chrome and Steel",
        function: "Provides real-time feedback to the dilation grid.",
        assemblyOrder: 13,
        connections: ["Main Telemetry Bus"],
        failureEffect: "Blind spots in dilation field mapping.",
        cascadeFailures: ["Dilation Grid Desync", "Core Detonation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 50, z: -20 }
    });
    
    // 14. NEUTRINO BAFFLES (Large flat plates protecting sensitive gear)
    const baffleGroup = new THREE.Group();
    const baffleGeo = new THREE.PlaneGeometry(8, 12);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2 + Math.PI/8;
        const baffle = new THREE.Mesh(baffleGeo, new THREE.MeshStandardMaterial({
            color: 0x111111, metalness: 0.8, roughness: 0.5, side: THREE.DoubleSide
        }));
        baffle.position.set(Math.cos(angle)*18, 0, Math.sin(angle)*18);
        baffle.rotation.y = -angle + Math.PI/2;
        baffleGroup.add(baffle);
    }
    group.add(baffleGroup);

    parts.push({
        name: "Neutrino Baffles",
        description: "Thick plates of dense exotic matter designed to absorb and deflect high-energy neutrinos emitted by the core.",
        material: "Exotic Dense Matter",
        function: "Protects exterior electronics from neutrino-induced bit flips.",
        assemblyOrder: 14,
        connections: ["Main Scaffolding"],
        failureEffect: "Widespread electronic failures and AI hallucination.",
        cascadeFailures: ["Operator Cabin Loss of Control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 10, z: -40 }
    });

    // 15. SECONDARY BACKUP GENERATORS (Small spinning turbines)
    const genGroup = new THREE.Group();
    const genGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    const turbines = [];
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const gen = new THREE.Mesh(genGeo, steel);
        gen.position.set(Math.cos(angle)*28, -16, Math.sin(angle)*28);
        gen.rotation.x = Math.PI/2;
        gen.rotation.z = angle;
        
        // Turbine blades
        for(let b=0; b<3; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 1), aluminum);
            blade.rotation.y = (b/3) * Math.PI * 2;
            gen.add(blade);
        }
        genGroup.add(gen);
        turbines.push(gen);
    }
    group.add(genGroup);
    meshesToAnimate.push({ mesh: turbines, type: 'turbines' });

    parts.push({
        name: "Auxiliary Spin Turbines",
        description: "Fast-spinning backup generators that run on ambient thermal gradients in case primary zero-point injectors fail.",
        material: "Steel and Aluminum",
        function: "Provides critical emergency power to the control cabin.",
        assemblyOrder: 15,
        connections: ["Maintenance Catwalks", "Tectonic Anchors"],
        failureEffect: "Complete loss of power if primary injectors fail.",
        cascadeFailures: ["Total Facility Wipeout"],
        originalPosition: { x: 0, y: -16, z: 0 },
        explodedPosition: { x: 50, y: -20, z: 50 }
    });


    // ==========================================
    // ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        meshes.forEach(item => {
            if (item.type === 'core') {
                // Core pulsating incredibly fast, varying scale
                const scale = 1.0 + Math.sin(t * 10) * 0.1 + Math.sin(t * 37) * 0.05;
                item.mesh.scale.set(scale, scale, scale);
                item.mesh.rotation.x += 0.05 * speed;
                item.mesh.rotation.y += 0.07 * speed;
            }
            if (item.type === 'horizon') {
                // Horizon pulses counter to the core
                const scale = 1.0 + Math.sin(t * 5 + Math.PI) * 0.05;
                item.mesh.scale.set(scale, scale, scale);
                item.mesh.rotation.y -= 0.02 * speed;
                item.mesh.material.opacity = 0.4 + Math.sin(t * 8) * 0.1;
            }
            if (item.type === 'dilationGrids') {
                // The grids spin on multiple axes to show spatial distortion
                item.mesh.children[0].rotation.x += 0.01 * speed;
                item.mesh.children[0].rotation.y -= 0.015 * speed;
                
                item.mesh.children[1].rotation.y += 0.02 * speed;
                item.mesh.children[1].rotation.z += 0.01 * speed;
                
                item.mesh.children[2].rotation.x -= 0.005 * speed;
                item.mesh.children[2].rotation.z -= 0.02 * speed;
                
                // Pulse emissive intensity to simulate power draw
                item.mesh.children[0].material.emissiveIntensity = 2.0 + Math.sin(t * 2) * 1.5;
            }
            if (item.type === 'stabilizerRings') {
                // Nested rings spin on complex gimbals
                item.mesh.forEach((ring, idx) => {
                    const ringSpeed = 0.05 + (idx * 0.01);
                    if (idx % 2 === 0) {
                        ring.rotation.x += ringSpeed * speed;
                        ring.rotation.y += (ringSpeed/2) * speed;
                    } else {
                        ring.rotation.y -= ringSpeed * speed;
                        ring.rotation.z += (ringSpeed/2) * speed;
                    }
                });
            }
            if (item.type === 'hydraulicPillars') {
                // Pistons move up and down to fight "pressure" from the core
                item.mesh.forEach((pillarInfo) => {
                    // Complex sine wave based on phase to make them asynchronous
                    const pistonOffset = Math.sin(t * 2 + pillarInfo.phase) * 3;
                    pillarInfo.rod.position.y = pillarInfo.originalY + pistonOffset;
                });
            }
            if (item.type === 'magneticCoils') {
                // Slowly rotate the whole coil assembly
                item.mesh.rotation.y += 0.005 * speed;
                item.mesh.rotation.x = Math.sin(t * 0.5) * 0.1; // wobble
            }
            if (item.type === 'energyInjectors') {
                // Glowing cores of injectors pulse heavily
                item.mesh.forEach((glowMesh, idx) => {
                    glowMesh.material.emissiveIntensity = 5.0 + Math.sin(t * 15 + idx) * 4.0;
                });
            }
            if (item.type === 'gears') {
                item.mesh.forEach(g => {
                    g.mesh.rotation.z += g.speed * speed;
                });
            }
            if (item.type === 'sensors') {
                // Constantly orbiting the core
                item.mesh.rotation.x += 0.01 * speed;
                item.mesh.rotation.y += 0.02 * speed;
                item.mesh.rotation.z += 0.015 * speed;
            }
            if (item.type === 'turbines') {
                item.mesh.forEach(turb => {
                    turb.children.forEach(blade => {
                        blade.rotation.x += 0.2 * speed; // spin fast
                    });
                });
            }
        });
    };

    // ==========================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of Loop Quantum Gravity (LQG), the bounce of a Planck Star avoids the classical singularity via quantum gravitational repulsion. Which geometric operator's discrete spectrum is primarily responsible for the existence of a minimum, non-zero volume gap?",
            options: [
                "The Area Operator",
                "The Volume Operator",
                "The Holonomy Operator",
                "The Hamiltonian Constraint"
            ],
            correctAnswer: 1,
            explanation: "In LQG, the volume operator has a discrete spectrum with a non-zero minimum eigenvalue, meaning space itself is quantized. This absolute minimum volume prevents matter from collapsing into a zero-volume singularity, inducing the 'bounce'."
        },
        {
            question: "To an external observer, the bounce of a Planck Star appears to take billions of years. To an observer falling alongside the matter, the bounce takes on the order of milliseconds. What primary relativistic phenomenon reconciles these two timelines?",
            options: [
                "Lorentz Contraction",
                "Extreme Gravitational Time Dilation near the horizon",
                "Hawking Radiation emission delay",
                "Quantum Entanglement decoherence"
            ],
            correctAnswer: 1,
            explanation: "Due to the intense gravitational field near the effective horizon of the extremely dense star, general relativistic time dilation causes external observers to perceive the millisecond bounce occurring over cosmological timescales."
        },
        {
            question: "The containment facility utilizes a localized 'Penrose-Carter' geometric boundary. In a Penrose diagram of a bouncing black hole spacetime, what replaces the classical singularity line?",
            options: [
                "A spacelike curve representing the quantum transition region (bounce)",
                "A null infinity boundary",
                "A Cauchy horizon",
                "An anti-de Sitter boundary"
            ],
            correctAnswer: 0,
            explanation: "In the effective quantum spacetime of a Planck Star, the classical spacelike singularity is resolved and replaced by a spacelike quantum transition region where the collapsing metric tunnels into an exploding white hole metric."
        },
        {
            question: "If the Time-Dilation Grids fail and the Planck Star explodes instantly, it emits a burst of high-energy radiation. According to the phenomenological models of Planck Star explosions, what wavelength characterizes this final burst?",
            options: [
                "Radio waves",
                "Cosmic Microwave Background frequencies",
                "Short Gamma-Ray Bursts (approx 10^14 eV)",
                "Visible light"
            ],
            correctAnswer: 2,
            explanation: "Theoretical models suggest that exploding primordial black holes (Planck Stars) would emit a characteristic burst of highly energetic gamma rays, with energies potentially reaching into the TeV (10^12 eV) range and above."
        },
        {
            question: "The facility's 'Magnetic Containment Coils' are designed to deflect charged plasma. However, the initial explosion is dominated by neutral Hawking radiation. How does the facility contain the neutral particle flux?",
            options: [
                "By ionizing it post-emission using the Zero-Point Energy Injectors",
                "By modifying the local metric tensor to trap geodesics within the Time-Dilation Manifolds",
                "By using standard lead shielding",
                "By cooling it to Absolute Zero"
            ],
            correctAnswer: 1,
            explanation: "Neutral particles (like photons and neutrinos) cannot be contained by magnetic fields. The only way to contain them is to curve the underlying spacetime metric so severely that their null geodesics bend back inward or remain trapped in stable orbits (photon spheres)."
        }
    ];

    return {
        group,
        parts,
        description: "The God-Tier Planck Star Containment Facility. An unprecedented marvel of astro-engineering, this immense superstructure cages a microscopic, exploding quantum black hole (a Planck Star). By generating overlapping extremized gravitational and time-dilation fields, the facility forces the star's millisecond bounce to stretch out over millennia, harvesting the quasar-level energy bleed off to power entire star systems. Any catastrophic failure results in instantaneous vaporisation of the local spacetime sector.",
        quizQuestions,
        animate,
        meshesToAnimate
    };
}
