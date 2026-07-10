import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = []; // Callbacks for the animation loop
    const timeRef = { value: 0 };

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const quantumCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        emissive: 0x2200ff,
        emissiveIntensity: 2.5,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95
    });

    const singularityMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        wireframe: true
    });

    const plasmaConduitMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.0
    });

    const casimirPlateMat = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 1.0,
        roughness: 0.2,
        envMapIntensity: 2.0
    });

    const energyGridMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.4
    });

    const warningLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    // ==========================================
    // HELPER FUNCTIONS FOR PROCEDURAL GENERATION
    // ==========================================

    function createTireWithLugs(radius, tube, radialSegments, tubularSegments, lugCount, lugWidth, lugDepth, lugHeight) {
        const tireGroup = new THREE.Group();
        
        // Main Torus
        const tireGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);

        // Lugs
        const lugGeo = new THREE.BoxGeometry(lugWidth, lugDepth, lugHeight);
        
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            
            // Left row
            const lugLeft = new THREE.Mesh(lugGeo, rubber);
            lugLeft.position.set(
                (radius + tube * 0.9) * Math.cos(angle),
                (radius + tube * 0.9) * Math.sin(angle),
                -tube * 0.4
            );
            lugLeft.rotation.z = angle;
            lugLeft.rotation.x = Math.PI / 8; // slanted
            tireGroup.add(lugLeft);

            // Right row
            const lugRight = new THREE.Mesh(lugGeo, rubber);
            lugRight.position.set(
                (radius + tube * 0.9) * Math.cos(angle + 0.05),
                (radius + tube * 0.9) * Math.sin(angle + 0.05),
                tube * 0.4
            );
            lugRight.rotation.z = angle + 0.05;
            lugRight.rotation.x = -Math.PI / 8;
            tireGroup.add(lugRight);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(radius - tube * 0.8, radius - tube * 0.8, tube * 2.2, 32);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);

        // Complex Spokes
        const spokeCount = 12;
        const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, (radius - tube) * 2, 8);
        for(let j=0; j < spokeCount; j++) {
            const spokeAngle = (j / spokeCount) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = spokeAngle;
            tireGroup.add(spoke);
        }
        
        // Hub
        const hubGeo = new THREE.CylinderGeometry(2, 2, tube * 2.6, 16);
        const hubMesh = new THREE.Mesh(hubGeo, steel);
        hubMesh.rotation.x = Math.PI / 2;
        tireGroup.add(hubMesh);

        return tireGroup;
    }

    function createFractalCasimirArrays(levels, size, groupRef, offsetX, offsetY, offsetZ) {
        if (levels === 0) return;
        
        const plateGeo = new THREE.BoxGeometry(size, size * 0.05, size);
        const plateMesh1 = new THREE.Mesh(plateGeo, casimirPlateMat);
        plateMesh1.position.set(offsetX, offsetY + size*0.1, offsetZ);
        groupRef.add(plateMesh1);

        const plateMesh2 = new THREE.Mesh(plateGeo, casimirPlateMat);
        plateMesh2.position.set(offsetX, offsetY - size*0.1, offsetZ);
        groupRef.add(plateMesh2);

        // Recursive fractal details
        const nextSize = size * 0.4;
        const dist = size * 0.6;
        
        createFractalCasimirArrays(levels - 1, nextSize, groupRef, offsetX + dist, offsetY, offsetZ + dist);
        createFractalCasimirArrays(levels - 1, nextSize, groupRef, offsetX - dist, offsetY, offsetZ + dist);
        createFractalCasimirArrays(levels - 1, nextSize, groupRef, offsetX + dist, offsetY, offsetZ - dist);
        createFractalCasimirArrays(levels - 1, nextSize, groupRef, offsetX - dist, offsetY, offsetZ - dist);
    }

    function buildLatheChamber() {
        const points = [];
        for ( let i = 0; i <= 20; i ++ ) {
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 15 + 5, ( i - 10 ) * 3 ) );
        }
        const geometry = new THREE.LatheGeometry( points, 64 );
        const mesh = new THREE.Mesh( geometry, darkSteel );
        return mesh;
    }

    // ==========================================
    // MACHINE ASSEMBLY
    // ==========================================

    // 1. Massive Base Platform
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(80, 5, 120);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);

    // Hazard stripes for base
    const stripeGeo = new THREE.BoxGeometry(81, 1, 1);
    for(let i=-50; i<=50; i+=10) {
        const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshStandardMaterial({color: 0xffff00}));
        stripe.position.set(0, 2.6, i);
        baseGroup.add(stripe);
    }

    group.add(baseGroup);

    parts.push({
        name: "Zero-Point Containment Foundation",
        description: "A super-massive foundation built with collapsed star alloy (darkSteel) to resist the infinite pressure of the quantum vacuum flux. Features hazard dampening strips.",
        material: "darkSteel",
        function: "Structural anchor for the multi-dimensional extraction process.",
        assemblyOrder: 1,
        connections: ["Locomotion System", "Quantum Vacuum Chamber", "Power Extraction Grid"],
        failureEffect: "Structural collapse leading to immediate micro-singularity formation.",
        cascadeFailures: ["Quantum Vacuum Chamber", "Casimir Fractal Towers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // 2. Heavy Crawler Tires
    const locomotionGroup = new THREE.Group();
    const wheelPositions = [
        [-45, 0, -40], [45, 0, -40],
        [-45, 0, 0],   [45, 0, 0],
        [-45, 0, 40],  [45, 0, 40]
    ];
    const wheels = [];

    wheelPositions.forEach((pos, idx) => {
        const wheel = createTireWithLugs(8, 3, 32, 64, 40, 2, 4, 1.5);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.y = Math.PI / 2;
        locomotionGroup.add(wheel);
        wheels.push(wheel);
    });

    locomotionGroup.position.y = -5;
    group.add(locomotionGroup);

    updatables.push((t, speed) => {
        wheels.forEach(w => {
            w.rotation.z -= speed * 0.02; // Rotate tires
        });
    });

    parts.push({
        name: "God-Tier Crawler Locomotion Array",
        description: "Six massive aggressive off-road tires with hundreds of extruded lugs to mobilize the multi-ton extraction platform. Ensures stability during localized seismic distortions caused by vacuum tunneling.",
        material: "rubber, chrome, steel",
        function: "Mobility and ground-level vibration dampening.",
        assemblyOrder: 2,
        connections: ["Zero-Point Containment Foundation"],
        failureEffect: "Immobilization and fatal resonance buildup in the chassis.",
        cascadeFailures: ["Zero-Point Containment Foundation"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -80, z: 0 }
    });


    // 3. Main Vacuum Lathe Chamber
    const chamber = buildLatheChamber();
    chamber.position.y = 35;
    group.add(chamber);

    parts.push({
        name: "Hyper-Dimensional Lathe Chamber",
        description: "A mathematically perfect containment vessel generated via rotational extrusion of non-Euclidean coordinates. Shields the outside world from zero-point energy fluctuations.",
        material: "darkSteel",
        function: "Primary containment of the vacuum singularity.",
        assemblyOrder: 3,
        connections: ["Zero-Point Containment Foundation", "Quantum Singularity Core"],
        failureEffect: "Catastrophic unravelling of local spacetime fabric.",
        cascadeFailures: ["Quantum Singularity Core", "Virtual Particle Field", "Electromagnetic Arrestors"],
        originalPosition: { x: 0, y: 35, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // 4. Quantum Singularity Core
    const coreGeo = new THREE.TorusKnotGeometry(12, 3, 200, 32, 5, 7);
    const coreMesh = new THREE.Mesh(coreGeo, quantumCoreMat);
    coreMesh.position.y = 35;
    group.add(coreMesh);

    const singularityGeo = new THREE.IcosahedronGeometry(8, 2);
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    singularityMesh.position.y = 35;
    group.add(singularityMesh);

    updatables.push((t, speed) => {
        coreMesh.rotation.x = t * 0.01;
        coreMesh.rotation.y = t * 0.015;
        singularityMesh.rotation.z = -t * 0.05;
        singularityMesh.scale.setScalar(1 + Math.sin(t * 0.1) * 0.05);
        singularityMat.emissiveIntensity = 5.0 + Math.sin(t * 0.2) * 3.0;
    });

    parts.push({
        name: "Quantum Singularity Core",
        description: "A continuously folded TorusKnot housing an Icosahedron-bound singularity. Emits intense glowing radiation as it extracts zero-point energy from the vacuum.",
        material: "quantumCoreMat, singularityMat",
        function: "Directly bridges normal space and the infinite vacuum energy field.",
        assemblyOrder: 4,
        connections: ["Hyper-Dimensional Lathe Chamber", "Casimir Fractal Towers"],
        failureEffect: "Total annihilation of the machine and the surrounding 10 square kilometers.",
        cascadeFailures: ["EVERYTHING"],
        originalPosition: { x: 0, y: 35, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 100 }
    });

    // 5. Casimir Fractal Towers
    const casimirGroup = new THREE.Group();
    const towerPositions = [
        [30, 35, 30], [-30, 35, 30], [30, 35, -30], [-30, 35, -30],
        [45, 35, 0], [-45, 35, 0], [0, 35, 50], [0, 35, -50]
    ];

    towerPositions.forEach(pos => {
        const tower = new THREE.Group();
        createFractalCasimirArrays(3, 10, tower, 0, 0, 0); // recursive generation
        tower.position.set(pos[0], pos[1], pos[2]);
        casimirGroup.add(tower);
    });
    group.add(casimirGroup);

    updatables.push((t, speed) => {
        // Towers slightly vibrate and oscillate to maintain resonance
        casimirGroup.children.forEach((tower, i) => {
            tower.position.y = towerPositions[i][1] + Math.sin(t * 0.1 + i) * 1.5;
            tower.rotation.y = Math.sin(t * 0.05 + i) * 0.1;
        });
    });

    parts.push({
        name: "Casimir Fractal Towers",
        description: "Eight massive towers containing recursive fractal arrays of nanoscale Casimir plates. They manipulate the boundaries of the vacuum to create infinite negative pressure zones, forcing energy out.",
        material: "aluminum",
        function: "Energy extraction via macroscopic Casimir effect.",
        assemblyOrder: 5,
        connections: ["Zero-Point Containment Foundation", "Plasma Conduits"],
        failureEffect: "Loss of negative pressure, halting energy extraction.",
        cascadeFailures: ["Plasma Conduits", "Power Extraction Grid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 120, z: -100 }
    });

    // 6. Plasma Conduits
    const conduitGroup = new THREE.Group();
    class CustomConduitCurve extends THREE.Curve {
        constructor(scale = 1, phase = 0) {
            super();
            this.scale = scale;
            this.phase = phase;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(2 * Math.PI * t + this.phase) * 20 * this.scale;
            const ty = 35 + Math.sin(4 * Math.PI * t) * 15;
            const tz = Math.sin(2 * Math.PI * t + this.phase) * 20 * this.scale;
            return optionalTarget.set(tx, ty, tz);
        }
    }

    const conduitMeshes = [];
    for(let i=0; i<12; i++) {
        const path = new CustomConduitCurve(1 + (i%3)*0.5, (i/12)*Math.PI*2);
        const tubeGeo = new THREE.TubeGeometry(path, 64, 1.5, 8, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, plasmaConduitMat);
        conduitGroup.add(tubeMesh);
        conduitMeshes.push({mesh: tubeMesh, path: path});
    }
    group.add(conduitGroup);

    updatables.push((t, speed) => {
        // Pulse conduit thickness/opacity
        conduitMeshes.forEach((c, idx) => {
            const scalePulse = 1.0 + Math.sin(t * 0.2 + idx) * 0.2;
            c.mesh.scale.set(scalePulse, 1, scalePulse);
        });
        plasmaConduitMat.emissiveIntensity = 1.5 + Math.sin(t * 0.3) * 1.0;
    });

    parts.push({
        name: "Helical Plasma Conduits",
        description: "A 12-strand intertwining network of hyper-conductive tubes. They carry the raw, untamed vacuum plasma from the Casimir Towers to the Extraction Grid.",
        material: "plasmaConduitMat",
        function: "Energy transport.",
        assemblyOrder: 6,
        connections: ["Casimir Fractal Towers", "Power Extraction Grid", "Quantum Singularity Core"],
        failureEffect: "Plasma leakage, resulting in spontaneous localized matter generation.",
        cascadeFailures: ["Virtual Particle Field", "Electromagnetic Arrestors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 150, y: 0, z: 0 }
    });

    // 7. Virtual Particle Field (Points)
    const particleCount = 20000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleLifetimes = new Float32Array(particleCount);

    for(let i=0; i<particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 100;
        particlePositions[i*3+1] = 35 + (Math.random() - 0.5) * 80;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 100;

        particleColors[i*3] = Math.random();
        particleColors[i*3+1] = 0.5 + Math.random() * 0.5;
        particleColors[i*3+2] = 1.0;

        particleLifetimes[i] = Math.random() * 100;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute('lifetime', new THREE.BufferAttribute(particleLifetimes, 1));

    const particleMat = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    updatables.push((t, speed) => {
        const positions = particleGeo.attributes.position.array;
        const lifetimes = particleGeo.attributes.lifetime.array;
        
        for(let i=0; i<particleCount; i++) {
            lifetimes[i] -= speed * 0.5;
            
            // Particles constantly drift towards the singularity core
            const px = positions[i*3];
            const py = positions[i*3+1] - 35;
            const pz = positions[i*3+2];
            
            positions[i*3] -= px * 0.01 * speed;
            positions[i*3+1] -= py * 0.01 * speed;
            positions[i*3+2] -= pz * 0.01 * speed;

            // If lifetime ends, they "pop" back out of the vacuum at random locations
            if(lifetimes[i] < 0) {
                positions[i*3] = (Math.random() - 0.5) * 120;
                positions[i*3+1] = 35 + (Math.random() - 0.5) * 100;
                positions[i*3+2] = (Math.random() - 0.5) * 120;
                lifetimes[i] = 50 + Math.random() * 50;
            }
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleSystem.rotation.y = t * 0.005;
    });

    parts.push({
        name: "Virtual Particle Field System",
        description: "A dense cloud of transient particle-antiparticle pairs constantly popping in and out of existence, visually representing the quantum fluctuations being harvested.",
        material: "PointsMaterial(Additive)",
        function: "Byproduct of extreme vacuum stress; provides visual feedback of extraction rate.",
        assemblyOrder: 7,
        connections: ["Quantum Singularity Core"],
        failureEffect: "Field collapse implies core stabilization (failure to extract energy).",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 8. Electromagnetic Arrestors (Arcing Lines)
    const arcingGroup = new THREE.Group();
    const arcCount = 30;
    const arcGeo = new THREE.BufferGeometry();
    const arcPositions = new Float32Array(arcCount * 2 * 3); // Pairs of vertices for lines
    arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPositions, 3));
    const arcMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const arcLines = new THREE.LineSegments(arcGeo, arcMat);
    arcingGroup.add(arcLines);
    group.add(arcingGroup);

    updatables.push((t, speed) => {
        const pos = arcGeo.attributes.position.array;
        for(let i=0; i<arcCount; i++) {
            // Origin at core
            pos[i*6] = (Math.random() - 0.5) * 10;
            pos[i*6+1] = 35 + (Math.random() - 0.5) * 10;
            pos[i*6+2] = (Math.random() - 0.5) * 10;
            
            // Destination at random Casimir tower
            const towerPos = towerPositions[Math.floor(Math.random() * towerPositions.length)];
            pos[i*6+3] = towerPos[0] + (Math.random() - 0.5) * 10;
            pos[i*6+4] = towerPos[1] + (Math.random() - 0.5) * 20;
            pos[i*6+5] = towerPos[2] + (Math.random() - 0.5) * 10;
        }
        arcGeo.attributes.position.needsUpdate = true;
        arcMat.opacity = 0.5 + Math.random() * 0.5; // Flicker
        arcMat.color.setHSL(Math.random() * 0.1 + 0.5, 1.0, 0.8); // Jitter blue/cyan color
    });

    parts.push({
        name: "Electromagnetic Arrestors",
        description: "Intense, highly animated electrical arcs that bleed off dangerous static charge built up from quantum shearing between the core and towers.",
        material: "LineBasicMaterial (Flickering)",
        function: "Safety discharge and containment field grounding.",
        assemblyOrder: 8,
        connections: ["Quantum Singularity Core", "Casimir Fractal Towers"],
        failureEffect: "Uncontrolled electrical storms destroying all local electronics.",
        cascadeFailures: ["Operator Control Cabin", "Hydraulic Stabilization Pistons"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: 50, z: 0 }
    });

    // 9. Power Extraction Grid
    const extractionGrid = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(30, 2, 16, 100);
    for(let i=0; i<5; i++) {
        const coil = new THREE.Mesh(coilGeo, energyGridMat);
        coil.position.y = 15 + i * 10;
        coil.rotation.x = Math.PI / 2;
        extractionGrid.add(coil);
    }
    
    // Vertical collectors
    const collectorGeo = new THREE.CylinderGeometry(1.5, 1.5, 50, 16);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const col = new THREE.Mesh(collectorGeo, copper);
        col.position.set(Math.cos(angle)*30, 35, Math.sin(angle)*30);
        extractionGrid.add(col);
    }
    group.add(extractionGrid);

    updatables.push((t, speed) => {
        extractionGrid.rotation.y = -t * 0.005;
        energyGridMat.emissiveIntensity = 1.0 + Math.sin(t * 0.5) * 0.5;
    });

    parts.push({
        name: "Macro-Power Extraction Grid",
        description: "A massive assembly of highly conductive copper and energyGrid alloy coils. Funnels the extracted zero-point energy into a usable macroscopic power format.",
        material: "copper, energyGridMat",
        function: "Energy conversion and output.",
        assemblyOrder: 9,
        connections: ["Zero-Point Containment Foundation", "Plasma Conduits"],
        failureEffect: "Energy bottleneck leading to explosive backflow.",
        cascadeFailures: ["Plasma Conduits"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -150 }
    });

    // 10. Cooling Fins Array
    const coolingGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(4, 20, 0.5);
    for(let i=0; i<72; i++) {
        const angle = (i/72) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(Math.cos(angle)*35, 35, Math.sin(angle)*35);
        fin.rotation.y = -angle;
        coolingGroup.add(fin);
    }
    group.add(coolingGroup);

    parts.push({
        name: "Hyper-Thermal Dissipation Fins",
        description: "72 massive aluminum fins encircling the core chamber. Dissipates the immense thermal waste generated by violating the laws of thermodynamics.",
        material: "aluminum",
        function: "Thermal regulation.",
        assemblyOrder: 10,
        connections: ["Hyper-Dimensional Lathe Chamber"],
        failureEffect: "Core meltdown.",
        cascadeFailures: ["Hyper-Dimensional Lathe Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 150 }
    });

    // 11. Hydraulic Stabilization Pistons
    const pistonGroup = new THREE.Group();
    const pistonBaseGeo = new THREE.CylinderGeometry(2, 2, 25, 16);
    const pistonRodGeo = new THREE.CylinderGeometry(1, 1, 30, 16);
    
    const pistons = [];
    for(let i=0; i<4; i++) {
        const pGroup = new THREE.Group();
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        
        pGroup.position.set(Math.cos(angle)*38, 15, Math.sin(angle)*38);
        
        // Tilt them inwards
        pGroup.lookAt(0, 35, 0);
        pGroup.rotateX(Math.PI / 2);

        const base = new THREE.Mesh(pistonBaseGeo, steel);
        base.position.y = -5;
        pGroup.add(base);

        const rod = new THREE.Mesh(pistonRodGeo, chrome);
        rod.position.y = 10;
        pGroup.add(rod);
        
        pistonGroup.add(pGroup);
        pistons.push({group: pGroup, rod: rod});
    }
    group.add(pistonGroup);

    updatables.push((t, speed) => {
        // High-tech vibrating piston logic
        pistons.forEach((p, idx) => {
            const extension = Math.sin(t * 0.4 + idx) * 2;
            p.rod.position.y = 10 + extension; // Rod goes up and down
        });
    });

    parts.push({
        name: "Hydraulic Stabilization Pistons",
        description: "Massive active-suspension pistons that connect the base to the core chamber, constantly adjusting to counter the violent vibrations of extracting infinite energy.",
        material: "steel, chrome",
        function: "Active structural stabilization.",
        assemblyOrder: 11,
        connections: ["Zero-Point Containment Foundation", "Hyper-Dimensional Lathe Chamber"],
        failureEffect: "Machine shakes itself apart within seconds.",
        cascadeFailures: ["Zero-Point Containment Foundation", "Hyper-Dimensional Lathe Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: -50, z: 100 }
    });

    // 12. Operator Control Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 15, 60);

    const cabinBodyGeo = new THREE.BoxGeometry(16, 12, 16);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, darkSteel);
    cabinGroup.add(cabinBody);

    // Front Window
    const windowGeo = new THREE.BoxGeometry(14, 8, 1);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 1, 8);
    cabinGroup.add(windowMesh);

    // Side Windows
    const sideWindowGeo = new THREE.BoxGeometry(1, 8, 10);
    const leftWindow = new THREE.Mesh(sideWindowGeo, tinted);
    leftWindow.position.set(-8, 1, 0);
    cabinGroup.add(leftWindow);
    const rightWindow = new THREE.Mesh(sideWindowGeo, tinted);
    rightWindow.position.set(8, 1, 0);
    cabinGroup.add(rightWindow);

    // Roof instruments
    const radarGeo = new THREE.CylinderGeometry(3, 3, 1, 16);
    const radar = new THREE.Mesh(radarGeo, plastic);
    radar.position.set(0, 6.5, 0);
    cabinGroup.add(radar);

    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
    const antenna = new THREE.Mesh(antennaGeo, chrome);
    antenna.position.set(6, 11, -5);
    cabinGroup.add(antenna);

    updatables.push((t, speed) => {
        radar.rotation.y = t * 0.05;
    });

    // Interior details (Visible through tinted glass)
    const seatGeo = new THREE.BoxGeometry(3, 4, 3);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0, -3, 2);
    cabinGroup.add(seat);

    const deskGeo = new THREE.BoxGeometry(12, 1, 4);
    const desk = new THREE.Mesh(deskGeo, plastic);
    desk.position.set(0, -1, 5);
    cabinGroup.add(desk);

    // Glowing screens
    const screenGeo = new THREE.BoxGeometry(3, 2, 0.2);
    const screenMat1 = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const screenMat2 = new THREE.MeshBasicMaterial({color: 0xff0000});
    const screenMat3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
    
    const sc1 = new THREE.Mesh(screenGeo, screenMat1);
    sc1.position.set(-3, 0.5, 6);
    sc1.rotation.x = -Math.PI / 8;
    cabinGroup.add(sc1);
    
    const sc2 = new THREE.Mesh(screenGeo, screenMat2);
    sc2.position.set(0, 0.5, 6);
    sc2.rotation.x = -Math.PI / 8;
    cabinGroup.add(sc2);
    
    const sc3 = new THREE.Mesh(screenGeo, screenMat3);
    sc3.position.set(3, 0.5, 6);
    sc3.rotation.x = -Math.PI / 8;
    cabinGroup.add(sc3);

    group.add(cabinGroup);

    parts.push({
        name: "Master Control Cabin",
        description: "A heavily shielded command center with tinted hyper-glass. Features extensive diagnostic screens, life support, and manual override joysticks for the quantum core.",
        material: "darkSteel, tinted glass, plastic",
        function: "Human interface and manual supervision of the extraction process.",
        assemblyOrder: 12,
        connections: ["Zero-Point Containment Foundation"],
        failureEffect: "Loss of manual control. Automated systems take over, significantly increasing risk of cascade failure.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 60 },
        explodedPosition: { x: 0, y: -20, z: 150 }
    });

    // 13. Safety Warning Beacons
    const beacons = [];
    const beaconGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    
    const bPos = [
        [-38, 5, -58], [38, 5, -58],
        [-38, 5, 58], [38, 5, 58],
        [0, 23, 60] // top of cabin
    ];

    bPos.forEach(p => {
        const b = new THREE.Mesh(beaconGeo, warningLightMat);
        b.position.set(p[0], p[1], p[2]);
        group.add(b);
        beacons.push(b);
    });

    updatables.push((t, speed) => {
        // Blinking logic
        const blink = (Math.sin(t * 0.5) > 0) ? 2.0 : 0.1;
        warningLightMat.emissiveIntensity = blink;
    });

    parts.push({
        name: "Hazard Warning Beacons",
        description: "High-intensity oscillating beacons that warn nearby personnel of extreme dimensional instability and lethal radiation fields.",
        material: "warningLightMat",
        function: "Visual safety warning.",
        assemblyOrder: 13,
        connections: ["Zero-Point Containment Foundation", "Master Control Cabin"],
        failureEffect: "Increased workplace accidents.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: -80, z: -80 }
    });

    // 14. Access Ladders and Walkways
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 30, 8);
    const rungGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    
    const leftRail = new THREE.Mesh(railGeo, steel);
    leftRail.position.set(-2, 15, 68);
    ladderGroup.add(leftRail);
    
    const rightRail = new THREE.Mesh(railGeo, steel);
    rightRail.position.set(2, 15, 68);
    ladderGroup.add(rightRail);

    for(let i=0; i<15; i++) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, 2 + i*2, 68);
        ladderGroup.add(rung);
    }
    group.add(ladderGroup);

    parts.push({
        name: "Maintenance Access Ladders",
        description: "Standard industrial steel ladders for engineers to access the control cabin and perform terrifyingly dangerous manual repairs on the core.",
        material: "steel",
        function: "Personnel access.",
        assemblyOrder: 14,
        connections: ["Zero-Point Containment Foundation", "Master Control Cabin"],
        failureEffect: "Inability to perform manual maintenance.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 120 }
    });

    // 15. Exhaust Stacks (For localized thermal venting)
    const exhaustGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(3, 4, 25, 16);
    const smokeGeo = new THREE.SphereGeometry(2, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({color: 0x333333, transparent: true, opacity: 0.5});
    const smokeParticles = [];

    const stackPositions = [ [-25, 20, -50], [25, 20, -50] ];
    stackPositions.forEach(p => {
        const stack = new THREE.Mesh(stackGeo, darkSteel);
        stack.position.set(p[0], p[1], p[2]);
        exhaustGroup.add(stack);

        // create smoke particle pool for this stack
        for(let j=0; j<10; j++) {
            const smoke = new THREE.Mesh(smokeGeo, smokeMat);
            smoke.position.set(p[0], p[1] + 12 + Math.random()*20, p[2]);
            smoke.userData = { baseY: p[1] + 12, speed: 0.5 + Math.random(), offset: Math.random()*10 };
            exhaustGroup.add(smoke);
            smokeParticles.push(smoke);
        }
    });
    group.add(exhaustGroup);

    updatables.push((t, speed) => {
        smokeParticles.forEach(smoke => {
            smoke.position.y += smoke.userData.speed * speed * 0.2;
            smoke.scale.setScalar(1 + (smoke.position.y - smoke.userData.baseY) * 0.05);
            smoke.material.opacity = Math.max(0, 0.5 - (smoke.position.y - smoke.userData.baseY) * 0.01);
            if(smoke.position.y > smoke.userData.baseY + 40) {
                smoke.position.y = smoke.userData.baseY;
                smoke.scale.setScalar(1);
                smoke.material.opacity = 0.5;
            }
        });
    });

    parts.push({
        name: "Hyper-Venting Exhaust Stacks",
        description: "Massive dark-steel chimneys that vent out superheated exotic matter particulates and standard industrial smog from the secondary generators.",
        material: "darkSteel",
        function: "Secondary waste venting.",
        assemblyOrder: 15,
        connections: ["Zero-Point Containment Foundation"],
        failureEffect: "Internal pressure build-up and localized explosive decompression.",
        cascadeFailures: ["Zero-Point Containment Foundation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: -150 }
    });

    // 16. The God-Tier Energy Reservoir (A massive glowing orb at the very bottom)
    const reservoirGeo = new THREE.SphereGeometry(15, 64, 64);
    const reservoirMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 3.0,
        wireframe: true
    });
    const reservoir = new THREE.Mesh(reservoirGeo, reservoirMat);
    reservoir.position.set(0, -15, 0);
    group.add(reservoir);

    updatables.push((t, speed) => {
        reservoir.rotation.y = t * 0.02;
        reservoir.rotation.z = t * 0.01;
        reservoir.scale.setScalar(1 + Math.sin(t * 0.3) * 0.1);
        reservoirMat.emissiveIntensity = 3.0 + Math.sin(t * 0.4) * 2.0;
    });

    parts.push({
        name: "God-Tier Energy Reservoir",
        description: "A gigantic, pulsating, wireframe-bound orb of pure stored zero-point energy located beneath the foundation. Represents the ultimate yield of the extractor.",
        material: "Emissive Wireframe",
        function: "Energy storage and buffering.",
        assemblyOrder: 16,
        connections: ["Zero-Point Containment Foundation", "Macro-Power Extraction Grid"],
        failureEffect: "Detonation equivalent to a small supernova.",
        cascadeFailures: ["EVERYTHING", "THE ENTIRE PLANET"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });


    // ==========================================
    // METADATA & QUIZ
    // ==========================================

    const description = "The God-Tier Zero-Point Vacuum Energy Extractor is the pinnacle of hyper-engineering. Utilizing macroscopic Casimir fractal towers, rotating non-Euclidean lathe containment fields, and a massive power grid, this crawler harvests infinite energy directly from the quantum fluctuations of empty space. It features extreme visual outputs including flashing virtual particle fields, massive electrical arcing, and violent hydraulic stabilization.";

    const quizQuestions = [
        {
            question: "In the context of the Casimir effect, how is the divergent zero-point energy of the vacuum mathematically regularized to yield a finite, observable force?",
            options: [
                "By invoking the Pauli Exclusion Principle.",
                "Using Riemann zeta function regularization or cut-off functions.",
                "By subtracting the gravitational constant.",
                "Through the application of the Schrödinger equation for a free particle."
            ],
            correctAnswer: 1,
            explanation: "Riemann zeta function regularization analytically continues the divergent sum of zero-point frequencies to a finite value, accurately predicting the Casimir force."
        },
        {
            question: "Which discrepancy is famously known as the 'Cosmological Constant Problem' when relating zero-point energy to general relativity?",
            options: [
                "The predicted vacuum energy density is ~120 orders of magnitude larger than the observed dark energy density.",
                "Vacuum energy cannot be represented as a tensor.",
                "Zero-point energy causes the universe to contract rather than expand.",
                "The Higgs field VEV cancels out all zero-point fluctuations perfectly."
            ],
            correctAnswer: 0,
            explanation: "Quantum field theory predicts a vacuum energy density so astronomically high that it exceeds the observed cosmological constant by about 120 orders of magnitude, posing one of the greatest unsolved problems in physics."
        },
        {
            question: "According to the Unruh effect, what will an accelerating observer perceive while passing through the quantum vacuum?",
            options: [
                "A complete absence of particles.",
                "A thermal bath of particles (Unruh radiation) with temperature proportional to their acceleration.",
                "Time dilation causing the vacuum to solidify.",
                "Spontaneous symmetry breaking of the strong force."
            ],
            correctAnswer: 1,
            explanation: "The Unruh effect predicts that an accelerating observer will see the vacuum as a warm gas of particles, due to the frame-dependent nature of the particle concept in QFT."
        },
        {
            question: "What does the Schwinger limit describe in relation to the quantum vacuum?",
            options: [
                "The maximum speed limit of virtual particles.",
                "The critical electric field strength required to cause the vacuum to 'boil' and spontaneously produce electron-positron pairs.",
                "The lower bound of the Heisenberg Uncertainty Principle.",
                "The point at which Casimir plates fuse together."
            ],
            correctAnswer: 1,
            explanation: "The Schwinger limit is the critical electric field (~1.3×10^18 V/m) where the vacuum becomes unstable and decays into electron-positron pairs."
        },
        {
            question: "How does the Higgs mechanism contribute to the vacuum energy of the universe?",
            options: [
                "It absorbs all vacuum energy to give particles mass.",
                "Its non-zero Vacuum Expectation Value (VEV) gives a massive negative or positive contribution to the total vacuum energy density.",
                "It generates Casimir forces between uncharged plates.",
                "It restricts virtual particles from violating conservation of energy."
            ],
            correctAnswer: 1,
            explanation: "The Higgs field has a non-zero VEV at its minimum potential, which directly contributes a massive baseline energy density to the quantum vacuum."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        timeRef.value += speed;
        const t = timeRef.value;
        
        // Execute all registered animation callbacks
        updatables.forEach(fn => fn(t, speed));

        // Intense overall machine vibration (high frequency, small amplitude)
        // We apply it to the main group, but carefully to not cause drifting.
        const shakeAmplitude = 0.1 * speed;
        group.position.x = Math.sin(t * 10) * shakeAmplitude;
        group.position.z = Math.cos(t * 12) * shakeAmplitude;
    }

    return { group, parts, description, quizQuestions, animate };
}
