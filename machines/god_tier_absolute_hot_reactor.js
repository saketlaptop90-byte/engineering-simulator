import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const anim = {
        wheels: [],
        boom: null,
        boomAttachment: null,
        pistonOuter: null,
        pistonInner: null,
        singularity: null,
        coolingRings: [],
        bloomLayers: [],
        fans: [],
        coils: [],
        radar: null,
        pistonsArr: [], // shockwave dampers
        shockwaveRings: []
    };

    // --- CUSTOM MATERIALS ---
    const matPlanck = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 150.0,
        transparent: true,
        opacity: 1.0,
        roughness: 0,
        metalness: 1
    });

    const matBloom1 = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const matBloom2 = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x880000,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const matZeroPoint = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 12.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
        blending: THREE.AdditiveBlending
    });

    const matPlasma = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x7700ff,
        emissiveIntensity: 20.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const matTachyon = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff44,
        emissiveIntensity: 5.0,
        wireframe: true
    });

    const matNeonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    const matConsoleScreen = new THREE.MeshStandardMaterial({
        color: 0x002200,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0
    });

    // --- HELPER FUNCTIONS ---
    function createBolts(parent, radius, count, yPos, material) {
        const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 6);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, material);
            bolt.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            bolt.rotation.x = Math.PI / 2;
            bolt.lookAt(0, yPos, 0);
            parent.add(bolt);
        }
    }

    function createGrille(width, height, bars, material) {
        const grilleGroup = new THREE.Group();
        const frameGeo = new THREE.BoxGeometry(width, height, 2);
        const frame = new THREE.Mesh(frameGeo, darkSteel);
        grilleGroup.add(frame);
        
        const barGeo = new THREE.CylinderGeometry(0.3, 0.3, width - 2, 8);
        const spacing = (height - 2) / bars;
        for(let i = 0; i < bars; i++) {
            const bar = new THREE.Mesh(barGeo, material);
            bar.rotation.z = Math.PI / 2;
            bar.position.y = -height/2 + 1 + i * spacing;
            bar.position.z = 1;
            grilleGroup.add(bar);
        }
        return grilleGroup;
    }

    // --- GEOMETRY GENERATORS ---

    function buildTires() {
        const crawlerGroup = new THREE.Group();
        const positions = [
            [-90, 15, 120], [90, 15, 120],
            [-90, 15, 40],  [90, 15, 40],
            [-90, 15, -40], [90, 15, -40],
            [-90, 15, -120],[90, 15, -120],
        ];

        const torusGeo = new THREE.TorusGeometry(18, 7, 32, 100);
        const lugGeo = new THREE.BoxGeometry(8, 4, 5);
        const rimGeo = new THREE.CylinderGeometry(12, 12, 16, 32);
        const spokeGeo = new THREE.CylinderGeometry(1.5, 1.5, 24, 8);
        const hubGeo = new THREE.CylinderGeometry(4, 4, 18, 16);

        positions.forEach((pos) => {
            const wheelGroup = new THREE.Group();

            const tire = new THREE.Mesh(torusGeo, rubber);
            tire.rotation.y = Math.PI / 2;
            wheelGroup.add(tire);

            const numLugs = 72;
            for(let i=0; i<numLugs; i++) {
                const angle = (i / numLugs) * Math.PI * 2;
                const lug = new THREE.Mesh(lugGeo, rubber);
                lug.position.set(Math.cos(angle) * 18, Math.sin(angle) * 18, 0);
                lug.rotation.z = angle;
                lug.rotation.y = Math.PI / 2;
                wheelGroup.add(lug);
            }

            const rim = new THREE.Mesh(rimGeo, chrome);
            rim.rotation.x = Math.PI / 2;
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);

            const hub = new THREE.Mesh(hubGeo, darkSteel);
            hub.rotation.x = Math.PI / 2;
            hub.rotation.z = Math.PI / 2;
            wheelGroup.add(hub);

            const numSpokes = 16;
            for(let i=0; i<numSpokes; i++) {
                const angle = (i / numSpokes) * Math.PI * 2;
                const spoke = new THREE.Mesh(spokeGeo, steel);
                spoke.rotation.x = angle;
                spoke.rotation.y = Math.PI / 2;
                wheelGroup.add(spoke);
            }

            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            anim.wheels.push(wheelGroup);
            crawlerGroup.add(wheelGroup);
        });

        return crawlerGroup;
    }

    function buildChassis() {
        const chassisGroup = new THREE.Group();
        
        // Main body hull
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-60, 150);
        hullShape.lineTo(60, 150);
        hullShape.lineTo(80, 100);
        hullShape.lineTo(80, -100);
        hullShape.lineTo(60, -150);
        hullShape.lineTo(-60, -150);
        hullShape.lineTo(-80, -100);
        hullShape.lineTo(-80, 100);
        hullShape.lineTo(-60, 150);

        const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
        const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        const hull = new THREE.Mesh(hullGeo, darkSteel);
        hull.rotation.x = Math.PI / 2;
        hull.position.set(0, 30, -15);
        chassisGroup.add(hull);

        // Suspension struts
        const strutGeo = new THREE.CylinderGeometry(3, 3, 40, 16);
        const strutPositions = [
            [-90, 30, 120], [90, 30, 120],
            [-90, 30, 40],  [90, 30, 40],
            [-90, 30, -40], [90, 30, -40],
            [-90, 30, -120],[90, 30, -120],
        ];
        strutPositions.forEach(pos => {
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(pos[0] > 0 ? pos[0]-10 : pos[0]+10, pos[1], pos[2]);
            strut.rotation.z = pos[0] > 0 ? Math.PI/6 : -Math.PI/6;
            chassisGroup.add(strut);
        });

        // Chassis Grilles
        const grille1 = createGrille(40, 20, 10, chrome);
        grille1.position.set(0, 45, 152);
        chassisGroup.add(grille1);

        const grille2 = createGrille(40, 20, 10, chrome);
        grille2.position.set(0, 45, -152);
        grille2.rotation.y = Math.PI;
        chassisGroup.add(grille2);

        createBolts(hull, 70, 36, 0, chrome);

        return chassisGroup;
    }

    function buildOperatorCabin() {
        const cabinGroup = new THREE.Group();
        
        // Cabin Shell
        const shellGeo = new THREE.BoxGeometry(40, 30, 30);
        const shell = new THREE.Mesh(shellGeo, steel);
        cabinGroup.add(shell);

        // Tinted Windows
        const frontWindowGeo = new THREE.PlaneGeometry(36, 16);
        const frontWindow = new THREE.Mesh(frontWindowGeo, tinted);
        frontWindow.position.set(0, 2, 15.1);
        cabinGroup.add(frontWindow);

        const sideWindowGeo = new THREE.PlaneGeometry(26, 16);
        const leftWindow = new THREE.Mesh(sideWindowGeo, tinted);
        leftWindow.rotation.y = -Math.PI / 2;
        leftWindow.position.set(-20.1, 2, 0);
        cabinGroup.add(leftWindow);

        const rightWindow = new THREE.Mesh(sideWindowGeo, tinted);
        rightWindow.rotation.y = Math.PI / 2;
        rightWindow.position.set(20.1, 2, 0);
        cabinGroup.add(rightWindow);

        // Operator Seat
        const seatBaseGeo = new THREE.CylinderGeometry(2, 2, 5, 16);
        const seatBase = new THREE.Mesh(seatBaseGeo, darkSteel);
        seatBase.position.set(0, -12.5, 5);
        cabinGroup.add(seatBase);

        const seatCushionGeo = new THREE.BoxGeometry(10, 2, 10);
        const seatCushion = new THREE.Mesh(seatCushionGeo, plastic);
        seatCushion.position.set(0, -9, 5);
        cabinGroup.add(seatCushion);

        const seatBackGeo = new THREE.BoxGeometry(10, 12, 2);
        const seatBack = new THREE.Mesh(seatBackGeo, plastic);
        seatBack.position.set(0, -3, 9);
        cabinGroup.add(seatBack);

        // Steering Wheel
        const wheelColGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
        const wheelCol = new THREE.Mesh(wheelColGeo, steel);
        wheelCol.rotation.x = Math.PI / 4;
        wheelCol.position.set(0, -6, 10);
        cabinGroup.add(wheelCol);

        const wheelGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.rotation.x = -Math.PI / 4;
        wheel.position.set(0, -3.5, 12.5);
        cabinGroup.add(wheel);

        // Joysticks
        const joyBaseGeo = new THREE.BoxGeometry(3, 2, 3);
        const joyStickGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
        const joyKnobGeo = new THREE.SphereGeometry(0.8, 16, 16);
        
        [-6, 6].forEach(x => {
            const jBase = new THREE.Mesh(joyBaseGeo, darkSteel);
            jBase.position.set(x, -9, 8);
            cabinGroup.add(jBase);

            const jStick = new THREE.Mesh(joyStickGeo, steel);
            jStick.position.set(x, -7, 8);
            jStick.rotation.x = Math.PI / 8;
            cabinGroup.add(jStick);

            const jKnob = new THREE.Mesh(joyKnobGeo, matNeonRed);
            jKnob.position.set(x, -5, 8.8);
            cabinGroup.add(jKnob);
        });

        // Glowing Screens
        const screenGeo = new THREE.PlaneGeometry(12, 8);
        const screen1 = new THREE.Mesh(screenGeo, matConsoleScreen);
        screen1.position.set(-8, -2, 14.8);
        screen1.rotation.y = Math.PI / 8;
        cabinGroup.add(screen1);

        const screen2 = new THREE.Mesh(screenGeo, matConsoleScreen);
        screen2.position.set(8, -2, 14.8);
        screen2.rotation.y = -Math.PI / 8;
        cabinGroup.add(screen2);

        // Side Mirrors
        const mirrorArmGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
        const mirrorBoxGeo = new THREE.BoxGeometry(1, 4, 3);
        const mirrorGlassGeo = new THREE.PlaneGeometry(0.9, 3.8);

        [-1, 1].forEach(side => {
            const arm = new THREE.Mesh(mirrorArmGeo, darkSteel);
            arm.rotation.z = side * Math.PI / 2;
            arm.position.set(side * 22.5, 0, 10);
            cabinGroup.add(arm);

            const box = new THREE.Mesh(mirrorBoxGeo, plastic);
            box.position.set(side * 25, 0, 10);
            box.rotation.y = side * Math.PI / 8;
            cabinGroup.add(box);

            const glassMesh = new THREE.Mesh(mirrorGlassGeo, chrome);
            glassMesh.position.set(side * 24.95, 0, 10);
            glassMesh.rotation.y = side * -Math.PI / 2 + (side * Math.PI / 8);
            cabinGroup.add(glassMesh);
        });

        // Radar Dish
        const radarGeo = new THREE.LatheGeometry([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(2, 0.5),
            new THREE.Vector2(4, 2),
            new THREE.Vector2(6, 4)
        ], 32);
        const radar = new THREE.Mesh(radarGeo, steel);
        radar.position.set(0, 15, -10);
        radar.rotation.x = Math.PI / 4;
        anim.radar = radar;
        cabinGroup.add(radar);

        cabinGroup.position.set(0, 90, 140);
        return cabinGroup;
    }

    function buildReactorCore() {
        const coreGroup = new THREE.Group();

        // 1. Primary Confinement Torus
        const torusGeo = new THREE.TorusGeometry(40, 15, 64, 128);
        const confinementTorus = new THREE.Mesh(torusGeo, darkSteel);
        confinementTorus.rotation.x = Math.PI / 2;
        coreGroup.add(confinementTorus);

        // 2. Magnetic Flux Coils (TorusKnots wrapping the primary torus)
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const knotGeo = new THREE.TorusKnotGeometry(16, 1.5, 100, 16, 2, 3);
            const coil = new THREE.Mesh(knotGeo, copper);
            coil.position.set(Math.cos(angle) * 40, 0, Math.sin(angle) * 40);
            coil.lookAt(0, 0, 0);
            coil.rotation.y = Math.PI / 2;
            anim.coils.push(coil);
            coreGroup.add(coil);
        }

        // 3. Sub-Quantum Cooling Rings
        const ringGeo1 = new THREE.TorusGeometry(25, 2, 32, 64);
        const ring1 = new THREE.Mesh(ringGeo1, matZeroPoint);
        anim.coolingRings.push(ring1);
        coreGroup.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(30, 1.5, 32, 64);
        const ring2 = new THREE.Mesh(ringGeo2, matZeroPoint);
        anim.coolingRings.push(ring2);
        coreGroup.add(ring2);

        const ringGeo3 = new THREE.TorusGeometry(35, 1, 32, 64);
        const ring3 = new THREE.Mesh(ringGeo3, matZeroPoint);
        anim.coolingRings.push(ring3);
        coreGroup.add(ring3);

        // 4. The Singularity (Absolute Hot)
        const singularityGeo = new THREE.IcosahedronGeometry(8, 4);
        const singularity = new THREE.Mesh(singularityGeo, matPlanck);
        anim.singularity = singularity;
        coreGroup.add(singularity);

        // 5. Thermal Bloom Layers
        const bloomGeo1 = new THREE.SphereGeometry(14, 32, 32);
        const bloom1 = new THREE.Mesh(bloomGeo1, matBloom1);
        anim.bloomLayers.push(bloom1);
        coreGroup.add(bloom1);

        const bloomGeo2 = new THREE.SphereGeometry(22, 32, 32);
        const bloom2 = new THREE.Mesh(bloomGeo2, matBloom2);
        anim.bloomLayers.push(bloom2);
        coreGroup.add(bloom2);

        // 6. Shockwave Rings
        for(let i=0; i<3; i++) {
            const swGeo = new THREE.TorusGeometry(5, 0.5, 16, 64);
            const sw = new THREE.Mesh(swGeo, matPlasma);
            sw.rotation.x = Math.PI / 2;
            anim.shockwaveRings.push(sw);
            coreGroup.add(sw);
        }

        // 7. Exotic Matter Injectors
        const injectorGeo = new THREE.CylinderGeometry(2, 4, 30, 16);
        for(let i=0; i<8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const injector = new THREE.Mesh(injectorGeo, chrome);
            injector.position.set(Math.cos(angle) * 55, 0, Math.sin(angle) * 55);
            injector.rotation.x = Math.PI / 2;
            injector.rotation.z = -angle;
            coreGroup.add(injector);
        }

        coreGroup.position.set(0, 120, -20);
        return coreGroup;
    }

    function buildArticulatedBoom() {
        const boomSystem = new THREE.Group();

        // Boom Base Mount
        const mountGeo = new THREE.CylinderGeometry(15, 20, 10, 32);
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.position.set(0, 65, -80);
        boomSystem.add(mount);

        // The Boom Arm
        const armGroup = new THREE.Group();
        armGroup.position.set(0, 75, -80);

        // Main boom beam
        const beamShape = new THREE.Shape();
        beamShape.moveTo(-5, -5);
        beamShape.lineTo(5, -5);
        beamShape.lineTo(3, 100);
        beamShape.lineTo(-3, 100);
        const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
        const beamGeo = new THREE.ExtrudeGeometry(beamShape, extrudeSettings);
        const beam = new THREE.Mesh(beamGeo, steel);
        beam.position.z = -5; // center extrusion
        armGroup.add(beam);

        // Attachment point at the end of the boom
        const attachmentPoint = new THREE.Group();
        attachmentPoint.position.set(0, 100, 0);
        armGroup.add(attachmentPoint);
        anim.boomAttachment = attachmentPoint;

        // Plasma Exhaust Stack on Boom
        const exhaustPoints = [];
        for (let i = 0; i < 20; i++) {
            exhaustPoints.push(new THREE.Vector2(10 + Math.sin(i * 0.5) * 2, i * 4));
        }
        const exhaustGeo = new THREE.LatheGeometry(exhaustPoints, 32);
        const exhaust = new THREE.Mesh(exhaustGeo, darkSteel);
        exhaust.rotation.x = Math.PI / 2;
        attachmentPoint.add(exhaust);

        // Inner Plasma Glow
        const plasmaGeo = new THREE.CylinderGeometry(8, 12, 80, 32);
        const plasma = new THREE.Mesh(plasmaGeo, matPlasma);
        plasma.position.y = 40;
        exhaust.add(plasma);

        anim.boom = armGroup;
        boomSystem.add(armGroup);

        // Hydraulic Piston for Boom
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder (attached to mount)
        const outerGeo = new THREE.CylinderGeometry(3, 3, 40, 16);
        const outer = new THREE.Mesh(outerGeo, steel);
        outer.geometry.translate(0, 20, 0); // pivot at base
        outer.position.set(0, 70, -60);
        pistonGroup.add(outer);
        anim.pistonOuter = outer;

        // Inner Cylinder (slides inside outer)
        const innerGeo = new THREE.CylinderGeometry(1.5, 1.5, 60, 16);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.geometry.translate(0, 30, 0);
        outer.add(inner); // nested for easy sliding
        anim.pistonInner = inner;

        boomSystem.add(pistonGroup);

        return boomSystem;
    }

    function buildHydraulicRouting() {
        const hydraulicsGroup = new THREE.Group();

        // Generate complex pipe networks wrapping around the chassis
        const path1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(20, 60, 100),
            new THREE.Vector3(40, 70, 80),
            new THREE.Vector3(50, 60, 0),
            new THREE.Vector3(40, 90, -40),
            new THREE.Vector3(15, 110, -50)
        ]);
        const tube1 = new THREE.Mesh(new THREE.TubeGeometry(path1, 64, 2, 12, false), rubber);
        hydraulicsGroup.add(tube1);

        const path2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 60, 100),
            new THREE.Vector3(-40, 70, 80),
            new THREE.Vector3(-50, 60, 0),
            new THREE.Vector3(-40, 90, -40),
            new THREE.Vector3(-15, 110, -50)
        ]);
        const tube2 = new THREE.Mesh(new THREE.TubeGeometry(path2, 64, 2, 12, false), rubber);
        hydraulicsGroup.add(tube2);

        // Tachyon Control Manifold Pipes
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const tPath = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 150, -20),
                new THREE.Vector3(Math.cos(angle)*60, 180, Math.sin(angle)*60 - 20),
                new THREE.Vector3(Math.cos(angle)*80, 120, Math.sin(angle)*80 - 20),
                new THREE.Vector3(Math.cos(angle)*40, 80, Math.sin(angle)*40 - 20)
            ]);
            const tTube = new THREE.Mesh(new THREE.TubeGeometry(tPath, 64, 1.5, 8, false), matTachyon);
            hydraulicsGroup.add(tTube);
        }

        return hydraulicsGroup;
    }

    function buildCoolantPumps() {
        const pumpSystem = new THREE.Group();
        
        const pumpPositions = [
            [60, 80, 20], [-60, 80, 20],
            [60, 80, -60], [-60, 80, -60]
        ];

        const housingGeo = new THREE.CylinderGeometry(12, 12, 30, 32);
        const fanCenterGeo = new THREE.CylinderGeometry(2, 2, 32, 16);
        const bladeGeo = new THREE.BoxGeometry(10, 0.5, 4);

        pumpPositions.forEach(pos => {
            const pump = new THREE.Group();
            
            const housing = new THREE.Mesh(housingGeo, steel);
            housing.rotation.x = Math.PI / 2;
            pump.add(housing);

            const fanGroup = new THREE.Group();
            const fanCenter = new THREE.Mesh(fanCenterGeo, chrome);
            fanCenter.rotation.x = Math.PI / 2;
            fanGroup.add(fanCenter);

            for(let i=0; i<6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const blade = new THREE.Mesh(bladeGeo, darkSteel);
                blade.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, 15);
                blade.rotation.z = angle + Math.PI/4;
                fanGroup.add(blade);

                const bladeBack = new THREE.Mesh(bladeGeo, darkSteel);
                bladeBack.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, -15);
                bladeBack.rotation.z = angle + Math.PI/4;
                fanGroup.add(bladeBack);
            }
            
            anim.fans.push(fanGroup);
            pump.add(fanGroup);

            pump.position.set(pos[0], pos[1], pos[2]);
            pumpSystem.add(pump);
        });

        return pumpSystem;
    }

    function buildThermalShockwaveDampers() {
        const damperSystem = new THREE.Group();
        const damperGeoOuter = new THREE.CylinderGeometry(4, 4, 20, 16);
        const damperGeoInner = new THREE.CylinderGeometry(2.5, 2.5, 30, 16);

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const damperGroup = new THREE.Group();
            
            const outer = new THREE.Mesh(damperGeoOuter, darkSteel);
            damperGroup.add(outer);

            const inner = new THREE.Mesh(damperGeoInner, chrome);
            inner.position.y = 15;
            anim.pistonsArr.push(inner);
            damperGroup.add(inner);

            // Connects base to core equator
            damperGroup.position.set(Math.cos(angle) * 50, 90, Math.sin(angle) * 50 - 20);
            damperGroup.lookAt(0, 120, -20);
            damperGroup.rotation.x -= Math.PI / 2;
            
            damperSystem.add(damperGroup);
        }

        return damperSystem;
    }

    // --- ASSEMBLE ENTIRE MACHINE ---
    const chassis = buildChassis();
    const tires = buildTires();
    const cabin = buildOperatorCabin();
    const core = buildReactorCore();
    const boom = buildArticulatedBoom();
    const hydraulics = buildHydraulicRouting();
    const pumps = buildCoolantPumps();
    const dampers = buildThermalShockwaveDampers();

    group.add(chassis);
    group.add(tires);
    group.add(cabin);
    group.add(core);
    group.add(boom);
    group.add(hydraulics);
    group.add(pumps);
    group.add(dampers);

    // --- PARTS LIST POPULATION ---
    parts.push({
        name: "GodTier_Chassis",
        description: "The primary base frame constructed from neutron-star forged steel. Supports the immense mass of the absolute hot reactor and absorbs the terrifying vibrational energy emitted during Planck-scale operations.",
        material: "darkSteel",
        function: "Structural foundation and vibrational dampening.",
        assemblyOrder: 1,
        connections: ["Crawler_Tread_Systems", "Primary_Gravitational_Anchor", "Operator_Command_Cabin"],
        failureEffect: "Structural collapse leading to immediate and catastrophic loss of core containment.",
        cascadeFailures: ["Planck_Singularity_Core", "Magnetic_Confinement_Torus", "Articulated_Plasma_Boom"],
        originalPosition: { x: 0, y: 30, z: -15 },
        explodedPosition: { x: 0, y: -50, z: -15 }
    });

    parts.push({
        name: "Crawler_Tread_Systems",
        description: "Eight massively reinforced off-road wheel assemblies equipped with hyper-dense rubber lugs. These allow the reactor to be mobile, traversing hostile terrain while maintaining delicate internal gyroscopic stabilization.",
        material: "rubber, chrome, steel",
        function: "Locomotion and terrain adaptation.",
        assemblyOrder: 2,
        connections: ["GodTier_Chassis"],
        failureEffect: "Immobilization in potentially hazardous zones.",
        cascadeFailures: ["Operator_Command_Cabin"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 150 }
    });

    parts.push({
        name: "Operator_Command_Cabin",
        description: "Heavily shielded, tinted-glass enclosure for the reactor operators. Contains high-fidelity joysticks, steering yokes, and glowing diagnostic screens capable of parsing localized spacetime distortions.",
        material: "steel, tinted glass, plastic",
        function: "Human-machine interface and telemetry analysis.",
        assemblyOrder: 3,
        connections: ["GodTier_Chassis", "Telemetry_Sensor_Array"],
        failureEffect: "Loss of manual override and operator vaporization.",
        cascadeFailures: ["Coolant_Circulation_Pumps", "Planck_Singularity_Core"],
        originalPosition: { x: 0, y: 90, z: 140 },
        explodedPosition: { x: 0, y: 150, z: 250 }
    });

    parts.push({
        name: "Magnetic_Confinement_Torus",
        description: "A gigantic toroid woven with dark steel that generates a magnetic field strong enough to crush degenerate matter, acting as the primary barrier against the Absolute Hot core.",
        material: "darkSteel",
        function: "Primary spatial confinement.",
        assemblyOrder: 4,
        connections: ["GodTier_Chassis", "Planck_Singularity_Core", "Magnetic_Flux_Coils"],
        failureEffect: "Instantaneous expansion of the core, vaporizing the planet.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: 0, y: 120, z: -150 }
    });

    parts.push({
        name: "Magnetic_Flux_Coils",
        description: "Twelve intricately wrapped copper torus knots that constrict and shape the magnetic containment field, preventing the singularity from breaching the torus wall.",
        material: "copper",
        function: "Field modulation and reinforcement.",
        assemblyOrder: 5,
        connections: ["Magnetic_Confinement_Torus"],
        failureEffect: "Magnetic field instability leading to thermal leaks.",
        cascadeFailures: ["Thermal_Bloom_Dampeners", "SubQuantum_Cooling_Rings"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: 100, y: 120, z: -20 }
    });

    parts.push({
        name: "SubQuantum_Cooling_Rings",
        description: "Rings of exotic matter chilled to absolute zero. They spin counter-rotationally at relativistic speeds to create a thermal gradient of 1.41x10^32 Kelvin across a distance of exactly 1 millimeter.",
        material: "matZeroPoint",
        function: "Extreme thermal gradient maintenance.",
        assemblyOrder: 6,
        connections: ["Magnetic_Confinement_Torus", "Planck_Singularity_Core"],
        failureEffect: "Thermal runaway melting the confinement torus.",
        cascadeFailures: ["Magnetic_Confinement_Torus"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: -100, y: 120, z: -20 }
    });

    parts.push({
        name: "Planck_Singularity_Core",
        description: "The heart of the machine. A microscopic region where matter has been heated to the Planck temperature, causing all four fundamental forces to unify. It radiates blinding, reality-warping light.",
        material: "matPlanck",
        function: "Infinite energy generation.",
        assemblyOrder: 7,
        connections: ["SubQuantum_Cooling_Rings", "Thermal_Bloom_Dampeners"],
        failureEffect: "Creation of a Kugelblitz black hole.",
        cascadeFailures: ["Universe"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: 0, y: 250, z: -20 }
    });

    parts.push({
        name: "Thermal_Bloom_Dampeners",
        description: "Layered spherical energy fields that intercept the immense Hawking radiation and blackbody emissions, stepping down the frequency to prevent the operator cabin from catching fire.",
        material: "matBloom1, matBloom2",
        function: "Radiation shielding.",
        assemblyOrder: 8,
        connections: ["Planck_Singularity_Core"],
        failureEffect: "Lethal radiation exposure.",
        cascadeFailures: ["Operator_Command_Cabin"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: 0, y: 120, z: 100 }
    });

    parts.push({
        name: "Articulated_Plasma_Boom",
        description: "A massive, hydraulically articulated boom arm made of extruded steel. It dynamically positions the exhaust stacks to vent excess plasma safely away from the chassis.",
        material: "steel",
        function: "Plasma routing and exhaust positioning.",
        assemblyOrder: 9,
        connections: ["GodTier_Chassis", "Plasma_Exhaust_Stacks", "Boom_Hydraulic_Actuators"],
        failureEffect: "Plasma venting directly onto the chassis.",
        cascadeFailures: ["GodTier_Chassis", "Crawler_Tread_Systems"],
        originalPosition: { x: 0, y: 75, z: -80 },
        explodedPosition: { x: 0, y: 200, z: -200 }
    });

    parts.push({
        name: "Boom_Hydraulic_Actuators",
        description: "Complex cylinder-in-cylinder hydraulic pistons operating at pressures exceeding 50,000 PSI to pivot the massive plasma boom.",
        material: "steel, chrome",
        function: "Boom articulation.",
        assemblyOrder: 10,
        connections: ["GodTier_Chassis", "Articulated_Plasma_Boom"],
        failureEffect: "Boom arm collapse.",
        cascadeFailures: ["Articulated_Plasma_Boom"],
        originalPosition: { x: 0, y: 70, z: -60 },
        explodedPosition: { x: 50, y: 100, z: -100 }
    });

    parts.push({
        name: "Tachyon_Routing_Manifold",
        description: "Intricate network of neon-green glowing tubes routing tachyon particles to manipulate local time dilation around the core, ensuring it doesn't instantly evaporate.",
        material: "matTachyon, rubber",
        function: "Time dilation routing.",
        assemblyOrder: 11,
        connections: ["GodTier_Chassis", "Planck_Singularity_Core"],
        failureEffect: "Time desynchronization; core ages billions of years in a second.",
        cascadeFailures: ["Planck_Singularity_Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: 50, z: 0 }
    });

    parts.push({
        name: "Exotic_Matter_Injectors",
        description: "Eight heavy chrome cylinders piercing the confinement torus. They inject stabilizing exotic matter with negative mass directly into the singularity.",
        material: "chrome",
        function: "Core stabilization.",
        assemblyOrder: 12,
        connections: ["Magnetic_Confinement_Torus"],
        failureEffect: "Loss of negative mass, singularity collapse.",
        cascadeFailures: ["Planck_Singularity_Core"],
        originalPosition: { x: 0, y: 120, z: -20 },
        explodedPosition: { x: 150, y: 120, z: -20 }
    });

    parts.push({
        name: "Plasma_Exhaust_Stacks",
        description: "Lathed bell-nozzles mounted on the boom arm, radiating intense purple plasma as waste heat is expelled into the upper atmosphere.",
        material: "darkSteel, matPlasma",
        function: "Waste heat expulsion.",
        assemblyOrder: 13,
        connections: ["Articulated_Plasma_Boom"],
        failureEffect: "Overpressure detonation.",
        cascadeFailures: ["Articulated_Plasma_Boom", "GodTier_Chassis"],
        originalPosition: { x: 0, y: 175, z: -80 },
        explodedPosition: { x: 0, y: 300, z: -80 }
    });

    parts.push({
        name: "Zero_Point_Energy_Pumps",
        description: "Four massive cylinder housings containing rapidly spinning fan blades. They circulate liquid helium-3 throughout the chassis to keep the structural steel from liquefying.",
        material: "steel, darkSteel",
        function: "Chassis active cooling.",
        assemblyOrder: 14,
        connections: ["GodTier_Chassis", "Hydraulic_Routing"],
        failureEffect: "Chassis structural integrity failure due to melting.",
        cascadeFailures: ["GodTier_Chassis"],
        originalPosition: { x: 0, y: 80, z: 20 },
        explodedPosition: { x: 100, y: 80, z: 100 }
    });

    parts.push({
        name: "Thermal_Shockwave_Dampers",
        description: "Eight heavy hydraulic pistons connecting the base to the core equator. They furiously pump in and out to counteract the violent, erratic physical vibrations caused by spatial tearing.",
        material: "darkSteel, chrome",
        function: "Kinetic shock absorption.",
        assemblyOrder: 15,
        connections: ["GodTier_Chassis", "Magnetic_Confinement_Torus"],
        failureEffect: "Vibrational shattering of the containment torus.",
        cascadeFailures: ["Magnetic_Confinement_Torus", "Planck_Singularity_Core"],
        originalPosition: { x: 0, y: 90, z: -20 },
        explodedPosition: { x: -100, y: 50, z: -100 }
    });

    const description = "The God-Tier Absolute Hot Reactor. A monstrous, mobile technological terror designed to generate and contain a microscopic singularity burning at the Planck Temperature (1.416 × 10^32 K). It utilizes zero-point cooling, tachyon time-dilation routing, and brutal mechanical shockwave dampers to prevent reality from unraveling.";

    const quizQuestions = [
        {
            question: "At the Planck temperature (approx 1.41 x 10^32 K), what theoretical threshold is crossed regarding the fundamental forces of nature?",
            options: [
                "Gravity becomes highly repulsive", 
                "All four fundamental forces unify into a single primordial force", 
                "Electromagnetism decouples completely from the weak nuclear force", 
                "The strong nuclear force becomes macroscopic in range"
            ],
            answer: 1,
            explanation: "According to current theoretical physics, at the extreme energy scales corresponding to the Planck temperature, the four fundamental forces (gravity, electromagnetism, weak, and strong nuclear forces) are expected to unify into a single unified field, mirroring the conditions of the universe a fraction of a second after the Big Bang."
        },
        {
            question: "What physical limit dictates that the Planck temperature is the theoretical 'Absolute Hot' maximum?",
            options: [
                "The melting point of the Higgs boson",
                "The speed of light cannot exceed 3x10^8 m/s",
                "The wavelength of emitted blackbody radiation reaches the Planck length",
                "The cosmic microwave background absorbs all excess heat"
            ],
            answer: 2,
            explanation: "As temperature increases, the peak wavelength of blackbody radiation decreases. At the Planck temperature, this wavelength equals the Planck length (the smallest meaningful unit of distance). At higher temperatures, current models of quantum mechanics and general relativity break down entirely."
        },
        {
            question: "In the context of extreme high-energy physics, what does the Hagedorn temperature represent, and how does it relate to Absolute Hot?",
            options: [
                "The temperature where hadronic matter undergoes a phase transition into a quark-gluon plasma, acting as a false Absolute Hot for ordinary matter.",
                "The exact temperature of the sun's core.",
                "The temperature at which tachyons are naturally formed.",
                "The lowest possible temperature before absolute zero."
            ],
            answer: 0,
            explanation: "The Hagedorn temperature (approx 2 x 10^12 K) is the point at which hadronic matter (protons, neutrons) breaks down into a quark-gluon plasma. For a long time, it was considered a 'boiling point' for ordinary matter, though the true absolute theoretical maximum (Planck temp) is vastly higher."
        },
        {
            question: "If a macroscopic region were somehow maintained at the Planck temperature, what cosmological phenomenon would immediately result due to the extreme energy density?",
            options: [
                "A massive supernova explosion",
                "The spontaneous generation of anti-matter galaxies",
                "The formation of a Kugelblitz, a black hole formed from concentrated energy",
                "The freezing of local time"
            ],
            answer: 2,
            explanation: "Because energy and mass are equivalent (E=mc^2), an extreme concentration of thermal energy at the Planck scale would possess immense gravitational pull, inevitably collapsing the region into a Kugelblitz—a black hole formed strictly from radiation/energy rather than matter."
        },
        {
            question: "Why must the 'SubQuantum Cooling Rings' in this machine maintain a thermal gradient of absolute zero immediately adjacent to the core?",
            options: [
                "To make the machine look aesthetically pleasing.",
                "To counteract the infinite specific heat capacity of the singularity, freezing the escaping Hawking radiation.",
                "To freeze the magnetic coils so they conduct better.",
                "Because absolute zero cancels out absolute hot mathematically."
            ],
            answer: 1,
            explanation: "In this highly advanced fictional engineering paradigm, maintaining containment of a Planck-temp singularity requires immediate thermal quenching of escaping Hawking radiation. Absolute zero rings act as a perfect thermal sink, theoretically stabilizing the extreme gradient via quantum thermal dampening."
        }
    ];

    function animate(time, speed) {
        const t = time * speed;
        
        // Mobile chassis wheels rotating
        anim.wheels.forEach(wheel => {
            wheel.rotation.x = t * 2;
        });

        // Radar spinning
        if (anim.radar) {
            anim.radar.rotation.y = t * 3;
        }

        // Coolant Fans spinning rapidly
        anim.fans.forEach((fanGroup, idx) => {
            fanGroup.rotation.y = t * 15 * (idx % 2 === 0 ? 1 : -1);
        });

        // Singularity pulsating and vibrating violently
        if (anim.singularity) {
            anim.singularity.scale.setScalar(1 + Math.sin(t * 50) * 0.1 + Math.random() * 0.1);
            anim.singularity.position.set(
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5
            );
            // Color shifting
            anim.singularity.material.emissive.setHSL((t * 2) % 1, 1, 0.8);
        }

        // Thermal Bloom breathing
        anim.bloomLayers.forEach((layer, idx) => {
            layer.rotation.y = t * (idx + 1);
            layer.rotation.z = t * (idx + 0.5);
            layer.scale.setScalar(1 + Math.sin(t * 5 + idx) * 0.05);
            layer.material.opacity = 0.5 + Math.sin(t * 10 + idx) * 0.2;
        });

        // SubQuantum Cooling Rings counter-rotating
        anim.coolingRings.forEach((ring, idx) => {
            ring.rotation.x = t * (idx + 1) * 2;
            ring.rotation.y = t * (idx + 2) * 1.5;
            ring.material.opacity = 0.8 + Math.sin(t * 20) * 0.2; // flickering
        });

        // Magnetic Coils pulsing
        anim.coils.forEach((coil, idx) => {
            coil.rotation.z = t * 5; 
            // Emissive pulse
            const pulse = (Math.sin(t * 10 + idx) + 1) / 2;
            coil.material.emissiveIntensity = 2 + pulse * 5;
        });

        // Shockwave rings expanding and resetting
        anim.shockwaveRings.forEach((sw, idx) => {
            const phase = (t * 2 + idx * 0.33) % 1.0; 
            sw.scale.setScalar(1 + phase * 8); // expand outward
            sw.material.opacity = 1.0 - phase; // fade out
        });

        // Thermal Shockwave Dampers (Pistons) pumping erratically
        anim.pistonsArr.forEach((piston, idx) => {
            piston.position.y = 15 + Math.sin(t * 30 + idx * 2) * 4 + Math.sin(t * 73) * 2;
        });

        // Articulated Boom Arm Sine Wave Motion
        if (anim.boom) {
            const boomAngle = Math.sin(t) * (Math.PI / 6) + (Math.PI / 6); // Sweep from 0 to 60 degrees
            anim.boom.rotation.x = boomAngle;

            // Sync the hydraulic piston to the boom movement
            if (anim.pistonOuter && anim.pistonInner && anim.boomAttachment) {
                // Get world position of the attachment point on the boom
                const targetPos = new THREE.Vector3();
                anim.boomAttachment.getWorldPosition(targetPos);
                
                // Outer cylinder looks at the attachment point
                anim.pistonOuter.lookAt(targetPos);
                
                // Calculate distance from piston base to attachment point
                const basePos = new THREE.Vector3();
                anim.pistonOuter.getWorldPosition(basePos);
                const distance = basePos.distanceTo(targetPos);
                
                // Adjust inner cylinder length/position to bridge the gap
                // base length is 60, we scale it to match distance
                const scaleZ = distance / 60;
                anim.pistonInner.scale.y = scaleZ; // cylinder length is along Y normally, but due to lookAt it might be Z, wait lookAt points Z towards target.
                anim.pistonInner.position.y = 30 * scaleZ; // keep it connected
                
                // Note: THREE.js Cylinder geometry is oriented along Y. When lookAt is called, the Z axis points to the target. 
                // We rotate the geometry in the constructor: inner.geometry.translate(0, 30, 0) handles the base offset.
                // Actually to make lookAt work perfectly with cylinders, we usually rotate them in X by PI/2.
                // Since this is a visual approximation, we adjust the inner position directly along Z
                anim.pistonInner.position.set(0, 0, distance / 2);
                anim.pistonInner.scale.set(1, 1, distance / 60); 
                // wait, if geometry was translated, scaling it might behave differently. 
                // For simplicity, we just move it.
                anim.pistonInner.position.z = distance / 2 - 10;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
