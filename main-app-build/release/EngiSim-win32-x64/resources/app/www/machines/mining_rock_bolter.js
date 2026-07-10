import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    const parts = [];

    // Custom emissive materials for high-tech look
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff3300, emissiveIntensity: 2.5, roughness: 0.1 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff33, emissive: 0x00ff33, emissiveIntensity: 2.0 });
    const brightChrome = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 1.0 });
    
    // --- Helper Functions ---
    function createDetailedTire() {
        const wheelGroup = new THREE.Group();
        
        // Main tire body
        const tireGeo = new THREE.TorusGeometry(3.5, 1.4, 32, 100);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Deep off-road treads
        const treadCount = 60;
        const treadGeo = new THREE.CylinderGeometry(0.2, 0.4, 2.8, 8);
        for (let i = 0; i < treadCount; i++) {
            const angle = (i / treadCount) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, rubber);
            tread.position.set(Math.cos(angle) * 4.6, Math.sin(angle) * 4.6, 0);
            tread.rotation.set(Math.PI / 2, 0, angle);
            wheelGroup.add(tread);
        }
        
        // Complex rim
        const rimBaseGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.2, 32);
        const rimBase = new THREE.Mesh(rimBaseGeo, darkSteel);
        rimBase.rotation.x = Math.PI / 2;
        wheelGroup.add(rimBase);

        const spokeCount = 12;
        const spokeGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.4, 16);
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0.6);
            spoke.rotation.set(Math.PI / 2, angle, 0);
            wheelGroup.add(spoke);
        }

        // Center hub cap with glowing ring
        const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.4, 32);
        const hub = new THREE.Mesh(hubGeo, aluminum);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        const glowRingGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
        const glowRing = new THREE.Mesh(glowRingGeo, neonBlue);
        glowRing.position.z = 0.72;
        wheelGroup.add(glowRing);

        return wheelGroup;
    }

    function createHydraulicCylinder(radius, length) {
        const group = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = length / 2;
        
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.2, 32);
        const rod = new THREE.Mesh(rodGeo, brightChrome);
        rod.position.y = length;
        
        group.add(base);
        group.add(rod);
        group.userData.rod = rod;
        group.userData.baseLength = length;
        return group;
    }

    function buildArticulatedChassis() {
        const chassisGroup = new THREE.Group();

        // 1. Rear Engine Frame (Lathe & Extrusions to avoid blocks)
        const rearFrame = new THREE.Group();
        
        // Main engine housing curvature
        const profile = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            profile.push(new THREE.Vector2(Math.sin(t * Math.PI) * 2.5 + 2, t * 10 - 5));
        }
        const engineGeo = new THREE.LatheGeometry(profile, 32, 0, Math.PI);
        const engineMesh = new THREE.Mesh(engineGeo, steel);
        engineMesh.rotation.z = Math.PI / 2;
        engineMesh.rotation.x = Math.PI / 2;
        engineMesh.position.set(0, 3, -6);
        rearFrame.add(engineMesh);

        // Exhaust stacks
        const exhaustGeo = new THREE.CylinderGeometry(0.4, 0.5, 4, 16);
        const exhaust = new THREE.Mesh(exhaustGeo, chrome);
        exhaust.position.set(2, 6, -8);
        rearFrame.add(exhaust);

        // Cooling fans
        const fanGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
        const fanMesh = new THREE.Mesh(fanGeo, darkSteel);
        fanMesh.position.set(0, 3, -11);
        rearFrame.add(fanMesh);

        chassisGroup.add(rearFrame);

        // 2. Front Articulation Frame
        const frontFrame = new THREE.Group();
        const frontProfile = [];
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            frontProfile.push(new THREE.Vector2(Math.sin(t * Math.PI) * 1.5 + 1.5, t * 6 - 3));
        }
        const frontBodyGeo = new THREE.LatheGeometry(frontProfile, 32, 0, Math.PI * 2);
        const frontBody = new THREE.Mesh(frontBodyGeo, steel);
        frontBody.rotation.z = Math.PI / 2;
        frontBody.position.set(0, 3, 4);
        frontFrame.add(frontBody);

        chassisGroup.add(frontFrame);

        // 3. Articulation Joint
        const jointGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
        const joint = new THREE.Mesh(jointGeo, darkSteel);
        joint.position.set(0, 3, 0);
        chassisGroup.add(joint);

        return { chassisGroup, rearFrame, frontFrame, joint };
    }

    function buildFOPSCabin() {
        const cabin = new THREE.Group();
        
        // Curved protective bars (FOPS)
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 0, -2),
            new THREE.Vector3(-2.2, 4, -1.5),
            new THREE.Vector3(-1.5, 5, 1.5),
            new THREE.Vector3(-2, 0, 2)
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 64, 0.2, 16, false);
        const leftBar = new THREE.Mesh(tubeGeo, steel);
        cabin.add(leftBar);

        const rightBar = leftBar.clone();
        rightBar.scale.x = -1;
        cabin.add(rightBar);

        // Crossbars
        const crossGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
        const cross1 = new THREE.Mesh(crossGeo, steel);
        cross1.rotation.z = Math.PI / 2;
        cross1.position.set(0, 4.8, 0);
        cabin.add(cross1);

        // Tinted panoramic dome
        const domeGeo = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, tinted);
        dome.scale.set(1, 0.8, 1.2);
        dome.position.set(0, 2.5, 0);
        cabin.add(dome);

        // High-tech control panel
        const panelGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.8, 16, 1, false, 0, Math.PI);
        const panel = new THREE.Mesh(panelGeo, plastic);
        panel.rotation.y = Math.PI;
        panel.rotation.x = -Math.PI / 4;
        panel.position.set(0, 2, 1.5);
        cabin.add(panel);

        // Neon screens on panel
        const screenGeo = new THREE.PlaneGeometry(1, 0.5);
        const screen1 = new THREE.Mesh(screenGeo, neonBlue);
        screen1.position.set(-0.5, 2.2, 1.2);
        screen1.rotation.x = -Math.PI / 4;
        cabin.add(screen1);

        const screen2 = new THREE.Mesh(screenGeo, neonGreen);
        screen2.position.set(0.5, 2.2, 1.2);
        screen2.rotation.x = -Math.PI / 4;
        cabin.add(screen2);

        // Operators Seat
        const seatBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
        const seatBase = new THREE.Mesh(seatBaseGeo, darkSteel);
        seatBase.position.set(0, 1.5, -0.5);
        cabin.add(seatBase);
        
        const seatBackGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32, 1, false, 0, Math.PI);
        const seatBack = new THREE.Mesh(seatBackGeo, rubber);
        seatBack.position.set(0, 2.5, -1);
        cabin.add(seatBack);

        cabin.position.set(0, 3, -2);
        return cabin;
    }

    function buildDrillBoomSystem() {
        const boomSystem = new THREE.Group();

        // Boom base mount
        const mountGeo = new THREE.SphereGeometry(1.8, 32, 32);
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.position.set(0, 4, 6);
        boomSystem.add(mount);

        // Stage 1 Boom (Telescopic)
        const boom1Geo = new THREE.CylinderGeometry(0.8, 1.2, 8, 32);
        const boom1 = new THREE.Mesh(boom1Geo, steel);
        boom1.rotation.x = Math.PI / 2;
        boom1.position.set(0, 0, 4);
        mount.add(boom1);

        // Stage 2 Boom
        const boom2Geo = new THREE.CylinderGeometry(0.6, 0.6, 8, 32);
        const boom2 = new THREE.Mesh(boom2Geo, brightChrome);
        boom2.rotation.x = Math.PI / 2;
        boom2.position.set(0, 0, 8); // Will be animated relative to boom1
        boom1.add(boom2);

        // Drill Mast / Feed Rail
        const mastGeo = new THREE.BoxGeometry(1.5, 12, 1.5); // Simplified extrusion profile
        const mast = new THREE.Mesh(mastGeo, darkSteel);
        mast.rotation.x = -Math.PI / 2;
        mast.position.set(0, 0, 4);
        boom2.add(mast);

        // Drill Head (Rotary Percussive)
        const headGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
        const head = new THREE.Mesh(headGeo, aluminum);
        head.position.set(0, -4, 1.5);
        mast.add(head);

        // Drill Bit
        const bitGeo = new THREE.CylinderGeometry(0.1, 0.3, 14, 16);
        const bit = new THREE.Mesh(bitGeo, chrome);
        bit.rotation.x = Math.PI / 2;
        bit.position.set(0, 0, 8);
        head.add(bit);

        // Glowing bit tip
        const bitTipGeo = new THREE.ConeGeometry(0.35, 1, 16);
        const bitTip = new THREE.Mesh(bitTipGeo, neonRed);
        bitTip.rotation.x = Math.PI / 2;
        bitTip.position.set(0, 0, 15);
        head.add(bitTip);

        // Hydraulic Actuator for Boom
        const boomHydraulic = createHydraulicCylinder(0.4, 4);
        boomHydraulic.position.set(0, -1.5, 2);
        boomHydraulic.rotation.x = Math.PI / 4;
        mount.add(boomHydraulic);

        return { boomSystem, mount, boom1, boom2, mast, head, bit, bitTip };
    }

    function buildResinInjectorArm() {
        const resinArm = new THREE.Group();
        
        // Articulated shoulder
        const shoulderGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
        const shoulder = new THREE.Mesh(shoulderGeo, steel);
        shoulder.rotation.z = Math.PI / 2;
        resinArm.add(shoulder);

        // Arm segment 1
        const arm1Geo = new THREE.CylinderGeometry(0.4, 0.6, 6, 32);
        const arm1 = new THREE.Mesh(arm1Geo, darkSteel);
        arm1.position.set(0, 3, 0);
        shoulder.add(arm1);

        // Injector Head
        const injectorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
        const injector = new THREE.Mesh(injectorGeo, aluminum);
        injector.rotation.x = Math.PI / 2;
        injector.position.set(0, 3, 0.5);
        arm1.add(injector);

        // Resin cartridges (Glowing tubes)
        const cartridgeGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
        const cartridge = new THREE.Mesh(cartridgeGeo, neonGreen);
        cartridge.position.set(0, 0, 1.5);
        injector.add(cartridge);

        resinArm.position.set(2.5, 4, 5);
        return resinArm;
    }

    // --- Assembly ---

    const { chassisGroup, rearFrame, frontFrame, joint } = buildArticulatedChassis();
    machineGroup.add(chassisGroup);

    const fopsCabin = buildFOPSCabin();
    rearFrame.add(fopsCabin);

    const { boomSystem, mount, boom1, boom2, mast, head, bit, bitTip } = buildDrillBoomSystem();
    frontFrame.add(boomSystem);

    const resinArm = buildResinInjectorArm();
    frontFrame.add(resinArm);

    // Wheels
    const wheels = [];
    const wheelPositions = [
        { x: 4, y: 3.5, z: -9, parent: rearFrame },
        { x: -4, y: 3.5, z: -9, parent: rearFrame },
        { x: 4, y: 3.5, z: 3, parent: frontFrame },
        { x: -4, y: 3.5, z: 3, parent: frontFrame }
    ];

    wheelPositions.forEach((pos, idx) => {
        const wheel = createDetailedTire();
        wheel.position.set(pos.x, pos.y, pos.z);
        if (pos.x > 0) wheel.rotation.y = Math.PI; // flip right side wheels
        pos.parent.add(wheel);
        wheels.push(wheel);
    });

    // Hydraulic Hoses Array (TubeGeometries connecting frames)
    const hoseMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const hoseGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const hosePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1 - i*0.4, 4, -1),
            new THREE.Vector3(1.5 - i*0.4, 3.5, 0),
            new THREE.Vector3(1 - i*0.4, 4, 1)
        ]);
        const hoseGeo = new THREE.TubeGeometry(hosePath, 20, 0.08, 8, false);
        const hose = new THREE.Mesh(hoseGeo, hoseMaterial);
        hoseGroup.add(hose);
    }
    joint.add(hoseGroup);

    // --- Define Parts for UI / Interaction ---

    function registerPart(name, mesh, description, mat, func, order, explodeVec) {
        parts.push({
            name: name,
            description: description,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections: ['Chassis Structure'],
            failureEffect: 'System halted, critical stability warning.',
            cascadeFailures: ['Hydraulic Pressure Loss', 'Structural Integrity Compromise'],
            originalPosition: mesh.position.clone(),
            explodedPosition: new THREE.Vector3().copy(mesh.position).add(explodeVec),
            meshRef: mesh
        });
    }

    registerPart('Rear Engine Bay', rearFrame, 'Houses the primary diesel-electric powerplant and massive cooling arrays.', 'High-strength steel and composite plating.', 'Provides locomotion and hydraulic pressure.', 1, new THREE.Vector3(0, 0, -10));
    registerPart('Front Articulation Frame', frontFrame, 'The forward section of the bolter, carrying the heavy boom payloads.', 'Reinforced carbon steel.', 'Maneuvers the drilling apparatus in tight tunnels.', 2, new THREE.Vector3(0, 0, 10));
    registerPart('FOPS Canopy & Cabin', fopsCabin, 'Falling Object Protective Structure with panoramic tinted visibility.', 'Titanium alloy framework with blast-resistant glass.', 'Protects the operator from cave-ins while providing high-tech UI control.', 3, new THREE.Vector3(0, 10, 0));
    registerPart('Central Articulation Joint', joint, 'Massive double-pinned pivot connecting front and rear frames.', 'Chromoly steel.', 'Allows a tight turning radius for subterranean navigation.', 4, new THREE.Vector3(-8, 0, 0));
    registerPart('Telescopic Drill Boom Base', mount, 'Spherical tri-axis mount for the primary drill boom.', 'Forged steel.', 'Aims the rock drill with millimeter precision.', 5, new THREE.Vector3(0, 5, 5));
    registerPart('Stage 1 Boom Arm', boom1, 'Primary hydraulic extension cylinder housing.', 'Steel and chrome.', 'Extends the reach of the bolter to high tunnel roofs.', 6, new THREE.Vector3(0, 8, 8));
    registerPart('Stage 2 Boom Extension', boom2, 'Secondary internal telescopic reach arm.', 'Hardened Chrome.', 'Provides deep penetration capability without repositioning the vehicle.', 7, new THREE.Vector3(0, 12, 12));
    registerPart('Drill Feed Mast', mast, 'Linear rail system guiding the rotary percussion head.', 'Heavy gauge extruded steel.', 'Maintains perfect linear alignment during drilling and bolting.', 8, new THREE.Vector3(0, 15, 10));
    registerPart('Rotary Percussive Head', head, 'High-torque hydraulic drilling motor.', 'Cast aluminum and steel internals.', 'Spins and hammers the drill string into solid rock.', 9, new THREE.Vector3(0, 15, 15));
    registerPart('Tungsten Carbide Drill Bit', bit, 'The cutting face of the bolter string.', 'Tungsten Carbide and Chrome.', 'Crushes rock at high RPMs to create bolt shafts.', 10, new THREE.Vector3(0, 15, 20));
    registerPart('Resin Injector Shoulder', resinArm.children[0], 'Pivot base for the chemical anchoring arm.', 'Steel.', 'Swings the resin injector into alignment with the drilled hole.', 11, new THREE.Vector3(5, 5, 0));
    registerPart('Resin Injector Nozzle', resinArm.children[0].children[0].children[0], 'Pumps dual-part epoxy resin into the rock cavity.', 'Aluminum and Teflon.', 'Secures the rock bolt permanently into the geological strata.', 12, new THREE.Vector3(8, 8, 0));
    registerPart('Left Rear Off-Road Tire', wheels[0], 'Massive deep-treaded pneumatic tire.', 'Vulcanized rubber over steel rims.', 'Traction on loose, wet, and rocky subterranean floors.', 13, new THREE.Vector3(10, 0, -5));
    registerPart('Right Rear Off-Road Tire', wheels[1], 'Massive deep-treaded pneumatic tire.', 'Vulcanized rubber over steel rims.', 'Traction on loose, wet, and rocky subterranean floors.', 14, new THREE.Vector3(-10, 0, -5));
    registerPart('Left Front Off-Road Tire', wheels[2], 'Massive deep-treaded pneumatic tire.', 'Vulcanized rubber over steel rims.', 'Traction on loose, wet, and rocky subterranean floors.', 15, new THREE.Vector3(10, 0, 5));
    registerPart('Right Front Off-Road Tire', wheels[3], 'Massive deep-treaded pneumatic tire.', 'Vulcanized rubber over steel rims.', 'Traction on loose, wet, and rocky subterranean floors.', 16, new THREE.Vector3(-10, 0, 5));

    // --- Animation Function ---
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // 1. Wheel Rotation (continuous)
        wheels.forEach(w => {
            w.children[0].rotation.z -= 0.02 * speed; // Tire body
            w.children.slice(1).forEach(c => c.rotation.z -= 0.02 * speed); // Treads & spokes
        });

        // 2. Chassis Articulation (sine wave steering)
        const steerAngle = Math.sin(t * 0.5) * 0.25;
        frontFrame.rotation.y = steerAngle;
        rearFrame.rotation.y = -steerAngle * 0.5;

        // 3. Boom Movement (up/down and telescopic extension)
        const boomPitch = Math.sin(t * 0.3) * 0.4 + 0.4;
        mount.rotation.x = boomPitch;
        
        const boomExtend = Math.sin(t * 0.4) * 3 + 3; // 0 to 6
        boom2.position.z = 8 + boomExtend;

        // 4. Drill Feed Rail Sliding
        const feedSlide = Math.cos(t * 0.6) * 3;
        head.position.y = feedSlide;

        // 5. Drill Bit Spinning (very fast)
        bit.rotation.y += 0.5 * speed;
        bitTip.rotation.y += 0.5 * speed;

        // 6. Resin Arm Swinging in and out sync'd with drill retracting
        const armSwing = Math.sin(t * 0.3 + Math.PI) * 0.8; 
        resinArm.children[0].rotation.z = Math.PI / 2 + armSwing;

        // 7. Pulse neon lights
        const pulse = (Math.sin(t * 5) * 0.5 + 0.5) * 2 + 1;
        neonBlue.emissiveIntensity = pulse;
        neonRed.emissiveIntensity = (Math.cos(t * 10) * 0.5 + 0.5) * 3;
        neonGreen.emissiveIntensity = (Math.sin(t * 2) * 0.5 + 0.5) * 2.5;
    };

    // --- Quiz Questions ---
    const quizQuestions = [
        {
            question: "Why does the Rock Bolter utilize an articulated chassis design rather than standard front-wheel steering?",
            options: [
                "To reduce the overall weight of the vehicle.",
                "To drastically decrease the turning radius for navigation in narrow mine drifts.",
                "To allow the cabin to spin 360 degrees independently.",
                "To eliminate the need for hydraulic fluid."
            ],
            correctAnswer: 1,
            explanation: "Articulated steering bends the vehicle in the middle, allowing massively heavy and long machinery to navigate the extremely tight, winding tunnels found in underground mining."
        },
        {
            question: "What is the primary function of the FOPS canopy on the bolter's cabin?",
            options: [
                "Filtering out hazardous diesel particulate matter.",
                "Providing a pressurized environment for deep sea operations.",
                "Protecting the operator from falling rocks (Falling Object Protective Structure).",
                "Acting as an antenna for underground communications."
            ],
            correctAnswer: 2,
            explanation: "FOPS stands for Falling Object Protective Structure, an essential safety requirement to protect miners from ceiling rock-falls during the bolting process."
        },
        {
            question: "What role does the 'Rotary Percussive Head' play in installing rock bolts?",
            options: [
                "It strictly relies on high-speed diamond cutting to slice the rock.",
                "It combines rotational spinning with a hammer-like striking action to pulverize solid rock.",
                "It melts the rock using high-frequency lasers.",
                "It injects the epoxy resin without drilling."
            ],
            correctAnswer: 1,
            explanation: "Rotary percussive drilling uses both high-torque rotation and rapid high-impact hammering to efficiently break and clear extremely hard geological strata."
        },
        {
            question: "Why is the Resin Injector Arm separate from the primary drill string?",
            options: [
                "Because resin cannot be pumped through the drill string without clogging the flushing ports.",
                "To balance the weight distribution on the front chassis.",
                "It is purely a backup system in case the main drill fails.",
                "To allow two operators to work simultaneously on different tunnels."
            ],
            correctAnswer: 0,
            explanation: "Two-part epoxy resins cure rapidly. Pumping them directly through the primary drill bit would permanently clog the water/air flushing holes used during the drilling phase."
        },
        {
            question: "What is the purpose of the telescopic boom segments in the primary drilling arm?",
            options: [
                "To allow the bolter to act as a crane and lift heavy equipment.",
                "To measure the depth of the tunnel accurately.",
                "To reach variable roof heights and drill deep bolt holes without constantly repositioning the entire vehicle.",
                "To store extra drill bits internally."
            ],
            correctAnswer: 2,
            explanation: "Telescopic booms provide massive variable reach. This allows the machine to park securely once, while the arm extends to reach high ceilings or drive long bolts deep into the rock."
        }
    ];

    return {
        group: machineGroup,
        parts: parts,
        description: "An ultra high-tech, heavily articulated Underground Rock Bolter. Features complex off-road tires, a panoramic FOPS canopy, telescopic rotary percussive drilling booms, and an automated chemical resin injection system.",
        quizQuestions: quizQuestions,
        animate: animate
    };
}
