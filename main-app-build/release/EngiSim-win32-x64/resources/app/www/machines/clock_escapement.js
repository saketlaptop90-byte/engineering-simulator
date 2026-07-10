import * as THREE from 'three';

export function createClockEscapement(THREE) {
    const group = new THREE.Group();

    // --------------------------------------------------------
    // Materials
    // --------------------------------------------------------
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.8, roughness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.9, roughness: 0.4 });
    const rubyMat = new THREE.MeshPhysicalMaterial({ color: 0xd90036, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1, clearcoat: 1.0 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

    // --------------------------------------------------------
    // 1. Escape Wheel (ewGroup)
    // --------------------------------------------------------
    const ewGroup = new THREE.Group();
    ewGroup.position.set(0, 0, 0);
    ewGroup.userData = { name: "Escape Wheel" };
    
    const ewShape = new THREE.Shape();
    const rInner = 1.6;
    const rOuter = 2.0;
    for(let i=0; i<15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const nextAngle = ((i + 1) / 15) * Math.PI * 2;
        const midAngle = angle + (nextAngle - angle) * 0.15;
        
        if (i === 0) {
            ewShape.moveTo(Math.cos(angle)*rInner, Math.sin(angle)*rInner);
        } else {
            ewShape.lineTo(Math.cos(angle)*rInner, Math.sin(angle)*rInner);
        }
        ewShape.lineTo(Math.cos(midAngle)*rOuter, Math.sin(midAngle)*rOuter);
        ewShape.lineTo(Math.cos(midAngle + 0.1)*rInner, Math.sin(midAngle + 0.1)*rInner);
    }
    ewShape.closePath();
    
    // Create holes for spokes
    const ewHole = new THREE.Path();
    ewHole.absarc(0, 0, 1.3, 0, Math.PI*2, false);
    ewShape.holes.push(ewHole);

    const ewGeom = new THREE.ExtrudeGeometry(ewShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
    ewGeom.center();
    const escapeWheel = new THREE.Mesh(ewGeom, goldMat);
    ewGroup.add(escapeWheel);

    const ewHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.24, 16), goldMat);
    ewHub.rotation.x = Math.PI / 2;
    ewGroup.add(ewHub);

    for(let i=0; i<4; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 0.18), goldMat);
        spoke.rotation.z = i * Math.PI / 4;
        ewGroup.add(spoke);
    }
    
    // Pinion generator
    function createPinionGeom(teeth, radius, depth) {
        const shape = new THREE.Shape();
        for(let i=0; i<teeth; i++) {
            const angle = (i/teeth)*Math.PI*2;
            const mid = angle + Math.PI/teeth;
            if(i===0) shape.moveTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
            else shape.lineTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
            shape.lineTo(Math.cos(mid)*(radius+0.1), Math.sin(mid)*(radius+0.1));
        }
        shape.closePath();
        const geom = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
        geom.center();
        return geom;
    }

    const ewPinion = new THREE.Mesh(createPinionGeom(8, 0.25, 0.4), steelMat);
    ewPinion.position.set(0, 0, -0.3);
    ewGroup.add(ewPinion);

    group.add(ewGroup);

    // --------------------------------------------------------
    // 2. Pallet Fork (pfGroup)
    // --------------------------------------------------------
    const pfGroup = new THREE.Group();
    pfGroup.position.set(0, 2.6, 0); 
    pfGroup.userData = { name: "Pallet Fork" };

    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), steelMat);
    lever.position.set(0, 0.6, 0);
    pfGroup.add(lever);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 0.12), steelMat);
    leftArm.position.set(-0.45, -0.65, 0);
    leftArm.rotation.z = Math.atan2(0.9, 1.3);
    pfGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 0.12), steelMat);
    rightArm.position.set(0.45, -0.65, 0);
    rightArm.rotation.z = -Math.atan2(0.9, 1.3);
    pfGroup.add(rightArm);

    const pfPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), rubyMat);
    pfPivot.rotation.x = Math.PI / 2;
    pfGroup.add(pfPivot);

    const slotLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.12), steelMat);
    slotLeft.position.set(-0.1, 1.35, 0);
    pfGroup.add(slotLeft);

    const slotRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.12), steelMat);
    slotRight.position.set(0.1, 1.35, 0);
    pfGroup.add(slotRight);

    group.add(pfGroup);

    // --------------------------------------------------------
    // 5. Entry Pallet & 6. Exit Pallet
    // --------------------------------------------------------
    const entryPallet = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), rubyMat);
    entryPallet.position.set(-0.9, -1.3, 0);
    entryPallet.rotation.z = Math.PI / 4 + 0.2;
    entryPallet.userData = { name: "Entry Pallet" };
    pfGroup.add(entryPallet);

    const exitPallet = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), rubyMat);
    exitPallet.position.set(0.9, -1.3, 0);
    exitPallet.rotation.z = -Math.PI / 4 - 0.2;
    exitPallet.userData = { name: "Exit Pallet" };
    pfGroup.add(exitPallet);

    // --------------------------------------------------------
    // 3. Balance Wheel (bwGroup)
    // --------------------------------------------------------
    const bwGroup = new THREE.Group();
    bwGroup.position.set(0, 4.6, 0);
    bwGroup.userData = { name: "Balance Wheel" };

    const bwRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 16, 64), brassMat);
    bwGroup.add(bwRing);

    for(let i=0; i<3; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6), brassMat);
        spoke.rotation.z = i * Math.PI / 3;
        bwGroup.add(spoke);
    }

    const impulsePin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), rubyMat);
    impulsePin.position.set(0, -0.7, 0); 
    impulsePin.rotation.x = Math.PI / 2;
    bwGroup.add(impulsePin);

    const rollerTable = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), steelMat);
    rollerTable.rotation.x = Math.PI / 2;
    bwGroup.add(rollerTable);

    group.add(bwGroup);

    // --------------------------------------------------------
    // 7. Arbor
    // --------------------------------------------------------
    const arbor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16), steelMat);
    arbor.rotation.x = Math.PI / 2;
    arbor.userData = { name: "Arbor" };
    bwGroup.add(arbor);

    // --------------------------------------------------------
    // 4. Hairspring (hsGroup)
    // --------------------------------------------------------
    const hsGroup = new THREE.Group();
    hsGroup.userData = { name: "Hairspring" };

    const hsMaterial = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });
    const hsPoints = [];
    const numTurns = 6;
    for(let i=0; i<=300; i++) {
        const t = i / 300;
        const angle = t * Math.PI * 2 * numTurns;
        const r = 0.2 + t * 1.2;
        hsPoints.push(new THREE.Vector3(Math.cos(angle)*r, Math.sin(angle)*r, 0));
    }
    const hsGeom = new THREE.BufferGeometry().setFromPoints(hsPoints);
    const hairspringLine = new THREE.Line(hsGeom, hsMaterial);
    hairspringLine.position.z = 0.3;
    hsGroup.add(hairspringLine);

    const stud = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), brassMat);
    stud.position.set(1.4, 0, 0.3);
    hsGroup.add(stud);

    bwGroup.add(hsGroup);

    // --------------------------------------------------------
    // 9. Center Wheel (cwGroup)
    // --------------------------------------------------------
    const cwGroup = new THREE.Group();
    cwGroup.position.set(2.0, 0, 0);
    cwGroup.userData = { name: "Center Wheel" };

    const cwShape = new THREE.Shape();
    const cwR = 1.7;
    for(let i=0; i<60; i++) {
        const angle = (i/60)*Math.PI*2;
        const mid = angle + Math.PI/60;
        if(i===0) cwShape.moveTo(Math.cos(angle)*cwR, Math.sin(angle)*cwR);
        else cwShape.lineTo(Math.cos(angle)*cwR, Math.sin(angle)*cwR);
        cwShape.lineTo(Math.cos(mid)*(cwR+0.1), Math.sin(mid)*(cwR+0.1));
    }
    cwShape.closePath();
    const cwHole = new THREE.Path();
    cwHole.absarc(0, 0, 1.4, 0, Math.PI*2, false);
    cwShape.holes.push(cwHole);

    const cwGearGeom = new THREE.ExtrudeGeometry(cwShape, { depth: 0.2, bevelEnabled: false });
    cwGearGeom.center();
    const centerWheelMesh = new THREE.Mesh(cwGearGeom, brassMat);
    cwGroup.add(centerWheelMesh);

    const cwHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.24, 16), brassMat);
    cwHub.rotation.x = Math.PI / 2;
    cwGroup.add(cwHub);

    for(let i=0; i<5; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 0.18), brassMat);
        spoke.rotation.z = i * Math.PI / 5;
        cwGroup.add(spoke);
    }

    const cwPinion = new THREE.Mesh(createPinionGeom(10, 0.3, 0.4), steelMat);
    cwPinion.position.set(0, 0, -0.3);
    cwGroup.add(cwPinion);

    group.add(cwGroup);

    // --------------------------------------------------------
    // 8. Mainspring (msGroup)
    // --------------------------------------------------------
    const msGroup = new THREE.Group();
    msGroup.position.set(4.4, 0, 0);
    msGroup.userData = { name: "Mainspring" };

    const msGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.6, 32);
    const mainspringBarrel = new THREE.Mesh(msGeom, brassMat);
    mainspringBarrel.rotation.x = Math.PI / 2;
    msGroup.add(mainspringBarrel);

    const barrelTeethShape = new THREE.Shape();
    const msR = 2.1;
    for(let i=0; i<72; i++) {
        const angle = (i/72)*Math.PI*2;
        const mid = angle + Math.PI/72;
        if(i===0) barrelTeethShape.moveTo(Math.cos(angle)*msR, Math.sin(angle)*msR);
        else barrelTeethShape.lineTo(Math.cos(angle)*msR, Math.sin(angle)*msR);
        barrelTeethShape.lineTo(Math.cos(mid)*(msR+0.1), Math.sin(mid)*(msR+0.1));
    }
    barrelTeethShape.closePath();
    const barrelTeethGeom = new THREE.ExtrudeGeometry(barrelTeethShape, { depth: 0.1, bevelEnabled: false });
    barrelTeethGeom.center();
    const msTeeth = new THREE.Mesh(barrelTeethGeom, steelMat);
    msGroup.add(msTeeth);

    const msLineMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    const msPoints = [];
    for(let i=0; i<400; i++) {
        const t = i / 400;
        const angle = t * Math.PI * 2 * 12;
        const r = 0.3 + t * 1.6;
        msPoints.push(new THREE.Vector3(Math.cos(angle)*r, Math.sin(angle)*r, 0.31));
    }
    const msSpiral = new THREE.Line(new THREE.BufferGeometry().setFromPoints(msPoints), msLineMat);
    msGroup.add(msSpiral);

    group.add(msGroup);

    // --------------------------------------------------------
    // 10. Bridge (bridgeGroup)
    // --------------------------------------------------------
    const bridgeGroup = new THREE.Group();
    bridgeGroup.userData = { name: "Bridge" };
    
    const bShape = new THREE.Shape();
    bShape.moveTo(-2.5, 4.6);
    bShape.lineTo(-1.0, 4.6);
    bShape.bezierCurveTo(-0.5, 5.5, 0.5, 5.5, 1.0, 4.6);
    bShape.lineTo(2.5, 4.6);
    bShape.lineTo(2.5, 3.8);
    bShape.lineTo(-2.5, 3.8);
    bShape.closePath();

    const bridgeGeom = new THREE.ExtrudeGeometry(bShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
    const bridgeMain = new THREE.Mesh(bridgeGeom, brassMat);
    bridgeMain.position.set(0, 0, 0.7);
    bridgeGroup.add(bridgeMain);

    const bridgeLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7), brassMat);
    bridgeLeg1.rotation.x = Math.PI / 2;
    bridgeLeg1.position.set(-2.0, 4.2, 0.35);
    bridgeGroup.add(bridgeLeg1);

    const bridgeLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7), brassMat);
    bridgeLeg2.rotation.x = Math.PI / 2;
    bridgeLeg2.position.set(2.0, 4.2, 0.35);
    bridgeGroup.add(bridgeLeg2);

    const bridgeJewel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.25), rubyMat);
    bridgeJewel.rotation.x = Math.PI / 2;
    bridgeJewel.position.set(0, 4.6, 0.8);
    bridgeGroup.add(bridgeJewel);

    group.add(bridgeGroup);

    // --------------------------------------------------------
    // Animation Kinematics
    // --------------------------------------------------------
    const speed = 4.0;
    const max_p = 0.35; 

    group.update = (time) => {
        const x = time * speed / Math.PI;
        const phi = x * Math.PI;
        
        // Balance Wheel: Simple harmonic oscillator
        const b_angle = 1.5 * Math.sin(phi);
        bwGroup.rotation.z = b_angle;
        
        // Hairspring: Contract and expand
        const hsScale = 1.0 + 0.08 * b_angle;
        hsGroup.scale.set(hsScale, hsScale, 1);
        
        // Pallet Fork: Rapid transition when balance wheel crosses zero
        const raw_flip = Math.sin(phi) * 15;
        const p_angle = max_p * Math.max(-1, Math.min(1, raw_flip));
        pfGroup.rotation.z = p_angle;
        
        // Escape Wheel: Advances smoothly right after the pallet fork flips
        const cycle = Math.floor(x);
        const frac = x - cycle;
        
        let advance = 0;
        if (frac < 0.15) {
            const t = frac / 0.15;
            advance = t * t * (3 - 2 * t);
        } else {
            advance = 1.0;
        }
        
        const ew_angle_total = (cycle + advance) * (Math.PI / 15);
        ewGroup.rotation.z = -ew_angle_total;
        
        // Center Wheel moves at 1/5th the speed of the Escape Wheel
        cwGroup.rotation.z = ew_angle_total / 5;
        
        // Mainspring barrel moves very slowly
        msGroup.rotation.z = -ew_angle_total / 40;
    };

    // --------------------------------------------------------
    // Quizzes
    // --------------------------------------------------------
    group.quizzes = [
        {
            question: "What is the primary function of the Balance Wheel in a mechanical watch?",
            options: ["To power the watch", "To act as the timekeeping element", "To transfer power to the hands", "To wind the mainspring"],
            answer: "To act as the timekeeping element"
        },
        {
            question: "Which component provides the restoring force to the Balance Wheel?",
            options: ["Mainspring", "Escape Wheel", "Hairspring", "Pallet Fork"],
            answer: "Hairspring"
        },
        {
            question: "The Pallet Fork alternates contact with the Escape Wheel using which parts?",
            options: ["Pinions and Arbors", "Entry and Exit Pallets", "Bridge and Plate", "Gears and Springs"],
            answer: "Entry and Exit Pallets"
        },
        {
            question: "Where is the energy that drives the entire escapement mechanism stored?",
            options: ["Balance Wheel", "Center Wheel", "Mainspring", "Hairspring"],
            answer: "Mainspring"
        },
        {
            question: "The Escape Wheel is distinctive because of its...",
            options: ["Club-shaped asymmetric teeth", "Large mainspring barrel", "Attached hairspring", "Ruby jewels"],
            answer: "Club-shaped asymmetric teeth"
        },
        {
            question: "What is the purpose of the Bridge in this mechanism?",
            options: ["To generate power", "To regulate time", "To secure the arbors and pivots in place", "To connect the escapement to the dial"],
            answer: "To secure the arbors and pivots in place"
        }
    ];

    return group;
}
