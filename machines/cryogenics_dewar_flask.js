import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom generated materials for advanced visual flair
    const frostedMaterial = new THREE.MeshStandardMaterial({
        color: 0xccffff,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        envMapIntensity: 0.5
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        roughness: 0.2
    });

    const brass = new THREE.MeshStandardMaterial({
        color: 0xb5a642,
        roughness: 0.3,
        metalness: 0.8
    });

    const glowingVapor = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x88ccff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });

    // 1. Extreme Terrain Chassis
    const chassisGroup = new THREE.Group();
    const chassisGeom = new THREE.BoxGeometry(11, 1.2, 15);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.y = 2.5;
    chassisGroup.add(chassis);

    // Structural Cross-Girders
    for(let i = -4.5; i <= 4.5; i += 2.25) {
        const girderGeo = new THREE.BoxGeometry(0.6, 1.4, 15.2);
        const girder = new THREE.Mesh(girderGeo, steel);
        girder.position.set(i, 2.5, 0);
        chassisGroup.add(girder);
    }

    // Heavy duty bolts on chassis
    for (let x = -5; x <= 5; x += 2.5) {
        for (let z = -7; z <= 7; z += 3.5) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 6), chrome);
            bolt.position.set(x, 3.1, z);
            chassisGroup.add(bolt);
        }
    }
    
    // 2. Off-Road Tires & Complex Drive Axles
    const wheelGroup = new THREE.Group();
    meshes.wheels = [];
    const wheelPositions = [
        [-6.5, 2.5, -5.5],
        [ 6.5, 2.5, -5.5],
        [-6.5, 2.5,  5.5],
        [ 6.5, 2.5,  5.5]
    ];

    const tireGeo = new THREE.TorusGeometry(1.8, 0.7, 32, 64);
    const rimGeo = new THREE.CylinderGeometry(1.3, 1.3, 1.6, 32);
    const spokeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 16);
    const lugGeo = new THREE.BoxGeometry(0.35, 0.5, 1.6);

    wheelPositions.forEach((pos) => {
        const wGroup = new THREE.Group();
        
        // Main Tire Body
        const tire = new THREE.Mesh(tireGeo, rubber);
        tire.rotation.y = Math.PI / 2;
        wGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs for aggressive off-road treads
        const numLugs = 48;
        for(let t = 0; t < numLugs; t++) {
            const angle = (t / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(0, Math.cos(angle) * 2.4, Math.sin(angle) * 2.4);
            lug.rotation.x = -angle;
            
            // Chevron staggered pattern
            if (t % 2 === 0) {
                lug.rotation.y = 0.25;
                lug.position.x = 0.1;
            } else {
                lug.rotation.y = -0.25;
                lug.position.x = -0.1;
            }
            wGroup.add(lug);
        }

        // Complex Rim
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.z = Math.PI / 2;
        wGroup.add(rim);

        // Spokes Array
        for(let s = 0; s < 16; s++) {
            const sAngle = (s / 16) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = sAngle;
            spoke.rotation.z = Math.PI / 2;
            wGroup.add(spoke);
        }

        // Inner Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.8, 32), chrome);
        hub.rotation.z = Math.PI / 2;
        wGroup.add(hub);

        // Drive Axle connection
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.5, 16), steel);
        axle.rotation.z = Math.PI / 2;
        axle.position.x = (pos[0] > 0) ? -1.25 : 1.25;
        wGroup.add(axle);

        wGroup.position.set(pos[0], pos[1], pos[2]);
        wheelGroup.add(wGroup);
        meshes.wheels.push(wGroup);
    });

    // 3. Hydraulic Brakes & Heavy Suspensions
    const suspensionGroup = new THREE.Group();
    meshes.suspensions = [];
    wheelPositions.forEach((pos) => {
        const sGroup = new THREE.Group();
        
        // Massive Coil spring
        const curve = new THREE.CatmullRomCurve3(
            new Array(60).fill(0).map((_, i) => {
                const t = i / 59;
                const r = 0.6;
                const h = 2.5;
                return new THREE.Vector3(Math.cos(t * Math.PI * 12) * r, t * h - h/2, Math.sin(t * Math.PI * 12) * r);
            })
        );
        const springGeo = new THREE.TubeGeometry(curve, 150, 0.12, 16, false);
        const spring = new THREE.Mesh(springGeo, steel);
        spring.position.set(pos[0] > 0 ? pos[0] - 1.8 : pos[0] + 1.8, pos[1] + 1.8, pos[2]);
        sGroup.add(spring);
        
        // Hydraulic Shock absorber piston
        const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.8, 16), darkSteel);
        pistonOuter.position.set(spring.position.x, spring.position.y + 0.6, spring.position.z);
        const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16), chrome);
        pistonInner.position.set(spring.position.x, spring.position.y - 0.6, spring.position.z);
        sGroup.add(pistonOuter, pistonInner);
        
        suspensionGroup.add(sGroup);
        meshes.suspensions.push(pistonInner);
    });

    // 4. Massive Outer Dewar Vessel (Main Tank)
    const tankGroup = new THREE.Group();
    tankGroup.position.set(0, 8, 0);

    const points = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        let x = 4.5;
        let y = t * 9 - 4.5;
        if (t < 0.15) { // Bottom rounded dome
            const u = t / 0.15;
            x = 4.5 * Math.sin(u * Math.PI / 2);
            y = -4.5 + 4.5 * (1 - Math.cos(u * Math.PI / 2));
        } else if (t > 0.85) { // Top rounded dome
            const u = (t - 0.85) / 0.15;
            x = 4.5 * Math.cos(u * Math.PI / 2);
            y = 4.5 - 4.5 * (1 - Math.sin(u * Math.PI / 2));
        }
        points.push(new THREE.Vector2(x, y));
    }
    const tankGeo = new THREE.LatheGeometry(points, 128); // Ultra high segment count
    const outerTank = new THREE.Mesh(tankGeo, chrome);
    tankGroup.add(outerTank);

    // Ribbed structural reinforcement bands
    for(let y = -2.5; y <= 2.5; y += 1.25) {
        const band = new THREE.Mesh(new THREE.TorusGeometry(4.55, 0.15, 32, 128), darkSteel);
        band.position.y = y;
        band.rotation.x = Math.PI / 2;
        tankGroup.add(band);
    }

    // Thousands of Welds / Rivets on bands for extreme realism
    for(let y = -2.5; y <= 2.5; y += 1.25) {
        for(let r = 0; r < 64; r++) {
            const angle = (r / 64) * Math.PI * 2;
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), steel);
            rivet.position.set(Math.cos(angle) * 4.65, y, Math.sin(angle) * 4.65);
            tankGroup.add(rivet);
        }
    }

    // 5. Vacuum Insulation Jacket (Viewport detail cutaway showing inner layers)
    const viewportGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 64);
    const viewport = new THREE.Mesh(viewportGeo, darkSteel);
    viewport.position.set(0, 0, 4.5);
    viewport.rotation.x = Math.PI / 2;
    
    // Tinted thick pressure glass
    const viewportGlass = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.65, 64), tinted);
    viewportGlass.position.set(0, 0, 4.5);
    viewportGlass.rotation.x = Math.PI / 2;
    
    // Inner cryogenic chamber visible through viewport (Copper layered)
    const innerTankDetail = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 64), copper);
    innerTankDetail.position.set(0, 0, 3.8);
    
    tankGroup.add(viewport, viewportGlass, innerTankDetail);

    // 6. Top Flange & Hermetic Seal Assembly
    const flangeGroup = new THREE.Group();
    flangeGroup.position.set(0, 4.5, 0); 

    const flangeBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.6, 64), darkSteel);
    flangeGroup.add(flangeBase);

    // Massive Hex Bolts around flange
    for(let b = 0; b < 16; b++) {
        const angle = (b / 16) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 6), chrome);
        bolt.position.set(Math.cos(angle) * 1.4, 0, Math.sin(angle) * 1.4);
        flangeGroup.add(bolt);
    }

    // Central Neck tube extending into the inner tank
    const neckTube = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5, 64), steel);
    neckTube.position.y = -1;
    flangeGroup.add(neckTube);

    tankGroup.add(flangeGroup);

    // 7. Complex Liquid Dispensing Manifold & High-Tech Valves
    const manifoldGroup = new THREE.Group();
    manifoldGroup.position.set(0, 5, 0); 

    // Main manifold distribution block
    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.5), darkSteel);
    manifoldGroup.add(mainBlock);

    // Function to generate highly detailed multi-part valves
    const createValve = (color) => {
        const vGrp = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 32), brass);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 32), chrome);
        stem.position.y = 0.5;
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 32, 64), color);
        handle.position.y = 0.8;
        handle.rotation.x = Math.PI / 2;
        
        // Complex spokes for handle
        for(let i=0; i<5; i++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16), color);
            spoke.position.y = 0.8;
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i/5) * Math.PI;
            vGrp.add(spoke);
        }
        
        const centerNut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 6), steel);
        centerNut.position.y = 0.82;
        vGrp.add(body, stem, handle, centerNut);
        return { group: vGrp, handle, stem };
    };

    // Primary Liquid Dispense Valve
    const dispenseValve = createValve(plastic); // Blue handle for liquid
    dispenseValve.group.position.set(0.8, 0.4, 0);
    dispenseValve.group.rotation.z = -Math.PI / 4;
    manifoldGroup.add(dispenseValve.group);
    meshes.dispenseValveHandle = dispenseValve.handle;

    // Vapor Vent Valve
    const ventValve = createValve(new THREE.MeshStandardMaterial({color: 0x555555, roughness: 0.8})); // Grey handle
    ventValve.group.position.set(0, 0.4, 0.8);
    ventValve.group.rotation.x = Math.PI / 4;
    manifoldGroup.add(ventValve.group);
    meshes.ventValveHandle = ventValve.handle;

    // 8. Vapor Vent System (Custom Frosted Pipe)
    const ventPipePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.4, 0.8),
        new THREE.Vector3(0, 1.8, 1.8),
        new THREE.Vector3(0, 3.5, 2.2),
        new THREE.Vector3(0, 5.0, 2.5)
    ]);
    const ventPipeGeo = new THREE.TubeGeometry(ventPipePath, 128, 0.15, 32, false);
    const ventPipe = new THREE.Mesh(ventPipeGeo, frostedMaterial);
    manifoldGroup.add(ventPipe);

    // Dense Ice/frost particle accumulation on vent pipe surface
    const frostParticlesGeo = new THREE.BufferGeometry();
    const frostCount = 3000;
    const frostPos = new Float32Array(frostCount * 3);
    for(let i = 0; i < frostCount; i++) {
        const t = Math.random();
        const pt = ventPipePath.getPoint(t);
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.15 + Math.random() * 0.08;
        frostPos[i*3] = pt.x + Math.cos(angle) * radius;
        frostPos[i*3+1] = pt.y + (Math.random() - 0.5) * 0.15;
        frostPos[i*3+2] = pt.z + Math.sin(angle) * radius;
    }
    frostParticlesGeo.setAttribute('position', new THREE.BufferAttribute(frostPos, 3));
    const frostMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.04, transparent: true, opacity: 0.9});
    const frostSystem = new THREE.Points(frostParticlesGeo, frostMat);
    manifoldGroup.add(frostSystem);

    // 9. Dual Pressure Relief Valves & Rupture Disc
    const prv1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 32), brass);
    prv1.position.set(-0.6, 0.5, -0.6);
    const prvCap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32), chrome);
    prvCap1.position.set(-0.6, 0.9, -0.6);
    manifoldGroup.add(prv1, prvCap1);
    meshes.prvCap = prvCap1;

    const ruptureDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32), copper);
    ruptureDisc.position.set(0.6, 0.5, -0.6);
    manifoldGroup.add(ruptureDisc);

    // 10. High-Precision Analog Pressure Gauge
    const gaugeGrp = new THREE.Group();
    gaugeGrp.position.set(0, 0.6, -1.0);
    gaugeGrp.rotation.x = -Math.PI / 4;
    
    const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 64), chrome);
    gaugeBody.rotation.x = Math.PI / 2;
    const gaugeFace = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.16, 64), new THREE.MeshStandardMaterial({color: 0xffffff}));
    gaugeFace.rotation.x = Math.PI / 2;
    
    // Glass cover
    const gaugeGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.17, 64), glass);
    gaugeGlass.rotation.x = Math.PI / 2;

    const needleGrp = new THREE.Group();
    needleGrp.position.set(0, 0, 0.09);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, 0.01), new THREE.MeshStandardMaterial({color: 0xff0000}));
    needle.position.y = 0.12;
    needleGrp.add(needle);
    meshes.pressureNeedle = needleGrp;

    // Dial markings
    for(let m = 0; m < 20; m++) {
        const mark = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.01), new THREE.MeshStandardMaterial({color: 0x000000}));
        const angle = (m / 20) * Math.PI * 1.5 - Math.PI * 0.75;
        mark.position.set(Math.sin(angle)*0.3, Math.cos(angle)*0.3, 0.08);
        mark.rotation.z = -angle;
        gaugeGrp.add(mark);
    }

    gaugeGrp.add(gaugeBody, gaugeFace, gaugeGlass, needleGrp);
    manifoldGroup.add(gaugeGrp);

    tankGroup.add(manifoldGroup);

    // 11. Liquid Level Indicator (Glowing Neon Vertical Bar)
    const levelGrp = new THREE.Group();
    levelGrp.position.set(0, 0, 4.55); 
    
    const levelFrame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.25), darkSteel);
    const levelGlass = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.8, 0.3), glass);
    const levelLiquid = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 0.2), neonCyan);
    levelLiquid.position.y = -0.15; 
    levelLiquid.position.z = 0.05;
    meshes.levelLiquid = levelLiquid;

    // Calibration hash marks
    for(let h = -2.5; h <= 2.5; h += 0.5) {
        const hash = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.32), chrome);
        hash.position.y = h;
        levelGrp.add(hash);
    }

    levelGrp.add(levelFrame, levelGlass, levelLiquid);
    tankGroup.add(levelGrp);

    // 12. Pressure Building Circuit (External Heat Exchanger Fins)
    const pbCircuitGrp = new THREE.Group();
    pbCircuitGrp.position.set(-4.55, -2, 0);
    pbCircuitGrp.rotation.z = Math.PI / 2;

    const pbPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 7, 32), copper);
    pbCircuitGrp.add(pbPipe);

    // Hundreds of cooling fins generated programmatically
    const numFins = 120;
    for(let f = 0; f < numFins; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.015, 1.2), aluminum);
        fin.position.y = -3.3 + (f * (6.6 / numFins));
        pbCircuitGrp.add(fin);
    }
    
    tankGroup.add(pbCircuitGrp);

    // 13. Armored Cryogenic Transfer Hose
    const hosePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.8, 5.4, 0), 
        new THREE.Vector3(2.5, 4.5, 0),
        new THREE.Vector3(3.5, 2, 2.5),
        new THREE.Vector3(3.5, -2, 3.5),
        new THREE.Vector3(4.5, -4.5, 3.5)
    ]);
    const hoseGeo = new THREE.TubeGeometry(hosePath, 150, 0.2, 32, false);
    
    // Simulate steel braided wireframe outer layer over solid rubber core
    const hoseMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.8,
        wireframe: true 
    });
    const hose = new THREE.Mesh(hoseGeo, rubber);
    const hoseBraid = new THREE.Mesh(new THREE.TubeGeometry(hosePath, 150, 0.21, 32, false), hoseMat);
    tankGroup.add(hose, hoseBraid);
    meshes.hose = hose;

    // 14. Telemetry Control Unit with Glowing Screens
    const tcuGrp = new THREE.Group();
    tcuGrp.position.set(2.5, 3.5, 3.5);
    tcuGrp.rotation.y = Math.PI / 4;

    const tcuBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.6), darkSteel);
    const tcuScreen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.65), new THREE.MeshStandardMaterial({color: 0x050505}));
    
    // Animated Glowing readouts
    const readout1 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.3), neonCyan);
    readout1.position.set(-0.4, 0.25, 0.33);
    const readout2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.15), neonRed);
    readout2.position.set(0, -0.3, 0.33);
    
    // Miniature buttons
    for(let btn = 0; btn < 4; btn++) {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), chrome);
        b.position.set(0.6, 0.3 - (btn * 0.15), 0.33);
        b.rotation.x = Math.PI / 2;
        tcuGrp.add(b);
    }

    meshes.readout1 = readout1;
    meshes.readout2 = readout2;

    tcuGrp.add(tcuBox, tcuScreen, readout1, readout2);
    
    // Robotic Arm mounting TCU to tank
    const tcuArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 32), chrome);
    tcuArm1.position.set(-1.25, -0.6, -1.25);
    tcuArm1.rotation.x = Math.PI / 2;
    tcuArm1.rotation.z = Math.PI / 4;
    tcuGrp.add(tcuArm1);

    tankGroup.add(tcuGrp);

    // 15. Heavy Duty Transport Craning Handles
    const handleGrp = new THREE.Group();
    const handleGeo = new THREE.TorusGeometry(0.4, 0.1, 32, 64, Math.PI);
    const h1 = new THREE.Mesh(handleGeo, chrome);
    h1.position.set(-4.5, 3.5, 0);
    h1.rotation.z = Math.PI / 2;
    const h2 = new THREE.Mesh(handleGeo, chrome);
    h2.position.set(4.5, 3.5, 0);
    h2.rotation.z = -Math.PI / 2;
    handleGrp.add(h1, h2);
    tankGroup.add(handleGrp);

    // 16. Dynamic Vapor Particle Emitters
    const vaporCount = 400;
    const vaporGeo = new THREE.BufferGeometry();
    const vaporPos = new Float32Array(vaporCount * 3);
    const vaporVel = [];
    for(let i=0; i<vaporCount; i++) {
        vaporPos[i*3] = (Math.random() - 0.5) * 0.6;
        vaporPos[i*3+1] = 13 + Math.random() * 3;
        vaporPos[i*3+2] = 2.5 + (Math.random() - 0.5) * 0.6;
        vaporVel.push({
            x: (Math.random() - 0.5) * 0.03,
            y: 0.06 + Math.random() * 0.06,
            z: (Math.random() - 0.5) * 0.03
        });
    }
    vaporGeo.setAttribute('position', new THREE.BufferAttribute(vaporPos, 3));
    const vaporPoints = new THREE.Points(vaporGeo, glowingVapor);
    group.add(vaporPoints);
    meshes.vaporGeo = vaporGeo;
    meshes.vaporVel = vaporVel;

    // Final Assembly
    group.add(chassisGroup);
    group.add(wheelGroup);
    group.add(suspensionGroup);
    group.add(tankGroup);

    // Part Definitions for Encyclopedia
    parts.push({
        name: "Extreme Terrain Chassis",
        description: "Heavy-duty dark steel girders providing a rugged, impact-resistant base for deploying cryogenics into hostile environments.",
        material: "Dark Steel",
        function: "Absolute structural support and foundational kinetic shock resistance.",
        assemblyOrder: 1,
        connections: ["Drive Axles", "Outer Dewar Vessel"],
        failureEffect: "Structural collapse leading to catastrophic dewar breach.",
        cascadeFailures: ["Outer Dewar Vessel", "Pressure Building Circuit"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    parts.push({
        name: "Aggressive Off-Road Tires",
        description: "Massive tires equipped with deep chevron treads and reinforced complex spoke rims.",
        material: "Vulcanized Rubber / Steel Rims",
        function: "Mobility and primary shock absorption over jagged terrain.",
        assemblyOrder: 2,
        connections: ["Drive Axles", "Hydraulic Suspension"],
        failureEffect: "Immobilization of the dewar transport system.",
        cascadeFailures: ["Hydraulic Suspension"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    parts.push({
        name: "Hydraulic Suspension",
        description: "Active high-pressure hydraulic pistons surrounded by massive steel coil springs.",
        material: "Chrome / Steel",
        function: "Prevents extreme high-G kinetic impacts from fracturing the delicate inner vacuum envelope.",
        assemblyOrder: 3,
        connections: ["Off-Road Tires", "Extreme Terrain Chassis"],
        failureEffect: "Transmission of kinetic shock, shattering the inner flask.",
        cascadeFailures: ["Vacuum Insulation Jacket", "Inner Cryo Chamber"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -4, z: 12}
    });

    parts.push({
        name: "Outer Dewar Vessel",
        description: "Massive stainless steel outer containment tank, highly polished to reflect external radiant heat.",
        material: "Chrome / Stainless Steel",
        function: "Provides the physical boundary for the vacuum envelope and protects internal cryogenic structures.",
        assemblyOrder: 4,
        connections: ["Vacuum Insulation Jacket", "Top Flange Assembly", "Extreme Terrain Chassis"],
        failureEffect: "Complete loss of vacuum insulation layer.",
        cascadeFailures: ["Vacuum Insulation Jacket"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: -15, y: 12, z: 0}
    });

    parts.push({
        name: "Vacuum Insulation Jacket",
        description: "High-vacuum annular space embedded with multi-layer superinsulation (MLI).",
        material: "Glass / Hard Vacuum",
        function: "Eliminates all convective and conductive heat transfer pathways to the liquid nitrogen.",
        assemblyOrder: 5,
        connections: ["Outer Dewar Vessel", "Inner Cryo Chamber"],
        failureEffect: "Immediate and rapid boil-off of liquid nitrogen.",
        cascadeFailures: ["Pressure Relief Valve (Primary)", "Rupture Disc Housing"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 15, y: 12, z: 0}
    });

    parts.push({
        name: "Top Flange Assembly",
        description: "Thick, hex-bolted steel plate creating an absolute hermetic seal at the neck of the dewar.",
        material: "Dark Steel",
        function: "Provides robust mounting points for the distribution manifold while sealing the vacuum.",
        assemblyOrder: 6,
        connections: ["Outer Dewar Vessel", "Liquid Dispensing Manifold"],
        failureEffect: "Catastrophic cryogenic gas leak at the neck.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 12.5, z: 0},
        explodedPosition: {x: 0, y: 18, z: 0}
    });

    parts.push({
        name: "Liquid Dispensing Manifold",
        description: "Complex heavily-machined steel and brass block routing highly pressurized liquid and gas flows.",
        material: "Steel / Brass",
        function: "Central hub for safely controlling the extraction of cryogenic liquid or venting of gas.",
        assemblyOrder: 7,
        connections: ["Top Flange Assembly", "Dispense Valve", "Vapor Vent System"],
        failureEffect: "Complete inability to extract contents or manage pressure safely.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 13, z: 0},
        explodedPosition: {x: 0, y: 22, z: 0}
    });

    parts.push({
        name: "Vapor Vent System",
        description: "Tall frosted exhaust pipe heavily accumulated with ice crystals.",
        material: "Frosted Alloy",
        function: "Directs dangerously cold, oxygen-displacing nitrogen gas plumes upwards and safely away from operators.",
        assemblyOrder: 8,
        connections: ["Liquid Dispensing Manifold"],
        failureEffect: "Severe asphyxiation hazard for operators due to localized oxygen displacement.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 13, z: 0.8},
        explodedPosition: {x: 0, y: 26, z: 6}
    });

    parts.push({
        name: "Pressure Relief Valve (Primary)",
        description: "Spring-loaded heavy brass safety valve precisely calibrated to 22 PSI.",
        material: "Brass / Chrome",
        function: "Automatically vents excess gas pressure generated by natural cryogenic boil-off.",
        assemblyOrder: 9,
        connections: ["Liquid Dispensing Manifold"],
        failureEffect: "Dangerous overpressurization of the inner containment chamber.",
        cascadeFailures: ["Rupture Disc Housing"],
        originalPosition: {x: -0.6, y: 13.5, z: -0.6},
        explodedPosition: {x: -8, y: 24, z: -8}
    });

    parts.push({
        name: "Rupture Disc Housing",
        description: "Frangible copper blowout disc engineered to permanently fail at exactly 35 PSI.",
        material: "Copper",
        function: "Acts as the ultimate failsafe mechanism against catastrophic vessel explosion if relief valves freeze.",
        assemblyOrder: 10,
        connections: ["Liquid Dispensing Manifold"],
        failureEffect: "Imminent vessel explosion.",
        cascadeFailures: ["Inner Cryo Chamber", "Outer Dewar Vessel"],
        originalPosition: {x: 0.6, y: 13.5, z: -0.6},
        explodedPosition: {x: 8, y: 24, z: -8}
    });

    parts.push({
        name: "High-Precision Pressure Gauge",
        description: "Analog dial indicator encased in chrome and thick glass, displaying internal tank pressure.",
        material: "Chrome / Glass",
        function: "Provides essential visual monitoring of volatile pressure states.",
        assemblyOrder: 11,
        connections: ["Liquid Dispensing Manifold"],
        failureEffect: "Operator blindness to imminent pressure safety hazards.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 13.6, z: -1.0},
        explodedPosition: {x: 0, y: 20, z: -12}
    });

    parts.push({
        name: "Level Indicator Display",
        description: "Glowing neon-cyan vertical column tracking the internal cryogenic float.",
        material: "Glass / Neon Liquid",
        function: "Provides a highly visible, real-time display of the remaining volume of liquid nitrogen.",
        assemblyOrder: 12,
        connections: ["Outer Dewar Vessel"],
        failureEffect: "Inaccurate volume readings leading to operational shortages.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 8, z: 4.55},
        explodedPosition: {x: 0, y: 8, z: 14}
    });

    parts.push({
        name: "Pressure Building Circuit",
        description: "External heat exchanger equipped with hundreds of precision-machined aluminum fins.",
        material: "Copper / Aluminum",
        function: "Intentionally vaporizes small amounts of liquid to build the necessary driving pressure for rapid dispensing.",
        assemblyOrder: 13,
        connections: ["Outer Dewar Vessel"],
        failureEffect: "Inability to dispense cryogenic liquid at high flow rates.",
        cascadeFailures: [],
        originalPosition: {x: -4.55, y: 6, z: 0},
        explodedPosition: {x: -16, y: 6, z: 0}
    });

    parts.push({
        name: "Armored Cryogenic Transfer Hose",
        description: "Thick rubber hose entirely wrapped in a protective steel-braided wireframe.",
        material: "Rubber / Steel Braid",
        function: "Safely transfers highly pressurized liquid nitrogen to external receptacles or cooling arrays.",
        assemblyOrder: 14,
        connections: ["Liquid Dispensing Manifold"],
        failureEffect: "Hose rupture leading to severe cryogenic burns to nearby operators.",
        cascadeFailures: [],
        originalPosition: {x: 0.8, y: 13.4, z: 0},
        explodedPosition: {x: 12, y: 14, z: 12}
    });

    parts.push({
        name: "Telemetry Control Unit",
        description: "Advanced diagnostic computer featuring glowing neon readouts and multi-sensor processing.",
        material: "Dark Steel / Silicon",
        function: "Actively monitors vacuum integrity, dynamic boil-off rates, internal temperature, and GPS positioning.",
        assemblyOrder: 15,
        connections: ["Outer Dewar Vessel"],
        failureEffect: "Complete loss of remote tracking and critical automated early-warnings.",
        cascadeFailures: [],
        originalPosition: {x: 2.5, y: 11.5, z: 3.5},
        explodedPosition: {x: 12, y: 16, z: 12}
    });

    const description = "The AT-LN2 Extreme Transport Dewar Flask is a massive, hyper-engineered mobile cryogenics containment system. Featuring heavily treaded off-road tires, active hydraulic suspension, and an impenetrable, highly polished vacuum-insulated inner chamber, it safely stores and transports liquid nitrogen (-196°C) across the most hostile environments known to humanity. It boasts active automated pressure building circuits, triple-redundant relief safety systems, and a glowing neon telemetry tracking display.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Vacuum Insulation Jacket?",
            options: [
                "To eliminate convective and conductive heat transfer pathways.",
                "To increase the overall mass of the dewar for vehicular stability.",
                "To generate static electrical power for the telemetry control unit.",
                "To actively pressurize the liquid nitrogen for extraction."
            ],
            correctAnswer: 0,
            explanation: "The vacuum jacket removes all air molecules between the inner and outer vessels, effectively halting heat transfer via convection and conduction. This extreme thermal isolation keeps the liquid nitrogen at -196°C."
        },
        {
            question: "Why does the dewar feature a prominent Pressure Building Circuit?",
            options: [
                "To actively prevent the external tank from imploding.",
                "To intentionally vaporize a small amount of liquid to build driving pressure for rapid dispensing.",
                "To safely cool down the external transport chassis during operation.",
                "To periodically test the structural integrity of the rupture disc."
            ],
            correctAnswer: 1,
            explanation: "Liquid nitrogen dewars require internal pressure to effectively push the dense liquid out of the transfer hose. The pressure building circuit uses ambient environmental heat via exposed aluminum fins to boil a small amount of liquid, raising the tank's internal pressure."
        },
        {
            question: "What is the extreme emergency purpose of the Rupture Disc Housing?",
            options: [
                "To vent trace amounts of gas slowly during normal safe operation.",
                "To act as a final failsafe that physically bursts at a critical pressure to prevent a catastrophic vessel explosion.",
                "To accurately measure the elemental purity of the nitrogen gas.",
                "To permanently seal the vacuum jacket during the final stages of manufacturing."
            ],
            correctAnswer: 1,
            explanation: "If the primary mechanical relief valves freeze shut or fail mechanically, the rupture disc provides a guaranteed frangible blowout point to safely vent extreme, vessel-destroying pressure before the entire tank bursts."
        },
        {
            question: "Why are heavy active hydraulic suspensions strictly necessary for this specific All-Terrain Dewar?",
            options: [
                "To significantly increase the vehicle's top speed.",
                "To prevent high-G kinetic impacts from fracturing the delicate inner vacuum envelope.",
                "To infinitely adjust the vertical height of the cryogenic dispensing hose.",
                "To actively steer the massive chevron-treaded off-road tires."
            ],
            correctAnswer: 1,
            explanation: "The inner cryogenic vessel and its vacuum seal are highly sensitive to sudden kinetic shock. Transporting a filled dewar over extremely rough terrain requires massive shock absorption to prevent fracturing the inner support mounts or completely shattering the vacuum."
        },
        {
            question: "What severe hazard is mitigated by the tall, frosted Vapor Vent System?",
            options: [
                "Uncontrolled liquid nitrogen spills directly onto the steel chassis.",
                "Asphyxiation hazards by directing concentrated, oxygen-displacing nitrogen gas plumes away from operators.",
                "Overheating and subsequent failure of the digital telemetry control unit.",
                "Tire rubber degradation caused by extreme cryogenic cold."
            ],
            correctAnswer: 1,
            explanation: "Expanding nitrogen gas rapidly displaces breathable oxygen in the atmosphere. The tall exhaust vent pipe directs concentrated plumes of this heavy gas safely upwards and away from the critical breathing zone of human operators."
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Rotate all massive off-road wheels
        if (meshesObj.wheels) {
            meshesObj.wheels.forEach(wheel => {
                wheel.rotation.x = time * speed * 2.5;
            });
        }
        
        // Active hydraulic suspension bouncing and adjusting dynamically
        if (meshesObj.suspensions) {
            meshesObj.suspensions.forEach((sus, i) => {
                sus.position.y = Math.sin(time * speed * 12 + i) * 0.12;
            });
        }

        // Valve handles vibrating slightly under extreme internal pressure
        if (meshesObj.dispenseValveHandle) {
            meshesObj.dispenseValveHandle.rotation.z = -Math.PI/4 + Math.sin(time * speed * 25) * 0.04;
        }
        if (meshesObj.ventValveHandle) {
            meshesObj.ventValveHandle.rotation.x = Math.PI/4 + Math.cos(time * speed * 20) * 0.03;
        }

        // Precision pressure needle jittering dynamically
        if (meshesObj.pressureNeedle) {
            meshesObj.pressureNeedle.rotation.z = Math.sin(time * speed * 6) * 0.15 + (Math.random() * 0.04);
        }

        // Primary Relief Valve Cap violently rattling
        if (meshesObj.prvCap) {
            meshesObj.prvCap.position.y = 0.9 + Math.max(0, Math.sin(time * speed * 18)) * 0.08;
        }

        // Glowing telemetry screens actively flickering and updating
        if (meshesObj.readout1 && meshesObj.readout2) {
            meshesObj.readout1.material.emissiveIntensity = 0.8 + Math.sin(time * speed * 12) * 0.25;
            meshesObj.readout2.material.emissiveIntensity = 0.6 + Math.random() * 0.4;
        }

        // Liquid nitrogen level sloshing internally
        if (meshesObj.levelLiquid) {
            meshesObj.levelLiquid.scale.y = 1 + Math.sin(time * speed * 4) * 0.03;
        }

        // Extremely detailed vapor exhaust particles rising dynamically from vent
        if (meshesObj.vaporGeo && meshesObj.vaporVel) {
            const positions = meshesObj.vaporGeo.attributes.position.array;
            for(let i=0; i<meshesObj.vaporVel.length; i++) {
                positions[i*3] += meshesObj.vaporVel[i].x * speed * 15;
                positions[i*3+1] += meshesObj.vaporVel[i].y * speed * 15;
                positions[i*3+2] += meshesObj.vaporVel[i].z * speed * 15;
                
                // Dynamically reset exhaust particles if they dissipate too high
                if (positions[i*3+1] > 20) {
                    positions[i*3] = (Math.random() - 0.5) * 0.6;
                    positions[i*3+1] = 13 + Math.random() * 0.8;
                    positions[i*3+2] = 2.5 + (Math.random() - 0.5) * 0.6;
                }
            }
            meshesObj.vaporGeo.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDewarFlask() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
