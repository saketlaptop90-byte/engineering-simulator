import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // CUSTOM MATERIALS - Blending Da Vinci Rustic with Ultra High-Tech
    const agedWoodMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a3320, roughness: 0.95, metalness: 0.05 
    });
    const darkWoodMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e1a10, roughness: 1.0, metalness: 0.0
    });
    const brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xb5a642, roughness: 0.3, metalness: 0.8
    });
    const ironMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333, roughness: 0.7, metalness: 0.9
    });
    const leatherMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3728, roughness: 0.9, metalness: 0.1
    });
    const glowingNeonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.8
    });
    const runeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 3.0
    });

    const meshes = {};

    // Helper: Procedural Rivets
    function addRivets(targetGroup, radius, yPos, count) {
        const rivetGeo = new THREE.SphereGeometry(0.1, 8, 8);
        for(let i=0; i<count; i++) {
            const rivet = new THREE.Mesh(rivetGeo, ironMaterial);
            const angle = (i/count)*Math.PI*2;
            rivet.position.set(Math.cos(angle)*radius, yPos, Math.sin(angle)*radius);
            targetGroup.add(rivet);
        }
    }

    // 1. CHASSIS FRAME (Rustic Wood & Steel Core)
    const chassisGroup = new THREE.Group();
    const frameShape = new THREE.Shape();
    frameShape.moveTo(-12, -6);
    frameShape.lineTo(12, -6);
    frameShape.lineTo(16, 0);
    frameShape.lineTo(12, 6);
    frameShape.lineTo(-12, 6);
    frameShape.lineTo(-16, 0);
    frameShape.lineTo(-12, -6);
    
    const frameExtrude = { depth: 2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.4, bevelSegments: 4 };
    const chassisMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape, frameExtrude), agedWoodMaterial);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = -3;
    chassisGroup.add(chassisMesh);

    // Cross-bracing ribs
    for(let i=0; i<12; i++) {
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 11, 16), darkSteel);
        rib.position.set(-11 + i*2, -2, 0);
        rib.rotation.x = Math.PI/2;
        chassisGroup.add(rib);
    }
    group.add(chassisGroup);
    meshes.chassis = chassisGroup;

    // 2. PRIMARY HAND CRANK
    const crankGroup = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 32), leatherMaterial);
    handle.position.set(0, 3, 0);
    handle.rotation.x = Math.PI/2;
    crankGroup.add(handle);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 5, 16), ironMaterial);
    arm.position.set(0, 1.5, -2);
    arm.rotation.x = -0.2;
    crankGroup.add(arm);
    crankGroup.position.set(-6, 4, 0);
    group.add(crankGroup);
    meshes.primaryCrank = crankGroup;

    // 3. MAIN CRANK SHAFT
    const crankShaftGroup = new THREE.Group();
    const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 16, 32), steel);
    mainShaft.rotation.z = Math.PI/2;
    crankShaftGroup.add(mainShaft);
    crankShaftGroup.position.set(0, 4, 0);
    group.add(crankShaftGroup);
    meshes.crankShaft = crankShaftGroup;

    // 4. LANTERN GEAR A (Input)
    const lanternAGroup = new THREE.Group();
    const lDiscGeo = new THREE.CylinderGeometry(3, 3, 0.6, 32);
    const lDisc1 = new THREE.Mesh(lDiscGeo, darkWoodMaterial);
    lDisc1.position.x = -1.5;
    lDisc1.rotation.z = Math.PI/2;
    lanternAGroup.add(lDisc1);
    const lDisc2 = new THREE.Mesh(lDiscGeo, darkWoodMaterial);
    lDisc2.position.x = 1.5;
    lDisc2.rotation.z = Math.PI/2;
    lanternAGroup.add(lDisc2);
    
    for(let i=0; i<12; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.6, 16), brassMaterial);
        const angle = (i/12)*Math.PI*2;
        rung.position.set(0, Math.cos(angle)*2.4, Math.sin(angle)*2.4);
        rung.rotation.z = Math.PI/2;
        lanternAGroup.add(rung);
    }
    lanternAGroup.position.set(4, 4, 0);
    group.add(lanternAGroup);
    meshes.lanternGearA = lanternAGroup;

    // 5. MASSIVE WOODEN CROWN GEAR
    const crownGroup = new THREE.Group();
    const cDisc = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.8, 64), agedWoodMaterial);
    crownGroup.add(cDisc);
    addRivets(crownGroup, 5.5, 0.45, 24);
    
    // Wooden Crown Teeth
    for(let i=0; i<24; i++) {
        const tooth = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 1.5, 16), darkWoodMaterial);
        const angle = (i/24)*Math.PI*2;
        tooth.position.set(Math.cos(angle)*5.2, 0.8, Math.sin(angle)*5.2);
        crownGroup.add(tooth);
    }
    
    // Crown Central Axle
    const cShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 10, 32), ironMaterial);
    cShaft.position.y = -4;
    crownGroup.add(cShaft);
    
    crownGroup.position.set(4, 1.5, 2.4);
    crownGroup.rotation.x = Math.PI/2;
    group.add(crownGroup);
    meshes.mainCrownGear = crownGroup;

    // 6. CENTRAL DRIVE SHAFT
    const driveShaftGroup = new THREE.Group();
    const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 18, 32), darkSteel);
    driveShaft.rotation.x = Math.PI/2;
    driveShaftGroup.add(driveShaft);
    driveShaftGroup.position.set(4, -2.5, 2.4);
    group.add(driveShaftGroup);
    meshes.driveShaft = driveShaftGroup;

    // 7. LANTERN GEAR B (Output to Axles)
    const lanternBGroup = new THREE.Group();
    const lbDisc1 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32), agedWoodMaterial);
    lbDisc1.position.y = -1.2;
    lanternBGroup.add(lbDisc1);
    const lbDisc2 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32), agedWoodMaterial);
    lbDisc2.position.y = 1.2;
    lanternBGroup.add(lbDisc2);
    
    for(let i=0; i<8; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.8, 16), brassMaterial);
        const angle = (i/8)*Math.PI*2;
        rung.position.set(Math.cos(angle)*2.0, 0, Math.sin(angle)*2.0);
        lanternBGroup.add(rung);
    }
    lanternBGroup.position.set(4, -2.5, -4);
    lanternBGroup.rotation.x = Math.PI/2;
    group.add(lanternBGroup);
    meshes.lanternGearB = lanternBGroup;

    // AXLES
    const axleGeo = new THREE.CylinderGeometry(0.8, 0.8, 18, 32);
    
    // 8. FRONT AXLE
    const axleFront = new THREE.Mesh(axleGeo, steel);
    axleFront.rotation.z = Math.PI/2;
    axleFront.position.set(0, -4, 8);
    group.add(axleFront);
    meshes.axleFront = axleFront;

    // 9. REAR AXLE
    const axleRear = new THREE.Mesh(axleGeo, steel);
    axleRear.rotation.z = Math.PI/2;
    axleRear.position.set(0, -4, -8);
    group.add(axleRear);
    meshes.axleRear = axleRear;

    // 10-13. HYPER-REALISTIC WHEELS
    function createComplexWheel() {
        const wheelGroup = new THREE.Group();
        
        // Main wooden rim
        const rimGeo = new THREE.TorusGeometry(4.5, 0.6, 32, 64);
        const rim = new THREE.Mesh(rimGeo, agedWoodMaterial);
        wheelGroup.add(rim);
        
        // Iron outer tire band
        const tireGeo = new THREE.TorusGeometry(4.7, 0.3, 32, 64);
        const tire = new THREE.Mesh(tireGeo, ironMaterial);
        wheelGroup.add(tire);
        
        // Heavy Off-road Tread Lugs
        for(let i=0; i<48; i++) {
            const lugGeo = new THREE.BoxGeometry(1.6, 0.3, 1.2);
            const lug = new THREE.Mesh(lugGeo, darkSteel);
            const angle = (i/48)*Math.PI*2;
            lug.position.set(Math.cos(angle)*5.0, Math.sin(angle)*5.0, 0);
            lug.rotation.z = angle;
            wheelGroup.add(lug);
        }

        // Central Hub
        const hubGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.8, 32);
        const hub = new THREE.Mesh(hubGeo, brassMaterial);
        hub.rotation.x = Math.PI/2;
        wheelGroup.add(hub);

        // Complex Spokes
        for(let i=0; i<16; i++) {
            const spokeGeo = new THREE.CylinderGeometry(0.2, 0.25, 4.2, 16);
            const spoke = new THREE.Mesh(spokeGeo, darkWoodMaterial);
            const angle = (i/16)*Math.PI*2;
            spoke.position.set(Math.cos(angle)*2.5, Math.sin(angle)*2.5, 0);
            spoke.rotation.z = angle;
            wheelGroup.add(spoke);
            
            // Spoke reinforcement brackets
            const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), ironMaterial);
            bracket.position.set(Math.cos(angle)*4.0, Math.sin(angle)*4.0, 0);
            bracket.rotation.z = angle;
            wheelGroup.add(bracket);
        }
        
        return wheelGroup;
    }

    const wfl = createComplexWheel();
    wfl.position.set(-9, -4, 8);
    wfl.rotation.y = Math.PI/2;
    group.add(wfl);
    meshes.wheelFrontLeft = wfl;

    const wfr = createComplexWheel();
    wfr.position.set(9, -4, 8);
    wfr.rotation.y = Math.PI/2;
    group.add(wfr);
    meshes.wheelFrontRight = wfr;

    const wrl = createComplexWheel();
    wrl.position.set(-9, -4, -8);
    wrl.rotation.y = Math.PI/2;
    group.add(wrl);
    meshes.wheelRearLeft = wrl;

    const wrr = createComplexWheel();
    wrr.position.set(9, -4, -8);
    wrr.rotation.y = Math.PI/2;
    group.add(wrr);
    meshes.wheelRearRight = wrr;

    // 14. HIGH-TECH HYDRAULIC PISTON SYSTEM
    const hydraulicGroup = new THREE.Group();
    
    // Cylinder Body
    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6, 32), chrome);
    cylBody.position.set(0, 3, 0);
    hydraulicGroup.add(cylBody);
    
    // Piston Rod
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 32), steel);
    pistonRod.position.set(0, 7, 0);
    hydraulicGroup.add(pistonRod);
    meshes.pistonRod = pistonRod;
    
    // Hydraulic fluid line (TubeGeometry)
    class FluidLineCurve extends THREE.Curve {
        constructor(scale = 1) { super(); this.scale = scale; }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.sin(2 * Math.PI * t) * 1.5;
            const ty = t * -5;
            const tz = Math.cos(2 * Math.PI * t) * 1.5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new FluidLineCurve(1);
    const tubeGeo = new THREE.TubeGeometry(path, 64, 0.15, 8, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
    tubeMesh.position.set(0.6, 5, 0);
    hydraulicGroup.add(tubeMesh);

    hydraulicGroup.position.set(-5, 0, -4);
    hydraulicGroup.rotation.z = -0.4;
    group.add(hydraulicGroup);
    meshes.hydraulicSystem = hydraulicGroup;

    // 15. DA VINCI FLIGHT/TURRET WINGS (Articulated)
    const wingsGroup = new THREE.Group();
    for(let side of [-1, 1]) {
        const wingBase = new THREE.Group();
        
        // Wing spars
        for(let j=0; j<5; j++) {
            const spar = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 0.5), agedWoodMaterial);
            spar.position.set(side * 5, 0, j - 2);
            spar.rotation.z = side * 0.2;
            wingBase.add(spar);
            
            // Wing canvas (high-tech carbon-fiber-like leather)
            const canvas = new THREE.Mesh(new THREE.PlaneGeometry(9, 1), leatherMaterial);
            canvas.position.set(side * 5, 0.1, j - 1.5);
            canvas.rotation.x = -Math.PI/2;
            canvas.rotation.y = side * -0.2;
            wingBase.add(canvas);
        }
        wingBase.position.set(side * 4, 8, 0);
        wingsGroup.add(wingBase);
        if(side === -1) meshes.wingLeft = wingBase;
        if(side === 1) meshes.wingRight = wingBase;
    }
    group.add(wingsGroup);

    // 16. MODERN CONTROL CABIN WITH TINTED GLASS
    const cabinGroup = new THREE.Group();
    
    // Operator Base
    const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), darkWoodMaterial);
    cabinGroup.add(cabinBase);

    // Tinted Dome Canopy
    const canopyGeo = new THREE.SphereGeometry(3.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const canopy = new THREE.Mesh(canopyGeo, tinted);
    canopy.position.y = 0.5;
    cabinGroup.add(canopy);
    
    // Glowing Control Panel
    const panelGeo = new THREE.BoxGeometry(4, 2, 1);
    const panel = new THREE.Mesh(panelGeo, ironMaterial);
    panel.position.set(0, 1.5, -2);
    panel.rotation.x = 0.3;
    cabinGroup.add(panel);
    
    // Neon screen
    const screenGeo = new THREE.PlaneGeometry(3.5, 1.5);
    const screen = new THREE.Mesh(screenGeo, glowingNeonMaterial);
    screen.position.set(0, 1.5, -1.45);
    screen.rotation.x = 0.3;
    cabinGroup.add(screen);

    // Joysticks
    const stick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), steel);
    stick1.position.set(-1, 2.5, -1.5);
    stick1.rotation.x = -0.2;
    cabinGroup.add(stick1);
    const stick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), steel);
    stick2.position.set(1, 2.5, -1.5);
    stick2.rotation.x = -0.2;
    cabinGroup.add(stick2);
    meshes.joystick1 = stick1;
    meshes.joystick2 = stick2;

    // Operator Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), leatherMaterial);
    seat.position.set(0, 1.5, 1);
    cabinGroup.add(seat);

    cabinGroup.position.set(0, 7, 0);
    group.add(cabinGroup);
    meshes.cabin = cabinGroup;

    // 17. MAGICAL RUNE ENERGY REACTOR
    const reactorGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 2), glowingNeonMaterial);
    reactorGroup.add(core);
    meshes.reactorCore = core;
    
    // Orbiting rings
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.2, 16, 64), brassMaterial);
        ring.rotation.x = (Math.PI/3) * i;
        ring.rotation.y = (Math.PI/4) * i;
        reactorGroup.add(ring);
        meshes[`reactorRing${i}`] = ring;
    }
    
    reactorGroup.position.set(-5, 5, 5);
    group.add(reactorGroup);
    meshes.reactor = reactorGroup;

    // 18. EXHAUST STACKS & VENTS
    const exhaustGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 32), copper);
        pipe.position.set(-8 + i*2, 6, -6);
        pipe.rotation.x = 0.2;
        exhaustGroup.add(pipe);
    }
    group.add(exhaustGroup);
    meshes.exhausts = exhaustGroup;


    // PARTS ARRAY METADATA
    const parts = [
        {
            name: "Rustic Chassis Frame",
            description: "The primary structural base of the machine, forged from aged timber and reinforced with dark steel ribs to endure extreme terrain.",
            material: "Aged Wood & Dark Steel",
            function: "Provides heavy structural integrity for mounting magical and mechanical components.",
            assemblyOrder: 1,
            connections: ["axleFront", "axleRear", "cabin"],
            failureEffect: "Total structural collapse of the tank.",
            cascadeFailures: ["cabin", "reactor", "mainCrownGear"],
            originalPosition: { x: 0, y: -3, z: 0 },
            explodedPosition: { x: 0, y: -10, z: 0 }
        },
        {
            name: "Primary Hand Crank",
            description: "A leather-wrapped manual input crank used to prime the kinetic systems when the reactor is offline.",
            material: "Leather & Iron",
            function: "Initiates manual rotational kinetic energy into the main crank shaft.",
            assemblyOrder: 2,
            connections: ["crankShaft"],
            failureEffect: "Loss of manual startup capabilities.",
            cascadeFailures: [],
            originalPosition: { x: -6, y: 4, z: 0 },
            explodedPosition: { x: -15, y: 10, z: 0 }
        },
        {
            name: "Main Crank Shaft",
            description: "A high-stress steel shaft transmitting torque from the crank to the input lantern gear.",
            material: "Steel",
            function: "Power transmission corridor.",
            assemblyOrder: 3,
            connections: ["primaryCrank", "lanternGearA"],
            failureEffect: "Zero power transfer from manual input.",
            cascadeFailures: ["lanternGearA"],
            originalPosition: { x: 0, y: 4, z: 0 },
            explodedPosition: { x: 0, y: 12, z: 0 }
        },
        {
            name: "Lantern Gear A",
            description: "Da Vinci style input gear made of dark wood and brass rungs.",
            material: "Dark Wood & Brass",
            function: "Interfaces with the massive crown gear to alter the axis of rotation by 90 degrees.",
            assemblyOrder: 4,
            connections: ["crankShaft", "mainCrownGear"],
            failureEffect: "Rotational axis misalignment; gears grind to a halt.",
            cascadeFailures: ["mainCrownGear"],
            originalPosition: { x: 4, y: 4, z: 0 },
            explodedPosition: { x: 10, y: 10, z: 0 }
        },
        {
            name: "Massive Wooden Crown Gear",
            description: "A colossal, beautifully crafted wooden disc populated with 24 distinct wooden teeth and iron rivets.",
            material: "Aged Wood & Iron",
            function: "Acts as the central power distribution hub, converting lateral rotation into horizontal drive.",
            assemblyOrder: 5,
            connections: ["lanternGearA", "driveShaft"],
            failureEffect: "Complete drivetrain failure.",
            cascadeFailures: ["driveShaft", "lanternGearB"],
            originalPosition: { x: 4, y: 1.5, z: 2.4 },
            explodedPosition: { x: 15, y: 0, z: 10 }
        },
        {
            name: "Central Drive Shaft",
            description: "A thick dark steel column transferring torque from the crown gear down into the chassis depths.",
            material: "Dark Steel",
            function: "Carries multiplied torque to the rear output gears.",
            assemblyOrder: 6,
            connections: ["mainCrownGear", "lanternGearB"],
            failureEffect: "Power lost before reaching the wheels.",
            cascadeFailures: ["lanternGearB"],
            originalPosition: { x: 4, y: -2.5, z: 2.4 },
            explodedPosition: { x: 15, y: -10, z: 10 }
        },
        {
            name: "Lantern Gear B",
            description: "The secondary lantern gear linking the drive shaft to the wheel axles.",
            material: "Aged Wood & Brass",
            function: "Steps down RPM while increasing torque for the heavy off-road wheels.",
            assemblyOrder: 7,
            connections: ["driveShaft", "axleRear"],
            failureEffect: "Rear wheels lose all propulsion.",
            cascadeFailures: ["wheelRearLeft", "wheelRearRight"],
            originalPosition: { x: 4, y: -2.5, z: -4 },
            explodedPosition: { x: 10, y: -15, z: -10 }
        },
        {
            name: "Front Axle",
            description: "Solid steel rod supporting the front massive wheels.",
            material: "Steel",
            function: "Load-bearing and wheel synchronization.",
            assemblyOrder: 8,
            connections: ["chassis", "wheelFrontLeft", "wheelFrontRight"],
            failureEffect: "Front wheels collapse inward.",
            cascadeFailures: ["wheelFrontLeft", "wheelFrontRight"],
            originalPosition: { x: 0, y: -4, z: 8 },
            explodedPosition: { x: 0, y: -15, z: 20 }
        },
        {
            name: "Rear Axle",
            description: "Solid steel drive axle connecting the output lantern gear to the rear wheels.",
            material: "Steel",
            function: "Provides primary propulsion to the terrain.",
            assemblyOrder: 9,
            connections: ["lanternGearB", "wheelRearLeft", "wheelRearRight"],
            failureEffect: "Tank becomes immobile.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -4, z: -8 },
            explodedPosition: { x: 0, y: -15, z: -20 }
        },
        {
            name: "Front Left Wheel",
            description: "Hyper-realistic off-road Da Vinci wheel with wooden spokes, brass hub, and steel tread lugs.",
            material: "Wood, Steel, Brass",
            function: "Traction and movement.",
            assemblyOrder: 10,
            connections: ["axleFront"],
            failureEffect: "Severe pulling to the left during movement.",
            cascadeFailures: [],
            originalPosition: { x: -9, y: -4, z: 8 },
            explodedPosition: { x: -20, y: -10, z: 20 }
        },
        {
            name: "Front Right Wheel",
            description: "Hyper-realistic off-road Da Vinci wheel with wooden spokes, brass hub, and steel tread lugs.",
            material: "Wood, Steel, Brass",
            function: "Traction and movement.",
            assemblyOrder: 11,
            connections: ["axleFront"],
            failureEffect: "Severe pulling to the right.",
            cascadeFailures: [],
            originalPosition: { x: 9, y: -4, z: 8 },
            explodedPosition: { x: 20, y: -10, z: 20 }
        },
        {
            name: "Rear Left Wheel",
            description: "Heavy drive wheel responsible for moving the immense weight of the tank.",
            material: "Wood, Steel, Brass",
            function: "Primary propulsion traction.",
            assemblyOrder: 12,
            connections: ["axleRear"],
            failureEffect: "Loss of 50% drive power.",
            cascadeFailures: [],
            originalPosition: { x: -9, y: -4, z: -8 },
            explodedPosition: { x: -20, y: -10, z: -20 }
        },
        {
            name: "Rear Right Wheel",
            description: "Heavy drive wheel responsible for moving the immense weight of the tank.",
            material: "Wood, Steel, Brass",
            function: "Primary propulsion traction.",
            assemblyOrder: 13,
            connections: ["axleRear"],
            failureEffect: "Loss of 50% drive power.",
            cascadeFailures: [],
            originalPosition: { x: 9, y: -4, z: -8 },
            explodedPosition: { x: 20, y: -10, z: -20 }
        },
        {
            name: "Hydraulic System",
            description: "High-tech chrome cylinder and steel piston fed by rubber fluid lines, anachronistically placed on the Da Vinci frame.",
            material: "Chrome, Steel, Rubber",
            function: "Actuates heavy lifting mechanisms and provides active suspension.",
            assemblyOrder: 14,
            connections: ["chassis"],
            failureEffect: "Suspension drops, tank bottoms out on terrain.",
            cascadeFailures: [],
            originalPosition: { x: -5, y: 0, z: -4 },
            explodedPosition: { x: -15, y: 0, z: -15 }
        },
        {
            name: "Articulated Wing Systems",
            description: "Da Vinci's dream realized: large flapping wings constructed from aged wood spars and carbon-fiber-like leather.",
            material: "Wood & Leather",
            function: "Provides auxiliary jump capability and stabilization.",
            assemblyOrder: 15,
            connections: ["chassis"],
            failureEffect: "Loss of aerial stabilization.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 8, z: 0 },
            explodedPosition: { x: 0, y: 25, z: 0 }
        },
        {
            name: "Modern Control Cabin",
            description: "A dark wood deck topped with a tinted glass dome, glowing neon displays, and twin steel flight joysticks.",
            material: "Wood, Tinted Glass, Neon, Steel",
            function: "Nerve center for the operator to control the tank's myriad systems.",
            assemblyOrder: 16,
            connections: ["chassis"],
            failureEffect: "Complete loss of machine control.",
            cascadeFailures: ["reactor", "hydraulicSystem"],
            originalPosition: { x: 0, y: 7, z: 0 },
            explodedPosition: { x: 0, y: 20, z: 0 }
        },
        {
            name: "Magical Rune Energy Reactor",
            description: "A brilliantly glowing neon icosahedron surrounded by spinning brass orbital rings.",
            material: "Neon & Brass",
            function: "Provides limitless magical energy to the high-tech systems.",
            assemblyOrder: 17,
            connections: ["chassis"],
            failureEffect: "Catastrophic magical explosion.",
            cascadeFailures: ["chassis", "cabin", "hydraulicSystem"],
            originalPosition: { x: -5, y: 5, z: 5 },
            explodedPosition: { x: -20, y: 15, z: 20 }
        },
        {
            name: "Copper Exhaust Stacks",
            description: "A bank of four thick copper pipes venting excess heat and magical exhaust.",
            material: "Copper",
            function: "Thermal regulation for the reactor and hydraulics.",
            assemblyOrder: 18,
            connections: ["chassis", "reactor"],
            failureEffect: "Overheating of the reactor core.",
            cascadeFailures: ["reactor"],
            originalPosition: { x: -5, y: 6, z: -6 },
            explodedPosition: { x: -15, y: 18, z: -15 }
        }
    ];

    const description = "The Da Vinci Armored Tank Gearbox is a hyper-realistic, ultra-complex fusion of rustic Renaissance engineering and high-tech magical-mechanical systems. Featuring intricately modeled wooden gears, extensive hydraulic lines, glowing neon control cabins, and heavily lugged wheels, this massive construct represents the pinnacle of anachronistic design.";

    const quizQuestions = [
        {
            question: "How does power transfer from the Primary Hand Crank to the Main Crown Gear?",
            options: [
                "Directly via a single belt.",
                "Through the Main Crank Shaft into Lantern Gear A, which rotates the Crown Gear.",
                "The reactor powers it wirelessly.",
                "Hydraulics pump the crown gear directly."
            ],
            answer: 1,
            explanation: "The kinetic energy moves from the crank, down the crank shaft, into Lantern Gear A, which interfaces with the teeth of the Main Crown Gear to change the axis of rotation by 90 degrees."
        },
        {
            question: "What material makes up the heavy off-road tread lugs on the wheels?",
            options: [
                "Aged Wood",
                "Rubber",
                "Dark Steel",
                "Brass"
            ],
            answer: 2,
            explanation: "The hyper-realistic wheels feature 48 heavy off-road tread lugs crafted from Dark Steel for maximum terrain grip."
        },
        {
            question: "Which component steps down the RPM while increasing torque for the rear wheels?",
            options: [
                "Lantern Gear B",
                "The Copper Exhausts",
                "The Front Axle",
                "The Tinted Canopy"
            ],
            answer: 0,
            explanation: "Lantern Gear B is responsible for linking the drive shaft to the rear axle, stepping down the RPM and significantly boosting torque for the heavy wheels."
        },
        {
            question: "What powers the high-tech systems like the glowing control panel and hydraulics?",
            options: [
                "The Primary Hand Crank",
                "The Magical Rune Energy Reactor",
                "The Copper Exhausts",
                "The Articulated Wings"
            ],
            answer: 1,
            explanation: "The Magical Rune Energy Reactor, featuring a glowing neon core and brass orbital rings, supplies limitless power to the advanced systems."
        },
        {
            question: "What happens if the Hydraulic System fails?",
            options: [
                "The wings fall off.",
                "The reactor explodes.",
                "The suspension drops and the tank bottoms out on the terrain.",
                "The wheels spin in reverse."
            ],
            answer: 2,
            explanation: "The hydraulic system acts as the active suspension and heavy lifting mechanism; its failure causes the tank chassis to bottom out."
        }
    ];

    // HYPER-COMPLEX ANIMATION LOOP
    const animate = (time, speed, meshesObj = meshes) => {
        const delta = time * speed * 0.001;

        // 1. Drivetrain Rotations (Highly synchronized)
        // Crank spins fast
        meshesObj.primaryCrank.rotation.z = -delta * 3;
        meshesObj.crankShaft.rotation.x = delta * 3;
        meshesObj.lanternGearA.rotation.x = delta * 3;
        
        // Crown Gear rotates slower due to gear ratio (12 rungs to 24 teeth = 1:2 reduction)
        meshesObj.mainCrownGear.rotation.y = delta * 1.5;
        meshesObj.driveShaft.rotation.z = delta * 1.5;
        
        // Lantern Gear B transfers to rear axle
        meshesObj.lanternGearB.rotation.z = delta * 1.5;
        
        // Axles and wheels spin
        meshesObj.axleRear.rotation.x = delta * 1.5;
        meshesObj.wheelRearLeft.rotation.z = delta * 1.5;
        meshesObj.wheelRearRight.rotation.z = delta * 1.5;
        
        // Front wheels synced to rear
        meshesObj.axleFront.rotation.x = delta * 1.5;
        meshesObj.wheelFrontLeft.rotation.z = delta * 1.5;
        meshesObj.wheelFrontRight.rotation.z = delta * 1.5;

        // 2. Hydraulic Piston Articulation
        // Piston pumps up and down using a sine wave
        const pistonExt = Math.sin(time * 0.002) * 1.5;
        meshesObj.pistonRod.position.y = 7 + pistonExt;

        // 3. Reactor Core Dynamics
        meshesObj.reactorCore.rotation.x = delta * 2;
        meshesObj.reactorCore.rotation.y = delta * 3;
        // Pulse scale
        const coreScale = 1 + Math.sin(time * 0.005) * 0.2;
        meshesObj.reactorCore.scale.set(coreScale, coreScale, coreScale);
        
        // Spin reactor rings on multiple axes
        meshesObj.reactorRing0.rotation.x = delta * 4;
        meshesObj.reactorRing1.rotation.y = delta * 3.5;
        meshesObj.reactorRing2.rotation.z = delta * 3;

        // 4. Operator Cabin Interactions
        // Joysticks jitter as if being actively piloted
        meshesObj.joystick1.rotation.x = -0.2 + Math.sin(time * 0.01) * 0.1;
        meshesObj.joystick2.rotation.x = -0.2 + Math.cos(time * 0.012) * 0.1;

        // 5. Da Vinci Wing Flapping
        // Smooth sine wave flapping motion
        const flapAngle = Math.sin(time * 0.003) * 0.4;
        if(meshesObj.wingLeft) meshesObj.wingLeft.rotation.z = flapAngle;
        if(meshesObj.wingRight) meshesObj.wingRight.rotation.z = -flapAngle;

        // 6. Exhaust Vibration
        meshesObj.exhausts.position.y = (Math.random() * 0.05);
        meshesObj.exhausts.position.x = (Math.random() * 0.05);
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArmoredTankGearbox() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
