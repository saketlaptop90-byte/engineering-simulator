import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Ultra God Tier Quark Star Core Simulator. An immensely complex simulation engine built to model the breakdown of degenerate neutron matter into a strange quark-gluon plasma. Features robust gravitational confinement lasers, catastrophic pressure vessels, and a fully functional operator suite atop an all-terrain transport chassis.";

    const quizQuestions = [
        {
            question: "In the context of color superconductivity in a quark star core, which pairing pattern is most likely to occur at the highest baryon densities?",
            options: [
                "Color-Flavor Locked (CFL) phase", 
                "2SC (Two-flavor Superconducting) phase", 
                "Crystalline color superconducting phase", 
                "Meson condensed phase"
            ],
            answer: "Color-Flavor Locked (CFL) phase",
            explanation: "At asymptotically high densities, all three light quark flavors (u, d, s) are treated equally, and their Fermi momenta match, leading to the Color-Flavor Locked (CFL) phase where all flavors and colors pair symmetrically."
        },
        {
            question: "What is the primary mechanism that prevents the quark star from collapsing into a black hole under its own immense gravity?",
            options: [
                "Neutron degeneracy pressure", 
                "Quark degeneracy pressure and strong interaction repulsion", 
                "Electron degeneracy pressure", 
                "Thermal radiation pressure"
            ],
            answer: "Quark degeneracy pressure and strong interaction repulsion",
            explanation: "In a quark star, the Pauli exclusion principle applied to quarks provides quark degeneracy pressure. Additionally, at certain densities, strong interactions can provide repulsive forces that further stabilize the star."
        },
        {
            question: "Which feature of Quantum Chromodynamics (QCD) explains why isolated quarks are never observed in nature, but behave almost as free particles inside a quark star core?",
            options: [
                "Asymptotic freedom and color confinement", 
                "Spontaneous symmetry breaking", 
                "Chiral anomaly", 
                "Pauli exclusion principle"
            ],
            answer: "Asymptotic freedom and color confinement",
            explanation: "Asymptotic freedom dictates that quarks interact weakly at extremely high energies/densities (like in a quark star core), while color confinement ensures they remain bound into hadrons at lower energy scales."
        },
        {
            question: "In a quark-gluon plasma, the restoration of which symmetry is expected to occur alongside the deconfinement phase transition?",
            options: [
                "Baryon number symmetry", 
                "Chiral symmetry", 
                "CP symmetry", 
                "Electroweak symmetry"
            ],
            answer: "Chiral symmetry",
            explanation: "At high temperatures or densities, the spontaneously broken chiral symmetry of the QCD vacuum is expected to be restored, meaning quarks behave more like truly massless particles."
        },
        {
            question: "What defines the strange quark matter (SQM) hypothesis formulated by Bodmer and Witten?",
            options: [
                "Strange matter is only stable at high temperatures.", 
                "Matter composed of roughly equal numbers of up, down, and strange quarks is the true ground state of hadronic matter.", 
                "Strange quarks cannot exist in a stable state outside a black hole.", 
                "Quark stars must be composed entirely of charm and bottom quarks."
            ],
            answer: "Matter composed of roughly equal numbers of up, down, and strange quarks is the true ground state of hadronic matter.",
            explanation: "The Bodmer-Witten hypothesis suggests that strange quark matter might have a lower energy per baryon than ordinary nuclear matter (iron-56), making it the absolute stable ground state."
        }
    ];

    // --- MATERIALS ---
    const qcpMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.9, 
        roughness: 0.1, 
        emissive: 0x330033, 
        emissiveIntensity: 0.8, 
        wireframe: true 
    });

    const glowRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.5 });
    const glowGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.5 });
    const glowBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 2.5 });
    const quarkMaterials = [glowRed, glowGreen, glowBlue];

    const beamMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 5, 
        transparent: true, 
        opacity: 0.8 
    });

    const neonMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 3 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });

    // --- ANIMATION TRACKING ARRAYS ---
    const quarks = [];
    const laserBeams = [];
    const laserPistons = [];
    const tubes = [];
    const boomArms = [];
    const controlNodes = [];
    const wheels = [];
    const shells = [];
    const heatFins = [];

    // --- 1. QUARK-GLUON PLASMA CORE ---
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 80, 0); // Lifted to accommodate chassis
    group.add(coreGroup);

    const coreGeom = new THREE.IcosahedronGeometry(25, 8); // Extremely detailed
    const coreMesh = new THREE.Mesh(coreGeom, qcpMat);
    coreGroup.add(coreMesh);

    // Hundreds of quarks inside the core
    const quarkGeom = new THREE.SphereGeometry(0.8, 8, 8);
    for(let i=0; i<800; i++) {
        const c = i % 3;
        const qMesh = new THREE.Mesh(quarkGeom, quarkMaterials[c]);
        // Distribute randomly inside radius 24
        const r = 24 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        qMesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        qMesh.userData = {
            basePosition: qMesh.position.clone(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.05 + Math.random() * 0.15,
            colorType: c,
            orbitalAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
        };
        coreMesh.add(qMesh);
        quarks.push(qMesh);
    }

    // --- 2. GRAVITATIONAL LASERS ---
    const laserGroup = new THREE.Group();
    coreGroup.add(laserGroup);

    const icosahedronVertices = [
        [0, -1, -1.618], [0, 1, -1.618], [0, -1, 1.618], [0, 1, 1.618],
        [-1, -1.618, 0], [1, -1.618, 0], [-1, 1.618, 0], [1, 1.618, 0],
        [-1.618, 0, -1], [1.618, 0, -1], [-1.618, 0, 1], [1.618, 0, 1]
    ].map(v => new THREE.Vector3(v[0], v[1], v[2]).normalize());

    const laserBarrelGeom = new THREE.CylinderGeometry(3, 6, 30, 32);
    const laserRingGeom = new THREE.TorusGeometry(8, 1.5, 16, 64);
    const laserBeamGeom = new THREE.CylinderGeometry(1, 1, 45, 16);
    const pistonGeom = new THREE.CylinderGeometry(0.8, 0.8, 15, 16);

    icosahedronVertices.forEach((v, idx) => {
        const lGroup = new THREE.Group();
        const distance = 65;
        lGroup.position.copy(v).multiplyScalar(distance);
        lGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);

        const barrel = new THREE.Mesh(laserBarrelGeom, darkSteel);
        barrel.position.y = 15;
        lGroup.add(barrel);
        
        for(let r=0; r<6; r++) {
            const ring = new THREE.Mesh(laserRingGeom, copper);
            ring.position.y = 5 + r * 4.5;
            ring.scale.setScalar(1 - r*0.06);
            lGroup.add(ring);
        }

        const beam = new THREE.Mesh(laserBeamGeom, beamMat);
        beam.position.y = -7.5;
        lGroup.add(beam);
        laserBeams.push(beam);

        // Pistons for laser recoil animation
        for(let p=0; p<4; p++) {
            const piston = new THREE.Mesh(pistonGeom, chrome);
            const pAngle = (p / 4) * Math.PI * 2;
            piston.position.set(Math.cos(pAngle)*5, 15, Math.sin(pAngle)*5);
            lGroup.add(piston);
            laserPistons.push({ mesh: piston, baseY: 15, phase: Math.random() * Math.PI });
        }

        laserGroup.add(lGroup);
    });

    // --- 3. MAGNETIC CONFINEMENT D-COILS ---
    const coilGroup = new THREE.Group();
    coreGroup.add(coilGroup);
    
    const coilCount = 24;
    const dShape = new THREE.Shape();
    dShape.moveTo(0, 45);
    dShape.lineTo(0, -45);
    dShape.quadraticCurveTo(60, -45, 60, 0);
    dShape.quadraticCurveTo(60, 45, 0, 45);

    const extrudeSettings = { depth: 6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const dShapeGeom = new THREE.ExtrudeGeometry(dShape, extrudeSettings);
    dShapeGeom.center();
    
    const dCoils = [];
    const finGeom = new THREE.BoxGeometry(10, 0.4, 12);

    for(let c=0; c<coilCount; c++) {
        const coil = new THREE.Mesh(dShapeGeom, steel);
        const angle = (c / coilCount) * Math.PI * 2;
        coil.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
        coil.rotation.y = -angle; 
        
        // Heat fins on coils
        for(let f=0; f<30; f++) {
            const fin = new THREE.Mesh(finGeom, aluminum);
            fin.position.set(20, -35 + (f * 2.5), 0);
            coil.add(fin);
            heatFins.push({ mesh: fin, baseScale: 1, phase: Math.random() * Math.PI });
        }
        
        coilGroup.add(coil);
        dCoils.push(coil);
    }

    // --- 4. COLOSSAL PRESSURE VESSEL ---
    const vesselGroup = new THREE.Group();
    coreGroup.add(vesselGroup);
    
    const shellGeom = new THREE.SphereGeometry(100, 64, 64, 0, Math.PI / 2 - 0.15, 0, Math.PI / 2 - 0.15);
    const ribGeom = new THREE.TorusGeometry(100, 2, 16, 64, Math.PI / 2 - 0.15);
    
    const shellRotations = [
        [0, 0, 0], [0, Math.PI/2, 0], [0, Math.PI, 0], [0, -Math.PI/2, 0],
        [Math.PI, 0, 0], [Math.PI, Math.PI/2, 0], [Math.PI, Math.PI, 0], [Math.PI, -Math.PI/2, 0]
    ];
    
    shellRotations.forEach((rot, idx) => {
        const shell = new THREE.Mesh(shellGeom, darkSteel);
        shell.rotation.set(rot[0], rot[1], rot[2]);
        
        const rib1 = new THREE.Mesh(ribGeom, steel);
        rib1.rotation.x = Math.PI / 2;
        shell.add(rib1);
        
        const rib2 = new THREE.Mesh(ribGeom, steel);
        rib2.rotation.y = Math.PI / 2;
        shell.add(rib2);
        
        vesselGroup.add(shell);
        shells.push({ mesh: shell, baseRot: [...rot], phase: idx * 0.5 });
    });

    // --- 5. HYDRAULIC COOLANT NETWORK ---
    const hydraulicGroup = new THREE.Group();
    coreGroup.add(hydraulicGroup);
    
    for(let t=0; t<100; t++) {
        const points = [];
        let cur = new THREE.Vector3(
            (Math.random()-0.5) * 120,
            (Math.random()-0.5) * 120,
            (Math.random()-0.5) * 120
        ).normalize().multiplyScalar(75); 

        points.push(cur.clone());
        for(let p=1; p<6; p++) {
            cur.x += (Math.random()-0.5)*30;
            cur.y += (Math.random()-0.5)*30;
            cur.z += (Math.random()-0.5)*30;
            cur.normalize().multiplyScalar(75 + Math.random()*35);
            points.push(cur.clone());
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.8, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, rubber);
        hydraulicGroup.add(tubeMesh);
        tubes.push({ mesh: tubeMesh, phase: Math.random() * Math.PI * 2 });
    }

    // --- 6. EQUATORIAL CONTROL RING ---
    const equatorialRing = new THREE.Group();
    coreGroup.add(equatorialRing);
    
    const mainRingGeom = new THREE.TorusGeometry(105, 5, 32, 128);
    const mainRing = new THREE.Mesh(mainRingGeom, chrome);
    mainRing.rotation.x = Math.PI / 2;
    equatorialRing.add(mainRing);
    
    const nodeGeom = new THREE.CylinderGeometry(3, 3, 12, 16);
    const screenGeom = new THREE.PlaneGeometry(4.5, 3);
    const antGeom = new THREE.CylinderGeometry(0.2, 0.2, 8);
    
    for(let n=0; n<48; n++) {
        const angle = (n / 48) * Math.PI * 2;
        const node = new THREE.Group();
        node.position.set(Math.cos(angle) * 105, 0, Math.sin(angle) * 105);
        node.rotation.y = -angle;
        
        const body = new THREE.Mesh(nodeGeom, plastic);
        node.add(body);
        
        const screen = new THREE.Mesh(screenGeom, screenGlow);
        screen.position.set(0, 0, 3.1);
        node.add(screen);
        
        const ant1 = new THREE.Mesh(antGeom, copper);
        ant1.position.set(-1.5, 6, 0);
        node.add(ant1);
        
        const ant2 = new THREE.Mesh(antGeom, copper);
        ant2.position.set(1.5, 6, 0);
        node.add(ant2);
        
        equatorialRing.add(node);
        controlNodes.push({ group: node, screen: screen });
    }

    // --- 7. PARTICLE ACCELERATOR RING ---
    const acceleratorGroup = new THREE.Group();
    coreGroup.add(acceleratorGroup);
    
    const accGeom = new THREE.TorusGeometry(180, 10, 64, 256);
    const accMesh = new THREE.Mesh(accGeom, steel);
    accMesh.rotation.x = Math.PI / 2;
    acceleratorGroup.add(accMesh);
    
    const accNodeGeom = new THREE.BoxGeometry(25, 16, 30);
    for(let a=0; a<72; a++) {
        const aAngle = (a / 72) * Math.PI * 2;
        const aNode = new THREE.Mesh(accNodeGeom, darkSteel);
        aNode.position.set(Math.cos(aAngle)*180, 0, Math.sin(aAngle)*180);
        aNode.rotation.y = -aAngle;
        
        const neonLine = new THREE.Mesh(new THREE.BoxGeometry(26, 3, 3), neonMagenta);
        aNode.add(neonLine);
        
        acceleratorGroup.add(aNode);
    }
    
    const exhaustGeom = new THREE.CylinderGeometry(6, 9, 60, 16);
    for(let e=0; e<12; e++) {
        const eAngle = (e / 12) * Math.PI * 2;
        const exhaust = new THREE.Mesh(exhaustGeom, darkSteel);
        exhaust.position.set(Math.cos(eAngle)*150, -40, Math.sin(eAngle)*150);
        exhaust.rotation.x = -Math.PI / 6 * Math.cos(eAngle);
        exhaust.rotation.z = Math.PI / 6 * Math.sin(eAngle);
        acceleratorGroup.add(exhaust);
    }

    // --- 8. COLOSSAL OFF-ROAD TRANSPORT TIRES ---
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);
    
    const wheelGroup = new THREE.Group();
    chassisGroup.add(wheelGroup);
    
    const wheelRadius = 45;
    const wheelTube = 15;
    const wheelTorusGeom = new THREE.TorusGeometry(wheelRadius, wheelTube, 32, 128);
    const lugGeom = new THREE.BoxGeometry(6, 3, 34); 
    const rimGeom = new THREE.CylinderGeometry(wheelRadius - wheelTube + 1, wheelRadius - wheelTube + 1, 26, 64);
    const spokeGeom = new THREE.CylinderGeometry(3, 3, (wheelRadius - wheelTube) * 2, 16);
    const subSpokeGeom = new THREE.CylinderGeometry(1.5, 1.5, wheelRadius - wheelTube, 8);
    const hubGeom = new THREE.CylinderGeometry(12, 15, 30, 32);
    
    const wheelPositions = [
        [-120, 45, -120], [120, 45, -120],
        [-120, 45, 120], [120, 45, 120]
    ];
    
    wheelPositions.forEach(pos => {
        const wGroup = new THREE.Group();
        wGroup.position.set(pos[0], pos[1], pos[2]);
        if(pos[0] < 0) wGroup.rotation.y = Math.PI; 
        
        const tire = new THREE.Mesh(wheelTorusGeom, rubber);
        tire.rotation.x = Math.PI / 2;
        wGroup.add(tire);
        
        const numLugs = 140;
        for(let l=0; l<numLugs; l++) {
            const angle = (l / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * (wheelRadius + wheelTube * 0.8), 0, Math.sin(angle) * (wheelRadius + wheelTube * 0.8));
            lug.rotation.y = -angle;
            lug.rotation.z = (l % 2 === 0) ? Math.PI / 8 : -Math.PI / 8;
            lug.rotation.x = Math.PI / 2;
            wGroup.add(lug);
        }
        
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.x = Math.PI / 2;
        wGroup.add(rim);
        
        for(let s=0; s<16; s++) {
            const spokeAngle = (s / 16) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = spokeAngle;
            wGroup.add(spoke);
            
            const subSpoke = new THREE.Mesh(subSpokeGeom, darkSteel);
            subSpoke.rotation.x = Math.PI / 2;
            subSpoke.rotation.z = spokeAngle + (Math.PI / 32);
            wGroup.add(subSpoke);
        }
        
        const hub = new THREE.Mesh(hubGeom, copper);
        hub.rotation.x = Math.PI / 2;
        wGroup.add(hub);
        
        wheelGroup.add(wGroup);
        wheels.push(wGroup);
    });

    // --- 9. MAINTENANCE BOOM ARMS ---
    const boomGroup = new THREE.Group();
    coreGroup.add(boomGroup);
    
    const boomBaseGeom = new THREE.CylinderGeometry(12, 16, 15, 32);
    const boomSegGeom = new THREE.BoxGeometry(6, 60, 6);
    const boomJointGeom = new THREE.SphereGeometry(9, 32, 32);
    const boomPistonGeom = new THREE.CylinderGeometry(2, 2, 45);
    const torchGeom = new THREE.CylinderGeometry(1.5, 3, 12);
    
    for(let b=0; b<4; b++) {
        const bGroup = new THREE.Group();
        const bAngle = (b / 4) * Math.PI * 2;
        bGroup.position.set(Math.cos(bAngle)*130, -80, Math.sin(bAngle)*130);
        bGroup.rotation.y = -bAngle;
        
        const base = new THREE.Mesh(boomBaseGeom, darkSteel);
        bGroup.add(base);
        
        const joint1 = new THREE.Mesh(boomJointGeom, chrome);
        joint1.position.y = 7.5;
        bGroup.add(joint1);
        
        const arm1 = new THREE.Group();
        arm1.position.y = 7.5;
        const arm1Mesh = new THREE.Mesh(boomSegGeom, steel);
        arm1Mesh.position.y = 30;
        arm1.add(arm1Mesh);
        bGroup.add(arm1);
        
        const piston1 = new THREE.Mesh(boomPistonGeom, chrome);
        piston1.position.set(0, 22.5, -6);
        arm1.add(piston1);
        
        const joint2 = new THREE.Mesh(boomJointGeom, chrome);
        joint2.position.y = 60;
        arm1.add(joint2);
        
        const arm2 = new THREE.Group();
        arm2.position.y = 60;
        const arm2Mesh = new THREE.Mesh(boomSegGeom, aluminum);
        arm2Mesh.position.y = 30;
        arm2.add(arm2Mesh);
        arm1.add(arm2);
        
        const torch = new THREE.Mesh(torchGeom, copper);
        torch.position.y = 60;
        torch.rotation.x = Math.PI / 2;
        arm2.add(torch);
        
        boomGroup.add(bGroup);
        boomArms.push({ arm1, arm2, piston1, phase: b * Math.PI / 2 });
    }

    // --- 10. DETAILED OPERATOR CABIN ---
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 150, 200);
    chassisGroup.add(cabinGroup);
    
    const cabinGeom = new THREE.BoxGeometry(45, 30, 30);
    const cabinMesh = new THREE.Mesh(cabinGeom, darkSteel);
    cabinGroup.add(cabinMesh);
    
    const glassGeom = new THREE.PlaneGeometry(42, 18);
    const glassMesh = new THREE.Mesh(glassGeom, tinted);
    glassMesh.position.set(0, 3, 15.1);
    cabinGroup.add(glassMesh);
    
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, 0, 7.5);
    cabinGroup.add(interiorGroup);
    
    const steerGeom = new THREE.TorusGeometry(4.5, 0.8, 16, 32);
    const steerMesh = new THREE.Mesh(steerGeom, rubber);
    steerMesh.rotation.x = -Math.PI / 4;
    steerMesh.position.set(0, -3, 3);
    interiorGroup.add(steerMesh);
    
    const joyBase = new THREE.CylinderGeometry(1.5, 1.5, 3);
    const joyStick = new THREE.CylinderGeometry(0.3, 0.3, 6);
    const joyKnob = new THREE.SphereGeometry(1.2, 16, 16);
    
    const joy1 = new THREE.Group();
    joy1.position.set(-12, -6, 0);
    const jb1 = new THREE.Mesh(joyBase, steel);
    const js1 = new THREE.Mesh(joyStick, chrome);
    js1.position.y = 3;
    const jk1 = new THREE.Mesh(joyKnob, plastic);
    jk1.position.y = 6;
    joy1.add(jb1, js1, jk1);
    interiorGroup.add(joy1);
    
    const joy2 = new THREE.Group();
    joy2.position.set(12, -6, 0);
    const jb2 = new THREE.Mesh(joyBase, steel);
    const js2 = new THREE.Mesh(joyStick, chrome);
    js2.position.y = 3;
    const jk2 = new THREE.Mesh(joyKnob, plastic);
    jk2.position.y = 6;
    joy2.add(jb2, js2, jk2);
    interiorGroup.add(joy2);
    
    const panelGeom = new THREE.BoxGeometry(30, 1.5, 7.5);
    const panelMesh = new THREE.Mesh(panelGeom, darkSteel);
    panelMesh.position.set(0, -7.5, 3);
    panelMesh.rotation.x = Math.PI / 6;
    interiorGroup.add(panelMesh);
    
    const pScreenGeom = new THREE.PlaneGeometry(6, 4.5);
    for(let s=0; s<4; s++) {
        const pScreen = new THREE.Mesh(pScreenGeom, screenGlow);
        pScreen.position.set(-11.25 + s * 7.5, 0.8, 0);
        pScreen.rotation.x = -Math.PI / 2;
        panelMesh.add(pScreen);
    }

    const mirrorBracketGeom = new THREE.CylinderGeometry(0.3, 0.3, 6);
    const mirrorGeom = new THREE.BoxGeometry(1.5, 4.5, 3);
    
    const leftMirror = new THREE.Group();
    leftMirror.position.set(-24, 3, 12);
    const lb = new THREE.Mesh(mirrorBracketGeom, darkSteel);
    lb.rotation.z = Math.PI / 2;
    const lm = new THREE.Mesh(mirrorGeom, chrome);
    lm.position.set(-3, 0, 0);
    leftMirror.add(lb, lm);
    cabinGroup.add(leftMirror);
    
    const rightMirror = new THREE.Group();
    rightMirror.position.set(24, 3, 12);
    const rb = new THREE.Mesh(mirrorBracketGeom, darkSteel);
    rb.rotation.z = -Math.PI / 2;
    const rm = new THREE.Mesh(mirrorGeom, chrome);
    rm.position.set(3, 0, 0);
    rightMirror.add(rb, rm);
    cabinGroup.add(rightMirror);
    
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(0, -45, 15);
    cabinGroup.add(ladderGroup);
    
    const railGeom = new THREE.CylinderGeometry(0.8, 0.8, 90);
    const railL = new THREE.Mesh(railGeom, steel);
    railL.position.set(-6, 0, 0);
    ladderGroup.add(railL);
    
    const railR = new THREE.Mesh(railGeom, steel);
    railR.position.set(6, 0, 0);
    ladderGroup.add(railR);
    
    const rungGeom = new THREE.CylinderGeometry(0.6, 0.6, 12);
    for(let r=0; r<20; r++) {
        const rung = new THREE.Mesh(rungGeom, aluminum);
        rung.position.set(0, -42 + r * 4.5, 0);
        rung.rotation.z = Math.PI / 2;
        ladderGroup.add(rung);
    }
    
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(0, 100, 195);
    chassisGroup.add(grilleGroup);
    
    const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(60, 30, 3), darkSteel);
    grilleGroup.add(grilleFrame);
    
    const grilleSlatGeom = new THREE.BoxGeometry(57, 1.5, 4.5);
    for(let s=0; s<12; s++) {
        const slat = new THREE.Mesh(grilleSlatGeom, chrome);
        slat.position.set(0, -12 + s * 2.5, 1.5);
        slat.rotation.x = Math.PI / 8;
        grilleGroup.add(slat);
    }

    // --- PARTS METADATA ---
    parts.push({
        name: "Quark-Gluon Plasma Core",
        description: "A highly condensed state of matter where neutrons have broken down into constituent quarks and gluons. Simulates a color-superconducting phase.",
        material: "qcpMat",
        function: "Serves as the primary simulated body of the quark star core, vibrating at extreme frequencies to represent thermal instability.",
        assemblyOrder: 1,
        connections: ["Gravitational Lasers", "Hydraulic Coolant Network"],
        failureEffect: "Spontaneous hadronization resulting in a catastrophic energy release equivalent to a supernova.",
        cascadeFailures: ["Primary Pressure Vessel Breach", "Total Facility Vaporization"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });
    
    parts.push({
        name: "Gravitational Laser Emitters",
        description: "Hyper-dense phased arrays capable of generating localized gravity wells.",
        material: "darkSteel",
        function: "Confines the quark-gluon plasma by exerting massive inward gravitational pressure.",
        assemblyOrder: 2,
        connections: ["Quark-Gluon Plasma Core", "Laser Focusing Torus Rings"],
        failureEffect: "Loss of confinement, plasma expansion.",
        cascadeFailures: ["Quark Sub-particles Escaping"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 100, y: 150, z: -100 }
    });

    parts.push({
        name: "Laser Focusing Torus Rings",
        description: "Copper-alloy rings infused with room-temperature superconductors.",
        material: "copper",
        function: "Focuses the scattered gravitational waves into a coherent beam.",
        assemblyOrder: 3,
        connections: ["Gravitational Laser Emitters"],
        failureEffect: "Beam defocusing, spatial distortion.",
        cascadeFailures: ["Hydraulic Piston Array Overload"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 150, y: 120, z: -150 }
    });

    parts.push({
        name: "Hydraulic Piston Arrays",
        description: "Massive chrome-plated dampeners.",
        material: "chrome",
        function: "Absorbs the immense recoil generated by gravitational pulsing.",
        assemblyOrder: 4,
        connections: ["Gravitational Laser Emitters", "Primary Pressure Vessel Shells"],
        failureEffect: "Structural fracturing.",
        cascadeFailures: ["Primary Pressure Vessel Breach"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 200, y: 100, z: -200 }
    });

    parts.push({
        name: "Magnetic Confinement D-Coils",
        description: "Tokamak-style magnetic field generators scaled up by an order of magnitude.",
        material: "steel",
        function: "Provides a secondary magnetic bottle for any escaping charged quarks.",
        assemblyOrder: 5,
        connections: ["Hydraulic Coolant Network", "Equatorial Control Ring"],
        failureEffect: "Magnetic field collapse.",
        cascadeFailures: ["Plasma Exhaust Stacks Overheating"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -100, y: 50, z: 100 }
    });

    parts.push({
        name: "Primary Pressure Vessel Shells",
        description: "Spherical interlocking plates made of degenerate matter alloy.",
        material: "darkSteel",
        function: "The ultimate physical barrier containing the simulation.",
        assemblyOrder: 6,
        connections: ["Secondary Reinforcement Ribs", "Magnetic Confinement D-Coils"],
        failureEffect: "Explosive decompression.",
        cascadeFailures: ["Total Facility Vaporization"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -200, y: 200, z: 200 }
    });

    parts.push({
        name: "Secondary Reinforcement Ribs",
        description: "Cross-hatched toroidal structural supports.",
        material: "steel",
        function: "Prevents the primary vessel from warping under asymmetrical gravity loads.",
        assemblyOrder: 7,
        connections: ["Primary Pressure Vessel Shells"],
        failureEffect: "Vessel warping.",
        cascadeFailures: ["Primary Pressure Vessel Breach"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -250, y: 250, z: 250 }
    });

    parts.push({
        name: "Hydraulic Coolant Network",
        description: "An incredibly dense, chaotic web of rubberized high-pressure tubing.",
        material: "rubber",
        function: "Pumps liquid helium directly to the core to stave off thermal runaway.",
        assemblyOrder: 8,
        connections: ["Magnetic Confinement D-Coils", "Gravitational Laser Emitters"],
        failureEffect: "Coolant leak, localized freezing.",
        cascadeFailures: ["Magnetic field collapse"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    parts.push({
        name: "Colossal Transport Wheels",
        description: "Hyper-massive torus geometries serving as the foundation of mobility.",
        material: "rubber",
        function: "Allows the entire God-Tier simulator to traverse hostile off-road terrain.",
        assemblyOrder: 9,
        connections: ["Complex Spoke Rims", "Main Transport Chassis Frame"],
        failureEffect: "Immobility.",
        cascadeFailures: ["Ground Subsidence"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 45, z: 300 }
    });

    parts.push({
        name: "Aggressive Off-Road Treads",
        description: "Extruded box geometries forming deep, rugged lugs.",
        material: "rubber",
        function: "Provides unprecedented traction on unpaved planetary surfaces.",
        assemblyOrder: 10,
        connections: ["Colossal Transport Wheels"],
        failureEffect: "Loss of traction.",
        cascadeFailures: ["Chassis slipping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 350, y: 45, z: 350 }
    });

    parts.push({
        name: "Complex Spoke Rims",
        description: "Intricate arrays of cylindrical steel and dark steel struts.",
        material: "chrome",
        function: "Distributes the weight of a simulated star core across the wheels.",
        assemblyOrder: 11,
        connections: ["Colossal Transport Wheels"],
        failureEffect: "Rim buckling.",
        cascadeFailures: ["Wheel Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 400, y: 45, z: 400 }
    });

    parts.push({
        name: "Maintenance Boom Arm Bases",
        description: "Heavy cylindrical anchors for the robotic arms.",
        material: "darkSteel",
        function: "Allows articulation and rotation for external repairs.",
        assemblyOrder: 12,
        connections: ["Articulated Boom Segments", "Main Transport Chassis Frame"],
        failureEffect: "Arm detachment.",
        cascadeFailures: ["Inability to repair core"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -100, y: 0, z: -100 }
    });

    parts.push({
        name: "Articulated Boom Segments",
        description: "Long aluminum and steel reach arms with hydraulic pistons.",
        material: "aluminum",
        function: "Delivers plasma torches and sensors precisely to breached hull sections.",
        assemblyOrder: 13,
        connections: ["Maintenance Boom Arm Bases"],
        failureEffect: "Loss of articulation.",
        cascadeFailures: ["Arm Collision"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -150, y: 50, z: -150 }
    });

    parts.push({
        name: "Particle Accelerator Ring",
        description: "A colossal torus wrapping the equator of the simulator.",
        material: "steel",
        function: "Accelerates heavy ions to relativistic speeds for injection into the core.",
        assemblyOrder: 14,
        connections: ["Electromagnetic Accelerator Nodes"],
        failureEffect: "Particle beam derailment.",
        cascadeFailures: ["Radiation leak"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 300 }
    });

    parts.push({
        name: "Electromagnetic Accelerator Nodes",
        description: "Blocky hubs with glowing magenta neon trim.",
        material: "darkSteel",
        function: "Pulses electromagnetism to push ions around the accelerator ring.",
        assemblyOrder: 15,
        connections: ["Particle Accelerator Ring"],
        failureEffect: "Node burnout.",
        cascadeFailures: ["Particle Accelerator Ring failure"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 350 }
    });

    parts.push({
        name: "Plasma Exhaust Stacks",
        description: "Angled chimneys venting excess energy.",
        material: "darkSteel",
        function: "Safely dissipates thermal buildup from the accelerator nodes.",
        assemblyOrder: 16,
        connections: ["Electromagnetic Accelerator Nodes"],
        failureEffect: "Thermal bottleneck.",
        cascadeFailures: ["Node burnout"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 400 }
    });

    parts.push({
        name: "Operator Cabin Enclosure",
        description: "A heavily armored steel box serving as the nerve center.",
        material: "darkSteel",
        function: "Protects human operators from hard radiation and extreme noise.",
        assemblyOrder: 17,
        connections: ["Tinted Observation Glass", "Main Transport Chassis Frame"],
        failureEffect: "Operator exposure.",
        cascadeFailures: ["Loss of manual control"],
        originalPosition: { x: 0, y: 150, z: 200 },
        explodedPosition: { x: 0, y: 300, z: 400 }
    });

    parts.push({
        name: "Tinted Observation Glass",
        description: "Thick, dark-tinted transparent material.",
        material: "tinted",
        function: "Filters blinding flashes of gluon-exchange radiation.",
        assemblyOrder: 18,
        connections: ["Operator Cabin Enclosure"],
        failureEffect: "Operator blinding.",
        cascadeFailures: ["Loss of manual control"],
        originalPosition: { x: 0, y: 150, z: 200 },
        explodedPosition: { x: 0, y: 300, z: 450 }
    });

    parts.push({
        name: "Cabin Steering and Controls",
        description: "Rubber steering wheels, chrome joysticks, and glowing interface screens.",
        material: "plastic",
        function: "Enables precise maneuvering of the colossal chassis and core parameters.",
        assemblyOrder: 19,
        connections: ["Operator Cabin Enclosure"],
        failureEffect: "Navigation lock.",
        cascadeFailures: ["Uncontrolled movement"],
        originalPosition: { x: 0, y: 150, z: 200 },
        explodedPosition: { x: 0, y: 300, z: 500 }
    });

    parts.push({
        name: "Access Ladder",
        description: "A sheer vertical drop of steel rails and aluminum rungs.",
        material: "aluminum",
        function: "Allows brave technicians to ascend to the cabin.",
        assemblyOrder: 20,
        connections: ["Operator Cabin Enclosure"],
        failureEffect: "Technician fall.",
        cascadeFailures: ["Maintenance delay"],
        originalPosition: { x: 0, y: 150, z: 200 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    parts.push({
        name: "Front Chassis Grille",
        description: "Massive chrome slats protecting the underbelly.",
        material: "chrome",
        function: "Deflects incoming debris when driving through apocalyptic wastelands.",
        assemblyOrder: 21,
        connections: ["Main Transport Chassis Frame"],
        failureEffect: "Underbelly damage.",
        cascadeFailures: ["Drive shaft severing"],
        originalPosition: { x: 0, y: 100, z: 195 },
        explodedPosition: { x: 0, y: -50, z: 300 }
    });

    // --- ANIMATION LOOP ---
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        // 1. Vibrate and rotate the main core
        coreMesh.rotation.x = t * 0.15;
        coreMesh.rotation.y = t * 0.25;
        coreMesh.scale.setScalar(1 + Math.sin(t * 15) * 0.02); // High frequency thermal vibration
        
        // 2. Animate hundreds of quarks violently exchanging gluons
        quarks.forEach((q) => {
            q.position.x = q.userData.basePosition.x + Math.sin(t * q.userData.speed * 20 + q.userData.phase) * 3;
            q.position.y = q.userData.basePosition.y + Math.cos(t * q.userData.speed * 20 + q.userData.phase) * 3;
            q.position.z = q.userData.basePosition.z + Math.sin(t * q.userData.speed * 25 + q.userData.phase) * 3;
            
            // Rapid color flashing representing gluon exchange
            if (Math.random() < 0.08) {
                const newColor = Math.floor(Math.random() * 3);
                q.material = quarkMaterials[newColor];
                q.userData.colorType = newColor;
            }
        });
        
        // 3. Pulse gravitational lasers
        laserBeams.forEach((beam, idx) => {
            beam.material.opacity = 0.4 + Math.sin(t * 8 + idx) * 0.6;
            beam.scale.set(1 + Math.sin(t * 12 + idx)*0.3, 1, 1 + Math.sin(t * 12 + idx)*0.3);
        });
        
        // 4. Laser recoil pistons
        laserPistons.forEach((p) => {
            p.mesh.position.y = p.baseY + Math.sin(t * 12 + p.phase) * 2.5;
        });
        
        // 5. Vessel groaning under immense pressure
        shells.forEach((shell) => {
            const stretch = 1 + Math.sin(t * 3 + shell.phase) * 0.015;
            shell.mesh.scale.set(stretch, stretch, stretch);
        });
        
        // 6. Tubes pulsating with coolant
        tubes.forEach((tObj) => {
            const s = 1 + Math.sin(t * 5 + tObj.phase) * 0.15;
            tObj.mesh.scale.set(1, s, 1);
        });
        
        // 7. Boom arms articulating with complex sine waves
        boomArms.forEach((boom) => {
            boom.arm1.rotation.x = Math.sin(t * 0.8 + boom.phase) * 0.6 + 0.4;
            boom.arm2.rotation.x = Math.sin(t * 1.2 + boom.phase) * 0.7 - 0.4;
            boom.piston1.position.y = 22.5 + Math.sin(t * 0.8 + boom.phase) * 4;
        });
        
        // 8. Control nodes flickering
        controlNodes.forEach((node) => {
            if (Math.random() < 0.15) {
                node.screen.material.emissiveIntensity = Math.random() * 3;
            }
        });
        
        // 9. Accelerator ring spin and heat fin pulsing
        acceleratorGroup.rotation.y = t * 0.4;
        heatFins.forEach(fin => {
            fin.mesh.scale.x = fin.baseScale + Math.sin(t * 10 + fin.phase) * 0.2;
        });
        
        // 10. Wheels rotating and steering slightly
        wheels.forEach((w, idx) => {
            w.rotation.x = t * 1.5; // rolling forward rapidly
            // Front wheels steer slightly with sine wave
            if(idx < 2) {
                w.rotation.y = Math.sin(t * 0.5) * 0.2;
                if(idx === 0) w.rotation.y += Math.PI; // Adjust for left-side mirroring
            }
        });
    };

    return { group, parts, description, quizQuestions, animate };
}
