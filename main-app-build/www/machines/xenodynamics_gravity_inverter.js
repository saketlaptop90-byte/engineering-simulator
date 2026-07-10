import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Emissive Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00aaff, emissiveIntensity: 3.0, roughness: 0.2, metalness: 0.8 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xaa00ff, emissiveIntensity: 4.0, transparent: true, opacity: 0.8, wireframe: true });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffaa00, emissiveIntensity: 2.5, roughness: 0.1 });
    const plasmaMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0, transparent: true, opacity: 0.9 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x002200, emissive: 0x00ff00, emissiveIntensity: 1.2 });
    const errorMaterial = new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0xff0000, emissiveIntensity: 2.0 });

    // --- 1. BASE PLATFORM ---
    const baseGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    const radius = 18;
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const r = i % 2 === 0 ? radius : radius * 0.9;
        if (i === 0) baseShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else baseShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    baseShape.closePath();
    const baseSettings = { depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 6, curveSegments: 16 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = -Math.PI / 2;
    baseGroup.add(baseMesh);
    
    // Add heavy bolting to base
    for(let i=0; i<48; i++) {
        const a = (i/48) * Math.PI * 2;
        const boltGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(Math.cos(a) * 17, 3.2, Math.sin(a) * 17);
        baseGroup.add(bolt);
    }
    group.add(baseGroup);
    parts.push({
        name: "Hexadecagon Shielded Base",
        description: "Massive primary foundation built to absorb extreme gravitational shear.",
        material: "Dark Steel & Chrome",
        function: "Provides structural integrity and energy grounding.",
        assemblyOrder: 1,
        connections: ["Stabilizer Legs", "Main Containment Chamber"],
        failureEffect: "Catastrophic structural collapse under gravity anomalies.",
        cascadeFailures: ["Core Breach", "Shielding Rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });
    meshes.base = baseGroup;

    // --- 2. PNEUMATIC STABILIZER LEGS ---
    const legsGroup = new THREE.Group();
    for (let i=0; i<8; i++) {
        const a = (i/8) * Math.PI * 2;
        const legMaster = new THREE.Group();
        
        // Main Strut
        const strutGeo = new THREE.CylinderGeometry(1.2, 1.8, 10, 16);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.rotation.x = Math.PI / 4;
        strut.position.set(0, 4, 6);
        
        // Complex Hydraulics
        const outerPistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
        const outerPiston = new THREE.Mesh(outerPistonGeo, darkSteel);
        outerPiston.position.set(0, 2, 7.5);
        outerPiston.rotation.x = Math.PI / 3.5;
        
        const innerPistonGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
        const innerPiston = new THREE.Mesh(innerPistonGeo, chrome);
        innerPiston.position.set(0, 0, 9);
        innerPiston.rotation.x = Math.PI / 3.5;
        
        // Heavy Footpad
        const footGeo = new THREE.BoxGeometry(5, 1.5, 7);
        const foot = new THREE.Mesh(footGeo, rubber);
        foot.position.set(0, -1.5, 11);
        
        // Articulation joint
        const jointGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const joint = new THREE.Mesh(jointGeo, steel);
        joint.position.set(0, 7.5, 2.5);
        
        legMaster.add(strut);
        legMaster.add(outerPiston);
        legMaster.add(innerPiston);
        legMaster.add(foot);
        legMaster.add(joint);
        
        legMaster.position.set(Math.cos(a)*15, 0, Math.sin(a)*15);
        legMaster.rotation.y = -a + Math.PI/2;
        legsGroup.add(legMaster);
    }
    group.add(legsGroup);
    parts.push({
        name: "Pneumatic Stabilizer Array",
        description: "Adaptive leveling system using high-pressure hydraulic struts and shock-absorbent footpads.",
        material: "Steel, Dark Steel, Chrome, Rubber",
        function: "Counteracts micro-seismic vibrations caused by exotic matter spin.",
        assemblyOrder: 2,
        connections: ["Base Platform"],
        failureEffect: "Resonance cascade tearing the machine apart.",
        cascadeFailures: ["Exotic Matter Core", "Gyroscopic Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 25 }
    });
    meshes.legs = legsGroup;

    // --- 3. CONTAINMENT CHAMBER ---
    const chamberGroup = new THREE.Group();
    const lathePoints = [];
    for ( let i = 0; i <= 30; i ++ ) {
        lathePoints.push( new THREE.Vector2( 8 + Math.sin( i * 0.15 ) * 2.5, i * 0.6 ) );
    }
    const chamberGeo = new THREE.LatheGeometry( lathePoints, 64 );
    const chamberMesh = new THREE.Mesh( chamberGeo, aluminum );
    chamberMesh.position.y = 3;
    chamberGroup.add(chamberMesh);
    
    // Extruded cooling fins
    for(let i=0; i<36; i++) {
        const finGeo = new THREE.BoxGeometry(2, 16, 0.3);
        const fin = new THREE.Mesh(finGeo, copper);
        const a = (i/36) * Math.PI * 2;
        fin.position.set(Math.cos(a) * 9.5, 12, Math.sin(a) * 9.5);
        fin.rotation.y = -a;
        chamberGroup.add(fin);
    }
    group.add(chamberGroup);
    parts.push({
        name: "Lathed Containment Chamber",
        description: "Hyper-machined aluminum housing featuring complex radial copper heatsinks.",
        material: "Aluminum & Copper",
        function: "Houses the exotic matter core and regulates massive thermal output.",
        assemblyOrder: 3,
        connections: ["Base Platform", "Magnetic Containment Coils", "Coolant Pipes"],
        failureEffect: "Thermal runaway melting internal components.",
        cascadeFailures: ["Coolant Pipes", "Gyroscopic Rings"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });
    meshes.chamber = chamberGroup;

    // --- 4. MAGNETIC CONTAINMENT COILS ---
    const coilsGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const coilPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 7, 3, 0 ),
            new THREE.Vector3( 0, 12, 7 ),
            new THREE.Vector3( -7, 21, 0 ),
            new THREE.Vector3( 0, 12, -7 ),
            new THREE.Vector3( 7, 3, 0 )
        ], true);
        const coilGeo = new THREE.TubeGeometry(coilPath, 128, 0.8, 16, true);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.y = (i/6) * Math.PI;
        coilsGroup.add(coil);
    }
    group.add(coilsGroup);
    parts.push({
        name: "Superconducting Magnetic Coils",
        description: "Dense interlocking copper tubing carrying liquid helium to generate immense magnetic fields.",
        material: "Copper",
        function: "Confines the exotic matter in a frictionless vacuum.",
        assemblyOrder: 4,
        connections: ["Containment Chamber", "Power Conduits"],
        failureEffect: "Core drops and annihilates with normal matter.",
        cascadeFailures: ["Exotic Matter Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 20, z: -20 }
    });
    meshes.coils = coilsGroup;

    // --- 5. GYROSCOPIC RING - OUTER ---
    const gyroOuterGroup = new THREE.Group();
    const gyroOuterGeo = new THREE.TorusGeometry(16, 1.5, 32, 128);
    const gyroOuter = new THREE.Mesh(gyroOuterGeo, darkSteel);
    gyroOuterGroup.add(gyroOuter);
    
    // Add intricate emitter nodes
    for(let i=0; i<12; i++) {
        const nodeGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(3, 4, 3);
        const base = new THREE.Mesh(baseGeo, steel);
        
        const nodeGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 16);
        const node = new THREE.Mesh(nodeGeo, chrome);
        node.rotation.x = Math.PI/2;
        
        const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const glow = new THREE.Mesh(glowGeo, neonBlue);
        glow.position.z = 2.5;
        
        nodeGroup.add(base);
        nodeGroup.add(node);
        nodeGroup.add(glow);
        
        const a = (i/12) * Math.PI * 2;
        nodeGroup.position.set(Math.cos(a)*16, 0, Math.sin(a)*16);
        nodeGroup.lookAt(0, 0, 0);
        
        gyroOuterGroup.add(nodeGroup);
    }
    gyroOuterGroup.position.y = 15;
    group.add(gyroOuterGroup);
    parts.push({
        name: "Primary Gyroscopic Ring",
        description: "Massive outer stabilizing ring embedded with gravimetric emitters.",
        material: "Dark Steel, Steel, Chrome, Neon Emitters",
        function: "Maintains absolute macro-stability of the local spacetime metric.",
        assemblyOrder: 5,
        connections: ["Magnetic Containment Coils", "Secondary Gyro Ring"],
        failureEffect: "Wild fluctuations in local gravity.",
        cascadeFailures: ["Secondary Gyro Ring", "Tertiary Gyro Ring"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 45, z: 0 }
    });
    meshes.gyroOuter = gyroOuterGroup;

    // --- 6. GYROSCOPIC RING - MIDDLE ---
    const gyroMidGroup = new THREE.Group();
    const gyroMidGeo = new THREE.TorusGeometry(12, 1.2, 32, 100);
    const gyroMid = new THREE.Mesh(gyroMidGeo, steel);
    gyroMidGroup.add(gyroMid);
    
    for(let i=0; i<24; i++) {
        const detailGeo = new THREE.BoxGeometry(1.5, 3, 3.5);
        const detail = new THREE.Mesh(detailGeo, plastic);
        const a = (i/24) * Math.PI * 2;
        detail.position.set(Math.cos(a)*12, 0, Math.sin(a)*12);
        detail.rotation.y = -a;
        gyroMidGroup.add(detail);
    }
    gyroMidGroup.position.y = 15;
    group.add(gyroMidGroup);
    parts.push({
        name: "Secondary Gyroscopic Ring",
        description: "Counter-rotating structural torus fitted with heavy dampening blocks.",
        material: "Steel, Plastic",
        function: "Counter-acts the extreme angular momentum of the primary ring.",
        assemblyOrder: 6,
        connections: ["Primary Gyroscopic Ring", "Inner Gyro Ring"],
        failureEffect: "Uncontrollable angular spin transferred to the base.",
        cascadeFailures: ["Base Platform", "Stabilizer Legs"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: -30, y: 30, z: 0 }
    });
    meshes.gyroMid = gyroMidGroup;

    // --- 7. GYROSCOPIC RING - INNER ---
    const gyroInnerGroup = new THREE.Group();
    const gyroInnerGeo = new THREE.TorusGeometry(8, 0.8, 32, 80);
    const gyroInner = new THREE.Mesh(gyroInnerGeo, chrome);
    gyroInnerGroup.add(gyroInner);
    
    for(let i=0; i<16; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
        const spoke = new THREE.Mesh(spokeGeo, copper);
        const a = (i/16) * Math.PI * 2;
        spoke.position.set(Math.cos(a)*6, 0, Math.sin(a)*6);
        spoke.rotation.x = Math.PI/2;
        spoke.rotation.z = a;
        gyroInnerGroup.add(spoke);
    }
    gyroInnerGroup.position.y = 15;
    group.add(gyroInnerGroup);
    parts.push({
        name: "Tertiary Gyroscopic Ring",
        description: "High-velocity inner alignment ring with copper focusing spokes.",
        material: "Chrome, Copper",
        function: "Fine-tunes the focal point of the inversion field.",
        assemblyOrder: 7,
        connections: ["Secondary Gyro Ring", "Exotic Matter Core"],
        failureEffect: "Inversion field becomes unfocused, creating lethal micro-singularities.",
        cascadeFailures: ["Exotic Matter Core"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 30, y: 20, z: 30 }
    });
    meshes.gyroInner = gyroInnerGroup;

    // --- 8. EXOTIC MATTER CORE ---
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(3, 4);
    const coreMesh = new THREE.Mesh(coreGeo, neonPurple);
    coreGroup.add(coreMesh);
    
    // Core auroras/spikes
    for(let i=0; i<20; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.3, 4.5, 5);
        const spike = new THREE.Mesh(spikeGeo, plasmaMaterial);
        spike.rotation.x = Math.random() * Math.PI;
        spike.rotation.y = Math.random() * Math.PI;
        spike.rotation.z = Math.random() * Math.PI;
        coreGroup.add(spike);
    }
    coreGroup.position.y = 15;
    group.add(coreGroup);
    parts.push({
        name: "Negative-Mass Exotic Matter Core",
        description: "A suspended droplet of stable negative mass, glowing with intense Hawking radiation.",
        material: "Exotic Plasma, Neon Purple",
        function: "Generates the localized repelling gravitational metric.",
        assemblyOrder: 8,
        connections: ["Tertiary Gyroscopic Ring", "Magnetic Containment Coils"],
        failureEffect: "Spontaneous expansion of an artificial black hole.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });
    meshes.core = coreGroup;

    // --- 9. COOLANT PIPES ---
    const pipesGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const a = (i/12) * Math.PI * 2;
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(a)*9, 3, Math.sin(a)*9),
            new THREE.Vector3(Math.cos(a)*13, 8, Math.sin(a)*13),
            new THREE.Vector3(Math.cos(a)*5, 18, Math.sin(a)*5)
        );
        const pipeGeo = new THREE.TubeGeometry(curve, 64, 0.6, 12, false);
        const pipe = new THREE.Mesh(pipeGeo, rubber);
        pipesGroup.add(pipe);
        
        // Add flow meters
        const meterGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.5, 16);
        const meter = new THREE.Mesh(meterGeo, steel);
        meter.position.copy(curve.getPoint(0.5));
        meter.lookAt(curve.getPoint(0.51));
        pipesGroup.add(meter);
    }
    group.add(pipesGroup);
    parts.push({
        name: "Cryo-Coolant Pumping Network",
        description: "Thick, multi-layered rubberized pipes carrying liquid nitrogen.",
        material: "Rubber, Steel",
        function: "Prevents the containment coils and core from melting down.",
        assemblyOrder: 9,
        connections: ["Containment Chamber", "Base Platform"],
        failureEffect: "Coolant leak causing rapid freezing followed by thermal runaway.",
        cascadeFailures: ["Magnetic Containment Coils"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: -5, z: -25 }
    });
    meshes.pipes = pipesGroup;

    // --- 10. POWER CONDUITS ---
    const conduitsGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const a = ((i+0.5)/12) * Math.PI * 2;
        const cGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 12);
        const cMesh = new THREE.Mesh(cGeo, copper);
        cMesh.position.set(Math.cos(a)*14, 6, Math.sin(a)*14);
        cMesh.rotation.z = Math.cos(a) * 0.25;
        cMesh.rotation.x = Math.sin(a) * 0.25;
        
        // Energy rings around conduit
        for(let j=0; j<5; j++) {
            const ringGeo = new THREE.TorusGeometry(0.8, 0.15, 12, 24);
            const ring = new THREE.Mesh(ringGeo, neonOrange);
            ring.position.y = -4 + j*2;
            ring.rotation.x = Math.PI/2;
            cMesh.add(ring);
        }
        conduitsGroup.add(cMesh);
    }
    group.add(conduitsGroup);
    parts.push({
        name: "High-Voltage Power Conduits",
        description: "Massive copper cylinders channeling terawatts of electricity, wrapped in glowing accelerator rings.",
        material: "Copper, Neon Orange",
        function: "Feeds raw power to the primary field emitters.",
        assemblyOrder: 10,
        connections: ["Base Platform", "Energy Field Emitters"],
        failureEffect: "Massive arc flashes vaporizing nearby matter.",
        cascadeFailures: ["Energy Field Emitters", "Operator Console"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: -10, z: 20 }
    });
    meshes.conduits = conduitsGroup;

    // --- 11. ENERGY FIELD EMITTERS ---
    const emittersGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const a = ((i+0.5)/12) * Math.PI * 2;
        const eMaster = new THREE.Group();
        
        const baseGeo = new THREE.BoxGeometry(2.5, 5, 2.5);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        
        const dishGeo = new THREE.CylinderGeometry(2, 0.8, 1.5, 24);
        const dishMesh = new THREE.Mesh(dishGeo, chrome);
        dishMesh.position.y = 3.25;
        
        const tipGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const tipMesh = new THREE.Mesh(tipGeo, neonBlue);
        tipMesh.position.y = 4.5;
        
        eMaster.add(baseMesh);
        eMaster.add(dishMesh);
        eMaster.add(tipMesh);
        
        eMaster.position.set(Math.cos(a)*16, 15, Math.sin(a)*16);
        eMaster.lookAt(0, 15, 0);
        
        emittersGroup.add(eMaster);
    }
    group.add(emittersGroup);
    parts.push({
        name: "Gravimetric Field Emitters",
        description: "Parabolic chrome dishes focusing raw energy into a stable field.",
        material: "Dark Steel, Chrome, Neon Blue",
        function: "Shapes the gravity inversion field into a localized, controlled bubble.",
        assemblyOrder: 11,
        connections: ["High-Voltage Power Conduits", "Primary Gyroscopic Ring"],
        failureEffect: "Field collapses, resulting in crushing standard gravity.",
        cascadeFailures: ["Containment Chamber"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -40 }
    });
    meshes.emitters = emittersGroup;

    // --- 12. OPERATOR CABIN ---
    const cabinGroup = new THREE.Group();
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-4, 0);
    cabinShape.lineTo(4, 0);
    cabinShape.lineTo(5, 6);
    cabinShape.lineTo(3, 10);
    cabinShape.lineTo(-3, 10);
    cabinShape.lineTo(-5, 6);
    cabinShape.closePath();
    
    const cabinSettings = { depth: 8, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinSettings);
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinMesh.position.set(-4, 3, 20);
    cabinGroup.add(cabinMesh);
    
    // Front Glass Panel
    const windowGeo = new THREE.PlaneGeometry(7.5, 4.5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 8, 28.1);
    cabinGroup.add(windowMesh);
    
    // Side Access Door
    const doorGeo = new THREE.PlaneGeometry(3, 6);
    const doorMesh = new THREE.Mesh(doorGeo, darkSteel);
    doorMesh.position.set(4.1, 6, 24);
    doorMesh.rotation.y = Math.PI / 2;
    cabinGroup.add(doorMesh);

    group.add(cabinGroup);
    parts.push({
        name: "Shielded Operator Cabin",
        description: "Heavily armored control room with radiation-tinted blast glass.",
        material: "Steel, Dark Steel, Tinted Glass",
        function: "Protects operators from ionizing radiation and extreme gravitational shear.",
        assemblyOrder: 12,
        connections: ["Base Platform", "Operator Console"],
        failureEffect: "Operator succumbs to lethal radiation exposure.",
        cascadeFailures: ["Operator Console"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 45 }
    });
    meshes.cabin = cabinGroup;

    // --- 13. OPERATOR CONSOLE & SCREENS ---
    const consoleGroup = new THREE.Group();
    
    const deskGeo = new THREE.BoxGeometry(6, 1.2, 3);
    const desk = new THREE.Mesh(deskGeo, plastic);
    desk.position.set(0, 6, 25);
    consoleGroup.add(desk);
    
    // Multiple glowing screens
    for(let i=0; i<4; i++) {
        const screenGeo = new THREE.PlaneGeometry(1.5, 1.0);
        const screen = new THREE.Mesh(screenGeo, screenMaterial);
        screen.position.set(-2.25 + (i*1.5), 7.5, 25.8);
        screen.rotation.x = -Math.PI / 6;
        if(i < 2) screen.rotation.y = Math.PI / 8;
        else screen.rotation.y = -Math.PI / 8;
        consoleGroup.add(screen);
    }
    
    // Warning Lights
    for(let i=0; i<2; i++) {
        const warningGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const warning = new THREE.Mesh(warningGeo, errorMaterial);
        warning.position.set(-2.5 + (i*5), 7.2, 24.5);
        consoleGroup.add(warning);
    }
    
    group.add(consoleGroup);
    parts.push({
        name: "Holographic Command Console",
        description: "Tactile interface array with cascading diagnostic screens.",
        material: "Plastic, Neon Green, Emissive Red",
        function: "Provides granular control over ring velocity and field density.",
        assemblyOrder: 13,
        connections: ["Operator Cabin"],
        failureEffect: "Loss of manual override capabilities.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 8, z: 30 }
    });
    meshes.console = consoleGroup;

    // --- 14. EXHAUST VENTS ---
    const ventsGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const a = (i/6) * Math.PI * 2 + Math.PI/6;
        const stackMaster = new THREE.Group();
        
        const baseStackGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 24);
        const baseStack = new THREE.Mesh(baseStackGeo, darkSteel);
        baseStack.position.y = 7;
        
        const topStackGeo = new THREE.CylinderGeometry(1.8, 1.2, 3, 24);
        const topStack = new THREE.Mesh(topStackGeo, chrome);
        topStack.position.y = 12.5;
        
        for(let j=0; j<6; j++) {
            const slatGeo = new THREE.TorusGeometry(1.6, 0.1, 12, 48);
            const slat = new THREE.Mesh(slatGeo, steel);
            slat.position.y = 11.5 + j*0.4;
            slat.rotation.x = Math.PI/2;
            stackMaster.add(slat);
        }
        
        stackMaster.add(baseStack);
        stackMaster.add(topStack);
        stackMaster.position.set(Math.cos(a)*22, 0, Math.sin(a)*22);
        ventsGroup.add(stackMaster);
    }
    group.add(ventsGroup);
    parts.push({
        name: "Plasma Exhaust Stacks",
        description: "Tall, heavy-duty chimneys designed to safely vent superheated ozone and plasma bleed-off.",
        material: "Dark Steel, Chrome, Steel",
        function: "Prevents catastrophic pressure buildup of ionized gases around the core.",
        assemblyOrder: 14,
        connections: ["Base Platform"],
        failureEffect: "Explosive decompression of the surrounding atmosphere.",
        cascadeFailures: ["Shielding Panels"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: 15, z: 40 }
    });
    meshes.vents = ventsGroup;

    // --- 15. ABLATIVE SHIELDING PANELS ---
    const shieldsGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const a = (i/12) * Math.PI * 2;
        const sShape = new THREE.Shape();
        sShape.moveTo(-3, 0);
        sShape.lineTo(3, 0);
        sShape.lineTo(4, 12);
        sShape.lineTo(2, 18);
        sShape.lineTo(-2, 18);
        sShape.lineTo(-4, 12);
        sShape.closePath();
        
        const sGeo = new THREE.ExtrudeGeometry(sShape, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2 });
        const sMesh = new THREE.Mesh(sGeo, steel);
        
        const sMaster = new THREE.Group();
        sMesh.position.set(0, 0, -0.4);
        sMaster.add(sMesh);
        
        sMaster.position.set(Math.cos(a)*12, 3, Math.sin(a)*12);
        sMaster.rotation.y = -a + Math.PI/2;
        sMaster.rotation.x = -Math.PI / 10;
        
        shieldsGroup.add(sMaster);
    }
    group.add(shieldsGroup);
    parts.push({
        name: "Ablative Shielding Panels",
        description: "Heavy interlocking steel plates coated in radar-absorbent and heat-resistant materials.",
        material: "Steel",
        function: "Deflects stray micro-meteorites and contains minor internal shrapnel.",
        assemblyOrder: 15,
        connections: ["Base Platform", "Containment Chamber"],
        failureEffect: "Exposes fragile inner components to external damage.",
        cascadeFailures: ["Coolant Pipes", "Magnetic Containment Coils"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -60 }
    });
    meshes.shields = shieldsGroup;

    // --- 16. SENSOR ARRAY ---
    const sensorsGroup = new THREE.Group();
    const mastGeo = new THREE.CylinderGeometry(0.3, 0.6, 20, 16);
    const mast = new THREE.Mesh(mastGeo, aluminum);
    mast.position.set(-18, 10, -18);
    
    const dishGeo = new THREE.SphereGeometry(2.5, 24, 24, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeo, darkSteel);
    dish.position.set(-18, 20, -18);
    dish.rotation.x = Math.PI / 4;
    dish.rotation.z = Math.PI / 4;
    
    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
    const antenna = new THREE.Mesh(antennaGeo, chrome);
    antenna.position.set(-16.5, 21.5, -16.5);
    antenna.rotation.x = Math.PI / 4;
    antenna.rotation.z = Math.PI / 4;
    
    sensorsGroup.add(mast);
    sensorsGroup.add(dish);
    sensorsGroup.add(antenna);
    group.add(sensorsGroup);
    parts.push({
        name: "Telemetry Sensor Array",
        description: "High-gain parabolic dish and multi-band antenna mast for deep-space communication.",
        material: "Aluminum, Dark Steel, Chrome",
        function: "Transmits real-time gravimetric wave data to remote command.",
        assemblyOrder: 16,
        connections: ["Base Platform"],
        failureEffect: "Loss of remote monitoring, forcing local manual operation only.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: 10, z: -40 }
    });
    meshes.sensors = sensorsGroup;

    // --- 17. ACCESS LADDERS ---
    const laddersGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const a = (i/4) * Math.PI * 2 + Math.PI/4;
        const ladder = new THREE.Group();
        
        const rail1Geo = new THREE.CylinderGeometry(0.1, 0.1, 15, 8);
        const rail1 = new THREE.Mesh(rail1Geo, aluminum);
        rail1.position.set(-1, 7.5, 0);
        
        const rail2Geo = new THREE.CylinderGeometry(0.1, 0.1, 15, 8);
        const rail2 = new THREE.Mesh(rail2Geo, aluminum);
        rail2.position.set(1, 7.5, 0);
        
        for (let j = 0; j < 15; j++) {
            const rungGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
            const rung = new THREE.Mesh(rungGeo, steel);
            rung.rotation.z = Math.PI / 2;
            rung.position.set(0, j + 0.5, 0);
            ladder.add(rung);
        }
        
        ladder.add(rail1);
        ladder.add(rail2);
        
        ladder.position.set(Math.cos(a)*10, 0, Math.sin(a)*10);
        ladder.rotation.y = -a + Math.PI/2;
        
        laddersGroup.add(ladder);
    }
    group.add(laddersGroup);
    parts.push({
        name: "Maintenance Access Ladders",
        description: "Standard safety ladders for engineering personnel.",
        material: "Aluminum, Steel",
        function: "Allows physical access to the containment chamber during shutdown.",
        assemblyOrder: 17,
        connections: ["Base Platform", "Containment Chamber"],
        failureEffect: "Prevents direct maintenance access.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: -5, z: 15 }
    });

    group.scale.set(0.3, 0.3, 0.3); // Scale down for viewing

    const description = "The Xenodynamics Gravity Inverter is an ultra high-tech, massively scaled machine designed to warp local spacetime. " +
    "By suspending a negative-mass exotic matter core within a frictionless vacuum and wrapping it in counter-rotating superconducting gyroscopic rings, " +
    "it generates a localized gravitational repulsion field. Heavily shielded by ablative plates, braced by adaptive pneumatic legs, and requiring " +
    "terawatts of power and cryogenic cooling, it represents the absolute pinnacle of theoretical physics realized in extreme heavy engineering.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Exotic Matter Core?",
            options: ["Generating electricity", "Cooling the system", "Generating a repelling gravitational metric", "Venting ozone"],
            correctAnswer: 2,
            explanation: "The negative-mass exotic matter core emits intense Hawking radiation and generates the localized repelling gravitational metric."
        },
        {
            question: "Why does the machine utilize multiple counter-rotating Gyroscopic Rings?",
            options: ["For aesthetic symmetry", "To counteract massive angular momentum and provide macro-stability", "To pump liquid coolant", "To generate magnetic fields"],
            correctAnswer: 1,
            explanation: "The counter-rotating rings cancel out extreme angular momentum and stabilize the volatile spacetime metric."
        },
        {
            question: "What cryogenic material flows through the Magnetic Containment Coils?",
            options: ["Heavy Water", "Liquid Nitrogen", "Liquid Helium", "Ionized Plasma"],
            correctAnswer: 2,
            explanation: "The superconducting copper coils carry liquid helium to generate immense, frictionless magnetic fields to contain the core."
        },
        {
            question: "What happens if the Pneumatic Stabilizer Array fails?",
            options: ["The machine loses all power", "The inversion field collapses slowly", "A resonance cascade tears the machine apart", "The exhaust stacks vent pure plasma"],
            correctAnswer: 2,
            explanation: "Without the adaptive leveling struts, micro-seismic vibrations from the spin would cause a catastrophic, machine-destroying resonance cascade."
        },
        {
            question: "How is the operator protected from the machine's intense hazardous outputs?",
            options: ["Personal energy shields", "A heavily armored cabin with radiation-tinted blast glass", "Magnetic containment fields", "They are remote operators only"],
            correctAnswer: 1,
            explanation: "The Shielded Operator Cabin uses heavy steel plating and radiation-tinted glass to protect against deadly ionizing radiation and gravitational shear."
        }
    ];

    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;
        
        // Spin the rings at extreme speeds
        if (meshesObj.gyroOuter) {
            meshesObj.gyroOuter.rotation.y = time * speed * 2.5;
            meshesObj.gyroOuter.rotation.x = Math.sin(time * speed * 1.5) * 0.2;
        }
        
        if (meshesObj.gyroMid) {
            meshesObj.gyroMid.rotation.y = -time * speed * 4.0;
            meshesObj.gyroMid.rotation.z = Math.cos(time * speed * 1.2) * 0.15;
        }
        
        if (meshesObj.gyroInner) {
            meshesObj.gyroInner.rotation.x = time * speed * 6.0;
            meshesObj.gyroInner.rotation.y = time * speed * 5.0;
        }
        
        // Core pulsating and hovering
        if (meshesObj.core) {
            const pulse = 1 + Math.sin(time * speed * 10) * 0.15;
            meshesObj.core.scale.set(pulse, pulse, pulse);
            meshesObj.core.rotation.y = time * speed * 0.8;
            meshesObj.core.rotation.x = time * speed * 0.6;
        }
        
        // Levitation effect for the entire internal containment assembly
        const hoverOffset = Math.sin(time * speed * 2) * 0.6;
        if (meshesObj.chamber) meshesObj.chamber.position.y = 3 + hoverOffset;
        if (meshesObj.core) meshesObj.core.position.y = 15 + hoverOffset;
        if (meshesObj.gyroOuter) meshesObj.gyroOuter.position.y = 15 + hoverOffset;
        if (meshesObj.gyroMid) meshesObj.gyroMid.position.y = 15 + hoverOffset;
        if (meshesObj.gyroInner) meshesObj.gyroInner.position.y = 15 + hoverOffset;
        if (meshesObj.coils) meshesObj.coils.position.y = hoverOffset;
        
        // Flash warning lights on console randomly based on sine waves
        if (meshesObj.console) {
            const w1 = meshesObj.console.children[5]; // Index 5 and 6 are the warning lights (1 desk, 4 screens, 2 lights)
            const w2 = meshesObj.console.children[6];
            if (w1 && w1.material) {
                w1.material.emissiveIntensity = (Math.sin(time * speed * 15) > 0) ? 2.5 : 0;
            }
            if (w2 && w2.material) {
                w2.material.emissiveIntensity = (Math.cos(time * speed * 12) > 0) ? 2.5 : 0;
            }
        }
        
        // Rotate telemetry sensor dish smoothly
        if (meshesObj.sensors) {
            const dish = meshesObj.sensors.children[1];
            if (dish) dish.rotation.y = time * speed * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createGravityInverter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
