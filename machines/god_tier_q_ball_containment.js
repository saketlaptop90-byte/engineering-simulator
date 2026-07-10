import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ============================================================================
    // ADVANCED MATERIAL DEFINITIONS
    // ============================================================================
    
    // Core Q-Ball Material: Iridescent, highly transmissive, glowing
    const qBallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x8822ff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.5,
        transmission: 0.95,
        thickness: 2.0,
        ior: 1.5,
        iridescence: 1.0,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 400],
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        side: THREE.DoubleSide
    });

    // Inner Vacuum Manifold Material
    const vacuumManifoldMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x004488,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        roughness: 0.2,
        metalness: 1.0
    });

    // Glowing Laser Beam Material
    const laserBeamMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // Glowing Hologram Material
    const hologramMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // High-tech Screen Material
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x2288ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    // Warning Light Material
    const warningLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4.0
    });

    // Custom Copper for Coils
    const coilCopper = copper.clone();
    coilCopper.roughness = 0.4;
    coilCopper.metalness = 0.9;

    // Custom Dark Steel for heavy machinery
    const heavySteel = darkSteel.clone();
    heavySteel.roughness = 0.7;
    heavySteel.metalness = 0.8;

    // ============================================================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRY GENERATION
    // ============================================================================

    function createPiston(radius, length, colorMatOuter, colorMatInner) {
        const pistonGroup = new THREE.Group();
        
        // Outer cylinder (housing)
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const outer = new THREE.Mesh(outerGeo, colorMatOuter);
        outer.position.y = length * 0.3;
        pistonGroup.add(outer);

        // Inner cylinder (rod)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length, 16);
        const inner = new THREE.Mesh(innerGeo, colorMatInner);
        inner.position.y = length * 0.5;
        pistonGroup.add(inner);

        // Details
        const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.2, 8, 16);
        const ring1 = new THREE.Mesh(ringGeo, colorMatOuter);
        ring1.rotation.x = Math.PI / 2;
        ring1.position.y = 0;
        outer.add(ring1);

        const ring2 = new THREE.Mesh(ringGeo, colorMatOuter);
        ring2.rotation.x = Math.PI / 2;
        ring2.position.y = length * 0.6;
        outer.add(ring2);

        return { group: pistonGroup, rod: inner, housing: outer };
    }

    function createLaserCannon() {
        const cannonGroup = new THREE.Group();
        
        // Base mount
        const mountGeo = new THREE.BoxGeometry(4, 2, 6);
        const mount = new THREE.Mesh(mountGeo, heavySteel);
        cannonGroup.add(mount);

        // Pivot sphere
        const pivotGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const pivot = new THREE.Mesh(pivotGeo, chrome);
        pivot.position.y = 2;
        mount.add(pivot);

        // Barrel assembly
        const barrelGroup = new THREE.Group();
        pivot.add(barrelGroup);

        const barrelGeo = new THREE.CylinderGeometry(1.5, 2, 12, 32);
        const barrel = new THREE.Mesh(barrelGeo, darkSteel);
        barrel.position.z = 6;
        barrel.rotation.x = Math.PI / 2;
        barrelGroup.add(barrel);

        // Cooling fins
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const finGeo = new THREE.BoxGeometry(0.2, 10, 1.5);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(Math.cos(angle) * 2.2, 0, 0);
            fin.rotation.y = -angle;
            barrel.add(fin);
        }

        // Focusing lenses
        const lensGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
        const lens1 = new THREE.Mesh(lensGeo, glass);
        lens1.position.y = 5.5;
        barrel.add(lens1);
        
        const lens2 = new THREE.Mesh(lensGeo, glass);
        lens2.position.y = 6;
        barrel.add(lens2);

        // Energy beam
        const beamGeo = new THREE.CylinderGeometry(0.4, 0.4, 100, 16);
        beamGeo.translate(0, 50, 0);
        const beam = new THREE.Mesh(beamGeo, laserBeamMat);
        beam.position.y = 6.2;
        barrel.add(beam);

        // Power conduits on cannon
        for(let i=0; i<3; i++) {
            const pipeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -2, -2),
                new THREE.Vector3(Math.cos(i*2)*3, 2, 2),
                new THREE.Vector3(Math.cos(i*2)*2, 6, 0)
            ]), 20, 0.2, 8, false);
            const pipe = new THREE.Mesh(pipeGeo, copper);
            barrelGroup.add(pipe);
        }

        return { group: cannonGroup, pivot: pivot, beam: beam };
    }

    function createContainmentRing(radius, thickness, numCoils) {
        const ringGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(radius, thickness, 64, 128);
        const torus = new THREE.Mesh(torusGeo, chrome);
        ringGroup.add(torus);

        // Inner track
        const trackGeo = new THREE.TorusGeometry(radius - thickness * 0.5, thickness * 0.2, 16, 128);
        const track = new THREE.Mesh(trackGeo, darkSteel);
        ringGroup.add(track);

        const coils = [];
        const lights = [];

        for (let i = 0; i < numCoils; i++) {
            const angle = (i / numCoils) * Math.PI * 2;
            
            // Coil base
            const coilGeo = new THREE.CylinderGeometry(thickness * 1.5, thickness * 1.5, thickness * 3, 32);
            const coil = new THREE.Mesh(coilGeo, coilCopper);
            
            coil.position.x = Math.cos(angle) * radius;
            coil.position.y = Math.sin(angle) * radius;
            coil.rotation.z = angle;
            ringGroup.add(coil);
            coils.push(coil);

            // Coil ridges
            for(let j = 0; j < 5; j++) {
                const ridgeGeo = new THREE.TorusGeometry(thickness * 1.55, thickness * 0.1, 8, 32);
                const ridge = new THREE.Mesh(ridgeGeo, steel);
                ridge.rotation.x = Math.PI / 2;
                ridge.position.y = (j - 2) * (thickness * 0.4);
                coil.add(ridge);
            }

            // Status light on coil
            const lightGeo = new THREE.BoxGeometry(thickness, thickness * 0.5, thickness * 1.6);
            const light = new THREE.Mesh(lightGeo, screenMat.clone());
            light.position.x = thickness * 1.2;
            coil.add(light);
            lights.push(light);
        }

        return { group: ringGroup, coils: coils, lights: lights };
    }

    function createControlConsole() {
        const deskGroup = new THREE.Group();

        // Desk Base
        const baseGeo = new THREE.BoxGeometry(10, 4, 4);
        const deskBase = new THREE.Mesh(baseGeo, heavySteel);
        deskBase.position.y = 2;
        deskGroup.add(deskBase);

        // Angled Control Panel
        const panelGeo = new THREE.BoxGeometry(9, 0.5, 3);
        const panel = new THREE.Mesh(panelGeo, aluminum);
        panel.position.set(0, 4.2, 0.5);
        panel.rotation.x = -Math.PI / 6;
        deskGroup.add(panel);

        // Buttons and Keys
        for(let i=0; i<40; i++) {
            const btnGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const btnMat = (i%5===0) ? warningLightMat : new THREE.MeshStandardMaterial({color: 0x444444});
            const btn = new THREE.Mesh(btnGeo, btnMat);
            btn.position.set(-4 + (i%10)*0.8, 0.3, -1 + Math.floor(i/10)*0.6);
            panel.add(btn);
        }

        // Main Holographic Screen
        const screenGeo = new THREE.PlaneGeometry(8, 4);
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 7, -1);
        screen.rotation.x = Math.PI / 12;
        deskGroup.add(screen);

        // Side Monitors
        const sideScreenGeo = new THREE.PlaneGeometry(3, 4);
        
        const leftScreen = new THREE.Mesh(sideScreenGeo, screenMat);
        leftScreen.position.set(-5.5, 6.5, 0);
        leftScreen.rotation.y = Math.PI / 4;
        deskGroup.add(leftScreen);

        const rightScreen = new THREE.Mesh(sideScreenGeo, screenMat);
        rightScreen.position.set(5.5, 6.5, 0);
        rightScreen.rotation.y = -Math.PI / 4;
        deskGroup.add(rightScreen);

        // Chair
        const chairGroup = new THREE.Group();
        chairGroup.position.set(0, 0, 4);
        
        const seatGeo = new THREE.BoxGeometry(2, 0.5, 2);
        const seat = new THREE.Mesh(seatGeo, rubber);
        seat.position.y = 2;
        chairGroup.add(seat);
        
        const backGeo = new THREE.BoxGeometry(2, 3, 0.5);
        const back = new THREE.Mesh(backGeo, rubber);
        back.position.set(0, 3.5, 0.75);
        chairGroup.add(back);

        const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const leg = new THREE.Mesh(legGeo, chrome);
        leg.position.y = 1;
        chairGroup.add(leg);

        deskGroup.add(chairGroup);

        return deskGroup;
    }

    function createPipingNetwork(radius, height, numPipes) {
        const pipeGroup = new THREE.Group();
        for(let i=0; i<numPipes; i++) {
            const points = [];
            let currentPt = new THREE.Vector3(
                (Math.random() - 0.5) * radius * 2,
                (Math.random() - 0.5) * height,
                (Math.random() - 0.5) * radius * 2
            );
            points.push(currentPt);

            for(let j=0; j<5; j++) {
                const nextPt = currentPt.clone().add(new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ));
                // Constrain to radius
                if(nextPt.length() > radius) nextPt.normalize().multiplyScalar(radius);
                points.push(nextPt);
                currentPt = nextPt;
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const pipeGeo = new THREE.TubeGeometry(curve, 64, Math.random() * 0.5 + 0.2, 8, false);
            const pipeMat = Math.random() > 0.5 ? copper : steel;
            const pipe = new THREE.Mesh(pipeGeo, pipeMat);
            pipeGroup.add(pipe);
        }
        return pipeGroup;
    }

    // ============================================================================
    // PART GENERATION & ASSEMBLY
    // ============================================================================

    // 1. Q-Ball Core
    const qBallGroup = new THREE.Group();
    const qBallGeo = new THREE.IcosahedronGeometry(12, 16); // High poly for vertex displacement
    const qBallMesh = new THREE.Mesh(qBallGeo, qBallMaterial);
    qBallGroup.add(qBallMesh);

    // Save original vertices for animation
    const posAttr = qBallGeo.attributes.position;
    const originalVertices = [];
    for(let i = 0; i < posAttr.count; i++) {
        originalVertices.push(new THREE.Vector3().fromBufferAttribute(posAttr, i));
    }

    group.add(qBallGroup);
    parts.push({
        name: "Q_Ball_Quantum_Soliton",
        description: "A macroscopic non-topological soliton made of coherent scalar field condensate. Exhibits extreme mass-energy density.",
        material: "qBallMaterial (Custom Iridescent Transmissive)",
        function: "Maintains the localized false vacuum state. The primary subject of the facility's containment and extraction protocols.",
        assemblyOrder: 1,
        connections: ["Inner_Vacuum_Manifold", "Alpha_Containment_Ring"],
        failureEffect: "Catastrophic vacuum decay, triggering a phase transition that expands at the speed of light, erasing local physics.",
        cascadeFailures: ["Entire_Facility_Vaporization", "Local_Spacetime_Rupture", "Planetary_Annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 2. Inner Vacuum Manifold
    const manifoldGroup = new THREE.Group();
    const manifoldGeo = new THREE.DodecahedronGeometry(18, 2);
    const manifoldMesh = new THREE.Mesh(manifoldGeo, vacuumManifoldMat);
    manifoldGroup.add(manifoldMesh);
    
    // Add glowing nodes to vertices
    const nodeGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    const manifoldPos = manifoldGeo.attributes.position;
    for(let i=0; i<manifoldPos.count; i+=3) { // Skip some for performance/aesthetics
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.fromBufferAttribute(manifoldPos, i);
        manifoldMesh.add(node);
    }

    group.add(manifoldGroup);
    parts.push({
        name: "Inner_Vacuum_Manifold",
        description: "A polyhedral electromagnetic scaffold projecting the initial stabilizing gauge field.",
        material: "vacuumManifoldMat (Wireframe Energy Field)",
        function: "Provides the immediate geometric boundary condition to prevent the scalar field from evaporating via Hawking-like radiation.",
        assemblyOrder: 2,
        connections: ["Q_Ball_Quantum_Soliton", "Chronon_Particle_Accelerator_Ring"],
        failureEffect: "Slow evaporation of the Q-Ball, emitting lethal doses of high-energy gamma radiation.",
        cascadeFailures: ["Radiation_Shield_Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // 3, 4, 5. Containment Rings (Alpha, Beta, Gamma)
    const ringData = [
        { name: "Alpha_Containment_Ring", radius: 25, tube: 2, coils: 12, axis: 'x', exp: {x: 100, y: 0, z: 0}, color: 0xff0000 },
        { name: "Beta_Containment_Ring", radius: 32, tube: 2.5, coils: 16, axis: 'y', exp: {x: 0, y: 100, z: 0}, color: 0x00ff00 },
        { name: "Gamma_Containment_Ring", radius: 40, tube: 3, coils: 24, axis: 'z', exp: {x: 0, y: 0, z: 100}, color: 0x0000ff }
    ];

    const ringObjects = [];

    ringData.forEach((data, index) => {
        const ringSys = createContainmentRing(data.radius, data.tube, data.coils);
        ringSys.lights.forEach(l => l.material.emissive.setHex(data.color));
        
        group.add(ringSys.group);
        ringObjects.push(ringSys);

        parts.push({
            name: data.name,
            description: `Tier ${index+1} magnetic confinement ring. Integrates ${data.coils} superconducting electromagnets.`,
            material: "Chrome, Dark Steel, Copper",
            function: "Generates massive multi-axial magnetic fields to counteract the Q-Ball's repulsive gravitational forces.",
            assemblyOrder: 3 + index,
            connections: ["Main_Reactor_Base_Platform", "Superconducting_Cryo_Piping"],
            failureEffect: "Asymmetric magnetic pressure leading to Q-Ball wobble and structural shear.",
            cascadeFailures: ["Adjacent_Ring_Overload", "Base_Platform_Fracture"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: data.exp
        });
    });

    // 6 - 11. Laser Cooling Arrays
    const laserPositions = [
        { name: "Laser_Cooler_Array_North", pos: [0, 0, -60], rot: [0, 0, 0], exp: [0, 0, -100] },
        { name: "Laser_Cooler_Array_South", pos: [0, 0, 60], rot: [0, Math.PI, 0], exp: [0, 0, 100] },
        { name: "Laser_Cooler_Array_East", pos: [60, 0, 0], rot: [0, Math.PI/2, 0], exp: [100, 0, 0] },
        { name: "Laser_Cooler_Array_West", pos: [-60, 0, 0], rot: [0, -Math.PI/2, 0], exp: [-100, 0, 0] },
        { name: "Laser_Cooler_Array_Zenith", pos: [0, 60, 0], rot: [-Math.PI/2, 0, 0], exp: [0, 100, 0] },
        { name: "Laser_Cooler_Array_Nadir", pos: [0, -60, 0], rot: [Math.PI/2, 0, 0], exp: [0, -100, 0] }
    ];

    const lasers = [];

    laserPositions.forEach((lData, index) => {
        const cannonSys = createLaserCannon();
        cannonSys.group.position.set(...lData.pos);
        
        // Point the mount correctly based on rotation
        cannonSys.group.rotation.set(...lData.rot);
        
        // Point the pivot towards center (0,0,0)
        cannonSys.pivot.lookAt(new THREE.Vector3(0,0,0));

        group.add(cannonSys.group);
        lasers.push(cannonSys);

        parts.push({
            name: lData.name,
            description: "Ultra-high intensity chronon-beam emitter.",
            material: "Heavy Steel, Chrome, Glass, Emissive Beam",
            function: "Bombards the Q-Ball surface with phase-shifted chronon particles to achieve near absolute-zero localized thermal states, preventing boiling of the vacuum.",
            assemblyOrder: 6 + index,
            connections: ["Main_Power_Conduit_Bundle"],
            failureEffect: "Localized thermal spikes on the Q-Ball surface.",
            cascadeFailures: ["Vacuum_Boiling", "Containment_Breach"],
            originalPosition: { x: lData.pos[0], y: lData.pos[1], z: lData.pos[2] },
            explodedPosition: { x: lData.exp[0], y: lData.exp[1], z: lData.exp[2] }
        });
    });

    // 12. Main Reactor Base Platform
    const baseGroup = new THREE.Group();
    
    // Core cylinder
    const baseGeo1 = new THREE.CylinderGeometry(80, 90, 20, 32);
    const baseMesh1 = new THREE.Mesh(baseGeo1, heavySteel);
    baseMesh1.position.y = -80;
    baseGroup.add(baseMesh1);

    // Inner stepped cylinder
    const baseGeo2 = new THREE.CylinderGeometry(60, 70, 15, 32);
    const baseMesh2 = new THREE.Mesh(baseGeo2, darkSteel);
    baseMesh2.position.y = -62.5;
    baseGroup.add(baseMesh2);

    // Hazard stripes around base
    const stripeGeo = new THREE.CylinderGeometry(90.1, 90.1, 5, 32);
    const stripeMat = new THREE.MeshStandardMaterial({color: 0xffcc00});
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = -80;
    baseGroup.add(stripeMesh);

    // Pylons connecting base to Nadir laser
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const pylonGeo = new THREE.CylinderGeometry(2, 4, 30, 16);
        const pylon = new THREE.Mesh(pylonGeo, steel);
        pylon.position.set(Math.cos(angle)*50, -47.5, Math.sin(angle)*50);
        pylon.rotation.x = Math.PI/6 * Math.cos(angle);
        pylon.rotation.z = Math.PI/6 * -Math.sin(angle);
        baseGroup.add(pylon);
    }

    group.add(baseGroup);
    parts.push({
        name: "Main_Reactor_Base_Platform",
        description: "Massive durasteel foundation anchoring the entire containment apparatus to the planetary crust.",
        material: "Heavy Steel, Dark Steel",
        function: "Provides structural integrity and houses the primary graviton dampeners.",
        assemblyOrder: 0,
        connections: ["Superconducting_Cryo_Piping", "Main_Power_Conduit_Bundle"],
        failureEffect: "Loss of structural alignment, causing immediate catastrophic shearing of containment fields.",
        cascadeFailures: ["Total_System_Collapse"],
        originalPosition: { x: 0, y: -80, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // 13. Observation Walkway Deck
    const deckGroup = new THREE.Group();
    const walkwayGeo = new THREE.TorusGeometry(85, 3, 16, 64);
    const walkway = new THREE.Mesh(walkwayGeo, steel);
    walkway.rotation.x = Math.PI / 2;
    walkway.position.y = -20;
    deckGroup.add(walkway);

    // Railings
    const railTopGeo = new THREE.TorusGeometry(82, 0.2, 8, 128);
    const railTop = new THREE.Mesh(railTopGeo, aluminum);
    railTop.rotation.x = Math.PI / 2;
    railTop.position.y = -16;
    deckGroup.add(railTop);

    for(let i=0; i<64; i++) {
        const angle = (i/64)*Math.PI*2;
        const postGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
        const post = new THREE.Mesh(postGeo, aluminum);
        post.position.set(Math.cos(angle)*82, -18, Math.sin(angle)*82);
        deckGroup.add(post);
    }

    group.add(deckGroup);
    parts.push({
        name: "Observation_Walkway_Deck",
        description: "Suspended personnel walkway providing a 360-degree view of the containment field.",
        material: "Steel, Aluminum",
        function: "Allows researchers and technicians to physically inspect the apparatus and operate localized diagnostic terminals.",
        assemblyOrder: 13,
        connections: ["Main_Reactor_Base_Platform", "Quantum_Diagnostics_Terminal_A"],
        failureEffect: "Personnel danger, falling hazards.",
        cascadeFailures: ["Loss_Of_Manual_Override_Capability"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // 14 & 15. Quantum Diagnostics Terminals A & B
    const terminalA = createControlConsole();
    terminalA.position.set(0, -17, 80);
    terminalA.rotation.y = Math.PI;
    group.add(terminalA);

    parts.push({
        name: "Quantum_Diagnostics_Terminal_A",
        description: "Primary user interface for monitoring Q-Ball harmonic frequencies.",
        material: "Steel, Aluminum, Glass, Emissive Screens",
        function: "Processes petabytes of telemetry from the Inner Vacuum Manifold.",
        assemblyOrder: 14,
        connections: ["Observation_Walkway_Deck"],
        failureEffect: "Loss of telemetry data, forcing automated systems to guess containment parameters.",
        cascadeFailures: ["Containment_Efficiency_Drop"],
        originalPosition: { x: 0, y: -17, z: 80 },
        explodedPosition: { x: 0, y: -17, z: 120 }
    });

    const terminalB = createControlConsole();
    terminalB.position.set(0, -17, -80);
    group.add(terminalB);

    parts.push({
        name: "Quantum_Diagnostics_Terminal_B",
        description: "Secondary user interface, dedicated to laser cooling array management.",
        material: "Steel, Aluminum, Glass, Emissive Screens",
        function: "Controls the phase-shift algorithms of the six primary chronon lasers.",
        assemblyOrder: 15,
        connections: ["Observation_Walkway_Deck"],
        failureEffect: "Inability to tune laser frequencies, leading to thermal buildup.",
        cascadeFailures: ["Laser_Cooler_Array_Overheating"],
        originalPosition: { x: 0, y: -17, z: -80 },
        explodedPosition: { x: 0, y: -17, z: -120 }
    });

    // 16. Superconducting Cryo Piping
    const pipingGroup = createPipingNetwork(70, 100, 30);
    group.add(pipingGroup);

    parts.push({
        name: "Superconducting_Cryo_Piping",
        description: "An intricate, chaotic web of high-pressure tubes carrying liquid helium-3 and exotic coolants.",
        material: "Copper, Steel",
        function: "Drains the immense heat generated by the electromagnetic coils in the containment rings.",
        assemblyOrder: 16,
        connections: ["Alpha_Containment_Ring", "Beta_Containment_Ring", "Gamma_Containment_Ring"],
        failureEffect: "Coolant leak causing immediate quenching of superconducting magnets.",
        cascadeFailures: ["Containment_Ring_Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 50 }
    });

    // 17. Chronon Particle Accelerator Ring
    const accelGroup = new THREE.Group();
    const accelGeo = new THREE.TorusGeometry(50, 4, 32, 128);
    const accelMesh = new THREE.Mesh(accelGeo, glass); // Transparent to show particles inside
    
    // Glowing inner core
    const accelCoreGeo = new THREE.TorusGeometry(50, 1.5, 16, 128);
    const accelCoreMesh = new THREE.Mesh(accelCoreGeo, laserBeamMat.clone());
    accelCoreMesh.material.color.setHex(0xff00ff);
    accelCoreMesh.material.emissive.setHex(0xff00ff);
    
    accelGroup.add(accelMesh);
    accelGroup.add(accelCoreMesh);
    accelGroup.position.y = 40;
    accelGroup.rotation.x = Math.PI / 2;

    group.add(accelGroup);

    parts.push({
        name: "Chronon_Particle_Accelerator_Ring",
        description: "A secondary high-velocity accelerator looping above the main containment zone.",
        material: "Glass, Emissive Plasma",
        function: "Accelerates chronon particles to .99c before feeding them into the Zenith and Nadir laser arrays.",
        assemblyOrder: 17,
        connections: ["Laser_Cooler_Array_Zenith", "Laser_Cooler_Array_Nadir"],
        failureEffect: "Stall in chronon supply, rendering top and bottom lasers ineffective.",
        cascadeFailures: ["Polar_Thermal_Spike"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 18 & 19. Vacuum Decay Inhibitor Nodes
    function createInhibitorNode() {
        const nodeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 16), darkSteel);
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 32), chrome);
        sphere.position.y = 8;
        
        const spikes = new THREE.Group();
        for(let i=0; i<12; i++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.5, 6, 8), copper);
            const phi = Math.acos( -1 + ( 2 * i ) / 12 );
            const theta = Math.sqrt( 12 * Math.PI ) * phi;
            spike.position.setFromSphericalCoords(6, phi, theta);
            spike.lookAt(new THREE.Vector3(0,8,0));
            spike.rotateX(Math.PI/2);
            spikes.add(spike);
        }
        sphere.add(spikes);
        
        nodeGroup.add(base);
        nodeGroup.add(sphere);
        return { group: nodeGroup, sphere: sphere };
    }

    const inhibitorNorth = createInhibitorNode();
    inhibitorNorth.group.position.set(40, -60, 40);
    group.add(inhibitorNorth.group);

    parts.push({
        name: "Vacuum_Decay_Inhibitor_Node_North",
        description: "A dense cluster of exotic matter spikes surrounding a chrome sphere.",
        material: "Dark Steel, Chrome, Copper",
        function: "Projects a localized probability dampening field to artificially lower the tunneling rate of the false vacuum.",
        assemblyOrder: 18,
        connections: ["Main_Reactor_Base_Platform"],
        failureEffect: "Increased probability of quantum tunneling events at the northern quadrant.",
        cascadeFailures: ["Micro_Spacetime_Fractures"],
        originalPosition: { x: 40, y: -60, z: 40 },
        explodedPosition: { x: 80, y: -60, z: 80 }
    });

    const inhibitorSouth = createInhibitorNode();
    inhibitorSouth.group.position.set(-40, -60, -40);
    group.add(inhibitorSouth.group);

    parts.push({
        name: "Vacuum_Decay_Inhibitor_Node_South",
        description: "Counterpart to the North node, maintaining field symmetry.",
        material: "Dark Steel, Chrome, Copper",
        function: "Projects a localized probability dampening field.",
        assemblyOrder: 19,
        connections: ["Main_Reactor_Base_Platform"],
        failureEffect: "Increased probability of quantum tunneling events at the southern quadrant.",
        cascadeFailures: ["Micro_Spacetime_Fractures"],
        originalPosition: { x: -40, y: -60, z: -40 },
        explodedPosition: { x: -80, y: -60, z: -80 }
    });

    // 20. Central Holographic Projector
    const holoProjectorGroup = new THREE.Group();
    const holoBase = new THREE.Mesh(new THREE.CylinderGeometry(10, 12, 4, 32), chrome);
    holoBase.position.y = -30;
    holoProjectorGroup.add(holoBase);

    // The hologram itself
    const holoGeo = new THREE.IcosahedronGeometry(8, 2);
    const holoMesh = new THREE.Mesh(holoGeo, hologramMat);
    holoMesh.position.y = -20;
    holoProjectorGroup.add(holoMesh);

    group.add(holoProjectorGroup);

    parts.push({
        name: "Central_Holographic_Projector",
        description: "Projects a real-time, scaled-down multidimensional representation of the Q-Ball's internal phase space.",
        material: "Chrome, Emissive Wireframe",
        function: "Allows visual heuristic analysis of the 11-dimensional Calabi-Yau manifold folding inside the soliton.",
        assemblyOrder: 20,
        connections: ["Main_Reactor_Base_Platform"],
        failureEffect: "Loss of visual heuristics.",
        cascadeFailures: ["None"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -60, z: 0 }
    });


    // ============================================================================
    // ANIMATION UPDATABLES REGISTRATION
    // ============================================================================

    // 1. Q-Ball Vertex Rippling and Pulsating
    updatables.push({
        update: (t, speed) => {
            qBallGroup.rotation.y += 0.005 * speed;
            qBallGroup.rotation.z += 0.002 * speed;
            
            // Pulsate emissive intensity
            qBallMaterial.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.3;

            // Complex vertex displacement using sine waves to simulate quantum fluctuations
            const positions = qBallGeo.attributes.position;
            for(let i = 0; i < posAttr.count; i++) {
                const orig = originalVertices[i];
                // Generate pseudo-random noise based on position and time
                const noise = Math.sin(orig.x * 0.5 + t * 3) * 
                              Math.cos(orig.y * 0.5 + t * 2) * 
                              Math.sin(orig.z * 0.5 + t * 4);
                
                // Scale vertex along its normal (which is just normalized position for a sphere)
                const normal = orig.clone().normalize();
                const displacement = normal.multiplyScalar(noise * 1.5); // Max 1.5 unit displacement
                
                positions.setXYZ(i, orig.x + displacement.x, orig.y + displacement.y, orig.z + displacement.z);
            }
            positions.needsUpdate = true;
            qBallGeo.computeVertexNormals();
        }
    });

    // 2. Inner Manifold Rotation
    updatables.push({
        update: (t, speed) => {
            manifoldGroup.rotation.x -= 0.01 * speed;
            manifoldGroup.rotation.y += 0.015 * speed;
            const manifoldMat = manifoldMesh.material;
            manifoldMat.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.2;
        }
    });

    // 3. Containment Rings multi-axis spinning
    updatables.push({
        update: (t, speed) => {
            // Alpha (X axis config, spin on Y and Z)
            ringObjects[0].group.rotation.y = t * 0.5 * speed;
            ringObjects[0].group.rotation.x = Math.sin(t * 0.2) * 0.2;

            // Beta
            ringObjects[1].group.rotation.z = -t * 0.3 * speed;
            ringObjects[1].group.rotation.x = Math.cos(t * 0.25) * 0.2;

            // Gamma
            ringObjects[2].group.rotation.x = t * 0.4 * speed;
            ringObjects[2].group.rotation.y = Math.sin(t * 0.15) * 0.2;
        }
    });

    // 4. Lasers Pulsing
    updatables.push({
        update: (t, speed) => {
            lasers.forEach((laser, index) => {
                // Modulate beam opacity and scale
                const pulse = Math.abs(Math.sin(t * 10 + index));
                laser.beam.scale.set(1 + pulse * 0.5, 1, 1 + pulse * 0.5);
                laser.beam.material.opacity = 0.6 + pulse * 0.4;
                
                // Slight jitter in mount to show immense power
                laser.group.position.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                ));
                // Snap back to original position to avoid drifting
                const orig = laserPositions[index].pos;
                laser.group.position.lerp(new THREE.Vector3(orig[0], orig[1], orig[2]), 0.5);
            });
        }
    });

    // 5. Hologram spinning and scaling
    updatables.push({
        update: (t, speed) => {
            holoMesh.rotation.y += 0.05 * speed;
            holoMesh.rotation.x += 0.03 * speed;
            const scale = 1 + Math.sin(t * 4) * 0.2;
            holoMesh.scale.set(scale, scale, scale);
        }
    });

    // 6. Chronon Accelerator Core flow
    updatables.push({
        update: (t, speed) => {
            accelGroup.rotation.z += 0.05 * speed;
            accelCoreMesh.material.emissiveIntensity = 2.0 + Math.sin(t * 20) * 1.0;
        }
    });


    // ============================================================================
    // METADATA & QUIZ
    // ============================================================================

    const description = "God-Tier Macroscopic Q-Ball Containment Facility. This monumental feat of engineering secures a false-vacuum soliton through intersecting non-abelian gauge fields and hyper-cooled chronon lasers. The facility maintains a delicate thermodynamic balance, preventing the Q-ball from decaying and initiating a catastrophic phase transition of the local universe.";

    const quizQuestions = [
        {
            question: "In the context of Coleman's Q-ball theory, what is the primary condition on the scalar field potential U(φ) that allows for the existence of non-topological solitons?",
            options: [
                "A) U(φ) must have a global minimum at φ = 0 and satisfy U(φ)/φ² < μ²/2 for some range of φ.",
                "B) U(φ) must have a degenerate vacuum state breaking a discrete symmetry.",
                "C) U(φ) must be strictly convex everywhere to preserve charge conservation.",
                "D) U(φ) must possess a topologically non-trivial mapping π3(S²)."
            ],
            correctAnswer: 0,
            explanation: "For a Q-ball to be stable, the energy per unit charge of the soliton must be less than the mass of the free scalar particles. This requires the potential to grow slower than φ² in some region, specifically U(φ)/φ² < μ²/2 where μ is the mass of the free particle."
        },
        {
            question: "Which symmetry MUST be conserved to ensure the absolute stability of a Q-ball against decay into free quanta?",
            options: [
                "A) A local non-abelian gauge symmetry.",
                "B) A global U(1) symmetry.",
                "C) Lorentz invariance.",
                "D) Supersymmetry (SUSY)."
            ],
            correctAnswer: 1,
            explanation: "Q-balls are non-topological solitons stabilized by a conserved Noether charge associated with a global U(1) symmetry. Without this conserved charge, the condensate would simply dissipate into the vacuum."
        },
        {
            question: "The false vacuum decay rate per unit volume in a first-order phase transition is governed by the bounce action B. How does the decay rate Γ/V scale in the semi-classical approximation?",
            options: [
                "A) Γ/V ∝ exp(-B)",
                "B) Γ/V ∝ B exp(-S_E)",
                "C) Γ/V ∝ exp(B²)",
                "D) Γ/V ∝ exp(-1/B)"
            ],
            correctAnswer: 0,
            explanation: "In semi-classical quantum field theory, the tunneling rate out of a metastable false vacuum is exponentially suppressed by the bounce action B, given by the classic formula Γ/V = A * exp(-B/ħ)."
        },
        {
            question: "In the Minimal Supersymmetric Standard Model (MSSM), flat directions in the scalar potential can lead to the formation of Q-balls in the early universe. What conserved charges do these specific Q-balls typically carry?",
            options: [
                "A) Electric charge and color charge only.",
                "B) Baryon number (B) and/or Lepton number (L).",
                "C) Weak isospin only.",
                "D) Magnetic monopole topological charge."
            ],
            correctAnswer: 1,
            explanation: "MSSM flat directions are typically parameterized by scalar combinations of squarks and sleptons, which carry Baryon and Lepton numbers. Condensates forming along these flat directions become B-balls or L-balls."
        },
        {
            question: "If a macroscopic Q-ball (B-ball) consisting of squarks enters a neutron star, what is the theoretical astrophysical consequence?",
            options: [
                "A) It will peacefully orbit the core due to dark matter interactions.",
                "B) It will rapidly absorb nucleons, converting them into scalar condensate and triggering a catastrophic collapse or supernova.",
                "C) It will become a magnetic monopole and neutralize the star's magnetic field.",
                "D) It will evaporate instantly due to Hawking radiation."
            ],
            correctAnswer: 1,
            explanation: "A B-ball inside a dense nucleon environment like a neutron star can absorb neutrons, lowering their energy state into the condensate. This highly exothermic process can rapidly consume the star from the inside out."
        }
    ];

    // ============================================================================
    // MAIN ANIMATION LOOP EXPORT
    // ============================================================================

    function animate(time, speed, meshes) {
        // time is continuous time, speed is a multiplier
        updatables.forEach(up => up.update(time, speed));
    }

    return { group, parts, description, quizQuestions, animate };
}
