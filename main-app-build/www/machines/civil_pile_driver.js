import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted, neonBlue, neonRed, neonGreen } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Civil_Pile_Driver";

    const meshes = {};
    const parts = [];

    // Utility to create complex geometries
    function createBolt(x, y, z, rotX, rotY, rotZ, scale) {
        const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 6);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(x, y, z);
        bolt.rotation.set(rotX, rotY, rotZ);
        bolt.scale.set(scale, scale, scale);
        return bolt;
    }

    // --- 1. Track Frame (Base Chassis) ---
    const chassisGroup = new THREE.Group();
    chassisGroup.position.set(0, 1.5, 0);
    
    // Main body of chassis
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-3, -0.5);
    chassisShape.lineTo(3, -0.5);
    chassisShape.lineTo(3, 0.5);
    chassisShape.lineTo(2, 1);
    chassisShape.lineTo(-2, 1);
    chassisShape.lineTo(-3, 0.5);
    chassisShape.lineTo(-3, -0.5);
    
    const chassisExtrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    chassisGeo.translate(0, 0, -2);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisGroup.add(chassisMesh);

    // Add glowing trim to chassis
    const chassisTrimGeo = new THREE.BoxGeometry(6.2, 0.1, 4.2);
    const chassisTrim = new THREE.Mesh(chassisTrimGeo, neonBlue);
    chassisTrim.position.set(0, 0, 0);
    chassisGroup.add(chassisTrim);

    parts.push({
        name: "Base Chassis",
        description: "Heavy reinforced lower frame providing immense stability for the pile driver.",
        material: "Dark Steel / Neon Trim",
        function: "Structural foundation and rotation mount for the upper carriage.",
        assemblyOrder: 1,
        connections: ["Track System", "Slewing Ring"],
        failureEffect: "Machine instability and potential collapse under load.",
        cascadeFailures: ["Slewing Ring", "Track System"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // --- 2. Track System (Crawlers) ---
    const trackSystemGroup = new THREE.Group();
    const trackWidth = 0.8;
    const trackLength = 8;
    const trackHeight = 1.6;

    for (let side of [-1, 1]) {
        const sideGroup = new THREE.Group();
        const zPos = side * 2.8;
        
        // Track frame
        const frameGeo = new THREE.BoxGeometry(trackLength - 1, trackHeight - 0.4, trackWidth - 0.2);
        const frame = new THREE.Mesh(frameGeo, darkSteel);
        sideGroup.add(frame);
        
        // Drive sprockets and idlers
        const sprocketGeo = new THREE.CylinderGeometry(trackHeight/2, trackHeight/2, trackWidth, 32);
        const sprocketFront = new THREE.Mesh(sprocketGeo, steel);
        sprocketFront.rotation.x = Math.PI / 2;
        sprocketFront.position.set(trackLength/2 - trackHeight/2, 0, 0);
        sideGroup.add(sprocketFront);
        
        const sprocketBack = new THREE.Mesh(sprocketGeo, steel);
        sprocketBack.rotation.x = Math.PI / 2;
        sprocketBack.position.set(-trackLength/2 + trackHeight/2, 0, 0);
        sideGroup.add(sprocketBack);

        // Crawler links
        const linkGroup = new THREE.Group();
        const numLinks = 40;
        const linkGeo = new THREE.BoxGeometry(0.3, 0.1, trackWidth + 0.1);
        const lugGeo = new THREE.BoxGeometry(0.05, 0.15, trackWidth + 0.1);
        lugGeo.translate(0, 0.075, 0);
        
        for(let i=0; i<numLinks; i++) {
            const t = i / numLinks;
            const singleLink = new THREE.Group();
            const linkM = new THREE.Mesh(linkGeo, rubber);
            const lugM = new THREE.Mesh(lugGeo, steel);
            singleLink.add(linkM);
            singleLink.add(lugM);
            
            // Path math for track oval
            const radius = trackHeight / 2;
            const straightLen = trackLength - trackHeight;
            const curveLen = Math.PI * radius;
            const totalLen = 2 * straightLen + 2 * curveLen;
            const dist = t * totalLen;
            
            let lx = 0, ly = 0, lrot = 0;
            
            if (dist < straightLen) { // top straight
                lx = -straightLen/2 + dist;
                ly = radius;
                lrot = 0;
            } else if (dist < straightLen + curveLen) { // front curve
                const cDist = dist - straightLen;
                const ang = -cDist / radius + Math.PI/2;
                lx = straightLen/2 + radius * Math.cos(ang);
                ly = radius * Math.sin(ang);
                lrot = -ang + Math.PI/2;
            } else if (dist < 2*straightLen + curveLen) { // bottom straight
                const sDist = dist - straightLen - curveLen;
                lx = straightLen/2 - sDist;
                ly = -radius;
                lrot = Math.PI;
            } else { // back curve
                const cDist = dist - 2*straightLen - curveLen;
                const ang = -cDist / radius - Math.PI/2;
                lx = -straightLen/2 + radius * Math.cos(ang);
                ly = radius * Math.sin(ang);
                lrot = -ang + Math.PI/2;
            }
            
            singleLink.position.set(lx, ly, 0);
            singleLink.rotation.z = lrot;
            linkGroup.add(singleLink);
        }
        meshes[`track_${side > 0 ? 'left' : 'right'}_links`] = linkGroup;
        sideGroup.add(linkGroup);
        
        sideGroup.position.set(0, 0, zPos);
        trackSystemGroup.add(sideGroup);
    }
    
    trackSystemGroup.position.set(0, trackHeight/2, 0);
    group.add(trackSystemGroup);
    group.add(chassisGroup);
    
    parts.push({
        name: "Crawler Track System",
        description: "Heavy-duty continuous track mechanism with individual steel/rubber links and multi-point suspension.",
        material: "Steel / Rubber",
        function: "Locomotion and weight distribution across varied civil terrain.",
        assemblyOrder: 2,
        connections: ["Base Chassis", "Hydraulic Drive Motors"],
        failureEffect: "Loss of mobility, sinking into soft ground.",
        cascadeFailures: ["Drive Sprockets"],
        originalPosition: {x: 0, y: 0.8, z: 0},
        explodedPosition: {x: 0, y: 0, z: 5}
    });

    // --- 3. Slewing Ring & Rotary Drive ---
    const slewingGroup = new THREE.Group();
    slewingGroup.position.set(0, 2.7, 0);
    
    const slewGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 64);
    const slewMesh = new THREE.Mesh(slewGeo, chrome);
    
    // Add gear teeth around slewing ring
    const teethGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const teethCount = 72;
    for(let i=0; i<teethCount; i++) {
        const tooth = new THREE.Mesh(teethGeo, steel);
        const ang = (i / teethCount) * Math.PI * 2;
        tooth.position.set(1.5 * Math.cos(ang), 0, 1.5 * Math.sin(ang));
        tooth.rotation.y = -ang;
        slewMesh.add(tooth);
    }
    slewingGroup.add(slewMesh);
    group.add(slewingGroup);
    meshes.slewingRing = slewingGroup;

    parts.push({
        name: "Slewing Ring Gear",
        description: "Massive ball-bearing gear ring allowing 360-degree continuous rotation of the upper carriage.",
        material: "Chrome / Steel",
        function: "Rotates the entire upper assembly.",
        assemblyOrder: 3,
        connections: ["Base Chassis", "Upper Carriage"],
        failureEffect: "Inability to turn the machine, severe operational restriction.",
        cascadeFailures: ["Slew Motors"],
        originalPosition: {x: 0, y: 2.7, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // --- 4. Upper Carriage ---
    const upperCarriage = new THREE.Group();
    upperCarriage.position.set(0, 3.1, 0);
    meshes.upperCarriage = upperCarriage;
    group.add(upperCarriage);

    const carriageShape = new THREE.Shape();
    carriageShape.moveTo(-4, -2);
    carriageShape.lineTo(2, -2);
    carriageShape.lineTo(3, 0);
    carriageShape.lineTo(2, 2);
    carriageShape.lineTo(-4, 2);
    carriageShape.lineTo(-5, 0);
    carriageShape.lineTo(-4, -2);
    
    const carriageGeo = new THREE.ExtrudeGeometry(carriageShape, { depth: 1, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
    carriageGeo.rotateX(Math.PI/2);
    carriageGeo.translate(0, 0.5, 0);
    const carriageMesh = new THREE.Mesh(carriageGeo, darkSteel);
    upperCarriage.add(carriageMesh);

    parts.push({
        name: "Upper Carriage Deck",
        description: "Rotatable platform housing the engine, counterweights, cabin, and winch systems.",
        material: "Dark Steel",
        function: "Main support deck for all upper components.",
        assemblyOrder: 4,
        connections: ["Slewing Ring", "Power Plant", "Cabin", "Counterweights"],
        failureEffect: "Catastrophic structural failure of upper assembly.",
        cascadeFailures: ["Everything on upper carriage"],
        originalPosition: {x: 0, y: 3.1, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // --- 5. Power Plant & Counterweight ---
    const engineGroup = new THREE.Group();
    engineGroup.position.set(-2.5, 1.5, 0);
    
    const engineGeo = new THREE.BoxGeometry(3, 2, 3.5);
    const engineMesh = new THREE.Mesh(engineGeo, steel);
    engineGroup.add(engineMesh);
    
    const grilleGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const grille1 = new THREE.Mesh(grilleGeo, chrome);
    grille1.rotation.y = -Math.PI/2;
    grille1.position.set(-1.51, 0, -0.9);
    engineGroup.add(grille1);
    
    const grille2 = new THREE.Mesh(grilleGeo, chrome);
    grille2.rotation.y = -Math.PI/2;
    grille2.position.set(-1.51, 0, 0.9);
    engineGroup.add(grille2);
    
    const exhaustGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    const exhaust1 = new THREE.Mesh(exhaustGeo, chrome);
    exhaust1.position.set(-0.5, 2, -1);
    engineGroup.add(exhaust1);
    const exhaust2 = new THREE.Mesh(exhaustGeo, chrome);
    exhaust2.position.set(-0.5, 2, 1);
    engineGroup.add(exhaust2);

    const cwGeo = new THREE.BoxGeometry(1.5, 2.5, 4);
    const cwMesh = new THREE.Mesh(cwGeo, darkSteel);
    cwMesh.position.set(-1.5, 0, 0);
    engineGroup.add(cwMesh);

    for (let i=0; i<6; i++) {
        const cylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
        const cyl1 = new THREE.Mesh(cylinderGeo, neonRed);
        cyl1.position.set(0.5, 1.1, -1.2 + i*0.48);
        engineGroup.add(cyl1);
    }
    
    upperCarriage.add(engineGroup);

    parts.push({
        name: "Turbo-Diesel Power Plant & Counterweight",
        description: "V12 high-output turbo-diesel engine with massive cast iron counterweights.",
        material: "Steel / Chrome",
        function: "Provides hydraulic pressure, electrical power, and counter-balance for the towering lead.",
        assemblyOrder: 5,
        connections: ["Upper Carriage", "Hydraulic Pumps"],
        failureEffect: "Total power loss, machine completely immobilized.",
        cascadeFailures: ["Hydraulics", "Winch Systems"],
        originalPosition: {x: -2.5, y: 4.6, z: 0},
        explodedPosition: {x: -8, y: 5, z: 0}
    });

    // --- 6. Operator Cabin ---
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(1.5, 1.8, 1.2);
    
    const cabinShellGeo = new THREE.BoxGeometry(1.8, 2.4, 1.6);
    const cabinShell = new THREE.Mesh(cabinShellGeo, steel);
    cabinGroup.add(cabinShell);
    
    const windowFrontGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const windowFront = new THREE.Mesh(windowFrontGeo, tinted);
    windowFront.position.set(0.91, 0.2, 0);
    windowFront.rotation.y = Math.PI/2;
    cabinGroup.add(windowFront);

    const windowSideGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const windowSide1 = new THREE.Mesh(windowSideGeo, tinted);
    windowSide1.position.set(0.2, 0.2, 0.81);
    cabinGroup.add(windowSide1);

    const screenGeo = new THREE.PlaneGeometry(0.4, 0.3);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(0.8, 0, 0);
    screenMesh.rotation.y = Math.PI/2;
    cabinGroup.add(screenMesh);
    
    const fopsGeo = new THREE.BoxGeometry(2.0, 0.2, 1.8);
    const fops = new THREE.Mesh(fopsGeo, darkSteel);
    fops.position.set(0, 1.3, 0);
    cabinGroup.add(fops);

    upperCarriage.add(cabinGroup);

    parts.push({
        name: "Command Cabin & FOPS",
        description: "Advanced operator environment with multi-screen digital interface and heavy-duty structural roof guard.",
        material: "Steel / Tinted Glass",
        function: "Protects operator and houses master controls for driving, slewing, and pile driving operations.",
        assemblyOrder: 6,
        connections: ["Upper Carriage", "Control Wiring"],
        failureEffect: "Operator hazard, loss of control systems.",
        cascadeFailures: ["All operations"],
        originalPosition: {x: 1.5, y: 4.9, z: 1.2},
        explodedPosition: {x: 3, y: 7, z: 5}
    });

    // --- 7. Winch Drums ---
    const winchGroup = new THREE.Group();
    winchGroup.position.set(0, 1.5, -1);
    
    const drumGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    
    const drum1 = new THREE.Mesh(drumGeo, darkSteel);
    drum1.rotation.x = Math.PI/2;
    drum1.position.set(0, 0.6, 0);
    
    const cableWrapGeo1 = new THREE.CylinderGeometry(0.42, 0.42, 1.3, 32);
    const cableWrap1 = new THREE.Mesh(cableWrapGeo1, steel);
    cableWrap1.rotation.x = Math.PI/2;
    drum1.add(cableWrap1);
    winchGroup.add(drum1);
    meshes.drum1 = drum1;

    const drum2 = new THREE.Mesh(drumGeo, darkSteel);
    drum2.rotation.x = Math.PI/2;
    drum2.position.set(-1.2, 0.6, 0);
    
    const cableWrap2 = new THREE.Mesh(cableWrapGeo1, steel);
    cableWrap2.rotation.x = Math.PI/2;
    drum2.add(cableWrap2);
    winchGroup.add(drum2);
    meshes.drum2 = drum2;

    upperCarriage.add(winchGroup);

    parts.push({
        name: "Dual Winch System",
        description: "High-torque hydraulic planetary winches for lifting the massive hammer and the piles.",
        material: "Dark Steel / Steel Cables",
        function: "Reeling out and hoisting heavy payloads up the vertical lead.",
        assemblyOrder: 7,
        connections: ["Upper Carriage", "Hydraulic Pumps", "Steel Cables"],
        failureEffect: "Inability to lift hammer or piles.",
        cascadeFailures: ["Hammer System"],
        originalPosition: {x: 0, y: 4.6, z: -1},
        explodedPosition: {x: 0, y: 6, z: -4}
    });

    // --- 8. Mast Base Pivot & A-Frame ---
    const aFrameGroup = new THREE.Group();
    aFrameGroup.position.set(2, 1.0, -1);
    
    const aFrameLegGeo = new THREE.CylinderGeometry(0.15, 0.2, 3, 16);
    const leg1 = new THREE.Mesh(aFrameLegGeo, steel);
    leg1.rotation.z = Math.PI/6;
    leg1.position.set(-0.7, 1.2, 0.8);
    aFrameGroup.add(leg1);
    
    const leg2 = new THREE.Mesh(aFrameLegGeo, steel);
    leg2.rotation.z = Math.PI/6;
    leg2.position.set(-0.7, 1.2, -0.8);
    aFrameGroup.add(leg2);

    const crossBeamGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    const crossBeam = new THREE.Mesh(crossBeamGeo, steel);
    crossBeam.rotation.x = Math.PI/2;
    crossBeam.position.set(0, 2.5, 0);
    aFrameGroup.add(crossBeam);

    upperCarriage.add(aFrameGroup);

    parts.push({
        name: "A-Frame Support",
        description: "Rigid tubular A-Frame structure providing the anchor points for mast tilting hydraulics and backstays.",
        material: "Steel",
        function: "Transfers mast loads back to the chassis and counterweight.",
        assemblyOrder: 8,
        connections: ["Upper Carriage", "Backstay Cylinders"],
        failureEffect: "Mast collapse backwards.",
        cascadeFailures: ["Mast", "Lead"],
        originalPosition: {x: 2, y: 4.1, z: -1},
        explodedPosition: {x: 2, y: 8, z: -4}
    });

    // --- 9. The Vertical Lead (Mast) ---
    const mastGroup = new THREE.Group();
    mastGroup.position.set(2.5, 1.0, 0); 
    
    const mastHeight = 25;
    const latticeGroup = new THREE.Group();
    const cornerGeo = new THREE.CylinderGeometry(0.1, 0.1, mastHeight, 16);
    cornerGeo.translate(0, mastHeight/2, 0);
    
    const c1 = new THREE.Mesh(cornerGeo, steel); c1.position.set(0.4, 0, 0.5); latticeGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, steel); c2.position.set(-0.4, 0, 0.5); latticeGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, steel); c3.position.set(0.4, 0, -0.5); latticeGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, steel); c4.position.set(-0.4, 0, -0.5); latticeGroup.add(c4);
    
    const braceGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
    for(let y=1; y<mastHeight; y+=1.5) {
        const bx1 = new THREE.Mesh(braceGeo, darkSteel); bx1.rotation.z = Math.PI/4; bx1.position.set(0, y, 0.5); latticeGroup.add(bx1);
        const bx2 = new THREE.Mesh(braceGeo, darkSteel); bx2.rotation.z = -Math.PI/4; bx2.position.set(0, y, 0.5); latticeGroup.add(bx2);
        
        const bz1 = new THREE.Mesh(braceGeo, darkSteel); bz1.rotation.x = Math.PI/4; bz1.position.set(0.4, y, 0); latticeGroup.add(bz1);
        const bz2 = new THREE.Mesh(braceGeo, darkSteel); bz2.rotation.x = -Math.PI/4; bz2.position.set(0.4, y, 0); latticeGroup.add(bz2);

        const bz3 = new THREE.Mesh(braceGeo, darkSteel); bz3.rotation.x = Math.PI/4; bz3.position.set(-0.4, y, 0); latticeGroup.add(bz3);
        const bz4 = new THREE.Mesh(braceGeo, darkSteel); bz4.rotation.x = -Math.PI/4; bz4.position.set(-0.4, y, 0); latticeGroup.add(bz4);
    }
    
    const railGeo = new THREE.BoxGeometry(0.1, mastHeight, 0.2);
    railGeo.translate(0, mastHeight/2, 0);
    const rail1 = new THREE.Mesh(railGeo, chrome); rail1.position.set(0.5, 0, 0.3); latticeGroup.add(rail1);
    const rail2 = new THREE.Mesh(railGeo, chrome); rail2.position.set(0.5, 0, -0.3); latticeGroup.add(rail2);

    mastGroup.add(latticeGroup);
    meshes.mastGroup = mastGroup; 
    upperCarriage.add(mastGroup);

    parts.push({
        name: "Lattice Vertical Lead",
        description: "Towering 25-meter steel lattice mast that guides the diesel hammer and pile during driving.",
        material: "Steel / Chrome Rails",
        function: "Main structural guide for vertical alignment of piles and hammer.",
        assemblyOrder: 9,
        connections: ["Mast Base Pivot", "Hammer System", "Cathead"],
        failureEffect: "Buckling of the mast, catastrophic collapse.",
        cascadeFailures: ["Hammer System"],
        originalPosition: {x: 2.5, y: 4.1, z: 0},
        explodedPosition: {x: 10, y: 15, z: 0}
    });

    // --- 10. Mast Tilt Hydraulics (Backstays) ---
    const hydraulicGroup = new THREE.Group();
    
    const cylinderBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    cylinderBaseGeo.translate(0, 2, 0);
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    rodGeo.translate(0, 2, 0);

    const leftHydraulic = new THREE.Group();
    const lCyl = new THREE.Mesh(cylinderBaseGeo, darkSteel);
    const lRod = new THREE.Mesh(rodGeo, chrome);
    lRod.position.set(0, 3, 0);
    leftHydraulic.add(lCyl);
    leftHydraulic.add(lRod);
    leftHydraulic.position.set(2, 2.5, 0.8);
    leftHydraulic.lookAt(new THREE.Vector3(2.5, 8, 0.5)); 
    leftHydraulic.rotateX(Math.PI/2); 

    const rightHydraulic = new THREE.Group();
    const rCyl = new THREE.Mesh(cylinderBaseGeo, darkSteel);
    const rRod = new THREE.Mesh(rodGeo, chrome);
    rRod.position.set(0, 3, 0);
    rightHydraulic.add(rCyl);
    rightHydraulic.add(rRod);
    rightHydraulic.position.set(2, 2.5, -0.8);
    rightHydraulic.lookAt(new THREE.Vector3(2.5, 8, -0.5));
    rightHydraulic.rotateX(Math.PI/2);

    hydraulicGroup.add(leftHydraulic);
    hydraulicGroup.add(rightHydraulic);
    upperCarriage.add(hydraulicGroup);
    meshes.leftHydraulicRod = lRod;
    meshes.rightHydraulicRod = rRod;

    parts.push({
        name: "Backstay Tilt Hydraulics",
        description: "Massive twin hydraulic cylinders for adjusting the vertical batter (tilt) of the lead.",
        material: "Dark Steel / Chrome",
        function: "Controls the angle of the mast for driving battered (angled) piles.",
        assemblyOrder: 10,
        connections: ["A-Frame", "Lattice Lead"],
        failureEffect: "Loss of mast angle control, sudden swing of lead.",
        cascadeFailures: ["Mast"],
        originalPosition: {x: 2, y: 6, z: 0},
        explodedPosition: {x: 5, y: 8, z: 4}
    });

    // --- 11. Cathead & Sheaves ---
    const catheadGroup = new THREE.Group();
    catheadGroup.position.set(0, mastHeight, 0);
    
    const catFrameGeo = new THREE.BoxGeometry(1.2, 1.5, 1.4);
    catFrameGeo.translate(0, 0.75, 0);
    const catFrame = new THREE.Mesh(catFrameGeo, darkSteel);
    catheadGroup.add(catFrame);
    
    const sheaveGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32);
    
    const sheave1 = new THREE.Mesh(sheaveGeo, steel);
    sheave1.rotation.x = Math.PI/2;
    sheave1.position.set(0.6, 1.0, 0.3);
    catheadGroup.add(sheave1);
    meshes.sheave1 = sheave1;

    const sheave2 = new THREE.Mesh(sheaveGeo, steel);
    sheave2.rotation.x = Math.PI/2;
    sheave2.position.set(0.6, 1.0, -0.3);
    catheadGroup.add(sheave2);
    meshes.sheave2 = sheave2;
    
    const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const beacon1 = new THREE.Mesh(beaconGeo, neonRed);
    beacon1.position.set(0.3, 1.6, 0.5);
    catheadGroup.add(beacon1);
    
    mastGroup.add(catheadGroup);

    parts.push({
        name: "Cathead Assembly",
        description: "Top crown assembly containing heavy-duty sheaves for wire rope routing.",
        material: "Dark Steel / Steel",
        function: "Redirects winch cables down the front of the mast to lift the hammer and pile.",
        assemblyOrder: 11,
        connections: ["Mast", "Wire Ropes"],
        failureEffect: "Cable snapping or jamming, dropping payload.",
        cascadeFailures: ["Hammer System"],
        originalPosition: {x: 2.5, y: 4.1 + mastHeight, z: 0},
        explodedPosition: {x: 2.5, y: 4.1 + mastHeight + 5, z: 0}
    });

    // --- 12. Diesel Hammer System ---
    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(0.6, 12, 0); 
    meshes.hammerGroup = hammerGroup;

    const hammerBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    const hammerBody = new THREE.Mesh(hammerBodyGeo, darkSteel);
    hammerGroup.add(hammerBody);
    
    const finGeo = new THREE.TorusGeometry(0.42, 0.05, 8, 32);
    for(let y=-1.5; y<1.5; y+=0.2) {
        const fin = new THREE.Mesh(finGeo, steel);
        fin.position.set(0, y, 0);
        fin.rotation.x = Math.PI/2;
        hammerGroup.add(fin);
    }
    
    const tankGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
    const tank = new THREE.Mesh(tankGeo, chrome);
    tank.position.set(-0.5, 0, 0);
    hammerGroup.add(tank);

    const windowGeo = new THREE.CylinderGeometry(0.41, 0.41, 0.5, 32, 1, false, 0, Math.PI);
    const combWindow = new THREE.Mesh(windowGeo, neonRed); 
    combWindow.position.set(0, -1.8, 0);
    combWindow.rotation.y = -Math.PI/2;
    hammerGroup.add(combWindow);
    meshes.combustionGlow = combWindow;
    
    const clawGeo = new THREE.BoxGeometry(0.2, 0.4, 0.8);
    const clawTop = new THREE.Mesh(clawGeo, steel);
    clawTop.position.set(-0.2, 1.5, 0);
    hammerGroup.add(clawTop);
    
    const clawBot = new THREE.Mesh(clawGeo, steel);
    clawBot.position.set(-0.2, -1.5, 0);
    hammerGroup.add(clawBot);

    const ramGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.5, 32);
    const ramMesh = new THREE.Mesh(ramGeo, chrome);
    ramMesh.position.set(0, 1.5, 0); 
    hammerGroup.add(ramMesh);
    meshes.ramMesh = ramMesh;
    
    mastGroup.add(hammerGroup);

    parts.push({
        name: "Diesel Pile Hammer",
        description: "Massive single-acting diesel combustion hammer. The ram is thrown upward by the explosion, falling back down to strike the anvil.",
        material: "Forged Steel / Chrome",
        function: "Delivers immense kinetic energy impacts to drive piles into dense earth.",
        assemblyOrder: 12,
        connections: ["Mast Rails", "Drive Cap", "Winch Cable"],
        failureEffect: "Misfire, inability to drive piles.",
        cascadeFailures: ["Fuel Injection"],
        originalPosition: {x: 3.1, y: 16.1, z: 0},
        explodedPosition: {x: 7, y: 16, z: 0}
    });

    // --- 13. Drive Cap (Helmet) ---
    const driveCapGroup = new THREE.Group();
    driveCapGroup.position.set(0.6, 9.5, 0); 
    meshes.driveCapGroup = driveCapGroup;

    const helmetGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.6, 32);
    const helmet = new THREE.Mesh(helmetGeo, darkSteel);
    driveCapGroup.add(helmet);
    
    const anvilGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
    const anvil = new THREE.Mesh(anvilGeo, steel);
    anvil.position.set(0, 0.4, 0);
    driveCapGroup.add(anvil);
    
    mastGroup.add(driveCapGroup);

    parts.push({
        name: "Drive Cap & Anvil",
        description: "Intermediary steel block with cushioning material to protect the pile head from being crushed.",
        material: "Dark Steel",
        function: "Transfers the hammer's impact energy evenly into the pile.",
        assemblyOrder: 13,
        connections: ["Hammer", "Pile"],
        failureEffect: "Spalling or shattering of the pile head.",
        cascadeFailures: ["Pile Structural Integrity"],
        originalPosition: {x: 3.1, y: 13.6, z: 0},
        explodedPosition: {x: 7, y: 13, z: -2}
    });

    // --- 14. The Pile ---
    const pileGroup = new THREE.Group();
    pileGroup.position.set(0.6, 4.5, 0); 
    meshes.pileGroup = pileGroup;

    const pileLength = 18;
    const pileGeo = new THREE.BoxGeometry(0.6, pileLength, 0.6);
    const pileMesh = new THREE.Mesh(pileGeo, chrome); 
    pileGroup.add(pileMesh);
    
    for (let p=1; p<pileLength; p++) {
        if(p%2===0) {
            const markerGeo = new THREE.BoxGeometry(0.62, 0.05, 0.62);
            const marker = new THREE.Mesh(markerGeo, neonGreen);
            marker.position.set(0, p - pileLength/2, 0);
            pileGroup.add(marker);
        }
    }

    mastGroup.add(pileGroup);

    parts.push({
        name: "Precast Concrete Pile",
        description: "Heavy reinforced concrete foundation pile driven deep into the bedrock.",
        material: "Concrete / Rebar / Neon Depth Markers",
        function: "Transfers building loads into deep, stable soil layers.",
        assemblyOrder: 14,
        connections: ["Drive Cap", "Earth"],
        failureEffect: "Foundation settlement or collapse.",
        cascadeFailures: [],
        originalPosition: {x: 3.1, y: 8.6, z: 0},
        explodedPosition: {x: 3.1, y: -5, z: 0}
    });

    // --- 15. Ground/Spotter Plates & Hydraulics ---
    const spotterGroup = new THREE.Group();
    spotterGroup.position.set(2, 0.5, 0);
    
    const spotterArmGeo = new THREE.BoxGeometry(2, 0.3, 0.8);
    spotterArmGeo.translate(1, 0, 0);
    const spotterArm = new THREE.Mesh(spotterArmGeo, darkSteel);
    spotterGroup.add(spotterArm);
    
    const spotterCyl = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16);
    const spotterHyd = new THREE.Mesh(spotterCyl, chrome);
    spotterHyd.rotation.z = Math.PI/2;
    spotterHyd.position.set(1, 0.3, 0);
    spotterGroup.add(spotterHyd);

    upperCarriage.add(spotterGroup);

    parts.push({
        name: "Lead Spotter Arm",
        description: "Extendable hydraulic arm connecting the chassis to the base of the mast.",
        material: "Steel / Chrome",
        function: "Pushes or pulls the base of the lead to adjust the driving radius and angle.",
        assemblyOrder: 15,
        connections: ["Upper Carriage", "Mast Base Pivot"],
        failureEffect: "Inability to accurately position the pile over the driving mark.",
        cascadeFailures: ["Mast Alignment"],
        originalPosition: {x: 2, y: 3.6, z: 0},
        explodedPosition: {x: 2, y: 2, z: 5}
    });

    // --- 16. Wire Ropes (Cables) ---
    const cableMat = steel;
    
    const hammerCableGeo = new THREE.CylinderGeometry(0.02, 0.02, mastHeight, 8);
    hammerCableGeo.translate(0, mastHeight/2, 0);
    const hammerCable = new THREE.Mesh(hammerCableGeo, cableMat);
    hammerCable.position.set(0.6, 14, 0.3); 
    mastGroup.add(hammerCable);
    meshes.hammerCable = hammerCable; 

    const backCableGeo = new THREE.CylinderGeometry(0.02, 0.02, mastHeight+5, 8);
    const backCable = new THREE.Mesh(backCableGeo, cableMat);
    backCable.position.set(-1, mastHeight/2, 0.3);
    backCable.rotation.z = Math.PI/12;
    mastGroup.add(backCable);

    parts.push({
        name: "High-Tensile Wire Ropes",
        description: "Thick braided steel cables capable of hoisting massive tonnages without snapping.",
        material: "Braided Steel",
        function: "Transmits winch lifting force to the payloads.",
        assemblyOrder: 16,
        connections: ["Winches", "Cathead", "Hammer"],
        failureEffect: "Snapping cable whips violently, dropping payload instantly.",
        cascadeFailures: ["Cathead", "Hammer"],
        originalPosition: {x: 0, y: 15, z: 0.3},
        explodedPosition: {x: -2, y: 15, z: -3}
    });

    const description = "A massive, hyper-realistic Civil Pile Driver. Featuring a towering lattice mast, an immense single-acting diesel hammer, complex hydraulic backstays, planetary winches, and an intricate crawler track system. Designed for deep foundation engineering, this high-tech machine brings raw kinetic energy and towering scale to any site.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Diesel Pile Hammer's ram?",
            options: [
                "To ignite the fuel mixture and strike the anvil",
                "To rotate the pile into the ground",
                "To cool the engine",
                "To adjust the mast's vertical batter"
            ],
            correctAnswer: 0,
            explanation: "The ram acts as a massive piston. As it falls, it compresses air and fuel, igniting it upon impact with the anvil, which drives the pile and throws the ram back up."
        },
        {
            question: "What component allows the upper carriage of the pile driver to rotate 360 degrees?",
            options: [
                "Slewing Ring Gear",
                "Cathead Assembly",
                "Lead Spotter Arm",
                "A-Frame Support"
            ],
            correctAnswer: 0,
            explanation: "The Slewing Ring is a massive ball-bearing gear connecting the chassis to the upper carriage, allowing full continuous rotation."
        },
        {
            question: "Why does the machine feature massive Backstay Tilt Hydraulics?",
            options: [
                "To drive piles at precise angles (battered piles)",
                "To lift the heavy diesel hammer",
                "To extend the crawler tracks",
                "To start the turbo-diesel engine"
            ],
            correctAnswer: 0,
            explanation: "The hydraulic backstays push or pull the towering mast, allowing piles to be driven at angled 'batters' rather than just straight down."
        },
        {
            question: "What protects the top of the concrete pile from being shattered by the massive hammer impacts?",
            options: [
                "The Drive Cap & Anvil",
                "The Cathead Sheaves",
                "The Crawler Tracks",
                "The FOPS roof"
            ],
            correctAnswer: 0,
            explanation: "The Drive Cap houses a cushion and anvil that evenly distribute the massive kinetic energy of the hammer, preventing the pile head from spalling or crushing."
        },
        {
            question: "What is the purpose of the Cathead at the very top of the mast?",
            options: [
                "It houses sheaves (pulleys) to redirect winch cables down to the payloads",
                "It stores excess diesel fuel for the hammer",
                "It acts as an exhaust stack for the engine",
                "It provides a secondary cabin for operators"
            ],
            correctAnswer: 0,
            explanation: "The Cathead crown assembly holds heavy-duty sheaves that route the wire ropes from the rear winches over the top and down to lift the hammer and piles."
        }
    ];

    let hammerY = 12;
    let ramOffset = 0;
    let pileDepth = 0;
    let trackOffset = 0;

    function animate(time, speed, meshes) {
        meshes.upperCarriage.rotation.y = Math.sin(time * 0.2 * speed) * 0.5;

        meshes.drum1.rotation.y = time * 2 * speed;
        meshes.drum2.rotation.y = time * 0.5 * speed;

        meshes.sheave1.rotation.y = -time * 3 * speed;
        meshes.sheave2.rotation.y = -time * 0.8 * speed;

        trackOffset = Math.sin(time * 0.5 * speed) * 5;
        if (meshes.track_left_links) meshes.track_left_links.position.x = (Math.sin(time * speed * 2) * 0.05); 
        if (meshes.track_right_links) meshes.track_right_links.position.x = (Math.sin(time * speed * 2 + 1) * 0.05);

        const tiltAngle = Math.sin(time * 0.3 * speed) * 0.1;
        meshes.mastGroup.rotation.z = tiltAngle;
        
        const cycleTime = (time * speed * 3) % 4; 
        
        if (cycleTime < 2) {
            ramOffset = (cycleTime / 2) * 2.5; 
            meshes.combustionGlow.material.emissiveIntensity = 0;
        } else if (cycleTime < 2.2) {
            const dropProgress = (cycleTime - 2) / 0.2;
            ramOffset = 2.5 - (dropProgress * 2.5);
            meshes.combustionGlow.material.emissiveIntensity = dropProgress * 2; 
        } else {
            ramOffset = 0;
            const flashDecay = 1 - ((cycleTime - 2.2) / 1.8);
            meshes.combustionGlow.material.emissiveIntensity = flashDecay * 5;
            
            if (cycleTime > 2.2 && cycleTime < 2.3) {
                pileDepth += 0.02 * speed;
                if(pileDepth > 10) pileDepth = 0; 
            }
        }

        meshes.ramMesh.position.y = 1.5 + ramOffset;
        
        const baseHammerHeight = 12 - pileDepth;
        meshes.hammerGroup.position.y = baseHammerHeight;
        meshes.driveCapGroup.position.y = baseHammerHeight - 2.5;
        meshes.pileGroup.position.y = baseHammerHeight - 7.5; 
        
        const stretch = 14 - baseHammerHeight; 
        meshes.hammerCable.scale.y = 1 + (stretch / 25);
        meshes.hammerCable.position.y = baseHammerHeight + (25 + stretch) / 2; 

        if (meshes.upperCarriage) {
            if (cycleTime > 2.2 && cycleTime < 2.5) {
                meshes.upperCarriage.position.y = 3.1 - 0.02 + Math.random() * 0.04;
            } else {
                meshes.upperCarriage.position.y = 3.1 + Math.sin(time * 20) * 0.002;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPileDriver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
