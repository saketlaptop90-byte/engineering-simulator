import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    
    // ============================================================================
    // ADVANCED HIGH-TECH NEON / GLOWING MATERIALS (Time Crystal & Ethereal Effects)
    // ============================================================================
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 3.5,
        transparent: true, opacity: 0.85, transmission: 0.9, ior: 2.7,
        metalness: 0.3, roughness: 0.1, clearcoat: 1.0
    });

    const neonMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff, emissive: 0xaa00ff, emissiveIntensity: 4.0,
        transparent: true, opacity: 0.9, transmission: 0.8, ior: 2.4,
        metalness: 0.5, roughness: 0.2
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800, emissive: 0xff5500, emissiveIntensity: 5.0,
        transparent: true, opacity: 0.9
    });

    const etherealBeamMat = new THREE.MeshStandardMaterial({
        color: 0x88ffff, emissive: 0x00ffff, emissiveIntensity: 2.0,
        transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending,
        depthWrite: false, side: THREE.DoubleSide
    });

    const ghostMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 1.0,
        transparent: true, opacity: 0.15, wireframe: true
    });

    const screenMat1 = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    const screenMat2 = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const screenMat3 = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2 });

    // ============================================================================
    // GEOMETRY GENERATOR FUNCTIONS FOR MAXIMUM COMPLEXITY
    // ============================================================================
    
    // 1. Create a massive off-road tire with hundreds of individual treads
    function createWheel(x, y, z, scale) {
        const wheelGroup = new THREE.Group();
        
        // Main Tire using Torus
        const tireGeom = new THREE.TorusGeometry(12, 5, 32, 120);
        const tireMesh = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tireMesh);

        // Aggressive Treads (Hundreds of tiny extruded BoxGeometries)
        const lugCount = 72;
        const lugGeom = new THREE.BoxGeometry(3.5, 2.0, 9);
        for(let i=0; i<lugCount; i++) {
            const angle = (i/lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(angle) * 16.5, Math.sin(angle) * 16.5, 0);
            lug.rotation.z = angle;
            wheelGroup.add(lug);
        }

        // Rim Cylinder
        const rimGeom = new THREE.CylinderGeometry(9, 9, 6, 32);
        rimGeom.rotateX(Math.PI/2);
        const rimMesh = new THREE.Mesh(rimGeom, darkSteel);
        wheelGroup.add(rimMesh);

        // Complex Spoke Array
        const spokeCount = 16;
        const spokeGeom = new THREE.CylinderGeometry(0.5, 1.2, 9, 16);
        for(let i=0; i<spokeCount; i++) {
            const angle = (i/spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.position.set(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 0);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI/2;
            wheelGroup.add(spoke);
        }

        // Hub/Axle Cap
        const hubGeom = new THREE.CylinderGeometry(2, 3, 8, 16);
        hubGeom.rotateX(Math.PI/2);
        const hubMesh = new THREE.Mesh(hubGeom, chrome);
        wheelGroup.add(hubMesh);
        
        // Inner Braking Rotor
        const rotorGeom = new THREE.CylinderGeometry(7, 7, 0.5, 32);
        rotorGeom.rotateX(Math.PI/2);
        const rotorMesh = new THREE.Mesh(rotorGeom, steel);
        rotorMesh.position.z = -3.5;
        wheelGroup.add(rotorMesh);

        // Caliper (Painted plastic caliper)
        const caliperGeom = new THREE.BoxGeometry(4, 2, 2);
        const caliperMesh = new THREE.Mesh(caliperGeom, plastic); 
        caliperMesh.position.set(5, 5, -3.5);
        caliperMesh.rotation.z = Math.PI/4;
        wheelGroup.add(caliperMesh);

        // Bolting details on the hub
        const boltGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
        boltGeom.rotateX(Math.PI/2);
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeom, steel);
            bolt.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 4);
            wheelGroup.add(bolt);
        }

        wheelGroup.position.set(x, y, z);
        wheelGroup.scale.set(scale, scale, scale);
        
        return wheelGroup;
    }

    // 2. Create advanced operator cabin
    function createCabin(x, y, z) {
        const cabinGroup = new THREE.Group();
        
        // Main shell extrude
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(30, 0);
        shape.lineTo(35, 12);
        shape.lineTo(20, 25);
        shape.lineTo(0, 25);
        shape.lineTo(-8, 12);
        shape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 6, steps: 3, bevelSize: 1.5, bevelThickness: 1.5 };
        const shellGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const shellMesh = new THREE.Mesh(shellGeom, darkSteel);
        shellMesh.position.z = -10;
        cabinGroup.add(shellMesh);

        // Tinted Glass Windows - Front
        const windowFrontGeom = new THREE.PlaneGeometry(16, 12);
        const windowFront = new THREE.Mesh(windowFrontGeom, tinted);
        windowFront.position.set(28, 18, 0);
        windowFront.rotation.y = Math.PI/2;
        windowFront.rotation.x = -Math.PI/6;
        cabinGroup.add(windowFront);
        
        // Tinted Glass Windows - Side Left
        const windowSideGeom = new THREE.PlaneGeometry(15, 10);
        const windowLeft = new THREE.Mesh(windowSideGeom, tinted);
        windowLeft.position.set(12, 18, 10.1);
        cabinGroup.add(windowLeft);

        // Tinted Glass Windows - Side Right
        const windowRight = new THREE.Mesh(windowSideGeom, tinted);
        windowRight.position.set(12, 18, -10.1);
        windowRight.rotation.y = Math.PI;
        cabinGroup.add(windowRight);

        // Glowing Control Screens inside cabin
        const screenGeom = new THREE.BoxGeometry(5, 3.5, 0.2);
        
        const screen1 = new THREE.Mesh(screenGeom, screenMat1);
        screen1.position.set(22, 12, 6);
        screen1.rotation.y = Math.PI/3;
        cabinGroup.add(screen1);
        
        const screen2 = new THREE.Mesh(screenGeom, screenMat2);
        screen2.position.set(22, 12, -6);
        screen2.rotation.y = -Math.PI/3;
        cabinGroup.add(screen2);

        const screen3 = new THREE.Mesh(screenGeom, screenMat3);
        screen3.position.set(24, 14, 0);
        screen3.rotation.y = Math.PI/2;
        screen3.rotation.x = -Math.PI/8;
        cabinGroup.add(screen3);

        // Steering joysticks (Dual)
        const stickGeom = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
        const stickLeft = new THREE.Mesh(stickGeom, chrome);
        stickLeft.position.set(18, 8, 4);
        stickLeft.rotation.z = Math.PI/8;
        cabinGroup.add(stickLeft);

        const stickRight = new THREE.Mesh(stickGeom, chrome);
        stickRight.position.set(18, 8, -4);
        stickRight.rotation.z = Math.PI/8;
        cabinGroup.add(stickRight);

        // Side mirrors
        const mirrorArmGeom = new THREE.CylinderGeometry(0.3, 0.3, 6);
        mirrorArmGeom.rotateX(Math.PI/2);
        
        const mirrorArmLeft = new THREE.Mesh(mirrorArmGeom, steel);
        mirrorArmLeft.position.set(20, 15, 13);
        cabinGroup.add(mirrorArmLeft);
        
        const mirrorGeom = new THREE.BoxGeometry(1.5, 4, 3);
        const mirrorLeft = new THREE.Mesh(mirrorGeom, chrome);
        mirrorLeft.position.set(20, 15, 16);
        cabinGroup.add(mirrorLeft);

        const mirrorArmRight = new THREE.Mesh(mirrorArmGeom, steel);
        mirrorArmRight.position.set(20, 15, -13);
        cabinGroup.add(mirrorArmRight);
        
        const mirrorRight = new THREE.Mesh(mirrorGeom, chrome);
        mirrorRight.position.set(20, 15, -16);
        cabinGroup.add(mirrorRight);

        // Roof AC Unit
        const acGeom = new THREE.BoxGeometry(12, 4, 10);
        const acMesh = new THREE.Mesh(acGeom, aluminum);
        acMesh.position.set(10, 27, 0);
        cabinGroup.add(acMesh);
        
        // Roof AC Fans
        const fanGeom = new THREE.CylinderGeometry(3, 3, 4.2, 16);
        const fanMesh = new THREE.Mesh(fanGeom, darkSteel);
        fanMesh.position.set(10, 27, 0);
        cabinGroup.add(fanMesh);

        cabinGroup.position.set(x, y, z);
        return cabinGroup;
    }

    // 3. Create hydraulic stabilization piston
    function createHydraulicPiston(len, radius, x, y, z, rx, ry, rz) {
        const pistonGroup = new THREE.Group();
        
        // Cylinder base (Housing)
        const baseGeom = new THREE.CylinderGeometry(radius, radius, len/2, 32);
        baseGeom.translate(0, len/4, 0);
        const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
        pistonGroup.add(baseMesh);

        // Inner rod
        const rodGeom = new THREE.CylinderGeometry(radius*0.6, radius*0.6, len/2 + 5, 32);
        rodGeom.translate(0, len*0.75, 0);
        const rodMesh = new THREE.Mesh(rodGeom, chrome);
        pistonGroup.add(rodMesh);
        
        // Fluid hose connectors
        const connectorGeom = new THREE.BoxGeometry(radius*2.5, radius*2, radius*2.5);
        const connector1 = new THREE.Mesh(connectorGeom, steel);
        connector1.position.set(0, len/4, 0);
        pistonGroup.add(connector1);

        const connector2 = new THREE.Mesh(connectorGeom, steel);
        connector2.position.set(0, len/8, 0);
        connector2.rotation.y = Math.PI/4;
        pistonGroup.add(connector2);
        
        // Mount pins
        const pinGeom = new THREE.CylinderGeometry(radius*0.8, radius*0.8, radius*3, 16);
        pinGeom.rotateZ(Math.PI/2);
        const pin1 = new THREE.Mesh(pinGeom, darkSteel);
        pin1.position.set(0, 2, 0);
        pistonGroup.add(pin1);
        
        const pin2 = new THREE.Mesh(pinGeom, darkSteel);
        pin2.position.set(0, len, 0);
        pistonGroup.add(pin2);

        pistonGroup.position.set(x, y, z);
        pistonGroup.rotation.set(rx, ry, rz);
        return pistonGroup;
    }

    // 4. Create the core Tesseract Time Crystal
    function createTimeCrystalCore(x, y, z) {
        const coreGroup = new THREE.Group();
        meshes.tesseracts = [];
        meshes.crystalNodes = [];

        // Nested Icosahedrons (hyper-fractal illusion)
        for(let i=0; i<6; i++) {
            const size = 15 + i*5;
            const geom = new THREE.IcosahedronGeometry(size, 1);
            // Alternate neon cyan, magenta, and wireframe ghost
            let mat = neonCyan;
            if (i % 3 === 1) mat = neonMagenta;
            if (i % 3 === 2) mat = ghostMat;

            const mesh = new THREE.Mesh(geom, mat);
            coreGroup.add(mesh);
            meshes.tesseracts.push({ 
                mesh, 
                speed: 0.2 + i*0.15, 
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                baseScale: 1.0,
                pulseSpeed: 1.0 + Math.random()
            });
        }
        
        // Absolute Inner Core - Dense Octahedron
        const innerGeom = new THREE.OctahedronGeometry(12, 2);
        const innerMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 6.0, transparent: true, opacity: 1.0 });
        const innerMesh = new THREE.Mesh(innerGeom, innerMat);
        coreGroup.add(innerMesh);
        meshes.tesseracts.push({ mesh: innerMesh, speed: 3.0, axis: new THREE.Vector3(0, 1, 0), baseScale: 1.0, pulseSpeed: 5.0 });

        // Orbiting ethereal fragments (discrete time shards)
        const fragGeom = new THREE.TetrahedronGeometry(3, 1);
        for(let i=0; i<30; i++) {
            const frag = new THREE.Mesh(fragGeom, Math.random() > 0.5 ? neonCyan : neonOrange);
            const orbitRadius = 45 + Math.random()*25;
            const orbitSpeed = (Math.random() - 0.5) * 3;
            const orbitPhase = Math.random() * Math.PI * 2;
            coreGroup.add(frag);
            meshes.crystalNodes.push({ 
                mesh: frag, 
                radius: orbitRadius, 
                speed: orbitSpeed, 
                phase: orbitPhase, 
                yOffset: (Math.random()-0.5)*40,
                baseY: (Math.random()-0.5)*40
            });
        }

        // Temporal Containment Rings
        meshes.containmentRings = [];
        for(let i=0; i<5; i++) {
            const ringGeom = new THREE.TorusGeometry(55 + i*8, 2, 32, 100);
            const ringMesh = new THREE.Mesh(ringGeom, darkSteel);
            
            // Add tiny emitters on the rings
            for(let j=0; j<24; j++) {
                const emitterGeom = new THREE.BoxGeometry(3, 3, 6);
                const emitter = new THREE.Mesh(emitterGeom, neonOrange);
                const angle = (j/24) * Math.PI * 2;
                emitter.position.set(Math.cos(angle)*(55+i*8), Math.sin(angle)*(55+i*8), 0);
                emitter.rotation.z = angle;
                ringMesh.add(emitter);
            }
            
            coreGroup.add(ringMesh);
            meshes.containmentRings.push({ 
                mesh: ringMesh, 
                axis: i%2===0 ? new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,1).normalize(), 
                speed: 0.5 + i*0.2 
            });
        }

        coreGroup.position.set(x, y, z);
        return coreGroup;
    }

    // 5. Ethereal Extraction Beams
    function createExtractionBeams(x, y, z) {
        const beamGroup = new THREE.Group();
        meshes.beams = [];

        // 8 massive vertical beams
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const radius = 30;
            const beamGeom = new THREE.CylinderGeometry(4, 4, 150, 32);
            beamGeom.translate(0, 75, 0); // origin at base
            const beam = new THREE.Mesh(beamGeom, etherealBeamMat);
            
            beam.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            
            // Base emitter nozzle
            const nozzleGeom = new THREE.CylinderGeometry(8, 12, 10, 16);
            const nozzle = new THREE.Mesh(nozzleGeom, steel);
            nozzle.position.set(Math.cos(angle)*radius, 5, Math.sin(angle)*radius);
            
            beamGroup.add(beam);
            beamGroup.add(nozzle);
            
            meshes.beams.push({ mesh: beam, phase: i * Math.PI/4 });
        }

        beamGroup.position.set(x, y, z);
        return beamGroup;
    }

    // 6. Complex Exhaust Stacks
    function createExhaustStacks(x, y, z) {
        const exhaustGroup = new THREE.Group();
        const stackGeom = new THREE.CylinderGeometry(5, 7, 40, 16);
        stackGeom.translate(0, 20, 0);

        const capGeom = new THREE.TorusGeometry(6, 1.5, 16, 32);
        capGeom.rotateX(Math.PI/2);

        for (let i = 0; i < 4; i++) {
            const xPos = (i < 2 ? 1 : -1) * 15;
            const zPos = (i % 2 === 0 ? 1 : -1) * 30;

            const stack = new THREE.Mesh(stackGeom, darkSteel);
            stack.position.set(xPos, 0, zPos);
            exhaustGroup.add(stack);

            const cap = new THREE.Mesh(capGeom, chrome);
            cap.position.set(xPos, 40, zPos);
            exhaustGroup.add(cap);

            // Exhaust Grille
            const grilleGeom = new THREE.CylinderGeometry(4.5, 4.5, 1, 16);
            const grille = new THREE.Mesh(grilleGeom, neonOrange);
            grille.position.set(xPos, 39.5, zPos);
            exhaustGroup.add(grille);
        }
        
        exhaustGroup.position.set(x, y, z);
        return exhaustGroup;
    }

    // 7. Base Chassis / Lathe / Extrude Platform
    function createMainChassis(x, y, z) {
        const chassisGroup = new THREE.Group();

        // Massive central hull
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-60, -40);
        hullShape.lineTo(60, -40);
        hullShape.lineTo(80, 0);
        hullShape.lineTo(60, 40);
        hullShape.lineTo(-60, 40);
        hullShape.lineTo(-80, 0);
        hullShape.lineTo(-60, -40);

        const extrudeSettings = { depth: 25, bevelEnabled: true, bevelSegments: 8, steps: 4, bevelSize: 4, bevelThickness: 4 };
        const hullGeom = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        const hullMesh = new THREE.Mesh(hullGeom, darkSteel);
        hullMesh.rotation.x = Math.PI/2;
        hullMesh.position.y = 25;
        chassisGroup.add(hullMesh);

        // Sub-plating details
        const plateGeom = new THREE.BoxGeometry(100, 5, 60);
        const plateMesh = new THREE.Mesh(plateGeom, steel);
        plateMesh.position.set(0, 30, 0);
        chassisGroup.add(plateMesh);

        // Side armor skirts
        const skirtGeom = new THREE.BoxGeometry(140, 15, 5);
        const skirtLeft = new THREE.Mesh(skirtGeom, darkSteel);
        skirtLeft.position.set(0, 15, 45);
        chassisGroup.add(skirtLeft);

        const skirtRight = new THREE.Mesh(skirtGeom, darkSteel);
        skirtRight.position.set(0, 15, -45);
        chassisGroup.add(skirtRight);
        
        // Massive Reactor Mounting Ring
        const mountGeom = new THREE.TorusGeometry(35, 4, 32, 64);
        mountGeom.rotateX(Math.PI/2);
        const mountMesh = new THREE.Mesh(mountGeom, chrome);
        mountMesh.position.set(-20, 32, 0);
        chassisGroup.add(mountMesh);

        chassisGroup.position.set(x, y, z);
        return chassisGroup;
    }

    // 8. Complex Tube Geometry generation for hydraulic and cooling lines
    function createPipingNetwork(chassisGroup) {
        const pipePoints = [
            // Line 1
            [ new THREE.Vector3(-40, 35, 10), new THREE.Vector3(-40, 45, 15), new THREE.Vector3(-20, 50, 20), new THREE.Vector3(0, 50, 25), new THREE.Vector3(20, 40, 30), new THREE.Vector3(40, 30, 35) ],
            // Line 2
            [ new THREE.Vector3(-40, 35, -10), new THREE.Vector3(-40, 45, -15), new THREE.Vector3(-20, 50, -20), new THREE.Vector3(0, 50, -25), new THREE.Vector3(20, 40, -30), new THREE.Vector3(40, 30, -35) ],
            // Line 3
            [ new THREE.Vector3(-20, 32, 0), new THREE.Vector3(-20, 60, 0), new THREE.Vector3(-10, 80, 10), new THREE.Vector3(0, 90, 20), new THREE.Vector3(20, 80, 30) ],
            // Line 4
            [ new THREE.Vector3(-20, 32, 0), new THREE.Vector3(-20, 60, 0), new THREE.Vector3(-10, 80, -10), new THREE.Vector3(0, 90, -20), new THREE.Vector3(20, 80, -30) ],
            // Line 5 (Wrap around core)
            [ new THREE.Vector3(-60, 30, 35), new THREE.Vector3(-70, 40, 20), new THREE.Vector3(-75, 40, 0), new THREE.Vector3(-70, 40, -20), new THREE.Vector3(-60, 30, -35) ],
            // Line 6
            [ new THREE.Vector3(60, 30, 35), new THREE.Vector3(70, 40, 20), new THREE.Vector3(75, 40, 0), new THREE.Vector3(70, 40, -20), new THREE.Vector3(60, 30, -35) ]
        ];

        pipePoints.forEach((pts, idx) => {
            const curve = new THREE.CatmullRomCurve3(pts);
            // Thick pipes and thin cables
            const radius = idx > 3 ? 1.5 : 2.5; 
            const tubeGeom = new THREE.TubeGeometry(curve, 64, radius, 16, false);
            // Alternate materials
            const mat = idx % 2 === 0 ? copper : rubber;
            const tubeMesh = new THREE.Mesh(tubeGeom, mat);
            chassisGroup.add(tubeMesh);
        });

        // Add 20 more random small detail cables around the mount
        for(let i=0; i<20; i++) {
            const startAngle = Math.random() * Math.PI * 2;
            const endAngle = startAngle + Math.PI/2;
            const pts = [
                new THREE.Vector3(-20 + Math.cos(startAngle)*35, 32, Math.sin(startAngle)*35),
                new THREE.Vector3(-20 + Math.cos(startAngle)*40, 38, Math.sin(startAngle)*40),
                new THREE.Vector3(-20 + Math.cos(endAngle)*40, 38, Math.sin(endAngle)*40),
                new THREE.Vector3(-20 + Math.cos(endAngle)*35, 32, Math.sin(endAngle)*35)
            ];
            const curve = new THREE.CatmullRomCurve3(pts);
            const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.5, 8, false);
            const tubeMesh = new THREE.Mesh(tubeGeom, plastic);
            chassisGroup.add(tubeMesh);
        }
    }


    // ============================================================================
    // MESH INSTANTIATION & ASSEMBLY
    // ============================================================================
    
    // 1. Build Chassis
    const chassis = createMainChassis(0, 0, 0);
    group.add(chassis);
    
    // 2. Build Piping Network onto Chassis
    createPipingNetwork(chassis);

    // 3. Mount Massive Tesseract Time Crystal Core at the rear (-20, y, 0)
    const core = createTimeCrystalCore(-20, 100, 0);
    group.add(core);

    // 4. Mount Extraction Beams around the Core
    const beams = createExtractionBeams(-20, 30, 0);
    group.add(beams);

    // 5. Mount Exhaust Stacks behind the core
    const exhausts = createExhaustStacks(-70, 30, 0);
    group.add(exhausts);

    // 6. Mount Operator Cabin at the front (60, 35, 0)
    const cabin = createCabin(50, 35, 0);
    group.add(cabin);

    // 7. Assemble 12-Wheel Drive System (6 wheels per side)
    const wheels = [];
    meshes.tires = [];
    const wheelZ = 55;
    const startX = 65;
    const spacing = 26;

    for (let i = 0; i < 6; i++) {
        // Right side
        const wheelR = createWheel(startX - i*spacing, 18, wheelZ, 1.0);
        group.add(wheelR);
        wheels.push(wheelR);
        meshes.tires.push(wheelR);

        // Left side
        const wheelL = createWheel(startX - i*spacing, 18, -wheelZ, 1.0);
        wheelL.rotation.y = Math.PI; // flip
        group.add(wheelL);
        wheels.push(wheelL);
        meshes.tires.push(wheelL);
        
        // Add Suspension Pistons for each wheel
        const pistonR = createHydraulicPiston(25, 2.5, startX - i*spacing, 25, wheelZ - 8, 0, 0, Math.PI/8);
        group.add(pistonR);
        
        const pistonL = createHydraulicPiston(25, 2.5, startX - i*spacing, 25, -wheelZ + 8, 0, 0, -Math.PI/8);
        group.add(pistonL);
    }

    // 8. Dimensional Anchor Pins (Massive ground stakes)
    const anchorGeom = new THREE.CylinderGeometry(2, 6, 40, 16);
    anchorGeom.translate(0, -20, 0);
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    
    meshes.anchors = [];
    const anchorPositions = [
        {x: 75, z: 65}, {x: 75, z: -65},
        {x: -75, z: 65}, {x: -75, z: -65}
    ];
    
    anchorPositions.forEach(pos => {
        const anchor = new THREE.Mesh(anchorGeom, anchorMat);
        anchor.position.set(pos.x, 30, pos.z);
        group.add(anchor);
        meshes.anchors.push({ mesh: anchor, phase: Math.random() * Math.PI * 2 });
    });


    // ============================================================================
    // PARTS METADATA ARRAY
    // ============================================================================
    parts.push({
        name: "God-Tier Tesseract Time Crystal",
        description: "A macroscopic, continually shifting lattice operating in a Floquet phase. Breaks discrete time-translation symmetry to generate infinite periodic driving force.",
        material: "Hyper-Ionized Crystalline Lattice with Ethereal Emissivity",
        function: "Serves as the perpetual energy source. Oscillates endlessly without energy dissipation due to many-body localization.",
        assemblyOrder: 1,
        connections: ["Containment Rings", "Extraction Beams", "Main Power Conduits"],
        failureEffect: "Spontaneous unravelling of local spacetime causing localized backwards temporal skips.",
        cascadeFailures: ["Chronal Singularity", "Causality Inversion", "Tachyon Burst"],
        originalPosition: {x: -20, y: 100, z: 0},
        explodedPosition: {x: -20, y: 300, z: 0}
    });

    parts.push({
        name: "Temporal Containment Field Rings",
        description: "Five massive toroidal superconducting magnets intersecting at non-Euclidean angles to bind the time crystal's reality phase.",
        material: "Dark Steel with Neon Orange Tachyon Emitters",
        function: "Prevents the time crystal from phasing into a higher-dimensional bulk space by exerting constant gravimetric pressure.",
        assemblyOrder: 2,
        connections: ["Time Crystal", "Chassis Mount"],
        failureEffect: "The time crystal slips into the 4th dimension, vanishing from standard observable reality.",
        cascadeFailures: ["Total System Depowering", "Dimensional Fracture"],
        originalPosition: {x: -20, y: 100, z: 0},
        explodedPosition: {x: -150, y: 100, z: 0}
    });

    parts.push({
        name: "Ethereal Extraction Beams",
        description: "Intense columns of zero-point energy siphoning the sub-harmonic frequency of the time crystal into usable macroscopic mechanical force.",
        material: "Ethereal Plasma Matrix (Additive Blending)",
        function: "Converts the crystal's temporal momentum into raw electrical plasma.",
        assemblyOrder: 3,
        connections: ["Time Crystal", "Power Conduits", "Base Emitters"],
        failureEffect: "Energy leaks causing rapid localized aging of the surrounding hull.",
        cascadeFailures: ["Hull Oxidation", "Suspension Collapse"],
        originalPosition: {x: -20, y: 30, z: 0},
        explodedPosition: {x: -20, y: -100, z: 0}
    });

    parts.push({
        name: "Heavy Crawler Chassis",
        description: "A massive, deeply armored mobile platform designed to transport the reactor across hostile alien or unstable-reality terrains.",
        material: "Depleted Uranium-Reinforced Dark Steel",
        function: "Provides the physical foundation and shielding for the temporal reactions occurring above.",
        assemblyOrder: 4,
        connections: ["All Subsystems", "Suspension", "Operator Cabin"],
        failureEffect: "Structural shearing due to immense temporal torque.",
        cascadeFailures: ["Reactor Misalignment", "Complete Annihilation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -200, z: 0}
    });

    parts.push({
        name: "12-Wheel All-Terrain Drive System",
        description: "Massive aggressive-tread off-road tires capable of gripping terrain even when local gravity shifts due to reactor output.",
        material: "Synthetic Graphene-Rubber and Chrome Rims",
        function: "Mobility and kinetic grounding.",
        assemblyOrder: 5,
        connections: ["Suspension Pistons", "Transmission Axes"],
        failureEffect: "Loss of mobility, bogging down in soft spacetime.",
        cascadeFailures: ["Anchor Overload"],
        originalPosition: {x: 0, y: 18, z: 55},
        explodedPosition: {x: 0, y: 18, z: 150}
    });

    parts.push({
        name: "Hydraulic Chrono-Stabilization Actuators",
        description: "Adaptive pistons that micro-adjust their length in anticipation of terrain, using signals sent slightly backwards in time from the core.",
        material: "Chrome rods and Dark Steel housings",
        function: "Keeps the massive reactor core perfectly level to avoid asymmetric chronal torque.",
        assemblyOrder: 6,
        connections: ["Wheels", "Chassis"],
        failureEffect: "Asymmetric reactor loading leading to a catastrophic chronal tilt.",
        cascadeFailures: ["Core Breach", "Tire Blowouts"],
        originalPosition: {x: 65, y: 25, z: 47},
        explodedPosition: {x: 100, y: 25, z: 100}
    });

    parts.push({
        name: "Operator Control Nexus",
        description: "Forward command pod with heavy tinted shielding, dual joystick controls, and biometric interfaces to isolate the driver from chronal sickness.",
        material: "Steel, Tinted Glass, Glowing Dashboards",
        function: "Human-machine interface for navigating and throttling the reactor's output.",
        assemblyOrder: 7,
        connections: ["Chassis front", "Data cables"],
        failureEffect: "Operator experiences localized time dilation, freezing them mid-action for decades.",
        cascadeFailures: ["Uncontrolled Reactor Ramp-Up"],
        originalPosition: {x: 50, y: 35, z: 0},
        explodedPosition: {x: 150, y: 35, z: 0}
    });

    parts.push({
        name: "Tachyon Exhaust Stacks",
        description: "Four massive chimneys that vent waste probability and tachyon buildup away from the reactor core.",
        material: "Dark Steel with Chrome Caps and Neon Grilles",
        function: "Prevents probability cascades by burning off impossible futures as neon-orange exhaust.",
        assemblyOrder: 8,
        connections: ["Chassis rear", "Cooling networks"],
        failureEffect: "Build up of impossible futures causing localized reality to splinter into multiple contradictory timelines.",
        cascadeFailures: ["Paradox Meltdown"],
        originalPosition: {x: -70, y: 30, z: 0},
        explodedPosition: {x: -200, y: 30, z: 0}
    });

    parts.push({
        name: "Main Power Conduits (Catmull-Rom Network)",
        description: "Thick woven cables mapping complex splines across the hull to distribute raw zero-point energy.",
        material: "Copper and Synthetic Rubber",
        function: "Carries power from the extraction beams to the drive system and life support.",
        assemblyOrder: 9,
        connections: ["Core Mount", "Chassis Bulkheads", "Cabin"],
        failureEffect: "Massive arcing of temporal energy, vaporizing nearby matter and sending the atoms back to the Big Bang.",
        cascadeFailures: ["Total Power Loss"],
        originalPosition: {x: -20, y: 50, z: 20},
        explodedPosition: {x: -20, y: 150, z: 100}
    });

    parts.push({
        name: "Dimensional Anchor Pins",
        description: "Massive ground stakes that continually drive up and down, piercing the spatial crust to lock the reactor into the current 3D universe.",
        material: "Tungsten-Carbide (Dark Metal)",
        function: "Prevents the entire crawler from phasing out of existence when reactor load exceeds 100%.",
        assemblyOrder: 10,
        connections: ["Chassis outer corners"],
        failureEffect: "The machine becomes ethereal, passing through the planet's crust and falling to the core.",
        cascadeFailures: ["Total Loss of Asset"],
        originalPosition: {x: 75, y: 30, z: 65},
        explodedPosition: {x: 150, y: 100, z: 150}
    });

    // We have 10 highly detailed parts, adding 5 more to meet requirements.
    parts.push({
        name: "Ethereal Echo Matrices",
        description: "Ghostly wireframe projections of the time crystal that exist exactly 3 seconds in the past and future.",
        material: "GhostWire (Cyan Emissive)",
        function: "Acts as a chronal buffer, absorbing sudden spikes in temporal drag.",
        assemblyOrder: 11,
        connections: ["Time Crystal Core"],
        failureEffect: "Past and future states collapse into the present, shattering the crystal.",
        cascadeFailures: ["Chronal Singularity"],
        originalPosition: {x: -20, y: 100, z: 0},
        explodedPosition: {x: -20, y: 400, z: 0}
    });

    parts.push({
        name: "Phase-Shifting Transmission",
        description: "A gearbox that doesn't just change mechanical ratios, but alters the rate at which time passes for the wheels relative to the chassis.",
        material: "Hardened Steel",
        function: "Allows the massive crawler to travel at relativistic speeds from an outside observer's perspective.",
        assemblyOrder: 12,
        connections: ["Wheels", "Chassis interior"],
        failureEffect: "Transmission locks, causing the wheels to spin at infinite speed and instantly melt.",
        cascadeFailures: ["Loss of Mobility", "Friction Fire"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 20, z: -150}
    });

    parts.push({
        name: "Paradox Resolution Chamber",
        description: "A heavily shielded box containing a Schrödinger's cat state, constantly collapsing wave functions to maintain a single timeline.",
        material: "Lead-Lined Steel",
        function: "Computes and discards timeline paradoxes generated by the reactor.",
        assemblyOrder: 13,
        connections: ["Chassis Deck", "Data Cables"],
        failureEffect: "Operator suddenly realizes they were never born.",
        cascadeFailures: ["Existential Collapse"],
        originalPosition: {x: 30, y: 40, z: 0},
        explodedPosition: {x: 30, y: 150, z: 0}
    });

    parts.push({
        name: "Roof Mounted Climate & Timeline AC",
        description: "Industrial cooling unit that ensures the operator cabin remains at exactly 21°C and firmly rooted in the 21st century.",
        material: "Aluminum and Steel",
        function: "Life support and timeline tethering for the pilot.",
        assemblyOrder: 14,
        connections: ["Cabin Roof"],
        failureEffect: "Cabin temperature spikes, and local time shifts to the Jurassic era.",
        cascadeFailures: ["Dinosaur Attack"],
        originalPosition: {x: 50, y: 62, z: 0},
        explodedPosition: {x: 50, y: 150, z: 0}
    });

    parts.push({
        name: "Braking Rotors and Calipers",
        description: "Massive disc brakes designed to halt a 4,000-ton machine moving across multiple dimensions.",
        material: "Carbon-Ceramic and Painted Plastic",
        function: "Kinetic stopping power.",
        assemblyOrder: 15,
        connections: ["Wheels", "Transmission"],
        failureEffect: "Inability to stop, eventually crashing into the edge of the universe.",
        cascadeFailures: ["Universal Heat Death"],
        originalPosition: {x: 65, y: 18, z: 51.5},
        explodedPosition: {x: 65, y: 18, z: 120}
    });

    // ============================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of Floquet systems, what specific fundamental symmetry is spontaneously broken by the Time Crystal core?",
            options: [
                "Continuous Time Translation Symmetry",
                "Discrete Time Translation Symmetry",
                "Spatial Parity Symmetry",
                "U(1) Gauge Symmetry"
            ],
            correctAnswer: 1,
            explanation: "A Floquet system is periodically driven, which already breaks continuous time translation symmetry down to a discrete one. A time crystal then spontaneously breaks this *discrete* symmetry, exhibiting robust oscillations at a sub-harmonic (e.g., twice the period) of the driving force."
        },
        {
            question: "Why is Many-Body Localization (MBL) crucial for the stability of this Time Crystal reactor in an interacting quantum spin system?",
            options: [
                "It accelerates the tachyon exhaust velocity.",
                "It perfectly aligns the magnetic dipoles with the Earth's core.",
                "It prevents the system from absorbing energy from the periodic drive and heating up to a featureless infinite-temperature state.",
                "It enables the wheels to grip non-Euclidean terrain."
            ],
            correctAnswer: 2,
            explanation: "According to the Eigenstate Thermalization Hypothesis (ETH), a driven interacting system will eventually thermalize to infinite temperature. MBL breaks ergodicity, preventing the system from absorbing energy and allowing the time crystalline phase to persist indefinitely."
        },
        {
            question: "If the Temporal Containment Rings fail and the system thermalizes due to coupling with a Markovian bath, what happens to the core?",
            options: [
                "It explodes with the force of a supernova.",
                "The time crystalline phase melts into a trivial, synchronized thermal state with the drive.",
                "It freezes time completely in a 10km radius.",
                "It reverses time continuously until the Big Bang."
            ],
            correctAnswer: 1,
            explanation: "Coupling to a thermal bath destroys phase coherence and ergodicity breaking (like MBL). Without these, the robust sub-harmonic oscillations decohere, and the system trivializes, synchronizing with the external drive without breaking any symmetry."
        },
        {
            question: "What is the defining observable signature of the Tesseract Time Crystal during normal operation?",
            options: [
                "A continuous emission of Hawking radiation.",
                "Robust sub-harmonic oscillations in a macroscopic observable that persist indefinitely and resist small perturbations.",
                "Perfect zero electrical resistance at room temperature.",
                "A spatial crystalline lattice that shifts by exactly one angstrom per second."
            ],
            correctAnswer: 1,
            explanation: "The hallmark of a discrete time crystal is a response at a fraction of the driving frequency (e.g., period-doubling) that is robust against imperfections in the drive (rigidity), indicating a true extended quantum phase of matter."
        },
        {
            question: "How does the Eigenstate Thermalization Hypothesis (ETH) fundamentally conflict with the existence of Time Crystals in standard ergodic systems?",
            options: [
                "ETH implies that interacting driven systems will inevitably thermalize, destroying long-range order in time.",
                "ETH forbids the existence of crystalline structures in dimensions higher than 3.",
                "ETH states that time is an illusion, therefore crystals cannot exist in it.",
                "ETH requires all energy states to be degenerate, preventing oscillations."
            ],
            correctAnswer: 0,
            explanation: "ETH posits that local observables in interacting systems will eventually look thermal. A driven system will thus heat up to an infinite temperature state where all order (including time-crystalline order) is washed out. Thus, avoiding ETH (e.g., via MBL or prethermalization) is necessary for time crystals."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    function animate(time, speed, meshes) {
        // 1. Tesseract Core Animations - Non-Euclidean complex rotations
        if (meshes.tesseracts) {
            meshes.tesseracts.forEach((tData, index) => {
                // Rotate around a complex axis
                tData.mesh.rotateOnAxis(tData.axis, tData.speed * speed * 0.02);
                
                // Pulsate scale based on time and index for a breathing fractal effect
                const scaleOsc = tData.baseScale + Math.sin(time * tData.pulseSpeed * speed) * 0.15;
                tData.mesh.scale.set(scaleOsc, scaleOsc, scaleOsc);
                
                // Shift emissive color dynamically
                if (tData.mesh.material.emissive) {
                    const r = (Math.sin(time * speed + index) + 1) * 0.5;
                    const b = (Math.cos(time * speed * 1.5 - index) + 1) * 0.5;
                    tData.mesh.material.emissive.setRGB(r, 0, b);
                }
            });
        }

        // 2. Orbiting Ethereal Crystal Nodes
        if (meshes.crystalNodes) {
            meshes.crystalNodes.forEach((node) => {
                const currentAngle = node.phase + (time * node.speed * speed * 0.5);
                node.mesh.position.x = Math.cos(currentAngle) * node.radius;
                node.mesh.position.z = Math.sin(currentAngle) * node.radius;
                
                // Float up and down non-linearly
                node.mesh.position.y = node.baseY + Math.sin(time * speed * 2.0 + node.phase) * 15;
                
                // Spin erratically
                node.mesh.rotation.x += 0.05 * speed;
                node.mesh.rotation.y += 0.07 * speed;
            });
        }

        // 3. Containment Rings
        if (meshes.containmentRings) {
            meshes.containmentRings.forEach((ring) => {
                // Gimbal lock style erratic shifting
                ring.mesh.rotateOnAxis(ring.axis, ring.speed * speed * 0.03);
            });
        }

        // 4. Extraction Beams Pulsing
        if (meshes.beams) {
            meshes.beams.forEach((beamData) => {
                // Pulse opacity and scale to simulate energy draw
                const intensity = (Math.sin(time * speed * 4.0 + beamData.phase) + 1) * 0.5;
                beamData.mesh.scale.set(1.0 + intensity*0.5, 1.0, 1.0 + intensity*0.5);
                beamData.mesh.material.opacity = 0.2 + (intensity * 0.3);
            });
        }

        // 5. Massive Tires Rotating (Driving forward)
        if (meshes.tires) {
            meshes.tires.forEach((tire) => {
                // If the tire is on the left side (rotated Math.PI), we need to rotate X in the correct local direction
                tire.rotation.z -= speed * 0.05; // Spin around Z axis relative to local wheel group
            });
        }

        // 6. Dimensional Anchors Pounding
        if (meshes.anchors) {
            meshes.anchors.forEach((anchor) => {
                // Rapid pounding motion into the ground
                const pound = Math.abs(Math.sin(time * speed * 3.0 + anchor.phase));
                anchor.mesh.position.y = 30 - (pound * 10);
            });
        }
    }

    return {
        group,
        parts,
        description: "God-Tier Tesseract Time Crystal Reactor - An infinitely complex mobile platform driven by discrete time translation symmetry breaking.",
        quizQuestions,
        animate
    };
}
