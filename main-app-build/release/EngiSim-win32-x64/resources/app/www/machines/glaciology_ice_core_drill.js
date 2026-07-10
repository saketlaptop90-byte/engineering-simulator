import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- MATERIALS ---
    const iceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaddff,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.31,
        thickness: 5.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x002244,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });
    
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        roughness: 0.4
    });

    // --- PROCEDURAL GEOMETRY FUNCTIONS ---
    function createAdvancedHousing(width, height, depth) {
        const shape = new THREE.Shape();
        const radius = 0.2;
        shape.moveTo(-width/2 + radius, -height/2);
        shape.lineTo(width/2 - radius, -height/2);
        shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
        shape.lineTo(width/2, height/2 - radius);
        shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
        shape.lineTo(-width/2 + radius, height/2);
        shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
        shape.lineTo(-width/2, -height/2 + radius);
        shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
        return new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 });
    }

    function createGear(radius, teethCount, thickness) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85;
        for (let i = 0; i < teethCount; i++) {
            const angle1 = (i / teethCount) * Math.PI * 2;
            const angle2 = ((i + 0.25) / teethCount) * Math.PI * 2;
            const angle3 = ((i + 0.5) / teethCount) * Math.PI * 2;
            const angle4 = ((i + 0.75) / teethCount) * Math.PI * 2;
            
            if (i === 0) shape.moveTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius);
            else shape.lineTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius);
            
            shape.lineTo(Math.cos(angle2) * radius, Math.sin(angle2) * radius);
            shape.lineTo(Math.cos(angle3) * radius, Math.sin(angle3) * radius);
            shape.lineTo(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius);
        }
        shape.closePath();
        
        const hole = new THREE.Path();
        hole.absarc(0, 0, radius * 0.3, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 });
    }

    function createDrillBitTeeth(radius, count, height) {
        const teethGroup = new THREE.Group();
        const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height*0.5, 32, 1, true), darkSteel);
        teethGroup.add(baseRing);
        
        const toothGeom = new THREE.ConeGeometry(radius*0.1, height*1.5, 4);
        toothGeom.translate(0, height*0.5, 0);
        for(let i=0; i<count; i++){
            const angle = (i/count)*Math.PI*2;
            const tooth = new THREE.Mesh(toothGeom, darkSteel);
            tooth.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            tooth.rotation.x = Math.PI; 
            tooth.lookAt(0, -height, 0);
            teethGroup.add(tooth);
        }
        return teethGroup;
    }

    function createWheel(radius, width) {
        const wheelGroup = new THREE.Group();
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width * 1.1, 32), chrome);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        for(let i=0; i<12; i++){
            const angle = (i/12)*Math.PI*2;
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, radius*1.2), darkSteel);
            spoke.position.set(Math.cos(angle)*(radius*0.3), Math.sin(angle)*(radius*0.3), 0);
            spoke.lookAt(0,0,0);
            spoke.rotation.x += Math.PI/2;
            wheelGroup.add(spoke);
        }
        
        const tire = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.8, radius * 0.25, 16, 64), rubber);
        wheelGroup.add(tire);
        
        const lugs = 120;
        for(let i=0; i<lugs; i++){
            const angle = (i/lugs)*Math.PI*2;
            const lug = new THREE.Mesh(new THREE.BoxGeometry(width*0.8, radius*0.15, radius*0.1), rubber);
            lug.position.set(Math.cos(angle)*(radius*1.05), Math.sin(angle)*(radius*1.05), 0);
            lug.rotation.z = angle;
            lug.rotation.y = (i%2===0) ? Math.PI/8 : -Math.PI/8;
            wheelGroup.add(lug);
        }
        return wheelGroup;
    }

    // --- PARTS CREATION ---
    
    // 1. Mobile Support Platform
    const baseGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-8, -6);
    baseShape.lineTo(8, -6);
    baseShape.lineTo(8, 6);
    baseShape.lineTo(-8, 6);
    baseShape.lineTo(-8, -6);
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 1.8, 0, Math.PI * 2, false);
    baseShape.holes.push(centerHole);
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2 });
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.set(0, 2.5, 0); // elevated for wheels
    baseGroup.add(baseMesh);
    
    for(let i=-7.5; i<=7.5; i+=0.3){
        if(Math.abs(i) < 1.8) continue;
        const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 11.8), steel);
        grate.rotation.z = Math.PI/2;
        grate.position.set(0, 2.55, i);
        baseGroup.add(grate);
    }
    group.add(baseGroup);
    parts.push({
        name: "Mobile Support Chassis",
        description: "Heavy-duty steel chassis acting as the transportable foundation for the deep ice drill.",
        material: "Dark Steel / Steel",
        function: "Supports all derrick and mobility operations across fractured glaciers.",
        assemblyOrder: 1,
        connections: ["All-Terrain Wheel Modules", "Derrick Mast"],
        failureEffect: "Chassis fracture, total rig destruction.",
        cascadeFailures: ["Drill String Jam", "Mast Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. All-Terrain Wheel Modules (8x)
    const wheelsGroup = new THREE.Group();
    meshes.wheels = [];
    const wheelPositions = [
        [-8.5, 1.5, -4.5], [8.5, 1.5, -4.5],
        [-8.5, 1.5, -1.5], [8.5, 1.5, -1.5],
        [-8.5, 1.5,  1.5], [8.5, 1.5,  1.5],
        [-8.5, 1.5,  4.5], [8.5, 1.5,  4.5]
    ];
    
    wheelPositions.forEach((pos, idx) => {
        const wheel = createWheel(1.5, 1.2);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.y = Math.PI / 2;
        wheelsGroup.add(wheel);
        meshes.wheels.push(wheel);
        
        // Axle connection
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), steel);
        axle.rotation.z = Math.PI/2;
        axle.position.set(pos[0] > 0 ? pos[0]-0.75 : pos[0]+0.75, pos[1], pos[2]);
        wheelsGroup.add(axle);
    });
    group.add(wheelsGroup);
    parts.push({
        name: "Aggressive Off-Road Tire Arrays",
        description: "8 massive independent wheel hubs featuring extreme tread lugs and spoke-reinforced rims.",
        material: "Rubber / Chrome / Dark Steel",
        function: "Provides mobility over crevasses and deep snow, dispersing the multi-ton weight of the rig.",
        assemblyOrder: 2,
        connections: ["Mobile Support Chassis", "Drive Axles"],
        failureEffect: "Immobilization on the glacier.",
        cascadeFailures: ["Exposure to Crevasse Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -15 }
    });

    // 3. Hydraulic Leveling Outriggers (4x)
    const legsGroup = new THREE.Group();
    const legPositions = [
        [-7, 2.5, -6], [7, 2.5, -6], [-7, 2.5, 6], [7, 2.5, 6]
    ];
    meshes.pistons = [];
    legPositions.forEach(pos => {
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), steel);
        housing.position.set(pos[0], pos[1]+1, pos[2]);
        legsGroup.add(housing);
        
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), chrome);
        piston.position.set(pos[0], pos[1] - 1.5, pos[2]);
        legsGroup.add(piston);
        meshes.pistons.push({piston, baseY: pos[1]-1.5, offset: Math.random()*Math.PI});
        
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16), darkSteel);
        pad.position.set(0, -2, 0);
        piston.add(pad);
    });
    group.add(legsGroup);
    parts.push({
        name: "Hydraulic Outrigger Jacks",
        description: "Four independently articulated hydraulic jacks that lift the wheels off the ground for drilling.",
        material: "Steel / Chrome",
        function: "Stabilizes and perfectly levels the chassis before the drill sequence begins.",
        assemblyOrder: 3,
        connections: ["Mobile Support Chassis"],
        failureEffect: "Rig vibrations causing bore-hole collapse.",
        cascadeFailures: ["Drill Deflection", "Core Fracture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: -10 }
    });

    // 4. Derrick Mast
    const mastGroup = new THREE.Group();
    const mastHeight = 30;
    const cornerPositions = [
        [-2, -2], [2, -2], [2, 2], [-2, 2]
    ];
    cornerPositions.forEach(pos => {
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, mastHeight, 12), steel);
        beam.position.set(pos[0], mastHeight/2 + 2.5, pos[1]);
        mastGroup.add(beam);
    });
    for(let h=2; h<mastHeight; h+=2.5){
        for(let i=0; i<4; i++){
            const p1 = cornerPositions[i];
            const p2 = cornerPositions[(i+1)%4];
            const dx = p2[0]-p1[0], dz = p2[1]-p1[1];
            const dist = Math.sqrt(dx*dx + dz*dz);
            const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 8), steel);
            cross.position.set((p1[0]+p2[0])/2, 2.5 + h, (p1[1]+p2[1])/2);
            cross.rotation.x = Math.PI/2;
            cross.rotation.z = Math.atan2(dz, dx);
            mastGroup.add(cross);
            
            const diag = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, Math.sqrt(dist*dist + 2.5*2.5), 8), steel);
            diag.position.set((p1[0]+p2[0])/2, 2.5 + h - 1.25, (p1[1]+p2[1])/2);
            diag.lookAt(p2[0], 2.5 + h, p2[1]);
            mastGroup.add(diag);
        }
    }
    group.add(mastGroup);
    meshes.mast = mastGroup;
    parts.push({
        name: "Super-Structure Derrick Mast",
        description: "30-meter tall reinforced steel truss tower.",
        material: "Steel",
        function: "Supports the massive multi-ton drill string and provides vertical alignment guides.",
        assemblyOrder: 4,
        connections: ["Mobile Support Chassis", "Crown Block"],
        failureEffect: "Catastrophic collapse.",
        cascadeFailures: ["Winch Failure", "Complete Rig Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -20 }
    });

    // 5. Crown Block
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, mastHeight + 2.5, 0);
    const crownBase = new THREE.Mesh(createAdvancedHousing(5, 1, 5), darkSteel);
    crownGroup.add(crownBase);
    
    meshes.pulleys = [];
    for(let i=0; i<4; i++){
        const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.25, 32), chrome);
        pulley.rotation.z = Math.PI/2;
        pulley.position.set(-1.2 + i*0.8, 0.8, 0);
        crownGroup.add(pulley);
        meshes.pulleys.push(pulley);
    }
    group.add(crownGroup);
    parts.push({
        name: "Crown Block Multi-Sheave",
        description: "Top assembly of the derrick containing four heavy-duty pulleys.",
        material: "Dark Steel / Chrome",
        function: "Redirects the heavily tensioned winch cable down into the center of the mast.",
        assemblyOrder: 5,
        connections: ["Super-Structure Derrick Mast", "Armored Steel Cable"],
        failureEffect: "Cable snapping or derailing.",
        cascadeFailures: ["Drill String Freefall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 6. Winch Drum & Motor
    const winchGroup = new THREE.Group();
    winchGroup.position.set(-5, 4, 3.5);
    const winchBase = new THREE.Mesh(createAdvancedHousing(4, 1.5, 5), darkSteel);
    winchGroup.add(winchBase);
    
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32), steel);
    drum.rotation.x = Math.PI/2;
    drum.position.set(0, 1.5, 0);
    winchGroup.add(drum);
    meshes.winchDrum = drum;

    const cableWound = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 3.4, 32, 50), darkSteel);
    cableWound.rotation.x = Math.PI/2;
    cableWound.position.set(0, 1.5, 0);
    winchGroup.add(cableWound);

    const winchMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), steel);
    winchMotor.rotation.x = Math.PI/2;
    winchMotor.position.set(0, 1.5, -2.8);
    winchGroup.add(winchMotor);
    
    for(let i=0; i<16; i++){
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 1.8), darkSteel);
        fin.rotation.x = (i/16)*Math.PI;
        winchMotor.add(fin);
    }
    
    group.add(winchGroup);
    parts.push({
        name: "High-Torque Winch System",
        description: "Electric multi-megawatt winch with a deeply grooved drum.",
        material: "Steel",
        function: "Raises and lowers the multi-ton drill string securely from the borehole.",
        assemblyOrder: 6,
        connections: ["Mobile Support Chassis", "Armored Steel Cable"],
        failureEffect: "Inability to retrieve core samples.",
        cascadeFailures: ["Cable Snapping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 5, z: 12 }
    });

    // 7. Dynamic Cable
    const cablePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5, 5.5, 3.5),
        new THREE.Vector3(0, mastHeight + 3.3, 0),
        new THREE.Vector3(0, 15, 0)
    ]);
    const cableGeom = new THREE.TubeGeometry(cablePath, 20, 0.08, 8, false);
    const cableMesh = new THREE.Mesh(cableGeom, darkSteel);
    group.add(cableMesh);
    meshes.cable = cableMesh;
    parts.push({
        name: "Armored Steel Cable",
        description: "Multi-strand woven high-tensile steel wire rope.",
        material: "Dark Steel",
        function: "Transfers lifting power from the winch to the drill head.",
        assemblyOrder: 7,
        connections: ["High-Torque Winch System", "Crown Block Multi-Sheave", "Top Drive Swivel"],
        failureEffect: "Catastrophic drop of the drill string.",
        cascadeFailures: ["Drill String Loss", "Borehole Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 25, z: 5 }
    });

    // 8. Drill Assembly
    const drillGroup = new THREE.Group();
    drillGroup.position.set(0, 12, 0); 
    meshes.drillGroup = drillGroup;

    const swivel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16), chrome);
    swivel.position.set(0, 10, 0);
    drillGroup.add(swivel);
    
    const motorHousing = new THREE.Mesh(createAdvancedHousing(3, 3.5, 3), steel);
    motorHousing.position.set(0, 7.5, 0);
    drillGroup.add(motorHousing);
    
    const gear1 = new THREE.Mesh(createGear(0.8, 16, 0.4), darkSteel);
    gear1.rotation.x = Math.PI/2;
    gear1.position.set(0, 9.5, 1.8);
    drillGroup.add(gear1);
    meshes.gear1 = gear1;

    const gear2 = new THREE.Mesh(createGear(0.5, 10, 0.4), chrome);
    gear2.rotation.x = Math.PI/2;
    gear2.position.set(1.3, 9.5, 1.8);
    drillGroup.add(gear2);
    meshes.gear2 = gear2;

    parts.push({
        name: "Top Drive Swivel & Motor",
        description: "Massive electric top-drive enclosed in a chamfered steel housing.",
        material: "Chrome / Steel",
        function: "Provides huge rotational torque to the drill bit while allowing vertical travel.",
        assemblyOrder: 8,
        connections: ["Armored Steel Cable", "Outer Drill Barrel"],
        failureEffect: "Loss of drill rotation.",
        cascadeFailures: ["Bit Jam", "Motor Burnout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 15, z: 0 }
    });

    // 9. Outer Drill Barrel with Flutes
    const barrelLength = 15;
    const outerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, barrelLength, 32, 1, true), steel);
    outerBarrel.position.set(0, 7.5 - barrelLength/2, 0);
    drillGroup.add(outerBarrel);
    meshes.outerBarrel = outerBarrel;
    
    const spiralCurve = new THREE.Curve();
    spiralCurve.getPoint = function(t, optionalTarget = new THREE.Vector3()){
        const height = barrelLength * t - barrelLength/2;
        const angle = t * Math.PI * 2 * 12; // 12 rotations
        const radius = 1.0;
        optionalTarget.set(Math.cos(angle)*radius, height, Math.sin(angle)*radius);
        return optionalTarget;
    };
    const fluteMesh = new THREE.Mesh(new THREE.TubeGeometry(spiralCurve, 250, 0.1, 8, false), darkSteel);
    outerBarrel.add(fluteMesh);

    parts.push({
        name: "Outer Drill Barrel with Spiral Flutes",
        description: "Hollow high-tensile steel cylinder equipped with exterior Archimedes flutes.",
        material: "Steel",
        function: "Spins rapidly to extract ice debris upward and houses the inner core barrel.",
        assemblyOrder: 9,
        connections: ["Top Drive Swivel & Motor", "Diamond-Tipped Coring Bit"],
        failureEffect: "Ice chips clog the hole, jamming the drill.",
        cascadeFailures: ["Drill String Jam"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    // 10. Inner Core Barrel
    const innerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, barrelLength - 0.5, 32, 1, true), chrome);
    innerBarrel.position.set(0, 7.5 - barrelLength/2, 0);
    drillGroup.add(innerBarrel);
    
    parts.push({
        name: "Static Inner Core Barrel",
        description: "Ultra-smooth chrome inner cylinder.",
        material: "Chrome",
        function: "Remains stationary on a bearing to protect the enclosed ice core from the violent rotation of the outer barrel.",
        assemblyOrder: 10,
        connections: ["Outer Drill Barrel", "Core Catcher mechanism"],
        failureEffect: "Rotational friction destroys the ice sample.",
        cascadeFailures: ["Data Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // 11. Drill Bit
    const drillBit = createDrillBitTeeth(1.0, 20, 0.8);
    drillBit.position.set(0, -barrelLength/2, 0);
    outerBarrel.add(drillBit);
    
    parts.push({
        name: "Diamond-Tipped Coring Bit",
        description: "A ring of 20 aggressively angled, synthetic diamond cutting teeth.",
        material: "Dark Steel / Diamond",
        function: "Slices a perfect ring through solid glacial ice, freeing a central core.",
        assemblyOrder: 11,
        connections: ["Outer Drill Barrel"],
        failureEffect: "Inability to cut ice, rapid overheating.",
        cascadeFailures: ["Motor Burnout", "Ice Melting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 5 }
    });

    // 12. Core Catcher
    const catcher = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.05, 16, 32), steel);
    catcher.rotation.x = Math.PI/2;
    catcher.position.set(0, -barrelLength/2 + 0.3, 0);
    innerBarrel.add(catcher);
    for(let i=0; i<10; i++){
        const finger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.15), chrome);
        const angle = (i/10)*Math.PI*2;
        finger.position.set(Math.cos(angle)*0.7, 0, Math.sin(angle)*0.7);
        finger.lookAt(0,0,0);
        catcher.add(finger);
    }
    
    parts.push({
        name: "Core Catcher mechanism",
        description: "A spring-loaded ring with inward-pointing metal fingers.",
        material: "Chrome",
        function: "Grips the base of the ice core, snapping it free and holding it securely during winch retrieval.",
        assemblyOrder: 12,
        connections: ["Static Inner Core Barrel"],
        failureEffect: "Ice core slips out during lifting and falls down the hole.",
        cascadeFailures: ["Data Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: -5 }
    });

    // 13. Ice Core Sample
    const iceCoreGroup = new THREE.Group();
    iceCoreGroup.position.set(0, 7.5 - barrelLength/2, 0);
    
    const iceCoreGeom = new THREE.CylinderGeometry(0.75, 0.75, barrelLength - 1, 32);
    const iceCoreMesh = new THREE.Mesh(iceCoreGeom, iceMaterial);
    iceCoreGroup.add(iceCoreMesh);
    
    for(let h = -barrelLength/2 + 1.5; h < barrelLength/2 - 1.5; h += Math.random()*0.8 + 0.2){
        if (Math.random() > 0.3) {
            const band = new THREE.Mesh(new THREE.CylinderGeometry(0.73, 0.73, 0.03, 16), new THREE.MeshBasicMaterial({color: 0x223344, transparent: true, opacity: 0.4}));
            band.position.y = h;
            iceCoreGroup.add(band);
        }
    }
    for(let i=0; i<30; i++){
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), neonBlue);
        bubble.position.set( (Math.random()-0.5)*1.2, (Math.random()-0.5)*(barrelLength-3), (Math.random()-0.5)*1.2 );
        iceCoreGroup.add(bubble);
    }
    drillGroup.add(iceCoreGroup);
    meshes.iceCore = iceCoreGroup;

    parts.push({
        name: "Glacial Ice Core Sample",
        description: "A pristine 14-meter cylinder of ancient ice, visually glowing with trapped atmospheric gases and biosignatures.",
        material: "Ice / Neon",
        function: "The ultimate scientific payload, providing a timeline of planetary climate history.",
        assemblyOrder: 13,
        connections: ["Static Inner Core Barrel", "Core Catcher mechanism"],
        failureEffect: "Melting or fracturing ruins historical records.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -15 }
    });

    // 14. Hydraulic Power Unit (HPU)
    const hpuGroup = new THREE.Group();
    hpuGroup.position.set(5, 3.5, 4);
    const hpuBody = new THREE.Mesh(createAdvancedHousing(3, 2, 2.5), steel);
    hpuGroup.add(hpuBody);
    
    const hpuTank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.2, 16), chrome);
    hpuTank.rotation.z = Math.PI/2;
    hpuTank.position.set(0, 1.4, 0);
    hpuGroup.add(hpuTank);

    const fluidLevel = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({color: 0xff0000}));
    fluidLevel.position.set(0, 1.4, 0.81);
    hpuGroup.add(fluidLevel);

    group.add(hpuGroup);
    parts.push({
        name: "Hydraulic Power Unit (HPU)",
        description: "Pressurized fluid reservoir and pump system with visible fluid level indicator.",
        material: "Steel / Chrome",
        function: "Provides 5000 PSI to the leveling outriggers and mast positioning rams.",
        assemblyOrder: 14,
        connections: ["Mobile Support Chassis", "High-Pressure Hydraulic Lines"],
        failureEffect: "Loss of hydraulic pressure.",
        cascadeFailures: ["Rig Destabilization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 5, z: 10 }
    });

    // 15. Complex Hydraulic Lines
    const linePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(5, 3.5, 4),
        new THREE.Vector3(4, 2.5, 0),
        new THREE.Vector3(0, 2.5, -4),
        new THREE.Vector3(-7, 3.5, -6)
    ]);
    const hydLine = new THREE.Mesh(new THREE.TubeGeometry(linePath, 30, 0.08, 8, false), rubber);
    group.add(hydLine);
    
    parts.push({
        name: "High-Pressure Hydraulic Lines",
        description: "Thick rubberized Kevlar tubing transmitting extreme pressure.",
        material: "Rubber",
        function: "Connects the HPU to the outriggers.",
        assemblyOrder: 15,
        connections: ["Hydraulic Power Unit", "Hydraulic Outrigger Jacks"],
        failureEffect: "Fluid leak causing immediate pressure loss.",
        cascadeFailures: ["Rig Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -2, z: -5 }
    });

    // 16. Operator Control Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-6, 4.5, -4);
    const cabinBody = new THREE.Mesh(createAdvancedHousing(3.5, 3.5, 3.5), steel);
    cabinGroup.add(cabinBody);
    
    const window = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), tinted);
    window.position.set(0, 0.5, 1.76);
    cabinGroup.add(window);
    
    const window2 = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), tinted);
    window2.rotation.y = Math.PI/2;
    window2.position.set(1.76, 0.5, 0);
    cabinGroup.add(window2);
    
    const console = new THREE.Mesh(createAdvancedHousing(2.5, 1, 1), darkSteel);
    console.position.set(0, -0.5, 0.8);
    console.rotation.x = -Math.PI/6;
    cabinGroup.add(console);
    
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.8), screenMaterial);
    screen.position.set(0, 0, 0.51);
    console.add(screen);

    group.add(cabinGroup);
    parts.push({
        name: "Operator Control Cabin",
        description: "Climate-controlled, shielded cabin with tinted blast glass and glowing digital interfaces.",
        material: "Steel / Tinted Glass",
        function: "Protects the operator from blizzards while controlling the complex drilling process.",
        assemblyOrder: 16,
        connections: ["Mobile Support Chassis"],
        failureEffect: "Operator exposure to deadly temperatures.",
        cascadeFailures: ["Human Error", "Mission Abort"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -18, y: 5, z: -18 }
    });

    // 17. Radiators / Cooling Fins
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.set(0, 4, 5.5);
    const radBody = new THREE.Mesh(createAdvancedHousing(5, 2.5, 0.6), darkSteel);
    radiatorGroup.add(radBody);
    for(let i=0; i<40; i++){
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 1.0), aluminum);
        fin.position.set(-2.4 + i*0.123, 0, 0.2);
        radiatorGroup.add(fin);
    }
    const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.3, 16), darkSteel);
    fan1.rotation.x = Math.PI/2;
    fan1.position.set(-1.2, 0, 0.7);
    radiatorGroup.add(fan1);
    const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.3, 16), darkSteel);
    fan2.rotation.x = Math.PI/2;
    fan2.position.set(1.2, 0, 0.7);
    radiatorGroup.add(fan2);
    meshes.fans = [fan1, fan2];

    group.add(radiatorGroup);
    parts.push({
        name: "Thermal Dissipation Radiators",
        description: "Massive twin-fan aluminum fin arrays.",
        material: "Aluminum / Dark Steel",
        function: "Dumps heat from the massive engines into the freezing air, preventing localized ice melt.",
        assemblyOrder: 17,
        connections: ["Mobile Support Chassis", "Hydraulic Power Unit"],
        failureEffect: "System overheating.",
        cascadeFailures: ["Motor Burnout", "Localized Glacier Melting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 15 }
    });

    // 18. Power Generator
    const genGroup = new THREE.Group();
    genGroup.position.set(6, 4, -5);
    const genBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4, 32), darkSteel);
    genBody.rotation.z = Math.PI/2;
    genGroup.add(genBody);
    
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 16), steel);
    exhaust.position.set(-1.5, 3, 0);
    genGroup.add(exhaust);
    
    const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 16), darkSteel);
    flap.position.set(0, 2.5, 0);
    flap.rotation.x = Math.PI/4;
    exhaust.add(flap);
    meshes.exhaustFlap = flap;

    group.add(genGroup);
    parts.push({
        name: "Hybrid Power Generator",
        description: "High-density energy generator providing megawatt power with a towering exhaust stack.",
        material: "Dark Steel",
        function: "Supplies massive electricity to the winch, drill motors, and cabin heaters.",
        assemblyOrder: 18,
        connections: ["Mobile Support Chassis"],
        failureEffect: "Complete power loss.",
        cascadeFailures: ["Total Rig Shutdown", "Freezing of Fluids"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 18, y: 8, z: -15 }
    });

    // 19. Sensor Array Mast
    const sensorGroup = new THREE.Group();
    sensorGroup.position.set(-2, mastHeight + 4, 2);
    const sensorPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 8), steel);
    sensorGroup.add(sensorPole);
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI), plastic);
    dish.position.set(0, 2, 0);
    dish.rotation.x = Math.PI/2;
    sensorGroup.add(dish);
    meshes.dish = dish;
    
    const anemometer = new THREE.Group();
    anemometer.position.set(0, 1, 0.8);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5), steel);
    rod.rotation.z = Math.PI/2;
    anemometer.add(rod);
    for(let i=0; i<3; i++){
        const cup = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8, 0, Math.PI), plastic);
        const angle = (i/3)*Math.PI*2;
        cup.position.set(Math.cos(angle)*0.75, 0, Math.sin(angle)*0.75);
        cup.rotation.y = angle + Math.PI/2;
        anemometer.add(cup);
    }
    sensorGroup.add(anemometer);
    meshes.anemometer = anemometer;

    group.add(sensorGroup);
    parts.push({
        name: "Meteorological & Telemetry Array",
        description: "Spinning anemometers, active tracking communication dish, and ambient sensors.",
        material: "Plastic / Steel",
        function: "Monitors extreme blizzard conditions and relays high-bandwidth drilling data via satellite.",
        assemblyOrder: 19,
        connections: ["Super-Structure Derrick Mast"],
        failureEffect: "Loss of remote communication.",
        cascadeFailures: ["Data Blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 35, z: 10 }
    });

    group.scale.set(0.15, 0.15, 0.15);

    const description = "Mobile Deep Glaciology Ice Core Drill. A colossal, hyper-realistic engineering marvel mounted on 8 massive off-road treads. Designed to traverse crevassed glaciers and extract 14-meter pristine climate records from deep beneath the polar ice sheets. Features synchronized hydraulic outriggers, dual-barrel rotary drilling with Archimedes flutes, and multi-megawatt winching capabilities.";

    const quizQuestions = [
        {
            question: "What is the purpose of the Static Inner Core Barrel in a glaciology drill?",
            options: [
                "To rapidly rotate and cut the ice",
                "To pump heated drilling fluid",
                "To remain stationary and protect the fragile ice sample from rotational friction",
                "To house the high-voltage electrical wiring"
            ],
            correctAnswer: 2,
            explanation: "The inner barrel stays stationary on a bearing relative to the spinning outer barrel, protecting the fragile ice core from being shattered by friction."
        },
        {
            question: "Why does the outer drill barrel have external spiral flutes?",
            options: [
                "For aerodynamic stability in high winds",
                "To act as an Archimedes screw, augering ice chips upward to clear the bore hole",
                "To improve aesthetic appeal",
                "To conduct static electricity away from the bit"
            ],
            correctAnswer: 1,
            explanation: "The spiral flutes act like an Archimedes screw, lifting the cut ice chips up and away from the drill bit. If they fail, the drill string jams permanently."
        },
        {
            question: "What is the primary function of the Core Catcher mechanism?",
            options: [
                "To catch the entire drill if the winch cable snaps",
                "To grip and snap off the base of the ice core, holding it securely during winch retrieval",
                "To capture satellite data telemetry",
                "To catch excess hydraulic fluid leaks"
            ],
            correctAnswer: 1,
            explanation: "The core catcher is a spring-loaded ring of metal fingers that bites into the bottom of the ice core, breaking it free and holding it during lifting."
        },
        {
            question: "Why does this mobile rig require massive thermal dissipation radiators in sub-zero environments?",
            options: [
                "To provide ambient heat for the operator cabin",
                "To intentionally melt the glacier surface for traction",
                "To dump megawatt engine heat into the air, preventing localized melting of the glacier which could refreeze and trap the drill",
                "To freeze liquid water into solid ice"
            ],
            correctAnswer: 2,
            explanation: "Heavy machinery generates massive heat. Dumping this heat via radiators into the freezing air prevents it from melting the surrounding ice, which could refreeze around the drill and trap it."
        },
        {
            question: "What failure cascade results from a Hydraulic Outrigger failure during drilling?",
            options: [
                "Platform tilt leading to drill string deflection and catastrophic bore-hole jam",
                "Loss of satellite communication array alignment",
                "Immediate winch cable snap",
                "Generator explosion"
            ],
            correctAnswer: 0,
            explanation: "If an outrigger fails, the massive platform tilts. This misaligns the mast, causing the 15-meter drill string to bend and violently jam against the sides of the deeply cut bore hole."
        }
    ];

    let cycle = 0;
    let drillY = 12;
    let drillDir = -1;

    function animate(time, speed) {
        cycle += 0.05 * speed;

        if (meshes.anemometer) {
            meshes.anemometer.rotation.y -= 0.15 * speed;
        }
        
        if (meshes.dish) {
            meshes.dish.rotation.z = Math.sin(cycle * 0.5) * 0.4;
            meshes.dish.rotation.y = Math.cos(cycle * 0.2) * 0.2;
        }

        if (meshes.fans) {
            meshes.fans.forEach(fan => {
                fan.rotation.y += 0.4 * speed;
            });
        }

        if (meshes.exhaustFlap) {
            meshes.exhaustFlap.rotation.x = (Math.PI/4) + (Math.random() * 0.15);
        }

        if (meshes.drillGroup) {
            drillY += drillDir * 0.02 * speed;
            if (drillY < 4) drillDir = 1; 
            if (drillY > 16) drillDir = -1; 
            meshes.drillGroup.position.y = drillY;
            
            if (drillDir === -1) {
                if (meshes.outerBarrel) meshes.outerBarrel.rotation.y += 0.25 * speed;
                if (meshes.gear1) meshes.gear1.rotation.y += 0.35 * speed;
                if (meshes.gear2) meshes.gear2.rotation.y -= 0.55 * speed; 
            }
        }

        if (meshes.winchDrum) {
            meshes.winchDrum.rotation.y = drillY * 0.6; 
        }

        if (meshes.cable && meshes.drillGroup) {
            const cablePath = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-5, 5.5, 3.5),
                new THREE.Vector3(0, 33.3, 0), 
                new THREE.Vector3(0, drillY + 10, 0) 
            ]);
            meshes.cable.geometry.dispose();
            meshes.cable.geometry = new THREE.TubeGeometry(cablePath, 25, 0.08, 8, false);
        }
        
        if (meshes.pulleys) {
            meshes.pulleys.forEach(p => {
                p.rotation.x = drillY * 0.9;
            });
        }
        
        if (meshes.iceCore) {
            iceMaterial.emissiveIntensity = 0.5 + Math.sin(cycle * 3) * 0.3;
        }

        if (meshes.pistons) {
            meshes.pistons.forEach(p => {
                p.piston.position.y = p.baseY + Math.sin(cycle*0.2 + p.offset)*0.05;
            });
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createIceCoreDrill() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
