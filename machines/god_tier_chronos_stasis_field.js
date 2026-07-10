import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        wheels: [],
        pistons: [],
        dummy: new THREE.Object3D(),
        matrix: new THREE.Matrix4()
    };

    // -------------------------------------------------------------------------
    // HYPER-REALISTIC CUSTOM MATERIALS
    // -------------------------------------------------------------------------
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x00aaff, emissiveIntensity: 3.5, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x6600ff, emissive: 0x8800ff, emissiveIntensity: 4.0, side: THREE.DoubleSide });
    const starCoreMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 6.0, wireframe: false, roughness: 0.2, metalness: 0.8 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xffbb00, emissive: 0xff6600, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, flatShading: true });
    const holographicMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0, transparent: true, opacity: 0.2, wireframe: true });
    const darkAlloy = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.9 });
    const cautionStripes = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.5, metalness: 0.5 }); // Simulated with yellow

    // -------------------------------------------------------------------------
    // PART 1: GOD-TIER MOBILE CONTAINMENT CHASSIS
    // -------------------------------------------------------------------------
    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = -250;
    
    // Complex Extruded Shape for Main Body
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-200, -100);
    chassisShape.lineTo(200, -100);
    chassisShape.lineTo(250, -50);
    chassisShape.lineTo(250, 50);
    chassisShape.lineTo(200, 100);
    chassisShape.lineTo(-200, 100);
    chassisShape.lineTo(-250, 50);
    chassisShape.lineTo(-250, -50);
    chassisShape.closePath();
    
    const chassisExtrude = { depth: 80, bevelEnabled: true, bevelSegments: 8, steps: 4, bevelSize: 5, bevelThickness: 5 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrude);
    const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.z = -40; // Center the depth
    chassisGroup.add(chassisMesh);

    // Chassis Details: Vents, Grilles, Extruded Panels
    const ventGeo = new THREE.BoxGeometry(40, 10, 10);
    for (let i = -150; i <= 150; i += 50) {
        const vent = new THREE.Mesh(ventGeo, chrome);
        vent.position.set(i, 40, -105);
        chassisGroup.add(vent);
        
        const vent2 = new THREE.Mesh(ventGeo, chrome);
        vent2.position.set(i, 40, 105);
        chassisGroup.add(vent2);
    }

    group.add(chassisGroup);
    parts.push({
        name: 'God-Tier Mobile Containment Chassis',
        description: 'A colossal, highly faceted dark steel chassis capable of housing a miniature supernova. Extruded with hyper-complex geometry and reinforced with quantum-locked struts.',
        material: 'Dark Steel, Chrome',
        function: 'Provides absolute structural integrity against relativistic sheer forces.',
        assemblyOrder: 1,
        connections: ['Titan-Class Drive Wheels', 'Hydraulic Suspension Pistons', 'Stasis Field Tracks'],
        failureEffect: 'Chassis crumples under immense gravitational forces, instantly atomizing the surrounding sector.',
        cascadeFailures: ['All subsystems'],
        originalPosition: { x: 0, y: -250, z: 0 },
        explodedPosition: { x: 0, y: -500, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 2: TITAN-CLASS DRIVE WHEELS
    // -------------------------------------------------------------------------
    const wheelsGroup = new THREE.Group();
    const wheelPositions = [
        [-200, -280, 120], [0, -280, 120], [200, -280, 120],
        [-200, -280, -120], [0, -280, -120], [200, -280, -120],
        [-300, -280, 80], [300, -280, 80],
        [-300, -280, -80], [300, -280, -80]
    ];
    
    wheelPositions.forEach((pos, index) => {
        const wheelObj = new THREE.Group();
        
        // Massive Torus Tire
        const tireTorus = new THREE.TorusGeometry(35, 12, 64, 128);
        const tireMesh = new THREE.Mesh(tireTorus, rubber);
        wheelObj.add(tireMesh);
        
        // Hundreds of Extruded BoxGeometry Lugs for Treads
        const treadGeo = new THREE.BoxGeometry(18, 5, 14);
        const numLugs = 80;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const tread = new THREE.Mesh(treadGeo, rubber);
            tread.position.set(Math.cos(angle) * 46, Math.sin(angle) * 46, (i % 2 === 0) ? -4 : 4);
            tread.rotation.z = angle;
            tread.rotation.y = (i % 2 === 0) ? 0.15 : -0.15;
            wheelObj.add(tread);
        }
        
        // Rim: Cylinder with complex Spoke Arrays
        const rimGeo = new THREE.CylinderGeometry(25, 25, 14, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        wheelObj.add(rim);
        
        const spokeGeo = new THREE.CylinderGeometry(2, 2, 50, 32);
        for (let i = 0; i < 12; i++) {
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = (i / 12) * Math.PI;
            wheelObj.add(spoke);
        }
        
        // Glowing Hub Cap
        const hubGeo = new THREE.SphereGeometry(8, 32, 32);
        const hub = new THREE.Mesh(hubGeo, neonBlue);
        hub.scale.z = 0.5;
        hub.position.z = 8;
        wheelObj.add(hub);
        
        wheelObj.position.set(pos[0], pos[1], pos[2]);
        if (pos[2] > 0) wheelObj.rotation.y = Math.PI; // Face outwards
        
        wheelsGroup.add(wheelObj);
        meshes.wheels.push(wheelObj);
    });
    
    group.add(wheelsGroup);
    parts.push({
        name: 'Titan-Class Drive Wheels',
        description: 'Ten massive toroid-based traction units with hundreds of extruded chronal-lugs, allowing the stasis chassis to traverse temporally unstable terrain. Driven by zero-point motors.',
        material: 'Rubber, Chrome, Neon Emitters',
        function: 'Mobility across shifting timeframes and planetary surfaces.',
        assemblyOrder: 2,
        connections: ['God-Tier Mobile Containment Chassis', 'Hydraulic Suspension Pistons'],
        failureEffect: 'Temporal anchoring fails, causing the chassis to slip into alternative timelines and lose physical traction.',
        cascadeFailures: ['Hydraulic Suspension Pistons'],
        originalPosition: { x: 0, y: -280, z: 0 },
        explodedPosition: { x: 0, y: -600, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 3: HYDRAULIC SUSPENSION & PISTONS
    // -------------------------------------------------------------------------
    const suspensionGroup = new THREE.Group();
    wheelPositions.forEach((pos) => {
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder
        const outerGeo = new THREE.CylinderGeometry(8, 8, 40, 32);
        const outer = new THREE.Mesh(outerGeo, darkSteel);
        outer.position.y = 20;
        pistonGroup.add(outer);
        
        // Inner Cylinder (Moves during animation)
        const innerGeo = new THREE.CylinderGeometry(5, 5, 60, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = 10;
        pistonGroup.add(inner);
        
        // Piston Head
        const headGeo = new THREE.BoxGeometry(16, 10, 16);
        const head = new THREE.Mesh(headGeo, steel);
        head.position.y = 40;
        outer.add(head); // Attach to outer so it stays with chassis
        
        pistonGroup.position.set(pos[0], pos[1] + 35, pos[2]);
        suspensionGroup.add(pistonGroup);
        
        meshes.pistons.push({
            group: pistonGroup,
            inner: inner,
            baseLength: 10
        });
    });
    
    // Add intricate hydraulic tubing using CatmullRomCurve3
    const tubeMat = rubber;
    for (let i = 0; i < 20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3((Math.random()-0.5)*400, -200, (Math.random()-0.5)*200),
            new THREE.Vector3((Math.random()-0.5)*300, -150, (Math.random()-0.5)*150),
            new THREE.Vector3((Math.random()-0.5)*200, -100, (Math.random()-0.5)*100),
            new THREE.Vector3((Math.random()-0.5)*100, -50, (Math.random()-0.5)*50)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 2, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        suspensionGroup.add(tubeMesh);
    }
    
    group.add(suspensionGroup);
    parts.push({
        name: 'Quantum Hydraulic Suspension',
        description: 'Advanced pneumatic stabilization arrays using pressurized liquid-time to dampen explosive relativistic shocks from the supernova core.',
        material: 'Dark Steel, Chrome, Rubber',
        function: 'Shock absorption and gravitational load balancing.',
        assemblyOrder: 3,
        connections: ['Titan-Class Drive Wheels', 'God-Tier Mobile Containment Chassis'],
        failureEffect: 'Vibrational resonance shatters the containment ring tracks.',
        cascadeFailures: ['Containment Ring Tracks', 'Primary Temporal Containment Ring'],
        originalPosition: { x: 0, y: -245, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 400 }
    });

    // -------------------------------------------------------------------------
    // PART 4: OPERATOR CABIN
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -150, 120);
    
    // Cabin Main Body
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(-30, 0);
    cabinShape.lineTo(30, 0);
    cabinShape.lineTo(35, 40);
    cabinShape.lineTo(20, 60);
    cabinShape.lineTo(-20, 60);
    cabinShape.lineTo(-35, 40);
    cabinShape.closePath();
    
    const cabinExtrude = { depth: 50, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, cabinExtrude);
    const cabinMesh = new THREE.Mesh(cabinGeo, steel);
    cabinMesh.position.z = -25;
    cabinGroup.add(cabinMesh);
    
    // Tinted Glass Windows
    const windowGeo = new THREE.PlaneGeometry(36, 18);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 48, 26.5);
    windowMesh.rotation.x = -Math.PI / 8; // Match cabin slope
    cabinGroup.add(windowMesh);
    
    // Detailed Steering Wheel & Joysticks
    const steeringColGeo = new THREE.CylinderGeometry(1, 2, 15, 16);
    const steeringCol = new THREE.Mesh(steeringColGeo, darkSteel);
    steeringCol.position.set(0, 30, 10);
    steeringCol.rotation.x = Math.PI / 4;
    cabinGroup.add(steeringCol);
    
    const steeringWheelGeo = new THREE.TorusGeometry(6, 1, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, rubber);
    steeringWheel.position.set(0, 35, 15);
    steeringWheel.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringWheel);
    
    // Glowing Control Panels
    const panelGeo = new THREE.BoxGeometry(20, 10, 1);
    const panel = new THREE.Mesh(panelGeo, neonBlue);
    panel.position.set(0, 25, 18);
    panel.rotation.x = -Math.PI / 6;
    cabinGroup.add(panel);
    
    // Grilles & Ladders
    const ladderGroup = new THREE.Group();
    const railGeo = new THREE.CylinderGeometry(0.5, 0.5, 80, 16);
    const leftRail = new THREE.Mesh(railGeo, chrome);
    leftRail.position.set(-10, -40, 27);
    const rightRail = new THREE.Mesh(railGeo, chrome);
    rightRail.position.set(10, -40, 27);
    ladderGroup.add(leftRail, rightRail);
    
    const rungGeo = new THREE.CylinderGeometry(0.4, 0.4, 20, 16);
    for (let i = -70; i < 0; i += 10) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.position.set(0, i + 30, 27);
        rung.rotation.z = Math.PI / 2;
        ladderGroup.add(rung);
    }
    cabinGroup.add(ladderGroup);
    
    group.add(cabinGroup);
    parts.push({
        name: 'Relativistic Operator Cabin',
        description: 'Heavily shielded command center featuring tinted chronal-glass, manual override joysticks, complex telemetry screens, and life-support ladders. Impervious to localized time dilation.',
        material: 'Steel, Tinted Glass, Rubber, Chrome, Neon Panels',
        function: 'Houses the human or AI operators managing the temporal containment.',
        assemblyOrder: 4,
        connections: ['God-Tier Mobile Containment Chassis'],
        failureEffect: 'Operators age millions of years in a microsecond due to localized time field collapse.',
        cascadeFailures: ['Chronometric Data Array'],
        originalPosition: { x: 0, y: -150, z: 120 },
        explodedPosition: { x: 0, y: -150, z: 300 }
    });

    // -------------------------------------------------------------------------
    // PART 5: PRIMARY TEMPORAL CONTAINMENT RINGS
    // -------------------------------------------------------------------------
    const ringGroup = new THREE.Group();
    meshes.ring1 = new THREE.Group();
    meshes.ring2 = new THREE.Group();
    meshes.ring3 = new THREE.Group();
    
    // Helper to generate complex rings
    function createComplexRing(radius, tube, mat, numDetails) {
        const rGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(radius, tube, 64, 256);
        const torus = new THREE.Mesh(torusGeo, mat);
        rGroup.add(torus);
        
        // Data Readouts & Extruded Tech Greebles along the ring
        const detailGeo = new THREE.BoxGeometry(tube * 3, tube * 1.5, tube * 3);
        for (let i = 0; i < numDetails; i++) {
            const angle = (i / numDetails) * Math.PI * 2;
            const detail = new THREE.Mesh(detailGeo, (i % 3 === 0) ? neonBlue : chrome);
            detail.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            detail.rotation.z = angle;
            rGroup.add(detail);
            
            // Inner glowing track
            if (i % 2 === 0) {
                const trackGeo = new THREE.CylinderGeometry(tube * 1.1, tube * 1.1, tube * 4, 16);
                const track = new THREE.Mesh(trackGeo, neonPurple);
                track.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
                track.rotation.z = angle;
                track.rotation.x = Math.PI / 2;
                rGroup.add(track);
            }
        }
        return rGroup;
    }
    
    meshes.ring1.add(createComplexRing(600, 20, darkSteel, 60));
    meshes.ring2.add(createComplexRing(650, 15, steel, 90));
    meshes.ring3.add(createComplexRing(700, 10, aluminum, 120));
    
    ringGroup.add(meshes.ring1);
    ringGroup.add(meshes.ring2);
    ringGroup.add(meshes.ring3);
    group.add(ringGroup);
    
    parts.push({
        name: 'Primary Temporal Containment Rings',
        description: 'Three massive, independently rotating Kerr-Newman Torus metrics. Covered in thousands of complex data readouts, tracking the angular momentum of the artificial singularity.',
        material: 'Dark Steel, Steel, Aluminum, Neon Emitters',
        function: 'Generates the macroscopic boundaries of the Alcubierre stasis metric.',
        assemblyOrder: 5,
        connections: ['God-Tier Mobile Containment Chassis', 'Chronometric Data Array'],
        failureEffect: 'Loss of angular momentum causes the stasis field to warp into a localized black hole.',
        cascadeFailures: ['Crystalline Star Cage', 'Supernova Plasma Core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 6: SUPERNOVA PLASMA CORE (FROZEN IN TIME)
    // -------------------------------------------------------------------------
    meshes.starCoreGroup = new THREE.Group();
    
    // The main dying star
    const starGeo = new THREE.SphereGeometry(200, 128, 128);
    // Displace vertices to make it look turbulent and exploding
    const pos = starGeo.attributes.position;
    const vec = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        vec.fromBufferAttribute(pos, i);
        // Complex noise function simulation using math
        const noise = Math.sin(vec.x * 0.05) * Math.cos(vec.y * 0.05) * Math.sin(vec.z * 0.05);
        const noise2 = Math.cos(vec.x * 0.1) * Math.sin(vec.z * 0.1);
        vec.add(vec.clone().normalize().multiplyScalar(noise * 30 + noise2 * 15));
        pos.setXYZ(i, vec.x, vec.y, vec.z);
    }
    starGeo.computeVertexNormals();
    meshes.starCore = new THREE.Mesh(starGeo, starCoreMat);
    meshes.starCoreGroup.add(meshes.starCore);
    
    // Add inner intense core
    const innerCoreGeo = new THREE.SphereGeometry(180, 64, 64);
    const innerCore = new THREE.Mesh(innerCoreGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0 }));
    meshes.starCoreGroup.add(innerCore);
    
    group.add(meshes.starCoreGroup);
    parts.push({
        name: 'Supernova Plasma Core',
        description: 'A stellar mass caught precisely halfway through a Type Ia supernova detonation. Held in perfect slow-motion by the stasis field, its chaotic plasma storms frozen in excruciating detail.',
        material: 'Plasma-state Hydrogen, Custom Emissive Shaders',
        function: 'Serves as the infinite energy source and subject of the temporal experiment.',
        assemblyOrder: 6,
        connections: ['Crystalline Star Cage', 'Time-Dilation Focal Beams'],
        failureEffect: 'The supernova unfreezes, instantly vaporizing the solar system.',
        cascadeFailures: ['Everything'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: 0, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 7: FROZEN PLASMA EJECTA
    // -------------------------------------------------------------------------
    const ejectaGeo = new THREE.TetrahedronGeometry(12, 2);
    // Rough up the tetrahedron
    const ePos = ejectaGeo.attributes.position;
    for (let i = 0; i < ePos.count; i++) {
        vec.fromBufferAttribute(ePos, i);
        vec.add(vec.clone().normalize().multiplyScalar(Math.random() * 5));
        ePos.setXYZ(i, vec.x, vec.y, vec.z);
    }
    ejectaGeo.computeVertexNormals();
    
    const numEjecta = 2500;
    meshes.ejectaInstanced = new THREE.InstancedMesh(ejectaGeo, plasmaMat, numEjecta);
    
    const dMat = new THREE.Matrix4();
    const dObj = new THREE.Object3D();
    
    for (let i = 0; i < numEjecta; i++) {
        const p = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        // Scatter between radius 210 and 550
        const dist = 210 + Math.pow(Math.random(), 2) * 340; 
        p.multiplyScalar(dist);
        
        dObj.position.copy(p);
        dObj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        // Scale randomly to simulate different debris sizes
        const scale = Math.random() * 2.5 + 0.5;
        dObj.scale.set(scale, scale, scale);
        
        dObj.updateMatrix();
        meshes.ejectaInstanced.setMatrixAt(i, dObj.matrix);
    }
    meshes.starCoreGroup.add(meshes.ejectaInstanced);
    
    parts.push({
        name: 'Frozen Plasma Ejecta',
        description: 'Thousands of jagged, hyper-heated plasma fragments expanding outward from the core, locked in temporal stasis. A perfectly preserved chaotic explosion.',
        material: 'Translucent Plasma Material',
        function: 'Kinetic and thermal energy bleeding off the main core, captured for study.',
        assemblyOrder: 7,
        connections: ['Supernova Plasma Core'],
        failureEffect: 'Ejecta resumes its relativistic velocity, shredding the containment rings like shrapnel.',
        cascadeFailures: ['Primary Temporal Containment Rings'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 800, y: 0, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 8: CRYSTALLINE STAR CAGE
    // -------------------------------------------------------------------------
    meshes.cageGroup = new THREE.Group();
    
    // Icosahedron logic
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const vertices = [
        [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
        [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
        [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
    ];
    
    const cageScale = 450;
    const cageNodes = vertices.map(v => new THREE.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(cageScale));
    
    // Edges calculation
    const edges = [];
    for (let i = 0; i < cageNodes.length; i++) {
        for (let j = i + 1; j < cageNodes.length; j++) {
            if (cageNodes[i].distanceTo(cageNodes[j]) < cageScale * 1.1) {
                edges.push([cageNodes[i], cageNodes[j]]);
            }
        }
    }
    
    // Create thick glowing tubes for edges
    edges.forEach(edge => {
        const curve = new THREE.LineCurve3(edge[0], edge[1]);
        const tubeGeo = new THREE.TubeGeometry(curve, 16, 8, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, holographicMat);
        meshes.cageGroup.add(tubeMesh);
        
        // Inner opaque core of the tube
        const innerTubeGeo = new THREE.TubeGeometry(curve, 16, 4, 16, false);
        const innerTubeMesh = new THREE.Mesh(innerTubeGeo, glass);
        meshes.cageGroup.add(innerTubeMesh);
    });
    
    // Create Massive Hubs at vertices
    const hubGeo = new THREE.DodecahedronGeometry(25, 1);
    cageNodes.forEach(node => {
        const hubMesh = new THREE.Mesh(hubGeo, darkSteel);
        hubMesh.position.copy(node);
        
        // Add intricate ring around hub
        const hubRingGeo = new THREE.TorusGeometry(35, 3, 16, 64);
        const hubRing = new THREE.Mesh(hubRingGeo, neonBlue);
        hubRing.rotation.x = Math.random() * Math.PI;
        hubRing.rotation.y = Math.random() * Math.PI;
        hubMesh.add(hubRing);
        
        meshes.cageGroup.add(hubMesh);
    });
    
    group.add(meshes.cageGroup);
    parts.push({
        name: 'Crystalline Star Cage',
        description: 'A massive icosahedron matrix constructed from solidified light and hyper-glass struts. Houses the supernova core and directs the chronal field.',
        material: 'Holographic Plasma, Hyper-Glass, Dark Steel',
        function: 'Spatial confinement of the expanding stellar mass.',
        assemblyOrder: 8,
        connections: ['Supernova Plasma Core', 'Time-Dilation Focal Beams'],
        failureEffect: 'Cage shatters, releasing the spatial constraint on the supernova.',
        cascadeFailures: ['Primary Temporal Containment Rings'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 800 }
    });

    // -------------------------------------------------------------------------
    // PART 9 & 10: STASIS EMITTERS AND TIME-DILATION BEAMS (INSTANCED)
    // -------------------------------------------------------------------------
    const numEmitters = 1200;
    const emitterRadius = 550;
    
    // Highly Detailed Emitter Body using LatheGeometry
    const lathePoints = [];
    for (let i = 0; i <= 20; i++) {
        // Complex oscillating profile
        const r = 5 + Math.sin(i * 0.5) * 3 + (i === 0 || i === 20 ? 4 : 0);
        lathePoints.push(new THREE.Vector2(r, i * 2));
    }
    const emitterBaseGeo = new THREE.LatheGeometry(lathePoints, 32);
    // Translate so the base is at origin, pointing along Y
    emitterBaseGeo.translate(0, -20, 0); 
    
    // Beam Geometry: Long Cylinder
    const beamGeo = new THREE.CylinderGeometry(2, 6, emitterRadius - 200, 16);
    beamGeo.translate(0, (emitterRadius - 200) / 2 + 20, 0); // Origin at base, extends upwards
    
    meshes.emitterInstanced = new THREE.InstancedMesh(emitterBaseGeo, chrome, numEmitters);
    meshes.beamInstanced = new THREE.InstancedMesh(beamGeo, neonPurple, numEmitters);
    
    const offset = 2 / numEmitters;
    const increment = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    const targetVec = new THREE.Vector3(0, 0, 0);
    const m = new THREE.Matrix4();
    
    for (let i = 0; i < numEmitters; i++) {
        const y = ((i * offset) - 1) + (offset / 2);
        const r = Math.sqrt(1 - Math.pow(y, 2));
        const phi = ((i + 1) % numEmitters) * increment;
        
        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;
        
        dObj.position.set(x * emitterRadius, y * emitterRadius, z * emitterRadius);
        // Look at center
        dObj.lookAt(targetVec);
        // Cylinder's default alignment is Y, but lookAt points Z towards target.
        // So rotate X by -PI/2 to align Y with Z axis pointing to center.
        dObj.rotateX(-Math.PI / 2);
        
        dObj.updateMatrix();
        
        meshes.emitterInstanced.setMatrixAt(i, dObj.matrix);
        meshes.beamInstanced.setMatrixAt(i, dObj.matrix);
    }
    
    meshes.beamInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    
    group.add(meshes.emitterInstanced);
    group.add(meshes.beamInstanced);
    
    parts.push({
        name: 'Fibonacci Stasis Emitter Array',
        description: '1,200 individual Alpha-class emitters arranged in a perfect golden spiral. These intricately lathed chrome cannons fire concentrated chronotons.',
        material: 'Chrome, Complex Lathed Alloys',
        function: 'Provides the omni-directional time-stopping force.',
        assemblyOrder: 9,
        connections: ['Crystalline Star Cage', 'Primary Temporal Containment Rings'],
        failureEffect: 'Temporal field becomes lopsided, causing time to flow irregularly across the star surface.',
        cascadeFailures: ['Time-Dilation Focal Beams'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -800 }
    });
    
    parts.push({
        name: 'Time-Dilation Focal Beams',
        description: 'Blindingly bright columns of solid neon-purple chronal energy, bridging the emitters to the supernova core. They visually represent the halting of local time.',
        material: 'Pure Chronoton Energy (Neon Purple)',
        function: 'Transmits the stasis effect directly into the quantum states of the plasma.',
        assemblyOrder: 10,
        connections: ['Fibonacci Stasis Emitter Array', 'Supernova Plasma Core'],
        failureEffect: 'Beams scatter, causing random objects in the vicinity to freeze or age rapidly.',
        cascadeFailures: ['Relativistic Operator Cabin'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1000, z: 0 }
    });

    // -------------------------------------------------------------------------
    // PART 11-16: ADDITIONAL HYPER-DETAILED SUBSYSTEMS 
    // -------------------------------------------------------------------------
    
    // Tachyon Emission Lattice
    const latticeGeo = new THREE.TorusKnotGeometry(750, 5, 256, 32, 3, 5);
    const latticeMesh = new THREE.Mesh(latticeGeo, copper);
    meshes.lattice = latticeMesh;
    group.add(latticeMesh);
    parts.push({
        name: 'Tachyon Emission Lattice',
        description: 'A massive, complex Torus Knot woven from pure copper, encompassing the entire machine to capture stray tachyons and prevent causal paradoxes.',
        material: 'Copper',
        function: 'Paradox negation and causal loop buffering.',
        assemblyOrder: 11,
        connections: ['Primary Temporal Containment Rings'],
        failureEffect: 'Grandfather paradoxes spontaneously manifest, deleting operators from existence.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -1000, y: 500, z: 0 }
    });

    // Quantum Entanglement Conduits
    const conduitGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const conduitGeo = new THREE.CylinderGeometry(15, 15, 800, 32);
        const conduit = new THREE.Mesh(conduitGeo, glass);
        
        // Inner glowing core
        const cInnerGeo = new THREE.CylinderGeometry(5, 5, 800, 16);
        const cInner = new THREE.Mesh(cInnerGeo, neonBlue);
        conduit.add(cInner);
        
        conduit.rotation.x = Math.PI / 2;
        conduit.rotation.z = (i / 8) * Math.PI;
        conduitGroup.add(conduit);
    }
    group.add(conduitGroup);
    parts.push({
        name: 'Quantum Entanglement Conduits',
        description: 'Eight massive transparent glass cylinders running through the core, housing high-intensity neon-blue data streams that synchronize the emitters instantaneously.',
        material: 'Hyper-Glass, Neon Blue Plasma',
        function: 'Instantaneous data transfer across the macroscopic structure.',
        assemblyOrder: 12,
        connections: ['Fibonacci Stasis Emitter Array', 'Chronometric Data Array'],
        failureEffect: 'Desynchronization causes microscopic time rips, destroying local spacetime geometry.',
        cascadeFailures: ['Fibonacci Stasis Emitter Array'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1000, y: -500, z: 0 }
    });

    parts.push({
        name: 'Chronometric Data Array',
        description: 'Thousands of micro-extrusions on the primary rings that feed telemetry back to the Operator Cabin via the Quantum Conduits.',
        material: 'Chrome, Emissive Panels',
        function: 'Reads out exact picosecond variances in the stasis field.',
        assemblyOrder: 13,
        connections: ['Primary Temporal Containment Rings', 'Relativistic Operator Cabin'],
        failureEffect: 'Operators lose visibility on the star\'s expansion rate.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 1200 }
    });

    parts.push({
        name: 'Relativistic Heat Sinks',
        description: 'The massive extruded vents located on the Mobile Chassis, designed to bleed off the immense thermal radiation of a frozen star using dimensional shifting.',
        material: 'Chrome',
        function: 'Prevents the chassis from melting into slag.',
        assemblyOrder: 14,
        connections: ['God-Tier Mobile Containment Chassis'],
        failureEffect: 'Chassis reaches Planck temperature, igniting the atmosphere.',
        cascadeFailures: ['God-Tier Mobile Containment Chassis'],
        originalPosition: { x: 0, y: -210, z: 0 },
        explodedPosition: { x: 0, y: -800, z: -800 }
    });

    parts.push({
        name: 'Temporal Feedback Dampeners',
        description: 'The thick opaque inner cores of the Crystalline Cage, which absorb chaotic time-ripples echoing back from the pseudo-event horizon.',
        material: 'Hyper-Glass',
        function: 'Prevents time-echoes from shattering the Crystalline Cage.',
        assemblyOrder: 15,
        connections: ['Crystalline Star Cage'],
        failureEffect: 'Echos compound into a temporal tsunami, reversing time locally in uncontrolled bursts.',
        cascadeFailures: ['Crystalline Star Cage'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: -800, z: 800 }
    });


    // -------------------------------------------------------------------------
    // ANIMATION LOGIC
    // -------------------------------------------------------------------------
    function animate(time, speed, m) {
        const timeFactor = time * 0.5;
        
        // 1. Mobile Chassis Wheels rotate based on speed
        if (m.wheels && m.wheels.length > 0) {
            m.wheels.forEach((wheel, index) => {
                // Alternating rotation for a complex strafing/turning mechanical feel
                wheel.rotation.x -= speed * 0.05 * (index % 2 === 0 ? 1 : -1);
            });
        }

        // 2. Complex nested rotation of the Primary Containment Rings
        if (m.ring1) {
            m.ring1.rotation.x = Math.sin(timeFactor * 0.5) * 0.3;
            m.ring1.rotation.y += speed * 0.005;
        }
        if (m.ring2) {
            m.ring2.rotation.y = Math.cos(timeFactor * 0.3) * 0.4;
            m.ring2.rotation.z -= speed * 0.007;
        }
        if (m.ring3) {
            m.ring3.rotation.x -= speed * 0.008;
            m.ring3.rotation.z = Math.sin(timeFactor * 0.4) * 0.5;
        }

        // 3. Supernova core slowly expanding and pulsating (the "frozen" explosion creeping forward)
        if (m.starCoreGroup) {
            const expansion = 1.0 + (Math.sin(timeFactor * 0.2) * 0.01) + (timeFactor * 0.0001); // Slowly growing over time
            m.starCoreGroup.scale.set(expansion, expansion, expansion);
            m.starCoreGroup.rotation.y += speed * 0.001; // extremely slow rotation
        }

        // 4. Crystalline Cage counter-rotation
        if (m.cageGroup) {
            m.cageGroup.rotation.y -= speed * 0.002;
            m.cageGroup.rotation.x = Math.sin(timeFactor * 0.1) * 0.05;
            m.cageGroup.rotation.z = Math.cos(timeFactor * 0.1) * 0.05;
        }

        // 5. Pulsating Instanced Time-Dilation Beams
        if (m.beamInstanced) {
            for (let i = 0; i < 1200; i++) {
                // Retrieve original matrix
                m.beamInstanced.getMatrixAt(i, m.matrix);
                m.dummy.position.setFromMatrixPosition(m.matrix);
                m.dummy.quaternion.setFromRotationMatrix(m.matrix);
                
                // Calculate dynamic pulse scaling on the X and Z axes (thickness of beam)
                const pulse = (Math.sin(timeFactor * 10 + i * 0.5) * 0.3) + 0.7;
                m.dummy.scale.set(pulse, 1, pulse); // Y is length, keep it 1
                
                m.dummy.updateMatrix();
                m.beamInstanced.setMatrixAt(i, m.dummy.matrix);
            }
            m.beamInstanced.instanceMatrix.needsUpdate = true;
        }

        // 6. Hydraulic Pistons extending and retracting via Sine Waves
        if (m.pistons && m.pistons.length > 0) {
            m.pistons.forEach((piston, i) => {
                const extension = (Math.sin(timeFactor * 3 + i) + 1) / 2; // 0 to 1
                piston.inner.position.y = piston.baseLength + extension * 15;
            });
        }
        
        // 7. Tachyon Lattice erratic spin
        if (m.lattice) {
            m.lattice.rotation.x += speed * 0.02;
            m.lattice.rotation.y -= speed * 0.015;
        }
        
        // 8. Ejecta ultra-slow drift
        if (m.ejectaInstanced) {
            // Because there are 2500, we'll just rotate the whole group slowly to simulate orbital drift
            m.ejectaInstanced.rotation.y += speed * 0.002;
            m.ejectaInstanced.rotation.z -= speed * 0.001;
        }
    }

    // -------------------------------------------------------------------------
    // EXTREMELY DIFFICULT TEMPORAL PHYSICS / RELATIVITY QUIZ
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of stabilizing a mid-supernova event via a Chronos Stasis Field, how must the Alcubierre-derived warp metric be modified to prevent boundary-layer Hawking radiation from blue-shifting into localized singularities?",
            options: [
                "By imposing a negative energy density tensor that scales linearly with the expansion rate.",
                "By decoupling the chronological gradient from the spatial expansion matrix using a Kerr-Newman null-surface.",
                "By phase-conjugating the time-dilation beams with the localized tachyonic field to induce a continuous causal loop.",
                "By increasing the rotational velocity of the containment rings beyond the speed of light."
            ],
            correctAnswer: 2,
            explanation: "Phase-conjugating the time-dilation beams with the tachyonic field creates a self-correcting causal loop, effectively spreading the extreme frequency blue-shift across an infinite pseudo-time axis, safely dissipating the energy before it collapses into a naked singularity."
        },
        {
            question: "Assume the Primary Temporal Containment Rings utilize a Kerr-Newman metric configuration. How does the specific angular momentum (a = J/M) of the emitter array prevent the formation of a naked singularity when the stasis field compresses the stellar core?",
            options: [
                "It maintains the Cauchy horizon exterior to the event horizon, enforcing cosmic censorship.",
                "It violates the strong energy condition, causing gravity to become repulsive at the Planck scale.",
                "It forces the metric signature to transition from (-+++) to (++++) at the boundary layer.",
                "By ensuring that 'a' exceeds 'M', it creates a stable, closed timelike curve ring-singularity that traps the explosive plasma."
            ],
            correctAnswer: 0,
            explanation: "By maintaining a^2 + Q^2 <= M^2, the angular momentum ensures the Cauchy horizon remains strictly exterior to the singularity (if one forms), upholding the weak cosmic censorship conjecture and preventing unpredictable naked singularities from bleeding into the operator's spacetime."
        },
        {
            question: "What is the primary function of the Tachyon Emission Lattice in counteracting the entropy gradient of the supernova's central plasma core?",
            options: [
                "It accelerates the plasma's decay by forcing it into a higher thermodynamic state.",
                "It utilizes retrocausality to absorb waste heat before it is actually generated by the core.",
                "It acts as a Faraday cage for gravitational waves.",
                "It converts standard baryonic matter into strangelets to increase mass-energy density."
            ],
            correctAnswer: 1,
            explanation: "Tachyons travel backward along the temporal axis. The lattice directs them into the core to absorb localized entropic heat and carry it into the past, effectively keeping the core perfectly frozen by negating entropy before it can macroscopically manifest in the present."
        },
        {
            question: "During temporal dilation of a stellar mass, how are the chronal-stabilizer beams (emitted by the Fibonacci Array) phase-conjugated to avoid chaotic resonance in the local spacetime continuum?",
            options: [
                "By utilizing a prime-number harmonic frequency that avoids natural integer resonance with the stellar oscillations.",
                "By aligning them precisely with the gravitational equipotential lines of the supernova.",
                "By applying a Lorentz transformation that shifts their frequency into the imaginary plane.",
                "By modulating their amplitude inversely proportional to the local curvature tensor (Riemann tensor) at the target coordinate."
            ],
            correctAnswer: 3,
            explanation: "By modulating the amplitude of the chronal beams inversely to the Riemann curvature tensor at the point of impact, the beams perfectly cancel out localized spacetime distortions, flattening the metric and avoiding destructive chaotic resonance."
        },
        {
            question: "If the Hydraulic Suspension Pistons fail, causing the Chassis to drop and violently alter the stasis field's spatial coordinates relative to the core, what relativistic effect immediately threatens the Operator Cabin?",
            options: [
                "Frame-dragging (Lense-Thirring effect) tearing the cabin from the chassis.",
                "Unruh radiation incinerating the cabin due to extreme proper acceleration.",
                "Spontaneous pair-production of antimatter inside the tinted glass.",
                "Severe time-dilation causing the operators to experience billions of years of subjective time."
            ],
            correctAnswer: 1,
            explanation: "A sudden drop in the localized extreme-gravity environment of the stasis field would result in an unimaginably high proper acceleration for the chassis as it attempts to re-anchor. According to the Unruh effect, an accelerating observer sees a thermal bath of radiation; at these acceleration scales, Unruh radiation would instantly incinerate the cabin."
        }
    ];

    return { group, parts, meshes, animate, quizQuestions };
}
