import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    const parts = [];

    // --- Custom Emissive Materials for Quantum Glow ---
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x4400ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        metalness: 0.5,
        roughness: 0.1
    });

    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 3.5,
        wireframe: false,
        transparent: true,
        opacity: 0.8
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9
    });

    // --- Animation State References ---
    const animState = {
        wheels: [],
        rings: [],
        arms: [],
        nodes: [],
        edges: [],
        pistons: [],
        screens: [],
        time: 0
    };

    // --- Utility Functions ---
    function addRivets(mesh, count, radius, yPos) {
        const rivetGeo = new THREE.SphereGeometry(0.1, 8, 8);
        for(let i=0; i<count; i++) {
            const rivet = new THREE.Mesh(rivetGeo, darkSteel);
            const angle = (i/count) * Math.PI * 2;
            rivet.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            mesh.add(rivet);
        }
    }

    function createHydraulicLine(start, end, controlPoint) {
        const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.15, 8, false);
        return new THREE.Mesh(tubeGeo, rubber);
    }

    function createPiston(length, radius) {
        const group = new THREE.Group();
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const outer = new THREE.Mesh(outerGeo, steel);
        outer.position.y = (length * 0.6) / 2;
        
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 16);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = length * 0.7; // extend

        group.add(outer, inner);
        animState.pistons.push({ inner, baseLength: length * 0.7 });
        return group;
    }

    // --- 1. Quantum Traction Tires (Hyper-realistic) ---
    function createTire() {
        const wheelGroup = new THREE.Group();
        
        // Base Tire Torus
        const tireGeo = new THREE.TorusGeometry(5, 1.8, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs for aggressive off-road treads
        const lugGeo = new THREE.BoxGeometry(1.2, 0.6, 3.8);
        const numLugs = 140;
        for(let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(angle) * 6.5; 
            lug.position.y = Math.sin(angle) * 6.5;
            lug.rotation.z = angle;
            if(i % 2 === 0) lug.position.z = 0.8;
            else lug.position.z = -0.8;
            wheelGroup.add(lug);
        }
        
        // Complex CylinderGeometry Rims with spoke arrays
        const rimGeo = new THREE.CylinderGeometry(4.2, 4.2, 2.2, 32);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.6, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Add rivets to the rim
        addRivets(rim, 24, 3.8, 1.1);
        addRivets(rim, 24, 3.8, -1.1);

        animState.wheels.push(wheelGroup);
        return wheelGroup;
    }

    // --- 2. Detailed Operator Cabin ---
    function createControlCabin() {
        const cabinGroup = new THREE.Group();
        
        // Cabin Chassis using Shape Extrusion
        const cabinShape = new THREE.Shape();
        cabinShape.moveTo(-4, 0);
        cabinShape.lineTo(4, 0);
        cabinShape.lineTo(5, 3);
        cabinShape.lineTo(4, 6);
        cabinShape.lineTo(-4, 6);
        cabinShape.lineTo(-5, 3);
        cabinShape.lineTo(-4, 0);
        
        const extSettings = { depth: 8, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 3 };
        const chassisGeo = new THREE.ExtrudeGeometry(cabinShape, extSettings);
        chassisGeo.translate(0, 0, -4);
        const chassis = new THREE.Mesh(chassisGeo, darkSteel);
        cabinGroup.add(chassis);

        // Tinted Glass Windows
        const glassGeo = new THREE.BoxGeometry(9.5, 4.5, 7.5);
        const glassMesh = new THREE.Mesh(glassGeo, tinted);
        glassMesh.position.y = 3;
        cabinGroup.add(glassMesh);

        // Operator Seat
        const seatGroup = new THREE.Group();
        const cushionGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
        const cushion = new THREE.Mesh(cushionGeo, rubber);
        const backrestGeo = new THREE.BoxGeometry(1.5, 2, 0.5);
        const backrest = new THREE.Mesh(backrestGeo, rubber);
        backrest.position.set(0, 1.25, -0.75);
        seatGroup.add(cushion, backrest);
        seatGroup.position.set(0, 1, 0);
        cabinGroup.add(seatGroup);

        // Steering Wheel
        const steerGroup = new THREE.Group();
        const columnGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5);
        const column = new THREE.Mesh(columnGeo, darkSteel);
        column.rotation.x = Math.PI / 4;
        const wheelTorus = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
        const wheel = new THREE.Mesh(wheelTorus, plastic);
        wheel.position.set(0, 0.5, 0.5);
        wheel.rotation.x = Math.PI / 4;
        steerGroup.add(column, wheel);
        steerGroup.position.set(0, 1.5, 1.5);
        cabinGroup.add(steerGroup);

        // Joysticks
        const joyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const joyBall = new THREE.SphereGeometry(0.15, 16, 16);
        for(let i of [-1, 1]) {
            const joy = new THREE.Mesh(joyGeo, steel);
            const ball = new THREE.Mesh(joyBall, plastic);
            ball.position.y = 0.3;
            joy.add(ball);
            joy.position.set(i * 1.5, 1.5, 1.0);
            joy.rotation.x = Math.PI / 8;
            cabinGroup.add(joy);
        }

        // Glowing Screens
        const screenGeo = new THREE.PlaneGeometry(1.5, 1.0);
        for(let i=0; i<4; i++) {
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.set(-2.5 + i*1.6, 2.5, 3.4);
            screen.rotation.y = Math.PI; // Face inwards
            cabinGroup.add(screen);
            animState.screens.push(screen);
        }

        // Side Mirrors
        const mirrorGeo = new THREE.BoxGeometry(0.2, 1.0, 0.5);
        const mirrorLeft = new THREE.Mesh(mirrorGeo, chrome);
        mirrorLeft.position.set(5.2, 3, 2);
        const mirrorRight = new THREE.Mesh(mirrorGeo, chrome);
        mirrorRight.position.set(-5.2, 3, 2);
        cabinGroup.add(mirrorLeft, mirrorRight);

        // Ladder leading up to cabin
        const ladderGroup = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
        const railL = new THREE.Mesh(railGeo, steel);
        railL.position.x = -0.6;
        const railR = new THREE.Mesh(railGeo, steel);
        railR.position.x = 0.6;
        ladderGroup.add(railL, railR);
        for(let i=0; i<8; i++) {
            const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2);
            const rung = new THREE.Mesh(rungGeo, aluminum);
            rung.rotation.z = Math.PI/2;
            rung.position.y = -3.5 + i;
            ladderGroup.add(rung);
        }
        ladderGroup.position.set(-4.5, -3, 0);
        cabinGroup.add(ladderGroup);

        return cabinGroup;
    }

    // --- 3. Crawler Base Chassis ---
    const crawlerBase = new THREE.Group();
    
    // Massive Main Body
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-12, 0);
    chassisShape.lineTo(12, 0);
    chassisShape.lineTo(15, 4);
    chassisShape.lineTo(12, 8);
    chassisShape.lineTo(-12, 8);
    chassisShape.lineTo(-15, 4);
    chassisShape.lineTo(-12, 0);
    const chassisExt = new THREE.ExtrudeGeometry(chassisShape, { depth: 24, bevelEnabled: true, bevelThickness: 0.5 });
    chassisExt.translate(0, 0, -12);
    const mainBody = new THREE.Mesh(chassisExt, darkSteel);
    crawlerBase.add(mainBody);

    // Add Panel Lines
    const panelGeo = new THREE.BoxGeometry(20, 0.2, 0.2);
    for(let i=0; i<5; i++) {
        const panelLine = new THREE.Mesh(panelGeo, plastic);
        panelLine.position.set(0, 8, -8 + i*4);
        crawlerBase.add(panelLine);
    }

    // Add Exhaust Stacks
    const exhaustGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
    for(let i of [-1, 1]) {
        const stack = new THREE.Mesh(exhaustGeo, chrome);
        stack.position.set(i * 10, 10, -10);
        crawlerBase.add(stack);
        
        // Add grilles to exhausts
        const grilleGeo = new THREE.TorusGeometry(0.85, 0.1, 8, 16);
        for(let j=0; j<4; j++) {
            const grille = new THREE.Mesh(grilleGeo, darkSteel);
            grille.position.y = 1 + j;
            grille.rotation.x = Math.PI/2;
            stack.add(grille);
        }
    }

    // Add 8 Tires with suspensions
    const wheelPositions = [
        [-16, 0, -15], [-16, 0, -5], [-16, 0, 5], [-16, 0, 15],
        [16, 0, -15], [16, 0, -5], [16, 0, 5], [16, 0, 15]
    ];
    
    wheelPositions.forEach((pos, idx) => {
        const wheel = createTire();
        wheel.position.set(...pos);
        if(pos[0] < 0) wheel.rotation.y = Math.PI; 
        
        // Suspension Piston
        const susp = createPiston(4, 0.6);
        susp.position.set(pos[0] > 0 ? pos[0]-3 : pos[0]+3, pos[1]+2, pos[2]);
        susp.rotation.z = pos[0] > 0 ? -Math.PI/4 : Math.PI/4;
        crawlerBase.add(susp);

        // Hydraulic line
        const start = new THREE.Vector3(pos[0] > 0 ? pos[0]-5 : pos[0]+5, 6, pos[2]);
        const end = new THREE.Vector3(pos[0], pos[1]+1, pos[2]);
        const ctrl = new THREE.Vector3(pos[0]/2, 8, pos[2]);
        crawlerBase.add(createHydraulicLine(start, end, ctrl));

        crawlerBase.add(wheel);
    });

    // Attach Cabin to Crawler
    const cabin = createControlCabin();
    cabin.position.set(0, 8, 10);
    crawlerBase.add(cabin);

    machineGroup.add(crawlerBase);
    
    parts.push({
        name: "Quantum Traction Crawler Chassis",
        description: "A colossal, 8-wheeled mobile platform capable of navigating extreme topologies of fractured spacetime. Features hyper-articulated suspension.",
        material: "darkSteel",
        function: "Provides mobile stabilization for the loom across high-curvature spacelike hypersurfaces.",
        assemblyOrder: 1,
        connections: ["Suspension Struts", "Operator Cabin", "Loom Pedestal"],
        failureEffect: "Loom destabilization leading to catastrophic metric collapse.",
        cascadeFailures: ["Chassis Fracture", "Gravitational Blowout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    parts.push({
        name: "Command & Control Operator Cabin",
        description: "Highly detailed enclosure with tinted shielding, glowing diagnostics, and complete manual override arrays.",
        material: "steel",
        function: "Houses the human-in-the-loop consciousness required to collapse the local probability wavefunctions.",
        assemblyOrder: 2,
        connections: ["Crawler Chassis"],
        failureEffect: "Operator is exposed to naked singularities and spaghettification.",
        cascadeFailures: ["Loss of control", "Reality dissociation"],
        originalPosition: { x: 0, y: 8, z: 10 },
        explodedPosition: { x: 0, y: 25, z: 40 }
    });


    // --- 4. The Loom: Containment Rings ---
    const loomGroup = new THREE.Group();
    loomGroup.position.set(0, 30, 0);
    
    const ringRadii = [25, 22, 19];
    const ringMats = [darkSteel, steel, chrome];
    
    for(let r=0; r<3; r++) {
        const ringGeo = new THREE.TorusGeometry(ringRadii[r], 1.5, 32, 128);
        const ring = new THREE.Mesh(ringGeo, ringMats[r]);
        
        // Add technological greebles to rings
        const greebleGeo = new THREE.BoxGeometry(3.5, 2.5, 2.5);
        for(let i=0; i<36; i++) {
            const angle = (i/36) * Math.PI * 2;
            const greeble = new THREE.Mesh(greebleGeo, copper);
            greeble.position.x = Math.cos(angle) * ringRadii[r];
            greeble.position.y = Math.sin(angle) * ringRadii[r];
            greeble.rotation.z = angle;
            ring.add(greeble);
        }

        animState.rings.push({
            mesh: ring,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            speed: (Math.random() * 0.5 + 0.5) * (r%2==0 ? 1 : -1)
        });
        loomGroup.add(ring);
    }

    crawlerBase.add(loomGroup); // Mount loom on crawler

    parts.push({
        name: "Tri-Fold Diffeomorphism Containment Rings",
        description: "Massive rotating tori laced with copper greebles to generate the SU(2) gauge fields.",
        material: "chrome",
        function: "Confines the spin foam lattice and prevents false vacuum decay during Weaving.",
        assemblyOrder: 3,
        connections: ["Crawler Chassis", "Spin Network Core"],
        failureEffect: "Uncontrolled expansion of the local metric.",
        cascadeFailures: ["Big Rip localization", "Chronology protection violation"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // --- 5. Weaving Arms (Complex Robotic Manipulators) ---
    function createWeavingArm(index) {
        const armGroup = new THREE.Group();
        
        // Shoulder Mount
        const mountGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.rotation.x = Math.PI/2;
        armGroup.add(mount);
        
        // Shoulder Joint
        const shoulderGeo = new THREE.SphereGeometry(2.2, 32, 32);
        const shoulder = new THREE.Mesh(shoulderGeo, steel);
        mount.add(shoulder);
        
        // Bicep (Extruded Tech Shape)
        const bicepShape = new THREE.Shape();
        bicepShape.moveTo(-1, 0);
        bicepShape.lineTo(1, 0);
        bicepShape.lineTo(1.5, 10);
        bicepShape.lineTo(-1.5, 10);
        bicepShape.lineTo(-1, 0);
        const bicepExt = new THREE.ExtrudeGeometry(bicepShape, { depth: 2, bevelEnabled: true });
        bicepExt.translate(0, 0, -1);
        const bicep = new THREE.Mesh(bicepExt, aluminum);
        bicep.position.y = 2;
        shoulder.add(bicep);

        // Elbow Joint
        const elbowGeo = new THREE.CylinderGeometry(1.8, 1.8, 3, 32);
        const elbow = new THREE.Mesh(elbowGeo, copper);
        elbow.rotation.y = Math.PI/2;
        elbow.rotation.z = Math.PI/2;
        elbow.position.y = 12;
        bicep.add(elbow);

        // Forearm
        const forearmGeo = new THREE.CylinderGeometry(1.2, 1.0, 12, 32);
        const forearm = new THREE.Mesh(forearmGeo, steel);
        forearm.position.y = 6;
        elbow.add(forearm);

        // Wrist & End Effector Claws
        const wristGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const wrist = new THREE.Mesh(wristGeo, darkSteel);
        wrist.position.y = 6;
        forearm.add(wrist);

        const claws = [];
        const clawGeo = new THREE.BoxGeometry(0.4, 4, 0.8);
        clawGeo.translate(0, 2, 0);
        for(let c=0; c<4; c++) {
            const claw = new THREE.Mesh(clawGeo, chrome);
            const angle = (c/4) * Math.PI * 2;
            claw.position.set(Math.cos(angle)*1.2, 1, Math.sin(angle)*1.2);
            // Angle outwards initially
            claw.rotation.x = Math.PI / 8;
            claw.rotation.y = -angle + Math.PI/2;
            wrist.add(claw);
            claws.push(claw);
        }

        // Add hydraulic piston to bicep
        const bicepPiston = createPiston(8, 0.4);
        bicepPiston.position.set(0, 4, 1.5);
        bicepPiston.rotation.x = Math.PI/8;
        bicep.add(bicepPiston);

        return { group: armGroup, shoulder, bicep, elbow, forearm, wrist, claws };
    }

    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const armData = createWeavingArm(i);
        // Position arms in a ring pointing inwards towards the core
        armData.group.position.set(Math.cos(angle)*30, 0, Math.sin(angle)*30);
        armData.group.rotation.y = -angle + Math.PI/2;
        
        loomGroup.add(armData.group);
        animState.arms.push({
            ...armData,
            basePhase: i * (Math.PI / 4)
        });

        parts.push({
            name: `Hamilton Constraint Weaving Arm Alpha-${i}`,
            description: `Hyper-articulated robotic appendage with quantum manipulators for actively re-routing spin network edges.`,
            material: "aluminum",
            function: `Executes discrete Thiemann transformations on the spacetime lattice.`,
            assemblyOrder: 4 + i,
            connections: ["Diffeomorphism Containment Rings"],
            failureEffect: `Creates topological defects (cosmic strings) in the local volume.`,
            cascadeFailures: ["Lattice tearing", "Loss of volume operator coherence"],
            originalPosition: { x: Math.cos(angle)*30, y: 30, z: Math.sin(angle)*30 },
            explodedPosition: { x: Math.cos(angle)*80, y: 30, z: Math.sin(angle)*80 }
        });
    }

    // --- 6. The Spin Network Core (Nodes and Edges) ---
    const coreGroup = new THREE.Group();
    loomGroup.add(coreGroup);

    // Generate Nodes (Quanta of Volume)
    const numNodes = 150;
    const nodeRadius = 14;
    for (let i = 0; i < numNodes; i++) {
        // Distribute spherically
        const r = Math.pow(Math.random(), 1/3) * nodeRadius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, y, z);
        
        // Icosahedron for the node core
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
        const coreMat = (Math.random() > 0.5) ? glowingBlue : glowingPurple;
        const core = new THREE.Mesh(coreGeo, coreMat);
        
        // Wireframe wrapper
        const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.4 });
        const wire = new THREE.Mesh(coreGeo, wireMat);
        wire.scale.set(1.2, 1.2, 1.2);
        
        nodeGroup.add(core, wire);
        coreGroup.add(nodeGroup);
        
        animState.nodes.push({
            group: nodeGroup,
            core: core,
            wire: wire,
            pos: new THREE.Vector3(x, y, z),
            baseRadius: r,
            theta, phi,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Generate Edges (Quanta of Area)
    const edgeGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 8);
    edgeGeo.translate(0, 0.5, 0); // shift pivot to bottom for easy lookAt scaling

    for(let i=0; i<animState.nodes.length; i++) {
        for(let j=i+1; j<animState.nodes.length; j++) {
            const dist = animState.nodes[i].pos.distanceTo(animState.nodes[j].pos);
            // Connect nodes if they are close
            if(dist < 5.5) {
                const tube = new THREE.Mesh(edgeGeo, glowingOrange);
                coreGroup.add(tube);
                animState.edges.push({
                    mesh: tube,
                    source: animState.nodes[i],
                    target: animState.nodes[j]
                });
            }
        }
    }

    parts.push({
        name: "Planck-Scale Spin Foam Substrate",
        description: "A highly dynamic, self-intersecting graph representing the discrete geometry of space itself at 10^-35 meters.",
        material: "glass", // Representing transparency/energy
        function: "Calculates and manifests the area and volume operators of Loop Quantum Gravity.",
        assemblyOrder: 15,
        connections: ["Weaving Arms"],
        failureEffect: "Complete evaporation of the local spatial dimensions, reducing reality to a topological point.",
        cascadeFailures: ["Vacuum decay", "Complete information paradox"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });


    // --- Animation Function ---
    const animate = (time, speed, meshes) => {
        const delta = speed * 0.02;
        animState.time += delta;
        const t = animState.time;

        // 1. Animate Crawler Wheels
        animState.wheels.forEach(wheel => {
            wheel.rotation.z -= delta * 2; // Driving forward
        });

        // 2. Animate Containment Rings
        animState.rings.forEach(ringObj => {
            ringObj.mesh.rotateOnAxis(ringObj.axis, ringObj.speed * delta);
        });

        // 3. Animate Weaving Arms (Complex kinematics)
        animState.arms.forEach(arm => {
            const phase = t + arm.basePhase;
            // Shoulder moves up and down
            arm.shoulder.rotation.z = Math.sin(phase) * 0.6;
            // Elbow bends
            arm.elbow.rotation.z = Math.cos(phase * 1.3) * 0.8 + 0.5;
            // Wrist twists
            arm.wrist.rotation.y = phase * 2;
            
            // Claws open and close (simulating Weaving)
            arm.claws.forEach((claw, idx) => {
                claw.rotation.x = (Math.sin(phase * 4 + idx) * 0.5 + 0.5) * (Math.PI/6) + 0.1;
            });
        });

        // 4. Animate Spin Network Nodes (Breathing and Phase shifts)
        animState.nodes.forEach(node => {
            // Pulse size
            const scale = 1.0 + Math.sin(t * 3 + node.phase) * 0.2;
            node.group.scale.set(scale, scale, scale);
            
            // Wobble positions slightly to simulate quantum fluctuations
            node.group.position.x = node.pos.x + Math.sin(t * 2 + node.phi) * 0.5;
            node.group.position.y = node.pos.y + Math.cos(t * 2.5 + node.theta) * 0.5;
            node.group.position.z = node.pos.z + Math.sin(t * 1.8 + node.phase) * 0.5;
            
            // Flicker emissive intensity
            node.core.material.emissiveIntensity = 1.5 + Math.abs(Math.sin(t * 5 + node.phase)) * 2;
        });

        // 5. Update Spin Network Edges (Dynamic connections)
        // This visually simulates Pachner moves as distances change and lines shift
        animState.edges.forEach(edge => {
            const p1 = edge.source.group.position;
            const p2 = edge.target.group.position;
            const dist = p1.distanceTo(p2);
            
            edge.mesh.position.copy(p1);
            edge.mesh.lookAt(p2);
            edge.mesh.scale.y = dist;
            edge.mesh.rotation.x += Math.PI / 2; // align Cylinder with Z axis

            // If stretched too far, fade out (Topology change simulation)
            if(dist > 7.0) {
                edge.mesh.material.opacity = Math.max(0, edge.mesh.material.opacity - 0.05);
            } else {
                edge.mesh.material.opacity = Math.min(0.8, edge.mesh.material.opacity + 0.05);
            }
        });

        // 6. Animate Control Cabin Screens
        animState.screens.forEach((screen, idx) => {
            screen.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
        });
    };

    // --- PhD Level Quiz Questions on Loop Quantum Gravity ---
    const quizQuestions = [
        {
            question: "In Loop Quantum Gravity, the kinematic Hilbert space is defined on a graph. What is the physical interpretation of the quantum operators associated with the nodes and links (edges) of a spin network state?",
            options: [
                "Nodes represent quanta of 3D volume, while links represent quanta of 2D area separating these volumes.",
                "Nodes represent point particles in spacetime, while links represent the gravitational force acting between them.",
                "Nodes represent singularities, while links represent closed timelike curves.",
                "Nodes represent discrete time steps, while links represent the spatial distance traveled by a photon."
            ],
            correctAnswer: 0,
            explanation: "In LQG, space is fundamentally discrete. The volume operator has non-zero eigenvalues only at the nodes of the spin network, meaning nodes carry quantized chunks of volume. The links piercing surfaces carry quanta of area, described by the area operator."
        },
        {
            question: "The spectrum of the area operator in LQG is discrete. If a single surface is intersected by exactly one link of a spin network carrying spin 'j', what is the corresponding area eigenvalue?",
            options: [
                "A = 8 \\pi \\gamma l_P^2 \\sqrt{j(j+1)}",
                "A = 4 \\pi \\gamma l_P^2 j(j+1)",
                "A = \\gamma l_P^2 (2j + 1)",
                "A = 8 \\pi \\gamma l_P^2 j^2"
            ],
            correctAnswer: 0,
            explanation: "The area spectrum formula is A = 8 \\pi \\gamma l_P^2 \\sqrt{j(j+1)}, where \\gamma is the Barbero-Immirzi parameter, l_P is the Planck length, and j is the spin representation of SU(2) (j = 1/2, 1, 3/2, ...). This shows the discrete, quantized nature of geometry in LQG."
        },
        {
            question: "In the Spin Foam formalism, which provides a path integral formulation of LQG, the dynamics are defined by summing over histories of spin networks. A fundamental evolution step in this discrete spacetime history is a 'Pachner move'. What does a 1-4 Pachner move geometrically represent in the dual triangulation?",
            options: [
                "A single 3-simplex (tetrahedron) being subdivided into four smaller 3-simplices by inserting a vertex in its interior.",
                "Two adjacent 3-simplices merging into a single larger 3-simplex to conserve volume.",
                "A spin network node increasing its valence from 1 to 4 without altering the surrounding volume.",
                "The continuous deformation of a single spacelike hypersurface into four distinct disconnected universes."
            ],
            correctAnswer: 0,
            explanation: "A 1-4 Pachner move takes one tetrahedron (a 3-simplex) and places a vertex inside it, connecting it to the four existing vertices, thereby replacing the single tetrahedron with four new tetrahedra. In the dual spin network, this corresponds to a single node splitting into four connected nodes."
        },
        {
            question: "The formulation of classical General Relativity that serves as the starting point for LQG is based on Ashtekar variables. Which of the following best describes these variables?",
            options: [
                "They consist of an SU(2) connection (the Ashtekar connection) and its conjugate momentum, which is a densitized triad field.",
                "They consist of the spacetime metric tensor and the extrinsic curvature of spacelike hypersurfaces.",
                "They are a set of gauge-invariant scalar fields that describe the conformal geometry of spacetime.",
                "They utilize the Weyl tensor and the stress-energy tensor as a canonical conjugate pair."
            ],
            correctAnswer: 0,
            explanation: "Ashtekar variables reformulate General Relativity as a gauge theory. The configuration variable is an SU(2) connection (A_a^i), and its canonical conjugate is a densitized triad (E^a_i). This formulation is essential because it allows for background-independent quantization techniques similar to Yang-Mills theories."
        },
        {
            question: "To define the quantum dynamics of LQG, one must promote the Hamiltonian constraint to a well-defined quantum operator. The 'Thiemann trick' is a crucial mathematical technique used in this process. What is its primary function?",
            options: [
                "It expresses the non-polynomial dependence on the densitized triad in the classical Hamiltonian as the Poisson bracket between the connection and the volume of space, which can then be straightforwardly quantized.",
                "It entirely eliminates the Hamiltonian constraint by gauge-fixing the lapse function and shift vector before quantization.",
                "It redefines the spin network basis into a continuum limit where the Hamiltonian constraint becomes identical to the standard Wheeler-DeWitt equation.",
                "It introduces a cosmological constant that precisely cancels out the ultraviolet divergences in the area and volume spectra."
            ],
            correctAnswer: 0,
            explanation: "The classical Hamiltonian constraint contains terms like 1/sqrt(det(E)). Thomas Thiemann showed that this non-polynomial term can be rewritten using Poisson brackets {A, V} where V is the volume. Since the volume operator and holonomies of the connection are well-defined in the quantum theory, this allows the Hamiltonian constraint to be promoted to a valid quantum operator."
        }
    ];

    return { 
        group: machineGroup, 
        parts, 
        description: "The God-Tier Spin Network Quantum Gravity Loom. A macroscopic manifestation of Planck-scale physics capable of weaving the discrete fabric of spacetime itself using articulated holonomy manipulators and a spin foam substrate.", 
        quizQuestions, 
        animate 
    };
}
