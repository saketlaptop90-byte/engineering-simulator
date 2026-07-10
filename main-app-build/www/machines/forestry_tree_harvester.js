import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2
    });

    const glowingScreen = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.9,
        metalness: 0.5,
        roughness: 0.1
    });

    // High detail tire with hundreds of lugs
    function createForestryTire() {
        const tireGroup = new THREE.Group();
        
        const torusGeom = new THREE.TorusGeometry( 4.5, 2.5, 32, 64 );
        const tireMesh = new THREE.Mesh(torusGeom, rubber);
        tireMesh.rotation.y = Math.PI / 2;
        tireGroup.add(tireMesh);

        const treadGeom = new THREE.BoxGeometry( 5.2, 1.2, 1.8 );
        const numLugs = 72;
        for(let i=0; i<numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(treadGeom, rubber);
            const radius = 6.8;
            lug.position.set( 0, Math.cos(angle) * radius, Math.sin(angle) * radius );
            lug.rotation.x = angle;
            lug.rotation.z = (i % 2 === 0) ? 0.35 : -0.35;
            lug.rotation.y = Math.PI / 2;
            tireGroup.add(lug);
        }

        const rimGeom = new THREE.CylinderGeometry( 2.8, 2.8, 4.8, 32 );
        const rim = new THREE.Mesh(rimGeom, steel);
        rim.rotation.x = Math.PI / 2;
        rim.rotation.z = Math.PI / 2;
        tireGroup.add(rim);

        const spokeGeom = new THREE.BoxGeometry(0.5, 5.6, 1.5);
        for(let j=0; j<12; j++) {
            const spoke = new THREE.Mesh(spokeGeom, darkSteel);
            spoke.rotation.x = (j / 12) * Math.PI;
            spoke.rotation.y = Math.PI / 2;
            tireGroup.add(spoke);
        }

        const hubGeom = new THREE.CylinderGeometry( 0.8, 0.8, 5.2, 16 );
        const hub = new THREE.Mesh(hubGeom, chrome);
        hub.rotation.x = Math.PI / 2;
        hub.rotation.z = Math.PI / 2;
        tireGroup.add(hub);

        for(let k=0; k<12; k++) {
            const boltGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8);
            const bolt = new THREE.Mesh(boltGeom, darkSteel);
            const ba = (k / 12) * Math.PI * 2;
            bolt.position.set( 2.5, Math.cos(ba) * 1.5, Math.sin(ba) * 1.5 );
            bolt.rotation.z = Math.PI / 2;
            tireGroup.add(bolt);

            const bolt2 = bolt.clone();
            bolt2.position.x = -2.5;
            tireGroup.add(bolt2);
        }
        
        return tireGroup;
    }

    // Rear Chassis (Engine housing)
    const rearChassisGroup = new THREE.Group();
    rearChassisGroup.position.set( -12, 5, 0 );
    
    // Extrude chassis shape with intricate curves
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo( -8, -2 );
    chassisShape.lineTo( 4, -2 );
    chassisShape.lineTo( 5, 3 );
    chassisShape.lineTo( 3, 5 );
    chassisShape.lineTo( -7, 5 );
    chassisShape.lineTo( -8, -2 );

    const extrudeSettings = { depth: 6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.3, bevelThickness: 0.3 };
    const rearBodyGeom = new THREE.ExtrudeGeometry( chassisShape, extrudeSettings );
    const rearBody = new THREE.Mesh(rearBodyGeom, neonOrange);
    rearBody.position.z = -3;
    rearChassisGroup.add(rearBody);

    // Radiator Grilles
    const grilleGeom = new THREE.BoxGeometry( 4, 3, 6.2 );
    const grille = new THREE.Mesh( grilleGeom, darkSteel );
    grille.position.set( -5, 1, 0 );
    
    for(let g=0; g<16; g++) {
        const lineGeom = new THREE.BoxGeometry( 0.2, 2.8, 6.3 );
        const line = new THREE.Mesh(lineGeom, steel);
        line.position.set( -3.5 - (g*0.2), 1, 0 );
        rearChassisGroup.add(line);
    }
    rearChassisGroup.add(grille);

    // Exhaust System with dual stacks
    const exhaustBaseGeom = new THREE.BoxGeometry( 2, 2, 1.5 );
    const exhaustBase = new THREE.Mesh(exhaustBaseGeom, darkSteel);
    exhaustBase.position.set( 1, 6, -1.5 );
    rearChassisGroup.add(exhaustBase);

    const exhaustGeom = new THREE.CylinderGeometry( 0.4, 0.4, 4, 16 );
    const exhaust1 = new THREE.Mesh(exhaustGeom, chrome);
    exhaust1.position.set( 1, 8, -1 );
    rearChassisGroup.add(exhaust1);
    
    const exhaust2 = new THREE.Mesh(exhaustGeom, chrome);
    exhaust2.position.set( 1, 8, -2 );
    rearChassisGroup.add(exhaust2);

    const exhaustCapGeom = new THREE.CylinderGeometry( 0.4, 0.4, 1, 16 );
    const cap1 = new THREE.Mesh(exhaustCapGeom, chrome);
    cap1.position.set( 1, 10, -1 );
    cap1.rotation.x = Math.PI / 4;
    rearChassisGroup.add(cap1);

    const cap2 = new THREE.Mesh(exhaustCapGeom, chrome);
    cap2.position.set( 1, 10, -2 );
    cap2.rotation.x = Math.PI / 4;
    rearChassisGroup.add(cap2);

    group.add(rearChassisGroup);

    // Articulation Joint
    const articulationGroup = new THREE.Group();
    articulationGroup.position.set( -7, 5, 0 );
    const jointGeom = new THREE.CylinderGeometry( 1.5, 1.5, 4, 32 );
    const joint = new THREE.Mesh(jointGeom, darkSteel);
    articulationGroup.add(joint);

    // Heavy duty steering cylinders
    const jointHydraulicGeom = new THREE.CylinderGeometry( 0.6, 0.6, 4, 16 );
    const jHyd1 = new THREE.Mesh(jointHydraulicGeom, neonOrange);
    jHyd1.position.set( -2, 0, 2.5 );
    jHyd1.rotation.z = Math.PI / 2;
    articulationGroup.add(jHyd1);
    
    const jHyd1Inner = new THREE.Mesh( new THREE.CylinderGeometry(0.3, 0.3, 4, 16), chrome );
    jHyd1Inner.position.set( -4, 0, 2.5 );
    jHyd1Inner.rotation.z = Math.PI / 2;
    articulationGroup.add(jHyd1Inner);
    
    const jHyd2 = new THREE.Mesh(jointHydraulicGeom, neonOrange);
    jHyd2.position.set( -2, 0, -2.5 );
    jHyd2.rotation.z = Math.PI / 2;
    articulationGroup.add(jHyd2);
    
    const jHyd2Inner = new THREE.Mesh( new THREE.CylinderGeometry(0.3, 0.3, 4, 16), chrome );
    jHyd2Inner.position.set( -4, 0, -2.5 );
    jHyd2Inner.rotation.z = Math.PI / 2;
    articulationGroup.add(jHyd2Inner);
    
    group.add(articulationGroup);

    // Front Chassis
    const frontChassisGroup = new THREE.Group();
    frontChassisGroup.position.set( 2, 5, 0 );
    
    const fChassisShape = new THREE.Shape();
    fChassisShape.moveTo( -4, -2 );
    fChassisShape.lineTo( 6, -2 );
    fChassisShape.lineTo( 8, 1 );
    fChassisShape.lineTo( 4, 3 );
    fChassisShape.lineTo( -4, 3 );
    fChassisShape.lineTo( -4, -2 );

    const fBodyGeom = new THREE.ExtrudeGeometry( fChassisShape, extrudeSettings );
    const fBody = new THREE.Mesh(fBodyGeom, darkSteel);
    fBody.position.z = -3;
    frontChassisGroup.add(fBody);
    
    // Front Bumper and Lights
    const bumperGeom = new THREE.BoxGeometry( 1, 2, 6.5 );
    const bumper = new THREE.Mesh(bumperGeom, darkSteel);
    bumper.position.set( 8.5, 0, 0 );
    frontChassisGroup.add(bumper);
    
    const lightGeom = new THREE.BoxGeometry( 0.2, 0.8, 1.2 );
    const light1 = new THREE.Mesh(lightGeom, glowingScreen);
    light1.position.set( 9.1, 0, 2 );
    frontChassisGroup.add(light1);
    
    const light2 = new THREE.Mesh(lightGeom, glowingScreen);
    light2.position.set( 9.1, 0, -2 );
    frontChassisGroup.add(light2);

    group.add(frontChassisGroup);

    // Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set( 0, 8, 0 );
    
    const cabBaseGeom = new THREE.BoxGeometry( 6, 1, 6 );
    const cabBase = new THREE.Mesh(cabBaseGeom, darkSteel);
    cabinGroup.add(cabBase);

    // Complex Cab Frame
    const postGeom = new THREE.BoxGeometry( 0.6, 6, 0.6 );
    const postPositions = [
        [-2.7, 3, 2.7], [2.7, 3, 2.7],
        [-2.7, 3, -2.7], [2.7, 3, -2.7]
    ];
    postPositions.forEach(pos => {
        const post = new THREE.Mesh(postGeom, neonOrange);
        post.position.set(...pos);
        cabinGroup.add(post);
    });

    const roofGeom = new THREE.BoxGeometry( 6.4, 0.8, 6.4 );
    const roof = new THREE.Mesh(roofGeom, neonOrange);
    roof.position.set( 0, 6.4, 0 );
    cabinGroup.add(roof);

    // Windows
    const windowFrontGeom = new THREE.BoxGeometry( 0.1, 5.5, 5.5 );
    const windowFront = new THREE.Mesh(windowFrontGeom, tinted);
    windowFront.position.set( 2.7, 3, 0 );
    cabinGroup.add(windowFront);

    const windowBack = windowFront.clone();
    windowBack.position.set( -2.7, 3, 0 );
    cabinGroup.add(windowBack);

    const windowSideGeom = new THREE.BoxGeometry( 5.5, 5.5, 0.1 );
    const windowLeft = new THREE.Mesh(windowSideGeom, tinted);
    windowLeft.position.set( 0, 3, 2.7 );
    cabinGroup.add(windowLeft);

    const windowRight = windowLeft.clone();
    windowRight.position.set( 0, 3, -2.7 );
    cabinGroup.add(windowRight);
    
    // Protective Window Grates (Front)
    const grateGeom = new THREE.CylinderGeometry(0.05, 0.05, 5.8, 8);
    for(let w=0; w<8; w++) {
        const grate = new THREE.Mesh(grateGeom, darkSteel);
        grate.position.set( 2.9, 3, -2.4 + (w * 0.7) );
        grate.rotation.x = Math.PI / 2;
        cabinGroup.add(grate);
    }
    for(let w=0; w<8; w++) {
        const grate = new THREE.Mesh(grateGeom, darkSteel);
        grate.position.set( 2.9, 0.5 + (w * 0.7), 0 );
        cabinGroup.add(grate);
    }

    // Interior Controls
    const seatGeom = new THREE.BoxGeometry( 2, 2.5, 2 );
    const seat = new THREE.Mesh(seatGeom, plastic);
    seat.position.set( -1, 1.75, 0 );
    cabinGroup.add(seat);

    const joystickGeom = new THREE.CylinderGeometry( 0.1, 0.1, 1, 8 );
    const joystickLeft = new THREE.Mesh(joystickGeom, plastic);
    joystickLeft.position.set( 0, 2, 1.2 );
    joystickLeft.rotation.z = Math.PI / 8;
    cabinGroup.add(joystickLeft);
    meshes.joystickLeft = joystickLeft;

    const joystickRight = joystickLeft.clone();
    joystickRight.position.set( 0, 2, -1.2 );
    cabinGroup.add(joystickRight);
    meshes.joystickRight = joystickRight;

    const consoleGeom = new THREE.BoxGeometry( 1.5, 1, 3 );
    const controlConsole = new THREE.Mesh(consoleGeom, darkSteel);
    controlConsole.position.set( 1.5, 1.5, 0 );
    cabinGroup.add(controlConsole);

    const screenGeom = new THREE.BoxGeometry( 0.1, 1, 1.5 );
    const screen = new THREE.Mesh(screenGeom, glowingScreen);
    screen.position.set( 1.4, 2.5, 0 );
    screen.rotation.z = -Math.PI / 6;
    cabinGroup.add(screen);

    frontChassisGroup.add(cabinGroup);

    // Ladders and Handrails
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set( -3, -2, 3 );
    const ladderSideGeom = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    const lSide1 = new THREE.Mesh(ladderSideGeom, steel);
    lSide1.position.set(0, 3, 0);
    ladderGroup.add(lSide1);
    const lSide2 = new THREE.Mesh(ladderSideGeom, steel);
    lSide2.position.set(1.5, 3, 0);
    ladderGroup.add(lSide2);
    for(let step=1; step<6; step++) {
        const stepGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const stp = new THREE.Mesh(stepGeom, steel);
        stp.position.set(0.75, step, 0);
        stp.rotation.z = Math.PI / 2;
        ladderGroup.add(stp);
    }
    frontChassisGroup.add(ladderGroup);

    // Wheels
    const tireFL = createForestryTire();
    tireFL.position.set( 3, -2, 5.5 );
    frontChassisGroup.add(tireFL);
    meshes.tireFL = tireFL;

    const tireFR = createForestryTire();
    tireFR.position.set( 3, -2, -5.5 );
    frontChassisGroup.add(tireFR);
    meshes.tireFR = tireFR;

    const tireRL = createForestryTire();
    tireRL.position.set( -4, -2, 5.5 );
    rearChassisGroup.add(tireRL);
    meshes.tireRL = tireRL;

    const tireRR = createForestryTire();
    tireRR.position.set( -4, -2, -5.5 );
    rearChassisGroup.add(tireRR);
    meshes.tireRR = tireRR;

    // Main Crane Base
    const craneBaseGroup = new THREE.Group();
    craneBaseGroup.position.set( 6, 3, 0 );
    
    const turntableGeom = new THREE.CylinderGeometry( 2.5, 2.5, 1, 32 );
    const turntable = new THREE.Mesh(turntableGeom, darkSteel);
    craneBaseGroup.add(turntable);

    const boomMountGeom = new THREE.BoxGeometry( 2, 4, 2 );
    const boomMount = new THREE.Mesh(boomMountGeom, neonOrange);
    boomMount.position.set( 0, 2.5, 0 );
    craneBaseGroup.add(boomMount);

    frontChassisGroup.add(craneBaseGroup);
    meshes.craneBase = craneBaseGroup;

    // Main Boom (Using complex shapes)
    const mainBoomGroup = new THREE.Group();
    mainBoomGroup.position.set( 0, 4, 0 );
    
    const mBoomShape = new THREE.Shape();
    mBoomShape.moveTo( -1.5, -1.5 );
    mBoomShape.lineTo( 14, -0.8 );
    mBoomShape.lineTo( 14, 1.5 );
    mBoomShape.lineTo( -1.5, 2.5 );
    mBoomShape.lineTo( -1.5, -1.5 );
    
    const mBoomBodyGeom = new THREE.ExtrudeGeometry( mBoomShape, { depth: 1.2, bevelEnabled: true } );
    const mBoomBody = new THREE.Mesh(mBoomBodyGeom, neonOrange);
    mBoomBody.position.z = -0.6;
    mainBoomGroup.add(mBoomBody);
    
    // Add side panels/reinforcements to main boom
    const panelGeom = new THREE.BoxGeometry( 10, 1.5, 1.4 );
    const panel = new THREE.Mesh(panelGeom, darkSteel);
    panel.position.set( 6, 0.5, 0 );
    mainBoomGroup.add(panel);

    craneBaseGroup.add(mainBoomGroup);
    meshes.mainBoom = mainBoomGroup;

    // Main Boom Cylinders (Dual)
    for(let cy=0; cy<2; cy++) {
        const yOff = cy === 0 ? 0.7 : -0.7;
        const mainHydraulicOuter = new THREE.Mesh( new THREE.CylinderGeometry(0.4, 0.4, 7, 16), darkSteel );
        mainHydraulicOuter.position.set( 4, -2, yOff );
        mainHydraulicOuter.rotation.z = Math.PI / 2 + 0.25;
        mainBoomGroup.add(mainHydraulicOuter);

        const mainHydraulicInner = new THREE.Mesh( new THREE.CylinderGeometry(0.2, 0.2, 7, 16), chrome );
        mainHydraulicInner.position.set( 8, -1, yOff );
        mainHydraulicInner.rotation.z = Math.PI / 2 + 0.25;
        mainBoomGroup.add(mainHydraulicInner);
    }

    // Stick Boom
    const stickBoomGroup = new THREE.Group();
    stickBoomGroup.position.set( 14, 0.5, 0 );
    
    const sBoomShape = new THREE.Shape();
    sBoomShape.moveTo( -1.5, -1.5 );
    sBoomShape.lineTo( 12, -0.5 );
    sBoomShape.lineTo( 12, 0.5 );
    sBoomShape.lineTo( -1.5, 1.5 );
    sBoomShape.lineTo( -1.5, -1.5 );

    const sBoomBodyGeom = new THREE.ExtrudeGeometry( sBoomShape, { depth: 1.0, bevelEnabled: true } );
    const sBoomBody = new THREE.Mesh(sBoomBodyGeom, darkSteel);
    sBoomBody.position.z = -0.5;
    stickBoomGroup.add(sBoomBody);
    
    mainBoomGroup.add(stickBoomGroup);
    meshes.stickBoom = stickBoomGroup;

    // Stick Boom Cylinders (Top mounted)
    const stickHydraulicOuter = new THREE.Mesh( new THREE.CylinderGeometry(0.4, 0.4, 6, 16), neonOrange );
    stickHydraulicOuter.position.set( -2, 2.5, 0 );
    stickHydraulicOuter.rotation.z = Math.PI / 2 - 0.2;
    stickBoomGroup.add(stickHydraulicOuter);

    const stickHydraulicInner = new THREE.Mesh( new THREE.CylinderGeometry(0.25, 0.25, 6, 16), chrome );
    stickHydraulicInner.position.set( 2, 2.5, 0 );
    stickHydraulicInner.rotation.z = Math.PI / 2 - 0.2;
    stickBoomGroup.add(stickHydraulicInner);

    // Harvester Head Base
    const harvesterGroup = new THREE.Group();
    harvesterGroup.position.set( 12, 0, 0 );
    
    // Rotator linkage
    const rotatorLinkGeom = new THREE.CylinderGeometry( 0.4, 0.4, 2, 16 );
    const rotatorLink = new THREE.Mesh(rotatorLinkGeom, darkSteel);
    harvesterGroup.add(rotatorLink);

    const rotatorGeom = new THREE.CylinderGeometry( 0.8, 0.8, 1.8, 32 );
    const rotator = new THREE.Mesh(rotatorGeom, steel);
    rotator.position.set( 0, -1, 0 );
    rotator.rotation.z = Math.PI / 2;
    harvesterGroup.add(rotator);

    const headBodyGeom = new THREE.BoxGeometry( 2.5, 5, 2.5 );
    const headBody = new THREE.Mesh(headBodyGeom, neonOrange);
    headBody.position.set( 0, -3.5, 0 );
    harvesterGroup.add(headBody);

    // Electronics / Valve Box on head
    const valveBox = new THREE.Mesh( new THREE.BoxGeometry(1.5, 2, 1.5), darkSteel );
    valveBox.position.set( 0.5, -2, 0 );
    harvesterGroup.add(valveBox);

    stickBoomGroup.add(harvesterGroup);
    meshes.harvesterHead = harvesterGroup;

    // Feed Rollers
    const rollerGeom = new THREE.CylinderGeometry( 1.2, 1.2, 1.5, 32 );
    const rollerL = new THREE.Mesh(rollerGeom, neonOrange);
    rollerL.position.set( 0.5, -3.5, 1.8 );
    rollerL.rotation.x = Math.PI / 2;
    harvesterGroup.add(rollerL);
    meshes.rollerL = rollerL;

    const rollerR = new THREE.Mesh(rollerGeom, neonOrange);
    rollerR.position.set( 0.5, -3.5, -1.8 );
    rollerR.rotation.x = Math.PI / 2;
    harvesterGroup.add(rollerR);
    meshes.rollerR = rollerR;

    // Roller Spikes (Hundreds of details)
    const spikeGeom = new THREE.ConeGeometry(0.1, 0.4, 4);
    for(let r=0; r<18; r++) {
        for(let c=0; c<4; c++) {
            const angle = (r/18) * Math.PI * 2;
            const zOff = -0.5 + (c * 0.33);
            
            const spikeL = new THREE.Mesh(spikeGeom, chrome);
            spikeL.position.set( Math.cos(angle) * 1.3, zOff, Math.sin(angle) * 1.3 );
            spikeL.rotation.x = angle;
            rollerL.add(spikeL);

            const spikeR = new THREE.Mesh(spikeGeom, chrome);
            spikeR.position.set( Math.cos(angle) * 1.3, zOff, Math.sin(angle) * 1.3 );
            spikeR.rotation.x = angle;
            rollerR.add(spikeR);
        }
    }

    // Delimbing Knives
    const knifeShape = new THREE.Shape();
    knifeShape.moveTo( 0, 0 );
    knifeShape.lineTo( 2.5, 1 );
    knifeShape.lineTo( 3.5, 3 );
    knifeShape.lineTo( 2.8, 3.8 );
    knifeShape.lineTo( 0.5, 1.5 );
    knifeShape.lineTo( 0, 0 );

    const knifeGeom = new THREE.ExtrudeGeometry( knifeShape, { depth: 0.3, bevelEnabled: true } );
    
    // Top knives
    const knifeTopL = new THREE.Mesh(knifeGeom, chrome);
    knifeTopL.position.set( -0.5, -1.5, 0.8 );
    knifeTopL.rotation.y = Math.PI / 2;
    harvesterGroup.add(knifeTopL);

    const knifeTopR = new THREE.Mesh(knifeGeom, chrome);
    knifeTopR.position.set( -0.5, -1.5, -0.8 );
    knifeTopR.rotation.y = -Math.PI / 2;
    harvesterGroup.add(knifeTopR);
    
    // Bottom knife
    const knifeBottom = new THREE.Mesh(knifeGeom, chrome);
    knifeBottom.position.set( -0.5, -5, 0.8 );
    knifeBottom.rotation.y = Math.PI / 2;
    knifeBottom.rotation.z = Math.PI; // upside down
    harvesterGroup.add(knifeBottom);

    // Chainsaw
    const sawBox = new THREE.Group();
    sawBox.position.set( -0.5, -5.5, 0 );
    
    const sawHousing = new THREE.Mesh( new THREE.BoxGeometry( 1.5, 1.5, 1.5 ), neonOrange );
    sawBox.add(sawHousing);

    const barGeom = new THREE.BoxGeometry( 4, 0.1, 0.8 );
    const sawBar = new THREE.Mesh(barGeom, darkSteel);
    sawBar.position.set( 2, 0, 0 );
    sawBox.add(sawBar);

    const chainGeom = new THREE.TorusGeometry( 0.4, 0.05, 8, 64, Math.PI * 2 );
    const sawChain = new THREE.Mesh(chainGeom, chrome);
    sawChain.scale.set( 5.5, 1, 0.9 );
    sawChain.position.set( 2, 0, 0 );
    sawChain.rotation.x = Math.PI / 2;
    sawBox.add(sawChain);
    meshes.sawChain = sawChain;
    meshes.sawBox = sawBox;

    harvesterGroup.add(sawBox);

    // Hydraulic Hoses / Lines (TubeGeometry)
    class HoseCurve extends THREE.Curve {
        constructor(x1,y1,x2,y2, drop) {
            super();
            this.v1 = new THREE.Vector3(x1, y1, 0);
            this.v2 = new THREE.Vector3(x2, y2, 0);
            this.drop = drop;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const p = new THREE.Vector3().lerpVectors(this.v1, this.v2, t);
            p.y -= Math.sin(t * Math.PI) * this.drop; // sag
            return optionalTarget.copy(p);
        }
    }
    
    const tubeMat = new THREE.MeshStandardMaterial( { color: 0x111111, roughness: 0.9, metalness: 0.1 } );
    for(let h=0; h<6; h++) {
        const path = new HoseCurve(0, 0, 14, 0, 2 + Math.random());
        const hose = new THREE.Mesh( new THREE.TubeGeometry(path, 32, 0.1, 8, false), tubeMat );
        hose.position.set( 0, 1.5, -0.6 + (h * 0.2) );
        mainBoomGroup.add(hose);
    }
    for(let h=0; h<4; h++) {
        const path = new HoseCurve(0, 0, 12, 0, 1.5 + Math.random());
        const hose = new THREE.Mesh( new THREE.TubeGeometry(path, 32, 0.08, 8, false), tubeMat );
        hose.position.set( 0, 0.5, -0.3 + (h * 0.2) );
        stickBoomGroup.add(hose);
    }

    // Define Parts
    parts.push({
        name: "Rear Engine Chassis",
        description: "Contains the high-torque, turbo-diesel engine, hydraulic pumps, and massive cooling radiators.",
        material: "Neon Orange Steel, Dark Steel",
        function: "Provides complete hydraulic and motive power; acts as a heavy counterweight for the crane.",
        assemblyOrder: 1,
        connections: ["Articulation Joint", "Rear Wheels", "Exhaust Stacks"],
        failureEffect: "Complete loss of power and hydraulics. Machine becomes a paperweight.",
        cascadeFailures: ["Complete machine shutdown", "Overheating if cooling fails"],
        originalPosition: rearChassisGroup.position.clone(),
        explodedPosition: new THREE.Vector3( -30, 5, 0 )
    });
    parts.push({
        name: "Articulation Joint",
        description: "Heavy-duty dual-axis hinge with massive hydraulic steering cylinders.",
        material: "Dark Steel, Chrome Pistons",
        function: "Allows the machine to bend in the middle for tight steering and terrain compliance.",
        assemblyOrder: 2,
        connections: ["Rear Engine Chassis", "Front Chassis"],
        failureEffect: "Loss of steering ability.",
        cascadeFailures: ["Hydraulic fluid leak", "Loss of maneuverability"],
        originalPosition: articulationGroup.position.clone(),
        explodedPosition: new THREE.Vector3( -10, 15, 15 )
    });
    parts.push({
        name: "Front Chassis & Cabin Platform",
        description: "Rigid steel frame supporting the operator cabin, main crane turntable, and front axle.",
        material: "Dark Steel",
        function: "Main support platform for the operator and processing crane.",
        assemblyOrder: 3,
        connections: ["Articulation Joint", "Operator Cabin", "Main Crane Base", "Front Wheels"],
        failureEffect: "Structural collapse.",
        cascadeFailures: ["Crane detachment", "Cabin crush"],
        originalPosition: frontChassisGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 10, 5, 0 )
    });
    parts.push({
        name: "Operator Cabin",
        description: "Ergonomic, sound-proof control center with reinforced tinted glass, glowing control screens, and dual joysticks.",
        material: "Neon Orange Steel, Tinted Glass, Glowing Screens",
        function: "Protects the operator and houses all complex control electronics and interfaces.",
        assemblyOrder: 4,
        connections: ["Front Chassis"],
        failureEffect: "Loss of operator safety and control input.",
        cascadeFailures: ["Control system offline"],
        originalPosition: cabinGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 0, 25, 0 )
    });
    parts.push({
        name: "Main Crane Turntable & Base",
        description: "Massive slew bearing and reinforced boom mount.",
        material: "Dark Steel, Neon Orange Steel",
        function: "Provides 360-degree continuous rotation for the entire crane assembly.",
        assemblyOrder: 5,
        connections: ["Front Chassis", "Main Boom"],
        failureEffect: "Crane cannot rotate to reach trees.",
        cascadeFailures: ["Slew gear stripping"],
        originalPosition: craneBaseGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 5, 15, 0 )
    });
    parts.push({
        name: "Main Boom",
        description: "Heavy steel lifting arm, powered by dual immense hydraulic cylinders.",
        material: "Neon Orange Steel, Chrome",
        function: "Lifts extreme weights and provides primary vertical reach into the canopy.",
        assemblyOrder: 6,
        connections: ["Main Crane Turntable & Base", "Stick Boom"],
        failureEffect: "Catastrophic drop of crane and timber.",
        cascadeFailures: ["Hydraulic blowouts", "Stick boom damage"],
        originalPosition: mainBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 20, 20, 0 )
    });
    parts.push({
        name: "Stick Boom",
        description: "Secondary articulating arm equipped with independent hydraulics for precision.",
        material: "Dark Steel",
        function: "Extends reach horizontally and precisely positions the harvester head.",
        assemblyOrder: 7,
        connections: ["Main Boom", "Harvester Head Base"],
        failureEffect: "Loss of reach and fine positioning.",
        cascadeFailures: [],
        originalPosition: stickBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 35, 25, 0 )
    });
    parts.push({
        name: "Harvester Head Electronics & Rotator",
        description: "Complex rotating mount and electronic control valve box for the harvester head.",
        material: "Dark Steel, Steel",
        function: "Allows the head to dangle freely, rotate precisely, and routes computer signals to valves.",
        assemblyOrder: 8,
        connections: ["Stick Boom", "Harvester Head Body"],
        failureEffect: "Head hangs limply, valves do not actuate.",
        cascadeFailures: ["Complete head failure"],
        originalPosition: harvesterGroup.position.clone(),
        explodedPosition: new THREE.Vector3( 50, 20, 0 )
    });
    parts.push({
        name: "Harvester Head Body",
        description: "The main core of the processing head, holding the knives, rollers, and saw.",
        material: "Neon Orange Steel",
        function: "Grapples the tree trunk and provides structural support for processing tools.",
        assemblyOrder: 9,
        connections: ["Harvester Head Electronics & Rotator", "Feed Rollers", "Delimbing Knives", "Bucking Chainsaw"],
        failureEffect: "Tools fall apart, cannot hold tree.",
        cascadeFailures: ["Dropped timber"],
        originalPosition: headBody.position.clone(), // local
        explodedPosition: new THREE.Vector3( 50, 10, 0 )
    });
    parts.push({
        name: "Left & Right Feed Rollers",
        description: "Large hydraulic-driven drums completely covered in aggressive chrome spikes.",
        material: "Neon Orange, Chrome Spikes",
        function: "Grips the tree trunk with immense force and drives it linearly through the head at high speed.",
        assemblyOrder: 10,
        connections: ["Harvester Head Body"],
        failureEffect: "Cannot feed the tree through the knives.",
        cascadeFailures: ["Tree jams in head"],
        originalPosition: rollerL.position.clone(),
        explodedPosition: new THREE.Vector3( 50, 5, 10 )
    });
    parts.push({
        name: "Upper Delimbing Knives",
        description: "Curved, ultra-sharp chrome steel blades that hug the tree trunk.",
        material: "Chrome",
        function: "Shears off thick branches instantly as the tree is fed through by the rollers.",
        assemblyOrder: 11,
        connections: ["Harvester Head Body"],
        failureEffect: "Leaves branches attached, preventing feeding and bucking.",
        cascadeFailures: ["Roller damage from thick branches"],
        originalPosition: knifeTopL.position.clone(),
        explodedPosition: new THREE.Vector3( 50, 15, 5 )
    });
    parts.push({
        name: "Bottom Delimbing Knife",
        description: "Fixed curved blade at the base of the head.",
        material: "Chrome",
        function: "Clears lower branches and supports the weight of the trunk during feeding.",
        assemblyOrder: 12,
        connections: ["Harvester Head Body"],
        failureEffect: "Poor delimbing quality on the underside.",
        cascadeFailures: [],
        originalPosition: knifeBottom.position.clone(),
        explodedPosition: new THREE.Vector3( 50, -5, 5 )
    });
    parts.push({
        name: "Bucking Chainsaw & Housing",
        description: "High-speed hydraulic chainsaw with a massive bar and heavy-duty chain, enclosed in a protective box.",
        material: "Neon Orange Steel, Dark Steel, Chrome Chain",
        function: "Fells the tree and cuts (bucks) the processed trunk into exact, computer-measured lengths.",
        assemblyOrder: 13,
        connections: ["Harvester Head Body"],
        failureEffect: "Cannot fell or cut trees.",
        cascadeFailures: ["Saw bar bending", "Chain snap"],
        originalPosition: sawBox.position.clone(),
        explodedPosition: new THREE.Vector3( 50, -10, -5 )
    });
    parts.push({
        name: "Front Forestry Tires",
        description: "Two massive wheels with aggressive tread lugs, mounted on heavy steel rims.",
        material: "Rubber, Steel, Chrome",
        function: "Provides primary traction and supports the immense weight of the crane and timber.",
        assemblyOrder: 14,
        connections: ["Front Chassis"],
        failureEffect: "Immobilization and tilt of front frame.",
        cascadeFailures: ["Crane instability"],
        originalPosition: tireFL.position.clone(),
        explodedPosition: new THREE.Vector3( 10, -10, 20 )
    });
    parts.push({
        name: "Rear Forestry Tires",
        description: "Two massive wheels on the engine chassis side.",
        material: "Rubber, Steel, Chrome",
        function: "Provides drive power and supports the heavy engine counterweight.",
        assemblyOrder: 15,
        connections: ["Rear Engine Chassis"],
        failureEffect: "Immobilization of the rear power unit.",
        cascadeFailures: ["Loss of terrain capability"],
        originalPosition: tireRL.position.clone(),
        explodedPosition: new THREE.Vector3( -20, -10, 20 )
    });

    const description = "A gargantuan, ultra high-tech Forestry Harvester. Designed for brutal environments, this machine features massive aggressive terrain tires, a heavy articulated chassis, and a highly complex, computer-controlled processor head capable of grappling, felling, delimbing, and bucking multi-ton timber in mere seconds. No blocky shapes here—every hydraulic line, spiked roller, and curved blade is modeled for hyper-realism.";

    const quizQuestions = [
        {
            question: "What is the primary function of the spiked Feed Rollers on the harvester head?",
            options: [
                "To cut the tree down.",
                "To grip and rapidly pull the tree trunk through the delimbing knives.",
                "To steer the vehicle.",
                "To measure the tree's moisture content."
            ],
            correctAnswer: 1,
            explanation: "Feed rollers have aggressive steel spikes that bite into the bark, pulling the trunk linearly through the curved delimbing knives at high speed."
        },
        {
            question: "Why does the machine utilize an articulated center joint rather than standard steering axles?",
            options: [
                "To look more aggressive.",
                "To allow the engine to detach.",
                "To provide extreme steering angles and keep all wheels planted on rugged terrain.",
                "To store extra fuel in the middle."
            ],
            correctAnswer: 2,
            explanation: "An articulated chassis allows these massive machines to maneuver tight forest paths and twist independently to keep all wheels grounded on highly uneven terrain."
        },
        {
            question: "What prevents this machine from tipping over forward when lifting heavy timber at full reach?",
            options: [
                "Magic.",
                "The immense weight of the engine, pumps, and rear chassis acts as a perfect counterweight.",
                "Deployable outriggers.",
                "Helium balloons in the tires."
            ],
            correctAnswer: 1,
            explanation: "The rear chassis houses the massive turbo-diesel engine, cooling systems, and hydraulic pumps. This extreme mass acts as a counterbalance against the leverage of the extended boom and heavy timber."
        },
        {
            question: "What material characteristic is critical for the delimbing knives?",
            options: [
                "High electrical conductivity",
                "High-strength alloy steel to maintain a sharp edge under massive impact",
                "Lightweight plastic construction",
                "High thermal expansion"
            ],
            correctAnswer: 1,
            explanation: "High-strength alloy steel (often chromed for durability and friction reduction) is required to forcefully sheer off thick branches without dulling, bending, or breaking."
        },
        {
            question: "How is the incredibly fast bucking chainsaw powered?",
            options: [
                "A battery pack in the harvester head.",
                "High-pressure hydraulic fluid pumped from the main engine.",
                "A small gasoline engine mounted on the saw itself.",
                "A manual pull-cord system."
            ],
            correctAnswer: 1,
            explanation: "The chainsaw, like the rollers and boom cylinders, is driven by a high-power hydraulic motor, which receives fluid via thick hoses from the immense pumps located in the rear engine chassis."
        }
    ];

    function animate(time, speed, m) {
        const t = time * speed;
        
        // Drive wheels
        m.tireFL.rotation.x = t * 2;
        m.tireFR.rotation.x = t * 2;
        m.tireRL.rotation.x = t * 2;
        m.tireRR.rotation.x = t * 2;
        
        // Base steering wobble (simulating driving over terrain)
        m.craneBase.rotation.y = Math.sin(t * 0.5) * 0.6;
        
        // Main boom up/down
        m.mainBoom.rotation.z = (Math.sin(t * 0.8) * 0.25) + 0.3;
        
        // Stick boom extension/contraction
        m.stickBoom.rotation.z = (Math.cos(t * 0.9) * 0.3) - 0.1;

        // Harvester head dangling and rotating
        m.harvesterHead.rotation.x = Math.sin(t * 1.5) * 0.15;
        m.harvesterHead.rotation.z = Math.cos(t * 1.2) * 0.15;
        
        // Rollers spinning rapidly (simulating feeding a tree)
        m.rollerL.rotation.y = t * 10;
        m.rollerR.rotation.y = -t * 10;

        // Chainsaw chain texture/rotation trick (spinning torus)
        m.sawChain.rotation.z = t * 20;

        // Animate the bucking saw swinging down and back up
        const sawSwing = Math.sin(t * 2); // -1 to 1
        if(sawSwing > 0) {
            m.sawBox.rotation.z = sawSwing * 1.5; // swings down
        } else {
            m.sawBox.rotation.z = 0; // rests
        }

        // Animate Joysticks in cabin
        m.joystickLeft.rotation.x = Math.sin(t * 3) * 0.2;
        m.joystickRight.rotation.z = Math.cos(t * 2.5) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate: (t,s) => animate(t,s,meshes) };
}

// Auto-generated missing stub
export function createTreeHarvester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
