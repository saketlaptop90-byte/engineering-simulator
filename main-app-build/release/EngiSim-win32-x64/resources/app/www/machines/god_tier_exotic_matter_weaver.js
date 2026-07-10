import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Exotic Matter Weaver (God Tier). An ultra high-tech, hyper-realistic, extremely complex crawler designed to weave threads of negative mass and tachyons into solid, impossible macroscopic structures. Utilizes relativistic kinematics, paradox containment fields, and quantum anti-gravity repulsors. The file size is massive, featuring thousands of individual vertices perfectly aligned for theoretical engineering simulation.";

    const quizQuestions = [
        {
            question: "In the context of the Alcubierre warp metric, what specific property of the stress-energy tensor is required by the Exotic Matter Weaver to maintain the paradox containment bubble?",
            options: [
                "A violation of the weak energy condition requiring negative energy density.",
                "A positive trace in the Ricci curvature tensor.",
                "Strict adherence to the dominant energy condition.",
                "Infinite localized baryon conservation."
            ],
            answer: 0,
            explanation: "The Weaver requires a localized violation of the weak energy condition (negative energy density) to manipulate the spacetime metric, allowing for the stable weaving of tachyons without infinite mass divergence."
        },
        {
            question: "When the Relativistic Weaving Arms manipulate tachyons, what happens to their momentum as their energy approaches zero, and what catastrophic containment failure does this machine prevent?",
            options: [
                "Momentum approaches infinity, causing catastrophic Cherenkov radiation and infinite structural stress.",
                "Momentum approaches zero, causing the tachyons to decay into standard model fermions.",
                "Momentum becomes imaginary, causing the loom to phase out of the observable universe.",
                "Momentum remains constant, but the spin reverses, causing localized time loops."
            ],
            answer: 0,
            explanation: "Tachyons exhibit the counter-intuitive property that as their energy decreases, their velocity and momentum increase toward infinity. The machine prevents the resulting runaway Cherenkov radiation using the Entanglement Stabilizers."
        },
        {
            question: "Negative mass exhibits 'runaway motion' when placed next to positive mass due to dipole acceleration. How does the Exotic Matter Weaver resolve this paradox during the extrusion process?",
            options: [
                "By inducing an oscillating tensor field that rapidly alternates inertial framing, locking the dipole via the quantum Zeno effect.",
                "By matching the negative mass with an equal amount of antimatter, annihilating the dipole.",
                "By placing a localized black hole between the masses to absorb the kinetic energy.",
                "By freezing the entire apparatus to absolute zero, halting all kinematic motion."
            ],
            answer: 0,
            explanation: "The dipole acceleration paradox dictates that positive and negative mass will perpetually accelerate together. The Weaver's tensor fields oscillate the local inertial frames at Planck frequencies, essentially 'freezing' the motion via the quantum Zeno effect."
        },
        {
            question: "What topological invariant is preserved when braiding non-Abelian anyons within the Infinity Spindle, allowing for fault-tolerant exotic macroscopic structures?",
            options: [
                "The knot invariant related to the Jones polynomial, shielding quantum information from local decoherence.",
                "The Euler characteristic of the local spacetime manifold.",
                "The Betti numbers of the woven exotic matter lattice.",
                "The Chern-Simons form in a 4D Calabi-Yau manifold."
            ],
            answer: 0,
            explanation: "Non-Abelian anyons have topological states that depend on their braiding history. The Weaver uses the Jones polynomial invariant to map these braids into physical structures, making the macroscopic material immune to local quantum decoherence."
        },
        {
            question: "If a cosmic string (a 1D topological defect) is introduced into the Primary Loom Harnesses, how does the machine mathematically compensate for the string's characteristic conical space-time deficit angle?",
            options: [
                "By dynamically extruding a counter-deficit scalar field that flattens the local manifold metric, restoring parallel transport.",
                "By increasing the tension on the loom until the string snaps.",
                "By wrapping the string around a microscopic wormhole to hide the deficit angle.",
                "By radiating away the deficit energy as gravitational waves."
            ],
            answer: 0,
            explanation: "A cosmic string creates a conical singularity with a deficit angle, disrupting parallel transport. The Weaver's Harnesses generate a scalar field with negative curvature that exactly cancels this deficit, flattening the local spacetime metric so normal geometry applies."
        }
    ];

    // Object to track meshes for extreme animation logic
    const animMeshes = {
        wheels: [],
        arms: [],
        tachyonRings: [],
        plasmaCores: [],
        spindle: null,
        matter: null,
        threads: [],
        repulsors: [],
        pistons: [],
        stabilizerGlows: []
    };

    // ============================================================================
    // CUSTOM SHADERS & MATERIALS
    // ============================================================================
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.95
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 4.0,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: true
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        roughness: 0.4,
        metalness: 0.5
    });

    const negativeMassMat = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        emissive: 0x1a0033,
        emissiveIntensity: 0.8,
        metalness: 1.0,
        roughness: 0.0,
        clearcoat: 1.0,
        transmission: 0.9,
        ior: 1.1,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });

    const exoticThreadMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // ============================================================================
    // UTILITY BUILDER FUNCTIONS
    // ============================================================================
    function createRivet() {
        const geom = new THREE.CylinderGeometry(0.1, 0.12, 0.1, 8);
        return new THREE.Mesh(geom, chrome);
    }

    function createPiston(length, radius) {
        const pGroup = new THREE.Group();
        
        // Outer Cylinder
        const outerGeom = new THREE.CylinderGeometry(radius, radius, length/2, 24);
        outerGeom.translate(0, length/4, 0);
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        pGroup.add(outer);
        
        // Inner Rod
        const innerGeom = new THREE.CylinderGeometry(radius*0.6, radius*0.6, length, 24);
        innerGeom.translate(0, length/2, 0);
        const inner = new THREE.Mesh(innerGeom, chrome);
        pGroup.add(inner);
        
        // Mounts
        const mountGeom = new THREE.SphereGeometry(radius*1.2, 16, 16);
        const baseMount = new THREE.Mesh(mountGeom, steel);
        pGroup.add(baseMount);
        
        const topMount = new THREE.Mesh(mountGeom, steel);
        topMount.position.y = length;
        inner.add(topMount);
        
        // Hydraulic lines on piston
        const pipeGeom = new THREE.CylinderGeometry(radius*0.1, radius*0.1, length/2.5, 8);
        pipeGeom.translate(radius*1.1, length/4, 0);
        const pipe = new THREE.Mesh(pipeGeom, copper);
        outer.add(pipe);

        return { group: pGroup, outer, inner, topMount };
    }

    // Generate a helical curve
    function generateHelix(radius, height, turns) {
        const points = [];
        const steps = 150;
        for(let i=0; i<=steps; i++) {
            const t = i / steps;
            const angle = t * Math.PI * 2 * turns;
            points.push(new THREE.Vector3(Math.cos(angle)*radius, t*height, Math.sin(angle)*radius));
        }
        return points;
    }

    // ============================================================================
    // PART 1: TITANIUM CHASSIS CORE
    // ==========================================
    const chassisGroup = new THREE.Group();
    
    // Main Hull Plate (Massive Scale)
    const mainHullGeom = new THREE.BoxGeometry(24, 2, 40);
    const mainHull = new THREE.Mesh(mainHullGeom, steel);
    chassisGroup.add(mainHull);
    
    // Secondary Armor Plating
    const armorGeom = new THREE.BoxGeometry(22, 0.5, 38);
    const armorPlate = new THREE.Mesh(armorGeom, darkSteel);
    armorPlate.position.set(0, 1.25, 0);
    chassisGroup.add(armorPlate);
    
    // Hexagonal Grid Underbelly
    for(let x = -10; x <= 10; x += 2.5) {
        for(let z = -18; z <= 18; z += 2.5) {
            const hex = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.5, 6), darkSteel);
            hex.position.set(x, -1.25, z);
            chassisGroup.add(hex);
            
            // Inner glowing node
            const node = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), neonBlue);
            node.position.set(x, -1.5, z);
            chassisGroup.add(node);
        }
    }
    
    // Perimeter Riveting
    for(let i = -19; i <= 19; i += 1) {
        const rivet1 = createRivet();
        rivet1.position.set(11.8, 1.5, i);
        chassisGroup.add(rivet1);
        
        const rivet2 = createRivet();
        rivet2.position.set(-11.8, 1.5, i);
        chassisGroup.add(rivet2);
    }

    parts.push({
        name: "Titanium Chassis Core",
        description: "The primary structural foundation of the Weaver, built from stabilized neutronium-alloyed titanium to withstand extreme gravitational shearing.",
        material: "Steel / Dark Steel / Neon Blue",
        function: "Provides a rigid inertial reference frame for the paradoxical weaving process.",
        assemblyOrder: 1,
        connections: ["Hydraulic Suspension Array", "Quantum Anti-Gravity Repulsor Array"],
        failureEffect: "Total structural collapse leading to a localized artificial black hole.",
        cascadeFailures: ["Relativistic Weaving Arms", "Exotic Matter Containment Chambers"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    chassisGroup.position.set(0, 5, 0);
    group.add(chassisGroup);

    // ==========================================
    // PART 2: QUANTUM ANTI-GRAVITY REPULSOR ARRAY
    // ==========================================
    const repulsorArrayGroup = new THREE.Group();
    
    for(let x=-8; x<=8; x+=16) {
        for(let z=-15; z<=15; z+=10) {
            const rep = new THREE.Group();
            
            const outer = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 2, 32), darkSteel);
            rep.add(outer);
            
            const inner = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.2, 32), chrome);
            rep.add(inner);
            
            const coilGeom = new THREE.TorusGeometry(1, 0.2, 16, 32);
            for(let c=0; c<3; c++) {
                const coil = new THREE.Mesh(coilGeom, copper);
                coil.position.y = -0.5 - (c*0.4);
                coil.rotation.x = Math.PI/2;
                rep.add(coil);
            }
            
            const glow = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), neonBlue);
            glow.position.y = -1.5;
            rep.add(glow);
            
            rep.position.set(x, -2, z);
            repulsorArrayGroup.add(rep);
            animMeshes.repulsors.push(glow);
        }
    }

    parts.push({
        name: "Quantum Anti-Gravity Repulsor Array",
        description: "Emits a repulsive tensor field to counteract the extreme localized gravity wells generated by the negative mass threads.",
        material: "Dark Steel / Chrome / Copper / Neon Blue",
        function: "Levitates the massive crawler chassis to prevent tectonic damage to the planetary crust.",
        assemblyOrder: 2,
        connections: ["Titanium Chassis Core"],
        failureEffect: "Immediate crustal piercing; the machine would sink to the planetary core.",
        cascadeFailures: ["Hydraulic Suspension Array"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });
    repulsorArrayGroup.position.set(0, 5, 0);
    group.add(repulsorArrayGroup);

    // ==========================================
    // PART 3 & 4: HYDRAULIC SUSPENSION & OMNI-DIRECTIONAL WHEELS
    // ==========================================
    const suspensionGroup = new THREE.Group();
    const wheelsGroup = new THREE.Group();
    
    const wheelPositions = [
        { x: 14, z: 15 }, { x: 14, z: 5 }, { x: 14, z: -5 }, { x: 14, z: -15 },
        { x: -14, z: 15 }, { x: -14, z: 5 }, { x: -14, z: -5 }, { x: -14, z: -15 }
    ];

    wheelPositions.forEach((pos, idx) => {
        const isRight = pos.x > 0;
        
        // --- Suspension Arm ---
        const armGroup = new THREE.Group();
        
        const armGeom = new THREE.BoxGeometry(6, 1.5, 2);
        armGeom.translate(isRight ? 3 : -3, 0, 0);
        const arm = new THREE.Mesh(armGeom, darkSteel);
        armGroup.add(arm);
        
        // Massive Piston connecting chassis to wheel axis
        const piston = createPiston(4, 0.8);
        piston.group.position.set(isRight ? 2 : -2, 0, 0);
        piston.group.rotation.z = isRight ? Math.PI/4 : -Math.PI/4;
        armGroup.add(piston.group);
        animMeshes.pistons.push(piston.inner);

        // Hydraulic Line wrapped on arm
        const linePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(isRight ? 2 : -2, 1.2, 0.5),
            new THREE.Vector3(isRight ? 4 : -4, 0.8, -0.5),
            new THREE.Vector3(isRight ? 6 : -6, 0, 0)
        ]);
        const lineGeom = new THREE.TubeGeometry(linePath, 32, 0.2, 8, false);
        const line = new THREE.Mesh(lineGeom, rubber);
        armGroup.add(line);
        
        armGroup.position.set(isRight ? 12 : -12, 5, pos.z);
        suspensionGroup.add(armGroup);
        
        // --- Wheel ---
        const wheelGroup = new THREE.Group();
        
        // Main tire body (Torus)
        const tireGeom = new THREE.TorusGeometry(3.5, 1.2, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs around the circumference
        const lugGeom = new THREE.BoxGeometry(2.8, 0.5, 0.8);
        for (let i = 0; i < 90; i++) {
            const lug = new THREE.Mesh(lugGeom, rubber);
            const angle = (i / 90) * Math.PI * 2;
            lug.position.set(0, Math.cos(angle) * 4.6, Math.sin(angle) * 4.6);
            lug.rotation.x = angle;
            wheelGroup.add(lug);
        }
        
        // Rim (CylinderGeometry)
        const rimGeom = new THREE.CylinderGeometry(3.2, 3.2, 2.5, 32);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Complex Spoke Arrays (24 spokes)
        const spokeGeom = new THREE.CylinderGeometry(0.15, 0.15, 6.4, 16);
        for (let i = 0; i < 24; i++) {
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.x = (i / 24) * Math.PI;
            wheelGroup.add(spoke);
            
            // Detail box on spoke
            const detailGeom = new THREE.BoxGeometry(0.4, 5.5, 0.4);
            const detail = new THREE.Mesh(detailGeom, chrome);
            detail.rotation.x = (i / 24) * Math.PI;
            wheelGroup.add(detail);
        }
        
        // Hub
        const hubGeom = new THREE.CylinderGeometry(1, 1, 3, 32);
        const hub = new THREE.Mesh(hubGeom, chrome);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);
        
        wheelGroup.position.set(pos.x > 0 ? pos.x + 3 : pos.x - 3, 0, pos.z);
        wheelsGroup.add(wheelGroup);
        animMeshes.wheels.push(wheelGroup);
    });

    parts.push({
        name: "Hydraulic Suspension Array",
        description: "Massive active-response hydraulic shock absorbers designed to dynamically adjust to micro-fluctuations in the local gravity field.",
        material: "Dark Steel / Chrome / Rubber",
        function: "Dampens kinetic resonance generated by tachyon impacts.",
        assemblyOrder: 3,
        connections: ["Titanium Chassis Core", "Omni-Directional Crawler Wheels"],
        failureEffect: "Harmonic resonance leading to localized chassis fracturing.",
        cascadeFailures: ["Central Infinity Spindle"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });
    group.add(suspensionGroup);

    parts.push({
        name: "Omni-Directional Crawler Wheels",
        description: "Massive hyper-dense Torus-geometry tires featuring hundreds of extruded BoxGeometry lugs for maximum off-road and anomalous terrain traction.",
        material: "Rubber / Dark Steel / Chrome / Steel",
        function: "Provides terrestrial locomotion and anchoring for the mobile loom.",
        assemblyOrder: 4,
        connections: ["Hydraulic Suspension Array"],
        failureEffect: "Loss of mobility, anchoring failure during high-tension weaves.",
        cascadeFailures: ["Quantum Anti-Gravity Repulsor Array"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 20 }
    });
    group.add(wheelsGroup);

    // ==========================================
    // PART 5: OPERATOR COMMAND CABIN
    // ==========================================
    const cabinGroup = new THREE.Group();
    
    // Base floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 8), darkSteel);
    cabinGroup.add(floor);
    
    // Custom shape for sci-fi tinted canopy
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(10, 0);
    shape.lineTo(8, 5);
    shape.lineTo(2, 5);
    shape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const canopyGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    canopyGeom.translate(-5, 0, -4);
    
    const canopy = new THREE.Mesh(canopyGeom, tinted);
    canopy.material.transparent = true;
    canopy.material.opacity = 0.6;
    cabinGroup.add(canopy);
    
    const frame = new THREE.Mesh(canopyGeom, new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true}));
    cabinGroup.add(frame);
    
    // Interior - Seat
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), darkSteel);
    seatBase.position.set(0, 0.75, -1.5);
    cabinGroup.add(seatBase);
    
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.5, 1.2), rubber);
    seatCushion.position.set(0, 2.5, -1.5);
    cabinGroup.add(seatCushion);
    
    // Control Panel Console
    const consoleGeom = new THREE.BoxGeometry(6, 1, 2);
    const consoleConsole = new THREE.Mesh(consoleGeom, aluminum);
    consoleConsole.position.set(0, 2, 1.5);
    consoleConsole.rotation.x = Math.PI / 6;
    cabinGroup.add(consoleConsole);
    
    // Glowing Screens (5 screens)
    for(let i=0; i<5; i++) {
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), neonBlue);
        screen.position.set(-2.6 + (i*1.3), 2.8, 1.8);
        screen.rotation.x = -Math.PI / 6;
        screen.rotation.y = Math.PI; // Face interior
        cabinGroup.add(screen);
    }
    
    // Joysticks
    const stickGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const lStick = new THREE.Mesh(stickGeom, steel);
    lStick.position.set(-1.5, 2.8, 1);
    lStick.rotation.x = Math.PI/4;
    cabinGroup.add(lStick);
    
    const rStick = new THREE.Mesh(stickGeom, steel);
    rStick.position.set(1.5, 2.8, 1);
    rStick.rotation.x = Math.PI/4;
    cabinGroup.add(rStick);
    
    // Steering Wheel
    const stWheel = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 16, 32), rubber);
    stWheel.position.set(0, 2.8, 1);
    stWheel.rotation.x = Math.PI/3;
    cabinGroup.add(stWheel);
    
    // Side Mirrors
    const mirrorGeom = new THREE.BoxGeometry(0.2, 1, 0.5);
    const lMirror = new THREE.Mesh(mirrorGeom, chrome);
    lMirror.position.set(-5.5, 2.5, -2);
    cabinGroup.add(lMirror);
    
    const rMirror = new THREE.Mesh(mirrorGeom, chrome);
    rMirror.position.set(5.5, 2.5, -2);
    cabinGroup.add(rMirror);

    parts.push({
        name: "Operator Command Cabin",
        description: "A biologically shielded nexus with tinted paradox-glass and glowing data readouts. Allows a PhD-level operator to oversee the weaving matrix.",
        material: "Tinted Glass / Dark Steel / Aluminum / Neon Blue",
        function: "Houses the operator and provides real-time telemetry on tachyon momentum variables.",
        assemblyOrder: 5,
        connections: ["Titanium Chassis Core"],
        failureEffect: "Operator is exposed to raw chronal radiation, resulting in spontaneous localized aging.",
        cascadeFailures: ["Control Nexus"],
        originalPosition: { x: 0, y: 7.5, z: -15 },
        explodedPosition: { x: 0, y: 15, z: -30 }
    });
    cabinGroup.position.set(0, 7.5, -15);
    group.add(cabinGroup);

    // ==========================================
    // PART 6: TACHYON ACCELERATION RINGS
    // ==========================================
    const ringsGroup = new THREE.Group();
    
    const ringBaseGeom = new THREE.TorusGeometry(12, 0.8, 64, 128);
    const ringGlowGeom = new THREE.TorusGeometry(12.2, 0.3, 32, 128);
    
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Group();
        
        const torus = new THREE.Mesh(ringBaseGeom, darkSteel);
        ring.add(torus);
        
        const glow = new THREE.Mesh(ringGlowGeom, neonBlue);
        ring.add(glow);
        
        // Structural Ribs
        for(let j=0; j<36; j++) {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.5), chrome);
            const angle = (j / 36) * Math.PI * 2;
            rib.position.set(Math.cos(angle)*12, Math.sin(angle)*12, 0);
            rib.rotation.z = angle;
            ring.add(rib);
        }
        
        ringsGroup.add(ring);
        animMeshes.tachyonRings.push(ring);
    }

    parts.push({
        name: "Tachyon Acceleration Rings",
        description: "Massive orthogonal torus geometries that spin at relativistic velocities to accelerate tachyons toward a zero-energy state.",
        material: "Dark Steel / Chrome / Neon Blue",
        function: "Creates the primary particle beam required for exotic matter synthesis.",
        assemblyOrder: 6,
        connections: ["Titanium Chassis Core", "Central Infinity Spindle"],
        failureEffect: "Tachyon beam scatters, causing widespread temporal de-synchronization.",
        cascadeFailures: ["Exotic Matter Containment Chambers"],
        originalPosition: { x: 0, y: 18, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });
    ringsGroup.position.set(0, 18, 0);
    group.add(ringsGroup);

    // ==========================================
    // PART 7: EXOTIC MATTER CONTAINMENT CHAMBERS
    // ==========================================
    const containmentGroup = new THREE.Group();
    
    const chamberPositions = [
        { x: -8, z: -8 }, { x: 8, z: -8 },
        { x: -8, z: 8 }, { x: 8, z: 8 }
    ];

    chamberPositions.forEach(pos => {
        const chamber = new THREE.Group();
        
        // Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 2, 32), darkSteel);
        base.position.y = 1;
        chamber.add(base);
        
        // Glass Vessel
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 8, 32), tinted);
        glass.position.y = 6;
        glass.material.transparent = true;
        glass.material.opacity = 0.5;
        chamber.add(glass);
        
        // Cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 32), darkSteel);
        cap.position.y = 10.5;
        chamber.add(cap);
        
        // Plasma Core (Icosahedron)
        const plasmaGeom = new THREE.IcosahedronGeometry(1.5, 2);
        const plasma = new THREE.Mesh(plasmaGeom, neonPurple);
        plasma.position.y = 6;
        chamber.add(plasma);
        animMeshes.plasmaCores.push(plasma);
        
        // Inner helical stabilizers
        const helixCurve = new THREE.CatmullRomCurve3(generateHelix(1.8, 8, 4));
        const helix = new THREE.Mesh(new THREE.TubeGeometry(helixCurve, 128, 0.1, 8, false), chrome);
        helix.position.y = 2;
        chamber.add(helix);
        
        chamber.position.set(pos.x, 6, pos.z);
        containmentGroup.add(chamber);
    });

    parts.push({
        name: "Exotic Matter Containment Chambers",
        description: "High-pressure paradox containment vessels utilizing helical stabilizers and tinted plasma glass.",
        material: "Tinted Glass / Dark Steel / Chrome / Neon Purple",
        function: "Stores raw negative mass and tachyons before threading into the loom.",
        assemblyOrder: 7,
        connections: ["Titanium Chassis Core", "Primary Loom Harnesses"],
        failureEffect: "Catastrophic release of negative mass, creating a runaway dipole acceleration event.",
        cascadeFailures: ["Central Infinity Spindle"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 10, z: -30 }
    });
    group.add(containmentGroup);

    // ==========================================
    // PART 8: RELATIVISTIC WEAVING ARMS
    // ==========================================
    const armsGroup = new THREE.Group();
    
    function createArm() {
        const armObj = new THREE.Group();
        
        // Base
        const baseGeom = new THREE.CylinderGeometry(1.5, 2, 2, 32);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        base.position.y = 1;
        armObj.add(base);
        
        // Shoulder Pivot
        const shoulder = new THREE.Group();
        shoulder.position.y = 2;
        armObj.add(shoulder);
        
        const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), steel);
        shoulder.add(shoulderJoint);
        
        // Upper Arm
        const upperArmGeom = new THREE.BoxGeometry(1.5, 8, 1.5);
        upperArmGeom.translate(0, 4, 0);
        const upperArm = new THREE.Mesh(upperArmGeom, aluminum);
        shoulder.add(upperArm);
        
        // Elbow Pivot
        const elbow = new THREE.Group();
        elbow.position.y = 8;
        shoulder.add(elbow);
        
        const elbowJoint = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2, 32), darkSteel);
        elbowJoint.rotation.z = Math.PI/2;
        elbow.add(elbowJoint);
        
        // Lower Arm
        const lowerArmGeom = new THREE.BoxGeometry(1.2, 7, 1.2);
        lowerArmGeom.translate(0, 3.5, 0);
        const lowerArm = new THREE.Mesh(lowerArmGeom, steel);
        elbow.add(lowerArm);
        
        // Hydraulic lines on arms
        const tubeGeom = new THREE.CylinderGeometry(0.1, 0.1, 7, 8);
        tubeGeom.translate(0.8, 3.5, 0);
        const tube1 = new THREE.Mesh(tubeGeom, copper);
        elbow.add(tube1);
        
        // Wrist Pivot
        const wrist = new THREE.Group();
        wrist.position.y = 7;
        elbow.add(wrist);
        
        const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), chrome);
        wrist.add(wristJoint);
        
        // Hand Base
        const handGeom = new THREE.BoxGeometry(2, 1, 2);
        handGeom.translate(0, 0.5, 0);
        const hand = new THREE.Mesh(handGeom, darkSteel);
        wrist.add(hand);
        
        // Fingers (3 fingers, 2 joints each)
        const fingersArr = [];
        const fingerAngles = [0, Math.PI*2/3, Math.PI*4/3];
        
        fingerAngles.forEach(ang => {
            const fGroup = new THREE.Group();
            
            const j1Geom = new THREE.BoxGeometry(0.4, 2, 0.4);
            j1Geom.translate(0, 1, 0);
            const j1 = new THREE.Mesh(j1Geom, aluminum);
            fGroup.add(j1);
            
            const j2Group = new THREE.Group();
            j2Group.position.y = 2;
            j1.add(j2Group);
            
            const j2Geom = new THREE.CylinderGeometry(0.1, 0.3, 1.5, 16);
            j2Geom.translate(0, 0.75, 0);
            const j2 = new THREE.Mesh(j2Geom, chrome);
            j2Group.add(j2);
            
            fGroup.position.set(Math.cos(ang)*0.8, 1, Math.sin(ang)*0.8);
            // lean outwards
            fGroup.rotation.x = Math.cos(ang) * 0.2;
            fGroup.rotation.z = Math.sin(ang) * 0.2;
            
            wrist.add(fGroup);
            fingersArr.push({ joint1: j1, joint2: j2Group });
        });
        
        return { group: armObj, shoulder, elbow, wrist, fingers: fingersArr };
    }

    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const arm = createArm();
        arm.group.position.set(Math.cos(angle)*7, 6.5, Math.sin(angle)*7);
        arm.group.rotation.y = -angle + Math.PI/2; 
        armsGroup.add(arm.group);
        animMeshes.arms.push(arm);
    }

    parts.push({
        name: "Relativistic Weaving Arms",
        description: "Eight massive multi-jointed manipulators that interlace the exotic matter threads at near-light speeds, preserving the Jones polynomial invariant.",
        material: "Dark Steel / Aluminum / Chrome / Copper",
        function: "The active mechanism of the loom, physically braiding the impossible threads.",
        assemblyOrder: 8,
        connections: ["Titanium Chassis Core", "Primary Loom Harnesses"],
        failureEffect: "Arms collide at relativistic speeds, causing local fusion detonations.",
        cascadeFailures: ["Central Infinity Spindle"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 20, z: 30 }
    });
    group.add(armsGroup);

    // ==========================================
    // PART 9 & 10: CENTRAL INFINITY SPINDLE & NEGATIVE MASS
    // ==========================================
    const loomGroup = new THREE.Group();
    
    // Base Ring
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(6, 0.8, 64, 128), steel);
    baseRing.rotation.x = Math.PI/2;
    baseRing.position.y = 7;
    loomGroup.add(baseRing);
    
    const spindleGroup = new THREE.Group();
    
    // Core Spindle
    const spindleCore = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 18, 64), chrome);
    spindleGroup.add(spindleCore);
    
    // Extruders facing the spindle
    for(let i=0; i<4; i++) {
        const ext = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 32), darkSteel);
        const angle = (i/4) * Math.PI*2;
        ext.position.set(Math.cos(angle)*4, 0, Math.sin(angle)*4);
        ext.rotation.x = Math.PI/2;
        ext.rotation.z = -angle;
        spindleGroup.add(ext);
    }
    
    // The Woven Exotic Matter (Complex TorusKnot)
    const matterGeom = new THREE.TorusKnotGeometry(3, 1.2, 256, 64, 5, 8);
    const matter = new THREE.Mesh(matterGeom, negativeMassMat);
    spindleGroup.add(matter);
    animMeshes.matter = matter;
    
    spindleGroup.position.y = 15;
    loomGroup.add(spindleGroup);
    animMeshes.spindle = spindleGroup;

    parts.push({
        name: "Central Infinity Spindle",
        description: "The core anchor of the Weaver, collecting the stabilized exotic matter structure. It rotates to maintain the topological deficits introduced by cosmic string weaving.",
        material: "Chrome / Steel",
        function: "Acts as the physical spool for the woven reality-altering material.",
        assemblyOrder: 9,
        connections: ["Titanium Chassis Core", "Negative Mass Extruders"],
        failureEffect: "The woven material unspools, dissolving the local reality manifold.",
        cascadeFailures: ["Every connected system"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });
    group.add(loomGroup);

    parts.push({
        name: "Negative Mass Extruders",
        description: "Precise conical nozzles that inject purified negative mass into the spindle matrix.",
        material: "Dark Steel",
        function: "Provides the repulsive framework required for the exotic material.",
        assemblyOrder: 10,
        connections: ["Central Infinity Spindle"],
        failureEffect: "Extruder clog, causing negative mass to build up and violently repel the machine apart.",
        cascadeFailures: ["Central Infinity Spindle"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 15, y: 30, z: -15 }
    });

    // ==========================================
    // PART 11: EXOTIC MATTER THREADS (THE WEAVE)
    // ==========================================
    const threadsGroup = new THREE.Group();
    
    for(let i=0; i<150; i++) {
        // Curve from random point near arms to spindle
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        
        const start = new THREE.Vector3(
            Math.cos(angle1) * 7.5, 
            8 + Math.random() * 6, 
            Math.sin(angle1) * 7.5
        );
        const end = new THREE.Vector3(
            Math.cos(angle2) * 2.5, 
            12 + Math.random() * 6, 
            Math.sin(angle2) * 2.5
        );
        const mid = new THREE.Vector3(
            (start.x + end.x)/2 + (Math.random()-0.5)*4, 
            (start.y + end.y)/2 + Math.random()*4, 
            (start.z + end.z)/2 + (Math.random()-0.5)*4
        );
        
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(30);
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geom, exoticThreadMat);
        threadsGroup.add(line);
        animMeshes.threads.push({ line, start, end, mid });
    }

    parts.push({
        name: "Primary Loom Harnesses (Energy Threads)",
        description: "Hundreds of glowing, ethereal bezier-curve threads composed of pure tachyons and negative mass.",
        material: "Neon Blue / Additive Blending",
        function: "The raw material being manipulated by the weaving arms.",
        assemblyOrder: 11,
        connections: ["Relativistic Weaving Arms", "Central Infinity Spindle"],
        failureEffect: "Threads snap, unleashing concentrated chronal waves.",
        cascadeFailures: ["Exotic Matter Containment Chambers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // energy dissipates
    });
    group.add(threadsGroup);

    // ==========================================
    // PART 12: PARADOX VENTING EXHAUST STACKS
    // ==========================================
    const exhaustGroup = new THREE.Group();
    
    const exhaustX = [-6, -2, 2, 6];
    exhaustX.forEach((xPos, i) => {
        const stack = new THREE.Group();
        
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 10, 32), darkSteel);
        pipe.position.y = 5;
        stack.add(pipe);
        
        // Vent flaps
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1.5, 16), chrome);
        cap.position.y = 10.5;
        stack.add(cap);
        
        // Inner glowing radiation
        const rad = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 10.2, 16), neonPurple);
        rad.position.y = 5.1;
        stack.add(rad);
        
        // Rivets on pipe
        for(let j=0; j<8; j++) {
            const r = createRivet();
            const angle = (j/8)*Math.PI*2;
            r.position.set(Math.cos(angle)*1.3, 5, Math.sin(angle)*1.3);
            r.rotation.x = Math.PI/2;
            r.rotation.y = angle;
            stack.add(r);
        }
        
        stack.position.set(xPos, 6, 16); // rear mounted
        exhaustGroup.add(stack);
    });

    parts.push({
        name: "Paradox Venting Exhaust Stacks",
        description: "Massive dark-steel chimneys that vent out localized paradoxes and excess chronal radiation generated by tachyon friction.",
        material: "Dark Steel / Chrome / Neon Purple",
        function: "Prevents the build-up of timeline inconsistencies within the main chassis.",
        assemblyOrder: 12,
        connections: ["Titanium Chassis Core"],
        failureEffect: "Timeline fracturing; local area becomes locked in a repeating time loop.",
        cascadeFailures: ["Operator Command Cabin"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 40 }
    });
    group.add(exhaustGroup);

    // ==========================================
    // PART 13: COOLING MANIFOLDS & HYDRAULIC LINES
    // ==========================================
    const manifoldGroup = new THREE.Group();
    
    // Extensive looping pipes across the chassis
    for(let i=0; i<10; i++) {
        const pipePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10 + Math.random()*20, 6, -10 + Math.random()*20),
            new THREE.Vector3(-12 + Math.random()*24, 7, -12 + Math.random()*24),
            new THREE.Vector3(-8 + Math.random()*16, 6.5, -8 + Math.random()*16)
        ]);
        const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipePath, 64, 0.2, 16, false), copper);
        manifoldGroup.add(pipe);
    }
    
    parts.push({
        name: "Cooling Manifolds & Hydraulic Lines",
        description: "A labyrinth of copper tubing routing absolute-zero liquid helium and high-pressure hydraulic fluid.",
        material: "Copper / Rubber",
        function: "Maintains thermal equilibrium against the infinite friction of the tachyon weave.",
        assemblyOrder: 13,
        connections: ["Titanium Chassis Core", "Relativistic Weaving Arms"],
        failureEffect: "Thermal runaway resulting in immediate core meltdown.",
        cascadeFailures: ["Paradox Venting Exhaust Stacks"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });
    group.add(manifoldGroup);

    // ==========================================
    // PART 14: ENTANGLEMENT STABILIZERS
    // ==========================================
    const stabilizerGroup = new THREE.Group();
    
    const stabPositions = [{x: 10, z: 0}, {x: -10, z: 0}, {x: 0, z: 12}, {x: 0, z: -12}];
    
    stabPositions.forEach(pos => {
        const tower = new THREE.Group();
        
        const base = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), steel);
        base.position.y = 4;
        tower.add(base);
        
        const glowCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 7.8, 16), neonGreen);
        glowCore.position.y = 4;
        tower.add(glowCore);
        animMeshes.stabilizerGlows.push(glowCore);
        
        const cap = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), chrome);
        cap.position.y = 8;
        tower.add(cap);
        
        tower.position.set(pos.x, 6, pos.z);
        stabilizerGroup.add(tower);
    });

    parts.push({
        name: "Entanglement Stabilizers",
        description: "Tall steel and chrome towers emitting a neon green quantum entanglement field to lock the Jones polynomial invariant.",
        material: "Steel / Chrome / Neon Green",
        function: "Prevents quantum decoherence of the macroscopic exotic structure.",
        assemblyOrder: 14,
        connections: ["Titanium Chassis Core"],
        failureEffect: "Spontaneous dissolution of woven matter back into wave-functions.",
        cascadeFailures: ["Central Infinity Spindle"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 0, z: -40 }
    });
    group.add(stabilizerGroup);

    // ==========================================
    // PART 15: FRONT ARMORED GRILLE
    // ==========================================
    const grilleGroup = new THREE.Group();
    
    const grilleBase = new THREE.Mesh(new THREE.BoxGeometry(16, 4, 1), steel);
    grilleGroup.add(grilleBase);
    
    // Slats
    for(let i=-7; i<=7; i+=1) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.8, 1.2), darkSteel);
        slat.position.x = i;
        grilleGroup.add(slat);
    }
    
    grilleGroup.position.set(0, 7, -19.5); // very front

    parts.push({
        name: "Front Armored Grille",
        description: "Massive slatted steel grille protecting the internal routing of the tachyon accelerator feeds.",
        material: "Steel / Dark Steel",
        function: "Physical deflection of planetary debris while the crawler is in motion.",
        assemblyOrder: 15,
        connections: ["Titanium Chassis Core"],
        failureEffect: "Debris penetration damaging primary fluid lines.",
        cascadeFailures: ["Cooling Manifolds & Hydraulic Lines"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -40 }
    });
    group.add(grilleGroup);

    // ==========================================
    // PART 16: ACCESS LADDERS & CATWALKS
    // ==========================================
    const ladderGroup = new THREE.Group();
    
    const l1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 14, 16), steel);
    l1.position.set(-1, 0, 0);
    ladderGroup.add(l1);
    
    const l2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 14, 16), steel);
    l2.position.set(1, 0, 0);
    ladderGroup.add(l2);
    
    for(let i=-6.5; i<=6.5; i+=0.8) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2, 16), aluminum);
        rung.rotation.z = Math.PI/2;
        rung.position.set(0, i, 0);
        ladderGroup.add(rung);
    }
    
    ladderGroup.position.set(-10, 7, -10);
    
    parts.push({
        name: "Access Ladders & Catwalks",
        description: "Standard physical access pathways for maintenance personnel, built with industrial aluminum and steel.",
        material: "Steel / Aluminum",
        function: "Permits human oversight and manual override of secondary systems.",
        assemblyOrder: 16,
        connections: ["Titanium Chassis Core", "Operator Command Cabin"],
        failureEffect: "Loss of manual maintenance capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: -10, z: 0 }
    });
    group.add(ladderGroup);

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    const animate = (time, speed, meshesObj = animMeshes) => {
        // Relativistic weaving arms
        animMeshes.arms.forEach((arm, i) => {
            const phase = time * speed * 3 + (i * Math.PI / 4);
            // Highly complex multi-joint synchronous animation
            arm.shoulder.rotation.y = Math.sin(phase) * 0.6;
            arm.shoulder.rotation.z = Math.cos(phase * 1.5) * 0.4 + 0.5;
            arm.elbow.rotation.z = Math.sin(phase * 2) * 0.6 - 0.5;
            arm.wrist.rotation.x = Math.cos(phase * 2.5) * 1.2;
            arm.wrist.rotation.z = Math.sin(phase * 3) * 0.9;
            
            // Fingers grasping threads
            arm.fingers.forEach((finger, j) => {
                finger.joint1.rotation.z = Math.abs(Math.sin(phase * 4 + j)) * 0.6 + 0.1;
                finger.joint2.rotation.z = Math.abs(Math.cos(phase * 4 + j)) * 0.6 + 0.1;
            });
        });

        // Omni-Directional Crawler Wheels
        animMeshes.wheels.forEach((wheel, i) => {
            // Forward rolling motion
            wheel.rotation.z -= speed * 0.02;
        });

        // Hydraulic Suspension Pistons
        animMeshes.pistons.forEach((piston, i) => {
            const phase = time * speed * 2 + i;
            // Simulated terrain bumping
            piston.position.y = Math.sin(phase) * 0.5 + 4; // base piston inner length was 4
        });

        // Tachyon Acceleration Rings (Relativistic spinning)
        animMeshes.tachyonRings.forEach((ring, i) => {
            ring.rotation.x += speed * (0.05 + i * 0.02);
            ring.rotation.y += speed * (0.03 + i * 0.015);
            ring.rotation.z += speed * (0.04 + i * 0.01);
        });

        // Plasma Cores pulsing
        animMeshes.plasmaCores.forEach((plasma, i) => {
            plasma.rotation.x += speed * 0.08;
            plasma.rotation.y += speed * 0.1;
            const scale = 1 + Math.sin(time * speed * 12 + i) * 0.2;
            plasma.scale.set(scale, scale, scale);
        });

        // Central Infinity Spindle & Woven Matter
        if (animMeshes.spindle) {
            animMeshes.spindle.rotation.y += speed * 0.06;
            // Spindle rising and falling on a sine wave to distribute the weave
            animMeshes.spindle.position.y = 15 + Math.sin(time * speed * 1.5) * 2;
        }
        if (animMeshes.matter) {
            // Negative mass phasing and twisting
            animMeshes.matter.rotation.x += speed * 0.02;
            animMeshes.matter.rotation.z += speed * 0.03;
            // Paradox scaling
            const matterScale = 1 + Math.cos(time * speed * 5) * 0.1;
            animMeshes.matter.scale.set(matterScale, matterScale, matterScale);
        }

        // Energy Threads
        animMeshes.threads.forEach((threadObj, i) => {
            const phase = time * speed * 15 + i;
            // Pulse opacity
            threadObj.line.material.opacity = 0.4 + Math.sin(phase) * 0.6;
            
            // Jitter points to simulate quantum uncertainty
            const positions = threadObj.line.geometry.attributes.position.array;
            for(let j=3; j<positions.length-3; j++) {
                // slight jitter
                positions[j] += (Math.random() - 0.5) * 0.05;
            }
            threadObj.line.geometry.attributes.position.needsUpdate = true;
        });

        // Quantum Anti-Gravity Repulsors
        animMeshes.repulsors.forEach((rep, i) => {
            const pulse = 1 + Math.sin(time * speed * 20 + i) * 0.3;
            rep.scale.set(pulse, pulse, pulse);
        });

        // Entanglement Stabilizer Glows
        animMeshes.stabilizerGlows.forEach((glow, i) => {
            const pulse = 1 + Math.cos(time * speed * 10 + i) * 0.1;
            glow.scale.set(pulse, 1, pulse); // scale horizontally
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
