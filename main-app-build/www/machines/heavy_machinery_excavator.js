import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper: Extruded part
    const createExtrudedPart = (shape, depth, mat) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.03,
            bevelThickness: 0.03
        });
        geo.center();
        return new THREE.Mesh(geo, mat);
    };

    const tempVec1 = new THREE.Vector3();
    const tempVec2 = new THREE.Vector3();

    // 1. Undercarriage Frame
    const undercarriage = new THREE.Group();
    group.add(undercarriage);

    const frameShape = new THREE.Shape();
    frameShape.moveTo(-2.5, -1.2);
    frameShape.lineTo(2.5, -1.2);
    frameShape.lineTo(1.8, 1.2);
    frameShape.lineTo(-1.8, 1.2);
    frameShape.lineTo(-2.5, -1.2);
    
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {depth: 2.8, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1});
    frameGeo.center();
    frameGeo.rotateX(Math.PI / 2);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    undercarriage.add(frameMesh);
    
    // Support Beams
    const beamGeo = new THREE.CylinderGeometry(0.4, 0.4, 5, 32).rotateZ(Math.PI / 2);
    const beam1 = new THREE.Mesh(beamGeo, steel);
    beam1.position.set(0, -0.2, 1.8);
    const beam2 = new THREE.Mesh(beamGeo, steel);
    beam2.position.set(0, -0.2, -1.8);
    undercarriage.add(beam1, beam2);

    meshes.undercarriage = undercarriage;

    // 2 & 3. Tracks
    const trackLeft = new THREE.Group();
    trackLeft.position.set(0, -0.5, 2.8);
    const trackRight = new THREE.Group();
    trackRight.position.set(0, -0.5, -2.8);
    undercarriage.add(trackLeft, trackRight);

    const buildTrack = (parentGroup) => {
        const trackInnerShape = new THREE.Shape();
        trackInnerShape.moveTo(-3, -0.5);
        trackInnerShape.lineTo(3, -0.5);
        trackInnerShape.quadraticCurveTo(3.5, -0.5, 3.5, 0);
        trackInnerShape.lineTo(3.5, 0.5);
        trackInnerShape.quadraticCurveTo(3.5, 1, 3, 1);
        trackInnerShape.lineTo(-3, 1);
        trackInnerShape.quadraticCurveTo(-3.5, 1, -3.5, 0.5);
        trackInnerShape.lineTo(-3.5, 0);
        trackInnerShape.quadraticCurveTo(-3.5, -0.5, -3, -0.5);
        
        const trackInnerGeo = new THREE.ExtrudeGeometry(trackInnerShape, {depth: 1.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05});
        trackInnerGeo.center();
        const trackInner = new THREE.Mesh(trackInnerGeo, darkSteel);
        parentGroup.add(trackInner);

        const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.4, 32).rotateX(Math.PI / 2);
        
        // Sprocket
        const sprocket = new THREE.Group();
        sprocket.position.set(-3.8, 0, 0);
        const sprocketCore = new THREE.Mesh(wheelGeo, darkSteel);
        sprocket.add(sprocketCore);
        for(let i=0; i<22; i++) {
            const tooth = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 1.4, 8).rotateX(Math.PI/2), steel);
            tooth.position.set(Math.cos(i*Math.PI*2/22)*1.2, Math.sin(i*Math.PI*2/22)*1.2, 0);
            tooth.rotation.z = i*Math.PI*2/22;
            sprocket.add(tooth);
        }
        
        // Idler
        const idler = new THREE.Mesh(wheelGeo, steel);
        idler.position.set(3.8, 0, 0);
        
        parentGroup.add(sprocket, idler);

        // Rollers
        for(let i = -2.8; i <= 2.8; i += 1.4) {
            const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16).rotateX(Math.PI/2), chrome);
            roller.position.set(i, -1.1, 0);
            parentGroup.add(roller);
        }
        for(let i = -2.5; i <= 2.5; i += 2.5) {
            const topRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16).rotateX(Math.PI/2), chrome);
            topRoller.position.set(i, 1.1, 0);
            parentGroup.add(topRoller);
        }

        // Track Shoes
        const shoesGroup = new THREE.Group();
        parentGroup.add(shoesGroup);
        const shoeList = [];
        
        const shoeShape = new THREE.Shape();
        shoeShape.moveTo(-0.45, -0.1);
        shoeShape.lineTo(0.45, -0.1);
        shoeShape.lineTo(0.4, 0.15);
        shoeShape.lineTo(-0.4, 0.15);
        shoeShape.lineTo(-0.45, -0.1);
        const shoeGeo = new THREE.ExtrudeGeometry(shoeShape, {depth: 1.8, bevelEnabled:true, bevelThickness:0.02, bevelSize:0.02});
        shoeGeo.center();

        const numShoes = 44;
        const radius = 1.25;
        const straightLen = 7.6;
        const perimeter = (2 * Math.PI * radius) + (2 * straightLen);
        const spacing = perimeter / numShoes;

        for(let i=0; i<numShoes; i++) {
            const shoe = new THREE.Group();
            const shoeBase = new THREE.Mesh(shoeGeo, darkSteel);
            shoe.add(shoeBase);
            
            // Tread grips
            for(let j=-0.6; j<=0.6; j+=0.6) {
                const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.3, 8).rotateX(Math.PI/2), steel);
                grip.position.set(0, 0.15, j);
                shoe.add(grip);
            }
            
            shoesGroup.add(shoe);
            shoeList.push(shoe);
        }

        return { sprocket, idler, shoesGroup, shoeList, straightLen, radius, perimeter };
    };

    meshes.leftTrackData = buildTrack(trackLeft);
    meshes.rightTrackData = buildTrack(trackRight);

    // 4. Slew Ring
    const slewRingGroup = new THREE.Group();
    slewRingGroup.position.set(0, 1.1, 0);
    undercarriage.add(slewRingGroup);
    
    const slewGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 64);
    const slewMesh = new THREE.Mesh(slewGeo, steel);
    slewRingGroup.add(slewMesh);

    const gearGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.7, 32);
    const gearMesh = new THREE.Mesh(gearGeo, chrome);
    slewRingGroup.add(gearMesh);

    // 5. House
    const house = new THREE.Group();
    house.position.set(0, 1.5, 0);
    group.add(house);
    meshes.house = house;

    const houseBaseShape = new THREE.Shape();
    houseBaseShape.moveTo(-4, -2.8);
    houseBaseShape.lineTo(2, -2.8);
    houseBaseShape.quadraticCurveTo(3.5, -2.8, 3.5, -1.5);
    houseBaseShape.lineTo(3.5, 1.5);
    houseBaseShape.quadraticCurveTo(3.5, 2.8, 2, 2.8);
    houseBaseShape.lineTo(-4, 2.8);
    houseBaseShape.quadraticCurveTo(-4.5, 0, -4, -2.8);
    const houseBaseGeo = new THREE.ExtrudeGeometry(houseBaseShape, {depth: 0.8, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1});
    houseBaseGeo.center();
    houseBaseGeo.rotateX(Math.PI/2);
    const houseBaseMesh = new THREE.Mesh(houseBaseGeo, darkSteel);
    house.add(houseBaseMesh);

    // 6. Engine Compartment
    const engineShape = new THREE.Shape();
    engineShape.moveTo(-1, 0);
    engineShape.lineTo(4, 0);
    engineShape.lineTo(4, 2.2);
    engineShape.lineTo(3, 2.8);
    engineShape.lineTo(-1, 2.8);
    engineShape.lineTo(-1, 0);
    const engineMesh = createExtrudedPart(engineShape, 5, steel);
    engineMesh.position.set(-2, 1.8, 0); 
    house.add(engineMesh);

    // Radiator Fan
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-1.5, 1.8, 2.6);
    house.add(fanGroup);
    meshes.fanGroup = fanGroup;
    for(let i=0; i<8; i++) {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.05, 0.02, 16), plastic);
        blade.rotation.z = (Math.PI / 4) * i;
        blade.rotation.x = 0.3;
        blade.position.set(Math.cos(blade.rotation.z)*0.25, Math.sin(blade.rotation.z)*0.25, 0);
        fanGroup.add(blade);
    }
    const fanCover = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 16, 32), darkSteel);
    fanGroup.add(fanCover);

    // 7. Exhaust
    const exhaustStack = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16), chrome);
    exhaustStack.position.set(-2.5, 4, 1.5);
    house.add(exhaustStack);
    const exhaustFlap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16), darkSteel);
    exhaustFlap.position.set(0, 1.3, 0);
    exhaustFlap.rotation.x = 0.3;
    exhaustStack.add(exhaustFlap);

    // 8. Counterweight
    const cwShape = new THREE.Shape();
    cwShape.moveTo(0, 0);
    cwShape.lineTo(1.5, 0);
    cwShape.quadraticCurveTo(2.2, 0, 2.2, 1);
    cwShape.lineTo(2.2, 3);
    cwShape.quadraticCurveTo(2.2, 3.5, 1.5, 3.5);
    cwShape.lineTo(0, 3.5);
    cwShape.lineTo(0, 0);
    const cwMesh = createExtrudedPart(cwShape, 5.4, steel);
    cwMesh.position.set(-4, 2, 0);
    house.add(cwMesh);
    
    // Warning Stripes
    for(let i=-2.5; i<=2.5; i+=0.5) {
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.8, 8), rubber);
        stripe.position.set(-4.9, 2, i);
        stripe.rotation.z = Math.PI / 8;
        house.add(stripe);
    }

    // 9. Cabin
    const cabin = new THREE.Group();
    cabin.position.set(1.5, 2, 1.8);
    house.add(cabin);

    const cabShape = new THREE.Shape();
    cabShape.moveTo(-1.2, -1.5);
    cabShape.lineTo(1.2, -1.5);
    cabShape.lineTo(1.4, 1.2);
    cabShape.lineTo(1.0, 1.8);
    cabShape.lineTo(-1.2, 1.8);
    cabShape.lineTo(-1.2, -1.5);
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, {depth: 2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05});
    cabGeo.center();
    cabGeo.rotateX(Math.PI/2);
    const cabMesh = new THREE.Mesh(cabGeo, steel);
    cabin.add(cabMesh);

    // Tinted Glass Panes
    const windowFront = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 4).rotateZ(Math.PI/4), tinted);
    windowFront.scale.set(0.1, 15, 15);
    windowFront.position.set(1.3, 0.2, 0);
    windowFront.rotation.z = -0.1;
    cabin.add(windowFront);
    
    const windowLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 4).rotateZ(Math.PI/4), tinted);
    windowLeft.scale.set(18, 15, 0.1);
    windowLeft.position.set(0.1, 0.2, 1.01);
    cabin.add(windowLeft);

    const windowRight = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 4).rotateZ(Math.PI/4), tinted);
    windowRight.scale.set(18, 15, 0.1);
    windowRight.position.set(0.1, 0.2, -1.01);
    cabin.add(windowRight);

    // Roof Guard (FOPS)
    const roofGuard = new THREE.Group();
    roofGuard.position.set(0, 1.9, 0);
    cabin.add(roofGuard);
    for(let i=-0.9; i<=0.9; i+=0.2) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8).rotateZ(Math.PI/2), darkSteel);
        bar.position.set(0, 0, i);
        roofGuard.add(bar);
    }
    const guardFrame = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 8, 4).rotateX(Math.PI/2).rotateZ(Math.PI/4), steel);
    guardFrame.scale.set(1.1, 1, 0.8);
    roofGuard.add(guardFrame);

    // 10. Cabin Interior
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16), rubber);
    seat.position.set(-0.5, -1.3, 0);
    cabin.add(seat);
    
    const backrest = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16).rotateX(Math.PI/2), rubber);
    backrest.position.set(-0.8, -0.6, 0);
    cabin.add(backrest);

    const leftJoystick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), chrome);
    leftJoystick.position.set(-0.2, -0.8, 0.5);
    leftJoystick.rotation.z = 0.2;
    cabin.add(leftJoystick);
    meshes.leftJoystick = leftJoystick;

    const rightJoystick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), chrome);
    rightJoystick.position.set(-0.2, -0.8, -0.5);
    rightJoystick.rotation.z = 0.2;
    cabin.add(rightJoystick);
    meshes.rightJoystick = rightJoystick;

    const screen = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16).rotateZ(Math.PI/2).rotateY(-0.4), glass);
    screen.position.set(0.8, -0.4, -0.6);
    cabin.add(screen);
    const screenGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16).rotateZ(Math.PI/2).rotateY(-0.4), new THREE.MeshBasicMaterial({color: 0x00ffff}));
    screenGlow.position.set(0.8, -0.4, -0.6);
    cabin.add(screenGlow);

    // Hydraulic Helpers
    const createHydraulic = (casingLen, casingRad, pistonLen, pistonRad) => {
        const group = new THREE.Group();
        
        const casing = new THREE.Mesh(new THREE.CylinderGeometry(casingRad, casingRad, casingLen, 32), steel);
        casing.rotation.x = Math.PI/2;
        casing.position.set(0, 0, casingLen/2);
        group.add(casing);
        
        const pistonGroup = new THREE.Group();
        group.add(pistonGroup);
        
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(pistonRad, pistonRad, pistonLen, 32), chrome);
        piston.rotation.x = Math.PI/2;
        piston.position.set(0, 0, pistonLen/2);
        pistonGroup.add(piston);
        
        const conn1 = new THREE.Mesh(new THREE.CylinderGeometry(casingRad*1.5, casingRad*1.5, casingRad*2.5, 16).rotateX(Math.PI/2).rotateY(Math.PI/2), darkSteel);
        group.add(conn1);
        
        const conn2 = new THREE.Mesh(new THREE.CylinderGeometry(pistonRad*1.5, pistonRad*1.5, pistonRad*2.5, 16).rotateX(Math.PI/2).rotateY(Math.PI/2), darkSteel);
        conn2.position.set(0, 0, pistonLen);
        pistonGroup.add(conn2);

        return { group, pistonGroup, pistonLen };
    };

    const attachPoint = (parent, x, y, z) => {
        const pt = new THREE.Group();
        pt.position.set(x, y, z);
        parent.add(pt);
        return pt;
    };

    // 11. Main Boom
    const boomGroup = new THREE.Group();
    boomGroup.position.set(2, 0.8, 0); 
    house.add(boomGroup);
    meshes.boomGroup = boomGroup;

    const boomShape = new THREE.Shape();
    boomShape.moveTo(0, 0);
    boomShape.lineTo(3, 7);
    boomShape.quadraticCurveTo(4, 9, 5, 9);
    boomShape.lineTo(9, 6.5);
    boomShape.lineTo(9, 4.5);
    boomShape.lineTo(4.5, 7.5);
    boomShape.lineTo(1, -1);
    boomShape.lineTo(0, 0);
    const boomMesh = createExtrudedPart(boomShape, 1.4, steel);
    boomGroup.add(boomMesh);

    const boomPin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32).rotateX(Math.PI/2), chrome);
    boomGroup.add(boomPin);

    // Boom Detail Ribs
    for(let i=1; i<=6; i++) {
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8).rotateX(Math.PI/2), darkSteel);
        rib.position.set(i*1.2, i*1.0, 0);
        boomGroup.add(rib);
    }

    const houseBoomCylAnchor = attachPoint(house, 3.5, -0.5, 0); 
    const boomBoomCylAnchor = attachPoint(boomGroup, 3.5, 4, 0);
    
    // 12. Boom Hydraulics
    const boomHydraulics1 = createHydraulic(5, 0.3, 5, 0.18);
    boomHydraulics1.group.position.set(0, 0, -1);
    houseBoomCylAnchor.add(boomHydraulics1.group);
    
    const boomHydraulics2 = createHydraulic(5, 0.3, 5, 0.18);
    boomHydraulics2.group.position.set(0, 0, 1);
    houseBoomCylAnchor.add(boomHydraulics2.group);
    
    meshes.boomHyd1 = boomHydraulics1;
    meshes.boomHyd2 = boomHydraulics2;
    meshes.boomBoomCylAnchor = boomBoomCylAnchor;

    // 13. Dipper Stick
    const stickGroup = new THREE.Group();
    stickGroup.position.set(9, 5.5, 0);
    boomGroup.add(stickGroup);
    meshes.stickGroup = stickGroup;

    const stickShape = new THREE.Shape();
    stickShape.moveTo(0, 0);
    stickShape.lineTo(0.8, -1.5);
    stickShape.lineTo(0.6, -7);
    stickShape.lineTo(-0.6, -7);
    stickShape.lineTo(-0.8, -1.5);
    stickShape.lineTo(-1.5, 0.5);
    stickShape.lineTo(0, 0);
    const stickMesh = createExtrudedPart(stickShape, 1.0, steel);
    stickGroup.add(stickMesh);

    const stickPin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 32).rotateX(Math.PI/2), chrome);
    stickGroup.add(stickPin);

    const boomStickCylAnchor = attachPoint(boomGroup, 4.5, 8.5, 0);
    const stickStickCylAnchor = attachPoint(stickGroup, -1.2, -1.0, 0);

    // 14. Stick Hydraulics
    const stickHydraulic = createHydraulic(5, 0.3, 5, 0.18);
    boomStickCylAnchor.add(stickHydraulic.group);
    meshes.stickHyd = stickHydraulic;
    meshes.stickStickCylAnchor = stickStickCylAnchor;

    // 15. Bucket Assembly
    const bucketGroup = new THREE.Group();
    bucketGroup.position.set(0, -7, 0);
    stickGroup.add(bucketGroup);
    meshes.bucketGroup = bucketGroup;

    const bucketShape = new THREE.Shape();
    bucketShape.moveTo(0, 0);
    bucketShape.lineTo(-2, 0);
    bucketShape.quadraticCurveTo(-2.8, -1.5, -2, -2.5);
    bucketShape.lineTo(0.5, -2.5);
    bucketShape.lineTo(0.8, -1.5);
    bucketShape.quadraticCurveTo(-0.5, -1.5, -0.5, 0);
    const bucketMesh = createExtrudedPart(bucketShape, 1.6, darkSteel);
    bucketGroup.add(bucketMesh);

    for(let i=-0.7; i<=0.7; i+=0.35) {
        const tooth = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.15, 0.8, 8).rotateX(-Math.PI/2), chrome);
        tooth.position.set(0.8, -2.2, i);
        tooth.rotation.z = Math.PI / 5;
        bucketGroup.add(tooth);
    }

    const bucketPin = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2, 32).rotateX(Math.PI/2), chrome);
    bucketGroup.add(bucketPin);

    // 16. Bucket Linkage & Hydraulics
    const stickBucketCylAnchor = attachPoint(stickGroup, 0.5, -3, 0);
    const bucketBucketCylAnchor = attachPoint(bucketGroup, -1.6, -0.5, 0);

    const bucketHydraulic = createHydraulic(3, 0.25, 3, 0.15);
    stickBucketCylAnchor.add(bucketHydraulic.group);
    meshes.bucketHyd = bucketHydraulic;
    meshes.bucketBucketCylAnchor = bucketBucketCylAnchor;

    const linkBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2, 16), steel);
    linkBar1.position.set(-0.8, -3.5, 0.9);
    stickGroup.add(linkBar1);
    const linkBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2, 16), steel);
    linkBar2.position.set(-0.8, -3.5, -0.9);
    stickGroup.add(linkBar2);

    // 17. Hoses
    const hosePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 1.5, 0.8),
        new THREE.Vector3(3.5, 5, 0.8),
        new THREE.Vector3(4.5, 7.5, 0.8),
        new THREE.Vector3(5, 8.5, 0.5)
    ]);
    const hoseGeo1 = new THREE.TubeGeometry(hosePath1, 32, 0.08, 12, false);
    const hoseMesh1 = new THREE.Mesh(hoseGeo1, rubber);
    house.add(hoseMesh1);

    const hosePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 1.5, -0.8),
        new THREE.Vector3(3.5, 5, -0.8),
        new THREE.Vector3(4.5, 7.5, -0.8),
        new THREE.Vector3(5, 8.5, -0.5)
    ]);
    const hoseGeo2 = new THREE.TubeGeometry(hosePath2, 32, 0.08, 12, false);
    const hoseMesh2 = new THREE.Mesh(hoseGeo2, rubber);
    house.add(hoseMesh2);

    // Spotlight
    const lightGroup = new THREE.Group();
    lightGroup.position.set(4, 6, 0.9);
    lightGroup.rotation.z = -Math.PI / 6;
    boomGroup.add(lightGroup);
    
    const lampCasing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.4, 16).rotateZ(Math.PI/2), darkSteel);
    lightGroup.add(lampCasing);
    const lampGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16).rotateZ(Math.PI/2), new THREE.MeshBasicMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2}));
    lampGlass.position.set(0.2, 0, 0);
    lightGroup.add(lampGlass);

    parts.push(
        { name: "Undercarriage Frame", description: "Heavy-duty steel H-frame supporting the tracks and slew ring.", material: "darkSteel", function: "Structural base", assemblyOrder: 1, connections: ["Tracks", "Slew Ring"], failureEffect: "Complete machine collapse.", cascadeFailures: ["Tracks", "House"], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-5, z:0} },
        { name: "Left Track Assembly", description: "Procedural crawler track with drive sprocket, idler, and 44 individual interlocking shoes.", material: "darkSteel", function: "Mobility", assemblyOrder: 2, connections: ["Undercarriage"], failureEffect: "Loss of mobility on left side, spinning.", cascadeFailures: ["Right Track"], originalPosition: {x:0, y:-0.5, z:2.8}, explodedPosition: {x:0, y:-2, z:8} },
        { name: "Right Track Assembly", description: "Procedural crawler track with drive sprocket, idler, and 44 individual interlocking shoes.", material: "darkSteel", function: "Mobility", assemblyOrder: 3, connections: ["Undercarriage"], failureEffect: "Loss of mobility on right side.", cascadeFailures: ["Left Track"], originalPosition: {x:0, y:-0.5, z:-2.8}, explodedPosition: {x:0, y:-2, z:-8} },
        { name: "Slew Ring Gear", description: "Massive rotating bearing and gear linking undercarriage to the upper house.", material: "steel", function: "360-degree rotation", assemblyOrder: 4, connections: ["Undercarriage", "House Base"], failureEffect: "Inability to rotate the upper structure.", cascadeFailures: ["Swing Motor"], originalPosition: {x:0, y:1.1, z:0}, explodedPosition: {x:0, y:2, z:0} },
        { name: "Upper House Structure", description: "Main rotating platform carrying engine, cab, counterweight, and boom anchors.", material: "steel", function: "Rotational platform", assemblyOrder: 5, connections: ["Slew Ring"], failureEffect: "Total operational failure.", cascadeFailures: ["Engine", "Cabin"], originalPosition: {x:0, y:1.5, z:0}, explodedPosition: {x:0, y:10, z:0} },
        { name: "Engine Compartment", description: "Houses the high-output turbocharged diesel engine, cooling pack, and spinning fan.", material: "steel", function: "Power generation", assemblyOrder: 6, connections: ["House Base", "Exhaust"], failureEffect: "Complete loss of power.", cascadeFailures: ["Hydraulic Pumps"], originalPosition: {x:-2, y:1.8, z:0}, explodedPosition: {x:-8, y:10, z:0} },
        { name: "Exhaust System", description: "Muffler and exhaust stack with rain flap.", material: "chrome", function: "Emission venting", assemblyOrder: 7, connections: ["Engine"], failureEffect: "Engine choking.", cascadeFailures: [], originalPosition: {x:-2.5, y:4, z:1.5}, explodedPosition: {x:-8, y:15, z:4} },
        { name: "Counterweight", description: "Massive cast-iron weight to balance the heavy lifting of the boom.", material: "steel", function: "Stability", assemblyOrder: 8, connections: ["House Base"], failureEffect: "Machine tipping over during heavy lifts.", cascadeFailures: ["Boom"], originalPosition: {x:-4, y:2, z:0}, explodedPosition: {x:-15, y:8, z:0} },
        { name: "Operator Cabin", description: "Reinforced cab with FOPS guard, tinted glass, and ergonomic controls.", material: "steel/glass", function: "Operator protection and control", assemblyOrder: 9, connections: ["House Base"], failureEffect: "Danger to operator.", cascadeFailures: [], originalPosition: {x:1.5, y:2, z:1.8}, explodedPosition: {x:6, y:10, z:8} },
        { name: "Cabin Interior", description: "Detailed joysticks, digital displays, and suspension seat.", material: "rubber/chrome", function: "Machine interfacing", assemblyOrder: 10, connections: ["Cabin"], failureEffect: "Inability to send control signals.", cascadeFailures: ["Valves"], originalPosition: {x:1.5, y:2, z:1.8}, explodedPosition: {x:8, y:12, z:8} },
        { name: "Main Boom", description: "Articulated monolithic lifting arm constructed from high-tensile extruded steel.", material: "steel", function: "Primary lifting reach", assemblyOrder: 11, connections: ["House Base", "Stick", "Boom Hydraulics"], failureEffect: "Loss of lifting capability.", cascadeFailures: ["Stick"], originalPosition: {x:2, y:0.8, z:0}, explodedPosition: {x:15, y:15, z:0} },
        { name: "Boom Hydraulics", description: "Twin massive hydraulic cylinders controlling boom elevation.", material: "chrome/steel", function: "Boom elevation", assemblyOrder: 12, connections: ["House Base", "Boom"], failureEffect: "Boom collapse.", cascadeFailures: ["Hoses"], originalPosition: {x:3.5, y:-0.5, z:0}, explodedPosition: {x:10, y:5, z:-5} },
        { name: "Dipper Stick", description: "Secondary articulated arm connecting the boom to the bucket.", material: "steel", function: "Digging depth and reach", assemblyOrder: 13, connections: ["Boom", "Bucket", "Stick Hydraulics"], failureEffect: "Loss of digging articulation.", cascadeFailures: ["Bucket"], originalPosition: {x:9, y:5.5, z:0}, explodedPosition: {x:25, y:15, z:0} },
        { name: "Stick Hydraulics", description: "Large cylinder driving the dipper stick motion.", material: "chrome/steel", function: "Stick articulation", assemblyOrder: 14, connections: ["Boom", "Stick"], failureEffect: "Stick freezing.", cascadeFailures: [], originalPosition: {x:4.5, y:8.5, z:0}, explodedPosition: {x:20, y:20, z:-3} },
        { name: "Bucket Assembly", description: "Heavy-duty trenching bucket with hardened steel teeth.", material: "darkSteel", function: "Material excavation", assemblyOrder: 15, connections: ["Stick", "Linkage"], failureEffect: "Inability to dig.", cascadeFailures: [], originalPosition: {x:9, y:-1.5, z:0}, explodedPosition: {x:35, y:5, z:0} },
        { name: "Bucket Hydraulics & Linkage", description: "Cylinder and multi-bar linkage converting linear hydraulic force to high-torque rotation.", material: "chrome/steel", function: "Bucket curling", assemblyOrder: 16, connections: ["Stick", "Bucket"], failureEffect: "Loss of bucket curl.", cascadeFailures: [], originalPosition: {x:9, y:2.5, z:0}, explodedPosition: {x:30, y:10, z:-3} },
        { name: "Hydraulic Hoses", description: "Flexible high-pressure lines routing hydraulic fluid along the boom.", material: "rubber", function: "Power transmission", assemblyOrder: 17, connections: ["House", "Boom"], failureEffect: "Fluid leak, immediate loss of all movement.", cascadeFailures: ["All Hydraulics"], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:10, y:20, z:5} }
    );

    const description = "A modern, highly advanced 30-ton hydraulic excavator. Features procedural crawler tracks with interlocking shoes, a fully rotating upper house, detailed engine bay with a spinning fan, FOPS-equipped operator cabin, and a heavily articulated boom/stick/bucket setup driven by accurately tracked hydraulic cylinders and linkages. Built strictly without basic blocky geometries for extreme realism.";

    const quizQuestions = [
        { question: "Which component connects the undercarriage to the upper house, allowing 360-degree rotation?", options: ["Slew Ring Gear", "Boom Pin", "Drive Sprocket", "Idler Wheel"], answer: "Slew Ring Gear" },
        { question: "What is the primary function of the heavy cast-iron Counterweight located at the rear of the house?", options: ["Provide stability against the massive leverage of heavy loads", "Store extra hydraulic fluid", "House the cooling fan", "Protect the engine from rear impacts"], answer: "Provide stability against the massive leverage of heavy loads" },
        { question: "In the crawler track assembly, what component actively engages the track chain to drive the machine forward?", options: ["Drive Sprocket", "Idler", "Track Roller", "Track Shoe"], answer: "Drive Sprocket" },
        { question: "Which arm section directly holds the digging implement (the bucket) in this excavator configuration?", options: ["Dipper Stick", "Main Boom", "Undercarriage", "House"], answer: "Dipper Stick" },
        { question: "If the flexible high-pressure hydraulic hoses along the boom suffer a catastrophic burst, what is the immediate effect?", options: ["Complete loss of movement due to fluid and pressure loss", "Only the bucket stops working", "The engine stalls instantly", "The tracks lock up"], answer: "Complete loss of movement due to fluid and pressure loss" }
    ];

    const animate = (time, speed, activeMeshes) => {
        const t = time * speed;
        
        activeMeshes.house.rotation.y = Math.sin(t * 0.3) * (Math.PI * 0.8);
        
        activeMeshes.boomGroup.rotation.z = Math.sin(t * 0.6) * 0.3 + 0.3;
        
        activeMeshes.stickGroup.rotation.z = Math.sin(t * 0.8) * 0.5 - 0.7; 
        
        activeMeshes.bucketGroup.rotation.z = Math.sin(t * 1.0) * 0.7 - 0.4;
        
        activeMeshes.fanGroup.rotation.x += 0.4 * speed;
        
        activeMeshes.leftJoystick.rotation.x = Math.sin(t * 0.6) * 0.2;
        activeMeshes.rightJoystick.rotation.x = Math.sin(t * 0.8) * 0.2;

        activeMeshes.house.updateMatrixWorld(true);
        activeMeshes.boomGroup.updateMatrixWorld(true);
        activeMeshes.stickGroup.updateMatrixWorld(true);
        activeMeshes.bucketGroup.updateMatrixWorld(true);
        
        // Boom Cylinders
        activeMeshes.houseBoomCylAnchor.getWorldPosition(tempVec1);
        activeMeshes.boomBoomCylAnchor.getWorldPosition(tempVec2);
        activeMeshes.boomHyd1.group.lookAt(tempVec2);
        activeMeshes.boomHyd2.group.lookAt(tempVec2);
        const distBoom = tempVec1.distanceTo(tempVec2);
        activeMeshes.boomHyd1.pistonGroup.position.z = distBoom - activeMeshes.boomHyd1.pistonLen;
        activeMeshes.boomHyd2.pistonGroup.position.z = distBoom - activeMeshes.boomHyd2.pistonLen;

        // Stick Cylinder
        activeMeshes.boomStickCylAnchor.getWorldPosition(tempVec1);
        activeMeshes.stickStickCylAnchor.getWorldPosition(tempVec2);
        activeMeshes.stickHyd.group.lookAt(tempVec2);
        const distStick = tempVec1.distanceTo(tempVec2);
        activeMeshes.stickHyd.pistonGroup.position.z = distStick - activeMeshes.stickHyd.pistonLen;

        // Bucket Cylinder
        activeMeshes.stickBucketCylAnchor.getWorldPosition(tempVec1);
        activeMeshes.bucketBucketCylAnchor.getWorldPosition(tempVec2);
        activeMeshes.bucketHyd.group.lookAt(tempVec2);
        const distBucket = tempVec1.distanceTo(tempVec2);
        activeMeshes.bucketHyd.pistonGroup.position.z = distBucket - activeMeshes.bucketHyd.pistonLen;

        // Animate Tracks
        const trackSpeed = t * 1.5;
        const animateTrack = (trackData, offset) => {
            trackData.sprocket.rotation.z = -(trackSpeed + offset);
            trackData.idler.rotation.z = -(trackSpeed + offset);
            
            const { shoeList, straightLen, radius, perimeter } = trackData;
            for(let i=0; i<shoeList.length; i++) {
                const shoe = shoeList[i];
                let dist = ((i / shoeList.length) * perimeter + trackSpeed) % perimeter;
                if(dist < 0) dist += perimeter;
                
                const halfS = straightLen / 2;
                const arcLen = Math.PI * radius;
                
                if (dist < straightLen) {
                    shoe.position.set(-halfS + dist, radius, 0);
                    shoe.rotation.z = 0;
                } else if (dist < straightLen + arcLen) {
                    const angle = (dist - straightLen) / radius;
                    shoe.position.set(halfS + Math.sin(angle)*radius, radius * Math.cos(angle), 0);
                    shoe.rotation.z = -angle;
                } else if (dist < straightLen * 2 + arcLen) {
                    const d = dist - (straightLen + arcLen);
                    shoe.position.set(halfS - d, -radius, 0);
                    shoe.rotation.z = -Math.PI;
                } else {
                    const angle = (dist - (straightLen * 2 + arcLen)) / radius;
                    shoe.position.set(-halfS - Math.sin(angle)*radius, -radius * Math.cos(angle), 0);
                    shoe.rotation.z = -Math.PI - angle;
                }
            }
        };
        
        const driveCycle = Math.sin(t * 0.1);
        if (driveCycle > 0) {
            animateTrack(activeMeshes.leftTrackData, 0);
            animateTrack(activeMeshes.rightTrackData, 0);
        }
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createExcavator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
