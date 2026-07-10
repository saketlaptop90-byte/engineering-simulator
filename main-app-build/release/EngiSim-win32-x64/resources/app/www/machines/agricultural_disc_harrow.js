import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- Custom High-Tech & Glowing Materials ---
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff1100,
        emissiveIntensity: 0.1, // Subtle glow to make it look brand new and high-tech
        roughness: 0.3,
        metalness: 0.7
    });

    const hydraulicHoseMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.1
    });

    const warningLightMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const redLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.1
    });

    // --- Animation State Tracker ---
    const animationState = {
        rotatingGangs: [],
        wheels: [],
        hydraulics: [],
        timeCounter: 0
    };

    // --- Complex Geometry Generators (NO BLOCKY SHAPES) ---

    // 1. Create a tubular structural beam (cylinder) connecting two 3D points
    function createTube(x1, y1, z1, x2, y2, z2, radius, mat) {
        const dist = Math.hypot(x2 - x1, Math.hypot(y2 - y1, z2 - z1));
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dist, 24), mat);
        mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
        mesh.lookAt(new THREE.Vector3(x2, y2, z2));
        mesh.rotateX(Math.PI / 2);
        return mesh;
    }

    // 2. Build a full tubular chassis frame using interconnected tubes
    function buildTubularFrame(width, length, isWing) {
        const frame = new THREE.Group();
        const hw = width / 2;
        const hl = length / 2;
        const r = 0.25; // Main tube radius

        // Outer perimeter
        frame.add(createTube(-hw, 0, -hl, hw, 0, -hl, r, neonOrange)); // Front
        frame.add(createTube(-hw, 0, hl, hw, 0, hl, r, neonOrange));   // Rear
        frame.add(createTube(-hw, 0, -hl, -hw, 0, hl, r, neonOrange)); // Left
        frame.add(createTube(hw, 0, -hl, hw, 0, hl, r, neonOrange));   // Right

        // Internal cross members for structural integrity
        const numCross = 3;
        for (let i = 1; i <= numCross; i++) {
            const z = -hl + (length / (numCross + 1)) * i;
            frame.add(createTube(-hw, 0, z, hw, 0, z, r * 0.8, neonOrange));
        }

        // Diagonal bracing (X-brace in the center)
        frame.add(createTube(-hw, 0, -hl, hw, 0, hl, r * 0.6, neonOrange));
        frame.add(createTube(hw, 0, -hl, -hw, 0, hl, r * 0.6, neonOrange));

        return frame;
    }

    // 3. Ultra-realistic Tire with Extruded Chevron Treads
    function createDetailedTire(radius, width) {
        const tireGroup = new THREE.Group();

        // Inner carcass (Torus)
        const carcassGeo = new THREE.TorusGeometry(radius, width / 2, 32, 64);
        const carcass = new THREE.Mesh(carcassGeo, rubber);
        tireGroup.add(carcass);

        // Chevron Lugs via ExtrudeGeometry
        const treadShape = new THREE.Shape();
        treadShape.moveTo(0, 0);
        treadShape.lineTo(width * 0.45, width * 0.15);
        treadShape.lineTo(width * 0.45, width * 0.3);
        treadShape.lineTo(0, width * 0.15);
        treadShape.lineTo(-width * 0.45, width * 0.3);
        treadShape.lineTo(-width * 0.45, width * 0.15);
        treadShape.lineTo(0, 0);

        const extrudeSettings = { depth: radius * 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        const treadGeo = new THREE.ExtrudeGeometry(treadShape, extrudeSettings);

        const numLugs = 40;
        for (let i = 0; i < numLugs; i++) {
            const tread = new THREE.Mesh(treadGeo, rubber);
            const angle = (i / numLugs) * Math.PI * 2;
            tread.position.x = Math.cos(angle) * (radius + width / 2 - 0.05);
            tread.position.y = Math.sin(angle) * (radius + width / 2 - 0.05);
            tread.rotation.z = angle + Math.PI / 2;
            tread.rotation.y = Math.PI / 2;
            tireGroup.add(tread);
        }

        // Deep dish Rim
        const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width * 0.85, 32);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, chrome);
        tireGroup.add(rim);

        // Central hub and structural spokes
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, width * 0.9, 32), darkSteel);
        hub.rotateX(Math.PI / 2);
        tireGroup.add(hub);

        for (let i = 0; i < 8; i++) {
            const spokeGeo = new THREE.CylinderGeometry(radius * 0.06, radius * 0.1, radius * 1.3, 16);
            spokeGeo.rotateX(Math.PI / 2);
            const spoke = new THREE.Mesh(spokeGeo, neonOrange);
            const angle = (i / 8) * Math.PI * 2;
            spoke.position.x = Math.cos(angle) * radius * 0.3;
            spoke.position.y = Math.sin(angle) * radius * 0.3;
            spoke.rotation.z = angle;
            tireGroup.add(spoke);
        }

        return tireGroup;
    }

    // 4. Concave cutting disc using LatheGeometry
    function buildConcaveDisc(radius) {
        const points = [];
        // Front face (concave)
        for (let i = 0; i <= 24; i++) {
            const t = i / 24;
            const r = radius * Math.sin(t * Math.PI / 2);
            const z = (radius * 0.2) * Math.cos(t * Math.PI / 2) - (radius * 0.2);
            points.push(new THREE.Vector2(r, z));
        }
        // Back face (convex thickness)
        for (let i = 24; i >= 0; i--) {
            const t = i / 24;
            const r = (radius - 0.05) * Math.sin(t * Math.PI / 2);
            const z = ((radius - 0.05) * 0.2) * Math.cos(t * Math.PI / 2) - (radius * 0.25);
            points.push(new THREE.Vector2(r, z));
        }
        const geo = new THREE.LatheGeometry(points, 48);
        geo.rotateX(Math.PI / 2); // Align so Z axis is the center axle
        return new THREE.Mesh(geo, darkSteel);
    }

    // 5. High-detail Bearing Trunnion Housing
    function makeBearingHousing(radius) {
        const housing = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), steel);
        housing.add(body);

        const flangeL = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.25, radius * 1.25, 0.1, 24), darkSteel);
        flangeL.rotation.z = Math.PI / 2;
        flangeL.position.x = -radius * 0.8;
        housing.add(flangeL);

        const flangeR = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.25, radius * 1.25, 0.1, 24), darkSteel);
        flangeR.rotation.z = Math.PI / 2;
        flangeR.position.x = radius * 0.8;
        housing.add(flangeR);

        const zerk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8), copper);
        zerk.position.set(0, radius, 0);
        housing.add(zerk);

        return housing;
    }

    // 6. Complete Disc Gang Assembly (Shaft, Discs, Spacers, Scrapers, Bearings)
    function buildDiscGangSystem(numDiscs, spacing, discRadius) {
        const system = new THREE.Group();
        const rotating = new THREE.Group();
        const staticGrp = new THREE.Group();
        system.add(rotating);
        system.add(staticGrp);

        const shaftLen = numDiscs * spacing + 1;
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, shaftLen, 24), chrome);
        shaft.rotation.z = Math.PI / 2;
        rotating.add(shaft);

        for (let i = 0; i < numDiscs; i++) {
            const disc = buildConcaveDisc(discRadius);
            disc.position.x = -shaftLen / 2 + 0.5 + i * spacing;
            rotating.add(disc);

            if (i < numDiscs - 1) {
                const spacer = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, spacing - 0.05, 24), steel);
                spacer.rotation.z = Math.PI / 2;
                spacer.position.x = -shaftLen / 2 + 0.5 + i * spacing + spacing / 2;
                rotating.add(spacer);
            }

            // Mud Scraper System
            const scraperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, discRadius * 1.5, 12), darkSteel);
            scraperArm.rotation.x = Math.PI / 4;
            scraperArm.position.set(disc.position.x + 0.1, discRadius * 0.6, discRadius * 0.6);
            staticGrp.add(scraperArm);

            const scraperBladeShape = new THREE.Shape();
            scraperBladeShape.moveTo(-0.1, -0.2);
            scraperBladeShape.lineTo(0.1, -0.2);
            scraperBladeShape.lineTo(0.15, 0.2);
            scraperBladeShape.lineTo(-0.15, 0.2);
            scraperBladeShape.lineTo(-0.1, -0.2);
            const scraperBlade = new THREE.Mesh(new THREE.ExtrudeGeometry(scraperBladeShape, { depth: 0.05, bevelEnabled: false }), chrome);
            scraperBlade.position.set(disc.position.x + 0.1, discRadius * 0.2, discRadius * 0.9);
            scraperBlade.rotation.x = Math.PI / 4;
            staticGrp.add(scraperBlade);
        }

        // Bearing Drop Stands
        const numBearings = Math.max(2, Math.floor(numDiscs / 3));
        for (let i = 0; i < numBearings; i++) {
            const stand = new THREE.Group();
            const dropLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16), neonOrange);
            dropLeg.position.y = 0.6;
            stand.add(dropLeg);
            const bearing = makeBearingHousing(0.25);
            stand.add(bearing);
            
            const px = -shaftLen / 2 + spacing * 1.5 + (i * (shaftLen - spacing * 3) / (numBearings - 1 || 1));
            stand.position.set(px, 0, 0);
            staticGrp.add(stand);
        }

        return { system, rotating, staticGrp, length: shaftLen };
    }

    // 7. Fully Dynamic Hydraulic Cylinder System
    function createHydraulicSystem(parentBase, parentTarget, localBasePos, localTargetPos, bodyRadius, bodyLen, matBody, matRod) {
        const baseGroup = new THREE.Group();
        baseGroup.position.copy(localBasePos);
        parentBase.add(baseGroup);

        const bodyGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLen, 24);
        bodyGeo.rotateX(Math.PI / 2);
        bodyGeo.translate(0, 0, bodyLen / 2);
        const body = new THREE.Mesh(bodyGeo, matBody);
        baseGroup.add(body);

        // Add hydraulic ports
        const port1 = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius*0.3, bodyRadius*0.3, bodyRadius*1.5, 12), copper);
        port1.position.set(0, bodyRadius, bodyLen * 0.1);
        baseGroup.add(port1);
        const port2 = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius*0.3, bodyRadius*0.3, bodyRadius*1.5, 12), copper);
        port2.position.set(0, bodyRadius, bodyLen * 0.9);
        baseGroup.add(port2);

        const rodGeo = new THREE.CylinderGeometry(bodyRadius * 0.55, bodyRadius * 0.55, bodyLen * 1.2, 24);
        rodGeo.rotateX(Math.PI / 2);
        rodGeo.translate(0, 0, bodyLen * 0.6); // Tip offset
        const rod = new THREE.Mesh(rodGeo, matRod);
        baseGroup.add(rod);

        const targetObj = new THREE.Group();
        targetObj.position.copy(localTargetPos);
        parentTarget.add(targetObj);

        animationState.hydraulics.push({
            baseGroup,
            rod,
            targetObj,
            bodyLen
        });

        return { baseGroup, targetObj };
    }


    // --- ASSEMBLY OF THE MASSIVE MACHINE ---

    // Parent Frame nodes
    const mainFrame = new THREE.Group();
    mainFrame.position.y = 2.5; // Raised working height
    group.add(mainFrame);

    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-4, 0.5, 0);
    mainFrame.add(leftWingPivot);

    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(4, 0.5, 0);
    mainFrame.add(rightWingPivot);

    const rockshaft = new THREE.Group();
    rockshaft.position.set(0, 0, 1.5);
    mainFrame.add(rockshaft);

    // 1. Hitch & Drawbar
    const hitchGrp = new THREE.Group();
    hitchGrp.add(createTube(0, 0, 7, -2, 0, 5, 0.3, neonOrange)); // Left A-frame arm
    hitchGrp.add(createTube(0, 0, 7, 2, 0, 5, 0.3, neonOrange));  // Right A-frame arm
    
    // Cast iron ring hitch
    const ringGeo = new THREE.TorusGeometry(0.25, 0.1, 16, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, chrome);
    ring.position.set(0, 0, 7.3);
    hitchGrp.add(ring);
    
    // PTO Shaft / Pump
    const ptoPump = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32), steel);
    ptoPump.position.set(0, 0.5, 6);
    ptoPump.rotation.x = Math.PI / 2;
    hitchGrp.add(ptoPump);
    
    mainFrame.add(hitchGrp);

    // 2. Chassis Sub-Frames
    const centralChassis = buildTubularFrame(8, 10, false);
    mainFrame.add(centralChassis);

    const leftWingFrame = buildTubularFrame(8, 10, true);
    leftWingFrame.position.set(-4, 0, 0); // Local to pivot, so it spans from 0 to -8
    leftWingPivot.add(leftWingFrame);

    const rightWingFrame = buildTubularFrame(8, 10, true);
    rightWingFrame.position.set(4, 0, 0); // Local to pivot, spans from 0 to +8
    rightWingPivot.add(rightWingFrame);

    // 3. Transport Wheels (Rockshaft)
    const rsTube = createTube(-3.5, 0, 0, 3.5, 0, 0, 0.4, darkSteel);
    rockshaft.add(rsTube);
    
    const rsArmL = createTube(-3, 0, 0, -3, -1.8, -1.2, 0.35, steel);
    const rsArmR = createTube(3, 0, 0, 3, -1.8, -1.2, 0.35, steel);
    rockshaft.add(rsArmL);
    rockshaft.add(rsArmR);

    const wheelL = createDetailedTire(1.3, 0.9);
    wheelL.position.set(-3, -1.8, -1.2);
    rockshaft.add(wheelL);
    animationState.wheels.push(wheelL);

    const wheelR = createDetailedTire(1.3, 0.9);
    wheelR.position.set(3, -1.8, -1.2);
    rockshaft.add(wheelR);
    animationState.wheels.push(wheelR);

    // 4. Hydraulics Installation
    // Lift Cylinder (Controls Rockshaft)
    const rsLever = createTube(0, 0, 0, 0, 1.5, 0.5, 0.25, neonOrange);
    rockshaft.add(rsLever);
    createHydraulicSystem(mainFrame, rockshaft, new THREE.Vector3(0, 1, -2), new THREE.Vector3(0, 1.5, 0.5), 0.25, 2.5, steel, chrome);

    // Wing Fold Cylinders
    createHydraulicSystem(mainFrame, leftWingFrame, new THREE.Vector3(-1.5, 1.2, 0), new THREE.Vector3(2.5, 0, 0), 0.25, 3.5, steel, chrome);
    createHydraulicSystem(mainFrame, rightWingFrame, new THREE.Vector3(1.5, 1.2, 0), new THREE.Vector3(-2.5, 0, 0), 0.25, 3.5, steel, chrome);

    // 5. Disc Gang Arrays
    const gangSpacing = 0.8;
    const gangRadius = 1.1;
    function addGang(parent, x, z, angleY, numDiscs) {
        const gangData = buildDiscGangSystem(numDiscs, gangSpacing, gangRadius);
        gangData.system.position.set(x, -1.2, z);
        gangData.system.rotation.y = angleY;
        parent.add(gangData.system);
        animationState.rotatingGangs.push(gangData.rotating);
        return gangData.system;
    }

    // Main Frame Gangs (V shape front, Inverted V rear)
    addGang(mainFrame, -2.2, -3.5, Math.PI / 10, 6); // Front Left Inner
    addGang(mainFrame, 2.2, -3.5, -Math.PI / 10, 6); // Front Right Inner
    addGang(mainFrame, -2.2, 3.5, -Math.PI / 10, 6); // Rear Left Inner
    addGang(mainFrame, 2.2, 3.5, Math.PI / 10, 6);  // Rear Right Inner

    // Left Wing Gangs
    addGang(leftWingFrame, 0, -3.5, Math.PI / 10, 8);  // Front Left Outer
    addGang(leftWingFrame, 0, 3.5, -Math.PI / 10, 8);  // Rear Left Outer

    // Right Wing Gangs
    addGang(rightWingFrame, 0, -3.5, -Math.PI / 10, 8); // Front Right Outer
    addGang(rightWingFrame, 0, 3.5, Math.PI / 10, 8);  // Rear Right Outer

    // 6. Extruded Hose Routing
    const distributor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), darkSteel);
    distributor.rotation.z = Math.PI / 2;
    distributor.position.set(0, 1, -4);
    mainFrame.add(distributor);

    for (let i = 0; i < 6; i++) {
        const offset = (i - 2.5) * 0.15;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(offset, 0.6, 6),       // Near PTO pump
            new THREE.Vector3(offset * 2, 1, 2),     // Above A-frame
            new THREE.Vector3(offset, 1.5, -1),      // Over main frame
            new THREE.Vector3(0, 1 + offset, -4)     // To distributor block
        ]);
        const hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.04, 12, false), hydraulicHoseMat);
        mainFrame.add(hose);
    }

    // 7. Safety Warning Lights and Reflectors
    const warningLightGrp = new THREE.Group();
    
    // Light mounts
    warningLightGrp.add(createTube(-4, 0, 4.5, -4, 3, 4.5, 0.08, steel));
    warningLightGrp.add(createTube(4, 0, 4.5, 4, 3, 4.5, 0.08, steel));

    const lLight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16), warningLightMat);
    lLight.rotation.x = Math.PI / 2;
    lLight.position.set(-4, 3, 4.5);
    warningLightGrp.add(lLight);

    const rLight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16), redLightMat);
    rLight.rotation.x = Math.PI / 2;
    rLight.position.set(4, 3, 4.5);
    warningLightGrp.add(rLight);

    mainFrame.add(warningLightGrp);


    // --- DATA POPULATION ---

    parts.push(
        {
            name: 'Central Tubular Chassis',
            description: 'Massive high-tensile steel tubular frame acting as the structural spine, with cross-members and X-braces for immense torsional rigidity.',
            material: 'neonOrange',
            function: 'Provides absolute structural integrity and anchor points for all hydraulic, ground-engaging, and trailing components.',
            assemblyOrder: 1,
            connections: ['drawbar_hitch', 'transport_rockshaft', 'folding_wings'],
            failureEffect: 'Catastrophic structural warping, breaking the machine entirely.',
            cascadeFailures: ['Fractured hydraulic lines', 'Gangs colliding and shattering'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 12, z: 0 }
        },
        {
            name: 'Heavy-Duty Drawbar & Hitch',
            description: 'V-shaped structural steel drawbar terminating in a multi-axis cast iron ring hitch, carrying the PTO pump.',
            material: 'steel',
            function: 'Couples the implement to the tractor and handles extreme draft loads during deep tillage.',
            assemblyOrder: 2,
            connections: ['central_tubular_chassis', 'tractor_clevis'],
            failureEffect: 'Implement violently detaches from the tractor.',
            cascadeFailures: ['Hydraulic lines rip off', 'Implement nose-dives into soil'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 15 }
        },
        {
            name: 'Left Hydraulic Folding Wing',
            description: 'Independent tubular steel wing frame that hinges over the main chassis for narrow transport mode.',
            material: 'neonOrange',
            function: 'Extends the tillage width while allowing safe highway transport when folded.',
            assemblyOrder: 3,
            connections: ['central_tubular_chassis', 'wing_lift_cylinders'],
            failureEffect: 'Wing collapses during operation or fails to fold for transport.',
            cascadeFailures: ['Traffic accidents', 'Hydraulic fluid blowout'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -15, y: 5, z: 0 }
        },
        {
            name: 'Right Hydraulic Folding Wing',
            description: 'Matching independent right wing, identically constructed with heavy-duty hinges.',
            material: 'neonOrange',
            function: 'Balances the left wing to complete the ultra-wide tillage pass.',
            assemblyOrder: 4,
            connections: ['central_tubular_chassis', 'wing_lift_cylinders'],
            failureEffect: 'Imbalanced draft load on tractor, destroying steering alignment.',
            cascadeFailures: ['Bent wing pivots', 'Tractor jackknifing'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 15, y: 5, z: 0 }
        },
        {
            name: 'Transport Rockshaft Assembly',
            description: 'Massive rotating steel torsion tube with drop arms that lift the entire machine via hydraulic pressure.',
            material: 'darkSteel',
            function: 'Raises the discs out of the ground for field turns and highway transport.',
            assemblyOrder: 5,
            connections: ['central_tubular_chassis', 'transport_tires', 'lift_cylinder'],
            failureEffect: 'Machine stuck in the ground, impossible to transport.',
            cascadeFailures: ['Tire blowouts', 'Tractor overload'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -10, z: 0 }
        },
        {
            name: 'Flotation Transport Tires',
            description: 'High-volume agricultural tires with aggressive chevron lugs mounted on deep dish rims.',
            material: 'rubber',
            function: 'Supports the multi-ton weight of the implement and provides traction to spin the rockshaft up.',
            assemblyOrder: 6,
            connections: ['transport_rockshaft'],
            failureEffect: 'Tire blowout.',
            cascadeFailures: ['Rim destruction', 'Frame gouges the asphalt'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -15, z: 5 }
        },
        {
            name: 'Wing Lift Cylinders',
            description: 'Twin high-pressure hydraulic cylinders with polished chrome rods and heavy clevis pins.',
            material: 'steel',
            function: 'Forces the massive wings upward into transport configuration against gravity.',
            assemblyOrder: 7,
            connections: ['central_tubular_chassis', 'folding_wings'],
            failureEffect: 'Hydraulic lock or spontaneous wing drop.',
            cascadeFailures: ['Fatal crushing injuries', 'Pump cavitation'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 8, z: -5 }
        },
        {
            name: 'Front Inner Disc Gangs',
            description: 'Six concave boron-steel discs per gang on a unified square shaft, set at an aggressive angle.',
            material: 'darkSteel',
            function: 'Executes the initial shattering and slicing of hardened topsoil and crop residue.',
            assemblyOrder: 8,
            connections: ['central_tubular_chassis', 'bearing_trunnions'],
            failureEffect: 'Discs fail to penetrate, skipping over the soil.',
            cascadeFailures: ['Poor seedbed preparation', 'Excessive wear on rear gangs'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -5, y: -8, z: -8 }
        },
        {
            name: 'Rear Inner Disc Gangs',
            description: 'Inverted-angle rear gangs designed to throw the soil back inwards, burying weeds.',
            material: 'darkSteel',
            function: 'Levels the trench created by the front gangs and completely buries sliced residue.',
            assemblyOrder: 9,
            connections: ['central_tubular_chassis', 'bearing_trunnions'],
            failureEffect: 'Creates deep furrows or ridges in the field.',
            cascadeFailures: ['Erosion pooling', 'Combine harvester damage next season'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 5, y: -8, z: 8 }
        },
        {
            name: 'Outer Wing Disc Gangs',
            description: 'Extended gangs mounted on the folding wings, providing a massive 40-foot cut width.',
            material: 'darkSteel',
            function: 'Maximizes acre-per-hour efficiency for large scale farming operations.',
            assemblyOrder: 10,
            connections: ['folding_wings'],
            failureEffect: 'Gangs detach and get run over.',
            cascadeFailures: ['Tire punctures', 'Bent wing frames'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -20, y: -10, z: -10 }
        },
        {
            name: 'Mud Scraper Array',
            description: 'Precision-aligned chrome blades positioned millimeters from each disc face.',
            material: 'chrome',
            function: 'Prevents sticky clay soils from packing between the discs and turning them into useless cylinders.',
            assemblyOrder: 11,
            connections: ['disc_gangs'],
            failureEffect: 'Discs plug solid with mud.',
            cascadeFailures: ['Implement ceases rotation', 'Acts like a bulldozer, snapping the hitch'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 3, z: -12 }
        },
        {
            name: 'Trunnion Bearing Housings',
            description: 'Sealed oil-bath bearings enclosed in spheroidal graphite iron housings with grease zerks.',
            material: 'steel',
            function: 'Allows the multi-ton disc gangs to spin freely at 10+ mph under extreme downward pressure.',
            assemblyOrder: 12,
            connections: ['disc_gangs', 'frame_drop_legs'],
            failureEffect: 'Bearings seize up.',
            cascadeFailures: ['Shafts shear off', 'Catastrophic friction fires'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 2 }
        },
        {
            name: 'Hydraulic Distribution Block & Hoses',
            description: 'Complex network of braided steel/rubber hoses routing 3000 PSI fluid to all cylinders.',
            material: 'rubber',
            function: 'Distributes hydraulic power accurately and evenly to wing and lift systems.',
            assemblyOrder: 13,
            connections: ['pto_pump', 'all_cylinders'],
            failureEffect: 'High-pressure oil spray.',
            cascadeFailures: ['Environmental contamination', 'Total loss of implement control'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 15, z: -8 }
        },
        {
            name: 'PTO Hydraulic Pump',
            description: 'High-flow axial piston pump mounted directly on the drawbar to boost tractor hydraulic flow.',
            material: 'steel',
            function: 'Ensures rapid lifting and folding times without draining the tractor reservoir.',
            assemblyOrder: 14,
            connections: ['tractor_pto', 'hydraulic_distribution_block'],
            failureEffect: 'Pump casing shatters.',
            cascadeFailures: ['Shrapnel ejection', 'Implement drops to ground instantly'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 5, z: 18 }
        },
        {
            name: 'Safety & Warning Beacons',
            description: 'Intensely bright neon-amber and red LED beacons mounted on tall steel masts.',
            material: 'glass',
            function: 'Warns oncoming highway traffic of the massively wide and dangerous agricultural machinery.',
            assemblyOrder: 15,
            connections: ['central_tubular_chassis'],
            failureEffect: 'Zero visibility at night.',
            cascadeFailures: ['Severe highway collision', 'Traffic fatalities'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 20, z: 0 }
        }
    );

    // --- KINEMATIC ANIMATION ENGINE ---
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // 1. Fold Wings (cycles smoothly to demonstrate kinematics)
        // Math.cos cycles from -1 to 1. We map it to 0 to 1 for fold phase.
        const foldPhase = (Math.cos(t * 0.4) + 1) / 2; 
        const maxFoldAngle = Math.PI * 0.58; // Approx 105 degrees inward

        leftWingPivot.rotation.z = -foldPhase * maxFoldAngle;
        rightWingPivot.rotation.z = foldPhase * maxFoldAngle;

        // 2. Lift/Lower Transport Wheels (offset phase from folding)
        const liftPhase = (Math.sin(t * 0.4) + 1) / 2;
        rockshaft.rotation.x = liftPhase * Math.PI * 0.35; // Rotates downward to lift frame

        // 3. Spin Discs and Tires based on "forward motion" simulation
        const groundSpeed = 3.5; 
        const rotStep = groundSpeed * 0.016 * speed; // Rough per-frame delta
        
        animationState.rotatingGangs.forEach(gang => {
            gang.rotation.z -= rotStep; 
        });

        animationState.wheels.forEach(wheel => {
            wheel.rotation.z -= rotStep;
        });

        // 4. Update Hydraulic Cylinders Dynamically using LookAt
        animationState.hydraulics.forEach(hyd => {
            const worldTarget = new THREE.Vector3();
            hyd.targetObj.getWorldPosition(worldTarget);
            
            // Re-orient the base group so the cylinder rod points exactly at the target
            hyd.baseGroup.lookAt(worldTarget);
            
            const worldBase = new THREE.Vector3();
            hyd.baseGroup.getWorldPosition(worldBase);
            const dist = worldBase.distanceTo(worldTarget);
            
            // Slide the rod out of the body to reach the target exactly
            hyd.rod.position.z = Math.max(0, dist - hyd.bodyLen * 0.8);
        });
    };

    const description = "A massive, ultra high-tech Agricultural Disc Harrow. Features dynamically folding wings for transport, a central rockshaft for lifting, highly detailed concave boron-steel cutting discs, thick tubular trusses, and a dynamic hydraulic cylinder network. Modeled completely without basic blocks to ensure absolute hyper-realism.";

    const quizQuestions = [
        {
            question: "Why do the front and rear disc gangs have opposing offset angles (V and inverted V)?",
            options: [
                "To look symmetrical",
                "To cancel out side-draft forces and ensure the soil is thrown outward then back inward to level the field.",
                "To reduce fuel consumption",
                "To fit on the transport truck"
            ],
            answer: "To cancel out side-draft forces and ensure the soil is thrown outward then back inward to level the field."
        },
        {
            question: "What is the critical function of the chrome scraper blades located near each disc?",
            options: [
                "To sharpen the discs while they spin",
                "To apply fertilizer to the soil",
                "To physically scrape sticky mud and clay off the concave surface, preventing the gang from turning into a solid cylinder of dirt.",
                "To cut large rocks in half"
            ],
            answer: "To physically scrape sticky mud and clay off the concave surface, preventing the gang from turning into a solid cylinder of dirt."
        },
        {
            question: "In the hydraulic wing fold mechanism, what kinematic technique ensures the rod tip stays connected as the wing rotates?",
            options: [
                "Dynamic LookAt tracking combined with sliding z-axis translation.",
                "Rigid unmoving joints",
                "Stretching rubber materials",
                "Pre-baked animation paths"
            ],
            answer: "Dynamic LookAt tracking combined with sliding z-axis translation."
        },
        {
            question: "Why does the main transport rockshaft utilize massive flotation tires?",
            options: [
                "Because they look cool",
                "To distribute the multi-ton weight of the steel frame across a large surface area, preventing deep ruts and soil compaction.",
                "To make the machine bounce over rocks",
                "They are filled with water for ballast"
            ],
            answer: "To distribute the multi-ton weight of the steel frame across a large surface area, preventing deep ruts and soil compaction."
        },
        {
            question: "What failure cascade occurs if a trunnion bearing seizes at high speeds?",
            options: [
                "The machine speeds up",
                "The shaft snaps, dragging the gang sideways, creating a massive pileup of dirt, extreme friction fires, and snapping the tractor's hitch.",
                "The tractor simply stalls safely",
                "The paint peels off"
            ],
            answer: "The shaft snaps, dragging the gang sideways, creating a massive pileup of dirt, extreme friction fires, and snapping the tractor's hitch."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
