import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = { aviationLights: [], hoistLines: [], wheels: [], gears: [] };

    const description = "Ultra High-Tech Hyper-Realistic Modern Tower Crane. Features a massive multi-section lattice mast, climbing cage for telescoping, articulated slewing gear unit, immense triangular lattice main jib, counter-jib with heavy cast-iron ballast, fully animated trolley system, heavy-duty hoist drum, and a precision operator cab equipped with glowing telemetry screens and dual joysticks. Engineered to distribute maximum payload stresses while maintaining absolute structural equilibrium.";

    // Custom hyper-realistic emissive materials
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.8 });
    const warningYellow = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.8 });

    // --- MAIN GROUPS ---
    const baseGroup = new THREE.Group();
    const mastGroup = new THREE.Group();
    const climbingCageGroup = new THREE.Group();
    const slewingGroup = new THREE.Group();
    const jibGroup = new THREE.Group();
    const counterJibGroup = new THREE.Group();
    const trolleyGroup = new THREE.Group();
    const hookGroup = new THREE.Group();
    const cabGroup = new THREE.Group();
    const catheadGroup = new THREE.Group();

    group.add(baseGroup);
    group.add(mastGroup);
    mastGroup.add(climbingCageGroup);
    mastGroup.add(slewingGroup);
    
    slewingGroup.add(jibGroup);
    slewingGroup.add(counterJibGroup);
    slewingGroup.add(cabGroup);
    slewingGroup.add(catheadGroup);
    
    meshes.slewingUnit = slewingGroup;

    // --- HELPER FUNCTIONS ---

    function createLatticeBox(width, depth, height, chordMat, braceMat) {
        const section = new THREE.Group();
        const chordRadius = width * 0.04;
        const braceRadius = width * 0.02;
        
        const chordGeo = new THREE.CylinderGeometry(chordRadius, chordRadius, height, 16);
        const positions = [
            [width/2, depth/2], [width/2, -depth/2],
            [-width/2, depth/2], [-width/2, -depth/2]
        ];
        
        positions.forEach(pos => {
            const chord = new THREE.Mesh(chordGeo, chordMat);
            chord.position.set(pos[0], 0, pos[1]);
            chord.castShadow = true;
            chord.receiveShadow = true;
            section.add(chord);
        });

        const hGeoW = new THREE.CylinderGeometry(braceRadius, braceRadius, width, 8);
        const hGeoD = new THREE.CylinderGeometry(braceRadius, braceRadius, depth, 8);
        const diagLenW = Math.sqrt(width*width + height*height);
        const diagLenD = Math.sqrt(depth*depth + height*height);
        const dGeoW = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLenW, 8);
        const dGeoD = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLenD, 8);
        const angleW = Math.atan2(width, height);
        const angleD = Math.atan2(depth, height);

        for (let y of [-height/2, height/2]) {
            for (let z of [depth/2, -depth/2]) {
                const h = new THREE.Mesh(hGeoW, braceMat);
                h.rotation.z = Math.PI / 2;
                h.position.set(0, y, z);
                section.add(h);
                
                const d1 = new THREE.Mesh(dGeoW, braceMat);
                d1.rotation.z = angleW;
                d1.position.set(0, 0, z);
                section.add(d1);
                
                const d2 = new THREE.Mesh(dGeoW, braceMat);
                d2.rotation.z = -angleW;
                d2.position.set(0, 0, z);
                section.add(d2);
            }
            for (let x of [width/2, -width/2]) {
                const h = new THREE.Mesh(hGeoD, braceMat);
                h.rotation.x = Math.PI / 2;
                h.position.set(x, y, 0);
                section.add(h);

                const d1 = new THREE.Mesh(dGeoD, braceMat);
                d1.rotation.x = angleD;
                d1.position.set(x, 0, 0);
                section.add(d1);
                
                const d2 = new THREE.Mesh(dGeoD, braceMat);
                d2.rotation.x = -angleD;
                d2.position.set(x, 0, 0);
                section.add(d2);
            }
        }
        return section;
    }

    function createTriangularLattice(length, width, height, chordMat, braceMat) {
        const section = new THREE.Group();
        const chordRadius = width * 0.05;
        const braceRadius = width * 0.025;

        const chordGeo = new THREE.CylinderGeometry(chordRadius, chordRadius, length, 16);
        const chordPositions = [
            [0, height/2, width/2], 
            [0, height/2, -width/2],
            [0, -height/2, 0]
        ];
        
        chordPositions.forEach(pos => {
            const chord = new THREE.Mesh(chordGeo, chordMat);
            chord.rotation.z = Math.PI / 2;
            chord.position.set(pos[0], pos[1], pos[2]);
            chord.castShadow = true;
            section.add(chord);
        });

        const numBays = Math.floor(length / (height * 1.5));
        const bayLen = length / numBays;

        const strutGeoT = new THREE.CylinderGeometry(braceRadius, braceRadius, width, 8);
        const diagLenT = Math.sqrt(bayLen*bayLen + width*width);
        const diagGeoT = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLenT, 8);
        
        const sideHyp = Math.sqrt(Math.pow(height, 2) + Math.pow(width/2, 2));
        const strutGeoS = new THREE.CylinderGeometry(braceRadius, braceRadius, sideHyp, 8);
        const diagLenS = Math.sqrt(bayLen*bayLen + sideHyp*sideHyp);
        const diagGeoS = new THREE.CylinderGeometry(braceRadius, braceRadius, diagLenS, 8);

        for (let i = 0; i < numBays; i++) {
            const xCenter = -length/2 + i * bayLen + bayLen/2;
            const xEdge1 = -length/2 + i * bayLen;
            const xEdge2 = -length/2 + (i+1) * bayLen;

            // Top struts & diagonals
            const tStrut = new THREE.Mesh(strutGeoT, braceMat);
            tStrut.rotation.x = Math.PI / 2;
            tStrut.position.set(xEdge1, height/2, 0);
            section.add(tStrut);

            const tDiag = new THREE.Mesh(diagGeoT, braceMat);
            tDiag.rotation.x = Math.PI / 2;
            tDiag.rotation.z = Math.atan2(width, bayLen) * (i%2===0?1:-1);
            tDiag.position.set(xCenter, height/2, 0);
            section.add(tDiag);

            // Front side
            const sStrutF = new THREE.Mesh(strutGeoS, braceMat);
            sStrutF.rotation.x = -Math.atan2(height, width/2);
            sStrutF.position.set(xEdge1, 0, width/4);
            section.add(sStrutF);

            const sDiagF = new THREE.Mesh(diagGeoS, braceMat);
            const p1F = new THREE.Vector3(xEdge1, height/2, width/2);
            const p2F = new THREE.Vector3(xEdge2, -height/2, 0);
            if (i%2===1) { p1F.set(xEdge2, height/2, width/2); p2F.set(xEdge1, -height/2, 0); }
            sDiagF.position.copy(p1F).add(p2F).multiplyScalar(0.5);
            sDiagF.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2F.clone().sub(p1F).normalize());
            section.add(sDiagF);

            // Back side
            const sStrutB = new THREE.Mesh(strutGeoS, braceMat);
            sStrutB.rotation.x = Math.atan2(height, width/2);
            sStrutB.position.set(xEdge1, 0, -width/4);
            section.add(sStrutB);

            const p1B = new THREE.Vector3(xEdge1, height/2, -width/2);
            const p2B = new THREE.Vector3(xEdge2, -height/2, 0);
            if (i%2===1) { p1B.set(xEdge2, height/2, -width/2); p2B.set(xEdge1, -height/2, 0); }
            const sDiagB = new THREE.Mesh(diagGeoS, braceMat);
            sDiagB.position.copy(p1B).add(p2B).multiplyScalar(0.5);
            sDiagB.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p2B.clone().sub(p1B).normalize());
            section.add(sDiagB);
        }
        const tStrutEnd = new THREE.Mesh(strutGeoT, braceMat);
        tStrutEnd.rotation.x = Math.PI / 2;
        tStrutEnd.position.set(length/2, height/2, 0);
        section.add(tStrutEnd);
        
        return section;
    }

    function createLadder(length) {
        const lGrp = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.04, 0.04, length, 8);
        const rail1 = new THREE.Mesh(railGeo, steel); rail1.position.x = -0.3;
        const rail2 = new THREE.Mesh(railGeo, steel); rail2.position.x = 0.3;
        lGrp.add(rail1, rail2);
        
        const rungGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const numRungs = Math.floor(length / 0.35);
        for (let i = 0; i <= numRungs; i++) {
            const rung = new THREE.Mesh(rungGeo, aluminum);
            rung.rotation.z = Math.PI / 2;
            rung.position.y = -length/2 + i * 0.35;
            lGrp.add(rung);
        }
        return lGrp;
    }

    function createPlatform(width, depth) {
        const plat = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, depth), steel);
        const railHeight = 1.2;
        const postGeo = new THREE.CylinderGeometry(0.04, 0.04, railHeight, 8);
        const hRailGeoW = new THREE.CylinderGeometry(0.04, 0.04, width, 8);
        const hRailGeoD = new THREE.CylinderGeometry(0.04, 0.04, depth, 8);
        
        const positions = [
            [width/2-0.1, depth/2-0.1], [width/2-0.1, -depth/2+0.1],
            [-width/2+0.1, depth/2-0.1], [-width/2+0.1, -depth/2+0.1]
        ];
        positions.forEach(p => {
            const post = new THREE.Mesh(postGeo, aluminum);
            post.position.set(p[0], railHeight/2, p[1]);
            plat.add(post);
        });
        const r1 = new THREE.Mesh(hRailGeoW, aluminum); r1.rotation.z = Math.PI/2; r1.position.set(0, railHeight, depth/2-0.1); plat.add(r1);
        const r2 = new THREE.Mesh(hRailGeoW, aluminum); r2.rotation.z = Math.PI/2; r2.position.set(0, railHeight, -depth/2+0.1); plat.add(r2);
        const r3 = new THREE.Mesh(hRailGeoD, aluminum); r3.rotation.x = Math.PI/2; r3.position.set(width/2-0.1, railHeight, 0); plat.add(r3);
        const r4 = new THREE.Mesh(hRailGeoD, aluminum); r4.rotation.x = Math.PI/2; r4.position.set(-width/2+0.1, railHeight, 0); plat.add(r4);
        return plat;
    }

    function createCable(p1, p2, radius, mat) {
        const dist = p1.distanceTo(p2);
        const geo = new THREE.CylinderGeometry(radius, radius, dist, 12);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
        return mesh;
    }

    // --- CONSTRUCTION ---

    // 1. Base Foundation
    const centralBlock = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), darkSteel);
    centralBlock.position.y = 1;
    baseGroup.add(centralBlock);
    
    const legGeo = new THREE.BoxGeometry(12, 1, 1.2);
    const leg1 = new THREE.Mesh(legGeo, steel); leg1.position.y = 0.5;
    const leg2 = new THREE.Mesh(legGeo, steel); leg2.rotation.y = Math.PI / 2; leg2.position.y = 0.5;
    baseGroup.add(leg1, leg2);
    
    const balGeo = new THREE.BoxGeometry(2.5, 2, 2.5);
    const bPos = [[5, 1.5, 0], [-5, 1.5, 0], [0, 1.5, 5], [0, 1.5, -5]];
    bPos.forEach(p => {
        const bal = new THREE.Mesh(balGeo, darkSteel);
        bal.position.set(...p);
        baseGroup.add(bal);
    });

    // 2. Tower Mast
    const mastHeight = 40;
    const sectionHeight = 4;
    const numSections = mastHeight / sectionHeight;
    for (let i = 0; i < numSections; i++) {
        const mSec = createLatticeBox(2.5, 2.5, sectionHeight, steel, steel);
        mSec.position.y = 2 + (i * sectionHeight) + (sectionHeight/2);
        mastGroup.add(mSec);
        
        const ladder = createLadder(sectionHeight);
        ladder.position.set(1.1, 2 + (i * sectionHeight) + (sectionHeight/2), 1.25);
        mastGroup.add(ladder);
        
        if (i > 0 && i % 3 === 0) {
            const plat = createPlatform(2.4, 1.2);
            plat.position.set(0, 2 + i * sectionHeight, 1.8);
            mastGroup.add(plat);
        }
    }

    // Hydraulic/Power lines up the mast
    const powerLineGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const pLine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, mastHeight, 8), copper);
        pLine.position.set(-1.1 + i*0.15, 2 + mastHeight/2, -1.2);
        powerLineGroup.add(pLine);
    }
    mastGroup.add(powerLineGroup);

    // 3. Climbing Cage
    const cage = createLatticeBox(3.0, 3.0, 6, aluminum, aluminum);
    cage.position.y = mastHeight - 1; 
    climbingCageGroup.add(cage);
    
    // Hydraulic piston for climbing cage
    const pistonCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), darkSteel);
    pistonCyl.position.set(-1.3, mastHeight - 3, 0);
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 16), chrome);
    pistonRod.position.set(-1.3, mastHeight - 1, 0);
    climbingCageGroup.add(pistonCyl, pistonRod);

    // 4. Slewing Unit
    slewingGroup.position.y = mastHeight + 2;
    const ringMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32), chrome);
    slewingGroup.add(ringMesh);
    
    for (let i = 0; i < 4; i++) {
        const mGrp = new THREE.Group();
        const mBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16), copper);
        mBody.rotation.x = Math.PI / 2;
        const gBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), darkSteel);
        gBox.position.y = -0.3;
        mGrp.add(mBody, gBox);
        const angle = i * Math.PI / 2 + Math.PI/4;
        mGrp.position.set(Math.cos(angle)*1.3, 0.3, Math.sin(angle)*1.3);
        slewingGroup.add(mGrp);
    }

    // 5. Cathead (Apex)
    catheadGroup.position.set(0, 0.5, 0);
    const apexHeight = 12;
    const catPositions = [[1.25, 1.25], [1.25, -1.25], [-1.25, 1.25], [-1.25, -1.25]];
    catPositions.forEach(p => {
        const p1 = new THREE.Vector3(p[0], 0, p[1]);
        const p2 = new THREE.Vector3(0, apexHeight, 0);
        catheadGroup.add(createCable(p1, p2, 0.15, steel)); 
    });
    const topPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16), darkSteel);
    topPulley.rotation.x = Math.PI/2;
    topPulley.position.set(0, apexHeight, 0);
    catheadGroup.add(topPulley);
    
    const anemometer = new THREE.Group();
    const mastSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), plastic);
    mastSpire.position.y = 0.75;
    const spinner = new THREE.Group();
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), plastic); arm1.rotation.z = Math.PI/2;
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), plastic); arm2.rotation.x = Math.PI/2;
    spinner.add(arm1, arm2);
    spinner.position.y = 1.2;
    anemometer.add(mastSpire, spinner);
    anemometer.position.set(0, apexHeight + 0.4, 0);
    catheadGroup.add(anemometer);
    meshes.anemometer = spinner;
    
    const wLight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neonRed);
    wLight.position.set(0, apexHeight + 2.0, 0);
    catheadGroup.add(wLight);
    meshes.aviationLights.push(wLight);

    // 6. Cab Assembly
    cabGroup.position.set(1.8, 0, 1.8);
    cabGroup.rotation.y = -Math.PI/4;
    const cabFloor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.8), darkSteel);
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.8), aluminum); cabRoof.position.y = 2.6;
    const cabBack = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 1.8), aluminum); cabBack.position.set(-1.05, 1.3, 0);
    const cabSide1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.1), aluminum); cabSide1.position.set(0, 0.6, 0.85);
    const cabSide2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.1), aluminum); cabSide2.position.set(0, 0.6, -0.85);
    const cabWin1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.1), tinted); cabWin1.position.set(0, 1.9, 0.85);
    const cabWin2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.1), tinted); cabWin2.position.set(0, 1.9, -0.85);
    const cabFrontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 1.8), tinted); cabFrontGlass.position.set(1.05, 1.3, 0);
    
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), rubber); seat.position.set(-0.4, 0.3, 0);
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.6), rubber); backrest.position.set(-0.7, 0.9, 0);
    const stick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), plastic); stick1.position.set(-0.1, 0.7, 0.5);
    const stick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), plastic); stick2.position.set(-0.1, 0.7, -0.5);
    const monitor1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.7), screenGlow); monitor1.position.set(0.4, 1.0, 0.3); monitor1.rotation.y = -Math.PI / 6;
    const monitor2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.7), screenGlow); monitor2.position.set(0.4, 1.0, -0.3); monitor2.rotation.y = Math.PI / 6;
    
    cabGroup.add(cabFloor, cabRoof, cabBack, cabSide1, cabSide2, cabWin1, cabWin2, cabFrontGlass);
    cabGroup.add(seat, backrest, stick1, stick2, monitor1, monitor2);

    // 7. Counter-Jib
    counterJibGroup.position.set(0, 0.5, 0);
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 0.3), darkSteel); b1.position.set(-9, 0, 1.4);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 0.3), darkSteel); b2.position.set(-9, 0, -1.4);
    counterJibGroup.add(b1, b2);
    for (let i=0; i<=6; i++) {
        const cb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 2.8), darkSteel); cb.position.set(-i*3, 0, 0);
        counterJibGroup.add(cb);
    }
    const walk = new THREE.Mesh(new THREE.BoxGeometry(18, 0.05, 1.2), aluminum); walk.position.set(-9, 0.3, 0);
    counterJibGroup.add(walk);
    
    // Handrails on Counter-Jib
    for (let i=0; i<=9; i++) {
        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.2), steel); p1.position.set(-i*2, 0.9, 1.3);
        const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.2), steel); p2.position.set(-i*2, 0.9, -1.3);
        counterJibGroup.add(p1, p2);
    }
    const hr1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,18), steel); hr1.rotation.z=Math.PI/2; hr1.position.set(-9, 1.5, 1.3);
    const hr2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,18), steel); hr2.rotation.z=Math.PI/2; hr2.position.set(-9, 1.5, -1.3);
    counterJibGroup.add(hr1, hr2);

    const cwGroup = new THREE.Group();
    const cwGeo = new THREE.BoxGeometry(1.8, 3.5, 2.8);
    for(let i=0; i<5; i++) {
        const block = new THREE.Mesh(cwGeo, darkSteel); 
        block.position.set(-16 + i*1.9, 2.0, 0);
        cwGroup.add(block);
    }
    counterJibGroup.add(cwGroup);

    // Hoist Machinery
    const hoistMachinery = new THREE.Group();
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.8, 32), chrome);
    drum.rotation.x = Math.PI / 2; drum.position.set(0, 1.0, 0);
    const drumMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 16), copper);
    drumMotor.rotation.x = Math.PI / 2; drumMotor.position.set(0, 1.0, -1.5);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 3.0), steel); frame.position.set(0, 0.6, 0);
    hoistMachinery.add(drum, drumMotor, frame);
    hoistMachinery.position.set(-7, 0.5, 0);
    counterJibGroup.add(hoistMachinery);
    meshes.hoistDrum = drum;

    // 8. Main Jib
    jibGroup.position.set(0, 0.5, 0);
    const jibLength = 55;
    const jibLattice = createTriangularLattice(jibLength, 2.5, 2.5, steel, steel);
    jibLattice.position.set(jibLength/2, 1.25, 0); 
    jibGroup.add(jibLattice);

    // 9. Trolley and Hook
    const trolleyFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 2.0), aluminum);
    trolleyGroup.add(trolleyFrame);
    
    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
    const wPositions = [[0.6, 0.35, 1.05], [0.6, 0.35, -1.05], [-0.6, 0.35, 1.05], [-0.6, 0.35, -1.05]];
    wPositions.forEach(p => {
        const w = new THREE.Mesh(wheelGeo, darkSteel);
        w.rotation.x = Math.PI / 2; w.position.set(p[0], p[1], p[2]);
        trolleyGroup.add(w);
        meshes.wheels.push(w);
    });
    
    const tPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16), chrome);
    tPulley.rotation.x = Math.PI / 2;
    trolleyGroup.add(tPulley);

    const blockBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.8), darkSteel);
    const hPulley1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), chrome);
    hPulley1.rotation.x = Math.PI/2; hPulley1.position.set(0, 0.2, 0.2);
    const hPulley2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), chrome);
    hPulley2.rotation.x = Math.PI/2; hPulley2.position.set(0, 0.2, -0.2);
    hookGroup.add(blockBody, hPulley1, hPulley2);
    
    const hookObj = new THREE.Group();
    const hookCurve = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 16, 32, Math.PI * 1.5), chrome);
    hookCurve.rotation.z = -Math.PI / 4;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 16), chrome);
    tip.position.set(0.4, 0.4, 0); tip.rotation.z = Math.PI / 4;
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.8, 16), chrome);
    shank.position.set(-0.4, 0.4, 0);
    hookObj.add(hookCurve, tip, shank);
    hookObj.position.set(0, -1.0, 0);
    hookGroup.add(hookObj);
    
    trolleyGroup.add(hookGroup);
    meshes.hookBlock = hookGroup;

    const hoistLinesGroup = new THREE.Group();
    const lineGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 8); 
    const lineOffsets = [[0.25, 0.2], [0.25, -0.2], [-0.25, 0.2], [-0.25, -0.2]];
    lineOffsets.forEach(offset => {
        const line = new THREE.Mesh(lineGeo, darkSteel);
        line.position.set(offset[0], -0.5, offset[1]);
        hoistLinesGroup.add(line);
        meshes.hoistLines.push(line);
    });
    trolleyGroup.add(hoistLinesGroup);

    trolleyGroup.position.set(15, -0.5, 0);
    jibGroup.add(trolleyGroup);
    meshes.trolley = trolleyGroup;

    // 10. Pendant Cables
    const catheadTop = new THREE.Vector3(0, apexHeight, 0);
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(20, 2.5, 0), 0.1, darkSteel));
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(45, 2.5, 0), 0.1, darkSteel));
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(-12, 0, 1.4), 0.1, darkSteel));
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(-12, 0, -1.4), 0.1, darkSteel));
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(-17, 0, 1.4), 0.1, darkSteel));
    slewingGroup.add(createCable(catheadTop, new THREE.Vector3(-17, 0, -1.4), 0.1, darkSteel));


    // --- PARTS METADATA ---
    parts.push(
        { name: "Base Cruciform Foundation", description: "Massive interlocking steel beams anchored to the ground with heavy high-density cast iron ballast.", material: "Steel / Dark Steel", function: "Provides the primary stabilizing moment against overturning forces.", assemblyOrder: 1, connections: ["Tower Mast Base", "Ballast Blocks"], failureEffect: "Catastrophic overturning of the entire crane structure.", cascadeFailures: ["Complete Structural Collapse", "Loss of Payload"], originalPosition: { x: 0, y: 1, z: 0 }, explodedPosition: { x: 0, y: -10, z: 0 } },
        { name: "Tower Mast Lattice", description: "Modular sections of heavily braced vertical steel lattice.", material: "Steel", function: "Elevates the slewing unit and operating jib to the required working height.", assemblyOrder: 2, connections: ["Base Foundation", "Climbing Cage", "Slewing Unit"], failureEffect: "Buckling under torsional or compressive loads.", cascadeFailures: ["Crane collapse", "Jib detached"], originalPosition: { x: 0, y: 20, z: 0 }, explodedPosition: { x: -20, y: 20, z: -20 } },
        { name: "Climbing Cage", description: "A robust structural sleeve surrounding the upper mast sections equipped with hydraulic rams.", material: "Aluminum / Steel", function: "Allows the crane to insert new mast sections and telescope upwards independently.", assemblyOrder: 3, connections: ["Tower Mast", "Slewing Unit Base"], failureEffect: "Inability to elevate crane or slipping during climbing.", cascadeFailures: ["Hydraulic fluid leak", "Cage structural shear"], originalPosition: { x: 0, y: 36, z: 0 }, explodedPosition: { x: -30, y: 36, z: 0 } },
        { name: "Slewing Ring Gear", description: "A massive, precision-machined internal gear bearing.", material: "Chrome / Steel", function: "Allows the entire upper crane structure (jib, counter-jib, cab) to rotate 360 degrees.", assemblyOrder: 4, connections: ["Tower Mast", "Slewing Motors"], failureEffect: "Seizing of rotation or uncommanded slewing in high winds.", cascadeFailures: ["Motor burnout", "Gear tooth shear"], originalPosition: { x: 0, y: 42, z: 0 }, explodedPosition: { x: 0, y: 50, z: -30 } },
        { name: "Slewing Drive Motors", description: "High-torque electric motors with planetary gearboxes.", material: "Copper / Dark Steel", function: "Provides the rotational force to turn the slewing ring.", assemblyOrder: 5, connections: ["Slewing Ring Gear", "Power Lines"], failureEffect: "Loss of rotational control.", cascadeFailures: ["Crane drifting with wind (weathervaning)"], originalPosition: { x: 1.3, y: 42.3, z: 1.3 }, explodedPosition: { x: 20, y: 55, z: 20 } },
        { name: "Operator Command Cabin", description: "Climate-controlled, ergonomically designed control center with tinted windows and glowing telemetry screens.", material: "Aluminum / Glass", function: "Houses the operator and critical control systems.", assemblyOrder: 6, connections: ["Slewing Unit Frame"], failureEffect: "Loss of human control interface.", cascadeFailures: ["Operation halt", "Telemetry loss"], originalPosition: { x: 1.8, y: 42, z: 1.8 }, explodedPosition: { x: 30, y: 42, z: 30 } },
        { name: "Cathead (Apex A-Frame)", description: "Tall structural A-frame rising above the slewing unit.", material: "Steel", function: "Provides the upper attachment point for pendant cables supporting the jibs.", assemblyOrder: 7, connections: ["Slewing Unit", "Pendant Cables"], failureEffect: "Collapse of the pendant tension system.", cascadeFailures: ["Jib folding", "Counter-jib collapse"], originalPosition: { x: 0, y: 48, z: 0 }, explodedPosition: { x: 0, y: 70, z: 0 } },
        { name: "Pendant Tension Cables", description: "High-tensile steel wire ropes.", material: "Dark Steel", function: "Transfers the bending moment from the jibs back to the cathead.", assemblyOrder: 8, connections: ["Cathead", "Main Jib", "Counter-Jib"], failureEffect: "Immediate snapping of jib.", cascadeFailures: ["Catastrophic unbalanced load failure"], originalPosition: { x: 10, y: 48, z: 0 }, explodedPosition: { x: 10, y: 80, z: 0 } },
        { name: "Main Jib Lattice", description: "A 55-meter long, triangular cross-section lattice boom.", material: "Steel", function: "Provides the horizontal reach for lifting operations.", assemblyOrder: 9, connections: ["Slewing Unit", "Pendant Cables", "Trolley"], failureEffect: "Buckling or snapping under excessive payload.", cascadeFailures: ["Trolley derailment", "Payload drop"], originalPosition: { x: 27.5, y: 43.25, z: 0 }, explodedPosition: { x: 60, y: 43, z: 0 } },
        { name: "Counter-Jib Frame", description: "Rigid steel box-beam frame extending backwards.", material: "Dark Steel", function: "Supports the hoist machinery and counterweights.", assemblyOrder: 10, connections: ["Slewing Unit", "Pendant Cables"], failureEffect: "Structural shear at slewing connection.", cascadeFailures: ["Crane overturning forward due to loss of balance"], originalPosition: { x: -9, y: 42.5, z: 0 }, explodedPosition: { x: -40, y: 42, z: 0 } },
        { name: "Concrete Ballast Blocks", description: "Series of massive, high-density cast blocks.", material: "Dark Steel", function: "Generates rearward torque to balance the forward torque of the load.", assemblyOrder: 11, connections: ["Counter-Jib Frame"], failureEffect: "Blocks shifting or falling.", cascadeFailures: ["Sudden forward tipping of crane"], originalPosition: { x: -14, y: 44.5, z: 0 }, explodedPosition: { x: -60, y: 60, z: 0 } },
        { name: "Hoist Winch Drum", description: "Large diameter grooved drum driven by a high-capacity electric motor.", material: "Chrome / Copper", function: "Winds and unwinds the hoist cable to raise and lower loads.", assemblyOrder: 12, connections: ["Counter-Jib Frame", "Hoist Cable"], failureEffect: "Uncontrolled unspooling of the cable.", cascadeFailures: ["Load free-fall"], originalPosition: { x: -7, y: 43.5, z: 0 }, explodedPosition: { x: -20, y: 30, z: 20 } },
        { name: "Trolley Frame & Wheels", description: "Rolling carriage traversing the bottom chords of the main jib.", material: "Aluminum / Dark Steel", function: "Moves the suspension point of the load radially inwards or outwards.", assemblyOrder: 13, connections: ["Main Jib Lattice", "Hook Block"], failureEffect: "Wheels seizing or frame cracking.", cascadeFailures: ["Trolley stuck", "Derailment under load"], originalPosition: { x: 15, y: 42, z: 0 }, explodedPosition: { x: 30, y: 20, z: 0 } },
        { name: "Hook Block & Pulley", description: "Heavy housing containing multiple sheaves for cable reeving.", material: "Dark Steel / Chrome", function: "Provides mechanical advantage for lifting and stabilizes the hook.", assemblyOrder: 14, connections: ["Trolley", "Hoist Cables", "Lifting Hook"], failureEffect: "Sheave bearing failure causing cable friction.", cascadeFailures: ["Cable snap"], originalPosition: { x: 15, y: 37, z: 0 }, explodedPosition: { x: 30, y: 0, z: 0 } },
        { name: "Lifting Hook", description: "Forged high-strength steel hook with safety latch.", material: "Chrome", function: "Directly connects the crane to the payload rigging.", assemblyOrder: 15, connections: ["Hook Block"], failureEffect: "Hook straightening under overload.", cascadeFailures: ["Loss of load"], originalPosition: { x: 15, y: 36, z: 0 }, explodedPosition: { x: 30, y: -5, z: 0 } },
        { name: "Anemometer & Aviation Lights", description: "Wind speed sensor and high-intensity neon red warning beacons.", material: "Plastic / Neon Red", function: "Alerts operator to dangerous wind speeds and warns low-flying aircraft.", assemblyOrder: 16, connections: ["Cathead Apex"], failureEffect: "Failure to report high winds.", cascadeFailures: ["Operation during unsafe wind conditions", "Catastrophic collapse"], originalPosition: { x: 0, y: 50.4, z: 0 }, explodedPosition: { x: 0, y: 90, z: 0 } }
    );

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "What is the primary function of the Counter-Jib and its heavy concrete ballast?",
            options: [
                "To generate a rearward torque balancing the forward load moment.",
                "To store extra lifting cables and spare parts.",
                "To provide a resting platform for the crane operator.",
                "To increase the overall height and reach of the crane."
            ],
            correctAnswer: 0,
            explanation: "The counter-jib holds massive ballast blocks that generate a rearward torque, counteracting the forward torque produced by the load on the main jib, effectively preventing the crane from overturning."
        },
        {
            question: "What is the purpose of the 'Climbing Cage' around the mast?",
            options: [
                "To protect the operator from high winds.",
                "To allow the crane to telescope upwards by inserting new mast sections.",
                "To capture debris falling from the jib.",
                "To house the main electrical transformers."
            ],
            correctAnswer: 1,
            explanation: "The climbing cage uses hydraulic rams to lift the entire upper portion of the crane, creating a gap where a new mast section can be inserted, allowing the crane to grow taller as the building rises."
        },
        {
            question: "What role does the Cathead (Apex) play in the crane's structural integrity?",
            options: [
                "It serves purely as an aesthetic peak.",
                "It houses the slewing motors.",
                "It provides the upper anchor point for pendant cables that support the jibs.",
                "It acts as a lightning rod."
            ],
            correctAnswer: 2,
            explanation: "The Cathead acts as a central tower that supports the high-tension pendant cables. These cables transfer the massive bending forces from the jib and counter-jib down into the mast as compressive forces."
        },
        {
            question: "How does the Trolley manipulate the payload?",
            options: [
                "By rotating the entire crane 360 degrees.",
                "By moving radially along the horizontal jib to change the load radius.",
                "By winding the hoist cable to lift the load vertically.",
                "By telescoping the jib outwards."
            ],
            correctAnswer: 1,
            explanation: "The trolley is a rolling carriage that travels back and forth along the bottom chords of the main jib, allowing the crane to place loads at varying distances from the mast."
        },
        {
            question: "Why does the hoist system use multiple cables (reeving) between the trolley and hook block?",
            options: [
                "To look more intimidating.",
                "To create redundancy in case one cable snaps.",
                "To provide mechanical advantage, increasing lifting capacity while reducing cable tension.",
                "To prevent the hook from spinning in the wind."
            ],
            correctAnswer: 2,
            explanation: "Reeving the cable through multiple pulleys acts as a block and tackle system. It multiplies the lifting force (mechanical advantage), allowing the crane to lift heavier loads without snapping a single, highly tensioned cable."
        }
    ];

    // --- ANIMATION LOGIC ---
    const animate = (time, speed, passedMeshes) => {
        const m = passedMeshes || meshes;
        const t = time * speed;
        
        // 1. Slewing rotation (smooth oscillation for display)
        m.slewingUnit.rotation.y = Math.sin(t * 0.15) * Math.PI * 0.4;

        // 2. Trolley radial movement (15m to 45m along the jib)
        const trolleyX = 30 + Math.sin(t * 0.4) * 15; 
        m.trolley.position.x = trolleyX;
        
        // Spin trolley wheels based on linear movement
        const wheelCircumference = 2 * Math.PI * 0.2;
        const deltaX = Math.cos(t * 0.4) * 15 * 0.4; // derivative of position
        m.wheels.forEach(w => w.rotation.z += (deltaX / wheelCircumference) * 0.1);

        // 3. Hook vertical movement (lowering and raising)
        const hookZ = -8 - (Math.cos(t * 0.5) + 1) * 14; // ranges from -8 to -36
        m.hookBlock.position.y = hookZ; 

        // 4. Hoist Drum spin (sync with hook depth)
        m.hoistDrum.rotation.z = hookZ * 1.5; 

        // 5. Hoist cables dynamic scaling to connect trolley and hook
        m.hoistLines.forEach(line => {
            line.scale.y = Math.abs(hookZ);
            line.position.y = hookZ / 2; // scale from center, so offset by half length
        });

        // 6. Anemometer spinning rapidly
        m.anemometer.rotation.y += 0.3 * speed;

        // 7. Aviation warning lights pulsing
        const blink = (Math.sin(t * 6) > 0.8) ? 2.5 : 0.2;
        m.aviationLights.forEach(light => {
            light.material.emissiveIntensity = blink;
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTowerCrane() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
