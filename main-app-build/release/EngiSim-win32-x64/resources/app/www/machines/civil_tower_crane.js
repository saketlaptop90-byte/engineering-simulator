import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "Civil Tower Crane";

    const parts = [];
    const meshes = {};

    // --- CUSTOM ADVANCED MATERIALS ---
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8
    });
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.8
    });
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.8
    });
    const warningYellow = new THREE.MeshStandardMaterial({
        color: 0xffcc00, roughness: 0.4, metalness: 0.6
    });
    const matteBlack = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.9, metalness: 0.1
    });
    const concrete = new THREE.MeshStandardMaterial({
        color: 0x999999, roughness: 1.0, metalness: 0.0
    });

    // --- HELPER FUNCTIONS ---
    function createStrut(p1, p2, radius, mat) {
        const distance = p1.distanceTo(p2);
        const geom = new THREE.CylinderGeometry(radius, radius, distance, 8);
        geom.translate(0, distance / 2, 0);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(p1);
        mesh.lookAt(p2);
        mesh.rotateX(Math.PI / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    function createLatticeBox(width, depth, height, segments, radius, matMain, matDiag) {
        const lattice = new THREE.Group();
        const segH = height / segments;

        const chords = [
            new THREE.Vector3(width / 2, 0, depth / 2),
            new THREE.Vector3(-width / 2, 0, depth / 2),
            new THREE.Vector3(-width / 2, 0, -depth / 2),
            new THREE.Vector3(width / 2, 0, -depth / 2)
        ];

        chords.forEach(c => {
            const geom = new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, height, 12);
            geom.translate(0, height / 2, 0);
            const mesh = new THREE.Mesh(geom, matMain);
            mesh.position.copy(c);
            mesh.castShadow = true;
            lattice.add(mesh);
        });

        for (let i = 0; i < segments; i++) {
            const y1 = i * segH;
            const y2 = (i + 1) * segH;

            for (let j = 0; j < 4; j++) {
                const p1 = chords[j];
                const p2 = chords[(j + 1) % 4];

                lattice.add(createStrut(new THREE.Vector3(p1.x, y1, p1.z), new THREE.Vector3(p2.x, y1, p2.z), radius, matMain));
                lattice.add(createStrut(new THREE.Vector3(p1.x, y1, p1.z), new THREE.Vector3(p2.x, y2, p2.z), radius * 0.8, matDiag));
            }
        }

        for (let j = 0; j < 4; j++) {
            const p1 = chords[j];
            const p2 = chords[(j + 1) % 4];
            lattice.add(createStrut(new THREE.Vector3(p1.x, height, p1.z), new THREE.Vector3(p2.x, height, p2.z), radius, matMain));
        }

        return lattice;
    }

    function createLatticeTriangle(length, width, height, segments, radius, matMain, matDiag) {
        const jib = new THREE.Group();
        const segL = length / segments;

        const ptTC = new THREE.Vector3(0, height, 0);
        const ptBL = new THREE.Vector3(-width / 2, 0, 0);
        const ptBR = new THREE.Vector3(width / 2, 0, 0);

        const createChord = (start) => {
            const geom = new THREE.CylinderGeometry(radius * 1.5, radius * 1.5, length, 12);
            geom.rotateX(Math.PI / 2);
            geom.translate(start.x, start.y, length / 2);
            const mesh = new THREE.Mesh(geom, matMain);
            mesh.castShadow = true;
            jib.add(mesh);
        };
        createChord(ptTC);
        createChord(ptBL);
        createChord(ptBR);

        for (let i = 0; i < segments; i++) {
            const z1 = i * segL;
            const z2 = (i + 1) * segL;

            const tc1 = new THREE.Vector3(ptTC.x, ptTC.y, z1);
            const tc2 = new THREE.Vector3(ptTC.x, ptTC.y, z2);
            const bl1 = new THREE.Vector3(ptBL.x, ptBL.y, z1);
            const bl2 = new THREE.Vector3(ptBL.x, ptBL.y, z2);
            const br1 = new THREE.Vector3(ptBR.x, ptBR.y, z1);
            const br2 = new THREE.Vector3(ptBR.x, ptBR.y, z2);

            jib.add(createStrut(bl1, br1, radius, matMain));
            if(i > 0) jib.add(createStrut(bl1, tc1, radius, matMain));
            if(i > 0) jib.add(createStrut(br1, tc1, radius, matMain));

            jib.add(createStrut(bl1, br2, radius * 0.8, matDiag));
            jib.add(createStrut(bl1, tc2, radius * 0.8, matDiag));
            jib.add(createStrut(br1, tc2, radius * 0.8, matDiag));
        }

        const tcEnd = new THREE.Vector3(ptTC.x, ptTC.y, length);
        const blEnd = new THREE.Vector3(ptBL.x, ptBL.y, length);
        const brEnd = new THREE.Vector3(ptBR.x, ptBR.y, length);
        jib.add(createStrut(blEnd, brEnd, radius, matMain));
        jib.add(createStrut(blEnd, tcEnd, radius, matMain));
        jib.add(createStrut(brEnd, tcEnd, radius, matMain));

        return jib;
    }

    function createPlatform(width, depth, thickness, mat) {
        const plat = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, depth), mat);
        plat.castShadow = true;
        plat.receiveShadow = true;
        for(let i=0; i<10; i++) {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(thickness*0.2, thickness*0.2, width, 8), darkSteel);
            bar.rotation.z = Math.PI/2;
            bar.position.set(0, thickness/2, -depth/2 + (i/9)*depth);
            plat.add(bar);
        }
        return plat;
    }

    const baseGroup = new THREE.Group();
    const concretePad = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 16), concrete);
    concretePad.position.y = 1;
    concretePad.receiveShadow = true;
    baseGroup.add(concretePad);

    const anchorBolts = new THREE.Group();
    for(let x of [-1.5, 1.5]) {
        for(let z of [-1.5, 1.5]) {
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), darkSteel);
            bolt.position.set(x, 2, z);
            anchorBolts.add(bolt);
            const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 6), steel);
            nut.position.set(x, 3.2, z);
            anchorBolts.add(nut);
        }
    }
    baseGroup.add(anchorBolts);
    group.add(baseGroup);
    
    parts.push({
        name: "Base Anchor Platform",
        description: "Massive concrete foundation reinforced with deep steel anchor bolts securing the mast.",
        material: "Concrete & Steel",
        function: "Provides structural stability against immense overturning moments generated by heavy loads.",
        assemblyOrder: 1,
        connections: ["Lattice Mast Assembly"],
        failureEffect: "Catastrophic overturning and total crane collapse.",
        cascadeFailures: ["Entire Crane Structure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    const mastWidth = 3;
    const mastHeightSegment = 6;
    const numMasts = 12;
    const totalMastHeight = numMasts * mastHeightSegment;
    const mastAssembly = new THREE.Group();
    mastAssembly.position.y = 2; 

    for (let i = 0; i < numMasts; i++) {
        const section = createLatticeBox(mastWidth, mastWidth, mastHeightSegment, 2, 0.08, warningYellow, steel);
        section.position.y = i * mastHeightSegment;
        
        const ladderGroup = new THREE.Group();
        const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, mastHeightSegment, 8), darkSteel);
        const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, mastHeightSegment, 8), darkSteel);
        rail1.position.set(1, mastHeightSegment/2, 1);
        rail2.position.set(1.4, mastHeightSegment/2, 1);
        ladderGroup.add(rail1, rail2);
        for(let j=0; j<15; j++) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), darkSteel);
            rung.rotation.z = Math.PI/2;
            rung.position.set(1.2, (j+1) * (mastHeightSegment/16), 1);
            ladderGroup.add(rung);
        }
        section.add(ladderGroup);
        mastAssembly.add(section);
    }
    group.add(mastAssembly);

    parts.push({
        name: "Lattice Mast Assembly",
        description: "Vertical tower comprised of high-tensile steel lattice sections. Features internal safety ladders and rest platforms.",
        material: "High-Tensile Steel",
        function: "Supports the entire slewing structure and lifting payloads, distributing loads down to the base.",
        assemblyOrder: 2,
        connections: ["Base Anchor Platform", "Hydraulic Climbing Frame", "Slewing Ring & Motors"],
        failureEffect: "Buckling of the tower, resulting in complete structural failure.",
        cascadeFailures: ["Slewing Ring", "Operator Cabin", "Jib Systems"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 20, z: -50 }
    });

    const climbingFrame = new THREE.Group();
    const climbHeight = 8;
    climbingFrame.position.y = totalMastHeight - climbHeight - 2;
    const climbOuter = createLatticeBox(mastWidth * 1.3, mastWidth * 1.3, climbHeight, 3, 0.1, steel, darkSteel);
    climbingFrame.add(climbOuter);

    const cylinderGroup = new THREE.Group();
    for(let z of [-1.2, 1.2]) {
        const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), warningYellow);
        casing.position.set(mastWidth/2 + 0.3, 2, z);
        const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 16), chrome);
        piston.position.set(mastWidth/2 + 0.3, 4, z);
        cylinderGroup.add(casing, piston);
    }
    climbingFrame.add(cylinderGroup);
    group.add(climbingFrame);

    parts.push({
        name: "Hydraulic Climbing Frame",
        description: "Telescopic scaffolding wrapper equipped with massive hydraulic rams.",
        material: "Steel & Chrome",
        function: "Pushes the slewing unit upward to allow insertion of new mast sections.",
        assemblyOrder: 3,
        connections: ["Lattice Mast Assembly", "Slewing Ring & Motors"],
        failureEffect: "Inability to increase crane height.",
        cascadeFailures: ["Mast integrity"],
        originalPosition: { x: 0, y: totalMastHeight - climbHeight - 2, z: 0 },
        explodedPosition: { x: -30, y: 40, z: 0 }
    });

    const upperStructure = new THREE.Group();
    upperStructure.position.y = totalMastHeight + 2;
    meshes.upperStructure = upperStructure;
    group.add(upperStructure);

    const slewingRing = new THREE.Group();
    const ringBase = new THREE.Mesh(new THREE.CylinderGeometry(mastWidth/2 + 0.2, mastWidth/2 + 0.2, 0.5, 32), darkSteel);
    const ringRotating = new THREE.Mesh(new THREE.CylinderGeometry(mastWidth/2 + 0.2, mastWidth/2 + 0.2, 0.5, 32), steel);
    ringRotating.position.y = 0.5;
    slewingRing.add(ringBase, ringRotating);
    
    for(let i=0; i<4; i++) {
        const motor = new THREE.Group();
        motor.position.set(Math.cos(i*Math.PI/2)*2, 0.8, Math.sin(i*Math.PI/2)*2);
        const stator = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), matteBlack);
        stator.rotation.x = Math.PI/2;
        const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), steel);
        motor.add(stator, gearbox);
        slewingRing.add(motor);
    }
    
    const slewPlatform = createPlatform(6, 6, 0.1, darkSteel);
    slewPlatform.position.y = 1;
    slewingRing.add(slewPlatform);
    upperStructure.add(slewingRing);

    parts.push({
        name: "Slewing Ring & Motors",
        description: "Heavy-duty rotational bearing system driven by four high-torque planetary gear motors.",
        material: "Forged Steel & Cast Iron",
        function: "Allows full 360-degree continuous rotation of the jib.",
        assemblyOrder: 4,
        connections: ["Lattice Mast Assembly", "Tower Peak (Apex)"],
        failureEffect: "Loss of rotational control. Uncontrolled spinning under wind loads.",
        cascadeFailures: ["Cables", "Load stability"],
        originalPosition: { x: 0, y: totalMastHeight + 2, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-2, 1.5, 2.5); 
    
    const cabShape = new THREE.Shape();
    cabShape.moveTo(0, 0);
    cabShape.lineTo(2.5, 0);
    cabShape.lineTo(3.0, 1.5);
    cabShape.lineTo(2.5, 3.5);
    cabShape.lineTo(0, 3.5);
    cabShape.lineTo(0, 0);
    
    const extrudeCab = { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const cabShell = new THREE.Mesh(new THREE.ExtrudeGeometry(cabShape, extrudeCab), warningYellow);
    cabShell.rotation.y = -Math.PI / 2;
    cabShell.position.set(1, 0, -2.5);
    cabinGroup.add(cabShell);

    const windowGeom = new THREE.PlaneGeometry(2.3, 3);
    const cabWindowFront = new THREE.Mesh(windowGeom, tinted);
    cabWindowFront.position.set(-0.05, 1.8, 1);
    cabWindowFront.rotation.y = -Math.PI/2;
    cabWindowFront.rotation.x = -0.1;
    cabinGroup.add(cabWindowFront);

    const interior = new THREE.Group();
    interior.position.set(0.5, 0.5, -0.5);
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), matteBlack);
    chair.position.set(0, 0.6, 0);
    const controlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.6), plastic);
    controlLeft.position.set(-0.6, 1.0, 0);
    const joyLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), chrome);
    joyLeft.position.set(-0.6, 1.2, 0);
    
    const controlRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.6), plastic);
    controlRight.position.set(0.6, 1.0, 0);
    const joyRight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), chrome);
    joyRight.position.set(0.6, 1.2, 0);

    const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), neonBlue);
    screen1.position.set(0, 1.3, 0.8);
    screen1.rotation.y = Math.PI;
    const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), neonGreen);
    screen2.position.set(-0.6, 1.3, 0.6);
    screen2.rotation.y = Math.PI/1.2;

    meshes.screens = [screen1, screen2];

    interior.add(chair, controlLeft, joyLeft, controlRight, joyRight, screen1, screen2);
    cabinGroup.add(interior);

    const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 1.2), steel);
    acUnit.position.set(1, 3.8, -1.5);
    cabinGroup.add(acUnit);

    upperStructure.add(cabinGroup);

    parts.push({
        name: "Operator Cabin & Interface",
        description: "Climate-controlled, ergonomically designed command center with tinted hyper-glass.",
        material: "Composite Plastics, Steel",
        function: "Houses the operator and provides central control interface.",
        assemblyOrder: 5,
        connections: ["Slewing Ring & Motors"],
        failureEffect: "Loss of direct human control over machinery.",
        cascadeFailures: ["Safe load operation"],
        originalPosition: { x: -2, y: totalMastHeight + 3.5, z: 2.5 },
        explodedPosition: { x: -40, y: 60, z: 40 }
    });

    const apexHeight = 12;
    const apex = new THREE.Group();
    apex.position.y = 1.2; 
    
    const aBaseW = mastWidth + 1;
    const apexTop = new THREE.Vector3(0, apexHeight, 0);
    const aBL = new THREE.Vector3(-aBaseW/2, 0, -aBaseW/2);
    const aBR = new THREE.Vector3(aBaseW/2, 0, -aBaseW/2);
    const aFL = new THREE.Vector3(-aBaseW/2, 0, aBaseW/2);
    const aFR = new THREE.Vector3(aBaseW/2, 0, aBaseW/2);

    apex.add(createStrut(aBL, apexTop, 0.1, warningYellow));
    apex.add(createStrut(aBR, apexTop, 0.1, warningYellow));
    apex.add(createStrut(aFL, apexTop, 0.1, warningYellow));
    apex.add(createStrut(aFR, apexTop, 0.1, warningYellow));

    for(let i=1; i<4; i++) {
        const y = (i/4)*apexHeight;
        const scale = 1 - (i/4);
        const w = aBaseW * scale;
        const p1 = new THREE.Vector3(-w/2, y, -w/2);
        const p2 = new THREE.Vector3(w/2, y, -w/2);
        const p3 = new THREE.Vector3(w/2, y, w/2);
        const p4 = new THREE.Vector3(-w/2, y, w/2);
        apex.add(createStrut(p1, p2, 0.06, steel));
        apex.add(createStrut(p2, p3, 0.06, steel));
        apex.add(createStrut(p3, p4, 0.06, steel));
        apex.add(createStrut(p4, p1, 0.06, steel));
    }
    
    const avLight = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), neonRed);
    avLight.position.copy(apexTop);
    meshes.avLights = [avLight];
    apex.add(avLight);

    upperStructure.add(apex);

    parts.push({
        name: "Tower Peak (Apex)",
        description: "A-frame pyramidal lattice structure extending above the slewing ring.",
        material: "High-Tensile Steel",
        function: "Provides a high anchor point for the tension pendants.",
        assemblyOrder: 6,
        connections: ["Slewing Ring", "Tension Pendants"],
        failureEffect: "Collapse of both jibs.",
        cascadeFailures: ["Main Jib Lattice", "Counter-Jib Assembly"],
        originalPosition: { x: 0, y: totalMastHeight + 8, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    const cJibLength = 22;
    const cJibWidth = 2.5;
    const cJibHeight = 2.0;
    const counterJibGroup = new THREE.Group();
    counterJibGroup.rotation.y = Math.PI;
    counterJibGroup.position.set(0, 2, 0);

    const cJibLattice = createLatticeBox(cJibWidth, cJibLength, cJibHeight, 6, 0.08, steel, darkSteel);
    cJibLattice.position.set(0, 0, cJibLength/2);
    counterJibGroup.add(cJibLattice);

    const cWalkway = createPlatform(cJibWidth, cJibLength, 0.1, darkSteel);
    cWalkway.position.set(0, 0, cJibLength/2);
    counterJibGroup.add(cWalkway);

    const counterweights = new THREE.Group();
    counterweights.position.set(0, 0, cJibLength - 2);
    for(let i=0; i<6; i++) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(cJibWidth+0.5, 1.8, 0.8), concrete);
        block.position.z = i * -1.0;
        block.castShadow = true;
        counterweights.add(block);
    }
    counterJibGroup.add(counterweights);

    const hoistGroup = new THREE.Group();
    hoistGroup.position.set(0, cJibHeight/2 + 0.5, cJibLength - 8);
    
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.0, 32), darkSteel);
    drum.rotation.z = Math.PI/2;
    for(let i=0; i<20; i++) {
        const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.61, 0.02, 8, 32), matteBlack);
        wrap.rotation.y = Math.PI/2;
        wrap.position.x = -0.9 + i*0.1;
        drum.add(wrap);
    }
    meshes.hoistDrum = drum;
    
    const hoistMotor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.5), warningYellow);
    hoistMotor.position.set(1.6, 0, 0);
    const cooler = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 16), chrome);
    cooler.rotation.x = Math.PI/2;
    cooler.position.set(2.5, 0, 0);
    
    hoistGroup.add(drum, hoistMotor, cooler);
    counterJibGroup.add(hoistGroup);

    upperStructure.add(counterJibGroup);

    parts.push({
        name: "Counter-Jib & Hoist Assemblies",
        description: "Rear-extending reinforced lattice supporting massive concrete counterweights.",
        material: "Steel & Concrete",
        function: "Balances the structural load of the main jib.",
        assemblyOrder: 7,
        connections: ["Slewing Ring", "Tower Peak (Apex)"],
        failureEffect: "Extreme center-of-gravity shift causing crane collapse.",
        cascadeFailures: ["Base Anchor Platform", "Mast"],
        originalPosition: { x: 0, y: totalMastHeight + 4, z: -10 },
        explodedPosition: { x: 0, y: 50, z: -60 }
    });

    const mJibLength = 65;
    const mJibWidth = 2.5;
    const mJibHeight = 2.5;
    const mainJibGroup = new THREE.Group();
    mainJibGroup.position.set(0, 2, 0);

    const mJibLattice = createLatticeTriangle(mJibLength, mJibWidth, mJibHeight, 20, 0.08, warningYellow, steel);
    mainJibGroup.add(mJibLattice);

    const jWalkway = createPlatform(0.8, mJibLength, 0.05, darkSteel);
    jWalkway.position.set(0, 0.1, mJibLength/2);
    mainJibGroup.add(jWalkway);

    const trolley = new THREE.Group();
    meshes.trolley = trolley;
    
    const tFrame = new THREE.Mesh(new THREE.BoxGeometry(mJibWidth + 0.2, 0.4, 2), darkSteel);
    trolley.add(tFrame);
    
    for(let x of [-mJibWidth/2, mJibWidth/2]) {
        for(let z of [-0.8, 0.8]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), chrome);
            wheel.rotation.z = Math.PI/2;
            wheel.position.set(x, 0.3, z);
            trolley.add(wheel);
        }
    }
    
    const tSheave1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), steel);
    tSheave1.rotation.z = Math.PI/2;
    tSheave1.position.set(-0.3, -0.2, 0);
    const tSheave2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), steel);
    tSheave2.rotation.z = Math.PI/2;
    tSheave2.position.set(0.3, -0.2, 0);
    trolley.add(tSheave1, tSheave2);

    trolley.position.set(0, -0.3, 10);
    mainJibGroup.add(trolley);

    const tWinch = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16), steel);
    tWinch.rotation.z = Math.PI/2;
    tWinch.position.set(0, 0.5, 1);
    mainJibGroup.add(tWinch);

    upperStructure.add(mainJibGroup);

    parts.push({
        name: "Main Jib & Trolley Mechanism",
        description: "Ultra-long triangular lattice boom equipped with rails for a motorized traversing trolley.",
        material: "High-Tensile Steel Alloys",
        function: "Extends horizontal reach and translates load position outward and inward.",
        assemblyOrder: 8,
        connections: ["Slewing Ring", "Tension Pendants"],
        failureEffect: "Jib snapping, dropping payload and trolley.",
        cascadeFailures: ["Hook Block", "Payload"],
        originalPosition: { x: 0, y: totalMastHeight + 4, z: 20 },
        explodedPosition: { x: 0, y: 60, z: 80 }
    });

    const hookBlockGroup = new THREE.Group();
    meshes.hookBlock = hookBlockGroup;
    
    const hBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.8), warningYellow);
    hookBlockGroup.add(hBody);
    
    for(let x of [-0.3, 0.3]) {
        const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16), chrome);
        sheave.rotation.z = Math.PI/2;
        sheave.position.set(x, 0, 0);
        hookBlockGroup.add(sheave);
    }

    const hookShape = new THREE.Shape();
    hookShape.moveTo(0, 0);
    hookShape.bezierCurveTo( 0.4, 0, 0.5, -0.5, 0, -1 );
    hookShape.bezierCurveTo( -0.6, -1.5, -0.8, -0.5, -0.4, -0.2 );
    hookShape.lineTo(-0.2, -0.4);
    hookShape.bezierCurveTo( -0.4, -0.6, -0.4, -1.0, 0, -0.8 );
    hookShape.bezierCurveTo( 0.2, -0.6, 0.2, -0.2, 0, -0.2 );
    hookShape.lineTo(0, 0);

    const hookExtrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const theHook = new THREE.Mesh(new THREE.ExtrudeGeometry(hookShape, hookExtrudeSettings), steel);
    theHook.position.set(-0.075, -0.5, 0);
    
    const swivel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4), chrome);
    swivel.position.set(0, -0.7, 0);
    
    hookBlockGroup.add(theHook, swivel);
    hookBlockGroup.position.set(0, -10, 10);
    mainJibGroup.add(hookBlockGroup);

    parts.push({
        name: "Heavy Lift Hook Block",
        description: "Multi-sheave pulley block with a forged steel swivel hook.",
        material: "Forged Heavy Steel",
        function: "Connects directly to payloads and multiplies lifting force via mechanical advantage.",
        assemblyOrder: 9,
        connections: ["Steel Cables (Hoist)"],
        failureEffect: "Immediate payload drop, catastrophic ground damage.",
        cascadeFailures: ["Payload"],
        originalPosition: { x: 0, y: totalMastHeight - 6, z: 20 },
        explodedPosition: { x: 0, y: 10, z: 60 }
    });

    const pendants = new THREE.Group();
    
    const cJibTiePoints = [10, 18];
    cJibTiePoints.forEach(dist => {
        const tip = new THREE.Vector3(0, 1.2 + apexHeight, 0);
        const target = new THREE.Vector3(0, 2 + cJibHeight, -dist);
        pendants.add(createStrut(tip, target, 0.06, darkSteel));
    });

    const mJibTiePoints = [20, 40, 60];
    mJibTiePoints.forEach(dist => {
        const tip = new THREE.Vector3(0, 1.2 + apexHeight, 0);
        const target = new THREE.Vector3(0, 2 + mJibHeight, dist);
        const t1 = target.clone().add(new THREE.Vector3(0.5, 0, 0));
        const t2 = target.clone().add(new THREE.Vector3(-0.5, 0, 0));
        const tip1 = tip.clone().add(new THREE.Vector3(0.5, 0, 0));
        const tip2 = tip.clone().add(new THREE.Vector3(-0.5, 0, 0));
        pendants.add(createStrut(tip1, t1, 0.05, steel));
        pendants.add(createStrut(tip2, t2, 0.05, steel));
    });
    
    upperStructure.add(pendants);

    parts.push({
        name: "Tension Pendants (Tie Bars)",
        description: "Solid steel rods bridging the tower apex to the jibs.",
        material: "Solid High-Grade Steel",
        function: "Maintains jib geometry under heavy load, preventing snapping or sagging.",
        assemblyOrder: 10,
        connections: ["Tower Peak (Apex)", "Main Jib", "Counter-Jib"],
        failureEffect: "Immediate jib structural failure and collapse.",
        cascadeFailures: ["Jibs", "Load"],
        originalPosition: { x: 0, y: totalMastHeight + 10, z: 0 },
        explodedPosition: { x: 30, y: 90, z: 0 }
    });

    const cableGroup = new THREE.Group();
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1.0 });
    const cHoistToTrolley = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), ropeMat);
    const cTrolleyToHook1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1), ropeMat);
    const cTrolleyToHook2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1), ropeMat);
    
    cHoistToTrolley.geometry.translate(0, 0.5, 0);
    cTrolleyToHook1.geometry.translate(0, 0.5, 0);
    cTrolleyToHook2.geometry.translate(0, 0.5, 0);
    
    cableGroup.add(cHoistToTrolley, cTrolleyToHook1, cTrolleyToHook2);
    upperStructure.add(cableGroup);
    
    meshes.cables = {
        hoistLine: cHoistToTrolley,
        dropLine1: cTrolleyToHook1,
        dropLine2: cTrolleyToHook2
    };

    const avLightRear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neonRed);
    avLightRear.position.set(0, 2, cJibLength);
    counterJibGroup.add(avLightRear);
    
    const avLightFront = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neonRed);
    avLightFront.position.set(0, mJibHeight, mJibLength);
    mainJibGroup.add(avLightFront);
    
    meshes.avLights.push(avLightRear, avLightFront);

    const description = "The Civil Tower Crane is a hyper-realistic, massively complex engineering marvel used in towering construction projects. It balances extreme cantilevered loads using a heavily engineered counter-jib and concrete blocks. Precision electric planetary motors drive the slewing ring, while a motorized trolley glides along the triangulated main jib lattice. Hydraulic climbing frames allow the mast to literally build itself upwards. Every detail, from the tinted operator cabin with dual telemetry joysticks to the dynamic tension pendants and aviation warning lights, showcases peak civil engineering structural dynamics.";

    const quizQuestions = [
        {
            question: "What component allows the tower crane to rotate 360 degrees continuously?",
            options: ["Hydraulic Climbing Frame", "Slewing Ring & Motors", "Tension Pendants", "Trolley Mechanism"],
            correctAnswer: 1,
            explanation: "The Slewing Ring & Motors consist of a massive rotational bearing and planetary gears that enable the entire upper structure to pivot."
        },
        {
            question: "How does the tower crane increase its height during skyscraper construction?",
            options: ["Adding sections to the top via helicopter", "Hydraulic Climbing Frame", "Extending a telescopic boom", "Adding sections to the bottom"],
            correctAnswer: 1,
            explanation: "The Hydraulic Climbing Frame wraps around the mast, pushing the upper slewing unit upward to create space for a new mast section to be bolted in."
        },
        {
            question: "What is the primary function of the Tension Pendants (Tie Bars)?",
            options: ["Supply electricity to the trolley", "Prevent the mast from bending", "Transfer bending moments from jibs to the Apex", "Act as a lightning rod"],
            correctAnswer: 2,
            explanation: "Tension pendants bridge the tower Apex to the jibs, transferring massive bending moments and keeping the long cantilevered booms structurally sound."
        },
        {
            question: "Why does the main jib use a triangular lattice structure?",
            options: ["Aesthetic appeal", "Provides high strength-to-weight ratio and aerodynamic stability", "Cheaper to manufacture", "To store rainwater"],
            correctAnswer: 1,
            explanation: "A triangular lattice offers an optimal strength-to-weight ratio, resisting both vertical loads from lifting and horizontal loads from high altitude winds."
        },
        {
            question: "What connects the trolley to the heavy lift hook block?",
            options: ["Solid steel columns", "Carbon fiber rods", "Multi-reeved steel cables (Drop Lines)", "Magnetic levitation"],
            correctAnswer: 2,
            explanation: "High-tensile steel wire ropes pass through sheaves on the trolley down to the hook block, forming a mechanical advantage system to lift extreme tonnage."
        }
    ];

    function animate(time, speed, meshesObj) {
        if (meshesObj.upperStructure) {
            meshesObj.upperStructure.rotation.y = time * 0.2 * speed;
        }

        let trolleyZ = 10 + (Math.sin(time * 0.5 * speed) + 1) * 20; 
        if (meshesObj.trolley) {
            meshesObj.trolley.position.z = trolleyZ;
        }

        let hookDrop = -5 - (Math.cos(time * 0.7 * speed) + 1) * 15; 
        if (meshesObj.hookBlock) {
            meshesObj.hookBlock.position.z = trolleyZ; 
            meshesObj.hookBlock.position.y = hookDrop;
        }

        if (meshesObj.hoistDrum) {
            meshesObj.hoistDrum.rotation.y = time * 2 * speed;
        }

        if (meshesObj.cables) {
            const c = meshesObj.cables;
            const hoistDrumPos = new THREE.Vector3(0, 3, -8); 
            const trolleyPos = new THREE.Vector3(0, 1.7, trolleyZ);
            
            const dirHT = new THREE.Vector3().subVectors(trolleyPos, hoistDrumPos);
            const distHT = dirHT.length();
            if(distHT > 0.01) {
                c.hoistLine.position.copy(hoistDrumPos);
                c.hoistLine.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dirHT.clone().normalize());
                c.hoistLine.scale.set(1, distHT, 1);
            }

            const hookPos1 = new THREE.Vector3(-0.3, hookDrop + 2.5, trolleyZ);
            const hookPos2 = new THREE.Vector3(0.3, hookDrop + 2.5, trolleyZ);
            const tPos1 = new THREE.Vector3(-0.3, 1.5, trolleyZ);
            const tPos2 = new THREE.Vector3(0.3, 1.5, trolleyZ);

            const distD1 = tPos1.distanceTo(hookPos1);
            if (distD1 > 0.01) {
                c.dropLine1.position.copy(hookPos1);
                c.dropLine1.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(0,1,0));
                c.dropLine1.scale.set(1, distD1, 1);
            }

            const distD2 = tPos2.distanceTo(hookPos2);
            if (distD2 > 0.01) {
                c.dropLine2.position.copy(hookPos2);
                c.dropLine2.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(0,1,0));
                c.dropLine2.scale.set(1, distD2, 1);
            }
        }

        if (meshesObj.screens) {
            const intensity = 1.5 + Math.sin(time * 5) * 0.5;
            meshesObj.screens.forEach(s => {
                s.material.emissiveIntensity = intensity;
            });
        }

        if (meshesObj.avLights) {
            const blink = (Math.sin(time * 4) > 0.7) ? 3.0 : 0.5;
            meshesObj.avLights.forEach(l => {
                l.material.emissiveIntensity = blink;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createTowerCrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
