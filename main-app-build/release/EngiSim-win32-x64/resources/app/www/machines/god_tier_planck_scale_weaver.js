import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The God-Tier Planck Scale Weaver is a colossal, heavy-duty quantum construction vehicle designed to manipulate the fundamental fabric of reality. Outfitted with aggressive off-road treads, massive hydraulic articulation, and a state-of-the-art operator cabin, it physically weaves subatomic strings at the Planck length. It seamlessly combines brute-force industrial engineering with hyper-advanced quantum mechanics, allowing operators to bulldoze through the multiverse and pave new dimensional manifolds.";

    const quizQuestions = [
        {
            question: "When calibrating the Planck Scale Weaver's Calabi-Yau Extruder for Heterotic string theory (SO(32) or E8 x E8), how does the Euler characteristic (χ) of the chosen compactification manifold precisely determine the number of chiral fermion generations?",
            options: [
                "The net number of left-handed minus right-handed generations is exactly |χ| / 2.",
                "The generations are determined solely by the volume of the manifold, independent of χ.",
                "The number of generations equals the sum of the Betti numbers.",
                "The Euler characteristic must strictly be zero to preserve N=4 supersymmetry."
            ],
            answer: 0
        },
        {
            question: "The vehicle's Holographic Projection Dish leverages the AdS/CFT correspondence. In this framework, what operator in the boundary Conformal Field Theory (CFT) is dual to the graviton field (metric tensor fluctuations) in the bulk Anti-de Sitter (AdS) space?",
            options: [
                "The stress-energy tensor (T_μν).",
                "The R-symmetry current (J_μ).",
                "The primary scalar operator (O).",
                "The supercurrent (S_μα)."
            ],
            answer: 0
        },
        {
            question: "While traversing the quantum vacuum, the Weaver's Casimir Effect Plates harvest zero-point energy. During the zeta function regularization of this energy across continuous modes, the Riemann zeta function ζ(-1) emerges. What is its mathematically assigned value in this context?",
            options: [
                "-1/12",
                "-1/24",
                "0",
                "Infinity"
            ],
            answer: 0
        },
        {
            question: "The Wavefunction Collapse Manifold forces superposition states into definite macroscopic realities. If the system experiences environmentally-induced decoherence, the off-diagonal elements of the reduced density matrix decay. What governs the timescale of this decay?",
            options: [
                "It is inversely proportional to the square of the difference in macroscopic observables (e.g., position) between the superposed states.",
                "It is directly proportional to the Planck time.",
                "It is completely independent of the environment's temperature.",
                "It scales linearly with the mass of the observer."
            ],
            answer: 0
        },
        {
            question: "The vehicle utilizes a Chronon Field Stabilizer to prevent temporal shear during backward tachyon emission. In the Hartle-Hawking no-boundary proposal for quantum cosmology, how is the time dimension fundamentally treated near the universe's origin?",
            options: [
                "Time is treated as a purely spatial dimension (imaginary time) via a Wick rotation, creating a compact Euclidean geometry.",
                "Time loops infinitely in a closed timelike curve.",
                "Time approaches a singularity of infinite curvature.",
                "Time becomes a discrete, non-commutative variable."
            ],
            answer: 0
        }
    ];

    // ==========================================
    // HELPER FUNCTIONS FOR PROCEDURAL GENERATION
    // ==========================================

    function createLathe(points, segments, mat) {
        const pArray = points.map(p => new THREE.Vector2(p[0], p[1]));
        const geo = new THREE.LatheGeometry(pArray, segments);
        return new THREE.Mesh(geo, mat);
    }

    function createHyperRealisticTire() {
        const tireGroup = new THREE.Group();
        
        // Main tire body
        const tireBaseGeo = new THREE.TorusGeometry(4, 1.8, 64, 128);
        const tireBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
        const tireMesh = new THREE.Mesh(tireBaseGeo, tireBaseMaterial);
        tireGroup.add(tireMesh);
        
        // Hundreds of aggressive off-road tread lugs
        const lugGeo = new THREE.BoxGeometry(1.2, 0.6, 2.5);
        const numLugs = 120;
        for(let i=0; i<numLugs; i++) {
            const theta = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, tireBaseMaterial);
            
            const radius = 4 + 1.6;
            lug.position.x = radius * Math.cos(theta);
            lug.position.y = radius * Math.sin(theta);
            
            lug.rotation.z = theta;
            
            if(i % 2 === 0) {
                lug.position.z = 0.8;
                lug.rotation.y = Math.PI / 8;
            } else {
                lug.position.z = -0.8;
                lug.rotation.y = -Math.PI / 8;
            }
            
            tireGroup.add(lug);
        }
        
        // Rim base
        const rimGeo = new THREE.CylinderGeometry(2.5, 2.5, 2.2, 64);
        const rimMesh = new THREE.Mesh(rimGeo, darkSteel);
        rimMesh.rotation.x = Math.PI / 2;
        tireGroup.add(rimMesh);
        
        // Complex spoke arrays
        const numSpokes = 16;
        for(let i=0; i<numSpokes; i++) {
            const spokeGeo = new THREE.BoxGeometry(0.4, 5, 0.5);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = (i / numSpokes) * Math.PI;
            rimMesh.add(spoke);
            
            const innerDetail = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5.2, 16), steel);
            innerDetail.rotation.z = (i / numSpokes) * Math.PI;
            rimMesh.add(innerDetail);
        }
        
        // Hub and massive bolts
        const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        rimMesh.add(hub);
        
        const numBolts = 12;
        for(let i=0; i<numBolts; i++) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.0, 6), steel);
            const theta = (i / numBolts) * Math.PI * 2;
            bolt.position.x = 0.8 * Math.cos(theta);
            bolt.position.z = 0.8 * Math.sin(theta);
            rimMesh.add(bolt);
        }

        // Inner glowing quantum brake caliper
        const caliper = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.5, 1.5), 
            new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 2 })
        );
        caliper.position.set(2, 0, 0);
        rimMesh.add(caliper);

        return tireGroup;
    }

    function createHydraulicPiston(length, radius, extension) {
        const pistonGroup = new THREE.Group();
        
        // Outer cylinder (housing)
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 32), darkSteel);
        housing.position.y = length / 2;
        pistonGroup.add(housing);
        
        // Inner cylinder (rod)
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 32), chrome);
        rod.position.y = length + extension / 2;
        rod.name = "rod";
        pistonGroup.add(rod);

        // Mounting brackets
        const baseBracket = new THREE.Mesh(new THREE.BoxGeometry(radius*3, radius*3, radius*3), steel);
        pistonGroup.add(baseBracket);

        const topBracket = new THREE.Mesh(new THREE.BoxGeometry(radius*2, radius*2, radius*2), steel);
        topBracket.position.y = length * 1.5;
        topBracket.name = "topBracket";
        pistonGroup.add(topBracket);

        return pistonGroup;
    }

    function createFoamLattice(width, depth, height, count) {
        const foamGroup = new THREE.Group();
        const geom = new THREE.IcosahedronGeometry(0.5, 2);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0xff00ff,
            emissive: 0x550055,
            transparent: true,
            opacity: 0.7,
            wireframe: true,
            roughness: 0.1,
            metalness: 0.8
        });

        const instanced = new THREE.InstancedMesh(geom, mat, count);
        const dummy = new THREE.Object3D();
        for(let i=0; i<count; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * width,
                (Math.random() - 0.5) * height,
                (Math.random() - 0.5) * depth
            );
            const scale = Math.random() * 1.5 + 0.5;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            dummy.updateMatrix();
            instanced.setMatrixAt(i, dummy.matrix);
        }
        foamGroup.add(instanced);
        return { group: foamGroup, mesh: instanced, count: count };
    }

    // ==========================================
    // VEHICLE COMPONENT ASSEMBLY
    // ==========================================

    const vehicleOrigin = new THREE.Group();
    group.add(vehicleOrigin);

    // 1. Chassis & Main Frame
    const chassisGroup = new THREE.Group();
    const chassisGeo = new THREE.BoxGeometry(12, 4, 25);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.position.set(0, 4, 0);
    chassisGroup.add(chassisMesh);

    // Add extensive rivets and panel lines to chassis
    for(let i=0; i<40; i++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), chrome);
        rivet.position.set(-6.1, 4 + (Math.random()-0.5)*3, (Math.random()-0.5)*24);
        chassisGroup.add(rivet);
        const rivet2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), chrome);
        rivet2.position.set(6.1, 4 + (Math.random()-0.5)*3, (Math.random()-0.5)*24);
        chassisGroup.add(rivet2);
    }
    
    vehicleOrigin.add(chassisGroup);
    parts.push({
        name: "God-Tier Chassis",
        description: "The primary structural framework forged from neutronium alloy, capable of withstanding the immense gravitational sheer forces of Planck-scale manipulations.",
        material: darkSteel,
        function: "Supports all vehicle subsystems and absorbs multiversal recoil.",
        assemblyOrder: 1,
        connections: ["Tires", "Operator Cabin", "Hydraulic Booms"],
        failureEffect: "Total structural collapse into a singularity.",
        cascadeFailures: ["Entire Vehicle"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // Tires Assembly (4 separate parts for physics/animation)
    const tirePositions = [
        { x: -7.5, y: 4, z: 8, name: "Front Left Quantum Tire", order: 2 },
        { x: 7.5, y: 4, z: 8, name: "Front Right Quantum Tire", order: 3 },
        { x: -7.5, y: 4, z: -8, name: "Rear Left Quantum Tire", order: 4 },
        { x: 7.5, y: 4, z: -8, name: "Rear Right Quantum Tire", order: 5 }
    ];

    const tires = [];
    tirePositions.forEach((tp) => {
        const tGroup = createHyperRealisticTire();
        tGroup.position.set(tp.x, tp.y, tp.z);
        if(tp.x > 0) tGroup.rotation.y = Math.PI; // Flip right side tires
        vehicleOrigin.add(tGroup);
        tires.push(tGroup);

        parts.push({
            name: tp.name,
            description: "Massive TorusGeometry-based off-road tires studded with hundreds of extruded box geometry lugs. Projects a localized quantum slipstream to gain traction on the fabric of spacetime itself.",
            material: rubber,
            function: "Multiversal locomotion and terrain traversal.",
            assemblyOrder: tp.order,
            connections: ["God-Tier Chassis"],
            failureEffect: "Vehicle slips out of the current temporal dimension.",
            cascadeFailures: ["Chronon Field Stabilizer"],
            originalPosition: { x: tp.x, y: tp.y, z: tp.z },
            explodedPosition: { x: tp.x * 3, y: tp.y, z: tp.z * 2 }
        });
    });

    // 6. Detailed Operator Cabin
    const cabinGroup = new THREE.Group();
    const frameGeo = new THREE.ExtrudeGeometry(new THREE.Shape([
        new THREE.Vector2(-4, -3), new THREE.Vector2(4, -3),
        new THREE.Vector2(4, 3), new THREE.Vector2(2, 5),
        new THREE.Vector2(-2, 5), new THREE.Vector2(-4, 3)
    ]), { depth: 8, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.2 });
    
    const cabinShell = new THREE.Mesh(frameGeo, steel);
    cabinGroup.add(cabinShell);
    
    // Tinted Glass Panes
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 4), tinted);
    frontGlass.position.set(0, 1.5, 8.2);
    cabinGroup.add(frontGlass);

    // Control Dashboard
    const dashGroup = new THREE.Group();
    dashGroup.position.set(0, -1, 7.5);
    const dashboard = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 1.5), darkSteel);
    dashGroup.add(dashboard);
    
    // Holographic Screens
    for(let i=0; i<4; i++) {
        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1), 
            new THREE.MeshStandardMaterial({color: 0x00ffcc, emissive: 0x0088aa, emissiveIntensity: 2})
        );
        screen.position.set(-2.5 + i*1.6, 0.5, 0.76);
        dashGroup.add(screen);
    }
    
    // Steering Wheel & Joysticks
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(-2, 0, 1);
    wheelGroup.rotation.x = -Math.PI / 4;
    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 32), plastic);
    wheelGroup.add(wheelRim);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), darkSteel);
    wheelGroup.add(col);
    dashGroup.add(wheelGroup);

    for(let i=0; i<2; i++) {
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), chrome);
        stick.position.set(1.5 + i*1.2, 0.5, 0.5);
        stick.rotation.x = Math.PI/2;
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), rubber);
        knob.position.y = 0.4;
        stick.add(knob);
        dashGroup.add(stick);
    }
    cabinGroup.add(dashGroup);

    // Operator Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), rubber);
    seat.position.set(-2, -1.5, 5);
    cabinGroup.add(seat);

    // Ladders and Grilles
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(-4.5, -6, 0);
    for(let i=0; i<6; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), steel);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, i, 0);
        ladderGroup.add(rung);
    }
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6), steel);
    rail1.position.set(-0.7, 2.5, 0);
    ladderGroup.add(rail1);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6), steel);
    rail2.position.set(0.7, 2.5, 0);
    ladderGroup.add(rail2);
    cabinGroup.add(ladderGroup);

    // Side Mirrors
    const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 1), chrome);
    mirrorL.position.set(-4.5, 1, 8);
    cabinGroup.add(mirrorL);
    const mirrorR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 1), chrome);
    mirrorR.position.set(4.5, 1, 8);
    cabinGroup.add(mirrorR);

    cabinGroup.position.set(0, 10, -5);
    vehicleOrigin.add(cabinGroup);

    parts.push({
        name: "Operator Cabin & Quantum Interface",
        description: "A heavily shielded command center featuring tinted glass, ergonomic rubber seating, and holographic multiversal displays.",
        material: steel,
        function: "Provides a safe macroscopic reference frame for the driver.",
        assemblyOrder: 6,
        connections: ["God-Tier Chassis"],
        failureEffect: "Operator is spaghettified and scattered across multiple timelines.",
        cascadeFailures: ["Probability Amplitude Modulator"],
        originalPosition: { x: 0, y: 10, z: -5 },
        explodedPosition: { x: 0, y: 30, z: -20 }
    });

    // 7. Engine Block: Probability Amplitude Modulator
    const engineGroup = new THREE.Group();
    const engineBase = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 8), darkSteel);
    engineGroup.add(engineBase);
    
    // Cylinders and glowing manifolds
    for(let i=0; i<4; i++) {
        const cylL = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), chrome);
        cylL.position.set(-2, 3.5, -2.5 + i*1.6);
        cylL.rotation.z = Math.PI/6;
        engineGroup.add(cylL);
        
        const cylR = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), chrome);
        cylR.position.set(2, 3.5, -2.5 + i*1.6);
        cylR.rotation.z = -Math.PI/6;
        engineGroup.add(cylR);
        
        // Glowing spark plugs
        const plug = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color:0xffaa00, emissive:0xff5500, emissiveIntensity:3}));
        plug.position.y = 1;
        cylL.add(plug);
        
        const plug2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color:0xffaa00, emissive:0xff5500, emissiveIntensity:3}));
        plug2.position.y = 1;
        cylR.add(plug2);
    }
    
    engineGroup.position.set(0, 7.5, -15);
    vehicleOrigin.add(engineGroup);

    parts.push({
        name: "Probability Amplitude Modulator (Engine)",
        description: "A colossal V8-style quantum engine block that alters probability amplitudes to favor forward thrust and weaving outcomes.",
        material: chrome,
        function: "Main power generation and timeline selection.",
        assemblyOrder: 7,
        connections: ["God-Tier Chassis", "Exhaust Stacks"],
        failureEffect: "Engine stall leads to a localized false vacuum collapse.",
        cascadeFailures: ["Chronon Field Stabilizer", "Casimir Effect Plates"],
        originalPosition: { x: 0, y: 7.5, z: -15 },
        explodedPosition: { x: -20, y: 15, z: -40 }
    });

    // 8. Exhaust Stacks (Tachyon Emitters)
    const exhaustGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 32);
    const stackL = new THREE.Mesh(stackGeo, chrome);
    stackL.position.set(-3.5, 12, -12);
    exhaustGroup.add(stackL);
    
    const stackR = new THREE.Mesh(stackGeo, chrome);
    stackR.position.set(3.5, 12, -12);
    exhaustGroup.add(stackR);
    
    vehicleOrigin.add(exhaustGroup);

    parts.push({
        name: "Tachyon Exhaust Stacks",
        description: "Vents excess faster-than-light tachyons produced by the probability engine. Emits a distinct blue Cherenkov radiation smoke.",
        material: chrome,
        function: "Heat and paradox dissipation.",
        assemblyOrder: 8,
        connections: ["Probability Amplitude Modulator (Engine)"],
        failureEffect: "Temporal exhaust build-up causes the vehicle to accelerate backward in time uncontrollably.",
        cascadeFailures: ["None, but you lose your driver's license."],
        originalPosition: { x: 0, y: 12, z: -12 },
        explodedPosition: { x: 0, y: 40, z: -12 }
    });

    // 9. Radiator Grille (Wavefunction Collapse Manifold)
    const grilleGroup = new THREE.Group();
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 1), steel);
    grilleGroup.add(grilleFrame);
    
    // Hundreds of tiny vertical fins
    for(let i=0; i<30; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.5, 1.2), chrome);
        fin.position.set(-3.2 + i*0.22, 0, 0);
        grilleGroup.add(fin);
    }
    
    // Glowing central collapse sphere
    const collapseSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.MeshStandardMaterial({color: 0x00aaff, emissive: 0x0055aa, emissiveIntensity: 2, wireframe: true})
    );
    collapseSphere.position.set(0, 0, 0.5);
    grilleGroup.add(collapseSphere);

    grilleGroup.position.set(0, 7.5, -20);
    vehicleOrigin.add(grilleGroup);

    parts.push({
        name: "Wavefunction Collapse Radiator Grille",
        description: "Forces superposed air molecules and stray quantum states into definite classical realities before they hit the engine.",
        material: steel,
        function: "Observer effect automation and cooling.",
        assemblyOrder: 9,
        connections: ["Probability Amplitude Modulator (Engine)"],
        failureEffect: "Engine intakes both existing and non-existing matter simultaneously.",
        cascadeFailures: ["Probability Amplitude Modulator (Engine)"],
        originalPosition: { x: 0, y: 7.5, z: -20 },
        explodedPosition: { x: 0, y: 7.5, z: -50 }
    });

    // 10. Multi-Jointed Hydraulic Boom Arm (Base)
    const boomBase = new THREE.Group();
    boomBase.position.set(0, 6, 12);
    vehicleOrigin.add(boomBase);
    
    const baseTurret = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 2, 64), darkSteel);
    boomBase.add(baseTurret);
    
    const boomArm1 = new THREE.Group();
    boomArm1.position.set(0, 1, 0);
    boomBase.add(boomArm1);
    
    const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 16, 3), steel);
    arm1Mesh.position.set(0, 7, 0);
    boomArm1.add(arm1Mesh);
    
    // Piston 1
    const piston1 = createHydraulicPiston(8, 0.8, 4);
    piston1.position.set(0, 0, -2);
    piston1.rotation.x = -Math.PI/8;
    boomBase.add(piston1);

    parts.push({
        name: "Primary Hydraulic Boom Arm",
        description: "Massive articulated steel arm driven by zero-point energy pistons. Lifts and positions the main quantum loom.",
        material: steel,
        function: "Macroscopic positioning of microscopic tools.",
        assemblyOrder: 10,
        connections: ["God-Tier Chassis", "Secondary Articulation Arm"],
        failureEffect: "Loom drops and accidentally weaves the ground into a black hole.",
        cascadeFailures: ["Planck Scale Lattice Loom"],
        originalPosition: { x: 0, y: 6, z: 12 },
        explodedPosition: { x: 0, y: 30, z: 40 }
    });

    // 11. Secondary Articulation Arm
    const boomArm2 = new THREE.Group();
    boomArm2.position.set(0, 14, 0);
    boomArm1.add(boomArm2);
    
    const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 12, 2.5), steel);
    arm2Mesh.position.set(0, 5, 0);
    boomArm2.add(arm2Mesh);
    
    const joint1 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 3, 32), darkSteel);
    joint1.rotation.z = Math.PI/2;
    boomArm2.add(joint1);

    parts.push({
        name: "Secondary Articulation Arm",
        description: "Extends the reach of the vehicle, allowing it to weave complex topologies in hard-to-reach multidimensional spaces.",
        material: steel,
        function: "Fine macroscopic positioning.",
        assemblyOrder: 11,
        connections: ["Primary Hydraulic Boom Arm", "Planck Scale Lattice Loom"],
        failureEffect: "Loss of fine control, resulting in crude, blocky spacetime textures.",
        cascadeFailures: ["Calabi-Yau Manifold Extruder"],
        originalPosition: { x: 0, y: 20, z: 12 },
        explodedPosition: { x: 0, y: 50, z: 60 }
    });

    // 12. The Planck Scale Lattice Loom (The Attachment)
    const loomGroup = new THREE.Group();
    loomGroup.position.set(0, 11, 0);
    boomArm2.add(loomGroup);
    
    const loomJoint = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), chrome);
    loomGroup.add(loomJoint);
    
    // Massive complex array of struts for the loom
    const latticeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.3 });
    const latticeGroup = new THREE.Group();
    latticeGroup.position.set(0, 4, 4);
    loomGroup.add(latticeGroup);
    
    for(let i=0; i<15; i++) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10, 8), latticeMat);
        strut.rotation.x = Math.PI / 2;
        strut.position.z = -5 + (i * 0.7);
        latticeGroup.add(strut);
        
        const strut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10, 8), latticeMat);
        strut2.rotation.z = Math.PI / 2;
        strut2.position.x = -5 + (i * 0.7);
        latticeGroup.add(strut2);
        
        const strut3 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10, 8), latticeMat);
        strut3.position.y = -5 + (i * 0.7);
        latticeGroup.add(strut3);
    }

    parts.push({
        name: "Planck Scale Lattice Loom",
        description: "A microscopic web of interrelated spatial struts, upscaled here for visualization. Physically grasps and weaves string-theoretic elements.",
        material: latticeMat,
        function: "Primary reality weaving interface.",
        assemblyOrder: 12,
        connections: ["Secondary Articulation Arm", "String Theory Tension Spindles"],
        failureEffect: "Unravels the local universe.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 35, z: 16 },
        explodedPosition: { x: 0, y: 70, z: 80 }
    });

    // 13. String Theory Tension Spindles
    const spindleGroup = new THREE.Group();
    const spindlePoints = [
        [0.2, 0], [1.0, 0.5], [0.4, 1.5], [0.4, 4], [1.2, 4.5], [1.5, 5], [0.2, 6]
    ];
    
    for(let i=0; i<4; i++) {
        const spindle = createLathe(spindlePoints, 64, copper);
        spindle.position.set(
            6 * Math.cos(i * Math.PI/2),
            0,
            6 * Math.sin(i * Math.PI/2)
        );
        spindle.rotation.x = Math.PI/2;
        spindleGroup.add(spindle);
    }
    spindleGroup.position.set(0, 0, 5);
    loomGroup.add(spindleGroup);

    parts.push({
        name: "String Theory Tension Spindles",
        description: "Four massive rotating spools feeding 1D strings into the loom.",
        material: copper,
        function: "Raw material feeding mechanism.",
        assemblyOrder: 13,
        connections: ["Planck Scale Lattice Loom"],
        failureEffect: "Strings snap, releasing infinite energy.",
        cascadeFailures: ["Operator Cabin"],
        originalPosition: { x: 0, y: 35, z: 21 },
        explodedPosition: { x: 30, y: 80, z: 100 }
    });

    // 14. Quantum Foam Resonator Core (Mounted on rear of chassis)
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.TorusKnotGeometry(4, 1.2, 256, 32, 5, 7);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x9900ff,
        emissiveIntensity: 1.5,
        wireframe: true,
        metalness: 0.9,
        roughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);
    
    // Protective casing
    const casing = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 32), new THREE.MeshPhysicalMaterial({
        color: 0x000000, transparent: true, opacity: 0.4, transmission: 0.9, clearcoat: 1
    }));
    coreGroup.add(casing);
    
    coreGroup.position.set(0, 10, -28);
    vehicleOrigin.add(coreGroup);

    parts.push({
        name: "Quantum Foam Resonator Core",
        description: "Stabilizes wild vacuum fluctuations. Mounted in a transparent physical containment sphere on the vehicle's rear.",
        material: coreMat,
        function: "Generates the standing waves required to walk on quantum foam.",
        assemblyOrder: 14,
        connections: ["God-Tier Chassis"],
        failureEffect: "Vehicle sinks completely into the quantum foam.",
        cascadeFailures: ["Tires"],
        originalPosition: { x: 0, y: 10, z: -28 },
        explodedPosition: { x: 0, y: 10, z: -70 }
    });

    // 15. Multiverse Branch Selector (Antenna on cabin)
    const antennaGroup = new THREE.Group();
    const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), aluminum);
    antennaGroup.add(antennaBase);
    
    for(let i=0; i<8; i++) {
        const dish = new THREE.Mesh(new THREE.TorusGeometry(1 + i*0.5, 0.05, 16, 64), chrome);
        dish.position.y = 1 + i*0.8;
        dish.rotation.x = Math.PI/2;
        antennaGroup.add(dish);
    }
    
    antennaGroup.position.set(-3, 13, -2);
    vehicleOrigin.add(antennaGroup);

    parts.push({
        name: "Multiverse Branch Selector Antenna",
        description: "Scans infinite parallel timelines to download optimal weaving patterns directly to the dashboard.",
        material: aluminum,
        function: "Data telemetry across Everett branches.",
        assemblyOrder: 15,
        connections: ["Operator Cabin"],
        failureEffect: "Downloads blueprints for a universe entirely made of spiders.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: -3, y: 13, z: -2 },
        explodedPosition: { x: -15, y: 40, z: -10 }
    });

    // 16. Extensive Hydraulic Lines (Tubing across boom)
    const hydraulicGroup = new THREE.Group();
    const tubeMat = new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.8});
    for(let i=0; i<20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 6, 12),
            new THREE.Vector3(2, 14, 12),
            new THREE.Vector3(1, 22, 14),
            new THREE.Vector3(0, 26, 16)
        ]);
        // Add random jitter to curve points to make it look like a bundle of cables
        curve.points.forEach(p => {
            p.x += (Math.random()-0.5)*1.5;
            p.z += (Math.random()-0.5)*1.5;
        });
        const tubeG = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
        const tubeM = new THREE.Mesh(tubeG, tubeMat);
        hydraulicGroup.add(tubeM);
    }
    vehicleOrigin.add(hydraulicGroup);

    parts.push({
        name: "Hydraulic Entanglement Lines",
        description: "Thick rubberized tubes pumping liquid entanglement fluid to the boom joints.",
        material: tubeMat,
        function: "Transmits zero-point pressure.",
        assemblyOrder: 16,
        connections: ["Primary Hydraulic Boom Arm", "Secondary Articulation Arm"],
        failureEffect: "Fluid leaks, causing localized areas of extreme deja vu.",
        cascadeFailures: ["Primary Hydraulic Boom Arm"],
        originalPosition: { x: 0, y: 16, z: 14 },
        explodedPosition: { x: 15, y: 20, z: 20 }
    });

    // 17. Calabi-Yau Manifold Extruder (Secondary Attachment)
    const cyGroup = new THREE.Group();
    const cyGeo = new THREE.SphereGeometry(3, 128, 128);
    const posAttribute = cyGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const u = posAttribute.getX(i);
        const v = posAttribute.getY(i);
        const w = posAttribute.getZ(i);
        const r = Math.sqrt(u*u + v*v + w*w);
        const theta = Math.acos(v/r);
        const phi = Math.atan2(w, u);
        
        const distortion = Math.sin(8*theta) * Math.cos(8*phi) * 0.4 + Math.sin(4*phi) * 0.2;
        const scale = 1 + distortion;
        posAttribute.setXYZ(i, u * scale, v * scale, w * scale);
    }
    cyGeo.computeVertexNormals();
    const cyMat = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        metalness: 0.5,
        roughness: 0.1,
        transmission: 0.9,
        ior: 2.0,
        thickness: 2.0,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });
    const cyMesh = new THREE.Mesh(cyGeo, cyMat);
    cyGroup.add(cyMesh);
    cyGroup.position.set(0, 0, 10);
    loomGroup.add(cyGroup);

    parts.push({
        name: "Calabi-Yau Manifold Extruder",
        description: "A bizarre geometric attachment that compactifies 6 extra spatial dimensions on the fly.",
        material: cyMat,
        function: "Paves the multiversal road with 10D geometry.",
        assemblyOrder: 17,
        connections: ["Planck Scale Lattice Loom"],
        failureEffect: "Road becomes a non-Euclidean nightmare.",
        cascadeFailures: ["Tires"],
        originalPosition: { x: 0, y: 35, z: 26 },
        explodedPosition: { x: 0, y: 90, z: 120 }
    });

    // 18. Chronon Field Stabilizer (Bumper)
    const bumperGroup = new THREE.Group();
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 3), darkSteel);
    bumperGroup.add(bumper);
    
    const chrononGlow = new THREE.Mesh(
        new THREE.BoxGeometry(15.5, 1.5, 3.5),
        new THREE.MeshStandardMaterial({color: 0xff00ff, emissive: 0x880088, transparent: true, opacity: 0.5})
    );
    bumperGroup.add(chrononGlow);
    
    bumperGroup.position.set(0, 2, 22);
    vehicleOrigin.add(bumperGroup);

    parts.push({
        name: "Chronon Field Stabilizer (Front Bumper)",
        description: "A massive front bumper that sweeps away rogue temporal anomalies (chronons) before they get caught in the treads.",
        material: darkSteel,
        function: "Temporal cowcatcher.",
        assemblyOrder: 18,
        connections: ["God-Tier Chassis"],
        failureEffect: "Hits a temporal pothole, sending the vehicle to the Jurassic period.",
        cascadeFailures: ["Operator Cabin"],
        originalPosition: { x: 0, y: 2, z: 22 },
        explodedPosition: { x: 0, y: -10, z: 50 }
    });

    // 19. Casimir Effect Plates (Underbelly Armor)
    const armorGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), chrome);
        plate.position.set(0, 0.25, -10 + i*4.5);
        armorGroup.add(plate);
    }
    armorGroup.position.set(0, 2, 0);
    vehicleOrigin.add(armorGroup);

    parts.push({
        name: "Casimir Effect Plates (Underbelly Armor)",
        description: "Mirrored conductive plates spaced nanometers apart to generate inward vacuum pressure, acting as indestructible skid plates.",
        material: chrome,
        function: "Protects chassis from multiversal debris.",
        assemblyOrder: 19,
        connections: ["God-Tier Chassis"],
        failureEffect: "Underbelly breached by a stray quark.",
        cascadeFailures: ["Probability Amplitude Modulator (Engine)"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 20. Microscopic Bubbling Quantum Foam (Environment)
    const foamData = createFoamLattice(100, 100, 10, 2000);
    foamData.group.position.set(0, -2, 0);
    group.add(foamData.group);

    parts.push({
        name: "Bubbling Quantum Foam (Environment Node)",
        description: "The raw, unshaped fabric of reality at the Planck scale. Constantly bubbling with virtual particles popping in and out of existence.",
        material: new THREE.MeshPhysicalMaterial(), // Placeholder
        function: "The terrain the Weaver operates on.",
        assemblyOrder: 20,
        connections: ["None"],
        failureEffect: "Total vacuum decay of the localized region.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });


    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // 1. Tire Rotation & Steering
        const speedMultiplier = 2.0;
        tires.forEach((tireGroup, index) => {
            const isLeft = tireGroup.position.x < 0;
            const rotationDir = isLeft ? 1 : -1;
            tireGroup.children[0].rotation.z = t * speedMultiplier * rotationDir; // Tire base
            tireGroup.children.forEach((child, i) => {
                if(i > 0 && child.geometry.type === 'BoxGeometry') {
                    // Lugs are attached to tire, but we didn't group them perfectly for rotation.
                    // Actually, rotating the whole tire group works better.
                }
            });
            // Rotate the entire group around X axis to simulate rolling
            tireGroup.rotation.x = t * speedMultiplier;
        });

        // 2. Boom Arm Kinematics (Sine wave driven articulation)
        boomBase.rotation.y = Math.sin(t * 0.5) * 0.5; // Turret swivel
        boomArm1.rotation.x = Math.sin(t * 0.8) * 0.3 - 0.2; // Arm 1 lift
        boomArm2.rotation.x = Math.sin(t * 1.1 + 1) * 0.4 + 0.2; // Arm 2 bend
        
        // Dynamic Piston adjustment (approximate look-at logic for piston rod)
        const pRod = piston1.getObjectByName("rod");
        if(pRod) {
            pRod.position.y = 10 + Math.sin(t * 0.8) * 2; // Extend/retract based on arm movement
        }

        // 3. Lattice Loom internal shifting
        latticeGroup.rotation.y = Math.sin(t * 2) * 0.5;
        latticeGroup.children.forEach((strut, index) => {
            strut.position.x += Math.sin(t * 5 + index) * 0.05;
            strut.position.y += Math.cos(t * 5 + index) * 0.05;
        });

        // 4. Spindles spinning rapidly
        spindleGroup.children.forEach((spindle, i) => {
            spindle.rotation.y = t * 10 * (i % 2 === 0 ? 1 : -1);
        });

        // 5. Engine Pistons pumping
        engineGroup.children.forEach((cyl, index) => {
            if(index > 0 && index <= 4) { // Cylinders
                const plug = cyl.children[0];
                if(plug) {
                    plug.material.emissiveIntensity = 2 + Math.sin(t * 20 + index) * 4; // Sparking
                    cyl.position.y = 3.5 + Math.sin(t * 15 + index * Math.PI/2) * 0.5; // Pumping
                }
            }
        });

        // 6. Resonator Core spinning
        coreMesh.rotation.x = t * 1.5;
        coreMesh.rotation.y = t * 2.2;
        coreGroup.children[1].material.opacity = 0.2 + Math.sin(t * 5) * 0.2; // Pulse casing

        // 7. Calabi-Yau distortion animation
        cyGroup.rotation.x = t;
        cyGroup.rotation.y = t * 1.3;
        cyGroup.rotation.z = t * 0.7;

        // 8. Holographic Screens flickering
        dashGroup.children.forEach((child, index) => {
            if(child.geometry.type === 'PlaneGeometry' && index < 5) {
                child.material.emissiveIntensity = 1 + Math.random();
            }
        });
        
        // Steering wheel turning
        wheelGroup.rotation.z = Math.sin(t * 0.5) * 1.5;
        
        // 9. Antenna spinning
        antennaGroup.children.forEach((dish, i) => {
            if(i > 0) dish.rotation.z = t * (3 + i);
        });

        // 10. Wavefunction Grille Collapse sphere pulsing
        const collapseSphere = grilleGroup.children[grilleGroup.children.length-1];
        if(collapseSphere) {
            const s = 1 + Math.sin(t * 10) * 0.2;
            collapseSphere.scale.set(s,s,s);
            collapseSphere.material.emissiveIntensity = 2 + Math.sin(t*20)*2;
        }

        // 11. Exhaust particles (Simulated via scaling rings or mesh jitter, omitted for strict geometry, but we can pulse the stacks)
        exhaustGroup.children.forEach(stack => {
            stack.scale.setScalar(1 + Math.random()*0.05);
        });

        // 12. Procedural Foam Bubbling
        const dummy = new THREE.Object3D();
        const matrix = new THREE.Matrix4();
        for(let i=0; i<foamData.count; i++) {
            foamData.mesh.getMatrixAt(i, matrix);
            dummy.position.setFromMatrixPosition(matrix);
            
            // Jitter
            dummy.position.x += (Math.random() - 0.5) * 0.2;
            dummy.position.y += (Math.random() - 0.5) * 0.2;
            dummy.position.z += (Math.random() - 0.5) * 0.2;

            // Constrain
            if(dummy.position.y > 5) dummy.position.y = -5;
            if(dummy.position.y < -15) dummy.position.y = 5;

            // Rotate
            dummy.rotation.x += 0.05;
            dummy.rotation.y += 0.05;
            
            // Pulse
            const baseScale = 1.0;
            const pulse = 1 + Math.sin(t * 5 + i) * 0.5;
            dummy.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse);

            dummy.updateMatrix();
            foamData.mesh.setMatrixAt(i, dummy.matrix);
        }
        foamData.mesh.instanceMatrix.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}
