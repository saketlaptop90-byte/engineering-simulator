import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 1. HYPER-TECH CUSTOM MATERIALS
    // ==========================================
    const singularityMat = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        roughness: 0.0, 
        metalness: 1.0, 
        emissive: 0x000000 
    });

    const ergosphereMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x220033, 
        transparent: true, 
        opacity: 0.3, 
        roughness: 0.1, 
        transmission: 0.9, 
        ior: 1.5, 
        emissive: 0x110022, 
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });

    const accretionInnerMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0x7700ff, 
        emissiveIntensity: 10.0, 
        transparent: true, 
        opacity: 0.9, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const accretionOuterMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0xff5500, 
        emissiveIntensity: 5.0, 
        transparent: true, 
        opacity: 0.7, 
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const fractalCPUMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.85, 
        transmission: 1.0, 
        ior: 2.2, 
        roughness: 0.0, 
        metalness: 0.2, 
        emissive: 0x00aaaa, 
        emissiveIntensity: 2.0, 
        clearcoat: 1.0, 
        clearcoatRoughness: 0.1 
    });

    const chronosphereMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x001133, 
        transparent: true, 
        opacity: 0.15, 
        transmission: 0.95, 
        ior: 1.1, 
        roughness: 0.05, 
        metalness: 0.1, 
        side: THREE.DoubleSide 
    });

    const tachyonMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        transparent: true, 
        opacity: 0.8, 
        blending: THREE.AdditiveBlending 
    });

    const oracleMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        metalness: 1.0, 
        roughness: 0.2, 
        emissive: 0xcc6600, 
        emissiveIntensity: 1.5 
    });

    const dataStreamMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffcc, 
        emissive: 0x00ffcc, 
        emissiveIntensity: 3.0, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.5 
    });

    const screenMat = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        emissive: 0x00ff00, 
        emissiveIntensity: 1.5 
    });

    const glowingRedMat = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        emissive: 0xff0000, 
        emissiveIntensity: 2.0 
    });

    const glowingBlueMat = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, 
        emissive: 0x0000ff, 
        emissiveIntensity: 2.0 
    });

    const quantumRegisterMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        emissive: 0x8800ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8
    });

    // ==========================================
    // 2. CORE UTILITY FUNCTIONS
    // ==========================================
    function addPart(mesh, name, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, origPos, explPos) {
        mesh.position.copy(origPos);
        group.add(mesh);
        parts.push({
            name: name,
            description: description,
            material: materialName,
            function: functionDesc,
            assemblyOrder: assemblyOrder,
            connections: connections,
            failureEffect: failureEffect,
            cascadeFailures: cascadeFailures,
            originalPosition: { x: origPos.x, y: origPos.y, z: origPos.z },
            explodedPosition: { x: explPos.x, y: explPos.y, z: explPos.z }
        });
    }

    class CTC_Curve extends THREE.Curve {
        constructor(scale = 1, offset = 0, frequency = 4) {
            super();
            this.scale = scale;
            this.offset = offset;
            this.frequency = frequency;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(2 * Math.PI * t + this.offset) * 18 * this.scale;
            const ty = Math.sin(this.frequency * Math.PI * t) * 12 * this.scale + 15;
            const tz = Math.sin(2 * Math.PI * t + this.offset) * 18 * this.scale;
            return optionalTarget.set(tx, ty, tz);
        }
    }

    class SpiralCurve extends THREE.Curve {
        constructor(radius = 10, height = 20, turns = 5) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const tx = Math.cos(angle) * this.radius;
            const ty = (t - 0.5) * this.height;
            const tz = Math.sin(angle) * this.radius;
            return optionalTarget.set(tx, ty, tz);
        }
    }

    // ==========================================
    // 3. SPATIOTEMPORAL CHASSIS & MOBILITY
    // ==========================================
    
    // Main Base Structure using highly detailed LatheGeometry
    const basePoints = [];
    for ( let i = 0; i < 40; i ++ ) {
        basePoints.push( new THREE.Vector2( Math.sin( i * 0.15 ) * 8 + 22, ( i - 20 ) * 0.8 ) );
    }
    const baseGeo = new THREE.LatheGeometry( basePoints, 128 );
    const baseMesh = new THREE.Mesh( baseGeo, darkSteel );
    addPart(baseMesh, 
        "Spacetime Manifold Chassis Base", 
        "A monumental anchoring platform forged from collapsed neutronium star matter. It actively stabilizes the local dimensional fabric, counteracting the immense gravitational shear generated by the onboard micro-singularity. Embedded graviton emitters run along its ridges.", 
        "Neutronium-Laced Dark Steel", 
        "Provides the foundational structural integrity and gravitational shielding for the hypercomputation field.", 
        1, 
        ["Hydraulic_Suspension_Network", "Singularity_Containment_Vessel"], 
        "Catastrophic dimensional shear, instantly tearing the machine apart into constituent subatomic particles across multiple timelines.", 
        ["Total Existential Collapse", "Spacetime Rupture", "False Vacuum Decay"], 
        new THREE.Vector3(0, -8, 0), 
        new THREE.Vector3(0, -35, 0)
    );

    // Advanced Off-Road Quantum Treads (Wheels)
    function createWheel(namePrefix, pos, explPos, angleOffset) {
        const wheelGroup = new THREE.Group();
        
        // Complex Rim (Cylinder with deep indentations)
        const rimGeo = new THREE.CylinderGeometry(6, 6, 5, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Inner glowing hub
        const hubGeo = new THREE.CylinderGeometry(2, 2, 5.2, 32);
        const hub = new THREE.Mesh(hubGeo, glowingBlueMat);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        // Multi-layered Spokes
        for (let i = 0; i < 24; i++) {
            const spokeGeo = new THREE.BoxGeometry(0.6, 11.5, 1.8);
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.z = (Math.PI * 2 / 24) * i;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Thick Tire Base
        const tireGeo = new THREE.TorusGeometry(6.5, 2.5, 64, 128);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Aggressive Off-Road Treads (Hundreds of lugs)
        const numLugs = 120;
        for (let i = 0; i < numLugs; i++) {
            const lugGeo = new THREE.BoxGeometry(5.5, 1.2, 2.0);
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (Math.PI * 2 / numLugs) * i;
            lug.position.set(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5, 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? 0.35 : -0.35;
            wheelGroup.add(lug);
        }

        updatables.push({ mesh: wheelGroup, type: 'wheel', speed: 1.5 });
        addPart(wheelGroup, 
            `${namePrefix} Quantum Mobility Node`, 
            `A hyper-dense, ruggedized wheel featuring macroscopic quantum-grip lugs. Allows the Turing machine to physically drive across shifting dimensional topologies and rugged post-apocalyptic physical terrain while performing uncomputable calculations.`, 
            "Hyper-Rubber and Polished Chrome", 
            "Physical locomotion across Euclidean and non-Euclidean spatial landscapes.", 
            2, 
            ["Spacetime Manifold Chassis Base", "Hydraulic_Suspension"], 
            "Loss of mobility; the Turing machine becomes anchored to a single spatial coordinate.", 
            ["Temporal Stagnation", "Predestination Paradox Vulnerability"], 
            pos, 
            explPos
        );
    }
    
    // Position 4 massive wheels
    createWheel("Front_Left", new THREE.Vector3(-30, -10, 25), new THREE.Vector3(-55, -10, 45));
    createWheel("Front_Right", new THREE.Vector3(30, -10, 25), new THREE.Vector3(55, -10, 45));
    createWheel("Rear_Left", new THREE.Vector3(-30, -10, -25), new THREE.Vector3(-55, -10, -45));
    createWheel("Rear_Right", new THREE.Vector3(30, -10, -25), new THREE.Vector3(55, -10, -45));

    // Heavy Hydraulic Suspensions (Pistons within Pistons)
    function createSuspension(name, pos, explPos) {
        const susGroup = new THREE.Group();
        
        // Outer housing
        const cylinderOuterGeo = new THREE.CylinderGeometry(2.5, 2.5, 12, 32);
        const cylinderOuter = new THREE.Mesh(cylinderOuterGeo, steel);
        cylinderOuter.position.y = 6;
        
        // Inner piston
        const cylinderInnerGeo = new THREE.CylinderGeometry(1.8, 1.8, 14, 32);
        const cylinderInner = new THREE.Mesh(cylinderInnerGeo, chrome);
        cylinderInner.position.y = 0;
        
        // Hydraulic fluid tubes wrapping around
        const tubeCurve = new SpiralCurve(3.0, 10, 4);
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 64, 0.4, 8, false);
        const fluidTube = new THREE.Mesh(tubeGeo, pipeMat);
        fluidTube.position.y = 6;
        
        susGroup.add(cylinderOuter);
        susGroup.add(cylinderInner);
        susGroup.add(fluidTube);
        
        updatables.push({ mesh: cylinderInner, type: 'piston', baseY: 0, amp: 2.5, phase: Math.random() * Math.PI * 2 });
        addPart(susGroup, 
            name, 
            "A colossal hydraulic articulation joint stabilizing the dimensional chassis against the sheer recoil of reversing causality.", 
            "Forged Steel, Chrome, and Synthetic Rubber", 
            "Dampens quantum terrain vibrations and temporal shockwaves.", 
            3, 
            ["Quantum Mobility Node", "Chassis Base"], 
            "Severe chassis vibration leading to mechanical failure.", 
            ["Tachyon drift", "Misalignment of data streams"], 
            pos, 
            explPos
        );
    }
    
    createSuspension("Suspension_FL", new THREE.Vector3(-25, -5, 20), new THREE.Vector3(-45, -5, 35));
    createSuspension("Suspension_FR", new THREE.Vector3(25, -5, 20), new THREE.Vector3(45, -5, 35));
    createSuspension("Suspension_RL", new THREE.Vector3(-25, -5, -20), new THREE.Vector3(-45, -5, -35));
    createSuspension("Suspension_RR", new THREE.Vector3(25, -5, -20), new THREE.Vector3(45, -5, -35));

    // ==========================================
    // 4. DETAILED OPERATOR CABIN
    // ==========================================
    
    const cabinGroup = new THREE.Group();
    
    // Main Cabin Body via ExtrudeGeometry
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-8, 0);
    cabinShape.lineTo(8, 0);
    cabinShape.lineTo(10, 6);
    cabinShape.lineTo(6, 12);
    cabinShape.lineTo(-6, 12);
    cabinShape.lineTo(-10, 6);
    cabinShape.lineTo(-8, 0);

    const cabinExtrude = { depth: 14, bevelEnabled: true, bevelSegments: 8, steps: 2, bevelSize: 0.4, bevelThickness: 0.4 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    cabinGeo.translate(0, 0, -7);
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabinMesh);
    
    // Tinted Glass Windows (slightly smaller extrude)
    const windowShape = new THREE.Shape();
    windowShape.moveTo(-6, 1.5);
    windowShape.lineTo(6, 1.5);
    windowShape.lineTo(7.5, 5.5);
    windowShape.lineTo(4.5, 10.5);
    windowShape.lineTo(-4.5, 10.5);
    windowShape.lineTo(-7.5, 5.5);
    windowShape.lineTo(-6, 1.5);
    
    const windowExtrude = { depth: 14.4, bevelEnabled: false };
    const windowGeo = new THREE.ExtrudeGeometry(windowShape, windowExtrude);
    windowGeo.translate(0, 0, -7.2);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    cabinGroup.add(windowMesh);

    // Operator Seat
    const seatGeo = new THREE.BoxGeometry(4, 4, 4);
    const seatMesh = new THREE.Mesh(seatGeo, plastic);
    seatMesh.position.set(0, 2, -2);
    cabinGroup.add(seatMesh);

    // Steering Wheel (for physical space)
    const steeringBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const steeringBase = new THREE.Mesh(steeringBaseGeo, chrome);
    steeringBase.position.set(0, 4, 2);
    steeringBase.rotation.x = Math.PI / 4;
    const steeringWheelGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, rubber);
    steeringWheel.position.set(0, 5, 3);
    steeringWheel.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringBase);
    cabinGroup.add(steeringWheel);
    updatables.push({ mesh: steeringWheel, type: 'steering', speed: 1.0 });

    // Joysticks (for navigating N-dimensional configuration space)
    const joyBaseGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
    const joyStickGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const joyKnobGeo = new THREE.SphereGeometry(0.4, 16, 16);
    
    function createJoystick(xOffset) {
        const joyGroup = new THREE.Group();
        const base = new THREE.Mesh(joyBaseGeo, darkSteel);
        const stick = new THREE.Mesh(joyStickGeo, chrome);
        stick.position.y = 1;
        const knob = new THREE.Mesh(joyKnobGeo, glowingRedMat);
        knob.position.y = 2;
        joyGroup.add(base);
        joyGroup.add(stick);
        joyGroup.add(knob);
        joyGroup.position.set(xOffset, 3.5, 1);
        cabinGroup.add(joyGroup);
        updatables.push({ mesh: joyGroup, type: 'joystick', phase: Math.random() * Math.PI });
    }
    createJoystick(-3);
    createJoystick(3);

    // Glowing Control Panels
    const panelGeo = new THREE.PlaneGeometry(8, 3);
    const panelMesh = new THREE.Mesh(panelGeo, screenMat);
    panelMesh.position.set(0, 5.5, 4.5);
    panelMesh.rotation.x = -Math.PI / 6;
    cabinGroup.add(panelMesh);
    updatables.push({ mesh: panelMesh, type: 'screenPulse' });

    // Exterior Details: Mirrors, Grilles, Ladders
    const mirrorGeo = new THREE.BoxGeometry(1, 2, 0.5);
    const mirrorL = new THREE.Mesh(mirrorGeo, chrome);
    mirrorL.position.set(-11, 6, 5);
    const mirrorR = new THREE.Mesh(mirrorGeo, chrome);
    mirrorR.position.set(11, 6, 5);
    cabinGroup.add(mirrorL);
    cabinGroup.add(mirrorR);

    // Side Ladder
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
    const railL = new THREE.Mesh(railGeo, steel);
    railL.position.set(-0.6, 0, 0);
    const railR = new THREE.Mesh(railGeo, steel);
    railR.position.set(0.6, 0, 0);
    ladderGroup.add(railL);
    ladderGroup.add(railR);
    for (let i = -5; i <= 5; i++) {
        const stepGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
        const step = new THREE.Mesh(stepGeo, steel);
        step.position.y = i;
        step.rotation.z = Math.PI / 2;
        ladderGroup.add(step);
    }
    ladderGroup.position.set(-10, 0, -2);
    cabinGroup.add(ladderGroup);

    addPart(cabinGroup, 
        "Hyper-Operator Command Cabin", 
        "A heavily armored, radiation-shielded control room where the operator manages both the physical locomotion of the machine and the intricate parameters of the hypercomputation. Features tinted macro-glass and full multi-dimensional joystick controls.", 
        "Steel, Tinted Glass, Plastics, Chrome", 
        "Provides a habitable zone for the biological operator while the machine traverses extreme timelines and computes the Halting Problem.", 
        4, 
        ["Chassis Base", "Information_Bus"], 
        "Operator is exposed to raw Hawking radiation and temporal shear.", 
        ["Operator dissolution", "Loss of manual override"], 
        new THREE.Vector3(0, 18, -15), 
        new THREE.Vector3(0, 45, -35)
    );

    // Twin Exhaust Stacks (Emitting chronological waste)
    function createExhaust(name, pos, explPos) {
        const exhaustGroup = new THREE.Group();
        const pipeGeo = new THREE.CylinderGeometry(1.5, 1.5, 18, 32);
        const pipe = new THREE.Mesh(pipeGeo, darkSteel);
        pipe.position.y = 9;
        
        const capGeo = new THREE.TorusGeometry(1.6, 0.3, 16, 32);
        const cap = new THREE.Mesh(capGeo, chrome);
        cap.position.y = 18;
        cap.rotation.x = Math.PI / 2;
        
        exhaustGroup.add(pipe);
        exhaustGroup.add(cap);
        
        addPart(exhaustGroup, 
            name, 
            "Massive exhaust stack venting paradoxes and excess chronological heat generated by solving uncomputable functions.", 
            "Dark Steel and Chrome", 
            "Vents paradox-radiation and heat.", 
            5, 
            ["Chassis Base", "Hypercomputation Engine"], 
            "Paradox buildup leading to a localized causality loop.", 
            ["Engine Meltdown", "Time Loop Trap"], 
            pos, 
            explPos
        );
    }
    createExhaust("Chronological_Exhaust_Left", new THREE.Vector3(-12, 10, -20), new THREE.Vector3(-25, 30, -40));
    createExhaust("Chronological_Exhaust_Right", new THREE.Vector3(12, 10, -20), new THREE.Vector3(25, 30, -40));


    // ==========================================
    // 5. HYPERCOMPUTATION CORE (THE SINGULARITY)
    // ==========================================

    const singularityCoreGroup = new THREE.Group();
    
    // Naked Singularity (Absolute black)
    const singularityGeo = new THREE.SphereGeometry(4, 128, 128);
    const singularity = new THREE.Mesh(singularityGeo, singularityMat);
    singularityCoreGroup.add(singularity);

    // Ergosphere (Rotating rapidly)
    const ergosphereGeo = new THREE.SphereGeometry(6, 64, 64);
    const ergosphere = new THREE.Mesh(ergosphereGeo, ergosphereMat);
    singularityCoreGroup.add(ergosphere);
    updatables.push({ mesh: ergosphere, type: 'rotateY', speed: -5.0 });

    // Inner Accretion Disk (High Energy)
    const accretionInnerGeo = new THREE.TorusGeometry(8, 0.8, 16, 128);
    const accretionInner = new THREE.Mesh(accretionInnerGeo, accretionInnerMat);
    accretionInner.rotation.x = Math.PI / 2;
    accretionInner.scale.z = 0.1; // Flatten
    singularityCoreGroup.add(accretionInner);
    updatables.push({ mesh: accretionInner, type: 'rotateZ', speed: 8.0 });

    // Outer Accretion Disk (Plasma)
    const accretionOuterGeo = new THREE.TorusGeometry(12, 1.5, 16, 128);
    const accretionOuter = new THREE.Mesh(accretionOuterGeo, accretionOuterMat);
    accretionOuter.rotation.x = Math.PI / 2;
    accretionOuter.scale.z = 0.05; // Flatten further
    singularityCoreGroup.add(accretionOuter);
    updatables.push({ mesh: accretionOuter, type: 'rotateZ', speed: 4.0 });

    addPart(singularityCoreGroup, 
        "Naked Micro-Singularity & Accretion Engine", 
        "A perfectly contained naked singularity. By lacking an event horizon in certain reference frames, it allows the fractal CPU to observe the results of infinite computations taking place within the singularity's extreme gravity well, effectively performing a Malament-Hogarth hypercomputation.", 
        "Absolute Void, Superheated Plasma, Exotic Matter", 
        "Powers the entire machine and provides the extreme spacetime curvature required for hypercomputation.", 
        6, 
        ["Chassis Base", "Chronosphere", "Hawking Radiation Collectors"], 
        "Instantaneous spaghettification of the operator and surrounding star system.", 
        ["Total Existence Failure", "Vacuum Decay Event"], 
        new THREE.Vector3(0, 15, 5), 
        new THREE.Vector3(0, 15, 5) // Core stays central even in explosion
    );

    // Hawking Radiation Collectors
    function createCollector(name, pos, explPos) {
        const collectorGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(2, 4, 8, 32);
        const base = new THREE.Mesh(baseGeo, copper);
        const dishGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
        const dish = new THREE.Mesh(dishGeo, chrome);
        dish.position.y = 4;
        dish.rotation.x = Math.PI;
        collectorGroup.add(base);
        collectorGroup.add(dish);
        
        // Point dish towards singularity (0, 15, 5)
        collectorGroup.lookAt(new THREE.Vector3(0, 15, 5));
        
        addPart(collectorGroup, 
            name, 
            "Massive parabolic collector array designed to harvest highly energetic Hawking radiation emitted by the micro-singularity.", 
            "Copper and Chrome", 
            "Converts paradox-radiation into usable energy for the Fractal CPU.", 
            7, 
            ["Singularity Core", "Power Grid"], 
            "Energy starvation of the logic gates.", 
            ["Computation halt", "Containment field flicker"], 
            pos, 
            explPos
        );
    }
    createCollector("Hawking_Collector_North", new THREE.Vector3(0, 25, -5), new THREE.Vector3(0, 40, -15));
    createCollector("Hawking_Collector_South", new THREE.Vector3(0, 5, 15), new THREE.Vector3(0, -10, 30));
    createCollector("Hawking_Collector_East", new THREE.Vector3(15, 15, 5), new THREE.Vector3(35, 15, 5));
    createCollector("Hawking_Collector_West", new THREE.Vector3(-15, 15, 5), new THREE.Vector3(-35, 15, 5));


    // ==========================================
    // 6. FRACTAL CPU ARCHITECTURE
    // ==========================================
    
    // Mind-bending recursive crystalline CPU
    const fractalCPUGroup = new THREE.Group();
    
    function buildFractalNodes(level, radius, position, groupTarget) {
        if (level === 0) return;
        
        const geo = new THREE.IcosahedronGeometry(radius, 1);
        const mesh = new THREE.Mesh(geo, fractalCPUMat);
        mesh.position.copy(position);
        groupTarget.add(mesh);
        
        // Add to updatables for extreme animation
        updatables.push({ 
            mesh: mesh, 
            type: 'fractalNode', 
            speed: (5 - level) * 0.5, 
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() 
        });

        const offset = radius * 2.5;
        const vertices = [
            new THREE.Vector3(0, offset, 0),
            new THREE.Vector3(0, -offset, 0),
            new THREE.Vector3(offset, 0, 0),
            new THREE.Vector3(-offset, 0, 0),
            new THREE.Vector3(0, 0, offset),
            new THREE.Vector3(0, 0, -offset)
        ];

        for (let i = 0; i < vertices.length; i++) {
            buildFractalNodes(level - 1, radius * 0.45, position.clone().add(vertices[i]), groupTarget);
        }
    }
    
    // Build the immense fractal structure
    buildFractalNodes(4, 3, new THREE.Vector3(0, 0, 0), fractalCPUGroup);
    
    addPart(fractalCPUGroup, 
        "Quantum-Crystalline Fractal CPU Core", 
        "A hyper-dimensional logic processor made of self-replicating quantum crystals. Its fractal nature provides an infinite number of discrete logic gates within a finite volume, necessary for storing states during hypercomputation.", 
        "N-Dimensional Translucent Silicate", 
        "Executes the uncomputable algorithms, utilizing states that exist in superposition across multiple timelines.", 
        8, 
        ["Singularity Core", "CTC Data Streams"], 
        "Logic errors resulting in the output of false proofs for uncomputable problems.", 
        ["Halting Oracle failure", "Data corruption"], 
        new THREE.Vector3(0, 15, 5), // Co-located with singularity
        new THREE.Vector3(0, 35, 20)
    );

    // ==========================================
    // 7. CLOSED TIMELIKE CURVES (CTC) & DATA STREAMS
    // ==========================================

    // The Chronosphere Containment Field
    const chronosphereGeo = new THREE.SphereGeometry(22, 64, 64);
    const chronosphere = new THREE.Mesh(chronosphereGeo, chronosphereMat);
    addPart(chronosphere, 
        "Chronosphere Containment Field", 
        "A boundary enforcing a localized bubble of closed timelike curves. Inside, time loops back on itself.", 
        "Chronos-Laced Plasma Field", 
        "Contains the temporal paradoxes generated by the machine.", 
        9, 
        ["Chassis Base"], 
        "Chronological contamination of the surrounding universe.", 
        ["Grandfather paradoxes", "Retroactive erasure"], 
        new THREE.Vector3(0, 15, 5), 
        new THREE.Vector3(0, 15, 5)
    );

    // Tachyon Emitters and Reverse-Flowing Data Streams
    function createCTCStream(name, offsetAngle, frequency) {
        const streamGroup = new THREE.Group();
        
        // The Conduit Tube
        const curve = new CTC_Curve(1.0, offsetAngle, frequency);
        const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.8, 16, true);
        const tube = new THREE.Mesh(tubeGeo, dataStreamMat);
        streamGroup.add(tube);
        
        // Reverse-flowing Tachyon Particles (InstancedMesh)
        const particleCount = 400;
        const particleGeo = new THREE.OctahedronGeometry(0.3, 0);
        const instancedMesh = new THREE.InstancedMesh(particleGeo, tachyonMat, particleCount);
        
        // Initialize particle positions along the curve
        const dummy = new THREE.Object3D();
        const positions = [];
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            positions.push(t);
            const pt = curve.getPoint(t);
            dummy.position.copy(pt);
            dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        
        streamGroup.add(instancedMesh);
        
        // Add to updatables to move particles BACKWARDS
        updatables.push({
            type: 'tachyonStream',
            curve: curve,
            mesh: instancedMesh,
            positions: positions,
            speed: -0.05 // Negative speed for backward time flow
        });

        addPart(streamGroup, 
            name, 
            "A closed timelike conduit where data streams physically move backwards in time. Transmits the results of an infinite calculation from the infinite future back to the moment the calculation began.", 
            "Superconducting Chrono-Alloy", 
            "Handles backward-time data transmission.", 
            10, 
            ["Fractal CPU", "Quantum Registers"], 
            "Data arrives before it was sent, causing logic loops.", 
            ["Infinite recursion", "System crash"], 
            new THREE.Vector3(0, 0, 0), 
            new THREE.Vector3(Math.cos(offsetAngle)*10, 10, Math.sin(offsetAngle)*10)
        );
    }

    createCTCStream("CTC_Data_Stream_Alpha", 0, 4);
    createCTCStream("CTC_Data_Stream_Beta", Math.PI / 2, 6);
    createCTCStream("CTC_Data_Stream_Gamma", Math.PI, 4);
    createCTCStream("CTC_Data_Stream_Delta", Math.PI * 1.5, 6);

    // ==========================================
    // 8. QUANTUM REGISTERS & HALTING ORACLE
    // ==========================================
    
    // Quantum State Registers
    const registerBankGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const regGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 16);
        const reg = new THREE.Mesh(regGeo, quantumRegisterMat);
        const angle = (Math.PI * 2 / 16) * i;
        reg.position.set(Math.cos(angle) * 24, 5, Math.sin(angle) * 24);
        reg.rotation.x = Math.PI / 2;
        reg.rotation.z = angle;
        registerBankGroup.add(reg);
        updatables.push({ mesh: reg, type: 'registerPulse', phase: i * 0.5 });
    }
    
    addPart(registerBankGroup, 
        "Hyper-State Quantum Registers", 
        "A circular bank of 16 massive registers capable of holding superposed hyper-states, extending beyond standard qubits into states that include uncomputable reals (Chaitin's constant).", 
        "Crystalline Silicon-Carbide", 
        "Stores intermediate memory for infinite computations.", 
        11, 
        ["CTC Data Streams"], 
        "Memory leak causing local reality to conform to erroneous data.", 
        ["Spontaneous reality shifts"], 
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, -15, 0)
    );

    // The Halting Oracle Interface
    const oracleGroup = new THREE.Group();
    const oracleBase = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 6), darkSteel);
    const oraclePyramid = new THREE.Mesh(new THREE.ConeGeometry(4, 6, 4), oracleMat);
    oraclePyramid.position.y = 4;
    oraclePyramid.rotation.y = Math.PI / 4;
    oracleGroup.add(oracleBase);
    oracleGroup.add(oraclePyramid);
    
    updatables.push({ mesh: oraclePyramid, type: 'oracleHover', baseY: 4 });

    addPart(oracleGroup, 
        "The Halting Oracle Module", 
        "A mythical theoretical construct made physically manifest. It interfaces directly with the singularity to instantaneously answer the Halting Problem for any given Turing machine.", 
        "Solid Gold and Exotic Hyper-matter", 
        "Provides O(1) time complexity answers to undecidable problems.", 
        12, 
        ["Fractal CPU"], 
        "The machine halts when it shouldn't, or doesn't halt when it should.", 
        ["Paradoxical Halting"], 
        new THREE.Vector3(0, 28, 25), 
        new THREE.Vector3(0, 50, 50)
    );

    // ==========================================
    // 9. THE INFINITE SUPERTURING TAPE
    // ==========================================
    
    const tapeGroup = new THREE.Group();
    const bitCount = 300;
    const bits = [];
    
    for (let i = 0; i < bitCount; i++) {
        const bitGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
        // Alternate colors for 1s and 0s
        const isOne = Math.random() > 0.5;
        const bitMat = isOne ? glowingBlueMat : glowingRedMat;
        const bit = new THREE.Mesh(bitGeo, bitMat);
        
        // Arrange in a massive helical spiral around the machine
        const t = i / bitCount;
        const angle = t * Math.PI * 16; 
        const radius = 28 + t * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (t * 40) - 10;
        
        bit.position.set(x, y, z);
        bit.rotation.y = -angle;
        
        tapeGroup.add(bit);
        bits.push({ mesh: bit, initialY: y, radius: radius, angle: angle });
    }
    
    updatables.push({ type: 'superTape', bits: bits, speed: 1.0 });

    addPart(tapeGroup, 
        "Infinite Super-Turing Tape Matrix", 
        "A physical representation of infinite memory, coiled in a massive multi-dimensional helix around the chassis. The blocks shift up and down constantly, simulating infinite read/write operations.", 
        "Holographic Hard-Light", 
        "Serves as the infinite memory strip required for a true Turing machine.", 
        13, 
        ["Tape Reader Heads"], 
        "Out of Memory Error (Universe crashes).", 
        ["Blue Screen of Death (Literal)"], 
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0, 0)
    );

    // Tape Reader Heads
    function createReaderHead(name, pos, explPos) {
        const headGroup = new THREE.Group();
        const armGeo = new THREE.BoxGeometry(8, 1, 1);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.x = -4;
        const sensorGeo = new THREE.CylinderGeometry(1.5, 0.5, 2, 16);
        const sensor = new THREE.Mesh(sensorGeo, glowingRedMat);
        sensor.position.set(-8, -1, 0);
        
        headGroup.add(arm);
        headGroup.add(sensor);
        
        updatables.push({ mesh: headGroup, type: 'readerHead', baseY: pos.y });

        addPart(headGroup, 
            name, 
            "Ultra-precision scanning laser head that reads and writes quantum bits onto the Super-Turing Tape at speeds approaching infinity.", 
            "Steel and Ruby Laser Focus", 
            "I/O operations for the infinite tape.", 
            14, 
            ["Super-Turing Tape Matrix", "Chassis Base"], 
            "Read/Write errors leading to corrupted universe simulations.", 
            ["Simulation crash"], 
            pos, 
            explPos
        );
    }
    createReaderHead("Tape_Reader_Head_Alpha", new THREE.Vector3(30, 10, 0), new THREE.Vector3(50, 10, 0));
    createReaderHead("Tape_Reader_Head_Omega", new THREE.Vector3(-30, 20, 0), new THREE.Vector3(-50, 20, 0));


    // ==========================================
    // METADATA & ANIMATION
    // ==========================================

    const description = "The God-Tier Hyper-Turing Machine: An esoteric, mobile computational artifact transcending standard Turing limits. Mounted on a massive off-road chassis with pneumatic suspension, this behemoth houses a naked micro-singularity powering a mind-bending fractal crystalline CPU. By utilizing Malament-Hogarth spacetime topographies and backward-flowing closed timelike curves (represented by tachyon streams), it performs an infinite number of operations in finite external time, effectively solving the Halting Problem and other uncomputable functions. Complete with an operator cabin, dual paradox exhaust stacks, and a spiraling infinite Super-Turing Tape matrix.";

    const quizQuestions = [
        {
            question: "In the context of this hypercomputation machine, what specific physical property does a Malament-Hogarth spacetime enable?",
            options: [
                "It allows the machine to run infinitely fast by removing mass.",
                "It enables an observer in one region of spacetime to witness the completion of an infinite sequence of events in another region within finite proper time.",
                "It creates a vacuum where classical Turing operations require zero energy.",
                "It allows the Turing tape to be finite yet appear infinite."
            ],
            answer: "It enables an observer in one region of spacetime to witness the completion of an infinite sequence of events in another region within finite proper time.",
            explanation: "In Malament-Hogarth spacetimes, there exists a past-directed timelike curve of infinite proper length that is contained entirely within the past domain of dependence of a single point. This means a computer traveling on the infinite curve can perform an infinite computation, while an observer waiting at the point receives the result in finite time."
        },
        {
            question: "This machine is equipped with a Halting Oracle. According to the arithmetic hierarchy, what complexity class characterizes the problems solvable by a standard Turing machine equipped with such an oracle?",
            options: [
                "RE (Recursively Enumerable)",
                "P (Polynomial Time)",
                "Δ_2^0 (or Turing degree 0')",
                "NP-Complete"
            ],
            answer: "Δ_2^0 (or Turing degree 0')",
            explanation: "A Turing machine with an oracle for the halting problem can compute exactly the functions that are Turing-reducible to the halting problem. In the arithmetic hierarchy, this corresponds to Δ_2^0 sets, also known as Turing degree 0'."
        },
        {
            question: "The machine utilizes backward-flowing tachyon streams in Closed Timelike Curves (CTCs). According to the physical Church-Turing thesis and semi-classical gravity, what is a primary theoretical obstacle to stabilizing such CTCs for computation?",
            options: [
                "The blue-shift instability at the Cauchy horizon requires exotic matter with negative energy density to prevent singularity formation.",
                "Tachyons move too slowly to process data efficiently.",
                "The machine would run out of physical tape.",
                "Quantum entanglement cannot exist in curved spacetime."
            ],
            answer: "The blue-shift instability at the Cauchy horizon requires exotic matter with negative energy density to prevent singularity formation.",
            explanation: "Stephen Hawking's Chronology Protection Conjecture suggests that vacuum fluctuations would become infinitely blue-shifted at the Cauchy horizon (the boundary where CTCs begin), destroying the time machine unless stabilized by exotic matter that violates standard energy conditions."
        },
        {
            question: "If this Hyper-Computer can perfectly solve the halting problem for all standard Turing machines, can it solve the halting problem for ITSELF?",
            options: [
                "Yes, because it has infinite computational power.",
                "Yes, by using a secondary singularity.",
                "No, due to the diagonalization argument applying to any formal system, leading to an infinite hierarchy of Turing degrees (oracles).",
                "No, because the operator cabin blocks the signal."
            ],
            answer: "No, due to the diagonalization argument applying to any formal system, leading to an infinite hierarchy of Turing degrees (oracles).",
            explanation: "Turing's proof of the undecidability of the halting problem relies on diagonalization. Even for a hypercomputer with a halting oracle, one can construct a program that queries the oracle about itself and does the opposite, proving that the hypercomputer cannot solve its own halting problem. This leads to Turing's hierarchy of oracles."
        },
        {
            question: "Why does the machine explicitly use a 'Naked' Singularity rather than a standard black hole with an event horizon for its logic engine?",
            options: [
                "A naked singularity is colder and easier to cool.",
                "Naked singularities do not have gravity.",
                "An event horizon would prevent the result of the infinite computation from escaping and reaching the external observer.",
                "It looks better aesthetically."
            ],
            answer: "An event horizon would prevent the result of the infinite computation from escaping and reaching the external observer.",
            explanation: "If the hypercomputation is performed by a probe falling towards a singularity, the infinite number of steps happens as it approaches the singularity. If an event horizon is present, the signals containing the answer cannot escape back to the external operator. A naked singularity (bypassing the Cosmic Censorship Hypothesis) is required so the results can be transmitted outward."
        }
    ];

    // ==========================================
    // 10. EXTREME ANIMATION LOGIC
    // ==========================================
    
    const dummyMatrix = new THREE.Matrix4();
    const dummyObj = new THREE.Object3D();

    function animate(time, speed, meshes) {
        // time is continuous elapsed time, speed is a multiplier
        const t = time * 0.001 * speed;

        updatables.forEach(item => {
            switch(item.type) {
                case 'rotateY':
                    item.mesh.rotation.y += 0.01 * item.speed * speed;
                    break;
                case 'rotateZ':
                    item.mesh.rotation.z += 0.02 * item.speed * speed;
                    break;
                case 'wheel':
                    // Wheels roll based on speed
                    item.mesh.rotation.x += 0.05 * item.speed * speed;
                    break;
                case 'piston':
                    // Pistons articulate up and down
                    item.mesh.position.y = item.baseY + Math.sin(t * 2 + item.phase) * item.amp;
                    break;
                case 'fractalNode':
                    // Fractal nodes rotate chaotically on random axes
                    item.mesh.rotateOnAxis(item.axis, 0.02 * item.speed * speed);
                    // Slight pulsing scale
                    const s = 1 + Math.sin(t * 5 + item.mesh.position.x) * 0.05;
                    item.mesh.scale.set(s, s, s);
                    break;
                case 'tachyonStream':
                    // Advance particles BACKWARDS along the curve
                    for (let i = 0; i < item.positions.length; i++) {
                        let posT = item.positions[i] + item.speed * 0.01 * speed;
                        if (posT < 0) posT += 1.0;
                        if (posT > 1) posT -= 1.0;
                        item.positions[i] = posT;
                        
                        const pt = item.curve.getPoint(posT);
                        dummyObj.position.copy(pt);
                        // Scale pulses
                        const pScale = Math.sin(posT * Math.PI * 20) * 0.5 + 0.5;
                        dummyObj.scale.setScalar(pScale);
                        dummyObj.updateMatrix();
                        item.mesh.setMatrixAt(i, dummyObj.matrix);
                    }
                    item.mesh.instanceMatrix.needsUpdate = true;
                    break;
                case 'registerPulse':
                    // Registers pulse their emissive intensity
                    if (item.mesh.material) {
                        item.mesh.material.emissiveIntensity = 1 + Math.sin(t * 8 + item.phase) * 1.5;
                    }
                    break;
                case 'oracleHover':
                    item.mesh.position.y = item.baseY + Math.sin(t * 3) * 1.5;
                    item.mesh.rotation.y += 0.03 * speed;
                    break;
                case 'superTape':
                    // Tape constantly scrolls
                    item.bits.forEach(bitObj => {
                        // Scroll angle backwards to simulate forward tape movement
                        bitObj.angle -= 0.05 * item.speed * speed;
                        const rx = Math.cos(bitObj.angle) * bitObj.radius;
                        const rz = Math.sin(bitObj.angle) * bitObj.radius;
                        bitObj.mesh.position.x = rx;
                        bitObj.mesh.position.z = rz;
                        bitObj.mesh.rotation.y = -bitObj.angle;
                    });
                    break;
                case 'readerHead':
                    // Reader heads scan left to right rhythmically
                    item.mesh.position.y = item.baseY + Math.sin(t * 10) * 5;
                    break;
                case 'steering':
                    // Steering wheel jitters slightly
                    item.mesh.rotation.z = Math.sin(t * 15) * 0.1;
                    break;
                case 'joystick':
                    // Joysticks move erratically as if playing a hyper-dimensional arcade game
                    item.mesh.rotation.x = Math.sin(t * 8 + item.phase) * 0.3;
                    item.mesh.rotation.z = Math.cos(t * 12 + item.phase) * 0.3;
                    break;
                case 'screenPulse':
                    if (item.mesh.material) {
                        // Flickering screen effect
                        item.mesh.material.emissiveIntensity = Math.random() > 0.1 ? 1.5 : 0.2;
                    }
                    break;
            }
        });
        
        // Global pulsing of the containment field
        chronosphere.scale.setScalar(1 + Math.sin(t * 4) * 0.02);
    }

    return { group, parts, description, quizQuestions, animate };
}
