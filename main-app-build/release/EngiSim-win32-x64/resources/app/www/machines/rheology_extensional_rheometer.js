import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- Custom Advanced Materials ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 });
    const laserRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5, transparent: true, opacity: 0.6 });
    const polymerMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.2 });
    const activeScreenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });

    function addPart(name, mesh, desc, material, func, assemblyOrder, originalPos) {
        mesh.position.copy(originalPos);
        mesh.name = name;
        group.add(mesh);
        
        let matName = typeof material === 'string' ? material : 'custom';
        if (material === darkSteel) matName = 'darkSteel';
        if (material === steel) matName = 'steel';
        if (material === aluminum) matName = 'aluminum';
        if (material === plastic) matName = 'plastic';
        if (material === rubber) matName = 'rubber';
        if (material === tinted) matName = 'tinted';
        if (material === chrome) matName = 'chrome';
        if (material === polymerMat) matName = 'polymer';

        parts.push({
            name,
            description: desc,
            material: matName,
            function: func,
            assemblyOrder,
            connections: [],
            failureEffect: 'System halted, test data invalidated.',
            cascadeFailures: 'Rupture tracking failure.',
            originalPosition: { x: originalPos.x, y: originalPos.y, z: originalPos.z },
            explodedPosition: { x: originalPos.x * 1.5, y: originalPos.y * 1.5 + 2, z: originalPos.z * 1.5 }
        });
        return mesh;
    }

    // --- Complex Geometry Generators ---

    function createTable() {
        const tGroup = new THREE.Group();
        const topShape = new THREE.Shape();
        const w = 16, d = 12, r = 1;
        topShape.moveTo(-w/2 + r, -d/2);
        topShape.lineTo(w/2 - r, -d/2);
        topShape.quadraticCurveTo(w/2, -d/2, w/2, -d/2 + r);
        topShape.lineTo(w/2, d/2 - r);
        topShape.quadraticCurveTo(w/2, d/2, w/2 - r, d/2);
        topShape.lineTo(-w/2 + r, d/2);
        topShape.quadraticCurveTo(-w/2, d/2, -w/2, d/2 - r);
        topShape.lineTo(-w/2, -d/2 + r);
        topShape.quadraticCurveTo(-w/2, -d/2, -w/2 + r, -d/2);

        const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const topGeo = new THREE.ExtrudeGeometry(topShape, extrudeSettings);
        const topMesh = new THREE.Mesh(topGeo, darkSteel);
        topMesh.rotation.x = Math.PI/2;
        tGroup.add(topMesh);

        // Massive under-frame bracing
        const frameGeo1 = new THREE.BoxGeometry(14, 0.4, 0.4);
        const f1 = new THREE.Mesh(frameGeo1, steel);
        f1.position.set(0, -0.6, 4);
        tGroup.add(f1);
        const f2 = new THREE.Mesh(frameGeo1, steel);
        f2.position.set(0, -0.6, -4);
        tGroup.add(f2);
        
        const frameGeo2 = new THREE.BoxGeometry(0.4, 0.4, 8.4);
        const f3 = new THREE.Mesh(frameGeo2, steel);
        f3.position.set(6, -0.6, 0);
        tGroup.add(f3);
        const f4 = new THREE.Mesh(frameGeo2, steel);
        f4.position.set(-6, -0.6, 0);
        tGroup.add(f4);

        return tGroup;
    }

    function createLeg() {
        const lGroup = new THREE.Group();
        
        const housingGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
        const housing = new THREE.Mesh(housingGeo, steel);
        housing.position.y = -1.25;
        lGroup.add(housing);

        const points = [];
        for(let i=0; i<12; i++) {
            points.push(new THREE.Vector2(0.5, -2.5 - i*0.15));
            points.push(new THREE.Vector2(0.7, -2.5 - i*0.15 - 0.075));
        }
        points.push(new THREE.Vector2(0.5, -4.3));
        const bellowsGeo = new THREE.LatheGeometry(points, 32);
        const bellows = new THREE.Mesh(bellowsGeo, rubber);
        lGroup.add(bellows);

        const footGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 32);
        const foot = new THREE.Mesh(footGeo, darkSteel);
        foot.position.y = -4.45;
        lGroup.add(foot);

        return lGroup;
    }

    function createServoMotor() {
        const mGroup = new THREE.Group();
        
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(1.2, 0));
        // Deep cooling fins
        for(let i=0; i<24; i++) {
            const y = 0.2 + i*0.12;
            points.push(new THREE.Vector2(1.2, y));
            points.push(new THREE.Vector2(1.6, y));
            points.push(new THREE.Vector2(1.6, y+0.08));
            points.push(new THREE.Vector2(1.2, y+0.08));
        }
        points.push(new THREE.Vector2(1.2, 3.2));
        points.push(new THREE.Vector2(0.8, 3.2));
        points.push(new THREE.Vector2(0.8, 4.0)); // shaft collar
        points.push(new THREE.Vector2(0, 4.0));
        
        const latheGeo = new THREE.LatheGeometry(points, 64);
        const housing = new THREE.Mesh(latheGeo, darkSteel);
        mGroup.add(housing);

        // Power terminal box
        const tbGeo = new THREE.BoxGeometry(0.8, 1.0, 1.0);
        const tb = new THREE.Mesh(tbGeo, plastic);
        tb.position.set(1.4, 1.5, 0);
        mGroup.add(tb);
        
        // High resolution encoder on the back
        const encGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.6, 32);
        const enc = new THREE.Mesh(encGeo, aluminum);
        enc.position.y = -0.3;
        mGroup.add(enc);

        return mGroup;
    }

    function createGearbox() {
        const gGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.5, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 0.75;
        gGroup.add(base);

        for(let i=0; i<8; i++) {
            const ribGeo = new THREE.BoxGeometry(2.4, 1.3, 0.2);
            const rib = new THREE.Mesh(ribGeo, steel);
            rib.position.y = 0.75;
            rib.rotation.y = (i/8) * Math.PI;
            gGroup.add(rib);
        }
        return gGroup;
    }

    function createDrum() {
        const dGroup = new THREE.Group();
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(1.5, 0)); 
        points.push(new THREE.Vector2(1.5, 0.1));
        points.push(new THREE.Vector2(1.6, 0.1)); // edge flange
        points.push(new THREE.Vector2(1.6, 0.2));
        points.push(new THREE.Vector2(1.5, 0.2));
        
        // Micro-grooved winding surface
        for(let y=0.2; y<=1.8; y+=0.04) {
            points.push(new THREE.Vector2(1.5, y));
            points.push(new THREE.Vector2(1.48, y+0.02));
        }

        points.push(new THREE.Vector2(1.5, 1.8));
        points.push(new THREE.Vector2(1.6, 1.8)); // edge flange
        points.push(new THREE.Vector2(1.6, 1.9));
        points.push(new THREE.Vector2(1.5, 1.9));
        points.push(new THREE.Vector2(1.5, 2.0));
        points.push(new THREE.Vector2(0, 2.0));

        const latheGeo = new THREE.LatheGeometry(points, 64);
        const mesh = new THREE.Mesh(latheGeo, steel);
        dGroup.add(mesh);

        // Mounting bolts on front face
        for(let i=0; i<6; i++) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 6), chrome);
            bolt.rotation.x = Math.PI/2;
            const angle = (i/6)*Math.PI*2;
            bolt.position.set(1.0 * Math.cos(angle), 2.0, 1.0 * Math.sin(angle));
            dGroup.add(bolt);
        }

        return dGroup;
    }

    function createControlUnit() {
        const cGroup = new THREE.Group();
        
        const rackGeo = new THREE.BoxGeometry(3.5, 8, 3.5);
        const rack = new THREE.Mesh(rackGeo, darkSteel);
        rack.position.set(0, 4, 0);
        cGroup.add(rack);

        const screen1Geo = new THREE.BoxGeometry(3.0, 2.0, 0.1);
        const screen1 = new THREE.Mesh(screen1Geo, activeScreenMat);
        screen1.position.set(0, 6.5, 1.8);
        screen1.name = 'MainScreen';
        cGroup.add(screen1);

        const screen2Geo = new THREE.BoxGeometry(3.0, 2.0, 0.1);
        const screen2 = new THREE.Mesh(screen2Geo, neonBlue);
        screen2.position.set(0, 4.0, 1.8);
        cGroup.add(screen2);

        for(let r=0; r<4; r++) {
            for(let c=0; c<6; c++) {
                const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16), (r===0 || c===0) ? plastic : chrome);
                btn.rotation.x = Math.PI/2;
                btn.position.set(-1.2 + c*0.48, 2.2 - r*0.4, 1.8);
                cGroup.add(btn);
            }
        }

        // Emergency Stop
        const estopBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32), polymerMat); // yellow base
        estopBase.rotation.x = Math.PI/2;
        estopBase.position.set(1.0, 1.0, 1.8);
        cGroup.add(estopBase);
        const estopBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32), laserRed);
        estopBtn.rotation.x = Math.PI/2;
        estopBtn.position.set(1.0, 1.0, 1.9);
        cGroup.add(estopBtn);

        return cGroup;
    }

    function createCameraMount() {
        const mGroup = new THREE.Group();
        
        const railGeo = new THREE.BoxGeometry(1.5, 0.5, 8);
        const rail = new THREE.Mesh(railGeo, steel);
        rail.position.set(0, 0.25, 4);
        mGroup.add(rail);

        const blockGeo = new THREE.BoxGeometry(1.8, 1.0, 2.0);
        const block = new THREE.Mesh(blockGeo, aluminum);
        block.position.set(0, 1.0, 6);
        mGroup.add(block);

        const armGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 32);
        const arm = new THREE.Mesh(armGeo, darkSteel);
        arm.position.set(0, 2.75, 6);
        mGroup.add(arm);

        return mGroup;
    }

    function createCamera() {
        const cGroup = new THREE.Group();
        
        const bodyGeo = new THREE.BoxGeometry(2.5, 2.5, 5);
        const body = new THREE.Mesh(bodyGeo, plastic);
        cGroup.add(body);

        // Intricate High-Speed Lens
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.8, 0));
        points.push(new THREE.Vector2(0.8, 0.5));
        points.push(new THREE.Vector2(1.1, 0.5));
        points.push(new THREE.Vector2(1.1, 1.2));
        points.push(new THREE.Vector2(1.3, 1.2));
        points.push(new THREE.Vector2(1.3, 2.0));
        points.push(new THREE.Vector2(1.6, 2.0));
        points.push(new THREE.Vector2(1.6, 3.5));
        points.push(new THREE.Vector2(0, 3.5));
        
        const lensGeo = new THREE.LatheGeometry(points, 64);
        const lens = new THREE.Mesh(lensGeo, darkSteel);
        lens.rotation.x = -Math.PI/2;
        lens.position.z = -2.5; // Front of body, pointing to -Z
        cGroup.add(lens);

        const glassGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
        const glass = new THREE.Mesh(glassGeo, tinted);
        glass.rotation.x = Math.PI/2;
        glass.position.z = -6.05;
        cGroup.add(glass);

        // Internal flash light for dramatic effect
        const flashLight = new THREE.PointLight(0xffffff, 0, 20);
        flashLight.position.set(0, 0, -6.5);
        flashLight.name = "FlashLight";
        cGroup.add(flashLight);

        return cGroup;
    }

    function createLaserUnit(isEmitter) {
        const uGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(2, 2.5, 1.5);
        const base = new THREE.Mesh(baseGeo, aluminum);
        uGroup.add(base);

        const apertureGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const aperture = new THREE.Mesh(apertureGeo, darkSteel);
        aperture.rotation.x = Math.PI/2;
        aperture.position.z = isEmitter ? 0.75 : -0.75;
        aperture.position.y = 0.5;
        uGroup.add(aperture);

        const ledGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const led = new THREE.Mesh(ledGeo, isEmitter ? neonBlue : laserRed);
        led.position.set(0.6, 1.0, isEmitter ? 0.75 : -0.75);
        uGroup.add(led);

        return uGroup;
    }

    function createOvenBase() {
        const oGroup = new THREE.Group();
        
        const shape = new THREE.Shape();
        shape.moveTo(-4.5, -3);
        shape.lineTo(4.5, -3);
        shape.lineTo(4.5, 3);
        shape.lineTo(-4.5, 3);
        shape.lineTo(-4.5, -3);

        const hole = new THREE.Path();
        hole.moveTo(-4, -2.5);
        hole.lineTo(4, -2.5);
        hole.lineTo(4, 2.5);
        hole.lineTo(-4, 2.5);
        hole.lineTo(-4, -2.5);
        shape.holes.push(hole);

        const extrudeSettings = { depth: 2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, aluminum);
        mesh.rotation.x = Math.PI/2;
        oGroup.add(mesh);

        // Internal heating coils
        for(let i=0; i<3; i++) {
            const heatGeo = new THREE.TorusGeometry(3.5 - i*0.5, 0.08, 16, 64);
            const heater = new THREE.Mesh(heatGeo, new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0xff1100, emissiveIntensity: 2}));
            heater.rotation.x = Math.PI/2;
            heater.position.y = -1.0 + i*0.4;
            oGroup.add(heater);
        }

        return oGroup;
    }

    function createOvenLid() {
        const lGroup = new THREE.Group();
        // Shift frame so pivot is at Z=0 locally, but geometry extends into -Z
        const frameGeo = new THREE.BoxGeometry(9, 4, 6);
        frameGeo.translate(0, 2, -3); 
        const edges = new THREE.EdgesGeometry(frameGeo);
        const frame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 3 }));
        lGroup.add(frame);
        
        const glassGeo = new THREE.BoxGeometry(8.8, 3.8, 5.8);
        glassGeo.translate(0, 2, -3);
        const glass = new THREE.Mesh(glassGeo, tinted);
        lGroup.add(glass);

        // Handles
        const handleGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
        const handle = new THREE.Mesh(handleGeo, chrome);
        handle.rotation.z = Math.PI/2;
        handle.position.set(0, 0.5, -5.9);
        lGroup.add(handle);

        return lGroup;
    }

    class CableCurve extends THREE.Curve {
        constructor(start, ctrl1, ctrl2, end) {
            super();
            this.start = start; this.ctrl1 = ctrl1; this.ctrl2 = ctrl2; this.end = end;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const v = optionalTarget;
            v.x = Math.pow(1-t,3)*this.start.x + 3*Math.pow(1-t,2)*t*this.ctrl1.x + 3*(1-t)*Math.pow(t,2)*this.ctrl2.x + Math.pow(t,3)*this.end.x;
            v.y = Math.pow(1-t,3)*this.start.y + 3*Math.pow(1-t,2)*t*this.ctrl1.y + 3*(1-t)*Math.pow(t,2)*this.ctrl2.y + Math.pow(t,3)*this.end.y;
            v.z = Math.pow(1-t,3)*this.start.z + 3*Math.pow(1-t,2)*t*this.ctrl1.z + 3*(1-t)*Math.pow(t,2)*this.ctrl2.z + Math.pow(t,3)*this.end.z;
            return v;
        }
    }

    function createWires() {
        const wGroup = new THREE.Group();
        // Route cables from control tower to motors and camera
        const towerPt = new THREE.Vector3(-10, 2, 5);
        
        const c1 = new CableCurve(towerPt, new THREE.Vector3(-6, 0, 6), new THREE.Vector3(-2, 0, 5.5), new THREE.Vector3(-2, 1.5, 4.5)); // Left Motor
        wGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c1, 64, 0.1, 8, false), rubber));

        const c2 = new CableCurve(towerPt, new THREE.Vector3(-4, 0, 7), new THREE.Vector3(2, 0, 5.5), new THREE.Vector3(2, 1.5, 4.5)); // Right Motor
        wGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c2, 64, 0.1, 8, false), rubber));

        const c3 = new CableCurve(towerPt, new THREE.Vector3(-8, -1, 6), new THREE.Vector3(0, -1, 7), new THREE.Vector3(0, 4, 6)); // Camera
        wGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c3, 64, 0.08, 8, false), rubber));

        const c4 = new CableCurve(towerPt, new THREE.Vector3(-10, 6, 4), new THREE.Vector3(-5, 6, 0), new THREE.Vector3(0, 5, 0)); // Laser Top
        wGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c4, 64, 0.06, 8, false), rubber));

        return wGroup;
    }

    // --- System Assembly ---
    
    addPart('Vibration_Table', createTable(), 'Massive optical table for extreme vibration isolation.', darkSteel, 'Provides a perfectly stable base.', 1, new THREE.Vector3(0, 0, 0));
    addPart('Table_Leg_FL', createLeg(), 'Pneumatic vibration damper leg.', steel, 'Isolates high frequency floor vibrations.', 2, new THREE.Vector3(-6, 0, 4));
    addPart('Table_Leg_FR', createLeg(), 'Pneumatic vibration damper leg.', steel, 'Isolates high frequency floor vibrations.', 3, new THREE.Vector3(6, 0, 4));
    addPart('Table_Leg_BL', createLeg(), 'Pneumatic vibration damper leg.', steel, 'Isolates high frequency floor vibrations.', 4, new THREE.Vector3(-6, 0, -4));
    addPart('Table_Leg_BR', createLeg(), 'Pneumatic vibration damper leg.', steel, 'Isolates high frequency floor vibrations.', 5, new THREE.Vector3(6, 0, -4));
    
    // Motors point towards -Z (rotation.x = Math.PI/2)
    const lMotor = createServoMotor();
    lMotor.rotation.x = Math.PI/2;
    addPart('Left_Servo_Motor', lMotor, 'High torque direct-drive servo motor.', darkSteel, 'Drives the left drum at precise rotational speeds.', 6, new THREE.Vector3(-2, 1.5, 4.5));

    const rMotor = createServoMotor();
    rMotor.rotation.x = Math.PI/2;
    addPart('Right_Servo_Motor', rMotor, 'High torque direct-drive servo motor.', darkSteel, 'Drives the right drum in counter-rotation.', 7, new THREE.Vector3(2, 1.5, 4.5));

    const lGear = createGearbox();
    lGear.rotation.x = Math.PI/2;
    addPart('Left_Gearbox', lGear, 'High precision planetary gearbox.', steel, 'Provides torque multiplication and backlash elimination.', 8, new THREE.Vector3(-2, 1.5, 2.5));

    const rGear = createGearbox();
    rGear.rotation.x = Math.PI/2;
    addPart('Right_Gearbox', rGear, 'High precision planetary gearbox.', steel, 'Provides torque multiplication and backlash elimination.', 9, new THREE.Vector3(2, 1.5, 2.5));

    const lDrum = createDrum();
    lDrum.rotation.x = Math.PI/2;
    addPart('Left_Drum', lDrum, 'Precision machined winding drum.', steel, 'Winds the polymer filament to stretch it.', 10, new THREE.Vector3(-2, 1.5, 1));

    const rDrum = createDrum();
    rDrum.rotation.x = Math.PI/2;
    addPart('Right_Drum', rDrum, 'Precision machined winding drum.', steel, 'Winds the polymer filament to stretch it.', 11, new THREE.Vector3(2, 1.5, 1));

    // The Polymer Filament
    const filamentGroup = new THREE.Group();
    const filamentSegments = [];
    const NUM_SEGMENTS = 60;
    for (let i = 0; i < NUM_SEGMENTS; i++) {
        // Gap is from X = -2 to X = 2 (Length 4)
        const geo = new THREE.CylinderGeometry(0.5, 0.5, 4 / NUM_SEGMENTS, 16);
        geo.rotateZ(Math.PI / 2); // Align cylinder along local X
        const mesh = new THREE.Mesh(geo, polymerMat);
        const xPos = -2 + (i / (NUM_SEGMENTS - 1)) * 4;
        mesh.position.set(xPos, 0, 0);
        mesh.userData.baseX = xPos;
        filamentGroup.add(mesh);
        filamentSegments.push(mesh);
    }
    filamentGroup.userData.segments = filamentSegments;
    // Positioned so it sits tangent on top of drums (Drum radius 1.5, Drum center Y=1.5 => Tangent Y=3.0)
    addPart('Polymer_Filament', filamentGroup, 'Highly viscous polymer melt sample.', polymerMat, 'The material undergoing extensional testing.', 12, new THREE.Vector3(0, 3.0, -0.5));

    addPart('Control_Tower', createControlUnit(), 'Main electronics and data acquisition terminal.', darkSteel, 'Processes sensor data and controls motor synchronization.', 13, new THREE.Vector3(-10, 0, 5));

    const emitter = createLaserUnit(true);
    emitter.rotation.x = Math.PI/2;
    addPart('Laser_Emitter', emitter, 'High precision laser micrometer emitter.', aluminum, 'Casts a laser sheet to measure filament thickness.', 14, new THREE.Vector3(0, 6, -0.5));

    const receiver = createLaserUnit(false);
    receiver.rotation.x = -Math.PI/2;
    addPart('Laser_Receiver', receiver, 'Laser micrometer receiver array.', aluminum, 'Detects laser occlusion to calculate instantaneous diameter.', 15, new THREE.Vector3(0, 0.5, -0.5));

    const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 5.5, 16);
    const beam = new THREE.Mesh(beamGeo, laserRed);
    addPart('Laser_Beam', beam, 'Visible laser measurement beam.', laserRed, 'Optical path for measurement.', 16, new THREE.Vector3(0, 3.25, -0.5));

    addPart('Camera_Mount', createCameraMount(), 'Adjustable rail system for the optical camera.', steel, 'Positions and stabilizes the high-speed camera.', 17, new THREE.Vector3(0, 0, 0));

    const cam = createCamera();
    addPart('High_Speed_Camera', cam, '100,000 FPS capable high-speed optical sensor.', plastic, 'Captures the rapid necking and rupture of the filament.', 18, new THREE.Vector3(0, 4, 6));

    addPart('Oven_Base', createOvenBase(), 'Thermal chamber bottom half with heating elements.', aluminum, 'Maintains isothermal environment for the polymer melt.', 19, new THREE.Vector3(0, 1.5, -0.5));

    const lid = createOvenLid();
    lid.rotation.x = -Math.PI/3; // Open position to see action
    addPart('Oven_Lid', lid, 'Transparent heated cover with nitrogen purge.', tinted, 'Maintains temperature while allowing visual access.', 20, new THREE.Vector3(0, 1.5, 2.5));

    addPart('Power_Cables', createWires(), 'Hydraulic, power, and data wiring harness.', rubber, 'Transmits power, sensor data, and hydraulic pressure across components.', 21, new THREE.Vector3(0, 0, 0));

    // --- Quiz Questions ---
    const quizQuestions = [
        {
            question: "What is the primary purpose of this extensional rheometer?",
            options: ["To measure shear viscosity", "To measure the extensional viscosity of polymer melts", "To calculate thermal conductivity", "To test the tensile strength of solid steel"],
            answer: 1,
            explanation: "Extensional rheometers stretch highly viscous fluids (like polymer melts) to determine their extensional viscosity and strain hardening behavior."
        },
        {
            question: "Why does the filament exhibit 'necking' (thinning in the center)?",
            options: ["Due to localized stress concentration and material properties", "Because the laser burns the center", "The camera flash melts it", "It is an optical illusion"],
            answer: 0,
            explanation: "As the material is stretched, localized stress concentrations cause the center to yield and thin faster than the clamped ends, a phenomenon known as necking."
        },
        {
            question: "What is the function of the twin counter-rotating drums?",
            options: ["To mix the polymer", "To cool the sample", "To apply a constant extensional strain rate without shear", "To generate electricity"],
            answer: 2,
            explanation: "Counter-rotating drums wind the polymer filament symmetrically, ensuring the center of the sample remains stationary while experiencing pure extensional flow."
        },
        {
            question: "What role does the laser micrometer play?",
            options: ["It heats the filament", "It tracks the instantaneous diameter evolution in real-time", "It cuts the filament at the end", "It powers the servo motors"],
            answer: 1,
            explanation: "The laser micrometer continuously measures the thinning diameter of the filament to calculate the true Hencky strain and transient extensional viscosity."
        },
        {
            question: "Why is the massive vibration isolation table necessary?",
            options: ["To make the machine look impressive", "Because the motors are very heavy", "To prevent ambient vibrations from corrupting micro-scale optical measurements", "To store the cables underneath"],
            answer: 2,
            explanation: "High-speed camera imaging and precise laser micrometry require extreme stability; external vibrations would introduce severe noise into the delicate rheological measurements."
        }
    ];

    // --- Animate Function ---
    function animate(time, speed, meshes) {
        const cycle = (time * speed) % 6;
        
        const filament = meshes['Polymer_Filament'];
        const lDrum = meshes['Left_Drum'];
        const rDrum = meshes['Right_Drum'];
        const laser = meshes['Laser_Beam'];
        const cam = meshes['High_Speed_Camera'];
        
        const cTower = meshes['Control_Tower'];
        if (cTower) {
            const screen = cTower.children.find(c => c.name === 'MainScreen');
            if (screen) {
                screen.material.emissiveIntensity = 1 + 0.8 * Math.sin(time * 15);
            }
        }

        if (cycle < 1) {
            // Idle / Heating phase
            if (lDrum && rDrum) {
                lDrum.rotation.y = 0;
                rDrum.rotation.y = 0;
            }
            if (laser) laser.material.opacity = 0.1;
            
            if (filament && filament.userData.segments) {
                filament.userData.segments.forEach(seg => {
                    seg.position.set(seg.userData.baseX, 0, 0);
                    seg.rotation.set(0, 0, Math.PI/2);
                    seg.scale.set(1, 1, 1);
                    seg.material.opacity = 0.9;
                });
            }
            if (cam) {
                const flash = cam.getObjectByName("FlashLight");
                if (flash) flash.intensity = 0;
            }
        } else if (cycle >= 1 && cycle < 4) {
            // Stretching phase
            const stretchProgress = cycle - 1; // 0 to 3
            
            // Drums rotate around their local Y axis (which points to -Z globally)
            if (lDrum && rDrum) {
                lDrum.rotation.y = stretchProgress * 4;
                rDrum.rotation.y = -stretchProgress * 4;
            }

            if (laser) laser.material.opacity = 0.6 + 0.4 * Math.sin(time * 30);
            
            const strain = stretchProgress * 1.5;
            const midRadius = 0.5 * Math.exp(-strain);

            if (filament && filament.userData.segments) {
                filament.userData.segments.forEach(seg => {
                    const dist = Math.abs(seg.userData.baseX) / 2.0; // Normalized 0 to 1
                    // Parabolic necking profile
                    const radius = midRadius + (0.5 - midRadius) * Math.pow(dist, 2);
                    
                    seg.scale.set(radius / 0.5, 1, radius / 0.5);
                    seg.position.set(seg.userData.baseX, 0, 0);
                    seg.rotation.set(0, 0, Math.PI/2);
                    seg.material.opacity = 0.9;
                });
            }
        } else if (cycle >= 4 && cycle < 5) {
            // Rupture and snap back
            if (laser) laser.material.opacity = 0.1;
            
            if (filament && filament.userData.segments) {
                filament.userData.segments.forEach(seg => {
                    const distNormalized = Math.abs(seg.userData.baseX) / 2.0;
                    // Wrap angle around the drum circumference in the XY plane
                    const angle = (1 - distNormalized) * Math.PI * 4; 
                    const wrapRadius = 1.55;
                    
                    if (seg.userData.baseX < 0) {
                        seg.position.x = -2 - wrapRadius * Math.sin(angle); 
                        seg.position.y = -1.5 + wrapRadius * Math.cos(angle);
                        seg.position.z = 0;
                        seg.rotation.set(0, 0, angle); 
                    } else {
                        seg.position.x = 2 + wrapRadius * Math.sin(angle);
                        seg.position.y = -1.5 + wrapRadius * Math.cos(angle);
                        seg.position.z = 0;
                        seg.rotation.set(0, 0, -angle);
                    }
                    seg.scale.set(0.1, 1, 0.1);
                });
            }

            // High Speed Camera Flash
            if (cam) {
                const flash = cam.getObjectByName("FlashLight");
                if (flash) {
                    flash.intensity = (Math.sin(time * 60) > 0.5) ? 15 : 0;
                }
            }
        } else {
            // Post rupture pause
            if (cam) {
                const flash = cam.getObjectByName("FlashLight");
                if (flash) flash.intensity = 0;
            }
        }
    }

    const description = "The Extensional Rheometer (Sentmanat style) features twin counter-rotating drums that apply precise extensional strain to a highly viscous polymer melt. Equipped with high-speed camera tracking, a thermal isolation chamber, and laser micrometer diameter feedback, it captures the complete non-linear viscoelastic response, strain hardening, and ultimate filament rupture.";

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createExtensionalRheometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
