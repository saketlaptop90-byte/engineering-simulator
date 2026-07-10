import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Renaissance Materials
    const bronzeMat = copper.clone();
    bronzeMat.roughness = 0.3;
    bronzeMat.metalness = 0.85;
    bronzeMat.color = new THREE.Color(0xcd7f32);
    
    const darkWoodMat = darkSteel.clone();
    darkWoodMat.color = new THREE.Color(0x2d1a11);
    darkWoodMat.roughness = 0.95;
    
    const ironMat = darkSteel.clone();
    ironMat.color = new THREE.Color(0x1a1a1a);
    ironMat.metalness = 0.75;
    ironMat.roughness = 0.6;
    
    const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffea,
        emissive: 0x00ffea,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1
    });

    const hotPlasmaMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2
    });
    
    // --------------------------------------------------------
    // 1. MASSIVE IRON-BANDED WHEELS
    // --------------------------------------------------------
    function createIronBandedWheel(radius, width, spokeCount) {
        const wheelGroup = new THREE.Group();
        
        // Primary Rim (Wood base)
        const rimGeo = new THREE.TorusGeometry(radius, width/2.2, 32, 100);
        const rim = new THREE.Mesh(rimGeo, darkWoodMat);
        wheelGroup.add(rim);
        
        // Outer Iron Band
        const outerBandGeo = new THREE.CylinderGeometry(radius + width/2.1, radius + width/2.1, width * 1.1, 64);
        outerBandGeo.rotateX(Math.PI/2);
        const outerBand = new THREE.Mesh(outerBandGeo, ironMat);
        wheelGroup.add(outerBand);

        // Inner Iron Band
        const innerBandGeo = new THREE.CylinderGeometry(radius - width/2.1, radius - width/2.1, width * 1.1, 64);
        innerBandGeo.rotateX(Math.PI/2);
        const innerBand = new THREE.Mesh(innerBandGeo, ironMat);
        wheelGroup.add(innerBand);
        
        // Heavy Hub
        const hubGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, width * 2, 32);
        hubGeo.rotateX(Math.PI/2);
        const hub = new THREE.Mesh(hubGeo, ironMat);
        
        // Hubcap details
        const capGeo = new THREE.SphereGeometry(radius * 0.26, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
        capGeo.rotateX(Math.PI/2);
        const cap1 = new THREE.Mesh(capGeo, bronzeMat);
        cap1.position.z = width;
        const cap2 = new THREE.Mesh(capGeo, bronzeMat);
        cap2.rotation.x = -Math.PI;
        cap2.position.z = -width;
        hub.add(cap1);
        hub.add(cap2);
        wheelGroup.add(hub);
        
        // Spokes and reinforcements
        for(let i=0; i<spokeCount; i++) {
            const angle = (Math.PI * 2 / spokeCount) * i;
            
            // Wooden Spoke
            const spokeGeo = new THREE.CylinderGeometry(radius * 0.04, radius * 0.07, radius - 0.2, 16);
            spokeGeo.translate(0, (radius - 0.2)/2, 0);
            const spoke = new THREE.Mesh(spokeGeo, darkWoodMat);
            spoke.rotation.z = angle;
            
            // Spoke Iron Reinforcement Ring
            const bandGeo = new THREE.CylinderGeometry(radius * 0.08, radius * 0.08, 0.15, 16);
            bandGeo.translate(0, radius * 0.6, 0);
            const band = new THREE.Mesh(bandGeo, ironMat);
            band.rotation.z = angle;
            
            // Rivets on the outer band corresponding to each spoke
            const rivetGeo = new THREE.SphereGeometry(width * 0.12, 16, 16);
            const rivet1 = new THREE.Mesh(rivetGeo, chrome);
            rivet1.position.set(Math.cos(angle) * (radius + width/2.1), Math.sin(angle) * (radius + width/2.1), width*0.4);
            const rivet2 = new THREE.Mesh(rivetGeo, chrome);
            rivet2.position.set(Math.cos(angle) * (radius + width/2.1), Math.sin(angle) * (radius + width/2.1), -width*0.4);
            
            wheelGroup.add(spoke);
            wheelGroup.add(band);
            wheelGroup.add(rivet1);
            wheelGroup.add(rivet2);
        }

        // Outer Treads (Aggressive gripping)
        const treadCount = spokeCount * 2;
        for(let i=0; i<treadCount; i++) {
            const angle = (Math.PI * 2 / treadCount) * i;
            const treadGeo = new THREE.BoxGeometry(0.2, 0.1, width * 1.2);
            const tread = new THREE.Mesh(treadGeo, steel);
            tread.position.set(Math.cos(angle) * (radius + width/2.1 + 0.05), Math.sin(angle) * (radius + width/2.1 + 0.05), 0);
            tread.rotation.z = angle;
            wheelGroup.add(tread);
        }
        
        return wheelGroup;
    }

    const wheelLeft = createIronBandedWheel(3.5, 0.5, 16);
    wheelLeft.position.set(-5, 3.5, 0);
    wheelLeft.rotation.y = Math.PI / 2;
    group.add(wheelLeft);
    
    parts.push({
        name: 'Port-Side Armored Wheel',
        description: 'Massive, heavy-duty wheel heavily reinforced with iron bands, bronze hubcaps, and aggressive steel treads to anchor the weapon system.',
        material: 'Iron, Dense Wood, Bronze, Steel',
        function: 'Mobility, ground anchoring, and immense recoil absorption.',
        assemblyOrder: 1,
        connections: ['Main Forged Axle'],
        failureEffect: 'Catastrophic tilting and inability to reposition the volley array.',
        cascadeFailures: ['Main Axle Torsion', 'Carriage Frame Fracture'],
        originalPosition: {x: -5, y: 3.5, z: 0},
        explodedPosition: {x: -12, y: 3.5, z: 0}
    });

    const wheelRight = createIronBandedWheel(3.5, 0.5, 16);
    wheelRight.position.set(5, 3.5, 0);
    wheelRight.rotation.y = Math.PI / 2;
    group.add(wheelRight);
    
    parts.push({
        name: 'Starboard-Side Armored Wheel',
        description: 'Symmetric heavy-duty wheel providing balanced load distribution for the multi-ton barrel array and carriage.',
        material: 'Iron, Dense Wood, Bronze, Steel',
        function: 'Mobility and symmetric recoil distribution.',
        assemblyOrder: 2,
        connections: ['Main Forged Axle'],
        failureEffect: 'Immobilization and weapon capsizing upon firing.',
        cascadeFailures: ['Main Axle Torsion'],
        originalPosition: {x: 5, y: 3.5, z: 0},
        explodedPosition: {x: 12, y: 3.5, z: 0}
    });

    // --------------------------------------------------------
    // 2. MAIN AXLE & SUSPENSION
    // --------------------------------------------------------
    const axleGeo = new THREE.CylinderGeometry(0.4, 0.4, 10.5, 64);
    axleGeo.rotateZ(Math.PI / 2);
    const axle = new THREE.Mesh(axleGeo, ironMat);
    axle.position.set(0, 3.5, 0);
    group.add(axle);
    
    // Axle reinforcement sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.45, 0.45, 2, 32);
    sleeveGeo.rotateZ(Math.PI / 2);
    const sleeveL = new THREE.Mesh(sleeveGeo, bronzeMat);
    sleeveL.position.set(-3.5, 3.5, 0);
    const sleeveR = new THREE.Mesh(sleeveGeo, bronzeMat);
    sleeveR.position.set(3.5, 3.5, 0);
    group.add(sleeveL);
    group.add(sleeveR);

    parts.push({
        name: 'Main Forged Axle & Sleeves',
        description: 'Solid forged iron axle encased in bronze reinforcement sleeves. It forms the foundational pivot and weight bearer for the entire carriage.',
        material: 'Forged Iron, Bronze',
        function: 'Structural core support and wheel mounting.',
        assemblyOrder: 3,
        connections: ['Port Wheel', 'Starboard Wheel', 'Heavy Wooden Carriage'],
        failureEffect: 'Total structural collapse of the weapon system.',
        cascadeFailures: ['Carriage Frame Fracture', 'Barrel Array Dislodgement'],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // --------------------------------------------------------
    // 3. HEAVY MULTI-PART CARRIAGE
    // --------------------------------------------------------
    const carriageGroup = new THREE.Group();
    carriageGroup.position.set(0, 3.5, 0);
    group.add(carriageGroup);

    // Main central chassis beams
    const beamGeo = new THREE.BoxGeometry(1.2, 1.5, 12);
    const beamL = new THREE.Mesh(beamGeo, darkWoodMat);
    beamL.position.set(-1.5, 0, 3);
    const beamR = new THREE.Mesh(beamGeo, darkWoodMat);
    beamR.position.set(1.5, 0, 3);
    carriageGroup.add(beamL);
    carriageGroup.add(beamR);

    // Cross bracing
    for(let zPos of [-1, 2, 5, 8]) {
        const crossGeo = new THREE.BoxGeometry(4.2, 1.0, 1.0);
        const cross = new THREE.Mesh(crossGeo, darkWoodMat);
        cross.position.set(0, 0, zPos);
        carriageGroup.add(cross);
        
        // Iron binding brackets
        const bracketGeo = new THREE.BoxGeometry(4.4, 1.1, 0.4);
        const bracket = new THREE.Mesh(bracketGeo, ironMat);
        bracket.position.set(0, 0, zPos);
        carriageGroup.add(bracket);
    }

    // Heavy iron armor plates on the beams
    const plateGeo = new THREE.BoxGeometry(1.3, 0.1, 12);
    const plateL = new THREE.Mesh(plateGeo, ironMat);
    plateL.position.set(-1.5, 0.8, 3);
    const plateR = new THREE.Mesh(plateGeo, ironMat);
    plateR.position.set(1.5, 0.8, 3);
    carriageGroup.add(plateL);
    carriageGroup.add(plateR);

    // Thousands of rivets approximation (using repeating geometries for performance, but distinct meshes for detail)
    const rivetSphGeo = new THREE.SphereGeometry(0.08, 8, 8);
    for(let z=-2; z<=8; z+=0.8) {
        for(let x of [-1.8, -1.2, 1.2, 1.8]) {
            const riv = new THREE.Mesh(rivetSphGeo, copper);
            riv.position.set(x, 0.85, z + 3);
            carriageGroup.add(riv);
        }
    }

    // Trail Spade
    const spadeGeo = new THREE.Shape();
    spadeGeo.moveTo(-2, 0);
    spadeGeo.lineTo(2, 0);
    spadeGeo.lineTo(1.5, -2);
    spadeGeo.lineTo(0, -3);
    spadeGeo.lineTo(-1.5, -2);
    spadeGeo.lineTo(-2, 0);
    const spadeExtrude = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1 };
    const spadeMeshGeo = new THREE.ExtrudeGeometry(spadeGeo, spadeExtrude);
    spadeMeshGeo.translate(0, 0, -0.25);
    const spade = new THREE.Mesh(spadeMeshGeo, ironMat);
    spade.position.set(0, -0.5, 9.5);
    spade.rotation.x = -Math.PI / 4;
    carriageGroup.add(spade);

    parts.push({
        name: 'Reinforced Carriage Chassis & Trail Spade',
        description: 'A colossal multi-beam wooden chassis reinforced with thick iron plates, cross-braces, and a heavy trail spade to dig into the earth and arrest recoil.',
        material: 'Wood, Iron, Copper Rivets',
        function: 'Primary weapon mount and ground anchoring system.',
        assemblyOrder: 4,
        connections: ['Main Axle', 'Elevating Mechanism', 'Trunnion Mounts'],
        failureEffect: 'Inability to aim or safely fire; uncontrollable backward sliding.',
        cascadeFailures: ['Complete Disassembly upon firing'],
        originalPosition: {x: 0, y: 3.5, z: 3},
        explodedPosition: {x: 0, y: 10, z: 8}
    });

    // --------------------------------------------------------
    // 4. ELEVATING WEDGE & GEAR TRAIN
    // --------------------------------------------------------
    const wedgeGroup = new THREE.Group();
    wedgeGroup.position.set(0, 0.8, 2);
    carriageGroup.add(wedgeGroup);

    // The wedge block
    const wedgeShape = new THREE.Shape();
    wedgeShape.moveTo(-1.5, 0);
    wedgeShape.lineTo(1.5, 0);
    wedgeShape.lineTo(1.5, 2.5);
    wedgeShape.lineTo(-1.5, 0.5);
    const wedgeExtrude = { depth: 3, bevelEnabled: true };
    const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, wedgeExtrude);
    wedgeGeo.translate(0, 0, -1.5);
    const wedgeBlock = new THREE.Mesh(wedgeGeo, bronzeMat);
    wedgeGroup.add(wedgeBlock);
    
    // Drive screw
    const screwGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 32);
    screwGeo.rotateX(Math.PI/2);
    const screw = new THREE.Mesh(screwGeo, chrome);
    screw.position.set(0, 0.5, 3);
    wedgeGroup.add(screw);
    
    // Thread details on screw
    const threadGeo = new THREE.TorusGeometry(0.22, 0.03, 16, 32);
    threadGeo.rotateX(Math.PI/2);
    for(let tz=-2.5; tz<=2.5; tz+=0.2) {
        const thread = new THREE.Mesh(threadGeo, steel);
        thread.position.set(0, 0.5, 3 + tz);
        wedgeGroup.add(thread);
    }

    // Aiming Crank and Gears
    const crankGroup = new THREE.Group();
    crankGroup.position.set(2.5, 1, 5.5);
    carriageGroup.add(crankGroup);
    
    // Master Gear
    const mGearGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    mGearGeo.rotateZ(Math.PI/2);
    const mGear = new THREE.Mesh(mGearGeo, steel);
    crankGroup.add(mGear);
    // Gear teeth
    for(let i=0; i<16; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), steel);
        const angle = (Math.PI*2/16)*i;
        tooth.position.set(0, Math.cos(angle)*0.85, Math.sin(angle)*0.85);
        tooth.rotation.x = -angle;
        mGear.add(tooth);
    }
    
    // Crank Wheel
    const cWheelGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 64);
    cWheelGeo.rotateY(Math.PI/2);
    const cWheel = new THREE.Mesh(cWheelGeo, bronzeMat);
    cWheel.position.set(0.5, 0, 0);
    crankGroup.add(cWheel);
    
    // Handles
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
    handleGeo.rotateZ(Math.PI/2);
    const h1 = new THREE.Mesh(handleGeo, rubber); h1.position.set(0.9, 1.2, 0); cWheel.add(h1);
    const h2 = new THREE.Mesh(handleGeo, rubber); h2.position.set(0.9, -1.2, 0); cWheel.add(h2);

    parts.push({
        name: 'Precision Elevating Wedge & Gear Train',
        description: 'A heavy bronze wedge driven by a threaded chrome screw and a master gear assembly, providing fine pitch control for the massive barrel array.',
        material: 'Bronze, Chrome, Steel, Rubber',
        function: 'Pitch and trajectory control.',
        assemblyOrder: 5,
        connections: ['Carriage Chassis', 'Barrel Array Support'],
        failureEffect: 'Cannon is locked at a fixed elevation angle.',
        cascadeFailures: ['Thread stripping under recoil'],
        originalPosition: {x: 0, y: 4.3, z: 5},
        explodedPosition: {x: 6, y: 8, z: 12}
    });

    // --------------------------------------------------------
    // 5. TRUNNIONS & DYNAMIC BARREL ARRAY
    // --------------------------------------------------------
    const trunnionGeo = new THREE.CylinderGeometry(0.6, 0.6, 6.5, 64);
    trunnionGeo.rotateZ(Math.PI/2);
    const trunnion = new THREE.Mesh(trunnionGeo, ironMat);
    trunnion.position.set(0, 5.5, -0.5);
    group.add(trunnion);

    const barrelArray = new THREE.Group();
    barrelArray.position.set(0, 5.5, -0.5); // Pivot precisely on trunnions
    group.add(barrelArray);

    // Immense Bronze Fan Base / Manifold
    const fanBaseGeo = new THREE.BoxGeometry(6, 1.5, 2.5);
    const fanBase = new THREE.Mesh(fanBaseGeo, bronzeMat);
    fanBase.position.set(0, 0, 0);
    barrelArray.add(fanBase);
    
    // Details on Fan Base
    for(let x=-2.5; x<=2.5; x+=1.25) {
        const ventGeo = new THREE.BoxGeometry(0.8, 1.6, 2.6);
        const vent = new THREE.Mesh(ventGeo, ironMat);
        vent.position.set(x, 0, 0);
        fanBase.add(vent);
    }

    parts.push({
        name: 'Primary Trunnions & Firing Manifold',
        description: 'The massive iron pivot points and the intricately machined bronze manifold that distributes energetic plasma to all volley barrels simultaneously.',
        material: 'Iron, Bronze',
        function: 'Supports barrels, enables rotation, distributes plasma.',
        assemblyOrder: 6,
        connections: ['Elevating Wedge', 'Volley Barrels', 'Carriage Frame'],
        failureEffect: 'Catastrophic manifold breach or failure to elevate.',
        cascadeFailures: ['Plasma Explosion', 'Array Disassembly'],
        originalPosition: {x: 0, y: 5.5, z: -0.5},
        explodedPosition: {x: 0, y: 15, z: -0.5}
    });

    // --------------------------------------------------------
    // 6. THE 11 CYBER-RENAISSANCE VOLLEY BARRELS
    // --------------------------------------------------------
    const numBarrels = 11;
    const barrelMeshes = [];
    const spreadAngle = Math.PI * 0.4; // 72 degrees spread for immense coverage

    // Complex Lathe Profile for High-Tech Cannon
    const barrelPoints = [];
    barrelPoints.push(new THREE.Vector2(0.5, 0));
    barrelPoints.push(new THREE.Vector2(0.5, 0.5));
    barrelPoints.push(new THREE.Vector2(0.7, 0.5)); // Base rim
    barrelPoints.push(new THREE.Vector2(0.7, 1.0));
    barrelPoints.push(new THREE.Vector2(0.45, 1.2));
    barrelPoints.push(new THREE.Vector2(0.45, 4.0));
    barrelPoints.push(new THREE.Vector2(0.55, 4.1)); // Mid ring
    barrelPoints.push(new THREE.Vector2(0.55, 4.4));
    barrelPoints.push(new THREE.Vector2(0.4, 4.5));
    barrelPoints.push(new THREE.Vector2(0.35, 7.0));
    barrelPoints.push(new THREE.Vector2(0.55, 7.1)); // Muzzle flare
    barrelPoints.push(new THREE.Vector2(0.6, 7.5));
    barrelPoints.push(new THREE.Vector2(0.2, 7.5)); // Inner bore
    
    const singleBarrelGeo = new THREE.LatheGeometry(barrelPoints, 64);
    singleBarrelGeo.rotateX(-Math.PI/2); // Point forward (-Z)
    
    for(let i=0; i<numBarrels; i++) {
        const fraction = i / (numBarrels - 1); 
        const angle = -spreadAngle/2 + fraction * spreadAngle;
        
        const bGroup = new THREE.Group();
        
        // Main Bronze Shell
        const bMesh = new THREE.Mesh(singleBarrelGeo, bronzeMat);
        bGroup.add(bMesh);
        
        // Inner Glowing Plasma Bore
        const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 7.6, 32);
        coreGeo.rotateX(-Math.PI/2);
        coreGeo.translate(0, 0, -3.8);
        const coreMesh = new THREE.Mesh(coreGeo, glowingCoreMat);
        bGroup.add(coreMesh);
        
        // Extensive Cooling Fins
        const finGeo = new THREE.TorusGeometry(0.52, 0.08, 16, 64);
        finGeo.rotateX(Math.PI/2);
        for(let zPos = -1.5; zPos >= -3.8; zPos -= 0.3) {
            const fin = new THREE.Mesh(finGeo, steel);
            fin.position.set(0, 0, zPos);
            bGroup.add(fin);
        }

        // Magnetic Acceleration Coils (Outer Rings)
        const coilGeo = new THREE.TorusGeometry(0.48, 0.1, 16, 64);
        coilGeo.rotateX(Math.PI/2);
        for(let zPos = -4.8; zPos >= -6.8; zPos -= 0.5) {
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.position.set(0, 0, zPos);
            bGroup.add(coil);
        }

        // Hydraulic Recoil Damper underneath each barrel
        const damperGroup = new THREE.Group();
        damperGroup.position.set(0, -0.6, -1.5);
        
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 32).rotateX(Math.PI/2), chrome);
        damperGroup.add(cyl);
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 32).rotateX(Math.PI/2), steel);
        piston.position.z = -1;
        damperGroup.add(piston);
        bGroup.add(damperGroup);
        
        bGroup.rotation.y = angle;
        
        const radiusArc = 2.5; 
        bGroup.position.set(
            Math.sin(angle) * radiusArc,
            0.5, 
            -Math.cos(angle) * radiusArc + radiusArc 
        );
        
        barrelArray.add(bGroup);
        barrelMeshes.push({
            group: bGroup,
            core: coreMesh,
            piston: piston,
            baseZ: bGroup.position.z
        });
        
        parts.push({
            name: `Accelerated Volley Barrel ${i+1}`,
            description: `High-pressure bronze-alloy barrel equipped with magnetic acceleration coils and a glowing plasma bore. Part of the devastating ${numBarrels}-barrel volley array.`,
            material: 'Bronze, Plasma, Steel, Copper, Chrome',
            function: 'Accelerates and directs super-heated projectiles.',
            assemblyOrder: 7 + i,
            connections: ['Firing Manifold'],
            failureEffect: 'Localized plasma venting and loss of firepower in this sector.',
            cascadeFailures: ['Overheating of adjacent barrels', 'Manifold Breach'],
            originalPosition: {x: bGroup.position.x, y: bGroup.position.y + 5.5, z: bGroup.position.z - 0.5},
            explodedPosition: {x: bGroup.position.x * 4, y: 20 + (i%3)*3, z: bGroup.position.z * 4 - 10}
        });
    }

    // --------------------------------------------------------
    // 7. ADVANCED TARGETING OPTICS (TELESCOPE)
    // --------------------------------------------------------
    const scopeGroup = new THREE.Group();
    scopeGroup.position.set(-2, 1.5, -1);
    barrelArray.add(scopeGroup); // Mounts to the barrel array to move with it
    
    // Main tube
    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3, 32).rotateX(Math.PI/2), bronzeMat);
    scopeGroup.add(scopeTube);
    
    // Optics Glass
    const lensFront = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.1, 32).rotateX(Math.PI/2), tinted);
    lensFront.position.z = -1.5;
    scopeGroup.add(lensFront);
    const lensRear = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32).rotateX(Math.PI/2), tinted);
    lensRear.position.z = 1.5;
    scopeGroup.add(lensRear);
    
    // Adjustment knobs
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16).rotateZ(Math.PI/2), steel);
    knob.position.set(0, 0.3, 0);
    scopeGroup.add(knob);

    parts.push({
        name: 'Galilean-Cyber Targeting Optics',
        description: 'Advanced multi-lens telescopic sight with reticle adjustments, allowing precise aiming of the wide-arc volley.',
        material: 'Bronze, Tinted Glass, Steel',
        function: 'Aiming and calibration.',
        assemblyOrder: 19,
        connections: ['Firing Manifold'],
        failureEffect: 'Loss of accuracy at long ranges.',
        cascadeFailures: [],
        originalPosition: {x: -2, y: 7, z: -1.5},
        explodedPosition: {x: -6, y: 12, z: -5}
    });

    // --------------------------------------------------------
    // 8. HIGH-TECH IGNITION & CONTROL MATRIX
    // --------------------------------------------------------
    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 7.5, 3);
    panelGroup.rotation.x = -Math.PI / 5;
    carriageGroup.add(panelGroup);
    
    const panelChassis = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 0.3), ironMat);
    panelGroup.add(panelChassis);
    
    // Glowing computation screen
    const screenGeo = new THREE.PlaneGeometry(2.6, 1.2);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.1, 0.16);
    panelGroup.add(screen);

    // Dials and buttons
    for(let i=0; i<6; i++) {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16).rotateX(Math.PI/2), glowingCoreMat);
        btn.position.set(-1.2 + i*0.48, -0.6, 0.16);
        panelGroup.add(btn);
    }
    
    // Power cables trailing from panel to manifold
    for(let i of [-1, 1]) {
        class CableCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = i * 1.5;
                const y = 7 - t * 4;
                const z = 3 - t * 3.5;
                // Add some droop
                const droop = Math.sin(t * Math.PI) * 1.5;
                return optionalTarget.set(x, y - droop, z);
            }
        }
        const cableGeo = new THREE.TubeGeometry(new CableCurve(), 32, 0.05, 8, false);
        const cable = new THREE.Mesh(cableGeo, rubber);
        group.add(cable);
    }

    parts.push({
        name: 'Ignition Computation Matrix & Wiring',
        description: 'An advanced Renaissance-era computational glass display orchestrating the precise firing sequence, connected via heavy rubberized power cables to the manifold.',
        material: 'Iron, Emissive Glass, Rubber, Copper',
        function: 'Controls firing sequence and plasma distribution.',
        assemblyOrder: 20,
        connections: ['Carriage Chassis', 'Firing Manifold'],
        failureEffect: 'Complete weapon misfire.',
        cascadeFailures: ['Premature Detonation in Manifold'],
        originalPosition: {x: 0, y: 11, z: 3},
        explodedPosition: {x: 0, y: 18, z: 8}
    });

    // --------------------------------------------------------
    // 9. HEAVY RECOIL DAMPENERS (HELICAL SPRINGS)
    // --------------------------------------------------------
    for(let i of [-1, 1]) {
        class HelixCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const radius = 0.4;
                const height = 5;
                const turns = 12;
                const angle = t * Math.PI * 2 * turns;
                return optionalTarget.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    t * height - height/2
                );
            }
        }
        const springGeo = new THREE.TubeGeometry(new HelixCurve(), 300, 0.08, 12, false);
        const spring = new THREE.Mesh(springGeo, chrome);
        spring.position.set(i * 3.2, 5.5, 0.5);
        spring.rotation.y = Math.PI/2;
        group.add(spring);
        
        const shockGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 32);
        shockGeo.rotateZ(Math.PI/2);
        const shock = new THREE.Mesh(shockGeo, steel);
        shock.position.set(i * 3.2, 5.5, 0.5);
        group.add(shock);
        
        parts.push({
            name: i === -1 ? 'Port Recoil Dampener' : 'Starboard Recoil Dampener',
            description: 'Massive helical compression spring with a central hydraulic shock absorber. Essential for mitigating the immense backward kinetic force of a full 11-barrel volley.',
            material: 'Chrome, Steel',
            function: 'Kinetic recoil management and structural preservation.',
            assemblyOrder: 21 + (i===1?1:0),
            connections: ['Carriage Frame', 'Trunnion Base'],
            failureEffect: 'Weapon violently leaps backward upon firing, shattering the carriage.',
            cascadeFailures: ['Carriage Fracture', 'Operator Injury'],
            originalPosition: {x: i * 3.2, y: 5.5, z: 0.5},
            explodedPosition: {x: i * 8, y: 5.5, z: -2}
        });
    }

    // --------------------------------------------------------
    // 10. FLUID COOLING SYSTEM / PLASMA RESERVOIRS
    // --------------------------------------------------------
    for(let i of [-1, 1]) {
        const tankGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 32);
        const tank = new THREE.Mesh(tankGeo, glass);
        tank.position.set(i * 2.5, 6, 4);
        carriageGroup.add(tank);
        
        // Inner glowing fluid
        const fluidGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.8, 32);
        const fluid = new THREE.Mesh(fluidGeo, hotPlasmaMat);
        tank.add(fluid);
        
        // End caps
        const capGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 32);
        const capTop = new THREE.Mesh(capGeo, bronzeMat); capTop.position.y = 1.5; tank.add(capTop);
        const capBot = new THREE.Mesh(capGeo, bronzeMat); capBot.position.y = -1.5; tank.add(capBot);
        
        // Hose to manifold
        class HoseCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const startX = i * 2.5; const startY = 4.5; const startZ = 4;
                const endX = i * 2; const endY = 5.5; const endZ = 0;
                return optionalTarget.set(
                    startX + (endX - startX) * t,
                    startY + (endY - startY) * t + Math.sin(t * Math.PI) * 1.5,
                    startZ + (endZ - startZ) * t
                );
            }
        }
        const hose = new THREE.Mesh(new THREE.TubeGeometry(new HoseCurve(), 64, 0.15, 12, false), rubber);
        group.add(hose);

        parts.push({
            name: i === -1 ? 'Port Plasma Reservoir' : 'Starboard Plasma Reservoir',
            description: 'Armored glass containment tank holding volatile super-heated plasma fluid used to prime the magnetic acceleration coils.',
            material: 'Glass, Bronze, Plasma Fluid',
            function: 'Energy storage and thermal priming.',
            assemblyOrder: 23 + (i===1?1:0),
            connections: ['Carriage Chassis', 'Cooling Hoses'],
            failureEffect: 'Depletion of firing energy or thermal meltdown.',
            cascadeFailures: ['Manifold Melt', 'Catastrophic Explosion'],
            originalPosition: {x: i * 2.5, y: 9.5, z: 4},
            explodedPosition: {x: i * 7, y: 12, z: 8}
        });
    }

    // --------------------------------------------------------
    // DATA EXPORT
    // --------------------------------------------------------
    const description = "The 'Cyber-Renaissance' Da Vinci Multi-Barrel Volley Cannon. A hyper-advanced reimagining of Leonardo da Vinci's iconic weapon design. This massive artillery unit features an 11-barrel fan array infused with magnetic acceleration coils and plasma bores. It is mounted on a colossal heavy wooden and iron-plated carriage, rolling on huge iron-banded wheels. Complete with precision gear-driven elevating wedges, dual helical recoil dampeners, and a computational glass ignition matrix, this is a masterpiece of Renaissance-futurism engineering.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Elevating Wedge Mechanism and Master Gear Train?",
            options: [
                "To rotate the main wheels for transport",
                "To adjust the precise pitch and firing elevation of the 11-barrel array",
                "To absorb kinetic recoil after firing",
                "To pump plasma fluid into the manifold"
            ],
            correctAnswer: 1,
            explanation: "The heavily threaded screw and wedge block translate the crank's rotational motion into very fine vertical adjustments, changing the trajectory of the projectiles."
        },
        {
            question: "Why are the main wheels heavily banded with iron and equipped with steel treads?",
            options: [
                "For aerodynamic speed on the battlefield",
                "To support the multi-ton weight and anchor the weapon into the ground against immense recoil shock",
                "Purely for aesthetic Renaissance appeal",
                "To generate electricity through friction"
            ],
            correctAnswer: 1,
            explanation: "The sheer mass of the carriage and the violent kinetic shockwave of a full 11-barrel volley require extreme structural reinforcement and ground-gripping treads to prevent the cannon from flying backward."
        },
        {
            question: "What purpose does the Trail Spade serve at the rear of the carriage chassis?",
            options: [
                "It digs deep into the earth to prevent dangerous backward sliding during a volley",
                "It is a towing hitch for horses or mechanical oxen",
                "It acts as a counterbalance for the heavy plasma reservoirs",
                "It provides a step for the operator to reach the control matrix"
            ],
            correctAnswer: 0,
            explanation: "The trail spade acts as a heavy anchor. When the cannon fires, the massive rearward force drives the spade deeper into the ground, stabilizing the entire weapon system."
        },
        {
            question: "How does the barrel array maximize battlefield coverage?",
            options: [
                "By rotating rapidly like a Gatling gun",
                "By firing highly explosive shells straight up like a mortar",
                "By arranging the barrels in a wide fan-shape (72-degree spread) to hit a broad horizontal front simultaneously",
                "By utilizing homing plasma projectiles"
            ],
            correctAnswer: 2,
            explanation: "Da Vinci's original design specifically fanned the barrels out horizontally so that a single coordinated volley could devastate a wide, advancing enemy line without needing to pan the weapon."
        },
        {
            question: "In this 'Cyber-Renaissance' version, what advanced system replaces traditional black powder and flintlock fuses?",
            options: [
                "A slow-burning matchlock string",
                "An illuminated computational matrix coordinating magnetic acceleration coils and plasma fluid",
                "A simple mechanical spring hammer mechanism",
                "Pressurized steam valves"
            ],
            correctAnswer: 1,
            explanation: "The Ignition Control Matrix uses advanced computational sequences to perfectly time the injection of super-heated plasma and the activation of magnetic coils, creating a devastating 'ripple' fire effect."
        }
    ];

    let animationTime = 0;
    
    function animate(time, speed, meshes) {
        animationTime += speed * 0.015;
        
        // 1. Aiming crank and master gear rotation
        crankGroup.children[0].rotation.z = animationTime * 2; // Master Gear
        crankGroup.children[1].rotation.x = animationTime * 2; // Wheel
        
        // 2. Elevating wedge oscillating slowly to simulate aiming adjustments
        const aimElevation = Math.sin(animationTime * 0.4) * 1.5; 
        wedgeGroup.children[0].position.z = -1.5 + aimElevation; // Wedge block moves
        
        // 3. Barrel array elevation mapped to wedge position
        barrelArray.rotation.x = -aimElevation * 0.15;
        
        // 4. Fire Sequence / Ripple Effect
        // The barrels "fire" in rapid sequence from left to right, recoiling individually
        for(let i=0; i<barrelMeshes.length; i++) {
            const bData = barrelMeshes[i];
            const phase = i * 0.3; // sequential offset
            const fireCycle = (animationTime * 6 + phase) % (Math.PI * 6); // Fire cycle timing
            
            if(fireCycle < Math.PI) {
                // Firing & Recoiling state
                const recoil = Math.sin(fireCycle) * 1.2;
                bData.group.position.z = bData.baseZ - recoil;
                
                // Piston compresses
                bData.piston.position.z = -1 + (recoil * 0.8);
                
                // Flash the inner plasma core intensely
                if(bData.core && bData.core.material) {
                    bData.core.material.emissiveIntensity = 2.5 + Math.sin(fireCycle) * 8;
                }
            } else {
                // Reset/Cooling state
                bData.group.position.z = bData.baseZ;
                bData.piston.position.z = -1;
                
                if(bData.core && bData.core.material) {
                    // Pulsing idle glow
                    bData.core.material.emissiveIntensity = 1.5 + Math.sin(animationTime * 2 + i) * 0.5;
                }
            }
        }
        
        // 5. Very subtle carriage rumbling/vibration when firing
        // Firing phase for any barrel causes global shake
        const globalFireCycle = (animationTime * 6) % (Math.PI * 6);
        if(globalFireCycle < Math.PI + (numBarrels * 0.3)) {
            carriageGroup.position.x = (Math.random() - 0.5) * 0.08;
            carriageGroup.position.y = 3.5 + (Math.random() - 0.5) * 0.04;
        } else {
            carriageGroup.position.x = 0;
            carriageGroup.position.y = 3.5;
        }

        // 6. Slowly rotate main wheels to simulate the cannon being rolled/aimed horizontally
        wheelLeft.rotation.x = Math.sin(animationTime * 0.2) * 0.5;
        wheelRight.rotation.x = Math.sin(animationTime * 0.2) * 0.5;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createMultiBarrelCannon() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
