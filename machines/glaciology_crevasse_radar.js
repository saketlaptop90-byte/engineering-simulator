import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------
    // CUSTOM CURVES & HELPERS
    // -------------------------------------------------------------
    class CoilCurve extends THREE.Curve {
        constructor(radius, coils, height) {
            super();
            this.radius = radius;
            this.coils = coils;
            this.height = height;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = this.radius * Math.cos(this.coils * Math.PI * 2 * t);
            const z = this.radius * Math.sin(this.coils * Math.PI * 2 * t);
            const y = this.height * (t - 0.5);
            return optionalTarget.set(x, y, z);
        }
    }

    class HoseCurve extends THREE.Curve {
        constructor(start, end, control1, control2) {
            super();
            this.start = start;
            this.end = end;
            this.control1 = control1;
            this.control2 = control2;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const temp = new THREE.CubicBezierCurve3(this.start, this.control1, this.control2, this.end);
            return temp.getPoint(t, optionalTarget);
        }
    }

    // Custom Glowing Materials
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x002244,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff1111,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const emitterMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        roughness: 0.4
    });

    // -------------------------------------------------------------
    // SUB-ASSEMBLY GENERATORS
    // -------------------------------------------------------------
    function createTire() {
        const tireGroup = new THREE.Group();
        
        // Main Torus body of the tire
        const tireGeo = new THREE.TorusGeometry(3.5, 1.8, 32, 64);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);

        // Intricate Extruded Lugs for Aggressive Off-Road Grip
        const lugGeo = new THREE.BoxGeometry(2.2, 0.6, 1.2);
        for (let i = 0; i < 80; i++) {
            const angle = (i / 80) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 4.8, Math.sin(angle) * 4.8, 0);
            lug.rotation.z = angle;
            // Stagger lugs
            if (i % 2 === 0) {
                lug.position.z = 0.6;
                lug.rotation.x = 0.15;
            } else {
                lug.position.z = -0.6;
                lug.rotation.x = -0.15;
            }
            tireGroup.add(lug);
        }
        
        // Hubcap and Complex Rims
        const rimGroup = new THREE.Group();
        const rimBaseGeo = new THREE.CylinderGeometry(2.2, 2.2, 2.5, 32);
        rimBaseGeo.rotateX(Math.PI / 2);
        const rimBase = new THREE.Mesh(rimBaseGeo, darkSteel);
        rimGroup.add(rimBase);

        // Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.15, 0.3, 2.2, 16);
        for (let i = 0; i < 12; i++) {
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            const angle = (i / 12) * Math.PI * 2;
            spoke.position.set(Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 1.2);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            rimGroup.add(spoke);
            
            const spokeBack = spoke.clone();
            spokeBack.position.z = -1.2;
            rimGroup.add(spokeBack);
        }
        
        // Center cap
        const capGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const cap = new THREE.Mesh(capGeo, chrome);
        cap.position.z = 1.3;
        cap.scale.z = 0.5;
        rimGroup.add(cap);
        
        tireGroup.add(rimGroup);
        return tireGroup;
    }

    function createSuspensionStrut() {
        const suspGroup = new THREE.Group();
        
        // Inner hydraulic strut
        const strutGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
        const strut = new THREE.Mesh(strutGeo, chrome);
        suspGroup.add(strut);
        
        // Outer housing
        const housingGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);
        const housing = new THREE.Mesh(housingGeo, steel);
        housing.position.y = 1.25;
        suspGroup.add(housing);

        // Heavy-duty coiled spring
        const coilCurve = new CoilCurve(0.8, 8, 4.5);
        const coilGeo = new THREE.TubeGeometry(coilCurve, 100, 0.12, 12, false);
        const coil = new THREE.Mesh(coilGeo, chrome);
        suspGroup.add(coil);
        
        // Mounting brackets
        const bracketGeo = new THREE.BoxGeometry(1.5, 0.4, 1.5);
        const topBracket = new THREE.Mesh(bracketGeo, darkSteel);
        topBracket.position.y = 2.5;
        const bottomBracket = new THREE.Mesh(bracketGeo, darkSteel);
        bottomBracket.position.y = -2.5;
        suspGroup.add(topBracket, bottomBracket);
        
        return suspGroup;
    }

    function createChassis() {
        const chassisGroup = new THREE.Group();
        
        // Aerodynamic sled hull created via ExtrudeGeometry
        const shape = new THREE.Shape();
        shape.moveTo(-15, 0);
        shape.lineTo(15, 0);
        shape.lineTo(18, 3);
        shape.lineTo(16, 7);
        shape.lineTo(-12, 7);
        shape.lineTo(-16, 4);
        shape.lineTo(-15, 0);

        const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.6, bevelThickness: 0.6 };
        const chassisGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        chassisGeo.translate(0, 0, -5); // Center it
        const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
        chassisGroup.add(chassisMesh);
        
        // Heavy armor plating panels
        const panelGeo = new THREE.BoxGeometry(12, 6, 10.2);
        const panel = new THREE.Mesh(panelGeo, aluminum);
        panel.position.set(0, 3.5, 0);
        chassisGroup.add(panel);

        // Hundreds of protective rivets
        const rivetGeo = new THREE.SphereGeometry(0.15, 8, 8);
        for(let x = -13; x <= 15; x+=3) {
            for(let y = 1; y <= 6; y+=2.5) {
                const r1 = new THREE.Mesh(rivetGeo, chrome);
                r1.position.set(x, y, 5.2);
                const r2 = new THREE.Mesh(rivetGeo, chrome);
                r2.position.set(x, y, -5.2);
                chassisGroup.add(r1, r2);
            }
        }
        
        return chassisGroup;
    }

    function createAntennaArray() {
        const arrayGroup = new THREE.Group();
        
        // Massive shielding box
        const baseGeo = new THREE.BoxGeometry(22, 1.5, 12);
        const base = new THREE.Mesh(baseGeo, steel);
        arrayGroup.add(base);

        // High-density phased array elements underneath
        const emitterGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        meshes.emitters = [];
        
        for(let x = -10; x <= 10; x += 1.5) {
            for(let z = -5; z <= 5; z += 1.5) {
                const emitter = new THREE.Mesh(emitterGeo, emitterMat);
                emitter.position.set(x, -0.8, z);
                arrayGroup.add(emitter);
                meshes.emitters.push(emitter);
            }
        }
        
        // Sub-surface processing units
        const cpuGeo = new THREE.BoxGeometry(6, 1, 4);
        const cpu = new THREE.Mesh(cpuGeo, darkSteel);
        cpu.position.set(0, 1, 0);
        arrayGroup.add(cpu);

        return arrayGroup;
    }

    function createHydraulicActuator() {
        const actGroup = new THREE.Group();
        
        // Cylinder housing
        const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 7, 32);
        const cylinder = new THREE.Mesh(cylinderGeo, steel);
        cylinder.position.y = 3.5;
        actGroup.add(cylinder);

        // Internal lifting piston
        const pistonGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 32);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = 7;
        actGroup.add(piston);

        // High-pressure rubber hosing
        const hoseCurve = new HoseCurve(
            new THREE.Vector3(1.2, 4, 0), 
            new THREE.Vector3(2, -2, 0),
            new THREE.Vector3(3, 3, 0),
            new THREE.Vector3(3, 0, 0)
        );
        const hoseGeo = new THREE.TubeGeometry(hoseCurve, 32, 0.2, 12, false);
        const hose = new THREE.Mesh(hoseGeo, rubber);
        actGroup.add(hose);

        // Valve manifold
        const valveGeo = new THREE.BoxGeometry(1, 2, 1.5);
        const valve = new THREE.Mesh(valveGeo, copper);
        valve.position.set(1.5, 4, 0);
        actGroup.add(valve);

        return { group: actGroup, piston: piston };
    }

    function createGenerator() {
        const genGroup = new THREE.Group();
        
        // Main block
        const bodyGeo = new THREE.BoxGeometry(7, 6, 6);
        const body = new THREE.Mesh(bodyGeo, steel);
        body.position.y = 3;
        genGroup.add(body);
        
        // Intense cooling fin array
        const finGeo = new THREE.BoxGeometry(0.1, 5, 5);
        for(let x = -3; x <= 3; x+=0.25) {
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set(x, 3, 0);
            genGroup.add(fin);
        }

        // Exhaust stack with muffler
        const exhaustGeo = new THREE.CylinderGeometry(0.4, 0.5, 6, 16);
        const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
        exhaust.position.set(2.5, 7, -2);
        genGroup.add(exhaust);
        
        const mufflerGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
        const muffler = new THREE.Mesh(mufflerGeo, steel);
        muffler.position.set(2.5, 6, -2);
        genGroup.add(muffler);
        
        // Massive industrial fan
        const fanGroup = new THREE.Group();
        const center = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32), darkSteel);
        center.rotation.x = Math.PI/2;
        fanGroup.add(center);
        
        const bladeGeo = new THREE.BoxGeometry(4, 0.1, 1.2);
        for(let i=0; i<6; i++) {
            const blade = new THREE.Mesh(bladeGeo, plastic);
            blade.rotation.z = (i * Math.PI) / 3;
            blade.rotation.x = 0.35; // aggressive pitch
            fanGroup.add(blade);
        }
        fanGroup.position.set(0, 3, 3.2);
        genGroup.add(fanGroup);
        
        return { group: genGroup, fan: fanGroup };
    }

    function createHitch() {
        const hitchGroup = new THREE.Group();
        // Extending beam
        const poleGeo = new THREE.CylinderGeometry(0.6, 0.6, 10, 16);
        const pole = new THREE.Mesh(poleGeo, steel);
        pole.rotation.z = Math.PI / 2;
        pole.position.set(5, 0, 0);
        hitchGroup.add(pole);
        
        // Articulation joint
        const jointGeo = new THREE.SphereGeometry(1, 16, 16);
        const joint = new THREE.Mesh(jointGeo, darkSteel);
        joint.position.set(10, 0, 0);
        hitchGroup.add(joint);
        
        // Tow ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(11.5, 0, 0);
        hitchGroup.add(ring);
        
        return hitchGroup;
    }

    function createTurret() {
        const turretGroup = new THREE.Group();
        
        // Motor base
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.5, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        turretGroup.add(base);
        
        // Spinning LIDAR head
        const headGroup = new THREE.Group();
        const domeGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
        const dome = new THREE.Mesh(domeGeo, tinted);
        dome.position.y = 1.5;
        headGroup.add(dome);
        
        // Internal optics visible through glass
        const lensGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
        const lens = new THREE.Mesh(lensGeo, chrome);
        lens.rotation.x = Math.PI/2;
        lens.position.set(0, 1.5, 0.5);
        headGroup.add(lens);
        
        turretGroup.add(headGroup);
        return { group: turretGroup, head: headGroup };
    }

    // -------------------------------------------------------------
    // ASSEMBLY & INSTANTIATION
    // -------------------------------------------------------------
    
    // 1. Chassis
    const chassis = createChassis();
    chassis.position.set(0, 7, 0);
    group.add(chassis);
    parts.push({
        name: "Main Radar Sled Chassis",
        description: "Heavy aerodynamic armor plating housing central processors, built to withstand absolute zero blizzards and physical impacts.",
        material: "Dark Steel, Aluminum, Chrome",
        function: "Structural core and environmental shielding.",
        assemblyOrder: 1,
        connections: ["Suspension System", "Generator", "Towing Hitch"],
        failureEffect: "Vulnerability to extreme cold; internal processors will freeze and shatter.",
        cascadeFailures: ["GPR Array Processing", "Telemetry Systems"],
        originalPosition: {x: 0, y: 7, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 2-5. Tires & Suspensions
    const tirePositions = [
        {x: -10, y: 4.5, z: 8},
        {x: 10, y: 4.5, z: 8},
        {x: -10, y: 4.5, z: -8},
        {x: 10, y: 4.5, z: -8}
    ];
    meshes.tires = [];

    tirePositions.forEach((pos, idx) => {
        // Tire
        const tire = createTire();
        tire.position.set(pos.x, pos.y, pos.z);
        if (pos.z < 0) tire.rotation.y = Math.PI; // flip right side tires
        group.add(tire);
        meshes.tires.push(tire);
        parts.push({
            name: `Off-Road Ice Tire [${idx+1}]`,
            description: "Deep-treaded rubber torus with extruded lugs and heavy chrome alloy rims for absolute traction on glacial ice.",
            material: "Rubber, Chrome, Dark Steel",
            function: "Mobility and surface gripping.",
            assemblyOrder: 2 + idx * 2,
            connections: [`Suspension Strut [${idx+1}]`],
            failureEffect: "Loss of traction resulting in sled sliding into crevasses.",
            cascadeFailures: [],
            originalPosition: pos,
            explodedPosition: {x: pos.x * 2.5, y: pos.y, z: pos.z * 2.5}
        });

        // Suspension
        const susp = createSuspensionStrut();
        susp.position.set(pos.x, pos.y + 1, pos.z > 0 ? pos.z - 1.5 : pos.z + 1.5);
        group.add(susp);
        parts.push({
            name: `Suspension Strut [${idx+1}]`,
            description: "Hydraulic shock absorber surrounded by a heavy-duty chrome coiled spring.",
            material: "Steel, Chrome",
            function: "Isolates the highly sensitive radar equipment from brutal terrain impacts.",
            assemblyOrder: 3 + idx * 2,
            connections: ["Main Chassis", `Off-Road Ice Tire [${idx+1}]`],
            failureEffect: "Severe vibration transmission damaging delicate phased arrays.",
            cascadeFailures: ["GPR Antenna Array"],
            originalPosition: susp.position.clone(),
            explodedPosition: {x: pos.x * 1.5, y: pos.y + 5, z: pos.z * 1.5}
        });
    });

    // 10. GPR Antenna Array
    const antennaArray = createAntennaArray();
    antennaArray.position.set(0, 2, 0);
    group.add(antennaArray);
    meshes.antennaArray = antennaArray;
    parts.push({
        name: "Phased-Array GPR Emitter Plate",
        description: "A colossal 22x12 meter slab containing hundreds of individually controllable radar emitting cylinders.",
        material: "Steel, Emissive Copper",
        function: "Pumps synchronized electromagnetic waves deep into the glacier to detect hollow voids (crevasses).",
        assemblyOrder: 10,
        connections: ["Hydraulic Actuators"],
        failureEffect: "Complete failure of primary mission objective; blind to sub-surface hazards.",
        cascadeFailures: ["Operator Control Panel (displays flatline)"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 11. Generator
    const genData = createGenerator();
    const generator = genData.group;
    meshes.genFan = genData.fan;
    generator.position.set(-8, 14, 0);
    group.add(generator);
    parts.push({
        name: "Turbine APU Generator",
        description: "Massive diesel-electric turbine with extensive aluminum cooling fins, exhaust stack, and a high-RPM industrial cooling fan.",
        material: "Steel, Aluminum, Plastic",
        function: "Generates massive electrical currents to power the GPR bursts.",
        assemblyOrder: 11,
        connections: ["Main Chassis", "Battery Banks"],
        failureEffect: "Complete system blackout.",
        cascadeFailures: ["Hydraulics", "GPR", "Telemetry", "Life Support"],
        originalPosition: {x: -8, y: 14, z: 0},
        explodedPosition: {x: -15, y: 30, z: 0}
    });

    // 12-13. Hydraulics
    meshes.actuators = [];
    const hydPositions = [ {x: 6, y: 6, z: 4}, {x: 6, y: 6, z: -4} ];
    hydPositions.forEach((pos, idx) => {
        const hydData = createHydraulicActuator();
        hydData.group.position.set(pos.x, pos.y, pos.z);
        group.add(hydData.group);
        meshes.actuators.push(hydData);
        parts.push({
            name: `${idx === 0 ? 'Left' : 'Right'} Heavy Hydraulic Actuator`,
            description: "Thick steel pressure cylinder pumping a chrome piston, routed with heavy rubber hosing and copper manifolds.",
            material: "Steel, Chrome, Rubber, Copper",
            function: "Dynamically raises and lowers the massive GPR array to keep it perfectly parallel to the shifting ice.",
            assemblyOrder: 12 + idx,
            connections: ["Main Chassis", "Phased-Array GPR Emitter Plate"],
            failureEffect: "Radar array drags on ice or points into the sky, ruining data.",
            cascadeFailures: ["GPR Array Structural Damage"],
            originalPosition: pos,
            explodedPosition: {x: pos.x + (idx===0?5:-5), y: 15, z: pos.z + (idx===0?10:-10)}
        });
    });

    // 14. Towing Hitch
    const hitch = createHitch();
    hitch.position.set(16, 8, 0);
    group.add(hitch);
    parts.push({
        name: "Articulated Snowcat Hitch",
        description: "Thick steel shaft terminating in a heavy chrome ring and a multidirectional spherical joint.",
        material: "Steel, Chrome",
        function: "Connects the radar sled to the towing vehicle, absorbing rotational torque during turns.",
        assemblyOrder: 14,
        connections: ["Main Chassis"],
        failureEffect: "Sled detaches while moving, potentially sliding down a glacier uncontrollably.",
        cascadeFailures: [],
        originalPosition: {x: 16, y: 8, z: 0},
        explodedPosition: {x: 35, y: 8, z: 0}
    });

    // 15. Operator Panel
    const panelGroup = new THREE.Group();
    const panelBase = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 8), plastic);
    panelBase.position.set(12, 15, 0);
    panelBase.rotation.z = -0.2;
    panelGroup.add(panelBase);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 6), screenMat);
    screen.position.set(13.9, 15.5, 0);
    screen.rotation.z = -0.2;
    panelGroup.add(screen);
    meshes.screen = screen;
    group.add(panelGroup);
    parts.push({
        name: "OLED Diagnostic Console",
        description: "Weather-sealed UI terminal emitting a stark blue glow, displaying real-time 3D subsurface mapping.",
        material: "Plastic, Glowing Emissive Glass",
        function: "Allows technicians to calibrate frequencies and monitor terrain safely.",
        assemblyOrder: 15,
        connections: ["Main Chassis"],
        failureEffect: "Technicians cannot read subsurface data in real-time.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 20, y: 25, z: 0}
    });

    // 16. Battery Banks
    const batGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const bat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 1.5), darkSteel);
        bat.position.set(-2, 15.5, -4.5 + i*1.8);
        batGroup.add(bat);
        // Thick bridging cables
        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16), copper);
        cable.rotation.x = Math.PI/2;
        cable.position.set(-2, 17, -3.6 + i*1.8);
        batGroup.add(cable);
    }
    group.add(batGroup);
    parts.push({
        name: "Lithium-Titanate Capacitor Banks",
        description: "Six heavy industrial capacitor blocks linked by thick uninsulated copper busbars.",
        material: "Dark Steel, Copper",
        function: "Stores APU energy to release instantaneous gigawatt pulses for deep radar penetration.",
        assemblyOrder: 16,
        connections: ["Turbine APU Generator", "GPR Emitter Plate"],
        failureEffect: "Inability to pulse radar; emissions become too weak to penetrate ice.",
        cascadeFailures: ["GPR Sub-surface Processing"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -5, y: 35, z: -15}
    });

    // 17. LIDAR Turret
    const turretData = createTurret();
    turretData.group.position.set(10, 14, -3);
    group.add(turretData.group);
    meshes.lidarHead = turretData.head;
    parts.push({
        name: "Surface Navigational LIDAR",
        description: "High-speed spinning turret housed under tinted glass, firing thousands of lasers per second.",
        material: "Steel, Tinted Glass, Chrome",
        function: "Maps surface topography to detect above-ground obstacles and open crevasses ahead of the tow vehicle.",
        assemblyOrder: 17,
        connections: ["Main Chassis"],
        failureEffect: "Loss of surface awareness, requiring manual spotting in zero-visibility blizzards.",
        cascadeFailures: [],
        originalPosition: {x: 10, y: 14, z: -3},
        explodedPosition: {x: 15, y: 30, z: -15}
    });

    // 18. Yagi Array
    const yagiGroup = new THREE.Group();
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 14, 16), aluminum);
    mast.position.set(-12, 20, 4);
    yagiGroup.add(mast);
    for(let i=0; i<8; i++) {
        const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6 - i*0.5, 16), aluminum);
        cross.rotation.x = Math.PI/2;
        cross.position.set(-12, 16 + i*1.2, 4);
        yagiGroup.add(cross);
    }
    group.add(yagiGroup);
    parts.push({
        name: "Telemetry Yagi Array",
        description: "Towering aluminum mast with highly directional cross-elements tuned for satellite uplink.",
        material: "Aluminum",
        function: "Transmits massive terabyte 3D map datasets back to base camp continuously.",
        assemblyOrder: 18,
        connections: ["Main Chassis"],
        failureEffect: "Severed data uplink; local storage will quickly overflow.",
        cascadeFailures: ["OLED Diagnostic Console (Memory Full Error)"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -25, y: 40, z: 15}
    });

    // 19. Hazard Beacons
    const beaconGroup = new THREE.Group();
    const bGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const beacon1 = new THREE.Mesh(bGeo, beaconMat);
    beacon1.position.set(-14, 15, 6);
    const beacon2 = new THREE.Mesh(bGeo, beaconMat);
    beacon2.position.set(-14, 15, -6);
    beaconGroup.add(beacon1, beacon2);
    group.add(beaconGroup);
    meshes.beacons = [beacon1, beacon2];
    parts.push({
        name: "Strobe Hazard Beacons",
        description: "Intensely glowing red spherical lamps designed to cut through thick whiteout conditions.",
        material: "Emissive Red Glass",
        function: "Ensures the massive sled remains visible to other snowcats to prevent fatal collisions.",
        assemblyOrder: 19,
        connections: ["Main Chassis"],
        failureEffect: "Extreme collision hazard during polar night operations.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 20, z: 20}
    });

    // 20. Roll Cage
    const cageGroup = new THREE.Group();
    const cagePath1 = new HoseCurve(
        new THREE.Vector3(-15, 14, 6),
        new THREE.Vector3(15, 14, 6),
        new THREE.Vector3(-5, 25, 6),
        new THREE.Vector3(5, 25, 6)
    );
    const cageGeo1 = new THREE.TubeGeometry(cagePath1, 32, 0.5, 16, false);
    const cage1 = new THREE.Mesh(cageGeo1, steel);
    
    const cagePath2 = new HoseCurve(
        new THREE.Vector3(-15, 14, -6),
        new THREE.Vector3(15, 14, -6),
        new THREE.Vector3(-5, 25, -6),
        new THREE.Vector3(5, 25, -6)
    );
    const cageGeo2 = new THREE.TubeGeometry(cagePath2, 32, 0.5, 16, false);
    const cage2 = new THREE.Mesh(cageGeo2, steel);
    cageGroup.add(cage1, cage2);
    
    // Crossbars
    for(let i=-5; i<=5; i+=5) {
        const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 12, 16), steel);
        cb.rotation.x = Math.PI/2;
        // Evaluate y position based on curve approx
        cb.position.set(i, 20.5, 0); 
        cageGroup.add(cb);
    }
    group.add(cageGroup);
    parts.push({
        name: "Tubular Steel Roll Cage",
        description: "Thick curved steel piping arching entirely over the delicate instruments.",
        material: "Steel",
        function: "Protects critical components like the APU, LIDAR, and UI panels in the event the sled tips into a crevasse.",
        assemblyOrder: 20,
        connections: ["Main Chassis"],
        failureEffect: "Leaves sensitive equipment highly vulnerable to crushing forces.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 45, z: 0}
    });


    // -------------------------------------------------------------
    // METADATA & QUIZ
    // -------------------------------------------------------------
    const description = "The Glaciology Crevasse Radar (GCR-9000) is a massive, hyper-advanced ground-penetrating radar sled towed by snowcats. Built to operate in absolute zero environments, it utilizes intense phased-array emissions, lithium-titanate capacitor dumps, and real-time OLED subsurface mapping to safely guide expeditions across deadly, heavily crevassed glacial ice.";

    const quizQuestions = [
        {
            question: "What is the primary function of the massive phased-array emitters located beneath the sled?",
            options: [
                "To melt a continuous path through thick snow for easier towing.",
                "To emit focused sub-surface radar pulses for 3D crevasse detection.",
                "To communicate with orbiting satellites for real-time GPS coordinates.",
                "To generate a localized magnetic field deflecting solar radiation."
            ],
            correctAnswer: 1,
            explanation: "The GPR uses hundreds of phased-array emitters to send synchronized electromagnetic pulses deep into the ice, building a 3D dielectric map of the subsurface to identify hidden, deadly voids."
        },
        {
            question: "Why are high-density lithium-titanate capacitor banks required alongside the Turbine APU Generator?",
            options: [
                "They provide the instantaneous burst current required by the massive GPR emitters.",
                "They are chemically immune to freezing and require no thermal insulation.",
                "They act as physical ballast to prevent the sled from rolling over.",
                "They power the internal combustion engine directly in case of fuel line freezing."
            ],
            correctAnswer: 0,
            explanation: "While the APU generator provides continuous baseline power, ground-penetrating radar requires immense, instantaneous burst current for deep sub-surface pulses. Lithium-titanate capacitors handle these rapid discharge cycles efficiently."
        },
        {
            question: "What role do the heavy hydraulic actuators play in the sled's operation?",
            options: [
                "They lift the sled off the ground to change the massive tires.",
                "They steer the sled independent of the towing snowcat.",
                "They dynamically raise and lower the GPR array to keep it parallel to uneven ice.",
                "They deploy emergency spikes into the ice to stop sliding."
            ],
            correctAnswer: 2,
            explanation: "To ensure accurate subsurface mapping, the massive GPR emitter plate must remain perfectly parallel to the ice surface. The heavy hydraulic actuators constantly adjust its height and pitch as the sled traverses rough terrain."
        },
        {
            question: "What is the purpose of the spinning LIDAR turret housed under tinted glass?",
            options: [
                "To detect incoming storms by measuring atmospheric particle density.",
                "To map surface topography and detect above-ground obstacles or open crevasses.",
                "To emit a laser beacon for rescue helicopters to lock onto.",
                "To melt localized patches of ice for sampling."
            ],
            correctAnswer: 1,
            explanation: "While the GPR maps below the ice, the fast-spinning LIDAR turret constantly scans the surface terrain, building a topographical map to avoid surface collisions and open chasms."
        },
        {
            question: "Why is the Telemetry Yagi Array shaped with multiple cross-elements on a tall mast?",
            options: [
                "To act as a lightning rod during polar thunderstorms.",
                "To physically cut through hanging ice formations.",
                "To provide highly directional, high-bandwidth satellite uplink for massive datasets.",
                "To capture wind energy to supplement the APU."
            ],
            correctAnswer: 2,
            explanation: "The sled generates terabytes of 3D mapping data. The Yagi array's specific geometry (a mast with directional cross-elements) is tuned perfectly to punch high-bandwidth signals through atmospheric interference to uplink satellites."
        }
    ];

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    function animate(time, speed) {
        // Spin massive off-road tires
        if (meshes.tires) {
            meshes.tires.forEach(tire => {
                tire.rotation.z -= speed * 0.04;
            });
        }
        
        // High-RPM APU cooling fan
        if (meshes.genFan) {
            meshes.genFan.rotation.z += 0.3 * speed;
        }

        // Spin surface LIDAR turret rapidly
        if (meshes.lidarHead) {
            meshes.lidarHead.rotation.y += 0.15 * speed;
        }

        // Pulse phased-array radar emitters in a wave pattern
        if (meshes.emitters) {
            meshes.emitters.forEach((emitter, idx) => {
                const waveOffset = (emitter.position.x + emitter.position.z) * 0.5;
                const pulse = (Math.sin(time * 0.005 + waveOffset) + 1) * 0.6; // 0 to 1.2
                emitter.material.emissiveIntensity = pulse;
            });
        }

        // Strobe Hazard Beacons
        if (meshes.beacons) {
            // Sharp flashing strobe effect
            const strobe = (time % 1000 < 100) ? 5.0 : 0.5; 
            meshes.beacons.forEach(b => {
                b.material.emissiveIntensity = strobe;
            });
        }

        // Hydraulics actively adapting to "terrain"
        if (meshes.actuators) {
            // Smooth randomized sine waves mimicking uneven terrain
            const terrainAdaptation = Math.sin(time * 0.001) * 0.5 + Math.cos(time * 0.0015) * 0.5; 
            meshes.actuators.forEach(act => {
                act.piston.position.y = 7 + terrainAdaptation; 
            });
            // Antenna array moves in sync with the pistons
            if (meshes.antennaArray) {
                meshes.antennaArray.position.y = 2 - terrainAdaptation;
            }
        }
        
        // OLED Screen Glitching and Updating
        if (meshes.screen) {
            if (Math.random() > 0.92) {
                meshes.screen.material.emissiveIntensity = 0.5 + Math.random() * 2.5;
            } else {
                meshes.screen.material.emissiveIntensity = 1.5;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCrevasseRadar() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
