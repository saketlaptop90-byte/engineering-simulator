import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Combine Harvester";

    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------
    // UTILITY & COMPLEX GEOMETRY GENERATORS
    // -------------------------------------------------------------
    
    // Extrudes a custom shape to avoid basic blocks
    function createExtrudedProfile(points, depth, material, bevel = true) {
        const shape = new THREE.Shape();
        if (points.length > 0) {
            shape.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                shape.lineTo(points[i].x, points[i].y);
            }
            shape.lineTo(points[0].x, points[0].y);
        }
        const settings = { 
            depth: depth, 
            bevelEnabled: bevel, 
            bevelSegments: 4, 
            steps: 2, 
            bevelSize: 0.1, 
            bevelThickness: 0.1 
        };
        const geo = new THREE.ExtrudeGeometry(shape, settings);
        geo.center();
        return new THREE.Mesh(geo, material);
    }

    // Creates detailed tires with aggressive V-tread lugs and complex rims
    function createTire(isFront) {
        const tireGroup = new THREE.Group();
        
        const radius = isFront ? 3.5 : 2.0;
        const tube = isFront ? 1.4 : 0.8;
        const rimRadius = isFront ? 2.2 : 1.2;
        const width = isFront ? 3.0 : 1.6;

        // Main torus body
        const tireGeo = new THREE.TorusGeometry(radius, tube, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tire);
        
        // Deep aggressive agricultural treads
        const numLugs = isFront ? 72 : 48;
        const lugGeo = new THREE.BoxGeometry(tube * 0.8, tube * 1.5, width * 1.1);
        for(let i=0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            const x = Math.cos(angle) * (radius + tube * 0.2);
            const y = Math.sin(angle) * (radius + tube * 0.2);
            lug.position.set(x, y, 0);
            
            lug.rotation.z = angle + Math.PI / 2;
            
            // Alternating V-shape chevron treads
            const isEven = i % 2 === 0;
            lug.rotation.y = isEven ? 0.4 : -0.4;
            lug.position.z = isEven ? width * 0.25 : -width * 0.25;
            
            // Taper the outer edge of lugs
            lug.scale.set(1, 1 - Math.abs(lug.position.z)*0.1, 1);
            tireGroup.add(lug);
        }

        // Rim Cylinder
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, width * 0.8, 48);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Intricate Inner Spokes
        const spokeGeo = new THREE.CylinderGeometry(0.15, 0.15, rimRadius * 1.9, 16);
        const numSpokes = isFront ? 12 : 8;
        for(let i=0; i<numSpokes; i++) {
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.rotation.z = (i / numSpokes) * Math.PI;
            tireGroup.add(spoke);
        }
        
        // Central Hub
        const hubGeo = new THREE.CylinderGeometry(rimRadius * 0.4, rimRadius * 0.4, width * 0.9, 32);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        // Lug Nuts
        const nutGeo = new THREE.CylinderGeometry(0.12, 0.12, width * 1.0, 6);
        const numNuts = isFront ? 10 : 6;
        for(let i=0; i<numNuts; i++) {
            const angle = (i / numNuts) * Math.PI * 2;
            const nut = new THREE.Mesh(nutGeo, steel);
            const nx = Math.cos(angle) * (rimRadius * 0.25);
            const ny = Math.sin(angle) * (rimRadius * 0.25);
            nut.position.set(nx, ny, 0);
            nut.rotation.x = Math.PI / 2;
            tireGroup.add(nut);
        }

        return tireGroup;
    }

    // -------------------------------------------------------------
    // MAJOR ASSEMBLIES
    // -------------------------------------------------------------

    function createMainChassis() {
        const chassisGroup = new THREE.Group();
        
        // Complex extruded hull
        const hullPoints = [
            {x: 0, y: 0}, {x: 14, y: 0}, {x: 15, y: 2}, 
            {x: 15, y: 6.5}, {x: 12, y: 7.5}, {x: 1, y: 7.5}, 
            {x: -1.5, y: 3}, {x: 0, y: 0}
        ];
        const chassis = createExtrudedProfile(hullPoints, 5.8, steel);
        chassis.position.set(6.5, 3.75, 0); // Offset to align correctly
        chassisGroup.add(chassis);
        
        // Engine Compartment Detailing
        const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.5, 5.5), darkSteel);
        engineBlock.position.set(-2, 5, 0);
        chassisGroup.add(engineBlock);
        
        // Radiator Grilles / Louvers
        const louverCount = 12;
        for (let i = 0; i < louverCount; i++) {
            const louver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 5.6), plastic);
            louver.position.set(-0.5 - i * 0.3, 5, 0);
            louver.rotation.z = 0.2;
            chassisGroup.add(louver);
        }

        // Exposed belts and pulleys
        const beltGroup = new THREE.Group();
        const pulley1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32), chrome);
        pulley1.position.set(-4, 4.5, 2.8);
        pulley1.rotation.x = Math.PI/2;
        beltGroup.add(pulley1);
        
        const pulley2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), chrome);
        pulley2.position.set(-4, 6.0, 2.8);
        pulley2.rotation.x = Math.PI/2;
        beltGroup.add(pulley2);
        
        // Drive belt (simplified as an angled torus stretched)
        const beltMesh = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 32), rubber);
        beltMesh.position.set(-4, 5.25, 2.8);
        beltMesh.scale.set(0.6, 1.2, 1);
        beltGroup.add(beltMesh);
        
        meshes.pulley1 = pulley1;
        meshes.pulley2 = pulley2;
        chassisGroup.add(beltGroup);

        // Exhaust Stack & Cap
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 3.5, 16), chrome);
        exhaust.position.set(-2, 8.5, 2);
        chassisGroup.add(exhaust);
        
        const exhaustCap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), chrome);
        exhaustCap.position.set(-2, 10.3, 2);
        exhaustCap.rotation.x = 0.4;
        chassisGroup.add(exhaustCap);
        
        return chassisGroup;
    }

    function createCabin() {
        const cabinGroup = new THREE.Group();
        
        // Cabin Shell
        const cabPoints = [
            {x: 0, y: 0}, {x: 4.5, y: 0}, {x: 5.2, y: 3.5}, 
            {x: 4.0, y: 5.5}, {x: -0.5, y: 5.0}, {x: 0, y: 0}
        ];
        const cabinFrame = createExtrudedProfile(cabPoints, 4.2, steel);
        cabinGroup.add(cabinFrame);

        // Panoramic Tinted Windows
        const windowGeo = new THREE.BoxGeometry(4.8, 4.2, 4.3);
        const windows = new THREE.Mesh(windowGeo, tinted);
        windows.position.set(2.2, 2.5, 0);
        cabinGroup.add(windows);

        // Interior - Captain's Seat
        const seatGroup = new THREE.Group();
        const seatBase = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), darkSteel);
        const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), plastic);
        seatCushion.position.y = 0.45;
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 1.2), plastic);
        seatBack.position.set(-0.4, 1.5, 0);
        seatGroup.add(seatBase, seatCushion, seatBack);
        seatGroup.position.set(1.5, 0.5, 0);
        cabinGroup.add(seatGroup);
        
        // Steering Column and Wheel
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), darkSteel);
        column.position.set(3.5, 1.0, 0);
        column.rotation.z = -0.5;
        cabinGroup.add(column);
        
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 16, 32), rubber);
        wheel.position.set(3.9, 1.6, 0);
        wheel.rotation.y = Math.PI / 2;
        wheel.rotation.x = -0.5;
        cabinGroup.add(wheel);

        // Control Console & Glowing Monitors
        const consoleArm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.8), plastic);
        consoleArm.position.set(2.0, 1.2, 1.0);
        cabinGroup.add(consoleArm);
        
        const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), darkSteel);
        joystick.position.set(2.5, 1.6, 1.0);
        const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.12), plastic);
        joyKnob.position.set(2.5, 1.8, 1.0);
        cabinGroup.add(joystick, joyKnob);

        const screenMat1 = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.5 });
        const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), screenMat1);
        screen1.position.set(3.2, 2.0, 1.5);
        screen1.rotation.y = -Math.PI / 4;
        cabinGroup.add(screen1);

        const screenMat2 = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.0 });
        const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5), screenMat2);
        screen2.position.set(3.5, 1.8, 1.8);
        screen2.rotation.y = -Math.PI / 3;
        cabinGroup.add(screen2);

        // Roof attachments (GPS Dome, work lights)
        const gpsDome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), plastic);
        gpsDome.position.set(2.0, 5.5, 0);
        cabinGroup.add(gpsDome);

        for (let i = 0; i < 4; i++) {
            const light = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.4), darkSteel);
            const lensMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });
            const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), lensMat);
            lens.position.x = 0.16;
            lens.rotation.y = Math.PI / 2;
            light.add(lens);
            
            const spacing = (i - 1.5) * 1.0;
            light.position.set(4.5, 5.2, spacing);
            light.rotation.z = -0.2; // angled down
            cabinGroup.add(light);
        }

        return cabinGroup;
    }

    function createGrainTank() {
        const tankGroup = new THREE.Group();
        
        // Base Hopper
        const hopperGeo = new THREE.CylinderGeometry(5.0, 3.0, 4.0, 4);
        const hopper = new THREE.Mesh(hopperGeo, steel);
        hopper.rotation.y = Math.PI / 4; // make it square to the chassis
        tankGroup.add(hopper);

        // Foldable Extensions
        const flapGeo = new THREE.BoxGeometry(6.5, 3.0, 0.1);
        
        const flapFront = new THREE.Mesh(flapGeo, steel);
        flapFront.position.set(3.5, 2.5, 0);
        flapFront.rotation.y = Math.PI / 2;
        flapFront.rotation.x = -Math.PI / 6;
        tankGroup.add(flapFront);
        
        const flapBack = new THREE.Mesh(flapGeo, steel);
        flapBack.position.set(-3.5, 2.5, 0);
        flapBack.rotation.y = Math.PI / 2;
        flapBack.rotation.x = Math.PI / 6;
        tankGroup.add(flapBack);
        
        const flapLeft = new THREE.Mesh(flapGeo, steel);
        flapLeft.position.set(0, 2.5, 3.5);
        flapLeft.rotation.x = -Math.PI / 6;
        tankGroup.add(flapLeft);
        
        const flapRight = new THREE.Mesh(flapGeo, steel);
        flapRight.position.set(0, 2.5, -3.5);
        flapRight.rotation.x = Math.PI / 6;
        tankGroup.add(flapRight);

        // Grain Mound inside
        const grainMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 1.0, metalness: 0.0 });
        const grainMound = new THREE.Mesh(new THREE.SphereGeometry(3.2, 32, 16), grainMat);
        grainMound.scale.set(1.0, 0.4, 1.0);
        grainMound.position.set(0, 1.5, 0);
        tankGroup.add(grainMound);

        // Cross Auger inside grain tank
        const augerGeo = new THREE.CylinderGeometry(0.2, 0.2, 6.0, 16);
        const auger = new THREE.Mesh(augerGeo, chrome);
        auger.rotation.x = Math.PI / 2;
        auger.position.set(0, 0, 0);
        tankGroup.add(auger);
        meshes.tankAuger = auger;

        return tankGroup;
    }

    function createUnloadingAuger() {
        const boomGroup = new THREE.Group();
        
        // Swivel Turret
        const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32), darkSteel);
        boomGroup.add(turret);

        // Main Pipe Boom
        const pipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 14.0, 32);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        // Pivot point at the turret
        pipe.geometry.translate(0, 7.0, 0); 
        pipe.rotation.z = -Math.PI / 2.2; 
        boomGroup.add(pipe);

        // Internal Screw (Visualized sticking out slightly or in cutouts)
        const screwGroup = new THREE.Group();
        for (let i = 0; i < 45; i++) {
            const flightGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16);
            const flight = new THREE.Mesh(flightGeo, chrome);
            flight.position.set(i * 0.3, 0, 0);
            flight.rotation.x = i * 0.8; 
            flight.rotation.z = Math.PI / 4;
            screwGroup.add(flight);
        }
        // Align screw inside pipe
        screwGroup.position.set(1, 0, 0);
        screwGroup.rotation.z = pipe.rotation.z;
        screwGroup.position.x = Math.cos(pipe.rotation.z) * 1 + 1;
        screwGroup.position.y = Math.sin(pipe.rotation.z) * 1 + 0.5;
        
        // Attach screw to pipe so it rotates with the boom
        const screwWrapper = new THREE.Group();
        screwWrapper.rotation.z = -Math.PI / 2.2; 
        
        const internalScrewGroup = new THREE.Group();
        for (let i = 0; i < 45; i++) {
            const flight = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16), chrome);
            flight.position.set(0, i * 0.3 + 0.5, 0);
            flight.rotation.y = i * 0.8;
            flight.rotation.x = Math.PI / 4;
            internalScrewGroup.add(flight);
        }
        screwWrapper.add(internalScrewGroup);
        boomGroup.add(screwWrapper);
        meshes.unloadingScrew = internalScrewGroup;

        // Discharge spout
        const spoutGeo = new THREE.CylinderGeometry(0.6, 0.4, 1.5, 16);
        const spout = new THREE.Mesh(spoutGeo, rubber);
        spout.position.set(13.8 * Math.cos(-Math.PI/2.2), 13.8 * Math.sin(-Math.PI/2.2) - 0.5, 0);
        boomGroup.add(spout);

        return boomGroup;
    }

    function createHeader() {
        const headerGroup = new THREE.Group();
        
        // Massive Cutter Bar Platform
        const frameWidth = 22.0;
        const frameGeo = new THREE.BoxGeometry(3.5, 1.5, frameWidth);
        const frame = new THREE.Mesh(frameGeo, steel);
        headerGroup.add(frame);
        
        // Backwall
        const backwallGeo = new THREE.BoxGeometry(0.5, 3.5, frameWidth);
        const backwall = new THREE.Mesh(backwallGeo, steel);
        backwall.position.set(-1.5, 1.0, 0);
        headerGroup.add(backwall);

        // Center Auger Console
        const centerAuger = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, frameWidth - 0.5, 32), chrome);
        centerAuger.rotation.x = Math.PI / 2;
        centerAuger.position.set(-0.2, 0.5, 0);
        headerGroup.add(centerAuger);
        meshes.centerAuger = centerAuger;
        
        // Cutter Teeth Array
        const toothGroup = new THREE.Group();
        for (let i = -frameWidth/2 + 0.5; i < frameWidth/2 - 0.5; i += 0.2) {
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4, 4), chrome);
            tooth.position.set(1.8, -0.6, i);
            tooth.rotation.z = -Math.PI / 2;
            toothGroup.add(tooth);
        }
        headerGroup.add(toothGroup);
        meshes.cutterTeeth = toothGroup;

        // Giant Rotating Tined Reel
        const reelGroup = new THREE.Group();
        const reelShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, frameWidth, 16), darkSteel);
        reelShaft.rotation.x = Math.PI / 2;
        reelGroup.add(reelShaft);
        
        const numArms = 6;
        for (let i = 0; i < numArms; i++) {
            const armAngle = (i / numArms) * Math.PI * 2;
            const batGroup = new THREE.Group();
            
            // Spoke supports
            for (let j = -frameWidth/2 + 1; j < frameWidth/2; j += 4) {
                const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8), steel);
                spoke.position.set(0, 0.9, j);
                batGroup.add(spoke);
            }
            
            // Horizontal bat
            const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, frameWidth - 0.2, 8), plastic);
            bat.rotation.x = Math.PI / 2;
            bat.position.set(0, 1.8, 0);
            batGroup.add(bat);
            
            // Tines (spring steel)
            for (let k = -frameWidth/2 + 0.5; k < frameWidth/2 - 0.5; k += 0.4) {
                const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6), chrome);
                tine.position.set(0.1, 2.1, k);
                tine.rotation.z = -0.2;
                batGroup.add(tine);
            }
            
            batGroup.rotation.z = armAngle;
            reelGroup.add(batGroup);
        }
        
        reelGroup.position.set(1.0, 1.5, 0);
        headerGroup.add(reelGroup);
        meshes.reel = reelGroup;

        // Side Shields
        const shieldPoints = [{x: 0, y: 0}, {x: 3.5, y: 0}, {x: 4.5, y: 2}, {x: 0, y: 3}, {x: 0, y: 0}];
        const shieldRight = createExtrudedProfile(shieldPoints, 0.2, plastic);
        shieldRight.position.set(-1.5, -0.7, frameWidth/2);
        headerGroup.add(shieldRight);
        
        const shieldLeft = createExtrudedProfile(shieldPoints, 0.2, plastic);
        shieldLeft.position.set(-1.5, -0.7, -frameWidth/2 - 0.2);
        headerGroup.add(shieldLeft);

        return headerGroup;
    }

    function createFeederHouse() {
        const feederGroup = new THREE.Group();
        const housing = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.5, 3.8), steel);
        housing.rotation.z = -0.2; // Angle down towards the header
        feederGroup.add(housing);
        
        // Hydraulic Lift Cylinders
        const leftHyd = new THREE.Group();
        const lBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0), darkSteel);
        const lRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0), chrome);
        lRod.position.y = 1.0;
        leftHyd.add(lBarrel, lRod);
        leftHyd.position.set(-1.0, -2.0, 1.5);
        leftHyd.rotation.z = 0.5;
        feederGroup.add(leftHyd);
        
        const rightHyd = new THREE.Group();
        const rBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0), darkSteel);
        const rRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0), chrome);
        rRod.position.y = 1.0;
        rightHyd.add(rBarrel, rRod);
        rightHyd.position.set(-1.0, -2.0, -1.5);
        rightHyd.rotation.z = 0.5;
        feederGroup.add(rightHyd);
        
        meshes.feederHydraulics = { leftRod: lRod, rightRod: rRod };

        return feederGroup;
    }

    function createStrawChopper() {
        const chopperGroup = new THREE.Group();
        const housing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 4.0), darkSteel);
        chopperGroup.add(housing);
        
        // Spinning Disks
        const diskLeftGroup = new THREE.Group();
        const diskL = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), steel);
        diskLeftGroup.add(diskL);
        for(let i=0; i<4; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.2), rubber);
            blade.rotation.y = (i/4) * Math.PI;
            diskLeftGroup.add(blade);
        }
        diskLeftGroup.position.set(0, -0.8, 1.0);
        chopperGroup.add(diskLeftGroup);
        
        const diskRightGroup = diskLeftGroup.clone();
        diskRightGroup.position.set(0, -0.8, -1.0);
        chopperGroup.add(diskRightGroup);
        
        meshes.chopperDisks = [diskLeftGroup, diskRightGroup];

        return chopperGroup;
    }

    function createAccessLadder() {
        const ladderGroup = new THREE.Group();
        const sideRailGeo = new THREE.CylinderGeometry(0.05, 0.05, 6.0);
        
        const rail1 = new THREE.Mesh(sideRailGeo, darkSteel);
        rail1.position.set(0, 0, 0.6);
        ladderGroup.add(rail1);
        
        const rail2 = new THREE.Mesh(sideRailGeo, darkSteel);
        rail2.position.set(0, 0, -0.6);
        ladderGroup.add(rail2);
        
        for(let i=0; i<10; i++) {
            const step = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.2), steel);
            step.position.set(0, -2.5 + i*0.5, 0);
            ladderGroup.add(step);
        }

        ladderGroup.rotation.z = -0.3;
        return ladderGroup;
    }

    // -------------------------------------------------------------
    // ASSEMBLY OF THE ENTIRE COMBINE
    // -------------------------------------------------------------

    // 1. Chassis
    const mainChassis = createMainChassis();
    mainChassis.position.set(0, 0, 0);
    group.add(mainChassis);
    parts.push({
        name: "Main Structural Chassis",
        description: "Heavy-duty extruded steel hull housing the internal processing systems and engine block.",
        material: "Steel, Dark Steel",
        function: "Provides the backbone for all mounted components and safely houses massive threshing rotors.",
        assemblyOrder: 1,
        connections: ["Axles", "Cabin", "Feeder House"],
        failureEffect: "Complete structural collapse, inability to operate.",
        cascadeFailures: ["Drive shaft shear", "Rotor misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Cabin
    const cabin = createCabin();
    cabin.position.set(4.0, 7.5, 0);
    group.add(cabin);
    parts.push({
        name: "Operator Cabin & Controls",
        description: "High-visibility command center with tinted panoramic windows, captain's seat, and glowing LCD monitors.",
        material: "Steel, Tinted Glass, Plastic",
        function: "Allows the operator to precisely control the harvest with advanced joysticks and GPS data.",
        assemblyOrder: 2,
        connections: ["Chassis", "Electrical Harness"],
        failureEffect: "Loss of environmental control, operator fatigue.",
        cascadeFailures: ["Sensor disconnect", "Steering failure"],
        originalPosition: { x: 4.0, y: 7.5, z: 0 },
        explodedPosition: { x: 4.0, y: 15, z: 0 }
    });

    // 3. Grain Tank
    const grainTank = createGrainTank();
    grainTank.position.set(-1.0, 7.5, 0);
    group.add(grainTank);
    parts.push({
        name: "Grain Tank & Extensions",
        description: "High-capacity hopper with foldable steel extensions and internal cross-augers.",
        material: "Steel, Chrome",
        function: "Stores thousands of bushels of clean grain before unloading.",
        assemblyOrder: 3,
        connections: ["Chassis", "Unloading Auger"],
        failureEffect: "Grain overflow, harvest halt.",
        cascadeFailures: ["Auger jam", "Elevator clog"],
        originalPosition: { x: -1.0, y: 7.5, z: 0 },
        explodedPosition: { x: -1.0, y: 18, z: 0 }
    });

    // 4. Unloading Auger
    const unloadingAuger = createUnloadingAuger();
    unloadingAuger.position.set(-3.0, 8.5, 2.5);
    // Parked position
    unloadingAuger.rotation.y = -Math.PI / 8;
    group.add(unloadingAuger);
    meshes.unloadingAugerBoom = unloadingAuger;
    parts.push({
        name: "Unloading Auger Boom",
        description: "Articulated boom pipe housing a massive internal helical screw for rapid discharge.",
        material: "Steel, Chrome",
        function: "Rapidly evacuates the grain tank into a transport vehicle while driving.",
        assemblyOrder: 4,
        connections: ["Grain Tank", "Hydraulic Swivel Turret"],
        failureEffect: "Inability to unload, grinding harvest to a halt.",
        cascadeFailures: ["Turret hydraulic leak", "Screw shear"],
        originalPosition: { x: -3.0, y: 8.5, z: 2.5 },
        explodedPosition: { x: -6.0, y: 12, z: 8.0 }
    });

    // 5 & 6. Front Flotation Tires
    const frontLeftTire = createTire(true);
    frontLeftTire.position.set(4.5, 3.5, 4.0);
    group.add(frontLeftTire);
    meshes.frontLeftTire = frontLeftTire;
    
    const frontRightTire = createTire(true);
    frontRightTire.position.set(4.5, 3.5, -4.0);
    frontRightTire.rotation.y = Math.PI; 
    group.add(frontRightTire);
    meshes.frontRightTire = frontRightTire;
    
    parts.push({
        name: "Front Drive Flotation Tires",
        description: "Massive rubber tires with extreme V-tread patterns and heavy-duty rims.",
        material: "Rubber, Dark Steel, Aluminum",
        function: "Supports the tremendous weight of the front header while providing primary traction in muddy fields.",
        assemblyOrder: 5,
        connections: ["Front Axle Transmission"],
        failureEffect: "Immobility, machine sinks into soft ground.",
        cascadeFailures: ["Hub fracture", "Transmission blowout"],
        originalPosition: { x: 4.5, y: 3.5, z: 4.0 },
        explodedPosition: { x: 4.5, y: 3.5, z: 10.0 }
    });

    // 7 & 8. Rear Steering Tires
    const rearLeftTire = createTire(false);
    rearLeftTire.position.set(-6.5, 2.0, 3.0);
    group.add(rearLeftTire);
    meshes.rearLeftTire = rearLeftTire;
    
    const rearRightTire = createTire(false);
    rearRightTire.position.set(-6.5, 2.0, -3.0);
    rearRightTire.rotation.y = Math.PI;
    group.add(rearRightTire);
    meshes.rearRightTire = rearRightTire;
    
    parts.push({
        name: "Rear Steering Tires",
        description: "Smaller deeply-treaded tires mounted on a central oscillating tie-rod axle.",
        material: "Rubber, Dark Steel",
        function: "Steers the combine from the rear for tight headland turns.",
        assemblyOrder: 6,
        connections: ["Rear Axle Pivot"],
        failureEffect: "Loss of directional control.",
        cascadeFailures: ["Tie-rod snap", "Hydraulic steering lock"],
        originalPosition: { x: -6.5, y: 2.0, z: 3.0 },
        explodedPosition: { x: -10.0, y: 2.0, z: 6.0 }
    });

    // 9. Feeder House
    const feederHouse = createFeederHouse();
    feederHouse.position.set(9.0, 3.5, 0);
    group.add(feederHouse);
    parts.push({
        name: "Feeder House & Lift Cylinders",
        description: "Angled steel tunnel utilizing hydraulic cylinders to lift the entire header assembly.",
        material: "Steel, Dark Steel, Chrome",
        function: "Transports cut crop via chain-slat conveyor up into the threshing rotor.",
        assemblyOrder: 7,
        connections: ["Main Chassis", "Cutting Header"],
        failureEffect: "Header drops to ground, crop cannot enter machine.",
        cascadeFailures: ["Hydraulic blowout", "Chain snap"],
        originalPosition: { x: 9.0, y: 3.5, z: 0 },
        explodedPosition: { x: 12.0, y: 5.5, z: 0 }
    });

    // 10. Cutting Header
    const header = createHeader();
    header.position.set(13.0, 2.0, 0);
    group.add(header);
    meshes.headerGroup = header;
    parts.push({
        name: "Wide-Sweep Cutting Header",
        description: "Gigantic 22-unit wide platform featuring a reciprocating cutter bar, central gathering auger, and massive tined reel.",
        material: "Steel, Chrome, Plastic",
        function: "Slices standing crops at the base and violently sweeps them into the center for processing.",
        assemblyOrder: 8,
        connections: ["Feeder House", "PTO Drive Shaft"],
        failureEffect: "Complete failure to harvest crop, extreme crop damage.",
        cascadeFailures: ["Reel shatter", "Cutter bar jam"],
        originalPosition: { x: 13.0, y: 2.0, z: 0 },
        explodedPosition: { x: 20.0, y: 2.0, z: 0 }
    });

    // 11. Straw Chopper
    const strawChopper = createStrawChopper();
    strawChopper.position.set(-8.5, 3.0, 0);
    group.add(strawChopper);
    parts.push({
        name: "Rear Straw Chopper & Spreader",
        description: "High-RPM twin-disk spreader housing covered in rubber deflector fins.",
        material: "Dark Steel, Steel, Rubber",
        function: "Chops expelled stalks and chaff, spreading it evenly across the field as fertilizer.",
        assemblyOrder: 9,
        connections: ["Main Chassis Rear", "Belt Drive"],
        failureEffect: "Creates dense rows of trash, blocking future seeding.",
        cascadeFailures: ["Blade fracture", "Belt snap"],
        originalPosition: { x: -8.5, y: 3.0, z: 0 },
        explodedPosition: { x: -14.0, y: 3.0, z: 0 }
    });

    // 12. Access Ladder
    const ladder = createAccessLadder();
    ladder.position.set(4.0, 4.0, 4.5);
    group.add(ladder);
    parts.push({
        name: "Access Ladder & Platforms",
        description: "Angled safety ladders with anti-slip steps and cylindrical handrails.",
        material: "Steel, Dark Steel",
        function: "Provides safe entry to the towering operator cabin and maintenance hatches.",
        assemblyOrder: 10,
        connections: ["Chassis Left Side"],
        failureEffect: "Inability for operator to board the machine safely.",
        cascadeFailures: ["Rail bend", "Step sheer"],
        originalPosition: { x: 4.0, y: 4.0, z: 4.5 },
        explodedPosition: { x: 4.0, y: 4.0, z: 8.0 }
    });

    // Hazard Lights
    const hazardLights = [];
    for (let i = 0; i < 2; i++) {
        const hMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 4.0 });
        const hLight = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), hMat);
        hLight.position.set(-1.0, 11.0, i === 0 ? 3.5 : -3.5);
        group.add(hLight);
        hazardLights.push(hLight);
    }
    meshes.hazardLights = hazardLights;


    // -------------------------------------------------------------
    // METADATA & ANIMATION
    // -------------------------------------------------------------

    const description = "The Modern Combine Harvester is a hyper-realistic, gargantuan agricultural marvel. Weighing over 30,000 lbs, it integrates a huge 22-unit cutting header with an aggressively tined rotating reel, a massive internal grain tank, an articulating unloading auger, and deeply-treaded flotation tires. The incredibly detailed operator cabin features tinted glass, ergonomic joysticks, and glowing digital telemetry screens, serving as the central nervous system for this highly complex, multi-functional heavy machine.";

    const quizQuestions = [
        {
            question: "What is the primary function of the enormous rotating tined reel on the cutting header?",
            options: [
                "To forcefully gather standing crops and sweep them into the cutter bar and center auger.", 
                "To thresh the grain from the stalks before it enters the machine.", 
                "To spread chaff evenly over the field.", 
                "To cool the engine block during heavy load."
            ],
            correct: 0,
            explanation: "The spinning reel acts like a giant rake, bending the crops over the cutting blades and immediately feeding the severed material into the internal processing systems."
        },
        {
            question: "Why do modern combine harvesters utilize much larger, deeply treaded tires on the front axle?",
            options: [
                "They bear the immense weight of the cutting header and provide necessary forward traction in soft fields.", 
                "They house the main fuel tanks inside the rims.", 
                "They are responsible for steering the machine.", 
                "They spin faster to create a vacuum effect for dust."
            ],
            correct: 0,
            explanation: "The front axle is the drive axle and carries the majority of the machine's load, especially the heavy header. Large flotation tires prevent the combine from sinking into muddy fields."
        },
        {
            question: "How does the combine offload its processed harvest while continuing to drive?",
            options: [
                "By swinging out an articulated unloading auger boom containing a high-speed helical screw.", 
                "By dropping it out of a trapdoor in the chassis floor.", 
                "By blowing it through a high-pressure pneumatic tube.", 
                "By detaching the entire grain tank onto a trailer."
            ],
            correct: 0,
            explanation: "The unloading auger swings outward over an adjacent truck or tractor-trailer, and a rapidly spinning internal screw forces the grain up and out of the pipe in seconds."
        },
        {
            question: "What is the mechanical purpose of the rear straw chopper?",
            options: [
                "To violently dice expelled stalks and distribute them evenly via spinning disks as organic fertilizer.", 
                "To pull the combine backward if it gets stuck.", 
                "To act as a counterweight against the front header.", 
                "To filter dust out of the operator cabin's air supply."
            ],
            correct: 0,
            explanation: "After the grain is extracted, the remaining plant waste (straw/chaff) is fed into the rear chopper where high-RPM disks shred and broadcast it over the field to decompose."
        },
        {
            question: "How does a combine harvester steer?",
            options: [
                "By pivoting the smaller rear wheels using a central oscillating tie-rod axle.", 
                "By turning the massive front wheels like a standard car.", 
                "By applying brakes to one side like a tracked tank.", 
                "By shifting the weight of the grain tank left or right."
            ],
            correct: 0,
            explanation: "Combines feature rear-wheel steering. Because the front wheels are massive and carry the header, steering from the rear allows the machine to pivot tightly on its front axle."
        }
    ];

    function animate(time, speed, meshes) {
        // Drive mechanics (Tires)
        const driveSpeed = time * speed * 2.0;
        if(meshes.frontLeftTire) meshes.frontLeftTire.rotation.z = -driveSpeed;
        if(meshes.frontRightTire) meshes.frontRightTire.rotation.z = -driveSpeed;
        if(meshes.rearLeftTire) meshes.rearLeftTire.rotation.z = -driveSpeed * 1.5;
        if(meshes.rearRightTire) meshes.rearRightTire.rotation.z = -driveSpeed * 1.5;

        // Rear Steering Wobble (Simulating terrain/steering adjustments)
        const steerAngle = Math.sin(time * speed * 0.5) * 0.3;
        if(meshes.rearLeftTire) meshes.rearLeftTire.rotation.y = steerAngle;
        if(meshes.rearRightTire) meshes.rearRightTire.rotation.y = steerAngle + Math.PI;

        // Header and Reel Mechanics
        if(meshes.reel) meshes.reel.rotation.z = time * speed * 3.5;
        if(meshes.centerAuger) meshes.centerAuger.rotation.x = time * speed * 4.0;
        
        // Cutter teeth reciprocation (vibration side to side)
        if(meshes.cutterTeeth) meshes.cutterTeeth.position.z = Math.sin(time * speed * 20.0) * 0.2;

        // Header bobbing (hydraulics flexing over terrain)
        const headerLift = Math.sin(time * speed * 1.5) * 0.1;
        if(meshes.headerGroup) meshes.headerGroup.position.y = 2.0 + headerLift;
        if(meshes.feederHydraulics) {
            meshes.feederHydraulics.leftRod.position.y = 1.0 + headerLift * 2;
            meshes.feederHydraulics.rightRod.position.y = 1.0 + headerLift * 2;
        }

        // Engine Belts & Pulleys
        if(meshes.pulley1) meshes.pulley1.rotation.y = time * speed * 8.0;
        if(meshes.pulley2) meshes.pulley2.rotation.y = time * speed * 12.0;

        // Internal Augers & Straw Chopper
        if(meshes.tankAuger) meshes.tankAuger.rotation.x = time * speed * 5.0;
        if(meshes.unloadingScrew) meshes.unloadingScrew.rotation.y = time * speed * 8.0;
        
        if(meshes.chopperDisks) {
            meshes.chopperDisks[0].rotation.y = time * speed * 15.0; // Extremely fast
            meshes.chopperDisks[1].rotation.y = -time * speed * 15.0;
        }

        // Unloading Auger Boom Swing (Demo animation)
        if(meshes.unloadingAugerBoom) {
            // Swings from parked (-Pi/8) out to active (-Pi/2) and back
            const swingBase = -Math.PI / 8;
            const swingRange = -Math.PI / 2.5;
            const swingPhase = (Math.sin(time * speed * 0.4) + 1) / 2; // 0 to 1
            meshes.unloadingAugerBoom.rotation.y = swingBase + (swingRange * swingPhase);
        }

        // Hazard Lights Flashing (On/Off step function)
        if(meshes.hazardLights) {
            const flash = Math.sin(time * 8.0) > 0 ? 5.0 : 0.5;
            meshes.hazardLights[0].material.emissiveIntensity = flash;
            meshes.hazardLights[1].material.emissiveIntensity = flash;
        }
    }

    return { 
        group, 
        parts, 
        description, 
        quizQuestions, 
        animate: (t, s) => animate(t, s, meshes) 
    };
}

// Auto-generated missing stub
export function createCombineHarvester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
