import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- Custom Materials for Hyper-Realism ---
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8
    });
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 1.2, roughness: 0.1, metalness: 0.5
    });
    const matteBlack = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.9, metalness: 0.1
    });
    const hopperWhite = new THREE.MeshStandardMaterial({
        color: 0xeeeeee, roughness: 0.3, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2
    });
    const tankBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0055ff, roughness: 0.2, transmission: 0.5, thickness: 0.5, clearcoat: 1.0
    });
    const dirtRubber = new THREE.MeshStandardMaterial({
        color: 0x222222, roughness: 0.8, metalness: 0.0
    });

    // --- Helper Functions ---
    function addPart(name, mesh, info) {
        mesh.name = name;
        mesh.userData = info;
        group.add(mesh);
        parts.push(info);
        meshes[name] = mesh;
    }

    function createRivets(targetGroup, num, radius, yOffset, zOffset) {
        const rivetGeo = new THREE.SphereGeometry(0.05, 8, 8);
        for(let i=0; i<num; i++) {
            const angle = (i/num) * Math.PI * 2;
            const rMesh = new THREE.Mesh(rivetGeo, chrome);
            rMesh.position.set(Math.cos(angle)*radius, yOffset, Math.sin(angle)*radius + zOffset);
            targetGroup.add(rMesh);
        }
    }

    // --- Complex Geometry Generators ---

    function createTireAndRim(radius, width, treadDepth) {
        const wheelGroup = new THREE.Group();
        
        // Tire body
        const tireGeo = new THREE.TorusGeometry(radius, width/2, 32, 64);
        const tire = new THREE.Mesh(tireGeo, dirtRubber);
        wheelGroup.add(tire);

        // Treads
        const treadGeo = new THREE.BoxGeometry(width * 1.4, treadDepth, width * 0.4);
        const numTreads = 48;
        for (let i = 0; i < numTreads; i++) {
            const angle = (i / numTreads) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, dirtRubber);
            tread.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            tread.rotation.z = angle + Math.PI / 2;
            tread.rotation.y = (i % 2 === 0) ? 0.35 : -0.35;
            wheelGroup.add(tread);
        }

        // Rim
        const rimGeo = new THREE.CylinderGeometry(radius*0.7, radius*0.7, width*1.2, 32, 1, true);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Hub & Spokes
        const hubGeo = new THREE.CylinderGeometry(radius*0.2, radius*0.25, width*1.3, 16);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        const spokeGeo = new THREE.CylinderGeometry(radius*0.04, radius*0.06, radius*1.4, 8);
        for(let i=0; i<10; i++) {
            const angle = (i/10)*Math.PI*2;
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.position.set(Math.cos(angle)*radius*0.35, Math.sin(angle)*radius*0.35, 0);
            spoke.rotation.z = angle + Math.PI/2;
            wheelGroup.add(spoke);
        }
        
        return wheelGroup;
    }

    function createHydraulicCylinder(length, outerR, innerR) {
        const hydGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(outerR, outerR, length * 0.5, 16);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = length * 0.25;
        hydGroup.add(base);
        
        const pistonGeo = new THREE.CylinderGeometry(innerR, innerR, length * 0.8, 16);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = length * 0.6;
        piston.name = "piston";
        hydGroup.add(piston);

        // Fittings
        const fittingGeo = new THREE.BoxGeometry(outerR*1.5, outerR*2, outerR*1.5);
        const fit1 = new THREE.Mesh(fittingGeo, copper);
        fit1.position.set(outerR, length*0.1, 0);
        hydGroup.add(fit1);
        const fit2 = new THREE.Mesh(fittingGeo, copper);
        fit2.position.set(outerR, length*0.4, 0);
        hydGroup.add(fit2);

        return hydGroup;
    }

    function createRowUnit() {
        const unitGroup = new THREE.Group();
        
        // Parallel linkage
        const linkGeo = new THREE.BoxGeometry(2, 0.1, 0.3);
        const upperLink = new THREE.Mesh(linkGeo, steel);
        upperLink.position.set(1, 0.5, 0);
        const lowerLink = new THREE.Mesh(linkGeo, steel);
        lowerLink.position.set(1, 0, 0);
        unitGroup.add(upperLink);
        unitGroup.add(lowerLink);

        // Main chassis of row unit
        const chassisShape = new THREE.Shape();
        chassisShape.moveTo(0, 0);
        chassisShape.lineTo(1, 0.5);
        chassisShape.lineTo(1.5, -1);
        chassisShape.lineTo(0.5, -1.5);
        chassisShape.lineTo(-0.5, -0.5);
        chassisShape.lineTo(0, 0);
        const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
        const chassis = new THREE.Mesh(chassisGeo, darkSteel);
        chassis.position.set(2, 0, -0.2);
        unitGroup.add(chassis);

        // Seed Metering box (High-tech)
        const meterGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.5, 32);
        const meter = new THREE.Mesh(meterGeo, aluminum);
        meter.rotation.x = Math.PI/2;
        meter.position.set(2.5, 0.5, 0);
        unitGroup.add(meter);
        
        const meterCoverGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 32);
        const meterCover = new THREE.Mesh(meterCoverGeo, plastic);
        meterCover.rotation.x = Math.PI/2;
        meterCover.position.set(2.5, 0.5, 0.25);
        unitGroup.add(meterCover);

        // Coulter Discs (V-opener)
        const discGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.02, 32);
        const leftDisc = new THREE.Mesh(discGeo, chrome);
        leftDisc.rotation.x = Math.PI/2;
        leftDisc.rotation.y = 0.1; // V angle
        leftDisc.position.set(2.5, -1.2, 0.15);
        leftDisc.name = "coulter_l";
        unitGroup.add(leftDisc);

        const rightDisc = new THREE.Mesh(discGeo, chrome);
        rightDisc.rotation.x = Math.PI/2;
        rightDisc.rotation.y = -0.1; // V angle
        rightDisc.position.set(2.5, -1.2, -0.15);
        rightDisc.name = "coulter_r";
        unitGroup.add(rightDisc);

        // Depth Wheels
        const depthWheelGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32);
        const lDepth = new THREE.Mesh(depthWheelGeo, rubber);
        lDepth.rotation.x = Math.PI/2;
        lDepth.position.set(2.5, -1.2, 0.3);
        lDepth.name = "depth_l";
        unitGroup.add(lDepth);

        const rDepth = new THREE.Mesh(depthWheelGeo, rubber);
        rDepth.rotation.x = Math.PI/2;
        rDepth.position.set(2.5, -1.2, -0.3);
        rDepth.name = "depth_r";
        unitGroup.add(rDepth);

        // Press Wheels (closing wheels at the back)
        const pressArmGeo = new THREE.BoxGeometry(1.2, 0.1, 0.1);
        const pressArm = new THREE.Mesh(pressArmGeo, steel);
        pressArm.position.set(3.5, -0.8, 0);
        unitGroup.add(pressArm);

        const pressWheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32);
        const pressL = new THREE.Mesh(pressWheelGeo, dirtRubber);
        pressL.rotation.x = Math.PI/2;
        pressL.rotation.y = -0.2;
        pressL.position.set(4, -1.2, 0.2);
        pressL.name = "press_l";
        unitGroup.add(pressL);

        const pressR = new THREE.Mesh(pressWheelGeo, dirtRubber);
        pressR.rotation.x = Math.PI/2;
        pressR.rotation.y = 0.2;
        pressR.position.set(4, -1.2, -0.2);
        pressR.name = "press_r";
        unitGroup.add(pressR);

        // Seed delivery tube (Curved)
        class TubeCurve extends THREE.Curve {
            getPoint(t, target = new THREE.Vector3()) {
                const x = 2.5;
                const y = 0.2 - (1.2 * t);
                const z = 0;
                return target.set(x, y, z);
            }
        }
        const tubePath = new TubeCurve();
        const tubeGeo = new THREE.TubeGeometry(tubePath, 20, 0.08, 8, false);
        const seedTube = new THREE.Mesh(tubeGeo, plastic);
        unitGroup.add(seedTube);

        return unitGroup;
    }

    // --- Building the Massive Assembly ---

    // 1. Central Toolbar (The massive spine)
    const centerToolbarGroup = new THREE.Group();
    const mainBeamGeo = new THREE.BoxGeometry(4, 1.5, 10);
    const mainBeam = new THREE.Mesh(mainBeamGeo, darkSteel);
    centerToolbarGroup.add(mainBeam);

    // Add structural ribs to main beam
    for(let z=-4; z<=4; z+=2) {
        const ribGeo = new THREE.BoxGeometry(4.2, 1.7, 0.2);
        const rib = new THREE.Mesh(ribGeo, steel);
        rib.position.z = z;
        centerToolbarGroup.add(rib);
    }
    
    addPart("central_toolbar", centerToolbarGroup, {
        id: "central_toolbar",
        name: "Central Heavy-Duty Toolbar",
        description: "The primary chassis structure supporting hoppers, central transport bogies, and the core hydraulic manifolds. Built from reinforced ultra-high-strength steel.",
        material: "Dark Steel / Structural Steel",
        function: "Structural integrity and load distribution.",
        assemblyOrder: 1,
        connections: ["hitch_assembly", "left_wing_toolbar", "right_wing_toolbar", "central_transport_bogie"],
        failureEffect: "Catastrophic structural collapse, resulting in total machine loss.",
        cascadeFailures: ["left_wing_toolbar", "right_wing_toolbar", "central_transport_bogie"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Hitch Assembly (Connects to tractor)
    const hitchGroup = new THREE.Group();
    const hitchDrawbarGeo = new THREE.BoxGeometry(6, 0.6, 0.8);
    const drawbar = new THREE.Mesh(hitchDrawbarGeo, steel);
    drawbar.position.set(-5, 0, 0);
    hitchGroup.add(drawbar);
    
    const hitchRingGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const hitchRing = new THREE.Mesh(hitchRingGeo, chrome);
    hitchRing.rotation.x = Math.PI/2;
    hitchRing.position.set(-8, 0, 0);
    hitchGroup.add(hitchRing);

    const ptoShaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 16);
    const ptoShaft = new THREE.Mesh(ptoShaftGeo, matteBlack);
    ptoShaft.rotation.z = Math.PI/2;
    ptoShaft.position.set(-5, 0.5, 0);
    hitchGroup.add(ptoShaft);

    centerToolbarGroup.add(hitchGroup); // Attached to center
    addPart("hitch_assembly", hitchGroup, {
        id: "hitch_assembly",
        name: "Articulating Hitch & PTO Drive",
        description: "Connects the drill to the tractor drawbar and transmits PTO power for the pneumatic blower.",
        material: "Steel / Chrome",
        function: "Towing articulation and power transmission.",
        assemblyOrder: 2,
        connections: ["central_toolbar", "pto_pump_generator"],
        failureEffect: "Detachment from tractor, loss of pneumatic power.",
        cascadeFailures: ["pneumatic_blower_fan", "smart_distributor_manifold"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: -10, y: 5, z: 0 }
    });

    // 3. Central Transport Bogie
    const centerBogieGroup = new THREE.Group();
    const bogieAxleGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const centerAxle = new THREE.Mesh(bogieAxleGeo, steel);
    centerAxle.rotation.x = Math.PI/2;
    centerBogieGroup.add(centerAxle);

    const wheelL = createTireAndRim(1.8, 1.2, 0.15);
    wheelL.position.set(0, 0, 3.5);
    centerBogieGroup.add(wheelL);
    
    const wheelR = createTireAndRim(1.8, 1.2, 0.15);
    wheelR.position.set(0, 0, -3.5);
    centerBogieGroup.add(wheelR);

    // Lift hydraulics for center bogie
    const liftHydL = createHydraulicCylinder(2, 0.3, 0.15);
    liftHydL.position.set(1, 1, 3);
    liftHydL.rotation.z = -Math.PI/4;
    centerBogieGroup.add(liftHydL);

    const liftHydR = createHydraulicCylinder(2, 0.3, 0.15);
    liftHydR.position.set(1, 1, -3);
    liftHydR.rotation.z = -Math.PI/4;
    centerBogieGroup.add(liftHydR);

    centerBogieGroup.position.set(0, -2.5, 0);
    centerToolbarGroup.add(centerBogieGroup);

    addPart("central_transport_bogie", centerBogieGroup, {
        id: "central_transport_bogie",
        name: "Central Transport Bogie",
        description: "Massive dual-wheel transport assembly to support the heavy central weight of seed and fertilizer.",
        material: "Rubber / Steel / Chrome",
        function: "Supports main weight during transport and controls planting depth frame height.",
        assemblyOrder: 3,
        connections: ["central_toolbar"],
        failureEffect: "Center section drops, damaging row units and preventing transport.",
        cascadeFailures: ["row_units_array_center"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 4. Folding Left & Right Wings
    const leftWingGroup = new THREE.Group();
    const rightWingGroup = new THREE.Group();
    
    const wingBeamGeo = new THREE.BoxGeometry(3, 1.2, 12);
    const leftWingBeam = new THREE.Mesh(wingBeamGeo, darkSteel);
    leftWingBeam.position.set(0, 0, 6);
    leftWingGroup.add(leftWingBeam);
    
    const rightWingBeam = new THREE.Mesh(wingBeamGeo, darkSteel);
    rightWingBeam.position.set(0, 0, -6);
    rightWingGroup.add(rightWingBeam);

    // Wing fold hinges and hydraulics
    const hingeGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const leftHinge = new THREE.Mesh(hingeGeo, steel);
    leftHinge.rotation.x = Math.PI/2;
    leftWingGroup.add(leftHinge);

    const rightHinge = new THREE.Mesh(hingeGeo, steel);
    rightHinge.rotation.x = Math.PI/2;
    rightWingGroup.add(rightHinge);

    leftWingGroup.position.set(0, 5, 5);
    rightWingGroup.position.set(0, 5, -5);
    group.add(leftWingGroup);
    group.add(rightWingGroup);

    addPart("left_wing_toolbar", leftWingGroup, {
        id: "left_wing_toolbar",
        name: "Left Folding Wing Toolbar",
        description: "Extends to support left-side row units. Features complex hydraulic fold mechanics.",
        material: "Dark Steel",
        function: "Increases planting width and folds for transport.",
        assemblyOrder: 4,
        connections: ["central_toolbar", "left_transport_bogie"],
        failureEffect: "Inability to plant on the left side or fold for road transport.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 5 },
        explodedPosition: { x: 0, y: 5, z: 20 }
    });

    addPart("right_wing_toolbar", rightWingGroup, {
        id: "right_wing_toolbar",
        name: "Right Folding Wing Toolbar",
        description: "Extends to support right-side row units. Features complex hydraulic fold mechanics.",
        material: "Dark Steel",
        function: "Increases planting width and folds for transport.",
        assemblyOrder: 5,
        connections: ["central_toolbar", "right_transport_bogie"],
        failureEffect: "Inability to plant on the right side or fold for road transport.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: -5 },
        explodedPosition: { x: 0, y: 5, z: -20 }
    });

    // 5 & 6. Wing Transport Bogies
    const leftWingBogie = new THREE.Group();
    const rightWingBogie = new THREE.Group();
    
    const wingWheel = createTireAndRim(1.2, 0.8, 0.1);
    wingWheel.position.set(0, -2, 6);
    leftWingBogie.add(wingWheel.clone());
    
    const wingWheelR = createTireAndRim(1.2, 0.8, 0.1);
    wingWheelR.position.set(0, -2, -6);
    rightWingBogie.add(wingWheelR.clone());

    leftWingGroup.add(leftWingBogie);
    rightWingGroup.add(rightWingBogie);

    addPart("left_transport_bogie", leftWingBogie, {
        id: "left_transport_bogie",
        name: "Left Wing Transport Bogie",
        description: "Support wheel for the left wing extension.",
        material: "Rubber / Steel",
        function: "Maintains wing level and depth during field operation.",
        assemblyOrder: 6,
        connections: ["left_wing_toolbar"],
        failureEffect: "Left wing sags, digging row units into the ground.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    addPart("right_transport_bogie", rightWingBogie, {
        id: "right_transport_bogie",
        name: "Right Wing Transport Bogie",
        description: "Support wheel for the right wing extension.",
        material: "Rubber / Steel",
        function: "Maintains wing level and depth during field operation.",
        assemblyOrder: 7,
        connections: ["right_wing_toolbar"],
        failureEffect: "Right wing sags, digging row units into the ground.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 7 & 8. Bulk Hoppers (Massive Lathe Geometries)
    const hopperGroupL = new THREE.Group();
    const hopperGroupR = new THREE.Group();

    const hopperPoints = [];
    hopperPoints.push(new THREE.Vector2(0, 0));
    hopperPoints.push(new THREE.Vector2(0.5, 0.5));
    hopperPoints.push(new THREE.Vector2(2, 2));
    hopperPoints.push(new THREE.Vector2(2.5, 5));
    hopperPoints.push(new THREE.Vector2(2.5, 7));
    hopperPoints.push(new THREE.Vector2(2, 7.5));
    hopperPoints.push(new THREE.Vector2(0, 7.5));
    const hopperGeo = new THREE.LatheGeometry(hopperPoints, 32);
    
    const hopperL = new THREE.Mesh(hopperGeo, hopperWhite);
    hopperL.position.set(0, 2, 2.5);
    hopperGroupL.add(hopperL);
    
    // Add lid
    const lidGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.2, 32);
    const lidL = new THREE.Mesh(lidGeo, plastic);
    lidL.position.set(0, 9.6, 2.5);
    hopperGroupL.add(lidL);

    const hopperR = new THREE.Mesh(hopperGeo, hopperWhite);
    hopperR.position.set(0, 2, -2.5);
    hopperGroupR.add(hopperR);
    
    const lidR = new THREE.Mesh(lidGeo, plastic);
    lidR.position.set(0, 9.6, -2.5);
    hopperGroupR.add(lidR);

    centerToolbarGroup.add(hopperGroupL);
    centerToolbarGroup.add(hopperGroupR);

    addPart("bulk_seed_hopper_left", hopperGroupL, {
        id: "bulk_seed_hopper_left",
        name: "Left Bulk Seed Hopper",
        description: "High-capacity centralized seed holding tank with gravity and pneumatic assist.",
        material: "Molded Polymer",
        function: "Stores seed and feeds the pneumatic distribution system.",
        assemblyOrder: 8,
        connections: ["central_toolbar", "pneumatic_blower_fan"],
        failureEffect: "Seed starvation to left half of the planter.",
        cascadeFailures: ["smart_distributor_manifold"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 15, z: 5 }
    });

    addPart("bulk_seed_hopper_right", hopperGroupR, {
        id: "bulk_seed_hopper_right",
        name: "Right Bulk Seed Hopper",
        description: "High-capacity centralized seed holding tank with gravity and pneumatic assist.",
        material: "Molded Polymer",
        function: "Stores seed and feeds the pneumatic distribution system.",
        assemblyOrder: 9,
        connections: ["central_toolbar", "pneumatic_blower_fan"],
        failureEffect: "Seed starvation to right half of the planter.",
        cascadeFailures: ["smart_distributor_manifold"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 15, z: -5 }
    });

    // 9. Pneumatic Blower Fan & PTO Pump Generator
    const blowerGroup = new THREE.Group();
    const fanHousingGeo = new THREE.TorusGeometry(1, 0.5, 32, 64);
    const fanHousing = new THREE.Mesh(fanHousingGeo, aluminum);
    fanHousing.rotation.x = Math.PI/2;
    blowerGroup.add(fanHousing);

    const fanIntakeGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const fanIntake = new THREE.Mesh(fanIntakeGeo, chrome);
    fanIntake.position.y = 0.5;
    blowerGroup.add(fanIntake);

    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const motor = new THREE.Mesh(motorGeo, darkSteel);
    motor.rotation.x = Math.PI/2;
    motor.position.set(0, -0.6, 0);
    blowerGroup.add(motor);
    
    blowerGroup.position.set(-2.5, 2, 0);
    centerToolbarGroup.add(blowerGroup);

    addPart("pneumatic_blower_fan", blowerGroup, {
        id: "pneumatic_blower_fan",
        name: "High-Velocity Pneumatic Blower",
        description: "Generates massive air pressure to fluidize and deliver seed from bulk hoppers to individual row units.",
        material: "Aluminum / Steel",
        function: "Airflow generation for seed delivery.",
        assemblyOrder: 10,
        connections: ["central_toolbar", "bulk_seed_hopper_left", "bulk_seed_hopper_right", "smart_distributor_manifold"],
        failureEffect: "Complete failure of seed delivery system.",
        cascadeFailures: ["row_units_array"],
        originalPosition: { x: -2.5, y: 7, z: 0 },
        explodedPosition: { x: -8, y: 12, z: 0 }
    });

    // 10. Liquid Fertilizer Tank
    const fertTankGroup = new THREE.Group();
    const fertGeo = new THREE.CapsuleGeometry(1.5, 4, 32, 64);
    const fertTank = new THREE.Mesh(fertGeo, tankBlue);
    fertTank.rotation.x = Math.PI/2;
    fertTankGroup.add(fertTank);
    
    // Support straps
    const strapGeo = new THREE.TorusGeometry(1.52, 0.05, 16, 64);
    const strap1 = new THREE.Mesh(strapGeo, steel);
    strap1.position.z = 1.5;
    const strap2 = new THREE.Mesh(strapGeo, steel);
    strap2.position.z = -1.5;
    fertTankGroup.add(strap1);
    fertTankGroup.add(strap2);

    fertTankGroup.position.set(2, 3.5, 0);
    centerToolbarGroup.add(fertTankGroup);

    addPart("liquid_fertilizer_tank", fertTankGroup, {
        id: "liquid_fertilizer_tank",
        name: "Liquid Fertilizer Translucent Tank",
        description: "Holds high-density liquid starter fertilizer injected in-furrow.",
        material: "Translucent Polycarbonate",
        function: "Liquid storage and dispensing.",
        assemblyOrder: 11,
        connections: ["central_toolbar", "smart_distributor_manifold"],
        failureEffect: "Loss of in-furrow fertilizer capability.",
        cascadeFailures: [],
        originalPosition: { x: 2, y: 8.5, z: 0 },
        explodedPosition: { x: 5, y: 15, z: 0 }
    });

    // 11. Smart Distributor Manifold
    const manifoldGroup = new THREE.Group();
    const blockGeo = new THREE.BoxGeometry(1, 1.5, 4);
    const manifoldBlock = new THREE.Mesh(blockGeo, aluminum);
    manifoldGroup.add(manifoldBlock);

    // Glowing electronic valves
    const valveGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
    for(let z=-1.5; z<=1.5; z+=0.5) {
        const valve = new THREE.Mesh(valveGeo, neonCyan);
        valve.position.set(0.6, 0, z);
        valve.rotation.z = Math.PI/2;
        manifoldGroup.add(valve);
    }

    manifoldGroup.position.set(-1.5, 3.5, 0);
    centerToolbarGroup.add(manifoldGroup);

    addPart("smart_distributor_manifold", manifoldGroup, {
        id: "smart_distributor_manifold",
        name: "Smart Distributor & Valve Manifold",
        description: "Electronically controlled valving system regulating seed air pressure and liquid fertilizer flow.",
        material: "Aluminum / Electronic Components",
        function: "Variable rate control and section shutoff.",
        assemblyOrder: 12,
        connections: ["pneumatic_blower_fan", "liquid_fertilizer_tank", "gps_rtk_receiver"],
        failureEffect: "Inconsistent seed/fertilizer rates, inability to perform section control.",
        cascadeFailures: [],
        originalPosition: { x: -1.5, y: 8.5, z: 0 },
        explodedPosition: { x: -1.5, y: 12, z: -5 }
    });

    // 12. GPS RTK Receiver & Neon Status Lights
    const techGroup = new THREE.Group();
    const domeGeo = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, hopperWhite);
    techGroup.add(dome);
    
    const baseDomeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const baseDome = new THREE.Mesh(baseDomeGeo, plastic);
    baseDome.position.y = -0.05;
    techGroup.add(baseDome);

    const statusRingGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
    const statusRing = new THREE.Mesh(statusRingGeo, neonOrange);
    statusRing.rotation.x = Math.PI/2;
    statusRing.position.y = 0.05;
    techGroup.add(statusRing);

    techGroup.position.set(0, 10.5, 0);
    centerToolbarGroup.add(techGroup);

    addPart("gps_rtk_receiver", techGroup, {
        id: "gps_rtk_receiver",
        name: "RTK GPS Receiver Array",
        description: "Provides sub-inch accuracy positioning for section control, variable rate mapping, and auto-steer feedback.",
        material: "Polycarbonate / Electronics",
        function: "Spatial positioning and telemetry.",
        assemblyOrder: 13,
        connections: ["smart_distributor_manifold"],
        failureEffect: "Loss of precision mapping and automated section control.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15.5, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // 13, 14, 15. The Massive Array of Row Units (24 Rows total)
    const rowUnitsCenterGroup = new THREE.Group();
    const rowUnitsLeftGroup = new THREE.Group();
    const rowUnitsRightGroup = new THREE.Group();
    
    const rowSpacing = 0.8; 
    
    // 8 units center
    for(let i=0; i<8; i++) {
        const unit = createRowUnit();
        unit.position.set(1.5, -2, -2.8 + i*rowSpacing);
        rowUnitsCenterGroup.add(unit);
    }
    
    // 8 units left wing
    for(let i=0; i<8; i++) {
        const unit = createRowUnit();
        unit.position.set(1.5, -2, 0.4 + i*rowSpacing);
        rowUnitsLeftGroup.add(unit);
    }
    
    // 8 units right wing
    for(let i=0; i<8; i++) {
        const unit = createRowUnit();
        unit.position.set(1.5, -2, -6 + i*rowSpacing);
        rowUnitsRightGroup.add(unit);
    }

    centerToolbarGroup.add(rowUnitsCenterGroup);
    leftWingGroup.add(rowUnitsLeftGroup);
    rightWingGroup.add(rowUnitsRightGroup);

    addPart("row_units_array_center", rowUnitsCenterGroup, {
        id: "row_units_array_center",
        name: "Center Row Unit Array (8 Rows)",
        description: "The core precision planting mechanisms. Includes coulters, depth wheels, seed meters, and press wheels.",
        material: "Steel / Cast Iron / Plastic",
        function: "Opens trench, singulates seed, drops seed, and closes trench perfectly.",
        assemblyOrder: 14,
        connections: ["central_toolbar"],
        failureEffect: "Seed is not planted correctly in the center section.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 0 }
    });

    addPart("row_units_array_left", rowUnitsLeftGroup, {
        id: "row_units_array_left",
        name: "Left Wing Row Unit Array (8 Rows)",
        description: "The core precision planting mechanisms for the left wing.",
        material: "Steel / Cast Iron / Plastic",
        function: "Opens trench, singulates seed, drops seed, and closes trench perfectly.",
        assemblyOrder: 15,
        connections: ["left_wing_toolbar"],
        failureEffect: "Seed is not planted correctly on the left wing.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 5 }
    });

    addPart("row_units_array_right", rowUnitsRightGroup, {
        id: "row_units_array_right",
        name: "Right Wing Row Unit Array (8 Rows)",
        description: "The core precision planting mechanisms for the right wing.",
        material: "Steel / Cast Iron / Plastic",
        function: "Opens trench, singulates seed, drops seed, and closes trench perfectly.",
        assemblyOrder: 16,
        connections: ["right_wing_toolbar"],
        failureEffect: "Seed is not planted correctly on the right wing.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: -5 }
    });

    // Add everything to the root group
    group.add(centerToolbarGroup);

    // --- Complex Animation Loop ---
    const animate = (time, speed, meshesObj) => {
        const t = time * speed;
        
        // 1. Tractor forward movement causes all transport wheels and depth wheels to rotate
        const wheelRotSpeed = t * 2;
        
        // Find all objects with name containing 'coulter', 'depth', 'press' inside row units
        const rotateWheels = (targetGroup) => {
            targetGroup.traverse((child) => {
                if (child.name && (child.name.includes("coulter") || child.name.includes("depth") || child.name.includes("press"))) {
                    child.rotation.y = child.name.endsWith("_l") ? 0.1 - wheelRotSpeed : -0.1 - wheelRotSpeed; 
                    if(child.name.includes("press")) {
                       child.rotation.y = child.name.endsWith("_l") ? -0.2 - wheelRotSpeed : 0.2 - wheelRotSpeed;
                    }
                    if(child.name.includes("depth") || child.name.includes("coulter")) {
                       child.rotation.y = -wheelRotSpeed; // Simplified for pure rotation around local Y
                    }
                }
            });
        };
        rotateWheels(rowUnitsCenterGroup);
        rotateWheels(rowUnitsLeftGroup);
        rotateWheels(rowUnitsRightGroup);

        // Rotate main transport bogie wheels
        centerBogieGroup.children.forEach(child => {
            if(child.type === 'Group') child.rotation.y = -wheelRotSpeed;
        });
        leftWingBogie.children.forEach(child => {
            if(child.type === 'Group') child.rotation.y = -wheelRotSpeed;
        });
        rightWingBogie.children.forEach(child => {
            if(child.type === 'Group') child.rotation.y = -wheelRotSpeed;
        });

        // 2. High-speed pneumatic fan rotation
        const fanMesh = blowerGroup.children[0];
        if (fanMesh) {
            fanMesh.rotation.z = t * 15; // spins very fast
        }

        // 3. PTO Shaft spinning
        ptoShaft.rotation.x = t * 5;

        // 4. Hydraulic deployment sequence (sine wave for demonstration of fold/unfold)
        // Simulate folding wings up for transport
        const foldCycle = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1
        
        // Fold wings up to 90 degrees (Math.PI/2)
        const wingAngle = foldCycle * (Math.PI / 2.2);
        leftWingGroup.rotation.x = wingAngle;
        rightWingGroup.rotation.x = -wingAngle;

        // 5. Pulsing neon lights on manifold
        const pulse = (Math.sin(t * 5) + 1) / 2;
        neonCyan.emissiveIntensity = 0.5 + pulse * 2;
        neonOrange.emissiveIntensity = 1 + Math.sin(t * 2) * 0.5;
    };

    const description = "Ultra High-Tech Precision Seed Drill and Planter Mechanism. Features a massive central chassis, hydraulically folding wing toolbars, centralized bulk seed hoppers, a high-velocity pneumatic delivery blower, liquid fertilizer tanks, smart distributor manifolds with glowing electronic valves, RTK GPS telemetry, and 24 highly detailed row units. Each row unit includes parallel linkages, V-opener coulter discs, depth regulating wheels, advanced seed metering boxes, and closing press wheels. Fully animated with complex hierarchical wheel rotations, fan spinning, PTO drives, and wing folding sequences.";

    const quizQuestions = [
        {
            question: "What is the primary function of the pneumatic blower fan on this precision planter?",
            options: [
                "To cool the hydraulic system",
                "To blow away debris from the soil",
                "To generate massive air pressure to fluidize and deliver seed from bulk hoppers to row units",
                "To inflate the massive transport tires"
            ],
            correctAnswer: 2,
            explanation: "The high-velocity pneumatic blower creates the necessary air pressure to move seeds from the central bulk hoppers through delivery tubes down to the individual row unit meters."
        },
        {
            question: "How do the V-opener coulter discs and depth wheels work together on the row unit?",
            options: [
                "They steer the machine in the field",
                "Coulters cut the trench while depth wheels limit how deep the coulters can penetrate",
                "They crush rocks in front of the seed tube",
                "They apply the liquid fertilizer"
            ],
            correctAnswer: 1,
            explanation: "The coulter discs slice into the soil to create a V-shaped seed trench. The depth wheels sit alongside them, riding on the soil surface to precisely control the depth of that trench."
        },
        {
            question: "What is the consequence of a failure in the smart distributor manifold?",
            options: [
                "The wings will immediately fold up",
                "The tractor will detach from the hitch",
                "Inconsistent seed and fertilizer rates, and the inability to perform section control",
                "The transport bogies will sink into the mud"
            ],
            correctAnswer: 2,
            explanation: "The smart manifold regulates the electronic valves for air pressure and liquid flow. A failure here ruins the precision variable rate control and section shutoff capabilities."
        },
        {
            question: "Why does the machine utilize massive central and wing transport bogies?",
            options: [
                "To look intimidating",
                "To support the extreme weight of bulk seed and fertilizer, and to control the main frame height",
                "To harvest the crop while planting",
                "To power the PTO shaft"
            ],
            correctAnswer: 1,
            explanation: "The planter carries immense weight in its bulk seed and liquid fertilizer tanks. Large dual-wheel bogies distribute this load to prevent soil compaction and maintain the chassis level."
        },
        {
            question: "What role does the RTK GPS receiver play on the planter?",
            options: [
                "It provides sub-inch accuracy positioning for section control and variable rate mapping",
                "It plays satellite radio for the operator",
                "It acts as a lightning rod",
                "It measures soil moisture levels from space"
            ],
            correctAnswer: 0,
            explanation: "RTK (Real-Time Kinematic) GPS provides extreme precision, allowing the planter's software to map exactly where seeds are placed and shut off specific row units to avoid overlapping."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSeedDrillPlanterMechanism() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
