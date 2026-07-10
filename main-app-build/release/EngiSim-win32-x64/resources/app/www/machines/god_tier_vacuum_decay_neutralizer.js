import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // CUSTOM MATERIALS & SHADERS (GOD TIER)
    // ==========================================
    const voidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        roughness: 1.0, 
        metalness: 0.0,
        emissive: 0x000000
    });
    
    const voidEdgeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x220033, 
        emissive: 0xaa00ff, 
        emissiveIntensity: 6.0, 
        wireframe: false,
        transparent: true,
        opacity: 0.9
    });

    const higgsBeamMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 12.0, 
        transparent: true, 
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const intenseGlow = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffdd88, 
        emissiveIntensity: 10.0 
    });

    const quantumCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xff0055,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    const ultraChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    const hazardOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        roughness: 0.6,
        metalness: 0.2
    });

    // ==========================================
    // ANIMATION & STATE REGISTRIES
    // ==========================================
    const animatedObjects = {
        anchors: [],
        beams: [],
        voidCubes: null, // Will be an InstancedMesh
        voidEdges: null, // Will be an InstancedMesh
        rotatingRings: [],
        pistons: [],
        cores: [],
        energyPulses: [],
        gears: [],
        dummy: new THREE.Object3D(),
        timeElapsed: 0
    };

    // ==========================================
    // COMPLEX GEOMETRY GENERATORS
    // ==========================================

    /**
     * Generates a complex multi-layered gear shape
     */
    function createComplexGearShape(radius, teeth, toothDepth, innerRadius) {
        const shape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 1) * step;
            const midAngle1 = angle + step * 0.25;
            const midAngle2 = angle + step * 0.75;

            if (i === 0) {
                shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
                shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            // Tooth outward
            shape.lineTo(Math.cos(midAngle1) * (radius + toothDepth), Math.sin(midAngle1) * (radius + toothDepth));
            shape.lineTo(Math.cos(midAngle2) * (radius + toothDepth), Math.sin(midAngle2) * (radius + toothDepth));
            shape.lineTo(Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius);
        }
        
        // Inner hole
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        return shape;
    }

    /**
     * Generates a highly detailed Lathe profile for Pylons
     */
    function createPylonProfile() {
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(50, 0));
        points.push(new THREE.Vector2(45, 10));
        points.push(new THREE.Vector2(45, 20));
        points.push(new THREE.Vector2(30, 30));
        points.push(new THREE.Vector2(30, 80));
        points.push(new THREE.Vector2(35, 85));
        points.push(new THREE.Vector2(35, 100));
        points.push(new THREE.Vector2(20, 150));
        points.push(new THREE.Vector2(25, 155));
        points.push(new THREE.Vector2(25, 180));
        points.push(new THREE.Vector2(15, 200));
        points.push(new THREE.Vector2(20, 210));
        points.push(new THREE.Vector2(20, 250));
        points.push(new THREE.Vector2(5, 260));
        points.push(new THREE.Vector2(0, 260));
        return points;
    }

    /**
     * Generates a complex spline for hydraulic lines
     */
    function generateHydraulicSpline(startX, startY, startZ, endX, endY, endZ, complexity) {
        const points = [];
        points.push(new THREE.Vector3(startX, startY, startZ));
        for (let i = 1; i < complexity; i++) {
            const t = i / complexity;
            const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 20;
            const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 20;
            const z = startZ + (endZ - startZ) * t + (Math.random() - 0.5) * 20;
            points.push(new THREE.Vector3(x, y, z));
        }
        points.push(new THREE.Vector3(endX, endY, endZ));
        return new THREE.CatmullRomCurve3(points);
    }

    // ==========================================
    // SYSTEM ASSEMBLY: THE TRUE VOID WALL
    // ==========================================
    const voidRadius = 800;
    const voidResolution = 80; // 80x80 grid = 6400 instances
    
    const voidCubeGeo = new THREE.BoxGeometry(15, 15, 15);
    const instancedVoid = new THREE.InstancedMesh(voidCubeGeo, voidMaterial, voidResolution * voidResolution);
    const instancedVoidEdges = new THREE.InstancedMesh(voidCubeGeo, voidEdgeMaterial, voidResolution * voidResolution);
    
    let index = 0;
    const voidData = []; // Store base positions for animation
    
    for (let i = 0; i < voidResolution; i++) {
        for (let j = 0; j < voidResolution; j++) {
            const phi = (i / voidResolution) * Math.PI - (Math.PI / 2); // -PI/2 to PI/2
            const theta = (j / voidResolution) * Math.PI * 0.5 - (Math.PI / 4); // Limited arc
            
            // Spherical to Cartesian
            const x = voidRadius * Math.cos(phi) * Math.cos(theta);
            const y = voidRadius * Math.sin(phi);
            const z = voidRadius * Math.cos(phi) * Math.sin(theta) + 1200; // Offset on Z

            animatedObjects.dummy.position.set(x, y, z);
            animatedObjects.dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            animatedObjects.dummy.scale.set(1, 1, 1);
            animatedObjects.dummy.updateMatrix();

            instancedVoid.setMatrixAt(index, animatedObjects.dummy.matrix);
            
            // Edge layer slightly larger and offset
            animatedObjects.dummy.scale.set(1.1, 1.1, 1.1);
            animatedObjects.dummy.position.z -= 10; 
            animatedObjects.dummy.updateMatrix();
            instancedVoidEdges.setMatrixAt(index, animatedObjects.dummy.matrix);

            voidData.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() });
            index++;
        }
    }
    instancedVoid.instanceMatrix.needsUpdate = true;
    instancedVoidEdges.instanceMatrix.needsUpdate = true;
    group.add(instancedVoid);
    group.add(instancedVoidEdges);

    animatedObjects.voidCubes = { mesh: instancedVoid, data: voidData };
    animatedObjects.voidEdges = { mesh: instancedVoidEdges, data: voidData };

    // ==========================================
    // SYSTEM ASSEMBLY: REALITY ANCHORS
    // ==========================================
    const numAnchors = 12;
    const anchorRadius = 600;
    const centerPlatformGeo = new THREE.CylinderGeometry(anchorRadius + 50, anchorRadius + 100, 40, 12);
    const centerPlatform = new THREE.Mesh(centerPlatformGeo, darkSteel);
    centerPlatform.position.y = -20;
    group.add(centerPlatform);

    // Add immense grating over platform
    const gratingGeo = new THREE.RingGeometry(100, anchorRadius + 40, 64, 16);
    const grating = new THREE.Mesh(gratingGeo, new THREE.MeshStandardMaterial({color: 0x333333, wireframe: true}));
    grating.rotation.x = -Math.PI / 2;
    grating.position.y = 1;
    group.add(grating);

    for (let i = 0; i < numAnchors; i++) {
        const angle = (i / numAnchors) * Math.PI * 2;
        const anchorGroup = new THREE.Group();
        
        const x = Math.cos(angle) * anchorRadius;
        const z = Math.sin(angle) * anchorRadius;
        anchorGroup.position.set(x, 0, z);
        
        // Orient towards the void (0, 0, 1200)
        anchorGroup.lookAt(new THREE.Vector3(0, 200, 1200));

        // 1. Base Gear Array
        const gearExtrudeSettings = { depth: 15, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 2, bevelThickness: 2 };
        const baseGearGeo = new THREE.ExtrudeGeometry(createComplexGearShape(60, 24, 10, 20), gearExtrudeSettings);
        const baseGear = new THREE.Mesh(baseGearGeo, steel);
        baseGear.rotation.x = Math.PI / 2;
        baseGear.position.y = 10;
        anchorGroup.add(baseGear);
        animatedObjects.gears.push({ mesh: baseGear, speed: (i % 2 === 0 ? 1 : -1) * 0.05 });

        // 2. Primary Pylon (Lathe)
        const pylonGeo = new THREE.LatheGeometry(createPylonProfile(), 32);
        const pylon = new THREE.Mesh(pylonGeo, darkSteel);
        pylon.rotation.x = Math.PI / 2; // Point forward
        pylon.position.y = 50;
        anchorGroup.add(pylon);

        // 3. Sub-Pylons & Hydraulics
        for(let j=0; j<4; j++) {
            const subAngle = (j / 4) * Math.PI * 2;
            const subX = Math.cos(subAngle) * 70;
            const subY = Math.sin(subAngle) * 70;

            // Hydraulic Cylinder Outer
            const hydGeo = new THREE.CylinderGeometry(8, 8, 150, 16);
            const hyd = new THREE.Mesh(hydGeo, chrome);
            hyd.position.set(subX, 50, subY);
            hyd.rotation.x = Math.PI / 2;
            anchorGroup.add(hyd);

            // Hydraulic Piston Inner
            const pistonGeo = new THREE.CylinderGeometry(5, 5, 200, 16);
            const piston = new THREE.Mesh(pistonGeo, steel);
            piston.position.set(subX, 50, subY);
            piston.rotation.x = Math.PI / 2;
            anchorGroup.add(piston);
            animatedObjects.pistons.push({ mesh: piston, baseY: subY, offset: Math.random() * Math.PI * 2 });
        }

        // 4. Quantum Core (TorusKnot)
        const coreGeo = new THREE.TorusKnotGeometry(25, 8, 128, 16, 3, 5);
        const core = new THREE.Mesh(coreGeo, quantumCoreMaterial);
        core.position.set(0, 50, 150); 
        anchorGroup.add(core);
        animatedObjects.cores.push({ mesh: core, speedX: Math.random() * 0.05, speedY: Math.random() * 0.05 });

        // 5. Containment Rings
        for(let r=0; r<3; r++) {
            const ringGeo = new THREE.TorusGeometry(45 + r*15, 3, 16, 64);
            const ring = new THREE.Mesh(ringGeo, r === 1 ? ultraChrome : steel);
            ring.position.set(0, 50, 150);
            anchorGroup.add(ring);
            animatedObjects.rotatingRings.push({ mesh: ring, axis: r === 0 ? 'x' : r === 1 ? 'y' : 'z', speed: 0.02 + r * 0.01 });
        }

        // 6. Emitter Array
        const emitterGeo = new THREE.ConeGeometry(30, 80, 16, 4, true);
        const emitter = new THREE.Mesh(emitterGeo, darkSteel);
        emitter.position.set(0, 50, 250);
        emitter.rotation.x = Math.PI / 2;
        anchorGroup.add(emitter);

        const lensGeo = new THREE.SphereGeometry(15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const lens = new THREE.Mesh(lensGeo, tinted);
        lens.position.set(0, 50, 290);
        lens.rotation.x = Math.PI / 2;
        anchorGroup.add(lens);

        // 7. Higgs Stabilizing Beam
        const beamGeo = new THREE.CylinderGeometry(5, 20, 1000, 32, 1, true);
        const beam = new THREE.Mesh(beamGeo, higgsBeamMaterial);
        beam.position.set(0, 50, 790); // Centered between emitter (290) and wall (~1290)
        beam.rotation.x = Math.PI / 2;
        anchorGroup.add(beam);
        animatedObjects.beams.push({ mesh: beam, baseScale: 1.0 });

        // 8. Energy Conduits (Tubes)
        for(let c=0; c<6; c++) {
            const curve = generateHydraulicSpline(
                (Math.random()-0.5)*100, 0, -50,
                0, 50, 100,
                10
            );
            const tubeGeo = new THREE.TubeGeometry(curve, 20, 3, 8, false);
            const tube = new THREE.Mesh(tubeGeo, hazardOrange);
            anchorGroup.add(tube);
        }

        // Add to main group and animation registry
        group.add(anchorGroup);
        animatedObjects.anchors.push({ 
            group: anchorGroup, 
            basePos: new THREE.Vector3(x, 0, z),
            intensity: Math.random() * Math.PI * 2 
        });
    }

    // ==========================================
    // CENTRAL CONTROL & COMMAND SPHERE
    // ==========================================
    const commandGroup = new THREE.Group();
    commandGroup.position.set(0, 200, 0);

    // Giant geodesic dome
    const domeGeo = new THREE.IcosahedronGeometry(150, 3);
    const dome = new THREE.Mesh(domeGeo, glass);
    commandGroup.add(dome);
    
    const domeWireframe = new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true}));
    commandGroup.add(domeWireframe);

    // Inner supercomputer spire
    const spireGeo = new THREE.CylinderGeometry(20, 40, 280, 8);
    const spire = new THREE.Mesh(spireGeo, steel);
    commandGroup.add(spire);

    // Holographic rings around spire
    for(let h=0; h<5; h++) {
        const holoGeo = new THREE.RingGeometry(50 + h*15, 52 + h*15, 32);
        const holo = new THREE.Mesh(holoGeo, intenseGlow);
        holo.rotation.x = Math.PI / 2;
        holo.position.y = -100 + h * 50;
        commandGroup.add(holo);
        animatedObjects.rotatingRings.push({ mesh: holo, axis: 'y', speed: (h%2===0?1:-1)*0.03 });
    }

    // Cabins / Operator Stations inside dome
    for(let c=0; c<6; c++) {
        const cabinAngle = (c / 6) * Math.PI * 2;
        const cabinGroup = new THREE.Group();
        cabinGroup.position.set(Math.cos(cabinAngle)*80, 0, Math.sin(cabinAngle)*80);
        cabinGroup.lookAt(0,0,0);

        const chairGeo = new THREE.BoxGeometry(10, 15, 10);
        const chair = new THREE.Mesh(chairGeo, rubber);
        chair.position.y = -20;
        cabinGroup.add(chair);

        const panelGeo = new THREE.BoxGeometry(20, 10, 5);
        const panel = new THREE.Mesh(panelGeo, darkSteel);
        panel.position.set(0, -10, -15);
        cabinGroup.add(panel);

        const screenGeo = new THREE.PlaneGeometry(18, 8);
        const screen = new THREE.Mesh(screenGeo, higgsBeamMaterial);
        screen.position.set(0, -5, -14);
        screen.rotation.x = Math.PI/4;
        cabinGroup.add(screen);

        commandGroup.add(cabinGroup);
    }

    group.add(commandGroup);

    // ==========================================
    // MASSIVE ENERGY PIPELINES CONNECTING ANCHORS TO CORE
    // ==========================================
    for (let i = 0; i < numAnchors; i++) {
        const angle = (i / numAnchors) * Math.PI * 2;
        const startX = Math.cos(angle) * anchorRadius;
        const startZ = Math.sin(angle) * anchorRadius;

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(startX, 10, startZ),
            new THREE.Vector3(startX * 0.7, 50, startZ * 0.7),
            new THREE.Vector3(startX * 0.3, 180, startZ * 0.3),
            new THREE.Vector3(0, 200, 0)
        ]);

        const pipeGeo = new THREE.TubeGeometry(curve, 32, 8, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        group.add(pipe);

        const pulseGeo = new THREE.SphereGeometry(12, 16, 16);
        const pulse = new THREE.Mesh(pulseGeo, intenseGlow);
        group.add(pulse);
        animatedObjects.energyPulses.push({ mesh: pulse, curve: curve, progress: Math.random() });
    }

    // ==========================================
    // ENVIRONMENTAL DETAILS (Rubble, Particles, Support Struts)
    // ==========================================
    // Massive support struts angled into the ground
    for(let i=0; i<numAnchors*2; i++) {
        const angle = (i / (numAnchors*2)) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(15, 25, 400, 8);
        const strut = new THREE.Mesh(strutGeo, darkSteel);
        
        const dist = anchorRadius + 100;
        strut.position.set(Math.cos(angle)*dist, -100, Math.sin(angle)*dist);
        strut.lookAt(Math.cos(angle)*(dist-200), 200, Math.sin(angle)*(dist-200));
        strut.rotation.x += Math.PI/2;
        
        group.add(strut);
    }


    // ==========================================
    // MACHINE EXPORT DATA (PARTS, DESC, QUIZ)
    // ==========================================

    const description = `The God-Tier Vacuum Decay Neutralizer.
A frantic, colossal feat of omniversal engineering designed to combat a localized collapse of the false vacuum. 
When the Higgs field potential is perturbed beyond the metastable barrier, a bubble of true vacuum begins to expand outwards at the speed of light, annihilating all fundamental particles, binding energies, and natural laws. 
This machine utilizes an array of 12 Massive Reality Anchors. These anchors tap into the zero-point energy of a captured microscopic singularity to project localized, artificially modified Higgs field parameters, creating a topological defect that violently pushes back against the encroaching void wall. 
The visual result is a terrifying cosmic stalemate: the absolute black of the void, screaming with Cherenkov-like radiation at its boundaries, locked in a brutal contest with intensely glowing streams of stabilizing energy. Operators sit inside a geodesic diamond dome, monitoring spacetime integrity while bathed in blinding hazard lights.`;

    const parts = [
        {
            name: "True Void Instanced Mesh Core",
            description: "A mathematically pure representation of the encroaching true vacuum bubble. Contains 6400 distinct geometric units recalculating spatial dimensions constantly.",
            material: "Absolute Zero Point Void Material (Zero Albedo)",
            function: "Simulates the expansion of the false vacuum collapse.",
            assemblyOrder: 1,
            connections: ["Reality Anchor Beams", "Spacetime Fabric"],
            failureEffect: "Complete annihilation of the local universe and all connected timelines.",
            cascadeFailures: ["Reality Anchors", "Observer Intactness"],
            originalPosition: { x: 0, y: 0, z: 1200 },
            explodedPosition: { x: 0, y: 0, z: 3000 }
        },
        {
            name: "Void Edge Singularity Ribbon",
            description: "The boundary layer where our physics is violently rewritten. Emits intense, unnatural purple/magenta radiation as matter is instantly decoupled from the Higgs field.",
            material: "Hyper-Emissive Cherenkov Plasma",
            function: "Visualizes the leading wave of the vacuum decay.",
            assemblyOrder: 2,
            connections: ["True Void Instanced Mesh Core"],
            failureEffect: "Loss of boundary telemetry.",
            cascadeFailures: ["Higgs Beam Targeting"],
            originalPosition: { x: 0, y: 0, z: 1190 },
            explodedPosition: { x: 0, y: 0, z: 2800 }
        },
        {
            name: "Central Hex-Diamond Geodesic Dome",
            description: "A 300-meter wide command sphere made of compressed diamond and phase-shifted glass, protecting the PhD operators from the sheer radiation of reality maintenance.",
            material: "Phase-Shifted Glass & Steel Wireframe",
            function: "Houses the supercomputer spire and organic operators.",
            assemblyOrder: 3,
            connections: ["Supercomputer Spire", "Primary Base Platform"],
            failureEffect: "Immediate vaporization of all operators; loss of manual quantum-tuning.",
            cascadeFailures: ["Supercomputer Spire"],
            originalPosition: { x: 0, y: 200, z: 0 },
            explodedPosition: { x: 0, y: 800, z: 0 }
        },
        {
            name: "Supercomputer Spire (The Oracle)",
            description: "A massive cylindrical mainframe that calculates the billions of continuous adjustments needed to the Higgs stabilizing beams to match the chaotic fluctuations of the void wall.",
            material: "Dark Steel & Ultra Chrome",
            function: "Calculates topology corrections for the Reality Anchors.",
            assemblyOrder: 4,
            connections: ["Holographic Data Rings", "Energy Pipelines"],
            failureEffect: "Beams desynchronize, void wall breaches containment in 0.0004 seconds.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 200, z: 0 },
            explodedPosition: { x: 0, y: 1000, z: 0 }
        },
        {
            name: "Holographic Data Rings",
            description: "Five intensely glowing rings of pure photon-trapped logic, displaying the current state of the Standard Model coupling constants.",
            material: "Intense Glow Photonic Construct",
            function: "UI for operators, acts as a heat sink for computation.",
            assemblyOrder: 5,
            connections: ["Supercomputer Spire"],
            failureEffect: "Operator blindness, minor thermal buildup.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 200, z: 0 },
            explodedPosition: { x: 0, y: 600, z: 500 }
        },
        {
            name: "Primary Base Platform",
            description: "A colossal dark steel cylinder, 1.4 kilometers across, housing the subterranean antimatter reactors that power the facility.",
            material: "Dark Steel",
            function: "Foundation for all Reality Anchors and Command Sphere.",
            assemblyOrder: 6,
            connections: ["Reality Anchors", "Support Struts"],
            failureEffect: "Catastrophic structural collapse; anchors lose alignment.",
            cascadeFailures: ["Reality Anchors", "Energy Pipelines"],
            originalPosition: { x: 0, y: -20, z: 0 },
            explodedPosition: { x: 0, y: -500, z: 0 }
        },
        {
            name: "Base Gear Arrays (x12)",
            description: "Massive 120-meter gears that physically rotate the entire reality anchor pylon to micro-target specific fractures in the vacuum.",
            material: "Steel",
            function: "Azimuth control for reality anchors.",
            assemblyOrder: 7,
            connections: ["Primary Pylons", "Primary Base Platform"],
            failureEffect: "Anchor stuck in fixed position; void wall leaks through undefended sectors.",
            cascadeFailures: ["True Void Instanced Mesh Core (breach)"],
            originalPosition: { x: 600, y: 10, z: 0 }, // Representative
            explodedPosition: { x: 1000, y: -100, z: 0 }
        },
        {
            name: "Primary Pylons (x12)",
            description: "Intricately lathed, 500-meter tall columns of dark steel containing the primary wave-guides for the Higgs field manipulation.",
            material: "Dark Steel",
            function: "Elevates and houses the quantum cores.",
            assemblyOrder: 8,
            connections: ["Base Gear Arrays", "Sub-Pylons & Hydraulics", "Quantum Cores"],
            failureEffect: "Wave-guide fracture; pylon violently detonates into plasma.",
            cascadeFailures: ["Quantum Cores", "Emitter Arrays"],
            originalPosition: { x: 600, y: 50, z: 0 }, // Representative
            explodedPosition: { x: 1200, y: 500, z: 0 }
        },
        {
            name: "Hydraulic Recoil Pistons (x48)",
            description: "Massive chrome cylinders that absorb the physical kickback of firing concentrated reality into a void. Without these, the pylons would snap instantly.",
            material: "Chrome & Steel",
            function: "Recoil dampening and physical stability.",
            assemblyOrder: 9,
            connections: ["Primary Pylons"],
            failureEffect: "Pylon decapitation due to kinetic stress.",
            cascadeFailures: ["Primary Pylons"],
            originalPosition: { x: 670, y: 50, z: 0 }, // Representative
            explodedPosition: { x: 1500, y: 200, z: 200 }
        },
        {
            name: "Quantum Cores (Torus Knots x12)",
            description: "Self-intersecting manifolds of exotic matter. They act as the seed point for the new physics being projected. Visually, they are glowing, twisting knots.",
            material: "Quantum Core Emissive Wireframe",
            function: "Generates the localized artificial Higgs field.",
            assemblyOrder: 10,
            connections: ["Containment Rings", "Primary Pylons"],
            failureEffect: "Core collapse; generates a localized black hole.",
            cascadeFailures: ["Containment Rings", "Primary Pylons"],
            originalPosition: { x: 600, y: 100, z: 150 }, // Representative
            explodedPosition: { x: 1500, y: 600, z: 500 }
        },
        {
            name: "Containment Rings (x36)",
            description: "Rapidly spinning toruses of ultra-chrome and steel that magnetically confine the quantum cores.",
            material: "Ultra Chrome & Steel",
            function: "Magnetic and gravitational confinement.",
            assemblyOrder: 11,
            connections: ["Quantum Cores"],
            failureEffect: "Core bleeds exotic radiation, mutating nearby matter.",
            cascadeFailures: ["Quantum Cores"],
            originalPosition: { x: 600, y: 100, z: 150 }, // Representative
            explodedPosition: { x: 1800, y: 700, z: 600 }
        },
        {
            name: "Emitter Arrays (Cones x12)",
            description: "Massive cones that focus the omni-directional field generated by the core into a directed beam.",
            material: "Dark Steel",
            function: "Focuses the artificial Higgs field.",
            assemblyOrder: 12,
            connections: ["Focusing Lenses", "Primary Pylons"],
            failureEffect: "Beam scatters, failing to penetrate the void wall.",
            cascadeFailures: ["True Void Instanced Mesh Core (breach)"],
            originalPosition: { x: 600, y: 100, z: 250 }, // Representative
            explodedPosition: { x: 1200, y: 800, z: 800 }
        },
        {
            name: "Focusing Lenses (x12)",
            description: "Perfect spheres of tinted glass engineered at the sub-atomic level to refract probability waves.",
            material: "Tinted Glass",
            function: "Final stage beam collimation.",
            assemblyOrder: 13,
            connections: ["Emitter Arrays"],
            failureEffect: "Beam deflection, potentially hitting other anchors.",
            cascadeFailures: ["Higgs Stabilizing Beams"],
            originalPosition: { x: 600, y: 100, z: 290 }, // Representative
            explodedPosition: { x: 1200, y: 900, z: 1000 }
        },
        {
            name: "Higgs Stabilizing Beams (x12)",
            description: "Intensely bright, pulsating cylinders of pure mathematical assertion. These beams are what actually push against the void wall, forcing it to halt its expansion.",
            material: "Hyper-Cyan Additive Plasma",
            function: "Counters the vacuum decay expansion.",
            assemblyOrder: 14,
            connections: ["Focusing Lenses", "True Void Instanced Mesh Core"],
            failureEffect: "The end of the universe.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 600, y: 100, z: 790 }, // Representative
            explodedPosition: { x: 600, y: 100, z: 2000 }
        },
        {
            name: "Energy Pipelines (x12)",
            description: "Thick, winding copper-shielded tubes carrying petawatts of energy from the central command reactor to the outer anchor pylons.",
            material: "Copper",
            function: "Power transmission.",
            assemblyOrder: 15,
            connections: ["Central Hex-Diamond Geodesic Dome", "Primary Pylons"],
            failureEffect: "Anchor powers down.",
            cascadeFailures: ["Higgs Stabilizing Beams"],
            originalPosition: { x: 300, y: 100, z: 150 }, // Representative
            explodedPosition: { x: 500, y: 400, z: 500 }
        },
        {
            name: "Energy Pulses",
            description: "Visible manifestations of power flowing through the pipelines, glowing brightly.",
            material: "Intense Glow",
            function: "Visual feedback of power throughput.",
            assemblyOrder: 16,
            connections: ["Energy Pipelines"],
            failureEffect: "None, purely diagnostic.",
            cascadeFailures: [],
            originalPosition: { x: 300, y: 100, z: 150 },
            explodedPosition: { x: 500, y: 400, z: 550 }
        },
        {
            name: "Operator Cabins (x6)",
            description: "Minimalist stations with a rubber chair and dark steel panels where operators input complex topological corrections.",
            material: "Rubber, Dark Steel, Cyan Screens",
            function: "Human-in-the-loop control interfaces.",
            assemblyOrder: 17,
            connections: ["Central Hex-Diamond Geodesic Dome"],
            failureEffect: "Loss of fine-tuning capability.",
            cascadeFailures: [],
            originalPosition: { x: 80, y: 200, z: 0 },
            explodedPosition: { x: 200, y: 400, z: 0 }
        },
        {
            name: "Hydraulic Lines (x72)",
            description: "Tangled masses of orange hazard tubes feeding cooling liquid and hydraulic pressure to the primary pylons.",
            material: "Hazard Orange",
            function: "Coolant and pressure routing.",
            assemblyOrder: 18,
            connections: ["Primary Pylons", "Hydraulic Recoil Pistons"],
            failureEffect: "Overheating, pylon seizure.",
            cascadeFailures: ["Primary Pylons"],
            originalPosition: { x: 600, y: 50, z: 50 },
            explodedPosition: { x: 1000, y: 200, z: 100 }
        },
        {
            name: "Massive Support Struts (x24)",
            description: "Thick cylindrical beams bracing the main platform against the immense gravitational shearing forces created by the anchors.",
            material: "Dark Steel",
            function: "Structural bracing.",
            assemblyOrder: 19,
            connections: ["Primary Base Platform", "Bedrock"],
            failureEffect: "Platform tilts, throwing off all beam alignments.",
            cascadeFailures: ["Primary Base Platform", "Higgs Stabilizing Beams"],
            originalPosition: { x: 800, y: -100, z: 0 },
            explodedPosition: { x: 1500, y: -300, z: 0 }
        },
        {
            name: "Platform Grating",
            description: "A massive wireframe ring acting as a walkable surface over the reactor heat vents.",
            material: "Wireframe Steel",
            function: "Maintenance access.",
            assemblyOrder: 20,
            connections: ["Primary Base Platform"],
            failureEffect: "Tripping hazard.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 1, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 0 }
        }
    ];

    const quizQuestions = [
        {
            question: "In the context of the Coleman-De Luccia instanton for false vacuum decay, the tunneling rate $\\Gamma / V$ is proportional to $A e^{-B/\\hbar}$. What exactly does the bounce action $B$ physically represent in the Euclidean path integral formalism?",
            options: [
                "The kinetic energy of the expanding bubble wall.",
                "The difference in Euclidean action between the O(4)-symmetric bounce solution and the homogeneous false vacuum background.",
                "The thermal entropy generated by the phase transition.",
                "The zero-point energy of the true vacuum state."
            ],
            correctAnswer: 1,
            explanation: "The bounce action $B = S_E[\\phi_{bounce}] - S_E[\\phi_{false}]$ represents the tunneling suppression factor. The Euclidean action is evaluated for the 'bounce' solution, which is a saddle point of the Euclidean action connecting the false vacuum to the true vacuum, minus the action of remaining in the false vacuum."
        },
        {
            question: "The stability of the Standard Model electroweak vacuum heavily depends on the running of the Higgs quartic coupling $\\lambda$. Why does a massive top quark tend to destabilize the vacuum at high energy scales?",
            options: [
                "The top quark decays into W bosons, which carry away Higgs field energy.",
                "The large top quark Yukawa coupling contributes a large negative term to the renormalization group beta function of $\\lambda$, driving it negative at high scales.",
                "Top quarks form a condensate that physically screens the Higgs mechanism.",
                "Top quarks generate gravitational waves that perturb the Higgs potential."
            ],
            correctAnswer: 1,
            explanation: "Fermions contribute negatively to the beta function of the scalar quartic coupling. Because the top quark has a very large Yukawa coupling ($y_t \\approx 1$), its one-loop contribution $-y_t^4$ dominates over the positive contributions from the Higgs self-coupling and gauge bosons at high energies, driving $\\lambda$ below zero and creating a deeper true vacuum."
        },
        {
            question: "If a true vacuum bubble nucleates and begins expanding, its wall velocity rapidly approaches $c$. In the rest frame of the expanding bubble wall, how does the incoming thermal plasma of the false vacuum interact with the wall dynamics?",
            options: [
                "It produces a friction force; particles crossing the wall gain mass (if the VEV is higher), transferring momentum and potentially leading to a terminal velocity.",
                "It accelerates the wall by providing thermal energy to the Higgs field.",
                "It perfectly reflects off the wall, doubling the expansion speed.",
                "It undergoes immediate Hawking radiation, shielding the wall."
            ],
            correctAnswer: 0,
            explanation: "As the wall expands, particles in the false vacuum plasma hit it. Because their masses depend on the Higgs VEV (which changes across the wall), they effectively experience a potential barrier. The transfer of momentum from reflected/transmitted particles acts as a friction force that can counter the pressure difference driving the expansion, sometimes resulting in a steady-state terminal velocity rather than runaway acceleration."
        },
        {
            question: "How do gravitational corrections (via general relativity) alter the probability of false vacuum decay, specifically if the false vacuum has a positive cosmological constant (de Sitter space)?",
            options: [
                "Gravity always completely stabilizes any false vacuum.",
                "The compact nature of Euclidean de Sitter space bounds the action, and the Gibbons-Hawking entropy enhances the tunneling rate compared to flat spacetime.",
                "The expansion of space stretches the bubble, preventing nucleation.",
                "Gravity has no effect on quantum tunneling rates."
            ],
            correctAnswer: 1,
            explanation: "In de Sitter space, the Euclidean continuation is a four-sphere (S^4) with finite volume. The action of the bounce is modified by the gravitational terms. The finite volume and the associated Gibbons-Hawking entropy of the cosmological horizon effectively 'heat up' the vacuum, enhancing the decay rate (acting similarly to thermal tunneling, or the Hawking-Moss instanton)."
        },
        {
            question: "When calculating the prefactor $A$ in the decay rate formula using the Callan-Coleman formalism, one must compute a ratio of functional determinants. During this process, what specific mathematical complication arises from the breaking of spacetime translation invariance by the localized bounce solution?",
            options: [
                "The appearance of negative energy tachyons.",
                "The emergence of four translational zero modes in the fluctuation operator, which must be carefully integrated out using collective coordinates to avoid a zero determinant.",
                "The renormalization of the speed of light.",
                "The spontaneous breaking of CP symmetry."
            ],
            correctAnswer: 1,
            explanation: "The bounce solution is localized in Euclidean spacetime, meaning it breaks the continuous translational symmetry of the background. Consequently, the fluctuation operator around the bounce has zero eigenvalues (zero modes) corresponding to translations of the bounce center. A naive determinant calculation would yield zero. These modes must be factored out and replaced by an integration over the collective coordinates (the position of the bounce), which contributes to the volume factor $V$ in $\\Gamma / V$."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    function animate(time, speed = 1, meshes) {
        animatedObjects.timeElapsed += 0.016 * speed; // roughly 60fps base
        const t = animatedObjects.timeElapsed;

        // 1. Shaking Reality Anchors & Beam Pulsing
        animatedObjects.anchors.forEach((anchorData, index) => {
            const anchor = anchorData.group;
            
            // Violent high-frequency shake (simulating immense strain)
            // The strain is higher the closer they are pointed to the void center
            const strain = 1.0 + Math.sin(t * 2 + index) * 0.5;
            const shakeX = (Math.random() - 0.5) * 2.0 * strain;
            const shakeY = (Math.random() - 0.5) * 2.0 * strain;
            const shakeZ = (Math.random() - 0.5) * 2.0 * strain;
            
            anchor.position.copy(anchorData.basePos);
            anchor.position.x += shakeX;
            anchor.position.y += shakeY;
            anchor.position.z += shakeZ;

            // Beams pulse wildly
            const beamData = animatedObjects.beams[index];
            if (beamData) {
                // The beam scales slightly on Z and X to look like it's surging
                const surge = 1.0 + Math.sin(t * 15 + index * 3) * 0.1;
                beamData.mesh.scale.set(surge, 1, surge);
                beamData.mesh.material.emissiveIntensity = 8.0 + Math.random() * 8.0;
            }
        });

        // 2. The Void Wall (Creeping, Undulating, Recalculating)
        if (animatedObjects.voidCubes && animatedObjects.voidEdges) {
            const mesh = animatedObjects.voidCubes.mesh;
            const edgeMesh = animatedObjects.voidEdges.mesh;
            const data = animatedObjects.voidCubes.data;

            // We update the instance matrices. The wall tries to creep forward (negative Z), 
            // but is pushed back by the beams.
            for (let i = 0; i < data.length; i++) {
                const cubeData = data[i];
                
                // Low frequency undulation
                const wave = Math.sin(t * cubeData.speed + cubeData.phase);
                
                // Wall creeping logic: The wall naturally moves towards Z=0, but bounces back
                // We simulate a chaotic stalemate boundary at around Z = 1200
                const zOffset = wave * 30 + Math.sin(t * 5 + i * 0.1) * 10;
                const scaleVariance = 1.0 + wave * 0.5;

                // Random jitter for the sheer violence of vacuum decay
                const jitterX = (Math.random() - 0.5) * 5;
                const jitterY = (Math.random() - 0.5) * 5;

                animatedObjects.dummy.position.set(
                    cubeData.x + jitterX, 
                    cubeData.y + jitterY, 
                    cubeData.z + zOffset
                );
                
                // Tumbling blocks
                animatedObjects.dummy.rotation.x += 0.02 * cubeData.speed;
                animatedObjects.dummy.rotation.y += 0.03 * cubeData.speed;
                animatedObjects.dummy.scale.set(scaleVariance, scaleVariance, scaleVariance);
                animatedObjects.dummy.updateMatrix();
                
                mesh.setMatrixAt(i, animatedObjects.dummy.matrix);

                // Edges pulse slightly larger
                animatedObjects.dummy.scale.set(scaleVariance * 1.15, scaleVariance * 1.15, scaleVariance * 1.15);
                animatedObjects.dummy.updateMatrix();
                edgeMesh.setMatrixAt(i, animatedObjects.dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
            edgeMesh.instanceMatrix.needsUpdate = true;
            
            // Pulse the void edge material
            voidEdgeMaterial.emissiveIntensity = 4.0 + Math.sin(t * 8) * 3.0;
        }

        // 3. Rotating Rings & Cores
        animatedObjects.rotatingRings.forEach(ring => {
            ring.mesh.rotation[ring.axis] += ring.speed * speed;
        });

        animatedObjects.cores.forEach(core => {
            core.mesh.rotation.x += core.speedX * speed;
            core.mesh.rotation.y += core.speedY * speed;
            // Cores throb
            const s = 1.0 + Math.sin(t * 10) * 0.1;
            core.mesh.scale.set(s, s, s);
        });

        // 4. Gears and Pistons
        animatedObjects.gears.forEach(gear => {
            gear.mesh.rotation.z += gear.speed * speed;
        });

        animatedObjects.pistons.forEach(piston => {
            // Pistons slam back and forth absorbing recoil
            const slam = Math.sin(t * 20 + piston.offset) * 20; // 20 units of travel
            piston.mesh.position.y = piston.baseY + slam;
        });

        // 5. Energy Pulses moving along tubes
        animatedObjects.energyPulses.forEach(pulse => {
            pulse.progress += 0.01 * speed;
            if (pulse.progress > 1) pulse.progress = 0;
            
            // Get position along CatmullRomCurve3
            const point = pulse.curve.getPointAt(pulse.progress);
            pulse.mesh.position.copy(point);
            
            // Glow intensity varies based on progress
            pulse.mesh.scale.setScalar(1.0 + Math.sin(pulse.progress * Math.PI) * 0.5);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
