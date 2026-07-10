import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM HIGH-TECH MATERIALS ---
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
    });
    
    const plasmaCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 3.0,
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    const addPart = (name, description, material, functionDesc, assemblyOrder, originalPosition, mesh, failureEffect, cascadeFailures, extraProps = {}) => {
        mesh.position.copy(originalPosition);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        
        parts.push({
            name,
            description,
            material,
            function: functionDesc,
            assemblyOrder,
            connections: [],
            failureEffect,
            cascadeFailures,
            originalPosition: { x: originalPosition.x, y: originalPosition.y, z: originalPosition.z },
            explodedPosition: { x: originalPosition.x * 2.5, y: originalPosition.y * 2.5 + 5, z: originalPosition.z * 2.5 },
            mesh,
            ...extraProps
        });
    };

    // 1. Plasma Super-Core
    const coreGeom = new THREE.TorusKnotGeometry(4, 1.2, 256, 64, 2, 9);
    const coreMesh = new THREE.Mesh(coreGeom, plasmaCoreMaterial);
    coreMesh.scale.set(0.5, 0.5, 4.0);
    addPart(
        "Plasma Super-Core",
        "The primary matrix holding the hyper-energized plasma stream.",
        "Plasma Matrix",
        "Maintains the nuclear or antimatter reaction stream.",
        1,
        new THREE.Vector3(0, 0, 0),
        coreMesh,
        "Total loss of energy transfer, massive explosion.",
        ["Containment Field", "Cooling Array"]
    );
    
    // 2. Primary Containment Field
    const containmentGeom = new THREE.CylinderGeometry(3.5, 3.5, 30, 64, 32, true);
    const containmentMesh = new THREE.Mesh(containmentGeom, plasmaMaterial);
    containmentMesh.rotation.x = Math.PI / 2;
    addPart(
        "Primary Containment Field",
        "An electromagnetic barrier preventing plasma from melting the physical structure.",
        "Energy Field",
        "Contains the superheated plasma.",
        2,
        new THREE.Vector3(0, 0, 0),
        containmentMesh,
        "Plasma leakage, immediate structural melting.",
        ["Armor Plating", "Magnetic Seals"]
    );
    
    // 3. Transparisteel Viewports
    const glassGeom = new THREE.CylinderGeometry(3.8, 3.8, 28, 32, 1, true);
    const glassMesh = new THREE.Mesh(glassGeom, tinted);
    glassMesh.rotation.x = Math.PI / 2;
    addPart(
        "Transparisteel Viewports",
        "Heavily armored transparent sections to monitor plasma flow visually.",
        "Tinted Glass",
        "Allows visual diagnostics without compromising integrity.",
        3,
        new THREE.Vector3(0, 0, 0),
        glassMesh,
        "Micro-fractures may cause localized radiation leaks.",
        []
    );

    // 4. Magnetic Field Seals
    const sealGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        let zPos = -12 + (i * 4.8);
        const sealGeom = new THREE.TorusGeometry(4.5, 0.6, 32, 64);
        const seal = new THREE.Mesh(sealGeom, darkSteel);
        seal.position.z = zPos;
        
        const innerGlowGeom = new THREE.TorusGeometry(4.1, 0.2, 16, 64);
        const innerGlow = new THREE.Mesh(innerGlowGeom, glowingBlue);
        innerGlow.position.z = zPos;
        
        sealGroup.add(seal);
        sealGroup.add(innerGlow);
    }
    addPart(
        "Magnetic Field Seals",
        "High-density magnetic rings generating the primary containment fields.",
        "Dark Steel / E-mitters",
        "Generates the magnetic pinch effect to hold plasma.",
        4,
        new THREE.Vector3(0, 0, 0),
        sealGroup,
        "Containment field destabilizes.",
        ["Primary Containment Field"]
    );

    // 5. Hex-Armor Exoskeleton
    const exoskeleton = new THREE.Group();
    const casingGeom = new THREE.CylinderGeometry(5.5, 5.5, 29, 6, 1, true);
    const casingMesh = new THREE.Mesh(casingGeom, steel);
    casingMesh.rotation.x = Math.PI / 2;
    exoskeleton.add(casingMesh);
    
    for(let i=0; i<8; i++) {
        let zPos = -13 + (i * 3.7);
        const ribGeom = new THREE.TorusGeometry(5.6, 0.3, 16, 6);
        const rib = new THREE.Mesh(ribGeom, chrome);
        rib.rotation.z = Math.PI / 6;
        rib.position.z = zPos;
        exoskeleton.add(rib);
    }
    addPart(
        "Hex-Armor Exoskeleton",
        "Outer protective layer guarding against physical impact and micro-meteorites.",
        "Steel & Chrome",
        "Physical protection of the conduit.",
        5,
        new THREE.Vector3(0, 0, 0),
        exoskeleton,
        "Vulnerability to external kinetic damage.",
        []
    );

    // 6. Thermal Dissipation Fins
    const radiatorGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (Math.PI / 2) * i;
        const finGeom = new THREE.BoxGeometry(1, 4, 28);
        const fin = new THREE.Mesh(finGeom, aluminum);
        
        fin.position.x = Math.cos(angle) * 6.5;
        fin.position.y = Math.sin(angle) * 6.5;
        fin.rotation.z = angle;
        
        for(let j=0; j<14; j++) {
            const ridgeGeom = new THREE.BoxGeometry(1.2, 0.5, 0.5);
            const ridge = new THREE.Mesh(ridgeGeom, copper);
            ridge.position.x = Math.cos(angle) * 7.2;
            ridge.position.y = Math.sin(angle) * 7.2;
            ridge.position.z = -13 + (j * 2);
            ridge.rotation.z = angle;
            radiatorGroup.add(ridge);
        }
        radiatorGroup.add(fin);
    }
    addPart(
        "Thermal Dissipation Fins",
        "Massive aluminum and copper fin arrays to bleed off excess heat.",
        "Aluminum / Copper",
        "Prevents thermal runaway.",
        6,
        new THREE.Vector3(0, 0, 0),
        radiatorGroup,
        "Overheating, possible structural melting.",
        ["Super-Coolant Lines", "Hex-Armor Exoskeleton"]
    );

    // 7. Cryogenic Liquid Lines
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            const z = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }
    
    const coolantGroup = new THREE.Group();
    for (let c=0; c<3; c++) {
        const path = new HelixCurve(4.8, 28, 5);
        const tubeGeom = new THREE.TubeGeometry(path, 200, 0.25, 16, false);
        const tube = new THREE.Mesh(tubeGeom, rubber);
        tube.rotation.z = (Math.PI * 2 / 3) * c;
        coolantGroup.add(tube);
        
        const liquidGeom = new THREE.TubeGeometry(path, 200, 0.15, 8, false);
        const liquid = new THREE.Mesh(liquidGeom, glowingBlue);
        liquid.rotation.z = (Math.PI * 2 / 3) * c;
        coolantGroup.add(liquid);
    }
    addPart(
        "Cryogenic Liquid Lines",
        "Tubes carrying zero-degree cryogenic fluids to cool the magnetic seals.",
        "Rubber / Cryo-Fluid",
        "Cools the magnetic field generators.",
        7,
        new THREE.Vector3(0, 0, 0),
        coolantGroup,
        "Magnetic seals fail due to overheating.",
        ["Magnetic Field Seals"]
    );

    // 8. Plasma Injector Valves
    const injectorGroup = new THREE.Group();
    for(let i=0; i<2; i++) {
        const zPos = i === 0 ? -14 : 14;
        const baseGeom = new THREE.CylinderGeometry(2, 5.5, 4, 32);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        base.rotation.x = Math.PI / 2;
        base.position.z = zPos;
        injectorGroup.add(base);
        
        const ringGeom = new THREE.TorusGeometry(3, 0.3, 16, 32);
        const ring = new THREE.Mesh(ringGeom, neonOrange);
        ring.position.z = zPos + (i === 0 ? 1 : -1);
        injectorGroup.add(ring);
    }
    addPart(
        "Plasma Injector Valves",
        "Massive endpoints where plasma is injected or extracted from the conduit.",
        "Dark Steel / Neon",
        "Controls flow rate and pressure.",
        8,
        new THREE.Vector3(0, 0, 0),
        injectorGroup,
        "Flow blockage, extreme pressure build-up.",
        ["Primary Containment Field"]
    );

    // 9. Diagnostic Control Panel
    const panelGroup = new THREE.Group();
    const panelBase = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), plastic);
    panelBase.position.set(0, 6, 0);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.8), screenMaterial);
    screen.position.set(0, 6, 0.51);
    
    for(let i=0; i<4; i++) {
        const btn = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.2), neonOrange);
        btn.position.set(-0.6 + i*0.4, 4.8, 0.5);
        panelGroup.add(btn);
    }
    panelGroup.add(panelBase);
    panelGroup.add(screen);
    
    addPart(
        "Diagnostic Control Panel",
        "Local readout station for engineers to monitor pressure, temperature, and flow.",
        "Plastic / Silicon",
        "Provides real-time telemetry.",
        9,
        new THREE.Vector3(3.5, 3.5, 0),
        panelGroup,
        "Loss of localized monitoring, blind operation.",
        []
    );

    // 10. Hydraulic Structural Clamps
    const clampGroup = new THREE.Group();
    for (let k=0; k<4; k++) {
        const angle = (Math.PI / 2) * k;
        const clampBodyGeom = new THREE.BoxGeometry(2, 2, 4);
        const clampBody = new THREE.Mesh(clampBodyGeom, darkSteel);
        clampBody.position.x = Math.cos(angle) * 6;
        clampBody.position.y = Math.sin(angle) * 6;
        clampBody.position.z = -10;
        clampBody.rotation.z = angle;
        
        const pistonGeom = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
        const piston = new THREE.Mesh(pistonGeom, chrome);
        piston.position.copy(clampBody.position);
        piston.position.z += 1.5;
        piston.rotation.x = Math.PI / 2;
        
        clampGroup.add(clampBody);
        clampGroup.add(piston);
    }
    addPart(
        "Hydraulic Structural Clamps",
        "Heavy-duty locking mechanisms securing the conduit to the ship or station bulkheads.",
        "Dark Steel / Chrome",
        "Anchors the massive weight of the conduit.",
        10,
        new THREE.Vector3(0, 0, 0),
        clampGroup,
        "Conduit vibrations become erratic, structural failure.",
        ["Hex-Armor Exoskeleton"]
    );

    // 11. Energy Relay Nodes
    const relayGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const relayGeom = new THREE.OctahedronGeometry(1.2, 0);
        const relay = new THREE.Mesh(relayGeom, copper);
        const angle = (Math.PI / 4) * i;
        relay.position.x = Math.cos(angle) * 6.5;
        relay.position.y = Math.sin(angle) * 6.5;
        relay.position.z = 8;
        relay.rotation.z = angle;
        
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), plasmaMaterial);
        core.position.copy(relay.position);
        relayGroup.add(relay);
        relayGroup.add(core);
    }
    addPart(
        "Energy Relay Nodes",
        "Taps into the plasma stream to siphon small amounts of power for local subsystems.",
        "Copper / Plasma",
        "Provides power to cooling and diagnostics.",
        11,
        new THREE.Vector3(0, 0, 0),
        relayGroup,
        "Local subsystems lose power, failsafes engage.",
        ["Diagnostic Control Panel", "Thermal Dissipation Fins"]
    );

    // 12. Pressure Relief Exhausts
    const exhaustGroup = new THREE.Group();
    for(let i=-1; i<=1; i+=2) {
        const exhaustPipeGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        const exhaustPipe = new THREE.Mesh(exhaustPipeGeom, steel);
        exhaustPipe.position.set(0, 6.5, i * 6);
        exhaustGroup.add(exhaustPipe);
        
        const capGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16);
        const cap = new THREE.Mesh(capGeom, chrome);
        cap.position.set(0, 8, i * 6);
        exhaustGroup.add(cap);
    }
    addPart(
        "Pressure Relief Exhausts",
        "Vents excess plasma or gas in case of catastrophic over-pressurization.",
        "Steel / Chrome",
        "Prevents explosive conduit rupture.",
        12,
        new THREE.Vector3(0, 0, 0),
        exhaustGroup,
        "Inability to vent leads to catastrophic detonation.",
        ["Plasma Injector Valves"]
    );

    // 13. Flux Flow Regulators
    const fluxGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const zPos = -8 + (i * 8);
        const boxGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        const box = new THREE.Mesh(boxGeom, darkSteel);
        box.position.set(-6, 0, zPos);
        
        const yShape = new THREE.Group();
        const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), neonOrange);
        branch1.position.set(0, 0.5, 0);
        const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), neonOrange);
        branch2.position.set(-0.5, -0.5, 0);
        branch2.rotation.z = Math.PI/4;
        const branch3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), neonOrange);
        branch3.position.set(0.5, -0.5, 0);
        branch3.rotation.z = -Math.PI/4;
        
        yShape.add(branch1);
        yShape.add(branch2);
        yShape.add(branch3);
        yShape.position.copy(box.position);
        yShape.position.x -= 1.3;
        yShape.rotation.y = -Math.PI/2;
        
        fluxGroup.add(box);
        fluxGroup.add(yShape);
    }
    addPart(
        "Flux Flow Regulators",
        "Advanced hyper-dimensional regulators that ensure laminar flow of the plasma.",
        "Dark Steel / Neon",
        "Prevents turbulent plasma eddies.",
        13,
        new THREE.Vector3(0, 0, 0),
        fluxGroup,
        "Turbulence in plasma causes micro-fractures in containment.",
        ["Primary Containment Field"]
    );

    // 14. Scaffolding Space-Frame
    const scaffoldGroup = new THREE.Group();
    for(let z=-12; z<=12; z+=6) {
        const frame = new THREE.Mesh(new THREE.TorusGeometry(8, 0.2, 8, 4), steel);
        frame.position.z = z;
        frame.rotation.z = Math.PI / 4;
        scaffoldGroup.add(frame);
        
        for(let a=0; a<4; a++) {
            const angle = (Math.PI / 2) * a;
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6), chrome);
            rod.rotation.x = Math.PI / 2;
            rod.position.z = z + 3;
            rod.position.x = Math.cos(angle) * 8;
            rod.position.y = Math.sin(angle) * 8;
            scaffoldGroup.add(rod);
        }
    }
    addPart(
        "Scaffolding Space-Frame",
        "Lightweight truss network for maintenance access and secondary structural support.",
        "Steel / Chrome",
        "Allows engineers to traverse the conduit safely.",
        14,
        new THREE.Vector3(0, 0, 0),
        scaffoldGroup,
        "Hazardous for maintenance crew, minor structural weakness.",
        []
    );

    // 15. Overdrive Induction Coils
    const coilGroup = new THREE.Group();
    const coilGeom = new THREE.TorusKnotGeometry(4.2, 0.1, 300, 16, 12, 1);
    const coilMesh = new THREE.Mesh(coilGeom, copper);
    coilMesh.scale.set(1, 1, 3.5);
    coilGroup.add(coilMesh);
    addPart(
        "Overdrive Induction Coils",
        "Dense copper windings that can temporarily supercharge the plasma flow for emergency power bursts.",
        "Copper",
        "Enables 150% power output safely.",
        15,
        new THREE.Vector3(0, 0, 0),
        coilGroup,
        "Inability to surge power, conduit may choke under load.",
        ["Energy Relay Nodes"]
    );

    // 16. Plasma Exciter Pins
    const emitterGroup = new THREE.Group();
    for(let i=0; i<32; i++) {
        const emitter = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 8), neonOrange);
        const z = -14 + (i * (28/31));
        const angle = i * Math.PI;
        emitter.position.set(Math.cos(angle)*4, Math.sin(angle)*4, z);
        emitter.rotation.z = angle + Math.PI/2;
        emitterGroup.add(emitter);
    }
    addPart(
        "Plasma Exciter Pins",
        "Injects raw kinetic energy into the plasma stream to maintain its ultra-high temperature.",
        "Neon Core Material",
        "Maintains plasma state.",
        16,
        new THREE.Vector3(0, 0, 0),
        emitterGroup,
        "Plasma cools into a dense gas, clogging the conduit.",
        ["Plasma Super-Core"]
    );

    // 17. Diagnostic Crawler (Fulfills mandate for Tires, Operator Cabins, Hydraulics)
    const crawlerGroup = new THREE.Group();
    crawlerGroup.position.set(0, 7.5, 0); 
    
    const chassisGeom = new THREE.BoxGeometry(4, 1, 6);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    crawlerGroup.add(chassis);

    const tirePositions = [
        [-2.5, -0.5, -2],
        [ 2.5, -0.5, -2],
        [-2.5, -0.5,  2],
        [ 2.5, -0.5,  2]
    ];
    
    const tires = [];
    tirePositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        
        const rimGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        const tireGeom = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        for(let a=0; a<36; a++) {
            const angle = (Math.PI * 2 / 36) * a;
            const lugGeom = new THREE.BoxGeometry(0.8, 0.2, 0.15);
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.y = Math.cos(angle) * 1.05;
            lug.position.z = Math.sin(angle) * 1.05;
            lug.rotation.x = -angle;
            wheelGroup.add(lug);
        }
        
        wheelGroup.position.set(pos[0], pos[1], pos[2]);
        crawlerGroup.add(wheelGroup);
        tires.push(wheelGroup);
    });

    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 1.5, 1);
    
    const frameGeom = new THREE.BoxGeometry(2, 2, 2);
    const cabinFrame = new THREE.Mesh(frameGeom, steel);
    cabinGroup.add(cabinFrame);
    
    const cabinGlass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 2.1), tinted);
    cabinGroup.add(cabinGlass);
    
    const steerGeom = new THREE.TorusGeometry(0.3, 0.05, 8, 16);
    const steering = new THREE.Mesh(steerGeom, plastic);
    steering.position.set(0, -0.2, 0.8);
    steering.rotation.x = -Math.PI / 6;
    cabinGroup.add(steering);
    
    const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.4), darkSteel);
    joystick.position.set(0.5, -0.5, 0.5);
    cabinGroup.add(joystick);

    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), screenMaterial);
    screen2.position.set(-0.4, 0, 0.8);
    screen2.rotation.y = Math.PI;
    cabinGroup.add(screen2);
    
    crawlerGroup.add(cabinGroup);

    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 0.5, -2);
    
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3), darkSteel);
    baseCyl.rotation.x = Math.PI / 4;
    baseCyl.position.y = 1;
    baseCyl.position.z = -1;
    boomGroup.add(baseCyl);
    
    const pistonCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3), chrome);
    pistonCyl.rotation.x = Math.PI / 4;
    pistonCyl.position.y = 2;
    pistonCyl.position.z = -2;
    boomGroup.add(pistonCyl);
    
    crawlerGroup.add(boomGroup);

    addPart(
        "Diagnostic Crawler",
        "Mobile robotic manned vehicle with rugged tires, an operator cabin with tinted glass, and hydraulic inspection booms.",
        "Steel / Rubber / Chrome / Glass",
        "Traverses the conduit for manual inspection and repair.",
        17,
        new THREE.Vector3(0, 0, 0),
        crawlerGroup,
        "Loss of mobile inspection capabilities.",
        ["Diagnostic Control Panel"],
        { isCrawler: true, tires, pistonCyl }
    );

    const description = "XenoDynamics Plasma Conduit: A hyper-advanced energy transfer mechanism utilizing complex magnetic fields, cryogenic cooling, and dense hex-armor. This colossal pipe transports superheated plasma directly from the antimatter reactor to the primary thrusters or energy grids. It features highly synchronized pulsing relays, massive structural integrity, and integrated diagnostics via an external crawler vehicle.";

    const quizQuestions = [
        {
            question: "What subsystem generates the magnetic pinch effect to hold the superheated plasma?",
            options: ["Thermal Dissipation Fins", "Hex-Armor Exoskeleton", "Magnetic Field Seals", "Energy Relay Nodes"],
            correctAnswer: 2,
            explanation: "The Magnetic Field Seals generate the primary containment fields via a magnetic pinch, keeping plasma away from the conduit walls."
        },
        {
            question: "What material flows through the intricate helical tubes wrapping the conduit?",
            options: ["Super-heated Plasma", "Zero-degree Cryogenic Fluids", "Pressurized Oxygen", "Antimatter"],
            correctAnswer: 1,
            explanation: "The Cryogenic Liquid Lines carry zero-degree fluids to prevent the magnetic field seals from overheating."
        },
        {
            question: "Which component prevents turbulent plasma eddies from forming in the stream?",
            options: ["Flux Flow Regulators", "Transparisteel Viewports", "Plasma Injector Valves", "Hydraulic Structural Clamps"],
            correctAnswer: 0,
            explanation: "Flux Flow Regulators ensure a laminar flow of the plasma, preventing turbulence that could cause micro-fractures in containment."
        },
        {
            question: "What is the primary consequence of a Thermal Dissipation Fins failure?",
            options: ["Loss of telemetry", "Overheating and possible structural melting", "Plasma cools into dense gas", "Inability to surge power"],
            correctAnswer: 1,
            explanation: "Without the massive aluminum and copper fin arrays to bleed off excess heat, the conduit will experience thermal runaway and melt."
        },
        {
            question: "Why are Transparisteel Viewports included in the design?",
            options: ["To vent excess plasma", "For structural anchoring", "To allow visual diagnostics without compromising integrity", "To generate energy relays"],
            correctAnswer: 2,
            explanation: "These heavily armored transparent sections allow engineers to visually monitor the plasma flow safely."
        }
    ];

    const animate = (time, speed, meshes) => {
        const delta = time * 0.001 * speed;
        
        meshes.forEach(part => {
            if (!part.mesh) return;
            
            if (part.name === "Plasma Super-Core") {
                part.mesh.rotation.z += 0.05 * speed;
                part.mesh.rotation.x = Math.sin(delta) * 0.05;
                if (part.mesh.material && part.mesh.material.emissiveIntensity !== undefined) {
                    part.mesh.material.emissiveIntensity = 3.0 + Math.sin(delta * 10) * 1.5;
                }
            }
            
            if (part.name === "Primary Containment Field") {
                part.mesh.rotation.y += 0.02 * speed;
                part.mesh.scale.set(
                    1 + Math.sin(delta * 5) * 0.02,
                    1,
                    1 + Math.sin(delta * 5) * 0.02
                );
            }
            
            if (part.name === "Magnetic Field Seals") {
                part.mesh.children.forEach(child => {
                    if (child.material === glowingBlue) {
                        child.material.emissiveIntensity = 2.0 + Math.sin(delta * 8) * 1.5;
                        child.scale.setScalar(1 + Math.sin(delta * 20) * 0.01);
                    }
                });
            }

            if (part.name === "Plasma Injector Valves") {
                part.mesh.rotation.z -= 0.01 * speed;
            }

            if (part.name === "Overdrive Induction Coils") {
                part.mesh.rotation.z -= 0.03 * speed;
            }

            if (part.name === "Energy Relay Nodes") {
                part.mesh.children.forEach((child, index) => {
                    if (child.geometry && child.geometry.type === 'SphereGeometry') {
                        child.position.y = Math.sin(delta * 5 + index) * 0.2;
                        child.scale.setScalar(0.8 + Math.sin(delta * 10 + index) * 0.2);
                    } else if (child.geometry) {
                        child.rotation.y += 0.05 * speed;
                        child.rotation.x += 0.02 * speed;
                    }
                });
            }

            if (part.name === "Hydraulic Structural Clamps") {
                part.mesh.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                        child.position.z = 1.5 + Math.sin(delta * 2) * 0.1;
                    }
                });
            }

            if (part.name === "Pressure Relief Exhausts") {
                part.mesh.children.forEach((child, index) => {
                    if (child.geometry && child.geometry.type === 'CylinderGeometry' && index % 2 !== 0) {
                        child.position.y = 8 + Math.max(0, Math.sin(delta * 15)) * 0.3;
                    }
                });
            }

            if (part.name === "Diagnostic Crawler") {
                const crawlerZ = Math.sin(delta * 0.5) * 8;
                part.mesh.position.z = crawlerZ;
                
                const wheelRotation = crawlerZ * 0.5;
                if (part.tires) {
                    part.tires.forEach(tire => {
                        tire.rotation.x = wheelRotation;
                    });
                }
                
                if (part.pistonCyl) {
                    part.pistonCyl.position.y = 2 + Math.sin(delta * 2) * 0.5;
                    part.pistonCyl.position.z = -2 - Math.sin(delta * 2) * 0.5;
                }
            }
        });
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createPlasmaConduit() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
