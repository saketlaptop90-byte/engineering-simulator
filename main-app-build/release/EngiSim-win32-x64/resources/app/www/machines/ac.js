import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "Ultra God Tier Multi-Dimensional AC Generator (God Tier) - Tapping into parallel universes to extract absolute zero-point energy and generate theoretically infinite multi-dimensional alternating currents. Extremely dangerous, highly unstable, visually blinding.";

    // ============================================================================
    // HYPER-TECH CUSTOM MATERIALS
    // ============================================================================
    const quantumPlasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const hyperEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });

    const coreGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xaaaaff,
        emissiveIntensity: 15.0
    });

    const darkMatterMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.9,
        metalness: 0.8,
        emissive: 0x110022,
        emissiveIntensity: 0.5
    });

    const superConductorMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 1.0,
        roughness: 0.0,
        emissive: 0x003311,
        emissiveIntensity: 3.0
    });

    const hazardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffbb00,
        roughness: 0.5,
        metalness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    // ============================================================================
    // ANIMATION REGISTRY
    // ============================================================================
    const animatables = {
        fractalNodes: [],
        statorRings: [],
        arcs: [],
        pistons: [],
        wheels: [],
        gears: [],
        coolantFlows: [],
        dimensionalTethers: [],
        core: null
    };

    // ============================================================================
    // GENERATOR CONSTRUCTION - MASSIVE COMPLEXITY
    // ============================================================================

    // 1. MASSIVE BASE PLATFORM (Multi-tiered, heavily reinforced)
    const baseGroup = new THREE.Group();
    const baseWidth = 40;
    const baseLength = 60;
    
    // Main deck
    const deckGeo = new THREE.BoxGeometry(baseWidth, 2, baseLength, 20, 1, 30);
    // Deform deck slightly for realistic industrial feel
    const pos = deckGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > 0) pos.setY(i, y + Math.random() * 0.1);
    }
    deckGeo.computeVertexNormals();
    const deck = new THREE.Mesh(deckGeo, darkSteel);
    baseGroup.add(deck);
    parts.push({
        name: "Quantum Containment Deck",
        description: "Primary structural deck forged from collapsed dwarf star alloy.",
        material: "Dark Steel",
        function: "Supports the entire multi-dimensional assembly.",
        assemblyOrder: 1,
        connections: ["Hydraulic Supports", "Stator Arrays"],
        failureEffect: "Structural collapse leading to localized black hole creation.",
        cascadeFailures: ["Everything"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // Grating & Panel Lines
    for(let x = -baseWidth/2 + 2; x <= baseWidth/2 - 2; x += 4) {
        for(let z = -baseLength/2 + 2; z <= baseLength/2 - 2; z += 4) {
            const grateGeo = new THREE.PlaneGeometry(3.5, 3.5);
            const grate = new THREE.Mesh(grateGeo, steel);
            grate.rotation.x = -Math.PI / 2;
            grate.position.set(x, 1.05, z);
            baseGroup.add(grate);
        }
    }

    function createComplexLathe(segments, material, radiusMultiplier) {
        const points = [];
        for ( let i = 0; i <= 50; i ++ ) {
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * radiusMultiplier + 5, ( i - 5 ) * 2 ) );
        }
        const geometry = new THREE.LatheGeometry( points, segments );
        const lathe = new THREE.Mesh( geometry, material );
        return lathe;
    }


    // 2. EXTREME MOBILITY SYSTEM (Torus + Lugs + Spokes)
    function createComplexWheel(x, y, z) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);
        
        // Main Torus Tire
        const tireGeo = new THREE.TorusGeometry(4, 1.5, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded lugs
        const lugGeo = new THREE.BoxGeometry(3.2, 0.4, 0.8);
        for(let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(0, Math.cos(angle) * 5.2, Math.sin(angle) * 5.2);
            lug.rotation.x = -angle;
            wheelGroup.add(lug);
        }

        // Complex Rim Cylinder
        const rimGeo = new THREE.CylinderGeometry(3.5, 3.5, 3.4, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.2, 0.4, 7, 16);
        for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.x = angle;
            wheelGroup.add(spoke);
        }

        // Axle Hub
        const hubGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        animatables.wheels.push(wheelGroup);
        return wheelGroup;
    }

    const wheelPositions = [
        [-22, -3, -20], [-22, -3, -10], [-22, -3, 0], [-22, -3, 10], [-22, -3, 20],
        [ 22, -3, -20], [ 22, -3, -10], [ 22, -3, 0], [ 22, -3, 10], [ 22, -3, 20]
    ];
    wheelPositions.forEach((pos, idx) => {
        const w = createComplexWheel(pos[0], pos[1], pos[2]);
        group.add(w);
        parts.push({
            name: "Omni-Tread Wheel Array " + (idx + 1),
            description: "High-traction dimensional anchors shaped as wheels.",
            material: "Hyper-Rubber & Chrome",
            function: "Mobility across rugged 3D and 4D terrains.",
            assemblyOrder: 2 + idx,
            connections: ["Suspension Struts"],
            failureEffect: "Loss of mobility, localized gravity inversion.",
            cascadeFailures: [],
            originalPosition: {x: pos[0], y: pos[1], z: pos[2]},
            explodedPosition: {x: pos[0] * 1.5, y: pos[1] - 10, z: pos[2] * 1.5}
        });
    });

    // 3. HYDRAULIC SUSPENSION & PISTONS
    wheelPositions.forEach((pos) => {
        const susGroup = new THREE.Group();
        susGroup.position.set(pos[0] > 0 ? pos[0]-2 : pos[0]+2, pos[1] + 4, pos[2]);
        
        const outerPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6, 16), steel);
        const innerPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 16), chrome);
        innerPiston.position.y = -2;
        
        susGroup.add(outerPiston);
        susGroup.add(innerPiston);
        
        animatables.pistons.push({ outer: outerPiston, inner: innerPiston, baseY: -2, speed: Math.random() * 0.05 + 0.02 });
        baseGroup.add(susGroup);
    });

    // 4. THE MULTI-DIMENSIONAL ARMATURE (Fractal Structure)
    const armatureGroup = new THREE.Group();
    armatureGroup.position.set(0, 15, 0);
    
    function buildFractal(depth, size, parentGroup) {
        if (depth === 0) return;
        
        const tkGeo = new THREE.TorusKnotGeometry(size, size * 0.2, 128, 32, 2 + depth, 3 + depth);
        const tkMat = depth % 2 === 0 ? superConductorMaterial : quantumPlasmaMaterial;
        const tkMesh = new THREE.Mesh(tkGeo, tkMat);
        
        const nodeGroup = new THREE.Group();
        nodeGroup.add(tkMesh);
        parentGroup.add(nodeGroup);
        
        animatables.fractalNodes.push({ mesh: nodeGroup, depth: depth });

        const numChildren = 3;
        for (let i = 0; i < numChildren; i++) {
            const angle = (i / numChildren) * Math.PI * 2;
            const childGroup = new THREE.Group();
            childGroup.position.set(Math.cos(angle) * size * 1.5, Math.sin(angle) * size * 1.5, (Math.random() - 0.5) * size);
            nodeGroup.add(childGroup);
            buildFractal(depth - 1, size * 0.5, childGroup);
        }
    }
    
    buildFractal(4, 6, armatureGroup);
    baseGroup.add(armatureGroup);

    // Armature Core
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const coreMesh = new THREE.Mesh(coreGeo, coreGlowMaterial);
    armatureGroup.add(coreMesh);
    animatables.core = coreMesh;

    parts.push({
        name: "Fractal Quantum Armature",
        description: "Recursive non-Euclidean geometry functioning as the primary magnetic rotor.",
        material: "Superconductor & Quantum Plasma",
        function: "Spins through multiple spatial dimensions to induce trans-dimensional current.",
        assemblyOrder: 50,
        connections: ["Core Anchors", "Stator Field"],
        failureEffect: "Uncontrolled dimensional rift.",
        cascadeFailures: ["Complete Reality Dissolution"],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // 5. MAGNETIC STATOR ARRAYS (Massive concentric Lathe structures)
    const statorGroup = new THREE.Group();
    statorGroup.position.set(0, 15, 0);

    for (let s = 1; s <= 5; s++) {
        const radiusMultiplier = s * 2.5;
        const statorRing = createComplexLathe(64, darkMatterMaterial, radiusMultiplier);
        statorRing.rotation.x = Math.PI / 2;
        
        // Add copper coil windings
        const coilGeo = new THREE.TorusGeometry(radiusMultiplier + 5.5, 0.3, 16, 200);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        statorRing.add(coilMesh);

        // Add glowing energy nodes
        for(let n = 0; n < 12; n++) {
            const angle = (n/12) * Math.PI * 2;
            const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const node = new THREE.Mesh(nodeGeo, hyperEnergyMaterial);
            node.position.set(Math.cos(angle) * (radiusMultiplier + 5), Math.sin(angle) * (radiusMultiplier + 5), 0);
            statorRing.add(node);
        }

        statorGroup.add(statorRing);
        animatables.statorRings.push({ mesh: statorRing, speed: (s % 2 === 0 ? 1 : -1) * (0.01 * s) });

        parts.push({
            name: "Stator Array Ring " + s,
            description: "Lathe-turned dark matter housing millions of copper windings.",
            material: "Dark Matter & Copper",
            function: "Captures the fluctuating trans-dimensional magnetic fields.",
            assemblyOrder: 50 + s,
            connections: ["Base Deck", "Cooling System"],
            failureEffect: "Plasma leakage and localized melting.",
            cascadeFailures: ["Stator Array Ring " + (s+1)],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: 15, z: s * 15}
        });
    }
    baseGroup.add(statorGroup);

    // 6. BLINDING ARCS OF QUANTUM ELECTRICITY
    const numArcs = 20;
    for (let a = 0; a < numArcs; a++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5),
            new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.2, 8, false);
        const arcMesh = new THREE.Mesh(tubeGeo, hyperEnergyMaterial);
        armatureGroup.add(arcMesh);
        animatables.arcs.push({ mesh: arcMesh, curve: curve });
    }

    // 7. OPERATOR CABIN (Highly detailed with screens, joysticks, tinted glass)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 2, 25);
    
    const cabinBodyGeo = new THREE.BoxGeometry(10, 8, 8);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, steel);
    cabinGroup.add(cabinBody);
    
    // Tinted Glass Front
    const glassGeo = new THREE.BoxGeometry(9.5, 4, 0.5);
    const cabinGlass = new THREE.Mesh(glassGeo, tinted);
    cabinGlass.position.set(0, 1, 4);
    cabinGroup.add(cabinGlass);

    // Control Panels
    const panelGeo = new THREE.BoxGeometry(8, 2, 2);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, -2, 2);
    panel.rotation.x = -Math.PI / 6;
    cabinGroup.add(panel);

    // Screens
    const screenGeo = new THREE.PlaneGeometry(2, 1.2);
    for(let i = -3; i <= 3; i+=3) {
        const screen = new THREE.Mesh(screenGeo, quantumPlasmaMaterial);
        screen.position.set(i, -1.2, 2.5);
        screen.rotation.x = -Math.PI / 6;
        cabinGroup.add(screen);
    }

    // Joysticks
    const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const stickMat = new THREE.MeshStandardMaterial({color: 0x222222});
    const leftStick = new THREE.Mesh(stickGeo, stickMat);
    leftStick.position.set(-2, -1, 3);
    leftStick.rotation.x = Math.PI / 4;
    cabinGroup.add(leftStick);
    
    const rightStick = new THREE.Mesh(stickGeo, stickMat);
    rightStick.position.set(2, -1, 3);
    rightStick.rotation.x = Math.PI / 4;
    cabinGroup.add(rightStick);

    // Radar / Sensor dish on top
    const dishGeo = new THREE.ConeGeometry(2, 1, 16);
    const dish = new THREE.Mesh(dishGeo, plastic);
    dish.position.set(0, 4.5, 0);
    cabinGroup.add(dish);
    animatables.gears.push(dish);

    baseGroup.add(cabinGroup);

    parts.push({
        name: "Command Center Cabin",
        description: "Heavily shielded operator cabin with multi-spectral displays.",
        material: "Steel & Tinted Glass",
        function: "Manual override and monitoring of dimensional frequencies.",
        assemblyOrder: 100,
        connections: ["Main Deck", "Power Relays"],
        failureEffect: "Operator vaporized.",
        cascadeFailures: ["Loss of control"],
        originalPosition: {x: 0, y: 2, z: 25},
        explodedPosition: {x: 0, y: 20, z: 50}
    });

    // 8. COOLING TOWERS AND EXHAUST STACKS
    for (let t = -1; t <= 1; t+=2) {
        const towerGroup = new THREE.Group();
        towerGroup.position.set(t * 15, 8, -25);
        
        const towerGeo = new THREE.CylinderGeometry(3, 4, 16, 32);
        const tower = new THREE.Mesh(towerGeo, aluminum);
        towerGroup.add(tower);

        // Heat fins
        for (let y = -6; y <= 6; y+=1) {
            const finGeo = new THREE.TorusGeometry(3.8, 0.3, 8, 32);
            const fin = new THREE.Mesh(finGeo, copper);
            fin.position.y = y;
            towerGroup.add(fin);
        }

        // Exhaust particle emitters (Visualized as floating spheres)
        const exhaustNodes = [];
        for (let e = 0; e < 15; e++) {
            const smokeGeo = new THREE.SphereGeometry(Math.random() * 1.5 + 0.5, 8, 8);
            const smoke = new THREE.Mesh(smokeGeo, new THREE.MeshStandardMaterial({color: 0x444444, transparent: true, opacity: 0.6}));
            smoke.position.set(0, 8 + Math.random() * 10, (Math.random() - 0.5) * 2);
            towerGroup.add(smoke);
            exhaustNodes.push(smoke);
        }
        animatables.coolantFlows.push({ nodes: exhaustNodes, baseY: 8 });

        baseGroup.add(towerGroup);

        let sideName = t === -1 ? 'Left' : 'Right';
        parts.push({
            name: "Hyper-Cooling Tower " + sideName,
            description: "Liquid helium and dark-matter infused coolant cycler.",
            material: "Aluminum & Copper",
            function: "Prevents the core from melting through the planetary crust.",
            assemblyOrder: 70,
            connections: ["Base Deck", "Coolant Lines"],
            failureEffect: "Thermal runaway.",
            cascadeFailures: ["Core Meltdown"],
            originalPosition: {x: t * 15, y: 8, z: -25},
            explodedPosition: {x: t * 30, y: 8, z: -50}
        });
    }

    // 9. HYDRAULIC COOLANT LINES (Tubes wrapping the machine)
    const lineCurve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 2, -25),
        new THREE.Vector3(-18, 5, -15),
        new THREE.Vector3(-10, 10, 0),
        new THREE.Vector3(-5, 12, 10),
        new THREE.Vector3(0, 15, 0)
    ]);
    const lineGeo1 = new THREE.TubeGeometry(lineCurve1, 64, 0.6, 16, false);
    const line1 = new THREE.Mesh(lineGeo1, hazardMaterial);
    baseGroup.add(line1);

    const lineCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(15, 2, -25),
        new THREE.Vector3(18, 5, -15),
        new THREE.Vector3(10, 10, 0),
        new THREE.Vector3(5, 12, 10),
        new THREE.Vector3(0, 15, 0)
    ]);
    const lineGeo2 = new THREE.TubeGeometry(lineCurve2, 64, 0.6, 16, false);
    const line2 = new THREE.Mesh(lineGeo2, hazardMaterial);
    baseGroup.add(line2);

    parts.push({
        name: "Coolant Conduit Lines",
        description: "High-pressure reinforced tubing carrying sub-zero hyper-fluids.",
        material: "Hazard Poly-Alloy",
        function: "Routes coolant to the stator arrays.",
        assemblyOrder: 80,
        connections: ["Cooling Towers", "Stator Arrays"],
        failureEffect: "Coolant leak causing localized freezing to absolute zero.",
        cascadeFailures: ["Stator Array Overheating"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: -20}
    });

    group.add(baseGroup);

    // ============================================================================
    // PHD-LEVEL QUANTUM ELECTRODYNAMICS QUIZ
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of Schwinger pair production in a multi-dimensional false vacuum, how does the critical electric field scale with the effective dimensionality d of the compactified manifold?",
            options: [
                "E_c ∝ d",
                "E_c ∝ 1/d^2",
                "E_c ∝ exp(-d)",
                "E_c ∝ d^(1/2)"
            ],
            answer: 2,
            explanation: "The critical field scales exponentially with the inverse of the effective dimensions due to enhanced vacuum decay channels in non-compactified dimensions."
        },
        {
            question: "Considering a rotating quantum armature emitting gravitons, what is the expected shift in the Casimir energy density for a non-Abelian gauge field bounded by perfect chromo-electric conductors?",
            options: [
                "It diverges logarithmically.",
                "It shifts proportionally to the angular velocity squared, Ω^2.",
                "It becomes exactly zero due to topological cancellation.",
                "It shifts inversely to the fourth power of the distance, 1/a^4."
            ],
            answer: 1,
            explanation: "The rotation breaks time-reversal symmetry, inducing a shift proportional to Ω^2 in the vacuum expectation value of the stress-energy tensor."
        },
        {
            question: "How does the Aharonov-Bohm phase behave under a topology-altering phase transition of the U(1) gauge group in a spacetime undergoing dynamic compactification?",
            options: [
                "It remains a topological invariant regardless of compactification.",
                "It acquires a fractional statistical phase dependent on the new Betti numbers.",
                "It decays exponentially due to gauge field mass generation (Higgs mechanism).",
                "It oscillates wildly until wave-function collapse."
            ],
            answer: 1,
            explanation: "Dynamic compactification alters the topological invariants (Betti numbers) of the spacetime manifold, converting integer phases into fractional ones based on the homology group changes."
        },
        {
            question: "Evaluate the trace anomaly of the energy-momentum tensor in 11-dimensional supergravity when the generator's core induces a localized breakdown of diffeomorphism invariance.",
            options: [
                "T^μ_μ = 0 (Restored Weyl invariance).",
                "T^μ_μ = c * R^2 + a * Euler Density.",
                "T^μ_μ acquires anomalous dimension contributions from ghost fields.",
                "It manifests as a macroscopic cosmological constant term."
            ],
            answer: 2,
            explanation: "The breakdown of diffeomorphism invariance explicitly couples ghost fields to the physical spectrum, introducing non-zero anomalous dimensions to the trace of the stress-energy tensor."
        },
        {
            question: "If the alternating current frequency matches the Hawking radiation spectrum of a microscopic primordial black hole confined within the generator, what is the peak spectral radiance modification due to graybody factors?",
            options: [
                "The radiance is perfectly Planckian.",
                "Low-frequency modes are completely suppressed by the angular momentum barrier.",
                "High-frequency modes experience infinite blueshift.",
                "The graybody factor acts as a step function."
            ],
            answer: 1,
            explanation: "Graybody factors, acting as transmission coefficients through the black hole's effective potential, heavily suppress low-frequency modes, especially those with non-zero angular momentum, deviating from a perfect black body spectrum."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    function animate(time, speed, meshes) {
        const delta = speed * 0.05;
        
        // 1. Wheel Rotation (driving forward)
        animatables.wheels.forEach(wheel => {
            wheel.rotation.x -= delta * 0.5;
        });

        // 2. Hydraulic Suspension Pumping
        animatables.pistons.forEach(piston => {
            piston.inner.position.y = piston.baseY + Math.sin(time * 2 + piston.speed * 100) * 1.5;
        });

        // 3. Fractal Armature Rotation & Dimensional Phasing
        armatureGroup.rotation.y += delta;
        armatureGroup.rotation.z = Math.sin(time * 0.5) * 0.2;
        
        animatables.fractalNodes.forEach(node => {
            node.mesh.rotation.x += delta * (node.depth + 1) * 0.5;
            node.mesh.rotation.y += delta * (node.depth + 1) * 0.3;
            // Phasing in and out of 3D space (scaling)
            const scalePhase = 1 + Math.sin(time * 3 + node.depth) * 0.1;
            node.mesh.scale.set(scalePhase, scalePhase, scalePhase);
        });

        // 4. Stator Array Counter-Rotation
        animatables.statorRings.forEach(ring => {
            ring.mesh.rotation.y += ring.speed * speed * 2;
        });

        // 5. Core Pulsation
        if (animatables.core) {
            const pulse = 1 + Math.sin(time * 10) * 0.2;
            animatables.core.scale.set(pulse, pulse, pulse);
            coreGlowMaterial.emissiveIntensity = 10 + Math.sin(time * 20) * 5;
        }

        // 6. Blinding Arcs of Quantum Electricity (Dynamically updating spline tubes)
        animatables.arcs.forEach(arc => {
            // Randomly update the middle control point to simulate chaotic arcing
            if (Math.random() > 0.8) {
                arc.curve.points[1].x = Math.random() * 20 - 10;
                arc.curve.points[1].y = Math.random() * 20 - 10;
                arc.curve.points[1].z = Math.random() * 20 - 10;
                
                // End points anchor to stators and core randomly
                arc.curve.points[0].x = Math.sin(time * 5) * 5;
                arc.curve.points[2].x = Math.cos(time * 5) * 15;
                
                // Regenerate geometry
                arc.mesh.geometry.dispose();
                arc.mesh.geometry = new THREE.TubeGeometry(arc.curve, 20, Math.random() * 0.3 + 0.1, 8, false);
            }
            // Flash intensity
            arc.mesh.material.emissiveIntensity = Math.random() * 10 + 2;
        });

        // 7. Radar Dish Spin
        animatables.gears.forEach(gear => {
            gear.rotation.y += delta * 2;
        });

        // 8. Coolant Exhaust Particles
        animatables.coolantFlows.forEach(flow => {
            flow.nodes.forEach(node => {
                node.position.y += delta * 5;
                node.scale.multiplyScalar(0.95);
                node.material.opacity -= 0.02;
                
                if (node.position.y > flow.baseY + 15 || node.material.opacity <= 0) {
                    node.position.y = flow.baseY;
                    node.scale.set(1, 1, 1);
                    node.material.opacity = 0.6;
                    node.position.x = (Math.random() - 0.5) * 2;
                    node.position.z = (Math.random() - 0.5) * 2;
                }
            });
        });

        // 9. Base Vibration (Extreme Power Output)
        baseGroup.position.y = Math.sin(time * 50) * 0.05;
        baseGroup.position.x = Math.cos(time * 43) * 0.02;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAC() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
