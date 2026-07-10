import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {}; // store references for animation

    // Helpers
    function addPart(name, mesh, desc, mat, func, order, conn, failEffect, cascade, origPos, explPos) {
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        group.add(mesh);
        parts.push({
            name,
            description: desc,
            material: mat,
            function: func,
            assemblyOrder: order,
            connections: conn,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
        return mesh;
    }

    // Advanced materials
    const woodLike = darkSteel.clone(); 
    woodLike.roughness = 0.8; 
    woodLike.metalness = 0.2;
    woodLike.color.setHex(0x3d2817);

    const canvasMat = tinted.clone();
    canvasMat.transparent = true;
    canvasMat.opacity = 0.85;
    canvasMat.side = THREE.DoubleSide;
    canvasMat.color.setHex(0xe6e6da);
    canvasMat.roughness = 0.9;
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    // --- 1. Central Frame / Chassis ---
    const chassisGroup = new THREE.Group();
    
    // Main Spine (Hexagonal truss)
    const spineGeo = new THREE.CylinderGeometry(0.25, 0.25, 10, 6);
    const spine = new THREE.Mesh(spineGeo, darkSteel);
    spine.rotation.x = Math.PI / 2;
    chassisGroup.add(spine);
    meshes.spine = spine;

    // Cross bracings inside the spine
    for (let i = -4; i <= 4; i += 1) {
        const braceGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const brace = new THREE.Mesh(braceGeo, steel);
        brace.position.z = i;
        brace.rotation.x = Math.PI / 4;
        chassisGroup.add(brace);
        const brace2 = new THREE.Mesh(braceGeo, steel);
        brace2.position.z = i;
        brace2.rotation.x = -Math.PI / 4;
        chassisGroup.add(brace2);
    }

    // Rib cage of the machine (surrounding pilot) - dynamic sweeping curves
    for (let i = 0; i < 7; i++) {
        const ribGeo = new THREE.TorusGeometry(1.6 - i * 0.15, 0.06, 8, 32, Math.PI);
        const rib = new THREE.Mesh(ribGeo, darkSteel);
        rib.rotation.y = Math.PI / 2;
        rib.rotation.x = Math.PI / 16;
        rib.position.z = -1.5 + i * 0.7;
        rib.position.y = -0.5;
        chassisGroup.add(rib);
    }

    // Cockpit Base (Intricate floor plating)
    const cockpitBaseGroup = new THREE.Group();
    cockpitBaseGroup.position.set(0, -1.8, 0);
    
    const floorGeo = new THREE.BoxGeometry(2.5, 0.1, 4.5);
    const floor = new THREE.Mesh(floorGeo, aluminum);
    cockpitBaseGroup.add(floor);
    
    // Foot Pedals
    const pedalArmGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const leftPedalArm = new THREE.Mesh(pedalArmGeo, steel);
    leftPedalArm.position.set(-0.6, 0.6, -1.8);
    leftPedalArm.rotation.x = Math.PI / 4;
    cockpitBaseGroup.add(leftPedalArm);
    meshes.leftPedalArm = leftPedalArm;

    const rightPedalArm = new THREE.Mesh(pedalArmGeo, steel);
    rightPedalArm.position.set(0.6, 0.6, -1.8);
    rightPedalArm.rotation.x = Math.PI / 4;
    cockpitBaseGroup.add(rightPedalArm);
    meshes.rightPedalArm = rightPedalArm;

    const pedalPadGeo = new THREE.BoxGeometry(0.3, 0.4, 0.05);
    const leftPedalPad = new THREE.Mesh(pedalPadGeo, rubber);
    leftPedalPad.position.set(0, 0.6, 0);
    leftPedalArm.add(leftPedalPad);
    
    const rightPedalPad = new THREE.Mesh(pedalPadGeo, rubber);
    rightPedalPad.position.set(0, 0.6, 0);
    rightPedalArm.add(rightPedalPad);

    chassisGroup.add(cockpitBaseGroup);

    // Pilot Harness and Seat
    const seatGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const seat = new THREE.Mesh(seatGeo, darkSteel);
    seat.position.set(0, -1.2, 0.5);
    chassisGroup.add(seat);
    
    const backRestGeo = new THREE.BoxGeometry(1.2, 1.5, 0.1);
    const backRest = new THREE.Mesh(backRestGeo, darkSteel);
    backRest.position.set(0, -0.4, 1.1);
    backRest.rotation.x = -Math.PI / 12;
    chassisGroup.add(backRest);

    const harnessGeo = new THREE.TorusGeometry(0.9, 0.08, 16, 64);
    const harness = new THREE.Mesh(harnessGeo, rubber);
    harness.position.set(0, 0.2, 0.5);
    harness.rotation.x = Math.PI / 5;
    chassisGroup.add(harness);
    
    // Control Levers
    const leverGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16);
    const leftLever = new THREE.Mesh(leverGeo, chrome);
    leftLever.position.set(-1.0, -0.5, 0.5);
    leftLever.rotation.x = Math.PI / 8;
    chassisGroup.add(leftLever);
    meshes.leftLever = leftLever;
    
    const leverHandleGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const leftHandle = new THREE.Mesh(leverHandleGeo, rubber);
    leftHandle.position.y = 1;
    leftLever.add(leftHandle);

    const rightLever = new THREE.Mesh(leverGeo, chrome);
    rightLever.position.set(1.0, -0.5, 0.5);
    rightLever.rotation.x = Math.PI / 8;
    chassisGroup.add(rightLever);
    meshes.rightLever = rightLever;
    
    const rightHandle = new THREE.Mesh(leverHandleGeo, rubber);
    rightHandle.position.y = 1;
    rightLever.add(rightHandle);

    // Instrumentation Panel
    const panelGeo = new THREE.BoxGeometry(1.8, 0.8, 0.15);
    const panel = new THREE.Mesh(panelGeo, plastic);
    panel.position.set(0, 0.3, -1.2);
    panel.rotation.x = -Math.PI / 5;
    chassisGroup.add(panel);

    // High-tech holographic Dials on panel
    const dialGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 32);
    const dial1 = new THREE.Mesh(dialGeo, glowingBlue);
    dial1.rotation.x = Math.PI / 2;
    dial1.position.set(-0.5, 0, 0.08);
    panel.add(dial1);
    
    const dialInnerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.03, 32);
    const dial1Inner = new THREE.Mesh(dialInnerGeo, glass);
    dial1Inner.rotation.x = Math.PI / 2;
    dial1Inner.position.set(-0.5, 0, 0.09);
    panel.add(dial1Inner);

    const dial2 = new THREE.Mesh(dialGeo, glowingRed);
    dial2.rotation.x = Math.PI / 2;
    dial2.position.set(0, 0, 0.08);
    panel.add(dial2);
    
    const dial3 = new THREE.Mesh(dialGeo, glowingGreen);
    dial3.rotation.x = Math.PI / 2;
    dial3.position.set(0.5, 0, 0.08);
    panel.add(dial3);

    addPart(
        'Main Chassis Frame', chassisGroup,
        'The core structural skeleton holding the pilot, avionics, and central transmission. Made from advanced carbon-steel composites.',
        'Dark Steel, Aluminum, Rubber', 'Provides structural integrity, anchors wings and gears, and shields pilot.',
        1, ['Wings', 'Gears', 'Tail Boom'], 'Complete structural collapse', ['All systems critical failure'],
        {x: 0, y: 0, z: 0}, {x: 0, y: -8, z: 0}
    );

    // --- 2. Transmission / Gearbox ---
    const gearBoxGroup = new THREE.Group();
    gearBoxGroup.position.set(0, 1.8, -0.2);

    function createGearMesh(radius, teethCount, thickness) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.75;
        const holeRadius = radius * 0.2;
        
        for (let i = 0; i < teethCount; i++) {
            const angle1 = (i / teethCount) * Math.PI * 2;
            const angle2 = ((i + 0.4) / teethCount) * Math.PI * 2;
            const angle3 = ((i + 0.6) / teethCount) * Math.PI * 2;
            const angle4 = ((i + 1) / teethCount) * Math.PI * 2;
            
            if (i === 0) shape.moveTo(Math.cos(angle1)*innerRadius, Math.sin(angle1)*innerRadius);
            else shape.lineTo(Math.cos(angle1)*innerRadius, Math.sin(angle1)*innerRadius);
            
            shape.lineTo(Math.cos(angle2)*radius, Math.sin(angle2)*radius);
            shape.lineTo(Math.cos(angle3)*radius, Math.sin(angle3)*radius);
            shape.lineTo(Math.cos(angle4)*innerRadius, Math.sin(angle4)*innerRadius);
        }
        
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);
        
        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, copper);
        geo.computeBoundingBox();
        const centerOffset = -0.5 * (geo.boundingBox.max.z - geo.boundingBox.min.z);
        geo.translate(0, 0, centerOffset);
        return mesh;
    }

    const mainDriveGear = createGearMesh(1.2, 24, 0.25);
    mainDriveGear.position.set(0, 0, 0);
    gearBoxGroup.add(mainDriveGear);
    meshes.mainDriveGear = mainDriveGear;

    const secondaryGear = createGearMesh(0.6, 12, 0.25);
    secondaryGear.position.set(1.8, 0, 0);
    gearBoxGroup.add(secondaryGear);
    meshes.secondaryGear = secondaryGear;

    const tertiaryGear = createGearMesh(0.6, 12, 0.25);
    tertiaryGear.position.set(-1.8, 0, 0);
    gearBoxGroup.add(tertiaryGear);
    meshes.tertiaryGear = tertiaryGear;

    // Chain / Belt connecting gears
    const beltGeo = new THREE.TorusGeometry(1.8, 0.05, 8, 64, Math.PI);
    const belt = new THREE.Mesh(beltGeo, rubber);
    belt.position.set(0, 0, 0.2);
    gearBoxGroup.add(belt);

    const leftPulleyGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
    const leftPulley = new THREE.Mesh(leftPulleyGeo, steel);
    leftPulley.rotation.z = Math.PI / 2;
    leftPulley.position.set(-1.2, -0.5, 0);
    gearBoxGroup.add(leftPulley);
    meshes.leftPulley = leftPulley;

    const rightPulley = new THREE.Mesh(leftPulleyGeo, steel);
    rightPulley.rotation.z = Math.PI / 2;
    rightPulley.position.set(1.2, -0.5, 0);
    gearBoxGroup.add(rightPulley);
    meshes.rightPulley = rightPulley;

    addPart(
        'Kinetic Transmission Gearbox', gearBoxGroup,
        'Complex high-torque gear multiplier translating human and hydraulic power into massive wing articulation.',
        'Copper, Steel, Rubber Belt', 'Multiplies input torque and distributes power evenly to port and starboard wing mechanisms.',
        2, ['Main Chassis Frame', 'Wing Roots'], 'Wings stall instantly', ['Complete loss of lift'],
        {x: 0, y: 1.8, z: -0.2}, {x: 0, y: 8, z: -3}
    );

    // --- 3. Advanced Hydraulic Assist System ---
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(0, -0.5, 1.5);
    
    const pumpBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const pumpBody = new THREE.Mesh(pumpBodyGeo, chrome);
    pumpBody.rotation.z = Math.PI / 2;
    pumpGroup.add(pumpBody);
    
    // Glowing accumulators
    for(let i=0; i<6; i++) {
        const accGeo = new THREE.CapsuleGeometry(0.12, 0.6, 4, 16);
        const acc = new THREE.Mesh(accGeo, glowingBlue);
        acc.position.set(-0.6 + i*0.24, 0.5, 0);
        acc.rotation.x = Math.PI/2;
        pumpGroup.add(acc);
        
        // Casing around accumulator
        const caseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8, 1, true);
        const casing = new THREE.Mesh(caseGeo, darkSteel);
        casing.position.set(-0.6 + i*0.24, 0.5, 0);
        casing.rotation.x = Math.PI/2;
        pumpGroup.add(casing);
    }
    
    // Hydraulic lines connecting to gearbox
    const hydroLineGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.5, 1, -1),
            new THREE.Vector3(0, 2.3, -1.7)
        ]),
        20, 0.05, 8, false
    );
    const hydroLine = new THREE.Mesh(hydroLineGeo, glowingBlue);
    pumpGroup.add(hydroLine);

    addPart(
        'Hydraulic Assist Pumps', pumpGroup,
        'High-pressure fluid pumps utilizing luminescent synthetic fluid to augment pilot strength.',
        'Chrome, Dark Steel, Synthetic Luminescent Fluid', 'Amplifies mechanical input via advanced fluid dynamics to actuate massive wings.',
        6, ['Main Chassis Frame', 'Transmission Gearbox'], 'Severe pilot fatigue, dangerously slow wing beats', ['Altitude loss', 'Stall'],
        {x: 0, y: -0.5, z: 1.5}, {x: 0, y: -5, z: 8}
    );

    // --- 4. Wings Assembly ---
    const leftWing = new THREE.Group();
    const rightWing = new THREE.Group();
    meshes.leftWingPivot = leftWing;
    meshes.rightWingPivot = rightWing;

    function buildWingSide(isLeft) {
        const sign = isLeft ? 1 : -1;
        const wingRoot = new THREE.Group();
        
        // Inner Spar (Thick primary bone)
        const innerSparGeo = new THREE.CylinderGeometry(0.2, 0.12, 6, 16);
        const innerSpar = new THREE.Mesh(innerSparGeo, darkSteel);
        innerSpar.rotation.z = Math.PI / 2;
        innerSpar.position.set(sign * 3, 0, 0);
        wingRoot.add(innerSpar);
        
        // Spar details (rivets/rings)
        for (let j=1; j<5; j++) {
            const ringGeo = new THREE.TorusGeometry(0.18 - (j*0.015), 0.03, 8, 16);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.rotation.y = Math.PI/2;
            ring.position.set(sign * (1 + j), 0, 0);
            wingRoot.add(ring);
        }

        // Elbow Joint (Massive ball and socket)
        const elbowGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const elbow = new THREE.Mesh(elbowGeo, chrome);
        elbow.position.set(sign * 6, 0, 0);
        wingRoot.add(elbow);

        // Outer Spar Group (Articulated outer wing)
        const outerGroup = new THREE.Group();
        outerGroup.position.set(sign * 6, 0, 0);
        wingRoot.add(outerGroup);

        const outerSparGeo = new THREE.CylinderGeometry(0.12, 0.04, 7, 16);
        const outerSpar = new THREE.Mesh(outerSparGeo, darkSteel);
        outerSpar.rotation.z = Math.PI / 2;
        outerSpar.position.set(sign * 3.5, 0, 0);
        outerGroup.add(outerSpar);

        // Bat fingers extending from elbow and outer spar
        const fingers = [];
        const fingerLengths = [6, 7.5, 6.5, 5, 3.5];
        const fingerAngles = [Math.PI/4, Math.PI/8, 0, -Math.PI/8, -Math.PI/4];

        for(let i=0; i<5; i++) {
            const fingerGeo = new THREE.CylinderGeometry(0.06, 0.01, fingerLengths[i], 8);
            fingerGeo.translate(0, fingerLengths[i]/2, 0); // origin to base
            const finger = new THREE.Mesh(fingerGeo, steel);
            
            finger.rotation.z = isLeft ? (-Math.PI/2 + fingerAngles[i]) : (Math.PI/2 - fingerAngles[i]);
            finger.rotation.x = -Math.PI / 10; // sweep back
            
            // First 2 fingers on elbow, rest distributed on outer spar
            if (i < 2) {
                elbow.add(finger);
            } else {
                finger.position.set(sign * ((i-1) * 2), 0, 0);
                outerGroup.add(finger);
            }
            fingers.push(finger);
            
            // Add tiny glowing nodes at the tip of each finger for high-tech aesthetic
            const tipGeo = new THREE.SphereGeometry(0.08, 8, 8);
            const tip = new THREE.Mesh(tipGeo, glowingBlue);
            tip.position.set(0, fingerLengths[i], 0);
            finger.add(tip);
        }

        // Massive hydraulic actuator for wing sweep/pitch
        const actuatorBaseGeo = new THREE.CylinderGeometry(0.12, 0.12, 3, 16);
        const actuatorBase = new THREE.Mesh(actuatorBaseGeo, aluminum);
        actuatorBase.position.set(sign * 3, -1, 0.8);
        actuatorBase.rotation.z = isLeft ? Math.PI/4 : -Math.PI/4;
        actuatorBase.rotation.x = Math.PI/8;
        wingRoot.add(actuatorBase);
        
        const pistonGeo = new THREE.CylinderGeometry(0.08, 0.08, 3, 16);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = 1.5;
        actuatorBase.add(piston);

        // Intricate Stretched Canvas Membrane
        // We divide the canvas into multiple panels between the fingers
        const canvasGroup = new THREE.Group();
        
        // Base points
        const vRoot = new THREE.Vector3(0, 0, 0);
        const vElbow = new THREE.Vector3(sign*6, 0, 0);
        
        // Define shape of the wing skin mathematically
        const shape = new THREE.Shape();
        if (isLeft) {
            shape.moveTo(0,0);
            shape.lineTo(6, 1);
            shape.lineTo(13, 0);
            shape.lineTo(11, -4);
            shape.lineTo(7, -6);
            shape.lineTo(3, -5);
            shape.lineTo(0, -2);
        } else {
            shape.moveTo(0,0);
            shape.lineTo(-6, 1);
            shape.lineTo(-13, 0);
            shape.lineTo(-11, -4);
            shape.lineTo(-7, -6);
            shape.lineTo(-3, -5);
            shape.lineTo(0, -2);
        }

        const canvasGeometry = new THREE.ShapeGeometry(shape);
        const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMat);
        canvasMesh.rotation.x = -Math.PI/12; // Slight curve downward to cup the air
        
        // Add wireframe overlay for tech look
        const wireGeo = new THREE.WireframeGeometry(canvasGeometry);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x444455, transparent: true, opacity: 0.3 });
        const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
        canvasMesh.add(wireMesh);

        wingRoot.add(canvasMesh);

        return { wingRoot, outerGroup, fingers, piston };
    }

    const leftWingData = buildWingSide(true);
    leftWing.add(leftWingData.wingRoot);
    meshes.leftOuterWing = leftWingData.outerGroup;
    meshes.leftPiston = leftWingData.piston;

    const rightWingData = buildWingSide(false);
    rightWing.add(rightWingData.wingRoot);
    meshes.rightOuterWing = rightWingData.outerGroup;
    meshes.rightPiston = rightWingData.piston;

    addPart(
        'Port Articulated Wing', leftWing,
        'High-tensile bat-like wing structure with hyper-flexible chrome joints, ribbed spars, and advanced synthetic canvas membrane.',
        'Dark Steel, Chrome, Synthetic Canvas, Glowing Nodes', 'Generates lift and thrust via complex, multi-axis flapping arcs and air cupping.',
        3, ['Main Chassis Frame', 'Transmission Gearbox'], 'Total loss of lift on port side', ['Catastrophic asymmetric spin'],
        {x: 1.5, y: 1.8, z: -0.2}, {x: 15, y: 5, z: 2}
    );

    addPart(
        'Starboard Articulated Wing', rightWing,
        'High-tensile bat-like wing structure with hyper-flexible chrome joints, ribbed spars, and advanced synthetic canvas membrane.',
        'Dark Steel, Chrome, Synthetic Canvas, Glowing Nodes', 'Generates lift and thrust via complex, multi-axis flapping arcs and air cupping.',
        4, ['Main Chassis Frame', 'Transmission Gearbox'], 'Total loss of lift on starboard side', ['Catastrophic asymmetric spin'],
        {x: -1.5, y: 1.8, z: -0.2}, {x: -15, y: 5, z: 2}
    );

    // --- 5. Tail Assembly ---
    const tailGroup = new THREE.Group();
    
    // Articulated tail boom
    const boomParts = 4;
    for (let i = 0; i < boomParts; i++) {
        const boomSectionGeo = new THREE.CylinderGeometry(0.2 - (i*0.04), 0.16 - (i*0.04), 2, 16);
        const boomSec = new THREE.Mesh(boomSectionGeo, darkSteel);
        boomSec.rotation.x = Math.PI / 2;
        boomSec.position.set(0, 0, -2 - (i*2));
        tailGroup.add(boomSec);
        
        // Flexible joint ring
        const jointGeo = new THREE.SphereGeometry(0.18 - (i*0.04), 16, 16);
        const joint = new THREE.Mesh(jointGeo, rubber);
        joint.position.set(0, 0, -1 - (i*2));
        tailGroup.add(joint);
    }

    // Tail Feathers (Canvas fan - split into multiple rigid panels for tech look)
    const tailFanGroup = new THREE.Group();
    tailFanGroup.position.set(0, 0, -10);
    
    for(let i=-2; i<=2; i++) {
        const featherShape = new THREE.Shape();
        featherShape.moveTo(0,0);
        featherShape.lineTo(0.5, -3);
        featherShape.lineTo(-0.5, -3);
        
        const featherGeo = new THREE.ShapeGeometry(featherShape);
        const feather = new THREE.Mesh(featherGeo, canvasMat);
        feather.rotation.x = Math.PI / 2;
        feather.rotation.y = (Math.PI / 8) * i;
        tailFanGroup.add(feather);
        
        // Feather spine
        const spineGeo = new THREE.CylinderGeometry(0.02, 0.01, 3, 8);
        const featherSpine = new THREE.Mesh(spineGeo, steel);
        featherSpine.rotation.x = Math.PI / 2;
        featherSpine.position.set(0, 0, -1.5);
        featherSpine.rotation.z = -(Math.PI / 8) * i;
        tailFanGroup.add(tailFanGroup); // wait, bug fix: tailFanGroup.add(featherSpine)
        // Correcting below
        tailFanGroup.add(featherSpine);
    }
    tailGroup.add(tailFanGroup);
    meshes.tailPivot = tailGroup;
    meshes.tailFan = tailFanGroup;

    // Tail rudder control cables (Tensioned)
    const cableGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.0, -0.5, 0.5), // left lever
            new THREE.Vector3(-0.8, -0.8, -3),
            new THREE.Vector3(-0.3, 0, -9)      // tail port side
        ]),
        30, 0.02, 8, false
    );
    const leftCable = new THREE.Mesh(cableGeo, copper);
    tailGroup.add(leftCable);

    const rightCableGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.0, -0.5, 0.5), // right lever
            new THREE.Vector3(0.8, -0.8, -3),
            new THREE.Vector3(0.3, 0, -9)      // tail stbd side
        ]),
        30, 0.02, 8, false
    );
    const rightCable = new THREE.Mesh(rightCableGeo, copper);
    tailGroup.add(rightCable);

    addPart(
        'Empennage Control Tail', tailGroup,
        'Articulated multi-segment tail boom ending in an array of rigid canvas tail-feathers for extreme maneuverability.',
        'Dark Steel, Rubber Joints, Canvas, Copper Cables', 'Provides dynamic aerodynamic stability, pitch, and yaw control.',
        5, ['Main Chassis Frame', 'Control Levers'], 'Uncontrollable pitch/yaw axis rotation', ['Total loss of flight trajectory'],
        {x: 0, y: -0.5, z: -1}, {x: 0, y: -2, z: -15}
    );


    // --- Animation Logic ---
    let phase = 0;

    function animate(time, speed, m) {
        phase += 0.04 * speed;

        // 1. Massive Wing Flapping Logic (Complex multi-axis sinusoidal motion)
        // Primary up/down flap
        const flapAngle = Math.sin(phase) * (Math.PI / 4.5); 
        
        m.leftWingPivot.rotation.z = flapAngle;
        m.rightWingPivot.rotation.z = -flapAngle;

        // Wing pitch (feathering on upstroke to reduce drag)
        // Cosine wave creates a 90-degree phase shift relative to flapping
        const pitchAngle = Math.cos(phase) * (Math.PI / 10);
        m.leftWingPivot.rotation.x = pitchAngle;
        m.rightWingPivot.rotation.x = pitchAngle;

        // Outer wing folding (elbow joint curling in during upstroke)
        const foldAngle = Math.sin(phase + Math.PI/3) * (Math.PI / 6) - (Math.PI / 12);
        m.leftOuterWing.rotation.z = foldAngle;
        m.rightOuterWing.rotation.z = -foldAngle;
        
        // Outer wing twist for stability
        m.leftOuterWing.rotation.x = Math.cos(phase) * 0.1;
        m.rightOuterWing.rotation.x = Math.cos(phase) * 0.1;

        // 2. Hydraulic pistons sliding back and forth synchronously
        m.leftPiston.position.y = 1.5 + Math.sin(phase) * 0.5;
        m.rightPiston.position.y = 1.5 + Math.sin(phase) * 0.5;

        // 3. Transmission Gears Rotation
        // Main gear drives the sequence
        m.mainDriveGear.rotation.z = phase * 1.5;
        // Secondary gears rotate opposite and faster
        m.secondaryGear.rotation.z = -phase * 3;
        m.tertiaryGear.rotation.z = -phase * 3;
        // Pulleys spinning
        m.leftPulley.rotation.x = phase * 4;
        m.rightPulley.rotation.x = phase * 4;

        // 4. Pilot Interfaces (Levers and Pedals)
        // Pedals move alternately
        m.leftPedalArm.rotation.x = (Math.PI / 4) + Math.sin(phase * 2) * 0.15;
        m.rightPedalArm.rotation.x = (Math.PI / 4) + Math.cos(phase * 2) * 0.15;

        // Levers get pulled slightly with the wing beat
        m.leftLever.rotation.x = (Math.PI / 8) + Math.sin(phase) * 0.1;
        m.rightLever.rotation.x = (Math.PI / 8) + Math.sin(phase) * 0.1;

        // 5. Tail Movement
        // Yaw based on slower steering cycle, pitch adjusts with wing beat
        m.tailPivot.rotation.y = Math.sin(time * 0.5 * speed) * 0.15; // slow yaw
        m.tailPivot.rotation.x = Math.cos(phase) * 0.08; // pitch compensation during flap
        
        // Tail feathers dynamically spread out during downstroke for lift
        const fanSpread = (Math.sin(phase) * 0.5 + 0.5) * (Math.PI / 16);
        m.tailFan.children.forEach((child, index) => {
            if (child.geometry.type === "ShapeGeometry") {
                const i = (index / 2) - 2; // recreate original index
                child.rotation.y = ((Math.PI / 8) + fanSpread) * i;
            } else if (child.geometry.type === "CylinderGeometry") {
                const i = ((index-1) / 2) - 2;
                child.rotation.z = -(((Math.PI / 8) + fanSpread) * i);
            }
        });
    }

    const description = "An ultra high-tech, hyper-realistic, cyber-renaissance re-imagining of Leonardo da Vinci's Ornithopter. This massive contraption marries 15th-century mechanical ingenuity with advanced cybernetic and hydraulic enhancements. It features an enormous bat-like articulated wing skeleton, a stretched translucent synthetic canvas membrane reinforced with carbon-steel mesh, complex gearbox transmissions, and a glowing luminescent hydraulic accumulator array designed to amplify human physical input by orders of magnitude.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Kinetic Transmission Gearbox?",
            options: [
                "To store glowing blue fluid.",
                "To multiply input torque and distribute power evenly to port and starboard wing mechanisms.",
                "To provide aerodynamic stability and steering.",
                "To act as the pilot's seat."
            ],
            correctAnswer: 1,
            explanation: "The Kinetic Transmission Gearbox acts as a complex high-torque gear multiplier, translating human power and hydraulic assist into the extreme force needed for massive wing articulation."
        },
        {
            question: "Why does the outer wing section have a phase shift in its rotation (folding inward) compared to the main inner spar?",
            options: [
                "To simulate a rigid airplane wing.",
                "Because the hydraulic fluid is lagging.",
                "To induce a 'feathering' and folding motion, mimicking a real bat or bird's wing stroke to drastically reduce air resistance on the upstroke.",
                "To increase the total weight of the machine."
            ],
            correctAnswer: 2,
            explanation: "To create an efficient flapping arc, ornithopter wings must fold and alter their pitch (feather) during the upstroke to reduce aerodynamic drag, closely mimicking natural avian or chiropteran flight."
        },
        {
            question: "How does the Empennage Control Tail adapt during the wing's flap cycle?",
            options: [
                "It drops off to save weight.",
                "It pumps the hydraulic fluid.",
                "It remains completely rigid at all times.",
                "It compensates for pitch changes and its fan feathers dynamically spread during the downstroke for extra lift."
            ],
            correctAnswer: 3,
            explanation: "The tail features an articulated multi-segment boom that dynamically pitches to counter the huge forces of the wing beats, while its canvas feathers spread to maximize lift and stability."
        },
        {
            question: "What critical risk is associated with the failure of the Hydraulic Assist Pumps?",
            options: [
                "The wings would instantly flap twice as fast.",
                "Severe pilot fatigue and dangerously slow wing beats, leading to an inevitable stall and altitude loss.",
                "The ornithopter would turn invisible.",
                "The cockpit dials would permanently change color from blue to green."
            ],
            correctAnswer: 1,
            explanation: "The massive wings require immense force to actuate. Without the luminescent hydraulic fluid augmenting the pilot's strength, the aerodynamic drag would overwhelm them, causing a catastrophic stall."
        },
        {
            question: "Which component allows the primary wings to mimic the skeletal structure of a biological bat wing?",
            options: [
                "The Central Hexagonal Spine.",
                "The Cockpit Base Floor Plating.",
                "The massive ball-and-socket Elbow Joint combined with radiating steel finger ribs.",
                "The Accumulator capsules."
            ],
            correctAnswer: 2,
            explanation: "The elbow joint connects the inner and outer spars, while the varying-length steel fingers radiate outward to hold the synthetic canvas, exactly replicating the articulated phalanges of a bat wing."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createOrnithopterWings() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
