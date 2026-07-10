import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Arrays for animation
    const animatedObjects = {
        tachyonBeams: [],
        magnets: [],
        chronoSensors: [],
        cherenkovRadiators: [],
        entropyParticles: [],
        plasmaConduits: [],
        centralLenses: [],
        warpFields: [],
        temporalAnchors: [],
        fluctuationDampeners: [],
        paradoxMatrix: [],
        coolingFans: [],
        hydraulicPistons: [],
        gyroscopes: []
    };

    // =========================================================================
    // ADVANCED CUSTOM MATERIALS
    // =========================================================================
    
    const cherenkovMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.7,
        transmission: 0.9,
        roughness: 0.05,
        metalness: 0.8,
        ior: 1.52,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const tachyonGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const warpDistortionMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x111122,
        emissiveIntensity: 0.5,
        metalness: 1.0,
        roughness: 0.0,
        transmission: 1.0,
        transparent: true,
        opacity: 0.5,
        ior: 2.5
    });

    const temporalAnchorMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    const antimatterCoreMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4.0,
        wireframe: false
    });

    const superconductorMat = new THREE.MeshPhysicalMaterial({
        color: 0x8888ff,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 0.8,
        emissive: 0x000022,
        emissiveIntensity: 0.5
    });

    const quantumDampenerMat = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 1.5
    });

    const paradoxMatrixMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.0,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        metalness: 1.0
    });

    const deepVoidMat = new THREE.MeshBasicMaterial({
        color: 0x000000
    });

    // =========================================================================
    // HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // =========================================================================

    function createComplexLathe(points, material, segments = 64) {
        const geometry = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geometry, material);
    }

    function createExtrudedShape(shapePoints, material, depth, bevelEnabled = true) {
        const shape = new THREE.Shape();
        shapePoints.forEach((p, i) => {
            if (i === 0) shape.moveTo(p.x, p.y);
            else shape.lineTo(p.x, p.y);
        });
        const extrudeSettings = { depth: depth, bevelEnabled: bevelEnabled, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.center();
        return mesh;
    }

    function createTachyonBeamParticle(radius) {
        const geometry = new THREE.TetrahedronGeometry(radius, 1);
        const mesh = new THREE.Mesh(geometry, tachyonGlowMat.clone());
        return mesh;
    }

    // =========================================================================
    // ACCELERATOR RING GENERATION (MASSIVE, 128 SEGMENTS)
    // =========================================================================
    
    const ringRadius = 150;
    const segments = 128;
    const ringGroup = new THREE.Group();
    
    // Main vacuum tube
    const tubeGeometry = new THREE.TorusGeometry(ringRadius, 4, 64, segments);
    const vacuumTube = new THREE.Mesh(tubeGeometry, darkSteel);
    vacuumTube.rotation.x = Math.PI / 2;
    ringGroup.add(vacuumTube);

    // Assembly arrays for parts tracking
    const superconductorGroup = new THREE.Group();
    const radiatorGroup = new THREE.Group();
    const coolantGroup = new THREE.Group();

    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;

        // Superconducting Magnets (2 per segment = 256 magnets)
        const magnetGeom = new THREE.CylinderGeometry(5.5, 5.5, 2, 32);
        const magnet = new THREE.Mesh(magnetGeom, superconductorMat);
        magnet.position.set(x, 0, z);
        magnet.lookAt(0, 0, 0);
        magnet.rotateX(Math.PI / 2);
        
        // Inner magnet coil details
        const coilGeom = new THREE.TorusGeometry(5, 0.5, 16, 32);
        const coil = new THREE.Mesh(coilGeom, copper);
        magnet.add(coil);

        // Add to animation array for pulsing effects
        animatedObjects.magnets.push({
            mesh: magnet,
            baseScale: 1,
            phaseOffset: i * 0.1
        });
        superconductorGroup.add(magnet);

        // Cherenkov Radiators (every 4th segment)
        if (i % 4 === 0) {
            const radGeom = new THREE.BoxGeometry(6, 6, 4);
            const radiator = new THREE.Mesh(radGeom, cherenkovMaterial);
            radiator.position.set(x * 1.05, 0, z * 1.05);
            radiator.lookAt(0, 0, 0);
            
            // Radiator fins
            for (let j = 0; j < 5; j++) {
                const finGeom = new THREE.BoxGeometry(0.2, 7, 3);
                const fin = new THREE.Mesh(finGeom, aluminum);
                fin.position.x = (j - 2) * 1.0;
                radiator.add(fin);
            }
            
            animatedObjects.cherenkovRadiators.push({
                mesh: radiator,
                baseEmissive: cherenkovMaterial.emissiveIntensity,
                phase: i
            });
            radiatorGroup.add(radiator);
        }

        // Liquid Helium Cooling Pipes (complex sweeping tubes)
        if (i % 2 === 0) {
            const nextAngle = ((i + 2) / segments) * Math.PI * 2;
            const nx = Math.cos(nextAngle) * ringRadius;
            const nz = Math.sin(nextAngle) * ringRadius;
            
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(x * 0.95, 3, z * 0.95),
                new THREE.Vector3((x + nx) / 2 * 0.9, 5, (z + nz) / 2 * 0.9),
                new THREE.Vector3(nx * 0.95, 3, nz * 0.95)
            );
            const pipeGeom = new THREE.TubeGeometry(curve, 20, 0.4, 8, false);
            const pipe = new THREE.Mesh(pipeGeom, chrome);
            coolantGroup.add(pipe);
        }
    }
    
    ringGroup.add(superconductorGroup);
    ringGroup.add(radiatorGroup);
    ringGroup.add(coolantGroup);
    group.add(ringGroup);

    // =========================================================================
    // CENTRAL CAUSALITY CHAMBER (HYPER-COMPLEX GEOMETRY)
    // =========================================================================

    const chamberGroup = new THREE.Group();
    
    // Outer Chamber Shell (Lathe)
    const shellPoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        shellPoints.push(new THREE.Vector2(
            15 + Math.sin(t * Math.PI) * 10,
            -20 + t * 40
        ));
    }
    const chamberShell = createComplexLathe(shellPoints, glass, 64);
    chamberGroup.add(chamberShell);

    // Inner Warp Lenses
    for (let i = 0; i < 3; i++) {
        const lensGeom = new THREE.SphereGeometry(8 - i * 1.5, 64, 64);
        const lens = new THREE.Mesh(lensGeom, warpDistortionMat);
        lens.scale.set(1, 0.2, 1);
        lens.rotation.x = (Math.PI / 4) * i;
        animatedObjects.centralLenses.push({
            mesh: lens,
            rotSpeed: 0.02 + (i * 0.01),
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });
        chamberGroup.add(lens);
    }

    // Paradox Resolution Matrix (Intersecting Torus Knots)
    for (let i = 0; i < 4; i++) {
        const knotGeom = new THREE.TorusKnotGeometry(12, 0.5, 128, 16, i + 2, 3);
        const knot = new THREE.Mesh(knotGeom, paradoxMatrixMat);
        animatedObjects.paradoxMatrix.push({
            mesh: knot,
            speedX: 0.01 * (i % 2 === 0 ? 1 : -1),
            speedY: 0.015 * (i % 3 === 0 ? 1 : -1),
            speedZ: 0.005
        });
        chamberGroup.add(knot);
    }

    // Collision Core (Deep Void + Antimatter spark)
    const coreGeom = new THREE.IcosahedronGeometry(2, 2);
    const core = new THREE.Mesh(coreGeom, deepVoidMat);
    const sparkGeom = new THREE.OctahedronGeometry(1.5, 0);
    const spark = new THREE.Mesh(sparkGeom, antimatterCoreMat);
    core.add(spark);
    chamberGroup.add(core);
    animatedObjects.plasmaConduits.push({mesh: spark, baseScale: 1.0});

    group.add(chamberGroup);

    // =========================================================================
    // TACHYON INJECTORS (MASSIVE SIDE STRUCTURES)
    // =========================================================================

    const injectorDistance = 100;
    const leftInjectorGroup = new THREE.Group();
    const rightInjectorGroup = new THREE.Group();

    function buildInjector() {
        const injGroup = new THREE.Group();
        
        // Base structure
        const baseGeom = new THREE.CylinderGeometry(15, 20, 60, 32);
        const base = new THREE.Mesh(baseGeom, steel);
        base.rotation.z = Math.PI / 2;
        injGroup.add(base);

        // Magnetic Confinement Rings
        for(let i=0; i<8; i++) {
            const ringGeom = new THREE.TorusGeometry(18, 2, 32, 64);
            const ring = new THREE.Mesh(ringGeom, copper);
            ring.position.x = -25 + (i * 7);
            ring.rotation.y = Math.PI / 2;
            
            // Add tiny hydraulic dampeners to each ring
            for(let j=0; j<4; j++) {
                const hydGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 8);
                const hyd = new THREE.Mesh(hydGeom, chrome);
                hyd.position.set(0, Math.cos(j*Math.PI/2)*18, Math.sin(j*Math.PI/2)*18);
                hyd.rotation.x = j*Math.PI/2;
                ring.add(hyd);
            }
            injGroup.add(ring);
            
            animatedObjects.gyroscopes.push({
                mesh: ring,
                speed: (i % 2 === 0 ? 0.05 : -0.05)
            });
        }

        // Temporal Stabilizers
        const stabGeom = new THREE.DodecahedronGeometry(8, 1);
        const stabilizer = new THREE.Mesh(stabGeom, temporalAnchorMat);
        stabilizer.position.x = -40;
        injGroup.add(stabilizer);
        animatedObjects.temporalAnchors.push({mesh: stabilizer, phase: Math.random()*Math.PI*2});

        // Plasma Conduits
        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const cy = Math.cos(angle) * 12;
            const cz = Math.sin(angle) * 12;
            const condGeom = new THREE.CylinderGeometry(1, 1, 60, 16);
            const cond = new THREE.Mesh(condGeom, cherenkovMaterial);
            cond.position.set(0, cy, cz);
            cond.rotation.z = Math.PI / 2;
            injGroup.add(cond);
        }

        // Particle Emitter Tip
        const tipPoints = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(5, 5),
            new THREE.Vector2(8, 15),
            new THREE.Vector2(2, 25),
            new THREE.Vector2(0, 25)
        ];
        const tip = createComplexLathe(tipPoints, chrome, 32);
        tip.rotation.z = -Math.PI / 2;
        tip.position.x = 30;
        injGroup.add(tip);

        return injGroup;
    }

    const leftInjector = buildInjector();
    leftInjector.position.x = -injectorDistance;
    leftInjectorGroup.add(leftInjector);
    group.add(leftInjectorGroup);

    const rightInjector = buildInjector();
    rightInjector.position.x = injectorDistance;
    rightInjector.rotation.y = Math.PI; // Face the other way
    rightInjectorGroup.add(rightInjector);
    group.add(rightInjectorGroup);

    // =========================================================================
    // CHRONO-DETECTORS (PRECOGNITIVE SENSORS)
    // =========================================================================
    
    const detectorGroup = new THREE.Group();
    const numDetectors = 12;
    for(let i=0; i<numDetectors; i++) {
        const angle = (i / numDetectors) * Math.PI * 2;
        const dist = 60;
        
        const detHolderGeom = new THREE.BoxGeometry(4, 15, 4);
        const detHolder = new THREE.Mesh(detHolderGeom, darkSteel);
        detHolder.position.set(Math.cos(angle)*dist, 10, Math.sin(angle)*dist);
        detHolder.lookAt(0, 10, 0);

        const dishGeom = new THREE.CylinderGeometry(6, 0.1, 4, 32);
        const dish = new THREE.Mesh(dishGeom, aluminum);
        dish.rotation.x = Math.PI / 2;
        dish.position.z = 2;
        detHolder.add(dish);

        const sensorGeom = new THREE.SphereGeometry(1.5, 16, 16);
        const sensor = new THREE.Mesh(sensorGeom, tachyonGlowMat);
        sensor.position.z = 4;
        dish.add(sensor);

        animatedObjects.chronoSensors.push({
            mesh: sensor,
            phase: i,
            holder: detHolder
        });

        detectorGroup.add(detHolder);
    }
    group.add(detectorGroup);

    // =========================================================================
    // SUPPORT STRUCTURES & INFRASTRUCTURE
    // =========================================================================
    
    const platformGroup = new THREE.Group();
    
    // Massive base pillars
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const px = Math.cos(angle)*ringRadius;
        const pz = Math.sin(angle)*ringRadius;
        
        const pillarGeom = new THREE.CylinderGeometry(8, 12, 100, 16);
        const pillar = new THREE.Mesh(pillarGeom, steel);
        pillar.position.set(px, -50, pz);
        platformGroup.add(pillar);

        // Add hydraulic struts to pillars
        for(let j=0; j<3; j++) {
            const strutGeom = new THREE.CylinderGeometry(1.5, 1.5, 30, 8);
            const strut = new THREE.Mesh(strutGeom, chrome);
            strut.position.set(0, 20, 10);
            strut.rotation.x = -Math.PI / 6;
            
            // Pivot around pillar
            const strutPivot = new THREE.Group();
            strutPivot.rotation.y = (j/3)*Math.PI*2;
            strutPivot.add(strut);
            pillar.add(strutPivot);
            
            animatedObjects.hydraulicPistons.push({
                mesh: strut,
                baseY: 20,
                phase: i+j
            });
        }
    }

    // Heavy duty grating floor around chamber
    const floorShape = [
        new THREE.Vector2(-40, -40),
        new THREE.Vector2(40, -40),
        new THREE.Vector2(40, 40),
        new THREE.Vector2(-40, 40)
    ];
    // create a hole in the middle
    const floorHole = new THREE.Path();
    floorHole.absarc(0, 0, 25, 0, Math.PI * 2, false);
    const floorShapeObj = new THREE.Shape(floorShape);
    floorShapeObj.holes.push(floorHole);
    
    const floorGeom = new THREE.ExtrudeGeometry(floorShapeObj, {depth: 2, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5});
    const floor = new THREE.Mesh(floorGeom, darkSteel);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -20;
    platformGroup.add(floor);

    group.add(platformGroup);

    // =========================================================================
    // QUANTUM FLUCTUATION DAMPENERS
    // =========================================================================
    
    const dampenerGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dx = Math.cos(angle) * 35;
        const dz = Math.sin(angle) * 35;
        
        const dGeom = new THREE.BoxGeometry(5, 20, 5);
        const dampener = new THREE.Mesh(dGeom, plastic);
        dampener.position.set(dx, -5, dz);
        dampener.lookAt(0, -5, 0);
        
        const coreGeom = new THREE.CylinderGeometry(2.6, 2.6, 18, 16);
        const core = new THREE.Mesh(coreGeom, quantumDampenerMat);
        dampener.add(core);
        
        animatedObjects.fluctuationDampeners.push({
            mesh: core,
            phase: i,
            speed: 0.05
        });
        
        dampenerGroup.add(dampener);
    }
    group.add(dampenerGroup);

    // =========================================================================
    // TACHYON PARTICLE SYSTEM (BACKWARDS IN TIME VISUALIZATION)
    // =========================================================================
    
    const particleGroup = new THREE.Group();
    const numParticles = 2000;
    
    // We will use individual meshes for particles so we can easily export as glTF/THREE parts if needed,
    // though InstancedMesh is normally better. For maximum code complexity and explicit object tracking, 
    // we use an array of meshes.
    
    const particleGeom = new THREE.OctahedronGeometry(0.3, 0);
    const particleMat = tachyonGlowMat.clone();
    particleMat.color.setHex(0x00ffff);
    particleMat.emissive.setHex(0xffffff);

    for (let i = 0; i < numParticles; i++) {
        const p = new THREE.Mesh(particleGeom, particleMat);
        
        // Random placement along the ring or injectors
        const isRing = Math.random() > 0.3;
        
        let initialPos = new THREE.Vector3();
        let velocity = new THREE.Vector3();
        
        if (isRing) {
            const angle = Math.random() * Math.PI * 2;
            const rOffset = (Math.random() - 0.5) * 6;
            const yOffset = (Math.random() - 0.5) * 6;
            initialPos.set(
                Math.cos(angle) * (ringRadius + rOffset),
                yOffset,
                Math.sin(angle) * (ringRadius + rOffset)
            );
            // Reverse velocity for tachyons! (Moving counter to standard orbit)
            velocity.set(
                Math.sin(angle) * 5,
                0,
                -Math.cos(angle) * 5
            );
        } else {
            // Injector particles
            const isLeft = Math.random() > 0.5;
            const xPos = isLeft ? -injectorDistance + Math.random()*50 : injectorDistance - Math.random()*50;
            const rad = Math.random() * 5;
            const ang = Math.random() * Math.PI * 2;
            initialPos.set(
                xPos,
                Math.cos(ang) * rad,
                Math.sin(ang) * rad
            );
            // Converging towards center, but we visualize entropy reversal by having them 
            // occasionally jitter backwards or split
            velocity.set(isLeft ? 8 : -8, 0, 0);
        }
        
        p.position.copy(initialPos);
        particleGroup.add(p);
        
        animatedObjects.entropyParticles.push({
            mesh: p,
            origin: initialPos.clone(),
            vel: velocity,
            life: Math.random() * 100,
            maxLife: 50 + Math.random() * 100,
            entropyState: Math.random() > 0.8 ? -1 : 1 // -1 means it flows backward visually
        });
    }
    group.add(particleGroup);

    // =========================================================================
    // PARTS ARRAY DEFINITION (EXTREMELY DETAILED)
    // =========================================================================

    parts.push({
        name: "Superconducting Magnet Array",
        description: "128 niobium-titanium superconducting magnets coiled to generate a 40 Tesla containment field, holding the causality-violating particles in a stable orbit.",
        material: "Superconductor Alloy (NbTi) / Copper",
        function: "Maintains the trajectory of tachyonic particles. Failure results in immediate local reality degradation and spontaneous micro-black hole formation.",
        assemblyOrder: 1,
        connections: ["Coolant Ring", "Vacuum Chamber", "Power Grid"],
        failureEffect: "Reality Degradation",
        cascadeFailures: ["Cherenkov Radiators", "Vacuum Shell"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    parts.push({
        name: "Cherenkov Radiator Baffles",
        description: "High-density refractive index blocks designed to capture and dissipate the immense vacuum Cherenkov radiation emitted by superluminal tachyons.",
        material: "Synthetic Metamaterial Glass / Aluminum",
        function: "Prevents blinding radiation from vaporizing the facility.",
        assemblyOrder: 2,
        connections: ["Superconducting Magnet Array", "Coolant Ring"],
        failureEffect: "Lethal Gamma/Cherenkov Burst",
        cascadeFailures: ["Chrono-Detectors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    parts.push({
        name: "Liquid Helium Cryo-Piping",
        description: "Intricate network of pipes maintaining the superconductor array at 1.9 Kelvin using superfluid helium.",
        material: "Chrome / Steel",
        function: "Thermal regulation of the magnetic containment system.",
        assemblyOrder: 3,
        connections: ["Superconducting Magnet Array"],
        failureEffect: "Magnet Quench",
        cascadeFailures: ["Superconducting Magnet Array", "Containment Field"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    parts.push({
        name: "Tachyon Injector Hub (Port/Starboard)",
        description: "Massive linear accelerator stages that pump raw paradox-energy into the main ring. Features counter-rotating gyroscopic stabilizers.",
        material: "Steel / Copper / Chrome",
        function: "Initial acceleration and temporal phase-shifting of particles.",
        assemblyOrder: 4,
        connections: ["Vacuum Chamber", "Temporal Stabilizers"],
        failureEffect: "Timeline Forking",
        cascadeFailures: ["Central Causality Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -250, y: 50, z: 0 }
    });

    parts.push({
        name: "Temporal Stabilizers",
        description: "Dodecahedron-shaped topological anchors that pin the local reference frame to standard spacetime, preventing the facility from drifting into the past.",
        material: "Chroniton-infused Alloys",
        function: "Maintains local timeline integrity.",
        assemblyOrder: 5,
        connections: ["Tachyon Injector Hub"],
        failureEffect: "Temporal Displacement",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -100, y: 150, z: -100 }
    });

    parts.push({
        name: "Chrono-Detectors",
        description: "Pre-cognitive sensor dishes that register collisions microseconds *before* they actually occur, reading ripples moving backwards in time.",
        material: "Aluminum / Dark Steel",
        function: "Data collection from tachyonic impacts.",
        assemblyOrder: 6,
        connections: ["Data Grid", "Platform Floor"],
        failureEffect: "Paradoxical Data Corruption",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 150, y: 150, z: 150 }
    });

    parts.push({
        name: "Central Causality Chamber",
        description: "The primary collision zone. Encased in a massive lathe-spun glass shell, housing intersecting paradox resolution tori and deep void core.",
        material: "Glass / Warp Distortion Metamaterial",
        function: "Facilitates the FTL particle collisions safely without shredding spacetime.",
        assemblyOrder: 7,
        connections: ["Vacuum Chamber", "Paradox Matrix", "Quantum Dampeners"],
        failureEffect: "Localized False Vacuum Decay",
        cascadeFailures: ["Universe"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 }
    });

    parts.push({
        name: "Paradox Resolution Matrix",
        description: "Intersecting torus knots made of pure energy-infused metal. These geometries force causal loops to resolve mathematically.",
        material: "Exotic White Matter",
        function: "Prevents grandfather paradoxes from manifesting locally.",
        assemblyOrder: 8,
        connections: ["Central Causality Chamber"],
        failureEffect: "Causality Violation",
        cascadeFailures: ["Central Causality Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    parts.push({
        name: "Quantum Fluctuation Dampeners",
        description: "Pillars surrounding the central chamber that absorb excess probability waves, ensuring a deterministic outcome for the collision.",
        material: "Plastic / Glowing Core",
        function: "Reduces quantum noise in the macroscopic environment.",
        assemblyOrder: 9,
        connections: ["Platform Floor", "Central Causality Chamber"],
        failureEffect: "Probability Storm",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: -50, z: -100 }
    });

    parts.push({
        name: "Main Platform Infrastructure",
        description: "Heavy-duty steel gratings, pillars, and hydraulic pistons supporting the immense weight of the God Tier Tachyon Collider.",
        material: "Steel / Chrome / Dark Steel",
        function: "Structural support and vibration dampening.",
        assemblyOrder: 10,
        connections: ["Ground", "All Components"],
        failureEffect: "Structural Collapse",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    parts.push({
        name: "Antimatter Core Spark",
        description: "A suspended point of pure antiprotons used to trigger the initial tachyon condensation event.",
        material: "Pure Energy (Red)",
        function: "Catalyst for tachyonic generation.",
        assemblyOrder: 11,
        connections: ["Central Causality Chamber"],
        failureEffect: "Annihilation Explosion",
        cascadeFailures: ["Central Causality Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 350, z: 0 }
    });

    parts.push({
        name: "Warp Lenses",
        description: "Three nested spheres with extreme index of refraction, bending spacetime itself to focus the tachyon beams into an infinitesimally small point.",
        material: "Spacetime Distortion Metamaterial",
        function: "Focusing FTL beams.",
        assemblyOrder: 12,
        connections: ["Central Causality Chamber"],
        failureEffect: "Beam Defocus / Spacetime Tear",
        cascadeFailures: ["Vacuum Shell"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 280, z: 50 }
    });

    parts.push({
        name: "Magnetic Confinement Rings (Injector)",
        description: "Copper rings running along the injector barrel to align the spin of tachyons before they enter the main ring.",
        material: "Copper / Chrome",
        function: "Spin alignment.",
        assemblyOrder: 13,
        connections: ["Tachyon Injector Hub"],
        failureEffect: "Particle Scatter",
        cascadeFailures: ["Tachyon Injector Hub"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 250, y: 100, z: 100 }
    });

    parts.push({
        name: "Plasma Conduits",
        description: "Six high-energy tubes feeding power directly from the antimatter reactors into the injectors.",
        material: "Cherenkov Blue / Glass",
        function: "Power transmission.",
        assemblyOrder: 14,
        connections: ["Tachyon Injector Hub", "Power Grid"],
        failureEffect: "Power Surge",
        cascadeFailures: ["Magnetic Confinement Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -250, y: 150, z: 150 }
    });

    parts.push({
        name: "Hydraulic Pillar Struts",
        description: "Active suspension system compensating for the micro-seismic vibrations caused by localized gravity waves.",
        material: "Chrome",
        function: "Vibration isolation.",
        assemblyOrder: 15,
        connections: ["Main Platform Infrastructure"],
        failureEffect: "Misalignment",
        cascadeFailures: ["Superconducting Magnet Array"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: -150, z: 100 }
    });

    // =========================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // =========================================================================

    const quizQuestions = [
        {
            question: "According to the Feinberg formulation of tachyons, what happens to the energy of a tachyon as its velocity approaches infinity?",
            options: [
                "It approaches infinity.",
                "It approaches zero.",
                "It becomes imaginary.",
                "It becomes equal to its rest mass."
            ],
            correctAnswer: 1,
            explanation: "For a tachyon, E = mc^2 / sqrt(v^2/c^2 - 1). As v approaches infinity, the denominator approaches infinity, causing the energy E to approach zero. A zero-energy tachyon travels at infinite speed."
        },
        {
            question: "In a tachyonic field theory, what does the 'imaginary mass' of the tachyon correspond to physically in the context of the vacuum?",
            options: [
                "The existence of negative energy states.",
                "The spontaneous breaking of gauge symmetry.",
                "An instability of the vacuum leading to tachyon condensation.",
                "The violation of Lorentz invariance."
            ],
            correctAnswer: 2,
            explanation: "An imaginary mass implies a local maximum (rather than a minimum) in the potential energy of the field at the origin. This represents an unstable vacuum state. The field will roll down to a true minimum, a process known as tachyon condensation (as seen in the Higgs mechanism)."
        },
        {
            question: "Cherenkov radiation occurs when a particle travels faster than the phase velocity of light in a medium. For a tachyon traveling in a perfect vacuum, under what condition would it emit vacuum Cherenkov radiation?",
            options: [
                "If it has a non-zero electric charge.",
                "If it interacts only gravitationally.",
                "If its spin is strictly half-integer.",
                "Tachyons cannot emit Cherenkov radiation in a vacuum."
            ],
            correctAnswer: 0,
            explanation: "If a tachyon carries an electric charge, its velocity (v > c) would exceed the phase velocity of light in a vacuum (c). Consequently, it would continuously emit vacuum Cherenkov radiation, losing energy and thus accelerating to infinite speed."
        },
        {
            question: "According to the Feynman-Stueckelberg reinterpretation principle, a negative-energy tachyon moving backward in time is physically equivalent to what?",
            options: [
                "A positive-energy bradyon moving forward in time.",
                "A negative-energy luxon moving backward in space.",
                "A positive-energy tachyon moving forward in time.",
                "An antimatter tachyon with imaginary momentum."
            ],
            correctAnswer: 2,
            explanation: "The reinterpretation principle states that a negative energy particle propagating backward in time is mathematically and physically indistinguishable from its antiparticle (with positive energy) propagating forward in time. This is used to resolve apparent causality issues with negative energies."
        },
        {
            question: "In a Tolman antitelephone scenario, tachyonic signals are used to communicate with the past. Which foundational principle of Special Relativity is most directly in conflict with the existence of such a device if causality is strictly preserved?",
            options: [
                "The invariance of the speed of light.",
                "Lorentz invariance (relativity of simultaneity).",
                "Time dilation.",
                "Length contraction."
            ],
            correctAnswer: 1,
            explanation: "Lorentz invariance means the laws of physics are the same for all observers. Because simultaneity is relative, a signal moving faster than c in one frame will move backward in time in another. If you can send signals faster than c, you can construct a loop where the signal arrives before it was sent, violating causality. Thus, you must abandon either causality or Lorentz invariance."
        }
    ];

    // =========================================================================
    // EXTREME ANIMATION LOGIC
    // =========================================================================

    function animate(time, speed, meshes) {
        const t = time * speed;

        // 1. Magnet Array Pulsing (Simulating containment field fluctuations)
        animatedObjects.magnets.forEach((magObj) => {
            const scaleOffset = Math.sin(t * 10 + magObj.phaseOffset) * 0.05;
            magObj.mesh.scale.set(
                magObj.baseScale + scaleOffset,
                magObj.baseScale,
                magObj.baseScale + scaleOffset
            );
            // Inner coil rotates slightly
            magObj.mesh.children[0].rotation.y = t * 2 + magObj.phaseOffset;
        });

        // 2. Cherenkov Radiators Pulsing
        animatedObjects.cherenkovRadiators.forEach((radObj) => {
            const intensity = radObj.baseEmissive + Math.sin(t * 5 + radObj.phase) * 1.5;
            radObj.mesh.material.emissiveIntensity = intensity;
        });

        // 3. Central Lenses Rotating & Warping
        animatedObjects.centralLenses.forEach((lensObj) => {
            lensObj.mesh.rotateOnAxis(lensObj.axis, lensObj.rotSpeed * speed * 10);
            // Dynamic scaling for warp effect
            const warpScale = 1.0 + Math.sin(t * 8 + lensObj.rotSpeed * 100) * 0.1;
            lensObj.mesh.scale.set(warpScale, 0.2 * warpScale, warpScale);
        });

        // 4. Paradox Matrix Interlocking Torus Knots
        animatedObjects.paradoxMatrix.forEach((knotObj) => {
            knotObj.mesh.rotation.x += knotObj.speedX * speed * 20;
            knotObj.mesh.rotation.y += knotObj.speedY * speed * 20;
            knotObj.mesh.rotation.z += knotObj.speedZ * speed * 20;
        });

        // 5. Plasma Conduits & Antimatter Spark
        animatedObjects.plasmaConduits.forEach((plasmaObj) => {
            const pulse = 1.0 + Math.random() * 0.2;
            plasmaObj.mesh.scale.set(pulse, pulse, pulse);
            plasmaObj.mesh.rotation.x = Math.random() * Math.PI;
            plasmaObj.mesh.rotation.y = Math.random() * Math.PI;
        });

        // 6. Chrono-Sensors (Precognitive tracking)
        // They look ahead of the current time
        animatedObjects.chronoSensors.forEach((sensorObj) => {
            const futureT = t + 5.0; // looking into the future
            const lookX = Math.cos(futureT * 2 + sensorObj.phase) * 20;
            const lookY = Math.sin(futureT * 3 + sensorObj.phase) * 10;
            sensorObj.holder.lookAt(lookX, lookY, 0);
            
            // Pulse glow based on "future" collisions
            const collisionProximity = Math.sin(futureT * 10 + sensorObj.phase);
            sensorObj.mesh.material.emissiveIntensity = 2.0 + (collisionProximity > 0.9 ? 5.0 : 0.0);
        });

        // 7. Temporal Anchors
        animatedObjects.temporalAnchors.forEach((anchorObj) => {
            anchorObj.mesh.rotation.y = t * 2 + anchorObj.phase;
            anchorObj.mesh.rotation.z = Math.sin(t + anchorObj.phase) * 0.5;
        });

        // 8. Gyroscopic Confinement Rings
        animatedObjects.gyroscopes.forEach((gyroObj) => {
            gyroObj.mesh.rotation.x += gyroObj.speed * speed * 10;
        });

        // 9. Hydraulic Struts
        animatedObjects.hydraulicPistons.forEach((pistObj) => {
            pistObj.mesh.position.y = pistObj.baseY + Math.sin(t * 5 + pistObj.phase) * 2.0;
        });

        // 10. Quantum Dampeners
        animatedObjects.fluctuationDampeners.forEach((dampObj) => {
            dampObj.mesh.rotation.y += dampObj.speed * speed * 10;
            dampObj.mesh.material.emissiveIntensity = 1.5 + Math.cos(t * 15 + dampObj.phase);
        });

        // 11. Tachyon Particle System (Extreme causality violation logic)
        animatedObjects.entropyParticles.forEach((pObj) => {
            // Update life
            pObj.life += speed * 5.0;
            
            // Movement: If entropyState is -1, the particle appears to move along its velocity vector, 
            // but randomly jitters backward to previous positions, simulating reverse time flow.
            const timeStep = speed * 2.0;
            
            if (pObj.entropyState === -1) {
                // Reverse time visualization: occasionally snap backwards
                if (Math.random() > 0.9) {
                    pObj.mesh.position.sub(pObj.vel.clone().multiplyScalar(timeStep * 10));
                } else {
                    pObj.mesh.position.add(pObj.vel.clone().multiplyScalar(timeStep));
                }
            } else {
                // Normal flow
                pObj.mesh.position.add(pObj.vel.clone().multiplyScalar(timeStep));
            }

            // Circular bounds check for ring particles
            const distFromY = Math.sqrt(pObj.mesh.position.x**2 + pObj.mesh.position.z**2);
            if (distFromY > ringRadius + 20 || distFromY < ringRadius - 20) {
                // Keep them somewhat constrained to the torus by pulling them back
                const angle = Math.atan2(pObj.mesh.position.z, pObj.mesh.position.x);
                pObj.vel.x -= Math.cos(angle) * 0.5;
                pObj.vel.z -= Math.sin(angle) * 0.5;
            }
            
            // Injector particles bounds check
            if (Math.abs(pObj.mesh.position.x) < 5) {
                // Collision happened! Reset to origin
                pObj.life = pObj.maxLife; 
                // Create a blinding flash (simulated by scaling the particle up massively for one frame)
                pObj.mesh.scale.set(10, 10, 10);
            } else {
                pObj.mesh.scale.set(1, 1, 1);
            }

            // Reset dead particles
            if (pObj.life >= pObj.maxLife) {
                pObj.life = 0;
                pObj.mesh.position.copy(pObj.origin);
                // randomize entropy state again
                pObj.entropyState = Math.random() > 0.8 ? -1 : 1;
            }
            
            // Fade out near end of life
            pObj.mesh.material.opacity = 1.0 - (pObj.life / pObj.maxLife);
        });

        // 12. Main chamber rotation to give a sense of immense energy
        chamberGroup.rotation.y = t * 0.5;
    }

    return {
        group,
        parts,
        description: "The God Tier Tachyon Collider. A hyper-complex, causality-violating accelerator designed to collide tachyonic particles. It features fully functioning Cherenkov radiators, quantum dampeners, temporal anchors, and reverse-entropy particle flows. Warning: May cause localized breakdown of standard spacetime topology.",
        quizQuestions,
        animate
    };
}
