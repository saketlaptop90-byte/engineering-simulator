import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * Ultra God Tier Antimatter Catalyzed Jet Turbine
 * Mounted on a Hyper-Realistic Mobile Test Crawler
 * 
 * Features: Thousands of blades, magnetic containment, relativistic plasma,
 * highly detailed off-road tires, hydraulic actuators, operator cabin, and glowing UI.
 */
export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ====================================================================================
    // CUSTOM HIGH-TECH MATERIALS
    // ====================================================================================
    const antimatterCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xaa00ff,
        emissiveIntensity: 12,
        transparent: true,
        opacity: 0.95,
        wireframe: false,
    });

    const plasmaPlumeMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const magneticCoilMat = copper.clone();
    magneticCoilMat.roughness = 0.2;
    magneticCoilMat.metalness = 1.0;

    const thermalShieldMat = darkSteel.clone();
    thermalShieldMat.roughness = 0.9;
    thermalShieldMat.metalness = 0.4;

    const highTempAlloy = chrome.clone();
    highTempAlloy.color.setHex(0x222222);
    highTempAlloy.roughness = 0.3;
    highTempAlloy.metalness = 0.9;
    
    const neonScreenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2
    });

    const hazardMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.5,
        metalness: 0.1
    });

    // ====================================================================================
    // HELPER FUNCTIONS FOR PROCEDURAL GEOMETRY
    // ====================================================================================
    function createBladeShape(twistAngle, width, length, rootWidth) {
        const shape = new THREE.Shape();
        shape.moveTo(-rootWidth / 2, 0);
        shape.lineTo(rootWidth / 2, 0);
        shape.bezierCurveTo(rootWidth * 0.8, length * 0.3, width * 0.6, length * 0.6, width * 0.4, length);
        shape.lineTo(-width * 0.4, length);
        shape.bezierCurveTo(-width * 0.6, length * 0.6, -rootWidth * 0.8, length * 0.3, -rootWidth / 2, 0);
        return shape;
    }

    function createTurbineStage(numBlades, radius, bladeLength, twist, material, zPos) {
        const stageGroup = new THREE.Group();
        
        // Complex Hub
        const hubProfile = [];
        for(let i=0; i<=10; i++) {
            const t = i/10;
            hubProfile.push(new THREE.Vector2(radius * 0.8 + Math.sin(t*Math.PI)*0.05, (t - 0.5) * 0.4));
        }
        const hubGeo = new THREE.LatheGeometry(hubProfile, 64);
        const hub = new THREE.Mesh(hubGeo, material);
        hub.rotation.x = Math.PI / 2;
        stageGroup.add(hub);

        // Extruded Blades
        const bladeShape = createBladeShape(twist, 0.15, bladeLength, 0.2);
        const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.005, bevelThickness: 0.005 };
        const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
        bladeGeo.translate(0, 0, -0.01);

        for (let i = 0; i < numBlades; i++) {
            const angle = (i / numBlades) * Math.PI * 2;
            const blade = new THREE.Mesh(bladeGeo, material);
            blade.position.set(Math.cos(angle) * radius * 0.75, Math.sin(angle) * radius * 0.75, 0);
            blade.rotation.z = angle - Math.PI / 2;
            blade.rotation.x = twist;
            
            // Add microscopic root details
            const rootDetail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.1), darkSteel);
            rootDetail.position.set(Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius * 0.78, 0);
            rootDetail.rotation.z = angle;
            stageGroup.add(rootDetail);

            stageGroup.add(blade);
        }
        stageGroup.position.z = zPos;
        return stageGroup;
    }

    function createHydraulicPiston(length, radius) {
        const group = new THREE.Group();
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
        cylinder.position.y = length * 0.3;
        group.add(cylinder);

        const rodGeo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, length * 0.6, 16);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = length * 0.7;
        group.add(rod);

        const jointGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const baseJoint = new THREE.Mesh(jointGeo, steel);
        const topJoint = new THREE.Mesh(jointGeo, steel);
        topJoint.position.y = length;
        group.add(baseJoint);
        group.add(topJoint);

        return { group, rod, cylinder };
    }

    // ====================================================================================
    // PART 1: THE ANTIMATTER ENGINE CORE & TURBOMACHINERY
    // ====================================================================================
    const engineGroup = new THREE.Group();
    engineGroup.position.y = 8; // Mounted high on the chassis

    // 1. Intake Nose Cone
    const noseConeGroup = new THREE.Group();
    const noseConeGeo = new THREE.ConeGeometry(0.8, 2.5, 64);
    const noseCone = new THREE.Mesh(noseConeGeo, chrome);
    noseCone.rotation.x = Math.PI / 2;
    noseCone.position.z = 7.25;
    noseConeGroup.add(noseCone);
    
    // Intake Spirals (Hypersonic flow directors)
    const spiralGeo = new THREE.TorusGeometry(0.02, 0.015, 8, 100, Math.PI * 2);
    for(let i = 0; i < 80; i++) {
        const s = new THREE.Mesh(spiralGeo, darkSteel);
        const progress = i / 80;
        const r = 0.8 * (1 - progress);
        s.scale.set(r * 50, r * 50, 1);
        s.position.z = 6.0 + progress * 2.5;
        s.rotation.x = Math.PI / 2;
        noseConeGroup.add(s);
    }
    engineGroup.add(noseConeGroup);
    meshes.noseConeGroup = noseConeGroup;

    // 2. Low Pressure Compressor (LPC) - 6 Stages
    const lpCompressor = new THREE.Group();
    for(let i = 0; i < 6; i++) {
        const stage = createTurbineStage(72, 2.0, 0.8, Math.PI/5 - (i*0.04), aluminum, 5.5 - i*0.4);
        lpCompressor.add(stage);
    }
    engineGroup.add(lpCompressor);
    meshes.lpCompressor = lpCompressor;

    // 3. High Pressure Compressor (HPC) - 9 Stages
    const hpCompressor = new THREE.Group();
    for(let i = 0; i < 9; i++) {
        const stage = createTurbineStage(96, 1.6, 0.5, Math.PI/4 - (i*0.03), highTempAlloy, 2.8 - i*0.25);
        hpCompressor.add(stage);
    }
    engineGroup.add(hpCompressor);
    meshes.hpCompressor = hpCompressor;

    // 4. Antimatter Containment Ring
    const containmentGroup = new THREE.Group();
    const containmentTorus = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.4, 64, 128), steel);
    containmentGroup.add(containmentTorus);
    
    const numCoils = 120;
    for(let i = 0; i < numCoils; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 16, 32), magneticCoilMat);
        const angle = (i / numCoils) * Math.PI * 2;
        coil.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
        coil.rotation.x = Math.PI / 2;
        coil.rotation.y = angle;
        containmentGroup.add(coil);
    }
    engineGroup.add(containmentGroup);
    meshes.containmentGroup = containmentGroup;

    // 5. Annihilation Core
    const chamberGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeo, antimatterCoreMat);
    coreMesh.scale.z = 2.5; 
    coreMesh.position.z = -1.5;
    chamberGroup.add(coreMesh);
    
    const burstGroup = new THREE.Group();
    for(let i = 0; i < 200; i++) {
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8), 
            new THREE.MeshStandardMaterial({color: 0xe0aaff, emissive: 0xffffff, emissiveIntensity: 10})
        );
        p.position.set((Math.random()-0.5)*1.8, (Math.random()-0.5)*1.8, -1.5 + (Math.random()-0.5)*3);
        burstGroup.add(p);
    }
    chamberGroup.add(burstGroup);
    
    const shieldGeo = new THREE.CylinderGeometry(1.8, 1.8, 4, 64, 1, true);
    const shieldMesh = new THREE.Mesh(shieldGeo, thermalShieldMat);
    shieldMesh.rotation.x = Math.PI/2;
    shieldMesh.position.z = -1.5;
    chamberGroup.add(shieldMesh);
    
    engineGroup.add(chamberGroup);
    meshes.coreMesh = coreMesh;
    meshes.burstGroup = burstGroup;

    // 6. High Pressure Turbine (HPT) - 4 Stages
    const hpTurbine = new THREE.Group();
    for(let i = 0; i < 4; i++) {
        const stage = createTurbineStage(108, 1.7, 0.6, -Math.PI/4 + (i*0.05), highTempAlloy, -4.0 - i*0.35);
        hpTurbine.add(stage);
    }
    engineGroup.add(hpTurbine);
    meshes.hpTurbine = hpTurbine;

    // 7. Low Pressure Turbine (LPT) - 5 Stages
    const lpTurbine = new THREE.Group();
    for(let i = 0; i < 5; i++) {
        const stage = createTurbineStage(84, 2.1, 0.9, -Math.PI/5 + (i*0.05), aluminum, -5.6 - i*0.45);
        lpTurbine.add(stage);
    }
    engineGroup.add(lpTurbine);
    meshes.lpTurbine = lpTurbine;

    // 8. Main Casing (Lathe)
    const casingPoints = [
        new THREE.Vector2(2.1, 6.0),
        new THREE.Vector2(2.5, 4.0),
        new THREE.Vector2(2.4, 1.0),
        new THREE.Vector2(2.6, 0.0), // containment bulge
        new THREE.Vector2(2.4, -2.0),
        new THREE.Vector2(2.3, -5.0),
        new THREE.Vector2(2.5, -8.0),
        new THREE.Vector2(2.0, -9.0)
    ];
    const casingGeo = new THREE.LatheGeometry(casingPoints, 128);
    const casing = new THREE.Mesh(casingGeo, steel);
    casing.rotation.x = -Math.PI / 2;
    
    // Outer Casing Ribs and Piping
    const casingGroup = new THREE.Group();
    casingGroup.add(casing);
    
    for(let i = 0; i < 48; i++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 15, 0.3), darkSteel);
        const angle = (i / 48) * Math.PI * 2;
        rib.position.set(Math.cos(angle)*2.45, Math.sin(angle)*2.45, -1.5);
        rib.rotation.z = angle;
        casingGroup.add(rib);
    }

    // Advanced feed lines on casing
    class FeedLineCurve extends THREE.Curve {
        constructor(angle) { super(); this.angle = angle; }
        getPoint(t, opt = new THREE.Vector3()) {
            const z = 5 - t * 14; 
            const r = 2.6 + Math.sin(t * Math.PI * 8) * 0.15;
            const x = Math.cos(this.angle + t*Math.PI) * r;
            const y = Math.sin(this.angle + t*Math.PI) * r;
            return opt.set(x, y, z);
        }
    }
    for(let i = 0; i < 12; i++) {
        const path = new FeedLineCurve((i/12)*Math.PI*2);
        const tubeGeo = new THREE.TubeGeometry(path, 150, 0.08, 12, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        casingGroup.add(tube);
    }

    engineGroup.add(casingGroup);

    // 9. Relativistic Thrust Vectoring Nozzle
    const nozzleGroup = new THREE.Group();
    const nozzleBase = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 1.8, 2.0, 64, 1, true), darkSteel);
    nozzleBase.rotation.x = Math.PI/2;
    nozzleBase.position.z = -8.5;
    nozzleGroup.add(nozzleBase);

    const numPetals = 36;
    const petalsGroup = new THREE.Group();
    petalsGroup.position.z = -9.5;
    const pistons = [];
    
    for(let i = 0; i < numPetals; i++) {
        const petalGeo = new THREE.BoxGeometry(0.4, 0.08, 2.5);
        petalGeo.translate(0, 0, -1.25);
        const petal = new THREE.Mesh(petalGeo, highTempAlloy);
        const angle = (i / numPetals) * Math.PI * 2;
        petal.position.set(Math.cos(angle)*1.7, Math.sin(angle)*1.7, 0);
        petal.rotation.z = angle;
        petalsGroup.add(petal);

        // Add hydraulic actuator for each petal
        const piston = createHydraulicPiston(1.0, 0.05);
        piston.group.position.set(Math.cos(angle)*2.0, Math.sin(angle)*2.0, 0.5);
        piston.group.rotation.z = angle;
        piston.group.rotation.x = -Math.PI/2;
        nozzleGroup.add(piston.group);
        pistons.push({petal, piston});
    }
    nozzleGroup.add(petalsGroup);
    engineGroup.add(nozzleGroup);
    meshes.petalsGroup = petalsGroup;
    meshes.pistons = pistons;

    // 10. Plasma Plume
    const plumeGroup = new THREE.Group();
    for(let i = 0; i < 8; i++) {
        const plume = new THREE.Mesh(new THREE.ConeGeometry(1.2 - i*0.1, 6 + i*3, 64), plasmaPlumeMat);
        plume.rotation.x = -Math.PI/2;
        plume.position.z = -10.0 - (6 + i*3)/2;
        plumeGroup.add(plume);
    }
    engineGroup.add(plumeGroup);
    meshes.plumeGroup = plumeGroup;

    group.add(engineGroup);

    // ====================================================================================
    // PART 2: MOBILE TEST PLATFORM CHASSIS
    // ====================================================================================
    const chassisGroup = new THREE.Group();
    
    // Main Chassis Body
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-4, -12);
    chassisShape.lineTo(4, -12);
    chassisShape.lineTo(4, 10);
    chassisShape.lineTo(-4, 10);
    chassisShape.lineTo(-4, -12);
    
    const chassisExtrude = { depth: 2, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 4 };
    const chassisBase = new THREE.Mesh(new THREE.ExtrudeGeometry(chassisShape, chassisExtrude), darkSteel);
    chassisBase.rotation.x = Math.PI/2;
    chassisBase.position.set(0, 3, 10);
    chassisGroup.add(chassisBase);

    // Engine Mounting Struts
    for(let i of [-1, 1]) {
        for(let z of [4, 0, -4]) {
            const strutGeo = new THREE.CylinderGeometry(0.3, 0.4, 5, 32);
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(i * 2.5, 5.5, z);
            strut.rotation.z = i * -Math.PI/8;
            chassisGroup.add(strut);
            
            // Mounting Brackets
            const bracket = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), darkSteel);
            bracket.position.set(i * 2.1, 7.8, z);
            chassisGroup.add(bracket);
        }
    }

    // Exhaust Stacks (Generators)
    for(let i of [-1, 1]) {
        const stackGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
        const stack = new THREE.Mesh(stackGeo, chrome);
        stack.position.set(i * 3.5, 5, 8);
        chassisGroup.add(stack);
        
        // Stack flapper
        const flapper = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32), darkSteel);
        flapper.position.set(i * 3.5, 7, 8);
        flapper.rotation.x = Math.PI/4;
        chassisGroup.add(flapper);
    }

    // ====================================================================================
    // PART 3: HEAVY OFF-ROAD TIRES & SUSPENSION
    // ====================================================================================
    function createComplexTire() {
        const tireGroup = new THREE.Group();
        
        // Main rubber torus
        const torusGeo = new THREE.TorusGeometry(2.0, 0.8, 64, 128);
        const torus = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(torus);
        
        // Aggressive BoxGeometry Lugs
        const numLugs = 180;
        const lugGeo = new THREE.BoxGeometry(1.0, 0.3, 0.6);
        for(let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, 0);
            lug.rotation.z = angle;
            
            // Stagger lugs
            if(i % 3 === 0) lug.position.z = 0.4;
            else if(i % 3 === 1) lug.position.z = -0.4;
            else lug.position.z = 0;
            
            tireGroup.add(lug);
        }

        // Complex Rim (Cylinder with spoke arrays)
        const rimGeo = new THREE.CylinderGeometry(1.4, 1.4, 1.2, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI/2;
        tireGroup.add(rim);

        // Spokes
        for(let i = 0; i < 24; i++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16), darkSteel);
            const angle = (i / 24) * Math.PI * 2;
            spoke.position.set(Math.cos(angle)*0.7, Math.sin(angle)*0.7, 0);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI/2;
            tireGroup.add(spoke);
        }

        // Hubcap
        const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 32), hazardMat);
        hubCap.rotation.x = Math.PI/2;
        tireGroup.add(hubCap);

        return tireGroup;
    }

    const wheelPositions = [
        {x: -5, z: 8}, {x: 5, z: 8},
        {x: -5, z: 2}, {x: 5, z: 2},
        {x: -5, z: -4}, {x: 5, z: -4},
        {x: -5, z: -10}, {x: 5, z: -10}
    ];

    meshes.wheels = [];
    for(let pos of wheelPositions) {
        // Suspension linkage
        const suspension = new THREE.Group();
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.4), darkSteel);
        arm1.position.set(Math.sign(pos.x)*1, 0, 0);
        suspension.add(arm1);
        
        const shock = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), chrome);
        shock.position.set(Math.sign(pos.x)*1.5, 1, 0);
        suspension.add(shock);
        
        const wheel = createComplexTire();
        wheel.position.set(Math.sign(pos.x)*2, 0, 0);
        wheel.rotation.y = Math.PI/2;
        suspension.add(wheel);
        
        suspension.position.set(Math.sign(pos.x)*3, 2, pos.z);
        chassisGroup.add(suspension);
        meshes.wheels.push(wheel);
    }

    // ====================================================================================
    // PART 4: OPERATOR CABIN & CONTROLS
    // ====================================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 5, 12);

    // Cabin Shell
    const shellShape = new THREE.Shape();
    shellShape.moveTo(-2, 0);
    shellShape.lineTo(2, 0);
    shellShape.lineTo(2, 3);
    shellShape.lineTo(1.5, 4);
    shellShape.lineTo(-1.5, 4);
    shellShape.lineTo(-2, 3);
    const shellExtrude = { depth: 3, bevelEnabled: true };
    const cabinShell = new THREE.Mesh(new THREE.ExtrudeGeometry(shellShape, shellExtrude), hazardMat);
    cabinShell.position.z = -1.5;
    cabinGroup.add(cabinShell);

    // Tinted Glass Windows
    const winGeo = new THREE.BoxGeometry(3.6, 2.5, 3.2);
    const windowMesh = new THREE.Mesh(winGeo, tinted);
    windowMesh.position.set(0, 2, 0);
    cabinGroup.add(windowMesh);

    // Interior Controls
    // Steering Wheel
    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 16, 32), plastic);
    steeringWheel.position.set(0.8, 1.5, 0.5);
    steeringWheel.rotation.x = -Math.PI/4;
    cabinGroup.add(steeringWheel);

    // Dual Joysticks (for thrust vectoring)
    for(let i of [-1, 1]) {
        const stickBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), darkSteel);
        stickBase.position.set(-0.8 + i*0.4, 1.2, 0.5);
        cabinGroup.add(stickBase);
        
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6), chrome);
        stick.position.set(-0.8 + i*0.4, 1.5, 0.5);
        stick.rotation.x = -Math.PI/8;
        cabinGroup.add(stick);
    }

    // Glowing Control Panels
    const mainScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), neonScreenMat);
    mainScreen.position.set(0, 2.0, 1.2);
    mainScreen.rotation.y = Math.PI;
    cabinGroup.add(mainScreen);

    const sideScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), neonScreenMat);
    sideScreen.position.set(-1.2, 1.8, 0.8);
    sideScreen.rotation.y = Math.PI/4;
    cabinGroup.add(sideScreen);

    // Side Mirrors
    for(let i of [-1, 1]) {
        const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), darkSteel);
        mirrorArm.position.set(i*2.2, 2.5, 0.5);
        mirrorArm.rotation.z = i*Math.PI/2;
        cabinGroup.add(mirrorArm);
        
        const mirrorBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.3), chrome);
        mirrorBox.position.set(i*2.6, 2.5, 0.5);
        cabinGroup.add(mirrorBox);
    }

    // Protective Grille
    const grilleGeo = new THREE.BoxGeometry(4.2, 1.5, 0.1);
    const grille = new THREE.Mesh(grilleGeo, darkSteel);
    grille.position.set(0, 1.0, 1.6);
    
    // Add bars to grille
    for(let i = -1.8; i <= 1.8; i += 0.2) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5), steel);
        bar.position.set(i, 0, 0.1);
        grille.add(bar);
    }
    cabinGroup.add(grille);

    // Access Ladder
    const ladderGroup = new THREE.Group();
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8), darkSteel);
    rail1.position.set(-0.4, -2, 0);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8), darkSteel);
    rail2.position.set(0.4, -2, 0);
    ladderGroup.add(rail1);
    ladderGroup.add(rail2);
    
    for(let i = 0; i < 15; i++) {
        const step = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), steel);
        step.position.set(0, -5.5 + i*0.5, 0);
        step.rotation.z = Math.PI/2;
        ladderGroup.add(step);
    }
    ladderGroup.position.set(-2.2, -1, 1.0);
    cabinGroup.add(ladderGroup);

    chassisGroup.add(cabinGroup);
    group.add(chassisGroup);

    // ====================================================================================
    // PARTS METADATA (15+ Items for Interactive Highlighting)
    // ====================================================================================
    parts.push({
        name: "Antimatter Containment Ring",
        description: "100-Tesla YBCO Superconducting torus containing the antihydrogen plasma. Critical failure results in multi-megaton annihilation.",
        material: "Superconducting Copper Matrix",
        function: "Magnetically isolates antimatter from physical engine walls.",
        assemblyOrder: 1,
        connections: ["Cryo-Coolers", "Annihilation Core"],
        failureEffect: "Total vaporisation of the engine, chassis, and surrounding facility.",
        cascadeFailures: ["Core Detonation"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    parts.push({
        name: "Annihilation Core",
        description: "Energy convergence zone where matter/antimatter annihilate to produce intense gamma rays, ionizing and heating the compressed air to relativistic plasma.",
        material: "Emissive Plasma Field",
        function: "Primary thermal power generation.",
        assemblyOrder: 2,
        connections: ["Containment Ring", "HPT"],
        failureEffect: "Loss of thermal energy, engine flameout.",
        cascadeFailures: ["Thrust Loss", "Turbine Spool-Down"],
        originalPosition: { x: 0, y: 8, z: -1.5 },
        explodedPosition: { x: 0, y: 8, z: 5 }
    });

    parts.push({
        name: "High Pressure Compressor (HPC)",
        description: "9 stages of high-temp alloy blades spinning at 45,000 RPM, achieving a 300:1 pressure ratio.",
        material: "Chrome Alloy",
        function: "Hyper-compresses atmospheric air before core injection.",
        assemblyOrder: 3,
        connections: ["LPC", "Annihilation Core"],
        failureEffect: "Compressor surge, blade shattering.",
        cascadeFailures: ["Core Starvation", "Casing Breach"],
        originalPosition: { x: 0, y: 8, z: 2.8 },
        explodedPosition: { x: -8, y: 8, z: 2.8 }
    });

    parts.push({
        name: "High Pressure Turbine (HPT)",
        description: "4 stages of magnetically shielded, actively cooled single-crystal blades extracting energy from the relativistic plasma.",
        material: "Single-Crystal Chrome",
        function: "Drives the HPC via the inner shaft.",
        assemblyOrder: 4,
        connections: ["Annihilation Core", "LPT"],
        failureEffect: "Blade melt due to cooling failure.",
        cascadeFailures: ["Shaft Seizure", "HPC Stall"],
        originalPosition: { x: 0, y: 8, z: -4.0 },
        explodedPosition: { x: 8, y: 8, z: -4.0 }
    });

    parts.push({
        name: "Thrust Vectoring Nozzle",
        description: "36 articulated petals managed by extreme-pressure hydraulic pistons. Controls the relativistic exhaust plume.",
        material: "Heat Resistant Ceramics / Chrome",
        function: "Directs thrust and maintains shock diamond stability.",
        assemblyOrder: 5,
        connections: ["LPT", "Hydraulics"],
        failureEffect: "Asymmetric thrust, loss of directional control.",
        cascadeFailures: ["Vehicle Spin-out"],
        originalPosition: { x: 0, y: 8, z: -8.5 },
        explodedPosition: { x: 0, y: 8, z: -15 }
    });

    parts.push({
        name: "Off-Road Heavy Tires",
        description: "Massive rubber toroids with 180 extruded aggressive lugs per tire, designed to bear the 500-ton weight of the test platform.",
        material: "Reinforced Vulcanized Rubber",
        function: "Platform mobility and vibration dampening.",
        assemblyOrder: 6,
        connections: ["Suspension Linkage", "Rims"],
        failureEffect: "Tire blowout under extreme load.",
        cascadeFailures: ["Platform Tilt", "Containment Field Fluctuation"],
        originalPosition: { x: 5, y: 2, z: 8 },
        explodedPosition: { x: 12, y: 2, z: 12 }
    });

    parts.push({
        name: "Operator Cabin Shell",
        description: "Armored control center with hazard plating, tinted glass, and an independent life-support system.",
        material: "Hazard-Painted Steel / Tinted Glass",
        function: "Houses test engineers and controls.",
        assemblyOrder: 7,
        connections: ["Chassis Base", "Control Systems"],
        failureEffect: "Cabin decompression or radiation leak.",
        cascadeFailures: ["Crew Incapacitation"],
        originalPosition: { x: 0, y: 5, z: 12 },
        explodedPosition: { x: 0, y: 12, z: 18 }
    });

    parts.push({
        name: "Glowing Neon Control Panels",
        description: "Advanced holographic UI panels providing real-time telemetry on antimatter flow rates, magnetic field strength, and plasma temperatures.",
        material: "Emissive Screen Display",
        function: "System monitoring and fly-by-wire control.",
        assemblyOrder: 8,
        connections: ["Cabin Shell"],
        failureEffect: "Loss of telemetry.",
        cascadeFailures: ["Blind Operation", "System Overload"],
        originalPosition: { x: 0, y: 7, z: 13.2 },
        explodedPosition: { x: 0, y: 10, z: 15 }
    });

    parts.push({
        name: "Dual Vectoring Joysticks",
        description: "Fly-by-wire input devices controlling the 36 hydraulic pistons on the exhaust nozzle.",
        material: "Chrome / Steel",
        function: "Manual thrust vectoring override.",
        assemblyOrder: 9,
        connections: ["Control Panels", "Hydraulic Relays"],
        failureEffect: "Input delay or deadzone.",
        cascadeFailures: ["Loss of Vehicle Control"],
        originalPosition: { x: -0.4, y: 6.5, z: 12.5 },
        explodedPosition: { x: -2, y: 8, z: 14 }
    });

    parts.push({
        name: "Hypersonic Intake Spirals",
        description: "Micro-grooved spirals on the nose cone manipulating boundary layers at Mach 15+ speeds.",
        material: "Dark Steel",
        function: "Pre-conditions shockwaves before they hit the LPC.",
        assemblyOrder: 10,
        connections: ["Nose Cone", "LPC"],
        failureEffect: "Shockwave ingestion.",
        cascadeFailures: ["Engine Surge", "Flameout"],
        originalPosition: { x: 0, y: 8, z: 6.5 },
        explodedPosition: { x: 0, y: 8, z: 12 }
    });

    parts.push({
        name: "Cryo-Hydraulic Feed Lines",
        description: "Intricate lattice of copper and steel tubing delivering liquid helium and high-pressure hydraulic fluid across the engine casing.",
        material: "Copper",
        function: "Cooling and mechanical actuation power.",
        assemblyOrder: 11,
        connections: ["Casing", "Pistons"],
        failureEffect: "Fluid leak.",
        cascadeFailures: ["Piston Lock", "Thermal Overload"],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 12, z: -5 }
    });

    parts.push({
        name: "Protective Front Grille",
        description: "Thick steel bars protecting the lower cabin area from debris kicked up by the massive tires.",
        material: "Dark Steel",
        function: "Debris deflection.",
        assemblyOrder: 12,
        connections: ["Cabin Shell"],
        failureEffect: "Grille denting.",
        cascadeFailures: ["Windshield Damage"],
        originalPosition: { x: 0, y: 6, z: 13.6 },
        explodedPosition: { x: 0, y: 2, z: 16 }
    });

    parts.push({
        name: "Access Ladder",
        description: "15-step steel ladder for crew to board the high-mounted operator cabin.",
        material: "Steel",
        function: "Crew access.",
        assemblyOrder: 13,
        connections: ["Cabin Shell", "Ground"],
        failureEffect: "Structural bend.",
        cascadeFailures: ["Crew Access Blocked"],
        originalPosition: { x: -2.2, y: 4, z: 13.0 },
        explodedPosition: { x: -6, y: 4, z: 13.0 }
    });

    parts.push({
        name: "Low Pressure Compressor (LPC)",
        description: "Massive multi-stage titanium fan array drawing in vast quantities of air.",
        material: "Aluminum / Titanium",
        function: "Initial mass-flow generation.",
        assemblyOrder: 14,
        connections: ["Intake", "HPC"],
        failureEffect: "Bird/Debris strike damage.",
        cascadeFailures: ["Imbalance", "Vibration Shear"],
        originalPosition: { x: 0, y: 8, z: 5.0 },
        explodedPosition: { x: 6, y: 8, z: 5.0 }
    });

    parts.push({
        name: "Exhaust Generative Stacks",
        description: "Secondary exhaust pipes venting excess thermal pressure from the APU powering the chassis.",
        material: "Chrome",
        function: "APU exhaust venting.",
        assemblyOrder: 15,
        connections: ["Chassis Base", "APU"],
        failureEffect: "Backpressure buildup.",
        cascadeFailures: ["APU Stall", "Electrical Failure"],
        originalPosition: { x: 3.5, y: 5, z: 8 },
        explodedPosition: { x: 8, y: 5, z: 8 }
    });

    // ====================================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ====================================================================================
    const quizQuestions = [
        {
            question: "In an antimatter-catalyzed turbofan, what is the primary mode of energy transfer from the annihilation event to the working fluid (air)?",
            options: [
                "Direct kinetic collision of antiprotons with nitrogen nuclei.",
                "High-energy gamma rays and pions ionizing and heating the surrounding compressed air.",
                "Thermal conduction through a solid tungsten heat exchanger.",
                "Chemical oxidation of antihydrogen with atmospheric oxygen."
            ],
            correctAnswer: 1,
            explanation: "Proton-antiproton annihilation produces neutral and charged pions, which quickly decay into high-energy gamma rays and leptons. These deeply penetrating particles ionize and superheat the working fluid."
        },
        {
            question: "Why must the high-pressure turbine (HPT) stages in this engine utilize active cooling and magnetic shielding instead of standard single-crystal superalloys alone?",
            options: [
                "To reduce the engine's radar cross-section.",
                "To prevent the relativistic plasma from vaporizing the blades, as temperatures vastly exceed the melting point of any known solid.",
                "To increase the weight of the turbine for gyroscopic stability.",
                "To condense the plasma back into a liquid state."
            ],
            correctAnswer: 1,
            explanation: "The plasma temperatures from antimatter catalysis are in the tens or hundreds of thousands of Kelvin. No solid material can survive this without extreme active boundary-layer cooling and localized magnetic deflection."
        },
        {
            question: "What is the primary function of the 100 Tesla superconducting magnetic containment ring?",
            options: [
                "To generate thrust directly via the Lorentz force.",
                "To safely suspend and transport the antihydrogen plasma into the core without it touching the walls.",
                "To power the avionics of the host aircraft.",
                "To compress the incoming atmospheric air."
            ],
            correctAnswer: 1,
            explanation: "Antimatter annihilates upon contact with normal matter. A massive magnetic field (a magnetic bottle/Penning trap derivative) is required to contain it safely in a vacuum before injection."
        },
        {
            question: "If a localized coil quench occurs in the magnetic containment ring, what is the most immediate cascade effect?",
            options: [
                "The engine will lose 5% of its thrust.",
                "The antihydrogen will drift, contact the normal matter of the feed lines or chamber wall, and trigger an uncontained, catastrophic annihilation.",
                "The compressor will experience a mild aerodynamic stall.",
                "The exhaust nozzle will lock in its current position."
            ],
            correctAnswer: 1,
            explanation: "A quench means a sudden loss of superconductivity and magnetic field. The uncontained antimatter will immediately strike the walls, releasing immense explosive energy."
        },
        {
            question: "In the thrust vectoring nozzle, why do the exhaust petals continuously oscillate their pitch angle slightly during stable flight?",
            options: [
                "To shed excess ice buildup at high altitudes.",
                "To actively manage boundary layer separation of the relativistic plasma flow and prevent thermal pooling.",
                "Because the hydraulic pumps are inherently unstable.",
                "To generate a specific acoustic signature for communication."
            ],
            correctAnswer: 1,
            explanation: "At extreme plasma velocities, active nozzle shaping is required to maintain a stable shock diamond pattern and prevent thermal hotspots from melting the nozzle throat."
        }
    ];

    // ====================================================================================
    // EXTREME ANIMATION LOGIC
    // ====================================================================================
    let timeAcc = 0;
    function animate(time, speed, activeMeshes) {
        timeAcc += speed * 0.01;

        // 1. Extreme Turbine RPMs
        if(activeMeshes.lpCompressor) activeMeshes.lpCompressor.rotation.z -= speed * 0.4;
        if(activeMeshes.hpCompressor) activeMeshes.hpCompressor.rotation.z -= speed * 1.2;
        if(activeMeshes.hpTurbine) activeMeshes.hpTurbine.rotation.z -= speed * 1.2;
        if(activeMeshes.lpTurbine) activeMeshes.lpTurbine.rotation.z -= speed * 0.4;
        if(activeMeshes.noseConeGroup) activeMeshes.noseConeGroup.rotation.z -= speed * 0.4;

        // 2. Annihilation Core Pulsation
        if(activeMeshes.coreMesh) {
            const pulse = 1.0 + Math.sin(timeAcc * 25) * 0.08;
            activeMeshes.coreMesh.scale.set(pulse, pulse, pulse * 2.5);
            activeMeshes.coreMesh.material.emissiveIntensity = 12 + Math.sin(timeAcc * 60) * 6;
        }

        // 3. Antimatter Micro-bursts Chaos
        if(activeMeshes.burstGroup) {
            activeMeshes.burstGroup.rotation.z += speed * 0.15;
            activeMeshes.burstGroup.children.forEach((child, index) => {
                const s = 0.8 + Math.sin(timeAcc * 40 + index) * 0.6;
                child.scale.set(s, s, s);
                child.position.x += Math.sin(timeAcc * 50 + index) * 0.06 * speed;
                child.position.y += Math.cos(timeAcc * 45 + index) * 0.06 * speed;
                
                if(child.position.length() > 1.4) {
                    child.position.set((Math.random()-0.5)*1.2, (Math.random()-0.5)*1.2, -1.5 + (Math.random()-0.5)*2.5);
                }
            });
        }

        // 4. Relativistic Plasma Plume Flickering
        if(activeMeshes.plumeGroup) {
            activeMeshes.plumeGroup.children.forEach((plume, index) => {
                const flicker = 0.9 + Math.random() * 0.2;
                plume.scale.set(flicker, flicker, flicker);
                plume.material.emissiveIntensity = 10 + Math.sin(timeAcc * 120 + index) * 5;
            });
        }

        // 5. Hydraulic Thrust Vectoring Actuation
        if(activeMeshes.petalsGroup && activeMeshes.pistons) {
            // Simulate a vectoring command moving in a circle
            const vectorX = Math.cos(timeAcc * 2) * 0.2;
            const vectorY = Math.sin(timeAcc * 2) * 0.2;

            activeMeshes.pistons.forEach((item, index) => {
                const angle = (index / 36) * Math.PI * 2;
                
                // Calculate required petal angle based on vector command
                const targetIncline = 0.15 + (Math.cos(angle)*vectorX + Math.sin(angle)*vectorY);
                
                // Animate petal
                item.petal.rotation.x = targetIncline;
                
                // Animate hydraulic piston rod based on petal position
                // Rod extends/retracts slightly
                item.piston.rod.position.y = 0.7 + targetIncline * 0.5;
            });
        }

        // 6. Tires Rolling
        if(activeMeshes.wheels) {
            activeMeshes.wheels.forEach(wheel => {
                wheel.rotation.z -= speed * 0.05; // Chassis moving forward slowly
            });
        }
    }

    return { group, parts, description: "Ultra God Tier Antimatter Catalyzed Jet Turbine mounted on a massive mobile test platform. Features 100-Tesla magnetic containment, actively cooled single-crystal blades, hydraulic thrust vectoring, an armored operator cabin, and massive lugged off-road tires.", quizQuestions, animate };
}
