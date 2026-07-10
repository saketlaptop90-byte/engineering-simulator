import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // 0. CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, wireframe: false });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2.0, wireframe: false });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 3.5, wireframe: true });
    const exoticMatterMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 4.0, transparent: true, opacity: 0.7 });
    const consoleScreen = new THREE.MeshStandardMaterial({ color: 0x001133, emissive: 0x0044aa, emissiveIntensity: 1.5 });
    const eventHorizonMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 0.0, metalness: 1.0 });
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5.0 });
    const warningLightMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 3.0 });
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5.0, transparent: true, opacity: 0.6 });

    // Arrays to hold dynamic components for the animate loop
    const wheels = [];
    const boomArms = [];
    const pistons = [];
    const dampeners = [];
    const spinners = [];
    const particleSystems = [];
    const pulseLights = [];

    // ==========================================
    // 1. MOBILE CHASSIS & OFF-ROAD WHEEL ARRAYS
    // ==========================================
    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = 40;

    // Main Chassis Body - Extruded Shape for complex geometry
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-150, -40);
    chassisShape.lineTo(150, -40);
    chassisShape.lineTo(180, 0);
    chassisShape.lineTo(150, 40);
    chassisShape.lineTo(-150, 40);
    chassisShape.lineTo(-180, 0);
    chassisShape.lineTo(-150, -40);

    const chassisExtrudeSettings = { depth: 200, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeSettings);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.set(0, 40, -100);
    chassisGroup.add(chassisMesh);

    // Function to generate hyper-realistic tires
    function createWheel() {
        const wheelGroup = new THREE.Group();
        
        // Main Tire Tube
        const tireGeo = new THREE.TorusGeometry(35, 12, 32, 100);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tireMesh);
        
        // Aggressive Treads (Lugs)
        const lugsGroup = new THREE.Group();
        const lugCount = 140;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeo = new THREE.BoxGeometry(16, 5, 8);
            const lugMesh = new THREE.Mesh(lugGeo, rubber);
            const rTorus = 35;
            const rTube = 12;
            
            lugMesh.position.set(Math.cos(angle) * (rTorus + rTube - 1), Math.sin(angle) * (rTorus + rTube - 1), 0);
            lugMesh.rotation.z = angle;
            lugsGroup.add(lugMesh);
            
            // Side Lugs
            const sideLugGeo = new THREE.BoxGeometry(8, 4, 6);
            const sideLug1 = new THREE.Mesh(sideLugGeo, rubber);
            sideLug1.position.set(Math.cos(angle) * (rTorus + rTube * 0.7), Math.sin(angle) * (rTorus + rTube * 0.7), 10);
            sideLug1.rotation.z = angle;
            sideLug1.rotation.x = Math.PI / 6;
            lugsGroup.add(sideLug1);
            
            const sideLug2 = new THREE.Mesh(sideLugGeo, rubber);
            sideLug2.position.set(Math.cos(angle) * (rTorus + rTube * 0.7), Math.sin(angle) * (rTorus + rTube * 0.7), -10);
            sideLug2.rotation.z = angle;
            sideLug2.rotation.x = -Math.PI / 6;
            lugsGroup.add(sideLug2);
        }
        wheelGroup.add(lugsGroup);
        
        // Complex Rim (Cylinders and Spokes)
        const rimGeo = new THREE.CylinderGeometry(26, 26, 14, 64);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        wheelGroup.add(rimMesh);
        
        const spokeGroup = new THREE.Group();
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(1.5, 1.5, 26, 16);
            const spokeMesh = new THREE.Mesh(spokeGeo, darkSteel);
            spokeMesh.position.set(Math.cos(angle) * 13, Math.sin(angle) * 13, 0);
            spokeMesh.rotation.z = angle;
            spokeMesh.rotation.x = Math.PI / 2;
            spokeGroup.add(spokeMesh);
        }
        wheelGroup.add(spokeGroup);
        
        const hubGeo = new THREE.CylinderGeometry(8, 8, 20, 32);
        const hubMesh = new THREE.Mesh(hubGeo, steel);
        hubMesh.rotation.x = Math.PI / 2;
        wheelGroup.add(hubMesh);

        return wheelGroup;
    }

    // Place 8 Massive Wheels on Chassis
    const wheelPositions = [
        { x: -160, z: -80 }, { x: -160, z: -20 }, { x: -160, z: 40 }, { x: -160, z: 100 },
        { x: 160, z: -80 }, { x: 160, z: -20 }, { x: 160, z: 40 }, { x: 160, z: 100 }
    ];

    wheelPositions.forEach(pos => {
        const wheel = createWheel();
        wheel.position.set(pos.x, 30, pos.z);
        wheel.rotation.y = Math.PI / 2; // Face forward
        
        // Suspension mechanism
        const suspensionGeo = new THREE.CylinderGeometry(5, 5, 40, 16);
        const suspensionMesh = new THREE.Mesh(suspensionGeo, darkSteel);
        suspensionMesh.position.set(pos.x > 0 ? pos.x - 20 : pos.x + 20, 50, pos.z);
        suspensionMesh.rotation.z = pos.x > 0 ? Math.PI / 4 : -Math.PI / 4;
        chassisGroup.add(suspensionMesh);

        // Hydraulic lines for suspension
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos.x, 40, pos.z),
            new THREE.Vector3(pos.x > 0 ? pos.x - 10 : pos.x + 10, 60, pos.z),
            new THREE.Vector3(pos.x > 0 ? pos.x - 30 : pos.x + 30, 70, pos.z)
        ]);
        const hoseGeo = new THREE.TubeGeometry(curve, 20, 1.5, 8, false);
        const hoseMesh = new THREE.Mesh(hoseGeo, rubber);
        chassisGroup.add(hoseMesh);

        chassisGroup.add(wheel);
        wheels.push(wheel);
    });
    group.add(chassisGroup);

    // ==========================================
    // 2. DETAILED OPERATOR CABIN
    // ==========================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 120, 80); // Front and high up

    // Cabin Shell
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-40, 0);
    cabinShape.lineTo(40, 0);
    cabinShape.lineTo(40, 50);
    cabinShape.lineTo(20, 70);
    cabinShape.lineTo(-20, 70);
    cabinShape.lineTo(-40, 50);
    cabinShape.lineTo(-40, 0);
    const cabinExtrude = new THREE.ExtrudeGeometry(cabinShape, { depth: 60, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 });
    const cabinMesh = new THREE.Mesh(cabinExtrude, aluminum);
    cabinGroup.add(cabinMesh);

    // Tinted Windows
    const windowGeo = new THREE.PlaneGeometry(36, 26);
    const frontWindow = new THREE.Mesh(windowGeo, tinted);
    frontWindow.position.set(0, 58, 61);
    frontWindow.rotation.x = -Math.PI / 4;
    cabinGroup.add(frontWindow);

    // Desk and Console
    const deskGeo = new THREE.BoxGeometry(60, 4, 20);
    const deskMesh = new THREE.Mesh(deskGeo, darkSteel);
    deskMesh.position.set(0, 25, 45);
    cabinGroup.add(deskMesh);

    // Array of glowing screens
    for (let s = 0; s < 6; s++) {
        const screenGeo = new THREE.PlaneGeometry(12, 8);
        const screenMesh = new THREE.Mesh(screenGeo, consoleScreen);
        const xOffset = -25 + (s % 3) * 25;
        const yOffset = 35 + Math.floor(s / 3) * 12;
        screenMesh.position.set(xOffset, yOffset, 55);
        screenMesh.rotation.x = -0.1;
        screenMesh.rotation.y = s % 3 === 0 ? 0.3 : (s % 3 === 2 ? -0.3 : 0);
        cabinGroup.add(screenMesh);
        pulseLights.push({ mesh: screenMesh, base: 1.5, amp: 0.5, speed: 5 + s });
    }

    // Keyboard Matrix (Hundreds of tiny keys)
    const keyboardGroup = new THREE.Group();
    for (let kr = 0; kr < 5; kr++) {
        for (let kc = 0; kc < 20; kc++) {
            const keyGeo = new THREE.BoxGeometry(1, 0.5, 1);
            const keyMat = (kr + kc) % 5 === 0 ? warningLightMat : plastic;
            const keyMesh = new THREE.Mesh(keyGeo, keyMat);
            keyMesh.position.set(-15 + kc * 1.5, 0, -4 + kr * 1.5);
            keyboardGroup.add(keyMesh);
        }
    }
    keyboardGroup.position.set(0, 27.5, 45);
    cabinGroup.add(keyboardGroup);

    // Twin Joysticks for mobile driving and stabilizer calibration
    for (let j = 0; j < 2; j++) {
        const jsBaseGeo = new THREE.CylinderGeometry(3, 3, 2, 16);
        const jsBase = new THREE.Mesh(jsBaseGeo, darkSteel);
        jsBase.position.set(j === 0 ? -25 : 25, 27, 45);
        
        const jsShaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
        const jsShaft = new THREE.Mesh(jsShaftGeo, chrome);
        jsShaft.position.set(0, 5, 0);
        
        const jsGripGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const jsGrip = new THREE.Mesh(jsGripGeo, rubber);
        jsGrip.position.set(0, 10, 0);
        
        jsBase.add(jsShaft);
        jsBase.add(jsGrip);
        cabinGroup.add(jsBase);
        
        // Add to updatables to jiggle joysticks
        spinners.push({ mesh: jsBase, axis: 'x', speed: 0, wobble: true, offset: j });
    }

    // Operator Chair
    const chairBaseGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
    const chairBase = new THREE.Mesh(chairBaseGeo, chrome);
    chairBase.position.set(0, 10, 25);
    
    const chairSeatGeo = new THREE.BoxGeometry(14, 4, 14);
    const chairSeat = new THREE.Mesh(chairSeatGeo, rubber);
    chairSeat.position.set(0, 20, 25);
    
    const chairBackGeo = new THREE.BoxGeometry(14, 20, 4);
    const chairBack = new THREE.Mesh(chairBackGeo, rubber);
    chairBack.position.set(0, 32, 20);
    chairBack.rotation.x = -0.1;

    cabinGroup.add(chairBase, chairSeat, chairBack);
    group.add(cabinGroup);

    // ==========================================
    // 3. STRUCTURAL GANTRY
    // ==========================================
    const gantryGroup = new THREE.Group();
    gantryGroup.position.y = 80;

    // Massive Hexagonal Gantry Tower
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 140;
        const z = Math.sin(angle) * 140;
        
        // Main Vertical Pillars
        const pillarGeo = new THREE.CylinderGeometry(6, 6, 350, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, darkSteel);
        pillarMesh.position.set(x, 215, z);
        gantryGroup.add(pillarMesh);
        
        // Cross Beams connecting pillars
        const nextAngle = ((i + 1) / 6) * Math.PI * 2;
        const nx = Math.cos(nextAngle) * 140;
        const nz = Math.sin(nextAngle) * 140;
        
        for (let yLevel = 100; yLevel <= 350; yLevel += 50) {
            const beamLength = Math.hypot(nx - x, nz - z);
            const beamGeo = new THREE.CylinderGeometry(3, 3, beamLength, 8);
            const beamMesh = new THREE.Mesh(beamGeo, steel);
            
            const midX = (x + nx) / 2;
            const midZ = (z + nz) / 2;
            beamMesh.position.set(midX, yLevel, midZ);
            
            beamMesh.lookAt(nx, yLevel, nz);
            beamMesh.rotateX(Math.PI / 2);
            gantryGroup.add(beamMesh);
            
            // X-Bracing
            const diagGeo = new THREE.CylinderGeometry(2, 2, Math.hypot(beamLength, 50), 8);
            const diagMesh1 = new THREE.Mesh(diagGeo, steel);
            diagMesh1.position.set(midX, yLevel + 25, midZ);
            diagMesh1.lookAt(nx, yLevel + 50, nz);
            diagMesh1.rotateX(Math.PI / 2);
            
            const diagMesh2 = new THREE.Mesh(diagGeo, steel);
            diagMesh2.position.set(midX, yLevel + 25, midZ);
            diagMesh2.lookAt(x, yLevel + 50, z);
            diagMesh2.rotateX(Math.PI / 2);
            
            gantryGroup.add(diagMesh1, diagMesh2);
        }
    }
    group.add(gantryGroup);

    // ==========================================
    // 4. WORMHOLE THROAT & EVENT HORIZON
    // ==========================================
    const throatGroup = new THREE.Group();
    throatGroup.position.set(0, 250, 0);

    // Einstein-Rosen Bridge Geometry (Hyperbolic Secant Profile)
    const throatPoints = [];
    for (let i = 0; i <= 300; i++) {
        const t = (i / 300) * Math.PI * 2 - Math.PI; 
        const r = 25 + 50 * Math.cosh(t * 0.8); // Wormhole curvature
        throatPoints.push(new THREE.Vector2(r, t * 45));
    }
    const throatGeo = new THREE.LatheGeometry(throatPoints, 256);
    const throatMesh = new THREE.Mesh(throatGeo, neonPurple);
    throatMesh.rotation.x = Math.PI / 2;
    throatGroup.add(throatMesh);
    spinners.push({ mesh: throatMesh, axis: 'z', speed: 0.05 });
    pulseLights.push({ mesh: throatMesh, base: 3.5, amp: 1.5, speed: 2.0 });

    // Inner Singularity / Cauchy Horizon
    const horizonGeo = new THREE.SphereGeometry(22, 128, 128);
    const horizonMesh = new THREE.Mesh(horizonGeo, eventHorizonMat);
    throatGroup.add(horizonMesh);

    // Inner Glowing Accretion Disk
    const accretionGeo = new THREE.TorusGeometry(35, 2, 64, 128);
    const accretionMesh = new THREE.Mesh(accretionGeo, neonBlue);
    throatGroup.add(accretionMesh);
    spinners.push({ mesh: accretionMesh, axis: 'x', speed: 0.2 });
    spinners.push({ mesh: accretionMesh, axis: 'y', speed: 0.1 });

    group.add(throatGroup);

    // ==========================================
    // 5. TRI-PHASE MAGNETIC CONTAINMENT RINGS
    // ==========================================
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, 250, 0);
    
    const ringRadii = [85, 105, 125, 145];
    const ringSpeeds = [0.03, -0.02, 0.04, -0.01];
    
    ringRadii.forEach((radius, index) => {
        const ringGeo = new THREE.TorusGeometry(radius, 6, 64, 128);
        const ringMesh = new THREE.Mesh(ringGeo, index % 2 === 0 ? steel : darkSteel);
        ringMesh.rotation.x = Math.PI / 2;
        
        // Massive Greeble Generation on Rings
        const greebleGroup = new THREE.Group();
        for (let j = 0; j < 90; j++) {
            const angle = (j / 90) * Math.PI * 2;
            
            // Base greeble block
            const gBox = new THREE.BoxGeometry(8, 8, 12);
            const gMesh = new THREE.Mesh(gBox, darkSteel);
            gMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            gMesh.lookAt(0, 0, 0);
            greebleGroup.add(gMesh);
            
            // Hydraulic tubing wrapping the greeble
            const pipeGeo = new THREE.CylinderGeometry(1, 1, 14, 8);
            const pipeMesh = new THREE.Mesh(pipeGeo, copper);
            pipeMesh.position.set(Math.cos(angle) * (radius + 5), Math.sin(angle) * (radius + 5), 0);
            pipeMesh.lookAt(0, 0, 0);
            greebleGroup.add(pipeMesh);

            // Warning lights on every 10th greeble
            if (j % 10 === 0) {
                const lightGeo = new THREE.SphereGeometry(1.5, 8, 8);
                const lightMesh = new THREE.Mesh(lightGeo, warningLightMat);
                lightMesh.position.set(Math.cos(angle) * (radius + 8), Math.sin(angle) * (radius + 8), 0);
                pulseLights.push({ mesh: lightMesh, base: 2, amp: 2, speed: 10 + index });
                greebleGroup.add(lightMesh);
            }
        }
        ringMesh.add(greebleGroup);
        
        ringsGroup.add(ringMesh);
        spinners.push({ mesh: ringMesh, axis: 'z', speed: ringSpeeds[index] });
    });
    group.add(ringsGroup);

    // ==========================================
    // 6. NEGATIVE ENERGY FEEDBACK DAMPENERS
    // ==========================================
    function createDampener() {
        const dampGroup = new THREE.Group();
        
        // Base Mount
        const baseGeo = new THREE.BoxGeometry(20, 20, 20);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        dampGroup.add(baseMesh);
        
        // Outer Cylinder Housing
        const houseGeo = new THREE.CylinderGeometry(8, 12, 40, 32);
        const houseMesh = new THREE.Mesh(houseGeo, steel);
        houseMesh.position.y = 30;
        dampGroup.add(houseMesh);
        
        // Telescoping Piston (moves in animate)
        const pistonGeo = new THREE.CylinderGeometry(6, 6, 30, 32);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.position.y = 55;
        dampGroup.add(pistonMesh);
        
        // Exotic Matter Crystal Core
        const crystalGeo = new THREE.OctahedronGeometry(10, 0);
        const crystalMesh = new THREE.Mesh(crystalGeo, exoticMatterMat);
        crystalMesh.position.y = 75;
        dampGroup.add(crystalMesh);
        
        // Emitter Nozzle
        const nozzleGeo = new THREE.ConeGeometry(5, 20, 32);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzleMesh.position.y = 90;
        dampGroup.add(nozzleMesh);
        
        // Energy Beam (Fires constantly)
        const beamGeo = new THREE.CylinderGeometry(1, 1, 150, 16);
        const beamMesh = new THREE.Mesh(beamGeo, laserMat);
        beamMesh.position.y = 175;
        dampGroup.add(beamMesh);
        
        return { dampGroup, pistonMesh, crystalMesh, beamMesh };
    }

    // Place 8 Dampeners aiming at the throat
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dampObj = createDampener();
        
        // Positioned outside the rings, pointing inwards
        const r = 220;
        dampObj.dampGroup.position.set(Math.cos(angle) * r, 250, Math.sin(angle) * r);
        
        // Point towards center
        dampObj.dampGroup.lookAt(0, 250, 0);
        dampObj.dampGroup.rotateX(Math.PI / 2);
        
        group.add(dampObj.dampGroup);
        dampeners.push(dampObj);
        
        spinners.push({ mesh: dampObj.crystalMesh, axis: 'y', speed: 0.1 });
        pulseLights.push({ mesh: dampObj.beamMesh, base: 3, amp: 2, speed: 15 + i });
    }

    // ==========================================
    // 7. ARTICULATED RESERVOIR BOOM ARMS
    // ==========================================
    function createBoomArmAndReservoir() {
        const boomGroup = new THREE.Group();
        
        // Base Hinge
        const baseHingeGeo = new THREE.CylinderGeometry(12, 12, 30, 32);
        const baseHinge = new THREE.Mesh(baseHingeGeo, darkSteel);
        boomGroup.add(baseHinge);
        
        // Lower Arm
        const lowerArmGeo = new THREE.BoxGeometry(16, 120, 16);
        const lowerArm = new THREE.Mesh(lowerArmGeo, steel);
        lowerArm.position.y = 60;
        boomGroup.add(lowerArm);
        
        // Mid Hinge
        const midHingeGeo = new THREE.CylinderGeometry(10, 10, 24, 32);
        const midHinge = new THREE.Mesh(midHingeGeo, darkSteel);
        midHinge.position.y = 120;
        midHinge.rotation.x = Math.PI / 2;
        boomGroup.add(midHinge);
        
        // Upper Arm Assembly (rotates in animate)
        const upperArmGroup = new THREE.Group();
        upperArmGroup.position.y = 120;
        
        const upperArmGeo = new THREE.BoxGeometry(12, 100, 12);
        const upperArm = new THREE.Mesh(upperArmGeo, aluminum);
        upperArm.position.y = 50;
        upperArmGroup.add(upperArm);
        
        // --- Exotic Matter Reservoir ---
        const reservoirGroup = new THREE.Group();
        reservoirGroup.position.y = 100;
        
        // Glass Tank
        const tankGeo = new THREE.CylinderGeometry(18, 18, 60, 32);
        const tankMesh = new THREE.Mesh(tankGeo, glass);
        reservoirGroup.add(tankMesh);
        
        // Inner Glowing Exotic Fluid
        const fluidGeo = new THREE.CylinderGeometry(16, 16, 56, 32);
        const fluidMesh = new THREE.Mesh(fluidGeo, exoticMatterMat);
        reservoirGroup.add(fluidMesh);
        pulseLights.push({ mesh: fluidMesh, base: 4, amp: 2, speed: 1.5 });
        
        // Tank Caps
        const capGeo = new THREE.CylinderGeometry(20, 20, 8, 32);
        const topCap = new THREE.Mesh(capGeo, steel);
        topCap.position.y = 34;
        const bottomCap = new THREE.Mesh(capGeo, steel);
        bottomCap.position.y = -34;
        reservoirGroup.add(topCap, bottomCap);
        
        upperArmGroup.add(reservoirGroup);
        boomGroup.add(upperArmGroup);
        
        // Hydraulic Piston for upper arm
        const pistonCylGeo = new THREE.CylinderGeometry(4, 4, 60, 16);
        const pistonCyl = new THREE.Mesh(pistonCylGeo, darkSteel);
        pistonCyl.position.set(0, 40, 14);
        boomGroup.add(pistonCyl);
        
        const pistonRodGeo = new THREE.CylinderGeometry(2.5, 2.5, 60, 16);
        const pistonRod = new THREE.Mesh(pistonRodGeo, chrome);
        pistonRod.position.set(0, 70, 14); // Y gets updated in animate
        boomGroup.add(pistonRod);
        
        return { boomGroup, upperArmGroup, pistonRod, fluidMesh };
    }

    // Place 4 Boom Arms around the base
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const boomObj = createBoomArmAndReservoir();
        
        boomObj.boomGroup.position.set(Math.cos(angle) * 160, 80, Math.sin(angle) * 160);
        boomObj.boomGroup.lookAt(0, 80, 0);
        boomObj.boomGroup.rotateX(Math.PI / 2); // Base points in, arm points up
        boomObj.boomGroup.rotateZ(-Math.PI / 2); // Orient vertically
        
        group.add(boomObj.boomGroup);
        boomArms.push(boomObj);
    }

    // ==========================================
    // 8. QUANTUM FLUCTUATION DAMPENING COILS
    // ==========================================
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 250, 0);
    
    for (let i = 0; i < 12; i++) {
        const coilGeo = new THREE.TorusKnotGeometry(60, 4, 100, 16, 2, 5);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        
        coilMesh.rotation.x = Math.random() * Math.PI;
        coilMesh.rotation.y = Math.random() * Math.PI;
        
        coilGroup.add(coilMesh);
        spinners.push({ mesh: coilMesh, axis: 'x', speed: 0.01 + Math.random() * 0.02 });
        spinners.push({ mesh: coilMesh, axis: 'y', speed: 0.01 + Math.random() * 0.02 });
    }
    group.add(coilGroup);

    // ==========================================
    // 9. THERMODYNAMICAL COOLING MATRIX
    // ==========================================
    const coolingGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const curvePoints = [];
        // Generate complex twisted tube paths
        for (let j = 0; j <= 20; j++) {
            const y = 80 + j * 15;
            const r = 130 + 30 * Math.sin(j * 0.5 + i);
            curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 3, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, index => (i % 2 === 0 ? copper : steel));
        coolingGroup.add(tubeMesh);
    }
    group.add(coolingGroup);

    // ==========================================
    // 10. TEMPORAL FIELD GENERATORS (Extruded Pillars)
    // ==========================================
    const tfgShape = new THREE.Shape();
    // Complex star-gear shape
    const numPoints = 12;
    for (let i = 0; i < numPoints * 2; i++) {
        const a = (i / (numPoints * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? 15 : 8;
        if (i === 0) tfgShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else tfgShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    tfgShape.lineTo(15, 0); // close path

    const tfgGeo = new THREE.ExtrudeGeometry(tfgShape, { depth: 200, bevelEnabled: true, bevelThickness: 4, bevelSize: 4 });
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const tfgMesh = new THREE.Mesh(tfgGeo, darkSteel);
        tfgMesh.position.set(Math.cos(angle) * 200, 150, Math.sin(angle) * 200);
        tfgMesh.rotation.x = -Math.PI / 2;
        group.add(tfgMesh);
        
        // Add glowing inserts
        const insertGeo = new THREE.CylinderGeometry(5, 5, 200, 16);
        const insertMesh = new THREE.Mesh(insertGeo, neonBlue);
        insertMesh.position.set(Math.cos(angle) * 200, 250, Math.sin(angle) * 200);
        pulseLights.push({ mesh: insertMesh, base: 2, amp: 1, speed: 4 });
        group.add(insertMesh);
    }

    // ==========================================
    // 11. VIRTUAL PARTICLE SYSTEM (Instanced Mesh)
    // ==========================================
    const particleCount = 2500;
    const particleGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const pData = [];
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 50 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        pData.push({
            radius: radius,
            theta: theta,
            phi: phi,
            speed: 0.02 + Math.random() * 0.08,
            spiralIn: Math.random() > 0.5 // Half spiraling in, half out (Hawking radiation simulation)
        });
        
        dummy.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta) + 250,
            radius * Math.cos(phi)
        );
        dummy.updateMatrix();
        particleMesh.setMatrixAt(i, dummy.matrix);
    }
    group.add(particleMesh);
    particleSystems.push({ mesh: particleMesh, data: pData, dummy: dummy });

    // ==========================================
    // PARTS ARRAY REGISTRATION
    // ==========================================
    parts.push({
        name: "Einstein-Rosen Bridge Throat",
        description: "The primary topological conduit of the closed timelike curve. Maintained by massive infusions of exotic matter to violate the weak energy condition and prevent collapse.",
        material: "NeonPurple / Exotic",
        function: "Provides the navigable spacetime bridge between distinct temporal coordinates.",
        assemblyOrder: 1,
        connections: ["Singularity Core", "Tri-Phase Magnetic Containment Rings", "Negative Energy Feedback Dampeners"],
        failureEffect: "Spacetime pinches off, severing the temporal link and crushing any traversing matter to infinite density.",
        cascadeFailures: ["Cauchy Horizon Modulators", "Containment Rings"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 600, z: 0 }
    });

    parts.push({
        name: "Super-Crawler Mobile Chassis",
        description: "Massive dark-steel base platform equipped with 8 oversized off-road wheel assemblies, allowing the stabilizer to be dynamically repositioned along ley-lines of temporal weak points.",
        material: "DarkSteel / Rubber / Chrome",
        function: "Provides mobility, structural grounding, and vibration dampening for the hyper-sensitive quantum operations.",
        assemblyOrder: 2,
        connections: ["Structural Gantry", "Operator Cabin", "Suspension Hydraulics"],
        failureEffect: "Loss of mobility; catastrophic misalignment of the wormhole throat relative to planetary rotation, causing temporal shearing.",
        cascadeFailures: ["Structural Gantry", "Temporal Field Generators"],
        originalPosition: { x: 0, y: 40, z: -100 },
        explodedPosition: { x: 0, y: -100, z: -100 }
    });

    parts.push({
        name: "Tri-Phase Magnetic Containment Rings",
        description: "Nested toroids generating localized magnetic fields to stabilize the exotic matter distribution against vacuum decay.",
        material: "Steel / DarkSteel",
        function: "Confines the exotic matter plasma to the throat's exact geometric requirements.",
        assemblyOrder: 3,
        connections: ["Einstein-Rosen Bridge Throat", "Structural Gantry"],
        failureEffect: "Exotic matter leaks into standard space, triggering spontaneous vacuum decay and localized matter annihilation.",
        cascadeFailures: ["Wormhole Throat", "Virtual Particle Extraction Grid"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 400 }
    });

    parts.push({
        name: "Negative Energy Feedback Dampeners",
        description: "8 radical arrays firing concentrated negative energy beams directly into the throat to counter the exponential blueshift of virtual particles at the Cauchy horizon.",
        material: "DarkSteel / Exotic Matter Crystal",
        function: "Prevents the chronology protection conjecture from destroying the machine via infinite radiation buildup.",
        assemblyOrder: 4,
        connections: ["Tri-Phase Magnetic Containment Rings", "Exotic Matter Reservoirs"],
        failureEffect: "Runaway particle blueshift instantly vaporizes the stabilizer and creates a naked singularity.",
        cascadeFailures: ["Einstein-Rosen Bridge Throat"],
        originalPosition: { x: 220, y: 250, z: 0 }, // Approx
        explodedPosition: { x: 500, y: 250, z: 500 }
    });

    parts.push({
        name: "Articulated Exotic Matter Reservoirs",
        description: "Glass containment vessels holding liquid exotic matter, mounted on hydraulic boom arms for precise injection maneuvering.",
        material: "Glass / Steel / Exotic Fluid",
        function: "Stores the raw negative-mass material required to hold the wormhole open.",
        assemblyOrder: 5,
        connections: ["Mobile Chassis", "Boom Hydraulics"],
        failureEffect: "Loss of exotic matter supply leads to rapid throat collapse.",
        cascadeFailures: ["Negative Energy Feedback Dampeners"],
        originalPosition: { x: 160, y: 180, z: 160 },
        explodedPosition: { x: 300, y: 300, z: 300 }
    });

    parts.push({
        name: "Quantum Fluctuation Dampening Coils",
        description: "Massive intersecting torus knots of superconductive copper, absorbing stray Hawking radiation and zero-point energy spikes.",
        material: "Copper",
        function: "Smooths out microscopic spacetime tearing near the event horizon.",
        assemblyOrder: 6,
        connections: ["Tri-Phase Magnetic Containment Rings", "Thermodynamical Cooling Matrix"],
        failureEffect: "Micro-singularities form in the surrounding atmosphere, emitting lethal bursts of gamma radiation.",
        cascadeFailures: ["Operator Cabin Systems"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 500, z: -400 }
    });

    parts.push({
        name: "Thermodynamical Cooling Matrix",
        description: "Extensive network of twisted tubing pumping liquid helium to extract the immense heat generated by temporal friction.",
        material: "Copper / Steel",
        function: "Prevents the containment rings and dampeners from melting down.",
        assemblyOrder: 7,
        connections: ["Quantum Fluctuation Dampening Coils", "Structural Gantry"],
        failureEffect: "Thermal runaway melting the structural gantry.",
        cascadeFailures: ["Structural Gantry", "Magnetic Containment Rings"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: -300, y: 150, z: 0 }
    });

    parts.push({
        name: "Advanced Operator Command Center",
        description: "Tinted-glass cabin outfitted with 6 multi-spectral monitors, complex keyboard arrays, and twin joysticks for manual stabilizer override and driving.",
        material: "Aluminum / Tinted Glass / Console Screens",
        function: "Allows a human PhD engineer to manually adjust temporal flux parameters and drive the crawler.",
        assemblyOrder: 8,
        connections: ["Super-Crawler Mobile Chassis"],
        failureEffect: "Loss of manual control. Stabilizer relies entirely on AI, which may hallucinate temporal paths.",
        cascadeFailures: ["None (System isolates to protect human life)"],
        originalPosition: { x: 0, y: 120, z: 80 },
        explodedPosition: { x: 0, y: 300, z: 400 }
    });

    parts.push({
        name: "Temporal Field Generators",
        description: "6 extruded star-pillar structures emitting chronal synchronization waves to match the exit mouth's temporal coordinates.",
        material: "DarkSteel / NeonBlue Insert",
        function: "Calibrates the time-jump duration (Δt) of the CTC.",
        assemblyOrder: 9,
        connections: ["Structural Gantry"],
        failureEffect: "Travelers emerge at the correct spatial coordinates but random temporal epochs (e.g., 2 billion years in the past).",
        cascadeFailures: ["Chronal Synchronization Banks"],
        originalPosition: { x: 200, y: 150, z: 0 },
        explodedPosition: { x: 400, y: 150, z: -400 }
    });

    parts.push({
        name: "Singularity Core / Cauchy Horizon",
        description: "The absolute center of the wormhole where the past and future light cones intersect. Perfectly spherical and impossibly black.",
        material: "EventHorizonMat (Pure Black)",
        function: "The boundary beyond which causality breaks down. Must be carefully regulated by the dampeners.",
        assemblyOrder: 10,
        connections: ["Einstein-Rosen Bridge Throat"],
        failureEffect: "Cauchy horizon instability destroys the entire universe's causal history.",
        cascadeFailures: ["Reality"],
        originalPosition: { x: 0, y: 250, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 0 } // Cannot explode without destroying everything
    });

    // ==========================================
    // QUIZ QUESTIONS (PhD Level)
    // ==========================================
    const description = "Ultra God-Tier Mobile Closed Timelike Curve (CTC) Stabilizer. This massive crawler platform generates, stabilizes, and maneuvers a traversable wormhole. It actively counteracts the extreme blueshift of virtual particles at the Cauchy horizon, injecting exotic matter to violate the Weak Energy Condition, thus preventing the throat from pinching off. Highly animated components handle the massive energy loads required for time travel.";

    const quizQuestions = [
        {
            question: "According to Stephen Hawking's Chronology Protection Conjecture, what phenomenon fundamentally prevents the formation of a macroscopic Closed Timelike Curve?",
            options: [
                "The infinite blueshift and amplification of vacuum fluctuations (virtual particles) circulating through the wormhole.",
                "The instantaneous collapse of the exotic matter due to gravitational time dilation.",
                "The violation of the Strong Energy Condition resulting in a topological phase transition.",
                "The evaporation of the wormhole's event horizon via Hawking radiation."
            ],
            correctAnswer: 0,
            explanation: "Hawking demonstrated that vacuum fluctuations would travel through the wormhole and back through normal space in a closed loop, getting infinitely blueshifted and creating an infinite stress-energy tensor that destroys the wormhole before the CTC can form."
        },
        {
            question: "Why is 'Exotic Matter' strictly required to maintain the traversable wormhole (Einstein-Rosen bridge) in this stabilizer?",
            options: [
                "To provide infinite mass for the Singularity Core.",
                "To violate the Weak Energy Condition (WEC), providing negative energy density to push the throat outward against gravity.",
                "To shield the operator cabin from high-frequency gamma bursts.",
                "To synchronize the temporal field generators with the cosmic microwave background."
            ],
            correctAnswer: 1,
            explanation: "Gravity naturally causes the throat of a wormhole to pinch off. Exotic matter with a negative energy density (violating the WEC) exerts an outward pressure/repulsion, keeping the throat open for traversal."
        },
        {
            question: "In the context of the Novikov Self-Consistency Principle as applied to CTCs, how does the universe resolve the Grandfather Paradox?",
            options: [
                "By splitting the universe into branching parallel timelines (Many-Worlds interpretation).",
                "By rendering the time traveler completely intangible while in the past.",
                "By constraining local physical events such that the probability of paradoxical actions is strictly zero, forcing a self-consistent history.",
                "By utilizing the Cauchy Horizon Modulators to instantly erase the time traveler's memories."
            ],
            correctAnswer: 2,
            explanation: "The Novikov Self-Consistency Principle posits that the laws of physics will act to prevent any action that would create a paradox. The only allowed solutions to the equations of motion in a spacetime with CTCs are those that are globally self-consistent."
        },
        {
            question: "Which specific mathematical metric is most commonly utilized to describe a spherically symmetric traversable wormhole without an event horizon?",
            options: [
                "The Schwarzschild metric",
                "The Kerr-Newman metric",
                "The Morris-Thorne metric",
                "The Alcubierre metric"
            ],
            correctAnswer: 2,
            explanation: "The Morris-Thorne metric was specifically derived to describe a traversable wormhole, defined by its shape function and redshift function, lacking an event horizon to allow two-way travel."
        },
        {
            question: "If the Negative Energy Feedback Dampeners fail, the resulting Cauchy horizon instability is mathematically analogous to mass inflation inside which type of black hole?",
            options: [
                "A static Schwarzschild black hole",
                "A rotating Kerr black hole or charged Reissner-Nordström black hole",
                "A primordial black hole",
                "A completely evaporated black hole"
            ],
            correctAnswer: 1,
            explanation: "In Kerr (rotating) and Reissner-Nordström (charged) black holes, there is an inner Cauchy horizon where infinite blueshift of in-falling radiation causes a 'mass inflation' singularity, highly analogous to the instability of a CTC wormhole."
        }
    ];

    // ==========================================
    // ANIMATE FUNCTION
    // ==========================================
    function animate(time, speed, meshes) {
        // 1. Update Simple Spinners
        spinners.forEach(obj => {
            const wiggle = obj.wobble ? Math.sin(time * 10 + obj.offset) * 0.1 : 0;
            if (obj.axis === 'x') obj.mesh.rotation.x += obj.speed * speed + wiggle;
            if (obj.axis === 'y') obj.mesh.rotation.y += obj.speed * speed + wiggle;
            if (obj.axis === 'z') obj.mesh.rotation.z += obj.speed * speed + wiggle;
        });

        // 2. Update Pulsing Materials
        pulseLights.forEach(obj => {
            const intensity = obj.base + Math.sin(time * obj.speed) * obj.amp;
            obj.mesh.material.emissiveIntensity = intensity;
        });

        // 3. Update updatables array
        updatables.forEach(obj => {
            if (obj.type === 'pulse') {
                obj.mesh.material.emissiveIntensity = obj.baseIntensity + Math.sin(time * obj.speed) * 1.5;
            } else if (obj.type === 'rotate') {
                if (obj.axis === 'z') obj.mesh.rotation.z += obj.speed * speed;
            }
        });

        // 4. Animate Wheels (Crawler driving simulation)
        wheels.forEach(wheel => {
            wheel.rotation.x -= 0.05 * speed; // Drive forward
        });

        // 5. Animate Boom Arms & Hydraulics
        boomArms.forEach((boom, index) => {
            // Sine wave oscillation for the upper arm
            const angle = Math.sin(time * speed * 2 + index) * 0.4;
            boom.upperArmGroup.rotation.z = angle;
            
            // Sync hydraulic piston rod exactly to arm movement
            // The upper arm rotates around (0,120,0), rod is attached at (0,70,14).
            // Basic approximation to simulate hydraulic extension:
            const rodExtension = Math.sin(time * speed * 2 + index) * 15;
            boom.pistonRod.position.y = 70 + rodExtension;
        });

        // 6. Animate Feedback Dampener Pistons
        dampeners.forEach((damp, index) => {
            // Rapid firing recoil
            const recoil = Math.abs(Math.sin(time * speed * 15 + index)) * 8;
            damp.pistonMesh.position.y = 55 - recoil;
        });

        // 7. Animate Virtual Particle System (Complex spiraling)
        particleSystems.forEach(sys => {
            const { mesh, data, dummy } = sys;
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                
                // Spiraling logic
                p.theta += p.speed * speed;
                if (p.spiralIn) {
                    p.radius -= p.speed * speed * 50;
                    if (p.radius < 25) p.radius = 350; // Reset to outside
                } else {
                    p.radius += p.speed * speed * 50;
                    if (p.radius > 350) p.radius = 25; // Reset to inside
                }

                dummy.position.set(
                    p.radius * Math.sin(p.phi) * Math.cos(p.theta),
                    p.radius * Math.sin(p.phi) * Math.sin(p.theta) + 250,
                    p.radius * Math.cos(p.phi)
                );
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
