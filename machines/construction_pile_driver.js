import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Specialized High-Tech / Warning Materials
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3, roughness: 0.1 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff5500, emissiveIntensity: 3, roughness: 0.2 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0088ff, emissiveIntensity: 2, roughness: 0.2 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1.5 });
    
    const upperGroup = new THREE.Group();

    // Utility function to register parts
    function registerPart(name, mesh, desc, mat, func, connections, origPos, explPos, failEff, cascFail, asmOrd, parent = group) {
        mesh.name = name;
        mesh.userData = { originalPosition: origPos, explodedPosition: explPos };
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        parent.add(mesh);
        
        parts.push({
            name,
            description: desc,
            material: mat.type || 'Complex/Mixed',
            function: func,
            assemblyOrder: asmOrd,
            connections,
            failureEffect: failEff,
            cascadeFailures: cascFail,
            originalPosition: origPos,
            explodedPosition: explPos
        });
        meshes[name] = mesh;
    }

    // --- Complex Geometry Builders ---

    function buildTracks(THREE, baseMat, linkMat) {
        const trackGroup = new THREE.Group();
        
        // Track Path
        const trackPath = new THREE.Shape();
        trackPath.absarc(0, 0, 1.5, Math.PI/2, 3*Math.PI/2, false);
        trackPath.lineTo(10, -1.5);
        trackPath.absarc(10, 0, 1.5, -Math.PI/2, Math.PI/2, false);
        trackPath.lineTo(0, 1.5);
        
        const points = trackPath.getSpacedPoints(80);
        
        // Complex Track Link Extrusion
        const linkShape = new THREE.Shape();
        linkShape.moveTo(-0.5, -0.15);
        linkShape.lineTo(0.5, -0.15);
        linkShape.lineTo(0.4, 0.15);
        linkShape.lineTo(0.1, 0.15);
        linkShape.lineTo(0.0, 0.3); // grouser spike
        linkShape.lineTo(-0.1, 0.15);
        linkShape.lineTo(-0.4, 0.15);
        
        const extrudeSettings = { depth: 2.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const betterLinkGeo = new THREE.ExtrudeGeometry(linkShape, extrudeSettings);
        betterLinkGeo.center();

        // Place links
        for (let i = 0; i < points.length - 1; i++) {
            const pt = points[i];
            const nextPt = points[i+1];
            const link = new THREE.Mesh(betterLinkGeo, linkMat);
            link.position.set(pt.x, pt.y, 0);
            const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x);
            link.rotation.z = angle;
            trackGroup.add(link);
        }
        
        // Massive Drive Sprockets
        const sprocketGeo = new THREE.CylinderGeometry(1.3, 1.3, 2.6, 24);
        const sprocket = new THREE.Mesh(sprocketGeo, baseMat);
        sprocket.rotation.x = Math.PI / 2;
        sprocket.position.set(0, 0, 0);
        
        // Add sprocket teeth
        const toothGeo = new THREE.BoxGeometry(0.3, 0.4, 2.4);
        for(let i=0; i<12; i++) {
            const tooth = new THREE.Mesh(toothGeo, baseMat);
            const angle = (i/12) * Math.PI * 2;
            tooth.position.set(Math.cos(angle)*1.35, Math.sin(angle)*1.35, 0);
            tooth.rotation.z = angle;
            sprocket.add(tooth);
        }
        trackGroup.add(sprocket);
        
        const idler = new THREE.Mesh(sprocketGeo, baseMat);
        idler.rotation.x = Math.PI / 2;
        idler.position.set(10, 0, 0);
        trackGroup.add(idler);
        
        // Lower Rollers
        for(let i=1; i<10; i++) {
            const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.6, 16), baseMat);
            roller.rotation.x = Math.PI/2;
            roller.position.set(i, -1.1, 0);
            trackGroup.add(roller);
        }

        // Upper guide rollers
        for(let i=2; i<9; i+=2) {
            const upperRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.6, 16), baseMat);
            upperRoller.rotation.x = Math.PI/2;
            upperRoller.position.set(i, 1.2, 0);
            trackGroup.add(upperRoller);
        }
        
        // Center the entire assembly
        trackGroup.children.forEach(c => c.position.x -= 5);
        return trackGroup;
    }

    function buildCarbody(THREE, darkMat, lightMat) {
        const group = new THREE.Group();
        
        // Main Core Box with fillets simulated by multiple overlapping geometries
        const coreGeo = new THREE.BoxGeometry(6, 2, 6);
        const mainBody = new THREE.Mesh(coreGeo, darkMat);
        group.add(mainBody);
        
        // Structural Outriggers to Tracks
        const outriggerGeo = new THREE.BoxGeometry(2, 1.5, 10);
        const frontOutrigger = new THREE.Mesh(outriggerGeo, darkMat);
        frontOutrigger.position.set(2, 0, 0);
        group.add(frontOutrigger);
        
        const rearOutrigger = new THREE.Mesh(outriggerGeo, darkMat);
        rearOutrigger.position.set(-2, 0, 0);
        group.add(rearOutrigger);

        // Heavy Bolting Details
        const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8);
        for(let i=-4; i<=4; i+=2) {
            for(let j of [1.5, 2.5, -1.5, -2.5]) {
                const bolt = new THREE.Mesh(boltGeo, lightMat);
                bolt.position.set(j, 0.8, i);
                group.add(bolt);
            }
        }
        
        // Pivot Pedestal
        const pivot = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 1.2, 32), lightMat);
        pivot.position.set(0, 1.2, 0);
        group.add(pivot);
        
        return group;
    }

    function buildSlewingRing(THREE, ringMat, toothMat) {
        const group = new THREE.Group();
        const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.3, 32, 64), ringMat);
        outerRing.rotation.x = Math.PI/2;
        group.add(outerRing);
        
        const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.3, 32, 64), ringMat);
        innerRing.rotation.x = Math.PI/2;
        group.add(innerRing);
        
        // Planetary Gear Teeth
        const toothGeo = new THREE.BoxGeometry(0.15, 0.4, 0.4);
        for(let i=0; i<80; i++) {
            const tooth = new THREE.Mesh(toothGeo, toothMat);
            const angle = (i/80) * Math.PI * 2;
            tooth.position.set(Math.cos(angle)*2.15, 0, Math.sin(angle)*2.15);
            tooth.rotation.y = -angle;
            group.add(tooth);
        }
        
        // Grease fittings
        for(let i=0; i<4; i++) {
            const fitting = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), copper);
            const angle = (i/4) * Math.PI * 2;
            fitting.position.set(Math.cos(angle)*2.7, 0.1, Math.sin(angle)*2.7);
            group.add(fitting);
        }

        return group;
    }

    function buildUpperFrame(THREE, darkMat, metalMat) {
        const group = new THREE.Group();
        
        // Massive counterweighted deck
        const deckShape = new THREE.Shape();
        deckShape.moveTo(-5, -4);
        deckShape.lineTo(4, -4);
        deckShape.lineTo(5, -2);
        deckShape.lineTo(5, 2);
        deckShape.lineTo(4, 4);
        deckShape.lineTo(-5, 4);
        deckShape.lineTo(-5, -4);
        
        const extrudeSettings = { depth: 1.2, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
        const deckGeo = new THREE.ExtrudeGeometry(deckShape, extrudeSettings);
        const deck = new THREE.Mesh(deckGeo, darkMat);
        deck.rotation.x = Math.PI/2;
        deck.position.set(0, 0.6, 0); // raise it to lie flat
        group.add(deck);
        
        // Walkways and Railings
        const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8);
        const handrailGeo = new THREE.CylinderGeometry(0.06, 0.06, 10, 8);
        
        // Left side rails
        const leftHandrail = new THREE.Mesh(handrailGeo, metalMat);
        leftHandrail.rotation.x = Math.PI/2;
        leftHandrail.rotation.z = Math.PI/2;
        leftHandrail.position.set(-0.5, 1.8, 3.8);
        group.add(leftHandrail);
        
        for(let i=0; i<8; i++) {
            const post = new THREE.Mesh(railGeo, metalMat);
            post.position.set(-4 + i*1.2, 1.1, 3.8);
            group.add(post);
        }
        
        // Rear Counterweight Block
        const weightGeo = new THREE.BoxGeometry(2, 3, 7);
        const weight = new THREE.Mesh(weightGeo, darkMat);
        weight.position.set(-4, 1.5, 0);
        group.add(weight);

        return group;
    }

    function buildEngineBlock(THREE, darkMat, lightMat, fanMat) {
        const group = new THREE.Group();
        
        // V12 Block
        const blockGeo = new THREE.BoxGeometry(4, 2, 2.5);
        const block = new THREE.Mesh(blockGeo, darkMat);
        block.position.set(0, 1, 0);
        group.add(block);
        
        // Cylinder Banks (V-shape)
        const bankGeo = new THREE.BoxGeometry(3.6, 1, 1);
        const leftBank = new THREE.Mesh(bankGeo, lightMat);
        leftBank.position.set(0, 2, 0.8);
        leftBank.rotation.x = -Math.PI/6;
        group.add(leftBank);
        
        const rightBank = new THREE.Mesh(bankGeo, lightMat);
        rightBank.position.set(0, 2, -0.8);
        rightBank.rotation.x = Math.PI/6;
        group.add(rightBank);
        
        // Injectors & Rail
        const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.4, 8);
        const lRail = new THREE.Mesh(railGeo, copper);
        lRail.rotation.z = Math.PI/2;
        lRail.position.set(0, 2.5, 1.2);
        group.add(lRail);
        
        const rRail = new THREE.Mesh(railGeo, copper);
        rRail.rotation.z = Math.PI/2;
        rRail.position.set(0, 2.5, -1.2);
        group.add(rRail);
        
        // Massive Cooling Fan
        const fanCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), lightMat);
        fanCenter.rotation.z = Math.PI/2;
        fanCenter.position.set(2.2, 1, 0);
        group.add(fanCenter);
        
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.8, 0.4);
        for(let i=0; i<8; i++) {
            const blade = new THREE.Mesh(bladeGeo, fanMat);
            blade.position.set(2.2, 1, 0);
            blade.rotation.x = (i/8)*Math.PI*2;
            blade.translateY(0.9);
            // twist the blade
            blade.rotation.y = Math.PI/8;
            group.add(blade);
        }
        
        return group;
    }

    function buildCoolingSystem(THREE, metalMat, heatMat) {
        const group = new THREE.Group();
        
        // Radiator Grille
        const radGeo = new THREE.BoxGeometry(1, 3.5, 4);
        const radiator = new THREE.Mesh(radGeo, heatMat);
        group.add(radiator);
        
        // Radiator Fins
        const finGeo = new THREE.BoxGeometry(1.1, 0.02, 3.8);
        for(let i=0; i<40; i++) {
            const fin = new THREE.Mesh(finGeo, metalMat);
            fin.position.set(0, -1.6 + i*0.08, 0);
            group.add(fin);
        }
        
        // Dual Exhaust Stacks
        const pipePath = new THREE.Curve();
        // create straight stack with a curved top
        const stackGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
        const leftStack = new THREE.Mesh(stackGeo, metalMat);
        leftStack.position.set(-1, 3, 1.5);
        group.add(leftStack);
        
        const leftFlap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), metalMat);
        leftFlap.position.set(-1, 5, 1.5);
        leftFlap.rotation.x = Math.PI/8;
        group.add(leftFlap);
        
        const rightStack = new THREE.Mesh(stackGeo, metalMat);
        rightStack.position.set(-1, 3, -1.5);
        group.add(rightStack);
        
        const rightFlap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), metalMat);
        rightFlap.position.set(-1, 5, -1.5);
        rightFlap.rotation.x = Math.PI/8;
        group.add(rightFlap);

        return group;
    }

    function buildOperatorCabin(THREE, darkMat, metalMat, glassMat) {
        const group = new THREE.Group();
        
        // Main structural framing
        const frameGeo = new THREE.BoxGeometry(2.2, 3, 2.2);
        
        // Panels
        const backPanel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3, 0.1), darkMat);
        backPanel.position.set(0, 1.5, -1.05);
        group.add(backPanel);
        
        const roof = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 2.2), darkMat);
        roof.position.set(0, 3.1, 0);
        group.add(roof);
        
        const floor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 2.2), darkMat);
        floor.position.set(0, 0, 0);
        group.add(floor);
        
        // Tinted Safety Glass
        const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.8, 2.0), glassMat);
        leftGlass.position.set(-1.05, 1.5, 0);
        group.add(leftGlass);
        
        const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.8, 2.0), glassMat);
        rightGlass.position.set(1.05, 1.5, 0);
        group.add(rightGlass);
        
        const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.8, 0.05), glassMat);
        frontGlass.position.set(0, 1.5, 1.05);
        group.add(frontGlass);
        
        // FOPS/ROPS external cage
        const cageBarGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
        for(let i=-1; i<=1; i+=0.4) {
            const frontBar = new THREE.Mesh(cageBarGeo, metalMat);
            frontBar.position.set(i, 1.5, 1.15);
            group.add(frontBar);
            
            const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.3, 8), metalMat);
            topBar.rotation.x = Math.PI/2;
            topBar.position.set(i, 3.25, 0);
            group.add(topBar);
        }

        // Ladder on the side
        const ladderGroup = new THREE.Group();
        const rail = new THREE.CylinderGeometry(0.03, 0.03, 3, 8);
        const lr = new THREE.Mesh(rail, metalMat); lr.position.set(-0.3, -1.5, 0); ladderGroup.add(lr);
        const rr = new THREE.Mesh(rail, metalMat); rr.position.set(0.3, -1.5, 0); ladderGroup.add(rr);
        
        const rung = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        for(let i=0; i<6; i++) {
            const r = new THREE.Mesh(rung, metalMat);
            r.rotation.z = Math.PI/2;
            r.position.set(0, -2.5 + i*0.4, 0);
            ladderGroup.add(r);
        }
        ladderGroup.position.set(1.2, 1, 0);
        group.add(ladderGroup);

        return group;
    }

    function buildCabinControls(THREE, rubberMat, plasticMat, glowMat, metalMat) {
        const group = new THREE.Group();
        
        // Air Suspension Seat
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), plasticMat);
        base.position.set(0, 0.2, 0);
        group.add(base);
        
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.7), rubberMat);
        cushion.position.set(0, 0.45, 0);
        group.add(cushion);
        
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.15), rubberMat);
        backrest.position.set(0, 0.95, -0.3);
        group.add(backrest);
        
        const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.15), rubberMat);
        headrest.position.set(0, 1.5, -0.3);
        group.add(headrest);
        
        // Left & Right Control Pods
        const podGeo = new THREE.BoxGeometry(0.3, 0.4, 0.8);
        const lPod = new THREE.Mesh(podGeo, plasticMat);
        lPod.position.set(-0.55, 0.6, 0.1);
        group.add(lPod);
        
        const rPod = new THREE.Mesh(podGeo, plasticMat);
        rPod.position.set(0.55, 0.6, 0.1);
        group.add(rPod);
        
        // Joysticks
        const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
        const lStick = new THREE.Mesh(stickGeo, metalMat);
        lStick.position.set(-0.55, 0.9, 0.3);
        lStick.rotation.x = Math.PI/8;
        group.add(lStick);
        
        const rStick = new THREE.Mesh(stickGeo, metalMat);
        rStick.position.set(0.55, 0.9, 0.3);
        rStick.rotation.x = Math.PI/8;
        group.add(rStick);

        // Front Telemetry Dash
        const dash = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.3), plasticMat);
        dash.position.set(0, 0.8, 0.8);
        dash.rotation.x = Math.PI/6;
        group.add(dash);
        
        // Screens
        const mainScreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.02), glowMat);
        mainScreen.position.set(-0.2, 0.85, 0.68);
        mainScreen.rotation.x = Math.PI/6;
        group.add(mainScreen);
        
        const subScreen = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.02), glowMat);
        subScreen.position.set(0.4, 0.85, 0.68);
        subScreen.rotation.x = Math.PI/6;
        group.add(subScreen);

        return group;
    }

    function buildHydraulicPumps(THREE, metalMat, pipeMat) {
        const group = new THREE.Group();
        
        const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 24);
        const pumpBody = new THREE.Mesh(bodyGeo, metalMat);
        pumpBody.rotation.z = Math.PI/2;
        group.add(pumpBody);
        
        // Triplex heads
        const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.6);
        for(let i=-0.6; i<=0.6; i+=0.6) {
            const head = new THREE.Mesh(headGeo, metalMat);
            head.position.set(i, 0.5, 0);
            group.add(head);
            
            // output fittings
            const fit = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4), pipeMat);
            fit.position.set(i, 1.0, 0);
            group.add(fit);
        }
        
        // Massive Accumulator
        const accGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
        const acc = new THREE.Mesh(accGeo, metalMat);
        acc.position.set(0, 0, 1);
        group.add(acc);

        return group;
    }

    function buildBoomSupport(THREE, metalMat, darkMat) {
        const group = new THREE.Group();
        
        // Extremely thick structural A-frame members
        const legGeo = new THREE.CylinderGeometry(0.5, 0.6, 12, 24);
        
        const leftLeg = new THREE.Mesh(legGeo, metalMat);
        leftLeg.position.set(2, 5, -1);
        leftLeg.rotation.z = -Math.PI/10;
        leftLeg.rotation.x = Math.PI/12;
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeo, metalMat);
        rightLeg.position.set(-2, 5, -1);
        rightLeg.rotation.z = Math.PI/10;
        rightLeg.rotation.x = Math.PI/12;
        group.add(rightLeg);
        
        const frontLeft = new THREE.Mesh(legGeo, metalMat);
        frontLeft.position.set(2, 5, 2);
        frontLeft.rotation.z = -Math.PI/10;
        frontLeft.rotation.x = -Math.PI/12;
        group.add(frontLeft);
        
        const frontRight = new THREE.Mesh(legGeo, metalMat);
        frontRight.position.set(-2, 5, 2);
        frontRight.rotation.z = Math.PI/10;
        frontRight.rotation.x = -Math.PI/12;
        group.add(frontRight);
        
        // Top Pivot Assembly
        const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6, 24), darkMat);
        topBar.rotation.z = Math.PI/2;
        topBar.position.set(0, 10.5, 0.5);
        group.add(topBar);

        // Huge structural gussets
        const gussetGeo = new THREE.BoxGeometry(0.2, 2, 2);
        const lGusset = new THREE.Mesh(gussetGeo, darkMat);
        lGusset.position.set(2.8, 10, 0.5);
        group.add(lGusset);
        
        const rGusset = new THREE.Mesh(gussetGeo, darkMat);
        rGusset.position.set(-2.8, 10, 0.5);
        group.add(rGusset);

        return group;
    }

    function buildHydraulicCylinders(THREE, casingMat, rodMat) {
        const group = new THREE.Group();
        
        const casingGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
        const rodGeo = new THREE.CylinderGeometry(0.25, 0.25, 8, 32);
        
        const leftCasing = new THREE.Mesh(casingGeo, casingMat);
        leftCasing.position.set(3, 4, 0);
        leftCasing.rotation.x = Math.PI/6;
        group.add(leftCasing);
        
        const leftRod = new THREE.Mesh(rodGeo, rodMat);
        leftRod.position.set(3, 9, 2.9);
        leftRod.rotation.x = Math.PI/6;
        group.add(leftRod);
        
        const rightCasing = new THREE.Mesh(casingGeo, casingMat);
        rightCasing.position.set(-3, 4, 0);
        rightCasing.rotation.x = Math.PI/6;
        group.add(rightCasing);
        
        const rightRod = new THREE.Mesh(rodGeo, rodMat);
        rightRod.position.set(-3, 9, 2.9);
        rightRod.rotation.x = Math.PI/6;
        group.add(rightRod);
        
        return group;
    }

    function buildLeadTower(THREE, metalMat, railMat) {
        const group = new THREE.Group();
        
        const towerHeight = 50;
        // 4 Main Vertical Chords
        const chordGeo = new THREE.CylinderGeometry(0.4, 0.4, towerHeight, 12);
        const positions = [
            [-2, 0, -2], [2, 0, -2],
            [-2, 0, 2], [2, 0, 2]
        ];
        
        positions.forEach(pos => {
            const chord = new THREE.Mesh(chordGeo, metalMat);
            chord.position.set(pos[0], towerHeight/2, pos[1]);
            group.add(chord);
        });
        
        // Massive Lattice X-Bracing
        const braceGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.6, 8);
        for (let y = 2; y < towerHeight-2; y += 4) {
            // Front & Back faces
            for (let side of [-2, 2]) {
                const b1 = new THREE.Mesh(braceGeo, metalMat);
                b1.position.set(0, y + 2, side);
                b1.rotation.z = Math.PI / 4;
                group.add(b1);
                
                const b2 = new THREE.Mesh(braceGeo, metalMat);
                b2.position.set(0, y + 2, side);
                b2.rotation.z = -Math.PI / 4;
                group.add(b2);
            }
            // Left & Right faces
            for (let side of [-2, 2]) {
                const b1 = new THREE.Mesh(braceGeo, metalMat);
                b1.position.set(side, y + 2, 0);
                b1.rotation.x = Math.PI / 4;
                group.add(b1);
                
                const b2 = new THREE.Mesh(braceGeo, metalMat);
                b2.position.set(side, y + 2, 0);
                b2.rotation.x = -Math.PI / 4;
                group.add(b2);
            }
            // Horizontal struts
            const hStrutF = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,4,8), metalMat);
            hStrutF.rotation.z = Math.PI/2; hStrutF.position.set(0, y, 2); group.add(hStrutF);
            
            const hStrutB = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,4,8), metalMat);
            hStrutB.rotation.z = Math.PI/2; hStrutB.position.set(0, y, -2); group.add(hStrutB);
            
            const hStrutL = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,4,8), metalMat);
            hStrutL.rotation.x = Math.PI/2; hStrutL.position.set(-2, y, 0); group.add(hStrutL);
            
            const hStrutR = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,4,8), metalMat);
            hStrutR.rotation.x = Math.PI/2; hStrutR.position.set(2, y, 0); group.add(hStrutR);
        }
        
        // Massive Front Chrome Guide Rails for the hammer
        const railGeo = new THREE.BoxGeometry(0.8, towerHeight, 1.2);
        const leftRail = new THREE.Mesh(railGeo, railMat);
        leftRail.position.set(-1, towerHeight/2, 2.6);
        group.add(leftRail);
        
        const rightRail = new THREE.Mesh(railGeo, railMat);
        rightRail.position.set(1, towerHeight/2, 2.6);
        group.add(rightRail);

        // Sheave block at the very top
        const sheaveBlock = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), metalMat);
        sheaveBlock.position.set(0, towerHeight + 1, 0);
        group.add(sheaveBlock);
        
        // Pulleys
        for(let i=-1; i<=1; i+=2) {
            const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 24), railMat);
            pulley.rotation.z = Math.PI/2;
            pulley.position.set(i, towerHeight + 1.5, 2.6);
            group.add(pulley);
        }

        return group;
    }

    function buildWinch(THREE, darkMat, metalMat) {
        const group = new THREE.Group();
        
        const base = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 4), darkMat);
        group.add(base);
        
        // Main Winch Drum
        const drumGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.8, 32);
        const drum = new THREE.Mesh(drumGeo, metalMat);
        drum.rotation.z = Math.PI/2;
        drum.position.set(0, 1.2, 0);
        group.add(drum);
        
        // Drum flanges
        const flangeGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
        const lFlange = new THREE.Mesh(flangeGeo, darkMat);
        lFlange.rotation.z = Math.PI/2; lFlange.position.set(-1.4, 1.2, 0); group.add(lFlange);
        
        const rFlange = new THREE.Mesh(flangeGeo, darkMat);
        rFlange.rotation.z = Math.PI/2; rFlange.position.set(1.4, 1.2, 0); group.add(rFlange);
        
        // Simulated coiled wire rope using Torus
        const ropeGeo = new THREE.TorusGeometry(0.85, 0.05, 8, 32);
        for(let x=-1.3; x<=1.3; x+=0.1) {
            const coil = new THREE.Mesh(ropeGeo, metalMat);
            coil.rotation.y = Math.PI/2;
            coil.position.set(x, 1.2, 0);
            group.add(coil);
        }
        
        // Massive hydraulic drive motor
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), darkMat);
        motor.rotation.z = Math.PI/2;
        motor.position.set(-2, 1.2, 0);
        group.add(motor);

        return group;
    }

    function buildHammer(THREE, darkMat, chromeMat) {
        const hammerGroup = new THREE.Group();
        
        // Massive Outer Housing Block
        const blockGeo = new THREE.BoxGeometry(3.5, 6, 3.5);
        const block = new THREE.Mesh(blockGeo, darkMat);
        block.position.set(0, 3, 0);
        hammerGroup.add(block);
        
        // Intricate ribbing for heat dissipation and strength
        const ribGeo = new THREE.BoxGeometry(4, 0.2, 4);
        for(let i=0; i<8; i++) {
            const rib = new THREE.Mesh(ribGeo, darkMat);
            rib.position.set(0, 1 + i*0.6, 0);
            hammerGroup.add(rib);
        }
        
        // Hydraulic Lift Cylinder on top of the hammer housing
        const cylGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
        const cyl = new THREE.Mesh(cylGeo, darkMat);
        cyl.position.set(0, 8, 0);
        hammerGroup.add(cyl);
        
        const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
        const rod = new THREE.Mesh(rodGeo, chromeMat);
        rod.position.set(0, 11, 0);
        hammerGroup.add(rod);

        // Guide claws (to attach to lead tower rails)
        const clawGeo = new THREE.BoxGeometry(0.5, 6, 0.8);
        const lClaw = new THREE.Mesh(clawGeo, chromeMat);
        lClaw.position.set(-1, 3, -2);
        hammerGroup.add(lClaw);
        
        const rClaw = new THREE.Mesh(clawGeo, chromeMat);
        rClaw.position.set(1, 3, -2);
        hammerGroup.add(rClaw);
        
        // The actual striking Ram mass (visible slightly at bottom)
        const ramGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
        const ram = new THREE.Mesh(ramGeo, chromeMat);
        ram.position.set(0, -0.5, 0);
        hammerGroup.add(ram);
        
        return hammerGroup;
    }

    function buildStrikerPlate(THREE, darkMat, metalMat) {
        const group = new THREE.Group();
        
        // Main Anvil
        const anvil = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1.5, 32), darkMat);
        group.add(anvil);
        
        // Cushioning cap (Drive Cap)
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), metalMat);
        cap.position.set(0, 1, 0);
        group.add(cap);
        
        // Guide blocks
        const guide = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1, 4.2), darkMat);
        guide.position.set(0, -0.5, 0);
        group.add(guide);
        
        return group;
    }

    function buildHydraulicLines(THREE, rubberMat, metalMat) {
        const group = new THREE.Group();
        
        class CustomSpline extends THREE.Curve {
            constructor(scale = 1, offsetX = 0) {
                super();
                this.scale = scale;
                this.offsetX = offsetX;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Complex wrapping curve from pumps up the boom
                const tx = this.offsetX + Math.sin(t * Math.PI) * 2;
                const ty = t * 12; // Goes up 12 units
                const tz = Math.cos(t * Math.PI * 4) * 0.5 + t * 4; // Spirals and moves forward
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        
        // Generate a massive bundle of hoses
        for(let i=0; i<6; i++) {
            const path = new CustomSpline(1, -1 + i*0.4);
            const tubeGeo = new THREE.TubeGeometry(path, 100, 0.08, 8, false);
            const hose = new THREE.Mesh(tubeGeo, rubberMat);
            group.add(hose);
        }

        // Fittings and manifolds
        const manifold = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 0.6), metalMat);
        manifold.position.set(0, 12, 4);
        group.add(manifold);

        return group;
    }

    function buildWarningLights(THREE, darkMat, orangeGlow, redGlow) {
        const group = new THREE.Group();
        
        // Rotating beacons on rear counterweight and tower base
        const positions = [ [-4, 0, 0], [4, 0, 0], [0, 8, 8] ];
        
        positions.forEach((pos, idx) => {
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), darkMat);
            base.position.set(...pos);
            
            const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16), idx === 2 ? redGlow : orangeGlow);
            bulb.position.set(0, 0.35, 0);
            base.add(bulb);
            
            const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 8, 1, true), darkMat);
            cage.material.wireframe = true;
            cage.position.set(0, 0.35, 0);
            base.add(cage);
            
            group.add(base);
        });

        // LIDAR Sensor box
        const lidar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), darkMat);
        lidar.position.set(0, 0, 5);
        
        const scanner = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), redGlow);
        scanner.position.set(0, 0.35, 0);
        lidar.add(scanner);
        
        group.add(lidar);

        return group;
    }

    // --- Assembly Sequence ---

    const leftTrack = buildTracks(THREE, darkSteel, steel);
    registerPart('LeftCrawlerTrack', leftTrack, 'Massive left crawler track with individual tread links and drive sprockets.', steel, 'Provides traction, mobility, and structural stability for the immense weight of the pile driver.', ['UndercarriageCarbody'], {x: -4.5, y: 1.5, z: 0}, {x: -12, y: 1.5, z: 0}, 'Immobility, uneven load distribution causing tipping.', ['UndercarriageCarbody'], 1);

    const rightTrack = buildTracks(THREE, darkSteel, steel);
    registerPart('RightCrawlerTrack', rightTrack, 'Massive right crawler track mirroring the left assembly.', steel, 'Distributes weight and enables precise maneuvering over rough terrain.', ['UndercarriageCarbody'], {x: 4.5, y: 1.5, z: 0}, {x: 12, y: 1.5, z: 0}, 'Complete loss of steering and drive capability.', ['UndercarriageCarbody'], 2);

    const carbody = buildCarbody(THREE, darkSteel, steel);
    registerPart('UndercarriageCarbody', carbody, 'Reinforced central structural frame connecting the two crawler assemblies.', darkSteel, 'Acts as the foundation for the entire machine, bearing all dynamic and static loads.', ['LeftCrawlerTrack', 'RightCrawlerTrack', 'SlewingRing'], {x: 0, y: 1.5, z: 0}, {x: 0, y: -5, z: 0}, 'Catastrophic structural failure; entire machine collapse.', ['SlewingRing', 'UpperRotatingFrame'], 3);

    const slewingRing = buildSlewingRing(THREE, steel, chrome);
    registerPart('SlewingRing', slewingRing, 'Massive roller bearing assembly with inner and outer gear teeth.', chrome, 'Allows full 360-degree rotation of the upper structure under extreme load.', ['UndercarriageCarbody', 'UpperRotatingFrame'], {x: 0, y: 3.2, z: 0}, {x: 0, y: 3.2, z: -10}, 'Inability to rotate the upper frame; seized operation.', ['UpperRotatingFrame'], 4);

    upperGroup.position.set(0, 0, 0);
    slewingRing.add(upperGroup);

    const upperFrame = buildUpperFrame(THREE, darkSteel, steel);
    registerPart('UpperRotatingFrame', upperFrame, 'Heavy-duty steel deck providing mounting points for all upper components.', darkSteel, 'Supports engine, cabin, and tower mechanisms.', ['SlewingRing', 'DieselEngineBlock', 'BoomSupportAFrame'], {x: 0, y: 0.5, z: 0}, {x: 0, y: 6, z: 0}, 'Misalignment of all upper components.', ['DieselEngineBlock', 'BoomSupportAFrame'], 5, upperGroup);

    const engineBlock = buildEngineBlock(THREE, darkSteel, aluminum, plastic);
    registerPart('DieselEngineBlock', engineBlock, 'High-displacement industrial diesel engine block.', darkSteel, 'Generates primary mechanical and hydraulic power for locomotion, slewing, and hammering.', ['UpperRotatingFrame', 'MainHydraulicPumps', 'EngineExhaustAndCooling'], {x: 0, y: 1.0, z: -4}, {x: 0, y: 6, z: -12}, 'Total power loss; complete machine shutdown.', ['MainHydraulicPumps', 'EngineExhaustAndCooling'], 6, upperGroup);

    const coolingSystem = buildCoolingSystem(THREE, steel, aluminum);
    registerPart('EngineExhaustAndCooling', coolingSystem, 'Massive radiators, dual exhaust stacks, and cooling fans.', steel, 'Prevents engine overheating and manages emissions during continuous high-load operations.', ['DieselEngineBlock'], {x: 0, y: 3.5, z: -4}, {x: 0, y: 12, z: -12}, 'Engine overheating, auto-shutdown initiated.', ['DieselEngineBlock'], 7, upperGroup);

    const cabin = buildOperatorCabin(THREE, darkSteel, steel, tinted);
    registerPart('OperatorCabin', cabin, 'FOPS/ROPS certified enclosed operator environment with tinted safety glass.', darkSteel, 'Protects the operator from debris, noise, and vibration while providing full visibility.', ['UpperRotatingFrame', 'CabinControlsAndSeat'], {x: -3.5, y: 1.0, z: 2.5}, {x: -10, y: 1.0, z: 8}, 'Loss of operator safety and environmental protection.', ['CabinControlsAndSeat'], 8, upperGroup);

    const controls = buildCabinControls(THREE, rubber, plastic, screenGlow, steel);
    registerPart('CabinControlsAndSeat', controls, 'Ergonomic air-suspension seat with integrated joystick consoles and digital telemetry screens.', rubber, 'Allows precise human control over the immense machinery.', ['OperatorCabin'], {x: -3.5, y: 1.1, z: 2.5}, {x: -12, y: 3, z: 8}, 'Loss of precise control over hammering and slewing operations.', [], 9, upperGroup);

    const pumps = buildHydraulicPumps(THREE, steel, copper);
    registerPart('MainHydraulicPumps', pumps, 'Triplex high-pressure hydraulic piston pumps driven directly by the engine.', steel, 'Converts mechanical power into hydraulic pressure to drive the hammer, winches, and tracks.', ['DieselEngineBlock', 'HighPressureHydraulicLines'], {x: 2.5, y: 1.0, z: -2}, {x: 10, y: 1.0, z: -2}, 'Total loss of hydraulic pressure; inability to operate hammer or move.', ['PrimaryHydraulicCylinders', 'HighPressureHydraulicLines'], 10, upperGroup);

    const aFrame = buildBoomSupport(THREE, steel, darkSteel);
    registerPart('BoomSupportAFrame', aFrame, 'Massive steel A-frame gantry rigidly bolted to the front of the upper deck.', darkSteel, 'Provides the pivotal mounting point for the vertical lead tower and lift cylinders.', ['UpperRotatingFrame', 'MassiveLeadTower'], {x: 0, y: 1.0, z: 3}, {x: 0, y: 15, z: 3}, 'Collapse of the lead tower.', ['MassiveLeadTower', 'PrimaryHydraulicCylinders'], 11, upperGroup);

    const primaryCylinders = buildHydraulicCylinders(THREE, darkSteel, chrome);
    registerPart('PrimaryHydraulicCylinders', primaryCylinders, 'Enormous dual hydraulic rams connecting the A-frame to the lead tower.', chrome, 'Adjusts the vertical angle (battering) of the lead tower to drive piles at specific angles.', ['BoomSupportAFrame', 'MassiveLeadTower', 'MainHydraulicPumps'], {x: 0, y: 2, z: 4.5}, {x: 8, y: 2, z: 8}, 'Inability to maintain or adjust tower angle; potential collapse.', ['MassiveLeadTower'], 12, upperGroup);

    const leadTower = buildLeadTower(THREE, steel, chrome);
    // Move lead tower far forward so it rests ahead of the machine, attached via A-Frame
    registerPart('MassiveLeadTower', leadTower, 'Towering 50-meter lattice boom structure with heavy chrome guide rails.', steel, 'Guides the drop hammer and pile with absolute precision vertically.', ['BoomSupportAFrame', 'PrimaryHydraulicCylinders'], {x: 0, y: 0, z: 12}, {x: 0, y: 0, z: 30}, 'Failure to guide hammer; pile driving impossible.', ['HydraulicDropHammer', 'HammerStrikerPlate'], 13, upperGroup);

    const winch = buildWinch(THREE, darkSteel, steel);
    registerPart('HammerHoistWinch', winch, 'Multi-drum heavy-duty hydraulic winch assembly with steel wire ropes.', darkSteel, 'Lifts the massive drop hammer and positions the piles into the lead.', ['UpperRotatingFrame', 'HydraulicDropHammer'], {x: 0, y: 1.0, z: -0.5}, {x: 0, y: 10, z: -0.5}, 'Inability to lift hammer or piles.', ['HydraulicDropHammer'], 14, upperGroup);

    const hammer = buildHammer(THREE, darkSteel, chrome);
    registerPart('HydraulicDropHammer', hammer, 'Multi-ton enclosed hydraulic impact hammer.', darkSteel, 'Delivers millions of foot-pounds of kinetic energy to drive the pile into bedrock.', ['MassiveLeadTower', 'HammerHoistWinch'], {x: 0, y: 25, z: 14.6}, {x: 0, y: 40, z: 25}, 'Loss of driving force; machine becomes useless for primary function.', ['HammerStrikerPlate'], 15, upperGroup);

    const strikerPlate = buildStrikerPlate(THREE, darkSteel, steel);
    registerPart('HammerStrikerPlate', strikerPlate, 'Thick hardened steel anvil cushion and drive cap.', steel, 'Transfers kinetic energy from the hammer to the pile while preventing pile shattering.', ['HydraulicDropHammer'], {x: 0, y: 1.5, z: 14.6}, {x: 0, y: -5, z: 25}, 'Destruction of the pile top due to direct hammer impact.', [], 16, upperGroup);

    const hoses = buildHydraulicLines(THREE, rubber, copper);
    registerPart('HighPressureHydraulicLines', hoses, 'Extensive network of reinforced rubber and steel tubing spanning the machine.', rubber, 'Routes extreme-pressure hydraulic fluid from the pumps to all actuators and motors.', ['MainHydraulicPumps', 'PrimaryHydraulicCylinders', 'HydraulicDropHammer'], {x: 0, y: 2, z: 0}, {x: 10, y: 10, z: 10}, 'Catastrophic fluid leak; total system pressure loss.', ['PrimaryHydraulicCylinders', 'HydraulicDropHammer'], 17, upperGroup);

    const lights = buildWarningLights(THREE, darkSteel, neonOrange, neonRed);
    registerPart('WarningLightsAndSensors', lights, 'Array of high-intensity strobe beacons, load sensors, and LIDAR positioning modules.', plastic, 'Ensures worksite safety and provides precision telemetry for pile alignment.', ['OperatorCabin'], {x: 0, y: 4.5, z: -5}, {x: 0, y: 12, z: -15}, 'Compromised safety and loss of automated alignment features.', [], 18, upperGroup);


    const description = "The Heavy Construction Pile Driver is a colossal feat of engineering designed to force massive steel or concrete piles deep into the earth's bedrock. Weighing hundreds of tons, it features an immense lattice lead tower guided by heavy hydraulic cylinders, a high-displacement diesel V12 power plant, and a staggering drop hammer capable of delivering millions of foot-pounds of kinetic energy per strike. The entire superstructure is mounted on a heavy-duty crawler undercarriage with a continuous 360-degree slewing ring.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Slewing Ring on the Pile Driver?",
            options: [
                "To allow 360-degree continuous rotation of the upper structure",
                "To rotate the pile as it is driven into the ground",
                "To drive the crawler tracks forward and backward",
                "To pump hydraulic fluid to the drop hammer"
            ],
            correctAnswer: 0
        },
        {
            question: "Which component absorbs and transfers the immense kinetic energy from the Drop Hammer to prevent the pile from shattering?",
            options: [
                "Boom Support A-Frame",
                "Hammer Striker Plate",
                "Undercarriage Carbody",
                "Primary Hydraulic Cylinders"
            ],
            correctAnswer: 1
        },
        {
            question: "Why are Massive Primary Hydraulic Cylinders connected to the Boom Support A-Frame and Lead Tower?",
            options: [
                "To adjust the vertical angle (battering) of the Lead Tower for angled piles",
                "To act as shock absorbers when the hammer strikes",
                "To lift the heavy diesel engine block during maintenance",
                "To physically push the pile into the ground instead of hammering"
            ],
            correctAnswer: 0
        },
        {
            question: "What vital role do the Triplex Main Hydraulic Pumps play in this machine's operation?",
            options: [
                "They convert mechanical power from the diesel engine into extreme fluid pressure for all actuators",
                "They pump groundwater away from the piling site",
                "They cool the hammer by pumping water over the striker plate",
                "They inject liquid concrete into hollow piles"
            ],
            correctAnswer: 0
        },
        {
            question: "What physical feature prevents the machine from tipping forward under the colossal weight of the 50-meter Lead Tower and Hammer?",
            options: [
                "The heavy Diesel Engine Block and Counterweights distributed on the rear of the Upper Rotating Frame",
                "Magnetic clamps on the Crawler Tracks",
                "A rear-mounted ground anchor driven into the dirt",
                "The Operator Cabin being positioned on the far left"
            ],
            correctAnswer: 0
        }
    ];

    function animate(time, speed, meshes) {
        // 1. Slew Rotation (oscillate slowly)
        const slewAngle = Math.sin(time * 0.15 * speed) * 0.4;
        if (upperGroup) {
            upperGroup.rotation.y = slewAngle;
        }

        // 2. Simulated Track Movement via Sprocket Rotation
        ['LeftCrawlerTrack', 'RightCrawlerTrack'].forEach(trackName => {
            const track = meshes[trackName];
            if (track) {
                // Slew causes differential track speeds to turn, we just simulate rolling
                const diff = (trackName === 'LeftCrawlerTrack') ? 1 : -1;
                const rollSpeed = speed * 0.05 * Math.sin(time * 0.5) * diff;
                
                track.children.forEach(child => {
                    if (child.geometry.type === 'CylinderGeometry') {
                        child.rotation.y += rollSpeed; // Rollers and sprockets
                    }
                });
            }
        });

        // 3. Engine Fan Rotation
        const engine = meshes['DieselEngineBlock'];
        if (engine) {
            engine.children.forEach(child => {
                if (child.geometry.type === 'BoxGeometry' && child.position.x > 1.5) { 
                    child.rotation.x += speed * 0.8;
                }
            });
        }

        // 4. Warning Lights Flashing
        const lights = meshes['WarningLightsAndSensors'];
        if (lights) {
            lights.children.forEach((base, index) => {
                if (base.children.length > 0) { 
                    const bulb = base.children[0];
                    // Fast strobe effect
                    const intensity = (Math.sin(time * 15 * speed + index * 2) > 0.6) ? 3 : 0.2;
                    if(bulb.material && bulb.material.emissiveIntensity !== undefined) {
                        bulb.material.emissiveIntensity = intensity;
                    }
                }
            });
        }

        // 5. Drop Hammer Cycle
        const hammer = meshes['HydraulicDropHammer'];
        if (hammer) {
            // Complex hammering physics cycle
            // Modulo cycle for lifting and dropping
            const cycleSpeed = speed * 1.5;
            const cycle = (time * cycleSpeed) % Math.PI; 
            
            let heightOffset = 0;
            if (cycle < 2.5) {
                // Slow hydraulic lift
                // Smooth easing up
                const t = cycle / 2.5;
                heightOffset = t * 18; 
            } else {
                // Freefall drop (gravity simulation)
                const dropProgress = (cycle - 2.5) / (Math.PI - 2.5); // 0 to 1
                heightOffset = 18 * (1 - Math.pow(dropProgress, 4)); // Starts fast, drops sharp
            }
            
            // Apply position relative to original offset
            const orig = hammer.userData.originalPosition;
            hammer.position.y = orig.y + heightOffset;

            // Trigger "dust" or tiny vibration when hitting bottom
            if(heightOffset < 0.2 && cycle > 2.5) {
                if (meshes['MassiveLeadTower']) {
                    meshes['MassiveLeadTower'].position.y = orig.y - 25 + (Math.random() * 0.05); // Tiny shudder
                }
            } else {
                if (meshes['MassiveLeadTower']) {
                    meshes['MassiveLeadTower'].position.y = 0; // Reset
                }
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
