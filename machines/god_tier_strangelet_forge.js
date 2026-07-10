import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- ANIMATION STATE ---
    const animObjects = {
        wheels: [],
        steeringWheels: [], // Front wheels for steering
        suspensions: [],
        pistons: [],
        core: null,
        rings: [],
        booms: [],
        particles: [],
        screens: [],
        plasmaLines: [],
        lights: [],
        timeOffset: 0
    };

    // --- CUSTOM MATERIALS ---
    // Emissive and highly specialized materials derived from basic colors
    const glowingStrangelet = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5,
        roughness: 0.05,
        metalness: 0.9,
        transparent: true,
        opacity: 0.95,
        wireframe: false
    });

    const plasmaGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.8
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 2
    });

    const warningRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 1.5
    });
    
    const laserBeam = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
    });

    const exhaustParticleMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        transparent: true,
        opacity: 0.8,
        roughness: 1.0
    });

    // --- HELPER CLASSES & FUNCTIONS ---

    // Complex Spring Coil Curve for Suspensions
    class SpiralCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = t * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    function createComplexTire(isSteerable) {
        const wheelGroup = new THREE.Group();
        
        // Main torus for tire carcass
        const tireGeo = new THREE.TorusGeometry( 5, 2.2, 48, 120 );
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Aggressive Off-Road Treads (Hundreds of lugs)
        const lugGeo = new THREE.BoxGeometry( 2.2, 0.6, 2.8 );
        const numLugs = 72; // Extreme detail
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const radius = 7.1; // Outer radius of torus
            lug.position.set( Math.cos(angle)*radius, Math.sin(angle)*radius, 0 );
            lug.rotation.z = angle;
            // Chevron pattern
            lug.rotation.x = Math.PI / 6 * (i % 2 === 0 ? 1 : -1);
            wheelGroup.add(lug);
        }
        
        // Rims (Cylinder with inset)
        const rimGeo = new THREE.CylinderGeometry( 4.8, 4.8, 1.5, 64 );
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Complex Spoke Array
        const spokeGeo = new THREE.CylinderGeometry( 0.3, 0.5, 4.8, 32 );
        for (let i = 0; i < 16; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / 16) * Math.PI * 2;
            spoke.position.x = Math.cos(spoke.rotation.z) * 2.4;
            spoke.position.y = Math.sin(spoke.rotation.z) * 2.4;
            wheelGroup.add(spoke);
        }
        
        // Central Hub
        const hubGeo = new THREE.CylinderGeometry( 1.5, 1.5, 2.5, 64 );
        const hub = new THREE.Mesh(hubGeo, steel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        // Lug Nuts
        const boltGeo = new THREE.CylinderGeometry( 0.2, 0.2, 2.6, 16 );
        for (let i = 0; i < 10; i++) {
            const bolt = new THREE.Mesh(boltGeo, chrome);
            const bAngle = (i / 10) * Math.PI * 2;
            bolt.position.set( Math.cos(bAngle)*1.0, Math.sin(bAngle)*1.0, 0 );
            bolt.rotation.x = Math.PI / 2;
            wheelGroup.add(bolt);
        }

        // Inner Brake Caliper
        const caliperGeo = new THREE.BoxGeometry(2, 4, 1.8);
        const caliper = new THREE.Mesh(caliperGeo, warningRed);
        caliper.position.set(3, 0, -0.5);
        wheelGroup.add(caliper);
        
        animObjects.wheels.push(wheelGroup);
        if(isSteerable) {
            animObjects.steeringWheels.push(wheelGroup);
        }
        
        return wheelGroup;
    }

    function createPiston(startPos, endPos, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer housing
        const outerGeo = new THREE.CylinderGeometry(radius, radius, 1, 32);
        outerGeo.translate(0, 0.5, 0);
        outerGeo.rotateX(Math.PI/2);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        
        // Inner rod
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, 1, 32);
        innerGeo.translate(0, 0.5, 0);
        innerGeo.rotateX(Math.PI/2);
        const inner = new THREE.Mesh(innerGeo, chrome);
        
        pistonGroup.add(outer);
        pistonGroup.add(inner);
        
        pistonGroup.position.copy(startPos);
        pistonGroup.lookAt(endPos);
        
        const dist = startPos.distanceTo(endPos);
        outer.scale.z = dist * 0.5; 
        inner.position.z = dist * 0.5; 
        inner.scale.z = dist * 0.5;
        
        // Add rivets to housing
        const rivetGeo = new THREE.SphereGeometry(radius * 0.2, 8, 8);
        for(let i=0; i<4; i++) {
            const rivet = new THREE.Mesh(rivetGeo, steel);
            rivet.position.set(Math.cos(i * Math.PI/2) * radius, Math.sin(i * Math.PI/2) * radius, 0.2);
            outer.add(rivet);
        }

        return pistonGroup;
    }

    function createHydraulicLines(start, end, control1, control2, count) {
        const linesGroup = new THREE.Group();
        for(let i=0; i<count; i++) {
            const offset = new THREE.Vector3((Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5);
            const curve = new THREE.CubicBezierCurve3(
                start.clone().add(offset),
                control1.clone().add(offset),
                control2.clone().add(offset),
                end.clone().add(offset)
            );
            const geo = new THREE.TubeGeometry(curve, 64, 0.15, 12, false);
            const mesh = new THREE.Mesh(geo, rubber);
            linesGroup.add(mesh);
        }
        return linesGroup;
    }

    function createGrate(width, length) {
        const group = new THREE.Group();
        const thickness = 0.15;
        const spacing = 0.8;
        
        for(let x = -width/2; x <= width/2; x += spacing) {
            const barGeo = new THREE.BoxGeometry(thickness, thickness, length);
            const bar = new THREE.Mesh(barGeo, steel);
            bar.position.x = x;
            group.add(bar);
        }
        
        for(let z = -length/2; z <= length/2; z += spacing) {
            const barGeo = new THREE.BoxGeometry(width, thickness, thickness);
            const bar = new THREE.Mesh(barGeo, steel);
            bar.position.z = z;
            group.add(bar);
        }
        return group;
    }

    function createSeat() {
        const seatGroup = new THREE.Group();
        
        const baseGeo = new THREE.BoxGeometry(2, 1, 2);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 0.5;
        seatGroup.add(base);
        
        const cushionGeo = new THREE.BoxGeometry(2.2, 0.6, 2.2);
        const cushion = new THREE.Mesh(cushionGeo, rubber);
        cushion.position.y = 1.3;
        seatGroup.add(cushion);
        
        const backGeo = new THREE.BoxGeometry(2.2, 3.5, 0.6);
        const back = new THREE.Mesh(backGeo, rubber);
        back.position.set(0, 3.2, -0.8);
        back.rotation.x = -0.15;
        seatGroup.add(back);
        
        const headrestGeo = new THREE.BoxGeometry(1.5, 0.8, 0.6);
        const headrest = new THREE.Mesh(headrestGeo, rubber);
        headrest.position.set(0, 5.2, -1.1);
        headrest.rotation.x = -0.15;
        seatGroup.add(headrest);

        const armrestGeo = new THREE.BoxGeometry(0.5, 0.5, 2);
        const armLeft = new THREE.Mesh(armrestGeo, plastic);
        armLeft.position.set(-1.3, 2.5, 0);
        const armRight = new THREE.Mesh(armrestGeo, plastic);
        armRight.position.set(1.3, 2.5, 0);
        seatGroup.add(armLeft);
        seatGroup.add(armRight);
        
        return seatGroup;
    }

    function createControlPanel() {
        const panelGroup = new THREE.Group();
        
        // Main console
        const panelGeo = new THREE.BoxGeometry(6, 3, 1);
        const panel = new THREE.Mesh(panelGeo, darkSteel);
        panel.rotation.x = -Math.PI / 4;
        panelGroup.add(panel);

        // Screens
        const screenGeo = new THREE.PlaneGeometry(1.8, 1.2);
        const screen1 = new THREE.Mesh(screenGeo, screenMaterial);
        screen1.position.set(-1.5, 0.2, 0.51);
        panel.add(screen1);
        animObjects.screens.push(screen1);

        const screen2 = new THREE.Mesh(screenGeo, screenMaterial);
        screen2.position.set(1.5, 0.2, 0.51);
        panel.add(screen2);
        animObjects.screens.push(screen2);
        
        // Hundreds of buttons and sliders
        for(let i=0; i<40; i++) {
            const btnGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            const btnMat = new THREE.MeshStandardMaterial({ 
                color: Math.random() > 0.5 ? 0xff0000 : (Math.random() > 0.5 ? 0x00ff00 : 0x0000ff),
                emissive: Math.random() > 0.5 ? 0xaa0000 : 0x00aa00
            });
            const btn = new THREE.Mesh(btnGeo, btnMat);
            btn.position.set(-2.5 + (i%10)*0.55, -0.5 - Math.floor(i/10)*0.3, 0.51);
            panel.add(btn);
        }

        // Joysticks
        const joyBaseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 16);
        const joyBase = new THREE.Mesh(joyBaseGeo, steel);
        joyBase.position.set(0, -1, 0.6);
        joyBase.rotation.x = Math.PI / 2;
        panel.add(joyBase);

        const joyStickGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
        const joyStick = new THREE.Mesh(joyStickGeo, chrome);
        joyStick.position.set(0, -1, 1.3);
        joyStick.rotation.x = Math.PI / 2;
        panel.add(joyStick);

        const joyTopGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const joyTop = new THREE.Mesh(joyTopGeo, warningRed);
        joyTop.position.set(0, -1, 2.0);
        panel.add(joyTop);

        return panelGroup;
    }

    function createInjectorBoom() {
        const boomGroup = new THREE.Group();
        
        // Base Swivel
        const baseGeo = new THREE.CylinderGeometry(3, 4, 2, 32);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        boomGroup.add(base);

        // Lower Arm
        const lowerArmGeo = new THREE.BoxGeometry(1.5, 12, 2);
        lowerArmGeo.translate(0, 6, 0);
        const lowerArm = new THREE.Mesh(lowerArmGeo, steel);
        lowerArm.position.y = 1;
        lowerArm.rotation.z = Math.PI / 6;
        boomGroup.add(lowerArm);

        // Upper Arm
        const upperArmGeo = new THREE.BoxGeometry(1.2, 10, 1.5);
        upperArmGeo.translate(0, 5, 0);
        const upperArm = new THREE.Mesh(upperArmGeo, steel);
        upperArm.position.set(-5, 11, 0);
        upperArm.rotation.z = -Math.PI / 3;
        boomGroup.add(upperArm);

        // Joint Cylinders
        const joint1Geo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 32);
        const joint1 = new THREE.Mesh(joint1Geo, chrome);
        joint1.rotation.x = Math.PI / 2;
        joint1.position.set(0, 1, 0);
        boomGroup.add(joint1);

        const joint2 = new THREE.Mesh(joint1Geo, chrome);
        joint2.rotation.x = Math.PI / 2;
        joint2.position.set(-5, 11, 0);
        boomGroup.add(joint2);

        // Injector Head (Lathe Geometry for extreme complex shape)
        const injectorPoints = [];
        for (let i = 0; i <= 30; i++) {
            const x = 1.5 + Math.sin(i * 0.4) * 0.8 - (i * 0.03);
            const y = i * 0.3;
            injectorPoints.push(new THREE.Vector2(x, y));
        }
        const injectorGeo = new THREE.LatheGeometry(injectorPoints, 64);
        const injectorHead = new THREE.Mesh(injectorGeo, copper);
        injectorHead.position.set(3.5, 16, 0);
        injectorHead.rotation.z = -Math.PI / 2;
        boomGroup.add(injectorHead);

        // Plasma Emitter Nozzle
        const nozzleGeo = new THREE.CylinderGeometry(0.5, 1.2, 3, 32);
        const nozzle = new THREE.Mesh(nozzleGeo, chrome);
        nozzle.position.set(5.5, 16, 0);
        nozzle.rotation.z = -Math.PI / 2;
        boomGroup.add(nozzle);

        // Inner glowing plasma element
        const plasmaCoreGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const plasmaCore = new THREE.Mesh(plasmaCoreGeo, plasmaGlow);
        plasmaCore.position.set(7, 16, 0);
        boomGroup.add(plasmaCore);
        animObjects.plasmaLines.push(plasmaCore);

        // Hydraulic Piston acting on the boom
        const piston = createPiston(new THREE.Vector3(2, 1, 0), new THREE.Vector3(-3, 8, 0), 0.6);
        boomGroup.add(piston);

        animObjects.booms.push(boomGroup);
        return boomGroup;
    }

    function createParticleSystem(x, y, z) {
        const pGroup = new THREE.Group();
        pGroup.position.set(x, y, z);
        const geo = new THREE.IcosahedronGeometry(1.5, 1);
        for(let i=0; i<40; i++) {
            const p = new THREE.Mesh(geo, exhaustParticleMat);
            p.position.set((Math.random()-0.5)*3, Math.random()*5, (Math.random()-0.5)*3);
            p.userData = {
                origin: p.position.clone(),
                velocity: new THREE.Vector3((Math.random()-0.5)*0.5, Math.random()*1.5 + 0.5, (Math.random()-0.5)*0.5),
                life: Math.random()
            };
            pGroup.add(p);
            animObjects.particles.push(p);
        }
        return pGroup;
    }

    // --- ASSEMBLY OF THE GOD-TIER STRANGELET FORGE ---

    const mainChassisGroup = new THREE.Group();
    group.add(mainChassisGroup);

    // 1. The Massive Chassis Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-25, -10);
    hullShape.lineTo(25, -10);
    hullShape.lineTo(35, -5);
    hullShape.lineTo(35, 30);
    hullShape.lineTo(15, 45);
    hullShape.lineTo(-15, 45);
    hullShape.lineTo(-35, 30);
    hullShape.lineTo(-35, -5);
    hullShape.lineTo(-25, -10);

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    const hull = new THREE.Mesh(hullGeo, darkSteel);
    hull.rotation.x = Math.PI / 2;
    hull.position.set(0, 10, -4);
    mainChassisGroup.add(hull);

    // Adding panel lines and armor plating to chassis
    for(let i=0; i<20; i++) {
        const plateGeo = new THREE.BoxGeometry(10, 1.5, 8);
        const plate = new THREE.Mesh(plateGeo, steel);
        plate.position.set(-20 + (i%5)*10, 14.5, -25 + Math.floor(i/5)*10);
        mainChassisGroup.add(plate);
    }

    // 2. The 16-Wheel Drive System (8 per side)
    const wheelsPerSide = 8;
    const wheelSpacing = 9;
    const startZ = -30;

    for(let side = 0; side < 2; side++) {
        const isLeft = side === 0;
        const xPos = isLeft ? -22 : 22;
        
        for(let i = 0; i < wheelsPerSide; i++) {
            const zPos = startZ + i * wheelSpacing;
            const isSteerable = (i === 0 || i === 1 || i === wheelsPerSide - 1 || i === wheelsPerSide - 2);
            const wheel = createComplexTire(isSteerable);
            
            // Adjust wheel orientation
            wheel.rotation.y = isLeft ? 0 : Math.PI;
            wheel.position.set(xPos, 5, zPos);
            mainChassisGroup.add(wheel);

            // Suspension Assembly
            const suspGroup = new THREE.Group();
            
            // A-Arms
            const armGeo = new THREE.CylinderGeometry(0.5, 0.5, Math.abs(xPos) - 15, 16);
            const arm1 = new THREE.Mesh(armGeo, darkSteel);
            arm1.rotation.z = Math.PI / 2;
            arm1.position.set(isLeft ? -18.5 : 18.5, 6, zPos);
            suspGroup.add(arm1);

            const arm2 = new THREE.Mesh(armGeo, darkSteel);
            arm2.rotation.z = Math.PI / 2;
            arm2.position.set(isLeft ? -18.5 : 18.5, 4, zPos);
            suspGroup.add(arm2);

            // Shock Absorber (Coil over cylinder)
            const shockOuterGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
            const shockOuter = new THREE.Mesh(shockOuterGeo, chrome);
            shockOuter.position.set(xPos > 0 ? xPos - 3 : xPos + 3, 8, zPos);
            suspGroup.add(shockOuter);

            const coilCurve = new SpiralCurve(1.2, 4, 6);
            const coilGeo = new THREE.TubeGeometry(coilCurve, 64, 0.2, 8, false);
            const coil = new THREE.Mesh(coilGeo, warningRed);
            coil.position.set(xPos > 0 ? xPos - 3 : xPos + 3, 6, zPos);
            suspGroup.add(coil);

            mainChassisGroup.add(suspGroup);

            // Hydraulic lines to each wheel
            const hLines = createHydraulicLines(
                new THREE.Vector3(xPos > 0 ? xPos - 2 : xPos + 2, 5, zPos),
                new THREE.Vector3(xPos > 0 ? 10 : -10, 10, zPos),
                new THREE.Vector3(xPos > 0 ? xPos - 4 : xPos + 4, 8, zPos),
                new THREE.Vector3(xPos > 0 ? 12 : -12, 12, zPos + 2),
                3
            );
            mainChassisGroup.add(hLines);

            // Document Parts
            parts.push({
                name: `Massive Tread Wheel Assembly ${isLeft ? 'Left' : 'Right'}-${i+1}`,
                description: `Ultra-dense off-road wheel with custom toroid treads, supporting the astronomical mass of the God-Tier Strangelet Forge. Includes magnetic shock absorbers and regenerative braking.`,
                material: "Synthetic hyper-rubber, Dark Steel, Chrome",
                function: "Terrain traversal and seismic dampening.",
                assemblyOrder: 2 + i + (side * wheelsPerSide),
                connections: ["Chassis Lower Mounts", "Hydraulic Subsystem"],
                failureEffect: "Loss of traction and extreme tilt, potentially breaching the containment field due to gravitational shear.",
                cascadeFailures: ["Suspension Collapse", "Containment Rupture"],
                originalPosition: { x: xPos, y: 5, z: zPos },
                explodedPosition: { x: xPos * 2, y: 5, z: zPos }
            });
        }
    }

    // 3. The Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 15, 30);
    mainChassisGroup.add(cabinGroup);

    // Cabin Exterior
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-10, 0);
    cabShape.lineTo(10, 0);
    cabShape.lineTo(12, 8);
    cabShape.lineTo(8, 15);
    cabShape.lineTo(-8, 15);
    cabShape.lineTo(-12, 8);
    cabShape.lineTo(-10, 0);

    const cabExtrude = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, cabExtrude);
    const cab = new THREE.Mesh(cabGeo, steel);
    cab.position.z = -5;
    cabinGroup.add(cab);

    // Tinted Windows (Large Polygons)
    const windowGeo = new THREE.PlaneGeometry(14, 6);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 11, 5.1);
    windowMesh.rotation.x = -0.2;
    cabinGroup.add(windowMesh);

    const sideWindowGeo = new THREE.PlaneGeometry(8, 6);
    const sideWindowL = new THREE.Mesh(sideWindowGeo, tinted);
    sideWindowL.position.set(-10.1, 11, 0);
    sideWindowL.rotation.y = -Math.PI / 2;
    cabinGroup.add(sideWindowL);

    const sideWindowR = new THREE.Mesh(sideWindowGeo, tinted);
    sideWindowR.position.set(10.1, 11, 0);
    sideWindowR.rotation.y = Math.PI / 2;
    cabinGroup.add(sideWindowR);

    // Cabin Interior
    const seat1 = createSeat();
    seat1.position.set(-4, 1, 0);
    cabinGroup.add(seat1);

    const seat2 = createSeat();
    seat2.position.set(4, 1, 0);
    cabinGroup.add(seat2);

    const ctrlPanel1 = createControlPanel();
    ctrlPanel1.position.set(-4, 4, 3);
    cabinGroup.add(ctrlPanel1);

    const ctrlPanel2 = createControlPanel();
    ctrlPanel2.position.set(4, 4, 3);
    cabinGroup.add(ctrlPanel2);

    // Steering Wheel (Torus)
    const steeringGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const steering = new THREE.Mesh(steeringGeo, rubber);
    steering.position.set(-4, 5, 2);
    steering.rotation.x = -Math.PI / 4;
    cabinGroup.add(steering);
    animObjects.steeringWheels.push(steering);

    // Side Mirrors
    const mirrorArmGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const mirrorBoxGeo = new THREE.BoxGeometry(1, 2, 0.5);
    
    const mirrorL = new THREE.Group();
    const mArmL = new THREE.Mesh(mirrorArmGeo, darkSteel);
    mArmL.rotation.z = Math.PI / 2;
    mArmL.position.set(-13.5, 10, 2);
    const mBoxL = new THREE.Mesh(mirrorBoxGeo, chrome);
    mBoxL.position.set(-15, 10, 2);
    mirrorL.add(mArmL);
    mirrorL.add(mBoxL);
    cabinGroup.add(mirrorL);

    const mirrorR = new THREE.Group();
    const mArmR = new THREE.Mesh(mirrorArmGeo, darkSteel);
    mArmR.rotation.z = Math.PI / 2;
    mArmR.position.set(13.5, 10, 2);
    const mBoxR = new THREE.Mesh(mirrorBoxGeo, chrome);
    mBoxR.position.set(15, 10, 2);
    mirrorR.add(mArmR);
    mirrorR.add(mBoxR);
    cabinGroup.add(mirrorR);

    // Radar / Sensor Array on roof
    const radarMastGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
    const radarMast = new THREE.Mesh(radarMastGeo, steel);
    radarMast.position.set(0, 17.5, -2);
    cabinGroup.add(radarMast);
    
    const radarDishGeo = new THREE.LatheGeometry(
        [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0.5), new THREE.Vector2(2, 1.5), new THREE.Vector2(3, 3)],
        32
    );
    const radarDish = new THREE.Mesh(radarDishGeo, chrome);
    radarDish.position.set(0, 20, -2);
    radarDish.rotation.x = Math.PI / 4;
    cabinGroup.add(radarDish);
    animObjects.wheels.push(radarDish); // Hack to make it spin along with wheels

    parts.push({
        name: "Command & Control Cabin",
        description: "Heavily shielded operator cabin featuring lead-glass tinted windows, dual pilot stations, and quantum-entangled sensor arrays. Protects the crew from lethal hadronic radiation.",
        material: "Steel, Tinted Lead-Glass, Synthetic Rubber",
        function: "Houses the scientific and piloting crew, providing real-time telemetry of the QGP injection and strangelet state.",
        assemblyOrder: 30,
        connections: ["Chassis Front Deck", "Sensor Arrays", "Life Support"],
        failureEffect: "Immediate lethal radiation exposure to the crew; subsequent autonomous runaway reaction of the forge.",
        cascadeFailures: ["Crew Expiration", "AI Override Failure"],
        originalPosition: { x: 0, y: 15, z: 30 },
        explodedPosition: { x: 0, y: 30, z: 50 }
    });

    // 4. The Strangelet Forge Core
    const forgeGroup = new THREE.Group();
    forgeGroup.position.set(0, 15, -10);
    mainChassisGroup.add(forgeGroup);

    // Main Containment Base
    const forgeBaseGeo = new THREE.CylinderGeometry(15, 18, 5, 64);
    const forgeBase = new THREE.Mesh(forgeBaseGeo, darkSteel);
    forgeGroup.add(forgeBase);

    // Catwalk around the forge base
    const catwalkGeo = new THREE.RingGeometry(18, 22, 64);
    const catwalk = new THREE.Mesh(catwalkGeo, steel);
    catwalk.rotation.x = -Math.PI / 2;
    catwalk.position.y = 2;
    forgeGroup.add(catwalk);

    // Railings for catwalk
    const railGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI * 2;
        const post = new THREE.Mesh(railGeo, chrome);
        post.position.set(Math.cos(angle)*21.5, 3.5, Math.sin(angle)*21.5);
        forgeGroup.add(post);
    }
    const handrailGeo = new THREE.TorusGeometry(21.5, 0.2, 16, 64);
    const handrail = new THREE.Mesh(handrailGeo, chrome);
    handrail.position.y = 5;
    handrail.rotation.x = Math.PI / 2;
    forgeGroup.add(handrail);

    // Magnetic Confinement Rings
    const ringGeo = new THREE.TorusGeometry(12, 1.5, 32, 100);
    for(let i=0; i<6; i++) {
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.position.y = 15;
        // Start them at different rotations
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        // Add magnetic clamps to each ring
        const clampGeo = new THREE.BoxGeometry(3, 4, 4);
        for(let j=0; j<8; j++) {
            const cAngle = (j/8) * Math.PI * 2;
            const clamp = new THREE.Mesh(clampGeo, darkSteel);
            clamp.position.set(Math.cos(cAngle)*12, Math.sin(cAngle)*12, 0);
            clamp.rotation.z = cAngle;
            ring.add(clamp);
        }

        forgeGroup.add(ring);
        animObjects.rings.push(ring);
    }

    // Glowing Strangelet Core (The God-Tier object)
    const coreGeo = new THREE.IcosahedronGeometry(4, 3);
    const core = new THREE.Mesh(coreGeo, glowingStrangelet);
    core.position.y = 15;
    forgeGroup.add(core);
    animObjects.core = core;

    // Energy extraction nodes inside the rings
    for(let i=0; i<8; i++) {
        const nodeGeo = new THREE.SphereGeometry(1, 16, 16);
        const node = new THREE.Mesh(nodeGeo, plasmaGlow);
        const angle = (i/8) * Math.PI * 2;
        node.position.set(Math.cos(angle)*8, 15, Math.sin(angle)*8);
        forgeGroup.add(node);
        animObjects.plasmaLines.push(node);
    }

    parts.push({
        name: "God-Tier Strangelet Droplet",
        description: "A macroscopic, perfectly stable droplet of strange quark matter. Emits bizarre multidimensional radiation and possesses a density surpassing that of a neutron star. Maintained in absolute vacuum.",
        material: "Strange Quark Matter (Custom Emissive Shader representation)",
        function: "Acts as the seed and processing core for converting normal baryonic matter into strange matter.",
        assemblyOrder: 50,
        connections: ["Magnetic Confinement Rings", "Quantum Vacuum Emitters"],
        failureEffect: "Instantaneous planetary conversion into a strange star. Extinction Class X.",
        cascadeFailures: ["Gravitational Singularity", "Space-time Shear"],
        originalPosition: { x: 0, y: 30, z: -10 },
        explodedPosition: { x: 0, y: 80, z: -10 }
    });

    parts.push({
        name: "Superconducting Confinement Rings",
        description: "A set of 6 massive toroids generating a constantly shifting, 100-Tesla magnetic bottle to suspend the strangelet droplet. Cooled by liquid helium.",
        material: "Copper, Dark Steel, YBCO Superconductor",
        function: "Prevents the strangelet from physically touching any baryonic matter of the forge.",
        assemblyOrder: 45,
        connections: ["Forge Base", "Cryogenic Cooling Manifolds"],
        failureEffect: "Containment breach. The strangelet falls into the base, converting the vehicle and the Earth.",
        cascadeFailures: ["Thermal Runaway", "Magnetic Reconnection Explosion"],
        originalPosition: { x: 0, y: 30, z: -10 },
        explodedPosition: { x: 0, y: 30, z: -50 }
    });

    // 5. Quark-Gluon Plasma Injectors (4 Booms)
    const boomPositions = [
        { x: -22, y: 15, z: 10, rot: Math.PI / 4 },
        { x: 22, y: 15, z: 10, rot: 3 * Math.PI / 4 },
        { x: -22, y: 15, z: -30, rot: -Math.PI / 4 },
        { x: 22, y: 15, z: -30, rot: -3 * Math.PI / 4 }
    ];

    boomPositions.forEach((pos, index) => {
        const boom = createInjectorBoom();
        boom.position.set(pos.x, pos.y, pos.z);
        boom.rotation.y = pos.rot;
        mainChassisGroup.add(boom);

        // Target the injector at the core
        // We simulate pointing by adjusting internal rotations in `animate` or setting them initially.
        // For static complexity, we just orient it roughly.
        boom.lookAt(new THREE.Vector3(0, 30, -10));

        // Add massive cooling tubes to the boom
        const coolingTubes = createHydraulicLines(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(7, 16, 0),
            new THREE.Vector3(-3, 8, 5),
            new THREE.Vector3(2, 12, -5),
            5
        );
        boom.add(coolingTubes);

        parts.push({
            name: `QGP Injector Boom ${index + 1}`,
            description: `Articulated heavy-duty hydraulic arm terminating in a Quark-Gluon Plasma nozzle. Injects raw, deconfined quarks into the strangelet core at temperatures exceeding 4 trillion degrees.`,
            material: "Steel, Copper, Chrome, High-Temp Ceramics",
            function: "Feeds the strangelet mass and stabilizes its color-flavor locked state.",
            assemblyOrder: 35 + index,
            connections: ["Chassis Main Deck", "Forge Core", "Cooling System"],
            failureEffect: "Plasma blowout, incinerating a 10km radius and starving the strangelet, potentially leading to explosive evaporation.",
            cascadeFailures: ["Thermal Shield Ablation", "Injector Meltdown"],
            originalPosition: pos,
            explodedPosition: { x: pos.x * 2, y: pos.y + 20, z: pos.z * 1.5 }
        });
    });

    // 6. Exhaust Stacks / Heat Dissipators
    const stackPositions = [
        { x: -18, z: -40 },
        { x: 18, z: -40 },
        { x: -18, z: -45 },
        { x: 18, z: -45 }
    ];

    stackPositions.forEach(pos => {
        const stackGroup = new THREE.Group();
        stackGroup.position.set(pos.x, 15, pos.z);
        
        const stackBaseGeo = new THREE.BoxGeometry(6, 8, 6);
        const stackBase = new THREE.Mesh(stackBaseGeo, darkSteel);
        stackGroup.add(stackBase);

        const stackPipeGeo = new THREE.CylinderGeometry(2, 2.5, 15, 32);
        const stackPipe = new THREE.Mesh(stackPipeGeo, steel);
        stackPipe.position.y = 11.5;
        stackGroup.add(stackPipe);

        // Flaps at the top
        const flapGeo = new THREE.BoxGeometry(4.5, 0.5, 4.5);
        const flap = new THREE.Mesh(flapGeo, darkSteel);
        flap.position.set(0, 19, 0);
        flap.rotation.z = Math.PI / 8;
        stackGroup.add(flap);

        // Particle Emitter
        const emitter = createParticleSystem(0, 20, 0);
        stackGroup.add(emitter);

        mainChassisGroup.add(stackGroup);
    });

    // 7. Elaborate Cooling & Plumbing System (Extensive TubeGeometry around chassis)
    for(let i=0; i<15; i++) {
        const hLines = createHydraulicLines(
            new THREE.Vector3((Math.random()-0.5)*30, 15, (Math.random()-0.5)*10 - 20),
            new THREE.Vector3((Math.random()-0.5)*20, 20, -10),
            new THREE.Vector3((Math.random()-0.5)*40, 25, (Math.random()-0.5)*20),
            new THREE.Vector3(0, 30, -10), // Towards core
            2
        );
        mainChassisGroup.add(hLines);
    }

    // 8. Containment Field Lasers (Sparks/Beams)
    for(let i=0; i<12; i++) {
        const laserGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
        const laser = new THREE.Mesh(laserGeo, laserBeam);
        // Position them around the catwalk pointing inward
        const angle = (i/12) * Math.PI * 2;
        laser.position.set(Math.cos(angle)*15, 20, -10 + Math.sin(angle)*15);
        laser.lookAt(new THREE.Vector3(0, 30, -10));
        laser.rotation.x += Math.PI / 2; // Adjust lookAt for cylinder
        mainChassisGroup.add(laser);
        animObjects.lights.push(laser);
    }

    // Add remaining required parts to hit the complexity mark
    parts.push({
        name: "Cryogenic Liquid Helium Manifolds",
        description: "An incredibly complex labyrinth of fractal tube geometries wrapping the entire rear chassis, pumping liquid helium at 1.9K to maintain superconductor states.",
        material: "Rubber, Synthetic Polymers, Steel tubing",
        function: "Thermal regulation of the magnetic confinement and QGP injectors.",
        assemblyOrder: 60,
        connections: ["Confinement Rings", "Heat Dissipator Stacks"],
        failureEffect: "Quench of the superconducting magnets, instantly dropping the magnetic bottle.",
        cascadeFailures: ["Magnet Quench", "Containment Breach"],
        originalPosition: { x: 0, y: 20, z: -20 },
        explodedPosition: { x: 0, y: 50, z: -30 }
    });

    parts.push({
        name: "Massive Hadronic Heat Dissipator Stacks",
        description: "Four enormous exhaust chimneys venting the non-strange baryonic waste and excess heat generated from the conversion process. Flaps prevent atmospheric contamination.",
        material: "Dark Steel, Heat-resistant composites",
        function: "Vents excess kinetic and thermal energy safely into the exoplanet atmosphere.",
        assemblyOrder: 25,
        connections: ["Chassis Rear", "Cooling Manifolds"],
        failureEffect: "Internal thermal buildup leading to a chassis melt.",
        cascadeFailures: ["Chassis Slagging", "Injector Failure"],
        originalPosition: { x: 0, y: 20, z: -40 },
        explodedPosition: { x: 0, y: 40, z: -60 }
    });

    // Descriptions and Quiz Questions
    const description = "The God-Tier Strangelet Forge is a colossal, mobile hyper-factory designed to traverse hostile exoplanets while manufacturing and containing macroscopic Strange Quark Matter (SQM). Operating on principles of non-perturbative Quantum Chromodynamics (QCD), the forge uses massive Quark-Gluon Plasma (QGP) injectors to feed an absolutely stable, infinitely dense strangelet droplet suspended in a 100-Tesla superconducting magnetic bottle. Driven by 16 incredibly detailed, individually suspended off-road tread wheels, the forge is a marvel of hyper-advanced engineering, featuring heavily armored containment vessels, detailed operator cabins, and extensive fluid/cryogenic routing.";

    const quizQuestions = [
        {
            question: "In the framework of the Bodmer-Witten hypothesis, Strange Quark Matter (SQM) is conjectured to be the true ground state of hadronic matter. Considering the thermodynamic potential $\\Omega$ of a non-interacting quark gas in beta equilibrium, what condition correctly expresses the absolute stability of SQM at zero temperature relative to ${}^{56}Fe$?",
            options: [
                "The energy per baryon of SQM must be strictly less than 930 MeV (the energy per nucleon of ${}^{56}Fe$).",
                "The strange quark mass must be identically zero to prevent chiral symmetry breaking.",
                "The baryon chemical potential must exceed the electron chemical potential by exactly the strange quark mass $m_s$.",
                "The energy density of SQM must exceed the phenomenological vacuum bag pressure B by a factor of 3."
            ],
            answer: 0
        },
        {
            question: "At extremely high baryon densities, cold quark matter is expected to form a Color-Flavor Locked (CFL) phase. In this state, Cooper pairing occurs between all three light quark flavors (u, d, s) of all three colors. Which of the following best describes the resulting symmetry breaking pattern and the gauge field spectrum?",
            options: [
                "$SU(3)_C \\times SU(3)_L \\times SU(3)_R \\rightarrow SU(3)_{C+V}$, where chiral symmetry is broken and all 8 gluons acquire mass via the Meissner effect.",
                "$SU(3)_C \\rightarrow U(1)_{EM}$, leaving only the photon massless while quarks become completely deconfined.",
                "$SU(2)_L \\times U(1)_Y \\rightarrow U(1)_{EM}$, resulting in massive W and Z bosons while gluons remain massless.",
                "The chiral symmetry is completely restored and all pseudo-Nambu-Goldstone bosons become infinitely massive."
            ],
            answer: 0
        },
        {
            question: "During the injection of Quark-Gluon Plasma (QGP) via the massive hydraulic booms, perturbative QCD at high temperatures ($T \\gg \\Lambda_{QCD}$) dictates the interaction behavior. The Debye screening mass $m_D$ limits the range of chromoelectric interactions. How does $m_D$ theoretically scale with the temperature T and the strong coupling constant $g$?",
            options: [
                "$m_D \\sim g T$",
                "$m_D \\sim g^2 T$",
                "$m_D \\sim g T^2$",
                "$m_D \\sim T / g$"
            ],
            answer: 0
        },
        {
            question: "The MIT Bag Model provides a phenomenological description for the energy of the strangelet droplet. The total energy includes a volume term (the bag pressure B), kinetic energy of quarks, and a surface tension term $\\sigma$. For small strangelets, finite-size effects are critical. How does the curvature energy term scale with the total baryon number $A$?",
            options: [
                "$A^{1/3}$",
                "$A^{2/3}$",
                "$A^{4/3}$",
                "$A^{-1/3}$"
            ],
            answer: 0
        },
        {
            question: "If a negatively charged strangelet produced in the forge were to escape the magnetic confinement rings and interact with normal baryonic matter (the steel chassis), it could trigger a catastrophic cascade. Why is a negative charge on a strangelet particularly dangerous compared to a positive charge in this terrestrial environment?",
            options: [
                "A negatively charged strangelet lacks a Coulomb barrier for atomic nuclei, allowing it to freely attract and absorb positively charged baryonic matter at arbitrarily low temperatures.",
                "Negative charge implies a severe deficit of strange quarks, making it highly unstable and prone to explosive weak-interaction beta decay.",
                "A negatively charged strangelet emits intense Hawking radiation, instantly vaporizing the surrounding matter via quantum tunneling.",
                "Positive strangelets only interact via the weak nuclear force, whereas negative strangelets interact purely via the strong force."
            ],
            answer: 0
        }
    ];

    // --- ANIMATION LOOP ---
    function animate(time, speed, meshes) {
        animObjects.timeOffset += speed * 0.01;
        const t = animObjects.timeOffset;

        // Drive wheels
        animObjects.wheels.forEach(w => {
            w.rotation.z -= speed * 0.05; // Rolling forward
        });

        // Steer front wheels via a sine wave for wandering motion
        const steeringAngle = Math.sin(t * 2) * 0.2;
        animObjects.steeringWheels.forEach(w => {
            // Because the wheel's base rotation might be Math.PI for the right side
            // We need to carefully add steering relative to its base.
            // Since we applied it to the parent group, we can just set y.
            // But we must preserve the original flip.
            const isFlipped = w.position.x > 0; 
            w.rotation.y = (isFlipped ? Math.PI : 0) + steeringAngle;
        });

        // Core animation (Pulsing, rotating, color shifting)
        if (animObjects.core) {
            animObjects.core.rotation.x += 0.03 * speed;
            animObjects.core.rotation.y += 0.05 * speed;
            animObjects.core.scale.setScalar(1 + Math.sin(t * 15) * 0.08);
            
            // Rapid bizarre color shift
            const hue = (t * 0.5) % 1.0;
            animObjects.core.material.color.setHSL(hue, 1.0, 0.5);
            animObjects.core.material.emissive.setHSL(hue, 1.0, 0.5);
        }

        // Magnetic Confinement Rings
        animObjects.rings.forEach((ring, index) => {
            ring.rotation.x += 0.02 * speed * (index % 2 === 0 ? 1 : -1);
            ring.rotation.y += 0.03 * speed * (index % 3 === 0 ? 1 : -1);
            ring.rotation.z += 0.01 * speed * (index % 4 === 0 ? 1 : -1);
            
            // Pulsing scale for instability effect
            ring.scale.setScalar(1 + Math.sin(t * 10 + index) * 0.02);
        });

        // Plasma logic & Screens
        animObjects.plasmaLines.forEach((plasma, index) => {
            plasma.material.emissiveIntensity = 2 + Math.sin(t * 20 + index) * 2;
            plasma.scale.setScalar(1 + Math.sin(t * 30 + index) * 0.2);
        });

        animObjects.screens.forEach((screen, index) => {
            // Glitchy screen effect
            if (Math.random() > 0.9) {
                screen.material.emissive.setHex(Math.random() > 0.5 ? 0x00ff00 : 0xff0000);
            }
        });

        // Laser containment fields blinking
        animObjects.lights.forEach((light, index) => {
            light.visible = Math.sin(t * 50 + index) > 0;
        });

        // Exhaust Particles
        animObjects.particles.forEach(p => {
            p.position.add(p.userData.velocity.clone().multiplyScalar(speed * 0.5));
            p.userData.life -= 0.02 * speed;
            
            if(p.userData.life <= 0) {
                p.position.copy(p.userData.origin);
                p.userData.life = 1.0;
                // Add some random scatter on reset
                p.position.x += (Math.random()-0.5)*3;
                p.position.z += (Math.random()-0.5)*3;
            }
            
            p.material.opacity = p.userData.life * 0.8;
            const scale = 1 + (1 - p.userData.life) * 3;
            p.scale.setScalar(scale);
            p.rotation.x += 0.1 * speed;
            p.rotation.y += 0.1 * speed;
        });

        // Slight vertical bobbing of the whole chassis to simulate heavy engine idle/movement
        mainChassisGroup.position.y = Math.sin(t * 8) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}
