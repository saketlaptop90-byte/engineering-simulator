import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CLONE MATERIALS TO AVOID MUTATING GLOBALS ---
    const localSteel = steel.clone();
    const localDarkSteel = darkSteel.clone();
    const localCopper = copper.clone();
    const localChrome = chrome.clone();
    const localRubber = rubber.clone();
    const localGlass = glass.clone();
    
    // --- CUSTOM GLOWING MATERIALS ---
    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x050505, metalness: 0.9, roughness: 0.2, emissive: 0x001133, emissiveIntensity: 1.0
    });
    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff00ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8, side: THREE.DoubleSide
    });
    const plasmaOuterMat = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0x5500aa, emissiveIntensity: 1.5, transparent: true, opacity: 0.2, wireframe: true, side: THREE.DoubleSide
    });
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00aa00, emissive: 0x00ff00, emissiveIntensity: 1
    });

    // ==========================================
    // MATH & PARAMETRIC CURVES
    // ==========================================
    class PlasmaCurve extends THREE.Curve {
        constructor(scale = 25, periods = 5, distortion = 3.0) {
            super();
            this.scale = scale;
            this.periods = periods;
            this.distortion = distortion;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const phi = t * Math.PI * 2;
            const r = this.scale + this.distortion * Math.cos(this.periods * phi);
            const x = r * Math.cos(phi);
            const y = this.distortion * Math.sin(this.periods * phi);
            const z = r * Math.sin(phi);
            return optionalTarget.set(x, y, z);
        }
    }

    class CoilCurve extends THREE.Curve {
        constructor(basePhi, R = 25, a = 7, periods = 5, twistAmplitude = 0.4, poloidalDeform = 1.2) {
            super();
            this.basePhi = basePhi;
            this.R = R;
            this.a = a;
            this.periods = periods;
            this.twistAmplitude = twistAmplitude;
            this.poloidalDeform = poloidalDeform;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const theta = t * Math.PI * 2;
            const axisR = this.R + 3 * Math.cos(this.periods * this.basePhi);
            const axisY = 3 * Math.sin(this.periods * this.basePhi);
            const localPhi = this.basePhi + this.twistAmplitude * Math.sin(theta + this.periods * this.basePhi);
            const r = this.a + this.poloidalDeform * Math.cos(2 * theta + this.basePhi);
            const x = (axisR + r * Math.cos(theta)) * Math.cos(localPhi);
            const y = axisY + r * Math.sin(theta);
            const z = (axisR + r * Math.cos(theta)) * Math.sin(localPhi);
            return optionalTarget.set(x, y, z);
        }
    }

    class CoolingPipeCurve extends THREE.Curve {
        constructor(coilCurve, radius = 2.0, wraps = 20) {
            super();
            this.coilCurve = coilCurve;
            this.radius = radius;
            this.wraps = wraps;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const center = this.coilCurve.getPoint(t);
            const tangent = this.coilCurve.getTangent(t);
            const up = new THREE.Vector3(0, 1, 0);
            let normal = new THREE.Vector3().crossVectors(tangent, up);
            if (normal.lengthSq() < 0.001) normal = new THREE.Vector3(1, 0, 0).crossVectors(tangent, new THREE.Vector3(1, 0, 0));
            normal.normalize();
            const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
            const angle = t * Math.PI * 2 * this.wraps;
            const offset = new THREE.Vector3()
                .addScaledVector(normal, Math.cos(angle) * this.radius)
                .addScaledVector(binormal, Math.sin(angle) * this.radius);
            return optionalTarget.copy(center).add(offset);
        }
    }

    class DivertorCurve extends THREE.Curve {
        constructor(baseCurve, offsetY = 4) {
            super();
            this.baseCurve = baseCurve;
            this.offsetY = offsetY;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const pt = this.baseCurve.getPoint(t);
            const tangent = this.baseCurve.getTangent(t);
            const up = new THREE.Vector3(0, 1, 0);
            let normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
            let binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
            return optionalTarget.copy(pt).addScaledVector(binormal, this.offsetY);
        }
    }

    class BusbarCurve extends THREE.Curve {
        constructor(R=36, periods=5, waveHeight=8) {
            super();
            this.R = R;
            this.periods = periods;
            this.waveHeight = waveHeight;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2;
            return optionalTarget.set(this.R * Math.cos(angle), Math.sin(angle * this.periods) * this.waveHeight, this.R * Math.sin(angle));
        }
    }

    function createTruss(p1, p2, radius, radialSegments, material) {
        const distance = p1.distanceTo(p2);
        if (distance < 0.001) return new THREE.Group();
        const geo = new THREE.CylinderGeometry(radius, radius, distance, radialSegments);
        geo.translate(0, distance / 2, 0);
        geo.rotateX(Math.PI / 2);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.copy(p1);
        mesh.lookAt(p2);
        return mesh;
    }

    // ==========================================
    // STELLARATOR REACTOR COMPONENTS (Y OFFSET +25)
    // ==========================================
    const reactorOffset = new THREE.Vector3(0, 25, 0);
    const reactorGroup = new THREE.Group();
    reactorGroup.position.copy(reactorOffset);
    group.add(reactorGroup);

    // 1. Central Support Column
    const centralColumnGroup = new THREE.Group();
    const colHeight = 40;
    const colRadius = 8;
    const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 32), localGlass);
    centralColumnGroup.add(coreMesh);
    
    // Internal Matrix Lattice for the column
    for(let y=-15; y<=15; y+=5) {
        for(let i=0; i<8; i++) {
            const a1 = (i/8)*Math.PI*2;
            const a2 = ((i+3)%8/8)*Math.PI*2;
            const p1 = new THREE.Vector3(7.5*Math.cos(a1), y, 7.5*Math.sin(a1));
            const p2 = new THREE.Vector3(7.5*Math.cos(a2), y+5, 7.5*Math.sin(a2));
            centralColumnGroup.add(createTruss(p1, p2, 0.2, 4, localSteel));
        }
    }
    
    // Flanges & Ribs
    [-20, -10, 0, 10, 20].forEach(y => {
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(colRadius+1.5, colRadius+1.5, 1, 32), localSteel);
        flange.position.y = y;
        centralColumnGroup.add(flange);
    });
    for(let r=0; r<16; r++) {
        const angle = (r / 16) * Math.PI * 2;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(1.5, colHeight, 2.5), localSteel);
        rib.position.set((colRadius + 0.5) * Math.cos(angle), 0, (colRadius + 0.5) * Math.sin(angle));
        rib.rotation.y = -angle;
        centralColumnGroup.add(rib);
    }
    reactorGroup.add(centralColumnGroup);

    // 2. Coils, Casings, Cooling, and Struts
    const N_COILS = 50;
    const windingsGroup = new THREE.Group();
    const casingsGroup = new THREE.Group();
    const coolingGroup = new THREE.Group();
    const strutsGroup = new THREE.Group();
    const interCoilGroup = new THREE.Group();
    
    const uShape = new THREE.Shape();
    const outR = 2.0; const inR = 1.4;
    uShape.absarc(0, 0, outR, 0, Math.PI * 1.5, false);
    uShape.lineTo(Math.cos(Math.PI * 1.5) * inR, Math.sin(Math.PI * 1.5) * inR);
    uShape.absarc(0, 0, inR, Math.PI * 1.5, 0, true);
    uShape.lineTo(outR, 0);

    for (let i=0; i<N_COILS; i++) {
        const basePhi = (i / N_COILS) * Math.PI * 2;
        const nextPhi = ((i+1)%N_COILS / N_COILS) * Math.PI * 2;
        const curve = new CoilCurve(basePhi, 25, 7, 5, 0.4, 1.2);
        const nextCurve = new CoilCurve(nextPhi, 25, 7, 5, 0.4, 1.2);
        
        // Winding
        const wGeo = new THREE.TubeGeometry(curve, 100, 1.2, 16, true);
        windingsGroup.add(new THREE.Mesh(wGeo, superConductorMat));
        
        // Casing (U-Shape extrusion)
        const extrudeSettings = { steps: 100, extrudePath: curve, bevelEnabled: false };
        const casingGeo = new THREE.ExtrudeGeometry(uShape, extrudeSettings);
        casingsGroup.add(new THREE.Mesh(casingGeo, localDarkSteel));
        
        // Cooling pipes
        const pipeCurve = new CoolingPipeCurve(curve, 2.1, 15);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 200, 0.15, 8, false);
        coolingGroup.add(new THREE.Mesh(pipeGeo, localCopper));
        
        // Radial Struts to Central Column
        const p1Col = new THREE.Vector3(8 * Math.cos(basePhi), 0, 8 * Math.sin(basePhi));
        const p2Mid = curve.getPoint(0.5);
        strutsGroup.add(createTruss(p1Col, p2Mid, 0.6, 8, localDarkSteel));
        strutsGroup.add(createTruss(p1Col.clone().setY(15), curve.getPoint(0.375), 0.4, 8, localSteel));
        strutsGroup.add(createTruss(p1Col.clone().setY(-15), curve.getPoint(0.625), 0.4, 8, localSteel));
        
        // Inter-coil Trusses
        [0.25, 0.0, 0.75].forEach(t => {
            interCoilGroup.add(createTruss(curve.getPoint(t), nextCurve.getPoint(t), 0.5, 8, localSteel));
        });
        interCoilGroup.add(createTruss(curve.getPoint(0.2), nextCurve.getPoint(0.3), 0.25, 8, localDarkSteel));
    }
    reactorGroup.add(windingsGroup);
    reactorGroup.add(casingsGroup);
    reactorGroup.add(coolingGroup);
    reactorGroup.add(strutsGroup);
    reactorGroup.add(interCoilGroup);

    // 3. Vacuum Vessel & Plasma
    const plasmaCurve = new PlasmaCurve(25, 5, 3.0);
    const vesselOuterGroup = new THREE.Group();
    const vesselWireGroup = new THREE.Group();
    const vGeo = new THREE.TubeGeometry(plasmaCurve, 200, 5.5, 24, true);
    vesselOuterGroup.add(new THREE.Mesh(vGeo, new THREE.MeshPhysicalMaterial({
        color: 0x222222, metalness: 0.9, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.5, side: THREE.DoubleSide
    })));
    vesselWireGroup.add(new THREE.Mesh(vGeo, new THREE.MeshStandardMaterial({
        color: 0x555555, metalness: 1.0, roughness: 0.5, wireframe: true
    })));
    reactorGroup.add(vesselOuterGroup);
    reactorGroup.add(vesselWireGroup);

    const plasmaCoreGroup = new THREE.Group();
    const plasmaOuterGroup = new THREE.Group();
    const pGeoCore = new THREE.TubeGeometry(plasmaCurve, 200, 1.5, 16, true);
    const pGeoOuter = new THREE.TubeGeometry(plasmaCurve, 200, 3.5, 32, true);
    plasmaCoreGroup.add(new THREE.Mesh(pGeoCore, plasmaCoreMat));
    plasmaOuterGroup.add(new THREE.Mesh(pGeoOuter, plasmaOuterMat));
    reactorGroup.add(plasmaCoreGroup);
    reactorGroup.add(plasmaOuterGroup);

    // 4. Divertor Plates
    const divertorGroup = new THREE.Group();
    const divGeoTop = new THREE.TubeGeometry(new DivertorCurve(plasmaCurve, 4.0), 300, 1.0, 8, true);
    const divGeoBot = new THREE.TubeGeometry(new DivertorCurve(plasmaCurve, -4.0), 300, 1.0, 8, true);
    const divMat = new THREE.MeshStandardMaterial({color:0x111111, roughness:1.0, metalness:0.2});
    divertorGroup.add(new THREE.Mesh(divGeoTop, divMat));
    divertorGroup.add(new THREE.Mesh(divGeoBot, divMat));
    reactorGroup.add(divertorGroup);

    // 5. Diagnostic Ports & Lenses
    const diagnosticsGroup = new THREE.Group();
    const lensesGroup = new THREE.Group();
    const numPorts = 40;
    const diagnosticScreens = [];
    for(let i=0; i<numPorts; i++) {
        const angle = (i / numPorts) * Math.PI * 2;
        const axisPos = plasmaCurve.getPoint(i / numPorts);
        const outerPos = new THREE.Vector3(45 * Math.cos(angle), Math.sin(angle * 5) * 10, 45 * Math.sin(angle));
        
        const port = createTruss(outerPos, axisPos, 1.5, 16, localChrome);
        diagnosticsGroup.add(port);
        
        const lensGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 16);
        const lMat = new THREE.MeshStandardMaterial({color:0x00ffff, emissive:0x0044ff, transparent:true, opacity:0.8});
        const lens = new THREE.Mesh(lensGeo, lMat);
        lens.position.copy(outerPos);
        lens.lookAt(axisPos);
        lensesGroup.add(lens);
        diagnosticScreens.push(lens);
    }
    reactorGroup.add(diagnosticsGroup);
    reactorGroup.add(lensesGroup);

    // 6. Power Busbars & Cabling
    const busbarsGroup = new THREE.Group();
    const cablingGroup = new THREE.Group();
    busbarsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new BusbarCurve(38, 5, 8), 200, 0.6, 12, true), localCopper));
    busbarsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new BusbarCurve(38.8, 5, 8.5), 200, 0.6, 12, true), localCopper));
    for(let c=0; c<15; c++) {
        const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(new BusbarCurve(39 + Math.random()*3, 5, 5 + Math.random()*10), 300, 0.15, 6, true), localChrome);
        cablingGroup.add(cableMesh);
    }
    reactorGroup.add(busbarsGroup);
    reactorGroup.add(cablingGroup);

    // 7. Instanced Plasma Particles
    const particlesGroup = new THREE.Group();
    const pCount = 2000;
    const pMat = new THREE.MeshStandardMaterial({ color: 0xff44ff, emissive: 0xff00ff, emissiveIntensity: 4, transparent: true, opacity: 0.8 });
    const particleInstanced = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 8), pMat, pCount);
    const particleData = [];
    for (let i=0; i<pCount; i++) {
        particleData.push({ t: Math.random(), offsetRadius: Math.random() * 3.2, offsetAngle: Math.random() * Math.PI * 2, speed: 0.05 + Math.random() * 0.1 });
    }
    particlesGroup.add(particleInstanced);
    reactorGroup.add(particlesGroup);

    // ==========================================
    // MOBILE CRAWLER BASE (Off-Road Platform)
    // ==========================================
    const crawlerGroup = new THREE.Group();
    group.add(crawlerGroup);

    // Chassis Base
    const chassisGroup = new THREE.Group();
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(45, 6, 110), localDarkSteel);
    frameMesh.position.set(0, -5, 0);
    chassisGroup.add(frameMesh);
    
    // Support Pillars up to the Stellarator
    for(let x of [-18, 18]) {
        for(let z of [-35, 0, 35]) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 30, 16), localSteel);
            pillar.position.set(x, 10, z);
            chassisGroup.add(pillar);
            
            // Cross braces
            const brace = createTruss(new THREE.Vector3(x, -5, z), new THREE.Vector3(0, 20, 0), 1.0, 8, localDarkSteel);
            chassisGroup.add(brace);
        }
    }
    
    // Grilles & Walkways
    const grilleFront = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), new THREE.MeshStandardMaterial({color:0x111111, wireframe:true}));
    grilleFront.position.set(0, -5, 55.1);
    chassisGroup.add(grilleFront);
    
    // Ladder
    const ladderGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 0.5), localSteel);
        step.position.set(-15, -20 + i*2, 50);
        ladderGroup.add(step);
    }
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 30), localSteel);
    rail1.position.set(-16.5, -6, 50);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 30), localSteel);
    rail2.position.set(-13.5, -6, 50);
    ladderGroup.add(rail1); ladderGroup.add(rail2);
    chassisGroup.add(ladderGroup);
    crawlerGroup.add(chassisGroup);

    // Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 5, 45);
    const cabinMesh = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), localSteel);
    cabinGroup.add(cabinMesh);
    
    // Windows
    const winMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), tinted || new THREE.MeshStandardMaterial({color:0x000000, transparent:true, opacity:0.6}));
    winMesh.position.set(0, 1, 6.1);
    cabinGroup.add(winMesh);
    
    // Controls
    const swMesh = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.15, 16, 32), localChrome);
    swMesh.position.set(-4, -2, 4);
    swMesh.rotation.x = -Math.PI/4;
    cabinGroup.add(swMesh);
    
    for(let j of [-1, 1]) {
        const sBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16), localDarkSteel);
        sBase.position.set(4 + j*2, -3, 4);
        cabinGroup.add(sBase);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.5, 8), localChrome);
        stick.position.set(4 + j*2, -1.5, 4);
        stick.rotation.x = Math.PI/8;
        cabinGroup.add(stick);
    }
    
    // Screens
    const screens = [];
    [-4, 4].forEach(x => {
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.5), screenMat);
        sc.position.set(x, 1, 5.9);
        cabinGroup.add(sc);
        screens.push(sc);
    });
    
    // Side Mirrors
    [-1, 1].forEach(m => {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4), localSteel);
        stem.position.set(m*9.5, 1, 3);
        stem.rotation.z = m * Math.PI/4;
        cabinGroup.add(stem);
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3, 2), localChrome);
        mirror.position.set(m*11, 2.5, 3);
        cabinGroup.add(mirror);
    });
    crawlerGroup.add(cabinGroup);

    // Exhaust Stacks & Hydraulics
    const exhaustGroup = new THREE.Group();
    const hydraulicsGroup = new THREE.Group();
    for(let e of [-1, 1]) {
        const exBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20), localDarkSteel);
        exBase.position.set(e*18, 5, -45);
        exhaustGroup.add(exBase);
        const exCurve = new THREE.CatmullRomCurve3([ new THREE.Vector3(e*18, 15, -45), new THREE.Vector3(e*22, 22, -45), new THREE.Vector3(e*22, 28, -48) ]);
        exhaustGroup.add(new THREE.Mesh(new THREE.TubeGeometry(exCurve, 32, 1.8, 16, false), localChrome));
    }
    for(let h=0; h<25; h++) {
        const pts = [new THREE.Vector3((Math.random()-0.5)*40, -10+Math.random()*15, (Math.random()-0.5)*100)];
        for(let p=0; p<4; p++) pts.push(new THREE.Vector3(pts[p].x+(Math.random()-0.5)*15, pts[p].y+(Math.random()-0.5)*8, pts[p].z+(Math.random()-0.5)*25));
        hydraulicsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.3, 8, false), localChrome));
    }
    crawlerGroup.add(exhaustGroup);
    crawlerGroup.add(hydraulicsGroup);

    // Wheels & Suspensions
    const wheelsGroup = new THREE.Group();
    const tires = [];
    for(let i=0; i<8; i++) {
        const x = (i%2 === 0 ? 1 : -1) * 32;
        const z = -45 + Math.floor(i/2) * 30;
        const y = -22;
        
        const wheelObj = new THREE.Group();
        wheelObj.position.set(x, y, z);
        
        // Tire
        const tire = new THREE.Mesh(new THREE.TorusGeometry(8, 3.5, 32, 64), localRubber);
        tire.rotation.y = Math.PI/2;
        const numLugs = 72;
        for(let l=0; l<numLugs; l++) {
            const lA = (l/numLugs)*Math.PI*2;
            const lug = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.5, 2.0), localRubber);
            lug.position.set(0, Math.cos(lA)*10.8, Math.sin(lA)*10.8);
            lug.rotation.x = -lA;
            tire.add(lug);
        }
        
        // Rim & Spokes
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 4, 32), localChrome);
        rim.rotation.x = Math.PI/2;
        for(let s=0; s<10; s++) {
            const spokeGrp = new THREE.Group();
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5.5, 8), localSteel);
            spoke.position.y = 2.75;
            spoke.rotation.z = Math.PI/2;
            spokeGrp.add(spoke);
            spokeGrp.rotation.z = (s/10)*Math.PI*2;
            rim.add(spokeGrp);
        }
        tire.add(rim);
        wheelObj.add(tire);
        tires.push(tire);
        
        // Hydraulic Suspension (Cylinder in Cylinder)
        const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 15, 16), localDarkSteel);
        const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 15, 16), localChrome);
        outerCyl.position.set(x>0 ? -4 : 4, 10, 0);
        innerCyl.position.set(x>0 ? -4 : 4, 2, 0);
        wheelObj.add(outerCyl); wheelObj.add(innerCyl);
        
        wheelsGroup.add(wheelObj);
    }
    crawlerGroup.add(wheelsGroup);

    // ==========================================
    // PARTS DEFINITIONS
    // ==========================================
    parts.push(
        { name: "Central Support Column", group: centralColumnGroup, description: "Massive bucking cylinder absorbing net centering forces.", material: "Steel & Glass", function: "Structural Core", assemblyOrder: 1, connections: ["Radial Struts"], failureEffect: "Catastrophic reactor implosion.", cascadeFailures: ["Coils", "Vacuum Vessel"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:80,z:0} },
        { name: "Radial Struts", group: strutsGroup, description: "Heavy trusses bridging the coils to the central column.", material: "Dark Steel", function: "Load Transfer", assemblyOrder: 2, connections: ["Central Column", "Coils"], failureEffect: "Coil displacement under magnetic load.", cascadeFailures: ["Windings"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:-30,z:0} },
        { name: "Superconducting Coil Casings", group: casingsGroup, description: "Thick U-shaped steel armor encasing the fragile superconductors.", material: "Dark Steel", function: "Protection", assemblyOrder: 3, connections: ["Windings", "Inter-coil Trusses"], failureEffect: "Breach of cryogenic vacuum.", cascadeFailures: ["Cooling Pipes", "Windings"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:50,z:0} },
        { name: "Superconducting Windings", group: windingsGroup, description: "Highly twisted, non-planar magnetic coils creating the rotational transform.", material: "Superconductor", function: "Magnetic Confinement", assemblyOrder: 4, connections: ["Casings", "Power Busbars"], failureEffect: "Loss of magnetic cage, plasma disruption.", cascadeFailures: ["Plasma Core", "Vacuum Vessel"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:100,z:0} },
        { name: "Cryogenic Cooling Pipes", group: coolingGroup, description: "Helical piping wrapping the coils in liquid helium.", material: "Copper", function: "Thermal Regulation", assemblyOrder: 5, connections: ["Casings"], failureEffect: "Quench event in superconductors.", cascadeFailures: ["Windings"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:140,z:0} },
        { name: "Inter-coil Trusses", group: interCoilGroup, description: "Lattice structure preventing coil-to-coil attraction forces.", material: "Steel", function: "Stabilization", assemblyOrder: 6, connections: ["Casings"], failureEffect: "Coils warp and touch.", cascadeFailures: ["Windings"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:60,z:0} },
        { name: "Vacuum Vessel (Outer)", group: vesselOuterGroup, description: "Main atmospheric barrier, styled as a semi-transparent hull.", material: "Tinted Glass/Steel", function: "Vacuum Maintenance", assemblyOrder: 7, connections: ["Diagnostic Ports"], failureEffect: "Atmospheric ingress.", cascadeFailures: ["Plasma Core"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:25,z:0} },
        { name: "Vacuum Vessel (Grid)", group: vesselWireGroup, description: "Structural geodesic reinforcement for the vessel.", material: "Steel", function: "Reinforcement", assemblyOrder: 8, connections: ["Vacuum Vessel (Outer)"], failureEffect: "Hull buckling.", cascadeFailures: ["Vacuum Vessel (Outer)"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:25,z:0} },
        { name: "Divertor Plates", group: divertorGroup, description: "Twisted ribbons extracting heat and ash from the plasma edge.", material: "Tungsten/Carbon", function: "Exhaust", assemblyOrder: 9, connections: ["Vacuum Vessel (Outer)"], failureEffect: "Plasma scorches the vessel walls.", cascadeFailures: ["Vacuum Vessel (Outer)"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:-10,z:0} },
        { name: "Diagnostic Ports", group: diagnosticsGroup, description: "Radially aligned observation tubes for laser interferometry.", material: "Chrome", function: "Measurement", assemblyOrder: 10, connections: ["Vacuum Vessel (Outer)", "Lenses"], failureEffect: "Loss of telemetry.", cascadeFailures: [], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:40,z:0} },
        { name: "Diagnostic Lenses", group: lensesGroup, description: "Sapphire windows sealing the ports.", material: "Glowing Glass", function: "Observation", assemblyOrder: 11, connections: ["Diagnostic Ports"], failureEffect: "Vacuum leak.", cascadeFailures: ["Plasma Core"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:60,z:0} },
        { name: "Power Busbars", group: busbarsGroup, description: "Thick cables delivering massive amperage to the coils.", material: "Copper", function: "Power Delivery", assemblyOrder: 12, connections: ["Windings"], failureEffect: "Power fluctuation.", cascadeFailures: ["Windings"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:160,z:0} },
        { name: "Instrumentation Cabling", group: cablingGroup, description: "Sensory wiring woven around the exterior.", material: "Chrome", function: "Data Transfer", assemblyOrder: 13, connections: ["Diagnostics"], failureEffect: "Sensor blindness.", cascadeFailures: [], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:120,z:0} },
        { name: "Plasma Core", group: plasmaCoreGroup, description: "The ultra-hot fusion reacting plasma, following a complex 3D twisted axis.", material: "Plasma Energy", function: "Fusion", assemblyOrder: 14, connections: [], failureEffect: "Disruption and cooling.", cascadeFailures: [], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:25,z:0} },
        { name: "Plasma Flux Surfaces", group: plasmaOuterGroup, description: "Magnetic flux layers forming the containment cage.", material: "Energy Field", function: "Confinement", assemblyOrder: 15, connections: ["Plasma Core"], failureEffect: "Edge localized modes.", cascadeFailures: ["Divertor Plates"], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:25,z:0} },
        { name: "Plasma Particles", group: particlesGroup, description: "Superheated ions flowing along the magnetic axis.", material: "Ions", function: "Reactions", assemblyOrder: 16, connections: ["Plasma Core"], failureEffect: "Turbulence.", cascadeFailures: [], originalPosition: {x:0,y:25,z:0}, explodedPosition: {x:0,y:25,z:0} },
        { name: "Crawler Chassis", group: chassisGroup, description: "Gargantuan off-road mobile platform supporting the entire fusion reactor.", material: "Dark Steel", function: "Transport", assemblyOrder: 17, connections: ["Wheels", "Reactor Base"], failureEffect: "Immobilization.", cascadeFailures: ["Suspension"], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:-80,z:0} },
        { name: "Operator Cabin", group: cabinGroup, description: "Command center with tinted glass, joysticks, and glowing control panels.", material: "Steel/Glass", function: "Control", assemblyOrder: 18, connections: ["Crawler Chassis"], failureEffect: "Loss of vehicle control.", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:0,z:40} },
        { name: "Exhaust & Hydraulics", group: exhaustGroup, description: "Massive diesel stacks and complex hydraulic lines powering the crawler.", material: "Chrome", function: "Secondary Power", assemblyOrder: 19, connections: ["Crawler Chassis"], failureEffect: "Pressure loss.", cascadeFailures: ["Suspension"], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:-40,z:-40} },
        { name: "Wheels & Suspension", group: wheelsGroup, description: "8 huge Torus geometry tires with aggressive Box geometry lugs and hydraulic pistons.", material: "Rubber/Chrome", function: "Mobility", assemblyOrder: 20, connections: ["Crawler Chassis"], failureEffect: "Stranding of the mobile reactor.", cascadeFailures: [], originalPosition: {x:0,y:0,z:0}, explodedPosition: {x:0,y:-120,z:0} }
    );

    const description = "The Mobile Stellarator Unit is an impossibly massive, hyper-complex fusion reactor mounted atop an all-terrain crawler chassis. It features intensely twisted, non-planar magnetic coils generating a true 3D magnetic confinement field, surrounded by thousands of structural struts, cryogenic cooling pipes, and hydraulic systems. The crawler boasts aggressive lugged tires, detailed operator cabins with joysticks and glowing screens, and massive exhaust stacks.";

    const quizQuestions = [
        {
            question: "What is the primary function of the highly twisted, non-planar Toroidal Field Coils in a stellarator?",
            options: ["To generate a rotational transform in the magnetic field entirely via external coils.", "To induce a strong toroidal plasma current to heat the fuel.", "To create a purely vertical magnetic field for stability.", "To compress the plasma into a perfect sphere."],
            correctAnswer: 0,
            explanation: "Unlike a tokamak which relies on internal plasma currents, a stellarator uses highly complex, twisted external coils to create the entire twisting magnetic cage (rotational transform) required for plasma confinement."
        },
        {
            question: "Why does the crawler chassis utilize immense hydraulic suspension cylinders (cylinder-within-cylinder)?",
            options: ["To actively level the fragile stellarator reactor over rough terrain.", "To inject fuel into the plasma core.", "To rotate the tires at high speeds.", "To compress the cryogenic cooling fluid."],
            correctAnswer: 0,
            explanation: "The extremely delicate magnetic alignment of a stellarator requires absolute stability; the hydraulic pistons constantly adjust to keep the massive reactor perfectly level while traversing off-road environments."
        },
        {
            question: "What is the purpose of the Divertor Plates winding along the top and bottom of the plasma?",
            options: ["To extract heat and helium ash from the edges of the plasma.", "To generate electrical power directly from the magnetic field.", "To hold the vacuum vessel together.", "To act as the primary steering mechanism for the crawler."],
            correctAnswer: 0,
            explanation: "Divertors intersect the outermost magnetic flux surfaces to safely channel away exhaust heat and fusion byproducts (ash) without contaminating the core plasma."
        },
        {
            question: "How do the off-road tires achieve traction for such a massive superstructure?",
            options: ["Using hundreds of extruded BoxGeometry lugs arrayed around the circumference of a TorusGeometry tire.", "By hovering using magnetic levitation.", "Using a continuous smooth rubber track.", "By drilling into the bedrock at every step."],
            correctAnswer: 0,
            explanation: "The physical design utilizes a massive Torus geometry adorned with deeply extruded Box geometries acting as aggressive off-road lugs to grip the earth under immense weight."
        },
        {
            question: "What prevents the non-planar superconducting coils from warping under extreme magnetic forces?",
            options: ["A massive Central Support Column (bucking cylinder) and an intricate web of Inter-coil Trusses.", "The plasma's internal gravity.", "They are made of flexible rubber.", "The exhaust stacks blow cooling air onto them."],
            correctAnswer: 0,
            explanation: "Magnetic forces push the coils violently toward the center and against each other. The central bucking cylinder absorbs the net inward force, while the inter-coil trusses stabilize the complex twisted shapes."
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse plasma
        const pulse = Math.sin(time * 2) * 0.5 + 0.5;
        plasmaCoreMat.emissiveIntensity = 2.0 + pulse * 1.5;
        plasmaOuterMat.opacity = 0.2 + pulse * 0.15;

        // Flowing particles
        const dt = 0.01 * speed;
        const dummy = new THREE.Object3D();
        for(let i=0; i<particleData.length; i++) {
            const pd = particleData[i];
            pd.t += pd.speed * dt;
            if (pd.t > 1) pd.t -= 1;
            
            const pt = plasmaCurve.getPoint(pd.t);
            const tangent = plasmaCurve.getTangent(pd.t);
            const up = new THREE.Vector3(0,1,0);
            let normal = new THREE.Vector3().crossVectors(tangent, up);
            if(normal.lengthSq() < 0.001) normal = new THREE.Vector3(1,0,0).crossVectors(tangent, new THREE.Vector3(1,0,0));
            normal.normalize();
            let binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
            
            const offset = new THREE.Vector3()
                .addScaledVector(normal, Math.cos(pd.offsetAngle) * pd.offsetRadius)
                .addScaledVector(binormal, Math.sin(pd.offsetAngle) * pd.offsetRadius);
                
            dummy.position.copy(pt).add(offset);
            dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), tangent);
            dummy.scale.set(1, 4, 1);
            dummy.updateMatrix();
            particleInstanced.setMatrixAt(i, dummy.matrix);
        }
        particleInstanced.instanceMatrix.needsUpdate = true;

        // Diagnostic screens & lenses
        diagnosticScreens.forEach((sc, idx) => {
            if(sc.material && sc.material.emissiveIntensity !== undefined) {
                sc.material.emissiveIntensity = 0.5 + Math.max(0, Math.sin(time * 8 + idx) * 1.5);
            }
        });
        screens.forEach((sc, idx) => {
            sc.material.emissiveIntensity = 1.0 + Math.sin(time * 15 + idx) * 0.5;
        });

        // Drive tires
        if (speed > 0 || speed < 0) {
            tires.forEach(tire => {
                tire.rotation.z -= 0.02 * speed;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStellarator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
