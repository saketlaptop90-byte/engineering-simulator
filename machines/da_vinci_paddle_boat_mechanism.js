import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials to blend Da Vinci's wooden aesthetic with hyper-advanced tech
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.9, metalness: 0.1 });
    const polishedWood = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.4, metalness: 0.2 });
    const neonGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 });
    const redGlow = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 3.0 });
    const energyCoreMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xcc00ff, emissiveIntensity: 4.0, wireframe: false });

    // ==========================================
    // 1. HULL SECTION (Complex Ribbed Extrusions)
    // ==========================================
    const hullGroup = new THREE.Group();
    
    // The Main Keel
    const keelShape = new THREE.Shape();
    keelShape.moveTo(0, 0);
    keelShape.lineTo(30, 0);
    keelShape.lineTo(33, 3);
    keelShape.lineTo(-5, 3);
    keelShape.lineTo(0, 0);
    
    const extrudeSettingsKeel = { 
        depth: 0.8, 
        bevelEnabled: true, 
        bevelSegments: 4, 
        steps: 2, 
        bevelSize: 0.15, 
        bevelThickness: 0.15 
    };
    const keelGeom = new THREE.ExtrudeGeometry(keelShape, extrudeSettingsKeel);
    const keel = new THREE.Mesh(keelGeom, darkSteel);
    keel.position.set(-15, -6, -0.4);
    hullGroup.add(keel);
    meshes.keel = keel;

    // Aft and Bow thruster modules
    const bowThrusterGeom = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    const bowThruster = new THREE.Mesh(bowThrusterGeom, chrome);
    bowThruster.rotation.x = Math.PI / 2;
    bowThruster.position.set(16, -4, 0);
    hullGroup.add(bowThruster);

    const aftThruster = new THREE.Mesh(bowThrusterGeom, chrome);
    aftThruster.rotation.x = Math.PI / 2;
    aftThruster.position.set(-18, -4, 0);
    hullGroup.add(aftThruster);

    // Ribs (Frames) - creating a massive skeletal ship structure
    const ribCount = 24;
    for (let i = 0; i < ribCount; i++) {
        const ribShape = new THREE.Shape();
        ribShape.moveTo(0, 0);
        ribShape.quadraticCurveTo(6, 2, 7.5, 10);
        ribShape.lineTo(6.5, 10);
        ribShape.quadraticCurveTo(5.0, 2.5, 0, 0.8);
        ribShape.lineTo(0, 0);
        
        const ribGeom = new THREE.ExtrudeGeometry(ribShape, { 
            depth: 0.5, 
            bevelEnabled: true, 
            bevelSegments: 3, 
            steps: 1, 
            bevelSize: 0.05, 
            bevelThickness: 0.05 
        });
        
        const ribRight = new THREE.Mesh(ribGeom, woodMaterial);
        ribRight.position.set(-12 + i * 1.3, -5.8, 0.4);
        ribRight.rotation.y = Math.PI / 2;
        
        const ribLeft = new THREE.Mesh(ribGeom, woodMaterial);
        ribLeft.position.set(-12 + i * 1.3, -5.8, -0.4);
        ribLeft.rotation.y = -Math.PI / 2;
        
        hullGroup.add(ribRight);
        hullGroup.add(ribLeft);

        // Add titanium reinforcement brackets to each rib
        const bracketGeom = new THREE.BoxGeometry(0.6, 0.6, 1.2);
        const bracketR = new THREE.Mesh(bracketGeom, steel);
        bracketR.position.set(-12 + i * 1.3, -5, 1.5);
        hullGroup.add(bracketR);

        const bracketL = new THREE.Mesh(bracketGeom, steel);
        bracketL.position.set(-12 + i * 1.3, -5, -1.5);
        hullGroup.add(bracketL);
    }
    
    // Outer Plating / Planking
    const plankGeom = new THREE.CylinderGeometry(7.8, 7.8, 30, 64, 1, true, 0, Math.PI);
    const planking = new THREE.Mesh(plankGeom, polishedWood);
    planking.rotation.z = Math.PI / 2;
    planking.scale.set(1, 1, 1.4);
    planking.position.set(2, 2, 0);
    // Give it a double-sided look by cloning and shrinking slightly
    const innerPlanking = planking.clone();
    innerPlanking.scale.set(0.98, 0.98, 1.38);
    innerPlanking.material = woodMaterial;
    
    hullGroup.add(planking);
    hullGroup.add(innerPlanking);

    // Decorative High-Tech Trim lines across the hull
    const trimGeom = new THREE.TorusGeometry(8, 0.1, 16, 64, Math.PI);
    for (let k = 0; k < 5; k++) {
        const trim = new THREE.Mesh(trimGeom, neonGlow);
        trim.rotation.y = Math.PI / 2;
        trim.rotation.x = Math.PI / 2;
        trim.position.set(-8 + k * 5, 2, 0);
        hullGroup.add(trim);
    }

    group.add(hullGroup);
    meshes.hull = hullGroup;
    
    // ==========================================
    // 2. MAIN DRIVE AXLE
    // ==========================================
    const mainAxleGeom = new THREE.CylinderGeometry(0.8, 0.8, 28, 64);
    const mainAxle = new THREE.Mesh(mainAxleGeom, steel);
    mainAxle.rotation.x = Math.PI / 2;
    mainAxle.position.set(2, 6, 0);
    
    // Axle bearings
    const bearingGeom = new THREE.TorusGeometry(1.2, 0.4, 32, 64);
    const bearing1 = new THREE.Mesh(bearingGeom, chrome);
    bearing1.position.set(2, 6, -8);
    bearing1.rotation.x = Math.PI/2;
    const bearing2 = bearing1.clone();
    bearing2.position.set(2, 6, 8);
    
    group.add(mainAxle);
    group.add(bearing1);
    group.add(bearing2);
    meshes.mainAxle = mainAxle;

    // ==========================================
    // 3. PADDLE WHEELS (Extremely High Detail)
    // ==========================================
    const createPaddleWheel = (isLeft) => {
        const wheelGroup = new THREE.Group();
        
        // Inner and Outer Rims
        const rimGeom = new THREE.TorusGeometry(8, 0.4, 32, 128);
        const innerRim = new THREE.Mesh(rimGeom, darkSteel);
        const outerRim = new THREE.Mesh(rimGeom, darkSteel);
        innerRim.position.z = -1.5;
        outerRim.position.z = 1.5;
        wheelGroup.add(innerRim);
        wheelGroup.add(outerRim);

        // Center massive Hub
        const hubGeom = new THREE.CylinderGeometry(1.8, 1.8, 4, 64);
        const hub = new THREE.Mesh(hubGeom, copper);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        // Hub detailing (Rivets and bolts)
        for (let r = 0; r < 12; r++) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), chrome);
            const angle = (r / 12) * Math.PI * 2;
            rivet.position.set(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 2);
            wheelGroup.add(rivet);
            const rivet2 = rivet.clone();
            rivet2.position.z = -2;
            wheelGroup.add(rivet2);
        }
        
        // Spokes and Curved Paddles
        const numPaddles = 16;
        for (let i = 0; i < numPaddles; i++) {
            const angle = (i / numPaddles) * Math.PI * 2;
            
            // Complex truss-style spokes
            const spokeGeom = new THREE.CylinderGeometry(0.15, 0.3, 7.5, 32);
            const spoke1 = new THREE.Mesh(spokeGeom, steel);
            spoke1.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, -1.5);
            spoke1.rotation.z = angle + Math.PI / 2;
            
            const spoke2 = new THREE.Mesh(spokeGeom, steel);
            spoke2.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 1.5);
            spoke2.rotation.z = angle + Math.PI / 2;
            
            // Cross bracing between spokes
            const crossBraceGeom = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
            const crossBrace = new THREE.Mesh(crossBraceGeom, copper);
            crossBrace.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 0);
            crossBrace.rotation.z = angle + Math.PI / 2;
            crossBrace.rotation.y = Math.PI / 4;
            
            wheelGroup.add(spoke1);
            wheelGroup.add(spoke2);
            wheelGroup.add(crossBrace);
            
            // Curved Blade (Paddle) - hyper detailed shape
            const bladeShape = new THREE.Shape();
            bladeShape.moveTo(0, 0);
            bladeShape.quadraticCurveTo(2.0, 0.8, 3.5, 0);
            bladeShape.lineTo(3.5, 0.3);
            bladeShape.quadraticCurveTo(2.0, 1.1, 0, 0.3);
            bladeShape.lineTo(0, 0);
            
            const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, { 
                depth: 3.4, 
                bevelEnabled: true, 
                bevelSize: 0.05, 
                bevelThickness: 0.05 
            });
            const blade = new THREE.Mesh(bladeGeom, polishedWood);
            
            blade.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 7.5, -1.7);
            blade.rotation.z = angle + Math.PI/12; 
            
            // Blade support brackets
            const bladeBracketGeom = new THREE.BoxGeometry(0.4, 0.8, 3.6);
            const bladeBracket = new THREE.Mesh(bladeBracketGeom, darkSteel);
            bladeBracket.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 7.5, 0);
            bladeBracket.rotation.z = angle + Math.PI/12;
            
            wheelGroup.add(blade);
            wheelGroup.add(bladeBracket);
        }
        
        // High-tech accent rings
        const neonRingGeom = new THREE.TorusGeometry(6, 0.08, 32, 128);
        const neonRing = new THREE.Mesh(neonRingGeom, neonGlow);
        neonRing.position.z = isLeft ? 1.8 : -1.8;
        wheelGroup.add(neonRing);
        
        return wheelGroup;
    };

    const leftWheel = createPaddleWheel(true);
    leftWheel.position.set(2, 6, -12);
    group.add(leftWheel);
    meshes.leftWheel = leftWheel;

    const rightWheel = createPaddleWheel(false);
    rightWheel.position.set(2, 6, 12);
    group.add(rightWheel);
    meshes.rightWheel = rightWheel;

    // ==========================================
    // 4. COMPLEX GEARING SYSTEM
    // ==========================================
    const createGear = (radius, teethCount, thickness, material, isBevel = false) => {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85;
        for (let i = 0; i < teethCount * 2; i++) {
            const angle = (i / (teethCount * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : innerRadius;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        
        const extrudeSettings = { 
            depth: thickness, 
            bevelEnabled: true, 
            bevelSegments: 4, 
            steps: 1, 
            bevelSize: 0.1, 
            bevelThickness: 0.1 
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Center hole
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, radius * 0.25, 0, Math.PI * 2, false);
        shape.holes.push(holePath);
        
        const mesh = new THREE.Mesh(geometry, material);
        geometry.computeBoundingBox();
        const zOffset = -0.5 * thickness;
        geometry.translate(0, 0, zOffset);

        // Add geometric spokes if the gear is large enough
        if (radius > 2) {
            for(let s=0; s<6; s++) {
                const sAngle = (s/6)*Math.PI*2;
                const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, radius*0.8, 16), material);
                sp.position.set(Math.cos(sAngle)*(radius*0.4), Math.sin(sAngle)*(radius*0.4), 0);
                sp.rotation.z = sAngle + Math.PI/2;
                mesh.add(sp);
            }
        }
        
        return mesh;
    };

    // Main drive gears on the main axle
    const mainDriveGear1 = createGear(4, 32, 1.2, chrome);
    mainDriveGear1.position.set(2, 6, -7);
    mainDriveGear1.rotation.x = Math.PI / 2;
    group.add(mainDriveGear1);
    meshes.mainDriveGear1 = mainDriveGear1;

    const mainDriveGear2 = createGear(4, 32, 1.2, chrome);
    mainDriveGear2.position.set(2, 6, 7);
    mainDriveGear2.rotation.x = Math.PI / 2;
    group.add(mainDriveGear2);
    meshes.mainDriveGear2 = mainDriveGear2;

    // ==========================================
    // 5. TREADWHEEL (HUMAN ENGINE + SCI-FI CORE)
    // ==========================================
    const treadWheelGroup = new THREE.Group();
    
    // Large drum structure for people to walk inside
    const treadDrumGeom = new THREE.CylinderGeometry(10, 10, 8, 128, 1, true);
    const treadDrum = new THREE.Mesh(treadDrumGeom, polishedWood);
    treadDrum.rotation.x = Math.PI / 2;
    treadDrum.material.side = THREE.DoubleSide;
    treadWheelGroup.add(treadDrum);
    
    // External structural rings
    const drumRing = new THREE.TorusGeometry(10.1, 0.2, 16, 128);
    const dRing1 = new THREE.Mesh(drumRing, darkSteel);
    dRing1.position.z = -3.8;
    const dRing2 = new THREE.Mesh(drumRing, darkSteel);
    dRing2.position.z = 3.8;
    const dRing3 = new THREE.Mesh(drumRing, copper);
    dRing3.position.z = 0;
    treadWheelGroup.add(dRing1);
    treadWheelGroup.add(dRing2);
    treadWheelGroup.add(dRing3);

    // Slats on the tread wheel (for footing)
    const slatsGroup = new THREE.Group();
    for (let i = 0; i < 90; i++) {
        const slatGeom = new THREE.BoxGeometry(0.4, 0.2, 8.2);
        const slat = new THREE.Mesh(slatGeom, woodMaterial);
        const angle = (i / 90) * Math.PI * 2;
        slat.position.set(Math.cos(angle) * 9.9, Math.sin(angle) * 9.9, 0);
        slat.rotation.z = angle;
        slatsGroup.add(slat);
    }
    treadWheelGroup.add(slatsGroup);
    
    // Complex internal spokes for tread wheel
    for(let j=-1; j<=1; j+=2) {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const spokeGeom = new THREE.CylinderGeometry(0.3, 0.1, 9.8, 32);
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.position.set(Math.cos(angle) * 4.9, Math.sin(angle) * 4.9, j * 3.8);
            spoke.rotation.z = angle + Math.PI/2;
            treadWheelGroup.add(spoke);
        }
    }
    
    // HIGH-TECH INTERNAL CORE (Leonardo's secret zero-point energy source)
    const coreGroup = new THREE.Group();
    const coreGeom = new THREE.IcosahedronGeometry(2, 2);
    const core = new THREE.Mesh(coreGeom, energyCoreMat);
    coreGroup.add(core);

    const outerCoreGeom = new THREE.IcosahedronGeometry(2.5, 1);
    const outerCore = new THREE.Mesh(outerCoreGeom, new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true}));
    coreGroup.add(outerCore);

    const coreRings = new THREE.TorusGeometry(3.5, 0.1, 16, 64);
    const cRing1 = new THREE.Mesh(coreRings, neonGlow);
    cRing1.rotation.x = Math.PI/2;
    coreGroup.add(cRing1);
    const cRing2 = new THREE.Mesh(coreRings, neonGlow);
    cRing2.rotation.y = Math.PI/2;
    coreGroup.add(cRing2);

    meshes.core = core;
    meshes.outerCore = outerCore;
    meshes.cRing1 = cRing1;
    meshes.cRing2 = cRing2;
    treadWheelGroup.add(coreGroup);

    // Treadwheel Axle
    const treadAxleGeom = new THREE.CylinderGeometry(1.2, 1.2, 18, 64);
    const treadAxle = new THREE.Mesh(treadAxleGeom, copper);
    treadAxle.rotation.x = Math.PI / 2;
    treadWheelGroup.add(treadAxle);

    treadWheelGroup.position.set(-10, 10, 0);
    group.add(treadWheelGroup);
    meshes.treadWheel = treadWheelGroup;

    // Pinion Gears connecting treadwheel to main axle
    const interShaftGeom = new THREE.CylinderGeometry(0.6, 0.6, 22, 64);
    const interShaft = new THREE.Mesh(interShaftGeom, steel);
    interShaft.position.set(-4, 7.5, 0);
    interShaft.rotation.x = Math.PI / 2;
    group.add(interShaft);
    meshes.interShaft = interShaft;

    const interGear1 = createGear(2.5, 20, 0.8, copper);
    interGear1.position.set(-4, 7.5, -7);
    interGear1.rotation.x = Math.PI / 2;
    group.add(interGear1);
    meshes.interGear1 = interGear1;
    
    const interGear2 = createGear(2.5, 20, 0.8, copper);
    interGear2.position.set(-4, 7.5, 7);
    interGear2.rotation.x = Math.PI / 2;
    group.add(interGear2);
    meshes.interGear2 = interGear2;

    const treadGear = createGear(5.5, 44, 1.2, darkSteel);
    treadGear.position.set(-10, 10, -7);
    treadGear.rotation.x = Math.PI / 2;
    group.add(treadGear);
    meshes.treadGear = treadGear;

    const treadGear2 = createGear(5.5, 44, 1.2, darkSteel);
    treadGear2.position.set(-10, 10, 7);
    treadGear2.rotation.x = Math.PI / 2;
    group.add(treadGear2);
    meshes.treadGear2 = treadGear2;

    // ==========================================
    // 6. HYDRAULIC & PNEUMATIC SYSTEMS
    // ==========================================
    const createHydraulicPiston = (x, y, z, rotZ) => {
        const pistonGrp = new THREE.Group();
        
        // Base Mount
        const mount = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), darkSteel);
        mount.position.y = -2;
        pistonGrp.add(mount);

        // Outer Cylinder
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6, 32), copper);
        cylinder.position.y = 1;
        pistonGrp.add(cylinder);

        // Cylinder details
        const cRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, 16, 32), chrome);
        cRing.position.y = 3.5;
        cRing.rotation.x = Math.PI/2;
        pistonGrp.add(cRing);

        // Inner Rod
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 8, 32), chrome);
        rod.position.y = 4;
        pistonGrp.add(rod);

        // Top joint
        const joint = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), steel);
        joint.position.y = 8;
        rod.add(joint);

        pistonGrp.position.set(x, y, z);
        pistonGrp.rotation.z = rotZ;

        return { group: pistonGrp, rod: rod };
    };

    const piston1 = createHydraulicPiston(-18, 1, -4, -Math.PI / 5);
    group.add(piston1.group);
    meshes.pistonRod1 = piston1.rod;

    const piston2 = createHydraulicPiston(-18, 1, 4, -Math.PI / 5);
    group.add(piston2.group);
    meshes.pistonRod2 = piston2.rod;

    // Intricate network of hydraulic lines (TubeGeometry)
    const createPipe = (points, radius, mat) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const pipeGeom = new THREE.TubeGeometry(curve, 64, radius, 16, false);
        return new THREE.Mesh(pipeGeom, mat);
    };

    const pipe1 = createPipe([
        new THREE.Vector3(-18, 3, -4),
        new THREE.Vector3(-20, 5, -5),
        new THREE.Vector3(-16, 12, -2),
        new THREE.Vector3(-10, 10, 0)
    ], 0.3, copper);
    group.add(pipe1);

    const pipe2 = createPipe([
        new THREE.Vector3(-18, 3, 4),
        new THREE.Vector3(-20, 5, 5),
        new THREE.Vector3(-16, 12, 2),
        new THREE.Vector3(-10, 10, 0)
    ], 0.3, copper);
    group.add(pipe2);

    const glowingPipe1 = createPipe([
        new THREE.Vector3(-10, 10, 0),
        new THREE.Vector3(-8, 14, 3),
        new THREE.Vector3(-2, 10, 6)
    ], 0.2, neonGlow);
    group.add(glowingPipe1);

    // ==========================================
    // 7. OPERATOR CABIN & CONTROLS
    // ==========================================
    const cabinGroup = new THREE.Group();

    // Deck Platform
    const deckShape = new THREE.Shape();
    deckShape.moveTo(0, 0);
    deckShape.lineTo(10, 0);
    deckShape.lineTo(12, 8);
    deckShape.lineTo(-2, 8);
    deckShape.lineTo(0, 0);
    const deckGeom = new THREE.ExtrudeGeometry(deckShape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.1 });
    const deck = new THREE.Mesh(deckGeom, woodMaterial);
    deck.rotation.x = -Math.PI/2;
    deck.position.set(-26, 8, 4);
    cabinGroup.add(deck);

    // Railings for the deck
    const railingMaterial = steel;
    for(let i=0; i<=5; i++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 16), railingMaterial);
        post.position.set(-25.5 + i*2, 9, 3.5);
        cabinGroup.add(post);
        const postBack = post.clone();
        postBack.position.set(-25.5 + i*2, 9, -3.5);
        cabinGroup.add(postBack);
    }
    const topRail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 11, 16), railingMaterial);
    topRail1.rotation.z = Math.PI/2;
    topRail1.position.set(-20.5, 10, 3.5);
    cabinGroup.add(topRail1);
    
    const topRail2 = topRail1.clone();
    topRail2.position.set(-20.5, 10, -3.5);
    cabinGroup.add(topRail2);

    // Operator Console
    const consoleGeom = new THREE.BoxGeometry(2.5, 3, 4);
    const consoleConsole = new THREE.Mesh(consoleGeom, darkSteel);
    consoleConsole.position.set(-23, 9.5, 0);
    cabinGroup.add(consoleConsole);

    // Holographic/Tinted Screens
    const screenGeom = new THREE.PlaneGeometry(2, 1.5);
    const screenMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00cc00, emissiveIntensity: 1.5, side: THREE.DoubleSide, transparent: true, opacity: 0.7});
    const screen1 = new THREE.Mesh(screenGeom, screenMat);
    screen1.position.set(-21.6, 11.5, 1);
    screen1.rotation.y = Math.PI / 6;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(screenGeom, screenMat);
    screen2.position.set(-21.6, 11.5, -1);
    screen2.rotation.y = -Math.PI / 6;
    cabinGroup.add(screen2);

    // Joysticks
    const createJoystick = (zPos) => {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.5, 16), chrome);
        base.position.set(-22, 11, zPos);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16), steel);
        stick.position.set(0, 0.8, 0);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), redGlow);
        knob.position.set(0, 0.8, 0);
        stick.add(knob);
        
        const pivot = new THREE.Group();
        pivot.position.set(-22, 11.2, zPos);
        pivot.add(stick);
        
        cabinGroup.add(base);
        cabinGroup.add(pivot);
        return pivot;
    };

    meshes.joyLeft = createJoystick(1);
    meshes.joyRight = createJoystick(-1);

    // Engine exhaust stacks
    const stackGeom = new THREE.CylinderGeometry(0.8, 1.0, 8, 32);
    const stack1 = new THREE.Mesh(stackGeom, darkSteel);
    stack1.position.set(-16, 12, 6);
    cabinGroup.add(stack1);

    const stack2 = new THREE.Mesh(stackGeom, darkSteel);
    stack2.position.set(-16, 12, -6);
    cabinGroup.add(stack2);

    group.add(cabinGroup);

    // ==========================================
    // 8. PARTS ARRAY
    // ==========================================
    parts.push(
        {
            name: "Reinforced Keel & Hull",
            description: "The primary structural spine of the ship, combining heavy timber and dark steel plating.",
            material: "Dark Steel & Wood",
            function: "Provides buoyancy and foundational support.",
            assemblyOrder: 1,
            connections: ["Thrusters", "Deck", "Pistons"],
            failureEffect: "Vessel sinks to the bottom.",
            cascadeFailures: ["Complete systemic failure"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: -15, z: 0}
        },
        {
            name: "Starboard Paddle Wheel",
            description: "A massive, hyper-detailed wheel with curved wooden blades and neon accents.",
            material: "Wood, Steel, Neon",
            function: "Propels the boat forward via water displacement.",
            assemblyOrder: 5,
            connections: ["Main Drive Axle"],
            failureEffect: "Boat pulls violently to port.",
            cascadeFailures: ["Main Axle overload", "Gear stripping"],
            originalPosition: {x: 2, y: 6, z: 12},
            explodedPosition: {x: 2, y: 6, z: 30}
        },
        {
            name: "Port Paddle Wheel",
            description: "A massive, hyper-detailed wheel with curved wooden blades and neon accents.",
            material: "Wood, Steel, Neon",
            function: "Propels the boat forward via water displacement.",
            assemblyOrder: 6,
            connections: ["Main Drive Axle"],
            failureEffect: "Boat pulls violently to starboard.",
            cascadeFailures: ["Main Axle overload", "Gear stripping"],
            originalPosition: {x: 2, y: 6, z: -12},
            explodedPosition: {x: 2, y: 6, z: -30}
        },
        {
            name: "Main Drive Axle",
            description: "Thick steel shaft linking the drive gears to the paddle wheels.",
            material: "Solid Steel",
            function: "Transfers rotational torque.",
            assemblyOrder: 4,
            connections: ["Paddle Wheels", "Drive Gears"],
            failureEffect: "Loss of all forward propulsion.",
            cascadeFailures: ["Engine over-revving"],
            originalPosition: {x: 2, y: 6, z: 0},
            explodedPosition: {x: 2, y: 20, z: 0}
        },
        {
            name: "Treadwheel Drum",
            description: "Enormous wooden drum where crew walks to generate primary kinetic energy.",
            material: "Polished Wood & Steel",
            function: "Kinetic energy generator.",
            assemblyOrder: 2,
            connections: ["Tread Axle", "Energy Core"],
            failureEffect: "Kinetic input drops to zero.",
            cascadeFailures: ["Core instability"],
            originalPosition: {x: -10, y: 10, z: 0},
            explodedPosition: {x: -10, y: 25, z: 0}
        },
        {
            name: "Zero-Point Energy Core",
            description: "Leonardo's secret glowing orb, stabilized within an icosahedron cage.",
            material: "Neon Emissive & Chrome",
            function: "Multiplies human kinetic energy tenfold.",
            assemblyOrder: 3,
            connections: ["Treadwheel Drum", "Energy Pipes"],
            failureEffect: "Catastrophic plasma release.",
            cascadeFailures: ["Vessel vaporization"],
            originalPosition: {x: -10, y: 10, z: 0},
            explodedPosition: {x: -30, y: 35, z: 0}
        },
        {
            name: "Starboard Tread Gear",
            description: "Giant 44-tooth gear attached to the treadwheel.",
            material: "Dark Steel",
            function: "Initial stage of RPM step-up.",
            assemblyOrder: 7,
            connections: ["Tread Axle", "Intermediate Gear 1"],
            failureEffect: "Gearing jams instantly.",
            cascadeFailures: ["Shaft snapping", "Treadwheel derailment"],
            originalPosition: {x: -10, y: 10, z: 7},
            explodedPosition: {x: -10, y: 10, z: 20}
        },
        {
            name: "Port Tread Gear",
            description: "Giant 44-tooth gear attached to the treadwheel.",
            material: "Dark Steel",
            function: "Initial stage of RPM step-up.",
            assemblyOrder: 8,
            connections: ["Tread Axle", "Intermediate Gear 2"],
            failureEffect: "Gearing jams instantly.",
            cascadeFailures: ["Shaft snapping", "Treadwheel derailment"],
            originalPosition: {x: -10, y: 10, z: -7},
            explodedPosition: {x: -10, y: 10, z: -20}
        },
        {
            name: "Intermediate Shaft",
            description: "Transfers motion between tread gears and main drive.",
            material: "Steel",
            function: "Torque equalization and RPM step-up.",
            assemblyOrder: 9,
            connections: ["Tread Gears", "Main Drive Gears"],
            failureEffect: "Disconnects engine from paddles.",
            cascadeFailures: ["None"],
            originalPosition: {x: -4, y: 7.5, z: 0},
            explodedPosition: {x: -4, y: -8, z: 0}
        },
        {
            name: "Starboard Drive Gear",
            description: "Final drive gear on main axle, taking input from intermediate shaft.",
            material: "Chrome",
            function: "Drives the main axle.",
            assemblyOrder: 10,
            connections: ["Intermediate Shaft"],
            failureEffect: "Paddle wheel stops.",
            cascadeFailures: ["Asymmetric thrust"],
            originalPosition: {x: 2, y: 6, z: 7},
            explodedPosition: {x: 15, y: 6, z: 7}
        },
        {
            name: "Port Drive Gear",
            description: "Final drive gear on main axle, taking input from intermediate shaft.",
            material: "Chrome",
            function: "Drives the main axle.",
            assemblyOrder: 11,
            connections: ["Intermediate Shaft"],
            failureEffect: "Paddle wheel stops.",
            cascadeFailures: ["Asymmetric thrust"],
            originalPosition: {x: 2, y: 6, z: -7},
            explodedPosition: {x: 15, y: 6, z: -7}
        },
        {
            name: "Hydraulic Dampening Pistons",
            description: "Heavy steam-powered assist pistons.",
            material: "Chrome & Copper",
            function: "Stabilizes treadwheel RPM and absorbs shock.",
            assemblyOrder: 12,
            connections: ["Hull", "Energy Core Pipes"],
            failureEffect: "Violent jerky motion in wheels.",
            cascadeFailures: ["Gear tooth stripping"],
            originalPosition: {x: -18, y: 1, z: 0},
            explodedPosition: {x: -25, y: -5, z: -15}
        },
        {
            name: "Energy Transfer Piping",
            description: "Network of copper and neon piping routing mysterious energy.",
            material: "Copper & Neon",
            function: "Cools the energy core and powers electronics.",
            assemblyOrder: 13,
            connections: ["Core", "Pistons", "Console"],
            failureEffect: "Core meltdown sequence initiates.",
            cascadeFailures: ["Total destruction"],
            originalPosition: {x: -16, y: 8, z: 0},
            explodedPosition: {x: -16, y: 20, z: -10}
        },
        {
            name: "Operator Command Deck",
            description: "Elevated wooden platform for the machine overseer.",
            material: "Wood & Steel Railings",
            function: "Command station providing full visibility.",
            assemblyOrder: 14,
            connections: ["Hull", "Console"],
            failureEffect: "Operator is exposed to elements/falls.",
            cascadeFailures: ["Loss of vehicular control"],
            originalPosition: {x: -26, y: 8, z: 0},
            explodedPosition: {x: -40, y: 8, z: 0}
        },
        {
            name: "Holographic Control Console",
            description: "Advanced steering and throttle control with glowing panels.",
            material: "Dark Steel, Chrome, Glass",
            function: "Modulates gear engagement and core output.",
            assemblyOrder: 15,
            connections: ["Deck", "Energy Pipes"],
            failureEffect: "Controls locked at maximum output.",
            cascadeFailures: ["Engine runaway", "Hull breach"],
            originalPosition: {x: -23, y: 9.5, z: 0},
            explodedPosition: {x: -23, y: 18, z: 0}
        }
    );

    // ==========================================
    // 9. QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the enormous treadwheel drum in this Da Vinci design?",
            options: ["To store cargo and ammunition", "To provide human-powered rotational energy", "To filter water from the hull", "To act as a gyroscopic stabilizer"],
            correctAnswer: 1,
            explanation: "The treadwheel was originally designed by Da Vinci for men to walk inside, acting as a human engine to rotate the central axis."
        },
        {
            question: "Why are the paddle wheel blades curved rather than perfectly flat?",
            options: ["Purely for aesthetic appeal", "To scoop water more efficiently and reduce exit splash", "To increase the overall weight of the wheel", "To flex under extreme pressure"],
            correctAnswer: 1,
            explanation: "Curved blades catch the water smoothly and release it with less turbulence, significantly improving thrust efficiency compared to flat boards."
        },
        {
            question: "What mechanical component is used to change the rotational speed from the treadwheel to the paddle wheels?",
            options: ["Hydraulic pump array", "Gearing system (Tread Gears & Drive Gears)", "Elastic band transmission", "Magnetic levitation pulleys"],
            correctAnswer: 1,
            explanation: "The massive interlocking gears with different radii step up (increase) the RPM transferred from the slow-moving treadwheel to the faster main paddle wheel axle."
        },
        {
            question: "In this high-tech reimagining, what purpose do the massive hydraulic pistons serve?",
            options: ["They are just decorative exhaust pipes", "To provide steam-assist and stabilize the RPM", "To fire projectiles at enemy ships", "To physically push the boat along the riverbed"],
            correctAnswer: 1,
            explanation: "The pistons act as a mechanical buffer and assist mechanism, ensuring the large drum spins smoothly without jerking the gears."
        },
        {
            question: "What happens if one of the final drive gears fails while the other continues operating?",
            options: ["The boat immediately speeds up to compensate", "The boat experiences asymmetric thrust and spins in circles", "The engine immediately initiates an emergency stop", "The hull breaches from the pressure difference"],
            correctAnswer: 1,
            explanation: "Losing propulsion on one side while the other remains active causes the working paddle wheel to push the boat into a continuous, uncontrollable turn."
        }
    ];

    const description = "A colossal, hyper-realistic, and highly advanced re-imagining of Leonardo da Vinci's paddle boat. It features an enormous human-powered treadwheel infused with a mysterious glowing Zero-Point energy core. This core transfers massive torque through a complex, multi-stage gearing system to giant, intricately detailed curved-blade paddle wheels, merging Renaissance engineering with futuristic sci-fi tech.";

    // ==========================================
    // 10. ANIMATION LOOP
    // ==========================================
    const animate = (time, speed, meshes) => {
        // Base rotation speed multiplier
        const tSpeed = time * speed * 3.0;
        
        // 1. Treadwheel rotates (Slow, heavy input)
        meshes.treadWheel.rotation.z = -tSpeed * 0.4;
        meshes.treadGear.rotation.z = -tSpeed * 0.4;
        meshes.treadGear2.rotation.z = -tSpeed * 0.4;

        // 2. Intermediate shaft rotates faster (gear ratio 44/20 = 2.2x)
        const interSpeed = tSpeed * 0.88;
        meshes.interShaft.rotation.z = interSpeed;
        meshes.interGear1.rotation.z = interSpeed;
        meshes.interGear2.rotation.z = interSpeed;

        // 3. Main axle rotates (gear ratio 20/32 = 0.625x of intermediate, overall ~1.375x of treadwheel)
        const mainAxleSpeed = -interSpeed * 0.625;
        meshes.mainAxle.rotation.z = mainAxleSpeed;
        meshes.mainDriveGear1.rotation.z = mainAxleSpeed;
        meshes.mainDriveGear2.rotation.z = mainAxleSpeed;
        meshes.leftWheel.rotation.z = mainAxleSpeed;
        meshes.rightWheel.rotation.z = mainAxleSpeed;

        // 4. Energy Core pulsating and spinning intricately
        const pulse = 1 + Math.sin(time * speed * 8) * 0.15;
        meshes.core.scale.set(pulse, pulse, pulse);
        meshes.outerCore.rotation.x += speed * 0.08;
        meshes.outerCore.rotation.y += speed * 0.12;
        meshes.cRing1.rotation.y += speed * 0.2;
        meshes.cRing2.rotation.x -= speed * 0.2;

        // 5. Hydraulic Pistons actuating in sync with the treadwheel
        // We use sine wave based on treadwheel rotation to simulate piston pumping
        const pistonExt = Math.sin(tSpeed * 0.4 * 4) * 2; 
        meshes.pistonRod1.position.y = 4 + pistonExt;
        meshes.pistonRod2.position.y = 4 + pistonExt;
        
        // 6. Joysticks vibrating / operator simulation
        const vibe = Math.sin(time * speed * 30) * 0.05 * speed;
        meshes.joyLeft.rotation.x = vibe;
        meshes.joyLeft.rotation.z = Math.sin(time * speed * 2) * 0.2;
        meshes.joyRight.rotation.x = -vibe;
        meshes.joyRight.rotation.z = Math.cos(time * speed * 2.5) * 0.2;
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPaddleBoatMechanism() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
