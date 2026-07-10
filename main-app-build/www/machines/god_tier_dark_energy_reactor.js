import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM ULTRA-HIGH-TECH MATERIALS
    // ==========================================
    const darkEnergyGlow = new THREE.MeshStandardMaterial({
        color: 0x050011,
        emissive: 0x9900ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
        roughness: 0.0,
        metalness: 1.0,
        side: THREE.DoubleSide
    });

    const voidCoreGlow = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x000000,
        roughness: 1.0,
        metalness: 0.0
    });

    const cyanNeon = new THREE.MeshStandardMaterial({
        color: 0x001111,
        emissive: 0x00ffff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.9
    });

    const hyperChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 1.0,
        envMapIntensity: 2.0
    });
    
    const exoticMatterMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0022,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const scorchedSteel = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.8
    });

    // ==========================================
    // ADVANCED GEOMETRY GENERATORS
    // ==========================================

    function createExtrudedGear(teeth, radius, innerRadius, depth, holeRadius) {
        const shape = new THREE.Shape();
        const angleStep = (Math.PI * 2) / (teeth * 2);
        for (let i = 0; i < teeth * 2; i++) {
            const r = i % 2 === 0 ? radius : innerRadius;
            const a = i * angleStep;
            if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        shape.closePath();
        
        if (holeRadius > 0) {
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.2,
            bevelThickness: 0.2
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createLatheProfile(pointsCount, radius, height, frequency, amplitude) {
        const points = [];
        for (let i = 0; i <= pointsCount; i++) {
            const v = i / pointsCount;
            const r = radius + Math.sin(v * Math.PI * frequency) * amplitude;
            const y = (v - 0.5) * height;
            points.push(new THREE.Vector2(r, y));
        }
        return new THREE.LatheGeometry(points, 64);
    }

    function createComplexPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Cylinder main body
        const bodyGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const body = new THREE.Mesh(bodyGeo, darkSteel);
        body.position.y = (length * 0.6) / 2;
        pistonGroup.add(body);

        // Inner rod
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length / 2;
        pistonGroup.add(rod);

        // Mounts
        const mountGeo = new THREE.BoxGeometry(radius * 3, radius * 0.5, radius * 3);
        const mountBottom = new THREE.Mesh(mountGeo, steel);
        mountBottom.position.y = 0;
        pistonGroup.add(mountBottom);

        const mountTop = new THREE.Mesh(mountGeo, steel);
        mountTop.position.y = length;
        pistonGroup.add(mountTop);

        // Hydraulic lines on the piston
        for(let i=0; i<4; i++) {
            const lineGeo = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3([
                    new THREE.Vector3(radius * 1.1, length * 0.1, 0),
                    new THREE.Vector3(radius * 1.5, length * 0.3, 0),
                    new THREE.Vector3(radius * 1.1, length * 0.5, 0)
                ]),
                20, radius * 0.1, 8, false
            );
            const line = new THREE.Mesh(lineGeo, copper);
            line.rotation.y = (Math.PI / 2) * i;
            pistonGroup.add(line);
        }

        return { group: pistonGroup, rod, mountTop };
    }

    function createTrussBeam(length, width, depth) {
        const trussGroup = new THREE.Group();
        
        // Main beams
        const beamGeo = new THREE.CylinderGeometry(width*0.1, width*0.1, length, 16);
        const positions = [
            [-width/2, -depth/2], [width/2, -depth/2],
            [-width/2, depth/2], [width/2, depth/2]
        ];
        
        positions.forEach(pos => {
            const b = new THREE.Mesh(beamGeo, steel);
            b.position.set(pos[0], 0, pos[1]);
            trussGroup.add(b);
        });

        // Cross braces
        const crossCount = Math.floor(length / width);
        const crossGeo = new THREE.CylinderGeometry(width*0.05, width*0.05, Math.sqrt(width*width + width*width), 8);
        for(let i=0; i<crossCount; i++) {
            const yPos = -length/2 + (i + 0.5) * width;
            
            // X-braces front and back
            const brace1 = new THREE.Mesh(crossGeo, aluminum);
            brace1.position.set(0, yPos, depth/2);
            brace1.rotation.z = Math.PI / 4;
            trussGroup.add(brace1);

            const brace2 = new THREE.Mesh(crossGeo, aluminum);
            brace2.position.set(0, yPos, depth/2);
            brace2.rotation.z = -Math.PI / 4;
            trussGroup.add(brace2);

            const brace3 = new THREE.Mesh(crossGeo, aluminum);
            brace3.position.set(0, yPos, -depth/2);
            brace3.rotation.z = Math.PI / 4;
            trussGroup.add(brace3);

            const brace4 = new THREE.Mesh(crossGeo, aluminum);
            brace4.position.set(0, yPos, -depth/2);
            brace4.rotation.z = -Math.PI / 4;
            trussGroup.add(brace4);
        }

        return trussGroup;
    }

    // ==========================================
    // 1. MAIN BASE PLATFORM (Base_Chassis)
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Core foundational slab
    const slabGeo = new THREE.CylinderGeometry(60, 65, 5, 64);
    const slab = new THREE.Mesh(slabGeo, darkSteel);
    slab.position.y = -2.5;
    baseGroup.add(slab);

    // Intricate interlocking base gears
    const mainGearGeo = createExtrudedGear(36, 58, 54, 2, 40);
    const mainGear = new THREE.Mesh(mainGearGeo, steel);
    mainGear.rotation.x = Math.PI / 2;
    mainGear.position.y = 0;
    baseGroup.add(mainGear);

    const secondaryGearGeo = createExtrudedGear(18, 20, 16, 2, 10);
    meshes.secondaryGears = [];
    for(let i=0; i<6; i++) {
        const g = new THREE.Mesh(secondaryGearGeo, chrome);
        g.rotation.x = Math.PI / 2;
        const angle = (Math.PI * 2 / 6) * i;
        g.position.set(Math.cos(angle) * 75, 0, Math.sin(angle) * 75);
        meshes.secondaryGears.push({ mesh: g, angle: angle });
        baseGroup.add(g);
        
        // Add connecting shafts
        const shaftGeo = new THREE.CylinderGeometry(2, 2, 18, 32);
        const shaft = new THREE.Mesh(shaftGeo, copper);
        shaft.rotation.x = Math.PI / 2;
        shaft.rotation.z = angle;
        shaft.position.set(Math.cos(angle) * 66, 0, Math.sin(angle) * 66);
        baseGroup.add(shaft);
    }

    // Platform grating
    const gratingGeo = new THREE.RingGeometry(40, 58, 64, 8);
    const grating = new THREE.Mesh(gratingGeo, new THREE.MeshStandardMaterial({
        color: 0x333333, wireframe: true, roughness: 0.8, metalness: 0.5
    }));
    grating.rotation.x = -Math.PI / 2;
    grating.position.y = 0.1;
    baseGroup.add(grating);

    group.add(baseGroup);

    parts.push({
        name: 'Base_Chassis',
        description: 'Ultra-dense neutronium alloy base plate designed to anchor the repulsive forces of the reactor to the planetary crust.',
        material: 'Dark Steel / Neutronium',
        function: 'Structural grounding and primary kinetic distribution.',
        assemblyOrder: 1,
        connections: ['Planetary Crust', 'Spacetime_Tension_Rings', 'Hydraulic_Repulsion_Dampers'],
        failureEffect: 'Catastrophic unmooring; reactor will launch itself into the stratosphere.',
        cascadeFailures: ['Complete structural disintegration', 'Local gravity inversion'],
        originalPosition: {x: 0, y: -2.5, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    // ==========================================
    // 2. SINGULARITY CONTAINMENT VESSEL (Core)
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 40;
    
    // The Void Singularity
    const singularityGeo = new THREE.IcosahedronGeometry(8, 4);
    const singularity = new THREE.Mesh(singularityGeo, voidCoreGlow);
    coreGroup.add(singularity);
    meshes.singularity = singularity;

    // Exotic Energy Shell (Inner)
    const innerShellGeo = new THREE.IcosahedronGeometry(10, 3);
    const innerShell = new THREE.Mesh(innerShellGeo, exoticMatterMat);
    coreGroup.add(innerShell);
    meshes.innerShell = innerShell;

    // Dark Energy Glow Aura
    const glowGeo = new THREE.IcosahedronGeometry(12, 5);
    const glowAura = new THREE.Mesh(glowGeo, darkEnergyGlow);
    coreGroup.add(glowAura);
    meshes.glowAura = glowAura;

    // Containment Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(14, 2);
    const lattice = new THREE.Mesh(latticeGeo, new THREE.MeshStandardMaterial({
        color: 0x222222, wireframe: true, wireframeLinewidth: 3, metalness: 1.0
    }));
    coreGroup.add(lattice);
    meshes.lattice = lattice;

    // Confinement spikes
    const spikeGeo = new THREE.CylinderGeometry(0, 0.5, 6, 16);
    spikeGeo.translate(0, 3, 0);
    const spikePos = latticeGeo.attributes.position;
    for(let i=0; i<spikePos.count; i+=3) {
        const v = new THREE.Vector3().fromBufferAttribute(spikePos, i);
        v.normalize();
        const spike = new THREE.Mesh(spikeGeo, chrome);
        spike.position.copy(v.clone().multiplyScalar(14));
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        coreGroup.add(spike);
    }

    group.add(coreGroup);

    parts.push({
        name: 'Singularity_Containment_Vessel',
        description: 'Multi-layered icosahedral lattice confining a localized pocket of artificial vacuum energy (quintessence).',
        material: 'Exotic Matter / Chrome Lattice',
        function: 'Prevents the expanding pocket of dark energy from shredding local spacetime.',
        assemblyOrder: 10,
        connections: ['Dark_Matter_Ballast', 'Tachyon_Feedback_Loop'],
        failureEffect: 'Spontaneous localized Big Rip scenario.',
        cascadeFailures: ['Atomic dissociation', 'Time dilation runaway'],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // ==========================================
    // 3. SPACETIME TENSION RINGS (X, Y, Z)
    // ==========================================
    const ringsGroup = new THREE.Group();
    ringsGroup.position.y = 40;
    meshes.tensionRings = [];

    const ringRadii = [25, 32, 39];
    const ringAxes = [
        new THREE.Vector3(1,0,0),
        new THREE.Vector3(0,1,0),
        new THREE.Vector3(0,0,1)
    ];

    for(let r=0; r<3; r++) {
        const singleRingGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(ringRadii[r], 1.5, 32, 100);
        const torus = new THREE.Mesh(torusGeo, scorchedSteel);
        singleRingGroup.add(torus);

        // Magnetic accelerator tracks
        const trackGeo = new THREE.TorusGeometry(ringRadii[r], 1.7, 8, 100);
        const track = new THREE.Mesh(trackGeo, new THREE.MeshStandardMaterial({
            color: 0x111111, wireframe: true
        }));
        singleRingGroup.add(track);

        // Energy nodes around the ring
        const nodeGeo = new THREE.BoxGeometry(4, 4, 4);
        const nodeCount = 12;
        for(let n=0; n<nodeCount; n++) {
            const angle = (Math.PI * 2 / nodeCount) * n;
            const node = new THREE.Mesh(nodeGeo, chrome);
            node.position.set(Math.cos(angle) * ringRadii[r], Math.sin(angle) * ringRadii[r], 0);
            node.rotation.z = angle;
            
            // Neon strips on nodes
            const stripGeo = new THREE.BoxGeometry(4.2, 1, 1);
            const strip = new THREE.Mesh(stripGeo, cyanNeon);
            node.add(strip);

            singleRingGroup.add(node);
        }

        // Rotate ring to its primary axis
        if(r === 0) singleRingGroup.rotation.y = Math.PI / 2;
        if(r === 1) singleRingGroup.rotation.x = Math.PI / 2;

        ringsGroup.add(singleRingGroup);
        meshes.tensionRings.push({ mesh: singleRingGroup, axis: ringAxes[r], speedMult: (r+1)*0.2 });

        parts.push({
            name: `Spacetime_Tension_Ring_${['X','Y','Z'][r]}`,
            description: `Superconducting toroidal array maintaining the gravitational sheer-tensor along the ${['X','Y','Z'][r]}-axis.`,
            material: 'Scorched Steel / Superconductors',
            function: 'Counteracts the repulsive dark energy force through extreme electromagnetic torsion.',
            assemblyOrder: 5 + r,
            connections: ['Core', 'Hydraulic_Repulsion_Dampers'],
            failureEffect: 'Dimensional shear causing spatial tearing.',
            cascadeFailures: ['Vessel rupture', 'Gravity inversion'],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {
                x: r === 0 ? 100 : 0, 
                y: 40 + (r === 1 ? 100 : 0), 
                z: r === 2 ? 100 : 0
            }
        });
    }
    group.add(ringsGroup);

    // ==========================================
    // 4. HYDRAULIC REPULSION DAMPERS
    // ==========================================
    meshes.dampers = [];
    const damperGroup = new THREE.Group();
    
    // Dampers anchoring from base to the rings/core area
    const damperCount = 16;
    for(let i=0; i<damperCount; i++) {
        const angle = (Math.PI * 2 / damperCount) * i;
        const radiusOut = 45;
        const radiusIn = 15;
        const heightStart = 0;
        const heightEnd = 30;
        
        const length = Math.sqrt(Math.pow(radiusOut - radiusIn, 2) + Math.pow(heightEnd - heightStart, 2));
        const pistonObj = createComplexPiston(length, 2.5);
        
        const pGroup = pistonObj.group;
        pGroup.position.set(Math.cos(angle) * radiusOut, heightStart, Math.sin(angle) * radiusOut);
        
        // Look at core
        const target = new THREE.Vector3(Math.cos(angle) * radiusIn, heightEnd, Math.sin(angle) * radiusIn);
        pGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), target.clone().sub(pGroup.position).normalize());
        
        damperGroup.add(pGroup);
        meshes.dampers.push({
            rod: pistonObj.rod,
            mountTop: pistonObj.mountTop,
            baseLength: length,
            phaseOffset: i * 0.5
        });
    }
    group.add(damperGroup);

    parts.push({
        name: 'Hydraulic_Repulsion_Damper_Array',
        description: 'Sixteen massive shock absorbers filled with ultra-dense non-Newtonian fluid.',
        material: 'Dark Steel / Chrome rods / Copper lines',
        function: 'Absorbs the violent outward repulsive forces generated by the phantom energy state.',
        assemblyOrder: 4,
        connections: ['Base_Chassis', 'Spacetime_Tension_Rings'],
        failureEffect: 'Rings will snap off their mounts instantly.',
        cascadeFailures: ['Containment collapse'],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 15, z: 120}
    });

    // ==========================================
    // 5. QUINTESSENCE MODERATOR TOWERS (Siphons)
    // ==========================================
    meshes.towers = [];
    for(let t=0; t<4; t++) {
        const towerGroup = new THREE.Group();
        const angle = (Math.PI * 2 / 4) * t + Math.PI/4; // Corners
        const tDist = 65;
        towerGroup.position.set(Math.cos(angle) * tDist, 0, Math.sin(angle) * tDist);
        
        // Tower Base
        const tBaseGeo = new THREE.CylinderGeometry(12, 16, 10, 8);
        const tBase = new THREE.Mesh(tBaseGeo, steel);
        tBase.position.y = 5;
        towerGroup.add(tBase);

        // Tower Shaft (Lathe)
        const tShaftGeo = createLatheProfile(32, 6, 60, 10, 2);
        const tShaft = new THREE.Mesh(tShaftGeo, chrome);
        tShaft.position.y = 40;
        towerGroup.add(tShaft);

        // Cooling Fins array
        for(let f=0; f<10; f++) {
            const finGeo = new THREE.TorusGeometry(8, 0.5, 16, 64);
            const fin = new THREE.Mesh(finGeo, copper);
            fin.rotation.x = Math.PI / 2;
            fin.position.y = 20 + f * 4;
            towerGroup.add(fin);
        }

        // Energy Dome
        const domeGeo = new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, glass);
        dome.position.y = 70;
        towerGroup.add(dome);

        // Inner glowing coil
        const coilGeo = new THREE.TorusKnotGeometry(4, 1, 100, 16);
        const coil = new THREE.Mesh(coilGeo, darkEnergyGlow);
        coil.position.y = 70;
        towerGroup.add(coil);
        meshes.towers.push({ coil: coil, phase: t });

        // Tethers connecting to core
        const tetherCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 70, 0),
            new THREE.Vector3(-Math.cos(angle)*30, 80, -Math.sin(angle)*30),
            new THREE.Vector3(-Math.cos(angle)*tDist, 40, -Math.sin(angle)*tDist) // relative to tower -> origin
        ]);
        const tetherGeo = new THREE.TubeGeometry(tetherCurve, 32, 0.8, 8, false);
        const tether = new THREE.Mesh(tetherGeo, cyanNeon);
        towerGroup.add(tether);

        group.add(towerGroup);

        parts.push({
            name: `Quintessence_Moderator_Tower_${t+1}`,
            description: `Tower designed to bleed off excess vacuum energy and convert it into usable high-voltage plasma.`,
            material: 'Chrome / Copper fins / Glass dome',
            function: 'Energy siphoning and thermal regulation.',
            assemblyOrder: 8,
            connections: ['Base_Chassis', 'Core'],
            failureEffect: 'Core overheats, causing a runaway vacuum decay event.',
            cascadeFailures: ['Total annihilation of the solar system'],
            originalPosition: towerGroup.position.clone(),
            explodedPosition: towerGroup.position.clone().multiplyScalar(2.5)
        });
    }

    // ==========================================
    // 6. EXOTIC COOLANT MANIFOLD PIPES
    // ==========================================
    const pipeGroup = new THREE.Group();
    const pipeMaterial = rubber;
    for(let p=0; p<20; p++) {
        const pAngle = (Math.PI * 2 / 20) * p;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(pAngle)*15, 5, Math.sin(pAngle)*15),
            new THREE.Vector3(Math.cos(pAngle)*30, 2, Math.sin(pAngle)*30),
            new THREE.Vector3(Math.cos(pAngle+0.2)*45, -1, Math.sin(pAngle+0.2)*45),
            new THREE.Vector3(Math.cos(pAngle+0.4)*60, 0, Math.sin(pAngle+0.4)*60)
        ]);
        const pipeGeo = new THREE.TubeGeometry(curve, 32, 1.2, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, pipeMaterial);
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);
    
    parts.push({
        name: 'Exotic_Coolant_Manifold',
        description: 'Vast network of flexible pipes pumping Bose-Einstein condensate at near absolute zero.',
        material: 'Synthetic Rubber / Graphene mesh',
        function: 'Prevents the superconductor tension rings from melting under immense electrical loads.',
        assemblyOrder: 3,
        connections: ['Base_Chassis', 'Spacetime_Tension_Rings'],
        failureEffect: 'Superconductors quench, losing magnetic containment.',
        cascadeFailures: ['Damper array failure', 'Core rupture'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -30, z: -100}
    });

    // ==========================================
    // 7. OPERATOR OBSERVATION DECK
    // ==========================================
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 15, 85);
    
    // Deck Base
    const deckBaseGeo = new THREE.BoxGeometry(30, 2, 20);
    const deckBase = new THREE.Mesh(deckBaseGeo, steel);
    deckGroup.add(deckBase);

    // Support pillars
    const deckPillarGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    const p1 = new THREE.Mesh(deckPillarGeo, darkSteel);
    p1.position.set(-14, -10, -9);
    deckGroup.add(p1);
    const p2 = p1.clone(); p2.position.set(14, -10, -9); deckGroup.add(p2);
    const p3 = p1.clone(); p3.position.set(-14, -10, 9); deckGroup.add(p3);
    const p4 = p1.clone(); p4.position.set(14, -10, 9); deckGroup.add(p4);

    // Cabin Walls & Glass
    const wallGeo = new THREE.BoxGeometry(30, 12, 1);
    const backWall = new THREE.Mesh(wallGeo, plastic);
    backWall.position.set(0, 7, 9.5);
    deckGroup.add(backWall);

    const sideWallGeo = new THREE.BoxGeometry(1, 12, 20);
    const leftWall = new THREE.Mesh(sideWallGeo, plastic);
    leftWall.position.set(-14.5, 7, 0);
    deckGroup.add(leftWall);
    const rightWall = leftWall.clone();
    rightWall.position.set(14.5, 7, 0);
    deckGroup.add(rightWall);

    // Front Glass Shield
    const glassGeo = new THREE.BoxGeometry(30, 12, 1);
    const frontGlass = new THREE.Mesh(glassGeo, tinted);
    frontGlass.position.set(0, 7, -9.5);
    deckGroup.add(frontGlass);

    // Roof
    const roofGeo = new THREE.BoxGeometry(32, 1, 22);
    const roof = new THREE.Mesh(roofGeo, darkSteel);
    roof.position.set(0, 13.5, 0);
    deckGroup.add(roof);

    // Control Consoles inside
    const consoleGeo = new THREE.BoxGeometry(20, 3, 5);
    const controlConsole = new THREE.Mesh(consoleGeo, plastic);
    controlConsole.position.set(0, 2.5, -5);
    controlConsole.rotation.x = Math.PI / 16;
    deckGroup.add(controlConsole);

    // Holographic Screens
    for(let s=0; s<4; s++) {
        const screenGeo = new THREE.PlaneGeometry(4, 3);
        const screen = new THREE.Mesh(screenGeo, cyanNeon);
        screen.position.set(-7.5 + s*5, 5.5, -6);
        screen.rotation.x = -Math.PI / 8;
        deckGroup.add(screen);
    }

    // Operator Seats
    const seatGeo = new THREE.BoxGeometry(2, 4, 2);
    const seat1 = new THREE.Mesh(seatGeo, rubber);
    seat1.position.set(-5, 3, 0);
    deckGroup.add(seat1);
    const seat2 = new THREE.Mesh(seatGeo, rubber);
    seat2.position.set(5, 3, 0);
    deckGroup.add(seat2);

    group.add(deckGroup);

    parts.push({
        name: 'Operator_Observation_Deck',
        description: 'Heavily shielded control cabin with quantum-locked tinted glass to protect operators from Hawking radiation.',
        material: 'Plastic / Dark Steel / Tinted Glass',
        function: 'Manual override, diagnostics monitoring, and human-in-the-loop safety protocols.',
        assemblyOrder: 15,
        connections: ['Base_Chassis', 'Truss_Supports'],
        failureEffect: 'Loss of manual control. Operators vaporized.',
        cascadeFailures: ['AI takes over, inevitably leading to catastrophic miscalculation'],
        originalPosition: {x: 0, y: 15, z: 85},
        explodedPosition: {x: 0, y: 15, z: 200}
    });

    // ==========================================
    // 8. STRUCTURAL SUPPORT TRUSSES
    // ==========================================
    const trussSystem = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (Math.PI * 2 / 8) * i + Math.PI/8;
        const truss = createTrussBeam(40, 4, 4);
        truss.position.set(Math.cos(angle)*35, 20, Math.sin(angle)*35);
        
        // Angle them inwards towards the rings
        truss.lookAt(0, 40, 0);
        truss.rotateX(Math.PI/2);

        trussSystem.add(truss);
    }
    group.add(trussSystem);

    parts.push({
        name: 'Structural_Support_Trusses',
        description: 'Lattice of aluminum and steel beams reinforcing the primary containment geometry.',
        material: 'Aluminum / Steel',
        function: 'Provides rigid body resistance against sheer forces generated by the spinning torsion rings.',
        assemblyOrder: 2,
        connections: ['Base_Chassis', 'Hydraulic_Repulsion_Damper_Array'],
        failureEffect: 'Vibrational resonance cascades leading to metal fatigue and explosive shattering.',
        cascadeFailures: ['Damper failure'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: -50}
    });


    // ==========================================
    // ANIMATION & PHYSICS LOGIC
    // ==========================================
    
    // Scale everything down a bit so it fits perfectly in view
    group.scale.set(0.12, 0.12, 0.12);
    group.position.y = -2;

    const description = "The God Tier Dark Energy Reactor is a monumental cosmological engineering feat. It artificially generates and confines a pocket of 'phantom' dark energy (w < -1). Instead of generating power through heat or fusion, it harvests the repulsive force of expanding spacetime itself. The immense outward pressure threatens to tear the fabric of reality, requiring colossal hydraulic dampers, superconducting torsion rings, and quintessence moderator towers to bleed off excess vacuum energy before it induces a localized 'Big Rip'. Everything about this machine strains outwards against gravity.";

    const quizQuestions = [
        {
            question: "The 'Cosmological Constant Problem' refers to a massive theoretical discrepancy in the vacuum energy density. By approximately what factor does quantum field theory overestimate this value compared to observations?",
            options: ["10^10", "10^40", "10^120", "10^500"],
            correctAnswer: 2,
            explanation: "Quantum field theory predicts a vacuum energy density roughly 10^120 times larger than the observed value of dark energy, making it one of the worst theoretical predictions in physics."
        },
        {
            question: "If the equation of state parameter 'w' for the dark energy within this reactor drops below -1 (phantom energy), what catastrophic cosmological event is theoretically predicted?",
            options: ["The Big Crunch", "The Big Rip", "The Big Freeze", "Vacuum Decay"],
            correctAnswer: 1,
            explanation: "Phantom energy (w < -1) causes the expansion rate to accelerate infinitely, eventually tearing apart galaxies, stars, planets, and ultimately atomic bonds in a 'Big Rip'."
        },
        {
            question: "Unlike a static Cosmological Constant (Lambda), dynamic models of dark energy involve a scalar field that varies in space and time. What is the technical name for this scalar field?",
            options: ["Quintessence", "Inflaton", "Tachyon", "Axion"],
            correctAnswer: 0,
            explanation: "Quintessence is a hypothesized dynamic, time-evolving, and spatially dependent scalar field proposed as an alternative to the cosmological constant to explain accelerating expansion."
        },
        {
            question: "Which observational method, represented by the 'Resonators' in the reactor, uses fossilized sound waves from the early universe plasma as a 'standard ruler' to measure dark energy?",
            options: ["Type Ia Supernovae", "Baryon Acoustic Oscillations", "Gravitational Lensing", "Redshift-Space Distortions"],
            correctAnswer: 1,
            explanation: "Baryon Acoustic Oscillations (BAO) are regular, periodic fluctuations in the density of visible baryonic matter, providing a standard ruler to measure the universe's expansion history."
        },
        {
            question: "What primary effect does dark energy have on the formation of large-scale cosmic structures (like galaxy clusters) in the late universe?",
            options: ["It suppresses their growth by driving matter apart.", "It accelerates their collapse into supermassive black holes.", "It increases their rotational velocity, mimicking dark matter.", "It causes them to emit intense Hawking radiation."],
            correctAnswer: 0,
            explanation: "Dark energy's repulsive force counteracts gravity, stretching spacetime and actively suppressing the gravitational collapse and growth of large-scale structures in the late universe."
        }
    ];

    function animate(time, speed, meshesObj) {
        // Core Singularity breathing/pulsing
        const pulse = 1 + Math.sin(time * 3 * speed) * 0.05;
        meshesObj.singularity.scale.set(pulse, pulse, pulse);
        
        // Inner shell erratic rotation
        meshesObj.innerShell.rotation.x += 0.02 * speed;
        meshesObj.innerShell.rotation.y -= 0.03 * speed;
        
        // Lattice counter-rotation
        meshesObj.lattice.rotation.y += 0.01 * speed;
        meshesObj.lattice.rotation.z += 0.005 * speed;

        // Dark Energy Aura Emissive intensity modulation
        meshesObj.glowAura.material.emissiveIntensity = 3.0 + Math.sin(time * 10 * speed) * 2.0;
        meshesObj.glowAura.scale.set(pulse*1.02, pulse*1.02, pulse*1.02);

        // Spacetime Tension Rings Rotation
        if(meshesObj.tensionRings) {
            meshesObj.tensionRings.forEach(ringObj => {
                ringObj.mesh.rotateOnAxis(ringObj.axis, 0.05 * speed * ringObj.speedMult);
            });
        }

        // Hydraulic Dampers Straining (Inverse Gravity Effect)
        // The core is pushing OUTWARD, so the pistons are being forced back, and they push inward
        if(meshesObj.dampers) {
            meshesObj.dampers.forEach(damper => {
                // Sine wave representing the struggle against the outward pressure
                const strain = Math.sin(time * 8 * speed + damper.phaseOffset);
                const stretchAmount = strain * 1.5; 
                
                // Move the rod outwards/inwards
                damper.rod.position.y = (damper.baseLength / 2) + stretchAmount;
                // Move the top mount to match the rod
                damper.mountTop.position.y = damper.baseLength + stretchAmount * 2;
            });
        }

        // Tower energy coils spinning and glowing
        if(meshesObj.towers) {
            meshesObj.towers.forEach(tower => {
                tower.coil.rotation.z = time * 2 * speed;
                tower.coil.rotation.x = time * 3 * speed;
                // Phase-shifted pulsing
                tower.coil.material.emissiveIntensity = 2.0 + Math.sin(time * 5 * speed + tower.phase) * 3.0;
            });
        }

        // Base gears slowly churning
        if(meshesObj.secondaryGears) {
            meshesObj.secondaryGears.forEach((gear, idx) => {
                // alternating directions
                const dir = idx % 2 === 0 ? 1 : -1;
                gear.mesh.rotation.z += 0.01 * speed * dir;
            });
        }

        // Entire machine extreme vibration when speed is high
        if (speed > 1.5) {
            const jitter = (speed - 1.5) * 0.1;
            group.position.x = (Math.random() - 0.5) * jitter;
            group.position.z = (Math.random() - 0.5) * jitter;
        } else {
            group.position.x = 0;
            group.position.z = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}
