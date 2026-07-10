import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "Mobile God-Tier Time Crystal Generator - A colossal, hyper-advanced off-road juggernaut housing a non-equilibrium macroscopic quantum state. It features extreme hydraulic stabilization, heavy-duty transport capabilities, and a central magneto-optical trap containing an oscillating Ytterbium-171 time crystal lattice driven by articulated Floquet laser booms.";

    // --- CUSTOM GLOWING MATERIALS ---
    const timeCrystalMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.8, wireframe: true
    });
    const ionCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.0
    });
    const laserBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
    });
    const quantumFieldMaterial = new THREE.MeshStandardMaterial({
        color: 0x8800ff, emissive: 0x4400aa, transparent: true, opacity: 0.2, wireframe: true
    });
    const neonScreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0
    });

    // --- ANIMATION STATE ARRAYS ---
    const wheels = [];
    const steeringWheels = [];
    const hydraulicPistons = [];
    const boomArms = [];
    const lasers = [];
    const ions = [];
    const radars = [];

    // --- HELPER FUNCTIONS ---
    function createRivet(x, y, z, rotationX=0, rotationY=0, rotationZ=0) {
        const rivetGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const rivet = new THREE.Mesh(rivetGeo, darkSteel);
        rivet.position.set(x, y, z);
        rivet.rotation.set(rotationX, rotationY, rotationZ);
        return rivet;
    }

    function createHydraulicCylinder(radius, length, extension=0) {
        const hydGroup = new THREE.Group();
        // Outer cylinder (housing)
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        outer.rotation.x = Math.PI / 2;
        hydGroup.add(outer);

        // Inner cylinder (piston)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 1.5, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.rotation.x = Math.PI / 2;
        inner.position.z = extension;
        hydGroup.add(inner);
        
        // Fluid lines
        const lineGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius, 0, -length/2 + 0.5),
            new THREE.Vector3(radius + 0.2, 0.5, 0),
            new THREE.Vector3(radius, 0, length/2 - 0.5)
        ]), 20, radius*0.15, 8, false);
        const line = new THREE.Mesh(lineGeo, rubber);
        hydGroup.add(line);

        hydraulicPistons.push({ outer, inner, baseZ: inner.position.z, length });
        return hydGroup;
    }

    // --- 1. MASSIVE OFF-ROAD CHASSIS & TIRES ---
    const chassisGroup = new THREE.Group();
    
    // Main Hull Frame
    const hullGeo = new THREE.BoxGeometry(16, 3, 40);
    const hull = new THREE.Mesh(hullGeo, darkSteel);
    hull.position.y = 5;
    chassisGroup.add(hull);

    // Armor Plating & Rivets
    const armorGeo = new THREE.BoxGeometry(16.5, 2.5, 10);
    for(let i=0; i<4; i++) {
        const armor = new THREE.Mesh(armorGeo, steel);
        armor.position.set(0, 5, -14 + i*9);
        chassisGroup.add(armor);
        // Add rivets to armor
        for(let rx=-8; rx<=8; rx+=16) {
            for(let rz=-4; rz<=4; rz+=8) {
                chassisGroup.add(createRivet(rx, 5, -14 + i*9 + rz));
            }
        }
    }

    // High-Tech Tires with complex treads
    function createWheel() {
        const wheelGroup = new THREE.Group();
        
        // Main tire body
        const tireGeo = new THREE.TorusGeometry(3.5, 1.5, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);

        // Aggressive Off-Road Lugs (Hundreds of them)
        const lugGeo = new THREE.BoxGeometry(1.8, 0.6, 0.8);
        const numLugs = 60;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(0, Math.cos(angle) * 4.9, Math.sin(angle) * 4.9);
            lug.rotation.x = -angle;
            // Angle the treads slightly like a tractor tire
            lug.rotation.y = (i % 2 === 0) ? 0.3 : -0.3;
            wheelGroup.add(lug);
        }

        // Complex Rim (Cylinders and Spokes)
        const rimOuterGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.6, 32);
        const rimOuter = new THREE.Mesh(rimOuterGeo, steel);
        rimOuter.rotation.z = Math.PI / 2;
        wheelGroup.add(rimOuter);

        const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8);
        for(let i=0; i<8; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            const angle = (i/8) * Math.PI * 2;
            spoke.position.set(0, Math.cos(angle)*1.25, Math.sin(angle)*1.25);
            spoke.rotation.x = -angle;
            wheelGroup.add(spoke);
        }

        return wheelGroup;
    }

    const wheelPositions = [
        {x: 10, y: 3.5, z: 14}, {x: -10, y: 3.5, z: 14},
        {x: 10, y: 3.5, z: 0},  {x: -10, y: 3.5, z: 0},
        {x: 10, y: 3.5, z: -14},{x: -10, y: 3.5, z: -14}
    ];

    wheelPositions.forEach((pos, idx) => {
        const wheel = createWheel();
        wheel.position.set(pos.x, pos.y, pos.z);
        chassisGroup.add(wheel);
        wheels.push(wheel);

        // Axles
        if (idx % 2 === 0) {
            const axleGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 16);
            const axle = new THREE.Mesh(axleGeo, darkSteel);
            axle.rotation.z = Math.PI / 2;
            axle.position.set(0, pos.y, pos.z);
            chassisGroup.add(axle);
        }
    });

    group.add(chassisGroup);
    parts.push({
        name: "Hex-Drive All-Terrain Chassis",
        description: "Massive 6x6 drivetrain utilizing custom aggressive-tread Torus geometries. Independent hydraulic suspension for zero-vibration quantum transport.",
        material: "Dark Steel / Rubber / Chrome",
        function: "Mobility and vibration dampening",
        assemblyOrder: 1,
        connections: ["Axles", "Hull", "Main Reactor"],
        failureEffect: "Vehicle immobilized; extreme seismic feedback disrupts the quantum trap.",
        cascadeFailures: ["Time Crystal Decoherence"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // --- 2. OPERATOR CABIN ---
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 8, 16);

    // Cabin Shell
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-4, -2);
    cabShape.lineTo(4, -2);
    cabShape.lineTo(4, 2);
    cabShape.lineTo(2, 5);
    cabShape.lineTo(-2, 5);
    cabShape.lineTo(-4, 2);
    cabShape.lineTo(-4, -2);
    
    const extrudeSettings = { depth: 6, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, extrudeSettings);
    const cabinMesh = new THREE.Mesh(cabGeo, steel);
    cabinMesh.position.z = -3;
    cabinGroup.add(cabinMesh);

    // Tinted Glass Windows
    const winShape = new THREE.Shape();
    winShape.moveTo(-3.5, 0);
    winShape.lineTo(3.5, 0);
    winShape.lineTo(1.8, 4);
    winShape.lineTo(-1.8, 4);
    winShape.lineTo(-3.5, 0);
    const winGeo = new THREE.ExtrudeGeometry(winShape, { depth: 0.5, bevelEnabled: false });
    const windowFront = new THREE.Mesh(winGeo, tinted);
    windowFront.position.set(0, 0, 3);
    cabinGroup.add(windowFront);

    // Interior Details
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, 0, 0);
    
    // Seats
    const seatGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
    const seat1 = new THREE.Mesh(seatGeo, rubber);
    seat1.position.set(-1.5, -1, 1);
    const seat2 = new THREE.Mesh(seatGeo, rubber);
    seat2.position.set(1.5, -1, 1);
    interiorGroup.add(seat1, seat2);

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(6, 1.5, 2);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, 0, 2);
    panel.rotation.x = -Math.PI / 6;
    
    // Glowing Screens on panel
    const screenGeo = new THREE.PlaneGeometry(1.5, 1);
    for(let i=-1.5; i<=1.5; i+=1.5) {
        const screen = new THREE.Mesh(screenGeo, neonScreenMaterial);
        screen.position.set(i, 0.76, 0);
        screen.rotation.x = -Math.PI/2;
        panel.add(screen);
    }
    
    // Steering Wheel & Joysticks
    const steeringGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    const steering = new THREE.Mesh(steeringGeo, plastic);
    steering.position.set(-1.5, 0.8, 0.5);
    steering.rotation.x = -Math.PI/4;
    panel.add(steering);
    steeringWheels.push(steering);

    const stickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const stick = new THREE.Mesh(stickGeo, chrome);
    stick.position.set(1.5, 1, 0.5);
    panel.add(stick);

    interiorGroup.add(panel);
    cabinGroup.add(interiorGroup);

    // Side Mirrors
    const mirrorBracketGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const mirrorBracketL = new THREE.Mesh(mirrorBracketGeo, darkSteel);
    mirrorBracketL.position.set(-4.5, 1, 2);
    mirrorBracketL.rotation.z = Math.PI/2;
    const mirrorGeo = new THREE.BoxGeometry(0.2, 1.5, 0.8);
    const mirrorL = new THREE.Mesh(mirrorGeo, chrome);
    mirrorL.position.set(-5.2, 1, 2);
    cabinGroup.add(mirrorBracketL, mirrorL);

    const mirrorBracketR = mirrorBracketL.clone();
    mirrorBracketR.position.x = 4.5;
    const mirrorR = mirrorL.clone();
    mirrorR.position.x = 5.2;
    cabinGroup.add(mirrorBracketR, mirrorR);

    // Ladders and Grilles
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const rungGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(-0.75, -2, 0);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(0.75, -2, 0);
    ladderGroup.add(rail1, rail2);
    for(let i=0; i<6; i++) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.z = Math.PI/2;
        rung.position.set(0, -4 + i, 0);
        ladderGroup.add(rung);
    }
    ladderGroup.position.set(-4.5, -3, -2);
    cabinGroup.add(ladderGroup);

    group.add(cabinGroup);
    parts.push({
        name: "Command & Control Cabin",
        description: "Heavily shielded operator cabin featuring tinted actinic-proof glass, multi-axis joysticks, and glowing diagnostic screens for monitoring Floquet resonance.",
        material: "Steel / Tinted Glass / Plastic",
        function: "Operator safety and vehicle/crystal control",
        assemblyOrder: 2,
        connections: ["Hull", "Control Avionics"],
        failureEffect: "Loss of manual override and operator fatal radiation exposure.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: {x: 0, y: 8, z: 16},
        explodedPosition: {x: 0, y: 15, z: 25}
    });

    // --- 3. EXHAUST STACKS & HYDRAULIC STABILIZERS ---
    const exhaustGroup = new THREE.Group();
    const stackGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 32);
    for(let i=-1; i<=1; i+=2) {
        const stack = new THREE.Mesh(stackGeo, chrome);
        stack.position.set(i*5, 10, 10);
        
        // Flap
        const flapGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 32);
        const flap = new THREE.Mesh(flapGeo, darkSteel);
        flap.position.set(0, 4.1, 0);
        flap.rotation.x = Math.PI/6;
        stack.add(flap);
        
        exhaustGroup.add(stack);
    }
    group.add(exhaustGroup);

    // Stabilizer Legs
    const stabs = [
        {x: 8, z: 10}, {x: -8, z: 10},
        {x: 8, z: -10}, {x: -8, z: -10}
    ];
    stabs.forEach(pos => {
        const stabArm = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 1), steel);
        stabArm.position.set(pos.x > 0 ? pos.x + 2 : pos.x - 2, 6, pos.z);
        const hyd = createHydraulicCylinder(0.6, 6, 2);
        hyd.position.set(pos.x > 0 ? pos.x + 4 : pos.x - 4, 3, pos.z);
        hyd.rotation.y = Math.PI/2;
        hyd.rotation.x = Math.PI/2;
        
        const pad = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), darkSteel);
        pad.position.set(0, 0, 4);
        hyd.add(pad);
        
        chassisGroup.add(stabArm, hyd);
    });

    parts.push({
        name: "Hydraulic Ground Stabilizers",
        description: "Four massive high-pressure hydraulic outriggers that deploy into the bedrock, ensuring absolute zero spatial translation during crystal operation.",
        material: "Chrome / Dark Steel",
        function: "Seismic grounding",
        assemblyOrder: 3,
        connections: ["Hull", "Bedrock"],
        failureEffect: "Lattice misalignment due to planetary micro-seisms.",
        cascadeFailures: ["Quantum Decoherence"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 15, y: -5, z: 0}
    });

    // --- 4. THE TIME CRYSTAL CRYOSTAT (MAGNETO-OPTICAL TRAP) ---
    const cryoGroup = new THREE.Group();
    cryoGroup.position.set(0, 12, -4);

    // Outer Containment Dome
    const domeGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0), new THREE.Vector2(6, 0),
        new THREE.Vector2(8, 2), new THREE.Vector2(8, 12),
        new THREE.Vector2(6, 14), new THREE.Vector2(0, 14)
    ], 64);
    const dome = new THREE.Mesh(domeGeo, chrome);
    dome.material.side = THREE.DoubleSide;
    cryoGroup.add(dome);

    // Inner Radiation Shield with intricate tubing
    const shieldGeo = new THREE.CylinderGeometry(6, 6, 10, 64, 1, true);
    const shield = new THREE.Mesh(shieldGeo, copper);
    shield.position.y = 7;
    cryoGroup.add(shield);

    // Liquid Helium Cooling Pipes wrapping the cryostat
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const pipeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*8.2, 2, Math.sin(angle)*8.2),
            new THREE.Vector3(Math.cos(angle+0.5)*8.5, 7, Math.sin(angle+0.5)*8.5),
            new THREE.Vector3(Math.cos(angle)*8.2, 12, Math.sin(angle)*8.2)
        ]), 32, 0.2, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        cryoGroup.add(pipe);
    }

    // Heavy Flanges and Bolts
    const flangeGeo = new THREE.TorusGeometry(8.1, 0.4, 16, 64);
    const topFlange = new THREE.Mesh(flangeGeo, darkSteel);
    topFlange.rotation.x = Math.PI/2;
    topFlange.position.y = 12;
    cryoGroup.add(topFlange);
    
    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI*2;
        cryoGroup.add(createRivet(Math.cos(angle)*8.1, 12.2, Math.sin(angle)*8.1));
    }

    group.add(cryoGroup);
    parts.push({
        name: "Superconducting Vacuum Cryostat",
        description: "The heart of the machine. Houses the ultra-high vacuum chamber and superconducting Helmholtz coils, maintaining a 4 Kelvin environment.",
        material: "Chrome / Copper / Niobium-Titanium",
        function: "Environmental isolation for quantum states",
        assemblyOrder: 4,
        connections: ["Hull Base", "Cooling Manifold"],
        failureEffect: "Instant thermalization, destroying the time-translation symmetry breaking phase.",
        cascadeFailures: ["Explosive Helium Quench"],
        originalPosition: {x: 0, y: 12, z: -4},
        explodedPosition: {x: 0, y: 25, z: -4}
    });

    // --- 5. THE TIME CRYSTAL LATTICE ---
    const latticeGroup = new THREE.Group();
    latticeGroup.position.set(0, 19, -4); // Center of cryostat

    const latticeSize = 3;
    const spacing = 1.0;
    
    const nodeGeo = new THREE.IcosahedronGeometry(0.2, 2);
    const coreGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const orbitalGeo = new THREE.TorusGeometry(0.3, 0.02, 16, 64);

    for (let x = -latticeSize; x <= latticeSize; x++) {
        for (let y = -latticeSize; y <= latticeSize; y++) {
            for (let z = -latticeSize; z <= latticeSize; z++) {
                if (x*x + y*y + z*z > latticeSize*latticeSize) continue;

                const ionGroup = new THREE.Group();
                
                const shell = new THREE.Mesh(nodeGeo, timeCrystalMaterial);
                const core = new THREE.Mesh(coreGeo, ionCoreMaterial);
                
                const orbital1 = new THREE.Mesh(orbitalGeo, quantumFieldMaterial);
                orbital1.rotation.x = Math.PI / 2;
                const orbital2 = new THREE.Mesh(orbitalGeo, quantumFieldMaterial);
                orbital2.rotation.y = Math.PI / 2;
                const orbital3 = new THREE.Mesh(orbitalGeo, quantumFieldMaterial);
                orbital3.rotation.z = Math.PI / 2;

                ionGroup.add(shell, core, orbital1, orbital2, orbital3);
                ionGroup.position.set(x * spacing, y * spacing, z * spacing);
                
                ionGroup.userData = {
                    initialPosition: ionGroup.position.clone(),
                    phase: (x + y + z) * 0.8
                };

                latticeGroup.add(ionGroup);
                ions.push(ionGroup);
            }
        }
    }
    group.add(latticeGroup);
    parts.push({
        name: "Ytterbium-171 Ion Lattice (Time Crystal Core)",
        description: "An interacting many-body ensemble exhibiting rigid, robust sub-harmonic oscillations, endlessly breaking continuous time-translation symmetry without entropy production.",
        material: "Quantum Plasma",
        function: "Macroscopic quantum oscillator",
        assemblyOrder: 10,
        connections: ["Optical Trap"],
        failureEffect: "Thermalization into a trivial chaotic state.",
        cascadeFailures: ["Loss of Time-Symmetry"],
        originalPosition: {x: 0, y: 19, z: -4},
        explodedPosition: {x: 0, y: 19, z: -4}
    });

    // --- 6. ARTICULATED LASER BOOM ARMS (FLOQUET DRIVE) ---
    const armGroup = new THREE.Group();
    
    function createBoomArm(angle) {
        const boom = new THREE.Group();
        
        // Base Swivel
        const swivel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2, 32), darkSteel);
        swivel.position.set(Math.cos(angle)*12, 10, -4 + Math.sin(angle)*12);
        
        // Primary Arm
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 10, 1.5), steel);
        arm1.position.set(0, 5, 0);
        arm1.rotation.z = -Math.PI/6;
        swivel.add(arm1);

        // Hydraulic on arm
        const hyd = createHydraulicCylinder(0.4, 4, 1);
        hyd.position.set(-1, 3, 0);
        hyd.rotation.z = Math.PI/6;
        swivel.add(hyd);

        // Secondary Arm Pivot
        const pivot = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 32), chrome);
        pivot.rotation.x = Math.PI/2;
        pivot.position.set(-4.5, 9, 0);
        swivel.add(pivot);

        // Laser Emitter Housing
        const emitter = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 4), aluminum);
        emitter.position.set(-6, 12, 0);
        
        // Lenses
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32), glass);
        lens.rotation.x = Math.PI/2;
        lens.position.set(0, 0, 2.1);
        emitter.add(lens);

        // The Laser Beam
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.3, 20, 16);
        const beam = new THREE.Mesh(beamGeo, laserBeamMaterial);
        beam.rotation.x = Math.PI/2;
        beam.position.set(0, 0, 12);
        emitter.add(beam);

        swivel.add(emitter);
        
        // Rotate entire assembly to face the cryostat core
        swivel.lookAt(new THREE.Vector3(0, 19, -4));
        
        boomArms.push({swivel, emitter, phase: angle});
        lasers.push({mesh: emitter, beam: beam, phase: angle});

        return swivel;
    }

    for(let i=0; i<6; i++) {
        armGroup.add(createBoomArm((i/6) * Math.PI*2));
    }
    group.add(armGroup);
    
    parts.push({
        name: "Syncopated Floquet Laser Arrays",
        description: "Heavy articulated hydraulic boom arms housing ultrastable pulse lasers. They deliver the precise periodic sequence of π-pulses required to drive the many-body localized state.",
        material: "Steel / Aluminum / Optics",
        function: "Hamiltonian modulation (Time-translation drive)",
        assemblyOrder: 5,
        connections: ["Hull", "Control Electronics"],
        failureEffect: "Pulse timing jitter causes the crystal to absorb energy and melt.",
        cascadeFailures: ["Complete System Annihilation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -25, y: 5, z: -25}
    });

    // --- 7. SENSOR ARRAYS & RADAR ---
    const radarGroup = new THREE.Group();
    const dishGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI*2, 0, Math.PI/3);
    const dish = new THREE.Mesh(dishGeo, chrome);
    dish.position.set(0, 22, 5);
    dish.rotation.x = -Math.PI/4;
    
    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.position.set(0, 2, 0);
    dish.add(antenna);
    
    radarGroup.add(dish);
    radars.push(dish);
    group.add(radarGroup);

    // --- EXTREME ANIMATION LOGIC ---
    let drivePhase = 0;
    const driveFrequency = 0.5; // The period T

    function animate(time, speed, meshes) {
        const dt = speed * 0.016;
        drivePhase += dt * driveFrequency * Math.PI * 2;
        
        // Sub-harmonic response (period 2T)
        const macroscopicState = Math.cos(drivePhase * 0.5); 
        
        // 1. Time Crystal Dynamics
        latticeGroup.rotation.y = time * 0.2 * speed;
        latticeGroup.rotation.z = Math.sin(time * 0.1 * speed) * 0.15;

        ions.forEach((ion) => {
            const data = ion.userData;
            // Complex breathing mode breaking continuous spatial symmetry
            const breathe = 1 + 0.15 * macroscopicState * Math.sin(data.phase + time * 3);
            ion.position.copy(data.initialPosition).multiplyScalar(breathe);
            
            // Spin state visualization
            const r = 0.1 + 0.9 * ((1 - macroscopicState)/2);
            const b = 0.1 + 0.9 * ((1 + macroscopicState)/2);
            ion.children[0].material.color.setRGB(r, 0.5, b);
            ion.children[0].material.emissive.setRGB(r*1.5, 0.5, b*1.5);
            
            // Frantic orbital spinning
            ion.children[2].rotation.x += 0.1 * speed * macroscopicState;
            ion.children[3].rotation.y -= 0.12 * speed * macroscopicState;
            ion.children[4].rotation.z += 0.08 * speed * macroscopicState;
        });

        // 2. Floquet Laser Syncopation
        const driveSignal = Math.pow(Math.sin(drivePhase), 40); // Extremely sharp pulse
        lasers.forEach(laserObj => {
            // Complex syncopated firing pattern combining global drive and local phase
            const pulse = Math.pow(Math.sin(drivePhase + laserObj.phase), 20);
            laserObj.beam.material.opacity = 0.1 + 0.9 * pulse;
            
            // Mechanical recoil simulation on the boom arms
            laserObj.mesh.position.z = Math.sin(pulse) * -0.2 * speed; 
        });

        // 3. Vehicle Mechanics (Idling Vibration & Radar)
        const idleVib = Math.sin(time * 30) * 0.02 * speed;
        chassisGroup.position.y = idleVib;
        cabinGroup.position.y = 8 + idleVib * 0.5;

        radars.forEach(radar => {
            radar.rotation.z = time * 0.5 * speed;
        });

        steeringWheels.forEach(sw => {
            sw.rotation.z = Math.sin(time * 2) * 0.5;
        });

        wheels.forEach(wheel => {
            // Only rotate if moving, but we're idling, so slight jitter
            wheel.rotation.x = Math.sin(time * 5 + wheel.position.z) * 0.05 * speed;
        });

        hydraulicPistons.forEach(pist => {
            // Slight pressure adjustments
            pist.inner.position.z = pist.baseZ + Math.sin(time * 10 + pist.length) * 0.05 * speed;
        });

        // 4. Material pulsing
        timeCrystalMaterial.opacity = 0.5 + 0.5 * Math.abs(macroscopicState);
        quantumFieldMaterial.opacity = 0.1 + 0.3 * Math.random(); // Quantum fluctuations
        neonScreenMaterial.emissiveIntensity = 0.5 + 0.5 * Math.random(); // Flickering screens
    }

    // --- PhD LEVEL QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the realization of a discrete time crystal using a chain of trapped ions, the Hamiltonian undergoes periodic kicking. If the ideal pulse is a perfect π-rotation, what ensures the stability of the subharmonic 2T response when the pulse is imperfect (e.g., π - ε)?",
            options: [
                "The infinite temperature of the system.",
                "Strong many-body interactions (e.g., Ising coupling) combined with disorder, leading to many-body localization.",
                "The rapid thermalization of the spins to the surrounding vacuum.",
                "Continuous emission of phonons into the optical lattice."
            ],
            answer: 1,
            explanation: "Rigidity in a time crystal requires the system to resist small perturbations (like imperfect pulses). Strong interactions lock the spins together, and disorder prevents them from absorbing energy from the drive (MBL), ensuring the collective subharmonic flip remains stable."
        },
        {
            question: "According to the no-go theorems by Watanabe and Oshikawa, why is it impossible to form a continuous time crystal in the ground state or in thermal equilibrium?",
            options: [
                "Because correlation functions of local observables in thermal equilibrium cannot exhibit sustained time-dependent oscillations without external driving.",
                "Because absolute zero cannot be reached in a laboratory.",
                "Because Pauli exclusion principle prevents spontaneous symmetry breaking in fermions.",
                "Because the Hamiltonian would require imaginary eigenvalues."
            ],
            answer: 0,
            explanation: "In thermal equilibrium, the state is stationary. The expectation value of any observable is time-independent. Therefore, spontaneous breaking of continuous time-translation symmetry is strictly forbidden in equilibrium; it requires a driven, non-equilibrium setup."
        },
        {
            question: "In a Floquet time crystal, the system exhibits 'spatiotemporal order'. If the spatial lattice has a lattice constant 'a' and the drive period is 'T', what characterizes the discrete symmetry breaking?",
            options: [
                "The system becomes perfectly homogeneous in space and time.",
                "The system exhibits a response that is invariant under (x → x + a) but only invariant under (t → t + nT) where n > 1.",
                "The spatial lattice constant 'a' expands to '2a' while the time period remains 'T'.",
                "The system emits entangled photons at a frequency of 1/T."
            ],
            answer: 1,
            explanation: "Discrete time-translation symmetry breaking means the system is driven with period T, but the observable dynamics only repeat after a multiple of T (like 2T or 3T). The spatial symmetry (lattice constant) remains intact while the temporal symmetry is broken to a lower subgroup."
        },
        {
            question: "What is the primary role of the disordered field (often applied via programmable lasers or magnetic gradients) in the trapped-ion implementation of a time crystal?",
            options: [
                "To perfectly align all spins into a ferromagnetic ground state.",
                "To cool the ions via Doppler cooling.",
                "To induce Many-Body Localization (MBL), preventing the Floquet drive from heating the system to an infinite-temperature featureless state.",
                "To create a topological insulator phase."
            ],
            answer: 2,
            explanation: "A periodically driven interacting system will typically absorb energy and heat up (Eigenstate Thermalization Hypothesis). Introducing strong disorder causes Many-Body Localization, breaking ergodicity and allowing the non-equilibrium time crystal phase to persist indefinitely without heating."
        },
        {
            question: "If a discrete time crystal is prepared in an initial state that is a superposition of its two macroscopic spin states (e.g., |All Up⟩ + |All Down⟩), what happens to the subharmonic oscillation?",
            options: [
                "The oscillation frequency doubles.",
                "The oscillation vanishes because the expectation value of the magnetization is identically zero in this symmetric superposition.",
                "The state instantly collapses into a black hole.",
                "The superposition is protected by parity symmetry and oscillates with period T/2."
            ],
            answer: 1,
            explanation: "A time crystal represents spontaneous symmetry breaking. If the system is in a perfect 'cat state' superposition of the two macroscopic states, the expectation value of the magnetization is zero at all times. The observable oscillations only appear when the symmetry is broken and the system chooses one of the macroscopic branches."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
