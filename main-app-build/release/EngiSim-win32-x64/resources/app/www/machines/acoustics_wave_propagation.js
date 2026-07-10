import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        wheels: [],
        booms: [],
        hydraulics: [],
        fans: [],
        neonMaterials: [],
        screens: [],
        particles: null,
        lattice: null,
        radar: null
    };

    const description = "Ultra God Tier Wave Propagation Visualizer. A hyper-advanced mobile diagnostic crawler for analyzing non-linear acoustic shock waves, Mach stems, and high-energy wave packet dispersion in exotic mediums. Features massive physical transducers, a high-fidelity instanced simulation lattice, and heavily articulated boom arrays driven by synchronized hydraulics.";

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff, emissive: 0x0088ff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.9
    });
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0022, emissive: 0xff0044, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.2
    });
    const plasmaGlow = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0x8800ff, emissiveIntensity: 3.0, wireframe: true
    });
    const sensorGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44, emissive: 0x00ff88, emissiveIntensity: 1.0, transparent: true, opacity: 0.8
    });
    const screenGlow = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x0055aa, emissiveIntensity: 1.0, roughness: 0.2
    });
    
    meshes.neonMaterials.push(neonBlue, neonRed, plasmaGlow, sensorGreen, screenGlow);

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function createLathedShape(pointsArr, material, segments = 64) {
        const points = pointsArr.map(p => new THREE.Vector2(p[0], p[1]));
        const geom = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geom, material);
    }

    function createTube(curvePoints, radius, material, tubularSegments = 100, radialSegments = 12) {
        const curve = new THREE.CatmullRomCurve3(curvePoints.map(p => new THREE.Vector3(p[0], p[1], p[2])));
        const geom = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
        return new THREE.Mesh(geom, material);
    }

    // ==========================================
    // COMPONENT BUILDERS
    // ==========================================

    // 1. Crawler Chassis
    function buildChassis() {
        const chassisGroup = new THREE.Group();
        
        // Main Body Extrusion
        const shape = new THREE.Shape();
        shape.moveTo(-15, 0);
        shape.lineTo(15, 0);
        shape.lineTo(18, 2);
        shape.lineTo(18, 5);
        shape.lineTo(14, 8);
        shape.lineTo(-14, 8);
        shape.lineTo(-18, 5);
        shape.lineTo(-18, 2);
        shape.lineTo(-15, 0);

        const extrudeSettings = { depth: 12, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.3, bevelThickness: 0.3 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); // Center the geometry
        const body = new THREE.Mesh(geom, darkSteel);
        body.position.y = 6;
        chassisGroup.add(body);

        // Add Rivets and Paneling Details
        const rivetGeom = new THREE.SphereGeometry(0.15, 8, 8);
        const rivetMat = chrome;
        const rivetInstanced = new THREE.InstancedMesh(rivetGeom, rivetMat, 200);
        const dummy = new THREE.Object3D();
        let rivetIdx = 0;
        
        for(let i=0; i<10; i++) {
            for(let j=0; j<10; j++) {
                if (rivetIdx >= 200) break;
                // Side panels
                dummy.position.set(-12 + i*2.6, 5 + j*0.3, 6.2);
                dummy.updateMatrix();
                rivetInstanced.setMatrixAt(rivetIdx++, dummy.matrix);
                
                dummy.position.set(-12 + i*2.6, 5 + j*0.3, -6.2);
                dummy.updateMatrix();
                rivetInstanced.setMatrixAt(rivetIdx++, dummy.matrix);
            }
        }
        chassisGroup.add(rivetInstanced);

        // Ladders
        for(let z of [6.2, -6.2]) {
            for(let i=0; i<12; i++) {
                const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8), aluminum);
                rung.rotation.z = Math.PI/2;
                rung.position.set(-8, 2 + i*0.5, z);
                chassisGroup.add(rung);
            }
        }

        // Grilles
        const grilleGeom = new THREE.BoxGeometry(4, 2, 0.2);
        const grille = new THREE.Mesh(grilleGeom, steel);
        grille.position.set(17, 5, 0);
        grille.rotation.y = Math.PI / 2;
        chassisGroup.add(grille);

        return chassisGroup;
    }

    // 2. Heavy Duty Wheels (Torus + Lugs + Complex Rims)
    function buildWheel(x, y, z) {
        const wheelGroup = new THREE.Group();
        
        // Main Torus (Tire base)
        const tireGeom = new THREE.TorusGeometry(3.5, 1.5, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Treads / Lugs (Extruded BoxGeometry)
        const lugCount = 80;
        const lugGeom = new THREE.BoxGeometry(1.6, 0.4, 0.8);
        const lugInstanced = new THREE.InstancedMesh(lugGeom, rubber, lugCount);
        const dummy = new THREE.Object3D();
        
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const radius = 4.8; // major + minor approx
            dummy.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
            dummy.rotation.z = angle;
            
            // Aggressive alternating off-road tread pattern
            if (i % 2 === 0) {
                dummy.position.z = 0.6;
                dummy.rotation.y = 0.25;
            } else {
                dummy.position.z = -0.6;
                dummy.rotation.y = -0.25;
            }
            dummy.updateMatrix();
            lugInstanced.setMatrixAt(i, dummy.matrix);
        }
        wheelGroup.add(lugInstanced);
        
        // Complex Rims (Cylinder + Spokes)
        const rimGeom = new THREE.CylinderGeometry(2.5, 2.5, 1.8, 32);
        rimGeom.rotateX(Math.PI/2);
        const rim = new THREE.Mesh(rimGeom, aluminum);
        wheelGroup.add(rim);
        
        const spokeCount = 16;
        const spokeGeom = new THREE.CylinderGeometry(0.2, 0.2, 5.0, 16);
        spokeGeom.rotateZ(Math.PI/2);
        const spokeInstanced = new THREE.InstancedMesh(spokeGeom, darkSteel, spokeCount / 2);
        for(let i=0; i<spokeCount/2; i++) {
            const angle = (i / (spokeCount/2)) * Math.PI;
            dummy.position.set(0,0,0);
            dummy.rotation.set(0, 0, angle);
            dummy.updateMatrix();
            spokeInstanced.setMatrixAt(i, dummy.matrix);
        }
        wheelGroup.add(spokeInstanced);
        
        const hubGeom = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 32);
        hubGeom.rotateX(Math.PI/2);
        const hub = new THREE.Mesh(hubGeom, chrome);
        wheelGroup.add(hub);

        wheelGroup.position.set(x, y, z);
        if (z < 0) wheelGroup.rotation.y = Math.PI; // flip right side wheels
        
        meshes.wheels.push(wheelGroup);
        return wheelGroup;
    }

    // 3. Articulating Booms
    function buildBoom(side) {
        const boomGroup = new THREE.Group();
        const zOffset = side === 'left' ? 7.5 : -7.5;
        
        // Boom Arm (Lathed & Extruded combo)
        const armShape = new THREE.Shape();
        armShape.moveTo(0, -1);
        armShape.lineTo(14, -0.5);
        armShape.lineTo(14, 0.5);
        armShape.lineTo(0, 1.5);
        armShape.lineTo(-2, 0);
        armShape.moveTo(0, -1);

        const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const armGeom = new THREE.ExtrudeGeometry(armShape, extrudeSettings);
        armGeom.center();
        const arm = new THREE.Mesh(armGeom, darkSteel);
        arm.position.set(7, 0, 0);
        boomGroup.add(arm);
        
        // Pivot Joint
        const pivot = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32), chrome);
        pivot.rotation.x = Math.PI/2;
        boomGroup.add(pivot);

        // Boom Attach Point for Hydraulics
        const attachPoint = new THREE.Group();
        attachPoint.position.set(5, -1.0, 0); // Local space on the boom
        const attachMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), chrome);
        attachPoint.add(attachMesh);
        boomGroup.add(attachPoint);

        // Sensor Node at the tip
        const nodePoints = [[0,0], [1,1], [1,3], [0.5, 4], [2, 5], [0, 5.5]];
        const node = createLathedShape(nodePoints, neonBlue, 32);
        node.rotation.z = -Math.PI/2;
        node.position.set(14, 0, 0);
        boomGroup.add(node);

        // Hydraulic fluid lines running along boom
        const lineCurve = [
            [0, 1.5, 0.8], [4, 1.0, 0.8], [10, 0.5, 0.8], [13, 0, 0]
        ];
        const hLine = createTube(lineCurve, 0.1, rubber);
        boomGroup.add(hLine);

        boomGroup.position.set(10, 12, zOffset);
        
        meshes.booms.push({ group: boomGroup, attach: attachPoint, side: side });
        return boomGroup;
    }

    // 4. Hydraulic Actuators
    function buildHydraulics(side) {
        const group = new THREE.Group();
        const zOffset = side === 'left' ? 7.5 : -7.5;
        const length = 10;
        
        // Outer Cylinder
        const cylGeom = new THREE.CylinderGeometry(0.6, 0.6, length * 0.6, 32);
        cylGeom.translate(0, length * 0.3, 0);
        const cylinder = new THREE.Mesh(cylGeom, steel);
        group.add(cylinder);
        
        // Inner Rod (Piston)
        const rodGeom = new THREE.CylinderGeometry(0.3, 0.3, length * 0.6, 32);
        rodGeom.translate(0, length * 0.3, 0);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length * 0.3; // default extension
        group.add(rod);
        
        // Hydraulic Supply Lines coiled around cylinder
        const path = [];
        for(let i=0; i<30; i++) {
            const t = i / 30;
            const r = 0.7;
            const y = t * length * 0.5;
            path.push([Math.cos(t * Math.PI * 4) * r, y, Math.sin(t * Math.PI * 4) * r]);
        }
        const line = createTube(path, 0.08, rubber);
        group.add(line);

        // Base Pivot Point
        group.position.set(4, 6, zOffset);
        
        meshes.hydraulics.push({ group, rod, side });
        return group;
    }

    // 5. Operator Command Cabin
    function buildCabin() {
        const cabinGroup = new THREE.Group();
        
        // Cabin Shell
        const shellShape = new THREE.Shape();
        shellShape.moveTo(-3, 0);
        shellShape.lineTo(3, 0);
        shellShape.lineTo(4, 3);
        shellShape.lineTo(2, 5);
        shellShape.lineTo(-2, 5);
        shellShape.lineTo(-3, 0);
        
        const shellGeom = new THREE.ExtrudeGeometry(shellShape, { depth: 6, bevelEnabled: true, bevelSize: 0.2 });
        shellGeom.center();
        const shell = new THREE.Mesh(shellGeom, aluminum);
        cabinGroup.add(shell);
        
        // Tinted Glass Windows
        const windowGeom = new THREE.BoxGeometry(7.2, 3, 5.8);
        const glassMesh = new THREE.Mesh(windowGeom, tinted);
        glassMesh.position.set(0.5, 1.2, 0);
        cabinGroup.add(glassMesh);
        
        // Side Mirrors
        const mirrorGeom = new THREE.BoxGeometry(0.2, 1, 0.5);
        const mirrorL = new THREE.Mesh(mirrorGeom, chrome);
        mirrorL.position.set(2, 1, 3.5);
        mirrorL.rotation.y = Math.PI/6;
        cabinGroup.add(mirrorL);
        
        const mirrorR = new THREE.Mesh(mirrorGeom, chrome);
        mirrorR.position.set(2, 1, -3.5);
        mirrorR.rotation.y = -Math.PI/6;
        cabinGroup.add(mirrorR);

        // Interior Control Panels (visible through glass)
        const panelGeom = new THREE.BoxGeometry(2, 1.5, 4);
        const panel = new THREE.Mesh(panelGeom, darkSteel);
        panel.position.set(1.5, 0, 0);
        panel.rotation.z = -Math.PI/8;
        cabinGroup.add(panel);

        // Glowing Screens on Panel
        for(let i=0; i<4; i++) {
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), screenGlow);
            screen.position.set(2.3, 0.5, -1.5 + i*1.0);
            screen.rotation.y = Math.PI/2;
            screen.rotation.x = -Math.PI/8;
            cabinGroup.add(screen);
        }

        cabinGroup.position.set(8, 13, 0);
        return cabinGroup;
    }

    // 6. Wave Propagation Tank (The core simulation chamber)
    function buildTank() {
        const tankGroup = new THREE.Group();
        
        // Massive Glass Cylinder
        const tankGeom = new THREE.CylinderGeometry(5, 5, 18, 32);
        tankGeom.rotateZ(Math.PI/2);
        const glassTank = new THREE.Mesh(tankGeom, glass);
        tankGroup.add(glassTank);
        
        // Steel Ribs
        for(let i=-8; i<=8; i+=4) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(5.1, 0.3, 16, 64), steel);
            rib.rotation.y = Math.PI/2;
            rib.position.x = i;
            tankGroup.add(rib);
        }
        
        // Containment Caps
        const capGeom = new THREE.CylinderGeometry(5.2, 5.2, 1, 32);
        capGeom.rotateZ(Math.PI/2);
        const capL = new THREE.Mesh(capGeom, darkSteel);
        capL.position.x = 9.5;
        tankGroup.add(capL);
        
        const capR = new THREE.Mesh(capGeom, darkSteel);
        capR.position.x = -9.5;
        tankGroup.add(capR);

        // Diagnostic Rings (Rotating outside the tank)
        const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.2, 16, 64), neonBlue);
        ring.rotation.y = Math.PI/2;
        tankGroup.add(ring);
        meshes.radar = ring;

        tankGroup.position.set(-6, 15, 0);
        return tankGroup;
    }

    // 7. Transducer Emitter Array (Inside Tank)
    function buildEmitterArray() {
        const arrayGroup = new THREE.Group();
        
        // Main Cone Emitter
        const points = [[0,0], [4,2], [4,4], [1,5], [0,5]];
        const cone = createLathedShape(points, chrome, 32);
        cone.rotation.z = -Math.PI/2;
        cone.position.x = 7.5;
        arrayGroup.add(cone);
        
        // Array of smaller peripheral transducers
        const peripheralGeom = new THREE.ConeGeometry(0.5, 2, 16);
        peripheralGeom.rotateZ(-Math.PI/2);
        const peripheralInstanced = new THREE.InstancedMesh(peripheralGeom, copper, 12);
        const dummy = new THREE.Object3D();
        
        for(let i=0; i<12; i++) {
            const angle = (i/12) * Math.PI * 2;
            dummy.position.set(7.5, Math.cos(angle)*3, Math.sin(angle)*3);
            dummy.rotation.x = angle;
            // Angle them slightly inwards
            dummy.rotation.y = -0.2; 
            dummy.updateMatrix();
            peripheralInstanced.setMatrixAt(i, dummy.matrix);
        }
        arrayGroup.add(peripheralInstanced);

        arrayGroup.position.set(-6, 15, 0); // Same center as tank
        return arrayGroup;
    }

    // 8. Non-Linear Medium Lattice (InstancedMesh for Wave Physics)
    function buildMediumLattice() {
        const latticeGroup = new THREE.Group();
        
        const gridX = 30; // Length
        const gridY = 10; // Height
        const gridZ = 10; // Width
        const spacingX = 0.5;
        const spacingYZ = 0.7;
        const totalInstances = gridX * gridY * gridZ;
        
        // Extremely complex shape instead of a cube
        const particleGeom = new THREE.IcosahedronGeometry(0.15, 0); 
        
        // Exotic glowing medium material
        const mediumMat = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff, transmission: 0.9, opacity: 1, metalness: 0.2, roughness: 0.1, ior: 1.5, emissive: 0x002244, emissiveIntensity: 0.8
        });
        
        const instancedMesh = new THREE.InstancedMesh(particleGeom, mediumMat, totalInstances);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        
        const particleData = [];
        let index = 0;
        const dummy = new THREE.Object3D();
        
        for (let x = 0; x < gridX; x++) {
            for (let y = 0; y < gridY; y++) {
                for (let z = 0; z < gridZ; z++) {
                    const px = (x - gridX/2) * spacingX;
                    const py = (y - gridY/2) * spacingYZ;
                    const pz = (z - gridZ/2) * spacingYZ;
                    
                    dummy.position.set(px, py, pz);
                    dummy.updateMatrix();
                    instancedMesh.setMatrixAt(index, dummy.matrix);
                    
                    particleData.push({ x: px, y: py, z: pz, index: index });
                    index++;
                }
            }
        }
        
        latticeGroup.add(instancedMesh);
        latticeGroup.position.set(-6, 15, 0); // Inside the tank
        
        meshes.lattice = { instancedMesh, particleData, dummy, gridX, spacingX };
        return latticeGroup;
    }

    // 9. Exhaust and Cooling Matrix
    function buildExhausts() {
        const group = new THREE.Group();
        
        // Massive Exhaust Stacks
        for(let z of [3, -3]) {
            const stackShape = [[1,0], [1.2, 5], [1.5, 6], [1.3, 8], [1, 8]];
            const stack = createLathedShape(stackShape, darkSteel, 16);
            stack.position.set(0, 10, z);
            group.add(stack);
        }
        
        // Radiator Fans
        const fanHousingGeom = new THREE.BoxGeometry(2, 4, 4);
        const fanHousing = new THREE.Mesh(fanHousingGeom, steel);
        fanHousing.position.set(-2, 12, 0);
        group.add(fanHousing);
        
        const fanGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 16);
        fanGeom.rotateZ(Math.PI/2);
        
        for(let z of [0]) { // could add more
            const fan = new THREE.Mesh(fanGeom, aluminum);
            fan.position.set(-1.8, 12, z);
            group.add(fan);
            meshes.fans.push(fan); // For animation
        }

        // Plasma Confinement Coils (Power Generation)
        const coilGeom = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8);
        const coil1 = new THREE.Mesh(coilGeom, plasmaGlow);
        coil1.position.set(-2, 16, 0);
        coil1.rotation.x = Math.PI/2;
        group.add(coil1);

        return group;
    }

    // 10. Particle System (Exhaust Smoke)
    function buildSmoke() {
        const particleCount = 300;
        const particleGeom = new THREE.BufferGeometry();
        const particlePos = new Float32Array(particleCount * 3);
        const particleData = [];
        
        for(let i=0; i<particleCount; i++) {
            particlePos[i*3] = (Math.random() - 0.5) * 2;
            particlePos[i*3+1] = Math.random() * 5 + 18; // Start above exhausts
            particlePos[i*3+2] = (Math.random() - 0.5) * 6;
            
            particleData.push({
                xVel: (Math.random() - 0.5) * 0.5,
                yVel: Math.random() * 2.0 + 1.0,
                zVel: (Math.random() - 0.5) * 0.5,
                life: Math.random() * 100
            });
        }
        
        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x333333, size: 1.2, transparent: true, opacity: 0.4, depthWrite: false
        });
        
        const smoke = new THREE.Points(particleGeom, particleMat);
        meshes.particles = { mesh: smoke, data: particleData, posArray: particlePos };
        return smoke;
    }

    // ==========================================
    // ASSEMBLY
    // ==========================================
    const pChassis = buildChassis(); group.add(pChassis);
    
    // Wheels (6-wheel drive crawler)
    const pW_FL = buildWheel(12, 4.8, 7.5); group.add(pW_FL);
    const pW_FR = buildWheel(12, 4.8, -7.5); group.add(pW_FR);
    const pW_ML = buildWheel(0, 4.8, 7.5); group.add(pW_ML);
    const pW_MR = buildWheel(0, 4.8, -7.5); group.add(pW_MR);
    const pW_RL = buildWheel(-12, 4.8, 7.5); group.add(pW_RL);
    const pW_RR = buildWheel(-12, 4.8, -7.5); group.add(pW_RR);
    
    // Booms & Hydraulics
    const pBoomL = buildBoom('left'); group.add(pBoomL);
    const pBoomR = buildBoom('right'); group.add(pBoomR);
    const pHydL = buildHydraulics('left'); group.add(pHydL);
    const pHydR = buildHydraulics('right'); group.add(pHydR);
    
    const pCabin = buildCabin(); group.add(pCabin);
    const pTank = buildTank(); group.add(pTank);
    const pEmitter = buildEmitterArray(); group.add(pEmitter);
    const pLattice = buildMediumLattice(); group.add(pLattice);
    const pExhaust = buildExhausts(); group.add(pExhaust);
    const pSmoke = buildSmoke(); group.add(pSmoke);

    // ==========================================
    // PARTS ARRAY DEFINITION
    // ==========================================
    parts.push({
        name: "CrawlerChassis_Main",
        description: "Massive ultra-reinforced hex-chassis designed to withstand extreme non-linear acoustic shockwave recoil.",
        material: "darkSteel / steel",
        function: "Structural foundation and vibration dampening.",
        assemblyOrder: 1,
        connections: ["Wheel_FrontLeft", "WavePropagationTank", "HydraulicActuator_Left"],
        failureEffect: "Catastrophic structural collapse resulting in simulation vessel breach.",
        cascadeFailures: ["WavePropagationTank", "OperatorCommandCabin"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // Register all 6 wheels
    const wheelNames = ["Wheel_FrontLeft", "Wheel_FrontRight", "Wheel_MidLeft", "Wheel_MidRight", "Wheel_RearLeft", "Wheel_RearRight"];
    const wheelRefs = [pW_FL, pW_FR, pW_ML, pW_MR, pW_RL, pW_RR];
    for(let i=0; i<6; i++) {
        parts.push({
            name: wheelNames[i],
            description: "Heavy-duty Torus-geometry tires with extruded lug treads for navigating hostile Martian/Exotic terrains.",
            material: "rubber / aluminum / chrome",
            function: "Mobility and primary ground insulation.",
            assemblyOrder: 2 + i,
            connections: ["CrawlerChassis_Main"],
            failureEffect: "Loss of mobility, uneven simulation leveling causing fluid vector errors.",
            cascadeFailures: ["CrawlerChassis_Main"],
            originalPosition: { x: wheelRefs[i].position.x, y: wheelRefs[i].position.y, z: wheelRefs[i].position.z },
            explodedPosition: { x: wheelRefs[i].position.x * 2, y: -10, z: wheelRefs[i].position.z * 2 }
        });
    }

    parts.push({
        name: "ArticulatingBoom_Left",
        description: "Precision-lathed structural arm housing diagnostic sensory arrays.",
        material: "darkSteel / chrome",
        function: "Positions sensor nodes dynamically within external shockwave interference zones.",
        assemblyOrder: 8,
        connections: ["CrawlerChassis_Main", "HydraulicActuator_Left", "DiagnosticSensorNodes"],
        failureEffect: "Loss of external phase calibration data.",
        cascadeFailures: ["DiagnosticSensorNodes"],
        originalPosition: { x: pBoomL.position.x, y: pBoomL.position.y, z: pBoomL.position.z },
        explodedPosition: { x: pBoomL.position.x, y: pBoomL.position.y + 15, z: pBoomL.position.z + 10 }
    });

    parts.push({
        name: "ArticulatingBoom_Right",
        description: "Precision-lathed structural arm housing diagnostic sensory arrays.",
        material: "darkSteel / chrome",
        function: "Positions sensor nodes dynamically within external shockwave interference zones.",
        assemblyOrder: 9,
        connections: ["CrawlerChassis_Main", "HydraulicActuator_Right", "DiagnosticSensorNodes"],
        failureEffect: "Loss of external phase calibration data.",
        cascadeFailures: ["DiagnosticSensorNodes"],
        originalPosition: { x: pBoomR.position.x, y: pBoomR.position.y, z: pBoomR.position.z },
        explodedPosition: { x: pBoomR.position.x, y: pBoomR.position.y + 15, z: pBoomR.position.z - 10 }
    });

    parts.push({
        name: "HydraulicActuator_Left",
        description: "Heavy-duty hydraulic cylinder synchronized perfectly with boom articulation.",
        material: "steel / chrome / rubber",
        function: "Drives and stabilizes the massive boom arm.",
        assemblyOrder: 10,
        connections: ["CrawlerChassis_Main", "ArticulatingBoom_Left"],
        failureEffect: "Boom collapse, potential crushing of chassis components.",
        cascadeFailures: ["ArticulatingBoom_Left", "OperatorCommandCabin"],
        originalPosition: { x: pHydL.position.x, y: pHydL.position.y, z: pHydL.position.z },
        explodedPosition: { x: pHydL.position.x + 5, y: pHydL.position.y + 10, z: pHydL.position.z + 5 }
    });

    parts.push({
        name: "HydraulicActuator_Right",
        description: "Heavy-duty hydraulic cylinder synchronized perfectly with boom articulation.",
        material: "steel / chrome / rubber",
        function: "Drives and stabilizes the massive boom arm.",
        assemblyOrder: 11,
        connections: ["CrawlerChassis_Main", "ArticulatingBoom_Right"],
        failureEffect: "Boom collapse, potential crushing of chassis components.",
        cascadeFailures: ["ArticulatingBoom_Right", "OperatorCommandCabin"],
        originalPosition: { x: pHydR.position.x, y: pHydR.position.y, z: pHydR.position.z },
        explodedPosition: { x: pHydR.position.x + 5, y: pHydR.position.y + 10, z: pHydR.position.z - 5 }
    });

    parts.push({
        name: "OperatorCommandCabin",
        description: "Shielded hub featuring tinted glass and multiple emissive control screens.",
        material: "aluminum / tinted glass / darkSteel",
        function: "Protects human operators from 200dB+ acoustic shockwaves.",
        assemblyOrder: 12,
        connections: ["CrawlerChassis_Main"],
        failureEffect: "Operator liquefaction due to extreme acoustic pressure.",
        cascadeFailures: [],
        originalPosition: { x: pCabin.position.x, y: pCabin.position.y, z: pCabin.position.z },
        explodedPosition: { x: pCabin.position.x, y: pCabin.position.y + 20, z: pCabin.position.z }
    });

    parts.push({
        name: "WavePropagationTank",
        description: "Massive glass containment vessel holding the exotic non-linear fluid medium.",
        material: "glass / steel / neonBlue",
        function: "Provides a controlled vacuum/fluid environment for wave observation.",
        assemblyOrder: 13,
        connections: ["CrawlerChassis_Main", "TransducerEmitterArray", "NonLinearMediumLattice"],
        failureEffect: "Explosive decompression and exotic fluid spill.",
        cascadeFailures: ["NonLinearMediumLattice", "TransducerEmitterArray"],
        originalPosition: { x: pTank.position.x, y: pTank.position.y, z: pTank.position.z },
        explodedPosition: { x: pTank.position.x, y: pTank.position.y + 25, z: pTank.position.z }
    });

    parts.push({
        name: "TransducerEmitterArray",
        description: "Complex lathed cone array that generates initial broadband wave packets.",
        material: "chrome / copper",
        function: "Initiates the high-energy acoustic pulse.",
        assemblyOrder: 14,
        connections: ["WavePropagationTank"],
        failureEffect: "Inability to spawn shockwaves; simulation failure.",
        cascadeFailures: ["NonLinearMediumLattice"],
        originalPosition: { x: pEmitter.position.x, y: pEmitter.position.y, z: pEmitter.position.z },
        explodedPosition: { x: pEmitter.position.x + 15, y: pEmitter.position.y, z: pEmitter.position.z }
    });

    parts.push({
        name: "NonLinearMediumLattice",
        description: "A colossal 3,000-node InstancedMesh lattice simulating the physical particles of an exotic medium under extreme pressure.",
        material: "neonCyan / customPhysical",
        function: "Visualizes the Westervelt non-linear wave equation in real time.",
        assemblyOrder: 15,
        connections: ["WavePropagationTank"],
        failureEffect: "Diagnostic blindness.",
        cascadeFailures: [],
        originalPosition: { x: pLattice.position.x, y: pLattice.position.y, z: pLattice.position.z },
        explodedPosition: { x: pLattice.position.x, y: pLattice.position.y + 30, z: pLattice.position.z }
    });

    parts.push({
        name: "ExhaustAndCoolingMatrix",
        description: "Massive cooling fans and lathed exhaust stacks for dissipating immense thermal energy generated by acoustic transducers.",
        material: "darkSteel / steel / aluminum",
        function: "Thermal regulation and plasma venting.",
        assemblyOrder: 16,
        connections: ["CrawlerChassis_Main"],
        failureEffect: "Transducer meltdown.",
        cascadeFailures: ["TransducerEmitterArray"],
        originalPosition: { x: pExhaust.position.x, y: pExhaust.position.y, z: pExhaust.position.z },
        explodedPosition: { x: pExhaust.position.x - 15, y: pExhaust.position.y + 15, z: pExhaust.position.z }
    });


    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Regarding non-linear acoustic wave propagation in a fluid medium, which phenomenon is primarily responsible for the formation of a shock front over distance?",
            options: [
                "The dependence of local sound speed on particle velocity and the non-linear equation of state.",
                "The linear superposition of infinite harmonic frequencies.",
                "The perfectly adiabatic expansion of the fluid without entropy changes.",
                "The viscous dampening of high-frequency components by the medium."
            ],
            correctAnswer: 0,
            explanation: "In non-linear acoustics, local sound speed increases with pressure/density. Wave peaks travel faster than troughs, causing the waveform to steepen and form a discontinuous shock front."
        },
        {
            question: "In the context of Mach reflection of acoustic shock waves intersecting a rigid boundary, what precisely defines the 'triple point'?",
            options: [
                "The point where temperature, pressure, and density are identical.",
                "The intersection of the incident shock, the reflected shock, and the Mach stem.",
                "The spatial coordinate where three continuous wave packets perfectly cancel out.",
                "The focal point of a parabolic transducer array."
            ],
            correctAnswer: 1,
            explanation: "When a shock wave hits a surface at a glancing angle, regular reflection transitions to Mach reflection. The incident shock, reflected shock, and a newly formed perpendicular shock (the Mach stem) meet at the triple point."
        },
        {
            question: "How does acoustic dispersion affect a broad-band wave packet traveling through a highly dispersive exotic medium?",
            options: [
                "The wave packet amplifies infinitely due to resonance.",
                "The wave packet instantly collapses into a singularity.",
                "The wave packet spreads out in space and time because different frequency components travel at different phase velocities.",
                "The wave packet's group velocity exceeds the speed of light."
            ],
            correctAnswer: 2,
            explanation: "Dispersion means wave speed depends on frequency. A wave packet contains many frequencies, so they travel at different speeds, causing the packet to spread out (disperse) as it travels."
        },
        {
            question: "When modeling non-linear acoustic propagation with thermoviscous attenuation, the Westervelt equation is commonly used. What does the non-linear term (β / ρ₀c₀⁴) * (∂²p²/∂t²) represent?",
            options: [
                "Linear attenuation due to fluid viscosity.",
                "The cumulative non-linear distortion causing wave steepening, parameterized by the coefficient of non-linearity β.",
                "The gravitational effects on the acoustic wave.",
                "The rate of heat transfer out of the acoustic beam."
            ],
            correctAnswer: 1,
            explanation: "This term captures the non-linear self-interaction of the pressure wave, which leads to harmonic generation and shock formation over propagation distance."
        },
        {
            question: "During wave propagation in a turbulent fluid flow, how does the turbulence primarily affect the coherence of the transmitted acoustic wave?",
            options: [
                "It perfectly aligns the phase of all wave components.",
                "It has zero effect on acoustic waves below 100 kHz.",
                "It causes phase and amplitude fluctuations (scintillations) due to random scattering and refraction by turbulent eddies.",
                "It converts all acoustic energy directly into electromagnetic radiation."
            ],
            correctAnswer: 2,
            explanation: "Turbulent eddies act as moving, random lenses with varying sound speeds. They scatter and refract the acoustic wave, degrading spatial and temporal coherence, resulting in scintillations."
        }
    ];

    // ==========================================
    // ANIMATION LOOP (God-Tier Wave Physics)
    // ==========================================
    function animate(time, speed, activeMeshes = meshes) {
        const t = time * speed;
        
        // 1. Crawler Wheel Rotation
        activeMeshes.wheels.forEach(wheel => {
            wheel.rotation.z = -t * 2.0;
        });

        // 2. Articulate Booms (Sine Wave sweep)
        // Range 0 to 0.8 radians
        const boomAngle = Math.sin(t * 0.8) * 0.4 + 0.4;
        
        // 3. Synchronize Hydraulics perfectly with Booms
        activeMeshes.booms.forEach(boomData => {
            const boom = boomData.group;
            const attach = boomData.attach;
            const side = boomData.side;
            
            // Apply rotation to boom
            boom.rotation.z = side === 'left' ? boomAngle : -boomAngle;
            
            // Find corresponding hydraulic
            const hydData = activeMeshes.hydraulics.find(h => h.side === side);
            if (hydData) {
                const hydGroup = hydData.group;
                const hydRod = hydData.rod;
                
                // Get world positions
                boom.updateMatrixWorld();
                const attachWorld = attach.getWorldPosition(new THREE.Vector3());
                const baseWorld = hydGroup.parent ? hydGroup.parent.localToWorld(hydGroup.position.clone()) : hydGroup.position.clone();
                
                // Point hydraulic cylinder at attach point
                hydGroup.lookAt(attachWorld);
                hydGroup.rotateX(Math.PI/2); // Re-orient cylinder's local Y axis
                
                // Calculate distance and adjust rod extension
                const dist = baseWorld.distanceTo(attachWorld);
                // The base cylinder is length 6 (10 * 0.6). We slide rod out based on distance.
                hydRod.position.y = dist / 2;
            }
        });

        // 4. Spin Cooling Fans and Radar
        activeMeshes.fans.forEach(fan => {
            fan.rotation.y = t * 15.0;
        });
        if (activeMeshes.radar) {
            activeMeshes.radar.rotation.z = t * 3.0;
            activeMeshes.radar.rotation.x = Math.sin(t * 2.0) * 0.2;
        }

        // 5. Pulse Neon Emissive Materials
        const pulse = (Math.sin(t * 5.0) + 1.0) * 0.5;
        activeMeshes.neonMaterials.forEach(mat => {
            mat.emissiveIntensity = 1.0 + pulse * 2.0;
        });

        // 6. Update Exhaust Smoke Particles
        if (activeMeshes.particles) {
            const pData = activeMeshes.particles.data;
            const pos = activeMeshes.particles.posArray;
            for(let i=0; i<pData.length; i++) {
                pData[i].life += 1;
                pos[i*3] += pData[i].xVel;
                pos[i*3+1] += pData[i].yVel;
                pos[i*3+2] += pData[i].zVel;
                
                // Reset if died
                if (pData[i].life > 100 || pos[i*3+1] > 40) {
                    pData[i].life = 0;
                    pos[i*3] = (Math.random() - 0.5) * 2;
                    pos[i*3+1] = Math.random() * 2 + 10;
                    pos[i*3+2] = (Math.random() - 0.5) * 6;
                }
            }
            activeMeshes.particles.mesh.geometry.attributes.position.needsUpdate = true;
        }

        // 7. MASSIVE NON-LINEAR WAVE EQUATION SIMULATION (InstancedMesh)
        if (activeMeshes.lattice) {
            const { instancedMesh, particleData, dummy, gridX, spacingX } = activeMeshes.lattice;
            
            // Simulating an explosive shockwave originating from the Transducer array
            // Source is at the right end of the lattice
            const sourceX = (gridX / 2) * spacingX; 
            
            const k = 2.5; // wave number
            const w = 8.0; // angular frequency
            
            for(let i=0; i < particleData.length; i++) {
                const pd = particleData[i];
                
                // Distance from point source (Transducer tip)
                const dx = pd.x - sourceX;
                const dy = pd.y;
                const dz = pd.z;
                const r = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Phase with non-linear distortion factor (higher amplitude = faster speed = wave steepening)
                const basePhase = k * r - w * t;
                
                // Fourier series approximation of a steepening N-wave (shock front)
                // Adds higher harmonics based on distance traveled
                const nonLinearSteepening = Math.sin(basePhase) 
                                          + 0.4 * Math.sin(2 * basePhase) * (r * 0.1)
                                          + 0.15 * Math.sin(3 * basePhase) * (r * 0.1);
                
                // Geometric spreading (1/r amplitude decay)
                const amplitude = 3.0 / (1.0 + r * 0.3);
                
                // Apply displacement
                const displacement = amplitude * nonLinearSteepening;
                
                // Mach Stem Approximation at boundary (z edges)
                let machEffect = 0;
                if (Math.abs(pd.z) > 2.5) {
                    machEffect = Math.max(0, displacement * 0.5) * Math.sin(t*10); 
                }

                const finalY = pd.y + displacement + machEffect;
                
                // Scale particles based on pressure (density)
                const scale = 1.0 + Math.max(-0.5, displacement * 0.4);
                
                dummy.position.set(pd.x, finalY, pd.z);
                dummy.scale.set(scale, scale, scale);
                
                // Torsional twist representing fluid vorticity
                dummy.rotation.x = displacement;
                dummy.rotation.y = r * 0.2 - t;
                dummy.rotation.z = machEffect;
                
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(pd.index, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticsWavePropagation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
