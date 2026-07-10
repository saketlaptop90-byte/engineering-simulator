import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatables = [];
    const hydraulicSystems = [];
    const particleSystems = [];
    
    // --- ADVANCED CUSTOM MATERIALS ---
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 2.5, roughness: 0.2, metalness: 0.9 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });
    const heavySteel = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.6 });
    const brightSteel = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.9 });
    const warningYellow = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.4, metalness: 0.5 });
    const hydraulicChrome = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.02, metalness: 1.0 });
    const dirtRubber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
    const gridMetal = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.8, wireframe: true });

    // --- HELPER FUNCTIONS ---
    function createMesh(geo, mat, cast = true, rec = true) {
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = cast;
        m.receiveShadow = rec;
        return m;
    }

    function createHydraulicCylinder(radius, length, baseMat, rodMat) {
        const group = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        baseGeo.translate(0, length / 2, 0);
        const baseMesh = createMesh(baseGeo, baseMat);
        baseMesh.rotation.x = Math.PI / 2;
        
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 32);
        rodGeo.translate(0, length * 0.75, 0);
        const rodMesh = createMesh(rodGeo, rodMat);
        rodMesh.rotation.x = Math.PI / 2;
        rodMesh.position.z = length * 0.5; // initial extension
        
        group.add(baseMesh);
        group.add(rodMesh);
        
        return { group, baseMesh, rodMesh, length };
    }

    // --- 1. UNDERCARRIAGE BASE ---
    const undercarriageGroup = new THREE.Group();
    const ucShape = new THREE.Shape();
    ucShape.moveTo(-8, -2);
    ucShape.lineTo(8, -2);
    ucShape.lineTo(6, 2);
    ucShape.lineTo(-6, 2);
    const ucExtrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const ucGeo = new THREE.ExtrudeGeometry(ucShape, ucExtrudeSettings);
    ucGeo.translate(0, 0, -4);
    const ucMesh = createMesh(ucGeo, heavySteel);
    undercarriageGroup.add(ucMesh);
    
    // Add glowing drive motors to undercarriage
    for (let i = -1; i <= 1; i += 2) {
        const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 9, 32);
        const motorMesh = createMesh(motorGeo, darkSteel);
        motorMesh.rotation.x = Math.PI / 2;
        motorMesh.position.set(6 * i, 0, 0);
        const motorGlowGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 32);
        const motorGlow = createMesh(motorGlowGeo, neonCyan);
        motorGlow.rotation.y = Math.PI / 2;
        motorGlow.position.set(6 * i, 0, 4.6 * i);
        undercarriageGroup.add(motorMesh);
        undercarriageGroup.add(motorGlow);
    }
    group.add(undercarriageGroup);

    // --- 2. TRACKS & MASSIVE SPROCKET TIRES ---
    const tracksGroup = new THREE.Group();
    const tireSprockets = [];
    
    function createMassiveTireSprocket() {
        const tGroup = new THREE.Group();
        const tireRadius = 3.5;
        const tireTube = 1.2;
        
        // Main Torus body
        const tireGeo = new THREE.TorusGeometry(tireRadius, tireTube, 32, 100);
        const tireMesh = createMesh(tireGeo, dirtRubber);
        tGroup.add(tireMesh);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const lugCount = 120;
        const lugGeo = new THREE.BoxGeometry(tireTube * 2.8, 0.4, 0.8);
        for(let i = 0; i < lugCount; i++) {
            const angle = (Math.PI * 2 / lugCount) * i;
            const lug = createMesh(lugGeo, dirtRubber);
            const dist = tireRadius + tireTube * 0.85;
            lug.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? 0.3 : -0.3;
            tGroup.add(lug);
        }

        // Rim with CylinderGeometry and complex spoke array
        const rimGeo = new THREE.CylinderGeometry(tireRadius * 0.7, tireRadius * 0.7, tireTube * 2.4, 64);
        const rimMesh = createMesh(rimGeo, darkSteel);
        rimMesh.rotation.x = Math.PI / 2;
        tGroup.add(rimMesh);
        
        const spokeCount = 24;
        for(let i = 0; i < spokeCount; i++) {
            const spokeGeo = new THREE.CylinderGeometry(0.15, 0.25, tireRadius * 1.5, 16);
            const spokeMesh = createMesh(spokeGeo, chrome);
            spokeMesh.rotation.x = Math.PI / 2;
            spokeMesh.rotation.z = (Math.PI * 2 / spokeCount) * i;
            if (i % 4 === 0) {
                const neonNodeGeo = new THREE.SphereGeometry(0.3, 16, 16);
                const neonNode = createMesh(neonNodeGeo, neonOrange);
                neonNode.position.set(Math.cos(spokeMesh.rotation.z) * tireRadius * 0.4, Math.sin(spokeMesh.rotation.z) * tireRadius * 0.4, tireTube * 1.2);
                tGroup.add(neonNode);
            }
            tGroup.add(spokeMesh);
        }
        
        // Center hub cap (LatheGeometry)
        const hubPoints = [];
        for ( let i = 0; i < 10; i ++ ) {
            hubPoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.8, i * 0.1 ) );
        }
        const hubGeo = new THREE.LatheGeometry( hubPoints, 32 );
        const hubMesh = createMesh(hubGeo, brightSteel);
        hubMesh.rotation.x = Math.PI / 2;
        hubMesh.position.z = tireTube;
        tGroup.add(hubMesh);

        return tGroup;
    }

    for (let side = -1; side <= 1; side += 2) {
        for (let front = -1; front <= 1; front += 2) {
            const sprocket = createMassiveTireSprocket();
            sprocket.position.set(8 * front, -1.5, 5.5 * side);
            tracksGroup.add(sprocket);
            tireSprockets.push(sprocket);
        }
        
        // Track guards / side plates
        const guardShape = new THREE.Shape();
        guardShape.moveTo(-10, 0);
        guardShape.lineTo(10, 0);
        guardShape.lineTo(12, -2);
        guardShape.lineTo(-12, -2);
        const guardGeo = new THREE.ExtrudeGeometry(guardShape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.1 });
        const guardMesh = createMesh(guardGeo, warningYellow);
        guardMesh.position.set(0, 3, 5.5 * side - (side * 1.5));
        tracksGroup.add(guardMesh);
        
        for(let i = -5; i <= 5; i += 2.5) {
            const idlerGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
            const idlerMesh = createMesh(idlerGeo, brightSteel);
            idlerMesh.rotation.x = Math.PI / 2;
            idlerMesh.position.set(i, -4.5, 5.5 * side);
            tracksGroup.add(idlerMesh);
            tireSprockets.push(idlerMesh);
        }
        
        // Actual track chain linking the sprockets
        const chainGroup = new THREE.Group();
        const padCount = 80;
        const trackRadius = 3.5;
        for (let i = 0; i < padCount; i++) {
            const padGeo = new THREE.BoxGeometry(0.8, 0.4, 3.5);
            const padMesh = createMesh(padGeo, heavySteel);
            
            const t = i / padCount;
            let x, y, angle;
            if (t < 0.25) { 
                const tt = t / 0.25;
                x = -8 + (16 * tt);
                y = trackRadius;
                angle = 0;
            } else if (t < 0.5) { 
                const tt = (t - 0.25) / 0.25;
                x = 8 + Math.sin(tt * Math.PI) * trackRadius;
                y = Math.cos(tt * Math.PI) * trackRadius;
                angle = -tt * Math.PI;
            } else if (t < 0.75) { 
                const tt = (t - 0.5) / 0.25;
                x = 8 - (16 * tt);
                y = -trackRadius;
                angle = Math.PI;
            } else { 
                const tt = (t - 0.75) / 0.25;
                x = -8 - Math.sin(tt * Math.PI) * trackRadius;
                y = -Math.cos(tt * Math.PI) * trackRadius;
                angle = Math.PI + tt * Math.PI;
            }
            padMesh.position.set(x, y - 1.5, 5.5 * side);
            padMesh.rotation.z = angle;
            
            const padGlowGeo = new THREE.BoxGeometry(0.1, 0.5, 3.0);
            const padGlow = createMesh(padGlowGeo, neonOrange);
            padGlow.position.set(x, y - 1.5, 5.5 * side);
            padGlow.rotation.z = angle;
            
            chainGroup.add(padMesh);
            chainGroup.add(padGlow);
        }
        tracksGroup.add(chainGroup);
    }
    group.add(tracksGroup);

    // --- 3. SLEWING RING ---
    const slewingGroup = new THREE.Group();
    const slewBaseGeo = new THREE.CylinderGeometry(4.5, 4.5, 1, 64);
    const slewBaseMesh = createMesh(slewBaseGeo, darkSteel);
    slewBaseMesh.position.y = 2.5;
    
    for(let i = 0; i < 60; i++) {
        const toothGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
        const toothMesh = createMesh(toothGeo, brightSteel);
        const angle = (Math.PI * 2 / 60) * i;
        toothMesh.position.set(Math.cos(angle) * 4.4, 2.5, Math.sin(angle) * 4.4);
        toothMesh.rotation.y = -angle;
        slewingGroup.add(toothMesh);
    }
    
    const slewTopGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.8, 64);
    const slewTopMesh = createMesh(slewTopGeo, chrome);
    slewTopMesh.position.y = 3.4;
    
    slewingGroup.add(slewBaseMesh);
    slewingGroup.add(slewTopMesh);
    group.add(slewingGroup);

    // --- 4. UPPER CARRIAGE ---
    const upperCarriage = new THREE.Group();
    upperCarriage.position.y = 3.8;
    
    const ucDeckShape = new THREE.Shape();
    ucDeckShape.moveTo(-12, -5);
    ucDeckShape.lineTo(6, -5);
    ucDeckShape.lineTo(10, -3);
    ucDeckShape.lineTo(10, 3);
    ucDeckShape.lineTo(6, 5);
    ucDeckShape.lineTo(-12, 5);
    const ucDeckGeo = new THREE.ExtrudeGeometry(ucDeckShape, { depth: 1.5, bevelEnabled: true, bevelSize: 0.2 });
    ucDeckGeo.rotateX(Math.PI / 2);
    const ucDeckMesh = createMesh(ucDeckGeo, heavySteel);
    upperCarriage.add(ucDeckMesh);

    const cwShape = new THREE.Shape();
    cwShape.moveTo(-12, -5);
    cwShape.lineTo(-8, -5);
    cwShape.lineTo(-8, 5);
    cwShape.lineTo(-12, 5);
    const cwGeo = new THREE.ExtrudeGeometry(cwShape, { depth: 6, bevelEnabled: true });
    cwGeo.rotateX(Math.PI / 2);
    cwGeo.translate(0, 6, 0);
    const cwMesh = createMesh(cwGeo, warningYellow);
    
    for(let i = -4; i <= 4; i += 1.5) {
        const chevGeo = new THREE.BoxGeometry(0.2, 4, 1);
        const chevMesh = createMesh(chevGeo, neonRed);
        chevMesh.position.set(-12.1, 3, i);
        chevMesh.rotation.x = Math.PI / 4;
        upperCarriage.add(chevMesh);
    }
    upperCarriage.add(cwMesh);
    group.add(upperCarriage);
    animatables.push({ obj: upperCarriage, type: 'slew' });

    // --- 5. ENGINE HOUSE & EXHAUST ---
    const engineHouseGroup = new THREE.Group();
    engineHouseGroup.position.set(-5, 0, 0);
    
    const engineBlockGeo = new THREE.BoxGeometry(6, 5, 8);
    const engineBlockMesh = createMesh(engineBlockGeo, darkSteel);
    engineBlockMesh.position.set(0, 2.5, 0);
    engineHouseGroup.add(engineBlockMesh);
    
    const fans = [];
    for(let i = -2; i <= 2; i += 4) {
        const fanGroup = new THREE.Group();
        const fanRing = createMesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32), chrome);
        fanGroup.add(fanRing);
        for(let j = 0; j < 6; j++) {
            const blade = createMesh(new THREE.BoxGeometry(1.4, 0.1, 0.4), plastic);
            blade.position.x = 0.7;
            blade.rotation.x = Math.PI / 4;
            const pivot = new THREE.Group();
            pivot.rotation.z = (Math.PI * 2 / 6) * j;
            pivot.add(blade);
            fanGroup.add(pivot);
        }
        fanGroup.position.set(0, 2.5, i);
        fanGroup.rotation.y = Math.PI / 2;
        engineHouseGroup.add(fanGroup);
        fans.push(fanGroup);
    }
    animatables.push({ obj: fans, type: 'fans' });

    const exhaustPoints = [];
    for ( let i = 0; i < 20; i ++ ) {
        exhaustPoints.push( new THREE.Vector2( 0.4 + Math.sin( i * 0.6 ) * 0.1, i * 0.4 ) );
    }
    const exhaustGeo = new THREE.LatheGeometry( exhaustPoints, 32 );
    const exhaustMesh = createMesh(exhaustGeo, chrome);
    exhaustMesh.position.set(-2, 5, -2);
    engineHouseGroup.add(exhaustMesh);
    
    const particleGroup = new THREE.Group();
    particleGroup.position.set(-2, 13, -2);
    for(let i = 0; i < 30; i++) {
        const pGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.userData = { offset: Math.random() * Math.PI * 2, speed: Math.random() * 0.05 + 0.02, height: Math.random() * 5 };
        particleGroup.add(pMesh);
    }
    engineHouseGroup.add(particleGroup);
    particleSystems.push(particleGroup);
    upperCarriage.add(engineHouseGroup);

    // --- 6. CAB RISER & FORESTRY CAB ---
    const cabAssembly = new THREE.Group();
    cabAssembly.position.set(3, 0, 3);
    
    const riserBaseGeo = new THREE.BoxGeometry(3, 4, 3);
    const riserBaseMesh = createMesh(riserBaseGeo, heavySteel);
    riserBaseMesh.position.y = 2;
    cabAssembly.add(riserBaseMesh);
    
    const cabGroup = new THREE.Group();
    cabGroup.position.y = 5;
    
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-2, 0);
    cabShape.lineTo(2, 0);
    cabShape.lineTo(2.5, 3);
    cabShape.lineTo(1.5, 5);
    cabShape.lineTo(-1.5, 5);
    cabShape.lineTo(-2, 3);
    const cabExtrude = new THREE.ExtrudeGeometry(cabShape, { depth: 3.5, bevelEnabled: true, bevelSize: 0.1 });
    cabExtrude.translate(0, 0, -1.75);
    const cabMesh = createMesh(cabExtrude, warningYellow);
    cabGroup.add(cabMesh);
    
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.8 });
    const frontWindow = createMesh(new THREE.PlaneGeometry(3, 4), windowMat);
    frontWindow.position.set(2.05, 2.5, 0);
    frontWindow.rotation.y = Math.PI / 2;
    frontWindow.rotation.x = -0.15;
    cabGroup.add(frontWindow);

    const cageGroup = new THREE.Group();
    const latticeMat = gridMetal;
    for(let i = -1.5; i <= 1.5; i += 0.5) {
        const vBar = createMesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 8), latticeMat);
        vBar.position.set(2.2, 2.5, i);
        vBar.rotation.z = -0.15;
        cageGroup.add(vBar);
        const hBar = createMesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), latticeMat);
        hBar.position.set(2.2 - (i+1.5)*0.1, i + 3.5, 0);
        hBar.rotation.x = Math.PI / 2;
        cageGroup.add(hBar);
    }
    cabGroup.add(cageGroup);
    
    const seatGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const seatMesh = createMesh(seatGeo, rubber);
    seatMesh.position.set(0, 1, 0);
    cabGroup.add(seatMesh);
    
    const panelGeo = new THREE.BoxGeometry(0.5, 1, 2);
    const panelMesh = createMesh(panelGeo, darkSteel);
    panelMesh.position.set(1.5, 1.5, 0);
    panelMesh.rotation.z = -Math.PI / 6;
    cabGroup.add(panelMesh);
    
    const screenGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const screenMesh = createMesh(screenGeo, neonCyan);
    screenMesh.position.set(1.4, 2.0, 0);
    screenMesh.rotation.y = -Math.PI / 2;
    screenMesh.rotation.x = Math.PI / 6;
    cabGroup.add(screenMesh);
    
    cabAssembly.add(cabGroup);
    upperCarriage.add(cabAssembly);

    // --- 7. MAIN BOOM ---
    const boomAssembly = new THREE.Group();
    boomAssembly.position.set(6, 1.5, -1.5);
    
    const mainBoomLength = 25;
    const mainBoomShape = new THREE.Shape();
    mainBoomShape.moveTo(0, -1.5);
    mainBoomShape.lineTo(mainBoomLength * 0.4, 4);
    mainBoomShape.lineTo(mainBoomLength, 0);
    mainBoomShape.lineTo(mainBoomLength, -2);
    mainBoomShape.lineTo(mainBoomLength * 0.4, 1);
    mainBoomShape.lineTo(0, -3);
    
    for(let i = 1; i <= 3; i++) {
        const hole = new THREE.Path();
        hole.absarc(mainBoomLength * 0.25 * i, 1.5 - (i*0.5), 0.8, 0, Math.PI * 2, false);
        mainBoomShape.holes.push(hole);
    }
    
    const mainBoomGeo = new THREE.ExtrudeGeometry(mainBoomShape, { depth: 2, bevelEnabled: true, bevelSize: 0.1 });
    mainBoomGeo.translate(0, 0, -1);
    const mainBoomMesh = createMesh(mainBoomGeo, warningYellow);
    
    const pivotPinGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const pivotPinMesh = createMesh(pivotPinGeo, chrome);
    pivotPinMesh.rotation.x = Math.PI / 2;
    mainBoomMesh.add(pivotPinMesh);
    
    boomAssembly.add(mainBoomMesh);
    upperCarriage.add(boomAssembly);
    animatables.push({ obj: boomAssembly, type: 'mainBoom' });

    // --- 8. MAIN LIFT CYLINDERS ---
    const mainCylinders = [];
    for(let i = -1; i <= 1; i += 2) {
        const cyl = createHydraulicCylinder(0.8, 12, darkSteel, hydraulicChrome);
        cyl.group.position.set(2, 0, i * 1.5 - 1.5);
        upperCarriage.add(cyl.group);
        mainCylinders.push(cyl);
        hydraulicSystems.push({
            type: 'lookAt',
            cylinder: cyl.group,
            rod: cyl.rodMesh,
            baseLen: cyl.length,
            targetBase: new THREE.Vector3(2, 0, i * 1.5 - 1.5),
            targetEndRel: new THREE.Vector3(10, 2.5, i * 1.5),
            boomRef: boomAssembly
        });
    }

    // --- 9. STICK BOOM ---
    const stickAssembly = new THREE.Group();
    stickAssembly.position.set(mainBoomLength, -1, 0);
    
    const stickLength = 18;
    const stickShape = new THREE.Shape();
    stickShape.moveTo(-2, 2);
    stickShape.lineTo(stickLength, 0);
    stickShape.lineTo(stickLength, -1.5);
    stickShape.lineTo(-2, -2);
    const stickGeo = new THREE.ExtrudeGeometry(stickShape, { depth: 1.6, bevelEnabled: true, bevelSize: 0.1 });
    stickGeo.translate(0, 0, -0.8);
    const stickMesh = createMesh(stickGeo, heavySteel);
    
    const stickPin = createMesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 32), chrome);
    stickPin.rotation.x = Math.PI / 2;
    stickMesh.add(stickPin);
    
    stickAssembly.add(stickMesh);
    boomAssembly.add(stickAssembly);
    animatables.push({ obj: stickAssembly, type: 'stickBoom' });

    const stickCyl = createHydraulicCylinder(0.7, 10, warningYellow, hydraulicChrome);
    stickCyl.group.position.set(mainBoomLength * 0.4, 4, 0);
    boomAssembly.add(stickCyl.group);
    hydraulicSystems.push({
        type: 'lookAtLocal',
        cylinder: stickCyl.group,
        rod: stickCyl.rodMesh,
        baseLen: stickCyl.length,
        targetBaseRel: new THREE.Vector3(mainBoomLength * 0.4, 4, 0),
        targetEndRel: new THREE.Vector3(4, 1.5, 0),
        parentRef: boomAssembly,
        childRef: stickAssembly
    });

    // --- 10. GRAPPLE ROTATOR & BASE ---
    const grappleAssembly = new THREE.Group();
    grappleAssembly.position.set(stickLength, -0.75, 0);
    
    const rotatorGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
    const rotatorMesh = createMesh(rotatorGeo, darkSteel);
    const rotatorNeon = createMesh(new THREE.TorusGeometry(1.3, 0.1, 16, 32), neonCyan);
    rotatorNeon.rotation.x = Math.PI / 2;
    rotatorMesh.add(rotatorNeon);
    
    const grappleBase = new THREE.Group();
    grappleBase.position.y = -1;
    rotatorMesh.add(grappleBase);
    
    const gBaseGeo = new THREE.BoxGeometry(2, 3, 4);
    const gBaseMesh = createMesh(gBaseGeo, heavySteel);
    grappleBase.add(gBaseMesh);
    
    grappleAssembly.add(rotatorMesh);
    stickAssembly.add(grappleAssembly);
    animatables.push({ obj: rotatorMesh, type: 'grappleRotator' });

    // --- 11. LOG GRAPPLE CLAWS ---
    const claws = [];
    const clawShape = new THREE.Shape();
    clawShape.moveTo(0, 0);
    clawShape.quadraticCurveTo(-4, -4, -1, -8);
    clawShape.lineTo(0, -8);
    clawShape.quadraticCurveTo(-2, -4, 1, 0);
    
    const clawExtrude = { depth: 0.6, bevelEnabled: true, bevelSize: 0.1 };
    const clawGeo = new THREE.ExtrudeGeometry(clawShape, clawExtrude);
    clawGeo.translate(0, 0, -0.3);
    
    const leftClawGroup = new THREE.Group();
    leftClawGroup.position.set(-1, -1.5, 0);
    for(let i = -1; i <= 1; i += 2) {
        const tine = createMesh(clawGeo, warningYellow);
        tine.position.z = i * 1.2;
        leftClawGroup.add(tine);
    }
    grappleBase.add(leftClawGroup);
    claws.push({ obj: leftClawGroup, side: 1 });
    
    const rightClawGroup = new THREE.Group();
    rightClawGroup.position.set(1, -1.5, 0);
    const rightTine = createMesh(clawGeo, warningYellow);
    rightTine.rotation.y = Math.PI;
    rightClawGroup.add(rightTine);
    grappleBase.add(rightClawGroup);
    claws.push({ obj: rightClawGroup, side: -1 });

    animatables.push({ obj: claws, type: 'claws' });

    // --- 12. EXTENSIVE HYDRAULIC HOSES ---
    const hoseMats = [
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
    ];
    for(let h = 0; h < 6; h++) {
        const points = [];
        const yOff = (h % 2 === 0) ? 0.2 : -0.2;
        const zOff = (h / 6) * 1.5 - 0.75;
        points.push(new THREE.Vector3(0, 2 + yOff, zOff));
        points.push(new THREE.Vector3(mainBoomLength * 0.4, 4.5 + yOff, zOff));
        points.push(new THREE.Vector3(mainBoomLength, 0.5 + yOff, zOff));
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.08, 8, false);
        const tubeMesh = createMesh(tubeGeo, hoseMats[h % 2]);
        boomAssembly.add(tubeMesh);
    }

    // --- PARTS ARRAY POPULATION ---
    parts.push({
        name: 'UndercarriageBase',
        description: 'Massive heavily armored lower frame providing stability and housing the final drives.',
        material: 'heavySteel',
        function: 'Supports the entire machine weight and anchors the track assemblies.',
        assemblyOrder: 1,
        connections: ['TrackAssemblies', 'SlewingRing'],
        failureEffect: 'Total immobilization and structural collapse.',
        cascadeFailures: ['UpperCarriage', 'TrackAssemblies'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });
    parts.push({
        name: 'TrackAssemblies',
        description: 'Advanced dual-track system featuring massive TorusGeometry-based drive sprockets and hundreds of extruded lugs for aggressive off-road grip.',
        material: 'dirtRubber & darkSteel',
        function: 'Provides all-terrain locomotion across harsh forestry environments.',
        assemblyOrder: 2,
        connections: ['UndercarriageBase'],
        failureEffect: 'Loss of traction and movement capabilities.',
        cascadeFailures: ['DriveMotors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 15 }
    });
    parts.push({
        name: 'SlewingRing',
        description: 'Heavy-duty rotational bearing with 360-degree continuous movement capabilities.',
        material: 'chrome',
        function: 'Allows the upper structure to rotate independently of the tracks.',
        assemblyOrder: 3,
        connections: ['UndercarriageBase', 'UpperCarriage'],
        failureEffect: 'Inability to aim the boom or load logs accurately.',
        cascadeFailures: ['HydraulicRotaryManifold'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });
    parts.push({
        name: 'UpperCarriage',
        description: 'Main rotating platform housing the engine, cab, and boom pivot points, complete with massive rear counterweight.',
        material: 'heavySteel & warningYellow',
        function: 'Serves as the foundation for all active lifting and operational components.',
        assemblyOrder: 4,
        connections: ['SlewingRing', 'EngineHouse', 'CabRiser', 'MainBoom'],
        failureEffect: 'Catastrophic failure of operations; tips over if counterweight fails.',
        cascadeFailures: ['MainBoom', 'EngineHouse'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });
    parts.push({
        name: 'EngineCompartment',
        description: 'High-tech ventilated enclosure for the massive diesel-electric hybrid powerplant, featuring spinning cooling fans and exhaust stacks.',
        material: 'darkSteel & chrome',
        function: 'Generates power for hydraulic pumps and drive motors.',
        assemblyOrder: 5,
        connections: ['UpperCarriage'],
        failureEffect: 'Complete loss of hydraulic and electrical power.',
        cascadeFailures: ['All Hydraulic Systems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 15, z: -10 }
    });
    parts.push({
        name: 'ForestryArmoredCab',
        description: 'Specialized elevated operator station with extreme FOPS/ROPS lattice cage, tinted windows, and glowing high-tech control panels.',
        material: 'warningYellow & gridMetal',
        function: 'Provides a safe, highly visible environment for the operator to control the machine.',
        assemblyOrder: 6,
        connections: ['CabRiser'],
        failureEffect: 'Operator hazard; loss of manual control.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 20, z: 10 }
    });
    parts.push({
        name: 'MainBoom',
        description: 'Massive extruded steel lifting arm with weight-reducing structural holes and integrated hydraulic line mounts.',
        material: 'warningYellow',
        function: 'Provides the primary reach and lifting arc for handling massive timber.',
        assemblyOrder: 7,
        connections: ['UpperCarriage', 'MainLiftCylinders', 'StickBoom'],
        failureEffect: 'Inability to lift loads; boom collapse.',
        cascadeFailures: ['StickBoom', 'GrappleAssembly'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 25, z: 0 }
    });
    parts.push({
        name: 'MainLiftCylinders',
        description: 'Dual massive high-pressure master-slave hydraulic cylinders with chrome rods.',
        material: 'darkSteel & hydraulicChrome',
        function: 'Actuates the main boom to lift tons of wood simultaneously.',
        assemblyOrder: 8,
        connections: ['UpperCarriage', 'MainBoom'],
        failureEffect: 'Boom drops uncontrollably.',
        cascadeFailures: ['MainBoom'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 10, z: -5 }
    });
    parts.push({
        name: 'StickBoom',
        description: 'Secondary articulated arm connecting the main boom to the grapple, providing reach and precision.',
        material: 'heavySteel',
        function: 'Extends reach and folds inward for traversing dense forests.',
        assemblyOrder: 9,
        connections: ['MainBoom', 'GrappleRotator'],
        failureEffect: 'Loss of articulation and precision loading.',
        cascadeFailures: ['GrappleAssembly'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 35, y: 20, z: 0 }
    });
    parts.push({
        name: 'GrappleRotator',
        description: 'Heavy-duty hydraulic rotary actuator with glowing neon status rings.',
        material: 'darkSteel & neonCyan',
        function: 'Allows the grapple to spin 360 degrees infinitely for perfect log alignment.',
        assemblyOrder: 10,
        connections: ['StickBoom', 'GrappleBase'],
        failureEffect: 'Logs cannot be aligned; loading becomes inefficient.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 45, y: 15, z: 0 }
    });
    parts.push({
        name: 'LogGrappleClaws',
        description: 'Interlocking heavy steel tines (dual left, single right) engineered for crushing grip strength on massive tree trunks.',
        material: 'warningYellow',
        function: 'Secures, lifts, and sorts logs.',
        assemblyOrder: 11,
        connections: ['GrappleBase'],
        failureEffect: 'Drops payload immediately.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 5, z: 0 }
    });
    parts.push({
        name: 'HydraulicHoseNetwork',
        description: 'Extensive web of high-pressure fluid lines (CatmullRom curves) routing power along the booms.',
        material: 'rubber',
        function: 'Transmits hydraulic fluid from the engine pumps to the remote actuators.',
        assemblyOrder: 12,
        connections: ['EngineCompartment', 'All Cylinders'],
        failureEffect: 'Rupture causes massive fluid leak and total system paralysis.',
        cascadeFailures: ['All Actuators'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 30, z: 5 }
    });

    const description = "The Forestry Log Loader is a hyper-realistic, massively complex heavy engineering vehicle. It features an excavator-style undercarriage upgraded with massive TorusGeometry-based drive sprockets clad in hundreds of aggressive lugs. The upper structure houses a specialized FOPS/ROPS armored forestry cab with tinted glass and glowing neon instrumentation, mounted on a riser for superior visibility. A massive, dynamically animated extruded steel boom system (main and stick) reaches out to a continuously spinning grapple rotator and interlocking heavy steel claws. The entire machine is powered by a high-tech hybrid powerplant with visible spinning cooling fans, volumetric exhaust particles, and a vast network of intricate hydraulic hoses and master-slave cylinders that perfectly articulate with every movement.";

    const quizQuestions = [
        {
            question: "What is the primary function of the heavy exterior lattice cage (FOPS/ROPS) on the specialized forestry cab?",
            options: [
                "To increase the machine's aerodynamic efficiency",
                "To protect the operator from falling trees, heavy branches, and machine rollovers",
                "To serve as a mounting point for decorative neon lights",
                "To act as a counterweight for the main boom"
            ],
            answer: 1,
            explanation: "Forestry environments are extremely hazardous. The Falling Object Protective Structure (FOPS) and Roll-Over Protective Structure (ROPS) lattice is critical for operator survival against heavy timber."
        },
        {
            question: "How does the massive slewing ring enhance the operation of this excavator-style base?",
            options: [
                "It drives the tracks forward and backward",
                "It acts as a massive shock absorber for the boom",
                "It allows the entire upper structure, boom, and cab to rotate 360 degrees independently of the undercarriage",
                "It pumps hydraulic fluid to the grapple"
            ],
            answer: 2,
            explanation: "The slewing ring is a massive bearing that connects the upper carriage to the undercarriage, enabling continuous rotation for sorting and loading without moving the tracks."
        },
        {
            question: "Why are the track assemblies equipped with massive Torus-based sprockets and hundreds of extruded lugs?",
            options: [
                "To reduce the weight of the machine",
                "To provide aggressive, high-traction off-road grip required in muddy, uneven forestry terrain",
                "To look purely aesthetic for city driving",
                "To slice through logs automatically as the machine drives"
            ],
            answer: 1,
            explanation: "Forestry loaders operate in deep mud, over stumps, and on steep inclines. Aggressive treads and massive sprockets are strictly required for traction."
        },
        {
            question: "What is the mechanical purpose of the 'master-slave' hydraulic cylinder setup on the main boom?",
            options: [
                "To provide the immense, synchronized lifting force required to manipulate tons of full-length timber",
                "To steer the undercarriage tracks",
                "To cool the engine during heavy loads",
                "To generate electricity for the neon cabin lights"
            ],
            answer: 0,
            explanation: "Massive hydraulic cylinders use pressurized fluid to provide the incredible physical force necessary to angle the heavy steel booms while carrying massive logs."
        },
        {
            question: "What specific operational advantage does the continuously spinning 'Grapple Rotator' provide?",
            options: [
                "It acts as a drill to bore into the soil",
                "It allows precise angular positioning of logs for stacking and loading without having to reposition the entire machine",
                "It spins fast enough to act as a helicopter blade",
                "It throws logs over long distances"
            ],
            answer: 1,
            explanation: "The rotator allows the operator to twist the grapple claws to perfectly align with a log on the ground, and then twist it again to align perfectly with a truck bed or stack."
        }
    ];

    function animate(time, speed, envMeshes) {
        const t = time * speed;

        tireSprockets.forEach(sprocket => {
            sprocket.rotation.z = -t * 2;
        });

        animatables.forEach(anim => {
            if (anim.type === 'slew') {
                anim.obj.rotation.y = Math.sin(t * 0.3) * 1.5;
            } else if (anim.type === 'mainBoom') {
                anim.obj.rotation.z = Math.sin(t * 0.5) * 0.4 + 0.4;
            } else if (anim.type === 'stickBoom') {
                anim.obj.rotation.z = Math.cos(t * 0.5) * 0.6 - 0.5;
            } else if (anim.type === 'grappleRotator') {
                anim.obj.rotation.y = t * 1.5;
            } else if (anim.type === 'claws') {
                const openAngle = (Math.sin(t * 1.2) * 0.5 + 0.5) * 0.8;
                anim.obj[0].obj.rotation.z = openAngle;
                anim.obj[1].obj.rotation.z = -openAngle;
            } else if (anim.type === 'fans') {
                anim.obj.forEach(f => f.rotation.z += 0.2 * speed);
            }
        });

        hydraulicSystems.forEach(sys => {
            if (sys.type === 'lookAt') {
                const targetEndWorld = new THREE.Vector3();
                const tempObj = new THREE.Object3D();
                tempObj.position.copy(sys.targetEndRel);
                sys.boomRef.add(tempObj);
                sys.boomRef.updateMatrixWorld();
                tempObj.getWorldPosition(targetEndWorld);
                sys.boomRef.remove(tempObj);
                
                const localTarget = sys.cylinder.parent.worldToLocal(targetEndWorld);
                sys.cylinder.lookAt(targetEndWorld);
                sys.cylinder.rotateX(Math.PI / 2);
                
                const dist = sys.cylinder.position.distanceTo(localTarget);
                sys.rod.position.y = dist - (sys.baseLen * 0.5);
                
            } else if (sys.type === 'lookAtLocal') {
                const targetEndWorld = new THREE.Vector3();
                const tempObj = new THREE.Object3D();
                tempObj.position.copy(sys.targetEndRel);
                sys.childRef.add(tempObj);
                sys.childRef.updateMatrixWorld();
                tempObj.getWorldPosition(targetEndWorld);
                sys.childRef.remove(tempObj);
                
                sys.cylinder.lookAt(targetEndWorld);
                sys.cylinder.rotateX(Math.PI / 2);
                
                const localTarget = sys.cylinder.parent.worldToLocal(targetEndWorld);
                const dist = sys.cylinder.position.distanceTo(localTarget);
                sys.rod.position.y = dist - (sys.baseLen * 0.5);
            }
        });

        particleSystems.forEach(sys => {
            sys.children.forEach(p => {
                p.position.y += p.userData.speed * speed * 20;
                p.position.x = Math.sin(t * 5 + p.userData.offset) * 0.5;
                p.position.z = Math.cos(t * 5 + p.userData.offset) * 0.5;
                p.material.opacity -= 0.005 * speed * 20;
                
                if (p.position.y > p.userData.height + 5 || p.material.opacity <= 0) {
                    p.position.y = 0;
                    p.material.opacity = 0.5;
                }
            });
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
