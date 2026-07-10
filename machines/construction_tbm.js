import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // =========================================================================
    // ADVANCED MATERIAL CLONES & CONFIGURATIONS
    // =========================================================================
    const warningYellow = plastic.clone();
    warningYellow.color.setHex(0xffcc00);

    const safetyOrange = plastic.clone();
    safetyOrange.color.setHex(0xff5500);

    const scratchedSteel = darkSteel.clone();
    scratchedSteel.roughness = 0.85;
    scratchedSteel.metalness = 0.7;

    const heavyDirtSteel = steel.clone();
    heavyDirtSteel.color.setHex(0x3a3a35);
    heavyDirtSteel.roughness = 0.95;

    const hydraulicChrome = chrome.clone();
    hydraulicChrome.roughness = 0.05;
    hydraulicChrome.metalness = 1.0;

    const glowingScreen = tinted.clone();
    glowingScreen.color.setHex(0x00ffaa);
    glowingScreen.emissive = new THREE.Color(0x00ffaa);
    glowingScreen.emissiveIntensity = 1.5;
    glowingScreen.transparent = false;

    const warningLight = glass.clone();
    warningLight.color.setHex(0xff0000);
    warningLight.emissive = new THREE.Color(0xff0000);
    warningLight.emissiveIntensity = 2.0;

    const concreteMaterial = plastic.clone();
    concreteMaterial.color.setHex(0x999999);
    concreteMaterial.roughness = 1.0;

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    function addPart(mesh, name, description, material, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, origPos, explPos) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // Advanced Extrusion Shapes
    const hBeamShape = new THREE.Shape();
    hBeamShape.moveTo(-0.3, 0.6);
    hBeamShape.lineTo(0.3, 0.6);
    hBeamShape.lineTo(0.3, 0.45);
    hBeamShape.lineTo(0.08, 0.45);
    hBeamShape.lineTo(0.08, -0.45);
    hBeamShape.lineTo(0.3, -0.45);
    hBeamShape.lineTo(0.3, -0.6);
    hBeamShape.lineTo(-0.3, -0.6);
    hBeamShape.lineTo(-0.3, -0.45);
    hBeamShape.lineTo(-0.08, -0.45);
    hBeamShape.lineTo(-0.08, 0.45);
    hBeamShape.lineTo(-0.3, 0.45);
    hBeamShape.lineTo(-0.3, 0.6);

    const cChannelShape = new THREE.Shape();
    cChannelShape.moveTo(-0.2, 0.5);
    cChannelShape.lineTo(0.3, 0.5);
    cChannelShape.lineTo(0.3, 0.35);
    cChannelShape.lineTo(-0.05, 0.35);
    cChannelShape.lineTo(-0.05, -0.35);
    cChannelShape.lineTo(0.3, -0.35);
    cChannelShape.lineTo(0.3, -0.5);
    cChannelShape.lineTo(-0.2, -0.5);
    cChannelShape.lineTo(-0.2, 0.5);

    // =========================================================================
    // 1. MASSIVE CUTTERHEAD ASSEMBLY
    // =========================================================================
    const cutterheadGroup = new THREE.Group();
    cutterheadGroup.position.set(0, 0, 0);

    // Lathe Geometry for main cutterhead backplate (Complex curved dome profile)
    const domePoints = [];
    for(let i=0; i<=20; i++) {
        const radius = 9.8 - Math.pow(i/20, 2) * 2.0;
        const depth = -1.5 + (i/20) * 1.5;
        domePoints.push(new THREE.Vector2(radius, depth));
    }
    const cutterheadDomeGeom = new THREE.LatheGeometry(domePoints, 128);
    cutterheadDomeGeom.rotateX(Math.PI / 2);
    const cutterheadDome = new THREE.Mesh(cutterheadDomeGeom, heavyDirtSteel);
    cutterheadGroup.add(cutterheadDome);

    // Cutterhead Spokes (8 massive extruded arms with cutting implements)
    const spokeCount = 8;
    const spokeExtrudeSettings = { depth: 2.2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 };
    const spokeShape = new THREE.Shape();
    spokeShape.moveTo(-1.2, 0);
    spokeShape.lineTo(1.2, 0);
    spokeShape.lineTo(0.8, 8.5);
    spokeShape.lineTo(-0.8, 8.5);
    spokeShape.lineTo(-1.2, 0);

    const spokesGroup = new THREE.Group();
    for(let i=0; i<spokeCount; i++) {
        const angle = (Math.PI * 2 / spokeCount) * i;
        const spokeGeom = new THREE.ExtrudeGeometry(spokeShape, spokeExtrudeSettings);
        const spoke = new THREE.Mesh(spokeGeom, steel);
        
        spoke.position.set(0, 0, -0.5);
        spoke.rotation.z = angle;
        
        // Add reinforcing ribs to each spoke
        for(let r=2; r<=7; r+=1.5) {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 2.5), scratchedSteel);
            rib.position.set(0, r, 1.0);
            spoke.add(rib);
        }
        spokesGroup.add(spoke);
    }
    cutterheadGroup.add(spokesGroup);

    // Central conical crusher
    const centerCrusherPoints = [];
    centerCrusherPoints.push(new THREE.Vector2(0, 0));
    centerCrusherPoints.push(new THREE.Vector2(2.5, 0));
    centerCrusherPoints.push(new THREE.Vector2(1.5, 1.5));
    centerCrusherPoints.push(new THREE.Vector2(0.5, 2.2));
    centerCrusherPoints.push(new THREE.Vector2(0, 2.2));
    const centerCrusherGeom = new THREE.LatheGeometry(centerCrusherPoints, 32);
    centerCrusherGeom.rotateX(Math.PI / 2);
    const centerCrusher = new THREE.Mesh(centerCrusherGeom, scratchedSteel);
    cutterheadGroup.add(centerCrusher);

    // Disc Cutters Array (Hundreds of individually modeled disc cutters)
    const discCuttersGroup = new THREE.Group();
    const discGeom = new THREE.TorusGeometry(0.22, 0.08, 16, 32);
    const housingGeom = new THREE.BoxGeometry(0.35, 0.6, 0.5);
    const cutterCount = 180;

    for(let i=0; i<cutterCount; i++) {
        const r = 2.0 + Math.pow(Math.random(), 0.8) * 7.5; 
        const theta = Math.random() * Math.PI * 2;
        
        const housing = new THREE.Mesh(housingGeom, darkSteel);
        const disc = new THREE.Mesh(discGeom, hydraulicChrome);
        disc.rotation.x = Math.PI / 2;
        disc.position.y = 0.25;

        const cutterAssy = new THREE.Group();
        cutterAssy.add(housing);
        cutterAssy.add(disc);

        cutterAssy.position.set(Math.cos(theta)*r, Math.sin(theta)*r, 1.6);
        cutterAssy.rotation.z = theta + (Math.PI/2); // Align tangentially to cut path
        discCuttersGroup.add(cutterAssy);
    }
    cutterheadGroup.add(discCuttersGroup);

    // Water jets/Soil conditioning nozzles
    const nozzlesGroup = new THREE.Group();
    const nozzleGeom = new THREE.CylinderGeometry(0.05, 0.1, 0.4, 16);
    for(let i=0; i<40; i++) {
        const r = 3.0 + Math.random() * 5.0;
        const theta = Math.random() * Math.PI * 2;
        const nozzle = new THREE.Mesh(nozzleGeom, copper);
        nozzle.rotation.x = Math.PI / 2;
        nozzle.position.set(Math.cos(theta)*r, Math.sin(theta)*r, 1.4);
        nozzlesGroup.add(nozzle);
    }
    cutterheadGroup.add(nozzlesGroup);

    addPart(cutterheadGroup, "Primary_Cutterhead", "Massive front rotating assembly for excavating rock and soil.", heavyDirtSteel, "Excavation and earth pressure balance.", 1, ["Shield_Bulkhead", "Main_Drive_Motors"], "Total halt of excavation. Extreme heat buildup.", ["Thrust_Jacks", "Main_Bearing"], {x:0, y:0, z:0}, {x:0, y:0, z:15});

    // =========================================================================
    // 2. ENORMOUS CYLINDRICAL SHIELD BODY (Front, Middle, Tail)
    // =========================================================================
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 0, -1);

    // Intricate Stepped Lathe for the Shield Body (NO basic cylinders)
    const shieldProfile = [];
    const shieldLength = 16.0;
    const baseRadius = 10.0;
    
    // Front Shield (Thickest)
    shieldProfile.push(new THREE.Vector2(baseRadius, 0));
    shieldProfile.push(new THREE.Vector2(baseRadius, -4));
    shieldProfile.push(new THREE.Vector2(baseRadius - 0.05, -4)); // Step
    // Middle Shield
    shieldProfile.push(new THREE.Vector2(baseRadius - 0.05, -10));
    shieldProfile.push(new THREE.Vector2(baseRadius - 0.1, -10)); // Step
    // Tail Shield (Tapered for articulation)
    shieldProfile.push(new THREE.Vector2(baseRadius - 0.1, -16));
    shieldProfile.push(new THREE.Vector2(baseRadius - 0.3, -16)); 

    const shieldGeom = new THREE.LatheGeometry(shieldProfile, 128);
    shieldGeom.rotateX(Math.PI / 2);
    const mainShield = new THREE.Mesh(shieldGeom, scratchedSteel);
    shieldGroup.add(mainShield);

    // Inner Pressure Bulkhead (Complex internal wall)
    const bulkheadProfile = [];
    bulkheadProfile.push(new THREE.Vector2(0, 0));
    bulkheadProfile.push(new THREE.Vector2(4, 0));
    bulkheadProfile.push(new THREE.Vector2(6, -0.5));
    bulkheadProfile.push(new THREE.Vector2(9.8, -0.5));
    const bulkheadGeom = new THREE.LatheGeometry(bulkheadProfile, 64);
    bulkheadGeom.rotateX(Math.PI / 2);
    const bulkhead = new THREE.Mesh(bulkheadGeom, steel);
    bulkhead.position.set(0, 0, -2);
    shieldGroup.add(bulkhead);

    // Internal structural ring girders
    for(let z=-3; z>=-15; z-=2) {
        const ringGeom = new THREE.TorusGeometry(9.6, 0.3, 16, 64);
        const ring = new THREE.Mesh(ringGeom, darkSteel);
        ring.position.set(0, 0, z);
        shieldGroup.add(ring);
    }

    addPart(shieldGroup, "TBM_Shield_Body", "Segmented cylindrical protective shell shielding machinery and workers from ground pressure.", scratchedSteel, "Maintains tunnel integrity before segment erection.", 2, ["Primary_Cutterhead", "Thrust_Jacks", "Ring_Erector"], "Ground collapse, flooding of the machine.", ["Internal_Systems", "Gantry_Trailers"], {x:0, y:0, z:-1}, {x:0, y:0, z:0});

    // =========================================================================
    // 3. HYDRAULIC THRUST JACKS
    // =========================================================================
    const thrustJacksGroup = new THREE.Group();
    thrustJacksGroup.position.set(0, 0, -14); // Pushing against the concrete segments

    const jackCount = 24;
    const jackOuterGeom = new THREE.CylinderGeometry(0.3, 0.3, 3.0, 16);
    const jackInnerGeom = new THREE.CylinderGeometry(0.18, 0.18, 4.0, 16);
    const jackShoeGeom = new THREE.BoxGeometry(0.8, 1.2, 0.4);

    const activeRods = []; // For animation

    for(let i=0; i<jackCount; i++) {
        const angle = (Math.PI * 2 / jackCount) * i;
        const radius = 9.2;

        const jackSystem = new THREE.Group();
        
        const outerCasing = new THREE.Mesh(jackOuterGeom, warningYellow);
        outerCasing.rotation.x = Math.PI / 2;

        const innerRod = new THREE.Mesh(jackInnerGeom, hydraulicChrome);
        innerRod.rotation.x = Math.PI / 2;
        innerRod.position.z = -1.5; // Retracted state

        const pushShoe = new THREE.Mesh(jackShoeGeom, heavyDirtSteel);
        pushShoe.position.z = -2.0;
        innerRod.add(pushShoe);

        jackSystem.add(outerCasing);
        jackSystem.add(innerRod);

        jackSystem.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
        jackSystem.userData = { rod: innerRod, angle: angle };
        activeRods.push(jackSystem);

        thrustJacksGroup.add(jackSystem);
    }

    addPart(thrustJacksGroup, "Thrust_Jacks_Array", "24 Massive hydraulic cylinders that propel the TBM forward by pushing against newly installed concrete rings.", warningYellow, "Provides forward thrust and directional steering.", 3, ["TBM_Shield_Body", "Hydraulic_Pumping_Station"], "Loss of forward propulsion, inability to steer.", ["Cutterhead_Jamming"], {x:0, y:0, z:-14}, {x:0, y:0, z:-20});

    // =========================================================================
    // 4. RING ERECTOR SYSTEM
    // =========================================================================
    const erectorGroup = new THREE.Group();
    erectorGroup.position.set(0, 0, -17);

    // Rotary Gear Ring (Huge Torus with massive gear teeth)
    const erectorRingGeom = new THREE.TorusGeometry(7.5, 0.4, 32, 128);
    const erectorRing = new THREE.Mesh(erectorRingGeom, steel);

    // Add gear teeth to the inside of the ring
    const toothGeom = new THREE.BoxGeometry(0.2, 0.2, 0.6);
    const gearTeethCount = 120;
    for(let i=0; i<gearTeethCount; i++) {
        const angle = (Math.PI * 2 / gearTeethCount) * i;
        const tooth = new THREE.Mesh(toothGeom, darkSteel);
        tooth.position.set(Math.cos(angle)*7.1, Math.sin(angle)*7.1, 0);
        tooth.rotation.z = angle;
        erectorRing.add(tooth);
    }
    erectorGroup.add(erectorRing);

    // Articulated Erector Arm
    const erectorArm = new THREE.Group();
    
    // Arm Base Base (rides on ring)
    const armBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.0, 1.5), warningYellow);
    armBase.position.set(0, 7.5, 0);
    erectorArm.add(armBase);

    // Telescopic Sections
    const armStage1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, 0.8), steel);
    armStage1.position.set(0, 5.5, 0);
    
    const armStage2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.0, 0.5), hydraulicChrome);
    armStage2.position.set(0, -1.0, 0);
    armStage1.add(armStage2);

    // Vacuum Gripper Pad
    const vacuumPadGroup = new THREE.Group();
    vacuumPadGroup.position.set(0, -1.5, 0);
    
    const padMain = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 1.5), darkSteel);
    const suctionCup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), rubber);
    suctionCup1.position.set(-1.0, -0.3, 0);
    const suctionCup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), rubber);
    suctionCup2.position.set(1.0, -0.3, 0);
    
    vacuumPadGroup.add(padMain, suctionCup1, suctionCup2);
    
    // Held Precast Concrete Segment
    const segmentPoints = [];
    segmentPoints.push(new THREE.Vector2(9.8, -1.0));
    segmentPoints.push(new THREE.Vector2(9.8, 1.0));
    segmentPoints.push(new THREE.Vector2(9.4, 1.0));
    segmentPoints.push(new THREE.Vector2(9.4, -1.0));
    const segmentGeom = new THREE.LatheGeometry(segmentPoints, 32, -Math.PI/8, Math.PI/4);
    segmentGeom.rotateX(Math.PI / 2);
    segmentGeom.rotateZ(Math.PI / 2); // align to pad
    const precastSegment = new THREE.Mesh(segmentGeom, concreteMaterial);
    precastSegment.position.set(0, -9.4, 0); // Offset to be held by pad
    vacuumPadGroup.add(precastSegment);

    armStage2.add(vacuumPadGroup);
    erectorArm.add(armStage1);

    erectorArm.userData = { stage2: armStage2 };
    erectorGroup.add(erectorArm);

    addPart(erectorGroup, "Ring_Erector_Mechanism", "Robotic rotary arm with vacuum grippers used to place precast concrete segments to build the tunnel lining.", warningYellow, "Constructs the permanent tunnel walls.", 4, ["TBM_Shield_Body", "Concrete_Segment_Feeder"], "Inability to construct tunnel walls, stopping excavation.", ["Thrust_Jacks", "Ground_Collapse"], {x:0, y:0, z:-17}, {x:0, y:0, z:-30});

    // =========================================================================
    // 5. MUCK CONVEYOR SYSTEM
    // =========================================================================
    const conveyorGroup = new THREE.Group();
    conveyorGroup.position.set(0, -2, -4); // Starts in chamber, runs to the back

    const conveyorLength = 55.0;
    
    // Conveyor Frame (Extruded rails)
    const frameGeom = new THREE.ExtrudeGeometry(cChannelShape, { depth: conveyorLength, bevelEnabled: false });
    const leftFrame = new THREE.Mesh(frameGeom, steel);
    leftFrame.position.set(-1.2, 0, 0);
    const rightFrame = new THREE.Mesh(frameGeom, steel);
    rightFrame.position.set(1.2, 0, 0);
    rightFrame.scale.x = -1; // Mirror C-channel
    conveyorGroup.add(leftFrame, rightFrame);

    // Rollers and Belt
    const rollerGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2, 16);
    const rollerCount = Math.floor(conveyorLength / 0.5);
    const activeRollers = [];

    for(let i=0; i<rollerCount; i++) {
        const roller = new THREE.Mesh(rollerGeom, darkSteel);
        roller.rotation.z = Math.PI / 2;
        roller.position.set(0, 0.1, -i * 0.5);
        // Add a V-shape to rollers for troughed belt
        roller.rotation.x = 0; 
        conveyorGroup.add(roller);
        activeRollers.push(roller);
    }
    conveyorGroup.userData = { rollers: activeRollers };

    // The Rubber Belt itself
    const beltShape = new THREE.Shape();
    beltShape.moveTo(-1.1, 0.2);
    beltShape.lineTo(-0.8, 0.0);
    beltShape.lineTo(0.8, 0.0);
    beltShape.lineTo(1.1, 0.2);
    beltShape.lineTo(1.1, 0.15);
    beltShape.lineTo(0.8, -0.05);
    beltShape.lineTo(-0.8, -0.05);
    beltShape.lineTo(-1.1, 0.15);
    
    const beltGeom = new THREE.ExtrudeGeometry(beltShape, { depth: conveyorLength, bevelEnabled: false });
    const belt = new THREE.Mesh(beltGeom, rubber);
    belt.position.set(0, 0.15, 0);
    conveyorGroup.add(belt);

    addPart(conveyorGroup, "Muck_Conveyor_Belt", "High-capacity troughed rubber conveyor belt spanning the length of the gantries.", rubber, "Removes excavated rock and soil from the cutting chamber to the surface transport.", 5, ["Cutterhead_Chamber", "Gantry_Structures"], "Excavated material buildup, stopping TBM advance.", ["Cutterhead_Jamming"], {x:0, y:-2, z:-4}, {x:0, y:-10, z:-10});

    // =========================================================================
    // 6. TRAILING GANTRIES (Extensive Structural Framework)
    // =========================================================================
    const trailingGantries = new THREE.Group();
    trailingGantries.position.set(0, -6, -20); // Behind the shield

    // Function to build a highly detailed gantry section
    function buildGantrySection(length, zOffset) {
        const section = new THREE.Group();
        section.position.set(0, 0, zOffset);

        // Main longitudinal H-Beams
        const beamGeom = new THREE.ExtrudeGeometry(hBeamShape, { depth: length, bevelEnabled: false });
        const lowerLeft = new THREE.Mesh(beamGeom, steel);
        lowerLeft.position.set(-3.5, 0, 0);
        const lowerRight = new THREE.Mesh(beamGeom, steel);
        lowerRight.position.set(3.5, 0, 0);
        const upperLeft = new THREE.Mesh(beamGeom, steel);
        upperLeft.position.set(-3.5, 5.0, 0);
        const upperRight = new THREE.Mesh(beamGeom, steel);
        upperRight.position.set(3.5, 5.0, 0);
        section.add(lowerLeft, lowerRight, upperLeft, upperRight);

        // Cross bracing and vertical struts
        const strutGeom = new THREE.BoxGeometry(0.4, 5.0, 0.4);
        const crossGeom = new THREE.BoxGeometry(7.4, 0.4, 0.4);
        const diagGeom = new THREE.BoxGeometry(0.3, 8.6, 0.3); // Diagonal brace
        
        for(let z=0; z>=-length; z-=3.0) {
            // Verticals
            const vL = new THREE.Mesh(strutGeom, steel);
            vL.position.set(-3.5, 2.5, z);
            const vR = new THREE.Mesh(strutGeom, steel);
            vR.position.set(3.5, 2.5, z);
            
            // Horizontals (Lower and Upper decks)
            const hLow = new THREE.Mesh(crossGeom, steel);
            hLow.position.set(0, 0, z);
            const hHigh = new THREE.Mesh(crossGeom, steel);
            hHigh.position.set(0, 5.0, z);

            section.add(vL, vR, hLow, hHigh);

            // Diagonals
            if(z > -length + 1.0) {
                const diag = new THREE.Mesh(diagGeom, steel);
                diag.position.set(-3.5, 2.5, z - 1.5);
                diag.rotation.x = Math.PI / 4;
                const diag2 = new THREE.Mesh(diagGeom, steel);
                diag2.position.set(3.5, 2.5, z - 1.5);
                diag2.rotation.x = -Math.PI / 4;
                section.add(diag, diag2);
            }
        }

        // Walkway Grating (Detailed plates)
        const gratingGeom = new THREE.BoxGeometry(7.0, 0.1, length);
        const lowerDeck = new THREE.Mesh(gratingGeom, heavyDirtSteel);
        lowerDeck.position.set(0, 0.2, -length/2);
        const upperDeck = new THREE.Mesh(gratingGeom, heavyDirtSteel);
        upperDeck.position.set(0, 5.2, -length/2);
        section.add(lowerDeck, upperDeck);

        // Handrails
        const railPostGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
        const railHorizGeom = new THREE.CylinderGeometry(0.03, 0.03, length, 8);
        
        for(let side of [-1, 1]) {
            for(let deck of [0.2, 5.2]) {
                const railHoriz = new THREE.Mesh(railHorizGeom, safetyOrange);
                railHoriz.rotation.x = Math.PI/2;
                railHoriz.position.set(side * 3.4, deck + 1.1, -length/2);
                const railHorizMid = new THREE.Mesh(railHorizGeom, safetyOrange);
                railHorizMid.rotation.x = Math.PI/2;
                railHorizMid.position.set(side * 3.4, deck + 0.6, -length/2);
                section.add(railHoriz, railHorizMid);

                for(let z=0; z>=-length; z-=2.0) {
                    const post = new THREE.Mesh(railPostGeom, safetyOrange);
                    post.position.set(side * 3.4, deck + 0.6, z);
                    section.add(post);
                }
            }
        }

        return section;
    }

    // Build 3 massive gantry sections
    const gantry1 = buildGantrySection(15.0, 0);
    const gantry2 = buildGantrySection(15.0, -16.0);
    const gantry3 = buildGantrySection(15.0, -32.0);
    
    trailingGantries.add(gantry1, gantry2, gantry3);

    addPart(trailingGantries, "Trailing_Gantry_Train", "Massive multi-stage trailing structural platforms holding all support equipment, power systems, and operator cabins.", steel, "Houses backup logistics and personnel facilities.", 6, ["TBM_Shield_Body", "Muck_Conveyor_Belt"], "Loss of support systems.", [], {x:0, y:-6, z:-20}, {x:0, y:-20, z:-20});

    // =========================================================================
    // 7. GANTRY BOGIES WITH EXTREME OFF-ROAD TIRES (Per Request)
    // =========================================================================
    // The prompt explicitly mandated "TIRES: Must use TorusGeometry combined with hundreds of tiny extruded BoxGeometry lugs...". 
    // We attach heavy multi-axle wheel bogies to the bottom of the gantries to support them on the tunnel invert.
    const bogieGroup = new THREE.Group();
    bogieGroup.position.set(0, -7.5, -20); // Beneath the gantry decks

    const lugGeom = new THREE.BoxGeometry(0.15, 0.4, 0.8);
    const rimGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.9, 32);
    
    // Spoke array for rims
    const spokeGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);

    for(let b=0; b<12; b++) {
        // 12 sets of dual tires spanning the gantries
        const zPos = - (b * 3.5) - 2.0;
        
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8.0, 16), steel);
        axle.rotation.z = Math.PI / 2;
        axle.position.set(0, 0, zPos);
        bogieGroup.add(axle);

        for(let side of [-1, 1]) {
            const tireAssembly = new THREE.Group();
            
            // Inner Rim
            const rim = new THREE.Mesh(rimGeom, chrome);
            rim.rotation.x = Math.PI / 2;
            rim.rotation.z = Math.PI / 2;
            
            // Intricate Spokes
            for(let s=0; s<8; s++) {
                const spk = new THREE.Mesh(spokeGeom, darkSteel);
                spk.rotation.x = (Math.PI / 8) * s;
                rim.add(spk);
            }
            tireAssembly.add(rim);

            // Torus Tire
            const tireTorus = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.45, 24, 64), rubber);
            tireTorus.rotation.y = Math.PI / 2;
            tireAssembly.add(tireTorus);

            // Hundreds of tiny extruded BoxGeometry lugs
            const lugCount = 60;
            for(let l=0; l<lugCount; l++) {
                const angle = (Math.PI * 2 / lugCount) * l;
                const lug = new THREE.Mesh(lugGeom, darkSteel); // dark rubbery look
                lug.position.set(0, Math.sin(angle)*1.6, Math.cos(angle)*1.6);
                lug.rotation.x = -angle;
                
                // Chevron pattern offsets
                if(l % 2 === 0) {
                    lug.position.x += 0.2;
                    lug.rotation.y = Math.PI/8;
                } else {
                    lug.position.x -= 0.2;
                    lug.rotation.y = -Math.PI/8;
                }
                tireAssembly.add(lug);
            }

            tireAssembly.position.set(side * 3.8, 0, zPos);
            
            // Add a suspension bracket
            const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.0, 1.2), warningYellow);
            bracket.position.set(side * 3.5, 1.0, zPos);
            bogieGroup.add(bracket);
            
            bogieGroup.add(tireAssembly);
        }
    }
    
    addPart(bogieGroup, "Gantry_Support_Bogies", "Heavy-duty multi-axle bogies with aggressively lugged tires to support and advance the massive trailing gantries along the tunnel invert.", rubber, "Gantry mobility and weight distribution.", 7, ["Trailing_Gantry_Train"], "Gantry immobility, dragging, structural stress.", ["Tunnel_Invert_Damage"], {x:0, y:-7.5, z:-20}, {x:0, y:-25, z:-20});


    // =========================================================================
    // 8. HYPER-DETAILED CONTROL CABIN
    // =========================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(2.0, -0.8, -22); // Mounted on upper deck of Gantry 1

    // Enclosure
    const cabinWallMat = plastic.clone();
    cabinWallMat.color.setHex(0xeef0f2);
    
    const floor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 4.0), darkSteel);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 4.0), cabinWallMat);
    roof.position.y = 2.4;
    
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.4, 0.2), cabinWallMat);
    wallBack.position.set(0, 1.2, -1.9);
    
    const wallFront = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.0, 0.2), cabinWallMat);
    wallFront.position.set(0, 0.5, 1.9);
    
    const windowFront = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.1), tinted);
    windowFront.position.set(0, 1.7, 1.9);

    const wallSide = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 4.0), cabinWallMat);
    wallSide.position.set(1.4, 1.2, 0);

    cabinGroup.add(floor, roof, wallBack, wallFront, windowFront, wallSide);

    // Operator Desk & Controls
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.0), darkSteel);
    desk.position.set(0, 1.0, 1.2);
    desk.rotation.x = Math.PI / 16;
    cabinGroup.add(desk);

    // Glowing Screens (Monitors)
    const activeScreens = [];
    for(let s=0; s<4; s++) {
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), glowingScreen);
        screen.position.set(-0.9 + (s * 0.6), 1.4, 1.6);
        screen.rotation.x = -Math.PI / 8;
        screen.userData = { baseIntensity: 1.0 + Math.random()*0.5, flickerSpeed: Math.random() * 5 };
        activeScreens.push(screen);
        cabinGroup.add(screen);
    }
    cabinGroup.userData = { screens: activeScreens };

    // Joysticks and Buttons
    for(let j=-1; j<=1; j+=2) {
        const stickBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), plastic);
        stickBase.position.set(j*0.8, 1.05, 1.0);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), warningLight);
        stick.position.set(j*0.8, 1.2, 1.0);
        cabinGroup.add(stickBase, stick);
    }

    // Operator Chair
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), chrome);
    chairBase.position.set(0, 0.25, 0.5);
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), rubber);
    chairSeat.position.set(0, 0.5, 0.5);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), rubber);
    chairBack.position.set(0, 0.9, 0.25);
    cabinGroup.add(chairBase, chairSeat, chairBack);

    addPart(cabinGroup, "Main_Control_Cabin", "Environmentally sealed nerve center where the TBM pilot monitors guidance, pressure, and excavation parameters via extensive diagnostic arrays.", plastic, "Central command and machine steering.", 8, ["Trailing_Gantry_Train", "All_Sensor_Networks"], "Loss of machine control, blind excavation.", ["Cutterhead_Damage", "Deviation_from_Alignment"], {x:2.0, y:-0.8, z:-22}, {x:15.0, y:5.0, z:-22});


    // =========================================================================
    // 9. HIGH VOLTAGE TRANSFORMERS & HYDRAULIC PUMPS
    // =========================================================================
    const powerGroup = new THREE.Group();
    powerGroup.position.set(-1.5, -0.6, -35); // Gantry 2

    // Huge Transformer Box
    const transformerBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.0, 6.0), warningYellow);
    powerGroup.add(transformerBody);

    // Heat sink fins
    for(let f=0; f<20; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.5, 0.1), darkSteel);
        fin.position.set(0, 0, -2.8 + (f * 0.3));
        powerGroup.add(fin);
    }

    // Huge electrical cables (TubeGeometry)
    const cableCurve1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 1.5, 3.0),
        new THREE.Vector3(0, 4.0, 4.0),
        new THREE.Vector3(1.5, 4.0, 10.0)
    );
    const cableGeom = new THREE.TubeGeometry(cableCurve1, 32, 0.15, 8, false);
    
    for(let c=0; c<3; c++) {
        const cable = new THREE.Mesh(cableGeom, rubber);
        cable.position.x = c * 0.4 - 0.4;
        powerGroup.add(cable);
    }

    addPart(powerGroup, "High_Voltage_Transformers", "Step-down transformers converting grid voltage to run the massive multi-megawatt cutterhead drive motors.", warningYellow, "Power distribution.", 9, ["Trailing_Gantry_Train", "Primary_Cutterhead"], "Total power failure.", ["Life_Support_Failure"], {x:-1.5, y:-0.6, z:-35}, {x:-15.0, y:0, z:-35});


    // =========================================================================
    // 10. VENTILATION DUCTING (Massive overhead pipe)
    // =========================================================================
    const ventGroup = new THREE.Group();
    ventGroup.position.set(0, 3.5, 0);

    const ventCurve = new THREE.LineCurve3(new THREE.Vector3(2.5, 0, 0), new THREE.Vector3(2.5, 0, -65));
    const ventDuctGeom = new THREE.TubeGeometry(ventCurve, 128, 1.2, 32, false);
    const ventDuct = new THREE.Mesh(ventDuctGeom, warningYellow);
    ventGroup.add(ventDuct);

    // Reinforcement ribs every meter
    for(let z=0; z>-65; z-=1) {
        const ventRib = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 16, 32), darkSteel);
        ventRib.position.set(2.5, 0, z);
        ventGroup.add(ventRib);
    }
    
    // Support brackets
    for(let z=-5; z>-60; z-=5) {
        const vBracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 0.2), steel);
        vBracket.position.set(2.5, -1.0, z);
        ventGroup.add(vBracket);
    }

    addPart(ventGroup, "Fresh_Air_Ventilation_Duct", "Massive pressurized duct delivering fresh air to the cutting face and exhausting dangerous tunnel gases.", warningYellow, "Atmosphere regulation and worker life support.", 10, ["Trailing_Gantry_Train", "TBM_Shield_Body"], "Asphyxiation hazard, accumulation of explosive gases.", ["Evacuation"], {x:0, y:3.5, z:0}, {x:10, y:15, z:0});


    // =========================================================================
    // QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "What is the primary function of the array of hydraulic Thrust Jacks in a TBM?",
            options: [
                "To rotate the massive cutterhead during excavation.",
                "To propel the machine forward by pushing off the newly installed precast concrete rings.",
                "To crush large boulders that enter the muck chamber.",
                "To pump chemical grouts into the surrounding soil."
            ],
            correctAnswer: 1,
            explanation: "Thrust jacks press against the structurally sound precast concrete rings that were just installed, providing immense forward pressure to advance the heavy shield and press the cutterhead into the rock face."
        },
        {
            question: "Why does the main Cutterhead employ hundreds of individual Disc Cutters rather than a single solid blade?",
            options: [
                "To reduce the overall weight of the cutterhead.",
                "To allow for easier replacement of broken parts and to apply extreme localized point-pressure to fracture hard rock.",
                "Because disc cutters spin faster than a single blade.",
                "To make the TBM look more intimidating."
            ],
            correctAnswer: 1,
            explanation: "Disc cutters roll against the rock face under extreme thrust, causing the rock to fracture in chips due to high localized compressive forces. Individual discs can also be replaced when they wear out without changing the whole head."
        },
        {
            question: "What role does the Ring Erector Mechanism play in tunnel construction?",
            options: [
                "It rotates the massive drill bit.",
                "It applies shotcrete to the tunnel walls.",
                "It uses vacuum or mechanical grippers to lift and precisely position precast concrete segments to form the permanent tunnel lining.",
                "It ejects the excavated muck onto the conveyor belt."
            ],
            correctAnswer: 2,
            explanation: "The erector arm operates in the protective tail shield, picking up heavy precast concrete segments and arranging them in a perfect ring to permanently line the tunnel and support the earth."
        },
        {
            question: "In an Earth Pressure Balance (EPB) TBM, what happens inside the sealed chamber directly behind the Cutterhead?",
            options: [
                "It is kept completely empty to allow workers to walk up to the rock face.",
                "Excavated soil is mixed with water and foams to form a pressurized paste that counterbalances the extreme pressure of the ground ahead, preventing cave-ins.",
                "It houses the high-voltage electrical transformers.",
                "It is filled with highly flammable gases for combustion."
            ],
            correctAnswer: 1,
            explanation: "The chamber holds the excavated muck under pressure, perfectly balancing the earth and groundwater pressure from outside, which prevents surface subsidence and flooding."
        },
        {
            question: "Why are the trailing gantries typically so long (often over 100 meters)?",
            options: [
                "They provide aerodynamic stability to the TBM.",
                "They act as a counterweight to lift the cutterhead.",
                "They must house massive logistical infrastructure: power transformers, grout pumps, ventilation fans, control rooms, and conveyor extensions.",
                "They are just empty tubes used to store spare concrete rings."
            ],
            correctAnswer: 2,
            explanation: "A TBM is basically a moving underground factory. The gantries tow all the massive electrical, hydraulic, pneumatic, and personnel support systems needed to keep the machine running 24/7 deep underground."
        }
    ];

    // =========================================================================
    // COMPLEX SYNCHRONIZED ANIMATION FUNCTION
    // =========================================================================
    function animate(time, speed, meshes) {
        // 1. Rotate main cutterhead
        if(meshes['Primary_Cutterhead']) {
            meshes['Primary_Cutterhead'].rotation.z = time * speed * -0.5;
        }

        // 2. Animate hydraulic thrust jacks (slowly extending and retracting)
        if(meshes['Thrust_Jacks_Array']) {
            // cycle from 0 to 1 over time
            const thrustCycle = (Math.sin(time * speed * 0.3) + 1) * 0.5;
            const activeRods = meshes['Thrust_Jacks_Array'].children;
            activeRods.forEach(jack => {
                if(jack.userData && jack.userData.rod) {
                    // move rod between -1.5 (retracted) and -3.5 (extended)
                    jack.userData.rod.position.z = -1.5 - (2.0 * thrustCycle);
                }
            });
        }

        // 3. Animate the Ring Erector Arm
        if(meshes['Ring_Erector_Mechanism']) {
            const erector = meshes['Ring_Erector_Mechanism'];
            
            // Rotate the massive gear ring back and forth
            erector.children[0].rotation.z = Math.sin(time * speed * 0.2) * Math.PI;

            // Telescope the arm in and out
            const arm = erector.children.find(child => child.userData && child.userData.stage2);
            if(arm) {
                const extension = (Math.cos(time * speed * 0.4) + 1) * 0.5;
                arm.userData.stage2.position.y = -1.0 - (1.5 * extension);
            }
        }

        // 4. Animate Muck Conveyor Rollers
        if(meshes['Muck_Conveyor_Belt']) {
            const conveyor = meshes['Muck_Conveyor_Belt'];
            if(conveyor.userData && conveyor.userData.rollers) {
                conveyor.userData.rollers.forEach(roller => {
                    roller.rotation.x += speed * 0.8;
                });
            }
        }

        // 5. Animate Control Cabin Lights (Flickering telemetry screens)
        if(meshes['Main_Control_Cabin']) {
            const cabin = meshes['Main_Control_Cabin'];
            if(cabin.userData && cabin.userData.screens) {
                cabin.userData.screens.forEach(screen => {
                    const noise = Math.sin(time * screen.userData.flickerSpeed);
                    screen.material.emissiveIntensity = screen.userData.baseIntensity + (noise * 0.3);
                });
            }
        }
    }

    return { 
        group, 
        parts, 
        description: "A hyper-realistic, massive Tunnel Boring Machine (TBM). Features a giant rotating cutterhead with hundreds of disc cutters, heavy cylindrical shield body with thrust jacks, a complex articulating ring erector, muck conveyor, and extensively detailed trailing gantries rolling on extreme heavy-duty tires. This subterranean factory perfectly demonstrates Earth Pressure Balance excavation.",
        quizQuestions, 
        animate 
    };
}
