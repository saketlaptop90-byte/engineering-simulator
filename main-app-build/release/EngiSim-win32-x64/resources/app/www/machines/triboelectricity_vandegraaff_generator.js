import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    function addPart(name, mesh, desc, mat, func, order, connections, failEffect, cascade, origPos, explPos) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description: desc,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // High-tech emissive materials for sparks and charges
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 3,
        roughness: 0.1,
        metalness: 0.8
    });
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 3,
        roughness: 0.2,
        metalness: 0.5
    });
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2,
        roughness: 0.3
    });
    const emissiveWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5
    });

    // --------------------------------------------------------
    // 1. PRIMARY BASE HOUSING
    // --------------------------------------------------------
    const baseGroup = new THREE.Group();
    const basePts = [];
    basePts.push(new THREE.Vector2(0, 0));
    basePts.push(new THREE.Vector2(25, 0));
    basePts.push(new THREE.Vector2(24, 2));
    basePts.push(new THREE.Vector2(20, 4));
    basePts.push(new THREE.Vector2(20, 8));
    basePts.push(new THREE.Vector2(16, 12));
    basePts.push(new THREE.Vector2(15, 15));
    basePts.push(new THREE.Vector2(0, 15));
    const baseGeo = new THREE.LatheGeometry(basePts, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);

    // Glowing base ring
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(20.5, 0.4, 32, 128), neonBlue);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 6;
    baseGroup.add(ring1);

    // Heavy rivets for hyper-realism
    const rivetGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    for (let i = 0; i < 24; i++) {
        const angle = i * (Math.PI * 2 / 24);
        const r1 = new THREE.Mesh(rivetGeo, chrome);
        r1.position.set(Math.cos(angle) * 19.5, 4, Math.sin(angle) * 19.5);
        r1.rotation.x = Math.PI / 2;
        r1.rotation.y = angle;
        baseGroup.add(r1);
        
        const r2 = new THREE.Mesh(rivetGeo, chrome);
        r2.position.set(Math.cos(angle) * 15.5, 12, Math.sin(angle) * 15.5);
        r2.rotation.x = Math.PI / 2;
        r2.rotation.y = angle;
        baseGroup.add(r2);
    }
    
    addPart('Primary_Base_Housing', baseGroup, 'Heavy hyper-alloy grounding base containing power supplies, transformers, and motor controllers.', darkSteel, 'Provides structural stability, immense mass for vibration dampening, and houses high-voltage electronics.', 1, [], 'Loss of structural integrity, motor decoupling.', false, {x:0, y:0, z:0}, {x:0, y:-20, z:0});

    // --------------------------------------------------------
    // 2. DIELECTRIC COLUMN
    // --------------------------------------------------------
    const columnGroup = new THREE.Group();
    const colGeo = new THREE.CylinderGeometry(8, 10, 60, 64);
    const colMesh = new THREE.Mesh(colGeo, glass);
    colMesh.position.y = 45; // Centers at 45 (15 base + 30 half height)
    columnGroup.add(colMesh);
    
    addPart('Dielectric_Column', columnGroup, 'Transparent acrylic high-insulation support column.', glass, 'Prevents high-voltage charge from grounding out, sustaining millions of volts of potential difference.', 2, ['Primary_Base_Housing'], 'Massive short circuit and sparks leaking down the support, melting the acrylic.', true, {x:0, y:0, z:0}, {x:0, y:30, z:0});

    // --------------------------------------------------------
    // 3. INTERNAL SUPPORT CHASSIS
    // --------------------------------------------------------
    const chassisGroup = new THREE.Group();
    // Inner rings
    for (let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.3, 32, 64), steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 10 * i + 20; // Distributed inside the column
        chassisGroup.add(ring);
    }
    // Vertical structural pipes
    for (let i = 0; i < 8; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 60, 16), aluminum);
        const angle = i * (Math.PI * 2 / 8);
        pipe.position.set(Math.cos(angle) * 6, 45, Math.sin(angle) * 6);
        chassisGroup.add(pipe);
    }
    addPart('Internal_Support_Chassis', chassisGroup, 'Rigid aluminum and steel exoskeleton within the dielectric column.', steel, 'Maintains perfect belt tension and prevents column collapse under vacuum or electrostatic pressure.', 3, ['Dielectric_Column'], 'Belt misalignment and severe frictional fires.', false, {x:0, y:0, z:0}, {x:0, y:30, z:30});

    // --------------------------------------------------------
    // 4. DRIVE MOTOR
    // --------------------------------------------------------
    const motorGroup = new THREE.Group();
    const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 14, 64), steel);
    motorBody.rotation.z = Math.PI / 2;
    motorBody.position.y = 15;
    motorGroup.add(motorBody);
    
    // Motor stator coils
    const coilGeo = new THREE.TorusGeometry(4.8, 0.6, 32, 64);
    for (let i = -5; i <= 5; i += 2.5) {
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.y = Math.PI / 2;
        coil.position.set(i, 15, 0);
        motorGroup.add(coil);
    }
    addPart('Drive_Motor', motorGroup, 'High-torque brushless DC motor with dense copper stator windings.', copper, 'Drives the lower pulley at high RPM to transport charges rapidly.', 4, ['Primary_Base_Housing'], 'Belt stalls, charge generation immediately ceases.', false, {x:0, y:0, z:0}, {x:-40, y:0, z:0});

    // --------------------------------------------------------
    // 5. LOWER PULLEY
    // --------------------------------------------------------
    const lowerPulleyGrp = new THREE.Group();
    const lPulleyGeo = new THREE.CylinderGeometry(4.2, 4.2, 10, 64);
    const lPulleyMesh = new THREE.Mesh(lPulleyGeo, plastic);
    lPulleyMesh.rotation.x = Math.PI / 2;
    lowerPulleyGrp.add(lPulleyMesh);
    lowerPulleyGrp.position.y = 15;
    addPart('Lower_Pulley', lowerPulleyGrp, 'Friction-generating lower drive pulley (Acrylic/Nylon).', plastic, 'Creates positive charge via the triboelectric effect when contacting the moving rubber belt.', 5, ['Drive_Motor'], 'Loss of charge separation efficiency.', false, {x:0, y:0, z:0}, {x:0, y:0, z:25});

    // --------------------------------------------------------
    // 6. UPPER PULLEY
    // --------------------------------------------------------
    const upperPulleyGrp = new THREE.Group();
    const uPulleyGeo = new THREE.CylinderGeometry(4.2, 4.2, 10, 64);
    const uPulleyMesh = new THREE.Mesh(uPulleyGeo, aluminum);
    uPulleyMesh.rotation.x = Math.PI / 2;
    upperPulleyGrp.add(uPulleyMesh);
    upperPulleyGrp.position.y = 75;
    addPart('Upper_Pulley', upperPulleyGrp, 'Electron-scavenging upper idler pulley (Teflon or Aluminum).', aluminum, 'Completes the belt loop and facilitates opposite charge transfer to the inner dome.', 6, ['Internal_Support_Chassis'], 'Belt tension lost, mechanical jam destroying the column.', true, {x:0, y:0, z:0}, {x:0, y:15, z:25});

    // --------------------------------------------------------
    // 7. CHARGE TRANSPORT BELT
    // --------------------------------------------------------
    const beltGroup = new THREE.Group();
    const outerLoop = new THREE.Shape();
    outerLoop.absarc(0, 75, 4.5, 0, Math.PI, false);
    outerLoop.lineTo(-4.5, 15);
    outerLoop.absarc(0, 15, 4.5, Math.PI, Math.PI * 2, false);
    outerLoop.lineTo(4.5, 75);
    
    const innerLoop = new THREE.Path();
    innerLoop.absarc(0, 75, 4.2, 0, Math.PI, false);
    innerLoop.lineTo(-4.2, 15);
    innerLoop.absarc(0, 15, 4.2, Math.PI, Math.PI * 2, false);
    innerLoop.lineTo(4.2, 75);
    
    outerLoop.holes.push(innerLoop);
    const beltGeo = new THREE.ExtrudeGeometry(outerLoop, { depth: 9, bevelEnabled: false, curveSegments: 64 });
    const beltMesh = new THREE.Mesh(beltGeo, rubber);
    beltMesh.position.z = -4.5;
    beltGroup.add(beltMesh);
    addPart('Charge_Transport_Belt', beltGroup, 'Continuous pure vulcanized rubber belt.', rubber, 'Mechanically transports charge continuously against a massive voltage gradient.', 7, ['Lower_Pulley', 'Upper_Pulley'], 'Snaps under high tension, destroying internals and collapsing the field.', true, {x:0, y:0, z:0}, {x:0, y:0, z:-40});

    // --------------------------------------------------------
    // 8. LOWER SPRAY COMB
    // --------------------------------------------------------
    const lowerCombGroup = new THREE.Group();
    const lcBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 11, 32), copper);
    lcBase.rotation.x = Math.PI / 2;
    lowerCombGroup.add(lcBase);
    for (let i = -4.5; i <= 4.5; i += 0.5) {
        const needle = new THREE.Mesh(new THREE.ConeGeometry(0.15, 3, 16), chrome);
        needle.rotation.z = -Math.PI / 2;
        needle.position.set(1.5, 0, i);
        lowerCombGroup.add(needle);
    }
    lowerCombGroup.position.set(4.8, 15, 0);
    addPart('Lower_Spray_Comb', lowerCombGroup, 'Sharp copper/chrome needles connected to a high-voltage DC supply.', copper, 'Ionizes the air to spray positive charge directly onto the upward-moving belt via corona discharge.', 8, ['Primary_Base_Housing'], 'Failure to ionize air, terminating charge accumulation.', false, {x:0, y:0, z:0}, {x:30, y:0, z:0});

    // --------------------------------------------------------
    // 9. UPPER COLLECTOR COMB
    // --------------------------------------------------------
    const upperCombGroup = new THREE.Group();
    const ucBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 11, 32), copper);
    ucBase.rotation.x = Math.PI / 2;
    upperCombGroup.add(ucBase);
    for (let i = -4.5; i <= 4.5; i += 0.5) {
        const needle = new THREE.Mesh(new THREE.ConeGeometry(0.15, 3, 16), chrome);
        needle.rotation.z = Math.PI / 2;
        needle.position.set(-1.5, 0, i);
        upperCombGroup.add(needle);
    }
    upperCombGroup.position.set(-4.8, 75, 0);
    addPart('Upper_Collector_Comb', upperCombGroup, 'Dense array of razor-sharp collector needles inside the dome.', copper, 'Draws charge off the belt via ionization and conducts it to the outer spherical terminal.', 9, ['High_Voltage_Terminal'], 'Charge builds up inside, risking extreme internal arcing and heat.', false, {x:0, y:0, z:0}, {x:-30, y:0, z:0});

    // --------------------------------------------------------
    // 10. HIGH VOLTAGE TERMINAL (DOME)
    // --------------------------------------------------------
    const domeGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(25, 128, 128, 0, Math.PI * 2, 0, Math.PI * 0.75);
    const domeMesh = new THREE.Mesh(domeGeo, chrome);
    
    // Bottom toroid opening to prevent corona leakage
    const rimRadius = 25 * Math.sin(Math.PI * 0.75);
    const rimGeo = new THREE.TorusGeometry(rimRadius, 2.5, 64, 128);
    const rimMesh = new THREE.Mesh(rimGeo, chrome);
    rimMesh.position.y = 25 * Math.cos(Math.PI * 0.75);
    rimMesh.rotation.x = Math.PI / 2;
    
    // Extruded intricate paneling lines mapped around the sphere
    for (let i = 1; i < 5; i++) {
        const angle = i * Math.PI / 6;
        const lineRad = 25 * Math.sin(angle);
        const lineY = 25 * Math.cos(angle);
        const lineTorus = new THREE.Mesh(new THREE.TorusGeometry(lineRad, 0.4, 32, 128), darkSteel);
        lineTorus.rotation.x = Math.PI / 2;
        lineTorus.position.y = lineY;
        domeGroup.add(lineTorus);
    }
    
    domeGroup.add(domeMesh);
    domeGroup.add(rimMesh);
    domeGroup.position.y = 75;
    addPart('High_Voltage_Terminal', domeGroup, 'Massive highly-polished steel/chrome oblate sphere.', chrome, 'Acts as a Faraday cage to accumulate extreme electrostatic potential (Millions of Volts) safely on its outer surface.', 10, ['Dielectric_Column', 'Upper_Collector_Comb'], 'Massive violent discharge in random directions, endangering nearby equipment.', true, {x:0, y:0, z:0}, {x:0, y:50, z:0});

    // --------------------------------------------------------
    // 11. DISCHARGE WAND BASE
    // --------------------------------------------------------
    const wandBaseGroup = new THREE.Group();
    const wBaseGeo = new THREE.CylinderGeometry(12, 16, 10, 64);
    const wBaseMesh = new THREE.Mesh(wBaseGeo, darkSteel);
    wBaseMesh.position.y = 5;
    wandBaseGroup.add(wBaseMesh);
    
    // Heavy anchor feet
    for (let i = 0; i < 8; i++) {
        const baseBox = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape([
            new THREE.Vector2(-3, 0), new THREE.Vector2(3, 0),
            new THREE.Vector2(2, 6), new THREE.Vector2(-2, 6)
        ]), { depth: 4, bevelEnabled: true }), darkSteel);
        const angle = i * (Math.PI * 2 / 8);
        baseBox.position.set(Math.cos(angle) * 14, 0, Math.sin(angle) * 14);
        baseBox.rotation.y = -angle;
        baseBox.rotation.x = Math.PI / 2; // Flat on ground
        baseBox.position.y = 4;
        wandBaseGroup.add(baseBox);
    }
    
    const warnLight = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 32), neonRed);
    warnLight.position.set(0, 12, 0);
    wandBaseGroup.add(warnLight);
    
    wandBaseGroup.position.set(75, 0, 0);
    addPart('Discharge_Wand_Base', wandBaseGroup, 'Grounded massive anchor block for the discharge wand.', darkSteel, 'Provides a true Earth ground to sink the massive lightning arcs safely.', 11, [], 'Ground loop failure, machine becomes completely energized.', true, {x:0, y:0, z:0}, {x:30, y:0, z:40});

    // --------------------------------------------------------
    // 12. DISCHARGE WAND ARM
    // --------------------------------------------------------
    const wandArmGroup = new THREE.Group();
    
    // Outer cylinder wrapper
    const outerArm = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 30, 32), steel);
    outerArm.rotation.z = -Math.PI / 2; // Point positive local X
    outerArm.position.x = 15; // Base at 0, tip at 30
    wandArmGroup.add(outerArm);
    
    // Inner extending piston arm
    const innerArm = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 30, 32), chrome);
    innerArm.rotation.z = -Math.PI / 2;
    // position will be animated
    
    // Actual ground sphere terminal
    const groundSphere = new THREE.Mesh(new THREE.SphereGeometry(12, 64, 64), chrome);
    groundSphere.position.y = 15; // Relative to the rotated inner cylinder's tip
    innerArm.add(groundSphere);
    wandArmGroup.add(innerArm);
    
    // Position at base, pivot towards main dome
    wandArmGroup.position.set(75, 10, 0);
    // Angle towards dome (0, 75, 0)
    // dx = -75, dy = 65
    wandArmGroup.rotation.z = Math.atan2(65, -75);
    
    addPart('Discharge_Wand_Arm', wandArmGroup, 'Hydraulically actuated telescoping grounding rod.', steel, 'Adjusts spark gap distance dynamically to induce controlled atmospheric dielectric breakdown.', 12, ['Discharge_Wand_Base'], 'Stuck gap distance, inability to draw sparks.', false, {x:0, y:0, z:0}, {x:40, y:20, z:0});

    // --------------------------------------------------------
    // 13. GROUNDING CABLE
    // --------------------------------------------------------
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(75, 3, 0),
        new THREE.Vector3(60, 1, -15),
        new THREE.Vector3(30, 1, -10),
        new THREE.Vector3(20, 3, 0)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 128, 1.8, 32, false);
    const cable = new THREE.Mesh(cableGeo, rubber);
    addPart('Grounding_Cable', cable, 'Thick ultra-high-voltage insulated grounding cable.', rubber, 'Creates an unbreakable common ground reference between the discharge wand and the primary base.', 13, ['Discharge_Wand_Base', 'Primary_Base_Housing'], 'Lethal voltage differential spans across the laboratory floor.', true, {x:0, y:0, z:0}, {x:0, y:10, z:-30});

    // --------------------------------------------------------
    // 14. CONTROL PANEL MODULE
    // --------------------------------------------------------
    const cpGroup = new THREE.Group();
    const cpShape = new THREE.Shape();
    cpShape.moveTo(0, 0);
    cpShape.lineTo(8, 0);
    cpShape.lineTo(8, 5);
    cpShape.lineTo(0, 10);
    const cpExtrude = new THREE.ExtrudeGeometry(cpShape, { depth: 14, bevelEnabled: true });
    const cpMesh = new THREE.Mesh(cpExtrude, aluminum);
    cpMesh.position.set(20, 0, -7);
    cpGroup.add(cpMesh);
    
    const screenGeo = new THREE.PlaneGeometry(6, 4);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(24.2, 6, 0);
    screenMesh.rotation.y = Math.PI / 2;
    screenMesh.rotation.x = -Math.PI / 6; 
    cpGroup.add(screenMesh);
    
    for (let i = 0; i < 4; i++) {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1, 16), neonRed);
        btn.rotation.z = Math.PI / 2;
        btn.rotation.x = -Math.PI / 6;
        btn.position.set(26.5, 3, -4 + i * 2.6);
        cpGroup.add(btn);
    }
    addPart('Control_Panel_Module', cpGroup, 'Diagnostic telemetry and throttle controls.', aluminum, 'Allows operator to monitor dielectric breakdown limits and motor RPM.', 14, ['Primary_Base_Housing'], 'Operator loses control over charge rate, resulting in overcharge.', false, {x:0, y:0, z:0}, {x:40, y:0, z:-30});

    // --------------------------------------------------------
    // 15. ION CHARGE CARRIERS (VISUALIZATION)
    // --------------------------------------------------------
    const particlesGroup = new THREE.Group();
    const allCharges = [];
    for (let i = 0; i < 60; i++) {
        const cMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), neonPurple);
        particlesGroup.add(cMesh);
        allCharges.push({ mesh: cMesh, offset: i / 60 });
    }
    addPart('Ion_Charge_Carriers', particlesGroup, 'Visualized electrostatic charges bound to the belt surface.', glass, 'Transport net charge mechanically against the massive voltage gradient.', 15, [], '', false, {x:0, y:0, z:0}, {x:0, y:0, z:0});

    // --------------------------------------------------------
    // 16. CORONA DISCHARGE SPARKS
    // --------------------------------------------------------
    const sparkGroup = new THREE.Group();
    const sparks = [];
    
    function createJaggedSpark(segments, spread) {
        const points = [];
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(0, 0, -30); // Generated along local -Z for lookAt alignment
        points.push(start);
        
        for (let i = 1; i < segments; i++) {
            const fraction = i / segments;
            const basePos = new THREE.Vector3().copy(start).lerp(end, fraction);
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                0 
            );
            basePos.add(offset);
            points.push(basePos);
        }
        points.push(end);
        
        const curve = new THREE.CatmullRomCurve3(points);
        return new THREE.Mesh(new THREE.TubeGeometry(curve, segments * 2, 0.6, 12, false), neonBlue);
    }
    
    for (let i = 0; i < 15; i++) {
        const s = createJaggedSpark(16, 15);
        s.visible = false;
        sparkGroup.add(s);
        sparks.push(s);
    }
    addPart('Corona_Discharge_Sparks', sparkGroup, 'Massive dielectric breakdown arcs in air (Plasma channels).', glass, 'Violently discharges accumulated voltage when the local electric field exceeds 3 million volts per meter.', 16, [], '', false, {x:0, y:0, z:0}, {x:0, y:0, z:0});

    // --------------------------------------------------------
    // QUIZ QUESTIONS
    // --------------------------------------------------------
    const quizQuestions = [
        {
            question: "What physical mechanism allows the Van de Graaff generator to build up such immense voltages without the charges repelling and flowing back down the belt?",
            options: [
                "The Faraday cage effect inside the dome ensures the electric field is zero internally, allowing charges to continuously flow from the comb to the exterior without resistance.",
                "The rubber belt is treated to act as a superconductor at room temperature.",
                "The motor spins so fast that the charges are held in place purely by centrifugal force.",
                "The grounding wire absorbs the counter-electromotive force generated by the belt."
            ],
            correctAnswer: 0,
            explanation: "Inside a hollow conductor (the dome), the electric field is zero. Charges placed inside immediately repel each other and migrate to the outer surface. This means no matter how much charge is on the outside, the belt can always deposit more on the inside without fighting repulsive voltage."
        },
        {
            question: "What is the primary purpose of using two entirely different materials (like acrylic and aluminum) for the upper and lower pulleys?",
            options: [
                "To save manufacturing costs on raw metal materials.",
                "To balance the weight distribution of the spinning column.",
                "To leverage the triboelectric series, ensuring electrons are aggressively stripped from the belt at one end and deposited at the other.",
                "To prevent magnetic interference with the drive motor."
            ],
            correctAnswer: 2,
            explanation: "The triboelectric effect generates charge via contact between dissimilar materials. Using materials on opposite ends of the triboelectric series for the top and bottom pulleys maximizes the amount of charge separated and transferred to the belt."
        },
        {
            question: "Why must the main high-voltage terminal be a perfectly smooth, massive sphere rather than a blocky, jagged, or cube-like shape?",
            options: [
                "Spheres are lighter and require less internal support.",
                "A smooth sphere minimizes electric field concentration at the surface, preventing premature corona discharge and allowing massive voltages to accumulate.",
                "It strictly serves an aesthetic purpose for laboratory environments.",
                "The spherical shape amplifies sound waves, producing louder sparks."
            ],
            correctAnswer: 1,
            explanation: "Electric fields concentrate sharply at points and edges. If the terminal were a cube, the immense electric field at the corners would immediately ionize the air and leak charge (corona discharge). A perfectly smooth sphere evenly distributes the field, allowing millions of volts to accumulate before sparking."
        },
        {
            question: "What causes the visible lightning-like sparks to suddenly jump from the main dome to the grounding wand?",
            options: [
                "The electric field strength exceeds the dielectric breakdown voltage of the surrounding air, ionizing gas molecules to create a highly conductive plasma channel.",
                "Microscopic metal shavings fly off the dome and ignite in mid-air.",
                "The motor overheats and vents burning ozone gas.",
                "The grounding wand emits a laser that vaporizes the air between the spheres."
            ],
            correctAnswer: 0,
            explanation: "Air is normally an insulator, but under extreme electric fields (roughly 3 million volts per meter), the electrons are ripped from the air molecules, turning the air into a conductive plasma. The stored electrical energy dumps instantly through this plasma channel as a spark."
        },
        {
            question: "If the thick grounding cable connecting the discharge wand to the base were accidentally severed while the machine was running at full capacity, what would happen?",
            options: [
                "The machine would safely shut down via an internal breaker.",
                "The sparks would simply turn a different color due to lack of ground.",
                "The discharge wand would rapidly accumulate a lethal high voltage matching the main dome, and anyone touching it would act as the new ground path.",
                "The main dome would permanently lose all its charge into the atmosphere."
            ],
            correctAnswer: 2,
            explanation: "Without the grounding cable providing a safe, low-resistance path to Earth, the discharge wand itself becomes a massive capacitor. It would charge up to lethal voltages, making it extraordinarily dangerous to any operator standing nearby."
        }
    ];

    // --------------------------------------------------------
    // ANIMATION LOOP
    // --------------------------------------------------------
    const animate = (time, speed, activeMeshes) => {
        const t = time * speed;
        
        // 1. Rotate Pulleys
        if (activeMeshes['Lower_Pulley']) activeMeshes['Lower_Pulley'].rotation.y = t * 15;
        if (activeMeshes['Upper_Pulley']) activeMeshes['Upper_Pulley'].rotation.y = t * 15;
        if (activeMeshes['Drive_Motor']) activeMeshes['Drive_Motor'].children[0].rotation.y = t * 20;
        
        // 2. Animate Charge Particles perfectly along the stadium track
        allCharges.forEach(c => {
            let offsetT = (t * 0.4 + c.offset) % 1.0;
            const pt = outerLoop.getPointAt(offsetT);
            c.mesh.position.set(pt.x, pt.y, 0);
            
            // Assign material dynamically based on position to simulate charge separation
            if (pt.x > 2) {
                c.mesh.material = neonPurple; // Positive charges riding up the right side
            } else if (pt.x < -2) {
                c.mesh.material = neonBlue; // Negative charges riding down the left side
            } else {
                c.mesh.material = emissiveWhite; // Transitioning actively on the pulleys
            }
        });
        
        // 3. Move Discharge Wand (Inner Arm Telescoping)
        // Oscillates inner cylinder's local X position between 18 and 42
        const innerExtension = Math.sin(t * 1.2) * 12 + 30; 
        const innerArmMesh = wandArmGroup.children[1];
        if (innerArmMesh) {
            innerArmMesh.position.x = innerExtension;
        }
        
        // 4. Hyper-realistic Spark Logic
        const sphereMesh = innerArmMesh.children[0];
        const worldPosWand = new THREE.Vector3();
        sphereMesh.getWorldPosition(worldPosWand);
        
        const worldPosDome = new THREE.Vector3(0, 75, 0);
        const distance = worldPosWand.distanceTo(worldPosDome);
        
        // Reset sparks
        sparks.forEach(s => s.visible = false);
        
        // Breakdown threshold (when wand is close enough)
        if (distance < 50) {
            // Aggressive sparking phase
            const numSparks = Math.floor(Math.random() * 4) + 1;
            for (let i = 0; i < numSparks; i++) {
                const s = sparks[Math.floor(Math.random() * sparks.length)];
                s.visible = true;
                
                // Align spark perfectly from Wand to Dome
                s.position.copy(worldPosWand);
                s.lookAt(worldPosDome);
                
                // Random axial rotation to make the bolt look 3D dynamic
                s.rotation.z = Math.random() * Math.PI * 2;
                
                // Scale length exactly to the gap distance
                s.scale.z = distance / 30;
                
                // Jitter width/height for flickering plasma effect
                s.scale.x = 0.8 + Math.random() * 1.5;
                s.scale.y = 0.8 + Math.random() * 1.5;
            }
            // Warning light intensely flashes during discharge
            warnLight.material.emissiveIntensity = 8 + Math.random() * 10;
            
            // Dim the charge particles to simulate rapid discharge
            allCharges.forEach(c => c.mesh.material.emissiveIntensity = 0.5);
        } else {
            // Charging phase
            warnLight.material.emissiveIntensity = 2;
            allCharges.forEach(c => c.mesh.material.emissiveIntensity = 3);
        }
    };

    return { group, parts, description: "Advanced high-voltage electrostatic Van de Graaff Generator simulation featuring complex internal mechanics, triboelectric charge transport visualization, and dynamic dielectric breakdown sparks.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createVanDeGraaffGenerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
