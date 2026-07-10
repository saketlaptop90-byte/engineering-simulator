import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const meshes = {};
    const parts = [];

    // Custom emissive materials for high-tech look
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff2222, emissiveIntensity: 2, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff22, emissiveIntensity: 2, roughness: 0.2 });
    const pcbGreen = new THREE.MeshStandardMaterial({ color: 0x003300, roughness: 0.8, metalness: 0.2 });
    const goldPlated = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.1 });
    const titanium = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
    const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4, wireframe: true }); // Mocking pattern

    function addPart(name, mesh, partData) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name: partData.name || name,
            description: partData.description || "Component",
            material: partData.material || "Unknown",
            function: partData.function || "Unknown",
            assemblyOrder: partData.assemblyOrder || 1,
            connections: partData.connections || [],
            failureEffect: partData.failureEffect || "Catastrophic failure.",
            cascadeFailures: partData.cascadeFailures || [],
            originalPosition: mesh.position.clone(),
            explodedPosition: partData.explodedPosition || mesh.position.clone().add(new THREE.Vector3(0, 10, 0))
        });
    }

    // 1. BASE MOUNTING PLATE (Highly detailed extrude)
    const baseShape = new THREE.Shape();
    const br = 15;
    baseShape.moveTo(br, 0);
    for (let i = 1; i <= 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const rad = i % 2 === 0 ? br : br - 2;
        baseShape.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }
    const baseExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.4, bevelThickness: 0.4 };
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeom.center();
    const baseMount = new THREE.Mesh(baseGeom, titanium);
    baseMount.position.set(0, -10, 0);
    baseMount.rotation.x = Math.PI / 2;
    
    // Bolt holes on base
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 16), chrome);
        bolt.position.set(Math.cos(angle)*13, 0.5, Math.sin(angle)*13);
        bolt.rotation.x = Math.PI / 2;
        baseMount.add(bolt);
    }
    addPart('BaseMount', baseMount, {
        name: "Titanium Mounting Base & Flange",
        description: "The primary structural interface to the spacecraft bus, designed with webbing to withstand intense launch vibrations.",
        material: "Aerospace Grade Titanium Alloy",
        function: "Secures the reaction wheel assembly to the spacecraft rigid structure.",
        assemblyOrder: 1,
        connections: ["VibrationIsolators", "LowerCasing"],
        failureEffect: "Loss of structural integrity, decoupling from spacecraft, inducing random attitude drift.",
        explodedPosition: new THREE.Vector3(0, -35, 0)
    });

    // 2. ELASTOMERIC VIBRATION ISOLATORS
    const isolatorGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 11;
        const z = Math.sin(angle) * 11;
        
        // Rubber damper
        const isoGeom = new THREE.TorusGeometry(1.5, 0.8, 16, 32);
        const isoMesh = new THREE.Mesh(isoGeom, rubber);
        isoMesh.position.set(x, -9, z);
        isoMesh.rotation.x = Math.PI / 2;
        
        // Steel central strut
        const strutGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
        const strutMesh = new THREE.Mesh(strutGeom, steel);
        strutMesh.position.set(x, -9, z);
        
        // Fastener head
        const headGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 6);
        const headMesh = new THREE.Mesh(headGeom, darkSteel);
        headMesh.position.set(x, -7.5, z);
        
        isolatorGroup.add(isoMesh);
        isolatorGroup.add(strutMesh);
        isolatorGroup.add(headMesh);
    }
    addPart('VibrationIsolators', isolatorGroup, {
        name: "Hex-Viscoelastic Vibration Isolators",
        description: "High-damping rubberized toroidal mounts to isolate high-frequency jitter (micro-vibrations) from the optical payload.",
        material: "Viscoelastic Rubber & Steel Struts",
        function: "Damps micro-vibrations induced by the spinning flywheel's minute imbalances.",
        assemblyOrder: 2,
        connections: ["BaseMount", "LowerCasing"],
        failureEffect: "Increased spacecraft jitter, blurring telescope or camera images.",
        explodedPosition: new THREE.Vector3(0, -25, 0)
    });

    // 3. LOWER VACUUM HOUSING CASING
    const lowerCasingPoints = [];
    for (let i = 0; i <= 20; i++) {
        // Complex curvature
        const height = i * 0.4;
        const radius = 12 + Math.sin(height * 0.5) * 1.5;
        lowerCasingPoints.push(new THREE.Vector2(radius, height));
    }
    const lowerCasingGeom = new THREE.LatheGeometry(lowerCasingPoints, 128);
    const lowerCasing = new THREE.Mesh(lowerCasingGeom, aluminum);
    lowerCasing.position.set(0, -8, 0);
    
    // Add cooling ribs to lower casing
    for(let i=0; i<24; i++) {
        const angle = (i/24) * Math.PI * 2;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 0.3), darkSteel);
        rib.position.set(Math.cos(angle)*13, 3.5, Math.sin(angle)*13);
        rib.rotation.y = -angle;
        lowerCasing.add(rib);
    }

    addPart('LowerCasing', lowerCasing, {
        name: "Lower Vacuum Housing & Stator Mount",
        description: "Lower half of the hermetically sealed enclosure holding high vacuum or low-pressure helium.",
        material: "Anodized Aerospace Aluminum 7075",
        function: "Maintains controlled environment, houses lower bearings and electric stator.",
        assemblyOrder: 3,
        connections: ["VibrationIsolators", "StatorAssembly", "LowerBearing"],
        failureEffect: "Loss of internal atmosphere, increased windage drag, rapid overheating.",
        explodedPosition: new THREE.Vector3(0, -15, 0)
    });

    // 4. STATOR ASSEMBLY (Electric Motor)
    const statorGroup = new THREE.Group();
    const statorCoreGeom = new THREE.TorusGeometry(5, 1.5, 32, 128);
    const statorCore = new THREE.Mesh(statorCoreGeom, darkSteel);
    statorCore.rotation.x = Math.PI / 2;
    statorGroup.add(statorCore);
    
    // Extremely detailed Copper Windings
    for(let i=0; i<36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        // Make coils look like bundles of wire using TorusKnot
        const coilGeom = new THREE.TorusKnotGeometry(1.6, 0.3, 64, 8, 2, 5);
        const coilMesh = new THREE.Mesh(coilGeom, copper);
        coilMesh.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
        coilMesh.rotation.y = -angle;
        coilMesh.rotation.x = Math.PI / 2;
        statorGroup.add(coilMesh);
    }
    
    // Hall effect sensors inside stator
    for(let i=0; i<3; i++) {
        const angle = (i / 3) * Math.PI * 2 + 0.1;
        const hall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), plastic);
        hall.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        statorGroup.add(hall);
        
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), neonGreen);
        led.position.set(Math.cos(angle) * 3.3, 0.3, Math.sin(angle) * 3.3);
        statorGroup.add(led);
    }

    statorGroup.position.set(0, -4, 0);
    addPart('StatorAssembly', statorGroup, {
        name: "Multi-Phase Brushless DC Motor Stator",
        description: "Ironless core with high-density precision-wound copper coils for generating perfectly uniform rotational magnetic fields. Includes redundant Hall-effect sensors.",
        material: "Laminated Steel, High-Purity Copper, Kapton",
        function: "Drives the rotor to accelerate or decelerate the flywheel with zero cogging torque.",
        assemblyOrder: 4,
        connections: ["LowerCasing", "MotorController"],
        failureEffect: "Loss of actuation capability, short circuit leading to power bus failure.",
        explodedPosition: new THREE.Vector3(0, -5, 0)
    });

    // 5. ROTOR ASSEMBLY (Magnetic)
    const rotorGroup = new THREE.Group();
    const rotorGeom = new THREE.CylinderGeometry(3.2, 3.2, 3, 128);
    const rotor = new THREE.Mesh(rotorGeom, chrome);
    rotorGroup.add(rotor);
    
    // Add permanent magnets to rotor in a Halbach array pattern
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const magGeom = new THREE.BoxGeometry(0.8, 2.8, 0.4);
        const magMesh = new THREE.Mesh(magGeom, i%2===0 ? darkSteel : titanium);
        magMesh.position.set(Math.cos(angle) * 3.1, 0, Math.sin(angle) * 3.1);
        magMesh.rotation.y = -angle;
        rotorGroup.add(magMesh);
        
        // Retaining sleeve bands (carbon fiber wrap)
        if(i===0) {
            const sleeve1 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.05, 16, 128), carbonFiber);
            sleeve1.rotation.x = Math.PI/2;
            sleeve1.position.set(0, 1.2, 0);
            const sleeve2 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.05, 16, 128), carbonFiber);
            sleeve2.rotation.x = Math.PI/2;
            sleeve2.position.set(0, -1.2, 0);
            rotorGroup.add(sleeve1);
            rotorGroup.add(sleeve2);
        }
    }
    rotorGroup.position.set(0, -4, 0);
    addPart('RotorAssembly', rotorGroup, {
        name: "Halbach Array Permanent Magnet Rotor",
        description: "Rotor featuring rare-earth neodymium magnets in a Halbach array for concentrated magnetic flux, wrapped in a carbon-fiber retaining sleeve.",
        material: "NdFeB Magnets, Carbon Fiber, Chrome Steel",
        function: "Reacts to stator fields to spin the central shaft powerfully and efficiently.",
        assemblyOrder: 5,
        connections: ["CentralShaft"],
        failureEffect: "Slippage, loss of torque, magnet delamination at hyper-speeds.",
        explodedPosition: new THREE.Vector3(0, 5, 0)
    });

    // 6. CENTRAL SHAFT
    const shaftGeom = new THREE.CylinderGeometry(0.8, 0.8, 22, 64);
    const shaft = new THREE.Mesh(shaftGeom, steel);
    
    // Machined grooves and step-downs on shaft
    const groove1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1, 64), chrome);
    groove1.position.set(0, -7.5, 0);
    shaft.add(groove1);
    
    const groove2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 64), titanium);
    groove2.position.set(0, 3, 0);
    shaft.add(groove2);
    
    const groove3 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1, 64), chrome);
    groove3.position.set(0, 8.5, 0);
    shaft.add(groove3);

    shaft.position.set(0, 0, 0);
    addPart('CentralShaft', shaft, {
        name: "Precision Machined Titanium Shaft",
        description: "High-strength, dynamically balanced shaft connecting the rotor, flywheel, and bearings. Features micrometer-machined steps for press-fitting components.",
        material: "Aerospace Titanium",
        function: "Transmits immense torque and maintains perfectly rigid dynamic alignment.",
        assemblyOrder: 6,
        connections: ["RotorAssembly", "FlywheelMass", "LowerBearing", "UpperBearing"],
        failureEffect: "Harmonic resonance, extreme vibration, catastrophic structural failure.",
        explodedPosition: new THREE.Vector3(0, 15, 0)
    });

    // 7. LOWER BEARING (Highly detailed ball bearing)
    const lowerBearingGroup = new THREE.Group();
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.3, 32, 64), steel);
    outerRing.rotation.x = Math.PI / 2;
    lowerBearingGroup.add(outerRing);
    
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.3, 32, 64), chrome);
    innerRing.rotation.x = Math.PI / 2;
    lowerBearingGroup.add(innerRing);
    
    // Bearing Cage and Balls
    const cage = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.1, 16, 64), plastic);
    cage.rotation.x = Math.PI / 2;
    lowerBearingGroup.add(cage);
    
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), darkSteel);
        ball.position.set(Math.cos(angle)*1.4, 0, Math.sin(angle)*1.4);
        cage.add(ball);
    }
    
    lowerBearingGroup.position.set(0, -7.5, 0);
    addPart('LowerBearing', lowerBearingGroup, {
        name: "Lower Hybrid Ceramic Ball Bearing",
        description: "High-speed hybrid bearing with silicon nitride ceramic balls and MoS2 dry solid lubricant for hard vacuum operation.",
        material: "Silicon Nitride, Stainless Steel races, PTFE Cage",
        function: "Supports massive axial and radial loads at high RPM with minimal friction and zero cold-welding.",
        assemblyOrder: 7,
        connections: ["CentralShaft", "LowerCasing"],
        failureEffect: "High friction, thermal runaway, bearing seizure leading to immediate mission loss.",
        explodedPosition: new THREE.Vector3(0, -10, 0)
    });

    // 8. MASSIVE FLYWHEEL (Extremely complex geometry)
    const flywheelGroup = new THREE.Group();
    
    // Inner Hub
    const hubGeom = new THREE.CylinderGeometry(2, 2, 2.5, 64);
    const hub = new THREE.Mesh(hubGeom, titanium);
    flywheelGroup.add(hub);
    
    // Complex Webbing/Spokes (Topology optimized look)
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const spokeShape = new THREE.Shape();
        spokeShape.moveTo(2, -1);
        spokeShape.lineTo(9, -0.5);
        spokeShape.lineTo(9, 0.5);
        spokeShape.lineTo(2, 1);
        spokeShape.lineTo(2, -1);
        
        const extSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const spokeGeom = new THREE.ExtrudeGeometry(spokeShape, extSettings);
        spokeGeom.center();
        const spoke = new THREE.Mesh(spokeGeom, aluminum);
        spoke.position.set(Math.cos(angle)*5.5, 0, Math.sin(angle)*5.5);
        spoke.rotation.y = -angle;
        // Tilt spoke slightly for aerodynamic/structural reasons
        spoke.rotation.z = 0.1;
        flywheelGroup.add(spoke);
    }
    
    // Massive Rim
    const rimShape = new THREE.Shape();
    rimShape.moveTo(9, -1.5);
    rimShape.lineTo(12, -1.5);
    rimShape.lineTo(12.5, -1.0);
    rimShape.lineTo(12.5, 1.0);
    rimShape.lineTo(12, 1.5);
    rimShape.lineTo(9, 1.5);
    rimShape.lineTo(9, -1.5);
    const rimGeom = new THREE.LatheGeometry(rimShape.getPoints(), 128);
    const rim = new THREE.Mesh(rimGeom, darkSteel);
    flywheelGroup.add(rim);
    
    // Balancing weights and bolts on the rim
    for(let i=0; i<48; i++) {
        const angle = (i/48) * Math.PI * 2;
        if(i % 3 === 0) {
            // Tuning weight
            const weight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 0.6), copper);
            weight.position.set(Math.cos(angle)*12.6, 0, Math.sin(angle)*12.6);
            weight.rotation.y = -angle;
            flywheelGroup.add(weight);
        }
        // Machined rivets
        const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), chrome);
        rivet.position.set(Math.cos(angle)*10.5, 0, Math.sin(angle)*10.5);
        flywheelGroup.add(rivet);
    }
    
    flywheelGroup.position.set(0, 3, 0);
    addPart('FlywheelMass', flywheelGroup, {
        name: "Hyper-Massive Momentum Inertia Wheel",
        description: "A precision-balanced, topology-optimized inertia wheel. The bulk of the mass is concentrated at the outer rim to maximize the moment of inertia.",
        material: "Tungsten Alloy Rim & Forged Aluminum Webbing",
        function: "Stores massive amounts of angular momentum; accelerating/decelerating it imparts torque on the spacecraft via the conservation of angular momentum.",
        assemblyOrder: 8,
        connections: ["CentralShaft"],
        failureEffect: "Loss of attitude control. Micro-fractures could lead to explosive centrifugal disintegration.",
        explodedPosition: new THREE.Vector3(0, 25, 0)
    });

    // 9. UPPER BEARING (Active Magnetic Bearing)
    const upperBearingGroup = new THREE.Group();
    // Electromagnet stators
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const emag = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16), copper);
        emag.position.set(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5);
        emag.rotation.x = Math.PI/2;
        emag.rotation.z = angle;
        
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.4, 16), steel);
        core.position.set(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5);
        core.rotation.x = Math.PI/2;
        core.rotation.z = angle;
        
        upperBearingGroup.add(emag);
        upperBearingGroup.add(core);
    }
    
    const floatRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.2, 16, 64), chrome);
    floatRing.rotation.x = Math.PI/2;
    upperBearingGroup.add(floatRing);

    upperBearingGroup.position.set(0, 8.5, 0);
    addPart('UpperBearing', upperBearingGroup, {
        name: "Active Magnetic Bearing (AMB)",
        description: "Active magnetic bearing providing absolutely frictionless radial support. Controlled by a high-speed DSP loop reading shaft displacement.",
        material: "Electromagnetic Coils & Ferrite Cores",
        function: "Maintains shaft centering dynamically without physical contact, enabling ultra-high RPMs.",
        assemblyOrder: 9,
        connections: ["CentralShaft", "UpperCasing", "ControlBoard"],
        failureEffect: "Shaft deflects into backup touchdown bearings, causing severe braking and vibration.",
        explodedPosition: new THREE.Vector3(0, 35, 0)
    });

    // 10. HIGH-RES OPTICAL ENCODER
    const encoderGroup = new THREE.Group();
    const encoderDiskGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 128);
    const encoderDisk = new THREE.Mesh(encoderDiskGeom, glass);
    
    // Slits pattern - visual approximation
    const ringMat = new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide, transparent:true, opacity:0.8, alphaTest: 0.5});
    const slitRing = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.4, 128), ringMat);
    slitRing.rotation.x = Math.PI/2;
    slitRing.position.set(0, 0.03, 0);
    encoderGroup.add(encoderDisk);
    encoderGroup.add(slitRing);
    
    // Dual Sensor heads
    for(let i=0; i<2; i++) {
        const sensor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.0), plastic);
        sensor.position.set(i===0 ? 2.2 : -2.2, 0.5, 0);
        
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), tinted);
        lens.position.set(0, -0.6, 0);
        sensor.add(lens);
        
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), neonRed);
        laser.position.set(0, -1.0, 0);
        laser.name = "LaserBeam_" + i;
        sensor.add(laser);

        encoderGroup.add(sensor);
    }
    
    encoderGroup.position.set(0, 10, 0);
    addPart('OpticalEncoder', encoderGroup, {
        name: "Dual-Redundant Optical Encoder",
        description: "Laser optical sensors reading nanometer-etched slits on a quartz glass disk to measure absolute angular position and velocity.",
        material: "Quartz Glass, Polycarbonate, Silicon Photodiodes",
        function: "Provides extremely precise wheel speed and commutation feedback to the DSP.",
        assemblyOrder: 10,
        connections: ["CentralShaft", "ControlBoard"],
        failureEffect: "Loss of speed telemetry, causing motor desynchronization and safe-mode trigger.",
        explodedPosition: new THREE.Vector3(0, 45, 0)
    });

    // 11. UPPER HOUSING CASING & CONTAINMENT DOME
    const upperCasingPoints = [];
    for (let i = 0; i <= 20; i++) {
        const height = i * 0.4;
        const radius = 13.5 - Math.pow(height*0.2, 2);
        if (radius > 0) {
            upperCasingPoints.push(new THREE.Vector2(radius, height));
        }
    }
    const upperCasingGeom = new THREE.LatheGeometry(upperCasingPoints, 128);
    const upperCasing = new THREE.Mesh(upperCasingGeom, aluminum);
    
    // Add carbon fiber wrap banding
    const wrap = new THREE.Mesh(new THREE.CylinderGeometry(13.6, 13.6, 4, 128), carbonFiber);
    wrap.position.set(0, 2, 0);
    upperCasing.add(wrap);
    
    upperCasing.position.set(0, -2, 0);
    // Note: in a real viewer we might make it transparent so internals are visible, 
    // or just let the exploded view handle it. We'll set transparent to true for educational purposes.
    upperCasing.material.transparent = true;
    upperCasing.material.opacity = 0.2; // Let users see the inside!

    addPart('UpperCasing', upperCasing, {
        name: "Kevlar-Wrapped Containment Dome",
        description: "Robust upper dome wrapped in layers of Kevlar and Carbon Fiber, designed to contain shrapnel in the event of a catastrophic burst.",
        material: "Aluminum Core with Kevlar/Carbon Overwrap",
        function: "Seals the environment, maintains vacuum, and provides absolute burst containment to protect the spacecraft.",
        assemblyOrder: 11,
        connections: ["LowerCasing", "ThermalFins"],
        failureEffect: "Explosive shrapnel damage to spacecraft if flywheel fragments penetrate.",
        explodedPosition: new THREE.Vector3(0, 60, 0)
    });

    // 12. THERMAL RADIATOR FINS
    const finsGroup = new THREE.Group();
    for(let i=0; i<48; i++) {
        const angle = (i/48) * Math.PI * 2;
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(4, -2);
        finShape.lineTo(4, 14);
        finShape.lineTo(0, 10);
        
        const ext = { depth: 0.2, bevelEnabled: false };
        const finGeom = new THREE.ExtrudeGeometry(finShape, ext);
        finGeom.center();
        const fin = new THREE.Mesh(finGeom, titanium);
        fin.position.set(Math.cos(angle)*15, 3, Math.sin(angle)*15);
        fin.rotation.y = -angle + Math.PI/2;
        finsGroup.add(fin);
    }
    addPart('ThermalFins', finsGroup, {
        name: "Radial Thermal Radiator Fins",
        description: "High-surface-area extruded fins integrated into the casing exterior.",
        material: "Anodized Titanium",
        function: "Radiates extreme waste heat from the motor coils and bearings directly into deep space.",
        assemblyOrder: 12,
        connections: ["UpperCasing", "LowerCasing"],
        failureEffect: "Overheating of internal electronics and melting of copper winding insulation.",
        explodedPosition: new THREE.Vector3(0, 75, 0)
    });

    // 13. MOTOR DRIVE ELECTRONICS BOARD (Incredibly detailed PCB)
    const pcbGroup = new THREE.Group();
    const pcbGeom = new THREE.CylinderGeometry(11, 11, 0.3, 64);
    const pcb = new THREE.Mesh(pcbGeom, pcbGreen);
    pcbGroup.add(pcb);
    
    // Microprocessors and chips
    const cpu = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 3), plastic);
    cpu.position.set(0, 0.3, 0);
    const cpuPins = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 3.2), goldPlated);
    cpuPins.position.set(0, 0.15, 0);
    pcbGroup.add(cpu);
    pcbGroup.add(cpuPins);

    // High power MOSFETs for motor drive
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const mosfet = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 2), darkSteel);
        mosfet.position.set(Math.cos(angle)*6, 0.4, Math.sin(angle)*6);
        mosfet.rotation.y = -angle;
        
        const heatsink = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 2.2), aluminum);
        heatsink.position.set(Math.cos(angle)*6, 1.0, Math.sin(angle)*6);
        heatsink.rotation.y = -angle;
        
        pcbGroup.add(mosfet);
        pcbGroup.add(heatsink);
    }
    
    // Large filter capacitors
    for(let i=0; i<8; i++) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32), aluminum);
        cap.position.set(-6 + (i%4)*4, 1.9, i<4 ? -7 : 7);
        pcbGroup.add(cap);
        
        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.81, 0.81, 0.2, 32), plastic);
        capTop.position.set(-6 + (i%4)*4, 3.7, i<4 ? -7 : 7);
        pcbGroup.add(capTop);
    }

    // Tons of tiny SMD components
    for(let i=0; i<100; i++) {
        const x = (Math.random() - 0.5) * 18;
        const z = (Math.random() - 0.5) * 18;
        if (x*x + z*z < 100 && x*x + z*z > 16) {
            const comp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), i%3===0 ? plastic : chrome);
            comp.position.set(x, 0.25, z);
            comp.rotation.y = Math.random() > 0.5 ? 0 : Math.PI/2;
            pcbGroup.add(comp);
            
            // Add a glowing LED to a few
            if (i%15===0) {
                const ledCol = i%30===0 ? neonRed : neonBlue;
                const led = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), ledCol);
                led.position.set(x, 0.4, z);
                led.name = "StatusLED_" + i;
                pcbGroup.add(led);
            }
        }
    }

    pcbGroup.position.set(0, 12, 0);
    addPart('ControlBoard', pcbGroup, {
        name: "DSP Motor Drive & ACS Interface PCB",
        description: "Radiation-hardened Digital Signal Processor (DSP) and high-power MOSFET inverter bridge. Commutates the brushless motor based on optical encoder feedback.",
        material: "Multilayer FR4, Silicon, Gold, Aluminum Heatsinks",
        function: "Processes attitude commands from the flight computer and precisely controls motor phase currents to generate exact torque.",
        assemblyOrder: 13,
        connections: ["UpperCasing", "DataConnectors", "OpticalEncoder", "StatorAssembly"],
        failureEffect: "Total loss of wheel control, hardover spin, or electrical short to main bus.",
        explodedPosition: new THREE.Vector3(0, 85, 0)
    });

    // 14. POWER & DATA CONNECTORS
    const connectorGroup = new THREE.Group();
    const conn1 = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 4), goldPlated);
    conn1.position.set(11, 12, 0);
    const pins1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.5, 3.5), chrome);
    pins1.position.set(11.5, 12, 0);
    
    const conn2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 3), steel);
    conn2.position.set(-11, 12, 0);
    
    connectorGroup.add(conn1);
    connectorGroup.add(pins1);
    connectorGroup.add(conn2);
    addPart('Connectors', connectorGroup, {
        name: "MIL-DTL-38999 SpaceWire Connectors",
        description: "Redundant SpaceWire data interfaces and regulated 28V DC power inputs.",
        material: "Gold-plated pins, Stainless Steel EMI shells",
        function: "Provides robust, radiation-shielded interfaces with the spacecraft main electrical bus.",
        assemblyOrder: 14,
        connections: ["ControlBoard"],
        failureEffect: "Loss of communication telemetry or loss of operating power.",
        explodedPosition: new THREE.Vector3(0, 95, 0)
    });

    // 15. PRESSURE RELIEF VALVE & PURGE PORT
    const portGroup = new THREE.Group();
    const valveBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32), steel);
    const valveTop = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32), neonRed);
    valveTop.position.set(0, 1.5, 0);
    
    // Tiny bolts on valve
    for(let i=0; i<6; i++) {
        const angle = (i/6)*Math.PI*2;
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15, 3, 8), chrome);
        b.position.set(Math.cos(angle)*0.9, 0, Math.sin(angle)*0.9);
        portGroup.add(b);
    }
    
    portGroup.add(valveBase);
    portGroup.add(valveTop);
    portGroup.position.set(0, -6, 13);
    portGroup.rotation.x = Math.PI / 2;
    addPart('PurgePort', portGroup, {
        name: "Helium Purge & Burst Relief Valve",
        description: "High-reliability valve for backfilling the enclosure with low-pressure helium prior to launch, and venting overpressure.",
        material: "Stainless Steel, Teflon Seals",
        function: "Prevents internal moisture condensation on Earth, and safely vents internal pressure during ascent to vacuum.",
        assemblyOrder: 15,
        connections: ["LowerCasing"],
        failureEffect: "Internal corrosion due to trapped moisture, or seal blowout causing catastrophic decompression.",
        explodedPosition: new THREE.Vector3(0, -15, 30)
    });

    // 16. KAPTON WIRING HARNESS
    const wiringGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(10, 11, i),
            new THREE.Vector3(11, 5, i*2),
            new THREE.Vector3(6, -2, i*3),
            new THREE.Vector3(4, -4, i)
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.2, 8, false);
        const harness = new THREE.Mesh(tubeGeom, goldPlated); // Kapton tape look
        wiringGroup.add(harness);
    }
    addPart('WiringHarness', wiringGroup, {
        name: "Kapton Insulated Phase Harness",
        description: "Heavy-gauge phase wiring routing power from the inverter to the stator coils, wrapped in high-temperature, radiation-resistant Kapton tape.",
        material: "Copper, Kapton Polyimide, PTFE",
        function: "Routes extremely high pulsed currents from the control board to the motor phases.",
        assemblyOrder: 16,
        connections: ["ControlBoard", "StatorAssembly"],
        failureEffect: "Short circuits, electrical arcing, insulation melting, complete loss of motor phase control.",
        explodedPosition: new THREE.Vector3(25, 0, 25)
    });


    // Description and Quiz
    const description = "Spacecraft Engineering Reaction Wheel (RW): An ultra-high-precision, massively complex momentum exchange device used extensively in satellite attitude control systems (ACS). By accelerating or decelerating the massive central flywheel (concentrated mass rim), the RW exploits the conservation of angular momentum to impart precise, smooth torque on the spacecraft, allowing it to point cameras, antennas, or telescopes without using consumable thruster propellant. Features include an active magnetic bearing (AMB), a zero-cogging ironless brushless DC motor, a Kevlar-wrapped containment dome, and dual-redundant optical encoders.";

    const quizQuestions = [
        {
            question: "What physical principle allows the reaction wheel to orient a spacecraft in the frictionless vacuum of space?",
            options: [
                "Conservation of Angular Momentum",
                "Aerodynamic Drag",
                "Magnetic Repulsion",
                "Gravitational Lensing"
            ],
            correctAnswer: 0,
            explanation: "Because there is no external friction, total angular momentum is conserved. As the internal flywheel accelerates clockwise, the spacecraft hull must rotate counter-clockwise to balance it out."
        },
        {
            question: "Why is the central shaft supported by Active Magnetic Bearings (AMB) or hybrid ceramic ball bearings rather than standard steel bearings?",
            options: [
                "To eliminate friction, wear, and cold-welding at extremely high RPMs in a hard vacuum.",
                "To generate backup electricity for the spacecraft batteries.",
                "Because standard steel is radioactive in space.",
                "To increase the total structural mass of the wheel."
            ],
            correctAnswer: 0,
            explanation: "At thousands of RPMs in hard vacuum, standard liquid lubricants instantly boil off, and raw metals can cold-weld together. Magnetic levitation or solid-lubricated ceramics are essential to prevent rapid thermal failure and seizure."
        },
        {
            question: "What is the critical safety function of the Kevlar-wrapped Upper Containment Dome?",
            options: [
                "To contain highly destructive shrapnel if the high-speed flywheel bursts centrifugally.",
                "To reflect solar radiation away from the wheel.",
                "To store extra electrical charge in its composite layers.",
                "To act as a secondary radio communications antenna."
            ],
            correctAnswer: 0,
            explanation: "Flywheels store immense kinetic energy (often hundreds of thousands of Joules). If a micro-fracture causes the wheel to shatter at max RPM, the containment dome acts like bulletproof armor, protecting the rest of the spacecraft from hypervelocity debris."
        },
        {
            question: "Why does the stator use an 'ironless' or zero-cogging coil design in high-end reaction wheels?",
            options: [
                "To prevent magnetic 'bumping' (cogging torque) that causes micro-vibrations.",
                "Because iron is too heavy for spaceflight launch limits.",
                "To save money on manufacturing and material costs.",
                "To make the motor spin significantly faster."
            ],
            correctAnswer: 0,
            explanation: "Cogging torque creates tiny, jerky vibrations (jitter) as magnets pass iron cores. This jitter can blur sensitive optical instruments like telescopes or laser comms. Zero-cogging ironless motors provide perfectly smooth, continuous torque."
        },
        {
            question: "What happens when a reaction wheel reaches its maximum safe RPM limit (saturation)?",
            options: [
                "It must be 'desaturated' using external forces like thrusters or magnetic torquers.",
                "It reverses direction instantly to unwind.",
                "It ejects the flywheel into space to save the ship.",
                "It automatically generates a micro black hole."
            ],
            correctAnswer: 0,
            explanation: "When a wheel hits its speed limit, it cannot accelerate further and thus cannot absorb any more momentum. The spacecraft must fire thrusters to apply an external torque while the wheel slows down, a critical process called 'momentum dumping' or 'desaturation'."
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Base RPM scaled by speed
        const flywheelRPM = speed * 15; 
        
        if (activeMeshes['RotorAssembly']) activeMeshes['RotorAssembly'].rotation.y += flywheelRPM;
        if (activeMeshes['CentralShaft']) activeMeshes['CentralShaft'].rotation.y += flywheelRPM;
        if (activeMeshes['FlywheelMass']) activeMeshes['FlywheelMass'].rotation.y += flywheelRPM;
        
        // Spin bearing components
        if (activeMeshes['LowerBearing']) {
            const cage = activeMeshes['LowerBearing'].children[2];
            if (cage) {
                // Cage spins at half speed of inner race
                cage.rotation.z -= flywheelRPM * 0.5;
                cage.children.forEach(ball => {
                   ball.rotation.x += flywheelRPM * 2;
                });
            }
            const innerRing = activeMeshes['LowerBearing'].children[1];
            if (innerRing) innerRing.rotation.z -= flywheelRPM;
        }
        
        // Encoder disk rotation
        if (activeMeshes['OpticalEncoder']) {
            const disk = activeMeshes['OpticalEncoder'].children[0];
            const slitRing = activeMeshes['OpticalEncoder'].children[1];
            if (disk) disk.rotation.y += flywheelRPM;
            if (slitRing) slitRing.rotation.z -= flywheelRPM;
            
            // Pulse the laser beam alpha slightly
            const sensor1 = activeMeshes['OpticalEncoder'].children[2];
            const sensor2 = activeMeshes['OpticalEncoder'].children[3];
            if (sensor1 && sensor1.children[1]) {
                sensor1.children[1].material.emissiveIntensity = 1.5 + Math.sin(time*50)*0.5;
            }
            if (sensor2 && sensor2.children[1]) {
                sensor2.children[1].material.emissiveIntensity = 1.5 + Math.cos(time*50)*0.5;
            }
        }

        // Pulse the LEDs on the control board
        if (activeMeshes['ControlBoard']) {
            activeMeshes['ControlBoard'].children.forEach(child => {
                if (child.name && child.name.startsWith("StatusLED_")) {
                    // Fast pulsing depending on speed
                    child.material.emissiveIntensity = 1 + Math.sin(time * 30 * (speed + 0.1) + child.position.x) * 1.5;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createReactionWheel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
