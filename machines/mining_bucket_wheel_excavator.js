import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = 'Giant_Bucket_Wheel_Excavator';

    const parts = [];
    const meshes = {};

    const neonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2, wireframe: false });
    const warningMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xaa5500, emissiveIntensity: 0.5 });
    const glowingRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const consoleGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true });
    
    // UTILS
    function createHydraulicCylinder(radius, length) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 32), darkSteel);
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 1.5, 32), chrome);
        rod.position.y = length * 0.75;
        
        // Hose connections
        const hoseBase = new THREE.Mesh(new THREE.BoxGeometry(radius*1.2, radius*1.2, radius*1.2), darkSteel);
        hoseBase.position.set(radius, -length*0.3, 0);
        
        const g = new THREE.Group();
        g.add(cyl);
        g.add(rod);
        g.add(hoseBase);
        return g;
    }

    function createCrawlerTrack(width, length, height) {
        const trackGroup = new THREE.Group();
        
        // Main body
        const frameGeom = new THREE.BoxGeometry(width * 0.8, height * 0.6, length * 0.9);
        const frame = new THREE.Mesh(frameGeom, darkSteel);
        trackGroup.add(frame);

        // Drive sprockets
        const sprocketGeom = new THREE.CylinderGeometry(height * 0.45, height * 0.45, width * 0.85, 32);
        sprocketGeom.rotateZ(Math.PI / 2);
        const sprocketFront = new THREE.Mesh(sprocketGeom, steel);
        sprocketFront.position.z = length / 2;
        const sprocketRear = new THREE.Mesh(sprocketGeom, steel);
        sprocketRear.position.z = -length / 2;
        trackGroup.add(sprocketFront, sprocketRear);

        // Track pads (using extruded shapes for treads)
        const padCount = 60;
        const treadShape = new THREE.Shape();
        treadShape.moveTo(-width/2, -0.1);
        treadShape.lineTo(width/2, -0.1);
        treadShape.lineTo(width/2 - 0.1, 0.1);
        treadShape.lineTo(-width/2 + 0.1, 0.1);
        const treadGeom = new THREE.ExtrudeGeometry(treadShape, { depth: length*0.08, bevelEnabled: false });
        treadGeom.center();

        const trackPads = new THREE.Group();
        for(let i=0; i<padCount; i++) {
            const pad = new THREE.Mesh(treadGeom, rubber);
            const angle = (i / padCount) * Math.PI * 2;
            const rz = (length/2) * Math.cos(angle);
            const ry = (height/2) * Math.sin(angle);
            pad.position.set(0, ry, rz);
            pad.lookAt(0, ry * 2, rz * 2);
            trackPads.add(pad);
        }
        trackGroup.add(trackPads);

        // Internal rollers
        for (let i = -length/2 + 2; i < length/2 - 2; i += 2) {
            const roller = new THREE.Mesh(new THREE.CylinderGeometry(height*0.2, height*0.2, width*0.82, 16), chrome);
            roller.rotateZ(Math.PI / 2);
            roller.position.set(0, -height*0.25, i);
            trackGroup.add(roller);
            
            const upperRoller = new THREE.Mesh(new THREE.CylinderGeometry(height*0.15, height*0.15, width*0.82, 16), chrome);
            upperRoller.rotateZ(Math.PI/2);
            upperRoller.position.set(0, height*0.3, i);
            trackGroup.add(upperRoller);
        }

        return trackGroup;
    }

    // BASE & TRACKS
    const baseGroup = new THREE.Group();
    baseGroup.position.y = 2;
    group.add(baseGroup);
    meshes.base = baseGroup;

    // Crawler Tracks
    const crawlerFL = createCrawlerTrack(4, 15, 3);
    crawlerFL.position.set(8, 0, 10);
    baseGroup.add(crawlerFL);

    const crawlerFR = createCrawlerTrack(4, 15, 3);
    crawlerFR.position.set(-8, 0, 10);
    baseGroup.add(crawlerFR);

    const crawlerRL = createCrawlerTrack(4, 15, 3);
    crawlerRL.position.set(6, 0, -10);
    baseGroup.add(crawlerRL);

    const crawlerRR = createCrawlerTrack(4, 15, 3);
    crawlerRR.position.set(-6, 0, -10);
    baseGroup.add(crawlerRR);

    // Main Undercarriage Platform
    const platformGeom = new THREE.CylinderGeometry(10, 10, 2, 64);
    const platform = new THREE.Mesh(platformGeom, darkSteel);
    platform.position.y = 2.5;
    baseGroup.add(platform);

    // Maintenance catwalk around platform
    const catwalkGeom = new THREE.TorusGeometry(10.5, 0.4, 16, 64);
    const catwalk = new THREE.Mesh(catwalkGeom, steel);
    catwalk.rotation.x = Math.PI/2;
    catwalk.position.y = 2.5;
    baseGroup.add(catwalk);

    // Turntable (Slewing Ring)
    const slewingGeom = new THREE.TorusGeometry(8, 0.5, 32, 100);
    const slewingRing = new THREE.Mesh(slewingGeom, chrome);
    slewingRing.rotation.x = Math.PI / 2;
    slewingRing.position.y = 3.75;
    baseGroup.add(slewingRing);
    
    // Internal gear teeth for slewing ring
    const slewingGear = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 7.8, 0.8, 64), steel);
    slewingGear.position.y = 3.75;
    baseGroup.add(slewingGear);

    const turntableGroup = new THREE.Group();
    turntableGroup.position.y = 4;
    baseGroup.add(turntableGroup);
    meshes.turntable = turntableGroup;

    // Superstructure
    const superstructureGeom = new THREE.BoxGeometry(16, 6, 22);
    const superstructure = new THREE.Mesh(superstructureGeom, steel);
    superstructure.position.y = 3;
    turntableGroup.add(superstructure);

    // Power Generators on Superstructure
    const generatorGroup = new THREE.Group();
    generatorGroup.position.set(0, 7, -5);
    turntableGroup.add(generatorGroup);
    
    const genBody = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 6), darkSteel);
    generatorGroup.add(genBody);
    
    const genGrille = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.5), grilleMaterial);
    genGrille.position.set(0, 0, 3.01);
    generatorGroup.add(genGrille);
    
    // Exhaust Stacks
    const exhaustGeom = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    for(let i=-3; i<=3; i+=2) {
        const exhaust = new THREE.Mesh(exhaustGeom, exhaustMaterial);
        exhaust.position.set(i, 3.5, 0);
        generatorGroup.add(exhaust);
        // Smoke particle effect placeholder
        const smokePoint = new THREE.Mesh(new THREE.SphereGeometry(0.2), glowingRed);
        smokePoint.position.set(i, 6, 0);
        generatorGroup.add(smokePoint);
    }

    // Pylon (Mast)
    const pylonGeom = new THREE.CylinderGeometry(1.5, 2.5, 35, 32);
    const pylon1 = new THREE.Mesh(pylonGeom, darkSteel);
    pylon1.position.set(5, 17.5+3, -2);
    pylon1.rotation.x = -0.05;
    pylon1.rotation.z = 0.05;
    
    const pylon2 = new THREE.Mesh(pylonGeom, darkSteel);
    pylon2.position.set(-5, 17.5+3, -2);
    pylon2.rotation.x = -0.05;
    pylon2.rotation.z = -0.05;
    turntableGroup.add(pylon1, pylon2);

    const pylonCrossGeom = new THREE.CylinderGeometry(1, 1, 14, 16);
    pylonCrossGeom.rotateZ(Math.PI/2);
    for (let y = 12; y <= 35; y += 5) {
        const cross = new THREE.Mesh(pylonCrossGeom, steel);
        cross.position.set(0, y+3, -2 - (y/15)*0.5);
        turntableGroup.add(cross);
        
        // Pylon warning lights
        const pl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), warningMaterial);
        pl.position.set(0, y+3, -1);
        turntableGroup.add(pl);
    }

    // MAIN BOOM GROUP
    const mainBoomGroup = new THREE.Group();
    mainBoomGroup.position.set(0, 10, 10);
    turntableGroup.add(mainBoomGroup);
    meshes.mainBoom = mainBoomGroup;

    // Boom Structure
    const boomShape = new THREE.Shape();
    boomShape.moveTo(-3, 0);
    boomShape.lineTo(3, 0);
    boomShape.lineTo(2, 60);
    boomShape.lineTo(-2, 60);
    
    // Hole in boom (Truss structure effect)
    const hole = new THREE.Path();
    hole.moveTo(-1.5, 5);
    hole.lineTo(1.5, 5);
    hole.lineTo(1, 55);
    hole.lineTo(-1, 55);
    boomShape.holes.push(hole);

    const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const boomGeom = new THREE.ExtrudeGeometry(boomShape, extrudeSettings);
    boomGeom.rotateX(Math.PI / 2 - 0.15); // point forward and slightly up
    boomGeom.translate(0, 0, 30);
    
    const mainBoomMesh = new THREE.Mesh(boomGeom, warningMaterial);
    mainBoomMesh.position.set(0, -2.5, -5);
    mainBoomGroup.add(mainBoomMesh);

    // Boom trusses filling the hole
    for(let z = 5; z < 55; z += 4) {
        const truss = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), darkSteel);
        truss.rotation.x = Math.PI/2;
        truss.rotation.z = Math.PI/4;
        truss.position.set(0, -1, z);
        mainBoomGroup.add(truss);
        
        const truss2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), darkSteel);
        truss2.rotation.x = Math.PI/2;
        truss2.rotation.z = -Math.PI/4;
        truss2.position.set(0, -1, z);
        mainBoomGroup.add(truss2);
    }

    // Conveyor Belt inside main boom
    const conveyorBeltGeom = new THREE.BoxGeometry(4.5, 0.3, 62);
    const conveyorBelt = new THREE.Mesh(conveyorBeltGeom, rubber);
    conveyorBelt.position.set(0, 1.5, 26);
    conveyorBelt.rotation.x = 0.15;
    mainBoomGroup.add(conveyorBelt);

    // Conveyor Rollers
    for (let z = -2; z < 55; z += 1.5) {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4.8, 16), chrome);
        roller.rotation.z = Math.PI/2;
        roller.position.set(0, 1.2 - z*Math.sin(0.15), z*Math.cos(0.15));
        mainBoomGroup.add(roller);
    }

    // BUCKET WHEEL
    const bucketWheelGroup = new THREE.Group();
    bucketWheelGroup.position.set(0, -3, 62); // end of boom
    mainBoomGroup.add(bucketWheelGroup);
    meshes.bucketWheel = bucketWheelGroup;

    // Wheel Body
    const wheelCoreGeom = new THREE.CylinderGeometry(10, 10, 2.5, 64);
    wheelCoreGeom.rotateZ(Math.PI/2);
    const wheelCore = new THREE.Mesh(wheelCoreGeom, darkSteel);
    bucketWheelGroup.add(wheelCore);

    // Spokes with complex truss layout
    const spokeGeom = new THREE.CylinderGeometry(0.6, 0.6, 18, 16);
    spokeGeom.rotateZ(Math.PI/2);
    for (let i = 0; i < 8; i++) {
        const spokeGroup = new THREE.Group();
        spokeGroup.rotation.x = (Math.PI / 4) * i;
        
        const spoke = new THREE.Mesh(spokeGeom, steel);
        spokeGroup.add(spoke);
        
        // cross bracing on spokes
        const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), darkSteel);
        brace.position.set(0, 6, 0);
        brace.rotation.x = Math.PI/4;
        spokeGroup.add(brace);

        bucketWheelGroup.add(spokeGroup);
    }

    // Inner Rings
    const innerRing1 = new THREE.Mesh(new THREE.TorusGeometry(5, 0.4, 16, 64), chrome);
    innerRing1.rotation.y = Math.PI/2;
    innerRing1.position.x = 1;
    bucketWheelGroup.add(innerRing1);
    
    const innerRing2 = new THREE.Mesh(new THREE.TorusGeometry(5, 0.4, 16, 64), chrome);
    innerRing2.rotation.y = Math.PI/2;
    innerRing2.position.x = -1;
    bucketWheelGroup.add(innerRing2);

    // Outer structural ring
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.6, 32, 64), darkSteel);
    outerRing.rotation.y = Math.PI/2;
    bucketWheelGroup.add(outerRing);

    // Buckets
    const numBuckets = 16;
    const bucketGroupMesh = new THREE.Group();
    bucketWheelGroup.add(bucketGroupMesh);
    meshes.buckets = bucketGroupMesh;

    const bucketTeethGeom = new THREE.ConeGeometry(0.2, 1.5, 8);
    bucketTeethGeom.rotateX(Math.PI/2);

    for (let i = 0; i < numBuckets; i++) {
        const bGroup = new THREE.Group();
        
        // Complex bucket shape using Lathe or Extrude
        const bShape = new THREE.Shape();
        bShape.moveTo(-2, -1.5);
        bShape.lineTo(2, -1.5);
        bShape.lineTo(2.5, 1.5);
        bShape.lineTo(3, 2.5);
        bShape.lineTo(-3, 2.5);
        bShape.lineTo(-2.5, 1.5);
        
        const bExtrude = new THREE.ExtrudeGeometry(bShape, { depth: 4, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.2 });
        bExtrude.translate(0, 0, -2);
        const bMesh = new THREE.Mesh(bExtrude, warningMaterial);
        bGroup.add(bMesh);
        
        // Bucket inner plate
        const innerPlate = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.5), darkSteel);
        innerPlate.position.set(0, 0, 1.5);
        bGroup.add(innerPlate);

        // Teeth
        for(let t = -2.5; t <= 2.5; t += 0.8) {
            const tooth = new THREE.Mesh(bucketTeethGeom, chrome);
            tooth.position.set(t, 2.5, 2);
            bGroup.add(tooth);
        }
        
        // Connector arm to wheel
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), steel);
        arm.position.set(0, -3, 0);
        bGroup.add(arm);

        const angle = (i / numBuckets) * Math.PI * 2;
        bGroup.position.set(0, 11 * Math.sin(angle), 11 * Math.cos(angle));
        bGroup.rotation.x = angle;
        bucketGroupMesh.add(bGroup);
    }

    // Wheel Drive Motors (Massive array)
    for(let d=0; d<3; d++) {
        const motorGroup = new THREE.Group();
        motorGroup.position.set(2.5, 0, 0);
        motorGroup.rotation.x = (Math.PI*2/3)*d;
        
        const motorGeom = new THREE.CylinderGeometry(1.2, 1.2, 5, 32);
        motorGeom.rotateZ(Math.PI/2);
        const motor = new THREE.Mesh(motorGeom, plastic);
        motor.position.set(2, 6, 0);
        
        const gearBox = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), darkSteel);
        gearBox.position.set(1.5, 4, 0);
        
        motorGroup.add(motor, gearBox);
        bucketWheelGroup.add(motorGroup);
    }
    
    // CABIN
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(9, 6, 18);
    turntableGroup.add(cabinGroup);
    meshes.cabin = cabinGroup;

    // Advanced Cabin Body
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(5, 6, 6), warningMaterial);
    cabinGroup.add(cabBody);
    
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.5, 6.2), darkSteel);
    cabRoof.position.y = 3.25;
    cabinGroup.add(cabRoof);

    // Radar/Comms dish
    const dishGeom = new THREE.CylinderGeometry(1, 0, 0.5, 16);
    const dish = new THREE.Mesh(dishGeom, steel);
    dish.position.set(0, 4, -1);
    dish.rotation.x = Math.PI/4;
    cabinGroup.add(dish);
    meshes.radarDish = dish;

    // Windows
    const cabWindowFront = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.5), tinted);
    cabWindowFront.position.set(0, 0.5, 3.01);
    cabinGroup.add(cabWindowFront);

    const cabWindowSide1 = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.5), tinted);
    cabWindowSide1.position.set(2.51, 0.5, 0);
    cabWindowSide1.rotation.y = Math.PI/2;
    cabinGroup.add(cabWindowSide1);
    
    const cabWindowSide2 = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.5), tinted);
    cabWindowSide2.position.set(-2.51, 0.5, 0);
    cabWindowSide2.rotation.y = -Math.PI/2;
    cabinGroup.add(cabWindowSide2);

    // Operator Interior Details
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 1.2), rubber);
    seat.position.set(0, -1, 0);
    cabinGroup.add(seat);
    
    const joystickL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), chrome);
    joystickL.position.set(-0.8, -0.5, 0.5);
    joystickL.rotation.x = -0.2;
    cabinGroup.add(joystickL);
    
    const joystickR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), chrome);
    joystickR.position.set(0.8, -0.5, 0.5);
    joystickR.rotation.x = -0.2;
    cabinGroup.add(joystickR);

    const controlConsole = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 1.5), darkSteel);
    controlConsole.position.set(0, -1.25, 2);
    cabinGroup.add(controlConsole);

    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), neonMaterial);
    screen1.position.set(-1, 0.5, 0.76);
    controlConsole.add(screen1);
    
    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), consoleGreen);
    screen2.position.set(1, 0.5, 0.76);
    controlConsole.add(screen2);

    // COUNTERWEIGHT BOOM
    const counterBoomGroup = new THREE.Group();
    counterBoomGroup.position.set(0, 12, -10);
    turntableGroup.add(counterBoomGroup);
    meshes.counterBoom = counterBoomGroup;

    const cBoomGeom = new THREE.BoxGeometry(8, 4, 40);
    const cBoom = new THREE.Mesh(cBoomGeom, darkSteel);
    cBoom.position.set(0, 0, -20);
    counterBoomGroup.add(cBoom);

    const counterWeightGeom = new THREE.BoxGeometry(14, 12, 10);
    const counterWeight = new THREE.Mesh(counterWeightGeom, steel);
    counterWeight.position.set(0, -4, -36);
    counterBoomGroup.add(counterWeight);
    
    // Warning Stripes on Counterweight
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(14.2, 2, 10.2), warningMaterial);
    stripe.position.set(0, -4, -36);
    counterBoomGroup.add(stripe);

    // DISCHARGE BOOM (Rear Conveyor)
    const dischargeBoomGroup = new THREE.Group();
    dischargeBoomGroup.position.set(0, 5, -11);
    turntableGroup.add(dischargeBoomGroup);
    meshes.dischargeBoom = dischargeBoomGroup;

    const dBoomGeom = new THREE.BoxGeometry(5, 3, 55);
    const dBoom = new THREE.Mesh(dBoomGeom, warningMaterial);
    dBoom.position.set(0, 0, -27.5);
    dischargeBoomGroup.add(dBoom);

    const dConveyorBelt = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 54), rubber);
    dConveyorBelt.position.set(0, 1.6, -27.5);
    dischargeBoomGroup.add(dConveyorBelt);

    // CABLES / TENSION RODS
    const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
    
    function createCable(startVec, endVec, radius) {
        const distance = startVec.distanceTo(endVec);
        const cableGeom = new THREE.CylinderGeometry(radius, radius, distance, 12);
        const cable = new THREE.Mesh(cableGeom, cableMaterial);
        
        const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
        cable.position.copy(midPoint);
        cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(endVec, startVec).normalize());
        return cable;
    }

    // Main boom cables (from pylon to boom)
    const mainCables = new THREE.Group();
    turntableGroup.add(mainCables);
    meshes.mainCablesGroup = mainCables; // we'll rotate this group to match boom
    
    // Fixed attachment points relative to respective groups
    const pylonTopL = new THREE.Vector3(5, 37.5, -2);
    const pylonTopR = new THREE.Vector3(-5, 37.5, -2);
    const boomConnect1L = new THREE.Vector3(3, 15, 30);
    const boomConnect1R = new THREE.Vector3(-3, 15, 30);
    const boomConnect2L = new THREE.Vector3(2.5, 18, 50);
    const boomConnect2R = new THREE.Vector3(-2.5, 18, 50);

    mainCables.add(createCable(pylonTopL, boomConnect1L, 0.2));
    mainCables.add(createCable(pylonTopR, boomConnect1R, 0.2));
    mainCables.add(createCable(pylonTopL, boomConnect2L, 0.15));
    mainCables.add(createCable(pylonTopR, boomConnect2R, 0.15));

    // Counterweight cables
    const cwConnectL = new THREE.Vector3(4, 14, -46);
    const cwConnectR = new THREE.Vector3(-4, 14, -46);
    mainCables.add(createCable(pylonTopL, cwConnectL, 0.35));
    mainCables.add(createCable(pylonTopR, cwConnectR, 0.35));

    // DETAILS: Lights, Railings, Ladders
    function createLadders(height) {
        const ladderGroup = new THREE.Group();
        const sideGeom = new THREE.CylinderGeometry(0.1, 0.1, height, 8);
        const sideL = new THREE.Mesh(sideGeom, steel);
        sideL.position.set(-0.6, height/2, 0);
        const sideR = new THREE.Mesh(sideGeom, steel);
        sideR.position.set(0.6, height/2, 0);
        ladderGroup.add(sideL, sideR);

        for (let y = 0.5; y < height; y += 0.5) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), steel);
            rung.rotation.z = Math.PI/2;
            rung.position.set(0, y, 0);
            ladderGroup.add(rung);
        }
        return ladderGroup;
    }

    const pylonLadder = createLadders(35);
    pylonLadder.position.set(6, 6, -2);
    turntableGroup.add(pylonLadder);

    // Glowing Neon Accents / Warning Lights
    const beaconGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
    const beacon1 = new THREE.Mesh(beaconGeom, glowingRed);
    beacon1.position.set(0, 39, -2);
    turntableGroup.add(beacon1);

    const beacon2 = new THREE.Mesh(beaconGeom, glowingRed);
    beacon2.position.set(0, 10, 65);
    mainBoomGroup.add(beacon2);
    
    meshes.beacons = [beacon1, beacon2];

    // HYDRAULICS
    const mainHydraulicsGroup = new THREE.Group();
    turntableGroup.add(mainHydraulicsGroup);
    
    // Massive lifting cylinders
    const hydL = createHydraulicCylinder(1.2, 20);
    hydL.position.set(4, 2, 5);
    hydL.rotation.x = Math.PI / 4 + 0.1;
    mainHydraulicsGroup.add(hydL);

    const hydR = createHydraulicCylinder(1.2, 20);
    hydR.position.set(-4, 2, 5);
    hydR.rotation.x = Math.PI / 4 + 0.1;
    mainHydraulicsGroup.add(hydR);
    meshes.mainHydraulics = mainHydraulicsGroup;
    
    // Discharge boom steering hydraulics
    const steerHydL = createHydraulicCylinder(0.5, 6);
    steerHydL.position.set(3, 5, -8);
    steerHydL.rotation.y = -Math.PI/4;
    steerHydL.rotation.x = Math.PI/2;
    turntableGroup.add(steerHydL);

    // Register Parts
    parts.push({
        name: "Base Platform & Undercarriage",
        description: "The massive structural base connecting the crawler tracks, providing stable footing on uneven mining terrain.",
        material: "Dark Steel, Steel",
        function: "Supports the entire weight of the excavator and houses the travel drive systems.",
        assemblyOrder: 1,
        connections: ["Crawler Tracks", "Turntable"],
        failureEffect: "Immobility and structural collapse.",
        cascadeFailures: ["Complete machine failure"],
        originalPosition: baseGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -20, 0)
    });

    parts.push({
        name: "Crawler Track Assemblies (x4)",
        description: "Four enormous tracked pontoon assemblies with custom extruded treads and chrome rollers.",
        material: "Rubber, Steel, Dark Steel",
        function: "Provides mobility and weight distribution across soft open-pit terrain.",
        assemblyOrder: 2,
        connections: ["Base Platform"],
        failureEffect: "Loss of mobility, sinking into terrain.",
        cascadeFailures: ["Base Platform bending", "Drive motor burnout"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -20, 30)
    });

    parts.push({
        name: "Turntable & Slewing Gear",
        description: "Giant rotational bearing with internal gear teeth connecting base to superstructure.",
        material: "Chrome, Steel",
        function: "Allows 360-degree rotation of the entire upper machinery independent of the tracks.",
        assemblyOrder: 3,
        connections: ["Base Platform", "Superstructure"],
        failureEffect: "Inability to swing boom, jamming of upper structure.",
        cascadeFailures: ["Superstructure shear stress", "Hydraulic rupture"],
        originalPosition: turntableGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 10, 0)
    });

    parts.push({
        name: "Superstructure & Generators",
        description: "Main chassis housing dual diesel-electric power generators, exhaust stacks, and control hubs.",
        material: "Steel, Grille",
        function: "Acts as the physical and electrical heart of the machine.",
        assemblyOrder: 4,
        connections: ["Turntable", "Pylon", "Main Boom", "Counterweight Boom"],
        failureEffect: "Total loss of power and structural integrity.",
        cascadeFailures: ["All upper systems offline"],
        originalPosition: turntableGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 30, 0)
    });

    parts.push({
        name: "Pylon & Suspension Grid",
        description: "Towering double-mast equipped with tension cables, maintenance ladders, and warning lights.",
        material: "Dark Steel, Steel",
        function: "Transfers the immense bending moments from the booms down to the main chassis.",
        assemblyOrder: 5,
        connections: ["Superstructure", "Tension Cables"],
        failureEffect: "Catastrophic collapse of booms.",
        cascadeFailures: ["Main Boom", "Counterweight Boom", "Bucket Wheel"],
        originalPosition: new THREE.Vector3(0, 20, -2),
        explodedPosition: new THREE.Vector3(0, 60, -5)
    });

    parts.push({
        name: "Main Excavator Boom",
        description: "Massive extending arm with internal truss structures and the primary conveyor belt.",
        material: "Warning Orange (Plastic/Steel)",
        function: "Positions the bucket wheel against the rock face and carries excavated material.",
        assemblyOrder: 6,
        connections: ["Superstructure", "Bucket Wheel", "Tension Cables"],
        failureEffect: "Loss of digging capability.",
        cascadeFailures: ["Bucket Wheel damage", "Conveyor tear"],
        originalPosition: mainBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 30, 40)
    });

    parts.push({
        name: "Bucket Wheel Assembly",
        description: "Giant rotating multi-ring structure equipped with 16 heavy-duty digging buckets and complex spoke trusses.",
        material: "Chrome, Dark Steel, Warning Orange",
        function: "Cuts continuously into the earth, lifting material to dump onto the boom conveyor.",
        assemblyOrder: 7,
        connections: ["Main Boom", "Drive Motors"],
        failureEffect: "Excavation stops completely.",
        cascadeFailures: ["Drive Motor overload", "Main Boom torsion"],
        originalPosition: bucketWheelGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 25, 80)
    });
    
    parts.push({
        name: "Hardened Digging Buckets",
        description: "16 individual heavy steel buckets with chrome-hardened teeth and inner reinforcement plates.",
        material: "Steel, Chrome",
        function: "Directly impacts rock/dirt to gouge material out of the mining face.",
        assemblyOrder: 8,
        connections: ["Bucket Wheel"],
        failureEffect: "Reduced digging efficiency.",
        cascadeFailures: ["Wheel imbalance", "Drive Motor strain"],
        originalPosition: bucketWheelGroup.position.clone(),
        explodedPosition: new THREE.Vector3(40, 25, 80)
    });

    parts.push({
        name: "Wheel Drive Motors (Triple Array)",
        description: "Three high-torque planetary gear motors mounted symmetrically on the wheel hub.",
        material: "Plastic, Dark Steel",
        function: "Provides the immense rotational force required to dig through solid strata.",
        assemblyOrder: 9,
        connections: ["Bucket Wheel", "Main Boom"],
        failureEffect: "Wheel seizes or stops turning.",
        cascadeFailures: ["Electrical grid surge", "Generator stall"],
        originalPosition: new THREE.Vector3(3, 0, 0),
        explodedPosition: new THREE.Vector3(50, 0, 80)
    });

    parts.push({
        name: "Counterweight Boom",
        description: "Rearward extending heavy steel arm holding the ballast.",
        material: "Dark Steel",
        function: "Counteracts the leverage and weight of the extended main boom.",
        assemblyOrder: 10,
        connections: ["Superstructure", "Tension Cables"],
        failureEffect: "Excavator tips forward.",
        cascadeFailures: ["Machine rollover", "Pylon collapse"],
        originalPosition: counterBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 30, -40)
    });

    parts.push({
        name: "Ballast / Counterweight Box",
        description: "Dense concrete and steel box with high-visibility warning stripes.",
        material: "Steel, Warning Orange",
        function: "Provides the necessary physical mass for center-of-gravity stabilization.",
        assemblyOrder: 11,
        connections: ["Counterweight Boom"],
        failureEffect: "Imbalance and tilting.",
        cascadeFailures: ["Pylon stress fracture"],
        originalPosition: new THREE.Vector3(0, -4, -36),
        explodedPosition: new THREE.Vector3(0, 15, -70)
    });

    parts.push({
        name: "Discharge Boom",
        description: "Rear directional boom carrying the secondary conveyor system.",
        material: "Warning Orange",
        function: "Transfers mined material from the machine to external transport trains or conveyors.",
        assemblyOrder: 12,
        connections: ["Superstructure"],
        failureEffect: "Material buildup on machine, unable to output.",
        cascadeFailures: ["Main conveyor jam", "Belt rip"],
        originalPosition: dischargeBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3(40, 15, -30)
    });

    parts.push({
        name: "Operator Command Cabin",
        description: "Climate-controlled, high-tech command center with tinted windows, neon diagnostic screens, dual joysticks, and a radar dish.",
        material: "Glass, Neon, Dark Steel, Tinted",
        function: "Provides human operators with advanced controls, diagnostics, and visual oversight of the cutting face.",
        assemblyOrder: 13,
        connections: ["Superstructure"],
        failureEffect: "Loss of manual control and telemetry monitoring.",
        cascadeFailures: ["Automated safety shutdown", "Collision"],
        originalPosition: cabinGroup.position.clone(),
        explodedPosition: new THREE.Vector3(40, 40, 25)
    });

    parts.push({
        name: "Main Boom Hydraulics",
        description: "Enormous dual piston-cylinders under the main boom with complex hose routing.",
        material: "Chrome, Dark Steel",
        function: "Adjusts the vertical angle of the main boom to reach different strata levels.",
        assemblyOrder: 14,
        connections: ["Superstructure", "Main Boom"],
        failureEffect: "Boom crashes down or locks in place.",
        cascadeFailures: ["Boom structural damage", "Cable snap"],
        originalPosition: mainHydraulicsGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, -10, 20)
    });

    parts.push({
        name: "Rubber Conveyor Network",
        description: "Heavy reinforced rubber belts spanning hundreds of feet across the booms on chrome rollers.",
        material: "Rubber, Chrome",
        function: "Transports material continuously at high speed from the bucket wheel to the discharge point.",
        assemblyOrder: 15,
        connections: ["Main Boom", "Discharge Boom"],
        failureEffect: "Spillage of material, halted production.",
        cascadeFailures: ["Belt tear, roller seizure", "Fire from friction"],
        originalPosition: mainBoomGroup.position.clone(),
        explodedPosition: new THREE.Vector3(0, 45, 30)
    });

    const description = "The Giant Bucket Wheel Excavator (BWE) is a marvel of hyper-scale engineering, representing one of the largest terrestrial vehicles ever constructed. Standing taller than a skyscraper, it features a massive rotating wheel armed with heavy-duty buckets designed to continuously strip away earth and rock in open-pit mining operations. Highly complex conveyor networks, twin-hydraulic stabilization, triple-array electric drive motors, and a massive tension-cable suspension system ensure uninterrupted, hyper-scale excavation in the harshest environments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Counterweight Boom?",
            options: [
                "To store extra mining material",
                "To balance the massive weight of the extended main boom and bucket wheel",
                "To serve as a bridge for workers",
                "To house the main drive motors"
            ],
            correctAnswer: 1,
            explanation: "The counterweight boom holds dense ballast that perfectly offsets the enormous forward weight of the main boom, preventing the excavator from tipping over."
        },
        {
            question: "Which component allows the upper machinery of the excavator to rotate 360 degrees independently of the crawler tracks?",
            options: [
                "The Pylon",
                "The Slewing Ring (Turntable)",
                "The Discharge Boom",
                "The Main Hydraulics"
            ],
            correctAnswer: 1,
            explanation: "The Slewing Ring or Turntable is a giant rotational bearing connecting the base platform to the superstructure, enabling complete independent rotation."
        },
        {
            question: "What would likely happen if the Pylon & Suspension System suffered a catastrophic failure?",
            options: [
                "The bucket wheel would spin faster",
                "The excavator would lose its ability to drive",
                "The main and counterweight booms would collapse",
                "The operator cabin would detach"
            ],
            correctAnswer: 2,
            explanation: "The pylon transfers the massive bending moments via tension cables. A failure here would result in the unsupported booms collapsing under their own weight."
        },
        {
            question: "How is the excavated material transported from the bucket wheel to the external transport systems?",
            options: [
                "Dump trucks inside the superstructure",
                "A continuous rubber Conveyor System spanning the booms",
                "Pneumatic tubes",
                "Helicopter airlift"
            ],
            correctAnswer: 1,
            explanation: "Material dug by the buckets is dumped onto a continuous conveyor belt system that travels down the main boom, through the superstructure, and out the discharge boom."
        },
        {
            question: "What role do the Crawler Tracks play in a Bucket Wheel Excavator?",
            options: [
                "They dig into the rock face",
                "They stabilize the bucket wheel rotation",
                "They provide mobility across uneven and soft mining terrain",
                "They generate electricity for the motors"
            ],
            correctAnswer: 2,
            explanation: "Because BWEs are incredibly heavy, standard wheels would sink into the earth. The massive surface area of the crawler tracks distributes the weight and allows for movement over soft terrain."
        }
    ];

    const animate = (time, speed, m) => {
        // Continuous rotation of bucket wheel
        m.bucketWheel.rotation.z = -time * speed * 0.8;

        // Subtle swaying of the superstructure
        m.turntable.rotation.y = Math.sin(time * speed * 0.05) * 0.2;

        // Boom height oscillation (simulating digging arcs)
        const boomAngle = Math.sin(time * speed * 0.1) * 0.15;
        m.mainBoom.rotation.x = boomAngle;
        
        // Cable group needs to tilt with the boom for realism
        m.mainCablesGroup.rotation.x = boomAngle * 0.1;

        // Discharge boom sweeps side to side
        m.dischargeBoom.rotation.y = Math.sin(time * speed * 0.15) * 0.4;

        // Glowing beacons pulsing
        const pulse = (Math.sin(time * speed * 5) + 1) / 2; // 0 to 1
        m.beacons.forEach(b => {
            b.material.emissiveIntensity = 1 + pulse * 4;
        });
        
        // Radar dish spinning
        m.radarDish.rotation.y = time * speed * 2;

        // Hydraulic cylinders moving slightly to match boom
        // The angle changes slightly
        m.mainHydraulics.children.forEach(cyl => {
            cyl.rotation.x = (Math.PI / 4 + 0.1) + boomAngle * 0.5;
        });

        // Simulate massive engine vibration on base
        m.base.position.y = 2 + Math.sin(time * speed * 20) * 0.03;
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBucketWheelExcavator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
