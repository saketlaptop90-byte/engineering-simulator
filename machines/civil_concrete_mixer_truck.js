import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- CUSTOM ADVANCED MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff1100,
        emissive: 0xff1100,
        emissiveIntensity: 3.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff8800,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.5
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.85,
        roughness: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2
    });

    const drumMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.7,
        roughness: 0.4,
    });
    
    const warningBeaconMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8
    });

    // --- 1. CHASSIS (Complex Extrude with intricate cutouts) ---
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-7, 0.5);
    chassisShape.lineTo(8, 0.5);
    chassisShape.lineTo(8, 1.3);
    chassisShape.lineTo(4, 1.3);
    chassisShape.lineTo(3.5, 1.6);
    chassisShape.lineTo(-5, 1.6);
    chassisShape.lineTo(-6, 1.3);
    chassisShape.lineTo(-7, 1.3);
    chassisShape.lineTo(-7, 0.5);
    
    // Create cutouts for wheels
    const cutout1 = new THREE.Path();
    cutout1.absarc(5.5, 0.5, 0.8, 0, Math.PI * 2, false);
    chassisShape.holes.push(cutout1);

    const cutout2 = new THREE.Path();
    cutout2.absarc(-3.0, 0.5, 0.8, 0, Math.PI * 2, false);
    chassisShape.holes.push(cutout2);
    
    const cutout3 = new THREE.Path();
    cutout3.absarc(-5.5, 0.5, 0.8, 0, Math.PI * 2, false);
    chassisShape.holes.push(cutout3);

    const chassisExtrudeSettings = { depth: 2.4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    chassisGeom.center();
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.set(0, 1.0, 0);
    group.add(chassis);
    meshes.chassis = chassis;
    
    parts.push({
        name: 'Heavy-Duty Articulated Chassis',
        description: 'The primary structural mainframe, built from hyper-reinforced titanium-steel alloy to withstand monumental torsional stress from the rotating drum.',
        material: 'darkSteel',
        function: 'Provides absolute structural integrity and component mounting points.',
        assemblyOrder: 1,
        connections: ['cabin', 'suspension', 'drumSupport', 'engineBlock'],
        failureEffect: 'Catastrophic frame snapping under payload weight.',
        cascadeFailures: ['drumMotor', 'cabin', 'suspension'],
        originalPosition: { x: 0, y: 1.0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // --- 2. ENGINE BLOCK ---
    const engineGroup = new THREE.Group();
    const engineBaseGeom = new THREE.BoxGeometry(2.0, 1.2, 1.5);
    const engineBase = new THREE.Mesh(engineBaseGeom, steel);
    engineGroup.add(engineBase);
    
    // Engine cylinders (V8)
    for(let i = -0.75; i <= 0.75; i+=0.5) {
        const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16), chrome);
        cyl1.position.set(i, 0.8, 0.4);
        cyl1.rotation.x = Math.PI / 8;
        engineGroup.add(cyl1);
        
        const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16), chrome);
        cyl2.position.set(i, 0.8, -0.4);
        cyl2.rotation.x = -Math.PI / 8;
        engineGroup.add(cyl2);
    }
    
    // Cooling fan
    const fanGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
    fanGeom.rotateZ(Math.PI / 2);
    const fan = new THREE.Mesh(fanGeom, darkSteel);
    fan.position.set(1.1, 0.2, 0);
    engineGroup.add(fan);
    meshes.engineFan = fan;

    engineGroup.position.set(4.5, 1.5, 0);
    group.add(engineGroup);

    parts.push({
        name: 'High-Displacement V8 Turbodiesel Engine',
        description: 'Massive powerplant delivering incredible torque to both the drivetrain and the hydraulic drum pumps.',
        material: 'steel, chrome',
        function: 'Generates mechanical and hydraulic power for all vehicular systems.',
        assemblyOrder: 2,
        connections: ['chassis', 'transmission', 'coolingSystem'],
        failureEffect: 'Total loss of mobility and drum rotation.',
        cascadeFailures: ['drumMotor', 'hydraulics'],
        originalPosition: { x: 4.5, y: 1.5, z: 0 },
        explodedPosition: { x: 4.5, y: -2, z: 4.0 }
    });

    // --- 3. CABIN (Hyper-detailed exterior and interior) ---
    const cabinGroup = new THREE.Group();
    
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-1.8, 0);
    cabShape.lineTo(1.8, 0);
    cabShape.lineTo(1.8, 1.5);
    cabShape.lineTo(0.5, 2.8);
    cabShape.lineTo(-1.8, 2.8);
    cabShape.lineTo(-1.8, 0);
    const cabGeom = new THREE.ExtrudeGeometry(cabShape, { depth: 2.2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 4 });
    cabGeom.center();
    const cabBody = new THREE.Mesh(cabGeom, bodyMaterial);
    cabinGroup.add(cabBody);

    // Windshield
    const windowShape = new THREE.Shape();
    windowShape.moveTo(0.1, 1.6);
    windowShape.lineTo(1.5, 1.6);
    windowShape.lineTo(0.5, 2.6);
    windowShape.lineTo(-1.6, 2.6);
    windowShape.lineTo(-1.6, 1.6);
    const windowGeom = new THREE.ExtrudeGeometry(windowShape, { depth: 2.3, bevelEnabled: false });
    windowGeom.center();
    const cabWindow = new THREE.Mesh(windowGeom, tinted);
    cabWindow.position.set(-0.1, 0.5, 0);
    cabinGroup.add(cabWindow);

    // Grille with intricate mesh
    const grilleGroup = new THREE.Group();
    for(let i = -0.8; i <= 0.8; i+=0.2) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.05), chrome);
        bar.position.set(0, 0, i);
        grilleGroup.add(bar);
        const crossBar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 1.8), chrome);
        crossBar.position.set(0, i * 0.75, 0);
        grilleGroup.add(crossBar);
    }
    grilleGroup.position.set(1.8, 0, 0);
    cabinGroup.add(grilleGroup);

    // Headlights (complex multi-lens)
    for (let i = -1; i <= 1; i += 2) {
        const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.6), darkSteel);
        hlHousing.position.set(1.7, -0.4, i * 0.9);
        cabinGroup.add(hlHousing);

        const hGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
        hGeom.rotateZ(Math.PI / 2);
        const headlight1 = new THREE.Mesh(hGeom, neonBlue);
        headlight1.position.set(1.7, -0.3, i * 0.9 + 0.15);
        cabinGroup.add(headlight1);
        
        const headlight2 = new THREE.Mesh(hGeom, neonBlue);
        headlight2.position.set(1.7, -0.3, i * 0.9 - 0.15);
        cabinGroup.add(headlight2);
    }

    // Warning Beacons on roof
    const beaconL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), warningBeaconMat);
    beaconL.position.set(-0.5, 2.9, 0.8);
    cabinGroup.add(beaconL);
    meshes.beaconL = beaconL;
    
    const beaconR = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), warningBeaconMat);
    beaconR.position.set(-0.5, 2.9, -0.8);
    cabinGroup.add(beaconR);
    meshes.beaconR = beaconR;

    // Interior details
    const seatGeom = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const seat = new THREE.Mesh(seatGeom, rubber);
    seat.position.set(-0.5, -0.2, 0.5);
    cabinGroup.add(seat);

    const steeringGeom = new THREE.TorusGeometry(0.25, 0.04, 16, 32);
    steeringGeom.rotateY(Math.PI / 4);
    const steeringWheel = new THREE.Mesh(steeringGeom, plastic);
    steeringWheel.position.set(0.6, 0.3, 0.5);
    cabinGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    const panelGeom = new THREE.BoxGeometry(0.6, 0.4, 2.0);
    const controlPanel = new THREE.Mesh(panelGeom, darkSteel);
    controlPanel.position.set(1.0, 0, 0);
    cabinGroup.add(controlPanel);
    
    // Dashboard glowing screens
    const screen1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.4), neonBlue);
    screen1.position.set(0.7, 0.25, 0.5);
    screen1.rotation.z = -Math.PI / 8;
    cabinGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.4), neonOrange);
    screen2.position.set(0.7, 0.25, -0.2);
    screen2.rotation.z = -Math.PI / 8;
    cabinGroup.add(screen2);

    cabinGroup.position.set(5.5, 3.2, 0);
    group.add(cabinGroup);
    meshes.cabin = cabinGroup;
    
    parts.push({
        name: 'Command & Control Cabin',
        description: 'Armored, climate-controlled operator environment with multi-spectrum HUD, ergonomic suspension seating, and direct linkage to hydraulic systems.',
        material: 'bodyMaterial, tinted, neonBlue',
        function: 'Central interface for driving and operating concrete discharge mechanisms.',
        assemblyOrder: 3,
        connections: ['chassis', 'steeringWheel', 'engineBlock'],
        failureEffect: 'Total operational paralysis.',
        cascadeFailures: [],
        originalPosition: { x: 5.5, y: 3.2, z: 0 },
        explodedPosition: { x: 9.0, y: 7.0, z: 0 }
    });

    // --- 4. WHEELS, TIRES, AND SUSPENSION ---
    const wheels = [];
    const suspensionPistons = [];
    const wheelPositions = [
        { x: 5.5, y: 0.6, z: 1.6, type: 'front' },
        { x: 5.5, y: 0.6, z: -1.6, type: 'front' },
        { x: -3.0, y: 0.6, z: 1.6, type: 'rear' },
        { x: -3.0, y: 0.6, z: -1.6, type: 'rear' },
        { x: -5.5, y: 0.6, z: 1.6, type: 'rear' },
        { x: -5.5, y: 0.6, z: -1.6, type: 'rear' }
    ];

    wheelPositions.forEach((pos, index) => {
        const wheelAssembly = new THREE.Group();
        const wheelRotatingGroup = new THREE.Group();
        
        // Complex Tire
        const tireRadius = 0.65;
        const tireTube = 0.28;
        const tireGeom = new THREE.TorusGeometry(tireRadius, tireTube, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.x = Math.PI / 2;
        
        // Intense Off-road Lugs
        const lugCount = 40;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            // V-shaped treads
            const lugGeom = new THREE.BoxGeometry(0.12, 0.65, 0.12);
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * (tireRadius + tireTube * 0.85), Math.sin(angle) * (tireRadius + tireTube * 0.85), 0);
            lug.rotation.z = angle;
            lug.rotation.x = (i % 2 === 0) ? Math.PI / 8 : -Math.PI / 8; // Alternate angle
            tire.add(lug);
        }
        wheelRotatingGroup.add(tire);

        // Intricate Rim
        const rimGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
        rimGeom.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        wheelRotatingGroup.add(rim);

        // Star-pattern Hub Spokes
        for (let i = 0; i < 8; i++) {
            const spokeGeom = new THREE.CylinderGeometry(0.06, 0.04, 0.9, 16);
            spokeGeom.rotateZ((i * Math.PI) / 4);
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            wheelRotatingGroup.add(spoke);
        }

        // Central Hub Cap
        const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 16), darkSteel);
        hubCap.rotation.x = Math.PI / 2;
        hubCap.position.z = pos.z > 0 ? 0.1 : -0.1;
        wheelRotatingGroup.add(hubCap);

        wheelAssembly.add(wheelRotatingGroup);
        
        // Suspension Spring and Shock Absorber
        const shockGroup = new THREE.Group();
        const shockCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16), steel);
        shockGroup.add(shockCyl);
        
        const shockRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), chrome);
        shockRod.position.y = -0.4;
        shockGroup.add(shockRod);
        
        // Coil Spring (Tube on a spiral path)
        class SpringCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const radius = 0.15;
                const height = 0.8;
                return optionalTarget.set(Math.cos(t * Math.PI * 10) * radius, (t * height) - (height/2), Math.sin(t * Math.PI * 10) * radius);
            }
        }
        const springGeom = new THREE.TubeGeometry(new SpringCurve(), 64, 0.02, 8, false);
        const spring = new THREE.Mesh(springGeom, copper);
        shockGroup.add(spring);

        shockGroup.position.set(0, 0.6, pos.z > 0 ? -0.2 : 0.2);
        wheelAssembly.add(shockGroup);

        wheelAssembly.position.set(pos.x, pos.y, pos.z);
        group.add(wheelAssembly);
        wheels.push(wheelRotatingGroup);
        suspensionPistons.push(shockRod);
        
        parts.push({
            name: `Heavy-Duty Wheel & Suspension Assembly ${index + 1} (${pos.type})`,
            description: `Massive off-road pneumatic tire integrated with an active hydraulic coil-over suspension system to absorb site impacts.`,
            material: 'rubber, aluminum, chrome, copper',
            function: 'Provides all-terrain mobility, weight distribution, and shock absorption.',
            assemblyOrder: 4 + index,
            connections: ['chassis', 'drivetrain'],
            failureEffect: 'Immobilization and structural sagging.',
            cascadeFailures: ['chassis'],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x, y: pos.y - 1, z: pos.z > 0 ? pos.z + 3 : pos.z - 3 }
        });
    });
    meshes.wheels = wheels;
    meshes.suspensionPistons = suspensionPistons;

    // --- 5. MASSIVE MIXING DRUM (LatheGeometry) ---
    const drumGroup = new THREE.Group();
    
    const drumPoints = [];
    drumPoints.push(new THREE.Vector2(0, 0));
    drumPoints.push(new THREE.Vector2(0.6, 0));
    drumPoints.push(new THREE.Vector2(1.5, 1.8));
    drumPoints.push(new THREE.Vector2(2.2, 4.0));
    drumPoints.push(new THREE.Vector2(2.2, 6.0));
    drumPoints.push(new THREE.Vector2(1.5, 8.0));
    drumPoints.push(new THREE.Vector2(0.8, 9.2));
    drumPoints.push(new THREE.Vector2(0.6, 9.4));
    
    const drumGeom = new THREE.LatheGeometry(drumPoints, 64);
    const drum = new THREE.Mesh(drumGeom, drumMaterial);
    
    // Spiral Fins Inside/Outside the drum
    const spiralRadius = 2.25;
    class SpiralCurve extends THREE.Curve {
        constructor(scale = 1, phase = 0) {
            super();
            this.scale = scale;
            this.phase = phase;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const rad = spiralRadius - Math.abs(t - 0.5)*1.7; // Taper at ends
            const tx = Math.cos(t * Math.PI * 10 + this.phase) * rad;
            const ty = t * 9.2;
            const tz = Math.sin(t * Math.PI * 10 + this.phase) * rad;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    
    // Double helix fins
    const finGeom1 = new THREE.TubeGeometry(new SpiralCurve(1, 0), 200, 0.18, 16, false);
    const finMesh1 = new THREE.Mesh(finGeom1, chrome);
    drum.add(finMesh1);
    
    const finGeom2 = new THREE.TubeGeometry(new SpiralCurve(1, Math.PI), 200, 0.18, 16, false);
    const finMesh2 = new THREE.Mesh(finGeom2, chrome);
    drum.add(finMesh2);

    // Drum Reinforcement Bands
    for(let i = 2.5; i <= 6.5; i+=2.0) {
        const bandGeom = new THREE.TorusGeometry(2.22, 0.05, 16, 64);
        bandGeom.rotateX(Math.PI / 2);
        const band = new THREE.Mesh(bandGeom, darkSteel);
        band.position.y = i;
        drum.add(band);
    }

    drumGroup.add(drum);
    drumGroup.rotation.z = -Math.PI / 10; // Incline drum heavily
    drumGroup.rotation.y = Math.PI / 2;
    drumGroup.position.set(-1.5, 3.2, 0);
    
    group.add(drumGroup);
    meshes.drum = drumGroup;

    parts.push({
        name: 'High-Capacity Mixing Drum & Double-Helix Fins',
        description: 'Colossal rotating steel vessel equipped with aggressive double-helix internal fins. Capable of blending and maintaining immense volumes of concrete.',
        material: 'drumMaterial, chrome, darkSteel',
        function: 'Constantly agitates the payload to prevent premature curing and acts as an auger to discharge the material.',
        assemblyOrder: 10,
        connections: ['frontSupport', 'rearRollerRing', 'drumMotor'],
        failureEffect: 'Payload solidifies into an immovable monolith inside the vessel.',
        cascadeFailures: ['drumMotor', 'chassis'],
        originalPosition: { x: -1.5, y: 3.2, z: 0 },
        explodedPosition: { x: -1.5, y: 10.0, z: 0 }
    });

    // --- 6. DRUM SUPPORT STRUCTURES & ROLLERS ---
    const frontPedestal = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.5, 2.5), darkSteel);
    frontPedestal.position.set(3.0, 2.0, 0);
    group.add(frontPedestal);

    const rearPedestalGroup = new THREE.Group();
    const rearBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 2.8), darkSteel);
    rearPedestalGroup.add(rearBase);
    
    // Trunnion Rollers holding the rear of the drum
    const rollerL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), chrome);
    rollerL.rotation.x = Math.PI / 2;
    rollerL.rotation.y = Math.PI / 10; // Match drum angle
    rollerL.position.set(0, 2.0, 1.2);
    rearPedestalGroup.add(rollerL);
    meshes.rollerL = rollerL;
    
    const rollerR = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), chrome);
    rollerR.rotation.x = Math.PI / 2;
    rollerR.rotation.y = Math.PI / 10;
    rollerR.position.set(0, 2.0, -1.2);
    rearPedestalGroup.add(rollerR);
    meshes.rollerR = rollerR;

    rearPedestalGroup.position.set(-6.5, 2.5, 0);
    group.add(rearPedestalGroup);

    // --- 7. HYDRAULIC DRUM DRIVE MOTOR ---
    const motorGroup = new THREE.Group();
    const motorHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.2, 32), steel);
    motorHousing.rotation.x = Math.PI / 2;
    const motorGear = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.4, 16), chrome);
    motorGear.rotation.x = Math.PI / 2;
    motorGroup.add(motorHousing);
    motorGroup.add(motorGear);
    
    // Intense Hydraulic Plumbing
    for(let i = -0.3; i <= 0.3; i+=0.6) {
        const hoseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(i, 0.6, 0),
            new THREE.Vector3(i*1.5, 1.5, i*1.5),
            new THREE.Vector3(i*2.0, 0, i*2.0),
            new THREE.Vector3(0, -2.0, 0) // Routes down to chassis
        ]);
        const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 32, 0.08, 12, false), rubber);
        motorGroup.add(hose);
    }

    motorGroup.position.set(3.0, 3.8, 0);
    motorGroup.rotation.z = -Math.PI / 10;
    group.add(motorGroup);
    meshes.motorGear = motorGear;

    parts.push({
        name: 'Planetary Gear Hydraulic Motor',
        description: 'An immense, high-torque planetary gearbox driven by hydrostatic pressure to overcome the extreme rotational inertia of a loaded drum.',
        material: 'steel, chrome, rubber',
        function: 'Converts fluid pressure into rotational force for the mixing drum.',
        assemblyOrder: 11,
        connections: ['frontPedestal', 'drum', 'engineHydraulics'],
        failureEffect: 'Drum ceases rotation, concrete ruins the machine.',
        cascadeFailures: ['drum'],
        originalPosition: { x: 3.0, y: 3.8, z: 0 },
        explodedPosition: { x: 3.0, y: 8.0, z: 4.0 }
    });

    // --- 8. PRESSURIZED WATER SYSTEM ---
    const waterGroup = new THREE.Group();
    const tankGeom = new THREE.CylinderGeometry(0.9, 0.9, 2.5, 32);
    tankGeom.rotateZ(Math.PI / 2);
    const waterTank = new THREE.Mesh(tankGeom, aluminum);
    waterGroup.add(waterTank);
    
    // Straps and valves
    for(let i = -0.8; i <= 0.8; i+=1.6) {
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 16, 32), darkSteel);
        strap.rotation.y = Math.PI / 2;
        strap.position.set(i, 0, 0);
        waterGroup.add(strap);
    }
    
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16), copper);
    valve.position.set(-1.2, -0.8, 0);
    waterGroup.add(valve);
    
    // Hose connecting to drum
    const wHoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.2, -0.8, 0),
        new THREE.Vector3(-2.0, -1.0, 1.0),
        new THREE.Vector3(-4.0, 1.0, 1.0)
    ]);
    const wHose = new THREE.Mesh(new THREE.TubeGeometry(wHoseCurve, 32, 0.06, 8, false), rubber);
    waterGroup.add(wHose);

    waterGroup.position.set(2.5, 5.2, 0);
    group.add(waterGroup);

    parts.push({
        name: 'High-Pressure Water Accumulator',
        description: 'A heavy-gauge aluminum tank containing pressurized water for precise slump adjustments and critical post-pour washdown operations.',
        material: 'aluminum, darkSteel, copper',
        function: 'Supplies high-pressure water to the drum and external hoses.',
        assemblyOrder: 12,
        connections: ['frontPedestal', 'plumbing'],
        failureEffect: 'Inability to alter mix viscosity or clean equipment, leading to permanent damage.',
        cascadeFailures: [],
        originalPosition: { x: 2.5, y: 5.2, z: 0 },
        explodedPosition: { x: 2.5, y: 11.0, z: 0 }
    });

    // --- 9. ARTICULATED DISCHARGE CHUTE ---
    const chuteGroup = new THREE.Group();
    const pivotGroup = new THREE.Group(); // Handles Y rotation
    const tiltGroup = new THREE.Group();  // Handles X rotation
    
    // Main collector hopper
    const hopperGeom = new THREE.CylinderGeometry(1.4, 0.6, 1.8, 24, 1, true);
    hopperGeom.rotateX(Math.PI / 2);
    const hopper = new THREE.Mesh(hopperGeom, steel);
    hopper.position.set(0, 1.0, 0);
    hopper.material.side = THREE.DoubleSide;
    pivotGroup.add(hopper);

    // Primary chute segment
    const chuteShape = new THREE.Shape();
    chuteShape.moveTo(-0.5, 0);
    chuteShape.lineTo(0.5, 0);
    chuteShape.lineTo(0.4, -3.0);
    chuteShape.lineTo(-0.4, -3.0);
    chuteShape.lineTo(-0.5, 0);
    const chuteExtGeom = new THREE.ExtrudeGeometry(chuteShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
    chuteExtGeom.rotateX(Math.PI / 2.5);
    const mainChute = new THREE.Mesh(chuteExtGeom, aluminum);
    mainChute.position.set(0, 0, 0.6);
    tiltGroup.add(mainChute);

    // Chute hydraulic lifting cylinder
    const liftCylGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
    const liftCyl = new THREE.Mesh(liftCylGeom, steel);
    liftCyl.position.set(0, -1.0, 0);
    liftCyl.rotation.x = Math.PI / 6;
    pivotGroup.add(liftCyl);

    const liftRodGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
    const liftRod = new THREE.Mesh(liftRodGeom, chrome);
    liftRod.position.set(0, -0.5, 0);
    liftCyl.add(liftRod);
    meshes.chuteLiftRod = liftRod;

    pivotGroup.add(tiltGroup);
    chuteGroup.add(pivotGroup);

    chuteGroup.position.set(-7.5, 3.0, 0);
    chuteGroup.rotation.y = Math.PI; // Face backwards
    group.add(chuteGroup);
    meshes.chutePivot = pivotGroup;
    meshes.chuteTilt = tiltGroup;

    parts.push({
        name: 'Hydraulic Multi-Axis Discharge Chute',
        description: 'Highly articulated, remote-controlled steel and aluminum chute system allowing surgical precision during concrete placement.',
        material: 'steel, aluminum, chrome',
        function: 'Directs the continuous flow of concrete from the drum hopper to the target location.',
        assemblyOrder: 13,
        connections: ['rearPedestal', 'hydraulics'],
        failureEffect: 'Inability to offload material safely or accurately.',
        cascadeFailures: [],
        originalPosition: { x: -7.5, y: 3.0, z: 0 },
        explodedPosition: { x: -12.0, y: 3.0, z: 0 }
    });

    // --- 10. EXHAUST & FUEL SYSTEMS ---
    // Massive Chrome Exhaust Stack
    const exhaustGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 2.0, 0),
            new THREE.Vector3(0, 3.0, 0.6),
            new THREE.Vector3(0, 4.5, 0.6)
        ]), 32, 0.2, 16, false
    );
    const exhaust = new THREE.Mesh(exhaustGeom, chrome);
    exhaust.position.set(4.0, 2.0, 1.4);
    group.add(exhaust);

    // Exhaust flapper
    const flapGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16);
    const flap = new THREE.Mesh(flapGeom, darkSteel);
    flap.position.set(0, 4.55, 0.6);
    exhaust.add(flap);
    meshes.exhaustFlap = flap;
    
    // Dual Saddle Fuel Tanks
    for(let i = -1; i <= 1; i+=2) {
        const ftGeom = new THREE.CylinderGeometry(0.7, 0.7, 2.0, 32);
        ftGeom.rotateX(Math.PI / 2);
        const fuelTank = new THREE.Mesh(ftGeom, aluminum);
        fuelTank.position.set(1.5, 1.0, i * 1.8);
        group.add(fuelTank);
        
        // Straps
        for(let j = -0.6; j <= 0.6; j+=1.2) {
            const fStrap = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 16, 32), darkSteel);
            fStrap.position.set(0, 0, j);
            fuelTank.add(fStrap);
        }
    }

    // --- 11. ACCESS LADDERS & CATWALKS ---
    const accessGroup = new THREE.Group();
    
    // Side catwalk
    const catwalkGeom = new THREE.BoxGeometry(3.0, 0.1, 0.8);
    const catwalk = new THREE.Mesh(catwalkGeom, darkSteel);
    catwalk.position.set(-6.0, 2.0, 1.5);
    accessGroup.add(catwalk);
    
    // Ladder up to hopper
    const ladderRails = new THREE.Group();
    const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.0, 8), aluminum);
    railL.position.set(0, 0, 0.4);
    const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.0, 8), aluminum);
    railR.position.set(0, 0, -0.4);
    ladderRails.add(railL);
    ladderRails.add(railR);
    
    for(let i = -1.8; i <= 1.8; i+=0.4) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), aluminum);
        rung.rotation.x = Math.PI / 2;
        rung.position.set(0, i, 0);
        ladderRails.add(rung);
    }
    ladderRails.position.set(-7.5, 2.2, 1.8);
    ladderRails.rotation.z = -Math.PI / 12;
    accessGroup.add(ladderRails);
    
    group.add(accessGroup);

    // --- 12. MIRRORS & LIGHTING ARRAYS ---
    for(let i = -1; i <= 1; i+=2) {
        const mirrorGroup = new THREE.Group();
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), darkSteel);
        arm.rotation.z = Math.PI / 4;
        arm.position.set(0.3, 0, i * 0.5);
        
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.7, 0.4), plastic);
        housing.position.set(0.65, 0.35, i * 0.5);
        
        const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.35), glass);
        glassMesh.position.set(0.65, 0.35, i * 0.5);
        
        mirrorGroup.add(arm);
        mirrorGroup.add(housing);
        mirrorGroup.add(glassMesh);
        mirrorGroup.position.set(4.0, 3.5, i * 1.6);
        group.add(mirrorGroup);
    }

    // High-visibility Tail Light Array
    const tailLightBlock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 1.8), darkSteel);
    tailLightBlock.position.set(-7.2, 1.0, 0);
    group.add(tailLightBlock);
    
    for(let i = -1; i <= 1; i+=2) {
        const tlRed = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), neonRed);
        tlRed.rotation.z = Math.PI / 2;
        tlRed.position.set(-7.2, 1.0, i * 0.6);
        group.add(tlRed);
        
        const tlOrange = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), neonOrange);
        tlOrange.rotation.z = Math.PI / 2;
        tlOrange.position.set(-7.2, 1.0, i * 0.3);
        group.add(tlOrange);
    }

    // Cyberpunk Neon Underglow & Striping
    const neonStripGeom = new THREE.BoxGeometry(11, 0.06, 0.06);
    const neonStripL = new THREE.Mesh(neonStripGeom, neonBlue);
    neonStripL.position.set(-1.0, 1.1, 1.35);
    group.add(neonStripL);
    
    const neonStripR = new THREE.Mesh(neonStripGeom, neonBlue);
    neonStripR.position.set(-1.0, 1.1, -1.35);
    group.add(neonStripR);
    
    const drumNeon = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.04, 16, 64), neonBlue);
    drumNeon.rotation.x = Math.PI/2;
    drumNeon.position.y = 8.5;
    drum.add(drumNeon); // Spins with drum

    // --- ANIMATION CONTROLLER ---
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // Massive drum rotation
        if (activeMeshes.drum) {
            activeMeshes.drum.rotation.x = t * 1.5; // Spins around its local X axis (lathe central axis)
        }

        // Drum motor gearing
        if (activeMeshes.motorGear) {
            activeMeshes.motorGear.rotation.y = -t * 4.0;
        }

        // Trunnion rollers spinning inversely to the drum
        if (activeMeshes.rollerL) activeMeshes.rollerL.rotation.y = -t * 3.0;
        if (activeMeshes.rollerR) activeMeshes.rollerR.rotation.y = -t * 3.0;

        // Complex wheel and suspension mechanics
        if (activeMeshes.wheels) {
            activeMeshes.wheels.forEach(wheelGroup => {
                wheelGroup.rotation.z = -t * 3.5;
            });
        }
        
        if (activeMeshes.suspensionPistons) {
            activeMeshes.suspensionPistons.forEach((piston, idx) => {
                // Simulate terrain bumps uniquely per wheel based on position
                piston.position.y = -0.4 + Math.sin(t * 10 + idx) * 0.05;
            });
        }

        // Engine fan spinning rapidly
        if (activeMeshes.engineFan) {
            activeMeshes.engineFan.rotation.y = t * 15.0;
        }

        // Chute articulation (sweeping side to side and tilting)
        if (activeMeshes.chutePivot) {
            activeMeshes.chutePivot.rotation.y = Math.sin(t * 0.5) * 0.8;
        }
        if (activeMeshes.chuteTilt) {
            activeMeshes.chuteTilt.rotation.x = Math.sin(t * 0.8) * 0.2;
        }

        // Chute hydraulic lift rod moving in sync with tilt
        if (activeMeshes.chuteLiftRod) {
            activeMeshes.chuteLiftRod.position.y = -0.5 + Math.sin(t * 0.8) * 0.15;
        }

        // Steering wheel wiggling
        if (activeMeshes.steeringWheel) {
            activeMeshes.steeringWheel.rotation.z = Math.sin(t) * 0.2;
        }

        // Exhaust flap vibrating with engine pulse
        if (activeMeshes.exhaustFlap) {
            activeMeshes.exhaustFlap.rotation.x = Math.abs(Math.sin(t * 25)) * 0.6;
        }
        
        // Rotating warning beacons
        if (activeMeshes.beaconL) activeMeshes.beaconL.rotation.y = t * 8.0;
        if (activeMeshes.beaconR) activeMeshes.beaconR.rotation.y = t * 8.0 + Math.PI;
    }

    const description = "An ultra high-tech, hyper-realistic Concrete Mixer Truck engineered for the most demanding planetary construction zones. It features a colossal, hydraulically-driven rotating drum with double-helix internal fins to maintain concrete viscosity. The vehicle boasts a multi-axis articulated discharge chute, an advanced active coil-over suspension system with heavy-duty pneumatic treads, a visible V8 turbodiesel powerplant, and a cyberpunk-inspired armored cabin augmented with extensive neon lighting arrays and holographic displays.";

    const quizQuestions = [
        {
            question: "What is the critical function of the double-helix internal fins inside the rotating drum?",
            options: [
                "To structurally reinforce the drum against explosive impacts.",
                "To constantly agitate the concrete by pulling it inward, and to act as an auger pushing it outward during discharge.",
                "To rapidly cool the concrete using internal air circulation.",
                "To separate excess water from the cement mixture during transit."
            ],
            correctAnswer: 1,
            explanation: "The spiral fins function as a massive Archimedes' screw. Rotating in one direction pulls the mix deep into the drum to agitate it, preventing curing. Reversing the rotation pushes the concrete up and out for discharge."
        },
        {
            question: "Why is the massive mixing drum mounted at a steep inclined angle rather than horizontally?",
            options: [
                "To fit better on the articulated truck chassis.",
                "To artificially increase the rotational speed of the drum.",
                "To maximize volume capacity for liquid concrete without spilling, and to utilize gravity during the discharge process.",
                "To prevent the hydrostatic drive motor from overheating."
            ],
            correctAnswer: 2,
            explanation: "The incline allows the drum to hold a vastly larger volume of semi-liquid payload without it spilling out the rear opening, while also using gravity to assist the spiral fins when pouring."
        },
        {
            question: "What role does the High-Pressure Water Accumulator play during operations?",
            options: [
                "It serves as emergency coolant for the V8 turbodiesel engine.",
                "It is used exclusively to clean the truck's windshield.",
                "It provides critical pressurized water to adjust the concrete's slump (viscosity) on-site and to aggressively wash down the chute and drum post-pour.",
                "It cools the primary hydraulic drum motor."
            ],
            correctAnswer: 2,
            explanation: "The water tank is absolutely crucial for making fine on-site adjustments to the concrete mix's consistency and for cleaning the equipment immediately after use to prevent concrete from hardening and destroying the machine."
        },
        {
            question: "Which component powers the extreme rotational force required to spin the fully loaded mixing drum?",
            options: [
                "A series of high-voltage electric alternators.",
                "A massive planetary gear hydraulic motor driven by hydrostatic pressure.",
                "A direct mechanical belt drive linked to the steering column.",
                "Pneumatic air compressors located in the cabin."
            ],
            correctAnswer: 1,
            explanation: "A high-torque hydraulic planetary gear motor provides the immense, sustained mechanical power necessary to rotate tens of thousands of pounds of curing concrete continuously."
        },
        {
            question: "What is the purpose of the Hydraulic Multi-Axis Discharge Chute?",
            options: [
                "To filter out large aggregates and rocks from the concrete mix.",
                "To act as a heavily armored rear bumper for the vehicle.",
                "To precisely direct and articulate the flow of concrete from the elevated hopper directly into complex target forms.",
                "To rapidly intake dry cement powder from towering silos."
            ],
            correctAnswer: 2,
            explanation: "The discharge chute, equipped with multi-axis hydraulic articulation and folding extensions, allows the operator to surgically pour the flowing concrete exactly where it is needed on the construction site."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createConcreteMixerTruck() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
