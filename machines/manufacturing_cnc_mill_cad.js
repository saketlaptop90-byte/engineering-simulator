import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const machineWhite = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.4, clearcoat: 0.2 });
    const machineBlue = new THREE.MeshPhysicalMaterial({ color: 0x004488, metalness: 0.2, roughness: 0.5 });
    const castIronBed = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.6 });
    const shinySteel = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.1 });
    const safetyGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 1 });
    const rawAluminumBlock = new THREE.MeshPhysicalMaterial({ color: 0xd8d8d8, metalness: 0.8, roughness: 0.3 }); // The stock material being cut
    
    // VFX Materials
    const coolantFlow = new THREE.MeshBasicMaterial({ color: 0xeeeeff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};

    // ==========================================
    // 1. PROCEDURAL CAD: Enclosure & Heavy Cast Base
    // ==========================================
    const frameGroup = new THREE.Group();
    
    // Heavy Cast Iron Bed (Base)
    const bedGeo = new THREE.BoxGeometry(4.0, 0.8, 3.0);
    const bed = new THREE.Mesh(bedGeo, castIronBed);
    bed.position.set(0, 0.4, 0);
    frameGroup.add(bed);
    
    // Machine Enclosure (Sheet metal and safety glass)
    const encloseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 3.0), machineWhite); encloseLeft.position.set(-1.9, 2.55, 0);
    const encloseRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 3.0), machineWhite); encloseRight.position.set(1.9, 2.55, 0);
    const encloseBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.5, 0.2), machineWhite); encloseBack.position.set(0, 2.55, -1.4);
    const encloseTop = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 3.0), machineWhite); encloseTop.position.set(0, 4.2, 0);
    
    // Front Sliding Doors (Safety glass with steel frames)
    const doorGroup = new THREE.Group();
    const doorFrameGeo = new THREE.BoxGeometry(1.8, 3.2, 0.1);
    const doorGlassGeo = new THREE.PlaneGeometry(1.4, 2.8);
    
    const doorL = new THREE.Mesh(doorFrameGeo, machineBlue); doorL.position.set(-0.9, 2.4, 1.4);
    const gl = new THREE.Mesh(doorGlassGeo, safetyGlass); gl.position.set(0, 0, 0.06); doorL.add(gl);
    
    const doorR = new THREE.Mesh(doorFrameGeo, machineBlue); doorR.position.set(0.9, 2.4, 1.45); // offset slightly in Z to slide behind
    const gr = new THREE.Mesh(doorGlassGeo, safetyGlass); gr.position.set(0, 0, 0.06); doorR.add(gr);
    
    doorGroup.add(doorL, doorR);
    frameGroup.add(encloseLeft, encloseRight, encloseBack, encloseTop, doorGroup);

    group.add(frameGroup);
    parts.push({ mesh: bed, name: "Meehanite Cast Iron Bed", description: "Ultra-rigid monolithic casting.", function: "Dampens severe machining vibrations to ensure sub-micron surface finish tolerances."});

    // ==========================================
    // 2. PROCEDURAL CAD: The 5-Axis Kinematic Table (Trunnion)
    // ==========================================
    // Moving X, A, and C axes on the table
    const tableGroup = new THREE.Group(); // Moves in X
    tableGroup.position.set(0, 0.9, 0);
    
    // X-Axis Linear Rails
    const railX1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.1), shinySteel); railX1.position.set(0, -0.05, -0.8);
    const railX2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.1), shinySteel); railX2.position.set(0, -0.05, 0.8);
    frameGroup.add(railX1, railX2);
    
    // The Trunnion Base (A-Axis Yoke)
    const trunnionBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 2.0), castIronBed);
    tableGroup.add(trunnionBase);
    
    // A-Axis Swivel (Tilts around X)
    const aAxis = new THREE.Group();
    aAxis.position.set(0, 0.4, 0); // Pivot point
    
    const trunnionCradle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.6), castIronBed);
    aAxis.add(trunnionCradle);
    
    // C-Axis Rotary Platter (Spins around local Y)
    const cAxis = new THREE.Group();
    cAxis.position.set(0, 0.15, 0);
    
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32), shinySteel);
    cAxis.add(platter);
    
    // The Workpiece (Raw Aluminum Stock block being machined)
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), rawAluminumBlock);
    stock.position.set(0, 0.25, 0);
    cAxis.add(stock);

    aAxis.add(cAxis);
    tableGroup.add(aAxis);
    group.add(tableGroup);
    
    group.userData.animatedMeshes['xAxis'] = tableGroup; // Moves left/right
    group.userData.animatedMeshes['aAxis'] = aAxis; // Tilts
    group.userData.animatedMeshes['cAxis'] = cAxis; // Rotates
    
    parts.push({ mesh: trunnionCradle, name: "Trunnion Rotary Table (A/C Axis)", description: "Direct-drive rotary platter mounted in a tilting yoke.", function: "Allows the cutting tool to reach 5 sides of the workpiece without re-fixturing."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Y/Z Axis Column & Spindle
    // ==========================================
    const columnGroup = new THREE.Group(); // Moves in Y
    columnGroup.position.set(0, 1.0, -1.0);
    
    // Massive Y-axis casting
    const columnBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.0, 0.8), machineWhite);
    columnBase.position.set(0, 1.5, 0);
    columnGroup.add(columnBase);
    
    // Z-Axis Head (Moves Up/Down)
    const zAxis = new THREE.Group();
    zAxis.position.set(0, 1.5, 0.6); // Mounts to front of Y column
    
    const spindleHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.8), machineBlue);
    zAxis.add(spindleHead);
    
    // The High-Speed Spindle
    const spindleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 32), chrome);
    spindleBody.position.set(0, -0.6, 0.2);
    zAxis.add(spindleBody);
    
    // Tool Holder (CAT40) & Cutting Endmill
    const toolHolder = new THREE.Group();
    toolHolder.position.set(0, -1.0, 0.2);
    
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.2, 16).rotateX(Math.PI), darkSteel);
    cone.position.set(0, -0.1, 0);
    const endmill = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), shinySteel); // 8-flute cutter
    endmill.position.set(0, -0.4, 0);
    
    toolHolder.add(cone, endmill);
    zAxis.add(toolHolder);
    
    group.userData.animatedMeshes['yAxis'] = columnGroup; // Moves Z (in/out relative to machine front, standard CNC Y-axis)
    group.userData.animatedMeshes['zAxis'] = zAxis; // Moves Y (up/down relative to machine, standard CNC Z-axis)
    group.userData.animatedMeshes['spindle'] = toolHolder; // Spins fast
    
    // High-Pressure Coolant VFX
    const coolant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8).rotateX(Math.PI/12), coolantFlow);
    coolant1.position.set(0.2, -0.5, 0.1);
    const coolant2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8).rotateX(-Math.PI/12), coolantFlow);
    coolant2.position.set(-0.2, -0.5, 0.1);
    coolant1.visible = false; coolant2.visible = false;
    zAxis.add(coolant1, coolant2);
    group.userData.animatedMeshes.coolant = [coolant1, coolant2];

    group.add(columnGroup);
    
    parts.push({ mesh: spindleBody, name: "24,000 RPM Motorized Spindle", description: "Ceramic bearing direct-drive spindle motor.", function: "Provides massive torque and ultra-high speeds to vaporize aluminum stock into chips."});

    // ==========================================
    // 4. Factual Fasteners (3,200 parts)
    // ==========================================
    const boltCount = 3200;
    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const bDummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        if (i < 1500) {
            // Linear Guideways (rails bolted to bed)
            const isX = Math.random() > 0.5;
            bDummy.position.set((Math.random() - 0.5) * 3.5, 0.85, (Math.random() - 0.5) * 1.6);
            bDummy.rotation.set(0, 0, 0);
        } else {
            // Enclosure sheet metal screws
            const face = Math.floor(Math.random() * 3); // L, R, Top
            if(face === 0) { bDummy.position.set(-1.8, 1.0+Math.random()*3, (Math.random()-0.5)*2.8); bDummy.rotation.set(0, 0, Math.PI/2); }
            if(face === 1) { bDummy.position.set(1.8, 1.0+Math.random()*3, (Math.random()-0.5)*2.8); bDummy.rotation.set(0, 0, Math.PI/2); }
            if(face === 2) { bDummy.position.set((Math.random()-0.5)*3.8, 4.15, (Math.random()-0.5)*2.8); bDummy.rotation.set(0, 0, 0); }
        }
        bDummy.updateMatrix();
        instancedBolts.setMatrixAt(i, bDummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "3,200 Linear Guide Bolts", description: "Factual quantity of instanced precision socket-head cap screws.", function: "Locks the THK linear bearing rails perfectly straight to the scraped cast-iron bed." });
    
    // Scale adjustment 
    group.scale.set(0.9, 0.9, 0.9);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 5-Axis Kinematic machining path
            
            // Spindle spins extremely fast (blur)
            group.userData.animatedMeshes['spindle'].rotation.y += 2.0 * speed;
            
            // Coolant ON
            group.userData.animatedMeshes.coolant.forEach(c => c.visible = true);
            
            // X-Axis (Table moves left/right)
            group.userData.animatedMeshes['xAxis'].position.x = Math.sin(timeAcc * 2 * speed) * 0.6;
            
            // Y-Axis (Column moves in/out - mapped to Z in our 3D space)
            group.userData.animatedMeshes['yAxis'].position.z = -1.0 + Math.cos(timeAcc * 1.5 * speed) * 0.4;
            
            // Z-Axis (Head moves up/down)
            // It needs to dip down to "cut" the part, then retract
            // We use absolute math so it hovers then dives
            const plunge = Math.abs(Math.sin(timeAcc * 1.8 * speed));
            group.userData.animatedMeshes['zAxis'].position.y = 1.6 - (plunge * 0.5); 
            
            // A-Axis (Trunnion Tilt)
            group.userData.animatedMeshes['aAxis'].rotation.x = Math.sin(timeAcc * 0.5 * speed) * (Math.PI / 4);
            
            // C-Axis (Platter Spin)
            group.userData.animatedMeshes['cAxis'].rotation.y += 0.5 * speed;
            
        } else {
            // Idle (Retract to home position)
            group.userData.animatedMeshes['spindle'].rotation.y += 0.05; // Coasting
            group.userData.animatedMeshes.coolant.forEach(c => c.visible = false);
            
            group.userData.animatedMeshes['xAxis'].position.x *= 0.9;
            group.userData.animatedMeshes['yAxis'].position.z += (-1.0 - group.userData.animatedMeshes['yAxis'].position.z) * 0.1;
            group.userData.animatedMeshes['zAxis'].position.y += (1.8 - group.userData.animatedMeshes['zAxis'].position.y) * 0.1;
            
            group.userData.animatedMeshes['aAxis'].rotation.x *= 0.9;
        }
    };

    group.userData.parts = parts;
    return group;
}
